angular.module('poolEntry', [
  'ui.bootstrap'
])
.filter('excludeFrom',function(){
  return function(array,expression,comparator){
    return array.filter(function(item){
      return !expression || !angular.equals(item,expression);
    });
  };
})
.controller('PoolCtrl', ['$scope', '$filter', '$timeout', '$interval', '$http', 'excludeFromFilter', function($scope, $filter, $timeout, $interval, $http, excludeFromFilter){
  // UPDATE THE BELOW VARIABLES EACH YEAR
  $scope.year = '2023';
  $scope.deadLine = 'noon EST, Thursday, March 16th';
  $scope.fee = "$50";
  $scope.emailID = "entry.2120297232";
  $scope.entryNameID = "entry.383545338";
  $scope.pinID = "entry.new";
  $scope.seed1Team = "entry.1059009687"
  $scope.seed1Player = "entry.1589326624"
  $scope.seed2Team = "entry.1792899743"
  $scope.seed2Player = "entry.496616414"
  $scope.seed3Team = "entry.298248963"
  $scope.seed3Player = "entry.228107489"
  $scope.seed4Team = "entry.1260734803"
  $scope.seed4Player = "entry.1929196631"
  $scope.seed5Team = "entry.265627880"
  $scope.seed5Player = "entry.1438588206"
  $scope.seed6Team = "entry.688877146"
  $scope.seed6Player = "entry.718296763"
  $scope.seed7Team = "entry.1554732274"
  $scope.seed7Player = "entry.1222291357"
  $scope.seed8Team = "entry.1767171400"
  $scope.seed8Player = "entry.581849140"
  $scope.seed9Team = "entry.99488968"
  $scope.seed9Player = "entry.859580858"
  $scope.seedWC1Team = "entry.654414173"
  $scope.seedWC1Player = "entry.1145243786"
  $scope.seedWC2Team = "entry.713813158"
  $scope.seedWC2Player = "entry.862600197"
  // END OF VARIABLES TO UPDATE

  $scope.reloadPage = function(){window.location.reload();}
  $scope.setWCTeam = function(teams, player) {
    if(player){
      var teamObj = _.where(teams,{name: player.team});
      var returnValue = {name: teamObj[0].name, seed: teamObj[0].seed};
      return returnValue;
    }
  };

  // Local
  // fetch("http://localhost:8080/data/Rosters.json", {
  // Prod
  fetch("./data/Rosters.json", {
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }

  })
  .then(response => response.json())
  .then(json => {
    $scope.email="";
    $scope.entryName="";
    $scope.pin="";
    $scope.Seed1=loadSeedData(_.where(json.teams,{seed:'1'}));
    $scope.Seed2=loadSeedData(_.where(json.teams,{seed:'2'}));
    $scope.Seed3=loadSeedData(_.where(json.teams,{seed:'3'}));
    $scope.Seed4=loadSeedData(_.where(json.teams,{seed:'4'}));
    $scope.Seed5=loadSeedData(_.where(json.teams,{seed:'5'}));
    $scope.Seed6=loadSeedData(_.where(json.teams,{seed:'6'}));
    $scope.Seed7=loadSeedData(_.where(json.teams,{seed:'7'}));
    $scope.Seed8=loadSeedData(_.where(json.teams,{seed:'8'}));
    $scope.Seed9=loadSeedData(_.where(json.teams,{seed:'9'}));
    $scope.WC1=loadSeedData(_.union(_.where(json.teams,{seed:'10'}),_.where(json.teams,{seed:'11'}), _.where(json.teams,{seed:'12'}),_.where(json.teams,{seed:'13'}),_.where(json.teams,{seed:'14'}),_.where(json.teams,{seed:'15'}),_.where(json.teams,{seed:'16'})));
    $scope.WC2=$scope.WC1;
    $scope.$apply();

    function loadSeedData(SeedData){
      var teams = [];
      var players=[];
      // for(team=0; team<SeedData.length; team++){
      //   teams.push({name: SeedData[team].team});
      //   console.log("TEAM: ", SeedData[team].team);
      //   for(player=0; player<SeedData[team].roster.length; player++){
      //     players.push({team: SeedData[team].team, name: SeedData[team].roster[player]});
      //   }
      // }
      SeedData.forEach(team=>{
        teams.push({name: team.team, seed: team.seed});
        team.roster.forEach(player=>{
          players.push({team: team.team, name: player});
        });
      })
      return {teams, players};
    }
  });
}]);
