import CommonMap from '../../mapCommon/mapTool/CommonMap'
import './alert.scss'
// import { cameraLocationAnalysisNew } from '../map-ol/CommonCtMapOl'
import { cameraLocationAnalysisNew } from '../../funCommon/mapUtils/cameraLocationAnalysisNew'
import createInfoWindow from '../../funCommon/mapUtils/createInfoWindow'
import removeInfoWindow from '../../funCommon/mapUtils/removeInfoWindow'
import { $v } from '../../funCommon/common.js'
import {
  deploymentSituationtwenty,
  deviceStatusequaltoZero,
  getCamerachannelListHTML,
  getCamerDetailLeftHtml,
  getCamerDetailRightHtml,
  getdeviceListelseHtml,
  getGridManMaek_Html,
  getGridManMaekIcon,
  getOldTreeDetailHtml,
  getOldTreeListWIndow,
  getResource_Html,
  getSmalClassWindowsHtml,
  getTrapHeadStatusHtml,
  getTrapRecoderHTml
} from './separateInfo.js'
import {
  forestryQryUavDeviceInfo,
  forestryQueryDeviceForWE,
  getAncientTreeDetails,
  getCameraList,
  getDeviceImage,
  getDeviceVisibleBySite,
  getPreciousTreeDetails,
  getRecordListofTrapByLatLon,
  getResourceInfo_byResourceId,
  getTrapInfoById,
  getTrapListByLatLon,
  getTreesList,
  getUavDevicesBySiteCode,
  gridKeeper_byid,
  queryHornDeviceDetail,
  queryHornListForSite,
  queryIotDeviceBySite,
  queryTrapGatherInfoById
} from '../../request/API/index'

const deviceWindowsId = 'deviceWindowsIdviceWindowsId'
const listWindowsId = 'lisWindowsIdWindowsIdt'
var ponitInstance = null
export default {
  scaleY: 1,
  deviceImgs: [],
  waterSeal: {},
  deviceImgIndex: 0,
  dictOptions: null,
  _supview: null, //上层级的view组件相当于vue实例
  isLookingHere: false, //看这里开启关闭
  isPlayingList: [],
  preViewshedSitCode: null,
  nowViewshedSitCode: null,
  AllMarker: {
    1: '', // 摄像机
    2: '', // 雷达
    3: '', // 物联设备
    4: '', // 无人机
    5: '', // 大喇叭
    6: '', // 网格
    7: '', // 网格员
    8: '', // 资源
    9: '', // 告警图层
    10: '', // 告警热力图
    11: '', // 设备树点击设备，生成的单点
    12: '', // 告警列表点击告警，生成的单点
    13: '', // 告警详情生成的单点
    14: '', // 周边分析生成的摄像机单点
    15: '', // 图层
    20: '', // 诱捕器
    21: '' // 诱捕器采集记录
  },
  _selectMarkerCode: '',
  _defaultViewShed: {
    distance: 3000,
    height: '10',
    horizViewRange: '157.79',
    vertiViewRange: '-2.90',
    horizRange: '36.52',
    vertiRange: '27.00',
    visualRange: '3'
  },
  _cameraData: [], // 摄像机数据，用于3d可视域
  handleMapId: '', // 新增组件逻辑参数 deviceWindowsId:'',
  is3Dprivate: false,
  isHaveWarningList: false, //是否有告警列表
  mapinstance: {},

  _3DViewshed: {}, // 3d可视域对象
  zIndexConfig: {
    1: 11, // 摄像机 // 最大20
    2: 8, // 雷达
    3: 9, // 物联设备
    4: 7, // 无人机
    5: 6, // 大喇叭
    7: 5, // 网格
    8: 4, // 网格员
    9: 10, // 告警图层
    14: 1000 // 周边分析生成的摄像机
  },
  InfoWindowCameraList: [], // 地图打点弹窗显示的列表
  InfoWindowItemDetails: '', // 地图打点弹窗显示详细信息
  _alarmLayerArr: {}, // 告警图层的打点数据
  markinfoWindow: null,
  markInfoWindowData: null,
  iconConfig: {
    1: {
      icon1: require('@component-gallery/assets/functionMenu/ipc-online.png'), // 在线 摄像机
      icon2: require('@component-gallery/assets/functionMenu/ipc-outline.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/ipc-change.png'), // 选中
      clickIcon2: require('@component-gallery/assets/functionMenu/camera_outline.png'), // 离线选中
      clusterImg: require('@component-gallery/assets/functionMenu/cluster-blue-ar.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    2: {
      icon1: require('@component-gallery/assets/functionMenu/radar_icon_2.png'), // 在线 雷达
      icon2: require('@component-gallery/assets/functionMenu/radar_icon_4.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/radar_icon_3.png'), // 选中
      clusterImg: require('@component-gallery/assets/functionMenu/radar_icon_1.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    3: {
      icon1: require('@component-gallery/assets/functionMenu/IoT_icon_2.png'), // 在线 物联设备
      icon2: require('@component-gallery/assets/functionMenu/IoT_icon_4.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/IoT_icon_3.png'), // 选中
      clickIcon2: require('@component-gallery/assets/functionMenu/radar_outline.png'), // 离线选中
      clusterImg: require('@component-gallery/assets/functionMenu/IoT_icon_1.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    4: {
      icon1: require('@component-gallery/assets/functionMenu/UAV_icon_2.png'), // 在线 无人机
      icon2: require('@component-gallery/assets/functionMenu/UAV_icon_4.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/UAV_icon_3.png'), // 选中
      clickIcon2: require('@component-gallery/assets/functionMenu/uav_outline.png'), // 离线选中
      clusterImg: require('@component-gallery/assets/functionMenu/UAV_icon_1.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    5: {
      icon1: require('@component-gallery/assets/functionMenu/horn_icon_2.png'), // 在线 大喇叭
      icon2: require('@component-gallery/assets/functionMenu/horn_icon_4.png'), // 离线
      clickIcon2: require('@component-gallery/assets/functionMenu/horn_outline.png'), // 离线选中
      clickIcon: require('@component-gallery/assets/functionMenu/horn_icon_3.png'), // 选中
      clusterImg: require('@component-gallery/assets/functionMenu/horn_icon_1.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    7: {
      icon1: require('@component-gallery/assets/functionMenu/keeper-line@2x.png'), // 在线 网格员
      icon2: require('@component-gallery/assets/functionMenu/keeper-online@2x.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/keeper-check@2x.png'), // 选中
      clickIcon2: require('@component-gallery/assets/functionMenu/user_outline.png'), // 离线选中
      clusterImg: require('@component-gallery/assets/functionMenu/keeper-juhe@2x.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    8: {
      icon1: require('@component-gallery/assets/functionMenu/resouce-icon2x.png'), // 在线 资源
      icon2: require('@component-gallery/assets/functionMenu/out-resouceicon.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/resouce-clickIcon2x.png'), // 选中
      clickIcon2: require('@component-gallery/assets/functionMenu/resouce-clickIcon2x.png'), // 选中
      clusterImg: require('@component-gallery/assets/functionMenu/resource-juhe.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    },
    9: {
      icon1: require('@component-gallery/assets/functionMenu/alarm-marker-normal.png'), // 在线
      icon2: require('@component-gallery/assets/functionMenu/alarm-marker-normal.png'), // 离线
      clickIcon: require('@component-gallery/assets/functionMenu/alarm-marker-select.png'), // 选中
      clusterImg: require('@component-gallery/assets/functionMenu/alarm-marker-list.png'), // 聚合图标
      width: 43, // 宽
      height: 46, // 高
      clusterWidth: 60, // 聚合图标宽度
      clusterHeight: 60, // 聚合图标高度
      clusterOffset: [30, 30]
    }
  },
  allResourcePolygonsList: {},
  _triggerEventType: [], // 触发点击事件的设备打点信息
  pointClickHandleTime: null,
  peripheryMarkinfoWindow: null,
  // getEmptyViewText() {
  // 	return this.isLoadFail ? this.errorInfo.text : this.emptyInfo.text;
  // },
  // InfoPopup.getmapid(deviceWindowsId, this.is3d, this.isHaveWarningList, localMapInstance);
  setScaleY(scaleY) {
    this.scaleY = scaleY
  },
  getmapid(is3d, isHaveWarningList, mapContainerId, supview) {
    this._supview = supview
    this.handleMapId = mapContainerId
    this.is3Dprivate = is3d
    this.isHaveWarningList = isHaveWarningList
    this.mapinstance = null
    console.log('获取mapid', this.is3Dprivate, this.handleMapId)
  },
  _setCameraViewshedSelect(_code, otherCode) {
    console.log('_setCameraViewshedSelect', otherCode)
    this._selectMarkerCode = otherCode
    let _d = this._defaultViewShed.visualRange * 1000
    let _item =
      (this._cameraData || []).find((dev) => dev.id == otherCode) || {}
    let _fn = () => {
      return new Promise((r) => {
        getDeviceVisibleBySite({
          deviceCodes: [otherCode]
        }).then((res) => {
          const { code, data } = res
          // if (code === 200) {
          // 保存可视域范围
          _item._distance = _d
          if (this.isArrEmputy(data)) {
            let _info = data[0]
            // 保存可视域范围
            _item.distance =
              Number(_info.visualRange || this._defaultViewShed.visualRange) *
              1000
            _item.heading = Number(
              _info.horizViewRange || this._defaultViewShed.horizViewRange
            ) // 可视域方向
            _item.angle = Number(
              _info.horizRange || this._defaultViewShed.horizRange
            ) // 可视域角度
          } else {
            _item.heading = Number(this._defaultViewShed.horizViewRange)
            _item.angle = Number(this._defaultViewShed.horizRange)
            _item.distance = _item.distance ? _item.distance : _d
          }
          _item.isWarning = true
          r(data[0])
          // }
        })
      })
    }
    // 更改可视域状态
    this.changeCameraState(_item, _code, _fn, otherCode)
  },
  /**
   * 判断是否为数组不为空
   * @param {Object} obj
   */
  isArrEmputy(obj) {
    if (typeof obj == 'undefined' || obj == null) {
      return false
    }
    if (Array.isArray(obj) && obj.length > 0) {
      // console.log('数组不为空');
      return true
    } else {
      // console.log('不是数组或者数组为空');
      return false
    }
  },
  //更改可视域状态
  changeCameraState(_item, _code, _fn, otherCode) {
    if (this.is3Dprivate) {
      // 如果不显示可视域，则单独创建可视域，有则更换颜色
      this._3DViewshed[this._selectMarkerCode]?.remove()
      _fn().then((_fnInfo) => {
        _item.latitude = Number(
          _item.latitude ? _item.latitude : _fnInfo.latitude
        )
        _item.longitude = Number(
          _item.longitude ? _item.longitude : _fnInfo.longitude
        )
        console.log('1111')
        this.handleClearAllViewShed()
        ponitInstance?.remove()
        this._3DViewshed[this._selectMarkerCode] = cameraLocationAnalysisNew(
          this.mapinstance,
          _item,
          '#F9FF6C'
        )
      })
    } else {
      // 如果不显示可视域，则单独显示当前摄像机可视域
      let _obj = {
        isWarning: true
      }
      if (!this.isShowViewshed) {
        _obj.distance = _item ? _item.distance : this._defaultViewShed.distance
      }
      console.log('=======', _item)
      this.AllMarker['11'] &&
        this.AllMarker['11']?.setCameraStateById('id', otherCode, _obj)
    }
  },
  //导出供使用的关闭弹窗
  // 	// 	type: '', // 设备类型方便请求设备信息
  // mapInstance地图实例
  //closeDeviceblock关闭弹窗回调：返回值是传入的type类型
  ExportCloseDeviceWindow(
    type,
    mapInstance,
    closeDeviceblock = () => {
      console.log('')
    },
    isFromBeforeOpenWindow
  ) {
    let _is3D = this.is3Dprivate
    let id = +type

    // 取消树的选中状态
    if (this._supview) {
      console.log('******==>', typeof this._supview)
      if (id == 7) {
        //if (this._supview.$refs.tr.$refs.monitorTreeGridMan) {
        this._supview.$refs.tree.$refs.monitorTreeGridMan?.setCurrentKey()
        //}
      } else if (id == 8) {
        // if (this._supview.$refs.leftMonitorInfo.$refs.monitorTreeZy) {
        this._supview.$refs.tree.$refs.monitorTreeZy?.setCurrentKey()
        // }
      } else {
        // if (this._supview.$refs[`monitorTree${id}`]) {
        this._supview.$refs[`monitorTree${+id}`]?.setCurrentKey()
        // }
      }
    }
    console.log('有无弹窗', this.markinfoWindow)
    if (this.markinfoWindow) {
      console.log('关闭this.markinfoWindow', this.markinfoWindow)
      let deviceInfo = {
        type: id,
        code: this.markInfoWindowData ? this.markInfoWindowData?.code : ''
      }
      console.log('对外关闭弹框通知出参', deviceInfo)
      if (!isFromBeforeOpenWindow) {
        this._supview.$globalEventBus.$emit(
          'siteDetailInfoWindowClose',
          deviceInfo
        )
      }
      if (this.isLookingHere) {
        let Info = {
          // videoPosition: { top: 0, right: 0 },
          active: false // true or false
        }
        this._supview.$globalEventBus.$emit('callLookHere', Info)
        // return
      }

      CommonMap.closeInfoWindowNew(
        deviceWindowsId,
        mapInstance,
        this.is3Dprivate,
        closeDeviceblock
      )
      this.markinfoWindow = null
      this.markInfoWindowData = null
      // 清除周边分析打点选中状态
      this._removeSelectedDevState(14)
      // if (this.$parent.$refs.leftMonitorInfo?.$refs?.tree) {
      // 	EventBus.$emit('setCurrentKey', null);
      // }

      // 清除保存的可视域信息
      this.handleClearAllViewShed()
      this._cameraData = []
      this._3DViewshed = {}
      ponitInstance = null
      this._supview.wcInfoWindowClosedBc(deviceInfo)
    }
    console.log('peripheryMarkinfoWindow', this.peripheryMarkinfoWindow)
    if (this.InfoWindowCameraList.length) {
      this.InfoWindowCameraList = []
    }
    if (this.InfoWindowItemDetails) {
      this.InfoWindowItemDetails = ''
    }
    // if (id) {
    /*if(!_is3D){
		  this.AllMarker[id].setZIndex(this.zIndexConfig[id]);
		}*/
    // 如果有单个点，清除单个点
    if (this.AllMarker[11]) {
      this._removeSelectedDevState(11)
      this.cleanCreateMark(11)
      this.clearResourceProperty(11)
    }
    this._removeSelectedDevState(id)
    // }

    // if (this._selectMarkerCode) {
    // 	// 如果不显示可视域，则隐藏当前摄像机可视域
    // 	let _item = this._cameraData.find((item) => {
    // 		return item.id == this._selectMarkerCode;
    // 	})
    // 	if (_is3D) {
    // 		if (this._3DViewshed[this._selectMarkerCode]) {
    // 			this._3DViewshed[this._selectMarkerCode].remove();
    // 			delete this._3DViewshed[this._selectMarkerCode];
    // 		}
    // 		this._selectMarkerCode = '';
    // 	} else {
    // 		let _selectDev = (this._cameraData || []).find(dev => dev.id == this._selectMarkerCode);
    // 		let _d = _selectDev ? _selectDev._distance : this._defaultViewShed.distance;

    // 		_item && this.AllMarker['1'] && this.AllMarker['1'].setCameraStateById('id', this._selectMarkerCode, {
    // 			distance: this.isShowViewshed && _item.status != '1' ? _d : 1,
    // 			isWarning: false,
    // 		})
    // 		this._selectMarkerCode = '';
    // 	}
    // }
  },
  // 清除地图弹窗
  //id设备类型
  closeInfoWindow(id, supview) {
    let _is3D = this.is3Dprivate

    if (this.markinfoWindow) {
      console.log('关闭this.markinfoWindow=》', this.markinfoWindow)
      let deviceInfo = {
        type: id,
        code: this.markInfoWindowData ? this.markInfoWindowData?.code : ''
      }
      console.log('关闭弹框通知出参', deviceInfo)
      supview?.$globalEventBus.$emit('siteDetailInfoWindowClose', deviceInfo)
      CommonMap.closeInfoWindowNew(
        deviceWindowsId,
        this.mapinstance,
        this.is3Dprivate,
        () => {
          console.log('关闭弹窗')
        }
      )
      this.markinfoWindow = null
      this.markInfoWindowData = null

      // 清除保存的可视域信息
      this.handleClearAllViewShed()
      this._cameraData = []
      this._3DViewshed = {}
      ponitInstance = null
      console.log(this._supview)
      this._supview.wcInfoWindowClosedBc(deviceInfo)
      // 清除周边分析打点选中状态
      // this._removeSelectedDevState(14);
      // 取消树的选中状态
      this.closeTreeSelectTime = setTimeout(() => {
        // $refs[`monitorTree${id}`]
        if (+id == 7) {
          supview.$refs.leftMonitorInfo.$refs.monitorTreeGridMan?.setCurrentKey()
        } else if (+id == 8) {
          supview.$refs.leftMonitorInfo.$refs.monitorTreeZy?.setCurrentKey()
        } else {
          supview.$refs[`monitorTree${+id}`]?.setCurrentKey()
        }
      }, 100)
      // if (this.$parent.$refs.leftMonitorInfo?.$refs?.tree) {
      // 	EventBus.$emit('setCurrentKey', null);
      // }

      if (this.isLookingHere) {
        let Info = {
          // videoPosition: { top: 0, right: 0 },
          active: false // true or false
        }
        supview.$globalEventBus.$emit('callLookHere', Info)
      }
    }
    console.log('peripheryMarkinfoWindow', this.peripheryMarkinfoWindow)
    // 处理周边分析的弹窗
    if (this.InfoWindowCameraList.length) {
      this.InfoWindowCameraList = []
    }
    if (this.InfoWindowItemDetails) {
      this.InfoWindowItemDetails = ''
    }
    // if (id) {
    /*if(!_is3D){
		  this.AllMarker[id].setZIndex(this.zIndexConfig[id]);
		}*/
    // 如果有单个点，清除单个点
    if (this.AllMarker[11]) {
      this._removeSelectedDevState(11)
      this.cleanCreateMark(11)
      this.clearResourceProperty(11)
    }
    this._removeSelectedDevState(id)
    // }
  },
  // 清除选中状态
  _removeSelectedDevState(id) {
    if (!this.AllMarker[id]) {
      return
    }
    if (this.is3Dprivate) {
      // 清除选中
      // if(!this.isCust && [1,2,3,4,5].includes(+id)){
      //   this.AllMarker[id][2].restore();
      // }else{
      // this.AllMarker[id]?.restore();
      // }
    } else {
      this.AllMarker[id]?.setSelectedCameraState({
        isWarning: false
      })
      this.AllMarker[id]?.deSelectCamera()
      // this.AllMarker[id]?.setZIndex(this.zIndexConfig[id]);
    }
  },
  singlealonecleanmarker(id) {
    // 单个点 && 没有摄像机，则判断有没有可视域，有就清掉
    if (id == 11 && !this.AllMarker[1]) {
      if (Object.values(this._3DViewshed).length) {
        Object.values(this._3DViewshed).forEach((view) => {
          view.remove()
        })
        this._3DViewshed = {}
      }
    }
    if (id === 6) {
      //清楚网格图层
      this.clearLayer()
    }
    if (id == 8 || id == 11) {
      //清除资源区域
      this.clearResourceProperty(id)
    }
  },
  // 清除地图聚合点
  cleanCreateMark(id, clearAlarmSelect) {
    let _obj = this.AllMarker[id]
    if (_obj) {
      if (this.is3Dprivate) {
        _obj.remove()
        if (
          id == 1 ||
          (id == 11 &&
            !this.AllMarker[1] &&
            Object.values(this._3DViewshed).length)
        ) {
          Object.keys(this._3DViewshed).forEach((key) => {
            console.log('_3DViewshed', this._3DViewshed[key])
            this._3DViewshed[key].remove()
          })
          this._3DViewshed = {}
          this._cameraData = []
        }
        if (id == 14) {
          _obj.dataOptions.forEach((option) => {
            this._3DViewshed[option.id]?.remove()
          })
        }
      } else {
        _obj._layerArray &&
          _obj._layerArray.forEach((item, index) => {
            _obj.setLayerData(index, [])
          })
      }
      this.AllMarker[id] = ''
    }
    this.singlealonecleanmarker(id)
  },
  clearResourceProperty(id) {
    if (this.is3Dprivate) {
      this.allResourcePolygonsList[id]?.forEach((item) => {
        item.polygons.remove()
      })
      this.allResourcePolygonsList[id] = []
    } else {
      this.allResourcePolygonsList[id]?.forEach((item) => {
        CommonMap.removeLayer(this.handleMapId, item.polygons)
      })
      this.allResourcePolygonsList[id] = []
    }
  },
  removeInfoWindowFromMap(dom, mapRef, Id = null) {
    const id = !Id ? Number(dom.dataset.id) : Id

    const closeArr = [
      { key: 1, value: 'cameraInfoBox' },
      { key: 3, value: 'equipmentInfoBox' },
      { key: 4, value: 'iotDevices' },
      { key: 5, value: 'horn' },
      { key: 7, value: 'gridders' },
      { key: 8, value: 'resourceInfo' }
    ]
    let targetKey = closeArr.find((i) => i.key === id).value
    if (dom) {
      let haveOtherInfo = mapRef.infoBox.some((obj) =>
        Object.prototype.hasOwnProperty.call(obj, 'otherInfoBox')
      )
      let isOtherInfo = dom.parentNode.parentNode.className === 'cameraInfoBox'
      if (isOtherInfo) {
        removeInfoWindow(mapRef, 'otherInfoBox')
      } else {
        if (haveOtherInfo) {
          removeInfoWindow(mapRef, 'otherInfoBox')
        }
        // console.warn(targetKey)
        removeInfoWindow(mapRef, targetKey)
      }
    } else {
      // console.warn(targetKey)
      removeInfoWindow(mapRef, targetKey)
    }
  },
  // 处理打点的点击事件
  _pointClickHandle(
    dInfo,
    e,
    max = false,
    mapRef,
    mapId,
    succFunc = () => {
      console.log('触发点击事件回调')
    },
    allRef
  ) {
    this._triggerEventType.push({
      id: +dInfo.type,
      code: dInfo.code,
      max: max
    })
    if (this.pointClickHandleTime) {
      clearTimeout(this.pointClickHandleTime)
    }
    this.pointClickHandleTime = setTimeout(() => {
      // 如果有单独的打点，优先触发单独的
      let _item = this._triggerEventType.find((dev) => dev.max)
      // 没有，就触发层级高的
      if (!_item) {
        this._triggerEventType.sort((a, b) => {
          return this.zIndexConfig[b.id] - this.zIndexConfig[a.id]
        })
        _item = this._triggerEventType[0]
      }
      console.log('处理打点的点击事件', _item.id, _item.code) //
      let deviceInfo = {
        type: _item.id, // 设备类型方便请求设备信息
        code: dInfo.code, // sitecode
        siteCode: dInfo.siteCode,
        deviceCode: dInfo.deviceCode
      }

      this.ExportNewOpenDeviceWindows(
        deviceInfo,
        allRef,
        mapRef,
        mapId,
        () => {
          succFunc()
          console.log('弹框加载完成')
        },
        'isfromOwnListPoint'
      )
      this._triggerEventType = []
    }, 100)
  },
  setOffsetViewMap(points = []) {
    const map = this.mapinstance
    if (this.is3Dprivate) {
      console.log('我是3d')
    } else {
      const view = map.getView()
      let currentResolution = view.getResolution()
      const center = view.getCenter()
      // 设置偏移量（以像素为单位，可以根据需要调整）
      let offset = [0, 150]
      // 计算新的中心点坐标
      let newCenter = [
        center[0] + offset[0] * currentResolution,
        center[1] + offset[1] * currentResolution
      ]
      view.animate({
        center: newCenter,
        duration: 300
      })
    }
  },
  //地图上移
  setUpOffsetViewMap(points = []) {
    const map = this.mapinstance
    // if (this.is3Dprivate) {

    // } else {
    const view = map.getView()
    let currentResolution = view.getResolution()
    const center = view.getCenter()
    // 设置偏移量（以像素为单位，可以根据需要调整）
    let offset = [0, -100]
    // 计算新的中心点坐标
    let newCenter = [
      center[0] + offset[0] * currentResolution,
      center[1] + offset[1] * currentResolution
    ]
    view.animate({
      center: newCenter,
      duration: 300
    })
    // }
  },

  //各设备详情弹框
  _setdeviceDetailHtml(
    _arr,
    deviceInfo,
    allRef,
    mapRef,
    openSucCblock = () => {
      console.log('弹框打开成功')
    },
    mapId,
    popId
  ) {
    let WindowsId = deviceWindowsId
    let offsetY = -40
    let id = +deviceInfo.type
    let code = deviceInfo.code ? deviceInfo.code : ''
    console.log('_arr是什么==>', deviceInfo)
    let _sheBox = (type, data) => {
      let el
      if (type === 7) {
        el = this._setGridManMaekHtml(type, data, 2)
      } else if (type === 8) {
        el = this._setResourceManMaekHtml(type, data, 2)
      } else {
        el = this._setMaekHtml(type, data, 2)
      }
      console.log('弹窗信息data', data)
      console.log('id==>', id)
      console.log('mapRef==>', mapRef)
      this.markinfoWindow = createInfoWindow(
        mapRef,
        data.longitude,
        data.latitude,
        el,
        '',
        0,
        offsetY,
        mapId
      )
      openSucCblock()
      switch (popId) {
        case 3:
          // mapRef.infoBox.push({ equipmentInfoBox: this.markinfoWindow })
          allRef.mapRefUpdater(mapId, (draft) => {
            draft.infoBox.push({ equipmentInfoBox: this.markinfoWindow })
          })
          break
        case 4:
          // allRef.mapRefUpdater(mapId, (draft) => {
          //   draft.infoBox.push({ iotDevices: this.markinfoWindow })
          // })
          // console.log('*******>', allRef)
          // mapRef.infoBox.push({ iotDevices: this.markinfoWindow })
          break
        case 5:
          // mapRef.infoBox.push({ horn: this.markinfoWindow })
          allRef.mapRefUpdater(mapId, (draft) => {
            draft.infoBox.push({ horn: this.markinfoWindow })
          })
          break
        case 7:
          // mapRef.infoBox.push({ gridders: this.markinfoWindow })
          allRef.mapRefUpdater(mapId, (draft) => {
            draft.infoBox.push({ gridders: this.markinfoWindow })
          })
          break
        case 8:
          // mapRef.infoBox.push({ resourceInfo: this.markinfoWindow })
          allRef.mapRefUpdater(mapId, (draft) => {
            draft.infoBox.push({ resourceInfo: this.markinfoWindow })
          })
          break
      }
      this.markInfoWindowData = { id: type, code: code }
      this.InfoWindowItemDetails = data
    }

    if (id === 4) {
      // let pa = {
      //   deviceCode: _arr[0].deviceCode
      // }
      // // 无人机需要查询详情接口
      // forestryQryUavDeviceInfo(pa).then((res) => {
      //   if (res.code == '200') {
      //     console.log('无人机需要查询详情接口', res.data)
      //     if (res.data) {
      //       _sheBox(id, res.data)
      //     } else {
      //       console.error('点位详情接口未返回数据！')
      //     }
      //   }
      //   // else {
      //   // 	throw new Error(res.msg);
      //   // }
      // })
    } else if (id === 7) {
      console.log('我是网格员', _arr)
      _sheBox(id, _arr)
    } else if (id == 8) {
      //资源
      console.log('我是资源', _arr)
      _sheBox(id, _arr)
    } else if (id == 20) {
      console.log('我是诱捕器', _arr)
      let pa = {
        code: _arr[0].deviceCode,
        type: deviceInfo.type
      }
      // 	let id = +deviceInfo.type;
      // let code = deviceInfo.code ? deviceInfo.code : "";
      // getTrapInfoById(pa).then((res) => {
      // 	if (res.code == "200") {
      // 		console.log('诱捕器需要查询详情接口', res.data);
      // 		_sheBox(id, res.data);
      // 	}
      // })
      // this.OpenTrapInfoWindowById(pa, mapintance, openSucCblock)
    } else {
      _sheBox(id, _arr[0])
    }
  },
  //各设备列表弹框
  _setdeviceListHtml(
    _arr,
    deviceInfo,
    allRef,
    mapId,
    openSucCblock = () => {
      console.log('弹框打开成功')
    },
    mapRef
  ) {
    let WindowsId = deviceWindowsId
    let offsetY = -40
    let id = +deviceInfo.type
    let _obj = {
      2: 'iconfont_tools icon-tongyong-leidatubiao',
      3: 'iconfont_tools icon-tongyong-wulianshebeitubiao',
      4: 'iconfont_tools icon-linye_icon_wurenji',
      5: 'iconfont_tools icon-guotu_dalaba',
      20: 'iconfont icon-youbuqiguanli', //'',iconfont icon-youbuqiguanli
      21: 'icon-linye_icon_caijijilu' //
    }
    let windowlatitude = ''
    let windowlongitude = ''
    if (id === 20) {
      windowlatitude = deviceInfo.latitude
      windowlongitude = deviceInfo.longitude
    } else {
      windowlatitude = _arr[0].latitude
      windowlongitude = _arr[0].longitude
    }

    // =======

    let listSTR = `
		<div style="transform: scale(${this.scaleY});" class="mapDotPopUpsWrapper">
		<div class="device-CameraListinfo-Window">
<i data-id="${id}" class="closeImg InfoWindowCloseBtn"></i>
<ul>
${(function () {
  return _arr
    .map((item, index) => {
      if (item.deviceStatus === 0 || item.status === 0) {
        return deviceStatusequaltoZero(item, index, _obj, id)
      } else if (id === 20) {
        console.log('诱捕器状态', item.deploymentSituation)
        return deploymentSituationtwenty(item, index, _obj, id)
      } else {
        return getdeviceListelseHtml(item, index, _obj, id)
      }
    })
    .join('')
})()}
</ul>
<!--<div class="cameraInfoBox"></div>-->
</div>
</div>`
    console.warn(mapRef)
    this.markinfoWindow = createInfoWindow(
      mapRef,
      windowlongitude,
      windowlatitude,
      listSTR,
      '',
      0,
      offsetY,
      mapId
    )
    openSucCblock()
    allRef.mapRefUpdater(mapId, (draft) => {
      draft.infoBox.push({ otherInfoBox: this.markinfoWindow })
    })
    // mapRef.infoBox.push({ otherInfoBox: this.markinfoWindow })
    this.InfoWindowCameraList = _arr
  },
  //各设备请求数据
  _reuqestDevicInfoeBySitecode(
    _fn,
    param,
    deviceInfo,
    openSucCblock = () => {
      console.log('弹框打开成功')
    },
    mapId,
    mapRef,
    allRef
  ) {
    if (_fn) {
      let id = +deviceInfo.type
      let code = deviceInfo.code ? deviceInfo.code : ''
      _fn(param).then((res) => {
        if (res.code == '200') {
          console.log('弹窗接口返回详情', res)
          // this._isClickMark = false;
          let _arr = this.handleDevicDataeBySitecode(res, id)
          // ==============
          if (_arr.length > 1) {
            console.log('设备数组', _arr)
            this._setdeviceListHtml(
              _arr,
              deviceInfo,
              allRef,
              mapId,
              openSucCblock,
              mapRef
            )
          } else {
            // =============================
            this._setdeviceDetailHtml(
              _arr,
              deviceInfo,
              allRef,
              mapRef,
              openSucCblock,
              mapId,
              id
            )
          }
        } else {
          throw new Error(res.msg)
        }
      })
    }
  },
  //处理数据
  handleDevicDataeBySitecode(res, id) {
    let _arr
    if ([2, 3].includes(id)) {
      //一个点可以查到多条信息，需要比对一下
      _arr = res.data[0].list
      _arr.forEach((item) => {
        item.longitude = res.data[0].longitude
        item.latitude = res.data[0].latitude
      })
      // _arr = [..._arr,..._arr];
    } else {
      _arr = res[id == 1 ? 'rows' : 'data']
      // _arr = [...res[id == 1 ? 'rows' : 'data'], ...res[id == 1 ? 'rows' : 'data']];
    }
    // 喇叭特殊处理，1，2，3在线
    if (id === 5) {
      console.log('喇叭数组', _arr)
      _arr.forEach((item) => {
        item.deviceStatus = ['1', '2', '3'].includes(item.deviceStatus) ? 0 : 1
      })
    }
    if (id === 20) {
      _arr.forEach((item) => {
        item.height = item.deviceHeight
      })
    }
    return _arr
  },
  //点击点位信息*
  /*
	外部调用的的入参 -----   deviceInfo: {
													code: '', // 设备编码
													type: '', // 设备类型方便请求设备信息
												}
	地图实例：mapintance,
	弹窗回调：openSucCblock

	列表打点自己调用----deviceInfo : let deviceInfo = {
																		code: res.siteCode, // 设备编码
																		type: _id, // 设备类型方便请求设备信息
																		siteCode: res.siteCode,
																		deviceCode: res.deviceCode
																	}
	*/
  ExportNewOpenDeviceWindows(
    deviceInfo,
    allRef,
    mapRef,
    mapId,
    openSucCblock = () => {
      console.log('弹框打开成功')
    },
    isfromOwnListPoint
  ) {
    console.log('看看什么事', allRef)
    // if (!this.is3Dprivate && !isfromOwnListPoint) {
    //   this.ExportCloseDeviceWindow(
    //     deviceInfo.type,
    //     mapRef.getMapRef(mapId).mapInstance,
    //     () => console.log('弹框关闭成功', ''),
    //     true
    //   )
    // }
    console.log('点击地图锚点123', deviceInfo)
    const mapInstance = mapRef?.mapInstance ? mapRef.mapInstance : mapRef
    let id = +deviceInfo.type
    let code = deviceInfo.code ? deviceInfo.code : ''
    if (this._singlePointTimer) {
      clearTimeout(this._singlePointTimer)
    }
    // if (id != 22) {
    // 	debugger
    // 	this.setOffsetViewMap()
    // }
    let myCallSuscessBlock = () => {
      console.log('我的block弹框打开成功')
      // this._supview.$globalEventBus.$emit('alterInfoPopUpOpened');
      if (openSucCblock) {
        openSucCblock()
      }
    }

    // let siteCodelist =deviceInfo.list?deviceInfo.list:[];
    // 聚合数组单独处理
    // if (siteCodelist.length>1) {
    // 	return this.handleGatherListBySiteCodelist(id,siteCodelist, mapintance, openSucCblock);
    // }
    this._handleOtherDeviceType(
      id,
      deviceInfo,
      mapInstance,
      myCallSuscessBlock,
      openSucCblock,
      mapId,
      mapRef,
      allRef
    )
    let fn
    let param
    switch (id) {
      case 3:
        fn = queryIotDeviceBySite
        break
      case 4:
        // fn = getUavDevicesBySiteCode //无人机
        break
      case 5:
        fn = queryHornListForSite //大喇叭queryHornDeviceDetail
        break
      case 7:
        fn = gridKeeper_byid
        break
      case 8:
        fn = getResourceInfo_byResourceId
        break
      case 20:
        fn = getTrapListByLatLon //,//诱捕器点位列表
        break
    }

    if (id === 7) {
      param = {
        keeperId: code
        // resourceId: code,
        // deviceCode: code,
      }
    } else if (id === 8) {
      param = code
    } else if (id === 20) {
      param = {
        latitude: deviceInfo.latitude,
        longitude: deviceInfo.longitude
      }
    } else {
      param = {
        siteCode: code
      }
    }
    console.log('fn===>', fn)
    // ====================
    this._reuqestDevicInfoeBySitecode(
      fn,
      param,
      deviceInfo,
      myCallSuscessBlock,
      mapId,
      mapRef,
      allRef
    )
  },
  _handleOtherDeviceType(
    id,
    deviceInfo,
    mapInstance,
    myCallSuscessBlock,
    openSucCblock,
    mapId,
    mapRef,
    allRef
  ) {
    // 摄像机单独处理
    if (id == 1) {
      console.warn('看看这个地方', allRef)
      // this._supview.$globalEventBus.$emit('selectTreeNode', deviceInfo.code);
      return this.getCameraList(
        deviceInfo,
        mapRef,
        myCallSuscessBlock,
        mapId,
        allRef
      )
    }
    // 采集记录单独处理
    if (id == 21) {
      return this.getRecordListTrapList(deviceInfo, mapRef, myCallSuscessBlock)
    }
    // 小班单独处理
    if (id == 22) {
      return this.smallClassDetailWindow(
        deviceInfo,
        mapRef.getMapRef(mapId).mapInstance,
        openSucCblock
      )
    }
    // 古树名木列表单独处理
    if (id == 23) {
      this.getDict()
      return this.oldAndFamousTreesList(
        deviceInfo,
        mapRef.getMapRef(mapId).mapInstance,
        myCallSuscessBlock
      )
    }
  },
  //小班详情弹窗
  smallClassDetailWindow(info, mapInstance, infoBlock) {
    console.log('小班弹窗info1', info)

    let el = this._setSmalClassDetailInfoWindowsHtml(info.type, info, 2)

    this.markinfoWindow = CommonMap.infoWindowNew(
      info.longitude,
      info.latitude,
      el,
      '',
      0,
      -40,
      deviceWindowsId,
      mapInstance,
      this.is3Dprivate,
      this.handleMapId,
      infoBlock
    )
    this.markInfoWindowData = { id: '22', code: info.gid }
    this.InfoWindowItemDetails = info
  },
  /**
   * 查询枚举
   */
  getDict() {
    this._supview
      .getMultipleDicts([
        'forestry_ancient_famous_compactness',
        'forestry_ancient_famous_growth',
        'forestry_ancient_famous_environment'
      ])
      .then((resp) => {
        this.dictOptions = resp.data
        console.log()
      })
  },
  /**
   * 编码格式化文字
   */
  format(key, value) {
    if (!this.dictOptions) {
      return value
    }
    let label = value
    this.dictOptions[key].map((item) => {
      if (item.dictValue === value) {
        label = item.dictLabel
      }
    })
    return label
  },
  //古树名木列表
  oldAndFamousTreesList(info, mapintance, infoBlock) {
    console.log('古树名木列表', info)
    let param = {
      latitude: info.latitude,
      longitude: info.longitude,
      treeGrade: info.treeGrade //古树名木等级
    } // getRecordListofTrapByLatLon
    getTreesList(param).then((res) => {
      // this._isClickMark = false;
      if (res.code == '200') {
        let _arr = res.data
        console.log('古树名木列表', _arr)
        // _arr=[{trappingInsects:12,deviceName:'名称'},{trappingInsects:12,deviceName:'名称好好计划花见花开'}]
        //   let _arr = [...res.data,...res.data, ...res.data, ...res.data, ...res.data,...res.data, ...res.data, ...res.data];
        if (_arr.length > 1) {
          let offsetY = -40
          let listSTR = `
					<div style="transform: scale(${this.scaleY});" class="mapDotPopUpsWrapper">
					`
          listSTR += getOldTreeListWIndow(_arr)

          this.markinfoWindow = CommonMap.infoWindowNew(
            info.longitude,
            info.latitude,
            listSTR,
            '',
            0,
            offsetY,
            deviceWindowsId,
            mapintance,
            this.is3Dprivate,
            this.handleMapId,
            infoBlock
          )
          this.InfoWindowCameraList = _arr
        } else {
          let pa = {
            code: _arr[0].id.toString(),
            treeGrade: _arr[0].treeGrade
          }
          this._showoldAndFamousTreesWindowById(pa, 2).then((el) => {
            this.markinfoWindow = CommonMap.infoWindowNew(
              info.longitude,
              info.latitude,
              el,
              '',
              0,
              -40,
              deviceWindowsId,
              mapintance,
              this.is3Dprivate,
              this.handleMapId,
              infoBlock
            )
            this.markInfoWindowData = { id: '23', code: _arr[0].id }
            this.InfoWindowItemDetails = _arr[0]
          })
        }
      } else {
        throw new Error(res.msg)
      }
    })
  },
  //采集记录
  getRecordListTrapList(info, mapintance, infoBlock) {
    let param = {
      latitude: info.latitude,
      longitude: info.longitude
    }
    getRecordListofTrapByLatLon(param).then((res) => {
      // this._isClickMark = false;
      if (res.code == '200') {
        let _arr = res.data[0].list
        console.log('诱捕记录点位列表', _arr)
        // _arr=[{trappingInsects:12,deviceName:'名称'},{trappingInsects:12,deviceName:'名称好好计划花见花开'}]
        //   let _arr = [...res.data,...res.data, ...res.data, ...res.data, ...res.data,...res.data, ...res.data, ...res.data];
        if (_arr.length > 1) {
          let offsetY = -40
          this.markinfoWindow = CommonMap.infoWindowNew(
            info.longitude,
            info.latitude,
            `
<div style="transform: scale(${this.scaleY});" class="mapDotPopUpsWrapper">
<div class="device-CameraListinfo-Window">
					<i data-id="21" class="closeImg InfoWindowCloseBtn"></i>
					<ul>
					  ${(function () {
              return _arr
                .map((item, index) => {
                  return `<li class="InfoWindowCameraItem li_span ${
                    item.status != '0' ? 'isOnLine' : 'isOffLine'
                  }"  data-id="21" data-index="${index}">
								<i class='iconfont_tools icon-linye_icon_caijijilu'></i>
                                <a class="span_text InfoWindowCameraItem" data-id="21" style="flex-grow: 1;" data-index="${index}" title="${
                    item.trappingInsects
                  }">${item.trappingInsects}</a>
								<a class="span_text InfoWindowCameraItem" data-id="21" style="text-align: right;" data-index="${index}" title="${
                    item.deviceName
                  }">${item.deviceName}</a>
							</li>`
                })
                .join('')
            })()}
					</ul>
					<div class="cameraInfoBox"></div>
				  </div>
</div>
`,
            '',
            0,
            offsetY,
            deviceWindowsId,
            mapintance,
            this.is3Dprivate,
            this.handleMapId,
            infoBlock
          )
          this.InfoWindowCameraList = _arr
        } else {
          this._showTrapGatherInfoById(_arr[0].id.toString(), 2).then((el) => {
            this.markinfoWindow = CommonMap.infoWindowNew(
              info.longitude,
              info.latitude,
              el,
              '',
              0,
              -40,
              deviceWindowsId,
              mapintance,
              this.is3Dprivate,
              this.handleMapId,
              infoBlock
            )

            this.markInfoWindowData = { id: '21', code: _arr[0].id }

            this.InfoWindowItemDetails = _arr[0]
            //   EventBus.$emit('checkAroundOpen', {source: this.source, ..._arr[0]});
            //   EventBus.$emit('checkRelEventOpen', {source: this.source, ..._arr[0]});
          })
        }
      } else {
        throw new Error(res.msg)
      }
    })
  },
  setCameraListbyArr(_arr, deviceInfo, res) {
    if (_arr.length == 1 && _arr.find((dev) => dev.deviceStatus == '0')) {
      this.handleCameraListViewShed(
        res.data,
        deviceInfo.code,
        deviceInfo.deviceCode
      )
    }
    if (_arr.length > 1 && _arr.find((dev) => dev.deviceStatus == '0')) {
      this.handleClearAllViewShed()
      this.handleCameraListViewShed(
        res.data,
        deviceInfo.code,
        deviceInfo.deviceCode
      )
    }
  },
  //摄像机列表html
  _getCameraListHtml(_arr) {
    return `<div style="transform: scale(${
      this.scaleY
    });" class="mapDotPopUpsWrapper">
<div class="device-CameraListinfo-Window">
					<i data-id="1" class="closeImg InfoWindowCloseBtn"></i>
					<ul>
					  ${(function () {
              return _arr
                .map((item, index) => {
                  return `<li class="InfoWindowCameraItem"  data-id="1" data-index="${index}" title="${
                    item.deviceName
                  }">
								<i class='iconfont_tools icon-liebiaoshexiangji' style="${
                  item.deviceStatus != '0'
                    ? 'color:rgba(232, 243, 254, 0.6)'
                    : ''
                }"></i>
								<p  style="${
                  item.deviceStatus != '0'
                    ? 'color:rgba(232, 243, 254, 0.6)'
                    : ''
                }">${item.deviceName}</p>
								<span style="${
                  item.deviceStatus != '0'
                    ? 'color:rgba(232, 243, 254, 0.6)'
                    : ''
                }">${item.height}m</span>
							</li>`
                })
                .join('')
            })()}
					</ul>
					<div class="cameraInfoBox"></div>
				  </div>
</div>
`
  },
  // 聚合数组单独处理
  // handleGatherListBySiteCodelist(id,siteCodelist, mapintance, openSucCblock) {

  // },

  // 获取摄像机点位列表
  getCameraList(deviceInfo, mapRef, infoBlock, mapId, allRef) {
    console.warn('是走这个方法了嘛=>getCameraList')
    // code---站点code
    // siteCode -- 站点code
    getCameraList({
      siteCode: deviceInfo.siteCode ? deviceInfo.siteCode : deviceInfo.code
    }).then((res) => {
      if (res.code == '200') {
        // this._isClickMark = false;
        console.log('点位列表', res.data)
        let _arr = res.data
        if (this.is3Dprivate) {
          ponitInstance?.remove()
        }
        // =========
        this.setCameraListbyArr(_arr, deviceInfo, res)
        // =========
        if (_arr.length > 1) {
          let offsetY = -40
          // if (this.is3Dprivate) {
          //   offsetY = -40;
          // }
          // online: ['1','2','3'],//1 2 3 都是在线
          //摄像机、无人机、物联设备都是0在线1离线

          let _strHtml = this._getCameraListHtml(_arr)
          //createInfoWindow()
          this.markinfoWindow = createInfoWindow(
            mapRef,
            _arr[0].longitude,
            _arr[0].latitude,
            _strHtml,
            '',
            0,
            offsetY,
            mapId
          )
          allRef.mapRefUpdater(mapId, (draft) => {
            draft.infoBox.push({
              cameraInfoBox: this.markinfoWindow
            })
          })
          // mapRef.getMapRef(mapId).infoBox.push({
          //   cameraInfoBox: this.markinfoWindow
          // })
          infoBlock()

          this.InfoWindowCameraList = _arr
        } else {
          this._showCameraItemInfo(_arr[0].deviceCode, 2).then((el) => {
            this.markinfoWindow = createInfoWindow(
              mapRef,
              _arr[0].longitude,
              _arr[0].latitude,
              el,
              '',
              0,
              -40,
              mapId
            )
            if (mapRef.infoBox.some((item) => 'cameraInfoBox' in item)) {
              removeInfoWindow(mapRef, 'cameraInfoBox')
            }

            // if(infoBlock)
            allRef.mapRefUpdater(mapId, (draft) => {
              draft.infoBox.push({
                cameraInfoBox: this.markinfoWindow
              })
            })
            // mapRef.infoBox.push({
            //   cameraInfoBox: this.markinfoWindow
            // })
            infoBlock()
            this.markInfoWindowData = { id: '1', code: _arr[0].deviceCode }
            // this.InfoWindowItemDetails = _arr[0];
          })
        }
      } else {
        throw new Error(res.msg)
      }
    })
  },
  //
  _changeCameraData(oneInfo, _info) {
    if (this._cameraData.length) {
      let fIndex = this._cameraData.findIndex(
        (item) => item.deviceCode == _info.deviceCode
      )
      if (fIndex > -1) {
        this._cameraData[fIndex].distance = oneInfo.distance
        this._cameraData[fIndex].heading = oneInfo.heading
        this._cameraData[fIndex].angle = oneInfo.angle
      } else {
        this._cameraData.push(oneInfo)
      }
    } else {
      this._cameraData.push(oneInfo)
    }
  },
  _changeCameraViewshed(oneInfo, resIndex, siteCode, deviceCode) {
    if (this.is3Dprivate) {
      if (resIndex == 0) {
        // 自动打开第一条可视域
        if (Object.values(this._3DViewshed).length) {
          Object.values(this._3DViewshed).forEach((view) => {
            view.remove()
          })
        }
        console.log('2222')
        this._3DViewshed[oneInfo.deviceCode]?.remove()
        this._3DViewshed[oneInfo.deviceCode] = cameraLocationAnalysisNew(
          this.mapinstance,
          oneInfo,
          '#F9FF6C'
        )
      }
    } else {
      //  默认打开二维可视域
      if (resIndex == 0) {
        let vObj = {
          isWarning: true,
          heading: oneInfo.heading,
          angle: oneInfo.angle,
          distance: oneInfo.distance
        }
        if (this.AllMarker['11']) {
          this.AllMarker['11'].setCameraStateById('id', deviceCode, vObj)
          ponitInstance?.setCameraStateById('id', siteCode, { distance: 1 })
        } else {
          ponitInstance?.setCameraStateById('id', siteCode, vObj)
        }
        this.handlePreviewShed(siteCode)
      }
    }
  },
  handleCameraListViewShed(cameraList, siteCode, deviceCode) {
    let reqList = cameraList.map((item) => {
      return getDeviceVisibleBySite({
        deviceCodes: [item.deviceCode]
      })
    })
    Promise.all(reqList).then((resList) => {
      console.log('123123', resList, cameraList)
      const layerId = CommonMap.getLayerIdStrSNew().camera + '1'
      resList.forEach((itemRes, resIndex) => {
        if (itemRes.code == '200') {
          let _info = itemRes.data[0]
          console.log('info', _info)
          let oneInfo = {
            id: _info.deviceCode || '',
            deviceCode: _info.deviceCode || '',
            clickBig: false,
            sourceType: layerId,
            top: true,
            longitude: +cameraList[0].longitude,
            latitude: +cameraList[0].latitude,
            lng: +cameraList[0].longitude,
            lat: +cameraList[0].latitude,
            status: cameraList[resIndex].deviceStatus
          }
          if (_info) {
            // 保存可视域范围
            oneInfo.distance =
              Number(_info?.visualRange || this._defaultViewShed.visualRange) *
              1000
            oneInfo.heading = Number(
              _info?.horizViewRange || this._defaultViewShed.horizViewRange
            ) // 可视域方向
            oneInfo.angle = Number(
              _info?.horizRange || this._defaultViewShed.horizRange
            )
          } else {
            // oneInfo.heading = Number(this._defaultViewShed.horizViewRange);
            // oneInfo.angle = Number(this._defaultViewShed.horizRange);
            // oneInfo.distance = this._defaultViewShed.visualRange * 1000;
          }
          // ========
          // console.log('oneInfo-code:', _info.deviceCode)
          // console.log('oneInfo:', oneInfo)

          this._changeCameraData(oneInfo, _info)

          // =========
          this._changeCameraViewshed(
            oneInfo,
            resIndex,
            siteCode,
            _info.deviceCode
          )
        }
      })
    })
  },
  handlePreviewShed(siteCode) {
    // 清空上次图层的可视域信息siteCode
    if (this.preViewshedSitCode && this.preViewshedSitCode != siteCode) {
      ponitInstance?.setCameraStateById('id', this.preViewshedSitCode, {
        distance: 1,
        isWarning: false
      })
      this.preViewshedSitCode = siteCode
    } else if (
      !this.preViewshedSitCode ||
      this.preViewshedSitCode != siteCode
    ) {
      this.preViewshedSitCode = siteCode
    }
    this.nowViewshedSitCode = siteCode
  },
  handleCameraListClick(pa) {
    let devInfo = this._cameraData.find((item) => {
      return item.id == pa.deviceCode
    })
    if (!devInfo) {
      return
    }
    if (this.is3Dprivate) {
      // 3D 可视域
      if (Object.values(this._3DViewshed).length) {
        Object.values(this._3DViewshed).forEach((view) => {
          view.remove()
        })
      }
      console.log('3333')
      this._3DViewshed[devInfo.deviceCode]?.remove()
      if (devInfo.status == '0') {
        this._3DViewshed[devInfo.deviceCode] = cameraLocationAnalysisNew(
          this.mapinstance,
          devInfo,
          '#F9FF6C'
        )
      }
    } else {
      let viewshedInfo = {
        isWarning: true,
        distance: devInfo.distance,
        heading: devInfo.heading,
        angle: devInfo.angle
      }
      if (devInfo.status != '0') {
        viewshedInfo.distance = 1
      }
      if (this.AllMarker['11']) {
        let cid = this.AllMarker['11']._selectedCamera.values_.data.id
        this.AllMarker['11'].setCameraStateById('id', cid, viewshedInfo)
      }
      if (ponitInstance) {
        ponitInstance?.setCameraStateById(
          'id',
          this.InfoWindowItemDetails.siteCode,
          viewshedInfo
        )
      }
    }
  },
  handleClearAllViewShed() {
    if (this.is3Dprivate) {
      if (Object.values(this._3DViewshed).length) {
        Object.values(this._3DViewshed).forEach((view) => {
          view.remove()
        })
      }
      ponitInstance?.remove()
      this._3DViewshed = {}
    } else {
      ponitInstance?.setCameraStateById('id', this.preViewshedSitCode, {
        distance: 1,
        isWarning: false
      })
      ponitInstance?.setCameraStateById('id', this.nowViewshedSitCode, {
        distance: 1,
        isWarning: false
      })
      this.preViewshedSitCode = null
      this.nowViewshedSitCode = null
    }
  },
  //诱捕器详情弹框
  OpenTrapInfoWindowById(
    deviceInfo,
    mapintance,
    openSucCblock = () => {
      console.log('弹框打开成功')
    }
  ) {
    // type: 20, //诱捕器设备
    // code: markerId
    let pa = {
      deviceCode: deviceInfo.code
    }
    let _sheBox = (type, data) => {
      let el = this._setMaekHtml(type, data, 2)
      console.log('sheBox', deviceWindowsId)
      this.markinfoWindow = CommonMap.infoWindowNew(
        data.longitude,
        data.latitude,
        el,
        '',
        0,
        -40,
        deviceWindowsId,
        mapintance,
        this.is3Dprivate,
        this.handleMapId,
        openSucCblock
      )
      this.markInfoWindowData = { id: type, code: deviceInfo?.code }
      this.InfoWindowItemDetails = data
    }
    // 诱捕器需要查询详情接口
    getTrapInfoById(pa).then((res) => {
      if (res.code == '200') {
        console.log('诱捕器需要查询详情接口', res.data)
        _sheBox(deviceInfo.type, res.data)
      } else {
        throw new Error(res.msg)
      }
    })
  },
  //采集记录详情弹框
  OpenTrapRecoderDetailWindowById(
    deviceInfo,
    mapintance,
    openSucCblock = () => {
      console.log('弹框打开成功')
    }
  ) {
    console.log('采集记录详情入参', deviceInfo)

    this._showTrapGatherInfoById(deviceInfo.code.toString(), 2).then((el) => {
      this.markinfoWindow = CommonMap.infoWindowNew(
        deviceInfo.longitude,
        deviceInfo.latitude,
        el,
        '',
        0,
        -40,
        deviceWindowsId,
        mapintance,
        this.is3Dprivate,
        this.handleMapId,
        openSucCblock
      )

      this.markInfoWindowData = { id: '21', code: deviceInfo.code }
    })
  },
  //古树名木
  oldAndFamousTreesWindow(
    deviceInfo,
    mapintance,
    infoBlock = () => {
      console.log('弹框打开成功')
    }
  ) {
    console.log('古树名木详情入参', deviceInfo)
    deviceInfo.code = deviceInfo.code.toString() //treeGrade
    this._showoldAndFamousTreesWindowById(deviceInfo, 2).then((el) => {
      this.markinfoWindow = CommonMap.infoWindowNew(
        deviceInfo.longitude,
        deviceInfo.latitude,
        el,
        '',
        0,
        -40,
        deviceWindowsId,
        mapintance,
        this.is3Dprivate,
        this.handleMapId,
        infoBlock
      )

      this.markInfoWindowData = { id: '23', code: deviceInfo.code }
    })
  },
  // 导出供其他厂家使用的弹窗开启方法
  //点击点位信息*
  // deviceInfo: {
  // 	code: '', // 设备编码
  // 	type: '', // 设备类型方便请求设备信息
  // 	}
  // 地图实例：mapintance,
  // 弹窗回调：openSucCblock
  // */
  ExportOpenDeviceWindowByDeviceCode(
    deviceInfo,
    mapintance,
    openSucCblock = () => {
      console.log('弹框打开成功')
    },
    anysPointIns,
    mapRef,
    mapId
  ) {
    ponitInstance = anysPointIns
    let WindowsId = deviceWindowsId
    let id = +deviceInfo.type
    let code = deviceInfo.code
    let fn
    let param = {
      deviceCode: code
    }
    // let myCallSuscessBlock =function(){
    // 	console.log('弹框打开成功');
    // 	this._supview.$globalEventBus.$emit('alterInfoPopUpOpened');
    // 	openSucCblock;
    // }
    let myCallSuscessBlock = () => {
      console.log('我的block弹框打开成功')
      this._supview.$globalEventBus.$emit('alterInfoPopUpOpened')
      if (openSucCblock) {
        openSucCblock()
      }
    }

    if (id == 20) {
      this.OpenTrapInfoWindowById(deviceInfo, mapintance, myCallSuscessBlock)
      return
    }
    if (id == 21) {
      this.OpenTrapRecoderDetailWindowById(
        deviceInfo,
        mapintance,
        myCallSuscessBlock
      )
      return
    }
    // 古树名木详情单独处理
    if (id == 23) {
      this.getDict()
      this.oldAndFamousTreesWindow(deviceInfo, mapintance, myCallSuscessBlock)
      return
    }

    switch (id) {
      case 1:
        fn = forestryQueryDeviceForWE
        break
      case 3:
        fn = queryIotDeviceBySite
        break
      case 4:
        fn = forestryQryUavDeviceInfo //无人机
        break
      case 5:
        fn = queryHornDeviceDetail //大喇叭
        break
      case 7:
        fn = gridKeeper_byid
        param = {
          keeperId: code
        }
        break
      case 8:
        fn = getResourceInfo_byResourceId
        param = code
        break
      default:
        param = {
          deviceCode: code
        }
        break
    }

    if (!fn) {
      return
    }
    fn(param).then((res) => {
      if (res.code == '200') {
        let _obj = res.data
        if ([2, 3].includes(id)) {
          //物联设备一个点可以查到多条信息，需要比对一下
          _obj = res.data[0].list

          _obj.forEach((item) => {
            item.longitude = res.data[0].longitude
            item.latitude = res.data[0].latitude
          })
          // _arr = [..._arr,..._arr];
        }

        this._chengeDeviceWindowByDeviceCode(
          _obj,
          deviceInfo,
          mapintance,
          myCallSuscessBlock,
          mapRef,
          mapId
        )
      } else {
        throw new Error(res.msg)
      }
    })
  },
  _chengeDeviceWindowByDeviceCode(
    _obj,
    deviceInfo,
    mapintance,
    openSucCblock = () => {
      console.log('弹框打开成功')
    },
    mapRef,
    mapId
  ) {
    let id = +deviceInfo.type
    let code = deviceInfo.code
    let _sheBox = (type, data) => {
      let el
      switch (type) {
        case 7:
          el = this._setGridManMaekHtml(type, data, 2)
          break
        case 8:
          el = this._setResourceManMaekHtml(type, data, 2)
          break
        default:
          el = this._setMaekHtml(type, data, 2)
          break
      }
      console.log('sheBox', deviceWindowsId)
      this.markinfoWindow = createInfoWindow(
        mapRef.getMapRef(mapId),
        data.longitude,
        data.latitude,
        el,
        '',
        0,
        -40,
        mapId
      )
      mapRef.mapRefUpdater(mapId, (draft) => {
        draft.infoBox.push({ otherInfoBox: this.markinfoWindow })
      })
      // mapRef.infoBox.push({ orderInfoBox: this.markinfoWindow })
      this.markInfoWindowData = { id: type, code: data?.deviceCode }
      this.InfoWindowItemDetails = data
    }
    switch (id) {
      case 1:
        this._showCameraItemInfo(_obj.deviceCode, 2, '2').then((el) => {
          // 操作周边分析可视域
          if (this.InfoWindowItemDetails.status == '0') {
            this.handleAroundViewshed(deviceInfo.code)
          }
          // this.markinfoWindow = CommonMap.infoWindowNew(
          //   _obj.longitude,
          //   _obj.latitude,
          //   el,
          //   '',
          //   0,
          //   -40,
          //   deviceWindowsId,
          //   mapintance,
          //   this.is3Dprivate,
          //   this.handleMapId,
          //   openSucCblock
          // )
          const marker = createInfoWindow(
            mapRef.getMapRef(mapId),
            _obj.longitude,
            _obj.latitude,
            el,
            '',
            0,
            -40,
            mapId
          )
          mapRef.mapRefUpdater(mapId, (draft) => {
            draft.infoBox.push({ cameraInfoBox: marker })
          })
          this.markInfoWindowData = { id: '1', code: _obj.deviceCode }
          this.InfoWindowItemDetails = _obj
        })
        break
      case 3:
        _sheBox(id, _obj[0])
        break
      default:
        _sheBox(id, _obj)
        break
    }
  },
  //列表点击弹出摄像机信息事件
  ClcikListPopup_ItemInfo(i, type) {
    let pa = {
      deviceCode:
        typeof i == 'number' ? this.InfoWindowCameraList[i].deviceCode : i
    }
    console.log('列表点击弹出摄像机信息事件', i, type, pa)
    let fn
    let tag = +type
    console.log('几', tag)
    switch (tag) {
      case 1:
        fn = forestryQueryDeviceForWE
        break
      case 3:
        fn = queryIotDeviceBySite
        break
      case 4:
        fn = forestryQryUavDeviceInfo //无人机
        break
      case 5:
        fn = queryHornDeviceDetail //大喇叭
        break
      // case 7:
      // 	fn = gridKeeper_byid;
      // 	break;
      // case 8:
      // 	fn = getResourceInfo_;
      // 	break;
    }
    console.log('导出列表点击弹出设备信息事件', fn)
    if (fn) {
      fn(pa).then((res) => {
        let _obj = res.data
        console.log('列表点击ietm的详情', _obj)
        if (tag === 1) {
          this._showCameraItemInfo(_obj.deviceCode, 1).then((el) => {
            this.markinfoWindow = CommonMap.infoWindowNew(
              _obj.longitude,
              _obj.latitude,
              el,
              '',
              0,
              -40,
              deviceWindowsId,
              this.mapinstance,
              this.is3Dprivate,
              this.handleMapId,
              () => {
                console.log('弹框加载完成')
              }
            )
            this.markInfoWindowData = { id: '1', code: _obj.deviceCode }
          })
        } else {
          let _sheBox = (id, data) => {
            let el = this._setMaekHtml(id, data, 2)
            console.log('sheBox', deviceWindowsId)
            this.markinfoWindow = CommonMap.infoWindowNew(
              data.longitude,
              data.latitude,
              el,
              '',
              0,
              -40,
              deviceWindowsId,
              this.mapinstance,
              this.is3Dprivate,
              this.handleMapId,
              () => {
                console.log('弹框加载完成')
              }
            )

            this.markInfoWindowData = { id: id, code: data?.deviceCode }

            this.InfoWindowItemDetails = data
            // setTimeout(() => {
            // 	openSucCblock();
            // }, 100)
          }
          if (tag === 3) {
            _sheBox(tag, _obj[0].list[0])
          } else {
            _sheBox(tag, _obj)
          }
        }
      })
    }
  },
  _turnImg(turn) {
    this.deviceImgIndex += turn

    if (this.deviceImgIndex < 0) {
      this.deviceImgIndex = this.deviceImgs.length - 1
    }
    if (this.deviceImgIndex >= this.deviceImgs.length) {
      this.deviceImgIndex = 0
    }
    let domView = document.querySelector('.dotBox .imgList')
    // console.log(domView.getAttribute('data-typeId'),'古树图片')
    if (domView.getAttribute('data-typeId') == 23) {
      document.querySelector(
        '.treesImage_content .imgList'
      ).style.transform = `translateX(-${340 * this.deviceImgIndex}px)`
    } else {
      document.querySelector(
        '.dotBox .imgList'
      ).style.transform = `translateX(-${338 * this.deviceImgIndex}px)`
    }
  },
  //采集记录html
  _getTrapGatherHTml(type, _obj, _info, _arr1) {
    return `<div style="${
      type == 2 ? `transform: scale(${this.scaleY});` : ''
    }" class="dot-box deviceWindowsIdviceWindowsId  attrDotDetailsBox ">
	<i data-id="21" class="closeImg InfoWindowCloseBtn"></i>
	<div class="el-dialog__header ">
	<div  class=" name" style="flex-direction: row;display: flex;">
	<h4  title="${_obj.devName}">诱捕器采集记录详情</h4>
		<div class="headdivider"></div>
	</div>
	</div>
	<div class="dotContent">
	<div class="dotTab">
		<div class="dotTabItem select" data-index="1">基本信息</div>
		<div class="dotTabItem" data-index="2">图片</div>
	</div>
	<div class="leftDotContent">
		<div class="dotInfoBox">
			<div class="dotInfo">
				${(function () {
          return Object.keys(_info)
            .map((key) => {
              return getTrapRecoderHTml(_obj, _info, key)
            })
            .join('')
        })()}
			</div>
		</div>

	</div>
	<div class="rightDotContent short">
		${
      _arr1.length
        ? `<div class="imgListBox">
			<div class="imgList">
				${(function () {
          return _arr1
            .map((item) => {
              return `<div class="imgItem">
							${
                item.type == 1
                  ? `<img src="${item.fileUrl}" />`
                  : `<video src="${item.fileUrl}" controlslist="nodownload noplaybackrate" disablePictureInPicture referrerpolicy='no-referrer' controls></video>`
              }
						</div>`
            })
            .join('')
        })()}
			</div>
		</div>
		<i class="iconfont_tools icon-nav-right turn-btn-popup prev rotateLeft" ></i>
		<i class="iconfont_tools icon-nav-right turn-btn-popup next"></i>
		<i class="iconfont_tools icon-quanpingicon dotBoxFullScreen"></i>`
        : '<i class="c-no-datas">暂无数据</i>'
    }
	</div>

	</div>
	</div>`
  },
  getDetailsHtml(data, type) {
    // 图片部分
    let arrt = []
    // 基本信息部分
    let newsObj = {
      chinese: '中文名',
      alias: '别名',
      latin_name: '拉丁名',
      Science: '科',
      attribute: '属',
      point: '特点',
      profile: '简介'
    }
    let newsData = {}
    // 生长状况
    let info = {
      deviceTypeName: '树龄',
      treeTall: '树高',
      trappingInsects: '树径',
      uptrend: '长势',
      affiliatedUnit: '平均冠幅',
      thing: '东西冠幅',
      location: '南北冠幅',
      aspect: '坡向',
      declivity: '坡度',
      slope: '坡位',
      harvestingTime: '土壤名称',
      density: '土壤紧密度',
      trapNumber: '生长环境'
      // plant: '栽植人',
    }
    let objData = {}
    let imgdata = data.imgUrl
      ? data.imgUrl?.split(',')
      : [
          require('@component-gallery/assets/functionMenu/ancient-tree-default.png')
        ]
    imgdata.forEach((item) => {
      arrt.push({
        fileUrl: item,
        type: '1'
      })
    })
    this.deviceImgs = arrt
    // 基本详情
    newsData = {
      chinese: data.treeSpecies,
      alias: data.treeAlias,
      latin_name: data.treeLatin,
      Science: data.treeSection,
      attribute: data.treeGenus,
      point: data.treeTrait,
      profile: data.treeIntroduce
    }
    // 生长状况
    objData = {
      deviceTypeName: data.treeAge ? data.treeAge + '年' : '', //树龄
      treeTall: data.treeHeight ? data.treeHeight + '米' : '', //树高
      trappingInsects: data.treeBust ? data.treeBust + '厘米' : '', //树径
      uptrend: this.format('forestry_ancient_famous_growth', data.treeGrowth), //长势
      affiliatedUnit: data.averageCrown ? data.averageCrown + '米' : '', //平均冠幅
      thing: data.eastWestCrown ? data.eastWestCrown + '米' : '', //东西冠幅
      location: data.northSouthCrown ? data.northSouthCrown + '米' : '', //南北冠幅
      aspect: data.slopeDirection, //坡向
      declivity: data.slope, //坡度
      slope: data.slopePosition, //坡位
      harvestingTime: data.soilName, //土壤名称
      density: this.format(
        'forestry_ancient_famous_compactness',
        data.soilCompactness
      ), //土壤紧密度
      trapNumber: this.format(
        'forestry_ancient_famous_environment',
        data.growthEnvironment
      ) //生长环境
      // plant:data.planter,//栽植人
    }
    let plantTime = ''
    if (['1', '2', '3'].includes(data.treeGrade) != true) {
      console.log('栽之人')
      info.plant = '栽植人'
      objData.plant = data.planter
      plantTime = `<div class="attritem_box time_box"><span class="attrLabel">栽植时间：</span>
			<span class="attrValue">
				<span>${data.plantingTime ? data.plantingTime : '-'}</span>
			</span>
		</div>`
    }
    let levelLabel = this._getTreeLevelLabel(data)

    return getOldTreeDetailHtml(
      data,
      type,
      plantTime,
      objData,
      newsData,
      arrt,
      info,
      this.scaleY,
      levelLabel
    )
  },
  _getTreeLevelLabel(data) {
    let levelLabel = ''
    if (data.treeGrade == 1) {
      levelLabel = '<span class="">一级古树</span>'
    } else if (data.treeGrade == 2) {
      levelLabel =
        '<span class="" style="background: linear-gradient(90deg, #F56C6C 0%, #DA2727 100%);">二级古树</span>'
    } else if (data.treeGrade == 3) {
      levelLabel =
        '<span class="" style="background: linear-gradient(90deg, #52A1E5 0%, #1F7CCC 100%);">三级古树</span>'
    } else {
      levelLabel =
        '<span class="" style="background: linear-gradient(135deg, #FFA43C 0%, #FF8D0B 100%);">名木</span>'
    }
    return levelLabel
  },
  //古树名木详情弹窗
  _showoldAndFamousTreesWindowById(Info, type = 1) {
    let code = Info.code //treeGrade
    let pa = {
      id: typeof code == 'number' ? this.InfoWindowCameraList[code].id : code
    }
    let isOLdTree = ['1', '2', '3'].includes(Info.treeGrade) ? true : false
    let _fn
    if (isOLdTree) {
      _fn = getAncientTreeDetails
    } else {
      _fn = getPreciousTreeDetails
    }

    console.log('古树名木列表', this.InfoWindowCameraList, Info)
    return new Promise((r) => {
      // 此处调UI时暂时注释
      _fn(pa).then((res) => {
        if (res.code == '200') {
          let data = res.data
          let _str = this.getDetailsHtml(data, type)
          r(_str)
        } else {
          let _str = `<i class="c-no-datas">${res.msg}</i>`
          r(_str)
        }
      })
    })
  },
  //采集记录
  _showTrapGatherInfoById(code, type = 1) {
    return new Promise((r) => {
      let pa = {
        // typeof code == "number" ? this.InfoWindowCameraList[code].deviceCode : code,
        id: typeof code == 'number' ? this.InfoWindowCameraList[code].id : code
      }

      console.log('列表点击下标的参数', pa)
      queryTrapGatherInfoById(pa).then((res) => {
        if (res.code == '200') {
          let _obj = res.data
          this.InfoWindowItemDetails = _obj
          if (_obj.deviceType) {
            let typeid = +_obj.deviceType
            switch (typeid) {
              case 0:
                _obj.deviceTypeName = '传统诱捕器'
                break
              case 1:
                _obj.deviceTypeName = '虫情测报灯'
                break
              default:
                break
            }
          }
          console.log('诱捕器记录详情', _obj)
          let imgdata = res.data.imgUrl?.split(',')
          let vidata = res.data.coverUrl?.split(',')
          let bigvidata = res.data.videoUrl?.split(',')
          // 对视频和图片进行排序
          let _arr1 = [],
            _arr2 = []
          imgdata.forEach((item) => {
            _arr2.push({
              fileUrl: item,
              type: '1'
            })
          })
          bigvidata.forEach((item) => {
            _arr1.push({
              fileUrl: item,
              type: '2'
            })
          })

          _arr1 = [..._arr1, ..._arr2].filter((item) => item.fileUrl)
          this.deviceImgs = _arr1
          this.waterSeal = {
            trappingInsects: res.data.trappingInsects,
            createTime: res.data.createTime
          }
          this.deviceImgIndex = 0

          let _info = {
            deviceName: '设备名称',
            //（传统诱捕器：0 、虫情测报灯：1）
            deviceTypeName: '设备类型',
            trappingInsects: '诱捕虫类',
            affiliatedUnit: '所属单位',
            location: '采集地址',
            deviceCode: '设备编号',
            harvestingTime: '收虫时间',
            trapNumber: '诱捕数量'
          }
          // ${this._selectMarkerCode}是_obj.deviceCode
          let _str = this._getTrapGatherHTml(type, _obj, _info, _arr1)

          r(_str)
        } else {
          let _str = `<i class="c-no-datas">${res.msg}</i>`
          r(_str)
        }
      })
    })
  },
  // 拆解摄像机接口详情
  _getDeviceImageBypa(promise, pa, type, _obj, isfromPeriphery) {
    getDeviceImage(pa).then((imgData) => {
      if (imgData.code == '200') {
        console.log('摄像机图片', imgData)
        // 对视频和图片进行排序
        let _arr1 = [],
          _arr2 = []
        imgData.data.forEach((item) => {
          if (item.toLowerCase().includes('.mp4')) {
            _arr1.push({
              fileUrl: item,
              type: '2'
            })
          } else {
            _arr2.push({
              fileUrl: item,
              type: '1'
            })
          }
        })
        _arr1 = [..._arr1, ..._arr2].filter((item) => item.fileUrl)
        this.deviceImgs = _arr1
        this.deviceImgIndex = 0
        let _info = {
          deviceCode: '摄像机编号',
          modelName: '摄像机厂家',
          location: '摄像机地址',
          height: '摄像机挂高'
        }
        // 判断是否打开了实时视频
        let _isPlay = false
        if (
          this.isPlayingList.find((item) => item.deviceCode == _obj.deviceCode)
        ) {
          _isPlay = true
        }
        let _str = this._getCameradetailHtml(
          type,
          _obj,
          _isPlay,
          isfromPeriphery,
          _arr1,
          _info
        )

        promise(_str)
      } else {
        let _str = `<i class="c-no-datas">${imgData.msg}</i>`
        promise(_str)
      }
    })
  },
  //拆解摄像机
  _getCameradetailHtml(type, _obj, _isPlay, isfromPeriphery, _arr1, _info) {
    return `<div style="${
      type == 2 ? `transform: scale(${this.scaleY});` : ''
    }" class="dotBox deviceWindowsIdviceWindowsId attrDotDetailsBox ">
		<i data-id="1" class="closeImg InfoWindowCloseBtn"></i>
<div class="el-dialog__header ">
  <div  class=" name" style="flex-direction: row;display: flex; width: 335px">
   <h4  title="${_obj.devName}">${_obj.devName}</h4>
   <span class="${_obj.status == 1 ? 'offline' : ''}">${
      _obj.status == 1 ? '离线' : '在线'
    }</span>
   <i  data-iscamera="1" data-isMonitor="${
     _obj.isMonitor
   }" data-collobjtype="5" data-collObjCode="${
      _obj.deviceCode
    }" class="iconfont_tools ${
      _obj.isMonitor == '1' ? 'icon-AR-yishoucang select' : 'icon-weishoucang'
    } dotBoxCollectBtn"></i>
  </div>
	<div class="headdivider"></div>
</div>
<div class="dotContent">
  <div class="dotTab">
	  <div class="dotTabItem select" data-index="1">摄像机信息</div>
	  <div class="dotTabItem" data-index="2">摄像机图片</div>
  </div>
  <div class="leftDotContent">
	  <div class="dotInfoBox">
		  <div class="dotInfo">
			${(function () {
        return Object.keys(_info)
          .map((key) => {
            return getCamerDetailLeftHtml(_obj, _info, key)
          })
          .join('')
      })()}
		  </div>
	  </div>
	  <div class="dotInfoBox style2 ${_obj.channels.length == 1 ? 'short' : ''}">
		  <div class="dotInfo" v-if="${
        _obj.channels && _obj.channels.length > 0 ? true : false
      }">
			  ${(function () {
          return _obj.channels
            .map((item) => {
              return `<div class="attrItem">
						<span class="attrLabel ${
              item.status == 1 ? 'offline' : 'online'
            }">通道名称：</span>
						<span class="attrValue" title="${item.channelName}"><span>${
                item.channelName
              }</span><i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${
                item.channelName
              }"></i></span>
					</div>
					<div class="attrItem">
						<span class="attrLabel">通道编号：</span>
						<span class="attrValue" title="${item.channelCode}"><span>${
                item.channelCode
              }</span><i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${
                item.channelCode
              }"></i></span>
					</div>`
            })
            .join('')
        })()}
		  </div>
	  </div>
  </div>
  <div class="rightDotContent ${_obj.channels.length == 1 ? 'short' : ''}">
	  ${
      _arr1.length
        ? `<div class="imgListBox">
		  <div class="imgList">
			  ${(function () {
          return _arr1
            .map((item) => {
              return getCamerDetailRightHtml(item)
            })
            .join('')
        })()}
		  </div>
	  </div>
	  <i class="iconfont_tools icon-nav-right turn-btn-popup prev rotateLeft" ></i>
	  <i class="iconfont_tools icon-nav-right turn-btn-popup next"></i>
	  <i class="iconfont_tools icon-quanpingicon dotBoxFullScreen"></i>`
        : '<i class="c-no-datas">暂无数据</i>'
    }
  </div>
  <div class="bottomBtns">
	  <div class="border-top-1">
		<i class="iconfont_tools bottomBtnVideo ${
      _isPlay
        ? 'select icon-icon_shishishipin_30_s'
        : 'icon-icon_shishishipin_30_n'
    }" data-id="1" title="实时视频"></i>
		<i class="iconfont_tools ${
      _obj.status == '0'
        ? 'select icon-icon_keshiyu_30_s'
        : 'icon-icon_keshiyu_30_n'
    } bottomBtnView" data-code="${_obj.deviceCode}" data-longitude="${
      _obj.longitude
    }" data-latitude="${
      _obj.latitude
    }" data-isfromPeriphery="${isfromPeriphery}" title="可视域"></i>
		<i class="iconfont_tools icon-icon_kanzheli_30_n bottomBtnLook"  style="pointer-events:auto" data-status="${
      _obj.status
    }" data-islookhere="0" data-typeid="1" data-longitude="${
      _obj.longitude
    }" data-latitude="${_obj.latitude}" title="看这里"></i>
		<i class="iconfont_tools icon-icon_guanlian_20_n bottomBtnEvent" data-code="${
      _obj.deviceCode
    }"  data-id="1" title="关联事件"></i>
		<i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-longitude="${
      _obj.longitude
    }" data-latitude="${_obj.latitude}" data-devicecode="${
      _obj.deviceCode
    }" title="周边分析"></i>
		<i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${
      _obj.location
    }" data-latlon="${_obj.longitude},${_obj.latitude}" title="到这里"></i>
	  </div>
  </div>
</div>
</div>`
  },
  // 显示摄像机详情
  //  //拆解摄像机
  //  _getCameradetailHtml(type, _obj, _isPlay, isfromPeriphery, _arr1, _info) {
  //    return `<div style="${
  //      type == 2 ? `transform: scale(${this.scaleY});` : ''
  //    }" class="dot-box deviceWindowsIdviceWindowsId  attrDotDetailsBox ">
  //		<i data-id="1" class="closeImg InfoWindowCloseBtn"></i>
  //<div class="el-dialog__header ">
  //  <div  class=" name" style="flex-direction: row;display: flex;">
  //   <h4  title="${_obj.devName}">${_obj.devName}</h4>
  //   <span class="${_obj.status == 1 ? 'offline' : ''}">${
  //      _obj.status == 1 ? '离线' : '在线'
  //    }</span>
  //   <i  data-iscamera="1" data-isMonitor="${
  //      _obj.isMonitor
  //    }" data-collobjtype="5" data-collObjCode="${
  //      _obj.deviceCode
  //    }" class="iconfont_tools ${
  //      _obj.isMonitor == '1' ? 'icon-AR-yishoucang select' : 'icon-weishoucang'
  //    } dotBoxCollectBtn"></i>
  //  </div>
  //	<div class="headdivider"></div>
  //</div>
  //<div class="dotContent">
  //  <div class="dotTab">
  //	  <div class="dotTabItem select" data-index="1">摄像机信息</div>
  //	  <div class="dotTabItem" data-index="2">摄像机图片</div>
  //  </div>
  //  <div class="leftDotContent">
  //	  <div class="dotInfoBox">
  //		  <div class="dotInfo">
  //			${(function () {
  //      return Object.keys(_info)
  //        .map((key) => {
  //          return getCamerDetailLeftHtml(_obj, _info, key)
  //        })
  //        .join('')
  //    })()}
  //		  </div>
  //	  </div>
  //	  <div class="dotInfoBox style2 ${_obj.channels.length == 1 ? 'short' : ''}">
  //		  <div class="dotInfo" v-if="${
  //      _obj.channels && _obj.channels.length > 0 ? true : false
  //    }">
  //			  ${(function () {
  //      return _obj.channels
  //        .map((item) => {
  //          return `<div class="attrItem">
  //						<span class="attrLabel ${
  //            item.status == 1 ? 'offline' : 'online'
  //          }">通道名称：</span>
  //						<span class="attrValue" title="${item.channelName}"><span>${
  //            item.channelName
  //          }</span><i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${
  //            item.channelName
  //          }"></i></span>
  //					</div>
  //					<div class="attrItem">
  //						<span class="attrLabel">通道编号：</span>
  //						<span class="attrValue" title="${item.channelCode}"><span>${
  //            item.channelCode
  //          }</span><i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${
  //            item.channelCode
  //          }"></i></span>
  //					</div>`
  //        })
  //        .join('')
  //    })()}
  //		  </div>
  //	  </div>
  //  </div>
  //  <div class="rightDotContent ${_obj.channels.length == 1 ? 'short' : ''}">
  //	  ${
  //      _arr1.length
  //        ? `<div class="imgListBox">
  //		  <div class="imgList">
  //			  ${(function () {
  //          return _arr1
  //            .map((item) => {
  //              return getCamerDetailRightHtml(item)
  //            })
  //            .join('')
  //        })()}
  //		  </div>
  //	  </div>
  //	  <i class="iconfont_tools icon-nav-right turn-btn-popup prev rotateLeft" ></i>
  //	  <i class="iconfont_tools icon-nav-right turn-btn-popup next"></i>
  //	  <i class="iconfont_tools icon-quanpingicon dotBoxFullScreen"></i>`
  //        : '<i class="c-no-datas">暂无数据</i>'
  //    }
  //  </div>
  //  <div class="bottomBtns">
  //	  <div class="border-top-1">
  //		<i class="iconfont_tools bottomBtnVideo ${
  //      _isPlay
  //        ? 'select icon-icon_shishishipin_30_s'
  //        : 'icon-icon_shishishipin_30_n'
  //    }" data-id="1" title="实时视频"></i>
  //		<i class="iconfont_tools ${
  //      _obj.status == '0'
  //        ? 'select icon-icon_keshiyu_30_s'
  //        : 'icon-icon_keshiyu_30_n'
  //    } bottomBtnView" data-code="${_obj.deviceCode}" data-longitude="${
  //      _obj.longitude
  //    }" data-latitude="${
  //      _obj.latitude
  //    }" data-isfromPeriphery="${isfromPeriphery}" title="可视域"></i>
  //		<i class="iconfont_tools icon-icon_kanzheli_30_n bottomBtnLook"  style="pointer-events:auto" data-status="${
  //      _obj.status
  //    }" data-islookhere="0" data-typeid="1" data-longitude="${
  //      _obj.longitude
  //    }" data-latitude="${_obj.latitude}" title="看这里"></i>
  //		<i class="iconfont_tools icon-icon_guanlian_20_n bottomBtnEvent" data-code="${
  //      _obj.deviceCode
  //    }"  data-id="1" title="关联事件"></i>
  //		<i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-longitude="${
  //      _obj.longitude
  //    }" data-latitude="${_obj.latitude}" data-devicecode="${
  //      _obj.deviceCode
  //    }" title="周边分析"></i>
  //		<i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${
  //      _obj.location
  //    }" data-latlon="${_obj.longitude},${_obj.latitude}" title="到这里"></i>
  //	  </div>
  //  </div>
  //</div>
  //</div>`
  //  },
  //  // 显示摄像机详情
  //  i: number为下标，字符串为code
  //  type: 1表示点击列表展示，2表示直接显示
  // isfromPeriphery 是否来自周边分析 '1'否 '2'是
  _showCameraItemInfo(code, type = 1, isfromPeriphery = '1') {
    console.log('是否来自周边分析', isfromPeriphery)
    return new Promise((promise) => {
      let pa = {
        deviceCode:
          //  code
          typeof code == 'number'
            ? this.InfoWindowCameraList[code].deviceCode
            : code
      }
      console.log('列表点击下标的参数', pa)
      // 点击摄像机列表-- 显示点击的可视域--------》
      if (this.InfoWindowCameraList.find((item) => item.deviceStatus == '0')) {
        this.handleCameraListClick(pa)
      }
      forestryQueryDeviceForWE(pa).then((res) => {
        if (res.code == '200') {
          let _obj = res.data
          this.InfoWindowItemDetails = _obj
          console.log('摄像机详情', _obj)
          this.waterSeal = {
            trappingInsects: res.data.devName,
            createTime: res.data.modelName
          }
          this._getDeviceImageBypa(promise, pa, type, _obj, isfromPeriphery)
        } else {
          let _str = `<i class="c-no-datas">${res.msg}</i>`
          promise(_str)
        }
      })
    })
  },
  //  type: 1表示点击列表展示，2表示直接显示
  _setSmalClassDetailInfoWindowsHtml(id, data, type = 1) {
    // if (data.longitude && data.latitude) {
    // 	data.jingweidu = data.longitude + "," + data.latitude;
    // }
    // let deviceInfo = {
    // layerId: detail.layerId,
    // gid:detail.gid,
    // 	type: 22, // 设备类型方便请求设备信息
    // 	code: detail.xiaoBan,// sitecode
    // 	xbmj: detail.xbmj,//面积
    // 	youShiSzName: detail.youShiSzName,//"杨树",//优势树种
    // 	diLeiName: detail.diLeiName,//"苗圃地",//地类name
    // 	longitude: detail.maxx, //"117.36641105400008"经度,
    // 	latitude: detail.maxy//"35.48637204400006",纬度
    // }
    data.deviceName = '小班详情'
    let tempMj = Number(data.xbmj) * 0.0015
    let xbmj = parseFloat(tempMj).toFixed(2)
    data.xbmj = xbmj
    data.xbmj = data.xbmj ? data.xbmj + '(亩)' : ''
    // 点位信息配置项
    let _obj = {
      22: {
        // title: 'deviceName',
        infoObj: {
          code: {
            t: '小班',
            u: ''
          },
          xbmj: {
            t: '小班面积',
            u: ''
          },
          youShiSzName: {
            t: '优势树(灌)种',
            u: ''
          }
        },
        // collObjType: 8,  // 收藏接口对应的type
        icon: [7, 6, 8, 9]
        // titleIcon: 'icon-tongyong-leidatubiao',  // 标题图标
      }
    }
    let configObj = _obj[id]
    data.height = ~~data.height
    console.log('点击锚点1', data, configObj)

    let _that = this
    // <span className="iconfont_tools " style="color: #FFFFFF;font-size: 18px;"></span>
    let locationString = data.address
    let btnEventTitleString = '详细信息'

    // dot-box device-windows-idvice-windows-id attrDotDetailsBox
    // dialogBox dot-box  weichuangwindowdeviceInfoLy device-windows-idvice-windows-id attrDotDetailsBox
    // _setMaekHtml
    // ${type == 1 ? tempListClass : tempClass}"""
    let endstr = `<div style="transform: scale(${this.scaleY})" ref="deviceWindowsId" class="dot-box deviceWindowsIdviceWindowsId attrDotDetailsBox" data-code="${data.code}">
	 <i data-id="${id}" class="closeImg InfoWindowCloseBtn"></i>
	 <div class="el-dialog__header ">
	 <div  class=" name" style="flex-direction: row;display: flex;">
		 <h4  title="${data.deviceName}">${data.deviceName}</h4>
		 `
    endstr += ` <span >${data.diLeiName ? data.diLeiName : ''}</span>`
    endstr += `
	 </div>
	 <div class="headdivider"></div>
	 </div>
	 <div class="dotContent">
		 <div class="leftDotContent">
			 <div class="dotInfoBox">
				 <div class="dotInfo">
					 ${(function () {
             let infoObj = configObj.infoObj
             return Object.keys(infoObj)
               .map((key) => {
                 return getSmalClassWindowsHtml(infoObj, key, data)
               })
               .join('')
           })()}
				 </div>
			 </div>

		 </div>
		 <div class="bottomBtns">
		 <div class="border-top-1">
			 ${setIcon(configObj.icon, data, locationString)}
		 </div>

		 </div>
	 </div>
	</div>`

    function setIcon(arr, data_, locationString_) {
      console.log(data_, '接口')
      let iconArr = {
        6: `<i class="iconfont_tools icon-icon_kanzheli_30_n bottomBtnLook" style="pointer-events:auto" data-typeid="22" data-longitude="${data_.longitude}" data-latitude="${data_.latitude}" title="看这里"></i>`,
        7: `<i class="iconfont_tools icon-icon_xiangxixinxi_30_n bottomSmallClassDetail" data-layer="${data_.layerId}" data-gid="${data_.gid}" data-id="${id}" title="${btnEventTitleString}"></i>`,
        8: `<i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-datainfo=${JSON.stringify(
          data_
        )} data-id="${id}" data-longitude="${data_.longitude}" data-latitude="${
          data_.latitude
        }" title="周边分析"></i>`,
        9: `<i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${locationString_}" data-latlon="${data_.longitude},${data_.latitude}" title="到这里"></i>`
      }
      return arr
        .map((item) => {
          return iconArr[item]
        })
        .join('')
    }

    return endstr
  },
  // 设置点位对应的html
  //  type: 1表示点击列表展示，2表示直接显示
  _setMaekHtml(id, data, type = 1) {
    if (data.longitude && data.latitude) {
      data.jingweidu = data.longitude + ',' + data.latitude
    }
    if (data.deviceType) {
      let typeid = +data.deviceType
      switch (typeid) {
        case 0:
          data.deviceTypeName = '传统诱捕器'
          break
        case 1:
          data.deviceTypeName = '虫情测报灯'
          break
        default:
          break
      }
    }
    // 点位信息配置项
    let _obj = {
      2: {
        // title: 'deviceName',
        infoObj: {
          deviceCode: {
            t: '雷达编号',
            u: ''
          },
          modelName: {
            t: '雷达厂家',
            u: ''
          },
          deviceModelCode: {
            t: '雷达型号',
            u: ''
          },
          location: {
            t: '雷达地址',
            u: ''
          }
        },
        collObjType: 8, // 收藏接口对应的type
        icon: [8, 9],
        titleIcon: 'icon-tongyong-leidatubiao' // 标题图标
      },
      3: {
        infoObj: {
          deviceCode: {
            t: '物联设备编号',
            u: ''
          },
          modelName: {
            t: '物联设备厂家',
            u: ''
          },
          deviceTypeName: {
            t: '物联设备类型',
            u: ''
          },
          location: {
            t: '物联设备地址',
            u: ''
          }
        },
        collObjType: 7,
        icon: [0, 7, 8, 9],
        titleIcon: 'icon-tongyong-wulianshebeitubiao'
      },
      4: {
        infoObj: {
          deviceCode: {
            t: '无人机编号',
            u: ''
          },
          modelName: {
            t: '无人机厂家',
            u: ''
          },
          location: {
            t: '无人机地址',
            u: ''
          },
          height: {
            t: '无人机挂高',
            u: 'm'
          }
        },
        collObjType: 11,
        icon: [2, 4, 3, 8, 9],
        isShowChannel: true,
        titleIcon: 'icon-guotu_wurenji'
      },
      5: {
        infoObj: {
          deviceCode: {
            t: '喇叭编号',
            u: ''
          },
          manufacturerName: {
            t: '喇叭厂家',
            u: ''
          },
          location: {
            t: '喇叭地址',
            u: ''
          },
          height: {
            t: '喇叭挂高',
            u: 'm'
          }
        },
        collObjType: 10,
        icon: [1, 8, 9],
        titleIcon: 'icon-guotu_dalaba'
      },
      7: {
        infoObj: {
          keeperPhoneNumber: {
            t: '电话',
            u: ''
          },
          operatingDuty: {
            t: '职责',
            u: ''
          }
        },
        icon: [4, 8, 9],
        titleIcon: 'icon-nan1' //icon-nv1
      },
      20: {
        infoObj: {
          deviceCode: {
            t: '编号',
            u: ''
          },

          affiliatedUnit: {
            t: '所属单位',
            u: ''
          },
          deviceFactory: {
            t: '厂家',
            u: ''
          },
          deviceModel: {
            t: '型号',
            u: ''
          },
          deviceTypeName: {
            t: '类型',
            u: ''
          },
          deviceAddress: {
            t: '地址',
            u: ''
          },
          jingweidu: {
            t: '经纬度',
            u: ''
          },
          deviceHeight: {
            t: '挂高',
            u: 'm'
          },
          deployerName: {
            t: '布设人',
            u: ''
          },
          deploymentTime: {
            t: '布设时间',
            u: ''
          },
          trapNumber: {
            t: '诱捕数量',
            u: '只'
          }
        },
        icon: [7, 9],
        collObjType: 20,
        titleIcon: 'icon-nan1' //icon-nv1
      },
      21: {
        infoObj: {
          deviceName: {
            t: '设备名称',
            u: ''
          },
          //（传统诱捕器：0 、虫情测报灯：1）
          deviceTypeName: {
            t: '设备类型',
            u: ''
          },
          trappingInsects: {
            t: '诱捕虫类',
            u: ''
          },
          affiliatedUnit: {
            t: '所属单位',
            u: ''
          },
          location: {
            t: '设备地址',
            u: ''
          },
          deviceCode: {
            t: '设备编号',
            u: ''
          },
          harvestingTime: {
            t: '收虫时间',
            u: ''
          },
          trapNumber: {
            t: '诱捕数量',
            u: '只'
          }
        },
        icon: [],
        titleIcon: 'icon-nan1' //icon-nv1
      }
    }
    let configObj = _obj[id]
    data.height = ~~data.height
    console.log('点击锚点1', data, configObj)
    this.InfoWindowItemDetails = data
    this.markInfoWindowData = { id: id, code: data?.deviceCode }

    let _that = this
    // <span className="iconfont_tools " style="color: #FFFFFF;font-size: 18px;"></span>
    console.log(type)
    let tempClass = ''
    let tempListClass = ''
    let locationString = ''
    let btnEventTitleString = ''

    let _isPlay = false
    if (
      _that.isPlayingList.find((item) => item.deviceCode == data.deviceCode)
    ) {
      _isPlay = true
    }

    switch (configObj.collObjType) {
      case 7:
        btnEventTitleString = '关联事件'
        locationString = data.location
        tempClass = 'iotDetailsInfoBox'
        tempListClass = 'iotListDetailsInfoBox'
        console.log('物联')
        break
      case 11:
        btnEventTitleString = '关联事件'
        locationString = data.location
        tempClass = 'uavDetailsInfoBox'
        tempListClass = 'uavListDetailsInfoBox'
        console.log('无人机')
        break
      case 10:
        btnEventTitleString = '关联事件'
        locationString = data.location
        tempClass = 'hornDetailsInfoBox'
        tempListClass = 'hornListDetailsInfoBox'
        console.log('喇叭')
        break
      default:
        btnEventTitleString = '关联采集记录'
        locationString = data.deviceAddress
        tempClass = 'trapDetailsInfoBox'
        tempListClass = 'trapListDetailsInfoBox'
        console.log('诱捕器')
        break
    }

    let endstr = `<div style="${
      type == 2 ? `transform: scale(${this.scaleY});` : ''
    }" ref="deviceWindowsId" class="dot-box deviceWindowsIdviceWindowsId attrDotDetailsBox" data-code="${
      data.deviceCode
    }">
 <i data-id="${id}" class="closeImg InfoWindowCloseBtn"></i>
 <div class="el-dialog__header ">
 <div  class=" name" style="flex-direction: row;display: flex;">
	 <h4  title="${data.deviceName}">${data.deviceName}</h4>
	 `
    endstr += getTrapHeadStatusHtml(id, data, configObj)
    endstr += `
 </div>
 <div class="headdivider"></div>
 </div>
 <div class="dotContent">
	 <div class="leftDotContent">
		 <div class="dotInfoBox">
			 <div class="dotInfo">
				 ${(function () {
           let infoObj = configObj.infoObj
           return Object.keys(infoObj)
             .map((key) => {
               return `<div class="attrItem">
						 <span class="attrLabel label_text">${infoObj[key].t}：</span>
						 <span class="attrValue" title="${data[key]}"><span>${
                 data[key] ? data[key] + (infoObj[key].u || '') : '-'
               }</span>${
                 key == 'deviceCode'
                   ? `<i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${data[key]}"></i>`
                   : ''
               }</span>
					 </div>`
             })
             .join('')
         })()}
			 </div>
		 </div>
		 `
    endstr += getCamerachannelListHTML(
      data,
      configObj,
      locationString,
      btnEventTitleString,
      id,
      _isPlay
    )
    return endstr
  },
  // //资源的
  _setResourceManMaekHtml(id, data, type = 1) {
    data.jingweidu = data.longitude + ',' + data.latitude
    if (data.resourceName.length > 10) {
      data.resourceName = data.resourceName.substring(0, 9) + '...'
    }
    // 点位信息配置项
    let configObj
    if (data.resourceProperty == '1') {
      configObj = {
        infoObj: {
          resourceTypeName: {
            t: '资源类型',
            u: ''
          },
          jingweidu: {
            t: '经纬度',
            u: ''
          },
          addr: {
            t: '详细地址',
            u: ''
          },
          remark: {
            t: '描述',
            u: ''
          }
        },
        icon: [8, 9],
        titleIcon: 'icon-nan1' //icon-nv1
      }
    } else {
      configObj = {
        infoObj: {
          resourceTypeName: {
            t: '资源类型',
            u: ''
          },
          addr: {
            t: '详细地址',
            u: ''
          },
          remark: {
            t: '描述',
            u: ''
          }
        },
        icon: [8, 9],
        titleIcon: 'icon-nan1' //icon-nv1
      }
    }

    data.height = ~~data.height
    console.log('点击锚点2', data, configObj)
    this.InfoWindowItemDetails = data
    let _that = this
    return `<div style="transform: scale(${
      this.scaleY
    });" class="resourceDetailsPopUp dot-box deviceWindowsIdviceWindowsId attrDotDetailsBox" data-code="${
      data.deviceCode
    }">
		<i data-id="${id}" class="closeImg ${
      type == '1' ? '' : 'InfoWindowCloseBtn'
    }" ></i>
		<div class="el-dialog__header ">
		<div  class=" name" style="flex-direction: row;display: flex;">

      <h4 title="${data.resourceName}">${data.resourceName}</h4>
		</div>
		<div class="headdivider"></div>
		</div>
		<div class="dotContent">
			<div class="leftDotContent">
				<div class="dotInfoBox">
					<div class="dotInfo">
						${(function () {
              let infoObj = configObj.infoObj
              return Object.keys(infoObj)
                .map((key) => {
                  return getResource_Html(infoObj, key, data)
                })
                .join('')
            })()}
					</div>
				</div>
			</div>
			<div class="bottomBtns">
			<div class="border-top-1">
				${setIcon(configObj.icon, data)}
			</div>

			</div>
		</div>
	</div>`

    function setIcon(arr, detaildata) {
      let iconArr = {
        8: `<i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-longitude="${detaildata.longitude}" data-latitude="${detaildata.latitude}"  data-id="${id}" data-resourceid="${detaildata.resourceId}" title="周边分析"></i>`,
        9: `<i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${detaildata.addr}" data-latlon="${detaildata.longitude},${detaildata.latitude}" title="到这里"></i>`
      }
      return arr
        .map((item) => {
          return iconArr[item]
        })
        .join('')
    }
  },
  //网格员的
  _setGridManMaekHtml(id, data, type = 1) {
    // 点位信息配置项
    let _obj = {
      7: {
        infoObj: {
          keeperPhoneNumber: {
            t: '电话',
            u: ''
          },
          operatingDuty: {
            t: '职责',
            u: ''
          }
        },
        icon: [5, 8, 9],
        titleIcon: 'icon-nan1' //icon-nv1
      }
    }
    let configObj = _obj[id]
    data.height = ~~data.height
    console.log('点击锚点3', data, configObj)
    this.InfoWindowItemDetails = data
    let _that = this
    // <span className="iconfont_tools " style="color: #FFFFFF;font-size: 18px;"></span>
    let isOffLine = true
    if (data.isLine && data.isLine != 0) {
      isOffLine = false
    }
    let GridManMaekHtmlStr = `<div style="transform: scale(${
      this.scaleY
    });" class="keeperDetailBox dot-box deviceWindowsIdviceWindowsId attrDotDetailsBox" data-code="${
      data.deviceCode
    }">
		<i data-id="${id}" class="closeImg ${
      type == '1' ? '' : 'InfoWindowCloseBtn'
    }" ></i>
		<div class="el-dialog__header ">
		<div  class=" name" style="flex-direction: row;display: flex;">

      <h4 title="${data.keeperName}">${data.keeperName}</h4>
	  `
    data.keeperGender
      ? (GridManMaekHtmlStr += `
			<i class="iconfont_tools  ${
        data.keeperGender === '1' ? 'icon-nv1' : 'icon-nan1'
      } " style="color: #FFFFFF;font-size: 20px;"></i>
			`)
      : ''
    GridManMaekHtmlStr += `
			<span class="keeperTips ${isOffLine ? 'offline' : ''}">${
      isOffLine ? '离线' : '在线'
    }</span>
		</div>
		<div class="headdivider"></div>
		</div>
		<div class="dotContent">
			<div class="leftDotContent">
				<div class="dotInfoBox">
					<div class="dotInfo">
						${(function () {
              let infoObj = configObj.infoObj
              return Object.keys(infoObj)
                .map((key) => {
                  return getGridManMaek_Html(infoObj, key, data)
                })
                .join('')
            })()}
					</div>
				</div>

			</div>
			<div class="bottomBtns">
			<div class="border-top-1">
				${getGridManMaekIcon(configObj.icon, data, id)}
			</div>

			</div>
		</div>
	</div>`

    return GridManMaekHtmlStr
  },
  // 关闭打开可视域
  // 切换可视域
  _switchviewShed(dom, allMarker, map) {
    //设备离线不展示可视域
    let obj = this.InfoWindowItemDetails
    console.log('dom', dom.className)
    if (obj && obj.status != '0') {
      dom.classList.remove('select')
      dom.classList.remove('icon-icon_keshiyu_30_s')
      dom.classList.add('icon-icon_keshiyu_30_n')
      $v.message({ type: 'warning', mess: '离线设备无法查看可视域' })
      return
    }
    let _flag = dom.classList.contains('select')
    // 正在显示可视域，取消显示
    if (/select/.test(dom.className)) {
      _flag = true
    }
    if (this.is3Dprivate) {
      // 3d 待处理
      if (_flag) {
        let devInfo = this._cameraData.find((item) => {
          return item.id == dom.dataset.code
        })
        console.log('44444', this._3DViewshed[dom.dataset.code])
        console.log('44444', dom.dataset.code)
        this._3DViewshed[dom.dataset.code]?.remove()
        this._3DViewshed[dom.dataset.code] = cameraLocationAnalysisNew(
          map,
          devInfo,
          '#F9FF6C'
        )
      } else {
        this._3DViewshed[dom.dataset.code].remove()
      }
    } else {
      this.No3DprivateswitchviewShed(dom, _flag, allMarker)
    }
  },
  No3DprivateswitchviewShed(dom, _flag, allMarker) {
    let _selectDev = (this._cameraData || []).find(
      (dev) => dev.id == dom.dataset.code
    )
    let _d = _selectDev ? _selectDev.distance : this._defaultViewShed.distance
    let _obj = {
      distance: _flag ? _d : 1,
      // distance: 1000,
      isWarning: true,
      heading: _selectDev.heading,
      angle: _selectDev.angle
      // heading:90,
      // angle:90
    }
    console.warn(allMarker)
    if (this.AllMarker['1']) {
      this.AllMarker['1'].setCameraStateById('id', dom.dataset.code, _obj)
    } else if (this.AllMarker['11']) {
      let cid = this.AllMarker['11']._selectedCamera.values_.data.id
      console.log(this.AllMarker['11'].setCameraStateById)
      this.AllMarker['11'].setCameraStateById('id', cid, _obj)
    } else if (ponitInstance && dom.dataset.isfromperiphery == '1') {
      ponitInstance?.setCameraStateById(
        'id',
        this.InfoWindowItemDetails.siteCode,
        _obj
      )
    } else if (ponitInstance && dom.dataset.isfromperiphery == '2') {
      ponitInstance?.setCameraStateById('id', dom.dataset.code, _obj)
    } else {
      console.log('error!')
    }
    ponitInstance = null
  },
  // 收到点的实例
  handleWindowOpenedCBPointIns(pointIns) {
    console.log('deviceInfo.code', pointIns)
    ponitInstance = pointIns
  },
  // 重置恢复初始状态
  EXportBeforeDestroyRemoveData() {
    if (this.markinfoWindow) {
      CommonMap.closeInfoWindowNew(
        deviceWindowsId,
        this.mapinstance,
        this.is3Dprivate,
        () => {
          console.log('切换地图关闭弹窗')
        }
        // ,this._supview
      )
      this.markinfoWindow = null
      this.markInfoWindowData = null
      // 清除周边分析打点选中状态
      this._removeSelectedDevState(14)
    }
    CommonMap.destroyMap(this.handleMapId)
    // CommonMap.restoreVariables(deviceWindowsId);//destroyMap
    // this.markinfoWindow = null;
    // this.markInfoWindowData=null;
    this.InfoWindowCameraList = [] // 地图打点弹窗显示的列表
    this.InfoWindowItemDetails = '' // 地图打点弹窗显示详细信息
    this._alarmLayerArr = {} // 告警图层的打点数据

    this.deviceImgs = []
    this.deviceImgIndex = 0
    // this.AllMarker = {
    // 	'1': '',  // 摄像机
    // 	'2': '',  // 雷达
    // 	'3': '',  // 物联设备
    // 	'4': '',  // 无人机
    // 	'5': '',  // 大喇叭
    // 	'6': '',  // 网格
    // 	'7': '',  // 网格员
    // 	'8': '',  // 资源
    // 	'9': '',  // 告警图层
    // 	'10': '',  // 告警热力图
    // 	'11': '', // 设备树点击设备，生成的单点
    // 	'12': '', // 告警列表点击告警，生成的单点
    // 	'13': '', // 告警详情生成的单点
    // 	'14': '', // 周边分析生成的摄像机单点
    // 	'15': '', // 图层
    // 	'20': '', // 诱捕器
    // 	'21': '', // 诱捕器采集记录
    // }
    ;(this._defaultViewShed = {
      distance: 3000,
      height: '10',
      horizViewRange: '157.79',
      vertiViewRange: '-2.90',
      horizRange: '36.52',
      vertiRange: '27.00',
      visualRange: '3'
    }),
      (this._cameraData = []), // 摄像机数据，用于3d可视域
      (this.handleMapId = ''), // 新增组件逻辑参数 deviceWindowsId:'',
      (this.is3Dprivate = false),
      (this.isHaveWarningList = false), //是否有告警列表
      (this.mapinstance = {}),
      (this._3DViewshed = {}) // 3d可视域对象
    ;(this._triggerEventType = []), // 触发点击事件的设备打点信息
      (this.pointClickHandleTime = null),
      (this.peripheryMarkinfoWindow = null),
      (this._supview = null)
  },
  // 周边分析可视域处理
  handleAroundViewshed(deviceCode) {
    let _item = {
      id: deviceCode,
      deviceCode: deviceCode,
      longitude: +this.InfoWindowItemDetails.longitude,
      latitude: +this.InfoWindowItemDetails.latitude,
      lng: +this.InfoWindowItemDetails.longitude,
      lat: +this.InfoWindowItemDetails.latitude,
      status: '0'
    }
    getDeviceVisibleBySite({
      deviceCodes: [deviceCode]
    }).then((res) => {
      const { code, data } = res
      if (code == '200') {
        // 保存可视域范围
        if (data && data.length) {
          let _info = data[0]
          // 保存可视域范围
          _item.distance =
            Number(_info?.visualRange || this._defaultViewShed.visualRange) *
            1000
          _item.heading = Number(
            _info?.horizViewRange || this._defaultViewShed.horizViewRange
          ) // 可视域方向
          _item.angle = Number(
            _info?.horizRange || this._defaultViewShed.horizRange
          ) // 可视域角度
        } else {
          _item.heading = Number(this._defaultViewShed.horizViewRange)
          _item.angle = Number(this._defaultViewShed.horizRange)
          // _item.distance =
          // Number(_info?.visualRange || this._defaultViewShed.visualRange) *
          // 1000
        }
        _item.isWarning = true
        this._cameraData.push(_item)

        if (this.is3Dprivate) {
          ponitInstance?.remove()
          console.log('666666')
          this._3DViewshed[deviceCode]?.remove()
          this._3DViewshed[deviceCode] = cameraLocationAnalysisNew(
            this.mapinstance,
            _item,
            '#F9FF6C'
          )
        } else {
          // 二维周边分析可视域
          ponitInstance?.setCameraStateById('id', deviceCode, _item)
        }
      }
    })
  },
  setIsPlayingList(val) {
    this.isPlayingList = val
  }
}
