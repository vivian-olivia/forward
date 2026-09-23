import { NextResponse } from "next/server";
import { normalizeIndonesianPhone } from "@/lib/phone";
import { appendRegistrantRow } from "@/lib/google-sheets";

const AGE_GROUPS = [
  "teenagers",
  "uni_students",
  "young_professional",
  "married",
  "golden_age",
] as const;

const PRE_EVENTS = ["midweek_youth_gathering", "parenting_class"] as const;
const BRINGING_CHILDREN_OPTIONS = ["yes", "no"] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const ageGroup = typeof body?.ageGroup === "string" ? body.ageGroup.trim() : "";
  const attendeeCount =
    typeof body?.attendeeCount === "number" && Number.isInteger(body.attendeeCount)
      ? body.attendeeCount
      : 0;
  const preEvents = Array.isArray(body?.preEvents)
    ? body.preEvents.filter(
        (v: unknown): v is string =>
          typeof v === "string" && PRE_EVENTS.includes(v as (typeof PRE_EVENTS)[number]),
      )
    : [];
  const bringingChildren =
    typeof body?.bringingChildren === "string" ? body.bringingChildren.trim() : "";
  const invitedBy = typeof body?.invitedBy === "string" ? body.invitedBy.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Nama lengkap wajib diisi." }, { status: 400 });
  }

  if (!ageGroup || !AGE_GROUPS.includes(ageGroup as (typeof AGE_GROUPS)[number])) {
    return NextResponse.json({ error: "Kategori usia wajib dipilih." }, { status: 400 });
  }

  if (attendeeCount < 1) {
    return NextResponse.json({ error: "Jumlah yang hadir wajib diisi." }, { status: 400 });
  }

  if (
    !bringingChildren ||
    !BRINGING_CHILDREN_OPTIONS.includes(bringingChildren as (typeof BRINGING_CHILDREN_OPTIONS)[number])
  ) {
    return NextResponse.json({ error: "Kolom membawa anak wajib dipilih." }, { status: 400 });
  }

  if (!invitedBy) {
    return NextResponse.json({ error: "Kolom diundang oleh wajib diisi." }, { status: 400 });
  }

  const phone = normalizeIndonesianPhone(rawPhone);
  if (!phone) {
    return NextResponse.json(
      { error: "Nomor WhatsApp tidak valid." },
      { status: 400 },
    );
  }

  try {
    await appendRegistrantRow({
      name,
      phone,
      ageGroup,
      attendeeCount,
      preEvents,
      bringingChildren,
      invitedBy,
    });
  } catch (err) {
    console.error("Failed to append registrant to Google Sheet:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data. Silakan coba lagi." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
