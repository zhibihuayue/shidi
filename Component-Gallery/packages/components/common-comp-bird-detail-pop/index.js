// 导入WildlifeConservationCamera组件
import BirdDetailPop from './entry/BirdDetailPop.vue'

// 定义WildlifeConservationCamera组件的install方法
BirdDetailPop.install = function (Vue) {
  // 将WildlifeConservationCamera组件注册为全局组件
  Vue.component(BirdDetailPop.name, BirdDetailPop)
}

// 导出WildlifeConservationCamera组件
export default BirdDetailPop
