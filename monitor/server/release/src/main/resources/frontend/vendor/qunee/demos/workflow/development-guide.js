/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var graph = new Q.Graph(canvas);
graph.originAtCenter = false;

function createStep(label, x, y, title){
    var titleNode = graph.createText(title, x, y - 5);
    titleNode.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#1D4876");
    titleNode.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
    titleNode.setStyle(Q.Styles.LABEL_PADDING, 5);
    titleNode.anchorPosition = Q.Position.LEFT_BOTTOM;
    var node = graph.createText(label, x, y);
    node.setStyle(Q.Styles.LABEL_BORDER, 1);
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFF");
    node.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
    node.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(100, 50));
    node.anchorPosition = Q.Position.LEFT_TOP;

    titleNode.host = node;
    node.host = titleNode;
    return node;
}

function createEdge(from, to, lineWidth, color){
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.EDGE_WIDTH, lineWidth || 3);
    edge.setStyle(Q.Styles.EDGE_COLOR, color || "#1D4876");
}

var smallSteps = [];
function createSmallStep(label, x, y, parent){
    var node = graph.createText(label, x, y);
    node.setStyle(Q.Styles.LABEL_BORDER, 1);
    node.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
    node.setStyle(Q.Styles.LABEL_PADDING, 5);
    node.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(70, 35));
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFF");
    node.anchorPosition = Q.Position.LEFT_TOP;
    if(parent){
        node.parent = parent;
        node.host = parent;
    }
    smallSteps.push(node);
    return node;
}

var step1 = createStep("申请试用", 80, 100, "Step 1");
var step2 = createStep("开始开发", 280, 100, "Step 2");
var step3 = createStep("项目发布", 480, 100, "Step 3");
var step4 = createStep("版本升级", 680, 100, "Step 4");
createEdge(step1, step2);
createEdge(step2, step3);
createEdge(step3, step4);

var step1_1 = createSmallStep("试用下载", 100, 220, step1);
var step2_1 = createSmallStep("15天试用支持", 280, 220, step2);
var step2_2 = createSmallStep("购买开发授权", 280, 330, step2);
var step3_1 = createSmallStep("非商业用途\n申请免费运行授权", 450, 220, step3);
var step3_2 = createSmallStep("购买运行授权", 520, 330, step3);
var step4_1 = createSmallStep("非商业用途\n申请免费升级", 650, 220, step4);
var step4_2 = createSmallStep("购买升级服务", 700, 330, step4);

createEdge(step1, step1_1, 1);
createEdge(step1_1, step2, 1);
createEdge(step2, step2_1, 1);
createEdge(step2_1, step2_2, 1);
createEdge(step3_1, step3, 1);
createEdge(step3_2, step3, 1);
createEdge(step4_1, step4, 1);
createEdge(step4_2, step4, 1);

graph.visibleFilter = function(node){
    return node.visible !== false;
}

graph.onclick = function(evt){
    var node = evt.getData();
    if(!node){
        Q.forEach(smallSteps, function(p){
            p.visible = true;
            p.invalidateVisibility();
        })
        graph.invalidate();
        return;
    }
    if(node.hasChildren()){
        Q.forEach(smallSteps, function(p){
            var visible = p.isDescendantOf(node);
            p.visible = visible;
            p.invalidateVisibility();
        })
        graph.invalidate();
    }
}
