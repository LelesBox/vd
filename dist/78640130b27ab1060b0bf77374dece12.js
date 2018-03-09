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
})({42:[function(require,module,exports) {
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
},{}],40:[function(require,module,exports) {
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
},{"./utils":42}],41:[function(require,module,exports) {
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
},{"./utils":42}],39:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var wire_state_to_actions_1 = require("./wire_state_to_actions");
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
        rootElement = patch_1["default"](container, rootElement, lastNode, lastNode = newNode);
    }
    function scheduleRender() {
        if (!renderLock) {
            renderLock = !renderLock;
            setTimeout(render);
        }
    }
}
exports["default"] = app;
},{"./wire_state_to_actions":40,"./patch":41}],6:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
// 基于jsx语法
function h(name, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof name === 'function') {
        var vnode_1 = name(props || {});
        if (vnode_1.children && children.length > 0) {
            vnode_1.children = vnode_1.children.concat(children);
        }
        return vnode_1;
    } else {
        return {
            name: name,
            props: props || {},
            children: children
        };
    }
}
exports["default"] = h;
},{}],4:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var src_1 = require("../../src");
var h_1 = require("../../src/h");
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
var Card = function Card(_a) {
    var top = _a.top;
    return h_1["default"]("div", { id: "card", style: { top: top + "px" }, "class": "box colorful " + (state.card.onpress ? 'onpress' : ''), onclick: function onclick(e) {
            // console.log('click', e)
            // anime({
            //   targets: e.target,
            //   borderRadius: "0px",
            //   left: 0,
            //   top: 0,
            //   width: clientWidth + 'px',
            //   height: clientHeight + 'px',
            //   duration: 500,
            //   delay: 0,
            //   easing: 'easeOutExpo',
            //   complete: function (anim) {
            //     console.log('done')
            //   }
            // })
        }, ontouchstart: function ontouchstart(e) {
            actions.card.touchstart();
            e.preventDefault();
        }, ontouchend: actions.card.touchend });
};
var view = function view(state, actions) {
    return h_1["default"]("div", { id: "root" }, h_1["default"](Card, { top: "30" }), h_1["default"](Card, { top: "300" }));
};
var mian = src_1["default"](state, actions, view, document.body);
// var mian = app(state, actions, view, '#root')
},{"../../src":39,"../../src/h":6}],56:[function(require,module,exports) {

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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '59662' + '/');
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
},{}]},{},[56,4])
//# sourceMappingURL=/dist/78640130b27ab1060b0bf77374dece12.map