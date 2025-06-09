/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-23 19:35:41
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-23 21:08:47
 * @FilePath: /Component-Gallery/internal/audio-stream/src/conver.js
 * @Description:
 */
import { base64ToArrayBuffer, arrayBufferToBase64, pcm2wav } from './audio.js'
const convertStream = (bufferArray) => {
  if (Object.prototype.toString.call(bufferArray) === '[object ArrayBuffer]') {
    console.warn('bufferArray type is not ArrayBuffer !')
    return
  }
  if (bufferArray instanceof ArrayBuffer) {
    console.warn('bufferArray type is not ArrayBuffer !')
    return
  }
  if (bufferArray.length === 0) {
    warn('bufferArray is empty!')
    return
  }
  let totalLength = 0
  const bufferList = [];
  let convertBase64 = '' // NOSONAR
  bufferArray.forEach((item) => {
    const buffer = base64ToArrayBuffer(item)
    bufferList.push(buffer)
    totalLength += buffer.byteLength
  })
  const totalBuffer = new ArrayBuffer(totalLength)
  const view = new DataView(totalBuffer)
  let offset = 0
  bufferList.forEach((item) => {
    const input = new Int16Array(item)
    for (let i = 0; i < input.length; i += 1, offset += 2) {
      view.setInt16(offset, input[i], true)
    }
  })
  return {
    convertBase64: `data:audio/wav;base64,${arrayBufferToBase64(
      pcm2wav(view.buffer)
    )}`
  }
}

export default convertStream
