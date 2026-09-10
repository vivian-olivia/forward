// Normalizes Indonesian phone numbers to the "62xxxxxxxxxx" format
// expected by WhatsApp send APIs (Fonnte/Wablas). Returns null if the
// input doesn't look like a valid ID mobile number.
export function normalizeIndonesianPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (normalized.startsWith("0")) {
    normalized = "62" + normalized.slice(1);
  } else if (normalized.startsWith("8")) {
    normalized = "62" + normalized;
  }

  if (!normalized.startsWith("62")) return null;
  if (normalized.length < 10 || normalized.length > 15) return null;

  return normalized;
}
