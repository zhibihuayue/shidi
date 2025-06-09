<markdown>
  # 基础组件 Icon
  用于项目内Icon组件
</markdown>

<markdown-code>
  <base-icon iconClass="icon-liebiaosousuo" />
  <base-icon activeClass="icon-tongyong-liebiaoshaixuanxuanzhong" />
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
  }
}
</script>
