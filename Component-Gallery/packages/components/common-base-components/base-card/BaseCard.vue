<template>
  <div :class="{ ...baseCardClass, ...showTerracottaCornerClass }">
    <div :class="{ ...baseCardContentClass, ...showAquamarineCornerClass }">
      <div
        :class="{
          ...baseCardContentHeaderClass,
          ...showAquamarineBgCenterClass
        }"
        v-if="showHeader"
      >
        <slot name="header" />

        <div
          :class="{
            ...baseCardContentHeaderLineClass,
            ...showTerracottaLineClass,
            ...showAquamarineLineClass,
            ...showAquamarineLineCenterClass
          }"
        >
        </div>
      </div>

      <div :class="baseCardContentCloseClass" v-if="showClose" @click="onClose"> </div>

      <div :class="baseCardContentBodyClass">
        <slot name="body" />
      </div>

      <div class="aquamarine-right-corner"></div>
    </div>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('base')

export default {
  name: 'BaseCard',
  props: {
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 是否显示头部信息
    showHeader: {
      type: Boolean,
      default: true
    },
    // 是否显示璧山绿line样式
    showAquamarineLine: {
      type: Boolean,
      default: true
    },
    // 是否显示赤土黄line样式
    showTerracottaLine: {
      type: Boolean,
      default: true
    },
    // 是否显示赤土黄倒角
    showTerracottaCorner: {
      type: Boolean,
      default: true
    },
    // 璧山绿line是否居中
    isAquamarineLineCenter: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // Computes the base card class
    baseCardClass() {
      return {
        [bem.b('card')]: true // Returns the base card class
      }
    },
    // Computes the base card content class
    baseCardContentClass() {
      return {
        [bem.b('card-content')]: true // Returns the base card content class
      }
    },
    // Computes the base card content header class
    baseCardContentHeaderClass() {
      return {
        [bem.b('card-content-header')]: true // Returns the base card content header class
      }
    },
    // Computes the base card content header title class
    baseCardContentHeaderTitleClass() {
      return {
        [bem.be('card-content-header', 'title')]: true // Returns the base card content header title class
      }
    },
    // Computes the base card content header others class
    baseCardContentHeaderOthersClass() {
      return {
        [bem.be('content-header', 'others')]: true // Returns the base card content header others class
      }
    },
    // Computes the base card content header line class
    baseCardContentHeaderLineClass() {
      return {
        [bem.be('card-content-header', 'line')]: true // Returns the base card content header line class
      }
    },
    // Computes the base card content close class
    baseCardContentCloseClass() {
      return {
        [bem.b('card-content-close')]: true // Returns the base card content close class
      }
    },
    // Computes the base card content body class
    baseCardContentBodyClass() {
      return {
        [bem.be('card-content', 'body')]: true // Returns the base card content body class
      }
    },
    // Computes the show aquamarine line center class
    showAquamarineLineCenterClass() {
      return { 'is-aquamarine-line-center': !!this.isAquamarineLineCenter } // Returns the show aquamarine line center class
    },
    // Computes the show aquamarine bg center class
    showAquamarineBgCenterClass() {
      return { 'is-aquamarine-bg-center': !!this.isAquamarineLineCenter } // Returns the show aquamarine bg center class
    },
    // Computes the show terracotta line class
    showTerracottaLineClass() {
      return { 'is-show-terracotta-line': !!this.showTerracottaLine } // Returns the show terracotta line class
    },
    // Computes the show aquamarine line class
    showAquamarineLineClass() {
      return { 'is-show-aquamarine-line': !!this.showAquamarineLine } // Returns the show aquamarine line class
    },
    // Computes the show aquamarine corner class
    showAquamarineCornerClass() {
      return { 'is-show-aquamarine-corner': !this.showHeader } // Returns the show aquamarine corner class
    },
    // Computes the show terracotta corner class
    showTerracottaCornerClass() {
      return { 'is-show-terracotta-corner': !!this.showTerracottaCorner } // Returns the show terracotta corner class
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-card';
</style>
