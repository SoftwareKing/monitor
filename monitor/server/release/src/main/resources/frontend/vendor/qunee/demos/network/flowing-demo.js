/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
function FlowingSupport(graph) {
    this.flowMap = {};
    this.graph = graph;
}
FlowingSupport.prototype = {
    flowMap: null,
    length: 0,
    gap: 40,
    graph: null,
    addFlowing: function (edgeOrLine, count, byPercent) {
        var flowList = this.flowMap[edgeOrLine.id];
        if(!flowList){
            flowList = this.flowMap[edgeOrLine.id] = [];
            this.length++;
        }
        count = count || 1;
        while(--count >= 0){
            var ui = new Q.ImageUI("network/images/flow.png");
            ui.layoutByPath = true;
            ui.position = {x: 0, y: 0};
            ui.size = {width: 20};
            ui.renderColor = "#F00";
            flowList.push(ui);
            flowList.byPercent = byPercent;
            edgeOrLine.addUI(ui);
        }
    },
    removeFlowing: function(id){
        var flowList = this.flowMap[id];
        if(!flowList){
            return;
        }
        var edgeOrLine = this.graph.getElement(id);
        if(edgeOrLine){
            flowList.forEach(function(ui){
                edgeOrLine.removeUI(ui);
            })
        }
        this._doRemove(id);
    },
    _doRemove: function(id){
        delete this.flowMap[id];
        this.length--;
    },
    timer: null,
    perStep: 10,
    stop: function(){
        clearTimeout(this.timer);
    },
    start: function(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        var offset = 0;
        var scope = this;
        scope.timer = setTimeout(function A() {
            if (!scope.length) {
                scope.timer = setTimeout(A, 2000);
                offset = 0;
                return;
            }
            offset += 1;
            for(var id in scope.flowMap){
                var ui = scope.graph.getUI(id);
                if(!ui){
                    scope._doRemove(id);
                    continue;
                }
                var lineLength = ui.length;
                if(!lineLength){
                    continue;
                }
                var flowList = scope.flowMap[id];
                if(flowList.byPercent){
                    //按百分比，0 - 1跑完整条线，线长度不同，速度也不同，跑完一圈的时间相同
                    var x = offset * 2;
                    var gap = 15;
                    scope.flowMap[id].forEach(function(ui){
                        ui.position = {x: (x % 100) / 100, y: 0};
                        x += gap;
                    });
                }else{
                    //按固定距离移动，速度相同，线条越长跑完一圈的时间越长
                    var x = offset * scope.perStep;
                    scope.flowMap[id].forEach(function(ui){
                        ui.position = {x: x % lineLength, y: 0};
                        x += scope.gap;
                    });
                }
                scope.graph.invalidateUI(ui);

                //dashed line
                var data = ui.data;
                if(data instanceof Q.Edge){
                    if(data.getStyle(Q.Styles.EDGE_LINE_DASH)){
                        data.setStyle(Q.Styles.EDGE_LINE_DASH_OFFSET, -offset);
                    }
                }else if(data instanceof Q.ShapeNode){
                    if(data.getStyle(Q.Styles.SHAPE_LINE_DASH)) {
                        data.setStyle(Q.Styles.SHAPE_LINE_DASH_OFFSET, -offset);
                    }
                }
            }
            scope.timer = setTimeout(A, 200);
        }, 200);
    }
}

var graph = new Q.Graph(canvas);
var hello = graph.createNode("Hello", -100, -50);
hello.image = Q.Graphs.server;
var qunee = graph.createNode("Qunee", 100, 50);
var qunee2 = graph.createNode("Qunee", -150, 50);
var edge = graph.createEdge("Hello\nQunee", hello, qunee);
edge.setStyle(Q.Styles.EDGE_COLOR, "#2898E0");
edge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 1, 4]);
edge.edgeType = Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL;
var edge2 = graph.createEdge("Edge2", hello, qunee2);

var line = graph.createShapeNode("Line Close");
line.moveTo(-200, -100);
line.lineTo(200, -100);
line.curveTo(400, -100, 400, 100, 200, 100);
line.lineTo(-200, 100);
line.curveTo(-400, 100, -400, -100, -200, -100);
line.closePath();
line.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#2898E0");
line.setStyle(Q.Styles.SHAPE_LINE_DASH, [8, 5, 0.1, 6]);
line.setStyle(Q.Styles.SHAPE_STROKE, 3);
line.setStyle(Q.Styles.LINE_CAP, "round");
line.setStyle(Q.Styles.SHAPE_OUTLINE_STYLE, "#fcfb9b");
line.setStyle(Q.Styles.LAYOUT_BY_PATH, false);
line.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);

var line2 = graph.createShapeNode("Line Open", 0, -70);
line2.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);
line2.moveTo(-200, -100);
line2.lineTo(100, -100);
line2.curveTo(200, -100, 200, -50, 100, -50);

var flowingSupport = new FlowingSupport(graph);
flowingSupport.addFlowing(edge, 3);
flowingSupport.addFlowing(edge2, 1);
flowingSupport.addFlowing(line, 1, true);
flowingSupport.addFlowing(line2, 2, true);

graph.callLater(function(){
    flowingSupport.start();
})

function destroy(){
    flowingSupport.stop();
}