<template>
  <base-dialog
    :width="1100"
    :title="detailTitle"
    :modal="true"
    @close="close"
    :class="[bemClass.box]"
    height="auto"
    v-model="teleportShow"
  >
    <div :class="[bemClass.content]">
      {{ detailValue }}
    </div>
  </base-dialog>
</template>
<script>
import BaseDialog from '../base-dialog/BaseDialog.vue'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('hover-detail-dialog')
export default {
  name: 'base-horn-detail-dialog',
  components: { BaseDialog },
  props: {
    /**
     * 详情数据
     */
    detailValue: {
      type: String,
      default: '查看原文'
    },
    /**
     * 详情标题
     */
    detailTitle: {
      type: String,
      default: '内容'
    }
  },
  data() {
    return {
      teleportShow: true
    }
  },
  computed: {
    /**
     * 生成BEM类名
     *
     * @returns {Object} 包含box和content两个键值对的BEM类名对象
     */
    bemClass() {
      return {
        box: bem.b('box'),
        content: bem.b('content')
      }
    }
  },
  methods: {
    /**
     * 关闭函数
     * 触发 'close' 事件
     */
    close() {
      this.$emit('close')
    }
  },
  mounted() {
    /**
     * 在组件挂载后执行，
     * 将组件元素插入到文档的body元素中
     */
    this.$nextTick(() => {
      document.body.appendChild(this.$el)
    })
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/hover-detail-dialog';
</style>
