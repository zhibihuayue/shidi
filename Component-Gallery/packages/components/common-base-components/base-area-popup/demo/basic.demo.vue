<markdown>
# 全景大屏组件 区域选择级联
全景大屏的区域选择级联组件
</markdown>

<markdown-code>
  <base-area-popup
    :open="showArea"
    :defaultArea='defaultArea'
    :data="allDistrict"
    @select="onSelectArea"
    @reset="onResetArea" />
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
