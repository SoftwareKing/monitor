/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.zoomToOverview();

function createNode(name, x, y, color){
    var node = graph.createText(name, x, y);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, color);
    node.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(150, 70));
    node.setStyle(Q.Styles.LABEL_RADIUS, 0);
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 18);
    node.setStyle(Q.Styles.LABEL_COLOR, "#555");
    node.setStyle(Q.Styles.BORDER, 1);
    node.setStyle(Q.Styles.BORDER_COLOR, "#555");
    node.setStyle(Q.Styles.BORDER_RADIUS, 0);
    return node;
}

var a = createNode("Implementation", 265, 54, "#dadada");
var b = createNode("Interventions", 265, 153, "#e6b9b9");
var c = createNode("Intermediate\nfactors", 265, 250, "#c6daf2");
var d = createNode("Objectives", 265, 360, "#d7e5bd");
var e = createNode("Controlling\nfactors", 75, 250, "#ccc2da");

var f = createNode("Ownership", 528, 37, "#dadada");
var g = createNode("Funding", 719, 37, "#dadada");
var h = createNode("Buy/lease\nreservoir\nstorage?", 719, 137, "#e6b9b9");
var i = createNode("Topography", 528, 211, "#ccc2da");
var j = createNode("Surface storage", 719, 293, "#c6daf2");
var k = createNode("Peak flow", 719, 394, "#c6daf2");
var l = createNode("Reduced flood\nrisk", 719, 504, "#d7e5bd");

graph.createEdge(a, b);
graph.createEdge(b, c);
graph.createEdge(c, d);
var edge = graph.createEdge(a, c);
edge.edgeType = Q.Consts.EDGE_TYPE_EXTEND_RIGHT;
edge.setStyle(Q.Styles.EDGE_EXTEND, 35);
graph.createEdge(e, c);
graph.createEdge(e, d).edgeType = Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;

graph.createEdge(f, h);
graph.createEdge(g, h);
graph.createEdge(h, j);
graph.createEdge(i, j).edgeType = Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;
graph.createEdge(j, k);
graph.createEdge(k, l);