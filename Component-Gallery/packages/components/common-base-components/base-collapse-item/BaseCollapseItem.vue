<!--
  告警详情折叠面板。
-->
<template>
  <div :class="[bemClass.container]">
    <div class="previous-vacancies" />
    <div :class="[bemClass.header]">
      <slot name="title" />
      <div
        v-if="!$slots.title"
        :class="[bemClass.headerTitle, addMargin ? '' : bemClass.headerMargin]"
        @click="handleClick"
      >
        <div class="title"><strong></strong>{{ title }}</div>
        <div v-if="!hideIcon" class="collapse-icon">
          <em :class="[isActive ? `iconfont_tools ${expandIcon}` : `iconfont_tools ${shrinkIcon}`]" />
        </div>
      </div>
    </div>
    <div :class="[bemClass.body]">
      <slot />
    </div>
    <div class="subsequent-vacancies" />
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('base-collapse-item')

export default {
  name: 'base-collapse-item',
  props: {
    // 定义标题的props
    title: {
      type: String,
      default: ''
    },
    // 定义是否激活的props
    isActive: {
      type: Boolean,
      default: false
    },
    // 定义是否添加边距的props
    addMargin: {
      type: Boolean,
      default: false
    },
    // 定义收缩图标的props
    shrinkIcon: {
      type: String,
      default: 'icon-tongyong_icon_xiala'
    },
    // 定义展开图标的props
    expandIcon: {
      type: String,
      default: 'icon-tongyong_icon_shouqi'
    }
  },
  computed: {
    // This computed property checks if both expandIcon and shrinkIcon are not set
    hideIcon() {
      return !this.expandIcon && !this.shrinkIcon
    },
    // This computed property generates BEM class names for different parts of the component
    bemClass() {
      return {
        // Generates the base class for the container
        container: bem.b(''),
        // Generates the base class for the header
        header: bem.b('header'),
        // Generates the base class for the body
        body: bem.b('body'),
        // Generates the element class for the header title
        headerTitle: bem.be('header', 'title'),
        // Generates the element class for the header margin
        headerMargin: bem.be('header', 'margin')
      }
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-collapse-item';
</style>
