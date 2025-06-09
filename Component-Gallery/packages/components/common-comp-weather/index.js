import Weather from './src/entry/CommonWeather.vue'

Weather.install = function (Vue) {
  Vue.component(Weather.name, Weather)
}

export default Weather
