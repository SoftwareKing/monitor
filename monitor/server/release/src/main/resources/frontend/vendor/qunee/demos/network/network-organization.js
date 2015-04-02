/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.moveToCenter(0.8);

function createNode(name, x, y, image){
    var node = graph.createNode(name, x, y);
    if(image){
        node.image = "./network/images/" + image;
    }
    return node;
}
function createEdge(name, from, to, edgeType){
    var edge = graph.createEdge(name, from, to);
    edge.setStyle(Q.Styles.LABEL_RADIUS, 0);
    edge.setStyle(Q.Styles.LABEL_ROTATABLE, false);
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFFFFF");
    edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFFFFF");
    edge.setStyle(Q.Styles.ARROW_TO, false);
    
    if(edgeType){
        edge.edgeType = edgeType;
    }
    return edge;
}

//nodes
var title = graph.createText("Network Organization Chart", 800, 90);
title.setStyle(Q.Styles.LABEL_FONT_SIZE, 30);
title.setStyle(Q.Styles.LABEL_FONT_FAMILY, "Times");
title.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
title.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, Colors.blue);
title.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, Q.Gradient.LINEAR_GRADIENT_VERTICAL);
title.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(7, 15));
title.setStyle(Q.Styles.LABEL_RADIUS, 20);
title.image = null;

var node1 = createNode("", 100, 100, "db.png");
var node2 = createNode("", 220, 100, "ex1.png");
var node3 = createNode("", 333, 100, "www.png");
var node4 = createNode("", 220, 195, "ex2.png");
var node5 = createNode("", 95, 270, "search.png");
var node6 = createNode("Fx/Tx", 270, 350, "FxTx.png");
var node7 = createNode("", 323, 350, "icon1.png");
var node8 = createNode("Fx/Tx", 375, 350, "FxTx.png");
var node9 = createNode("", 125, 430, "FxTx.png");
var node10 = createNode("", 125, 522, "icon1.png");
var node11 = createNode("internet", 300, 577, "internet.png");
node11.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
node11.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
node11.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_MIDDLE);
node11.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_MIDDLE);

var node12 = createNode("Ethernet", 500, 350, "ex2.png");
var node13 = createNode("", 500, 577, "server1.png");
var node14 = createNode("", 665, 226, "ex2.png");
var node15 = createNode("", 665, 296, "ex2.png");
var node16 = createNode("", 665, 366, "ex2.png");
var node17 = createNode("", 665, 436, "ex2.png");
var node18 = createNode("", 665, 506, "ex2.png");

var node19 = createNode("Cloud", 866, 366, "cloud.png");
node19.setStyle(Q.Styles.LABEL_FONT_SIZE, 30);
node19.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
node19.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);

//edges
var edge = createEdge("10BaseT", node1, node4, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
edge = createEdge("10BaseTX", node2, node4);
edge = createEdge("10BaseT", node3, node4, Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL);

edge = createEdge("10BaseT", node5, node4, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
edge.setStyle(Q.Styles.EDGE_TO_OFFSET, {x: -15});
edge = createEdge("10BaseTX", node6, node4, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
edge.setStyle(Q.Styles.EDGE_TO_OFFSET, {x: 15});
edge = createEdge("10BaseT", node9, node4, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
edge = createEdge("", node6, node7);
edge = createEdge("", node7, node8);
edge = createEdge("Protocol Translator", node9, node10);
edge = createEdge("", node10, node11, Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL);

edge = createEdge("10BaseTX", node8, node12);
edge = createEdge("10BaseTX", node12, node13);
edge = createEdge("10BaseTX", node12, node17, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
edge = createEdge("10BaseTX", node14, node15);
edge = createEdge("10BaseTX", node15, node16);
edge = createEdge("10BaseTX", node16, node17);
edge = createEdge("10BaseTX", node17, node18);
edge = createEdge("", node14, node19);
edge = createEdge("", node15, node19);
edge = createEdge("", node16, node19);
edge = createEdge("", node17, node19);
edge = createEdge("", node18, node19);