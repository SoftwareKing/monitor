(function (angular) {

    angular.module('dnt.topo.directives', [])
        //拓扑树
        .directive('dTopoTree', ["$compile", "$timeout", "$routeParams", "Util", function ($compile, $timeout, $routeParams, Util) {
            return {
                link: function (scope, element, attrs) {
                    var ztreeId = attrs.id;
                    var ztreeData = Util.getValue(attrs.dTopoTree, scope);
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
                                    if (treeNode.nodeCount > 0){
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' title='图元计数'>(" + treeNode.nodeCount + ")</span>");
                                    } else {
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' </span>");
                                    }
                                    sObj.append(count);
                                }
                                ;
                            },
                            addHoverDom: function (treeId, treeNode) {
                                var sObj = angular.element("#" + treeNode.tId + "_a");
                                if (angular.element("#addBtn_" + treeNode.tId).length == 0) {
                                    var add = $("<span class='button add' id='addBtn_" + treeNode.tId
                                        + "' title='添加子图' onfocus='this.blur();'></span>");
                                    sObj.append(add);
                                    add.bind("click", function () {
                                        ztreeData.add(treeNode);
                                    });
                                }
                                ;

                                if (angular.element("#editBtn_" + treeNode.tId).length == 0) {
                                    var edit = $("<span class='button edit' id='editBtn_" + treeNode.tId
                                        + "' title='编辑视图' onfocus='this.blur();'></span>");
                                    sObj.append(edit);
                                    edit.bind("click", function () {
                                        ztreeData.edit(treeNode);
                                    });
                                }
                                ;

                                if (angular.element("#removeBtn_" + treeNode.tId).length == 0) {
                                    var remove = $("<span class='button remove' id='removeBtn_" + treeNode.tId
                                        + "' title='删除视图' onfocus='this.blur();'></span>");
                                    sObj.append(remove);
                                    remove.bind("click", function () {
                                        ztreeData.remove(treeNode);
                                    });
                                }
                                ;
                            },
                            removeHoverDom: function (treeId, treeNode) {
                                angular.element("#addBtn_" + treeNode.tId).unbind().remove();
                                angular.element("#editBtn_" + treeNode.tId).unbind().remove();
                                angular.element("#removeBtn_" + treeNode.tId).unbind().remove();
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
                                    if (treeNode.nodeCount > 0){
                                        count = $("<span id='countBtn_" + treeNode.tId
                                            + "' title='图元计数'>(" + treeNode.nodeCount + ")</span>");
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
                        ztreeData = Util.getValue(attrs.dTopoTree, scope);
                        var treeObj = angular.element.fn.zTree.init(angular.element("#" + attrs.id), settings, ztreeData.data);
                        treeObj.expandAll(true);
                        var nodes = treeObj.transformToArray(treeObj.getNodes());
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].id == topoCommon.currentView.split(",")[$routeParams.classify]) {
                                treeObj.selectNode(nodes[i]);
                                if ($routeParams.classify == 0) {
                                    topoCommon.currentViewPId = nodes[i].pId + "," + topoCommon.currentViewPId.split(",")[1];
                                    topoCommon.currentViewSort = nodes[i].sort + "," + topoCommon.currentViewSort.split(",")[1];
                                } else if ($routeParams.classify == 1) {
                                    topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + nodes[i].pId;
                                    topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + nodes[i].sort;
                                }
                            }
                        }
                        scope.topoViewTreeNode.isShow(topoCommon.currentViewPId.split(",")[$routeParams.classify], topoCommon.currentViewSort.split(",")[$routeParams.classify]);
                    };
                    return scope.$watch(attrs.dTopoTree, function () {
                        $timeout(initData, 200);
                    }, true);
                }
            };
        }])
        //同步图元对话框对象树
        .directive('dTopoResourceDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dTopoResourceDialogTree, scope);
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
                    return scope.$watch(attrs.dTopoResourceDialogTree, on_treeData_change, true);
                }
            };
        }])
        //添加图元对话框对象树
        .directive('dTopoNodeDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dTopoNodeDialogTree, scope);
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
                    return scope.$watch(attrs.dTopoNodeDialogTree, on_treeData_change, true);
                }
            };
        }])
        //同步线路对话框线路类型树
        .directive('dTopoDialogTypeTree', ["Util", function (Util) {
            return {
                link: function (scope, element, attrs) {
                    var ztreeId = attrs.id;
                    var ztreeData = Util.getValue(attrs.dTopoDialogTypeTree, scope);
                    var zTreeOnClick = function (event, treeId, treeNode) {
                        if (treeNode.id && treeNode.id > 0) {
                            ztreeData.active(treeNode);
                        }
                    };
                    var settings = {
                        view: {},
                        callback: {
                            onClick: zTreeOnClick
                        }
                    }
                    var initData = function () {
                        ztreeData = Util.getValue(attrs.dTopoDialogTypeTree, scope);
                        var treeObj = angular.element.fn.zTree.init(angular.element("#" + attrs.id), settings, ztreeData.data);
                        treeObj.expandAll(true);
                        var nodes = treeObj.transformToArray(treeObj.getNodes());
                        treeObj.selectNode(nodes[1]);
                    };
                    return scope.$watch(attrs.dTopoDialogTypeTree, initData, true);
                }
            };
        }])
        //同步线路对话框线路树
        .directive('dTopoDialogLinkTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dTopoDialogLinkTree, scope);
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
                    return scope.$watch(attrs.dTopoDialogLinkTree, on_treeData_change, true);
                }
            };
        }])
        //同步线路对话框关系树
        .directive('dTopoDialogRelaTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dTopoDialogRelaTree, scope);
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
                    return scope.$watch(attrs.dTopoDialogRelaTree, on_treeData_change, true);
                }
            };
        }])
        //添加线路对话框图元对象树
        .directive('dTopoDialogNodeTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dTopoDialogNodeTree, scope);
                    var on_treeData_change = function () {
                        var setting = {
                            view: {
                                selectedMulti: false
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
                                chkStyle: "radio",
                                radioType: "all"
                            };
                            setting.data = {
                                key: {
                                    name: "displayName"
                                }
                            };
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
                    return scope.$watch(attrs.dTopoDialogNodeTree, on_treeData_change, true);
                }
            };
        }])
        //关联下钻的对象树
        .directive('dDrillConfigDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dDrillConfigDialogTree, scope);
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
                                chkStyle: "radio",
                                radioType: "all"
                            };
                        }
                        var treeObj = angular.element.fn.zTree.init(angular.element("#" + ztreeData.treeId), setting, ztreeData.data);
                        if (topoCommon.currentNodeDrill != null && topoCommon.currentNodeDrill != -1) {
                            var nodes = treeObj.transformToArray(treeObj.getNodes());
                            for (var i = 0, l = nodes.length; i < l; i++) {
                                if (topoCommon.currentNodeDrill == nodes[i].id) {
                                    treeObj.checkNode(nodes[i], true, false);
                                }
                            }
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
                    return scope.$watch(attrs.dDrillConfigDialogTree, on_treeData_change, true);
                }
            };
        }])
        //添加线路样式对话框树
        .directive('dListCheckboxDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dListCheckboxDialogTree, scope);
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
                    return scope.$watch(attrs.dListCheckboxDialogTree, on_treeData_change, true);
                }
            };
        }])
        //添加镜像对话框
        .directive('dListCheckboxMirroringDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dListCheckboxMirroringDialogTree, scope);
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
                            setting.view = {
                                addDiyDom: function (treeId, treeNode) {
                                    if (treeNode.isParent) return;
                                    var aObj = $("#" + treeNode.tId + "_span");
                                    aObj.html("<div style='line-height: 18px;position: relative; width: 280px;display: inline-block;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;margin-top: -2px'>" + treeNode.displayName + "</div><div style='display: inline-block;line-height: 18px;vertical-align: top;width: 120px;margin-left: 20px;margin-top: -2px'>" + treeNode.mirroring + "</div>");
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
                    return scope.$watch(attrs.dListCheckboxMirroringDialogTree, on_treeData_change, true);
                }
            };
        }])
        .directive('dListNoCheckboxDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dListNoCheckboxDialogTree, scope);
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
                        var nodes = treeObj.transformToArray(treeObj.getNodes());
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            if (nodes[i].isSelect == "true"){
                                treeObj.checkNode(nodes[i], true, false);
                            } else {
                                treeObj.checkNode(nodes[i], false, false);
                            }
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
                    return scope.$watch(attrs.dListNoCheckboxDialogTree, on_treeData_change, true);
                }
            };
        }])
        //拓扑图状态配置对话框对象树
        .directive('dStatusConfigDialogTree', ["Util", function (Util) {
            return {
                restrict: 'AE',
                transclude: false,
                link: function (scope, element, attrs) {
                    var ztreeData = Util.getValue(attrs.dStatusConfigDialogTree, scope);
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
                        } else if (ztreeData.checkbox) {
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
                                        aObj.html("<label style='width:180px;'>" + treeNode.indicatorDisplayName + "</label><label style='width:150px;'>" + treeNode.metricDisplayName + "</label>");
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
                    return scope.$watch(attrs.dStatusConfigDialogTree, on_treeData_change, true);
                }
            };
        }])
        //拓扑图
        .directive('dTopoView', ["$compile", "$timeout", "Util", 'topoViewService', 'topoNodeService', 'topoLineService', '$routeParams', '$rootScope', function ($compile, $timeout, Util, topoViewService, topoNodeService, topoLineService, $routeParams, $rootScope) {


            function initTopo(scope, element, attrs) {
                <!-- 拓扑图上方按钮 开始 -->
                scope.select = function (event) {
                    scope.toposhow.data.network.select(event);
                };
                scope.magnify = function (event) {
                    scope.toposhow.data.network.magnify(event);
                };
                scope.zoomOut = function (event) {
                    scope.toposhow.data.network.zoomOut($rootScope);
                };
                scope.zoomIn = function (event) {
                    scope.toposhow.data.network.zoomIn($rootScope);
                };
                scope.zoomReset = function (event) {
                    scope.toposhow.data.network.zoomReset(event);
                };
                scope.zoomOverview = function (event) {
                    scope.toposhow.data.network.zoomOverview(event);
                };
                scope.fullScreenButton = function (event) {
                    scope.toposhow.data.network.fullScreenButton($routeParams.classify);
                };
//                scope.reFullScreenButton = function (event) {
//                    scope.toposhow.data.network.reFullScreenButton(event);
//                };
                scope.selectAll = function (event) {
                    scope.toposhow.data.network.selectAll(event);
                };
                scope.saveXml = function (event) {
                    scope.toposhow.data.network.saveXml(event);
                };
                scope.snapshot = function () {
                    scope.toposhow.data.network.snapshot();
                };
                scope.eyeShow = function () {
                    scope.toposhow.data.network.eyeShow();
                };
                scope.search = function (event) {
                    if (null == document.getElementById("searchText").value || document.getElementById("searchText").value == "") {
                        $rootScope.$alert("查询条件未输入！", "alarm");
                        return;
                    }
                    scope.toposhow.data.network.search(event, document.getElementById("searchText").value, $rootScope);
                };
                scope.reload = function () {
                    scope.toposhow.data.Initial = 1
                    scope.topoView.reload();
                };
                <!-- 拓扑图上方按钮 结束 -->

                <!-- 数据监听器 开始 -->
                scope.$watch('topoViewData', function (topoViewData) {
                    createNodesAndLinks(scope.topoViewData);
                }, true);
                scope.$watch('topoViewAlarmData', function (topoViewAlarmData) {
                    fillingAlarm(scope.topoViewAlarmData);
                }, true);
                scope.$watch('topoViewPerformanceData', function (topoViewPerformanceData) {
                    fillingPerformance(scope.topoViewPerformanceData);
                }, true);
                <!-- 数据监听器 结束 -->

                function createNodesAndLinks(topoViewData) {
                    //console.log("Topo数据指令方法!" + new Date().toLocaleString());
                    if (null != topoViewData && topoViewData.result != null) {
                        if (topoViewData.result == "success") {
                            if (topoCommon.elIndicatorsData.length <= 0) {
                                topoCommon.elIndicatorsData = topoViewData.msg.elIndicators;
                            }
                            if (topoCommon.elMetricColors.length <= 0) {
                                topoCommon.elMetricColors = topoViewData.msg.elMetricColors;
                            }
                            if (null == scope.toposhow.data.network) {
                                scope.toposhow.data.network = new Topo.Topology(scope, $routeParams);
                            }
                            if (topoViewData.msg.view.id != null) {
                                if ($routeParams.classify == 0) {
                                    topoCommon.currentView = topoViewData.msg.view.id + "," + topoCommon.currentView.split(",")[1];
                                    topoCommon.currentViewName = topoViewData.msg.view.name + "," + topoCommon.currentViewName.split(",")[1];
                                    topoCommon.currentViewPId = topoViewData.msg.view.pId + "," + topoCommon.currentViewPId.split(",")[1];
                                    topoCommon.currentViewSort = topoViewData.msg.view.sort + "," + topoCommon.currentViewSort.split(",")[1];
                                } else if ($routeParams.classify == 1) {
                                    topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + topoViewData.msg.view.id;
                                    topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + topoViewData.msg.view.name;
                                    topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + topoViewData.msg.view.pId;
                                    topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + topoViewData.msg.view.sort;
                                }
                                scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[$routeParams.classify];
                            }
                            scope.toposhow.data.network.setBg(topoViewData.msg.view);
                            scope.toposhow.data.network.removeLocationPropertyChangeListener();
                            scope.toposhow.data.network.removeViewRectPropertyChangeListener();
                            createNodes(scope.toposhow.data.network, topoViewData.msg.view.nodes);
                            createLinks(scope.toposhow.data.network, topoViewData.msg.view.lines);
                            removeRedundantElement();
                            removeLinks(topoViewData.msg.view.lines);
                            removeNodes(topoViewData.msg.view.nodes);
                            scope.toposhow.data.network.addLocationPropertyChangeListener();
                            scope.toposhow.data.network.addViewRectPropertyChangeListener();
                            scope.toposhow.data.network.unMovable($rootScope.loginUserMenuMap[$rootScope.currentView]);
                            if (scope.toposhow.data.isReset){
                                scope.toposhow.data.network.zoomReset();
                                scope.toposhow.data.isReset = false;
                            }
                            if (window.isTopoFullScreen != null && (window.isTopoFullScreen.split(",")[$routeParams.classify] == "true")){
                                if ($routeParams.classify == 0 && window.fullScreenHash != null && (window.fullScreenHash.indexOf("gtopo") != -1)){
                                    scope.toposhow.data.network.historyBack();
                                } else if ($routeParams.classify == 1 && window.fullScreenHash != null && (window.fullScreenHash.indexOf("biz") != -1)){
                                    scope.toposhow.data.network.historyBack();
                                }
                            }
                            $timeout(function () {
                                if (topoCommon.elAlarmData != null && topoCommon.elAlarmData.length > 0 && scope.toposhow.data.Initial == 1) {
                                    //console.log("主动填充告警数据!" + new Date().toLocaleString());
                                    scope.toposhow.data.network.refreshAlarm(topoCommon.elAlarmData);
                                }
                                if (topoCommon.nodesStatus != null && topoCommon.nodesStatus.length > 0 && scope.toposhow.data.Initial == 1) {
                                    //console.log("主动填充节点状态数据!" + new Date().toLocaleString());
                                    scope.toposhow.data.network.refreshNodeStatus(topoCommon.nodesStatus);
                                }
                                if (topoCommon.linksStatus != null && topoCommon.linksStatus.length > 0 && scope.toposhow.data.Initial == 1) {
                                    //console.log("主动填充线路状态数据!" + new Date().toLocaleString());
                                    scope.toposhow.data.network.refreshLinkStatus(topoCommon.linksStatus);
                                }
                                scope.toposhow.data.Initial++;
                            }, 1000);
                        } else if (topoViewData.result == "error") {
                            alert(topoViewData.desc);
                        }
                    }
                }

                function createNodes(box, items) {
                    //console.log("添加图元" + new Date().toLocaleString());
                    var el = null;
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (box.findElement(items[i], "n_")) {
                                scope.toposhow.data.network.readyRegistImage(items[i].img);
                                el = createNode(items[i]);
                                box.addElement(el);
                            }
                        }
                    } else {
                        box.removeAllElement();
                    }
                }

                function createNode(item) {
                    var node = new Topo.Node(item);
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
                        var link = new Topo.Link(item, node1, node2);
                        return link;
                    }
                }

                function removeRedundantElement() {
                    scope.toposhow.data.network.removeRedundantElement();
                }

                function removeLinks(items) {
                    scope.toposhow.data.network.removeElement(items, "link", "l_");
                }

                function removeNodes(items) {
                    scope.toposhow.data.network.removeElement(items, "node", "n_");
                }

                function fillingAlarm(currentAlarms) {
                    //console.log("告警数据指令方法!" + new Date().toLocaleString());
                    if (currentAlarms != null && currentAlarms.result != null) {
                        if (currentAlarms.result == "success") {
                            topoCommon.elAlarmData = currentAlarms.msg;
                            if (null != scope.toposhow.data.network) {
                                //console.log("指令处理告警数据!" + new Date().toLocaleString());
//                                for (var j = 0; j < currentAlarms.msg.length; j++){
//                                    topoCommon.elAlarmData.push(currentAlarms.msg[j]);
//                                }
                                scope.toposhow.data.network.refreshAlarm(currentAlarms.msg);
                            }
                        }
                    }
                }

                function fillingPerformance(currentPerformances) {
                    //console.log("状态数据指令方法!" + new Date().toLocaleString());
                    if (currentPerformances != null && currentPerformances.result != null) {
                        if (currentPerformances.result == "success" && null != currentPerformances.msg) {
                            topoCommon.topoViewMenuData = currentPerformances.msg.performance;
                            topoCommon.elIndicatorsData = currentPerformances.msg.elIndicators;
                            topoCommon.elMetricColors = currentPerformances.msg.elMetricColors;
                            topoCommon.historyRule30 = currentPerformances.msg.historyRule30;
                            topoCommon.historyRuleInterval = currentPerformances.msg.historyRuleInterval;
                            topoCommon.nodesStatus = currentPerformances.msg.nodesStatus;
                            topoCommon.linksStatus = currentPerformances.msg.linksStatus;
                            if (null != scope.toposhow.data.network) {
                                //console.log("指令处理状态数据!" + new Date().toLocaleString());
                                scope.toposhow.data.network.refreshNodeStatus(currentPerformances.msg.nodesStatus);
                                scope.toposhow.data.network.refreshLinkStatus(currentPerformances.msg.linksStatus);
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