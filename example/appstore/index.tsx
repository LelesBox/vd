import app from '../../src'
import h from '../../src/h'
import Component from '../../src/component'
import * as anime from 'animejs'

let clientHeight = document.documentElement.clientHeight
let clientWidth = document.documentElement.clientWidth
const state = {
  card: {
    onpress: false
  }
}

const actions = {
  card: {
    touchstart: () => ({ onpress: true }),
    touchend: () => ({ onpress: false })
  }
}

class Car extends Component {
  onclick () {
    console.log(this.props)
  }
  oncreate () {
    console.log(this.props)
  }
  render () {
    return <div onclick={this.onclick.bind(this)}>car</div>
  }
}

class Slot extends Component {
  oncreate () {
    console.log(this.children)
  }
  render () {
    return (
    <div class={this.props.className}>
      <div>我是第一个子节点，下面全是插入进来的</div>
      <div>
        1
        <div>
          2
          <div>
            😆
          </div>
        </div>
      </div>
      {this.children}
      <div>i am footer</div>
    </div>
    )
  }
}

let Card = ({ top }) => (
  <div id ="card"
    style={{ top: `${top}px` }}
    class={ `box colorful ${ state.card.onpress ? 'onpress' : '' }` } 
    onclick={(e) => {
      console.log(e)
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
        complete: function (anim) {
          console.log('done')
        }
      })
    }}
    ontouchstart={(e) => {
      actions.card.touchstart()
      // e.preventDefault()
    }} 
    ontouchend={actions.card.touchend}>
  </div>
)

const view = (state, actions) => { 
  let cardList = [330].map(top => {
    return <Card top={top}></Card>
  })
  return  (
    <div id="root">
      <Car class="nanni"/>
      <Slot className="slot">
        <div>i am in the slot</div>
        <div>I am in the slot too</div>
      </Slot>
      {cardList}
    </div>
  )
}

var mian = app(state, actions, view, document.body)
// var mian = app(state, actions, view, '#root')


