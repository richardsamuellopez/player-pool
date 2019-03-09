import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.MalformedURLException;
import java.util.*;

public class HTMLRead {
  public static String bracketFile = "Bracket.txt";
  public static String TeamIDsFile = "TeamIDs.txt";
  public static String JSONFile = "Rosters.json";
  public static  ArrayList<Team> BracketList = new ArrayList<Team>();
  // public static String BracketURL = "https://en.wikipedia.org/wiki/2017_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";
  public static String BracketURL = "https://en.wikipedia.org/wiki/2018_NCAA_Division_I_Men%27s_Basketball_Tournament#Tournament_seeds";

  static class Team {
    String name;
    int seed;
    int teamID;
    ArrayList<String> roster;
  }

  public static void main(String[] args) throws IOException {
    // Read seeds and teams from wikipedia
    readBracket();

    // If wikipedia is not updated add the seed, team to bracket.txt and run fillBracket instead of readBracket
    // fillBracket();

    // Read team ids from ESPN
    readTeamIDs();

    // Read roster from ESPN
    readRosters();

    // Output to json data to a file
    createJSONOutput();

    // System.out.println("BracketList: "+ BracketList);
    // BracketList.forEach(team->System.out.println(team.name+ " "+ team.seed+" "+team.teamID+" "+team.roster));

    // for(ArrayList team: BracketList){
    //   System.out.println("TEAM: " + team.name + team.seed);
    // }
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
      endPos = line.indexOf(",");
      startPos = 0;
      seed = line.substring(startPos, endPos);
      team = line.substring(endPos+1).trim();
      Team newTeam = new Team();

      newTeam.name = team;
      newTeam.seed = Integer.parseInt(seed);
      newTeam.teamID = 0;
      BracketList.add(newTeam);

    }

    // Always close files.
    bufferedReader.close();

  }

  public static void readBracket() throws IOException, MalformedURLException {
    System.out.println("Read Bracket From wikipedia");
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
        if(line.contains("<tr>")){
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
          if(line.contains("11*") || line.contains("16*")){
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
        if(getTeam && line.contains("</a>")){
          // System.out.println("Team : "+line+"\n");
          getTeam = false;
          getSeed = false;
          endPos = line.length()-4;//line.indexOf("</a></th>");
          startPos = line.lastIndexOf("team\">", endPos)+6;
          team = line.substring(startPos, endPos);
          // System.out.println("TEAM: "+line+"\n");
          // System.out.println("TEAM COUNT: " + teamCount+"\n");
          bufferedWriter.write(seed + ", ");
          bufferedWriter.write(team+"\n");
          // System.out.println("SEED: "+seed+" TEAM: "+team+"\n");

          Team newTeam = new Team();
          switch (team) {
              case "Miami (FL)":  team = "Miami";
                    break;
              case "Mount St. Mary's":  team = "Mt. St. Mary's";
                    break;
              case "Cal State Fullerton": team = "CSU Fullerton";
                    break;
              case "College of Charleston": team = "Charleston";
                    break;
              case "Loyola–Chicago": team = "Loyola-Chicago";
                    break;
              case "Texas A&amp;M": team = "Texas A&M";
                    break;
              case "Penn": team = "Pennsylvania";
                    break;
          }

          newTeam.name = team;
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

  public static void readTeamIDs() throws IOException, MalformedURLException {
    System.out.println("Read team IDs from ESPN");
    URL url = new URL("http://www.espn.com/mens-college-basketball/team/stats/_/id/399");
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
      if(line.contains("<option value=\"\">Men's College Basketball Teams</option>")){
          // idArray = line.split("</option><option value=\"http://www.espn.com/mens-college-basketball/team/stats/_/id/");
          idArray = line.split("</option><option value=\"//www.espn.com/mens-college-basketball/team/stats/_/id/");
      }
    }
    String teamLine = "";
    int TeamCount = 0;
    int bracketPos = -1;
    String teamName = "";
    String teamID = "";
    for(String IDline: idArray){
      teamLine = IDline.replace("\">",", ");
      endPos = teamLine.indexOf("</option></select></form>");

      if(endPos>-1){
        teamLine = teamLine.substring(1,endPos);
      }
      if(teamCount>0){
        bufferedWriter.write(teamLine+"\n");
        teamID = teamLine.split("\\,")[0];
        teamName = teamLine.substring(teamLine.indexOf(",")+1).trim();
        Team currTeam = new Team();
        currTeam.name=teamName;
        // bracketPos = BracketList.indexOf(teamName);
        final String finalTeam = teamName;
        final String finalID = teamID;
        BracketList.forEach(team->{
          if(team.name.equals(finalTeam)){
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

  public static void readRosters() throws IOException, MalformedURLException {
    System.out.println("Read Rosters from ESPN");
    for (Team team : BracketList) {
      System.out.println(team.name + team.teamID);
      URL url = new URL("http://www.espn.com/mens-college-basketball/team/roster/_/id/"+String.valueOf(team.teamID));
      // Get the input stream through URL Connection
      URLConnection con = url.openConnection();
      InputStream is =con.getInputStream();

      BufferedReader br = new BufferedReader(new InputStreamReader(is));

      String line = null;
      Boolean inTable = false;
      String[] rosterArray = new String[0];
      ArrayList<String> rosters = new ArrayList<String>();

      while ((line = br.readLine()) != null) {
        // Get line from website
        if(line.contains("<table ")){
             rosterArray = line.split("<a href=\"http://www.espn.com/mens-college-basketball/player");
             int endPos = -1;
             int startPos = -1;
             String playerName = "";
             for(String player: rosterArray){
               startPos = player.indexOf("\">")+2;
               endPos = player.indexOf("</a>");
               if(startPos>-1){
                 playerName = "\"" + player.substring(startPos, endPos) + "\"";
                 rosters.add(playerName);
               }
             }
            rosters.remove(0);//Remove junk at the begining of the line
            team.roster=new ArrayList<String>(rosters);
        }
      }
    }
  }
}