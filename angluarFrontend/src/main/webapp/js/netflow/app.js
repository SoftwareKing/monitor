(function(angular){
    'use strict';
    var flow = angular.module('flow-module',[
        'ngRoute',
        'ngResource',
        'dataTablesDirective',
        'flow.controllers'
    ]);
    flow.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/netflow', {templateUrl: 'views/netflow/realtimeflow.html',controller: 'netflowController'});
        $routeProvider.when('/hostsStats', {templateUrl: 'views/netflow/hostsStats.html',controller: 'iframeController'});
        $routeProvider.when('/flowsStats', {templateUrl: 'views/netflow/flowsStats.html',controller: 'iframeController'});
        $routeProvider.when('/topApplication', {templateUrl: 'views/netflow/topApplication.html',controller: 'iframeController'});
        $routeProvider.when('/topHosts', {templateUrl: 'views/netflow/topHosts.html',controller: 'iframeController'});
        $routeProvider.when('/topFlowSenders', {templateUrl: 'views/netflow/topFlowSenders.html',controller: 'iframeController'});
    }]);
}(angular));
