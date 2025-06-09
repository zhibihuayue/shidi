import { $v } from '../../funCommon/common.js'

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

// 物联设备列表
export function queryIotDeviceBySite(data) {
  // 接口改造，新增了queryType参数，写死为4
  data.queryType = 4
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceListBySiteCode',
    method: 'post',
    data
  })
}

// 获取物联设备详情
export function queryIotDeviceInfo(data) {
  return request({
    url: '/device/iotdevice/queryIotDeviceInfo',
    method: 'post',
    data
  })
}

// 获取雷达详情
export function queryRadarDeviceInfo(data) {
  return request({
    url: '/device/radar/queryRadarDeviceInfo',
    method: 'post',
    data
  })
}

//获取喇叭详情
export function queryHornDeviceDetail(data) {
  // 接口改造，新增了queryType参数，写死为5
  data.queryType = 5
  return request({
    data,
    url: '/device/deviceCommon/getDeviceInfo',
    method: 'post'
  })
}

// 设备收藏
export function addOrCancelCollections(data) {
  return request({
    vue: this,
    url: '/device/industry/device/addOrCancelCollections',
    method: 'post',
    data
  })
}

// 查询雷达信息
export function queryRadarDeviceBySite(data) {
  // 接口改造，新增了queryType参数，写死为3
  data.queryType = 3
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceListBySiteCode',
    method: 'post',
    data
  })
}

// 查看大喇叭信息
export function queryHornForSite(data) {
  // 接口改造，新增了queryType参数，写死为5
  data.queryType = 5
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceListBySiteCode',
    method: 'post',
    data
  })
}

// 查询资源详情
export function getResourceInfo(resourceId) {
  return request({
    vue: this,
    url: `/bdm/resource/getResourceInfo?resourceId=${resourceId}`,
    method: 'get'
  })
}

//网格员详情
export function gridKeeper(id) {
  return request({
    url: `/bdm/gridKeeper/findOne?keeperId=${id}`,
    method: 'get'
  })
}
//网格员详情
export function gridKeeperListByPosition(data) {
  return request({
    vue: this,
    url: `/bdm/gridKeeper/getKeeperListByLonLat`,
    method: 'post',
    data
  })
}

// 收藏/取消收藏
export function addResourceOrCancelCollections(data) {
  return request({
    vue: this,
    url: '/admin/common/addOrCancelCollections',
    method: 'post',
    data
  })
}

export function getGridNameByGridId(data) {
  return request({
    vue: this,
    url: '/bdm/grid/getGridNameByGridId',
    method: 'post',
    data
  })
}
// 获取详情
export function getDeviceInfo(data) {
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceInfo',
    method: 'post',
    data
  })
}
// 查询信息
export function getDeviceListBySiteCode(data) {
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceListBySiteCode',
    method: 'post',
    data
  })
}
