(function(angular){
    var web_path="../dmonitor-webapi";
    angular.module('log.services', ['ngResource'])
        .factory('log', function($resource){
//            return $resource("data/log"+'/:id', {}, {
            return $resource(web_path+'/:id/:tag/:para', {}, {
//                query: {method:'GET',params:{id:'sysloginfo.json'}, isArray:false}
                query: {method:'GET',params:{id:'log',tag:'syslog'}, isArray:false}
//                detail:{method:'GET',params:{id:'syslogdetail.json'},isArray:false}
            });
        });
})(angular);