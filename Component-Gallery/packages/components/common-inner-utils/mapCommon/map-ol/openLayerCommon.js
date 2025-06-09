import CTMapOl from '@ct/ct_map_ol'

import startMarker from '@component-gallery/assets/mapImage/locusEnd.svg'
import endMarker from '@component-gallery/assets/mapImage/locusStart.svg'

const defaultCenters_common = [11549003.016902035, 4352331.238241305]
const defaultZoom = 5

const { Observable, easing, geom, style, control } = CTMapOl
const { easeOut } = easing
const { unByKey } = Observable
const { circular } = geom.Polygon
const { ScaleLine } = control
const { Circle: CircleStyle } = style
/**
 * @param mapId 地图id(必传)
 * @param center 地图中心点(非必传有默认)
 * @param mapTypeIndex (地图加载的类型1为路网, 2为卫星地图)
 * @param zoom 地图初始化层级(非必传有默认)
 */
export function initCTMap(mapId, center, mapTypeIndex, zoom) {
  if (center == null) {
    center = defaultCenters_common
  } else {
    center = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer(center)
  }

  if (zoom == null) {
    zoom = defaultZoom
  }
  let mapMap = new CTMapOl.extend.InitMap({
    domId: mapId,
    tile: mapTypeIndex === 1 ? 'vector' : 'satellite',
    center: center,
    zoom: zoom,
    maxZoom: 18,
    minZoom: 5,
    stopClick: true
  })
  return {
    map: mapMap.map,
    mapMap
  }
}

/**
 * 单坐标转换指定投影系
 * @param coordinate 坐标
 * @param fromType 源投影坐标系
 * @param toType 目标投影坐标系
 */
export function transCoordinate(
  coordinate,
  fromType = 'EPSG:4326',
  toType = 'EPSG:3857'
) {
  return CTMapOl.extend.formatLayer.transCoordinate(
    coordinate,
    fromType,
    toType
  )
}

/**
 * 添加比例尺
 * @param map
 * @param className 样式名称
 * @param maxWidth 最大宽度
 * @param divId 外部容器id
 * @returns {ScaleLine}
 */
export function addScaleLine(map, className, maxWidth, divId) {
  let option = {
    className: className,
    units: 'metric'
  }
  if (maxWidth) {
    option.maxWidth = maxWidth
  }
  if (divId) {
    option.target = document.getElementById(divId)
  }
  let scaleLine = new ScaleLine(option)
  map.addControl(scaleLine)
  return scaleLine
}

/**
 * 以动画形式改变地图的当前可视等级
 * @param  map 地图对象.
 * @param {number} duration 动画持续时间.
 * @param  center 中心点坐标 [lng,lat]
 * @param {number} zoomNum zoom级别
 * @return {null}
 * @api
 */
export function zoom2centerAndZoomNum(map, duration, center, zoomNum) {
  let view = map.getView()
  // map.getLayers().getArray()[0].setPreload(18);
  let newZoom = zoomNum
  if (!view) {
    return false
  }
  if (newZoom >= view.getMinZoom() && newZoom <= view.getMaxZoom()) {
    let newResolution = view.getResolutionForZoom(newZoom)
    if (center) {
      if (view.getAnimating()) {
        view.cancelAnimations()
      }
      let param = {
        center: center, //lngLatToCoordinate(center),
        resolution: newResolution,
        easing: easeOut
      }
      if (duration) {
        param.duration = duration
      }
      view.animate(param)
    } else {
      view.setResolution(newResolution)
    }
  }
}

export function setZoomAndCenter(map, lng, lat, zoom) {
  let lngLat = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
    Number(lng),
    Number(lat)
  ])
  console.log(lngLat)
  zoom2centerAndZoomNum(map, 1000, lngLat, zoom)
}

/**
 * 地图弹窗
 * @param map 地图实体
 * @param lng 精度
 * @param lat 纬度
 * @param content html内容
 * @param popClass class name
 * @param offsetX 偏移量x
 * @param offsetY 偏移量y
 * @param autoPan 弹窗是否一直在地图中显示完整 true:可以显示不全
 * @returns {CTMapOl.Overlay}
 */
export function openInfoWindow(
  map,
  lng,
  lat,
  content,
  popClass,
  offsetX,
  offsetY,
  autoPan
) {
  let infoWindow
  const infoWindowId = 'infoWindowId'
  let $info

  $info = document.createElement('div')
  $info.id = infoWindowId
  $info.className = popClass
  $info.innerHTML = content
  $info.onmousewheel = function (e) {
    e.stopPropagation()
  }
  $info.onclick = function (e) {
    e.stopPropagation()
  }
  document.body.appendChild($info)
  let pan
  if (autoPan) {
    pan = false
  } else {
    pan = {
      animation: {
        duration: 250
      }
    }
  }
  /**
   * Create an overlay to anchor the popup to the map.
   */
  infoWindow = new CTMapOl.Overlay({
    id: infoWindowId,
    element: $info,
    position: CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
      Number(lng),
      Number(lat)
    ]),
    positioning: 'bottom-center', //相对于其位置属性的实际位置
    stopEvent: true, //阻止事件冒泡
    offset: [offsetX, offsetY],
    autoClose: false, // 设置自动关闭为false
    pointerEvents: 'auto', // 设置pointer-events为auto
    autoPan: pan
  })
  map.addOverlay(infoWindow)

  return infoWindow
}

/**
 * 关闭地图弹窗
 */
export function closeInfoWindow(map, infoWindowEntity) {
  if (map.getOverlayById('infoWindowId') || infoWindowEntity) {
    map.removeOverlay(infoWindowEntity)
  }
}

/**
 * 地图点击事件, 防止点地图弹出的图层误触发
 * @param map
 * @param successFn
 */
export function mapClick(map, successFn) {
  map.on('click', function (event) {
    successFn(event)
  })
}

export function mapMousemove(map) {
  const mousePositionControl = new CTMapOl.control.MousePosition({
    coordinateFormat: function (coordinate) {
      return CTMapOl.coordinate.format(
        coordinate,
        '经度: {x}&nbsp; &nbsp; 纬度: {y}&nbsp; &nbsp; 海拔: 0',
        6
      )
    },
    projection: 'EPSG:4326', // 定义投影
    className: 'bottom-mouse-position', // 控件的CSS类名
    target: document.getElementById('mouse-position'), // 将控件渲染在该DOM元素中
    undefinedHTML: ' ' // 鼠标离开地图时，显示空格
  })
  //添加控件到地图
  map.addControl(mousePositionControl)
  return mousePositionControl
}
/**
 * 单个打点(移除直接map.removeOverlay(marker) )
 * @param map 地图实体
 * @param longitude 经度
 * @param latitude 纬度
 * @param id
 * @param imgObj img对象的参数'{imgPath, offset, imgWidth, imgHeight}'
 *  imgPath  图片地址
 *  offset 偏移
 * @param clickFn 点击回调
 */
export function addMarker(map, longitude, latitude, id, imgObj, clickFn) {
  const { imgPath, imgWidth, imgHeight, offset, zIndex = 99 } = imgObj
  return new CTMapOl.extend.Markers(map, [{ longitude, latitude }], {
    layerOptions: {
      zIndex
    },
    cluster: false, //是否启用点聚合
    multiSelect: false,
    stopClick: true,
    clickToTop: true,
    markerStyle: new CTMapOl.style.Style({
      image: new CTMapOl.style.Icon({
        src: imgPath,
        width: imgWidth,
        height: imgHeight,
        anchor: [
          Math.abs(offset[0]) / imgObj.imgWidth,
          Math.abs(offset[1]) / imgObj.imgHeight
        ]
      })
    }),
    getCoordsFunc: (item) =>
      CTMapOl.proj.fromLonLat([item.longitude, item.latitude]),
    onClick: () => {
      clickFn && clickFn(id)
    }
  })
}
/**
 * 单个打点(移除直接map.removeOverlay(marker) )
 * @param map 地图实体
 * @param lng 经度
 * @param lat 纬度
 * @param id
 * @param imgObj imgHtml带style的html代码,zoom传的层级靠下
 * @param clickFn 点击回调
 */
export function addMarkerFroHtml(map, lng, lat, id, imgObj, clickFn) {
  // 创建标记元素
  let markerElement = document.createElement('div')
  markerElement.innerHTML = imgObj
  // 创建标记对象
  let marker = new CTMapOl.Overlay({
    element: markerElement,
    positioning: 'bottom-center',
    position: CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
      Number(lng),
      Number(lat)
    ]), // 标记的位置
    insertFirst: !imgObj.zoom
  })
  // 将标记添加到地图上
  map.addOverlay(marker)
  // 添加点击回调函数
  if (clickFn) {
    markerElement.on('click', () => {
      clickFn(id)
    })
  }

  return marker
}

/**
 * 带省市聚合数量分层点聚合
 * @param map 地图实体
 * @param deviceParam { list, clickFn, clusterImgItem}list 摄像机站址数据
 * @param provinceParam 省级统计数量(铁塔视角传,其他不传)
 * @param cityParam 地市级统计数量(铁塔视角传,其他不传)
 * @param successFn 成功回调
 * @returns {*}
 */
export function showMarkCluster(
  map,
  deviceParam,
  provinceParam,
  cityParam,
  successFn
) {
  let provinceMinZoom = 1
  let provinceMaxZoom = 1
  if (provinceParam != null) {
    provinceMinZoom = 4.99
    provinceMaxZoom = 7.99
  }
  let cityMinZoom = 1
  let cityMaxZoom = 1
  if (cityParam != null) {
    cityMinZoom = 7.99
    cityMaxZoom = 10.99
  }
  clusterProvinceAndCity(
    provinceParam,
    [],
    provinceMinZoom,
    provinceMaxZoom,
    (layers) => {
      clusterProvinceAndCity(
        cityParam,
        layers,
        cityMinZoom,
        cityMaxZoom,
        (layers2) => {
          clusterPoint(
            map,
            layers2,
            deviceParam,
            provinceParam != null,
            successFn
          )
        }
      )
    }
  )
}

/**
 * 聚合打点
 * @param map
 * @param layers
 * @param deviceParam
 * @param hasProvinceFlag
 * @param successFn
 */
function clusterPoint(map, layers, deviceParam, hasProvinceFlag, successFn) {
  let clusterImgItem = deviceParam.clusterImgItem
  let dList = []
  for (const deviceItem of deviceParam.list) {
    let lngLat = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
      deviceItem.longitude,
      deviceItem.latitude
    ])
    dList.push({
      longitude: lngLat[0],
      latitude: lngLat[1],
      arFlag: deviceItem.arFlag,
      onlineFlag: deviceItem.onlineFlag,
      icon: deviceItem.icon,
      clickIcon: deviceItem.clickIcon,
      iconSize: deviceItem.iconSize,
      offset: deviceItem.offset,
      id: deviceItem.id,
      distance: 0,
      heading: 0,
      angle: 50
    })
  }
  let iconStyleFunc = (count) =>
    new CTMapOl.style.Style({
      image: new CTMapOl.style.Icon({
        src: clusterImgItem.clusterImg,
        width: clusterImgItem.clusterImgWidth,
        height: clusterImgItem.clusterImgHeight
      }),
      text: new CTMapOl.style.Text({
        text: count,
        fill: new CTMapOl.style.Fill({
          color: '#fff'
        }),
        font: '14px Arial',
        textAnchor: 'middle',
        offsetY: 9 // 设置文本向下偏移5像素
      })
    })
  let cameraStyleFunc = (data) =>
    new CTMapOl.style.Style({
      image: new CTMapOl.style.Icon({
        src: data.icon,
        width: data.iconSize[0],
        height: data.iconSize[1],
        anchor: [
          data.offset[0] / data.iconSize[0],
          data.offset[1] / data.iconSize[1]
        ]
      })
    })
  let cameraActiveStyleFunc = (data) =>
    new CTMapOl.style.Style({
      image: new CTMapOl.style.Icon({
        src: data.clickIcon,
        width: data.iconSize[0],
        height: data.iconSize[1],
        anchor: [
          data.offset[0] / data.iconSize[0],
          data.offset[1] / data.iconSize[1]
        ]
      }),
      zIndex: 1
    })
  layers.push({
    data: dList,
    iconStyleFunc: iconStyleFunc,
    onClick: (data) => {
      if (deviceParam.clickFn) {
        deviceParam.clickFn(data.id)
      }
    },
    minZoom: hasProvinceFlag ? 10.99 : 4.99,
    maxZoom: deviceParam.maxZoom ? deviceParam.maxZoom : 18
  })
  let LayeredClusterViewShed = new CTMapOl.extend.LayeredClusterViewShed(
    map,
    layers,
    {
      minViewShed: 10,
      keepPartialViewShed: clusterImgItem.keepPartialViewShed,
      viewDistanceColor: clusterImgItem.viewDistanceColor,
      viewAngleColor: clusterImgItem.viewAngleColor,
      clusterMaxZoom: clusterImgItem.clusterMaxZoom,
      cameraStyleFunc: cameraStyleFunc,
      cameraActiveStyleFunc: cameraActiveStyleFunc,
      stopClick: true
    }
  )
  LayeredClusterViewShed.setViewShedVisible(false)
  successFn(LayeredClusterViewShed)
}

/**
 * 聚合省市显示数据点显示
 * @param param
 * @param layers
 * @param minZoom
 * @param maxZoom
 * @param successFn
 */
function clusterProvinceAndCity(param, layers, minZoom, maxZoom, successFn) {
  let list = []
  let iconStyleFunc
  let clickFn
  if (param != null) {
    list = param.list
    for (const item of list) {
      let lngLat = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
        Number(item.longitude),
        Number(item.latitude)
      ])
      item.longitude = lngLat[0]
      item.latitude = lngLat[1]
      item.count = item.count != null ? String(item.count) : ''
    }
    //去掉数量0的
    list = list.filter((item) => item.count !== '0')
    let clusterImgItem = param.clusterImgItem
    let clusterImgWidth = clusterImgItem.clusterImgWidth
    let clusterImgHeight = clusterImgItem.clusterImgHeight
    let clusterImg = clusterImgItem.clusterImg
    clickFn = param.clickFn
    iconStyleFunc = ({ count }) =>
      new CTMapOl.style.Style({
        image: new CTMapOl.style.Icon({
          src: clusterImg,
          width: clusterImgWidth,
          height: clusterImgHeight
        }),
        text: new CTMapOl.style.Text({
          text: count,
          fill: new CTMapOl.style.Fill({
            color: '#fff'
          }),
          font: '14px Arial',
          textAnchor: 'middle',
          offsetY: 9 // 设置文本向下偏移9像素
        })
      })
  }

  layers.push({
    data: list,
    minZoom: minZoom,
    maxZoom: maxZoom,
    iconStyleFunc: iconStyleFunc,
    onClick: (data) => {
      if (clickFn) {
        clickFn(data)
      }
    }
  })
  successFn(layers)
}

export function clusterSetViewshed(layeredCluster, param) {
  let {
    idKey,
    idValue,
    guid,
    longitude,
    latitude,
    distance,
    heading,
    angle,
    ishalf,
    viewDistanceColor,
    viewAngleColor
  } = param
  let lngLat = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
    longitude,
    latitude
  ])
  layeredCluster.setViewShedVisible(true)
  let params = {
    guid: guid,
    id: idValue,
    longitude: lngLat[0],
    latitude: lngLat[1],
    distance: distance,
    heading: heading,
    angle: angle,
    ishalf: ishalf,
    viewDistanceColor: viewDistanceColor,
    viewAngleColor: viewAngleColor
  }
  return layeredCluster.addViewShedVisibleById(idKey, idValue, params, 2)
}

export function setClusterLayerData(layeredCluster, list) {
  let dList = []
  for (const deviceItem of list) {
    let lngLat = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
      deviceItem.longitude,
      deviceItem.latitude
    ])
    dList.push({
      longitude: lngLat[0],
      latitude: lngLat[1],
      arFlag: deviceItem.arFlag,
      onlineFlag: deviceItem.onlineFlag,
      icon: deviceItem.icon,
      clickIcon: deviceItem.clickIcon,
      iconSize: deviceItem.iconSize,
      offset: deviceItem.offset,
      id: deviceItem.id,
      distance: 0,
      heading: 0,
      angle: 50
    })
  }
  layeredCluster.setLayerData(2, dList)
  layeredCluster.disableCluster(true)
}
export function removeClusterViewshed(layeredCluster, param) {
  let { idKey, idValue, guid } = param
  layeredCluster.removeViewShedVisibleById(idKey, idValue, {
    guid: guid
  })
}

export function highLightArea(map, list) {
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: list
    }
  }
  const tileLayer = map.getLayers().getArray()[1]
  // const highlight = new Mask({
  //   feature: new CTMapOl.format.GeoJSON().readFeatures(geojson)[0],
  //   fill: new CTMapOl.style.Fill({
  //     color: 'rgba(0, 0, 0, 0.5)'
  //   })
  // })
  // tileLayer.addFilter(highlight)
  const geom = new CTMapOl.format.GeoJSON().readGeometry(geojson.geometry)
  map.getView().fit(geom)
  return null
}

export function removeHighLightArea(map, highlight) {
  map.getLayers().getArray()[1]?.removeFilter(highlight)
}

/**
 * 1.2.	POI-关键字搜索接口
 * 字段描述	    字段名称	                                            类型	必填	  字段说明
 * keyWord	    搜索的关键字	                                        String	是	  无
 * location	    地图经纬度(“经度,纬度”)	                              String	否	  经纬度用逗号拼接 和行政编码二选一必填
 * adCode	      指定行政区的国标码（行政区划编码表）严格按照sys_area表	  String	否	  基于天地图的行政区划编码表 和经纬度二选一必填
 * level	      目前查询的级别	                                      String	否	  1-18级
 * queryType	  搜索类型	                                            String	必填	1:普通搜索（含地铁公交） 7：地名搜索
 * pageSize	    分页参数	                                            String	必填	分页参数
 * pageNum	    分页参数	                                            String	必填	分页参数
 * poiTypes	    POI数据类型	                                        String	否	  基于天地图的POI数据类型（离线地图时需确认与天地图差异）
 * @returns {*}
 */
export function keyWordQueryPoi(data) {
  return CTMapOl.netApi.poiByKeyWord(data)
}

/**
 * 1.3.	POI-半径搜索接口
 * 字段描述	    字段名称	        类型	  必填	    字段说明
 * keyWord	    搜索的关键字	    String	是	    无
 * location	    地图经纬度       String	是	    经纬度用逗号拼接
 * radius	      搜索半径	        String	是	    单位：米默认3000，返回数据按照经纬度距离排序
 * level	      目前查询的级别	  String	否	    1-18级
 * queryType	  搜索类型	        String	必填	  1:普通搜索（含地铁公交） 7：地名搜索
 * pageSize	    分页参数	        String	必填	  分页参数
 * pageNum	    分页参数	        String	必填	  分页参数
 * poiTypes     POI数据类型	    String	否	    基于天地图的POI数据类型（离线地图时需确认与天地图差异）
 */
export function poiRadiusQuery(data) {
  return CTMapOl.netApi.poiByRadius(data)
}

/**
 * 1.6.	逆地理编码接口
 * location	地图经纬度(“经度,维度”)	String	是	经纬度用逗号拼接
 * poiTypes	POI数据类型	String	否	基于天地图的POI数据类型（离线地图时需确认与天地图差异）
 * radius	搜索半径，单位米，默认1000米	String	否
 */
export function poiContraryGeocodingQuery(data) {
  return CTMapOl.netApi.codeToAddress(data)
}

/**
 * 1.7.	行政区划查询接口
 * keyWord	搜索的关键字，行政区域名称	String	否	无
 * adCode	行政区域编码	String	否	与关键词二选一必填
 */
export function poiAreaQuery(data) {
  return CTMapOl.netApi.regionInfo(data)
}

/**
 * 1.8.	路径规划接口-点到点纯路径
 * origin	起点经纬度	String	是	无
 * end	终点经纬度	String	是	无
 */
export function trajectoryQuery(data) {
  return CTMapOl.netApi.routePlan(data)
}

/**
 * 画圆
 * @param map 地图实体
 * @param center 中心点[lng,lat]
 * @param radius 半径/米
 * @param isShowAllCircle 是否展示整个圆
 * @param circleObj 圆的样式（fillColor填充颜色、fillOpacity填充透明度、strokeColor边线颜色、strokeWidth边线宽度）
 */
export function describingCircle(
  map,
  center,
  radius,
  isShowAllCircle,
  circleObj
) {
  let { fillColor, fillOpacity, strokeColor, strokeWidth } = circleObj
  let sourcePoint = new CTMapOl.source.Vector()
  let layerPoint = new CTMapOl.layer.Vector({
    // zIndex: 1,
    opacity: fillOpacity
  })
  layerPoint.setSource(sourcePoint)
  const geom = circular(center, radius)
  geom.transform('EPSG:4326', 'EPSG:3857')
  let feature = new CTMapOl.Feature({
    title: 'circle',
    geometry: geom
  })
  feature.setStyle(
    new CTMapOl.style.Style({
      fill: new CTMapOl.style.Fill({
        color: fillColor
      }),
      stroke: new CTMapOl.style.Stroke({
        color: strokeColor,
        width: strokeWidth
      })
    })
  )
  sourcePoint.addFeatures([feature])
  map.addLayer(layerPoint)
  if (isShowAllCircle) {
    // 是否展示整个圆
    setTimeout(() => {
      map.getView().fit(geom, {
        padding: [50, 50, 50, 50]
      }) //设置地图的缩放距离离屏幕的大小
    }, 500)
  }
  return {
    feature: feature,
    sourcePoint: sourcePoint,
    layerPoint: layerPoint
  }
}

/**
 * 清除圆
 * @param map 地图实体
 * @param circleObj 画圆实体
 */
export function clearCircle(map, circleObj) {
  circleObj.sourcePoint.removeFeature([circleObj.feature])
  map.removeLayer(circleObj.layerPoint) //移除图层
}

/**
 * 折线
 * @param map 地图实体
 * @param lineArr 线数据
 * @param strokeColor 线颜色
 * @param strokeWidth 线宽度
 * @param isShowAllPolyline 是否视角显示全部折线
 * @param isShowMarker 是否展示起点终点打点
 */
export function describingPolyline(
  map,
  lineArr,
  strokeColor,
  strokeWidth,
  isShowAllPolyline,
  isShowMarker
) {
  if (lineArr.length === 0) {
    return false
  }
  const geom = new CTMapOl.geom.LineString(lineArr)
  geom.transform('EPSG:4326', 'EPSG:3857')
  let routeFeature = new CTMapOl.Feature({
    type: 'route',
    geometry: geom
  })
  let styles = {
    route: new CTMapOl.style.Style({
      stroke: new CTMapOl.style.Stroke({
        width: strokeWidth, //线的宽度
        color: strokeColor //线的颜色
      })
    })
  }
  let source = new CTMapOl.source.Vector({
    features: [routeFeature]
  })
  let startMarkerLayer = null
  let endMarkerLayer = null
  if (isShowMarker) {
    let startImgObj = {
      imgPath: startMarker,
      imgWidth: 22,
      imgHeight: 30,
      offset: [-11, -30]
    }
    let endImgObj = {
      imgPath: endMarker,
      imgWidth: 22,
      imgHeight: 30,
      offset: [-11, -30]
    }
    startMarkerLayer = addMarker(
      map,
      lineArr[0][0],
      lineArr[0][1],
      'startMarker',
      startImgObj
    )
    endMarkerLayer = addMarker(
      map,
      lineArr[lineArr.length - 1][0],
      lineArr[lineArr.length - 1][1],
      'endMarker',
      endImgObj
    )
  }
  let vectorLayer = new CTMapOl.layer.Vector({
    source: source,
    style: function (feature) {
      return styles[feature.get('type')]
    }
  })

  map.addLayer(vectorLayer)
  if (isShowAllPolyline) {
    // 是否展示所有折线
    map.getView().fit(geom, {
      padding: [100, 100, 100, 100]
    }) //设置地图的缩放距离离屏幕的大小
  }

  return {
    feature: routeFeature,
    vectorLayer: vectorLayer,
    startMarkerLayer,
    endMarkerLayer
  }
}

/**
 * 清除折线
 * @param map 地图实体
 * @param polylineObj 折线实体
 */
export function clearPolyline(map, polylineObj) {
  map.removeLayer(polylineObj.vectorLayer) //移除图层
  if (polylineObj.startMarkerLayer && polylineObj.endMarkerLayer) {
    map.removeOverlay(polylineObj.startMarkerLayer)
    map.removeOverlay(polylineObj.endMarkerLayer)
  }
}
/**
 * 测量类
 * @param _map 地图实例
 * @param rightClickAction 右键操作，默认为撤销，可选为清除
 * @param onFinishFn 测距完成后的回调函数
 * @param autoClear 是否自动清除（再次测距时是否清除上一次的测距）
 * @param color 测距线的颜色
 * @param onRemoveFn 测距线删除回调
 * @param onReduceFn 测距线清除一个点回调
 */
export class measureClass {
  constructor(
    _map,
    rightClickAction = 'undo',
    onFinishFn,
    autoClear = false,
    color = '#4F9FFF',
    onRemoveFn,
    onReduceFn
  ) {
    this.map = _map
    this.color = color
    this.measure = null
    this.autoClear = autoClear
    this.measureType = ''
    this.rightClickAction = rightClickAction === 'undo' ? 'undo' : 'finish'
    console.log(onFinishFn)
    if (onFinishFn !== null) {
      this.onFinishFn = onFinishFn
    } else {
      this.onFinishFn = this.onFinish
      console.log(onFinishFn)
    }
    if (onRemoveFn) {
      this.onRemoveFn = onRemoveFn
    }
    if (onReduceFn) {
      this.onReduceFn = onReduceFn
    }
    this.initMeasure()
  }

  get(key) {
    return this[key]
  }

  set(key, value) {
    this[key] = value
  }

  /**
   * 设置测量线的颜色
   * @param color
   */
  setColor(color) {
    this.color = color
  }

  setMeasureType(type) {
    if (type === this.measureType) {
      // 无操作
    } else if (
      type !== this.measureType &&
      (type === 'area' || type === 'length')
    ) {
      this.measureType = type
      this.initMeasure()
    } else if (
      type !== this.measureType &&
      type !== 'area' &&
      type !== 'length'
    ) {
      this.measureType = ''
      this.initMeasure()
    }
  }

  /**
   * 测量距离 || area
   */
  initMeasure() {
    this.distoryMeasure()
    if (this.measureType === 'area' || this.measureType === 'length') {
      this.measure = new CTMapOl.extend.ToolMeasure(this.map, {
        color: this.color,
        type: this.measureType,
        rightClickAction: this.rightClickAction,
        onFinish: (info) => {
          this.onFinishFn(info)
        },
        onRemove: (feature, reason) => {
          this.onRemoveFn(reason)
        },
        onReduce: (info) => {
          this.onReduceFn(info)
        }
      })
    }
  }

  onFinish(info) {
    console.log('1', '坐标点', info)
    console.log('this', this)
  }

  startMeasure() {
    if (this.measure) {
      if (this.autoClear) {
        this.measure.clear()
      }
      this.measure.start()
    }
  }
  onlyStartMeasure() {
    if (this.measure) {
      this.measure.start()
    }
  }

  clearMeasure() {
    if (this.measure) {
      this.measure.clear()
    }
  }

  stopMeasure() {
    if (this.measure) {
      this.measure.stop()
    }
  }

  /**
   * 销毁测量
   */
  distoryMeasure() {
    if (this.measure) {
      this.measure.stop()
      this.measure.destroy()
      this.measure = null
    }
  }
}

/**
 * 计算多边形中心点
 * @param coordArr 多边形坐标数组 首位坐标一致，去掉首位坐标点后的数组
 * @returns {number[]} 中心点数组坐标
 */
export function getPolygonCenter(coordArr) {
  let x = 0
  let y = 0
  let len = coordArr.length
  coordArr.forEach((item) => {
    x += item[0]
    y += item[1]
  })
  return [x / len, y / len]
}

/**
 * 计算线段length
 * @param coordArr 线段坐标数组
 * @return {{lengthArr: *[], sum: *}}
 */
export function getLineStringLength(coordArr) {
  let lengthArr = []
  for (let i = 0; i < coordArr.length - 1; i++) {
    let length = CTMapOl.turf.distance(coordArr[i], coordArr[i + 1], {
      units: 'kilometers'
    })
    lengthArr.push(length)
  }
  let sum = lengthArr.reduce((total, num) => {
    return total + num
  }, 0)
  return {
    lengthArr,
    sum
  }
}

/**
 * 计算多边形area
 * @param coordArr 多边形坐标数组 不去掉首位坐标点
 * @return {number}
 */
export function getPolygonArea(coordArr) {
  let polygon = CTMapOl.turf.polygon([coordArr])
  return CTMapOl.turf.area(polygon)
}

/**
 * 开启坐标拾取
 * @param map
 * @param func
 * @returns {{lngLat: *[], location}}  lngLat坐标拾取经纬度 location坐标拾取实体用于停止坐标拾取
 */
export function markerPicking(map, func) {
  let lngLat = []
  const onClick = map.on('click', (evt) => {
    console.log(evt.coordinate)
    lngLat = evt.coordinate
    let backLngLat =
      CTMapOl.extend.formatLayer.transCooordinateFromOpenlayer(lngLat)
    console.log(backLngLat)
    if (func) {
      if (lngLat) {
        func(backLngLat)
      } else {
        func()
      }
    }
  })
  return onClick
}

/**
 * 关闭坐标拾取
 * @param onClick 坐标拾取实体
 */
export function stopMarkerPicking(onClick) {
  // location.stopPick(); //停止拾取
  unByKey(onClick)
}
/**
 * @description  : 显示图斑id的Text
 * { Object } map 地图实例
 * { String } polygonId 图斑Id
 * { Array } path 图斑数组 例:[[1,2],[2,2]]
 * { String } textHtml 显示的html文本模板
 * { String } popClass 弹窗class name
 * { Number } offsetX 偏移量x
 * { Number } offsetY 偏移量y
 * { String } epsg 坐标系
 */
export function showTextPolygonId(params) {
  const {
    map,
    polygonId,
    path,
    textHtml,
    popClass,
    offsetX,
    offsetY,
    epsg = '3857'
  } = params
  let x = 0
  let y = 0
  let len = path.length
  path.forEach((item) => {
    x += item[0]
    y += item[1]
  })
  let position = [x / len, y / len]
  if (epsg == '4326') {
    position = CTMapOl.extend.formatLayer.transCooordinateToOpenlayer(position)
  }
  const overlayHtml = textHtml
    ? textHtml
    : `
  <div style=" height: 26px;
    line-height: 26px;
    border-radius: 13px;
    color: #fff;
    padding: 0 8px;
    font-size: 16px;
    position: relative;
    left: 50%;
    margin: 0 0 19px 6px;
    background: linear-gradient(121deg, #E91D18 0%, #BA261F 100%);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);" >
  <div style="
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #E41E19;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(4px, -50%);"></div>
  ${polygonId}
  <div style="
    width: 4px;
    height: 32px;
    background: #E41E19;
    position: absolute;
    right: 100%;
    top: 50%;"></div>
  </div>`
  let infoWindow
  const infoWindowId = 'infoWindowId'
  let $info
  $info = document.createElement('div')
  $info.id = infoWindowId
  $info.className = popClass
  $info.innerHTML = overlayHtml
  $info.onmousewheel = function (e) {
    e.stopPropagation()
  }
  $info.onclick = function (e) {
    e.stopPropagation()
  }
  document.body.appendChild($info)
  /**
   * Create an overlay to anchor the popup to the map.
   */
  infoWindow = new CTMapOl.Overlay({
    id: infoWindowId,
    element: $info,
    position: position,
    positioning: 'bottom-center', //相对于其位置属性的实际位置
    stopEvent: false, //事件冒泡
    offset: [offsetX, offsetY],
    autoClose: false, // 设置自动关闭为false
    pointerEvents: 'auto', // 设置pointer-events为auto
    autoPan: {
      animation: {
        duration: 250
      }
    }
  })
  infoWindow.on('click', function (event) {
    event.stopPropagation()
    // 其他的事件处理逻辑
  })
  map.addOverlay(infoWindow)
  return infoWindow
}

/**
 * 根据点、距离和角度计算目标点
 * @param origin            初始点坐标
 * @param distance          距离（米）
 * @param bearing           角度（度）
 * @param options           可选参数
 * @returns {*[]}           终点经纬度
 */
export function calculateCoordinatePoints(origin, distance, bearing, options) {
  let angle = Number(bearing) > 180 ? Number(bearing) - 360 : Number(bearing)
  let terminal = new CTMapOl.turf.rhumbDestination(
    origin,
    distance,
    angle,
    options
  )
  let Latitude = terminal.geometry.coordinates[0].toFixed(9)
  let longitude = terminal.geometry.coordinates[1].toFixed(9)
  return [Latitude, longitude]
}
/**
 * @description  : 渲染polygon图斑
 * @param         { Object } map 地图实例
 * @param         { Array } coordinates 坐标
 * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor,fillOpacity } 图斑样式
 * @param         { Object } nodeStyleObject { nodeRadius,nodeColor } 顶点样式
 * @param         { Boolean } isShowAllPolygon 是否全部显示图斑
 * @param         { String }id 多边形id
 */
export function renderPolygon(
  map,
  coordinates,
  styleObject,
  nodeStyleObject,
  isShowAllPolygon,
  id,
  epsg = '4326'
) {
  const { strokeColor, strokeWidth, fillColor, fillOpacity } = styleObject
  if (coordinates.length === 0) {
    return false
  }
  let styles = []
  // 设置图斑样式
  if (styleObject) {
    let style = new CTMapOl.style.Style({
      stroke: new CTMapOl.style.Stroke({
        color: strokeColor ? strokeColor : 'blue',
        width: strokeWidth ? strokeWidth : 3
      }),
      fill: new CTMapOl.style.Fill({
        color: fillColor ? fillColor : 'rgba(0, 0, 255, 0.1)'
      })
    })
    styles.push(style)
  }
  // 设置顶点样式
  if (nodeStyleObject) {
    const { nodeRadius, nodeColor } = nodeStyleObject
    let nodeStyle = new CTMapOl.style.Style({
      image: new CircleStyle({
        radius: nodeRadius ? nodeRadius : 0,
        fill: new CTMapOl.style.Fill({
          color: nodeColor ? nodeColor : 'orange'
        })
      }),
      geometry: function (f) {
        const coords = f.getGeometry().getCoordinates()[0]
        return new CTMapOl.geom.MultiPoint(coords)
      }
    })
    styles.push(nodeStyle)
  }
  const geom = new CTMapOl.geom.MultiPolygon(coordinates)
  if (epsg === '4326') {
    geom.transform('EPSG:4326', 'EPSG:3857')
  }
  let feature = new CTMapOl.Feature({
    geometry: geom,
    id: id
  })
  let vectorSource = new CTMapOl.source.Vector()
  vectorSource.addFeature(feature)
  let vectorLayer = new CTMapOl.layer.Vector({
    source: vectorSource,
    style: styles,
    opacity: fillOpacity ? fillOpacity : 1
  })
  map.addLayer(vectorLayer)
  // 设置显示全部图斑
  if (isShowAllPolygon) {
    map.getView().fit(geom, {
      padding: [100, 100, 100, 100]
    })
  }
  return {
    feature: feature,
    vectorLayer: vectorLayer
  }
}
/**
 * @description  : polygon编辑
 * @param         { type } map 地图实例
 * @param         { type } vector 图层
 * @return        { type }
 */
export function editPolygon(map, vector) {
  if (this.modify) {
    this.map.removeInteraction(this.modify)
  }
  this.modify = new CTMapOl.interaction.Modify({
    source: vector.getSource() //这里要用source
  })
  map.addInteraction(this.modify)
}

/**
 * @description  : 渲染WMSLayer
 * @param         { Object } map 地图实例
 * @param         { Object } params 参数{ url, layerName, geomKey } 地址、图层名称、？
 * @return        { Object }
 */
export function renderWMSLayer(map, params) {
  const { url, layerName, geomKey } = params
  var wmsSource = new CTMapOl.source.ImageWMS({
    url: url,
    projection: 'EPSG:3857',
    layer: layerName,
    geomKey: geomKey,
    crossOrigin: 'anonymous',
    params: { LAYERS: layerName },
    ratio: 1,
    serverType: 'geoserver'
  })
  var wmsLayer = new CTMapOl.layer.Image({
    source: wmsSource
  })
  return wmsLayer
}

/**
 * 根据坐标点、水平偏移角、初始角获取所有辅助线的坐标
 * @param center            中心点
 * @param initialAngle      初始角度
 * @param intervalAngle     水平偏移角度
 * @param distance          距离（米）
 * @param options           可选参数
 * @returns {*[]}           所有辅助线的两点坐标
 */
export function getGuidePoints(
  center,
  initialAngle,
  intervalAngle,
  distance,
  options
) {
  let angle = Math.abs(Number(initialAngle)) //初始角度绝对值
  let value = Number(initialAngle)
  let lists = []
  for (angle; angle < 360; angle += Number(intervalAngle)) {
    let list = []
    list.push(center)
    list.push(
      calculateCoordinatePoints(center, distance, Number(value), options)
    )
    value += Number(intervalAngle)
    lists.push(list)
  }
  return lists
}

/**
 * 绘画辅助线
 * @param map                 地图实例
 * @param list                调用getGuidePoints方法返回的坐标点位
 * @param strokeColor         线颜色
 * @param strokeWidth         线宽度
 * @param isShowAllPolyline   是否视角显示全部折线
 * @param isShowMarker        是否展示起点终点打点
 * @returns {*[]}             辅助线数据
 */
export function getRotateLine(
  map,
  list,
  strokeColor,
  strokeWidth,
  isShowAllPolyline,
  isShowMarker
) {
  let auxiliaryLines = []
  list.forEach((it) => {
    let line = describingPolyline(
      map,
      it,
      strokeColor,
      strokeWidth,
      isShowAllPolyline,
      isShowMarker
    )
    auxiliaryLines.push(line)
  })
  return auxiliaryLines
}

/**
 * 清除辅助线
 * @param map             地图实体
 * @param polylineList    折线实体
 */
export function clearGuide(map, polylineList) {
  polylineList.forEach((polylineObj) => {
    clearPolyline(map, polylineObj)
  })
}

/**
 * 计算水平方位角
 * @param start       开始点
 * @param end         结束点
 * @param num         保留小数点后几位
 * @returns {*}       两点恒向线夹角
 */
export function getHorizontalAngle(start, end, num) {
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
export function getDistance(start, end, num) {
  let distance = CTMapOl.turf.distance(start, end)
  return distance.toFixed(num)
}

/**
 * @description  : 设置多边形区域
 * @param         { Object } map 地图实例
 * @param         { Array } coordinates 坐标集合
 * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor } 样式
 * @param         { String } gridName 区域名称
 * @param         { Boolean } flag 是否为绘制图斑
 */
export function setPolygon(
  map,
  coordinates,
  styleObject,
  gridName,
  flag,
  zoomTo
) {
  let fillColor = styleObject.fillColor
  let strokeColor = styleObject.strokeColor
  let polygonStyle = new CTMapOl.style.Style({
    fill: new CTMapOl.style.Fill({
      color: fillColor
    }),
    stroke: new CTMapOl.style.Stroke({
      color: strokeColor,
      width: styleObject.strokeWidth ? styleObject.strokeWidth : 3
    })
  })
  let allStyle = [polygonStyle]
  if (!flag) {
    allStyle.push(
      new CTMapOl.style.Style({
        text: new CTMapOl.style.Text({
          font: styleObject.css.font,
          stroke: new CTMapOl.style.Stroke({
            color: styleObject.css.strokeColor,
            width: styleObject.css.strokeWidth
          }),
          text: gridName,
          fill: new CTMapOl.style.Fill({
            color: styleObject.css.color
          }),
          textAlign: 'center',
          justify: 'center',
          align: 'center',
          overflow: true
        }),
        geometry: (feature) => {
          let geom = feature.getGeometry()
          if (geom.getType() === 'MultiPolygon') {
            let centerArray = []
            let length = geom.getPolygons().length
            for (let i = 0; i < length; i++) {
              centerArray.push(
                CTMapOl.extent.getCenter(geom.getPolygon(i).getExtent())
              )
            }
            return new CTMapOl.geom.MultiPoint(centerArray)
          } else {
            return new CTMapOl.geom.Point(
              CTMapOl.extent.getCenter(feature.getGeometry().getExtent())
            )
          }
        }
      })
    )
  }
  // 多坐标转换指定投影系
  let geom = new CTMapOl.geom.MultiPolygon(coordinates)
  let featureVV = new CTMapOl.Feature({
    geometry: geom,
    type: 'polygon'
  })
  featureVV.setStyle(allStyle)
  let polygonSource = new CTMapOl.source.Vector() // 创建数据源
  let polygonLayer = new CTMapOl.layer.Vector({
    // 创建图层
    zIndex: 9999 // 图层的层级
  })
  polygonLayer.setSource(polygonSource) // 把数据源绑定到图层上面
  polygonSource.addFeature(featureVV)
  map.addLayer(polygonLayer) // 把图层添加到地图上面去
  if (zoomTo) {
    map.getView().fit(geom, {
      padding: [100, 100, 100, 100]
    })
  }

  return { geom, featureVV, polygonLayer }
}
