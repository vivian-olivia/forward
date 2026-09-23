// Paste this into Extensions > Apps Script on the target spreadsheet.
// Replace SHARED_SECRET below with a random string, and set that same
// string as GOOGLE_SHEETS_WEBHOOK_SECRET in the app's .env.local.
//
// Then: Deploy > New deployment > type "Web app" > Execute as "Me",
// Who has access "Anyone" > Deploy. Copy the Web app URL into
// GOOGLE_SHEETS_WEBHOOK_URL.

var SHARED_SECRET = "replace-with-a-random-string";
var SHEET_NAME = "Sheet1";

function doPost(e) {
  var result = { ok: false };

  try {
    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      result.error = "Invalid secret";
      return respond(result);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      result.error = "Sheet not found: " + SHEET_NAME;
      return respond(result);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "timestamp",
        "name",
        "phone",
        "group",
        "attendeeCount",
        "preEvents",
        "bringingChildren",
        "invitedBy",
      ]);
    }

    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.name || "",
      body.phone || "",
      body.ageGroup || "",
      body.attendeeCount || "",
      body.preEvents || "",
      body.bringingChildren || "",
      body.invitedBy || "",
    ]);

    result.ok = true;
  } catch (err) {
    result.error = String(err);
  }

  return respond(result);
}

function respond(result) {
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
