<!--
  支持换肤的el-dialog。
  这个是用于弹窗版本，跟定位容器的应用场景不同，但是展示效果应当与定位容器一致。
  dialog通常只会使用居中标题，并且很少在标题栏里插其他操作按钮
-->
<template>
  <el-dialog
    ref="dialog"
    v-dialogDrag
    :visible="visible"
    :destroy-on-close="destroyOnClose"
    :width="width"
    :class="[
      bemClass.container,
      industryClass,
      highlightTitle && 'highlight-title',
      leftTitle && 'left-title',
      noCornerClass
    ]"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :show-close="showClose"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    @open="openFunc"
    @close="closeFun"
  >
    <div v-if="canClose" :class="[bemClass.close]" @click="closeFun" />

    <div class="previous-vacancies" />
    <template v-slot:title>
      <div
        v-if="$slots.title || title"
        :class="[
          bemClass.header,
          highlightTitle && 'highlight-title',
          leftTitle && 'left-title'
        ]"
      >
        <div>
          <template v-if="$slots.title">
            <slot name="title" />
          </template>
          <span v-else>{{ title }}</span>
        </div>
        <slot name="title-extra"></slot>
      </div>
    </template>

    <slot />
    <div class="subsequent-vacancies" />
  </el-dialog>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('innercomp-styleddialog')

export default {
  name: 'StyledElDialog',
  props: {
    visible: Boolean,
    destroyOnClose: Boolean,
    highlightTitle: Boolean,
    leftTitle: Boolean,
    canClose: Boolean,
    width: String,
    title: String,
    top: Number,
    left: Number,
    noCorner: {
      // 是否关闭角装饰（默认启用角装饰）。支持传入数组，用于指定需要关闭的应用,如: ['aquamarine']（仅关闭林业应用角装饰）
      type: Boolean || Array,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    industryClass: {
      type: String,
      default: 'common-iw-s'
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b(''),
        header: bem.b('header'),
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
    }
  },
  watch: {
    visible(v) {
      if (v) {
        // 如果设置了top/left偏移量，那么就稍微处理一下
        // 注意：因为dialog有50%的transform，所以这个top要加上当前高度的50%
        // 如果设置destroyOnClose为true的话，会因为元素被重置导致看见弹窗内容“闪现”，这种情况下建议不要和偏移同时使用
        if (this.top !== undefined) {
          this.$nextTick(() => {
            const $dom = this.$refs.dialog.$el.querySelector('.el-dialog')
            $dom.style.top = `${this.top + $dom.clientHeight / 2}px`
          })
        }

        if (this.left !== undefined) {
          this.$nextTick(() => {
            const $dom = this.$refs.dialog.$el.querySelector('.el-dialog')
            $dom.style.left = `${this.left - $dom.clientWidth / 2}px`
          })
        }
      }
    }
  },
  methods: {
    // 协助派发外部事件
    openFunc() {
      this.$emit('open')
    },
    closeFun() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/styled-dialog';
</style>
@component-gallery/base-components/styled-dialog/StyledDialog.vue
