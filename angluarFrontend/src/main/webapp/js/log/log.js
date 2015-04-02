(function(angular){
    'use strict';
    var api_path="../dmonitor-webapi";
    var event = angular.module('logApp',['ngRoute','ngResource']);
    event.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/logRule', {templateUrl: 'views/log/log_rule.html'});
        $routeProvider.when('/logs', {templateUrl: 'views/log/log.html'});
    }]);
    event.directive('ngBlur', function($parse){
        return function(scope, element, attr){
            var fn = $parse(attr['ngBlur']);
            angular.element(element).on('focusout', function(event){
                fn(scope, {$event: event});
            });
        }
    });
    event.directive('ngFouce', function($parse){
        return function(scope, element, attr){
            var fn = $parse(attr['ngFouce']);
            angular.element(element).on('focusin', function(event){
                fn(scope, {$event: event});
            });
        }
    });
    event.factory('LogService',['$resource',function(resource){
        return resource("",{},{
            addRule:{method:'PUT',url:api_path+"/log/logRule",isArray:false},
            editRule:{method:'POST',url:api_path+"/log/logRule",isArray:false},
            removeRule:{method:'DELETE',url:api_path+"/log/logRule",isArray:false},
            queryRule:{method:'GET',url:api_path+"/log/logRule",isArray:false},
            queryRuleById:{method:'GET',url:api_path+"/log/logRule/id",isArray:false},
            queryFacets:{method:'GET',url:api_path+"/log/logsFacet",isArray:true},
            queryGroup:{method:'GET',url:api_path+"/log/group",isArray:true},
            queryEvent:{method:'GET',url:api_path+"/log/logs",isArray:false}
        });
    }]);
    event.controller('logRuleCtrl',['$scope','$rootScope','Util','Tools','LogService','MoClient','Loading','$timeout','$location',function($scope,$rootScope,Util,Tools,Event,MoClient,Loading,$timeout,$location){
        $scope.searchPage = {
            data : {
                beginh:"00",
                beginm:"00",
                endh:"23",
                endm:"59",
                mocpId:"",
                mocId:"",
                name:"",
                limit : 20, //每页条数(即取多少条数据)
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
                        $scope.roleDailog.model.mocId=nodes[0].id;
                        $scope.roleDailog.model.mocpId=nodes[0].getParentNode().id;
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
            initRuleTree:function(){
                $rootScope.$watch("resource.moc.length",function(n){
                    if(n && n>0 && $scope.roleDailog.mocTree.data.length==0){
                        var data=angular.copy($rootScope.resource.moc);
                        for(var i=0;i<data.length;i++){
                            data[i].nocheck=true;
                        }
                        $scope.roleDailog.mocTree.data=data;
                    }
                },true);
            },
            save:function(){
                var start=$scope.searchPage.data.beginh+$scope.searchPage.data.beginm;
                var end=$scope.searchPage.data.endh+$scope.searchPage.data.endm;
                if(Date.parse(end)<Date.parse(start)){
                    $rootScope.$alert("结束时间应大于开始时间");
                    return;
                }
                $scope.roleDailog.model.beginTime=$scope.searchPage.data.beginh+":"+$scope.searchPage.data.beginm;
                $scope.roleDailog.model.endTime=$scope.searchPage.data.endh+":"+$scope.searchPage.data.endm;
                if($scope.roleDailog.model.id){
                    Event.editRule($scope.roleDailog.model,function(data){
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                    });
                }else{
                    Event.addRule($scope.roleDailog.model,function(data){
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                    });
                }
            }
        });

        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                add2: function () {
                    location.href="#/logs?t=1";
                },
                down:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    var obj =eval(model.query);
                    var query = obj[0].query;
                    query = query.replace("+","%2B");
                    var beginTime = obj[0].begin;
                    var endTime  = obj[0].end;
                    window.open(api_path+"/log/download?query="+query+"&beginTime="+beginTime+"&endTime="+endTime);
                },
                add: function () {
                    $scope.roleDailog.title="新增";
                    $scope.roleDailog.model={name:null};
                    $scope.searchPage.data.beginh="00";
                    $scope.searchPage.data.beginm="00";
                    $scope.searchPage.data.endh="23"
                    $scope.searchPage.data.endm="59"
                    var mocTree = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.mocTree.treeId);
                    var nodes=mocTree.getCheckedNodes(true);
                    for(var i=0;i<nodes.length;i++){
                        mocTree.checkNode(nodes[i],false,false);
                    }
                    $scope.roleDailog.moTree.data=[];
                    $scope.roleDailog.show();
                    $timeout(function(){
                        angular.element("#beginh").find("option[value='"+$scope.searchPage.data.beginh+"']").attr("selected","selected");
                        angular.element("#beginm").find("option[value='"+$scope.searchPage.data.beginm+"']").attr("selected","selected");
                        angular.element("#endh").find("option[value='"+$scope.searchPage.data.endh+"']").attr("selected","selected");
                        angular.element("#endm").find("option[value='"+$scope.searchPage.data.endm+"']").attr("selected","selected");
                    },50);
                },
                edit: function (id) {
                    $scope.roleDailog.title="编辑";
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $scope.roleDailog.model=angular.copy(model);
                    var begin=model.beginTime.split(":");
                    $scope.searchPage.data.beginh=begin[0];
                    $scope.searchPage.data.beginm=begin[1];
                    var end=model.endTime.split(":");
                    $scope.searchPage.data.endh=end[0];
                    $scope.searchPage.data.endm=end[1];
                    var mocTreeObj = angular.element.fn.zTree.getZTreeObj("mocTree");
                    var node = mocTreeObj.getNodeByParam("id",$scope.roleDailog.model.mocId, null);
                    mocTreeObj.checkNode(node,true,true);
                    mocTreeObj.expandNode(node.getParentNode(),true,true,false);
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                    node = treeObj.getNodeByParam("id",$scope.roleDailog.model.moId, null);
                    if(node)treeObj.checkNode(node,true,true);
                    $scope.roleDailog.show();
                    $timeout(function(){
                        angular.element("#beginh").find("option[value='"+$scope.searchPage.data.beginh+"']").attr("selected","selected");
                        angular.element("#beginm").find("option[value='"+$scope.searchPage.data.beginm+"']").attr("selected","selected");
                        angular.element("#endh").find("option[value='"+$scope.searchPage.data.endh+"']").attr("selected","selected");
                        angular.element("#endm").find("option[value='"+$scope.searchPage.data.endm+"']").attr("selected","selected");
                    },50);
                },
                active: function (id) {
                    location.href="./index.html#/logs?id="+id;
                },
                remove: function (id) {
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Event.removeRule({ids:[model.id]},function(data){
                            $rootScope.$alert("删除成功");
                            $scope.listPage.settings.reload();
                        },function(error){
                            $rootScope.$alert("删除失败");
                            $scope.listPage.settings.reload(true);
                        });
                    },"删除");
                },
                removeAll: function () {
                    var ids=$scope.listPage.checkedList;
                    if(ids==null || ids.length==0){
                        $rootScope.$alert("请选择需要删除的记录");
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
                    sTitle: "视图类型",
                    mData:"type",
                    mRender:function(mData,type,full) {
                        if(mData){
                            return "对比视图";
                        }else return "搜索视图";
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
                        return '<i title="删除" ng-disabled="loginUserMenuMap[currentView]" class="fa fa-trash-o" ng-click="listPage.action.remove(\'' + mData + '\')"></i>'+
                                '<i title="下载" class="'+('fa fa-download')+'" ng-click="listPage.action.down(\''+mData+'\')"></i>' +
                                '<i title="查看数据" class="fa fa-search" ng-click="listPage.action.active(\'' + mData + '\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,4 ] },  //第0、9列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "110px", aTargets: [ 4] }
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
    }]);
    event.controller('logCtrl',['$scope','$rootScope','Util','Tools','LogService','MoClient','$location','Loading','$timeout',function($scope,$rootScope,Util,Tools,Event,MoClient,$location,Loading,$timeout){
        var d=new Date();
        var today=d.pattern("yyyy-MM-dd");
        var min=new Date();
        min.setDate(min.getDate() - 7); // 系统会自动转换
        $scope.minDate=min.pattern("yyyy-MM-dd");
        $scope.searchPageHidden=false;
        var ckIndex=0;
        $scope.addDiv={
            checked:[0],
            begin:today+" 00:00",
            end:today+" 23:59",
            groupBy:"logsource",
            style:"",
            edit:false,
            show:false,
            columns:["host","logsource","severity","type","severity_label","@version","message","facility","priority","program","facility_label"] ,
            models:[{t1:"+",t2:"host",begin:"",end:"",id:0}],
            modelsBak:[{t1:"+",t2:"host",begin:"",end:"",id:0}],

            delete:function(index){
                var id=$scope.addDiv.models[index].id;
                for(var i=0;i<$scope.addDiv.checked.length;i++){
                    if($scope.addDiv.checked[i]==id){
                        $scope.addDiv.checked.splice(i,1);
                        break;
                    }
                }
                $scope.addDiv.models.splice(index,1);
            },
            cancel:function(index){
                $scope.addDiv.show =false;
                $scope.addDiv.models =  $scope.addDiv.modelsBak;

            },
            next:function(index){
                var i=$scope.addDiv.models.length;
                if(i >20){
                    $rootScope.$alert("字段个数超过最大值限制！");return;
                }
                if(i>=$scope.addDiv.columns.length) i=0;
                $scope.addDiv.models.push({t1:"+",t2:$scope.addDiv.columns[i],t3:"",id:++ckIndex,checked:true});
                $scope.addDiv.checked.push(ckIndex);
                $timeout(function(){
                    angular.element("#t"+($scope.addDiv.models.length-1)).find("option[value='"+$scope.addDiv.columns[i]+"']").attr("selected","selected");
                },100);
            },
            add:function(i){
                if(i!=null){
                    $scope.addDiv.index=i;
                    $scope.addDiv.edit=true;
                    var model=$scope.searchPage.rules[i];
                    $scope.addDiv.begin=model.begin;
                    $scope.addDiv.end=model.end;
                    $scope.addDiv.models=model.models;

                    $timeout(function(){
                        angular.element("#t"+i).find("option[value='"+$scope.addDiv.models.t2+"']").attr("selected","selected");
                    },100);
                }else {
                    $scope.addDiv.edit=false;
                    $scope.addDiv.models=[{t1:"+",t2:"host",begin:"",end:"",id:0,checked:true}];
                }
                $scope.addDiv.show=true;
            },
            save:function(){
                var query="";
                for(var i=0;i<$scope.addDiv.models.length;i++){
                    var model=$scope.addDiv.models[i];
                    if(model.checked && model.t3){
                        if(i==0)
                            query+="+"+model.t2+":"+model.t3;
                        else
                            query+=" "+$scope.addDiv.models[i].t1+model.t2+":"+model.t3;
                    }
                }
                if(query.length==0){
                    $rootScope.$alert("表达式有误");
                    return;
                }
                var rule;
                if($scope.addDiv.edit){
                    rule=$scope.searchPage.rules[$scope.addDiv.index];
                }else {
                    rule={checked:true};
                    $scope.searchPage.rules.push(rule);
                }
                rule.begin=$scope.addDiv.begin;
                rule.end=$scope.addDiv.end;
                if(Date.parse($scope.addDiv.end) < Date.parse($scope.addDiv.begin)){
                    $rootScope.$alert("日期范围错误");
                    return;
                }
                if(Date.parse($scope.addDiv.end) - Date.parse($scope.addDiv.begin) >7*24*3600*1000){
                    $rootScope.$alert("日期范围不能超过一周");
                    return;
                }
                rule.query=query;
                rule.models=$scope.addDiv.models;
                rule.field="@timestamp";
                $scope.searchPage.data = { begin:today+" 00:00",
                    end:today+" 23:59",
                    ip:"",
                    field:"@timestamp",
                    facetValue:"1",
                    facetType:"h",
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "@timestamp",//排序字段
                    orderByType : "asc" //排序顺序
                    ,total:0
                    ,pages:[]
                    ,columns:[]
                    ,page:1
                    ,pageTotal:1};
                $scope.listPage.head = [];
                $scope.listPage.body = [];
                $scope.addDiv.show=false;
            }
        };
        Highcharts.setOptions({
            global: {useUTC: false}
        });
        $scope.searchPage = {
            show:false,
            detailShow:false,
            LogdetailShow:false,
            LogdetailIndex:-10,
            checkAllRow:false,
            type:0,
            mocs:[],
            rules:[],
            data : {
                begin:today+" 00:00",
                end:today+" 23:59",
                ip:"",
                field:"@timestamp",
                facetValue:"1",
                facetType:"h",
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "@timestamp",//排序字段
                orderByType : "asc" //排序顺序
                ,total:0
                ,pages:[]
                ,columns:[]
                ,page:1
                ,pageTotal:1
            },
            action:{
                back:function(){
                    $location.path("/logRule");
                },
                add:function(){
                    if($scope.searchPage.rules.length == 0){
                        $rootScope.$alert("请添加规则");return;
                    }
                    if($scope.ruleId==null)$scope.roleDailog.model.name="";
                    $scope.roleDailog.show();
                },
                remove:function(index){
//                    $scope.searchPage.detailShow = false;
                    if($scope.searchPage.LogdetailIndex == index){
                        $scope.searchPage.LogdetailShow =false;
                        $scope.listPage.head = [];
                        $scope.listPage.body = [];
                    }
                    if(-1 == index){
                        var temp = [];
                        var num = 0;
                        for(var i=0;i<$scope.searchPage.rules.length;i++){
                            var data=$scope.searchPage.rules[i];
                            if(data.checked)continue;
                            temp[num]=data;
                            num++;
                        }
                        $scope.searchPage.rules = temp;
                        return;
                    }
                    if(index == undefined){
                        $scope.searchPage.rules = [];
                        return;
                    }
                    $scope.searchPage.rules.splice(index,1);
                    $scope.searchPage.data = { begin:today+" 00:00",
                        end:today+" 23:59",
                        ip:"",
                        field:"@timestamp",
                        facetValue:"1",
                        facetType:"h",
                        limit : 20, //每页条数(即取多少条数据)
                        offset : 0 , //从第几条数据开始取
                        orderBy : "@timestamp",//排序字段
                        orderByType : "asc" //排序顺序
                        ,total:0
                        ,pages:[]
                        ,columns:[]
                        ,page:1
                        ,pageTotal:1};

                },
                search2:function(){
                    for(var i=0;i<$scope.searchPage.rules.length;i++){
                        var data=$scope.searchPage.rules[i];
                        if(!data.checked)continue;
                        var n=new Date();
                        var begin=data.begin.substring(0,10);
                        var end=data.end.substring(0,10);
                        if(parseInt(begin.replace(/-/g,   ""))>parseInt(end.replace(/-/g,   ""))){
                            var temp=data.begin;
                            data.begin=data.end;
                            data.end=temp;
                        }
                        data.beginTime=data.begin+":00";
                        data.endTime=data.end+":00";
                        var begin = new Date(Date.parse(data.beginTime.replace(/-/g,   "/"))).getTime();
                        var end = new Date(Date.parse(data.endTime.replace(/-/g,   "/"))).getTime();
                        if(end> n.getTime())end= n.getTime();
                        if(begin> n.getTime())begin= n.getTime();
                        if(end-begin>1000*60*60*48){
                            data.facetType="h";
                            var h=parseInt((end-begin)/(1000*60*60*48));
                            h=h<=0?1:h;
                            data.facetValue=h;
                        }else if(end-begin>1000*60*60*12 && end-begin<1000*60*60*48){
                            data.facetType="h";
                            data.facetValue="1";
                        }else if(end-begin<1000*60*60*12 && end-begin>1000*60*60*2){
                            data.facetType="m";
                            data.facetValue="30";
                        }else if(end-begin<1000*60*60*2){
                            data.facetType="m";
                            data.facetValue="5";
                        }
                        data.field="@timestamp";
                        data.facet=data.facetValue+data.facetType;
                        $scope.searchPage.chart(data,i);
                    }
                    //$scope.listPage.action.search();
                },
                search3 : function(index){
                    $scope.searchPage.LogdetailIndex = index;
                    $scope.searchPage.LogdetailShow=true;
                    var data=$scope.searchPage.rules[index];
                    var begin=data.begin.substring(0,10);
                    var end=data.end.substring(0,10);
                    if(parseInt(begin.replace(/-/g,   ""))>parseInt(end.replace(/-/g,   ""))){
                        var temp=data.begin;
                        data.begin=data.end;
                        data.end=temp;
                    }
                    $scope.searchPage.data.beginTime=data.begin+":00";
                    $scope.searchPage.data.endTime=data.end+":00";
                    $scope.searchPage.data.offset=0;
                    $scope.searchPage.data.page=1;
                    $scope.searchPage.data.query=data.query;
                    $scope.listPage.action.search();
                    $scope.searchPage.show=true;
                },
                search : function(){
                    var count=0;
                    for(var i=0;i<$scope.searchPage.rules.length;i++){
                        if($scope.searchPage.rules[i].checked)count++;
                    }
                    if(count==0){
                        $rootScope.$alert("请选择条件");
                        return;
                    }
                    $scope.searchPage.detailShow=true;
                    if($scope.searchPage.type==0){
                        $scope.searchPage.action.search2();
                    }else{
                        $scope.searchPage.group();
                    }
                }
            },
            group:function(){
                $scope.groupTable.head=[];
                $scope.groupTable.body=[];
                for(var i=0;i<$scope.searchPage.rules.length;i++){
                    var data=$scope.searchPage.rules[i];
                    if(!data.checked)continue;
                    var begin=data.begin.substring(0,10);
                    var end=data.end.substring(0,10);
                    if(parseInt(begin.replace(/-/g,   ""))>parseInt(end.replace(/-/g,   ""))){
                        var temp=data.begin;
                        data.begin=data.end;
                        data.end=temp;
                    }
                    data.beginTime=data.begin+":00";
                    data.endTime=data.end+":00";
                    data.field=$scope.addDiv.groupBy;
                    var c1=data.begin+"-"+data.end;
                    var ins=true;
                    for(var x=0;x<$scope.groupTable.head.length;x++){
                        if($scope.groupTable.head[x]==c1){
                            ins=false;
                            break;
                        }
                    }
                    if(ins) $scope.groupTable.head.push(c1);
                    $scope.searchPage.queryGroup(data,c1);
                }
            },
            queryGroup:function(data,c1){
                Event.queryGroup(data,function(rows){
                    for(var j=0;j<rows.length;j++){
                        var row=rows[j];
                        var add=true;
                        for(var y=0;y<$scope.groupTable.body.length;y++){
                            var item=$scope.groupTable.body[y];
                            if(row.host==item.host && row[data.field]==item[data.field]){
                                add=false;
                                item[c1]=row.value;
                            }
                        }
                        if(add){
                            row[c1]=row.value;
                            $scope.groupTable.body.push(row);
                        }
                    }
                });
            },
            chart:function(rule,index){
                var begin = new Date(Date.parse(rule.beginTime.replace(/-/g,   "/"))).getTime();
                var end = new Date(Date.parse(rule.endTime.replace(/-/g,   "/"))).getTime();
                Event.queryFacets(rule,function(data){
                    data.push({x:begin,y:null});
                    data.push({x:end,y:null});
                    angular.element('#logChart'+index).highcharts({
                        credits: {
                            text: '',
                            href: ''
                        },
                        chart: {
                            type: 'column',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 10,
                            events: {
                                click: function(e) {
                                    var time=Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', e.xAxis[0].value);
                                    var begin1 = new Date(Date.parse(time.replace(/-/g,   "/"))).getTime();
                                    var rule=$scope.searchPage.rules[index];
                                    var l=0;
                                    if(rule.facetType=="h"){
                                        l=1000*60*60*parseInt(rule.facetValue);
                                    }else{
                                        l=1000*60*parseInt(rule.facetValue);
                                    }
                                    var end1=begin1+l;
                                    var dt1=new Date(begin1);
                                    var dt2=new Date(end1);
                                    $scope.searchPage.data.beginTime=dt1.pattern("yyyy-MM-dd HH:mm:ss");
                                    $scope.searchPage.data.endTime=dt2.pattern("yyyy-MM-dd HH:mm:ss");
                                    $scope.searchPage.data.offset=0;
                                    $scope.searchPage.data.page=1;
                                    $scope.searchPage.data.query=rule.query;
                                    $scope.searchPage.show=true;
                                    $scope.$apply();
                                    $scope.listPage.action.search();
                                }
                            }
                        },
                        title: {text: ''},
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: (angular.element(window).width()-20)/12,
                            dateTimeLabelFormats: {
                                second : '%H:%M',
                                hour : '%H:%M',
                                minute: '%H:%M',
                                day: '%m-%d',
                                week : '%Y-%m-%d',
                                month : '%Y-%m',
                                year : '%Y'
                            }
                        },
                        yAxis: {
                            title: {text: '数量'},
                            plotLines: [{value: 0,width: 1, color: '#808080'}]
                        },
                        tooltip: {
                            formatter: function() {
                                return Highcharts.dateFormat('%m-%d %H:%M', this.x) +'<br/>'+Highcharts.numberFormat(this.y, 2);
                            }
                        },
                        legend: {enabled: false},
                        exporting: {enabled: false},
                        series: [{
                            name: '',
                            data:data
                        }]
                    });
                });
            },
            save:function(){
                var model=
                {
                    id:$scope.ruleId,
                    query:angular.toJson($scope.searchPage.rules),
                    type:$scope.searchPage.type,
                    groupBy:$scope.addDiv.groupBy,
                    name: $scope.roleDailog.model.name
                };
                Event.addRule(model,function(data){
                    if(data[0] == 'f'){
                        $rootScope.$alert("规则名称重复！");
                        return;
                    }
                    $rootScope.$alert("保存成功！");
                });
                $scope.roleDailog.hide();
            },
            init:function(){
                $scope.t=$location.$$search.t;
                var id=$location.$$search.id;
                if(id){
                    $scope.ruleId=id;
                    $scope.searchPageHidden=true;
                    Event.queryRuleById({id:id},function(model){
                        if(model){
                            $scope.roleDailog.model.name=model.name;
                            $scope.searchPage.rules=angular.fromJson(model.query);
                            $scope.searchPage.type=model.type;
                            $scope.addDiv.groupBy=model.groupBy;
                            $timeout(function(){
                                $scope.searchPage.action.search();
                            },1000);
                        }
                    });
                }
                $timeout(function(){
                    angular.element("#beginh").find("option[value='"+$scope.searchPage.data.beginh+"']").attr("selected","selected");
                    angular.element("#beginm").find("option[value='"+$scope.searchPage.data.beginm+"']").attr("selected","selected");
                    angular.element("#endh").find("option[value='"+$scope.searchPage.data.endh+"']").attr("selected","selected");
                    angular.element("#endm").find("option[value='"+$scope.searchPage.data.endm+"']").attr("selected","selected");
                },50);

            }
        };

        $scope.roleDailog=Tools.dialog({
            id:"ruleDialog",
            title:"",
            model:{name:""},
            hiddenButton:true,
            save:function(){
                $scope.searchPage.save();
            }
        });

        $scope.searchPage.init();

        $scope.groupTable={
            head:[],
            body:[]
        };

        $scope.listPage = {
            body:[],
            head:[],
            action : {
                search: function () {
                    var flag = true;
                    Event.queryEvent($scope.searchPage.data,function(data){
                        $scope.listPage.body=[];
                        if(data.total>0){
                            var row=data.rows[0];
                            if(null != row){
                                flag = false;
                                $scope.listPage.head=[];
                                for(var key in row){
                                    if(key=="timestamp" || key=="receivedtime")continue;
                                    $scope.listPage.head.push(key);
                                }
                                if($scope.searchPage.data.columns.length==0 || row['type']!=$scope.searchPage.data.type){
                                    $scope.searchPage.data.type=row['type'];
                                    for(var key in row)$scope.searchPage.data.columns.push(key);
                                }
                                $scope.listPage.body =data.rows;
                            }
                            $scope.listPage.paging(data.total);
                        }
                    });
                    if(flag){
                        Event.queryEvent($scope.searchPage.data,function(data){
                            $scope.listPage.body=[];
                            if(data.total>0){
                                var row=data.rows[0];
                                if(null != row){
                                    flag = false;
                                    $scope.listPage.head=[];
                                    for(var key in row){
                                        if(key=="timestamp" || key=="receivedtime")continue;
                                        $scope.listPage.head.push(key);
                                    }
                                    if($scope.searchPage.data.columns.length==0 || row['type']!=$scope.searchPage.data.type){
                                        $scope.searchPage.data.type=row['type'];
                                        for(var key in row)$scope.searchPage.data.columns.push(key);
                                    }
                                    $scope.listPage.body =data.rows;
                                }
                                $scope.listPage.paging(data.total);
                            }
                        });
                    }
                }
            },
            paging:function(total){
                $scope.searchPage.data.pages=[];
                $scope.searchPage.data.total=total;
                $scope.searchPage.data.pageTotal=total%$scope.searchPage.data.limit==0?total/$scope.searchPage.data.limit:parseInt(total/$scope.searchPage.data.limit)+1;
                var page=$scope.searchPage.data.page;
                for(var i=page;i<page+5;i++){
                    if(i>$scope.searchPage.data.pageTotal)break;
                    $scope.searchPage.data.pages.push(i);
                }
            }
        };

        $scope.changeMoc=function(){
            MoClient.query({mocId:$scope.searchPage.data.mocId},function(data){
                $scope.searchPage.mos=data.rows;
                if($scope.ruleId==null && data.rows.length>0){
                    $scope.searchPage.data.ip=data.rows[0].ip;
                }
                $timeout(function(){
                    angular.element("#ip").find("option[value='"+$scope.searchPage.data.ip+"']").attr("selected","selected");
                },50);
            });
        };
        $scope.$watch("searchPage.type",function(newVal,oldVal){
            $scope.searchPage.detailShow = false;
            $scope.searchPage.LogdetailShow =false;
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

        $scope.$watch("searchPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                for(var i=0;i<$scope.searchPage.rules.length;i++){
                    $scope.searchPage.rules[i].checked=true;
                }
            }else{
                for(var i=0;i<$scope.searchPage.rules.length;i++){
                    $scope.searchPage.rules[i].checked=false;
                }
            }
        },false);

        $scope.$watch("addDiv.groupBy",function(newVal,oldVal){
            if(newVal){
                $scope.groupTable.head = [];
                $scope.groupTable.body = [];
            }
        },false);

    }]);
}(angular));
