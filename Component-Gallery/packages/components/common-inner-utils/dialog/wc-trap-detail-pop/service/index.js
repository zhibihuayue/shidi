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

// 查询诱捕器详情
export function queryTrapInfo(params) {
  return request({
    url: '/video-forestry-emengercy/trap/queryTrapInfo',
    method: 'post',
    data: params
  })
}
export function listByLatLon(params) {
  return request({
    url: 'video-forestry-emengercy/trap/listByLatLon',
    method: 'post',
    data: params
  })
}
// 收藏/取消收藏接口
export function updateCollect(params) {
  return request({
    url: '/video-forestry-emengercy/trap/updateCollect',
    method: 'post',
    data: params
  })
}
