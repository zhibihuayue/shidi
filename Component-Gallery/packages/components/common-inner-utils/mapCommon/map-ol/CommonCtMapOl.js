/* eslint-disable no-undef */
import CTMapOl from '@ct/ct_map_ol'

// import store from "@/store";
import $ from 'jquery'
import { $v } from '../../funCommon/common.js'
const {
  Feature,
  Observable,
  easing,
  source,
  layer,
  style,
  sphere,
  geom,
  format,
  control,
  turf
} = CTMapOl
const { easeOut } = easing
const { GeoJSON } = format
const { destination } = turf
const { unByKey } = Observable
const { circular } = geom.Polygon
const { ScaleLine } = control
const { getArea, getLength } = sphere
const { Vector: VectorLayer } = layer
const { Vector: VectorSource } = source
const { Circle: CircleStyle, Fill, Stroke, Style, Text } = style

// export function isTenant() {
//   return !!store.getters.userInfo.tenantId;
// }
// let mapView='';
const defaultCenters_common = [104.64614, 37.227363]
const defaultZoom = 5
const SlopeMode = {
  0: 'graphicandarrow', // 显示坡度和坡向
  1: 'graphic', // 显示坡度
  2: 'arrow', // 显示坡向
  3: 'none' // 不显示
}

/**
 * @param mapId 地图id(必传)
 * @param center 地图中心点(非必传有默认)
 * @param mapTypeIndex (地图加载的类型1为路网, 2为卫星地图)
 * @param zoom 地图初始化层级(非必传有默认)
 */
export function initCTMap(mapId, center, mapTypeIndex, zoom) {
  if (center == null) {
    center = defaultCenters_common
  }
  if (zoom == null) {
    zoom = defaultZoom
  }
  // 单坐标转换指定投影系
  let coordinate = transCoordinate(center)
  let mapMap = new CTMapOl.extend.InitMap({
    domId: mapId,
    tile: mapTypeIndex === 1 ? 'vector' : 'satellite',
    center: coordinate,
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
  let newZoom = zoomNum
  if (!view) {
    return false
  }
  if (!newZoom) {
    newZoom = view.getZoom()
  }
  if (newZoom >= view.getMinZoom() && newZoom <= view.getMaxZoom()) {
    let newResolution = view.getResolutionForZoom(newZoom)
    if (center) {
      // 单坐标转换指定投影系
      let coordinate = transCoordinate(center)
      if (view.getAnimating()) {
        view.cancelAnimations()
      }
      let param = {
        center: coordinate, //lngLatToCoordinate(center),
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

/**
 * 经纬度转coordinate
 * @param lngLat
 * @returns {*}
 */
export function lngLatToCoordinate(lngLat) {
  return CTMapOl.proj.fromLonLat(lngLat)
}

export function setZoomAndCenter(map, lng, lat, zoom) {
  zoom2centerAndZoomNum(map, 0, [Number(lng), Number(lat)], zoom)
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
  infoBlock = () => {
    console.log('执行默认的infoBlock函数')
  },
  infoWindowId = 'infoWindowId'
) {
  let infoWindow
  let $info

  $info = document.createElement('div')
  $info.id = infoWindowId
  $info.className = popClass
  $info.innerHTML = content
  $info.onmousewheel = function (e) {
    e.stopPropagation()
  }
  // $info.onclick = function(e) {
  //   e.stopPropagation();
  // };
  document.body.appendChild($info)

  // 单坐标转换指定投影系
  let coordinate = transCoordinate([lng, lat])
  /**
   * Create an overlay to anchor the popup to the map.
   */
  infoWindow = new CTMapOl.Overlay({
    id: infoWindowId,
    element: $info,
    position: coordinate,
    positioning: 'bottom-center', //相对于其位置属性的实际位置
    stopEvent: true, //事件冒泡
    offset: [offsetX, offsetY],
    // autoClose: false, // 设置自动关闭为false
    // pointerEvents: 'auto', // 设置pointer-events为auto
    autoPan: {
      animation: {
        duration: 250
      }
    },
    zIndex: 100
  })
  // infoWindow.on('click', function(event) {
  //   event.stopPropagation();
  //   // 其他的事件处理逻辑
  // });
  map.addOverlay(infoWindow)
  setTimeout(function () {
    infoBlock()
  }, 100)
  return infoWindow
}

/**
 * 关闭地图弹窗
 */
export function closeInfoWindow(
  map,
  infoWindowEntity,
  infoWindowId = 'infoWindowId',
  closeDeviceblock = () => {
    console.log('执行默认的closeDeviceblock函数')
  }
  // ,supview
) {
  console.log('===>map:', map)
  console.log('===>map:', infoWindowId)
  console.log('===>map:', infoWindowEntity)
  if (map.getOverlayById(infoWindowId) || infoWindowEntity) {
    map.removeOverlay(infoWindowEntity)

    closeDeviceblock()
  }
}

/**
 * 地图点击事件, 防止点地图弹出的图层误触发
 * @param map
 * @param successFn
 */
export function mapClick(map, is3d, successFn) {
  if (is3d) {
    let viewer = map._viewer
    // let CesiumEventHandlerclick = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // CesiumEventHandlerclick.setInputAction(function (e) {
    // if(viewer._inOperation){
    //   return false;
    // }
    // console.log("==================", e);
    // let ray = viewer.camera.getPickRay(e.position);
    // let cartesian1 = viewer.scene.globe.pick(ray, viewer.scene);
    // let lnglat = Cesium.Cartographic.fromCartesian(cartesian1);
    // let longitude = lnglat.longitude/ Math.PI * 180;
    // let latitude = lnglat.latitude/ Math.PI * 180;
    // successFn({
    //   lng: longitude,
    //   lat: latitude
    // });
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    map.on('click', function (event) {
      if (viewer._inOperation) {
        return false
      }
      // let ray = viewer.camera.getPickRay(e.position);
      // let cartesian1 = viewer.scene.globe.pick(ray, viewer.scene);
      // let lnglat = Cesium.Cartographic.fromCartesian(cartesian1);
      // let longitude = lnglat.longitude/ Math.PI * 180;
      // let latitude = lnglat.latitude/ Math.PI * 180;
      successFn({
        lng: event.lnglat[0],
        lat: event.lnglat[1],
        event
      })
    })
  } else {
    map.on('click', function (event) {
      if (
        event.originalEvent.target.nodeName !== 'CANVAS' ||
        map._inOperation
      ) {
        console.log('点击的不是地图canvas')
        return false
      }
      if (!event.stopClick) {
        successFn(event)
      }
    })
  }
}

/**
 * @param map 地图实体
 * @param lng 经度
 * @param lat 纬度
 * @param id
 * @param imgObj img对象的参数'{imgPath, scale, offSet}'
 *  imgPath  图片地址
 *  scale 缩放
 *  offSet 偏移
 * @param clickFn 点击回调
 */
export function addMarker(map, lng, lat, id, imgObj, clickFn) {
  if (!map) {
    return
  }
  // 创建图像
  let img = new Image()
  img.src = imgObj.imgPath
  // 计算偏移量
  let offset = imgObj.offset || imgObj.offSet // 根据您的需求设置偏移量
  if (!offset) {
    offset = [0, 0]
  }
  // 创建标记元素
  let markerElement = $('<div class="marker"></div>')
  markerElement.css({
    'position': 'absolute',
    'background': `url(${img.src})`,
    'background-size': '100% 100%',
    'transform': `translate(${offset[0]}px, ${offset[1]}px)`,
    'width': `${imgObj.imgWidth}px`,
    'height': `${imgObj.imgHeight}px`
  })
  // 单坐标转换指定投影系
  let coordinate = transCoordinate([lng, lat])
  // 创建标记对象
  let marker = new CTMapOl.Overlay({
    element: markerElement[0],
    position: coordinate, // 标记的位置
    stopEvent: false
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

export function setZoom12(map, lng, lat) {
  let zoom = map.getView().getZoom()
  if (zoom < 12) {
    zoom = 12
  }
  let lngLat = transCoordinate([lng, lat], 'EPSG:3857', 'EPSG:4326')
  zoom2centerAndZoomNum(map, 0, lngLat, zoom)
}

function _viewshedInit(viewshed) {
  if (!viewshed) {
    return
  }
  viewshed.viewDistanceColor =
    viewshed.viewDistanceColor || 'rgba(79, 159, 255, 0.3)'
  viewshed.viewAngleColor = viewshed.viewAngleColor || 'rgba(79, 159, 255, 0.7)'
  viewshed.viewDistanceWarningColor =
    viewshed.viewDistanceWarningColor || 'rgba(251, 145, 60, .3)'
  viewshed.viewAngleWarningColor =
    viewshed.viewAngleWarningColor || 'rgba(251, 145, 60, .7)'
  return viewshed
}

// 简化复杂度使用的输出style对象方法
function _cameraStyleObject(type, data, zIndex) {
  // 切图四周有空白，不能直接用1，改成0.8
  const fixAnchor = data.offset[0] != data.offset[1] ? [0.5, 0.85] : [0.5, 0.5]
  if (data.outerNestIcon) {
    return [
      new CTMapOl.style.Style({
        image: new CTMapOl.style.Icon({
          src: type == 2 ? data.clickIcon : data.icon,
          height: data.iconSize[1],
          width: data.iconSize[0],
          anchor: [0.5, 0.95]
        }),
        zIndex
      }),
      //todo 增加多层图标
      new CTMapOl.style.Style({
        image: new CTMapOl.style.Icon({
          src: data.outerNestIcon,
          width: 15, // 设置图标大小
          height: 15,
          anchor: [0.5, 1.9]
        }),
        zIndex
      })
    ]
  }
  return new CTMapOl.style.Style({
    image: new CTMapOl.style.Icon({
      src: type == 2 ? data.clickIcon : data.icon,
      height: data.iconSize[1],
      width: data.iconSize[0],
      anchor: fixAnchor
    }),
    zIndex
  })
}
/**
 * 点聚合
 * @param map 地图实体
 * @param deviceParam { list, clickFn, clusterImgItem, viewshed}list 摄像机站址数据
 * @param provinceList 省级统计数量(铁塔视角传,其他不传)
 * @param cityList 地市级统计数量(铁塔视角传,其他不传)
 * @param successFn 成功回调
 * @returns {*}
 */
export function showMarkCluster(
  map,
  deviceParam,
  provinceList,
  cityList,
  successFn
) {
  let clusterImgItem = deviceParam.clusterImgItem
  const hasProvinceAndCity = provinceList && cityList
  // 初始化一些字段的默认值
  clusterImgItem.zIndex = clusterImgItem.zIndex || 0
  clusterImgItem.minZoom =
    clusterImgItem.minZoom || (hasProvinceAndCity ? 10.99 : 4.99)

  let viewshed = _viewshedInit(deviceParam.viewshed)
  console.log('试图的图层属性', viewshed)
  const layers = []
  if (hasProvinceAndCity) {
    layers.push({
      data: provinceList.map((item) => {
        let coordinate = transCoordinate([item.longitude, item.latitude])
        return {
          latitude: coordinate[1],
          longitude: coordinate[0],
          count: item.deviceNum
        }
      }),
      zIndex: clusterImgItem.zIndex,
      minZoom: 4.99,
      maxZoom: 7.99,
      iconStyleFunc: (data) => {
        return new CTMapOl.style.Style({
          image: new CTMapOl.style.Icon({
            src: clusterImgItem.clusterImg,
            size: [96, 96], // 设置图标大小
            anchor: [0.5, 0.5],
            scale: 0.5
          }),
          text: new CTMapOl.style.Text({
            text: data.count,
            fill: new CTMapOl.style.Fill({
              color: '#fff'
            }),
            font: '14px Arial',
            textAnchor: 'middle',
            offsetY: 9 // 设置文本向下偏移5像素
          })
        })
      },
      onClick: (data) => {
        console.log(data)
      }
    })
    layers.push({
      data: cityList.map((item) => {
        let coordinate = transCoordinate([item.longitude, item.latitude])
        return {
          latitude: coordinate[1],
          longitude: coordinate[0],
          count: item.deviceNum
        }
      }),
      zIndex: clusterImgItem.zIndex,
      minZoom: 7.99,
      maxZoom: 10.99,
      iconStyleFunc: (data) => {
        return new CTMapOl.style.Style({
          image: new CTMapOl.style.Icon({
            src: clusterImgItem.clusterImg,
            size: [96, 96], // 设置图标大小
            anchor: [0.5, 0.5],
            scale: 0.5
          }),
          text: new CTMapOl.style.Text({
            text: data.count,
            fill: new CTMapOl.style.Fill({
              color: '#fff'
            }),
            font: '14px Arial',
            textAnchor: 'middle',
            offsetY: 9 // 设置文本向下偏移5像素
          })
        })
      },
      onClick: (data) => {
        console.log(data)
      }
    })
  }
  let dList = deviceParam.list.map((deviceItem) => {
    // 单坐标转换指定投影系
    const coordinate = transCoordinate([
      deviceItem.longitude,
      deviceItem.latitude
    ])
    return {
      ...deviceItem,
      longitude: coordinate[0],
      latitude: coordinate[1],
      status: +deviceItem.status
    }
  })
  let clusterImg = new Image()
  clusterImg.src = clusterImgItem.clusterImg
  clusterImg.onload = () => {
    layers.push({
      data: dList,
      icon: clusterImgItem.clusterImg,
      iconStyleFunc: (count) =>
        new CTMapOl.style.Style({
          image: new CTMapOl.style.Icon({
            src: clusterImgItem.clusterImg,
            size: [clusterImg.width, clusterImg.height], // 设置图标大小
            anchor: [
              clusterImgItem.clusterOffset[0] / clusterImgItem.clusterImgWidth,
              clusterImgItem.clusterOffset[1] / clusterImgItem.clusterImgHeight
            ],
            scale: clusterImgItem.clusterImgWidth / clusterImg.width
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
        }),
      onClick: (data) => {
        //地图层级12级
        setZoom12(map, data.longitude, data.latitude)
        deviceParam.clickFn(data.id, data)
      },
      onClickCluster: (dataList, feature) => {
        const zoom = map.getView().getZoom()
        const maxZoom = map.getView().getMaxZoom()
        if (zoom >= Math.floor(maxZoom)) {
          // 不能再放大地图了
          deviceParam.clickClusterFn(dataList, feature)
          return false // 返回 false 是为了取消点击聚合点时的默认缩放
        }
      },
      zIndex: clusterImgItem.zIndex,
      minZoom: clusterImgItem.minZoom,
      maxZoom: 18
    })
    let img = new Image()
    img.src = deviceParam.list[0]?.icon || clusterImgItem.clusterImg
    img.onload = () => {
      let LayeredClusterViewShed = new CTMapOl.extend.LayeredClusterViewShed(
        map,
        layers,
        {
          minViewShed: 10,
          // 地图放大逻辑是clusterMaxZoom + 1， 需求需要放大到12级，所以设置11
          clusterMaxZoom: 11,
          stopClick: true,
          clickToTop: true,
          // viewShedRadius: viewshed.viewShedRadius || 50,
          viewDistanceColor: viewshed.viewDistanceColor,
          viewAngleColor: viewshed.viewAngleColor,
          viewDistanceWarningColor: viewshed.viewDistanceWarningColor,
          viewAngleWarningColor: viewshed.viewAngleWarningColor,
          // cameraIcon: deviceParam.list[0].icon,
          // cameraActiveIcon: deviceParam.list[0].clickIcon,
          cameraStyleFunc: (data) => {
            return _cameraStyleObject(1, data)
          },
          cameraActiveStyleFunc: (data) => {
            return _cameraStyleObject(2, data, 20)
          }
        }
      )
      successFn(LayeredClusterViewShed)
    }
  }
}

/**
 * 1.2.	POI-关键字搜索接口
 * 字段描述	字段名称	类型	必填	字段说明
 * keyWord	搜索的关键字	String	是	无
 * location	地图经纬度(“经度,纬度”)	String	否	经纬度用逗号拼接 和行政编码二选一必填
 * adCode	指定行政区的国标码（行政区划编码表）严格按照sys_area表	String	否	基于天地图的行政区划编码表 和经纬度二选一必填
 * level	目前查询的级别	String	否	1-18级
 * queryType	搜索类型	String	必填	1:普通搜索（含地铁公交） 7：地名搜索
 * pageSize	分页参数	String	必填	分页参数
 * pageNum	分页参数	String	必填	分页参数
 * poiTypes	POI数据类型	String	否	基于天地图的POI数据类型（离线地图时需确认与天地图差异）
 * @returns {*}
 */
export function keyWordQueryPoi(data, loadParam) {
  return new Promise((resolve, reject) => {
    $v.post(
      window._mainVue,
      '/gis/gis/poi/keyWordQuery',
      data,
      resolve,
      reject,
      loadParam
    )
  })
}

/**
 * 1.6.	逆地理编码接口
 * location	地图经纬度(“经度,维度”)	String	是	经纬度用逗号拼接
 * poiTypes	POI数据类型	String	否	基于天地图的POI数据类型（离线地图时需确认与天地图差异）
 * radius	搜索半径，单位米，默认1000米	String	否
 */
export function poiContraryGeocodingQuery(data, loadParam) {
  return new Promise((resolve, reject) => {
    $v.post(
      window._mainVue,
      '/gis/gis/poi/poiContraryGeocodingQuery',
      data,
      resolve,
      reject,
      loadParam
    )
  })
}

/**
 * 1.7.	行政区划查询接口
 * keyWord	搜索的关键字，行政区域名称	String	否	无
 * adCode	行政区域编码	String	否	与关键词二选一必填
 */
export function poiAreaQuery(data) {
  return new Promise((resolve, reject) => {
    $v.post(window._mainVue, '/gis/gis/poi/poiAreaQuery', data, resolve, reject)
  })
}

/**
 * 1.8.	路径规划接口-点到点纯路径
 * keyWord	搜索的关键字，行政区域名称	String	否	无
 * adCode	行政区域编码	String	否	与关键词二选一必填
 */
export function trajectoryQuery(data, loadParam) {
  return new Promise((resolve, reject) => {
    $v.post(
      window._mainVue,
      '/gis/gis/poi/trajectoryQuery',
      data,
      resolve,
      reject,
      loadParam
    )
  })
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
  // 单坐标转换指定投影系
  let coordinate = transCoordinate(center)
  let { fillColor, fillOpacity, strokeColor, strokeWidth } = circleObj
  let sourcePoint = new VectorSource() // 创建数据源
  let layerPoint = new VectorLayer({
    // 创建图层
    zIndex: 1, // 图层的层级
    opacity: fillOpacity
  })
  layerPoint.setSource(sourcePoint) // 把数据源绑定到图层上面
  let feature = new Feature({
    title: 'beijing',
    geometry: new circular(coordinate, radius)
  })
  feature.setStyle(
    new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new CTMapOl.style.Stroke({
        color: strokeColor,
        width: strokeWidth
      })
    })
  )

  sourcePoint.addFeatures([feature])
  map.addLayer(layerPoint) // 把图层添加到地图上面去
  if (isShowAllCircle) {
    //是否展示整个圆
    setTimeout(() => {
      map.getView().fit(new circular(coordinate, radius), {
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
  // 多坐标转换指定投影系
  let coordinates = transCoordinates(lineArr)
  let routeFeature = new CTMapOl.Feature({
    type: 'route',
    geometry: new CTMapOl.geom.LineString(coordinates)
  })
  // 创建开始图标
  const startMarker = new CTMapOl.Feature({
    type: 'startMarker',
    geometry: new CTMapOl.geom.Point(coordinates[0])
  })
  // 创建结束图标
  const endMarker = new CTMapOl.Feature({
    type: 'endMarker',
    geometry: new CTMapOl.geom.Point(coordinates[coordinates.length - 1])
  })
  // 设置样式
  let styles = {
    route: new CTMapOl.style.Style({
      stroke: new CTMapOl.style.Stroke({
        width: strokeWidth, //线的宽度
        color: strokeColor //线的颜色
      })
    }),
    // 如果类型是 geoMarker 的样式
    startMarker: new CTMapOl.style.Style({
      image: new CTMapOl.style.Icon({
        src: require('@component-gallery/assets/mapImage/locusStart.svg'),
        anchor: [0.5, 1.1] // 设置偏移
      })
    }),
    endMarker: new CTMapOl.style.Style({
      image: new CTMapOl.style.Icon({
        src: require('@component-gallery/assets/mapImage/locusEnd.svg'),
        anchor: [0.5, 1.1] // 设置偏移
      })
    })
  }
  let source = new CTMapOl.source.Vector({
    features: [routeFeature]
  })
  if (isShowMarker) {
    //是否添加打点源数据
    source.addFeature(startMarker)
    source.addFeature(endMarker)
  }
  // 把线添加到图层
  let vectorLayer = new CTMapOl.layer.Vector({
    source: source, //线,起点的图标,终点的图标
    style: function (feature) {
      return styles[feature.get('type')]
    }
  })

  map.addLayer(vectorLayer)
  if (isShowAllPolyline) {
    //是否展示所有折线
    map.getView().fit(new CTMapOl.geom.LineString(coordinates), {
      padding: [100, 100, 100, 100],
      callback: map.getLayers().getArray()[1].dispatchEvent('postcompose')
    }) //设置地图的缩放距离离屏幕的大小
  }

  return {
    feature: routeFeature,
    vectorLayer: vectorLayer
  }
}

/**
 * 清除折线
 * @param map 地图实体
 * @param polylineObj 折线实体
 */
export function clearPolyline(map, polylineObj) {
  map.removeLayer(polylineObj.vectorLayer) //移除图层
}
/**
 * 测量类
 */
export class measureClass {
  constructor(map, color = '#ff0000') {
    this.map = map
    this.color = color
    this.measure = null
  }

  /**
   * 设置测量线的颜色
   * @param color
   */
  setColor(color) {
    this.color = color
  }

  /**
   * 测量距离 || 面积
   * @param type 长度 || 面积
   */
  startMeasure(type = '长度') {
    this.distoryMeasure()
    this.measure = new CTMapOl.extend.ToolMeasure(this.map, {
      color: this.color,
      type: type
    })
    this.measure.start()
  }

  /**
   * 清除测量
   */
  clearMeasure() {
    if (this.measure) {
      this.measure.clear()
    }
  }

  /**
   * 销毁测量
   */
  distoryMeasure() {
    if (this.measure) {
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
 * 计算线段长度
 * @param coordArr 线段坐标数组
 * @return {{lengthArr: *[], sum: *}}
 */
export function getLineStringLength(coordArr) {
  let lengthArr = []
  // 多坐标转换指定投影系
  let coordinates = transCoordinates(coordArr)
  for (let i = 0; i < coordinates.length - 1; i++) {
    let line = new CTMapOl.geom.LineString([coordinates[i], coordinates[i + 1]])
    let length = getLength(line, {
      projection: 'EPSG:3857'
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
 * 计算多边形面积
 * @param coordArr 多边形坐标数组 不去掉首位坐标点
 * @return {number}
 */
export function getPolygonArea(coordArr) {
  // 多坐标转换指定投影系
  let coordinates = transCoordinates(coordArr)
  let polygon = new CTMapOl.geom.Polygon(coordinates)
  let area = getArea(polygon, {
    projection: 'EPSG:3857'
  })
  return area
}

/**
 * 开启坐标拾取
 * @param map
 * @returns {{lngLat: *[], location}}  lngLat坐标拾取经纬度 location坐标拾取实体用于停止坐标拾取
 */
export function markerPicking(map, func) {
  let lngLat = []
  const onClick = map.on('click', (evt) => {
    console.log(evt.coordinate)
    lngLat = evt.coordinate
    if (func) {
      if (lngLat) {
        // 单坐标转换指定投影系
        let coordinate = transCoordinate(lngLat, 'EPSG:3857', 'EPSG:4326')
        func({ lng: coordinate[0], lat: coordinate[1] })
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
 * @param         { Object } map 地图实例
 * @param         { String } polygonId 图斑Id
 * @param         { Array } path 图斑数组 例:[[1,2],[2,2]]
 * @param         { String } textHtml 显示的html文本模板
 * @param         { String } popClass 弹窗class name
 * @param         { Number } offsetX 偏移量x
 * @param         { Number } offsetY 偏移量y
 * @param         { String } epsg 坐标系
 */
export function showTextPolygonId(
  map,
  polygonId,
  path,
  textHtml,
  popClass,
  offsetX,
  offsetY,
  epsg = '3857'
) {
  let x = 0
  let y = 0
  let len = path.length
  path.forEach((item) => {
    x += Number(item[0])
    y += Number(item[1])
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
    margin: 0 0 19px 6px;
    transform: translateX(50%);
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
  // 单坐标转换指定投影系
  let coordinate = transCoordinate(origin)
  let terminal = destination(coordinate, distance, bearing, options)
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
  id
) {
  const { strokeColor, strokeWidth, fillColor, fillOpacity } = styleObject
  const { nodeRadius, nodeColor } = nodeStyleObject
  if (coordinates.length === 0) {
    return false
  }
  let _coordinates = transCoordinate(coordinates)
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
    let nodeStyle = new CTMapOl.style.Style({
      image: new CircleStyle({
        radius: nodeRadius ? nodeRadius : 0,
        fill: new CTMapOl.style.Fill({
          color: nodeColor ? nodeColor : 'orange'
        })
      }),
      geometry: function (_feature) {
        // const coordinates = ;
        return new CTMapOl.geom.MultiPoint(
          _feature.getGeometry().getCoordinates()[0]
        )
      }
    })
    styles.push(nodeStyle)
  }
  const polygonFeature = new CTMapOl.geom.Polygon([_coordinates])
  let feature = new CTMapOl.Feature({
    geometry: polygonFeature,
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
    map.getView().fit(new CTMapOl.geom.Polygon(_coordinates), {
      padding: [100, 100, 100, 100]
    })
  }
  return {
    feature: feature,
    polygonFeature: polygonFeature,
    vectorLayer: vectorLayer
  }
}

// // 周边分析打点
export function showMarkClusterAround(
  map,
  iconConfig,
  aroundList = [],
  pointClickCB
) {
  let LayeredViewPoints = new CTMapOl.extend.Markers(map, aroundList, {
    layerOptions: {
      zIndex: 999
    },
    stopClick: true,
    clickToTop: true,
    getCoordsFunc: (item) => [item.longitudef, item.latitudef],
    markerStyle: (feature) => {
      const pointData = feature.get('data')
      let iconImg = iconConfig[pointData.type]
      let _size = [iconImg.width || 34, iconImg.height || 34]
      let _anchor = _size[0] !== _size[1] ? [0.5, 0.85] : [0.5, 0.5]
      let pointIcon
      if (pointData.type == '4') {
        pointIcon = pointData.status != '1' ? iconImg.icon2 : iconImg.icon1
      } else {
        pointIcon = pointData.status != '0' ? iconImg.icon2 : iconImg.icon1
      }
      const selected = feature.get('selected')
      // 尽量在函数外预先生成固定不变部分，可提高性能
      if (pointData.outerNestIcon) {
        return selected
          ? [
              new CTMapOl.style.Style({
                image: new CTMapOl.style.Icon({
                  src: iconImg.clickIcon,
                  width: _size[0],
                  height: _size[1],
                  anchor: [0.5, 0.95]
                }),
                zIndex: Infinity
              }),
              new CTMapOl.style.Style({
                image: new CTMapOl.style.Icon({
                  src: pointData.outerNestIcon,
                  width: 15, // 设置图标大小
                  height: 15,
                  anchor: [0.5, 1.9]
                }),
                zIndex: Infinity
              })
            ]
          : [
              new CTMapOl.style.Style({
                image: new CTMapOl.style.Icon({
                  src: pointIcon,
                  width: _size[0],
                  height: _size[1],
                  anchor: [0.5, 0.95]
                })
              }),
              new CTMapOl.style.Style({
                image: new CTMapOl.style.Icon({
                  src: pointData.outerNestIcon,
                  width: 15, // 设置图标大小
                  height: 15,
                  anchor: [0.5, 1.9]
                })
              })
            ]
      } else {
        return selected
          ? new CTMapOl.style.Style({
              image: new CTMapOl.style.Icon({
                src: iconImg.clickIcon,
                width: _size[0],
                height: _size[1],
                anchor: _anchor
              }),
              zIndex: Infinity
            })
          : new CTMapOl.style.Style({
              image: new CTMapOl.style.Icon({
                src: pointIcon,
                width: _size[0],
                height: _size[1],
                anchor: _anchor
              })
            })
      }
    },
    onClick: (data) => {
      //setZoom12(map,data.longitudef,data.latitudef);
      pointClickCB(data)
      LayeredViewPoints._markerLayer.setZIndex(Infinity)
    },
    onDeselect: () => {
      LayeredViewPoints._markerLayer.setZIndex(999)
    }
  })
  return LayeredViewPoints
}
// 周边分析打点回显圆形
export const drawCircleAroundViewShed = (
  map,
  coordinates,
  radius,
  circleObj
) => {
  let { strokeColor, strokeWeight, fillColor, fillOpacity } = circleObj
  let viewShedIns = new CTMapOl.extend.EchoCircle(map, {
    center: transCoordinate(coordinates),
    radius: radius, // 单位-米
    strokeColor: strokeColor,
    strokeOpacity: 1,
    strokeWeight: strokeWeight,
    fillOpacity: fillOpacity,
    fillColor: fillColor
  })
  return viewShedIns
}

/**
 * @description  : 渲染点、线、多边形、圆
 * @param         { Object } map 地图实例
 * @param         { Object } type 渲染类型
 * @param         { Array } coordinates 坐标
 * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor } 样式
 * @param         { boolean } flag 是否渲染视野范围之内
 * @param         { number } zIndex 层级
 */
export function renderGraphic(
  map,
  type = 'Point',
  coordinates,
  styleObject,
  flag,
  zIndex = 0,
  color = '#000'
) {
  if (coordinates.length === 0) {
    return false
  }
  // 多坐标转换指定投影系
  coordinates = transCoordinates(coordinates)
  let tempCoordinates = [coordinates]

  const image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({ color: 'red', width: 1 })
  })
  let stroke = new Stroke({
    color: styleObject.strokeColor ? styleObject.strokeColor : 'blue',
    width: styleObject.strokeWidth ? styleObject.strokeWidth : 3
  })
  let fill = new Fill({
    color: styleObject.fillColor
      ? styleObject.fillColor
      : 'rgba(0, 0, 255, 0.1)'
  })

  const polygonStyle = (_feature) => {
    let text = _feature.get('text')
    return new Style({
      stroke: stroke,
      fill: fill,
      text: text
        ? new Text({
            font: '14px sans-serif',
            overflow: true,
            fill: new Fill({
              color: color
            }),
            stroke: new Stroke({
              width: 0.5,
              color: color
            }),
            text
          })
        : undefined
    })
  }

  const styles = {
    Point: new Style({
      image: image
    }),
    LineString: new Style({
      stroke: stroke
    }),
    Polygon: polygonStyle,
    MultiPolygon: polygonStyle,
    Circle: new Style({
      stroke: stroke,
      fill: fill
    })
  }

  const styleFunction = function (_feature) {
    const style = styles[_feature.getGeometry().getType()]
    return typeof style === 'function' ? style(_feature) : style
  }

  const crs = {
    type: 'name',
    properties: {
      name: 'EPSG:3857'
    }
  }

  let geojsonObject = {
    type: 'FeatureCollection',
    crs: crs,
    features: []
  }
  let feature = {
    type: 'Feature',
    geometry: {}
  }
  let geometry
  switch (type) {
    case 'Point': {
      geometry = {
        type: 'Point',
        coordinates: coordinates[0]
      }
      break
    }
    case 'Polyline': {
      geometry = {
        type: 'LineString',
        coordinates: coordinates
      }
      break
    }
    case 'Polygon': {
      geometry = {
        type: 'Polygon',
        coordinates: tempCoordinates
      }
      break
    }
    case 'MultiPolygon': {
      geometry = {
        type: 'MultiPolygon',
        coordinates: [tempCoordinates]
      }
      break
    }
    case 'Circle': {
      geometry = {
        type: 'Polygon',
        coordinates: tempCoordinates
      }
      break
    }
  }
  feature.geometry = geometry
  geojsonObject.features.push(feature)
  const olFeatures = new GeoJSON().readFeatures(geojsonObject)
  const vectorSource = new VectorSource({
    features: olFeatures
  })
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: styleFunction,
    zIndex: zIndex
  })
  map.addLayer(vectorLayer)

  if (flag) {
    setTimeout(() => {
      map.getView().fit(new CTMapOl.geom.Polygon(tempCoordinates), {
        padding: [100, 100, 100, 100]
      })
    }, 500)
  }

  return {
    feature: geojsonObject,
    polygonFeature: olFeatures[0],
    vectorSource: vectorSource,
    vectorLayer: vectorLayer
  }
}

/**
 * @description  : 设置多边形区域
 * @param         { Object } map 地图实例
 * @param         { Array } coordinates 坐标集合
 * @param         { Object } styleObject { strokeColor,strokeWidth,fillColor } 样式
 * @param         { String } gridName 区域名称
 * @param         { Boolean } flag 是否为绘制图斑
 */
export function setPolygon(map, coordinates, styleObject, gridName, flag) {
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
  if (!flag) {
    polygonStyle.setText(
      new CTMapOl.style.Text({
        text: gridName,
        fill: new CTMapOl.style.Fill({
          color: '#333'
        }),
        textAlign: 'center'
      })
    )
  }
  // 多坐标转换指定投影系
  let tempCoordinates = transCoordinates(coordinates)
  let polygon = new CTMapOl.geom.Polygon(tempCoordinates)
  let featureVV = new CTMapOl.Feature({
    geometry: polygon,
    type: 'polygon'
  })
  featureVV.setStyle(polygonStyle)
  let polygonSource = new VectorSource() // 创建数据源
  let polygonLayer = new VectorLayer({
    // 创建图层
    zIndex: 9999 // 图层的层级
  })
  polygonLayer.setSource(polygonSource) // 把数据源绑定到图层上面
  polygonSource.addFeature(featureVV)
  map.addLayer(polygonLayer) // 把图层添加到地图上面去
  return { polygon, featureVV, polygonLayer }
}

/**
 * 移除图层
 * @param map 地图实体
 * @param layerPoint 图层
 */
export function removeLayer(map, layerPoint) {
  if (layerPoint) {
    map.removeLayer(layerPoint) //移除图层
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
 * 多坐标转换指定投影系
 * @param coordinates 坐标集合
 * @param fromType 源投影坐标系
 * @param toType 目标投影坐标系
 */
export function transCoordinates(
  coordinates,
  fromType = 'EPSG:4326',
  toType = 'EPSG:3857'
) {
  if (!coordinates || coordinates.length == 0) {
    return []
  }
  let _transCoordinates = []
  coordinates.forEach((coordinate) => {
    _transCoordinates.push(transCoordinate(coordinate, fromType, toType))
  })
  return _transCoordinates
}

/**
 * @description  : 渲染WMSLayer
 * @param         { Object } map 地图实例
 * @param         { Object } params 参数{ url, layerName, geomKey } 地址、图层名称、？
 * @return        { Object }
 */
export function renderWMSLayer(map, params) {
  console.log(params)
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
 * 添加比例尺
 * @param map
 * @param className 样式名称
 * @param maxWidth 最大宽度
 * @returns {ScaleLine}
 */
export function addScaleLine(map, className, maxWidth) {
  let option = {
    className: className,
    units: 'metric'
  }
  if (maxWidth) {
    option.maxWidth = maxWidth
  }
  let scaleLine = new ScaleLine(option)
  map.addControl(scaleLine)
  return scaleLine
}

/**
 * 3D-通视分析
 * @param map
 * @param clickfunc 点击图标回调函数
 */
export function analysisVisible(
  map,
  clickfunc,
  centerPoint,
  targetPoint,
  centerPointWh = [40, 40],
  targetPointWh = [30, 30]
) {
  console.log('==================0900', map, centerPointWh, targetPointWh)
  let _analysisVisible = new CTMapOl.cesiumComponent.AnalysisVisible(
    map,
    clickfunc,
    centerPoint,
    targetPoint,
    centerPointWh,
    targetPointWh
  )
  _analysisVisible.active()
  return _analysisVisible
}

/**
 * 3D-摄像机可视域分析
 * @param map
 * @param form 搜索条件：lon 经度，lat 纬度，hb 海拔(m), gg 设置挂高(m),  spsj 水平视角(°),  czsj 垂直视角(°), fxj 方向角(°), fyj 俯仰角(°), syjl 视野距离(Km)
 */

export function cameraLocationAnalysis(map, dev, color = '#3CFFE9') {
  let opt = {
    lng: dev.longitude,
    lat: dev.latitude,
    horizontalView: dev.angle,
    distance: dev.distance ? dev._distance / 1000 : 3,
    direction: dev.heading,
    outColor: color,
    outOpacity: 0.3,
    innerColor: color,
    innerOpacity: 0.8,
    innerlineColor: color,
    innerlineOpacity: 0.3,
    // outlineColor: "green",
    outlineWidth: 0,
    outlineOpacity: 0.001,
    id: dev.id,
    zoomto: false
    // className: "SViewShed2D",
    // timestamp:"1680073428852_2502033064",
    // method: "instantiation",
    // index: 225
  }
  return new CTMapOl.cesiumComponent.ViewShed2D(map, opt)
}

export function cameraLocationAnalysisNew(map, dev, color = '#4F9FFF') {
  let opt = {
    lng: dev.longitude,
    lat: dev.latitude,
    horizontalView: dev.angle,
    distance: dev.distance ? dev.distance / 1000 : 3,
    direction: dev.heading,
    outColor: color,
    outOpacity: 0.3,
    innerColor: color,
    innerOpacity: 0.8,
    innerlineColor: color,
    innerlineOpacity: 0.3,
    // outlineColor: "green",
    outlineWidth: 0,
    outlineOpacity: 0.001,
    id: dev.id,
    zoomto: false
    // className: "SViewShed2D",
    // timestamp:"1680073428852_2502033064",
    // method: "instantiation",
    // index: 225
  }
  // console.log(opt)
  return new CTMapOl.cesiumComponent.ViewShed2D(map, opt)
}

/**
 * 3D-摄像机选址可视域分析
 * @param map
 * @param form 搜索条件：lon 经度，lat 纬度，hb 海拔(m), gg 设置挂高(m),  spsj 水平视角(°),  czsj 垂直视角(°), fxj 方向角(°), fyj 俯仰角(°), syjl 视野距离(Km)
 */
export function cameraLocationAnalysis2(map, form) {
  let opt = {
    viewer: map,
    viewPosition: Cesium.Cartesian3.fromDegrees(
      form.lon,
      form.lat,
      form.hb + form.gg
    ),
    direction: form.fxj % 360,
    pitch: form.fyj,
    horizontalViewAngle: form.spsj || 90,
    verticalViewAngle: form.czsj || 90,
    visualRange: form.syjl * 1000 || 100
  }
  return new CTMapOl.cesiumComponent.ViewShed3D2(opt)
}

/**
 * 3D-坡度坡向分析
 * @param map
 */
export function slopAnalysis(map, params, finishFn) {
  let _slopAnalysis = new CTMapOl.cesiumComponent.SlopAnalysis(
    map,
    params.minVisibleValue,
    params.maxVisibleValue,
    params.opacity,
    SlopeMode[params.displayModel],
    (e) => {
      finishFn(e)
    }
  )
  _slopAnalysis.active()
  return _slopAnalysis
}

/**
 * 3D-地形可视域分析
 * @param map
 */
export function activeViewShed(map) {
  let viewShed = new CTMapOl.cesiumComponent.ViewShedAnalysis(map)
  return viewShed
}

// 渲染多边形时默认使用的样式对象
const DEFAULTCESIUMSTYLE = {
  Point: {
    strokeColor: 'red',
    strokeWeight: 2,
    strokeOpacity: 0.5,
    fillOpacity: 1,
    fillColor: 'green'
  },
  Polyline: {
    strokeColor: 'blue',
    strokeOpacity: 0.8,
    strokeWeight: 1
  },
  Polygon: {
    fillColor: 'rgba(0, 0, 255, 0.1)',
    fillOpacity: 0.5,
    strokeColor: 'blue',
    strokeOpacity: 1,
    strokeWeight: 11
  },
  CirCle: {
    strokeColor: 'red',
    strokeWeight: 2,
    strokeOpacity: 0.5,
    fillOpacity: 1,
    fillColor: 'green'
  }
}
function defaultStyleObject(type, styleObject = {}) {
  const obj = DEFAULTCESIUMSTYLE[type]
  if (obj) {
    Object.keys(obj).forEach((k) => {
      // 进行手动合并。styleObject内可能有同key但为null的字段，直接合并就会丢默认值
      if (!styleObject?.[k]) {
        styleObject[k] = obj[k]
      }
    })
  }
  return styleObject
}
/**
 * @description  : 渲染3D点、线、多边形、圆
 * @param         { Object } map 地图实例
 * @param         { Object } type 渲染类型
 * @param         { Array } coordinates 坐标
 * @param         { String } radius 半径，画点和圆必传，
 * @param         { Object } styleObject { strokeColor,strokeWeight,strokeOpacity,fillColor,fillOpacity } 样式
 * @param         { boolean } flag 是否渲染视野范围之内
 */
export function renderCesiumPolygon(
  map,
  type = 'Point',
  coordinates,
  radius = '500', // 半径
  styleObject,
  flag
) {
  if (coordinates.length === 0) {
    return false
  }
  let options
  let polygon
  switch (type) {
    case 'Point': {
      options = {
        center: coordinates[0],
        radius: Number(radius),
        ...defaultStyleObject(type, styleObject),
        zIndex: 50,
        bubble: true,
        zoomto: flag // 是否自动缩放到
      }
      polygon = new CTMapOl.cesiumComponent.Circle(options)
      polygon.addTo({ viewer: map })
      break
    }
    case 'Polyline': {
      options = {
        path: coordinates, // 这里可以是经纬度和高度， 比如[116.43, 55.92, 100]
        zoomto: flag,
        ...defaultStyleObject(type, styleObject)
      }
      polygon = new CTMapOl.cesiumComponent.Polyline(options)
      polygon.addTo({ viewer: map })
      break
    }
    case 'Polygon': {
      options = {
        path: [coordinates],
        zoomto: flag,
        ...defaultStyleObject(type, styleObject)
      }
      polygon = new CTMapOl.cesiumComponent.Polygon(options)
      polygon.addTo({ viewer: map })
      break
    }
    case 'Circle': {
      options = {
        center: coordinates[0],
        radius: Number(radius),
        ...defaultStyleObject(type, styleObject),
        zIndex: 50,
        bubble: true,
        zoomto: flag // 是否自动缩放到
      }
      polygon = new CTMapOl.cesiumComponent.Circle(options)
      polygon.addTo({ viewer: map })
      break
    }
  }
  return polygon
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
export function showCesiumText(
  map,
  path,
  text,
  fillColor,
  font,
  height,
  param = {}
) {
  let options = {
    lng: path[0], // text经度 必传字段
    lat: path[1], // text纬度 必传字段
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
 * @description  : 三维-轨迹回放
 * @param         { Object } map 地图实例
 * @param         { Array } path 经纬度集合
 * @param         { Object } styleObject { strokeColor,strokeWeight,strokeOpacity,fillColor,fillOpacity } 样式
 * @param         { String } carStyleObject 飞行器样式
 * @param         { Object } successFn 回调函数
 */
export function cesiumUVA(map, path, styleObject, carStyleObject, successFn) {
  if (!map) {
    return null
  }
  let polyline = new CTMapOl.cesiumComponent.Polyline({
    path: path,
    zoomto: true,
    strokeColor: styleObject.strokeColor ? styleObject.strokeColor : 'blue',
    strokeOpacity: styleObject.strokeOpacity ? styleObject.strokeOpacity : 0.8,
    strokeWeight: styleObject.strokeWeight ? styleObject.strokeWeight : 6
  })
  polyline.addTo({ viewer: map })

  let car = new CTMapOl.cesiumComponent.UVA(map, {
    btnBox: 150, // 左边按钮的盒子宽度
    bgColor: carStyleObject.bgColor
      ? carStyleObject.bgColor
      : 'rgba(0,0,0,0.3)', // 控件的背景色
    width: carStyleObject.width ? carStyleObject.width : 18, // 飞行器的宽度
    height: carStyleObject.height ? carStyleObject.height : 27, // 飞行器的高度
    anchor: carStyleObject.anchor ? carStyleObject.anchor : [9, 20], // 原点偏移
    icon: carStyleObject.icon
      ? carStyleObject.icon
      : require('@component-gallery/assets/mapImage/UAV_movingIcon.png'),
    path: path, // 路径坐标;二维数组
    duration: carStyleObject.duration ? carStyleObject.duration : 10000, // 播放时间
    onPlay: (info) => {
      successFn(info)
    }
  })
  car.addTo({ viewer: map })
  return { car, polyline }
}

/**
 * @description  : 三维-轨迹回放--播放
 * @param         { Object } car 飞行控件
 */
export function doPlayCesiumUVA(car) {
  if (!car) {
    return
  }
  car.play()
}

/**
 * @description  : 三维-轨迹回放--暂停
 * @param         { Object } car 飞行控件
 */
export function pauseCesiumUVA(car) {
  if (!car) {
    return
  }
  car.pause()
}

/**
 * @description  : 三维-轨迹回放--前进
 * @param         { Object } car 飞行控件
 */
export function nextCesiumUVA(car) {
  if (!car) {
    return
  }
  car.fastFront()
}

/**
 * @description  : 三维-轨迹回放--后退
 * @param         { Object } car 飞行控件
 */
export function prevCesiumUVA(car) {
  if (!car) {
    return
  }
  car.fastBack()
}

/**
 * @description  : 三维-轨迹回放--显示
 * @param         { Object } car 飞行控件
 */
export function showCesiumUVA(car) {
  if (!car) {
    return
  }
  car.show()
}

/**
 * @description  : 三维-轨迹回放--隐藏
 * @param         { Object } car 飞行控件
 */
export function hideCesiumUVA(car) {
  if (!car) {
    return
  }
  car.hide()
}

/**
 * @description  : 三维-轨迹回放--删除
 * @param         { Object } car 飞行控件
 */
export function removeCesiumUVA(car) {
  if (!car) {
    return
  }
  car.remove()
}

/**
 * @description  : 三维-轨迹回放--添加新路径
 * @param         { Object } map 地图实例
 * @param         { Object } car 飞行控件
 * @param         { Object } styleObject { strokeColor,strokeWeight,strokeOpacity,fillColor,fillOpacity } 样式
 * @param         { String } carStyleObject 飞行器样式
 */
export function addPathCesiumUVA(map, car, path, styleObject, carStyleObject) {
  if (!car) {
    return
  }
  let polyline = new CTMapOl.cesiumComponent.Polyline({
    path: path,
    zoomto: true,
    strokeColor: styleObject.strokeColor ? styleObject.strokeColor : 'red',
    strokeOpacity: styleObject.strokeOpacity ? styleObject.strokeOpacity : 0.8,
    strokeWeight: styleObject.strokeWeight ? styleObject.strokeWeight : 1
  })
  polyline.addTo({ viewer: map })

  car.addPath({
    path: path.slice(1),
    distance: carStyleObject.distance ? carStyleObject.distance : 0.02,
    duration: carStyleObject.duration ? carStyleObject.duration : 1000 // 飞行时间
  })
  return { car, polyline }
}

/**
 * @description  : 三维-轨迹回放--拖到进度条
 * @param         { Object } car 飞行控件
 * @param         { Number } value 进度值
 */
export function moveToCesiumUVA(car, value) {
  if (!car) {
    return
  }
  car.moveTo(value)
}

/**
 * 三维-点聚合
 * @param map 地图实体
 * @param deviceParam { list, clickFn, clusterImgItem}list 摄像机站址数据
 * @param successFn 成功回调
 * @returns {*}
 */
export function showCesiumMarkCluster(map, deviceParam, successFn) {
  let clusterImgItem = deviceParam.clusterImgItem
  let dList = []
  for (const deviceItem of deviceParam.list) {
    dList.push({
      lnglat: [
        parseFloat(deviceItem.longitude),
        parseFloat(deviceItem.latitude),
        deviceItem.longitude + deviceItem.latitude
      ],
      icon: deviceItem.icon,
      clickIcon: deviceItem.clickIcon,
      iconSize: deviceItem.iconSize,
      offset: deviceItem.offset,
      id: deviceItem.id,
      distance: deviceItem.distance,
      heading: deviceItem.heading,
      weight: deviceItem.weight ? deviceItem.weight : 8,
      angle: deviceItem.angle,
      clickBig: false
    })
  }
  let option = {
    dataOptions: dList,
    MarkerClusterOptions: {
      clusterId: '1111',
      gridSize: 100, // 聚合网格像素大小
      styles: [
        {
          url: clusterImgItem.clusterImg,
          size: [50, 50],
          offset: [25, 25],
          textColor: 'red',
          textOffset: [0, 10]
        }
      ],
      maxZoom: 12,
      sourceType: 'sourceType123' // 感觉这个属性没必要，clusterId这个属性表示的就是当前聚合
    }
  }
  let cluster = new CTMapOl.cesiumComponent.MarkerCluster(map, option)
  successFn(cluster)
  return cluster
}

/**
 * 三维-获取当前可视范围内该聚合实例中非聚合点数据
 * @param cluster 地图点聚合实例
 * @param successFn 成功回调
 * @returns {*}
 */
export function getViewMarkers(cluster, successFn) {
  if (!cluster) {
    return
  }
  let ms = cluster.getViewMarkers()
  successFn(ms)
}

/**
 * 三维-通过id定位
 * @param cluster 地图点聚合实例
 * @param successFn 成功回调
 * @returns {*}
 */
export function locationById(cluster, id, successFn) {
  if (!cluster) {
    return
  }
  cluster.locationById({ id })
  successFn()
}

/**
 * 三维-海量点
 * @param map 地图实体
 * @param deviceParam { list, clickFn, clusterImgItem}list 摄像机站址数据
 * @param successFn 成功回调
 * @returns {*}
 */
export function showCesiumPoints(map, deviceParam, successFn) {
  let dList = []
  let clickOption = []
  for (const deviceItem of deviceParam.list) {
    dList.push([
      deviceItem.longitude + ',' + deviceItem.latitude,
      deviceItem.id,
      deviceItem.icon,
      deviceItem.offset[0] + ',' + deviceItem.offset[1]
    ])
    clickOption.push({
      big: deviceItem.big ? deviceItem.big : false,
      icon: deviceItem.clickIcon
    })
  }
  let options = {
    viewer: map,
    layerId: 'DataSourceLayer',
    points: dList,
    width: deviceParam.width ? deviceParam.width : 50,
    height: deviceParam.height ? deviceParam.height : 50,
    clickOption: clickOption,
    zoom: deviceParam.zoom ? deviceParam.zoom : 13,
    clickBig: false
  }
  let points = new CTMapOl.cesiumComponent.Points(options)
  points.addTo({ viewer: map })
  // 暂时以第一个点来视野中心
  CTMapOl.thrdime.cameracontrol.setcamera(
    map,
    CTMapOl.thrdime.cameracontrol.getcameraoptionswithdetile(
      deviceParam.list[0].longitude,
      deviceParam.list[0].latitude,
      1000,
      0,
      -90,
      0
    )
  )
  successFn(points)
  return points
}

/**
 * 三维-根据id高亮点
 * @param cluster 地图海量点实例
 * @param id id
 * @param successFn 成功回调
 * @returns {*}
 */
export function lightHeightPointById(points, id, successFn) {
  if (!points) {
    return
  }
  points.lightHeightPointById({ id })
  successFn()
}

/**
 * 三维-海量点还原
 * @param points 地图海量点实例
 * @param successFn 成功回调
 * @returns {*}
 */
export function repeatSize(points, successFn) {
  if (!points) {
    return
  }
  points.repeatSize()
  successFn()
}

/**
 * 三维-海量点删除
 * @param points 地图海量点实例
 * @param successFn 成功回调
 * @returns {*}
 */
export function removeCesiumPoints(points, successFn) {
  if (!points) {
    return
  }
  points.remove()
  successFn()
}

/**
 * 三维-海量点还原状态
 * @param points 地图海量点实例
 * @param successFn 成功回调
 * @returns {*}
 */
export function restoreCesiumPoints(points, successFn) {
  if (!points) {
    return
  }
  points.restore()
  successFn()
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
  // return highlight
}

export function removeHighLightArea(map, highlight) {
  try {
    map.getLayers().getArray()[1]?.removeFilter(highlight)
  } catch (e) {
    console.log(e)
  }
}

// 计算可供放置目标区域。返回值为'left' 'right' null中的一个。null表示左右都不够放置。
function _calculatePosition(nowX, nowWidth, maxWidth, targetOffset) {
  const _offsetX = targetOffset
  if (nowWidth - _offsetX < nowX) {
    // 左边能放下，放左边
    return 'right'
  } else if (nowWidth - _offsetX + nowX < maxWidth) {
    // 右边能放下，放右边
    return 'left'
  } else {
    return null
  }
}
/**
 * 周边分析弹窗方法（根据坐标计算弹窗位置）
 * @param map 地图实体
 * @param lng 精度
 * @param lat 纬度
 * @param content html内容
 * @param popClass class name
 * @param offsetX 偏移量x
 * @param offsetY 偏移量y
 * @param wAndh html内容 [宽，高]
 * @returns {CTMapOl.Overlay}
 */
export function peripheryOpenInfoWindow(
  map,
  lng,
  lat,
  content,
  popClass,
  offsetX,
  offsetY,
  wAndh
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
  document.body.appendChild($info)

  // 单坐标转换指定投影系
  let coordinate = transCoordinate([lng, lat])

  // 有些弹窗，偏移值设置的0，正常情况没问题，特殊情况，会挨着点，设置默认值为30
  let _offsetX = offsetX || -30
  let _offsetY = offsetY || -30
  let _offsetArr = [_offsetX, _offsetY]
  let _xy = map.getPixelFromCoordinate(coordinate)
  let _maxWH = map.getSize()
  let _str = []
  // 先确定上下
  if (wAndh[1] - _offsetY < _xy[1]) {
    // 上面能放下，放上面
    _str.push('bottom')
  } else if (wAndh[1] - _offsetY + _xy[1] < _maxWH[1]) {
    // 下面能放下，放下面
    _str.push('top')
    _offsetArr[1] = -_offsetY
  } else {
    // 都放不下，放中间
    _str.push('center')
    _offsetArr[1] = 0
  }

  // 判断左右位置
  // 如果上下是居中的，先从左边算起，并将偏移值设置为-30 （部分弹窗设置有特殊的偏移值）
  if (_str[0] == 'center') {
    // 左右都放不下，只能放中间
    const calresult = _calculatePosition(_xy[0], wAndh[0], _maxWH[0], -30)
    if (!calresult) {
      _str.push('center')
      _offsetArr[0] = offsetX
    } else {
      _str.push(calresult)
      _offsetArr[0] = -30
    }
  } else {
    // 如果上下不是中间，先从中间算起
    // 部分弹窗，有特殊要求，中间是不能设置为0，所以用offsetX计算
    if (
      wAndh[0] / 2 - offsetX < _xy[0] &&
      wAndh[0] / 2 - offsetX + _xy[0] < _maxWH[0]
    ) {
      _str.push('center')
      _offsetArr[0] = offsetX
    } else {
      // 如果中间放不下，将偏移值设置为-30 （部分弹窗设置有特殊的偏移值）
      _calculatePosition(_xy[0], wAndh[0], _maxWH[0], -30)
    }
  }
  infoWindow = new CTMapOl.Overlay({
    id: infoWindowId,
    element: $info,
    position: coordinate,
    positioning: _str.join('-'), //相对于其位置属性的实际位置
    stopEvent: true, //事件冒泡
    offset: _offsetArr,
    autoPan: {
      animation: {
        duration: 250
      }
    },
    zIndex: 100
  })
  map.addOverlay(infoWindow)

  return infoWindow
}
