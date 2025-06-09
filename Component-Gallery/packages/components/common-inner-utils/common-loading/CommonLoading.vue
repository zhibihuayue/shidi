<template>
  <div class="jn-base-loading">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/jn-loading';
</style>
