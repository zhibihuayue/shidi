<template>
  <button
    type="button"
    class="base-button"
    :class="baseButtonClass"
    :style="[heightStyle, widthStyle]"
    @click="handleClick"
  >
    <strong />
    <span :style="[heightSpanStyle]" class="base-button_content" v-if="$slots.default">
      <slot></slot>
    </span>

    <!--这里em的位置不要乱动，之前b标签的样式用了last-child dom树改变结构，会导致样式错乱。-->
    <em></em>
    <em></em>
    <em></em>

    <strong />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    height: {
      type: [Number, undefined],
      default: undefined
    },
    width: {
      type: [Number, undefined],
      default: undefined
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    // Computes the class for the base button based on the type prop
    baseButtonClass() {
      return this.type ? 'base-button--' + this.type : 'base-button--default'
    },
    // Computes the style for the button height
    heightStyle() {
      // Checks if the height prop is a number
      if (typeof this.height === 'number') {
        // Returns an object with styles for height, padding-top, and padding-bottom
        return {
          'height': this.pxToRem(this.height),
          // 'line-height': this.pxToRem(this.height), // This line is commented out
          'padding-top': 0,
          'padding-bottom': 0
        }
      }
      // Returns an empty object if height is not a number
      return {}
    },
    // Computes the style for the span height within the button
    heightSpanStyle() {
      // Checks if the height prop is a number
      if (typeof this.height === 'number') {
        // Returns an object with style for line-height
        return {
          'line-height': this.pxToRem(this.height)
        }
      }
      // Returns an empty object if height is not a number
      return {}
    },
    // Computes the style for the button width
    widthStyle() {
      // Checks if the width prop is a number
      if (typeof this.width === 'number') {
        // Returns an object with style for width
        return { width: this.pxToRem(this.width) }
      }
      // Returns an empty object if width is not a number
      return {}
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    },
    pxToRem(px) {
      return `${px / 100}rem`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-button';
</style>
