import { $v, urlBaseService } from '../../../funCommon/common'
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

/**
 * 获取古树名木信息
 * type: 0 古树  1 名木
 */
export function queryById(params, type) {
  const module = type === '0' ? 'ancient' : 'precious'
  return request({
    url: `/video-forestry-emengercy/${module}/queryById`,
    method: 'get',
    data: params
  })
}
// 根据经纬度获取古树名木id列表
export function getListByCoordinate(params) {
  return request({
    url: '/video-forestry-emengercy/ancientTreeScreen/getListByCoordinate',
    method: 'post',
    data: params
  })
}
// 收藏/取消收藏
export function collect(params) {
  return request({
    url: '/video-forestry-emengercy/ancientTreeScreen/collect',
    method: 'post',
    data: params
  })
}

// 查询字典值
export function getMultipleDicts(dictType) {
  return request({
    url: urlBaseService + '/dict/dictDataType/' + dictType,
    method: 'get'
  })
}
