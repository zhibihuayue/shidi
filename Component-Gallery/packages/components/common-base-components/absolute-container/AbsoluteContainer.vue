<!--
  定位容器。
  这个容器用于锚定于某一个页面元素（如：工具箱小工具的“弹窗”、告警详情的处置弹窗、设备树的基础容器等）固定位置的容器。
  按要求，这个容器可能会被拖拽、视为父元素的子元素。
-->
<template>
  <div
    :class="[
      bemClass.container,
      industryClass,
      highlightTitle && 'highlight-title',
      noCornerClass,
      processedSpecialStyle
    ]"
    ref="mycontainer"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <div v-if="canClose" :class="[bemClass.close]" @click="close" />
    <div class="previous-vacancies" />

    <div
      v-if="title"
      :class="[
        bemClass.header,
        highlightTitle && 'highlight-title',
        leftTitle && 'left-title'
      ]"
    >
      <div :class="[bemClass.headertitle]">
        <slot name="title" />
        <span v-if="!$slots.title" class="default_title_span">{{ title }}</span>
        <i
          v-if="leftTitle && !noCollapse"
          :class="[
            'iconfont_tools title-pointer icon-linye_icon_biaotizhankai_you',
            cardOpen && 'isOpen'
          ]"
          @click="onToggleHeader"
        />
      </div>
      <slot name="extra" />
    </div>
    <div :class="[bemClass.body]" @mousedown="onMouseDown">
      <slot />
    </div>
    <div class="subsequent-vacancies" />
  </div>
</template>

<script>
import $ from 'jquery'
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('innercomp-abcontainer')

export default {
  name: 'absolute-container',
  props: {
    left: Number,
    top: Number,
    right: Number,
    bottom: Number,
    width: Number,
    height: Number,
    industryClass: {
      type: String,
      default: 'common-iw-s'
    },
    title: {
      // 标题。如果不填写的话，整个header区域不会出现。
      type: String,
      default: ''
    },
    canClose: {
      // 是否展示关闭按钮，关闭按钮会触发close事件。
      type: Boolean,
      default: true
    },
    noCorner: {
      // 是否关闭角装饰（默认启用角装饰）。支持传入数组，用于指定需要关闭的应用,如: ['aquamarine']（仅关闭林业应用角装饰）
      type: [Boolean, Array],
      default: false
    },
    highlightTitle: {
      // 标题（header部分）是否用存在底色、加粗的高亮方法呈现
      type: Boolean,
      default: true
    },
    // 自定义配置项
    specialStyle: {
      default: () => {
        return {
          // 通用主题配置
          wiseblue: {
            striped: false //条纹标题风格
          }
        }
      }
    },
    leftTitle: {
      // 标题是否左对齐。默认这些容器的标题为居中
      type: Boolean,
      default: false
    },
    stopMousedownBody: {
      // 是否阻止body层的mousedown事件冒泡。这个props一般是用来避免拖拽误操作用的，默认是拦截body，这样用户就只能靠header拖动
      // 如有需要，置为false即可
      type: Boolean,
      default: true
    },
    noCollapse: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    offsetData() {
      return {
        left: this.left,
        top: this.top,
        right: this.right,
        bottom: this.bottom
      }
    },
    bemClass() {
      return {
        container: bem.b(''),
        header: bem.b('header'),
        body: bem.b('body'),
        close: bem.b('close'),
        headertitle: bem.be('header', 'title')
      }
    },
    noCornerClass() {
      let no_corner
      if (Array.isArray(this.noCorner)) {
        no_corner = this.noCorner.map((theme) => `no-${theme}-corner`)
      } else {
        no_corner = this.noCorner ? 'noCorner' : ''
      }
      return no_corner
    },
    processedSpecialStyle() {
      if (!this.specialStyle) {
        return
      }
      let result = {}
      if (Array.isArray(this.specialStyle)) {
        // 数组数据源
        this.specialStyle.map((item) => {
          if (this.isPlainObject(item.striped)) {
            // 单一行业配置项
            this.handlingObj(result, item.striped)
          } else {
            // 全部主题配置项
            this.handlingObj(result, item)
          }
        })
      }
      if (this.isPlainObject(this.specialStyle)) {
        // 对象数据源不处理
        result = this.specialStyle
      }
      return this.buildStyleClass(result)
    }
  },
  data() {
    return {
      cardOpen: true
    }
  },
  watch: {
    offsetData(v) {
      //如果传值有改变，重新设置一遍
      // console.log('offsetData_容器组件内部', v)
      const { left, top, bottom, right } = v
      $(this.$refs.mycontainer).css({
        left: left !== undefined ? this.pxToRem(left) : undefined,
        top: top !== undefined ? this.pxToRem(top) : undefined,
        right: right !== undefined ? this.pxToRem(right) : undefined,
        bottom: bottom !== undefined ? this.pxToRem(bottom) : undefined
      })
    }
  },
  mounted() {
    // 一次性设置。外部的偏移量只在初始化时有效，不进响应式，不然会干扰其他渲染
    $(this.$refs.mycontainer).css({
      left: this.left !== undefined ? this.pxToRem(this.left) : undefined,
      top: this.top !== undefined ? this.pxToRem(this.top) : undefined,
      right: this.right !== undefined ? this.pxToRem(this.right) : undefined,
      bottom: this.bottom !== undefined ? this.pxToRem(this.bottom) : undefined,
      width: this.width !== undefined ? this.pxToRem(this.width) : undefined,
      height: this.height !== undefined ? this.pxToRem(this.height) : undefined
    })
  },
  methods: {
    onMouseenter(e) {
      this.$emit('mouseenter', e)
    },
    onMouseleave(e) {
      this.$emit('mouseleave', e)
    },
    handlingObj(newobj, oldobj) {
      for (let [key, value] of Object.entries(oldobj)) {
        newobj[key] = value
      }
    },
    /**
     *
     * @param obj // 当前数据
     * @param parentKey // 嵌套对象的key（行业名称） 用于拼接“具体行业-具体风格”
     * @param result // 最后抛出的class数组
     */
    buildStyleClass(obj, parentKey, result = []) {
      for (let [key, value] of Object.entries(obj)) {
        // 此处必须全等判断是否为true，因为嵌套对象也是非false的。意在取出当前嵌套对象下value为true的key
        if (value === true) {
          const className = parentKey ? `${parentKey}-${key}` : key
          result.push(className)
        }
        this.isPlainObject(value) && this.buildStyleClass(value, key, result)
      }
      return result
    },
    isPlainObject(value) {
      if (typeof value !== 'object' || value === null) {
        return false
      }
      return Object.prototype.toString.call(value) === '[object Object]'
    },
    onMouseDown(event) {
      if (this.stopMousedownBody) {
        event.stopPropagation()
      }
    },
    onToggleHeader() {
      if (!this.noCollapse) {
        this.cardOpen = !this.cardOpen
        this.$emit('toggle', this.cardOpen)
      }
    },
    close() {
      this.$emit('close')
    },
    pxToRem(px) {
      return `calc(${px} * var(--commoncomp-vh-filter-unit, 9.7276vh) / 100)`
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/absolute-container';

.iconfont_tools {
  font-size: px-to-rem(20);
}
</style>
