/* eslint-disable no-undef */
// forestry-pc/src/views/bigScreen/sharedcomponents/styledToolbox/components/CommonMap.js
import { getConfigByKey } from '../../funCommon/system/config'
import $ from 'jquery'
import Vue from 'vue'
import CTMapOl from '@ct/ct_map_ol'
// import store from '@/store'
import CommonMap from '../CommonMap'
import {
  addMarker,
  closeInfoWindow,
  initCTMap,
  mapClick,
  openInfoWindow,
  setZoomAndCenter,
  markerPicking,
  showMarkCluster,
  renderPolygon,
  renderGraphic,
  showTextPolygonId,
  setPolygon,
  removeLayer,
  transCoordinate,
  transCoordinates,
  addScaleLine,
  poiAreaQuery,
  analysisVisible,
  cameraLocationAnalysis,
  cameraLocationAnalysis2,
  activeViewShed,
  slopAnalysis,
  renderCesiumPolygon,
  showCesiumText,
  cesiumUVA,
  doPlayCesiumUVA,
  pauseCesiumUVA,
  nextCesiumUVA,
  prevCesiumUVA,
  showCesiumUVA,
  hideCesiumUVA,
  removeCesiumUVA,
  addPathCesiumUVA,
  moveToCesiumUVA,
  highLightArea,
  removeHighLightArea,
  peripheryOpenInfoWindow
} from '../map-ol/CommonCtMapOl'

export const defaultCenters_common = [104.64614, 37.227363]
export const defaultCenter_common = '104.64614, 37.227363'
let idSeq = 100000 // 用于自己生成非重复ID的序列。这个序列简易自增。初始值应当够大，以免和其他的冲突？
const centers = defaultCenters_common
const defaultZoom = 5
const defaultZoom_3d = 4
const mapTypeConst = {
  aMap: 'amap', // 高德
  tMap: 'tmap', // 天地图
  sMap: 'smap', // 超图
  mapbox: 'mapbox'
}
const onlineTypeObj = {
  onLine: 'onLine',
  offline: 'offline'
}
const VAType = {
  point: 2, // 单个点
  cluster: 1 // 点聚合
}
const layerIdStrS = {
  grid: 'layer-grid',
  gridMan: 'layer-gridMan',
  resource: 'layer-resource',
  camera: 'layer-camera',
  bayonetCamera: 'layer-bayonetCamera',
  alarm: 'layer-alarm',
  partWeather: 'layer-partWeather',
  fire: 'layer-fire',
  wind: 'layer-wind',
  bayonetClickCamera: 'click-layer-bayonetCamera'
}

const layerIdStrSNew = {
  grid: 'layer-grid-footer',
  gridMan: 'layer-gridMan-footer',
  resource: 'layer-resource-footer',
  camera: 'layer-camera-footer',
  bayonetCamera: 'layer-bayonetCamera-footer',
  alarm: 'layer-alarm-footer',
  partWeather: 'layer-partWeather-footer',
  fire: 'layer-fire-footer',
  wind: 'layer-wind-footer',
  bayonetClickCamera: 'click-layer-bayonetCamera-footer'
}

export const municipalityList = ['110000', '120000', '310000', '500000'] // 北京市,天津市,上海市,重庆市
let CTBaseLayerType = null
const mapList = {}
const mapInstanceList = {}
const CTMapTypeSObj = {}
const layerGroupsObj = {}
const scaleEntity = {}
const toolBarEntity = {}
const viewableAreasObj = {} // 站址和摄像机的可视域对象,key是站址或摄像机编码
const highlightViewableObj = {}
const autoCompleteEntity = {}
let MouseToolObj = {}
const GeocoderEntity = {}
const layerSObj = {}
const massMarkListSObj = {}
const geosObj = {}
const highlightObj = {}
const infoWindowList = {}
const locationClusterIdList = {}
const mousePositionControlObj = {}
const highlightCodeObj = {}

const { coordinate, control } = CTMapOl
const { format } = coordinate
const { MousePosition } = control
export default class CommonMapTool {
  static getMapTypeConst() {
    return mapTypeConst
  }

  static getVAType() {
    return VAType
  }

  static getCTMapType(mapId) {
    return CommonMap.getCTMapType(mapId)
    // return CTMapTypeSObj[mapId]
  }

  static setCTMapType(CTMapType, mapId) {
    CTMapTypeSObj[mapId] = CTMapType
  }

  static getMapInstance(mapId) {
    return CommonMap.getMapInstance(mapId)
    // return mapInstanceList[mapId]
  }

  static setMapInstance(instance, mapId) {
    mapInstanceList[mapId] = instance
  }

  static getMap(mapId) {
    return CommonMap.getMap(mapId)
    // return mapList[mapId]
  }

  // 新写的获取地图实例方法，这个方法兼容3d，保证有mapId就能返回正确的地图级实例
  static getMapNew(mapId) {
    let map = mapId
    if (typeof mapId === 'string') {
      map = this.getMap(mapId)
      if (this.is3d(mapId)) {
        // 3d下，getMap里面塞的记录是viewer，而不是地图实例本身，应当取这个mapInstance
        map = this.getMapInstance(mapId)
      }
    }

    return map
  }

  static setMap(respMap, mapId) {
    mapList[mapId] = respMap
  }

  static getLayerGroup(mapId) {
    return layerGroupsObj[mapId]
  }

  static setLayerGroup(layer, mapId) {
    layerGroupsObj[mapId] = layer
  }

  static getHighlightViewable(mapId) {
    return highlightViewableObj[mapId]
  }

  static setHighlightViewable(highlightViewable, mapId) {
    highlightViewableObj[mapId] = highlightViewable
  }

  static getLayers(mapId) {
    return layerSObj[mapId] || {}
  }

  static setLayers(layerId, layer, mapId) {
    if (!layerSObj[mapId]) {
      layerSObj[mapId] = {}
    }
    layerSObj[mapId][layerId] = layer
  }

  static getMassMarkList(mapId) {
    return massMarkListSObj[mapId] || {}
  }

  static setMassMarkList(layerId, massMark, mapId) {
    if (!massMarkListSObj[mapId]) {
      massMarkListSObj[mapId] = {}
    }
    massMarkListSObj[mapId][layerId] = massMark
  }

  static getInfoWindow(mapId) {
    return infoWindowList[mapId]
  }

  static setInfoWindow(infoWindow, mapId) {
    infoWindowList[mapId] = infoWindow
  }

  static getLocationClusterId(mapId) {
    return locationClusterIdList[mapId]
  }

  static setLocationClusterId(id, mapId) {
    locationClusterIdList[mapId] = id
  }

  static getGeoEntity(mapId) {
    return geosObj[mapId]
  }

  static getLayerIdStrS() {
    return layerIdStrS
  }

  static getLayerIdStrSNew() {
    return layerIdStrSNew
  }

  static getViewableArea(mapId) {
    return viewableAreasObj[mapId] || {}
  }

  static setViewableAreaById(id, viewshed, mapId) {
    if (!viewableAreasObj[mapId]) {
      viewableAreasObj[mapId] = {}
    }
    viewableAreasObj[mapId][id] = viewshed
  }

  static resetViewableArea(mapId) {
    viewableAreasObj[mapId] = {}
  }

  /**
   * 注销地图清空容器
   */
  static destroyMap(mapId) {
    const map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      if (scaleEntity[mapId]) {
        scaleEntity[mapId].destroy()
        scaleEntity[mapId] = null
      }
      if (map) {
        map.destroy()
      }
    } else {
      if (mousePositionControlObj[mapId]) {
        map.removeControl(mousePositionControlObj[mapId])
        mousePositionControlObj[mapId] = null
      }
      const mapMap = this.getMapInstance(mapId)
      // openlayer销毁地图实例并移除DOM元素
      if (mapMap) {
        mapMap.destroy()
      }
    }

    this.restoreVariables(mapId)
  }

  /**
   * 还原变量
   */
  static restoreVariables(mapId) {
    delete mapList[mapId]
    delete mapInstanceList[mapId]
    delete layerGroupsObj[mapId]
    delete geosObj[mapId]
    delete layerSObj[mapId]
    delete massMarkListSObj[mapId]
    MouseToolObj = {}
    delete viewableAreasObj[mapId]
    delete infoWindowList[mapId]
    delete locationClusterIdList[mapId]
  }

  /**
   * 切换地图重新加载
   * @param mapId
   * @param mapTypeIndex
   * @param successFn
   */
  static changeReloadMap(mapId, mapTypeIndex, successFn) {
    this.getInitMapParam(
      mapTypeIndex,
      () => {
        let zoom
        if (mapTypeIndex < 3) {
          zoom = defaultZoom
        } else {
          zoom = defaultZoom_3d
        }
        this.initCTMap(mapId, centers, mapTypeIndex, zoom, successFn)
      },
      mapId
    )
  }

  /**
   * 获取加载地图需要参数地图类型和在线离线
   */
  static getInitMapParam(mapTypeIndex, successFn, mapId) {
    if (mapTypeIndex < 3) {
      this.setCTMapType(mapTypeConst.aMap, mapId) // 默认高德
      CTBaseLayerType = onlineTypeObj.onLine // 默认在线
      this.getMapTypeByKey((resp) => {
        // resp.configValue = '2'
        if (resp.configValue === '2') {
          // 天地图
          this.setCTMapType(mapTypeConst.tMap, mapId)
        }
        if (resp.configValue === '1') {
          // 离线地图mapbox
          CTBaseLayerType = onlineTypeObj.offline
          this.setCTMapType(mapTypeConst.mapbox, mapId)
        }
        successFn()
      })
    } else {
      this.setCTMapType(mapTypeConst.sMap, mapId) // 默认高德
      CTBaseLayerType = null
      successFn()
    }
  }

  /**
   *  获取初始化地图类型
   */
  static setInitMapInfo(map, mapContainerId, is3d) {
    this.setMap(map, mapContainerId)
    if (is3d) {
      this.setCTMapType(mapTypeConst.sMap, mapContainerId)
    } else {
      this.setCTMapType(mapTypeConst.tMap, mapContainerId)
    }
  }
  /**
   *  根据参数查地图字典值获取地图在线离线和地图类型
   */
  static getMapTypeByKey(successFn) {
    getConfigByKey('global_map_type').then((response) => {
      successFn(response.data)
    })
  }

  /**
   * 初始化路网图层
   */
  static initRoadNetLayer(mapId) {
    const map = this.getMap(mapId)
    map.showInitLayer()
    const layerG = this.getLayerGroup(mapId)
    if (layerG) {
      layerG.hide()
      return false
    }
  }

  /**
   * 初始化卫星图层
   */
  static initSatelliteLayer(mapId) {
    const map = this.getMap(mapId)
    map.hideInitLayer()
    const layerG = this.getLayerGroup(mapId)
    if (layerG) {
      layerG.show()
      return false
    }
    const mapInstance = this.getMapInstance(mapId)
    const satellite = mapInstance.Satellite({
      zIndex: -1
    })

    const layer = mapInstance.LayerGroup({ layers: [satellite] })
    this.setLayerGroup(layer, mapId)
    layer.setMap({ map: map })
    layer.hide()
    layer.show()
  }

  /**
   * 三维图层类  TerrainProvider三维地形图层
   */
  static initTerrainProvider(mapId) {
    const map = this.getMap(mapId)
    const mapInstance = this.getMapInstance(mapId)
    if (map) {
      CTMapOl.thrdime.imagerylayercontrol.removeAll(map, true)
    }
    map.changeTile('satellite')
  }

  /**
   * 三维图层 二维地形图
   */
  static initSTileLayer(mapId) {
    const map = this.getMap(mapId)
    const mapInstance = this.getMapInstance(mapId)
    if (map) {
      CTMapOl.thrdime.imagerylayercontrol.removeAll(map, true)
    }
    map.changeTile('heightmap')
  }

  /**
   * 默认初始化加载地图
   */
  static initDefaultMap(mapId, mapTypeIndex, smallMapFlag, successFn) {
    this.getInitMapParam(
      mapTypeIndex,
      () => {
        let zoom
        if (mapTypeIndex < 3) {
          zoom = defaultZoom
        } else {
          zoom = defaultZoom_3d
        }
        this.initCTMap(mapId, centers, mapTypeIndex, zoom, successFn)
      },
      mapId
    )
  }

  /**
   * 默认初始化加载地图、可传中心点及zoom级别
   */
  static initCTMapOl(mapId, mapTypeIndex, initCenter, initZoom, successFn) {
    this.getInitMapParam(
      mapTypeIndex,
      () => {
        let zoom = initZoom
        if (!zoom) {
          if (mapTypeIndex < 3) {
            zoom = defaultZoom
          } else {
            zoom = defaultZoom_3d
          }
        }
        if (!initCenter) {
          initCenter = centers
        }
        this.initCTMap(mapId, initCenter, mapTypeIndex, zoom, successFn)
      },
      mapId
    )
  }

  static initCTMap(mapId, center, mapTypeIndex, zoom, successFn) {
    const CTMapType = this.getCTMapType(mapId)
    this.restoreVariables(mapId)

    if (CTMapType === 'smap') {
      // window.CESIUM_BASE_URL = '/Cesium';
      const options = {
        domId: mapId,
        server: 'tdt',
        tile: mapTypeIndex === 3 ? 'satellite' : 'heightmap', // 3D、2D
        center: center,
        zoom: zoom,
        minZoom: 4,
        maxZoom: 18
      }

      try {
        CTMapOl.loadCesium(options, (map) => {
          const viewer = map._viewer
          this.setMap(viewer, mapId)
          this.setMapInstance(map, mapId)
          // this.loadMapLayer(viewer, mapId);
          // this.initMapSTool(mapId);
          this.executeFunction(successFn, viewer, CTMapType, map)
        })
      } catch (e) {
        console.log('============================', e)
      }
    } else {
      const { mapMap, map } = initCTMap(mapId, center, mapTypeIndex, zoom)
      this.setMap(map, mapId)
      this.setMapInstance(mapMap, mapId)
      // addScaleLine(map, 'dp-scaleLine', 88);//添加比例尺
      this.executeFunction(successFn, map, CTMapType, mapMap)
    }
  }

  static loadMapLayer(viewer, mapId) {
    CTMapOl.thrdime.imagerylayercontrol.removeAll(viewer, true)
    CTMapOl.thrdime.imagerylayercontrol.addImageryProvider(
      viewer,
      CTMapOl.thrdime.imagerylayercontrol.gettdtImagery('img', 'img_w')
    )
    CTMapOl.thrdime.imagerylayercontrol.addImageryProvider(
      viewer,
      CTMapOl.thrdime.imagerylayercontrol.gettdtImagery('cia', 'cia_w')
    )
  }

  static initMapSTool(mapId) {
    const map = this.getMap(mapId)
    const mapInstance = this.getMapInstance(mapId)
    if (scaleEntity[mapId]) {
      scaleEntity[mapId].destroy()
      scaleEntity[mapId] = null
    }
    // 比例尺
    scaleEntity[mapId] = mapInstance.SScale({
      viewer: map.Viewer,
      bottom: '70px',
      right: '20px'
    })
  }

  /**
   * 摄像机的可视域范围
   * distance可视距离
   * type 同顶部常量VAType
   */
  static initViewableArea(params, mapId, successFn) {
    const map = this.getMap(mapId)
    const mapInstance = this.getMapInstance(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let {
      longitude,
      latitude,
      distance,
      direction,
      deviceCode,
      type,
      color,
      categoryCode
    } = params
    color = color || '#3AA0FF'

    const viewableArea = this.getViewableArea(mapId)

    if (
      viewableArea[`${deviceCode}_${VAType.point}`] ||
      viewableArea[`${deviceCode}_${VAType.cluster}`]
    ) {
      console.log(`已经显示了${deviceCode}该设备的可视域`)
      return false
    }
    if (CTMapType === mapTypeConst.sMap) {
      const param = {
        viewer: map.Viewer,
        lng: longitude,
        lat: latitude,
        horizontalView: 50,
        distance: distance,
        direction: direction,
        outColor: color,
        outOpacity: 0.3, // 新增参数，外部填充色的透明度
        innerColor: color,
        innerOpacity: 0.7,
        innerlineColor: color,
        innerlineOpacity: 0.3,
        outlineColor: color, // 新增参数，外部线颜色
        outlineWidth: 2, // 新增参数，外部线宽度
        outlineOpacity: 0.2 // 新增参数，外部线的透明度，不可设为0 可设为一个很小的数值，比如0.001
      }
      if (+categoryCode === 2) {
        param.outlineOpacity = 0.0001 // 0不生效
        param.outOpacity = 0.0001
        param.innerlineOpacity = 0.7
        param.innerOpacity = 0.7
        param.horizontalView = 180.01
      }
      const viewshed = mapInstance.SViewShed2D(param)

      this.setViewableAreaById(`${deviceCode}_${type}`, viewshed, mapId)
      this.executeFunction(successFn, viewshed)
    } else {
      const circleOption = {
        center: { lng: longitude, lat: latitude },
        radius: distance * 1000,
        strokeColor: color,
        strokeWeight: 1,
        strokeOpacity: 0.3,
        fillOpacity: 0.3,
        fillColor: color,
        zIndex: 50,
        bubble: true
      }
      const shapeOption = {
        horizontalView: 50,
        distance: distance,
        direction: direction,
        strokeColor: color,
        strokeWeight: 1,
        strokeOpacity: 0.7,
        fillOpacity: 0.7,
        fillColor: color,
        zIndex: 55,
        bubble: true
      }
      if (+categoryCode === 2) {
        circleOption.strokeOpacity = 0
        circleOption.fillOpacity = 0
        shapeOption.strokeOpacity = 0.7
        shapeOption.fillOpacity = 0.7
        shapeOption.horizontalView = 180.01
      }
      const viewshed = mapInstance.ViewShed({ circleOption, shapeOption })
      map.add({ features: viewshed })
      this.setViewableAreaById(`${deviceCode}_${type}`, viewshed, mapId)
      this.executeFunction(successFn, viewshed)
    }
  }

  /**
   * 转动摄像机可视范围
   * @param deviceCode
   * @param direction
   * @param mapId
   */
  static updateViewableArea(deviceCode, direction, mapId) {
    const viewableArea = this.getViewableArea(mapId)
    if (viewableArea[`${deviceCode}_${VAType.cluster}`]) {
      viewableArea[`${deviceCode}_${VAType.cluster}`].update2DViewShed({
        direction: direction
      })
    }
    if (viewableArea[`${deviceCode}_${VAType.point}`]) {
      viewableArea[`${deviceCode}_${VAType.point}`].update2DViewShed({
        direction: direction
      })
    }
  }

  static executeFunction(func, param, param2, param3) {
    if (func) {
      if (param != null) {
        func(param, param2, param3)
      } else {
        func()
      }
    }
  }

  /**
   * 移除所有摄像机可视范围
   * @param type 1为点聚合, 2为单个点 0为所有
   * @param mapId
   */
  static removeAllViewShed(type, mapId) {
    const viewableArea = this.getViewableArea(mapId)
    const list = Object.entries(viewableArea)
    if (!(list && list.length > 0)) {
      return false
    }
    const deleteList = []
    const ids = []
    for (const item of list) {
      if (item[1] == null) {
        continue
      }
      if (type === 0) {
        deleteList.push(item[0])
        ids.push(item[1])
      } else {
        if (item[0].split('_')[1] === type.toString()) {
          deleteList.push(item[0])
          ids.push(item[1])
        }
      }
    }
    this.removeViewSheds(ids, mapId)
    if (type === 0) {
      this.resetViewableArea(mapId)
    } else {
      for (const id of deleteList) {
        delete viewableArea[id]
      }
    }
  }

  /**
   * 移除摄像机可视范围
   */
  static clearViewableArea(cameraId, mapId) {
    const CTMapType = this.getCTMapType(mapId)
    const viewableArea = this.getViewableArea(mapId)
    const list = Object.entries(viewableArea)
    if (!(list && list.length > 0)) {
      return false
    }
    for (const listElement of list) {
      if (listElement[0].split('_')[0] === cameraId) {
        if (CTMapType === mapTypeConst.sMap) {
          this.viewerOperate(listElement[1], 'remove')
        } else {
          this.mapRemoveViewer(listElement[1], mapId)
        }
        delete viewableArea[listElement[0]]
      }
    }
  }

  /**
   * 移除指定id数组的可视范围
   * @param ids
   * @param mapId
   */
  static removeViewSheds(ids, mapId) {
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      for (const entity of ids) {
        this.viewerOperate(entity, 'remove')
      }
    } else {
      this.mapRemoveViewers(ids, mapId)
    }
  }

  /**
   * 通用的map操作view方法,例如map.remove({ features: viewshed }) features是对象
   */
  static mapRemoveViewer(entity, mapId) {
    const map = this.getMap(mapId)
    if (entity) {
      map.remove({ features: entity })
    }
  }

  /**
   * 通用的批量map操作view方法,例如map.remove([{ features: viewshed }]) features是对象
   */
  static mapRemoveViewers(ids, mapId) {
    const map = this.getMap(mapId)
    if (ids && ids.length > 0) {
      const features = []
      for (const id of ids) {
        features.push(id)
      }
      map.remove({ features: features, peremptory: true })
    }
  }

  /**
   * 通用的地图实例化子方法viewer的xx方法无参数,从地图上移除
   */
  static viewerOperate(entity, methodName) {
    if (entity) {
      entity[methodName]()
    }
  }

  /**
   * 获取当前地图层级
   */
  static getZoom(successFn, mapId) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let zoom
    if (CTMapType === mapTypeConst.sMap) {
      zoom = CTMapOl.thrdime.cameracontrol.getZoom(map)
    } else {
      zoom = map.getView().getZoom()
    }
    console.log('当前地图层级', zoom, map.getCenter())
    this.executeFunction(successFn, zoom)
  }

  static addZoom(mapId) {
    const map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      CTMapOl.thrdime.cameracontrol.setZoom(
        map,
        CTMapOl.thrdime.cameracontrol.getZoom(map) + 1
      )
    } else {
      CTMapOl.api.fixZoomin(map)
    }
  }
  static subZoom(mapId) {
    const map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      CTMapOl.thrdime.cameracontrol.setZoom(
        map,
        CTMapOl.thrdime.cameracontrol.getZoom(map) - 1
      )
    } else {
      CTMapOl.api.fixZoomout(map)
    }
  }
  static setZoom(zoomNum, mapId) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      CTMapOl.thrdime.cameracontrol.setZoom(map, zoomNum)
    } else {
      CTMapOl.api.setZoom(map, zoomNum)
    }
  }
  static map3dgetZoomLevel(mapintance, is3dmap) {
    const map = mapintance
    // let CTMapType = getCTMapType(mapId);
    if (is3dmap) {
      return CTMapOl.thrdime.cameracontrol.getZoom(map)
    } else {
      return map.getView().getZoom()
    }
  }

  static getZoomLevel(mapId) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      return CTMapOl.thrdime.cameracontrol.getZoom(map)
    } else {
      return map.getView().getZoom()
    }
  }

  /**
   * 还原可视域颜色
   */
  static resetViewableColor(mapId, successFn) {
    let highlightViewable = this.getHighlightViewable(mapId)
    if (highlightViewable) {
      this.updateViewableColor(
        {
          deviceCode: highlightViewable
        },
        () => {
          highlightViewable = null
          this.executeFunction(successFn)
        },
        mapId
      )
    }
  }

  /**
   * 高亮可视域
   * @param deviceCode 设备编码
   * flag:不存在可视域时是否新增
   * @param mapId
   */
  static highlightViewableColor(deviceCode, mapId) {
    if (deviceCode) {
      setTimeout(() => {
        this.resetViewableColor(mapId)
        // 高亮当前设备颜色
        this.highlightViewableColorAwait(
          deviceCode,
          (resp) => {
            this.setHighlightViewable(resp, mapId)
          },
          mapId
        )
      })
    }
  }

  static highlightViewableColorAwait(deviceCode, successFn, mapId) {
    this.updateViewableColor(
      {
        deviceCode: deviceCode,
        color: '#FB913C'
      },
      (resp) => {
        if (!resp) {
          // 可视域还没生成
          setTimeout(() => {
            this.highlightViewableColorAwait(deviceCode, successFn, mapId)
          }, 100)
        } else {
          this.executeFunction(successFn, resp)
        }
      },
      mapId
    )
  }

  /**
   * 更新可视域颜色
   */
  static updateViewableColor(params, successFn, mapId) {
    const CTMapType = this.getCTMapType(mapId)
    let { deviceCode, color } = params
    color = color || '#3AA0FF'
    params.color = color

    const viewshed = this.getViewableAreaObjByDeviceCode(deviceCode, mapId)
    if (viewshed == null) {
      // 没有显示的可视域
      this.executeFunction(successFn, null)
      return false
    }
    if (CTMapType === mapTypeConst.sMap) {
      const param = {
        outColor: color,
        innerColor: color,
        innerlineColor: color,
        outlineColor: color // 新增参数，外部线颜色
      }
      viewshed.setOptions(param)
    } else {
      const circleOption = {
        strokeColor: color,
        fillColor: color
      }
      const shapeOption = {
        strokeColor: color,
        fillColor: color
      }
      viewshed.setOptions({
        circleOption,
        shapeOption
      })
    }

    this.executeFunction(successFn, deviceCode)
  }

  static getViewableAreaObjByDeviceCode(deviceCode, mapId) {
    const viewableArea = this.getViewableArea(mapId)
    let viewableAreaObj
    if (viewableArea[`${deviceCode}_${VAType.point}`]) {
      viewableAreaObj = viewableArea[`${deviceCode}_${VAType.point}`]
    }
    if (viewableArea[`${deviceCode}_${VAType.cluster}`]) {
      viewableAreaObj = viewableArea[`${deviceCode}_${VAType.cluster}`]
    }
    return viewableAreaObj
  }

  /**
   * 监听地图层级改变
   */
  static watchZoomChange(successFn, mapId) {
    const map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      CTMapOl.thrdime.cameracontrol.addmoveEndevent(map, () => {
        const zoom = CTMapOl.thrdime.cameracontrol.getZoom(map)
        if (zoom) {
          this.executeFunction(successFn, zoom)
        }
      })
    } else {
      CTMapOl.api.onViewChange(map, (e) => {
        if (e) {
          this.executeFunction(successFn, e.zoomNum)
        }
      })
    }
  }

  /**
   * 监听获取地图层级
   */
  static watchAndGetZoom(successFn, mapId) {
    this.executeFunction(successFn, this.getZoomLevel(mapId))
    this.watchZoomChange((zoom) => {
      this.executeFunction(successFn, zoom)
    }, mapId)
  }

  static mapClick(mapId, successFn) {
    let map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      map = this.getMapInstance(mapId)
    }
    // if (this.is3d(mapId)) {
    //   //坐标拾取
    //   CommonMapTool.pickMapCoor('mousemove',({lng,lat,height}) => {
    //     this.lng = (lng).toFixed(6);
    //     this.lat = (lat).toFixed(6);
    //     if(height != null){
    //       this.height = height===-999?'':height;
    //     }
    //     successFn({lng, lat, height});
    //   }, mapId, 5);
    // } else {
    // 检测鼠标点击事件
    mapClick(map, this.is3d(mapId), successFn)
    // }
  }

  /**
   * 当前是否是三维地图
   */
  static is3d(mapId) {
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType != null) {
      return CTMapType === mapTypeConst.sMap
    } else {
      setTimeout(() => {
        this.is3d(mapId)
      }, 100)
    }
  }

  /**
   * 初始化地图查询
   */
  static initAutoComplete(mapId) {
    const mapInstance = this.getMapInstance(mapId)
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      autoCompleteEntity[mapId] = mapInstance.SAutoComplete()
    } else {
      autoCompleteEntity[mapId] = mapInstance.AutoComplete()
    }
    return autoCompleteEntity[mapId]
  }

  /**
   * 地图查询(搜索框输入关键字查询）
   * @param keyword
   * @param fn
   */
  static autoComplete(keyword, fn, mapId) {
    if (!autoCompleteEntity[mapId]) {
      this.initAutoComplete(mapId)
    }
    autoCompleteEntity[mapId]
      .searchPoiByAddress({ address: keyword })
      .then((resp) => {
        const arr = Object.values(resp)
        this.executeFunction(fn, arr)
      })
  }

  /**
   * 点聚合
   * clusterImgItem {clusterImg,clusterImgWidth,clusterImgHeight,clusterOffset}
   * dataList 格式 [[lng,lat,id],[lng,lat,id]]
   */
  static showMarkCluster(
    layerId,
    dataList,
    attrObj,
    iconObj,
    clusterImgItem,
    successFn,
    mapId
  ) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    const clusterMaxZoom = clusterImgItem.clusterMaxZoom
    // 数据处理成方法要的格式
    const list = this.formatClusterList(dataList, attrObj, iconObj, mapId)
    // 显示数据
    if (CTMapType === mapTypeConst.sMap) {
      const params = {
        map,
        dataOptions: list,
        MarkerClusterOptions: {
          clusterId: layerId,
          gridSize: 80, // 聚合网格像素大小
          offsetBottom: true,
          sourceType: layerId,
          clickBig: false,
          maxZoom: 10,
          zIndex: clusterImgItem.zIndex || 0
        }
      }
      if (clusterMaxZoom != null) {
        params.MarkerClusterOptions.clusterMaxZoom = clusterMaxZoom
      }
      const textOffset = [0, 8]
      if (clusterImgItem) {
        params.MarkerClusterOptions.styles = [
          {
            url: clusterImgItem.clusterImg,
            size: [
              clusterImgItem.clusterImgWidth,
              clusterImgItem.clusterImgHeight
            ],
            textColor: 'white',
            offset: clusterImgItem.clusterOffset,
            textSize: 14,
            textOffset: textOffset
          }
        ]
      }
      console.log('点聚合params', params)
      const cluster = new CTMapOl.cesiumComponent.MarkerCluster(map, params)
      if (iconObj.clickFn) {
        // CommonMapTool.clusterMarkerClick(cluster, layerId, iconObj.clickFn);
        cluster.on('markerclick', (resp) => {
          console.log('markerclick', resp)
          this.setZoom12(resp.lnglat[0], resp.lnglat[1], mapId)
          iconObj.clickFn(resp.lnglat[2])
        })
      }
      this.setLayers(layerId, cluster, mapId)
      this.executeFunction(successFn, cluster)
    } else {
      showMarkCluster(
        map,
        {
          list,
          clickFn: iconObj.clickFn,
          clusterImgItem: clusterImgItem
        },
        null,
        null,
        (cluster) => {
          this.setLayers(layerId, cluster, mapId)
          this.executeFunction(successFn, cluster)
        }
      )
    }
  }

  /**
   * 点聚合数据格式化
   */
  static formatClusterList(list, attrObj, iconObj, mapId) {
    const { longitudeAttr, latitudeAttr, idAttr, statusAttr } = attrObj
    const { imgPath, pointImgWidth, pointImgHeight, iconOffset } = iconObj
    const returnList = []
    // 仅完全具有经纬度和ID的数据才列入处理
    const filteredList = list.filter(
      (item) => item[longitudeAttr] && item[latitudeAttr] && item[idAttr]
    )
    for (const item of filteredList) {
      const longitude = item[longitudeAttr]
      const latitude = item[latitudeAttr]
      const status = item[statusAttr] ? `,${item[statusAttr]}` : ''
      const id = `${item[idAttr]}${status}`

      const icon = item[attrObj.iconAttr] || imgPath
      const clickIcon = item[attrObj.clickIconAttr] || icon
      const outerNestIcon = item[attrObj.childIconAttr]
      let param
      const CTMapType = this.getCTMapType(mapId)
      if (CTMapType === mapTypeConst.sMap) {
        // 三维
        param = {
          weight: 8,
          icon: icon,
          iconSize: item.iconSize,
          offset: item.offset,
          iconOffset: iconOffset,
          clickIcon: clickIcon,
          clickBig: false
        }
        param.clickable = attrObj.clickable ?? undefined
        param.id = id
        param.lnglat = [Number(longitude), Number(latitude)]
        if (outerNestIcon) {
          param.horizontalOrigin = Cesium.HorizontalOrigin.CENTER
          param.verticalOrigin = Cesium.VerticalOrigin.BOTTOM
          param.child = {
            icon: outerNestIcon,
            iconSize: [15, 15],
            offset: [0, 0]
          }
          param.clickChild = {
            icon: outerNestIcon,
            iconSize: [15, 15],
            offset: [0, 0]
          }
        }
      } else {
        param = {
          id,
          longitude: Number(longitude),
          latitude: Number(latitude),
          iconSize: [pointImgWidth, pointImgHeight],
          icon: icon,
          clickIcon: clickIcon,
          offset: iconOffset,
          outerNestIcon
        }
      }
      returnList.push(param)
    }
    return returnList
  }

  /**
   * 移除点聚合
   * @param layerId 图层id
   * @param mapId
   */
  static removeMarkCluster(layerId, mapId) {
    const layer = this.getLayers(mapId)
    try {
      if (layer[layerId]) {
        layer[layerId].remove()
        this.setLayers(layerId, null, mapId)
      }
    } catch (e) {
      // 防止removeMarkCluster报错
      console.log('removeMarkCluster报错', e)
    }
  }

  static restoreMarkCluster(layerId, mapId) {
    const layer = this.getLayers(mapId)
    if (layer[layerId]) {
      layer[layerId].restore()
    }
  }

  static restoreMass(layerId, mapId) {
    const massMarkList = this.getMassMarkList(mapId)
    if (massMarkList[layerId]) {
      massMarkList[layerId].restore()
    }
  }

  /**
   * 点聚合点击点(需要在点聚合的成功回调里调用)
   */
  static clusterMarkerClick(cluster, layerId, successFn) {
    cluster.on('markerclick', (resp) => {
      if (layerId === resp.clusterId) {
        this.executeFunction(successFn, resp.lnglat[2])
      }
    })
  }

  /**
   * 海量点 点击点(需要在海量点的成功回调里调用)
   */
  static massMarkClick(massMark, successFn) {
    massMark.on('click', (resp) => {
      this.executeFunction(successFn, resp)
    })
  }

  /**
   * 获取当前屏幕可见的摄像头id
   */
  static getCameraPoint(siteDeviceList, successFn, mapId) {
    setTimeout(() => {
      const map = this.getMap(mapId)
      const resp = map.getViewMarkers()
      const list = this.handleReturnIds(resp, siteDeviceList)
      this.executeFunction(successFn, list)
    })
  }

  /**
   * 处理返回的数据
   */
  static handleReturnIds(resp, siteDeviceList) {
    const ids = resp.ids
    const list = []
    for (const item of ids) {
      if (item.sourceType === 'layer-camera' && siteDeviceList[item.id]) {
        list.push(...siteDeviceList[item.id])
      }
    }
    return list
  }

  /**
   * 显示海量点
   *  layerId 图层id
   *  list
   *  attrObj '{longitudeAttr ,latitudeAttr,idAttr,statusAttr,iconAttr}'
   *  attrObj {longitudeAttr 经度字段名,latitudeAttr纬度字段名,idAttr:id字段名,statusAttr状态字段名(非必填),iconAttr图标字段名(资源用)}
   *  imgItem '{imgPath, imgWidth, imgHeight, iconOffset}'
   */
  /**
   * 显示海量点
   *  layerId 图层id
   *  list
   *  attrObj '{longitudeAttr ,latitudeAttr,idAttr,statusAttr,iconAttr}'
   *  attrObj {longitudeAttr 经度字段名,latitudeAttr纬度字段名,idAttr:id字段名,statusAttr状态字段名(非必填),iconAttr图标字段名(资源用)}
   *  imgItem '{imgPath, imgWidth, imgHeight, iconOffset}'
   */
  static showMassMark(layerId, list, attrObj, iconObj, successFn, mapId) {
    const mapInstance = this.getMapInstance(mapId)
    const CTMapType = this.getCTMapType(mapId)
    const { imgWidth, imgHeight } = iconObj
    const { points, clickOption } = this.formatMassMarkList(
      list,
      attrObj,
      iconObj
    )
    let params
    let massMark
    if (CTMapType === mapTypeConst.sMap) {
      params = {
        layerId: layerId,
        points: points,
        width: imgWidth,
        height: imgHeight,
        clickOption: clickOption
      }
      massMark = mapInstance.SPoints(params)
    } else {
      params = {
        position: points,
        zoom: 11, // 层级控制显隐
        iconSize: [imgWidth, imgHeight],
        clickBig: false,
        clickOption: clickOption
      }
      massMark = mapInstance.Markers(params)
    }
    this.setMassMarkList(layerId, massMark, mapId)
    this.viewerSetOrAddToMap(massMark, mapId)
    this.executeFunction(successFn, massMark)
  }

  /**
   * 通用的地图实例化子方法viewer显示到地图上
   * 二维是setMap,三维是addTo
   */
  static viewerSetOrAddToMap(viewer, mapId) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      viewer.addTo({ viewer: map })
    } else {
      viewer.setMap({ map })
    }
  }

  /**
   * 移除海量点
   * @param layerId 图层id
   * @param mapId
   */
  static removeMassMark(layerId, mapId) {
    const massMarkList = this.getMassMarkList(mapId)
    try {
      if (massMarkList[layerId]) {
        massMarkList[layerId].remove()
        this.setMassMarkList(layerId, null, mapId)
      }
    } catch (e) {
      // 防止removeMassMark报错
      console.log('removeMassMark报错', e)
    }
  }

  /**
   * 点聚合数据格式化
   * attrObj {longitudeAttr 经度字段名,latitudeAttr纬度字段名,idAttr:id字段名,statusAttr状态字段名(非必填),iconAttr图标字段名(资源用)}
   */
  static formatMassMarkList(list, attrObj, iconObj) {
    const { imgPath, iconOffset } = iconObj
    const points = []
    const clickOption = []
    for (const item of list) {
      const longitude = item[attrObj.longitudeAttr]
      const latitude = item[attrObj.latitudeAttr]
      const id = item[attrObj.idAttr]
      const status = item[attrObj.statusAttr]
      const idStr = attrObj.statusAttr ? `${id},${status}` : id

      if (!(longitude && latitude && id)) {
        continue
      }

      const icon =
        attrObj.iconAttr != null ? item[attrObj.iconAttr] || imgPath : imgPath
      const clickIcon =
        attrObj.clickIconAttr != null ? item[attrObj.clickIconAttr] : icon
      const offset = iconOffset ?? item.iconOffset
      const param = [`${longitude},${latitude}`, idStr, icon, offset]
      points.push(param)
      clickOption.push({
        icon: clickIcon,
        big: false
      })
    }
    return { points, clickOption }
  }

  static locationTo(lng, lat, height, mapId) {
    const map = this.getMap(mapId)
    const mapInstance = this.getMapInstance(mapId)
    if (!this.getGeoEntity(mapId)) {
      const geo = mapInstance.SGeolocation({ viewer: map.Viewer })
      geosObj[mapId] = geo
    }
    this.getGeoEntity(mapId).locationTo({ lng: lng, lat: lat, height: height })
  }

  static setZoomAndCenter(lng, lat, zoom, mapId) {
    const map = this.getMap(mapId)
    if (map) {
      if (this.is3d(mapId)) {
        let height = 12000
        if (zoom === 5) {
          // 三维的地图太大
          zoom = 4
        }
        if (zoom) {
          height = CTMapOl.thrdime.cameracontrol.zoomToHeight(zoom)
        }
        console.log('setZoomAndCenter----zoom:' + zoom + ',height:' + height)
        CTMapOl.thrdime.cameracontrol.setcamera(
          map,
          CTMapOl.thrdime.cameracontrol.getcameraoptionswithdetile(
            Number(lng),
            Number(lat),
            height,
            0,
            -90,
            0
          )
        )
      } else {
        setZoomAndCenter(map, lng, lat, zoom)
      }
    } else {
      setTimeout(() => {
        this.setZoomAndCenter(lng, lat, zoom, mapId)
      }, 100)
    }
  }

  /**
   * 打点
   * @param lng
   * @param lat
   * @param id
   * @param imgObj '{imgPath, imgWidth, imgHeight,offSet}'
   *  imgPath img对象的参数 图片地址
   *  imgWidth img对象的参数 Number类型
   *  imgHeight img对象的参数 Number类型
   *  isBig img对象的参数 boolean类型 是否直接显示大图标,点击不变大
   *  offSet 偏移
   * @param successFn 成功回调
   * @param clickFn 点击回调, 可不传
   * @param mapId
   */
  static showMarker(lng, lat, id, imgObj, successFn, mapId, clickFn) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    const width = imgObj.imgWidth
    const height = imgObj.imgHeight
    const offSet = imgObj.offSet ? imgObj.offSet : [24, 48]
    if (CTMapType === mapTypeConst.sMap) {
      if (!imgObj.id) {
        // 如果没有ID，序列自增1，给值
        idSeq += 1
      }
      const marker = new CTMapOl.cesiumComponent.Point(map, {
        viewer: map.Viewer,
        lng: Number(lng),
        lat: Number(lat),
        imgPath: imgObj.imgPath,
        id: imgObj.id ? imgObj.id : idSeq,
        clickIcon: imgObj.clickIcon ? imgObj.clickIcon : imgObj.imgPath,
        iconSize: [width, height],
        zoom: imgObj.zoom ? imgObj.zoom : 13,
        offset: offSet
      })
      marker.addTo({ viewer: map.Viewer })
      if (clickFn) {
        this.massMarkClick(marker, clickFn)
      }
      this.executeFunction(successFn, marker)
    } else {
      const marker = addMarker(map, lng, lat, id, imgObj, clickFn)
      this.executeFunction(successFn, marker)
    }
  }

  /**
   * 删除指定点
   */
  static deleteMarker(pointEntity, mapId) {
    if (pointEntity == null) {
      return false
    }
    if (this.is3d(mapId)) {
      if (pointEntity.remove && typeof pointEntity.remove === 'function') {
        pointEntity.remove()
      }
    } else {
      const map = this.getMap(mapId)
      closeInfoWindow(map, pointEntity) // 关闭地图弹窗
    }
  }

  /**
   * 可视域分析
   */
  static activeViewShed(mapId, fn) {
    const CTMapType = this.getCTMapType(mapId)
    const map = this.getMap(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      // 初始化可视域向分析
      const viewShedId = activeViewShed(map)
      this.executeFunction(fn, viewShedId)
    }
  }

  /**
   * 初始化通视分析
   */
  static initSightLine(
    mapId,
    fn,
    clickfunc,
    centerPoint,
    targetPoint,
    centerPointWh,
    targetPointWh
  ) {
    const CTMapType = this.getCTMapType(mapId)
    const map = this.getMap(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      const viewShedId = analysisVisible(
        map,
        clickfunc,
        centerPoint,
        targetPoint,
        centerPointWh,
        targetPointWh
      )
      this.executeFunction(fn, viewShedId)
    }
  }

  /**
   * 初始化MouseTool
   */
  static initMouseTool(successFn, mapId, mouseType, options, fn) {
    const map = this.getMap(mapId)
    console.log(map, mapId, 'map')
    // 设置未操作中，防止看这里等操作触发地图点击事件
    map._inOperation = true
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      this.ctMapTypeIsSMap(successFn, mapId, mouseType, options, fn, map)
    } else {
      this.ctMapTypeIsNotSMap(successFn, mapId, mouseType, options, fn, map)
    }
  }

  static ctMapTypeIsSMap(successFn, mapId, mouseType, options, fn, map) {
    let toolMeasure = MouseToolObj[mapId + '_' + mouseType]
    /* if (toolMeasure) {
      if (mouseType == 1 || mouseType == 2) {
        this.executeFunction(successFn, toolMeasure);
        return;
      }
    }*/
    // 1、测距 2、测面
    if ([1, 2].includes(mouseType)) {
      toolMeasure = new CTMapOl.cesiumComponent.MouseTool(map)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else if ([3, 5].includes(mouseType)) {
      // 3、坐标拾取
      toolMeasure = CTMapOl.thrdime.cameracontrol.startpickcood(map, (e, f) => {
        if (map._stopPick) {
          return
        }
        console.log(e, f)
        const lng = (f.longitude / Math.PI) * 180
        const lat = (f.latitude / Math.PI) * 180
        const height = f.height
        this.executeFunction(fn, { lng, lat, height: height })
      })
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else {
      // 4、坐标定位 暂时不知道是否有API，先不处理，外面自己打点
      this.executeFunction(successFn, toolMeasure)
    }
  }

  static ctMapTypeIsNotSMap(successFn, mapId, mouseType, options, fn, map) {
    MouseToolObj[mapId + '_' + 1]?.stop()
    MouseToolObj[mapId + '_' + 2]?.stop()
    let toolMeasure = MouseToolObj[mapId + '_' + mouseType]
    if (toolMeasure) {
      if ([1, 2].includes(mouseType)) {
        this.executeFunction(successFn, toolMeasure)
        return
      }
    }
    // 1、测距 2、测面
    if ([1, 2].includes(mouseType)) {
      // 不要在 data 中定义 measure 变量，无需响应式
      toolMeasure = new CTMapOl.extend.ToolMeasure(map, options)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else if (mouseType == 3) {
      // 3、坐标拾取
      const _options = {
        onPick: (coords) => {
          // 单坐标转换指定投影系
          const coordinate = transCoordinate(coords, 'EPSG:3857', 'EPSG:4326')
          const lng = coordinate[0]
          const lat = coordinate[1]
          this.executeFunction(fn, { lng, lat, height: null })
        },
        zIndex: 14
      }
      if (options.icon) {
        _options.icon = options.icon
      }
      // 不要在 data 中定义 location 变量，无需响应式
      toolMeasure = new CTMapOl.extend.ToolLocation(map, _options)
      // 取消鼠标跟谁的图标
      toolMeasure._draw.overlay_.setStyle(null)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else {
      // 4、坐标定位
      const _options = {
        onPick: (coords) => {
          // const lng = coords[0];
          // const lat = coords[1];
        }
      }
      if (options.icon) {
        _options.icon = options.icon
      }
      // 不要在 data 中定义 location 变量，无需响应式
      toolMeasure = new CTMapOl.extend.ToolLocation(map, _options)
      // 取消鼠标跟谁的图标
      toolMeasure._draw.overlay_.setStyle(null)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    }
  }

  /**
   * 坐标拾取
   * @param eventName 监听事件
   * @param fn （返回参数 lng，lat, height）
   * @param mapId
   */
  static pickMapCoor(eventName, fn, mapId, mouseType = 3, fn2 = null, icon) {
    const map = this.getMap(mapId)
    console.log('=========', map)
    const CTMapType = this.getCTMapType(mapId)
    const lng = null
    const lat = null
    this.initMouseTool(
      (toolMeasure) => {
        if (fn2) {
          fn2(toolMeasure)
        }
        if (CTMapType === mapTypeConst.sMap) {
          console.log('===========', toolMeasure)
        } else {
          if (toolMeasure) {
            toolMeasure.pick()
          }
        }
      },
      mapId,
      mouseType,
      {
        icon
      },
      fn
    )
  }

  /**
   * 坐标定位
   */
  static searchPosition(mapId, longitude, latitude, mouseType = 4, icon) {
    this.initMouseTool(
      (toolMeasure) => {
        if (toolMeasure) {
          if (!this.is3d(mapId)) {
            // 单坐标转换指定投影系
            toolMeasure.locate(transCoordinate([+longitude, +latitude]))
          }
        }
      },
      mapId,
      mouseType,
      {
        icon
      }
    )
  }

  /**
   * 打开测距
   */
  static openRule(
    mapId,
    mouseType = 1,
    options = {
      type: 'length',
      color: 'rgb(67, 200, 143)',
      startTip: '单击确定起点或继续，双击或右键结束测距',
      elseTip: '单击继续，双击或右键结束测距',
      rightClickAction: 'finish',
      pointOption: {
        borderWeight: 3, // 折线小圆点边框宽度
        strokeWeight: 6 // 折线小圆点内部填充
      }
    }
  ) {
    this.initMouseTool(
      (toolMeasure) => {
        if (toolMeasure) {
          if (this.is3d(mapId)) {
            toolMeasure.rule(
              {
                lineOptions: {
                  // 可缺省
                  strokeStyle: 'solid',
                  strokeColor: 'rgba(67, 200, 143, .5)',
                  // strokeColor: "#4F9FFF",
                  strokeOpacity: 1,
                  strokeWeight: 3
                },
                pointOption: {
                  // outlineColor: 'rgba(67, 200, 143, .5)',
                  // outlineColor: '#4F9FFF',
                  strokeColor: '#ffffff',
                  strokeOpacity: 1,
                  outlineColor: '#0DC985',
                  outlineColorOpacity: 0.5,
                  borderWeight: 3, // 折线小圆点边框宽度
                  strokeWeight: 6 // 折线小圆点内部填充
                },
                inforWindow: {
                  content: `<div class="ctmap-3d-ol-measure-tooltip" style='display:flex;background: #00221B;border-radius: 4px;color: #ffffff;padding: 0px 3px;font-size: 12px' ><span class="distance __text" style='padding: 3px 6px 4px 8px;line-height: normal'></span><div style='display: flex;align-items: center;line-height: normal'><span class="iconfont_tools icon-AR-gaojingbiaoqian-guanbi close" style='color: #fff;margin: 0 3px;padding: 5px 3px;font-size:12px;cursor:pointer'></span><span class="iconfont_tools icon-xunhangjihua-shanchu trash" style='color: #fff;margin: 0 3px;padding: 5px 3px;font-size:13px;cursor:pointer'></span></div></div>`
                },
                startTip:
                  '<div style="display:flex;background: #00221B;border-radius: 4px;color: #ffffff;padding: 6px 12px;font-size: 12px;line-height: 12px;">单击确定起点或继续，双击或右键结束测距</div>',
                elseTip: '单击继续，双击或右键结束测距',
                rightClickEnd: true // 右键结束
              },
              (e) => {
                console.log(e)
              }
            )
            // if (!toolMeasure.getDrawState()) {
            console.log('getDrawState', toolMeasure.getDrawState())
            toolMeasure.beginDraw()
            // }
          } else {
            toolMeasure.start()
          }
        }
      },
      mapId,
      mouseType,
      options
    )
  }

  /**
   * 关闭测距或者测面
   */
  static closeRule(mapId, mouseType = 1) {
    const toolMeasure = MouseToolObj[mapId + '_' + mouseType]
    if (!toolMeasure) {
      return
    }
    if (this.is3d(mapId)) {
      if (mouseType == 3) {
        CTMapOl.thrdime.cameracontrol.stoppickcood(
          this.getMap(mapId),
          toolMeasure
        )
      } else {
        try {
          toolMeasure.close(true)
        } catch (e) {
          console.log(e)
        }
      }
    } else {
      toolMeasure.destroy()
    }
    MouseToolObj[mapId + '_' + mouseType] = null
    this.getMap(mapId)._inOperation = false
  }

  /**
   * 开启测面
   */
  static activeArea(
    mapId,
    mouseType = 2,
    options = {
      type: 'area',
      color: 'rgb(67, 200, 143)',
      rightClickAction: 'finish'
    }
  ) {
    this.initMouseTool(
      (toolMeasure) => {
        if (toolMeasure) {
          if (this.is3d(mapId)) {
            toolMeasure.measureArea(
              Object.assign(
                {
                  strokeColor: 'rgba(67, 200, 143, .5)',
                  strokeOpacity: 1,
                  strokeWeight: 3,
                  fillColor: 'rgb(13,201,133)',
                  fillOpacity: 0.3,
                  inforWindow: {
                    content:
                      '<div class="ctmap-3d-ol-measure-tooltip" style="display:flex;background: #00221B;border-radius: 4px;color: #ffffff;padding: 6px 12px;font-size: 12px;line-height: 12px;">总面积：<span class="area __text" style="margin-right: 12px;"></span><span class="iconfont_tools icon-xunhangjihua-shanchu trash"></span></div>'
                  },
                  unit: 'sq.km'
                },
                options
              ),
              (e) => {
                console.log(e)
              }
            )
          } else {
            toolMeasure.start()
          }
        }
      },
      mapId,
      mouseType,
      options
    )
  }

  /**
   * 关闭鼠标功能并清除覆盖物
   * @param successFn 成功回调
   * @param ifClear 是否清除覆盖物
   * @param mapId
   */
  static cleanMouseTool(successFn, ifClear, mapId) {
    const CTMapType = this.getCTMapType(mapId)
    if (ifClear == null) {
      ifClear = true
    }
    if (ifClear) {
      // this.deleteDefaultMarker();
    }
    if (!MouseToolObj[mapId]) {
      this.executeFunction(successFn)
      return false
    }
    if (CTMapType === mapTypeConst.sMap) {
      MouseToolObj[mapId].remove({ ifClear: ifClear })
      this.executeFunction(successFn)
    } else {
      MouseToolObj[mapId].on('cancel.click')
      this.executeFunction(successFn)
    }
  }

  static lngOrLatIsNull(lng, lat) {
    let flag = false
    if (lng === 'null' || lat === 'null') {
      flag = true
    }
    if (!lng || !lat) {
      flag = true
    }
    if (lng === '0.0' || lat === '0.0') {
      flag = true
    }
    return flag
  }

  /*
   * @description: 高亮区域
   * @param {string} 高亮区域名称
   */
  static setHighLightArea(mapId, areaCode, highlightStyle) {
    const map = this.getMap(mapId)
    this.getAreaPolygonByCode(areaCode, mapId, (resp) => {
      if (highlightObj[mapId] != null) {
        this.removeHighLightArea(mapId)
      }
      try {
        if (this.is3d(mapId)) {
          const options = {
            color: highlightStyle?.color || '#000',
            opacity: highlightStyle?.opacity || 0.5,
            positions: resp,
            outline: {
              color: highlightStyle?.outLineColor || '#000',
              weight: 0
            },
            setFitView: true
          }
          highlightObj[mapId] = new CTMapOl.cesiumComponent.Highlight(
            map,
            options
          )
        } else {
          const highlight = highLightArea(map, resp)
          highlightObj[mapId] = highlight
        }
      } catch (e) {
        console.log('setHighLightArea', e)
      }
      highlightCodeObj[mapId] = areaCode
    })
  }

  /**
   * 根据行政编码查询区域多边形点
   */
  static getAreaPolygonByCode(adCode, mapId, successFn) {
    CTMapOl.netApi
      .regionInfo({
        adCode: adCode
      })
      .then((resp) => {
        const polygon = resp.data.polygon
        if (polygon) {
          const list = []
          polygon.split('|').map((a) => {
            const coordinates = a.split(';').map((sub) => {
              const [longitude, latitude] = sub.split(',')
              if (this.is3d(mapId)) {
                return [parseFloat(longitude), parseFloat(latitude)]
              } else {
                return CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
                  parseFloat(longitude),
                  parseFloat(latitude)
                ])
              }
            })
            list.push([coordinates])
          })
          successFn(list)
        }
      })
  }

  static setHighLightStyle(mapId, highlightStyle) {
    if (highlightObj[mapId] == null) {
      return false
    }
    highlightObj[mapId].setOption({
      opacity: highlightStyle?.opacity || 0.5,
      color: highlightStyle?.color || '#000',
      outline: {
        color: highlightStyle?.outLineColor || '#000',
        weight: highlightStyle?.outLineWeight || 1
      }
    })
  }

  static removeHighLightArea(mapId) {
    if (highlightObj[mapId] == null) {
      return false
    }
    try {
      if (this.is3d(mapId)) {
        highlightObj[mapId].remove()
      } else {
        const map = this.getMap(mapId)
        removeHighLightArea(map, highlightObj[mapId])
      }
    } catch (e) {
      console.log('removeHighLightArea', e)
    }
    highlightObj[mapId] = null
    delete highlightObj[mapId]
    highlightCodeObj[mapId] = null
    delete highlightCodeObj[mapId]
    console.log(highlightObj)
  }

  static recoveryHighLightArea(mapId) {
    if (highlightCodeObj[mapId]) {
      this.setHighLightArea(mapId, highlightCodeObj[mapId])
    }
  }

  static getCenterAndLevel(mapId) {
    const map = this.getMap(mapId)
    let center, zoom
    if (this.is3d(mapId)) {
      const pos = CTMapOl.thrdime.cameracontrol.getposition(map)
      const lonlath = Cesium.Cartographic.fromCartesian(pos)
      center = [
        (lonlath.longitude * 180) / Math.PI,
        (lonlath.latitude * 180) / Math.PI
      ]
      zoom = lonlath.height
    } else {
      center = map.getView().getCenter()
      zoom = map.getView().getZoom()
    }
    return { center, zoom }
  }

  static syncMapByCenterLevel(mapId, center, zoom) {
    const map = this.getMap(mapId)
    const geom = new CTMapOl.geom.Point(center)
    if (this.is3d(mapId)) {
      geom.transform('EPSG:3857', 'EPSG:4326')
      CTMapOl.thrdime.cameracontrol.setcamera(
        map,
        CTMapOl.thrdime.cameracontrol.getcameraoptionswithdetile(
          geom.flatCoordinates[0],
          geom.flatCoordinates[1],
          CTMapOl.thrdime.cameracontrol.zoomToHeight(zoom),
          0,
          -90,
          0
        )
      )
    } else {
      geom.transform('EPSG:4326', 'EPSG:3857')
      map.getView().setCenter(geom.flatCoordinates)
      map.getView().setZoom(CTMapOl.thrdime.cameracontrol.heightToZoom(zoom))
    }
  }

  static getGeocoder(successFn, mapId) {
    const mapInstance = this.getMapInstance(mapId)
    if (GeocoderEntity[mapId] == null) {
      mapInstance.Geocoder({}).then((geocoder) => {
        GeocoderEntity[mapId] = geocoder
        this.executeFunction(successFn)
      })
    } else {
      this.executeFunction(successFn)
    }
  }

  static getAddressByLngLat(lng, lat, successFn, mapId) {
    this.getGeocoder(() => {
      GeocoderEntity[mapId]
        .getAddress({ location: [lng, lat] })
        .then(({ status, result }) => {
          successFn(result)
        })
    }, mapId)
  }

  static infoWindowHasCloseEvent(
    lng,
    lat,
    content,
    popClass,
    offsetX,
    offsetY,
    mapId
  ) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let infoWindow
    if (CTMapType === mapTypeConst.sMap) {
      const options = {
        isMultiple: false, // 多个显示框
        popClass: popClass,
        selfStyle: true
      }
      infoWindow = new CTMapOl.cesiumComponent.InfoWindow(map, options, mapId)
      // 打开信息窗体
      infoWindow.open({
        content: content,
        position: [parseFloat(lng), parseFloat(lat)],
        offset: {
          // 偏移量
          x: offsetX,
          y: offsetY
        }
      })
    } else {
      infoWindow = openInfoWindow(
        map,
        lng,
        lat,
        content,
        popClass,
        offsetX,
        offsetY
      )
    }
    return infoWindow
  }

  static infoWindowToSingle(
    lng,
    lat,
    content,
    popClass,
    offsetX,
    offsetY,
    mapId
  ) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let infoWindow
    if (CTMapType === mapTypeConst.sMap) {
      const options = {
        className: popClass,
        content: content,
        position: [parseFloat(lng), parseFloat(lat)],
        anchor: [offsetX, offsetY]
      }
      infoWindow = new CTMapOl.cesiumComponent.InforWindow(map, options)
      // 打开信息窗体
      // infoWindow.open({
      //   content: content,
      //   position: [parseFloat(lng), parseFloat(lat)],
      //   offset: {//偏移量
      //     x: offsetX,
      //     y: offsetY
      //   }
      // });
    } else {
      infoWindow = openInfoWindow(
        map,
        lng,
        lat,
        content,
        popClass,
        offsetX,
        offsetY
      )
    }
    return infoWindow
  }
  static infoWindowToSingleNew(
    lng,
    lat,
    content,
    popClass,
    offsetX,
    offsetY,
    mapId
  ) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let infoWindow
    if (CTMapType === mapTypeConst.sMap) {
      const options = {
        className: popClass,
        content: content,
        position: [parseFloat(lng), parseFloat(lat)],
        anchor: ['50%', '100%'],
        offset: [offsetX, offsetY],
        rotate: 0
      }
      infoWindow = new CTMapOl.cesiumComponent.InforWindow(map, options)
    } else {
      infoWindow = openInfoWindow(
        map,
        lng,
        lat,
        content,
        popClass,
        offsetX,
        offsetY
      )
    }
    return infoWindow
  }

  static infoWindow(lng, lat, content, popClass, offsetX, offsetY, mapId) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let infoWindow
    if (CTMapType === mapTypeConst.sMap) {
      this.closeInfoWindow(mapId) // 关闭地图弹窗
      // let options = {
      //   isMultiple: false,//多个显示框
      //   popClass: popClass,
      //   selfStyle: true,
      // };
      // infoWindow = new CTMapOl.cesiumComponent.InfoWindow(map, options, mapId);

      // // 打开信息窗体
      // infoWindow.open({
      //   content: content.innerHTML || content,
      //   position: [parseFloat(lng), parseFloat(lat)],
      //   offset: {//偏移量
      //     x: offsetX,
      //     y: offsetY
      //   }
      // });
      infoWindow = new CTMapOl.cesiumComponent.InforWindow(
        map,
        {
          position: [parseFloat(lng), parseFloat(lat)],
          anchor: ['50%', '100%'],
          offset: [offsetX, offsetY],
          rotate: 0,
          content: content.innerHTML || content,
          selfStyle: true,
          popClass: 'alarmEventInfoWindow ' + popClass,
          isMultiple: false // 多个显示框
        },
        mapId
      )
    } else {
      this.closeInfoWindow(mapId) // 关闭地图弹窗
      infoWindow = openInfoWindow(
        map,
        lng,
        lat,
        content,
        popClass,
        offsetX,
        offsetY
      )
    }
    this.setInfoWindow(infoWindow, mapId)
    return infoWindow
  }
  static infoWindowNew(
    lng,
    lat,
    content,
    popClass,
    offsetX,
    offsetY,
    infoWindowid,
    mapinstance,
    is3Dprivate,
    mapId,
    infoBlock = () => {
      console.log('执行默认的infoBlock函数')
    }
  ) {
    // let map = getMap(mapId);
    // let CTMapType = this.getCTMapType(mapId);
    let infoWindow
    // console.log('根据id获取地图',map,CTMapType);
    if (is3Dprivate) {
      this.closeInfoWindowNew(infoWindowid, mapinstance, is3Dprivate) // 关闭地图弹窗
      infoWindow = new CTMapOl.cesiumComponent.InforWindow(
        mapinstance,
        {
          position: [parseFloat(lng), parseFloat(lat)],
          anchor: ['50%', '100%'],
          offset: [offsetX, offsetY],
          rotate: 0,
          content: content.innerHTML || content,
          selfStyle: true,
          popClass: 'threedWindowInfoPop' + popClass,
          isMultiple: false // 多个显示框
        },
        mapId
      )
      setTimeout(function () {
        infoBlock()
      }, 100)
    } else {
      this.closeInfoWindowNew(infoWindowid, mapinstance, is3Dprivate) // 关闭地图弹窗
      infoWindow = openInfoWindow(
        mapinstance,
        lng,
        lat,
        content,
        popClass,
        offsetX,
        offsetY,
        infoBlock,
        infoWindowid
      )
    }
    this.setInfoWindow(infoWindow, infoWindowid)

    return infoWindow
  }
  static closeInfoWindow(mapId) {
    // let CTMapType = this.getCTMapType(mapId);
    const infoWindow = this.getInfoWindow(mapId)
    if (infoWindow) {
      if (this.is3d(mapId)) {
        if (infoWindow.remove) infoWindow.remove()
        if (infoWindow.destroy) infoWindow.destroy()
      } else {
        const map = this.getMap(mapId)
        closeInfoWindow(map, infoWindow, mapId) // 关闭地图弹窗
      }
    }
  }

  static closeInfoWindowNew(
    WindowsId,
    mapinstance,
    is3Dprivate,
    closeDeviceblock = () => {
      console.log('执行默认的closeDeviceblock函数')
    }
    // ,supview
  ) {
    const infoWindow = this.getInfoWindow(WindowsId)
    console.log('关闭弹窗infoWindow', is3Dprivate)
    if (infoWindow) {
      if (is3Dprivate) {
        console.log('关闭弹窗是3d', is3Dprivate, infoWindow)
        if (infoWindow.remove) infoWindow.remove()
        if (infoWindow.destroy) infoWindow.destroy()
      } else {
        console.log('不是3d')
        // let map = getMap(mapId);
        infoWindow &&
          closeInfoWindow(
            mapinstance,
            infoWindow,
            WindowsId,
            closeDeviceblock
            // ,supview
          ) // 关闭地图弹窗
      }
    }
  }

  /**
   * 使用Vue组件来渲染地图打点弹窗的方法
   * @param {*} options
   */
  static infoWindowByVue(options) {
    const { lng, lat, component, propsData, offsetX, offsetY, mapId } = options

    const inst = this.infoWindow(
      lng,
      lat,
      '<div class="vueComp"></div>',
      'infoByVue',
      offsetX,
      offsetY,
      mapId
    )
    let vueInst
    if (component) {
      // 初始化vue组件
      const $el = $(`#${inst.id} .vueComp`)[0]
      // 监听到根节点。下面的class定义是按照铁塔地图的class来的
      const $wrapperNode = $(`#${inst.id}`).parent()[0] // 这层正常是最外层的定位容器
      const $parentEl = $(`#${inst.id}`).parent().parent()[0] // 这个是放置所有infoWindow的容器，3D地图下可能就是mapdiv本身，2D下是一个独立的div
      vueInst = new Vue({
        ...component,
        // store,
        el: $el,
        propsData
      })
      // 由于infowindow方法并没有卸载事件，自己使用observer监听
      // 如果当前弹窗使用的元素被移除，那么就销毁这个vue实例，以避免可能的内存泄
      const mutationObserver = new MutationObserver((records, observer) => {
        for (const record of records) {
          if (this.hasWrapperNodeBeenRemoved(record, $wrapperNode) && vueInst) {
            vueInst.$destroy()
            observer.disconnect()
            vueInst = null
          }
        }
      })
      mutationObserver.observe($parentEl, {
        childList: true,
        characterData: false
      })
    }

    return {
      infoWindow: inst,
      vueInst
    }
  }

  static hasWrapperNodeBeenRemoved(record, $wrapperNode) {
    for (const removedNode of record.removedNodes) {
      if (removedNode === $wrapperNode) {
        return true
      }
    }
    return false
  }

  /**
   * 根据id定位到点聚合的点
   * @param id
   * @param deviceCode
   * @param layerId
   * @param mapId
   */
  static locationMarkerClusterById(id, deviceCode, layerId, mapId) {
    this.setLocationClusterId(deviceCode, mapId) // 存储清除左侧树选中效果用
    const layer = this.getLayers(mapId)
    if (layer[layerId]) {
      layer[layerId].locationById({ id: id })
    }
  }

  /**
   * 根据地点查询经纬度
   * @param address 地址
   * @param fn
   */
  static getLnglatByAddress(address, mapId, successFn) {
    const CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      if (!autoCompleteEntity[mapId]) {
        this.initAutoComplete(mapId)
      }
      autoCompleteEntity[mapId]
        .searchLnglatByAddress({ address })
        .then((lnglat) => {
          this.executeFunction(successFn, lnglat)
        })
    } else {
      this.getGeocoder(() => {
        GeocoderEntity[mapId]
          .getLocation({ keyword: address })
          .then(({ status, result }) => {
            console.log(status, result)
            const lnglat = result.geocodes[0].location.toString().split(',')
            this.executeFunction(successFn, lnglat)
          })
      }, mapId)
    }
  }

  /**
   * 初始化标绘
   * 获取标绘工具树
   */
  static initDrawData(mapId, path = '/SymbolIcon', fn) {
    const CTMapType = this.getCTMapType(mapId)
    const map = this.getMap(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      const mouseTool = new CTMapOl.cesiumComponent.MouseTool(map)
      // 获取资源树形结构数据，用户根据数据自行渲染样式
      const arr = mouseTool.getSymbolData({ path: path })
      this.executeFunction(fn, arr, mouseTool)
    }
  }

  /**
   * 结束标绘
   */
  static overSymbol(SPlottingId) {
    if (!SPlottingId) {
      return false
    }
    try {
      SPlottingId.close()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 清理标绘
   */
  static clearSymbol(SPlottingId) {
    if (!SPlottingId) {
      return false
    }
    try {
      SPlottingId.close(true)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 截图地图并保存图片(二维三维通用）
   * @param name
   * @param fn
   */
  static mapSavePng(name, mapId, fn) {
    const map = this.getMap(mapId)
    const mapInstance = this.getMapInstance(mapId)
    if (this.is3d(mapId)) {
      map.render()
      const canvas = map.scene.canvas
      const base64 = canvas.toDataURL('image/png')
      this.executeFunction(fn, base64)
    } else {
      mapInstance.saveDrawPng({ viewer: map.Viewer, outfileName: name })
    }
  }

  /**
   * 摄像机选址
   */
  static cameraPosition(params, mapId, fn) {
    const map = this.getMap(mapId)
    const cameraSiteSelectId = cameraLocationAnalysis(map, params)
    this.executeFunction(fn, cameraSiteSelectId)
  }

  /**
   * 摄像机选址
   */
  static cameraPosition2(params, mapId, fn) {
    const map = this.getMap(mapId)
    const cameraSiteSelectId = cameraLocationAnalysis2(map, params)
    this.executeFunction(fn, cameraSiteSelectId)
  }

  /**
   * 坡度坡向分析
   */
  static terrainSlopeAnalyze(params, mapId, fn, finishFn) {
    const map = this.getMap(mapId)
    console.log(map, 'map')
    // 初始化坡度坡向分析
    const cameraSiteSelectId = slopAnalysis(map, params, finishFn)
    this.executeFunction(fn, cameraSiteSelectId)
  }

  static mapMousemove(mapId, successFn) {
    const map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      const CesiumEventHandlermove = new Cesium.ScreenSpaceEventHandler(
        map.scene.canvas
      )
      CesiumEventHandlermove.setInputAction((movement2) => {
        try {
          const ray = map.camera.getPickRay(movement2.endPosition)
          const cartesian1 = map.scene.globe.pick(ray, map.scene)
          const lnglat = Cesium.Cartographic.fromCartesian(cartesian1)
          const longitude = (lnglat.longitude / Math.PI) * 180
          const latitude = (lnglat.latitude / Math.PI) * 180
          successFn({
            longitude,
            latitude,
            height: lnglat.height.toFixed(0)
          })
        } catch (e) {
          console.log('=======mapMousemove=========', e)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    } else {
      if (mousePositionControlObj[mapId]) {
        map.removeControl(mousePositionControlObj[mapId])
        mousePositionControlObj[mapId] = null
      }
      const mousePositionControl = new MousePosition({
        coordinateFormat: function (coordinate) {
          return format(
            coordinate,
            '经度: {x} &nbsp;&nbsp;纬度: {y} &nbsp;&nbsp;海拔: 0',
            6
          )
        },
        projection: 'EPSG:4326', // 定义投影
        className: 'bottom-mouse-position', // 控件的CSS类名
        target: document.getElementById('mouse-position'), // 将控件渲染在该DOM元素中
        undefinedHTML: ' ' // 鼠标离开地图时，显示空格
      })
      // 添加控件到地图
      map.addControl(mousePositionControl)
      mousePositionControlObj[mapId] = mousePositionControl
    }
  }

  static mapMousemoveNew(mapInstance, successFn, mousePointionId, is3d) {
    if (is3d) {
      // 3d 待处理
      const CesiumEventHandlermove = new Cesium.ScreenSpaceEventHandler(
        mapInstance.scene.canvas
      )
      CesiumEventHandlermove.setInputAction((movement2) => {
        try {
          const ray = mapInstance.camera.getPickRay(movement2.endPosition)
          const cartesian1 = mapInstance.scene.globe.pick(
            ray,
            mapInstance.scene
          )
          const lnglat = Cesium.Cartographic.fromCartesian(cartesian1)
          const longitude = (lnglat.longitude / Math.PI) * 180
          const latitude = (lnglat.latitude / Math.PI) * 180
          successFn({
            longitude,
            latitude,
            height: lnglat.height.toFixed(0)
          })
        } catch (e) {
          console.log('=======mapMousemove=========', e)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    } else {
      if (mousePositionControlObj[mousePointionId]) {
        mapInstance.removeControl(mousePositionControlObj[mousePointionId])
        mousePositionControlObj[mousePointionId] = null
      }
      const mousePositionControl = new MousePosition({
        coordinateFormat: function (coordinate) {
          return format(
            coordinate,
            '经度: {x} &nbsp;&nbsp;纬度: {y} &nbsp;&nbsp;海拔: 0',
            6
          )
        },
        projection: 'EPSG:4326', // 定义投影
        className: 'bottom-mouse-position', // 控件的CSS类名
        target: document.getElementById('commonFoonterMapMousePosition'), // 将控件渲染在该DOM元素中
        undefinedHTML: ' ' // 鼠标离开地图时，显示空格
      })
      // 添加控件到地图
      mapInstance.addControl(mousePositionControl)
      mousePositionControlObj[mousePointionId] = mousePositionControl
    }
  }

  /**
   * 坐标拾取
   * @param mapId
   * @param fn （返回参数 lng，lat, height）
   */
  static markerPicking(mapId, fn) {
    const map = this.getMap(mapId)
    markerPicking(map, fn)
  }

  // 初始化热力图
  static initHeatmap(mapId) {
    const map = this.getMap(mapId)
    let heatSource
    if (this.is3d(mapId)) {
      // console.log("===HeatMapCesium===",CTMapOl.cesiumComponent.CesiumHeatmap)
      heatSource = new CTMapOl.cesiumComponent.CesiumHeatmap(map)
    } else {
      heatSource = new CTMapOl.source.Vector()
      const heatLayer = new CTMapOl.layer.Heatmap({
        source: heatSource,
        blur: 20, // 模糊属性
        radius: 6, // 半径
        gradient: ['#4F9FFF', '#3DF4FF', '#FFEE63', '#FF4646'],
        zIndex: -1
      })
      map.addLayer(heatLayer)
    }
    return heatSource
  }
  // 设置热力图数据  heatSource：储存的热力图实例对象
  static setHeatmapFeatures(heatSource, arr, mapId) {
    const _heatSource = this.getHeatSource(heatSource, mapId)
    if (this.is3d(mapId)) {
      this.heat3d(arr, _heatSource)
    } else {
      // 创建要素
      const heatMapFeature = arr.map((v) => {
        return new CTMapOl.Feature({
          geometry: new CTMapOl.geom.Point(
            transCoordinate([v.longitude, v.latitude])
          ),
          data: v
        })
      })
      _heatSource.addFeatures(heatMapFeature)
    }
    return _heatSource
  }

  static getHeatSource(heatSource, mapId) {
    let _heatSource = heatSource
    if (_heatSource && _heatSource.addFeatures) {
      this.clearHeatmapFeatures(_heatSource, mapId)
    } else {
      _heatSource = this.initHeatmap(mapId)
    }
    return _heatSource
  }

  static heat3d(arr, _heatSource) {
    let _west = Infinity
    let _east = -Infinity
    let _south = Infinity
    let _north = -Infinity
    let _maxValue = 1
    const _data = []
    let _lon, _lat
    arr.forEach((item) => {
      // 过滤错误的经纬度
      if (
        this.isValidLongitude(item.longitude) &&
        this.isValidLatitude(item.latitude)
      ) {
        _lon = +item.longitude
        _lat = +item.latitude
        _data.push({
          x: _lon,
          y: _lat,
          value: item.num,
          radius: 3
        })
        _maxValue = Math.max(_maxValue, item.num)
        // 最小经度
        _west = Math.min(_west, _lon)
        // 最大经度
        _east = Math.max(_east, _lon)
        // 最小纬度
        _south = Math.min(_south, _lat)
        // 最大纬度
        _north = Math.max(_north, _lat)
      }
    })
    // 边缘位置的热力图会被裁掉，所以扩充一下范围
    const bounds = {
      west: _west - 2,
      east: _east + 2,
      south: _south - 2,
      north: _north + 2
    }

    _heatSource.create(bounds, {
      blur: 0.75,
      maxOpacity: 0.9,
      minOpacity: 0.2,
      gradient: {
        0.25: '#4F9FFF',
        0.5: '#3DF4FF',
        0.75: '#FFEE63',
        0.9: '#FF4646'
      }
    })
    console.log('=========', _data)
    console.log('=========', bounds)
    _heatSource.setWGS84Data(0, _maxValue, _data)
  }

  static isValidLongitude(lon) {
    return /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]*)?)|180(([.][0]*)?))$/.test(lon)
  }

  static isValidLatitude(lat) {
    return /^-?((0|[1-8]?[0-9]?)(([.][0-9]*)?)|90(([.][0]*)?))$/.test(lat)
  }

  // 清除热力图
  static clearHeatmapFeatures(heatSource, mapId) {
    if (this.is3d(mapId)) {
      heatSource.removeLayer()
      // this.getMap(mapId).scene.camera.moveEnd.removeEventListener(this._setPolymerization);
      // this._setPolymerization = '';
    } else {
      console.log('看看是不是这块')
      heatSource?.clear()
    }
  }

  /**
   * 根据点、距离和角度计算目标点
   * @param origin            初始点坐标
   * @param distance          距离（米）
   * @param bearing           角度（度）
   * @param options           可选参数
   * @returns {*[]}           终点经纬度
   */
  static showTextPolygonId(
    mapId,
    polygonId,
    path,
    textHtml,
    popClass,
    offsetX,
    offsetY,
    epsg = '3857'
  ) {
    const map = this.getMap(mapId)
    return showTextPolygonId(
      map,
      polygonId,
      path,
      textHtml,
      popClass,
      offsetX,
      offsetY,
      epsg
    )
  }

  /**
   * @description  : 渲染polygon图斑
   * @param         { String } mapId 地图id
   * @param         { Array } coordinates 坐标
   * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor,fillOpacity } 图斑样式
   * @param         { Object } nodeStyleObject { nodeRadius,nodeColor } 顶点样式
   * @param         { Boolean } isShowAllPolygon 是否全部显示图斑
   * @param         { String }id 多边形id
   */
  static renderPolygon(
    mapId,
    coordinates,
    styleObject,
    nodeStyleObject,
    isShowAllPolygon,
    id
  ) {
    const map = this.getMap(mapId)
    return renderPolygon(
      map,
      coordinates,
      styleObject,
      nodeStyleObject,
      isShowAllPolygon,
      id
    )
  }

  /**
   * @description  : 渲染点、线、多边形、圆
   * @param         { String } mapId 地图id
   * @param         { String } type 渲染类型
   * @param         { Array } coordinates 坐标
   * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor } 样式
   * @param         { boolean } flag 是否渲染视野范围之内
   * @param         { number } zIndex 层级
   */
  static renderGraphic(
    mapId,
    type,
    coordinates,
    styleObject,
    flag,
    zIndex,
    color
  ) {
    const map = this.getMap(mapId)
    return renderGraphic(
      map,
      type,
      coordinates,
      styleObject,
      flag,
      zIndex,
      color
    )
  }

  /**
   * @description  : 设置多边形区域
   * @param         { Object } map 地图实例
   * @param         { Array } coordinates 坐标集合
   * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor } 样式
   * @param         { String } gridName 区域名称
   * @param         { Boolean } flag 是否为绘制图斑
   */
  static setPolygon(mapId, coordinates, styleObject, gridName, flag) {
    const map = this.getMap(mapId)
    return setPolygon(map, coordinates, styleObject, gridName, flag)
  }

  /**
   * 移除图层
   * @param mapId 地图id
   * @param layerPoint 图层
   */
  static removeLayer(mapId, layerPoint) {
    const map = this.getMap(mapId)
    return removeLayer(map, layerPoint)
  }

  static setCity(params, zoom = 12, mapId) {
    return new Promise((r, l) => {
      poiAreaQuery(params).then((resp) => {
        console.log(resp)
        if (resp && resp.code == 200) {
          const location = resp?.data?.location
          const lng = location.split(',')[0]
          const lat = location.split(',')[1]
          this.setZoomAndCenter(lng, lat, zoom, mapId)
          r(resp)
        } else {
          l(resp)
        }
      })
    })
  }

  /**
   * 3D-通视分析
   * @param mapId 地图id
   */
  static analysisVisible(mapId, clickfunc) {
    const map = this.getMap(mapId)
    return analysisVisible(map, clickfunc)
  }

  /**
   * 3D-摄像机可视域分析
   * @param map
   * @param form 搜索条件：lon 经度，lat 纬度，hb 海拔(m), gg 设置挂高(m),  spsj 水平视角(°),  czsj 垂直视角(°), fxj 方向角(°), fyj 俯仰角(°), syjl 视野距离(Km)
   */
  static cameraLocationAnalysis(
    mapId,
    lon,
    lat,
    hb,
    gg,
    spsj,
    czsj,
    fxj,
    fyj,
    syjl
  ) {
    const map = this.getMap(mapId)
    const form = {
      lon,
      lat,
      hb,
      gg,
      spsj,
      czsj,
      fxj,
      fyj,
      syjl
    }
    return cameraLocationAnalysis(map, form)
  }

  /**
   * @description  : 渲染3D点、线、多边形、圆
   * @param         { String } mapId 地图id
   * @param         { Object } type 渲染类型
   * @param         { Array } coordinates 坐标
   * @param         { String } radius 半径，画点和圆必传，
   * @param         { Object } styleObject { strokeColor,strokeWeight,strokeOpacity,fillColor,fillOpacity } 样式
   * @param         { boolean } flag 是否渲染视野范围之内
   */
  static renderCesiumPolygon(
    mapId,
    type = 'Point',
    coordinates,
    radius = '500', // 半径
    styleObject,
    flag = true
  ) {
    const map = this.getMap(mapId)
    return renderCesiumPolygon(
      map,
      type,
      coordinates,
      radius,
      styleObject,
      flag
    )
  }

  /**
   * @description  : 三维-文本标记
   * @param         { String } mapId 地图id
   * @param         { Array } path 经纬度
   * @param         { String } text 显示的文
   * @param         { String } fillColor text的颜色
   * @param         { String } font text的大小及字体
   * @param         { Number } height text的高度
   * @param         { Object } param 其它传参
   */
  static showCesiumText(
    mapId,
    path,
    text,
    fillColor,
    font,
    height,
    param = {}
  ) {
    const map = this.getMap(mapId)
    return showCesiumText(map, path, text, fillColor, font, height, param)
  }

  /**
   * @description  : 三维-轨迹回放
   * @param         { Object } map 地图实例
   * @param         { Array } path 经纬度集合
   * @param         { Object } styleObject { strokeColor,strokeWeight,strokeOpacity,fillColor,fillOpacity } 样式
   * @param         { String } carStyleObject 飞行器样式
   * @param         { Object } successFn 回调函数
   */
  static cesiumUVA(mapId, path, styleObject, carStyleObject, successFn) {
    const map = this.getMap(mapId)
    return cesiumUVA(map, path, styleObject, carStyleObject, successFn)
  }

  /**
   * @description  : 三维-轨迹回放--播放
   * @param         { Object } car 飞行控件
   */
  static doPlayCesiumUVA(car) {
    doPlayCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--暂停
   * @param         { Object } car 飞行控件
   */
  static pauseCesiumUVA(car) {
    pauseCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--前进
   * @param         { Object } car 飞行控件
   */
  static nextCesiumUVA(car) {
    nextCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--后退
   * @param         { Object } car 飞行控件
   */
  static prevCesiumUVA(car) {
    prevCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--显示
   * @param         { Object } car 飞行控件
   */
  static showCesiumUVA(car) {
    showCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--隐藏
   * @param         { Object } car 飞行控件
   */
  static hideCesiumUVA(car) {
    hideCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--删除
   * @param         { Object } car 飞行控件
   */
  static removeCesiumUVA(car) {
    removeCesiumUVA(car)
  }

  /**
   * @description  : 三维-轨迹回放--添加新路径
   * @param         { String } mapId 地图id
   * @param         { Object } car 飞行控件
   * @param         { Object } styleObject { strokeColor,strokeWeight,strokeOpacity,fillColor,fillOpacity } 样式
   * @param         { Object } carStyleObject 飞行器样式
   */
  static addPathCesiumUVA(mapId, car, path, styleObject, carStyleObject) {
    const map = this.getMap(mapId)
    return addPathCesiumUVA(map, car, path, styleObject, carStyleObject)
  }
  /**
   * @description  : 三维-轨迹回放--拖到进度条
   * @param         { Object } car 飞行控件
   * @param         { Number } value 进度值
   */
  static moveToCesiumUVA(car, value) {
    moveToCesiumUVA(car, value)
  }

  /**
   * @description  : 三维-获取中心的坐标
   * @param         { String } mapId 地图id
   */
  static getCesiumCenter(mapId) {
    const viewer = this.getMap(mapId)
    const dom = this.getCanvasSize(mapId)
    const ray = viewer.camera.getPickRay(
      new Cesium.Cartesian2(dom.width / 2, dom.height / 2)
    )
    const cartesian1 = viewer.scene.globe.pick(ray, viewer.scene)
    const lnglat = Cesium.Cartographic.fromCartesian(cartesian1)
    const longitude = (lnglat.longitude / Math.PI) * 180
    const latitude = (lnglat.latitude / Math.PI) * 180
    return { longitude, latitude }
  }

  static getCanvasSize(mapId) {
    const dom = document.getElementById(mapId)
    return { width: dom.clientWidth, height: dom.clientHeight }
  }

  static getCenter(mapId) {
    const map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      const centerResult = map.camera.pickEllipsoid(
        new Cesium.Cartesian2(
          map.canvas.clientWidth / 2,
          map.canvas.clientHeight / 2
        )
      )
      if (!centerResult) {
        return null
      }
      const curPosition =
        Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
      if (curPosition) {
        const curLongitude = (curPosition.longitude * 180) / Math.PI
        const curLatitude = (curPosition.latitude * 180) / Math.PI
        return [curLongitude, curLatitude]
      }
    } else {
      return transCoordinate(
        map.getView().getCenter(),
        'EPSG:3857',
        'EPSG:4326'
      )
    }
  }

  static convertColorToRGBA(color, alpha = 0.3) {
    // 判断颜色参数是否为十六进制格式
    if (color.startsWith('#')) {
      // 将十六进制颜色转换为RGB值
      const rgb = this.hexToRgb(color.substring(1))
      // 返回RGBA格式的颜色
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    } else {
      return color
    }
  }

  // 辅助函数：将十六进制颜色转换为RGB值
  static hexToRgb(hex) {
    // 提取RGB值
    const rgb = []
    if (hex.length === 7) {
      rgb.push(parseInt(hex.substring(1, 3), 16))
      rgb.push(parseInt(hex.substring(3, 5), 16))
      rgb.push(parseInt(hex.substring(5, 7), 16))
    } else {
      rgb.push(parseInt(`${hex[1]}${hex[1]}`, 16))
      rgb.push(parseInt(`${hex[2]}${hex[2]}`, 16))
      rgb.push(parseInt(`${hex[3]}${hex[3]}`, 16))
    }
    return { r: rgb[0], g: rgb[1], b: rgb[2] }
  }

  /**
   * 铁塔视角三维地图显示打点方法
   *  layerId 图层id
   *  list [{list: [省],},{list: [市],},{list: [区],}]
   */
  static TT3DshowPoints(layerId, list, mapId) {
    if (!this.is3d(mapId)) {
      return
    }
    const map = this.getMap(mapId)
    const massMarks = []
    // 省，市
    list.forEach((item, i) => {
      if (!item.list?.length) {
        return
      }
      const pFlag = i < 2 // 原有的判断条件，意思应该是用于判断嵌套层级是不是在省市范围内

      const _points = []
      const _offset = item.list[0].offset.join() || '24, 24'
      if (pFlag) {
        item.list.forEach((subitem) => {
          if (subitem.count > 0) {
            _points.push([
              `${subitem.longitude},${subitem.latitude}`,
              subitem.id,
              subitem.icon,
              _offset,
              subitem.count
            ])
          }
        })
      } else {
        item.list.forEach((subitem) => {
          _points.push([
            `${subitem.longitude},${subitem.latitude}`,
            subitem.id,
            subitem.icon,
            _offset
          ])
        })
      }

      const params = {
        layerId: layerId,
        points: _points,
        width: item.width,
        height: item.height,
        // clickOption: [{
        //   icon:  list[i].clickIcon,
        //   big: false,
        // }],
        clickBig: false,
        clickIcon: item.clickIcon,
        viewer: map,
        zoom: item.otherZoomMin,
        maxZoom: item.otherZoomMax,
        zIndex: item.zIndex || 0
        // zomm: 10,
      }
      if (pFlag) {
        params.remark = item.remark || {
          fontSize: 14,
          color: 'white',
          offset: [0, 10] // 默认值
        }
      }
      const massMark = new CTMapOl.cesiumComponent.Points(params)
      massMark.addTo({ viewer: map })
      massMarks.push(massMark)
    })
    return massMarks
  }

  // 周边分析弹窗方法（根据坐标计算弹窗位置）
  static peripheryInfoWindow(
    lng,
    lat,
    content,
    popClass,
    offsetX,
    offsetY,
    mapId,
    wAndh
  ) {
    const map = this.getMap(mapId)
    const CTMapType = this.getCTMapType(mapId)
    let infoWindow
    this.closeInfoWindow(mapId) // 关闭地图弹窗
    if (CTMapType === mapTypeConst.sMap) {
      infoWindow = new CTMapOl.cesiumComponent.InforWindow(
        map,
        {
          position: [parseFloat(lng), parseFloat(lat)],
          anchor: ['50%', '100%'],
          offset: [offsetX, offsetY],
          rotate: 0,
          content: content.innerHTML || content,
          selfStyle: true,
          popClass: 'alarmEventInfoWindow ' + popClass,
          isMultiple: false // 多个显示框
        },
        mapId
      )
    } else {
      infoWindow = peripheryOpenInfoWindow(
        map,
        lng,
        lat,
        content,
        popClass,
        offsetX,
        offsetY,
        wAndh
      )
    }
    this.setInfoWindow(infoWindow, mapId)
    return infoWindow
  }

  static setZoom12(lng, lat, mapId) {
    let zoom = this.getZoomLevel(mapId)
    if (zoom < 12) {
      zoom = 12
    }
    this.setZoomAndCenter(lng, lat, zoom, mapId)
  }

  // 初始化图层
  static initLayerTreeClass(rootGeoserverUrl, mapId) {
    const map = this.getMap(mapId)
    const _layerTreeClass = new CTMapOl.extend.WMSLayer(map, {
      // type: 'image', // image模式请求数量更少，但每次更新区域为整个可视范围，可以按需选择模式
      wmsUrl: rootGeoserverUrl + '/wms' // wmsUrl 可后设置
    })
    return _layerTreeClass
  }

  // 设置参数
  static makeParams(list) {
    // 点线面有不同资源
    const styleTypes = {
      POINT: 'layer_style_point', // 点
      MULTIPOINT: 'layer_style_point', // 多点
      LINESTRING: 'layer_style_line', // 线
      MULTILINESTRING: 'layer_style_line', // 多线
      POLYGON: 'alarmEvent_style', // 面
      MULTIPOLYGON: 'alarmEvent_style' // 多面
    }
    const layers = []
    const styles = []
    for (const item of list) {
      layers.push(item.layerNamespace + ':' + item.layerName)
      if (item.geoType) {
        styles.push(styleTypes[item.geoType])
      } else {
        styles.push('alarmEvent_style')
      }
    }
    return {
      layers: layers.join(),
      STYLES: styles.join(),
      ENV: 'opacity1: 0.4'
    }
  }

  // 设置图层
  static setLayerTree(arr, mapId, obj = '') {
    if (this.is3d(mapId)) {
      return false
    }
    let _layerTreeClass = obj
    if (!_layerTreeClass) {
      if (arr?.[0]?.rootGeoserverUrl) {
        _layerTreeClass = this.initLayerTreeClass(
          arr[0].rootGeoserverUrl,
          mapId
        )
      } else {
        return false
      }
    }
    setTimeout(() => {
      const params = this.makeParams(arr)
      _layerTreeClass.updateParams(params)
      if (arr?.length === 0) {
        _layerTreeClass.setVisible(false)
      } else {
        _layerTreeClass.setVisible(true)
      }
    })
    return _layerTreeClass
  }
}
