(function(angular){
    'use strict';
    var log = angular.module('log-module',[
        'ngRoute',
        'ngResource',
        'dataTablesDirective',
        'log.controllers'
        ,'log.event'
        ,'logApp'
    ]);
    log.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/syslog', {templateUrl: 'views/log/syslog.html',controller: 'syslogController'});
        $routeProvider.when('/trap', {templateUrl: 'views/log/trap.html',controller: 'trapController'});
    }]);
}(angular));
