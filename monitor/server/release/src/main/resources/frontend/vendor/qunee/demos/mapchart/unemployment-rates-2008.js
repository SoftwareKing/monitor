/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.styles = {};
graph.styles[Q.Styles.SELECTION_COLOR] = "#FFFF00";
graph.styles[Q.Styles.SELECTION_SHADOW_BLUR] = 4;
graph.styles[Q.Styles.SHAPE_FILL_COLOR] = null;
graph.disableRectangleSelection = true;
graph.isMovable = function(){ return false; };
graph.isSelectable = function(d){ return d.className != "states"; };

var FILL_COLOR = Q.toColor(0x555577EE);
function createShape(tooltip, path, fillColor, stroke, strokeWidth){
    var node = graph.createNode();
    node.tooltip = tooltip;
    node.anchorPosition = null;
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, fillColor);
    if(stroke){
        node.setStyle(Q.Styles.SHAPE_STROKE, strokeWidth || 0.1);
        node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, stroke);
    }else{
        node.setStyle(Q.Styles.SHAPE_STROKE, 0);
    }
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.image = path;
    return node;
}

function createText(name, x, y){
    var text = graph.createNode(name, x, y);
    text.zIndex = 1;
    text.image = null;
    text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_BOTTOM);
    text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    return text;
}

function svgToPath(p) {
	var d = p.getAttribute("d");
	if (!d) {
		return;
	}
	var className = p.getAttribute("class");
	var s = getStyles(className);
	if (!s) {
		return;
	}
	var path = SVGPathToPath(d);
	var fillColor = s.fill;
	var stroke = s.stroke;
	var node = createShape(p.getAttribute("id"), path, fillColor, stroke, s["stroke-width"]);
    node.className = className;
    if(className == "states"){
        node.zIndex = 1;
    }
}
var CLASS_STYLES = {
    "q0-9": { fill:"rgb(247,251,255)", stroke: "#DDD" },
    "q1-9": { fill: "rgb(222,235,247)", stroke: "#DDD" },
    "q2-9": { fill: "rgb(198,219,239)", stroke: "#DDD" },
    "q3-9": { fill: "rgb(158,202,225)", stroke: "#DDD" },
    "q4-9": { fill: "rgb(107,174,214)", stroke: "#DDD" },
    "q5-9": { fill: "rgb(66,146,198)", stroke: "#DDD" },
    "q6-9": { fill: "rgb(33,113,181)", stroke: "#DDD" },
    "q7-9": { fill: "rgb(8,81,156)", stroke: "#DDD" },
    "q8-9": { fill: "rgb(8,48,107)", stroke: "#DDD" },
    "states": {
        stroke: "#fff",
        "stroke-width": 1
    }
}

function getStyles(className){
    return CLASS_STYLES[className];
    if(s){
        return s.fill;
    }
}

function parseMapData(){
    var url = "./mapchart/unemployment-rates-2008.svg";
    var loading = graph.createNode("Loading '" + url + "' ...");
    loading.image = null;
    Q.loadXML(url, function(doc){
        var start = Date.now();
        graph.removeElement(loading);
        Q.forEach(doc.getElementsByTagName("path"), svgToPath);
        graph.zoomToOverview();
        graph.callLater(function(){
            Q.log("loading time - " + (Date.now() - start));
        });
    }, showError, null, false);
}

parseMapData();
