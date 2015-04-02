
var topo_path="../dmonitor-webapi/";
(function(angular){
    'use strict';
    var dm = angular.module('topo-module',[
        'ngRoute',
        'ngResource',
        'dnt.topo.services',
        'dnt.topo.controllers',
        'dnt.topo.directives'
    ]);
    dm.config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/gtopo/:classify', {templateUrl: 'views/topo/twaver/index.html',controller: 'topoController'});
        $routeProvider
            .when('/biz/:classify', {templateUrl: 'views/topo/twaver/index.html',controller: 'topoController'});
    }]);
})(angular);
