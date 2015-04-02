(function (angular) {

    angular.module('room.event', [])
        .controller('roomEventCtrl', ['$scope', '$rootScope', 'Util', '$timeout', 'RoomClient', 'Modal', 'Loading', '$routeParams', 'Tools','$location','LocationClient',
            function ($scope, $rootScope, Util, $timeout, RoomClient, Modal, Loading, $routeParams, Tools,$location,LocationClient) {

                LocationClient.queryJf(function(data){
                    $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
                });

                if($location.$$path.indexOf("roomAlarmEventHistory")>=0){
                    $scope.type=1;  //0 即时告警，1历史告警
                }else{
                    $scope.type=0;  //0 即时告警，1历史告警
                }


                $scope.isLeaf = function (nodeData) {
                    return nodeData.id == -1 || nodeData.isJF;
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
                        type: $scope.type,
                        mocpId: 8,
                        mocId: "",
                        jfId: "",
                        moName: "",
                        confirmStatus: "",
                        indicatorId: "",
                        metricId: "",
                        level: [2, 3, 4, 5, 6],
                        limit: 20, //每页条数(即取多少条数据)
                        offset: 0, //从第几条数据开始取
                        orderBy: "alarmTime",//排序字段
                        orderByType: "desc" //排序顺序
                    },
                    action: {
                        search: function () {
                            $scope.roomListPage.settings.reload(true);
                        }
                    }
                };

                Util.delay("alarm.ready", function () {
                    $scope.searchPage.datas.mocs = Util.findFromArray("id", $scope.searchPage.data.mocpId, $rootScope.alarm.mocTree)["children"];
                    $scope.searchPage.datas.mocs.splice(0, 1);
                }, $rootScope);

                $scope.$watch("searchPage.data.mocId", function (newVal, oldVal) {
                    $scope.searchPage.data.metricsId = "";
                    $scope.searchPage.data.indicatorId = "";
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


                $scope.search = function () {
                    $scope.roomListPage.settings.reload(true);
                };

                //listPage部分
                //scope定义
                $scope.roomListPage = {
                    data: [],
                    checkedList: [],
                    checkAllRow: false,
                    users: [],
                    ready: false
                };

                $scope.eventDetail = {};

                $scope.roomListPage.action = {
                    search: function (search, fnCallback) {
                        Util.delay("resource.ready",function(){
                        $scope.searchPage.data.limit = search.limit;
                        $scope.searchPage.data.offset = search.offset;
                        $scope.searchPage.data.orderBy = search.orderBy;
                        $scope.searchPage.data.orderByType = search.orderByType;

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
                        RoomClient.getCurrentEvent($scope.searchPage.data, function (data) {
                            Loading.hide();
                            $scope.roomListPage.data = data.rows;
                            fnCallback(data);
                            $scope.roomListPage.checkedList = [];
                            $scope.roomListPage.checkAllRow = false;
                        }, function (data) {
                            Loading.hide();
                        });
                        },$rootScope);
                    }
                };
                $scope.roomListPage.settings = {
                    reload: null,
                    getData: $scope.roomListPage.action.search,//getData应指定获取数据的函数
                    columns: [
                        {
                            sTitle: "规则名称",
                            mData: "alarmRuleId",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(full['ruleName']);
                            }
                        },
                        {
                            sTitle: "资源实例",
                            mData: "moId",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(full['moName']);
                            }
                        },
                        {
                            sTitle: "告警等级",
                            mData: "level",
                            mRender: function (mData, type, full) {
                                var l = Util.findFromArray("value", mData, $scope.levels);
                                return l ? l.label : '';
                            }
                        },
                        {
                            sTitle: "资源类型",
                            mData: "mocId",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(full['mocName']);
                            }
                        },
                        {
                            sTitle: "资源指标",
                            mData: "metricsId",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(full['metricName']);
                            }
                        },
                        {
                            sTitle: "所属机房",
                            mData: "jfId",
                            mRender: function (mData, type, full) {
                                var loc = $rootScope.resource.getLocation(mData);
                                if (loc != null) {
                                    return Util.str2Html(loc.name);
                                } else {
                                    return mData;
                                }
                            }
                        },
                        {
                            sTitle: "告警时间",
                            mData: "alarmTime",
                            mRender: function (mData, type, full) {
                                if (mData) {
                                    var t = mData;
                                    var d = new Date(t);
                                    return Util.str2Html(d.pattern("yyyy-MM-dd HH:mm:ss"));
                                } else return "";
                            }
                        },
                        {
                            sTitle: "告警内容",
                            mData: "alarmContext",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(mData);
                            }
                        },
                        {
                            sTitle: "恢复时间",
                            mData: "recoveryTime",
                            mRender: function (mData, type, full) {
                                if (mData) {
                                    var t = mData;
                                    var d = new Date(t);
                                    return Util.str2Html(d.pattern("yyyy-MM-dd HH:mm:ss"));
                                } else return "";
                            }
                        },
                        {
                            sTitle: "恢复内容",
                            mData: "recoveryContext",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(mData);
                            }
                        }
                    ], //定义列的形式,mRender可返回html
                    columnDefs: [
                        { sWidth: "85px", aTargets: [2] },
                        { bSortable: false, aTargets: [] },
                        { bVisible: false, aTargets: ($scope.type==0?[8,9]:[]) }
                    ], //定义列的约束
                    defaultOrderBy: [
                        [ 6, "desc" ]
                    ]  //定义默认排序列为第7列倒序
                };


            }]);
})(angular);

