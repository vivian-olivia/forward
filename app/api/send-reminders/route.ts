import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendWhatsAppMessage } from "@/lib/fonnte";
import { REMINDER_MILESTONES } from "@/lib/reminder-templates";
import { EVENT_DATE_ISO } from "@/lib/event";

function daysUntilEvent(): number {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(
    (startOfDay(new Date(EVENT_DATE_ISO)) - startOfDay(new Date())) / msPerDay,
  );
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = daysUntilEvent();
  const milestone = REMINDER_MILESTONES.find((m) => m.daysBefore === days);

  if (!milestone) {
    return NextResponse.json({ ok: true, skipped: true, daysUntilEvent: days });
  }

  const supabase = getSupabaseServerClient();
  const { data: registrants, error } = await supabase
    .from("registrants")
    .select("id, name, phone, reminders_sent");

  if (error) {
    console.error("Failed to load registrants:", error);
    return NextResponse.json({ error: "Failed to load registrants" }, { status: 500 });
  }

  const pending = (registrants ?? []).filter(
    (r) => !(r.reminders_sent ?? []).includes(milestone.key),
  );

  let sent = 0;
  let failed = 0;

  for (const registrant of pending) {
    try {
      await sendWhatsAppMessage(registrant.phone, milestone.message(registrant.name));
      await supabase
        .from("registrants")
        .update({
          reminders_sent: [...(registrant.reminders_sent ?? []), milestone.key],
        })
        .eq("id", registrant.id);
      sent += 1;
    } catch (err) {
      failed += 1;
      console.error(`Reminder failed for ${registrant.phone}:`, err);
      await supabase.from("reminder_log").insert({
        registrant_id: registrant.id,
        milestone: milestone.key,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({ ok: true, milestone: milestone.key, sent, failed });
}
