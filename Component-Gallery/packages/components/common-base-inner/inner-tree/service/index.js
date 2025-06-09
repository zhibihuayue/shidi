import { request } from '@component-gallery/utils/request/API/index'

export function appVerCode() {
  const userInfo = JSON.parse(localStorage.getItem('$loginInfo'))
  return userInfo?.chooseAppVerCode
}

/**
 * 获取树数据 - 摄像机
 * @param {*} data
 * @returns
 */
export function getTreeData(data) {
  data.appVerCode = appVerCode()
  return request({
    url: '/device/video/getMonitorTree',
    method: 'post',
    data
  })
}
// 收藏/取消收藏 摄像机
export function addOrCancelCollections(data) {
  return request({
    vue: this,
    url: '/device/industry/device/addOrCancelCollections',
    method: 'post',
    data
  })
}
// 摄像机详情
export function queryDeviceForWE(data) {
  return request({
    vue: this,
    url: '/device/video/device/queryDeviceForWE',
    method: 'post',
    data
  })
}
