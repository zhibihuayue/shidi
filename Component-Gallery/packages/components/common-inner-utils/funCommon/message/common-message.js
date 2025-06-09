import { Message } from 'element-ui'
import '@component-gallery/theme-chalk/src/common-message.scss'

class CommonMessage {
  static s = this.success
  static w = this.warning
  static e = this.error
  static a = this.auto
  static fullScreenId = undefined
  static messages = {}
  static messageList = []
  static success(message) {
    this.show('success', message)
  }

  static warning(message) {
    this.show('warning', message)
  }

  static error(message) {
    this.show('error', message)
  }

  static info(message) {
    this.show('info', message)
  }

  static auto(message) {
    const { code } = message
    let type
    if (code === 200) {
      type = 'success'
    } else if (code === 2001) {
      type = 'warning'
    } else {
      type = 'error'
    }
    this.show(type, message)
  }

  static show(type, message) {
    message = message || String(message) || 'undefined'
    const only = this.getUUID()
    const params = this.createParams(type, only)
    let { msg = message, time } = message
    try {
      msg = JSON.parse(msg) || msg
    } catch (e) {
      //console.log(e);
    }
    let { resultCode, resultMsg = msg } = msg
    params.type = type
    params.message = resultMsg
    params.customClass += ` common-message-${params.type}`
    if (resultCode !== undefined) {
      params.customClass += ' message-more'
      params.dangerouslyUseHTMLString = true
      params.message += this.createMoreMessage(
        params.type,
        resultCode,
        time,
        only
      )
    }
    setTimeout(() => {
      Message(params)
      this.messageFull(only)
    })
  }

  static createParams(type, only) {
    return {
      type,
      duration: 5000,
      offset: 30,
      showClose: true,
      customClass: `common-message ${only}`
    }
  }
  static createMoreMessage(type, resultCode, time, only) {
    const labels = {
      success: '成功码',
      info: '提示码',
      warning: '告警码',
      error: '错误码'
    }
    return `
    <span class="more-til" onclick="showCommonMessageDetail('${only}')">显示详情</span>
    <div class="more-detail">
      <div class="more-left">${labels[type]}：${resultCode}</div>
      <div class="more-right">${this.formatTime(time)}</div>
    </div>
  `
  }

  static messageFull(only) {
    if (window.fullScreenId) {
      const dom = document.getElementById(window.fullScreenId)
      if (this.fullScreenId !== window.fullScreenId) {
        const messages = document.querySelectorAll('body div .common-message')
        messages.forEach((message) => message.remove())
      }
      this.fullScreenId = window.fullScreenId
      window.onresize = () => {
        if (this.fullScreenId !== window.fullScreenId) {
          const messages = document.querySelectorAll('body div .common-message')
          messages.forEach((message) => message.remove())
        }
      }
      const before = document.querySelector(`.${only}`)
      const ts = before.outerHTML
      before.remove()
      dom.insertAdjacentHTML('beforeend', ts)
      const message = dom.querySelector(`.${only}`)
      message.style.display = 'block'
      message.style.opacity = 0
      message.style.transform = 'translate(-50%, -100%)'
      message.setAttribute('only', only)
      message.addEventListener('mouseenter', () => {
        clearTimeout(this.messages[message.getAttribute('only')])
      })
      message.addEventListener('mouseleave', () => {
        this.messages[message.getAttribute('only')] = setTimeout(() => {
          message.remove()
          delete this.messages[message.getAttribute('only')]
          this.messageFullFit(true)
        }, 5000)
      })
      this.messageFullFit()
      const closeButton = dom.querySelector(`.${only} .el-message__closeBtn`)
      closeButton.addEventListener('click', () => {
        message.remove()
        this.messageFullFit(true)
      })
      const moreTil = dom.querySelector(`.${only} .more-til`)
      moreTil.addEventListener('click', () => {
        window.showCommonMessageDetail(only)
      })
    }
  }

  static messageFullFit(remove) {
    const dom = document.getElementById(window.fullScreenId)
    let top = 0
    const messages = dom.querySelectorAll('.el-message')
    messages.forEach((message) => {
      top += 20
      const h = message.offsetHeight
      message.style.top = `${top}px`
      message.style.transition = remove
        ? 'transform 0.2s, opacity 0.2s, top 0.2s'
        : 'transform 0.2s, opacity 0.2s'
      top += h
      this.messageFullFitShow(message)
    })
  }

  static messageFullFitShow(message) {
    message.style.opacity = 1
    message.style.transform = 'translate(-50%, 0)'
    const only = message.getAttribute('only')
    this.messages[only] = setTimeout(() => {
      message.remove()
      delete this.messages[only]
      this.messageFullFit(true)
    }, 5000)
  }

  static formatTime(time) {
    const date = new Date(time || new Date())
    const yyyy = date.getFullYear()
    const MM = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')
    const hh = date.getHours().toString().padStart(2, '0')
    const mm = date.getMinutes().toString().padStart(2, '0')
    const ss = date.getSeconds().toString().padStart(2, '0')
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
  }

  static getUUID() {
    const crypto = window.crypto || window.msCrypto
    const array = new Uint32Array(1)
    const r = crypto.getRandomValues(array)[0]
    return Date.now() + '333' + r
  }
}

window.showCommonMessageDetail = (id) => {
  const doms = document.querySelectorAll('.common-message')
  const item = document.getElementsByClassName(`common-message ${id}`)[0]
  const oldH = item.offsetHeight
  item.classList.remove('message-more')
  item.classList.add('message-more-open')
  const newH = item.offsetHeight
  const countH = newH - oldH
  let move = false
  doms.forEach((dom) => {
    if (move) {
      const oldT = parseFloat(
        window.getComputedStyle(dom).getPropertyValue('top')
      )
      dom.style.top = `${oldT + countH}px`
    }
    if (dom.classList.contains(id)) {
      move = true
    }
  })
}
export default CommonMessage
