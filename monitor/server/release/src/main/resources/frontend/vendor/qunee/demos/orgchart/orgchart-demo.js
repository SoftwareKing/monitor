/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

function createPerson(photo, name, position, x, y){
    var person = graph.createNode(name + "\n" + position);
    person.image = photo;
    person.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
    person.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_MIDDLE);
    person.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_MIDDLE);
    person.setStyle(Q.Styles.BACKGROUND_COLOR, Q.toColor(0xEEDDDDDD));
    person.setStyle(Q.Styles.PADDING, new Q.Insets(5));
}

function createEdge(from, to){
    graph.createEdge(from, to);
}

createPerson("./orgchart/images/barak_obama256.png", "Barak Obama", "President");
createPerson("./orgchart/images/hugo_chavez256.png", "Hugo Chavez", "President");
createPerson("./orgchart/images/alvaro_uribe.png", "Alvaro Uribe", "President");
createPerson("./orgchart/images/evo_morales.png", "Alvaro Uribe", "President");
createPerson("./orgchart/images/hamid_carzay256.png", "Hamid Carzay", "President");
createPerson("./orgchart/images/jose_mujica256.png", "Jose_Mujica", "President");
createPerson("./orgchart/images/kim_yongii.png", "Kim Yongii", "President");
createPerson("./orgchart/images/nicolas_sarkozy256.png", "Nicolas Sarkozy", "President");
createPerson("./orgchart/images/vladimir_putin_256.png", "Vladimir Putin", "President");

var r = 400;
var angle = 0;
var count = graph.graphModel.length;
var perAngle = 2 * Math.PI / (count - 1);
var nodes = graph.graphModel.toDatas();

var center = nodes[0];
var i = 1;
while(i < count){
    var node = nodes[i++];
    node.setLocation(r * Math.sin(angle), r * Math.cos(angle));
    angle += perAngle;
    createEdge(center, node);
}

graph.zoomToOverview();
