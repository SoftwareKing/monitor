
var simulation_path="../dmonitor-webapi/";
(function(angular){
    'use strict';
    var dm = angular.module('simulation-module',[
        'ngRoute',
        'ngResource',
        'dnt.simulation.services',
        'dnt.simulation.controllers',
        'dnt.simulation.directives'
    ]);
    dm.config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/simulation', {templateUrl: 'views/simulation/index.html',controller: 'simulationController'});
    }]);
})(angular);
