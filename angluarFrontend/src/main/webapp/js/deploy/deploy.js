(function(angular){
    'use strict';
    var api_path="../dmonitor-webapi";
    var event = angular.module('deployApp',['ngRoute','ngResource']);
    event.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/deploy/config', {templateUrl: 'views/deploy/config.html'});
    }]);
    event.factory('ConfigService',['$resource',function(resource){
        return resource("",{},{
            queryConfig:{method:'GET',url:api_path+"/deploy/config",isArray:false}
        });
    }]);
    event.controller('configCtrl',['$scope','$rootScope','Util','Tools','ConfigService','MoClient','Loading','$timeout','$location',function($scope,$rootScope,Util,Tools,Event,MoClient,Loading,$timeout,$location){
        $scope.searchPage = {
            data : {
                moName:"",
                ip:"",
                beginTime:"",
                endTime:"",
                mocId:"",
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
            save:function(){

            }
        });

        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                down: function (fileName) {
                    window.open(api_path+"/deploy/download?fileName="+fileName);
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Event.queryConfig($scope.searchPage.data,function(data){
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
                    sTitle: "资源类型",
                    mData:"mocId",
                    mRender:function(mData,type,full) {
                        return "<label class='td-text' title='"+full['mocName']+"' style='width: 160px;'>"+full['mocName']+"</label>";
                    }
                },
                {
                    sTitle: "资源名称",
                    mData:"moId",
                    mRender:function(mData,type,full) {
                        return "<label class='td-text' title='"+full['moName']+"' style='width: 160px;'>"+full['moName']+"</label>";
                    }
                },
                {
                    sTitle: "IP地址",
                    mData:"moId",
                    mRender:function(mData,type,full) {
                        return full['ip'];
                    }
                },
                {
                    sTitle: "文件名称",
                    mData:"fileName"
                },
                {
                    sTitle: "更新时间",
                    mData:"updatedTime",
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
                        return '<i class="fa fa-download" title="下载" ng-click="listPage.action.down(\'' + full['link'] + '\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 5 ] },  //第0、9列不可排序
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
    }]);
}(angular));
