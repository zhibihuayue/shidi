<template>
  <el-tooltip
    effect="dark"
    trigger="hover"
    :content="content"
    :disabled="isDisabled"
    :placement="placement"
    :popper-class="popperClass"
    :open-delay="delay"
  >
    <slot name="default" ref="targetEl" />
  </el-tooltip>
</template>
<script>
export default {
  name: 'TextTooltip',
  // 定义props
  props: {
    // tooltip的内容
    content: {
      // 类型为字符串
      type: String,
      // 默认为空字符串
      default: ''
    },
    // tooltip的位置
    placement: {
      // 类型为字符串
      type: String,
      // 默认为'top'
      default: 'top'
    },
    // tooltip的样式类
    popperClass: {
      // 类型为字符串
      type: String,
      // 默认为空字符串
      default: ''
    },
    // 延迟多少毫秒出现
    delay: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      isDisabled: false,
      count: 0
    }
  },
  mounted() {
    this.initToolTip()
  },
  methods: {
    initToolTip() {
      const children = typeof this.$slots.default === 'function' ? this.$slots.default() : this.$slots.default
      const el = children?.[0].elm
      // 如果在树结构组件中引入此组件，在展开节点前这个dom未渲染,取到的clientWidth和scrollWidth会都为0
      if (el.clientWidth === 0 && this.count < 5) {
        setTimeout(() => {
          this.count++
          this.initToolTip()
        }, 300)
        return
      }
      // console.log('target:', el,el.clientWidth, el.scrollWidth)
      // console.log('asd', el.clientWidth < el.scrollWidth)
      if (el) {
        // console.log('el存在')
        this.isDisabled = !(el.clientWidth < el.scrollWidth)
      }
    }
  }
  // computed: {
  //   isOverflow() {
  //     const element = this.$refs.child
  //     return element.clientWidth < element.scrollWidth
  //   }
  // }
}
</script>
