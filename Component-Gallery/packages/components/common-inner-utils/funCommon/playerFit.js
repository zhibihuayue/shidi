import { iframeDialog, videoPostMessage } from './common.js'

/**
 * player 嵌入适配
 */
export class $playerFit {
  /**
   * 右侧定位
   * @param originList 所有播放视频列表 必传, 参数: deviceCode(设备编码 Y)、channelCode(通道编码 Y)、longitude(经度 N)、latitude(纬度 N)、showClose(是否显示关闭按钮, 默认true显示 N)，后期可选videoHeight(窗口高度)
   * @param list 播放视频列表 必传, 参数: 同上，append或者remove的数据
   * @param type 后期可选
   * @param positon 定位, 可选, 参数: top(距离顶部距离)、right(距离右侧距离)
   */
  static rightByAppend(originList, list, type, positon = {}) {
    list = list || []
    if (window.top !== window) {
      iframeDialog('get', {
        iframeIds: ['bottom', 'right', 'floattool']
      })
        .then((windowInfo) => {
          // base-video-listener 减去 banner 高度
          if (
            document.getElementsByClassName('base-video-listener').length > 0
          ) {
            windowInfo = {
              ...windowInfo,
              innerHeight: windowInfo.innerHeight - 68
            }
          }

          this.rightByAppendAfter(originList, list, type, positon, windowInfo)
        })
        .catch(() => {
          console.log('未找到sdk')
        })
    } else {
      this.rightByAppendAfter(originList, list, type, positon, window)
    }
  }

  static rightByAppendAfter(originList, list, type, positon, windowInfo) {
    const winW = windowInfo.innerWidth
    const winH = windowInfo.innerHeight
    const iframeInfo = windowInfo.iframeInfo || {}
    const margin = positon.margin || [8, 8]
    let rightR = 0
    if (!positon.right) {
      if (iframeInfo['floattool']) {
        positon.right =
          winW -
          iframeInfo['floattool'].offsetLeft -
          iframeInfo['floattool'].offsetWidth
      } else {
        positon.right = 402
        rightR =
          winW -
          (iframeInfo['right']?.offsetLeft || winW) -
          (iframeInfo['right']?.offsetWidth || 0)
      }
    }
    if (!positon.top) {
      positon.top = '36%'
    }
    if (!positon.bottom) {
      positon.bottom = iframeInfo['bottom']?.offsetHeight || 8
    }
    const { right, top, bodyH } = this.rightAfter1(positon, winH, winW)
    const left = winW - right - rightR
    const autoH = bodyH / 3 - margin[1]
    const autoW = (autoH * 16) / 9
    const changeIndex = 2
    list = JSON.parse(JSON.stringify(list))
    this.rightByAppendAfter2({
      list,
      originList,
      type,
      autoH,
      autoW,
      top,
      left,
      margin,
      changeIndex
    })
  }

  static rightByAppendAfter2(params) {
    let {
      list,
      originList,
      type,
      autoH,
      autoW,
      top,
      left,
      margin,
      changeIndex
    } = params
    const listNew = []
    const appendList = list.map((ele) => ele.channelCode)
    originList.forEach((item, index) => {
      if (index > 4) {
        return false
      }
      if (!item) {
        return false
      }
      item.videoHeight = parseInt(autoH) + 'px'
      item.positonLeft = parseInt(left - autoW) + 'px'
      item.positonTop =
        parseInt(top + autoH * index + margin[1] * (index + 1)) + 'px'
      if (index > changeIndex) {
        item.positonLeft =
          parseInt(left - (autoW + margin[0]) * (index - changeIndex) - autoW) +
          'px'
        item.positonTop =
          parseInt(top + (autoH + margin[1]) * changeIndex + margin[1]) + 'px'
      }
      item.transformOrigin = '0 0'
      if (appendList.indexOf(item.channelCode) > -1) {
        listNew.push(item)
      }
    })
    this.doCall(type === 'remove' ? list : listNew, type)
  }

  /**
   * 中间定位
   * @param list 播放视频列表 必传, 参数: deviceCode(设备编码 Y)、channelCode(通道编码 Y)、longitude(经度 N)、latitude(纬度 N)、showClose(是否显示关闭按钮, 默认true显示 N)，后期可选videoHeight(窗口高度)
   * @param videoType 后期可选 new(清空后打开), append(拼接播放)
   * @param positon
   */
  static center(list, videoType, positon) {
    list = list || []
    videoType = videoType || 'new'
    this.get().then((playings) => {
      let len = list.length
      if (videoType === 'append') {
        len += playings.length
      }
      if (len > 1) {
        this.right(list, videoType, positon)
        return false
      }
      if (window.top !== window) {
        iframeDialog('get')
          .then((windowInfo) => {
            const winH = windowInfo.innerHeight
            list = JSON.parse(JSON.stringify(list))
            const item = list[0]
            item.index = 0
            let height = parseFloat(item.videoHeight || winH * 0.65)
            if (String(item.videoHeight).indexOf('%') > -1) {
              height = (winH * height) / 100
            }
            item.videoHeight = parseInt(height) + 'px'
            if (!list.length) {
              return false
            }
            this.doCall(list, videoType)
          })
          .catch(() => {
            console.log('未找到sdk')
          })
      } else {
        const winH = window.innerHeight
        list = JSON.parse(JSON.stringify(list))
        const item = list[0]
        item.index = 0
        let height = parseFloat(item.videoHeight || winH * 0.65)
        if (String(item.videoHeight).indexOf('%') > -1) {
          height = (winH * height) / 100
        }
        item.videoHeight = parseInt(height) + 'px'
        if (!list.length) {
          return false
        }
        this.doCall(list, videoType)
      }
    })
  }

  /**
   * 右侧定位
   * @param list 播放视频列表 必传, 参数: deviceCode(设备编码 Y)、channelCode(通道编码 Y)、longitude(经度 N)、latitude(纬度 N)、showClose(是否显示关闭按钮, 默认true显示 N)，后期可选videoHeight(窗口高度)
   * @param videoType 后期可选 new(清空后打开), append(拼接播放)
   * @param positon 定位, 可选, 参数: top(距离顶部距离)、right(距离右侧距离)
   */
  static right(list, videoType, positon = {}) {
    list = list || []
    videoType = videoType || 'new'
    this.get().then((playings) => {
      if (window.top !== window) {
        iframeDialog('get', {
          iframeIds: ['bottom', 'right', 'floattool']
        })
          .then((windowInfo) => {
            if (
              document.getElementsByClassName('base-video-listener').length > 0
            ) {
              windowInfo = {
                ...windowInfo,
                innerHeight: windowInfo.innerHeight - this.realPx(50)
              }
            }
            this.rightAfter(list, videoType, positon, playings, windowInfo)
          })
          .catch(() => {
            console.log('未找到sdk')
          })
      } else {
        this.rightAfter(list, videoType, positon, playings, window)
      }
    })
  }

  static rightAfter(list, videoType, positon, playings, windowInfo) {
    const winW = windowInfo.innerWidth
    const winH = windowInfo.innerHeight
    const iframeInfo = windowInfo.iframeInfo || {}
    const margin = positon.margin || [8, 8]

    let rightR = 0
    if (!positon.right) {
      if (iframeInfo['floattool']) {
        positon.right =
          winW -
          iframeInfo['floattool'].offsetLeft -
          iframeInfo['floattool'].offsetWidth
      } else {
        positon.right = 402
        rightR =
          winW -
          (iframeInfo['right']?.offsetLeft || winW) -
          (iframeInfo['right']?.offsetWidth || 0)
      }
    }
    if (!positon.top) {
      positon.top = '36%'
    }
    if (!positon.bottom) {
      positon.bottom = iframeInfo['bottom']?.offsetHeight || 8
    }
    const { right, top, bodyH } = this.rightAfter1(positon, winH, winW)

    const left = winW - right - rightR
    const autoH = bodyH / 3 - margin[1]
    const autoW = (autoH * 16) / 9
    const changeIndex = 2
    list = JSON.parse(JSON.stringify(list)).slice(0, 5)
    if (videoType === 'append') {
      this.beforePlay(list, playings)
    }
    this.rightAfter2({
      list,
      videoType,
      autoH,
      autoW,
      top,
      left,
      margin,
      changeIndex
    })
  }

  static rightAfter1(positon, winH, winW) {
    const minBHeight = (214 + 12) * 3

    let right = parseFloat(positon.right)
    if (String(positon.right).indexOf('%') !== -1) {
      right = (right / 100) * winW
    }
    let top = parseFloat(positon.top)
    if (String(positon.top).indexOf('%') !== -1) {
      top = (top / 100) * winH
    }
    let bottom = parseFloat(positon.bottom)
    if (String(positon.bottom).indexOf('%') !== -1) {
      bottom = (bottom / 100) * winH
    }
    let bodyH = winH - top - bottom
    if (positon.tHeight) {
      bodyH = +positon.tHeight
      bottom = winH - bodyH - top
      if (bottom < 0) {
        bottom = 0
        bodyH = winH - top
      }
    }

    if (positon.bHeight) {
      bodyH = +positon.bHeight
      top = winH - bodyH - bottom
      if (top < 0) {
        top = 0
        bodyH = winH - bottom
      }
    }

    // 设置最小 bodyH
    if (bodyH < minBHeight) {
      bodyH = minBHeight
      top = winH - bodyH - bottom
      if (top < 0) {
        top = 0
        bodyH = winH - bottom
      }
    }

    return { right, top, bodyH }
  }

  static rightAfter2(params) {
    let { list, videoType, autoH, autoW, top, left, margin, changeIndex } =
      params
    list.forEach((item, i) => {
      let index = i
      if (videoType === 'append' && item.index !== undefined) {
        index = item.index
      }
      item.index = index
      item.videoHeight = parseInt(autoH) + 'px'
      item.positonLeft = parseInt(left - autoW) + 'px'
      item.positonTop =
        parseInt(top + autoH * index + margin[1] * (index + 1)) + 'px'
      if (index > changeIndex) {
        item.positonLeft =
          parseInt(left - (autoW + margin[0]) * (index - changeIndex) - autoW) +
          'px'
        item.positonTop =
          parseInt(top + (autoH + margin[1]) * changeIndex + margin[1]) + 'px'
      }
      item.transformOrigin = '0 0'
    })
    if (!list.length) {
      return false
    }
    this.doCall(list, videoType)
  }

  /**
   * 播放前处理
   */
  static beforePlay(list, old) {
    const max = 5
    const keep = []
    for (let i = list.length - 1; i >= 0; i--) {
      const isPlaying = old.find(
        (item) =>
          item.deviceCode === list[i].deviceCode &&
          item.channelCode === list[i].channelCode &&
          item.videoType === 'append'
      )
      if (isPlaying) {
        list.splice(i, 1)
        keep.push(isPlaying.index)
      }
    }
    const oldF = JSON.parse(JSON.stringify(old))
    for (let j = 0; j < max; j++) {
      if (oldF[j]?.index !== j) {
        oldF.splice(j, 0, false)
      }
    }
    let gap = max - old.length
    let count = 0
    for (let k = 0; k < oldF.length; k++) {
      if (oldF[k]) {
        continue
      }
      if (list[count]) {
        list[count].index = k
      }
      if (++count >= gap) {
        break
      }
    }

    old.sort((a, b) => a.timeIndex - b.timeIndex)
    this.beforePlay2(old, keep, list, gap)
    old.sort((a, b) => a.index - b.index)
  }

  static beforePlay2(old, keep, list, gap) {
    old.forEach((item) => {
      if (!keep.includes(item.index) && list[gap]) {
        list[gap].index = item.index
        this.close([item])
        gap++
      }
    })
  }

  /**
   * 关闭窗口
   * @param list 关闭视频列表 可选, 参数: deviceCode(设备编码 Y)、channelCode(通道编码 Y); 不传则关闭所有窗口
   * @param removeType 关闭视频列表的类型 不传默认关闭全部 可选：‘append’, 'new'
   */
  static close(list, removeType = undefined) {
    list = list || []
    list = JSON.parse(
      JSON.stringify(
        list.map((t) => {
          return {
            ...t,
            videoType: removeType
          }
        })
      )
    )
    const videoType = list.length ? 'remove' : 'removeAll'
    this.doCall(list, videoType)
  }

  /**
   * 获取正在播放的窗口
   * @param list 关闭视频列表 可选, 参数: deviceCode(设备编码 Y)、channelCode(通道编码 Y); 不传则关闭所有窗口
   */
  static get() {
    return new Promise((result) => {
      const videoType = 'getPlaying'
      const videoParam = {
        videoType
      }

      this.postMessage(videoParam)
      const callback = (event) => {
        if (event?.data?.callBackMethod === videoType) {
          result(event.data.videoData)
          window.removeEventListener('message', callback)
        }
      }

      window.addEventListener('message', callback)
    })
  }

  // 发消息
  static postMessage(videoParam) {
    // 当前 iframe 内存在 base-video-listener 组件 向当前 window 发送消息
    if (document.getElementsByClassName('base-video-listener').length > 0) {
      window.postMessage(videoParam, '*')
    } else {
      // 否则 向父级(通用)发送消息
      videoPostMessage(videoParam)
    }
  }

  /**
   * 触发
   */
  static doCall(list, videoType) {
    list.forEach((item) => {
      item.closeCallBackMethod =
        item.closeCallBackMethod || 'bigScreenPlayerClose'
      item.clickCallBackMethod =
        item.clickCallBackMethod || 'bigScreenPlayerClick'
    })
    const videoParam = {
      videoType: videoType,
      videoDataList: list
    }
    console.log('===================doCall=====================', videoParam)
    this.postMessage(videoParam)
  }

  static pxToRem(px) {
    return `${px / 100}rem`
  }

  /**
   * @description 将通过pxtToRem转换的rem重新转换为真实像素
   * @param {string | number} px 需要转换的原像素值
   * @returns {number}
   */
  static realPx(px) {
    const ele = document.querySelector('html')
    const fontSize = window.getComputedStyle(ele).fontSize.split('px')[0]
    const rem = this.pxToRem(px).split('rem')[0]
    const result = Number(rem) * Number(fontSize)
    return result.toString()
  }
}
