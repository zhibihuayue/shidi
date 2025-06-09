// 物种详情弹框基础版
import Vue from 'vue'
import index from './Index.vue'
let domId = 'wc-species-detail-pop'
let vueInstance = null
const VueComp = Vue.extend(index)

export default {
  // 打开
  show(options) {
    console.log(domId + 'show_options', options)
    // 先挂载自定义节点
    moundMySelfNode()
    let propsData_ = { ...options, domId }
    vueInstance = new VueComp({ propsData: { propsData: propsData_ } })
    let dom = document.getElementById(domId)
    const subdom = document.createElement('div')
    dom.appendChild(subdom)
    vueInstance.$mount(subdom)
  },
  // 关闭
  close() {
    vueInstance?.$destroy()
    let dom = document.getElementById(domId)
    if (dom) {
      dom.remove()
    }
  }
}
const moundMySelfNode = async () => {
  let dom = document.getElementById(domId)
  if (dom) {
    dom.remove()
  }
  const mapPopNode = document.createElement('div')
  mapPopNode.id = domId
  document.body.appendChild(mapPopNode)
}
