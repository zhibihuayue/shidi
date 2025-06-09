<template>
  <div class="base-image-error" :style="{ backgroundSize: backgroundSize }"></div>
</template>

<script>
export default {
  props: {
    backgroundSize: {
      type: String,
      default: '46%'
    }
  }
}
</script>
<style lang="scss" scoped>
.base-image-error {
  border-radius: px-to-rem(4);
  background-color: #0f1926;
  width: 100%;
  height: 100%;
  background-image: url('~@component-gallery/assets/image/image-error.svg');
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
