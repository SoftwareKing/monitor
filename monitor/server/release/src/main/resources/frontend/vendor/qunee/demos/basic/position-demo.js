/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

var gap = 80;
var y = -4.5;
for (var name in Q.Position) {
	var p = Q.Position[name];
    if(name == "random" || !(p instanceof Q.Position)){
        continue;
    }
	var x = -4.5;
	for (var name2 in Q.Position) {
		var ap = Q.Position[name2];
        if(name2 == "random" || !(ap instanceof Q.Position)){
            continue;
        }
		var node = graph.createNode(p.sortName + " - " + ap.sortName, 50 + x
						* gap, 50 + y * gap);
        
		node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, Q.toColor(0x55000000));
		node.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
		node.setStyle(Q.Styles.LABEL_RADIUS, 0);

		node.setStyle(Q.Styles.LABEL_POSITION, p);
		node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, ap);
        node.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(2, 5));
		x++;
	}
	y++;
}
