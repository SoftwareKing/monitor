/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.zoomToOverview();

var idIndex = 0;
function createNodeLinkToBus(bus, x, y, angle){
    var node = graph.createNode("-" + idIndex, x, y);
    node.image = Q.Graphs.server;
    node.host = bus;
    idIndex++;
    var edge = createEdge(bus, node, angle);
    return node;
}

function createEdge(a, b, angle){
    var edge = graph.createEdge(a, b);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.angle = angle;
    return edge;
}

function createBus(path){
    var bus = new Q.Bus(null, path);
    graph.graphModel.add(bus);
    bus.setStyle(Q.Styles.SHAPE_STROKE, 5);
    bus.setStyle(Q.Styles.SHAPE_FILL_COLOR, false);
    return bus;
}

function createTerminal(name, x, y){
    var node = graph.createNode(name, x, y);
    node.image = Q.Shapes.getShape(Q.Consts.SHAPE_RECT, 30, 15);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#888");
    return node;
}

var bus = createBus();
bus.moveTo(-250, -80);
bus.lineTo(-250, -120);
bus.moveTo(-250, -100);
bus.lineTo(300, -100);
bus.lineTo(300, 100);
bus.lineTo(-250, 100);
bus.moveTo(-250, 80);
bus.lineTo(-250, 120);

var t1 = createTerminal("T1", -310, -100);
var t2 = createTerminal("T2", -310, 100);
t1.host = bus;
t2.host = bus;
createEdge(t1, bus, 0);
createEdge(t2, bus, 0);

var startX = -160;
var vGap = 50;
var hGap = 30;
while(startX < 170){
    createNodeLinkToBus(bus, startX, vGap - 100, Math.PI / 2);
    startX += hGap;
    createNodeLinkToBus(bus, startX, -vGap - 100, Math.PI / 2);
    startX += hGap;
}
startX = -160;
while(startX < 170){
    createNodeLinkToBus(bus, startX, vGap + 100, Math.PI * 0.3);
    startX += hGap;
    createNodeLinkToBus(bus, startX, -vGap + 100, Math.PI * -0.3);
    startX += hGap;
}
var startY = -70;
while(startY < 80){
    createNodeLinkToBus(bus, 300 - vGap, startY, Math.PI + Math.PI / 8);
    startY += hGap;
    createNodeLinkToBus(bus, 300 + vGap, startY, Math.PI / 8);
    startY += hGap;
}
