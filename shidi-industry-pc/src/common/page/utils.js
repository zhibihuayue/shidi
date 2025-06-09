import {statisticsFeature} from "@/http/environment";

export const clickoutside = {
    bind(el, binding, vnode) {
      function documentHandler(e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
          return false
        }
        // 判断指令中是否绑定了函数
        if (binding && binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          if (binding.value && binding.value(e)) {
            binding.value(e)
          }
        }
      }
      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = documentHandler
      document.addEventListener('click', documentHandler)
    },
    unbind(el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  }
  
  export const SELECT_STATE = {
    unselect: 0,
    selecting: 1,
    selected: 2
  }

  // 处理小数位数的方法(只针对于已经保留好两位小数的数据)
  export const formattedValue = (value)=>{
    if(!value) return 0
    let num = Number(value)
    if(num % 1 == 0){
      // 如果是整数 直接返回整数部分
      return num.toFixed(0)
    } else if(num * 10 % 1 == 0){
      // 如果有一位小数
      return num.toFixed(1)
    } else {
      // 默认保留两位小数
      return num.toFixed(2)
    }
  }