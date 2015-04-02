
(function(angular){
    var system = angular.module('jfpatrol-module', ['ngResource']);

    var path = "/dmonitor-webapi";

    system.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/jfPatrol', {
            templateUrl: 'views/report/jfPatrol.html',
            controller: 'jfPatrolCtrl'});
        $routeProvider.when('/jfTemplete', {
            templateUrl: 'views/report/jfTemplete.html',
            controller: 'jfTempleteCtrl'});

    }]);

    system.factory('jfService', function ($resource) {
        return $resource("", {}, {
            getJf:{method:'GET',url:path+"/report/jfPatrol/jf",isArray:true},
            getTempleteByJfId:{method:'GET',url:path+"/report/jfPatrol/jftemplete",isArray:false},
            addJfPatrol:{method:'POST',url:path+"/report/jfpatrol",isArray:false},
            pageJfPatrol:{method:'GET',url:path+"/report/pagejfpatrol",isArray:false},
            remove:{method:"DELETE",url:path+"/report/jfpatrol",isArray:false},
            jfpatrollist:{method:"GET",url:path+"/report/jfpatrollist",isArray:false},
            editJfPatrol:{method:'PUT',url:path+"/report/jfpatrol",isArray:false},
            report:{method:'GET',url:path+"/report/createreportfile",isArray:false},
            addJfTemplete:{method:'POST',url:path+"/report/jftemplete",isArray:false},
            pageJfTemplete:{method:'GET',url:path+"/report/pagejftemplete",isArray:false},
            removeTemplete:{method:"DELETE",url:path+"/report/jftemplete",isArray:false},
            jfTempletelist:{method:"GET",url:path+"/report/jftempletelist",isArray:false},
            editJfTemplete:{method:'PUT',url:path+"/report/jftemplete",isArray:false}

        });
    });


    system.run(['$rootScope','jfService',function($rootScope,archiveDirService) {


    }]);
    system.controller('jfTempleteCtrl',['$scope','$rootScope','jfService','$filter','Util',"Tools",'Loading','$routeParams','$timeout','Const',"$window",function($scope,$rootScope,jfService,$filter,Util,Tools,Loading,$routeParams,$timeout,Const,$window) {
        $scope.addPage = {};
        $scope.addPage.datas = {};
        $scope.addPage.data = {};
        $scope.searchPage = {};
        $scope.searchPage.data = {};
        $scope.editPage = {};
        $scope.editPage.data = {};

        $scope.listPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                add:function(){
                    $scope.addPage.data = {};
                    jfService.getJf({},function(data){
                        $scope.addPage.datas.jf=data;
                    });
                    $scope.jfTempleteAddDialog.show();
                },
                edit:function(id){
                    for(var i=0;i<$scope.listPage.data.length;i++){
                        if(id == $scope.listPage.data[i].id){
                            $scope.editPage.data = $scope.listPage.data[i];
                        }
                    }
                    jfService.jfTempletelist({"jfTempleteId":id},function(data){
                          var typesXj=eval(data.typesXj);
                          $scope.typesXj=typesXj;
                    });

                    $scope.jfTempleteEditDialog.show();
                },
                remove: function (id) {
                    $rootScope.$confirm("确定要删除吗？",function() {
                        Loading.show();
                        jfService.removeTemplete({ids:[id]},{},function(data){
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
                        $rootScope.$alert("请选择数据");
                    }else{
                        $rootScope.$confirm("确定要删除吗？",function(){
                            Loading.show();
                            jfService.removeTemplete({ids:$scope.listPage.checkedList},{},function(data){
                                if (data.result == "success") {
                                    $scope.listPage.settings.reload(true);
                                }
                            },function(error){
                                Loading.hide();
                            });
                        }," 删 除 ");
                    }
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType  = search.orderByType;
                    Loading.show();
                    jfService.pageJfTemplete($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        }

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
                    sTitle: "机房名称",
                    mData:"jfName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "巡检工程师",
                    mData:"patrolUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "巡检日期",
                    mData:"patrolTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(full.isReport){
                            if(disabledOp){
                                return   '<i class="fa fa-trash-o" title="删除" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                            }else{
                                return '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                            }
                        }else{
                            if(disabledOp){
                                return '<i class="fa fa-pencil" title="编辑" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                    '<i class="fa fa-trash-o" title="删除" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                            }else{
                                return '<i class="fa fa-pencil" title="编辑" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                                    '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                            }
                        }
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,4]},//列不可排序
                { sWidth: "38px", aTargets: [0]},
                { sWidth: "100px", aTargets: [4]}
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
        $scope.typesXj=[];
        $scope.typeDevice={name:""};
        $scope.typeXj={name:"",devicesXj:[]};
        $scope.jfTempleteAddDialog = Tools.dialog({
            id:"jfTempleteAddDialog",


            title:"新增",
            hiddenButton:true,
            createTypeXj:function(){
                $scope.typesXj.push(angular.copy($scope.typeXj));
            },
            deleteTypeXj:function(devicesXj,device){
                devicesXj.splice(device,1);
            },
            createDevice:function(devicesXj){
                devicesXj.push(angular.copy($scope.typeDevice));
            },
            deleteDevice:function(devicesXj,device){
                devicesXj.splice(device,1);
            },
            save:function(){
                Loading.show();
                var jp = {};
                jp.jfId = $scope.addPage.data.jfId;
                jp.patrolUser = $scope.addPage.data.patrolUser;
                jp.patrolTime = $scope.addPage.data.patrolTime;
                jp.remark = $scope.addPage.data.remark;
                jp.signatureUser = $scope.addPage.data.signatureUser;
                jp.signatureTime = $scope.addPage.data.signatureTime;
                jp.typesXj=$scope.typesXj;
                jfService.addJfTemplete(jp,function(data){
                    $scope.jfTempleteAddDialog.hide();
                    $scope.typesXj=[];
                    $scope.listPage.settings.reload(true);
                },function(error){
                    Loading.hide();
                });
            }
        });

        $scope.jfTempleteEditDialog = Tools.dialog({
            id:"jfTempleteEditDialog",
            title:"编辑",
            hiddenButton:true,
            createTypeXj:function(){
                $scope.typesXj.push(angular.copy($scope.typeXj));
            },
            deleteTypeXj:function(devicesXj,device){
                devicesXj.splice(device,1);
            },
            createDevice:function(devicesXj){
                devicesXj.push(angular.copy($scope.typeDevice));
            },
            deleteDevice:function(devicesXj,device){
                devicesXj.splice(device,1);
            },
            save:function(){
                Loading.show();
                var jp = {};
                jp.id = $scope.editPage.data.id+"";
                jp.jfId = $scope.editPage.data.jfId+"";
                jp.patrolUser = $scope.editPage.data.patrolUser;
                jp.patrolTime = $scope.editPage.data.patrolTime;
                jp.remark = $scope.editPage.data.remark;
                jp.signatureUser = $scope.editPage.data.signatureUser;
                jp.signatureTime = $scope.editPage.data.signatureTime;
                jp.typesXj=$scope.typesXj;
                jfService.editJfTemplete(jp,function(data){
                    $scope.jfTempleteEditDialog.hide();
                    $scope.typesXj=[];
                    $scope.listPage.settings.reload(true);
                },function(error){
                    Loading.hide();
                });
            }
        });


        $scope.$watch("addPage.data.jfId",function(newVal,oldVal){
            if(newVal) {
                for(var i=0;i<$scope.addPage.datas.jf.length;i++){
                    if(newVal == $scope.addPage.datas.jf[i].id){
                        $scope.addPage.data.jfName = $scope.addPage.datas.jf[i].name;
                    }
                }
            }
        },false)

    }]);

    system.controller('jfPatrolCtrl',['$scope','$rootScope','jfService','$filter','Util',"Tools",'Loading','$routeParams','$timeout','Const',"$window",function($scope,$rootScope,jfService,$filter,Util,Tools,Loading,$routeParams,$timeout,Const,$window) {
        $scope.addPage = {};
        $scope.listRadios=[]
        $scope.radios={"patrolType":"","patrolTime":"","patrolResult":""};
        $scope.addPage.datas = {};
        $scope.addPage.data = {};
        $scope.searchPage = {};
        $scope.searchPage.data = {};
        $scope.editPage = {};
        $scope.editPage.data = {};
        //初始化模版参数
        $scope.typesXj=[];
        $scope.typeDevice={name:"" };
        $scope.typeXj={name:"",devicesXj:[]};
        $scope.listPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                add:function(){
                    $scope.listRadios=[];
                    $scope.addPage.data = {};
                    jfService.getJf({},function(data){
                        $scope.addPage.datas.jf=data;
                    });
                   $scope.addPage.data.firstTime="8:00";
                   $scope.addPage.data.secondTime="10:00";
                   $scope.addPage.data.threeTime="12:00";
                   $scope.jfPatrolAddDialog.show();
                },
                edit:function(id){
                    $scope.listRadios=[];
                    var editlistRadios={};
                    for(var i=0;i<$scope.listPage.data.length;i++){
                        if(id == $scope.listPage.data[i].id){
                            $scope.editPage.data = $scope.listPage.data[i];
                        }
                    }
                    jfService.jfpatrollist({"jfPatrolId":id,"jfId": $scope.editPage.data.jfId},function(data){

                        var typesXj=eval(data.templete.typesXj);
                        $scope.typesXj=typesXj;
                        var flag=false;
                        for(var i=0;i<data.list.length;i++){
                            editlistRadios[data.list[i].patrolType]={patrolType:data.list[i].patrolType,patrolTime:data.list[i].patrolTime,patrolResult:data.list[i].patrolResult};
                              if(i==data.list.length-1){
                                  flag=true;

                              }
                        }
                        if(flag){
                            for(var i=0;i<$scope.typesXj.length;i++) {
                                for (var j = 0; j < $scope.typesXj[i].devicesXj.length; j++) {
                                    var radios1 = angular.copy($scope.radios);
                                    radios1.patrolType = i + "_" + j + "8";
                                    radios1.patrolTime = "8";
                                    radios1.patrolResult = editlistRadios[ i + "_" + j + "8"].patrolResult;
                                    var radios2 = angular.copy($scope.radios);
                                    radios2.patrolType = i + "_" + j + "10";
                                    radios2.patrolTime = "10";
                                    radios2.patrolResult =editlistRadios[ i + "_" + j + "10"].patrolResult;
                                    var radios3 = angular.copy($scope.radios);
                                    radios3.patrolType = i + "_" + j + "12";
                                    radios3.patrolTime = "12";
                                    radios3.patrolResult = editlistRadios[ i + "_" + j + "12"].patrolResult;
                                    $scope.typesXj[i].devicesXj[j].deviceRadios = [radios1, radios2, radios3];
                                    $scope.listRadios.push($scope.typesXj[i].devicesXj[j].deviceRadios[0]);

                                    $scope.listRadios.push($scope.typesXj[i].devicesXj[j].deviceRadios[1]);

                                    $scope.listRadios.push($scope.typesXj[i].devicesXj[j].deviceRadios[2]);

                                    if (i == $scope.typesXj.length - 1 && j == $scope.typesXj[i].devicesXj.length - 1) {
                                        flag = true;
                                    }

                                }
                        }

                        }
                    });
                    $scope.jfPatrolEditDialog.show();
                },
                remove: function (id) {
                    $rootScope.$confirm("确定要删除吗？",function() {
                        Loading.show();
                        jfService.remove({ids:[id]},{},function(data){
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
                        $rootScope.$alert("请选择数据");
                    }else{
                        $rootScope.$confirm("确定要删除吗？",function(){
                            Loading.show();
                            jfService.remove({ids:$scope.listPage.checkedList},{},function(data){
                                if (data.result == "success") {
                                    $scope.listPage.settings.reload(true);
                                }
                            },function(error){
                                Loading.hide();
                            });
                        }," 删 除 ");
                    }
                },
                report:function(id){
                    $rootScope.$confirm("确定生成报表？",function() {
                            Loading.show();
                            jfService.report({"jfPatrolId":id},function(data){
                                if (data.result == "success") {
                                    $scope.listPage.settings.reload(true);
                                }
                            },function(error){
                                Loading.hide();
                            });
                    }," 报 表 ");
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType  = search.orderByType;
                    Loading.show();
                    jfService.pageJfPatrol($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        }

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
                    sTitle: "机房名称",
                    mData:"jfName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "巡检工程师",
                    mData:"patrolUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "巡检日期",
                    mData:"patrolTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(full.isReport){
                            if(disabledOp){
                                return   '<i class="fa fa-trash-o" title="删除" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                            }else{
                                return '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                            }
                        }else{
                            if(disabledOp){
                                return '<i class="fa fa-pencil" title="编辑" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                    '<i class="fa fa-external-link" title="报表" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                    '<i class="fa fa-trash-o" title="删除" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                            }else{
                                return '<i class="fa fa-pencil" title="编辑" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                                    '<i class="fa fa-external-link" title="报表" ng-click="listPage.action.report(\''+mData+'\')" > </i>' +
                                    '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                            }
                        }
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,4]},//列不可排序
                { sWidth: "38px", aTargets: [0]},
                { sWidth: "100px", aTargets: [4]}
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

        $scope.jfPatrolAddDialog = Tools.dialog({
            id:"jfPatrolAddDialog",
            title:"新增",
            hiddenButton:true,
            save:function(){
                Loading.show();
                var jp = {};
                jp.jfId = $scope.addPage.data.jfId;
                jp.patrolUser = $scope.addPage.data.patrolUser;
                jp.patrolTime = $scope.addPage.data.patrolTime;
                jp.remark = $scope.addPage.data.remark;
                jp.signatureUser = $scope.addPage.data.signatureUser;
                jp.signatureTime = $scope.addPage.data.signatureTime;
                jp.jfPatrolList = $scope.listRadios;
                jp.firstTime=$scope.addPage.data.firstTime;
                jp.secondTime=$scope.addPage.data.secondTime;
                jp.threeTime=$scope.addPage.data.threeTime;
                jfService.addJfPatrol(jp,function(data){
                    $scope.jfPatrolAddDialog.hide();
                    $scope.listRadios=[];
                    $scope.listPage.settings.reload(true);
                },function(error){
                    Loading.hide();
                });
            }
        });

        $scope.jfPatrolEditDialog = Tools.dialog({
            id:"jfPatrolEditDialog",
            title:"编辑",
            hiddenButton:true,
            save:function(){
                Loading.show();
                var jp = {};
                jp.id = $scope.editPage.data.id;
                jp.jfId = $scope.editPage.data.jfId;
                jp.remark = $scope.editPage.data.remark;
                jp.patrolUser = $scope.editPage.data.patrolUser;
                jp.patrolTime = $scope.editPage.data.patrolTime;
                jp.signatureUser = $scope.editPage.data.signatureUser;
                jp.signatureTime = $scope.editPage.data.signatureTime;
                jp.jfPatrolList = $scope.listRadios;
                jp.firstTime=$scope.editPage.data.firstTime;
                jp.secondTime=$scope.editPage.data.secondTime;
                jp.threeTime=$scope.editPage.data.threeTime;
                jfService.editJfPatrol(jp,function(data){
                    $scope.jfPatrolEditDialog.hide();
                    $scope.listPage.settings.reload(true);
                },function(error){
                    Loading.hide();
                });
            }
        });


        $scope.$watch("addPage.data.jfId",function(newVal,oldVal){
            if(newVal) {
                $scope.listRadios=[];
                for(var i=0;i<$scope.addPage.datas.jf.length;i++){
                    if(newVal == $scope.addPage.datas.jf[i].id){
                        $scope.addPage.data.jfName = $scope.addPage.datas.jf[i].name;
                    }
                }
                jfService.getTempleteByJfId({"jfId":newVal},function(data){

                    var typesXj=eval(data.typesXj);
                    $scope.typesXj=typesXj;
                    for(var i=0;i<$scope.typesXj.length;i++){
                        for(var j=0;j<$scope.typesXj[i].devicesXj.length;j++){
                           var radios1=angular.copy($scope.radios);
                            radios1.patrolType=i+"_"+j+"8";
                            radios1.patrolTime="8";
                            radios1.patrolResult="正常";
                            var radios2=angular.copy($scope.radios);
                            radios2.patrolType=i+"_"+j+"10";
                            radios2.patrolTime="10";
                            radios2.patrolResult="正常";
                            var radios3=angular.copy($scope.radios);
                            radios3.patrolType=i+"_"+j+"12";
                            radios3.patrolTime="12";
                            radios3.patrolResult="正常";
                            $scope.typesXj[i].devicesXj[j].deviceRadios=[radios1,radios2,radios3];
                            $scope.listRadios.push($scope.typesXj[i].devicesXj[j].deviceRadios[0]);
                            $scope.listRadios.push($scope.typesXj[i].devicesXj[j].deviceRadios[1]);
                            $scope.listRadios.push($scope.typesXj[i].devicesXj[j].deviceRadios[2]);

                        }
                    }
                    var list= $scope.typesXj;

                });
            }
        },false)

    }]);

})(angular);