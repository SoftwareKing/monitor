/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
function Matrix2D(m){
    this.m = m || [1,0,0,1,0,0];
}
Matrix2D.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};
Matrix2D.prototype = {
    m: null,
    rotate: function(rad, out){
        var s = Math.sin(rad),
            c = Math.cos(rad);
        var rotateM = [c, s, -s, c];
        return Matrix2D.multiply(out || this.m, rotateM, this.m);
    },
    scale: function(sx, sy, out){
        var scaleM = [sx, 0, 0, sy];
        return Matrix2D.multiply(out || this.m, scaleM, this.m);
    },
    translate: function(tx, ty, out){
        out = out || this.m;
        out[4] += tx;
        out[5] += ty;
        return out;
    },
    translatePoint: function(x, y){
        var a = this.m;
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        return {x: a0 * x + a2 * y + a[4], y: a1 * x + a3 * y + a[5]};
    }
}

function HeatMap(canvas, points) {
    this.points = points || [];
    this.cache = {};
    this.canvas = canvas || document.createElement('canvas');
    this.defaultRadius = 80;
    this.defaultIntensity = 0.2;
    this.setGradientStops({
        0.00: 0xffffff00,
        0.10: 0x99e9fdff,
        0.20: 0x00c9fcff,
        0.30: 0x00e9fdff,
        0.30: 0x00a5fcff,
        0.40: 0x0078f2ff,
        0.50: 0x0e53e9ff,
        0.60: 0x4a2cd9ff,
        0.70: 0x890bbfff,
        0.80: 0x99019aff,
        0.90: 0x990664ff,
        0.99: 0x660000ff,
        1.00: 0x000000ff
    });
}
HeatMap.prototype = {
    setGradientStops: function (stops) {
        var ctx = document.createElement('canvas').getContext('2d');
        var grd = ctx.createLinearGradient(0, 0, 256, 0);

        for (var i in stops) {
            grd.addColorStop(i, 'rgba(' +
            ((stops[i] >> 24) & 0xFF) + ',' +
            ((stops[i] >> 16) & 0xFF) + ',' +
            ((stops[i] >> 8) & 0xFF) + ',' +
            ((stops[i] >> 0) & 0xFF) + ')');
        }

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 256, 1);
        this.gradient = ctx.getImageData(0, 0, 256, 1).data;
    },
    drawHeatPoints: function (alpha, ctx) {
        var offsetX = 0, offsetY = 0;
        this.cache = {};

        ctx = ctx || this.canvas.getContext('2d');
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save(); // Workaround for a bug in Google Chrome
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();

        for (var i in this.points) {

            var src = this.points[i];
            var rad = src.radius || this.defaultRadius;
            var int = src.intensity || this.defaultIntensity;
            var pos = src;
            var x = pos.x - rad + offsetX;
            var y = pos.y - rad + offsetY;

            if (!this.cache[int]) {
                this.cache[int] = {};
            }

            if (!this.cache[int][rad]) {
                var grd = ctx.createRadialGradient(rad, rad, 0, rad, rad, rad);
                grd.addColorStop(0.0, 'rgba(0, 0, 0, ' + int + ')');
                grd.addColorStop(1.0, 'transparent');
                this.cache[int][rad] = grd;
            }

            ctx.fillStyle = this.cache[int][rad];
            ctx.translate(x, y);
            ctx.fillRect(0, 0, 2 * rad, 2 * rad);
            ctx.translate(-x, -y);
        }

        var dat = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var dim = this.canvas.width * this.canvas.height * 4;
        var pix = dat.data;

        for (var p = 0; p < dim; /* */) {
            var a = pix[ p + 3 ] * 4;
            pix[ p++ ] = this.gradient[ a++ ];
            pix[ p++ ] = this.gradient[ a++ ];
            pix[ p++ ] = this.gradient[ a++ ];
            pix[ p++ ] = parseInt(this.gradient[ a++ ] * (alpha || 1));
        }

        ctx.putImageData(dat, 0, 0);
    }
}
var graph;
var GAP = 30;
var X_OFFSET = 20, Y_OFFSET = 20;

function to2_5D(x, y) {
    var sin = Math.sin(Math.PI / 6);
    var cos = Math.cos(Math.PI / 6);
    var x2 = x * cos + y * cos;
    var y2 = x * sin - y * sin;
    return {x: x2, y: y2};
}

function toGrid(x, y) {
    var sin = Math.sin(Math.PI / 6);
    var cos = Math.cos(Math.PI / 6);

    var x2 = (x * sin + y * cos) / 2 / sin / cos;
    var y2 = (x * sin - y * cos) / 2 / sin / cos;
    return {x: x2, y: y2};
}

function drawHeatMap(tempG, width, height, bounds) {
    var heatCanvas = document.createElement("canvas");
    heatCanvas.width = width;
    heatCanvas.height = height;

    var alpha = 0.9;
    var points = [];
    var i = 0;
    while (i++ < 100) {
        var intensity = 0.028 + parseInt(Math.random() * 50) * 0.01;
        var radius = 70;//intensity * 200;
        points.push({intensity: intensity, radius: radius, x: Math.random() * width, y: Math.random() * height});
    }
    var heatMap = new HeatMap(heatCanvas, points);
    heatMap.drawHeatPoints(alpha);
    tempG.save();
    tempG.scale(1, -1);

    var matrix = new Matrix2D();
    var sin = Math.sin(Math.PI / 4);
    var cos = Math.cos(Math.PI / 4);
    var w = sin * height + cos * width;
    var scale = bounds.width / w;
    matrix.rotate(Math.PI / 4);
    matrix.scale(1 * scale, Math.tan(Math.PI / 6) * scale);
    matrix.translate(height * scale * Math.sin(Math.PI / 4), 0);
    var m = matrix.m;
    tempG.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
    tempG.drawImage(heatCanvas, 0, 0);
    tempG.restore();
}

function createRoomTexture(width, height) {
    var gap = GAP;

    var bounds = new Q.Rect();
    bounds.addPoint(to2_5D(0, 0));
    bounds.addPoint(to2_5D(0, height));
    bounds.addPoint(to2_5D(width, height));
    bounds.addPoint(to2_5D(width, 0));

    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = bounds.width;
    tempCanvas.height = bounds.height;
    var tempG = tempCanvas.getContext('2d');

    tempG.fillStyle = "#FFF";
    tempG.fillRect(0, 0, bounds.width, bounds.height);

    tempG.translate(-bounds.x, -bounds.y);
    var x = 0;
    while (x < width) {
        var p = to2_5D(x, 0);
        tempG.moveTo(p.x, p.y);
        p = to2_5D(x, height);
        tempG.lineTo(p.x, p.y);
        x += gap;
    }
    var y = 0;
    while (y < height) {
        var p = to2_5D(0, y);
        tempG.moveTo(p.x, p.y);
        p = to2_5D(width, y);
        tempG.lineTo(p.x, p.y);
        y += gap;
    }
    tempG.strokeStyle = "#888";
    tempG.lineWidth = 1;
    tempG.stroke();

    tempG.translate(bounds.x, bounds.y);
    drawHeatMap(tempG, width, height, bounds);

    return tempG.createPattern(tempCanvas, 'repeat');
}

function createServer(name, x, y, image) {
    var p = to2_5D(x || 0, y || 0);
    var node = graph.createNode(name, p.x, p.y);
    node.anchorPosition = Q.Position.CENTER_BOTTOM;
    node.size = {width: 25};
    node.image = image || "others/icons/server.png";

    if(Q.randomInt(10) > 7){
        var color = Q.randomBool() ? "#FF0" : "#F00";
        node.setStyle(Q.Styles.RENDER_COLOR, color);
        var alarmImage;
        if(color == "#F00"){
            alarmImage = "others/icons/error.png";
        }else if(color == "#FF0"){
            alarmImage = "others/icons/warning.png";
        }else{
            alarmImage = "others/icons/info.png";
        }
        var alarmIcon = this.alarmIcon = new Q.ImageUI(alarmImage);
        alarmIcon.size = {width: 12};
        alarmIcon.padding = 2;
        alarmIcon.offsetX = -10;
        alarmIcon.offsetY = 5;
        alarmIcon.anchorPosition = Q.Position.CENTER_BOTTOM;
        alarmIcon.position = Q.Position.RIGHT_TOP;
        node.addUI(alarmIcon);
    }
    return node;
}

function createRoom(width, height) {
    var bounds = new Q.Rect();
    bounds.addPoint(to2_5D(0, 0));
    bounds.addPoint(to2_5D(0, height));
    bounds.addPoint(to2_5D(width, height));
    bounds.addPoint(to2_5D(width, 0));
    var dy = -bounds.y;

    var room = graph.createShapeNode("机房001", 0, -dy);

    var p = to2_5D(0, 0);
    room.moveTo(p.x, p.y + dy);
    p = to2_5D(width, 0);
    room.lineTo(p.x, p.y + dy);
    p = to2_5D(width, height);
    room.lineTo(p.x, p.y + dy);
    p = to2_5D(0, height);
    room.lineTo(p.x, p.y + dy);
    room.closePath();

    room.setStyle(Q.Styles.SHAPE_FILL_COLOR, createRoomTexture(width, height));
    room.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_BOTTOM);
    room.setStyle(Q.Styles.LABEL_FONT_SIZE, 18);
    room.setStyle(Q.Styles.SELECTION_BORDER, 5);
//            room.setStyle(Q.Styles.LAYOUT_BY_PATH, false);
    room.zIndex = -1;
    room.movable = false;
//    room.selectable = false;
    return room;
}

function updateZIndex(node, invalidate) {
    node.zIndex = node.y + 2000;
    if (invalidate) {
        node.invalidate();
    }
}

function snapToGrid(node) {
    var gap = GAP;
    var p = toGrid(node.x, node.y);
    p.x /= gap;
    p.y /= gap;
    p = to2_5D(parseInt(p.x) * gap + X_OFFSET, parseInt(p.y) * gap + Y_OFFSET);
    node.setLocation(p.x, p.y);
}


graph = new Q.Graph('canvas');
var styles = graph.styles = {};
styles[Q.Styles.SELECTION_COLOR] = "#000";
styles[Q.Styles.SELECTION_TYPE] = Q.Consts.SELECTION_TYPE_BORDER;

graph.zoomToOverview();
graph.interactionDispatcher.addListener(function (evt) {
    if (evt.kind == Q.InteractionEvent.ELEMENT_MOVING) {
        var datas = evt.datas;
        datas.forEach(function (node) {
            updateZIndex(node, true);
        });
    } else if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_END) {
        var datas = evt.datas;
        datas.forEach(snapToGrid);
    }
})

var width = 600;
var height = 500;

var room = createRoom(width, height);

var x = X_OFFSET;
while (x < width) {
    var y = Y_OFFSET;
    while (y < height - GAP) {
        var node = createServer("", x, y);
        y += GAP * 2;
        updateZIndex(node);
    }
    x += GAP;
}