import CTMapOl from '@ct/ct_map_ol'

const { Fill, Stroke, Style, Text, Circle: CircleStyle } = CTMapOl.style

const { GeoJSON } = CTMapOl.format
const { Vector: VectorLayer } = CTMapOl.layer
const { Vector: VectorSource } = CTMapOl.source

function transCoordinate(
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

function transCoordinates(
  coordinates,
  fromType = 'EPSG:4326',
  toType = 'EPSG:3857'
) {
  if (!coordinates || coordinates.length === 0) {
    return []
  }
  let _transCoordinates = []
  coordinates.forEach((coordinate) => {
    _transCoordinates.push(transCoordinate(coordinate, fromType, toType))
  })
  return _transCoordinates
}

/**
 * 用于2d网格区域
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
  styleObject,
  flag,
  zIndex = 0,
  color = '#000'
) => {
  const { mapInstance } = mapRef
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
  mapInstance.addLayer(vectorLayer)

  if (flag) {
    setTimeout(() => {
      mapInstance.getView().fit(new CTMapOl.geom.Polygon(tempCoordinates), {
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

export default renderCesiumPolygon
