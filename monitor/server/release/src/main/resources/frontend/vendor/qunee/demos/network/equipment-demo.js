/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.originAtCenter = false;
graph.translate(20, 20);
var rack = createEquipment("", 4, 1, "network/equipment-images/shelf.jpg");
var card1 = createEquipment("", 10, 7, "network/equipment-images/04_card.jpg", rack);
createLamp(58, 33, "network/equipment-images/lamp_green.png", card1);
createLamp(58, 44, "network/equipment-images/lamp_green.png", card1);
createLabel(58, 63, "QUNEE", card1);

createEquipment("", 354, 13, "network/equipment-images/card1.png", rack);
createEquipment("", 126, 13, "network/equipment-images/card1.png", rack);
createEquipment("", 126, 48, "network/equipment-images/card2.png", rack);
createEquipment("", 126, 82, "network/equipment-images/card2.png", rack);
createEquipment("", 126, 116, "network/equipment-images/card2.png", rack);
createEquipment("", 126, 150, "network/equipment-images/card2.png", rack);
createEquipment("", 126, 184, "network/equipment-images/card2.png", rack);
createEquipment("", 126, 218, "network/equipment-images/card.jpg", rack).size = {width: 441};
var card2 = createEquipment("", 126, 286, "network/equipment-images/card2.png", rack);
createLamp(152, 297, "network/equipment-images/lamp_green.png", card2);
createLamp(165, 297, "network/equipment-images/lamp_green.png", card2);
createLabel(170, 297, "QUNEE", card2, Q.Position.LEFT_MIDDLE);
var port = createEquipment("", 287, 290, "network/equipment-images/port_green.gif", card2);
port.size = {width: 20};
port = createEquipment("", 310, 290, "network/equipment-images/port_green.gif", card2);
port.size = {width: 20};
port = createEquipment("", 333, 290, "network/equipment-images/port_grey.gif", card2);
port.size = {width: 20};

createEquipment("", 126, 321, "network/equipment-images/slot.jpg", rack);
var card = createEquipment("", 274, 320, "network/equipment-images/card3.png", rack);

///blinking support
var blinkingColor = "#00FF00";
var blinkingElements = [port, card];

function blinking(){
    var blinking = this._blinking;
    if(blinking === undefined){
        blinking = false;
    }else{
        blinking = !blinking;
    }
    this._blinking = blinking;
    this.setStyle(Q.Styles.RENDER_COLOR, blinking ? blinkingColor : null);
}
function resetBlinking(){
    if(this._blinking === false){
        this.setStyle(Q.Styles.RENDER_COLOR, null);
    }
}
var blinkingTimer;
var INTERVAL = 1000;
function startBlinking(){
    if(blinkingTimer){
        return;
    }
    blinkingTimer = setTimeout(function A() {
        blinkingElements.forEach(function(data){
            blinking.call(data);
        })
        blinkingTimer = setTimeout(A, INTERVAL);
    }, INTERVAL);
}
function stopBlinking(){
    if(blinkingTimer){
        clearTimeout(blinkingTimer);
        blinkingTimer = null;
        blinkingElements.forEach(function(data){
            resetBlinking.call(data);
        })
    }
}
startBlinking();

function destroy(){
    if(blinkingTimer) {
        clearTimeout(blinkingTimer);
    }
}

function createEquipment(name, x, y, image, host){
    var node = graph.createNode(name, x, y);
    node.anchorPosition = Q.Position.LEFT_TOP;
    node.image = image;
    if(host){
        node.host = host;
        node.parent = host;
    }
    return node;
}

function createLamp(x, y, image, host){
    var lamp = graph.createNode("", x, y);
    lamp.image = image;
    if(host){
        lamp.host = host;
        lamp.parent = host;
    }
    return lamp;
}

function createLabel(x, y, text, host, position){
    var label = graph.createText(text, x, y);
    label.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
    if(position){
        label.anchorPosition = position;
    }
    if(host){
        label.host = host;
        label.parent = host;
    }
    return label;
}