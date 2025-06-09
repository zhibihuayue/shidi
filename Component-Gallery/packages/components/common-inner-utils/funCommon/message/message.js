/**
 * @Description  : 工具箱封装message的样式以及使用（使用方式与el-message类似）
 * @Version      : V0.0.1
 * @Author       : wanghc
 * @Date         : 2024/1/16
 * @LastEditors  : 10564
 * @LastEditTime : 2024-01-12 21:12:31
 * @FilePath     : message.js
 * Copyright 2024 10564, All Rights Reserved.
 * 2024-01-12 21:12:31
 */
// import { Message } from 'element-ui'
// import './newMessage.scss'
import CommonMessage from './common-message'
// 定义message的当前数量
// let messageList = []
// // 定义初始最大数量
// let messageMaxCount = 10

const newMessage = function (options) {
  // if (messageMaxCount && messageList.length >= messageMaxCount) {
  //   //更新弹框
  //   messageList[0].close()
  // }
  if (isObject(options)) {
    const {
      type = 'success',
      showClose = true,
      duration = 3000,
      offset = 30,
      ...rest
    } = options
    CommonMessage[type](rest.message)
    // messageList.push(
    //   showMessage({
    //     type,
    //     showClose,
    //     duration,
    //     offset,
    //     customClass: 'newMessageClass',
    //     ...rest
    //   })
    // )
    return
  }
  CommonMessage[options.type || 'auto'](options.message)

  // messageList.push(
  //   showMessage({
  //     type: options.type || 'info',
  //     showClose: options.showClose || true,
  //     duration: options.duration || 3000,
  //     offset: options.offset || 30,
  //     customClass: 'newMessageClass',
  //     message: options
  //   })
  // )
}

;['success', 'error', 'info', 'warning'].forEach((type) => {
  newMessage[type] = function (options) {
    if (isObject(options)) {
      const {
        duration = 3000,
        showClose = true,
        offset = 30,
        customClass = 'newMessageClass',
        ...rest
      } = options
      CommonMessage[type](rest.message)
      // newMessage({
      //   type: type,
      //   duration,
      //   showClose,
      //   offset,
      //   customClass,
      //   ...rest
      // })
      return
    }
    console.warn(options)
    CommonMessage[type || 'auto'](options)

    // newMessage({
    //   type,
    //   duration: options.duration || 3000,
    //   showClose: options.showClose || true,
    //   message: options,
    //   offset: options.offset || 30,
    //   customClass: 'newMessageClass'
    // })
  }
})

// newMessage.config = function (options) {
//   const { maxCount } = options
//   if (maxCount) {
//     if (typeof maxCount !== 'number') {
//       return console.error('参数类型错误:maxCount应为number类型')
//     }
//     messageMaxCount = maxCount
//   }
// }

function isObject(content) {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!content.message
  )
}

// function showMessage(options) {
//   const { onClose: close, ...rest } = options
//   return Message({
//     ...rest,
//     customClass: 'newMessageClass',
//     //关闭时，除了传入的close方法，还需要将对应的实例删除
//     onClose: (val) => {
//       if (close) {
//         close()
//       }
//       messageList = messageList.filter((item) => item.id != val.id)
//     }
//   })
// }

export default newMessage
