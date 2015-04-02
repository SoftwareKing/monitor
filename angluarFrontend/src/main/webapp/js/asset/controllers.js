(function(angular){
    var controllers = angular.module('asset.controllers',[]);

    controllers.run(['$rootScope','Modal','UserService',function($rootScope,Modal,UserService){
        UserService.getUsers({},function(data){
            $rootScope.userList = data.rows;
        });

        $rootScope.common = {
            confirmSettings : {
                id : "confirmDiv",
                info : "",
                save:null
            },
            confirm : function (msg, fn, title) {
                $rootScope.common.confirmSettings.info = msg;
                $rootScope.common.confirmSettings.save = fn;
                $rootScope.common.confirmSettings.title = title;
                Modal.show($rootScope.common.confirmSettings.id);
            }
        };

        $rootScope.compareStrDate = function(startDateStr,endDateStr,msg){   //format:  yyyyy-mm-dd
            if(startDateStr >= endDateStr){
                if(msg) {
                    $rootScope.$alert(msg);
                }else{
                    $rootScope.$alert("开始日期不能大于结束日期!");
                }
                return false;
            }else{
                return true;
            }
        };

        $rootScope.checkDateRange = function(startDateStr,endDateStr){
            if( (startDateStr=="" || startDateStr==undefined) && (endDateStr=="" || endDateStr==undefined) ){
               return true;
            }
            if(startDateStr){
                if(endDateStr){
                    return true;
                }else{
                    $rootScope.$alert("请输入结束时间！");
                    return false;
                }
            }
            if(endDateStr){
                if(startDateStr){
                    return true;
                }else{
                    $rootScope.$alert("请输入开始时间！");
                    return false;
                }
            }
        };

        $rootScope.getStatusName = function(status){
            var statusName = ["未用","在用","停用","在修","维保","报废","出借","领用"];
            return statusName[status-1];
        };
        $rootScope.getTypeName = function(type){
            switch(type) {
                case "MW":return "中间件";
                case "DB":return "数据库";
                case "SYS":return "业务系统";
                case "VC":return "虚拟池";
                case "VS":return "虚拟机";
                case "UM":return "小型机";
                case "PS":return "PC服务器";
                case "CB":return "刀片服务器";
                case "DA":return "存储";
                case "TL":return "磁带库";
                case "LB":return "负载均衡";
                default : return "";
            }
        };
    }]);

    controllers.controller('assetCheckoutController', ['$scope','$rootScope','Modal','Loading','Util','AssetCheckClient','AssetInfoClient', function ($scope,$rootScope,Modal,Loading,Util,AssetCheckClient,AssetInfoClient) {
        var getUserNameById = function(id){
            for(var i=0;i<$rootScope.userList.length;i++){
                if($rootScope.userList[i].id == id){
                    return $rootScope.userList[i].realName;
                }
            }
        };

        $scope.differenceList = [];
        $scope.listPage = {
            data : [],
            checkedList : [],
            checkAllRow : false,
            search : {limit: 20, offset: 0,orderBy: "", orderByType: ""},
            settings : {
                reload : null,
                getData:function(search,fnCallback){
                    Loading.show();
                    $scope.listPage.search.limit = search.limit;
                    $scope.listPage.search.offset = search.offset;
                    $scope.listPage.search.orderBy = search.orderBy;
                    $scope.listPage.search.orderByType = search.orderByType;
                    AssetCheckClient.query($scope.listPage.search, function (data) {
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    });
                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                        }
                    },
                    {
                        sTitle: "主题",
                        mData:"subject",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "状态",
                        mData:"status",
                        mRender:function(mData,type,full) {
                            if(mData == 0){
                                return "未盘点";
                            }else if(mData == 1){
                                return "盘点中";
                            }else if(mData == 2){
                                return "盘点结束";
                            }
                        }
                    },
                    {
                        sTitle: "盘点人",
                        mData:"userId",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(getUserNameById(mData));
                        }
                    },
                    {
                        sTitle: "开始时间",
                        mData:"startDate",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd HH:mm");
                            }else
                                return "";
                        }
                    },
                    {
                        sTitle: "结束时间",
                        mData:"endDate",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd HH:mm");
                            }else
                                return "";
                        }
                    },
                    {
                        sTitle: "说明",
                        mData:"summary",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "操作",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            var htmlStr = "";
                            if(full.status == 0){
                                htmlStr += '<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"></i>';
                                htmlStr += '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                                htmlStr += '<i title="开始盘点" class="fa fa-check" ng-click="listPage.action.check(\''+mData+'\',\'' + 0 +'\')"></i>';
                            }else if(full.status == 1){
                                htmlStr += '<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"></i>';
                                htmlStr += '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                                htmlStr += '<i title="继续盘点" class="fa fa-check" ng-click="listPage.action.check(\''+mData+'\',\'' + 1 +'\')"></i>';
                                htmlStr += '<i title="生成差异表" class="fa fa-file" ng-click="listPage.action.finishCheck(\''+mData+'\')"></i>';
                            }else if(full.status == 2){
                                htmlStr += '<i title="查看差异表" class="fa fa-eye" ng-click="listPage.action.viewDifference(\''+mData+'\')"></i>';
                            }
                            return htmlStr;
                        }
                    }
                ] ,
                columnDefs : [
                    { bSortable: false,aTargets:[0,7]},//列不可排序
                    { sWidth: "38px", aTargets: [0]},
                    { sWidth: "120px", aTargets: [7]}
                ] , //定义列的约束
                defaultOrderBy :[]  //定义默认排序为第x列倒序
            },
            action : {
                search: function(){
                    var startFlag = $rootScope.checkDateRange($scope.listPage.search.startDateMin,$scope.listPage.search.startDateMax);
                    var endFlag = $rootScope.checkDateRange($scope.listPage.search.endDateMin,$scope.listPage.search.endDateMax);
                    if(startFlag && endFlag){
                        $scope.listPage.settings.reload();
                    }
                },
                add : function () {
                    $scope.addModalSetting.title = "新增";
                    Modal.show($scope.addModalSetting.id);
                },
                edit : function(assetCheckId){
                    $scope.addModalSetting.title = "编辑";
                    AssetCheckClient.query({id:assetCheckId},{},function(data){
                        $scope.initAssetCheck(data);
                        Modal.show($scope.addModalSetting.id);
                    },function(error){
                        $rootScope.$alert("获取资产信息失败!");
                    });
                },
                remove  : function(assetCheckId){    //单个删除类型
                    $rootScope.common.confirm("确定要删除么?",function(){
                        Loading.show();
                        AssetCheckClient.remove({id:assetCheckId},{},function(data){
                            Loading.hide();
                            $rootScope.$alert("删除成功!");
                            $scope.listPage.settings.reload();
                        },function(error){
                            Loading.hide();
                            $rootScope.$alert("删除失败!");
                        });
                    }," 删 除 ");
                },
                batchRemove : function(){   //批量删除类型
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择要删除的资产");
                    }else{
                        $rootScope.common.confirm("确定要删除么？",function(){
                            Loading.show();
                            AssetCheckClient.batchRemove({ids:$scope.listPage.checkedList},{},function(data){
                                Loading.hide();
                                $rootScope.$alert("删除成功!");
                                $scope.listPage.settings.reload();
                            },function(error){
                                Loading.hide();
                                $rootScope.$alert("删除失败!");
                                $scope.listPage.settings.reload();
                            });
                        }," 删 除 ");
                    }
                },
                check : function(assetCheckId,status){
                    $scope.modalPage.checkedList = [];
                    if(status == 0){  //开始盘点
                        AssetCheckClient.hasChecking({id:assetCheckId},{},function(data){
                            if(data.success == true){
                                $scope.listPage.settings.reload();
                                Modal.show($scope.checkModalSetting.id);
                                $scope.checkingId = assetCheckId;
                            }else{
                                $rootScope.$alert("存在未完成的盘点计划，不能开始盘点!");
                            }
                        },function(error){
                            $rootScope.$alert("开始盘点失败!");
                        });
                    }else if(status == 1){  //继续盘点
                        AssetCheckClient.getCheckedAssets({checkId:assetCheckId},{},function(data){
                            $scope.listPage.settings.reload();
                            $scope.modalPage.checkedList = data.ids;
                            Modal.show($scope.checkModalSetting.id);
                            $scope.checkingId = assetCheckId;
                        },function(error){
                            $rootScope.$alert("继续盘点失败!");
                        });
                    }
                },
                finishCheck : function(assetCheckId){
                    $rootScope.common.confirm("确定要生成差异表么?",function(){
                        Loading.show();
                        AssetCheckClient.finishCheck({id:assetCheckId},{},function(data){
                            Loading.hide();
                            $rootScope.$alert("生成成功!");
                            $scope.listPage.settings.reload();
                        },function(error){
                            Loading.hide();
                            $rootScope.$alert("生成失败!");
                        });
                    }," 生 成 ");
                },
                viewDifference : function(assetCheckId){
                    AssetInfoClient.getDifferenceAssets({assetCheckId:assetCheckId},{}, function (data) {
                        $scope.differenceList = data;
                        Modal.show($scope.differenceModalSetting.id);
                    },function(error){
                        $rootScope.$alert("获取差异表失败!");
                    });
                }
            }
        };

        //数据对象
        $scope.initAssetCheck = function(model){
            if(model){
                Util.init($scope.model,model);
            }else{
                Util.init($scope.model,{
                    id:null,
                    subject:null,
                    summary:null,
                    userId:null,
                    startDate:null,
                    endDate:null,
                    //数据展现字段，非表映射字段
                    startDateTime:null,
                    endDateTime:null
                });
            }
        };
        $scope.initModel = function(){
            $scope.model = {};
            $scope.initAssetCheck();
        };
        $scope.initModel();

        $scope.addModalSetting = {
            id: "addCheckModal",
            title: "新增",
            saveBtnText: "保存",
            saveBtnHide: false,
            saveDisabled: true,
            hiddenFn : function(){
                $scope.initAssetCheck();
            },
            save: function () {
                if($rootScope.compareStrDate($scope.model.startDateTime,$scope.model.endDateTime)){
                    Loading.show();
                    AssetCheckClient.save({},$scope.model,function(data){
                        Loading.hide();
                        Modal.hide($scope.addModalSetting.id);
                        $scope.listPage.settings.reload();
                    }, function (error) {
                        Loading.hide();
                        $rootScope.$alert("保存失败");
                    });
                }
            }
        };

        $scope.modalPage = {
            data : [],
            checkedList : [],
            checkAllRow : false,
            search : {limit: 10, offset: 0,orderBy: "updated", orderByType: "desc"},
            settings : {
                reload : null,
                pageSize : 10,
                getData:function(search,fnCallback){
                    $scope.modalPage.search.limit = search.limit;
                    $scope.modalPage.search.offset = search.offset;
                    $scope.modalPage.search.orderBy = search.orderBy;
                    $scope.modalPage.search.orderByType = search.orderByType;
                    AssetInfoClient.query($scope.modalPage.search, function (data) {
                        $scope.modalPage.data = data.rows;
                        fnCallback(data);
                    });
                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "资产编号",
                        mData:"serial",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资产名称",
                        mData:"name",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资产类型",
                        mData:"type",
                        mRender:function(mData,type,full) {
                            return $rootScope.getTypeName(mData);
                        }
                    },
                    {
                        sTitle: "资产状态",
                        mData:"status",
                        mRender:function(mData,type,full) {
                            return $rootScope.getStatusName(mData);
                        }
                    },
                    {
                        sTitle: "存放地",
                        mData:"storageLoc",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "责任人",
                        mData:"manager",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "使用部门",
                        mData:"depart",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "盘点",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            return '<div class="checkbox"><label><input type="checkbox" checklist-model="modalPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                        }
                    }
                ] ,
                columnDefs : [
                    { bSortable: false,aTargets:[7]},//列不可排序
                    { sWidth: "38px", aTargets: [7]}
                ] , //定义列的约束
                defaultOrderBy :[]  //定义默认排序为第x列倒序
            }
        };

        $scope.checkModalSetting = {
            id: "checkModal",
            title: "盘点",
            saveBtnText: "保存",
            saveBtnHide: false,
            saveDisabled: false,
            hiddenFn : function(){
                $scope.checkingId = null;
            },
            save: function () {
                if($scope.modalPage.checkedList.length==0){
                    $rootScope.$alert("请选择要盘点的资产");
                }else{
                    AssetCheckClient.saveCheck({checkId: $scope.checkingId,assetIds:$scope.modalPage.checkedList},{},function(data){
                        Modal.hide($scope.checkModalSetting.id);
                        $scope.listPage.settings.reload();
                    },function(error){
                        Loading.hide();
                        $rootScope.$alert("保存失败!");
                    });
                }
            }
        };

        $scope.differenceModalSetting = {
            id: "differenceModal",
            title: "资产差异表",
            saveBtnHide: true
        };

        $scope.$watch("[model.subject,model.userId,model.startDateTime,model.endDateTime]",function(newVal){
            if(Util.notNull(newVal[0], newVal[1], newVal[2], newVal[3])){
                $scope.addModalSetting.saveDisabled = false;
            }else{
                $scope.addModalSetting.saveDisabled = true;
            }
        },true);
        //watch checkall col
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

    controllers.controller('assetManagementController', ['$scope','$rootScope','Modal','Loading','Util','AssetInfoClient','MoClient','$timeout','AssetAbandonReasonClient', function ($scope,$rootScope,Modal,Loading,Util,AssetInfoClient,MoClient,$timeout,AssetAbandonReasonClient) {
        AssetAbandonReasonClient.query({limit: 10000, offset: 0,orderBy: "", orderByType: ""}, function (data) {
            $scope.reasonList = data.rows;
            Util.go($scope);
        });

        $scope.modalType = 0;  //0:默认, 1:增加, 2:编辑
        $scope.historyList = [];
        $scope.projectsUsers = [];
        $scope.getAssetInfo = function (assetInfoId, modalId) {
            AssetInfoClient.query({id: assetInfoId}, {}, function (data) {
                $scope.initAssetInfo(data);
                if($scope.model.assetInfo.access.projectsUsers){    //  a1,b1|a2,b2
                    var items = $scope.model.assetInfo.access.projectsUsers.split("|");
                    for(var i=0;i<items.length;i++){
                        var item = items[i];
                        var obj = {};
                        obj.project = item.split(",")[0];
                        obj.user = item.split(",")[1];
                        $scope.projectsUsers.push(obj);
                    }
                    $scope.model.assetInfo.access.projectsUsers = "";
                }

                if($scope.model.assetInfo.status != 1){
                    $scope.infoModalSetting.saveBtnHide = true;
                }
                Modal.show(modalId);
            }, function (error) {
                $rootScope.$alert("获取资产信息失败!");
            });
        };

        //资产类型列表的设置，操作
        $scope.listPage = {
            data : [],
            checkedList : [],
            checkAllRow : false,
            search : {limit: 20, offset: 0,orderBy: "", orderByType: ""},
            settings : {
                reload : null,
                getData:function(search,fnCallback){
                    Loading.show();
                    $scope.listPage.search.limit = search.limit;
                    $scope.listPage.search.offset = search.offset;
                    $scope.listPage.search.orderBy = search.orderBy;
                    $scope.listPage.search.orderByType = search.orderByType;
                    AssetInfoClient.query($scope.listPage.search, function (data) {
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    });
                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                        }
                    },
                    {
                        sTitle: "资产编号",
                        mData:"serial",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资产名称",
                        mData:"name",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "资产类型",
                        mData:"type",
                        mRender:function(mData,type,full) {
                            return $rootScope.getTypeName(mData);
                        }
                    },
                    {
                        sTitle: "资产状态",
                        mData:"status",
                        mRender:function(mData,type,full) {
                            return $rootScope.getStatusName(mData);
                        }
                    },
                    {
                        sTitle: "存放地",
                        mData:"storageLoc",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "责任人",
                        mData:"manager",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "使用部门",
                        mData:"depart",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "入库日期",
                        mData:"stockDate",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd");
                            }else return "";
                        }
                    },
                    {
                        sTitle: "更新时间",
                        mData:"updated",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd HH:mm:ss");
                            }else return "";
                        }
                    },
                    {
                        sTitle: "操作",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            var htmlStr = '';
                            if(full.status == 1){
                                htmlStr+='<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"></i>';
                            }else{
                                htmlStr+='<i title="查看" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"></i>';
                            }
                            htmlStr+='<i title="流程" class="fa fa-level-down" ng-click="listPage.action.changeStatus(\''+mData+'\')"></i>';
                            htmlStr+='<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                            htmlStr+='<i title="查看流程记录" class="fa fa-eye" ng-click="listPage.action.viewHistory(\''+mData+'\')"></i>';
                            return htmlStr;
                        }
                    }
                ] ,
                columnDefs : [
                    { bSortable: false,aTargets:[0,10]},//列不可排序
                    { sWidth: "38px", aTargets: [0]},
                    { sWidth: "130px", aTargets: [9]},
                    { sWidth: "120px", aTargets: [10]}
                ] , //定义列的约束
                defaultOrderBy :[[9,'desc']]  //定义默认排序为第x列倒序
            },
            action : {
                search: function(){
                    var startFlag = $rootScope.checkDateRange($scope.listPage.search.stockDateMin,$scope.listPage.search.stockDateMax);
                    if(startFlag){
                        $scope.listPage.settings.reload();
                    }
                },
                changeStatus : function(assetInfoId){
                    AssetInfoClient.query({id: assetInfoId}, {}, function (data) {
                        $scope.initAssetInfo(data);
                        Modal.show($scope.statusModalSetting.id);
                    }, function (error) {
                        $rootScope.$alert("获取资产信息失败!");
                    });
                },
                add : function (modalType) {
                    if(!modalType){
                        $scope.modalType = 1;
                    }
                    $scope.infoModalSetting.title = "新增";
                    Modal.show($scope.infoModalSetting.id);
                },
                edit : function(assetInfoId){
                    $scope.modalType = 2;
                    $scope.infoModalSetting.title = "编辑";
                    $scope.getAssetInfo(assetInfoId,$scope.infoModalSetting.id);
                },
                remove  : function(assetInfoId){    //单个删除类型
                    $rootScope.common.confirm("确定要删除么?",function(){
                        Loading.show();
                        AssetInfoClient.remove({id:assetInfoId},{},function(data){
                            Loading.hide();
                            $rootScope.$alert("删除成功!");
                            $scope.listPage.settings.reload();
                        },function(error){
                            Loading.hide();
                            $rootScope.$alert("删除失败!");
                        });
                    }," 删 除 ");
                },
                batchRemove : function(){   //批量删除类型
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择要删除的资产");
                    }else{
                        $rootScope.common.confirm("确定要删除么？",function(){
                            Loading.show();
                            AssetInfoClient.batchRemove({ids:$scope.listPage.checkedList},{},function(data){
                                Loading.hide();
                                $rootScope.$alert("删除成功!");
                                $scope.listPage.settings.reload();
                            },function(error){
                                Loading.hide();
                                $rootScope.$alert("删除失败!");
                                $scope.listPage.settings.reload();
                            });
                        }," 删 除 ");
                    }
                },
                addItem : function(){
                    var obj = {};
                    obj.project = $(".item-name").val();
                    obj.user = $(".item-user").val();
                    if(Util.notNull(obj.project,obj.user)){
                        $scope.projectsUsers.push(obj);
                        $(".item-name").val("");
                        $(".item-user").val("");
                    }else{
                        $rootScope.$alert("所属项目，项目负责人不能为空!");
                    }
                },
                removeItem : function() {
                    var objSelect = document.getElementById("item-content");
                    var length = objSelect.options.length - 1;
                    for (var i = length; i >= 0; i--) {
                        if (objSelect.options[i].selected == true) {
                            for(var j = 0;j<$scope.projectsUsers.length;j++){
                                if($scope.projectsUsers[j].project == objSelect.options[i].value){
                                   $scope.projectsUsers.splice(j,1);
                                }
                            }
                        }
                    }
                },
                addChild: function () {
                    var isExist = false;
                    var child = {};
                    Util.init(child, $scope.model.child);
                    if(child.serial == undefined){
                        $rootScope.$alert("分区编号不能为空!");
                    }else{
                        for(var i=0;i<$scope.model.assetInfo.access.children.length;i++){
                            if($scope.model.assetInfo.access.children[i].serial == child.serial){
                                isExist = true;
                                break;
                            }
                        }

                        if(isExist){
                            $rootScope.$alert("分区编号不能重复!");
                        }else{
                            $scope.model.assetInfo.access.children.push(child);
                            $scope.model.child = {};
                        }
                    }
                },
                removeChild: function (serial) {
                    for(var i=0;i<$scope.model.assetInfo.access.children.length;i++){
                        if($scope.model.assetInfo.access.children[i].serial == serial){
                            $scope.model.assetInfo.access.children.splice(i,1);
                        }
                    }
                },
                importData : function(){
                    Modal.show($scope.importModalSetting.id,400,180);
                },
                viewHistory : function(assetInfoId){
                    AssetInfoClient.getAssetHistory({id:assetInfoId},{}, function (data) {
                        $scope.historyList = data;
                        Modal.show($scope.historyModalSetting.id);
                    },function(error){
                        $rootScope.$alert("获取历史记录失败!");
                    });
                }
            }
        };

        //数据对象
        $scope.initAssetInfo = function(assetInfo){
            if(assetInfo){
                Util.init($scope.model.assetInfo,assetInfo);
            }else{
                Util.init($scope.model.assetInfo,{
                    //主表字段
                    id:null,
                    type:null,
                    status:null,
                    serial:null,
                    name:null,
                    storageLoc:null,
                    manager:null,
                    depart:null,
                    stockDate:null,
                    loanDate:null,
                    receiveDate:null,
                    abandonDate:null,
                    abandonReason:null,
                    stopDate:null,
                    stopReason:null,
                    repairStartDate:null,
                    repairEndDate:null,
                    repairReason:null,
                    maintainStartDate:null,
                    maintainEndDate:null,
                    maintainSummary:null,
                    //关联子表
                    access:{}
                });
            }
        };
        $scope.initModel = function(){
            $scope.model={
                assetInfo:{},
                child:{}
            };
            $scope.initAssetInfo();
        };
        $scope.initModel();

        //增加assetInfo dialog(新增，编辑)
        $scope.infoModalSetting = {
            id: "addInfoModal",
            title: "新增",
            saveBtnText: "保存",
            saveBtnHide: false,
            saveDisabled: true,
            hiddenFn : function(){
                $scope.infoModalSetting.saveBtnHide = false;
                $scope.initAssetInfo();
                $scope.projectsUsers = [];
                if($scope.isSync){
                    $scope.isSync = false;
                    $scope.assetNameFromLib="";
                }
            },
            save: function () {
                Loading.show();
                for(var i=0;i<$scope.projectsUsers.length;i++){   //仅硬件设备有此字段
                    var item = $scope.projectsUsers[i];
                    if($scope.model.assetInfo.access.projectsUsers){
                        $scope.model.assetInfo.access.projectsUsers += "|" + item.project + "," + item.user;
                    }else{
                        $scope.model.assetInfo.access.projectsUsers = item.project + "," + item.user;
                    }
                }
                AssetInfoClient.save({}, $scope.model.assetInfo, function (data) {
                    Loading.hide();
                    if (data.isSuccess == true) {
                        Modal.hide($scope.infoModalSetting.id);
                        $scope.listPage.settings.reload();
                    } else if(data.isSuccess == false){
                        if(data.isExist == true){
                            $rootScope.$alert("保存失败:资产编号重复!");
                        }else{
                            $rootScope.$alert("保存失败!");
                        }
                    }
                }, function (error) {
                    Loading.hide();
                    $rootScope.$alert("保存失败");
                });
            }
        };

        //状态切换
        $scope.statusModalSetting = {
            id: "changeStatusModal",
            title: "流程",
            saveBtnText: "保存",
            saveBtnHide: false,
            saveDisabled: false,
            hiddenFn: function () {
                $scope.initAssetInfo();
            },
            save: function () {
                if($scope.model.assetInfo.status == 4 && !$rootScope.compareStrDate($scope.model.assetInfo.repairStartDate,$scope.model.assetInfo.repairEndDate)){
                    return;
                }
                if($scope.model.assetInfo.status == 5 && !$rootScope.compareStrDate($scope.model.assetInfo.maintainStartDate,$scope.model.assetInfo.maintainEndDate)){
                    return;
                }
                Loading.show();
                AssetInfoClient.saveStatus({}, $scope.model.assetInfo, function (data) {
                    Loading.hide();
                    if (data.isSuccess == true) {
                        Modal.hide($scope.statusModalSetting.id);
                        $scope.listPage.settings.reload();
                    } else{
                        $rootScope.$alert("保存失败!");
                    }
                }, function (error) {
                    Loading.hide();
                    $rootScope.$alert("保存失败");
                });
            }
        };

        //导入 dialog
        $scope.importModalSetting = {
            id: "importModal",
            title: "导入",
            saveBtnText: "导入",
            saveBtnHide: false,
            saveDisabled: false,
            save: function () {
                Loading.show();
                jQuery.ajaxFileUpload({
                    url: "../dmonitor-webapi/asset/info/importData",
                    fileElementId: "excelUploadInput",
                    dataType: 'json',
                    success: function (data, status) {
                        Loading.hide();
                        if(data.success == true){
                            Modal.hide($scope.importModalSetting.id);
                            $scope.listPage.settings.reload();
                        }else{
                            if(data.errorCode == 10205){
                                $rootScope.$alert("请上传文件");
                            }else{
                                $rootScope.$alert("导入失败");
                            }
                        }
                    },
                    error: function (data, status, e) {
                        Loading.hide();
                        $rootScope.$alert("导入失败");
                    }
                });
            }
        };

        //历史操作记录
        $scope.historyModalSetting = {
            id: "historyModal",
            title: "查看操作记录",
            saveBtnHide: true
        };

        //类型切换，初始化数据
        $scope.$watch("model.assetInfo.type",function (newVal) {
            if(newVal && $scope.modalType==1){
                $scope.initModel();
                $scope.model.assetInfo.status = 1;  //默认为未用
                $scope.model.assetInfo.type = newVal;
                if(newVal == "UM" || newVal == "DA"){
                    $scope.model.assetInfo.access.children = [];
                }
                if($scope.isSync){
                    $scope.model.assetInfo.name = $scope.assetNameFromLib;
                }
            }
        });
        //watch addInfoModal
        $scope.$watch("[model.assetInfo.status,model.assetInfo.type,model.assetInfo.serial,model.assetInfo.name,model.assetInfo.storageLoc,model.assetInfo.manager,model.assetInfo.stockDate]", function (newVal) {
            if (Util.notNull(newVal[0], newVal[1], newVal[2], newVal[3],newVal[4],newVal[5],newVal[6])) {
                $scope.infoModalSetting.saveDisabled = false;
            } else {
                $scope.infoModalSetting.saveDisabled = true;
            }
        }, true);

        //watch changeStatusModal
        $scope.$watch("[model.assetInfo.status,model.assetInfo.storageLoc,model.assetInfo.manager,model.assetInfo.depart,model.assetInfo.stopDate,model.assetInfo.stopReason,model.assetInfo.repairReason,model.assetInfo.repairStartDate,model.assetInfo.repairEndDate,model.assetInfo.maintainStartDate,model.assetInfo.maintainEndDate,model.assetInfo.maintainSummary,model.assetInfo.abandonReason,model.assetInfo.abandonDate,model.assetInfo.loanDate,model.assetInfo.receiveDate]", function (newVal) {
            if(newVal[0] == 1 || newVal[0] == 2) {
                if(Util.notNull(newVal[1],newVal[2])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }else if(newVal[0] == 3) {  //停用
                if(Util.notNull(newVal[4],newVal[5])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }else if(newVal[0] == 4) {  //在修
                if(Util.notNull(newVal[6],newVal[7],newVal[8])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }else if(newVal[0] == 5) {  //维保
                if(Util.notNull(newVal[9],newVal[10],newVal[11])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }else if(newVal[0] == 6) {  //报废
                if(Util.notNull(newVal[12],newVal[13])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }else if(newVal[0] == 7){  //出借
                if(Util.notNull(newVal[14],newVal[3])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }else if(newVal[0] == 8){  //领用
                if(Util.notNull(newVal[15],newVal[3])){
                    $scope.statusModalSetting.saveDisabled = false;
                }else{
                    $scope.statusModalSetting.saveDisabled = true;
                }
            }
        }, true);

            //watch checkall col
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

        //sync from mo lib
        $scope.isSync = false;
        $scope.assetNameFromLib="";
        var moId = "";
        var url_param = window.location.href.split("?");
        if(url_param.length==2){
            var array = url_param[1].split("=");
            moId = array[1];

            $timeout(function(){
                MoClient.query({id:moId},{},function(data) {
                    var mo = data.mo;
                    $scope.isSync = true;
                    $scope.assetNameFromLib=mo.displayName;
                    $scope.model.assetInfo.name = mo.displayName;
                    $scope.listPage.action.add($scope.modalType);
                });
            },300);
        }
    }]);

    controllers.controller('propertyController', ['$scope','$rootScope','Util','AssetAlarmClient', function ($scope,$rootScope,Util,AssetAlarmClient) {
        $scope.model={
            maintain:{
                id:null,
                type:null,
                method:null,
                interval:null,
                days:null
            },
            abandon:{
                id:null,
                type:null,
                method:null,
                interval:null,
                days:null
            }
        };

        AssetAlarmClient.query({},function(data){
            Util.init($scope.model,data);
        });

        $scope.saveMaintainProperty = function(){
            AssetAlarmClient.update({},$scope.model.maintain,function(data){
                $rootScope.$alert("保存成功");
            }, function (error) {
                $rootScope.$alert("保存失败");
            });
        };
        $scope.saveAbandonProperty = function(){
            AssetAlarmClient.update({},$scope.model.abandon,function(data){
                $rootScope.$alert("保存成功");
            }, function (error) {
                $rootScope.$alert("保存失败");
            });
        };
    }]);

    controllers.controller('abandonReasonController', ['$scope','$rootScope','Modal','Loading','Util','AssetAbandonReasonClient', function ($scope,$rootScope,Modal,Loading,Util,AssetAbandonReasonClient) {
        $scope.modalType = 0;  //0:默认, 1:增加, 2:编辑
        $scope.listPage = {
            data : [],
            checkedList : [],
            checkAllRow : false,
            search : {limit: 20, offset: 0,orderBy: "", orderByType: ""},
            settings : {
                reload : null,
                getData:function(search,fnCallback){
                    Loading.show();
                    $scope.listPage.search.limit = search.limit;
                    $scope.listPage.search.offset = search.offset;
                    $scope.listPage.search.orderBy = search.orderBy;
                    $scope.listPage.search.orderByType = search.orderByType;
                    AssetAbandonReasonClient.query($scope.listPage.search, function (data) {
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    });
                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                        }
                    },
                    {
                        sTitle: "报废原因",
                        mData:"name",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "报废说明",
                        mData:"content",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "更新时间",
                        mData:"updated",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd HH:mm:ss");
                            }else
                                return "";
                        }
                    },
                    {
                        sTitle: "操作",
                        mData:"id",
                        mRender:function(mData,type,full) {
                            var htmlStr = "";
                            htmlStr += '<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"></i>';
                            htmlStr += '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                            return htmlStr;
                        }
                    }
                ] ,
                columnDefs : [
                    { bSortable: false,aTargets:[0,4]},//列不可排序
                    { sWidth: "38px", aTargets: [0]},
                    { sWidth: "120px", aTargets: [4]}
                ] , //定义列的约束
                defaultOrderBy :[[3]]  //定义默认排序为第x列倒序
            },
            action : {
                search: function(){
                    $scope.listPage.settings.reload();
                },
                add : function () {
                    $scope.modalType = 1;
                    $scope.addModalSetting.title = "新增";
                    Modal.show($scope.addModalSetting.id);
                },
                edit : function(reasonId){
                    $scope.modalType = 2;
                    $scope.addModalSetting.title = "编辑";
                    AssetAbandonReasonClient.query({id:reasonId},{},function(data){
                        $scope.initAbandonReason(data);
                        Modal.show($scope.addModalSetting.id);
                    },function(error){
                        $rootScope.$alert("获取信息失败!");
                    });
                },
                remove  : function(reasonId){    //单个删除类型
                    $rootScope.common.confirm("确定要删除么?",function(){
                        Loading.show();
                        AssetAbandonReasonClient.remove({id:reasonId},{},function(data){
                            Loading.hide();
                            if(data.isSuccess == true){
                                $rootScope.$alert("删除成功!");
                                $scope.listPage.settings.reload();
                            }else{
                                $rootScope.$alert("存在关联资产，无法删除！!");
                            }
                        },function(error){
                            Loading.hide();
                            $rootScope.$alert("删除失败!");
                        });
                    }," 删 除 ");
                },
                batchRemove : function(){   //批量删除类型
                    if($scope.listPage.checkedList.length==0){
                        $rootScope.$alert("请选择要删除的报废原因");
                    }else{
                        $rootScope.common.confirm("确定要删除么？",function(){
                            Loading.show();
                            AssetAbandonReasonClient.batchRemove({ids:$scope.listPage.checkedList},{},function(data){
                                Loading.hide();
                                if(data.isSuccess == true){
                                    $rootScope.$alert("删除成功!");
                                    $scope.listPage.settings.reload();
                                }else{
                                    $rootScope.$alert("存在关联资产，无法删除！!");
                                }
                            },function(error){
                                Loading.hide();
                                $rootScope.$alert("删除失败!");
                                $scope.listPage.settings.reload();
                            });
                        }," 删 除 ");
                    }
                }
            }
        };

        //数据对象
        $scope.initAbandonReason = function(model){
            if(model){
                Util.init($scope.model,model);
            }else{
                Util.init($scope.model,{
                    id:null,
                    name:null,
                    content:null,
                    updated:null
                });
            }
        };
        $scope.initModel = function(){
            $scope.model = {};
            $scope.initAbandonReason();
        };
        $scope.initModel();

        $scope.addModalSetting = {
            id: "addAbandonReasonModal",
            title: "新增",
            saveBtnText: "保存",
            saveBtnHide: false,
            saveDisabled: true,
            hiddenFn : function(){
                $scope.initAbandonReason();
            },
            save: function () {
                Loading.show();
                AssetAbandonReasonClient.save({},$scope.model,function(data){
                    Loading.hide();
                    if(data.isExist == true){
                        $rootScope.$alert("报废原因不能重复！");
                    }else{
                        if(data.isSuccess == true){
                            Modal.hide($scope.addModalSetting.id);
                            $scope.listPage.settings.reload();
                        }else{
                            $rootScope.$alert("保存失败");
                        }
                    }
                }, function (error) {
                    Loading.hide();
                    $rootScope.$alert("保存失败");
                });
            }
        };

        $scope.$watch("model.name",function(newVal){
            if(Util.notNull(newVal)){
                $scope.addModalSetting.saveDisabled = false;
            }else{
                $scope.addModalSetting.saveDisabled = true;
            }
        },true);
        //watch checkall col
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
})(angular);