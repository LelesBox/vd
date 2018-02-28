import { vnode } from './interface'

export const invokeLaterStack = []

// 根据vnode创建真实DOM元素
export function createElement(node: vnode, isSVG?) {
  let element = isSVG ? document.createElementNS('http://www.w3.org/2000/svg', node.name)
    : document.createElement(node.name)

  for (let i = 0, l = node.children.length; i < l; i++) {
    let child = node.children[i]
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child))
    } else {
      element.appendChild(createElement(child, isSVG))
    }
  }

  for (let name in node.props) {
    setELementProps(element, name, node.props[name], isSVG)
  }

  if (node.props && node.props.oncreate) {
    invokeLaterStack.push(() => node.props.oncreate(element, node))
  }

  return element
}

// 当参数是个对象时，我们希望得到的是一个非引用对象。
export function setELementProps(element: HTMLElement | SVGElement, prop: string, value: null | string | Object | Function, isSVG: boolean, oldvalue?: null | string | Object | Function) {
  if (prop !== 'key') {
    if (prop === 'style') {
      if (value === '' || value === null) {
        element.style.cssText = ''
      } else if (typeof value === 'object') {
        // 合并新老对象, 以新的对象为准，这样 当存在oldvalue属性不存在与value时，会被去除
        for (let key in copy(oldvalue, value)) {
          element.style[key] = value[key] || ''
        }
      }
    } else if (typeof value === 'function' || prop in element && !isSVG) {
      element[prop] = value === null ? '' : value
    } else if (value !== null && value !== false && typeof value !== 'object') {
      element.setAttribute(prop, value)
    } else if (value === null || value === false) {
      element.removeAttribute(prop)
    }
  }
}

export function removeElement(parent, element, node: vnode) {
  function done() {
    parent.removeChild(removeChildren(element, node))
  }
  if (node.props && node.props.onremove) {
    // node.props.onremove(element, done)
    invokeLaterStack.push(() => node.props.onremove(element, done))
  } else {
    done()
  }
}

export function removeChildren(element, node: vnode) {
  // 表示该vnode不是文本节点
  if (node.props || node.children) {
    for (let i = 0, l = node.children.length; i < l; i++) {
      let childNode = node.children[i]
      if (typeof childNode !== 'string') {
        removeChildren(element.children[i], childNode)
      }
    }
    if (node.props && node.props.ondestroy) {
      // node.props.ondestroy(element)
      invokeLaterStack.push(() => node.props.ondestroy(element))
    }
  }
  return element
}

export function updateElement(element, props, oldProps, isSVG) {
  let hasUpdate = false
  for (let name in copy(oldProps, props)) {
    let newValue = props[name]
    let oldValue = name === 'value' || name === 'checked' ? element[name] : oldProps[name]
    if (!isDeepEqual(newValue, oldValue)) {
      let change = setELementProps(element, name, props[name] === undefined ? null : props[name], isSVG, oldProps[name])
      hasUpdate = true
    }
  }
  if (hasUpdate) {
    console.log('has update')
  }
  if (hasUpdate && props.onupdate) {
    invokeLaterStack.push(() => props.onupdate(element, oldProps))
  }
}

export function getKey(node) {
  return node && node.props && node.props.key !== undefined ? node.props.key : null
}

export function copy(dest: {}, target?: {}) {
  let val = {}
  for (let key in dest) {
    val[key] = dest[key]
  }
  for (let key in target) {
    val[key] = target[key]
  }
  return val
}

// 忽略检测function Date  Regexp等引用类型。
export function isDeepEqual (o1, o2) {
 if (toString.call(o1) !== toString.call(o2)) {
    return false
  } else if (toString.call(o1) === '[object Array]') {
    let length = o1.length > o2.length ? o1.length : o2.length
    for (let i = 0; i < length; i++) {
      let item1 = o1[i]
      let item2 = o2[i]
      if (isDeepEqual(item1, item2) === false) {
        return false
      }
    }
    return true
  } else if (toString.call(o1) === '[object Object]') {
    let keys = Object.keys(o1).concat(Object.keys(o2))
    for (let i = 0, l = keys.length; i < l; i++) {
      let item1 = o1[keys[i]]
      let item2 = o2[keys[i]]
      if (isDeepEqual(item1, item2) === false) {
        return false
      }
    }
    return true
  } else {
    // 忽略检测function Date  Regexp等引用类型。
    return o1 === o2
  }
}