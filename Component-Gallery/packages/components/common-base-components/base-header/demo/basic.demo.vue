<markdown>
# 全景大屏组件 header
全景大屏的header组件
</markdown>

<markdown-code>
  <base-header >
    标题名称
  </base-header>
</markdown-code>

<template>
  <div>
    <n-image
      width="100%"
      height="100%"
      style="margin-right: 10px"
      :src="demo"
    />
  </div>
</template>

<script>
import demo from './screens/demo.png'

export default {
  data() {
    return {
      name: '前端ddf',
      demo
    }
  },
  methods: {
    add() {
      this.name += '1'
    }
  }
}
</script>
