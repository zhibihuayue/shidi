/* eslint-disable no-undef */
// forestry-pc/src/views/bigScreenNew/CommonMap.js
import CTMapOl from '@ct/ct_map_ol'
import {
  addMarker,
  addScaleLine,
  closeInfoWindow,
  clusterSetViewshed,
  highLightArea,
  initCTMap,
  mapClick,
  mapMousemove,
  openInfoWindow,
  removeClusterViewshed,
  removeHighLightArea,
  setClusterLayerData,
  setPolygon,
  setZoomAndCenter,
  showMarkCluster
} from './map-ol/openLayerCommon.js'
import { transCoordinate } from './map-ol/CommonCtMapOl.js'
import $ from 'jquery'
export const defaultCenters_common = [104.64614, 37.227363]
export const defaultCenter_common = '104.64614, 37.227363'
let centers = defaultCenters_common
const defaultZoom = 5
const defaultZoom_3d = 4
const mapTypeConst = {
  aMap: 'amap', //高德
  tMap: 'tmap', //天地图
  sMap: 'smap', //超图
  mapbox: 'mapbox'
}
const VAType = {
  point: 2, //单个点
  cluster: 1 //点聚合
}
const layerIdStrS = {
  grid: 'layer-grid',
  gridMan: 'layer-gridMan',
  resource: 'layer-resource',
  camera: 'layer-camera',
  provinceCity: 'layer-provinceCity',
  bayonetCamera: 'layer-bayonetCamera',
  alarm: 'layer-alarm',
  partWeather: 'layer-partWeather',
  fire: 'layer-fire',
  wind: 'layer-wind',
  bayonetClickCamera: 'click-layer-bayonetCamera'
}

export const municipalityList = ['110000', '120000', '310000', '500000'] //北京市,天津市,上海市,重庆市

// let CTBaseLayerType = null;
let mapList = {}
let mapInstanceList = {}
let CTMapTypeSObj = {}
let layerGroupsObj = {}
let scaleEntity = {}
let viewableAreasObj = {} //站址和摄像机的可视域对象,key是站址或摄像机编码
let highlightViewableObj = {}
let MouseToolObj = {}
let layerSObj = {}
let massMarkListSObj = {}
let geosObj = {}
let infoWindowList = {}
let locationClusterIdList = {}
let changeIconFeature = {}
let mousePositionControlObj = {}
let highlightObj = {}
let highlightCodeObj = {}
let wmsLayerObj = {}
let zoomChangTimer
let fireWarnPolygonObj = {}
let fireWarnTextObj = {}
let alarmPolygonObj = {}
let alarmTextObj = {}

export default class CommonMap {
  static getMapTypeConst() {
    return mapTypeConst
  }

  static getVAType() {
    return VAType
  }

  static getCTMapType(mapId) {
    return CTMapTypeSObj[mapId]
  }

  static setCTMapType(CTMapType, mapId) {
    CTMapTypeSObj[mapId] = CTMapType
  }

  static getMapInstance(mapId) {
    return mapInstanceList[mapId]
  }

  static setMapInstance(instance, mapId) {
    mapInstanceList[mapId] = instance
  }

  static getMap(mapId) {
    return mapList[mapId]
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

  static getWmsLayers(mapId) {
    return wmsLayerObj[mapId]
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
    let map = this.getMap(mapId)
    let is3dRealTime = this.is3dRealTime(mapId)
    if (is3dRealTime == null) {
      return false
    }
    if (is3dRealTime) {
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
      let mapMap = this.getMapInstance(mapId)
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
    delete MouseToolObj[mapId]
    delete viewableAreasObj[mapId]
    delete infoWindowList[mapId]
    delete locationClusterIdList[mapId]
    delete highlightObj[mapId]
    delete fireWarnPolygonObj[mapId]
    delete fireWarnTextObj[mapId]
    delete alarmPolygonObj[mapId]
    delete alarmTextObj[mapId]
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

  static syncMapByCenterLevel(mapId, center, zoom) {
    let map = this.getMap(mapId)
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

  static getCenterAndLevel(mapId) {
    let map = this.getMap(mapId)
    let center, zoom
    if (this.is3d(mapId)) {
      let pos = CTMapOl.thrdime.cameracontrol.getposition(map)
      let lonlath = Cesium.Cartographic.fromCartesian(pos)
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

  /**
   * 获取加载地图需要参数地图类型和在线离线
   */
  static getInitMapParam(mapTypeIndex, successFn, mapId) {
    //注意: 此处沿用之前代码, 只用于判断是否三维, 不代表加载的地图是高德
    if (mapTypeIndex < 3) {
      this.setCTMapType(mapTypeConst.aMap, mapId) //默认高德
      successFn()
    } else {
      this.setCTMapType(mapTypeConst.sMap, mapId) //默认超图
      // CTBaseLayerType = null;
      successFn()
    }
  }

  /**
   * 初始化路网图层
   */
  static initRoadNetLayer(mapId) {
    let map = this.getMap(mapId)
    map.showInitLayer()
    let layerG = this.getLayerGroup(mapId)
    if (layerG) {
      layerG.hide()
      return false
    }
  }

  /**
   * 初始化卫星图层
   */
  static initSatelliteLayer(mapId) {
    let map = this.getMap(mapId)
    map.hideInitLayer()
    let layerG = this.getLayerGroup(mapId)
    if (layerG) {
      layerG.show()
      return false
    }
    let mapInstance = this.getMapInstance(mapId)
    const satellite = mapInstance.Satellite({
      zIndex: -1
    })

    let layer = mapInstance.LayerGroup({ layers: [satellite] })
    this.setLayerGroup(layer, mapId)
    layer.setMap({ map: map })
    layer.hide()
    layer.show()
  }

  /**
   * 三维图层类  TerrainProvider三维地形图层
   */
  static initTerrainProvider(mapId) {
    let map = this.getMap(mapId)
    let mapInstance = this.getMapInstance(mapId)
    if (map) {
      map.removeAllLayers()
    }
    let terrainProvider = mapInstance.TerrainProvider({
      viewer: map,
      zIndex: 1
    })
    terrainProvider.addToMap()
  }

  /**
   * 三维图层 二维地形图
   */
  static initSTileLayer(mapId) {
    let map = this.getMap(mapId)
    let mapInstance = this.getMapInstance(mapId)
    if (map) {
      map.removeAllLayers()
    }
    let STileLayer = mapInstance.STileLayer({
      type: 'supermap',
      opacity: 1
    })
    STileLayer.addTo({ viewer: map, zIndex: 10 })
  }

  /**
   * 默认初始化加载地图
   */
  static initDefaultMap(mapId, mapTypeIndex, successFn) {
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

  static initCTMap(mapId, center, mapTypeIndex, zoom, successFn) {
    let CTMapType = this.getCTMapType(mapId)
    this.restoreVariables(mapId)

    if (CTMapType === 'smap') {
      let options = {
        domId: mapId,
        server: 'tdt',
        tile: mapTypeIndex === 3 ? 'satellite' : 'heightmap', // 影像、矢量
        center: center,
        zoom: zoom,
        minZoom: 4,
        maxZoom: 18
      }
      CTMapOl.loadCesium(options, (olMap) => {
        let viewer = olMap._viewer
        this.setMap(viewer, mapId)
        this.setMapInstance(olMap, mapId)
        this.executeFunction(successFn, viewer, CTMapType, olMap)

        this.addMoveEndEvent(viewer)
      })
    } else {
      $('#map-id-scale-line-div').html('')
      const { mapMap, map } = initCTMap(mapId, null, mapTypeIndex, zoom)
      this.setMap(map, mapId)
      this.setMapInstance(mapMap, mapId)

      addScaleLine(
        map,
        `${mapId}-scaleLine map-id-scale-line`,
        88,
        'map-id-scale-line-div'
      ) //添加比例尺

      this.executeFunction(successFn, map, CTMapType, mapMap)
    }
  }
  static addMoveEndEvent(viewer) {
    let scalevalue
    let cameracontrol = CTMapOl.thrdime.cameracontrol
    cameracontrol.addmoveEndevent(viewer, () => {
      let height = Cesium.Cartographic.fromCartesian(
        viewer.camera.position
      ).height
      if (height) {
        let canvasWidth = viewer.scene._canvas.clientWidth
        scalevalue = (height * 2 * 124) / 1000 / canvasWidth
        console.log(scalevalue, 'scalevalue')
        if (scalevalue < 1) {
          let value = Math.round(scalevalue * 1000)
          scalevalue = this.padding1(value) + 'm'
        } else {
          let value = Math.round(scalevalue)
          scalevalue = this.padding1(value) + 'km'
        }
      }
      let scaleHtml = `<div class="map-id-scale-line ol-unselectable" style="pointer-events: none;width: 124px;">
                <div class="map-id-scale-line-inner">${scalevalue}</div>
              </div>`
      $('#map-id-scale-line-div').html(scaleHtml)
    })
  }

  static padding1(num) {
    let numStr = num.toString()
    if (numStr.length > 2) {
      let str0 = '0'
      for (let i = 0; i < numStr.length - 3; i++) {
        str0 = str0 + '0'
      }
      console.log(str0, numStr.length - 1)
      return numStr.slice(0, -(numStr.length - 2)) + str0
    } else {
      return num
    }
  }

  static addZoom(mapId) {
    let map = this.getMap(mapId)
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
    let map = this.getMap(mapId)
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
    let map = this.getMap(mapId)
    console.log('zoomNum')
    CTMapOl.api.setZoom(map, zoomNum)
  }

  /**
   * 摄像机的可视域范围
   * distance可视距离
   * type 同顶部常量VAType
   */
  static initViewableArea(params, mapId, successFn) {
    let map = this.getMap(mapId)
    let {
      longitude,
      latitude,
      distance,
      horizontalView,
      direction,
      deviceCode,
      siteCode,
      type,
      categoryCode,
      color3d,
      viewDistanceColor,
      viewAngleColor,
      innerOpacity,
      outOpacity,
      innerlineOpacity
    } = params

    let viewableArea = this.getViewableArea(mapId)
    if (
      viewableArea[`${deviceCode}_${VAType.point}`] ||
      viewableArea[`${deviceCode}_${VAType.cluster}`]
    ) {
      console.log(`已经显示了${deviceCode}该设备的可视域`)
      return false
    }
    console.log(`initViewableArea显示${deviceCode}设备的可视域`)
    if (this.is3d(mapId)) {
      let param = {
        viewer: map,
        lng: longitude,
        lat: latitude,
        horizontalView: horizontalView,
        distance: distance,
        direction: direction,
        outColor: color3d,
        outOpacity: outOpacity, // 新增参数，外部填充色的透明度
        innerColor: color3d,
        innerOpacity: innerOpacity,
        innerlineColor: color3d,
        innerlineOpacity: innerlineOpacity,
        outlineColor: color3d, // 新增参数，外部线颜色
        outlineWidth: 2, // 新增参数，外部线宽度
        outlineOpacity: 0.2 // 新增参数，外部线的透明度，不可设为0 可设为一个很小的数值，比如0.001
      }
      if (+categoryCode === 2) {
        param.outlineOpacity = 0.0001 //0不生效
        param.outOpacity = 0.0001
        param.innerlineOpacity = innerOpacity
        param.innerOpacity = innerOpacity
      }
      let viewshed = new CTMapOl.cesiumComponent.ViewShed2D(map, param)
      this.setViewableAreaById(`${deviceCode}_${type}`, viewshed, mapId)
      this.executeFunction(successFn, viewshed)
    } else {
      let layer = this.getLayers(mapId)
      let layerId = CommonMap.getLayerIdStrS().camera
      if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
        let angle = horizontalView
        let ishalf = 0
        if (+categoryCode === 2) {
          ishalf = 1
        }
        clusterSetViewshed(layer[layerId], {
          idKey: 'id',
          idValue: siteCode,
          guid: deviceCode,
          longitude: longitude,
          latitude: latitude,
          distance: distance * 1000,
          heading: direction,
          angle: angle,
          ishalf: ishalf,
          viewDistanceColor: viewDistanceColor,
          viewAngleColor: viewAngleColor
        })
        this.setViewableAreaById(
          `${deviceCode}_${type}`,
          {
            idKey: 'id',
            idValue: siteCode,
            guid: deviceCode,
            longitude: longitude,
            latitude: latitude,
            distance: distance * 1000,
            heading: direction,
            angle: angle,
            ishalf: ishalf,
            viewDistanceColor: viewDistanceColor,
            viewAngleColor: viewAngleColor
          },
          mapId
        )
        this.executeFunction(successFn)
      }
    }
  }

  /**
   * 转动摄像机可视范围
   * @param deviceCode
   * @param direction
   * @param mapId
   */
  static updateViewableArea(deviceCode, direction, mapId) {
    let viewableArea = this.getViewableArea(mapId)
    if (this.is3d(mapId)) {
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
    } else {
      if (viewableArea[`${deviceCode}_${VAType.cluster}`]) {
        viewableArea[`${deviceCode}_${VAType.cluster}`].direction = direction
        viewableArea[`${deviceCode}_${VAType.cluster}`].heading = direction
        this.updateViewableAreaOpenLayer(
          viewableArea[`${deviceCode}_${VAType.cluster}`],
          mapId
        )
      }
      if (viewableArea[`${deviceCode}_${VAType.point}`]) {
        viewableArea[`${deviceCode}_${VAType.point}`].direction = direction
        viewableArea[`${deviceCode}_${VAType.cluster}`].heading = direction
        this.updateViewableAreaOpenLayer(
          viewableArea[`${deviceCode}_${VAType.point}`],
          mapId
        )
      }
    }
  }

  static updateViewableAreaOpenLayer(params, mapId) {
    let layer = this.getLayers(mapId)
    let layerId = CommonMap.getLayerIdStrS().camera
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      clusterSetViewshed(layer[layerId], params)
      console.log(`更新设备的可视域`, params)
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
    let viewableArea = this.getViewableArea(mapId)
    const list = Object.entries(viewableArea)
    if (!(list && list.length > 0)) {
      return false
    }
    let deleteList = []
    let ids = []
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
  static clearViewableArea(deviceCode, siteCode, mapId) {
    let CTMapType = this.getCTMapType(mapId)
    let layer = this.getLayers(mapId)
    let viewableArea = this.getViewableArea(mapId)
    const list = Object.entries(viewableArea)
    if (!(list && list.length > 0)) {
      return false
    }
    if (CTMapType === mapTypeConst.sMap) {
      //三维
      for (const listElement of list) {
        if (listElement[0].split('_')[0] === deviceCode) {
          listElement[1].remove()
          delete viewableArea[listElement[0]]
        }
      }
      return false
    }

    //二维
    let layerId = CommonMap.getLayerIdStrS().camera
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      removeClusterViewshed(layer[layerId], {
        idKey: 'id',
        idValue: siteCode,
        guid: deviceCode
      })
      console.log(
        `删除设备的可视域siteCode:${siteCode},deviceCode:${deviceCode}`
      )
      //三维
      for (const listElement of list) {
        if (listElement[0].split('_')[0] === deviceCode) {
          delete viewableArea[listElement[0]]
        }
      }
    }
  }

  /**
   * 移除指定id数组的可视范围
   * @param ids
   * @param mapId
   */
  static removeViewSheds(ids, mapId) {
    let is3dRealTime = this.is3dRealTime(mapId)
    if (is3dRealTime == null) {
      return false
    }
    if (is3dRealTime) {
      for (const entity of ids) {
        entity.remove()
      }
    } else {
      let layer = this.getLayers(mapId)
      let layerId = CommonMap.getLayerIdStrS().camera
      if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
        for (const item of ids) {
          removeClusterViewshed(layer[layerId], {
            idKey: item.idKey,
            idValue: item.idValue,
            guid: item.guid
          })
        }
      }
    }
  }

  /**
   * 获取当前地图层级
   */
  static getZoom(successFn, mapId) {
    let map = this.getMap(mapId)
    let zoom
    if (this.is3d(mapId)) {
      zoom = CTMapOl.thrdime.cameracontrol.getZoom(map)
    } else {
      zoom = map.getView().getZoom()
    }
    this.executeFunction(successFn, zoom)
  }

  static getZoomLevel(mapId) {
    let map = this.getMap(mapId)
    let zoom
    if (this.is3d(mapId)) {
      zoom = CTMapOl.thrdime.cameracontrol.getZoom(map)
    } else {
      zoom = map.getView().getZoom()
    }
    return zoom
  }

  static getCenter(mapId) {
    let map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      let centerResult = map.camera.pickEllipsoid(
        new Cesium.Cartesian2(
          map.canvas.clientWidth / 2,
          map.canvas.clientHeight / 2
        )
      )
      if (!centerResult) {
        return null
      }
      let curPosition =
        Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
      if (curPosition) {
        let curLongitude = (curPosition.longitude * 180) / Math.PI
        let curLatitude = (curPosition.latitude * 180) / Math.PI
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

  /**
   * 还原可视域颜色
   */
  static resetViewableColor(params, mapId, successFn) {
    let highlightViewable = this.getHighlightViewable(mapId)
    let viewableArea = this.getViewableArea(mapId)
    //二维改造后没有可视域更新也出现可视域了,增加校验
    let hasViewableAreaFlag =
      viewableArea[`${highlightViewable}_${VAType.point}`] ||
      viewableArea[`${highlightViewable}_${VAType.cluster}`]
    if (highlightViewable && hasViewableAreaFlag) {
      this.updateViewableColor(
        {
          deviceCode: highlightViewable,
          ...params
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
   * deviceCode 设备编码
   * flag:不存在可视域时是否新增
   * mapId
   */
  static highlightViewableColor(params, mapId) {
    if (!params.deviceCode) {
      return false
    }
    setTimeout(() => {
      this.resetViewableColor(
        {
          color3d: params.colorReset,
          innerOpacity: params.innerOpacity,
          outOpacity: params.outOpacity,
          innerlineOpacity: params.innerlineOpacity,
          viewDistanceColor: params.viewDistanceColorReset,
          viewAngleColor: params.viewAngleColorReset
        },
        mapId
      )
      //高亮当前设备颜色
      this.highlightViewableColorAwait(
        params,
        (resp) => {
          this.setHighlightViewable(resp, mapId)
        },
        mapId
      )
    })
  }
  static highlightViewableColorAwait(params, successFn, mapId) {
    this.updateViewableColor(
      {
        ...params,
        isHighlight: true
      },
      (resp) => {
        if (!resp) {
          //可视域还没生成
          setTimeout(() => {
            this.highlightViewableColorAwait(params, successFn, mapId)
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
    let { deviceCode, color3d } = params

    const viewshed = this.getViewableAreaObjByDeviceCode(deviceCode, mapId)
    if (viewshed == null) {
      //没有显示的可视域
      this.executeFunction(successFn, null)
      return false
    }
    if (this.is3d(mapId)) {
      let param = {
        outColor: color3d,
        innerColor: color3d,
        innerlineColor: color3d,
        outlineColor: color3d // 新增参数，外部线颜色
      }
      viewshed.setOptions(param)
      if (params.isHighlight) {
        viewshed.top(50)
      } else {
        viewshed.restore()
      }
    } else {
      let layer = this.getLayers(mapId)
      let layerId = CommonMap.getLayerIdStrS().camera
      if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
        viewshed.viewDistanceColor = params.viewDistanceColor
        viewshed.viewAngleColor = params.viewAngleColor
        const feature = clusterSetViewshed(layer[layerId], viewshed)
        this.setViewableAreaById(
          `${deviceCode}_${viewshed.type}`,
          viewshed,
          mapId
        )
        if (!feature) {
          return false
        }
        let flag = false
        if (params.isHighlight) {
          flag = true
        }
        feature.set('selected', flag)
      }
    }

    this.executeFunction(successFn, deviceCode)
  }

  static getViewableAreaObjByDeviceCode(deviceCode, mapId) {
    let viewableArea = this.getViewableArea(mapId)
    let viewableAreaObj
    if (viewableArea[`${deviceCode}_${VAType.point}`]) {
      viewableAreaObj = viewableArea[`${deviceCode}_${VAType.point}`]
      viewableAreaObj.type = VAType.point
    }
    if (viewableArea[`${deviceCode}_${VAType.cluster}`]) {
      viewableAreaObj = viewableArea[`${deviceCode}_${VAType.cluster}`]
      viewableAreaObj.type = VAType.cluster
    }
    return viewableAreaObj
  }

  /**
   * 监听地图层级改变
   */
  static watchZoomChange(successFn, mapId) {
    let map = this.getMap(mapId)
    let mapMap = this.getMapInstance(mapId)
    if (this.is3d(mapId)) {
      mapMap.on('zoomChange', (resp) => {
        clearTimeout(zoomChangTimer)
        zoomChangTimer = setTimeout(() => {
          this.executeFunction(successFn, resp)
        }, 300)
      })
    } else {
      map.on('moveend', (resp) => {
        clearTimeout(zoomChangTimer)
        zoomChangTimer = setTimeout(() => {
          this.executeFunction(successFn, resp)
        }, 300)
      })
    }
  }

  /**
   * 监听获取地图层级
   */
  static watchAndGetZoom(successFn, mapId) {
    this.executeFunction(successFn, this.getZoomLevel(mapId))
    let map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      CTMapOl.thrdime.cameracontrol.addmoveEndevent(map, () => {
        this.executeFunction(successFn, this.getZoomLevel(mapId))
      })
    } else {
      map.on('moveend', () => {
        this.executeFunction(successFn, this.getZoomLevel(mapId))
      })
    }
  }

  static mapClick(mapId, successFn) {
    let map = this.getMap(mapId)
    let mapInstance = this.getMapInstance(mapId)
    if (mapInstance) {
      if (this.is3d(mapId)) {
        mapInstance.on('click', successFn)
      } else {
        mapClick(map, successFn)
      }
    } else {
      setTimeout(() => {
        this.mapClick(mapId, successFn)
      }, 500)
    }
  }

  /**
   * 当前是否是三维地图
   */
  static is3d(mapId) {
    let CTMapType = this.getCTMapType(mapId)
    if (CTMapType != null) {
      return CTMapType === mapTypeConst.sMap
    } else {
      setTimeout(() => {
        this.is3d(mapId)
      }, 200)
    }
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

  static is3dRealTime(mapId) {
    let CTMapType = this.getCTMapType(mapId)
    if (CTMapType != null) {
      return this.is3d(mapId)
    } else {
      return null
    }
  }

  static awaitMapLoad(mapId, successFn) {
    let map = this.getMap(mapId)
    if (map != null) {
      successFn()
    } else {
      setTimeout(() => {
        this.awaitMapLoad(mapId, successFn)
      }, 100)
    }
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
    let map = this.getMap(mapId)

    let clusterMaxZoom = clusterImgItem.clusterMaxZoom
    //数据处理成方法要的格式
    const list = this.formatClusterList(dataList, attrObj, iconObj, mapId)

    //显示数据
    if (this.is3d(mapId)) {
      const params = {
        map,
        dataOptions: list,
        MarkerClusterOptions: {
          clusterId: layerId,
          gridSize: 80, // 聚合网格像素大小
          offsetBottom: true,
          sourceType: layerId,
          clickBig: false,
          offset: clusterImgItem.clusterOffset,
          zIndex: 0
        }
      }
      if (clusterMaxZoom != null) {
        params.MarkerClusterOptions.maxZoom = clusterMaxZoom
      } else {
        params.MarkerClusterOptions.maxZoom = 18
      }
      let textOffset
      textOffset = [0, 8]
      if (clusterImgItem) {
        params.MarkerClusterOptions.styles = [
          {
            url: clusterImgItem.clusterImg,
            size: [
              clusterImgItem.clusterImgWidth,
              clusterImgItem.clusterImgHeight
            ],
            textColor: 'white',
            offset: [-24, -24],
            textSize: 14,
            textOffset: textOffset
          }
        ]
      }
      console.log('点聚合params', params)
      let cluster = new CTMapOl.cesiumComponent.MarkerCluster(map, params)
      if (iconObj.clickFn) {
        CommonMap.clusterMarkerClick(cluster, layerId, iconObj.clickFn)
      }
      this.setLayers(layerId, cluster, mapId)
      this.executeFunction(successFn, cluster)
    } else {
      showMarkCluster(
        map,
        {
          list,
          clickFn: iconObj.clickFn,
          clusterImgItem: clusterImgItem,
          clusterMaxZoom: clusterMaxZoom
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

  static showTTProvinceAndCityCluster(
    layerId,
    provinceParam,
    cityParam,
    deviceParam,
    successFn,
    mapId
  ) {
    let layer = this.getLayers(mapId)
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      return false
    }
    let map = this.getMap(mapId)
    //数据处理成方法要的格式
    showMarkCluster(map, deviceParam, provinceParam, cityParam, (cluster) => {
      this.setLayers(layerId, cluster, mapId)
      this.executeFunction(successFn, cluster)
    })
  }

  static setClusterLayerData(list, attrObj, iconObj, mapId) {
    let layer = this.getLayers(mapId)
    let layerId = CommonMap.getLayerIdStrS().camera
    const dList = this.formatClusterList(list, attrObj, iconObj, mapId)
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      setClusterLayerData(layer[layerId], dList)
    }
  }

  /**
   * 二维openlayer清除点聚合
   * @param layerId
   * @param mapId
   */
  static removeClusterData(layerId, mapId) {
    let layer = this.getLayers(mapId)
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      layer[layerId].destroy()
      delete layer[layerId]
    }
  }
  /**
   * 点聚合数据格式化
   */
  static formatClusterList(list, attrObj, iconObj, mapId) {
    const { longitudeAttr, latitudeAttr, idAttr } = attrObj
    const { imgPath, pointImgWidth, pointImgHeight, iconOffset } = iconObj
    let returnList = []
    for (const item of list) {
      const longitude = item[longitudeAttr]
      const latitude = item[latitudeAttr]
      const id = item[idAttr]
      let idStr = id
      if (!(longitude && latitude && id)) {
        continue
      }

      const icon =
        attrObj.iconAttr != null ? item[attrObj.iconAttr] || imgPath : imgPath
      const clickIcon =
        attrObj.clickIconAttr != null ? item[attrObj.clickIconAttr] : icon
      let param
      if (this.is3d(mapId)) {
        //三维
        param = {
          weight: 8,
          icon: icon,
          iconSize: [pointImgWidth, pointImgHeight],
          offset: iconOffset,
          iconOffset: iconOffset,
          clickIcon: clickIcon,
          clickBig: false,
          arFlag: item.arFlag,
          onlineFlag: item.onlineFlag
        }
        if (attrObj.clickable != null) {
          param.clickable = attrObj.clickable
        }
        param.id = idStr
        param.lnglat = [Number(longitude), Number(latitude)]
      } else {
        param = {
          id: idStr,
          longitude: Number(longitude),
          latitude: Number(latitude),
          iconSize: [pointImgWidth, pointImgHeight],
          icon: icon,
          clickIcon: clickIcon,
          offset: iconOffset,
          arFlag: item.arFlag,
          onlineFlag: item.onlineFlag
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
    let layer = this.getLayers(mapId)
    try {
      if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
        layer[layerId].remove()
        this.setLayers(layerId, null, mapId)
      }
    } catch (e) {
      //防止removeMarkCluster报错
      console.log('removeMarkCluster报错', e)
    }
  }
  static isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
  static restoreMarkCluster(layerId, mapId) {
    let layer = this.getLayers(mapId)
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      let is3dRealTime = this.is3dRealTime(mapId)
      if (is3dRealTime == null) {
        return false
      }
      if (is3dRealTime) {
        layer[layerId].restore()
      } else {
        layer[layerId].deSelectCamera()
      }
    }
  }

  static restoreMass(layerId, mapId) {
    let massMarkList = this.getMassMarkList(mapId)
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
  static massMarkClick(massMark, mapId, successFn) {
    massMark.on('click', (resp) => {
      let id = resp
      if (this.is3d(mapId)) {
        id = resp.id
      }
      this.executeFunction(successFn, id)
    })
  }

  /**
   * 获取当前屏幕可见的摄像头id
   */
  static getCameraPoint(siteDeviceList, successFn, mapId) {
    setTimeout(() => {
      let layer = this.getLayers(mapId)
      let layerId = CommonMap.getLayerIdStrS().camera
      if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
        if (this.is3d(mapId)) {
          layer[layerId].getViewMarkers()
        } else {
          let resp = layer[layerId].getUnClusteredItems()
          if (resp.length > 0) {
            const idArray = resp.map((obj) => obj.id)
            const list = this.handleReturnIds(idArray, siteDeviceList)
            this.executeFunction(successFn, list)
          } else {
            this.executeFunction(successFn, [])
          }
        }
      }
    })
  }

  /**
   * 处理返回的数据
   */
  static handleReturnIds(resp, siteDeviceList) {
    const ids = resp
    const list = []
    for (const item of ids) {
      if (siteDeviceList[item]) {
        list.push(...siteDeviceList[item])
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
  static showMassMark(layerId, list, attrObj, iconObj, successFn, mapId) {
    let mapInstance = this.getMapInstance(mapId)
    let map = this.getMap(mapId)
    const { imgWidth, imgHeight, remark } = iconObj
    const { points, clickOption } = this.formatMassMarkList(
      list,
      attrObj,
      iconObj
    )
    let params
    let massMark
    if (this.is3d(mapId)) {
      params = {
        layerId: layerId,
        points: points,
        width: imgWidth,
        height: imgHeight,
        clickOption: clickOption,
        viewer: map
      }
      if (remark) {
        params.remark = remark
      }
      massMark = new CTMapOl.cesiumComponent.Points(params)
      massMark.addTo({ viewer: map })
    } else {
      params = {
        position: points,
        zoom: 11, //层级控制显隐
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
    let map = this.getMap(mapId)
    if (this.is3d(mapId)) {
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
    let massMarkList = this.getMassMarkList(mapId)
    try {
      if (massMarkList[layerId]) {
        massMarkList[layerId].remove()
        this.setMassMarkList(layerId, null, mapId)
      }
    } catch (e) {
      //防止removeMassMark报错
      console.log('removeMassMark报错', e)
    }
  }

  /**
   * 点聚合数据格式化
   * attrObj {longitudeAttr 经度字段名,latitudeAttr纬度字段名,idAttr:id字段名,statusAttr状态字段名(非必填),iconAttr图标字段名(资源用)}
   */
  static formatMassMarkList(list, attrObj, iconObj) {
    const { imgPath, iconOffset } = iconObj
    let points = []
    let clickOption = []
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
      const remarkText =
        attrObj.remarkTextAttr != null ? item[attrObj.remarkTextAttr] : ''
      const param = [
        `${longitude},${latitude}`,
        idStr,
        icon,
        offset,
        remarkText
      ]
      points.push(param)
      clickOption.push({
        icon: clickIcon,
        big: false
      })
    }
    return { points, clickOption }
  }

  static locationTo(lng, lat, height, mapId) {
    let map = this.getMap(mapId)
    let mapInstance = this.getMapInstance(mapId)
    if (!this.getGeoEntity(mapId)) {
      geosObj[mapId] = mapInstance.SGeolocation({ viewer: map })
    }
    this.getGeoEntity(mapId).locationTo({ lng: lng, lat: lat, height: height })
  }

  static setZoomAndCenter(lng, lat, zoom, mapId) {
    let map = this.getMap(mapId)
    if (map) {
      if (this.is3d(mapId)) {
        if (zoom === 5) {
          //三维的地图太大
          zoom = 4
        }
        let pos = new Cesium.Cartesian3.fromDegrees(
          parseFloat(lng),
          parseFloat(lat),
          CTMapOl.thrdime.cameracontrol.zoomToHeight(zoom)
        )
        CTMapOl.thrdime.cameracontrol.flyTo(
          map,
          CTMapOl.thrdime.cameracontrol.getflyTooptions(
            pos,
            {
              heading: Cesium.Math.toRadians(0), //朝向
              pitch: Cesium.Math.toRadians(-90.0) //仰俯
            },
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
    let map = this.getMap(mapId)
    const width = imgObj.imgWidth
    const height = imgObj.imgHeight
    if (this.is3d(mapId)) {
      const offset = imgObj.offset
        ? [Math.abs(imgObj.offset[0]), Math.abs(imgObj.offset[1])]
        : [24, 48]
      const params = {
        viewer: map,
        lng: Number(lng),
        lat: Number(lat),
        eheight: 0,
        imgPath: imgObj.imgPath,
        iconSize: [width, height],
        offset: offset,
        clickBig: false
      }
      params.zIndex = 50
      if (imgObj.zIndex) {
        params.zIndex = imgObj.zIndex
      }
      if (id != null) {
        params.id = id
      }
      if (imgObj.remark) {
        params.remark = imgObj.remark
      }

      let marker = new CTMapOl.cesiumComponent.Point(map, params)
      this.viewerSetOrAddToMap(marker, mapId)
      if (clickFn) {
        this.massMarkClick(marker, mapId, clickFn)
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
      pointEntity.remove()
    } else {
      pointEntity.destroy()
    }
  }

  /**
   * 坐标拾取
   * @param eventName 监听事件
   * @param fn （返回参数 lng，lat, height）
   * @param mapId
   */
  static pickMapCoor(eventName, fn, mapId) {
    let map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      this.startPick(fn)
    } else {
      if (eventName === 'click') {
        const _this = this
        let clickHandler = function (evt) {
          let lngLat = evt.coordinate
          map.un('click', clickHandler)
          _this.executeFunction(fn, { lng: lngLat[0], lat: lngLat[1] })
        }
        map.on('click', clickHandler)
      }
    }
  }
  /**
   * ar首页地图-工具箱-坐标拾取
   */
  static pickMapCoor2(eventName, fn, mapId, mouseType = 3) {
    // let map = this.getMap(mapId);
    let CTMapType = this.getCTMapType(mapId)
    // let lng = null;
    // let lat = null;
    this.initMouseTool(
      (toolMeasure) => {
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
      {},
      fn
    )
  }
  /**
   * ar首页地图-工具箱-关闭测距或者测面
   */
  static closeRule(mapId, mouseType = 1) {
    let toolMeasure = MouseToolObj[mapId + '_' + mouseType]
    if (!toolMeasure) {
      return false
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
   *  ar首页地图-工具箱-关闭鼠标功能并清除覆盖物
   * @param successFn 成功回调
   * @param ifClear 是否清除覆盖物
   * @param mapId
   */
  static cleanMouseTool(successFn, ifClear, mapId) {
    let CTMapType = this.getCTMapType(mapId)
    if (ifClear == null) {
      ifClear = true
    }
    if (ifClear) {
      //this.deleteDefaultMarker();
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
  /**
   * ar首页地图-工具箱-初始化MouseTool
   */
  static initMouseTool(successFn, mapId, mouseType, options, fn) {
    let map = this.getMap(mapId)
    // 设置未操作中，防止看这里等操作触发地图点击事件
    map._inOperation = true
    let CTMapType = this.getCTMapType(mapId)
    if (CTMapType === mapTypeConst.sMap) {
      this.initMouseToolIsSmap(successFn, mapId, mouseType, options, fn, map)
    } else {
      this.initMouseToolIsNotSmap(successFn, mapId, mouseType, options, fn, map)
    }
  }
  /**
   * ar首页地图-工具箱-初始化MouseTool-功能拆分-天地图
   */
  static initMouseToolIsSmap(successFn, mapId, mouseType, options, fn, map) {
    let toolMeasure = MouseToolObj[mapId + '_' + mouseType]
    // 1、测距 2、测面
    if (mouseType == 1 || mouseType == 2) {
      toolMeasure = new CTMapOl.cesiumComponent.MouseTool(map)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else if (mouseType == 3 || mouseType == 5) {
      // 3、坐标拾取
      toolMeasure = CTMapOl.thrdime.cameracontrol.startpickcood(map, (e, f) => {
        console.log(e, f)
        let lng = (f.longitude / Math.PI) * 180
        let lat = (f.latitude / Math.PI) * 180
        let height = f.height
        this.executeFunction(fn, { lng, lat, height: height })
      })
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else if (mouseType == 4) {
      // 4、坐标定位 暂时不知道是否有API，先不处理，外面自己打点
      this.executeFunction(successFn, toolMeasure)
    } else {
      console.log('initMouseToolIsSmap')
    }
  }
  /**
   * ar首页地图-工具箱-初始化MouseTool-功能拆分-非天地图
   */
  static initMouseToolIsNotSmap(successFn, mapId, mouseType, options, fn, map) {
    MouseToolObj[mapId + '_' + 1] && MouseToolObj[mapId + '_' + 1].stop()
    MouseToolObj[mapId + '_' + 2] && MouseToolObj[mapId + '_' + 2].stop()
    let toolMeasure = MouseToolObj[mapId + '_' + mouseType]
    if (toolMeasure) {
      if (mouseType == 1 || mouseType == 2) {
        this.executeFunction(successFn, toolMeasure)
      }
      return false
    }
    // 1、测距 2、测面
    if (mouseType == 1 || mouseType == 2) {
      // 不要在 data 中定义 measure 变量，无需响应式
      toolMeasure = new CTMapOl.extend.ToolMeasure(map, options)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else if (mouseType == 3) {
      // 3、坐标拾取
      let lng = null
      let lat = null
      // 不要在 data 中定义 location 变量，无需响应式
      toolMeasure = new CTMapOl.extend.ToolLocation(map, {
        notOnStopClick: true, //是否需要阻止坐标拾取
        onPick: (coords) => {
          // 单坐标转换指定投影系
          let coordinate = transCoordinate(coords, 'EPSG:3857', 'EPSG:4326')
          lng = coordinate[0]
          lat = coordinate[1]
          this.executeFunction(fn, { lng, lat, height: null })
        }
      })
      // 取消鼠标跟谁的图标
      toolMeasure._draw.overlay_.setStyle(null)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else if (mouseType == 4) {
      // 4、坐标定位
      let lng = null
      let lat = null
      // 不要在 data 中定义 location 变量，无需响应式
      toolMeasure = new CTMapOl.extend.ToolLocation(map, {
        onPick: (coords) => {
          lng = coords[0]
          lat = coords[1]
        }
      })
      // 取消鼠标跟谁的图标
      toolMeasure._draw.overlay_.setStyle(null)
      MouseToolObj[mapId + '_' + mouseType] = toolMeasure
      this.executeFunction(successFn, toolMeasure)
    } else {
      console.log('initMouseToolIsNotSmap')
    }
  }
  /**
   *  ar首页地图-工具箱-初始化热力图
   */
  static initHeatmap(mapId) {
    let map = this.getMap(mapId)
    let heatSource
    if (this.is3d(mapId)) {
      // console.log("===HeatMapCesium===",CTMapOl.cesiumComponent.CesiumHeatmap)
      heatSource = new CTMapOl.cesiumComponent.CesiumHeatmap(map)
    } else {
      heatSource = new CTMapOl.source.Vector()
      let heatLayer = new CTMapOl.layer.Heatmap({
        source: heatSource,
        blur: 20, //模糊属性
        radius: 6, //半径
        gradient: ['#4F9FFF', '#3DF4FF', '#FFEE63', '#FF4646'],
        zIndex: -1
      })
      map.addLayer(heatLayer)
    }
    return heatSource
  }
  static startPick(mapId, successFn) {
    let map = this.getMap(mapId)
    let CesiumEventHandlerClick = CTMapOl.thrdime.cameracontrol.startpickcood(
      map,
      (e, f) => {
        successFn({
          lng: (f.longitude / Math.PI) * 180,
          lat: (f.latitude / Math.PI) * 180
        })
        this.endPick(CesiumEventHandlerClick)
      }
    )
  }
  static endPick(CesiumEventHandlerClick) {
    CTMapOl.thrdime.cameracontrol.stoppickcood(viewer, CesiumEventHandlerClick)
  }

  static mapMousemove(mapId, successFn) {
    let map = this.getMap(mapId)
    if (this.is3d(mapId)) {
      let CesiumEventHandlermove = new Cesium.ScreenSpaceEventHandler(
        map.scene.canvas
      )
      CesiumEventHandlermove.setInputAction((movement2) => {
        let ray = map.camera.getPickRay(movement2.endPosition)
        let cartesian1 = map.scene.globe.pick(ray, map.scene)
        let lnglat = Cesium.Cartographic.fromCartesian(cartesian1)
        let longitude = (lnglat.longitude / Math.PI) * 180
        let latitude = (lnglat.latitude / Math.PI) * 180
        successFn({
          longitude,
          latitude,
          height: lnglat.height.toFixed(0)
        })
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    } else {
      if (mousePositionControlObj[mapId]) {
        map.removeControl(mousePositionControlObj[mapId])
        mousePositionControlObj[mapId] = null
      }
      mousePositionControlObj[mapId] = mapMousemove(map)
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

  static infoWindow(lng, lat, content, popClass, offsetX, offsetY, mapId) {
    let map = this.getMap(mapId)
    let infoWindow
    this.closeInfoWindow(mapId) //关闭地图弹窗
    if (this.is3d(mapId)) {
      let info = document.createElement('div')
      info.className = 'content-window-card'
      info.onmousewheel = function (e) {
        e.stopPropagation()
      }
      info.innerHTML = content
      infoWindow = new CTMapOl.cesiumComponent.InforWindow(
        map,
        {
          position: [parseFloat(lng), parseFloat(lat)],
          anchor: ['50%', '100%'],
          offset: [offsetX, offsetY],
          rotate: 0,
          content: info,
          selfStyle: true,
          popClass: popClass,
          isMultiple: false //多个显示框
        },
        mapId
      )
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
    this.setInfoWindow(infoWindow, mapId)
  }
  static closeInfoWindow(mapId) {
    let infoWindow = this.getInfoWindow(mapId)
    let is3dRealTime = this.is3dRealTime(mapId)
    if (is3dRealTime == null) {
      return false
    }
    if (is3dRealTime) {
      infoWindow?.destroy()
    } else {
      let infoWindowEntity = this.getInfoWindow(mapId)
      let map = this.getMap(mapId)
      if (map) {
        closeInfoWindow(map, infoWindowEntity) //关闭地图弹窗
      }
    }
  }

  /**
   * 根据id定位到点聚合的点
   * @param id
   * @param deviceCode
   * @param layerId
   * @param mapId
   * @param getIconFn
   */
  static locationMarkerClusterById(id, deviceCode, layerId, mapId, getIconFn) {
    console.log({ id, deviceCode, layerId, mapId, getIconFn })
    this.setLocationClusterId(deviceCode, mapId) //存储清除左侧树选中效果用
    let layer = this.getLayers(mapId)
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      if (this.is3d(mapId)) {
        layer[layerId].locationById({ id: id })
      } else {
        this.resetClusterIcon(mapId, getIconFn, () => {
          let feature = layer[layerId].locationById('id', id, null, true)
          let data = feature.get('data')
          if (getIconFn) {
            getIconFn(data.arFlag, data.onlineFlag, false, (icon) => {
              feature.set(
                'style',
                new CTMapOl.style.Style({
                  image: new CTMapOl.style.Icon({
                    src: icon,
                    width: data.iconSize[0],
                    height: data.iconSize[1]
                  })
                })
              )
              changeIconFeature[mapId] = feature
            })
          }
        })
      }
    }
  }
  /**
   * 根据id定位到点聚合的点
   * @param id
   * @param deviceCode
   * @param layerId
   * @param mapId
   * @param getIconFn
   */
  static locationMarkerClusterByIdNoScale(
    id,
    deviceCode,
    layerId,
    mapId,
    getIconFn
  ) {
    console.log({ id, deviceCode, layerId, mapId, getIconFn })
    this.setLocationClusterId(deviceCode, mapId) //存储清除左侧树选中效果用
    let layer = this.getLayers(mapId)
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      if (this.is3d(mapId)) {
        console.log(layer[layerId])
        layer[layerId].locationById({ id: id, zoomTo: false })
      } else {
        this.resetClusterIcon(mapId, getIconFn, () => {
          // let feature = layer[layerId].locationById('id', id,null,true);
          layer[layerId].deSelectCamera('silent') // 清除之前选中状态
          const feature = layer[layerId]._findCameraById('id', id)
          layer[layerId]._selectCamera(feature, true)
          layer[layerId]._clusterLayer.clickSelect.getFeatures().push(feature)
          let data = feature.get('data')
          if (getIconFn) {
            getIconFn(data.arFlag, data.onlineFlag, false, (icon) => {
              feature.set(
                'style',
                new CTMapOl.style.Style({
                  image: new CTMapOl.style.Icon({
                    src: icon,
                    width: data.iconSize[0],
                    height: data.iconSize[1]
                  })
                })
              )
              changeIconFeature[mapId] = feature
            })
          }
        })
      }
    }
  }

  static resetClusterIcon(mapId, getIconFn, successFn) {
    let changeFeature = changeIconFeature[mapId]
    if (changeFeature) {
      let changeData = changeFeature.get('data')
      if (getIconFn) {
        getIconFn(changeData.arFlag, changeData.onlineFlag, true, (icon) => {
          changeFeature.set(
            'style',
            new CTMapOl.style.Style({
              image: new CTMapOl.style.Icon({
                src: icon,
                width: changeData.iconSize[0],
                height: changeData.iconSize[1]
              })
            })
          )
          successFn()
        })
      }
    } else {
      successFn()
    }
  }

  /**
   * 禁用和开启点聚合的聚合功能
   * @param disable true为禁用聚合
   * @param mapId
   */
  static disableCluster(disable, mapId) {
    let layer = this.getLayers(mapId)
    let layerId = CommonMap.getLayerIdStrS().camera
    if (layer[layerId] && !this.isEmptyObject(layer[layerId])) {
      layer[layerId].disableCluster(disable)
    }
  }

  /**
   * 存在点聚合
   */
  static hasClusterLayer(mapId) {
    let layer = this.getLayers(mapId)
    let layerId = CommonMap.getLayerIdStrS().camera
    return !!layer[layerId]
  }

  /*
   * @description: 高亮区域
   * @param {string} 高亮区域名称
   */
  static setHighLightArea(mapId, areaCode, highlightStyle, successFn) {
    let map = this.getMap(mapId)
    if (highlightObj[mapId] != null) {
      this.removeHighLightArea(mapId)
    }

    this.getAreaPolygonByCode(areaCode, mapId, (resp) => {
      if (highlightStyle.title) {
        // this.addText()
      }
      if (this.is3d(mapId)) {
        let options = {
          color: highlightStyle?.color || '#000',
          opacity: highlightStyle?.opacity || 0.5,
          positions: resp
          // setFitView: false
        }
        highlightObj[mapId] = new CTMapOl.cesiumComponent.Highlight(
          map,
          options
        )
      } else {
        highlightObj[mapId] = highLightArea(map, resp)
      }
      highlightCodeObj[mapId] = areaCode
      if (successFn) {
        successFn()
      }
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
        let polygon = resp.data.polygon
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
  static setHighlightOption(highlight, positions) {
    highlight.setOption({
      color: 'pink',
      opacity: 0.3,
      positions: positions,
      outline: {
        color: 'gray',
        weight: 5
      }
    })
  }

  static removeHighLightArea(mapId) {
    if (highlightObj[mapId] == null) {
      return false
    }
    if (this.is3d(mapId)) {
      highlightObj[mapId].remove()
    } else {
      let map = this.getMap(mapId)
      removeHighLightArea(map, highlightObj[mapId])
    }

    highlightObj[mapId] = null
    delete highlightObj[mapId]
    highlightCodeObj[mapId] = null
    delete highlightCodeObj[mapId]
  }

  static recoveryHighLightArea(mapId) {
    if (highlightCodeObj[mapId]) {
      this.setHighLightArea(mapId, highlightCodeObj[mapId])
    }
  }

  /**
   * @description  : 三维-文本标记
   * @param         { Object } map 地图实例
   * @param         { Array } path 经纬度
   * @param         { String } text 显示的文
   * @param         { String } fillColor text的颜色
   * @param         { String } font text的大小及字体
   * @param         { Number } height text的高度
   * @param         { Object } param 其它传参
   */
  static showCesiumText(map, path, text, fillColor, font, height, param = {}) {
    let options = {
      lng: parseFloat(path[0]), // text经度 必传字段
      lat: parseFloat(path[1]), // text纬度 必传字段
      height: height ? height : 100000, // text的高度 必传字段
      font: font ? font : '28px', // text的大小及字体
      fillColor: fillColor ? fillColor : '#ff0000', // text的颜色  必传字段
      text: text,
      ...param
    }
    let sText = new CTMapOl.cesiumComponent.Text(map, options)
    sText.addTo()
    return sText
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

      let _points = []
      let _offset = item.list[0].offset.join() || '24, 24'
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

  /**
   * 设置图层
   * @param arr 空数组时隐藏图层
   * @param mapId
   * @returns {boolean}
   */
  static addVmsLayer(arr, mapId) {
    console.log('addVmsLayer-arr:', arr)
    if (this.is3d(mapId)) {
      return false
    }

    if (wmsLayerObj[mapId] == null) {
      if (arr?.[0]?.rootGeoserverUrl) {
        this.initVmsLayer(arr[0].rootGeoserverUrl, mapId)
      } else {
        return false
      }
    }
    setTimeout(() => {
      const params = this.makeParams(arr)
      console.log('addVmsLayer-params:', params)
      let wmsLayers = wmsLayerObj[mapId]
      wmsLayers.updateParams(params)
      if (arr?.length === 0) {
        wmsLayers.setVisible(false)
      } else {
        wmsLayers.setVisible(true)
      }
    })
  }

  /**
   * 处理params
   * @param list
   * @returns {{layers: *, STYLES: *, ENV: string}}
   */
  static makeParams(list) {
    const layers = list.map(
      (layer) => layer.layerNamespace + ':' + layer.layerName
    )
    return {
      layers: layers.join(),
      STYLES: layers.map(() => 'alarmEvent_style').join(),
      ENV: 'opacity1: 0.4'
    }
  }

  /**
   * 初始化图层
   * @param rootGeoserverUrl
   * @param mapId
   */
  static initVmsLayer(rootGeoserverUrl, mapId) {
    let map = this.getMap(mapId)
    wmsLayerObj[mapId] = new CTMapOl.extend.WMSLayer(map, {
      // type: 'image', // image模式请求数量更少，但每次更新区域为整个可视范围，可以按需选择模式
      wmsUrl: rootGeoserverUrl + '/wms' // wmsUrl 可后设置
    })
  }

  /**
   * 地图添加森林火险图层
   * @param layerId 要显示的多边形组的统一id
   * @param isJump 是否跳转视角 true 是 false 否
   * @param adCode 行政编码
   * @param colorsObj {{fillColor, strokeColor, title}}
   * strokeColor 轮廓颜色  'rgba(250, 173, 20, 1)',
   * fillColor 填充颜色 'rgba(250, 173, 20, 0.5)'
   * title 多边形标题
   * @param successFn 成功回调
   * **/
  static initFireDataSource(
    layerId,
    isJump,
    adCode,
    colorsObj,
    mapId,
    successFn
  ) {
    let map = this.getMap(mapId)
    CTMapOl.netApi
      .regionInfo({
        adCode: adCode
      })
      .then((resp) => {
        let polygon = resp.data.polygon
        if (!polygon) {
          return false
        }
        const coords = []
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
          coords.push([coordinates])
        })
        const { fillColor, title, strokeColor } = colorsObj
        let polygonParam = {
          strokeColor: strokeColor,
          fillColor: fillColor,
          fillOpacity: title.indexOf('暂无预警') === -1 ? 0.35 : 0.15,
          strokeOpacity: 1,
          zIndex: 50,
          strokeWidth: 1,
          css: {
            font: '20px Source Han Sans SC,Microsoft YaHei,PingFangSC',
            fontSize: '20px',
            strokeColor: strokeColor,
            strokeWidth: 1,
            outlineColor: strokeColor,
            outlineWidth: 1,
            fontWeight: 500,
            color: strokeColor
          }
        }
        if (fireWarnPolygonObj[mapId] == null) {
          fireWarnPolygonObj[mapId] = {}
          fireWarnTextObj[mapId] = {}
        }
        if (fireWarnPolygonObj[mapId][layerId] == null) {
          fireWarnPolygonObj[mapId][layerId] = []
          fireWarnTextObj[mapId][layerId] = []
        }
        if (this.is3d(mapId)) {
          for (const coord of coords) {
            polygonParam.path = coord
            polygonParam.zoomto = isJump
            let polygonEntity = new CTMapOl.cesiumComponent.Polygon(
              polygonParam
            )
            const r = Cesium.PolygonGeometry.computeRectangle({
              polygonHierarchy:
                polygonEntity.TPolygon.primitive.geometryInstances.geometry
                  ._polygonHierarchy
            })
            const lng = (((r.west + r.east) / 2) * 180) / Math.PI
            const lat = (((r.north + r.south) / 2) * 180) / Math.PI
            console.log('-------', lng, lat)
            polygonEntity.addTo({ viewer: map })
            const sText = this.showCesiumText(
              map,
              [lng, lat],
              title,
              polygonParam.css.color,
              polygonParam.css.font,
              null,
              polygonParam.css
            )
            sText.Text.label.outlineColor = Cesium.Color.fromCssColorString(
              polygonParam.css.outlineColor
            )
            sText.Text.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE
            fireWarnPolygonObj[mapId][layerId].push(polygonEntity)
            fireWarnTextObj[mapId][layerId].push(sText)
          }
          this.executeFunction(successFn)
        } else {
          const { polygonLayer } = setPolygon(
            map,
            coords,
            polygonParam,
            title,
            false,
            isJump
          )
          fireWarnPolygonObj[mapId][layerId].push(polygonLayer)
          this.executeFunction(successFn)
        }
      })
  }

  /**
   * 移除森林火险图层
   */
  static removeFireDataSource(layerId, mapId) {
    let map = this.getMap(mapId)
    let polygonEntity = fireWarnPolygonObj[mapId]?.[layerId]
    if (!polygonEntity || polygonEntity.length === 0) {
      return false
    }
    for (const polygonEntityElement of polygonEntity) {
      if (this.is3d(mapId)) {
        polygonEntityElement.remove()
      } else {
        map.removeLayer(polygonEntityElement)
      }
    }
    if (this.is3d(mapId)) {
      for (const fireWarnTextItem of fireWarnTextObj[mapId]?.[layerId]) {
        fireWarnTextItem.remove()
      }
    }
    fireWarnPolygonObj[mapId][layerId] = []
    fireWarnTextObj[mapId][layerId] = []
  }

  /**
   * 地图添加告警网格图层
   * @param layerId 要显示的多边形组的统一id
   * @param isJump 是否跳转视角 true 是 false 否
   * @param coord 网格经纬度数组
   * @param colorsObj {{fillColor, strokeColor, title}}
   * strokeColor 轮廓颜色  'rgba(250, 173, 20, 1)',
   * fillColor 填充颜色 'rgba(250, 173, 20, 0.5)'
   * title 多边形标题
   * @param successFn 成功回调
   * **/
  static initAlarmPolygon(layerId, isJump, coord, colorsObj, mapId, successFn) {
    let map = this.getMap(mapId)
    let coords = [] //coord 是 [[lng, lat],[lng, lat]]  coords是 [[[lng, lat], [lng, lat]]]   线格式 转 多边形格式
    coords.push(coord)
    if (!this.is3d(mapId)) {
      //二维坐标转换 经纬度 转 投影
      coords[0].forEach((item, index) => {
        coords[0][index] = CTMapOl.proj.fromLonLat(item)
      })
    }
    let corrdsArr = [] //corrdsArr是 [[[[lng, lat], [lng, lat]]]]  多多边形数据格式
    corrdsArr.push(coords)
    const { fillColor, title, strokeColor } = colorsObj
    let polygonParam = {
      strokeColor: strokeColor,
      fillColor: fillColor.length > 7 ? fillColor : fillColor + '50',
      fillOpacity: 0.5,
      strokeOpacity: 0,
      zIndex: 50,
      strokeWidth: 1,
      css: {
        font: '20px Source Han Sans SC,Microsoft YaHei,PingFangSC',
        fontSize: '20px',
        strokeColor: fillColor,
        strokeWidth: 1,
        outlineColor: fillColor,
        outlineWidth: 1,
        fontWeight: 500,
        color: fillColor
      }
    }
    if (alarmPolygonObj[mapId] == null) {
      alarmPolygonObj[mapId] = {}
      alarmTextObj[mapId] = {}
    }
    if (alarmPolygonObj[mapId][layerId] == null) {
      alarmPolygonObj[mapId][layerId] = []
      alarmTextObj[mapId][layerId] = []
    }
    if (this.is3d(mapId)) {
      for (const coordItem of corrdsArr) {
        polygonParam.path = coordItem
        polygonParam.zoomto = isJump
        let polygonEntity = new CTMapOl.cesiumComponent.Polygon(polygonParam)
        const r = Cesium.PolygonGeometry.computeRectangle({
          polygonHierarchy:
            polygonEntity.TPolygon.primitive.geometryInstances.geometry
              ._polygonHierarchy
        })
        const lng = (((r.west + r.east) / 2) * 180) / Math.PI
        const lat = (((r.north + r.south) / 2) * 180) / Math.PI
        console.log('-------', lng, lat)
        polygonEntity.addTo({ viewer: map })
        const sText = this.showCesiumText(
          map,
          [lng, lat],
          title,
          polygonParam.css.color,
          polygonParam.css.font,
          null,
          polygonParam.css
        )
        sText.Text.label.outlineColor = Cesium.Color.fromCssColorString(
          polygonParam.css.outlineColor
        )
        sText.Text.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE
        alarmPolygonObj[mapId][layerId].push(polygonEntity)
        alarmTextObj[mapId][layerId].push(sText)
      }
      this.executeFunction(successFn)
    } else {
      const { polygonLayer } = setPolygon(
        map,
        corrdsArr,
        polygonParam,
        title,
        false,
        isJump
      )
      alarmPolygonObj[mapId][layerId].push(polygonLayer)
      this.executeFunction(successFn)
    }
  }
  /**
   * 移除告警网格图层
   */
  static removeAlarmPolygon(layerId, mapId) {
    let map = this.getMap(mapId)
    let polygonEntity = alarmPolygonObj[mapId]?.[layerId]
    if (!polygonEntity || polygonEntity.length === 0) {
      return false
    }
    for (const polygonEntityElement of polygonEntity) {
      if (this.is3d(mapId)) {
        polygonEntityElement.remove()
      } else {
        map.removeLayer(polygonEntityElement)
      }
    }
    if (this.is3d(mapId)) {
      for (const fireWarnTextItem of alarmTextObj[mapId]?.[layerId]) {
        fireWarnTextItem.remove()
      }
    }
    alarmPolygonObj[mapId][layerId] = []
    alarmTextObj[mapId][layerId] = []
  }

  /**
   * 计算水平方位角
   * @param start       开始点
   * @param end         结束点
   * @param num         保留小数点后几位
   * @returns {*}       两点恒向线夹角
   */
  static getHorizontalAngle(start, end, num) {
    let angle = CTMapOl.turf.rhumbBearing(start, end)
    return angle >= 0 ? angle.toFixed(num) : (angle + 360).toFixed(num)
  }

  /**
   * 计算两点间距离
   * @param start     开始点
   * @param end       结束点
   * @param num       保留小数点后几位
   * @returns {*}     两点间距离
   */
  static getDistance(start, end, num) {
    let distance = CTMapOl.turf.distance(start, end)
    return distance.toFixed(num)
  }
}
