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
export function queryTrapGatherInfo(params) {
  return request({
    url: '/video-forestry-emengercy/trapGather/queryTrapGatherInfo',
    method: 'post',
    data: params
  })
}
// 查询站址列表接口
export function queryTrapGatherLayer(params) {
  return request({
    url: '/video-forestry-emengercy/trapGather/queryTrapGatherLayer',
    method: 'post',
    data: params
  })
}
