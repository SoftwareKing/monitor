(function(angular){

var api_path = "../dmonitor-webapi";

angular.module('ynp.client', ['ngResource'])

.factory('YNPClient', function($resource){
    return $resource(api_path+"/ynp",{},{
        getYNPLoginUrl: {method: 'GET', url: api_path + "/ynp/url/login", isArray: false},
        getYNPAccessTokenUrl: {method: 'GET', url: api_path + "/ynp/url/token", isArray: false},
        checkLogin : {url:api_path+"/ynp/check",method:"POST",isArray:false},
        bindUser : {url:api_path+"/ynp/bind",method:"POST",isArray:false}
    });
});

})(angular);