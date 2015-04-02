/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
;(function(Q, $){
    function SampleEdgeUI(edge, graph){
        Q.EdgeUI.apply(this, arguments);
    }
    SampleEdgeUI.prototype = {
        validatePoints: function() {
            this.shape.invalidateData();
            var edge = this.$data, path = this.path;
            path.clear();
            var fromAgent = edge.fromAgent;
            var toAgent = edge.toAgent;
            if(!fromAgent || !toAgent){
                return;
            }
            var fromUI = this.graph.getUI(fromAgent);
            var toUI = this.graph.getUI(toAgent);

            var fromBounds = fromUI.bodyBounds;
            var toBounds = toUI.bodyBounds;

            var p0 = fromBounds.getIntersectionPoint(fromBounds.cx, fromBounds.cy, toBounds.cx, toBounds.cy);
            var p1 = toBounds.getIntersectionPoint(toBounds.cx, toBounds.cy, fromBounds.cx, fromBounds.cy);

            path.moveTo(p0.x, p0.y);
            path.lineTo(p1.x, p1.y);
        }
    }
    Q.extend(SampleEdgeUI, Q.EdgeUI);

    if(Q.loadClassPath){
        Q.loadClassPath(SampleEdgeUI, "Q.SampleEdgeUI");
    }
    Q.SampleEdgeUI = SampleEdgeUI;
}(Q, jQuery))
