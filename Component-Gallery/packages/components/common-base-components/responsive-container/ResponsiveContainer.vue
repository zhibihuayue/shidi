<!--
  定位容器。
  这个容器用于锚定于某一个页面元素固定位置的容器。
  这个容器不可拖拽、视为父元素的子元素。
-->
<template>
  <div
    :class="[
      bemClass.container,
      industryClass,
      highlightTitle && 'highlight-title'
    ]"
    ref="responsiveContainer"
    :style="{
      left: left && `${pxToRem(left)}`,
      right: right && `${pxToRem(right)}`,
      top: top && `${pxToRem(top)}`,
      bottom: bottom && `${pxToRem(bottom)}`,
      width: width && `${pxToRem(width)}`
    }"
    @mousedown="onMouseDown"
  >
    <div v-if="canClose" :class="[bemClass.close]" @click="close" />
    <div class="previous-vacancies" />

    <div
      v-if="headTitle"
      :class="[
        bemClass.header,
        highlightTitle && 'highlight-title',
        leftTitle && 'left-title'
      ]"
    >
      <div :class="[bemClass.headertitle]">
        <slot name="title" />
        <span v-if="!$slots.headTitle">{{ headTitle }}</span>
      </div>
      <slot name="extra" />
      <em
        v-if="leftTitle && canCollapse"
        :class="[
          'iconfont_tools title-pointer icon-linye_icon_biaotizhankai_you',
          cardOpen && 'isOpen'
        ]"
        @click="onToggleHeader"
      />
    </div>
    <div
      :class="[bemClass.body, !cardOpen && 'hidebody']"
      :style="{ height: cardOpen ? height && `${pxToRem(height)}` : '0' }"
    >
      <slot />
    </div>
    <div class="subsequent-vacancies" />
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('innercomp-abcontainer')

export default {
  name: 'responsiveContainer',
  props: {
    left: Number,
    top: Number,
    right: Number,
    bottom: Number,
    width: Number,
    height: {
      type: Number,
      default: 160
    },
    industryClass: {
      type: String,
      default: 'common-iw-s'
    },
    headTitle: {
      // 标题。如果不填写的话，整个header区域不会出现。
      type: String,
      default: ''
    },
    canClose: {
      // 是否展示关闭按钮，关闭按钮会触发close事件。
      type: Boolean,
      default: false
    },
    highlightTitle: {
      // 标题（header部分）是否用存在底色、加粗的高亮方法呈现
      type: Boolean,
      default: true
    },
    leftTitle: {
      // 标题是否左对齐。默认这些容器的标题为左对齐
      type: Boolean,
      default: true
    },
    stopMousedownBody: {
      // 是否阻止body层的mousedown事件冒泡。这个props一般是用来避免拖拽误操作用的，默认是拦截body，这样用户就只能靠header拖动
      // 如有需要，置为false即可
      type: Boolean,
      default: true
    },
    canCollapse: {
      // 是否有折叠事件
      type: Boolean,
      default: true
    },
    isOpen: {
      // 是否展开默认展开
      type: Boolean,
      default: true
    }
  },
  watch: {
    isOpen() {
      if (this.isOpen !== undefined) {
        this.cardOpen = this.isOpen
      }
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b(''),
        header: bem.b('header'),
        body: bem.b('body', 'rscardbody'),
        close: bem.b('close'),
        headertitle: bem.be('header', 'title')
      }
    }
  },
  data() {
    return {
      cardOpen: true
    }
  },
  mounted() {
    if (this.isOpen !== undefined) {
      this.cardOpen = this.isOpen
    }
  },
  methods: {
    onMouseDown(event) {
      if (this.stopMousedownBody) {
        event.stopPropagation()
      }
    },
    onToggleHeader() {
      if (this.canCollapse) {
        this.cardOpen = !this.cardOpen
        this.$emit('toggle', this.cardOpen)
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/responsive-container';
</style>
