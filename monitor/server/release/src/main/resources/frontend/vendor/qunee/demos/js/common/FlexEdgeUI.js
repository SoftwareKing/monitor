/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
;(function(Q, $){
//扩展连线UI
  function FlexEdgeUI(edge, graph){
    Q.doSuperConstructor(this, FlexEdgeUI, arguments);
  }
  FlexEdgeUI.prototype = {
    drawEdge: function(path, fromUI, toUI, edgeType, fromBounds, toBounds){
      var from = fromBounds.center;
      var to = toBounds.center;
      var cx = (from.x + to.x) / 2;
      var cy = (from.y + to.y) / 2;
      var dx = from.x - to.x, dy = from.y - to.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx);
      distance = Math.min(30, distance * 0.2);
      if(angle > 0){
        distance = -distance;
      }
      var cos = Math.cos(angle) * distance;
      var sin = Math.sin(angle) * distance;

      path.curveTo(cx - cos, cy + sin, cx + cos, cy - sin);
    }
  }
  Q.extend(FlexEdgeUI, Q.EdgeUI);
  FlexEdgeUI.drawReferenceLine = function(g, start, end, type){
    g.moveTo(start.x, start.y);
    var cx = (start.x + end.x) / 2;
    var cy = (start.y + end.y) / 2;
    g.bezierCurveTo(start.x, cy, end.x, cy, end.x, end.y);
  }
  if(Q.loadClassPath){
    Q.loadClassPath(FlexEdgeUI, "Q.FlexEdgeUI");
  }
  Q.FlexEdgeUI = FlexEdgeUI;
}(Q, jQuery))
