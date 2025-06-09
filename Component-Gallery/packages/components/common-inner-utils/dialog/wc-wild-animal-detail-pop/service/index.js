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
export function queryCameraDeviceInfo(params) {
  return request({
    url: 'video-forestry-emengercy/camera/queryCameraDeviceInfo',
    method: 'post',
    data: params
  })
}
export function addOrCancelCollections(params) {
  return request({
    url: 'video-forestry-emengercy/collection/addOrCancelCollections',
    method: 'post',
    data: params
  })
}

// 物种图集信息
export function queryCameraStatistics(params) {
  return request({
    url: 'video-forestry-emengercy/camera/queryCameraStatistics',
    method: 'post',
    data: params
  })
}
// 摄像机信息
export function getCameraDetail(params) {
  return request({
    url: 'video-forestry-emengercy/camera/getCameraDetail',
    method: 'post',
    data: params
  })
}
// 图集列表
export function querySpeciesAtlasPage(params) {
  return request({
    url: 'video-forestry-emengercy/camera/querySpeciesAtlasPage',
    method: 'post',
    data: params
  })
}

// 获取用户记忆
export function getUserMemoryInfo(params) {
  return request({
    url: 'video-forestry-biss/video/getUserMemoryInfo',
    method: 'post',
    data: params
  })
}

/**
 * 更新用户记忆
 */
export function uptUserMemoryInfo(params) {
  return request({
    url: 'video-forestry-biss/video/uptUserMemoryInfo',
    method: 'post',
    data: params
  })
}
// 野保相机点位信息
export function queryCameraListByPoint(params) {
  return request({
    url: 'video-forestry-emengercy/camera/queryCameraListByPoint',
    method: 'post',
    data: params
  })
}
