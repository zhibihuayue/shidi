<template>
  <svg
    v-if="icon"
    class="svg-icon"
    :mode="mode"
    :style="{
      fontSize: size / 100 + 'rem',
      width: width / 100 + 'rem',
      height: height / 100 + 'rem',
      color: color
    }"
  >
    <use :xlink:href="iconName"></use>
  </svg>
  <img v-else :src="url" alt="" />
</template>

<script>
export default {
  name: 'base-icon-svg',
  props: {
    icon: {
      //svg图标名称
      type: String,
      required: false
    },
    url: {
      //svg图标名称
      type: String,
      required: false
    },
    mode: {
      type: String,
      default: 'common'
    },
    color: {
      type: String,
      default: '#fff'
    },
    size: {
      //svg尺寸
      type: [Number, String]
    },
    width: {
      //svg宽度
      type: [Number, String]
    },
    height: {
      //svg高度
      type: [Number, String]
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.icon}`
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
