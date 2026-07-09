/**
 * LEDGER SYNC — Apps Script backend
 * ----------------------------------
 * Paste this into: your Google Sheet → Extensions → Apps Script (replace any
 * default code), then Deploy → New deployment → Web app.
 *   Execute as:      Me
 *   Who has access:  Anyone
 * Copy the resulting Web app URL into SCRIPT_URL in index.html.
 *
 * Expects row 1 to be headers containing at least:
 *   trans, date, cust_name, pack_name, pack_price
 * (order doesn't matter, extra columns are ignored)
 */

var SHEET_NAME = ''; // leave blank to use the first sheet in the file

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

// Reads the whole table and returns it as JSON
function doGet(e) {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values[0].map(function (h) { return String(h).trim(); });
  var dateCol = headers.indexOf('date');
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    // skip fully blank rows
    if (row.join('') === '') continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      // If Sheets auto-converted a typed date into a real Date object,
      // re-format it as dd-Mon-yyyy so the page always shows that format.
      if (j === dateCol && Object.prototype.toString.call(val) === '[object Date]') {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd-MMM-yyyy');
      }
      obj[headers[j]] = val;
    }
    obj._row = i + 1; // real 1-based sheet row, so writes land in the right place
    rows.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify({ headers: headers, rows: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handles a single checkbox toggle: { row: <sheet row number>, checked: true|false }
function doPost(e) {
  var sheet = getSheet_();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim(); });
  var transCol = headers.indexOf('trans') + 1;

  var payload = JSON.parse(e.postData.contents);
  var row = Number(payload.row);
  var checked = !!payload.checked;

  if (!row || row < 2 || transCol < 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Bad row or missing trans column' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.getRange(row, transCol).setValue(checked ? 'paid' : '');

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
