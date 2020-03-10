## How to populate rosters for player pool entry form
1. Go to player-pool/data folder
2. Run `javac HTMLRead.java`
3. Run `java HTMLRead`
4. Output is created in Rosters.json
5. Check for empty roster arrays [], if any need to add case to switch for mismatched team name in HTMLRead.java
6. Check for funny stuff in names like &#x27;
6. Push to github updated Rosters.json file

## To disable entry form after cutoff
1. Copy data from Rosters.json
2. Save new rosters file with year in name
3. Save Rosters.json as ```{"teams":[]}```