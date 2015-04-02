(function(angular){
    var system = angular.module('timer-report-module', ['ngResource']);

    var path = "/dmonitor-webapi";

    system.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/reportRule', {
            templateUrl: 'views/report/timerReportRule.html',
            controller: 'timer-reportRuleCtrl'});
        $routeProvider.when('/reportList', {
            templateUrl: 'views/report/timerReportList.html',
            controller: 'timer-reportListCtrl'});
    }]);

    system.factory('DataLoad', function ($resource) {
        return $resource("", {}, {
            getAllMoc:{method:'GET',url:path+"/resources/moc",isArray:true},
            findReportList:{method:'GET',url:path+"/report/list",isArray:true},
            getMoByMocId:{method:'GET',url:path+'/resources/mo',isArray:false},
            getMetricByMocId:{method:'GET',url:path+'/resources/metric/select',isArray:true},
            getReportMetric:{method:'GET',url:path+'/report/metric',isArray:true},
            add:{method:'POST',url:path+'/report/rules',isArray:false},
            getReportRule:{method:'GET',url:path+'/report/rules',isArray:false},
            remove:{method:"DELETE",url:path+"/report/rules",isArray:false},
            active:{method:'PUT',url:path+'/report/rules/active',isArray:false},
            getReportFile:{method:'GET',url:path+'/report/list/:fileName',isArray:true},
            getCountReport:{method:'GET',url:path+'/report/count/:fileName',isArray:false},
            getReportMetricById:{method:'GET',url:path+'/report/rules/:id',isArray:true},
            edit:{method:'PUT',url:path+"/report/rules/:id",isArray:false},
            getUsers:{method:'GET',url:path+'/users',isArray:false},
            getLocById:{method:'GET',url:path+'/operation/loc',isArray:true},
            leftTree:{method:'GET',url:path+'/report/leftTree',isArray:true},
            getLoc:{method:'GET',url:path+'/operation/locTree/all',isArray:true},
            pageMO:{method:'GET',url:path+'/report/mo',isArray:false},
            getJF:{method:'GET',url:path+'/operation/room/all',isArray:true},
            getReportMetricPort:{method:'GET',url:path+'/report/metric/port',isArray:true},
            getReportMetricPortMetricArgs:{method:'POST',url:path+'/report/metric/port/metricargs',isArray:true},
            getLocs:{method:'GET',url:path+"/operation/locTree",isArray:true},
            getDepartUsers:{method:'GET',url:path+"/operation/departUserTree",isArray:true},
            getLink:{method:'GET',url:path+'/report/link',isArray:false},
            roleTree:{method:'GET',url:path+'/report/archivedir/role',isArray:true},
            archive:{method:'PUT',url:path+'/report/archive',isArray:false},
            getArchiveDir:{method:'GET',url:path+"/report/archivedir",isArray:true},
            getReportType:{method:'GET',url:path+"/report/reporttype",isArray:true},
            getAssets:{method:'GET',url:path+"/asset/info",isArray:false},
            pageAsset:{method:'GET',url:path+'/report/asset',isArray:false}
        });
    });

    system.run(['$rootScope','DataLoad',function($rootScope,DataLoad) {
        $rootScope.archive={};
        $rootScope.report={};
        $rootScope.itsm = {};
        $rootScope.searchPage={};
        $rootScope.searchPage.datas={};

        DataLoad.getAllMoc(function(data){
            $rootScope.report.mocTree = data;
        });
        $rootScope.itsm.state = [{"id":"全部","name":"全部","children":[{"id":"新建","name":"新建"},{"id":"处理中","name":"处理中"},{"id":"已关闭","name":"已关闭"}]}];

        DataLoad.getUsers(function(data){
            $rootScope.itsm.users = [{"id":"全部","realName":"全部","children":data.rows}];
            $rootScope.itsm.userList = data.rows;
        });
        DataLoad.getLoc(function(data){
            $rootScope.resource.loc = data;
        });
        DataLoad.getJF(function(data){
            $rootScope.resource.jf = data;
        });

        /*DataLoad.getLocs(function(rows){
            $rootScope.resource.reportlocations  = rows;//=[{"id":"全部","name":"全部","children":rows}];
            $rootScope.resource.locations = rows;
        });*/
        DataLoad.getReportType(function(data){
            $rootScope.searchPage.datas.reportType = data;
        });
        DataLoad.getAssets({"offset":0,"limit":2147483647,"orderByType":"ASC","orderBy":"name"},function(data){
            var assets = [];
            if(data.rows!=null)
                $.each(data.rows,function(index,val){
                    var asset = {"id":val.id,"name":val.name+"["+val.serial+"]"};
                    assets.push(asset);
                });
                $rootScope.resource.assets = [{"id":"全部","name":"全部","children":assets}];
        });
    }]);

    system.controller('timer-reportRuleCtrl',['$scope','$rootScope','DataLoad','$filter','Util',"Tools",'Loading','$routeParams','$timeout','Const',"$window",function($scope,$rootScope,DataLoad,$filter,Util,Tools,Loading,$routeParams,$timeout,Const,$window) {
        //////////////////////新增/////////////////////////////////////////////
        $scope.addPage = {}
        $scope.addPage.data = {};
        $scope.addPage.data.allData = [];
        $scope.addPage.datas = {};
        $scope.addPage.hidden = {};
        $scope.searchPage={};
        $scope.searchPage.data={};
        $scope.editPage = {};
        $scope.editPage.data = {};
        $scope.editPage.datas = {};
        $scope.editPage.data.allData = [];
        $scope.isShowDiv = false;
        $scope.addPage.data.portData = new Array();
        $scope.addPage.datas.portTimes = $filter('loop')([],0,60,1);
        $scope.addPage.datas.masterList = new Array();
        $scope.addPage.datas.slaveList = new Array();

        $scope.locTree={
            data:[],
            returnData:[],
            checkType: { "Y" : "ps", "N" : "ps" },
            checked:"",
            treeId: 'locationTree',
            checkbox: "true",
            level:10,
            treeClick:function(){},
            onCheck:function(nodes){
                $scope.addPage.data.location=[];
                if(nodes.length>0){
                    for(var i=0;i<nodes.length;i++){
                        $scope.addPage.data.location[$scope.addPage.data.location.length]=nodes[i].id;
                    }
                }
                $scope.$apply();
            }
        };
        //对区域树赋值
        DataLoad.getLocs(function(rows){
            $scope.locTree.data = rows;
        });



        $scope.timerReportRuleAddDialog = Tools.dialog({
            id:"timerReportRuleAddDialog",
            title:"新增",
            hiddenButton:true,
            save:function(){
                var params = [];
                var i = 0;
                var checkbox = [];
                if($scope.report14){
                    checkbox = $('input[name="reportAttribute_asset"]:checked');

                }else if($scope.report15){
                    checkbox = $('input[name="reportAttribute_safe"]:checked');
                }else{
                    checkbox = $('input[name="reportAttribute"]:checked');
                }
                var checkFlag = false;
                checkbox.each(function(){
                    var param = {};
                    param.reportAttribute = $(this).val();
                    param.displayName = $scope.addPage.data.displayName;
                    if(param.reportAttribute == 'day')
                        param.displayName += '[日报]';
                    else if(param.reportAttribute == 'week')
                        param.displayName += '[周报]';
                    else if(param.reportAttribute == 'month')
                        param.displayName += '[月报]';
                    else if(param.reportAttribute == 'year')
                        param.displayName += '[年报]';

                    param.active = $scope.addPage.data.active;
                    param.reportType = typeof($scope.addPage.data.reportlist) == "undefined"?1:$scope.addPage.data.reportlist;

                    if(param.reportType==1 || param.reportType==2||param.reportType==1501){
                        param.orderBy = [];
                        var x  = 0;
                        if($scope.map != null){
                            $.each($scope.map,function(key,val){
                                param.orderBy[x] = $('input[name="'+key+'"]:checked').val();
                                x++;
                            });
                        }

                        param.orderByType = $scope.addPage.data.orderByType;
                        param.reportMetricList = [];
                        $.each($scope.addPage.data.allData,function(index,val){
                            var reportMetric = {};
                            reportMetric.unit=val.unit;
                            reportMetric.mocpId = val.mocpId;
                            reportMetric.mocpName = val.mocp;
                            reportMetric.mocpDisplayName = val.mocpName;
                            reportMetric.mocId = val.mocId;
                            reportMetric.mocName = val.moc;
                            reportMetric.mocDisplayName = val.mocName;
                            reportMetric.indicatorId = val.indicatorId;
                            reportMetric.indicatorName = val.indicator;
                            reportMetric.indicatorDisplayName = val.indicatorName;
                            reportMetric.metricId = val.metricId;
                            reportMetric.metricName = val.metric;
                            reportMetric.metricDisplayName = val.metricName;
                            reportMetric.moId = val.moId;
                            reportMetric.moDisplayName = val.moName;
                            reportMetric.metricsArgs = val.metricsArgs;
                            param.reportMetricList[index]=reportMetric;
                        });
                    }else if(param.reportType==4){
                        //itsm报表
                        //工单统计
                        var workList = [];
                        if($scope.addPage.data.incident){
                            workList.push({"incident":$scope.addPage.data.incidentState});
                        }
                        if($scope.addPage.data.problem){
                            workList.push({"problem":$scope.addPage.data.problemState});
                        }
                        if($scope.addPage.data.change){
                            workList.push({"change":$scope.addPage.data.changeState});
                        }
                        param.workList = JSON.stringify(workList);
                        param.orderByType = "";
                    }else if(param.reportType==5){
                        var workList = [];
                        if($scope.addPage.data.incident){
                            workList.push({"incident":$scope.addPage.data.incidentState});
                        }
                        if($scope.addPage.data.problem){
                            workList.push({"problem":$scope.addPage.data.problemState});
                        }
                        if($scope.addPage.data.change){
                            workList.push({"change":$scope.addPage.data.changeState});
                        }
                        param.workList = JSON.stringify(workList);
                        param.location = JSON.stringify($scope.addPage.data.location);

                        param.orderByType = "";
                    }else if(param.reportType==6){
                        var workList = [];
                        if($scope.addPage.data.incident){
                            workList.push({"incident":$scope.addPage.data.incidentState});
                        }
                        if($scope.addPage.data.problem){
                            workList.push({"problem":$scope.addPage.data.problemState});
                        }
                        if($scope.addPage.data.change){
                            workList.push({"change":$scope.addPage.data.changeState});
                        }
                        param.workList = JSON.stringify(workList);

                        var dealUsers = [];
                        if($scope.addPage.data.create){
                            dealUsers.push({"createUsers":$scope.addPage.data.createUsers});
                        }
                        if($scope.addPage.data.resolve){
                            dealUsers.push({"resolveUsers":$scope.addPage.data.resolveUsers});
                        }
                        if($scope.addPage.data.close){
                            dealUsers.push({"closeUsers":$scope.addPage.data.closeUsers});
                        }
                        param.dealUsers = JSON.stringify(dealUsers);

                        if(param.dealUsers.length>2000){
                            checkFlag = true;
                            return false;
                        }
                        param.orderByType = "";
                    }else if(param.reportType==7){
                        var workList = [];
                        if($scope.addPage.data.incident){
                            workList.push({"incident":$scope.addPage.data.incidentState});
                        }
                        if($scope.addPage.data.problem){
                            workList.push({"problem":$scope.addPage.data.problemState});
                        }
                        if($scope.addPage.data.change){
                            workList.push({"change":$scope.addPage.data.changeState});
                        }
                        param.workList = JSON.stringify(workList);
                        param.orderByType = "";

                        var mocList = [];
                        if($scope.addPage.data.host){
                            mocList.push({"host":$scope.addPage.data.hosts});
                        }
                        if($scope.addPage.data.network){
                            mocList.push({"network":$scope.addPage.data.networks});
                        }
                        if($scope.addPage.data.storage){
                            mocList.push({"storage":$scope.addPage.data.storages});
                        }
                        if($scope.addPage.data.database){
                            mocList.push({"database":$scope.addPage.data.databases});
                        }
                        if($scope.addPage.data.middleware){
                            mocList.push({"middleware":$scope.addPage.data.middlewares});
                        }
                        if($scope.addPage.data.service){
                            mocList.push({"service":$scope.addPage.data.services});
                        }
                        if($scope.addPage.data.link){
                            mocList.push({"link":$scope.addPage.data.links});
                        }
                        if($scope.addPage.data.environment){
                            mocList.push({"environment":$scope.addPage.data.environments});
                        }
                        if($scope.addPage.data.application){
                            mocList.push({"application":$scope.addPage.data.applications});
                        }
                        param.mocList = JSON.stringify(mocList);
                    }else if(param.reportType==8){
                        param.orderByType = "";
                        param.jf = $scope.addPage.data.jf;
                    }else if(param.reportType==9){
                        param.portTime = $scope.addPage.data.portTime;
                        param.reportMetricList = [];
                        for(var x=0;x<$scope.listPreparePagePort.checkedList.length;x++){
                            $.each($scope.addPage.data.portData,function(index,val){
                                if($scope.listPreparePagePort.checkedList[x]==val.id){
                                    var reportMetric = {};
                                    reportMetric.unit=val.unit;
                                    reportMetric.mocpId = val.mocpId;
                                    reportMetric.mocpName = val.mocp;
                                    reportMetric.mocpDisplayName = val.mocpName;
                                    reportMetric.mocId = val.mocId;
                                    reportMetric.mocName = val.moc;
                                    reportMetric.mocDisplayName = val.mocName;
                                    reportMetric.indicatorId = val.indicatorId;
                                    reportMetric.indicatorName = val.indicator;
                                    reportMetric.indicatorDisplayName = val.indicatorName;
                                    reportMetric.metricId = val.metricId;
                                    reportMetric.metricName = val.metric;
                                    reportMetric.metricDisplayName = val.metricName;
                                    reportMetric.moId = val.moId;
                                    reportMetric.moDisplayName = val.moName;
                                    reportMetric.metricsArgs = val.metricsArgs;
                                    param.reportMetricList.push(reportMetric);
                                }
                            });
                        }
                    }else if(param.reportType==10){
                        param.portTime = $scope.addPage.data.portTime;
                        param.reportMetricList = [];
                        for(var x=0;x<$scope.linkListPage.alldata.length;x++){
                            var reportMetric = {};
                            reportMetric.masterLinkId = $scope.linkListPage.alldata[x].masterId;
                            reportMetric.slaveLinkId = $scope.linkListPage.alldata[x].slaveId;
                            reportMetric.masterLinkName = $scope.linkListPage.alldata[x].masterName;
                            reportMetric.slaveLinkName = $scope.linkListPage.alldata[x].slaveName;
                            param.reportMetricList.push(reportMetric);
                        }
                    }else if(param.reportType == 1101 || param.reportType == 1201){
                        param.reportMetricList = [];
                        $.each($scope.addPage.datas.allAlarmData,function(index,val){
                            var reportMetric = {};
                            reportMetric.mocpId = val.mocpId;
                            reportMetric.mocpName = val.mocpName;
                            reportMetric.mocpDisplayName = val.mocpDisplayName;
                            reportMetric.mocId = val.mocId;
                            reportMetric.mocName = val.mocName;
                            reportMetric.mocDisplayName = val.mocDisplayName;
                            reportMetric.moId = val.id;
                            reportMetric.moDisplayName = val.displayName;
                            param.reportMetricList[index]=reportMetric;
                        });
                    }else if(param.reportType == 1401){
                        param.reportMetricList = [];
                        $.each($scope.addPage.data.assetId,function(index,val){
                            var reportMetric = {};
                            reportMetric.assetId = val;
                            param.reportMetricList.push(reportMetric);
                        });
                    }
                    //时间段  执行时间
                    if($(this).val()=='day'){
                        if(param.reportType==1401){
                            var exeTime = $("#day-exe-asset").val().split(":");
                            param.exeTime = "0 "+exeTime[1]+" "+exeTime[0]+" * * ?";
                            param.exeTimeDesc = exeTime[0]+"时"+exeTime[1]+"分";

                        }else if(param.reportType==1501){
                            var exeTime = $("#day-exe-safe").val().split(":");
                            param.exeTime = "0 "+exeTime[1]+" "+exeTime[0]+" * * ?";
                            param.exeTimeDesc = exeTime[0]+"时"+exeTime[1]+"分";

                        }else{
                            param.startTime = $("#day-start").val();
                            param.endTime = $("#day-end").val();
                            var exeTime = $("#day-exe").val().split(":");
                            param.exeTime = "0 "+exeTime[1]+" "+exeTime[0]+" * * ?";
                            param.exeTimeDesc = exeTime[0]+"时"+exeTime[1]+"分";
                        }
                    }else if($(this).val()=='week'){
                        param.startTime = $("#week-start-week").val()+" "+$("#week-start-week-h").val();
                        param.endTime = $("#week-end-week").val()+" "+$("#week-end-week-h").val();
                        var week = $("#week-exe-week").val();
                        var exeTime = $("#week-exe").val().split(":");
                        if(week<7)
                            week = parseInt(week)+1;
                        else
                            week = 1;
                        param.exeTime = "0 "+exeTime[1]+" "+exeTime[0]+" ? * "+week;
                        param.exeTimeDesc = $("#week-exe-week").find("option:selected").text()+exeTime[0]+"时"+exeTime[1]+"分";
                    }else if($(this).val()=='month'){
                        param.startTime = $("#month-start").val();
                        param.endTime = $("#month-end").val();
                        var exeTime = $("#month-exe").val().split(" ");
                        var exe = exeTime[1].split(":");
                        param.exeTime = "0 "+exe[1]+" "+exe[0]+" "+exeTime[0]+" * ?";
                        param.exeTimeDesc = exeTime[0]+"日"+exe[0]+"时"+exe[1]+"分";
                    }else if($(this).val()=='year'){
                        param.startTime = $("#year-start").val();
                        param.endTime = $("#year-end").val();
                        var exe = $("#year-exe").val().split(" ");
                        var yd = exe[0].split("-");
                        var hi = exe[1].split(":");
                        param.exeTime = "0 "+hi[1]+" "+hi[0]+" "+yd[1]+" "+yd[0]+" ?";
                        param.exeTimeDesc = yd[0]+"月"+yd[1]+"日"+hi[0]+"时"+hi[1]+"分";
                    }
                    params[i] = param;
                    i++;
                });
                Loading.show();
                if(checkFlag==true){
                    $rootScope.$alert("角色配置超过系统限制的2000个字节，请检查！");
                    Loading.hide();
                    return false;
                }else{
                    DataLoad.add(params,function(data){
                        $scope.timerReportRuleAddDialog.hide();
                        $scope.listPage.settings.reload(true);
                    },function(error){
                        //$scope.timerReportRuleAddDialog.hide();
                        Loading.hide();
                    });
                }
            }
        });

        $scope.editReportTree= {
            data: [],
            checked: "",
            crossParent: "true",
            treeId: 'editReportTree',
            checkType: { "Y": "", "N": "" },
            checkbox: null
        }

        $scope.report1 = true;
        $scope.reportTree={
            data:[],
            checked:"",
            crossParent:"true",
            treeId: 'reportTree',
            checkType: { "Y" : "", "N" : "" },
            checkbox:null,
            treeClick:function(node){
                if(node.id!=$scope.addPage.data.reportlist){
                    //点击 清空 数据缓存
                    jQuery("#sort").html("");
                    $scope.isShowDiv = false;
                    // $("#a").hide();
                    // $("#b").hide();
                    $scope.addPage.data={};
                    $scope.addPage.data.active=true;
                    $scope.addPage.data.mocpId="";
                    $scope.addPage.data.mocId="";
                    $scope.addPage.data.metricsId="";
                    $scope.addPage.data.mosId="";
                    $scope.addPage.datas.metricTree=[];
                    $scope.addPage.datas.moTree=[];
                    $scope.addPage.data.allData=[];
                    $scope.addPage.datas.allAlarmData = [];
                    $scope.listPreparePage.settings.reload(true);
                    $scope.addPage.data.orderBy="";
                    $scope.addPage.datas.orderBy=[];
                    $scope.addPage.data.orderByType='正序';

                    $scope.addPage.data.incident = false;
                    $scope.addPage.data.incidentState = [];
                    $scope.addPage.data.problem = false;
                    $scope.addPage.data.problemState = [];
                    $scope.addPage.data.change = false;
                    $scope.addPage.data.changeState = [];

                    $scope.addPage.data.location=[];

                    $scope.addPage.data.create = false;
                    $scope.addPage.data.resolve = false;
                    $scope.addPage.data.close = false;
                    $scope.addPage.data.createUsers = [];
                    $scope.addPage.data.resolveUsers = [];
                    $scope.addPage.data.closeUsers = [];

                    $scope.addPage.data.host=false;
                    $scope.addPage.data.network=false;
                    $scope.addPage.data.storage=false;
                    $scope.addPage.data.database=false;
                    $scope.addPage.data.middleware=false;
                    $scope.addPage.data.service=false;
                    $scope.addPage.data.link=false;
                    $scope.addPage.data.environment=false;
                    $scope.addPage.data.application=false;
                    $scope.addPage.data.hosts=[];
                    $scope.addPage.data.networks=[];
                    $scope.addPage.data.storages=[];
                    $scope.addPage.data.databases=[];
                    $scope.addPage.data.middlewares=[];
                    $scope.addPage.data.services=[];
                    $scope.addPage.data.links=[];
                    $scope.addPage.data.environments=[];
                    $scope.addPage.data.applications=[];

                    $scope.addPage.data.jf="";

                    $scope.addPage.data.assetId=[];


                    $("[name = reportAttribute]:checkbox").attr("checked", true);
                    $("[name = reportAttribute_asset]:checkbox").attr("checked", true);
                    $("[name = reportAttribute_safe]:checkbox").attr("checked", true);
                    $scope.addPage.data.startWeek=1;
                    jQuery("#week-end-week option[value=7]").attr("selected","selected");
                    jQuery("#week-exe-week").val("1");
                    jQuery("#day-start").val("00:00");
                    jQuery("#day-end").val("23:59");
                    jQuery("#day-exe").val("00:00");
                    jQuery("#day-exe-asset").val("00:00");
                    jQuery("#day-exe-safe").val("00:00");
                    jQuery("#week-start-week-h").val("00:00");
                    jQuery("#week-end-week-h").val("23:59");
                    jQuery("#week-exe").val("00:00");
                    jQuery("#month-start").val("01 00:00");
                    jQuery("#month-end").val("31 23:59");
                    jQuery("#month-exe").val("01 00:00");
                    jQuery("#year-start").val("01-01 00:00");
                    jQuery("#year-end").val("12-31 23:59");
                    jQuery("#year-exe").val("01-01 00:00");
                }
                $scope.addPage.data.reportlist = node.id;
                if(node.id==3){
                    $scope.addPage.data.reportlist=4;
                }
                //点击树
                $scope.report1 = false;
                $scope.report4 = false;
                $scope.report5 = false;
                $scope.report6 = false;
                $scope.report7 = false;
                $scope.report8 = false;
                $scope.report9 = false;
                $scope.report10 = false;
                $scope.report11 = false;
                $scope.report12 = false;
                $scope.report14 = false;

                if(node.id==1 || node.id==2){
                    $scope.report1 = true;
                }
                if(node.id==3 || node.id==4){
                    $scope.report4 = true;
                }
                if(node.id == 5){
                    $scope.report4 = true;
                    $scope.report5 = true;
                }
                if(node.id == 6){
                    $scope.report4 = true;
                    $scope.report6 = true;
                }
                if(node.id == 7){
                    $scope.report4 = true;
                    $scope.report7 = true;
                }
                if(node.id == 8){
                    $scope.report8 = true;
                }
                if(node.id == 9){
                    $scope.report9 = true;
                    $scope.addPage.data.portmocpId="2";
                    $scope.addPage.data.portmocId="18";
                    $scope.addPage.data.portindicatorId="772";
                    $scope.addPage.data.portmetricId="782";
                    $scope.addPage.data.portTime = 3;
                }
                if(node.id == 10){
                    $scope.report10 = true;
                    //端口通断分析
                    //主线路
                    Loading.show();
                    DataLoad.getLink({},function(data){
                        $scope.addPage.datas.linkList = data.rows;
                        $scope.addPage.datas.masterList = data.rows;
                        $scope.addPage.datas.slaveList = data.rows;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                    $scope.linkListPage.alldata = new Array();
                    $timeout(function(){
                        $scope.addPage.data.portTime = 3;
                    },100);
                }
                if(node.id == 1101){
                    $scope.report11 = true;
                }
                if(node.id == 1201){
                    $scope.report12 = true;
                }
                if(node.id == 1401){
                    $scope.report14 = true;
                }

                //工单
                setSelectedTree("incidentState_div");
                setSelectedTree("problemState_div");
                setSelectedTree("changeState_div");

                //角色
                setSelectedTree("createUsers_div");
                setSelectedTree("resolveUsers_div");
                setSelectedTree("closeUsers_div");

                //资源
                setSelectedTree("host_div");
                setSelectedTree("network_div");
                setSelectedTree("storage_div");
                setSelectedTree("database_div");
                setSelectedTree("middleware_div");
                setSelectedTree("service_div");
                setSelectedTree("link_div");
                setSelectedTree("environment_div");
                setSelectedTree("application_div");



                /*var incidentZTree = jQuery.fn.zTree.getZTreeObj("incidentState_div");
                var nodes = incidentZTree.getCheckedNodes();
                for(var i=0;i<nodes.length;i++){
                    nodes[i].checked = "false";
                    incidentZTree.updateNode(nodes[i]);
                }
                incidentZTree.refresh();

                var problemZTree = jQuery.fn.zTree.getZTreeObj("problemState_div");
                nodes = problemZTree.getCheckedNodes();
                for(var i=0;i<nodes.length;i++){
                    nodes[i].checked = "false";
                    problemZTree.updateNode(nodes[i]);
                }
                problemZTree.refresh();

                var changeZTree = jQuery.fn.zTree.getZTreeObj("changeState_div");
                nodes = changeZTree.getCheckedNodes();
                for(var i=0;i<nodes.length;i++){
                    nodes[i].checked = "false";
                    changeZTree.updateNode(nodes[i]);
                }
                changeZTree.refresh();*/

                if(node.id == 1501){
                    $scope.report1=true;
                    $scope.report15 = true;
                    $scope.reportprocess=false;
                }
                $scope.$apply();
            }
        };

        //刷新选中的ztree节点树
        function setSelectedTree(id){
            var tree = jQuery.fn.zTree.getZTreeObj(id);
            nodes = tree.getCheckedNodes();
            for(var i=0;i<nodes.length;i++){
                nodes[i].checked = "false";
                tree.updateNode(nodes[i]);
            }
            tree.refresh();
        }



        $scope.report={
            action:{
                initReportList:function(){
                    DataLoad.findReportList(function(data){
                        $scope.reportTree.data = data;
                        $timeout(function () {
                            $scope.addPage.data.reportlist=1;
                            var zTree = angular.element.fn.zTree.getZTreeObj("reportTree");
                            if(zTree !=null){
                                var nodes = zTree.getNodes();
                                if (nodes.length > 0) {
                                    zTree.selectNode(nodes[0]);
                                }
                            }
                        }, 100);
                    });
                }
            }
        }

        $scope.report.action.initReportList();

        $scope.listPreparePage = {
            data:[],
            action:{
                remove:function(id){
                   //$scope.addPage.data.moclistId = "";
                   //$scope.addPage.data.metriclistId = "";
                   //$scope.addPage.data.molistName = "";
                    var data = [];
                    var j=0;
                    $.each($scope.addPage.data.allData,function(i,v){
                        if(v.id!=id){
                            data[j]=v;
                            j++;
                        }
                    });
                    $scope.addPage.data.allData = angular.copy(data);
                    $scope.listPreparePage.settings.reload(true);

                    //过滤重复 指标  排序*******************************************
                    var filterData = [];
                    var j=0;
                    $.each($scope.addPage.data.allData,function(index,val){
                        var flag = false;
                        $.each(filterData,function(i,v){
                            if((v.mocpName+v.indicatorName+ v.metricName) == (val.mocpName+val.indicatorName+ val.metricName)){
                                flag = true;
                                return false;
                            }
                        });
                        if(!flag){
                            filterData[j] = val;
                            j++;
                        }
                    });
                    //过滤重复 指标
                    var filterData = [];
                    var j=0;
                    $.each($scope.addPage.data.allData,function(index,val){
                        var flag = false;
                        $.each(filterData,function(i,v){
                            if((v.mocpName+v.indicatorName+ v.metricName) == (val.mocpName+val.indicatorName+ val.metricName)){
                                flag = true;
                                return false;
                            }
                        });
                        if(!flag){
                            filterData[j] = val;
                            j++;
                        }
                    });

                    var map = {};
                    $.each(filterData,function(index,val){
                        if(val.mocpName in map){
                            map[val.mocpName] = (++map[val.mocpName]);
                        }else{
                            map[val.mocpName] = 1;
                        }
                    });
                    $scope.map = map;
                    //填充查询框 （资源类型）
                    var tmpArray = new Array();
                    $.each(filterData,function(index,val){
                        var flag = false;
                        $.each(tmpArray,function(index2,val2){
                            if(val.mocId==val2.id){
                                flag = true;
                            }
                        });
                        if(!flag){
                            tmpArray.push({"id":val.mocId,"displayName":val.mocpName+"-"+val.mocName});
                        }
                    });
                    //$scope.addPage.datas.moclist = tmpArray;
                    //alert(JSON.stringify(map));
                    jQuery("#sort").html("");
                    if($scope.addPage.data.reportlist==2){
                        var table = '<table class="table" style="border: 1px solid #ccc;">';
                        $.each(map,function(key,val){
                            if(val == 1){
                                table  += '<thead class="ng-scope"><tr><th colspan="2" >'+key+'</th></tr></thead>';
                                table  += '<tr><td>资源实例</td><td ><input checked type="radio" name="'+key+'" value="资源名称"></td></tr>';
                                $.each(filterData,function(index,v){
                                    if(v.mocpName == key){
                                        table +=
                                            '</tr>'+
                                            '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                            '<td><input  type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')"></td>' +
                                            '</tr>';
                                        return false;
                                    }
                                });
                            }else{
                                table  += '<thead class="ng-scope"><tr><th colspan="2">'+key+'</th></tr></thead>';//rowspan="'+(val+1)+'
                                table  += '<tr><td>资源实例</td><td><input checked type="radio" name="'+key+'" value="资源名称"></td></tr>';
                                $.each(filterData,function(index,v){
                                    if(v.mocpName == key){
                                        table +=
                                            '<tr>' +
                                            '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                            '<td><input  type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')"></td>' +
                                            '</tr>';
                                    }
                                });
                            }
                        });
                        table += '</table>';
                        jQuery("#sort").html(table);

                    }else{
                        var table = '<table class="table" style="border: 1px solid #ccc;">';
                        $.each(map,function(key,val){
                            if(val == 1){
                                table  += '<thead class="ng-scope"><tr><th colspan="4" >'+key+'</th></tr></thead>';
                                table  += '<tr><td>资源实例</td><td colspan="3" ><input checked type="radio" name="'+key+'" value="资源名称">实例名称</td></tr>';
                                $.each(filterData,function(index,v){
                                    if(v.mocpName == key){
                                        table +=
                                            '</tr>'+
                                            '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                            '<td><input type="radio" name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=max">最大值</td>' +
                                            '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=min">最小值</td>' +
                                            '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=avg">平均值</td>' +
                                            '</tr>';
                                        return false;
                                    }
                                });
                            }else{
                                table  += '<thead class="ng-scope"><tr><th colspan="4">'+key+'</th></tr></thead>';//rowspan="'+(val+1)+'
                                table  += '<tr><td>资源实例</td><td colspan="3" ><input checked type="radio" name="'+key+'" value="资源名称">实例名称</td></tr>';
                                $.each(filterData,function(index,v){
                                    if(v.mocpName == key){
                                        table +=
                                            '<tr>' +
                                            '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                            '<td><input type="radio" name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=max">最大值</td>' +
                                            '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=min">最小值</td>' +
                                            '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=avg">平均值</td>' +
                                            '</tr>';
                                    }
                                });
                            }
                        });
                        table += '</table>';
                        jQuery("#sort").html(table);
                    }
                },
                generate:function(){
                    $scope.addPage.data.moclistId = "";
                    $scope.addPage.data.metriclistId = "";
                    $scope.addPage.data.molistName = "";
                    $scope.isShowDiv = true;
                    $("#tablelist").show();
                    /* var zTree1 =angular.element.fn.zTree.getZTreeObj("metricTree");
                    var zTree2 =angular.element.fn.zTree.getZTreeObj("moTree");
                    var j = 0;
                    var metricsId =[];
                    var k = 0;
                    var mosId = [];
                    if(zTree1!=null && zTree2!=null){
                        var checknodes = zTree1.getCheckedNodes(true);
                        var checknodes2 = zTree2.getCheckedNodes(true);
                        $.each(checknodes,function(i,checkVal){
                            if(checkVal.level==1){
                                metricsId[j] = checkVal.data.id;
                                j++;
                                return;
                            }
                        });
                        $.each(checknodes2,function(i,checkVal){
                            if(checkVal.level==1){
                                mosId[k] = checkVal.data.id;
                                k++;
                                return ;
                            }
                        });
                    }*/
                    DataLoad.getReportMetric({mosId:$scope.addPage.data.mosId,metricsId:$scope.addPage.data.metricsId},{},function(data){
                        var filterData = [];
                        var j = 0;
                        $.each(data,function(index,val){
                            var flag = false;
                            $.each($scope.addPage.data.allData,function(i,v){
                                if(val.id == v.id){
                                    flag = true;
                                    return false;
                                }
                            });
                            if(!flag){
                                filterData[j] = val;
                                j++;
                            }
                        });
                        $.each(filterData,function(index,val){
                            $scope.addPage.data.allData[$scope.addPage.data.allData.length] = val;
                        });
                        //$scope.report.data.allData = data;
                        $scope.listPreparePage.settings.reload(true);

                        //过滤重复 指标  排序*******************************************
                        var filterData = [];
                        var j=0;
                        $.each($scope.addPage.data.allData,function(index,val){
                            var flag = false;
                            $.each(filterData,function(i,v){
                                if((v.mocpName+v.indicatorName+ v.metricName) == (val.mocpName+val.indicatorName+ val.metricName)){
                                    flag = true;
                                    return false;
                                }
                            });
                            if(!flag){
                                filterData[j] = val;
                                j++;
                            }
                        });
                        //过滤重复 指标
                        var filterData = [];
                        var j=0;
                        $.each($scope.addPage.data.allData,function(index,val){
                            var flag = false;
                            $.each(filterData,function(i,v){
                                if((v.mocpName+v.indicatorName+ v.metricName) == (val.mocpName+val.indicatorName+ val.metricName)){
                                    flag = true;
                                    return false;
                                }
                            });
                            if(!flag){
                                filterData[j] = val;
                                j++;
                            }
                        });

                        var map = {};
                        $.each(filterData,function(index,val){
                            if(val.mocpName in map){
                                map[val.mocpName] = (++map[val.mocpName]);
                            }else{
                                map[val.mocpName] = 1;
                            }
                        });
                        $scope.map = map;
                        //填充查询框 （资源类型）
                        var tmpArray = new Array();

                        if(typeof($scope.addPage.datas.moclist) == "undefined")
                            $scope.addPage.datas.moclist = new Array();
                        else
                            tmpArray = angular.copy($scope.addPage.datas.moclist);

                        $.each(filterData,function(index,val){
                            var flag = false;
                            $.each(tmpArray,function(index2,val2){
                                if(val.mocId==val2.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                tmpArray.push({"id":val.mocId,"displayName":val.mocpName+"-"+val.mocName});
                            }
                        });
                        $scope.addPage.datas.moclist = tmpArray;

                        //alert(JSON.stringify(map));
                        jQuery("#sort").html("");
                        if($scope.addPage.data.reportlist==2){
                            var table = '<table class="table" style="border: 1px solid #ccc;">';
                            $.each(map,function(key,val){
                                if(val == 1){
                                    table  += '<thead class="ng-scope"><tr><th colspan="2" >'+key+'</th></tr></thead>';
                                    table  += '<tr><td>资源实例</td><td ><input checked type="radio" name="'+key+'" value="资源名称"></td></tr>';
                                    $.each(filterData,function(index,v){
                                        if(v.mocpName == key){
                                            table +=
                                                '</tr>'+
                                                '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                                '<td><input  type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')"></td>' +
                                                '</tr>';
                                            return false;
                                        }
                                    });
                                }else{
                                    table  += '<thead class="ng-scope"><tr><th colspan="2">'+key+'</th></tr></thead>';//rowspan="'+(val+1)+'
                                    table  += '<tr><td>资源实例</td><td><input checked type="radio" name="'+key+'" value="资源名称"></td></tr>';
                                    $.each(filterData,function(index,v){
                                        if(v.mocpName == key){
                                            table +=
                                                '<tr>' +
                                                '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                                '<td><input  type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')"></td>' +
                                                '</tr>';
                                        }
                                    });
                                }
                            });
                            table += '</table>';
                            jQuery("#sort").html(table);

                        }else{
                            var table = '<table class="table" style="border: 1px solid #ccc;">';
                            $.each(map,function(key,val){
                                if(val == 1){
                                    table  += '<thead class="ng-scope"><tr><th colspan="4" >'+key+'</th></tr></thead>';
                                    table  += '<tr><td>资源实例</td><td colspan="3" ><input checked type="radio" name="'+key+'" value="资源名称">实例名称</td></tr>';
                                    $.each(filterData,function(index,v){
                                        if(v.mocpName == key){
                                            table +=
                                                '</tr>'+
                                                '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                                '<td><input type="radio" name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=max">最大值</td>' +
                                                '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=min">最小值</td>' +
                                                '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=avg">平均值</td>' +
                                                '</tr>';
                                            return false;
                                        }
                                    });
                                }else{
                                    table  += '<thead class="ng-scope"><tr><th colspan="4">'+key+'</th></tr></thead>';//rowspan="'+(val+1)+'
                                    table  += '<tr><td>资源实例</td><td colspan="3" ><input checked type="radio" name="'+key+'" value="资源名称">实例名称</td></tr>';
                                    $.each(filterData,function(index,v){
                                        if(v.mocpName == key){
                                            table +=
                                                '<tr>' +
                                                '<td>'+ v.indicatorName+'---'+ v.metricName+'</td>' +
                                                '<td><input type="radio" name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=max">最大值</td>' +
                                                '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=min">最小值</td>' +
                                                '<td><input type="radio"  name="'+key+'" value="'+ v.mocp+'='+ v.moc+'='+ v.indicator+'='+ v.metric+'='+ v.indicatorName+'='+ v.metricName+'('+v.unit+')'+'=avg">平均值</td>' +
                                                '</tr>';
                                        }
                                    });
                                }
                            });
                            table += '</table>';
                            jQuery("#sort").html(table);
                        }

                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                },
                search:function(search,fnCallback){
                        var moName = typeof($scope.addPage.data.molistName) == "undefined"?"":$scope.addPage.data.molistName ;
                        var mocId = typeof($scope.addPage.data.moclistId) == "undefined"?"":$scope.addPage.data.moclistId ;
                        var metricId = typeof($scope.addPage.data.metriclistId) == "undefined"?"":$scope.addPage.data.metriclistId ;
                        var tiaojian = [];
                        var tx = 0;
                        if(moName == "" &&mocId == "" && metricId == ""){
                            $.each($scope.addPage.data.allData,function(i,v){
                                tiaojian[tx] = v;
                                tx++;
                            });
                        }else{
                            $.each($scope.addPage.data.allData,function(i,v){
                                if (moName != "" && mocId != "" && metricId != "") {
                                    if (v.moName.indexOf(moName) != -1 && mocId == v.mocId && metricId == v.metricId) {
                                        tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                                else if (mocId != "" && metricId != "") {
                                    if ( mocId == v.mocId && metricId == v.metricId) {
                                        tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                                else if (moName != "" && mocId != "") {
                                    if (v.moName.indexOf(moName) != -1 && mocId == v.mocId) {
                                        tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                                else if (mocId != "") {
                                    if (mocId == v.mocId) {
                                        tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                                else if (moName != "") {
                                    if (v.moName.indexOf(moName) != -1) {
                                        tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                            });
                        }

                        var max = tiaojian.length<(search.offset+search.limit)?tiaojian.length:(search.offset+search.limit);

                        var rows = new Array();
                        for(var i=search.offset;i<max;i++){
                            rows.push(tiaojian[i]);
                        }

                        //填充表格数据
                        var ddd = {total:tiaojian.length,rows:rows};
                        $scope.listPreparePage.data =ddd.rows;
                        fnCallback(ddd);
                }
            }
        };

        /*$scope.$watch("addPage.data.displayName",function(newVal,oldVal){
            $("#a").hide();
            $("#b").hide();
            if(Util.notNull(newVal)){
                if(newVal.length>30){
                    $("#b").hide();
                }
            }else{
                $("#a").show();
            }
        },false);*/

        $scope.$watch("addPage.data.mocpId",function(newVal,oldVal){
            $scope.addPage.data.mocId="";
            $scope.addPage.datas.mocs = [];
            if(Util.notNull(newVal)){
                $scope.addPage.datas.mocs = Util.findFromArray('id',newVal,$rootScope.report.mocTree)['children'];
            }
        },false);

        $scope.$watch("addPage.data.mocId",function(newVal, oldVal){
            $scope.addPage.data.metricsId = [];
            $scope.addPage.data.mosId = [];
            if(Util.notNull(newVal)) {
                var t = 'report_usage';
                if ($scope.addPage.data.reportlist == 2) {
                    t = 'report_availability';
                }
                if ($scope.addPage.data.reportlist == 1501) {
                    t = 'report_safe';
                    var treedata= [
                            {
                                "id":2456,
                                "name": "CommonDayAvailability",
                                "displayName": "日可用性",
                                "mocId": 11,
                                "unit": null,
                                "valType": null,
                                "type": 1,
                                "rule": 0,
                                "children": [
                                    {
                                        "id": 20000,
                                        "name": "safe",
                                        "displayName": "进程每分钟发送syslog数量",
                                        "mocId": 11,
                                        "unit": "",
                                        "valType": "double",
                                        "type": 2,
                                        "rule": 0,
                                        "children": [],
                                        "provider": null,
                                        "created": null,
                                        "createdBy": null,
                                        "updated": null,
                                        "updatedBy": null,
                                        "orderBy": null,
                                        "report": "s",
                                        "group": false,
                                        "parentId": 2456,
                                        "enumMap": {}
                                    }
                                ],
                                "provider": null,
                                "created": null,
                                "createdBy": null,
                                "updated": null,
                                "updatedBy": null,
                                "orderBy": null,
                                "report": null,
                                "group": true,
                                "parentId": null,
                                "enumMap": {}
                            }
                        ]
                    $scope.addPage.data.metricsId =20000;
                    $scope.addPage.datas.metricTree =treedata;



                }
                //判断可用性报表 或者 利用率报表
                if (t != 'report_safe') {

                    DataLoad.getMetricByMocId({rule: t, mocId: newVal}, {}, function (data) {
                        $scope.addPage.datas.metricTree = [];
                        $.each(data, function (i, v) {
                            if (v.name != 'CommonAvailability') {
                                $scope.addPage.datas.metricTree.push(v);
                            }
                        });
                        //$scope.addPage.datas.metricTree = data;
                    });
                }
                Loading.show();
                DataLoad.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    var mocName="";
                    $.each($rootScope.report.mocTree,function(a,v){
                        $.each(v.children,function(b,v2){
                            if(v2.id==newVal){
                                mocName = v2.displayName;
                                return true;
                            }
                        });
                    });
                    $scope.addPage.datas.moTree = [{id:-1,displayName:mocName,children:data.rows}];
                   Loading.hide();
                });
            }
        },false);

        $scope.$watch("addPage.data.metricsId",function(newVal, oldVal){
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.addPage.hidden.metric = 1;
            }else{
                $scope.addPage.hidden.metric = "";
            }
        },true);

        $scope.$watch("addPage.data.mosId",function(newVal, oldVal){
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.addPage.hidden.mo = 1;
            }else{
                $scope.addPage.hidden.mo = "";
            }
        },true);

        $scope.$watch("addPage.data.moclistId",function(newVal, oldVal){
            $scope.addPage.data.metriclistId = "";
            $scope.addPage.datas.metriclist = [];
            if(Util.notNull(newVal)){
                var x = 0;
                if($scope.addPage.data.allData != null){
                    $.each($scope.addPage.data.allData,function(i,v1){
                        if(newVal==v1.mocId){
                            //判断是否存在相同指标
                            var flag = false;
                            $.each($scope.addPage.datas.metriclist,function(j,vv){
                                if(v1.metricId==vv.id){
                                    flag = true;
                                    return;
                                }
                            });
                            if(!flag){
                                $scope.addPage.datas.metriclist[x] = {id:v1.metricId,displayName:v1.indicatorName+"-"+v1.metricName};
                                x++;
                            }
                        }
                    });
                }
            }
        },false);

        $scope.$watch("addPage.data.startDay",function(newVal, oldVal){
            if(newVal>=0){
                $scope.addPage.datas.endDays = $filter('loop')([],Number(newVal),23,1);
            }
        },false);

        $scope.$watch("addPage.data.startWeek",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                var a = $filter('loop')([],Number(newVal),7,1);
                $scope.addPage.datas.endWeeks = [];
                $.each(a,function(i,v){
                    var w = {};
                    w.id = v;
                    if(v==1)
                        w.name='星期一';
                    if(v==2)
                        w.name='星期二';
                    if(v==3)
                        w.name='星期三';
                    if(v==4)
                        w.name='星期四';
                    if(v==5)
                        w.name='星期五';
                    if(v==6)
                        w.name='星期六';
                    if(v==7)
                        w.name='星期日';
                    $scope.addPage.datas.endWeeks[i]=w;
                });
            }
        },false);

        $scope.$watch("addPage.data.startMonth",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                $scope.addPage.datas.endMonths = $filter('loop')([],Number(newVal),31,1);
            }
        },false);

        $scope.$watch("addPage.data.startYearMonth",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                var day = 29;
                if(newVal==1 || newVal==3 || newVal==5 || newVal==7 || newVal==8 || newVal==10 || newVal==12)
                    day=31;
                else if(newVal==4 || newVal==6 || newVal==9 || newVal==11)
                    day=30;
                $scope.addPage.datas.startYearDays = $filter('loop')([],Number(1),day,1);
                $scope.addPage.datas.endYearMonths = [];
                $scope.addPage.datas.endYearMonths = $filter('loop')([],Number(newVal),12,1);
                $scope.addPage.data.startYearDay=1;

                $timeout(function(){
                    jQuery("#year-start-day option[value=1]").attr("selected","selected");
                },100);
            }
        },false);

        $scope.$watch("addPage.data.endYearMonth",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                var day = 29;
                if(newVal==1 || newVal==3 || newVal==5 || newVal==7 || newVal==8 || newVal==10 || newVal==12)
                    day=31;
                else if(newVal==4 || newVal==6 || newVal==9 || newVal==11)
                    day=30;
                var d = 1;
                if($scope.addPage.data.startYearMonth==$scope.addPage.data.endYearMonth)
                    d=$scope.addPage.data.startYearDay;
                $scope.addPage.datas.endYearDays = $filter('loop')([],Number(d),day,1);
            }
        },false);
//
        $scope.$watch("addPage.data.startYearDay",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                var day = 29;
                if(newVal==1 || newVal==3 || newVal==5 || newVal==7 || newVal==8 || newVal==10 || newVal==12)
                    day=31;
                else if(newVal==4 || newVal==6 || newVal==9 || newVal==11)
                    day=30;
                var d = 1;
                if($scope.addPage.data.startYearMonth==$scope.addPage.data.endYearMonth)
                    d=$scope.addPage.data.startYearDay;
                $scope.addPage.datas.endYearDays = $filter('loop')([],Number(d),day,1);
            }
        },false);

        $scope.$watch("addPage.data.exeMonth",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                var day = 29;
                if(newVal==1 || newVal==3 || newVal==5 || newVal==7 || newVal==8 || newVal==10 || newVal==12)
                    day=31;
                else if(newVal==4 || newVal==6 || newVal==9 || newVal==11)
                    day=30;
                $scope.addPage.datas.exeDays = $filter('loop')([],Number(1),day,1);
            }
        },false);

        $scope.$watch("addPage.data.allData",function(newVal, oldVal){
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.addPage.hidden.allData = "1";
            }else{
                $scope.addPage.hidden.allData = "";
            }
        },true);

        $scope.listPreparePage.settings = {
            reload : null,
            getData:$scope.listPreparePage.action.search, //getData应指定获取数据的函数
            columns : [
                /*{
                    sTitle: "资源类型组",
                    mData:"mocpName"
                },
                {
                    sTitle: "资源类型",
                    mData:"mocName"
                },*/
                {
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },{
                    sTitle: "索引值",
                    mData:"metricsArgsDesc",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "指标类型组",
                    mData:"indicatorName"
                },
                {
                    sTitle: "指标类型",
                    mData:"metricName"
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i class="fa fa-trash-o" ng-click="listPreparePage.action.remove(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2,3,4]},//列不可排序
                { sWidth: "50px", aTargets: [4]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        ////端口流量分析报表
        $scope.listPreparePagePort = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                search: function (search,fnCallback) {
                    Loading.show();
                    if(typeof($scope.addPage.data.portData) == "undefined" || $scope.addPage.data.portData.length==0){
                        DataLoad.getReportMetricPort({'mocId':$scope.addPage.data.portmocId,'metricsId':$scope.addPage.data.portmetricId},{},function(data){
                            $scope.addPage.data.portData = data;
                            var portMoName = typeof($scope.addPage.data.portMoName) == "undefined"?"":$scope.addPage.data.portMoName ;
                            var portLocId = typeof($scope.addPage.data.portLocId) == "undefined"?"":$scope.addPage.data.portLocId ;
                            $scope.addPage.data.tiaojian = [];
                            var tx = 0;
                            if(portMoName == "" && portLocId == ""){
                                $.each(data,function(i,v){
                                    $scope.addPage.data.tiaojian[tx] = v;
                                    tx++;
                                });
                            }else{
                                $.each(data,function(i,v){
                                    if (portMoName != "" && portLocId != "") {
                                        if (v.moName.indexOf(portMoName) != -1 && portLocId == v.portLocId) {
                                            $scope.addPage.data.tiaojian[tx] = v;
                                            tx++;
                                        }
                                    }
                                    else if (portLocId != "") {
                                        if (portLocId == v.portLocId) {
                                            $scope.addPage.data.tiaojian[tx] = v;
                                            tx++;
                                        }
                                    }
                                    else if (portMoName != "") {
                                        if (v.moName.indexOf(portMoName) != -1) {
                                            $scope.addPage.data.tiaojian[tx] = v;
                                            tx++;
                                        }
                                    }
                                });
                            }
                            var max = $scope.addPage.data.tiaojian.length<(search.offset+search.limit)?$scope.addPage.data.tiaojian.length:(search.offset+search.limit);
                            var rows = new Array();
                            for(var i=search.offset;i<max;i++){
                                rows.push($scope.addPage.data.tiaojian[i]);
                            }
                            //填充表格数据
                            var ddd = {total:$scope.addPage.data.tiaojian.length,rows:rows};
                            $scope.listPreparePagePort.data =ddd.rows;
                            fnCallback(ddd);
                            $scope.listPreparePagePort.checkedList = [];
                            $scope.listPreparePagePort.checkAllRow = false;
                            Loading.hide();
                        });
                    }else{
                        var portMoName = typeof($scope.addPage.data.portMoName) == "undefined"?"":$scope.addPage.data.portMoName ;
                        var portLocId = typeof($scope.addPage.data.portLocId) == "undefined"?"":$scope.addPage.data.portLocId ;
                        $scope.addPage.data.tiaojian = [];
                        var tx = 0;
                        if(portMoName == "" && portLocId == ""){
                            $.each($scope.addPage.data.portData,function(i,v){
                                $scope.addPage.data.tiaojian[tx] = v;
                                tx++;
                            });
                        }else{
                            $.each($scope.addPage.data.portData,function(i,v){
                                if (portMoName != "" && portLocId != "") {
                                    if (v.moName.indexOf(portMoName) != -1 && portLocId == v.portLocId) {
                                        $scope.addPage.data.tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                                else if (portLocId != "") {
                                    if (portLocId == v.portLocId) {
                                        $scope.addPage.data.tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                                else if (portMoName != "") {
                                    if (v.moName.indexOf(portMoName) != -1) {
                                        $scope.addPage.data.tiaojian[tx] = v;
                                        tx++;
                                    }
                                }
                            });
                        }
                        var max = $scope.addPage.data.tiaojian.length<(search.offset+search.limit)?$scope.addPage.data.tiaojian.length:(search.offset+search.limit);
                        var rows = new Array();
                        for(var i=search.offset;i<max;i++){
                            rows.push($scope.addPage.data.tiaojian[i]);
                        }

                        var checkedList = typeof($scope.listPreparePagePort.checkedList) == "undefined"?[]:$scope.listPreparePagePort.checkedList ;
                        var newCheckedList = [];
                        for(var i=0;i<checkedList.length;i++){
                            for(var j=0;j<$scope.addPage.data.tiaojian.length;j++){
                                 if(checkedList[i]==$scope.addPage.data.tiaojian[j].id){
                                     newCheckedList.push(checkedList[i]);
                                 }
                            }
                        }
                        $scope.listPreparePagePort.checkedList = newCheckedList;
                        $scope.listPreparePagePort.checkAllRow = newCheckedList.length>0 && newCheckedList.length==$scope.addPage.data.tiaojian.length;

                        DataLoad.getReportMetricPortMetricArgs(rows,function(data){
                             //填充表格数据
                            var ddd = {total:$scope.addPage.data.tiaojian.length,rows:data};
                            $scope.listPreparePagePort.data =ddd.rows;
                            fnCallback(ddd);
                            $timeout(function(){},10);
                            Loading.hide();
                        });
                    }
                }
            }
        }


        $scope.listPreparePagePort.settings = {
            reload : null,
            getData:$scope.listPreparePagePort.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPreparePagePort.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPreparePagePort.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },{
                    sTitle: "端口",
                    mData:"metricsArgsDesc",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2]},//列不可排序
                { sWidth: "38px", aTargets: [0]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        //多选框
        $scope.$watch("listPreparePagePort.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.listPreparePagePort.checkedList = Util.copyArray("id",$scope.addPage.data.tiaojian);
            }else{
                if(typeof($scope.addPage.data.tiaojian) != "undefined" && $scope.addPage.data.tiaojian.length == $scope.listPreparePagePort.checkedList.length){
                    $scope.listPreparePagePort.checkedList = [];
                }
            }
        },false);

        $scope.$watch("addPage.data.portmetricId",function(newVal,oldVal){
            if(newVal){
                $scope.addPage.data.portData = new Array();
                $scope.listPreparePagePort.settings.reload(true);
            }
        },false);


/////////////////////////报表编辑
        $scope.timerReportRuleEditDialog = Tools.dialog({
            id:"timerReportRuleEditDialog",
            title:"编辑",
            hiddenButton:true,
            save:function(){
                var param = {};
                param.displayName = $scope.editPage.data.displayName;
                param.active = $scope.editPage.data.active;
                param.orderBy = [];
                var x  = 0;
                $.each($scope.editmap,function(key,val){
                    param.orderBy[x] = $('input[name="edit'+key+'"]:checked').val();
                    x++;
                });
                param.orderByType = $scope.editPage.data.orderByType;

                if($scope.editPage.data.reportAttribute=='day'){
                    param.startTime = $("#edit-day-start").val();
                    param.endTime = $("#edit-day-end").val();
                    var exeTime = $("#edit-day-exe").val().split(":");
                    param.exeTime = "0 "+exeTime[1]+" "+exeTime[0]+" * * ?";
                    param.exeTimeDesc = exeTime[0]+"时"+exeTime[1]+"分";
                }else if($scope.editPage.data.reportAttribute=='week'){
                    param.startTime = $("#edit-week-start-week").val()+" "+$("#edit-week-start-week-h").val();
                    param.endTime = $("#edit-week-end-week").val()+" "+$("#edit-week-end-week-h").val();
                    var week = $("#edit-week-exe-week").val();
                    if(week<7)
                        week = parseInt(week)+1;
                    else
                        week = 1;
                    var exeTime = $("#edit-week-exe").val().split(":");
                    param.exeTime = "0 "+exeTime[1]+" "+exeTime[0]+" ? * "+week;
                    param.exeTimeDesc = $("#edit-week-exe-week").find("option:selected").text()+exeTime[0]+"时"+exeTime[1]+"分";
                }else if($scope.editPage.data.reportAttribute=='month'){
                    param.startTime = $("#edit-month-start").val();
                    param.endTime = $("#edit-month-end").val();
                    var exeTime = $("#edit-month-exe").val().split(" ");
                    var exe = exeTime[1].split(":");
                    param.exeTime = "0 "+exe[1]+" "+exe[0]+" "+exeTime[0]+" * ?";
                    param.exeTimeDesc = exeTime[0]+"日"+exe[0]+"时"+exe[1]+"分";
                }else if($scope.editPage.data.reportAttribute=='year'){
                    param.startTime = $("#edit-year-start").val();
                    param.endTime = $("#edit-year-end").val();
                    var exe = $("#edit-year-exe").val().split(" ");
                    var yd = exe[0].split("-");
                    var hi = exe[1].split(":");
                    param.exeTime = "0 "+hi[1]+" "+hi[0]+" "+yd[1]+" "+yd[0]+" ?";
                    param.exeTimeDesc = yd[0]+"月"+yd[1]+"日"+hi[0]+"时"+hi[1]+"分";
                }

                Loading.show();
                DataLoad.edit({id:$scope.editPage.data.id},param,function(data){
                    if(data.result=="success"){
                        $scope.timerReportRuleEditDialog.hide();
                        $scope.listPage.settings.reload(true);
                    }
                },function(error){
                    //$scope.timerReportRuleEditDialog.hide();
                    Loading.hide();
                });
            }
        });

        /*$scope.$watch("editPage.data.displayName",function(newVal,oldVal){
            $("#a1").hide();
            $("#b1").hide();
            if(!Util.notNull(newVal)){
                $("#a1").show();
            }else{
                if(newVal.length>30){
                    $("#b1").hide();
                }
            }
        },false);*/

//////////////控制编辑框中的下拉框

        $scope.$watch("editPage.data.startWeek",function(newVal, oldVal){
            if(Util.notNull(newVal)){
                var a = $filter('loop')([],Number(newVal),7,1);
                $scope.editPage.datas.endWeeks = [];
                $.each(a,function(i,v){
                    var w = {};
                    w.id = v;
                    if(v==1)
                        w.name='星期一';
                    if(v==2)
                        w.name='星期二';
                    if(v==3)
                        w.name='星期三';
                    if(v==4)
                        w.name='星期四';
                    if(v==5)
                        w.name='星期五';
                    if(v==6)
                        w.name='星期六';
                    if(v==7)
                        w.name='星期日';
                    $scope.editPage.datas.endWeeks[i]=w;
                });
            }
        },false);

        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                workListCheck:function(){
                    //alert($scope.addPage.data.incident);
                    $('input[name="workList"]:checked').each(function(){
                        //alert($scope.addPage.data.incident);
                        //alert($(this).val());
                    });
                },
                reportAttributeCheck:function(){
                    if(!$scope.report14){
                        if($("input[name='reportAttribute']:checked").length>0){
                            $scope.addPage.hidden.reportAttribute = false;
                        }else{
                            $scope.addPage.hidden.reportAttribute = true;
                        }
                    }else{
                        if($("input[name='reportAttribute_asset']:checked").length>0){
                            $scope.addPage.hidden.reportAttribute = false;
                        }else{
                            $scope.addPage.hidden.reportAttribute = true;
                        }
                    }
                },
                add:function(){
                    $scope.report1 = true;
                    $scope.report4 = false;
                    $scope.report5 = false;
                    $scope.report6 = false;
                    $scope.report7 = false;
                    $scope.report8 = false;
                    $scope.report9 = false;
                    $scope.report10 = false;
                    $scope.report11 = false;
                    $scope.report12 = false;
                    $scope.report14 = false;

                    $scope.report.action.initReportList();
                    jQuery("#sort").html("");
                    $scope.addPage.data={};
                    $scope.addPage.data.active=true;
                    $scope.addPage.data.mocpId="";
                    $scope.addPage.data.mocId="";
                    $scope.addPage.data.metricsId="";
                    $scope.addPage.data.mosId="";
                    $scope.addPage.datas.metricTree=[];
                    $scope.addPage.datas.moTree=[];
                    $scope.addPage.data.allData=[];
                    $scope.listPreparePage.settings.reload(true);
                    $scope.addPage.data.orderBy="";
                    $scope.addPage.datas.orderBy=[];
                    $scope.addPage.data.orderByType='正序';
                    $scope.addPage.data.moclistId = "";
                    $scope.addPage.data.molistName = "";
                    $scope.isShowDiv=false;

                    $("[name = reportAttribute]:checkbox").attr("checked", true);
                    $("[name = reportAttribute_asset]:checkbox").attr("checked", true);
                    $("[name = reportAttribute_safe]:checkbox").attr("checked", true);
                    $scope.addPage.data.startWeek=1;
                    $timeout(function(){
                        jQuery("#week-end-week option[value=7]").attr("selected","selected");
                    },100);
                    jQuery("#week-exe-week").val("1");
                    jQuery("#day-start").val("00:00");
                    jQuery("#day-end").val("23:59");
                    jQuery("#day-exe").val("00:00");
                    jQuery("#week-start-week-h").val("00:00");
                    jQuery("#week-end-week-h").val("23:59");
                    jQuery("#week-exe").val("00:00");
                    jQuery("#month-start").val("01 00:00");
                    jQuery("#month-end").val("31 23:59");
                    jQuery("#month-exe").val("01 00:00");
                    jQuery("#year-start").val("01-01 00:00");
                    jQuery("#year-end").val("12-31 23:59");
                    jQuery("#year-exe").val("01-01 00:00");

                    $scope.itsm.hosts = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','host',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.networks = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','network',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.storages = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','storage',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.databases = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','database',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.middlewares = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','middleware',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.services = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','service',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.environments = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','environment',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.applications = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','application',$rootScope.report.mocTree)['children']}];
                    $scope.itsm.links = [{"id":"全部","displayName":"全部","children":Util.findFromArray('name','link',$rootScope.report.mocTree)['children']}];

                    $scope.addPage.hidden.reportAttribute = false;
                    $scope.timerReportRuleAddDialog.show();
                },
                remove: function (id) {
                    $rootScope.$confirm("确定要删除吗？",function() {
                        Loading.show();
                        DataLoad.remove({ids:[id]},{},function(data){
                            if (data.result == "success") {
                                $scope.listPage.settings.reload(true);
                            }
                        }, function (error) {
                            Loading.hide();
                        });
                    }," 删 除 ");
                },
                removes:function(){
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择规则");
                    }else{
                        $rootScope.$confirm("确定要删除吗？",function(){
                            Loading.show();
                            DataLoad.remove({ids:$scope.listPage.checkedList},{},function(data){
                                if (data.result == "success") {
                                    $scope.listPage.settings.reload(true);
                                }
                            },function(error){
                                Loading.hide();
                            });
                        }," 删 除 ");
                    }
                },
                actives: function (flag) {
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择规则");
                    }else{
                        Loading.show();
                        DataLoad.active({ids:$scope.listPage.checkedList,active:flag},{},function(data){
                            $scope.listPage.settings.reload(true);
                        },function(error){
                            Loading.hide();
                        });
                    }
                },
                active: function (id,flag) {
                    Loading.show();
                    DataLoad.active({ids:[id],active:flag},{},function(data){
                        if(data.result=="success"){
                            $scope.listPage.settings.reload(true);
                        }
                    },function(error){
                        Loading.hide();
                    });
                },
                edit:function(id){
                    $("#day").hide();
                    $("#week").hide();
                    $("#month").hide();
                    $("#year").hide();
                    for(var i=0;i<$scope.listPage.data.length;i++){
                        if(id == $scope.listPage.data[i].id){
                            $scope.editPage.data = angular.copy($scope.listPage.data[i]);
                            $scope.editReportTree.data = [];
                            if($scope.editPage.data.reportType==1){
                                $scope.editReportTree.data.push({"id":1,"name":"利用率报表"});
                            }else if($scope.editPage.data.reportType==2){
                                $scope.editReportTree.data.push({"id":2,"name":"可用性报表"});
                            }else if($scope.editPage.data.reportType==4){
                                $scope.editReportTree.data.push({"id":3,"name":"运维统计","open":true,"children":[{"id":4,"name":"运维工单统计"}]});
                            }else if($scope.editPage.data.reportType==5){
                                $scope.editReportTree.data.push({"id":3,"name":"运维统计","open":true,"children":[{"id":5,"name":"运维区域统计"}]});
                            }else if($scope.editPage.data.reportType==6){
                                $scope.editReportTree.data.push({"id":3,"name":"运维统计","open":true,"children":[{"id":6,"name":"运维人员工作统计"}]});
                            }else if($scope.editPage.data.reportType==7){
                                $scope.editReportTree.data.push({"id":3,"name":"运维统计","open":true,"children":[{"id":7,"name":"运维资源类统计"}]});
                            }else if($scope.editPage.data.reportType==8){
                                $scope.editReportTree.data.push({"id":8,"name":"机房动环告警分析"});
                            }else if($scope.editPage.data.reportType==9){
                                $scope.editReportTree.data.push({"id":9,"name":"端口流量分析报表"});
                            }else if($scope.editPage.data.reportType==10){
                                $scope.editReportTree.data.push({"id":10,"name":"端口通断分析"});
                            }else if($scope.editPage.data.reportType==1101){
                                $scope.editReportTree.data.push({"id":1101,"name":"故障报表"});
                            }else if($scope.editPage.data.reportType==1201){
                                $scope.editReportTree.data.push({"id":1201,"name":"故障趋势报表"});
                            }else if($scope.editPage.data.reportType==1401){
                                $scope.editReportTree.data.push({"id":1401,"name":"资产报表"});
                            }else if($scope.editPage.data.reportType==1501){
                                $scope.editReportTree.data.push({"id":1501,"name":"安全审计报表"});
                            }

                            $("#w").html("");
                            $("#loc").html("");
                            $("#u").html("");
                            $("#moc").html("");
                            if($scope.editPage.data.reportType==1 || $scope.editPage.data.reportType==2|| $scope.editPage.data.reportType==1501){
                                $scope.molistPage.settings.reload(true);
                            }
                            else if($scope.editPage.data.reportType==4 || $scope.editPage.data.reportType==5 || $scope.editPage.data.reportType==6 || $scope.editPage.data.reportType==7) {
                                var obj = JSON.parse($scope.editPage.data.workList);
                                var t = "<table class='table' style='border: 1px solid #ccc;'>";
                                $.each(obj, function (index, val) {
                                    $.each(val, function (k, v) {
                                        var vv = "";
                                        $.each(v, function (ii, va) {
                                            vv += " " + va;
                                        });
                                        if ('incident' == k) {
                                            t += "<tr><td width='20%'>故障单</td><td width='80%'>" + vv + "</td></tr>";
                                        } else if ('problem' == k) {
                                            t += "<tr><td width='20%'>问题单</td><td width='80%'>" + vv + "</td></tr>";
                                        } else if ('change' == k) {
                                            t += "<tr><td width='20%'>变更单</td><td width='80%'>" + vv + "</td></tr>";
                                        }
                                    });
                                });
                                t += "</table>";
                                $("#w").html(t);
                            }
                            if($scope.editPage.data.reportType==5){
                                var obj = JSON.parse($scope.editPage.data.location);
                                DataLoad.getLocById({locId:obj},{},function(data){
                                    var d = "";
                                    for(var i=0;i<data.length;i++){
                                        d += " " + data[i].name;
                                    }
                                    $("#loc").html("<table class='table' style='border: 1px solid #ccc;'><tr><td>"+d+"</td></tr></table>");
                                });
                            }else if($scope.editPage.data.reportType==6){
                                var obj = JSON.parse($scope.editPage.data.dealUsers);
                                var t = "<table class='table' style='border: 1px solid #ccc;'>";
                                $.each(obj, function (index, val) {
                                    $.each(val, function (k, v) {
                                        var vv = "";
                                        $.each(v, function (ii, va) {
                                            $.each($rootScope.itsm.userList,function(aa,bb){
                                                   if(bb.id==va){
                                                       vv += " " + bb.realName;
                                                   }
                                            });
                                        });
                                        if ('createUsers' == k) {
                                            t += "<tr><td width='20%'>创建人</td><td width='80%'>" + vv + "</td></tr>";
                                        } else if ('resolveUsers' == k) {
                                            t += "<tr><td width='20%'>解决人</td><td width='80%'>" + vv + "</td></tr>";
                                        } else if ('closeUsers' == k) {
                                            t += "<tr><td width='20%'>关闭人</td><td width='80%'>" + vv + "</td></tr>";
                                        }
                                    });
                                });
                                t += "</table>";
                                $("#u").html(t);
                            }else if($scope.editPage.data.reportType==7){
                                var obj = JSON.parse($scope.editPage.data.mocList);
                                var t = "<table class='table' style='border: 1px solid #ccc;'>";
                                $.each(obj, function (index, val) {
                                    $.each(val, function (k, v) {
                                        $.each($rootScope.report.mocTree, function (aa, bb) {
                                            if(k==bb.name){
                                                var vv = "";
                                                $.each(v, function (ii, va) {
                                                    var hosts = Util.findFromArray('name',k,$rootScope.report.mocTree)['children'];
                                                    $.each(hosts,function(a,b){
                                                        if(va== b.id){
                                                            vv += " " + b.displayName;
                                                        }
                                                    });
                                                });
                                                t += "<tr><td width='20%'>"+bb.displayName+"</td><td width='80%'>" + vv + "</td></tr>";
                                            }
                                        });
                                    });
                                });
                                t += "</table>";
                                $("#moc").html(t);
                            }else if($scope.editPage.data.reportType==8){
                                DataLoad.getLocById({locId:$scope.editPage.data.jf},{},function(data){
                                    $("#jf1").html(data[0].name);
                                });
                            }else if($scope.editPage.data.reportType==9){
                                $scope.molistPortPage.settings.reload(true);
                            }else if($scope.editPage.data.reportType==10){
                                $scope.editLinkListPage.settings.reload(true);
                            }else if($scope.editPage.data.reportType==1101 || $scope.editPage.data.reportType==1201){
                                $scope.alarmmolistPage.settings.reload(true);
                            }else if($scope.editPage.data.reportType==1401){
                                $scope.assetlistPage.settings.reload(true);
                            }

                            $("#"+$scope.editPage.data.reportAttribute).show();
                            if($scope.editPage.data.reportAttribute=='day'){
                                $("#edit-day-start").val($scope.editPage.data.startTime);
                                $("#edit-day-end").val($scope.editPage.data.endTime);
                                $("#edit-day-exe").val($scope.editPage.data.exeTime.split(" ")[2]+":"+$scope.editPage.data.exeTime.split(" ")[1]);
                            }else if($scope.editPage.data.reportAttribute=='week'){
                                $scope.editPage.data.startWeek = $scope.editPage.data.startTime.split(" ")[0];
                                var week = $scope.editPage.data.exeTime.split(" ")[5];
                                if(week>1)
                                    week = parseInt(week)-1;
                                else
                                    week = 7;
                                $timeout(function(){
                                    jQuery("#edit-week-end-week option[value="+$scope.editPage.data.endTime.split(" ")[0]+"]").attr("selected","selected");
                                    jQuery("#edit-week-exe-week option[value="+week+"]").attr("selected","selected");
                                },100);
                                $("#edit-week-start-week-h").val($scope.editPage.data.startTime.split(" ")[1]);
                                $("#edit-week-end-week-h").val($scope.editPage.data.endTime.split(" ")[1]);
                                $("#edit-week-exe").val($scope.editPage.data.exeTime.split(" ")[2]+":"+$scope.editPage.data.exeTime.split(" ")[1]);
                            }else if($scope.editPage.data.reportAttribute=='month'){
                                $("#edit-month-start").val($scope.editPage.data.startTime);
                                $("#edit-month-end").val($scope.editPage.data.endTime);
                                $("#edit-month-exe").val($scope.editPage.data.exeTime.split(" ")[3]+" "+$scope.editPage.data.exeTime.split(" ")[2]+":"+$scope.editPage.data.exeTime.split(" ")[1]);
                            }else if($scope.editPage.data.reportAttribute=='year'){
                                $("#edit-year-start").val($scope.editPage.data.startTime);
                                $("#edit-year-end").val($scope.editPage.data.endTime);
                                $("#edit-year-exe").val($scope.editPage.data.exeTime.split(" ")[4]+"-"+$scope.editPage.data.exeTime.split(" ")[3]+" "+$scope.editPage.data.exeTime.split(" ")[2]+":"+$scope.editPage.data.exeTime.split(" ")[1]);
                            }
                            //过滤重复 指标  排序*******************************************
                            DataLoad.getReportMetricById({id:id},{},function(data){
                                $scope.editPage.data.allData = data;
                                var filterData = [];
                                var j=0;
                                $.each($scope.editPage.data.allData,function(index,val){
                                    var flag = false;
                                    $.each(filterData,function(i,v){
                                        if((v.mocpDisplayName+v.indicatorDisplayName+ v.metricDisplayName) == (val.mocpDisplayName+val.indicatorDisplayName+ val.metricDisplayName)){
                                            flag = true;
                                            return false;
                                        }
                                    });
                                    if(!flag){
                                        filterData[j] = val;
                                        j++;
                                    }
                                });
                                //过滤重复 指标
                                var filterData = [];
                                var j=0;
                                $.each($scope.editPage.data.allData,function(index,val){
                                    var flag = false;
                                    $.each(filterData,function(i,v){
                                        if((v.mocpDisplayName+v.indicatorDisplayName+ v.metricDisplayName) == (val.mocpDisplayName+val.indicatorDisplayName+ val.metricDisplayName)){
                                            flag = true;
                                            return false;
                                        }
                                    });
                                    if(!flag){
                                        filterData[j] = val;
                                        j++;
                                    }
                                });

                                var map = {};
                                $.each(filterData,function(index,val){
                                    if(val.mocpDisplayName in map){
                                        map[val.mocpDisplayName] = (++map[val.mocpDisplayName]);
                                    }else{
                                        map[val.mocpDisplayName] = 1;
                                    }
                                });
                                $scope.editmap = map;
                                //alert(JSON.stringify(map));
                                jQuery("#sortEdit").html("");

                                if($scope.editPage.data.reportType==1){
                                    //host=linux=CPU=WIO=处理器=IO等待率=avg   排序字段
                                    var table = '<table class="table" style="border: 1px solid #ccc;">';
                                    $.each(map,function(key,val){
                                        var indicatorDisplayName = "";
                                        var metricDisplayName = "";
                                        var minavgmax = "";
                                        $.each($scope.editPage.data.orderBy.split(","),function(index1,val1){
                                            var displayname = "";
                                            $.each($rootScope.report.mocTree,function(a,b){
                                                if(b.name == val1.split("=")[0]){
                                                    displayname = b.displayName;
                                                    return false;
                                                }
                                            });
                                            if(key==displayname){
                                                indicatorDisplayName = val1.split("=")[4];
                                                metricDisplayName = val1.split("=")[5];
                                                minavgmax = val1.split("=")[6];
                                                return false;
                                            }
                                        });

                                        if(val == 1){
                                            table  += '<thead class="ng-scope"><tr><th colspan="4" >'+key+'</th></tr></thead>';
                                            table  += '<tr><td>资源实例</td><td colspan="3"><input checked type="radio" name="edit'+key+'" value="资源名称">实例名称</td></tr>';
                                            $.each(filterData,function(index,v){
                                                if(v.mocpDisplayName == key){
                                                    if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName) && minavgmax == "max"){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input checked type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }else if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName) && minavgmax == "avg"){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input checked type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }else if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName) && minavgmax == "min"){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input checked type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }else{
                                                        table +=
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }
                                                    return false;
                                                }
                                            });
                                        }else{
                                            table  += '<thead class="ng-scope"><tr><th colspan="4" >'+key+'</th></tr></thead>';
                                            table  += '<tr><td>资源实例</td><td colspan="3" ><input checked type="radio" name="edit'+key+'" value="资源名称">实例名称</td></tr>';
                                            $.each(filterData,function(index,v){
                                                if(v.mocpDisplayName == key){
                                                    if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName) && minavgmax == "max"){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input checked type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }else if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName) && minavgmax == "avg"){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input checked type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }else if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName) && minavgmax == "min"){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input checked type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }else{
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=max">最大值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=min">最小值</td>' +
                                                            '<td><input type="radio"  name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')'+'=avg">平均值</td>' +
                                                            '</tr>';
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    table += '</table>';
                                    jQuery("#sortEdit").html(table);
                                }else if($scope.editPage.data.reportType==2||$scope.editPage.data.reportType==1501){//加入1501进程的table展示
                                    //host=linux=CPU=WIO=处理器=IO等待率   排序字段
                                    var table = '<table class="table" style="border: 1px solid #ccc;">';
                                    $.each(map,function(key,val){
                                        var indicatorDisplayName = "";
                                        var metricDisplayName = "";
                                        var minavgmax = "";
                                        $.each($scope.editPage.data.orderBy.split(","),function(index1,val1){
                                            var displayname = "";
                                            $.each($rootScope.report.mocTree,function(a,b){
                                                if(b.name == val1.split("=")[0]){
                                                    displayname = b.displayName;
                                                    return false;
                                                }
                                            });
                                            if(key==displayname){
                                                indicatorDisplayName = val1.split("=")[4];
                                                metricDisplayName = val1.split("=")[5];
                                               // minavgmax = val1.split("=")[6];
                                                return false;
                                            }
                                        });

                                        if(val == 1){
                                            table  += '<thead class="ng-scope"><tr><th colspan="2" >'+key+'</th></tr></thead>';
                                            table  += '<tr><td>资源实例</td><td><input checked type="radio" name="edit'+key+'" value="资源名称"></td></tr>';
                                            $.each(filterData,function(index,v){
                                                if(v.mocpDisplayName == key){
                                                    if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName)){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input checked type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')"></td>'+
                                                            '</tr>';
                                                    }else{
                                                        table +=
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')"></td>' +
                                                            '</tr>';
                                                    }
                                                    return false;
                                                }
                                            });
                                        }else{
                                            table  += '<thead class="ng-scope"><tr><th colspan="2" >'+key+'</th></tr></thead>';
                                            table  += '<tr><td>资源实例</td><td><input checked type="radio" name="edit'+key+'" value="资源名称"></td></tr>';
                                            $.each(filterData,function(index,v){
                                                if(v.mocpDisplayName == key){
                                                    if((v.indicatorDisplayName+'---'+ v.metricDisplayName+'('+ v.unit+')') == (indicatorDisplayName+'---'+ metricDisplayName)){
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input checked type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')"></td>' +
                                                            '</tr>';
                                                    }else{
                                                        table +=
                                                            '<tr>' +
                                                            '<td>'+ v.indicatorDisplayName+'---'+ v.metricDisplayName+'</td>' +
                                                            '<td><input type="radio" name="edit'+key+'" value="'+ v.mocpName+'='+ v.mocName+'='+ v.indicatorName+'='+ v.metricName+'='+ v.indicatorDisplayName+'='+ v.metricDisplayName+'('+ v.unit+')"></td>' +
                                                            '</tr>';
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    table += '</table>';
                                    jQuery("#sortEdit").html(table);
                                }
                            });
                            break;
                        }
                    }
                    $scope.timerReportRuleEditDialog.show();
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType  = search.orderByType;
                    Loading.show();
                    DataLoad.getReportRule($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                },
                searchMo:function(){
                    Loading.show();
                    DataLoad.getMoByMocId({mocId:$scope.addPage.data.mocId,displayName:$scope.addPage.data.moDisplayName,locId:$scope.addPage.data.locId,orderBy:'displayName',orderByType:'asc'},{},function(data) {
                        var mocName = "";
                        $.each($rootScope.report.mocTree, function (a, v) {
                            $.each(v.children, function (b, v2) {
                                if (v2.id == $scope.addPage.data.mocId) {
                                    mocName = v2.displayName;
                                    return true;
                                }
                            });
                        });
                        $scope.addPage.datas.moTree = [
                            {id: -1, displayName: mocName, children: data.rows}
                        ];
                        Loading.hide();
                    });
                }
            }
        };

        $scope.moPage={};

        $scope.molistPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                search: function (search,fnCallback) {
                    $scope.moPage.limit = search.limit;
                    $scope.moPage.offset = search.offset;
                    $scope.moPage.ruleId = $scope.editPage.data.id;
                    if(Util.notNull($scope.moPage.ruleId)){
                        Loading.show();
                        DataLoad.pageMO($scope.moPage,{},function(data){
                            $scope.molistPage.data =data.rows;
                            fnCallback(data);
                            $scope.molistPage.checkedList = [];
                            $scope.molistPage.checkAllRow = false;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }
            }
        };

        $scope.molistPage.settings = {
            reload : null,
            getData:$scope.molistPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },{
                    sTitle: "索引值",
                    mData:"metricsArgsDesc",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "指标类型组",
                    mData:"indicatorName"
                },
                {
                    sTitle: "指标类型",
                    mData: "metricName"
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2,3]}//列不可排序
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "规则名称",
                    mData:"displayName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "规则状态",
                    mData:"active",
                    mRender:function(mData,type,full) {
                        return full.active?'<font color="green">启用</font>':'<font color="red">停用</font>';
                    }
                },
                {
                    sTitle: "报表类型",
                    mData:"reportTypeDesc"
                },
                {
                    sTitle: "报表属性",
                    mData:"reportAttributeDesc"
                },
                {
                    sTitle: "执行时间",
                    mData:"exeTimeDesc"
                },
                {
                    sTitle: "创建时间",
                    mData:"created"
                },
                {
                    sTitle: "创建人",
                    mData:"createUser"
                },
                {
                    sTitle: "更新时间",
                    mData:"updated"
                },
                {
                    sTitle: "更新人",
                    mData:"updateUser"
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(disabledOp){
                            return '<i class="fa fa-pencil" title="编辑" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>' +
                                '<i class="fa fa-trash-o" title="删除" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                        }else{
                            return '<i class="fa fa-pencil" title="编辑" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                                '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="listPage.action.active(\''+mData+'\','+(full.active?'false':'true')+')"></i>' +
                                '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                        }
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,5,10]},//列不可排序
                { sWidth: "38px", aTargets: [0]},
                { sWidth: "100px", aTargets: [10]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        //多选框
        $scope.$watch("listPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.listPage.checkedList = Util.copyArray("id",$scope.listPage.data);
            }else{
                if($scope.listPage.data.length == $scope.listPage.checkedList.length){
                    $scope.listPage.checkedList = [];
                }
            }
        },false);

        $scope.$watch("listPage.checkedList",function(newVal,oldVal){
            $scope.listPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.listPage.data.length;
        },true);



        $scope.alarmmolistPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                search: function (search,fnCallback) {
                    $scope.moPage.limit = search.limit;
                    $scope.moPage.offset = search.offset;
                    $scope.moPage.ruleId = $scope.editPage.data.id;
                    if(Util.notNull($scope.moPage.ruleId)){
                        Loading.show();
                        DataLoad.pageMO($scope.moPage,{},function(data){
                            $scope.alarmmolistPage.data =data.rows;
                            fnCallback(data);
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }
            }
        };

        $scope.alarmmolistPage.settings = {
            reload : null,
            getData:$scope.alarmmolistPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "资源类型组",
                    mData:"mocpName"
                },
                {
                    sTitle: "资源类型",
                    mData: "mocName"
                },
                {
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2]}//列不可排序
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        $scope.assetPage = {};
        $scope.assetlistPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                search: function (search,fnCallback) {
                    $scope.assetPage.limit = search.limit;
                    $scope.assetPage.offset = search.offset;
                    $scope.assetPage.ruleId = $scope.editPage.data.id;
                    if(Util.notNull($scope.assetPage.ruleId)){
                        Loading.show();
                        DataLoad.pageAsset($scope.assetPage,{},function(data){
                            $scope.assetlistPage.data =data.rows;
                            fnCallback(data);
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }
            }
        };

        $scope.assetlistPage.settings = {
            reload : null,
            getData:$scope.assetlistPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "资产编号",
                    mData:"serial",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资产名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1]}//列不可排序
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        $scope.moportPage={};

        $scope.molistPortPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                search: function (search,fnCallback) {
                    $scope.moportPage.limit = search.limit;
                    $scope.moportPage.offset = search.offset;
                    $scope.moportPage.ruleId = $scope.editPage.data.id;
                    if(Util.notNull($scope.moportPage.ruleId)){
                        Loading.show();
                        DataLoad.pageMO($scope.moportPage,{},function(data){
                            $scope.molistPortPage.data =data.rows;

                            var d = $scope.molistPortPage.data[0];
                            var zy = "<table class='table' style='border: 1px solid #ccc;'>";
                            zy += "<tr><td width='20%'>"+ d.mocpName+"</td><td width='80%'>" + d.mocName + "</td></tr>";
                            zy += "</table>";
                            $("#zy").html(zy);

                            var zb = "<table class='table' style='border: 1px solid #ccc;'>";
                            zb += "<tr><td width='20%'>"+ d.indicatorName+"</td><td width='80%'>" + d.metricName + "</td></tr>";
                            zb += "</table>";
                            $("#zb").html(zb);

                            fnCallback(data);
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }
            }
        };

        $scope.molistPortPage.settings = {
            reload : null,
            getData:$scope.molistPortPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },{
                    sTitle: "端口",
                    mData:"metricsArgsDesc",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1]}//列不可排序
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        $scope.page = false;
        $scope.linkListPage = {
            data: [],
            alldata:[],
            action: {
                queryMaster:function(){
                    var array = new Array();
                    if(typeof($scope.addPage.data.masterName) != "undefined" && $scope.addPage.data.masterName != '') {
                        for(var j=0;j<$scope.addPage.datas.linkList.length;j++){
                            var flag = false
                            for(var i=0;i<$scope.linkListPage.alldata.length;i++){
                                if($scope.addPage.datas.linkList[j].mo.id == $scope.linkListPage.alldata[i].masterId){
                                    flag = true;
                                }
                            }
                            if(!flag){
                                array.push($scope.addPage.datas.linkList[j]);
                            }
                        }
                        $scope.addPage.datas.masterList = angular.copy(array);
                        /////////////////////////////////////
                        array = new Array();
                        for (var i = 0; i < $scope.addPage.datas.masterList.length; i++) {
                            if ($scope.addPage.datas.masterList[i].mo.displayName.indexOf($scope.addPage.data.masterName) != -1) {
                                array.push($scope.addPage.datas.masterList[i]);
                            }
                        }
                        $scope.addPage.datas.masterList = angular.copy(array);
                    }else{
                        for(var j=0;j<$scope.addPage.datas.linkList.length;j++){
                            var flag = false
                            for(var i=0;i<$scope.linkListPage.alldata.length;i++){
                                if($scope.addPage.datas.linkList[j].mo.id == $scope.linkListPage.alldata[i].masterId){
                                    flag = true;
                                }
                            }
                            if(!flag){
                                array.push($scope.addPage.datas.linkList[j]);
                            }
                        }
                        $scope.addPage.datas.masterList = angular.copy(array);
                    }
                },
                querySlave:function(){
                    var array = new Array();
                    if(typeof($scope.addPage.data.slaveName) != "undefined" && $scope.addPage.data.slaveName != '') {
                        for(var j=0;j<$scope.addPage.datas.linkList.length;j++){
                            var flag = false
                            for(var i=0;i<$scope.linkListPage.alldata.length;i++){
                                if($scope.addPage.datas.linkList[j].mo.id == $scope.linkListPage.alldata[i].slaveId){
                                    flag = true;
                                }
                            }
                            if(!flag){
                                array.push($scope.addPage.datas.linkList[j]);
                            }
                        }
                        $scope.addPage.datas.slaveList = angular.copy(array);
                        ////////////////////////
                        array = new Array();
                        for (var i = 0; i < $scope.addPage.datas.slaveList.length; i++) {
                            if ($scope.addPage.datas.slaveList[i].mo.displayName.indexOf($scope.addPage.data.slaveName) != -1) {
                                array.push($scope.addPage.datas.slaveList[i]);
                            }
                        }
                        $scope.addPage.datas.slaveList = angular.copy(array);;
                    }else{
                        for(var j=0;j<$scope.addPage.datas.linkList.length;j++){
                            var flag = false
                            for(var i=0;i<$scope.linkListPage.alldata.length;i++){
                                if($scope.addPage.datas.linkList[j].mo.id == $scope.linkListPage.alldata[i].slaveId){
                                    flag = true;
                                }
                            }
                            if(!flag){
                                array.push($scope.addPage.datas.linkList[j]);
                            }
                        }
                        $scope.addPage.datas.slaveList = angular.copy(array);
                    }
                },
                add:function(){
                    var master = $('input[name="master"]:checked').val();
                    var slave = $('input[name="slave"]:checked').val();
                    if(master == slave){
                        $rootScope.$alert("请选择不同线路");
                    }else if(typeof(master) != "undefined" && typeof(slave) != "undefined"){
                        $scope.page = true;
                        var data = {};
                        for(var i=0;i<$scope.addPage.datas.masterList.length;i++){
                            if($scope.addPage.datas.masterList[i].mo.id==master){
                                data.masterId = $scope.addPage.datas.masterList[i].mo.id;
                                data.masterName = $scope.addPage.datas.masterList[i].mo.displayName;
                            }
                        }
                        for(var i=0;i<$scope.addPage.datas.slaveList.length;i++){
                            if($scope.addPage.datas.slaveList[i].mo.id==slave){
                                data.slaveId = $scope.addPage.datas.slaveList[i].mo.id;
                                data.slaveName = $scope.addPage.datas.slaveList[i].mo.displayName;
                            }
                        }
                        var masterArray = new Array();
                        var slaveArray = new Array();
                        for(var i=0;i<$scope.addPage.datas.masterList.length;i++){
                            if($scope.addPage.datas.masterList[i].mo.id!=master){
                                masterArray.push($scope.addPage.datas.masterList[i]);
                            }
                        }
                        for(var i=0;i<$scope.addPage.datas.slaveList.length;i++){
                            if($scope.addPage.datas.slaveList[i].mo.id!=slave){
                                slaveArray.push($scope.addPage.datas.slaveList[i]);
                            }
                        }
                        $scope.addPage.datas.masterList = masterArray;
                        $scope.addPage.datas.slaveList = slaveArray;

                        $scope.linkListPage.alldata.push(data);
                        $scope.linkListPage.settings.reload(true);
                    }else{
                        $rootScope.$alert("请选择主备线路");
                    }
                },
                remove:function(id){
                    var array = new Array();
                    for(var i=0;i<$scope.linkListPage.alldata.length;i++){
                        if($scope.linkListPage.alldata[i].masterId!=id){
                            array.push($scope.linkListPage.alldata[i]);
                        }else{
                            //删除线路后还原到备选框中
                            for(var j=0;j<$scope.addPage.datas.linkList.length;j++){
                                if($scope.linkListPage.alldata[i].masterId==$scope.addPage.datas.linkList[j].mo.id){
                                    $scope.addPage.datas.masterList.push($scope.addPage.datas.linkList[j]);
                                }
                                if($scope.linkListPage.alldata[i].slaveId==$scope.addPage.datas.linkList[j].mo.id){
                                    $scope.addPage.datas.slaveList.push($scope.addPage.datas.linkList[j]);
                                }
                            }
                        }
                    }
                    $scope.linkListPage.alldata = array;
                    $scope.linkListPage.settings.reload(true);
                },
                search: function (search,fnCallback) {
                    var master = $('input[name="master"]:checked').val();
                    var slave = $('input[name="slave"]:checked').val();
                    if($scope.page){
                        var max = $scope.linkListPage.alldata.length<(search.offset+search.limit)?$scope.linkListPage.alldata.length:(search.offset+search.limit);
                        var rows = new Array();
                        for(var i=search.offset;i<max;i++){
                            rows.push($scope.linkListPage.alldata[i]);
                        }
                        fnCallback({"rows":rows,"total":$scope.linkListPage.alldata.length});
                    }else{
                        fnCallback({"rows":[],"total":0});
                    }
                }
            }
        };

        //端口通断分析
        $scope.linkListPage.settings = {
            reload : null,
            getData:$scope.linkListPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "广域网主线路",
                    mData:"masterName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "广域网备线路",
                    mData:"slaveName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"masterId",
                    mRender:function(mData,type,full) {
                        return '<i class="fa fa-trash-o" ng-click="linkListPage.action.remove(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2]},//列不可排序
                { sWidth: "50px", aTargets: [2]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        $scope.editLinkListPage = {
            data: [],
            action: {
                search: function (search,fnCallback) {
                    var page = {};
                    page.limit = search.limit;
                    page.offset = search.offset;
                    page.ruleId = $scope.editPage.data.id;
                    if(Util.notNull(page.ruleId)){
                        Loading.show();
                        DataLoad.pageMO(page,{},function(data){
                            $scope.editLinkListPage.data =data.rows;
                            fnCallback(data);
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }
            }
        };

        $scope.editLinkListPage.settings = {
            reload : null,
            getData:$scope.editLinkListPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "广域网主线路",
                    mData:"masterLinkName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "广域网备线路",
                    mData:"slaveLinkName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1]}//列不可排序
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        $scope.listMoPreparePage = {
            data:[],
            action:{
                remove:function(id){
                    var data = [];
                    for(var j=0;j<$scope.addPage.datas.allAlarmData.length;j++){
                        if(id != $scope.addPage.datas.allAlarmData[j].id){
                            data.push($scope.addPage.datas.allAlarmData[j]);
                        }
                    }
                    $scope.addPage.datas.allAlarmData = data;
                    $scope.listMoPreparePage.settings.reload(true);
                },
                generate:function(){
                    $scope.isShowDiv = true;
                    for(var i=0;i<$scope.addPage.datas.moTree[0].children.length;i++){
                        var flag = false;
                        for(var j=0;j<$scope.addPage.data.mosId.length;j++){
                            if($scope.addPage.datas.moTree[0].children[i].id == $scope.addPage.data.mosId[j]){
                                flag = true;
                                break;
                            }
                        }
                        if(flag){
                            var flag2 = false;
                            for(var j=0;j<$scope.addPage.datas.allAlarmData.length;j++){
                                if($scope.addPage.datas.allAlarmData[j].id == $scope.addPage.datas.moTree[0].children[i].id){
                                    flag2 = true;
                                    break;
                                }
                            }
                            if(!flag2)
                                $scope.addPage.datas.allAlarmData.push($scope.addPage.datas.moTree[0].children[i]);
                        }
                    }
                    $scope.listMoPreparePage.settings.reload(true);
                },
                search:function(search,fnCallback){
                    var tiaojian = typeof($scope.addPage.datas.allAlarmData) == "undefined"?[]:$scope.addPage.datas.allAlarmData;

                    /*var moName = typeof($scope.addPage.data.molistName) == "undefined"?"":$scope.addPage.data.molistName ;
                    var mocId = typeof($scope.addPage.data.moclistId) == "undefined"?"":$scope.addPage.data.moclistId ;
                    var tx = 0;
                    if(moName == "" && mocId == "" ){
                        $.each($scope.addPage.data.allAlarmData,function(i,v){
                            tiaojian[tx] = v;
                            tx++;
                        });
                    }else{
                        $.each($scope.addPage.data.allAlarmData,function(i,v){
                            if (moName != "" && mocId != "" && metricId != "") {
                                if (v.moName.indexOf(moName) != -1 && mocId == v.mocId && metricId == v.metricId) {
                                    tiaojian[tx] = v;
                                    tx++;
                                }
                            }
                            else if (mocId != "" && metricId != "") {
                                if ( mocId == v.mocId && metricId == v.metricId) {
                                    tiaojian[tx] = v;
                                    tx++;
                                }
                            }
                            else if (moName != "" && mocId != "") {
                                if (v.moName.indexOf(moName) != -1 && mocId == v.mocId) {
                                    tiaojian[tx] = v;
                                    tx++;
                                }
                            }
                            else if (mocId != "") {
                                if (mocId == v.mocId) {
                                    tiaojian[tx] = v;
                                    tx++;
                                }
                            }
                            else if (moName != "") {
                                if (v.moName.indexOf(moName) != -1) {
                                    tiaojian[tx] = v;
                                    tx++;
                                }
                            }
                        });
                    }*/

                    var max = tiaojian.length<(search.offset+search.limit)?tiaojian.length:(search.offset+search.limit);

                    var rows = new Array();
                    for(var i=search.offset;i<max;i++){
                        rows.push(tiaojian[i]);
                    }

                    //填充表格数据
                    var ddd = {total:tiaojian.length,rows:rows};
                    $scope.listMoPreparePage.data =ddd.rows;
                    fnCallback(ddd);
                }
            }
        };

        $scope.listMoPreparePage.settings = {
            reload : null,
            getData:$scope.listMoPreparePage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                 sTitle: "资源类型组",
                 mData:"mocpDisplayName"
                 },
                 {
                 sTitle: "资源类型",
                 mData:"mocDisplayName"
                 },
                {
                    sTitle: "资源实例",
                    mData:"displayName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i class="fa fa-trash-o" ng-click="listMoPreparePage.action.remove(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2,3]},//列不可排序
                { sWidth: "50px", aTargets: [3]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };


    }]);

    system.controller('timer-reportListCtrl',['$scope','$rootScope','DataLoad','$filter','Util',"Tools",'Loading','$routeParams','$timeout','Const',"$window",function($scope,$rootScope,DataLoad,$filter,Util,Tools,Loading,$routeParams,$timeout,Const,$window) {
        $scope.reportList={};
        $scope.archiveDir = {};
        $scope.archiveDir.data = {};


        $scope.reportListTree={
            data:[],
            checked:"",
            crossParent:"true",
            treeId: 'reportListTree',
            checkType: { "Y" : "", "N" : "" },
            checkbox:null,
            treeClick:function(node){
                $scope.reportfileName = node.key;
                DataLoad.getReportFile({fileName:node.key},{},function(data){
                    $scope.reportList.data = data;
                });
            }
        };
        DataLoad.leftTree({},{}, function (data) {
            $scope.reportListTree.data=data;
        });

        //归档
        $scope.fileDialog = Tools.dialog({
            id:"fileDialog",
            title:"归档目录",
            hiddenButton:true,
            save:function(){
                Loading.show();
                DataLoad.archive({"fileId":$scope.archiveDir.data.fileId,"dirId": $scope.archiveDir.data.dirId},{},function(data){
                    $scope.fileDialog.hide();
                    DataLoad.getReportFile({fileName:$scope.reportfileName},{},function(data){
                        $scope.reportList.data = data;
                    });
                    DataLoad.leftTree({},{}, function (data) {
                        $scope.reportListTree.data=data;
                    });
                    Loading.hide();
                },function(error){
                    $scope.fileDialog.hide();
                    Loading.hide();
                });
            }
        });

        $scope.archive={
            roledir : [],
            confirm:function(fileId){
                DataLoad.roleTree(function(data){
                    $scope.archive.roledir = data;
                });
                $scope.archiveDir.data.dirId="";
                $scope.archiveDir.data.fileId = fileId;
                $scope.fileDialog.show();
            }
        }
    }]);

})(angular);