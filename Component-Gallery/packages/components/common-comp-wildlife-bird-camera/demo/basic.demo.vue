<markdown>
# 鸟类声纹组件
</markdown>

<markdown-code>
  <d-wildlife-bird-camera  />
</markdown-code>

<template>
  <div>
    <!-- 使用n-image组件显示图片 -->
    <n-image width="100%" height="100%" :src="url" />
  </div>
</template>

<script>
// 导入图片
import iShot from './screens/demo.png'

export default {
  data() {
    return {
      // 定义图片路径
      url: iShot
    }
  }
}
</script>
