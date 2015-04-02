(function (angular) {

    angular.module('dnt.topo.controllers', [])
        .controller('topoController', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', 'DepartService', 'topoViewService', 'topoNodeService', 'topoLineService', 'topoResourceService', 'utilTools', 'Modal', 'topoDiscoveryClient', 'Util', 'DiscoveryClient', 'Loading',
            function ($scope, $rootScope, $routeParams, $http, $timeout, Depart, topoViewService, topoNodeService, topoLineService, topoResourceService, utilTools, Modal, topoDiscoveryClient, Util, DiscoveryClient, Loading) {

                <!-- 初始化面包线 开始 -->
                $scope.navigation = {
                    data: {
                        currentViewName: "",
                        navigationparent: "",
                        navigationchildren: ""
                    },
                    init: function () {
                        if (topoCommon.currentViewName.split(",")[$routeParams.classify] != "-1") {
                            $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                        } else {
                            $scope.navigation.data.currentViewName = "";
                        }
                        if ($routeParams.classify == 0) {
                            $scope.navigation.data.navigationparent = "视图";
                            $scope.navigation.data.navigationchildren = "网络监控";
                        } else if ($routeParams.classify == 1) {
                            $scope.navigation.data.navigationparent = "视图";
                            $scope.navigation.data.navigationchildren = "业务监控";
                        }
                    }
                };
                <!-- 初始化面包线 结束 -->

                <!-- 拓扑树 开始 -->
                $scope.topoViewDialog = utilTools.currentDialog({
                    id: "topoViewDialog",
                    title: "新增",
                    hiddenButton: true,
                    model: {},
                    save: function () {
                        if ($scope.topoViewDialog.model.name) {
                            Loading.show();
                            topoViewService.save($scope.topoViewDialog.model, function (data) {
                                if (data.result == "success") {
                                    if ($routeParams.classify == 0) {
                                        topoCommon.currentView = data.msg + "," + topoCommon.currentView.split(",")[1];
                                        topoCommon.currentViewName = $scope.topoViewDialog.model.name + "," + topoCommon.currentViewName.split(",")[1];
                                    } else if ($routeParams.classify == 1) {
                                        topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + data.msg;
                                        topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + $scope.topoViewDialog.model.name;
                                    }
                                    $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                    $scope.topoViewTree.init();
                                }
                                $scope.topoViewDialog.hide();
                                $scope.topoView.reload();
                            },function(error){
                                Loading.hide();
                            });
                            return;
                        }
                    }
                });
                $scope.topoViewUpdateDialog = utilTools.currentDialog({
                    id: "topoViewUpdateDialog",
                    title: "编辑",
                    hiddenButton: true,
                    model: {},
                    save: function () {
                        if ($scope.topoViewUpdateDialog.model.name) {
                            Loading.show();
                            topoViewService.updateName({id: $scope.topoViewUpdateDialog.model.id}, $scope.topoViewUpdateDialog.model, function (data) {
                                if (data.result == "success") {
                                    if ($routeParams.classify == 0) {
                                        topoCommon.currentView = $scope.topoViewUpdateDialog.model.id + "," + topoCommon.currentView.split(",")[1];
                                        topoCommon.currentViewName = data.msg + "," + topoCommon.currentViewName.split(",")[1];
                                    } else if ($routeParams.classify == 1) {
                                        topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + $scope.topoViewUpdateDialog.model.id;
                                        topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + data.msg;
                                    }
                                    $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                    $scope.topoViewTree.init();
                                }
                                $scope.topoViewUpdateDialog.hide();
                                Loading.hide();
                            },function(error){
                                Loading.hide();
                            });
                            return;
                        }
                    }
                });
                $scope.topoViewTree = {
                    treeId: "topoViewTree",
                    hideButton: $rootScope.loginUserMenuMap[$rootScope.currentView],
                    init: function () {
                        //console.log("初始化topo树!" + new Date().toLocaleString());
                        topoViewService.queryByClassify({classify: $routeParams.classify}, {}, function (tree) {
                            if (tree.result == "success") {
                                $scope.topoViewTree.data = tree.msg;
                                if (tree.msg.length > 0) {
                                    //console.log("初始化topo树成功！" + new Date().toLocaleString());
                                    if ($routeParams.classify == 0) {
                                        if (topoCommon.currentView.split(",")[0] == "-1") {
                                            topoCommon.currentView = tree.msg[0].id + "," + topoCommon.currentView.split(",")[1];
                                            topoCommon.currentViewName = tree.msg[0].name + "," + topoCommon.currentViewName.split(",")[1];
                                            topoCommon.currentViewPId = tree.msg[0].pId + "," + topoCommon.currentViewPId.split(",")[1];
                                            topoCommon.currentViewSort = tree.msg[0].sort + "," + topoCommon.currentViewSort.split(",")[1];
                                            $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                        }
                                    } else if ($routeParams.classify == 1) {
                                        if (topoCommon.currentView.split(",")[1] == "-1") {
                                            topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + tree.msg[0].id;
                                            topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + tree.msg[0].name;
                                            topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + tree.msg[0].pId;
                                            topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + tree.msg[0].sort;
                                            $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                        }
                                    }
                                }
                            }
                        },function(error){
                            Loading.hide();
                        });
                    },
                    data: [],
                    remove: function (node) {
                        $rootScope.$confirm("确定要删除该视图及其子图吗？", function () {
                            Loading.show();
                            topoViewService.delete({id: node.id}, function (data) {
                                if (data.result == "success") {
                                    if ($routeParams.classify == 0) {
                                        if (node.pId == "0") {
                                            topoCommon.currentView = "-1" + "," + topoCommon.currentView.split(",")[1];
                                            topoCommon.currentViewName = "-1" + "," + topoCommon.currentViewName.split(",")[1];
                                            topoCommon.currentViewPId = "-1" + "," + topoCommon.currentViewPId.split(",")[1];
                                            topoCommon.currentViewSort = "-1" + "," + topoCommon.currentViewSort.split(",")[1];
                                            $scope.navigation.data.currentViewName = "";
                                        } else if (node.pId != "0") {
                                            topoCommon.currentView = node.pId + "," + topoCommon.currentView.split(",")[1];
                                            topoCommon.currentViewName = node.pName + "," + topoCommon.currentViewName.split(",")[1];
                                            topoCommon.currentViewPId = node.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                            topoCommon.currentViewSort = node.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                            $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                        }
                                    } else if ($routeParams.classify == 1) {
                                        if (node.pId == "0") {
                                            topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + "-1";
                                            topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + "-1";
                                            topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + "-1";
                                            topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + "-1";
                                            $scope.navigation.data.currentViewName = "";
                                        } else if (node.pId != "0") {
                                            topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + node.pId;
                                            topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + node.pName;
                                            topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + node.pId;
                                            topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + node.sort;
                                            $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                        }
                                    }
                                    $scope.topoViewTree.init();
                                    //Loading.show();
                                    $scope.toposhow.data.Initial = 1;
                                    $scope.topoView.reload();
                                }
                            },function(error){
                                Loading.hide();
                            });
                        },'删除');
                    },
                    add: function (node) {
                        if (node) {
                            $scope.topoViewDialog.model = {pId: node.id, classify: $routeParams.classify, name: ""};
                        } else {
                            $scope.topoViewDialog.model = {pId: 0, classify: $routeParams.classify, name: ""};
                        }
                        $scope.topoViewDialog.show();
                    },
                    edit: function (node) {
                        $scope.topoViewUpdateDialog.model = {id: node.id, name: node.name, pId: node.pId};
                        $scope.topoViewUpdateDialog.show();
                    },
                    active: function (node) {
                        var srcTopoView = topoCommon.currentView.split(",")[$routeParams.classify];
                        if ($routeParams.classify == 0) {
                            topoCommon.currentView = node.id + "," + topoCommon.currentView.split(",")[1];
                            topoCommon.currentViewName = node.name + "," + topoCommon.currentViewName.split(",")[1];
                            topoCommon.currentViewPId = node.pId + "," + topoCommon.currentViewPId.split(",")[1];
                            topoCommon.currentViewSort = node.sort + "," + topoCommon.currentViewSort.split(",")[1];
                        } else if ($routeParams.classify == 1) {
                            topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + node.id;
                            topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + node.name;
                            topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + node.pId;
                            topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + node.sort;
                        }
                        $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                        if (srcTopoView != topoCommon.currentView.split(",")[$routeParams.classify]) {
                            document.getElementById("searchText").value = "";
                            $scope.toposhow.data.layouterType = "";
                            //$scope.toposhow.data.network.zoomReset();
                            Loading.show();
                            $scope.toposhow.data.Initial = 1;
                            $scope.topoView.reload();
                            $scope.toposhow.data.isReset = true;
                        }
                        $scope.topoViewTreeNode.isShow(node.pId, node.sort);

                    }
                };
                $scope.topoViewTreeNode = {
                    data: {
                        upDisabled: false,
                        downDisabled: false,
                        rightDisabled: false,
                        leftDisabled: false
                    },
                    arrow: function (direction) {
                        if ($routeParams.classify == 0) {
                            if (topoCommon.currentView.split(",")[0] == "-1") {
                                $rootScope.$alert("拓扑图未选择！", "alarm");
                                return;
                            }
                        } else if ($routeParams.classify == 1) {
                            if (topoCommon.currentView.split(",")[1] == "-1") {
                                $rootScope.$alert("拓扑图未选择！", "alarm");
                                return;
                            }
                        }
                        if (direction == "up") {
                            topoViewService.arrow({id: topoCommon.currentView.split(",")[$routeParams.classify], direction: direction}, {}, function (tree) {
                                if (tree.result == "success") {
                                    $scope.topoViewTreeNode.moveTopoTreeNode(topoCommon.currentView.split(",")[$routeParams.classify], direction, tree.msg);
                                }
                            });
                            return;
                        }
                        if (direction == "down") {
                            topoViewService.arrow({id: topoCommon.currentView.split(",")[$routeParams.classify], direction: direction}, {}, function (tree) {
                                if (tree.result == "success") {
                                    $scope.topoViewTreeNode.moveTopoTreeNode(topoCommon.currentView.split(",")[$routeParams.classify], direction, tree.msg);
                                }
                            });
                            return;
                        }
                        if (direction == "right") {
                            topoViewService.arrow({id: topoCommon.currentView.split(",")[$routeParams.classify], direction: direction}, {}, function (tree) {
                                if (tree.result == "success") {
                                    $scope.topoViewTreeNode.moveTopoTreeNode(topoCommon.currentView.split(",")[$routeParams.classify], direction, tree.msg);
                                }
                            });
                            return;
                        }
                        if (direction == "left") {
                            topoViewService.arrow({id: topoCommon.currentView.split(",")[$routeParams.classify], direction: direction}, {}, function (tree) {
                                if (tree.result == "success") {
                                    $scope.topoViewTreeNode.moveTopoTreeNode(topoCommon.currentView.split(",")[$routeParams.classify], direction, tree.msg);
                                }
                            });
                            return;
                        }
                    },
                    moveTopoTreeNode: function (id, direction, topoView) {
                        var topoViewTreeObj = angular.element.fn.zTree.getZTreeObj($scope.topoViewTree.treeId);
                        var allNodes = topoViewTreeObj.transformToArray(topoViewTreeObj.getNodes());
                        var currentNode, currentParentNode, currentPrevNode, currentNextNode, currentLastParentNode;
                        var prevSort = -1, nextSort = 10000;
                        for (var i = 0; i < allNodes.length; i++) {
                            if (allNodes[i].id == id) {
                                currentNode = allNodes[i];
                                for (var j = 0; j < allNodes.length; j++) {
                                    if (allNodes[j].pId == currentNode.pId) {
                                        if (allNodes[j].sort < currentNode.sort && allNodes[j].sort > prevSort) {
                                            currentPrevNode = allNodes[j];
                                            prevSort = allNodes[j].sort;
                                        }
                                        if (allNodes[j].sort > currentNode.sort && allNodes[j].sort < nextSort) {
                                            currentNextNode = allNodes[j];
                                            nextSort = allNodes[j].sort;
                                        }
                                    }
                                    if (allNodes[j].id == currentNode.pId) {
                                        currentParentNode = allNodes[j];
                                        currentLastParentNode = allNodes[j];
                                        for (var z = 0; z < allNodes.length; z++){
                                            if (allNodes[z].pId == currentParentNode.pId && allNodes[z].sort > currentLastParentNode.sort) {
                                                currentLastParentNode = allNodes[z];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (direction == "up") {
                            if (currentNode != null && currentPrevNode != null){
                                var tmpSort = currentPrevNode.sort;
                                if (tmpSort == topoView.sort) {
                                    currentPrevNode.sort = currentNode.sort;
                                    topoViewTreeObj.updateNode(currentPrevNode);
                                    currentNode.sort = tmpSort;
                                    topoViewTreeObj.updateNode(currentNode);
                                    if ($routeParams.classify == 0) {
                                        topoCommon.currentViewPId = currentNode.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                        topoCommon.currentViewSort = currentNode.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                    } else if ($routeParams.classify == 1) {
                                        topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + currentNode.pId;
                                        topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + currentNode.sort;
                                    }
                                    topoViewTreeObj.moveNode(currentPrevNode, currentNode, "prev");
                                    $scope.topoViewTreeNode.isShow(currentNode.pId, currentNode.sort);
                                }
                            }
                        }
                        if (direction == "down") {
                            if (currentNode != null && currentNextNode != null) {
                                var tmpSort = currentNextNode.sort;
                                if (tmpSort == topoView.sort) {
                                    currentNextNode.sort = currentNode.sort;
                                    topoViewTreeObj.updateNode(currentNextNode);
                                    currentNode.sort = tmpSort;
                                    topoViewTreeObj.updateNode(currentNode);
                                    if ($routeParams.classify == 0) {
                                        topoCommon.currentViewPId = currentNode.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                        topoCommon.currentViewSort = currentNode.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                    } else if ($routeParams.classify == 1) {
                                        topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + currentNode.pId;
                                        topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + currentNode.sort;
                                    }
                                    topoViewTreeObj.moveNode(currentNextNode, currentNode, "next");
                                    $scope.topoViewTreeNode.isShow(currentNode.pId, currentNode.sort);
                                }
                            }
                        }
                        if (direction == "right") {
                            if (currentNode != null && currentPrevNode != null) {
                                currentNode.pId = currentPrevNode.id;
                                currentNode.pName = currentPrevNode.name;
                                currentNode.sort = topoView.sort;
                                if (currentNode.pId == topoView.pId) {
                                    topoViewTreeObj.updateNode(currentNode);
                                    if ($routeParams.classify == 0) {
                                        topoCommon.currentViewPId = currentNode.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                        topoCommon.currentViewSort = currentNode.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                    } else if ($routeParams.classify == 1) {
                                        topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + currentNode.pId;
                                        topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + currentNode.sort;
                                    }
                                    topoViewTreeObj.moveNode(currentPrevNode, currentNode, "inner");
                                    $scope.topoViewTreeNode.isShow(currentNode.pId, currentNode.sort);
                                }
                            }
                        }
                        if (direction == "left") {
                            if (currentNode != null && currentParentNode != null) {
                                currentNode.pId = currentParentNode.pId;
                                currentNode.pName = currentParentNode.pName;
                                currentNode.sort = topoView.sort;
                                if (currentNode.pId == topoView.pId) {
                                    topoViewTreeObj.updateNode(currentNode);
                                    if ($routeParams.classify == 0) {
                                        topoCommon.currentViewPId = currentNode.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                        topoCommon.currentViewSort = currentNode.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                    } else if ($routeParams.classify == 1) {
                                        topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + currentNode.pId;
                                        topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + currentNode.sort;
                                    }
                                    topoViewTreeObj.moveNode(currentLastParentNode, currentNode, "next");
                                    $scope.topoViewTreeNode.isShow(currentNode.pId, currentNode.sort);
                                }
                            }
                        }
                    },
                    isShow: function (pId, sort) {
                        var topoViewTreeObj = angular.element.fn.zTree.getZTreeObj($scope.topoViewTree.treeId);
                        var allNodes = topoViewTreeObj.transformToArray(topoViewTreeObj.getNodes());
                        var isDownShow = false, isUpShow = false, isRightShow = false;
                        for (var i = 0; i < allNodes.length; i++) {
                            if (allNodes[i].pId == pId) {
                                if (allNodes[i].sort < sort) {
                                    isRightShow = true;
                                    isUpShow = true;
                                }
                                if (allNodes[i].sort > sort) {
                                    isDownShow = true;
                                }
                            }
                        }
                        if (!isUpShow) {
                            $scope.topoViewTreeNode.data.upDisabled = true;
                        } else {
                            $scope.topoViewTreeNode.data.upDisabled = false;
                        }
                        if (!isDownShow) {
                            $scope.topoViewTreeNode.data.downDisabled = true;
                        } else {
                            $scope.topoViewTreeNode.data.downDisabled = false;
                        }
                        if (!isRightShow) {
                            $scope.topoViewTreeNode.data.rightDisabled = true;
                        } else {
                            $scope.topoViewTreeNode.data.rightDisabled = false;
                        }
                        if (pId == 0) {
                            $scope.topoViewTreeNode.data.leftDisabled = true;
                        } else {
                            $scope.topoViewTreeNode.data.leftDisabled = false;
                        }
                    }
                };


                <!-- 拓扑树 结束 -->

                <!-- 拓扑图 开始 -->
                var promise;
                $scope.topoViewDataFromServer = {
                    init: function () {
                        //console.log("开始获取Topo数据!" + new Date().toLocaleString());
                        $scope.topoViewData = topoViewService.get({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, function (data) {
                            //console.log("定时回调Topo数据!" + new Date().toLocaleString());
                            $scope.topoViewData = data;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                        //console.log("定时获取Topo数据!" + new Date().toLocaleString());
                        promise = $timeout($scope.topoViewDataFromServer.init, 180000);
                    }
                };
                <!-- 拓扑图 结束 -->

                <!-- 拓扑图告警 开始 -->
                var promiseAlarm;
                $scope.topoViewAlarmDataFromServer = {
                    init: function () {
                        //console.log("开始获取告警数据!" + new Date().toLocaleString());
                        $scope.topoViewAlarmData = topoNodeService.getNodesCurrentAlarm({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, function (data) {
                            //console.log("定时回调告警数据!" + new Date().toLocaleString());
                            $scope.topoViewAlarmData = data;
                        },function(error){
                            Loading.hide();
                        });
                        promiseAlarm = $timeout($scope.topoViewAlarmDataFromServer.init, 25999);//重要，debug屏蔽
                    }
                };
                <!-- 拓扑图告警 结束 -->

                <!-- 拓扑图状态性能 开始 -->
                var promisePerformance;
                $scope.topoViewPerformanceDataFromServer = {
                    init: function () {
                        //console.log("开始获取状态数据!" + new Date().toLocaleString());
                        $scope.topoViewPerformanceData = topoViewService.getCurrentPerformance({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, function (data) {
                            //console.log("定时回调状态数据!" + new Date().toLocaleString());
                            $scope.topoViewPerformanceData = data;
                        },function(error){
                            Loading.hide();
                        });
                        promisePerformance = $timeout($scope.topoViewPerformanceDataFromServer.init, 62222);//重要，debug屏蔽
                    }
                };
                <!-- 拓扑图状态性能 结束 -->

                <!-- 定时更新图元位置 开始 -->
                var promiseLocation;
                $scope.topoNodesLocation = {
                    model: {},
                    timeOut: function () {
                        //console.log("图元位置保存开始" + new Date().toLocaleString());
                        if (topoCommon.locationChange) {
                            //console.log("图元有值保存" + new Date().toLocaleString());
                            var locations = new Array();
                            //console.log("locations长度" + locations.length);
                            var location;
                            for (var key in topoCommon.locationChange) {
                                if (topoCommon.locationChange[key] != null && key.substring(0, 2) == "n_" && topoCommon.locationChange[key].x != null && topoCommon.locationChange[key].y != null && topoCommon.locationChange[key].x > 0 && topoCommon.locationChange[key].y > 0) {
                                    //console.log("图元" + key + "  " + topoCommon.locationChange[key].x + "  " + topoCommon.locationChange[key].y);
                                    location = new Object();
                                    location.nodeId = key.substring(2, key.length);
                                    location.horizontal = topoCommon.locationChange[key].x;
                                    location.vertical = topoCommon.locationChange[key].y;
                                    locations.push(location);
                                }
                            }
                            if (locations.length > 0) {
                                $scope.topoNodesLocation.model = locations;
                                topoNodeService.saveNodesLocations({id: topoCommon.currentView.split(",")[$routeParams.classify]}, $scope.topoNodesLocation.model, function (data) {
                                    if (data.result == "success") {
                                        //console.log("图元位置成功保存" + new Date().toLocaleString());
                                        for (var key in topoCommon.locationChange) {
                                            var isRemove = "false";
                                            for (var j = 0; j < locations.length; j++) {
                                                if (topoCommon.locationChange[key] != null && key.substring(2, key.length) == locations[j].nodeId && topoCommon.locationChange[key].x == locations[j].horizontal && topoCommon.locationChange[key].y == locations[j].vertical) {
                                                    //console.log("图元2" + locations[j].nodeId + "  " + locations[j].horizontal + "  " + locations[j].vertical);
                                                    isRemove = "true";
                                                    break;
                                                }
                                            }
                                            if (isRemove == "true") {
                                                topoCommon.locationChange[key] = null;
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        promiseLocation = $timeout($scope.topoNodesLocation.timeOut, 5000);//重要，debug屏蔽
                    }
                };

                <!-- 定时更新图元位置 结束 -->

                <!-- 跳转页面定时关闭 开始 -->
                $scope.$on('$locationChangeStart', function () {
                    $timeout.cancel(promise);
                    $timeout.cancel(promiseAlarm);
                    $timeout.cancel(promisePerformance);
                    $timeout.cancel(promiseLocation);
                    if (null != $scope.toposhow.data.network) {
                        $scope.toposhow.data.network.eyeClose();
                    }
                    $scope.toposhow.data.isReset = false;
                });
                <!-- 跳转页面定时关闭 结束 -->

                <!-- 页面初始化 开始 -->
                $scope.toposhow = {
                    data: {
                        network: null,
                        //topoViewMenuData: [],
                        //topoViewMenuIndicator: ["NIO","NIO","NIO","NIO","NIO","IfPacket","IfPacket","IfPacket","FCInterface","HBAPortInfo"],
                        layouterType: "",
                        layouterArray: [],
                        isReset: false,
                        Initial:1
                    }
                };
                $scope.topoView = {
                    init: function () {
                        Loading.show();
                        var layouterTypeArray = ['symmetry', 'topbottom', 'bottomtop', 'leftright', 'rightleft', 'hierarchic'];
                        var layouterTypeArrayChina = ['对称', '从上而下', '从下而上', '从左而右', '从右而左', '分层级'];
                        var obj;
                        for (var i = 0; i < layouterTypeArray.length; i++) {
                            obj = new Object();
                            obj.id = layouterTypeArray[i];
                            obj.displayName = layouterTypeArrayChina[i];
                            $scope.toposhow.data.layouterArray.push(obj);
                        }
                        $scope.topoViewTree.init();
                        $scope.topoViewDataFromServer.init();
                        $scope.topoViewAlarmDataFromServer.init();
                        $scope.topoViewPerformanceDataFromServer.init();
                        //$scope.topoViewNotDevicePerformanceDataFromServer.init();
                        $scope.topoNodesLocation.timeOut();
                        $scope.navigation.init();
                        document.onkeyup = function (e) {
                            if (e.which == 27) {
                                $scope.toposhow.data.network.reFullScreenButton();
                            }
                        };
                        $(window).on('hashchange', function () {
                            if ($scope.toposhow.data.network != null)
                                $scope.toposhow.data.network.isFullScreenListener(window.location.hash);
                        });
                        $(window).resize(function () {
                            if ($scope.toposhow.data.network != null)
                                $scope.toposhow.data.network.windowsResize();
                        });
//1642BUG
//                        $(window).scroll(function () {
//                            console.log("这个方法是当前滚动条滚动的距离" + $(window).scrollTop());
//                            console.log("获取当前窗体的高度" + $(window).height());
//                            console.log("获取当前文档的高度" + $(document).height());
//                            if ($scope.toposhow.data.network != null) {
//                                $scope.toposhow.data.network.reNetworkHeight($(window).scrollTop());
//                            }
//                            //alert("scroll");
//                            //$(window).scrollTop()这个方法是当前滚动条滚动的距离
//                            //$(window).height()获取当前窗体的高度
//                            //$(document).height()获取当前文档的高度
//                            //var bot = 50; //bot是底部距离的高度
//                            //if ((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
//                            //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
//                            //我们需要去异步加载数据了
//                            //$.getJSON("url", { page: "2" }, function (str) { alert(str); });
//                            //}
//                        });
                    },
                    reload: function () {
                        $timeout.cancel(promise);
                        $timeout.cancel(promiseAlarm);
                        $timeout.cancel(promisePerformance);
                        //$timeout.cancel(promiseNotDevicePerformance);
                        $scope.topoViewDataFromServer.init();
                        $scope.topoViewAlarmDataFromServer.init();
                        $scope.topoViewPerformanceDataFromServer.init();
                        //$scope.topoViewNotDevicePerformanceDataFromServer.init();
                    }
                };
                $scope.topoView.init();
                $scope.$watch("toposhow.data.layouterType", function (newVal, oldVal) {
                    if (null != $scope.toposhow.data.layouterType && $scope.toposhow.data.layouterType != "")
                        $scope.toposhow.data.network.autoLayout($scope.toposhow.data.layouterType);
                }, false);
                <!-- 页面初始化 结束 -->


                <!-- 同步图元对话框 开始 -->
                $scope.nodeSynAddDialog = utilTools.currentDialog({
                    id: "nodeSynAddDialog",
                    title: "新增",
                    model: {
                        moc: [],
                        mocClassify: [],
                        mo: []
                    },
                    srcTree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'moSrcTree',
                        checkbox: "true",
                        level: 2,
                        isMultipleColumns: false,
                        treeClick: function () {
                        },
                        onCheck: function (nodes) {
                        }
                    },
                    trgTree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'moTrgTree',
                        checkbox: "true",
                        level: 2,
                        isMultipleColumns: true,
                        treeClick: function () {
                        },
                        onCheck: function (nodes) {
                        }
                    },
                    initData: function () {
                        topoResourceService.synNodesResource({classify: $routeParams.classify}, function (data) {
                            if (data.result == "success") {
                                $scope.nodeSynAddDialog.model.moc = data.msg.moc;
                                $scope.nodeSynAddDialog.model.mo = data.msg.mo;
                            }
                        });
                    },
                    selectAllOfSrcTree: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.srcTree.treeId);
                        if (null != nodeTree) {
                            if ($scope.nodeSynAddDialog.model.isSelectAllOfSrcTree) {
                                nodeTree.checkAllNodes(true);
                            } else {
                                nodeTree.checkAllNodes(false);
                            }
                        }
                    },
                    selectAllOfTrgTree: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.trgTree.treeId);
                        if (null != nodeTree) {
                            if ($scope.nodeSynAddDialog.model.isSelectAllOfTrgTree) {
                                nodeTree.checkAllNodes(true);
                            } else {
                                nodeTree.checkAllNodes(false);
                            }
                        }
                    },
                    add: function () {
                        var trgTreeMoList = new Array();
                        var srcTreeMoList = new Array();
                        var trgTreeObj = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.trgTree.treeId);
                        var existNodes = trgTreeObj.getNodes();
                        for (var z = 0; z < existNodes.length; z++) {
                            for (var a = 0; a < $scope.nodeSynAddDialog.model.mo.length; a++) {
                                if ($scope.nodeSynAddDialog.model.mo[a].id == existNodes[z].id) {
                                    trgTreeMoList.push($scope.nodeSynAddDialog.model.mo[a]);
                                    break;
                                }
                            }
                        }
                        var srcTreeObj = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.srcTree.treeId);
                        var newNodes = srcTreeObj.getCheckedNodes(true);
                        var srcTreeNoRemoveNodes = srcTreeObj.getCheckedNodes(false);
                        for (var j = 0; j < newNodes.length; j++) {
                            for (var i = 0; i < $scope.nodeSynAddDialog.model.mo.length; i++) {
                                if ($scope.nodeSynAddDialog.model.mo[i].id == newNodes[j].id) {
                                    trgTreeMoList.push($scope.nodeSynAddDialog.model.mo[i]);
                                    break;
                                }
                            }
                        }
                        for (var v = 0; v < srcTreeNoRemoveNodes.length; v++) {
                            for (var o = 0; o < $scope.nodeSynAddDialog.model.mo.length; o++) {
                                if ($scope.nodeSynAddDialog.model.mo[o].id == srcTreeNoRemoveNodes[v].id) {
                                    srcTreeMoList.push($scope.nodeSynAddDialog.model.mo[o]);
                                    break;
                                }
                            }
                        }
                        $scope.nodeSynAddDialog.trgTree.data = trgTreeMoList;
                        $scope.nodeSynAddDialog.srcTree.data = srcTreeMoList;
                        $scope.nodeSynAddDialog.model.isSelectAllOfSrcTree = false;
                        $scope.nodeSynAddDialog.model.isSelectAllOfTrgTree = false;
                    },
                    remove: function () {
                        var trgTreeMoList = new Array();
                        var srcTreeMoList = new Array();
                        var trgTreeObj = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.trgTree.treeId);
                        var trgTreeRemoveNodes = trgTreeObj.getCheckedNodes(true);
                        var trgTreeNoRemoveNodes = trgTreeObj.getCheckedNodes(false);
                        var srcTreeObj = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.srcTree.treeId);
                        var srcTreeNodes = srcTreeObj.transformToArray(srcTreeObj.getNodes());
                        for (var a = 0; a < $scope.nodeSynAddDialog.model.mo.length; a++) {
                            var b = true;
                            for (var h = 0; h < trgTreeNoRemoveNodes.length; h++) {
                                if ($scope.nodeSynAddDialog.model.mo[a].id == trgTreeNoRemoveNodes[h].id) {
                                    trgTreeMoList.push($scope.nodeSynAddDialog.model.mo[a]);
                                    b = false;
                                    break;
                                }
                            }
                            if (b) {
                                for (var z = 0; z < trgTreeRemoveNodes.length; z++) {
                                    if ($scope.nodeSynAddDialog.model.mo[a].id == trgTreeRemoveNodes[z].id) {
                                        srcTreeMoList.push($scope.nodeSynAddDialog.model.mo[a]);
                                        b = false;
                                        break;
                                    }
                                }
                            }
                            if (b) {
                                for (var v = 0; v < srcTreeNodes.length; v++) {
                                    if ($scope.nodeSynAddDialog.model.mo[a].id == srcTreeNodes[v].id) {
                                        srcTreeMoList.push($scope.nodeSynAddDialog.model.mo[a]);
                                        b = false;
                                        break;
                                    }
                                }
                            }
                        }
                        $scope.nodeSynAddDialog.trgTree.data = trgTreeMoList;
                        $scope.nodeSynAddDialog.srcTree.data = srcTreeMoList;
                        $scope.nodeSynAddDialog.model.isSelectAllOfSrcTree = false;
                        $scope.nodeSynAddDialog.model.isSelectAllOfTrgTree = false;
                    },
                    save: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.trgTree.treeId);
                        var nodes = nodeTree.transformToArray(nodeTree.getNodes());
                        if (null == nodes || nodes == 0) {
                            $rootScope.$alert("图元未选择", "alarm");
                            return;
                        }
                        var saveMoList = new Array();
                        var obj;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].example == "example", "alarm") {
                                obj = new Object();
                                obj.moId = nodes[i].id;
                                obj.name = nodes[i].name;
                                obj.ip = nodes[i].ip;
                                obj.classify = nodes[i].classify;
                                obj.classifyId = nodes[i].classifyId;
                                obj.type = nodes[i].type;
                                obj.typeId = nodes[i].typeId;
                                obj.isDevice = nodes[i].isDevice;
                                obj.img = nodes[i].img;
                                obj.user = nodes[i].user;
                                saveMoList.push(obj);
                            }
                        }
                        $scope.nodeSynAddDialog.model.saveMoList = saveMoList;
                        topoNodeService.batchsave({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, $scope.nodeSynAddDialog.model.saveMoList, function (data) {
                            if (data.result == "success") {
                                Loading.show();
                                $scope.toposhow.data.Initial = 1;
                                $scope.topoView.reload();
                                $scope.topoViewTree.init();
                            }
                            $scope.nodeSynAddDialog.hide();
                        });
                    }

                });
                $scope.$watch("nodeSynAddDialog.model.nodeMoc", function (newVal, oldVal) {
                    $scope.nodeSynAddDialog.model.mocClassify = [];
                    $scope.nodeSynAddDialog.model.nodeMocClassify = "";
                    $scope.nodeSynAddDialog.srcTree.data = [];
                    for (var i = 0; i < $scope.nodeSynAddDialog.model.moc.length; i++) {
                        if ($scope.nodeSynAddDialog.model.moc[i].id == $scope.nodeSynAddDialog.model.nodeMoc) {
                            for (var j = 0; j < $scope.nodeSynAddDialog.model.moc[i].children.length; j++) {
                                $scope.nodeSynAddDialog.model.mocClassify.push($scope.nodeSynAddDialog.model.moc[i].children[j]);
                            }
                            $scope.nodeSynAddDialog.model.isSelectAllOfSrcTree = false;
                            $scope.nodeSynAddDialog.model.isSelectAllOfTrgTree = false;
                            return;
                        }
                    }
                }, false);
                $scope.$watch("nodeSynAddDialog.model.nodeMocClassify", function (newVal, oldVal) {
                    var moList = new Array();
                    var trgTreeObj = angular.element.fn.zTree.getZTreeObj($scope.nodeSynAddDialog.trgTree.treeId);
                    if (null != trgTreeObj) {
                        var existNodes = trgTreeObj.getNodes();
                        for (var i = 0; i < $scope.nodeSynAddDialog.model.mo.length; i++) {
                            if ($scope.nodeSynAddDialog.model.mo[i].parentId == $scope.nodeSynAddDialog.model.nodeMocClassify) {
                                var isInsert = true;
                                for (var z = 0; z < existNodes.length; z++) {
                                    if ($scope.nodeSynAddDialog.model.mo[i].id == existNodes[z].id) {
                                        isInsert = false;
                                    }
                                }
                                if (isInsert) {
                                    moList.push($scope.nodeSynAddDialog.model.mo[i]);
                                }
                            }
                        }
                    }
                    $scope.nodeSynAddDialog.srcTree.data = moList;
                    $scope.nodeSynAddDialog.model.isSelectAllOfSrcTree = false;
                    $scope.nodeSynAddDialog.model.isSelectAllOfTrgTree = false;
                }, false);
                <!-- 同步图元对话框 结束 -->

                <!-- 添加图元对话框 开始 -->
                $scope.nodeAddDialog = utilTools.currentDialog({
                    id: "nodeDialog",
                    title: "新增",
                    model: {},
                    tree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'moTree',
                        checkbox: "true",
                        level: 3,
                        treeClick: function () {
                        },
                        onCheck: function (nodes) {
                        }
                    },
                    initTree: function () {
                        $scope.nodeAddDialog.tree.data = topoResourceService.getResource({classify: $routeParams.classify}, function (data) {
                            if (data.result == "success") {
                                $scope.nodeAddDialog.tree.data = data.msg;
                            }
                        });
                    },
                    save: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.nodeAddDialog.tree.treeId);
                        var nodes = nodeTree.getCheckedNodes(true);
                        if (null == nodes || nodes == 0) {
                            $rootScope.$alert("图元未选择", "alarm");
                            return;
                        }
                        var moList = new Array();
                        var obj;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].example == "example", "alarm") {
                                obj = new Object();
                                obj.moId = nodes[i].id;
                                obj.name = nodes[i].name;
                                obj.ip = nodes[i].ip;
                                obj.classify = nodes[i].classify;
                                obj.classifyId = nodes[i].classifyId;
                                obj.type = nodes[i].type;
                                obj.typeId = nodes[i].typeId;
                                obj.isDevice = nodes[i].isDevice;
                                obj.img = nodes[i].img;
                                moList.push(obj);
                            }
                        }
                        $scope.nodeAddDialog.model = moList;
                        topoNodeService.batchsave({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, $scope.nodeAddDialog.model, function (data) {
                            if (data.result == "success") {
                                Loading.show();
                                $scope.toposhow.data.Initial = 1;
                                $scope.topoView.reload();
                                $scope.topoViewTree.init();
                            }
                            $scope.nodeAddDialog.hide();
                        });
                    }
                });
                <!-- 添加图元对话框 结束 -->

                <!-- 删除图元对话框 开始 -->
                $scope.elementDelDialog = utilTools.currentDialog({
                    id: "elementDelDialog",
                    title: "删除",
                    model: {
                    },
                    save: function () {
                        topoViewService.deleteElements({id: topoCommon.currentView.split(",")[$routeParams.classify]}, $scope.elementDelDialog.model, function (data) {
                            if (data.result == "success") {
                                topoCommon.currentNode = -1;
                                topoCommon.currentNodeName = "";
                                topoCommon.currentNodeDisplayName = "";
                                topoCommon.currentNodeType = "";
                                topoCommon.currentNodeSize = "";
                                topoCommon.currentNodeDrill = -1;
                                Loading.show();
                                $scope.topoView.reload();
                                $scope.topoViewTree.init();
                            }
                            $scope.elementDelDialog.hide();
                        });
                    }
                });
                <!-- 删除图元对话框 结束 -->


                <!-- 同步线路对话框 开始 -->
                $scope.linkSynAddDialog = utilTools.currentDialog({
                    id: "linkSynAddDialog",
                    title: "同步",
                    model: {
                        isDiv: null,
                        topoLinkTreeCache: [],
                        topoRelaTreeCache: []
                    },
                    topoLinkTree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'topoLinkTree',
                        checkbox: "true",
                        treeClick: function () {

                        },
                        onCheck: function (nodes) {

                        }
                    },
                    topoRelaTree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'topoRelaTree',
                        checkbox: "true",
                        treeClick: function () {

                        },
                        onCheck: function (nodes) {

                        }
                    },
                    initTree: function () {
                        document.getElementById("linkTreeDiv").style.display = "none";
                        document.getElementById("relaTreeDiv").style.display = "none";
                        topoResourceService.synLinksResource({id: topoCommon.currentView.split(",")[$routeParams.classify]}, function (data) {
                            if (data.result == "success") {
                                var topoLinkTreeObj = angular.element.fn.zTree.getZTreeObj($scope.linkSynAddDialog.topoLinkTree.treeId);
                                var topoLinkTreeNodes = topoLinkTreeObj.getCheckedNodes();
                                for (var j = 0, l = topoLinkTreeNodes.length; j < l; j++) {
                                    topoLinkTreeObj.checkNode(topoLinkTreeNodes[j], false, false);
                                }
                                var topoRelaTreeObj = angular.element.fn.zTree.getZTreeObj($scope.linkSynAddDialog.topoRelaTree.treeId);
                                var topoRelaTreeNodes = topoRelaTreeObj.getCheckedNodes();
                                for (var i = 0, l = topoRelaTreeNodes.length; i < l; i++) {
                                    topoRelaTreeObj.checkNode(topoRelaTreeNodes[i], false, false);
                                }
                                var zTreeTypeNodes = new Array();
                                var objLink = new Object();
                                objLink.id = 1;
                                objLink.displayName = "线路";
                                zTreeTypeNodes.push(objLink);
                                var objRela = new Object();
                                objRela.id = 2;
                                objRela.displayName = "关系";
                                zTreeTypeNodes.push(objRela);
                                $scope.linkSynAddDialog.model.linkTypeArray = zTreeTypeNodes;
                                $scope.linkSynAddDialog.model.isDiv = null;
                                $scope.linkSynAddDialog.model.linkType = "";
                                $scope.linkSynAddDialog.topoLinkTreeCache = data.msg.link;
                                $scope.linkSynAddDialog.topoRelaTreeCache = data.msg.rela;
                            }
                        });
                    },
                    save: function () {
                        var linkTree;
                        if ($scope.linkSynAddDialog.model.isDiv == null) {
                            $rootScope.$alert("类型未选择", "alarm");
                            return;
                        }
                        if ($scope.linkSynAddDialog.model.isDiv) {
                            linkTree = angular.element.fn.zTree.getZTreeObj($scope.linkSynAddDialog.topoLinkTree.treeId);
                        } else {
                            linkTree = angular.element.fn.zTree.getZTreeObj($scope.linkSynAddDialog.topoRelaTree.treeId);
                        }
                        var nodes = linkTree.getCheckedNodes(true);
                        if (null == nodes || nodes == 0) {
                            $rootScope.$alert("保存线路或关系未选择", "alarm");
                            return;
                        }
                        var saveLinkList = new Array();
                        var obj;
                        for (var i = 0; i < nodes.length; i++) {
                            obj = new Object();
                            obj.moId = nodes[i].moId;
                            obj.classify = nodes[i].classify;
                            obj.inPort = nodes[i].inPort;
                            obj.outPort = nodes[i].outPort;
                            obj.inNodeMoId = nodes[i].inNodeMoId;
                            obj.outNodeMoId = nodes[i].outNodeMoId;
                            obj.name = nodes[i].displayName;
                            obj.sampleLeft = nodes[i].sampleLeft;
                            saveLinkList.push(obj);
                        }
                        $scope.linkSynAddDialog.model.saveLinkList = saveLinkList;
                        topoLineService.batchsave({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, $scope.linkSynAddDialog.model.saveLinkList, function (data) {
                            if (data.result == "success") {
                                Loading.show();
                                $scope.toposhow.data.Initial = 1;
                                $scope.topoView.reload();
                            }
                            $scope.linkSynAddDialog.hide();
                        });
                    }
                });
                $scope.$watch("linkSynAddDialog.model.linkType", function (newVal, oldVal) {
                    if (null != $scope.linkSynAddDialog.model.linkType && $scope.linkSynAddDialog.model.linkType != "" && $scope.linkSynAddDialog.model.linkType == 1) {
                        document.getElementById("linkTreeDiv").style.display = "block";
                        document.getElementById("relaTreeDiv").style.display = "none";
                        $scope.linkSynAddDialog.model.isDiv = true;
                        $scope.linkSynAddDialog.topoLinkTree.data = $scope.linkSynAddDialog.topoLinkTreeCache;
                    } else if (null != $scope.linkSynAddDialog.model.linkType && $scope.linkSynAddDialog.model.linkType != "" && $scope.linkSynAddDialog.model.linkType == 2) {
                        document.getElementById("linkTreeDiv").style.display = "none";
                        document.getElementById("relaTreeDiv").style.display = "block";
                        $scope.linkSynAddDialog.model.isDiv = false;
                        $scope.linkSynAddDialog.topoRelaTree.data = $scope.linkSynAddDialog.topoRelaTreeCache;
                    } else if (null != $scope.linkSynAddDialog.model.linkType && $scope.linkSynAddDialog.model.linkType == "") {
                        $scope.linkSynAddDialog.model.isDiv = null;
                        $scope.linkSynAddDialog.topoLinkTree.data = [];
                        $scope.linkSynAddDialog.topoRelaTree.data = [];
                    }
                }, false);
                <!-- 同步线路对话框 结束 -->


                <!-- 添加线路对话框 开始 -->
                $scope.linkAddDialog = utilTools.currentDialog({
                    id: "linkAddDialog",
                    title: "新增",
                    model: {
                        inPort: "",
                        outPort: "",
                        topoNode1PortArray: [],
                        topoNode2PortArray: []
                    },
                    initTree: function (el0, el1) {
                        topoNodeService.getContainPort({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify, elLeftMoId: el0.cId, elRightMoId: el1.cId, elLeftMoType: el0.type, elRightMoType: el1.type, elLeftMoClassify: el0.classify, elRightMoClassify: el1.classify}, function (data) {
                            if (data.result == "success") {
                                $scope.linkAddDialog.model.topoNode1PortArray = data.msg.topoNodeLeftPortList;
                                $scope.linkAddDialog.model.topoNode2PortArray = data.msg.topoNodeRightPortList;
                            }
                        });
                    },
                    save: function () {
                        if (null == $scope.linkAddDialog.model.inPort || $scope.linkAddDialog.model.inPort == "") {
                            if ($scope.linkAddDialog.model.classify == 0) {
                                $rootScope.$alert("左端口未选择", "alarm");
                                return;
                            }
                        }
                        if (null == $scope.linkAddDialog.model.outPort || $scope.linkAddDialog.model.outPort == "") {
                            if ($scope.linkAddDialog.model.classify == 0) {
                                $rootScope.$alert("右端口未选择", "alarm");
                                return;
                            }
                        }
                        var lineModelobj = new Object();
                        lineModelobj.customName = $scope.linkAddDialog.model.name;
                        lineModelobj.classify = $scope.linkAddDialog.model.classify;
                        lineModelobj.inNodeId = $scope.linkAddDialog.model.inNodeId;
                        lineModelobj.outNodeId = $scope.linkAddDialog.model.outNodeId;
                        lineModelobj.inPort = $scope.linkAddDialog.model.inPort;
                        lineModelobj.outPort = $scope.linkAddDialog.model.outPort;
                        lineModelobj.sampleLeft = $scope.linkAddDialog.model.perNode;
                        $scope.linkAddDialog.model.lineModel = lineModelobj;
                        topoLineService.save({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, $scope.linkAddDialog.model.lineModel, function (data) {
                            if (data.result == "success") {
                                $scope.topoView.reload();
                            }
                            $scope.linkAddDialog.hide();
                        });
                    }
                });
                $scope.$watch("linkAddDialog.model.linkRadioType", function (newVal, oldVal) {
                    if ($scope.linkAddDialog.model.linkRadioType == "link") {
                        $scope.linkAddDialog.model.classify = 0;
                        $scope.linkAddDialog.model.isLinkShow = true;
                        return;
                    } else if ($scope.linkAddDialog.model.linkRadioType == "rela") {
                        $scope.linkAddDialog.model.classify = 1;
                        $scope.linkAddDialog.model.isLinkShow = false;
                        return;
                    }
                }, false);
                <!-- 添加线路对话框 结束 -->


                <!-- 线路样式对话框 开始 -->
                $scope.linkStyleDialog = utilTools.currentDialog({
                    id: "linkStyleDialog",
                    title: "线路样式",
                    styleMode: null,
                    model: {},
                    tree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'linkStyleTree',
                        checkbox: "true",
                        treeClick: function () {
                        },
                        onCheck: function () {
                        }
                    },
                    initTree: function () {
                        $scope.linkStyleDialog.tree.data = topoLineService.query({id: topoCommon.currentView.split(",")[$routeParams.classify]}, function (data) {
                            if (data.result == "success") {
                                var tree = angular.element.fn.zTree.getZTreeObj($scope.linkStyleDialog.tree.treeId);
                                var nodes = tree.getNodesByParam("isHidden", true);
                                tree.showNodes(nodes);
                                nodes = tree.getCheckedNodes();
                                for (var i = 0, l = nodes.length; i < l; i++) {
                                    tree.checkNode(nodes[i], false, false);
                                }
                                $scope.linkStyleDialog.tree.data = data.msg;
                            }
                        });
                    },
                    save: function () {
                        var linkTree = angular.element.fn.zTree.getZTreeObj($scope.linkStyleDialog.tree.treeId);
                        var links = linkTree.getCheckedNodes(true);
                        if (null == links || links == 0) {
                            $rootScope.$alert("线路未选择！", "alarm");
                            return;
                        }
                        if (null == $scope.linkStyleDialog.styleMode) {
                            $rootScope.$alert("样式未选择！", "alarm");
                            return;
                        }
                        var linkList = new Array();
                        var obj;
                        for (var i = 0; i < links.length; i++) {
                            obj = new Object();
                            obj.id = links[i].id;
                            linkList.push(obj);
                        }
                        $scope.linkStyleDialog.model = linkList;
                        var cssLine = "solid";
                        if ($scope.linkStyleDialog.ifDottedLine) {
                            cssLine = "dotted";
                        }
                        topoLineService.updateLinksStyle({id: topoCommon.currentView.split(",")[$routeParams.classify], sytle: $scope.linkStyleDialog.styleMode, cssLine: cssLine}, $scope.linkStyleDialog.model, function (data) {
                            if (data.result == "success") {
                                $scope.topoView.reload();
                            }
                            $scope.linkStyleDialog.hide();
                        });
                    }
                });
                <!-- 线路样式对话框 结束 -->


                <!-- 图元尺寸对话框 开始 -->
                $scope.nodeSizeEditDialog = utilTools.currentDialog({
                    id: "nodeSizeEditDialog",
                    title: "尺寸设置",
                    size: "",
                    sizeArray: [],
                    model: {},
                    tree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'nodeSizeTree',
                        checkbox: "true",
                        treeClick: function () {
                        },
                        onCheck: function () {
                        }
                    },
                    initTree: function () {
                    },
                    save: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.nodeSizeEditDialog.tree.treeId);
                        var nodes = nodeTree.getCheckedNodes(true);
                        if (null == nodes || nodes == 0) {
                            $rootScope.$alert("图元未选择！", "alarm");
                            return;
                        }
                        if (null == $scope.nodeSizeEditDialog.sizeX || $scope.nodeSizeEditDialog.sizeX == "") {
                            $rootScope.$alert("图元长度尺寸未输入！", "alarm");
                            return;
                        }
                        if (null == $scope.nodeSizeEditDialog.sizeY || $scope.nodeSizeEditDialog.sizeY == "") {
                            $rootScope.$alert("图元宽度尺寸未输入！", "alarm");
                            return;
                        }
                        var re = /^[1-9]\d*$/;
                        if (!re.test($scope.nodeSizeEditDialog.sizeX)) {
                            $rootScope.$alert("长度尺寸非法数字！", "alarm");
                            return;
                        }
                        if (!re.test($scope.nodeSizeEditDialog.sizeY)) {
                            $rootScope.$alert("宽度尺寸非法数字！", "alarm");
                            return;
                        }
                        if ($scope.nodeSizeEditDialog.sizeX <= 28) {
                            $rootScope.$alert("图元长度尺寸未在范围内！", "alarm");
                            return;
                        }
                        if ($scope.nodeSizeEditDialog.sizeY <= 28) {
                            $rootScope.$alert("图元宽度尺寸未在范围内！", "alarm");
                            return;
                        }
                        var nodeList = new Array();
                        var obj;
                        for (var i = 0; i < nodes.length; i++) {
                            obj = new Object();
                            obj.id = nodes[i].id;
                            nodeList.push(obj);
                        }
                        $scope.nodeSizeEditDialog.model = nodeList;
                        var size = $scope.nodeSizeEditDialog.sizeX.trim() + "," + $scope.nodeSizeEditDialog.sizeY.trim();
                        topoNodeService.updateNodesSize({id: topoCommon.currentView.split(",")[$routeParams.classify], size: size}, $scope.nodeSizeEditDialog.model, function (data) {
                            if (data.result == "success") {
                                $scope.topoView.reload();
                            }
                            $scope.nodeSizeEditDialog.hide();
                        });
                    }
                });
                <!-- 图元尺寸对话框 结束 -->

                <!-- 图元定位对话框 开始 -->
                $scope.elementPositioningDialog = utilTools.currentDialog({
                    id: "elementPositioningDialog",
                    title: "设置",
                    model: {},
                    save: function () {
                        var nodeList = new Array();
                        $("#elementPositioningForm .data-row").each(function (index, obj) {
                            var isSelect = $(obj).find("[name='isSelect']").val();
                            if (isSelect == "true"){
                                var mc = $scope.elementPositioningDialog.allElementList[index];
                                var dataObj = new Object();
                                dataObj.id = mc.id;
                                dataObj.displayName = mc.displayName;
                                dataObj.isSelect = isSelect;
                                nodeList.push(dataObj);
                            }
                        });
                        $scope.elementPositioningDialog.model = nodeList;
                        topoNodeService.updateNodesPositioning({id: topoCommon.currentView.split(",")[$routeParams.classify]}, $scope.elementPositioningDialog.model, function (data) {
                            if (data.result == "success") {
                                $scope.topoView.reload();
                            }
                            $scope.elementPositioningDialog.hide();
                        });
                    }
                });
                <!-- 图元定位对话框 结束 -->

                <!-- 图元关联拓扑图对话框 开始 -->
                $scope.drillConfigDialog = utilTools.currentDialog({
                    id: "drillConfigDialog",
                    title: "关联子图",
                    model: {
                        drillMode: "delete"
                    },
                    tree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'drillConfigTree',
                        checkbox: "true",
                        treeClick: function () {
                        },
                        onCheck: function () {
                        }
                    },
                    initTree: function () {
                        $scope.drillConfigDialog.tree.data = topoViewService.queryByClassify({classify: $routeParams.classify}, function (data) {
                            if (data.result == "success") {
                                $scope.drillConfigDialog.tree.data = data.msg;
                            }
                        });
                    },
                    save: function () {
                        if ($scope.drillConfigDialog.model.drillMode == "delete") {
                            $scope.drillConfigDialog.deleteDrill();
                        } else if ($scope.drillConfigDialog.model.drillMode == "update") {
                            $scope.drillConfigDialog.updateDrill();
                        } else {
                            alert();
                        }
                    },
                    deleteDrill: function () {
                        topoNodeService.deleteDrill({id: topoCommon.currentView.split(",")[$routeParams.classify], node_id: $scope.drillConfigDialog.model.currentNodeId}, {}, function (data) {
                            if (data.result == "success") {
                                topoCommon.currentNode = -1;
                                topoCommon.currentNodeName = "";
                                topoCommon.currentNodeDisplayName = "";
                                topoCommon.currentNodeType = "";
                                topoCommon.currentNodeSize = "";
                                topoCommon.currentNodeDrill = -1;
                                Loading.show();
                                $scope.toposhow.data.Initial = 1;
                                $scope.topoView.reload();
                            }
                            $scope.drillConfigDialog.hide();
                        });
                    },
                    updateDrill: function () {
                        var viewTree = angular.element.fn.zTree.getZTreeObj($scope.drillConfigDialog.tree.treeId);
                        var views = viewTree.getCheckedNodes(true);
                        if (null == views || views == 0) {
                            $rootScope.$alert("视图未选择", "alarm");
                            return;
                        }
                        for (var i = 0; i < views.length; i++) {
                            $scope.drillConfigDialog.model.drillId = views[i].id;
                            $scope.drillConfigDialog.model.drillName = views[i].name;
                            $scope.drillConfigDialog.model.pId = views[i].pId;
                            $scope.drillConfigDialog.model.sort = views[i].sort;
                        }
                        topoNodeService.drill({id: topoCommon.currentView.split(",")[$routeParams.classify], node_id: $scope.drillConfigDialog.model.currentNodeId, drillId: $scope.drillConfigDialog.model.drillId, drillName: $scope.drillConfigDialog.model.drillName}, {}, function (data) {
                            if (data.result == "success") {
                                if ($routeParams.classify == 0) {
                                    topoCommon.currentView = $scope.drillConfigDialog.model.drillId + "," + topoCommon.currentView.split(",")[1];
                                    topoCommon.currentViewName = $scope.drillConfigDialog.model.drillName + "," + topoCommon.currentViewName.split(",")[1];
                                    topoCommon.currentViewPId = $scope.drillConfigDialog.model.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                    topoCommon.currentViewSort = $scope.drillConfigDialog.model.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                } else if ($routeParams.classify == 1) {
                                    topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + $scope.drillConfigDialog.model.drillId;
                                    topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + $scope.drillConfigDialog.model.drillName;
                                    topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + $scope.drillConfigDialog.model.pId;
                                    topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + $scope.drillConfigDialog.model.sort;
                                }
                                $scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                                var topoViewTree = angular.element.fn.zTree.getZTreeObj($scope.topoViewTree.treeId);
                                var nodes = topoViewTree.transformToArray(topoViewTree.getNodes());
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i].id == $scope.drillConfigDialog.model.drillId) {
                                        topoViewTree.selectNode(nodes[i]);
                                    }
                                }
                                $scope.topoViewTreeNode.isShow(topoCommon.currentViewPId.split(",")[$routeParams.classify], topoCommon.currentViewSort.split(",")[$routeParams.classify]);
                                topoCommon.currentNode = -1;
                                topoCommon.currentNodeName = "";
                                topoCommon.currentNodeDisplayName = "";
                                topoCommon.currentNodeType = "";
                                topoCommon.currentNodeSize = "";
                                topoCommon.currentNodeDrill = -1;
                                Loading.show();
                                $scope.toposhow.data.Initial = 1;
                                $scope.topoView.reload();
                            }
                            $scope.drillConfigDialog.hide();
                        });
                    }
                });
                <!-- 图元关联拓扑图对话框 结束 -->


                <!-- 更换图元图标 开始 -->
                $scope.updateTypeBackground = utilTools.currentDialog({
                    id: "updateTypeBackground",
                    title: "更换图元图标",
                    model: {
                        moc: [],
                        mocClassify: [],
                        nodeMoc: "",
                        nodeMocClassify: ""
                    },
                    initData: function () {
                        topoResourceService.synNodesResource({classify: $routeParams.classify}, function (data) {
                            if (data.result == "success") {
                                $scope.updateTypeBackground.model.moc = data.msg.moc;
                            }
                        });
                    },
                    save: function () {
                        var postUrl = topo_path + "topo/" + topoCommon.currentView.split(",")[$routeParams.classify] + "/nodes/updateTypeBackground?nodeType=" + $scope.updateTypeBackground.model.nodeMoc + "&nodeClassify=" + $scope.updateTypeBackground.model.nodeMocClassify;
                        if (null == $scope.updateTypeBackground.model.nodeMoc || $scope.updateTypeBackground.model.nodeMoc == "") {
                            $rootScope.$alert("更换图元图标失败，资源类型组未选择！", "alarm");
                            return;
                        }
                        if (null == $scope.updateTypeBackground.model.nodeMocClassify || $scope.updateTypeBackground.model.nodeMocClassify == "") {
                            $rootScope.$alert("更换图元图标失败，资源类型未选择！", "alarm");
                            return;
                        }
                        jQuery.ajaxFileUpload
                        (
                            {
                                url: postUrl,
                                secureuri: false,
                                fileElementId: "updateTypeBackgroundImage",
                                dataType: 'text',
                                data: {},
                                success: function (data, status) {
                                    if (data.indexOf("SizeLimitExceededException") > 0) {
                                        $rootScope.$alert("上传图片超过2M大小，上传失败!", "alarm");
                                        return;
                                    }
                                    if (data.indexOf("success") > 0) {
                                        $scope.updateTypeBackground.hide();
                                        $scope.topoView.reload();
                                        return;
                                    }
                                    if (data.indexOf("error") > 0) {
                                        if (data.indexOf("非png") > 0) {
                                            $rootScope.$alert("上传非png或jpg格式图片，请重新上传!", "alarm");
                                            return;
                                        } else if(data.indexOf("图片高度") > 0){
                                            $rootScope.$alert("上传图片高度要小于1200px，请重新上传!", "alarm");
                                            return;
                                        }else {
                                            $rootScope.$alert("更换图元图标失败，详情查看日志!", "alarm");
                                            return;
                                        }
                                    }
                                },
                                error: function (data, status, e) {

                                }
                            }
                        )
                    }
                });
                $scope.$watch("updateTypeBackground.model.nodeMoc", function (newVal, oldVal) {
                    $scope.updateTypeBackground.model.mocClassify = [];
                    for (var i = 0; i < $scope.updateTypeBackground.model.moc.length; i++) {
                        if ($scope.updateTypeBackground.model.moc[i].name == $scope.updateTypeBackground.model.nodeMoc) {
                            for (var j = 0; j < $scope.updateTypeBackground.model.moc[i].children.length; j++) {
                                $scope.updateTypeBackground.model.mocClassify.push($scope.updateTypeBackground.model.moc[i].children[j]);
                            }
                            return;
                        }
                    }
                }, false);
                <!-- 更换图元图标 结束 -->


                <!-- 虚拟图元对话框 开始 -->
                $scope.dummyNodeDialog = utilTools.currentDialog({
                    id: "dummyNodeDialog",
                    title: "新增",
                    //hiddenButton: true,
                    model: {
                    },
                    save: function () {
                        if ($scope.dummyNodeDialog.model.name != null && $scope.dummyNodeDialog.model.name.length > 32) {
                            $rootScope.$alert("图元名称超出长度限制！", "alarm");
                            return;
                        }
                        if (null == $scope.dummyNodeDialog.model.sizeX || $scope.dummyNodeDialog.model.sizeX == "") {
                            $rootScope.$alert("图元长度尺寸未输入！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeDialog.model.sizeX != null && $scope.dummyNodeDialog.model.sizeX.length > 32) {
                            $rootScope.$alert("图元长度尺寸超出限制！", "alarm");
                            return;
                        }
                        if (null == $scope.dummyNodeDialog.model.sizeY || $scope.dummyNodeDialog.model.sizeY == "") {
                            $rootScope.$alert("图元宽度尺寸未输入！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeDialog.model.sizeY != null && $scope.dummyNodeDialog.model.sizeY.length > 32) {
                            $rootScope.$alert("图元宽度尺寸超出限制！", "alarm");
                            return;
                        }
                        var re = /^[1-9]\d*$/;
                        if (!re.test($scope.dummyNodeDialog.model.sizeX)) {
                            $rootScope.$alert("长度尺寸非法数字！", "alarm");
                            return;
                        }
                        if (!re.test($scope.dummyNodeDialog.model.sizeY)) {
                            $rootScope.$alert("宽度尺寸非法数字！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeDialog.model.sizeX <= 28) {
                            $rootScope.$alert("图元长度尺寸未在范围内！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeDialog.model.sizeY <= 28) {
                            $rootScope.$alert("图元宽度尺寸未在范围内！", "alarm");
                            return;
                        }
                        $scope.dummyNodeDialog.create();
                    },
                    create: function () {
                        var size = $scope.dummyNodeDialog.model.sizeX.trim() + "," + $scope.dummyNodeDialog.model.sizeY.trim();
                        var postUrl = topo_path + "topo/" + topoCommon.currentView.split(",")[$routeParams.classify] + "/nodes/saveDummyNode?name=" + $scope.dummyNodeDialog.model.name + "&size=" + size + "&nodeId=" + $scope.dummyNodeDialog.model.currentNodeId + "&classify=" + $routeParams.classify;

                        jQuery.ajaxFileUpload
                        (
                            {
                                url: postUrl,
                                secureuri: false,
                                fileElementId: "dummyNodeImage",
                                dataType: 'text',
                                data: {},
                                success: function (data, status) {
                                    if (data.indexOf("SizeLimitExceededException") > 0) {
                                        $rootScope.$alert("上传图片超过2M大小，上传失败!", "alarm");
                                        return;
                                    }
                                    if (data.indexOf("success") > 0) {
                                        topoCommon.currentNode = -1;
                                        topoCommon.currentNodeName = "";
                                        topoCommon.currentNodeDisplayName = "";
                                        topoCommon.currentNodeType = "";
                                        topoCommon.currentNodeSize = "";
                                        topoCommon.currentNodeDrill = -1;
                                        $scope.dummyNodeDialog.hide();
                                        $scope.topoView.reload();
                                        $scope.topoViewTree.init();
                                        return;
                                    }
                                    if (data.indexOf("error") > 0) {
                                        if (data.indexOf("非png") > 0) {
                                            $rootScope.$alert("上传非png或jpg格式图片，请重新上传!", "alarm");
                                            return;
                                        } else {
                                            $rootScope.$alert("保存虚拟图元失败，详情查看日志!", "alarm");
                                            return;
                                        }
                                    }
                                },
                                error: function (data, status, e) {

                                }
                            }
                        )
                    }
                });
                <!-- 虚拟图元对话框 结束 -->

                <!-- 编辑虚拟图元对话框 开始 -->
                $scope.dummyNodeEditDialog = utilTools.currentDialog({
                    id: "dummyNodeEditDialog",
                    title: "编辑",
                    //hiddenButton: true,
                    model: {
                    },
                    save: function () {
                        if ($scope.dummyNodeEditDialog.model.name != null && $scope.dummyNodeEditDialog.model.name.length > 32) {
                            $rootScope.$alert("图元名称超出长度限制！", "alarm");
                            return;
                        }
                        if (null == $scope.dummyNodeEditDialog.model.sizeX || $scope.dummyNodeEditDialog.model.sizeX == "") {
                            $rootScope.$alert("图元长度尺寸未输入！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeEditDialog.model.sizeX != null && $scope.dummyNodeEditDialog.model.sizeX.length > 32) {
                            $rootScope.$alert("图元长度尺寸超出限制！", "alarm");
                            return;
                        }
                        if (null == $scope.dummyNodeEditDialog.model.sizeY || $scope.dummyNodeEditDialog.model.sizeY == "") {
                            $rootScope.$alert("图元宽度尺寸未输入！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeEditDialog.model.sizeY != null && $scope.dummyNodeEditDialog.model.sizeY.length > 32) {
                            $rootScope.$alert("图元宽度尺寸超出限制！", "alarm");
                            return;
                        }
                        var re = /^[1-9]\d*$/;
                        if (!re.test($scope.dummyNodeEditDialog.model.sizeX)) {
                            $rootScope.$alert("长度尺寸非法数字！", "alarm");
                            return;
                        }
                        if (!re.test($scope.dummyNodeEditDialog.model.sizeY)) {
                            $rootScope.$alert("宽度尺寸非法数字！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeEditDialog.model.sizeX <= 28) {
                            $rootScope.$alert("图元长度尺寸未在范围内！", "alarm");
                            return;
                        }
                        if ($scope.dummyNodeEditDialog.model.sizeY <= 28) {
                            $rootScope.$alert("图元宽度尺寸未在范围内！", "alarm");
                            return;
                        }
                        $scope.dummyNodeEditDialog.create();
                    },
                    create: function () {
                        var size = $scope.dummyNodeEditDialog.model.sizeX.trim() + "," + $scope.dummyNodeEditDialog.model.sizeY.trim();
                        var postUrl = topo_path + "topo/" + topoCommon.currentView.split(",")[$routeParams.classify] + "/nodes/editDummyNode?name=" + $scope.dummyNodeEditDialog.model.name + "&size=" + size + "&nodeId=" + $scope.dummyNodeEditDialog.model.currentNodeId + "&classify=" + $routeParams.classify;
                        jQuery.ajaxFileUpload
                        (
                            {
                                url: postUrl,
                                secureuri: false,
                                fileElementId: "dummyNodeEditImage",
                                dataType: 'text',
                                data: {},
                                success: function (data, status) {
                                    if (data.indexOf("SizeLimitExceededException") > 0) {
                                        $rootScope.$alert("上传图片超过2M大小，上传失败!", "alarm");
                                        return;
                                    }
                                    if (data.indexOf("success") > 0) {
                                        topoCommon.currentNode = -1;
                                        topoCommon.currentNodeName = "";
                                        topoCommon.currentNodeDisplayName = "";
                                        topoCommon.currentNodeType = "";
                                        topoCommon.currentNodeSize = "";
                                        topoCommon.currentNodeDrill = -1;
                                        $scope.dummyNodeEditDialog.hide();
                                        $scope.topoView.reload();
                                        return;
                                    }
                                    if (data.indexOf("error") > 0) {
                                        if (data.indexOf("非png") > 0) {
                                            $rootScope.$alert("上传非png或jpg格式图片，请重新上传!", "alarm");
                                            return;
                                        } else {
                                            $rootScope.$alert("编辑虚拟图元失败，详情查看日志!", "alarm");
                                            return;
                                        }
                                    }
                                },
                                error: function (data, status, e) {

                                }
                            }
                        )
                    }
                });
                <!-- 编辑虚拟图元对话框 结束 -->

                <!-- 上传背景图 开始 -->
                $scope.uploadBackgroundDialog = utilTools.currentDialog({
                    id: "uploadBackgroundDialog",
                    title: "设置",
                    model: {
                        bgMode: "delete"
                    },
                    save: function () {
                        if ($scope.uploadBackgroundDialog.model.bgMode == "delete") {
                            $scope.uploadBackgroundDialog.deleteBackGround();
                        } else if ($scope.uploadBackgroundDialog.model.bgMode == "update") {
                            if (null == $scope.uploadBackgroundDialog.model.sizeX || $scope.uploadBackgroundDialog.model.sizeX == "") {
                                $rootScope.$alert("背景图坐标X轴尺寸未输入！", "alarm");
                                return;
                            }
                            if ($scope.uploadBackgroundDialog.model.sizeX != null && $scope.uploadBackgroundDialog.model.sizeX.length > 32) {
                                $rootScope.$alert("背景图坐标X轴尺寸超出限制！", "alarm");
                                return;
                            }
                            if (null == $scope.uploadBackgroundDialog.model.sizeY || $scope.uploadBackgroundDialog.model.sizeY == "") {
                                $rootScope.$alert("背景图坐标Y轴尺寸未输入！", "alarm");
                                return;
                            }
                            if ($scope.uploadBackgroundDialog.model.sizeY != null && $scope.uploadBackgroundDialog.model.sizeY.length > 32) {
                                $rootScope.$alert("背景图坐标Y轴尺寸超出限制！", "alarm");
                                return;
                            }
                            var re = /^[0-9]\d*$/;
                            if (!re.test($scope.uploadBackgroundDialog.model.sizeX)) {
                                $rootScope.$alert("背景图坐标X轴尺寸非法数字！", "alarm");
                                return;
                            }
                            if (!re.test($scope.uploadBackgroundDialog.model.sizeY)) {
                                $rootScope.$alert("背景图坐标Y轴尺寸非法数字！", "alarm");
                                return;
                            }
                            $scope.uploadBackgroundDialog.updateBackGround();
                        }
                    },
                    deleteBackGround: function () {
                        topoViewService.deleteBackground({id: topoCommon.currentView.split(",")[$routeParams.classify]}, {}, function (data) {
                            if (data.result == "success") {
                                $scope.topoView.reload();
                            }
                            $scope.uploadBackgroundDialog.hide();
                        });
                    },
                    updateBackGround: function () {
                        var location = $scope.uploadBackgroundDialog.model.sizeX.trim() + "px" + " " + $scope.uploadBackgroundDialog.model.sizeY.trim() + "px";
                        var postUrl = topo_path + "topo/uploadBackground?id=" + topoCommon.currentView.split(",")[$routeParams.classify] + "&location=" + location;
                        jQuery.ajaxFileUpload
                        (
                            {
                                url: postUrl,
                                secureuri: false,
                                fileElementId: "backgroundImage",
                                dataType: 'text',
                                data: {},
                                success: function (data, status) {
                                    if (data.indexOf("SizeLimitExceededException") > 0) {
                                        $rootScope.$alert("上传图片超过2M大小，上传失败!", "alarm");
                                        return;
                                    }
                                    if (data.indexOf("success") > 0) {
                                        topoCommon.currentNode = -1;
                                        topoCommon.currentNodeName = "";
                                        topoCommon.currentNodeDisplayName = "";
                                        topoCommon.currentNodeType = "";
                                        topoCommon.currentNodeSize = "";
                                        topoCommon.currentNodeDrill = -1;
                                        $scope.uploadBackgroundDialog.hide();
                                        $scope.topoView.reload();
                                        return;
                                    }
                                    if (data.indexOf("error") > 0) {
                                        if (data.indexOf("非jpg") > 0) {
                                            $rootScope.$alert("上传非jpg格式图片，请重新上传!", "alarm");
                                            return;
                                        }else if (data.indexOf("图片高度") > 0) {
                                            $rootScope.$alert("上传图片高度要小于1200px，请重新上传!", "alarm");
                                            return;
                                        }else {
                                            $rootScope.$alert("上传图片失败，详情查看日志!", "alarm");
                                            return;
                                        }
                                    }
                                },
                                error: function (data, status, e) {
                                    $rootScope.$alert(e);
                                }
                            }
                        )
                    }
                });
                $scope.$watch("uploadBackgroundDialog.model.bgMode", function (newVal, oldVal) {
                    if ($scope.uploadBackgroundDialog.model.bgMode != null && $scope.uploadBackgroundDialog.model.bgMode == "delete") {
                        $scope.uploadBackgroundDialog.model.isUpLoad = false;
                    } else if ($scope.uploadBackgroundDialog.model.bgMode != null && $scope.uploadBackgroundDialog.model.bgMode == "update") {
                        $scope.uploadBackgroundDialog.model.isUpLoad = true;
                    }
                }, false);
                <!-- 上传背景图 结束 -->

                <!-- 图元更名 开始 -->
                $scope.updateCustomNameDialog = utilTools.currentDialog({
                    id: "updateCustomNameDialog",
                    title: "更名",
                    hiddenButton: true,
                    model: {
                        customNameMode: "update"
                    },
                    save: function () {
                        if ($scope.updateCustomNameDialog.model.customNameMode == "delete") {
                            $scope.updateCustomNameDialog.deleteNodeName();
                        } else if ($scope.updateCustomNameDialog.model.customNameMode == "update") {
                            $scope.updateCustomNameDialog.updateNodeName();
                        }
                    },
                    deleteNodeName: function () {
                        if ($scope.updateCustomNameDialog.model.selectType == "node") {
                            topoNodeService.updateCustomName({id: topoCommon.currentView.split(",")[$routeParams.classify], node_id: $scope.updateCustomNameDialog.model.selectId}, {}, function (data) {
                                if (data.result == "success") {
                                    $scope.topoView.reload();
                                }
                                $scope.updateCustomNameDialog.hide();
                            });
                        } else if ($scope.updateCustomNameDialog.model.selectType == "link") {
                            topoLineService.updateCustomName({id: topoCommon.currentView.split(",")[$routeParams.classify], line_id: $scope.updateCustomNameDialog.model.selectId}, {}, function (data) {
                                if (data.result == "success") {
                                    $scope.topoView.reload();
                                }
                                $scope.updateCustomNameDialog.hide();
                            });
                        }
                    },
                    updateNodeName: function () {
                        if ($scope.updateCustomNameDialog.model.selectType == "node") {
                            topoNodeService.updateCustomName({id: topoCommon.currentView.split(",")[$routeParams.classify], node_id: $scope.updateCustomNameDialog.model.selectId, customName: $scope.updateCustomNameDialog.model.name}, {}, function (data) {
                                if (data.result == "success") {
                                    $scope.topoView.reload();
                                }
                                $scope.updateCustomNameDialog.hide();
                            });
                        } else if ($scope.updateCustomNameDialog.model.selectType == "link") {
                            topoLineService.updateCustomName({id: topoCommon.currentView.split(",")[$routeParams.classify], line_id: $scope.updateCustomNameDialog.model.selectId, customName: $scope.updateCustomNameDialog.model.name}, {}, function (data) {
                                if (data.result == "success") {
                                    $scope.topoView.reload();
                                }
                                $scope.updateCustomNameDialog.hide();
                            });
                        }
                    }
                });
                <!-- 图元更名 结束 -->


                <!-- 图元镜像对话框 开始 -->
                $scope.elementMirroringDialog = utilTools.currentDialog({
                    id: "elementMirroringDialog",
                    title: "设置",
                    model: {},
                    tree: {
                        data: [],
                        returnData: [],
                        checked: "",
                        treeId: 'elementMirroringTree',
                        checkbox: "true",
                        treeClick: function () {
                        },
                        onCheck: function () {
                        }
                    },
                    initTree: function () {
                    },
                    save: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.elementMirroringDialog.tree.treeId);
                        var nodes = nodeTree.getCheckedNodes(true);
                        if (null == nodes || nodes == 0) {
                            $rootScope.$alert("图元未选择！", "alarm");
                            return;
                        }
                        var nodeList = new Array();
                        var obj;
                        for (var i = 0; i < nodes.length; i++) {
                            obj = new Object();
                            obj.id = nodes[i].id;
                            nodeList.push(obj);
                        }
                        $scope.elementMirroringDialog.model = nodeList;
                        topoNodeService.updateNodesMirroring({id: topoCommon.currentView.split(",")[$routeParams.classify], ifMirroring: $scope.elementMirroringDialog.mirroring}, $scope.elementMirroringDialog.model, function (data) {
                            if (data.result == "success") {
                                $scope.toposhow.data.network.updateElementMirroring(nodeList, $scope.elementMirroringDialog.mirroring);
                                $scope.topoView.reload();
                            }
                            $scope.elementMirroringDialog.hide();
                        });
                    }
                });
                <!-- 图元镜像对话框 结束 -->


                <!-- 卸载背景图对话框 开始 -->
                $scope.deleteBackgroundDialog = utilTools.currentDialog({
                    id: "deleteBackgroundDialog",
                    title: "卸载拓扑背景图",
                    model: {
                    },
                    save: function () {
                        topoViewService.deleteBackground({id: topoCommon.currentView.split(",")[$routeParams.classify]}, {}, function (data) {
                            if (data.result == "success") {
                                $scope.topoView.reload();
                            }
                            $scope.deleteBackgroundDialog.hide();
                        });
                    }
                });
                <!-- 卸载背景图对话框 结束 -->

                <!-- 对话框激活 开始 -->
                $scope.dialogActive = {
                    synAddNodeShow: function () {
                        $scope.nodeSynAddDialog.model = {
                            moc: [],
                            mocClassify: [],
                            mo: [],
                            saveMoList: null
                        };
                        $scope.nodeSynAddDialog.trgTree.data = [];
                        $scope.nodeSynAddDialog.srcTree.data = [];
                        $scope.nodeSynAddDialog.initData();
                        $scope.nodeSynAddDialog.show(event);
                    },
                    addNodeShow: function () {
                        $scope.nodeAddDialog.initTree();
                        $scope.nodeAddDialog.model = {viewId: topoCommon.currentView.split(",")[$routeParams.classify]}
                        $scope.nodeAddDialog.show(event);
                    },
                    delElementShow: function () {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中", "alarm");
                            return;
                        }
                        var delElementList = new Array();
                        var obj;
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (selectElement._as[i].elType == "link") {
                                obj = new Object();
                                obj.id = selectElement._as[i]._id.substring(2, selectElement._as[i]._id.length);
                                obj.elType = selectElement._as[i].elType;
                                obj.cId = selectElement._as[i].cId;
                                obj.type = null;
                                obj.classify = null;
                                obj.inNodeMoId = selectElement._as[i].inNodeMoId;
                                obj.outNodeMoId = selectElement._as[i].outNodeMoId;
                            } else if (selectElement._as[i].elType == "node") {
                                obj = new Object();
                                obj.id = selectElement._as[i]._id.substring(2, selectElement._as[i]._id.length);
                                obj.elType = selectElement._as[i].elType;
                                obj.cId = selectElement._as[i].cId;
                                obj.type = selectElement._as[i].type;
                                obj.classify = selectElement._as[i].classify;
                                obj.inNodeMoId = null;
                                obj.outNodeMoId = null;
                            }
                            delElementList.push(obj);
                        }
                        $scope.elementDelDialog.model = delElementList;
                        $scope.elementDelDialog.show();
                    },
                    dummyNodeDialogShow: function (event) {
                        $scope.dummyNodeDialog.model = {
                            name: "",
                            currentNodeId: "",
                            sizeX: "",
                            sizeY: "",
                            sizeArray: []
                        };
                        document.getElementById("dummyNodeImage").value = "";
                        $scope.dummyNodeDialog.show();
                    },
                    dummyNodeEditDialogShow: function (event) {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中！", "alarm");
                            return;
                        } else if (selectElement.size() > 1) {
                            $rootScope.$alert("只能同步单一图元！", "alarm");
                            return;
                        }
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (selectElement._as[i].elType == "link") {
                                $rootScope.$alert("线路不能编辑！", "alarm");
                                return;
                            } else if (selectElement._as[i].type != "dummy") {
                                $rootScope.$alert("非虚拟图元不能编辑！", "alarm");
                                return;
                            } else {
                                $scope.dummyNodeEditDialog.model = {
                                    name: selectElement._as[i]._name,
                                    currentNodeId: selectElement._as[i]._id.substring(2, selectElement._as[i]._id.length),
                                    type: selectElement._as[i].type,
                                    sizeX: selectElement._as[i].size.split(",")[0],
                                    sizeY: selectElement._as[i].size.split(",")[1],
                                    sizeArray: []
                                };
                                $scope.dummyNodeEditDialog.model.displayName = selectElement._as[i].displayName;
                                if (selectElement._as[i].elImgPath != null && selectElement._as[i].elImgPath != ""){
                                    $scope.dummyNodeEditDialog.model.elImgPath = "原图名：" + selectElement._as[i].elImgPath;
                                }
                            }
                        }
                        document.getElementById("dummyNodeEditImage").value = "";
                        $scope.dummyNodeEditDialog.show();
                    },
                    nodeSizeEditDialogShow: function () {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中！", "alarm");
                            return;
                        }
                        var nodeSizeElementList = new Array();
                        var obj;
                        for (var z = 0; z < selectElement.size(); z++) {
                            if (selectElement._as[z].elType == "node") {
                                obj = new Object();
                                obj.id = selectElement._as[z]._id.substring(2, selectElement._as[z]._id.length);
                                obj.elType = selectElement._as[z].elType;
                                obj.cId = selectElement._as[z].cId;
                                obj.type = selectElement._as[z].type;
                                obj.classify = selectElement._as[z].classify;
                                obj.displayName = selectElement._as[z].displayName;
                                obj.pid = 0;
                                obj.sizeX = selectElement._as[z].size.split(",")[0];
                                obj.sizeY = selectElement._as[z].size.split(",")[1];
                                nodeSizeElementList.push(obj);
                            }
                        }
                        if (nodeSizeElementList.length <= 0) {
                            $rootScope.$alert("图元未选中!!", "alarm");
                            return;
                        }
                        $scope.nodeSizeEditDialog.tree.data = [];
                        $scope.nodeSizeEditDialog.tree.data = nodeSizeElementList;
                        if (nodeSizeElementList.length == 1) {
                            $scope.nodeSizeEditDialog.sizeX = nodeSizeElementList[0].sizeX;
                            $scope.nodeSizeEditDialog.sizeY = nodeSizeElementList[0].sizeY;
                        } else {
                            $scope.nodeSizeEditDialog.sizeX = "";
                            $scope.nodeSizeEditDialog.sizeY = "";
                        }
                        $scope.nodeSizeEditDialog.show();
                    },
                    addLinkShow: function () {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中！", "alarm");
                            return;
                        } else if (selectElement.size() != 2) {
                            $rootScope.$alert("只能选择两个图元！", "alarm");
                            return;
                        }
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (selectElement._as[i].elType == "link") {
                                $rootScope.$alert("不能选择线路！", "alarm");
                                return;
                            }
                        }
                        if ((selectElement._as[0].classify == "windows" || selectElement._as[0].classify == "linux" || selectElement._as[0].classify == "hpux"
                            || selectElement._as[0].classify == "aix" || selectElement._as[0].classify == "solaris" || selectElement._as[0].classify == "switch2"
                            || selectElement._as[0].classify == "switch3" || selectElement._as[0].classify == "router" || selectElement._as[0].classify == "loadbalancing"
                            || selectElement._as[0].classify == "security")
                            && (selectElement._as[1].classify == "windows" || selectElement._as[1].classify == "linux" || selectElement._as[1].classify == "hpux"
                            || selectElement._as[1].classify == "aix" || selectElement._as[1].classify == "solaris" || selectElement._as[1].classify == "switch2"
                            || selectElement._as[1].classify == "switch3" || selectElement._as[1].classify == "router" || selectElement._as[1].classify == "loadbalancing"
                            || selectElement._as[1].classify == "security")) {
                            $scope.linkAddDialog.model.linkRadioType = "link";
                            $scope.linkAddDialog.model.classify = 0;
                            $scope.linkAddDialog.initTree(selectElement._as[0], selectElement._as[1]);
                            $scope.linkAddDialog.model.isLinkShow = true;
                            $scope.linkAddDialog.model.isLinkShow1 = true;
                            $("#linkAddDialog .modal-dialog").css("width", "700px");
                            $("#linkAddDialog .modal-dialog").css("margin-left", "-350px");
                            $("#linkAddDialog .modal-content").css("width", "700px");
                            $("#linkAddDialog .dialog-con").css("width", "700px");
                        } else {
                            $scope.linkAddDialog.model.linkRadioType = "rela";
                            $scope.linkAddDialog.model.classify = 1;
                            $scope.linkAddDialog.model.isLinkShow = false;
                            $scope.linkAddDialog.model.isLinkShow1 = false;
                            $("#linkAddDialog .modal-dialog").css("width", "500px");
                            $("#linkAddDialog .modal-dialog").css("margin-left", "-250px");
                            $("#linkAddDialog .modal-content").css("width", "500px");
                            $("#linkAddDialog .dialog-con").css("width", "500px");
                        }
                        $scope.linkAddDialog.model.leftLinkType = selectElement._as[0].classify;
                        $scope.linkAddDialog.model.leftName = selectElement._as[0].displayName;
                        $scope.linkAddDialog.model.inNodeId = selectElement._as[0]._id.substring(2, selectElement._as[0]._id.length);
                        $scope.linkAddDialog.model.rightLinkType = selectElement._as[1].classify;
                        $scope.linkAddDialog.model.rightName = selectElement._as[1].displayName;
                        $scope.linkAddDialog.model.outNodeId = selectElement._as[1]._id.substring(2, selectElement._as[1]._id.length);
                        $scope.linkAddDialog.model.perNode = "true";
                        $scope.linkAddDialog.model.inPort = "";
                        $scope.linkAddDialog.model.outPort = "";
                        $scope.linkAddDialog.model.name = "";
                        $scope.linkAddDialog.show(event);
                    },
                    synAddLinkShow: function () {
                        $scope.linkSynAddDialog.initTree();
                        $scope.linkSynAddDialog.show();
                    },

                    linkStyleDialogShow: function () {
                        $scope.linkStyleDialog.ifDottedLine = false;
                        $scope.linkStyleDialog.styleMode = "arc";
                        $scope.linkStyleDialog.initTree();
                        $scope.linkStyleDialog.show();
                    },
                    drillConfigShow: function (event) {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中！", "alarm");
                            return;
                        } else if (selectElement.size() > 1) {
                            $rootScope.$alert("只能单一图元关联视图！", "alarm");
                            return;
                        }
                        var currentNode;
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (selectElement._as[i].elType == "link") {
                                $rootScope.$alert("线路不能关联视图！", "alarm");
                                return;
                            } else {
                                currentNode = selectElement._as[i];
                            }
                        }
                        if (null != currentNode) {
                            $scope.drillConfigDialog.model.drillId = null;
                            $scope.drillConfigDialog.model.drillName = null;
                            var rObj = document.getElementsByName("drillRadio");
                            if (currentNode.drillId != null && currentNode.drillId != ""){
                                for (var i = 0; i < rObj.length; i++) {
                                    if (rObj[i].value == "update") {
                                        rObj[i].checked = 'checked';
                                    }
                                }
                                $scope.drillConfigDialog.model.drillMode = "update";
                            } else {
                                for (var i = 0; i < rObj.length; i++) {
                                    if (rObj[i].value == "delete") {
                                        rObj[i].checked = 'checked';
                                    }
                                }
                                $scope.drillConfigDialog.model.drillMode = "delete";
                            }
                            $scope.drillConfigDialog.initTree();
                            $scope.drillConfigDialog.model.currentNodeId = currentNode._id.substring(2, currentNode._id.length);
                            $scope.drillConfigDialog.model.currentNodeName = currentNode._name;
                            $scope.drillConfigDialog.model.currentNodeDrill = currentNode.drillId;
                            topoCommon.currentNodeDrill = currentNode.drillId;
                            $scope.drillConfigDialog.model.displayName = currentNode.displayName;
                            $scope.drillConfigDialog.show(event);
                        }
                    },
                    discoveryPageShow: function (event) {
//                        $scope.discoveryPage.init();
//                        Modal.show($scope.discoveryPage.modal.settings.id);
                        $rootScope.resource.showDiscoveryPage(
                            //下发自动发现任务
                            function (segment, fnSuccess, fnError) {
                                //DiscoveryClient.discover({},segment,fnSuccess,fnError);
                                topoDiscoveryClient.topoDodiscover({id: topoCommon.currentView.split(",")[$routeParams.classify]}, segment, fnSuccess, fnError);
                            },
                            //获得自动发现结果
                            function (fnSuccess, fnError) {
                                //DiscoveryClient.getResult({},{},fnSuccess,fnError);
                                topoDiscoveryClient.getTopoDiscoverResult({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, {}, fnSuccess, fnError);
                            },
                            //自动发现结束时处理结果
                            function (result) {
                                $scope.topoView.reload();
                                $scope.topoViewTree.init();
                            },
                            //modal框关闭时的动作
                            function () {
                                //$scope.listPage.settings.reload(true);
                            }
                        );
                    },
                    lockShow: function (event) {
                        $scope.lockPage.init();
                        Modal.show($scope.lockPage.modal.settings.id);
                    },
                    uploadBackgroundDialogShow: function (event) {
                        document.getElementById("backgroundImage").value = "";
                        var rObj = document.getElementsByName("bgRadio");
                        for (var i = 0; i < rObj.length; i++) {
                            if (rObj[i].value == "delete") {
                                rObj[i].checked = 'checked';
                            }
                        }
                        $scope.uploadBackgroundDialog.model.bgMode = "delete";
                        if ($scope.toposhow.data.network.getBg() != null && $scope.toposhow.data.network.getBg() != ""){
                            $scope.uploadBackgroundDialog.model.elImgPath = "原图名：" + $scope.toposhow.data.network.getBg();
                        }
                        $scope.uploadBackgroundDialog.model.sizeX = $scope.toposhow.data.network.getBgLocation().split(" ")[0].replace("px", '');
                        $scope.uploadBackgroundDialog.model.sizeY = $scope.toposhow.data.network.getBgLocation().split(" ")[1].replace("px", '');
                        $scope.uploadBackgroundDialog.model.isUpLoad = false;
                        $scope.uploadBackgroundDialog.show(event);
                    },
                    synchronous: function (event) {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中！", "alarm");
                            return;
                        } else if (selectElement.size() > 1) {
                            $rootScope.$alert("只能同步单一节点！", "alarm");
                            return;
                        }
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (selectElement._as[i].elType == "link") {
                                $rootScope.$alert("线路不能同步！", "alarm");
                                return;
                            }
                        }
                        $rootScope.$confirm("同步将导入所有关联图元和线路，是否确认？", function () {
                            Loading.show();
                            topoViewService.synchronous({id: topoCommon.currentView.split(",")[$routeParams.classify], node_id: selectElement._as[0]._id.substring(2, selectElement._as[0]._id.length)}, {}, function (data) {
                                if (data.result == "success") {
                                    topoCommon.currentNode = -1;
                                    topoCommon.currentNodeName = "";
                                    topoCommon.currentNodeDisplayName = "";
                                    topoCommon.currentNodeType = "";
                                    topoCommon.currentNodeSize = "";
                                    topoCommon.currentNodeDrill = -1;
                                    $scope.toposhow.data.Initial = 1
                                    $scope.topoView.reload();
                                    $scope.topoViewTree.init();
                                }
                            }, function (error) {
                                Loading.hide();
                            });
                        },'同步');
                    },
                    updateCustomNameDialogShow: function (event) {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元或线路未选中！", "alarm");
                            return;
                        } else if (selectElement.size() > 1) {
                            $rootScope.$alert("只能单一图元或线路！", "alarm");
                            return;
                        }
                        $scope.updateCustomNameDialog.model.selectId = selectElement._as[0]._id.substring(2, selectElement._as[0]._id.length);
                        $scope.updateCustomNameDialog.model.selectType = selectElement._as[0].elType;
                        if (null != selectElement._as[0].customName && selectElement._as[0].customName != "") {
                            $scope.updateCustomNameDialog.model.name = selectElement._as[0].customName;
                        } else {
                            $scope.updateCustomNameDialog.model.name = "";
                        }
                        var rObj = document.getElementsByName("customNameRadio");
                        for (var i = 0; i < rObj.length; i++) {
                            if (rObj[i].value == "update") {
                                rObj[i].checked = 'checked';
                            }
                        }
                        $scope.updateCustomNameDialog.model.customNameMode = "update";
                        $scope.updateCustomNameDialog.show();


                    },
                    deleteBackgroundDialogShow: function () {
                        if ($scope.toposhow.data.network.getNetworkViewBackground()) {
                            $scope.deleteBackgroundDialog.show();
                        } else {
                            $rootScope.$alert("该拓扑图无背景图！", "alarm");
                        }
                    },

                    updateTypeBackgroundShow: function () {
                        $scope.updateTypeBackground.model = {
                            nodeMoc: "",
                            nodeMocClassify: "",
                            mocClassify: []
                        };
                        $scope.updateTypeBackground.initData();
                        $scope.updateTypeBackground.show();
                    },

                    elementMirroringDialogShow: function () {
                        var selectElement = $scope.toposhow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中！", "alarm");
                            return;
                        }
                        var elementMirroringList = new Array();
                        var obj;
                        for (var z = 0; z < selectElement.size(); z++) {
                            if (selectElement._as[z].elType == "node") {
                                obj = new Object();
                                obj.id = selectElement._as[z]._id.substring(2, selectElement._as[z]._id.length);
                                obj.elType = selectElement._as[z].elType;
                                obj.cId = selectElement._as[z].cId;
                                obj.type = selectElement._as[z].type;
                                obj.classify = selectElement._as[z].classify;
                                obj.displayName = selectElement._as[z].displayName;
                                obj.mirroring = selectElement._as[z].mirroring == null ? "未镜像": (selectElement._as[z].mirroring == true || selectElement._as[z].mirroring == "true" ? "已镜像" : "未镜像");
                                obj.pid = 0;
                                elementMirroringList.push(obj);
                            }
                        }
                        if (elementMirroringList.length <= 0) {
                            $rootScope.$alert("图元未选中!!", "alarm");
                            return;
                        }
                        $scope.elementMirroringDialog.mirroring = false;
                        $scope.elementMirroringDialog.tree.data = [];
                        $scope.elementMirroringDialog.tree.data = elementMirroringList;
                        $scope.elementMirroringDialog.show();
                    },

                    elementPositioningDialogShow: function () {
                        var allElement = $scope.toposhow.data.network.getAllElementList();
                        if (null == allElement || allElement.size() <= 0) {
                            $rootScope.$alert("拓扑图上没有图元！", "alarm");
                            return;
                        }
                        var allElementTreeList = new Array();
                        var obj;
                        for (var i = 0; i < allElement.size(); i++) {
                            if (allElement.get(i).elType == "node") {
                                obj = new Object();
                                obj.id = allElement.get(i)._id.substring(2, allElement.get(i)._id.length);
                                obj.elType = allElement.get(i).elType;
                                obj.cId = allElement.get(i).cId;
                                obj.type = allElement.get(i).type;
                                obj.classify = allElement.get(i).classify;
                                obj.displayName = allElement.get(i).displayName;
                                if (allElement.get(i).isSelect == "true"){
                                    obj.isSelect = true;
                                } else {
                                    obj.isSelect = false;
                                }
                                obj.pid = 0;
                                obj.random = Math.floor(Math.random() * ( 100 + 1));;
                                allElementTreeList.push(obj);
                            }
                        }
                        //$scope.elementPositioningDialog.tree.data = allElementTreeList;
                        $scope.elementPositioningDialog.allElementList = allElementTreeList;
                        //$scope.elementPositioningDialog.isSelect = false;
                        //$scope.elementPositioningDialog.initTree();
                        $scope.elementPositioningDialog.show();
                    }
                };
                <!-- 对话框激活 结束 -->


                <!-- 拓扑图菜单事件 开始 -->
                $scope.showDashboard = function (target) {
                    var url = "views/dashboard/dashboard.html?type=" + target.getAttribute('nodetype') + "&moc_name=" + target.getAttribute('nodeclassify') + "&mo_id=" + target.getAttribute('nodecid') + "#/" + target.getAttribute('nodeclassify') + "";
                    window.open(url, "_blank");
                };
                $scope.showHistoryRule = function (target) {
                    if (target.getAttribute('mirroring') == null || target.getAttribute('mirroring') == "false" || target.getAttribute('mirroring') == false) {
                        window.open("#/historySetting?moId=" + target.getAttribute('nodecid') + "&type=0", "_blank");
                    } else {
                        window.open("#/historySetting?moId=" + target.getAttribute('nodecid') + "&type=1", "_blank");
                    }
                };
                $scope.showAlarmRule = function (target) {
                    if (target.getAttribute('mirroring') == null || target.getAttribute('mirroring') == "false" || target.getAttribute('mirroring') == false) {
                        window.open("#/alarmRule/?moId=" + target.getAttribute('nodecid') + "&type=0", "_blank");
                    } else {
                        window.open("#/alarmRule/?moId=" + target.getAttribute('nodecid') + "&type=1", "_blank");
                    }
                };
                $scope.showAlarm = function (target) {
                    if (target.getAttribute('mirroring') == null || target.getAttribute('mirroring') == "false" || target.getAttribute('mirroring') == false) {
                        window.open("#/alarmReal/?moId=" + target.getAttribute('nodecid') + "&type=0", "_blank");
                    } else {
                        window.open("#/alarmReal/?moId=" + target.getAttribute('nodecid') + "&type=1", "_blank");
                    }
                };
                $scope.createMalfunctionItsm = function (target) {
                    window.open("#/createIncident?moId=" + target.getAttribute('nodecid') + "", "_blank");
                };
                $scope.showMalfunctionItsm = function (target) {
                    if (target.getAttribute('mirroring') == null || target.getAttribute('mirroring') == "false" || target.getAttribute('mirroring') == false) {
                        window.open("#/queryIncident?moId=" + target.getAttribute('nodecid') + "&type=0", "_blank");
                    } else {
                        window.open("#/queryIncident?moId=" + target.getAttribute('nodecid') + "&type=1", "_blank");
                    }
                };
                $scope.createIssueItsm = function (target) {
                    window.open("#/createProblem?moId=" + target.getAttribute('nodecid') + "", "_blank");
                };
                $scope.showIssueItsm = function (target) {
                    if (target.getAttribute('mirroring') == null || target.getAttribute('mirroring') == "false" || target.getAttribute('mirroring') == false) {
                        window.open("#/queryProblem?moId=" + target.getAttribute('nodecid') + "&type=0", "_blank");
                    } else {
                        window.open("#/queryProblem?moId=" + target.getAttribute('nodecid') + "&type=1", "_blank");
                    }
                };
                $scope.createAlterationItsm = function (target) {
                    window.open("#/createChange?moId=" + target.getAttribute('nodecid') + "", "_blank");
                };
                $scope.showAlterationItsm = function (target) {
                    if (target.getAttribute('mirroring') == null || target.getAttribute('mirroring') == "false" || target.getAttribute('mirroring') == false) {
                        window.open("#/queryChange?moId=" + target.getAttribute('nodecid') + "&type=0", "_blank");
                    } else {
                        window.open("#/queryChange?moId=" + target.getAttribute('nodecid') + "&type=1", "_blank");
                    }
                };
                $scope.showLinkFlow = function (target) {
                    window.open("#/flowChart?id=" + target.getAttribute('nodecid') + "", "_blank");
                };
                $scope.showLinkFlowStatistics = function (target) {
                    window.open("views/lineFlowTrend/flowCounter.html?moId=" + target.getAttribute('nodecid') + "", "_blank");
                };
                $scope.showLinkHighFlow = function (target) {
                    window.open("views/lineFlowTrend/lineFlowTrend.html?moId=" + target.getAttribute('nodecid') + "", "_blank");
//                    if (target.getAttribute('interval') == "?"){
//                        window.open("views/lineFlowTrend/lineFlowTrend.html?moId=" + target.getAttribute('nodecid') + "&dataType=", "_blank");
//                    } else {
//                        window.open("views/lineFlowTrend/lineFlowTrend.html?moId=" + target.getAttribute('nodecid') + "&dataType=" + target.getAttribute('interval'), "_blank");
//                    }
                };

                <!-- 拓扑图菜单事件 结束 -->

                <!-- 自动拓扑 开始 -->
                //scope定义
                $scope.discoveryPage = {
                    init: function () {
                        $scope.discoveryPage.data = {
                            communities: [],
                            segments: [],
                            type: 1
                        };
                        $scope.discoveryPage.row = {
                            ipBegin: "",
                            ipEnd: "",
                            community: "public"
                        };
                        $scope.discoveryPage.ipCount = 0;
                        $scope.discoveryPage.communityCount = 0;
                        $scope.discoveryPage.ipTable = [];
                        $scope.discoveryPage.communityTable = [];
                        $scope.discoveryPage.result = [];
                        $scope.discoveryPage.nodes = [];
                        $scope.discoveryPage.isScan = false;
                        $scope.discoveryPage.scanBtnText = "开始扫描";
                        $scope.discoveryPage.progress = 0;
                        $scope.discoveryPage.progressLast = 0;
                        $scope.discoveryPage.progressStep = 0;
                        $scope.discoveryPage.progressType = "info";
                        $scope.discoveryPage.pic = "img/scan.jpg";
                        $scope.discoveryPage.progressText = "";
                        $scope.discoveryPage.countText = "";
                        $scope.discoveryPage.resultText = "";
                        $scope.discoveryPage.total = 0;
                        $scope.discoveryPage.loadLast();
                    },
                    loadLast: function () {
                        DiscoveryClient.load(function (data) {
                            if (data.communities) {
                                $scope.discoveryPage.data.type = data.type;
                                for (var i = 0; i < data.communities.length; i++) {
                                    $scope.discoveryPage.communityTable.push({
                                        id: i + 1,
                                        community: data.communities[i]
                                    });
                                }
                                $scope.discoveryPage.communityCount = data.communities.length;
                                for (var i = 0; i < data.segments.length; i++) {
                                    $scope.discoveryPage.ipTable.push({
                                        id: data.segments[i].id,
                                        ipBegin: data.segments[i].ipBegin,
                                        ipEnd: data.segments[i].ipEnd
                                    });
                                }
                                $scope.discoveryPage.ipCount = data.segments.length;
                            }
                        });
                    },
                    modal: {
                        settings: {
                            id: "topo_discovery_modal_div",
                            title: "自动发现",
                            closeBtnHide: true,
                            saveBtnHide: false,
                            saveBtnText: "关闭",
                            save: function () {
                                Modal.hide($scope.discoveryPage.modal.settings.id);
                            }
                        }
                    },
                    action: {
                        addIpRow: function () {
                            var ipValidate = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                            if (!Util.notNull($scope.discoveryPage.row.ipBegin) && !Util.notNull($scope.discoveryPage.row.ipEnd)) {
                                return;
                            }
                            if (Util.notNull($scope.discoveryPage.row.ipBegin) && !Util.notNull($scope.discoveryPage.row.ipEnd)) {
                                $scope.discoveryPage.row.ipEnd = $scope.discoveryPage.row.ipBegin;
                            }
                            if (!Util.notNull($scope.discoveryPage.row.ipBegin) && Util.notNull($scope.discoveryPage.row.ipEnd)) {
                                $scope.discoveryPage.row.ipBegin = $scope.discoveryPage.row.ipEnd;
                            }
                            if (!ipValidate.test($scope.discoveryPage.row.ipBegin) || !ipValidate.test($scope.discoveryPage.row.ipEnd)) {
                                $rootScope.$alert("IP地址格式不正确", "alarm");
                                return;
                            }

                            for (var i = 0; i < $scope.discoveryPage.ipTable.length; i++) {
                                var row = $scope.discoveryPage.ipTable[i];
                                if (row.ipBegin == $scope.discoveryPage.row.ipBegin && row.ipEnd == $scope.discoveryPage.row.ipEnd) {
                                    return;
                                }
                            }

                            $scope.discoveryPage.ipCount++;
                            $scope.discoveryPage.ipTable.push({
                                id: $scope.discoveryPage.ipCount,
                                ipBegin: $scope.discoveryPage.row.ipBegin,
                                ipEnd: $scope.discoveryPage.row.ipEnd
                            });
                        },
                        addCommunityRow: function () {
                            if (Util.notNull($scope.discoveryPage.row.community)) {
                                for (var i = 0; i < $scope.discoveryPage.communityTable.length; i++) {
                                    var row = $scope.discoveryPage.communityTable[i];
                                    if (row.community == $scope.discoveryPage.row.community) {
                                        return;
                                    }
                                }

                                $scope.discoveryPage.communityCount++;
                                $scope.discoveryPage.communityTable.push({
                                    id: $scope.discoveryPage.communityCount,
                                    community: $scope.discoveryPage.row.community
                                });
                            }
                        },
                        deleteIpRow: function (id) {
                            for (var i = 0; i < $scope.discoveryPage.ipTable.length; i++) {
                                if ($scope.discoveryPage.ipTable[i].id == id) {
                                    $scope.discoveryPage.ipTable.splice(i, 1);
                                    break;
                                }
                            }
                        },
                        deleteCommunityRow: function (id) {
                            for (var i = 0; i < $scope.discoveryPage.communityTable.length; i++) {
                                if ($scope.discoveryPage.communityTable[i].id == id) {
                                    $scope.discoveryPage.communityTable.splice(i, 1);
                                    break;
                                }
                            }
                        },
                        scan: function () {
                            if ($scope.discoveryPage.isScan) {
                                $scope.discoveryPage.isScan = false;
                                $scope.discoveryPage.scanBtnText = "开始扫描";
                                $scope.discoveryPage.action.stop();
                            } else {
                                if ($scope.discoveryPage.ipTable.length == 0 || $scope.discoveryPage.communityTable.length == 0) {
                                    return;
                                }
                                $scope.discoveryPage.countText = "";
                                $scope.discoveryPage.resultText = "";
                                $scope.discoveryPage.miniTickerTime = new Date().getTime();
                                $scope.discoveryPage.progress = 100;
                                $scope.discoveryPage.progressLast = 0;
                                $scope.discoveryPage.progressText = "下发扫描任务中...";
                                $scope.discoveryPage.progressStep = 0;
                                $scope.discoveryPage.isScan = true;
                                $scope.discoveryPage.tick = true;
                                $scope.discoveryPage.scanBtnText = "停止扫描";
                                $scope.discoveryPage.data.communities = [];
                                $scope.discoveryPage.data.segments = [];
                                $scope.discoveryPage.result = [];
                                $scope.discoveryPage.nodes = [];
                                $scope.discoveryPage.progressType = "info";
                                for (var i = 0; i < $scope.discoveryPage.ipTable.length; i++) {
                                    var row = $scope.discoveryPage.ipTable[i];
                                    $scope.discoveryPage.data.segments.push({
                                        id: row.id,
                                        ipBegin: row.ipBegin,
                                        ipEnd: row.ipEnd
                                    });
                                }
                                for (var i = 0; i < $scope.discoveryPage.communityTable.length; i++) {
                                    var row = $scope.discoveryPage.communityTable[i];
                                    $scope.discoveryPage.data.communities.push(row.community);
                                }
                                Util.go($scope);
                                topoDiscoveryClient.topoDodiscover({id: topoCommon.currentView.split(",")[$routeParams.classify]}, $scope.discoveryPage.data, function () {
                                    $scope.discoveryPage.action.start();
                                }, function (error) {
                                    $scope.discoveryPage.tick = false;
                                    $scope.discoveryPage.scanBtnText = "返回";
                                });
                            }
                        },
                        start: function () {
                            var getResult = function () {
                                if ($scope.discoveryPage.tick != true) {
                                    $scope.discoveryPage.action.stop();
                                }
                                topoDiscoveryClient.getTopoDiscoverResult({id: topoCommon.currentView.split(",")[$routeParams.classify], classify: $routeParams.classify}, {}, function (data) {
                                    if ($scope.discoveryPage.progressType == "info") {
                                        $scope.discoveryPage.progress = 0;
                                        $scope.discoveryPage.progressText = "";
                                        $scope.discoveryPage.progressType = "success";
                                    }
                                    if (data.status >= 3) {
                                        $scope.discoveryPage.progress = 100;
                                        $scope.discoveryPage.progressType = "success";
                                        $scope.discoveryPage.progressText = "扫描完成";
                                        $scope.discoveryPage.resultText = " " + data.mos.length + " 个";
                                        $scope.discoveryPage.result = [];
                                        for (var i = 0; i < data.mos.length; i++) {
                                            $scope.discoveryPage.result.push({
                                                type: data.mos[i].mocDisplayName,
                                                ip: data.mos[i].ip
                                            });
                                        }
                                        $scope.discoveryPage.action.stop();
                                        $scope.discoveryPage.scanBtnText = "返回";
                                    } else {
                                        if (data.scan.nodes && data.scan.nodes.length > 0) {
                                            for (var i = 0; i < data.scan.nodes.length; i++) {
                                                if (Util.notNull(data.scan.nodes[i])) {
                                                    $scope.discoveryPage.nodes.unshift(data.scan.nodes[i]);
                                                }
                                            }
                                        }
                                        if (data.scan && data.scan.current && data.scan.total) {
                                            if (data.scan.current == data.scan.total) {
                                                $scope.discoveryPage.progress = 100;
                                            }
                                            if ($scope.discoveryPage.progress < 99) {
                                                $scope.discoveryPage.countText = data.scan.current + " / " + data.scan.total;
                                            }
                                            $scope.discoveryPage.total = data.scan.total;
                                            if (data.scan.current < data.scan.total && data.scan.current > $scope.discoveryPage.progressLast) {
                                                $scope.discoveryPage.progressLast = data.scan.current;
                                                var real = 100 * data.scan.current / data.scan.total;
                                                $scope.discoveryPage.progressStep =
                                                    500
                                                    * (100 - $scope.discoveryPage.progress)
                                                    * real
                                                    / (100 - real)
                                                    / (new Date().getTime() - $scope.discoveryPage.miniTickerTime);
//                                    console.log($scope.discoveryPage.progressStep);
                                            }
                                        }
                                        $scope.discoveryPage.ticker = $timeout(getResult, 3000);
                                    }
                                }, function (error) {
                                    $scope.discoveryPage.scanBtnText = "返回";
                                    $scope.discoveryPage.action.stop();
                                });
                            }

                            $scope.discoveryPage.tick = true;
                            $scope.discoveryPage.ticker = $timeout(getResult, 3000);

                            var mini = function () {
                                if ($scope.discoveryPage.progressType == "info") {
                                    $scope.discoveryPage.miniTicker = $timeout(mini, 500);
                                    return;
                                }

                                if ($scope.discoveryPage.progress >= 99) {
                                    $scope.discoveryPage.countText = $scope.discoveryPage.total + " / " + $scope.discoveryPage.total;
                                    $scope.discoveryPage.progressType = "warning";
                                    $scope.discoveryPage.progress = 100;
                                    $scope.discoveryPage.progressText = "处理数据中...";
                                } else {
                                    $scope.discoveryPage.progress += $scope.discoveryPage.progressStep;
                                    $scope.discoveryPage.progressText = Math.round(10 * $scope.discoveryPage.progress) / 10 + "%";
                                    $scope.discoveryPage.miniTicker = $timeout(mini, 500);
                                }
                            };
                            $scope.discoveryPage.miniTicker = $timeout(mini, 500);
                        },
                        stop: function () {
                            $timeout.cancel($scope.discoveryPage.ticker);
                            $timeout.cancel($scope.discoveryPage.miniTicker);
                            $scope.discoveryPage.tick = false;
                            $scope.topoView.reload();
                            $scope.topoViewTree.init();
                        }
                    },
                    tick: false,
                    ticker: null,
                    miniTicker: null,
                    miniTickerTime: null
                };

                $scope.$on("$destroy", function (event) {
                    $timeout.cancel($scope.discoveryPage.ticker);
                    $timeout.cancel($scope.discoveryPage.miniTicker);
                });

                //初始化
                $scope.discoveryPage.init();

                //watch
                $scope.$watch("discoveryPage.tick", function (newVal, oldVal) {
                    if (newVal) {
                        $scope.discoveryPage.pic = "img/scan.gif";
                    } else {
                        $scope.discoveryPage.pic = "img/scan.jpg";
                    }
                });

                <!-- 自动拓扑 结束 -->


            }
        ])
    ;
})(angular);