/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.enableTooltip = true;

var hello = graph.createNode("mouse over and wait a moment\ntooltip will appear.", -100, -50);
hello.tooltip = "Hello</br>This is a HTML format <b>Tooltip</b>.<li>AAA</li><li>BBB</li><li>CCC</li>";
var qunee = graph.createNode("Qunee", 100, 50);
var edge = graph.createEdge("Hello &&&\nQunee", hello, qunee);