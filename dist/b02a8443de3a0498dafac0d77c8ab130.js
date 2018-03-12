// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({7:[function(require,module,exports) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.__esModule = true;
exports.invokeLaterStack = [];
// 根据vnode创建真实DOM元素
function createElement(node, isSVG) {
    var element = isSVG ? document.createElementNS('http://www.w3.org/2000/svg', node.name) : document.createElement(node.name);
    for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(createElement(child, isSVG));
        }
    }
    for (var name in node.props) {
        setELementProps(element, name, node.props[name], isSVG);
    }
    if (node.props && node.props.oncreate) {
        exports.invokeLaterStack.push(function () {
            return node.props.oncreate(element, node);
        });
    }
    if (node.context) {
        exports.invokeLaterStack.push(function () {
            return node.context.oncreate(element, node);
        });
    }
    return element;
}
exports.createElement = createElement;
// 当参数是个对象时，我们希望得到的是一个非引用对象。
function setELementProps(element, prop, value, isSVG, oldvalue) {
    if (prop !== 'key') {
        if (prop === 'style') {
            if (value === '' || value === null) {
                element.style.cssText = '';
            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                // 合并新老对象, 以新的对象为准，这样 当存在oldvalue属性不存在与value时，会被去除
                for (var key in copy(oldvalue, value)) {
                    element.style[key] = value[key] || '';
                }
            }
        } else if (typeof value === 'function' || prop in element && !isSVG) {
            element[prop] = value === null ? '' : value;
        } else if (value !== null && value !== false && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
            element.setAttribute(prop, value);
        } else if (value === null || value === false) {
            element.removeAttribute(prop);
        }
    }
}
exports.setELementProps = setELementProps;
function removeElement(parent, element, node) {
    function done() {
        parent.removeChild(removeChildren(element, node));
    }
    if (node.props && node.props.onremove) {
        // node.props.onremove(element, done)
        exports.invokeLaterStack.push(function () {
            return node.props.onremove(element, done);
        });
    } else {
        done();
    }
}
exports.removeElement = removeElement;
function removeChildren(element, node) {
    // 表示该vnode不是文本节点
    if (node.props || node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
            var childNode = node.children[i];
            if (typeof childNode !== 'string') {
                removeChildren(element.children[i], childNode);
            }
        }
        if (node.props && node.props.ondestroy) {
            // node.props.ondestroy(element)
            exports.invokeLaterStack.push(function () {
                return node.props.ondestroy(element);
            });
        }
    }
    return element;
}
exports.removeChildren = removeChildren;
function updateElement(element, props, oldProps, isSVG) {
    var hasUpdate = false;
    for (var name in copy(oldProps, props)) {
        var newValue = props[name];
        var oldValue = name === 'value' || name === 'checked' ? element[name] : oldProps[name];
        if (!isDeepEqual(newValue, oldValue)) {
            var change = setELementProps(element, name, props[name] === undefined ? null : props[name], isSVG, oldProps[name]);
            hasUpdate = true;
        }
    }
    if (hasUpdate) {
        // console.log('has update')
    }
    if (hasUpdate && props.onupdate) {
        exports.invokeLaterStack.push(function () {
            return props.onupdate(element, oldProps);
        });
    }
}
exports.updateElement = updateElement;
function getKey(node) {
    return node && node.props && node.props.key !== undefined ? node.props.key : null;
}
exports.getKey = getKey;
function copy(dest, target) {
    var val = {};
    for (var key in dest) {
        val[key] = dest[key];
    }
    for (var key in target) {
        val[key] = target[key];
    }
    return val;
}
exports.copy = copy;
// 忽略检测function Date  Regexp等引用类型。
function isDeepEqual(o1, o2) {
    if (toString.call(o1) !== toString.call(o2)) {
        return false;
    } else if (toString.call(o1) === '[object Array]') {
        var length = o1.length > o2.length ? o1.length : o2.length;
        for (var i = 0; i < length; i++) {
            var item1 = o1[i];
            var item2 = o2[i];
            if (isDeepEqual(item1, item2) === false) {
                return false;
            }
        }
        return true;
    } else if (toString.call(o1) === '[object Object]') {
        var keys = Object.keys(o1).concat(Object.keys(o2));
        for (var i = 0, l = keys.length; i < l; i++) {
            var item1 = o1[keys[i]];
            var item2 = o2[keys[i]];
            if (isDeepEqual(item1, item2) === false) {
                return false;
            }
        }
        return true;
    } else {
        // 忽略检测function Date  Regexp等引用类型。
        return o1 === o2;
    }
}
exports.isDeepEqual = isDeepEqual;
},{}],5:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
// 
var utils_1 = require("./utils");
function _wireStateToActions(path, state, actions, callback) {
    for (var key in actions) {
        typeof actions[key] === 'function' ? function (key, action) {
            actions[key] = function (data) {
                if (typeof (data = action(data)) === "function") {
                    data = data(state, actions);
                }
                if (data &&
                // data !== (state = getState(path, globalState)) && 可用某个类库来提供比较，比如 immutable.js
                !data.then // Promise
                ) {
                        callback(path, utils_1.copy(data));
                    }
                return utils_1.copy(state, data);
            };
        }(key, actions[key]) : _wireStateToActions(path.concat(key), state[key] || {}, actions[key], callback);
    }
}
exports._wireStateToActions = _wireStateToActions;
function wireStateToActions(globalState, globalActions, callback) {
    _wireStateToActions([], globalState, globalActions, function (path, newState) {
        if (setState(path, globalState, newState)) {
            callback(globalState);
        }
    });
}
exports["default"] = wireStateToActions;
function setState(path, root, state) {
    path = [].concat(path);
    var hasChange = false;
    if (path.length === 0) {
        for (var key in state) {
            if (root[key] !== state[key]) {
                root[key] = state[key];
                hasChange = true;
            }
        }
    } else {
        for (var i = 0; i < path.length - 1; i++) {
            root = root[path[i]];
        }
        for (var key in state) {
            var lastPathKey = path.pop();
            if (root[lastPathKey][key] !== state[key]) {
                root[lastPathKey][key] = state[key];
                hasChange = true;
            }
        }
    }
    return hasChange;
}
function getState(path, state) {
    for (var i = 0; i < path.length - 1; i++) {
        state = state[path[i]];
    }
    return state;
}
},{"./utils":7}],6:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var utils_1 = require("./utils");
function patch(parent, element, oldNode, node, isSVG) {
    if (node === oldNode) {} else if (oldNode === null) {
        element = parent.insertBefore(utils_1.createElement(node, isSVG), element);
    } else if (node.name && node.name === oldNode.name) {
        utils_1.updateElement(element, node.props, oldNode.props, isSVG = isSVG || node.name === 'svg');
        var oldElements = [];
        var oldKeyed = {};
        var newKeyed = {};
        // 暂存包含key值的旧节点数据
        for (var i = 0, l = oldNode.children.length; i < l; i++) {
            oldElements[i] = element.childNodes[i];
            var oldChild = oldNode.children[i];
            var oldKey = utils_1.getKey(oldChild);
            if (oldKey !== null) {
                oldKeyed[oldKey] = [oldElements[i], oldChild];
            }
        }
        var newNodeIndex = 0;
        var oldNodeIndex = 0;
        while (newNodeIndex < node.children.length) {
            var oldChild = oldNode.children[oldNodeIndex];
            var newChild = node.children[newNodeIndex];
            var oldKey = utils_1.getKey(oldChild);
            var newKey = utils_1.getKey(newChild);
            // 表示已经处理过该旧节点,比如有些场景是 旧节点的位置在新vnode中被前置了
            if (newKeyed[oldKey]) {
                oldNodeIndex++;
                continue;
            }
            if (newKey === null) {
                if (oldKey === null) {
                    patch(element, oldElements[oldNodeIndex] || null, oldChild, newChild, isSVG);
                    newNodeIndex++;
                }
                //  隐含条件，如果旧节点包含key而新节点没有，则需要移动到下一个旧节点去对比
                oldNodeIndex++;
            } else {
                var recycleNode = oldKeyed[newKey] || [];
                if (oldKey === newKey) {
                    patch(element, recycleNode[0], recycleNode[1], newChild, isSVG);
                    oldNodeIndex++;
                } else if (recycleNode[0]) {
                    //  旧节点该移位了
                    patch(element, element.insertBefore(recycleNode[0], oldElements[oldNodeIndex]), recycleNode[1], newChild, isSVG);
                } else {
                    //  新节点
                    patch(element, oldElements[oldNodeIndex], null, newChild, isSVG);
                }
                newNodeIndex++;
                newKeyed[newKey] = newChild;
            }
        }
        //  新节点处理完后，检查是否还剩旧节点，然后将之删除
        while (oldNodeIndex < oldNode.children.length) {
            var oldChild = oldNode.children[oldNodeIndex];
            if (utils_1.getKey(oldChild) === null) {
                utils_1.removeElement(element, oldElements[oldNodeIndex], oldChild);
            }
            oldNodeIndex++;
        }
        // 处理包含key的旧节点
        for (var key in oldKeyed) {
            if (!newKeyed[oldKeyed[key][1].props.key]) {
                utils_1.removeElement(element, oldKeyed[key][0], oldKeyed[key][1]);
            }
        }
    } else if (typeof node === 'string' || typeof node === 'number') {
        element.nodeValue = node.toString();
    } else {
        // 替换整个节点
        var _rEl = void 0;
        element = parent.insertBefore(utils_1.createElement(node, isSVG), _rEl = element);
        utils_1.removeElement(parent, _rEl, oldNode);
    }
    return element;
}
exports["default"] = patch;
function rootPatch(parent, element, oldNode, node, isSVG) {
    element = patch(parent, element, oldNode, node);
    var lifeCycle;
    // 确保调用是从最底层到外层
    while (lifeCycle = utils_1.invokeLaterStack.pop()) {
        lifeCycle();
    }return element;
}
exports.rootPatch = rootPatch;
},{"./utils":7}],4:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var wire_state_to_actions_1 = require("./wire_state_to_actions");
// import patch from './patch'
var patch_1 = require("./patch");
function app(state, actions, views, container) {
    if (!container) throw new Error('container not exist');
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    // for hot reload
    for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
        var el = _a[_i];
        if (el.nodeName !== 'SCRIPT') {
            el.remove();
        }
    }
    var rootElement = container && container.children[0] || null;
    var lastNode = null;
    var renderLock;
    scheduleRender();
    wire_state_to_actions_1["default"](state, actions, function (_state) {
        state = _state;
        scheduleRender();
    });
    function render() {
        renderLock = !renderLock;
        var newNode = views(state, actions);
        // rootElement = patch(container, rootElement, lastNode, (lastNode = newNode))
        rootElement = patch_1.rootPatch(container, rootElement, lastNode, lastNode = newNode);
    }
    function scheduleRender() {
        if (!renderLock) {
            renderLock = !renderLock;
            setTimeout(render);
        }
    }
}
exports["default"] = app;
},{"./wire_state_to_actions":5,"./patch":6}],3:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
// 基于jsx语法
function h(name, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof name === 'function' && name.isClass) {
        var instance = new name.prototype.constructor(props || {}, flatten(children));
        var vnode = instance.render();
        vnode.context = instance;
        return vnode;
    } else if (typeof name === 'function') {
        var vnode_1 = name(props || {});
        // 组件方法,支持组件内部嵌套子元素或者子组件
        if (vnode_1.children && children.length > 0) {
            vnode_1.children = flatten(vnode_1.children.concat(children));
        }
        return vnode_1;
    } else {
        return {
            name: name,
            props: props || {},
            children: flatten(children)
        };
    }
}
exports["default"] = h;
function flatten(arr) {
    var rarr = [];
    for (var i = 0, l = arr.length; i < l; i++) {
        if (Array.isArray(arr[i])) {
            rarr = rarr.concat(flatten(arr[i]));
        } else {
            rarr.push(arr[i]);
        }
    }
    return rarr;
}
},{}],12:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var utils_1 = require("./utils");
var Component = /** @class */function () {
    function Component(props, children) {
        if (children === void 0) {
            children = [];
        }
        this.props = props;
        this.children = children;
    }
    Component.prototype.setState = function (_state) {
        this.state = utils_1.copy(this.state, _state);
        this.render();
    };
    Component.prototype.oncreate = function (element, node) {};
    Component.prototype.onupdated = function () {};
    Component.prototype.onremove = function () {};
    Component.isClass = true;
    return Component;
}();
exports["default"] = Component;
// {
//   name: 'div',
//   props: '',
//   children: [],
//   context: _component
// }
},{"./utils":7}],8:[function(require,module,exports) {
var global = (1,eval)("this");
/*
 2017 Julian Garnier
 Released under the MIT license
*/
var $jscomp={scope:{}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(e,r,p){if(p.get||p.set)throw new TypeError("ES3 does not support getters and setters.");e!=Array.prototype&&e!=Object.prototype&&(e[r]=p.value)};$jscomp.getGlobal=function(e){return"undefined"!=typeof window&&window===e?e:"undefined"!=typeof global&&null!=global?global:e};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(e){return $jscomp.SYMBOL_PREFIX+(e||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var e=$jscomp.global.Symbol.iterator;e||(e=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[e]&&$jscomp.defineProperty(Array.prototype,e,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(e){var r=0;return $jscomp.iteratorPrototype(function(){return r<e.length?{done:!1,value:e[r++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(e){$jscomp.initSymbolIterator();e={next:e};e[$jscomp.global.Symbol.iterator]=function(){return this};return e};$jscomp.array=$jscomp.array||{};$jscomp.iteratorFromArray=function(e,r){$jscomp.initSymbolIterator();e instanceof String&&(e+="");var p=0,m={next:function(){if(p<e.length){var u=p++;return{value:r(u,e[u]),done:!1}}m.next=function(){return{done:!0,value:void 0}};return m.next()}};m[Symbol.iterator]=function(){return m};return m};
$jscomp.polyfill=function(e,r,p,m){if(r){p=$jscomp.global;e=e.split(".");for(m=0;m<e.length-1;m++){var u=e[m];u in p||(p[u]={});p=p[u]}e=e[e.length-1];m=p[e];r=r(m);r!=m&&null!=r&&$jscomp.defineProperty(p,e,{configurable:!0,writable:!0,value:r})}};$jscomp.polyfill("Array.prototype.keys",function(e){return e?e:function(){return $jscomp.iteratorFromArray(this,function(e){return e})}},"es6-impl","es3");var $jscomp$this=this;
(function(e,r){"function"===typeof define&&define.amd?define([],r):"object"===typeof module&&module.exports?module.exports=r():e.anime=r()})(this,function(){function e(a){if(!h.col(a))try{return document.querySelectorAll(a)}catch(c){}}function r(a,c){for(var d=a.length,b=2<=arguments.length?arguments[1]:void 0,f=[],n=0;n<d;n++)if(n in a){var k=a[n];c.call(b,k,n,a)&&f.push(k)}return f}function p(a){return a.reduce(function(a,d){return a.concat(h.arr(d)?p(d):d)},[])}function m(a){if(h.arr(a))return a;
h.str(a)&&(a=e(a)||a);return a instanceof NodeList||a instanceof HTMLCollection?[].slice.call(a):[a]}function u(a,c){return a.some(function(a){return a===c})}function C(a){var c={},d;for(d in a)c[d]=a[d];return c}function D(a,c){var d=C(a),b;for(b in a)d[b]=c.hasOwnProperty(b)?c[b]:a[b];return d}function z(a,c){var d=C(a),b;for(b in c)d[b]=h.und(a[b])?c[b]:a[b];return d}function T(a){a=a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(a,c,d,k){return c+c+d+d+k+k});var c=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
a=parseInt(c[1],16);var d=parseInt(c[2],16),c=parseInt(c[3],16);return"rgba("+a+","+d+","+c+",1)"}function U(a){function c(a,c,b){0>b&&(b+=1);1<b&&--b;return b<1/6?a+6*(c-a)*b:.5>b?c:b<2/3?a+(c-a)*(2/3-b)*6:a}var d=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(a);a=parseInt(d[1])/360;var b=parseInt(d[2])/100,f=parseInt(d[3])/100,d=d[4]||1;if(0==b)f=b=a=f;else{var n=.5>f?f*(1+b):f+b-f*b,k=2*f-n,f=c(k,n,a+1/3),b=c(k,n,a);a=c(k,n,a-1/3)}return"rgba("+
255*f+","+255*b+","+255*a+","+d+")"}function y(a){if(a=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(a))return a[2]}function V(a){if(-1<a.indexOf("translate")||"perspective"===a)return"px";if(-1<a.indexOf("rotate")||-1<a.indexOf("skew"))return"deg"}function I(a,c){return h.fnc(a)?a(c.target,c.id,c.total):a}function E(a,c){if(c in a.style)return getComputedStyle(a).getPropertyValue(c.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function J(a,c){if(h.dom(a)&&
u(W,c))return"transform";if(h.dom(a)&&(a.getAttribute(c)||h.svg(a)&&a[c]))return"attribute";if(h.dom(a)&&"transform"!==c&&E(a,c))return"css";if(null!=a[c])return"object"}function X(a,c){var d=V(c),d=-1<c.indexOf("scale")?1:0+d;a=a.style.transform;if(!a)return d;for(var b=[],f=[],n=[],k=/(\w+)\((.+?)\)/g;b=k.exec(a);)f.push(b[1]),n.push(b[2]);a=r(n,function(a,b){return f[b]===c});return a.length?a[0]:d}function K(a,c){switch(J(a,c)){case "transform":return X(a,c);case "css":return E(a,c);case "attribute":return a.getAttribute(c)}return a[c]||
0}function L(a,c){var d=/^(\*=|\+=|-=)/.exec(a);if(!d)return a;var b=y(a)||0;c=parseFloat(c);a=parseFloat(a.replace(d[0],""));switch(d[0][0]){case "+":return c+a+b;case "-":return c-a+b;case "*":return c*a+b}}function F(a,c){return Math.sqrt(Math.pow(c.x-a.x,2)+Math.pow(c.y-a.y,2))}function M(a){a=a.points;for(var c=0,d,b=0;b<a.numberOfItems;b++){var f=a.getItem(b);0<b&&(c+=F(d,f));d=f}return c}function N(a){if(a.getTotalLength)return a.getTotalLength();switch(a.tagName.toLowerCase()){case "circle":return 2*
Math.PI*a.getAttribute("r");case "rect":return 2*a.getAttribute("width")+2*a.getAttribute("height");case "line":return F({x:a.getAttribute("x1"),y:a.getAttribute("y1")},{x:a.getAttribute("x2"),y:a.getAttribute("y2")});case "polyline":return M(a);case "polygon":var c=a.points;return M(a)+F(c.getItem(c.numberOfItems-1),c.getItem(0))}}function Y(a,c){function d(b){b=void 0===b?0:b;return a.el.getPointAtLength(1<=c+b?c+b:0)}var b=d(),f=d(-1),n=d(1);switch(a.property){case "x":return b.x;case "y":return b.y;
case "angle":return 180*Math.atan2(n.y-f.y,n.x-f.x)/Math.PI}}function O(a,c){var d=/-?\d*\.?\d+/g,b;b=h.pth(a)?a.totalLength:a;if(h.col(b))if(h.rgb(b)){var f=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(b);b=f?"rgba("+f[1]+",1)":b}else b=h.hex(b)?T(b):h.hsl(b)?U(b):void 0;else f=(f=y(b))?b.substr(0,b.length-f.length):b,b=c&&!/\s/g.test(b)?f+c:f;b+="";return{original:b,numbers:b.match(d)?b.match(d).map(Number):[0],strings:h.str(a)||c?b.split(d):[]}}function P(a){a=a?p(h.arr(a)?a.map(m):m(a)):[];return r(a,
function(a,d,b){return b.indexOf(a)===d})}function Z(a){var c=P(a);return c.map(function(a,b){return{target:a,id:b,total:c.length}})}function aa(a,c){var d=C(c);if(h.arr(a)){var b=a.length;2!==b||h.obj(a[0])?h.fnc(c.duration)||(d.duration=c.duration/b):a={value:a}}return m(a).map(function(a,b){b=b?0:c.delay;a=h.obj(a)&&!h.pth(a)?a:{value:a};h.und(a.delay)&&(a.delay=b);return a}).map(function(a){return z(a,d)})}function ba(a,c){var d={},b;for(b in a){var f=I(a[b],c);h.arr(f)&&(f=f.map(function(a){return I(a,
c)}),1===f.length&&(f=f[0]));d[b]=f}d.duration=parseFloat(d.duration);d.delay=parseFloat(d.delay);return d}function ca(a){return h.arr(a)?A.apply(this,a):Q[a]}function da(a,c){var d;return a.tweens.map(function(b){b=ba(b,c);var f=b.value,e=K(c.target,a.name),k=d?d.to.original:e,k=h.arr(f)?f[0]:k,w=L(h.arr(f)?f[1]:f,k),e=y(w)||y(k)||y(e);b.from=O(k,e);b.to=O(w,e);b.start=d?d.end:a.offset;b.end=b.start+b.delay+b.duration;b.easing=ca(b.easing);b.elasticity=(1E3-Math.min(Math.max(b.elasticity,1),999))/
1E3;b.isPath=h.pth(f);b.isColor=h.col(b.from.original);b.isColor&&(b.round=1);return d=b})}function ea(a,c){return r(p(a.map(function(a){return c.map(function(b){var c=J(a.target,b.name);if(c){var d=da(b,a);b={type:c,property:b.name,animatable:a,tweens:d,duration:d[d.length-1].end,delay:d[0].delay}}else b=void 0;return b})})),function(a){return!h.und(a)})}function R(a,c,d,b){var f="delay"===a;return c.length?(f?Math.min:Math.max).apply(Math,c.map(function(b){return b[a]})):f?b.delay:d.offset+b.delay+
b.duration}function fa(a){var c=D(ga,a),d=D(S,a),b=Z(a.targets),f=[],e=z(c,d),k;for(k in a)e.hasOwnProperty(k)||"targets"===k||f.push({name:k,offset:e.offset,tweens:aa(a[k],d)});a=ea(b,f);return z(c,{children:[],animatables:b,animations:a,duration:R("duration",a,c,d),delay:R("delay",a,c,d)})}function q(a){function c(){return window.Promise&&new Promise(function(a){return p=a})}function d(a){return g.reversed?g.duration-a:a}function b(a){for(var b=0,c={},d=g.animations,f=d.length;b<f;){var e=d[b],
k=e.animatable,h=e.tweens,n=h.length-1,l=h[n];n&&(l=r(h,function(b){return a<b.end})[0]||l);for(var h=Math.min(Math.max(a-l.start-l.delay,0),l.duration)/l.duration,w=isNaN(h)?1:l.easing(h,l.elasticity),h=l.to.strings,p=l.round,n=[],m=void 0,m=l.to.numbers.length,t=0;t<m;t++){var x=void 0,x=l.to.numbers[t],q=l.from.numbers[t],x=l.isPath?Y(l.value,w*x):q+w*(x-q);p&&(l.isColor&&2<t||(x=Math.round(x*p)/p));n.push(x)}if(l=h.length)for(m=h[0],w=0;w<l;w++)p=h[w+1],t=n[w],isNaN(t)||(m=p?m+(t+p):m+(t+" "));
else m=n[0];ha[e.type](k.target,e.property,m,c,k.id);e.currentValue=m;b++}if(b=Object.keys(c).length)for(d=0;d<b;d++)H||(H=E(document.body,"transform")?"transform":"-webkit-transform"),g.animatables[d].target.style[H]=c[d].join(" ");g.currentTime=a;g.progress=a/g.duration*100}function f(a){if(g[a])g[a](g)}function e(){g.remaining&&!0!==g.remaining&&g.remaining--}function k(a){var k=g.duration,n=g.offset,w=n+g.delay,r=g.currentTime,x=g.reversed,q=d(a);if(g.children.length){var u=g.children,v=u.length;
if(q>=g.currentTime)for(var G=0;G<v;G++)u[G].seek(q);else for(;v--;)u[v].seek(q)}if(q>=w||!k)g.began||(g.began=!0,f("begin")),f("run");if(q>n&&q<k)b(q);else if(q<=n&&0!==r&&(b(0),x&&e()),q>=k&&r!==k||!k)b(k),x||e();f("update");a>=k&&(g.remaining?(t=h,"alternate"===g.direction&&(g.reversed=!g.reversed)):(g.pause(),g.completed||(g.completed=!0,f("complete"),"Promise"in window&&(p(),m=c()))),l=0)}a=void 0===a?{}:a;var h,t,l=0,p=null,m=c(),g=fa(a);g.reset=function(){var a=g.direction,c=g.loop;g.currentTime=
0;g.progress=0;g.paused=!0;g.began=!1;g.completed=!1;g.reversed="reverse"===a;g.remaining="alternate"===a&&1===c?2:c;b(0);for(a=g.children.length;a--;)g.children[a].reset()};g.tick=function(a){h=a;t||(t=h);k((l+h-t)*q.speed)};g.seek=function(a){k(d(a))};g.pause=function(){var a=v.indexOf(g);-1<a&&v.splice(a,1);g.paused=!0};g.play=function(){g.paused&&(g.paused=!1,t=0,l=d(g.currentTime),v.push(g),B||ia())};g.reverse=function(){g.reversed=!g.reversed;t=0;l=d(g.currentTime)};g.restart=function(){g.pause();
g.reset();g.play()};g.finished=m;g.reset();g.autoplay&&g.play();return g}var ga={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},S={duration:1E3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},W="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(" "),H,h={arr:function(a){return Array.isArray(a)},obj:function(a){return-1<Object.prototype.toString.call(a).indexOf("Object")},
pth:function(a){return h.obj(a)&&a.hasOwnProperty("totalLength")},svg:function(a){return a instanceof SVGElement},dom:function(a){return a.nodeType||h.svg(a)},str:function(a){return"string"===typeof a},fnc:function(a){return"function"===typeof a},und:function(a){return"undefined"===typeof a},hex:function(a){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)},rgb:function(a){return/^rgb/.test(a)},hsl:function(a){return/^hsl/.test(a)},col:function(a){return h.hex(a)||h.rgb(a)||h.hsl(a)}},A=function(){function a(a,
d,b){return(((1-3*b+3*d)*a+(3*b-6*d))*a+3*d)*a}return function(c,d,b,f){if(0<=c&&1>=c&&0<=b&&1>=b){var e=new Float32Array(11);if(c!==d||b!==f)for(var k=0;11>k;++k)e[k]=a(.1*k,c,b);return function(k){if(c===d&&b===f)return k;if(0===k)return 0;if(1===k)return 1;for(var h=0,l=1;10!==l&&e[l]<=k;++l)h+=.1;--l;var l=h+(k-e[l])/(e[l+1]-e[l])*.1,n=3*(1-3*b+3*c)*l*l+2*(3*b-6*c)*l+3*c;if(.001<=n){for(h=0;4>h;++h){n=3*(1-3*b+3*c)*l*l+2*(3*b-6*c)*l+3*c;if(0===n)break;var m=a(l,c,b)-k,l=l-m/n}k=l}else if(0===
n)k=l;else{var l=h,h=h+.1,g=0;do m=l+(h-l)/2,n=a(m,c,b)-k,0<n?h=m:l=m;while(1e-7<Math.abs(n)&&10>++g);k=m}return a(k,d,f)}}}}(),Q=function(){function a(a,b){return 0===a||1===a?a:-Math.pow(2,10*(a-1))*Math.sin(2*(a-1-b/(2*Math.PI)*Math.asin(1))*Math.PI/b)}var c="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),d={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,.335],[.6,-.28,.735,.045],a],Out:[[.25,
.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],[.075,.82,.165,1],[.175,.885,.32,1.275],function(b,c){return 1-a(1-b,c)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(b,c){return.5>b?a(2*b,c)/2:1-a(-2*b+2,c)/2}]},b={linear:A(.25,.25,.75,.75)},f={},e;for(e in d)f.type=e,d[f.type].forEach(function(a){return function(d,f){b["ease"+a.type+c[f]]=h.fnc(d)?
d:A.apply($jscomp$this,d)}}(f)),f={type:f.type};return b}(),ha={css:function(a,c,d){return a.style[c]=d},attribute:function(a,c,d){return a.setAttribute(c,d)},object:function(a,c,d){return a[c]=d},transform:function(a,c,d,b,f){b[f]||(b[f]=[]);b[f].push(c+"("+d+")")}},v=[],B=0,ia=function(){function a(){B=requestAnimationFrame(c)}function c(c){var b=v.length;if(b){for(var d=0;d<b;)v[d]&&v[d].tick(c),d++;a()}else cancelAnimationFrame(B),B=0}return a}();q.version="2.2.0";q.speed=1;q.running=v;q.remove=
function(a){a=P(a);for(var c=v.length;c--;)for(var d=v[c],b=d.animations,f=b.length;f--;)u(a,b[f].animatable.target)&&(b.splice(f,1),b.length||d.pause())};q.getValue=K;q.path=function(a,c){var d=h.str(a)?e(a)[0]:a,b=c||100;return function(a){return{el:d,property:a,totalLength:N(d)*(b/100)}}};q.setDashoffset=function(a){var c=N(a);a.setAttribute("stroke-dasharray",c);return c};q.bezier=A;q.easings=Q;q.timeline=function(a){var c=q(a);c.pause();c.duration=0;c.add=function(d){c.children.forEach(function(a){a.began=
!0;a.completed=!0});m(d).forEach(function(b){var d=z(b,D(S,a||{}));d.targets=d.targets||a.targets;b=c.duration;var e=d.offset;d.autoplay=!1;d.direction=c.direction;d.offset=h.und(e)?b:L(e,b);c.began=!0;c.completed=!0;c.seek(d.offset);d=q(d);d.began=!0;d.completed=!0;d.duration>b&&(c.duration=d.duration);c.children.push(d)});c.seek(0);c.reset();c.autoplay&&c.restart();return c};return c};q.random=function(a,c){return Math.floor(Math.random()*(c-a+1))+a};return q});
},{}],2:[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
exports.__esModule = true;
var src_1 = require("../../src");
var h_1 = require("../../src/h");
var component_1 = require("../../src/component");
var anime = require("animejs");
var clientHeight = document.documentElement.clientHeight;
var clientWidth = document.documentElement.clientWidth;
var state = {
    card: {
        onpress: false
    }
};
var actions = {
    card: {
        touchstart: function touchstart() {
            return { onpress: true };
        },
        touchend: function touchend() {
            return { onpress: false };
        }
    }
};
var Car = /** @class */function (_super) {
    __extends(Car, _super);
    function Car() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Car.prototype.onclick = function () {
        console.log(this.props);
    };
    Car.prototype.oncreate = function () {
        console.log(this.props);
    };
    Car.prototype.render = function () {
        return h_1["default"]("div", { onclick: this.onclick.bind(this) }, "car");
    };
    return Car;
}(component_1["default"]);
var Slot = /** @class */function (_super) {
    __extends(Slot, _super);
    function Slot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slot.prototype.oncreate = function () {
        console.log(this.children);
    };
    Slot.prototype.render = function () {
        return h_1["default"]("div", { "class": this.props.className }, h_1["default"]("div", null, "\u6211\u662F\u7B2C\u4E00\u4E2A\u5B50\u8282\u70B9\uFF0C\u4E0B\u9762\u5168\u662F\u63D2\u5165\u8FDB\u6765\u7684"), h_1["default"]("div", null, "1", h_1["default"]("div", null, "2", h_1["default"]("div", null, "\uD83D\uDE06"))), this.children, h_1["default"]("div", null, "i am footer"));
    };
    return Slot;
}(component_1["default"]);
var Card = function Card(_a) {
    var top = _a.top;
    return h_1["default"]("div", { id: "card", style: { top: top + "px" }, "class": "box colorful " + (state.card.onpress ? 'onpress' : ''), onclick: function onclick(e) {
            console.log(e);
            anime({
                targets: e.target,
                borderRadius: "0px",
                left: 0,
                top: 0,
                width: clientWidth + 'px',
                height: clientHeight + 'px',
                duration: 500,
                delay: 0,
                easing: 'easeOutExpo',
                complete: function complete(anim) {
                    console.log('done');
                }
            });
        }, ontouchstart: function ontouchstart(e) {
            actions.card.touchstart();
            // e.preventDefault()
        }, ontouchend: actions.card.touchend });
};
var view = function view(state, actions) {
    var cardList = [330].map(function (top) {
        return h_1["default"](Card, { top: top });
    });
    return h_1["default"]("div", { id: "root" }, h_1["default"](Car, { "class": "nanni" }), h_1["default"](Slot, { className: "slot" }, h_1["default"]("div", null, "i am in the slot"), h_1["default"]("div", null, "I am in the slot too")), cardList);
};
var mian = src_1["default"](state, actions, view, document.body);
// var mian = app(state, actions, view, '#root')
},{"../../src":4,"../../src/h":3,"../../src/component":12,"animejs":8}],19:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '50839' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[19,2])
//# sourceMappingURL=/dist/b02a8443de3a0498dafac0d77c8ab130.map