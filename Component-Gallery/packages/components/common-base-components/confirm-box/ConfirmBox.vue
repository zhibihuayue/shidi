<template>
  <div :class="[bemClass.container, modal && 'modal']">
    <absolute-container
      :title="headTitle"
      highlight-title
      :width="width"
      :noCorner="['terracotta']"
      :class="[bemClass.popBox, customClass]"
      @close="cancel"
    >
      <div :class="bemClass.content">
        <slot
          ><p :class="bemClass.content + '-msg'">{{ message }}</p></slot
        >
        <div :class="bemClass.btns" v-if="!noBtns">
          <el-button type="primary" :disabled="disabledConfirm" @click="confirm"
            >{{ confirmButtonText }}{{ delay ? `（${countTime}s）` : '' }}</el-button
          >
          <el-button :disabled="disabledCancel" @click="cancel">{{ cancelButtonText }}</el-button>
        </div>
      </div>
    </absolute-container>
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('confirm-box')
let timer = null // 倒计时计时器
export default {
  name: 'confirm-box',
  components: {
    AbsoluteContainer
  },
  props: {
    modal: {
      type: Boolean,
      default: true
    },
    headTitle: {
      type: String,
      default: '提示'
    },
    width: {
      type: Number,
      default: 368
    },
    message: {
      type: String,
      default: '请确认'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    // 倒计时自动确认，单位为秒。注意只能是正整秒数，0或负数表示不使用倒计时功能
    delay: {
      type: Number,
      default: 0
    },
    // 自定义class
    customClass: {
      type: String,
      defualt: ''
    },
    // 禁用确认按钮
    disabledConfirm: {
      type: Boolean,
      default: false
    },
    // 禁用取消按钮
    disabledCancel: {
      type: Boolean,
      default: false
    },
    // 是否不显示按钮，默认为false
    noBtns: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('container'),
        popBox: bem.b('popBox'),
        content: bem.b('content'),
        btns: bem.b('btns')
      }
    }
  },
  data() {
    return {
      countTime: -1 // 自动确认的倒计时时间
    }
  },
  mounted() {
    // 如果配置了倒计时自动确认 开始一个计时器 计时器结束后自动触发确认
    if (this.delay > 0) {
      this.countTime = this.delay
      timer = setInterval(() => {
        this.countTime--
        if (this.countTime < 0) {
          this.confirm()
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    }
  },
  beforeDestroy() {
    timer && clearInterval(timer)
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/confirmBox';
</style>
