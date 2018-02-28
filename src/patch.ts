import { createElement, updateElement, removeElement, getKey, invokeLaterStack } from './utils'

export default function patch (parent: HTMLElement | SVGElement, element: null | HTMLElement | SVGElement, oldNode, node, isSVG?) {
  if (node === oldNode) {
  } else if (oldNode === null) {
    element = parent.insertBefore(createElement(node, isSVG), element)
  } else if (node.name && node.name === oldNode.name) {
    updateElement(element, node.props, oldNode.props, isSVG = isSVG || node.name === 'svg')
     let oldElements = []
     let oldKeyed = {}
     let newKeyed = {}
    // 暂存包含key值的旧节点数据
     for (let i = 0, l = oldNode.children.length; i < l; i++) {
       oldElements[i] = element.childNodes[i]
       let oldChild = oldNode.children[i]
       let oldKey = getKey(oldChild)
       if (oldKey !== null) {
         oldKeyed[oldKey] = [oldElements[i], oldChild]
       }
     }

     let newNodeIndex = 0
     let oldNodeIndex = 0

     while (newNodeIndex < node.children.length) {
       let oldChild = oldNode.children[oldNodeIndex]
       let newChild = node.children[newNodeIndex]

       let oldKey = getKey(oldChild)
       let newKey = getKey(newChild)
      // 表示已经处理过该旧节点,比如有些场景是 旧节点的位置在新vnode中被前置了
       if (newKeyed[oldKey]) {
         oldNodeIndex++
         continue
       }
       
       if (newKey === null) {
         if (oldKey === null) {
           patch(element, oldElements[oldNodeIndex] || null, oldChild || null, newChild, isSVG)
           newNodeIndex++
         }
        //  隐含条件，如果旧节点包含key而新节点没有，则需要移动到下一个旧节点去对比
         oldNodeIndex++
       } else {
         let recycleNode = oldKeyed[newKey] || []
         if (oldKey === newKey) {
           patch(element, recycleNode[0], recycleNode[1], newChild, isSVG)
           oldNodeIndex++
         } else if (recycleNode[0]) {
          //  旧节点该移位了
          patch(element,
                element.insertBefore(recycleNode[0], oldElements[oldNodeIndex]),
                recycleNode[1],
                newChild,
                isSVG)
         } else {
          //  新节点
           patch(element, oldElements[oldNodeIndex], null, newChild, isSVG)
         }

         newNodeIndex++
         newKeyed[newKey] = newChild
       }
     }

    //  新节点处理完后，检查是否还剩旧节点，然后将之删除
    while (oldNodeIndex < oldNode.children.length) {
      let oldChild = oldNode.children[oldNodeIndex]
      if (getKey(oldChild) === null) {
        removeElement(element, oldElements[oldNodeIndex], oldChild)
      }
      oldNodeIndex++
    }

    // 处理包含key的旧节点
    for (let key in oldKeyed) {
      if (!newKeyed[oldKeyed[key][1].props.key]) {
        removeElement(element, oldKeyed[key][0], oldKeyed[key][1])
      }
    }
  } else if (typeof node === 'string') {
    element.nodeValue = node
  } else {
    // 替换整个节点
    let _rEl
    element = parent.insertBefore(createElement(node, isSVG), _rEl = element)
    removeElement(parent, _rEl, oldNode)
  }
  return element
}

export function rootPatch (parent: HTMLElement | SVGElement, element: null | HTMLElement | SVGElement, oldNode, node, isSVG?) {
  element = patch(parent, element, oldNode, node)
  let lifeCycle
  while(lifeCycle = invokeLaterStack.pop()) lifeCycle()
  return element
}