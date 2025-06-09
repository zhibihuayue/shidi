import CTMapOl from '@ct/ct_map_ol'

/**
 * 3D-坡度坡向分析
 * @param map
 */
export function slopAnalysis(map, params) {
  return new Promise((resolve, reject) => {
    const _slopAnalysis = new CTMapOl.cesiumComponent.SlopAnalysis(
      map,
      +params.minVisibleValue,
      +params.maxVisibleValue,
      params.opacity,
      params.displayModel
    )
    _slopAnalysis.active()
    resolve(_slopAnalysis)
  })
}

/**
 * 3D-地形可视域分析
 * @param map
 */
export function activeViewShed(map) {
  return new Promise((resolve, reject) => {
    resolve(new CTMapOl.cesiumComponent.ViewShedAnalysis(map))
  })
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
  return new Promise((resolve, reject) => {
    const _analysisVisible = new CTMapOl.cesiumComponent.AnalysisVisible(
      map,
      clickfunc,
      centerPoint,
      targetPoint,
      centerPointWh,
      targetPointWh
    )
    _analysisVisible.active()
    resolve(_analysisVisible)
  })
}

/**
 * 3D-可视域分析（摄像机选址）
 * @param map
 * @param params 参数
 */
export function viewShed3D2(map, params) {
  return new Promise((resolve, reject) => {
    const _cameraSiteSelection = new CTMapOl.cesiumComponent.ViewShed3D2({
      viewer: map,
      viewPosition: CTMapOl.Cesium.common.Cartesian3.fromDegrees(
        params.longitude,
        params.latitude,
        +params.height + +params.groundHeight
      ),
      direction: params.direction % 360,
      pitch: +params.pitch,
      horizontalViewAngle: +params.horizontalAngle,
      verticalViewAngle: +params.verticalAngle,
      visualRange: params.visionDistance * 1000
    })
    resolve(_cameraSiteSelection)
  })
}

/**
 * 3D-标绘
 * @param map
 */
export function initDrawData(map, path) {
  return new Promise((resolve, reject) => {
    const mouseTool = new CTMapOl.cesiumComponent.MouseTool(map)
    resolve({
      // 获取资源树形结构数据，用户根据数据自行渲染样式
      data: mouseTool.getSymbolData({ path: path }),
      mouseTool
    })
  })
}

/**
 * 2D-单坐标转换指定投影系
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
 * 3D/2D通用-坐标拾取
 * @param mapRef
 * @param clickFn 点击图标回调函数
 */
export function startpickcood(mapRef, clickFn) {
  return new Promise((resolve, reject) => {
    // 返回值就是关闭方法
    const cancelFn = CTMapOl.InteractionControl.common.getCoordByClick(
      { mapRef },
      {
        onmouseclick(map, type, info) {
          clickFn && clickFn(info)
        }
      }
    )
    resolve(cancelFn)
  })
}
/**
 * 3D/2D通用-添加单标记
 * @param mapRef
 * @param params 参数
 */
export function addMarker(mapRef, params) {
  return new Promise((resolve, reject) => {
    const _style = params.style
    // 如果没有选中样式，就用普通样式
    const _selectlstyle = params.selectlstyle || params.style

    const width = _style?.width || 32
    const height = _style?.height || 32
    const x = width / 2
    const y = height / 2
    let offset = width !== height ? [x, height] : [x, y]
    const point = {
      id: params.id || 1,
      icon: _style.icon, // 正常图标
      clickIcon: _selectlstyle.icon, // 选中的图标
      iconSize: [width, height],
      offset: _style.offset || offset,
      lnglat: params.center
    }
    const marker = new CTMapOl.DataSourceControl.lib.MarkerCluster(
      {
        mapRef,
        data: [point]
      },
      {
        zIndex: params.zIndex || 10,
        maxZoom: 18
      }
    )
    marker.init()
    marker.mount()
    resolve(marker)
  })
}

/**
 * 3D/2D通用-移除单标记
 * @param mapRef
 * @param instance 打点实例
 */
export function removeMarker(mapRef, instance) {
  if (!instance || !mapRef) {
    return
  }
  if (
    Reflect.has(instance, 'destroy') &&
    typeof instance.destroy === 'function'
  ) {
    instance.destroy()
  }
}

/**
 * 3D/2D通用-设置中心点
 * @param mapRef
 * @param params 参数
 */
export function setZoomAndCenter(mapRef, params) {
  CTMapOl.ViewControl.common.setZoomAndCenter(
    { mapRef },
    {
      center: [params.longitude, params.latitude], // 中心点坐标
      zoom: params.zoom || 12, // 层级
      duration: params.duration || 1000
    }
  )
}

/**
 * 3D/2D通用-截图地图
 * @param mapRef
 * @param params 参数
 */
export function mapSavePng(mapRef, name, options = {}) {
  return new Promise((resolve, reject) => {
    const imageData = CTMapOl.SceneControl.common.screenShot(
      { mapRef },
      options
    )
    // 创建一个隐藏的链接元素
    const a = document.createElement('a')
    a.style.display = 'none'
    // 将 base64数据设置 href
    a.href = imageData
    // 下载png文件的名称
    a.download = `${name}.png` || 'map_screenshot.png'
    // 将链接元素添加到页面中
    document.body.appendChild(a)
    // 触发点击事件以开始下载
    a.click()
    // 移除链接元素
    document.body.removeChild(a)
    resolve(imageData)
  })
}
