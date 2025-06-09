<template>
  <div :id="scaleLineId" class="scale-line" :class="{ smallMap: isSmallMap }">
  </div>
</template>

<script>
import CTMapOL from '@ct/ct_map_ol'
import { $v } from '@component-gallery/utils/funCommon/common'
export default {
  name: 'MapScale',
  inject: ['mapRef'],
  data() {
    return {
      scaleLine: null,
      scaleLineId: `scale-line${$v.getUUID()}`
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
    this.initScale()
  },
  methods: {
    initScale() {
      const mapRef = this.mapRef.getMapRef(this.mapId)
      const scaleLine = new CTMapOL.InnerControl.lib.ScaleLine(
        {
          mapRef,
          domId: this.scaleLineId
        },
        {}
      )
      this.mapRef.mapRefUpdater(this.mapId, (draft) => {
        draft.changeMapType.push(scaleLine.mount.bind(scaleLine))
      })

      scaleLine.init()
      scaleLine.mount()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.scale-line {
  position: absolute;
  right: px-to-rem(20);
  bottom: px-to-rem(25);
  z-index: 1;

  ::v-deep .ctmap-union-scale-line-container {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: px-to-rem(12);
    color: #172537;
    padding: px-to-rem(3) px-to-rem(6);

    .ctmap-union-scale-line-inner::before,
    .ctmap-union-scale-line-inner::after {
      border-color: #172537;
    }
  }

  &.smallMap {
    right: px-to-rem(11);
    bottom: px-to-rem(14);
  }
}
</style>
