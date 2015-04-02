(function(angular){

    var itsm = angular.module('itsm',['ngRoute','ngResource','itsm.services','itsm.controllers','itsm-model','kindeditorDirective']);
    itsm.config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/createIncident',{
                templateUrl:'views/itsm/incident.html',
                controller:'incidentController'});
            $routeProvider.when('/queryIncident',{
                templateUrl:'views/itsm/incidentlist.html'});
            $routeProvider.when('/createProblem',{
                templateUrl:'views/itsm/problem.html',
                controller:'problemController'});
            $routeProvider.when('/queryProblem',{
                templateUrl:'views/itsm/problemlist.html'});
            $routeProvider.when('/createChange', {
                templateUrl: 'views/itsm/change.html',
                controller:'changeController'});
            $routeProvider.when('/queryChange', {
                templateUrl: 'views/itsm/changelist.html'});
            $routeProvider.when('/createKnowledgeLib', {
                templateUrl: 'views/itsm/knowledgelib.html',
                controller:'libController'});
            $routeProvider.when('/queryKnowledgeLib', {
                templateUrl: 'views/itsm/knowledgeliblist.html',
                controller:'libController'});
            $routeProvider.when('/queryMyTask', {
                templateUrl: 'views/itsm/mytasklist.html',
                controller:'mytaskController'});

        $routeProvider.when('/incident', {
            templateUrl: 'views/itsm/views/incident.html',
            controller:'incidentCtrl'});
        $routeProvider.when('/problem', {
            templateUrl: 'views/itsm/views/problem.html',
            controller:'incidentCtrl'});
        $routeProvider.when('/change', {
            templateUrl: 'views/itsm/views/change.html',
            controller:'incidentCtrl'});
        $routeProvider.when('/myTask', {
            templateUrl: 'views/itsm/views/mytask.html',
            controller:'myTaskCtrl'});
        $routeProvider.when('/sla', {
            templateUrl: 'views/itsm/sla.html',
            controller:'slaController'});
        $routeProvider.when('/workAb', {
            templateUrl: 'views/itsm/ab.html',
            controller:'abController'});
        $routeProvider.when('/work', {
            templateUrl: 'views/itsm/work.html',
            controller:'workController'});
    }]);


    itsm.controller('myTaskCtrl',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','Tools',function($scope,$rootScope,$location,$timeout,ItsmService,Util,Loading,Tools){
        $scope.isMyTaskPage = true;
        var childId=$location.$$search.childId==null?"11":$location.$$search.childId;
        var parentId=$location.$$search.parentId==null?"1":$location.$$search.parentId;
        $scope.initData={};
        ItsmService.getUsers(function (data) {
            $scope.initData.users = data.rows;
        });

        $scope.taskList = {
            childId:childId,
            parentId:parentId,
            status:null
        };
        $scope.taskTree = [
            {
                "id":"1",
                "displayName":"故障",
                "children":[{"id":"11","displayName":"待签","status":"1"},{"id":"12","displayName":"待办","status":"2"},{"id":"13","displayName":"参与","status":"3"},{"id":"14","displayName":"关闭","status":"4"}]
            },
            {
                "id":"2",
                "displayName":"问题",
                "children":[{"id":"21","displayName":"待签","status":"1"},{"id":"22","displayName":"待办","status":"2"},{"id":"23","displayName":"参与","status":"3"},{"id":"24","displayName":"关闭","status":"4"}]
            },
            {
                "id":"3",
                "displayName":"变更",
                "children":[{"id":"31","displayName":"待签","status":"1"},{"id":"32","displayName":"待办","status":"2"},{"id":"33","displayName":"参与","status":"3"},{"id":"34","displayName":"关闭","status":"4"}]
            }
        ];
        ItsmService.taskGroup({flow:"incident,problem,change"},function(data){
            for(var i=0;i<$scope.taskTree.length;i++){
                for(var j=0;j<$scope.taskTree[i].children.length;j++){
                    var count=data[$scope.taskTree[i].children[j].id];
                    var index=$scope.taskTree[i].children[j].displayName.indexOf("(")
                    if(index>-1)
                        $scope.taskTree[i].children[j].displayName=$scope.taskTree[i].children[j].displayName.substring(0,index)+"("+count+")";
                    else
                        $scope.taskTree[i].children[j].displayName=$scope.taskTree[i].children[j].displayName+"("+count+")";
                }
            }
        });
        $scope.imageDialog = Tools.dialog({
            id:"imageDialog",
            title:"流程图",
            hiddenButton:true,
            save:function(){
                $scope.imageDialog.hide();
            }
        });
        $scope.rootMocs=[];
        ItsmService.getAllMoc(function(data){
            $scope.rootMocs = data;
        });
    }]);

    itsm.controller('incidentListCtrl',['$scope','$rootScope','$location','$timeout','Util','Loading','Tools','ItsmService',function($scope,$rootScope,$location,$timeout,Util,Loading,Tools,ItsmService){
        $scope.childId = $location.$$search.childId;
        $scope.incidentSearchPage = {
            data : {
                hide:true,
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "",//排序字段
                orderByType : "" //排序顺序
            },
            init : function(){

            },
            search:function(){
                $scope.incidentList.settings.reload(true);
            }
        };

        $scope.incidentList = {
            data:[],
            action : {
                edit:function(id){
                    var cked=angular.element("#ck_"+id).attr("checked");
                    Loading.show();
                    ItsmService.saveHide({orderId:id,processType:"incident",cked:cked==undefined},function(data){
                        Loading.hide();
                    },function(data){
                        Loading.hide();
                    });
                }
            }
        };
        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 11 || newVal == 12 || newVal == 13 || newVal == 14)){
                $scope.incidentSearchPage.search();
            }
        },false);
        $scope.incidentList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.incidentSearchPage.data.limit = search.limit;
                $scope.incidentSearchPage.data.offset = search.offset;
                $scope.incidentSearchPage.data.orderBy = search.orderBy;
                $scope.incidentSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                if($scope.taskList.childId==11){
                    $scope.claim=true;
                    ItsmService.queryClaimingIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==12){
                    ItsmService.queryTaskIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==13){
                    ItsmService.queryRunningIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==14){
                    ItsmService.queryFinishedIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            },
            columns : [
                {
                    sTitle: "显示/隐藏",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        if(full.params.hide==null)
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'" checked="checked" ng-click="incidentList.action.edit('+mData+')"><span class="lbl"></span>';
                        else
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'"  ng-click="incidentList.action.edit('+mData+')"><span class="lbl"></span>';
                    }
                },
                {
                    sTitle: "故障单号",
                    mData:"orderId"
                },
                {
                    sTitle: "故障标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 9 ] },
                { sWidth: "140px", aTargets: [ 10 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };
    }]);
    itsm.controller('problemListCtrl',['$scope','$rootScope','$location','$timeout','Util','Loading','Tools','ItsmService',function($scope,$rootScope,$location,$timeout,Util,Loading,Tools,ItsmService){
        $scope.childId = $location.$$search.childId;
        $scope.incidentSearchPage = {
            data : {
                hide:true,
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "",//排序字段
                orderByType : "" //排序顺序
            },
            search:function(){
                $scope.incidentList.settings.reload(true);
            }
        };

        $scope.incidentList = {
            data:[],
            action : {
                edit:function(id){
                    var cked=angular.element("#ck_"+id).attr("checked");
                    Loading.show();
                    ItsmService.saveHide({orderId:id,processType:"problem",cked:cked==undefined},function(data){
                        Loading.hide();
                    },function(data){
                        Loading.hide();
                    });
                }
            }
        };
        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 21 || newVal == 22 || newVal == 23 || newVal == 24)){
                $scope.incidentSearchPage.search();
            }
        },false);
        $scope.incidentList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.incidentSearchPage.data.limit = search.limit;
                $scope.incidentSearchPage.data.offset = search.offset;
                $scope.incidentSearchPage.data.orderBy = search.orderBy;
                $scope.incidentSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                if($scope.taskList.childId==21){
                    $scope.claim=true;
                    ItsmService.queryClaimingProblem($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==22){
                    ItsmService.queryTaskProblem($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==23){
                    ItsmService.queryRunningProblem($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==24){
                    ItsmService.queryFinishedProblem($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            },
            columns : [
                {
                    sTitle: "显示/隐藏",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        if(full.params.hide==null)
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'" checked="checked" ng-click="incidentList.action.edit('+mData+')"><span class="lbl"></span>';
                        else
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'"  ng-click="incidentList.action.edit('+mData+')"><span class="lbl"></span>';
                    }
                },
                {
                    sTitle: "问题单号",
                    mData:"orderId"
                },
                {
                    sTitle: "问题标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 9 ] },
                { sWidth: "140px", aTargets: [ 10 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };
    }]);
    itsm.controller('changeListCtrl',['$scope','$rootScope','$location','$timeout','Util','Loading','Tools','ItsmService',function($scope,$rootScope,$location,$timeout,Util,Loading,Tools,ItsmService){
        $scope.childId = $location.$$search.childId;
        $scope.incidentSearchPage = {
            data : {
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                hide:true,
                orderBy : "",//排序字段
                orderByType : "" //排序顺序
            },
            init : function(){

            },
            search:function(){
                $scope.incidentList.settings.reload(true);
            }
        };

        $scope.incidentList = {
            data:[],
            action : {
                edit:function(id){
                    var cked=angular.element("#ck_"+id).attr("checked");
                    Loading.show();
                    ItsmService.saveHide({orderId:id,processType:"change",cked:cked==undefined},function(data){
                        Loading.hide();
                    },function(data){
                        Loading.hide();
                    });
                }
            }
        };
        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 31 || newVal == 32 || newVal == 33 || newVal == 34)){
                $scope.incidentSearchPage.search();
            }
        },false);
        $scope.incidentList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.incidentSearchPage.data.limit = search.limit;
                $scope.incidentSearchPage.data.offset = search.offset;
                $scope.incidentSearchPage.data.orderBy = search.orderBy;
                $scope.incidentSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                if($scope.taskList.childId==31){
                    $scope.claim=true;
                    ItsmService.queryClaimingChange($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==32){
                    ItsmService.queryTaskChange($scope.incidentSearchPage.data,function(data){
                        Loading.hide();
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==33){
                    ItsmService.queryRunningChange($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==34){
                    ItsmService.queryFinishedChange($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
                Loading.hide();
            },
            columns : [
                {
                    sTitle: "显示/隐藏",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        if(full.params.hide==null)
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'" checked="checked" ng-click="incidentList.action.edit('+mData+')"><span class="lbl"></span>';
                        else
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'"  ng-click="incidentList.action.edit('+mData+')"><span class="lbl"></span>';
                    }
                },
                {
                    sTitle: "变更单号",
                    mData:"orderId"
                },
                {
                    sTitle: "变更标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "变更类型",
                    mData:"typeId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.typeId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 9 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };
    }]);
})(angular);

