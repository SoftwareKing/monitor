/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.originAtCenter = false;

function createText(host, name, x, y, anchorPosition, w, h, fontSize, fontColor, backgroundColor){
    var text = graph.createText(name, x, y);
    text.setStyle(Q.Styles.LABEL_BORDER, 0.5);
    text.setStyle(Q.Styles.LABEL_PADDING, 5);
    text.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
    text.tooltipType = "text";
    if(host){
        text.host = text.parent = host;
    }
    if(anchorPosition){
        text.anchorPosition = anchorPosition;
        text.setStyle(Q.Styles.LABEL_ALIGN_POSITION, anchorPosition);
    }
    if(w && h){
        text.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(w, h));
    }

    text.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize || 14);
    text.setStyle(Q.Styles.LABEL_COLOR, fontColor || "#555");
    text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, backgroundColor || "#FFF");
//    text.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, ['#00d4f9', '#1ea6e6'], null, Math.PI/2));
    return text;
}

var html5 = createText(null, "HTML5", 310, 20, Q.Position.CENTER_TOP, 572, 380, 30, "#2eaae6");
var newElements = createText(html5, "New Elements", 170, 71, Q.Position.CENTER_TOP, 255, 216, 20, "#2eaae6", "#ebebeb");
var newAPIs = createText(html5, "New APIs", 450, 71, Q.Position.CENTER_TOP, 255, 216, 20, "#2eaae6", "#ebebeb");
createText(newElements, "<!DOCTYPE html>", 118, 135);
createText(newElements, "<Canvas>", 237, 135);
createText(newElements, "<Audio>", 116, 182);
createText(newElements, "<Video>", 235, 182);
createText(newElements, "<section>, <article>\n<header>, <nav> ...", 174, 241, Q.Position.CENTER_MIDDLE, 210, 40);
createText(newAPIs, "File APIs\nDrag & Drop\nWeb Messaging\nBrowser history management\nWeb Storage\n" +
    "Web Sockets\nWeb Workers\n......", 450, 112, Q.Position.CENTER_TOP, 210, 160);
createText(html5, "Touch", 86, 335);
createText(html5, "Animation", 182, 322);
createText(html5, "CSS3", 109, 380);
createText(html5, "SVG", 184, 362);
createText(html5, "more...", 233, 390);
createText(html5, "MathML", 409, 320);
createText(html5, "Web Open Font", 520, 335);
createText(html5, "Geo Location", 441, 370);
createText(html5, "Selectors", 544, 376);

var html5Logo = graph.createNode("", 313, 375);
html5Logo.image = "./images/html5.png";
html5Logo.size = {width: 120};
html5Logo.host = html5Logo.parent = html5;