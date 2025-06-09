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
// 获取野保卡片视图信息 ok
export function queryCameraCardViewInfos(params) {
  // 发送请求，查询摄像头卡片视图信息
  return request({
    url: '/video-forestry-emengercy/birds/queryDeviceCardViewInfos',
    method: 'post',
    data: params
  })
}
// 获取野保卡片视图信息 ok
export function getCameraMonitorAreaTree(params) {
  // 发送请求，获取摄像头监控区域树
  return request({
    url: '/video-forestry-emengercy/birds/getDeviceMonitorAreaTree',
    method: 'post',
    data: params
  })
}
// 获取鸟类声纹统计信息 ok
export function queryTodayCameraStatistics(params) {
  // 发送post请求，获取鸟类声纹统计信息
  return request({
    url: '/video-forestry-emengercy/birds/queryTodayDeviceStatistics',
    method: 'post',
    data: params
  })
}
// 获取鸟类声纹统计信息
// 导出一个函数，用于获取摄像头详情 ok
export function getCameraDetail(params) {
  // 发送请求，获取摄像头详情
  return request({
    url: '/video-forestry-emengercy/birds/getDeviceDetail',
    method: 'post',
    data: params
  })
}
// 导出一个函数addOrCancelCollections，用于添加或取消收藏 ok
export function addOrCancelCollections(params) {
  // 发送请求，请求地址为/video-forestry-emengercy/collection/addOrCancelCollections，请求方法为post，请求参数为params
  return request({
    url: '/video-forestry-emengercy/collection/addOrCancelCollections',
    method: 'post',
    data: params
  })
}
//记忆接口 ok
export function uptUserMemoryInfo(query) {
  // 发送请求，获取用户记忆信息
  return request({
    url: '/video-video/video/uptUserMemoryInfo',
    method: 'post',
    data: query
  })
}
//读取记忆接口 ok
export function getUserMemoryInfo(query) {
  // 发送请求，获取用户记忆信息
  return request({
    url: '/video-video/video/getUserMemoryInfo',
    method: 'post',
    data: query
  })
}
