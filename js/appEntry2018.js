angular.module('poolEntry2018', [
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
.filter('excludeFrom',function(){
      return function(array,expression,comparator){
        return array.filter(function(item){
          return !expression || !angular.equals(item,expression);
        });
      };
})
.controller('PoolCtrl', ['$scope', 'Tabletop', '$filter', '$timeout', '$interval', '$http', 'excludeFromFilter', function($scope, Tabletop, $filter, $timeout, $interval, $http, excludeFromFilter){
  $scope.currData="";
  $scope.prevData="";
  $scope.currPlayers="";
  $scope.prevPlayers="";

  LoadData();

  $scope.reloadPage = function(){window.location.reload();}

  function LoadData(){Tabletop.then(function(ttdata){
    var currTS = new Date();
    // console.log("Load Data: ",currTS);
    var data = ttdata[0];
    $scope.prevData=$scope.currData;
    $scope.currData=data;

    $scope.email="";
    $scope.entryName="";
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
    $scope.WC1=loadSeedData(_.union(data.Seed11.elements, data.Seed12.elements,data.Seed13.elements,data.Seed14.elements,data.Seed15.elements,data.Seed16.elements));
    $scope.WC2=$scope.WC1;
    function loadSeedData(SeedData){
      var teams = [];
      var players=[];
      var currTeam = ""
      for(x=0; x<SeedData.length; x++){
        if(SeedData[x].Team!="NO" && isNaN(SeedData[x].Team) && SeedData[x].Team!="--"){
          currTeam = SeedData[x].Team
          teams.push({name: currTeam, value: currTeam});
        } else {
          if(SeedData[x].Team!="NO")
            players.push({team: currTeam, name: SeedData[x].Player, value: SeedData[x].Player})
        }
      }
      return {teams, players};
    }
  });
  }
}]);
