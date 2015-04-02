/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
//append alarm balloon support
if(!Q.Element.prototype.initAlarmBalloon){
    Q.Element.prototype.initAlarmBalloon = function(){
        var alarmUI = new Q.LabelUI();
        alarmUI.position = Q.Position.CENTER_TOP;
        alarmUI.anchorPosition = Q.Position.LEFT_BOTTOM;
        alarmUI.border = 1;
        alarmUI.backgroundGradient = Q.Gradient.LINEAR_GRADIENT_VERTICAL;
        alarmUI.padding = new Q.Insets(2, 5);
        alarmUI.showPointer = true;
        alarmUI.offsetY = -10;
        alarmUI.offsetX = -10;
        alarmUI.rotatable = false;
        this._alarmBalloon = alarmUI;
    }
    Q.Element.prototype._checkAlarmBalloon = function(){
        if(!this.alarmLabel || !this.alarmColor){
            if(this._alarmBalloon){
                this.removeUI(this._alarmBalloon);
            }
            return;
        }
        if(!this._alarmBalloon){
            this.initAlarmBalloon();
        }
        this._alarmBalloon.data = this.alarmLabel;
        this._alarmBalloon.backgroundColor = this.alarmColor;
        if(this.addUI(this._alarmBalloon) === false){
            this.invalidate();
        }
    }
    Object.defineProperties(Q.Element.prototype, {
        alarmLabel: {
            get: function(){
                return this._alarmLabel;
            },
            set: function(label){
                if(this._alarmLabel == label){
                    return;
                }
                this._alarmLabel = label;
                this._checkAlarmBalloon();
            }
        },
        alarmColor: {
            get: function(){
                return this._alarmColor;
            },
            set: function(color){
                if(this._alarmColor == color){
                    return;
                }
                this._alarmColor = color;
                this.setStyle(Q.Styles.RENDER_COLOR, color);
                this._checkAlarmBalloon();
            }
        }
    })
}
var AlarmSeverity = {
    CRITICAL: {color: Q.toColor(0xEEFF0000), sortName: "C"},
    MAJOR: {color: Q.toColor(0xEEFFAA00), sortName: "M"},
    MINOR: {color: Q.toColor(0xEEFFFF00), sortName: "m"},
    WARNING: {color: Q.toColor(0xEE00FFFF), sortName: "W"}
}
var all = [];
for(var name in AlarmSeverity){
    all.push(AlarmSeverity[name]);
}
AlarmSeverity.all = all;

Object.defineProperties(AlarmSeverity, {
    random: {
        get: function(){
            return this.all[Q.randomInt(this.all.length)];
        }
    }
})

graph = new Q.Graph('canvas');

function initTopology(topoNodes,topoRelations) {
    var map = {};
    for (var i = 0; i < topoNodes.length; i++) {
        var node = topoNodes[i];
        map[node.id] = graph.createNode(node.name);
    }
    for (var i = 0; i < topoNodes.length; i++) {
        var node = topoNodes[i];
        var parent = node.parent;
        if (parent) {
            parent = map[parent];
            if (parent) {
                map[node.id].parent = parent;
            }
        }
    }
    for (var i = 0; i < topoRelations.length; i++) {
        var relation = topoRelations[i];
        var nodeFrom = map[relation.from];
        var nodeTo = map[relation.to];
        if (nodeFrom && nodeTo) {
            var edge = graph.createEdge(nodeFrom, nodeTo);
            edge.info = relation;
        }
    }
}
Q.loadJSON("./others/data/testData.json", function(json){
    initTopology(json.nodes, json.relations);

    graph.callLater(function(){
        var layouter = new Q.TreeLayouter(graph);
        layouter.doLayout();
        graph.moveToCenter();
    })
});


var timer = setTimeout(function A(){
    graph.forEach(function(element){
        if(Q.randomBool()){
            element.alarmLabel = null;
            element.alarmColor = null;
            return;
        }
        var alarmSeverity = AlarmSeverity.random;
        element.alarmLabel = "" + (1 + Q.randomInt(100)) + alarmSeverity.sortName + (Q.randomBool() ? "+" : "");
        element.alarmColor = alarmSeverity.color;
    })
    timer = setTimeout(A, 2000);
}, 1000);

function destroy(){
    clearTimeout(timer);
}