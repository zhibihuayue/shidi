<markdown>
# 基础组件 card
用于组件外层 容器 可支持换肤
</markdown>

<markdown-code>
  import ResponsiveContainer from '@component-gallery/base-components/responsive-container/ResponsiveContainer.vue'

  <ResponsiveContainer>
    内容
  </ResponsiveContainer>
</markdown-code>

<template>
  <div>
    <n-image width="100%" height="100%" :src="url" />
  </div>
</template>

<script>
import eg from './screens/img.png'

export default {
  data() {
    return {
      name: '前端ddf',
      url: eg
    }
  },
  methods: {
    add() {
      this.name += '1'
    }
  }
}
</script>
