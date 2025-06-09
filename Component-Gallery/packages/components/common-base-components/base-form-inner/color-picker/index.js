import ColorPicker from './src/ColorPicker.vue'

/* istanbul ignore next */
ColorPicker.install = function (Vue) {
  Vue.component(ColorPicker.name, ColorPicker)
}

export default ColorPicker
