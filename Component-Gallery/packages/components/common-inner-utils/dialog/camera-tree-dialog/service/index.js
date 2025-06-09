import { $v } from '../../../funCommon/common'
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

// 替换为通用接口 已验证
export function queryDeviceForWE(params) {
  return request({
    url: '/device/video/device/queryDeviceForWE',
    method: 'post',
    data: params
  })
}

// 替换为通用接口 已验证
export function getDeviceImage(params) {
  return request({
    url: 'device/video/device/getDeviceImage',
    method: 'post',
    data: params
  })
}
// 锚点列表
export function getCameraList(params) {
  return request({
    url: '/device/video/device/queryDevices',
    method: 'post',
    data: params
  })
}
// 收藏取消收藏
export function addOrCancelCollections(params) {
  return request({
    url: '/device/industry/device/addOrCancelCollections',
    method: 'post',
    data: params
  })
}
// 码值获取接口
export function getDictType(params) {
  return request({
    url: `/admin/base/system/dict/data/dictDataType/${params}`,
    method: 'get',
    params: { uuid: new Date().getTime() }
  })
}

// 锚点列表疫木
export function getVideoListForWoodProcessingPlant(params) {
  return request({
    url: '/video-forestry-baseservice/woodProcessingPlant/getVideoListForWoodProcessingPlant',
    method: 'post',
    data: params
  })
}
