/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.zoomToOverview();
graph.styles = {};
graph.styles[Q.Styles.LABEL_FONT_SIZE] = 18;

function createNode(image, x, y, name, group){
    var node = graph.createNode(name, x, y);
    if(image){
        if(Q.isString(image)){
            image = "./network/images2/" + image;
        }
        node.image = image;
    }
    if(group){
        group.addChild(node);
    }
    return node;
}

function createText(name, x, y, fontSize, color, parent){
    var text = graph.createText(name, x, y);
    text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    text.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize);
    text.setStyle(Q.Styles.LABEL_COLOR, color);
    text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, null);
    if(parent){
        parent.addChild(text);
    }
    return text;
}

function createGroup(padding){
    var group = graph.createGroup();
    group.groupImage = graphs.group_cloud;
    group.padding = padding || 30;
    return group;
}

function createEdge(a, b, color, dashed, name){
    var edge = graph.createEdge(name, a, b);
    if(dashed){
        edge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 5]);
    }
    edge.setStyle(Q.Styles.EDGE_WIDTH, 3);
    edge.setStyle(Q.Styles.EDGE_COLOR, color);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    return edge;
}

var VPNFlexEdgeUI = function(edge, graph){
    Q.doSuperConstructor(this, VPNFlexEdgeUI, arguments);
}
VPNFlexEdgeUI.prototype = {
    drawEdge: function(path, fromUI, toUI, edgeType, fromBounds, toBounds){
        var from = fromBounds.center;
        path.curveTo(from.x, from.y, internet.x, internet.y);
    }
}

Q.extend(VPNFlexEdgeUI, Q.EdgeUI);

createText("公共事业服务\n中心网络拓扑图", 859, 100, 40, "#F00");

var group = createGroup(50);
var a = createNode("server.png", 388, 219, "存储", group);
var b = createNode("exchange2.png", 313, 289, "光纤交换机", group);
createEdge(a, b, "#F00");
var c = createNode("server.png", 153, 355, null, group);
createEdge(b, c, "#F00", true);
c = createNode("server.png", 193, 371, null, group);
createEdge(b, c, "#F00", true);
c = createNode("server.png", 231, 387, null, group);
createEdge(b, c, "#F00", true);
c = createNode("server.png", 271, 405, null, group);
createEdge(b, c, "#F00", true);

var d = createNode("exchange.png", 367, 415, "交换机", group);
createEdge(c, d, "#45E");
var e = createNode("firewall.png", 487, 413, "IPS", group);
createEdge(d, e, "#45E");
var f = createNode("exchange2.png", 615, 445, "核心交换机", group);
createEdge(e, f, "#45E");
var g = createNode("firewall.png", 761, 443, "防火墙", group);
createEdge(f, g, "#45E");
var h = createNode("router.png", 903, 437, "路由器", group);
createEdge(g, h, "#45E");
var i = createNode("pc.png", 351, 511, "内网PC", group);
var i2 = createNode("pc.png", 351, 611, "内网PC", group);
var j = createNode("exchange.png", 499, 517, null, group);
var j2 = createNode("exchange.png", 499, 607, null, group);
var k = createNode("exchange2.png", 613, 583, null, group);
var l = createNode("firewall.png", 759, 567, null, group);
var m = createNode("router.png", 905, 567, null, group);

createText("公共事业服务中心\n中心局域网", 609, 271, 30, "#F00", group);

createEdge(i, j, "#45E");
createEdge(i, j, "#45E");
createEdge(i, j, "#45E");
createEdge(i2, j2, "#45E");
createEdge(i2, j2, "#45E");
createEdge(i2, j2, "#45E");

createEdge(e, k, "#45E", true);
createEdge(j, f, "#45E");
createEdge(j, k, "#45E", true);
createEdge(j2, f, "#45E");
createEdge(j2, k, "#45E", true);

createEdge(f, k, "#45E");
createEdge(k, f, "#45E");
createEdge(k, l, "#45E");
createEdge(l, m, "#45E");
createEdge(f, l, "#45E", true);
createEdge(k, g, "#45E", true);
createEdge(g, m, "#45E", true);
createEdge(l, h, "#45E", true);

var internet = createNode(graphs.group_cloud, 1155, 495, "Internet");
internet.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
internet.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
internet.setStyle(Q.Styles.LABEL_FONT_SIZE, 24);
internet.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
internet.size = {width: 200};

createEdge(internet, h).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;
createEdge(internet, m).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;

var n = createSubGroup(1139, 0, Colors.blue);
var o = createSubGroup(1339, 199);
var p = createSubGroup(1450, 421);
var q = createSubGroup(1300, 600);
var r = createSubGroup(1080, 771);

createEdge(internet, n).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;
createEdge(internet, o).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;
createEdge(internet, p).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;
createEdge(internet, q).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;
createEdge(internet, r).edgeType = Q.Consts.EDGE_TYPE_ZIGZAG;

createEdge(h, n, "#F80", true, "VPN").uiClass = VPNFlexEdgeUI;
createEdge(h, o, "#F80", true).uiClass = VPNFlexEdgeUI;
createEdge(h, p, "#F80", true).uiClass = VPNFlexEdgeUI;
createEdge(m, q, "#F80", true).uiClass = VPNFlexEdgeUI;
createEdge(m, r, "#F80", true).uiClass = VPNFlexEdgeUI;

function createSubGroup(x, y, renderColor){
    var group = createGroup();
    group.name = "分支机构";
    if(renderColor){
        group.setStyle(Q.Styles.RENDER_COLOR, renderColor);
    }
    var a = createNode("router.png", 49 + x, 100 + y, "路由器", group);
    var b = createNode("exchange.png", 191 + x, 100 + y, "交换机", group);
    createNode("pc.png", 313 + x, 100 + y, "内网PC", group);
    createEdge(a, b, "#45E");
    return a;
}