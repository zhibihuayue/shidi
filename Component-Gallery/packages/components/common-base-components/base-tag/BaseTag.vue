<template>
  <el-tag
    class="base-tag"
    :class="{ 'base-tag--active': active }"
    size="small"
    :disable-transitions="disableTransitions"
    @click="handleClick"
  >
    <div class="base-tag-content"><slot></slot></div>
  </el-tag>
</template>

<script>
import { Tag } from 'element-ui'
export default {
  name: 'BaseTag',
  components: {
    [Tag.name]: Tag
  },
  // Props for BaseTag component
  props: {
    // Prop to disable transitions
    disableTransitions: {
      type: Boolean,
      default: false
    },
    // Prop to set the active state
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-tag';
</style>
