(function (angular) {

    angular.module('alarm.baseline', ['resource.client'])
        .controller('baselineCtrl', ['$scope', '$rootScope', 'Util', '$timeout', 'Modal', 'Loading', '$routeParams', 'BaselineClient','LocationClient', function ($scope, $rootScope, Util, $timeout, Modal, Loading, $routeParams, BaselineClient,LocationClient) {

            LocationClient.query(function(data){
                $scope.locations = data;
                $scope.locationsForSearch =[{"id":-1,"name":" 未设置区域 "}].concat(data);
                $scope.locationsReady = true;
            });

            $scope.offset = 3600*8*1000;
            $scope.common = {
                action : {
                    showEditPage:function(){
                        if($scope.editPage.isEdit){
                            $scope.editPage.modal.settings.title = "编辑";
                        }else{
                            $scope.editPage.modal.settings.title = "新增";
                        }
                        Modal.show($scope.editPage.modal.settings.id);
                    }
                }
            };

            $scope.mocTree = {
                refreshTree : function(){
                    BaselineClient.tree(function (data) {
                        $scope.mocTree.data = data;
                    });
                }
            };
            $scope.metric = [];
            $scope.metricReady = false;

            BaselineClient.tree(function (data) {
                $scope.mocTree.data = data;
                $timeout(function () {
                    $scope.searchPage.data.mocpId = data[0].id;
                }, 100);
            });

            BaselineClient.metric({rule: "history_chart"}, function (data) {
                $scope.metric = data;
                $scope.metricReady = true;
            });

            //searchPage
            $scope.searchPage = {
                data: {
                    mocpId: "",
                    mocId: "",
                    indicatorId: "",
                    metricId: "",
                    displayName: ""
                },
                mocList: [],
                indicatorList: [],
                metricList: [],
                action: {
                   search: function(cancelSort){
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
                        $scope.searchPage.data.mocId = "";
                        $scope.searchPage.data.displayName = "";
                        $scope.searchPage.data.locId = "";
                        $scope.searchPage.data.indicatorId = "";
                        $scope.searchPage.data.metricId = "";
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
                    $scope.editPage.isEdit = false;
                    $scope.editPage.action.init();
                    $scope.common.action.showEditPage();
                },
                edit :function(baselineId){
                    $scope.editPage.isEdit = true;
                    $scope.editPage.action.init(Util.findFromArray("id",baselineId,$scope.listPage.data));
                    $scope.common.action.showEditPage();
                },
                batchDelete :function(){
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择要删除的基线");
                    }else{
                        $rootScope.$confirm("确定要删除么？",function(){
                            Loading.show();
                            BaselineClient.batchRemove({ids:$scope.listPage.checkedList},{},function(){
                                Loading.hide();
                                $rootScope.$alert("删除成功");
                                $scope.searchPage.action.search();
                                $scope.mocTree.refreshTree(); //刷新统计数据
                            },function(){
                                Loading.hide();
                                $scope.searchPage.action.search();
                            });
                        }," 删 除 ");
                    }
                },
                del :function(baselineId){
                    $rootScope.$confirm("确定要删除么？",function(){
                        Loading.show();
                        BaselineClient.remove({id:baselineId},{},function(){
                            Loading.hide();
                            $rootScope.$alert("删除成功");
                            $scope.searchPage.action.search();
                            $scope.mocTree.refreshTree(); //刷新统计数据
                        },function(){
                            Loading.hide();
                            $scope.searchPage.action.search();
                        });
                    }," 删 除 ");
                }
            };

            $scope.listPage.settings = {
                reload : null,
                getData: function (search, fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    BaselineClient.query($scope.searchPage.data, function (data) {
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    });
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
                        sTitle: "基线名称",
                        mData:"displayName",
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
                        sTitle: "所属区域",
                        mData:"locationDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
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
                        sTitle:"操作",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                            if(disabledOp){
                                return '<i class="fa fa-pencil" disabled title="编辑"> </i>' +
                                    '<i class="fa fa-trash-o" disabled title="删除"></i>';
                            }else{
                                return '<i class="fa fa-pencil" title="编辑" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' +
                                    '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.del(\''+mData+'\')"></i>';
                            }
                        }
                    }
                ] , //定义列的形式,mRender可返回html
                columnDefs : [
                    { bSortable: false, aTargets: [ 0,11 ] },  //不可排序
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

            //editPage
            $scope.editPage = {
                isEdit : false,
                selectRulePanel : true,
                selectDataDate : false,
                showChart : false,
                canSave : false,
                canLoadChart:false,
                data:{},
                modal : {
                    settings : {
                        id : "baseline_edit_modal_div",
                        title:"新增",
                        saveBtnText:"保存",
                        saveDisabled:true,
                        save : function(){
                            Loading.show();
                            if($scope.editPage.isEdit){
                                BaselineClient.update({id:$scope.editPage.data.id},$scope.editPage.data,function(data){
                                    $scope.searchPage.action.search(true);
                                    $scope.mocTree.refreshTree(); //刷新统计数据
                                    Loading.hide();
                                    $rootScope.$alert("修改基线成功");
                                    Modal.hide($scope.editPage.modal.settings.id);
                                },function(error){
                                    Loading.hide();
                                });
                            }else{
                                BaselineClient.save({},$scope.editPage.data,function(data){
                                    $scope.searchPage.action.search(true);
                                    $scope.mocTree.refreshTree(); //刷新统计数据
                                    Loading.hide();
                                    $rootScope.$alert("新增基线成功");
                                    Modal.hide($scope.editPage.modal.settings.id);
                                },function(error){
                                    Loading.hide();
                                });
                            }
                        }
                    }
                },
                action : {
                    init : function(baseline){
                        $scope.editPage.selectRulePanel = !$scope.editPage.isEdit;
                        $scope.editPage.selectDataDate = false,
                        $scope.editPage.showChart = $scope.editPage.isEdit;
                        $scope.editPage.canSave = $scope.editPage.isEdit;
                        $scope.editPage.search.selectRuleId="";
                        $scope.editPage.action.initSearchCondition();
                        $scope.editPage.action.searchRule(true);
                        if(baseline){
                            $scope.editPage.action.init();
                            Util.init($scope.editPage.data,baseline);
                            $scope.editPage.action.showChart();
                        }else{
                            $scope.editPage.data = {
                                locId:$rootScope.loginUser.locId,
                                type:0
                            }
                        }
                    },
                    initSearchCondition : function(){
                        Util.init($scope.editPage.search.condition,{
                            pmocId:$scope.searchPage.data.mocpId,
                            displayName:"",
                            mocId:"",
                            indicatorId:"",
                            metricId:""
                        });
                    },
                    searchRule : function(cancelSort){
                        $scope.editPage.search.settings.reload(cancelSort);
                    },
                    selectRule : function(ruleId){
                        var rule = Util.findFromArray("id", ruleId, $scope.editPage.search.data);
                        $scope.editPage.data.mocDisplayName=rule.moc;
                        $scope.editPage.data.indicatorDisplayName=rule.indicator;
                        $scope.editPage.data.metricDisplayName=rule.metric;
                        $scope.editPage.data.metricId=rule.metricId;
                        $scope.editPage.search.selectRuleId=ruleId;
                        $scope.editPage.selectRulePanel=false;
                        $scope.editPage.selectDataDate = true;
                    },
                    changeData : function(){
                        $scope.editPage.selectRulePanel=true;
                        $scope.editPage.showChart=false;
                        $scope.editPage.canSave = false;
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
                                width:735,
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
                    },
                    loadChart : function (data){
                        var allData = $scope.editPage.action.buildChartData(data,$scope.editPage.data.type,$scope.editPage.data.offsetP,$scope.editPage.data.offsetN);
                        var chart = $('#baselineChartDiv').highcharts();
                        if (!chart) {
                            chart = $scope.editPage.action.initChart();
                        }
                        chart.series[0].setData(allData[0]);
                        chart.series[1].setData(allData[1]);
                        chart.series[2].setData(allData[2]);
                        $scope.editPage.showChart = true;
                        return allData;
                    },
                    showChart : function(){
                        if(!Util.notNull($scope.editPage.data.valueDateStr)){
                            $rootScope.$alert("请选择数据日期");
                            return;
                        }
                        var p = Number($scope.editPage.data.offsetP);
                        var n = Number($scope.editPage.data.offsetN);

                        if(!Util.notNull($scope.editPage.data.offsetP)){
                            p = NaN;
                        }

                        if(!Util.notNull($scope.editPage.data.offsetN)){
                            n = NaN;
                        }
                        $scope.editPage.data.offsetP = p?p:"";
                        $scope.editPage.data.offsetN = n?n:"";

                        if(!isNaN(p) && p<=0 || !isNaN(n) && n<=0){
                            $rootScope.$alert("偏离值应为正数");
                            return;
                        }
                        if(isNaN(p) && isNaN(n)){
                            $rootScope.$alert("请填写正偏离值或负偏离值");
                            return;
                        }

                        if(!$scope.editPage.search.selectRuleId){
                            $scope.editPage.action.loadChart(JSON.parse($scope.editPage.data.valueJson));
                            $timeout(function(){
                                $scope.editPage.canSave = true;
                            },100);
                        }else {
                            var begin = Date.parse($scope.editPage.data.valueDateStr)-$scope.offset;
                            var end = begin + 3600 * 24 * 1000;
                            Loading.show();
                            BaselineClient.getChartData({id: $scope.editPage.search.selectRuleId, min: begin, max: end}, function (data) {
                                var allData = $scope.editPage.action.loadChart(data);
                                Loading.hide();
                                $scope.editPage.data.valueJson = JSON.stringify(allData[1]);
                                if(allData[1].length>2){
                                    $scope.editPage.canSave = true;
                                }
                            });
                        }
                    }
                },
                search :{
                    condition : {},
                    data : [],
                    selectRuleId :"",
                    indicatorList : [],
                    metricList : [],
                    settings:{
                        pageSize:5,
                        reload : null,
                        getData: function (search, fnCallback) {
                            $scope.editPage.search.condition.limit = search.limit;
                            $scope.editPage.search.condition.offset = search.offset;
                            $scope.editPage.search.condition.orderBy = search.orderBy;
                            $scope.editPage.search.condition.orderByType = search.orderByType;
                            $scope.editPage.search.condition.pmocId=$scope.searchPage.data.mocpId;
                            $scope.editPage.search.condition.needEnum=false;
                            Loading.show();
                            BaselineClient.historyRule($scope.editPage.search.condition, function (data) {
                                $scope.editPage.search.data = data.rows;
                                fnCallback(data);
                                Loading.hide();
                            });
                        }, //getData应指定获取数据的函数
                        columns : [
                            {
                                sTitle: "",
                                mData:"id",
                                mRender:function(mData,type,full) {
                                    return '<input type="radio" name="selectRuleId" ng-click="editPage.action.selectRule('+mData+')">';
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
                                sTitle: "资源实例",
                                mData:"moName",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "资源类型",
                                mData:"moc",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "资源指标组",
                                mData:"indicator",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "资源指标",
                                mData:"metric",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            }
                        ] , //定义列的形式,mRender可返回html
                        columnDefs : [
                            { bSortable: false, aTargets: [ 0 ] },  //不可排序
                            { sWidth: "38px", aTargets: [ 0 ] }
                        ], //定义列的约束
                        defaultOrderBy : []
                    }
                }
            };

            $scope.$watch("editPage.search.condition.mocId", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    Util.delay("metricReady", function () {
                        $timeout(function () {
                            $scope.editPage.search.condition.metricId = "";
                            $scope.editPage.search.condition.indicatorId = "";
                            $scope.editPage.search.indicatorList = Util.findAllFromArray("mocId", newVal, $scope.metric);
                            $scope.editPage.search.metricList = [];
                        }, 100);
                    }, $scope);
                }else{
                    $timeout(function () {
                        $scope.editPage.search.condition.metricId = "";
                        $scope.editPage.search.condition.indicatorId = "";
                        $scope.editPage.search.indicatorList = [];
                        $scope.editPage.search.metricList = [];
                    }, 100);
                }
            }, false);

            $scope.$watch("editPage.search.condition.indicatorId", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    Util.delay("metricReady", function () {
                        $timeout(function () {
                            $scope.editPage.search.condition.metricId = "";
                            $scope.editPage.search.metricList = Util.findFromArray("id", newVal, $scope.metric)["children"];
                        }, 100);
                    }, $scope);
                }else{
                    $timeout(function () {
                        $scope.editPage.search.condition.metricId = "";
                        $scope.editPage.search.metricList = [];
                    }, 100);
                }
            }, false);

            $scope.$watch("editPage.canSave", function (newVal, oldVal) {
                $scope.editPage.modal.settings.saveDisabled = !newVal;
            }, false);

            $scope.$watch("editPage.data.valueDateStr", function (newVal, oldVal) {
                if(newVal!=oldVal){
                    $scope.editPage.canSave = false;
                }
            }, false);
            $scope.$watch("editPage.data.type", function (newVal, oldVal) {
                if(newVal!=oldVal){
                    $scope.editPage.canSave = false;
                }
            }, false);
            $scope.$watch("editPage.data.offsetP", function (newVal, oldVal) {
                if(newVal!=oldVal){
                    $scope.editPage.canSave = false;
                }
            }, false);
            $scope.$watch("editPage.data.offsetN", function (newVal, oldVal) {
                if(newVal!=oldVal){
                    $scope.editPage.canSave = false;
                }
            }, false);

            $scope.$watch("[editPage.data.valueDateStr,editPage.data.offsetP,editPage.data.offsetN]", function (newVal, oldVal) {
                $scope.editPage.canLoadChart = (Number(newVal[1]) || Number(newVal[2])) && newVal[0];
            },true);


        }]);
})(angular);

