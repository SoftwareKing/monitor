/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

function appendChildren(subnetwork){
    var center = graph.createNode(subnetwork.name);
    center.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, Q.toColor(0xDDFFFFFF));
    center.setStyle(Q.Styles.LABEL_PADDING, 5);
    center.setStyle(Q.Styles.LABEL_SHADOW_COLOR, "#000");
    center.setStyle(Q.Styles.LABEL_SHADOW_BLUR, 5);
    center.setStyle(Q.Styles.LABEL_SHADOW_OFFSET_X, 2);
    center.setStyle(Q.Styles.LABEL_SHADOW_OFFSET_Y, 2);
    subnetwork.addChild(center);
    var count = 8 + Q.randomInt(8);
    var per = Math.PI * 2 / count;
    var angle = 0;
    var RX = 300, RY = 200;
    while(count--){
        var x = RX * Math.cos(angle);
        var y = RY * Math.sin(angle);
        var node = graph.createNode(count + " - in " + subnetwork.name, x, y);
        subnetwork.addChild(node);
        subnetwork.addChild(graph.createEdge(center, node));
        angle += per;
    }
}
function createSubNetworkEdge(name, from, to, backgroundColor){
    var edge = graph.createEdge(name, from, to);
    edge.enableSubNetwork = true;
    edge.backgroundColor = backgroundColor;
    appendChildren(edge);
    return edge;

}
function createSubnetworkNode(name, x, y, backgroundColor){
    var subnetwork = graph.createNode(name, x, y);
    subnetwork.enableSubNetwork = true;
    subnetwork.backgroundColor = backgroundColor;
    subnetwork.image = Q.Graphs.subnetwork;
    subnetwork.setStyle(Q.Styles.BACKGROUND_COLOR, backgroundColor);
    subnetwork.setStyle(Q.Styles.PADDING, 5);
    subnetwork.setStyle(Q.Styles.BORDER, 1);
    subnetwork.setStyle(Q.Styles.BORDER_COLOR, "#888");

    appendChildren(subnetwork, backgroundColor);
    return subnetwork;
}

var A = createSubnetworkNode("SubNetwork A", -150, 0, "#FFFFDD");
var B = createSubnetworkNode("SubNetwork B", 150, 0, "#DFF");
createSubNetworkEdge("SubNetwork Edge", A, B, "#DDD");

//var childInA = A.children.getByIndex(0);
//var childInB = B.children.getByIndex(0);
//graph.createEdge(childInA, B);
//graph.createEdge(childInA, childInB);

var group = graph.createGroup();
group.addChild(A);
group.addChild(graph.createNode("node", -200, -80));

var defaultBackground = graph.html.style.backgroundColor;
graph.onPropertyChange("currentSubNetwork", function(evt){
    var color = evt.value ? evt.value.backgroundColor : defaultBackground;
    graph.html.style.backgroundColor = color;
    graph.centerTo(0, 0, 1, true);
})

function destroy(){
    graph.html.style.backgroundColor = defaultBackground;
}