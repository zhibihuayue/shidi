<template>
  <div class="title">
    <span class="color-box"></span>
    <span class="title-name">{{ titleName }}</span>
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
  .color-box {
    display: block;
    height: px-to-rem(25);
    margin-right: px-to-rem(10);
    border: px-to-rem(3) solid #ff6a6c;
  }
  .title-name {
    font-size: px-to-rem(25);
    font-weight: 500;
  }
}
</style>
