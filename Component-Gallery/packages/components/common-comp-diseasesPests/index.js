import DiseasesPests from './src/entry/DiseasesPests.vue'

DiseasesPests.install = function (Vue) {
  Vue.component(DiseasesPests.name, DiseasesPests)
}

export default DiseasesPests
