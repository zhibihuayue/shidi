import CommonCardDevTree from './src/entry/CommonCardDevTree.vue'

CommonCardDevTree.install = function (Vue) {
  Vue.component(CommonCardDevTree.name, CommonCardDevTree)
}
export default CommonCardDevTree
