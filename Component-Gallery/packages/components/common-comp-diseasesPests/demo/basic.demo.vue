<markdown>
# 病虫害预测
</markdown>

<markdown-code>
  <diseases-pests :componentName="组件title名称"/>
</markdown-code>

<template>
  <div>
    <n-image width="100%" height="50%" :src="url1" />
    <n-image width="100%" height="50%" :src="url2" />
  </div>
</template>

<script>
import iShot1 from './screens/demo1.jpg'
import iShot2 from './screens/demo2.jpg'
export default {
  data() {
    return {
      url1: iShot1,
      url2: iShot2
    }
  }
}
</script>
