import Map from './src/entry/CommonMap.vue'

Map.install = function (Vue) {
  Vue.component(Map.name, Map)
}

export default Map
