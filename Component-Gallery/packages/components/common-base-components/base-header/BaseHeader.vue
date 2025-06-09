<template>
  <div class="base-header">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseHeader'
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-header';
</style>
