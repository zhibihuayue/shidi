import { $v, urlBis } from '../../funCommon/common'
import requestGuoTu from './gtRequest/request'
export const request = ({ vue, url, method, data, loadParam }) => {
  return new Promise((resolve, reject) => {
    $v[method](
      vue,
      `${url}`,
      data,
      (resp) => {
        if (resp.code === 200) {
          resolve(resp)
        } else {
          reject(resp)
        }
      },
      (e) => {
        reject(e)
      },
      {
        loading: false,
        ...loadParam
      }
    )
  })
}

// 疫木收藏接口
export function getPlagueWoodFavorite(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/common/addOrCancelCollections',
    method: 'post',
    data
  })
}

// 疫木详情接口
export function getPlagueWoodDetail(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/epidemicWood/getEpidemicWoodInfo',
    method: 'post',
    data
  })
}

// 疫木列表获取接口
export function getPlagueWoodList(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/epidemicWood/queryEpidemicWoodLayer',
    method: 'post',
    data
  })
}

// 获取用户记忆
export function getUserMemoryInfo(data) {
  return request({
    vue: this,
    url: '/video-video/video/getUserMemoryInfo',
    method: 'post',
    data
  })
}

// 更新用户记忆
export function uptUserMemoryInfo(data) {
  return request({
    vue: this,
    url: '/video-video/video/uptUserMemoryInfo',
    method: 'post',
    data
  })
}

// 查询列表
export function forestryGetVideoTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/videoTree/getVideoTree',
    method: 'post',
    data
  })
}
//点击摄像机锚点弹出列表
export function getCameraList(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/video/getVideoList',
    method: 'post',
    data
  })
}
// 摄像机详情
export function forestryQueryDeviceForWE(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/video/queryDeviceForWE',
    method: 'post',
    data
  })
}
// 摄像机图片
export function getDeviceImage(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/video/device/getDeviceImage',
    method: 'post',
    data
  })
}

// 收藏/取消收藏 摄像机
export function updatemonitorCollect(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/videoTree/addDeviceToFavorites',
    method: 'post',
    data
  })
}
export function getDeviceVisibleBySite(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/video/device/getDeviceVisibleBySite',
    method: 'post',
    data
  })
}
// 物联设备列表区域
export function getIotMonitorTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/iotDevice/getIotMonitorTree',
    method: 'post',
    data
  })
}
// 物联设备列表组织
export function getIotMonitorOrgTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/iotDevice/getIotMonitorOrgTree',
    method: 'post',
    data
  })
}
// 物联设备-无人机-大喇叭-雷达 收藏/取消收藏
export function iotUavRadarHornAddDeviceToFavorites(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/addDeviceToFavorites',
    method: 'post',
    data
  })
}
// 诱捕器 收藏/取消收藏
export function trapUpdateCollect(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/trap/updateCollect',
    method: 'post',
    data
  })
}

// 物联设备检测因子
export function getSensorData(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/iotDevice/getSensorData',
    method: 'post',
    data
  })
}
// 物联设备检测因子 折线图
export function getSensorPeriodData(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/iotDevice/getSensorPeriodData',
    method: 'post',
    data
  })
}

// 物联设备详情
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
// 雷达机构树
export function getRadarMonitorOrgTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/iotDevice/getRadarMonitorOrgTree',
    method: 'post',
    data
  })
}
// 雷达区域树
export function getRadarMonitorTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/iotDevice/getRadarMonitorTree',
    method: 'post',
    data
  })
}
// 无人机列表
export function forestryGetUavHornTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/getUavHornTree',
    method: 'post',
    data
  })
}
// 无人机详情
export function forestryQryUavDeviceInfo(data) {
  // 接口改造，新增了queryType参数，无人机类型写死为1
  data.queryType = 1
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceInfo',
    method: 'post',
    data
  })
}
// 无人机点位列表
export function getUavDevicesBySiteCode(data) {
  // 接口改造，新增了queryType参数，无人机类型写死为1
  data.queryType = 1
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceListBySiteCode',
    method: 'post',
    data
  })
}
// 根据SiteCode查询执法记录仪列表
export function getRecorderDevicesBySiteCode(data) {
  return request({
    vue: this,
    url: '/device/recorder/device/getRecorderDevicesBySiteCode',
    method: 'post',
    data
  })
}
// 获取执法记录仪详情
export function qryRecorderDeviceInfo(data) {
  data.queryType = '2'
  return request({
    vue: this,
    url: '/device/deviceCommon/getDeviceInfo',
    method: 'post',
    data
  })
}
// 大喇叭列表
export function getUavHornTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/getUavHornTree',
    method: 'post',
    data
  })
}

// 大喇叭点位列表
export function queryHornListForSite(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/queryHornForSite',
    method: 'post',
    data
  })
}
// 大喇叭详情
export function queryHornDeviceDetail(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/queryHornDeviceDetail',
    method: 'post',
    data
  })
}
// 无人机喊话
export function startTalk(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/startTalk',
    method: 'post',
    data
  })
}
export function stopTalk(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/stopTalk',
    method: 'post',
    data
  })
}
// 网格树列表
export function forestryGetGridTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/getGridTree',
    method: 'post',
    data
  })
}
// 查询网格详情
export function queryFindGridInfo(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/findGridInfo',
    method: 'post',
    data
  })
}
// 网格员
export function forestryGetGridKeeperTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/getGridKeeperTree',
    method: 'post',
    data
  })
}
// 网格员轨迹
export function forestryGetKeeperTrail(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/getKeeperTrail',
    method: 'post',
    data
  })
}
//网格员详情弹窗
export function gridKeeper_byid(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/findOneNoEncryptionSdk',
    method: 'post',
    data
  })
}
// 查询网格详情
export function queryFindGridKeeperInfo(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/findGridKeeperInfo',
    method: 'post',
    data
  })
}
// 资源
export function forestryGetResourceTree(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/resources/getResourceTree',
    method: 'post',
    data
  })
}
// 选中资源
export function querySelectResource(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/resources/selectResource',
    method: 'post',
    data
  })
}
// 查询资源详情
export function getResourceInfo(resourceId) {
  return request({
    vue: this,
    url: `/video-forestry-baseservice/resources/getResourceInfo?resourceId=${resourceId}`,
    method: 'get'
  })
}
export function getResourceInfo_byResourceId(resourceId) {
  return request({
    vue: this,
    url: `/video-forestry-baseservice/resources/getResourceInfo?resourceId=${resourceId}`,
    method: 'get'
  })
}
///诱捕器详情/video-forestry-emengercy/trap/queryTrapInfo
export function getTrapInfoById(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/trap/queryTrapInfo',
    method: 'post',
    data
  })
}
///诱捕器点位列表
export function getTrapListByLatLon(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/trap/listByLatLon',
    method: 'post',
    data
  })
}
//诱捕记录点位列表
export function getRecordListofTrapByLatLon(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/trapGather/queryTrapGatherLayer',
    method: 'post',
    data
  })
}
//诱捕记录点位详情
export function queryTrapGatherInfoById(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/trapGather/queryTrapGatherInfo',
    method: 'post',
    data
  })
}

// /forestry-baseservice/resources/getResourceInfo

// 国土摄像机列表
export function gtGetMonitorTree(data) {
  return requestGuoTu({
    vue: this,
    url: '/device/video/getMonitorTree',
    method: 'post',
    data
  })
}
export function gtGetMonitorOrgTree(data) {
  data.queryType = '2'
  return requestGuoTu({
    vue: this,
    url: '/device/video/getMonitorTree',
    method: 'post',
    data
  })
}
export function gtGetMonitorLabelTreeNew(data) {
  data.queryType = '4'
  return requestGuoTu({
    vue: this,
    url: '/device/video/getMonitorTree',
    method: 'post',
    data
  })
}
// 获取字典：摄像机类型
export function getCameraTtypeData() {
  return requestGuoTu({
    url: `/system/dictDataType/ar_screen_category_code`,
    method: 'get'
  })
}
// 获取摄像机详情
export function gtQueryDevicesForWE(data) {
  return requestGuoTu({
    vue: this,
    url: '/device/industry/device/queryDevicesForWE',
    method: 'post',
    data
  })
}
// 获取无人机轨迹
export function qryUavDeviceTrackList(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/uavHorn/qryUavDeviceTrackList',
    method: 'post',
    data
  })
}
// 获取王歌源轨迹
export function getKeeperTrail(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/grid/getKeeperTrail',
    method: 'post',
    data
  })
}
// 获取古树名木列表
export function getTreesList(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/ancientTreeScreen/getListByCoordinate',
    method: 'post',
    data
  })
}
// 获取古树详情
export function getAncientTreeDetails(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/ancient/queryById',
    method: 'get',
    data
  })
}
// 获取名木详情
export function getPreciousTreeDetails(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/precious/queryById',
    method: 'get',
    data
  })
}
// 古木名树收藏接口
export function getAncientTreeScreenCollect(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/ancientTreeScreen/collect',
    method: 'post',
    data
  })
}
// 获取物种详情
export function querySpeciesDetailsBySpeciesManagement(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/species/querySpeciesDetailsBySpeciesManagement',
    method: 'post',
    data
  })
}
// 获取野保相机详情
export function queryCameraDeviceInfo(data) {
  return request({
    vue: this,
    url: '/video-forestry-emengercy/camera/queryCameraDeviceInfo',
    method: 'post',
    data
  })
}
// 获取火险等级弹窗的信息
export function getFireLevelInfo(data) {
  return request({
    vue: this,
    url: '/video-forestry-baseservice/fire/dangerRatingDetail',
    method: 'post',
    data
  })
}
