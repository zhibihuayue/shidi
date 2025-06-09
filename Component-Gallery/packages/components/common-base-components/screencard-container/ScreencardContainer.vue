<!--
  用于大屏图表模块的定位容器。
  这个容器用于锚定于窗口固定位置，且一般不移动的大屏常显模块容器，与AbsoluteContainer的运用场景不同。
  这个容器通常不可拖拽、视为父元素的子元素。
-->
<template>
  <div
    :class="[
      bemClass.container,
      industryClass,
      highlightTitle && 'highlight-title',
      canExpand && 'can-expand',
      cardOpen && 'card-open',
      noCornerClass,
      processedSpecialStyle
    ]"
    ref="mycontainer"
  >
    <div v-if="canClose" :class="[bemClass.close]" @click="close" />
    <div class="previous-vacancies" />

    <div v-if="title" :class="[bemClass.header, highlightTitle && 'highlight-title', leftTitle && 'left-title']">
      <div :class="[bemClass.headertitle]">
        <slot name="title" />
        <el-tooltip
          :content="title"
          :disabled="tooltipDisable"
          placement="top"
          popper-class="iwhale-speciesLYstyle weather-small-tooltip"
        >
          <span
            @mouseenter="setTooltipDisabled($event)"
            :class="['titletext', titleTooltip && 'titleTooltip']"
            v-if="!$slots.title"
            >{{ title }}</span
          >
        </el-tooltip>
      </div>
      <slot name="extra" />
      <em
        v-if="canExpand"
        :class="['iconfont_tools icon-linye_icon_biaotizhankai_you', bemClass.pointer, cardOpen && 'isOpen']"
        @click="onToggleHeader"
      />
    </div>
    <div :class="[bemClass.body, !cardOpen && 'isHide']" @mousedown="onMouseDown">
      <slot />
    </div>
    <div class="subsequent-vacancies" />
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import { getUserMemoryInfo, uptUserMemoryInfo } from './service/index'
const bem = createNameSpace('innercomp-sccontainer')

export default {
  name: 'screencard-container',
  props: {
    industryClass: {
      type: String,
      default: 'common-iw-s'
    },
    title: {
      // 标题。如果不填写的话，整个header区域不会出现。
      type: String,
      default: ''
    },
    leftTitle: {
      type: Boolean,
      default: true
    },
    titleTooltip: {
      type: Boolean,
      default: false
    },
    canClose: {
      // 是否展示关闭按钮，关闭按钮会触发close事件。
      type: Boolean,
      default: false
    },
    noCorner: {
      // 是否关闭角装饰（默认启用角装饰）。支持传入数组，用于指定需要关闭的应用,如: ['aquamarine']（仅关闭林业应用角装饰）
      type: Boolean || Array,
      default: true
    },
    stopMousedownBody: {
      // 是否阻止body层的mousedown事件冒泡。这个props一般是用来避免拖拽误操作用的，默认是拦截body，这样用户就只能靠header拖动
      // 如有需要，置为false即可
      type: Boolean,
      default: true
    },
    canExpand: {
      // 是否启用卡片模式（支持收缩）。这个风格目前只有林业显示是正常的
      type: Boolean,
      default: false
    },
    expandMemoryName: {
      // 用于记录展开/收起状态的用户记忆名称，默认为空，空为不使用记忆功能
      // 如果canExpand为false，该配置项无意义
      type: String,
      default: ''
    },
    // 自定义配置项
    specialStyle: {
      default: () => {
        return {
          // 通用主题配置
          wiseblue: {
            missingCorner: false // 缺角标题风格
          },
          // 国土主题配置
          terracotta: {
            classic: false // 传统风格
          }
        }
      }
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b(''),
        header: bem.b('header'),
        body: bem.b('body'),
        close: bem.b('close'),
        pointer: bem.be('header', 'pointer'),
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
          if (this.isPlainObject(item.missingCorner)) {
            // 单一行业配置项
            this.handlingObj(result, item.missingCorner)
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
      cardOpen: true,
      highlightTitle: true, // 标题（header部分）是否用存在底色、加粗的高亮方法呈现
      tooltipDisable: true
    }
  },
  mounted() {
    this.getUserMemory()
  },
  methods: {
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
    onToggleHeader() {
      this.cardOpen = !this.cardOpen
      this.setUserMemory()
      this.$emit('cardexpand', this.cardOpen)
    },
    onMouseDown(event) {
      if (this.stopMousedownBody) {
        event.stopPropagation()
      }
    },
    setUserMemory() {
      if (this.canExpand && this.expandMemoryName) {
        uptUserMemoryInfo({
          memoryType: this.expandMemoryName,
          memoryValue: this.cardOpen ? 'true' : 'false'
        })
      }
    },
    getUserMemory() {
      // 用户记忆，查询
      if (this.canExpand && this.expandMemoryName) {
        // 只在可以展开，并且有配置展开记忆的情况下才查询
        getUserMemoryInfo([this.expandMemoryName], (resp) => {
          if (resp.data) {
            resp.data.forEach((item) => {
              if (this.expandMemoryName === item.memoryType && item.memoryValue) {
                this.cardOpen = item.memoryValue === 'true'
              }
            })
          }
        })
      }
    },
    close() {
      this.$emit('close')
    },
    setTooltipDisabled(e) {
      // titleTooltip 是否启用tooltip处理
      if (!this.titleTooltip) {
        return
      }
      const trigger = e.currentTarget
      if (trigger.scrollWidth <= trigger.offsetWidth) {
        this.tooltipDisable = true
      } else {
        this.tooltipDisable = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/screencard-container';
</style>
