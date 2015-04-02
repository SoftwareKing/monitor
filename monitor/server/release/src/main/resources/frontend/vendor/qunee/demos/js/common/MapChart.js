/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/

//svg support
function SVGtoPathSegment(path, svgSegment, prevPoints, matrix) {
  svgSegment = svgSegment.trim();
  var isLowerLetter = svgSegment[0] > "Z";
  var type = svgSegment[0].toUpperCase();

  var points = svgSegment.substring(1);
  if (points) {
    points = points.trim().split(/[\s,]/g);
    var prevX = 0, prevY = 0;
    if(points.length && isLowerLetter && prevPoints && prevPoints.length >= 2){
      prevX = prevPoints[prevPoints.length - 2];
      prevY = prevPoints[prevPoints.length - 1];
    }
    var x, y;
    for (var i = 0, l = points.length; i < l; i++) {
      points[i] = parseFloat(points[i]);
      if(i % 2){
        y = points[i];
        if(matrix){
          var p = matrix.translatePoint(x, y);
          points[i - 1] = p.x;
          points[i] = p.y;
        }
        if(prevX || prevY){
          points[i - 1] += prevX;
          points[i] += prevY;
        }
      }else{
        x = points[i];
      }
    }
  }
  switch (type) {
    case "M" :
      path.moveTo(points[0], points[1]);
      break;
    case "L" :
      path.lineTo(points[0], points[1]);
      break;
    case "Z" :
      path.closePath();
      break;
    case "Q" :
      path.quadTo(points[0], points[1], points[2], points[3]);
      break;
    case "C" :
      path.curveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
      break;
  }
  return points;
}

var pathSegmentPattern = /[a-z][^a-z]*/ig;
function SVGPathToPath(d, m){
  var path = new Q.Path();
  var segments = d.match(pathSegmentPattern);
  var points;
  if(m && !m.translatePoint){
    m.translatePoint = Matrix.prototype.translatePoint;
  }
  Q.forEach(segments, function(segment){
    points = SVGtoPathSegment(path, segment, points, m);
  });
  return path;
}

function SVGRectToPath(r) {
  var x = parseFloat(r.getAttribute("x"));
  var y = parseFloat(r.getAttribute("y"));
  var w = parseFloat(r.getAttribute("width"));
  var h = parseFloat(r.getAttribute("height"));
  return Q.Shapes.getRect(x, y, w, h);
}

//math
function _toNumbers(matrixString) {
  var index = matrixString.indexOf("(");
  if (index) {
    var lastIndex = matrixString.lastIndexOf(")");
    if (lastIndex < 0) {
      lastIndex = matrixString.length;
    }
    matrixString = matrixString.substring(index + 1, lastIndex);
  }
  var numbers = matrixString.split(",");
  for (var i = 0, l = numbers.length; i < l; i++) {
    numbers[i] = parseFloat(numbers[i]);
  }
  return numbers;
}

/**
 * a c e
 * b d f
 * 0 0 1
 */
var Matrix = function(a, b, c, d, e, f) {
  if(a !== undefined){
    this.set(a, b, c, d, e, f);
  }
}

Matrix.multiply = function(out, a, b){
  var a00 = a.a, a01 = a.c, a02 = a.e,
      a10 = a.b, a11 = a.d, a12 = a.f,
      b00 = b.a, b01 = b.c, b02 = b.e,
      b10 = b.b, b11 = b.d, b12 = b.f;

  if(!out){
    out = new Matrix();
  }
  out.a = b00 * a00 + b01 * a10;
  out.c = b00 * a01 + b01 * a11;
  out.e = b00 * a02 + b01 * a12 + b02;

  out.b = b10 * a00 + b11 * a10;
  out.d = b10 * a01 + b11 * a11;
  out.f = b10 * a02 + b11 * a12 + b12;
  return out;
}

/**
 * a c e
 * b d f
 * 0 0 1
 * @type
 */
Matrix.prototype = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
  set: function(a, b, c, d, e, f){
    if(Q.isString(a)){
      var numbers = _toNumbers(a);
      if (a.indexOf("translate") >= 0) {
        this.e = numbers[0];
        this.f = numbers[1];
      }else{
        this.a = numbers[0] || 1;
        this.b = numbers[1] || 0;
        this.c = numbers[2] || 0;
        this.d = numbers[3] || 1;
        this.e = numbers[4] || 0;
        this.f = numbers[5] || 0;
      }
      return;
    }
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  },
  translatePoint: function(x, y){
    var x2 = x * this.a + y * this.c + this.e;
    var y2 = x * this.b + y * this.d + this.f;
    return {x: x2, y: y2};
  },
  translate : function(dx, dy) {
    if(Q.isString(dx)){
      var numbers = dx.split(",");
      dx = parseFloat(numbers[0]) || 0;
      dy = parseFloat(numbers[1]) || 0;
    }
    this.e += dx;
    this.f += dy;
  },
  scale : function(sx, sy) {
    if(!sx){
      return;
    }
    sy == sy || sx;
    this.a *= sx;
    this.b *= sx;
    this.e *= sx;
    this.c *= sy;
    this.d *= sy;
    this.f *= sy;
  },
  rotate: function(angle){
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    this.a *= cos;
    this.b *= sin;
    this.c *= -sin;
    this.d *= cos;
  },
  multiply: function(m, out){
    return Matrix.multiply(out || this, this, m);
  },
  toString : function() {
    return "matrix(" + formatNumber(this.a) + "," + formatNumber(this.b) + "," + formatNumber(this.c) + "," + formatNumber(this.d)
        + "," + formatNumber(this.e) + "," + formatNumber(this.f) + ")";
  }
}
function formatNumber(number) {
  return number.toFixed(4);
}

;(function(Q, $){

//Map
  function LoadMapFromJSON(json, map, action, callback, scope) {
    for (var n in json.paths) {
      var path = json.paths[n];
      var shape = map.createShape(path);
      if(action){
        action.call(scope, shape, "path", path);
      }
    }
    for (var n in json.points) {
      var p = json.points[n];
      var point = map.createPoint(p);
      if(action){
        action.call(scope, point, "point", p);
      }
    }
    for (var n in json.labels) {
      var label = json.labels[n];
      var text = map.createText(label);
      if(action){
        action.call(scope, text, "label", label);
      }
    }
    if(callback){
      callback.call(scope, map);
    }
  }

  var MapChart = function(div){
    Q.doSuperConstructor(this, MapChart, arguments);
    this.disableRectangleSelection = true;
  }

  MapChart.prototype = {
    _createElement: function(type, name, styles, properties, styles2, properties2){
      if(!(type.prototype instanceof Q.Element)){
        throw new Error("Element Must inherit from 'Q.Element' Type");
      }
      var element = new type();
      element.name = name;
      if(properties){
        for(var n in properties){
          element[n] = properties[n];
        }
      }
      if(styles){
        element.putStyles(styles);
      }
      this.graphModel.add(element);
      return element;
    },
    loadJSON: function(json, action, callback, scope){
      return LoadMapFromJSON(json, this, action, callback, scope);
    },
    createText: function(name, x, y, styles, properties){
      if(name && name.text){
        x = name.x || 0;
        y = name.y || 0;
        if(name.matrix){
          var p = name.matrix.translatePoint(x, y);
          x = p.x;
          y = p.y;
        }
        name = name.text;
      }
      var text = this._createElement(Q.Node, name, styles, properties);
      text.$type = "text";
      text.location = new Q.Point(x, y);
      text.image = null;
      text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
      text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
      return text;
    },
    defaultPointShape: Q.Consts.SHAPE_CIRCLE,
    defaultPointSize: 5,
    createPoint: function(point, name, styles, properties){
      var shape = point.shape || this.defaultPointShape;
      var size = point.size || this.defaultPointSize;
      var path = Q.Shapes.getShape(shape, size, size);
      var node = this._createElement(Q.Node, name || point.name, styles, properties);
      node.image = path;
      node.$type = "point";
      var x = point.x || 0, y = point.y || 0;
      if(point.matrix){
        var p = point.matrix.translatePoint(x, y);
        x = p.x, y = p.y;
      }
      node.setLocation(x, y);
      return node;
    },
    createShape: function(path, name, styles, properties){
      if(Q.isString(path)){
        path = SVGPathToPath(path);
      }else if(path.path){
        path = SVGPathToPath(path.path, path.matrix);
        if(!name){
          name = path.name;
        }
      }
      var node = this._createElement(Q.Node, name, styles, properties);
      node.$type = "shape";
      node.image = path;
      node.anchorPosition = null;
      return node;
    },
    defaultMatchType: MATCH_TYPE_FUZZY,
    getElementByName: function(name, matchType){
      return this._findElementsBy(true, "name", name, matchType);
    },
    findElementsByName: function(name, matchType){
      return this._findElementsBy(false, "name", name, matchType);
    },
    getElementBy: function(propertyName, propertyValue, matchType){
      return this._findElementsBy(true, propertyName, propertyValue, matchType);
    },
    findElementsBy: function(propertyName, propertyValue, matchType){
      return this._findElementsBy(false, propertyName, propertyValue, matchType);
    },
    _findElementsBy: function(getFirst, propertyName, propertyValue, matchType){
      var matchFunction = getMatchFunction(matchType || this.defaultMatchType, propertyValue);
      if(!getFirst){
        var result = [];
      }
      var datas = this.graphModel._values;
      for(var i=0,l=datas.length; i<l; i++){
        var data = datas[i];
        if(matchFunction(data[propertyName])){
          if(getFirst){
            return data;
          }
          result.push(data);
        }
      }
      if(!getFirst){
        return result;
      }
    },
    addHTMLElement: function(div, x, y, isLogicalLocation){
      if(isLogicalLocation){
        var p = this.toCanvas(x, y);
        x = p.x;
        y = p.y;
      }
      div.style.position = "absolute";
      this.html.appendChild(div);
      div.style.left = (x - div.offsetWidth / 2) + "px";
      div.style.top = (y - div.offsetHeight / 2) + "px";
      div.x = x;
      div.y = y;
    },
    removeHTMLElement: function(div){
      this.html.removeChild(div);
    },
    loadJSONByURL: function(url, action, callback){
      var scope = this;
      Q.loadJSON(url, function(json){
        scope.loadJSON(json, action, callback);
      })
    }
  }

  Q.extend(MapChart, Q.Graph);

  var MATCH_TYPE_FUZZY = "fuzzy";
  var MATCH_TYPE_EXACT = "exact";
  var MATCH_TYPE_START = "start";
  function getMatchFunction(matchType, v1){
    if(!Q.isString(v1) || matchType == MATCH_TYPE_EXACT){
      return function(v2){
        return v1 == v2;
      }
    }
    var reg;
    if(matchType == MATCH_TYPE_START){
      reg = new RegExp("\\b" + v1, "i");
    }else{
      reg = new RegExp(v1, "i");
    }
    return function(v2){
      return reg.test(v2);
    }
  }

  Q.MapChart = MapChart;
})(Q, jQuery);
