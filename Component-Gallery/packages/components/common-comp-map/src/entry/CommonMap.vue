<template>
  <div
    class="commmomMapClass"
    :id="commonMapId"
    :style="{
      '--comp-map-switcher-width': pxToRem(85 * nowTiles.length)
    }"
  >
    <div :id="mapId" class="mapInstanceClass"></div>
    <teleport :to="mapToolElement" :disabled="!mapToolElement">
      <div class="map-tools" :style="{ right: boxrigth }" v-show="showMap">
        <div :id="tileControlId" class="tile-control" :class="{ 'small-map': isSmallMap }"></div>
        <map-zoom ref="mapZoom" v-if="mapReady && !noControl" :mapId="mapId" :isSmallMap="isSmallMap" />
        <map-compass ref="mapCompass" v-if="is3D && !noControl" :mapId="mapId" :isSmallMap="isSmallMap" />
        <map-scale ref="mapScale" v-if="mapReady && !noControl" :mapId="mapId" :isSmallMap="isSmallMap" />
      </div>
    </teleport>
    <teleport :to="mapMouseElement" :disabled="!mapMouseElement">
      <bottom-map-location-show v-if="showMouseLocation" :mapId="mapId"></bottom-map-location-show>
    </teleport>
  </div>
</template>

<script>
import CTMapOl from '@ct/ct_map_ol'
import Teleport from '@component-gallery/base-components/Teleport.vue'
import MapZoom from '../components/MapZoom.vue'
import MapCompass from '../components/MapCompass.vue' // 指北针
import MapScale from '../components/MapScale.vue'
import BottomMapLocationShow from '../components/BottomMapLocationShow.vue'
import { getUserMemoryInfo, uptUserMemoryInfo } from '../service/index'
import eventPath from '@component-gallery/build-event-bus-path'
import { $v } from '@component-gallery/utils/funCommon/common'
import t1 from '@component-gallery/assets/image/icon-basic.png'
import t2 from '@component-gallery/assets/image/icon-satellite.png'
import t3 from '@component-gallery/assets/image/icon-3d.png'
import t4 from '@component-gallery/assets/image/icon-2d.png'
export default {
  name: 'd-map',
  components: {
    MapCompass,
    MapScale,
    MapZoom,
    BottomMapLocationShow,
    Teleport
  },
  inject: ['mapRef'],
  data() {
    return {
      mapReady: false,
      is3D: false,
      showMap: true,
      nowTiles: [
        {
          modeId: 0, // modeId用于本地判断tileMode配置项的值，如果要修改，请对应更新props里tileMode的注释
          name: '常规地图',
          imgUrl: t1,
          tileType: 'vector',
          mapType: '2D'
        },
        {
          modeId: 1,
          name: '卫星地图',
          imgUrl: t2,
          tileType: 'satellite',
          mapType: '2D'
        },
        {
          modeId: 2,
          name: '三维地图',
          imgUrl: t3,
          tileType: 'satellite',
          mapType: '3D'
        },
        {
          modeId: 3,
          name: '地形图',
          imgUrl: t4,
          tileType: 'heightmap',
          mapType: '3D'
        }
      ],
      MapCesiumCompassPosition: { bottom: '120px', right: '48px' },
      boxrigth: 0,
      defaultZoom: 5,
      defaultCenter: [104.64614, 37.227363],
      tileControlId: `tile-control${$v.getUUID()}`,
      commonMapId: `commonMapId${$v.getUUID()}`
    }
  },
  props: {
    mapId: {
      type: String,
      default: 'mapId'
    },
    chooseMapMemoryKey: {
      // 用户记忆键值。如果该值传空，或者空字符串，则为禁用用户记忆功能。
      type: String,
      default: 'chooseMap'
    },
    mapToolElement: {
      type: String,
      default: ''
    },
    mapMouseElement: {
      type: String,
      default: ''
    },
    showMouseLocation: {
      type: Boolean,
      default: false
    },
    showMapControl: {
      type: Boolean,
      default: true
    },
    noControl: {
      // 是否完全禁用控制器实例，与showMapControl不同的是，showMapControl只控制显隐，对应控制器依然会被初始化
      type: Boolean,
      default: false
    },
    minZoom: {
      type: Number,
      default: 4
    },
    maxZoom: {
      type: Number,
      default: 18
    },
    defaultTileMode: {
      // 默认情况下的地图类型。默认使用1 卫星地图。0、1、2、3分别代表 常规地图、卫星地图、三维地形图、二维地形图。
      type: Number,
      default: 1
    },
    tileModes: {
      // 定义可供切换的地图类型。0、1、2、3分别代表 常规地图、卫星地图、三维地形图、二维地形图。默认启用全部。
      // 不可以为空数组，这个数组的长度至少要为1，如果是空数组将无法正常工作。
      type: Array,
      default: () => [0, 1, 2, 3]
    },
    isSmallMap: {
      // 是否是小地图, 间距更窄
      type: Boolean,
      default: false
    },
    listenGlobalEvent: {
      // 是否监听其他全局事件
      type: Boolean,
      default: true
    },
    alarmListOffset: {
      type: Number,
      default: 400
    },
    resolveEventName: {
      // 初始化事件名
      type: String,
      default: `${eventPath.commonCompMap}__init-map-resolve`
    }
  },
  unmounted() {
    if (this.listenGlobalEvent) {
      this.removeGlobalEvent()
    }
  },
  mounted() {
    if (this.listenGlobalEvent) {
      this.initGlobalEvent()
    }
    this.showMap = !!this.showMapControl
    this.initTileModes()
    this.getUserMemoryMap(
      (val) => {
        this.initMap(val).then((data) => {
          this.setGloalMapRef(data)
          this.initTileControl()
        })
      },
      () => {
        this.initMap(this.defaultTileMode).then((data) => {
          this.setGloalMapRef(data)
          this.initTileControl()
        })
      }
    )
  },
  methods: {
    removeGlobalEvent() {
      this.$globalEventBus.$off(`${eventPath.commonCompMap}__is-open--alarm-list`, this.onAlarmOffset)
      this.$globalEventBus.$off(`${eventPath.commonCompToolBox}__map-control-show`, this.onMapControlShow)
    },
    initGlobalEvent() {
      // 地图控制判断显示隐藏
      this.$globalEventBus.$on(`${eventPath.commonCompToolBox}__map-control-show`, this.onMapControlShow)
      // 是否显示告警，从而定位地图组件位置
      this.$globalEventBus.$on(`${eventPath.commonCompMap}__is-open--alarm-list`, this.onAlarmOffset)
    },
    onMapControlShow(payLoad) {
      if (payLoad.mapId) {
        // 传了地图id的话，必须匹配才处理
        if (payLoad.mapId === this.mapId) {
          this.showMap = payLoad.status
        }
      } else {
        if (!this.isSmallMap) {
          // 不是小地图
          this.showMap = payLoad.status
        }
      }
    },
    onAlarmOffset(data) {
      this.boxrigth = data.isOpen ? this.pxToRem(this.alarmListOffset) : 0
    },
    // 初始化可选地图类型列表
    initTileModes() {
      let titles = [...this.nowTiles]
      // 进行过滤。注意这里是用tileMode配置项进行的过滤，因此可以由tileMode控制切换顺序。
      // 因此，tileMode配置项不能为空，如果为空将导致地图切换不能正常工作，回退为默认版本（即0 1 2 3
      let localTileMode = this.tileModes?.length > 0 ? this.tileModes : [0, 1, 2, 3]
      if (this.isSmallMap) {
        // isSmallMap是Ar大屏的偷懒配置项，视为在这里强制设置为[0, 1]，tileModes配置项失效
        localTileMode = [0, 1]
      }
      titles = localTileMode.map((i) => titles.find((item) => `${item.modeId}` === `${i}`))
      this.nowTiles = titles
    },
    // 查询用户记忆勾选图层
    getUserMemoryMap(success, defaultFunc = () => false) {
      if (!this.chooseMapMemoryKey) {
        // 如果传入的用户记忆为空，禁用此操作，不查询
        defaultFunc()
        return
      }
      getUserMemoryInfo([this.chooseMapMemoryKey], (resp) => {
        if (!resp.data) {
          defaultFunc?.()
          return
        }
        for (const item of resp.data) {
          if (this.chooseMapMemoryKey === item.memoryType) {
            if (item.memoryValue && success) {
              success(item.memoryValue)
            } else {
              defaultFunc()
            }
          }
        }
      })
    },
    // 把tileType转换成数字值，用于用户记忆使用
    _tileTypeToValue(is3D, tileType) {
      if (!is3D) {
        return tileType == 'vector' ? 0 : 1
      } else {
        return tileType == 'satellite' ? 2 : 3
      }
    },
    // 保存切换底图记录
    uptUserMemoryInfo(mapRef, tileMessage, eventtype) {
      if (!this.chooseMapMemoryKey) {
        // 如果传入的用户记忆为空，禁用此操作，不设置
        return
      }
      let memoryValue = null
      if (eventtype == 'onTileTypeChange') {
        console.log(tileMessage, 'onTileTypeChange', mapRef, this.is3D)
        memoryValue = this._tileTypeToValue(this.is3D, tileMessage)
      } else {
        console.log(tileMessage, 'tileMessage', mapRef)
        memoryValue = this._tileTypeToValue(tileMessage.MapType != '2D', tileMessage.TileType)
      }
      uptUserMemoryInfo({
        memoryType: this.chooseMapMemoryKey,
        memoryValue: memoryValue.toString()
      })
    },

    // TODOS start -------- 临时增加的方法，为了填充全局MapRef对象
    /**
     * 初始化地图函数
     * @param {string} fetchValue getUserMemoryInfo 接口返回值
     * @param {string} mapId 地图dom元素id
     * @param {[lon: number, lat: number]} center 经纬度坐标
     * @param {number} zoom 缩放等级
     */
    initMap(modeId) {
      const targetTile = this.nowTiles.find((o) => `${o.modeId}` === `${modeId}`) || this.nowTiles[0]
      const mapRef = {
        mapType: targetTile.mapType,
        domId: this.mapId, // string map dom id
        name: this.mapId, // string map dom id
        commonMapId: this.commonMapId,
        // current view status 当前页面状态
        viewerStatus: {
          zoom: this.defaultZoom,
          center: this.defaultCenter,
          tileType: targetTile.tileType
        },
        changeTileType: [], // 更换底图类型
        changeMapType: [], // 更换地图类型
        // options below 以下可选项
        // 涉及dom控制
        innerControl: [], // 地图上所有的控制器， eg 比如切换地图比例尺 zoom 切换2d 3d
        infoBox: [], // 静置在地图上的信息弹窗， eg: tooltips
        overlays: [], // 随动的地图信息弹窗， eg: 地图上的dom标签
        // 不涉及dom标签的
        layer: {}, // 图层控制 { '遮罩涂层': 'layer实例' }
        interAction: {}, // 地图控制器 {'漫游': '漫游控制器实例'}
        eventHander: {} // 事件控制 {'zoom相关':  'handler'}
      }
      return new Promise((resolve) => {
        try {
          const res = CTMapOl.MapControl.common.intiMapInstance(
            { mapRef },
            { maxZoom: this.maxZoom, minZoom: this.minZoom }
          )
          resolve({ ...mapRef, mapInstance: res })
        } catch (error) {
          console.error('init Map error: ', error)
        }
      })
    },
    setGloalMapRef(payload) {
      const { mapType } = payload
      const refValue = payload
      this.is3D = mapType === '3D'
      refValue.mapInstance.is3D = this.is3D
      // 如果事件名被重载过，认为当前地图是一个非全局地图实例。
      // 整个大屏只应存在一个基础地图实例。这种本地实例，setMapRef的第三个参数为true，代表不触发全局回调。
      this.mapRef?.setMapRef(
        this.mapId,
        refValue,
        this.resolveEventName !== `${eventPath.commonCompMap}__init-map-resolve`
      )

      this.mapReady = true
      this.emitResolveEvent({
        status: true,
        mapId: this.mapId
      })
      console.log(this.mapRef.getMapRef(this.mapId), 'new map ref.....')
    },
    mapTypeChangeCaller(newMapRef) {
      this.mapRef.getMapRef(this.mapId).changeMapType.forEach((ctMapRefUpdater) => {
        ctMapRefUpdater && ctMapRefUpdater(newMapRef)
      })
      this.is3D = this.mapRef.getMapRef(this.mapId).mapType === '3D'
      this.mapReady = true
      this.emitResolveEvent({
        status: true,
        mapId: this.mapId
      })
    },
    initTileControl() {
      const draftRef = this.mapRef.getDraftMapRef(this.mapId)
      const { mapType } = draftRef

      const tileControl = new CTMapOl.InnerControl.lib.TileControl(
        {
          mapRef: draftRef,
          tarDomId: this.tileControlId,
          mapClass: 'mapInstanceClass',
          parentDomId: this.commonMapId
        },
        {
          tiles: this.nowTiles,
          onTileTypeChange: (_mapRef, _eventType, _tileType) => {
            this.mapReady = false
            this.mapRef.mapRefUpdater(this.mapId, (draft) => {
              draft.viewerStatus.tileType = _tileType
            })
            // this.mapTypeChangeCaller(this.mapRef.getDraftMapRef(this.mapId))
            this.uptUserMemoryInfo(_mapRef, _tileType, 'onTileTypeChange')
            this.mapReady = true
          },
          // 二三维切换
          onMapTypeChange: (_mapRef, _eventType, eventobj) => {
            this.mapRef.mapRefUpdater(this.mapId, (draft) => {
              draft.mapType = eventobj.MapType
              draft.viewerStatus.tileType = eventobj.TileType
              draft.domId = eventobj.newdomid
              draft.mapInstance = eventobj.mapInstance
            })
            this.mapTypeChangeCaller(this.mapRef.getDraftMapRef(this.mapId))
            this.uptUserMemoryInfo(_mapRef, eventobj, 'onMapTypeChange')
          },
          beforeMapTypeChange: (mapref, eventtype, eventobj) => {
            this.mapReady = false
            this.emitResolveEvent({
              status: false,
              mapId: this.mapId,
              commonMapId: this.commonMapId
            })
            return true
          }
        }
      )

      this.mapRef.mapRefUpdater(this.mapId, (draft) => {
        draft.changeMapType.push(tileControl.mount.bind(tileControl))
      })
    },
    // 触发init-map-resolve事件的统一方法
    emitResolveEvent(param) {
      if (this.resolveEventName) {
        this.$globalEventBus.$emit(this.resolveEventName, param)
      }
      this.$emit('init-map-resolve', param)
    }
  }
}
</script>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.map-tools {
  .ctmap-union-layer-switcher__layerlist .map-tile-item {
    border-radius: px-to-rem(4) !important;
    &:hover {
      &:not(.map-tile-item__active) {
        border: px-to-rem(1) solid #ccc;
      }
      .ctmap-union-layer-switcher__layerlist .map-tile-name {
        opacity: 1;
      }
    }
  }

  .ctmap-union-layer-switcher__layerlist .map-tile-name {
    opacity: 1 !important;
    border-bottom-right-radius: px-to-rem(4) !important;
    border-bottom-left-radius: px-to-rem(4) !important;
    &:hover {
      opacity: 1;
    }
  }
}

.commmomMapClass {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #090f18;

  .mapInstanceClass {
    width: 100%;
    height: 100%;
  }

  .map-tools {
    position: absolute;
    right: px-to-rem(20);
    bottom: 0;

    .tile-control {
      position: absolute;
      right: px-to-rem(56);
      bottom: px-to-rem(68);
      z-index: 999;

      .ctmap-union-layer-switcher {
        width: px-to-rem(88) !important;

        &:hover {
          opacity: 1;
          width: var(--comp-map-switcher-width) !important;
        }
      }

      .ctmap-union-layer-switcher__layerlist {
        .map-tile-name {
          color: #172537;
        }

        .map-tile-item {
          border-radius: px-to-rem(4);
        }

        .map-tile-item:hover,
        .map-tile-item__active {
          .map-tile-name {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: px-to-rem(12);
            color: #e8f3fe;
            opacity: 1;
            border-bottom-right-radius: px-to-rem(4);
            border-bottom-left-radius: px-to-rem(4);
          }
        }
      }

      &.small-map {
        right: px-to-rem(47);
        bottom: px-to-rem(54);

        .ctmap-union-layer-switcher {
          &:hover {
            width: px-to-rem(170) !important;
          }
        }
      }
    }
  }
}

.cesium-viewer-fullscreenContainer {
  display: none !important;
}
</style>
