import { vnode, ComponentFunc } from './interface'
import Component from './component';

// 基于jsx语法
export default function h (name: string | ComponentFunc, props: null | Object, ...children: Array<vnode|string>):vnode {
  if (typeof name === 'function' && name.isClass) {
    var instance = new name.prototype.constructor(props || {})
    var vnode = instance.render()
    vnode.context = instance
    console.log(vnode)
    return vnode
  } else if (typeof name === 'function') { // 组件方法,支持组件内部嵌套子元素或者子组件
    let vnode = name(props || {})
    if (vnode.children && children.length > 0) {
      vnode.children = flatten(vnode.children.concat(children))
    }
    // vnode.context = 
    return vnode
  } else {
    return {
      name,
      props: props || {},
      children: flatten(children)
    }
  }
}

function flatten (arr) {
  let rarr = []
  for (let i = 0, l = arr.length; i < l; i++) {
    if (Array.isArray(arr[i])) {
      rarr = rarr.concat(flatten(arr[i]))
    } else {
      rarr.push(arr[i])
    }
  }
  return rarr
}