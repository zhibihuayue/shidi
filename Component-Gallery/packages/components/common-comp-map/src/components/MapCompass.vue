<template>
  <div :id="compassId" class="compass-tool"></div>
</template>

<script>
import CTMapOL from '@ct/ct_map_ol'
import eventPath from '@component-gallery/build-event-bus-path'
import { $v } from '@component-gallery/utils/funCommon/common'

export default {
  name: 'MapCompass',
  inject: ['mapRef'],
  data() {
    return {
      compass: null,
      compassId: `compass-tool${$v.getUUID()}`
    }
  },
  props: {
    mapId: {
      type: String,
      default: 'mapId'
    }
  },
  beforeUnmount() {
    this.compass.destroy()
  },
  mounted() {
    this.initComPass()
  },
  methods: {
    initComPass() {
      let mapRef = this.mapRef.getMapRef(this.mapId)
      this.compass = new CTMapOL.InnerControl.lib.CompassTool(
        {
          mapRef,
          domId: this.compassId
        },
        {
          onMapRotate: (mapRef1, event, angle) => {
            console.log('onMapRotate', mapRef1, event, angle)
          }
        }
      )
      console.log(this.compass, 'this.compass ')
      this.compass.init()
      this.compass.mount()
    },
    mountCompass() {
      let mapRef = this.mapRef.getMapRef(this.mapId)
      this.compass.mount(mapRef)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.compass-tool {
  position: absolute;
  right: px-to-rem(18);
  bottom: px-to-rem(142);
  z-index: 1;
}
</style>
