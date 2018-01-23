angular
.module('poolEntry2018', [
  'times.tabletop',
  'ui.bootstrap'
])
.config(function(TabletopProvider){
    TabletopProvider.setTabletopOptions({
      // 2018 richardsamuellopez player Pool
      key: 'https://docs.google.com/spreadsheets/d/1RSb4W4XnXXOGCy2VBso3o8wagOy2ITl-avCAQWlwFRk/edit?usp=sharing'
      // key: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKqNLAb_8imNcULZU33HT5Y3za77qz-P05bpj3KkHwlSrz98h087XCbFAVwrP3JHAyPFJ_0uBDWTJM/pubhtml',
      parseNumbers:true,
    });

  })
.controller('PoolCtrl', function($scope, Tabletop, $filter, $timeout, $interval){
$scope.currData="";
$scope.prevData="";
$scope.currPlayers="";
$scope.prevPlayers="";
  LoadData();
  $interval(LoadData,97000);
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
