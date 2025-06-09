<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-15 14:04:09
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-11-16 23:16:56
 * @FilePath:
 * @Description:
-->
<template>
  <div v-if="visible" :class="[classWrapper.container, classWrapper.is('mask', modal)]" :style="styleZIndex">
    <absolute-container
      ref="dialogAttributeBox"
      :width="widthRef"
      :title="title"
      highlight-title
      @close="close"
      v-bind="$attrs"
      :height="height !== 'auto' ? height : undefined"
      :class="{ ...dialogAttributeBoxClass }"
      v-drag
      v-if="visible"
    >
      <slot></slot>
    </absolute-container>
  </div>
</template>
<script>
import AbsoluteContainer from '../absolute-container/AbsoluteContainer.vue'
import { dragBindCover } from '@component-gallery/utils/funCommon/common'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('dialog-attribute')
const bemContainer = createNameSpace('common-base')
export default {
  name: 'base-dialog',
  inheritAttrs: false,
  components: { AbsoluteContainer },
  props: {
    zIndex: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 1100
    },
    height: {
      type: Number || String,
      default: 500
    },
    title: {
      type: String,
      default: '属性'
    },
    modal: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    drag: {
      bind: (el) => {
        dragBindCover(el)
      }
    }
  },
  data() {
    return {
      labelWidth: 3,
      visible: this.value,
      widthRef: this.width
    }
  },
  mounted() {
    this.reloadPosition()
  },

  watch: {
    // 监听value的变化
    value(val) {
      // 更新visible的值
      this.visible = val
      // 如果value为真，并且是模态框
      if (val) {
        // 将当前组件的元素添加到body中
        if (this.modal) {
          document.body.appendChild(this.$el)
        }
      }
    },
    // 监听visible的变化
    visible(val) {
      // 发射input事件，传递当前的visible值
      this.$emit('input', val)
    },
    // 监听width的变化
    width: {
      // 处理width的变化
      handler(val) {
        // 更新widthRef的值
        this.widthRef = val
      },
      // 立即执行一次handler
      immediate: true
    }
  },
  computed: {
    // 手动设置z-index
    styleZIndex() {
      if (this.zIndex > 0) {
        return { zIndex: this.zIndex }
      }
      return {}
    },
    // Computes the class for the dialog attribute box
    dialogAttributeBoxClass() {
      // Returns an object with the base class for the box
      return {
        [bem.b('box')]: true
      }
    },
    // Computes the class for the wrapper
    classWrapper() {
      // Returns an object with the base class for the dialog container and the 'is' class
      return {
        container: bemContainer.b('dialog'),
        is: bemContainer.is
      }
    }
  },
  methods: {
    // This method is used to close the dialog
    close() {
      // Set the visible property to false
      this.visible = false
      // Reload the position of the dialog
      this.reloadPosition()
      // Emit an input event with the current visible value
      this.$emit('input', this.visible)
      // Emit a close event
      this.$emit('close')
    },
    // This method is used to reload the position of the dialog
    reloadPosition() {
      // Use the $nextTick method to ensure that the DOM has been updated
      this.$nextTick(() => {
        // Get the dialog attribute box element
        const dialogBox = this.$refs.dialogAttributeBox
        // If the dialog attribute box element exists
        if (dialogBox) {
          // Reset the left and top styles of the dialog attribute box
          dialogBox.style.left = ''
          dialogBox.style.top = ''
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/base-tree-property-dialog';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-dialog';
</style>
