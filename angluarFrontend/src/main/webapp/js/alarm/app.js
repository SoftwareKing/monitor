(function(angular){

angular.module('alarm-module', ['alarm.alarm','alarm.group','alarm.client','alarm.baseline','alarm.baselineRule','ngRoute','ngResource','util.services','treeGrid','dnt.loading'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/alarmRule',{
            templateUrl:'views/alarm/rule.html',
            controller:'alarmRuleCtrl'});
        $routeProvider.when('/alarmReal',{
            templateUrl:'views/alarm/alarmReal.html',
            controller:'alarmRealCtrl'});
        $routeProvider.when('/alarmGroupRule', {
            templateUrl: 'views/alarm/alarm_group_rule.html',
            controller:'groupRoleCtrl'});
        $routeProvider.when('/alarmGroup', {
            templateUrl: 'views/alarm/alarm_group.html',
            controller:'groupAlarmCtrl'});
        $routeProvider.when('/alarmGroupHistory', {
            templateUrl: 'views/alarm/alarm_group.html',
            controller:'groupAlarmCtrl'});
        $routeProvider.when('/baseline', {
            templateUrl: 'views/alarm/baseline.html',
            controller:'baselineCtrl'});
        $routeProvider.when('/baselineRule', {
            templateUrl: 'views/alarm/baselineRule.html',
            controller:'baselineRuleCtrl'});
}])
.run(['$rootScope','Util',function($rootScope,Util) {
    //公共部分
    $rootScope.alarm = {
        const: {
            noticeWay: [
                {"label": "短信", "value": "SMS"},
                {"label": "邮件", "value": "Email"}
            ],
            weekdays: [
                {"label": "星期日", "value": 7},
                {"label": "星期一", "value": 1},
                {"label": "星期二", "value": 2},
                {"label": "星期三", "value": 3},
                {"label": "星期四", "value": 4},
                {"label": "星期五", "value": 5},
                {"label": "星期六", "value": 6}
            ],
            levels: [
                {"label": '<img ng-src="img/alarm/6.png"/>', "value": 6},
                {"label": '<img ng-src="img/alarm/5.png"/>', "value": 5},
                {"label": '<img ng-src="img/alarm/4.png"/>', "value": 4},
                {"label": '<img ng-src="img/alarm/3.png"/>', "value": 3},
                {"label": '<img ng-src="img/alarm/2.png"/>', "value": 2}
            ],
            intervals: [
                {"label": "30秒", "value": 30},
                {"label": "1分钟", "value": 60},
                {"label": "5分钟", "value": 300},
                {"label": "30分钟", "value": 1800},
                {"label": "2小时", "value": 7200},
                {"label": "1天", "value": 86400}
            ]
        }
    }
}]);

})(angular);