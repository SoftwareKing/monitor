/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

var icons = [];
for (var a in Q.Graphs) {
    var g = Q.Graphs[a];
    if(a[0] == "_"){
        continue;
    }
    if(!g.name){
        g.name = a;
    }
    icons.push(g);
}

var xGap = 100;
var yGap = 80;
var width = (icons.length - 1) * xGap;

function createNodes(colors, y, blendMode){
    var x = -width / 2;
    var group = graph.createGroup();
    if(Q.isString(blendMode)){
        group.name = blendMode;
    }
    group.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
    group.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_MIDDLE);
    group.setStyle(Q.Styles.LABEL_ROTATE, Math.PI / 2);
    Q.forEach(icons, function(icon, i){
        var node = graph.createNode(null, x, y);
        node.image = icon;
        node.setStyle(Q.Styles.RENDER_COLOR, colors[i]);
        node.setStyle(Q.Styles.RENDER_COLOR_BLEND_MODE, blendMode);
        node.name = colors[i];
        x += xGap;
        group.addChild(node);
    });
    return group;
}

function randomColors(){
    var colors = [];
    Q.forEach(icons, function(){
        colors.push(Q.randomColor());
    });
    return colors;
}

var colors = randomColors();

var y = -200;

createNodes(colors, y, Q.Consts.BLEND_MODE_DARKEN);
y += yGap;
createNodes(colors, y, Q.Consts.BLEND_MODE_MULTIPLY);
y += yGap;
createNodes(colors, y, Q.Consts.BLEND_MODE_COLOR_BURN);
y += yGap;
createNodes(colors, y, Q.Consts.BLEND_MODE_LINEAR_BURN);
y += yGap;
createNodes(colors, y, Q.Consts.BLEND_MODE_LIGHTEN);
y += yGap;
createNodes(colors, y, Q.Consts.BLEND_MODE_SCREEN);
y += yGap;
createNodes(colors, y, Q.Consts.BLEND_MODE_GRAY);

graph.onclick = function(evt){
    if(evt.getData()){
        return;
    }
    colors = randomColors();
    graph.forEach(function(node){
        if(node instanceof Q.Group){
            node.forEachChild(function(child, i){
                child.setStyle(Q.Styles.RENDER_COLOR, colors[i]);
                child.name = colors[i];
            });

        }
    });
}

graph.zoomToOverview();