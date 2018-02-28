// vnode接口
export interface vnode {
  name: string,
  props: { key?: string, oncreate?: Function, onremove?: Function, onupdate?: Function, ondestroy?, style?: {} } | null,
  children: Array<vnode | string>
}

// 组件函数接口，必须返回一个vnode
export interface ComponentFunc {
  (...reset): vnode
}