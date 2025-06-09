<template>
  <absolute-container :class="[bemClass.chooselatlonbox]" v-drag title="地图选点" :width="368">
    <div :class="[bemClass.content]">
      <d-lnglat-select-point
        :class="bemClass.from"
        ref="lnglatSelectPoint"
        @typeChange="pointTypeChange"
        @lnglatChange="lnglatSelectPoint"
      ></d-lnglat-select-point>
    </div>
  </absolute-container>
</template>
<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '@component-gallery/utils/bem/create'
import { dragBind } from '@component-gallery/utils/funCommon/common'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import DLnglatSelectPoint from '@component-gallery/lnglat-select-point'
import CTMapOl from '@ct/ct_map_ol'
const bem = createNameSpace('choose-latlon')
let alarmMarker = null
let copyMarkerData = null //备份地图选点
export default {
  name: 'd-choose-latlon',
  components: {
    AbsoluteContainer,
    DLnglatSelectPoint
  },
  props: {
    mapId: {
      type: String,
      default: 'map'
    }
  },
  inject: ['mapRef'],
  directives: {
    drag: {
      //  指令的定义
      bind: (el) => {
        dragBind(el)
      }
    }
  },
  computed: {
    bemClass() {
      return {
        chooselatlonbox: bem.b('chooselatlonbox'),
        content: bem.b('content')
      }
    }
  },
  methods: {
    // 切换选点方式
    pointTypeChange(e) {
      if (e == 'map') {
        CommonMessage.warning('请在地图上选择要侦测的地点1111111。')
        this.openClickMap()
      } else {
        CommonMessage.warning('输入经纬度按回车键在地图上选择要侦测的地点。')
      }
    },
    // 经纬度选点
    lnglatSelectPoint(lnglat) {
      CommonMessage.warning('请在地图上选择要侦测的地点。')
    },
    /**
     * 开启监听地图点击事件
     */
    openClickMap() {
      try {
        CTMapOl.InteractionControl.common.getCoordByClick(
          { mapRef: this.mapRef.getMapRef(this.mapId) },
          {
            onmouseclick: (mapRef, type, opt) => {
              this.clickMap(mapRef, type, opt)
            }
          }
        )
      } catch (e) {
        console.log('监听地图事件失败', e)
      }
    },
    /**
     * 地图点击事件
     */
    clickMap(mapRef, type, opt) {
      CommonMessage.warning('我点击了地图')
      let clicklng = opt.lonlat[0],
        clicklat = opt.lonlat[1]
      let data = {
        longitude: clicklng,
        latitude: clicklat
      }
      console.log(data)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/chooselatlon';
</style>
