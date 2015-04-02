(function (angular) {

    angular.module('dnt.simulation.directives', [])
        //拓扑树
        .directive('dSimulationTree', ["$compile", "$timeout", "$routeParams", "Util", function ($compile, $timeout, $routeParams, Util) {
            return {
                link: function (scope, element, attrs) {
                    var ztreeId = attrs.id;
                    var ztreeData = Util.getValue(attrs.dSimulationTree, scope);
                    var zTreeOnClick = function (event, treeId, treeNode) {
                        if (treeNode.id && treeNode.id > 0) {
                            ztreeData.active(treeNode);
                        }
                    };
                    var settings = {
                        view: {
                            addDiyDom: function (treeId, treeNode) {
                                var sObj = angular.element("#" + treeNode.tId + "_a");
                                if (angular.element("#countBtn_" + treeNode.tId).length == 0) {
                                    var count;
                                    if (treeNode.nodeCount > 0) {
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' title='计数'>(" + treeNode.nodeCount + ")</span>");
                                    } else {
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' </span>");
                                    }
                                    sObj.append(count);
                                }
                                ;
                            },
                            selectedMulti: false
                        },
                        callback: {
                            onClick: zTreeOnClick
                        }
                    }
                    if (ztreeData.hideButton) {
                        settings.view = {};
                        settings.view = {
                            addDiyDom: function (treeId, treeNode) {
                                var sObj = angular.element("#" + treeNode.tId + "_a");
                                if (angular.element("#countBtn_" + treeNode.tId).length == 0) {
                                    var count;
                                    if (treeNode.nodeCount > 0) {
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' title='计数'>(" + treeNode.nodeCount + ")</span>");
                                    } else {
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' </span>");
                                    }
                                    sObj.append(count);
                                }
                                ;
                            }
                        };
                    }
                    var initData = function () {
                        ztreeData = Util.getValue(attrs.dSimulationTree, scope);
                        var treeObj = angular.element.fn.zTree.init(angular.element("#" + attrs.id), settings, ztreeData.data);
                        treeObj.expandAll(true);
                        var nodes = treeObj.transformToArray(treeObj.getNodes());
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].id == simulationCommon.currentView) {//树上选中节点
                                treeObj.selectNode(nodes[i]);
                            }
                        }
                    };
                    return scope.$watch(attrs.dSimulationTree, function () {
                        $timeout(initData, 200);
                    }, true);
                }
            };
        }])

        //拓扑图
        .directive('dSimulationView', ["$compile", "$timeout", "Util", '$routeParams', '$rootScope', function ($compile, $timeout, Util, $routeParams, $rootScope) {


            function initTopo(scope, element, attrs) {
                <!-- 拓扑图上方按钮 开始 -->
                scope.zoomOut = function (event) {
                    scope.simulationshow.data.network.zoomOut($rootScope);
                };
                scope.zoomIn = function (event) {
                    scope.simulationshow.data.network.zoomIn($rootScope);
                };
                scope.zoomReset = function (event) {
                    scope.simulationshow.data.network.zoomReset(event);
                };
                scope.selectAll = function (event) {
                    scope.simulationshow.data.network.selectAll(event);
                };
                scope.snapshot = function () {
                    scope.simulationshow.data.network.snapshot();
                };
                scope.eyeShow = function () {
                    scope.simulationshow.data.network.eyeShow();
                };
                scope.search = function (event) {
                    if (null == document.getElementById("searchText").value || document.getElementById("searchText").value == "") {
                        $rootScope.$alert("查询条件未输入！", "alarm");
                        return;
                    }
                    scope.simulationshow.data.network.search(event, document.getElementById("searchText").value, $rootScope);
                };
                <!-- 拓扑图上方按钮 结束 -->

                <!-- 数据监听器 开始 -->
                scope.$watch('simulationViewData', function (simulationViewData) {
                    createNodesAndLinks(scope.simulationViewData);
                }, true);
                scope.$watch('simulationViewPerformanceData', function (simulationViewPerformanceData) {
                    fillingPerformance(scope.simulationViewPerformanceData);
                }, true);
                <!-- 数据监听器 结束 -->

                function createNodesAndLinks(simulationViewData) {
                    //console.log("Topo数据指令方法!" + new Date().toLocaleString());
                    if (null != simulationViewData && simulationViewData.result != null) {
                        if (simulationViewData.result == "success") {
                            if (null == scope.simulationshow.data.network) {
                                scope.simulationshow.data.network = new TopoSimulation.Topology(scope, $routeParams);
                            }
                            if (simulationViewData.msg.view.id != null) {
                                simulationCommon.currentView = simulationViewData.msg.view.id;
                                simulationCommon.currentViewName = simulationViewData.msg.view.name;
                            }
                            scope.simulationshow.data.network.removeLocationPropertyChangeListener();//节点移动监听移除
                            scope.simulationshow.data.network.removeViewRectPropertyChangeListener();
                            createNodes(scope.simulationshow.data.network, simulationViewData.msg.view.nodes);
                            createLinks(scope.simulationshow.data.network, simulationViewData.msg.view.lines);
                            removeRedundantElement();
                            removeLinks(simulationViewData.msg.view.lines);
                            removeNodes(simulationViewData.msg.view.nodes);
                            scope.simulationshow.data.network.addLocationPropertyChangeListener();//节点移动监听添加
                            scope.simulationshow.data.network.addViewRectPropertyChangeListener();
                            scope.simulationshow.data.network.unMovable($rootScope.loginUserMenuMap[$rootScope.currentView]);//没有权限，节点无法移动
                            if (scope.simulationshow.data.isReset) {
                                scope.simulationshow.data.network.zoomReset();
                                scope.simulationshow.data.isReset = false;
                            }
                            $timeout(function () {
                                if (simulationCommon.nodesStatus != null && simulationCommon.nodesStatus.length > 0 && scope.simulationshow.data.Initial == 1) {
                                    //console.log("主动填充节点状态数据!" + new Date().toLocaleString());
                                    scope.simulationshow.data.network.refreshNodeStatus(simulationCommon.nodesStatus);
                                }
                                if (simulationCommon.linksStatus != null && simulationCommon.linksStatus.length > 0 && scope.simulationshow.data.Initial == 1) {
                                    //console.log("主动填充线路状态数据!" + new Date().toLocaleString());
                                    scope.simulationshow.data.network.refreshLinkStatus(simulationCommon.linksStatus);
                                }
                                scope.simulationshow.data.Initial++;
                            }, 1000);
                        } else if (simulationViewData.result == "error") {
                            alert(simulationViewData.desc);
                        }
                    }
                }

                function createNodes(box, items) {
                    //console.log("添加图元" + new Date().toLocaleString());
                    var el = null;
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (box.findElement(items[i], "n_")) {
                                scope.simulationshow.data.network.readyRegistImage(items[i].img);
                                el = createNode(items[i]);
                                box.addElement(el);
                            }
                        }
                    } else {
                        box.removeAllElement();
                    }
                }

                function createNode(item) {
                    var node = new TopoSimulation.Node(item);
                    return node;
                }

                function createLinks(box, items) {
                    //console.log("添加线路" + new Date().toLocaleString());
                    var el = null;
                    var allElements = box.getAllElement();
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (box.findElement(items[i], "l_")) {
                                el = createLink(items[i], allElements["n_" + items[i].inNodeId], allElements["n_" + items[i].outNodeId]);
                                box.addElement(el);
                            }
                        }
                    }
                }

                function createLink(item, node1, node2) {
                    if (null != node1 && null != node2) {
                        var link = new TopoSimulation.Link(item, node1, node2);
                        return link;
                    }
                }

                function removeRedundantElement() {
                    scope.simulationshow.data.network.removeRedundantElement();
                }

                function removeLinks(items) {
                    scope.simulationshow.data.network.removeElement(items, "link", "l_");
                }

                function removeNodes(items) {
                    scope.simulationshow.data.network.removeElement(items, "node", "n_");
                }

                function fillingPerformance(currentPerformances) {
                    //console.log("状态数据指令方法!" + new Date().toLocaleString());
                    if (currentPerformances != null && currentPerformances.result != null) {
                        if (currentPerformances.result == "success" && null != currentPerformances.msg) {
                            simulationCommon.simulationViewMenuData = currentPerformances.msg.businessMenuPerformance;
                            simulationCommon.nodesStatus = currentPerformances.msg.nodesStatus;
                            simulationCommon.linksStatus = currentPerformances.msg.linksStatus;
                            if (null != scope.simulationshow.data.network) {
                                //console.log("指令处理状态数据!" + new Date().toLocaleString());
                                if (currentPerformances.msg.nodesStatus != null) {
                                    scope.simulationshow.data.network.refreshNodeStatus(currentPerformances.msg.nodesStatus);
                                }
                                if (currentPerformances.msg.linksStatus != null) {
                                    scope.simulationshow.data.network.refreshLinkStatus(currentPerformances.msg.linksStatus);
                                }

                            }
                        }
                    }
                }


            }

            return {
                transclude: true,
                restrict: 'A',
                link: initTopo
            };
        }])

    ;

})(angular);