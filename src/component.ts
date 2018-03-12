import { vnode } from "./interface";
import { copy } from "./utils";

abstract class Component  {
  public state
  public props
  public vnode
  public children
  public static isClass = true
  constructor (props, children = []) {
    this.props = props
    this.children = children
  }
  setState (_state) {
    this.state = copy(this.state, _state)
    this.render()
  }
  oncreate (element, node:vnode) {}
  onupdated () {}
  onremove () {}
  abstract render (): vnode
}

export default Component

// {
//   name: 'div',
//   props: '',
//   children: [],
//   context: _component
// }