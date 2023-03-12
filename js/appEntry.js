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
  $scope.leagueSafe = "https://leaguesafe.com/join/4092721";
  $scope.emailID = "entry.2120297232";
  $scope.entryNameID = "entry.383545338";
  $scope.pinID = "entry.1759913902";

  $scope.fieldGroups = [
    {
      label: 'Seed #1',
      team: {
        entryId: 'entry.1059009687',
        value: ''
      },
      player: {
        entryId: 'entry.1589326624',
        value: ''
      }
    },
    {
      label: 'Seed #2',
      team: {
          entryId: 'entry.1792899743',
        value: ''
      },
      player: {
        entryId: 'entry.496616414',
        value: ''
      }
    },
    {
      label: 'Seed #3',
      team: {
          entryId: 'entry.298248963',
        value: ''
      },
      player: {
        entryId: 'entry.228107489',
        value: ''
      }
    },
    {
      label: 'Seed #4',
      team: {
        entryId: 'entry.1260734803',
        value: ''
      },
      player: {
        entryId: 'entry.1929196631',
        value: ''
      }
    },
    {
      label: 'Seed #5',
      team: {
        entryId: 'entry.265627880',
        value: ''
      },
      player: {
        entryId: 'entry.1438588206',
        value: ''
      }
    },
    {
      label: 'Seed #6',
      team: {
        entryId: 'entry.688877146',
        value: ''
      },
      player: {
        entryId: 'entry.718296763',
        value: ''
      }
    },
    {
      label: 'Seed #7',
      team: {
        entryId: 'entry.1554732274',
        value: ''
      },
      player: {
        entryId: 'entry.1222291357',
        value: ''
      }
    },
    {
      label: 'Seed #8',
      team: {
        entryId: 'entry.1767171400',
        value: ''
      },
      player: {
        entryId: 'entry.581849140',
        value: ''
      }
    },
    {
      label: 'Seed #9',
      team: {
        entryId: 'entry.99488968',
        value: ''
      },
      player: {
        entryId: 'entry.859580858',
        value: ''
      }
    },
    {
      label: 'Wild Card #1',
      team: {
        entryId: 'entry.654414173',
        value: ''
      },
      player: {
        entryId: 'entry.1145243786',
        value: ''
      }
    },
    {
      label: 'Wild Card #2',
      team: {
        entryId: 'entry.713813158',
        value: ''
      },
      player: {
        entryId: 'entry.862600197',
        value: ''
      }
    }
  ];

  $scope.API_KEY = "AKfycbwtwIjZgIRlnKpF4i_0Xph_reBstwlOsx08e1linn42Rt2WJZe8RsQkgSAbtG3glg3N";
  $scope.contactEmail = "corey.waddell@gmail.com";
  // END OF VARIABLES TO UPDATE

  $scope.error = false;
  $scope.pinVerified = false;
  $scope.checking = false;
  $scope.email="";
  $scope.entryName="";
  $scope.pin="";
  $scope.submitted = false;
  $scope.formStatus = "INITIAL";
  $scope.formIsLoading = function(){
    return $scope.formStatus === "LOADING";
  };
  $scope.formIsSuccess = function(){
    return $scope.formStatus === "SUCCESS";
  };
  $scope.formIsError = function(){
    return $scope.formStatus === "ERROR";
  };
  $scope.submitEntry = function(){
    if($scope.gform.$valid){
      $scope.submitted = true;
      $scope.formStatus = "LOADING";
      const rosterBody = buildSubmitBody();
      fetch(`https://script.google.com/macros/s/${$scope.API_KEY}/exec`,{
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: buildSubmitBody()
      })
      .then(response => response.json())
      .then(json => {
        if(json.success === true && json.error === false){
          $scope.formStatus = "SUCCESS";
          $('#gform *').fadeOut(2000);
          $('#finalRoster').fadeIn(2000);
        } else {
          $scope.formStatus = "ERROR";
        }
        $scope.$apply();
      }).catch(error => {
        $scope.formStatus = "ERROR";
        $scope.submitted = false;
        $scope.$apply();
      });
    }
  };

  const buildSubmitBody = () => {
    return `{
      "email": "${$scope.email}",
      "pin": "${$scope.pin}",
      "entryName": "${$scope.entryName}",
      "roster": [
        ${buildRoster()}
      ]
    }`;
  };

  const buildRoster = () => {
    return $scope.fieldGroups.map(seed => (`"${seed.player.value.team}", "${seed.player.value.name}"`));
  };

  $scope.reloadPage = function(){window.location.reload();}
  $scope.checkEntry = function(){
    $scope.checking = true;
    $scope.error = false;
    $scope.pinError = false;
    $scope.email = $scope.email.trim();
    if($scope.email && $scope.pin){
      fetch(`https://script.google.com/macros/s/${$scope.API_KEY}/exec?email=${$scope.email}&pin=${$scope.pin}`, {
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      })
      .then(response => response.json())
      .then(json => {
        if(json.success === true && json.data && json.data.trim() && json.error === false){
          $scope.entryName = json.data;
          $scope.pinVerified = true;
        } else {
          $scope.error = true;
          $scope.pinError = json.error;
        }
        $scope.checking = false;
        $scope.$apply();
      })
      .catch(error => {
        $scope.error = true;
        $scope.checking = false;
        $scope.$apply();
      });
    } else {
      $scope.checking = false;
    };
  };

  $scope.skipTeam = function(seed) {
    return function(value, index, array) {
      if($scope.seed.length === 11){
        if(seed > 8){
          if($scope.isWCSelected(seed, value)){
            return;
          }
        }
        return value;
      }
    }
};

  $scope.isWCSelected = function(seed, team){
    const WC1 = $scope.fieldGroups[9].team.value;
    const WC2 = $scope.fieldGroups[10].team.value;
    if((seed === 9 && WC2 && WC2.seed + " - " + WC2.name == `${team.seed} - ${team.name}`)
    ||(seed === 10 && WC1 && WC1.seed + " - " + WC1.name == `${team.seed} - ${team.name}`)) {
      return true;
    }
    return false;
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
    $scope.seed=[];
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '1')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '2')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '3')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '4')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '5')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '6')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '7')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '8')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => team.seed === '9')));
    $scope.seed.push(loadSeedData(json.teams.filter(team => parseInt(team.seed) >= 10).sort((a, b) => a.seed - b.seed)));
    $scope.seed.push(loadSeedData(json.teams.filter(team => parseInt(team.seed) >= 10).sort((a, b) => a.seed - b.seed)));
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
