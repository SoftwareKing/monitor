(function (angular) {

    angular.module('dnt.businessChart.directives', [])
        //拓扑树
        .directive('dBusinessChartTree', ["$compile", "$timeout", "$routeParams", "Util", function ($compile, $timeout, $routeParams, Util) {
            return {
                link: function (scope, element, attrs) {
                    var ztreeId = attrs.id;
                    var ztreeData = Util.getValue(attrs.dBusinessChartTree, scope);
                    var zTreeOnClick = function (event, treeId, treeNode) {
                        if (treeNode.id && treeNode.id > 0) {
                            ztreeData.active(treeNode);
                        }
                    };
                    var settings = {
                        view: {
                            selectedMulti: false
                        },
                        callback: {
                            onClick: zTreeOnClick
                        }
                    }
                    if (ztreeData.hideButton) {
                        settings.view = {};
                    }
                    var initData = function () {
                        ztreeData = Util.getValue(attrs.dBusinessChartTree, scope);
                        var treeObj = angular.element.fn.zTree.init(angular.element("#" + attrs.id), settings, ztreeData.data);
                        treeObj.expandAll(true);
                        var nodes = treeObj.transformToArray(treeObj.getNodes());
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].id == businessChartCommon.currentView) {//树上选中节点
                                treeObj.selectNode(nodes[i]);
                            }
                        }
                    };
                    return scope.$watch(attrs.dBusinessChartTree, function () {
                        $timeout(initData, 200);
                    }, true);
                }
            };
        }])

        //拓扑图
        .directive('dBusinessChartView', ["$compile", "$timeout", "Util", '$routeParams', '$rootScope', function ($compile, $timeout, Util, $routeParams, $rootScope) {


            function initTopo(scope, element, attrs) {
                <!-- 拓扑图上方按钮 开始 -->
                scope.selectAll = function (event) {
                    scope.businessChartshow.data.network.selectAll(event);
                };
                scope.snapshot = function () {
                    scope.businessChartshow.data.network.snapshot();
                };
                scope.search = function (event) {
                    if (null == document.getElementById("searchText").value || document.getElementById("searchText").value == "") {
                        $rootScope.$alert("查询条件未输入！", "alarm");
                        return;
                    }
                    scope.businessChartshow.data.network.search(event, document.getElementById("searchText").value, $rootScope);
                };
                <!-- 拓扑图上方按钮 结束 -->

                <!-- 数据监听器 开始 -->
                scope.$watch('businessChartViewData', function (businessChartViewData) {
                    createNodesAndLinks(scope.businessChartViewData);
                }, true);
                <!-- 数据监听器 结束 -->

                function createNodesAndLinks(businessChartViewData) {
                    //console.log("Topo数据指令方法!" + new Date().toLocaleString());
                    if (null != businessChartViewData && businessChartViewData.result != null) {
                        if (businessChartViewData.result == "success") {
                            if (null == scope.businessChartshow.data.network) {
                                scope.businessChartshow.data.network = new TopobusinessChart.Topology(scope, $routeParams);
                            }
                            if (businessChartViewData.msg.view.id != null) {
                                businessChartCommon.currentView = businessChartViewData.msg.view.id;
                                businessChartCommon.currentViewName = businessChartViewData.msg.view.name;
                                scope.businessChartshow.data.network.readyRegistImage(defaultNodeImg);
                                createDefaultNodes(scope.businessChartshow.data.network, businessChartViewData.msg.view.rows, businessChartViewData.msg.view.columns);
                            }
                            createNodes(scope.businessChartshow.data.network, businessChartViewData.msg.view.nodes, size);
                            createLinks(scope.businessChartshow.data.network, businessChartViewData.msg.view.lines);
                            removeRedundantElement();
                            removeLinks(businessChartViewData.msg.view.lines);
                            removeNodes(businessChartViewData.msg.view.nodes);
                            scope.businessChartshow.data.network.unMovable($rootScope.loginUserMenuMap[$rootScope.currentView]);//没有权限，节点无法移动
                        } else if (businessChartViewData.result == "error") {
                            alert(businessChartViewData.desc);
                        }
                    }
                }

                var datum = 50;
                var progressive = 100;
                var size = 150;
                var defaultNodeImg = "kuang.jpg";

                function createDefaultNodes(box, rows, columns) {
//                    rows=100;前端控制行和列也可以
                    var el = null;
                    for (var i = 0; i < rows; i++, i++) {
                        for (var j = 0; j < columns; j++, j++) {
                            if (box.findDefaultElement("d_" + i + "_" + j) == null) {
                                el = null;
                                if (j == 0 && i == 0) {
                                    el = createDefaultNode(i, j, datum, datum, defaultNodeImg, size);
                                } else if (j > 0 && i == 0) {
                                    el = createDefaultNode(i, j, j * progressive + datum, datum, defaultNodeImg, size);
                                } else if (j == 0 && i > 0) {
                                    el = createDefaultNode(i, j, datum, i * progressive + datum, defaultNodeImg, size);
                                } else if (j > 0 && i > 0) {
                                    el = createDefaultNode(i, j, j * progressive + datum, i * progressive + datum, defaultNodeImg, size);
                                }
                                if (el != null)
                                    box.addElement(el);
                            }
                        }
                    }
                }

                function createDefaultNode(i, j, rows, columns, img, size) {
                    var node = new TopobusinessChart.DefaultNode(i, j, rows, columns, img, size);
                    return node;
                }

                function createNodes(box, items, size) {
                    //console.log("添加图元" + new Date().toLocaleString());
                    var el = null;
                    var dEl = null;
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (box.findElement(items[i], "n_")) {
                                scope.businessChartshow.data.network.readyRegistImage(items[i].img);
                                dEl = box.findDefaultElement(items[i].hangBits);
                                if (dEl != null) {
                                    dEl.setClient("isSelectable", false);
                                    el = createNode(items[i], size, dEl._location.x, dEl._location.y);
                                    box.addElement(el);
                                }
                            }
                        }
                    } else {
                        box.removeAllElement();
                    }
                }

                function createNode(item, size, horizontal, vertical) {
                    var node = new TopobusinessChart.Node(item, size, horizontal, vertical);
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
                        var link = new TopobusinessChart.Link(item, node1, node2);
                        return link;
                    }
                }

                function removeRedundantElement() {
                    scope.businessChartshow.data.network.removeRedundantElement();
                }

                function removeLinks(items) {
                    scope.businessChartshow.data.network.removeElement(items, "link", "l_");
                }

                function removeNodes(items) {
                    scope.businessChartshow.data.network.removeElement(items, "node", "n_");
                }
            }

            return {
                transclude: true,
                restrict: 'A',
                link: initTopo
            };
        }])

        //同步图元对话框对象树
        .directive('dBusinessChartResourceDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dBusinessChartResourceDialogTree, scope);
                    var on_treeData_change = function () {
                        var setting = {
                            view: {
                                selectedMulti: true
                            },
                            callback: {
                                beforeClick: function (treeId, treeNode) {
                                    if (treeNode.isParent) {
                                        return false;
                                    }
                                    click(treeNode);
                                    return true;
                                },
                                beforeAsync: function () {
                                    return true;
                                },
                                onCheck: function (event, treeId, treeNode) {
                                    check();
                                },
                                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                                    if (ztreeData.checked) {
                                        var zTree = angular.element.fn.zTree.getZTreeObj(ztreeData.treeId);
                                        zTree.checkAllNodes(false);
                                        var ids = ztreeData.checked.split(",");
                                        for (var i = 0; i < ids.length; i++) {
                                            var node = zTree.getNodeByParam("id", ids[i], null);
                                            if (node) {
                                                zTree.checkNode(node, true, true);
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        if (ztreeData.checkbox != null && ztreeData.checkbox == "all") {
                            var checkAccessories = function (treeNode, btn) {
                                var r = document.getElementsByName("radio_" + treeNode.id);
                                if (r.length > 0) {
                                    var checkedRadio = getCheckedRadio("radio_" + treeNode.id);
                                    if (btn.attr("checked")) {
                                        if (!checkedRadio) {
                                            $("#radio_" + treeNode.children[0].id).attr("checked", true);
                                        }
                                    } else {
                                        if (!checkedRadio)
                                            checkedRadio.attr("checked", false);
                                    }
                                } else {
                                    if (btn.attr("checked")) {
                                        $(":checkbox[name='checkbox_" + treeNode.id + "']").attr("checked", true);
                                    } else {
                                        $(":checkbox[name='checkbox_" + treeNode.id + "']").removeAttr("checked");
                                    }
                                    $(":checkbox[name='checkbox_" + treeNode.id + "']").each(function () {
                                        $(this).change();
                                    });
                                }
                            };
                            var checkBrand = function (treeNode, btn) {
                                if (btn.attr("checked")) {
                                    var pObj = $("#checkbox_" + treeNode.getParentNode().id);
                                    if (!pObj.attr("checked")) {
                                        pObj.attr("checked", true);
                                    }
                                }
                            };
                            var getCheckedRadio = function (radioName) {
                                var r = document.getElementsByName(radioName);
                                for (var i = 0; i < r.length; i++) {
                                    if (r[i].checked) {
                                        return $(r[i]);
                                    }
                                }
                                return null;
                            };

                            setting.view = {
                                addDiyDom: function (treeId, treeNode) {
                                    var aObj = $("#" + treeNode.tId + "_a");
                                    if (treeNode.level != ztreeData.level) {
                                        var pid = 0;
                                        if (treeNode.getParentNode()) {
                                            pid = treeNode.getParentNode().id;
                                        }
                                        var editStr = "<input type='checkbox' class='checkboxBtn' id='checkbox_" + treeNode.id + "' name='checkbox_" + pid + "' onfocus='this.blur();'></input>";
                                        aObj.before(editStr);
                                        var btn = $("#checkbox_" + treeNode.id);
                                        if (btn) btn.bind("change", function () {
                                            checkAccessories(treeNode, btn);
                                        });
                                    } else if (treeNode.level == ztreeData.level) {
                                        var editStr = "<input type='radio' class='radioBtn' id='radio_" + treeNode.id + "' name='radio_" + treeNode.getParentNode().id + "' onfocus='this.blur();'></input>";
                                        aObj.before(editStr);
                                        var btn = $("#radio_" + treeNode.id);
                                        if (btn) btn.bind("click", function () {
                                            checkBrand(treeNode, btn);
                                        });
                                    }
                                }
                            };


                        } else if (ztreeData.checkbox != null && ztreeData.checkbox) {
                            setting.check = {
                                enable: true,
                                chkboxType: {"Y": "s", "N": "ps"},
                                chkStyle: "radio"
                            };
                            if (ztreeData.isMultipleColumns) {
                                setting.view = {
                                    addDiyDom: function (treeId, treeNode) {
                                        if (treeNode.isParent) return;
                                        var aObj = $("#" + treeNode.tId + "_span");
                                        aObj.html("<div style='line-height: 18px;position: relative; width: 230px;display: inline-block;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;'>" + treeNode.name + "</div><div style='display: inline-block;line-height: 18px;vertical-align: top;width: 90px;margin-left: 20px;'>" + treeNode.typeDisplayName + "</div><div style='display: inline-block;line-height: 18px;vertical-align: top;width: 100px;'>" + treeNode.classifyDisplayName + "</div>");
                                    }
                                };
                            }
                        }
                        angular.element.fn.zTree.init(angular.element("#" + ztreeData.treeId), setting, ztreeData.data);
                    };
                    var click = function (node) {
                        if (ztreeData.treeClick) {
                            ztreeData.returnData = node;
                            ztreeData.treeClick(node);
                        }
                    };
                    var check = function () {
                        if (ztreeData.onCheck) {
                            var treeObj = angular.element.fn.zTree.getZTreeObj(ztreeData.treeId);
                            var nodes = treeObj.getCheckedNodes(true);
                            ztreeData.onCheck(nodes);
                        }
                    };
                    return scope.$watch(attrs.dBusinessChartResourceDialogTree, on_treeData_change, true);
                }
            };
        }])

        //添加线路样式对话框树
        .directive('dBusinessChartListCheckboxDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dBusinessChartListCheckboxDialogTree, scope);
                    var on_treeData_change = function () {
                        var setting = {
                            view: {
                                selectedMulti: true
                            },
                            callback: {
                                beforeClick: function (treeId, treeNode) {
                                    if (treeNode.isParent) {
                                        return false;
                                    }
                                    click(treeNode);
                                    return true;
                                },
                                beforeAsync: function () {
                                    return true;
                                },
                                onCheck: function (event, treeId, treeNode) {
                                    check();
                                },
                                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                                    if (ztreeData.checked) {
                                        var zTree = angular.element.fn.zTree.getZTreeObj(ztreeData.treeId);
                                        zTree.checkAllNodes(false);
                                        var ids = ztreeData.checked.split(",");
                                        for (var i = 0; i < ids.length; i++) {
                                            var node = zTree.getNodeByParam("id", ids[i], null);
                                            if (node) {
                                                zTree.checkNode(node, true, true);
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        if (ztreeData.checkbox == "all") {
                            var checkAccessories = function (treeNode, btn) {
                                var r = document.getElementsByName("radio_" + treeNode.id);
                                if (r.length > 0) {
                                    var checkedRadio = getCheckedRadio("radio_" + treeNode.id);
                                    if (btn.attr("checked")) {
                                        if (!checkedRadio) {
                                            $("#radio_" + treeNode.children[0].id).attr("checked", true);
                                        }
                                    } else {
                                        if (!checkedRadio)
                                            checkedRadio.attr("checked", false);
                                    }
                                } else {
                                    if (btn.attr("checked")) {
                                        $(":checkbox[name='checkbox_" + treeNode.id + "']").attr("checked", true);
                                    } else {
                                        $(":checkbox[name='checkbox_" + treeNode.id + "']").removeAttr("checked");
                                    }
                                    $(":checkbox[name='checkbox_" + treeNode.id + "']").each(function () {
                                        $(this).change();
                                    });
                                }
                            };
                            var checkBrand = function (treeNode, btn) {
                                if (btn.attr("checked")) {
                                    var pObj = $("#checkbox_" + treeNode.getParentNode().id);
                                    if (!pObj.attr("checked")) {
                                        pObj.attr("checked", true);
                                    }
                                }
                            };
                            var getCheckedRadio = function (radioName) {
                                var r = document.getElementsByName(radioName);
                                for (var i = 0; i < r.length; i++) {
                                    if (r[i].checked) {
                                        return $(r[i]);
                                    }
                                }
                                return null;
                            };

                            setting.view = {
                                addDiyDom: function (treeId, treeNode) {
                                    var aObj = $("#" + treeNode.tId + "_a");
                                    if (treeNode.level != ztreeData.level) {
                                        var pid = 0;
                                        if (treeNode.getParentNode()) {
                                            pid = treeNode.getParentNode().id;
                                        }
                                        var editStr = "<input type='checkbox' class='checkboxBtn' id='checkbox_" + treeNode.id + "' name='checkbox_" + pid + "' onfocus='this.blur();'></input>";
                                        aObj.before(editStr);
                                        var btn = $("#checkbox_" + treeNode.id);
                                        if (btn) btn.bind("change", function () {
                                            checkAccessories(treeNode, btn);
                                        });
                                    } else if (treeNode.level == ztreeData.level) {
                                        var editStr = "<input type='radio' class='radioBtn' id='radio_" + treeNode.id + "' name='radio_" + treeNode.getParentNode().id + "' onfocus='this.blur();'></input>";
                                        aObj.before(editStr);
                                        var btn = $("#radio_" + treeNode.id);
                                        if (btn) btn.bind("click", function () {
                                            checkBrand(treeNode, btn);
                                        });
                                    }
                                }
                            };


                        } else if (ztreeData.checkbox) {
                            setting.check = {
                                enable: true,
                                chkboxType: {"Y": "s", "N": "ps"},
                                chkStyle: "checkbox"
                            };
                            setting.data = {
                                key: {
                                    name: "displayName"
                                }
                            };
                        }
                        var treeObj = angular.element.fn.zTree.init(angular.element("#" + ztreeData.treeId), setting, ztreeData.data);
                        var nodes = treeObj.getNodes();
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            treeObj.checkNode(nodes[i], true, false);
                        }
                    };
                    var click = function (node) {
                        if (ztreeData.treeClick) {
                            ztreeData.returnData = node;
                            ztreeData.treeClick(node);
                        }
                    };
                    var check = function () {
                        if (ztreeData.onCheck) {
                            var treeObj = angular.element.fn.zTree.getZTreeObj(ztreeData.treeId);
                            var nodes = treeObj.getCheckedNodes(true);
                            ztreeData.onCheck(nodes);
                        }
                    };
                    return scope.$watch(attrs.dBusinessChartListCheckboxDialogTree, on_treeData_change, true);
                }
            };
        }])
    ;

})(angular);