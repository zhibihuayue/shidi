import { $playerFit } from '../funCommon/playerFit.js'
import redPoint from '@component-gallery/assets/image/tool-box/coordinate-red.png'
import forestRedPoint from '@component-gallery/assets/image/tool-box/analysis-center_point@2x.png'
import gtPoint from '@component-gallery/assets/image/tool-box/terracotta/red-icon.png'
import CommonMessage from '../funCommon/message/common-message.js'
import {
  startpickcood,
  addMarker,
  removeMarker
} from '../mapCommon/map-ol/CommonMap-iw.js'
import { $v, urlBis, urlBaseService } from '../funCommon/common.js'
import eventPath from '@component-gallery/build-event-bus-path'

const request = ({ vue, url, method, data }) => {
  return new Promise((resolve, reject) => {
    $v[method](
      vue,
      `${url}`,
      data,
      (resp) => {
        resolve(resp)
      },
      (e) => {
        reject(e)
      },
      {
        loading: false
      }
    )
  })
}

function getVideoAndUrl(vue, data) {
  return request({
    vue,
    url: 'bdm/aroundAnalysisOwn/getVideoAndUrl',
    method: 'post',
    data
  })
}

function pointsValidBatch(vue, data) {
  return request({
    vue,
    url: '/video-video/video/query/pointsValidBatch',
    method: 'post',
    data
  })
}

function turnToPtzByPointAngle(vue, data) {
  return request({
    vue,
    url: '/video-video/video/query/turnToPtzByPointAngle',
    method: 'post',
    data
  })
}

function getPointsValidsValid(vueThis, urlList) {
  let deviceCodeList = urlList.map((item) => item.deviceCode)
  pointsValidBatch(vueThis, deviceCodeList).then((res) => {
    if (res.data) {
      const uniqueDeviceCodes = new Set(
        res.data
          .filter((item) => item.isPointsValid == '0')
          .map((item2) => item2.deviceCode)
      )
      const title = Array.from(uniqueDeviceCodes).join(',')
      if (title) {
        CommonMessage.warning(
          `${title}该摄像机未标定，请联系铁塔管理员进行标定`
        )
      }
    }
  })
}

const dealVideoMessage = (e, options, thisCall = []) => {
  const { onClick, onAllClose, onClose } = options
  if (!e.data) {
    return
  }
  // message的类型会有很多，需要自己过滤准确的视频事件
  if (e.data.callBackMethod === 'KanzheliClickCallback') {
    onClick?.(e.data)
  }
  if (e.data.callBackMethod === 'KanzheliCloseCallback') {
    if (thisCall.length > 0) {
      const targetIndex = thisCall.findIndex(
        (o) =>
          o &&
          o.deviceCode === e.data.videoData.deviceCode &&
          o.channelCode === e.data.videoData.channelCode
      )
      thisCall.splice(targetIndex, targetIndex === -1 ? 0 : 1)
      if (thisCall.length === 0) {
        onAllClose?.()
      }
    }
    if (onClose) {
      onClose(e.data)
    }
  }
}

const dealKanzheliError = (msg) => {
  if (msg.indexOf('周围暂无可用设备') !== -1) {
    CommonMessage.warning('周围暂无可用设备')
  } else {
    CommonMessage.warning(msg)
  }
}

const getFitScale = (newheight, newvideoListNeedHeight) => {
  if (newheight < newvideoListNeedHeight) {
    return (newheight / 3 - 12) / 214
  }
  return 1
}

const getMarginX = (videoPositionBottom) => {
  // 以下计算从摄像机树抄来的，具体含义未知
  const bottom = videoPositionBottom ?? DEFAULT_BOTTOM
  const top = 0
  const overallHeight = window.innerHeight
  const height = overallHeight - bottom - top
  const videoListNeedHeight = (214 + 12) * 3
  let scale = getFitScale(height, videoListNeedHeight)
  return 52 * scale
}

const DEFAULT_BOTTOM = 36
const calculateBottom = (videoPositionBottom) =>
  videoPositionBottom || (DEFAULT_BOTTOM * window.innerHeight) / (1080 - 52)

// 开启“看这里”功能，指定经纬度版本。这个版本不会进行地图选点
// 这个方法也会作为坐标拾取的内部方法使用
export function openKanzheliFixedPoint(vueThis, mapInstance, options = {}) {
  // 配置项支持半径、设备或通道编码。半径默认是3000米，编码默认不查
  const {
    lng,
    lat,
    radius = '5000',
    deviceCode, // 这是过滤参数
    channelCode, // 这是过滤参数
    onClick,
    onClose,
    onAllClose,
    targetDeviceInfo // 这是指定设备。如果有这个值，那么就不查询，只是拉起当前设备。
  } = options
  if (!lng || !lat) {
    // 经纬度必传，如果没有的话，无法运行
    return
  }

  // 查询附近的摄像机，拉起视频
  $playerFit.close() // 先关闭之前的视频
  // 如果存在回调配置，那么就执行这些回调
  let thisCall = []
  const hasCallback = onClick || onClose || onAllClose
  const mycallback = hasCallback
    ? debounce((e) => dealVideoMessage(e, options, thisCall), 250)
    : null
  // 传给监听器的回调
  const listenerCallBack = mycallback
  let alarmListCallback
  const params = {
    longitude: lng,
    latitude: lat,
    deviceCode,
    channelCode,
    radius // 默认搜索半径
  }
  const urlPromise = targetDeviceInfo
    ? Promise.resolve({
        data: {
          urlList: targetDeviceInfo.channels.map((o) => ({
            deviceCode: targetDeviceInfo.deviceCode,
            siteCode: targetDeviceInfo.siteCode,
            longitude: targetDeviceInfo.longitude,
            latitude: targetDeviceInfo.latitude,
            channelCode: o.channelCode
          }))
        }
      })
    : getVideoAndUrl(vueThis, params)
  urlPromise
    .then((resp) => {
      // 有设备，拉起通道
      // 转动可视域，组装可视域的调整信息
      thisCall = resp.data.urlList
      resp.data.urlList.forEach((item) => {
        item.openQuickTool = true
        const theme = document
          .getElementsByTagName('html')[0]
          .getAttribute('data-theme')
        const colorMap = {
          'theme-aquamarine': '#FFFA28',
          'theme-terracotta': '#fffa27',
          'theme-wiseblue': '#1373E6'
        }
        item.checkedBorder = colorMap[theme] // 视频窗口选中时边框，需要换肤
        // 将摄像机看向选点
        item.lookHere = {
          turnCallBack: 'turnCallBackMethod',
          ptzInfo: {
            deviceCode: item.deviceCode, // 设备编号
            channelCode: item.channelCode, // 通道编号
            cameraLon: Number(item.longitude), // 摄像机经纬度
            cameraLat: Number(item.latitude),
            pointLon: lng, // 选点经纬度
            pointLat: lat,
            siteCode: item.siteCode
          }
        }
        item.closeCallBackMethod = 'KanzheliCloseCallback'
        item.clickCallBackMethod = 'KanzheliClickCallback'
        // 调用服务，转动摄象机方向
        turnToPtzByPointAngle(item.lookHere.ptzInfo).then((res2) => {
          // 转动后要求刷新可视域
          vueThis.$globalEventBus.$emit(
            `${eventPath.commonCompLayersControl}__refresh-viewshed`
          )
        })
      })
      // 处理完毕，进行播放功能拉起

      // 需求需要处理看这里的偏移，这里单独为告警列表伸缩这种功能处理一个监听
      // 初始条件从window的伪仓库获取
      const videoPositionRight = window._remoteMetadata?.videoPositionRight
      const videoPositionBottom = window._remoteMetadata?.videoPositionBottom
      // 然后监听大屏事件，来实现动态切换。大屏事件是和集成工程约定的
      alarmListCallback = () => {
        const newmarginX = getMarginX(
          window._remoteMetadata?.videoPositionBottom
        )
        $playerFit.right(resp.data.urlList, 'new', {
          checked: 'red',
          bottom: calculateBottom(window._remoteMetadata?.videoPositionBottom),
          bHeight: (214 + 12) * 3,
          margin: [newmarginX, 12],
          right: window._remoteMetadata?.videoPositionRight
            ? window._remoteMetadata?.videoPositionRight + 'px'
            : undefined
        })
      }
      vueThis.$globalEventBus.$on(
        `screenview__updateVideoOffset`,
        alarmListCallback
      )

      const marginX = getMarginX(videoPositionBottom)
      getPointsValidsValid(vueThis, resp.data.urlList)
      $playerFit.right(resp.data.urlList, 'append', {
        right: videoPositionRight + 'px',
        bottom: calculateBottom(videoPositionBottom),
        bHeight: (214 + 12) * 3,
        margin: [marginX, 12]
      })

      if (listenerCallBack) {
        window.addEventListener('message', listenerCallBack)
      }
    })
    .catch((err) => {
      dealKanzheliError(err.msg)
    })

  return () => {
    $playerFit.close()
    if (listenerCallBack) {
      window.removeEventListener('message', listenerCallBack)
    }
    if (alarmListCallback) {
      vueThis.$globalEventBus.$off(
        `screenview__updateVideoOffset`,
        alarmListCallback
      )
    }
  }
}

/**
 * 创建一个 debounce 函数，该函数在指定的延迟时间内只会执行一次。
 *
 * @param func 需要 debounce 的函数
 * @param wait 延迟时间，单位为毫秒
 * @param immediate 是否立即执行一次（在等待时间之前）
 */
export function debounce(func, wait, immediate = false) {
  let timeout

  return function (...args) {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        func.apply(context, args)
      }
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

// 开启“看这里“功能。返回一个Promise，payload是当次取消看这里功能的回调；
// 这个是地图选点功能版本
// options可以传入deviceCode和channelCode来指定是某个摄像机设备
// 这是一个Promise方法，返回值是完整取消方法的回调。openKanzheli().then(cancel => cancel()) 这个cancel就是关闭地图选点功能的取消方法
export function openKanzheli(vueThis, mapInstance, options = {}) {
  // 开启“看这里”功能
  if (!mapInstance) {
    return
  }

  // 暂时性打开摄像机图层（如果摄像机图层已经打开了，这个事件不会有任何效果）
  vueThis.$globalEventBus.$emit(
    `${eventPath.commonCompLayersControl}__open-layer`,
    { state: true, layerId: 1 }
  )

  // 使用坐标拾取，来获取点击的位置
  let lastPointId = null
  let destroyFun

  vueThis.$globalEventBus.$emit(
    `${eventPath.commonCompLayersControl}__disable-marker-select`,
    {
      status: true
    }
  )
  vueThis.$globalEventBus.$emit(
    `${eventPath.commonCompLayersControl}__toggle-kanzheli`,
    {
      status: true
    }
  )
  return startpickcood(mapInstance, (res) => {
    // 返回的应该是经纬度数据，经纬度取六位小数
    const lng = res.lonlat[0].toFixed(6)
    const lat = res.lonlat[1].toFixed(6)
    const theme = document
      .getElementsByTagName('html')[0]
      .getAttribute('data-theme')
    const imgMap = {
      'theme-aquamarine': {
        img: forestRedPoint,
        size: 40
      },
      'theme-terracotta': {
        img: gtPoint,
        size: 40
      },
      'theme-wiseblue': {
        img: redPoint,
        size: 38
      }
    }
    removeMarker(mapInstance, lastPointId)
    addMarker(mapInstance, {
      center: res.lonlat,
      zIndex: 20, // zIndex过高会导致打点在三维地图zoom处于高等级时消失
      style: {
        offset: [imgMap[theme].size / 2, imgMap[theme].size],
        width: imgMap[theme].size,
        height: imgMap[theme].size,
        icon: imgMap[theme].img || redPoint
      }
    }).then((e) => {
      lastPointId = e
    })
    if (destroyFun) {
      destroyFun()
    }
    destroyFun = openKanzheliFixedPoint(vueThis, mapInstance, {
      ...options,
      lng,
      lat
    })
  }).then((cancelFun) => {
    // 返回值是完整取消方法的回调
    return () => {
      // 关闭暂时打开的摄像机图层， 如果摄像机图层原本是开启的，这个事件不会有任何效果
      vueThis.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__open-layer`,
        { state: false, layerId: 1, keepWindow: true }
      )
      vueThis.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__disable-marker-select`,
        {
          status: false
        }
      )
      vueThis.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__toggle-kanzheli`,
        {
          status: false
        }
      )
      destroyFun?.()
      cancelFun()
      removeMarker(mapInstance, lastPointId)
    }
  })
}
