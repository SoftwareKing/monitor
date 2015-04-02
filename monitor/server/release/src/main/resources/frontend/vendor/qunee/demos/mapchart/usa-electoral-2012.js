/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.styles = {};
graph.styles[Q.Styles.LABEL_FONT_SIZE] = 16;

var STROKE_COLOR = Q.toColor(0xCCC);
function createShape(tooltip, path, fillColor, stroke, stokeWidth){
    var node = graph.createNode();
    node.tooltip = tooltip;
    node.anchorPosition = null;
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, fillColor);
    if(stokeWidth){
        node.setStyle(Q.Styles.SHAPE_STROKE, stokeWidth);
        node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, stroke || STROKE_COLOR);
    }else{
        node.setStyle(Q.Styles.SHAPE_STROKE, 0);
    }
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.image = path;
    return node;
}

function createText(name, x, y){
    var text = graph.createText(name, x, y);
    text.zIndex = 1;
    text.anchorPosition = Q.Position.LEFT_BOTTOM;
    return text;
}

function svgToNode(p){
    var tagName = p.tagName.toLowerCase();
    if(tagName == "tspan"){
        if(p.childNodes.length == 0){
            return;
        }
        var text = Q.isIE ? p.childNodes[0].nodeValue : p.textContent;
        return createText(text, parseFloat(p.getAttribute("x")), parseFloat(p.getAttribute("y")));
    }
    
    if(tagName == "path"){
        var d = p.getAttribute("d");
        if(!d){
            return;
        }
        var path = SVGPathToPath(d);
    }else if(tagName == "rect"){
        var path = SVGRectToPath(p);
    }else{
        return;
    }
    var style = p.getAttribute("style");
    var fillColor, stroke, stokeWidth;
    if(style){
        var styles = style.split(";");
        Q.forEach(styles, function(s){
            var nameValue = s.trim().split(":");
            if(nameValue[0] == "fill"){
                fillColor = nameValue[1];
                if(fillColor.trim() == "none"){
                    fillColor = null;
                }
            }else if(nameValue[0] == "stroke"){
                stroke = nameValue[1];
            }else if(nameValue[0] == "stroke-width"){
                stokeWidth = parseFloat(nameValue[1]);
            }
        });
    }
    return createShape(p.getAttribute("id"), path, fillColor, stroke, stokeWidth);
}

function parseMapData(){
    Q.loadXML("./mapchart/usa-electoral-2012.svg", function(doc){
        Q.forEach(doc.getElementsByTagName("path"), svgToNode);
        Q.forEach(doc.getElementsByTagName("rect"), svgToNode);
        Q.forEach(doc.getElementsByTagName("tspan"), svgToNode);
        graph.zoomToOverview();
    }, showError);
}

parseMapData();
