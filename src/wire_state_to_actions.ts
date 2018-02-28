// 
import { copy } from './utils'
let globalState = {}
export function _wireStateToActions(path, state, actions, callback) {
  for (let key in actions) {
    typeof actions[key] === 'function' ?
      (function (key, action) {
        actions[key] = function (data) {
          if (typeof (data = action(data)) === "function") {
            data = data(getState(path, globalState), actions)
          }
          if (
            data &&
            data !== (state = getState(path, globalState)) &&
            !data.then // Promise
          ) {
            callback(path, copy(state, data))
          }
        }
      })(key, actions[key]) : _wireStateToActions(path.concat(key), state[key] || {}, actions[key], callback)
  }
}

export default function wireStateToActions(globalState, globalActions, callback) {
  _wireStateToActions([], globalState, globalActions, function (path, state) {
    setState(path, globalState, state)
    callback(globalState)
  })
}

function setState(path, root, state) {
  if (path.length === 0) {
    root = state
  } else {
    for (let i = 0; i < path.length - 1; i++) {
      root = root[path[i]]
    }
    root[path.pop()] = typeof state === 'number' || typeof state === 'string' ? state :copy(state)
  }
}

function getState (path, state) {
  for (let i = 0; i < path.length - 1; i++) {
    state = state[path[i]]
  }
  return state
}