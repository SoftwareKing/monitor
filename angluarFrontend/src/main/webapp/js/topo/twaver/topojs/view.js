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
        //this.readyRegistImages();
        this.registAlarmSeverity();
        //添加监听
        this.network.setInteractions([
            new twaver.network.interaction.SelectInteraction(this.network),
            new twaver.network.interaction.MoveInteraction(this.network),
            new twaver.network.interaction.MouseInteraction(this.network, scope, routeParams),
            new twaver.network.interaction.DefaultInteraction(this.network)
        ]);
        var topoView = document.getElementById('topoView');
        var width = (window.innerWidth - 245) + 'px';
        var height = (window.innerHeight - 188) + 'px';
        this.network.getView().style.width = width;
        this.network.getView().style.height = height;
        topoView.appendChild(this.network.getView());
        this.network.getInnerColor = function (node) {
            return node.getStyle('inner.color');
        }
        //this.network.setLinkFlowEnabled(true);
        this.network.bg = null;
        this.network.oldWidth = this.network.getView().style.width;
        this.network.oldHeight = this.network.getView().style.height;
        this.overview = new twaver.network.Overview();
        this.isEyeShow = false;
        this.createEyeDiv();
        //this.documentListener();
        this.network.setKeyboardRemoveEnabled(false);
        this.network.isSelectable = function (element) {
            if (element.getClient("isSelectable") == false) {
                return false;
            }
            return true;
        };
        this.network.setMovableFunction(function (element) {
            if (element.getClient("movable") == false) {
                return false;
            }
            return true;
        });
        this.image = null;
    };
    //FullScreen
    Topology.prototype.isFullScreenListener = function(hash){
        if (window.isTopoFullScreen != null && (window.isTopoFullScreen.split(",")[0] == "true" || window.isTopoFullScreen.split(",")[1] == "true") && hash.indexOf("gtopo") == -1 && hash.indexOf("biz") == -1){
            $(".system-nav").css("display", "");
            $("#nav-menu").css("display", "");
            $("#sys-breadcrumbs").css("display", "");
            $(".lr-content").css("top", "126px");
            $(".left-content").css("display", "");
            $(".right-content").css("margin-left", "210px");
            $(".mb20").css("display", "");
            $(".page-content").css("position", "");
            $(".page-content").css("left", "");
            $(".page-content").css("padding", "18px");
            $(".page-content").css("padding-bottom", "1px");
            $(".view-content").css({
                position: "relative"
            });
            topoCommon.topoMenuLayout = -80;
        } else if (window.isTopoFullScreen != null && (window.isTopoFullScreen.split(",")[0] == "true") && (hash.indexOf("biz") != -1)){
            $(".system-nav").css("display", "");
            $("#nav-menu").css("display", "");
            $("#sys-breadcrumbs").css("display", "");
            $(".lr-content").css("top", "126px");
            $(".left-content").css("display", "");
            $(".right-content").css("margin-left", "210px");
            $(".mb20").css("display", "");
            $(".page-content").css("position", "");
            $(".page-content").css("left", "");
            $(".page-content").css("padding", "18px");
            $(".page-content").css("padding-bottom", "1px");
            $(".view-content").css({
                position: "relative"
            });
            topoCommon.topoMenuLayout = -80;
        } else if (window.isTopoFullScreen != null && (window.isTopoFullScreen.split(",")[1] == "true") && (hash.indexOf("gtopo") != -1)){
            $(".system-nav").css("display", "");
            $("#nav-menu").css("display", "");
            $("#sys-breadcrumbs").css("display", "");
            $(".lr-content").css("top", "126px");
            $(".left-content").css("display", "");
            $(".right-content").css("margin-left", "210px");
            $(".mb20").css("display", "");
            $(".page-content").css("position", "");
            $(".page-content").css("left", "");
            $(".page-content").css("padding", "18px");
            $(".page-content").css("padding-bottom", "1px");
            $(".view-content").css({
                position: "relative"
            });
            topoCommon.topoMenuLayout = -80;
        } else if (window.isTopoFullScreen != null && (window.isTopoFullScreen.split(",")[0] == "true") && (hash.indexOf("gtopo") != -1)){
            window.fullScreenHash = hash;
            $(".system-nav").css("display", "none");
            $("#nav-menu").css("display", "none");
            $("#sys-breadcrumbs").css("display", "none");
            $(".lr-content").css("top", "0px");
            $(".left-content").css("display", "none");
            $(".right-content").css("margin-left", "0px");
            $(".mb20").css("display", "none");
            $(".page-content").css("position", "absolute");
            $(".page-content").css("left", "0px");
            $(".page-content").css("padding", "0px");
            $(".page-content").css("padding-bottom", "0px");
            $(".view-content").css({
                position: "inherit"
            });
        } else if (window.isTopoFullScreen != null && (window.isTopoFullScreen.split(",")[1] == "true") && (hash.indexOf("biz") != -1)){
            window.fullScreenHash = hash;
            $(".system-nav").css("display", "none");
            $("#nav-menu").css("display", "none");
            $("#sys-breadcrumbs").css("display", "none");
            $(".lr-content").css("top", "0px");
            $(".left-content").css("display", "none");
            $(".right-content").css("margin-left", "0px");
            $(".mb20").css("display", "none");
            $(".page-content").css("position", "absolute");
            $(".page-content").css("left", "0px");
            $(".page-content").css("padding", "0px");
            $(".page-content").css("padding-bottom", "0px");
            $(".view-content").css({
                position: "inherit"
            });
        }
    };
    //FullScreen
    Topology.prototype.historyBack = function () {
        $(".system-nav").css("display", "none");
        $("#nav-menu").css("display", "none");
        $("#sys-breadcrumbs").css("display", "none");
        $(".lr-content").css("top", "0px");
        $(".left-content").css("display", "none");
        $(".right-content").css("margin-left", "0px");
        $(".mb20").css("display", "none");
        $(".page-content").css("position", "absolute");
        $(".page-content").css("left", "0px");
        $(".page-content").css("padding", "0px");
        $(".page-content").css("padding-bottom", "0px");
        $(".view-content").css({
            position: "inherit"
        });
        topoCommon.topoMenuLayout = 10;
        var width = (window.innerWidth - 5) + 'px';
        var height = window.innerHeight + 'px';
        this.network.getView().style.width = width;
        this.network.getView().style.height = height;
    };

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
//1642BUG
//    Topology.prototype.reNetworkHeight = function (scrollTop) {
//        console.log("Network高度" + this.network.getView().style.height);
//        var width = this.network.getView().style.width;
//        var height = this.network.oldHeight;
//        height = Number(height.replace("px", '')) + Number(scrollTop);
//        if (this.network != null) {
//            this.network.getView().style.width = width;
//            this.network.getView().style.height = height + 'px';
//        }
//    };

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
    //FullScreen
    Topology.prototype.documentListener = function () {
        document.addEventListener('webkitfullscreenchange', function (e) {
            documentListenerProcess(document);
        }, true);
        document.addEventListener('fullscreenchange', function (e) {
            documentListenerProcess(document);
        }, true);
        document.addEventListener('mozfullscreenchange', function (e) {
            documentListenerProcess(document);
        }, true);
        function documentListenerProcess(document) {
            if (document.webkitIsFullScreen || document.fullScreen || document.mozFullScreen || document.fullscreen) {
                $(".system-nav").css("display", "none");
                $("#nav-menu").css("display", "none");
                $("#sys-breadcrumbs").css("display", "none");
                $(".lr-content").css("top", "0px");
                $(".left-content").css("display", "none");
                $(".right-content").css("margin-left", "0px");
                $(".mb20").css("display", "none");
                $(".page-content").css("position", "absolute");
                $(".page-content").css("left", "0px");
                $(".page-content").css("padding", "0px");
                $(".page-content").css("padding-bottom", "0px");
                $(".view-content").css({
                    position: "inherit"
                });
                topoCommon.topoMenuLayout = 10;
                var width = ($('#topoView').width() - 5) + 'px';
                var height = window.innerHeight + 'px';
                document.twaverNetworkView.style.width = width;
                document.twaverNetworkView.style.height = height;
            } else {
                $(".system-nav").css("display", "");
                $("#nav-menu").css("display", "");
                $("#sys-breadcrumbs").css("display", "");
                $(".lr-content").css("top", "126px");
                $(".left-content").css("display", "");
                $(".right-content").css("margin-left", "210px");
                $(".mb20").css("display", "");
                $(".page-content").css("position", "");
                $(".page-content").css("left", "");
                $(".page-content").css("padding", "18px");
                $(".page-content").css("padding-bottom", "1px");
                $(".view-content").css({
                    position: "relative"
                });
                topoCommon.topoMenuLayout = -80;
                document.twaverNetworkView.style.width = document.twaverNetworkViewOldWidth;
                document.twaverNetworkView.style.height = document.twaverNetworkViewOldHeight;
            }
        }
    }


    Topology.prototype.getNetworkViewBackground = function () {
        if (this.network.getView().style.background != null && this.network.getView().style.background != "") {
            return true;
        }
        return false;
    };

    Topology.prototype.setBg = function (bg) {
        try {
            if (this.network.bg != bg.img) {
                if (bg.img != null && bg.img != "") {
                    if (this.image != null) {
                        this.network.getBottomDiv().removeChild(this.image);
                    }
                    this.image = new Image();
                    this.image.src = "./img/topo/" + bg.img;
                    this.image.onload = function () {
                        this._viewRect = { x: bg.imgLocation.split(" ")[0].replace("px", ''), y: bg.imgLocation.split(" ")[1].replace("px", ''), width: this.width, height: this.height };
                        this.onload = null;
                    };
                    this.network.getBottomDiv().appendChild(this.image);
                    this.image.style.top = bg.imgLocation.split(" ")[1];
                    this.image.style.left = bg.imgLocation.split(" ")[0];
                    this.image.style.position = "relative";
                } else {
                    this.network.getBottomDiv().removeChild(this.image);
                    this.image = null;
                }
            } else {
                if (bg.img != null && bg.img != "") {
                    if (this.network.bgLocation != bg.imgLocation) {
                        this.network.getBottomDiv().removeChild(this.image);
                        this.image = new Image();
                        this.image.src = "./img/topo/" + bg.img;
                        this.image.onload = function () {
                            this._viewRect = { x: bg.imgLocation.split(" ")[0].replace("px", ''), y: bg.imgLocation.split(" ")[1].replace("px", ''), width: this.width, height: this.height };
                            this.onload = null;
                        };
                        this.network.getBottomDiv().appendChild(this.image);
                        this.image.style.top = bg.imgLocation.split(" ")[1];
                        this.image.style.left = bg.imgLocation.split(" ")[0];
                        this.image.style.position = "relative";
                    }
                }
            }
            this.network.bg = bg.img;
            this.network.srcbg = bg.imgPath;
            this.network.bgLocation = bg.imgLocation;
        }
        catch (err) {
            //Ignore
        }
    };

    Topology.prototype.getBg = function () {
        return this.network.srcbg;
    };

    Topology.prototype.getBgLocation = function () {
        return this.network.bgLocation;
    };

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

    Topology.prototype.readyRegistImages = function () {
        var images = ["windows.png", "linux.png", "aircondition.png", "aix.png", "apply_green.png", "apply_off.png",
            "apply_on.png", "apply_orange.png", "apply_red.png", "battery.png", "business_green.png", "business_off.png", "business_on.png", "business_orange.png",
            "business_red.png", "centralization.png", "database_green.png", "database_off.png", "database_on.png", "database_orange.png", "database_red.png",
            "db2.png", "default.png", "dhcp.png", "diskarray.png", "dns.png", "fcswitch.png", "ftp.png", "hba.png", "host_green.png", "host_off.png", "host_on.png",
            "host_orange.png", "host_red.png", "hpux.png", "http.png", "humiture.png", "ids_green.png", "ids_off.png", "ids_on.png", "ids_orange.png",
            "ids_red.png", "if_gd_red.png", "iis.png", "informix.png", "jf_gd_green.png", "jf_gd_off.png", "jf_gd_on.png", "jf_gd_orange.png", "jf_kt_green.png", "jf_kt_off.png",
            "jf_kt_on.png", "jf_kt_orange.png", "jf_kt_red.png", "jf_ls_green.png", "jf_ls_off.png", "jf_ls_on.png", "jf_ls_orange.png", "jf_ls_red.png", "jf_ups_green.png",
            "jf_ups_off.png", "jf_ups_on.png", "jf_ups_orange.png", "jf_ups_red.png", "jf_wsd_green.png", "jf_wsd_off.png",
            "jf_wsd_on.png", "jf_wsd_orange.png", "jf_wsd_red.png", "jf_xdc_green.png", "jf_xdc_off.png", "jf_xdc_on.png", "jf_xdc_orange.png", "jf_xdc_red.png",
            "jf_yj_green.png", "jf_yj_off.png", "jf_yj_on.png", "jf_yj_orange.png", "jf_yj_red.png", "lb_green.png", "lb_off.png", "lb_on.png",
            "lb_orange.png", "lb_red.png", "ldap.png", "leaking.png", "linux.png", "loadbalancing.png", "monitor_green.png",
            "monitor_off.png", "monitor_on.png", "monitor_orange.png", "monitor_red.png", "mouse.png", "mouse_disabled.png", "mq.png",
            "mssql.png", "mw_green.png", "mw_off.png", "mw_on.png", "mw_orange.png", "mw_red.png", "mysql.png", "network_green.png", "network_off.png",
            "network_on.png", "network_orange.png", "network_red.png", "networkinvoice.png", "oil.png", "onecluster.png", "onedatastore.png", "onehost.png",
            "oneimage.png", "onetemplate.png", "onevm.png", "onevnet.png", "oracle.png",
            "photoelectric.png", "pop3.png", "room.png", "router.png", "router_green.png", "router_off.png", "router_on.png", "router_orange.png",
            "router_red.png", "security.png", "security_green.png", "security_off.png", "security_on.png",
            "security_orange.png", "security_red.png", "select.png", "select_disabled.png", "service_green.png", "service_off.png",
            "service_on.png", "service_orange.png", "service_red.png", "smallmachine_green.png", "smallmachine_off.png", "smallmachine_on.png",
            "smallmachine_orange.png", "smallmachine_red.png", "smtp.png", "solaris.png", "storage_green.png", "storage_off.png", "storage_on.png",
            "storage_orange.png", "storage_red.png", "switch2.png", "switch3.png", "switch3_green.png", "switch3_off.png", "switch3_on.png", "switch3_orange.png",
            "switch3_red.png", "sybase.png", "tapearray.png", "taxservice.png", "ups.png", "weblogic.png", "websphere.png", "windows.png", "workplatform.png"
        ]

        for (var i = 0; i < images.length; i++)
            registerImage("./img/topo/" + images[i], this.network);

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

    Topology.prototype.locationChange = function (el) {
        if (el.property == 'location') {
            if (!topoCommon.locationChange)
                topoCommon.locationChange = {};
            topoCommon.locationChange[el.source.getId()] = el.newValue;
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
                            allElements.get(i).setSize(32, 32);
                            allElements.get(i).size = "32,32";
                        }
                    }
                    if (allElements.get(i).type != "dummy") {
                        if (null != item.customName && item.customName != "") {
                            allElements.get(i).setName(item.customName);
                        } else if (null != item.name && item.name != "") {
                            allElements.get(i).setName(item.name);
                        }
                    } else {
                        if (null != item.customName && item.customName != "") {
                            allElements.get(i).setName(item.customName);
                        } else {
                            allElements.get(i).setName(item.name);
                        }
                    }
                    allElements.get(i).customName = item.customName;
                    allElements.get(i).elImgPath = item.imgPath;
                    allElements.get(i).drillId = item.drillId;
                    allElements.get(i).drillName = item.drillName;
                    if (item.isSelect != allElements.get(i).isSelect) {
                        if (item.isSelect == "true") {
                            allElements.get(i).setClient("isSelectable", false);
                            allElements.get(i).isSelect = item.isSelect;
                        } else if (item.isSelect == null || item.isSelect == "false") {
                            allElements.get(i).setClient("isSelectable", true);
                            allElements.get(i).isSelect = item.isSelect;
                        }
                    }
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
                            allElements.get(i).setStyle('link.flow.converse', true);
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
                    allElements.get(i).sampleLeft = item.sampleLeft;
                    allElements.get(i).customName = item.customName;
                    allElements.get(i).displayName = item.displayName;
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

    Topology.prototype.getAllElementList = function () {
        return this.elementBox.getDatas();
    };

    Topology.prototype.refreshAlarm = function (currentAlarms) {
        var allElements = this.elementBox.getDatas();
        for (var i = 0; i < allElements.size(); i++) {
            if (allElements.get(i).elType == "node") {
                var isAlarm = "false";
                for (var j = 0; j < currentAlarms.length; j++) {
                    if (allElements.get(i).cId == currentAlarms[j].moId) {
                        if (allElements.get(i).elAlarmLevel != currentAlarms[j].level || allElements.get(i).elAlarmCount != currentAlarms[j].count) {
                            allElements.get(i).getAlarmState().clear();
                            allElements.get(i).getAlarmState().setNewAlarmCount(alarmLevelColor(currentAlarms[j].level), currentAlarms[j].count);
                            allElements.get(i).elAlarmLevel = currentAlarms[j].level;
                            allElements.get(i).elAlarmCount = currentAlarms[j].count;
                            //console.log("有告警" + " " + allElements.get(i).getId() + " " + currentAlarms[j].level + currentAlarms[j].count + new Date().toLocaleString());
                        }
                        //console.log("告警过路" + " " + allElements.get(i).getId() + " " + new Date().toLocaleString());
                        isAlarm = "true";
                    }
                }
                if (isAlarm == "false") {
                    allElements.get(i).getAlarmState().clear();
                }
            }
        }
        function alarmLevelColor(level) {
            switch (level) {
                case 2 :
                    return  twaver.AlarmSeverity.PROMPT;
                case 3 :
                    return  twaver.AlarmSeverity.LOW;
                case 4 :
                    return  twaver.AlarmSeverity.MIDDLE;
                case 5 :
                    return  twaver.AlarmSeverity.HIGH;
                case 6 :
                    return  twaver.AlarmSeverity.URGENT;
                default:
                    return  twaver.AlarmSeverity.PROMPT;
            }
        }
    };

    Topology.prototype.refreshNodeStatus = function (currentNodeStatus) {
        var allElements = this.elementBox.getDatas();
        for (var j = 0; j < currentNodeStatus.length; j++) {
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).elType == "node" && allElements.get(i).getId().substring(2, allElements.get(i).getId().length) == currentNodeStatus[j].id) {
                    if (currentNodeStatus[j].currentStatus != allElements.get(i).elStatus) {
                        //console.log("刷新图元状态：新" + currentNodeStatus[j].currentStatus + new Date().toLocaleString());
                        //console.log("刷新图元状态：旧" + allElements.get(i).elStatus + new Date().toLocaleString());
                        if (currentNodeStatus[j].currentStatus != "off") {
                            //allElements.get(i).setStyle('inner.color', nodeStatusColor(currentNodeStatus[j].currentStatus));
                            allElements.get(i).setStyle('body.type', 'default.vector');
                            allElements.get(i).setStyle('vector.shape', 'circle');
                            allElements.get(i).setStyle('vector.deep', '3');
                            allElements.get(i).setStyle('vector.gradient', 'radial.center');
                            allElements.get(i).setStyle('vector.gradient.color', nodeStatusGradientColor(currentNodeStatus[j].currentStatus));
                            allElements.get(i).setStyle('vector.padding', 12);
                            allElements.get(i).setStyle('vector.fill', true);
                            allElements.get(i).setStyle('vector.fill.color', nodeStatusFillColor(currentNodeStatus[j].currentStatus));
                            allElements.get(i).elStatus = currentNodeStatus[j].currentStatus;
                            allElements.get(i).refreshThreshold = 0;
                            //console.log("刷新图元状态：颜色色号" + nodeStatusColor(currentNodeStatus[j].currentStatus) + new Date().toLocaleString());
                        } else {
                            if (allElements.get(i).refreshThreshold >= topoCommon.UpPoints){
                                console.log(allElements.get(i).getId() + "图元补点（已达阀值）：阀值" + allElements.get(i).refreshThreshold);
                                //allElements.get(i).setStyle('inner.color');
                                allElements.get(i).setStyle('body.type', 'default');
                                allElements.get(i).elStatus = currentNodeStatus[j].currentStatus;
                                allElements.get(i).refreshThreshold = 0;
                            } else {
                                allElements.get(i).refreshThreshold = allElements.get(i).refreshThreshold + 1;
                                console.log(allElements.get(i).getId() + "图元补点（未达阀值）：阀值" + allElements.get(i).refreshThreshold);
                            }
                        }
                    } else {
                        allElements.get(i).refreshThreshold = 0;
                    }
                }
            }
        }
        function nodeStatusGradientColor(currentStatus) {
            switch (currentStatus) {
                case 'on' :
                case 'green' :
                    return "rgba(0, 139, 0, 1)";
                case 'orange' :
                    return  "rgba(139, 90, 0, 1)";
                case 'red' :
                    return  "rgba(139, 0, 0, 1)";
                default:
                    return  "rgba(255, 255, 255, 1)";
            }
        }

        function nodeStatusFillColor(currentStatus) {
            switch (currentStatus) {
                case 'on' :
                case 'green' :
                    return "rgba(0,255,0,0.2)";
                case 'orange' :
                    return  "rgba(255,165,0,0.2)";
                case 'red' :
                    return  "rgba(255,0,0,0.2)";
                default:
                    return  "rgba(255, 255, 255, 1)";
            }
        }

    };

    Topology.prototype.refreshLinkStatus = function (currentLinkStatus) {
        var allElements = this.elementBox.getDatas();
        for (var j = 0; j < currentLinkStatus.length; j++) {
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).elType == "link" && allElements.get(i).getId().substring(2, allElements.get(i).getId().length) == currentLinkStatus[j].id) {
                    if (currentLinkStatus[j].currentStatus != allElements.get(i).elStatus) {
                        //console.log("刷新线路状态：新" + currentLinkStatus[j].currentStatus + new Date().toLocaleString());
                        //console.log("刷新线路状态：旧" + allElements.get(i).elStatus + new Date().toLocaleString());
                        if (currentLinkStatus[j].currentStatus != "off") {
                            allElements.get(i).setStyle('link.color', linkStatusColor(currentLinkStatus[j].currentStatus));
                            //console.log("刷新线路状态：颜色色号" + linkStatusColor(currentLinkStatus[j].currentStatus) + new Date().toLocaleString());
                            allElements.get(i).elStatus = currentLinkStatus[j].currentStatus;
                            allElements.get(i).refreshThreshold = 0;
                        } else {
                            if (allElements.get(i).refreshThreshold >= topoCommon.UpPoints){
                                console.log(allElements.get(i).getId() + "图元补点（已达阀值）：阀值" + allElements.get(i).refreshThreshold);
                                allElements.get(i).setStyle('link.color',"#BEBEBE");
                                allElements.get(i).elStatus = currentLinkStatus[j].currentStatus;
                                allElements.get(i).refreshThreshold = 0;
                            } else {
                                allElements.get(i).refreshThreshold = allElements.get(i).refreshThreshold + 1;
                                console.log(allElements.get(i).getId() + "图元补点（未达阀值）：阀值" + allElements.get(i).refreshThreshold);
                            }
                        }
                    } else {
                        allElements.get(i).refreshThreshold = 0;
                    }
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
                case 'on' :
                case 'green' :
                    greenLinkFlow(el);
                    return;
                case 'orange' :
                    orangeLinkFlow(el);
                    return;
                case 'red' :
                    redLinkFlow(el);
                    return;
                default:
                    return;
            }
        }

        function greenLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', true);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', 'green');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function orangeLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', true);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', 'orange');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }

        function redLinkFlow(el) {
            el.setStyle('link.flow', true);
            el.setStyle('link.flow.converse', true);
            el.setStyle('link.pattern', [5, 5]);
            el.setStyle('link.flow.color', 'red');
            el.setStyle('link.color', '#D3D3D3');
            el.setStyle('vector.outline.color', '#FFFFFF');
        }
    };

    Topology.prototype.updateElementMirroring = function (nodeList, mirroringValue) {
        var allElements = this.elementBox.getDatas();
        for (var j = 0; j < nodeList.length; j++) {
            for (var i = 0; i < allElements.size(); i++) {
                if (allElements.get(i).getId() == ("n_" + nodeList[j].id)) {
                    allElements.get(i).mirroring = mirroringValue;
                    break;
                }
            }
        }
    };
    //ToolBar
    Topology.prototype.select = function (event) {
        if (twaver.Util.isTouchable) {
            this.network.setTouchInteractions();
        } else {
            this.network.setDefaultInteractions();
        }
    };
    Topology.prototype.magnify = function (event) {
        this.network.setMagnifyInteractions();
    };
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
    Topology.prototype.zoomOverview = function (event) {
        this.network.zoomOverview();
    };
    //FullScreen
    Topology.prototype.fullScreenButton = function (topoClassify) {
        this.network.oldWidth = this.network.getView().style.width;
        this.network.oldHeight = this.network.getView().style.height;
        $(".system-nav").css("display", "none");
        $("#nav-menu").css("display", "none");
        $("#sys-breadcrumbs").css("display", "none");
        $(".lr-content").css("top", "0px");
        $(".left-content").css("display", "none");
        $(".right-content").css("margin-left", "0px");
        $(".mb20").css("display", "none");
        $(".page-content").css("position", "absolute");
        $(".page-content").css("left", "0px");
        $(".page-content").css("padding", "0px");
        $(".page-content").css("padding-bottom", "0px");
        $(".view-content").css({
            position: "inherit"
        });
        topoCommon.topoMenuLayout = 10;
        //var WsShell = new ActiveXObject('WScript.Shell')
        //WsShell.SendKeys('{F11}');
//        var rightPage = document.getElementsByClassName("page-content");
//        rightPage[0].className += " fullScreenClass";
        var width = (window.innerWidth - 5) + 'px';
        var height = window.innerHeight + 'px';
//        console.log(window.outerHeight);
//        console.log(window.innerHeight);
        this.network.getView().style.width = width;
        this.network.getView().style.height = height;
        if (topoClassify == 0){
            window.isTopoFullScreen = "true,-1";
        } else if (topoClassify == 1) {
            window.isTopoFullScreen = "-1,true";
        }
    };
    //FullScreen
    Topology.prototype.reFullScreenButton = function () {
        $(".system-nav").css("display", "");
        $("#nav-menu").css("display", "");
        $("#sys-breadcrumbs").css("display", "");
        $(".lr-content").css("top", "126px");
        $(".left-content").css("display", "");
        $(".right-content").css("margin-left", "210px");
        $(".mb20").css("display", "");
        $(".page-content").css("position", "");
        $(".page-content").css("left", "");
        $(".page-content").css("padding", "18px");
        $(".page-content").css("padding-bottom", "1px");
        $(".view-content").css({
            position: "relative"
        });
        topoCommon.topoMenuLayout = -80;
//        var rightPage = document.getElementsByClassName("page-content");
//        rightPage[0].className = rightPage[0].className.replace("fullScreenClass", '');
        //console.log(this.network.oldWidth);
        //console.log(this.network.oldHeight);
        this.network.getView().style.width = this.network.oldWidth;
        this.network.getView().style.height = this.network.oldHeight;
        window.isTopoFullScreen = null;
        window.fullScreenHash = null;
    };

    Topology.prototype.fullScreenButtonHtml5 = function (event) {
        if (document.webkitIsFullScreen || document.fullScreen || document.mozFullScreen || document.fullscreen) {
        }
        else {
            document.twaverNetwork = this.network;
            document.twaverNetworkView = this.network.getView();
            document.twaverNetworkViewOldWidth = this.network.getView().style.width;
            document.twaverNetworkViewOldHeight = this.network.getView().style.height;
            this.runPrefixMethod(document.documentElement, "RequestFullScreen");
        }
    };

    Topology.prototype.runPrefixMethod = function (element, method) {
        var usablePrefixMethod;
        ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
            if (usablePrefixMethod) return;
            if (prefix === "") {
                // 无前缀，方法首字母小写
                method = method.slice(0, 1).toLowerCase() + method.slice(1);

            }
            var typePrefixMethod = typeof element[prefix + method];
            if (typePrefixMethod + "" !== "undefined") {
                if (typePrefixMethod === "function") {
                    usablePrefixMethod = element[prefix + method]();
                } else {
                    usablePrefixMethod = element[prefix + method];
                }
            }
        });
        return usablePrefixMethod;
    };


    Topology.prototype.selectAll = function (event) {
        this.elementBox.getSelectionModel().selectAll();
    };
    Topology.prototype.saveXml = function (event) {
        var box = this.network.getElementBox();
        var text = new twaver.XmlSerializer(box).serialize();
        if (twaver.Util.isIE) {
            /*
             var iframe = document.createElement('iframe');
             iframe.style.display = 'none';
             iframe.document.body = text;
             document.appendChild(iframe);
             iframe.document.execCommand("SaveAs");
             */
            var iframe = document.createElement('iframe');
            document.body.insertBefore(iframe);
            iframe.style.display = 'none';
            iframe.contentDocument.write(text);
            iframe.contentDocument.execCommand('SaveAs', true, 'file.xml');
            document.body.removeChild(iframe);
        } else {
            var uriContent = "data:text/xml," + encodeURIComponent(text);
            window.open(uriContent, 'network');
        }
//        box.clear();
//        new twaver.XmlSerializer(box).deserialize(text);
//
//        text = new twaver.JsonSerializer(box).serialize();
//        box.clear();
//        new twaver.JsonSerializer(box).deserialize(text);
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


    Topo.Topology = Topology;
})();