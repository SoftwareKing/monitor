(function(angular){
    'use strict';
    var api_path="../dmonitor-webapi";
    var event = angular.module('alarm.group',['ngResource']);

    event.factory('AlarmGroupService',['$resource',function(resource){
        return resource("",{},{
            alarmTree:{method:"GET",url:api_path+"/alarm/alarmGroupTree",isArray:true},
            addRule:{method:'PUT',url:api_path+"/alarm/groupRule",isArray:false},
            editRule:{method:'POST',url:api_path+"/alarm/groupRule",isArray:false},
            activeRule:{method:'POST',url:api_path+"/alarm/groupRule/active",isArray:false},
            removeRule:{method:'DELETE',url:api_path+"/alarm/groupRule",isArray:false},
            queryRule:{method:'GET',url:api_path+"/alarm/groupRule",isArray:false},
            queryEvent:{method:'GET',url:api_path+"/alarm/groupAlarm",isArray:false},
            queryLocation:{method:"GET",url:api_path+"/resource/location",isArray:true}
        });
    }]);

    event.controller('groupRoleCtrl',['$scope','$rootScope','Util','Tools','AlarmGroupService','MoClient','alarm.DataLoader','Loading','OperateService',function($scope,$rootScope,Util,Tools,Event,MoClient,Alarm,Loading,Operate){
        $scope.searchPage = {
            data : {
                mocpId:"",
                mocId:"",
                starttime:"",
                endtime:"",
                name:"",
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
            ruleTree:{
                treeId: 'ruleTree',
                data:[],
                settingData:{key:{name:"displayName"}},returnData:[],checked:"",checkbox: "all_checkbox",
                onCheck:function(nodes){
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.alarmRuleTree.treeId);
                    var rows = treeObj.getCheckedNodes(true);
                    for(var i=0;i<rows.length;i++){
                        var node=Util.findFromArray("id",rows[i].id,nodes);
                        if(node ==null || node.checked==false){
                            treeObj.checkNode(rows[i], false, false);
                        }
                    }
                    var rtreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.ruleTree.treeId);
                    var ns =rtreeObj.transformToArray(rtreeObj.getNodes());
                    for(var i=0;i<ns.length;i++){
                        var node=Util.findFromArray("id",ns[i].id,nodes);
                        if(node==null){
                            rtreeObj.removeNode(ns[i]);
                        }
                    }
                    $scope.roleDailog.synNodes();
                }
            },
            alarmRuleTree:{
                treeId: 'alarmRuleTree',
                data:[],
                settingData:{key:{name:"displayName"}},returnData:[],checked:"",checkbox: "all_checkbox",
                onCheck:function(nodes,st){
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.ruleTree.treeId);
                    for(var i=0;i<nodes.length;i++){
                        var node = treeObj.getNodeByParam("id", nodes[i].id, null);
                        if(node ==null || node.id==null){
                            treeObj.addNodes(null, {displayName:nodes[i].displayName,id:nodes[i].id,checked:true});
                        }
                    }
                    var rows = treeObj.transformToArray(treeObj.getNodes());
                    for(var i=0;i<rows.length;i++){
                        var node=Util.findFromArray("id",rows[i].id,nodes);
                        if(node ==null || node.checked==false){
                            treeObj.removeNode(rows[i]);
                        }
                    }
                    if(st==null)
                        $scope.roleDailog.synNodes();
                },
                onExpand:function(node){
                    if(node.isParent && node.children.length==0){
                        var ruleTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.ruleTree.treeId);
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.alarmRuleTree.treeId);
                        Alarm.getRulesByLocation({offset:0,mocId:node.id,orderBy:"displayName",orderByType:"ASC",moLocation:node.getParentNode().getParentNode().id},function(data){
                            var rows =data.rows;
                            if(rows.length>0){
                                for(var j=0;j<rows.length;j++){
                                    var sampleInterval = rows[j].sampleInterval<3600?(rows[j].sampleInterval/60+"分钟"):(rows[j].sampleInterval/3600+"小时");
                                    var newNode = {displayName:rows[j].displayName+" ["+rows[j].id+"]("+sampleInterval+")",id:rows[j].id};
                                    if($scope.roleDailog.data.rule){
                                        if($scope.roleDailog.data.rule.indexOf("["+newNode.id+"]")>-1)
                                            newNode.checked=true;
                                    }
                                    treeObj.addNodes(node, newNode);
                                    if(newNode.checked){
                                        ruleTreeObj.addNodes(null, angular.copy(newNode));
                                    }
                                }
                            }
                        });
                    }
                }
            },
            initRuleTree:function(){
                $scope.roleDailog.userTree.init();
                $rootScope.$watch("resource.moc.length",function(n){
                    if(n && n>0 && $scope.roleDailog.alarmRuleTree.data.length==0){
                        Event.queryLocation({}, function (data) {
                            var locations = new Array();
                            var location;
                            for (var z = 0; z < data[0].children.length; z++) {
                                location = new Object();
                                location.id = data[0].children[z].id;
                                location.displayName = data[0].children[z].name;
                                location.pid = 0;
                                location.nocheck = true;
                                location.isParent = true;
                                location.mocId = data[0].children[z].id;
                                var array = angular.copy($rootScope.resource.moc);
                                for (var i = 0; i < array.length; i++) {
                                    array[i].nocheck = true;
                                    array[i].isParent = true;
                                    array[i].mocId = array[i].id + "" + location.id;
                                    var rows = array[i].children;
                                    if (rows && rows.length > 0) {
                                        for (var j = 0; j < rows.length; j++) {
                                            rows[j].nocheck = true;
                                            rows[j].isParent = true;
                                            rows[j].mocId = rows[j].id + "" + location.id;
                                            rows[j].isMoc = true;
                                        }
                                    }
                                }
                                location.children = array;
                                locations.push(location);
                            }
                            $scope.roleDailog.alarmRuleTree.data = locations;

                        });
                    }
                },true);
            },
            synNodes:function(){
                var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.ruleTree.treeId);
                var rows = treeObj.getCheckedNodes(true);
                $scope.roleDailog.model.rule="";
                for(var i=0;i<rows.length;i++){
                    var id="["+rows[i].id+"]";
                    var rule=$scope.roleDailog.model.rule;
                    if(rule.indexOf(id)==-1){
                        if(rule.length==0){
                            $scope.roleDailog.model.rule=" " + id;
                        }else{
                            $scope.roleDailog.model.rule=rule+" && "+id;
                        }
                    }
                }
                $scope.$apply();
            },
            save:function(){
                var mocIds=";";
                if(angular.element("#active").attr("checked")) $scope.roleDailog.model.active=true;
                else $scope.roleDailog.model.active=false;
                var s=new RegExp("\\[(.| )+?\\]","igm");
                var ids=$scope.roleDailog.model.rule.match(s);
                var node;
                if(ids.length<2 || ids.length>5){
                    $scope.roleDailog.data.ruleCheck="选中的告警规则应为2至5条";
                    return;
                }
                for(var i=0;i<ids.length;i++){
                    var id=ids[i];
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.ruleTree.treeId);
                    node = treeObj.getNodeByParam("id",id.substring(1,id.length-1), null);
                    if(node==null ){
                        $scope.roleDailog.data.ruleCheck="表达式中的规则ID在已选的规则中不存在";
                        return;
                    }
                }
                var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.alarmRuleTree.treeId);
                var nodes=treeObj.getCheckedNodes(true);
                for(var i=0;i<nodes.length;i++){
                    var node=nodes[i].getParentNode();
                    if(mocIds.indexOf(";"+node.mocId+";")==-1)mocIds+=node.mocId+";";
                    if(mocIds.indexOf(";"+node.getParentNode().mocId+";")==-1)mocIds+=node.getParentNode().mocId+";";
                    if(mocIds.indexOf(";"+node.getParentNode().getParentNode().mocId+";")==-1)mocIds+=node.getParentNode().getParentNode().mocId+";";
                }
                $scope.roleDailog.model.mocIds=mocIds;

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
                Loading.show();
                if($scope.roleDailog.model.id){
                    Event.editRule($scope.roleDailog.model,function(data){
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else{
                    Event.addRule($scope.roleDailog.model,function(data){
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        });

        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                add: function () {
                    $scope.roleDailog.title="新增";
                    $scope.roleDailog.model={active:true,rule:"",level:4,name:null,remark:null};
                    angular.element("#active").attr("checked",true);
                    $scope.roleDailog.model.content=" 组合告警触发 [规则名称] 规则，当前满足 [规则表达式]";
                    $scope.roleDailog.model.recoveryContent=" 组合告警恢复，[规则名称] 规则，当前不满足 [规则表达式]";
                    $scope.roleDailog.data.moId=null;
                    $scope.roleDailog.data.rule=null;
                    $scope.roleDailog.data.threshold=null;
                    $scope.roleDailog.data.notifyMethod=[];
                    var userTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.userTree.treeId);
                    userTree.checkAllNodes(false);
                    var alarmRuleTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.alarmRuleTree.treeId);
                    alarmRuleTree.checkAllNodes(false);
                    $scope.roleDailog.alarmRuleTree.onCheck([],1);
                    $scope.roleDailog.show();
                },
                edit: function (id) {
                    $scope.roleDailog.title="编辑";
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $scope.roleDailog.model=angular.copy(model);
                    $scope.roleDailog.model.content=" " + model.content;
                    $scope.roleDailog.model.recoveryContent=" " + model.recoveryContent;
                    $scope.roleDailog.model.rule = " " + model.rule;
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
                    if(model.mocIds){
                        $scope.roleDailog.data.rule=$scope.roleDailog.model.rule;
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.alarmRuleTree.treeId);
                        var ruleTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.ruleTree.treeId);
                        var ruleNodes=ruleTreeObj.getCheckedNodes(true);
                        for(var i=0;i<ruleNodes.length;i++){
                            ruleTreeObj.removeNode(ruleNodes[i]);
                        }
                        var mocIds=model.mocIds.substring(1,model.mocIds.length-1);
                        var ids=mocIds.split(";");
                        for(var i=0;i<ids.length;i++){
                            filterId = ids[i];
                            var node = treeObj.getNodesByFilter(filter, true);
                            //var node = treeObj.getNodeByParam("id",ids[i], null);
                            if(null != node && node.isParent && node.children.length==0){
                                $scope.roleDailog.alarmRuleTree.onExpand(node);
                            }
                            else if(null != node && node.isParent && node.getParentNode() && node.isMoc == true && node.children.length>0){
                                var rows=node.children;
                                for(var j=0;j<rows.length;j++){
                                    if($scope.roleDailog.model.rule.indexOf("["+rows[j].id+"]")>-1)
                                    {
                                        treeObj.checkNode(rows[j],true,false);
                                        if(ruleTreeObj.getNodeByParam("id",rows[j].id, null)==null)
                                            ruleTreeObj.addNodes(null, {displayName:rows[j].displayName,id:rows[j].id,checked:true});
                                    }
                                }
                            }



                        }
                    }
                    $scope.roleDailog.show();
                    var filterId;
                    function filter(node) {
                        return (node.mocId == filterId);
                    }
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
                        });
                    },'删除');
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
                    },'删除');
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Event.queryRule($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
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
                    sTitle: "告警等级",
                    mData:"level",
                    mRender:function(mData,type,full) {
                        return Util.findFromArray("value",mData,$rootScope.alarm.const.levels)["label"];
                    }
                },
                {
                    sTitle: "状态",
                    mData:"active",
                    mRender:function(mData,type,full) {
                        if(mData)
                            return "<span style='color:green'>启用</span>";
                        else return "<span style='color:red'>停用</span>";
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
                            '<i title="'+(full.active?'停用':'启用')+'" ng-disabled="loginUserMenuMap[currentView]" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="listPage.action.active('+(full.active?'false':'true')+',\''+mData+'\')"></i>' +
                            '<i title="删除" ng-disabled="loginUserMenuMap[currentView]" class="fa fa-trash-o" ng-click="listPage.action.remove(\'' + mData + '\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,5 ] },  //第0、9列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "90px", aTargets: [ 2 ] },
                { sWidth: "100px", aTargets: [ 5] }
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

        $scope.$watch("listPage.checkedList",function(newVal,oldVal){
            $scope.listPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.listPage.data.length;
        },true);

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

        $scope.$watch("roleDailog.model.rule",function(newVal, oldVal){
            if(Util.notNull(newVal)) {
                try{
                    var a=newVal;
                    if(newVal.indexOf("[]")>-1){
                        $scope.roleDailog.data.ruleCheck="表达式格式错误";
                        return;
                    }
                    var g=new RegExp("\\[.*?]", "g");
                    a=a.replace(g, "true");
                    eval(a)
                    $scope.roleDailog.data.ruleCheck="";
                }catch (e){
                    $scope.roleDailog.data.ruleCheck="表达式格式错误";
                }
            }else $scope.roleDailog.data.ruleCheck="表达式格式错误";
        },false);

        $scope.roleDailog.initRuleTree();
    }]);
    event.controller('groupAlarmCtrl',['$scope','$rootScope','Util','Tools','AlarmGroupService','MoClient','alarm.DataLoader','$location','$timeout',function($scope,$rootScope,Util,Tools,Event,MoClient,Alarm,$location,$timeout){
        $scope.type=0;
        $scope.searchPage = {
            data : {
                type:$scope.type,
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                }
            },
            initTree:function(){
                Event.alarmTree(function(data){
                    $scope.mocTree.data=data;
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        if( treeObj.getSelectedNodes().length==0)
                            treeObj.selectNode(treeObj.getNodes()[0]);
                    },1000);
                });
            }
        };
        $scope.mocTree={
            data:[],
            checked:"",
            crossParent:"true",
            treeId: 'smocTree',
            checkType: { "Y" : "", "N" : "" },
            checkbox:null,
            treeClick:function(node){
                if(node.isParent)return;
                $scope.type=node.type;
                $scope.searchPage.data.type=node.type;
                $scope.searchPage.data.mocpId=node.id;
                $scope.$apply();
                $scope.searchPage.action.search();
            }
        };
        $scope.searchPage.initTree();
        $scope.listPage = {
            data:[],
            action : {
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Event.queryEvent($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                    });
                    $scope.searchPage.initTree();
                }
            }
        };

        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "规则名称",
                    mData:"rule.name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
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
                    sTitle: "告警内容",
                    mData:"content",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "告警时间",
                    mData:"created",
                    mRender:function(mData,type,full) {
                        if(mData){
                            var t=mData;
                            var d=new Date(t);
                            return d.pattern("yyyy-MM-dd HH:mm:ss");
                        }else return "";
                    }
                },
                {
                    sTitle: "恢复内容",
                    mData:"recoveryContent",
                    mRender:function(mData,type,full) {
                        if(mData)
                            return "<span ng-show='type==1' title='"+mData+"'>"+mData+"</span>";
                        else
                            return "";
                    }
                },
                {
                    sTitle: "恢复时间",
                    mData:"recovery",
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
                { bSortable: false, aTargets: [ ] },
                { sWidth: "90px", aTargets: [ 1 ] } //第0、9列不可排序
            ] , //定义列的约束
            defaultOrderBy : []
        };

    }]);
}(angular));
