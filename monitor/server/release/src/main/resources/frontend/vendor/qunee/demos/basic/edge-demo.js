/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

graph.styles = {}
graph.styles[Q.Styles.ARROW_TO_STYLES] = {
        lineWidth: 1,
        lineJoin: "round"//"miter"
    }


var node1 = graph.createNode("001", -230, -150);
var node2 = graph.createNode("002", 200, -150);
var node3 = graph.createNode("003", 0, 0);
var node4 = graph.createNode("004", -200, 150);
var node5 = graph.createNode("005", 200, 150);

function createEdge(from, to, type, lineWidth, color){
    var edge = graph.createEdge(from.name + " --> " + to.name, from, to);
    edge.setStyle(Q.Styles.EDGE_COLOR, color || "#000");
    edge.setStyle(Q.Styles.EDGE_WIDTH, lineWidth || 2);
    edge.edgeType = type || Q.Consts.EDGE_TYPE_DEFAULT;
    return edge;
}

var edge = createEdge(node1, node2);
edge.setStyle(Q.Styles.ARROW_FROM, true);
edge.setStyle(Q.Styles.ARROW_FROM_OFFSET, {x: 0.5});

var loopedEdge = createEdge(node1, node1, null, 1, "red");
createEdge(node1, node1, null, 1, "blue");
createEdge(node1, node1, null, 1, "blue");
var edge = createEdge(node2, node1, null, 1, "red");
createEdge(node1, node2, null, 3, "blue");
createEdge(node1, node3, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
createEdge(node2, node3, Q.Consts.EDGE_TYPE_EXTEND_RIGHT);

var edge1 = createEdge(node3, node4, Q.Consts.EDGE_TYPE_ELBOW);
edge1.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 0.01, 4]);
edge1.setStyle(Q.Styles.LINE_CAP, "round");
edge1.setStyle(Q.Styles.ARROW_TO, Q.Consts.SHAPE_TRIANGLE);
edge1.setStyle(Q.Styles.ARROW_TO_SIZE, {width: 16, height: 14});
edge1.setStyle(Q.Styles.ARROW_TO_STROKE, 1);
edge1.setStyle(Q.Styles.ARROW_TO_STROKE_STYLE, "#000");
edge1.setStyle(Q.Styles.ARROW_TO_FILL_GRADIENT, Q.Gradient.RAINBOW_LINEAR_GRADIENT_VERTICAL);
edge1.setStyle(Q.Styles.ARROW_FROM, Q.Consts.SHAPE_CIRCLE);
edge1.setStyle(Q.Styles.ARROW_FROM_SIZE, 8);
edge1.setStyle(Q.Styles.EDGE_OUTLINE, 1);
edge1.setStyle(Q.Styles.EDGE_OUTLINE_STYLE, "#0F0");

var edge2 = createEdge(node3, node5, Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL, 2, Colors.blue);
edge2.setStyle(Q.Styles.EDGE_LINE_DASH, [2, 1]);
edge2.setStyle(Q.Styles.ARROW_TO_LINE_DASH, [2, 1]);
var edge3 = createEdge(node1, node4, Q.Consts.EDGE_TYPE_ORTHOGONAL);
edge3.setStyle(Q.Styles.ARROW_FROM, Q.Consts.SHAPE_CROSS);
edge3.setStyle(Q.Styles.ARROW_FROM_FILL_COLOR, "#58F");
edge3.setStyle(Q.Styles.ARROW_FROM_OFFSET, {x: 20});
edge3.setStyle(Q.Styles.ARROW_FROM_STROKE, 1);
edge3.setStyle(Q.Styles.ARROW_TO, Q.Consts.SHAPE_ARROW_3);
edge3.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#000");
edge3.setStyle(Q.Styles.ARROW_TO_STROKE, 1);

var edge4 = createEdge(node2, node4);
edge4.addPathSegement([200, -180]);
edge4.addPathSegement([250, -180]);
edge4.addPathSegement([250, 200]);
edge4.addPathSegement([-250, 200]);
edge4.addPathSegement([-250, 150]);
var label1 = new Q.LabelUI();
label1.position = Q.Position.LEFT_BOTTOM;
label1.anchorPosition = Q.Position.LEFT_BOTTOM;
label1.offsetX = 10;
edge4.addUI(label1, {bindingProperty : "data",
    property : "leftLabel",
    propertyType : Q.Consts.PROPERTY_TYPE_STYLE});
var label2 = new Q.LabelUI();
label2.position = Q.Position.RIGHT_BOTTOM;
label2.anchorPosition = Q.Position.RIGHT_TOP;
label2.offsetX = -10;
edge4.addUI(label2, {bindingProperty : "data",
    property : "rightLabel",
    propertyType : Q.Consts.PROPERTY_TYPE_STYLE});
edge4.setStyle("leftLabel", "Left");
edge4.setStyle("rightLabel", "Right");

var offset = 0;
var index = 0;
var timer = setInterval(function(){
    offset += -1;
//    edge2.setStyle(Q.Styles.EDGE_LINE_DASH_OFFSET, offset);
    edge1.setStyle(Q.Styles.EDGE_LINE_DASH_OFFSET, offset);
    index++;
    index = index%20;
    edge2.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
    edge1.setStyle(Q.Styles.ARROW_FROM_OFFSET, {x: 0.3 + 0.02 * (20 - index), y: -10});
}, 150);

function destroy(){
    clearInterval(timer);
}