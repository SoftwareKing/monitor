/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
if(!window.HFlexEdgeUI){
    function HFlexEdgeUI(edge, graph){
        Q.doSuperConstructor(this, HFlexEdgeUI, arguments);
    }
    HFlexEdgeUI.prototype = {
        drawEdge: function(path, fromUI, toUI, edgeType, fromBounds, toBounds){
            var from = fromBounds.center;
            var to = toBounds.center;
            var cx = (from.x + to.x) / 2;
            var cy = (from.y + to.y) / 2;
//        path.curveTo(from.x, cy, cx, to.y);
            path.curveTo(from.x, from.y, cx, to.y);
        }
    }

    Q.extend(HFlexEdgeUI, Q.EdgeUI);
    window.HFlexEdgeUI = HFlexEdgeUI;
    Q.loadClassPath(HFlexEdgeUI, "HFlexEdgeUI");
}


var graph = new Q.Graph(canvas);
graph.editable = true;
graph.enableDoubleClickToOverview = false;

function createEdge(name, from, to){
    var edge = graph.createEdge(name, from, to);
    edge.setStyle(Q.Styles.ARROW_TO, Q.Consts.SHAPE_TRIANGLE);
    edge.setStyle(Q.Styles.ARROW_TO_SIZE, 5);
    edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#444");
    edge.setStyle(Q.Styles.ARROW_TO_STROKE, 1);
    edge.setStyle(Q.Styles.ARROW_TO_STROKE_STYLE, "#444");
    edge.uiClass = HFlexEdgeUI;
}

function createText(text, x, y){
    var node = graph.createNode(text, x, y);
    node.image = null;
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#2898E0");
    node.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, ['#00d4f9', '#1ea6e6'], null, Math.PI/2));
    node.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
    node.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(5, 10));
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_BORDER, 0.5);
    node.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
    node.setStyle(Q.Styles.SELECTION_COLOR, "#0F0");
    return node;
}

function localToGlobal(x, y, canvas){
    x += window.pageXOffset;
    y += window.pageYOffset;
    var clientRect = canvas.getBoundingClientRect();
    return {x: x + clientRect.left, y: y + clientRect.top};
}

var layouter = new Q.TreeLayouter(graph);
layouter.isLayoutable = function(node, from){
    return node == ROOT || node.host != null;
}
layouter.vGap = 20;

graph.ondblclick = function(evt){
    var element = graph.getElementByMouseEvent(evt);
    if(element){
        return;
    }
    var xy = graph.toLogical(evt);
    var newItem = createText("新项目", xy.x, xy.y);
    graph.selectionModel.select(newItem);
}

graph.interactionDispatcher.addListener(function(evt){
    if(evt.data == ROOT){
        return;
    }
    if(evt.kind == Q.InteractionEvent.ELEMENT_MOVING && evt.data){
        var node = evt.data;
        var host = findNearNode(node);
        if(node.host == host){
            return;
        }
        if(node.host){
            unlinkToParent(node);
        }
        if(host){
            linkToParent(node, host);
        }
    }else if(evt.kind == Q.InteractionEvent.ELEMENT_MOVE_END && evt.data){
        layouter.doLayout();
    }
})

function atLeft(bounds1, bounds2){
    if(bounds1.right < bounds2.x){
        return true;
    }
    if(bounds1.x > bounds2.right){
        return false;
    }
}
function findNearNode(node){
    if(node == ROOT){
        return null;
    }
    var x = node.x;
    var y = node.y;

    var rootBounds = graph.getUIBounds(ROOT);
    var uiBounds = graph.getUIBounds(node);

    var inLeft = atLeft(uiBounds, rootBounds);
    if(inLeft === undefined){
        if(Q.calculateDistance(x, y, ROOT.x, ROOT.y) > 300){
            return null;
        }
        return ROOT;
    }

    var nearNode, xDistance;

    graph.forEachVisibleUI(function(ui){
        var data = ui.data;
        if(!(data instanceof Q.Node) || data == ROOT || data == node || data.isFollow(node)){
            return;
        }
        var dataAtROOTLeft = data.x < ROOT.x;
        if(dataAtROOTLeft != inLeft){
            return;
        }
        var dy = Math.abs(y - data.y);
        var dx = Math.abs(x - data.x);
        if(dy < 20 && (xDistance === undefined || xDistance > dx)){
            xDistance = dx;
            nearNode = data;
        }
    })
    if(!nearNode || xDistance > 200){
        if(node.host && Q.calculateDistance(x, y, node.host.x, node.host.y) > 300){
            return null;
        }
        return node.host;
    }
    while(nearNode && inLeft !== atLeft(uiBounds, graph.getUIBounds(nearNode))){
        nearNode = nearNode.host;
    }
    return nearNode;
}

///init datas
var datas = {
    name: 'HTML',
    parentChildrenDirection: Q.Consts.DIRECTION_MIDDLE,
    layoutType: Q.Consts.LAYOUT_TYPE_TWO_SIDE,
    children: [
        {name: 'svg', children: [{name: 'text'}, {name: 'rect'}, {name: 'g'}]},
        {name: 'head'},
        {name: 'div'},
        {name: 'p'},
        {name: 'table'},
        {name: 'li'},
        {name: 'frame'},
        {name: 'form', children: [{name: 'button'}, {name: 'textarea'}, {name: 'input'}]},
        {name: 'canvas'},
        {name: '双击编辑'}
    ]
}

function createItem(data, parent, level){
    if(Q.isArray(data)){
        var children = data;
        for(var i= 0,l = children.length; i<l; i++){
            var child = children[i];
            createItem(child, parent, level);
        }
        return;
    }
    var node = createText("<" + data.name + ">");
    node.tooltipType = "text";
    node.data = data;
    level = level || 0;
    node.level = level;
    if(parent){
        linkToParent(node, parent);
    }
    node.parentChildrenDirection = data.parentChildrenDirection;
    node.layoutType = data.layoutType;

    if(data.children){
        createItem(data.children, node, level + 1);
    }
    return node;
}

function linkToParent(node, parent){
    node.host = parent;
    return createEdge(parent, node);
}
function unlinkToParent(node){
    node.host = null;
    node.forEachInEdge(function(edge){
        graph.graphModel.remove(edge);
    });
}

var ROOT = createItem(datas);
ROOT.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
ROOT.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(80, 60));

graph.callLater(function(){
    layouter.doLayout();
    graph.zoomToOverview();
})