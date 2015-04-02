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
        //添加监听
        this.network.setInteractions([
            new twaver.network.interaction.SelectInteraction(this.network),
            new twaver.network.interaction.MoveInteraction(this.network),
            new twaver.network.interaction.DefaultInteraction(this.network)
        ]);
        var topoView = document.getElementById('businessChartView');
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
        if (isMovable) {
            var allElements = this.elementBox.getDatas();
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).elType == "node") {
                    allElements.get(i).setClient("movable", false);
                    allElements.get(i).movable = false;
                }
            }
        }
    };

    //窗口变化
    Topology.prototype.windowsResize = function () {
//        console.log("窗口宽度" + window.innerWidth);
//        console.log("窗口高度" + window.innerHeight);
        var width = (window.innerWidth - 245) + 'px';
        var height;
        if (window.innerWidth >= 1348) {
            height = (window.innerHeight - 188) + 'px';
        } else {
            height = (window.innerHeight - 203) + 'px';
        }
        if (this.network != null) {
            this.network.getView().style.width = width;
            this.network.getView().style.height = height;
            //this.network.oldWidth = this.network.getView().style.width;//1642BUG
            //this.network.oldHeight = this.network.getView().style.height;//1642BUG
        }
    };

    //注册图片
    Topology.prototype.readyRegistImage = function (img) {
        registerImage("./img/topo/" + "kuang_" + img, this.network);

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

    Topology.prototype.getSelect = function () {
        return this.elementBox.getSelectionModel().getSelection();
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

    Topology.prototype.findDefaultElement = function (hangBits) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).getId() == hangBits) {
                allElements.get(i).setClient("isSelectable", true);
                return allElements.get(i);
            }
        }
        return null;
    };

    Topology.prototype.isSelectableDefaultElement = function (hangBits) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).getId() == hangBits) {
                allElements.get(i).setClient("isSelectable", false);
                return allElements.get(i);
            }
        }
        return null;
    };

    Topology.prototype.ifExitElement = function (item) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).elType == "node" && allElements.get(i).cId == item.id) {
                return true;
            }
        }
        return false;
    };

    Topology.prototype.findElement = function (item, Prefix) {
        var el = null;
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).getId() == (Prefix + item.id)) {
                if (allElements.get(i).elType == "node") {
                    this.readyRegistImage(item.img);
                    allElements.get(i).setImage(getImageName(item.img));
                    el = this.isSelectableDefaultElement(item.hangBits);
                } else if (allElements.get(i).elType == "link") {
                    if (null != item.style && item.style != "" && allElements.get(i).style != item.style) {
                        allElements.get(i).style = item.style;
                        allElements.get(i).setStyle('link.type', item.style);
                    }
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
            name = "kuang_" + name;
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


    //ToolBar
    Topology.prototype.selectAll = function (event) {
        this.elementBox.getSelectionModel().selectAll();
    };
    Topology.prototype.snapshot = function () {
        var canvas;
        if (this.network.getCanvasSize) {
            canvas = this.network.toCanvas(this.network.getCanvasSize().width, this.network.getCanvasSize().height);
        } else {
            var allElements = this.elementBox.getDatas();
            if (allElements.size() > 200) {
                canvas = this.network.toCanvas(1024, 1024);
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


    TopobusinessChart.Topology = Topology;
})();