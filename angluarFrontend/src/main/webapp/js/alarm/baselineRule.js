(function (angular) {

    angular.module('alarm.baselineRule', ['resource.client','util.filters'])
        .controller('baselineRuleCtrl', ['$scope', '$rootScope', 'Util', '$timeout', 'Modal', 'Loading', '$routeParams', 'BaselineClient','LocationClient','BaselineRuleClient','MoClient','$filter', function ($scope, $rootScope, Util, $timeout, Modal, Loading, $routeParams, BaselineClient,LocationClient,BaselineRuleClient,MoClient,$filter) {
            $scope.offset = 3600*8*1000;
            LocationClient.queryJf(function(data){
                $scope.locationsForJF =data;
                $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
            });
            LocationClient.query(function(data){
                $scope.locations = data;
                $scope.locationsForSearch =[{"id":-1,"name":" 未设置区域 "}].concat(data);
            });

            $scope.common = {
                action : {
                    showAddPage:function(isEdit){
                        $scope.addPage.modal.settings.title = isEdit?"编辑":"新增";
                        Modal.show($scope.addPage.modal.settings.id);
                    }
                }
            };

            $scope.mocTree = {
                refreshTree : function(){
                    BaselineRuleClient.tree(function (data) {
                        $scope.mocTree.data = data;
                    });
                }
            };
            $scope.metric = [];
            $scope.metricReady = false;

            BaselineRuleClient.tree(function (data) {
                $scope.mocTree.data = data;
                $timeout(function () {
                    $scope.searchPage.data.mocpId = data[0].id;
                }, 100);
            });

            BaselineClient.metric({rule: "history_chart"}, function (data) {
                $scope.metric = data;
                $scope.metricReady = true;
            });


            BaselineRuleClient.userTreeData(function (data) {
                forEachArray(data);
                $scope.notifyUserTree = data;
                function forEachArray(rows){
                    for(var i=0;i<rows.length;i++){
                        var row=rows[i];
                        if((row.id+'').indexOf("u_")==-1){
                            row.id = "loc_"+row.id;
                            row.isUser=false;
                        }else{
                            row.id = Number((row.id+'').replace("u_",""));
                            row.isUser=true;
                        }
                        if(row.children && row.children.length>0){
                            forEachArray(row.children);
                        }
                    }
                }
            });

            //searchPage
            $scope.searchPage = {
                data: {
                    mocpId: "",
                    mocId: "",
                    indicatorId: "",
                    metricId: "",
                    displayName: "",
                    moDisplayName:"",
                    jfId:"",
                    active:"",
                    startUpdated:"",
                    endUpdated:"",
                    sampleInterval:"",
                    levels:[2,3,4,5,6]
                },
                mocList: [],
                indicatorList: [],
                metricList: [],
                sampleIntervalList:[],
                isLeaf:function(nodeData){
                    return nodeData.id==-1 || nodeData.isJF;
                },
                action: {
                   search: function(cancelSort){
                       if($scope.searchPage.data.startUpdated && $scope.searchPage.data.endUpdated){
                           if($scope.searchPage.data.startUpdated>$scope.searchPage.data.endUpdated){
                               $rootScope.$alert("日期范围错误");
                               return;
                           }
                       }else if($scope.searchPage.data.startUpdated && !$scope.searchPage.data.endUpdated){
                           $rootScope.$alert("请输入结束时间");
                           return;
                       }else if(!$scope.searchPage.data.startUpdated && $scope.searchPage.data.endUpdated){
                           $rootScope.$alert("请输入开始时间");
                           return;
                       }
                        $scope.listPage.settings.reload(cancelSort);
                    }
                }
            };

            //watch
            $scope.$watch("searchPage.data.mocpId", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    Util.delay("$root.resource.ready", function () {
                        $timeout(function () {
                            $scope.searchPage.mocList = Util.findFromArray("id", newVal, $rootScope.resource.moc)["children"];
                        }, 100);
                    }, $scope);
                    //清除搜索项
                    if (newVal != oldVal) {
                        BaselineRuleClient.sampleInterval({mocpId:newVal},function(data){
                            $scope.searchPage.sampleIntervalList = [];
                            for(var i=0;i<data.list.length;i++){
                                var temp = Number(data.list[i]);
                                $scope.searchPage.sampleIntervalList.push({value:temp,label:(temp<3600?(temp/60+"分钟"):(temp/3600+"小时"))});
                            }
                        });

                        $scope.searchPage.data.mocId="";
                        $scope.searchPage.data.indicatorId="";
                        $scope.searchPage.data.metricId="";
                        $scope.searchPage.data.displayName="";
                        $scope.searchPage.data.moDisplayName="";
                        $scope.searchPage.data.jfId="";
                        $scope.searchPage.data.active="";
                        $scope.searchPage.data.startUpdated="";
                        $scope.searchPage.data.endUpdated="";
                        $scope.searchPage.data.sampleInterval="";
                        $scope.searchPage.data.levels=[2,3,4,5,6];
                        $scope.searchPage.action.search(true);
                    }
                }
            }, false);

            $scope.$watch("searchPage.data.mocId", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    Util.delay("metricReady", function () {
                        $timeout(function () {
                            $scope.searchPage.data.metricId = "";
                            $scope.searchPage.data.indicatorId = "";
                            $scope.searchPage.indicatorList = Util.findAllFromArray("mocId", newVal, $scope.metric);
                            $scope.searchPage.metricList = [];
                        }, 100);
                    }, $scope);
                }else{
                    $timeout(function () {
                        $scope.searchPage.data.metricId = "";
                        $scope.searchPage.data.indicatorId = "";
                        $scope.searchPage.metricList = [];
                        $scope.searchPage.indicatorList = [];
                    }, 100);
                }
            }, false);

            $scope.$watch("searchPage.data.indicatorId", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    Util.delay("metricReady", function () {
                        $timeout(function () {
                            $scope.searchPage.data.metricId = "";
                            $scope.searchPage.metricList = Util.findFromArray("id", newVal, $scope.metric)["children"];
                        }, 100);
                    }, $scope);
                }else{
                    $timeout(function () {
                        $scope.searchPage.data.metricId = "";
                        $scope.searchPage.metricList = [];
                    }, 100);
                }
            }, false);

            //listPage
            $scope.listPage = {
                data:[],
                checkedList : [],
                checkAllRow : false
            };

            $scope.listPage.action = {
                add :function(){
                    $scope.addPage.action.init(false);
                    $scope.common.action.showAddPage(false);
                },
                edit :function(baselineRuleId){
                    Loading.show();
                    var rule = Util.findFromArray("id",baselineRuleId,$scope.listPage.data);
                    BaselineClient.get({id:rule.baselineId},function(data){
                        $scope.addPage.action.init(true,rule,data);
                        $scope.common.action.showAddPage(true);
                        Loading.hide();
                    },function(){
                        Loading.hide();
                    });
                },
                batchDelete :function(){
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择要删除的资源");
                    }else{
                        $rootScope.$confirm("确定要删除么？",function(){
                            Loading.show();
                            BaselineRuleClient.batchRemove({ids:$scope.listPage.checkedList},{},function(){
                                Loading.hide();
                                $rootScope.$alert("删除成功");
                                $scope.searchPage.action.search(false);
                                $scope.mocTree.refreshTree(); //刷新统计数据
                            },function(){
                                Loading.hide();
                                $scope.searchPage.action.search(false);
                            });
                        }," 删 除 ");
                    }
                },
                del :function(baselineRuleId){
                    $rootScope.$confirm("确定要删除么？",function(){
                        Loading.show();
                        BaselineRuleClient.remove({id:baselineRuleId},{},function(){
                            Loading.hide();
                            $rootScope.$alert("删除成功");
                            $scope.searchPage.action.search(false);
                            $scope.mocTree.refreshTree(); //刷新统计数据
                        },function(){
                            Loading.hide();
                            $scope.searchPage.action.search(false);
                        });
                    }," 删 除 ");
                },
                batchActive :function(flag){
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择规则");
                    }else{

                            Loading.show();
                            BaselineRuleClient.batchActive({ids:$scope.listPage.checkedList,active:flag},{},function(){
                                Loading.hide();
                                $scope.searchPage.action.search(false);
                            },function(){
                                Loading.hide();
                            });

                    }
                },
                active :function(id,flag){
                        Loading.show();
                        BaselineRuleClient.active({id:id,active:flag},{},function(){
                            Loading.hide();
                            $scope.searchPage.action.search(false);
                        },function(){
                            Loading.hide();
                        });
                }
            };

            $scope.listPage.settings = {
                reload : null,
                getData: function (search, fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    if($scope.searchPage.data.mocpId) {
                        Loading.show();
                        BaselineRuleClient.query($scope.searchPage.data, function (data) {
                            $scope.listPage.data = data.rows;
                            fnCallback(data);
                            $scope.listPage.checkedList = [];
                            $scope.listPage.checkAllRow = false;
                            Loading.hide();
                        });
                    }
                }, //getData应指定获取数据的函数
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
                            if(mData){
                                return "<span style='color:green'>启用</span>";
                            }else{
                                return "<span style='color:red'>停用</span>";
                            }
                        }
                    },
                    {
                        sTitle: "告警等级",
                        mData:"level",
                        mRender:function(mData,type,full) {
                            return Util.findFromArray("value",mData,$rootScope.alarm.const.levels)["label"];
                        }
                    },
                    {
                        sTitle: "资源实例",
                        mData:"moDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资源类型",
                        mData:"mocDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资源指标组",
                        mData:"indicatorDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资源指标",
                        mData:"metricDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "轮询间隔",
                        mData:"sampleInterval",
                        mRender:function(mData,type,full) {
                            if(mData<3600){
                                return Util.str2Html(mData/60+"分钟");
                            }else{
                                return Util.str2Html(mData/3600+"小时");
                            }
                        }
                    },
                    {
                        sTitle: "更新时间",
                        mData:"updated",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(full.updatedStr);
                        }
                    },
                    {
                        sTitle: "基线名称",
                        mData:"baselineDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle:"操作",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                            if(disabledOp){
                                return '<i title="编辑" class="fa fa-pencil" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                    '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>' +
                                    '<i title="删除" class="fa fa-trash-o" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                            }else{
                                return '<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                                    '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="listPage.action.active(\''+mData+'\','+(full.active?'false':'true')+')"></i>' +
                                    '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.del(\''+mData+'\')"></i>';
                            }
                        }
                    }
                ] , //定义列的形式,mRender可返回html
                columnDefs : [
                    { bSortable: false, aTargets: [ 0,11 ] },  //不可排序
                    { sWidth: "85px", aTargets: [ 3 ] },
                    { sWidth: "38px", aTargets: [ 0 ] },
                    { sWidth: "100px", aTargets: [ 11 ] }
                ], //定义列的约束
                defaultOrderBy : []
            };

            //watch
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

            //addPage
            $scope.addPage = {
                isEdit:false,
                plusOptionShow : false,
                hitRulesPanelShow : false,
                showBaselinePanel : false,
                showBaselineChart : false,
                canScanChart : false,
                temp:{},
                data :{},
                hit :{
                    search : {},
                    temp : {},
                    settings : {
                        reload : null,
                        pageSize:5,
                        getData:function(search,fnCallback){
                            fnCallback($scope.addPage.action.filterBaseRule(search));
                        },
                        columns : [
                            {
                                sTitle: "规则名称",
                                mData:"displayName",
                                mRender:function(mData,type,full) {
                                    return "<label class='td-text' style='margin-top: 0px' title='"+mData+"' style='width: 120px;'>"+mData+"</label>";
                                }
                            },
                            {
                                sTitle: "资源实例",
                                mData:"moName",
                                mRender:function(mData,type,full) {
                                    return "<label class='td-text' style='margin-top: 0px' title='"+mData+"' style='width: 100px;'>"+mData+"</label>";
                                }
                            },
                            {
                                sTitle: "指标类型组",
                                mData:"indicatorName"
                            },
                            {
                                sTitle: "指标类型",
                                mData:"metricName",
                                mRender:function(mData,type,full) {
                                    return "<label class='td-text' style='margin-top: 0px' title='"+mData+"' style='width: 100px;'>"+mData+"</label>";
                                }
                            },
                            {
                                sTitle: "索引值",
                                mData:"metricsArgs"
                            },
                            {
                                sTitle: "操作",
                                mData:"id",
                                mRender:function(mData,type,full) {
                                    return '<i title="删除" class="fa fa-trash-o" ng-click="addPage.action.delHitRule(\''+mData+'\')"></i>';
                                }
                            }
                        ] , //定义列的形式,mRender可返回html
                        columnDefs : [
                            { bSortable: false,aTargets:[0,1,2,3,4,5]},//列不可排序
                            { sWidth: "50px", aTargets: [5]}
                        ] , //定义列的约束
                        defaultOrderBy :[]  //定义默认排序列为第8列倒序
                    }
                },
                baseline :{
                    data:{},
                    temp:{},
                    search:{},
                    settings : {
                        reload : null,
                        pageSize:5,
                        getData: function (search, fnCallback) {
                            $scope.addPage.baseline.search.limit = search.limit;
                            $scope.addPage.baseline.search.offset = search.offset;
                            $scope.addPage.baseline.search.orderBy = search.orderBy;
                            $scope.addPage.baseline.search.orderByType = search.orderByType;
                            $scope.addPage.baseline.search.mocId=$scope.addPage.data.mocId;
                            $scope.addPage.baseline.search.mocpId=$scope.searchPage.data.mocpId;
                            Loading.show();
                            BaselineClient.query($scope.addPage.baseline.search, function (data) {
                                $scope.addPage.baseline.temp.baselineList = data.rows;
                                fnCallback(data);
                                Loading.hide();
                            });
                        }, //getData应指定获取数据的函数
                        columns : [
                            {
                                sTitle: "基线名称",
                                mData:"displayName",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "资源指标组",
                                mData:"indicatorDisplayName",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "资源指标",
                                mData:"metricDisplayName",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "偏离类型",
                                mData:"type",
                                mRender:function(mData,type,full) {
                                    return full.typeStr;
                                }
                            },
                            {
                                sTitle: "正偏离",
                                mData:"offsetP",
                                mRender:function(mData,type,full) {
                                    return full.offsetPStr;
                                }
                            },
                            {
                                sTitle: "负偏离",
                                mData:"offsetN",
                                mRender:function(mData,type,full) {
                                    return full.offsetNStr;
                                }
                            },
                            {
                                sTitle: "数据日期",
                                mData:"valueDate",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(full.valueDateStr);
                                }
                            },
                            {
                                sTitle:"操作",
                                mData:"id",
                                mRender:function(mData,type,full) {
                                    return '<i class="fa fa-check-circle blue" title="选择" ng-click="addPage.action.selectBaseline('+mData+')"> </i>' +
                                        '<i class="fa fa-bar-chart-o" title="预览" ng-click="addPage.action.showBaselineChart('+mData+')"></i>';
                                }
                            }

                        ] , //定义列的形式,mRender可返回html
                        columnDefs : [
                            { bSortable: false,aTargets:[7]},//列不可排序
                            { sWidth: "65px", aTargets: [7]}
                        ] , //定义列的约束
                        defaultOrderBy :[]
                    }
                },
                modal : {
                    settings : {
                        id : "baseline_rule_add_modal_div",
                        title:"新增",
                        saveBtnText:"保存",
                        saveDisabled:true,
                        save : function(){
                            Loading.show();
                            if($scope.addPage.isEdit){
                                BaselineRuleClient.update({id:$scope.addPage.data.id},$scope.addPage.data, function () {
                                    $scope.searchPage.action.search(true);
                                    $scope.mocTree.refreshTree(); //刷新统计数据
                                    Loading.hide();
                                    $rootScope.$alert("修改基线告警规则成功");
                                    Modal.hide($scope.addPage.modal.settings.id);
                                }, function () {
                                    Loading.hide();
                                });
                            }else {
                                var postBody = [];
                                var template = $scope.addPage.data;
                                for (var i = 0; i < $scope.addPage.hit.selectBaseRuleList.length; i++) {
                                    var baseRule = $scope.addPage.hit.selectBaseRuleList[i];
                                    postBody.push({
                                        displayName: baseRule.displayName,
                                        active: template.active,
                                        level: template.level,
                                        mocId: template.mocId,
                                        metricId: baseRule.metricId,
                                        moId: baseRule.moId,
                                        baselineId: template.baselineId,
                                        metricIndex: baseRule.metricsArgs,
                                        intervalUnit: template.intervalUnit,
                                        intervalNum: template.intervalNum,
                                        workingDayList: template.workingDayList,
                                        workingTimeBegin: template.workingTimeBegin,
                                        workingTimeEnd: template.workingTimeEnd,
                                        notifierList: template.notifierList,
                                        notifyWayList: template.notifyWayList,
                                        occursDelay: template.occursDelay
                                    });
                                }

                                BaselineRuleClient.batchSave({}, postBody, function () {
                                    $scope.searchPage.action.search(true);
                                    $scope.mocTree.refreshTree(); //刷新统计数据
                                    Loading.hide();
                                    $rootScope.$alert("新增基线告警规则成功");
                                    Modal.hide($scope.addPage.modal.settings.id);
                                }, function () {
                                    Loading.hide();
                                });
                            }
                        }
                    }
                },
                action : {
                    init : function(isEdit,rule,baseline){
                        $scope.addPage.isEdit=isEdit;
                        $scope.addPage.plusOptionShow=false;
                        $scope.addPage.hitRulesPanelShow=false;
                        $scope.addPage.showBaselinePanel=!isEdit;
                        $scope.addPage.showBaselineChart=false;
                        $scope.addPage.canScanChart=isEdit;
                        $scope.addPage.data.mocId="";
                        Util.init($scope.addPage.temp,{
                            intervalNumList:$filter('loop')([],1,59,1),
                            metricList:[],
                            moTreeData:[],
                            workingTimeBeginList:$filter('loop')([],0,23,1),
                            workingTimeEndList:$filter('loop')([],1,24,1)
                        });

                        $scope.addPage.hit.selectMetricIdList=[];
                        $scope.addPage.hit.selectMoIdList = [];
                        $scope.addPage.hit.baseRuleList = [];
                        $scope.addPage.hit.selectBaseRuleList = [];
                        $scope.addPage.hit.selectMoList = [];
                        $scope.addPage.hit.selectIndicatorList = [];
                        $scope.addPage.hit.selectMetricList = [];

                        Util.init($scope.addPage.hit.search,{
                            moId : "",
                            indicatorId : "",
                            metricId : ""
                        });
                        Util.init($scope.addPage.hit.temp,{
                            moIdList:[],
                            indicatorIdList:[],
                            metricIdList:[]
                        });

                        $scope.addPage.baseline.temp.metricList=[];
                        Util.init($scope.addPage.baseline.search,{
                            displayName : "",
                            indicatorId : "",
                            metricId : ""
                        });

                        $scope.addPage.baseline.data = isEdit?baseline:{};

                        $timeout(function(){
                            Util.init($scope.addPage.data,{
                                id:"",
                                displayName:"",
                                active :true,
                                level:4,
                                occursDelay:3,
                                mocId:$scope.searchPage.mocList.length>0?$scope.searchPage.mocList[0].id:"",
                                intervalUnit : "minute",
                                workingDayList : [1,2,3,4,5,6,7],
                                workingTimeBegin:0,
                                notifyWayList : [],
                                notifierList : []
                            });
                            $timeout(function() {
                                if(isEdit){
                                    Util.init($scope.addPage.data,rule);
                                }else{
                                    $scope.addPage.data.workingTimeEnd=24;
                                    $scope.addPage.data.intervalNum=5;
                                }
                                $scope.addPage.baseline.settings.reload(true);
                            },200);
                        },100);

                    },
                    hitRules : function(){
                        Loading.show();
                        BaselineRuleClient.hitRules({mosId:$scope.addPage.hit.selectMoIdList,metricsId:$scope.addPage.hit.selectMetricIdList},{},function(data){
                            $scope.addPage.hit.baseRuleList=data;
                            $scope.addPage.action.buildHitSearch();
                            $scope.addPage.hit.search.moId="";
                            $scope.addPage.hit.search.indicatorId="";
                            $scope.addPage.hit.search.metricId="";
                            $scope.addPage.hit.settings.reload(true);
                            $scope.addPage.hitRulesPanelShow = true;
                            Loading.hide();
                        });
                    },
                    buildHitSearch : function(){
                        $scope.addPage.hit.temp.moIdList = [];
                        $scope.addPage.hit.temp.indicatorIdList = [];
                        $scope.addPage.hit.temp.metricIdList = [];

                        for (var i = 0; i < $scope.addPage.hit.baseRuleList.length; i++) {
                            var baseRule = $scope.addPage.hit.baseRuleList[i];
                            if (!Util.exist(baseRule.moId, $scope.addPage.hit.temp.moIdList)) {
                                $scope.addPage.hit.temp.moIdList.push(baseRule.moId);
                            }
                            if (!Util.exist(baseRule.indicatorId,$scope.addPage.hit.temp.indicatorIdList)) {
                                $scope.addPage.hit.temp.indicatorIdList.push(baseRule.indicatorId);
                            }
                            if (!Util.exist(baseRule.metricId, $scope.addPage.hit.temp.metricIdList)) {
                                $scope.addPage.hit.temp.metricIdList.push(baseRule.metricId);
                            }
                        }

                        $scope.addPage.hit.selectMoList = [];
                        $scope.addPage.hit.selectIndicatorList = [];
                        $scope.addPage.hit.selectMetricList = [];

                        for(var i=0;i<$scope.addPage.hit.temp.moIdList.length;i++){
                            $scope.addPage.hit.selectMoList.push(Util.findFromArray("id",$scope.addPage.hit.temp.moIdList[i],$scope.addPage.temp.moTreeData[0].children));
                        }
                        for(var i=0;i<$scope.addPage.hit.temp.indicatorIdList.length;i++){
                            $scope.addPage.hit.selectIndicatorList.push(Util.findFromArray("id",$scope.addPage.hit.temp.indicatorIdList[i],$scope.metric));
                        }

                        if ($scope.addPage.hit.search.indicatorId) {
                            $scope.addPage.hit.selectMetricList = [];
                            var indicator = Util.findFromArray("id",$scope.addPage.hit.search.indicatorId,$scope.addPage.hit.selectIndicatorList);
                            if(indicator) {
                                for (var i = 0; i < $scope.addPage.hit.temp.metricIdList.length; i++) {
                                    var metric = Util.findFromArray("id", $scope.addPage.hit.temp.metricIdList[i], indicator.children);
                                    if (metric) {
                                        $scope.addPage.hit.selectMetricList.push(metric);
                                    }
                                }
                            }
                        }
                    },
                    delHitRule : function(id){
                        Util.deleteFromArray("id",id,$scope.addPage.hit.baseRuleList);
                        Util.deleteFromArray("id",id,$scope.addPage.hit.selectBaseRuleList);
                        $scope.addPage.action.buildHitSearch();
                        $scope.addPage.hit.settings.reload(false);
                    },
                    plusOption : function(flag){
                        $scope.addPage.plusOptionShow=flag;
                    },
                    userTreeLeaf : function(node){
                        return node.isUser;
                    },
                    filterBaseRule : function(search){
                        $scope.addPage.hit.selectBaseRuleList = [];
                        for(var i=0;i< $scope.addPage.hit.baseRuleList.length;i++){
                            var baseRule = $scope.addPage.hit.baseRuleList[i];
                            if((!$scope.addPage.hit.search.moId || $scope.addPage.hit.search.moId==baseRule.moId)
                                && (!$scope.addPage.hit.search.indicatorId || $scope.addPage.hit.search.indicatorId==baseRule.indicatorId)
                                && (!$scope.addPage.hit.search.metricId || $scope.addPage.hit.search.metricId==baseRule.metricId)){
                                $scope.addPage.hit.selectBaseRuleList.push(baseRule);
                            }
                        }
                        return {
                            total:$scope.addPage.hit.selectBaseRuleList.length,
                            rows:$scope.addPage.hit.selectBaseRuleList.slice(search.offset,search.offset+search.limit)
                        };
                    },
                    showBaselinePanel : function(flag){
                        $scope.addPage.showBaselinePanel=flag;
                        $scope.addPage.showBaselineChart=false;
                    },
                    showBaselineChart : function(baselineId){
                        var baseline = $scope.addPage.baseline.data;
                        if(baselineId){
                            baseline=Util.findFromArray("id",baselineId,$scope.addPage.baseline.temp.baselineList);
                        }
                        var allData = $scope.addPage.action.buildChartData(
                            JSON.parse(baseline.valueJson),
                            baseline.type,
                            baseline.offsetP,
                            baseline.offsetN);
                        var chart = $('#baselineChartDiv').highcharts();
                        if (!chart) {
                            chart = $scope.addPage.action.initChart();
                        }
                        chart.series[0].setData(allData[0]);
                        chart.series[1].setData(allData[1]);
                        chart.series[2].setData(allData[2]);

                        $scope.addPage.showBaselineChart=true;
                    },
                    selectBaseline : function(baselineId){
                        $scope.addPage.data.baselineId = baselineId;
                        $scope.addPage.baseline.data = Util.findFromArray("id",baselineId,$scope.addPage.baseline.temp.baselineList);
                        $scope.addPage.canScanChart=true;
                        $scope.addPage.action.showBaselinePanel(false);
                    },
                    initChart : function(){
                        Highcharts.setOptions({
                            global: {
                                useUTC: false
                            }
                        });
                        $('#baselineChartDiv').highcharts('StockChart', {
                            exporting:{
                                // 是否允许导出
                                enabled:false
                            },
                            chart:{
                                type:'spline',
                                width:707,
                                height:290
                            },
                            rangeSelector : {
                                enabled:false
                            },
                            navigator : {
                                enabled:false
                            },
                            scrollbar : {
                                enabled:false
                            },
                            legend : {
                                enabled:true
                            },
                            xAxis:{
                                ordinal:false,
                                type:"datetime",
                                dateTimeLabelFormats : {
                                    second : "%H:%M",
                                    minute : "%H:%M",
                                    hour : "%H:%M",
                                    day : "%H:%M",
                                    week : "%H:%M",
                                    month : "%H:%M",
                                    year : "%H:%M"
                                },
                                min:- $scope.offset,
                                max:3600*24*1000-$scope.offset
                            },
                            yAxis : {
                                offset:20,
                                min:0
                            },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        enabled: true
                                    },
                                    dataGrouping:{
                                        enabled: false
                                    }
                                }
                            },
                            credits:{
                                enabled:false
                            },
                            series : [
                                {
                                    name: "正偏离",
                                    color: "#e4d354"
                                },
                                {
                                    name: "基线值",
                                    color: "#000000"
                                },
                                {
                                    name: "负偏离",
                                    color: "#FF9933"
                                }
                            ],
                            tooltip:{
                                valueDecimals: 2,
                                xDateFormat:"%H:%M",
                                valueSuffix:""
                            }
                        });
                        return $('#baselineChartDiv').highcharts();
                    },
                    buildChartData : function(data,type,pOffset,nOffset){
                        var p = [];
                        var base = [];
                        var n = [];

                        if(data.length==0 || Math.floor((data[0][0]+$scope.offset)%(1000*3600*24))>0){
                            p.push([-$scope.offset,null]);
                            base.push([-$scope.offset,null]);
                            n.push([-$scope.offset,null]);
                        }

                        for (var i = 0; i < data.length; i++) {
                            var v = data[i][1];
                            if(!v){
                                continue;
                            }
                            var time = Math.floor((data[i][0]+$scope.offset)%(1000*3600*24))-$scope.offset;
                            if(pOffset){
                                p.push([time, (type==1?v*(100+pOffset)/100:v + pOffset)]);
                            }
                            base.push([time, v]);
                            if(nOffset){
                                n.push([time, (type==1?v*(100-nOffset)/100:v - nOffset)]);
                            }
                        }

                        if(data.length==0 || Math.floor((data[data.length-1][0]+$scope.offset)%(1000*3600*24))<1000*3600*24){
                            p.push([1000*3600*24-$scope.offset,null]);
                            base.push([1000*3600*24-$scope.offset,null]);
                            n.push([1000*3600*24-$scope.offset,null]);
                        }

                        return [p,base,n];
                    }
                }
            };
            $scope.addPage.action.init();

            $scope.$watch("addPage.canSave", function (newVal, oldVal) {
                $scope.addPage.modal.settings.saveDisabled = !newVal;
            }, false);

            $scope.$watch("addPage.data.intervalUnit", function (newVal, oldVal) {
                if(newVal && newVal!=oldVal){
                    if(newVal=="minute"){
                        $scope.addPage.temp.intervalNumList = $filter('loop')([],1,59,1);
                        $timeout(function(){
                            $scope.addPage.data.intervalNum = 5;
                        },100);
                    }else{
                        $scope.addPage.temp.intervalNumList = $filter('loop')([],1,24,1);
                        $timeout(function(){
                            $scope.addPage.data.intervalNum = 1;
                        },100);
                    }
                }
            }, false);

            $scope.$watch("addPage.data.mocId", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    $scope.addPage.hit.selectMetricIdList=[];
                    $scope.addPage.hit.selectMoIdList = [];
                    $scope.addPage.hit.baseRuleList = [];
                    $scope.addPage.hit.selectBaseRuleList = [];
                    $scope.addPage.hit.selectMoList = [];
                    $scope.addPage.hit.selectIndicatorList = [];
                    $scope.addPage.hit.selectMetricList = [];
                    $scope.addPage.hit.settings.reload(true);
                    $scope.addPage.hitRulesPanelShow = false;
                    $scope.addPage.baseline.search.indicatorId="";
                    $scope.addPage.baseline.search.metricId="";
                    Util.delay("metricReady", function () {
                        $timeout(function(){
                            $scope.addPage.temp.metricList = Util.findAllFromArray("mocId", newVal, $scope.metric);
                        },100);
                    }, $scope);

                    Loading.show();
                    MoClient.query({mocId:newVal,orderBy:"displayName"},function(data){
                        var moc = Util.findFromArray("id",newVal,$scope.searchPage.mocList);
                        $scope.addPage.temp.moTreeData = [{id:-1,displayName:moc.displayName,children:data.rows}];
                        Loading.hide();
                    });
                    $scope.addPage.baseline.settings.reload(true);
                }
            }, false);


            $scope.$watch("addPage.hit.search.indicatorId", function (newVal, oldVal) {
                if (newVal && newVal!=oldVal) {
                    $scope.addPage.hit.search.metricId="";
                    $scope.addPage.hit.selectMetricList = [];
                    var indicator = Util.findFromArray("id",newVal,$scope.addPage.hit.selectIndicatorList);
                    for(var i=0;i<$scope.addPage.hit.temp.metricIdList.length;i++){
                        var metric = Util.findFromArray("id",$scope.addPage.hit.temp.metricIdList[i],indicator.children);
                        if(metric){
                            $scope.addPage.hit.selectMetricList.push(metric);
                        }
                    }
                }else if(!newVal){
                    $scope.addPage.hit.search.metricId="";
                    $scope.addPage.hit.selectMetricList = [];
                }
            }, false);

            $scope.$watch("addPage.data.workingTimeEnd", function (newVal, oldVal) {
                if (newVal && newVal!=oldVal) {
                    $scope.addPage.temp.workingTimeBeginList = $filter('loop')([],0,Number(newVal)-1,1);
                }
            }, false);

            $scope.$watch("addPage.data.workingTimeBegin", function (newVal, oldVal) {
                if (newVal && newVal!=oldVal) {
                    $scope.addPage.temp.workingTimeEndList = $filter('loop')([],Number(newVal)+1,24,1);
                }
            }, false);

            $scope.$watch("addPage.baseline.search.indicatorId", function (newVal, oldVal) {
                if (newVal && newVal!=oldVal) {
                    $scope.addPage.baseline.search.metricId="";
                    $scope.addPage.baseline.temp.metricList = [];
                    var indicator = Util.findFromArray("id",newVal,$scope.addPage.temp.metricList);
                    $scope.addPage.baseline.temp.metricList = indicator.children;
                }else if(!newVal){
                    $scope.addPage.baseline.search.metricId="";
                    $scope.addPage.baseline.temp.metricList = [];
                }
            }, false);

            $scope.$watch("[addPage.data.occursDelay,addPage.data.baselineId,addPage.hit.selectBaseRuleList.length,addPage.isEdit]", function (newVal, oldVal) {
                $scope.addPage.canSave = Number(newVal[0]) && newVal[1] && (newVal[3] || newVal[2]);
            },true);

            //end AddPage


        }]);
})(angular);

