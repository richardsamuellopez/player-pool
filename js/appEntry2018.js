angular.module('poolEntry2018', [
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

  $scope.reloadPage = function(){window.location.reload();}

  // Local
  // fetch("http://localhost:8080/Rosters.json", {
  // Prod
  fetch("./Rosters.json", {
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }

  })
  .then(response => response.json())
  .then(json => {
    $scope.email="";
    $scope.entryName="";
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
