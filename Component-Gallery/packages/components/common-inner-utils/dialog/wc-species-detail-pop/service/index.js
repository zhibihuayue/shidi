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

//  野生动物点位信息（经纬度，物种id）
export function querySpeciesDetailsBySpeciesManagement(params) {
  return request({
    url: '/video-forestry-emengercy/species/querySpeciesDetailsBySpeciesManagement',
    method: 'post',
    data: params
  })
}

// 野生动物点位详情（
export function isHaveMoreSpecies(params) {
  return request({
    url: '/video-forestry-emengercy/species/isHaveMoreSpecies',
    method: 'post',
    data: params
  })
}
