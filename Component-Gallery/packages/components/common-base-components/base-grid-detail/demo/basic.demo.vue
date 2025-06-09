<markdown>
# 用于网格、网格员详情的查看
</markdown>

<markdown-code>
  <base-grid-detail :detail="detailData"/>
</markdown-code>

<template>
  <div>
    <n-image width="100%" height="100%" :src="url" />
  </div>
</template>

<script>
import eg from './screens/img1.png'

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
