# player-pool
## Deployed on Netlify
[![Netlify Status](https://api.netlify.com/api/v1/badges/3659526b-03ef-4cdb-acd3-0b9e297e9047/deploy-status)](https://app.netlify.com/sites/player-pool/deploys)

## Run locally
~~python -m SimpleHTTPServer 8000~~

python3 -m http.server 8000

## Yearly Update
### Google form
1. When cleaning up the data from the previous year on the Form Responses 1 sheet make sure to delete the rows and not just the data in them, the google script will just continue adding from the last row.
2. ~~Update dates in email.gs and save to the scripts for the google sheet~~ Not sending emails anymore
3. Get values from Google form for updating Website form.
- Make sure the values Team and Player variables like "entry.2120297232" match the fields on the Google form.
- Open google form click the 3 vertical buttons and select Get pre-filled link
- On this page fill out the fields and click the button to get the pre filled link
- Click the copy link button
- Update they formAction variable for the key for the new.
- Example Link
https://docs.google.com/forms/d/e/1FAIpQLScTsxY6WklBqb8g_WZBbNnfV0pyAZUaZQf5o4zZrnMxm53pww/viewform?usp=pp_url&entry.2120297232=richardsamuellopez@gmail.com&entry.383545338=RSL+Roster+1&entry.1759913902=1234567&entry.1059009687=t1&entry.1589326624=p1&entry.1792899743=s2&entry.496616414=p2&entry.298248963=s3&entry.228107489=p3&entry.1260734803=s4&entry.1929196631=p4&entry.265627880=s5&entry.1438588206=p5&entry.688877146=s6&entry.718296763=p6&entry.1554732274=s7&entry.1222291357=p7&entry.1767171400=s8&entry.581849140=p8&entry.99488968=s9&entry.859580858=p9&entry.654414173=twc1&entry.1145243786=pwc1&entry.713813158=twc2&entry.862600197=pwc2


### Website form
1. In index.html update the key in the url for the form action if necessary
2. Update the variables in appEntry.js
- Update year, deadline and fee
- IDs are taken from the Google form
```
// UPDATE THE BELOW VARIABLES EACH YEAR
  $scope.year = '2023';
  $scope.deadLine = 'noon EST, Thursday, March 16th';
  $scope.fee = "$50";
  $scope.emailID = "entry.2120297232";
  $scope.entryNameID = "entry.383545338";
  $scope.pinID = "entry.340221862";
  $scope.entry = {
    'seed1Team': 'entry.1059009687',
    'seed1Player': 'entry.1589326624',
    'seed2Team': 'entry.1792899743',
    'seed2Player': 'entry.496616414',
    'seed3Team': 'entry.298248963',
    'seed3Player': 'entry.228107489',
    'seed4Team': 'entry.1260734803',
    'seed4Player': 'entry.1929196631',
    'seed5Team': 'entry.265627880',
    'seed5Player': 'entry.1438588206',
    'seed6Team': 'entry.688877146',
    'seed6Player': 'entry.718296763',
    'seed7Team': 'entry.1554732274',
    'seed7Player': 'entry.1222291357',
    'seed8Team': 'entry.1767171400',
    'seed8Player': 'entry.581849140',
    'seed9Team': 'entry.99488968',
    'seed9Player': 'entry.859580858',
    'seedWC1Team': 'entry.654414173',
    'seedWC1Player': 'entry.1145243786',
    'seedWC2Team': 'entry.713813158',
    'seedWC2Player': 'entry.862600197'
  }
// END OF VARIABLES TO UPDATE```

Can hide this sheet after copying over all entries.

Notes: Do not need to publish any of the pages to the web unless doing some reading of the sheets. i.e. reading the players and getting the stats live

## Add a trigger if doing some emailing
1. On google sheet select Tools -> Script Editor
2. On the script editor select Edit -> Current project's triggers
3. ON triggers page select Add Trigger with following:
  Choose which function to run - sendEmail
  Choose which deployment should run - Head
  Select event source - From spreadsheet
  Select event type - On form submit
  Failure notification settings - Nofity me immediately
4. Click save - this will prompt to allow the script to access your account and send email as you