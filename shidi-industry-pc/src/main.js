/*
 * @Author: 米亚流年 miyaliunian@gmail.com
 * @Date: 2024-01-12 13:10:39
 * @LastEditors: fanzhiwei
 * @LastEditTime: 2024-06-25 19:35:59
 * @FilePath: /shidi-industry/shidi-industry-pc/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import App from './App.vue';
import CTMapOl from '@ct/ct_map_ol';
import "@ct/ct_map_ol/index.css"
import classNames from 'classnames';
import { setup } from "@ct/component-gallery-theme-chalk/js/index.js";
import '@ct/component-gallery-theme-chalk/css/index.css';
import router from './router';
import store from './store/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ChinaTowerUI from '@ct/china-tower-ui';

import iframeSDK,{requestSDK} from "@ct/iframe-connect-sdk"

import '@/assets/styles/common.scss';
import '@/assets/styles/commonClass.scss'
import { pxToRemMixin } from './common/pxToRem';

import * as echarts from "echarts";
import BaseVideoListener from "@ct/component-gallery-video-player-listener"
import "@ct/component-gallery-video-player-listener/common-base-component-video-player-listener.css"
import CtIcons from '@ct/icons-v2'

import EasyPlayer from "#/EasyPlayer-component.min.js"
Vue.component('EasyPlayer', EasyPlayer)

Vue.use(CtIcons)
// 暴露全局引用。组件库里把Vue和地图工具类独立了出去，对应的集成工程需要将这两个引用暴露到window，不然集成组件无法正常工作。
window.Vue = Vue;
window.CTMapOl= CTMapOl;
window['@ct/ct_map_ol'] = CTMapOl;
window.iframeSDK=iframeSDK
window.requestSDK=requestSDK
Vue.config.productionTip = false;
Vue.prototype.$classNames = classNames;

Vue.prototype.isCross = true;
Vue.use(ElementUI);
Vue.mixin(pxToRemMixin);
localStorage.setItem('isCross', true);

Vue.use(BaseVideoListener)

Vue.prototype.$echarts = echarts;
Vue.use(ChinaTowerUI); 

window._mainVue = new Vue({
  store,
  router,
  beforeCreate() {
    Vue.prototype.$globalEventBus = this;
  },
  render: h => h(App),
  mounted() {
    setup() //  增加动态colors能力，文档路径 Component-Gallery/docs/demo/vueDocs/change-colors.vue_doc.md
  }
}).$mount('#app');
