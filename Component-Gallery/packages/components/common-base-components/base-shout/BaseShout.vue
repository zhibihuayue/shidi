<template>
  <div :class="[bemClass.box]">
    <div :class="[bemClass.content]">
      <div
        :class="{ ...baseShoutCircleClass, active: isSpeaking }"
        @click="toggleSpeaking"
      >
        <div :class="[bemClass.animation]" v-show="isSpeaking">
          <span
            v-for="item in 5"
            :key="item"
            :class="[bemClass.line]"
            :style="{ animationDelay: (5 - item) * -0.1 + 's' }"
          ></span>
        </div>
      </div>
      <div :class="[bemClass.message]">
        <span v-if="isSpeaking">{{ shoutingTitle }} {{ seconds }} s</span>
        <span v-else>{{ shoutTitle }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('base-shout')
export default {
  name: 'base-shout',
  props: {
    /**
     * 是否喊话
     */
    isSpeaking: {
      type: Boolean,
      default: false
    },
    /**
     * 喊话秒数
     */
    seconds: {
      type: Number || String,
      default: 0
    },
    /**
     * 喊话弹窗标题
     */
    shoutTitle: {
      type: String,
      default: '点击喊话'
    },
    /**
     * 喊话中的文字
     */
    shoutingTitle: {
      type: String,
      default: '喊话中'
    }
  },
  data() {
    return {}
  },
  computed: {
    /**
     * 创建class类型
     */
    bemClass() {
      return {
        box: bem.b('box'),
        content: bem.b('content'),
        animation: bem.b('animation'),
        line: bem.b('line'),
        message: bem.b('message')
      }
    },
    baseShoutCircleClass() {
      return {
        [bem.b('circle')]: true
      }
    }
  },
  methods: {
    /**
     * 切换语音播报状态
     *
     * @event toggleSpeaking
     * @param {boolean} isSpeaking 当前是否处于语音播报状态
     */
    toggleSpeaking() {
      this.$emit('toggleSpeaking', this.isSpeaking)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-shout/base-shout';
</style>
