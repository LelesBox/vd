import app from '../../src'
import h from '../../src/h'
import * as anime from 'animejs'

// window.anime = anime

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

let Card = () => (
  <div id ="card"
    class={ `box colorful ${ state.card.onpress ? 'onpress' : '' }` } 
    onclick={() => {
      console.log('click')
      // actions.card.touchstart()
      // setTimeout(actions.card.touchend, 300)
      anime({
        targets: '#card',
        borderRadius: "0px",
        // right: 0,
        // bottom: 0,
        left: 0,
        top: 0,
        width: '375px',
        height: '667px',
        opacity: 0.5,
        duration: 800,
        delay: 0,
        easing: 'easeOutExpo'
      })
    }}
    ontouchstart={(e) => {
      actions.card.touchstart()
      // e.preventDefault()
    }} 
    ontouchend={actions.card.touchend}>
  </div>
)

const view = (state, actions) => (
  <Card></Card>
)

var mian = app(state, actions, view, document.body)

