/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
createRandomTreeDatas();

var layouter = new Q.BalloonLayouter(graph);
layouter.doLayout({
    byAnimate: true,
    callback: function(){
        graph.zoomToOverview();
    }
});

var toolbox = document.createElement("div");
toolbox.id = "toolbox";
Q.css(toolbox, {
    position: "absolute",
    top: "100px",
    right: "0px",
    "box-shadow": "-1px 0px 2px #888",
    "border-radius": "8px 0 0 8px"
});
graph.html.parentNode.appendChild(toolbox);

function destroy() {
    toolbox.parentNode.removeChild(toolbox);
}

var relayout = function(){
    var angleSpacing = $('input[name="angleSpacing"]:checked').val();
    var radiusMode = $('input[name="radiusMode"]:checked').val();
    layouter.angleSpacing = angleSpacing;
    layouter.radiusMode = radiusMode;
    layouter.doLayout({byAnimate: true});
}
var angleDiv = document.createElement("div");
toolbox.appendChild(angleDiv);
angleDiv.appendChild(document.createTextNode("角度:"))
angleDiv.appendChild(createRadioButton("均匀分配", "angleSpacing", Q.Consts.ANGLE_SPACING_REGULAR, relayout));
angleDiv.appendChild(createRadioButton("按需分配", "angleSpacing", Q.Consts.ANGLE_SPACING_PROPORTIONAL, relayout, true));
var radiusDiv = document.createElement("div");
toolbox.appendChild(radiusDiv);
radiusDiv.appendChild(document.createTextNode("半径:"))
radiusDiv.appendChild(createRadioButton("统一半径", "radiusMode", Q.Consts.RADIUS_MODE_UNIFORM, relayout));
radiusDiv.appendChild(createRadioButton("可变半径", "radiusMode", Q.Consts.RADIUS_MODE_VARIABLE, relayout, true));
createSlider(toolbox, "最小半径", 20, 100, layouter.radius, function(v){
    layouter.radius = parseFloat(v);
    relayout();
});
createSlider(toolbox, "默认间距", -10, 50, layouter.gap, function(v){
    layouter.gap = parseFloat(v);
    relayout();
});
createSlider(toolbox, "起始角度", 0, 360, layouter.startAngle * 180 / Math.PI, function(v){
    layouter.startAngle = parseFloat(v) * Math.PI / 180;
    relayout();
});

function createRandomTreeDatas(root, level, sumLevel) {
    if (!root) {
        var root = createNode("R", 60, 30);
        sumLevel = 3 + Q.randomInt(1);
        return createRandomTreeDatas(root, sumLevel, sumLevel);
    }
    level--;
    var count = 1 + Q.randomInt(8);
    var i = 0;
    while (i++ < count) {
        var node = createNode("" + i, 60 - (sumLevel - level) * 13, 30 - (sumLevel - level) * 5);
        createEdge(root, node);
        if (level) {
            createRandomTreeDatas(node, level, sumLevel);
        }
    }
    return root;
}
function createEdge(from, to) {
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    return edge;
}
function createNode(name, size, fontSize) {
    size = size || 15;
    fontSize = fontSize || 8;
    var node = graph.createNode(name);
    node.image = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 0, 0, size, size);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#FEC");
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#1D4876");
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize);
    node.setStyle(Q.Styles.LABEL_COLOR, "#1D4876");
    return node;
}


function createRadioButton(displayName, name, value, onclick, checked) {
    var label = document.createElement("label");
    label.style.margin = "auto 5px";
    var input = document.createElement("input");
    input.onclick = onclick;
    input.setAttribute("name", name);
    input.setAttribute("type", "radio");
    input.setAttribute("type", "radio");
    if (checked) {
        input.setAttribute("checked", "checked");
    }
    input.value = value;
    label.appendChild(input);
    label.appendChild(document.createTextNode(displayName));
    return label;
}

function createSlider(parent, label, min, max, value, onchange){
    var div = document.createElement("div");
    var step = (max - min) / 100;
    div.innerHTML = label + ": " + min + "<input type='range' value='" + value + "' step='" + step + "' min='" + min + "' max='" + max + "'>" + max;
    div.firstElementChild.onchange = function(evt){
        onchange(evt.target.value);
    }
    parent.appendChild(div);
}