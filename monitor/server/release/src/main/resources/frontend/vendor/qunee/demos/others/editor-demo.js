/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.callLater(function(){graph.editable = true});

graph.onElementCreated = function (element, evt, dragInfo) {
    if (element instanceof Q.Edge) {
        element.setStyle(Q.Styles.ARROW_TO, false);
        return;
    }
    if (element instanceof Q.Text) {
        element.setStyle(Styles.LABEL_BACKGROUND_COLOR, "#2898E0");
        element.setStyle(Styles.LABEL_COLOR, "#FFF");
        element.setStyle(Styles.LABEL_PADDING, new Q.Insets(3, 5));
        return;
    }
}

var toolbox = document.createElement("div");
toolbox.id = "toolbox";
Q.css(toolbox, {
    position: "absolute",
    top: "0px"
});
graph.html.parentNode.appendChild(toolbox);

function destroy(){
    toolbox.parentNode.removeChild(toolbox);
}

initToolbox();
initDatas();


function initToolbox(){
    createDNDImage(toolbox, "images/node_icon.png", "终端", {type: "Node", label: "Mac", image: "Q.Graphs.node"});
    createDNDImage(toolbox, "images/exchanger_icon.png", "交换机", {type: "Node", label: "交换机", image: "Q.Graphs.exchanger2"});
    createDNDImage(toolbox, "images/server_icon.png", "服务器", {type: "Node", label: "服务器", image: "Q.Graphs.server"});
    createDNDImage(toolbox, "images/text_icon.png", "文本", {type: "Text", label: "文本"});
    createDNDImage(toolbox, "images/group_icon.png", "分组", {type: "Group", label: "分组"});
}

function initDatas(){
    var hello = graph.createNode("Hello", -100, -100);
    hello.setStyle(Q.Styles.LABEL_ANCHOR_POSITION);
    hello.rotate = Math.PI / 6;
    var qunee = graph.createNode("Qunee", 100, 100);
    var node2 = graph.createNode("Node2", -40, 50);

    var text = graph.createText("Text", -200, 50);
    text.setStyle(Styles.LABEL_BACKGROUND_COLOR, Colors.blue);
    text.setStyle(Styles.LABEL_COLOR, "#FFF");
    text.setStyle(Styles.LABEL_PADDING, new Q.Insets(3, 5));
    text.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(100, 50));
    text.setStyle(Q.Styles.LABEL_FONT_STYLE, 'bold');
    text.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
    text.rotate = Math.PI / 2;

    var edge = graph.createEdge("points", hello, qunee);
    edge.addPathSegement([200, -100], Q.Consts.SEGMENT_LINE_TO);
    edge.addPathSegement([250, -50, 250, 50, 200, 100], Q.Consts.SEGMENT_CURVE_TO);

    var shape = graph.createShapeNode("Shape Node");
    shape.moveTo(20, -50);
    shape.lineTo(100, -50);
    shape.lineTo(100, 50);
    shape.quadTo(20, 50, 20, 20);
    shape.closePath();
    shape.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
    shape.setStyle(Q.Styles.SHAPE_STROKE, 2);
    shape.setStyle(Q.Styles.SHAPE_FILL_COLOR, false);

    graph.createEdge("Edge", hello, shape);
    graph.createEdge(shape, qunee);
    graph.createEdge(shape, node2);
}