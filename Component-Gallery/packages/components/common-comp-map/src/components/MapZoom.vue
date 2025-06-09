<template>
  <div
    :id="zoomToolId"
    class="zoom-tool"
    :class="{ smallMap: isSmallMap }"
  ></div>
</template>

<script>
import CTMapOL from '@ct/ct_map_ol'
import { $v } from '@component-gallery/utils/funCommon/common.js'
export default {
  name: 'MapZoom',
  inject: ['mapRef'],
  data() {
    return {
      zoomToolId: `zoom-tool${$v.getUUID()}`
    }
  },
  props: {
    mapId: {
      type: String,
      default: 'mapId'
    },
    isSmallMap: {
      //是否是小地图, 间距更窄
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.initZoom()
  },
  methods: {
    initZoom() {
      const mapRef = this.mapRef.getMapRef(this.mapId)
      const zoomTool = new CTMapOL.InnerControl.lib.ZoomTool({
        mapRef,
        domId: this.zoomToolId
      })
      this.mapRef.mapRefUpdater(this.mapId, (draft) => {
        draft.changeMapType.push(zoomTool.mount.bind(zoomTool))
      })
      zoomTool.init()
      zoomTool.mount()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.zoom-tool {
  position: absolute;
  right: px-to-rem(20);
  bottom: px-to-rem(68);
  z-index: 1;

  ::v-deep .ctmap-union-zoomtool-container {
    .__cell {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: px-to-rem(12);
      color: #172537;

      &.disabled {
        color: #8d9fb8;
      }
    }
  }

  &.smallMap {
    right: px-to-rem(11);
    bottom: px-to-rem(54);
  }
}
</style>
