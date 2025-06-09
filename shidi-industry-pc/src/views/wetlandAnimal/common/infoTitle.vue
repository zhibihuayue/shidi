<template>
  <div class="title">
    <span class="color-box"></span>
    <span class="title-name">{{ titleName }}</span>
    <slot name="info"></slot>
    <slot name="btn"></slot>
  </div>
</template>

<script>
export default {
  name: "info-title",
  props: {
    titleName: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  margin-bottom: px-to-rem(24);
  position: relative;
  .color-box {
    display: block;
    height: px-to-rem(16);
    margin-right: px-to-rem(10);
    border: px-to-rem(3) solid #ff6a6c;
  }
  .title-name {
    font-size: px-to-rem(16);
    font-weight: 500;
  }

}
</style>
