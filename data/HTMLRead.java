import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.MalformedURLException;
import java.util.*;

public class HTMLRead {
  public static Boolean readBracket = false; // Set to true to read bracket from wiki, false if already read
  public static Boolean readTeamIDs = false; // Set to true to read team IDs, false if not needed

  public static String bracketFile = "Bracket.txt";
  public static String TeamIDsFile = "TeamIDs.txt";
  public static String JSONFile = "Rosters.json";
  public static ArrayList<Team> BracketList = new ArrayList<Team>();
  // public static String BracketURL = "https://en.wikipedia.org/wiki/2017_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";
  // public static String BracketURL = "https://en.wikipedia.org/wiki/2018_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";
  // public static String BracketURL = "https://en.wikipedia.org/wiki/2022_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";
  //public static String BracketURL = "https://en.wikipedia.org/wiki/2023_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";
  public static String BracketURL = "https://en.wikipedia.org/wiki/2024_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";

  static class Team {
    String name;
    int seed;
    int teamID;
    ArrayList<String> roster;
  }

  public static void main(String[] args) throws IOException {
    if(readBracket){
      // Read seeds and teams from wikipedia
      readBracket();
    } else {
      // If wikipedia is not updated add the seed, team to bracket.txt and run fillBracket instead of readBracket
      fillBracket();
    }

     if(readTeamIDs) {
      //Read team IDs from ESPN
      readTeamIDs();
     } else {
      //If team IDs have not changed do this and skip readTeamIDs
      fillTeamIDs();
     }

    // Read roster from ESPN
    readRosters();

    // Output to json data to a file
    createJSONOutput();
  }

  public static void createJSONOutput() throws IOException, MalformedURLException{
    FileWriter fileWriter =
     new FileWriter(JSONFile);
    // Always wrap FileWriter in BufferedWriter.
    BufferedWriter bufferedWriter =
    new BufferedWriter(fileWriter);
    int count = 0;
    bufferedWriter.write("{\"teams\":[\n");
    for(Team team: BracketList){
      // System.out.println(team.name+ " "+ team.seed+" "+team.teamID+" "+team.roster);
      bufferedWriter.write("{");
      bufferedWriter.write("\"team\": \""+team.name+"\",");
      bufferedWriter.write("\"seed\": \""+team.seed+"\",");
      bufferedWriter.write("\"roster\": "+team.roster);
      if(count++ == BracketList.size() - 1){
        // Last iteration
        bufferedWriter.write("}\n");
      } else {
        bufferedWriter.write("},\n");
      }
    }
    bufferedWriter.write("]}");
    // Always close files.
    bufferedWriter.close();
  }

  public static void fillBracket()  throws IOException {
    Boolean debug = false;
    System.out.println("Force Read Bracket Manual file Bracket.txt");
    FileReader fileReader =
        new FileReader(bracketFile);

    // Always wrap FileReader in BufferedReader.
    BufferedReader bufferedReader =
        new BufferedReader(fileReader);

    List<String> lines = new ArrayList<String>();
    String line = null;
    String seed = "";
    String team = "";
    int startPos = -1;
    int endPos = -1;
    while((line = bufferedReader.readLine()) != null) {
      if(debug){System.out.println("LINE: "+line);}
      endPos = line.indexOf(",");
      startPos = 0;
      seed = line.substring(startPos, endPos);
      team = commonTeamName(line.substring(endPos+1).trim());
      Team newTeam = new Team();

      newTeam.name = team;
      newTeam.seed = Integer.parseInt(seed);
      newTeam.teamID = 0;
      if(debug){System.out.println("TEAM: "+newTeam.name + " SEED: "+ newTeam.seed + " ID: " + newTeam.teamID);}
      BracketList.add(newTeam);
    }

    // Always close files.
    bufferedReader.close();
  }

  public static void readBracket() throws IOException, MalformedURLException {
    System.out.println("Read Bracket From wikipedia");
    Boolean debug = false;
    URL url = new URL(BracketURL);
    // Get the input stream through URL Connection
    URLConnection con = url.openConnection();
    InputStream is =con.getInputStream();
    BufferedReader br = new BufferedReader(new InputStreamReader(is));
    String line = null;

    FileWriter fileWriter =
     new FileWriter(bracketFile);
    // Always wrap FileWriter in BufferedWriter.
    BufferedWriter bufferedWriter =
    new BufferedWriter(fileWriter);
    // read each line and write to System.out
    int teamCount = 0;
    Boolean getBracket = false;
    Boolean getRegion = false;
    Boolean getRow = false;
    Boolean getSeed = false;
    Boolean getTeam = false;
    Boolean byPassNextSeed = false;
    int endPos = -1;
    int startPos = -1;
    String seed = "";
    String team = "";

    while ((line = br.readLine()) != null) {
      if(line.contains("id=\"Tournament_seeds\"")){
        teamCount = 1;
        getBracket = true;
      }
      if(getBracket){
        if(debug) System.out.println("LINE: " + line);
        // if(line.contains("<th scope=\"row\" style=\"text-align:left\">")){
        //   getTeam = true;
        // }
        if(line.equals("<tr>")){
          getSeed = true;
          if(byPassNextSeed){
            getSeed = false;
            getTeam = true;
            byPassNextSeed = false;
          }
        }
        if(getSeed && line.contains("<td")){
          getSeed = false;
          getTeam = true;
          endPos = line.length();//line.indexOf("</td>");
          if(line.contains("11*") || line.contains("12*") || line.contains("13*") || line.contains("14*") || line.contains("15*") || line.contains("16*") ){
            byPassNextSeed = true;
            endPos--;
          }
          startPos = line.lastIndexOf(">", endPos)+1;
          seed = line.substring(startPos, endPos);
          // System.out.println("SEED: "+line+"\n");
          if(seed.contains("*")){
            seed = seed.substring(0, seed.length()-1);
          }
        }

        if(getTeam && line.contains("<th scope=\"row\" style=\"text-align:left\">")){
          // System.out.println("Team : "+line+"\n");
          getTeam = false;
          getSeed = false;
          // The next few lines depend on what Wikipedia has
          endPos = line.length();//line.indexOf("</a></th>");
          // startPos = line.lastIndexOf(">", endPos)+1;
          startPos = line.lastIndexOf("team\">", endPos)+6;
          // team = line.substring(startPos, endPos);
          team = line.substring(startPos, endPos-4);
          if(debug){System.out.println("TEAM: "+team+"\n");}
          // System.out.println("TEAM COUNT: " + teamCount+"\n");
          bufferedWriter.write(seed + ", ");
          bufferedWriter.write(team+"\n");
          // System.out.println("SEED: "+seed+" TEAM: "+team+"\n");

          Team newTeam = new Team();

          newTeam.name = commonTeamName(team);
          newTeam.seed = Integer.parseInt(seed);
          newTeam.teamID = 0;
          BracketList.add(newTeam);

          // bufferedWriter.write("TEAM COUNT: " + teamCount+"\n");
          teamCount++;
        }
      }
      if(teamCount>68){
        getBracket = false;
      }
    }
    // Always close files.
    bufferedWriter.close();

    // return new Object();//{};
  }

  static String commonTeamName(String name) {
    switch (name) {
      case "Miami (FL)":  return "Miami";
      case "Mount St. Mary's":  return "Mt. St. Mary's";
      case "Cal State Fullerton": return "CSU Fullerton";
      case "College of Charleston": return "Charleston";
      case "Loyola Chicago": return "Loyola-Chicago";
      case "Texas A&amp;M–Corpus Christi": return "Texas A&M-CC";
      case "Texas A&amp;M": return "Texas A&M";
      case "Penn": return "Pennsylvania";
      case "Connecticut": return "UConn";
    }
    return name;
  }

  public static void readTeamIDs() throws IOException, MalformedURLException {
    System.out.println("Read team IDs from ESPN");
    URL url = new URL("http://www.espn.com/mens-college-basketball/team/stats/_/id/399");
    // TODO Update to this
    // URL url = new URL("https://www.espn.com/mens-college-basketball/teams");

    // Get the input stream through URL Connection
    URLConnection con = url.openConnection();
    InputStream is =con.getInputStream();

    BufferedReader br = new BufferedReader(new InputStreamReader(is));

    String line = null;

    FileWriter fileWriter =
     new FileWriter(TeamIDsFile);
    // Always wrap FileWriter in BufferedWriter.
    BufferedWriter bufferedWriter =
    new BufferedWriter(fileWriter);
    // read each line and write to System.out
    int teamCount = 0;
    int endPos = -1;
    String[] idArray = new String[0];
    // ArrayList<String> idList = new ArrayList<String>();
    while ((line = br.readLine()) != null) {
      // Get line from website
      // if(line.contains("<option value=\"\">Men's College Basketball Teams</option>")) {
        if(line.contains("<option data-url=\"/mens-college-basketball/team/stats\" value=\"Selected\">More NCAAM teams</option>")) {
          // idArray = line.split("</option><option value=\"http://www.espn.com/mens-college-basketball/team/stats/_/id/");
          // idArray = line.split("</option><option value=\"//www.espn.com/mens-college-basketball/team/stats/_/id/");
          idArray = line.split("<option data-url=\"/mens-college-basketball/team/stats/_/id/");
      }
    }

    String teamLine = "";
    int TeamCount = 0;
    int bracketPos = -1;
    String teamName = "";
    String teamID = "";
    for(String IDline: idArray){
      teamLine = IDline.replace("\">",", ");
      endPos = teamLine.indexOf("</select>");

      if(endPos>-1){
        teamLine = teamLine.substring(1,endPos);
      }
      if(teamCount>0){
        // bufferedWriter.write(teamLine+"\n");
        // System.out.println("teamline: "+teamLine);

        teamID = teamLine.split("\" value=\"Selected, ")[0];
        //System.out.println("teamID: "+teamID);
        //System.out.println("teamline: "+teamLine);

        teamName = teamLine.substring(teamLine.indexOf(",")+1).trim();
        teamName= teamName.substring(0,teamName.indexOf("</option>")-1);
        Team currTeam = new Team();
        currTeam.name=teamName;
        // bracketPos = BracketList.indexOf(teamName);
        final String finalTeam = teamName;
        final String finalID = teamID;
        System.out.println("team "+teamName+" id "+teamID);
        bufferedWriter.write(teamID+", "+teamName+"\n");
        BracketList.forEach(team->{
          // if(team.name.equals(finalTeam)){
            if(team.name.startsWith(finalTeam)){
            team.teamID=Integer.parseInt(finalID);
          }
        });
      }
      teamCount ++;
    }
    // Always close files.
    bufferedWriter.close();
    // return new Object();//{};
  }

  public static void fillTeamIDs() throws IOException, MalformedURLException {
    Boolean debug = false;
    System.out.println("FILL TEAM IDs");
    FileReader fileReader =
        new FileReader(TeamIDsFile);
    // Always wrap FileReader in BufferedReader.
    BufferedReader bufferedReader =
        new BufferedReader(fileReader);

    List<String> lines = new ArrayList<String>();
    String line = null;
    String teamid = "";
    String teamName = "";
    int startPos = -1;
    int endPos = 0;
    while((line = bufferedReader.readLine()) != null) {
      if(debug){System.out.println("line: "+line);}
      endPos = line.indexOf(",");
      startPos = 0;
      if(endPos>0){
        teamid = line.substring(startPos, endPos);
        teamName = line.substring(endPos+1).trim();
        final String finalTeam = teamName;
        final String finalID = teamid;
        if(debug){System.out.println("team "+teamName+" id "+teamid);}
        BracketList.forEach(team->{
          // if(team.name.equals(finalTeam)){
            if(team.name.startsWith(finalTeam)){
            team.teamID=Integer.parseInt(finalID);
          }
        });
      }
    }
    return;
  }

  public static void readRosters() throws IOException, MalformedURLException {
    Boolean debug = false;
    System.out.println("Read Rosters from ESPN");
    for (Team team : BracketList) {
      if(team.teamID == 0){
        System.out.println("*****ERROR*****: " + team.name + " has a teamID of 0");
      } else {
        System.out.println("TEAM: " + team.name + " ID: " + team.teamID);
      }
      URL url = new URL("https://www.espn.com/mens-college-basketball/team/roster/_/id/"+String.valueOf(team.teamID));
      // Get the input stream through URL Connection
      URLConnection con = url.openConnection();
      InputStream is =con.getInputStream();

      BufferedReader br = new BufferedReader(new InputStreamReader(is));

      String line = null;
      Boolean inRoster = false;
      Boolean inPlayerRow = false;
      Boolean inPlayerLink = false;
      String[] rosterArray = new String[0];
      ArrayList<String> rosters = new ArrayList<String>();

      while ((line = br.readLine()) != null) {
        // Get line from website
        if(debug){System.out.println("line: " + line);}

        if(line.contains("<div class=\"Table__Title\">Team Roster</div>")) {
          inRoster = true;
          rosterArray = line.split(">");

          for (String element : rosterArray) {
            if(inRoster && element.contains("<tr class=\"Table__TR Table__TR--lg Table__even\"")){
              if(debug){System.out.println("element-1: " + element);}
              inPlayerRow = true;
            }
            if(inPlayerRow && element.contains("<td class=\"Table__TD\"")){
              if(debug){System.out.println("element-2: " + element);}
              inPlayerRow = false;
              inPlayerLink = true;
            }
            if(inPlayerLink && element.contains("</a")){
              inPlayerLink = false;
                if(debug){System.out.println("element-3: " + element);}
                String playerName = element.substring(0, element.length()-3);
                if(debug){System.out.println("playerName: " + playerName);}
                rosters.add("\""+playerName+"\"");
                //  rosterArray = line.split("<a href=\"http://www.espn.com/mens-college-basketball/player");
                //  rosterArray = line.split("<figure class=\"Image aspect-ratio headshotV2 headshotV2--sm athlete silo\" style=\"border-color:\" title=\"");
                //  int endPos = -1;
                //  int startPos = -1;
                //  String playerName = "";
                //  for(String player: rosterArray){
                //    startPos = 0;
                //    endPos = player.indexOf("\">");
                //    if(startPos>-1){
                //      playerName = "\"" + player.substring(startPos, endPos) + "\"";
                //      rosters.add(playerName);
                //    }
                //  }
                // rosters.remove(0);//Remove junk at the begining of the line
                // team.roster=new ArrayList<String>(rosters);
            }
          }
        }
      }
      team.roster=new ArrayList<String>(rosters);
    }
  }
}
