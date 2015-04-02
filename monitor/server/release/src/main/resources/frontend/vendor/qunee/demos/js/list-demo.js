/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var currentDemo = window.currentDemo;

if(!Q.hasImage('clickAndLoad')){
    Q.registerImage('clickAndLoad', {
        draw: function(g){
            g.fillStyle = '#777';
            g.translate(100, 20);
            g.font = 'lighter 18px "Open Sans", "Helvetica Neue", Arial, sans-serif';
            g.textAlign = "center";
            g.fillText('Click', 0, 0);
            g.fillText('Load Demo', 0, 20);
            g.strokeStyle = '#999';
            g.moveTo(-8, 30);
            g.lineTo(0, 35);
            g.lineTo(8, 30);
            g.lineWidth = 1;
            g.stroke();
        }
    })
}


var graph = new Q.Graph(canvas);
graph.moveToCenter(0.8);

var defaultBackgroundColor = '#FFF';
var size = 170;

var currentElement;
var highlightColor = Colors.yellow;
var defaultGradient = new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, [Q.toColor(0x44FAFAFA), Q.toColor(0x33AAAAAA)], null, Math.PI/2);
function unhighlight(element){
    element.setStyle(Q.Styles.BACKGROUND_COLOR, defaultBackgroundColor);
//    element.setStyle(Q.Styles.BACKGROUND_GRADIENT, defaultGradient);
//    element.setStyle(Q.Styles.BORDER, 0.1);
}
function highlight(element){
    if(currentElement == element){
        return;
    }
    if(currentElement){
        unhighlight(currentElement);
    }
    currentElement = element;
    if(!currentElement){
        return;
    }
    currentElement.setStyle(Q.Styles.BACKGROUND_COLOR, highlightColor);
    currentElement.setStyle(Q.Styles.BACKGROUND_GRADIENT, null);
    currentElement.setStyle(Q.Styles.BORDER, 0);
}

graph.addCustomInteraction({
    onmousemove: function(evt, graph){
        var data = evt.getData();
        if(!data){
            graph.cursor = null;
            highlight(null);
            return;
        }
        graph.cursor = "pointer";
        highlight(data);
    },
    onclick: function(evt, graph){
        var data = evt.getData();
        if(data){
            showDemo(data.name);
        }
    }
});

function createDemoItem(item){
    var name = item.name;
    if(name.length > 20){
        name = name.substring(0, 17);
        name += '...';
    }
    var node = graph.createNode(name);
    node.tooltip = item.name;
    node.data = item;
    if(item.image){
        node.image = item.image;
        node.setStyle(Q.Styles.SHADOW_COLOR, '#2898E0');
    }else{
        node.image = 'clickAndLoad';
        node.setStyle(Q.Styles.IMAGE_PADDING, new Q.Insets(15, 0));
        node.setStyle(Q.Styles.SHADOW_COLOR, '#CCC');
    }
    //node.setStyle(Q.Styles.BACKGROUND_GRADIENT, defaultGradient);
    node.size = new Q.Size(size, -1);
    node.setStyle(Q.Styles.BACKGROUND_COLOR, defaultBackgroundColor);
    node.setStyle(Q.Styles.PADDING, new Q.Insets(10, 10, 5, 10));
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
    node.setStyle(Q.Styles.LABEL_PADDING, 5);
    node.setStyle(Q.Styles.SHADOW_BLUR, 5);
    return node;
}

if(currentDemo && currentDemo.length){
    var l=currentDemo.length;
    for(var i= 0;i<l;i++){
        createDemoItem(currentDemo[i]);
    }
    var columns = l > 4 ? 4 : 3;
    var gap = l > 4 ? 70 : 150;

//layout
    var model = graph.graphModel;

    var gap_x = size + gap;
    var gap_y = size + 50;
    var rows=Math.ceil(l/columns), row= -1;
    var H = (rows - 1) * gap_y;
    var x, y, n;
    for(i= 0;i<l;i++){
        var node = model.get(i);
        if(i % columns == 0){
            row++;
            if(l-i >= columns){
                n = columns;
            }else{
                n = l-i;
            }
            x = -gap_x * (n - 1) / 2;
            y = -H/2 + row * gap_y;
        }else{
            x += gap_x;
        }
        node.setLocation(x, y);
    }

}