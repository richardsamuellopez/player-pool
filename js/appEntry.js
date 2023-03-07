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
  $scope.pinID = "entry.1759913902";
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
  $scope.pinCheckKey = "AKfycbzibVtGgi91JW0kRiBbKEeIegHkCkWdRTNFUgeP-YK8JudjQR9itiPQ4wazcJ_mT424";
  // END OF VARIABLES TO UPDATE

  $scope.error = false;
  $scope.pinVerified = false;
  $scope.checking = false;
  $scope.reloadPage = function(){window.location.reload();}
  $scope.checkEntry = function(){
    $scope.checking = true;
    if($scope.email !== '' && $scope.pin !== ''){
      fetch("https://script.google.com/macros/s/"+$scope.pinCheckKey+"/exec?email="+$scope.email+"&pin="+$scope.pin, {
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      })
      .then(response => response.json())
      .then(json => {
        if(json.success === true && json.data && json.data.trim() !== '' && json.error === false){
          $scope.entryName = json.data;
          $scope.pinVerified = true;
        } else {
          $scope.error = true;
        }
        $scope.checking = false;
        $scope.$apply();
      });
    } else {
      $scope.checking = false;
      $scope.$apply();
    };
  };

  $scope.setWCTeam = function(teams, player) {
    if(player){
      var teamObj = teams.filter(a => a.name === player.team);
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
    $scope.email="rsl1@gmail.com";
    $scope.entryName="";
    $scope.pin="";
    $scope.pin="6513333";
    $scope.Seed1=loadSeedData(json.teams.filter(team => team.seed === '1'));
    $scope.Seed2=loadSeedData(json.teams.filter(team => team.seed === '2'));
    $scope.Seed3=loadSeedData(json.teams.filter(team => team.seed === '3'));
    $scope.Seed4=loadSeedData(json.teams.filter(team => team.seed === '4'));
    $scope.Seed5=loadSeedData(json.teams.filter(team => team.seed === '5'));
    $scope.Seed6=loadSeedData(json.teams.filter(team => team.seed === '6'));
    $scope.Seed7=loadSeedData(json.teams.filter(team => team.seed === '7'));
    $scope.Seed8=loadSeedData(json.teams.filter(team => team.seed === '8'));
    $scope.Seed9=loadSeedData(json.teams.filter(team => team.seed === '9'));
    $scope.WC1=loadSeedData(json.teams.filter(team => parseInt(team.seed) >= 10).sort((a, b) => a.seed - b.seed));
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
