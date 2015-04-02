(function(angular){
    var web_path="../dmonitor-webapi";
    angular.module('flow.services', ['ngResource'])
        .factory('flow', function($resource){
            return $resource(web_path+'/:id/:tag/:para', {}, {
//                query: {method:'GET',params:{id:'log',tag:'syslog'}, isArray:false},
                getDataSrcIP: {method:'GET',url:web_path+'/traffic/summary',isArray:false},
                getDataTcp: {method:'GET',url:web_path+'/traffic/tcp',isArray:false},
                getDataUdp: {method:'GET',url:web_path+'/traffic/udp',isArray:false},
                getRealTime: {method:'GET',url:web_path+'/traffic/realTime',isArray:false},
                getNTopUrl:{method:"GET",url:web_path+'/traffic/url',isArray:false},
                getDetail: {method:'GET',url:web_path+'/traffic/detail',isArray:false}
            });
        });
})(angular);