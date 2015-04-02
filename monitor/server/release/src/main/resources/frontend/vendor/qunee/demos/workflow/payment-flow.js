/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.moveToCenter();

var GRADIENT = new Q.Gradient(Q.Consts.GRADIENT_TYPE_RADIAL, [Q.toColor(0xAAFFFFFF), Q.toColor(0x11FFFFFF)], [0.1, 0.9]);
GRADIENT.position = Q.Position.RIGHT_TOP;
GRADIENT.tx = -10;
var RECT = Q.Shapes.getRect(0, 0, 90, 50, 10);
var DIAMOND = Q.Shapes.getShape(Q.Consts.SHAPE_DIAMOND, 0, 0, 100, 80);
var BLUE = Colors.blue;
var RED = Colors.red;
var GRAY = "#555";

function createText(text, x, y){
    var node = graph.createText(text, x, y);
    node.anchorPosition = Q.Position.LEFT_BOTTOM;
    return node;
}

function createNode(host, name, x, y, highlight, isDiamond){
    var node = graph.createNode(name, x, y);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, highlight ? Colors.blue : "#DDD");
    node.setStyle(Q.Styles.SHAPE_FILL_GRADIENT, GRADIENT);
    node.setStyle(Q.Styles.SHAPE_STROKE, 1);
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#888888");
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.image = isDiamond ? DIAMOND : RECT;
    
    if(host){
        node.parent = host;
        node.host = host;
    }
    return node;
}

function createRect(name, left, top, width, height, fillColor){
    var rect = graph.createNode(name, left, top);
    rect.anchorPosition = Q.Position.LEFT_TOP;
    rect.image = Q.Shapes.getRect(0, 0, width, height);
    rect.setStyle(Q.Styles.SHAPE_STROKE, 0.3);
    rect.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
    rect.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_MIDDLE);
    rect.setStyle(Q.Styles.LABEL_ROTATE, -Math.PI / 2);
    rect.setStyle(Q.Styles.LABEL_PADDING, 5);
    if(fillColor){
        rect.setStyle(Q.Styles.SHAPE_FILL_COLOR, fillColor);
    }
    return rect;
}
function createEdge(name, from, to, edgeColor, edgeType){
    var edge = graph.createEdge(name, from, to);
    edge.setStyle(Q.Styles.LABEL_RADIUS, 0);
    edge.setStyle(Q.Styles.LABEL_ROTATABLE, false);
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFFFFF");
    edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFFFFF");
//    edge.setStyle(Q.Styles.ARROW_TO, false);
    if(edgeColor){
        edge.setStyle(Q.Styles.EDGE_COLOR, edgeColor);
    }
    
    if(edgeType){
        edge.edgeType = edgeType;
    }
    return edge;
}

//text
createText("Capture Payments", -10, 22);
var Customer = createRect("Customer", -10, 25, 650, 90, Colors.yellow);
var CRM = createRect("CRM", -10, 115, 650, 195, "#FFF");
var Billing = createRect("Billing", -10, 310, 650, 80, Colors.yellow);
var Pmt = createRect("Pmt institution", -10, 390, 650, 90, "#FFF");

//nodes
var node1 = createNode(Customer, "Customer\nProvides\nAccount Info", 78, 73);
var node2 = createNode(Customer, "Request to\nMake\nPayment", 184, 73);
var node3 = createNode(CRM, "Search\nCustomer", 78, 173);
var node4 = createNode(CRM, "View Account\nBalance", 184, 173, true);
var node6 = createNode(CRM, "One\nTime\nPayment", 311, 173, false, true);
var node7 = createNode(CRM, "Capture\nPayment\nMethod", 460, 173);
var node8 = createNode(CRM, "Submit\nPayment", 460, 240, true);
var node10 = createNode(CRM, "Receive Pmt\nConfirmation\nNumber", 250, 273, true);
var node9 = createNode(Billing, "Process\nPayment", 460, 350, true);
var node5 = createNode(Billing, "Send Account\nBalances", 184, 350, true);
var node11 = createNode(Pmt, "Provide\nConfirmation\nNumber", 460, 437);
var node12 = createNode(Pmt, "Validate\nPayment\nInformation", 565, 437);

createEdge(null, node1, node3, BLUE);
createEdge(null, node2, node4, BLUE);
var edge = createEdge(null, node4, node5, RED);
edge.setStyle(Q.Styles.ARROW_FROM, true);
createEdge(null, node4, node6, BLUE);
createEdge("Yes", node6, node7, BLUE);
createEdge(null, node7, node8, BLUE);
createEdge(null, node8, node9, RED);
edge = createEdge(null, node9, node10, RED, Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL);
edge.setStyle(Q.Styles.EDGE_FROM_OFFSET, {x: -10});
createEdge(null, node9, node11);
createEdge(null, node7, node12, GRAY, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);




