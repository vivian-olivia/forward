// Thin wrapper around Fonnte's send-message API.
// Docs: https://docs.fonnte.com/
export async function sendWhatsAppMessage(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    throw new Error("Missing FONNTE_TOKEN env var");
  }

  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ target, message }),
  });

  const data = await res.json();
  if (!res.ok || data.status === false) {
    throw new Error(data.reason ?? `Fonnte send failed for ${target}`);
  }

  return data;
}
