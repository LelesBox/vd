import wireStateToActions from '../src/wire_state_to_actions'
const util = require('util')

function logObject (obj) {
  console.log(util.inspect(obj, false, null))
}
test('test wireStateToActions', () => {
  let state = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: 4,
      f: {
        g: 5,
        h: 6
      }
    }
  }
  let actions = {
    up: value => state => ({ b: state.b + value }),
    down: value => state => ({ a: state.a-- }),
    c: {
      upc: value => state => ({ d: state.d++ }),
      f: {
        downf: value => state => ({ g: state.g * value })
      }
    }
  }
  wireStateToActions(state, actions, function (state) {
    expect(state).toEqual({
      a: 1,
      b: 4,
      c: {
        d: 3,
        e: 4,
        f: {
          g: 5,
          h: 6
        }
      }
    })
  })
  let s = actions.up(2)
  expect(s).toEqual({
    a: 1,
    b: 4,
    c: {
      d: 3,
      e: 4,
      f: {
        g: 5,
        h: 6
      }
    }
  })
})


test('test wireStateToActions deep state', () => {
  let state = { a: 1, b: 2, c: { d: 3, e: 4, f: { g: 5, h: 6 } }}
  let actions = {
    up: value => state => ({ b: state.b + value }),
    down: value => state => ({ a: state.a-- }),
    c: {
      upc: value => state => ({ d: state.d++ }),
      f: {
        downf: value => state => ({ g: state.g * value })
      }
    }
  }
  wireStateToActions(state, actions, function (state) {
    expect(state).toEqual({ a: 1, b: 2, c: { d: 3, e: 4, f: { g: 10, h: 6 } } })
  })
  let f = actions.c.f.downf(2)
  expect(f).toEqual({ g: 10, h: 6 })
})


test('test wireStateToActions callback only state hash change', () => {
  let state = { a: 1, b: 2, c: { d: 3, e: 4, f: { g: 5, h: 6 } }}
  let actions = {
    up: value => state => ({ b: state.b + value }),
    down: value => state => ({ a: state.a - 1 }),
    c: {
      upc: value => state => ({ d: state.d++ }),
      f: {
        downf: value => state => ({ g: state.h - 1 })
      }
    }
  }
  // let index = 
  wireStateToActions(state, actions, function (state) {
    expect(state).toEqual({ a: 0, b: 2, c: { d: 3, e: 4, f: { g: 5, h: 6 } } })
  })
  // 不改变state，所以并不会触发wireStateToActions
  actions.c.f.downf(2)
  // 改变state，触发wireStateToActions
  actions.down(1)
})