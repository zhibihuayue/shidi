<template>
  <em v-bind="$attrs" :class="icons" :disabled="disabled" :style="iconStyle" @click="handleClick" />
</template>
<script>
export default {
  name: 'base-icon',
  // 定义props属性
  props: {
    // 定义iconClass属性，类型为String，必须
    iconClass: {
      type: String,
      required: true
    },
    // 定义activeClass属性，类型为String
    activeClass: {
      type: String
    },
    // 定义iconStyle属性，类型为String
    iconStyle: {
      type: String
    },
    // 定义disabled属性，类型为Boolean，默认为false
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    handleClick(e) {
      if (this.disabled) {
        return
      }
      this.isActive = !this.isActive
      this.$emit('click', e)
    }
  },
  computed: {
    icons() {
      return this.$classNames(
        'iconfont_tools',
        this.activeClass && this.isActive ? this.activeClass : false,
        this.iconClass ? this.iconClass : false,
        this.disabled ? 'disabled' : false
      )
    }
  }
}
</script>
<style lang="scss">
i {
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
  }
}
</style>
