/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var names = ["Winnie", "Zoe", "Sam Sha", "Leo", "Mike", "Joshua", "Kelly",
        "Hatty", "Eric"];

var graph = new Q.Graph(canvas);
graph.originAtCenter = false;
graph.scale = 0.4;
var defaultStyles = {};
defaultStyles[Styles.SELECTION_SHADOW_BLUR] = 6;
defaultStyles[Styles.EDGE_WIDTH] = 0.8;
defaultStyles[Styles.LABEL_FONT_SIZE] = 9;
defaultStyles[Styles.LABEL_PADDING] = new Q.Insets(1, 2);
defaultStyles[Styles.LABEL_BACKGROUND_COLOR] = Q.toColor(0xDDFFFFFF);
defaultStyles[Styles.LABEL_POINTER_WIDTH] = 4;
defaultStyles[Styles.LABEL_RADIUS] = 4;
defaultStyles[Styles.LABEL_OFFSET_X] = 0;
defaultStyles[Styles.LABEL_OFFSET_Y] = 6;
defaultStyles[Styles.LABEL_BORDER] = 0.5;
defaultStyles[Styles.EDGE_CORNER_RADIUS] = 6;
graph.styles = defaultStyles;

initDatas();

var layouter = new Q.TreeLayouter(graph);
layouter.doLayout({x: 10, y: 10, byAnimate: true, callback: function(){graph.zoomToOverview()}});

function createNode(parent) {
    var node = graph.createNode(names[Q.randomInt(names.length)]);
    node.image = randomIcon();
    if(parent){
        node.parent = parent;
    }
    return node;
}
function createEdge(node1, node2) {
    var edge = graph.createEdge(null, node1, node2);
    edge.setStyle(Q.Styles.EDGE_CORNER, Q.Consts.EDGE_CORNER_NONE);
    edge.setStyle(Q.Styles.EDGE_COLOR, Q.toColor(0xFFAAAAAA));
    return edge;
}
function createNodes(start, numbers, parent, callback) {
    for (var i0 = 0; i0 < numbers; i0++) {
        var node = createNode(parent);
        var edge;
        if (start) {
            edge = createEdge(start, node);//
            node.parentChildrenDirection = start.parentChildrenDirection;
            if(start.layoutType == Q.Consts.LAYOUT_TYPE_TWO_SIDE){
                edge.edgeType = Q.isHorizontalDirection(start.parentChildrenDirection) ? Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL : Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;
            }else{
                edge.edgeType = Q.isHorizontalDirection(start.parentChildrenDirection) ? Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL : Q.Consts.EDGE_TYPE_ORTHOGONAL_VERTICAL;
                edge.setStyle(Q.Styles.EDGE_SPLIT_BY_PERCENT, false);
                edge.setStyle(Q.Styles.EDGE_SPLIT_VALUE, 30);
            }
        }
        if (callback) {
            callback(node, edge, start);
        }
    }
}

function initDatas() {
    createTreeDatas(Q.Consts.DIRECTION_RIGHT);
    createTreeDatas(Q.Consts.DIRECTION_TOP);
}

function createTreeDatas(parentChildrenDirection) {
    var node = createNode();
    node.name = "root";
    node.parentChildrenDirection = parentChildrenDirection;

    var isHorizontal = parentChildrenDirection == Q.Consts.DIRECTION_RIGHT;

    node.layoutType = Q.Consts.LAYOUT_TYPE_EVEN;
    createNodes(node, 2, null, function(node, edge, start) {
        node.layoutType = Q.Consts.LAYOUT_TYPE_EVEN;
        createNodes(node, 2, null, function(node, edge, start) {
            node.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
            node.hGap = 20;
            node.vGap = 30;
            createNodes(node, Q.randomInt(4) + 5, null, function(node, edge, start) {
                node.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
                if(isHorizontal){
                    node.hGap = 20;
                }else{
                    node.vGap = 30;
                }
                createNodes(node, 3 + Q.randomInt(3));
            });
        });
    });

    Q.log(graph.graphModel.length);
}


var toolbox = document.createElement("div");
toolbox.id = "toolbox";
Q.css(toolbox, {
    width: "100px",
    position: "absolute",
    top: "10px",
    right: "0px"
});
graph.html.parentNode.appendChild(toolbox);
toolbox.innerHTML = '<button class="btn btn-default btn-sm" style="width: 100%;margin-bottom: 10px;" value="navigation.scrollbar">ScrollBar</button>\
<button class="btn btn-default btn-sm" style="width: 100%;margin-bottom: 10px;" value="navigation.button">NavButton</button>\
<button class="btn btn-default btn-sm" style="width: 100%;" value="navigation.none">None</button>';
toolbox.onclick = function(evt){
    if(evt.target.tagName.match(/button/i)){
        graph.navigationType = evt.target.value;
    }
}

function destroy(){
    toolbox.parentNode.removeChild(toolbox);
}