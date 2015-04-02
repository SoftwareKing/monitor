/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var LAYOUT_TYPE_BALLOON = "balloon";
var LAYOUT_TYPE_TREE = "tree";

function AutoLayouter(graph) {
    this.graph = graph;
    this._layouters = {};
}

AutoLayouter.prototype = {
    _layouters: null,
    _getLayouter: function (layoutType) {
        if (layoutType == LAYOUT_TYPE_BALLOON) {
            return new Q.BalloonLayouter(this.graph);
        }
        if (layoutType == LAYOUT_TYPE_TREE) {
            var layouter = new Q.TreeLayouter(this.graph);
            layouter.getLayoutResult = function (params) {
                var bounds = params.bounds = new Q.Rect();
                var locations = Q.TreeLayouter.prototype.getLayoutResult.call(this, params);
                var offsetX = -bounds.width / 2;
                var offsetY = -bounds.height / 2;
                for (var id in locations) {
                    var p = locations[id];
                    p.x += offsetX;
                    p.y += offsetY;
                }
                return locations;
            }
            return layouter;
        }
        return new Q.SpringLayouter(graph);
    },
    doLayout: function (params) {
        var layoutType = params.layoutType;
        var layouter = this._layouters[layoutType];
        if (!layouter) {
            layouter = this._layouters[layoutType] = this._getLayouter(layoutType);
        }
        layouter.doLayout(params);
    }
}

var graph = new Q.Graph("canvas");
createRandomTreeDatas();

var layouter = new AutoLayouter(graph);

layouter.doLayout({
    layoutType: LAYOUT_TYPE_BALLOON,
    byAnimate: true,
    callback: function () {
        graph.zoomToOverview(true);
    }
});

var toolbox = document.createElement("div");
toolbox.id = "toolbox";
Q.css(toolbox, {
    width: "80px",
    position: "absolute",
    top: "100px",
    right: "0px"
});
graph.html.parentNode.appendChild(toolbox);
toolbox.innerHTML = '<button class="btn btn-default btn-sm" style="width: 100%;margin-bottom: 10px;" value="tree">Tree</button>\
<button class="btn btn-default btn-sm" style="width: 100%;margin-bottom: 10px;" value="balloon">Balloon</button>\
<button class="btn btn-default btn-sm" style="width: 100%;" value="spring">Spring</button>';
toolbox.onclick = function(evt){
    if(evt.target.tagName.match(/button/i)){
        doLayout(evt.target.value);
    }
}

function destroy(){
    toolbox.parentNode.removeChild(toolbox);
}

function doLayout(layoutType) {
    layouter.doLayout({
        layoutType: layoutType,
        byAnimate: true,
        callback: function () {
            graph.zoomToOverview(true);
        }
    });
}

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
        node.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
        createEdge(root, node);
        if (level) {
            createRandomTreeDatas(node, level, sumLevel);
        }
    }
    return root;
}

function createEdge(from, to) {
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.EDGE_WIDTH, 1);
    edge.setStyle(Q.Styles.ARROW_TO_SIZE, 4);
    edge.uiClass = Q.FlexEdgeUI;
    return edge;
}

function createNode(name, size, fontSize) {
    size = size || 15;
    fontSize = fontSize || 8;
    var node = graph.createNode(name);
    node.image = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 0, 0, size, size);
    node.setStyle(Q.Styles.SHAPE_FILL_GRADIENT, Q.Gradient.RADIAL_GRADIENT);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#fceb9b");
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#888");
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize);
    node.setStyle(Q.Styles.LABEL_COLOR, "#555");
    return node;
}