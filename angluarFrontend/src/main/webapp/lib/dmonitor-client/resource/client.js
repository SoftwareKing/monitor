(function(angular){

var api_path = "../dmonitor-webapi";

angular.module('resource.client', ['ngResource'])

.factory('AboutClient', function($resource){
    return $resource(api_path+"/resources/about",{},{
//        get : {method:"GET",isArray:false}
    });
})

.factory('MocClient', function($resource){
    return $resource(api_path+"/resources/moc/:id",{},{
//        get : {method:"GET",isArray:false},
//        query : {method:"GET",isArray:true},
        restoreIcon : {url:api_path+"/resources/moc/:mocName/icon/restore",method:"POST",isArray:false}
    });
})

.factory('MetricClient', function($resource){
    return $resource(api_path+"/resources/metric/:id",{},{
//        get : {method:"GET",isArray:false},
//        query : {method:"GET",isArray:true},
        getByMoc : {url:api_path+"/resources/metric/moc/:id",method:"GET",isArray:true},
        getKpiByMo : {url:api_path+"/resources/metric/mo/:id",method:"GET",isArray:true},
        getMetricValues: {method: 'GET', url: api_path + "/resources/metric/values/mo/:id/:indicatorName", isArray: true}
    });
})

.factory('MetricColorClient', function($resource){
    return $resource(api_path+"/resources/metricColor/mocName/:mocName",{},{
        query : {method:"GET",isArray:true},
        save : {method:"POST",isArray:false},
        update : {method:"PUT",isArray:false},
        remove : {method:"DELETE",isArray:false},
        saveAll : {method: 'POST', url: api_path + "/resources/metricColor/saveAll", isArray: false},
        getElink : {method: 'GET', url: api_path + "/resources/metricColor/elink", isArray: true}
    });
})

.factory('MoClient', function($resource){
    return $resource(api_path+"/resources/mo/:id",{},{
//        get : {method:"GET",isArray:false},
        query : {method:"GET",isArray:false},
//        save : {method:"POST",isArray:false},
        update : {method:"PUT",isArray:false},
//        remove : {method:"DELETE",isArray:false},
        batchRemove : {url:api_path+"/resources/mo/batch",method:"DELETE",isArray:false},
        tree : {url:api_path+"/resources/motree",method:"GET",isArray:true},
        refresh : {url:api_path+"/resources/mo/:id/refresh",method:"GET",isArray:false},
        batchRefresh : {url:api_path+"/resources/mo/batch/refresh",method:"GET",isArray:false},
        test : {url:api_path+"/resources/mo/test",method:"POST",isArray:false},
        count : {url:api_path+"/resources/mo/count/:countBy",method:"GET",isArray:false},
        countAll : {url:api_path+"/resources/mo/count/all/:countBy",method:"GET",isArray:false},
        countJFAll : {url:api_path+"/resources/jfmo/count/all",method:"GET",isArray:false},
        getResource: {method: 'GET', url: api_path + "/resources/tree", isArray: false},
        getRoomEquipments: {method: 'GET', url: api_path + "/resources/assoc/:id", isArray: false},
        getHost:{method: 'GET', url: api_path + "/resources/mo/host", isArray: false},
        getSn:{method: 'POST', url: api_path + "/resources/mo/diskarray/sn", isArray: true},
        getClusterName:{method: 'POST', url: api_path + "/resources/mo/weblogiccluster/name", isArray: true},
        getServerName:{method: 'POST', url: api_path + "/resources/mo/weblogic/name", isArray: true},
        getInterfaceList:{method: 'POST', url: api_path + "/resources/mo/linux/interface", isArray: false}
    });
})

.factory('ProbeClient', function($resource){
    return $resource(api_path+"/resources/probe/:mocName",{},{
      query : {method:"GET",isArray:true},
      queryMetric : {url:api_path+"/resources/probe/metric/:metricId",method:"GET",isArray:true}
    });
})

.factory('DiscoveryClient', function($resource){
    return $resource(api_path+"/resources/discovery/job",{},{
        discover : {method:"POST",isArray:false},
        getResult : {method:"GET",isArray:false},
        load : {url:api_path+"/resources/discovery/load",method:"GET",isArray:false},
        save : {url:api_path+"/resources/discovery/save",method:"POST",isArray:false}
    });
})

.factory('LocationClient', function($resource){
    return $resource(api_path+"/resources/location",{},{
        query : {url:api_path+"/resources/location/tree",method:"GET",isArray:true},
        queryJf : {url:api_path+"/resources/location/jf",method:"GET",isArray:true},
        queryAll : {url:api_path+"/resources/location/all",method:"GET",isArray:true}
    });
})

.factory('AssocClient', function($resource){
    return $resource(api_path+"/resources/assoc/room/:rightMoId",{},{
        query : {method:"GET",isArray:false}
    });
})

.factory('RoomService',['$resource',function(resource){
    return resource("",{},{
        getSetting:{url:api_path+"/room",method:'GET',isArray:false},
        saveSetting:{method:'PUT',url:api_path+"/room",isArray:false},
        deleteSetting:{method:'DELETE',url:api_path+"/room",isArray:false},
        execute:{method:'POST',url:api_path+"/room",isArray:false}
    });
}]);

})(angular);