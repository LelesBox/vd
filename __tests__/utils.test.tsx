import { createElement, updateElement, removeElement } from '../src/utils'
import h from '../src/h'

test('utils test createElement', () => {
  let vnode = <div>1</div>
  let el = createElement(vnode)
  expect(el.outerHTML).toBe('<div>1</div>')
})

test('test createElement with props', () => {
  function onclick () { console.log('hello world') }
  let vnode = 
  <div class="test" onclick={onclick}>
    2<span style={{ color: 'red' }}>span tag</span>
  </div>
  let el = createElement(vnode)
  expect(el.outerHTML).toBe('<div class="test">2<span style="color: red;">span tag</span></div>')
  expect(el.onclick).toEqual(onclick)
})