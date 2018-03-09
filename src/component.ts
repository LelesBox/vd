import { vnode } from "./interface";
import { copy } from "./utils";

function Component () {
  // public state
  // public props
  // public vnode
  // static createInstance (props) {
  //   // return new Component(props)
  // }
  // constructor (props) {
  //   this.props = props
  //   this.vnode = this.render()
  // }
  // setState (_state) {
  //   this.state = copy(this.state, _state)
  //   this.render()
  // }
  // create () {}
  // updated () {}
  // remove () {}
  // abstract render (): vnode
}

Component.prototype = {
  constructor: Component,
  setState: function () {

  },
  create: function () {

  },
  updated: function () {

  },
  remove: function () {

  },
  render: function () {

  }
}

export default Component

// {
//   name: 'div',
//   props: '',
//   children: [],
//   context: _component
// }