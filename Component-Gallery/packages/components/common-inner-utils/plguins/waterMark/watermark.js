import { pxToRemMixin } from '../../../../../playground/src/pxToRem'

const randomId = () => {
  let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let maxPos = $chars.length
  let id = ''
  for (let i = 0; i < 16; i++) {
    id += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return id
}

class waterMark {
  constructor(context = {}) {
    this.CONTAINERID = randomId()
    this.wmId = context.id
    this.drawCanvas = this.drawCanvas.bind(this)
    this.parentObserver = this.parentObserver.bind(this)
    this.Repaint = this.Repaint.bind(this)
    this.isOberserve = false
    this.init(context)
    this.drawCanvas()
    this.parentObserver()
  }

  init(context) {
    let watermarkText = ''
    let watermarkContentType =
      context.watermarkContentType ||
      window.$videoStoreData.watermark.watermarkContentType
    const userinfo = window.$videoStoreData.userInfo
    if (watermarkContentType === '1') {
      watermarkText = userinfo.tenantInfo.tenantName
    }
    if (watermarkContentType === '2') {
      watermarkText = userinfo.tenantId
    }
    if (watermarkContentType === '3') {
      watermarkText = userinfo.userName
    }
    if (watermarkContentType === '4') {
      watermarkText = userinfo.nickName
    }
    let watermarkDensity =
      context.watermarkDensity ||
      window.$videoStoreData.watermark.watermarkDensity
    let _width = 60
    let _height = 50
    if (watermarkDensity === '1') {
      _width = 80
      _height = 70
    }
    if (watermarkDensity === '3') {
      _width = 40
      _height = 30
    }
    let watermarkFontSize = context.watermarkFontSize
      ? context.watermarkFontSize + 'px'
      : window.$videoStoreData.watermark.watermarkFontSize + 'px'
    let watermarkTransparency = context.watermarkTransparency
      ? parseInt(context.watermarkTransparency) / 100
      : parseInt(window.$videoStoreData.watermark.watermarkTransparency) / 100
    this.contextion = Object.assign(
      {
        id: context.id,
        _width: _width,
        _height: _height,
        text: context.watermarkText || watermarkText,
        fontSize: watermarkFontSize,
        fontStyle: 'PingFangSC, PingFang SC',
        textAlign: 'center',
        color: `rgba(255,255,255,${watermarkTransparency})`,
        degree: 0
      },
      context
    )
    console.log(this.contextion, 'this.contextion')
  }

  drawCanvas() {
    this.isOberserve = true
    let divContainer = document.createElement('div')
    divContainer.id = this.CONTAINERID
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    const dpr =
      window.devicePixelRatio ||
      window.webkitDevicePixelRatio ||
      window.mozDevicePixelRatio ||
      1
    context.font = `normal ${this.contextion.fontSize} ${this.contextion.fontStyle}`
    context.miterLimit = 1
    context.mozImageSmoothingEnabled = false // Firefox
    context.webkitImageSmoothingEnabled = false // Webkit (Chrome, Safari)
    context.msImageSmoothingEnabled = false // IE
    context.imageSmoothingEnabled = false // Standard
    let metrics = context.measureText(this.contextion.text)
    let textWidth = metrics.width
    let textHeight = Number(context.font.match(/\d+/)) // 实际高度可能需要根据具体字体和行高调整
    let clientWidth = textWidth + this.contextion._width * 2
    let clientHeight = textHeight + this.contextion._height * 2
    canvas.width = clientWidth
    canvas.height = clientHeight
    context.font = `normal ${this.contextion.fontSize} ${this.contextion.fontStyle}`
    context.textAlign = this.contextion.textAlign
    context.fillStyle = this.contextion.color
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((this.contextion.degree || 0 * Math.PI) / 180)
    context.fillText(this.contextion.text, 5, 5)

    let backgroundUrl = canvas.toDataURL('image/png')
    let flag = this.contextion.id
    let el = null
    if (flag) {
      el = document.getElementById(flag)
    }
    this.styleStr = `
  position:${document.getElementById(flag) ? 'absolute' : 'fixed'};
  top: 50%;
  left: 50%;
  width: 38.40rem;
  height: 21.60rem;
  aspect-ratio: 16 / 9;
  transform: translate(-50%, -50%) rotate(-30deg);
  transform-origin: 50% 50%;
  z-index:9998;
  pointer-events:none;
  background-repeat:repeat;
  background-image:url('${backgroundUrl}')`
    divContainer.setAttribute('style', this.styleStr)
    if (el) {
      el.appendChild(divContainer)
    }
    // else {
    //   document.body.appendChild(divContainer)
    // }
    this.wmObserver(divContainer)
    this.isOberserve = false
  }

  wmObserver(divContainer) {
    let wmConf = { attributes: true, childList: true, characterData: true }
    let wmObserver = new MutationObserver((mo) => {
      if (!this.isOberserve) {
        let _obj = mo[0].target
        _obj.setAttribute('style', this.styleStr)
        _obj.setAttribute('id', this.CONTAINERID)
        wmObserver.takeRecords()
      }
    })
    wmObserver.observe(divContainer, wmConf)
  }

  parentObserver() {
    let bodyObserver = new MutationObserver(() => {
      if (!this.isOberserve) {
        let __wm = document.querySelector(`#${this.CONTAINERID}`)
        if (!__wm) {
          this.drawCanvas()
        } else if (__wm.getAttribute('style') !== this.styleStr) {
          __wm.setAttribute('style', this.styleStr)
        }
      }
    })
    bodyObserver.observe(
      document.querySelector(`#${this.CONTAINERID}`).parentNode,
      { childList: true }
    )
  }

  Repaint(context = {}) {
    this.remove()
    this.init(context)
    this.drawCanvas()
  }

  remove(CONTAINERID) {
    this.isOberserve = true
    let _wm = document.getElementById(`${CONTAINERID}`)
    if (_wm) {
      _wm.parentNode.removeChild(_wm)
    }
  }
}

export default waterMark
