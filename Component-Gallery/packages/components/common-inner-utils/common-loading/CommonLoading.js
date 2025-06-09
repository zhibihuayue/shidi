import LoadingComponent from './CommonLoading.vue'
import Vue from 'vue'

let instance

const CommonLoading = {
  show() {
    if (instance) {
      return
    }

    const div = document.createElement('div')
    div.id = 'loading-container'
    document.body.appendChild(div)

    const loadingInstance = Vue.extend(LoadingComponent)
    instance = new loadingInstance()
    instance.$mount('#loading-container')
  },
  hide() {
    instance = null
    const dom = document.querySelector('.jn-base-loading')
    dom && dom.remove()
  }
}

export default CommonLoading
