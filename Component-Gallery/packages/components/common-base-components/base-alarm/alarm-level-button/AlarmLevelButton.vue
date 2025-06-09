<template>
  <button :style="levelBgStyle" class="alarm-level-button__namespace" v-if="levelText.length">
    {{ levelText }}
  </button>
</template>

<script>
// This is the default export for the AlarmLevelButton component
export default {
  // These are the props for the component
  props: {
    // The level prop is a string and defaults to an empty string
    level: {
      type: String,
      default: ''
    },
    // The levelName prop is a string and defaults to an empty string
    levelName: {
      type: String,
      default: ''
    }
  },
  // These are the computed properties for the component
  computed: {
    // The levelText computed property returns the level in Chinese if it exists, otherwise it returns the level name
    levelText() {
      if (this.level) {
        switch (this.level) {
          case '1':
            return '一级'
          case '2':
            return '二级'
          case '3':
            return '三级'
          case '4':
            return '四级'
          default:
            return ''
        }
      }
      return this.levelName
    },
    // The levelBgStyle computed property returns the background style based on the level text
    levelBgStyle() {
      switch (this.levelText) {
        case '一级':
          return {
            background: 'linear-gradient( 90deg, #F56C6C 0%, #DA2727 100%)'
          }
        case '二级':
          return {
            background: 'linear-gradient( 135deg, #FF8458 0%, #FF694C 100%)'
          }
        case '三级':
          return {
            background: 'linear-gradient( 90deg, #D4B02D 0%, #BD9400 100%)'
          }
        case '四级':
          return {
            background: 'linear-gradient( 90deg, #52A1E5 0%, #1F7CCC 100%)'
          }
        default:
          return {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-wiseblue'] .alarm-level-button__namespace {
  --text-color: #e8f3fe;
  --text-color-70: rgba(232, 243, 254, 0.7);
  --button-text-color: #ffffff;
}

[data-theme='theme-aquamarine'] .alarm-level-button__namespace {
  --text-color: #ffffff;
  --text-color-70: rgba(255, 255, 255, 0.7);
}

[data-theme='theme-terracotta'] .alarm-level-button__namespace {
  --text-color: #e4e7c1;
  --text-color-70: rgba(228, 231, 193, 0.7);
}

.alarm-level-button__namespace {
  height: px-to-rem(20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: px-to-rem(12);
  min-width: px-to-rem(40);
  color: var(--button-text-color);
  padding: 0;
  border: none;
  border-radius: px-to-rem(4);
  line-height: 1;
}
</style>
