<template>
  <div class="buffer-selecter">
    <div class="item-label">{{ label }}</div>
    <div class="buffer-selecter__btns">
      <div
        v-for="btn in btnGroup"
        :key="btn.key"
        :class="[
          'buffer-selecter__btns-btn',
          btn.iconClass,
          curBtnKey === btn.key ? 'buffer-selecter__btns-btn--active' : ''
        ]"
        @click="handleBtnClick(btn)"
      ></div>
    </div>
  </div>
</template>
<script>
import { bufferSingleGeometry } from '@component-gallery/utils/mapCommon/buffer-single-geometry'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import CTMapOl from '@ct/ct_map_ol'
export default {
  name: 'buffer-selecter',
  props: {
    label: {
      type: String,
      default: '区域选择'
    },
    distance: {
      type: Number,
      default: 3
    },
    mapId: {
      type: String,
      default: 'monitorWarn-map'
    }
  },
  inject: ['mapRef'],
  data() {
    return {
      curBtnKey: 'point', // 当前选中的绘制方式
      geometryInstance: null
    }
  },
  computed: {
    btnGroup() {
      return [
        {
          key: 'point',
          iconClass: 'icon-point',
          tip: '请在地图上选择点进行筛选'
        },
        {
          key: 'lineString',
          iconClass: 'icon-line',
          tip: '请在地图上画线进行筛选'
        },
        {
          key: 'box',
          iconClass: 'icon-rect',
          tip: '请在地图上绘制矩形'
        },
        {
          key: 'polygon',
          iconClass: 'icon-poly',
          tip: '请在地图上绘制多边形'
        },
        {
          key: 'clear',
          iconClass: 'icon-clear'
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.clear()
  },
  watch: {
    distance(newVal) {
      this.geometryInstance && this.geometryInstance.changeRadio(+newVal)
    }
  },
  methods: {
    init() {
      const mapRef = this.mapRef.getMapRef(this.mapId)
      this.geometryInstance = new bufferSingleGeometry(
        mapRef,
        CommonMessage,
        this.handleDrawSuccess
      )
    },
    clear() {
      this.geometryInstance && this.geometryInstance.clear(false)
      this.geometryInstance && this.geometryInstance.destroy()
      this.geometryInstance = null
    },
    // 绘制成功回调
    handleDrawSuccess(e) {
      this.$emit('change', e)
    },
    handleBtnClick(btn) {
      switch (btn.key) {
        case 'point':
        case 'lineString':
        case 'box':
        case 'polygon':
          this.curBtnKey = btn.key
          this.geometryInstance.mouseTool({
            type: btn.key,
            radius: this.distance
          })
          if (btn.tip) {
            CommonMessage.warning(btn.tip)
          }
          break
        case 'clear':
          this.geometryInstance.clear(true)
          this.$emit('change', null)
          break
      }
    },
    // 供外部使用的设置缓冲区的方法
    // resData需要传入的必备参数如下
    // type(1: 点， 2: 线， 3: 面), geometry(change事件扔出去的geometry), latitude, latitude
    setBufferBata(resData) {
      const bufferInfo = resData
      // 映射：key->tools的下标
      let typeConfig = {
        1: 0,
        2: 1,
        3: 3
      }
      let type = resData.type || '1'
      this.curBtnKey = this.btnGroup[typeConfig[type]]

      bufferInfo.latitude = +bufferInfo.latitude
      bufferInfo.longitude = +bufferInfo.longitude
      let geometry = bufferInfo.geometry || ''
      // let geometry =
      //   'POLYGON((116.36823813206072 39.905695614302715,116.36789480930685 39.9100409719201,116.3584534335744 39.910896843201016,116.35407606846209 39.9081316820658,116.35356108433123 39.90543225043706,116.36823813206072 39.905695614302715))'
      if (type != '1' && this.testGeometryType(geometry)) {
        let _wkt = new CTMapOl.format.WKT()
        let _geometry = _wkt.readGeometry(geometry)
        let _geoJSON = new CTMapOl.format.GeoJSON()
        let _geometry2 = _geoJSON.writeGeometry(_geometry)
        _geometry2 = JSON.parse(_geometry2)
        bufferInfo.geometry = this.multiTest(_geometry2)
      } else {
        if (type == '3') {
          bufferInfo.geometry = [geometry]
        } else {
          bufferInfo.geometry = geometry
        }
      }
      this.geometryInstance.setBufferBata(
        bufferInfo,
        this.geometryInstance.value
      )
    },
    testGeometryType(geometry) {
      return ['LINESTRING', 'POLYGON', 'MULTIPOLYGON', 'MULTILINESTRING'].find(
        (item) => {
          return new RegExp(item, 'gi').test(geometry)
        }
      )
    },
    multiTest(geometry) {
      let coordinates = geometry.coordinates
      if (/(MultiLineString|MultiPolygon)/gi.test(geometry.type)) {
        coordinates = geometry.coordinates[0]
      }
      return coordinates
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/buffer-selecter';
</style>
