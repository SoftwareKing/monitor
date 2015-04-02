
var businessChart_path="../dmonitor-webapi/";
(function(angular){
    'use strict';
    var dm = angular.module('businessChart-module',[
        'ngRoute',
        'ngResource',
        'dnt.businessChart.services',
        'dnt.businessChart.controllers',
        'dnt.businessChart.directives'
    ]);
    dm.config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/businessChart', {templateUrl: 'views/businessChart/index.html',controller: 'businessChartController'});
        $routeProvider
            .when('/alarmAffectColor', {templateUrl: 'views/businessChart/alarmAffectColor/index.html',controller: 'alarmAffectColorController'});
    }]);
})(angular);
