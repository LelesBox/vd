// 
import { copy } from './utils'
export function _wireStateToActions(path, state, actions, callback) {
  for (let key in actions) {
    typeof actions[key] === 'function' ?
      (function (key, action) {
        actions[key] = function (data) {
          if (typeof (data = action(data)) === "function") {
            data = data(state, actions)
          }
          if (
            data &&
            // data !== (state = getState(path, globalState)) && 可用某个类库来提供比较，比如 immutable.js
            !data.then // Promise
          ) {
            callback(path, copy(data))
          }
          return copy(state, data)
        }
      })(key, actions[key]) : _wireStateToActions(path.concat(key), state[key] || {}, actions[key], callback)
  }
}

export default function wireStateToActions(globalState, globalActions, callback) {
  _wireStateToActions([], globalState, globalActions, function (path, newState) {
    if (setState(path, globalState, newState)) {
      callback(globalState)
    }
  })
}

function setState(path, root, state) {
  let hasChange = false
  if (path.length === 0) {
    for (let key in state) {
      if (root[key] !== state[key]) {
        root[key] = state[key]
        hasChange = true
      }
    }
  } else {
    for (let i = 0; i < path.length - 1; i++) {
      root = root[path[i]]
    }
    for (let key in state) {
      let lastPathKey = path.pop()
      if (root[lastPathKey][key] !== state[key]) {
        root[lastPathKey][key] = state[key]
        hasChange = true
      }
    }
  }
  return hasChange
}

function getState (path, state) {
  for (let i = 0; i < path.length - 1; i++) {
    state = state[path[i]]
  }
  return state
}