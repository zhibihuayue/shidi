<markdown>
# 基础组件 collapse-item
支持换肤的collapse-item组件
</markdown>

<markdown-code>
  import BaseCollapseItem from '@component-gallery/base-components/base-collapse-item/BaseCollapseItem.vue'

  <base-collapse-item>
    内容
  </base-collapse-item>
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
      url: eg
    }
  },
  methods: {}
}
</script>
