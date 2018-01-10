//var myApp = angular.module('blogApp', ['ngRoute']); 

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
            // location of the template
        	templateUrl		: 'views/index-view.html',
        	// Which controller it should use 
            controller 		: 'mainController',
            // what is the alias of that controller.
        	controllerAs 	: 'myMatches'
        })
        .when('/matchStatistics',{
        	templateUrl     : 'views/matchstatistics-view.html',
        	controller 		: 'matchStatisticsController',
        	controllerAs 	: 'matchStatistics'
        })
        .when('/match/:roundname/:teamname',{

        	templateUrl     : 'views/match-view.html',
        	controller 		: 'singleMatchController',
        	controllerAs 	: 'singleMatch'
        })

        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );
}]);