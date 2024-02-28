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
.filter('safeHtml', function ($sce) {
  return function (val) {
      return $sce.trustAsHtml(val);
  };
})
.controller('PoolCtrl', ['$scope', '$filter', '$timeout', '$interval', '$http', 'excludeFromFilter', '$sce', function($scope, $filter, $timeout, $interval, $http, excludeFromFilter, $sce){
  $scope.form_enabled = false;
  $scope.loadingError = false;
  $scope.loading = true;
  $scope.loaded = false;
  $scope.API_KEY = "AKfycbw0Cth4JngSOr76bKjG9t_psihg4S0ONrmcTkyOC6NhMuqtjixXUvFDFWUU4YtP3ObD";
  $scope.error = false;
  $scope.pinVerified = false;
  $scope.checking = false;
  $scope.email="";
  $scope.entryName="";
  $scope.pin="";
  $scope.submitted = false;
  $scope.formStatus = "INITIAL";
  $scope.seed=[];
  $scope.fieldGroups = [
    {
      label: 'Seed #1',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #2',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #3',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #4',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #5',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #6',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #7',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #8',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Seed #9',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Wild Card #1',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    },
    {
      label: 'Wild Card #2',
      team: {
        value: ''
      },
      player: {
        value: ''
      }
    }
  ];

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

  const loadSeedData = (seedData) => {
    var teams = [];
    var players=[];
    seedData.forEach(team=>{
      teams.push({name: team.name, seed: team.seed});
      team.roster.forEach(player=>{
        players.push({team: team.name, name: player});
      });
    })
    return {teams, players};
  }

  fetch(`https://script.google.com/macros/s/${$scope.API_KEY}/exec?email=&pin=`, {
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    }
  })
  .then(response => response.json())
  .then(json => {
    if(json.data && json.data.settings && json.error === false){
      const settings = json.data.settings;
      $scope.form_enabled = settings.FORM_ENABLED;
      $scope.year = settings.YEAR || console.log("Error: Setting YEAR not found");
      $scope.deadLine = settings.DEADLINE || console.log("Error: Setting DEADLINE not found");
      $scope.fee = settings.ENTRY_FEE || console.log("Error: Setting ENTRY_FEE not found");
      $scope.leagueSafe = settings.LEAGUESAFE_LINK || console.log("Error: Setting LEAGUESAFE_LINK not found");
      $scope.contactEmail = settings.CONTACT_EMAIL || console.log("Error: Setting CONTACT_EMAIL not found");
      $scope.trackerLink = settings.TRACKER_LINK || console.log("Error: Setting TRACKER_LINK not found");
      $scope.oldTrackerLink = settings.OLD_TRACKER_LINK || console.log("Error: Setting OLD_TRACKER_LINK not found");
      const bracketData = settings.BRACKET ? JSON.parse(settings.BRACKET) : {};
      const bracket = bracketData?.teams ? bracketData.teams : [];
      if(bracket.length === 68 ){
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '1')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '2')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '3')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '4')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '5')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '6')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '7')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '8')));
        $scope.seed.push(loadSeedData(bracket.filter(team => team.seed === '9')));
        $scope.seed.push(loadSeedData(bracket.filter(team => parseInt(team.seed) >= 10).sort((a, b) => a.seed - b.seed)));
        $scope.seed.push(loadSeedData(bracket.filter(team => parseInt(team.seed) >= 10).sort((a, b) => a.seed - b.seed)));
      } else {
        console.log('The bracket is not the correct size.');
      }

      // Filter out any empty rules
      $scope.rules = json.data.rules.filter(el => {
        return el[0].length > 0;
      });

      // Process the rules
      $scope.rules.map(el => {
        if (el[0].includes("Place -")) { // Indent the payout rules
          el.push('PAYOUT');
        }
        if (el[0].includes('LeagueSafe')) { //Add Leaguesafe link
          el[0] = el[0].replace('LeagueSafe', `<a href="${$scope.leagueSafe}" target="_blank">LeagueSafe</a>`);
        }
        if (el[0].includes('Old Example Here')) { // Add old tracker link
          el[0] = el[0].replace('Old Example Here', `<a href="${$scope.oldTrackerLink}" target="_blank">Old Example Here</a>`);
        }
        if (el[0].includes('CANNOT')) { // Bold CANNOT
          el[0] = el[0].replace('CANNOT', `<b>CANNOT</b>`);
        }
        if (el[0].includes('DO NOT')) { // Bold DO NOT
          el[0] = el[0].replace('DO NOT', `<b>DO NOT</b>`);
        }
        if (el[0].includes('Important')) { // Bold Important
          el[0] = el[0].replace('Important', `<b>Important</b>`);
        }
      })
    } else {
      $scope.form_enabled = false;
      $scope.loadingError = true;
    }
    $scope.loading = false;
    $scope.loaded = !$scope.loading && !$scope.loadingError;

    $scope.$apply();
  })
  .catch(error => {
    $scope.loadingError = true;
    $scope.loading = false;

    $scope.$apply();
  });

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
    return (value, index, array) => {
      if($scope.seed.length === 11) {
        if(seed > 8){
          if($scope.isWCSelected(seed, value)) {
            return;
          }
        }
        return value;
      }
    }
  };

  $scope.isWCSelected = function(seed, team) {
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
}]);
