<markdown>
# 基础组件 button
支持换肤的button组件
</markdown>

<markdown-code>
  <base-button @click="handleClick">
    默认按钮
  </base-button>
  <base-button type="primary" @click="handleClick">
    主要按钮
  </base-button>
  <base-button type="danger" @click="handleClick">
    危险按钮
  </base-button>
  <base-button type="tiny" @click="handleClick">
    小型按钮
  </base-button>
</markdown-code>

<template>
  <div>
    <n-image
      width="100%"
      height="100%"
      style="margin-right: 10px"
      :src="aquamarine"
    />
    <n-image
      width="100%"
      height="100%"
      style="margin-right: 10px"
      :src="terracotta"
    />
    <n-image width="100%" height="100%" :src="wiseblue" />
  </div>
</template>

<script>
import aquamarine from './screens/aquamarine.png'
import terracotta from './screens/terracotta.png'
import wiseblue from './screens/wiseblue.png'

export default {
  data() {
    return {
      name: '前端ddf',
      aquamarine,
      terracotta,
      wiseblue
    }
  },
  methods: {
    add() {
      this.name += '1'
    }
  }
}
</script>
