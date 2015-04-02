(function(angular){
    var base_url = "../../../dmonitor-webapi";
    var dashboardServices = angular.module('dashboard.services', ['ngResource']);

    dashboardServices.factory('baseService',['$resource',function(resource){
         return resource(base_url + '/resources/mo' + '/:mo_id',{},{
                    getData:{method:'GET',isArray:false}
                });
    }]);

    dashboardServices.factory('LoginService',['$resource',function(resource){
        return resource(base_url + '/isLogin',{},{
            isLogin:{method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('locationService',['$resource',function(resource){
        return resource(base_url + '/operation/findJf',{},{
            getJfs:{method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('alarmCountService',['$resource',function(resource){
        return resource("",{},{
            getData:{method:'GET',url:base_url+"/alarm/event/current/count",isArray:false}
        });
    }]);

    dashboardServices.factory('getHisByNameService',['$resource',function(resource){
        return resource(base_url + '/history/performance' + '?moc_name=:moc_name&indicator_name=:indicator_name&metric_name=:metric_name&metric_args=:metric_args&start_time=:start_time&end_time=:end_time&mo_id=:mo_id&offset=:offset&limit=:limit',{},{
            getData:{method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('getHisTrendService',['$resource',function(resource){
        return resource(base_url + '/dashboard/performance/trend' + '?moc_name=:moc_name&indicator_name=:indicator_name&metric_name=:metric_name&metric_args=:metric_args&start_time=:start_time&end_time=:end_time&mo_id=:mo_id&offset=:offset&limit=:limit',{},{
            getData:{method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('dashboardPerformanceService',['$resource',function(resource){
        return resource(base_url + '/dashboard/performance' + '?moc_name=:moc_name&indicator_name=:indicator_name&metric_name=:metric_name&metric_args=:metric_args&start_time=:start_time&end_time=:end_time&mo_id=:mo_id&offset=:offset&limit=:limit',{},{
            getData:{method:'GET',isArray:false},
            getColor:{url:base_url + '/dashboard/color',method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('dashboardPropertyService',['$resource',function(resource){
        return resource(base_url + '/dashboard/property' + '?moc_name=:moc_name&indicator_name=:indicator_name&metric_name=:metric_name&metric_args=:metric_args&start_time=:start_time&end_time=:end_time&mo_id=:mo_id&offset=:offset&limit=:limit',{},{
            getData:{method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('stateService',['$resource',function(resource){
        return resource("",{},{
            getState:{url:base_url + "/dashboard/state",method:'GET',isArray:false}
        });
    }]);

    dashboardServices.factory('MocClient', function($resource){
        return $resource(base_url+"/resources/moc/:id",{},{
//        get : {method:"GET",isArray:false},
//        query : {method:"GET",isArray:true}
        });
    });

    dashboardServices.factory('MetricClient', function($resource){
            return $resource(base_url+"/resources/metric/:id",{},{
//        get : {method:"GET",isArray:false},
//        query : {method:"GET",isArray:true},
                getByMoc : {url:base_url+"/resources/metric/moc/:id",method:"GET",isArray:true},
                getKpiByMo : {url:base_url+"/resources/metric/mo/:id",method:"GET",isArray:true}
            });
        });

    dashboardServices.factory('MoClient', function($resource){
            return $resource(base_url+"/resources/mo/:id",{},{
//        get : {method:"GET",isArray:false},
                query : {method:"GET",isArray:false},
//        save : {method:"POST",isArray:false},
                update : {method:"PUT",isArray:false},
//        remove : {method:"DELETE",isArray:false},
                batchRemove : {url:base_url+"/resources/mo/batch",method:"DELETE",isArray:false},
                tree : {url:base_url+"/resources/motree",method:"GET",isArray:true},
                refresh : {url:base_url+"/resources/mo/:id/refresh",method:"GET",isArray:false},
                batchRefresh : {url:base_url+"/resources/mo/batch/refresh",method:"GET",isArray:false},
                test : {url:base_url+"/resources/mo/test",method:"POST",isArray:false}
            });
        });

    dashboardServices.factory('DiscoveryClient', function($resource){
            return $resource(base_url+"/resources/discovery/job",{},{
                discover : {method:"POST",isArray:false},
                getResult : {method:"GET",isArray:false}
            });
        });

    dashboardServices.factory('LocationClient', function($resource){
            return $resource(base_url+"/operation/locTree",{},{
//        query : {method:"GET",isArray:true}
            });
        });

})(angular);