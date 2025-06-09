<markdown>
# 气候统计分析
</markdown>

<markdown-code>
  <climate-statistics :componentName="组件title名称" :commonentHeight="组件内容高度"/>
</markdown-code>

<template>
  <div>
    <n-image width="100%" height="100%" :src="url" />
  </div>
</template>

<script>
import iShot from './screens/demo.jpg'
export default {
  data() {
    return {
      url: iShot
    }
  }
}
</script>
