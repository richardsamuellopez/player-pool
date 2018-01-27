angular
.module('poolEntry2018', [
  'times.tabletop',
  'ui.bootstrap'
])
.config(function(TabletopProvider){
    TabletopProvider.setTabletopOptions({
      //2018 richardsamuellopez player Pool
      key: '1RSb4W4XnXXOGCy2VBso3o8wagOy2ITl-avCAQWlwFRk',
      // key: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKqNLAb_8imNcULZU33HT5Y3za77qz-P05bpj3KkHwlSrz98h087XCbFAVwrP3JHAyPFJ_0uBDWTJM/pubhtml',
      parseNumbers:true,
      wanted:["Seed1","Seed2","Seed3","Seed4","Seed5","Seed6","Seed7","Seed8","Seed9","Seed10","Seed11","Seed12","Seed13","Seed14","Seed15","Seed16"]
    });

  })
.controller('PoolCtrl', function($scope, Tabletop, $filter, $timeout, $interval){
$scope.currData="";
$scope.prevData="";
$scope.currPlayers="";
$scope.prevPlayers="";
  LoadData();
  // $interval(LoadData,97000);
$scope.clearSearch = function(){
$scope.searchText="";
};

$scope.reloadPage = function(){window.location.reload();}
    function LoadData(){Tabletop.then(function(ttdata){
      var currTS = new Date();
      // console.log("Load Data: ",currTS);
      var data = ttdata[0];
      $scope.prevData=$scope.currData;
      $scope.currData=data;


      console.log("DATA",data);
      $scope.email="TEMP EMAIL";
      $scope.entryName="TEMP ENTRY";
      $scope.Seed1=loadSeedData(data.Seed1.elements);
      $scope.Seed2=loadSeedData(data.Seed2.elements);
      $scope.Seed3=loadSeedData(data.Seed3.elements);
      $scope.Seed4=loadSeedData(data.Seed4.elements);
      $scope.Seed5=loadSeedData(data.Seed5.elements);
      $scope.Seed6=loadSeedData(data.Seed6.elements);
      $scope.Seed7=loadSeedData(data.Seed7.elements);
      $scope.Seed8=loadSeedData(data.Seed8.elements);
      $scope.Seed9=loadSeedData(data.Seed9.elements);
      $scope.Seed10=loadSeedData(data.Seed10.elements);
      // $scope.Seed11=loadSeedData(data.Seed11.elements);
      // $scope.Seed12=loadSeedData(data.Seed12.elements);
      // $scope.Seed13=loadSeedData(data.Seed13.elements);
      // $scope.Seed14=loadSeedData(data.Seed14.elements);
      // $scope.Seed15=loadSeedData(data.Seed15.elements);
      // $scope.Seed16=loadSeedData(data.Seed16.elements);
      $scope.WC1=loadSeedData(_.union(data.Seed11.elements, data.Seed12.elements,data.Seed13.elements,data.Seed14.elements,data.Seed15.elements,data.Seed16.elements));
      $scope.WC2=$scope.WC1;
      function loadSeedData(SeedData){
        console.log("SeedData: ", SeedData);
        var teams = [];// _.filter(SeedData, function(o) { return o.Team != "NO" && isNaN(o.Team); });
        console.log("teams: ", teams);
        var players=[];
        var currTeam = ""
        for(x=0; x<SeedData.length; x++){
          if(SeedData[x].Team!="NO" && isNaN(SeedData[x].Team) && SeedData[x].Team!="--"){
            currTeam = SeedData[x].Team
            teams.push({name: currTeam, value: currTeam});
          } else {
            if(SeedData[x].Team!="NO")
              players.push({team: currTeam, name: SeedData[x].Player})
          }
        }
        console.log("TEAMS: ", teams);
        console.log("Players: ", players);
        return {teams, players};
      }

      console.log("SEED1DATA: ", $scope.Seed1);
      // $scope.players = data.Players.elements;
      // $scope.prevPlayers=$scope.currPlayers;
      // $scope.currPlayers=$scope.players;
      //
      // $scope.diffPlayers=_.difference($scope.currPlayers,$scope.prevPlayers);
      // // console.log("DIFF: ",$scope.diffPlayers);
      // $scope.entries= data.Standings.elements;
      //  var orderBy = $filter('orderBy');
      //  angular.forEach($scope.entries, function (entry) {
      //    entry.TotalPoints = parseFloat(entry.TotalPoints);
      //  });
      //  $scope.entries= orderBy($scope.entries, 'TotalPoints',  true);
      // // console.log("Players: ",$scope.players);
      // // console.log("Entires: ",$scope.entries);
      // $scope.seeds = 9;
      // $scope.myOtherNumber = 10;
      // $scope.getSeed = function(num) {
      //     return new Array(num);
      // }
      //
      //     // 32: "4"
      //     // 64: "22"
      //     // Championship: "0"
      //     // Elite 8: "6"
      //     // Final 4: "0"
      //     // Player: "Stanley Johnson"
      //     // Roster Count: "#REF!"
      //     // Still Alive?: "No"
      //     // Sweet 16: "12"
      //     // Team: "Arizona"
      //     // Total: "44"
      //     $scope.getIndex = function(entry){
      //      return $scope.entries.indexOf(entry)+1;
      //    };
      //     $scope.getPlayer = function(name){
      //       var index =_.findIndex($scope.players,{'Player':name});
      //       return _.find($scope.players,{'Player': name});
      //     };
      //
      //     $scope.playerPoints = function(name){
      //       var player = $scope.getPlayer(name)
      //       // var ttlPts = parseInt(player["64"])+parseInt(player["32"])+parseInt(player["Sweet 16"])+
      //       // parseInt(player["Elite 8"])+parseInt(player["Final 4"])+parseInt(player["Championship"]);
      //       // return ttlPts;
      //       return parseInt(player.Total);
      //     };
      //
      //     $scope.teamPoints = function(team){
      //       var points = 0;
      //       for(i=1;i<10;i++){
      //         points+=$scope.playerPoints(team[i]);
      //       }
      //       points+=$scope.playerPoints(team.WC1);
      //       points+=$scope.playerPoints(team.WC2);
      //       team.totalTeamPoints=points;
      //       return points;
      //     };
      //
      //     $scope.playerTeam = function(name){
      //       var player = $scope.getPlayer(name);
      //       return player.Team;
      //     };
      //
      //     $scope.playerPointsByRound = function(name, round){
      //       var player = $scope.getPlayer(name);
      //       return player[round];
      //     };
      //
      //     $scope.isEliminated = function(name){
      //       var player=$scope.getPlayer(name);
      //       return player.StillAlive==="No";
      //     };
    });
  }
});
