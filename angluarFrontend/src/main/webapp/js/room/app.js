(function(angular){

angular.module('room-module', ['ngRoute','ngResource','room.client','room.event','room.rule','zTreeDirective','checkListDirective','datepickerDirective','maskLayerDirective','dataTablesDirective','util.filters','util.services','bootstrap.modal','ui.bootstrap'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/roomAlarmEvent',{
	    templateUrl:'views/room/roomEvent.html',
	    controller:'roomEventCtrl'});
    $routeProvider.when('/roomAlarmEventHistory',{
        templateUrl:'views/room/roomEvent.html',
        controller:'roomEventCtrl'});
	$routeProvider.when('/roomAlarmRule',{
	    templateUrl:'views/room/roomRule.html',
	    controller:'roomRuleCtrl'});
}])
.run(['$rootScope','Util',function($rootScope,Util) {
    //公共部分
}]);

})(angular);