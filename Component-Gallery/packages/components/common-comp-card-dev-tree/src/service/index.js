import { $v } from '@component-gallery/utils/funCommon/common'

export const request = ({ vue, url, method, data }) => {
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

// 共用请求方法
export function shareRequest(url, data) {
  return request({
    vue: this,
    url: url,
    method: 'post',
    data
  })
}

// 查询区域树
export function getVideoTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/videoTree/getVideoTree',
    method: 'post',
    data
  })
}

// 查询卡片列表
export function getCheckAlarmByDevice(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/alarm/checkpoint/getCheckAlarmByDevice',
    method: 'post',
    data
  })
}

// 获取摄像机详情
export function queryDeviceForWE(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/video/queryDeviceForWE',
    method: 'post',
    data
  })
}

// 获取用户记忆
export function getUserMemoryInfo(data) {
  return request({
    vue: this,
    url: `/video-video/video/getUserMemoryInfo?${new Date().getTime()}`,
    method: 'post',
    data
  })
}

// 设置用户记忆
export function uptUserMemoryInfo(data) {
  return request({
    vue: this,
    url: `/video-video/video/uptUserMemoryInfo?${new Date().getTime()}`,
    method: 'post',
    data
  })
}
