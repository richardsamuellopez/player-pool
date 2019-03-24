# player-pool

#Run locally
python -m SimpleHTTPServer 8000

Need to make sure the name="entry.2120297232" for the fields on the google form match the id and name on the form in entry.html
Open google form click the 3 vertical buttons and select Get pre-filled link
On this page fill out the fields and click the button to get the pre filled link
Update they key for the new form on line 73 of entry.html
Now submissions of the form add a new record in the Form Responses 1 table of the sheet
Can hide this sheet after copying over all entries.

Notes: Do not need to publish any of the pages to the web unless doing some reading of the sheets. i.e. reading the players and getting the stats live

#Add a trigger
1. On google sheet select Tools -> Script Editor
2. On the script editor select Edit -> Current project's triggers
3. ON triggers page select Add Trigger with following:
  Choose which function to run - sendEmail
  Choose which deployment should run - Head
  Select event source - From spreadsheet
  Select event type - On form submit
  Failure notification settings - Nofity me immediately
4. Click save - this will prompt to allow the script to access your account and send email as you

#Clean up
When cleaning up the data from the previous year on the Form Responses 1 sheet make sure to delete the rows and not just the data in them, the google script will just continue adding from the last row.