/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

graph.interactionMode = Q.Consts.INTERACTION_MODE_VIEW;
var svg = graph.createNode("SVG in Qunee for HTML5");
svg.movable = false;
svg.image = "mapchart/usa-electoral-2012.svg";
svg.size = {width: 700};
svg.setStyle(Q.Styles.IMAGE_BACKGROUND_COLOR, "#EEE");
svg.setStyle(Q.Styles.IMAGE_BACKGROUND_GRADIENT, Q.Gradient.LINEAR_GRADIENT_VERTICAL);
svg.setStyle(Q.Styles.IMAGE_PADDING, 20);
svg.setStyle(Q.Styles.IMAGE_BORDER_RADIUS, 30);
svg.setStyle(Q.Styles.IMAGE_BORDER, 1);
svg.setStyle(Q.Styles.IMAGE_BORDER_COLOR, "#888");
svg.setStyle(Q.Styles.SELECTION_SHADOW_OFFSET_X, 0);
svg.setStyle(Q.Styles.SELECTION_SHADOW_OFFSET_Y, 0);