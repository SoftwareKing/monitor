(function(angular){

var api_path = "../dmonitor-webapi";

angular.module('audit.client', ['ngResource'])

.factory('AuditClient', function($resource){
    return $resource(api_path+"/audit",{},{
        query : {method:"GET",isArray:false},
        getModules: {method: 'GET', url: api_path + "/audit/module", isArray: false},
        getOperation: {method: 'GET', url: api_path + "/audit/operation", isArray: false},
        users:{method:'GET',url:api_path+'/operation/departUserTree',isArray:true}
    });
});

})(angular);