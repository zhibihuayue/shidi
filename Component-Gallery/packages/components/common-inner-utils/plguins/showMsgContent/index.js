import Vue from 'vue'
import CustomMsgContent from './CustomMsgContent.vue'

const MessageConstructor = Vue.extend(CustomMsgContent)

let instances = {}

/**
 * 函数式调用局部 toast组件
 * @param {string} text  显示的文本
 * @param {boolean} one  是否只显示一个
 * @param {string } targetId  目标元素id
 * @param {number} topOffset  顶部偏移量
 * @returns vue-sfc
 */
export const showMessage = (text, one = false, targetId, topOffset = 0) => {
  if (typeof topOffset !== 'number') {
    console.error('topOffset must be a number.')
    return
  }

  const target = document.getElementById(targetId)
  if (!target) {
    console.error(`Target element with id "${targetId}" not found.`)
    return
  }

  if (instances[targetId]) {
    target.removeChild(instances[targetId].$el)
    delete instances[targetId]
  }

  console.log('create new instance')
  instances[targetId] = new MessageConstructor({
    el: document.createElement('div')
  })
  target.appendChild(instances[targetId].$el)

  instances[targetId].showMessage(text, one, topOffset)
}
