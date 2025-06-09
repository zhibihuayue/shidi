// import { Message } from 'element-ui'
// import $ from 'jquery'
import CommonMessage from './common-message'

class VideoMessage {
  static s = this.success
  static w = this.warning
  static e = this.error
  static a = this.auto
  static fullScreenId = undefined
  static messages = {}

  static success(message) {
    CommonMessage.show('success', message)
  }

  static warning(message) {
    CommonMessage.show('warning', message)
  }

  static error(message) {
    CommonMessage.show('error', message)
  }

  static auto(message) {
    CommonMessage.auto(message)
    // const { code } = message
    // let type
    // if (code === 200) {
    //   type = 'success'
    // } else if (code === 2001) {
    //   type = 'warning'
    // } else {
    //   type = 'error'
    // }
    // this.show(type, message)
  }
  //
  // static show(type, message) {
  //   message = message || String(message) || 'undefined'
  //   const only = this.getUUID()
  //   const params = {
  //     type,
  //     duration: 5000,
  //     offset: 30,
  //     showClose: true,
  //     customClass: 'video-message ' + only
  //   }
  //   let { msg = message, time } = message
  //   try {
  //     msg = JSON.parse(msg) || msg
  //   } catch (e) {
  //     //console.log(e);
  //   }
  //   let { resultCode, resultMsg = msg } = msg
  //
  //   if (String(resultMsg).includes('[success]')) {
  //     resultMsg = resultMsg.replace('[success]', '')
  //     params.type = type = 'success'
  //   }
  //   if (String(resultMsg).includes('[warning]')) {
  //     resultMsg = resultMsg.replace('[warning]', '')
  //     params.type = type = 'warning'
  //   }
  //   if (String(resultMsg).includes('[error]')) {
  //     resultMsg = resultMsg.replace('[error]', '')
  //     params.type = type = 'error'
  //   }
  //   params.message = resultMsg
  //   params.customClass += ' video-message-' + type
  //   if (resultCode !== undefined) {
  //     const labels = {
  //       success: '成功码',
  //       warning: '提示码',
  //       error: '错误码'
  //     }
  //
  //     let moreMessage = ''
  //     moreMessage +=
  //       '<span class="more-til" onclick="lookMessageDetail(\'' +
  //       only +
  //       '\')">显示详情</span>'
  //     moreMessage += '<div class="more-detail">'
  //     moreMessage +=
  //       '  <div class="more-left">' +
  //       labels[type] +
  //       '：' +
  //       resultCode +
  //       '</div>'
  //     moreMessage +=
  //       '  <div class="more-right">请求时间：' +
  //       this.formatTime(time) +
  //       '</div>'
  //     moreMessage += '</div>'
  //
  //     params.customClass += ' message-more-new'
  //     params.dangerouslyUseHTMLString = true
  //     params.message += moreMessage
  //   }
  //   setTimeout(() => {
  //     Message(params)
  //     this.messageFull(only)
  //   })
  // }
  //
  // static messageFull(only) {
  //   const _this = this
  //   if (window.fullScreenId) {
  //     const $dom = $('#' + window.fullScreenId)
  //     if (_this.fullScreenId !== window.fullScreenId) {
  //       $('body div .video-message').remove()
  //     }
  //     _this.fullScreenId = window.fullScreenId
  //     window.onresize = function () {
  //       if (_this.fullScreenId !== window.fullScreenId) {
  //         $('body div .video-message').remove()
  //       }
  //     }
  //     const $before = $('.' + only)
  //     const ts = $before[0].outerHTML
  //     $before.remove()
  //     $dom.append(ts)
  //     $dom
  //       .find('.' + only)
  //       .css({
  //         display: 'block',
  //         opacity: 0,
  //         transform: 'translate(-50%, -100%)'
  //       })
  //       .attr('only', only)
  //       .hover(
  //         function () {
  //           clearTimeout(_this.messages[$(this).attr('only')])
  //         },
  //         function () {
  //           _this.messages[$(this).attr('only')] = setTimeout(() => {
  //             $(this).remove()
  //             delete _this.messages[$(this).attr('only')]
  //             _this.messageFullFit(true)
  //           }, 5000)
  //         }
  //       )
  //     _this.messageFullFit()
  //     $dom.find('.' + only + ' .el-message__closeBtn').click(function () {
  //       $dom.find('.' + only).remove()
  //       _this.messageFullFit(true)
  //     })
  //     $dom.find('.' + only + ' .more-til').click(function () {
  //       window.lookMessageDetail(only)
  //     })
  //   }
  // }
  //
  // static messageFullFit(remove) {
  //   const _this = this
  //   const $dom = $('#' + window.fullScreenId)
  //   let top = 0
  //   $dom.find('.el-message').each(function () {
  //     top += 20
  //     const h = $(this).outerHeight()
  //     $(this).css({
  //       top,
  //       transition: remove
  //         ? 'transform 0.2s, opacity 0.2s, top 0.2s'
  //         : 'transform 0.2s, opacity 0.2s'
  //     })
  //     top += h
  //     _this.messageFullFitShow($(this))
  //   })
  // }
  //
  // static messageFullFitShow($v) {
  //   $v.css({
  //     opacity: 1,
  //     transform: 'translate(-50%, 0)'
  //   })
  //   this.messages[$v.attr('only')] = setTimeout(() => {
  //     $v.remove()
  //     delete this.messages[$v.attr('only')]
  //     this.messageFullFit(true)
  //   }, 5000)
  // }
  //
  // static formatTime(time) {
  //   const date = new Date(time || new Date())
  //   const yyyy = date.getFullYear()
  //   const MM = ('0' + (date.getMonth() + 1)).substr(-2)
  //   const dd = ('0' + date.getDate()).substr(-2)
  //   const hh = ('0' + date.getHours()).substr(-2)
  //   const mm = ('0' + date.getMinutes()).substr(-2)
  //   const ss = ('0' + date.getSeconds()).substr(-2)
  //   return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
  // }
  //
  // static getUUID() {
  //   const crypto = window.crypto || window.msCrypto
  //   const array = new Uint32Array(1)
  //   const r = crypto.getRandomValues(array)[0]
  //   return Date.now() + '333' + r
  // }
}

// window.lookMessageDetail = (id) => {
//   const $doms = $('.video-message')
//   const $item = $('.video-message.' + id)
//   const oldH = $item.outerHeight()
//   $item.removeClass('message-more-new').addClass('message-more-new-open')
//   const newH = $item.outerHeight()
//   const countH = newH - oldH
//   let move = false
//   $doms.each(function () {
//     if (move) {
//       const oldT = $(this).css('top')
//       $(this).css({
//         top: parseFloat(oldT) + countH
//       })
//     }
//     if ($(this).hasClass(id)) {
//       move = true
//     }
//   })
// }
export default VideoMessage
