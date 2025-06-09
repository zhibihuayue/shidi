<markdown>
# 鸟类栖息地分析
</markdown>

<markdown-code>
  <bird-habitat-analysis :componentName="组件title名称" />
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
