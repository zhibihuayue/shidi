<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-22 17:06:20
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-25 08:59:00
 * @FilePath: /Component-Gallery/packages/components/common-base-components/base-form-inner/base-collapse/BaseCollapse.vue
 * @Description:
-->
<template>
  <div class="collapse-item">
    <div class="header" @click="handleClick">
      <slot name="title">
        <div class="header_label">{{ title }}</div>
      </slot>
      <ct-icon :class="['arrow', { rotate: opened }]" :name="icon" :size="size" />
    </div>
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="opened" class="content" :class="{ opened: opened }">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseCollapse',
  props: {
    // 标题属性
    title: {
      type: String,
      required: true // 必填
    },
    // 名称属性
    name: {
      type: [String, Number], // 类型为字符串或数字
      required: true // 必填
    },
    // 图标属性
    icon: {
      type: String,
      required: false, // 非必填
      default: 'video-storage' // 默认值为'video-storage'
    },
    // 尺寸属性
    size: {
      type: String,
      required: false, // 非必填
      default: '10' // 默认值为'10'
    },
    // 动画时间属性
    animationTime: {
      type: Number, // 类型为数字
      default: 300 // 默认值为300
    },
    // 每帧动画时间属性
    frameAnimationTime: {
      type: Number, // 类型为数字
      default: 20 // 默认值为20
    }
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    handleClick() {
      // eslint-disable-next-line vue/no-undef-properties
      // 调用父组件的changeState方法，传入当前组件的uid和name
      this.$parent.changeState(this._uid, this.name)
    },
    beforeEnter(el) {
      // 动画之前，设置元素的高度为0
      el.style.height = 0
    },
    enter(el, done) {
      // hack：base-upload组件高度不能准确计算，需要延迟执行
      setTimeout(() => {
        // 动画过程 获取元素的实际高度
        let height = el.scrollHeight
        // 计算每帧动画的步长
        let step = (height / 300) * 20
        // 初始化距离为0
        let distance = 0
        // 定义动画变化函数
        let change = () => {
          // 每帧增加步长
          distance += step
          // 如果距离小于高度，则更新元素的高度并继续动画
          if (distance < height) {
            el.style.height = `${distance}px`
            requestAnimationFrame(change)
          } else {
            // 如果距离等于或大于高度，则设置元素的高度为实际高度，并完成动画
            el.style.height = `${height}px`
            done()
          }
        }
        // 开始动画
        requestAnimationFrame(change)
      })
    },
    afterEnter(el) {
      // 动画完成后，打印元素
      console.log(el)
    },
    leave(el, done) {
      // 动画过程
      // 获取元素的实际高度
      let height = el.scrollHeight
      // 计算每帧动画的步长
      let step = (height / this.animationTime) * this.frameAnimationTime
      // 定义动画变化函数
      let change = () => {
        // 每帧减少步长
        height -= step
        // 如果高度大于0，则更新元素的高度并继续动画
        if (height > 0) {
          el.style.height = `${height}px`
          requestAnimationFrame(change)
        } else {
          // 如果高度小于或等于0，则设置元素的高度为0，并完成动画
          el.style.height = 0
          done()
        }
      }
      // 开始动画
      requestAnimationFrame(change)
    },
    afterLeave(el) {
      // 动画完成后，打印元素
      console.log(el)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-collapse-group.scss';
</style>
