/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
//json export and parse support
!function (Q, window, document) {
  if (Q.Graph.prototype.parseJSON) {
    return;
  }
  function getByPath(pathName, scope) {
    var paths = pathName.split('.');
    scope = scope || window;
    var i = -1;
    while (scope && ++i < paths.length) {
      var path = paths[i];
      scope = scope[path];
    }
    return scope;
  }

  function loadClassPath(object, namespace, loadChild) {
    object._classPath = namespace;
    if (object instanceof Function) {
      object.prototype._className = object._classPath;
      object.prototype._class = object;
//            Q.log(v._className);
//            continue;
    }
    if (loadChild === false) {
      return;
    }
    for (var name in object) {
      if (name[0] == '_' || name[0] == '$' || name == 'superclass' || name == 'constructor' || name == 'prototype' || name.indexOf('.') >= 0) {
        continue;
      }
      var v = object[name];
      if (!v || !(v instanceof Object) || v._classPath) {
        continue;
      }
      loadClassPath(v, namespace + '.' + name);
    }
  }

  var prototypes = {};

  function getPrototype(data) {
    var className = data._className;
    if (!className) {
      return null;
    }
    var prototype = prototypes[className];
    if (!prototype) {
      var clazz = data._class;
      prototype = prototypes[className] = new clazz();
    }
    return prototype;
  }

  function equals(a, b) {
    return a == b || (a && b && a.equals && a.equals(b));
  }

  Q.HashList.prototype.toJSON = function (serializer) {
    var datas = [];
    this.forEach(function (data) {
      datas.push(serializer.toJSON(data));
    })
    return datas;
  }

  Q.HashList.prototype.parseJSON = function (json, serializer) {
    json.forEach(function (item) {
      this.add(serializer.parseJSON(item));
    }, this)
  }

  function exportElementProperties(serializer, properties, info, element) {
    var prototype = getPrototype(element);
    properties.forEach(function (name) {
      var value = element[name];
      if (!equals(value, prototype[name])) {
        var json = serializer.toJSON(value);
        if (json || !value) {
          info[name] = json;
        }
      }
    }, element);
  }

  function exportProperties(serializer, properties) {
    var info;
    for (var s in properties) {
      if (!info) {
        info = {};
      }
      info[s] = serializer.toJSON(properties[s]);
    }
    return info;
  }

  Q.Element.prototype.toJSON = function (serializer) {
    var info = {};
    var outputProperties = ['zIndex', 'tooltipType', 'tooltip', 'movable', 'selectable', 'resizable', 'uiClass', 'name', 'parent', 'host'];
    if (this.outputProperties) {
      outputProperties = outputProperties.concat(this.outputProperties);
    }
    exportElementProperties(serializer, outputProperties, info, this);
    if (this.styles) {
      var styles = exportProperties(serializer, this.styles);
      if (styles) {
        info.styles = styles;
      }
    }
    if (this.properties) {
      var properties = exportProperties(serializer, this.properties);
      if (properties) {
        info.properties = properties;
      }
    }
    return info;
  }
  Q.Element.prototype.parseJSON = function (info, serializer) {
    if (info.styles) {
      var styles = {};
      for (var n in info.styles) {
        styles[n] = serializer.parseJSON(info.styles[n]);
      }
      this.putStyles(styles, true);
      delete info.styles;
    }
    if (info.properties) {
      var properties = {};
      for (var n in info.properties) {
        properties[n] = serializer.parseJSON(info.properties[n]);
//                this.set(n, JSONToObject(info.properties[n]))
      }
      this.properties = properties;
      delete info.properties;
    }
    for (var n in info) {
      var v = serializer.parseJSON(info[n]);
      this[n] = v;
    }
  }
  Q.Node.prototype.toJSON = function (serializer) {
    var info = Q.doSuper(this, Q.Node, 'toJSON', arguments);
    exportElementProperties(serializer, ['location', 'size', 'image', 'rotate', 'anchorPosition'], info, this);
    return info;
  }
  Q.Group.prototype.toJSON = function (serializer) {
    var info = Q.doSuper(this, Q.Group, 'toJSON', arguments);
    exportElementProperties(serializer, ['minSize', 'groupType', 'padding', 'groupImage', 'expanded'], info, this);
    return info;
  }
  Q.ShapeNode.prototype.toJSON = function (serializer) {
    var info = Q.doSuper(this, Q.Node, 'toJSON', arguments);
    exportElementProperties(serializer, ['location', 'rotate', 'anchorPosition', 'path'], info, this);
    return info;
  }
  Q.Edge.prototype.toJSON = function (serializer) {
    var info = Q.doSuper(this, Q.Edge, 'toJSON', arguments);
    exportElementProperties(serializer, ['from', 'to', 'edgeType', 'angle', 'bundleEnabled', 'pathSegments'], info, this);
    return info;
  }

  function JSONSerializer(options) {
    this._refs = {};
    if(options){
      this.root = options.root;
    }
  }

  JSONSerializer.prototype = {
    _refs: null,
    _index: 1,
    root: null,
    reset: function () {
      this._refs = {};
      this._index = 1;
    },
    getREF: function (id) {
      return this._refs[id];
    },
    clearRef: function () {
      for (var id in this._refs) {
        var json = this._refs[id];
        var value = json._value;
        if (value) {
          if (!value._refed) {
            delete json._refId;
          }
          delete value._refed;
          delete value._refId;
          delete json._value;
        }
      }
      this.reset();
    },
    toJSON: function (value) {
      if (!(value instanceof Object)) {
        return value;
      }
      if (value instanceof Function && !value._classPath) {
        return null;
      }
      if (value._refId !== undefined) {
        value._refed = true;
        return {_ref: value._refId};
      }
      var refId = this._index++;
      value._refId = refId;
      var json = this._toJSON(value);
      json._refId = refId;
      json._value = value;
      this._refs[refId] = json;
      return json;
    },
    _toJSON: function (value) {
      if (value._classPath) {
        return {_classPath: value._classPath};
      }
      if (!value._className) {
        return value;
      }
      var result = {_className: value._className};
      if (value.toJSON) {
        result.json = value.toJSON(this);
      } else {
        result.json = value;
      }
      return result;
    },
    parseJSON: function (json) {
      if (!(json instanceof Object)) {
        return json;
      }
      if (json._ref !== undefined) {
        return this._refs[json._ref];
      }
      if (json._refId !== undefined) {
        return this._refs[json._refId] = this._parseJSON(json);
      }
      return this._parseJSON(json);
    },
    _parseJSON: function (json) {
      if (json._classPath) {
        return getByPath(json._classPath);
      }
      if (json._className) {
        var F = getByPath(json._className);
        var v = new F();
        ///防止相互引用导致的问题
        if (json._refId !== undefined) {
          this._refs[json._refId] = v;
        }
        if (v && json.json) {
          json = json.json;
          if (v.parseJSON) {
            v.parseJSON(json, this);
          } else {
            for (var n in json) {
              v[n] = json[n];
            }
          }
        }
        return v;
      }
      return json;
    }
  }

  Q.GraphModel.prototype.toJSON = function (filter) {
    var serializer = new JSONSerializer();

    var json = {};
    var datas = json.datas = [];
    json.version = '1.6';

    this.forEach(function (d) {
      if (filter && filter(d) === false) {
        return;
      }
      datas.push(serializer.toJSON(d));
    }, this);

    serializer.clearRef();
    return json;
  }
  Q.GraphModel.prototype.parseJSON = function (json, options) {
    var serializer = new JSONSerializer(options);

    var datas = json.datas;
    datas.forEach(function (json) {
      var element = serializer.parseJSON(json);
      if (element instanceof Q.Element) {
        this.add(element);
      }
    }, this);

    serializer.reset();
  }

  Q.Graph.prototype.exportJSON = function (toString, options) {
    options = options || {};
    var json = this.graphModel.toJSON(options.filter);
    if (toString) {
      json = JSON.stringify(json, options.replacer, options.space || '\t')
    }
    return json;
  }
  Q.Graph.prototype.parseJSON = function (json, options) {
    if (Q.isString(json)) {
      json = JSON.parse(json);
    }
    this.graphModel.parseJSON(json, options);
  }

  loadClassPath(Q, 'Q');
  Q.loadClassPath = loadClassPath;
}(Q, window, document);
