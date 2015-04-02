(function(angular){
    'use strict';
    var api_path="../dmonitor-webapi";
    var event = angular.module('resource.monitor',[]);

    event.factory('RsMonitorService',['$resource',function(resource){
        return resource("",{},{
            jfTree:{method:'GET',url:api_path+"/resource/jfTree",isArray:true},
            locTree:{method:'GET',url:api_path+"/resource/locTree",isArray:true},
            mocTree:{method:'GET',url:api_path+"/resource/mocTree",isArray:true},
            monitorData:{method:'POST',url:api_path+"/resource/monitor",isArray:false}
        });
    }]);

    event.controller('RsMonitorCtrl',['$scope','$rootScope','Util','Tools','RsMonitorService','MoClient','Loading','$timeout','$location',function($scope,$rootScope,Util,Tools,RsMonitor,MoClient,Loading,$timeout,$location){
        $scope.clickTitle=function(type){
            $scope.type=type;
        };
        $scope.searchPage = {
            data : {
                ip:"",
                displayName:"",
                mocId:null,
                jfId:null,
                mocpId:null,
                locId:null,
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            hasIp:false,
            mocs:[],
            noLoading:false,
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                },
                initTree:function(){
                    Loading.show();
                    var count = 0;
                    RsMonitor.jfTree(function(data){
                        if(data.length>0){
                            $scope.jfTree.data=data;
                        }
                        count++;
                        if(count==3){
                            Loading.hide();
                        }
                    });
                    RsMonitor.locTree(function(data){
                        if(data.length>0){
                            $scope.locTree.data=data;
                            $timeout(function(){
                                $scope.type= 0;
                                count++;
                                if(count==3){
                                    Loading.hide();
                                }
                            },200);
                        }
                    });
                    RsMonitor.mocTree(function(data){
                        $scope.mocTree.data=data;
                        count++;
                        if(count==3){
                            Loading.hide();
                        }
                    });
                }
            }
        };

        $scope.locTree={
            data:[],
            selectNode:""
        };

        $scope.$watch("locTree.selectNode",function(newVal,oldVal){
            if(newVal!=null && newVal!=""){
                if(newVal.data.type==3){
                    $scope.searchPage.data.mocId=newVal.data.id;
                    $scope.searchPage.data.mocpId=null;
                    $scope.searchPage.data.locId=newVal.getParentNode().getParentNode().data.id;
                    $scope.searchPage.data.jfId=null;
                    $scope.searchPage.action.search();
                }
            }
        },true);

        $scope.mocTree={
            data:[],
            selectNode:""
        };

        $scope.$watch("mocTree.selectNode",function(newVal,oldVal){
            if(newVal!=null && newVal!=""){
                if(newVal.data.type==2){
                    $scope.searchPage.data.mocId=newVal.data.id;
                    $scope.searchPage.data.mocpId=null;
                    $scope.searchPage.data.locId=null;
                    $scope.searchPage.data.jfId=null;
                    $scope.searchPage.action.search();
                }
            }
        },true);

        $scope.jfTree={
            data:[],
            selectNode:""
        };

        $scope.$watch("jfTree.selectNode",function(newVal,oldVal){
            if(newVal!=null && newVal!=""){
                if(newVal.data.type==3){
                    $scope.searchPage.data.mocId=newVal.data.id;
                    $scope.searchPage.data.mocpId=null;
                    $scope.searchPage.data.locId=null;
                    $scope.searchPage.data.jfId=newVal.getParentNode().getParentNode().data.id;
                    $scope.searchPage.action.search();
                }
            }
        },true);

        $scope.$watch("type",function(newVal,oldVal){
            if(newVal!=null){
                var treeObj = null;
                if(newVal==0){
                    treeObj = $.fn.zTree.getZTreeObj("locTree");
                }else if(newVal==1){
                    treeObj = $.fn.zTree.getZTreeObj("jfTree");
                }else if(newVal==2){
                    treeObj = $.fn.zTree.getZTreeObj("mocTree");
                }
                if(treeObj!=null){
                    treeObj.expandAll(false);
                    $scope.searchPage.data.mocId="";
                    treeObj.cancelSelectedNode();
                    $scope.jfTree.selectNode="";
                    $scope.mocTree.selectNode="";
                    $scope.locTree.selectNode="";
                    $timeout(function(){
                        var node = getFirstNode(treeObj.getNodes()[0]);
                        $scope.searchPage.data.mocId=node.data.id;
                        treeObj.expandNode(node,true, true, true);
                        treeObj.selectNode(node,false);
                        treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);
                    },100);
                }
            }
        },false);

        $scope.$watch("searchPage.data.mocId",function(newVal,oldVal){
            if(newVal!=oldVal){
                $scope.searchPage.data.displayName = "";
                $scope.searchPage.data.ip = "";
            }
            if(newVal){
                $scope.searchPage.hasIp = !Util.exist(newVal,[35,42,58,59,60,61,73]);
            }
        },false);

        var getFirstNode = function(treeNode){
            if(treeNode.children && treeNode.children.length>0){
                return getFirstNode(treeNode.children[0]);
            }else{
                return treeNode;
            }
        }

        $scope.listPage = {
            columns:{},
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    if($scope.searchPage.data.mocId!=null && $scope.searchPage.data.mocId!=""){
                        if(!$scope.searchPage.noLoading){
                            Loading.show();
                        }
                        $scope.searchPage.noLoading=false;
                        RsMonitor.monitorData(Util.sumMap($scope.searchPage.data,getConfig($scope.searchPage.data.mocId)),function(data){
                            fnCallback(data);
                            changeTableCol($scope.searchPage.data.mocId);
                            Loading.hide();
                        });
                    }
                }
            }
        };

        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<span ng-bind='listPage.columns.col_1'></span>",
                    mData:"col_1",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_1");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_2'></span>",
                    mData:"col_2",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_2");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_3'></span>",
                    mData:"col_3",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_3");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_4'></span>",
                    mData:"col_4",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_4");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_5'></span>",
                    mData:"col_5",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_5");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_6'></span>",
                    mData:"col_6",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_6");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_7'></span>",
                    mData:"col_7",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_7");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_8'></span>",
                    mData:"col_8",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_8");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_9'></span>",
                    mData:"col_9",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_9");
                    }
                },
                {
                    sTitle: "<span ng-bind='listPage.columns.col_10'></span>",
                    mData:"col_10",
                    mRender:function(mData,type,full) {
                        return commonRender(mData,type,full,"col_10");
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
//                { bSortable: false, aTargets: [ 0,1,2,3,4,5,6,7,8,9 ] }
            ] , //定义列的约束
            defaultOrderBy : []
        };

        $scope.openDashboard = function(id,mocpName,mocName){
            $rootScope.openWindows.push(window.open("views/dashboard/dashboard.html?type="+mocpName+"&moc_name="+mocName+"&mo_id="+id+"#/"+mocName,"_blank"));
        };
        $scope.openHighFlowChart = function(id){
            $rootScope.openWindows.push(window.open("views/lineFlowTrend/lineFlowTrend.html?moId="+id,"_blank"));
        };

        var changeTableCol = function(mocId){
            var config = getConfig(mocId);
            for(var i=1;i<=10;i++){
                if(config["col_"+i]){
                    $scope.listPage.columns["col_"+i] = config["col_"+i].name;
                    $("#monitorDataTable").dataTable().fnSetColumnVis(i-1,true);
                }else{
                    $("#monitorDataTable").dataTable().fnSetColumnVis(i-1,false);
                }
            }
        };

        var colorBarRender = function(mData,type,full,colName){
            var processor = "";
            if (mData==null || mData=="" || mData=="--") {
                processor = '<div class="gray" style="width:' + 100 + '%;"></div>';
                return '<div class="bar-label">' + "" + '</div>' + '<div class="bar-wrap"><div class="Bar" style="margin-top: -15px;">' + processor + '</div></div>';
            } else {
                mData = parseFloat(mData).toFixed(2)
            }

            var color = full[colName+"_color"];
            if(color=="red"){
                processor =  '<div class="red" style="width:' + mData +'%;"></div>';
            }else if(color=="yellow"){
                processor =  '<div class="yellow" style="width:' + mData +'%;"></div>';
            }else{
                processor =  '<div class="green" style="width:' + mData +'%;"></div>';
            }
            var html =  '<div class="bar-label">' + mData + '</div>' + '<div class="bar-wrap"><div class="Bar">' +  processor + '</div></div>';
            return html;
        };

        var onOffRender = function(mData,type,full){
            if(mData == null || mData == "" || mData == "--" ){
                return  '<i title="未取到值" class="fa fa-circle status-icon statuNull"></i>';
            }else if(mData == "1" || mData == true){
                return '<i title="正常" class="fa fa-check-circle status-icon statusOn"></i>';
            }else{
                return '<i title="不可达" class="fa fa-minus-circle status-icon statusOff"></i>';
            }
        };

        var linkOnOffRender = function(mData,type,full){
            if(mData == null || mData == "" || mData == "--" ){
                return  '<i title="未取到值" class="fa fa-circle status-icon statuNull"></i>';
            }else if(mData == "0" || mData == true){
                return '<i title="正常" class="fa fa-check-circle status-icon statusOn"></i>';
            }else{
                return '<i title="不可达" class="fa fa-minus-circle status-icon statusOff"></i>';
            }
        };

        var nameRender = function(mData,type,full){
            if(Util.exist(full.mocpName,['host','storage','network','database','middleware','service']) && full.mocName!='apache'){
                return '<a href="javascript:void(0)" title="'+ mData +'" class="active" ng-click="openDashboard('+full.id+',\''+full.mocpName+'\',\''+full.mocName+'\')">'+mData+'</a>';
            }else if(full.mocName=='elink'){
                return '<a href="javascript:void(0)" title="'+ mData +'" class="active" ng-click="openHighFlowChart('+full.id+')">'+mData+'</a>';
            }else{
                return Util.str2Html(mData);
            }
        };

        var textRender = function(mData,type,full){
            if(mData==null || mData=='-1' || mData==""){
                return "--";
            }else{
                return Util.str2Html(mData);
            }
        };

        var commonRender = function(mData,type,full,colName){
            var colConfig = getConfig($scope.searchPage.data.mocId)[colName];
            if(colConfig==null){
                return "";
            }
            if(colConfig.type=="name"){
                return nameRender(mData,type,full);
            }else if(colConfig.type=="color"){
                return colorBarRender(mData,type,full,colName);
            }else if(colConfig.type=="status"){
                return onOffRender(mData,type,full);
            }else if(colConfig.type=="linkStatus"){
                return linkOnOffRender(mData,type,full);
            }else{
                return textRender(mData,type,full);
            }
        };

        var getConfig = function(mocId){
                var config = {};
                if(Util.exist(mocId,[11,12,13,14,15])){  //主机
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"color",
                            indicator:"CPU",
                            metric:"Usage",
                            name:"总CPU使用率(%)"
                        },
                        col_5:{
                            type:"color",
                            indicator:"MEM",
                            metric:"UsedUsage",
                            name:"物理内存使用率(%)"
                        }
                    };
                }else if(Util.exist(mocId,[16,17,18,19,20,21])){  //网络、光纤交换机
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"color",
                            indicator:"CPU",
                            metric:"Usage",
                            name:"CPU使用率(%)"
                        },
                        col_5:{
                            type:"color",
                            indicator:"MEM",
                            metric:"Usage",
                            name:"内存使用率(%)"
                        }
                    };
                }else if(Util.exist(mocId,[22])){  //储存阵列
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"LunHit",
                            metric:"ReadHit",
                            name:"读命中率(%)"
                        },
                        col_5:{
                            type:"number",
                            indicator:"LunHit",
                            metric:"WriteHit",
                            name:"写命中率(%)"
                        },
                        col_6:{
                            type:"number",
                            indicator:"LunHit",
                            metric:"ReadRatio",
                            name:"读比例(%)"
                        }
                    };
                }else if(Util.exist(mocId,[27])){  //oracle
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"SessionCnt",
                            name:"当前会话总数"
                        },
                        col_5:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"SQLParseHit",
                            name:"SQL解析比(%)"
                        }
                    };
                }else if(Util.exist(mocId,[25,26])){  //mssql、sysbase
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"SessionCnt",
                            name:"当前会话总数"
                        }
                    };
                }else if(Util.exist(mocId,[68])){  //oracleRac
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"ActInst",
                            name:"活动实例数"
                        },
                        col_5:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"TotalInst",
                            name:"实例总数"
                        }
                    };
                }else if(Util.exist(mocId,[31])){  //MQ
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"QmgStatus",
                            metric:"ConnCount",
                            name:"连接计数"
                        }
                    };
                }else if(Util.exist(mocId,[72])){  //Apache
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"SystemInfo",
                            metric:"CPULoad",
                            name:"CPU负载(%)"
                        },
                        col_5:{
                            type:"number",
                            indicator:"SystemInfo",
                            metric:"ReqCurProc",
                            name:"当前处理请求数"
                        },
                        col_6:{
                            type:"number",
                            indicator:"SystemInfo",
                            metric:"ReqPerSec",
                            name:"每秒请求数"
                        }
                    };
                }else if(Util.exist(mocId,[33])){  //IIS
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"CurConn",
                            name:"当前连接数"
                        },
                        col_5:{
                            type:"number",
                            indicator:"SysPerf",
                            metric:"TotalErrs",
                            name:"错误总数"
                        }
                    };
                }else if(Util.exist(mocId,[32])){  //Weblogic
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"string",
                            indicator:"SystemInfo",
                            metric:"ServerState",
                            name:"服务器状态"
                        },
                        col_5:{
                            type:"number",
                            indicator:"JVM",
                            metric:"HeapUsage",
                            name:"堆内存使用率(%)"
                        }
                    };
                }else if(Util.exist(mocId,[67])){  //WebLogicCluster
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"number",
                            indicator:"ClusterInfo",
                            metric:"AliveServerCnt",
                            name:"活动服务数量"
                        }
                    };
                }else if(Util.exist(mocId,[42])){  //elink
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"linkStatus",
                            indicator:"",
                            metric:"",
                            name:"通断状态"
                        },
                        col_3:{
                            type:"linkIn",
                            indicator:"",
                            metric:"",
                            name:"入流量(KBIT/S)"
                        },
                        col_4:{
                            type:"linkOut",
                            indicator:"",
                            metric:"",
                            name:"出流量(KBIT/S)"
                        }
                    };
                }else if(Util.exist(mocId,[58,59,60,61,73,35])){  //应用、http服务
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_3:{
                            type:"color",
                            indicator:"CommonHealth",
                            metric:"HealthState",
                            name:"健康度(%)"
                        },
                        col_4:{
                            type:"color",
                            indicator:"CommonAvailability",
                            metric:"AvailableRate",
                            name:"可用率(%)"
                        }
                    };
                }else if(Util.exist(mocId,[74])){  //磁带库
                    config = {
                        col_1:{
                            type:"name",
                            indicator:"",
                            metric:"",
                            name:"资源实例"
                        },
                        col_2:{
                            type:"ip",
                            indicator:"",
                            metric:"管理IP",
                            name:"管理IP"
                        },
                        col_3:{
                            type:"status",
                            indicator:"Status",
                            metric:"Status",
                            name:"通断状态"
                        },
                        col_4:{
                            type:"color",
                            indicator:"CommonHealth",
                            metric:"HealthState",
                            name:"健康度(%)"
                        },
                        col_5:{
                            type:"color",
                            indicator:"CommonAvailability",
                            metric:"AvailableRate",
                            name:"可用率(%)"
                        }
                    };
                }else if(Util.exist(mocId,[75])) {  //虚拟磁带库
                    config = {
                        col_1: {
                            type: "name",
                            indicator: "",
                            metric: "",
                            name: "资源实例"
                        },
                        col_2: {
                            type: "ip",
                            indicator: "",
                            metric: "",
                            name: "管理IP"
                        },
                        col_3: {
                            type: "status",
                            indicator: "Status",
                            metric: "Status",
                            name: "通断状态"
                        },
                        col_4: {
                            type: "color",
                            indicator: "BasePerf",
                            metric: "CPUUsage",
                            name: "CPU使用率(%)"
                        },
                        col_5: {
                            type: "color",
                            indicator: "BasePerf",
                            metric: "MemUsage",
                            name: "内存使用率(%)"
                        },
                        col_6: {
                            type: "color",
                            indicator: "BasePerf",
                            metric: "SwapUsage",
                            name: "Swap使用率(%)"
                        }
                    }
                }

                return config;
            };
        $scope.searchPage.action.initTree();
        var refreshPage  = function(){
            $timeout(function(){
                if($location.$$path=='/resource/monitor'){
                    $scope.searchPage.noLoading=true;
                    $scope.searchPage.action.search();
                    refreshPage();
                }
            },120000);
        };
        refreshPage();
    }]);
}(angular));
