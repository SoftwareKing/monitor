(function (angular) {

    angular.module('dnt.simulation.controllers', [])
        .controller('simulationController', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', 'utilTools', 'Modal', 'Util', 'Loading','simulationViewService','simulationNodeService',
            function ($scope, $rootScope, $routeParams, $http, $timeout, utilTools, Modal, Util, Loading,simulationViewService,simulationNodeService) {

                <!-- 初始化面包线 开始 -->
                $scope.navigation = {
                    data: {
                        navigationparent: "",
                        navigationchildren: ""
                    },
                    init: function () {
                        $scope.navigation.data.navigationparent = "视图";
                        $scope.navigation.data.navigationchildren = "业务影响";
                    }
                };
                <!-- 初始化面包线 结束 -->

                <!-- 拓扑树 开始 -->
                $scope.simulationViewTree = {
                    treeId: "simulationViewTree",
                    hideButton: $rootScope.loginUserMenuMap[$rootScope.currentView],
                    init: function () {
                        simulationViewService.queryBusinessTree({}, {}, function (tree) {
                            if (tree.result == "success") {
                                $scope.simulationViewTree.data = tree.msg;
                                if (tree.msg.length > 0  && tree.msg[0].children.length > 0) {
                                    simulationCommon.currentView = tree.msg[0].children[0].id;//当前视图
                                    simulationCommon.currentViewName = tree.msg[0].children[0].name;
                                }
                            }
                        },function(error){
                            Loading.hide();
                        });
                    },
                    data: [],
                    active: function (node) {
                        if (node.id != 0){
                            simulationCommon.currentView = node.id;
                            simulationCommon.currentViewName = node.name;
                            Loading.show();
                            $scope.simulationshow.data.Initial = 1;//第一次刷新
                            $scope.simulationView.reload();
                            $scope.simulationshow.data.isReset = true;
                        } else {
                            var treeObj = angular.element.fn.zTree.getZTreeObj($scope.simulationViewTree.treeId);
                            var nodes = treeObj.transformToArray(treeObj.getNodes());
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id == simulationCommon.currentView) {//树上选中节点
                                    treeObj.selectNode(nodes[i]);
                                }
                            }
                        }




                    }
                };


                <!-- 拓扑树 结束 -->

                <!-- 拓扑图 开始 -->
                var promise;
                $scope.simulationViewDataFromServer = {
                    init: function () {
                        //console.log("开始获取simulation数据!" + new Date().toLocaleString());
                        $scope.simulationViewData = simulationViewService.get({id: simulationCommon.currentView}, function (data) {
                            //console.log("定时回调simulation数据!" + new Date().toLocaleString());
                            $scope.simulationViewData = data;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                        //console.log("定时获取simulation数据!" + new Date().toLocaleString());
                        promise = $timeout($scope.simulationViewDataFromServer.init, 180000);
                    }
                };
                <!-- 拓扑图 结束 -->


                <!-- 拓扑图状态性能 开始 -->
                var promisePerformance;
                $scope.simulationViewPerformanceDataFromServer = {
                    init: function () {
                        //console.log("开始获取状态数据!" + new Date().toLocaleString());
                        $scope.simulationViewPerformanceData = simulationViewService.getCurrentPerformance({id: simulationCommon.currentView}, function (data) {
                            //console.log("定时回调状态数据!" + new Date().toLocaleString());
                            $scope.simulationViewPerformanceData = data;
                        },function(error){
                            Loading.hide();
                        });
                        promisePerformance = $timeout($scope.simulationViewPerformanceDataFromServer.init, 62222);//重要，debug屏蔽
                    }
                };
                <!-- 拓扑图状态性能 结束 -->


                <!-- 定时更新图元位置 开始 -->
                var promiseLocation;
                $scope.simulationNodesLocation = {
                    model: {},
                    timeOut: function () {
                        //console.log("图元位置保存开始" + new Date().toLocaleString());
                        if (simulationCommon.locationChange) {
                            //console.log("图元有值保存" + new Date().toLocaleString());
                            var locations = new Array();
                            //console.log("locations长度" + locations.length);
                            var location;
                            for (var key in simulationCommon.locationChange) {
                                if (simulationCommon.locationChange[key] != null && key.substring(0, 2) == "n_" && simulationCommon.locationChange[key].x != null && simulationCommon.locationChange[key].y != null && simulationCommon.locationChange[key].x > 0 && simulationCommon.locationChange[key].y > 0) {
                                    //console.log("图元" + key + "  " + topoCommon.locationChange[key].x + "  " + topoCommon.locationChange[key].y);
                                    location = new Object();
                                    location.nodeId = key.substring(2, key.length);
                                    location.horizontal = simulationCommon.locationChange[key].x;
                                    location.vertical = simulationCommon.locationChange[key].y;
                                    locations.push(location);
                                }
                            }
                            if (locations.length > 0) {
                                $scope.simulationNodesLocation.model = locations;
                                simulationNodeService.saveNodesLocations({id: simulationCommon.currentView}, $scope.simulationNodesLocation.model, function (data) {
                                    if (data.result == "success") {
                                        //console.log("图元位置成功保存" + new Date().toLocaleString());
                                        for (var key in simulationCommon.locationChange) {
                                            var isRemove = "false";
                                            for (var j = 0; j < locations.length; j++) {
                                                if (simulationCommon.locationChange[key] != null && key.substring(2, key.length) == locations[j].nodeId && simulationCommon.locationChange[key].x == locations[j].horizontal && simulationCommon.locationChange[key].y == locations[j].vertical) {
                                                    //console.log("图元2" + locations[j].nodeId + "  " + locations[j].horizontal + "  " + locations[j].vertical);
                                                    isRemove = "true";
                                                    break;
                                                }
                                            }
                                            if (isRemove == "true") {
                                                simulationCommon.locationChange[key] = null;
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        promiseLocation = $timeout($scope.simulationNodesLocation.timeOut, 5000);//重要，debug屏蔽
                    }
                };

                <!-- 定时更新图元位置 结束 -->

                <!-- 跳转页面定时关闭 开始 -->
                $scope.$on('$locationChangeStart', function () {
                    $timeout.cancel(promise);
                    $timeout.cancel(promisePerformance);
                    $timeout.cancel(promiseLocation);
                    if (null != $scope.simulationshow.data.network) {
                        $scope.simulationshow.data.network.eyeClose();
                    }
                    $scope.simulationshow.data.isReset = false;
                    simulationCommon.currentView = "-1";
                    simulationCommon.currentViewName = "";
                });
                <!-- 跳转页面定时关闭 结束 -->

                <!-- 页面初始化 开始 -->
                $scope.simulationshow = {
                    data: {
                        network: null,//视图变量
                        layouterType: "",//排列方式
                        layouterArray: [],
                        isReset: false,//初始化topo恢复最初大小
                        Initial:1
                    }
                };
                $scope.simulationView = {
                    init: function () {
                        Loading.show();
                        var layouterTypeArray = ['symmetry', 'topbottom', 'bottomtop', 'leftright', 'rightleft', 'hierarchic'];
                        var layouterTypeArrayChina = ['对称', '从上而下', '从下而上', '从左而右', '从右而左', '分层级'];
                        var obj;
                        for (var i = 0; i < layouterTypeArray.length; i++) {
                            obj = new Object();
                            obj.id = layouterTypeArray[i];
                            obj.displayName = layouterTypeArrayChina[i];
                            $scope.simulationshow.data.layouterArray.push(obj);
                        }
                        $scope.simulationViewTree.init();
                        $scope.simulationViewDataFromServer.init();
                        $scope.simulationViewPerformanceDataFromServer.init();
                        $scope.simulationNodesLocation.timeOut();
                        $scope.navigation.init();
                        $(window).resize(function () {
                            if ($scope.simulationshow.data.network != null)
                                $scope.simulationshow.data.network.windowsResize();
                        });
                    },
                    reload: function () {
                        $timeout.cancel(promise);
                        $timeout.cancel(promisePerformance);
                        $scope.simulationViewDataFromServer.init();
                        $scope.simulationViewPerformanceDataFromServer.init();
                    }
                };
                $scope.simulationView.init();
                $scope.$watch("simulationshow.data.layouterType", function (newVal, oldVal) {//排列，要看下
                    if (null != $scope.simulationshow.data.layouterType && $scope.simulationshow.data.layouterType != "")
                        $scope.simulationshow.data.network.autoLayout($scope.simulationshow.data.layouterType);
                }, false);
//                <!-- 页面初始化 结束 -->












            }
        ])
    ;
})(angular);