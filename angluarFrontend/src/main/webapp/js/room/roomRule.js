(function (angular) {

    angular.module('room.rule', [])
        .controller('roomRuleCtrl', ['$scope', '$rootScope', 'Util', '$timeout', 'RoomClient', 'Modal', 'Loading', '$routeParams',"Tools",'$filter','LocationClient',
            function ($scope, $rootScope, Util, $timeout, RoomClient, Modal, Loading, $routeParams,Tools,$filter,LocationClient) {

                LocationClient.queryJf(function(data){
                    $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
                });

                $scope.editsd = function(){
                    if(jQuery("#ccc").css('display')=='none'){
                        jQuery("#ccc").show();
                        jQuery("#downedit").hide();
                        jQuery("#upedit").show();
                    }else{
                        jQuery("#ccc").hide();
                        jQuery("#downedit").show();
                        jQuery("#upedit").hide();
                    }
                };

                $scope.isLeaf = function(nodeData){
                    return nodeData.id==-1 || nodeData.isJF;
                };

                $scope.levels=[
                    {"label":'<img ng-src="img/alarm/6.png"/>',"value":6},
                    {"label":'<img ng-src="img/alarm/5.png"/>',"value":5},
                    {"label":'<img ng-src="img/alarm/4.png"/>',"value":4},
                    {"label":'<img ng-src="img/alarm/3.png"/>',"value":3},
                    {"label":'<img ng-src="img/alarm/2.png"/>',"value":2}
                ];

                $scope.searchPage = {
                    datas: {},
                    data: {
                        mocpId: 8,
                        mocId: "",
                        jfId: "",
                        moName: "",
                        active: "",
                        displayName: "",
                        indicatorId: "",
                        metricId: "",
                        level: [2, 3, 4, 5, 6],
                        limit: 20, //每页条数(即取多少条数据)
                        offset: 0, //从第几条数据开始取
                        orderBy: "updated",//排序字段
                        orderByType: "desc" //排序顺序
                    },
                    action: {
                        search: function () {
                            $scope.roomListPage.settings.reload(true);
                        }
                    }
                };

                Util.delay("alarm.ready",function(){
                    $scope.searchPage.datas.mocs = Util.findFromArray("id",$scope.searchPage.data.mocpId,$rootScope.alarm.mocTree)["children"];
                    $scope.searchPage.datas.mocs.splice(0,1);
                },$rootScope);

                $scope.$watch("searchPage.data.mocId", function (newVal, oldVal) {
                    $scope.searchPage.data.indicatorId = "";
                    $scope.searchPage.data.metricsId = "";
                    $scope.searchPage.datas.indicators = [];
                    if (Util.notNull(newVal)) {
                        RoomClient.getMetricByMocId({rule: 'alarm', mocId: newVal}, {}, function (data) {
                            $scope.searchPage.datas.indicators = data;
                        });
                    }
                }, false);

                $scope.$watch("searchPage.data.indicatorId", function (newVal, oldVal) {
                    $scope.searchPage.data.metricsId = "";
                    $scope.searchPage.datas.metrics = [];
                    if (Util.notNull(newVal)) {
                        $scope.searchPage.datas.metrics = Util.findFromArray("id", newVal, $scope.searchPage.datas.indicators)["children"];
                    }
                }, false);




                    $scope.model={level:4};
                    $rootScope.opValue = "gt";

                    $scope.search = function(){
                        $scope.roomListPage.settings.reload(true);
                    };

                    $scope.alarmEditDialog=Tools.dialog({
                        id:"alarmEditDialog1",
                        title:"编辑",
                        hiddenButton:true,
                        save:function(){
                            $scope.model.workingDay = $scope.roomListPage.modelPlus.workingDay.join(",");
                            if(!$scope.model.workingDay || $scope.model.workingDay==""){
                                $scope.model.workingDay = "1,2,3,4,5,6,7";
                            }
                            $scope.model.workingTime=$scope.roomListPage.modelPlus.startTime+"-"+$scope.roomListPage.modelPlus.endTime;

                            if($scope.roomListPage.modelPlus.enum){
                                $scope.model.positive = true;
                                $scope.model.high = null;
                            }
                            if(($scope.model.high+"")==""){
                                $scope.model.high = null;
                            }
                            if(($scope.model.low+"")==""){
                                $scope.model.low = null;
                            }

                            $scope.model.recoveryDelay = $scope.model.occursDelay;

                            RoomClient.editRule($scope.model,function(data){
                                $scope.alarmEditDialog.hide();
                                $scope.roomListPage.settings.reload(true);
                            });
                        }
                    });

                    $scope.$watch("$root.opValue",function(newVal, oldVal){
                        $scope.model.positive = newVal != "lt";
                    },true);

                    $scope.$watch("model.positive",function(newVal, oldVal){
                        $rootScope.opValue = newVal? "gt":"lt";
                    },false);

                    $scope.$watch("model.mocId",function(newVal, oldVal){
                        if(oldVal!=newVal && Util.notNull(newVal)) {
                            RoomClient.getMetricByMocId({rule: 'alarm', mocId: newVal}, {}, function (data) {
                                if(data.length>0){
                                    var rows=null;
                                    for(var i=0;i<data.length;i++){
                                        if(data[i].name==angular.element("#jmocid3 option[value='"+$scope.model.mocId+"']").text()) rows=data[i];
                                    }
                                }
                            });
                            RoomClient.getMoByMocId({mocId:newVal},{},function(data){
                                var mocName="";
                                $.each($rootScope.alarm.mocTree,function(a,v){
                                    $.each(v.children,function(b,v2){
                                        if(v2.id==newVal){
                                            mocName = v2.displayName;
                                            return ;
                                        }
                                    });
                                });
                            });
                        }
                    },false);

//roomListPage部分
//scope定义
                    $scope.roomListPage = {
                        data:[],
                        checkedList : [],
                        checkAllRow : false,
                        modelPlus : {
                            isLeaf : function(nodeData){
                                if (nodeData.isParent != null && nodeData.isParent){
                                    return false;
                                }else{
                                    return true;
                                }
                            },
                            noZero : function(str){
                                var temp = Number(str);
                                return temp+"";
                            }
                        }
                    };

                    $scope.roomListPage.action = {
                        add: function () {
                            $rootScope.resource.showRoomSyncPage(
                                //同步结束后的动作
                                function(){
                                    $scope.roomListPage.settings.reload(true);
                                },
                                //modal框关闭时的动作
                                function(){

                                }
                            );
                        },
                        edit :function(id){
                            var model=Util.findFromArray("id",id,$scope.roomListPage.data);
                            $scope.model=angular.copy(model);

                            if($scope.model.workingDay){
                                $scope.roomListPage.modelPlus.workingDay = $scope.model.workingDay.split(",");
                            }
                            if(!$scope.roomListPage.modelPlus.workingDay || $scope.roomListPage.modelPlus.workingDay.length==0){
                                $scope.roomListPage.modelPlus.workingDay = ["1","2","3","4","5","6","7"];
                            }
                            for(var i=0;i<$scope.roomListPage.modelPlus.workingDay.length;i++){
                                $scope.roomListPage.modelPlus.workingDay[i] = Number($scope.roomListPage.modelPlus.workingDay[i]);
                            }

                            if($scope.model.workingTime && $scope.model.workingTime.split("-").length==2){
                                $scope.roomListPage.modelPlus.startTime = $scope.roomListPage.modelPlus.noZero($scope.model.workingTime.split("-")[0]);
                                $timeout(function(){
                                    $scope.roomListPage.modelPlus.endTime = $scope.roomListPage.modelPlus.noZero($scope.model.workingTime.split("-")[1]);
                                },100);
                            }else{
                                $scope.roomListPage.modelPlus.startTime = "0" ;
                                $timeout(function(){
                                    $scope.roomListPage.modelPlus.endTime = "24";
                                },100);
                            }
                            RoomClient.getUserGroups(function (data) {
                                $scope.roomListPage.modelPlus.notifyUserGroups = data.rows;
                            });

                            $scope.roomListPage.modelPlus.enum = $scope.model.metric.valType == "enum";
                            $scope.roomListPage.modelPlus.enumMap = $scope.model.metric.enumMap;

                            $scope.alarmEditDialog.show();
                        },
                        batchActive :function(flag){
                            if($scope.roomListPage.checkedList.length==0){
                                $rootScope.$alert("请选择规则");
                            }else{
                                Loading.show();
                                RoomClient.activeRule({ids:$scope.roomListPage.checkedList,active:flag},{},function(data){
                                    Loading.hide();
                                    if(data.success){
                                        $scope.roomListPage.settings.reload(true);
                                    }else{
                                        $rootScope.$alert("操作失败:"+data.message);
                                    }
                                },function(error){
                                    Loading.hide();
                                });
                            }
                        },
                        active :function(id,flag){
                            Loading.show();
                            RoomClient.activeRule({ids:[id],active:flag},{},function(data){
                                Loading.hide();
                                if(data.success){
                                    $scope.roomListPage.settings.reload(true);
                                }else{
                                    $rootScope.$alert("操作失败:"+data.message);
                                }
                            },function(error){
                                Loading.hide();
                            });
                        },
                        search:function(search,fnCallback){
                            Util.delay("resource.ready",function(){
                            $scope.searchPage.data.limit = search.limit;
                            $scope.searchPage.data.offset = search.offset;
                            $scope.searchPage.data.orderBy = search.orderBy;
                            $scope.searchPage.data.orderByType  = search.orderByType;

                            var startFlag = Util.notNull($scope.searchPage.data.starttime);
                            var endFlag = Util.notNull($scope.searchPage.data.endtime);
                            if(startFlag && endFlag){
                                var start=$scope.searchPage.data.starttime+":00";
                                var ed=$scope.searchPage.data.endtime+":00";
                                var begin = new Date(Date.parse(start.replace(/-/g,   "/"))).getTime();
                                var end = new Date(Date.parse(ed.replace(/-/g,   "/"))).getTime();
                                if(end<begin){
                                    $rootScope.$alert("日期范围错误");
                                    return;
                                }
                            }else if(startFlag){
                                $rootScope.$alert("请输入结束时间");
                                return;
                            }else if(endFlag){
                                $rootScope.$alert("请输入开始时间");
                                return;
                            }
                            Loading.show();
                            RoomClient.getRules($scope.searchPage.data,function(data){
                                $scope.roomListPage.data =data.rows;
                                fnCallback(data);
                                $scope.roomListPage.checkedList = [];
                                $scope.roomListPage.checkAllRow = false;
                                Loading.hide();
                            },function(error){
                                Loading.hide();
                            });
                            },$rootScope);
                        }
                    };

                    $scope.roomListPage.settings = {
                        reload : null,
                        getData:$scope.roomListPage.action.search, //getData应指定获取数据的函数
                        columns : [
                            {
                                sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='roomListPage.checkAllRow'><i></i></label></div>",
                                mData:"id",
                                mRender:function(mData,type,full) {
                                    return '<div class="checkbox"><label><input type="checkbox" checklist-model="roomListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                                }
                            },
                            {
                                sTitle: "所属机房",
                                mData:"jfId",
                                mRender:function(mData,type,full) {
                                    var loc = $rootScope.resource.getLocation(mData);
                                    if(loc!=null){
                                        return Util.str2Html(loc.name);
                                    }else{
                                        return mData;
                                    }
                                }
                            },
                            {
                                sTitle: "规则名称",
                                mData:"displayName",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(mData);
                                }
                            },
                            {
                                sTitle: "规则状态",
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
                                sTitle: "告警等级",
                                mData:"level",
                                mRender:function(mData,type,full) {
                                    return Util.findFromArray("value",mData,$scope.levels)["label"];
                                }
                            },
                            {
                                sTitle: "资源实例",
                                mData:"moId",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(full["moName"]);
                                }
                            },
                            {
                                sTitle: "资源类型",
                                mData:"mocId",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(full["mocName"]);
                                }
                            },
                            {
                                sTitle: "资源指标",
                                mData:"metricsId",
                                mRender:function(mData,type,full) {
                                    return Util.str2Html(full["metricName"]);
                                }
                            },
                            {
                                sTitle: "阈值条件",
                                mData:"id",
                                mRender:function(mData,type,full) {
                                    var str = "";
                                    if(full.metric.valType=="enum"){
                                        var enumMap = full.metric.enumMap;
                                        for(var key in enumMap){
                                            var list = enumMap[key];
                                            var flag = false;
                                            for(var i in list){
                                                if(list[i]==full.low){
                                                    flag = true;
                                                    break;
                                                }
                                            }
                                            if(flag){
                                                str = " == "+key;
                                                break;
                                            }
                                        }
                                    }else{
                                        var op = full.positive?" >= ":" <= ";
                                        var unit = full.metric.unit;
                                        var hasLow = full.low!=null && (full.low+"")!="";
                                        var hasHigh = full.high!=null && (full.high+"")!="";
                                        if(hasLow){
                                            str += (full.positive?"高限:":"低限")+op+full.low+" "+unit+" ";
                                        }
                                        if(hasHigh){
                                            str += (full.positive?"超高限:":"超低限")+op+full.high+" "+unit;
                                        }
                                    }
                                    if(str==""){
                                        return "<span style='color:red'>未设置</span>";
                                    }else{
                                        return Util.str2Html(str);
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
                                        return Util.str2Html(d.pattern("yyyy-MM-dd HH:mm:ss"));
                                    }else return "";
                                }
                            },
                            {
                                sTitle: "操作",
                                mData:"id",
                                mRender:function(mData,type,full) {
                                    var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                                    if(disabledOp){
                                        return '<i title="编辑" class="fa fa-pencil" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>'+
                                            '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                                    }else{
                                        return '<i title="编辑" class="fa fa-pencil" ng-click="roomListPage.action.edit(\''+mData+'\')" > </i>'+
                                            '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="roomListPage.action.active(\''+mData+'\','+(full.active?'false':'true')+')"></i>';
                                    }
                                }
                            }
                        ] , //定义列的形式,mRender可返回html
                        columnDefs : [
                            { bSortable: false, aTargets: [ 0,8,10 ] },
                            { sWidth: "38px", aTargets: [ 0 ] },
                            { sWidth: "85px", aTargets: [ 3,4 ] },
                            { sWidth: "70px", aTargets: [ 10 ] }
//                { bVisible: false, aTargets: [ 0 ] }
                        ] , //定义列的约束
                        defaultOrderBy : []  //定义默认排序列为第8列倒序
                    };

                    $scope.$watch("roomListPage.checkAllRow",function(newVal,oldVal){
                        if(newVal){
                            $scope.roomListPage.checkedList = Util.copyArray("id",$scope.roomListPage.data);
                        }else{
                            if($scope.roomListPage.data.length == $scope.roomListPage.checkedList.length){
                                $scope.roomListPage.checkedList = [];
                            }
                        }
                    },false);

                    $scope.$watch("roomListPage.checkedList",function(newVal,oldVal){
                        $scope.roomListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.roomListPage.data.length;
                    },true);

                    $scope.$watch("roomListPage.modelPlus.startTime",function(newVal, oldVal){
                        if(newVal){
                            $scope.roomListPage.modelPlus.endTimes = $filter('loop')([],Number(newVal)+1,24,1);
                            if (Number(newVal) >= Number($scope.roomListPage.modelPlus.endTime)){
                                $scope.roomListPage.modelPlus.endTime = Number(newVal)+1;
                            }
                        }
                    });
            }]);
})(angular);

