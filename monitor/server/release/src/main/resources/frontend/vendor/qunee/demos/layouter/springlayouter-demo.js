/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/

function SimpleEdgeUI(edge, graph){
    Q.doSuperConstructor(this, SimpleEdgeUI, arguments);
}
SimpleEdgeUI.prototype = {
    validatePoints: function() {
        this.shape.invalidateData();
        var edge = this.data, path = this.path;
        path.clear();
        var fromAgent = edge.fromAgent;
        var toAgent = edge.toAgent;
        if(!fromAgent || !toAgent || fromAgent == toAgent){
            return;
        }
        var fromUI = this.graph.getUI(fromAgent);
        var toUI = this.graph.getUI(toAgent);
        var fromBounds = fromUI.bodyBounds;
        var toBounds = toUI.bodyBounds;
        var x1 = fromAgent.x,
            y1 = fromAgent.y,
            x2 = toAgent.x,
            y2 = toAgent.y;
        var p1 = fromBounds.getIntersectionPoint(x1, y1, x2, y2);
        var p2 = toBounds.getIntersectionPoint(x2, y2, x1, y1);
        path.moveTo(p1.x, p1.y);
        path.lineTo(p2.x, p2.y);
    }
}
Q.extend(SimpleEdgeUI, Q.EdgeUI);

var graph = new Q.Graph(canvas);
graph.scale = 0.4;

var nodes = [];

createDatas();

var layout = new Q.SpringLayouter(graph, 200);
graph.interactionDispatcher.addListener(function(evt){
    if(evt.kind == Q.InteractionEvent.ELEMENT_MOVING){
        layout.start();
    }
})

var default_repulsion = 90;
var default_attractive = 0.1;
var default_elastic = 5;
layout.repulsion = default_repulsion;
layout.attractive = default_attractive;
layout.elastic = default_elastic;

function createDatas() {
	var root = createNode("Q");
    var node = createNode("Q1");
    createEdge(root, node);
	var i = 0;
    var count = Q.isTouchSupport ? 3 : 5;
	while (i++ < count) {
		var node = createNode("Q-" + i, 0, 0);
		createEdge(root, node);
		var j = 0;
		while (j++ < count) {
			var node2 = createNode("Q-" + i + "-" + j, 0, 0);
			createEdge(node, node2);
			var jj = 0;
			while (jj++ < count) {
				var node3 = createNode("Q-" + i + "-" + j + "-" + jj, 0, 0);
				createEdge(node2, node3);
			}
		}
	}
}

function createEdge(from, to){
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.uiClass = SimpleEdgeUI;
    return edge;
}


var toolbox = document.createElement("div");
toolbox.id = "toolbox";
Q.css(toolbox, {
    position: "absolute",
    top: "100px",
    right: "0px"
});
graph.html.parentNode.appendChild(toolbox);

function destroy(){
    toolbox.parentNode.removeChild(toolbox);
}

var run_button = createButton(toolbox, "Run", function(evt) {
    if(layout.isRunning()){
        run_button.textContent = "Run";
        layout.stop();
    }else{
        run_button.textContent = "||";
        layout.start();
    }
});
createButton(toolbox, "Do Layout", function(evt) {
    layout.stop();
    layout.doLayout();
});

createButton(toolbox, 'Add', function(){
    var from = randomNode();
    var node = createNode("New");
    graph.createEdge(from, node);
});
createSlider(toolbox, "Repulsion", 0, 200, default_repulsion, function(v){
    layout.repulsion = v;
    layout.start();
});
createSlider(toolbox, "Attractive", 0, 0.5, default_attractive, function(v){
    layout.attractive = v;
    layout.start();
});
createSlider(toolbox, "Elastic", 0, 10, default_elastic, function(v){
    layout.elastic = v;
    layout.start();
});


function randomNode(){
    return nodes[Q.randomInt(nodes.length)];
}

function createNode(name, x, y) {
//    var node = graph.createNode("", x, y);
//    node.image = randomIcon();
//    node.size = {width: 20};
	var node = graph.createText(name, x, y);
    node.setStyle(Styles.LABEL_BACKGROUND_COLOR, Colors.blue);
    node.setStyle(Styles.LABEL_COLOR, "#FFF");
    node.setStyle(Styles.LABEL_PADDING, new Q.Insets(3, 5));
    nodes.push(node);
	return node;
}

function createButton(parent, name, onClick){
    var button = document.createElement('button');
    button.className = 'btn btn-default btn-sm';
    button.innerHTML = name;
    button.onclick = onClick;
    parent.appendChild(button);
    return button;
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

graph.callLater(function(){run_button.onclick()});