(function () {
    "use strict";

    angular.module('ng-ztree', [])

        .directive('ngZtree', function () {
            return {
                require: '?ngModel',
                restrict: 'EA',
                replace: true,
                scope: {
                    treeId: "@", // 树模型ID
                    ngModel: "=", // 被选中的数据存在这里
                    treeModel: "=", // 展示的树模型
                    type: "@", // radio or checkbox
                    nodeName: "@", // 节点数据保存节点名称的属性名称
                    children: "@", // 节点数据中保存子节点数据的属性名称
                    checked: "@", // 节点数据中保存 check 状态的属性名称
                    disabledNodes: "=", // 不可被选中的节点
                    removedNodes: "=", // 需要从树中移动的节点
                    editable: "=" // 是否可选择
                },
                template: '<div>' +
                '  <input id="{{treeId}}Sel" type="text" readonly ng-click="showMenu();" style="width: 100%"/>' +
                '  <div id="{{treeId}}Content">' +
                '    <ul id="{{treeId}}" class="ztree" style="margin-top:0; width:280px; height: 300px;"></ul>' +
                '  </div>' +
                '</div>',
                link: function (scope, element, attrs) {

                    var beforeClick = function (treeId, treeNode) {
                        zTree.checkNode(treeNode, true, false, true);
                        return !treeNode.chkDisabled;
                    };

                    var onClick = function (event, treeId, treeNode) {
                        hideMenu();
                    };

                    var beforeCheck = function (treeId, treeNode) {
                        return !treeNode.chkDisabled;
                    };

                    var onCheck = function (e, treeId, treeNode) {
                        zTree.checkNode(treeNode, true, false);
                        var nodes = findSelectedValue();
                        scope.$apply(function () {
                            scope.ngModel = nodes;
                        });
                    };

                    //---展示节点路径
                    var separator = '>';
                    var findPathText = function (node) {
                        if (node) {
                            var s = findNodeLabel(node);
                            while (node = node.getParentNode()) {
                                s = findNodeLabel(node) + separator + s;
                            }
                            return s;
                        } else {
                            return null;
                        }
                    };

                    var findNodeLabel = function (node) {
                        if (!scope.nodeName) {
                            scope.nodeName = "name";
                        }
                        return node[scope.nodeName];
                    };

                    var findSelectedValue = function () {
                        var nodes = zTree.getCheckedNodes(true);

                        var names = [];
                        for (var i = 0; i < nodes.length; i++) {
                            names.push(findPathText(nodes[i]));
                        }
                        $("#" + scope.treeId + "Sel").val(names.join());
                        return nodes;
                    };

                    scope.showMenu = function () {
                        if (scope.editable==undefined || scope.editable) {
                            var cityObj = $("#" + scope.treeId + "Sel");
                            var cityOffset = cityObj.offset();
                            $("#" + scope.treeId + "Content").css({
                                left: cityOffset.left + "px",
                                top: cityOffset.top + cityObj.outerHeight() + "px"
                            }).slideDown("fast");

                            $("body").bind("mousedown", onBodyDown);

                            if (scope.disabledNodes) {
                                for (var i = 0; i < scope.disabledNodes.length; i++) {
                                    var disabledNode = scope.disabledNodes[i];
                                    var node = zTree.getNodeByParam(disabledNode.name, disabledNode.value);
                                    if (node)
                                        zTree.setChkDisabled(node, true);
                                }
                            }
                            if (scope.removedNodes) {
                                for (var i = 0; i < scope.removedNodes.length; i++) {
                                    var removedNode = scope.removedNodes[i];
                                    var node = zTree.getNodeByParam(removedNode.name, removedNode.value);
                                    if (node)
                                        zTree.removeNode(node);
                                }
                            }
                        }
                    };

                    var hideMenu = function () {
                        $("#" + scope.treeId + "Content").fadeOut("fast");
                        $("body").unbind("mousedown", onBodyDown);
                    };

                    var onBodyDown = function (event) {
                        if (!(event.target.id == scope.treeId + "Sel" || event.target.id == scope.treeId + "Content" || $(event.target).parents("#" + scope.treeId + "Content").length > 0)) {
                            hideMenu();
                        }
                    };

                    var setting = {
                        check: {
                            enable: true,
                            chkStyle: scope.type,
                            radioType: "all"
                        },
                        callback: {
                            beforeClick: beforeClick,
                            onClick: onClick,
                            beforeCheck: beforeCheck,
                            onCheck: onCheck
                        },
                        data: {
                            key: {
                                name: scope.nodeName,
                                children: scope.children,
                                checked: scope.checked
                            }
                        }
                    };

                    var zTree = {};
                    scope.$watch('treeModel', function () {

                        if (angular.isDefined(scope.treeModel)) {
                            delete scope.treeModel.$promise;
                            delete scope.treeModel.$resolved;
                        }
                        $.fn.zTree.init($("#" + scope.treeId), setting, scope.treeModel);
                        zTree = $.fn.zTree.getZTreeObj(scope.treeId);

                        scope.ngModel = findSelectedValue();

                    }, true);
                }
            };
        })

        .directive('ngZtreeAsync', function () {
            return {
                require: '?ngModel',
                restrict: 'EA',
                scope: {
                    ngModel: "=", // 被选中的数据存在这里
                    treeId: "@", // 树模型ID
                    type: "@", // radio or checkbox
                    nodeName: "@", // 节点数据保存节点名称的属性名称
                    children: "@", // 节点数据中保存子节点数据的属性名称
                    checked: "@", // 节点数据中保存 check 状态的属性名称
                    checkDisabled: "@", // 是否可选择标记，true为不可选择
                    topLevelUrl: "@", // 异步加载的顶级URL
                    url: "@" // 异步加载的URL
                },
                template: '<div>' +
                '  <input id="{{treeId}}Sel" type="text" readonly ng-click="showMenu();" style="width: 100%"/>' +
                '  <div id="{{treeId}}Content">' +
                '    <ul id="{{treeId}}" class="ztree" style="position:absolute;margin-top:0; width:280px; height: 300px;z-index: 9"></ul>' +
                '  </div>' +
                '</div>',
                link: function (scope, element, attrs) {

                    var type = scope.type ? scope.type : "radio";

                    var filter = function (treeId, parentNode, responseData) {
                        if (!responseData) {
                            return null;
                        }
                        // 顶级节点
                        else if (parentNode === undefined) {
                            responseData.isParent = true;
                            responseData.icon = warpTreeIconPath(responseData.icon);
                        }
                        // 二级节点及以下
                        else {
                            for (var i = 0, l = responseData.length; i < l; i++) {
                                if (responseData[i].type && responseData[i].type.toUpperCase() != 'Resource'.toUpperCase()) {
                                    responseData[i].isParent = true;
                                    responseData[i].icon = warpTreeIconPath(responseData[i].icon);
                                }
                            }
                        }
                        return responseData;
                    };

                    // icon路径封装
                    var warpTreeIconPath = function (iconName) {
                        return warpIconPath(iconName, 16);
                    };

                    var warpIconPath = function (iconName, size) {
                        if (iconName === undefined || iconName === null) {
                            return null;
                        }
                        return "assets/sys_icons/" + iconName + "/" + size + "x" + size + ".png";
                    };

                    var beforeClick = function (treeId, treeNode) {
                        zTree.checkNode(treeNode, !treeNode.checked, null, true);
                        return false;
                    };

                    //---展示节点路径
                    var separator = '>';
                    var findPathText = function (node) {
                        if (node) {
                            var s = findNodeLabel(node);
                            while (node = node.getParentNode()) {
                                s = findNodeLabel(node) + separator + s;
                            }
                            return s;
                        } else {
                            return null;
                        }
                    };

                    var findNodeLabel = function (node) {
                        if (!scope.nodeName) {
                            scope.nodeName = "name";
                        }
                        return node[scope.nodeName];
                    };

                    var beforeCheck = function (treeId, treeNode) {
                        return !scope.checkDisabled;
                    };

                    var onCheck = function (e, treeId, treeNode) {
                        var nodes = findSelectedValue();
                        scope.$apply(function () {
                            scope.ngModel = nodes;
                        });
                        hideMenu();
                    };

                    var findSelectedValue = function () {
                        var nodes = [];
                        var names = [];
                        var fullPathLabel = "";
                        if (!scope.nodeName) {
                            scope.nodeName = "name";
                        }
                        if (zTree != null) {
                            nodes = zTree.getCheckedNodes(true);
                            if (scope.type == 'radio') {
                                if (nodes && nodes.length > 0) {
                                    fullPathLabel = findPathText(nodes[0]);
                                    $("#" + scope.treeId + "Sel").val(fullPathLabel);
                                    return nodes[0];
                                } else {
                                    return null;
                                }
                            } else {
                                for (var i = 0; i < nodes.length; i++) {
                                    fullPathLabel = findPathText(nodes[i]);
                                    names.push(fullPathLabel);
                                }
                                $("#" + scope.treeId + "Sel").val(names.join());
                                return nodes;
                            }
                        }
                    };

                    scope.showMenu = function () {
                        var cityObj = $("#" + scope.treeId + "Sel");
                        var cityOffset = cityObj.offset();
                        $("#" + scope.treeId + "Content").css({
                            left: cityOffset.left + "px",
                            top: cityOffset.top + cityObj.outerHeight() + "px"
                        }).slideDown("fast");

                        $("body").bind("mousedown", onBodyDown);
                    };

                    var hideMenu = function () {
                        $("#" + scope.treeId + "Content").fadeOut("fast");
                        $("body").unbind("mousedown", onBodyDown);
                    };

                    var onBodyDown = function (event) {
                        if (!(event.target.id == scope.treeId + "Sel" || event.target.id == scope.treeId + "Content" || $(event.target).parents("#" + scope.treeId + "Content").length > 0)) {
                            hideMenu();
                        }
                    };

                    function getAsyncUrl(treeId, treeNode) {
                        if (!treeNode && scope.topLevelUrl) {
                            return scope.topLevelUrl;
                        }
                        if (!treeNode) {
                            return scope.url;
                        }
                        var urls = scope.url.split("?");
                        if (urls.length > 1) {
                            return urls[0] + treeNode.path + "?" + urls[1];
                        } else {
                            return scope.url + treeNode.path;
                        }
                    }

                    function onAsyncSuccess(event, treeId, parentNode, msg) {
                        if (!parentNode) {
                            var nodes = zTree.getNodes();
                            zTree.expandNode(nodes[0], true);
                            pointNode(nodes[0]);
                        } else {
                            asyncNodes(parentNode.children);
                        }
                    }

                    function asyncNodes(nodes) {
                        if (!nodes) return;
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            if (scope.ngModel.path.indexOf(nodes[i].path) != -1) {
                                if (pointNode(nodes[i])) {
                                    return true;
                                }
                                if (nodes[i].isParent && nodes[i].zAsync) {
                                    asyncNodes(nodes[i].children);
                                } else {
                                    zTree.reAsyncChildNodes(nodes[i], "refresh");
                                }
                            }
                        }
                    }

                    function pointNode(node) {
                        if (scope.ngModel.path === node.path) {
                            zTree.selectNode(node);
                            node.checked = true;
                            zTree.updateNode(node);
                            findSelectedValue();
                            return true;
                        } else {
                            return false;
                        }
                    }

                    var zTree = {};

                    var setting = {
                        view: {
                            selectedMulti: false
                        },
                        check: {
                            enable: true,
                            chkStyle: type,
                            radioType: "all"
                        },
                        async: {
                            enable: true,
                            url: getAsyncUrl,
                            dataFilter: filter,
                            type: "get"
                        },
                        callback: {
                            beforeClick: beforeClick,
                            onAsyncSuccess: onAsyncSuccess,
                            beforeCheck: beforeCheck,
                            onCheck: onCheck
                        },
                        data: {
                            key: {
                                name: scope.nodeName,
                                children: scope.children,
                                checked: scope.checked
                            }
                        }
                    };

                    scope.$watch('ngModel', function () {
                        $.fn.zTree.init($("#" + scope.treeId), setting);
                        zTree = $.fn.zTree.getZTreeObj(scope.treeId);
                    });
                }
            };
        });
})();