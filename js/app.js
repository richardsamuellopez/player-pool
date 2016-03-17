angular
.module('pool', [
  'times.tabletop',
  'ui.bootstrap'
])
.config(function(TabletopProvider){
    TabletopProvider.setTabletopOptions({
      //2015 richardsamuellopez player Pool
      //  key: 'https://docs.google.com/spreadsheets/d/1o0qgdnj9YgMSNxm3vpRxRN39fa8xvE45S9PaqdXU-uk/pubhtml'
       // NCAA test live scores
       key: 'https://docs.google.com/spreadsheets/d/1vjOc59HxF7Fpfm5oiylUsGrj-OjKyMJ5IZcgD3_N5Cs/pubhtml'
      //coreywaddell 2016
      //key:'https://docs.google.com/spreadsheets/d/1CME_oDNIhPjLFTQz03ZLMSSYF3gx1MZ6eriBX8totYo/pubhtml'
    });
  })
.controller('PoolCtrl', function($scope, Tabletop){
    Tabletop.then(function(ttdata){
      var data = ttdata[0];

      console.log("DATA",data);
      $scope.players = data.Players.elements;
      $scope.entries= data.Standings.elements;
      console.log("Players: ",$scope.players);
      console.log("Entires: ",$scope.entries);
      $scope.seeds = 9;
      $scope.myOtherNumber = 10;
      $scope.getSeed = function(num) {
          return new Array(num);
      }

          // 32: "4"
          // 64: "22"
          // Championship: "0"
          // Elite 8: "6"
          // Final 4: "0"
          // Player: "Stanley Johnson"
          // Roster Count: "#REF!"
          // Still Alive?: "No"
          // Sweet 16: "12"
          // Team: "Arizona"
          // Total: "44"


          $scope.getPlayer = function(name){
            var index =_.findIndex($scope.players,{'Player':name});
            return _.find($scope.players,{'Player': name});
          };

          $scope.playerPoints = function(name){
            var player = $scope.getPlayer(name)
            var ttlPts = parseInt(player["64"])+parseInt(player["32"])+parseInt(player["Sweet 16"])+
            parseInt(player["Elite 8"])+parseInt(player["Final 4"])+parseInt(player["Championship"]);
            // return ttlPts;
            return 0;
          };

          $scope.teamPoints = function(team){
            var points = 0;
            for(i=1;i<10;i++){
              points+=$scope.playerPoints(team[i]);
            }
            points+=$scope.playerPoints(team.WC1);
            points+=$scope.playerPoints(team.WC2);
            team.totalTeamPoints=points;
            return points;
          };

          $scope.playerTeam = function(name){
            var player = $scope.getPlayer(name);
            return player.Team;
          };

          $scope.playerPointsByRound = function(name, round){
            var player = $scope.getPlayer(name);
            // return player[round];
          };
    });
});
