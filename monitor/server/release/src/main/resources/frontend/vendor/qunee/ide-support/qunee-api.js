/**
 * This file is part of Qunee for HTML5.
 * Copyright (c) 2014 by qunee.com
 *
 * @author {@link http://qunee.com}
 * @description Qunee for HTML5工具包，提供图形组件，可实现拓扑图、组织图、流程图等，
 * 具有高效，轻量，容易扩展的特点
 * @type Object
 * @namespace
 * @static
 */
var Q = {};
/**
 * 版本号
 * @type String
 * @static
 */
Q.version = {};
/**
 * 继承，子类继承父类，并重写属性或者函数
 * @example Q.extend(Q.Node, Q.Element, {
 *  toString: function(){
 *    return "Node";
 *  }
 * });
 * @param {Function} sb 子类
 * @param {Function} sp 父类
 * @param {Object} overrides 重写方法
 * @static
 */
Q.extend = function (sb, sp, overrides) {};
/**
 * 调用父类的构造函数，相当于java的super(...)
 * @example
 * function Node(id){
 *  Q.doSuperConstructor(this, Node, arguments);
 *  ...
 * }
 * @param {Object} object 对象
 * @param {Function} type 对象类型
 * @param {Array} args 调用参数
 * @static
 */
Q.doSuperConstructor = function (object, type, args) {};
/**
 * 调用父类函数，相当于java中的super.method***(...)
 * @example
 * NodeUI.initialize.prototype = function(){
 *  Q.doSuper(this, NodeUI, "initialize");
 *  ...
 * }
 *
 * @param {Object} object 对象
 * @param {Function} type 对象类型
 * @param {String} method 调用方法
 * @param {Array} args 调用参数， 通常使用arguments
 * @static
 */
Q.doSuper = function (object, type, method, args) {};
/**
 * 生成函数，指定函数作用域
 * @param {Object} obj 函数作用域
 * @param {Function} strFunc 函数
 * @returns {Function}
 * @static
 */
Q.createFunction = function (obj, strFunc) {};
/**
 * 设置class name
 * @param {HTMLElement} element HTML元素对象
 * @param {type} className 样式类名
 * @static
 */
Q.setClass = function (element, className) {};
/**
 * 追加样式类名
 * @param {HTMLElement} element HTML元素对象
 * @param {type} className 样式类名
 * @static
 */
Q.appendClass = function (element, className) {};
/**
 * 删除类名
 * @param {HTMLElement} element HTML元素对象
 * @param {type} className 样式类名
 * @static
 */
Q.removeClass = function (element, className) {};
/**
 * 遍历数组，在指定的作用域内调用回调函数
 * @param {Array} array 数组
 * @param {Function} call 回调函数，如果回调函数结果返回false，则终止遍历
 * @param {Object} [scope] 函数作用域
 * @returns {Boolean} 如果返回false，表示没有遍历完整个数组
 * @static
 */
Q.forEach = function (array, call, scope, params) {};
/**
 * 反向遍历数组，在指定的作用域内调用回调函数
 * @param {Array} array 数组
 * @param {Function} call 回调函数，如果回调函数结果返回false，则终止遍历
 * @param {Object} [scope] 函数作用域
 * @returns {Boolean} 如果返回false，表示没有遍历完整个数组
 * @static
 */
Q.forEachReverse = function (array, call, scope, params) {};
/**
 * 是否为Number类型
 * @example
 * Q.isNumber(0);
 *
 * @param {Object} n 对象
 * @returns {Boolean} 对象n是否为Number类型
 * @static
 */
Q.isNumber = function (n) {};
/**
 * 是否为字符串
 * @param {Object} s
 * @returns {Boolean}
 * @static
 */
Q.isString = function (s) {};
/**
 * 对象是否为Boolean类型
 * @param {Object} b
 * @returns {Boolean}
 * @static
 */
Q.isBoolean = function (b) {};
/**
 * 是否为数组类型
 * @param {Object} array
 * @returns {Boolean}
 * @static
 */
Q.isArray = function (a) {};
/**
 * 阻止浏览器对于事件的默认响应动作
 * @example
 * 比如默认网页中，按键盘"ctrl + s"，浏览器的默认动作为保存网页，如果组织这个默认行为，可以按下面的代码
 * document.body.onkeydown = function(evt){
 *  Q.eventPreventDefault(evt);
 * }
 *
 * @param {Event} evt 鼠标，键盘或者触控事件
 * @static
 */
Q.eventPreventDefault = function (evt) {};
/**
 * 停止事件传递给其他元素对象
 * @param {Event} evt
 * @static
 */
Q.eventStopPropagation = function (evt) {};
/**
 * 阻止浏览器对于事件的默认响应动作，并停止事件传递给其他元素对象
 * @see Q.eventPreventDefault
 * @see Q.eventStopPropagation
 * @param {Event} evt
 * @static
 */
Q.stopEvent = function (evt) {};
/**
 * 延迟运行，可以指定延迟时间，回调函数，以及函数作用域
 * @see setTimeout
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Number} time 延迟时间
 * @static
 */
Q.callLater = function (call, scope, time) {};
/**
 * 下一次绘制帧时，调用回调函数
 * @see requestAnimationFrame
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @static
 */
Q.nextFrame = function (call, scope) {};
/**
 * 遍历所有的孩子
 * @param {HTMLElement} parent 父节点
 * @param {Function} call 回调函数， 如果函数结果返回false，则终止遍历
 * @param {Object} [scope] 函数作用域
 * @static
 */
Q.forEachChild = function (parent, call, scope) {};
/**
 * 深度优先遍历
 * @param {Array} array 集合
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Boolean} postOrder 是否后序遍历
 * @static
 */
Q.forEachByDepthFirst = function (array, call, scope, postOrder) {};
/**
 * 深度优先反向遍历
 * @param {Array} array 集合
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Boolean} postOrder 是否后序遍历
 * @static
 */
Q.forEachByDepthFirstReverse = function (array, call, scope, postOrder) {};
/**
 * 广度优先遍历
 * @param {Array} array 集合
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @static
 */
Q.forEachByBreadthFirst = function (array, call, scope) {};
/**
 * 随机整型数值
 * @param {Number} i 数值范围
 * @returns {Number}
 * @static
 */
Q.randomInt = function (i) {};
/**
 * 随机布尔值
 * @returns {Boolean}
 * @static
 */
Q.randomBool = function () {};
/**
 * 随机颜色
 * @param {Number} alpha 透明度，0到1
 * @returns {String} 颜色
 * @static
 */
Q.randomColor = function (alpha) {};
/**
 * 对HTMLElement添加事件监听，并指定监听函数运行作用域
 * @see HTMLElement#addEventListener
 * @param {HTMLElement} eventTarget 事件监听对象
 * @param {String} type 事件类型
 * @param {Function} listener 监听器
 * @param {Boolean} useCapture 是否拦截事件，网页交互事件监听有两个阶段：拦截、冒泡，在拦截阶段事件先派发给父元素，冒泡阶段，事件会先派发给事件所在的元素，然后向上冒泡
 * @param {Object} [scope] 函数作用域
 * @returns {Function} 如果没有指定函数作用域，返回传入的listener对象，如果指定了作用域，则会创建一个新的闭包函数，在其内调用listener，返回这个新创建的函数对象
 * @static
 */
Q.addEventListener = function (eventTarget, type, listener, useCapture, scope) {};
/**
 * 获取第一个标签名为指定名称的孩子节点
 * @param {HTMLElement} parentNode 父节点
 * @param {String} tagName 标签名
 * @returns {HTMLElement}
 * @static
 */
Q.getFirstElementChildByTagName = function (parentNode, tagName) {};
/**
 * 是否支持触控事件
 * @type Boolean
 */
Q.isTouchSupport = {};
/**
 * 是否为iOS系统
 * @type Boolean
 */
Q.isIOS = {};
/**
 * 是否在指定的矩形范围
 * @param {Number} x 矩形x位置
 * @param {Number} y 矩形y位置
 * @param {Number} width 矩形宽度
 * @param {Number} height 矩形高度
 * @param {Number} px 点x坐标
 * @param {Number} py 点y坐标
 * @returns {Boolean} 是否相交
 * @static
 */
Q.intersectsPoint = function (x, y, width, height, px, py){};
/**
 * 是否包含在矩形内
 * @param {Number} tx 范围x坐标
 * @param {Number} ty 范围y坐标
 * @param {Number} tw 范围宽度
 * @param {Number} th 范围高度
 * @param {Number} rx 矩形x位置
 * @param {Number} ry 矩形y位置
 * @param {Number} rw 矩形宽度
 * @param {Number} rh 矩形高度
 * @returns {Boolean} 是否包含
 * @static
 */
Q.containsRect = function (tx, ty, tw, th, rx, ry, rw, rh) {};
/**
 * 矩形
 * @param {Number} x x位置
 * @param {Number} y y位置
 * @param {Number} w 宽度
 * @param {Number} h 高度
 * @constructor
 * @extends Q.Size
 */
Q.Rect = function (x, y, w, h) {};
Q.Rect.prototype = new Q.Size();
/**
 * x位置
 * @type number
 */
Q.Rect.prototype.x = {};
/**
 * y位置
 * @type number
 */
Q.Rect.prototype.y = {};
/**
 * 根据传入的矩形对象，设置矩形的x, y, width, height
 * @param {Q.Rect} rect
 */
Q.Rect.prototype.setByRect = function (rect){};
/**
 * 设置矩形的x, y, width, height
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Q.Rect.prototype.set = function (x, y, width, height) {};
/**
 * 对矩形作偏移
 * @param {Number} dx x偏移量
 * @param {Number} dy y偏移量
 */
Q.Rect.prototype.offset = function (dx, dy){};
/**
 * 坐标点是否在矩形范围内
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 * @returns {Boolean}
 */
Q.Rect.prototype.contains = function (x, y){};
/**
 * 坐标点是否在矩形范围内
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 * @param {Number} tolerance 容差值
 * @returns {Boolean}
 */
Q.Rect.prototype.intersectsPoint = function (x, y, tolerance) {};
/**
 * 两个矩形是否相交
 * @param {type} x2 矩形x坐标
 * @param {type} y2 矩形y坐标
 * @param {type} width2 矩形宽度
 * @param {type} height2 矩形高度
 * @returns {Boolean}
 */
Q.Rect.prototype.intersectsRect = function (x2, y2, width2, height2) {};
/**
 * 坐标点是否在矩形范围内
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 * @returns {Boolean}
 */
Q.Rect.prototype.intersects = function (x, y){};
/**
 * 两个矩形的相交范围
 * @param {Q.Rect} r 另一个矩形
 * @returns {Rect} 相交范围
 */
Q.Rect.prototype.intersection = function (x, y, w, h) {};
/**
 * 增加矩形范围，使得矩形包含这个坐标点
 * @param {Q.Point} point 坐标点
 */
Q.Rect.prototype.addPoint = function (point){};
/**
 * 增加矩形范围，使得矩形包含这个坐标点
 * @param {Number} newx x坐标
 * @param {Number} newy y坐标
 */
Q.Rect.prototype.add = function (newx, newy) {};
/**
 * 增加矩形范围，使得矩形包含传入的矩形范围
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 * @param {Number} width 矩形宽度
 * @param {Number} height 矩形高度
 */
Q.Rect.prototype.addRect = function (x, y, width, height) {};
/**
 * 沿上左下右方向扩展矩形范围，如果数值为负数，则表示矩形范围缩小
 * @param {Number} t 顶部扩展距离
 * @param {Number} l 左边扩展距离
 * @param {Number} b 底部扩展距离
 * @param {Number} r 右边扩展距离
 */
Q.Rect.prototype.grow = function (t, l, b, r) {};
/**
 * 合并矩形，返回一个新的矩形范围
 * @param {Q.Rect} r 另一个矩形
 * @returns {Q.Rect} 合并后的新的矩形范围
 */
Q.Rect.prototype.union = function (r) {};
/**
 * 清除矩形范围，宽高重置为-1
 */
Q.Rect.prototype.clear = function (){};
/**
 * 判断两个矩形范围是否相同
 * @param {Rect} rect 另一个矩形
 * @returns {Boolean}
 */
Q.Rect.prototype.equals = function (rect){};
/**
 * 获取线段与矩形的相交点
 * @param {number} inX 矩形内线段端点
 * @param {number} inY 矩形内线段端点
 * @param {number} outX 矩形外线段端点
 * @param {number} outY 矩形外线段端点
 * @returns {Q.Point}
 */
Q.Rect.prototype.getIntersectionPoint = function (inX, inY, outX, outY){};
/**
 * 底部距离，等于top + height
 * @type number
 */
Q.Rect.prototype.bottom = {};
/**
 * 右边距离，等于left + width
 * @type number
 */
Q.Rect.prototype.right = {};
/**
 * 中心点x位置
 * @type number
 */
Q.Rect.prototype.cx = {};
/**
 * 中心点y坐标位置
 * @type number
 */
Q.Rect.prototype.cy = {};
/**
 * 中心点坐标
 * @type object
 */
Q.Rect.prototype.center = {};
/**
 * 大小，尺寸
 * @constructor
 * @param {Number} w 宽度
 * @param {Number} h 高度
 */
Q.Size = function (w, h) {};
/**
 * 宽度
 * @type number
 */
Q.Size.prototype.width = {};
/**
 * 高度
 * @type number
 */
Q.Size.prototype.height = {};
/**
 * 是否为空
 * @returns {Boolean}
 */
Q.Size.prototype.isEmpty = function () {};
/**
 * 克隆对象
 * @returns {Q.Size}
 */
Q.Size.prototype.clone = function () {};
/**
 * 坐标点对象
 * @constructor
 * @param {Number} x x坐标值
 * @param {Number} y y坐标值
 * @param {Number} rotate 旋转角度，弧度值
 */
Q.Point = function (x, y, rotate) {};
/**
 * x坐标
 * @type number
 */
Q.Point.prototype.x = {};
/**
 * y坐标
 * @type number
 */
Q.Point.prototype.y = {};
/**
 * 旋转弧度
 * @type number
 */
Q.Point.prototype.rotate = {};
/**
 * 设置坐标数值
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rotate
 */
Q.Point.prototype.set = function (x, y, rotate){};
/**
 * 坐标求反，x = -x, y = -y;
 */
Q.Point.prototype.negate = function () {};
/**
 * 坐标偏移
 * @param {Number} dx
 * @param {Number} dy
 */
Q.Point.prototype.offset = function (dx, dy) {};
/**
 * 判断坐标是否相同
 * @param {Q.Point} o
 * @returns {Boolean}
 */
Q.Point.prototype.equals = function (o) {};
/**
 * 两点间距
 * @param {Q.Point} p2
 * @returns {Number}
 */
Q.Point.prototype.distanceTo = function (p2) {};
/**
 * 克隆坐标点对象
 * @returns {Q.Point}
 */
Q.Point.prototype.clone = function () {};
/**
 * 间隙，包含上下左右四个数值，可用于描述内间距，外间距，扩展量
 * @example 给节点图元设置内间距，并设置背景颜色
 * node.setStyle(Q.Styles.BACKGROUND_COLOR, "#CCCCCC");
 * node.setStyle(Q.Styles.PADDING, new Q.Insets(10));
 * @constructor
 * @param {Number} top 上间距
 * @param {Number} left 左间距
 * @param {Number} bottom 下间距
 * @param {Number} right 右间距
 */
Q.Insets = function (top, left, bottom, right) {};
/**
 * 上间距
 * @type number
 */
Q.Insets.prototype.top = {};
/**
 * 下间距
 * @type number
 */
Q.Insets.prototype.bottom = {};
/**
 * 左间距
 * @type number
 */
Q.Insets.prototype.left = {};
/**
 * 右间距
 * @type number
 */
Q.Insets.prototype.right = {};
/**
 * 设置上左下右间距数值
 * @param {Number} top 上间距
 * @param {Number} left 左间距
 * @param {Number} bottom 下间距
 * @param {Number} right 右间距
 * @returns {Object}
 */
Q.Insets.prototype.set = function (top, left, bottom, right){};
/**
 * 克隆间距对象
 * @returns {Q.Insets}
 */
Q.Insets.prototype.clone = function (){};
/**
 * 间距是否相同
 * @param {Object} o
 * @returns {Boolean}
 */
Q.Insets.prototype.equals = function (o){};
/**
 * 事件
 * @constructor
 * @param {Object} source
 * @param {Object} type
 * @param {Object} kind
 * @param {Object} value
 */
Q.Event = function (source, type, kind, value) {};
/**
 * 事件派发对象
 * @type Object
 */
Q.Event.prototype.source = {};
/**
 * 事件类型，属性变化事件，或者集合变化事件
 * @example
 * new Q.Event(graph, "property.change", "name", "new name");
 * @type String
 */
Q.Event.prototype.type = {};
/**
 * 事件种类，比如属性变化事件中的属性名称
 * @example
 * new Q.Event(graph, "property.change", "name", "new name");
 * @type String
 */
Q.Event.prototype.kind = {};
/**
 * 事件相关的数据对象，比如属性变化事件中的属性值
 * @type Object
 */
Q.Event.prototype.value = {};
/**
 * 属性变化事件
 * @constructor
 * @extends Q.Event
 * @param {Object} source 事件派发者
 * @param {String} propertyName 属性名称
 * @param {Object} value 新的属性值
 * @param {Object} oldValue 修改前的属性值
 */
Q.PropertyChangeEvent = function (source, propertyName, value, oldValue) {};
Q.PropertyChangeEvent.prototype = new Q.Event();
/**
 * 属性类型，对于{@link Q.Element}元素，属性默认分三种：accessor, style, client
 * @see Q.Consts.PROPERTY_TYPE_ACCESSOR
 * @see Q.Consts.PROPERTY_TYPE_STYLE
 * @see Q.Consts.PROPERTY_TYPE_CLIENT
 * @type Object
 */
Q.PropertyChangeEvent.prototype.propertyType = {};
/**
 * 属性名称，与kind属性相同
 * @see {@link Q.Event#kind}
 * @type String
 */
Q.PropertyChangeEvent.prototype.propertyName = {};
/**
 * 集合变化事件，添加，删除元素，调整元素次序或者清空集合时，派发该类事件
 * @constructor
 * @extends Q.Event
 * @param {Object} source 集合对象
 * @param {Object} kind 事件种类:
 * {@link Q.ListEvent.KIND_ADD},
 * {@link Q.ListEvent.KIND_REMOVE},
 * {@link Q.ListEvent.KIND_CLEAR},
 * {@link Q.ListEvent.KIND_INDEX_CHANGE}
 * @param {Object} data 事件数据，比如元素添加事件时，这个参数为新添加的元素或者元素集合
 * @param {int} index 序号序号，比如元素添加事件时，插入的位置
 * @param {Object} oldIndex 之前的序号，更改元素次序事件时，此参数表示元素原来的位置
 */
Q.ListEvent = function (source, kind, data, index, oldIndex) {};
Q.ListEvent.prototype = new Q.Event();
/**
 * 序号，比如元素添加事件时，插入的位置
 * @type number
 */
Q.ListEvent.prototype.index = {};
/**
 * 之前的序号，更改元素次序事件时，此参数表示元素原来的位置
 * @type number
 */
Q.ListEvent.prototype.oldIndex = {};
/**
 * 元素添加事件
 * @see Q.Event.kind
 * @static
 * @type String
 */
Q.ListEvent.KIND_ADD = {};
/**
 * 元素被删除事件
 * @static
 * @type String
 */
Q.ListEvent.KIND_REMOVE = {};
/**
 * 清空集合事件
 * @static
 * @type String
 */
Q.ListEvent.KIND_CLEAR = {};
/**
 * 元素次序变化事件
 * @static
 * @type String
 */
Q.ListEvent.KIND_INDEX_CHANGE = {};
/**
 * 事件处理器，可以设置一个监听器，响应事件
 * @constructor
 */
Q.Handler = function () {};
/**
 * 监听器
 * @see Q.IListener
 * @type Object
 */
Q.Handler.prototype.listener = {};
/**
 * 操作之前派发事件
 * @param {Event} evt
 * @returns {Boolean} 返回flase表示停止后面的操作
 */
Q.Handler.prototype.beforeEvent = function (evt) {};
/**
 * 派发事件
 * @param {Event} evt
 */
Q.Handler.prototype.onEvent = function (evt) {};
/**
 * 事件派发器，相比Handler，可以添加和删除多个监听器
 * @constructor
 * @extends Q.Handler
 */
Q.Dispatcher = function () {};
Q.Dispatcher.prototype = new Q.Handler();
/**
 * 监听器集合
 * @type Array
 */
Q.Dispatcher.prototype.listeners = {};
/**
 * 是否包含监听器
 * @param {(Function|Q.IListener)} fn 监听器
 * @param {Object} [scope] 作用域
 * @returns {Boolean}
 */
Q.Dispatcher.prototype.contains = function (fn, scope) {};
/**
 * 添加监听器
 * @example
 * var dispatcher = new Q.Dispatcher();
 * dispatcher.addListener(function(evt){
 *  Q.log("on event");
 * });
 * dispatcher.addListener({
 *  beforeEvent: function(evt){Q.log("before event");},
 *  onEvent: function(evt){Q.log("on event");}
 * });
 * dispatcher.fireEvent({name: "alarm event"});
 * @param {(Function|Q.IListener)} listener
 * @param {Object} [scope] 作用域
 * @returns {Object} 返回内部生成的监听器对象（包含了作用域相关信息）
 */
Q.Dispatcher.prototype.addListener = function (listener, scope) {};
/**
 * 删除监听器
 * @param {(Function|Q.IListener)} listener
 * @param {Object} [scope] 作用域
 * @param {boolean} keepScope 是否保留作用于对象，如果为false则delete 作用域对象
 */
Q.Dispatcher.prototype.removeListener = function (listener, scope, keepScope) {};
/**
 * 与#addListener相同
 * @param {(Function|Q.IListener)} listener
 * @param {Object} [scope] 作用域
 */
Q.Dispatcher.prototype.on = function (listener, scope) {};
/**
 * 与#removeListener相同
 * @param {(Function|Q.IListener)} listener
 * @param {Object} [scope] 作用域
 * @param {boolean} keepScope 是否保留作用于对象，如果为false则delete 作用域对象
 */
Q.Dispatcher.prototype.un = function (listener, scope, keepScope) {};
/**
 * 清除监听器
 * @returns {Object}
 */
Q.Dispatcher.prototype.clear = function () {};
/**
 * 销毁，默认会清除所有监听器
 * @returns {Object}
 */
Q.Dispatcher.prototype.destroy = function () {};
/**
 * 位置，用于描述相对位置信息，包含水平和垂直两个方向的位置属性，每个方向各有三种位置，组合成上下左右等九种位置
 * @constructor
 * @param {String} h
 * @param {String} v
 */
Q.Position = function (h, v) {};
/**
 * 垂直方向位置：上，中，下
 * @type String
 */
Q.Position.prototype.verticalPosition = {};
/**
 * 水平方向位置：左，中，右
 * @type String
 */
Q.Position.prototype.horizontalPosition = {};
/**
 * 缩写名
 * @type String
 */
Q.Position.prototype.sortName = {};
/**
 * 左上
 * @static
 * @type Position
 */
Q.Position.LEFT_TOP = {};
/**
 * 左中
 * @static
 * @type Position
 */
Q.Position.LEFT_MIDDLE = {};
/**
 * 左下
 * @static
 * @type Position
 */
Q.Position.LEFT_BOTTOM = {};
/**
 * 上中
 * @static
 * @type Position
 */
Q.Position.CENTER_TOP = {};
/**
 * 居中
 * @static
 * @type Position
 */
Q.Position.CENTER_MIDDLE = {};
/**
 * 下中
 * @static
 * @type Position
 */
Q.Position.CENTER_BOTTOM = {};
/**
 * 右上
 * @static
 * @type Position
 */
Q.Position.RIGHT_TOP = {};
/**
 * 右中
 * @static
 * @type Position
 */
Q.Position.RIGHT_MIDDLE = {};
/**
 * 右下
 * @static
 * @type Position
 */
Q.Position.RIGHT_BOTTOM = {};
/**
 * 随机位置
 * @type Q.Position
 */
Q.Position.random = {};
/**
 * 数据类，用于描述数据元素，包含id，父子关系，属性设置，事件派发等功能，是图元对象的基类
 * @constructor
 * @extends Q.Handler
 */
Q.Data = function () {};
Q.Data.prototype = new Q.Handler();
/**
 * 唯一id
 * @type int
 */
Q.Data.prototype.id = {};
/**
 * 获取属性
 * @see {@link Q.Data#set}
 * @param {String} key
 * @returns {Object}
 */
Q.Data.prototype.get = function (key) {};
/**
 * 设置属性，并派发属性变化事件
 * @see {@link Q.Data#get}
 * @example
 * var data = new Q.Data();
 * data.set("name", "hello");
 * data.get("name");
 *
 * @param {String} key
 * @param {Object} value
 * @returns {Boolean} 如果新属性与原来的属性相同，或者属性设置失败，返回false
 */
Q.Data.prototype.set = function (key, value) {};
/**
 * 删除属性，从属性列表中删除某个属性
 * @param {String} key
 */
Q.Data.prototype.remove = function (key) {};
/**
 * 添加孩子，指定孩子序号
 * @see {@link Q.Data#onChildAdd}
 * @param {Q.Data} child
 * @param {int} [index]
 * @returns {Boolean} 如果添加失败，返回false
 */
Q.Data.prototype.addChild = function (child, index) {};
/**
 * 添加孩子成功时，调用此方法
 * @param {Q.Data} child
 * @param {int} index
 */
Q.Data.prototype.onChildAdd = function (child, index) {};
/**
 * 删除孩子
 * @see {@link Q.Data#onChildRemove}
 * @param {Object} child
 * @returns {Object}
 */
Q.Data.prototype.removeChild = function (child) {};
/**
 * 孩子被删除时，调用此方法
 * @param {Object} child
 * @returns {Object}
 */
Q.Data.prototype.onChildRemove = function (child) {};
/**
 * 获取孩子集合
 * @returns {Array} 孩子集合
 */
Q.Data.prototype.toChildren = function () {};
/**
 * 清除所有孩子元素
 * @see {@link Q.Data#onChildrenClear}
 */
Q.Data.prototype.clearChildren = function () {};
/**
 * 遍历孩子
 * @param {Function} call 回调函数
 * @param {Object} [scope] 作用域
 */
Q.Data.prototype.forEachChild = function (call, scope){};
/**
 * 清空孩子时，调用此方法
 * @param {Array} children 被清除的孩子集合
 */
Q.Data.prototype.onChildrenClear = function (children) {};
/**
 * 获取孩子的序号
 * @see {@link Q.Data#setChildIndex}
 * @param {Q.Data} child
 * @returns {int} 序号
 */
Q.Data.prototype.getChildIndex = function (child) {};
/**
 * 设置孩子序号
 * @see {@link Q.Data#getChildIndex}
 * @param {Q.Data} child 孩子元素
 * @param {int} index 序号
 * @returns {Object}
 */
Q.Data.prototype.setChildIndex = function (child, index) {};
/**
 * 是否有孩子
 * @returns {Boolean}
 */
Q.Data.prototype.hasChildren = function () {};
/**
 * 根据序号获取孩子
 * @param {int} index 序号
 * @returns {Object}
 */
Q.Data.prototype.getChildAt = function (index) {};
/**
 * 是否是传入参数的孩子或者子孙节点
 * @param {Q.Data} parent 父节点
 * @returns {Boolean} 是否子孙节点
 */
Q.Data.prototype.isDescendantOf = function (parent) {};
/**
 * 更换父节点时，调用此方法
 * @param {Q.Data} oldParent 原来的父节点
 * @param {Q.Data} newParent 新的父节点
 */
Q.Data.prototype.onParentChanged = function (oldParent, newParent) {};
/**
 * 孩子数量
 * @type int
 */
Q.Data.prototype.childrenCount = {};
/**
 * 孩子集合
 * @type Q.HashList
 */
Q.Data.prototype.children = {};
/**
 * 父节点
 * @type Q.Data
 */
Q.Data.prototype.parent = {};
/**
 * 用户属性
 * @type Object
 */
Q.Data.prototype.properties = {};
/**
 * 选中容器，用于存放和管理被选中的图元
 * @constructor
 * @param {Q.DataModel} box 数据容器，选中容器中的元素都必须属于这个数据容器
 * @extends Q.HashList
 */
Q.SelectionModel = function (box) {};
Q.SelectionModel.prototype = new Q.HashList();
/**
 * 数据容器，选中容器中的元素都必须属于这个数据容器
 * @type DataModel
 * @readonly
 */
Q.SelectionModel.prototype.box = {};
/**
 * 是否被选中
 * @param {(Q.Data|in)} data 元素对象或者元素id
 * @returns {Boolean}
 */
Q.SelectionModel.prototype.isSelected = function (data) {};
/**
 * 选中元素
 * @example
 * graph.selectionModel.select(node1);
 * @see {@link Q.SelectionModel#add}
 * @param {Q.Data} data
 */
Q.SelectionModel.prototype.select = function (data){};
/**
 * 取消选中
 * @example
 * graph.selectionModel.unselect(node1);
 * @param {Q.Data} data
 */
Q.SelectionModel.prototype.unselect = function (data){};
/**
 * 更改元素选中状态
 * @param {Q.Data} data
 */
Q.SelectionModel.prototype.reverseSelect = function (data){};
/**
 * 数据容器
 * @constructor
 * @extends Q.HashList
 */
Q.DataModel = function () {};
Q.DataModel.prototype = new Q.HashList();
/**
 * 元素选中状态管理容器
 * @readonly
 * @type Q.SelectionModel
 */
Q.DataModel.prototype.selectionModel = {};
/**
 * 元素选中状态变化事件派发器
 * @readonly
 * @type Q.Dispatcher
 */
Q.DataModel.prototype.selectionChangeDispatcher = {};
/**
 * 元素属性变化事件派发器
 * @readonly
 * @type Q.Dispatcher
 */
Q.DataModel.prototype.dataChangeDispatcher = {};
/**
 * 元素父节点变化事件派发器
 * @type Q.Dispatcher
 */
Q.DataModel.prototype.parentChangeDispatcher = {};
/**
 * 根层元素集合
 * @type Object
 */
Q.DataModel.prototype.roots = {};
/**
 * 元素属性变化前
 * @param {Q.PropertyChangeEvent} event 属性变化事件
 * @returns {Boolean} 如果返回false，则停止对元素属性的更改
 */
Q.DataModel.prototype.beforeDataPropertyChange = function (event) {};
/**
 * 元素属性变化事件
 * @param {Q.PropertyChangeEvent} event 属性变化事件
 */
Q.DataModel.prototype.onDataPropertyChanged = function (event) {};
/**
 * 获取根层元素集合
 * @returns {Array}
 */
Q.DataModel.prototype.toRoots = function (){};
/**
 * 深度优先遍历
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Boolean} postOrder 是否后序遍历，默认为先序遍历
 */
Q.DataModel.prototype.forEachByDepthFirst = function (call, scope, postOrder){};
/**
 * 深度优先反向遍历
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Object} postOrder 是否后序遍历，默认为先序遍历
 */
Q.DataModel.prototype.forEachByDepthFirstReverse = function (call, scope, postOrder){};
/**
 * 广度优先遍历
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 */
Q.DataModel.prototype.forEachByBreadthFirst = function (call, scope){};
/**
 * 广度优先反向遍历
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 */
Q.DataModel.prototype.forEachByBreadthFirstReverse = function (call, scope){};
/**
 * 监听器接口
 * @namespace
 * @type object
 * @static
 */
Q.IListener = {};
/**
 * 事件发生时调用
 * @static
 * @param {Q.Event} evt
 */
Q.IListener.onEvent = function (evt) {};
/**
 * 事件发生之前调用
 * @static
 * @param {Q.Event} evt
 * @returns {Boolean} 如果返回false，则停止事件的执行
 */
Q.IListener.beforeEvent = function (evt) {};
/**
 * 通过AJAX请求链接
 * @example
 Q.loadURL(jsfile, function (req) {
             var code = req.responseText;
             ...
         }, showError)
 * @static
 * @param {String} url 请求链接
 * @param {Function} callback 回调函数，传入参数为XMLHttpRequest实例
 * @param {Function} onError 请求异常时回调此函数
 * @param {Object} params 请求参数，参见XMLHttpRequest#send(...);
 */
Q.loadURL = function (url, callback, onError, params, addTime) {};
/**
 * 请求XML资源
 * @see Q.loadURL
 * @example
 Q.loadXML('map.svg', function(doc){
        var paths = doc.getElementsByTagName("path");
     }, showError);
 * @static
 * @param {String} url 请求链接
 * @param {Function} callback 回调函数，传入参数为XMLDocument实例
 * @param {Function} onError 请求异常时回调此函数
 * @param {Object} params 请求参数，参见XMLHttpRequest#send(...);
 */
Q.loadXML = function (url, callback, onError, params, addTime) {};
/**
 * 请求JSON资源
 * @see Q.loadURL
 * @example
 Q.loadJSON('map.json', function(json){
        for(var d in json){

        }
     }, showError);
 * @static
 * @param {String} url 请求链接
 * @param {Function} callback 回调函数，传入参数为JS数据
 * @param {Function} onError 请求异常时回调此函数
 * @param {Object} params 请求参数，参见XMLHttpRequest#send(...);
 */
Q.loadJSON = function (url, callback, onError, params, addTime) {};
/**
 * 判断键盘按键是否为：Mac OS X下的Command键或者其他操作系统下的Ctrl键
 * @static
 * @param {Object} evt
 * @returns {Object}
 */
Q.isMetaKey = function (evt){};
/**
 * 计算长度
 * @static
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
Q.calculateDistance = function (x1, y1, x2, y2) {};
/**
 * 扩展数组，融合了hashmap与list的功能
 * @constructor
 */
Q.HashList = function (values) {};
/**
 * 通过序号获取容器中的元素
 * @param {int} index
 * @returns {Q.Data}
 */
Q.HashList.prototype.get = function (index) {};
/**
 * 通过id获取容器内的元素
 * @param {int} id 唯一编号
 * @returns {Q.Data}
 */
Q.HashList.prototype.getById = function (id) {};
/**
 * 通过序号获取容器内的元素
 * @param {int} index 序号
 * @returns {Q.Data}
 */
Q.HashList.prototype.getByIndex = function (index) {};
/**
 * 遍历容器内的元素
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Object} [params] 其他传入参数
 */
Q.HashList.prototype.forEach = function (call, scope, params) {};
/**
 * 反向遍历容器内的元素
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Object} [params] 其他传入参数
 */
Q.HashList.prototype.forEachReverse = function (call, scope, params) {};
/**
 * 容器内元素的数量
 * @returns {int}
 */
Q.HashList.prototype.size = function () {};
/**
 * 是否包含元素
 * @param {Q.Data} data 元素
 * @returns {Boolean}
 */
Q.HashList.prototype.contains = function (data) {};
/**
 * 通过id判断元素是否存在于数据容器中
 * @param {int} id 唯一编号
 * @returns {Boolean}
 */
Q.HashList.prototype.containsById = function (id) {};
/**
 * 调整元素的序号
 * @param {Q.Data} data 元素
 * @param {int} index 序号
 */
Q.HashList.prototype.setIndex = function (data, index) {};
/**
 * 设置元素序号在指定序号之后
 * @param {Q.Data} data
 * @param {int} index 序号
 */
Q.HashList.prototype.setIndexAfter = function (data, index){};
/**
 * 设置元素序号在指定序号之前
 * @param {Q.Data} data
 * @param {int} index 序号
 */
Q.HashList.prototype.setIndexBefore = function (data, index){};
/**
 * 获取元素序号
 * @param {Q.Data} data
 * @returns {int}
 */
Q.HashList.prototype.indexOf = function (data) {};
/**
 * 通过元素编号获取元素位于容器中的序号
 * @param {int} id 唯一编号
 * @returns {int} 元素在数据容器中的序号
 */
Q.HashList.prototype.getIndexById = function (id) {};
/**
 * 添加元素
 * @param {Q.Data} data
 * @param {int} index 序号
 */
Q.HashList.prototype.add = function (data, index) {};
/**
 * 添加元素到集合最前面，与下面的方法是相同的效果
 * @code
 * HashList.add(data, 0);
 *
 * @param {Q.Data} data
 * @returns {Object}
 */
Q.HashList.prototype.addFirst = function (data){};
/**
 * 删除元素
 * @param {Q.Data} data
 */
Q.HashList.prototype.remove = function (data) {};
/**
 * 通过元素编号删除元素
 * @param {int} id 唯一编号
 */
Q.HashList.prototype.removeById = function (id) {};
/**
 * 设置元素集合
 * @param {(Q.Data|Array)} data 元素或者元素集合
 */
Q.HashList.prototype.set = function (data) {};
/**
 * 清除所有元素
 */
Q.HashList.prototype.clear = function () {};
/**
 * 获取元素集合
 * @returns {Array}
 */
Q.HashList.prototype.toDatas = function () {};
/**
 * 数据容器是否为空
 * @returns {Boolean}
 */
Q.HashList.prototype.isEmpty = function () {};
/**
 * 拷贝集合
 * @param {boolean} deep
 * @returns {Q.HashList}
 */
Q.HashList.prototype.clone = function (deep){};
/**
 * 数据集合
 * @type Array
 */
Q.HashList.prototype.datas = {};
/**
 * 随机元素
 * @type Q.Data
 */
Q.HashList.prototype.random = {};
/**
 * 元素数量
 * @type int
 */
Q.HashList.prototype.length = {};
/**
 * 拖拽支持类，为HTML元素提供拖拽交互支持，支持鼠标和触摸事件
 * @constructor
 * @param {HTMLElement} html
 * @param {Object} listener 监听器
 */
Q.DragSupport = function (html, listener, scope){};
/**
 * 销毁监听
 * @returns {Object}
 */
Q.DragSupport.prototype.destroy = function (){};
/**
 * 提示框，参见window#alert
 * @static
 * @param {Object} text
 * @returns {Object}
 */
Q.alert = function (text){};
/**
 * 输入框
 * @static
 * @param {Object} message
 * @param {Object} value
 * @param {Object} callback
 * @param {Object} scope
 * @returns {Object}
 */
Q.prompt = function (message, value, callback, scope){};
/**
 * 确认框
 * @static
 * @param {Object} message
 * @param {Object} callback
 * @param {Object} scope
 * @returns {Object}
 */
Q.confirm = function (message, callback, scope){};
/**
 * 添加新的CSS规则
 * @static
 * @param {Object} selector
 * @param {Object} rulesStr
 * @returns {Object}
 */
Q.addCSSRule = function (selector, rulesStr) {};
/**
 * 创建<canvas>，并指定宽高
 * @static
 * @param {number} w 宽度
 * @param {number} h 高度
 * @returns {HTMLCanvasElement}
 */
Q.createCanvas = function (w, h, withRatio){};
/**
 * 注册图片，支持png, svg, gif（除IE），支持内置图形，Q.Path, 以及自定义绘制函数
 * @static
 * @param {string} key
 * @param {Object} data
 */
Q.registerImage = function (key, data){};
/**
 * 路径片段
 * @constructor
 * @param {Object} type
 * @param {Object} points
 */
Q.PathSegment = function (type, points){};
/**
 * 导出JSON，用于数据序列化
 * @returns {Object}
 */
Q.PathSegment.prototype.toJSON = function (){};
/**
 * 解析 JSON 数据，生成路径片段中的属性，用于数据反序列化
 * @param {Object} json
 * @returns {Object}
 */
Q.PathSegment.prototype.parseJSON = function (json){};
/**
 * 路径片段坐标点信息
 * @type null
 */
Q.PathSegment.prototype.points = {};
/**
 * 路径片段类型
 * @type string
 */
Q.PathSegment.prototype.type = {};
/**
 * 复制路径片段
 * @returns {Q.PathSegment}
 */
Q.PathSegment.prototype.clone = function (){};
/**
 * 移动坐标点
 * @param {Object} dx
 * @param {Object} dy
 * @returns {Object}
 */
Q.PathSegment.prototype.move = function (dx, dy){};
/**
 * 多边形图元
 * @constructor
 * @extends Q.Node
 * @param {Object} name
 * @param {Q.Path} path
 */
Q.ShapeNode = function (name, path){};
Q.ShapeNode.prototype = new Q.Node.prototype.agentNode();
/**
 * 移动画笔
 * @param {number} x
 * @param {number} y
 */
Q.ShapeNode.prototype.moveTo = function (x, y) {};
/**
 * 画线
 * @param {number} x
 * @param {number} y
 */
Q.ShapeNode.prototype.lineTo = function (x, y) {};
/**
 * 二次曲线
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
Q.ShapeNode.prototype.quadTo = function (x1, y1, x2, y2) {};
/**
 * 三次曲线
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 */
Q.ShapeNode.prototype.curveTo = function (x1, y1, x2, y2, x3, y3) {};
/**
 * 圆弧
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} radius
 */
Q.ShapeNode.prototype.arcTo = function (x1, y1, x2, y2, radius) {};
/**
 * 闭合
 */
Q.ShapeNode.prototype.closePath = function () {};
/**
 * 清空路径
 */
Q.ShapeNode.prototype.clear = function (){};
/**
 * 路径发生变化
 */
Q.ShapeNode.prototype.firePathChange = function (){};
/**
 * 多边形路径
 * @type Q.Path
 */
Q.ShapeNode.prototype.path = {};
/**
 * 总线图元
 * @constructor
 * @extends Q.ShapeNode
 * @param {Object} name
 * @param {Object} path
 */
Q.Bus = function (name, path){};
Q.Bus.prototype = new Q.ShapeNode.prototype.agentNode();
/**
 *  分组图元类型
 * @constructor
 * @extends Q.Node
 * @param {Object} name
 * @param {number} x
 * @param {number} y
 */
Q.Group = function (name, x, y){};
Q.Group.prototype = new Q.Node.prototype.agentNode();
/**
 * 展开合并属性
 * @type null
 */
Q.Group.prototype.expanded = {};
/**
 * 分组最小大小
 * @type null
 */
Q.Group.prototype.minSize = {};
/**
 * 分组类型
 * @type String
 */
Q.Group.prototype.groupType = {};
/**
 * 分组内间隙
 * @type Q.Insets
 */
Q.Group.prototype.padding = {};
/**
 * 分组图片
 * @type Object
 */
Q.Group.prototype.groupImage = {};
/**
 * 文本图元
 * @constructor
 * @extends Q.Node
 * @param {Object} label
 * @param {Object} x
 * @param {Object} y
 */
Q.Text = function (label, x, y){};
Q.Text.prototype = new Q.Node.prototype.agentNode();
/**
 * 调整大小交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.ResizeInteraction = function (graph){};
/**
 * 删除图元时，回调此方法，如果当前编辑的图元被删除，会清除其编辑状态
 * @param {Object} element
 * @param {Q.Graph} graph
 * @returns {Object}
 */
Q.ResizeInteraction.prototype.onElementRemoved = function (element, graph){};
/**
 * 清空图元时回调此方法，如果当前编辑的图元被删除，会清除其编辑状态
 * @param {Q.Graph} graph
 * @returns {Object}
 */
Q.ResizeInteraction.prototype.onClear = function (graph){};
/**
 * 创建图形交互监听器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.CreateShapeInteraction = function (graph){};
/**
 * 交互过程中的多边形绘制默认样式，包含线条宽度，填充颜色等信息
 * @returns {Object}
 */
Q.CreateShapeInteraction.prototype.getDefaultDrawStyles = function (){};
/**
 * 多边形创建完成时调用此函数
 * @param {Object} evt
 * @param {Q.Graph} graph
 */
Q.CreateShapeInteraction.prototype.finish = function (evt, graph){};
/**
 * 创建多边形图元
 * @param {Object} evt
 * @param {Array} pathSegments
 * @param {Number} cx
 * @param {Number} cy
 * @returns {Q.ShapeNode}
 */
Q.CreateShapeInteraction.prototype.createElement = function (evt, pathSegments, cx, cy){};
/**
 * 交互绘制
 * @param {CanvasRenderingContext2D} g
 * @param {Number} scale
 */
Q.CreateShapeInteraction.prototype.doDraw = function (g, scale){};
/**
 * 设置画笔绘制样式，包括线条宽度，颜色，填充颜色等
 * @see Q.CreateShapeInteraction#getDefaultDrawStyles
 * @param {CanvasRenderingContext2D} g
 */
Q.CreateShapeInteraction.prototype.styleDraw = function (g){};
/**
 * 绘制点
 * @param {CanvasRenderingContext2D} g
 * @param {Object} p
 * @param {Boolean} moveTo 是否为moveTo
 */
Q.CreateShapeInteraction.prototype.drawPoint = function (g, p, moveTo){};
/**
 * 当前鼠标点
 * @type Object
 */
Q.CreateShapeInteraction.prototype.currentPoint = {};
/**
 * 坐标点集合
 * @type Array
 */
Q.CreateShapeInteraction.prototype.points = {};
/**
 * 图元被删除时，回调此函数，以保证交互画布的及时刷新
 * @param {Q.Element} element
 * @param {Q.Graph} graph
 */
Q.CreateShapeInteraction.prototype.onElementRemoved = function (element, graph){};
/**
 * 清空图元容器时，回调此函数，以保证交互画布的及时刷新
 * @param {Q.Graph} graph
 */
Q.CreateShapeInteraction.prototype.onClear = function (graph){};
/**
 * 无效画布
 */
Q.CreateShapeInteraction.prototype.invalidate = function (){};
/**
 * 删除交互画布
 */
Q.CreateShapeInteraction.prototype.removeDrawable = function (){};
/**
 * 添加交互画布
 */
Q.CreateShapeInteraction.prototype.addDrawable = function (){};
/**
 * 键盘点击"ESC"键时，是否取消当前交互，默认为 true
 * @type boolean
 */
Q.CreateShapeInteraction.prototype.escapable = {};
/**
 * 创建线条交互监听器
 * @constructor
 * @extends Q.CreateShapeInteraction
 * @param {Q.Graph} graph
 */
Q.CreateLineInteraction = function (graph){};
Q.CreateLineInteraction.prototype = new Q.CreateShapeInteraction();
/**
 * 简单连线交互监听器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.CreateSimpleEdgeInteraction = function (graph){};
/**
 * 绘制机交互界面
 * @param {CanvasRenderingContext2D} g
 * @param {Object} scale
 * @returns {Object}
 */
Q.CreateSimpleEdgeInteraction.prototype.doDraw = function (g, scale){};
/**
 * 节点是否允许作为连线的起始节点
 * @param {Q.Node} node
 * @param {Q.Graph} graph
 * @returns {Object} Boolean
 */
Q.CreateSimpleEdgeInteraction.prototype.canLinkFrom = function (node, graph){};
/**
 * 节点是否允许作为连线的结束节点
 * @param {Q.Node} node
 * @param {Q.Graph} graph
 * @returns {Object} Boolean
 */
Q.CreateSimpleEdgeInteraction.prototype.canLinkTo = function (node, graph){};
/**
 * 文本编辑器
 * @constructor
 */
Q.LabelEditor = function (){};
/**
 * 文本编辑的HTML元素
 * @type HTMLElement
 */
Q.LabelEditor.prototype.html = {};
/**
 * 创建HTML元素，默认创建TextArea元素
 * @returns {Object}
 */
Q.LabelEditor.prototype.createHTML = function (){};
/**
 * 设置文本内容和字体
 * @param {Object} text
 * @param {Object} fontSize
 * @returns {Object}
 */
Q.LabelEditor.prototype.setText = function (text, fontSize) {};
/**
 *
 * @param {Object} input
 * @returns {Object}
 */
Q.LabelEditor.prototype.onSizeChange = function (input){};
/**
 * 输入框文本变化时回调此函数，动态调整文本框大小文本框
 * @param {Object} evt
 * @returns {Object}
 */
Q.LabelEditor.prototype.onValueChange = function (evt){};
/**
 * 指定文本框位置和文本，显示文本框，开始编辑
 * @param {Object} x
 * @param {Object} y
 * @param {Object} text
 * @param {Object} fontSize
 * @param {Object} callback
 * @returns {Object}
 */
Q.LabelEditor.prototype.startEdit = function (x, y, text, fontSize, callback){};
/**
 * 是否正在编辑，文本框为可见状态时，表示正在编辑
 * @returns {Object}
 */
Q.LabelEditor.prototype.isEditing = function (){};
/**
 * 取消编辑，隐藏文本框
 * @returns {Object}
 */
Q.LabelEditor.prototype.cancelEdit = function (){};
/**
 * 停止编辑，如果cancel参数为true，则取消编辑，否则会将新的文本值设置给绑定的图元
 * @param {Boolean} cancel 是否取消
 * @returns {Object}
 */
Q.LabelEditor.prototype.stopEdit = function (cancel){};
/**
 * 删除文本框组件
 * @returns {Object}
 */
Q.LabelEditor.prototype.destroy = function (){};
/**
 * 平移交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.PanInteraction = function (graph){};
/**
 * 点选交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.SelectionInteraction = function (graph){};
/**
 * 节点移动交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.MoveInteraction = function (graph){};
/**
 * 滚轮缩放交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.WheelZoomInteraction = function (graph) {};
/**
 * 双击交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.DoubleClickInteraction = function (graph){};
/**
 * 图片导出交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.ExportInteraction = function (graph){};
/**
 * 文本提示框交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.TooltipInteraction = function (graph){};
/**
 * 框选交互器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.RectangleSelectionInteraction = function (graph){};
/**
 * 拐点编辑交互监听器
 * @constructor
 * @param {Q.Graph} graph
 */
Q.PointsInteraction = function (graph){};
/**
 * 自动布局，根据节点的拓扑关系，父子关系或者其他关系，自动计算元素位置信息，实现图元的自动分布
 * @constructor
 * @static
 */
Q.Layouter = function (graph){};
/**
 * 获取节点范围
 * @see Q.Graph#getUIBounds
 * @param {Object} node
 * @returns {Object}
 */
Q.Layouter.prototype.getNodeBounds = function (node) {};
/**
 * 是否可以参与布局
 * @param {Object} node
 * @param {Object} from
 * @returns {Object}
 */
Q.Layouter.prototype.isLayoutable = function (node, from){};
/**
 * 获取布局结果，布局结果为下面的格式{id: {x, y, node}}
 * @param {Object} params
 * @returns {Object}
 */
Q.Layouter.prototype.getLayoutResult = function (params){};
/**
 * 设置节点坐标
 * @param {Object} locations 为键-值格式，key为节点id，value为节点位置信息，参考：{"10": {node: nodeA, x: 100, y: 100}}
 * @param {boolean} byAnimate 是否使用动画
 * @param {number} duration 动画时间
 * @param {Object} animationType 动画类型
 * @param {Function} callback 回调函数
 */
Q.Layouter.prototype.updateLocations = function (locations, byAnimate, duration, animationType, callback){};
/**
 * 开始布局
 * @param {Object} params
 * @param {Object} immediately
 * @returns {Object}
 */
Q.Layouter.prototype.doLayout = function (params, immediately) {};
/**
 * 是否为水平方向
 * @static
 * @param {String} direction
 * @returns {Boolean}
 */
Q.isHorizontalDirection = function (direction){};
/**
 * 气泡布局器
 * 气泡布局与树布局类似，适用于树图的展现，布局以圆形分布，是一种高效的布局类型
 * @constructor
 * @extends Q.Layouter
 * @param {Q.Graph} graph
 * @param {Object} radius
 * @param {Object} gap
 * @param {Object} startAngle
 */
Q.BalloonLayouter = function (graph, radius, gap, startAngle){};
Q.BalloonLayouter.prototype = new Q.Layouter();
/**
 * 角度分布类型，包括两种，分别表示按需分配和均匀分配：{@link Q.Consts.ANGLE_SPACING_PROPORTIONAL}, {@link Q.Consts.ANGLE_SPACING_REGULAR}
 * @type string
 */
Q.BalloonLayouter.prototype.angleSpacing = {};
/**
 * 半径模式，分两种模式：{@link Q.Consts.RADIUS_MODE_UNIFORM}, {@link Q.Consts.RADIUS_MODE_VARIABLE}
 * @type string
 */
Q.BalloonLayouter.prototype.radiusMode = {};
/**
 * 默认间隙，用于控制相邻节点之间的间距
 * @type number
 */
Q.BalloonLayouter.prototype.gap = {};
/**
 * 最小半径，用于控制上下层节点之间的最小距离
 * @type number
 */
Q.BalloonLayouter.prototype.radius = {};
/**
 * 起始角度，可用于对整个布局做旋转
 * @type number
 */
Q.BalloonLayouter.prototype.startAngle = {};
/**
 * 节点默认尺寸（半径），气泡布局中每个节点相当于一个圆，节点的尺寸用半径表示，默认取节点UI的宽高半径，如果节点UI没有初始化，则取默认尺寸
 * @type number
 */
Q.BalloonLayouter.prototype.defaultSize = {};
/**
 * 获取节点的最小半径，默认返回{@link Q.BalloonLayouter#radius}属性
 * @param {Object} node
 * @param {Object} level
 * @param {Object} isLeaf
 * @returns {Object}
 */
Q.BalloonLayouter.prototype.getRadius = function (node, level, isLeaf){};
/**
 * 获取节点尺寸，气泡布局中每个节点相当于一个圆，节点的尺寸用半径表示，默认取节点UI的宽高半径，如果节点UI没有初始化，则返回默认尺寸{@link Q.BalloonLayouter#defaultSize}
 * @param {Object} node
 * @param {Object} level
 * @param {Object} isLeaf
 * @returns {Object}
 */
Q.BalloonLayouter.prototype.getNodeSize = function (node, level, isLeaf){};
/**
 * 获取相邻节点的间隙，默认返回默认间隙{@link Q.BalloonLayouter#gap}
 * @param {Object} node
 * @param {Object} level
 * @param {Object} isLeaf
 * @returns {Object}
 */
Q.BalloonLayouter.prototype.getGap = function (node, level, isLeaf){};
/**
 * 弹簧布局，静电斥力，弹簧拉力以及中心引力三力平衡，使得节点分离，达到一种动态分布效果
 * @constructor
 * @param {Q.Graph} graph
 * @param {Object} gap
 * @extends Q.Layouter
 */
Q.SpringLayouter = function (graph) {};
Q.SpringLayouter.prototype = new Q.Layouter();
/**
 * 设置布局节点初始信息，比如静电大小和初始速度
 * @param {Q.Node} node 节点图元
 * @param {Object} nodeInfo 布局节点对象
 */
Q.SpringLayouter.prototype.appendNodeInfo = function (node, nodeInfo) {};
/**
 * 设置连线布局信息，比如弹性系数或者初始速度
 * @param {Q.Edge} edge 连线图元
 * @param {Object} edgeInfo 连线布局对象
 */
Q.SpringLayouter.prototype.appendEdgeInfo = function (edge, edgeInfo) {};
/**
 * 设置节点质量（质量越大，斥力越大）
 * @param {Q.Node} node
 * @param {Number} mass 默认为1
 */
Q.SpringLayouter.prototype.setMass = function (node, mass) {};
/**
 * 设置弹性系数
 * @param {Q.Edge} edge
 * @param {Number} k
 */
Q.SpringLayouter.prototype.setElasticity = function (edge, k) {};
/**
 * 每次模拟运动计算中的时间间隙数值，时间间隙越短模拟计算越准确，但递归次数也越多，默认值为：0.15
 * @type number
 */
Q.SpringLayouter.prototype.timeStep = {};
/**
 * 静电斥力系数，系数越大节点间距越大，默认值为50
 * @type number
 */
Q.SpringLayouter.prototype.repulsion = {};
/**
 * 中心吸引力系数，系数越大，节点间距越小，默认值为0.1
 * @type number
 */
Q.SpringLayouter.prototype.attractive = {};
/**
 * 弹性系数，系数越大弹性越强，默认值为3
 * @type number
 */
Q.SpringLayouter.prototype.elastic = {};
/**
 * 将整型数值转换成网页支持的颜色字符串，支持 半透明颜色
 * @param {Number} int16 整型数值，比如0xFFFFFF表示白色，或者0x77000000表示半透明黑色
 * @returns {String} 返回颜色字符串，比如"#FFFFFF"，如果是半透明颜色，返回如："rgba(0,0,0,0.4)"
 * @static
 */
Q.toColor = function (int16) {};
/**
 * 控制台打印信息
 * @see console.log
 * @param {String} o
 * @static
 */
Q.log = function (o) {};
/**
 * 在控制台中输出异常信息
 * @static
 * @param {Object} error
 */
Q.error = function (error){};
/**
 * 控制台中打印对象详细信息
 * @see console.trace
 * @param {Object} o
 * @static
 */
Q.trace = function (o) {};
/**
 * 是否是IE浏览器
 * @type Boolean
 */
Q.isIE = {};
/**
 * 是否是Opera浏览器
 * @type Boolean
 */
Q.isOpera = {};
/**
 * 是否为webkit内核的浏览器
 * @type Boolean
 */
Q.isWebkit = {};
/**
 * 是否为gecko内核的浏览器，比如firefox
 * @type Boolean
 */
Q.isGecko = {};
/**
 * 是否是Firefox浏览器
 * @type Boolean
 */
Q.isFirefox = {};
/**
 * 是否是Safari浏览器
 * @type Boolean
 */
Q.isSafari = {};
/**
 * 是否是Google Chrome浏览器
 * @type Boolean
 */
Q.isChrome = {};
/**
 * 是否是Mac OS X操作系统
 * @type Boolean
 */
Q.isMac = {};
/**
 * 默认样式表
 * @see Q.Styles
 * @see Q.Graph#styles
 * @type Object
 * @namespace
 * @static
 */
Q.DefaultStyles = {};
/**
 * 默认属性列表
 * @type Object
 * @namespace
 * @static
 */
Q.Defaults = {};
/**
 * 选取像素容差，设置选取容差可以改善点选交互，当线条特别细时，通常不容易直接点击在图元上面，如果设置选取容差为两个像素，则在距离线条两个像素范围内都可以点击到图元
 * 选取像素容差不随画布缩放而变化
 * @type number
 * @static
 */
Q.Defaults.SELECTION_TOLERANCE = {};
/**
 * 是否使用双canvas缓存机制，此选项用于处理部分浏览器的bug，不建议用户设置
 * @private
 * @type Boolean
 */
Q.Defaults.DOUBLE_BUFFER = {};
/**
 * 默认文字颜色
 * @type String
 * @static
 */
Q.Defaults.LABEL_COLOR = {};
/**
 * 默认字体样式
 * @static
 * @type string
 */
Q.Defaults.FONT_STYLE = {};
/**
 * 默认字体大小
 * @static
 * @type number
 */
Q.Defaults.FONT_SIZE = {};
/**
 * 默认字体家族名称
 * @static
 * @type string
 */
Q.Defaults.FONT_FAMILY = {};
/**
 * 默认字体，等于{@link Q.Defaults.FONT_STYLE} + {@link Q.Defaults.FONT_SIZE} + {@link Q.Defaults.FONT_FAMILY}
 * @static
 * @type string
 */
Q.Defaults.FONT = {};
/**
 * 双击间隔时间，单位为毫秒
 * @static
 * @type number
 */
Q.Defaults.DOUBLE_CLICK_INTERVAL_TIME = {};
/**
 * 长按时间间隔，单位为毫秒
 * @static
 * @type number
 */
Q.Defaults.LONG_PRESS_INTERVAL = {};
/**
 * 默认选中类型，支持三种模式
 * @see Q.Consts.SELECTION_TYPE_BORDER_RECT
 * @see Q.Consts.SELECTION_TYPE_BORDER
 * @see Q.Consts.SELECTION_TYPE_SHADOW
 * @static
 * @type string
 */
Q.Defaults.SELECTION_TYPE = {};
/**
 * 默认选中边框宽度
 * @static
 * @type number
 */
Q.Defaults.SELECTION_BORDER = {};
/**
 * 默认选中阴影大小
 * @static
 * @type number
 */
Q.Defaults.SELECTION_SHADOW_BLUR = {};
/**
 * 默认选中颜色
 * @static
 * @type string
 */
Q.Defaults.SELECTION_COLOR = {};
/**
 * 默认边框圆角半径
 * @static
 * @type number
 */
Q.Defaults.BORDER_RADIUS = {};
/**
 * 默认冒泡指针宽度
 * @static
 * @type number
 */
Q.Defaults.POINTER_WIDTH = {};
/**
 * 默认箭头大小
 * @static
 * @type number
 */
Q.Defaults.ARROW_SIZE = {};
/**
 * 默认图片最大大小
 * @static
 * @type number
 */
Q.Defaults.IMAGE_MAX_SIZE = {};
/**
 * 默认文字行高
 * @type number
 * @static
 */
Q.Defaults.LINE_HEIGHT = {};
/**
 * 默认图片高度
 * @type number
 * @static
 */
Q.Defaults.IMAGE_WIDTH = {};
/**
 * 默认图片宽度
 * @type number
 * @static
 */
Q.Defaults.IMAGE_HEIGHT = {};
/**
 * 单个图片的最大缓存像素数，为了提高显示效果和绘制效率，Qunee内部图片按不同的缩放级别进行了缓存，如果超出最大像素数，
 * 因为Qunee支持无极缩放和矢量图形，缩放比例很大时图片尺寸会变得很大，超出最大缓存像素时，Qunee将不做缓存，而是直接绘制，同时停止染色渲染
 * 默认值为：1000px * 1000px = 1000,000
 * @static
 * @type number
 */
Q.Defaults.MAX_CACHE_PIXELS = {};
/**
 * 默认颜色混合模式
 * @static
 * @type string
 */
Q.Defaults.BLEND_MODE = {};
/**
 * 默认分组类型
 * @static
 * @type string
 */
Q.Defaults.GROUP_TYPE = {};
/**
 * 默认分组内间距
 * @static
 * @type number
 */
Q.Defaults.GROUP_PADDING = {};
/**
 * 分组是否默认展开显示
 * @type Boolean
 * @static
 */
Q.Defaults.GROUP_EXPANDED = {};
/**
 * 分组展开状态时的默认最小尺寸
 * @type object
 * @static
 */
Q.Defaults.GROUP_MIN_SIZE = {};
/**
 * 默认文字对齐方式
 * @type Q.Position
 */
Q.Defaults.ALIGN_POSITION = {};
/**
 * 图形组件的默认导航类型，支持三种导航模式：滚动条，导航按钮，无
 * @see Q.Consts.NAVIGATION_***
 * @static
 * @type string
 */
Q.Defaults.NAVIGATION_TYPE = {};
/**
 * 导航面板向左图标
 * @static
 * @type string
 */
Q.Defaults.NAVIGATION_IMAGE_LEFT = {};
/**
 * 导航面板向上图标
 * @static
 * @type string
 */
Q.Defaults.NAVIGATION_IMAGE_TOP = {};
/**
 * 默认交互缩放动画
 * @static
 * @type object
 */
Q.Defaults.ZOOM_ANIMATE = {};
/**
 * 默认动画最长持续时间
 * @static
 * @type number
 */
Q.Defaults.ANIMATION_MAXTIME = {};
/**
 * 默认动画类型
 * @static
 * @param {Object} t
 * @returns {Object}
 */
Q.Defaults.ANIMATION_TYPE = function (t) {};
/**
 * 触控交互时，交互手柄的默认尺寸
 * @static
 * @type number
 */
Q.Defaults.INTERACTION_HANDLER_SIZE_TOUCH = {};
/**
 * 桌面交互时，交互手柄的默认尺寸
 * @static
 * @type number
 */
Q.Defaults.INTERACTION_HANDLER_SIZE_DESKTOP = {};
/**
 * 框选状态时，框选矩形的边框样式（线宽）
 * @static
 * @type number
 */
Q.Defaults.SELECTION_RECTANGLE_STROKE = {};
/**
 * 框选状态时，框选矩形的边框颜色
 * @static
 * @type string
 */
Q.Defaults.SELECTION_RECTANGLE_STROKE_COLOR = {};
/**
 * 框选状态时，框选矩形的填充颜色
 * @static
 * @type string
 */
Q.Defaults.SELECTION_RECTANGLE_FILL_COLOR = {};
/**
 * 注册默认交互模式
 * @param {String} name 模式名称
 * @param {Array} interactions 交互监听器集合
 * @param {String} cursor 默认光标
 * @static
 */
Q.Defaults.registerInteractions = function (name, interactions, cursor) {};
/**
 * 连线捆绑是否默认展开
 * @type Boolean
 * @static
 */
Q.Defaults.EDGE_BUNDLE_EXPANDED = {};
/**
 * 样式名称列表
 * @example 设置选中颜色样式为红色
 * var node = graph.createNode("node");
 * node.setStyle(Q.Styles.SELECTION_COLOR, "#FF0000");
 *
 * @see Element#setStyle
 * @type Object
 * @namespace
 * @static
 */
Q.Styles = {};
/**
 * 选中颜色
 * @type String
 * @static
 */
Q.Styles.SELECTION_COLOR = {};
/**
 * 选中边框宽度
 * @type String
 * @static
 */
Q.Styles.SELECTION_BORDER = {};
/**
 * 选中阴影模糊距离
 * @type String
 * @static
 */
Q.Styles.SELECTION_SHADOW_BLUR = {};
/**
 * 选中阴影x偏移量
 * @static
 * @type string
 */
Q.Styles.SELECTION_SHADOW_OFFSET_X = {};
/**
 * 选中阴影y偏移量
 * @static
 * @type string
 */
Q.Styles.SELECTION_SHADOW_OFFSET_Y = {};
/**
 * 选中类型，支持三种模式
 * @see Q.Consts.SELECTION_TYPE_BORDER_RECT
 * @see Q.Consts.SELECTION_TYPE_BORDER
 * @see Q.Consts.SELECTION_TYPE_SHADOW
 * @static
 * @type string
 */
Q.Styles.SELECTION_TYPE = {};
/**
 * 渲染颜色
 * @static
 * @type string
 */
Q.Styles.RENDER_COLOR = {};
/**
 * 颜色渲染模式
 * @static
 * @type string
 */
Q.Styles.RENDER_COLOR_BLEND_MODE = {};
/**
 * 阴影模糊距离
 * @static
 * @type string
 */
Q.Styles.SHADOW_BLUR = {};
/**
 * 阴影颜色
 * @static
 * @type string
 */
Q.Styles.SHADOW_COLOR = {};
/**
 * 阴影x偏移量
 * @static
 * @type string
 */
Q.Styles.SHADOW_OFFSET_X = {};
/**
 * 阴影y偏移量
 * @static
 * @type string
 */
Q.Styles.SHADOW_OFFSET_Y = {};
/**
 * 图形描边宽度
 * @type String
 * @static
 */
Q.Styles.SHAPE_STROKE = {};
/**
 * 图形描边样式，可以用于设置描边颜色
 * SHAPE_***样式只有在图元图片（image）为图形（Shape）时起作用，比如设置节点图片为圆角矩形: node.image = Q.Shapes.getRect(0, 0, 90, 50, 10);
 * @see Q.Node#image
 * @example 设置图元图形描边颜色为红色
 * var node = graph.createNode("node");
 * node.image = Q.Shapes.getRect(0, 0, 90, 50, 10);
 * node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#FF0000");
 * @type String
 * @static
 */
Q.Styles.SHAPE_STROKE_STYLE = {};
/**
 * 矢量图形，虚线样式，属性值为数值或者数值集合，例如：[5, 2]
 * @example
 var shape = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, -30, -5, 60, 25);
 var line = graph.createNode(null, 0, 0);
 line.setStyle(Q.Styles.SHAPE_STROKE, 1);
 line.setStyle(Q.Styles.SHAPE_STROKE_STYLE, Colors.yellow);
 line.setStyle(Q.Styles.SHAPE_LINE_DASH, [5, 2]);
 line.image = shape;
 * @static
 * @type String
 */
Q.Styles.SHAPE_LINE_DASH = {};
/**
 * 矢量图形，虚线样式，虚线偏移量，定时增加偏移量，可实现线条的流动效果，不支持IE
 * @static
 * @type String
 * @example
 var offset = 0;
 var timer = setInterval(function(){
     offset += -1;
     shape.setStyle(Q.Styles.SHAPE_LINE_DASH_OFFSET, offset);
 }, 150);
 */
Q.Styles.SHAPE_LINE_DASH_OFFSET = {};
/**
 * 图形填充颜色
 * @type String
 * @static
 */
Q.Styles.SHAPE_FILL_COLOR = {};
/**
 * 图形填充渐变
 * @Gradient
 * @type String
 * @static
 */
Q.Styles.SHAPE_FILL_GRADIENT = {};
/**
 * 多边形边线外框
 * @static
 * @type string
 */
Q.Styles.SHAPE_OUTLINE = {};
/**
 * 多边形边线外框样式
 * @static
 * @type string
 */
Q.Styles.SHAPE_OUTLINE_STYLE = {};
/**
 * 线条端点样式，适用于Edge, 以及以图形（Shape）为主体的Node
 * @type String
 * @static
 */
Q.Styles.LINE_CAP = {};
/**
 * 线条连接点样式
 * @type String
 * @static
 */
Q.Styles.LINE_JOIN = {};
/**
 * 设置附件沿图形路径布局，Qunee中每个图元由多个UI组件组合而成，其中有一个称为主体UI，其他的称为附件，主体UI的位置图元坐标属性计算得来，\\
 * 而附件UI的位置则相对主体UI或者另一个附件组件。
 * 比如一个Node图元由一个image和一个label组成，label相对image布局，image的位置为该图元的location坐标，而label位置则相对image，
 * 默认位于image之下，可以设置上下左右等九个位置，如果这个image不是图片，而是一个图形(shape)，比如一条折线，
 * 这时可以通过设置Q.Styles.LAYOUT_BY_PATH样式属性，使得label沿着折线布局，并按折线方向旋转
 * 只对Node起作用
 * @see Q.Styles.LABEL_ROTATABLE
 * @type String
 * @static
 */
Q.Styles.LAYOUT_BY_PATH = {};
/**
 * 背景颜色
 * @type String
 * @static
 */
Q.Styles.BACKGROUND_COLOR = {};
/**
 * 背景渐变
 * @Gradient
 * @type String
 * @static
 */
Q.Styles.BACKGROUND_GRADIENT = {};
/**
 * 边框宽度
 * @type String
 * @static
 */
Q.Styles.BORDER = {};
/**
 * 边框颜色
 * @type String
 * @static
 */
Q.Styles.BORDER_COLOR = {};
/**
 * 边框虚线样式，属性值为数值或者数值集合，例如：[5, 2]
 * @static
 * @type string
 */
Q.Styles.BORDER_LINE_DASH = {};
/**
 * 边框虚线偏移量，属性值为数值，定时更改该样式，可实现线条的流动效果
 * @static
 * @type string
 */
Q.Styles.BORDER_LINE_DASH_OFFSET = {};
/**
 * 边框圆角值，可以设置数值，或者：{x: 10, y: 20}
 * @static
 * @type string
 */
Q.Styles.BORDER_RADIUS = {};
/**
 * 内间距，设置背景或者边框时，背景或边框与UI组件之间的间隙
 * @see Q.Insets
 * @type String
 * @static
 */
Q.Styles.PADDING = {};
/**
 * 图片背景颜色
 * @static
 * @type string
 */
Q.Styles.IMAGE_BACKGROUND_COLOR = {};
/**
 * 图片背景渐变
 * @static
 * @type string
 */
Q.Styles.IMAGE_BACKGROUND_GRADIENT = {};
/**
 * 图片边框
 * @static
 * @type string
 */
Q.Styles.IMAGE_BORDER = {};
/**
 * 图片边框样式
 * @static
 * @type string
 */
Q.Styles.IMAGE_BORDER_STYLE = {};
/**
 * 图片边框虚线样式
 * @static
 * @type string
 */
Q.Styles.IMAGE_BORDER_LINE_DASH = {};
/**
 * 图片边框虚线偏移量
 * @static
 * @type string
 */
Q.Styles.IMAGE_BORDER_LINE_DASH_OFFSET = {};
/**
 * 图片边框圆角半径
 * @static
 * @type string
 */
Q.Styles.IMAGE_BORDER_RADIUS = {};
/**
 * 图片边框圆角半径，与{Q.Styles.IMAGE_BORDER_RADIUS}相同
 * @static
 * @type string
 */
Q.Styles.IMAGE_RADIUS = {};
/**
 * 图片内间距
 * @static
 * @type string
 */
Q.Styles.IMAGE_PADDING = {};
/**
 * 文本标签旋转角度，属性值为弧度
 * @static
 * @type string
 */
Q.Styles.LABEL_ROTATE = {};
/**
 * 文本标签位置，与Q.Styles.LABEL_ANCHOR_POSITION结合使用，确定文本标签的位置
 * @Position
 * @type String
 * @static
 */
Q.Styles.LABEL_POSITION = {};
/**
 * 文本标签挂载点位置，与Q.Styles.LABEL_ANCHOR_POSITION结合使用，确定文本标签的位置
 * @type String
 * @static
 */
Q.Styles.LABEL_ANCHOR_POSITION = {};
/**
 * 文本标签文字颜色
 * @type String
 * @static
 */
Q.Styles.LABEL_COLOR = {};
/**
 * 文本标签字体大小
 * @example
 * node.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
 * @type String
 * @static
 */
Q.Styles.LABEL_FONT_SIZE = {};
/**
 * 文本标签字体名称
 * @example
 * node.setStyle(Q.Styles.LABEL_FONT_FAMILY, "Helvetica");
 * @type String
 * @static
 */
Q.Styles.LABEL_FONT_FAMILY = {};
/**
 * 文本标签字体样式
 * @example
 * node.setStyle(Q.Styles.LABEL_FONT_STYLE, "lighter");
 * @type String
 * @static
 */
Q.Styles.LABEL_FONT_STYLE = {};
/**
 * 文本标签内间距
 * @see Q.Insets
 * @type String
 * @static
 */
Q.Styles.LABEL_PADDING = {};
/**
 * 文本标签冒泡指针宽度
 * @see Q.Styles.LABEL_POINTER
 * @type String
 * @static
 */
Q.Styles.LABEL_POINTER_WIDTH = {};
/**
 * 是否显示文本标签冒泡指针
 * @see Q.Styles.LABEL_POINTER_WIDTH
 * @example
 * var node = graph.createNode("Hello Qunee");
 * node.setStyle(Q.Styles.LABEL_OFFSET_Y, -10);
 * node.setStyle(Q.Styles.LABEL_BORDER, 1);
 * node.setStyle(Q.Styles.LABEL_POINTER, true);
 * node.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(2, 5));
 * @type String
 * @static
 */
Q.Styles.LABEL_POINTER = {};
/**
 * 文本标签圆角宽度，支持数值或者这样的对象：{x: 10, y: 10}
 * @type String
 * @static
 */
Q.Styles.LABEL_RADIUS = {};
/**
 * 文本标签x方向偏移量
 * @type String
 * @static
 */
Q.Styles.LABEL_OFFSET_X = {};
/**
 * 文本标签y方向偏移量
 * @type String
 * @static
 */
Q.Styles.LABEL_OFFSET_Y = {};
/**
 * 文本尺寸大小样式，可以设置为{width: 100, height: 80}
 * @example
 * var text = graph.createText("Text");
 * text.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(100, 80));
 * @static
 * @type string
 */
Q.Styles.LABEL_SIZE = {};
/**
 * 文本对齐方式
 * @static
 * @type string
 */
Q.Styles.LABEL_ALIGN_POSITION = {};
/**
 * 文本标签边框宽度
 * @see Q.Styles.LABEL_BORDER_STYLE
 * @type String
 * @static
 */
Q.Styles.LABEL_BORDER = {};
/**
 * 文本标签边框颜色
 * @see Q.Styles.LABEL_BORDER
 * @type String
 * @static
 */
Q.Styles.LABEL_BORDER_STYLE = {};
/**
 * 文本标签背景颜色
 * @type String
 * @static
 */
Q.Styles.LABEL_BACKGROUND_COLOR = {};
/**
 * 文本标签背景渐变
 * @type String
 * @static
 */
Q.Styles.LABEL_BACKGROUND_GRADIENT = {};
/**
 * 文本标签是否允许旋转
 * @see Q.Styles.LAYOUT_BY_PATH
 * @type String
 * @static
 */
Q.Styles.LABEL_ROTATABLE = {};
/**
 * 文本标签的阴影模糊距离
 * @static
 * @type string
 */
Q.Styles.LABEL_SHADOW_BLUR = {};
/**
 * 文本标签的阴影颜色
 * @static
 * @type string
 */
Q.Styles.LABEL_SHADOW_COLOR = {};
/**
 * 文本标签的阴影x偏移量
 * @static
 * @type string
 */
Q.Styles.LABEL_SHADOW_OFFSET_X = {};
/**
 * 文本标签的阴影y偏移量
 * @static
 * @type string
 */
Q.Styles.LABEL_SHADOW_OFFSET_Y = {};
/**
 * 分组背景颜色
 * @type String
 * @static
 */
Q.Styles.GROUP_BACKGROUND_COLOR = {};
/**
 * 分组背景渐变
 * @type String
 * @static
 */
Q.Styles.GROUP_BACKGROUND_GRADIENT = {};
/**
 * 分组描边宽度
 * @see Q.Styles.GROUP_STROKE_STYLE
 * @type String
 * @static
 */
Q.Styles.GROUP_STROKE = {};
/**
 * 分组描边样式
 * @see Q.Styles.GROUP_STROKE
 * @type String
 * @static
 */
Q.Styles.GROUP_STROKE_STYLE = {};
/**
 * 分组边线虚线样式
 * @static
 * @type string
 */
Q.Styles.GROUP_STROKE_LINE_DASH = {};
/**
 * 分组边线虚线偏移量
 * @static
 * @type string
 */
Q.Styles.GROUP_STROKE_LINE_DASH_OFFSET = {};
/**
 * 连线捆绑文本旋转角度
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_ROTATE = {};
/**
 * 连线捆绑文本位置
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_POSITION = {};
/**
 * 连线捆绑文本挂载点位置
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_ANCHOR_POSITION = {};
/**
 * 连线捆绑文字颜色
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_COLOR = {};
/**
 * 连线捆绑文本字体大小
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_FONT_SIZE = {};
/**
 * 连线捆绑文本字体家族
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_FONT_FAMILY = {};
/**
 * 连线捆绑文本字体样式
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_FONT_STYLE = {};
/**
 * 连线捆绑文本内间距
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_PADDING = {};
/**
 * 连线捆绑文本冒泡指针宽度
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_POINTER_WIDTH = {};
/**
 * 连线捆绑文本冒泡
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_POINTER = {};
/**
 * 连线捆绑文本圆角
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_RADIUS = {};
/**
 * 连线捆绑文本x偏移量
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_OFFSET_X = {};
/**
 * 连线捆绑文本y偏移量
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_OFFSET_Y = {};
/**
 * 连线捆绑文本边框
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_BORDER = {};
/**
 * 连线捆绑文本边框样式
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_BORDER_STYLE = {};
/**
 * 连线捆绑文本背景颜色
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_BACKGROUND_COLOR = {};
/**
 * 连线捆绑文本边框背景渐变
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_BACKGROUND_GRADIENT = {};
/**
 * 连线捆绑文本能否旋转
 * @static
 * @type string
 */
Q.Styles.EDGE_BUNDLE_LABEL_ROTATABLE = {};
/**
 * 连线宽度
 * @see Q.Edge
 * @type String
 * @static
 */
Q.Styles.EDGE_WIDTH = {};
/**
 * 连线颜色
 * @see Q.Edge
 * @type String
 * @static
 */
Q.Styles.EDGE_COLOR = {};
/**
 * 连线外边框
 * @static
 * @type string
 */
Q.Styles.EDGE_OUTLINE = {};
/**
 * 连线外边框样式
 * @static
 * @type string
 */
Q.Styles.EDGE_OUTLINE_STYLE = {};
/**
 * 连线虚线样式，属性值为数值或者数值集合，例如：[5, 2]
 * @example
 *  edge1.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 0.01, 4]);
 * @static
 * @type string
 */
Q.Styles.EDGE_LINE_DASH = {};
/**
 * 连线虚线偏移量，可用于实现连线流动效果
 * @static
 * @type string
 */
Q.Styles.EDGE_LINE_DASH_OFFSET = {};
/**
 * 连线起始端偏移量
 * @type String
 * @static
 */
Q.Styles.EDGE_FROM_OFFSET = {};
/**
 * 连线结束端偏移量
 * @type String
 * @static
 */
Q.Styles.EDGE_TO_OFFSET = {};
/**
 * 连线捆绑间距
 * @type String
 * @static
 */
Q.Styles.EDGE_BUNDLE_GAP = {};
/**
 * 连线自环捆绑间距
 * @type String
 * @static
 */
Q.Styles.EDGE_LOOPED_EXTAND = {};
/**
 * 连线延伸量，适用于Consts.EDGE_TYPE_ELBOW***类型的连线
 * @type String
 * @static
 */
Q.Styles.EDGE_EXTEND = {};
/**
 * 连线控制点，适用于Consts.EDGE_TYPE_ORTHOGONAL***类型的连线
 * @type String
 * @static
 */
Q.Styles.EDGE_CONTROL_POINT = {};
/**
 * 按百分比劈分，适用于Consts.EDGE_TYPE_ORTHOGONAL***类型的连线
 * @type String
 * @static
 */
Q.Styles.EDGE_SPLIT_BY_PERCENT = {};
/**
 * 劈分百分比数值，0 - 1，适用于类型为Consts.EDGE_TYPE_ORTHOGONAL***，并且按百分比劈分的连线
 * @see Q.Styles.EDGE_SPLIT_BY_PERCENT
 * @type String
 * @static
 */
Q.Styles.EDGE_SPLIT_PERCENT = {};
/**
 * 连线劈分位置数值，适用于类型为Consts.EDGE_TYPE_ORTHOGONAL***，并且不按百分比劈分的连线
 * @type String
 * @static
 */
Q.Styles.EDGE_SPLIT_VALUE = {};
/**
 * 连线拐角类型，适用于Consts.EDGE_TYPE_ORTHOGONAL***类型的连线，支持三种：
 * @see Q.Consts.EDGE_CORNER_NONE
 * @see Q.Consts.EDGE_CORNER_ROUND
 * @see Q.Consts.EDGE_CORNER_BEVEL
 * @type String
 * @static
 */
Q.Styles.EDGE_CORNER = {};
/**
 * 连线拐角圆角
 * @static
 * @type string
 */
Q.Styles.EDGE_CORNER_RADIUS = {};
/**
 * 显示起始端箭头，适用于连线和Shape图形
 * @type String
 * @static
 */
Q.Styles.ARROW_FROM = {};
/**
 * 起始端箭头大小
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_SIZE = {};
/**
 * 起始端箭头偏移量
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_OFFSET = {};
/**
 * 起始端箭头边线宽度
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_STROKE = {};
/**
 * 起始端箭头边线样式
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_STROKE_STYLE = {};
/**
 * 起始箭头的外边框粗细
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_OUTLINE = {};
/**
 * 起始箭头外边框颜色
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_OUTLINE_STYLE = {};
/**
 * 起始端箭头边线虚线
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_LINE_DASH = {};
/**
 * 起始端箭头边线虚线偏移量
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_LINE_DASH_OFFSET = {};
/**
 * 起始端箭头填充颜色
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_FILL_COLOR = {};
/**
 * 起始端箭头填充渐变
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_FILL_GRADIENT = {};
/**
 * 起始端箭头边线端点样式
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_LINE_CAP = {};
/**
 * 起始端箭头边线连接点样式
 * @static
 * @type string
 */
Q.Styles.ARROW_FROM_LINE_JOIN = {};
/**
 * 显示结束端箭头，适用于连线和Shape图形
 * @type String
 * @static
 */
Q.Styles.ARROW_TO = {};
/**
 * 结束端箭头大小
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_SIZE = {};
/**
 * 结束端箭头偏移量
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_OFFSET = {};
/**
 * 结束端箭头边线宽度
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_STROKE = {};
/**
 * 结束端箭头边线样式
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_STROKE_STYLE = {};
/**
 * 结束箭头外边框粗细
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_OUTLINE = {};
/**
 * 结束箭头外边框颜色
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_OUTLINE_STYLE = {};
/**
 * 结束端箭头边线虚线
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_LINE_DASH = {};
/**
 * 结束端箭头边线虚线偏移量
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_LINE_DASH_OFFSET = {};
/**
 * 结束端箭头填充颜色
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_FILL_COLOR = {};
/**
 * 结束端箭头填充渐变
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_FILL_GRADIENT = {};
/**
 * 结束端箭头边线端点样式
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_LINE_CAP = {};
/**
 * 结束端箭头边线连接点样式
 * @static
 * @type string
 */
Q.Styles.ARROW_TO_LINE_JOIN = {};
/**
 * 常量列表
 * @type Object
 * @namespace
 * @static
 */
Q.Consts = {};
/**
 * 矩形边框选中类型
 * @see Q.Styles.SELECTION_TYPE
 * @static
 * @type string
 */
Q.Consts.SELECTION_TYPE_BORDER_RECT = {};
/**
 * 边框选中类型
 * @see Q.Styles.SELECTION_TYPE
 * @static
 * @type string
 */
Q.Consts.SELECTION_TYPE_BORDER = {};
/**
 * 阴影选中类型
 * @see Q.Styles.SELECTION_TYPE
 * @static
 * @type string
 */
Q.Consts.SELECTION_TYPE_SHADOW = {};
/**
 * SVG名称空间，用于创建SVG元素
 * @type type
 * @static
 */
Q.Consts.NS_SVG = {};
/**
 * 直接属性
 * @example
 * node.name = "Hello";
 * @type type
 */
Q.Consts.PROPERTY_TYPE_ACCESSOR = {};
/**
 * 样式属性
 * @example
 * node.setStyle(Q.Styles.LABEL_OFFSET_X, 10);
 *
 * @type type
 * @static
 */
Q.Consts.PROPERTY_TYPE_STYLE = {};
/**
 * 用户属性
 * node.set("name", "Hello");
 * @type type
 * @static
 */
Q.Consts.PROPERTY_TYPE_CLIENT = {};
/**
 * 默认连线类型
 * @see Q.Edge#edgeType
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_DEFAULT = {};
/**
 * 肘形连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_ELBOW = {};
/**
 * 水平方向肘形连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_ELBOW_HORIZONTAL = {};
/**
 * 垂直方向肘形连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_ELBOW_VERTICAL = {};
/**
 * 正交连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_ORTHOGONAL = {};
/**
 * 水平方向正交连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL = {};
/**
 * 垂直方向正交连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_ORTHOGONAL_VERTICAL = {};
/**
 * 水平L形连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL = {};
/**
 * 垂直L形连线类型
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL = {};
/**
 * 弓形连线类型，方向向上
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_EXTEND_TOP = {};
/**
 * 弓形连线类型，方向向左
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_EXTEND_LEFT = {};
/**
 * 弓形连线类型，方向向下
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_EXTEND_BOTTOM = {};
/**
 * 弓形连线类型，方向向右
 * @type type
 * @static
 */
Q.Consts.EDGE_TYPE_EXTEND_RIGHT = {};
/**
 * Z形连线类型
 * @static
 * @type string
 */
Q.Consts.EDGE_TYPE_ZIGZAG = {};
/**
 * 无连线拐角，适用于Consts.EDGE_TYPE_ORTHOGONAL***类型的连线
 * @see Q.Edge#edgeType
 * @see Q.Styles.EDGE_CORNER
 * @type type
 * @static
 */
Q.Consts.EDGE_CORNER_NONE = {};
/**
 * 圆角样式，适用于Consts.EDGE_TYPE_ORTHOGONAL***类型的连线
 * @see Q.Edge#edgeType
 * @see Q.Styles.EDGE_CORNER
 * @type type
 * @static
 */
Q.Consts.EDGE_CORNER_ROUND = {};
/**
 * 斜面样式，适用于Consts.EDGE_TYPE_ORTHOGONAL***类型的连线
 * @see Q.Edge#edgeType
 * @see Q.Styles.EDGE_CORNER
 * @type type
 * @static
 */
Q.Consts.EDGE_CORNER_BEVEL = {};
/**
 * 矩形分组类型
 * @type type
 * @static
 */
Q.Consts.GROUP_TYPE_RECT = {};
/**
 * 圆形分组类型
 * @type type
 * @static
 */
Q.Consts.GROUP_TYPE_CIRCLE = {};
/**
 * 椭圆分组类型
 * @type type
 * @static
 */
Q.Consts.GROUP_TYPE_ELLIPSE = {};
/**
 * 圆形
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @type type
 * @static
 */
Q.Consts.SHAPE_CIRCLE = {};
/**
 * 矩形
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @see Q.Shapes.getRect
 * @type type
 * @static
 */
Q.Consts.SHAPE_RECT = {};
/**
 * 圆角矩形
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @see Q.Shapes.getRect
 * @type type
 * @static
 */
Q.Consts.SHAPE_ROUNDRECT = {};
/**
 * 星形
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @type type
 * @static
 */
Q.Consts.SHAPE_STAR = {};
/**
 * 三角形
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @type type
 * @static
 */
Q.Consts.SHAPE_TRIANGLE = {};
/**
 * 六边形
 * @static
 * @type string
 */
Q.Consts.SHAPE_HEXAGON = {};
/**
 * 五边形
 * @static
 * @type string
 */
Q.Consts.SHAPE_PENTAGON = {};
/**
 * 斜方形
 * @static
 * @type string
 */
Q.Consts.SHAPE_TRAPEZIUM = {};
/**
 * 斜平行四边形
 * @static
 * @type string
 */
Q.Consts.SHAPE_RHOMBUS = {};
/**
 * 平行四边形
 * @static
 * @type string
 */
Q.Consts.SHAPE_PARALLELOGRAM = {};
/**
 * 心形
 * @static
 * @type string
 */
Q.Consts.SHAPE_HEART = {};
/**
 * 菱形
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @type type
 * @static
 */
Q.Consts.SHAPE_DIAMOND = {};
/**
 * 十字形
 * @static
 * @type string
 */
Q.Consts.SHAPE_CROSS = {};
/**
 * 标准箭头
 * @see Q.Shapes
 * @see Q.Shapes.getShape
 * @type type
 * @static
 */
Q.Consts.SHAPE_ARROW_STANDARD = {};
/**
 * 箭头1
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_1 = {};
/**
 * 箭头2
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_2 = {};
/**
 * 箭头3
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_3 = {};
/**
 * 箭头4
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_4 = {};
/**
 * 箭头5
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_5 = {};
/**
 * 箭头6
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_6 = {};
/**
 * 箭头7
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_7 = {};
/**
 * 箭头8
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_8 = {};
/**
 * 开放箭头
 * @static
 * @type string
 */
Q.Consts.SHAPE_ARROW_OPEN = {};
/**
 * 线条端点（线帽）样式，平直边缘
 * @type type
 * @static
 */
Q.Consts.LINE_CAP_TYPE_BUTT = {};
/**
 * 线条端点（线帽）样式，圆形边缘
 * @type type
 * @static
 */
Q.Consts.LINE_CAP_TYPE_ROUND = {};
/**
 * 线条端点（线帽）样式，正方形边缘
 * @type type
 * @static
 */
Q.Consts.LINE_CAP_TYPE_SQUARE = {};
/**
 * 线条连接点样式，斜角
 * @type type
 * @static
 */
Q.Consts.LINE_JOIN_TYPE_BEVEL = {};
/**
 * 线条连接点样式，圆角
 * @type type
 * @static
 */
Q.Consts.LINE_JOIN_TYPE_ROUND = {};
/**
 * 线条连接点样式，斜接
 * @type type
 * @static
 */
Q.Consts.LINE_JOIN_TYPE_MITER = {};
/**
 * 渐变类型：径向渐变
 * @see Q.Gradient
 * @type type
 * @static
 */
Q.Consts.GRADIENT_TYPE_RADIAL = {};
/**
 * 渐变类型：线性渐变
 * @see Q.Gradient
 * @type type
 * @static
 */
Q.Consts.GRADIENT_TYPE_LINEAR = {};
/**
 * 路径片段类型：moveTo
 * @see Q.Path
 * @see CanvasRenderingContext2D
 * @type type
 * @static
 */
Q.Consts.SEGMENT_MOVE_TO = {};
/**
 * 路径片段类型：lineTo
 * @see Q.Path
 * @see CanvasRenderingContext2D
 * @type type
 * @static
 */
Q.Consts.SEGMENT_LINE_TO = {};
/**
 * 路径片段类型：quadraticCurveTo
 * @see Q.Path
 * @see CanvasRenderingContext2D
 * @type type
 * @static
 */
Q.Consts.SEGMENT_QUAD_TO = {};
/**
 * 路径片段类型：bezierCurveTo
 * @see Q.Path
 * @see CanvasRenderingContext2D
 * @type type
 * @static
 */
Q.Consts.SEGMENT_CURVE_TO = {};
/**
 * 圆弧片段类型：#arcTo
 * @static
 * @type string
 */
Q.Consts.SEGMENT_ARC_TO = {};
/**
 * 路径片段类型：closePath
 * @see Q.Path
 * @see CanvasRenderingContext2D
 * @type type
 * @static
 */
Q.Consts.SEGMENT_CLOSE = {};
/**
 * 混合模式-变暗
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_DARKEN = {};
/**
 * 混合模式-正片叠底
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_MULTIPLY = {};
/**
 * 混合模式-颜色叠加
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_COLOR_BURN = {};
/**
 * 混合模式-线性叠加
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_LINEAR_BURN = {};
/**
 * 混合模式-变亮
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_LIGHTEN = {};
/**
 * 混合模式-屏幕
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_SCREEN = {};
/**
 * 混合模式-灰度染色
 * @static
 * @type string
 */
Q.Consts.BLEND_MODE_GRAY = {};
/**
 * 滚动条导航模式
 * @see Q.Graph#navigationType
 * @static
 * @type string
 */
Q.Consts.NAVIGATION_SCROLLBAR = {};
/**
 * 无导航面板
 * @see Q.Graph#navigationType
 * @static
 * @type string
 */
Q.Consts.NAVIGATION_NONE = {};
/**
 * 导航按钮模式
 * @see Q.Graph#navigationType
 * @static
 * @type string
 */
Q.Consts.NAVIGATION_BUTTON = {};
/**
 * 交互模式：浏览模式
 * @static
 * @type string
 */
Q.Consts.INTERACTION_MODE_VIEW = {};
/**
 * 交互模式：默认
 * @type type
 * @static
 */
Q.Consts.INTERACTION_MODE_DEFAULT = {};
/**
 * 框选交互模式
 * @static
 * @type string
 */
Q.Consts.INTERACTION_MODE_SELECTION = {};
/**
 * 交互模式：放大
 * @type type
 * @static
 */
Q.Consts.INTERACTION_MODE_ZOOMIN = {};
/**
 * 交互模式：缩小
 * @type type
 * @static
 */
Q.Consts.INTERACTION_MODE_ZOOMOUT = {};
/**
 * 创建连线交互模式，简单模式
 * @static
 * @type string
 */
Q.Consts.INTERACTION_MODE_CREATE_SIMPLE_EDGE = {};
/**
 * 创建连线模式
 * @static
 * @type string
 */
Q.Consts.INTERACTION_MODE_CREATE_EDGE = {};
/**
 * 创建多边形交互模式
 * @static
 * @type string
 */
Q.Consts.INTERACTION_MODE_CREATE_SHAPE = {};
/**
 * 创建多线条交互模式
 * @static
 * @type string
 */
Q.Consts.INTERACTION_MODE_CREATE_LINE = {};
/**
 * 布局方向：从左往右
 * @type type
 * @static
 */
Q.Consts.DIRECTION_RIGHT = {};
/**
 * 布局方向：从右向左
 * @static
 * @type number
 */
Q.Consts.DIRECTION_LEFT = {};
/**
 * 布局方向：水平居中分布，只用于Q.Consts.LAYOUT_TYPE_TWO_SIDE布局类型
 * @static
 * @type number
 */
Q.Consts.DIRECTION_CENTER = {};
/**
 * 布局方向：从上往下
 * @type type
 * @static
 */
Q.Consts.DIRECTION_BOTTOM = {};
/**
 * 布局方向：从下往上
 * @static
 * @type number
 */
Q.Consts.DIRECTION_TOP = {};
/**
 * 布局方向：垂直居中分布，只用于Q.Consts.LAYOUT_TYPE_TWO_SIDE布局类型
 * @static
 * @type number
 */
Q.Consts.DIRECTION_MIDDLE = {};
/**
 * 布局类型：平均分布
 * @type type
 * @static
 */
Q.Consts.LAYOUT_TYPE_EVEN = {};
/**
 * 布局类型：水平平均分布
 * @static
 * @type string
 */
Q.Consts.LAYOUT_TYPE_EVEN_HORIZONTAL = {};
/**
 * 布局类型：垂直平均分布
 * @static
 * @type string
 */
Q.Consts.LAYOUT_TYPE_EVEN_VERTICAL = {};
/**
 * 布局类型：两侧分布
 * @type type
 * @static
 */
Q.Consts.LAYOUT_TYPE_TWO_SIDE = {};
/**
 * 角度按需分布，适用于{Q.BalloonLayouter}
 * @static
 * @type string
 */
Q.Consts.ANGLE_SPACING_PROPORTIONAL = {};
/**
 * 角度均匀分布
 * @static
 * @type string
 */
Q.Consts.ANGLE_SPACING_REGULAR = {};
/**
 * 统一半径模式，适用于{Q.BalloonLayouter}
 * @static
 * @type string
 */
Q.Consts.RADIUS_MODE_UNIFORM = {};
/**
 * 可变半径模式，适用于{Q.BalloonLayouter}
 * @static
 * @type string
 */
Q.Consts.RADIUS_MODE_VARIABLE = {};
/**
 * 图形列表
 * @see Q.Node
 * @see Q.ImageUI
 * @example
 * node.image = Q.Graphs.server;
 *
 * @type type
 * @static
 */
Q.Graphs = {};
/**
 * 图形组件类，可以添加各种图形元素（节点，连线，分组等），以及图形元素上挂载图形，实现丰富的图形展示效果，可以实现拓扑图，组织图，流程图，机房图等
 * @param {(HTMLElement|String)} div 图形组件所在的HTML节点，或者HTML元素的id名称
 * @constructor
 */
Q.Graph = function (div, graphModel) {};
/**
 * 初始坐标原点位于屏幕中心，默认为true，如果希望延续传统的左上角为坐标原点，可设置该属性为false
 * @type boolean
 */
Q.Graph.prototype.originAtCenter = {};
/**
 * 能否编辑
 * @type boolean
 */
Q.Graph.prototype.editable = {};
/**
 * graph为可编辑状态时，响应元素拖入事件，实现拖拽创建节点
 * @param {MouseEvent} evt
 */
Q.Graph.prototype.ondrop = function (evt){};
/**
 * 是否激活双击空白画布纵览显示功能，默认为true
 * @type boolean
 */
Q.Graph.prototype.enableDoubleClickToOverview = {};
/**
 * 图元是否可见，默认返回true
 * @param {Q.Element} item
 * @returns {Boolean}
 */
Q.Graph.prototype.isVisible = function (item) {};
/**
 * 图元是否可以拖动，默认返回true
 * @param {Q.Element} item
 * @returns {Boolean}
 */
Q.Graph.prototype.isMovable = function (item) {};
/**
 * 网元是否可以选中
 * @param {Object} item
 * @returns {Object}
 */
Q.Graph.prototype.isSelectable = function (item) {};
/**
 * 元素是否可以编辑
 * @param {Q.Element} item
 * @returns {boolean}
 */
Q.Graph.prototype.isEditable = function (item) {};
/**
 * 元素是否可以旋转
 * @param {Q.Element} item
 * @returns {boolean}
 */
Q.Graph.prototype.isRotatable = function (item) {};
/**
 * 节点是否可以调整大小
 * @param {Q.Node} item
 * @returns {boolean}
 */
Q.Graph.prototype.isResizable = function (item) {};
/**
 * 是否可以作为连线的起始节点
 * @param {Q.Node} node
 * @returns {Boolean}
 */
Q.Graph.prototype.canLinkFrom = function (node){};
/**
 * 是否可以作为连线的结束节点
 * @param {Q.Node} node
 * @param {Q.Node} from 起始节点
 * @returns {Boolean}
 */
Q.Graph.prototype.canLinkTo = function (node, from){};
/**
 * 创建节点对象
 * @param {String} name 节点名称
 * @param {Number} x 节点位置
 * @param {Number} y 节点位置
 * @returns {Node}
 */
Q.Graph.prototype.createNode = function (name, x, y) {};
/**
 * 创建文本节点
 * @param {Object} name
 * @param {number} x
 * @param {number} y
 * @returns {Object}
 */
Q.Graph.prototype.createText = function (name, x, y) {};
/**
 * 创建多边形
 * @param {Object} name
 * @param {Object} path
 * @param {number} x
 * @param {number} y
 * @returns {Object}
 */
Q.Graph.prototype.createShapeNode = function (name, path, x, y) {};
/**
 * 创建分组节点
 * @param {Object} name
 * @param {number} x
 * @param {number} y
 * @returns {Object}
 */
Q.Graph.prototype.createGroup = function (name, x, y) {};
/**
 * 创建连线图元
 * @param {String} name 连线名称
 * @param {Node} from 连线起始端
 * @param {Node} to 连线结束端
 * @returns {Edge}
 */
Q.Graph.prototype.createEdge = function (name, from, to) {};
/**
 * 添加图元
 * @param {Q.Element} element
 */
Q.Graph.prototype.addElement = function (element){};
/**
 * 删除网元
 * @param {Object} element
 * @returns {Object}
 */
Q.Graph.prototype.removeElement = function (element){};
/**
 * 清除图元集合
 */
Q.Graph.prototype.clear = function (){};
/**
 * 获取图元样式属性
 * @param {Q.Element} node 图元
 * @param {String} name 样式名称
 * @returns {Object} 样式值
 */
Q.Graph.prototype.getStyle = function (node, name) {};
/**
 * 平移
 * @param {Number} tx x方向平移量
 * @param {Number} ty y方向平移量
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.translate = function (tx, ty, byAnimate) {};
/**
 * 平移到指定位置
 * @param {Number} tx x位置
 * @param {Number} ty y位置
 * @param {Number} scale 缩放比例
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.translateTo = function (tx, ty, scale, byAnimate) {};
/**
 * 以指定位置为中心
 * @param {Number} cx 中心点x坐标
 * @param {Number} cy 中心点y坐标
 * @param {Number} scale 缩放比例
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.centerTo = function (cx, cy, scale, byAnimate) {};
/**
 * 移动到中心，设置会在下次绘制时生效
 * @param {Number} scale 缩放比例
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.moveToCenter = function (scale, byAnimate) {};
/**
 * 通过缩放和平移画布，使得图元全部显示在画布内，如果此时缩放比例小于图的最小缩放比例，则取最小缩放比例，居中显示，设置结果会在下次绘制时生效
 */
Q.Graph.prototype.zoomToOverview = function (byAnimate) {};
/**
 * 按指定位置缩放
 * @param {Number} scale
 * @param {Number} px
 * @param {Number} py
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.zoomAt = function (scale, px, py, byAnimate) {};
/**
 * 指定缩放点为中心缩小
 * @param {Number} px 缩放中心点x坐标
 * @param {Number} py 缩放中心点y坐标
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.zoomOut = function (px, py, byAnimate) {};
/**
 * 指定缩放点为中心放大
 * @param {Number} px 缩放中心点x坐标
 * @param {Number} py 缩放中心点y坐标
 * @param {object} byAnimate 动画参数
 */
Q.Graph.prototype.zoomIn = function (px, py, byAnimate) {};
/**
 * 是否使用惯性动画
 * @type boolean
 */
Q.Graph.prototype.enableInertia = {};
/**
 * 根据图元获取对应的图元UI对象
 * @param {Q.Element} element 图元
 * @returns {ElementUI}
 */
Q.Graph.prototype.getUI = function (element) {};
/**
 * 获取鼠标点位置的图元UI对象
 * @see Q.Graph#getElementByMouseEvent
 * @see Q.Graph#hitTest
 * @param {MouseEvent} evt 鼠标事件
 * @returns {ElementUI}
 */
Q.Graph.prototype.getUIByMouseEvent = function (evt) {};
/**
 * 获取鼠标点位置的UI对象
 * @param {MouseEvent} evt 鼠标事件
 * @returns {BaseUI}
 */
Q.Graph.prototype.hitTest = function (evt) {};
/**
 * 画布屏幕坐标转换成画布逻辑坐标
 * @param {Object} evt 鼠标点或者坐标点对象
 * @returns {Point} 逻辑点坐标
 */
Q.Graph.prototype.globalToLocal = function (evt) {};
/**
 * 逻辑坐标转换为画布坐标
 * @see {Q.Graph#toLogical}
 * @param {Number} x
 * @param {Number} y
 * @returns {Q.Point}
 */
Q.Graph.prototype.toCanvas = function (x, y) {};
/**
 * 画布坐标转换成逻辑坐标
 * @see {Q.Graph#toCanvas}
 * @param {Number} x
 * @param {Number} y
 * @returns {Q.Point}
 */
Q.Graph.prototype.toLogical = function (x, y) {};
/**
 * 获取鼠标点位置的图元对象
 * @param {type} evt 鼠标事件
 * @returns {Element}
 */
Q.Graph.prototype.getElementByMouseEvent = function (evt) {};
/**
 * 通过id获取图元
 * @param {number} id
 * @returns {Object}
 */
Q.Graph.prototype.getElement = function (id) {};
/**
 * 使画布无效，重新绘制
 */
Q.Graph.prototype.invalidate = function () {};
/**
 * 无效图元 UI
 * @param {Object} ui
 * @returns {Object}
 */
Q.Graph.prototype.invalidateUI = function (ui){};
/**
 * 无效图元，用于刷新图元显示状态
 * @param {Q.Element} element
 */
Q.Graph.prototype.invalidateElement = function (element){};
/**
 * 获取图元UI的范围
 * @param {Q.Element} element 图元对象
 * @returns {Rect}
 */
Q.Graph.prototype.getUIBounds = function (element) {};
/**
 * 遍历所有可见的图元UI对象
 * @param {Function} call 回调函数
 * @param {Object} scope
 */
Q.Graph.prototype.forEachVisibleUI = function (call, scope) {};
/**
 * 反向遍历所有可见的图元 UI
 * @param {Object} call
 * @param {Object} scope
 * @returns {Object}
 */
Q.Graph.prototype.forEachReverseVisibleUI = function (call, scope) {};
/**
 * 遍历所有的图元 UI
 * @param {Object} call
 * @param {Object} scope
 * @returns {Object}
 */
Q.Graph.prototype.forEachUI = function (call, scope) {};
/**
 * 反向遍历所有的图元 UI
 * @param {Object} call
 * @param {Object} scope
 * @returns {Object}
 */
Q.Graph.prototype.forEachReverseUI = function (call, scope) {};
/**
 * 遍历所有网元
 * @param {Function} call
 * @param {Object} scope
 */
Q.Graph.prototype.forEach = function (call, scope) {};
/**
 * 根据图元名称获取第一个找到的图元对象
 * @param {String} name
 * @returns {Element}
 */
Q.Graph.prototype.getElementByName = function (name) {};
/**
 * 画布获取焦点
 * @param {Boolean} withoutScroll 网页中，元素获取焦点时会自动移动到可见范围，设置该选项可以避免自动滚动
 */
Q.Graph.prototype.focus = function (withoutScroll) {};
/**
 * 延迟调用，在画布下次绘制时调用
 * @param {Function} call 回调函数
 * @param {Object} [scope] 作用域
 * @param {Number} delay 延迟时间
 */
Q.Graph.prototype.callLater = function (call, scope, delay) {};
/**
 * 将画布导出成图片，返回图片数据（字符串）和图片宽高
 * @see HTMLCanvasElement#toDataURL
 * @param {Number} scale 缩放比例
 * @param {Rect} clipBounds 导出范围
 * @returns {Object} {data: imageData, width: imageWidth, height: imageHeight}
 */
Q.Graph.prototype.exportImage = function (scale, clipBounds) {};
/**
 * 设置当前选中图元，原来的选中信息会被清除
 * @param {Object} data 图元或者图元集合
 */
Q.Graph.prototype.setSelection = function (data) {};
/**
 * 增加选中图元
 * @param {Object} data 图元或者图元集合
 */
Q.Graph.prototype.select = function (data) {};
/**
 * 取消图元的选中状态
 * @param {Object} data 图元或者图元集合
 */
Q.Graph.prototype.unselect = function (data) {};
/**
 * 更改图元的选中状态，原来被选中的取消选中，原来不被选中的设置为被选中
 * @param {Q.Element} data
 */
Q.Graph.prototype.reverseSelect = function (data) {};
/**
 * 全选
 */
Q.Graph.prototype.selectAll = function () {};
/**
 * 清除图元的选中状态
 */
Q.Graph.prototype.unSelectAll = function () {};
/**
 * 清除图元的选中状态
 * @returns {Object}
 */
Q.Graph.prototype.unselectAll = function (){};
/**
 * 判断图元是否被选中
 * @param {Q.Element} element
 * @returns {Boolean}
 */
Q.Graph.prototype.isSelected = function (element) {};
/**
 * 将图元移到上层显示，默认点击选中图元时会调用此方法
 * @param {Q.Element} element
 */
Q.Graph.prototype.sendToTop = function (element) {};
/**
 * 置底显示
 * @param {Q.Element} element
 */
Q.Graph.prototype.sendToBottom = function (element) {};
/**
 * 移动图元，以及相关的图元，比如跟随节点，分组下面的连线，或者连线两端都移动时该连线也会被移动，保证相对位置的正确
 * @param {Array} elements 图元集合
 * @param {Number} dx x方向移动距离
 * @param {Number} dy y方向移动距离
 */
Q.Graph.prototype.moveElements = function (elements, dx, dy) {};
/**
 * 更改连线展开状态，两个节点间存在多条连线时，这组连线称为EdgeBundle(连线捆绑)，连线捆绑展开时，所有这些连线平行排列开，捆绑时，显示成一条连线的样子
 * @param {Edge} edge 连线捆绑中的一条连线
 */
Q.Graph.prototype.reverseExpanded = function (edge) {};
/**
 * 交互事件前，派发交互事件，通常在交互动作之前调用此方法，如果返回false，表示停止事件动作的执行
 * @example
 *      var interactionEvent = new InteractionEvent(graph, InteractionEvent.ELEMENT_MOVE_START, evt, this.currentDraggingElement, this.draggingElements);
 *      if(graph.beforeInteractionEvent(interactionEvent) === false){
 *          this.destroy();
 *          return;
 *      }
 *      graph.onInteractionEvent(interactionEvent);
 * @see Q.Dispatcher#beforeEvent
 * @see Q.Graph#interactionDispatcher
 * @param {Event} event
 * @returns {Boolean} 是否停止事件执行 如果返回false，表示停止事件动作的执行
 */
Q.Graph.prototype.beforeInteractionEvent = function (event) {};
/**
 * 交互事件发生时，派发事件
 * @see Q.Dispatcher#onEvent
 * @see Q.Graph#interactionDispatcher
 * @param {Event} event
 */
Q.Graph.prototype.onInteractionEvent = function (event) {};
/**
 * 添加用户交互
 * @example
 * graph.addCustomInteraction({
 *  onmousedown: function(evt, graph){
 *      Q.log("mousedown");
 *  }});
 * @param {Object} interaction 交互监听器
 */
Q.Graph.prototype.addCustomInteraction = function (interaction) {};
/**
 * 是否启用鼠标滚轮缩放，默认为true，对于移动平台无效
 * @type Boolean
 */
Q.Graph.prototype.enableWheelZoom = {};
/**
 * 是否启用提示信息，默认为true
 * @see Q.Graph#getTooltip
 * @type Boolean
 */
Q.Graph.prototype.enableTooltip = {};
/**
 * 获取图元的提示文本，支持HTML格式，默认取图元的tooltip或者name属性
 * @see Q.Graph#enableTooltip
 * @param {Q.Element} element
 * @returns {String}
 */
Q.Graph.prototype.getTooltip = function (element) {};
/**
 * 更新画布视口，当画布所在的HTML元素尺寸发生变化时，通常画布大小也需要做调整，以布满整个容器，这时可以调用此方法，默认在网页窗口变化时会自动调用此方法
 * @example
 * Q.addEventListener(window, "resize", function(evt) {
 *      this.updateViewport();
 *  }, false, graph);
 */
Q.Graph.prototype.updateViewport = function () {};
/**
 * 销毁画布，删除graph组件时，调用此方法可以移除鼠标键盘或者触控监听，移除孩子节点等，释放内存
 */
Q.Graph.prototype.destroy = function () {};
/**
 * 画布属性发生变化
 * @param {String} type
 * @param {Object} listener
 * @param {Object} scope
 */
Q.Graph.prototype.onPropertyChange = function (type, listener, scope) {};
/**
 * 删除选中图元
 */
Q.Graph.prototype.removeSelection = function () {};
/**
 * 通过界面交互删除选中图元
 * @param {MouseEvent} evt
 */
Q.Graph.prototype.removeSelectionByInteraction = function (evt){};
/**
 * 通过界面交互创建多边形，在创建多边形交互模式下时，会回调此函数
 * @see Q.Consts.INTERACTION_MODE_CREATE_SHAPE
 * @param {Object} evt
 * @param {Array} pathSegments
 * @param {Number} x
 * @param {Number} y
 * @returns {Q.ShapeNode}
 */
Q.Graph.prototype.createShapeByInteraction = function (evt, pathSegments, x, y){};
/**
 * 通过界面交互创建线条，在创建多线段交互模式下时，会回调此函数
 * @see Q.Consts.INTERACTION_MODE_CREATE_LINE
 * @param {Object} evt
 * @param {Array} pathSegments
 * @param {Number} x
 * @param {Number} y
 * @returns {Q.ShapeNode}
 */
Q.Graph.prototype.createLineByInteraction = function (evt, pathSegments, x, y){};
/**
 * 通过界面交互创建连线
 * @param {Q.Point} start
 * @param {Q.Point} end
 * @param {MouseEvent} evt
 * @param {Q.Path} pathSegments
 * @returns {Q.Edge}
 */
Q.Graph.prototype.createEdgeByInteraction = function (start, end, evt, pathSegments){};
/**
 * 图元通过界面交互被创建时，会回调此函数
 * @param {Q.Element} element
 * @param {MouseEvent} evt 交互鼠标或者触控事件
 */
Q.Graph.prototype.onElementCreated = function (element, evt, dragInfo){};
/**
 * 开始文本编辑
 * @param {Object} element 当前编辑的图元
 * @param {Object} label 当前点击的文本组件（LabelUI）
 * @param {Object} labelEditor 文本编辑器
 * @param {Object} xy 当前鼠标点位置
 */
Q.Graph.prototype.startLabelEdit = function (element, label, labelEditor, xy){};
/**
 * 文本编辑提交时调用此函数，用于设置文本信息
 * @param {Q.Element} element
 * @param {Q.LabelUI} label
 * @param {string} text
 * @param {Q.ElementUI} elementUI
 */
Q.Graph.prototype.onLabelEdit = function (element, label, text, elementUI){};
/**
 * 设置当前交互模式，并传递定制的交互参数，在交互监听器中可以通过graph.interactionProperties来获取
 * @param {String} mode
 * @param {Array} interactionProperties
 */
Q.Graph.prototype.setInteractionMode = function (mode, interactionProperties){};
/**
 * 返回上层子网
 * @returns {Object}
 */
Q.Graph.prototype.upSubNetwork = function (){};
/**
 * 无效图元的可见状态，切换子网时，系统内部会调用此方法，以便重新确定图元的可见状态
 * @returns {Object}
 */
Q.Graph.prototype.invalidateVisibility = function (){};
/**
 * 可见过滤器
 * @type Function
 */
Q.Graph.prototype.visibleFilter = {};
/**
 * 拓扑图属性变化事件派发器
 * @type Q.Dispatcher
 */
Q.Graph.prototype.propertyChangeDispatcher = {};
/**
 * 网元集合变化事件派发器
 * @type Q.Dispatcher
 */
Q.Graph.prototype.listChangeDispatcher = {};
/**
 * 网元属性变化事件派发器
 * @type Q.Dispatcher
 */
Q.Graph.prototype.dataPropertyChangeDispatcher = {};
/**
 * 选中变化事件派发器
 * @type Q.Dispatcher
 */
Q.Graph.prototype.selectionChangeDispatcher = {};
/**
 * 父亲节点变化事件派发器
 * @type Q.Dispatcher
 */
Q.Graph.prototype.parentChangeDispatcher = {};
/**
 * 孩子节点层次变化事件派发器
 * @type Q.Dispatcher
 */
Q.Graph.prototype.childIndexChangeDispatcher = {};
/**
 * 交互事件派发器，通过这个派发器可以监听交互事件
 * @type Q.Dispatcher
 */
Q.Graph.prototype.interactionDispatcher = {};
/**
 *样式列表
 * @type Object
 */
Q.Graph.prototype.styles = {};
/**
 * 图元管理容器
 * @type Q.GraphModel
 */
Q.Graph.prototype.graphModel = {};
/**
 * 当前子网
 * @type Q.Element
 */
Q.Graph.prototype.currentSubNetwork = {};
/**
 * 基本UI类，是其他UI类的基类
 * @constructor
 * @param {Object} data 对应的数据元素对象，比如一个NodeUI对象对应一个Node对象，这个Node对象就是这个UI类的数据对象
 */
Q.BaseUI = function (data) {};
/**
 * 无效 UI组件
 * @returns {Object}
 */
Q.BaseUI.prototype.invalidate = function (){};
/**
 * 边框颜色
 * @type String
 */
Q.BaseUI.prototype.borderColor = {};
/**
 * 边框虚线样式
 * @type null
 */
Q.BaseUI.prototype.borderLineDash = {};
/**
 * 边框虚线偏移量
 * @type null
 */
Q.BaseUI.prototype.borderLineDashOffset = {};
/**
 * 是否同步选中状态，既父容器被选中则自己也被选中，默认为true
 * @type boolean
 */
Q.BaseUI.prototype.syncSelection = {};
/**
 * 是否同步选中样式，与父容器的选中样式相同，默认为true
 * @type boolean
 */
Q.BaseUI.prototype.syncSelectionStyles = {};
/**
 * 设置组件的测量范围
 * @param {Number} w
 * @param {Number} h
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 */
Q.BaseUI.prototype.setMeasuredBounds = function (w, h, x, y) {};
/**
 * 组件初始化
 */
Q.BaseUI.prototype.initialize = function () {};
/**
 * 测量组件，在此方法中计算组件的大小和范围
 * @see {@link Q.BaseUI#invalidateSize}
 */
Q.BaseUI.prototype.measure = function () {};
/**
 * 组件绘制，此函数中无需考虑组件的位置，偏移和旋转情况，系统内部已经做了坐标转换，只需要实现绘制逻辑
 * @param {CanvasRenderingContext2D} g 绘制画笔
 * @param {Number} scale 画布缩放比例
 * @param {Boolean} [selected=false] 是否绘制选中效果
 */
Q.BaseUI.prototype.draw = function (g, scale, selected, selectionStyles) {};
/**
 * 无效组件数据，调用此方法后，组件将重新计算大小和相关样式信息
 * @see {@link Q.BaseUI#invalidateSize}
 * @see {@link Q.BaseUI#invalidateRender}
 */
Q.BaseUI.prototype.invalidateData = function () {};
/**
 * 无效组件大小，调用此方法会使组件重绘，并在生效阶段重新计算组件大小
 * @see {@link Q.BaseUI#measure}
 * @see {@link Q.BaseUI#invalidateRender}
 */
Q.BaseUI.prototype.invalidateSize = function () {};
/**
 * 无效组件，调用此方法，表示组件需要重绘
 * @see {@link Q.BaseUI#validate}
 */
Q.BaseUI.prototype.invalidateRender = function () {};
/**
 * 生效函数
 * @returns {Object}
 */
Q.BaseUI.prototype.doValidate = function (){};
/**
 * 生效组件，完成组件的测量等，在画布重绘阶段，如果该组件处于无效状态，系统会自动调用组件的此方法
 */
Q.BaseUI.prototype.validate = function () {};
/**
 * 数据对象变化时，回调此函数
 * @param {Object} data
 * @param {Object} oldData
 */
Q.BaseUI.prototype.onDataChanged = function (data, oldData) {};
/**
 * 获取组件范围
 * @returns {Object}
 */
Q.BaseUI.prototype.getBounds = function () {};
/**
 * 销毁
 * @returns {Object}
 */
Q.BaseUI.prototype.destroy = function (){};
/**
 * UI组件对应的数据对象
 * @type Object
 */
Q.BaseUI.prototype.data = {};
/**
 * 父节点
 * @type Q.BaseUI
 */
Q.BaseUI.prototype.parent = {};
/**
 * 图元组件，对应的数据对象为{@link Q.Element}
 * @constructor
 * @extends Q.BaseUI
 * @param {Q.Element} data
 * @param {Q.Graph} graph 画布组件
 */
Q.ElementUI = function (data, graph) {};
Q.ElementUI.prototype = new Q.BaseUI();
/**
 * 图元组件所在的画布容器
 * @type Q.Graph
 */
Q.ElementUI.prototype.graph = {};
/**
 * 添加孩子组件
 * @param {Q.BaseUI} child
 * @param {int} index 序号
 */
Q.ElementUI.prototype.addChild = function (child, index) {};
/**
 * 删除孩子组件
 * @param {Q.BaseUI} child
 * @returns {Object}
 */
Q.ElementUI.prototype.removeChild = function (child) {};
/**
 * 获取图元属性
 * @param {String} propertyName
 * @param {Object} propertyType 图元属性默认有三种：accessor, style, client
 * @see Q.Consts.PROPERTY_TYPE_ACCESSOR
 * @see Q.Consts.PROPERTY_TYPE_STYLE
 * @see Q.Consts.PROPERTY_TYPE_CLIENT
 * @returns {Object}
 */
Q.ElementUI.prototype.getProperty = function (propertyName, propertyType) {};
/**
 * 获取样式属性
 * @param {String} styleName
 * @returns {Object}
 */
Q.ElementUI.prototype.getStyle = function (styleName) {};
/**
 * 如果组件已经初始化，则在数据元素的属性发生变化时，系统会调用此方法，
 * @param {Q.Event} evt 属性变化事件
 */
Q.ElementUI.prototype.onPropertyChange = function (evt) {};
/**
 * 文本标签组件，图元组件默认由一个主体和一个文本标签组合而成
 * @type Q.Label
 */
Q.ElementUI.prototype.label = {};
/**
 * 初始化文本标签
 * @returns {Object}
 */
Q.ElementUI.prototype.initLabel = function () {};
/**
 * 添加数据绑定
 * @example 例如绑定图元的name属性到label组件的data属性，
 * this.addBinding(this.label, {
                    property : "name",//图元的"name"属性
                    bindingProperty : "data"//绑定到label组件的"data"属性
                });
 * @param {Q.BaseUI} ui
 * @param {Object} bindingProperty
 */
Q.ElementUI.prototype.addBinding = function (ui, bindingProperty) {};
/**
 * 无效图元 UI 中的子 UI 次序
 * @returns {Object}
 */
Q.ElementUI.prototype.invalidateChildrenIndex = function (){};
/**
 * 使孩子组件生效
 * @returns {boolean} 组件范围是否变化
 */
Q.ElementUI.prototype.validateChildren = function () {};
/**
 * 图元的主体范围
 * @type null
 */
Q.ElementUI.prototype.bodyBounds = {};
/**
 * 图元组件主体
 * @type Q.BaseUI
 */
Q.ElementUI.prototype.body = {};
/**
 * 节点组件
 * @constructor
 * @extends Q.ElementUI
 * @param {Q.Node} node
 * @param {Q.Graph} graph 画布组件
 */
Q.NodeUI = function (node, graph) {};
/**
 * 连线组件
 * @constructor
 * @extends Q.ElementUI
 * @param {Q.Edge} edge
 * @param {Q.Graph} graph
 */
Q.EdgeUI = function (edge, graph){};
Q.EdgeUI.prototype = new Q.ElementUI();
/**
 * 图形组件，是连线的主体
 * @type Q.ShapeUI
 */
Q.EdgeUI.prototype.shape = {};
/**
 * 连线路径
 * @type Q.Path
 */
Q.EdgeUI.prototype.path = {};
/**
 * 生效连线路径片段
 * @returns {Object}
 */
Q.EdgeUI.prototype.validatePoints = function () {};
/**
 * 绘制连线自环
 * @param {Q.Path} path
 * @param {Q.NodeUI} fromUI
 * @param {String} edgeType
 * @param {Q.Rect} bounds
 */
Q.EdgeUI.prototype.drawLoopedEdge = function (path, fromUI, edgeType, bounds){};
/**
 * 绘制连线
 * @param {Q.Path} path
 * @param {Q.NodeUI} fromUI
 * @param {Q.NodeUI} toUI
 * @param {String} edgeType
 * @param {Q.Rect} fromBounds
 * @param {Q.Rect} toBounds
 */
Q.EdgeUI.prototype.drawEdge = function (path, fromUI, toUI, edgeType, fromBounds, toBounds){};
/**
 * 检查连线捆绑文本
 * @returns {Object}
 */
Q.EdgeUI.prototype.checkBundleLabel = function (){};
/**
 * 创建连线捆绑文本
 * @returns {Object}
 */
Q.EdgeUI.prototype.createBundleLabel = function (){};
/**
 * 获取连线捆绑文本
 * @returns {Object}
 */
Q.EdgeUI.prototype.getBundleLabel = function (){};
/**
 * 连线长度
 * @type number
 */
Q.EdgeUI.prototype.length = {};
/**
 * 绘制参考线
 * @static
 * @param {Object} g
 * @param {Object} start
 * @param {Object} end
 * @param {Object} type
 * @returns {Object}
 */
Q.EdgeUI.drawReferenceLine = function (g, start, end, type){};
/**
 * 文本标签组件
 * @constructor
 * @extends Q.BaseUI
 * @param {Object} data
 */
Q.LabelUI = function (data) {};
Q.LabelUI.prototype = new Q.BaseUI();
/**
 * 字体大小
 * @type number
 */
Q.LabelUI.prototype.fontSize = {};
/**
 * 字体名称
 * @type String
 */
Q.LabelUI.prototype.fontFamily = {};
/**
 * 字体样式
 * @type String
 */
Q.LabelUI.prototype.fontStyle = {};
/**
 * 字体颜色
 * @type null
 */
Q.LabelUI.prototype.color = {};
/**
 * 文本对齐方式
 * @type Q.Position
 */
Q.LabelUI.prototype.alignPosition = {};
/**
 * 字体
 * @type string
 */
Q.LabelUI.prototype.font = {};
/**
 * 图片组件，支持栅格图片如：png, jpg, gif(不支持动画)，或者图形对象{@link Q.Path}，或者是任意实现了{@link Q.IDrawable}接口的对象
 * @see {@link Q.Node#image}
 * @see {@link Q.NodeUI#image}
 * @constructor
 * @extends Q.BaseUI
 * @param {Q.Graph} graph
 */
Q.ImageUI = function (data) {};
Q.ImageUI.prototype = new Q.BaseUI();
/**
 * 描边样式
 * @type String
 */
Q.ImageUI.prototype.strokeStyle = {};
/**
 * 填充颜色
 * @type String
 */
Q.ImageUI.prototype.fillColor = {};
/**
 * 填充渐变
 * @type Q.Gradient
 */
Q.ImageUI.prototype.fillGradient = {};
/**
 * 尺寸生效，用于ImageUI的size属性的生效
 * @returns {Object}
 */
Q.ImageUI.prototype.validateSize = function () {};
/**
 * 组件范围发生变化时，回调此函数
 * @returns {Object}
 */
Q.ImageUI.prototype.onBoundsChanged = function () {};
/**
 * 图片原始尺寸
 * @type Q.Rect
 */
Q.ImageUI.prototype.originalBounds = {};
/**
 * 图形列表
 * @namespace
 * @type object
 * @static
 */
Q.Shapes = {};
/**
 * 注册图形
 * @static
 * @param {String} name
 * @param {(Function|Q.Path)} shapeGenerator 图形对象或者图形生成器(Function(x, y, width, height))
 */
Q.Shapes.register = function (name, shapeGenerator) {};
/**
 * 给定范围和描边宽度，获取图形对象
 * @static
 * @param {String} name
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Number} lineWidth
 * @returns {Q.Path}
 */
Q.Shapes.getShape = function (name, x, y, width, height, lineWidth) {};
/**
 * 获取矩形
 * @static
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Number} rx
 * @param {Number} ry
 * @returns {Q.Path}
 */
Q.Shapes.getRect = function (x, y, width, height, rx, ry, path){};
/**
 * 获取所有的图形
 * @static
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} lineWidth
 * @returns {Array}
 */
Q.Shapes.getAllShapes = function (x, y, width, height, lineWidth){};
/**
 * 创建正多边形
 * @static
 * @param {int} number 多边形数量
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {number} angle
 * @returns {Q.Path}
 */
Q.Shapes.createRegularShape = function (number, cx, cy, r, angle) {};
/**
 * 图形路径
 * @constructor
 * @param {Array} segments 路径片段集合
 */
Q.Path = function (segments) {};
/**
 * 导出 JSON
 * @returns {Object}
 */
Q.Path.prototype.toJSON = function (){};
/**
 * 解析 JSON
 * @param {Object} json
 */
Q.Path.prototype.parseJSON = function (json){};
/**
 * 清空路径
 */
Q.Path.prototype.clear = function () {};
/**
 * 移动画笔
 * @see CanvasRenderingContext2D#moveTo
 * @param {Number} x
 * @param {Number} y
 */
Q.Path.prototype.moveTo = function (x, y) {};
/**
 * 画线
 * @see CanvasRenderingContext2D#lineTo
 * @param {Number} x
 * @param {Number} y
 */
Q.Path.prototype.lineTo = function (x, y) {};
/**
 * 二次贝塞尔曲线
 * @see CanvasRenderingContext2D#quadraticCurveTo
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
Q.Path.prototype.quadTo = function (x1, y1, x2, y2) {};
/**
 * 三次贝塞尔曲线
 * @see CanvasRenderingContext2D#bezierCurveTo
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 */
Q.Path.prototype.curveTo = function (x1, y1, x2, y2, x3, y3) {};
/**
 * 弧线，不支持Opera
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} radius
 */
Q.Path.prototype.arcTo = function (x1, y1, x2, y2, radius) {};
/**
 * 闭合路径
 * @see CanvasRenderingContext2D#closePath
 */
Q.Path.prototype.closePath = function () {};
/**
 * 线条端点样式
 * @type string
 */
Q.Path.prototype.lineCap = {};
/**
 * 线条连接点样式
 * @type string
 */
Q.Path.prototype.lineJoin = {};
/**
 * 绘制图形
 * @param {CanvasRenderingContext2D} g
 * @param {Number} scale
 * @param {Object} params 绘制参数，包含描边宽度，填充色，渐变等信息
 * @param {Boolean} selected
 */
Q.Path.prototype.draw = function (g, scale, params, selected, selectionStyles){};
/**
 * 生效
 */
Q.Path.prototype.validate = function () {};
/**
 * 获得路径范围
 * @param {Number} lineWidth 描边宽度
 * @returns {Q.Rect}
 */
Q.Path.prototype.getBounds = function (lineWidth, bounds) {};
/**
 * 生成指定范围和线宽的图形
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Number} lineWidth
 * @returns {Q.Path}
 */
Q.Path.prototype.generator = function (x, y, width, height, lineWidth) {};
/**
 * 沿路径方向，获取路径上点的位置
 * @param {Number} x
 * @param {Number} y
 * @returns {Q.Point} 位置中包含方向信息
 */
Q.Path.prototype.getLocation = function (x, y){};
/**
 * 渐变
 * @constructor
 * @param {String} type 渐变类型
 * @param {Array} colors 渐变颜色
 * @param {Array} [positions] 颜色位置
 * @param {Number} [angle] 旋转角度
 */
Q.Gradient = function (type, colors, positions, angle, tx, ty){};
/**
 * 渐变类型
 * @see Q.Consts.GRADIENT_TYPE_RADIAL
 * @see Q.Consts.GRADIENT_TYPE_LINEAR
 * @type String
 */
Q.Gradient.prototype.type = {};
/**
 * 渐变颜色
 * @type Array
 */
Q.Gradient.prototype.colors = {};
/**
 * 渐变位置集合，位置数值为0 - 1
 * @type Array
 */
Q.Gradient.prototype.positions = {};
/**
 * 旋转角度
 * @type number
 */
Q.Gradient.prototype.angle = {};
/**
 * 渐变偏移量
 * @type number
 */
Q.Gradient.prototype.tx = {};
/**
 * 渐变偏移量
 * @type number
 */
Q.Gradient.prototype.ty = {};
/**
 * 渐变位置
 * @see Q.Position
 * @type Q.Position
 */
Q.Gradient.prototype.position = {};
/**
 * 渐变颜色是否为空
 * @returns {Boolean}
 */
Q.Gradient.prototype.isEmpty = function () {};
/**
 * 根据范围，生成渐变信息
 * @param {Q.Rect} bounds
 * @returns {String} 渐变填充文本
 */
Q.Gradient.prototype.generatorGradient = function (bounds){};
/**
 * 垂直线性渐变
 * @static
 * @type Q.Gradient
 */
Q.Gradient.LINEAR_GRADIENT_VERTICAL = {};
/**
 * 水平线性渐变
 * @static
 * @type Q.Gradient
 */
Q.Gradient.LINEAR_GRADIENT_HORIZONTAL = {};
/**
 * 径向渐变
 * @static
 * @type Q.Gradient
 */
Q.Gradient.RADIAL_GRADIENT = {};
/**
 * 彩虹线性渐变
 * @static
 * @type Q.Gradient
 */
Q.Gradient.RAINBOW_LINEAR_GRADIENT = {};
/**
 * 垂直彩虹线性渐变
 * @static
 * @type Q.Gradient
 */
Q.Gradient.RAINBOW_LINEAR_GRADIENT_VERTICAL = {};
/**
 * 彩虹径向渐变
 * @static
 * @type Q.Gradient
 */
Q.Gradient.RAINBOW_RADIAL_GRADIENT = {};
/**
 * 交互事件
 * @constructor
 * @extends Q.Event
 * @param {Q.Graph} graph
 * @param {String} kind
 * @param {Object} event 原始事件
 * @param {Object} data
 * @param {Object} datas
 */
Q.InteractionEvent = function (graph, kind, event, data, datas) {};
Q.InteractionEvent.prototype = new Q.Event();
/**
 * 开始移动
 * @static
 * @type string
 */
Q.InteractionEvent.ELEMENT_MOVE_START = {};
/**
 * 网元移动中
 * @static
 * @type string
 */
Q.InteractionEvent.ELEMENT_MOVING = {};
/**
 * 网元移动完成
 * @static
 * @type string
 */
Q.InteractionEvent.ELEMENT_MOVE_END = {};
/**
 * 创建图元交互事件类型
 * @static
 * @type string
 */
Q.InteractionEvent.ELEMENT_CREATED = {};
/**
 * 删除图元交互事件类型
 * @static
 * @type string
 */
Q.InteractionEvent.ELEMENT_REMOVED = {};
/**
 * 拐点变化开始事件
 * @static
 * @type string
 */
Q.InteractionEvent.POINT_MOVE_START = {};
/**
 * 拐点编辑事件
 * @static
 * @type string
 */
Q.InteractionEvent.POINT_MOVING = {};
/**
 * 拐点编辑结束事件
 * @static
 * @type string
 */
Q.InteractionEvent.POINT_MOVE_END = {};
/**
 * 节点大小调整开始事件
 * @static
 * @type string
 */
Q.InteractionEvent.RESIZE_START = {};
/**
 * 节点大小调整事件
 * @static
 * @type string
 */
Q.InteractionEvent.RESIZING = {};
/**
 * 节点大小调整结束事件
 * @static
 * @type string
 */
Q.InteractionEvent.RESIZE_END = {};
/**
 * 连线捆绑交互
 * @static
 * @type string
 */
Q.InteractionEvent.EDGE_BUNDLE = {};
/**
 * 开始框选
 * @static
 * @type string
 */
Q.InteractionEvent.SELECT_START = {};
/**
 * 框选网元中
 * @static
 * @type string
 */
Q.InteractionEvent.SELECT_BETWEEN = {};
/**
 * 框选完成
 * @static
 * @type string
 */
Q.InteractionEvent.SELECT_END = {};
/**
 * 长按事件
 * @static
 * @type string
 */
Q.InteractionEvent.LONG_CLICK = {};
/**
 * 图元对象
 * @constructor
 * @extends Q.Data
 * @param {String} name 名称
 */
Q.Element = function (name){};
Q.Element.prototype = new Q.Data();
/**
 * 获取样式属性
 * @param {String} name
 * @returns {Object}
 */
Q.Element.prototype.getStyle = function (name){};
/**
 * 设置样式属性
 * @param {String} name
 * @param {Object} value
 */
Q.Element.prototype.setStyle = function (name, value){};
/**
 * 设置多个样式属性
 * @param {Object} styles
 * @param {Boolean} silent 不派发属性变化事件
 */
Q.Element.prototype.putStyles = function (styles, silent){};
/**
 * 无效可见状态
 * @param {Boolean} onlySelf 是否只对自己无效，默认会对下面的孩子设置无效
 */
Q.Element.prototype.invalidateVisibility = function (onlySelf){};
/**
 * 设置图元无效，用于刷新界面
 */
Q.Element.prototype.invalidate = function (){};
/**
 * 挂载UI组件到图元组件{@link Q.ElementUI}
 * @param {Q.BaseUI} ui
 * @param {Object} bindingProperties 绑定信息
 * @example
 * var node = graph.createNode("node");
 * var label2 = new Q.LabelUI();
 node.addUI(label2, [{
					property : "label2",
					propertyType : Q.Consts.PROPERTY_TYPE_CLIENT,
					bindingProperty : "data"
				}, {
					property : "label2.color",
					propertyType : Q.Consts.PROPERTY_TYPE_CLIENT,
					bindingProperty : "color"
				}]);
 node.set("label2", "another label");
 node.set("label2.color", Colors.blue);
 */
Q.Element.prototype.addUI = function (ui, bindingProperties){};
/**
 * 删除UI组件
 * @param {Object} ui
 * @returns {Object}
 */
Q.Element.prototype.removeUI = function (ui){};
/**
 * 类型，内部使用
 * @type string
 */
Q.Element.prototype.type = {};
/**
 * 对应的图元UI类型（Q.Element）
 * @type Function
 */
Q.Element.prototype.uiClass = {};
/**
 * 图元名称
 * @type String
 */
Q.Element.prototype.name = {};
/**
 * 网元层次
 * @type int
 */
Q.Element.prototype.zIndex = {};
/**
 * 激活为子网类型，任何图元都可以作为子网类型，设置为子网类型时，当设置画布当前子网为此图元时，画布显示该图元下面的孩子图元
 * @type boolean
 */
Q.Element.prototype.enableSubNetwork = {};
/**
 * 图元绑定的所有子 UI 对象
 * @type null
 */
Q.Element.prototype.bindingUIs = {};
/**
 * 图元样式表
 * @type null
 */
Q.Element.prototype.styles = {};
/**
 * 节点图元，可以设置图片，图形，挂载其他UI组件，对应的UI类为NodeUI
 * @param {type} name 名称
 * @extends Q.Element
 * @constructor
 */
Q.Node = function (name, x, y) {};
Q.Node.prototype = new Q.Element();
/**
 * 遍历所有与该节点相连的连线或者代理连线
 * @param {type} call
 * @param {type} scope
 * @param {Boolean} selfEdgeOnly
 * @returns {undefined}
 */
Q.Node.prototype.forEachEdge = function (call, scope, noLoop) {};
/**
 * 遍历所有从此节点连出去的连线
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Boolean} [selfEdgeOnly] 只考虑直接相连的连线，不遍历代理连线
 */
Q.Node.prototype.forEachOutEdge = function (call, scope) {};
/**
 * 遍历所有连向此节点的连线
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 * @param {Boolean} [selfEdgeOnly] 只考虑直接相连的连线，不遍历代理连线
 */
Q.Node.prototype.forEachInEdge = function (call, scope, selfEdgeOnly) {};
/**
 * 获取所有连线
 * @returns {Array}
 */
Q.Node.prototype.getEdges = function (){};
/**
 * 是否有连入的连线
 * @param {Boolean} [selfEdgeOnly] 只考虑直接相连的连线，不遍历代理连线
 * @returns {Boolean}
 */
Q.Node.prototype.hasInEdge = function () {};
/**
 * 是否有连出去的连线
 * @param {Boolean} [selfEdgeOnly] 只考虑直接相连的连线，不遍历代理连线
 * @returns {Boolean}
 */
Q.Node.prototype.hasOutEdge = function () {};
/**
 * 是否有连线与此节点相连
 * @param {Boolean} [selfEdgeOnly] 只考虑直接相连的连线，不遍历代理连线
 * @returns {Boolean}
 */
Q.Node.prototype.hasEdge = function () {};
/**
 * 与指定节点之间是否有连线
 * @param {Q.Node} node
 * @returns {Boolean}
 */
Q.Node.prototype.hasEdgeWith = function (node){};
/**
 * 是否有自环连线
 * @returns {boolean}
 */
Q.Node.prototype.hasLoops = function (){};
/**
 * 获取两节点之间的连线捆绑
 * @param {Q.Node} node 另一个节点
 * @returns {Q.EdgeBundle}
 */
Q.Node.prototype.getEdgeBundle = function (node) {};
/**
 * 设置节点位置
 * @see {@link Q.Node#location}
 * @param {Number} x
 * @param {Number} y
 */
Q.Node.prototype.setLocation = function (x, y) {};
/**
 * 添加跟随者，节点拖动时，跟随者会随着宿主节点的移动而移动
 * @see {@link Q.Graph#moveElements}
 * @param {Q.Node} follower
 */
Q.Node.prototype.addFollower = function (follower) {};
/**
 * 删除跟随者
 * @param {Q.Node} follower
 */
Q.Node.prototype.removeFollower = function (follower) {};
/**
 * 是否有跟随者
 * @returns {Boolean}
 */
Q.Node.prototype.hasFollowers = function () {};
/**
 * 跟随者集合
 * @returns {Array}
 */
Q.Node.prototype.toFollowers = function () {};
/**
 * 清除跟随者
 */
Q.Node.prototype.clearFollowers = function () {};
/**
 * 获取跟随者序号
 * @param {Q.Node} follower
 * @returns {int}
 */
Q.Node.prototype.getFollowerIndex = function (follower) {};
/**
 * 设置跟随者序号
 * @param {Q.Node} child
 * @param {int} index 序号
 */
Q.Node.prototype.setFollowerIndex = function (child, index) {};
/**
 * 获取跟随者数量
 * @returns {int}
 */
Q.Node.prototype.getFollowerCount = function () {};
/**
 * 是否跟随指定节点
 * @param {Object} h
 * @returns {Object}
 */
Q.Node.prototype.isFollow = function (h){};
/**
 * 节点上的自环连线集合
 * @type Array
 */
Q.Node.prototype.loops = {};
/**
 * 与节点相连的连线数量
 * @type int
 */
Q.Node.prototype.edgeCount = {};
/**
 * 代理节点，当节点位于分组中时，如果分组闭合，则该分组为节点的代理节点
 * @type Q.Node
 */
Q.Node.prototype.agentNode = {};
/**
 * 宿主节点
 * @type Q.Node
 */
Q.Node.prototype.host = {};
/**
 * 节点位置
 * @type Q.Point
 */
Q.Node.prototype.location = {};
/**
 * 节点大小
 * @type Q.Size
 */
Q.Node.prototype.size = {};
/**
 * 节点图片
 * @see Q.ImageUI
 * @see Q.NodeUI
 * @type Object
 */
Q.Node.prototype.image = {};
/**
 * 节点旋转弧度
 * @type number
 */
Q.Node.prototype.rotate = {};
/**
 * 挂载点位置，默认为居中
 * @type {Q.Position}
 */
Q.Node.prototype.anchorPosition = {};
/**
 * 连线
 * @constructor
 * @extends Q.Element
 * @param {Q.Node} from 起始节点
 * @param {Q.Node} to 结束节点
 * @param {String} name
 */
Q.Edge = function (from, to, name) {};
Q.Edge.prototype = new Q.Element();
/**
 * 获取另一个节点
 * @param {Q.Node} node 节点
 * @returns {Q.Node} 另一个节点
 */
Q.Edge.prototype.otherNode = function (node) {};
/**
 * 连接连线
 */
Q.Edge.prototype.connect = function () {};
/**
 * 断开连线
 */
Q.Edge.prototype.disconnect = function () {};
/**
 * 连线是否连接
 * @returns {Boolean}
 */
Q.Edge.prototype.isConnected = function () {};
/**
 * 连线是否可用
 * @returns {Boolean}
 */
Q.Edge.prototype.isInvalid = function () {};
/**
 * 是否是自环（起始和结束端为同一节点）
 * @returns {Boolean}
 */
Q.Edge.prototype.isLooped = function () {};
/**
 * 获取连线捆绑
 * @param {Boolean} [byAgentNode] 代理节点的连线捆绑
 * @returns {Q.EdgeBundle}
 */
Q.Edge.prototype.getEdgeBundle = function (byAgentNode){};
/**
 * 是否存在连线绑定
 * @returns {boolean}
 */
Q.Edge.prototype.hasEdgeBundle = function (){};
/**
 * 是否有路径片段，如果设置路径，连线将按路径走向
 * @returns {Boolean}
 */
Q.Edge.prototype.hasPathSegments = function () {};
/**
 * 是否允许捆绑
 * @see {@link Q.Edge#hasPathSegments}
 * @see {@link Q.Edge#bundleEnabled}
 * @returns {Boolean} 是否允许捆绑，如果#hasPathSegments()返回false，#bundleEnabled属性为true，则返回true
 */
Q.Edge.prototype.isBundleEnabled = function () {};
/**
 * 连线拐点发生了变化
 * @param {Q.PathSegment} value
 */
Q.Edge.prototype.firePathChange = function (value){};
/**
 * 添加路径片段
 * @param {Array} points
 * @param {String} type
 * @param {int} index
 */
Q.Edge.prototype.addPathSegement = function (points, type, index){};
/**
 * 根据片段位置，删除路径片段
 * @param {int} index
 */
Q.Edge.prototype.removePathSegementByIndex = function (index){};
/**
 * 删除路径片段
 * @param {Object} pathSegment
 * @returns {Object}
 */
Q.Edge.prototype.removePathSegement = function (pathSegment){};
/**
 * 移动路径片段
 * @param {number} dx
 * @param {number} dy
 * @param {int} index
 */
Q.Edge.prototype.movePathSegment = function (dx, dy, index){};
/**
 * 连线路径片段
 * @type Q.HashList
 */
Q.Edge.prototype.pathSegments = {};
/**
 * 起始端节点
 * @type Q.Node
 */
Q.Edge.prototype.from = {};
/**
 * 结束端节点
 * @type Q.Node
 */
Q.Edge.prototype.to = {};
/**
 * 起始端代理节点
 * @type Q.Node
 */
Q.Edge.prototype.fromAgent = {};
/**
 * 结束端代理节点
 * @type Q.Node
 */
Q.Edge.prototype.toAgent = {};
/**
 * 连线类型
 * @see Q.Consts.EDGE_TYPE_***
 * @type String
 */
Q.Edge.prototype.edgeType = {};
/**
 * 是否允许捆绑，默认为true
 * @type Boolean
 */
Q.Edge.prototype.bundleEnabled = {};
/**
 * 连线角度，在连线与总线相连时，连线可根据指定角度走向
 * @type number
 */
Q.Edge.prototype.angle = {};
/**
 * 图元容器，用于存放和管理图形元素
 * @constructor
 * @extends Q.DataModel
 */
Q.GraphModel = function (){};
Q.GraphModel.prototype = new Q.DataModel();
/**
 * 遍历所有的节点
 * @param {Function} call 回调函数
 * @param {Object} [scope] 函数作用域
 */
Q.GraphModel.prototype.forEachNode = function (call, scope){};
/**
 * 图元容器由连接关系构成一个图，按图的深度遍历
 * @param {Function} call 回调函数
 * @param {Object} scope 回调函数作用域
 * @param {boolean} postOrder 是否采用后序遍历
 */
Q.GraphModel.prototype.forEachByTopoDepthFirstSearch = function (call, scope, postOrder, undirected){};
/**
 * 图元容器由连接关系构成一个图，按图的广度遍历
 * @param {Object} call
 * @param {Object} scope
 * @param {Object} postOrder
 * @returns {Object}
 */
Q.GraphModel.prototype.forEachByTopoBreadthFirstSearch = function (call, scope, postOrder, undirected){};
/**
 * 连线捆绑，包含所有两节点之间相连的连线
 * @constructor
 * @param {Q.Node} node1 一个节点
 * @param {Q.Node} node2 另一个节点
 */
Q.EdgeBundle = function (node1, node2) {};
/**
 * 节点一
 * @type Q.Node
 */
Q.EdgeBundle.prototype.node1 = {};
/**
 * 另一个节点
 * @type Q.Node
 */
Q.EdgeBundle.prototype.node2 = {};
/**
 * 代理连线
 * @type Q.Edge
 */
Q.EdgeBundle.prototype.agentEdge = {};
/**
 * 是否为空
 * @returns {Boolean}
 */
Q.EdgeBundle.prototype.isEmpty = function () {};
/**
 * 是否为正序，如果起始节点为node1, 结束节点为node2，则称为正序
 * @param {Q.Edge} edge
 * @returns {Boolean}
 */
Q.EdgeBundle.prototype.isPositiveOrder = function (edge) {};
/**
 * 是否可以捆绑
 * @returns {Boolean}
 */
Q.EdgeBundle.prototype.canBind = function () {};
/**
 * 获取间距
 * @param {Object} edge
 * @returns {Number}
 */
Q.EdgeBundle.prototype.getYOffset = function (edge) {};
/**
 * 更改展开状态
 */
Q.EdgeBundle.prototype.reverseExpanded = function () {};
/**
 * 可捆绑的连线集合
 * @type Array
 */
Q.EdgeBundle.prototype.bindableEdges = {};
/**
 * 是否为展开状态
 * @type Boolean
 */
Q.EdgeBundle.prototype.expanded = {};
/**
 * 树形布局
 * @constructor
 * @param {Q.Graph} graph
 * @extends Q.Layouter
 */
Q.TreeLayouter = function (graph) {};
Q.TreeLayouter.prototype = new Q.Layouter();
/**
 * 水平间距
 * @type number
 */
Q.TreeLayouter.prototype.hGap = {};
/**
 * 垂直间距
 * @type number
 */
Q.TreeLayouter.prototype.vGap = {};
/**
 * 层次之间的布局方向
 * @see Consts.DIRECTION_RIGHT
 * @see Consts.DIRECTION_BOTTOM
 * @type number
 */
Q.TreeLayouter.prototype.parentChildrenDirection = {};
/**
 * 布局类型，参考值：Q.Consts.LAYOUT_TYPE_***
 * @type string
 */
Q.TreeLayouter.prototype.layoutType = {};
/**
 * 节点图元的默认尺寸，在图形未初始化或者节点图片未被加载之前，系统无法获得节点图元的准确大小，这时会使用默认大小
 * @type Q.Size
 */
Q.TreeLayouter.prototype.defaultSize = {};
/**
 * 获取节点大小
 * @param {Q.Node} node 节点
 * @returns {Q.Size} 节点尺寸
 */
Q.TreeLayouter.prototype.getNodeSize = function (node){};
/**
 * 软件名称
 * @static
 * @type String
 */
Q.name = {};
/**
 * 关于Qunee for HTML5的说明信息
 * @static
 * @type String
 */
Q.about = {};
/**
 * 软件版权说明
 * @static
 * @type String
 */
Q.copyright = {};
/**
 * 设置css样式
 * @example
 * Q.css(document.body, {
 *  "background-color": Q.toColor(0xEE2898E0),
 *  "border": "1px solid #222222"
 *  "border-radius": "5px",
 * });
 * @static
 * @param {HTMLElement} el
 * @param {Object} props 样式属性
 */
Q.css = function (el, props) {};
/**
 * 图形绘制接口
 * @example 自定义节点图形为矩形
 * var customDraw = {
 *  width: 100,
 *  height: 100,
 *  draw: function(g, scale){
 *    g.beginPath();
 *    g.fillStyle = Q.toColor(0xCC2898E0);
 *    g.fillRect(0, 0, 100, 100);
 *  }
 * }
 * var node = graph.createNode("custom shape");
 * node.image = customDraw;
 * @static
 * @namespace
 * @type object
 */
Q.IDrawable = {};
/**
 * 绘制函数
 * @static
 * @param {CanvasRenderingContext2D} g
 * @param {Number} [scale]
 */
Q.IDrawable.draw = function (g, scale){};
