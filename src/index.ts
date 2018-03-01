import  wireStateToActions from './wire_state_to_actions'
import patch from './patch'

export default function app (state, actions, views, container) {
  if (!container) throw new Error('container not exist')
  let rootElement = (container && container.children[0]) || null
  let lastNode = null
  let renderLock
  scheduleRender()
  wireStateToActions(state, actions, function (_state) {
    state = _state
    scheduleRender()
  })

  function render () {
    renderLock = !renderLock
    let newNode = views(state, actions)
    console.log(newNode)
    rootElement = patch(container, rootElement, lastNode, (lastNode = newNode))
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock
      setTimeout(render)
    }
  }
}