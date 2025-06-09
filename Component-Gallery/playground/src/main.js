/*
 * @Author: 米亚流年
 * @Date: 2024-01-13 11:43:20
 * @LastEditors: 逗逗飞
 * @LastEditTime: 2024-05-07 17:35:09
 * @FilePath: /common-comp/examples/main.js
 */
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import classNames from 'classnames'
import { setup } from '@component-gallery/theme-chalk/src/index'
import '@component-gallery/theme-chalk/src/index.scss'
import router from '../router'
import App from './App.vue'
import { info } from './mock/storeData.js'
import { pxToRemMixin } from './pxToRem.js'
import CtIcons from '@ct/icons-v2'
import * as echarts from "echarts";
import EasyPlayer from '#/EasyPlayer-component.min.js'
import iframeSDK from '@ct/iframe-connect-sdk'
import CTMapOl from '@ct/ct_map_ol'
import '@ct/ct_map_ol/index.css'

window['@ct/ct map ol'] = CTMapOl
window.iframeSDK = iframeSDK

window.Vue = Vue
// import Banner from '@component-gallery/banner'
// Vue.use(Banner)
Vue.prototype.$echarts = echarts;
Vue.use(Element)
Vue.use(CtIcons)
Vue.prototype.$classNames = classNames
Vue.prototype.isCross = true
localStorage.setItem('isCross', true)
Vue.mixin(pxToRemMixin)
Vue.config.productionTip = false
Vue.component('EasyPlayer', EasyPlayer)
/**
 * 动态处理根部font-size
 * @param {string} [direction='v' | 'h'] //- 'v' 竖屏 'h' 横屏
 */
const setRootFontSize = (direction = 'v') => {
  const htmlElement = document.documentElement
  const baseHeight = direction === 'v' ? 1080 : 1920
  const referenceHeight = 1032
  htmlElement.style.fontSize =
    direction === 'v'
      ? `calc((100vh / ${baseHeight}) * 100 * (${baseHeight} / ${referenceHeight}))`
      : `calc((100vw / ${baseHeight}) * 100)`
}
setRootFontSize('v')

window._mainVue = new Vue({
  beforeCreate() {
    Vue.prototype.$globalEventBus = this
    Vue.prototype.$store = info
  },
  router,
  render: (h) => h(App),
  mounted() {
    setup()
  }
}).$mount('#app')
