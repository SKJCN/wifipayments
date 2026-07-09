# Connecting the ledger to your Google Sheet

You'll link things in 3 steps. Takes about 5 minutes.

## 1. Set up the sheet
1. Open Google Sheets and create a new spreadsheet (or use the sample data below).
2. Row 1 must have these exact headers, one per column, in any order:
   `trans | date | cust_name | pack_name | pack_price`
3. Import `customers_sample.csv` (File → Import → Upload) if you want to start
   with the 20 sample customers, or just type your own rows under the headers.
4. Leave the `trans` column empty for unpaid customers — don't type anything
   in it. The script writes `paid` there automatically once you check the box
   in the HTML page.
5. Customer names can be typed directly in Telugu script in the `cust_name`
   column — the page renders them with a proper Telugu font (Noto Sans Telugu).
6. Dates should look like `05-Jan-2026` (dd-Mon-yyyy). Google Sheets sometimes
   auto-converts typed dates into its own date format — if that happens, select
   the `date` column → **Format → Number → Plain text** first, or the backend
   script will re-format it to `dd-Mon-yyyy` automatically when it reads the sheet.

## 2. Deploy the Apps Script backend
1. In your sheet: **Extensions → Apps Script**.
2. Delete anything in the editor and paste in the contents of `Code.gs`.
3. Click **Deploy → New deployment**.
4. Click the gear icon next to "Select type" → choose **Web app**.
5. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Click **Deploy**, then **Authorize access** and approve the permissions
   (it's your own script, on your own sheet).
7. Copy the **Web app URL** it gives you — looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.

## 3. Connect the HTML page
1. Open `index.html` in a text editor.
2. Near the top of the `<script>` section, find:
   ```js
   const SCRIPT_URL = "";
   ```
3. Paste your Web app URL between the quotes:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Save, then open `index.html` in any browser (double-click it, or upload it
   somewhere and open the link).

That's it — the page will now:
- **Load** every customer row from the sheet automatically.
- **Show a checkbox** in the Trans column for each customer.
- **Check the box → writes `paid`** into that customer's `trans` cell in the sheet.
- **Uncheck it → clears** the cell back to empty.
- **Auto-refresh every 20 seconds**, so any row you add/edit/delete directly
  in the sheet shows up in the page without a manual reload (there's also a
  "Refresh now" button).

## Notes
- You can keep editing columns 2–5 (`date`, `cust_name`, `pack_name`,
  `pack_price`) directly in Google Sheets as you described — the page just
  re-reads the sheet on its next refresh.
- Deleting a row in the sheet removes that customer from the page on the
  next refresh.
- If you ever redeploy the Apps Script (not just edit and save, but a *new*
  deployment), you'll get a new URL and will need to update `SCRIPT_URL` again.
  Editing the script and choosing "Manage deployments → Edit → New version"
  keeps the same URL.
- Whoever opens `index.html` needs it saved somewhere they can access (their
  own computer, a shared drive, or hosted on something like GitHub Pages) —
  it's a plain file, not something that lives inside Google Sheets itself.
