(function () {
    var Topology = function (scope, routeParams) {
        this._init(scope, routeParams);
    };

    Topology.prototype._init = function (scope, routeParams) {
        console.log("初始化canvas" + new Date().toLocaleString());
        this.elementBox = new twaver.ElementBox();
        this.network = new twaver.network.Network(this.elementBox);
        this.network.setToolTipEnabled(true);
        this.autoLayouter = new twaver.layout.AutoLayouter(this.network);//网元自动排列
        this.autoLayouter.setAnimate(true);
        this.registAlarmSeverity();//告警等级初始化
        //添加监听
        this.network.setInteractions([
            new twaver.network.interaction.SelectInteraction(this.network),
            new twaver.network.interaction.MoveInteraction(this.network),
            new twaver.network.interaction.MouseInteractionSimulation(this.network, scope, routeParams),
            new twaver.network.interaction.DefaultInteraction(this.network)
        ]);
        var topoView = document.getElementById('simulationView');
        var width = (window.innerWidth - 245) + 'px';
        var height = (window.innerHeight - 188) + 'px';
        this.network.getView().style.width = width;
        this.network.getView().style.height = height;
        topoView.appendChild(this.network.getView());
        this.network.getInnerColor = function (node) {
            return node.getStyle('inner.color');
        }
        this.network.oldWidth = this.network.getView().style.width;
        this.network.oldHeight = this.network.getView().style.height;
        this.overview = new twaver.network.Overview();
        this.isEyeShow = false;
        this.createEyeDiv();
        this.network.setKeyboardRemoveEnabled(false);
        this.network.setLinkFlowEnabled(true);//线路是否流动
        this.network.isSelectable = function (element) {//重写节点选择方法
            if (element.getClient("isSelectable") == false) {
                return false;
            }
            return true;
        };
        this.network.setMovableFunction(function (element) {//重写节点移动方法
            if (element.getClient("movable") == false) {
                return false;
            }
            return true;
        });
        this.image = null;
    };

    //没有权限，节点无法移动
    Topology.prototype.unMovable = function (isMovable) {
        if (isMovable){
            var allElements = this.elementBox.getDatas();
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).elType == "node") {
                    allElements.get(i).setClient("movable", false);
                    allElements.get(i).movable = false;
                }
            }
        }
    };

    Topology.prototype.windowsResize = function () {
//        console.log("窗口宽度" + window.innerWidth);
//        console.log("窗口高度" + window.innerHeight);
        var width = (window.innerWidth - 245) + 'px';
        var height;
        if (window.innerWidth >= 1348){
            height = (window.innerHeight - 188) + 'px';
        } else {
            height = (window.innerHeight - 203) + 'px';
        }
        if (this.network != null){
            this.network.getView().style.width = width;
            this.network.getView().style.height = height;
            //this.network.oldWidth = this.network.getView().style.width;//1642BUG
            //this.network.oldHeight = this.network.getView().style.height;//1642BUG
        }
    };
    //鹰眼DIV层
    Topology.prototype.createEyeDiv = function () {
        var overviewDiv = document.createElement("div");
        overviewDiv.setAttribute("name", "eyeDiv");
        overviewDiv.style.background = "white";
        overviewDiv.style.position = "absolute";
        overviewDiv.style.right = "20px";
        overviewDiv.style.bottom = "20px";
        overviewDiv.style.width = "300px";
        //overviewDiv.style.height = "300px";
        overviewDiv.style.display = "none";

        var overviewView = this.overview.getView();
        overviewView.style.left = '0px';
        overviewView.style.right = '0px';
        overviewView.style.top = '0px';
        overviewView.style.bottom = '0px';
        overviewDiv.appendChild(overviewView);
        document.body.appendChild(overviewDiv);
    };

    Topology.prototype.eyeShow = function () {
        if (!this.isEyeShow) {
            this.overview.setNetwork(this.network);
            document.getElementsByName("eyeDiv")[0].style.display = "block";
            this.isEyeShow = true;
        } else if (this.isEyeShow) {
            this.overview.setNetwork(null);
            document.getElementsByName("eyeDiv")[0].style.display = "none";
            this.isEyeShow = false;
        }
    };

    Topology.prototype.eyeClose = function () {
        document.body.removeChild(document.getElementsByName("eyeDiv")[0]);
        this.isEyeShow = false;
    };


    //告警等级初始化
    Topology.prototype.registAlarmSeverity = function () {
        twaver.AlarmSeverity.clear();
        twaver.AlarmSeverity.URGENT = twaver.AlarmSeverity.add(500, "Urgent", "", '#de4e43');//紧急
        twaver.AlarmSeverity.HIGH = twaver.AlarmSeverity.add(400, "High", "", '#ff9133');//高级
        twaver.AlarmSeverity.MIDDLE = twaver.AlarmSeverity.add(300, "Middle", "", '#f8c63d');//中级
        twaver.AlarmSeverity.LOW = twaver.AlarmSeverity.add(200, "Low", "", '#099ccc');//低级
        twaver.AlarmSeverity.PROMPT = twaver.AlarmSeverity.add(100, "Prompt", "", '#99cc66');//提示
    };

    Topology.prototype.readyRegistImage = function (img) {
        registerImage("./img/topo/" + img, this.network);

        function registerImage(url, box, width, height) {
            var image = new Image();
            image.src = url;
            image.onload = function () {
                twaver.Util.registerImage(getImageName(url), image, width ? width : image.width, height ? height : image.height);
                image.onload = null;
                if (box) {
                    box.invalidateElementUIs();
                }
            };
        }

        function getImageName(url) {
            var index = url.lastIndexOf('/');
            var name = url;
            if (index >= 0) {
                name = url.substring(index + 1);
            }
            index = name.lastIndexOf('.');
            if (index >= 0) {
                name = name.substring(0, index);
            }
            return name;
        }
    };

    Topology.prototype.addLocationPropertyChangeListener = function () {
        this.elementBox.addDataPropertyChangeListener(this.locationChange);
    };

    Topology.prototype.removeLocationPropertyChangeListener = function () {
        this.elementBox.removeDataPropertyChangeListener(this.locationChange);
    };
    //节点移动监听
    Topology.prototype.locationChange = function (el) {
        if (el.property == 'location') {
            if (!simulationCommon.locationChange)
                simulationCommon.locationChange = {};
            simulationCommon.locationChange[el.source.getId()] = el.newValue;
        }
    };

    Topology.prototype.addViewRectPropertyChangeListener = function () {
        this.network.addPropertyChangeListener(this.viewRectChange);
    };

    Topology.prototype.removeViewRectPropertyChangeListener = function () {
        this.network.removePropertyChangeListener(this.viewRectChange);
    };

    Topology.prototype.viewRectChange = function (el) {
        if (el.property === "viewRect") {
            document.getElementsByName("eyeDiv")[0].style.height = Math.ceil(300 * el.source.getViewRect().height / el.source.getViewRect().width) + "px";
        }
    };


    Topology.prototype.addElement = function (el) {
        if (el instanceof twaver.Node) {
            this.elementBox.add(el);
        } else if (el instanceof twaver.Link) {
            this.elementBox.add(el);
        }
    };

    Topology.prototype.getAllElement = function () {
        var allElements = this.elementBox.getDatas();
        var map = new Object();
        for (var i = 0; i < allElements.size(); i++) {
            map[allElements.get(i).getId()] = allElements.get(i);
        }
        return map;
    };

    Topology.prototype.findElement = function (item, Prefix) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).getId() == (Prefix + item.id)) {
                if (allElements.get(i).elType == "node") {
                    this.readyRegistImage(item.img);
                    allElements.get(i).setImage(getImageName(item.img));
                    if (null != item.size && item.size != "" && allElements.get(i).size != item.size) {
                        if (null != item.size && item.size != "") {
                            var x = parseInt(item.size.split(",")[0]);
                            var y = parseInt(item.size.split(",")[1]);
                            allElements.get(i).setSize(x, y);
                            allElements.get(i).size = item.size;
                        } else {
                            allElements.get(i).setSize(58,58);
                            allElements.get(i).size = "58,58";
                        }
                    }
                } else if (allElements.get(i).elType == "link") {
                    if (null != item.cssLine && item.cssLine != "" && allElements.get(i).cssLine != item.cssLine) {
                        if (item.cssLine == "solid") {
                            allElements.get(i).setStyle('link.flow', null);
                            allElements.get(i).setStyle('link.flow.converse', null);
                            allElements.get(i).setStyle('link.pattern', null);
                            allElements.get(i).setStyle('link.flow.color', null);
                            allElements.get(i).setStyle('vector.outline.color', null);
//                            if (allElements.get(i).elStatus == "off") {
//                                allElements.get(i).setStyle('link.color', '#C0C0C0');
//                            } else if (allElements.get(i).elStatus == "on") {
//                                allElements.get(i).setStyle('link.color', '#008000');
//                            } else if (allElements.get(i).elStatus == "green") {
//                                allElements.get(i).setStyle('link.color', '#008000');
//                            } else if (allElements.get(i).elStatus == "orange") {
//                                allElements.get(i).setStyle('link.color', '#FFC125');
//                            } else if (allElements.get(i).elStatus == "red") {
//                                allElements.get(i).setStyle('link.color', '#FF0000');
//                            }
                        } else if (item.cssLine == "dotted") {
                            allElements.get(i).setStyle('link.flow', true);
                            allElements.get(i).setStyle('link.flow.converse', false);
                            allElements.get(i).setStyle('link.pattern', [5, 5]);
                            allElements.get(i).setStyle('link.flow.color', 'black');
                            allElements.get(i).setStyle('vector.outline.color', '#FFFFFF');
//                            if (allElements.get(i).elStatus == "off") {
//                                allElements.get(i).setStyle('link.color', '#C0C0C0');
//                            } else if (allElements.get(i).elStatus == "on") {
//                                allElements.get(i).setStyle('link.color', '#008000');
//                            } else if (allElements.get(i).elStatus == "green") {
//                                allElements.get(i).setStyle('link.color', '#008000');
//                            } else if (allElements.get(i).elStatus == "orange") {
//                                allElements.get(i).setStyle('link.color', '#FFC125');
//                            } else if (allElements.get(i).elStatus == "red") {
//                                allElements.get(i).setStyle('link.color', '#FF0000');
//                            }
                        }
                        allElements.get(i).cssLine = item.cssLine;
                    }
                }
                //console.log("已有" + " " + allElements.get(i).getId() + " " + new Date().toLocaleString());
                return false;
            }
        }
        //console.log("新加" + " " + Prefix + item.id + " " + new Date().toLocaleString());
        return true;
        function getImageName(name) {
            var index = name.lastIndexOf('.');
            if (index >= 0) {
                name = name.substring(0, index);
            }
            return name;
        }
    };

    Topology.prototype.removeAllElement = function () {
        var allElements = this.elementBox.getDatas();
        if (null != allElements) {
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).elType == "link") {
                    this.elementBox.remove(allElements.get(i));
                    i--;
                }
            }
            for (var z = 0; z < allElements.size(); z++) {
                if (allElements.get(z).elType == "node") {
                    this.elementBox.remove(allElements.get(z));
                    z--;
                }
            }
        }
    };

    Topology.prototype.removeRedundantElement = function () {
        var allElements = this.elementBox.getDatas();
        if (null != allElements) {
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).elType == null) {
                    this.elementBox.remove(allElements.get(i));
                    i--;
                }
            }
        }
    };

    Topology.prototype.removeElement = function (items, elType, Prefix) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).elType == elType) {
                var isRemove = "true";
                if (items != null) {
                    for (var j = 0; j < items.length; j++) {
                        if (allElements.get(i).getId() == (Prefix + items[j].id)) {
                            isRemove = "false";
                            //console.log("不移除" + " " + allElements.get(i).getId() + " " + new Date().toLocaleString());
                            break;
                        }
                    }
                }
                if (isRemove == "true") {
                    //console.log("移除" + " " + allElements.get(i).getId() + " " + new Date().toLocaleString());
                    this.elementBox.remove(allElements.get(i));
                    i--;
                }
            }
        }
    };



    Topology.prototype.refreshNodeStatus = function (currentNodeStatus) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).elType == "node") {
                var statusValue = -1;
                for (var j = 0; j < currentNodeStatus.length; j++) {
                    if (allElements.get(i).getId().substring(2, allElements.get(i).getId().length) == currentNodeStatus[j].elementId) {
                        if (currentNodeStatus[j].value > statusValue){
                            statusValue = currentNodeStatus[j].value;
                        }
                    }
                }
                if (toDecimal(statusValue) > -1){
                    if (statusValue != allElements.get(i).elStatus) {
                        //console.log("刷新图元状态：新" + currentNodeStatus[j].value + new Date().toLocaleString());
                        //console.log("刷新图元状态：旧" + allElements.get(i).elStatus + new Date().toLocaleString());
                        if (statusValue != "off") {
                            //allElements.get(i).setStyle('inner.color', nodeStatusColor(currentNodeStatus[j].value));
                            allElements.get(i).setStyle('body.type', 'default.vector');
                            allElements.get(i).setStyle('vector.shape', 'circle');
                            allElements.get(i).setStyle('vector.deep', '3');
                            allElements.get(i).setStyle('vector.gradient', 'radial.center');
                            allElements.get(i).setStyle('vector.gradient.color', nodeStatusGradientColor(statusValue));
                            allElements.get(i).setStyle('vector.padding', 12);
                            allElements.get(i).setStyle('vector.fill', true);
                            allElements.get(i).setStyle('vector.fill.color', nodeStatusFillColor(statusValue));
                            allElements.get(i).elStatus = statusValue;
                            //console.log("刷新图元状态：颜色色号" + nodeStatusColor(currentNodeStatus[j].value) + new Date().toLocaleString());
                        } else {
                            allElements.get(i).setStyle('body.type', 'default');
                            allElements.get(i).elStatus = statusValue;
                        }
                    }
                } else {
                    //恢复状态
                    allElements.get(i).setStyle('body.type', 'default');
                    allElements.get(i).elStatus = "off";
                }
            }
        }
        function nodeStatusGradientColor(currentStatus) {
            switch (currentStatus) {
                case '6' :
                    return "rgba(222, 78, 67, 1)";
                case '5' :
                    return "rgba(255, 145, 51, 1)";
                case '4' :
                    return  "rgba(248, 198, 61, 1)";
                case '3' :
                    return  "rgba(9, 156, 204, 1)";
                case '2' :
                    return  "rgba(153, 204, 102, 1)";
                default:
                    return  "rgba(255, 255, 255, 1)";
            }
        }

        function nodeStatusFillColor(currentStatus) {
            switch (currentStatus) {
                case '6' :
                    return "rgba(222, 78, 67, 1)";
                case '5' :
                    return "rgba(255, 145, 51, 1)";
                case '4' :
                    return  "rgba(248, 198, 61, 1)";
                case '3' :
                    return  "rgba(9, 156, 204, 1)";
                case '2' :
                    return  "rgba(153, 204, 102, 1)";
                default:
                    return  "rgba(255, 255, 255, 1)";
            }
        }

        function toDecimal(x) {
            var f = parseFloat(x);
            f = f.toFixed(2);
            if (isNaN(f)) {
                return;
            }
            return f;
        }

    };

    Topology.prototype.refreshLinkStatus = function (currentLinkStatus) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).elType == "link") {
                var statusValue = -1;
                for (var j = 0; j < currentLinkStatus.length; j++) {
                    if (allElements.get(i).getId().substring(2, allElements.get(i).getId().length) == currentLinkStatus[j].elementId) {
                        if (currentLinkStatus[j].value > statusValue){
                            statusValue = currentLinkStatus[j].value;
                        }
                    }
                }
                if (toDecimal(statusValue) > -1){
                    if (statusValue != allElements.get(i).elStatus) {
                        //console.log("刷新线路状态：新" + currentLinkStatus[j].currentStatus + new Date().toLocaleString());
                        //console.log("刷新线路状态：旧" + allElements.get(i).elStatus + new Date().toLocaleString());
                        if (statusValue != "off") {
                            linkStatusStyle(statusValue, allElements.get(i));
                            allElements.get(i).elStatus = statusValue;
                        } else {
                            allElements.get(i).setStyle('link.flow', false);
                            allElements.get(i).setStyle('link.flow.converse', false);
                            allElements.get(i).setStyle('link.pattern', null);
                            allElements.get(i).elStatus = statusValue;
                        }
                    }
                } else {
                    //恢复状态
                    allElements.get(i).setStyle('link.flow', true);
                    allElements.get(i).setStyle('link.flow.converse', false);
                    allElements.get(i).setStyle('link.pattern', [5, 5]);
                    allElements.get(i).setStyle('link.flow.color', 'black');
                    allElements.get(i).setStyle('link.color', '#BEBEBE');
                    allElements.get(i).setStyle('vector.outline.color', '#FFFFFF');
                    allElements.get(i).elStatus = "off";
                }
            }
        }
        function linkStatusColor(currentStatus) {
            switch (currentStatus) {
                case 'on' :
                case 'green' :
                    return "#008000";//#008000
                case 'orange' :
                    return  "#FFC125";//#FFC125
                case 'red' :
                    return  "#FF0000";//#ff0000
                default:
                    return  "#BEBEBE";
            }
        }

        function linkStatusStyle(currentStatus, el) {
            switch (currentStatus) {
                case '6' :
                    redLinkFlow(el);
                    return;
                case '5' :
                    orangeLinkFlow(el);
                    return;
                case '4' :
                    yellowLinkFlow(el);
                    return;
                case '3' :
                    blueLinkFlow(el);
                    return;
                case '2' :
                    greenLinkFlow(el);
                    return;
                default:
                    return;
            }
        }

        function greenLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', false);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', '#99cc66');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function blueLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', false);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', '#099ccc');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function yellowLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', false);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', '#f8c63d');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function orangeLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', false);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', '#ff9133');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function redLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', false);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', '#de4e43');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function toDecimal(x) {
            var f = parseFloat(x);
            f = f.toFixed(2);
            if (isNaN(f)) {
                return;
            }
            return f;
        }
    };

    //ToolBar
    Topology.prototype.zoomOut = function (rootScope) {
        if (this.network.getZoom() * 1.3 < 6) {
            this.network.setZoom(this.network.getZoom() * 1.3);
        }
        else
            rootScope.$alert("显示比例不能超过600%");
    };
    Topology.prototype.zoomIn = function (rootScope) {
        if (this.network.getZoom() / 1.3 > 0.1) {
            this.network.setZoom(this.network.getZoom() / 1.3);
        }
        else
            rootScope.$alert("显示比例不能低于10%");
    };
    Topology.prototype.zoomReset = function (event) {
        this.network.zoomReset();
    };
    Topology.prototype.selectAll = function (event) {
        this.elementBox.getSelectionModel().selectAll();
    };
    Topology.prototype.snapshot = function () {
        var canvas;
        if (this.network.getCanvasSize) {
            canvas = this.network.toCanvas(this.network.getCanvasSize().width, this.network.getCanvasSize().height);
        } else {
            var allElements = this.elementBox.getDatas();
            if (allElements.size() > 200){
                canvas = this.network.toCanvas(1024,1024);
            } else {
                canvas = this.network.toCanvas(this.network.getView().scrollWidth, this.network.getView().scrollHeight);
            }
        }
        if (twaver.Util.isIE) {
            var w = window.open();
            w.document.open();
            w.document.write("<img src='" + canvas.toDataURL() + "'/>");
            w.document.close();
        } else {
            window.open(canvas.toDataURL(), 'network.png');
        }
    };
    Topology.prototype.autoLayout = function (layout) {
        var autLayouter = new twaver.layout.AutoLayouter(this.elementBox);//网元自动排列
        autLayouter.doLayout(layout);
    };
    Topology.prototype.search = function (event, text, rootScope) {
        var allElements = this.elementBox.getDatas();
        var selections = [];
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).elType == "node") {
                if (allElements.get(i).displayName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                    selections.push(allElements.get(i));
                }
            }
        }
        if (selections.length == 0)
            rootScope.$alert("没有符合条件的资源！");
        else {
            this.elementBox.getSelectionModel().clearSelection();
            this.elementBox.getSelectionModel().setSelection(selections);
        }
    };


    TopoSimulation.Topology = Topology;
})();