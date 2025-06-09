<template>
  <base-integration-button
    :iconName="iconName"
    :btnName="placeholder"
    :activated="activated"
    :menuList="mapOptions"
    :activeMenuKey="mapOptionValue"
    @btnClick="togglePanel"
    @menuClick="mapOptionChange"
  />
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import eventPath from '@component-gallery/build-event-bus-path'
import CTMapOl from '@ct/ct_map_ol'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import BaseIntegrationButton from '@component-gallery/base-components/bsse-integration-button/BaseIntegrationButton.vue'

const bem = createNameSpace('common-base')

const drawColorSetting = {
  'theme-wiseblue': {
    strokeColor: '#4F9FFF', // 绘制图形边框线
    fillColor: 'rgba(19,115,230,0.1)' // 绘制图形填充颜色
  },
  'theme-terracotta': {
    strokeColor: '#FFE167',
    fillColor: 'rgba(255,219,117,0.2)'
  },
  'theme-aquamarine': {
    strokeColor: '#0DC985',
    fillColor: 'rgba(13,201,133,0.2)'
  }
}
export default {
  name: 'BseLineSelect',
  data() {
    return {
      drawExp: {
        drawCircle: {
          value: 100000 * 100000 * Math.PI,
          tip: '最多可绘制半径不超过 100km 的圆形区域'
        },
        drawRectangle: {
          value: 10000 * 1000 * 1000,
          tip: '最多可绘制 10000km² 的区域'
        },
        drawPolygon: {
          value: 10000 * 1000 * 1000,
          tip: '最多可绘制 10000km² 的区域'
        }
      },
      closeHook: {
        closeDraw: null,
        strokeColor: null,
        fillColor: null
      },
      layerDesc: null,
      drawEnd: null,
      activated: false, // 按钮是否选中
      mapOptionShow: true, // 圈选方式是否显示
      mapOptions: [
        {
          key: 'circle',
          name: '圆形',
          value: 'drawCircle',
          iconName: 'circular-drawn'
        },
        {
          key: 'rectangle',
          name: '矩形',
          value: 'drawRectangle',
          iconName: 'surrounding-analysis-area'
        },
        {
          key: 'polygon',
          name: '多边形',
          value: 'drawPolygon',
          iconName: 'surrounding-analysis-rectangle'
        }
      ],
      mapOptionValue: '', // 选中的圈选方式
      themeKey: ''
    }
  },
  inject: ['mapRef'],
  computed: {
    bemClass() {
      return {
        container: bem.b('circle-selection'),
        trigger: bem.be('selection', 'trigger'),
        triggerItem: bem.be('section__trigger', 'item')
      }
    }
  },
  components: { BaseIntegrationButton },
  props: {
    // 按钮左侧icon名称的props
    iconName: {
      type: String,
      default: '' // 默认值为空字符串
    },
    // 定义前置条件的props
    preCondition: {
      type: Boolean,
      default: true // 默认值为true
    },
    // 定义前置条件描述的props
    preConditionDesc: {
      type: String,
      default: '' // 默认值为空字符串
    },
    // 定义占位符的props
    placeholder: {
      type: String,
      default: '集成按钮' // 默认值为'选择'
    },
    // 定义地图ID的props
    mapId: {
      type: String,
      default: 'mapId' // 默认值为'mapId'
    },
    // 定义偏移量的props
    offset: {
      // 组件相对于浏览器窗口定位信息
      type: Object,
      default: () => ({
        position: 'absolute',
        left: '40vw',
        top: '20vh'
      }) // 默认值为一个对象，包含位置信息
    },
    // 定义地图选项扩展的props
    mapOptionExpend: {
      type: Array,
      default: () => [] // 默认值为空数组
    },
    // 定义绘制异常扩展的props
    drawExpExpend: {
      type: Object,
      default: () => ({}) // 默认值为空对象
    },
    // 定义图层的props
    layer: {
      type: Number,
      required: true // 必填
    },
    // 定义图层异常描述的props
    layerAbnormalDesc: {
      // 当图层异常时 提示信息
      type: String,
      required: true // 必填
    },
    // 定义设备为空描述的props
    deviceEmpDesc: {
      // 圈选范围内 设备为空时 提示信息
      type: String,
      required: true // 必填
    }
  },
  beforeDestroy() {
    this.$emit('destroyEmit')
  },
  mounted() {
    // 监听全局事件总线上的'base-circle-selection-panel-to-closed'事件，并绑定_resetState方法
    this.$globalEventBus.$on(
      'base-circle-selection-panel-to-closed',
      this._resetState
    )
    // 初始化layerDesc为空字符串
    this.layerDesc = ''
    // 初始化drawEnd为空字符串，用于绘制结束的回调
    this.drawEnd = ''
    // 定义圈选的关闭方法，以及样式
    this.closeHook = {
      strokeColor: '#4F9FFF',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#1373E6',
      fillOpacity: 0.1,
      closeDraw: '' // 圈选的关闭方法，传给地图后，地图会将这属性覆盖为关闭方法
    }
    // 监听全局事件总线上的'commonCompMap__init-map-resolve'事件，用于地图加载完成
    this.$globalEventBus.$on(
      `${eventPath.commonCompMap}__init-map-resolve`,
      (payload) => {
        // 如果地图加载完成，则清空layerDesc
        if (payload.status) {
          this.layerDesc = ''
        }
      }
    )
    // 监听全局事件总线上的'commonCompLayersControl__layer-rendered'事件，用于图层加载完成
    this.$globalEventBus.$on(
      `${eventPath.commonCompLayersControl}__layer-rendered`,
      (id) => {
        // 如果加载完成的图层ID与当前组件的layerID相同，则更新layerDesc
        if (id == this.layer) {
          // layer[5] 是喇叭树图层
          setTimeout(() => {
            this.layerDesc = this.mapRef.getMapRef(this.mapId).layer[this.layer]
          })
        }
      }
    )
    // 监听全局事件总线上的'commonCompCameraCircleSelection__draw'事件，用于外部调用圈选功能
    this.$globalEventBus.$on(
      `${eventPath.commonCompCameraCircleSelection}__draw`,
      ({ type, drawEnd }) => {
        // 调用_draw方法进行绘制，并更新drawEnd
        this._draw(type)
        this.drawEnd = drawEnd
      }
    )
    // 监听全局事件总线上的'commonCompCameraCircleSelection__close'事件，用于外部关闭圈选功能
    this.$globalEventBus.$on(
      `${eventPath.commonCompCameraCircleSelection}__close`,
      () => {
        // 如果drawEnd不为空，则调用closeHook的closeDraw方法关闭圈选，并清空drawEnd
        if (this.drawEnd) {
          this.closeHook.closeDraw && this.closeHook.closeDraw()
          this.drawEnd = ''
        }
      }
    )
  },
  methods: {
    // 调用getThemeKey方法获取主题键
    getThemeKey() {
      // 使用setTimeout延迟获取主题键
      // 从document.documentElement的data-theme属性获取主题键
      this.themeKey =
        document.documentElement.getAttribute('data-theme') || 'theme-wiseblue'
      // 定义三个主题键对应的颜色
      // theme-wiseblue: 睿智蓝 theme-terracotta: 赤土黄 theme-aquamarine: 碧山绿
    },
    // 切换面板
    togglePanel() {
      // 如果不满足预条件，则返回警告信息
      if (!this.preCondition) {
        return CommonMessage.warning(this.preConditionDesc)
      }

      // 如果地图选项不显示，则清除圈选并返回
      if (!this.mapOptionShow) {
        this.$emit('clearedCircle', {
          type: 'reset',
          callback: this._resetState
        })
        return
      }

      // 切换激活状态
      this.activated = !this.activated
      // 如果激活，则获取地图引用
      if (this.activated) {
        const _mapRef = this.mapRef.getMapRef(this.mapId)
        // 如果地图引用不存在，则返回警告信息
        if (!_mapRef) {
          return CommonMessage.warning('请等地图加载完成再操作')
        }
        // 打印地图引用
        console.log(this.mapRef.getMapRef(this.mapId))
        // 更新layerDesc
        this.layerDesc = this.mapRef.getMapRef(this.mapId)?.layer[this.layer]
        // 如果layerDesc不存在，则打开图层
        if (!this.layerDesc) {
          this.openLayer(true)
        }
      } else {
        // 如果不激活，则重置状态并关闭绘制
        this._resetState()
        this.closeHook.closeDraw && this.closeHook.closeDraw()
      }
    },
    // 地图选项改变
    mapOptionChange(item) {
      // 更新地图选项值
      this.mapOptionValue = item.key
      // 根据地图选项值进行绘制
      this._draw(item.value)
    },
    // 绘制
    _draw(type = 'drawCircle') {
      this.getThemeKey()
      // 根据主题键更新绘制颜色
      this.closeHook.strokeColor = drawColorSetting[this.themeKey].strokeColor
      this.closeHook.fillColor = drawColorSetting[this.themeKey].fillColor
      // 调用CTMapOl的绘制方法
      CTMapOl?.InteractionControl?.common[type](
        {
          mapRef: this.mapRef.getMapRef(this.mapId)
        },
        this.closeHook
      )
        .then((res) => {
          // 获取绘制经验
          const exp = this.drawExp[type]
          // 如果绘制的面积大于经验值，则重绘并返回警告信息
          if (res.area > exp.value) {
            this._draw(type)
            return CommonMessage.warning(exp.tip)
          }
          // 如果layerDesc不存在，则重置状态并返回警告信息
          if (!this.layerDesc) {
            this.mapOptionValue = ''
            this.activated = false
            this._drawFail()
            return CommonMessage.warning(`${this.layerAbnormalDesc}`)
          }
          // 解构圈选信息
          this.deconstructCircle(res, type)
        })
        .catch((err) => {
          // 如果绘制失败，则重置状态并返回失败信息
          this._resetState()
          this._drawFail()
        })
    },
    // 解构圈选信息
    deconstructCircle(res, type) {
      // 需要首尾闭合，先自己拼
      res.geometry[0][res.geometry[0].length] = res.geometry[0][0]
      // 根据layerDesc进行空间搜索
      let info = this.layerDesc.spatialSearch({
        coord: [],
        bbox: [],
        geometry: {
          geometryValue: res.geometry,
          geometryType: (res.geometryType + '').toLowerCase()
        }
      })
      // 如果搜索信息不存在，则重置状态并返回失败信息
      if (!info) {
        this._resetState()
        this._drawFail()
        return
      }
      // 初始化列表
      let _list = []
      // 获取地图引用
      const _mapRef = this.mapRef.getMapRef(this.mapId)
      // 根据地图类型进行列表设置
      if (_mapRef.mapType === '3D') {
        this.setListBy3D(info, _list)
      } else {
        this.setListBy2D(info, _list)
      }
      // 如果列表为空，则返回警告信息并重绘
      if (!_list.length) {
        CommonMessage.warning(`${this.deviceEmpDesc}`)
        this._draw(type)
        return
      }
      // 打开插槽面板
      this.openSlotPanel(_list)
    },
    // 设置3D列表
    setListBy3D(info, _list) {
      // 遍历信息中的实体
      let data = info.ebtity || []
      data.forEach((item) => {
        // 如果实体有列表，则遍历列表并添加到_list
        if (item.props.list && item.props.list.length) {
          item.props.list.forEach((dev) => {
            _list.push(dev.deviceCode)
          })
        } else {
          // 如果没有列表，则直接添加实体的props到_list
          _list.push(item.props)
        }
      })
    },
    // 设置2D列表
    setListBy2D(info, _list) {
      // 遍历信息中的特征
      ;(info.feature || []).forEach((item) => {
        // 如果特征有数据列表，则遍历列表并添加到_list
        if (item.values_.data.list && item.values_.data.list.length) {
          item.values_.data.list.forEach((dev) => {
            _list.push(dev.deviceCode)
          })
        } else {
          // 如果没有数据列表，则直接添加特征的数据到_list
          _list.push(item.values_.data)
        }
      })
    },
    // 打开插槽面板
    openSlotPanel(devList) {
      // 如果是外部调用，则执行外部传过来的回调
      if (this.drawEnd) {
        console.log('圈完了数据', devList)
        let camera = []
        this.drawEnd(camera)
        this.drawEnd = ''
      } else {
        console.log('圈完了数据', devList)
        this.$emit('openChang', devList)
      }
      // 重置地图选项显示
      this.mapOptionShow = false
      // 发射清除圈选事件
      this.$emit('clearedCircle', {
        type: 'cleared',
        callback: this._resetState
      })
    },
    // 重置圈选状态
    _resetState() {
      // 重置地图选项显示
      this.mapOptionShow = true
      // 重置地图选项值
      this.mapOptionValue = ''
      // 重置激活状态
      this.activated = false
      // 关闭图层
      this.openLayer(false)
    },
    // 绘制失败是告诉外部（如果是外部调用）
    _drawFail() {
      // 如果是外部调用，则执行外部传过来的回调并返回失败信息
      if (this.drawEnd) {
        this.drawEnd(false)
        this.drawEnd = ''
      }
    },
    // 打开或者关闭图层
    openLayer(state) {
      // 发射打开图层事件
      this.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__open-layer`,
        {
          state: state,
          layerId: this.layer
        }
        // layerId 5 是喇叭图层
      )
    }
  },
  watch: {
    mapOptionExpend: {
      handler(val) {
        this.mapOptions = this.mapOptions.concat(val)
      },
      immediate: true
    },
    drawExpExpend: {
      handler(val) {
        if (Object.keys(this.drawExpExpend).length !== 0) {
          this.drawExp = { ...this.drawExp, ...val }
        }
      },
      immediate: true
    }
  }
}
</script>
