twaver.network.interaction.MouseInteractionSimulation = function (n, s, r) {
    this.scope = s;
    this.routeParams = r;
    twaver.network.interaction.MouseInteractionSimulation.superClass.constructor.call(this, n);
};

twaver.Util.ext("twaver.network.interaction.MouseInteractionSimulation", twaver.network.interaction.BaseInteraction, {
    cache: {},
    setUp: function () {
        this.addListener("mousemove", "mouseup", "mousedown", "dblclick");
    },
    tearDown: function () {
        this.removeListener("mousemove", "mouseup", "mousedown", "dblclick"),
            this.end();
    },
    handle_mousemove: function (e) {
        twaver.network.MouseManagerSimulation.MonitorMousemove(this.network, e);
    },
    handle_mouseup: function (e) {
        twaver.network.MouseManagerSimulation.MonitorMouseup(this.network, e);
    },
    handle_mousedown: function (e) {
        twaver.network.MouseManagerSimulation.MonitorMousedown(this.network, e);
    },
    handle_dblclick: function (e) {
        twaver.network.MouseManagerSimulation.Monitordblclick(this.network, this.scope, this.routeParams, e);
    },
    end: function () {
        twaver.network.MouseManagerSimulation.reset();
    }
});

twaver.network.MouseManagerSimulation = {
    tipShow: false,
    linkTipShow: false,
    collection: new twaver.List(),
    MonitorMouseup: function (network, event) {
        var el = network.getElementAt(event);
        if ((el instanceof twaver.Node)) {
            if (event.button == 2 && el.type != "dummy") {
                this.cleanMenu();
            } else if (event.button == 0) {
                this.cleanMenu();
            }
        } else if (el instanceof twaver.Link) {
            if (event.button == 2 && el.classify == 0) {
                this.cleanMenu();
            } else if (event.button == 0) {}
        }
    },
    MonitorMousemove: function (network, event) {
        var el = network.getElementAt(event);
        if ((el instanceof twaver.Node)) {
            if (!this.tipShow) {
                this.tipShow = true;
                this.linkTipShow = false;
                this.cleanMenu();
                this.nodeMousemoveListening(el);
                return;
            }
        } else if (el instanceof twaver.Link) {
            this.cleanMenu();
            this.tipShow = false;
            this.linkTipShow = false;
        } else {
            this.cleanMenu();
            this.tipShow = false;
            this.linkTipShow = false;
        }
    },
    MonitorMousedown: function (network, event) {
        var el = network.getElementAt(event);
        if (event.button == 0) {
            this.cleanMenu();
        } else if (event.button == 2) {
            this.cleanMenu();
        }
    },
    Monitordblclick: function (network, scope, routeParams, event) {
        this.cleanMenu();
    },
    nodeMousemoveListening: function (el) {
        if (simulationCommon.simulationViewMenuData != null && simulationCommon.simulationViewMenuData.length > 0){
            var ifShow = false;
            for (var i = 0; i < simulationCommon.simulationViewMenuData.length; i++) {
                if (simulationCommon.simulationViewMenuData[i].elementId == el._id.substring(2, el._id.length)){
                    ifShow = true;
                    break;
                }
            }

            if (el.type != "dummy" && ifShow) {
                if (el.classify == "host") {

                } else if (el.classify == "network") {

                } else if (el.classify == "storage") {

                } else if (el.classify == "database") {

                } else if (el.classify == "middleware") {

                } else if (el.classify == "service") {

                } else if (el.classify == "link") {

                } else if (el.classify == "environment") {

                } else if (el.type == "application") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "windows") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "linux") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "hpux") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "aix") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "solaris") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "switch2") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "switch3") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "router") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "loadbalancing") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "security") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "fcswitch") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "diskarray") {
                    this.nodeMousemoveListeningFilling(el);
                }
                else if (el.classify == "tapearray") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "vtl") {
                    this.nodeMousemoveListeningFilling(el);
                }
                else if (el.classify == "mssql") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "sybase") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "oracle") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "mq") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "weblogic") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "iis") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "http") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "elink") {

                } else if (el.classify == "room") {

                } else if (el.classify == "humiture") {

                } else if (el.classify == "leaking") {

                } else if (el.classify == "ups") {

                } else if (el.classify == "aircondition") {

                } else if (el.classify == "centralization") {
                    //type
                } else if (el.classify == "taxservice") {
                    //type
                } else if (el.classify == "workplatform") {
                    //type
                } else if (el.classify == "networkinvoice") {
                    //type
                } else if (el.classify == "electricsupply") {

                } else if (el.classify == "upsswitch") {

                } else if (el.classify == "newfan") {

                } else if (el.classify == "fire") {

                } else if (el.classify == "weblogiccluster") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "oraclerac") {
                    this.nodeMousemoveListeningFilling(el);
                } else if (el.classify == "aimosheng") {

                } else if (el.classify == "voltameter") {

                } else if (el.classify == "apache") {
                    this.nodeMousemoveListeningFilling(el);
                }
            }
        }

    },
    nodeMousemoveListeningFilling: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDiv(el);
                this.mouseOverEachElementAddFilling(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementAddFilling(el.getStyle('component.content'), el);
            }
            el.setStyle('component.fillcolor', 'rgba(233,241,254,1.0)');
            el.setStyle('component.position', 'bottomleft.bottomleft');
            el.setStyle('component.direction', 'belowleft');
            var elWidth = 260;
            var elHeight = 400;
            if (el._location.x <= elWidth) {
                el.setStyle('component.position', 'bottomright.bottomright');
                el.setStyle('component.direction', 'belowright');
            }
            el.setStyle('component.pointer.length', 10);
            el.setStyle('component.pointer.width', 20);
            el.setStyle("component.visible", true);
            this.collection.add(el);
        }
    },
    reset: function () {
        this.tipShow = false;
        this.linkTipShow = false;
    },
    mouseOverEachElementAddFilling: function (rootElement, el) {
        var sb = "";
        sb += "<ul id=\"tipSimulationNodeTwaver\">";
        var j = 0, e = 0,f = 0;
//        for (var i = 0; i < simulationCommon.simulationViewMenuData.length; i++) {
//            if (simulationCommon.simulationViewMenuData[i].elementId == el._id.substring(2, el._id.length) && simulationCommon.simulationViewMenuData[i].projectPerformance == "SimulationTest") {
//                if (j == 0){
//                    sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>仿真</div></a></li>";
//                    if (null != simulationCommon.simulationViewMenuData[i].value && simulationCommon.simulationViewMenuData[i].value != "") {
//                        sb += "<li><a title=\"" + titleStatusName(simulationCommon.simulationViewMenuData[i].value) +"\" href=\"javascript:void(0)\"><div class=\"tip-lable\" >可用性:</div><div class=\" " + statusName(simulationCommon.simulationViewMenuData[i].value) + " \"></div></a></li>";
//                    }
//                } else {
//                    if (null != simulationCommon.simulationViewMenuData[i].value && simulationCommon.simulationViewMenuData[i].value != "") {
//                        sb += "<li><a title=\"" + titleStatusName(simulationCommon.simulationViewMenuData[i].value) +"\" href=\"javascript:void(0)\"><div class=\"tip-lable\" >可用性:</div><div class=\" " + statusName(simulationCommon.simulationViewMenuData[i].value) + " \"></div></a></li>";
//                    }
//                }
//                j++;
//            }
//        }
        for (var i = 0; i < simulationCommon.simulationViewMenuData.length; i++) {
            if (simulationCommon.simulationViewMenuData[i].elementId == el._id.substring(2, el._id.length) && simulationCommon.simulationViewMenuData[i].projectPerformance == "Alarm") {
                if (e == 0){
                    sb += "<li style='margin-top: 10px'><a href=\"javascript:void(0)\"><div class='tip_line'>影响告警</div></a></li>";
                    //sb += "<li><a title=\"" + simulationCommon.simulationViewMenuData[i].value.substring(2, simulationCommon.simulationViewMenuData[i].value.length)  + "\" href=\"javascript:void(0)\"><div class=\"tip-lable\">" + alarmLevelName(simulationCommon.simulationViewMenuData[i].value.substring(0,1)) + "</div><div class=\"tip-content\">" + simulationCommon.simulationViewMenuData[i].value.substring(2, simulationCommon.simulationViewMenuData[i].value.length) + "</div></a></li>";
                    sb += "<li><a title=\"" + simulationCommon.simulationViewMenuData[i].value  + "\" href=\"javascript:void(0)\"><div class=\"tip-lable-alarm\"></div><div class=\"tip-content-alarm\">" + simulationCommon.simulationViewMenuData[i].value + "</div></a></li>";
                } else {
                    //sb += "<li><a title=\"" + simulationCommon.simulationViewMenuData[i].value.substring(2, simulationCommon.simulationViewMenuData[i].value.length)  + "\" href=\"javascript:void(0)\"><div class=\"tip-lable\">" + alarmLevelName(simulationCommon.simulationViewMenuData[i].value.substring(0,1)) + "</div><div class=\"tip-content\">" + simulationCommon.simulationViewMenuData[i].value.substring(2, simulationCommon.simulationViewMenuData[i].value.length) + "</div></a></li>";
                    sb += "<li><a title=\"" + simulationCommon.simulationViewMenuData[i].value  + "\" href=\"javascript:void(0)\"><div class=\"tip-lable-alarm\"></div><div class=\"tip-content-alarm\">" + simulationCommon.simulationViewMenuData[i].value + "</div></a></li>";
                }
                e++;
            }
        }
        var affectValue = -1;
        for (var i = 0; i < simulationCommon.simulationViewMenuData.length; i++) {
            if (simulationCommon.simulationViewMenuData[i].elementId == el._id.substring(2, el._id.length) && simulationCommon.simulationViewMenuData[i].projectPerformance == "Affect") {
                if (simulationCommon.simulationViewMenuData[i].value > affectValue){
                    affectValue = simulationCommon.simulationViewMenuData[i].value;
                }
            }
        }
        if (affectValue > -1){
            sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>影响度</div></a></li>";
            sb += "<li style='margin-top: -10px'><a href=\"javascript:void(0)\" style='display: inline-block'>";
            sb += "<div class=\"tip-lable-5\">" + "影响(%)" + ":</div>";
            sb += "</a>";
            sb += "<div style='display: inline-block; width:160px; height: 20px'>";
            sb += '<div class="bar-label">' + toDecimal(affectValue) + "%" + '</div>';
            sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
            sb += "<div style=\"width: " + affectValue + "%;background:" + getBackground(affectValue,el) +";\">";
            sb += "</div>";
            sb += "</div></div>";
            sb += "</div>";
            sb += "</li>";
        }
        sb += "</ul>";
        rootElement.innerHTML = sb;

        function statusName(level) {
            switch (level) {
                case "0" :
                    return  " fa fa-minus-circle status-icon statusOff";
                case "1" :
                    return  " fa fa-check-circle status-icon statusOn";
                default:
                    return  " fa fa-circle status-icon statuNull";
            }
        }
        function titleStatusName(level) {
            switch (level) {
                case "0" :
                    return  "不可达";
                case "1" :
                    return  "正常";
                default:
                    return  "未取到值";
            }
        }
        function alarmLevelName(level) {
            switch (level) {
                case 2 :
                    return  "<img src=\"img/alarm/2.png\">";
                case 3 :
                    return  "<img src=\"img/alarm/3.png\">";
                case 4 :
                    return  "<img src=\"img/alarm/4.png\">";
                case 5 :
                    return  "<img src=\"img/alarm/5.png\">";
                case 6 :
                    return  "<img src=\"img/alarm/6.png\">";
                default:
                    return  "--";
            }
        }
        function getBackground(value, el) {
            if (parseFloat(value) < parseFloat(50)) {
                return "#0fa460";//grown低等级
            } else if ((parseFloat(value) >= parseFloat(50)) && (parseFloat(value) <= parseFloat(80))) {
                return "#f8c63d";//yellow
            } else if (parseFloat(value) > parseFloat(80)) {
                return "#de4e43";//red
            }
            return "#BEBEBE";
        }
        function toDecimal(x) {
            var f = parseFloat(x);
            f = f.toFixed(2);
            if (isNaN(f)) {
                return;
            }
            return f;
        }
    },
    cleanMenu: function () {
        if (this.collection.size() > 0) {
            this.collection.forEach(function (element) {
                if (element instanceof twaver.Node) {
                    element.setStyle("component.visible", false);
                    //console.log("清除" + element._id + +"  " + new Date().toLocaleString());
                } else if (element instanceof twaver.Link) {
                    element.setStyle("component.visible", false);
                }
            });
            this.collection.clear();
        }
    },
    createMouseTipDiv: function (el) {
        var div = document.createElement("div");
        return div;
    }
}
