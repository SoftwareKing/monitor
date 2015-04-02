
(function(angular){
    var system = angular.module('archivedir-module', ['ngResource']);

    var path = "/dmonitor-webapi";

    system.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/archiveDir', {
            templateUrl: 'views/report/archiveDir.html',
            controller: 'archiveDirCtrl'});
        $routeProvider.when('/archiveFile', {
            templateUrl: 'views/report/archiveFile.html',
            controller: 'archiveFileCtrl'});
    }]);

    system.factory('archiveDirService', function ($resource) {
        return $resource("", {}, {
            getArchiveDir:{method:'GET',url:path+"/report/archivedir",isArray:true},
            saveArchiveDir:{method:'POST',url:path+"/report/archivedir",isArray:false},
            pageArchiveDir:{method:'GET',url:path+"/report/archivedir/page",isArray:false},
            editArchiveDir:{method:'PUT',url:path+"/report/archivedir",isArray:false},
            roleTree:{method:'GET',url:path+'/report/archivedir/role',isArray:true},
            archiveFile:{method:'GET',url:path+'/report/archivefile',isArray:true},
            remove:{method:"DELETE",url:path+"/report/archivedir",isArray:false}
        });
    });

    system.run(['$rootScope','archiveDirService',function($rootScope,archiveDirService) {


    }]);

    system.controller('archiveDirCtrl',['$scope','$rootScope','archiveDirService','$filter','Util',"Tools",'Loading','$routeParams','$timeout','Const',"$window",function($scope,$rootScope,archiveDirService,$filter,Util,Tools,Loading,$routeParams,$timeout,Const,$window) {

        $scope.archiveDirAdd = {};
        $scope.archiveDirAdd.data = {};
        $scope.searchPage = {};
        $scope.searchPage.data = {};
        $scope.archiveDirEdit = {};
        $scope.archiveDirEdit.data = {};
        $scope.archive = {};
        $scope.archive.dir = [];
        $scope.listPage = {
            data: [],
            checkedList: [],
            checkAllRow: false,
            action: {
                add:function(){
                    archiveDirService.getArchiveDir(function(data){
                        $scope.archive.dir = data;
                    });
                    $scope.archiveDirAdd.data = {};
                    $scope.archiveDirAddDialog.show();
                },
                edit:function(id){
                    archiveDirService.getArchiveDir(function(data){
                        $scope.archive.dir = data;
                    });
                    for(var i=0;i<$scope.listPage.data.length;i++){
                        if($scope.listPage.data[i].id==id){
                            $scope.archiveDirEdit.data = angular.copy($scope.listPage.data[i]);
                        }
                    }
                    $scope.archiveDirEditDialog.show();
                },
                remove: function (id) {
                    $rootScope.$confirm("确定要删除吗？",function() {
                        Loading.show();
                        archiveDirService.remove({ids:[id]},{},function(data){
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
                        $rootScope.$alert("请选择目录");
                    }else{
                        $rootScope.$confirm("确定要删除吗？",function(){
                            Loading.show();
                            archiveDirService.remove({ids:$scope.listPage.checkedList},{},function(data){
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
                    archiveDirService.pageArchiveDir($scope.searchPage.data,function(data){
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
                    sTitle: "目录名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "父目录",
                    mData:"parentName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "备注",
                    mData:"remark"
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(disabledOp){
                            return '<i class="fa fa-pencil" title="编辑" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                                '<i class="fa fa-trash-o" title="删除" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                        }else{
                            return '<i class="fa fa-pencil" title="编辑" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                                '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                        }
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false,aTargets:[0,2,3,4]},//列不可排序
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

        $scope.archiveDirAddDialog = Tools.dialog({
            id:"archiveDirAddDialog",
            title:"新增",
            hiddenButton:true,
            save:function(){
                Loading.show();
                if($scope.archiveDirAdd.data.parentId ==-1){
                    $scope.archiveDirAdd.data.parentId = "";
                    $scope.archiveDirAdd.data.parentName = "无";
                }
                archiveDirService.saveArchiveDir($scope.archiveDirAdd.data,function(data){
                    if(data.result=="success"){
                        $scope.archiveDirAddDialog.hide();
                        $scope.listPage.settings.reload(true);
                    }else{
                        $rootScope.$alert(data.result);
                        Loading.hide();
                    }
                },function(error){
                    Loading.hide();
                });
            }
        });

        $scope.archiveDirEditDialog = Tools.dialog({
            id:"archiveDirEditDialog",
            title:"编辑",
            hiddenButton:true,
            save:function(){
                archiveDirService.editArchiveDir($scope.archiveDirEdit.data,function(data){
                    $scope.archiveDirEditDialog.hide();
                    $scope.listPage.settings.reload(true);
                },function(error){
                    Loading.hide();
                });
            }
        });


    }]);

    system.controller('archiveFileCtrl',['$scope','$rootScope','archiveDirService','$filter','Util',"Tools",'Loading','$routeParams','$timeout','Const',"$window",function($scope,$rootScope,archiveDirService,$filter,Util,Tools,Loading,$routeParams,$timeout,Const,$window) {

        $scope.archiveFile={};
        $scope.archiveTree={
            data:[],
            checked:"",
            crossParent:"true",
            treeId: 'archiveTree',
            checkType: { "Y" : "", "N" : "" },
            checkbox:null,
            treeClick:function(node){
                archiveDirService.archiveFile({"dirId":node.id},function(data){
                    $scope.archiveFile.data=data;
                });
            }
        };

        archiveDirService.roleTree({"isCount":true},{}, function (data) {
            $scope.archiveTree.data=data;
        });


    }]);

})(angular);