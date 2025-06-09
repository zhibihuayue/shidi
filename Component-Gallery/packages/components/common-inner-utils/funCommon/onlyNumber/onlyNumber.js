/*
 * @Author: 逗逗飞
 * @Date: 2024-05-15 14:09:42
 * @LastEditors: 逗逗飞
 * @LastEditTime: 2024-05-15 14:11:29
 * @FilePath: /Component-Gallery/packages/components/common-comp-video/src/directives/onlynumber.js
 * @Description: 自定义指令 v-only-number
 */
import Vue from 'vue'
Vue.directive('only-number', {
  inserted(el, vDir) {
    // vDir.value 有指令的参数
    let content
    //按键按下=>只允许输入 数字/小数点
    el.addEventListener('keypress', (event) => {
      let e = event || window.event
      let inputKey = String.fromCharCode(
        typeof e.charCode === 'number' ? e.charCode : e.keyCode
      )
      let re = /\d|\./
      content = e.target.value
      //定义方法,阻止输入
      function preventInput() {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
      if (!re.test(inputKey) && !e.ctrlKey) {
        preventInput()
      } else if (content.indexOf('.') > 0 && inputKey === '.') {
        //已有小数点,再次输入小数点
        preventInput()
      } else {
        //防止代码扫描
      }
    })
    //按键弹起=>并限制最大最小
    el.addEventListener('keyup', (event) => {
      handleData(event)
    })
    //失去焦点=>保留指定位小数
    el.addEventListener('focusout', (event) => {
      //此处会在 el-input 的 @change 后执行
      handleData(event)
    })
    function handleData(event) {
      let e = event || window.event
      content = parseFloat(e.target.value)
      if (!content) {
        content = 0.0
      }
      //限制最大最小
      let arg_max = ''
      let arg_min = ''
      if (vDir.value) {
        arg_max = parseFloat(vDir.value.max)
        arg_min = parseFloat(vDir.value.min)
      }
      if (arg_max && content > arg_max) {
        e.target.value = arg_max
        content = arg_max
      }
      if (arg_min && content < arg_min) {
        e.target.value = arg_min
        content = arg_min
      }

      let arg_precision = 0 //默认保留至整数
      if (vDir.value.precision) {
        arg_precision = parseFloat(vDir.value.precision)
      }
      if (String(content).indexOf('.') > -1) {
        e.target.value = content.toFixed(arg_precision)
      } else {
        e.target.value = content
      }
      e.target.dispatchEvent(new Event('input'))
    }
  }
})
