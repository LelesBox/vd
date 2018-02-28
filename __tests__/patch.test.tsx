import patch, { rootPatch } from '../src/patch'
import h from '../src/h'

const util = require('util')
function logObject(obj) {
  console.log(util.inspect(obj, false, null))
}

test('patch node', () => {
  let node1 = <div>1</div>
  let node2 = <div>2</div>
  let node3 = <div class="deep">
    <span id="2">2</span>
    <section>section</section>
  </div>
  let node4 = <div class="deep deeps">
    <span id="233">2</span>
    <section>section</section>
  </div>
  let el = patch(document.body, null, null, node1)
  expect(el.outerHTML).toBe('<div>1</div>')
  el = patch(document.body, el, node1, node2)
  expect(el.outerHTML).toBe('<div>2</div>')
  el = patch(document.body, el, node2, node3)
  expect(el.outerHTML).toBe('<div class="deep"><span id="2">2</span><section>section</section></div>')
  el = patch(document.body, el, node3, node4)
  expect(el.outerHTML).toBe('<div class="deep deeps"><span id="233">2</span><section>section</section></div>')
})

test("patch with key", () => {
  let createTime = 0
  function oncreate (el, vnode) {
    createTime++
  }
  let node1 = <div class="deep">
    <span oncreate = { oncreate } id="2" key="2">3</span>
    <section>section</section>
  </div>
  let node2 = <div class="deep deeps">
    <section>section</section>
    <span oncreate = { oncreate } id="233" key="2">2</span>
  </div>
  let el = rootPatch(document.body, null, null, node1)
  el = rootPatch(document.body, el, node1, node2)
  expect(el.outerHTML).toBe('<div class="deep deeps"><section>section</section><span id="233">2</span></div>')
  expect(createTime).toBe(1)
})

test("patch with no key", () => {
  let createTime = 0
  function oncreate (el, vnode) {
    createTime++
  }
  let node1 = <div class="deep">
    <span oncreate = { oncreate } id="2" key="2">3</span>
    <section>section</section>
  </div>
  let node2 = <div class="deep deeps">
    <section>section</section>
    <span oncreate = { oncreate } id="233">2</span>
  </div>
  let el = rootPatch(document.body, null, null, node1)
  el = rootPatch(document.body, el, node1, node2)
  expect(el.outerHTML).toBe('<div class="deep deeps"><section>section</section><span id="233">2</span></div>')
  expect(createTime).toBe(2)
})