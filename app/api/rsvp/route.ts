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

  try {
    await appendRegistrantRow({ name, phone, ageGroup });
  } catch (err) {
    console.error("Failed to append registrant to Google Sheet:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data. Silakan coba lagi." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
