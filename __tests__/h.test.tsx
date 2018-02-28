import h from '../src/h'
const util = require('util')

function logObject (obj) {
  console.log(util.inspect(obj, false, null))
}
test('test h', () => {
  let vnode1 = h('div', null, '2', h('a', null, 'a tag'))
  let vnode2 = 
  <div>
    2<a>a tag</a>
  </div>
  expect(vnode1).toEqual(vnode2)
})

test('test component', () => {
  let component = (props) => {
    return h('div', props || null)
  }
  let vnode = h(component, { class: 'component' }, h('a', null, 'aaaa'), '118', h('span', null, 'vue'))
  let Component2 = props => {
    return <div {...props}></div>
  }
  let vnode2 = 
  <Component2 class="component">
    <a>aaaa</a>118<span>vue</span>
  </Component2>
  expect(vnode).toEqual(vnode2)
})