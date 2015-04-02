/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

var node1 = graph.createNode("Mouse Over - A", -120, -150);
var clickableNode = graph.createNode("Click at Me - B", 120, -100);
clickableNode.clickable = true;
var dblclickableEdge = graph.createEdge("Double Click at Me\n - Edge", node1, clickableNode);
dblclickableEdge.dblclickable = true;
dblclickableEdge.setStyle(Q.Styles.LABEL_OFFSET_Y, -10);
dblclickableEdge.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
dblclickableEdge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_BOTTOM);
dblclickableEdge.setStyle(Q.Styles.LABEL_BORDER, 1);
dblclickableEdge.setStyle(Q.Styles.LABEL_POINTER, true);
dblclickableEdge.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(2, 5));

var colorShape = graph.createNode("Mouse Move to Change Fill Color", 0, 0);
var rect = Q.Shapes.getRect(-100, -50, 200, 150, 5, 5);
colorShape.image = rect;
colorShape.setStyle(Q.Styles.SHAPE_STROKE, 0);
colorShape.setStyle(Q.Styles.SHAPE_FILL_COLOR, Colors.blue);
colorShape.setStyle(Q.Styles.SHAPE_FILL_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, [Q.toColor(0x44EEEEEE), Q.toColor(0x44000000)], null, Math.PI/2));

var currentElement;
var highlightColor = Colors.yellow;
function unhighlight(element){
    if(element instanceof Q.Edge){
        element.setStyle(Q.Styles.EDGE_COLOR, null);
        currentElement.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, null);
        return;
    }
    element.setStyle(Q.Styles.BACKGROUND_COLOR, null);
    element.setStyle(Q.Styles.PADDING, null);
}
function highlight(element){
    if(currentElement == element){
        return;
    }
    if(currentElement){
        unhighlight(currentElement);
    }
    currentElement = element;
    if(!currentElement){
        return;
    }
    if(currentElement instanceof Q.Edge){
        currentElement.setStyle(Q.Styles.EDGE_COLOR, highlightColor);
        currentElement.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, highlightColor);
        return;
    }
    currentElement.setStyle(Q.Styles.BACKGROUND_COLOR, highlightColor);
    currentElement.setStyle(Q.Styles.PADDING, new Q.Insets(5));
}

graph.addCustomInteraction({
    onstart: function(evt, graph){
        Q.log("start");
    },
    onmousemove: function(evt, graph){
        var ui = graph.getUIByMouseEvent(evt);
        if(!ui){
            graph.cursor = null;
            highlight(null);
            return;
        }
        graph.cursor = "pointer";
        highlight(ui.data);
        if(ui.data == colorShape){
            graph.cursor = "crosshair";
            var point = graph.toLogical(evt);
            var uiBounds = graph.getUIBounds(ui);
            var left = uiBounds.x;
            var top = uiBounds.y;
            var r = parseInt(255 * (point.x - left) / uiBounds.width);
            var g = parseInt(255 * (point.y - top) / uiBounds.height);
            colorShape.setStyle(Q.Styles.SHAPE_FILL_COLOR, "rgb(" + r + "," + g + ", 255)");
            return;
        }
    },
    onrelease: function(evt, graph){
        Q.log("release");
    },
    onmousewheel: function(evt, graph){
        Q.log("mousewheel - " + evt.delta);
    },
    onkeydown: function(evt, graph){
        Q.log("keydown");
    },
    onclick: function(evt, graph){
        Q.log("click");
        var ui = graph.getUIByMouseEvent(evt);
        if(ui && ui.data.clickable){
            alert("Clicked at - '" + ui.data.name + "'");
        }
    },
    ondblclick: function(evt, graph){
        Q.log("dblclick");
        var ui = graph.getUIByMouseEvent(evt);
        if(ui && ui.data.dblclickable){
            alert("Double Clicked at - '" + ui.data.name + "'");
        }
    },
    onlongpress: function(evt, graph){
        Q.log("hold");
    }
});