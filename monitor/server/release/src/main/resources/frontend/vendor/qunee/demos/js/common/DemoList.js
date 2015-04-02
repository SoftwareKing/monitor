/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
;
(function (Q, $) {
    var forEach = function (object, call, scope) {
        if (Array.isArray(object)) {
            return object.forEach(function (v) {
                call.call(this, v);
            }, scope);
        }
        for (var name in object) {
            call.call(scope, object[name], name);
        }
    }

    function DemoTree(items, parent) {
        this.itemMap = {};
        this.items = items;
        this.html = this._createNavTree(items);
        if (parent) {
            parent.appendChild(this.html);
        }
    }

    DemoTree.prototype = {
        itemMap: null,
        _createNavItem: function(name, item, parent) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            if (item.url) {
                a.setAttribute("target", "_blank");
                a.setAttribute("href", item.url);
            } else {
                a.setAttribute("href", "#" + name);
            }
            a.innerHTML = name;
            li.appendChild(a);
            a.appendChild(document.createElement("span"));
            li.data = item;

            if (item.status) {
                $(li).addClass(item.status);
            }
            item.parent = parent;
            item.dom = li;
            item.name = name;
            if (Q.isArray(item)) {
                var ul = this._createNavTree(item);
                li.appendChild(ul);
            }
            this.itemMap[name] = item;
            return li;
        },
        _createNavTree: function (list) {
            var ul = document.createElement("ul");
            $(ul).addClass("nav");
            forEach(list, function(item, name){
                ul.appendChild(this._createNavItem(name || item.name, item, name ? null : list));
            }, this);
            return ul;
        },
        forEachItem: function (call, scop) {

        }
    }

    Q.DemoTree = DemoTree;

})(Q, jQuery);