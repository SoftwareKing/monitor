(function(angular){

var api_path = "../dmonitor-webapi";

angular.module('room.client', ['ngResource'])

.factory('RoomClient', function($resource){
    return $resource(api_path+"/room",{},{
        activeRule:{method:'POST',url:api_path+'/alarm/roomRule/active',isArray:false},
        getUserGroups:{method:'GET',url:api_path+'/usergroup',isArray:false},
        getRules: {method:'GET',url:api_path+"/alarm/roomRule",isArray:false},
        getMetricByMocId:{method:'GET',url:api_path+'/resources/metric/select',isArray:true},
        editRule:{method:"POST",url:api_path+"/alarm/roomRule",isArray:false},
        getMoByMocId:{method:'GET',url:api_path+'/resources/mo',isArray:false},
        getCurrentEvent: {method:'GET',url:api_path+'/alarm/roomAlarm',isArray:false}
    });
});

})(angular);