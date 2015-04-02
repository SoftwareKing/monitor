(function(angular){
    var api_path="/dmonitor-webapi/";
    var itsm = angular.module('itsm-model',['ngRoute','ngResource']);
    itsm.config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/queryModel',{templateUrl:'views/itsm/model.html',
                controller:'modelController'});
            $routeProvider.when('/queryProcess',{templateUrl:'views/itsm/process.html',
                controller:'dynamicFlowController'});
            $routeProvider.when('/taskList',{templateUrl:'views/itsm/taskList.html',
                controller:'taskListController'});
            $routeProvider.when('/taskInfo',{templateUrl:'views/itsm/taskInfo.html',
                controller:'taskInfoController'});
    }]);
    itsm.factory('ModelService', function($resource){
        return $resource("",{},{
            list:{method: 'GET', url: api_path + "itsm/workflow/model/list", isArray: true},
            create:{method: 'GET', url: api_path + "itsm/workflow/model/create", isArray: false},
            delete:{method: 'GET', url: api_path + "itsm/workflow/model/delete/:modelId", isArray: false},
            deploy:{method: 'GET', url: api_path + "itsm/workflow/model/deploy/:modelId", isArray: false}
        });
    });
    itsm.factory('dynamicFlowService', function($resource){
        return $resource("",{},{
            history:{method: 'GET', url: api_path + "itsm/workflow/dynamic/history", isArray: false},
            processList:{method: 'GET', url: api_path + "itsm/workflow/dynamic/process-list", isArray: false},
            taskList:{method: 'GET', url: api_path + "itsm/workflow/dynamic/task-list", isArray: false},
            claimList:{method: 'GET', url: api_path + "itsm/workflow/dynamic/claim-list", isArray: false},
            runningList:{method: 'GET', url: api_path + "itsm/workflow/dynamic/running-list", isArray: false},
            finishedList:{method: 'GET', url: api_path + "itsm/workflow/dynamic/finished-list", isArray: false},
            create:{method: 'POST', url: api_path + "itsm/workflow/dynamic/start/:processId", isArray: false},
            form:{method: 'GET', url: api_path + "itsm/workflow/dynamic/form/:processId", isArray: false},
            task:{method: 'GET', url: api_path + "itsm/workflow/dynamic/task/:taskId", isArray: false},
            view:{method: 'GET', url: api_path + "itsm/workflow/dynamic/history/form", isArray: false},
            claim:{method: 'POST', url: api_path + "itsm/workflow/dynamic/claim/:taskId", isArray: false},
            complete:{method: 'POST', url: api_path + "itsm/workflow/dynamic/complete/:taskId", isArray: false},
            delete:{method: 'POST', url: api_path + "itsm/workflow/dynamic/delete", isArray: false},
            convert:{method: 'GET', url: api_path + "itsm/workflow/dynamic/convert/:processId", isArray: false}
        });
    });
    itsm.controller('modelController',['$scope','$rootScope','$location','$timeout','ModelService','Util','Loading','Tools',function($scope,$rootScope,$location,$timeout,Model,Util,Loading,Tools){

        $scope.openDialog=Tools.dialog({
            id:"openDialog",
            title:"新建",
            hiddenButton:true,
            model:{name:"",key:"",desc:"",type:""},
            save:function(){
                window.open(api_path+"itsm/workflow/model/create?name="+$scope.openDialog.model.name+"&key="+$scope.openDialog.model.key+"&desc="+$scope.openDialog.model.desc+"&type="+$scope.openDialog.model.type);
            }
        });

        $scope.searchPage = {
            data : {
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                time1:"",
                time2:"",
                createBy:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    Loading.show();
                    $scope.listPage.settings.reload();
                    Loading.hide();
                }
            }
        };
        $scope.listPage = {
            data:[],
            action : {
                add:function(){
                    $scope.openDialog.model={name:"",key:"",type:"",desc:""};
                    $scope.openDialog.show();
                },
                edit:function(id){
                    window.open("./modeler/editor.html?id="+id);
                },
                delete:function(id){
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Model.delete({modelId:id},function(){
                            $rootScope.$alert("删除成功");
                            $scope.searchPage.action.search();
                        });
                    },"删除");
                },
                deploy:function(id){
                    Model.deploy({modelId:id},function(){
                        $rootScope.$alert("部署成功");
                        $scope.searchPage.action.search();
                    });
                },
                export:function(id){
                    window.open(api_path+"itsm/workflow/model/export/"+id);
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Model.list(function(rows){
                        Loading.hide();
                        $scope.listPage.data =rows;
                        fnCallback({total:rows.length,rows:rows});
                    });
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "流程KEY",
                    mData:"key",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "流程名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "流程类别",
                    mData:"category",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "版本",
                    mData:"version",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建时间",
                    mData:"createTime",
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
                        return '<i ng-disabled="loginUserMenuMap[currentView]" title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="部署" class="fa fa-plus" ng-click="listPage.action.deploy(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="导出" class="fa fa-share" ng-click="listPage.action.export(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="删除" class="fa fa-trash-o" ng-click="listPage.action.delete(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 5 ] },  //第0、9列不可排序
                { sWidth: "120px", aTargets: [ 5] }
            ] , //定义列的约束
            defaultOrderBy : []
        };
    }]);

    itsm.controller('dynamicFlowController',['$scope','$rootScope','$location','$timeout','ModelService','Util','Loading','Tools','dynamicFlowService',function($scope,$rootScope,$location,$timeout,Model,Util,Loading,Tools,Flow){

        $scope.fileDialog=Tools.dialog({
            id:"openDialog",
            title:"上传",
            model:{name:"",key:"",desc:""},
            save:function(){
                jQuery.ajaxFileUpload({
                    url: '/dmonitor-webapi/itsm/workflow/deploy', //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'file', //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (data){
                        Loading.hide();
                        $rootScope.$alert(" 部署成功!");
                        $scope.$apply();
                        $rootScope.$apply();
                    },error: function (data, status, e){
                        Loading.hide();
                        $rootScope.$alert(" 部署成功!");
                    }
                });
                $scope.fileDialog.hide();
            }
        });

        $scope.searchPage = {
            data : {
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                key:"",
                category:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    Loading.show();
                    $scope.listPage.settings.reload();
                    Loading.hide();
                }
            }
        };
        $scope.listPage = {
            data:[],
            action : {
                upload:function(){
                    $scope.fileDialog.show();
                },
                start:function(id){
                    var model=Util.findFromArray("processId",id,$scope.listPage.data);
                    model.action="新建";
                    location.href="./index.html#/taskInfo?process="+angular.toJson(model);
                },
                delete:function(id){
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Flow.delete({deploymentId:id},function(){
                            $scope.searchPage.action.search();
                        });
                    },"删除");
                },
                convert:function(id){
                    Flow.convert({processId:id},function(){
                        $rootScope.$alert("转化成功");
                    },function(d){
                        $rootScope.$alert("转化失败");
                    });
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Flow.processList($scope.searchPage.data,function(data){
                        Loading.hide();
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                    },function(data){
                        Loading.hide();
                    });
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "流程KEY",
                    mData:"key",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "流程名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "类型",
                    mData:"category",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "版本",
                    mData:"version",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"processId",
                    mRender:function(mData,type,full) {
                        return '<i ng-disabled="loginUserMenuMap[currentView]" title="启动" class="fa fa-plus" ng-click="listPage.action.start(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="转为模型" class="fa fa-forward" ng-click="listPage.action.convert(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="删除" class="fa fa-trash-o" ng-click="listPage.action.delete(\''+full.deploymentId+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 4 ] },  //第0、9列不可排序
                { sWidth: "120px", aTargets: [ 4] }
            ] , //定义列的约束
            defaultOrderBy : []
        };
    }]);

    itsm.controller('taskListController',['$scope','$rootScope','$location','$timeout','ModelService','Util','Loading','Tools','dynamicFlowService','ItsmService',function($scope,$rootScope,$location,$timeout,Model,Util,Loading,Tools,Flow,ItsmService){
        $scope.taskTree = [
            {
                "id":1,
                "displayName":"待签"
            },
            {
                "id":2,
                "displayName":"待办"
            },
            {
                "id":3,
                "displayName":"参与"
            },
            {
                "id":4,
                "displayName":"关闭"
            }
        ];
        $scope.openDialog=Tools.dialog({
            id:"openDialog",
            title:"新建",
            model:{processId:""},
            processList:[],
            save:function(){
                $scope.openDialog.hide();
                var model=Util.findFromArray("processId",$scope.openDialog.model.processId,$scope.openDialog.processList);
                model.action="新建";
                location.href="./index.html#/taskInfo?process="+angular.toJson(model);
            }
        });
        $scope.imageDialog=Tools.dialog({
            id:"imageDialog",
            title:"新建",
            hiddenButton:false,
            save:function(){}
        });
        Flow.processList({offset:0,limit:100000},function(data){
            $scope.openDialog.processList=data.rows;
        });
        $scope.searchPage = {
            listId:$location.$$search.listId?$location.$$search.listId:1,
            data : {
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                key:"",
                category:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                }
            }
        };
        $scope.$watch("searchPage.listId",function(n,d){
            if(n!=d){
                $scope.searchPage.data.offset=0;
                $scope.searchPage.data.limit=10;
                $scope.searchPage.action.search();
            }
        },true);
        $scope.listPage = {
            data:[],
            action : {
                start:function(id){
                    $scope.openDialog.show();
                },
                view:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    model.action="查看";
                    model.listId=$scope.searchPage.listId;
                    location.href="./index.html#/taskInfo?process="+angular.toJson(model);
                },
                claim:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    Flow.claim({taskId:model.taskId},{},function(data){
                        $scope.searchPage.action.search();
                    });
                },
                complete:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    model.action="处理";
                    model.listId=$scope.searchPage.listId;
                    location.href="./index.html#/taskInfo?process="+angular.toJson(model);
                },
                image:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $("#pid").hide();
                    $("#img").attr("src",'/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+model.processId+'&resourceType=image&r='+(new Date()).getTime());
                    ItsmService.getImagePosition({pid:id,r:(new Date()).getTime()},{},function(data){
                        $.each(data,function(i,v){
                            if(v.currentActiviti){
                                $("#pid").show();
                                $("#pid").css("height",v.height+10);
                                $("#pid").css("width",v.width+10);
                                $("#pid").css("left",v.x-4);//25
                                var img = new Image();
                                img.src=$("#img").attr("src");
                                img.onload = function(){
                                    this.onload=null;
                                    $("#pid").css("top",v.y-this.height-4);//10
                                }
                                $("#pid").css("position","relative");
                                $("#pid").css("border","solid 5px red");
                            }
                        });
                    });
                    $scope.imageDialog.show();
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    if($scope.searchPage.listId=="1"){
                        Flow.claimList($scope.searchPage.data,function(data){
                            Loading.hide();
                            $scope.listPage.data =data.rows;
                            fnCallback(data);
                        },function(data){
                            Loading.hide();
                        });
                    }else if($scope.searchPage.listId=="2"){
                        Flow.taskList($scope.searchPage.data,function(data){
                            Loading.hide();
                            $scope.listPage.data =data.rows;
                            fnCallback(data);
                        },function(data){
                            Loading.hide();
                        });
                    }else if($scope.searchPage.listId=="3"){
                        Flow.runningList($scope.searchPage.data,function(data){
                            Loading.hide();
                            $scope.listPage.data =data.rows;
                            fnCallback(data);
                        },function(data){
                            Loading.hide();
                        });
                    }else if($scope.searchPage.listId=="4"){
                        Flow.finishedList($scope.searchPage.data,function(data){
                            Loading.hide();
                            $scope.listPage.data =data.rows;
                            fnCallback(data);
                        },function(data){
                            Loading.hide();
                        });
                    }else{
                        fnCallback({rows:[],total:0});
                        Loading.hide();
                    }
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "流程名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "版本",
                    mData:"version",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "任务名称",
                    mData:"taskName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i ng-disabled="loginUserMenuMap[currentView]" title="查看" class="fa fa-search" ng-click="listPage.action.view(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" ng-show="searchPage.listId==1" title="签收" class="fa fa-edit" ng-click="listPage.action.claim(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" ng-show="searchPage.listId==2" title="处理" class="fa fa-pencil" ng-click="listPage.action.complete(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="流程图" class="fa fa-code-fork" ng-click="listPage.action.image(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 3] },  //第0、9列不可排序
                { sWidth: "120px", aTargets: [ 3] }
            ] , //定义列的约束
            defaultOrderBy : []
        };
    }]);
    itsm.controller('taskInfoController',['$scope','$rootScope','$location','$timeout','ModelService','Util','Loading','Tools','dynamicFlowService','ItsmService',function($scope,$rootScope,$location,$timeout,Model,Util,Loading,Tools,Flow,ItsmService){
        $scope.process=angular.fromJson($location.$$search.process);
        $scope.formData={};
        $scope.action={
            init:function(){
                if($scope.process.action=="新建"){
                    Flow.form({processId:$scope.process.processId},function(data){
                        var trs = "";
                        jQuery.each(data.form.formProperties, function() {
                            var className = this.required === true ? "required" : "";
                            trs += "<tr>" + createFieldHtml(data, this, className)
                            if(this.required === true) {
                                trs += "<span style='color:red'>*</span>";
                            }
                            trs += "</td></tr>";
                        });
                        jQuery('.dynamic-form-table').html(trs);
                        jQuery('.date').datetimepicker({
                            language:"zh-CN",
                            format:"yyyy-MM-dd hh:ii:ss",
                            startDate: "2014-01-01",
                            endDate: new Date(),
                            minView:"hour",
                            startView:"day",
                            minuteStep:5,
                            allowClear:true,
                            autoclose:true,
                            todayBtn:true
                        });
                    });
                }else{
                    if($scope.process.taskId){
                        Flow.task({taskId:$scope.process.taskId},function(data){
                            var trs = "";
                            jQuery.each(data.taskFormData.formProperties, function() {
                                var className = this.required === true ? "required" : "";
                                this.value = this.value ? this.value : "";
                                trs += "<tr>" + createTaskFieldHtml(this, data, className)
                                if (this.required === true) {
                                    trs += "<span style='color:red'>*</span>";
                                }
                                trs += "</td></tr>";
                            });
                            jQuery('.dynamic-form-table').html(trs);
                            jQuery('.date').datetimepicker({
                                language:"zh-CN",
                                format:"yyyy-MM-dd hh:ii:ss",
                                startDate: "2014-01-01",
                                endDate: new Date(),
                                minView:"hour",
                                startView:"day",
                                minuteStep:5,
                                allowClear:true,
                                autoclose:true,
                                todayBtn:true
                            });
                        });
                    }else{
                        Flow.view({insId:$scope.process.id},function(data){
                            var trs = "";
                            jQuery.each(data.taskFormData.formProperties, function() {
                                var className = this.required === true ? "required" : "";
                                this.value = this.value ? this.value : "";
                                trs += "<tr>" + createTaskFieldHtml(this, data, className)
                                if (this.required === true) {
                                    trs += "<span style='color:red'>*</span>";
                                }
                                trs += "</td></tr>";
                            });
                            jQuery('.dynamic-form-table').html(trs);
                            jQuery('.date').datetimepicker({
                                language:"zh-CN",
                                format:"yyyy-MM-dd hh:ii:ss",
                                startDate: "2014-01-01",
                                endDate: new Date(),
                                minView:"hour",
                                startView:"day",
                                minuteStep:5,
                                allowClear:true,
                                autoclose:true,
                                todayBtn:true
                            });
                        });
                    }
                    Flow.history({procId:$scope.process.processId,id:$scope.process.id},{},function(data){
                        $scope.historyProcess = data.rows;
                        if(data.rows.length>0)$scope.currentStep=data.rows[data.rows.length-1].name;
                    });
                }
            },
            claim:function(){
                Flow.claim({taskId:process.taskId},{},function(data){
                    $rootScope.$alert("签收成功");
                },function(data){
                    $rootScope.$alert("签收失败");
                });
            },
            start:function(){
                var data={};
                jQuery('.dynamic-form-table').find(":input").each(function(i){
                    data[jQuery(this).attr("name")]=jQuery(this).val();
                });
                jQuery.post(api_path+"itsm/workflow/dynamic/start/"+$scope.process.processId,data,function(data){
                    $rootScope.$alert("新建成功");
                    location.href="./index.html#/taskList?listId=2"
                });
            },
            complete:function(){
                var data={};
                jQuery('.dynamic-form-table').find(":input").each(function(i){
                    data[jQuery(this).attr("name")]=jQuery(this).val();
                });
                jQuery.post(api_path+"itsm/workflow/dynamic/complete/"+$scope.process.taskId,data,function(data){
                    $rootScope.$alert("处理成功");
                    location.href="./index.html#/taskList?listId=2"
                });
            },
            save:function(){

            },
            back:function(){
                location.href="./index.html#/taskList?listId="+$scope.process.listId;
            }
        };
        $scope.action.init();

        var taskFieldCreator = {
            'string': function(prop, datas, className) {
                var result = "<td width='120'>" + prop.name + "：</td>";
                if (prop.writable === true) {
                    result += "<td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' value='" + prop.value + "' />";
                } else {
                    result += "<td>" + prop.value;
                }
                return result;
            },
            'date': function(prop, datas, className) {
                var result = "<td width='120'>" + prop.name + "：</td>";
                if (prop.writable === true) {
                    result += "<td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='date " + className + "' value='" + prop.value + "'/>";
                } else {
                    result += "<td>" + prop.value;
                }
                return result;
            },
            'enum': function(prop, datas, className) {
                var result = "<td width='120'>" + prop.name + "：</td>";
                if (prop.writable === true) {
                    result += "<td><select id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "'>";
                    $.each(datas[prop.id], function(k, v) {
                        result += "<option value='" + k + "'>" + v + "</option>";
                    });
                    result += "</select>";
                } else {
                    result += "<td>" + prop.value;
                }
                return result;
            },
            'users': function(prop, datas, className) {
                var result = "<td width='120'>" + prop.name + "：</td>";
                if (prop.writable === true) {
                    result += "<td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' value='" + prop.value + "' />";
                } else {
                    result += "<td>" + prop.value;
                }
                return result;
            }
        };

        /**
         * 生成一个field的html代码
         */
        function createTaskFieldHtml(prop, className) {
            var fn=taskFieldCreator[prop.type.name];
            if(fn){
                return fn(prop, className);
            }else{
                return taskFieldCreator['string'](prop, className);
            }
        }

        var formFieldCreator = {
            string: function(formData, prop, className) {
                var result = "<td width='120'>" + prop.name + "：</td><td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' />";
                return result;
            },
            date: function(formData, prop, className) {
                var result = "<td>" + prop.name + "：</td><td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='dateISO " + className + "' />";
                return result;
            },
            'enum': function(formData, prop, className) {
                console.log(prop);
                var result = "<td width='120'>" + prop.name + "：</td>";
                if(prop.writable === true) {
                    result += "<td><select id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "'>";
                    jQuery.each(formData['enum_' + prop.id], function(k, v) {
                        result += "<option value='" + k + "'>" + v + "</option>";
                    });

                    result += "</select>";
                } else {
                    result += "<td>" + prop.value;
                }
                return result;
            },
            'users': function(formData, prop, className) {
                var result = "<td width='120'>" + prop.name + "：</td><td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' />";
                return result;
            }
        };

        function createFieldHtml(formData, prop, className) {
            var event=formFieldCreator[prop.type.name];
            if(event){
                return event(formData, prop, className);
            }else{
                return formFieldCreator['string'](formData, prop, className);
            }
        }
    }]);

})(angular);

