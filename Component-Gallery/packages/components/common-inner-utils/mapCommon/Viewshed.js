import { request } from '../request/API/index'
import CTMapOl from '@ct/ct_map_ol'

// 获取可视域数据
function getDeviceVisibleBySite(data) {
  // 接口改造，新增了queryType参数，写死为2
  data.queryType = 2
  return request({
    vue: this,
    url: '/device/industry/device/getDeviceVisibleBySite',
    method: 'post',
    data
  })
}

/**
 * 可视域类
 */
export default class Viewshed {
  /**
   * 初始化
   * @param {*} mapRef 地图实例
   * @param {*} theme 皮肤 'ty': 通用wiseblue, 'ly': 林业aquamarine, 'gt': 国土terracotta
   */
  constructor(mapRef, theme = 'ty') {
    this.mapRef = mapRef
    this.theme = theme // 主题
    this.signal = true // 可视域类正常运行的标志
    this.viewshed2d = null // 用来存储二维可视域实例
    this.viewshed3d = {} // 用来存储三维可视域实例
    this.selectedCode = '' // 选中的可视域id（siteCode）
    this.siteInfoList = [] // 设备信息

    // 默认可视域配置
    this.defaultViewShedConfig = {
      distance: 3000,
      height: '10',
      horizViewRange: '157.79',
      vertiViewRange: '-2.90',
      horizRange: '36.52',
      vertiRange: '27.00',
      visualRange: '3'
    }
    // 样式配置
    this.styleConfig = {
      ty: {
        backgroundColor: '#4F9FFF', // 背景面颜色
        fanColor: '#4F9FFF', // 扇形颜色
        backgroundSelectedColor: '#FB913C', // 背景面选中颜色
        fanSelectedColor: '#FB913C' // 扇形选中颜色
      },
      ly: {
        backgroundColor: '#3CFFE9',
        fanColor: '#3CFFE9',
        backgroundSelectedColor: '#F9FF6C',
        fanSelectedColor: '#F9FF6C'
      },
      gt: {
        backgroundColor: '#FFFA28',
        fanColor: '#FFFA28',
        backgroundSelectedColor: '#FF7F3C',
        fanSelectedColor: '#FF7F3C'
      }
    }
  }

  /**
   * 渲染可视域
   * @param {Array} siteInfoList 设备信息列表
   * 子项必须具备的属性为 { siteCode, deviceCode, longitude, latitude }
   */
  async renderViewshed(siteInfoList) {
    // 渲染前先清理
    this.clearViewshed()
    this.siteInfoList = siteInfoList // 设备信息
    const deviceCodes = siteInfoList.map((item) => item.deviceCode)
    const { data } = await getDeviceVisibleBySite({
      deviceCodes
    })
    // 检查当前的signal是否为true 如果为false则不进行渲染
    if (!this.signal) {
      // 还原signal
      this.signal = true
      return
    }
    const viewshedList = deviceCodes.map((deviceCode) => {
      const item = data.find((device) => device.deviceCode === deviceCode) || {
        deviceCode,
        ...this.defaultViewShedConfig
      }
      const target = siteInfoList.find(
        (unit) => item.deviceCode === unit.deviceCode
      )
      return {
        ...item,
        id: target.siteCode,
        longitude: +target.longitude,
        latitude: +target.latitude,
        // 可视域范围
        distance:
          Number(item?.visualRange || this.defaultViewShedConfig.visualRange) *
          1000,
        // 可视域方向
        heading: Number(
          item?.horizViewRange || this.defaultViewShedConfig.horizViewRange
        ),
        // 可视域角度
        angle: Number(
          +item?.horizRange || this.defaultViewShedConfig.horizRange
        )
      }
    })
    console.log('可视域数据', viewshedList)
    // 二三维可视域渲染
    if (!(this.mapRef.mapType === '3D')) {
      const options = this.formatViewshedOptions(viewshedList)
      const viewshedObj = new CTMapOl.extend.ViewShed(
        this.mapRef.mapInstance,
        options,
        (feature) => {
          console.log(feature)
        }
      )
      this.viewshed2d = viewshedObj
    } else {
      viewshedList.forEach((config) => {
        this.viewshed3d[`${config.id}`] = this.render3dViewshed(
          this.mapRef.mapInstance,
          config,
          this.styleConfig[this.theme].fanColor
        )
      })
    }
    setTimeout(() => {
      // 避免可视域刷新后选中效果消失
      if (this.selectedCode) {
        this.setViewshedSelected(this.selectedCode)
      }
    })
    // 存储渲染的可视域deviceCode
    this.viewshedCodes = deviceCodes
  }

  /**
   * 清除可视域
   * @param {*} id 可视域id
   */
  clearViewshed(id = '') {
    if (!(this.mapRef.mapType === '3D')) {
      if (!this.viewshed2d) {
        return
      }
      this.viewshed2d && this.viewshed2d.destroy()
      this.viewshed2d = null
    } else {
      if (!Object.keys(this.viewshed3d || {}).length) {
        return
      }
      // 如果传入id，则销毁对应id的可视域 不然则销毁所有可视域
      if (id) {
        this.viewshed3d[id] && this.viewshed3d?.[id].remove()
        this.viewshed3d[id] = null
      } else {
        Object.keys(this.viewshed3d).forEach((key) => {
          this.viewshed3d[key] && this.viewshed3d[key].remove()
        })
        this.viewshed3d = {}
      }
    }
    this.viewshedCodes = []
    this.siteInfoList = []
  }

  // 格式化2d可视域配置
  formatViewshedOptions(list) {
    const [r1, g1, b1] = this.hexToRgb(
      this.styleConfig[this.theme].backgroundColor
    )
    const [r2, g2, b2] = this.hexToRgb(
      this.styleConfig[this.theme].backgroundSelectedColor
    )
    return {
      pts: list.map((item) => ({
        lonlat: [+item.longitude, +item.latitude],
        name: item.id,
        radius: +item.distance || 1, // 半径，单位 米
        fanHorizontalView: item.angle, // 扇形可视角度
        fanDirection: item.heading // 扇形中心线的角度，顺时针旋转
      })),
      // 背景面的参数设置
      background: {
        // 背景面的参数设置
        Visible: true,
        Style: new CTMapOl.style.Style({
          fill: new CTMapOl.style.Fill({
            color: `rgba(${r1}, ${g1}, ${b1}, 0.2)`
          })
        }), // 面样式
        StyleSelected: new CTMapOl.style.Style({
          fill: new CTMapOl.style.Fill({
            color: `rgba(${r2}, ${g2}, ${b2}, 0.2)`
          }),
          zIndex: Infinity
        }) // 面选中时样式
      },
      fan: {
        Visible: true, // 扇形面的参数设置
        Style: new CTMapOl.style.Style({
          fill: new CTMapOl.style.Fill({
            color: `rgba(${r1}, ${g1}, ${b1}, 0.7)`
          })
        }), // 面样式
        StyleSelected: new CTMapOl.style.Style({
          fill: new CTMapOl.style.Fill({
            color: `rgba(${r2}, ${g2}, ${b2}, 0.7)`
          }),
          zIndex: Infinity
        }) // 面选中时样式
      },
      zIndex: 13,
      minZoom: 3, // 最小可视级别，采用小数，保证和地图的整数级别吻合
      maxZoom: 18 // 最大可视级别，采用小数，保证和地图的整数级别吻合
    }
  }

  hexToRgb(hex) {
    // 去除开头的#字符
    hex = hex.replace(/^#/, '')

    // 检查是否为有效的6位十六进制颜色代码
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color code')
    }

    // 拆分颜色代码为RGB部分
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    // 返回RGB
    return [r, g, b]
  }

  /**
   * 3D-摄像机可视域
   */
  render3dViewshed(map, dev, color = '#3CFFE9') {
    const opt = {
      lng: +dev.longitude,
      lat: +dev.latitude,
      horizontalView: dev.angle,
      distance: dev.distance ? dev.distance / 1000 : 3,
      direction: dev.heading,
      outColor: color,
      outOpacity: 0.3,
      innerColor: color,
      innerOpacity: 0.8,
      innerlineColor: color,
      innerlineOpacity: 0.3,
      outlineWidth: 0,
      outlineOpacity: 0.001,
      id: dev.id,
      zoomto: false
    }
    return new CTMapOl.cesiumComponent.ViewShed2D(map, opt)
  }

  /**
   * 通过siteCode选中可视域
   * @param {*} siteCode
   */
  async setViewshedSelected(siteCode) {
    try {
      const mapRef = this.mapRef
      // 取出选中目标的信息
      const range = this.siteInfoList
      const target = range.find((item) => item.siteCode === siteCode)
      if (!target) {
        return
      }
      this.selectedCode = siteCode
      // 2维就直接用api选中 3维需要重新渲染单个可视域
      if (!(this.mapRef.mapType === '3D')) {
        this.viewshed2d &&
          this.viewshed2d.selectViewshed((data) => data.name === siteCode)
      } else {
        // 检查当前的signal是否为true 如果为false则不进行渲染
        if (!this.signal) {
          // 还原signal
          this.signal = true
          return
        }
        // 获取选中的可视域参数
        const { code, data } = await getDeviceVisibleBySite({
          deviceCodes: [target.deviceCode]
        })
        let viewshedConfig = {}
        if (+code === 200 && data.length) {
          const viewshedInfo = data[0]
          viewshedConfig = {
            distance:
              Number(
                +viewshedInfo?.visualRange ||
                  this.defaultViewShedConfig.visualRange
              ) * 1000,
            heading: Number(
              +viewshedInfo?.horizViewRange ||
                this.defaultViewShedConfig.horizViewRange
            ),
            angle: Number(
              +viewshedInfo?.horizRange || this.defaultViewShedConfig.horizRange
            )
          }
        } else {
          viewshedConfig = {
            // ...this.defaultViewShedConfig,
            distance: Number(this.defaultViewShedConfig.visualRange) * 1000,
            heading: Number(this.defaultViewShedConfig.horizViewRange),
            angle: Number(this.defaultViewShedConfig.horizRange)
          }
        }
        this.viewshed3d?.[siteCode] && this.viewshed3d[siteCode].remove()
        this.viewshed3d[siteCode] = this.render3dViewshed(
          mapRef.mapInstance,
          { ...target, ...viewshedConfig, id: target.siteCode },
          this.styleConfig[this.theme].fanSelectedColor
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 清除可视域选中
   */
  clearViewshedSelect() {
    this.selectedCode = ''
    if (!(this.mapRef.mapType === '3D')) {
      this.viewshed2d && this.viewshed2d?.clearSelected()
    } else {
      this.renderViewshed(this.siteInfoList)
    }
  }
}
