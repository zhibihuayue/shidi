import CTMapOl from '@ct/ct_map_ol'

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

const defaultStyleObject = (type, styleObject = {}) => {
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
 * 用于3d网格区域
 * @param mapRef
 * @param type
 * @param coordinates
 * @param radius
 * @param styleObject
 * @param flag
 * @returns {*|boolean}
 */
const renderCesiumPolygon = (
  mapRef,
  type = 'Point',
  coordinates,
  radius = '500', // 半径
  styleObject,
  flag
) => {
  const { mapInstance } = mapRef

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
      polygon.addTo({ viewer: mapInstance })
      break
    }
    case 'Polyline': {
      options = {
        path: coordinates, // 这里可以是经纬度和高度， 比如[116.43, 55.92, 100]
        zoomto: flag,
        ...defaultStyleObject(type, styleObject)
      }
      polygon = new CTMapOl.cesiumComponent.Polyline(options)
      polygon.addTo({ viewer: mapInstance })
      break
    }
    case 'Polygon': {
      options = {
        path: [coordinates],
        zoomto: flag,
        ...defaultStyleObject(type, styleObject)
      }
      polygon = new CTMapOl.cesiumComponent.Polygon(options)
      polygon.addTo({ viewer: mapInstance })
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
      polygon.addTo({ viewer: mapInstance })
      break
    }
  }
  return polygon
}

export default renderCesiumPolygon
