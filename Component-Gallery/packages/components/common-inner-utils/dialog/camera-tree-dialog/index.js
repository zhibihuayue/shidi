import Vue from 'vue'

import CameraTreeInfoWindow from './CameraTreeInfoWindow.vue'

let vueInstance = null
const VueComp = Vue.extend(CameraTreeInfoWindow)

const cameraInfoWindow = {
  // 打开
  show(options) {
    console.log('cameraInfoWindow_options', options)
    // 先挂载自定义节点
    moundMySelfNode()
    vueInstance = new VueComp({ propsData: options })
    let dom = document.getElementById('cameraTreeMapDialog_wc')
    const subdom = document.createElement('div')
    dom.appendChild(subdom)
    vueInstance.$mount(subdom)
  },
  // 关闭
  close() {
    vueInstance?.$destroy()
  }
}
const moundMySelfNode = async () => {
  let dom = document.getElementById('cameraTreeMapDialog_wc')
  if (dom) {
    dom.remove()
  }
  const mapPopNode = document.createElement('div')
  mapPopNode.id = 'cameraTreeMapDialog_wc'
  document.body.appendChild(mapPopNode)
}

export default cameraInfoWindow
