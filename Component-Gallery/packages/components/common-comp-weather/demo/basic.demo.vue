<markdown>
# 天气组件
</markdown>

<markdown-code>
  <d-weather />
</markdown-code>

<template>
  <div>
    <n-image width="100%" height="100%" :src="url" />
  </div>
</template>

<script>
import iShot from './screens/weather.png'
export default {
  data() {
    return {
      url: iShot,
      weatherProp: null
    }
  }
}
</script>
