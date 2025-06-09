<!--
 * @Description  :
 * @Version      : V1.0.0
 * @Author       : xumh xumh@strongdata.com.cn
 * @Date         : 2024-02-20 14:19:31
 * @LastEditors  : xumh xumh@strongdata.com.cn
 * @LastEditTime : 2024-03-16 10:22:13
 * @FilePath     : BottomMapLocaltionShow.vue
 * Copyright 2024 Marvin, All Rights Reserved.
 * 2024-02-20 14:19:31
-->
<template>
  <div class="common-comp-map__bottom_background" ref="commonMapLocation">
    <div class="item-3d" v-show="is3d">
      <span class="label">经度：</span>{{ lng }}
      <span class="label">纬度：</span>{{ lat }}
      <span class="label">海拔：</span>{{ height }}
    </div>
    <div
      class="item"
      :style="`transform-origin: right;`"
      ref="commonMapMousePosition"
      v-show="!is3d"
    ></div>
  </div>
</template>

<script>
import eventPath from '@component-gallery/build-event-bus-path'
import CTMapOl from '@ct/ct_map_ol'
const { MousePosition } = CTMapOl.control
const { format } = CTMapOl.coordinate
export default {
  components: {},
  props: {
    mapId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mousePositionControlObj: {},
      lng: '0.0',
      lat: '0.0',
      height: '0',
      is3d: false
    }
  },
  inject: ['mapRef'],
  mounted() {
    this.$parent.$parent.$on(`init-map-resolve`, this.mapResolve)
  },
  beforeDestroy() {
    this.$parent.$parent.$off(`init-map-resolve`, this.mapResolve)
  },
  methods: {
    mapResolve({ status }) {
      if (status) {
        this.is3d = this.mapRef.getMapRef(this.mapId)?.mapType === '3D'
        this._setMapMousemove()
      }
    },
    //初始化地图实例容错
    isHaveMapRef() {
      try {
        return !!this.mapRef.getMapRef(this.mapId)
      } catch (error) {
        console.error(error)
      }
    },
    mapMousemoveNew(successFn, mousePointionId) {
      if (!this.isHaveMapRef()) {
        return
      }
      const map = this.mapRef.getMapRef(this.mapId).mapInstance
      if (!map) {
        return
      }
      if (this.is3d) {
        // 3d 待处理
        const CesiumEventHandlermove = new Cesium.ScreenSpaceEventHandler(
          map.scene.canvas
        )
        CesiumEventHandlermove.setInputAction((movement2) => {
          try {
            const ray = map.camera.getPickRay(movement2.endPosition)
            const cartesian1 = map.scene.globe.pick(ray, map.scene)
            const lnglat = Cesium.Cartographic.fromCartesian(cartesian1)
            const longitude = (lnglat.longitude / Math.PI) * 180
            const latitude = (lnglat.latitude / Math.PI) * 180
            successFn({
              longitude,
              latitude,
              height: lnglat.height.toFixed(0)
            })
          } catch (e) {
            // console.log('=======mapMousemove=========', e)
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      } else {
        if (!this.$refs.commonMapMousePosition) {
          return
        }
        if (this.mousePositionControlObj[mousePointionId]) {
          this.$refs.commonMapMousePosition
            ?.querySelectorAll('.bottom-mouse-positionmap')
            .forEach((ele) => ele?.remove())
          map.removeControl(this.mousePositionControlObj[mousePointionId])
          this.mousePositionControlObj[mousePointionId] = null
        }
        const mousePositionControl = new MousePosition({
          coordinateFormat: function (coordinate) {
            return format(
              coordinate,
              '经度: {x} &nbsp;&nbsp;纬度: {y} &nbsp;&nbsp;海拔: 0',
              6
            )
          },
          projection: 'EPSG:4326', // 定义投影
          className: 'bottom-mouse-positionmap', // 控件的CSS类名
          target: this.$refs.commonMapMousePosition, // 将控件渲染在该DOM元素中
          undefinedHTML: ' ' // 鼠标离开地图时，显示空格
        })
        // 添加控件到地图
        map?.addControl(mousePositionControl)
        //处理二维地图坐标系样式问题
        const mousePosition = this.$refs.commonMapMousePosition.querySelector(
          '.bottom-mouse-positionmap'
        )
        if (mousePosition) {
          mousePosition.style.fontSize = this.pxToRem(12)
          mousePosition.style.position = 'fixed'
          mousePosition.style.right = this.pxToRem(24)
          mousePosition.style.bottom = this.pxToRem(6)
          mousePosition.style.color = '#fff'
        }
        this.mousePositionControlObj[mousePointionId] = mousePositionControl
      }
    },
    // 设置经纬度显示
    _setMapMousemove() {
      if (this.is3d) {
        setTimeout(() => {
          this.mapMousemoveNew((resp) => {
            let { longitude, latitude, height } = resp
            this.lng = longitude.toFixed(6)
            this.lat = latitude.toFixed(6)
            if (height != null) {
              this.height = height === -999 ? '' : height
            }
          }, 'commonMapLocation')
        }, 300)
      } else {
        this.mapMousemoveNew({}, 'commonMapLocation')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/common-map';
</style>
