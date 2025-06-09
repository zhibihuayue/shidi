// 导入WildlifeConservationCamera组件
import WildlifeBirdCamera from './src/entry/WildlifeBirdCamera.vue'

// 定义WildlifeConservationCamera组件的install方法
WildlifeBirdCamera.install = function (Vue) {
  // 将WildlifeConservationCamera组件注册为全局组件
  Vue.component(WildlifeBirdCamera.name, WildlifeBirdCamera)
}

// 导出WildlifeConservationCamera组件
export default WildlifeBirdCamera
