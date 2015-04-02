(function(angular){
    var system = angular.module('history-module',['ngResource']);

    system.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/historySetting',{
            templateUrl:'views/history/history.html',
            controller:'historyRuleController'});
        $routeProvider.when('/historyTrend',{
            templateUrl:'views/history/historyTrend.html',
            controller:'historyTrendController'});
        /*$routeProvider.when('/historyReport',{
            templateUrl:'views/history/historyReport.html',
            controller:'historyReportController'});*/
    }]);

    system.run(['$rootScope','ResourceService','Const',function($rootScope,ResourceService,Const) {
        //公共部分
        $rootScope.history = {
            const : Const,
            cache : [],
            ready : false
        };

        ResourceService.getAllMoc(function(data){
            $rootScope.history.mocTree = [];
            for(var i in data){
                if(data[i].name && data[i].name!='environment' && data[i].name!='link'){
                    $rootScope.history.mocTree.push(data[i]);
                }
            }
            $rootScope.history.ready = true;
        });
        $rootScope.rooms=[];
        ResourceService.rooms({locId:-1},function(rows){
            $rootScope.rooms=rows;
        });
    }]);

    system.service('Const',function(){
        this.intervals=[{"label":"30秒","value":30},{"label":"5分钟","value":300},{"label":"10分钟","value":600},{"label":"30分钟","value":1800},{"label":"1小时","value":3600},{"label":"2小时","value":7200},{"label":"1天","value":86400}];
        this.json = {
            moType : {
                description:"displayName", //数据中的字段名，其值显示为节点名
                children:"children", //数据中的字段名，标示子节点集合
                value:"id" //数据中的字段名，其值将绑定到ourData
            },
            metric : {
                description:"displayName", //数据中的字段名，其值显示为节点名
                children:"children", //数据中的字段名，标示子节点集合
                value:"id" //数据中的字段名，其值将绑定到ourData
            },
            mos : {
                description:"displayName", //数据中的字段名，其值显示为节点名
                children:"indexValues", //数据中的字段名，标示子节点集合
                value:"id" //数据中的字段名，其值将绑定到ourData
            }
        };
    });

    var path='/dmonitor-webapi';
    system.factory('HistoryRuleService',['$resource',function(resource){
        return resource(path+'/history/rules/:id',{},{
            getHistoryRule:{method:'GET',isArray:false},
            add:{method:'POST',url:path+"/history/rules",isArray:false},
            remove:{method:"DELETE",url:path+"/history/rules",isArray:false},
            update:{method:'PUT',isArray:false},
            active:{method:'PUT',url:path+'/history/rules/active',isArray:false},
            getChart:{method:'GET',url:path+"/history/rules/chart/:id",isArray:true},
            getHistoryPerformance:{method:'GET',url:path+'/history/performance/query',isArray:false},
            export:{method:'GET',url:path+'/history/performance/export',isArray:false},
            list:{method:'GET',url:path+'/history/list',isArray:true},
            getPrepareRules:{method:'GET',url:path+'/history/rules/prepare',isArray:true}

        });
    }]);

    system.factory('ResourceService',['$resource',function(resource){
        return resource("",{},{
            getAllMoc:{method:'GET',url:path+"/resources/moc",isArray:true},
            getMetricByMocId:{method:'GET',url:path+'/resources/metric/select',isArray:true},
            getMoByMocId:{method:'GET',url:path+'/resources/mo',isArray:false},
            getIndexMetricValues:{method:'GET',url:path+'/resources/metric/index/values',isArray:false},
            getMo:{method:'GET',url:path+'/resources/mo/:moId',isArray:false},
            getMoc:{method:'GET',url:path+'/resources/moc/:mocId',isArray:false},
            getMocCount:{method:'GET',url:path+'/history/mocCount',isArray:true},
            rooms:{method:"GET",url:path+"/operation/jf",isArray:true}
        });
    }]);

    //历史记录管理
    system.controller('historyRuleController',['$scope','$rootScope','Tools','Util','HistoryRuleService','ResourceService','Const','Loading','$timeout','$location','LocationClient',function($scope,$rootScope,Tools,Util,HistoryRuleService,ResourceService,Const,Loading,$timeout,$location,LocationClient){

        LocationClient.queryJf(function(data){
            $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
        });

        $scope.addPage = { };
        $scope.addPage.data = { };
        $scope.addPage.datas = { };
        $scope.addPage.hidden = { };
        $scope.historySetting = false;
        //添加
        $scope.historyAddDialog=Tools.dialog({
            id:"historyAddDialog",
            title:"新增",
            hiddenButton:true,
            save:function(){
                //$scope.searchPage={};
                Loading.show();
                var addlist = [];
                var x = 0;
                $.each($scope.addPage.data.allData,function(i,val){
                    if(val.checked){
                        val.active = $scope.addPage.data.active;
                        val.sampleInterval = $scope.addPage.data.sampleInterval;
                        addlist[x] = val;
                        x++;
                        return ;
                    }
                });
                HistoryRuleService.add(addlist,function(data){
                if(data.result=="success"){
                    $scope.historyAddDialog.hide();
                    $scope.listPage.settings.reload(true);
                    $scope.listPage.action.initMocTree();
                }
                },function(error){
                 $scope.historyAddDialog.hide();
                    $scope.listPage.settings.reload(true);
                });
                $scope.historyAddDialog.hide();
            }
        });

        //添加级联
        $scope.$watch("addPage.data.mocId",function(newVal, oldVal){
            $scope.addPage.data.metricsId = null;
            $scope.addPage.data.mosId = null;
            $scope.addPage.data.moIds = [];
            if(Util.notNull(newVal)){
                ResourceService.getMetricByMocId({rule:'history',mocId:newVal},{},function(data){
                    $scope.addPage.datas.metricTree = data;
                });
                ResourceService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    var mocName="";
                    $.each($rootScope.history.mocTree,function(a,v){
                        $.each(v.children,function(b,v2){
                              if(v2.id==newVal){
                                  mocName = v2.displayName
                                  return ;
                              }
                        });
                    });
                    $scope.addPage.datas.moTree = [{id:-1,displayName:mocName,children:data.rows}];
                });
            }
        },false);

        $scope.$watch("addPage.data.checkedList",function(newVal, oldVal){
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.addPage.hidden.checkedList = 1;
            }else{
                $scope.addPage.hidden.checkedList = "";
            }
        },true);

        $scope.$watch("addPage.data.metricsId",function(newVal, oldVal){
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.addPage.hidden.metric = 1;
            }else{
                $scope.addPage.hidden.metric = "";
            }
        },true);

        $scope.$watch("addPage.data.mosId",function(newVal, oldVal){
            $scope.addPage.datas.molist = [];
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.addPage.hidden.mo = 1;
                //填充搜索框中的mos
                var zTree2 =angular.element.fn.zTree.getZTreeObj("moTree");
                if(!Util.notNull(zTree2))
                    return;
                var checknodes2 = zTree2.getCheckedNodes(true);
                var k = 0;
                $.each(checknodes2,function(i,checkVal){
                    if(checkVal.level==1){
                        $scope.addPage.datas.molist[k] = checkVal.data;
                        k++;
                    }
                });
            }else{
                $scope.addPage.hidden.mo = "";
            }
        },true);

        var buildIndicatorList = function(){
            var x = 0;
            $scope.addPage.data.indicatorlistId="";
            $scope.addPage.datas.indicatorlist = [];
            $scope.addPage.datas.metriclist = [];
            if($scope.addPage.data.allData != null){
                $.each($scope.addPage.data.allData,function(i,v1){
                    //判断是否存在相同指标
                    var flag = false;
                    $.each($scope.addPage.datas.indicatorlist,function(j,vv){
                        if(v1.indicatorId==vv.id){
                           flag = true;
                            return;
                        }
                    });
                    if(!flag){
                        $scope.addPage.datas.indicatorlist[x] = {id:v1.indicatorId,displayName:v1.indicatorName};
                        x++;
                    }
                });
            }
        }

        $scope.$watch("addPage.data.indicatorlistId",function(newVal, oldVal){
            $scope.addPage.data.metriclistId="";
            $scope.addPage.datas.metriclist = [];
            if(Util.notNull(newVal)){
                var x = 0;
                if($scope.addPage.data.allData != null){
                    $.each($scope.addPage.data.allData,function(i,v1){
                        if(newVal==v1.indicatorId){
                            //判断是否存在相同指标
                            var flag = false;
                            $.each($scope.addPage.datas.metriclist,function(j,vv){
                                if(v1.metricId==vv.id){
                                    flag = true;
                                    return;
                                }
                            });
                            if(!flag){
                                $scope.addPage.datas.metriclist[x] = {id:v1.metricId,displayName:v1.metricName};
                                x++;
                            }
                        }
                    });
                }
            }
        },false);

        $scope.listPreparePage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                remove:function(id){
                    $.each($scope.addPage.data.allData,function(i,v){
                        if(v.id==id){
                            $scope.addPage.data.allData[i].checked=false;
                            return;
                        }
                    });
                    $scope.addPage.hidden.checkedList = null;
                    $.each($scope.addPage.data.allData,function(i,v){
                        if(v.checked){
                            $scope.addPage.hidden.checkedList = 1;
                            return;
                        }
                    });
                    $scope.listPreparePage.settings.reload(true);
                },
                getData:function(){
                    jQuery("#aaa").show();
                    var zTree1 =angular.element.fn.zTree.getZTreeObj("metricTree");
                    var zTree2 =angular.element.fn.zTree.getZTreeObj("moTree");
                    var j = 0;
                    var metricsId = [];
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
                    }
                    Loading.show();
                    HistoryRuleService.getPrepareRules({mosId:mosId,metricsId:metricsId},{},function(data){
                        $scope.addPage.data.allData = data;
                        $scope.addPage.data.checkedList = new Array();
                        $.each(data,function(i,v){
                            $scope.addPage.data.checkedList.push(v.id);
                            $scope.addPage.hidden.checkedList = 1;
                        });
                        $scope.listPreparePage.settings.reload(true);
                        buildIndicatorList();
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                },
                search:function(search,fnCallback){
                    if($scope.addPage.data.allData != null){
                        var moId = $scope.addPage.data.molistId;
                        var indicatorId = $scope.addPage.data.indicatorlistId;
                        var metricId = $scope.addPage.data.metriclistId;
                        var tiaojian = [];
                        $.each($scope.addPage.data.allData,function(i,v) {
                            if (v.checked) {
                                if (moId != null && moId != "" && moId != v.moId){
                                    return;
                                }
                                if (indicatorId != null && indicatorId != "" && indicatorId != v.indicatorId){
                                    return;
                                }
                                if (metricId != null && metricId != "" && metricId != v.metricId){
                                    return;
                                }
                                tiaojian.push(v);
                            }
                        });
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
            }
        };

        $scope.listPreparePage.settings = {
            reload : null,
            getData:$scope.listPreparePage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "规则名称",
                    mData:"displayName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"moName"
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
                    sTitle: "索引指标值",
                    mData:"metricsArgs",
                    mRender:function(mData,type,full) {
                        return "<label class='td-text' title='"+mData+"' style='width: 100px;'>"+mData+"</label>";
                    }
                },
                {
                    //sTitle: "<div class='checkbox'><label><input id='chk' ng-change='listPreparePage.action.tchange()' type='checkbox' ng-model='listPreparePage.checkAllRow'><i></i></label></div>",
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i title="删除" class="fa fa-trash-o" ng-click="listPreparePage.action.remove(\''+mData+'\')"></i>';
                        /*if(full.checked){
                            return '<div class="checkbox"><label><input id="chk'+mData+'" checked="checked" ng-change="listPreparePage.action.change(\''+mData+'\')" type="checkbox" checklist-model="listPreparePage.checkedList"  checklist-value=\''+mData+'\' /><i></i></label></div>';
                        }else{
                            return '<div class="checkbox"><label><input id="chk'+mData+'" ng-change="listPreparePage.action.change(\''+mData+'\')" type="checkbox" checklist-model="listPreparePage.checkedList"  checklist-value=\''+mData+'\' /><i></i></label></div>';
                        }*/
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,1,2,3,4,5]},//列不可排序
                { sWidth: "50px", aTargets: [5]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

        //编辑
        $scope.historyEditDialog = Tools.dialog({
            id:"historyEditDialog",
            title:"编辑",
            model:{},
            initData:function(){},
            hiddenButton:true,
            save:function(){
                //$scope.searchPage={};
                var model = {};
                model.id = $scope.editPage.data.id;
                model.active = $scope.editPage.data.active;
                model.displayName = $scope.editPage.data.displayName;
                model.sampleInterval = $scope.editPage.data.sampleInterval;
                Loading.show();
                HistoryRuleService.update({id:$scope.editPage.data.id},model,function(data){
                    if(data.result=="success"){
                        $scope.editPage.data = {};
                        $scope.historyEditDialog.hide();
                        $scope.listPage.settings.reload(true);

                    }
                },function(error){
                    $scope.historyEditDialog.hide();
                    $scope.listPage.settings.reload(true);
                });
            }
        });

        $scope.editPage = {};
        $scope.editPage.data = {};

        //时序图
        $scope.historyChartDialog = Tools.dialog({
            id:"historyChartDialog",
            title:"采集规则趋势图",
            model:{},
            hiddenButton:true,
            initData:function(){
            }
        });

        //操作按钮
        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                clickSearchBtn : function(){
                    $scope.historySetting = true;
                    $scope.listPage.settings.reload(true);
                },
                add: function () {
                    $scope.addPage.datas.moTree = [];
                    $scope.addPage.datas.metricTree=[];
                    $scope.addPage.data.checkedList=null;
                    $scope.addPage.data.mocId="";
                    $scope.addPage.datas.mocs = Util.findFromArray(Const.json.moType.value,$scope.searchPage.pmocId,$rootScope.history.mocTree)[Const.json.moType.children];
                    $timeout(function(){
                        $scope.addPage.data.mocId =$scope.addPage.datas.mocs.length>0?$scope.addPage.datas.mocs[0].id:null;
                    },300);
                    $scope.addPage.data.displayName = "";
                    $scope.addPage.data.active = true;
                    $scope.addPage.data.sampleInterval=300;
                    $scope.addPage.data.metrisId=[];
                    $scope.addPage.data.mosId=[]

                    var zTree1 =angular.element.fn.zTree.getZTreeObj("metricTree");
                    var zTree2 =angular.element.fn.zTree.getZTreeObj("moTree");
                    if(zTree1!=null){
                        zTree1.destroy();
                    }
                    if(zTree2!=null){
                        zTree2.destroy();
                    }
                    $scope.addPage.data.allData = [];
                    $scope.listPreparePage.settings.reload(true);
                    jQuery("#aaa").hide();
                    $scope.historyAddDialog.show();
                },
                edit: function (id) {
                    for(var i=0;i<$scope.listPage.data.length;i++){
                           if(id == $scope.listPage.data[i].id){
                               $scope.editPage.data = angular.copy($scope.listPage.data[i]);
                               if($scope.editPage.data.metricsArgs != null){
                                   ResourceService.getIndexMetricValues({mocName: $scope.editPage.data.mocName,indicatorName: $scope.editPage.data.indicatorName},function(data){
                                       var dd = [];
                                       if(data.values != null){
                                           for(var i=0;i<data.values.length;i++){
                                               dd[i] = {k:data.values[i],v:data.values[i]};
                                           }
                                       }
                                       if(Util.notNull(data.index))
                                       $scope.editPage.metricsArgs = (data.index.displayName+"="+$scope.editPage.data.metricsArgs);
                                   });
                               }else{
                                    $scope.editPage.metricsArgs = "";
                               }
                               break;
                           }
                    }
                    $scope.historyEditDialog.show();
                },
                remove: function (id) {
                    $rootScope.$confirm("确定要删除么？",function() {
                        Loading.show();
                        HistoryRuleService.remove({ids:[id]},{},function(data){
                            if (data.result == "success") {
                                $scope.listPage.settings.reload(true);
                                $scope.listPage.action.initMocTree();
                            }
                            Loading.hide();
                        }, function (error) {
                            Loading.hide();
                        });
                    }," 删 除 ");
                },
                removes: function () {
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择规则");
                    }else{
                        $rootScope.$confirm("确定要删除么？",function(){
                            Loading.show();
                            HistoryRuleService.remove({ids:$scope.listPage.checkedList},{},function(data){
                                if (data.result == "success") {
                                    $scope.listPage.settings.reload(true);
                                    $scope.listPage.action.initMocTree();
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
                        HistoryRuleService.active({ids:$scope.listPage.checkedList,active:flag},{},function(data){
                            $scope.listPage.settings.reload(true);
                        },function(error){
                            Loading.hide();
                        });
                    }
                },
                active: function (id,flag) {
                    Loading.show();
                    HistoryRuleService.active({ids:[id],active:flag},{},function(data){
                        if(data.result=="success"){
                            $scope.listPage.settings.reload(true);
                        }
                    },function(error){
                        Loading.hide();
                    });
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.limit = search.limit;
                    $scope.searchPage.offset = search.offset;
                    $scope.searchPage.orderBy = search.orderBy;
                    $scope.searchPage.orderByType  = search.orderByType;
                    $scope.searchPage.moId = "";
                    var moId=$location.$$search.moId;
                    if (moId && !$scope.historySetting){
                        $scope.searchPage.moId = moId;
                        $scope.searchPage.mocId = "";
                        $scope.searchPage.pmocId = "";
                        $(".search-head").show();
                        if($location.$$search.type && $location.$$search.type==1){
                            Loading.show();
                            ResourceService.getMo({moId:moId},{},function(data){
                                $timeout(function(){
                                $scope.searchPage.pmocId = "";
                                $scope.searchPage.mocId = "";
                                $scope.searchPage.jfId = data.mo.jfId;
                                $scope.$watch("rooms",function(n){
                                    if(n && n.length>0){
                                        $timeout(function(){
                                            jQuery("#jfId option[value='"+(data.mo.jfId==null?"":data.mo.jfId)+"']").attr("selected","selected");
                                        },100);
                                    }
                                },true);

                                $timeout(function(){
                                    var treeObj = angular.element.fn.zTree.getZTreeObj("seachmocTree");
                                    var nodes=treeObj.getNodes();
                                    if(nodes.length>0){
                                        for(var i=0;i<nodes.length;i++){
                                            if(nodes[i].id==data.mo.mocpId){
                                                treeObj.selectNode(nodes[i]);
                                                $scope.searchPage.pmocId = "";
                                                $scope.searchPage.mocId = "";
                                                $scope.searchPage.jfId = data.mo.jfId;
                                                break;
                                            }
                                        }
                                    }
                                },1000);

                                },100);
                            });
                            $scope.searchPage.jf=$location.$$search.type;

                            HistoryRuleService.getHistoryRule($scope.searchPage,function(data){
                                $scope.listPage.data =data.rows;
                                fnCallback(data);
                                $scope.listPage.checkedList = [];
                                $scope.listPage.checkAllRow = false;
                                Loading.hide();
                            },function(error){
                                Loading.hide();
                            });
                        }else{
                            Loading.show();
                            $scope.searchPage.moId = moId;
                            ResourceService.getMo({moId:moId},{},function(data){
                                $timeout(function(){


                                $scope.searchPage.pmocId = data.mo.mocpId;
                                $scope.searchPage.mocId = data.mo.mocId;
                                $scope.searchPage.moName = data.mo.displayName;
                                $timeout(function(){
                                    var treeObj = angular.element.fn.zTree.getZTreeObj("seachmocTree");
                                    var nodes=treeObj.getNodes();
                                    if(nodes.length>0){
                                        for(var i=0;i<nodes.length;i++){
                                            if(nodes[i].id==data.mo.mocpId){
                                                treeObj.selectNode(nodes[i]);
                                                $scope.searchPage.pmocId = data.mo.mocpId;
                                                $scope.searchPage.moName = data.mo.displayName;
                                                $scope.searchPage.mocId = "";
                                                $timeout(function(){
                                                    $scope.searchPage.mocId = data.mo.mocId;
                                                },200);
                                                break;
                                            }
                                        }
                                    }
                                },500);

                                HistoryRuleService.getHistoryRule($scope.searchPage,function(data){
                                    $scope.listPage.data =data.rows;
                                    fnCallback(data);
                                    $scope.listPage.checkedList = [];
                                    $scope.listPage.checkAllRow = false;
                                    Loading.hide();
                                });

                                },200);
                            });
                        }
                    }else{
                        Loading.show();
                        $timeout(function () {
                            if($scope.searchPage.pmocId==""){
                                $scope.searchPage.pmocId=1;
                            }
                            HistoryRuleService.getHistoryRule($scope.searchPage,function(data){
                                $scope.listPage.data =data.rows;
                                fnCallback(data);
                                $scope.listPage.checkedList = [];
                                $scope.listPage.checkAllRow = false;
                                Loading.hide();
                            },function(error){
                                Loading.hide();
                            });
                        }, 1000);
                    }
                },
                chart:function(id){
                    for(var i=0;i<$scope.listPage.data.length;i++){
                        if(id == $scope.listPage.data[i].id){
                            $scope.chartRuleDisplayName = $scope.listPage.data[i].displayName;
                            $scope.chartmocp = $scope.listPage.data[i].mocp;
                            $scope.chartmoc = $scope.listPage.data[i].moc;
                            $scope.chartindicator = $scope.listPage.data[i].indicator;
                            $scope.chartmetric = $scope.listPage.data[i].metric;
                            $scope.chartargs = $scope.listPage.data[i].metricsArgs;
                            $scope.unit = $scope.listPage.data[i].unit;
                            break;
                        }
                    }
                    $scope.chartId = id;
                    var d = new Date();
                    var max = d.getTime();// + (8*60*60*1000);
                    d.setDate(d.getDate()-1);
                    var min = d.getTime();// + (8*60*60*1000);
                    $.getJSON('/dmonitor-webapi/history/rules/chart/?id='+$scope.chartId+"&min="+ Math.round(min)+"&max="+Math.round(max),function(data){
                        var date = new Date();
                        var navigator_max = date.getTime();
                        date.setFullYear(date.getFullYear()-1);
                        var navigator_min = date.getTime();
                        Highcharts.setOptions({
                            lang:{
                                rangeSelectorFrom:'从',
                                rangeSelectorTo:'到',
                                rangeSelectorZoom:'放大/缩小',
                                printChart: '打印',
                                downloadPNG: '导出为PNG格式',
                                downloadJPEG: '导出为JPEG格式',
                                downloadPDF: '导出为PDF格式',
                                downloadSVG: '导出为SVG格式',
                                contextButtonTitle: '导出图表'
                            },
                            global: {
                                useUTC: false
                            }
                        });
                        $('#container').highcharts('StockChart', {
                            exporting:{
                                // 是否允许导出
                                enabled:false
                            },
                            chart:{
                                type:'spline'
                            },
                            rangeSelector : {
                                allButtonsEnabled:true,
                                beyondExtremes:true,
                                inputEnabled: true,
                                inputBoxWidth:150,
                                inputDateFormat:'%Y-%m-%d %H:%M:%S',
                                inputEditDateFormat:'%Y-%m-%d %H:%M:%S',
                                buttons:[{
                                    type: 'day',
                                    count: 1,
                                    text: '1天'
                                },{
                                    type: 'week',
                                    count: 1,
                                    text: '1周'
                                },{
                                    type: 'month',
                                    count: 1,
                                    text: '1月'
                                },{
                                    type: 'year',
                                    count: 1,
                                    text: '1年'
                                }],
                                selected: 0
                            },
                           navigator : {
                                adaptToUpdatedData: false,
                                series : {
                                    data: [[navigator_min,0],[navigator_max,0]]
                                },
                               xAxis:{
                                   type : 'datetime',
                                   dateTimeLabelFormats : {
                                       second : '%Y<br/>%m-%d<br/>%H:%M:%S',
                                       minute : '%Y<br/>%m-%d<br/>%H:%M',
                                       hour : '%Y<br/>%m-%d<br/>%H:%M',
                                       day : '%Y<br/>%m-%d',
                                       week : '%Y<br/>%m-%d',
                                       month : '%Y<br/>%m',
                                       year : '%Y'
                                   }
                               }
                            },
                            scrollbar: {
                                liveRedraw: false
                            },
                            xAxis:{
                                minRange:300000,
                                events : {
                                    afterSetExtremes : function(e){
                                        var chart = $('#container').highcharts();
                                        chart.showLoading('数据加载中...');
                                        $.getJSON('/dmonitor-webapi/history/rules/chart/?id='+$scope.chartId+"&min="+ Math.round(e.min)+"&max="+Math.round(e.max), function(data){
                                            chart.series[0].setData(data);
                                            chart.hideLoading();
                                        });
                                    }
                                }, //labels:{enabled:false}
                                type : 'datetime',
                                 dateTimeLabelFormats : {
                                     second : '%Y<br/>%m-%d<br/>%H:%M:%S',
                                     minute : '%Y<br/>%m-%d<br/>%H:%M',
                                     hour : '%Y<br/>%m-%d<br/>%H:%M',
                                     day : '%Y<br/>%m-%d',
                                     week : '%Y<br/>%m-%d',
                                     month : '%Y<br/>%m',
                                     year : '%Y'
                                 },
                                ordinal:false
                            },
                            yAxis : {
                                title: {
                                    text: "数值" + ($scope.unit?("( "+$scope.unit+" )"):"")  //y轴上的标题
                                },
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
                            title : {
                                text : '趋势分析-'+$scope.chartRuleDisplayName
                            },
                            series : [
                                {
                                    name: '数值',
                                    data: data
                                }],
                            tooltip:{
                                valueDecimals: 2,
                                xDateFormat:'%Y-%m-%d %H:%M:%S         ',
                                valueSuffix:" "+ ($scope.unit?$scope.unit:"")
                            }
                        });
                    });
                    $scope.historyChartDialog.show();
                },
                initMocTree:function(){
                    ResourceService.getMocCount(function(data){
                        $scope.seachmocTree.data = data;
                        if(!$scope.historySetting) {
                            if($scope.searchPage.pmocId == ""){
                                $timeout(function () {
                                    $scope.searchPage.pmocId = $scope.seachmocTree.data[0].id;
                                    $scope.$apply();
                                    var zTree = angular.element.fn.zTree.getZTreeObj("seachmocTree");
                                    var nodes = zTree.getNodes();
                                    if (nodes.length > 0) {
                                        zTree.selectNode(nodes[0]);
                                    }
                                }, 300);
                            }else{
                                $timeout(function () {
                                    var zTree = angular.element.fn.zTree.getZTreeObj("seachmocTree");
                                    var nodes = zTree.getNodes();
                                    $.each(nodes,function(i,v){
                                        if($scope.searchPage.pmocId == v.id){
                                            zTree.selectNode(nodes[i]);
                                            return false;
                                        }
                                    });
                                }, 300);
                            }
                        }
                    });
                }

            }
        };

        //搜索框
        $scope.searchPage={
            displayName:'',
            pmocId:'',
            mocId:'',
            moId:'',
            moName:'',
            sampleInterval:'',
            indicatorId:'',
            metricId:''
        };

        $scope.isLeaf = function(nodeData){
            return nodeData.id==-1 || nodeData.isJF;
        };

        $scope.searchPagedata={};

        $scope.seachmocTree={
            data:[],
            checked:"",
            crossParent:"true",
            treeId: 'seachmocTree',
            checkType: { "Y" : "", "N" : "" },
            checkbox:null,
            treeClick:function(node){
                $scope.historySetting = true;
                $scope.searchPage.pmocId = node.id;
                $scope.searchPage.mocId = "";
                $scope.$apply();
                $scope.listPage.settings.reload(true);
            }
        };
        $scope.listPage.action.initMocTree();

        $scope.$watch("searchPage.pmocId",function(newVal,oldVal){

            //清除搜索项
            if(newVal!=null && newVal!=oldVal && $scope.historySetting){
                $scope.searchPage.moName="";
                $scope.searchPage.sampleInterval="";
                $scope.searchPage.active="";
                $scope.searchPage.displayName="";
                $scope.searchPage.jfId="";
                $scope.searchPage.starttime="";
                $scope.searchPage.endtime="";
            }

            $scope.searchPagedata.mocs = [];

            if(Util.notNull(newVal)){
                $scope.searchPagedata.mocs = Util.findFromArray(Const.json.moType.value,newVal,$rootScope.history.mocTree)[Const.json.moType.children];
                if($scope.historySetting){
                    $timeout(function(){
                        jQuery("#jmocid option[value='"+$scope.searchPage.mocId+"']").attr("selected","selected");
                    },500);

                }
            }
        },true);

        $scope.$watch("searchPage.mocId",function(newVal,oldVal){
            $scope.searchPage.indicatorId = "";
            $scope.searchPagedata.indicators = [];
            if(Util.notNull(newVal)){
                ResourceService.getMetricByMocId({rule:'history',mocId:newVal},{},function(data){
                    $scope.searchPagedata.indicators = data;
                });
            }
        },false);

        $scope.$watch("searchPage.indicatorId",function(newVal,oldVal){
            $scope.searchPage.metricId = "";
            $scope.searchPagedata.metrics = [];
            if(Util.notNull(newVal)){
                $scope.searchPagedata.metrics = Util.findFromArray(Const.json.metric.value,newVal,$scope.searchPagedata.indicators)[Const.json.metric.children];
            }
        },false);

        //数据表格
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
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
//                {
//                    sTitle: "资源类型组",
//                    mData:"mocp",
//                    mRender:function(mData,type,full) {
//                        return Util.str2Html(mData);
//                    }
//                },
                {
                    sTitle: "资源类型",
                    mData:"moc",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "指标类型组",
                    mData:"indicator",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "指标类型",
                    mData:"metric",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "采集间隔",
                    mData:"sampleInterval",
                    mRender:function(mData,type,full) {
                        for(var i in Const.intervals){
                            if(mData==Const.intervals[i].value){
                                return Const.intervals[i].label;
                            }
                        }
                        return mData + "秒";
                    }
                },
                {
                    sTitle: "更新时间",
                    mData:"updated",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(disabledOp){
                            return '<i title="编辑" class="fa fa-pencil" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>' +
                                '<i title="删除" class="fa fa-trash-o" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>'+
                                ((full.valType!='string' && full.valType!='enum')?'<i title="查看趋势图" class="fa fa-bar-chart-o" ng-click="listPage.action.chart(\''+mData+'\')"></i>':'');
                        }else{
                            return '<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                            '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="listPage.action.active(\''+mData+'\','+(full.active?'false':'true')+')"></i>' +
                            '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>'+
                                ((full.valType!='string' && full.valType!='enum')?'<i title="查看趋势图" class="fa fa-bar-chart-o" ng-click="listPage.action.chart(\''+mData+'\')"></i>':'');
                        }
                    }
                }

            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,9 ] },  //第0、6列不可排序
                { sWidth: "38px", aTargets: [ 0 ]},
                { sWidth: "120px", aTargets: [ 9 ]}
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

    }]);

    //历史记录趋势图
    system.controller('historyTrendController',['$scope','$rootScope','Tools','Util','HistoryRuleService','ResourceService','Const','Loading','$timeout','$routeParams',function($scope,$rootScope,Tools,Util,HistoryRuleService,ResourceService,Const,Loading,$timeout,$routeParams){

        $scope.historyRuleDialog = Tools.dialog({
            id:"historyRuleDialog",
            title:"采集规则",
            save:function(){
                if($scope.listPage.checkedList.length==0){
                    $rootScope.$alert("请选择规则");
                    return ;
                }else if($scope.listPage.checkedList.length>8){
                    $rootScope.$alert("最多只能选择8条记录");
                    return ;
                }else{
                    $scope.historyRuleDialog.hide();  //must be hide first
                    setTimeout(function () {         // a temp solution
                        $scope.listPage.action.chart();
                    },100);
                    $scope.listPageTrend.settings.reload(true);
                }
            }
        });

        $scope.add=false;
        $scope.listPage = {
            scaleMap:{},
            data:[],
            pageData:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                add:function(){
                    $scope.searchPage={
                        displayName:'',
                        pmocId:'',
                        mocId:'',
                        moId:'',
                        moName:'',
                        sampleInterval:'',
                        indicatorId:'',
                        metricId:''
                    };

                    $scope.add=true;
                    $scope.listPage.settings.reload(true);
                    $scope.historyRuleDialog.show();
                },
                chart:function(){
                    jQuery("#tbl").show();
                    var d = new Date();
                    var max = d.getTime();// + (8*60*60*1000);
                    d.setDate(d.getDate()-1);
                    var min = d.getTime() ;//+ (8*60*60*1000);
                    var date = new Date();
                    var navigator_max = date.getTime();
                    date.setFullYear(date.getFullYear()-1);
                    var navigator_min = date.getTime();

                    var seriesOptions = new Array();

                    var seriesCounter=0;

                    var newColorMap = {};
                    $.each($scope.listPage.checkedList, function(i, v) {
                        $.each($scope.listPage.data, function(j, vv) {
                            if(v==vv.id){
                                if($scope.colorMap[vv.id]!=null){
                                    newColorMap[vv.id] = $scope.colorMap[vv.id];
                                }
                            }
                        });
                    });
                    $scope.colorMap = newColorMap;

                    $.each($scope.listPage.checkedList, function(i, v) {
                        $.each($scope.listPage.data, function(j, vv) {
                            if(v==vv.id){
                                $.getJSON('/dmonitor-webapi/history/rules/chart/?id='+v+"&min="+ Math.round(min)+"&max="+Math.round(max),function(data){
                                    var seriesName = $scope.listPage.data[j].displayName+(Util.notNull($scope.listPage.data[j].unit)?"(单位:"+$scope.listPage.data[j].unit+")":"")+"<br/>数值";

                                    seriesOptions[i] = {
                                        id:v,
                                        name: seriesName,
                                        data: data,
                                        color:$scope.selectColor($scope.listPage.data[j].id)
                                    };
                                    seriesCounter++;
                                    if (seriesCounter == $scope.listPage.checkedList.length) {
                                        $scope.seriesData = seriesOptions;
                                        Highcharts.setOptions({
                                            lang:{
                                                rangeSelectorFrom:'从',
                                                rangeSelectorTo:'到',
                                                rangeSelectorZoom:'放大/缩小',
                                                printChart: '打印',
                                                downloadPNG: '导出为PNG格式',
                                                downloadJPEG: '导出为JPEG格式',
                                                downloadPDF: '导出为PDF格式',
                                                downloadSVG: '导出为SVG格式',
                                                contextButtonTitle: '导出图表'
                                            },
                                            global: {
                                                useUTC: false
                                            }
                                        });
                                        $('#container').highcharts('StockChart', {
                                            exporting:{
                                                // 是否允许导出
                                                enabled:false
                                            },
                                            chart:{
                                                type:'spline'
                                            },
                                            rangeSelector : {
                                                allButtonsEnabled:true,
                                                beyondExtremes:true,
                                                inputEnabled: true,
                                                inputBoxWidth:150,
                                                inputDateFormat:'%Y-%m-%d %H:%M:%S',
                                                inputEditDateFormat:'%Y-%m-%d %H:%M:%S',
                                                buttons:[{
                                                    type: 'day',
                                                    count: 1,
                                                    text: '1天'
                                                },{
                                                    type: 'week',
                                                    count: 1,
                                                    text: '1周'
                                                },{
                                                    type: 'month',
                                                    count:1,
                                                    text: '1月'
                                                },{
                                                    type: 'year',
                                                    count: 1,
                                                    text: '1年'
                                                }],
                                                selected: 0
                                            },
                                            navigator : {
                                                adaptToUpdatedData: false,
                                                series : {
                                                    data: [[navigator_min,0],[navigator_max,0]]
                                                },
                                                xAxis:{
                                                    type : 'datetime',
                                                    dateTimeLabelFormats : {
                                                        second : '%Y<br/>%m-%d<br/>%H:%M:%S',
                                                        minute : '%Y<br/>%m-%d<br/>%H:%M',
                                                        hour : '%Y<br/>%m-%d<br/>%H:%M',
                                                        day : '%Y<br/>%m-%d',
                                                        week : '%Y<br/>%m-%d',
                                                        month : '%Y<br/>%m',
                                                        year : '%Y'
                                                    }
                                                }
                                            },
                                            scrollbar: {
                                                liveRedraw: false
                                            },
                                            xAxis:{
                                                minRange:300000,
                                                events : {
                                                    afterSetExtremes : function(e) {
                                                        var chart = $('#container').highcharts();
                                                        chart.showLoading('数据加载中...');
                                                        seriesCounter = 0;
                                                        seriesOptions = new Array();
                                                        $.each($scope.listPage.checkedList, function (k, v1) {
                                                            $.each($scope.listPage.data, function (h, v2) {
                                                                if(v1==v2.id){
                                                                    $.getJSON('/dmonitor-webapi/history/rules/chart/?id=' + v1 + "&min=" + Math.round(e.min) + "&max=" + Math.round(e.max), function (data) {

                                                                        var newdata = [];
                                                                        if($scope.listPage.scaleMap[v1]){
                                                                            $.each(data, function (j, d) {
                                                                                var dd = new Array();
                                                                                dd[0] = d[0];
                                                                                dd[1] = (d[1]==null?null:parseFloat(d[1] * $scope.listPage.scaleMap[v1]));
                                                                                newdata[j] = dd;
                                                                            });
                                                                            data = newdata;
                                                                        }
                                                                        seriesCounter++;
                                                                        seriesOptions[k] = {
                                                                            id: v1,
                                                                            name: $scope.listPage.data[h].displayName+(Util.notNull($scope.listPage.data[h].unit)?"(单位:"+$scope.listPage.data[h].unit+")":"")+"<br/>数值",
                                                                            data: data
                                                                        };
                                                                        chart.series[k].setData(angular.copy(data));
                                                                        if (seriesCounter == $scope.listPage.checkedList.length) {
                                                                            $scope.seriesData = seriesOptions;
                                                                            chart.hideLoading();
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    }
                                                },
                                                type : 'datetime',
                                                dateTimeLabelFormats : {
                                                   second : '%Y<br/>%m-%d<br/>%H:%M:%S',
                                                    minute : '%Y<br/>%m-%d<br/>%H:%M',
                                                    hour : '%Y<br/>%m-%d<br/>%H:%M',
                                                    day : '%Y<br/>%m-%d',
                                                    week : '%Y<br/>%m-%d',
                                                    month : '%Y<br/>%m',
                                                    year : '%Y'
                                                },
                                                ordinal:false
                                            },
                                            yAxis : {
                                                title: {
                                                    text: ''  //y轴上的标题
                                                },
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
                                            title : {
                                                text : '趋势分析'
                                            },
                                            series : angular.copy(seriesOptions) ,
                                            tooltip:{
                                                valueDecimals: 2,
                                                xDateFormat:'%Y-%m-%d %H:%M:%S      '
                                                //valueSuffix:Util.notNull($scope.listPage.data[j].unit)?$scope.listPage.data[j].unit:""
                                            }
                                        });
                                    }
                                });
                            }

                        });
                    });
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.limit = search.limit;
                    $scope.searchPage.offset = search.offset;
                    $scope.searchPage.orderBy = search.orderBy;
                    $scope.searchPage.orderByType  = search.orderByType;
                    $scope.searchPage.valType='number';
                    $scope.searchPage.moId="";
                    $scope.searchPage.indicatorName="";
                    $scope.searchPage.metricName="";
                    if(!$scope.add){
                        var moId = ($routeParams.moId||"");
                        var indicatorName = ($routeParams.indicator||"");
                        var metricName = ($routeParams.metric||"");
                        $scope.searchPage.moId=moId;
                        $scope.searchPage.indicatorName=indicatorName;
                        $scope.searchPage.metricName=metricName;
                    }
                    Loading.show();
                    HistoryRuleService.getHistoryRule(Util.sumMap($scope.searchPage,{needEnum:false}),function(data){
                        for(var i=0;i<data.rows.length;i++){
                            var exist = false;
                            for(var j=0;j<$scope.listPage.data.length;j++){
                                if(data.rows[i].id==$scope.listPage.data[j].id){
                                    exist = true;
                                    break;
                                }
                            }
                            if(!exist){
                                $scope.listPage.data.push(data.rows[i]);
                            }
                        }
                        $scope.listPage.pageData = data.rows;
                        fnCallback(data);
                        if(!$scope.add && moId != '' && indicatorName != '' && metricName != ''){
                            $.each(data.rows,function(i,val){
                                $scope.listPage.checkedList[i] = val.id;
                            });
                            $scope.listPage.action.chart();
                            $scope.listPageTrend.settings.reload(true);
                        }else{
                            //$scope.listPage.checkedList = [];
                           // $scope.listPage.checkAllRow = false;
                        }
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

        //搜索框
        $scope.searchPage={
            displayName:'',
            pmocId:'',
            mocId:'',
            moId:'',
            moName:'',
            sampleInterval:'',
            indicatorId:'',
            metricId:''
        };
        $scope.searchPagedata={};

        $scope.$watch("searchPage.pmocId",function(newVal,oldVal){
            if(!Util.notNull(newVal) || !$scope.historySetting){
                $scope.searchPage.mocId = "";
            }
            $scope.searchPagedata.mocs = [];
            if(Util.notNull(newVal)){
                $scope.searchPagedata.mocs = Util.findFromArray(Const.json.moType.value,newVal,$rootScope.history.mocTree)[Const.json.moType.children];
                if($scope.historySetting){
                    $timeout(function(){
                        jQuery("#jmocid option[value='"+$scope.searchPage.mocId+"']").attr("selected","selected");
                    },500);

                }
            }
        },false);

        $scope.$watch("searchPage.mocId",function(newVal,oldVal){
            $scope.searchPage.indicatorId = "";
            $scope.searchPagedata.indicators = [];
            if(Util.notNull(newVal)){
                ResourceService.getMetricByMocId({rule:'history_chart',mocId:newVal},{},function(data){
                    $scope.searchPagedata.indicators = data;
                });
            }
        },false);

        $scope.$watch("searchPage.indicatorId",function(newVal,oldVal){
            $scope.searchPage.metricId = "";
            $scope.searchPagedata.metrics = [];
            if(Util.notNull(newVal)){
                $scope.searchPagedata.metrics = Util.findFromArray(Const.json.metric.value,newVal,$scope.searchPagedata.indicators)[Const.json.metric.children];
            }
        },false);

        //数据表格
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
                    sTitle: "资源实例",
                    mData:"moName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型组",
                    mData:"mocp"
                },
                {
                    sTitle: "资源类型",
                    mData:"moc"
                },
                {
                    sTitle: "指标类型组",
                    mData:"indicator"
                },
                {
                    sTitle: "指标类型",
                    mData:"metric"
                }

            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0 ] },  //第0、6列不可排序
                { sWidth: "29px", aTargets: [ 0 ]}
            ],  //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };
        var isAllSelect = function(){
            if($scope.listPage.pageData.length==0){
                return false;
            }
            var allExist = true;
            for(var i = 0;i<$scope.listPage.pageData.length;i++){
                var exist = false;
                for(var j = 0;j<$scope.listPage.checkedList.length;j++){
                    if($scope.listPage.pageData[i].id==$scope.listPage.checkedList[j]){
                        exist = true;
                        break;
                    }
                }
                if(!exist){
                    allExist = false;
                    break;
                }
            }
            return allExist;
        };

        //多选框
        $scope.$watch("listPage.checkAllRow",function(newVal,oldVal){
            var allSelect = isAllSelect();
            if((allSelect && newVal) || (!allSelect && !newVal)){
                return;
            }

                var pageIds = Util.copyArray("id",$scope.listPage.pageData);
                for(var i=0;i<pageIds.length;i++){
                    var exist = false;
                    for(var j=0;j<$scope.listPage.checkedList.length;j++){
                        if(pageIds[i]==$scope.listPage.checkedList[j]){
                            if(newVal){
                                exist = true;
                            }else{
                                $scope.listPage.checkedList.splice(j,1);
                            }
                            break;
                        }
                    }
                    if(newVal && !exist){
                        $scope.listPage.checkedList.push(pageIds[i]);
                    }
                }

        },false);

        $scope.$watch("[listPage.checkedList.length,listPage.pageData.length]",function(newVal,oldVal){
            $scope.listPage.checkAllRow = isAllSelect();
        },true);

        $scope.colors = ["#008080","#000000","#003399", "#e4d354", "#8bbc21", "#FF9933", "#1aadce", "#492970"];
        $scope.colorMap = {};
        $scope.selectColor = function(name){
            if($scope.colorMap[name]){
                return $scope.colorMap[name];
            }else{
                for(var i in $scope.colors){
                    var color = $scope.colors[i];
                    var found = false;
                    for(var key in $scope.colorMap){
                        if($scope.colorMap[key]==color){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        $scope.colorMap[name]=color;
                        return color;
                    }
                }
            }
            return "#ff0000";
        };
        $scope.removeColor = function(name){
            $scope.colorMap[name]=null;
        }

        $scope.f = false;
        $scope.f1 = false;
        $scope.listPageTrend = {
            action:{
                add:function(id){

                        Loading.show();
                        $timeout(function(){
                            var scale = jQuery("#" + id).val();
                            $scope.listPage.scaleMap[id]=scale;
                            var series = new Array();
                            $.each($scope.seriesData, function (i, v) {
                                if($scope.listPage.scaleMap[v.id]){
                                    var newid = v.id;
                                    var newname = v.name;
                                    var newdata = new Array();
                                    $.each(v.data, function (j, d) {
                                        var dd = new Array();
                                        dd[0] = d[0];
                                        dd[1] = (d[1]==null?null:parseFloat(d[1] * $scope.listPage.scaleMap[v.id]));
                                        newdata[j] = dd;
                                    });
                                    series[i] = {
                                        id: newid,
                                        name: newname,
                                        data: newdata
                                    }
                                } else {
                                    series[i] = v;
                                }
                            });
                            var chart = $('#container').highcharts();
                            $.each(series, function (i, v) {
                                chart.series[i].setData(v.data);
                            });
                            Loading.hide();
                        },100);

                },
                remove:function(id){

                        //删除线条
                        Loading.show();
                        $timeout(function(){
                            //删除列表
                            $scope.listPage.scaleMap={};
                            var datas = new Array();
                            j=0;
                            $.each($scope.listPageTrend.data,function(i,v){
                                if(v.id!=id){
                                    datas[j] = v;
                                    j++;
                                }else{
                                    $scope.removeColor(v.id);
                                }
                            });
                            $scope.listPageTrend.data = datas;

                            for(var i in $scope.listPage.checkedList){
                                if($scope.listPage.checkedList[i]==id){
                                    $scope.listPage.checkedList.splice(i,1);
                                    break;
                                }
                            }
                            if($scope.listPage.checkedList.length==0){
                                var chart = $('#container').highcharts();
                                chart.destroy();
                                $('#container').empty();
                            }else{
                                $scope.listPage.action.chart();
                            }


                            $scope.f1 = true;
                            $scope.listPageTrend.settings.reload(true);
                            Loading.hide();
                        },100);

                },
                search: function (search,fnCallback) {
                    var searchPage={};
                    searchPage.limit = search.limit;
                    searchPage.offset = search.offset;
                    searchPage.orderBy = search.orderBy;
                    searchPage.orderByType  = search.orderByType;
                    searchPage.ids = $scope.listPage.checkedList;
                    if($scope.f && $scope.listPage.checkedList.length>0){
                        Loading.show();
                        HistoryRuleService.getHistoryRule(Util.sumMap(searchPage,{needEnum:false}),function(data){
                            var newColorMap = {};
                            $.each(data.rows,function(i,v){
                                if($scope.colorMap[v.id]!=null){
                                    newColorMap[v.id] = $scope.colorMap[v.id];
                                }
                            });
                            $scope.colorMap = newColorMap;

//                            if(!$scope.f1){
                                $.each(data.rows,function(i,v){
                                    data.rows[i].color = $scope.selectColor(v.id);
                                });
                                $scope.listPageTrend.data =data.rows;
                                fnCallback(data);
//                            }else{
//                                data = {
//                                    "total":$scope.listPageTrend.data.length,
//                                    "rows":$scope.listPageTrend.data
//                                };
//                                fnCallback(data);
//                            }
                            $scope.f1=false;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                    if($scope.f && $scope.listPage.checkedList.length==0){
                        data = {
                            "total":0,
                            "rows":[]
                        };
                        fnCallback(data);
                        $scope.f1=false;
                    }
                    $scope.f = true;
                }
            }
        };

        $scope.listPageTrend.settings = {
            reload : null,
            getData:$scope.listPageTrend.action.search, //getData应指定获取数据的函数
            columns : [
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
                    sTitle: "资源类型组",
                    mData:"mocp",
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
                    sTitle: "指标类型组",
                    mData:"indicator",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "指标类型",
                    mData:"metric",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "数据比例",
                    mData:"id",
                    mRender: function (mData, type, full) {
                        var str="";
                        str +="<label class='select'>";
                        str +="<select class='input-sm' id='"+mData+"'>";
                        str +="<option value=1000>1000</option>";
                        str +="<option value=100>100</option>";
                        str +="<option value=10>10</option>";
                        str +="<option value=1 selected>0</option>";
                        str +="<option value=0.1>0.1</option>";
                        str +="<option value=0.01>0.01</option>";
                        str +="<option value=0.001>0.001</option>";
                        str +="</select>";
                        str +="</label>";
                        return str;
                    }
                },
                {
                    sTitle: "数据颜色",
                    mData:"color",
                    mRender: function (mData, type, full) {
                        return '<div style="background-color:'+mData+';width:50px;height:20px"></div>';
                    }
                },
                {
                    sTitle: "操作",
                    mData: "id",
                    mRender: function (mData, type, full) {
                        return "<i title='确认' class='fa fa-check' ng-click='listPageTrend.action.add("+mData+")'></i><i title='删除' class='fa fa-trash-o' ng-click='listPageTrend.action.remove("+mData+")'></i>";
                    }
                }

            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,1,2,3,4,5,6,7,8] },  //第0、6列不可排序
                { sWidth: "100px", aTargets: [ 7 ]},
                { sWidth: "90px", aTargets: [ 7 ]}
            ] , //定义列的约束
            defaultOrderBy :[]  //定义默认排序列为第8列倒序
        };

    }]);

    //历史记录数据分析
    system.controller('historyReportController',['$scope','$rootScope','Tools','Util','HistoryRuleService','ResourceService','Const','Loading','$timeout',function($scope,$rootScope,Tools,Util,HistoryRuleService,ResourceService,Const,Loading,$timeout){
        $scope.searchPage={};
        $scope.searchPage.data={};
        $scope.searchPage.datas={};

        $scope.$watch("searchPage.data.mocId",function(newVal,oldVal){
            $scope.searchPage.data.moc = "";
            $scope.searchPage.data.rules = [];
            $scope.searchPage.datas.ruleTree = [];
            $scope.searchPage.data.metrics = [];
            $scope.searchPage.datas.metricTree = [];
            if(Util.notNull(newVal)){
                ResourceService.getMetricByMocId({rule:'history',mocId:newVal},{},function(data){
                    $scope.searchPage.datas.metricTree = data;
                });
                ResourceService.getMoc({mocId:newVal},{},function(data){
                    $scope.searchPage.data.moc = data.name;
                });
            }
        },false);

        $scope.$watch("searchPage.data.metrics",function(newVal,oldVal){
            $scope.searchPage.datas.ruleTree = [];
            if(Util.notNull(newVal)){
                var param = {};
                var zTree =angular.element.fn.zTree.getZTreeObj("metricTree");
                if(Util.notNull(zTree)){
                    var checknodes = zTree.getCheckedNodes(true);
                    param.indicator=[];
                    param.metric=[];
                    var a = 0;
                    var b = 0;
                    $.each(checknodes,function(i,checkVal){
                        if(checkVal.level==0) {
                            param.indicator[a]=checkVal.data.id;
                            a++;
                        }
                        if(checkVal.level==1) {
                            param.metric[b]=checkVal.data.id;
                            b++;
                        }
                    });
                }
                param.mocId=$scope.searchPage.data.mocId;
                HistoryRuleService.list(param,{},function(data){
                    $scope.searchPage.datas.ruleTree = [];
                    $.each(data,function(i,val){
                        $scope.searchPage.datas.ruleTree[i] = {"displayName":val.moName+(val.metricsArgs==null ?"":"\t"+val.metricsArgs)+"\t"+val.indicator+"\t"+val.metric,"id":val.id};
                    });
                });
            }
        },false);

        $scope.listPage = {
            action:{
                export:function(){
                   // window.location.href="/dmonitor-webapp/dnt.xls";
                   HistoryRuleService.export($scope.searchPage.data,function(data){
                        window.location.href="/dmonitor-webapp/"+data.fileName;
                    });
                },
                search: function () {
                    Loading.show();
                    HistoryRuleService.getHistoryPerformance($scope.searchPage.data,function(data){
                        jQuery("#datatable").html("");
                        document.getElementById("ex").style.display = "block";
                        if(!Util.notNull(data))
                            return;
                        jQuery("#aabb").css("width",(data.cols.length+3)*150);
                        var t = "";
                        t += "<thead class='ng-scope'>";
                        t += "<tr>";
                        t += "<th>资源实例</th>";
                        t += "<th>资源类型组</th>";
                        t += "<th>资源类型</th>";
                        jQuery.each(data.cols,function(i,val){
                            t += "<th>"+val.columnName+"</th>";
                        });
                        t += "</tr>";
                        t += "</thead>";
                        t += "<tbody>";

                        jQuery.each(data.rows,function(i,val){
                            t += "<tr>";
                            if(Util.notNull(val.moDisplayName)){
                                t += "<th>"+val.moDisplayName+"</th>";
                                t += "<th>"+val.mocpDisplayName+"</th>";
                                t += "<th>"+val.mocDisplayName+"</th>";
                            }
                            jQuery.each(data.cols,function(j,v){
                                var a = 0;
                                jQuery.each(val,function(key,value){
                                    if(v.columnVal==key){
                                        a = 1;
                                        t += "<th>"+value+"</th>";
                                    }
                                });
                                if(a==0){
                                    t += "<th>--</th>";
                                }
                            });
                            t += "</tr>";
                        });

                       t += "</tbody>";
                        jQuery("#datatable").append(t);
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

    }]);

})(angular);