# [player-pool](http://player-pool.netlify.com)
## Deployed on Netlify
[![Netlify Status](https://api.netlify.com/api/v1/badges/3659526b-03ef-4cdb-acd3-0b9e297e9047/deploy-status)](https://app.netlify.com/sites/player-pool/deploys)

## Run locally
~~python -m SimpleHTTPServer 8000~~

python3 -m http.server 8000

## Yearly Update Instructions
1. Make copy of sheet for historical data. Update the existing sheet name with the new year 2k##. This will avoid having to update api and field keys when working with the google forms.

2. Run Yearly Reset - In google script ADMIN_ONLY.gs file select and run YEARLY_RESET. Should recieve a prompt to proceed on the google doc.
 - Clear Players tab
 - Clear Standings tab
 - Delete Form Responses 1 rows (does not clear but needs to delete the rows) ? Is this still used?

3. Reset admin tab - In google script ADMIN_ONLY.gs file select and run RESET_ADMIN_TAB. Should recieve a prompt to proceed on the google doc.
  - Populates PIN column (Admin tab A)
  - Clears Admin tab C2:AB
  - Populates Submission Column (Admin tab B)

4. Update Settings tab on google sheet. These are read by and displayed on the website.
- YEAR
- DEADLINE
- ENTRY_FEE
- CONTACT_EMAIL
- LEAGUESAFE_LINK
- TRACKER_LINK - This should be kept the same (See #1 above) but has the options to change if needed
- OLD_TRACKER_LINK
- BRACKET - TODO: The idea is to add the bracket/rosters here so the webiste reads from here and then it won't require an update to the rosters.json file and website deployment 

5. Test the process
- Insert email and team name on Admin sheet
- In google script ADMIN_ONLY.gs select and run CREATE_DRAFT_EMAILS to create draft emails for the PINs, then verify the draft emails in gmail.
- Can send email or not.
- On ADMIN_ONLY.gs run TURN_ON
- On the form enter email and pin and then submit a roster, verify it is added to the Admin sheet and displays on the Standings sheet
- On ADMIN_ONLY.gs run TURN_OFF and then RESET_ADMIN_TAB
- TESTING COMPLETE

6. ? Send notification email for payments in league safe

7. SELECTION SUNDAY - Bracket and rosters
- Generate bracket and rosters using the [JAVA Code](https://github.com/richardsamuellopez/player-pool/blob/39ac7688ef0c968b01adabcc63f09890d45092c7/data/README-Roster-Population.md)
- Update website rosters.json with bracket and rosters
- Enable form - In google script ADMIN_ONLY.gs select and run FORM_ON

8. Update google sheet Players tab

9. As payments come in from leaguesafe add them to the Admin sheet. Populate the Email and Entry (Team Name) columns. The PIN column will be the PIN to email the user.

10. In google script ADMIN_ONLY.gs select and run CREATE_DRAFT_EMAILS to create draft emails for the PINs, then go to draft emails in gmail and send PIN emails.

11. User gets email with PIN and go to form, enter email & PIN, fill out roster then submit. Form Response 1 and Admin tab update with submissions. The Standings tab will also display entries as they come in and users can verify their team their. It will not auto sort until next step is done. NOTE: Not sending a confirmation email when user submits a roster

12. At cut off time in google script admin.gs select and run FORM_OFF this will copy the final rosters from the Admin tab to Standings tab and it will now auto sort with points changes


## Notes:
#### Can hide the following sheets:
- Admin
- Settings
- Form Responses 1 ? Is this even used? Can it be deleted?

## Publishing
 Do not need to publish any of the pages to the web unless doing some reading of the sheets. i.e. reading the players and getting the stats live

### Populate PINs
Code on google sheet to populate PINs
```
function populatePINs() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Are you sure you want to populate new PINs? This will overwrite all existing PINs', ui.ButtonSet.YES_NO);
  if(response == ui.Button.YES) {
    var pinsToMake = 500;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Entries");
    var clearPins = sheet.getRange("AA2:AA").clear();
    var formula = [['=arrayformula(array_constrain(unique(randbetween(1000000,9999999*sign(sequence('+pinsToMake+')))), '+pinsToMake+',1))']];
    var range = sheet.getRange("AA2").setFormula(formula);
    var pins = sheet.getRange(2, 27, pinsToMake).getValues();
    var setPins = sheet.getRange(2, 27, pinsToMake).setValues(pins);
  }
}
```
Conditional formating to check for duplicates
`=COUNTIF($AA$2:$AA,AA2)>1`

### How to run populatePINs
On the Google Sheet go to Extensions -> Apps Script
In the Code.gs file choose the populatePINs in the dropdown
It is currently set to fill in the Admin sheet and the C column for 500 rows
Click the Run button, go to the Admin sheet and click Yes on the alert `Are you sure you want to populate new PINs? This will overwrite all existing PINs` then the PIN column populates.

### Add a trigger if doing some emailing
1. On google sheet select Tools -> Script Editor
2. On the script editor select Edit -> Current project's triggers
3. ON triggers page select Add Trigger with following:
  Choose which function to run - sendEmail
  Choose which deployment should run - Head
  Select event source - From spreadsheet
  Select event type - On form submit
  Failure notification settings - Nofity me immediately
4. Click save - this will prompt to allow the script to access your account and send email as you
