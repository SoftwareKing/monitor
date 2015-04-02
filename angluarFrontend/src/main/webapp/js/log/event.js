(function(angular){
    'use strict';
    var api_path="../dmonitor-webapi";
    var event = angular.module('log.event',['ngRoute','ngResource']);
    event.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/eventRule', {templateUrl: 'views/log/event_rule.html'});
        $routeProvider.when('/events', {templateUrl: 'views/log/event.html'});
    }]);

    event.factory('EventService',['$resource',function(resource){
        return resource("",{},{
            addRule:{method:'PUT',url:api_path+"/log/eventRule",isArray:false},
            editRule:{method:'POST',url:api_path+"/log/eventRule",isArray:false},
            activeRule:{method:'POST',url:api_path+"/log/eventRule/active",isArray:false},
            removeRule:{method:'DELETE',url:api_path+"/log/eventRule",isArray:false},
            queryRule:{method:'GET',url:api_path+"/log/eventRule",isArray:false},
            queryEvent:{method:'GET',url:api_path+"/log/event",isArray:false}
        });
    }]);
    event.service("event.Const",function(){
        this.levels=[
            {"label":'<img ng-src=\'img/alarm/6.png\'/>',"value":6},
            {"label":'<img ng-src="img/alarm/5.png"/>',"value":5},
            {"label":'<img ng-src="img/alarm/4.png"/>',"value":4},
            {"label":'<img ng-src="img/alarm/3.png"/>',"value":3},
            {"label":'<img ng-src="img/alarm/2.png"/>',"value":2}
        ];
        });

    event.controller('eventRoleCtrl',['$scope','$rootScope','Util','Tools','EventService','MoClient','alarm.DataLoader','Loading','OperateService','event.Const','$timeout',function($scope,$rootScope,Util,Tools,Event,MoClient,Alarm,Loading,Operate,Const,$timeout){
        $scope.intervals={"600000":"10分钟","1800000":"30分钟","3600000":"1小时"};
        $scope.intervalList=[{name:"600000",value:"10分钟"},{name:"1800000",value:"30分钟"},{name:"3600000",value:"1小时"}];
        $scope.levels=[{name:"1",value:"低"},{name:"2",value:"中"},{name:"3",value:"高"}];
        $scope.levelMap={"1":"低","2":"中","3":"高"};
        $scope.searchPage = {
            data : {
                mocpId:"",
                mocId:"",
                name:"",
                starttime:"",
                endtime:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序

            },
            mocs:[],
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                }
            }
        };
        $scope.roleDailog=Tools.dialog({
            id:"ruleDialog",
            title:"",
            hiddenButton:true,
            moHidden:false,
            moName:"",
            model:{level:4},
            mocName:"",
            data:{
                mosTree:[],
                notifyMethod:[],
                comparator:"like"
            },
            userTree:{
                init:function(){
                    var foeachArray=function(rows){
                        for(var i=0;i<rows.length;i++){
                            var row=rows[i];
                            if((row.id+'').indexOf("_")==-1){
                                row.nocheck=true;
                                row.isParent=true;
                            }
                            if(row.children && row.children.length>0){
                                foeachArray(row.children);
                            }
                        }
                    };
                    Operate.getDepartUsers(function(rows){
                        foeachArray(rows);
                        $scope.roleDailog.userTree.data=rows;
                    });
                },
                data:[],
                returnData:[],
                checkType: { "Y" : "s", "N" : "s" },
                checked:"",
                checkbox:"true",
                treeId: 'userTree',
                level:2,
                onCheck:function(nodes){
                    if(nodes && nodes.length>0){
                        var ids="";
                        for(var i=0;i<nodes.length;i++){
                            var node=nodes[i];
                            if((node.id+"").indexOf("_")>-1){
                                $scope.roleDailog.model.notifier=parseInt(node.id.substring(2,node.id.length));
                                $scope.$apply();
                            }
                        }
                    }
                }
            },
            moTree:{
                treeId: 'moTree',
                data:[],
                settingData:{key:{name:"displayName"}},returnData:[],checked:"",checkbox: "radio",
                onCheck:function(nodes){
                    if(nodes.length>0) $scope.roleDailog.model.moId=nodes[0].id;
                    $scope.$apply();
                }
            },
            mocTree:{
                treeId: 'mocTree',
                data:[],
                settingData:{key:{name:"displayName"}},returnData:[],checked:"",checkbox: "radio",
                onCheck:function(nodes){
                    $scope.roleDailog.model.moId=null;
                    if(nodes.length>0){
                        $scope.roleDailog.model.mocpId=nodes[0].getParentNode().id;
                        $scope.roleDailog.model.mocId=nodes[0].id;
                    }else{
                        var moTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                        nodes=moTree.getCheckedNodes(true);
                        for(var i=0;i<nodes.length;i++){
                            moTree.checkNode(nodes[i],false,false);
                        }
                    }
                    $scope.$apply();
                }
            },
            initTree:function(){
                $scope.roleDailog.userTree.init();
                $rootScope.$watch("resource.moc.length",function(n){
                    if(n && n>0 && $scope.roleDailog.mocTree.data.length==0){
                        var data=angular.copy($rootScope.resource.moc);
                        var index=[];
                        for(var i=0;i<data.length;i++){
                            data[i].nocheck=true;
                            if("host" == data[i].name)index.push(data[i]);
                            else if("network" == data[i].name)index.push(data[i]);
                        }
                        $scope.roleDailog.mocTree.data=index;
                    }
                },true);
            },
            save:function(){
                var mocIds=";";
                if(angular.element("#active").attr("checked")) $scope.roleDailog.model.active=true;
                else $scope.roleDailog.model.active=false;

                var userTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.userTree.treeId);
                var users=userTree.getCheckedNodes(true);
                var userIds="";
                for(var i=0;i<users.length;i++){
                    if(userIds.length>0)userIds+=";";
                    var id=users[i].id;
                    userIds+=id.substring(2,id.length);
                }
                if(userIds.length==0)$scope.roleDailog.model.notifier=null;
                else $scope.roleDailog.model.notifier=userIds;
                if($scope.roleDailog.data.notifyMethod.length>0) $scope.roleDailog.model.notifyMethod=angular.toJson($scope.roleDailog.data.notifyMethod);
                else $scope.roleDailog.model.notifyMethod=null;
                delete $scope.roleDailog.model.type;

                if($scope.roleDailog.model.id){
                    Event.editRule($scope.roleDailog.model,function(data){
                        if(data[0] == 'f'){
                            $rootScope.$alert("规则名称重复！");
                            return;
                        }
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                    });
                }else{
                    Event.addRule($scope.roleDailog.model,function(data){
                        if(data[0] == 'f'){
                            $rootScope.$alert("规则名称重复！");
                            return;
                        }
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                    });
                }
            }
        });
        $scope.roleDailog.initTree();


        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                add: function () {
                    $scope.roleDailog.title="新增";
                    $scope.roleDailog.moHidden=false;
                    $scope.roleDailog.model={name:null,active:true,interval:"1800000",times:1,level:4,type:0,rule:"",content:"[资源对象] 触发 [规则名称] 事件，满足表达式 [规则表达式]"};
                    angular.element("#active").attr("checked",true);
                    $scope.roleDailog.data.notifyMethod=[];
                    var userTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.userTree.treeId);
                    userTree.checkAllNodes(false);
                    var mocTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.mocTree.treeId);
                    var nodes=mocTree.getCheckedNodes(true);
                    for(var i=0;i<nodes.length;i++){
                        mocTree.checkNode(nodes[i],false,false);
                    }
                    $scope.roleDailog.moTree.data=[];
                    $scope.roleDailog.show();
                },
                edit: function (id) {
                    $scope.roleDailog.title="编辑";
                    $scope.roleDailog.moHidden=true;
//                    $scope.roleDailog.moTree.data=[];
                    $scope.roleDailog.moName="";
                    $scope.roleDailog.mocName="";
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    if(model.times==null)model.times=1;
                    if(model.level==null)model.level=2;
                    if(model.type==null)model.type=0;
                    $scope.roleDailog.model=angular.copy(model);
                    if(model.active)angular.element("#active").attr("checked",true);
                    else angular.element("#active").removeAttr("checked");
                    var userTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.userTree.treeId);
                    userTree.checkAllNodes(false);
                    if(model.notifier && model.notifier.length>0){
                        var ids=model.notifier.split(";");
                        for(var i=0;i<ids.length;i++){
                            var node = userTree.getNodeByParam("id","u_"+ids[i], null);
                            if(node){
                                userTree.checkNode(node,true,false);
                                userTree.expandNode(node.getParentNode(),true,true,true);
                            };
                        }
                    }
                    if(model.notifyMethod && model.notifyMethod.length>0){
                        $scope.roleDailog.data.notifyMethod=angular.fromJson(model.notifyMethod);
                    }

                    var mocTreeObj = angular.element.fn.zTree.getZTreeObj("mocTree");
                    var node = mocTreeObj.getNodeByParam("id",model.mocId, null);
                    mocTreeObj.checkNode(node,true,true);
                    mocTreeObj.expandNode(node.getParentNode(),true,true,false);
                    $scope.getMocFlag =false;
                    $scope.getMoc();
                    $timeout(function () {
                    $scope.$watch("roleDailog.moTree.data.length>0",function(n) {
                            if (n > 0) {
                                var mo = Util.findFromArray("id", model.moId, $scope.roleDailog.moTree.data);
                                if(null == mo) {
                                    $timeout(null, 300);
                                    mo = Util.findFromArray("id", model.moId, $scope.roleDailog.moTree.data);
                                }
                                $scope.roleDailog.moName = mo.displayName;
                                $scope.roleDailog.mocName = mo.mocDisplayName;
                                $scope.getMocFlag = true;
                            }
                        }, true);
                        $scope.roleDailog.show();
                    },600);
                },
                active: function (active,id) {
                    var ids=[];
                    if(id){ids.push(id)}
                    else ids=$scope.listPage.checkedList;
                    if(ids==null || ids.length==0){
                        $rootScope.$alert("请选择需要操作的记录");
                        return;
                    }
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    Event.activeRule({ids:ids,active:active},{},function(data){
                        $scope.listPage.settings.reload();
                    });
                },
                remove: function (id) {
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Event.removeRule({ids:[model.id]},function(data){
                            $rootScope.$alert("删除成功");
                            $scope.listPage.settings.reload();
                        },function(error){
                            $rootScope.$alert("删除失败");
                        });
                    },"删除");
                },
                removeAll: function () {
                    var ids=$scope.listPage.checkedList;
                    if(ids==null || ids.length==0){
                        $rootScope.$alert("请选择需要删除的记录");
                        return;
                    }
                    for(var i=0;i<ids.length;i++){
                        var id=ids[i];
                        var model=Util.findFromArray("id",id,$scope.listPage.data);
                        if(model.flag){
                            $rootScope.$alert("不能删除系统初始化的记录");
                            return;
                        }
                    }
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Event.removeRule({ids:ids},function(data){
                            $rootScope.$alert("删除成功");
                            $scope.listPage.settings.reload();
                        });
                    },"删除");
                },
                down:function(active,id){
                    window.open(api_path+"/log/download?query="+"query"+"&beginTime"+"beginTime"+"&endTime"+"endTime");
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Event.queryRule($scope.searchPage.data,function(data){
                        Loading.hide();
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                    },function(error){
                        Loading.hide();
                        $rootScope.$alert("查询规则失败！");
                    });
                }
            }
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
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"mocId",
                    mRender:function(mData,type,full) {
                        var moc=Util.findFromArray("id",mData,$scope.searchPage.mocs);
                        return moc?moc.displayName:"";
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full['moName']);
                    }
                },
                {
                    sTitle: "事件等级",
                    mData:"level",
                    mRender:function(mData,type,full) {
                        return Util.findFromArray("value",mData,Const.levels)["label"];
                    }
//                    mRender:function(mData,type,full) {
//                        return $scope.levelMap[mData];
//                    }
                },
                {
                    sTitle: "检测间隔",
                    mData:"interval",
                    mRender:function(mData,type,full) {
                        return $scope.intervals[mData+''];
                    }
                },
                {
                    sTitle: "状态",
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
                    sTitle: "更新时间",
                    mData:"updated",
                    mRender:function(mData,type,full) {
                        if(mData){
                            var t=mData;
                            var d=new Date(t);
                            return d.pattern("yyyy-MM-dd HH:mm:ss");
                        }else return "";
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i title="编辑" ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" ng-click="listPage.action.edit(\'' + mData + '\')"> </i>' +
                            '<i title="停用" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="listPage.action.active('+(full.active?'false':'true')+',\''+mData+'\')"></i>' +
                            '<i title="删除" ng-disabled="loginUserMenuMap[currentView]" class="fa fa-trash-o" ng-click="listPage.action.remove(\'' + mData + '\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,8 ] },  //第0、9列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "90px", aTargets: [8] }
            ] , //定义列的约束
            defaultOrderBy : []
        };
        $scope.$watch("listPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.listPage.checkedList = Util.copyArray("id",$scope.listPage.data);
            }else{
                if($scope.listPage.data.length == $scope.listPage.checkedList.length){
                    $scope.listPage.checkedList = [];
                }
            }
        },false);
        $scope.funcFilter = function(e){
            return (e.name == "host" || e.name == "network") ;
        };
        $scope.$watch("listPage.checkedList",function(newVal,oldVal){
            $scope.listPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.listPage.data.length;
        },true);
        $scope.getMoc = function(){
                MoClient.query({mocId:$scope.roleDailog.model.mocId,orderBy:"displayName"},function(data){
                    var rows=data.rows;
                    if($scope.roleDailog.model.moId){
                        for(var i=0;i<rows.length;i++){
                            if(rows[i].id==$scope.roleDailog.model.moId){
                                rows[i].checked=true;
                                break;
                            }
                        }
                    }
                    $scope.roleDailog.moTree.data=rows;
                });

        };
        $scope.$watch("roleDailog.model.mocId",function(newVal, oldVal){
            if(! $scope.getMocFlag&& $scope.getMocFlag != undefined) return;
            if(oldVal!=newVal && Util.notNull(newVal)) {
                MoClient.query({mocId:$scope.roleDailog.model.mocId,orderBy:"displayName"},function(data){
                    var rows=data.rows;
                    if($scope.roleDailog.model.moId){
                        for(var i=0;i<rows.length;i++){
                            if(rows[i].id==$scope.roleDailog.model.moId){
                                rows[i].checked=true;
                                break;
                            }
                        }
                    }
                    $scope.roleDailog.moTree.data=rows;
                });
            }
        },false);

        $rootScope.$watch("history.mocTree.length",function(n){
            if(n>0){
                for(var i=0;i<$rootScope.history.mocTree.length;i++){
                    var mocs=$rootScope.history.mocTree[i].children;
                    for(var j=0;j<mocs.length;j++){
                        $scope.searchPage.mocs.push(mocs[j]);
                    }
                }
            }
        },true);

    }]);
    event.controller('eventCtrl',['$scope','$rootScope','Util','Tools','EventService','MoClient','alarm.DataLoader','Loading','event.Const',function($scope,$rootScope,Util,Tools,Event,MoClient,Alarm,Loading,Const){
        $scope.levels=[{name:"1",value:"低"},{name:"2",value:"中"},{name:"3",value:"高"}];
        $scope.levelMap={"1":"低","2":"中","3":"高"};
        $scope.funcFilter = function(e){
            return (e.name == "host" || e.name == "network") ;
        }
        $scope.searchPage = {
            data : {
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                starttime:"",
                endtime:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            mocs:[],
            action:{
                search : function(){
                    Loading.show();
                    $scope.listPage.settings.reload();
                    Loading.hide();
                }
            }
        };
        $rootScope.$watch("history.mocTree.length",function(n){
            if(n>0){
                for(var i=0;i<$rootScope.history.mocTree.length;i++){
                    var mocs=$rootScope.history.mocTree[i].children;
                    for(var j=0;j<mocs.length;j++){
                        $scope.searchPage.mocs.push(mocs[j]);
                    }
                }
            }
        },true);
        $scope.listPage = {
            data:[],
            action : {
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Event.queryEvent($scope.searchPage.data,function(data){
                        Loading.hide();
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                    });
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "事件内容",
                    mData:"content",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "规则名称",
                    mData:"rule.name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"rule.mocId",
                    mRender:function(mData,type,full) {
                        var moc=Util.findFromArray("id",mData,$scope.searchPage.mocs);
                        return moc?moc.displayName:"";
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"rule.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.rule.moName);
                    }
                },
                {
                    sTitle: "事件等级",
                    mData:"level",
                    mRender:function(mData,type,full) {
                        return Util.findFromArray("value",mData,Const.levels)["label"];
                    }
//                    mRender:function(mData,type,full) {
//                        return $scope.levelMap[mData];
//                    }
                },
                {
                    sTitle: "生成时间",
                    mData:"created",
                    mRender:function(mData,type,full) {
                        if(mData){
                            var t=mData;
                            var d=new Date(t);
                            return d.pattern("yyyy-MM-dd HH:mm:ss");
                        }else return "";
                }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ ] }  //第0、9列不可排序
            ] , //定义列的约束
            defaultOrderBy : []
        };
    }]);
}(angular));
