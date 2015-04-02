/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);

var defaultNode = graph.createNode("Default Node", -240, -110);

var nodeWithLabel = graph.createNode("Node with \nLabel", -120, -110);
nodeWithLabel.setStyle(Q.Styles.LABEL_OFFSET_Y, -10);
nodeWithLabel.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
nodeWithLabel.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_BOTTOM);
nodeWithLabel.setStyle(Q.Styles.LABEL_BORDER, 1);
nodeWithLabel.setStyle(Q.Styles.LABEL_POINTER, true);
nodeWithLabel.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(2, 5));
nodeWithLabel.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, Q.Gradient.LINEAR_GRADIENT_VERTICAL);

var nodeWithLabels = graph.createNode("Node with Labels", 0, -110);
var label1 = new Q.LabelUI();
label1.rotate = -Math.PI / 2;
label1.position = Q.Position.LEFT_MIDDLE;
label1.anchorPosition = Q.Position.CENTER_BOTTOM;
label1.data = "Label 1";
label1.fontStyle = "bolder";
nodeWithLabels.addUI(label1);

var label2 = new Q.LabelUI();
label2.position = Q.Position.CENTER_TOP;
label2.anchorPosition = Q.Position.CENTER_BOTTOM;
label2.border = 1;
label2.padding = new Q.Insets(2, 5);
label2.showPointer = true;
label2.offsetY = -10;
label2.backgroundColor = Colors.yellow;
label2.fontSize = 16;
label2.fontStyle = "italic 100";
nodeWithLabels.addUI(label2, [{
					property : "label2",
					propertyType : Q.Consts.PROPERTY_TYPE_CLIENT,
					bindingProperty : "data"
				}, {
					property : "label2.color",
					propertyType : Q.Consts.PROPERTY_TYPE_CLIENT,
					bindingProperty : "color"
				}]);
nodeWithLabels.set("label2", "another label");
nodeWithLabels.set("label2.color", Colors.blue);

var showLabel1 = true;
var timer = setInterval(function() {
			if (showLabel1) {
				nodeWithLabels.removeUI(label1);
			} else {
				nodeWithLabels.addUI(label1);
			}
			showLabel1 = !showLabel1;
            var now = new Date();
			nodeWithLabels.set("label2", "Wecome to\nyour life. " + now.getMinutes() + ":" + now.getSeconds());
		}, 1000);

var nodeWithIcon = graph.createNode("Node with Icon", 120, -110);
var icon = new Q.ImageUI(graphs.skype);
icon.position = Q.Position.CENTER_TOP;
icon.anchorPosition = Q.Position.LEFT_BOTTOM;
icon.showPointer = true;
icon.border = 1;
icon.offsetX = -5;
icon.offsetY = -10;
icon.padding = new Q.Insets(2, 5);
nodeWithIcon.addUI(icon);

var nodeWithShape = graph.createNode("Node with Shape", 240, -110);
var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, -30, -5, 60, 25);
var shape = new Q.ImageUI(circle);
shape.position = Q.Position.CENTER_MIDDLE;
shape.layoutByAnchorPoint = false;
shape.name = "A";
shape.lineWidth = 1;
shape.strokeStyle = "#000";
shape.fillColor = Q.toColor(0xCCFFFF00);
shape.zIndex = -1;
nodeWithShape.addUI(shape);

var nodeWithSVG = graph.createNode("SVG", -150, -20);
nodeWithSVG.image = "./images/SVG_logo.svg";
nodeWithSVG.size = {height: 70}

var nodeWithPNG = graph.createNode("PNG Logo", 150, -20);
nodeWithPNG.image = "./images/logo-big.png";
nodeWithPNG.size = {width: 203};

var textNode = graph.createText("Text and\nRotatable", -240, 110);
textNode.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
textNode.setStyle(Q.Styles.LABEL_FONT_STYLE, "italic lighter");
textNode.setStyle(Q.Styles.BORDER, 1);
textNode.setStyle(Q.Styles.BORDER_COLOR, "#DDD");
textNode.setStyle(Q.Styles.PADDING, 5);
textNode.rotate = Math.PI / 6;

var nodeWithGradient = graph.createNode("Node with \nGradient", -120, 110);
nodeWithGradient.setStyle(Q.Styles.BACKGROUND_COLOR, Colors.yellow);
nodeWithGradient.setStyle(Q.Styles.BACKGROUND_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, [Q.toColor(0x8AFFFFFF), Q.toColor(0x44CCCCCC), Q.toColor(0x44CCCCCC), Q.toColor(0x55FFFFFF)],
    [0.1, 0.3, 0.7, 0.9], Math.PI/2));
nodeWithGradient.setStyle(Q.Styles.PADDING, new Q.Insets(5));
nodeWithGradient.setStyle(Q.Styles.BORDER, 5);
nodeWithGradient.setStyle(Q.Styles.BORDER_RADIUS, {x: 20, y: 50});
nodeWithGradient.setStyle(Q.Styles.BORDER_COLOR, Colors.blue);
nodeWithGradient.setStyle(Q.Styles.BORDER_LINE_DASH, [3, 2]);

var nodeWithScale = graph.createNode("Node with Scale\nand Render Color", 0, 110);
nodeWithScale.size = {width: 100, height: -1};
nodeWithScale.rotate = -Math.PI / 6;
nodeWithScale.setStyle(Q.Styles.RENDER_COLOR, "#E21667");

nodeWithScale.setStyle(Q.Styles.SHADOW_COLOR, "#888");
nodeWithScale.setStyle(Q.Styles.SHADOW_OFFSET_X, 5);
nodeWithScale.setStyle(Q.Styles.SHADOW_OFFSET_Y, 5);
nodeWithScale.setStyle(Q.Styles.SHADOW_BLUR, 5);

//var nodeWithRenderColor = graph.createNode("Node with \nRender Color", 0, 110);
//nodeWithRenderColor.setStyle(Q.Styles.RENDER_COLOR, Colors.yellow);

var nodeWithGIF = graph.createNode("Node with GIF\nnot support IE", 120, 110);
nodeWithGIF.image = "./images/sheep.gif";
var gifIcon = new Q.ImageUI("./images/sheep.gif");
gifIcon.position = Q.Position.CENTER_TOP;
gifIcon.anchorPosition = Q.Position.LEFT_BOTTOM;
gifIcon.showPointer = true;
gifIcon.border = 1;
gifIcon.offsetX = -5;
gifIcon.offsetY = -10;
gifIcon.padding = new Q.Insets(2, 5);
nodeWithGIF.addUI(gifIcon);

var nodeShape = graph.createNode("Custom Shape", 240, 110);
var customShape = new Q.Path();
customShape.moveTo(20, -50);
customShape.lineTo(100, -50);
customShape.lineTo(100, 50);
customShape.quadTo(20, 50, 20, 20);
nodeShape.image = customShape;
nodeShape.setStyle(Q.Styles.SHAPE_STROKE, 4);
nodeShape.setStyle(Q.Styles.SHAPE_STROKE_STYLE, Colors.blue);
nodeShape.setStyle(Q.Styles.SHAPE_OUTLINE, 1);
nodeShape.setStyle(Q.Styles.SHAPE_OUTLINE_STYLE, Colors.red);
nodeShape.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
nodeShape.size = {width: 100, height: -1};

//nodeShape.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#CCC");
//nodeShape.setStyle(Q.Styles.SHAPE_FILL_GRADIENT, Q.Gradient.RAINBOW_RADIAL_GRADIENT);


function destroy(){
    clearInterval(timer);
}