<markdown>
# 地图小组件
地图组件描述
</markdown>

<markdown-code>
<d-map :mapId="mapId"/>
</markdown-code>

<template>
  <div>
    <n-image width="100%" height="100%" :src="url" />
  </div>
</template>

<script>
import mapImg from './screens/mapImg.png'

export default {
  data() {
    return {
      name: '前端ddf',
      url: mapImg,
      mapId: 'mapId'
    }
  },
  methods: {
    add() {
      this.name += '1'
    }
  }
}
</script>
