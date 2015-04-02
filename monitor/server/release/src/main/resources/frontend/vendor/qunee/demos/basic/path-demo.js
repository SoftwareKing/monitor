/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

var path = new Q.Path();

function calculateDistance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

var points = [[150, 0], [400, 0], [400, 150], [330, 300], [50, 250], [0, 0], [150, 0]];
var i = 0;
var prev, current, next;
while(i < points.length){
    current = points[i];
    next = points[i + 1];
    if(!prev){
        path.moveTo(current[0], current[1]);
    }else if(!next){
        path.lineTo(current[0], current[1]);
    }else{
        var l1 = calculateDistance(prev[0], prev[1], current[0], current[1]);
        var l2 = calculateDistance(current[0], current[1], next[0], next[1]);
        var r = 50;
        var x0, y0, x1, y1;
        if(l1 <= r){
            x0 = prev[0];
            y0 = prev[1];
        }else{
            var angle = Math.atan2(prev[1] - current[1], prev[0] - current[0]);
            x0 = current[0] + Math.cos(angle) * r;
            y0 = current[1] + Math.sin(angle) * r;
        }
        if(l2 <= r){
            x1 = next[0];
            y1 = next[1];
        }else{
            var angle = Math.atan2(next[1] - current[1], next[0] - current[0]);
            x1 = current[0] + Math.cos(angle) * r;
            y1 = current[1] + Math.sin(angle) * r;
        }
        path.lineTo(x0, y0);
        path.quadTo(current[0], current[1], x1, y1);
    }
    prev = current;
    i++;
}

path.validate();

var nodeShape = graph.createNode();
nodeShape.setStyle(Q.Styles.SHAPE_STROKE, 20);
nodeShape.setStyle(Q.Styles.SHAPE_STROKE_STYLE, Colors.blue);
nodeShape.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#55FF00");
nodeShape.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
nodeShape.image = path;
nodeShape.movable = false;

var line = graph.createNode(null, 0, 0);
line.setStyle(Q.Styles.SHAPE_STROKE, 1);
line.setStyle(Q.Styles.SHAPE_STROKE_STYLE, Colors.yellow);
line.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);
line.setStyle(Q.Styles.SHAPE_LINE_DASH, [5, 2]);
line.image = path;
line.movable = false;
line.zIndex = 10;

var car = graph.createNode(null, 150 - path.bounds.cx, -path.bounds.cy);
car.setStyle(Q.Styles.SHAPE_FILL_COLOR, Colors.yellow);
car.image = Q.Shapes.getRect(-10, -5, 20, 10);
car.zIndex = 20;

var L = path.length;
var x = 0;
var INTERVAL = 200;
var timer = setTimeout(function MOVE(){
    x += 10;
    x %= L;
    var p = path.getLocation(x);
    car.location = new Q.Point(p.x-path.bounds.cx, p.y-path.bounds.cy);
    car.rotate = p.rotate;
    timer = setTimeout(MOVE, INTERVAL);
}, INTERVAL);

function destroy(){
    clearTimeout(timer);
}