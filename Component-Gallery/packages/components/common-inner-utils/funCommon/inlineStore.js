/**
 * 内联数据仓库工具类
 * 这个方法是非缓存的全局变量制，用于一些简易的信息传递，不支持响应式
 * 因此，这个方法缓存的只能是在时序上没有问题的数据（不要求实时同步、变更频率很低、变更操作原子化，不会并发）的数据
 * 原则上，组件库应该有一个自己的非耦合式数据状态保存方案
 */

// 目前，这个工具类的方法就是操作window._remoteMetadata
// 直接在业务代码里写也可以，但害怕以后要更新
export function getInlineStore(key) {
  window._remoteMetadata = window._remoteMetadata || {}

  return window._remoteMetadata[key]
}

export function setInlineStore(key, v) {
  window._remoteMetadata = window._remoteMetadata || {}

  window._remoteMetadata[key] = v
}
