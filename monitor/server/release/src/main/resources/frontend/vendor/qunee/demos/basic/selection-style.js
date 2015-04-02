/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.moveToCenter();

var selectionTypes = [Q.Consts.SELECTION_TYPE_BORDER, Q.Consts.SELECTION_TYPE_SHADOW, Q.Consts.SELECTION_TYPE_BORDER_RECT];
var y = 50;
var i = 0;
while(++i < 5){
    var x = 50;
    var styles = {};
    styles[Q.Styles.SELECTION_BORDER] = i * 2;
    styles[Q.Styles.SELECTION_SHADOW_BLUR] = i * 5;
    styles[Q.Styles.SELECTION_COLOR] = Q.randomColor();
    selectionTypes.forEach(function(type){
        styles[Q.Styles.SELECTION_TYPE] = type;
        var hello = graph.createNode("Hello", x, y);
        var qunee = graph.createNode("Qunee", x + 150, y + 50);
        var edge = graph.createEdge("Hello\nQunee", hello, qunee);
        hello.putStyles(styles);
        qunee.putStyles(styles);
        edge.putStyles(styles);
        x += 230;
    });
    y += 100;
}

graph.selectAll();