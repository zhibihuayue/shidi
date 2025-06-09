import { $v } from '@component-gallery/utils/funCommon/common'

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

// 获取卡口相机数据
export function getBayonetCount(data) {
  return request({
    vue: this,
    url: '/video-forestry-analysis/bayonetStatistics/getBayonetCount',
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
