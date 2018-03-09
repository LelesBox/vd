import { vnode, ComponentFunc } from './interface'
import Component from './component';

// 基于jsx语法
export default function h (name: string | ComponentFunc, props: null | Object, ...children: Array<vnode|string>):vnode {
  if (typeof name === 'function') { // 组件方法,支持组件内部嵌套子元素或者子组件
    let vnode = name(props || {})
    if (vnode.children && children.length > 0) {
      vnode.children = vnode.children.concat(children)
    }
    return vnode
  } else {
    return {
      name,
      props: props || {},
      children
    }
  }
}
