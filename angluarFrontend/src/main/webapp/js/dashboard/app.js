(function(angular){
    var dashboardItems = [
        //host
        {"path": "/windows", templateUrl: "host/windows.html"},
        {"path": "/aix", templateUrl: "host/windows.html"},
        {"path": "/hpux", templateUrl: "host/windows.html"},
        {"path": "/linux", templateUrl: "host/windows.html"},
        {"path": "/solaris", templateUrl: "host/windows.html"},
        //db
        {"path": "/oracle", templateUrl: "db/oracle.html"},
        {"path": "/mssql", templateUrl: "db/mssql.html"},
        {"path": "/sybase", templateUrl: "db/sybase.html"},
        {"path": "/oraclerac", templateUrl: "db/oraclerac.html"},
        //middle
        {"path": "/mq", templateUrl: "middle/iis.html"},
        {"path": "/iis", templateUrl: "middle/iis.html"},
        {"path": "/weblogic", templateUrl: "middle/iis.html"},
        {"path": "/weblogiccluster", templateUrl: "middle/iis.html"},
        //network
        {"path": "/router", templateUrl: "network/router.html"},
        {"path": "/switch2", templateUrl: "network/router.html"},
        {"path": "/switch3", templateUrl: "network/router.html"},
        {"path": "/security", templateUrl: "network/security.html"},
        {"path": "/loadbalancing", templateUrl: "network/router.html"},
        //storage
        {"path": "/diskarray", templateUrl: "storage/array.html"},
        {"path": "/fcswitch", templateUrl: "storage/fcswitch.html"},
        {"path": "/tapearray", templateUrl: "storage/tapearray.html"},
        {"path": "/vtl", templateUrl: "storage/vtl.html"},
        // service
        {"path": "/http", templateUrl: "service/http.html"}
    ];
    var dashboard = angular.module('dashboard', ['ngRoute','ngResource','dataTablesDirective','dnt.layout','ui.chart','dashboard.services','dashboard.controllers','dashboard.directives','dnt.widget']);
    dashboard.config(['$routeProvider', function($routeProvider) {
        var length = dashboardItems.length;
        for(var i=0;i<length;i++){
            var item = dashboardItems[i];
            $routeProvider.when(item.path,{
                    templateUrl:item.templateUrl? item.templateUrl:"view.html",
                    controller:'dashboardCtrl'});
        }
    }]);

    dashboard.run(['$rootScope','MocClient','MetricClient','LocationClient','MoClient',function($rootScope,MocClient,MetricClient,LocationClient,MoClient) {
        //公共部分
        $rootScope.resource = {
            locations : null,
            businesses : null,
            locationList:[],
            metricMap:null,
            ready : false,
            locReady:false,
            busReady:false,
            metricReady:false,
            getLoc : function(locations,locId){
                for(var i=0;i<locations.length;i++){
                    if(locations[i].id==locId){
                        return locations[i];
                    }
                    if(locations[i].children && locations[i].children.length>0){
                        var result = $rootScope.resource.getLoc(locations[i].children,locId);
                        if(result!=null){
                            return result;
                        }
                    }
                }
                return null;
            },
            getBus:function(busId){
                var buss=$rootScope.resource.businesses;
                for(var i=0;i<buss.length;i++){
                    if(buss[i].id==busId){
                        return buss[i];
                    }
                }
                return null;
            },
            loadBusiness : function(){
                MoClient.query(
                    {mocName:'bus'},
                    {},
                    function(data){
                        $rootScope.resource.businesses = data.rows;
                        $rootScope.resource.busReady=true;
                    }
                );
            },
            getMetric:function(name){
                return $rootScope.resource.metricMap[name];
            },
            loadMetric : function(mocId){
                MetricClient.getByMoc(
                    {id:mocId},
                    {},
                    function(rows){
                        if($rootScope.resource.metricMap==null){
                            $rootScope.resource.metricMap={};
                            for(var i=0;i<rows.length;i++){
                                var row=rows[i];
                                $rootScope.resource.metricMap[row.name]=row.displayName;
                                var children=row.children;
                                if(children){
                                    for(var j=0;j<children.length;j++){
                                        var child=children[j];
                                        var name=row.name+"."+child.name;
                                        $rootScope.resource.metricMap[name]=child.displayName+(child.unit?"("+child.unit+")":"");
                                    }
                                }
                            }
                            $rootScope.resource.metricReady=true;
                        }
                    }
                );
            }
        };

        LocationClient.query(
            function(data){
                $rootScope.resource.locations = data;
                $rootScope.resource.locReady=true;
            }
        );

        $rootScope.resource.loadBusiness();

        $rootScope.$watch("[resource.busReady,resource.locReady]",function(newValues,oldValues){
            if(newValues[0] && newValues[1]){
                $rootScope.resource.ready = true;
            }
        },true)

    }]);

    dashboard.controller('dashboardCtrl',['$scope','$timeout','dashboardPropertyService','$location','LoginService','alarmCountService','$rootScope','baseService','dashboardPropertyService','locationService','dashboardPerformanceService','stateService', function($scope,$timeout,svc2,$location,Login,alarm,$rootScope,svc2,svc3,Loc,svc,stateService){
    //globle params
    var params = [];
    var url_param = window.location.search.substring(1);    var array = url_param.split("&");
    for(var i=0;i<array.length;i++){
        params.push(array[i].split("=")[1]);
    }
    $scope.param = {
      "type":params[0],
      "moc_name":params[1],
      "moId":params[2]
    };

    //table format options
   $scope.options = {
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false
    };

    // globle settings from settings.js
    $scope.settings = dashboard_settings;
    $scope.tables=[];
    var old_moc_name=$location.path().substring(1,$location.path().length);
    $scope.currentMoc = $scope.settings[$scope.param.type][old_moc_name];
    if($scope.currentMoc.tables){
        for(var i=0;i<$scope.currentMoc.tables.length;i++){
            $scope.tables[i]=$scope.currentMoc.tables[i].indicator;
        }
        $timeout(function(){
            angular.element(".tab-title").children().first().click();
        },1000);
    }
    $scope.count = {
        cpu_bar_count:0,
        cpu_pie_count:0,
        mem_pie_count:0,
        pic_pie_count:0,
        pie_count:0,
        table_count:0,
        lock_pie_count:0
    };

    //初始化新鲜度数据
    $scope.viewRefresh={
        middle:0,
        bottom:0,
        top:0,
        base:null,
        bottomRefresh:function(){
            $scope.viewRefresh.bottom=0;
            $timeout(function(){
                $scope.viewRefresh.bottom=120;
            },1000);
            $timeout(function(){
                $scope.viewRefresh.bottomRefresh();
            },120000);
        },
        middleRefresh:function(){
            $scope.viewRefresh.middle=0;
            $timeout(function(){
                $scope.viewRefresh.middle=30;
            },1000);
            $timeout(function(){
                $scope.viewRefresh.middleRefresh();
            },30000);
        },
        topRefresh:function(){
            $scope.viewRefresh.top=0;
            $timeout(function(){
                $scope.viewRefresh.top=300;
            },1000);
            $timeout(function(){
                $scope.viewRefresh.topRefresh();
            },300000);
        }
    };
    var indicators="";
    var metric="SystemInfo";
    var metric2=[];
    if($scope.currentMoc.panel){
        if($scope.currentMoc.panel.indicator){
            if($scope.currentMoc.panel.indicator.indexOf(",")>-1){
                var ms=$scope.currentMoc.panel.indicator.split(",");
                metric=ms[0];
                for(var i=1;i<ms.length;i++)metric2.push(ms[i]);
            }else metric=$scope.currentMoc.panel.indicator;
        }
        indicators+=metric+",";
    }
    if($scope.currentMoc.pies){
        for(var i=0;i<$scope.currentMoc.pies.length;i++)
            indicators+=$scope.currentMoc.pies[i].indicator+",";
    }
    if($scope.currentMoc.tables){
        for(var i=0;i<$scope.currentMoc.tables.length;i++)
            indicators+=$scope.currentMoc.tables[i].indicator+",";
    }
    if(indicators.length>0){
        indicators=indicators.substring(0,indicators.length-1);
    }
    svc2.getData({moc_name:indicators,indicator_name:metric,mo_id:$scope.param.moId,offset:0,limit:0},{},function(data){
        $scope.viewRefresh.base=data;
        $scope.viewRefresh.bottomRefresh();
        $scope.viewRefresh.middleRefresh();
        $scope.viewRefresh.topRefresh();
    });
    $timeout(function(){
        $scope.viewRefresh.bottomRefresh();
        $scope.viewRefresh.middleRefresh();
        $scope.viewRefresh.topRefresh();
    },10000);
    $scope.clickTab=function(){
        $scope.viewRefresh.bottom=0;
        $timeout(function(){
            $scope.viewRefresh.bottom=300;
        },500);
    };

    //base info
    var panelObj = $scope.currentMoc["panel"];
    var metric="";
    if(panelObj){
        metric="SystemInfo";
        if(panelObj.indicator) metric=panelObj.indicator;
    }

    $scope.alarmCountObj = {};    //告警统计
    $scope.availablityBarObj = {};  //可用性
    $scope.panelBase=[[],[],[],[]];  // 0:概况  1：基本信息  2：资源信息  3：可用性
    var len = $scope.panelBase.length;
    for(var i=0;i<len;i++){
        var subTitles = panelObj.titles[i];
        var subDefs = panelObj.cols_def[i];
        for(var j=0;j<subTitles.length;j++){
            var obj={name:subTitles[j],key:subDefs[j],value:"--"};
            $scope.panelBase[i].push(obj);
        }
    }

    //add extendPanel to panelBase
    var extendPanelObj = $scope.currentMoc["extendPanel"];
    if(extendPanelObj){
        for(var i=0;i<extendPanelObj.titles.length;i++){
            var extendInfo = [];
            var subTitles = extendPanelObj.titles[i];
            var subDefs = extendPanelObj.cols_def[i];
            for(var j=0;j<subTitles.length;j++){
                var obj={name:subTitles[j],key:subDefs[j],value:"--"};
                extendInfo.push(obj);
            }
            $scope.panelBase.push(extendInfo);
        }
    }

    $scope.pushItems=function(key,value){
        for(var i=0;i<$scope.panelBase.length;i++){
            var items = $scope.panelBase[i];
            for(var j=0;j<items.length;j++){
                var obj=items[j];
                if(obj.key==key){
                    obj.value=(value==null || value=="")?"--":value;
                    break;
                }
            }
        }
    };
    $rootScope.$watch("resource.ready",function() {
        if ($rootScope.resource.ready) {
            svc2.getData({mo_id:$scope.param.moId},{},function(res){
                var data=res['mo'];
                if(data){
                    if(data.jfId){
                        Loc.getJfs({jfId:data.jfId},function(data){
                            if(data){
                                $scope.pushItems("mo.locName",data.name?data.name:"--");
                            }
                        });
                    }
                    $rootScope.resource.loadMetric(data.mocId);
                    $rootScope.mocpDisplayName=data.mocpDisplayName;
                    $rootScope.mocDisplayName=data.mocDisplayName;
                    $rootScope.type = $scope.param.type;
                    $rootScope.mocName = $scope.param.moc_name;
                    $rootScope.moName = data.displayName;
                    $scope.pushItems("mo.moType",data.mocpDisplayName + "-" +  data.mocDisplayName);
                    $scope.pushItems("mo.rack",data.rack);
                    $scope.pushItems("mo.userContact",data.userContact);
                    $scope.pushItems("mo.cabinet",data.cabinet);
                    $scope.pushItems("mo.user",data.user);
                    $scope.pushItems("mo.displayName",data.displayName);
                    $scope.pushItems("mo.ip",data.ip);
                    $scope.pushItems("Status.Status","<i title='未取到值' class='fa fa-circle' style='color:#b2b2b2;font-size: 14px'></i>");
                    $scope.pushItems("CommonMonitorStatus.MonitorStatus",'<i title="未取到值" class="fa fa-circle" style="color:#b2b2b2;font-size: 14px"></i>');
                }
            });
        }
    });
    $scope.$watch("resource.metricReady",function(n){
        if(n){
            for(var i=0;i<$scope.panelBase.length;i++){
                var items=$scope.panelBase[i];
                for(var j=0;j<items.length;j++){
                    var obj=items[j];
                    if(obj.key !=null && obj.key.length>0){
                        var name;
                        if(obj.key.indexOf(".")==-1){
                            name=$rootScope.resource.metricMap[metric+"."+obj.key];
                        }else{
                            name=$rootScope.resource.metricMap[obj.key];
                        }
                        if(name!=null && name!="")obj.name=name;
                    }
                }
            }
        }
    },true);
    $scope.$watch("viewRefresh.bottom",function(n){
        if(n>0) {
            var f = 0;
            if (panelObj.isLoad) {
                f = 360;
                panelObj.isLoad = true;
            }
            //资源信息
            if (metric.length > 0) {
                svc3.getData({moc_name: "", indicator_name: metric, mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                    if (data) {
                        for (var key in data) {
                            $scope.pushItems(key, data[key]);
                        }
                    }
                });
            }
            //扩展资源信息
            if( $scope.currentMoc["extendSysinfo"]){
                $scope.extendPanelIndicators = $scope.currentMoc["extendSysinfo"].indicators;
                $scope.extendPanelIndicators.forEach(function(indicator_name){
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: indicator_name, mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        if (data.rows && data.rows.length > 0) {
                            for (var key in data.rows[0]) {
                                $scope.pushItems(indicator_name + "." + key, data.rows[0][key]);
                            }
                        }
                    });
                });
            }


            //可用性
            svc.getData({moc_name: $scope.param.moc_name, indicator_name: 'CommonAvailability', mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
               if (data.rows && data.rows.length > 0) {
                    $scope.availablityBarObj = data;
                    for (var key in data.rows[0]) {
                        $scope.pushItems("CommonAvailability" + "." + key, data.rows[0][key]);
                    }
                    if (data.rows[0]["Downtime"]) {
                        var downtime = data.rows[0]["Downtime"].replace(/\,/g,"");
                        downtime = parseFloat(downtime);    //hours
                        var days = parseInt(downtime / 24);
                        if(days < 10){
                            $scope.availablityBarObj.days = [0,days];
                        }else if(days > 99){
                            $scope.availablityBarObj.days = [9,9];
                        }else{
                            days = days + "";
                            $scope.availablityBarObj.days = [days.substring(0,1),days.substr(1,2)];
                        }
                        var hours = Math.floor(downtime) - 24 * days;
                        if(hours < 10){
                            $scope.availablityBarObj.hours = [0,hours];
                        }else{
                            hours = hours + "";
                            $scope.availablityBarObj.hours = [hours.substring(0,1),hours.substr(1,2)];
                        }
                        var mins = parseInt((downtime - Math.floor(downtime)) * 60);
                        if(mins < 10){
                            $scope.availablityBarObj.mins = [0,mins];
                        }else{
                            mins = mins + "";
                            $scope.availablityBarObj.mins = [mins.substring(0,1),mins.substr(1,2)];
                        }
                   }
               }
            });

            //extendPanel info  :weblogic
            if( $scope.currentMoc["extendPanel"]){
                $scope.extendPanelIndicators = $scope.currentMoc["extendPanel"].indicators;
                $scope.extendPanelIndicators.forEach(function(indicator_name){
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: indicator_name, mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        if (data.rows && data.rows.length > 0) {
                            for (var key in data.rows[0]) {
                                $scope.pushItems(indicator_name + "." + key, data.rows[0][key]);
                            }
                        }
                    });
                });
            }

            alarm.getData({moId: $scope.param.moId}, function (data) {
                $scope.pushItems("mo.alarm", data.totalCount + "");
                $scope.alarmCountObj = data;

                var num = 0;
                for (var i = 2; i < 7; i++) {   //告警级别 2 - 7
                    if ($scope.alarmCountObj[i] > 0) {
                        num++;
                    }
                }
                if (num > 0) {
                    $scope.alarmCountObj["percent"] = (1 / num) * 100;
                }
            });

            stateService.getState({mo_id: $scope.param.moId, offset: n, limit: f},{}, function (data) {
                if (data.value == 1){
                    $scope.pushItems("CommonMonitorStatus.MonitorStatus", '<i title="监控" class="fa fa-check-circle statusOn" style="font-size: 14px"></i>');
                }else if(data.value == 0){
                    $scope.pushItems("CommonMonitorStatus.MonitorStatus", '<i title="未监控" class="fa fa-minus-circle statusOff" style="font-size: 14px"></i>');
                }
            });
            svc.getData({moc_name: $scope.param.moc_name, indicator_name: 'Status', mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                if (data.rows && data.rows.length > 0) {
                    var value = "";
                    if (data.rows[0]['Status'] == "1" || data.rows[0]['Status'] == true)
                        value = '<i title="正常" class="fa fa-check-circle statusOn" style="font-size: 14px"></i>';
                    else
                        value = '<i title="不可达" class="fa fa-minus-circle statusOff" style="font-size: 14px"></i>';
                    $scope.pushItems("Status.Status", value);
                }
            });
        }
    },true);

}]);

})(angular);