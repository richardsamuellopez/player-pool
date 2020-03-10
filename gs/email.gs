function getQuota() {
  var quota = MailApp.getRemainingDailyQuota();
  var html = true;
  var cashApp = html ? "<a href='https://cash.me/$CoreyWads'>$CoreyWads</a>" : "$CoreyWads";
  var payments = "";
  payments += wrap("CashApp: " + cashApp, "div", html);
  var ActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1").getSheetName();
  //getSheetByName("Form Response 1");
    //var ActiveSheet = ss.getSheetByName("Form Responses 1");

  var test = "need more to debug";
}

function testEmailQuota() {
  var quota = MailApp.getRemainingDailyQuota();
  var message = "EMAIL MESSAGE ";
  var SendTo = "rsltesting@gmail.com";
  var Subject = "Draft email Test subject";
  var cc = "richardsamuellopez@gmail.com";
  var html = "BODY<br>HELLO</br><b>WORLD</b>";
  var options = {
    htmlBody: html
  };
  var loopSize = 10;
  var quotaSize = 95;

  for(x=1;x<loopSize;x++){
    Subject = "QUOTA LOOP " + x;
    quota = MailApp.getRemainingDailyQuota();
     if (quota <= quotaSize ){
       GmailApp.createDraft(SendTo, Subject, message, options);
     } else {
       // need to check message if non html email, can it be blank
       GmailApp.sendEmail(SendTo, Subject, message, options);
     }
  } 
}

function testBuildBody() {
  var RowValues=["2/18/2018 23:45:52", "richardsamuellopez@gmail.com", "218 test 2", "Villanova", "Jalen Brunson", "Duke", "Trevon Duval", "Baylor", "Jo Lual-Acuil Jr.", "Florida", "Mike Okauru", "Virginia", "Devon Hall", "SMU", "Jahmal McMurray", "South Carolina", "David Beatty", "Wisconsin", "D'Mitrik Trice", "Virginia Tech", "Tyrie Jackson", "Marquette", "Markus Howard", "Rhode Island", "Michael Tertsea", "USC", "Shaqquan Aaron"];
  var messageHTML = buildBody(RowValues, true); 
  var message = buildBody(RowValues, false);
  //Test html email
  GmailApp.sendEmail("rsltesting@gmail.com", "HTML TEST", message, {htmlBody: messageHTML});
  //Test plain text email
  //GmailApp.sendEmail("rsltesting@gmail.com", "PLAIN TEST", message);

}

function buildBody(RowValues, html) {
  var body = "";
  var payments = "";
  var roster = "";
  var venmo = html ? "<a href='https://venmo.com/code?user_id=1635041570455552771'>@CoreyWads</a>" : "@CoreyWads";
  var cashApp = html ? "<a href='https://cash.me/$CoreyWads'>$CoreyWads</a>" : "$CoreyWads";
  var paypal = html ? "<a href='https://paypal.me/CoreyWads'>Corey.Waddell@gmail.com</a>" : "Corey.Waddell@gmail.com";

  body += wrap("Thank you for submitting your entry into the Player Pool. This e-mail confirms your roster was submitted correctly. To complete your submission, send $40 to one of the following.  Please include your entry name ("+RowValues[2]+") in the memo.  Immediate payment is greatly appreciated, please avoid me requesting completion on your end.", "p", html);

  payments += wrap("Venmo: " + venmo, "div", html);
  payments += wrap("CashApp: " + cashApp, "div", html);
  payments += wrap("Paypal: " + paypal, "div", html);
  payments += wrap("Chase Quick Pay (Zelle): Corey.Waddell@gmail.com", "div", html);
  payments += wrap("Non-Digital Payments will not be accepted.", "div", html);

  
  roster += wrap(bold("Roster Details", html), "div", html);
  roster += wrap(bold("Email: ", html) + RowValues[1], "div", html);
  roster += wrap(bold("Entry: ", html) + RowValues[2], "div", html);
  roster += wrap(bold("#1: ", html) + RowValues[3] + " - " + RowValues[4], "div", html);
  roster += wrap(bold("#2: ", html) + RowValues[5] + " - " + RowValues[6], "div", html);
  roster += wrap(bold("#3: ", html) + RowValues[7] + " - " + RowValues[8], "div", html);
  roster += wrap(bold("#4: ", html) + RowValues[9] + " - " + RowValues[10], "div", html);
  roster += wrap(bold("#5: ", html) + RowValues[11] + " - " + RowValues[12], "div", html);
  roster += wrap(bold("#6: ", html) + RowValues[13] + " - " + RowValues[14], "div", html);
  roster += wrap(bold("#7: ", html) + RowValues[15] + " - " + RowValues[16], "div", html);
  roster += wrap(bold("#8: ", html) + RowValues[17] + " - " + RowValues[18], "div", html);
  roster += wrap(bold("#9: ", html) + RowValues[19] + " - " + RowValues[20], "div", html);
  roster += wrap(bold("#WC1: ", html) + RowValues[21] + " - " + RowValues[22], "div", html);
  roster += wrap(bold("#WC2: ", html) + RowValues[23] + " - " + RowValues[24], "div", html);
  
  body += wrap("","", false);
  body += wrap(payments,"p",html);
  body += wrap("","", false);
  body += wrap(roster, "p", html);
  return body;
}

function wrap(txt, element, html) {
  if(html) {
   return "<"+element+">" + txt + "</"+element+">"; 
  } else {
    return txt + "\r\n";
  }
}

function bold(txt, html) {
  if(html) {
    return "<b>" + txt + "</b>";
  } else {
    return txt;
  }
}

function findNewEntries() {
  console.log('findNewEntries: ' + new Date()); 
  var skipTimeTrigger = true;//SET TO TRUE TO SKIP ALL THE findNewEntries function
  if(skipTimeTrigger){
    console.log('Skip Time Trigger ' + new Date());
    return;
  }
  var EMAIL_SENT = 'EMAIL_SENT';
  var EntrySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var Zvals = EntrySheet.getRange("AA1:AA").getValues();
  var Zlast = Zvals.filter(String).length;
  var LastRow = EntrySheet.getLastRow();
  var userProperties = PropertiesService.getUserProperties();
  var PropLastEmail = userProperties.getProperty('LastEmail')
  var LastEmail = Zlast;//PropLastEmail||Zlast;
  var NewRows = LastRow - LastEmail;
  console.log('NewRows: ' + new Date()); 
  if (NewRows > 0) {
    var StartRow = LastEmail
    StartRow=+StartRow+1;
    var NewEntries = EntrySheet.getRange(StartRow,1,NewRows,27);
    var EntriesData = NewEntries.getValues();
    var RowValues = EntriesData[0];
    var test=""
    var CurrentRow=0;
    for(x=0;x<NewRows;x++){
      //sendEmail(EntriesData[x]);
      test=EntriesData[x];
      this.sendEmail(EntriesData[x]);
      CurrentRow=StartRow + x;
      EntrySheet.getRange(CurrentRow, 26).setValue(EMAIL_SENT);
      EntrySheet.getRange(CurrentRow, 27).setValue(EMAIL_SENT);
      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
      Utilities.sleep(1000);
    }
    userProperties.setProperty('LastEmail', CurrentRow);
  }
  var temp="LAST";
}

function loopAllEntriesForMissedEmail() {
  
}

function sendEmail(entryData) {
  var skipOnFormSubmitTrigger = false;// Set this to true to skip the onFormSubmit trigger
  var isOnFormSubmitTrigger = (entryData == undefined || !entryData.length > 0 )
  if (isOnFormSubmitTrigger && skipOnFormSubmitTrigger) {
    console.log('Skip On Form Submit Trigger ' + new Date());
    return;
  }
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  if (!lock.hasLock()) {
    console.log('Could not obtain lock. See the next SendEmail called log. ' + new Date());
    Utilities.sleep(5000);
  } else {
    console.log('Locked: ' + new Date()); 
  }
  
  //setup function
  var EMAIL_SENT = 'EMAIL_SENT';
  //var ActiveSheet = ss.getSheetByName("Form Responses 1");
  //var ActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var Row = ActiveSheet.getLastRow();
  var WholeRange = ActiveSheet.getRange(Row,1,1,27);
  var RowData = WholeRange.getValues();
  var RowValues;
  if (isOnFormSubmitTrigger) {
    console.log('PARAM undefined: '+entryData.length+entryData+RowData[0]);
    RowValues = RowData[0];
  } else {
    console.log('Param defined'+entryData+RowData[0]);
     RowValues = entryData;
  }
//  var RowValues = typeof entryData !== 'undefined' ? entryData : RowData[0];

  var SendTo = RowValues[1];
  var Subject = "Player Pool 2020";
  var message = buildBody(RowValues, false);
  var messageHTML = buildBody(RowValues, true);
  var options = {
    htmlBody: messageHTML
  };
  var SEND_EMAIL = (RowValues[26] != EMAIL_SENT)
  
  console.log('SendEmail called: ', RowValues[0], RowValues[1], RowValues[2], 'Z: ', RowValues[25], RowValues[25]!=EMAIL_SENT, 'AA: ', RowValues[26], RowValues[26]!=EMAIL_SENT, ""!=EMAIL_SENT, "EMAIL_SENT"==EMAIL_SENT);
  // Do not sent duplicate emails
  if (SEND_EMAIL) {
    var quota = MailApp.getRemainingDailyQuota();
    // Enhancement add a column to the row denoting the email was sent, this can be used to then check to avoid duplicate emails.
    if (quota <= 5 ) {
      // Create drafts when near quota to avoid simultaneous send email when quota is reached
      console.log('Creating draft: ', RowValues[0], RowValues[1], RowValues[2], RowValues[25], RowValues[26]);
      GmailApp.createDraft(SendTo, Subject, message, options);
      if ( quota > 0) {
        GmailApp.sendEmail("corey.waddell@gmail.com", "Player Pool 2020 Email Limit Reached Quota: " + quota , "The email limit has been reached. Check the drafts folder for emails that need to be sent.");
      }
    } else {
      // Quota not reached so send the actual email  
      console.log('Sending email: ', RowValues[0], RowValues[1], RowValues[2], RowValues[25], RowValues[26]);
      GmailApp.sendEmail(SendTo, Subject, message, options);
    }
    //Only write this if this the onFormSubmitTrigger, the timer trigger will do this for each row
    if(isOnFormSubmitTrigger){
      ActiveSheet.getRange(Row, 26).setValue(EMAIL_SENT);
      ActiveSheet.getRange(Row, 27).setValue(EMAIL_SENT);
      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
      Utilities.sleep(1000);
    }
  } else {
    console.log('Duplicate sendEmail call, duplicate email not sent: ', RowValues[0], RowValues[1], RowValues[2], RowValues[25], RowValues[26]);
  }
  console.log('Unlocked: ' + new Date());
  lock.releaseLock();
}