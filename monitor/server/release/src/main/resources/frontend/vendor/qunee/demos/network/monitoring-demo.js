/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var OracleDraw = {
    draw: function (g) {
        g.translate(2, 2);
        var x = 0, y = 0, w = 50, h = 20;
        var kappa = 0.5522848;
        ox = (w / 2) * kappa,
            oy = (h / 2) * kappa,
            xe = x + w,
            ye = y + h,
            xm = x + w / 2,
            ym = y + h / 2;

        g.beginPath();
        g.moveTo(x, ym);
        g.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        g.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        g.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        g.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        g.moveTo(0, 10);
        g.bezierCurveTo(x, ym + oy, xm - ox, ye, xm, ye);
        g.bezierCurveTo(xm + ox, ye, xe, ym + oy, 50, 10);
        g.lineTo(50, 50);
        ye += 40;
        ym += 40;
        g.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        g.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        g.lineTo(0, 10);
        g.lineTo(0, 50);
        g.fillStyle = "rgba(255,255,255,0.5)";//"#FFF";
        g.fill();
        g.lineWidth = 1;
        g.strokeStyle = "#555";
        g.stroke();
    }
}

function BarUI(data) {
    Q.doSuperConstructor(this, BarUI, arguments);
}

BarUI.prototype = {
    width: 100,
    height: 20,
    measure: function () {
        this.setMeasuredBounds(this.width, this.height);
    },
    draw: function (g, scale, selected) {
        var value = this.data * 100 | 0;
        var data = this.data;
        if (data > 1) {
            data = 1;
        } else if (data < 0) {
            data = 0;
        }
        var color;
        if (value < 40) {
            color = "#0F0";
        } else if (value < 70) {
            color = "#FF0";
        } else {
            color = "#F00";
        }
        g.fillStyle = color;
        var w = data * this.width;
        g.fillRect(0, 0, w, this.height);
        g.beginPath();
        g.strokeStyle = "#555";
        g.strokeRect(0, 0, this.width, this.height);
        g.fillStyle = "#555";
        g.textBaseline = "middle";
        if (value > 83) {
            g.textAlign = "right";
            g.fillText(value, this.width - 1, this.height / 2);
            return;
        }
        g.fillText(value, w + 3, this.height / 2);
    }
}

Q.extend(BarUI, Q.BaseUI);

var graph = new Q.Graph(canvas);
graph.zoomToOverview();

var app = createText("应用主机", -50, 0);
var node = createNodeWithBar("CPU占用", 150, 0);
createEdge(app, node);
var node2 = createNodeWithBar("内存占用", 150, 50);
createEdge(app, node2);
var tomcat = createText("Tomcat", -50, 150);
tomcat.setStyle(Q.Styles.LABEL_ALIGN_POSITION, Q.Position.CENTER_TOP);
tomcat.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
tomcat.setStyle(Q.Styles.LABEL_SIZE, {width: 180, height: 80});
var map = createText("mapi", -50, 170);
map.anchorPosition = Q.Position.RIGHT_MIDDLE;
map.setStyle(Q.Styles.LABEL_SIZE, {width: 60});
var console = createText("console", -50, 170);
console.anchorPosition = Q.Position.LEFT_MIDDLE;
console.setStyle(Q.Styles.LABEL_SIZE, {width: 60});
map.parent = map.host = tomcat;
console.parent = console.host = tomcat;

var edge = graph.createEdge(app, tomcat);
edge.zIndex = 1;
edge.setStyle(Q.Styles.EDGE_WIDTH, 6);
edge.setStyle(Q.Styles.ARROW_TO, Q.Consts.SHAPE_TRIANGLE);
edge.setStyle(Q.Styles.ARROW_TO_STROKE, false);
edge.setStyle(Q.Styles.ARROW_TO_SIZE, 15);
edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#555");
edge.setStyle(Q.Styles.ARROW_TO_OFFSET, {x: 10});

var oracle = graph.createNode("Oracle", 200, 150);
oracle.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
oracle.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
oracle.image = OracleDraw;
oracle.setStyle(Q.Styles.RENDER_COLOR, "#F00");
var alarmLabel = new Q.LabelUI("ALARM");
alarmLabel.showPointer = true;
alarmLabel.offsetY = -10;
alarmLabel.offsetX = 10;
alarmLabel.pointerWidth = 6;
alarmLabel.border = 1;
alarmLabel.position = Q.Position.CENTER_TOP;
alarmLabel.anchorPosition = Q.Position.CENTER_BOTTOM;
alarmLabel.fontSize = 9;
alarmLabel.padding = 3;
alarmLabel.backgroundColor = "#F00";
alarmLabel.borderRadius = 4;
oracle.addUI(alarmLabel);
createEdge(tomcat, oracle);

var node = createNodeWithBar("CPU占用", 150, 0);
var node2 = createNodeWithBar("内存占用", 150, 50);
var timer = setTimeout(function A() {
    node.set("value", Math.random());
    node2.set("value", Math.random());
    timer = setTimeout(A, 2000);
}, 2000);

function destroy() {
    clearTimeout(timer);
}

function createText(label, x, y) {
    var node = graph.createText(label, x, y);
    node.setStyle(Q.Styles.LABEL_BORDER, 1);
    node.setStyle(Q.Styles.LABEL_PADDING, 15);
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFF");
    return node;
}

function createNodeWithBar(label, x, y) {
    var node = graph.createText(label, x, y);
    node.setStyle(Q.Styles.BORDER, 1);
    node.setStyle(Q.Styles.LABEL_PADDING, 5);
    node.setStyle(Q.Styles.PADDING, 10);
    node.setStyle(Q.Styles.BACKGROUND_COLOR, "#FFF");
    var bar = new BarUI();
    bar.position = Q.Position.RIGHT_MIDDLE;
    bar.anchorPosition = Q.Position.LEFT_MIDDLE;
    node.addUI(bar, {
        property: "value",
        propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
        bindingProperty: "data"
    });
    node.set("value", Math.random());
    return node;
}
function createEdge(from, to) {
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.ARROW_TO, Q.Consts.SHAPE_TRIANGLE);
    edge.setStyle(Q.Styles.ARROW_TO_SIZE, 6);
    edge.setStyle(Q.Styles.ARROW_TO_STROKE, false);
    edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#000");
    return edge;
}
