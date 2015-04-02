/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph, groups, mainNode;

Q.Defaults.registerInteractions("VPC", [Q.EditInteraction, Q.ResizeInteraction, Q.SelectionInteraction,
    Q.MoveInteraction, Q.WheelZoomInteraction, Q.TooltipInteraction, Q.DoubleClickInteraction]);

function isGroup(data) {
    return data instanceof Q.Group || data.type == "rectGroup";
}

var currentElement;
var oldFillColor;
var highlightColor = "#FF0";
function unhighlight(element) {
    element.setStyle(Q.Styles.SHAPE_FILL_COLOR, oldFillColor);
}
function highlight(element) {
    if (currentElement == element) {
        return;
    }
    if (currentElement) {
        unhighlight(currentElement);
    }
    currentElement = element;
    if (!currentElement) {
        return;
    }
    oldFillColor = currentElement.getStyle(Q.Styles.SHAPE_FILL_COLOR);
    currentElement.setStyle(Q.Styles.SHAPE_FILL_COLOR, highlightColor);
}

function fixNode(node) {
    var g = node.host;
    if (!g) {
        return;
    }
    var groupBounds = graph.getUIBounds(g);
    var bounds = graph.getUIBounds(node);
    if (bounds.x < groupBounds.x) {
        node.x = groupBounds.x + bounds.width / 2;
    } else if (bounds.right > groupBounds.right) {
        node.x = groupBounds.right - bounds.width / 2;
    }
    if (bounds.y < groupBounds.y) {
        node.y = groupBounds.y + bounds.height / 2;
    } else if (bounds.bottom > groupBounds.bottom) {
        node.y = groupBounds.bottom - bounds.height / 2;
    }
}

function findGroup(event) {
    var xy = graph.toLogical(event);
    for (var i = 0, l = groups.length; i < l; i++) {
        var g = groups[i];
        var groupBounds = graph.getUIBounds(g);
        if (groupBounds.intersectsPoint(xy.x, xy.y)) {
            return g;
        }
    }
}
function createRect(name, left, top, width, height, fillColor) {
    var rect = graph.createNode(name, left, top);
    rect.type = "rectGroup";
    rect.anchorPosition = Q.Position.LEFT_TOP;
    rect.image = Q.Shapes.getRect(0, 0, 100, 100);
    rect.size = {width: width, height: height};
    //rect.setStyle(Q.Styles.IMAGE_BACKGROUND_COLOR, fillColor || Q.toColor(0x88FFFFFF));
    rect.setStyle(Q.Styles.SHAPE_STROKE, 0);
    rect.setStyle(Q.Styles.SHAPE_FILL_COLOR, fillColor || Q.toColor(0x88FFFFFF));
    rect.setStyle(Q.Styles.BORDER, 1);
    rect.setStyle(Q.Styles.BORDER_RADIUS, 0);
    rect.setStyle(Q.Styles.BORDER_COLOR, "#1D4876");
    rect.setStyle(Q.Styles.BORDER_LINE_DASH, [5, 6]);
    rect.setStyle(Q.Styles.LABEL_FONT_STYLE, "bolder");
    rect.setStyle(Q.Styles.LABEL_PADDING, 5);
    rect.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
    rect.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
    rect.setBounds = function (bounds) {
        this.x = bounds.x;
        this.y = bounds.y;
        this.size = new Q.Size(bounds.width, bounds.height);
    }
    rect.getBounds = function () {
        return new Q.Rect(this.x, this.y, this.size.width, this.size.height);
    }
    rect.inBounds = function (x, y) {
        return this.getBounds().contains(x, y);
    }
    rect.intersectsRect = function (rect) {
        return rect.intersectsRect(this.x, this.y, this.size.width, this.size.height);
    }
    rect.containsRect = function (rect) {
        return Q.containsRect(this.x, this.y, this.size.width, this.size.height, rect.x, rect.y, rect.width, rect.height);
    }
    rect.updateBoundsByChildren = function () {
        var bounds = new Q.Rect();
        Q.forEachChild(this, function (child) {
            bounds.add(graph.getUIBounds(child));
        });
        this.location = new Q.Point(bounds.x, bounds.y - 15);
        this.size = new Q.Size(Math.max(200, bounds.width), Math.max(70, bounds.height + 15));
    }
    return rect;
}
function createPC(name, x, y, parent) {
    var node = graph.createNode(name, x, y);
    node.image = Q.Graphs.server;
    node.parent = node.host = parent;
    node.zIndex = 10;
    return node;
}

function createEdge(from, to) {
    var name = from.name + "->" + to.name;
    var edge = graph.createEdge(name, from, to);
    edge.edgeType = Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;
    edge.setStyle(Q.Styles.EDGE_FROM_OFFSET, {x: 20});
    edge.setStyle(Q.Styles.EDGE_CORNER_RADIUS, 0);
    return edge;
}


graph = new Q.Graph(canvas);
graph.originAtCenter = false;
graph.editable = true;
graph.interactionMode = "VPC";
graph.isRotatable = function () {
    return false
};
graph.isResizable = function (node) {
    return node.type == "rectGroup";
};

mainNode = createRect("XX节点", 50, 20, 600, 400, Q.toColor(0x88EEEEEE));
mainNode.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
mainNode.movable = false;

var label = graph.createText("Internet\nGateway", mainNode.x, 50);
label.setStyle(Q.Styles.BORDER, 1);
label.setStyle(Q.Styles.BORDER_RADIUS, 0);
label.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(60, 40));
label.setStyle(Q.Styles.BACKGROUND_COLOR, "#FFF");
label.host = label.parent = mainNode;
label.atLeft = true;
label.updateLocation = function () {
    var host = this.host;
    var bounds = host.getBounds();
    var y = this.y;
    if (y < bounds.y + 20) {
        y = bounds.y + 20;
    } else if (y > bounds.bottom - 20) {
        y = bounds.bottom - 20
    }
    this.x = bounds.x;
    this.y = y;
}

var vm1 = createPC("VM1", 370, 200);
var vm2 = createPC("VM2", 550, 200);

var innerGroup = createRect("子网1");
vm1.parent = vm1.host = innerGroup;
vm2.parent = vm2.host = innerGroup;
innerGroup.parent = innerGroup.host = mainNode;
var edge = createEdge(label, innerGroup);

var vm3 = createPC("VM3", 250, 100);
var vm4 = createPC("VM4", 450, 100);
var innerGroup1 = createRect("子网0");
vm3.parent = vm3.host = innerGroup1;
vm4.parent = vm4.host = innerGroup1;
innerGroup1.parent = innerGroup1.host = mainNode;
var edge = createEdge(label, innerGroup1);

var innerGroup2 = createRect("子网2");
innerGroup2.parent = mainNode;
edge = createEdge(label, innerGroup2);

var node = createPC("VM5", 200, 300);

node.parent = node.host = innerGroup2;

groups = [innerGroup, innerGroup1, innerGroup2];


function groupIntersected(data) {
    var bounds = data.getBounds();
    for (var i = 0, l = groups.length; i < l; i++) {
        var g = groups[i];
        if (g != data && g.intersectsRect(bounds)) {
            return true;
        }
    }
    if (!data.parent.containsRect(bounds)) {
        return true;
    }
}

function childrenOutParent(parent) {
    var bounds = parent.getBounds();
    var result = false;
    parent.forEachChild(function (child) {
        if (child.atLeft) {
            return;
        }
        var childBounds = graph.getUIBounds(child);
        if (!bounds.contains(childBounds)) {
            result = true;
            return false;
        }
    })
    return result;
}

var oldLocation = {};
graph.interactionDispatcher.addListener(function (evt) {
    var data = evt.data;
    if (evt.kind == Q.InteractionEvent.RESIZE_START) {
        oldLocation[data.id] = {x: data.x, y: data.y, width: data.size.width, height: data.size.height};
    }
    if (evt.kind == Q.InteractionEvent.RESIZING) {
        if (data == mainNode) {
            label.updateLocation();
        }
        return;
    }
    if (evt.kind == Q.InteractionEvent.RESIZE_END) {
        var oldBounds = oldLocation[data.id];
        oldLocation = {};
        if ((data != mainNode && isGroup(data) && groupIntersected(data)) || childrenOutParent(data)) {
            data.setBounds(oldBounds);
        }
        if (data == mainNode) {
            label.updateLocation();
        }
        return;
    }
    if (data.atLeft) {
        if (evt.kind == Q.InteractionEvent.ELEMENT_MOVING) {
            data.updateLocation();
        }
        return;
    }

    if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_START) {
        oldLocation[data.id] = {x: data.x, y: data.y};
        return;
    }
    if (evt.kind == Q.InteractionEvent.ELEMENT_MOVING) {
        if (!isGroup(data)) {
            var g = findGroup(evt.event);
            highlight(g);
        }
        return;
    }
    if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_END) {
        highlight();
        if (isGroup(data)) {
            if (groupIntersected(data)) {
                var old = oldLocation[data.id];
                graph.moveElements([data], old.x - data.x, old.y - data.y);
            }
            return;
        }
        var g = findGroup(evt.event);
        if (g) {
            data.parent = data.host = g;
            fixNode(data);
        } else {
            data.location = oldLocation[data.id];
        }
        oldLocation = {};
    }
})
graph.callLater(function () {
    Q.forEach(groups, function (g) {
        g.updateBoundsByChildren();
    })
});

graph.html.style.background = "url('./orgchart/vpc-background.png')";
function destroy(){
    graph.html.style.background = "";
}