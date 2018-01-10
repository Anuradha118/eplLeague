
// first we have to declare the module. note that [] is where we will declare the dependecies later. Right now we are leaving it blank
var myApp = angular.module('eplApp', ['ngRoute']); 


// this is without $scope
myApp.controller('mainController',['$http', '$q','$filter',function($http, $q,$filter) {

var main = this; 

this.pageHeading = 'English Premier League';
  this.pageSubHeading = 'Fixtures for 2015/16/17 by epl.com'
  this.currentPage=0;
  this.pageSize=20;
  
  this.rounds = [];

  this.searchText='';

this.getData = function () {

  return $filter('filter')(main.rounds, main.searchText)

   };

this. numberOfPages=function(){
  return Math.ceil(main.getData().length/main.pageSize);                
 };

this.loadAllMatches = function(){ 
var promise1 = $http({method: 'GET', url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json', cache: 'true'}); 
var promise2 = $http({method: 'GET', url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json', cache: 'true'}); 

$q.all([promise1, promise2]).then(function(response){ 
for (var i in response[0].data.rounds) { 
response[0].data.rounds[i].name = response[0].data.rounds[i].name+'(2015-2016)';	
} 
for (var i in response[1].data.rounds) { 
response[1].data.rounds[i].name = response[1].data.rounds[i].name+'(2016-2017)';	
} 
main.rounds = response[0].data.rounds.concat(response[1].data.rounds); 
// console.log(main.rounds); 

}); 

};
  this.loadAllMatches();
}]); // end controller

myApp.filter('startFrom', function() {
  return function(input, start) {
  start = +start; //parse to int
  return input.slice(start);
 }
});
// myApp.filter("myFilter",function(){
//   return function(matches,searchText){
//     // var out=[];
//     if(searchText!==null){
//       for(var j=0;j<matches.length;j++){
//         var match=matches[j];
//         if(match.date.getFullYear()===searchText){
//           return match;
//         }
//       }
//     }
//       // return out;
//   }
// });



myApp.controller('singleMatchController',['$http','$routeParams','$q',function($http,$routeParams,$q) {

  //create a context
  var main = this;


  this.pageHeading = '';
  this.pageSubHeading = ''
  this.singlematch;

  /*this.getParameterByName = function(name){

      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));


  }// end get parameter by name*/

  this.loadDetails=false;
  this.roundname=$routeParams.roundname;
  this.teamname=$routeParams.teamname;
  
  this.getMatchByName=function(matches){
    for(i in matches){
      if(matches[i].team1.name===main.teamname||matches[i].team2.name===main.teamname){
        return matches[i];
      }
    }
  }
  this.rounds=[];
  this.text='';
  // this.baseUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master';

  this.loadSingleMatch = function(){
    var promise1 = $http({method: 'GET', url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json', cache: 'true'}); 
    var promise2 = $http({method: 'GET', url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json', cache: 'true'}); 

    $q.all([promise1, promise2]).then(function(response){ 
    for (var i in response[0].data.rounds) { 
      response[0].data.rounds[i].name = response[0].data.rounds[i].name+'(2015-2016)';	
    } 
    for (var i in response[1].data.rounds) { 
      response[1].data.rounds[i].name = response[1].data.rounds[i].name+'(2016-2017)';	
    } 
    main.rounds = response[0].data.rounds.concat(response[1].data.rounds);

    main.rounds.map(function(round){
      if(round.name===main.roundname){
        main.singlematch=main.getMatchByName(round.matches);
        main.loadDetails=true;        
      }
    })
    
    var goals;
    if(main.singlematch.score1>main.singlematch.score2){
      goals=main.singlematch.score1-main.singlematch.score2;
      main.text=main.singlematch.team1.name+" won by "+goals+" goal(s).";
    }
    else if(main.singlematch.score1<main.singlematch.score2){
      goals=main.singlematch.score2-main.singlematch.score1;
      main.text=main.singlematch.team2.name+" won by "+goals+" goal(s).";         
    }
    else{
      main.text="Match is Draw";          
    }

  }); 

};
}]); // end controller


myApp.controller('matchStatisticsController',['$http','$q',function($http,$q) {

  //create a context
  var main = this;


  this.pageHeading = 'Match Statistics';
  
  this.matches=[];
  this.rounds=[];
  this.teams=[];
  this.uniqueteams=[];
  this.teamStatistics=[];
  this.matchesPlayed=0;
  this.goalsScored=0;
  this.matchesWon=0;
  this.matchesLost=0;
  this.matchesDraw=0;
  this.matchSatisticsDetails = function(){
    var promise1 = $http({method: 'GET', url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json', cache: 'true'}); 
    var promise2 = $http({method: 'GET', url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json', cache: 'true'}); 

    $q.all([promise1, promise2]).then(function(response){ 
    for (var i in response[0].data.rounds) { 
      response[0].data.rounds[i].name = response[0].data.rounds[i].name+'(2015-2016)';	
    } 
    for (var i in response[1].data.rounds) { 
      response[1].data.rounds[i].name = response[1].data.rounds[i].name+'(2016-2017)';	
    } 
    main.rounds = response[0].data.rounds.concat(response[1].data.rounds);
    
    main.rounds.map(function(item){
      item.matches.map(function(match){
        main.matches.push(match);
        main.teams.push(match.team1);
        main.teams.push(match.team2);
      });
    });
    // console.log(main.teams);
    main.uniqueteams=[... new Set(main.teams.map(item=>item.name))];
    // console.log(main.uniqueteams);

    for(i in main.uniqueteams){
      for(j in main.matches){
        if(main.matches[j].team1.name===main.uniqueteams[i] || main.matches[j].team2.name===main.uniqueteams[i]){
          main.matchesPlayed=main.matchesPlayed+1;
        }

        if(main.matches[j].team1.name===main.uniqueteams[i]){
          var score1=main.matches[j].score1;
          var score2=main.matches[j].score2;
          if(score1>score2){
            main.matchesWon=main.matchesWon+1;
          }
          else if(score1===score2){
            main.matchesDraw=main.matchesDraw+1;
          }
          main.goalsScored=main.goalsScored+score1;
        }
        else if(main.matches[j].team2.name===main.uniqueteams[i]){
          var score1=main.matches[j].score1;
          var score2=main.matches[j].score2;
          if(score2>score1){
            main.matchesWon=main.matchesWon+1;
          }
          else if(score1===score2){
            main.matchesDraw=main.matchesDraw+1;
          }
          main.goalsScored=main.goalsScored+score2;          
        }
      }
      
      main.matchesLost=main.matchesPlayed-(main.matchesWon+main.matchesDraw);
      
      main.teamStatistics
      .push({
        teamName : main.uniqueteams[i],
        matchesPlayed : main.matchesPlayed,
        matchesWon : main.matchesWon,
        matchesDraw : main.matchesDraw,
        matchesLost : main.matchesLost,
        goalsScored : main.goalsScored
      });

      main.matchesPlayed=0;
      main.matchesWon=0;
      main.matchesDraw=0;
      main.matchesLost=0;
      main.goalsScored=0;
  }
  // console.log(main.teamStatistics);
  }); 

};
  // this.matchSatisticsDetails();

}]); //