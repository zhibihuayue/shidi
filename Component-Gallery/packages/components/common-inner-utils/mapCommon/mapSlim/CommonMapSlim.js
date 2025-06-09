// /Users/xiao/junnan/tieta/application-forestry/forestry-pc/src/views/bigScreen/sharedcomponents/CommonMapSlim.js
// 这是一个简化版的CommonMap，适配地图组件2.0。
// 这个工具库的方法遵循一个原则：传入ctMap地图实例工作，对象形式入参，方法尽可能解耦独立、关注度分离

/**
 * 坐标系：
    统一传入传出坐标系为84坐标系；EPSG:4326；
    OpenLayers 默认坐标系为墨卡托坐标系，EPSG :3857；
    显示使用EPSG:3857，存储的坐标即数据库存储和前后端交互的坐标系为EPSG:4326；
 */

import CTMapOl from '@ct/ct_map_ol'
import MapConstant from './MapConstant'
let layerIdInd = 0
const { Style, Text, Circle, Fill, Stroke, Icon } = CTMapOl.style
export default class CommonMapSlim {
  // 综合poi标记方法
  // 这个方法实际上只是简化了传递 + 明确了入参类型和字段

  // 出参的marker实例由该方法保证一定有destroy方法供销毁
  static showPoiMarker(options) {
    const {
      mapInstance, // 地图实例。注意，送入的地图实例应当是真正的地图实例，3d地图就应该是3d实例而不是viewer
      points, // 点数据，对象数组，元素格式至少为{ longitude, latitude }，可以有多余字段
      markerStyle, // 封装的标记定义的key，参考MapConstant.MARKER_STYLE里的定义
      cluster = false, // 是否启用点聚合，默认不启用（false/undefined）
      multiSelect = false,
      zIndex = 16,
      onHover, // (feature) => void
      onClick, // (data) => void 点击事件，注意这不是以2d或3d的点击事件来的，是自己再进行一层处理的，参数为对应点的数据
      onClickCluster, // onClickCluster: (feature) => void
      onDeSelect // onDeSelect: (data, feature) => void 仅在单选模式，点击地图空白区域时触发，feature 为被取消选中的标记
    } = options
    if (!markerStyle) {
      console.warn('没有传标记类型无法进行打点')
      return
    }

    if (mapInstance.ol_uid) {
      // 新的2d/3d判断方式：因为2D地图使用openlayer所以一定有ol_uid，3d地图没有
      // 2D地图打点方法
      const markerStyle2d = MapConstant.MARKER_STYLE[markerStyle].markerStyle
      const markers = new CTMapOl.extend.Markers(mapInstance, points, {
        layerOptions: {
          zIndex
        },
        cluster,
        multiSelect,
        stopClick: true,
        clickToTop: true,
        getCoordsFunc: (item) =>
          CTMapOl.proj.fromLonLat([item.longitude, item.latitude]),
        markerStyle: (feature) => {
          const selected = feature.get('selected')
          // 尽量在函数外预先生成固定不变部分，可提高性能
          return selected
            ? markerStyle2d.selected || markerStyle2d.normal
            : markerStyle2d.normal
        },
        // 点聚合样式，暂未实现
        // clusterStyleFunc: count => {
        //   return new Style({
        //     image: new Circle({
        //       radius: 10,
        //       fill: new Fill({
        //         color: 'blue'
        //       })
        //     }),
        //     text: new Text({
        //       text: count,
        //       fill: new Fill({
        //         color: '#fff'
        //       })
        //     })
        //   })
        // },
        onHover,
        // onClick 多选模式下 feature 参数为 undefined，data 为
        // {
        //   type, // select（选中）, deSelect（取消选中）
        //   feature,  // 点击的标记
        //   selectedFeatures // 点击后全部已选中标记
        // }
        onClick,
        onClickCluster,
        onDeSelect
      })

      return markers
    } else {
      this.check3DMapInstance(mapInstance)
      // 3D打点实现
      const viewer = mapInstance._viewer
      const markerStyle3d = MapConstant.MARKER_STYLE[markerStyle].markerStyle3d
      layerIdInd += 1
      const layerId = `SlimLayer${layerIdInd}`
      const { size, anchor = [0.5, 0.5], src, scale = 1 } = markerStyle3d.normal

      const pointsData3d = points.map((p, ind) => {
        // 默认的points的输出格式为，每个点是一个数组，内容元素分别为 经纬度字符串， Id， 图片地址， 图片偏移，均为逗号分隔字符串
        const offsetFor3d = [
          Math.round(size[0] * scale * anchor[0]),
          Math.round(size[1] * scale * anchor[1])
        ]
        return [
          `${p.longitude},${p.latitude}`,
          `${layerId}-${ind}`,
          src,
          offsetFor3d.join(',')
        ]
      })
      const pointsParam = {
        viewer,
        layerId,
        points: pointsData3d,
        width: size[0] * scale,
        height: size[1] * scale,
        zoom: 2,
        zIndex,
        clickIcon: markerStyle3d.selected?.src,
        clickBig: false
      }
      const markers = new CTMapOl.cesiumComponent.Points(pointsParam)
      markers.addTo({ viewer: viewer })
      markers.destroy = () => {
        // 3dmarker没有一个叫destroy的方法，按别名补上
        // remove方法在地图切换时会失效，所以用try来保证执行不会失败
        try {
          markers.remove()
        } catch (e) {
          // 这里的报错不处理
          console.error(e)
        }
      }

      // 3dMarker需要自己打标点
      markers.on('click', (p) => {
        const { id, layerType, latitude, longitude } = p
        const target = pointsData3d.findIndex((o) => o[1] === id)
        if (target !== -1) {
          onClick && onClick(points[target], p)
        }
      })
      return markers
    }
  }

  // 对对应点位展示可视域
  // 出参的对象实例由该方法保证一定有destroy方法供销毁
  static showViewShed(options) {
    const {
      mapInstance, // 地图实例
      longitude,
      latitude,
      color = '#3CFFE9',
      distance = 1, // 半径，单位 米
      heading, // 单位为度，朝向，顺时针旋转
      id,
      angle // 单位为度，可视域角度范围
    } = options

    if (mapInstance.ol_uid) {
      // 新的2d/3d判断方式：因为2D地图使用openlayer所以一定有ol_uid，3d地图没有
      // 2D

      // LayeredClusterViewShed方法使用的是3857坐标系，需要经过一次转换
      const coordinates = CTMapOl.extend.formatLayer.transCoordinate(
        [longitude, latitude],
        'EPSG:4326',
        'EPSG:3857'
      )
      const layers = [
        {
          zIndex: 18,
          maxZoom: 18,
          minZoom: 10,
          data: [
            {
              id,
              longitude: coordinates[0],
              latitude: coordinates[1],
              distance,
              heading,
              angle,
              isWarning: true
            }
          ]
        }
      ]
      const LayeredClusterViewShed = new CTMapOl.extend.LayeredClusterViewShed(
        mapInstance,
        layers,
        {
          minViewShed: 8,
          cameraStyleFunc: (data) => MapConstant.TRANSPARENTSTYLE,
          cameraActiveStyleFunc: (data) => MapConstant.TRANSPARENTSTYLE,
          clusterMaxZoom: 5,
          viewDistanceColor: 'rgba(60, 255, 233, .3)',
          viewAngleColor: 'rgba(60, 255, 233, .7)',
          viewDistanceWarningColor: 'rgba(249, 255, 108, .3)',
          viewAngleWarningColor: 'rgba(249, 255, 108, .7)',
          stopClick: false
        }
      )
      setTimeout(() => {
        LayeredClusterViewShed._refreshViewShed()
      }, 500)

      return LayeredClusterViewShed
    } else {
      this.check3DMapInstance(mapInstance)
      // 3D的处理方式是直接拉起一个viewShed2D
      const viewer = mapInstance._viewer
      const comp = new CTMapOl.cesiumComponent.ViewShed2D(viewer, {
        lng: longitude,
        lat: latitude,
        distance: distance / 1000, // 3d的这个单位是公里，但showViewShed要求的入参单位是米，要进行转换
        direction: heading,
        horizontalView: angle,
        outColor: color,
        outOpacity: 0.3,
        innerColor: color,
        innerOpacity: 0.8,
        innerlineColor: color,
        innerlineOpacity: 0.3,
        id: 'MinamiP',
        zoomTo: false
      })

      comp.destroy = () => {
        // 3d可视域没有一个叫destroy的方法，按别名补上
        // remove方法在地图切换时会失效，所以用try来保证执行不会失败
        try {
          comp.remove()
        } catch (e) {
          // 这里的报错不处理
          console.error(e)
        }
      }

      return comp
    }
  }

  // 将地图缩放+移动到足以展示需求的所有点位
  static zoomToFitPoints(options) {
    const defaultXPadding = Math.round(window.innerWidth * 0.25)
    const defaultYPadding = Math.round(window.innerHeight * 0.15)
    const {
      mapInstance, // 地图实例
      points = [], // 点的经纬度位置信息数组，[{ longitude, latitude }]
      maxZoom = 12,
      padding = [
        defaultYPadding,
        defaultXPadding,
        defaultYPadding,
        defaultXPadding
      ] // 上下左右容差，这个参数必须是一个长度为4的数组，没有提供简写语法
    } = options

    if (!points || points.length === 0) {
      // 没有传入点位数据，不能缩放
      return
    }

    if (mapInstance.ol_uid) {
      // 新的2d/3d判断方式：因为2D地图使用openlayer所以一定有ol_uid，3d地图没有
      // 2D地图处理方法：使用OpenLayer的fit，将点位按经纬度计算成多边形，然后使用fit方法进行适配
      const polygonData = points.map((p) => [
        Number(p.longitude),
        Number(p.latitude)
      ])
      const geom = new CTMapOl.geom.Polygon([polygonData])
      geom.transform('EPSG:4326', 'EPSG:3857') // 2D转换
      mapInstance.getView().fit(geom, { padding, maxZoom })
    } else {
      this.check3DMapInstance(mapInstance)
      const viewer = mapInstance._viewer
      const cartesians = points.map((p) =>
        window.Cesium.Cartesian3.fromDegrees(
          Number(p.longitude),
          Number(p.latitude)
        )
      )

      // 使用Cesium提供的方法计算包围盒的中心点
      const boundingSphere = window.Cesium.BoundingSphere.fromPoints(cartesians)
      // 包围盒的中心是xyz笛卡尔坐标，要转换成经纬度格式
      const cartographic = window.Cesium.Cartographic.fromCartesian(
        boundingSphere.center
      )
      const centerLon = window.Cesium.Math.toDegrees(cartographic.longitude)
      const centerLat = window.Cesium.Math.toDegrees(cartographic.latitude)

      // 计算包围盒的半径，用于调整缩放级别
      const radius = boundingSphere.radius

      // 获取相机高度。这个高度不应该超过最大zoom高度
      const cameraHeight = Math.max(
        radius * 4,
        CTMapOl.thrdime.cameracontrol.zoomToHeight(maxZoom)
      )
      // 设置地图的中心点和缩放级别
      viewer.camera.flyTo({
        duration: 1.5,
        destination: window.Cesium.Cartesian3.fromDegrees(
          centerLon,
          centerLat,
          cameraHeight
        )
      })
    }
  }

  /**
   * 在地图上绘制线段方法。这个方法只绘制线段，不附带起止点等图标功能
   * 该方法返回的操作对象里一定有一个destroy方法供卸载
   * @param {*} options
   * @returns
   */
  static drawPolyline(options) {
    const {
      mapInstance, // 地图实例，请保证这个实例是真正的地图实例而不是viewer
      points, // 点数组，形式为经纬度数组的数组，如[[lng, lat], [lng2, lat2]]
      strokeColor = 'rgba(19, 115, 230, 1)', // 绘制线段的颜色
      strokeWidth = 6, // 绘制线段的宽度
      zoomToFit = true // 绘制完毕后是否缩放到看得见的位置
    } = options

    const defaultXPadding = Math.round(window.innerWidth * 0.15)

    if (mapInstance.ol_uid) {
      // 新的2d/3d判断方式：因为2D地图使用openlayer所以一定有ol_uid，3d地图没有
      // 2D地图
      // 先进行转换，经纬度坐标系要转换为笛卡尔坐标系
      const coordinates = points.map((arr) =>
        CTMapOl.extend.formatLayer.transCoordinate(
          arr,
          'EPSG:4326',
          'EPSG:3857'
        )
      )
      const routeFeature = new CTMapOl.Feature({
        type: 'route',
        geometry: new CTMapOl.geom.LineString(coordinates)
      })
      // 设置样式
      const styles = {
        route: new CTMapOl.style.Style({
          stroke: new CTMapOl.style.Stroke({
            width: strokeWidth, // 线的宽度
            color: strokeColor // 线的颜色
          })
        })
      }
      const source = new CTMapOl.source.Vector({
        features: [routeFeature]
      })
      // 把线添加到图层
      const vectorLayer = new CTMapOl.layer.Vector({
        source: source, // 线,起点的图标,终点的图标
        style: function (feature) {
          return styles[feature.get('type')]
        }
      })

      mapInstance.addLayer(vectorLayer)
      if (zoomToFit) {
        // 是否展示所有折线
        mapInstance.getView().fit(new CTMapOl.geom.LineString(coordinates), {
          padding: [100, defaultXPadding, 100, defaultXPadding],
          callback: mapInstance
            .getLayers()
            .getArray()[1]
            .dispatchEvent('postcompose')
        }) // 设置地图的缩放距离离屏幕的大小
      }

      return {
        feature: routeFeature,
        vectorLayer,
        destroy: () => mapInstance.removeLayer(vectorLayer)
      }
    } else {
      this.check3DMapInstance(mapInstance)
      // 3D打点实现
      const viewer = mapInstance._viewer
      const polyline = new CTMapOl.cesiumComponent.Polyline({
        // 折线
        viewer,
        path: points,
        strokeColor,
        strokeWeight: strokeWidth,
        strokeOpacity: 1,
        zoomto: zoomToFit
      })
      polyline.addTo({ viewer })
      polyline.destroy = polyline.destroy || polyline.remove
      return polyline
    }
  }

  static getCenter(mapInstance) {
    if (this.is3DMapInstance(mapInstance)) {
      const viewer = mapInstance._viewer
      const centerResult = viewer.camera.pickEllipsoid(
        new window.Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2
        )
      )
      if (!centerResult) {
        return null
      }
      const curPosition =
        window.Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
      if (curPosition) {
        const curLongitude = (curPosition.longitude * 180) / Math.PI
        const curLatitude = (curPosition.latitude * 180) / Math.PI
        return [curLongitude, curLatitude]
      }
    } else {
      return CTMapOl.extend.formatLayer.transCoordinate(
        mapInstance.getView().getCenter(),
        'EPSG:3857',
        'EPSG:4326'
      )
    }
  }

  // 以像素点为单位移动地图镜头
  static moveMapByPixels(options) {
    const {
      mapInstance,
      longitude, // 起点的经纬度。如果没有传的话，那默认就是相机的当前中心
      latitude,
      zoom, // 放大层级，如果不传的话，就不会做任何事
      x = 0, // 移动距离，单位为像素值
      y = 0 // 垂直方向的移动距离，单位为像素值，注意这里是左上为坐标原点计算的，也就是负值为向上移动
    } = options

    if (this.is3DMapInstance(mapInstance)) {
      // 3D版本
      const viewer = mapInstance._viewer
      const camera = viewer.camera
      // 获取当前相机的位置和朝向
      const cartographicPosition = window.Cesium.Cartographic.fromCartesian(
        camera.position
      )
      let startLongitude = window.Cesium.Math.toDegrees(
        cartographicPosition.longitude
      )
      let startLatitude = window.Cesium.Math.toDegrees(
        cartographicPosition.latitude
      )

      if (longitude && latitude) {
        startLongitude = Number(longitude)
        startLatitude = Number(latitude)
      }
      if (zoom) {
        CTMapOl.thrdime.cameracontrol.setZoom(viewer, zoom)
      }

      const cartographic = window.Cesium.Cartesian3.fromDegrees(
        startLongitude,
        startLatitude
      )
      const startPixelLocation =
        window.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          cartographic
        )

      // 计算新的画布坐标位置
      var newCameraPositionInCanvas = new window.Cesium.Cartesian2(
        startPixelLocation.x + x,
        startPixelLocation.y + y
      )

      // 获取相机视野中心的地面地理坐标
      // 不能使用相机坐标，因为相机是“悬浮在空中”的
      var ray = camera.getPickRay(
        new window.Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2
        )
      )
      var centerPosition = viewer.scene.globe.pick(ray, viewer.scene)
      const screenCoordinate1 =
        viewer.scene.cartesianToCanvasCoordinates(centerPosition)
      const screenCoordinate2 = newCameraPositionInCanvas

      const cameraHeight = viewer.camera.positionCartographic.height
      const fovy = viewer.camera.frustum.fovy
      const metersPerPixel =
        (2 * cameraHeight * Math.tan(fovy / 2)) /
        viewer.scene.canvas.clientHeight

      // 注意移动方向
      camera.moveRight(
        (screenCoordinate2.x - screenCoordinate1.x) * metersPerPixel
      )
      camera.moveDown(
        (screenCoordinate2.y - screenCoordinate1.y) * metersPerPixel
      )
    } else {
      const view = mapInstance.getView()
      if (zoom && view.getZoom() < zoom) {
        // 如果传递了缩放层级，并且当前层级小于传递的版本的话，设置
        view.setZoom(zoom)
      }
      if (longitude && latitude) {
        // 如果有传经纬度那就先设置新的中心
        view.setCenter(CTMapOl.proj.fromLonLat([longitude, latitude]))
      }
      const currentCenter = view.getCenter()
      const currentResolution = view.getResolution()

      // 计算新的中心点
      const newCenter = [
        currentCenter[0] + currentResolution * x,
        currentCenter[1] - currentResolution * y
      ]

      // 设置新的中心点
      view.setCenter(newCenter)
    }
  }

  // 检查当前传入的地图实例是不是准确的3d地图实例，容错判断用
  static check3DMapInstance(mapInstance) {
    if (mapInstance.ol_uid) {
      console.error('传入的不是3d地图实例，这是一个2d地图实例')
      return false
    }
    if (mapInstance.camera) {
      console.error('传入的不是3d地图实例，而是3d地图实例的viewer！')
      return false
    }
    return true
  }

  // 不输出报错的版本，用来业务代码调用方便
  static is3DMapInstance(mapInstance) {
    if (mapInstance.ol_uid) {
      // 新的2d/3d判断方式：因为2D地图使用openlayer所以一定有ol_uid，3d地图没有
      return false
    }
    if (mapInstance.camera) {
      // 如果有camera，这是viewer，不是3d地图实例
      return false
    }
    return true
  }
}
