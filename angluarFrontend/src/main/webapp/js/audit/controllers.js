(function(angular){

angular.module('audit.controllers', [])
.controller('auditCtrl',['$scope','$rootScope','Util','$timeout','AuditClient','Modal',function($scope,$rootScope,Util,$timeout,AuditClient,Modal){

        $scope.isLeaf = function(nodeData){
            return nodeData.isUser;
        };

//公共部分
    $scope.common = {
        alertSettings : {
            id : "alert_div",
            info : ""
        }
    };

    $scope.keys = function(obj){
        var keys = [];
        if(obj){
            for(var key in obj){
                if(key.indexOf("$")!=0){
                    keys.push(key);
                }
            }
        }
        return keys;
    }

//searchPage部分
    //scope定义
    $scope.searchPage = {
        init : function(){
            $scope.searchPage.data = {
                startTime:"",
                endTime:"",
                userId:"",
                moduleName:"",
                entityName:"",
                keyword:"",
                operation:"",
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "",//排序字段
                orderByType : "" //排序顺序
            }
        },
        startMaxDate:"",
        endMinDate:"",
        users:[]
    };
    $scope.searchPage.action={};
    $scope.searchPage.action.search = function(cancelSort){
        if($scope.searchPage.data.startTime!="" && $scope.searchPage.data.endTime!=""){
            if($scope.searchPage.data.startTime>$scope.searchPage.data.endTime){
                $rootScope.$alert("时间范围错误，请重新输入");
                return;
            }
        }

        if(($scope.searchPage.data.startTime!="" && $scope.searchPage.data.endTime=="") || ($scope.searchPage.data.startTime=="" && $scope.searchPage.data.endTime!="")){
            $rootScope.$alert("时间范围错误，请重新输入");
            return;
        }
        $scope.listPage.settings.reload(cancelSort);
    };
    //初始化
    $scope.searchPage.init();
    AuditClient.users(function (data) {
        function buildTree(rows){
            for(var i=0;i<rows.length;i++){
                var row=rows[i];
                if((row.id+'').indexOf("u_")==-1){
                    row.isUser=false;
                    row.id = "loc_"+row.id;
                }else{
                    row.id = Number((row.id+'').replace("u_",""));
                    row.isUser=true;
                }
                if(row.children && row.children.length>0){
                    buildTree(row.children);
                }
            }
        }
        buildTree(data);
        $scope.searchPage.users = data;
    });


//listPage部分
    //scope定义
    $scope.listPage = {
        data:[]
    };

    $scope.listPage.settings = {
        reload : null,
        getData:function(search,fnCallback){
            $scope.searchPage.data.limit = search.limit;
            $scope.searchPage.data.offset = search.offset;
            $scope.searchPage.data.orderBy = search.orderBy;
            $scope.searchPage.data.orderByType = search.orderByType;


            AuditClient.query($scope.searchPage.data,function(data){
                $scope.listPage.data = data.rows;
                fnCallback(data);
            });
        }, //getData应指定获取数据的函数
        columns : [
            {
                sTitle: "模块",
                mData:"moduleDisplayName"
            },
            {
                sTitle: "操作",
                mData:"operation",
                mRender:function(mData,type,full) {
                    //[新增/更新/删除]了[module.entityDisplayName] [instanceDisplayName]
                    //因为[cause]，[新增/更新/删除...]了[module.entityDisplayName] [instanceDisplayName]
                    var op = $rootScope.audit.operation[full.operation];
                    if(!op){
                        op = "操作";
                    }
                    return Util.str2Html(op);
                }
            },
            {
                sTitle: "内容",
                mData:"id",
                mRender:function(mData,type,full) {
                    //[新增/更新/删除]了[module.entityDisplayName] [instanceDisplayName]
                    //因为[cause]，[新增/更新/删除...]了[module.entityDisplayName] [instanceDisplayName]
                    var op = $rootScope.audit.operation[full.operation];
                    if(!op){
                        op = "操作";
                    }
                    var result = "";
                    if(full.cause!=null && full.cause!=""){
                        result = "因为"+full.cause+"，";
                    }
                    result+=op+"了"+full.entityDisplayName+" "+(full.instanceDisplayName?full.instanceDisplayName:"");
                    return Util.str2Html(result);
                }
            },
            {
                sTitle: "操作人",
                mData:"userName"
            },
            {
                sTitle: "操作时间",
                mData:"created",
                mRender:function(mData,type,full) {
                    if(mData){
                        return new Date(mData).Format("yyyy-MM-dd hh:mm:ss");
                    }else{
                        return "";
                    }
                }
            }
        ] , //定义列的形式,mRender可返回html
        columnDefs : [
            { bSortable: false, aTargets: [2] },  //不可排序
            { sWidth: "100px", aTargets: [ 0,1,3 ] },
            { sWidth: "150px", aTargets: [ 4 ] }
        ], //定义列的约束
        defaultOrderBy : []  //定义默认排序列为第8列倒序
    };

    $scope.$watch("searchPage.data.moduleName",function(newVal,oldVal){
        if(newVal!=oldVal){
            $scope.searchPage.data.operation="";
        }
    },false);


}]);

})(angular);