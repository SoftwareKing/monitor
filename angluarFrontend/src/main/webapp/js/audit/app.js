(function(angular){

angular.module('audit-module', ['ngRoute','ngResource','audit.controllers','audit.client','zTreeDirective','checkListDirective','dataTablesDirective','util.filters','util.services','datepickerDirective','bootstrap.modal'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/audit',{
	    templateUrl:'views/audit/audit.html',
	    controller:'auditCtrl'});
}])
.run(['$rootScope','AuditClient',function($rootScope,AuditClient) {
    //公共部分
    $rootScope.audit = {
        module : {},
        operation:{}
    };

    AuditClient.getModules(
        function(data){
            $rootScope.audit.module = data;
        }
    );
    AuditClient.getOperation(
        function(data){
            $rootScope.audit.operation = data;
        }
    );
}]);
})(angular);