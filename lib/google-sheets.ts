// Appends a row to the registrants sheet via a Google Apps Script Web App
// bound to the spreadsheet (no service account / key needed).
//
// Setup:
// 1. Open the spreadsheet -> Extensions -> Apps Script.
// 2. Paste the doPost script from docs/apps-script-webhook.gs, replacing
//    SHARED_SECRET with your own random string.
// 3. Deploy -> New deployment -> type "Web app" -> Execute as "Me",
//    Who has access "Anyone" -> Deploy. Copy the Web app URL.
// 4. Set GOOGLE_SHEETS_WEBHOOK_URL to that URL and
//    GOOGLE_SHEETS_WEBHOOK_SECRET to the same string used in the script.
export async function appendRegistrantRow(row: {
  name: string;
  phone: string;
  ageGroup: string;
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    throw new Error(
      "Missing GOOGLE_SHEETS_WEBHOOK_URL or GOOGLE_SHEETS_WEBHOOK_SECRET env vars",
    );
  }

  // Apps Script always replies to the initial POST with a 302 to a
  // script.googleusercontent.com URL that serves the actual output. The
  // Fetch spec downgrades a redirected POST to GET and drops the body, so
  // `redirect: "follow"` ends up re-hitting /exec as GET (-> "doGet not
  // found"). Follow the redirect manually instead: the doPost already ran
  // on the first request, we just need a GET to fetch its cached response.
  let res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "manual",
    body: JSON.stringify({
      secret,
      timestamp: new Date().toISOString(),
      name: row.name,
      phone: row.phone,
      ageGroup: row.ageGroup,
    }),
  });

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    if (!location) {
      throw new Error(`Apps Script webhook redirected without a Location header (${res.status})`);
    }

    // doPost already ran on the request above (it's what produced this
    // redirect), so retrying here just re-fetches the cached result — it
    // does not append a duplicate row. This retry exists because Google's
    // script.googleusercontent.com/macros/echo endpoint intermittently
    // 404s on the first hit when called outside a browser.
    let attempt = 0;
    const maxAttempts = 4;
    while (true) {
      res = await fetch(location, { method: "GET" });
      if (res.ok) break;
      attempt += 1;
      if (attempt >= maxAttempts) break;
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? `Apps Script webhook failed (${res.status})`);
  }
}
