(function (angular) {

    angular.module('dnt.businessChart.controllers', [])
        .controller('businessChartController', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', 'utilTools', 'Modal', 'Util', 'Loading', 'businessChartViewService', 'businessChartNodeService', 'businessChartTopoResourceService', 'businessChartLinkService',
            function ($scope, $rootScope, $routeParams, $http, $timeout, utilTools, Modal, Util, Loading, businessChartViewService, businessChartNodeService, businessChartTopoResourceService, businessChartLinkService) {

                <!-- 初始化面包线 开始 -->
                $scope.navigation = {
                    data: {
                        navigationparent: "",
                        navigationchildren: ""
                    },
                    init: function () {
                        $scope.navigation.data.navigationparent = "视图";
                        $scope.navigation.data.navigationchildren = "业务架构";
                    }
                };
                <!-- 初始化面包线 结束 -->

                <!-- 拓扑树 开始 -->
                $scope.businessChartViewTree = {
                    treeId: "businessChartViewTree",
                    hideButton: $rootScope.loginUserMenuMap[$rootScope.currentView],
                    init: function () {
                        businessChartViewService.queryApplicationTree({}, {}, function (tree) {
                            if (tree.result == "success") {
                                $scope.businessChartViewTree.data = tree.msg;
                                if (tree.msg.length > 0 && tree.msg[0].children.length > 0) {
                                    businessChartCommon.currentView = tree.msg[0].children[0].id;//当前视图
                                    businessChartCommon.currentViewName = tree.msg[0].children[0].name;
                                }
                            }
                        }, function (error) {
                            Loading.hide();
                        });
                    },
                    data: [],
                    active: function (node) {
                        if (node.id != 0){
                            businessChartCommon.currentView = node.id;
                            businessChartCommon.currentViewName = node.name;
                            Loading.show();
                            $scope.businessChartView.reload();
                        } else {
                            var treeObj = angular.element.fn.zTree.getZTreeObj($scope.businessChartViewTree.treeId);
                            var nodes = treeObj.transformToArray(treeObj.getNodes());
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id == businessChartCommon.currentView) {//树上选中节点
                                    treeObj.selectNode(nodes[i]);
                                }
                            }
                        }
                    }
                };
                <!-- 拓扑树 结束 -->

                <!-- 拓扑图 开始 -->
                var promise;
                $scope.businessChartViewDataFromServer = {
                    init: function () {
                        //console.log("开始获取businessChart数据!" + new Date().toLocaleString());
                        $scope.businessChartViewData = businessChartViewService.getBusinessChart({id: businessChartCommon.currentView}, function (data) {
                            //console.log("定时回调businessChart数据!" + new Date().toLocaleString());
                            $scope.businessChartViewData = data;
                            Loading.hide();
                        }, function (error) {
                            Loading.hide();
                        });
                        //console.log("定时获取businessChart数据!" + new Date().toLocaleString());
                        promise = $timeout($scope.businessChartViewDataFromServer.init, 180000);
                    }
                };
                <!-- 拓扑图 结束 -->

                <!-- 跳转页面定时关闭 开始 -->
                $scope.$on('$locationChangeStart', function () {
                    $timeout.cancel(promise);
                    businessChartCommon.currentView = "-1";
                    businessChartCommon.currentViewName = "";
                });
                <!-- 跳转页面定时关闭 结束 -->

                <!-- 页面初始化 开始 -->
                $scope.businessChartshow = {
                    data: {
                        network: null//,//视图变量
                    }
                };
                $scope.businessChartView = {
                    init: function () {
                        Loading.show();
                        $scope.businessChartViewTree.init();
                        $scope.businessChartViewDataFromServer.init();
                        $scope.navigation.init();
                        $(window).resize(function () {
                            if ($scope.businessChartshow.data.network != null)
                                $scope.businessChartshow.data.network.windowsResize();
                        });
                    },
                    reload: function () {
                        $timeout.cancel(promise);
                        $scope.businessChartViewDataFromServer.init();
                    }
                };
                $scope.businessChartView.init();
//                <!-- 页面初始化 结束 -->

                <!-- 对话框激活 开始 -->
                $scope.businessChartDialogActive = {
                    linkStyleDialogShow: function () {
                        $scope.businessChartLinkStyleDialog.ifDottedLine = true;
                        $scope.businessChartLinkStyleDialog.styleMode = "arc";
                        $scope.businessChartLinkStyleDialog.initTree();
                        $scope.businessChartLinkStyleDialog.show();
                    },
                    addLinkShow: function () {
                        var selectElement = $scope.businessChartshow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("资源未选中！", "alarm");
                            return;
                        } else if (selectElement.size() != 2) {
                            $rootScope.$alert("只能选择两个资源！", "alarm");
                            return;
                        }
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (selectElement._as[i].elType == "link" || selectElement._as[i].elType == "defaultNode") {
                                $rootScope.$alert("未选择资源！", "alarm");
                                return;
                            }
                        }
                        if((selectElement._as[0]._links!=undefined)&&(selectElement._as[1]._links!=undefined)){
                            var links1Array=selectElement._as[0]._links._as
                            var links2Array=selectElement._as[1]._links._as
                            if($.isArray(links1Array)&& $.isArray(links2Array)){
                                for(var  i=0;i<links1Array.length;i++){
                                    for(var j=0;j<links2Array.length;j++){
                                        if(links1Array[i]._id==links2Array[j]._id){
                                            $rootScope.$alert("图元之间已存在线路！", "alarm");
                                            return;
                                        }
                                    }
                                }

                            }
                        }
                        $scope.businessChartLinkAddDialog.model.leftLinkType = selectElement._as[0].classify;
                        $scope.businessChartLinkAddDialog.model.leftName = selectElement._as[0].displayName;
                        $scope.businessChartLinkAddDialog.model.inNodeId = selectElement._as[0]._id.substring(2, selectElement._as[0]._id.length);

                        $scope.businessChartLinkAddDialog.model.rightLinkType = selectElement._as[1].classify;
                        $scope.businessChartLinkAddDialog.model.rightName = selectElement._as[1].displayName;
                        $scope.businessChartLinkAddDialog.model.outNodeId = selectElement._as[1]._id.substring(2, selectElement._as[1]._id.length);

                        $scope.businessChartLinkAddDialog.addLinkIfDottedLine = true;
                        $scope.businessChartLinkAddDialog.addLinkStyleMode = "orthogonal";

                        $scope.businessChartLinkAddDialog.show(event);
                    },
                    delElementShow: function () {
                        var selectElement = $scope.businessChartshow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元未选中", "alarm");
                            return;
                        }
                        for (var i = 0; i < selectElement.size(); i++) {
                            if (businessChartCommon.currentView == selectElement._as[i].cId){
                                $rootScope.$alert("选中的业务架构的根节点不可以删除！", "alarm");
                                return;
                            }
                            if (selectElement._as[i].elType == "defaultNode") {
                                $rootScope.$alert("选中的非资源图元无法删除！", "alarm");
                                return;
                            }
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
                        $scope.businessChartElementDelDialog.model = delElementList;
                        $scope.businessChartElementDelDialog.show();
                    },
                    addNode: function (event) {
                        var selectElement = $scope.businessChartshow.data.network.getSelect();
                        if (null == selectElement || selectElement.size() <= 0) {
                            $rootScope.$alert("图元或线路未选中！", "alarm");
                            return;
                        } else if (selectElement.size() > 1) {
                            $rootScope.$alert("只能单一图元或线路！", "alarm");
                            return;
                        } else if (selectElement._as[0]._id.substring(0, 2) != "d_") {
                            $rootScope.$alert("非背景不能新增！", "alarm");
                            return;
                        }
                        $scope.businessChartNodeSynAddDialog.model = {
                            moc: [],
                            mocClassify: [],
                            mo: [],
                            saveMoList: null,
                            hangBits: selectElement._as[0]._id,
                            weights: 100,
                            horizontal:selectElement._as[0]._location.x,
                            vertical:selectElement._as[0]._location.y
                        };
                        $scope.businessChartNodeSynAddDialog.trgTree.data = [];
                        $scope.businessChartNodeSynAddDialog.srcTree.data = [];
                        $scope.businessChartNodeSynAddDialog.initData();
                        $scope.businessChartNodeSynAddDialog.show(event);


                    }
                };
                <!-- 对话框激活 结束 -->


                <!-- 同步图元对话框 开始 -->
                $scope.businessChartNodeSynAddDialog = utilTools.currentDialog({
                    id: "businessChartNodeSynAddDialog",
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
                        businessChartTopoResourceService.synNodesResource({classify: 0}, function (data) {
                            if (data.result == "success") {
                                $scope.businessChartNodeSynAddDialog.model.moc = data.msg.moc;
                                $scope.businessChartNodeSynAddDialog.model.mo = data.msg.mo;
                            }
                        });
                    },
                    add: function () {
                        var trgTreeMoList = new Array();
                        var srcTreeMoList = new Array();
                        var trgTreeObj = angular.element.fn.zTree.getZTreeObj($scope.businessChartNodeSynAddDialog.trgTree.treeId);
                        var existNodes = trgTreeObj.getNodes();
                        for (var z = 0; z < existNodes.length; z++) {
                            for (var a = 0; a < $scope.businessChartNodeSynAddDialog.model.mo.length; a++) {
                                if ($scope.businessChartNodeSynAddDialog.model.mo[a].id == existNodes[z].id) {
                                    trgTreeMoList.push($scope.businessChartNodeSynAddDialog.model.mo[a]);
                                    break;
                                }
                            }
                        }
                        var srcTreeObj = angular.element.fn.zTree.getZTreeObj($scope.businessChartNodeSynAddDialog.srcTree.treeId);
                        var newNodes = srcTreeObj.getCheckedNodes(true);
                        var srcTreeNoRemoveNodes = srcTreeObj.getCheckedNodes(false);
                        for (var j = 0; j < newNodes.length; j++) {
                            for (var i = 0; i < $scope.businessChartNodeSynAddDialog.model.mo.length; i++) {
                                if ($scope.businessChartNodeSynAddDialog.model.mo[i].id == newNodes[j].id) {
                                    trgTreeMoList.push($scope.businessChartNodeSynAddDialog.model.mo[i]);
                                    break;
                                }
                            }
                        }
                        for (var v = 0; v < srcTreeNoRemoveNodes.length; v++) {
                            for (var o = 0; o < $scope.businessChartNodeSynAddDialog.model.mo.length; o++) {
                                if ($scope.businessChartNodeSynAddDialog.model.mo[o].id == srcTreeNoRemoveNodes[v].id) {
                                    srcTreeMoList.push($scope.businessChartNodeSynAddDialog.model.mo[o]);
                                    break;
                                }
                            }
                        }
                        $scope.businessChartNodeSynAddDialog.trgTree.data = trgTreeMoList;
                        $scope.businessChartNodeSynAddDialog.srcTree.data = srcTreeMoList;
                    },
                    remove: function () {
                        var trgTreeMoList = new Array();
                        var srcTreeMoList = new Array();
                        var trgTreeObj = angular.element.fn.zTree.getZTreeObj($scope.businessChartNodeSynAddDialog.trgTree.treeId);
                        var trgTreeRemoveNodes = trgTreeObj.getCheckedNodes(true);
                        var trgTreeNoRemoveNodes = trgTreeObj.getCheckedNodes(false);
                        var srcTreeObj = angular.element.fn.zTree.getZTreeObj($scope.businessChartNodeSynAddDialog.srcTree.treeId);
                        var srcTreeNodes = srcTreeObj.transformToArray(srcTreeObj.getNodes());
                        for (var a = 0; a < $scope.businessChartNodeSynAddDialog.model.mo.length; a++) {
                            var b = true;
                            for (var h = 0; h < trgTreeNoRemoveNodes.length; h++) {
                                if ($scope.businessChartNodeSynAddDialog.model.mo[a].id == trgTreeNoRemoveNodes[h].id) {
                                    trgTreeMoList.push($scope.businessChartNodeSynAddDialog.model.mo[a]);
                                    b = false;
                                    break;
                                }
                            }
                            if (b) {
                                for (var z = 0; z < trgTreeRemoveNodes.length; z++) {
                                    if ($scope.businessChartNodeSynAddDialog.model.mo[a].id == trgTreeRemoveNodes[z].id) {
                                        srcTreeMoList.push($scope.businessChartNodeSynAddDialog.model.mo[a]);
                                        b = false;
                                        break;
                                    }
                                }
                            }
                            if (b) {
                                for (var v = 0; v < srcTreeNodes.length; v++) {
                                    if ($scope.businessChartNodeSynAddDialog.model.mo[a].id == srcTreeNodes[v].id) {
                                        srcTreeMoList.push($scope.businessChartNodeSynAddDialog.model.mo[a]);
                                        b = false;
                                        break;
                                    }
                                }
                            }
                        }
                        $scope.businessChartNodeSynAddDialog.trgTree.data = trgTreeMoList;
                        $scope.businessChartNodeSynAddDialog.srcTree.data = srcTreeMoList;
                    },
                    save: function () {
                        var nodeTree = angular.element.fn.zTree.getZTreeObj($scope.businessChartNodeSynAddDialog.trgTree.treeId);
                        var nodes = nodeTree.transformToArray(nodeTree.getNodes());
                        if (null == nodes || nodes.length == 0) {
                            $rootScope.$alert("资源实例未选择", "alarm");
                            return;
                        }
                        if (nodes.length > 1) {
                            $rootScope.$alert("只能新增一个资源实例", "alarm");
                            return;
                        }
                        if ($scope.businessChartNodeSynAddDialog.model.weights == "") {
                            $rootScope.$alert("权重不能为空！", "alarm");
                            return;
                        }
                        if ($scope.businessChartNodeSynAddDialog.model.weights == null) {
                            $rootScope.$alert("输入框格式不正确，或大于3位！", "alarm");
                            return;
                        }
                        if ($scope.businessChartNodeSynAddDialog.model.weights > 100 || $scope.businessChartNodeSynAddDialog.model.weights < 0) {
                            $rootScope.$alert("权重必须大于0%，小于100%！", "alarm");
                            return;
                        }
                        for (var i = 0; i < nodes.length; i++) {
                            if ($scope.businessChartshow.data.network.ifExitElement(nodes[i])) {
                                $rootScope.$alert("该资源已添加！", "alarm");
                                return;
                            }
                        }
                        var saveMoList = new Array();
                        var obj;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].example == "example", "alarm") {
                                obj = new Object();
                                obj.moId = nodes[i].id;
                                obj.mocpId = nodes[i].typeId;
                                obj.mocpName = nodes[i].type;
                                obj.mocId = nodes[i].classifyId;
                                obj.mocName = nodes[i].classify;
                                obj.moDisplayName = nodes[i].name;
                                obj.applicationId = businessChartCommon.currentView;
                                obj.weights = $scope.businessChartNodeSynAddDialog.model.weights;
                                obj.horizontal = $scope.businessChartNodeSynAddDialog.model.horizontal;
                                obj.vertical = $scope.businessChartNodeSynAddDialog.model.vertical;
                                obj.img = nodes[i].img;
                                obj.size = "58,58";
                                obj.hangBits = $scope.businessChartNodeSynAddDialog.model.hangBits;
                                if (businessChartCommon.currentView == nodes[i].id){
                                    obj.ifMainBusiness = "true";
                                } else {
                                    obj.ifMainBusiness = "false";
                                }

                                saveMoList.push(obj);
                            }
                        }
                        $scope.businessChartNodeSynAddDialog.model.saveMoList = saveMoList;
                        businessChartNodeService.batchsave({id: businessChartCommon.currentView}, $scope.businessChartNodeSynAddDialog.model.saveMoList, function (data) {
                            if (data.result == "success") {
                                Loading.show();
                                $scope.businessChartView.reload();
                            }
                            $scope.businessChartNodeSynAddDialog.hide();
                        });
                    }

                });
                $scope.$watch("businessChartNodeSynAddDialog.model.nodeMoc", function (newVal, oldVal) {
                    $scope.businessChartNodeSynAddDialog.model.mocClassify = [];
                    $scope.businessChartNodeSynAddDialog.model.nodeMocClassify = "";
                    $scope.businessChartNodeSynAddDialog.srcTree.data = [];
                    for (var i = 0; i < $scope.businessChartNodeSynAddDialog.model.moc.length; i++) {
                        if ($scope.businessChartNodeSynAddDialog.model.moc[i].id == $scope.businessChartNodeSynAddDialog.model.nodeMoc) {
                            for (var j = 0; j < $scope.businessChartNodeSynAddDialog.model.moc[i].children.length; j++) {
                                $scope.businessChartNodeSynAddDialog.model.mocClassify.push($scope.businessChartNodeSynAddDialog.model.moc[i].children[j]);
                            }
                            return;
                        }
                    }
                }, false);
                $scope.$watch("businessChartNodeSynAddDialog.model.nodeMocClassify", function (newVal, oldVal) {
                    var moList = new Array();
                    var trgTreeObj = angular.element.fn.zTree.getZTreeObj($scope.businessChartNodeSynAddDialog.trgTree.treeId);
                    if (null != trgTreeObj) {
                        var existNodes = trgTreeObj.getNodes();
                        for (var i = 0; i < $scope.businessChartNodeSynAddDialog.model.mo.length; i++) {
                            if ($scope.businessChartNodeSynAddDialog.model.mo[i].parentId == $scope.businessChartNodeSynAddDialog.model.nodeMocClassify) {
                                var isInsert = true;
                                for (var z = 0; z < existNodes.length; z++) {
                                    if ($scope.businessChartNodeSynAddDialog.model.mo[i].id == existNodes[z].id) {
                                        isInsert = false;
                                    }
                                }
                                if (isInsert) {
                                    moList.push($scope.businessChartNodeSynAddDialog.model.mo[i]);
                                }
                            }
                        }
                    }
                    $scope.businessChartNodeSynAddDialog.srcTree.data = moList;
                }, false);
                <!-- 同步图元对话框 结束 -->

                <!-- 删除图元对话框 开始 -->
                $scope.businessChartElementDelDialog = utilTools.currentDialog({
                    id: "businessChartElementDelDialog",
                    title: "删除",
                    model: {
                    },
                    save: function () {
                        businessChartViewService.deleteElements({id: businessChartCommon.currentView}, $scope.businessChartElementDelDialog.model, function (data) {
                            if (data.result == "success") {
                                Loading.show();
                                $scope.businessChartView.reload();
                            }
                            $scope.businessChartElementDelDialog.hide();
                        });
                    }
                });
                <!-- 删除图元对话框 结束 -->

                <!-- 添加线路对话框 开始 -->
                $scope.businessChartLinkAddDialog = utilTools.currentDialog({
                    id: "businessChartLinkAddDialog",
                    title: "新增",
                    model: {
                    },
                    save: function () {
                        var lineModelobj = new Object();
                        lineModelobj.inNodeId = $scope.businessChartLinkAddDialog.model.inNodeId;
                        lineModelobj.outNodeId = $scope.businessChartLinkAddDialog.model.outNodeId;
                        $scope.businessChartLinkAddDialog.model.lineModel = lineModelobj;
                        var cssLine = "solid";
                        if ($scope.businessChartLinkAddDialog.addLinkIfDottedLine) {
                            cssLine = "dotted";
                        }
                        businessChartLinkService.save({id: businessChartCommon.currentView, sytle: $scope.businessChartLinkAddDialog.addLinkStyleMode, cssLine: cssLine}, $scope.businessChartLinkAddDialog.model.lineModel, function (data) {
                            if (data.result == "success") {
                                $scope.businessChartView.reload();
                            }
                            $scope.businessChartLinkAddDialog.hide();
                        });
                    }
                });
                <!-- 添加线路对话框 结束 -->


                <!-- 线路样式对话框 开始 -->
                $scope.businessChartLinkStyleDialog = utilTools.currentDialog({
                    id: "businessChartLinkStyleDialog",
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
                        $scope.businessChartLinkStyleDialog.tree.data = businessChartLinkService.query({id: businessChartCommon.currentView}, function (data) {
                            if (data.result == "success") {
                                var tree = angular.element.fn.zTree.getZTreeObj($scope.businessChartLinkStyleDialog.tree.treeId);
                                var nodes = tree.getNodesByParam("isHidden", true);
                                tree.showNodes(nodes);
                                nodes = tree.getCheckedNodes();
                                for (var i = 0, l = nodes.length; i < l; i++) {
                                    tree.checkNode(nodes[i], false, false);
                                }
                                $scope.businessChartLinkStyleDialog.tree.data = data.msg;
                            }
                        });
                    },
                    save: function () {
                        var linkTree = angular.element.fn.zTree.getZTreeObj($scope.businessChartLinkStyleDialog.tree.treeId);
                        var links = linkTree.getCheckedNodes(true);
                        if (null == links || links == 0) {
                            $rootScope.$alert("线路未选择！", "alarm");
                            return;
                        }
                        if (null == $scope.businessChartLinkStyleDialog.styleMode) {
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
                        $scope.businessChartLinkStyleDialog.model = linkList;
                        var cssLine = "solid";
                        if ($scope.businessChartLinkStyleDialog.ifDottedLine) {
                            cssLine = "dotted";
                        }
                        businessChartLinkService.updateLinksStyle({id: businessChartCommon.currentView, sytle: $scope.businessChartLinkStyleDialog.styleMode, cssLine: cssLine}, $scope.businessChartLinkStyleDialog.model, function (data) {
                            if (data.result == "success") {
                                $scope.businessChartView.reload();
                            }
                            $scope.businessChartLinkStyleDialog.hide();
                        });
                    }
                });
                <!-- 线路样式对话框 结束 -->


            }
        ])

        .controller('alarmAffectColorController', ['$scope', '$rootScope', 'Modal', 'Loading', 'Util', 'alarmAffectColorService', 'businessChartTopoResourceService', function ($scope, $rootScope, Modal, Loading, Util, alarmAffectColorService, businessChartTopoResourceService) {
            //资产类型列表的设置，操作

            $scope.listPage = {
                data: [],
                checkedList: [],
                checkAllRow: false,
                search: {limit: 20, offset: 0, orderBy: "mocpName", orderByType: "desc"},
                settings: {
                    reload: null,
                    getData: function (search, fnCallback) {
                        Loading.show();
                        var obj = new Object();
                        for (var i = 0; i < $scope.modalSetting.model2.mocs.length; i++) {
                            if ($scope.modalSetting.model2.mocs[i].id == $scope.modalSetting.model2.moc) {
                                obj.mocpName = $scope.modalSetting.model2.mocs[i].displayName;
                            }
                        }
                        for (var i = 0; i < $scope.modalSetting.model2.mocClassifys.length; i++) {
                            if ($scope.modalSetting.model2.mocClassifys[i].id == $scope.modalSetting.model2.mocClassify) {
                                obj.mocName = $scope.modalSetting.model2.mocClassifys[i].displayName;
                            }
                        }
                        for (var i = 0; i < $scope.modalSetting.model2.indicators.length; i++) {
                            if ($scope.modalSetting.model2.indicators[i].id == $scope.modalSetting.model2.indicatorId) {
                                obj.indicatorName = $scope.modalSetting.model2.indicators[i].displayName;
                            }
                        }
                        for (var i = 0; i < $scope.modalSetting.model2.metrics.length; i++) {
                            if ($scope.modalSetting.model2.metrics[i].id == $scope.modalSetting.model2.metricId) {
                                obj.metricName = $scope.modalSetting.model2.metrics[i].displayName;
                            }
                        }
                        obj.metricId = $scope.modalSetting.model2.metricId;
                        obj.color = $scope.modalSetting.model2.color;
                        $scope.listPage.search.mocpName=obj.mocpName;
                        $scope.listPage.search.mocName=obj.mocName;
                        $scope.listPage.search.indicatorName=obj.indicatorName;
                        $scope.listPage.search.metricName=obj.metricName
                        $scope.listPage.search.limit = search.limit;
                        $scope.listPage.search.offset = search.offset;
                        $scope.listPage.search.orderBy = search.orderBy;
                        $scope.listPage.search.orderByType = search.orderByType;
//                        $scope.listPage.search.color = obj.color;
                        $scope.listPage.search.level=$scope.modalSetting.model2.level;
                        alarmAffectColorService.query($scope.listPage.search, function (data) {
                            $scope.listPage.data = data.rows;
                            fnCallback(data);
                            $scope.listPage.checkedList = [];
                            $scope.listPage.checkAllRow = false;
                            Loading.hide();
                        });
                    }, //getData应指定获取数据的函数
                    columns: [
                        {
                            sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                            mData: "id",
                            mRender: function (mData, type, full) {
                                return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\'' + mData + '\' /><i></i></label></div>';
                            }
                        },
                        {
                            sTitle: "资源类型组",
                            mData: "mocpName",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(mData);
                            }
                        },
                        {
                            sTitle: "资源类型",
                            mData: "mocName",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(mData);
                            }
                        },
                        {
                            sTitle: "指标组",
                            mData: "indicatorName",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(mData);
                            }
                        },
                        {
                            sTitle: "指标",
                            mData: "metricName",
                            mRender: function (mData, type, full) {
                                return Util.str2Html(mData);
                            }
                        },
                        {
                            sTitle: "等级",
                            mData: "color",
                            mRender: function (mData, type, full) {
                                return Util.findFromArray("value", mData, $rootScope.alarm.const.levels)["label"];
                            }
                        },
                        {
                            sTitle: "操作",
                            mData: "id",
                            mRender: function (mData, type, full) {
                                return  '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\'' + mData + '\')"></i>';
                            }
                        }
                    ],
                    columnDefs: [
                        { bSortable: false, aTargets: [0,6]},
                        { sWidth: "38px", aTargets: [ 0 ] },
                        { sWidth: "100px", aTargets: [ 6 ] }
                    ], //定义列的约束
                    defaultOrderBy: []  //定义默认排序列为第8列倒序
                },
                action: {
                    showAddModal: function () {     //弹出增加对话框
                        $scope.modalType = 1;
                        $scope.modalSetting.title = "新增";
                        $scope.modalSetting.initData();
                        Modal.show($scope.modalSetting.id);
                    },
                    remove: function (alarmAffectColorId) {    //单个删除类型
                        $rootScope.common.confirm("确定要删除么?", function () {
                            Loading.show();
                            alarmAffectColorService.remove({id: alarmAffectColorId}, {}, function (data) {
                                Loading.hide();
                                if (data.result == "success") {
                                    $rootScope.$alert("删除成功!");
                                    $scope.listPage.settings.reload();
                                } else {
                                    $rootScope.$alert("删除失败!");
                                }
                            }, function (error) {
                                Loading.hide();
                                $rootScope.$alert("删除失败!");
                            });
                        }, " 删 除 ");
                    },
                    batchRemove: function () {   //批量删除类型
                        if ($scope.listPage.checkedList.length == 0) {
                            $rootScope.$alert("请选择要删除的资产类型");
                        } else {
                            $rootScope.common.confirm("确定要删除么？", function () {
                                Loading.show();
                                alarmAffectColorService.batchRemove({ids: $scope.listPage.checkedList}, {}, function (data) {
                                    Loading.hide();
                                    if (data.result == "success") {
                                        $rootScope.$alert("删除成功!");
                                        $scope.listPage.settings.reload();
                                    } else {
                                        $rootScope.$alert("删除失败!");
                                    }
                                }, function (error) {
                                    Loading.hide();
                                    $rootScope.$alert("删除失败!");
                                    $scope.listPage.settings.reload();
                                });
                            }, " 删 除 ");
                        }
                    }
                }
            };

            //数据对象
            $scope.initAssetType = function (model) {
                if (model) {
                    Util.init($scope.model, model);
                } else {
                    Util.init($scope.model, {
                        id: null,
                        mocpName: null,
                        mocName: null,
                        metricName: null,
                        indicatorName: null,
                        color: null
                    });
                }
            };
            $scope.initAssetType2 = function (model2) {
                if (model2) {
                    Util.init($scope.model2, model2);
                } else {
                    Util.init($scope.model2, {
                        id: null,
                        mocpName: null,
                        mocName: null,
                        metricName: null,
                        indicatorName: null,
                        color: null
                    });
                }
            };
            $scope.initModel = function () {
                $scope.model = {};
                $scope.model2={}
                $scope.initAssetType();
                $scope.initAssetType2();
            };
            $scope.initModel();

            //增加dialog
            $scope.modalSetting = {
                id: "addModal",
                title: "新增",
                saveBtnText: "保存",
                saveBtnHide: false,
                saveDisabled: true,
                model: {
                    mocs: [],
                    mocClassifys: [],
                    indicators: [],
                    metrics: [],
                    color: 6,
                    moc: "",
                    mocClassify: "",
                    indicatorId: "",
                    metricId: ""
                },
                model2: {
                    level:[2,3,4,5,6],
                    mocs: [],
                    mocClassifys: [],
                    indicators: [],
                    metrics: [],
                    color: "",
                    moc: "",
                    mocClassify: "",
                    indicatorId: "",
                    metricId: ""
                },
                initData: function () {
                    $scope.modalSetting.model.mocClassifys = [];
                    $scope.modalSetting.model.indicators = [];
                    $scope.modalSetting.model.metrics = [];
                    $scope.modalSetting.model.color = 6;
                    $scope.modalSetting.model.moc = "";
                    $scope.modalSetting.model.mocClassify = "";
                    $scope.modalSetting.model.indicatorId = "";
                    $scope.modalSetting.model.metricId = "";
                    businessChartTopoResourceService.synMocResource({}, function (data) {
                        if (data.result == "success") {
                            $scope.modalSetting.model.mocs = data.msg.moc;
                        }
                    });
                },
                initSearchData: function () {
                    $scope.modalSetting.model2.mocClassifys = [];
                    $scope.modalSetting.model2.indicators = [];
                    $scope.modalSetting.model2.metrics = [];
                    $scope.modalSetting.model2.color = "";
                    $scope.modalSetting.model2.moc = "";
                    $scope.modalSetting.model2.mocClassify = "";
                    $scope.modalSetting.model2.indicatorId = "";
                    $scope.modalSetting.model2.metricId = "";
                    businessChartTopoResourceService.synMocResource({}, function (data) {
                        if (data.result == "success") {
                            $scope.modalSetting.model2.mocs = data.msg.moc;
                        }
                    });
                },
                hiddenFn: function () {
                    $scope.initAssetType();
                },
                save: function () {
                    Loading.show();
                    var obj = new Object();
                    for (var i = 0; i < $scope.modalSetting.model.mocs.length; i++) {
                        if ($scope.modalSetting.model.mocs[i].id == $scope.modalSetting.model.moc) {
                            obj.mocpName = $scope.modalSetting.model.mocs[i].displayName;
                        }
                    }
                    for (var i = 0; i < $scope.modalSetting.model.mocClassifys.length; i++) {
                        if ($scope.modalSetting.model.mocClassifys[i].id == $scope.modalSetting.model.mocClassify) {
                            obj.mocName = $scope.modalSetting.model.mocClassifys[i].displayName;
                        }
                    }
                    for (var i = 0; i < $scope.modalSetting.model.indicators.length; i++) {
                        if ($scope.modalSetting.model.indicators[i].id == $scope.modalSetting.model.indicatorId) {
                            obj.indicatorName = $scope.modalSetting.model.indicators[i].displayName;
                        }
                    }
                    for (var i = 0; i < $scope.modalSetting.model.metrics.length; i++) {
                        if ($scope.modalSetting.model.metrics[i].id == $scope.modalSetting.model.metricId) {
                            obj.metricName = $scope.modalSetting.model.metrics[i].displayName;
                        }
                    }
                    obj.metricId = $scope.modalSetting.model.metricId;
                    obj.color = $scope.modalSetting.model.color;
                    $scope.model = obj;
                    alarmAffectColorService.save({}, $scope.model, function (data) {
                        Loading.hide();
                        if (data.result == "haveAdd") {
                            $rootScope.$alert("该资源告警影响规则已存在");
                            Modal.hide($scope.modalSetting.id);
                            $scope.listPage.settings.reload();
                        }
                        else if (data.result == "success") {
                            $rootScope.$alert("保存成功");
                            Modal.hide($scope.modalSetting.id);
                            $scope.listPage.settings.reload();
                        } else {
                            $rootScope.$alert("保存失败");
                        }
                    }, function (error) {
                        Loading.hide();
                        $rootScope.$alert("保存失败");
                    });
                }
            };
            $scope.modalSetting.initSearchData();
            // watch moudle2
            $scope.$watch("[modalSetting.model2.moc,modalSetting.model2.mocClassify,modalSetting.model2.indicatorId,modalSetting.model2.metricId,modalSetting.model2.color]", function (newVal) {
                if (Util.notNull(newVal[0], newVal[1], newVal[2], newVal[3], newVal[4])) {
                    $scope.modalSetting.saveDisabled = false;
                } else {
                    $scope.modalSetting.saveDisabled = true;
                }
            }, true);

            $scope.$watch("modalSetting.model2.moc", function (newVal, oldVal) {
                $scope.modalSetting.model2.mocClassifys = [];
                $scope.modalSetting.model2.mocClassify = "";
                $scope.modalSetting.model2.indicators = [];
                $scope.modalSetting.model2.indicatorId = "";
                $scope.modalSetting.model2.metrics = [];
                $scope.modalSetting.model2.metricId = "";
                for (var i = 0; i < $scope.modalSetting.model2.mocs.length; i++) {
                    if ($scope.modalSetting.model2.mocs[i].id == $scope.modalSetting.model2.moc) {
                        for (var j = 0; j < $scope.modalSetting.model2.mocs[i].children.length; j++) {
                            $scope.modalSetting.model2.mocClassifys.push($scope.modalSetting.model2.mocs[i].children[j]);
                        }
                        return;
                    }
                }
            }, false);
            $scope.$watch("modalSetting.model2.mocClassify", function (newVal, oldVal) {
                $scope.modalSetting.model2.indicators = [];
                $scope.modalSetting.model2.indicatorId = "";
                $scope.modalSetting.model2.metrics = [];
                $scope.modalSetting.model2.metricId = "";
                if (Util.notNull(newVal)) {
                    businessChartTopoResourceService.getMetricByMocId({rule: 'alarm', mocId: newVal}, {}, function (data) {
                        $scope.modalSetting.model2.indicators = data;
                    });
                }
            }, false);
            $scope.$watch("modalSetting.model2.indicatorId", function (newVal, oldVal) {
                $scope.modalSetting.model2.metrics = [];
                $scope.modalSetting.model2.metricId = "";
                if (Util.notNull(newVal)) {
                    $scope.modalSetting.model2.metrics = Util.findFromArray("id", newVal, $scope.modalSetting.model2.indicators)["children"];
                }
            }, false);
            // watch moudle
            $scope.$watch("[modalSetting.model.moc,modalSetting.model.mocClassify,modalSetting.model.indicatorId,modalSetting.model.metricId,modalSetting.model.color]", function (newVal) {
                if (Util.notNull(newVal[0], newVal[1], newVal[2], newVal[3], newVal[4])) {
                    $scope.modalSetting.saveDisabled = false;
                } else {
                    $scope.modalSetting.saveDisabled = true;
                }
            }, true);

            $scope.$watch("modalSetting.model.moc", function (newVal, oldVal) {
                $scope.modalSetting.model.mocClassifys = [];
                $scope.modalSetting.model.mocClassify = "";
                $scope.modalSetting.model.indicators = [];
                $scope.modalSetting.model.indicatorId = "";
                $scope.modalSetting.model.metrics = [];
                $scope.modalSetting.model.metricId = "";
                for (var i = 0; i < $scope.modalSetting.model.mocs.length; i++) {
                    if ($scope.modalSetting.model.mocs[i].id == $scope.modalSetting.model.moc) {
                        for (var j = 0; j < $scope.modalSetting.model.mocs[i].children.length; j++) {
                            $scope.modalSetting.model.mocClassifys.push($scope.modalSetting.model.mocs[i].children[j]);
                        }
                        return;
                    }
                }
            }, false);
            $scope.$watch("modalSetting.model.mocClassify", function (newVal, oldVal) {
                $scope.modalSetting.model.indicators = [];
                $scope.modalSetting.model.indicatorId = "";
                $scope.modalSetting.model.metrics = [];
                $scope.modalSetting.model.metricId = "";
                if (Util.notNull(newVal)) {
                    businessChartTopoResourceService.getMetricByMocId({rule: 'alarm', mocId: newVal}, {}, function (data) {
                        $scope.modalSetting.model.indicators = data;
                    });
                }
            }, false);
            $scope.$watch("modalSetting.model.indicatorId", function (newVal, oldVal) {
                $scope.modalSetting.model.metrics = [];
                $scope.modalSetting.model.metricId = "";
                if (Util.notNull(newVal)) {
                    $scope.modalSetting.model.metrics = Util.findFromArray("id", newVal, $scope.modalSetting.model.indicators)["children"];
                }
            }, false);
            $scope.$watch("listPage.checkAllRow", function (newVal, oldVal) {
                if (newVal) {
                    $scope.listPage.checkedList = Util.copyArray("id", $scope.listPage.data);
                } else {
                    if ($scope.listPage.data.length == $scope.listPage.checkedList.length) {
                        $scope.listPage.checkedList = [];
                    }
                }
            }, false);
            $scope.$watch("listPage.checkedList", function (newVal, oldVal) {
                $scope.listPage.checkAllRow = newVal && newVal.length > 0 && newVal.length == $scope.listPage.data.length;
            }, true);
        }])
    ;
})(angular);