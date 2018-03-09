import app from '../../src'
import h from '../../src/h'
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

let Card = ({ top }) => (
  <div id ="card"
    style={{ top: `${top}px` }}
    class={ `box colorful ${ state.card.onpress ? 'onpress' : '' }` } 
    onclick={(e) => {

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
    }}
    ontouchstart={(e) => {
      actions.card.touchstart()
      e.preventDefault()
    }} 
    ontouchend={actions.card.touchend}>
  </div>
)

const view = (state, actions) => (
  <div id="root">
    <Card top="30"></Card>
    <Card top="300"></Card>
  </div>
)

var mian = app(state, actions, view, document.body)
// var mian = app(state, actions, view, '#root')


