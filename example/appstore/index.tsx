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
// let Car = ({ top }) => {

// }
class VdComponent {
  public props
  constructor (props) {
    this.props = props
  }
  public static isClass = true
  render () {}
}


class Car extends VdComponent {
  onclick () {
    console.log(this.props)
  }
  render () {
    return <div onclick={this.onclick.bind(this)}>car</div>
  }
}

console.log('Car', Car.isClass)


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
  let cardList = [60, 330].map(top => {
    return <Card top={top}></Card>
  })
  return  (
    <div id="root">
      <Car class="nanni"/>
      {cardList}
    </div>
  )
}

var mian = app(state, actions, view, document.body)
// var mian = app(state, actions, view, '#root')


