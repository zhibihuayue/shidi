import CTMapOl from '@ct/ct_map_ol'

const drawPolyLine = (
  mapRef,
  points,
  strokeColor,
  strokeWidth,
  zoomToFit = true
) => {
  const { mapInstance, mapType } = mapRef
  const defaultXPadding = Math.round(window.innerWidth * 0.15)
  if (mapType === '2D') {
    // 先进行转换，经纬度坐标系要转换为笛卡尔坐标系
    const coordinates = points.map((arr) =>
      CTMapOl.extend.formatLayer.transCoordinate(arr, 'EPSG:4326', 'EPSG:3857')
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
    const viewer = mapInstance
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

export default drawPolyLine
