twaver.network.interaction.MouseInteraction = function (n, s, r) {
    this.scope = s;
    this.routeParams = r;
    twaver.network.interaction.MouseInteraction.superClass.constructor.call(this, n);
};

twaver.Util.ext("twaver.network.interaction.MouseInteraction", twaver.network.interaction.BaseInteraction, {
    cache: {},
    setUp: function () {
        this.addListener("mousemove", "mouseup", "mousedown", "dblclick");
    },
    tearDown: function () {
        this.removeListener("mousemove", "mouseup", "mousedown", "dblclick"),
            this.end();
    },
    handle_mousemove: function (e) {
        twaver.network.MouseManager.MonitorMousemove(this.network, e);
    },
    handle_mouseup: function (e) {
        twaver.network.MouseManager.MonitorMouseup(this.network, e);
    },
    handle_mousedown: function (e) {
        twaver.network.MouseManager.MonitorMousedown(this.network, e);
    },
    handle_dblclick: function (e) {
        twaver.network.MouseManager.Monitordblclick(this.network, this.scope, this.routeParams, e);
    },
    end: function () {
        twaver.network.MouseManager.reset();
    }
});

twaver.network.MouseManager = {
    tipShow: false,
    linkTipShow: false,
    collection: new twaver.List(),
    MonitorMouseup: function (network, event) {
        var el = network.getElementAt(event);
        if ((el instanceof twaver.Node)) {
            if (event.button == 2 && el.type != "dummy") {
                this.nodeMouseupListening(el);
            } else if (event.button == 0) {
                //this.tipShow = false;
            }
        } else if (el instanceof twaver.Link) {
            if (event.button == 2 && el.classify == 0) {
                this.linkMouseupListening(el);
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
            if (!this.linkTipShow){
                this.linkTipShow = true;
                this.tipShow = false;
                if (el.classify == 0) {
                    this.cleanMenu();
                    this.linkMousemoveListening(el);
                } else {
                    this.cleanMenu();
                    this.relaMousemoveListening(el);
                }
            }
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
        var el = network.getElementAt(event);
        this.cleanMenu();
        if (el != null && (el instanceof twaver.Node) && el.drillId != null) {
            var isDrill = false;
            var pId, sort;
            scope.navigation.data.currentViewName = topoCommon.currentViewName.split(",")[routeParams.classify];
            var topoViewTree = angular.element.fn.zTree.getZTreeObj(scope.topoViewTree.treeId);
            var nodes = topoViewTree.transformToArray(topoViewTree.getNodes());
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id == el.drillId) {
                    topoViewTree.selectNode(nodes[i]);
                    pId = nodes[i].pId;
                    sort = nodes[i].sort;
                    isDrill = true;
                }
            }
            if (isDrill) {
                if (routeParams.classify == 0) {
                    topoCommon.currentView = el.drillId + "," + topoCommon.currentView.split(",")[1];
                    topoCommon.currentViewName = el.drillName + "," + topoCommon.currentViewName.split(",")[1];
                    topoCommon.currentViewPId = pId + "," + topoCommon.currentViewPId.split(",")[1];
                    topoCommon.currentViewSort = sort + "," + topoCommon.currentViewSort.split(",")[1];
                } else if (routeParams.classify == 1) {
                    topoCommon.currentView = topoCommon.currentView.split(",")[0] + "," + el.drillId;
                    topoCommon.currentViewName = topoCommon.currentViewName.split(",")[0] + "," + el.drillName;
                    topoCommon.currentViewPId = topoCommon.currentViewPId.split(",")[0] + "," + pId;
                    topoCommon.currentViewSort = topoCommon.currentViewSort.split(",")[0] + "," + sort;
                }
                scope.topoViewTreeNode.isShow(topoCommon.currentViewPId.split(",")[routeParams.classify], topoCommon.currentViewSort.split(",")[routeParams.classify]);
                scope.reload();
            }
        }
    },
    linkMouseupListening: function(el) {
        this.cleanMenu();
        var menu = $("#link30menu");
//        if (null == el.sampleLeft || el.sampleLeft) {
//            for (var i=0;i<topoCommon.historyRule30.length;i++){
//                 if (el.inNodeMoId == topoCommon.historyRule30[i][0] && el.inPort == topoCommon.historyRule30[i][1]){
//                     menu = $("#link30menu");
//                 }
//            }
//        } else {
//            for (var i=0;i<topoCommon.historyRule30.length;i++){
//                if (el.outNodeMoId == topoCommon.historyRule30[i][0] && el.outPort == topoCommon.historyRule30[i][1]){
//                    menu = $("#link30menu");
//                }
//            }
//        }
        this.mouseUpEachElement(menu, el);
        var x = event.clientX;
        var y = event.clientY + topoCommon.topoMenuLayout;
        var elWidth = menu.width();
        var elHeight = menu.height();
        var parentWidth = menu.offsetParent().parent().width();
        var parentHeight = menu.offsetParent().parent().height();
        if (x + elWidth > parentWidth - 5)
            x = x - elWidth - 15;
        if (y + elHeight > parentHeight - 5)
            y = y - elHeight - 10;
        menu.css({
            top: y,
            left: x + 5 + $(document.body).scrollLeft()
        }).show();
        menu.mouseleave(function (e) {
            menu.hide();
        });
    },
    nodeMouseupListening: function (el) {
        if (el.type != "dummy") {
            if (el.classify == "host") {

            } else if (el.classify == "network") {

            } else if (el.classify == "storage") {

            } else if (el.classify == "database") {

            } else if (el.classify == "middleware") {

            } else if (el.classify == "service") {

            } else if (el.classify == "link") {

            } else if (el.classify == "environment") {

            } else if (el.type == "application") {

            } else if (el.classify == "windows") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "linux") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "hpux") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "aix") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "solaris") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "switch2") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "switch3") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "router") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "loadbalancing") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "security") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "fcswitch") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "diskarray") {
                this.nodeMouseupListeningAboutAll(el);
            }
            else if (el.classify == "tapearray") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "vtl") {
                this.nodeMouseupListeningAboutAll(el);
            }
            else if (el.classify == "mssql") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "sybase") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "oracle") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "mq") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "weblogic") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "iis") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "http") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "elink") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "room") {
                this.nodeMouseupListeningAboutJF(el);
            } else if (el.classify == "humiture") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "leaking") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "ups") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "aircondition") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "centralization") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "taxservice") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "workplatform") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "networkinvoice") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "electricsupply") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "upsswitch") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "newfan") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "fire") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "weblogiccluster") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "oraclerac") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "aimosheng") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "voltameter") {
                this.nodeMouseupListeningAboutAll(el);
            } else if (el.classify == "apache") {
                this.nodeMouseupListeningAboutApache(el);
            }
        }
    },
    nodeMouseupListeningAboutAll: function (el){
        this.cleanMenu();
        var menu = $("#menu");
        this.mouseUpEachElement(menu, el);
        var x = event.clientX;
        var y = event.clientY + topoCommon.topoMenuLayout;
        var elWidth = menu.width();
        var elHeight = menu.height();
        var parentWidth = menu.offsetParent().parent().width();
        var parentHeight = menu.offsetParent().parent().height();
        if (x + elWidth > parentWidth - 5)
            x = x - elWidth - 15;
        if (y + elHeight > parentHeight - 5)
            y = y - elHeight - 10;
        menu.css({
            top: y + 5,
            left: x + 5 + $(document.body).scrollLeft()
        }).show();
        menu.mouseleave(function (e) {
            menu.hide();
        });
    },
    nodeMouseupListeningAboutApache: function (el){
        this.cleanMenu();
        var menu = $("#apacheMenu");
        this.mouseUpEachElement(menu, el);
        var x = event.clientX;
        var y = event.clientY + topoCommon.topoMenuLayout;
        var elWidth = menu.width();
        var elHeight = menu.height();
        var parentWidth = menu.offsetParent().parent().width();
        var parentHeight = menu.offsetParent().parent().height();
        if (x + elWidth > parentWidth - 5)
            x = x - elWidth - 15;
        if (y + elHeight > parentHeight - 5)
            y = y - elHeight - 10;
        menu.css({
            top: y + 5,
            left: x + 5 + $(document.body).scrollLeft()
        }).show();
        menu.mouseleave(function (e) {
            menu.hide();
        });
    },
    nodeMouseupListeningAboutJF: function (el){
        this.cleanMenu();
        var menu = $("#jfmenu");
        this.mouseUpEachElement(menu, el);
        var x = event.clientX;
        var y = event.clientY + topoCommon.topoMenuLayout;
        var elWidth = menu.width();
        var elHeight = menu.height();
        var parentWidth = menu.offsetParent().parent().width();
        var parentHeight = menu.offsetParent().parent().height();
        if (x + elWidth > parentWidth - 5)
            x = x - elWidth - 15;
        if (y + elHeight > parentHeight - 5)
            y = y - elHeight - 10;
        menu.css({
            top: y + 5,
            left: x + 5 + $(document.body).scrollLeft()
        }).show();
        menu.mouseleave(function (e) {
            menu.hide();
        });
    },
    nodeMousemoveListening: function (el) {
        if (el.type != "dummy") {
            if (el.classify == "host") {

            } else if (el.classify == "network") {

            } else if (el.classify == "storage") {

            } else if (el.classify == "database") {

            } else if (el.classify == "middleware") {

            } else if (el.classify == "service") {

            } else if (el.classify == "link") {

            } else if (el.classify == "environment") {

            } else if (el.type == "application") {
                this.nodeMousemoveListeningAboutApplicationProgressBar(el);
            } else if (el.classify == "windows") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "linux") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "hpux") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "aix") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "solaris") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "switch2") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "switch3") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "router") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "loadbalancing") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "security") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "fcswitch") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            } else if (el.classify == "diskarray") {
                this.nodeMousemoveListeningAboutProgressBar(el);
            }
            else if (el.classify == "tapearray") {
                this.nodeMousemoveListeningAboutNumber(el);
            } else if (el.classify == "vtl") {
                this.nodeMousemoveListeningAboutMiddlewareProgressBar(el);
            }
            else if (el.classify == "mssql") {
                this.nodeMousemoveListeningAboutNumber(el);
            } else if (el.classify == "sybase") {
                this.nodeMousemoveListeningAboutNumber(el);
            } else if (el.classify == "oracle") {
                this.nodeMousemoveListeningAboutOracle(el);
            } else if (el.classify == "mq") {
                this.nodeMousemoveListeningAboutNumber(el);
            } else if (el.classify == "weblogic") {
                this.nodeMousemoveListeningAboutMiddlewareProgressBar(el);
            } else if (el.classify == "iis") {
                this.nodeMousemoveListeningAboutMiddlewareProgressBar(el);
            } else if (el.classify == "http") {
                this.nodeMousemoveListeningAboutNumber(el);
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
                this.nodeMousemoveListeningAboutNumber(el);
            } else if (el.classify == "oraclerac") {
                this.nodeMousemoveListeningAboutOracleRAC(el);
            } else if (el.classify == "aimosheng") {

            } else if (el.classify == "voltameter") {

            } else if (el.classify == "apache") {
                this.nodeMousemoveListeningAboutApache(el);
            }
        }
    },
    nodeMousemoveListeningAboutProgressBar: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutProgressBar(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingPerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleMarkForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingPerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleMarkForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    nodeMousemoveListeningAboutApplicationProgressBar: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutApplicationProgressBar(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingPerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleMarkForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingPerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleMarkForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    nodeMousemoveListeningAboutMiddlewareProgressBar: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutMiddlewareProgressBar(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingPerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleMarkForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingPerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleMarkForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    nodeMousemoveListeningAboutNumber: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutNumber(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingNumberPerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleMarkForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingNumberPerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleMarkForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    nodeMousemoveListeningAboutOracle: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutOracle(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingOraclePerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleMarkForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingOraclePerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleMarkForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    nodeMousemoveListeningAboutOracleRAC: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutOracleRAC(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingOraclePerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleMarkForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingOraclePerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleMarkForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    nodeMousemoveListeningAboutApache: function (el) {
        if (el.type != "dummy") {
            if (null == el.getStyle('component.content')) {
                var tip = this.createMouseTipDivAboutApache(el);
                this.mouseOverEachElementFillingInfoForJScript(tip, el);
                this.mouseOverEachElementFillingNumberPerForJScript(tip, el);
                this.mouseOverEachElementFillingTitleNameForJScript(tip, el);
                this.mouseOverEachElementFillingSatusForJScript(tip, el);
                el.setStyle('component.content', tip);
            } else {
                this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingNumberPerForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingTitleNameForJScript(el.getStyle('component.content'), el);
                this.mouseOverEachElementFillingSatusForJScript(el.getStyle('component.content'), el);
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
    linkMousemoveListening: function (el) {
        if (null == el.getStyle('component.content')) {
            var tip = this.createLinkTipDiv(el);
            this.mouseOverEachLinkElementFillingInfoForJScript(tip, el);
            this.mouseOverEachLinkElementFillingFlowForJScript(tip, el);
            this.mouseOverEachLinkElementFillingTitleForJScript(tip, el);
            el.setStyle('component.content', tip);
        } else {
            this.mouseOverEachLinkElementFillingInfoForJScript(el.getStyle('component.content'), el);
            this.mouseOverEachLinkElementFillingFlowForJScript(el.getStyle('component.content'), el);
            this.mouseOverEachLinkElementFillingTitleForJScript(el.getStyle('component.content'), el);
        }
        el.setStyle('component.fillcolor', 'rgba(233,241,254,1.0)');
        el.setStyle('component.position', 'bottomright.bottomright');
        el.setStyle('component.direction', 'belowright');
        el.setStyle('component.pointer.length', 10);
        el.setStyle('component.pointer.width', 20);
        el.setStyle("component.visible", true);
        this.collection.add(el);
    },
    relaMousemoveListening: function (el) {
        if (null == el.getStyle('component.content')) {
            var tip = this.createRelaTipDiv(el);
            this.mouseOverEachElementFillingInfoForJScript(tip, el);
            this.mouseOverEachElementFillingTitleForJScript(tip, el);
            el.setStyle('component.content', tip);
        } else {
            this.mouseOverEachElementFillingInfoForJScript(el.getStyle('component.content'), el);
            this.mouseOverEachElementFillingTitleForJScript(el.getStyle('component.content'), el);
        }
        el.setStyle('component.fillcolor', 'rgba(233,241,254,1.0)');
        el.setStyle('component.position', 'bottomright.bottomright');
        el.setStyle('component.direction', 'belowright');
        el.setStyle('component.pointer.length', 10);
        el.setStyle('component.pointer.width', 20);
        el.setStyle("component.visible", true);
        this.collection.add(el);
    },
    reset: function () {
        this.tipShow = false;
        this.linkTipShow = false;
    },
    mouseUpEachElement: function (rootElement, el) {
        rootElement.children().each(function (i, n) {
            var obj = $(n);
            if (obj.attr("ng-click") == null || obj.attr("ng-click") == "") {
                twaver.network.MouseManager.mouseUpEachElement(obj, el);
            } else {
                if (obj.attr("nodecid") != null) {
                    obj.attr("nodecid", el.cId);
                }
                if (obj.attr("nodeid") != null) {
                    obj.attr("nodeid", el.id);
                }
                if (obj.attr("nodetype") != null) {
                    obj.attr("nodetype", el.type);
                }
                if (obj.attr("nodeclassify") != null) {
                    obj.attr("nodeclassify", el.classify);
                }
                if (obj.attr("mirroring") != null) {
                    if (el.mirroring != null){
                        obj.attr("mirroring", el.mirroring);
                    } else {
                        obj.attr("mirroring", "false");
                    }
                } else {
                    obj.attr("mirroring", "false");
                }
                if (obj.attr("interval") != null) {
                    obj.attr("interval", "?");
                    if (null == el.sampleLeft || el.sampleLeft) {
                        for (var i = 0; i < topoCommon.historyRuleInterval.length; i++) {
                            if (el.inNodeMoId == topoCommon.historyRuleInterval[i][0] && el.inPort == topoCommon.historyRuleInterval[i][1]) {
                                obj.attr("interval", topoCommon.historyRuleInterval[i][2]);
                            }
                        }
                    } else {
                        for (var i = 0; i < topoCommon.historyRuleInterval.length; i++) {
                            if (el.outNodeMoId == topoCommon.historyRuleInterval[i][0] && el.outPort == topoCommon.historyRuleInterval[i][1]) {
                                obj.attr("interval", topoCommon.historyRuleInterval[i][2]);
                            }
                        }
                    }
                }
            }
        });
    },
    mouseOverEachElementFillingInfoForJScript: function (rootElement, el) {
        ///Attribute  nodeType值为2，表示图元属性
        ///Comment    nodeType值为8，表示注释文本
        ///Document   nodeType值为9，表示Document
        ///DocumentFragment   nodeType值为11，表示Document片段
        ///Element            nodeType值为1，表示元素图元
        ///Text               nodeType值为3，表示文本图元
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("elName") == null && rootElement.childNodes[i].getAttribute("elIp") == null
                        && rootElement.childNodes[i].getAttribute("elMark") == null && rootElement.childNodes[i].getAttribute("elManager") == null
                        && rootElement.childNodes[i].getAttribute("elLinkName") == null) {
                        twaver.network.MouseManager.mouseOverEachElementFillingInfoForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("elName") != null) {
                            if (null != el.elName && el.elName != "") {
                                rootElement.childNodes[i].innerText = el.elName;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elMark") != null) {
                            var mark = twaver.network.MouseManager.getMarkData(el.type, el.cId);
                            if (null != mark && mark != "") {
                                rootElement.childNodes[i].innerText = mark;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }

                        }
                        if (rootElement.childNodes[i].getAttribute("elIp") != null) {
                            if (null != el.ip && el.ip != "") {
                                rootElement.childNodes[i].innerText = el.ip;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elManager") != null) {
                            if (null != el.elUser && el.elUser != "") {
                                rootElement.childNodes[i].innerText = el.elUser;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elLinkName") != null) {
                            if (null != el.displayName && el.displayName != "") {
                                rootElement.childNodes[i].innerText = el.displayName;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                    }
                }
            }
        }
    },
    mouseOverEachLinkElementFillingInfoForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("elLinkName") == null && rootElement.childNodes[i].getAttribute("elInNode") == null
                        && rootElement.childNodes[i].getAttribute("elMark") == null && rootElement.childNodes[i].getAttribute("elOutNode") == null
                        && rootElement.childNodes[i].getAttribute("elInProbeName") == null && rootElement.childNodes[i].getAttribute("elOutProbeName") == null) {
                        twaver.network.MouseManager.mouseOverEachLinkElementFillingInfoForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("elLinkName") != null) {
                            if (null != el.displayName && el.displayName != "") {
                                //rootElement.childNodes[i].innerText = ""; 文字被“”框，导致Title无法显示！！
                                rootElement.childNodes[i].innerText = el.displayName;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elMark") != null) {
                            var inMark = twaver.network.MouseManager.getMarkData(el.inNodeMoType, el.inNodeMoId);
                            var outMark = twaver.network.MouseManager.getMarkData(el.outNodeMoType, el.outNodeMoId);
                            rootElement.childNodes[i].innerText = ((inMark != null ? "[" + inMark + "]" : "") + "-" + (outMark != null ? "[" + outMark + "]" : ""));
                        }
                        if (rootElement.childNodes[i].getAttribute("elInNode") != null) {
                            if (null != el.inNodeMoName && el.inNodeMoName != "") {
                                rootElement.childNodes[i].innerText = el.inNodeMoName;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elOutNode") != null) {
                            if (null != el.outNodeMoName && el.outNodeMoName != "") {
                                rootElement.childNodes[i].innerText = el.outNodeMoName;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elInProbeName") != null){
                            var val = null, probeName = null;
                            if (el.inNodeMoType == "network") {
                                probeName = twaver.network.MouseManager.getLinkData(el.inNodeMoId, el.inPort, "Interface", "IfDescr");
                            }
                            if (probeName == null) {
                                val = el.inPort;
                            } else {
                                val = el.inPort + "[" + probeName + "]";
                            }
                            if (null != val && val != "") {
                                rootElement.childNodes[i].innerText = val;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elOutProbeName") != null){
                            var val = null, probeName = null;
                            if (el.outNodeMoType == "network") {
                                probeName = twaver.network.MouseManager.getLinkData(el.outNodeMoId, el.outPort, "Interface", "IfDescr");
                            }
                            if (probeName == null) {
                                val = el.outPort;
                            } else {
                                val = el.outPort + "[" + probeName + "]";
                            }
                            if (null != val && val != "") {
                                rootElement.childNodes[i].innerText = val;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                    }
                }
            }
        }
    },
    mouseOverEachElementFillingTitleForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("title") == null) {
                        twaver.network.MouseManager.mouseOverEachElementFillingTitleForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("title") != null) {
                            if (null != el.displayName && el.displayName != "") {
                                rootElement.childNodes[i].setAttribute("title", el.displayName);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                    }
                }
            }
        }
    },
    mouseOverEachElementFillingTitleMarkForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("titleMark") == null) {
                        twaver.network.MouseManager.mouseOverEachElementFillingTitleMarkForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("titleMark") != null) {
                            var mark = twaver.network.MouseManager.getMarkData(el.type, el.cId);
                            if (null != mark && mark != "") {
                                rootElement.childNodes[i].setAttribute("title", mark);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                    }
                }
            }
        }
    },
    mouseOverEachElementFillingTitleNameForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("titleName") == null) {
                        twaver.network.MouseManager.mouseOverEachElementFillingTitleNameForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("titleName") != null) {
                            if (null != el.elName && el.elName != "") {
                                rootElement.childNodes[i].setAttribute("title", el.elName);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                    }
                }
            }
        }
    },
    mouseOverEachLinkElementFillingTitleForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("titleMark") == null && rootElement.childNodes[i].getAttribute("titleLinkName") == null
                        && rootElement.childNodes[i].getAttribute("titleInNode") == null && rootElement.childNodes[i].getAttribute("titleOutNode") == null
                        && rootElement.childNodes[i].getAttribute("titleInProbeName") == null && rootElement.childNodes[i].getAttribute("titleOutProbeName") == null) {
                        twaver.network.MouseManager.mouseOverEachLinkElementFillingTitleForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("titleLinkName") != null) {
                            if (null != el.displayName && el.displayName != "") {
                                rootElement.childNodes[i].setAttribute("title", el.displayName);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("titleMark") != null) {
                            var inMark = twaver.network.MouseManager.getMarkData(el.inNodeMoType, el.inNodeMoId);
                            var outMark = twaver.network.MouseManager.getMarkData(el.outNodeMoType, el.outNodeMoId);
                            rootElement.childNodes[i].setAttribute("title", ((inMark != null ? "[" + inMark + "]" : "") + "-" + (outMark != null ? "[" + outMark + "]" : "")));
                        }
                        if (rootElement.childNodes[i].getAttribute("titleInNode") != null) {
                            if (null != el.inNodeMoName && el.inNodeMoName != "") {
                                rootElement.childNodes[i].setAttribute("title", el.inNodeMoName);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("titleOutNode") != null) {
                            if (null != el.outNodeMoName && el.outNodeMoName != "") {
                                rootElement.childNodes[i].setAttribute("title", el.outNodeMoName);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("titleInProbeName") != null){
                            var val = null, probeName = null;
                            if (el.inNodeMoType == "network") {
                                probeName = twaver.network.MouseManager.getLinkData(el.inNodeMoId, el.inPort, "Interface", "IfDescr");
                            }
                            if (probeName == null) {
                                val = el.inPort;
                            } else {
                                val = el.inPort + "[" + probeName + "]";
                            }
                            if (null != val && val != "") {
                                rootElement.childNodes[i].setAttribute("title", val);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("titleOutProbeName") != null){
                            var val = null, probeName = null;
                            if (el.outNodeMoType == "network") {
                                probeName = twaver.network.MouseManager.getLinkData(el.outNodeMoId, el.outPort, "Interface", "IfDescr");
                            }
                            if (probeName == null) {
                                val = el.outPort;
                            } else {
                                val = el.outPort + "[" + probeName + "]";
                            }
                            if (null != val && val != "") {
                                rootElement.childNodes[i].setAttribute("title", val);
                            } else {
                                rootElement.childNodes[i].setAttribute("title", "");
                            }
                        }
                    }
                }
            }
        }
    },
    mouseOverEachLinkElementFillingFlowForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("elFlow") == null && rootElement.childNodes[i].getAttribute("elInUpFlow") == null
                        && rootElement.childNodes[i].getAttribute("elInDownFlow") == null && rootElement.childNodes[i].getAttribute("elInStatus") == null
                        && rootElement.childNodes[i].getAttribute("elBandUsage") == null) {
                        twaver.network.MouseManager.mouseOverEachLinkElementFillingFlowForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("elFlow") != null) {
                            var number = null, pType = null, pNodeMoId = null, pPort = null;
                            if (null == el.sampleLeft || el.sampleLeft) {
                                pType = el.inNodeMoType;
                                pNodeMoId = el.inNodeMoId;
                                pPort = el.inPort;
                            } else {
                                pType = el.outNodeMoType;
                                pNodeMoId = el.outNodeMoId;
                                pPort = el.outPort;
                            }
                            if (pType == "host") {
                                number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "NIO", "RTX");
                            } else if (pType == "network") {
                                number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "Interface", "IfOctets");
                            }
                            //var number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].innerText = number;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elInUpFlow") != null) {
                            var number = null, pType = null, pNodeMoId = null, pPort = null;
                            if (null == el.sampleLeft || el.sampleLeft) {
                                pType = el.inNodeMoType;
                                pNodeMoId = el.inNodeMoId;
                                pPort = el.inPort;
                                if (pType == "host") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "NIO", "RX");
                                } else if (pType == "network") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "Interface", "IfInOctets");
                                }
                            } else {
                                pType = el.outNodeMoType;
                                pNodeMoId = el.outNodeMoId;
                                pPort = el.outPort;
                                if (pType == "host") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "NIO", "TX");
                                } else if (pType == "network") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "Interface", "IfOutOctets");
                                }
                            }
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].innerText = number;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elInDownFlow") != null) {
                            var number = null, pType = null, pNodeMoId = null, pPort = null;
                            if (null == el.sampleLeft || el.sampleLeft) {
                                pType = el.inNodeMoType;
                                pNodeMoId = el.inNodeMoId;
                                pPort = el.inPort;
                                if (pType == "host") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "NIO", "TX");
                                } else if (pType == "network") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "Interface", "IfOutOctets");
                                }
                            } else {
                                pType = el.outNodeMoType;
                                pNodeMoId = el.outNodeMoId;
                                pPort = el.outPort;
                                if (pType == "host") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "NIO", "RX");
                                } else if (pType == "network") {
                                    number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "Interface", "IfInOctets");
                                }
                            }
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].innerText = number;
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elBandUsage") != null) {
                            var number = null, pType = null, pNodeMoId = null, pPort = null, pClass = null;
                            if (null == el.sampleLeft || el.sampleLeft) {
                                pType = el.inNodeMoType;
                                pClass = el.inNodeMoClassify;
                                pNodeMoId = el.inNodeMoId;
                                pPort = el.inPort;
                            } else {
                                pType = el.outNodeMoType;
                                pClass = el.outNodeMoClassify;
                                pNodeMoId = el.outNodeMoId;
                                pPort = el.outPort;
                            }
                            if (pType == "host") {
                                number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "NIO", "BandUsage");
                            } else if (pType == "network") {
                                number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "Interface", "IfBandUsage");
                            }
                            //number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].style.width = number + "%";
                                if (pType == "host") {
                                    rootElement.childNodes[i].style.background = getBackground(number, "NIO", "BandUsage", pType,pClass);
                                } else if (pType == "network") {
                                    rootElement.childNodes[i].style.background = getBackground(number, "Interface", "IfBandUsage", pType,pClass);
                                }
                                rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = toDecimal(number) + "";
                            } else {
                                rootElement.childNodes[i].style.width = 100 + "%";
                                rootElement.childNodes[i].style.background = "#BEBEBE";
                                rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = "";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elInStatus") != null) {
                            var number = null, pType = null, pNodeMoId = null, pPort = null;
                            if (null == el.sampleLeft || el.sampleLeft) {
                                pType = el.inNodeMoType;
                                pNodeMoId = el.inNodeMoId;
                                pPort = el.inPort;
                            } else {
                                pType = el.outNodeMoType;
                                pNodeMoId = el.outNodeMoId;
                                pPort = el.outPort;
                            }
                            number = twaver.network.MouseManager.getLinkData(pNodeMoId, pPort, "InterfaceStatus", "IfStatus");
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].className = "tip-content";
                                rootElement.childNodes[i].className += statusName(number);
                                rootElement.childNodes[i].parentElement.setAttribute("title", titleStatusName(number));
                            } else {
                                rootElement.childNodes[i].className = "tip-content fa fa-circle status-icon statuNull";
                                rootElement.childNodes[i].parentElement.setAttribute("title", "未取到值");
                            }
                        }
                    }
                }
            }
        }
        function getBackground(value, indicatorName, metricName, pType,pClass) {
            if (topoCommon.elMetricColors != null) {
                for (var i = 0; i < topoCommon.elMetricColors.length; i++) {
                    if (topoCommon.elMetricColors[i].mocpName == pType && topoCommon.elMetricColors[i].mocName == pClass
                        && topoCommon.elMetricColors[i].indicatorName == indicatorName && topoCommon.elMetricColors[i].metricName == metricName) {
                        if (!topoCommon.elMetricColors[i].reverse) {
                            if (parseFloat(value) < parseFloat(topoCommon.elMetricColors[i].point1)) {
                                return "#0fa460";//green
                            } else if ((parseFloat(value) >= parseFloat(topoCommon.elMetricColors[i].point1)) && (parseFloat(value) <= parseFloat(topoCommon.elMetricColors[i].point2))) {
                                return "#f8c63d";//yellow
                            } else if (parseFloat(value) > parseFloat(topoCommon.elMetricColors[i].point2)) {
                                return "#de4e43";//red
                            }
                        } else {
                            if (parseFloat(value) < parseFloat(topoCommon.elMetricColors[i].point1)) {
                                return "#de4e43";//red
                            } else if ((parseFloat(value) >= parseFloat(topoCommon.elMetricColors[i].point1)) && (parseFloat(value) <= parseFloat(topoCommon.elMetricColors[i].point2))) {
                                return "#f8c63d";//yellow
                            } else if (parseFloat(value) > parseFloat(topoCommon.elMetricColors[i].point2)) {
                                return "#0fa460";//green
                            }
                        }
                    }
                }
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

        function statusName(level) {
            switch (level) {
                case "0" :
                    return  " fa fa-check-circle status-icon statusOn";
                default:
                    return  " fa fa-minus-circle status-icon statusOff";
            }
        }

        function titleStatusName(level) {
            switch (level) {
                case "0" :
                    return  "正常";
                default:
                    return  "不可达";
            }
        }
    },
    mouseOverEachElementFillingPerForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("indicatorName") == null || rootElement.childNodes[i].getAttribute("indicatorName") == "") {
                        twaver.network.MouseManager.mouseOverEachElementFillingPerForJScript(rootElement.childNodes[i], el);
                    } else {
                        var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                        //var number = Math.floor(Math.random() * ( 100 + 1));
                        if (null != number && number != -1) {
                            rootElement.childNodes[i].style.width = number + "%";
                            rootElement.childNodes[i].style.background = getBackground(number, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"), el);
                            rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = toDecimal(number) + "%";
                        } else {
                            rootElement.childNodes[i].style.width = 100 + "%";
                            rootElement.childNodes[i].style.background = "#BEBEBE";
                            rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = "";
                        }
                    }
                }
            }
        }
        function getBackground(value, indicatorName, metricName, el) {
            if (topoCommon.elMetricColors != null) {
                for (var i = 0; i < topoCommon.elMetricColors.length; i++) {
                    if (topoCommon.elMetricColors[i].mocpName == el.type && topoCommon.elMetricColors[i].mocName == el.classify
                        && topoCommon.elMetricColors[i].indicatorName == indicatorName && topoCommon.elMetricColors[i].metricName == metricName) {
                        if (!topoCommon.elMetricColors[i].reverse) {
                            if (parseFloat(value) < parseFloat(topoCommon.elMetricColors[i].point1)) {
                                return "#0fa460";//green
                            } else if ((parseFloat(value) >= parseFloat(topoCommon.elMetricColors[i].point1)) && (parseFloat(value) <= parseFloat(topoCommon.elMetricColors[i].point2))) {
                                return "#f8c63d";//yellow
                            } else if (parseFloat(value) > parseFloat(topoCommon.elMetricColors[i].point2)) {
                                return "#de4e43";//red
                            }
                        } else {
                            if (parseFloat(value) < parseFloat(topoCommon.elMetricColors[i].point1)) {
                                return "#de4e43";//red
                            } else if ((parseFloat(value) >= parseFloat(topoCommon.elMetricColors[i].point1)) && (parseFloat(value) <= parseFloat(topoCommon.elMetricColors[i].point2))) {
                                return "#f8c63d";//yellow
                            } else if (parseFloat(value) > parseFloat(topoCommon.elMetricColors[i].point2)) {
                                return "#0fa460";//green
                            }
                        }
                    }
                }
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
    mouseOverEachElementFillingNumberPerForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("indicatorName") == null || rootElement.childNodes[i].getAttribute("indicatorName") == "") {
                        twaver.network.MouseManager.mouseOverEachElementFillingNumberPerForJScript(rootElement.childNodes[i], el);
                    } else {
                        var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                        //number = Math.floor(Math.random() * ( 100 + 1));
                        if (null != number && number != -1) {
                            rootElement.childNodes[i].innerText = toDecimal(number);
                        } else {
                            rootElement.childNodes[i].innerText = "--";
                        }
                    }
                }
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

    },
    mouseOverEachElementFillingOraclePerForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("indicatorName") == null || rootElement.childNodes[i].getAttribute("indicatorName") == "") {
                        twaver.network.MouseManager.mouseOverEachElementFillingOraclePerForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("indicatorName") == "SysPerf" && rootElement.childNodes[i].getAttribute("metricName") == "SessionCnt"){
                            var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                            //number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].innerText = toDecimal(number);
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }

                        if (rootElement.childNodes[i].getAttribute("indicatorName") == "SysPerf" && rootElement.childNodes[i].getAttribute("metricName") == "SQLParseHit"){
                            var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                            //number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].style.width = number + "%";
                                rootElement.childNodes[i].style.background = getBackground(number, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"), el);
                                rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = toDecimal(number) + "%";
                            } else {
                                rootElement.childNodes[i].style.width = 100 + "%";
                                rootElement.childNodes[i].style.background = "#BEBEBE";
                                rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = "";
                            }
                        }

                        if (rootElement.childNodes[i].getAttribute("indicatorName") == "SysPerf" && rootElement.childNodes[i].getAttribute("metricName") == "DeadLock"){
                            var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                            //number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].innerText = toDecimal(number);
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }

                        if (rootElement.childNodes[i].getAttribute("indicatorName") == "SysPerf" && rootElement.childNodes[i].getAttribute("metricName") == "ActInst"){
                            var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                            //number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].innerText = toDecimal(number);
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }

                        if (rootElement.childNodes[i].getAttribute("indicatorName") == "SysPerf" && rootElement.childNodes[i].getAttribute("metricName") == "MinSesInstRatio"){
                            var number = twaver.network.MouseManager.getNodeData(el.cId, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"));
                            //var number = Math.floor(Math.random() * ( 100 + 1));
                            if (null != number && number != -1) {
                                rootElement.childNodes[i].style.width = number + "%";
                                rootElement.childNodes[i].style.background = getBackground(number, rootElement.childNodes[i].getAttribute("indicatorName"), rootElement.childNodes[i].getAttribute("metricName"), el);
                                rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = toDecimal(number) + "%";
                            } else {
                                rootElement.childNodes[i].style.width = 100 + "%";
                                rootElement.childNodes[i].style.background = "#BEBEBE";
                                rootElement.childNodes[i].parentElement.parentElement.parentElement.firstChild.innerText = "";
                            }
                        }


                    }
                }
            }
        }
        function getBackground(value, indicatorName, metricName, el) {
            if (topoCommon.elMetricColors != null) {
                for (var i = 0; i < topoCommon.elMetricColors.length; i++) {
                    if (topoCommon.elMetricColors[i].mocpName == el.type && topoCommon.elMetricColors[i].mocName == el.classify
                        && topoCommon.elMetricColors[i].indicatorName == indicatorName && topoCommon.elMetricColors[i].metricName == metricName) {
                        if (!topoCommon.elMetricColors[i].reverse) {
                            if (parseFloat(value) < parseFloat(topoCommon.elMetricColors[i].point1)) {
                                return "#0fa460";//green
                            } else if ((parseFloat(value) >= parseFloat(topoCommon.elMetricColors[i].point1)) && (parseFloat(value) <= parseFloat(topoCommon.elMetricColors[i].point2))) {
                                return "#f8c63d";//yellow
                            } else if (parseFloat(value) > parseFloat(topoCommon.elMetricColors[i].point2)) {
                                return "#de4e43";//red
                            }
                        } else {
                            if (parseFloat(value) < parseFloat(topoCommon.elMetricColors[i].point1)) {
                                return "#de4e43";//red
                            } else if ((parseFloat(value) >= parseFloat(topoCommon.elMetricColors[i].point1)) && (parseFloat(value) <= parseFloat(topoCommon.elMetricColors[i].point2))) {
                                return "#f8c63d";//yellow
                            } else if (parseFloat(value) > parseFloat(topoCommon.elMetricColors[i].point2)) {
                                return "#0fa460";//green
                            }
                        }
                    }
                }
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
    mouseOverEachElementFillingSatusForJScript: function (rootElement, el) {
        if (rootElement.hasChildNodes()) {
            for (var i = 0; i < rootElement.childNodes.length; i++) {
                if (rootElement.childNodes[i].nodeType != 3) {
                    if (rootElement.childNodes[i].getAttribute("elAlarmLevel") == null && rootElement.childNodes[i].getAttribute("elStatus") == null) {
                        twaver.network.MouseManager.mouseOverEachElementFillingSatusForJScript(rootElement.childNodes[i], el);
                    } else {
                        if (rootElement.childNodes[i].getAttribute("elAlarmLevel") != null) {
                            var alarmLevel = twaver.network.MouseManager.getAlarmLevelData(el);
                            if (null != alarmLevel && alarmLevel != "") {
                                rootElement.childNodes[i].innerHTML = alarmLevelName(alarmLevel);
                            } else {
                                rootElement.childNodes[i].innerText = "--";
                            }
                        }
                        if (rootElement.childNodes[i].getAttribute("elStatus") != null) {
                            var nodeStatus = twaver.network.MouseManager.getStatusData(el);
                            //nodeStatus = "0";
                            if (null != nodeStatus && nodeStatus != "") {
                                rootElement.childNodes[i].className = "tip-content-4";
                                rootElement.childNodes[i].className += statusName(nodeStatus);
                                rootElement.childNodes[i].parentElement.setAttribute("title", titleStatusName(nodeStatus));
                            } else {
                                rootElement.childNodes[i].className = "tip-content-4 fa fa-circle status-icon statuNull";
                                rootElement.childNodes[i].parentElement.setAttribute("title", titleStatusName(nodeStatus));
                            }
                        }
                    }
                }
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

    },
    getNodeData: function (id, indicatorName, metricName) {
        if (topoCommon.topoViewMenuData != null) {
            for (var i = 0; i < topoCommon.topoViewMenuData.length; i++) {
                if (topoCommon.topoViewMenuData[i].moId == id && topoCommon.topoViewMenuData[i].indicatorName == indicatorName && topoCommon.topoViewMenuData[i].metricName == metricName) {
                    return topoCommon.topoViewMenuData[i].value;
                }
            }
        }
        return null;
    },
    getMarkData: function (type, cId) {
        if (type == "host") {
            if (topoCommon.topoViewMenuData != null) {
                for (var i = 0; i < topoCommon.topoViewMenuData.length; i++) {
                    if (topoCommon.topoViewMenuData[i].moId == cId && topoCommon.topoViewMenuData[i].indicatorName == "SystemInfo" && topoCommon.topoViewMenuData[i].metricName == "SystemName") {
                        return topoCommon.topoViewMenuData[i].value;
                    }
                }
            }
        } else if (type == "network" || type == "storage") {
            if (topoCommon.topoViewMenuData != null) {
                for (var i = 0; i < topoCommon.topoViewMenuData.length; i++) {
                    if (topoCommon.topoViewMenuData[i].moId == cId && topoCommon.topoViewMenuData[i].indicatorName == "SystemInfo" && topoCommon.topoViewMenuData[i].metricName == "Name") {
                        return topoCommon.topoViewMenuData[i].value;
                    }
                }
            }
        }
        return null;
    },
    getAlarmLevelData: function (el) {
        if (topoCommon.elAlarmData != null) {
            for (var i = 0; i < topoCommon.elAlarmData.length; i++) {
                if (topoCommon.elAlarmData[i].moId == el.cId) {
                    return topoCommon.elAlarmData[i].level;
                }
            }
        }
        return null;
    },
    getStatusData: function (el) {
        if (topoCommon.topoViewMenuData != null) {
            for (var i = 0; i < topoCommon.topoViewMenuData.length; i++) {
                if (topoCommon.topoViewMenuData[i].moId == el.cId && topoCommon.topoViewMenuData[i].indicatorName == "Status" && topoCommon.topoViewMenuData[i].metricName == "Status") {
                    return topoCommon.topoViewMenuData[i].value;
                }
            }
        }
        return null;
    },
    getLinkData: function (id, inPort, indicatorName, metricName) {
        if (topoCommon.topoViewMenuData != null) {
            for (var i = 0; i < topoCommon.topoViewMenuData.length; i++) {
                if (topoCommon.topoViewMenuData[i].moId == id && inPort == topoCommon.topoViewMenuData[i].index
                    && topoCommon.topoViewMenuData[i].indicatorName == indicatorName && topoCommon.topoViewMenuData[i].metricName == metricName) {
                    return topoCommon.topoViewMenuData[i].formatValue;
                }
            }
        }
        return null;
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
        //$("#tipNodeTwaver").hide();
        //$("#tipLink").hide();
        //$("#tipRela").hide();
        $("#menu").hide();
        $("#linkmenu").hide();
        $("#link30menu").hide();
        $("#jfmenu").hide();
    },
    createMouseTipDivAboutProgressBar: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaverAll\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleMark=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">名称:</div><div class=\"tip-content\" elMark=\"?\">--</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 45px;\">管理IP:</div><div class=\"tip-content-3\"  elIp=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";
        if (topoCommon.elIndicatorsData != null) {
            for (var i = 0; i < topoCommon.elIndicatorsData.length; i++) {
                if (topoCommon.elIndicatorsData[i].isMenu == 1 && topoCommon.elIndicatorsData[i].type == 0
                    && topoCommon.elIndicatorsData[i].mocp == el.type && topoCommon.elIndicatorsData[i].moc == el.classify) {
                    sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
                    sb += "<div class=\"tip-lable-5\">" + topoCommon.elIndicatorsData[i].metricDisplayName + ":</div>";
                    sb += "</a>";
                    sb += "<div style='display: inline-block; width:160px; height: 20px'>";
                    sb += '<div class="bar-label">' + "" + '</div>';
                    sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
                    sb += "<div metricName=\"" + topoCommon.elIndicatorsData[i].metric + "\" indicatorName=\"" + topoCommon.elIndicatorsData[i].indicator + "\" style=\"width: 100%;background:#BEBEBE;\">";
                    sb += "</div>";
                    sb += "</div></div>";
                    sb += "</div>";
                    sb += "</li>";
                }
            }
        }
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createMouseTipDivAboutApplicationProgressBar: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaver\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";
        if (topoCommon.elIndicatorsData != null) {
            for (var i = 0; i < topoCommon.elIndicatorsData.length; i++) {
                if (topoCommon.elIndicatorsData[i].isMenu == 1 && topoCommon.elIndicatorsData[i].type == 0
                    && topoCommon.elIndicatorsData[i].mocp == el.type && topoCommon.elIndicatorsData[i].moc == el.classify) {
                    sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
                    sb += "<div class=\"tip-lable-5\">" + topoCommon.elIndicatorsData[i].metricDisplayName + ":</div>";
                    sb += "</a>";
                    sb += "<div style='display: inline-block; width:120px; height: 20px'>";
                    sb += '<div class="bar-label">' + "" + '</div>';
                    sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
                    sb += "<div metricName=\"" + topoCommon.elIndicatorsData[i].metric + "\" indicatorName=\"" + topoCommon.elIndicatorsData[i].indicator + "\" style=\"width: 100%;background:#BEBEBE;\">";
                    sb += "</div>";
                    sb += "</div></div>";
                    sb += "</div>";
                    sb += "</li>";
                }
            }
        }
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createMouseTipDivAboutMiddlewareProgressBar: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaver\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 45px;\">管理IP:</div><div class=\"tip-content-3\"  elIp=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";
        if (topoCommon.elIndicatorsData != null) {
            for (var i = 0; i < topoCommon.elIndicatorsData.length; i++) {
                if (topoCommon.elIndicatorsData[i].isMenu == 1 && topoCommon.elIndicatorsData[i].type == 0
                    && topoCommon.elIndicatorsData[i].mocp == el.type && topoCommon.elIndicatorsData[i].moc == el.classify) {
                    sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
                    sb += "<div class=\"tip-lable-5\">" + topoCommon.elIndicatorsData[i].metricDisplayName + ":</div>";
                    sb += "</a>";
                    sb += "<div style='display: inline-block; width:120px; height: 20px'>";
                    sb += '<div class="bar-label">' + "" + '</div>';
                    sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
                    sb += "<div metricName=\"" + topoCommon.elIndicatorsData[i].metric + "\" indicatorName=\"" + topoCommon.elIndicatorsData[i].indicator + "\" style=\"width: 100%;background:#BEBEBE;\">";
                    sb += "</div>";
                    sb += "</div></div>";
                    sb += "</div>";
                    sb += "</li>";
                }
            }
        }
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createMouseTipDivAboutNumber: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaver\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        if(el.classify != "http") {
            sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 45px;\">管理IP:</div><div class=\"tip-content-3\"  elIp=\"?\">--</div></a></li>";
        }
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";
        if (topoCommon.elIndicatorsData != null) {
            for (var i = 0; i < topoCommon.elIndicatorsData.length; i++) {
                if (topoCommon.elIndicatorsData[i].isMenu == 1 && topoCommon.elIndicatorsData[i].type == 0
                    && topoCommon.elIndicatorsData[i].mocp == el.type && topoCommon.elIndicatorsData[i].moc == el.classify) {
                    sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
                    sb += "<div class=\"tip-lable-7\">" + topoCommon.elIndicatorsData[i].metricDisplayName + ":</div>";
                    sb += "<div class=\"tip-content-7\" metricName=\"" + topoCommon.elIndicatorsData[i].metric + "\" indicatorName=\"" + topoCommon.elIndicatorsData[i].indicator + "\">--</div>";
                    sb += "</a>";
                    sb += "</li>";
                }
            }
        }
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createMouseTipDivAboutOracle: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaver\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 45px;\">管理IP:</div><div class=\"tip-content-3\"  elIp=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-7\">" + "当前会话数" + ":</div>";
        sb += "<div class=\"tip-content-7\" metricName=\"" + "SessionCnt" + "\" indicatorName=\"" + "SysPerf" + "\">--</div>";
        sb += "</a>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-5\">" + "解析比" + ":</div>";
        sb += "</a>";
        sb += "<div style='display: inline-block; width:120px; height: 20px'>";
        sb += '<div class="bar-label">' + "" + '</div>';
        sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
        sb += "<div metricName=\"" + "SQLParseHit" + "\" indicatorName=\"" + "SysPerf" + "\" style=\"width: 100%;background:#BEBEBE;\">";
        sb += "</div>";
        sb += "</div></div>";
        sb += "</div>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-7\">" + "死锁数" + ":</div>";
        sb += "<div class=\"tip-content-7\" metricName=\"" + "DeadLock" + "\" indicatorName=\"" + "SysPerf" + "\">--</div>";
        sb += "</a>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createMouseTipDivAboutOracleRAC: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaver\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 45px;\">管理IP:</div><div class=\"tip-content-3\"  elIp=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-7\">" + "活动实例数" + ":</div>";
        sb += "<div class=\"tip-content-7\" metricName=\"" + "ActInst" + "\" indicatorName=\"" + "SysPerf" + "\">--</div>";
        sb += "</a>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-5\">" + "均衡率" + ":</div>";
        sb += "</a>";
        sb += "<div style='display: inline-block; width:120px; height: 20px'>";
        sb += '<div class="bar-label">' + "" + '</div>';
        sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
        sb += "<div metricName=\"" + "MinSesInstRatio" + "\" indicatorName=\"" + "SysPerf" + "\" style=\"width: 100%;background:#BEBEBE;\">";
        sb += "</div>";
        sb += "</div></div>";
        sb += "</div>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createMouseTipDivAboutApache: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipNodeTwaver\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 45px;\">管理IP:</div><div class=\"tip-content-3\"  elIp=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-3\" style=\"width: 47px;\">负责人:</div><div class=\"tip-content-3\"  elManager=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-7\">" + "CPU负载" + ":</div>";
        sb += "<div class=\"tip-content-7\" metricName=\"" + "CPULoad" + "\" indicatorName=\"" + "SystemInfo" + "\">--</div>";
        sb += "</a>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-7\">" + "当前处理请求数" + ":</div>";
        sb += "<div class=\"tip-content-7\" metricName=\"" + "ReqCurProc" + "\" indicatorName=\"" + "SystemInfo" + "\">--</div>";
        sb += "</a>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-7\">" + "每秒请求数" + ":</div>";
        sb += "<div class=\"tip-content-7\" metricName=\"" + "ReqPerSec" + "\" indicatorName=\"" + "SystemInfo" + "\">--</div>";
        sb += "</a>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">告警等级:</div><div class=\"tip-content-4\"  elAlarmLevel=\"?\">--</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">通断状态:</div><div class=\"tip-content-4 fa fa-circle status-icon statuNull\"  elStatus=\"?\" style='width:20px;margin-left: -5px;margin-top: 3px'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createLinkTipDiv: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipLink\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" titleMark=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">名称:</div><div class=\"tip-content\" elMark=\"?\">--</div></a></li>";
        sb += "<li><a title=\"?\" titleLinkName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">标识:</div><div class=\"tip-content\" elLinkName=\"?\">--</div></a></li>";
        sb += "<li><a title=\"?\" titleInNode=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">上联设备:</div><div class=\"tip-content-4\" elInNode=\"?\">--</div></a></li>";
        sb += "<li><a title=\"?\" titleInProbeName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">上联端口:</div><div class=\"tip-content-4\" elInProbeName=\"?\">--</div></a></li>";
        sb += "<li><a title=\"?\" titleOutNode=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">下联设备:</div><div class=\"tip-content-4\" elOutNode=\"?\">--</div></a></li>";
        sb += "<li><a title=\"?\" titleOutProbeName=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable-4\" style=\"width: 60px;\">下联端口:</div><div class=\"tip-content-4\" elOutProbeName=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>性能信息</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-7\" style=\"width: 86px;\">总流量(KBIT/S):</div><div class=\"tip-content-7\"  elFlow=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-7\" style=\"width: 100px;\">上行流量(KBIT/S):</div><div class=\"tip-content-7\"  style=\"width: 123px;\" elInUpFlow=\"?\">--</div></a></li>";
        sb += "<li><a href=\"javascript:void(0)\"><div class=\"tip-lable-7\" style=\"width: 100px;\">下行流量(KBIT/S):</div><div class=\"tip-content-7\"  style=\"width: 123px;\" elInDownFlow=\"?\">--</div></a></li>";

        sb += "<li style='padding-top: 0px'><a href=\"javascript:void(0)\" style='display: inline-block'>";
        sb += "<div class=\"tip-lable-6\" style=\"width: 90px;\">" + "带宽使用率(%)" + ":</div>";
        sb += "</a>";
        sb += "<div style='display: inline-block; width:120px; height: 20px'>";
        sb += '<div class="bar-label" style="color: #4682B4;">' + "" + '</div>';
        sb += "<div class=\"bar-wrap\"><div class=\"BarOverView\">";
        sb += "<div metricName=\"\" indicatorName=\"\" elBandUsage=\"?\" style=\"width: 100%;background:#BEBEBE;\">";
        sb += "</div>";
        sb += "</div></div>";
        sb += "</div>";
        sb += "</li>";

        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>状态信息</div></a></li>";
        sb += "<li><a title=\"未取到值\" titleLinkStatus=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">状态:</div><div class=\"tip-content fa fa-circle status-icon statuNull\"  elInStatus=\"?\" style='width:20px;'></div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    },
    createRelaTipDiv: function (el) {
        var div = document.createElement("div");
        var sb = "";
        sb += "<ul id=\"tipRela\">";
        sb += "<li><a href=\"javascript:void(0)\"><div class='tip_line'>基本信息</div></a></li>";
        sb += "<li><a title=\"?\" href=\"javascript:void(0)\"><div class=\"tip-lable\">名称:</div><div class=\"tip-content\" elLinkName=\"?\">--</div></a></li>";
        sb += "</ul>";
        div.innerHTML = sb;
        return div;
    }
}
