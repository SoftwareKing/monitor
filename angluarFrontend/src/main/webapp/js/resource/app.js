(function(angular){

angular.module('resource-module', ['ngRoute','ngResource','resource.lib','resource.discovery','resource.roomSync','resource.client','zTreeDirective','checkListDirective','datepickerDirective','maskLayerDirective','dataTablesDirective','util.filters','util.services','bootstrap.modal','ui.bootstrap','resource.monitor','resource.directives','resource.type'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/sourceType',{
	    templateUrl:'views/resource/resourceType.html',
	    controller:'resourceTypeCtrl'});
	$routeProvider.when('/sourceInstance',{
	    templateUrl:'views/resource/resourceInstance.html',
	    controller:'resourceInstanceCtrl'});
    $routeProvider.when('/resource/monitor', {
        templateUrl: 'views/resource/resourceMonitor.html',
        controller:'RsMonitorCtrl'});
}])
.run(['$rootScope','MocClient','MetricClient','LocationClient','MoClient','Util',function($rootScope,MocClient,MetricClient,LocationClient,MoClient,Util) {
    //公共部分
    $rootScope.resource = {
        moc : [],
        mocCount : null,
        metric : [],
        locationAll : [],
        businesses : [],
        businessReady:false,
        ready : false,
        getMoc : function(mocId){
            for(var i=0;i<$rootScope.resource.moc.length;i++){
                if($rootScope.resource.moc[i].id==mocId){
                    return $rootScope.resource.moc[i];
                }
                for(var j=0;j<$rootScope.resource.moc[i].children.length;j++){
                    if($rootScope.resource.moc[i].children[j].id==mocId){
                        return $rootScope.resource.moc[i].children[j];
                    }
                }
            }
            return null;
        },
        getMocByName : function(mocName){
            for(var i=0;i<$rootScope.resource.moc.length;i++){
                if($rootScope.resource.moc[i].name==mocName){
                    return $rootScope.resource.moc[i];
                }
                for(var j=0;j<$rootScope.resource.moc[i].children.length;j++){
                    if($rootScope.resource.moc[i].children[j].name==mocName){
                        return $rootScope.resource.moc[i].children[j];
                    }
                }
            }
            return null;
        },
        getLoc : function(locations,locId){
            for(var i=0;i<locations.length;i++){
                if(locations[i].id==locId){
                    return locations[i];
                }
                if(locations[i].children){
                    var result = $rootScope.resource.getLoc(locations[i].children,locId);
                    if(result!=null){
                        return result;
                    }
                }
            }
            return null;
        },
        getLocation : function(locId){
            return $rootScope.resource.getLoc($rootScope.resource.locationAll,locId);
        },
        fillLocList : function(locations,list){
            for(var i=0;i<locations.length;i++){
                list.push(locations[i]);
                if(locations[i].children && locations[i].children.length>0){
                    $rootScope.resource.fillLocList(locations[i].children,list);
                }
            }
        },
        // 所属业务
        loadBusiness : function(){
            MoClient.query(
                {mocpName:'application'},
                {},
                function(data){
                    $rootScope.resource.businesses = data.rows;
                    $rootScope.resource.businessReady = true;
                },
                function(){
//                    alert("读取资源类型基础信息失败,请刷新重试");
                }
            );
        },
        loadMoc : function(){
            MocClient.query(
                function(data){
                    $rootScope.resource.moc = data;
                },
                function(){
            //        alert("读取资源类型基础信息失败,请刷新重试");
                }
            );
        },
        loadMocCount : function(){
            MoClient.count({"countBy":"mocp"},{},function(data){  //data 只包含有mo的类型的统计数量
                for(var i=0;i<$rootScope.resource.moc.length;i++){
                    $rootScope.resource.moc[i].moCount = 0;
                    for(var mocpId in data){
                        if($rootScope.resource.moc[i].id == mocpId){
                            $rootScope.resource.moc[i].moCount = data[mocpId];
                            break;
                        }
                    }
                }
                $rootScope.resource.mocCount = data;
            });
        }
    };

    $rootScope.$watch("isLogin",function(newVal,oldVal){
        if(newVal){
            $rootScope.resource.loadBusiness();
            $rootScope.resource.loadMoc();
            $rootScope.resource.loadMocCount();
            MetricClient.query(
                function(data){
                    $rootScope.resource.metric = data;
                },
                function(){
            //        alert("读取指标基础信息失败,请刷新重试");
                }
            );

            LocationClient.queryAll(
                function(data){
                    $rootScope.resource.locationAll = data;
                },
                function(){
            //        alert("读取区域基础信息失败,请刷新重试");
                }
            );
        }
    });

    $rootScope.$watch("[resource.mocCount,resource.moc.length,resource.metric.length,resource.locationAll.length,resource.businessReady]",function(newValues,oldValues){
        if(newValues[0] && newValues[1] && newValues[2] && newValues[3]){
            $rootScope.resource.ready = true;
        }
    },true)

}]);

})(angular);