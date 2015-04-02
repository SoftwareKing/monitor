/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

graph.styles = {};
graph.styles[Q.Styles.LABEL_FONT_SIZE] = 16;
graph.styles[Q.Styles.SHAPE_FILL_COLOR] = null;

var PADDING = new Q.Insets(0, 4);
var STATIONS = {};
var lines = {}, lineStatus = [];
var doubleLane = false;
var size = 10;
var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, size, size);
var roundRect = Q.Shapes.getRect(0, 0, size * 2, size, size * 0.5);

function getStation(id){
    return STATIONS[id];
}

function createText(name, x, y, rotate){
    var text = graph.createNode(name, x, y);
    if(rotate){
        text.rotate = rotate;
    }
    text.zIndex = 20;
    text.image = null;
    text.setStyle(Q.Styles.BACKGROUND_COLOR, Q.toColor(0x88FFFFFF));
    text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_BOTTOM);
    text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    text.setStyle(Q.Styles.LABEL_PADDING, PADDING);
    return text;
}

function createStation(station){
    var node = graph.createNode(null/**station.name*/, station.x, station.y);
    node.stationId = station.id;
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 10);
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.zIndex = 10;
    if(station.rotate){
        node.image = roundRect;
        node.rotate = station.rotate;
    }else{
        node.image = circle;
    }
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#FFF");
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#000");
    return node;
}

function createLine(line) {
    var stations = line.stations;

    var node = graph.createNode(line.name);

    lines[line.id || line.name] = node;

    node.data = line;
    node.lineDirection = line.direction;
    node.stations = stations;
    node.movable = false;
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 50);
    node.setStyle(Q.Styles.LABEL_COLOR, line.color);
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_BOTTOM);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_TOP);
    node.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
    node.anchorPosition = null;
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, line.color);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);

    updateLine(node, true, doubleLane);
    return node;
}

function drawDoubleLine(path, points, isDoubleLine, size, lineDirection) {
    var p0, p1;
    Q.forEach(points, function (p) {
        if (!p1) {
            p1 = p;
            return;
        }
        p1._a = Math.atan2(p.y - p1.y, p.x - p1.x);
        if (p0) {
            p1.angle = Math.atan2(Math.sin(p0._a) + Math.sin(p1._a), Math.cos(p0._a) + Math.cos(p1._a));
            p1.angle -= Math.PI / 2;
            var theta = Math.abs(p1._a - p0._a);
            if (theta > Math.PI) {
                theta = 2 * Math.PI - theta;
            }
            p1.inclinedAngle = Math.PI - theta;
        } else {
            p1.angle = p1._a - Math.PI / 2;
        }
        p0 = p1;
        p1 = p;
    });
    p1.angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI / 2;

    if (lineDirection == "left") {
        drawLine(path, points, 0.5, size);
        return;
    }
    if (lineDirection == "right") {
        drawLine(path, points, -0.5, size);
        return;
    }
    if (!isDoubleLine) {
        drawLine(path, points, 0, size);
        return;
    }
    drawLine(path, points, 0.5, size);
    drawLine(path, points, -0.5, size);
}

function drawLine(path, points, yOffset, size, doubleLine) {
    Q.forEach(points, function (p, index) {
        var angle = p.angle;
        var inclinedAngle = p.inclinedAngle;

        var x = p.x, y = p.y;
        var offset = yOffset;
        if (offset) {
            offset *= 2 / 3 * 0.8;
        }
        if (p.yOffset) {
            offset += p.yOffset;
        }
        if (offset) {
            offset *= size;
            if (inclinedAngle) {
                offset /= Math.max(0.2, Math.sin(inclinedAngle / 2));
            }
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            x += cos * offset;
            y += sin * offset;
        }
        if (index == 0) {
            path.moveTo(x, y);
        } else {
            path.lineTo(x, y);
        }
    });
}

function updateLine(line, addListener, isDoubleLane) {
    var path = new Q.Path();
    line.image = path;

    isDoubleLane = isDoubleLane || line.doubleLane;

    var stations = line.stations;

    var points = [];
    Q.forEach(stations, function (s) {
        var station = getStation(s.id || s);
        if (station) {
            points.push({node: station, x: station.x, y: station.y, yOffset: s.yOffset});
        }
    });

    if (addListener) {
        Q.forEach(points, function (p) {
            addLocationChangeListener(p.node.stationId, line);
        });
    }

    drawDoubleLine(path, points, isDoubleLane, size, line.lineDirection);
    if(isDoubleLane || line.lineDirection){
        line.setStyle(Q.Styles.SHAPE_STROKE, size / 3);
    }else{
        line.setStyle(Q.Styles.SHAPE_STROKE, size);
    }
}

var stationLocationChangeListeners = {};

function addLocationChangeListener(stationId, line){
    var listeners = stationLocationChangeListeners[stationId];
    if(!listeners){
        listeners = {};
        stationLocationChangeListeners[stationId] = listeners;
    }
    if(line.id in listeners){
        return;
    }
    listeners[line.id] = line;
}

graph.interactionDispatcher.addListener(function(evt){
    if(evt.kind != Q.InteractionEvent.ELEMENT_MOVING){
        return;
    }
    var datas = evt.datas;
    
    Q.forEach(datas, function(data){
	    if(!data.stationId){
	        return;
	    }
	    var listeners = stationLocationChangeListeners[data.stationId];
	    if(listeners){
	        for(var l in listeners){
	            updateLine(listeners[l]);
	        }
	    }
    });
});

function loadMetroDatas(metroData){
	Q.forEach(metroData.stations, function(s){
	    var station = createStation(s);
        STATIONS["" + s.id] = station;
	});
    Q.forEach(metroData.labels, function(l){
        createText(l.text, l.x, l.y, l.rotate);
    });
    Q.forEach(metroData.lines, createLine);
	graph.zoomToOverview();
}

function onlanechange(evt){
    var checked = evt.target.checked;
    for(var name in lines){
        var line = lines[name];
        line.doubleLane = checked;
        updateLine(line);
    }
}
function onlayerchange(evt){
    var checked = evt.target.checked;
    for(var name in lines){
        var line = lines[name];
        var color = checked ? "#CCC" : line.data.color;
        line.setStyle(Q.Styles.SHAPE_STROKE_STYLE, color);
    };
    if(!checked){
        lineStatus.forEach(function(line){
            graph.removeElement(line);
        });
        return;
    }
    Q.loadJSON("./mapchart/Shanghai_Metro-status.json", function(json){
        lineStatus.forEach(function(line){
            graph.removeElement(line);
        });
        Q.forEach(json, function(l){
            var fragments = l.fragments;
            var parent = lines[l.line];
            Q.forEach(fragments, function(line){
                var stations = line.stations;
                var node = graph.createNode();
                lineStatus.push(node);
                node.data = line;
                node.lineDirection = line.direction;
                node.stations = stations;
                node.movable = false;
                node.anchorPosition = null;
                node.setStyle(Q.Styles.SHAPE_STROKE, size / 3);
                node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, line.color);

                if(parent){
                    node.parent = parent;
                }
                updateLine(node, true, true);
            })
        })
    });
}

Q.loadJSON("./mapchart/Shanghai_Metro.json?v=1.4", loadMetroDatas, showError);

var toolbox = document.createElement("div");
toolbox.id = "toolbox";
Q.css(toolbox, {
    position: "absolute",
    top: "100px",
    right: "0px"
});
graph.html.parentNode.appendChild(toolbox);
toolbox.innerHTML = "<label><input type=\"checkbox\">显示双车道</label><br>\
<label><input type=\"checkbox\">显示路况信息</label>";
var inputs = toolbox.getElementsByTagName("input");
var doubelLaneButton = inputs[0];
var laneStatusButton = inputs[1];
if(doubleLane){
    doubelLaneButton.setAttribute("checked", "checked");
}
doubelLaneButton.onclick = onlanechange;
laneStatusButton.onclick = onlayerchange;

function destroy(){
    toolbox.parentNode.removeChild(toolbox);
}
