// Indonesian mobile numbers as entered by the user: must start with "08"
// and be 10-13 digits long (e.g. 08123456789).
export function isValidIndonesianPhone(raw: string): boolean {
  const digits = raw.replace(/[^\d]/g, "");
  return /^08\d{8,11}$/.test(digits) && digits.length >= 10 && digits.length <= 13;
}

// Normalizes Indonesian phone numbers to the "62xxxxxxxxxx" format
// expected by WhatsApp send APIs (Fonnte/Wablas). Returns null if the
// input doesn't look like a valid ID mobile number (must start with "08"
// and be 10-13 digits).
export function normalizeIndonesianPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!isValidIndonesianPhone(digits)) return null;

  return "62" + digits.slice(1);
}
