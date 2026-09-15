import { NextResponse, after } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { normalizeIndonesianPhone } from "@/lib/phone";
import { sendWhatsAppMessage } from "@/lib/fonnte";
import { buildThankYouMessage, buildH5TestMessage } from "@/lib/reminder-templates";

// Keeps the serverless function alive long enough for the delayed
// test message below (~60s) plus the immediate send + DB write.
export const maxDuration = 65;

const AGE_GROUPS = [
  "teenagers",
  "uni_students",
  "young_professional",
  "married",
  "golden_age",
] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const ageGroup = typeof body?.ageGroup === "string" ? body.ageGroup.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Nama lengkap wajib diisi." }, { status: 400 });
  }

  if (!ageGroup || !AGE_GROUPS.includes(ageGroup as (typeof AGE_GROUPS)[number])) {
    return NextResponse.json({ error: "Kategori usia wajib dipilih." }, { status: 400 });
  }

  const phone = normalizeIndonesianPhone(rawPhone);
  if (!phone) {
    return NextResponse.json(
      { error: "Nomor WhatsApp tidak valid." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("registrants")
    .upsert({ name, phone, age_group: ageGroup }, { onConflict: "phone" });

  if (error) {
    console.error("Failed to save registrant:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data. Silakan coba lagi." },
      { status: 500 },
    );
  }

  try {
    await sendWhatsAppMessage(phone, buildThankYouMessage(name));
  } catch (err) {
    console.error("Failed to send thank-you WhatsApp message:", err);
  }

  after(async () => {
    await new Promise((resolve) => setTimeout(resolve, 60_000));
    try {
      await sendWhatsAppMessage(phone, buildH5TestMessage(name));
    } catch (err) {
      console.error("Failed to send delayed h-5 test message:", err);
    }
  });

  return NextResponse.json({ ok: true });
}
