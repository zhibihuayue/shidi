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

// 获取古树名木信息
export function queryDetailById(params) {
  return request({
    url: '/video-forestry-emengercy/ancientTreeGroup/detail',
    method: 'get',
    data: params
  })
}
// 根据经纬度获取古树群id列表
export function getListByCoordinate(params) {
  return request({
    url: '/video-forestry-emengercy/ancientTreeGroup/getListByCoordinate',
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
export function getMultipleDicts(dictType) {
  return request({
    url: urlBaseService + '/dict/dictDataType/' + dictType,
    method: 'get'
  })
}
