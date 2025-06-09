import CTMapOl from '@ct/ct_map_ol'

/**
 * 根据 address code 获取设置高亮眼膜
 *
 * @param mapRef
 * @param addressCode
 * @param highlightStyle
 * @returns {Promise<highLightObj>}
 */
const setHighLightByAddressCode = async (
  mapRef,
  addressCode,
  highlightStyle = {}
) => {
  const longitudeAndLatitudeArray = []
  try {
    let highLightObj
    const resp = await CTMapOl.netApi.regionInfo({
      adCode: addressCode
    })
    const polygon = resp.data.polygon
    if (polygon) {
      polygon.split('|').map((a) => {
        const coordinates = a.split(';').map((sub) => {
          const [longitude, latitude] = sub.split(',')
          if (mapRef.mapType === '3D') {
            return [parseFloat(longitude), parseFloat(latitude)]
          } else {
            return CTMapOl.extend.formatLayer.transCooordinateToOpenlayer([
              parseFloat(longitude),
              parseFloat(latitude)
            ])
          }
        })
        longitudeAndLatitudeArray.push([coordinates])
      })
    }
    if (longitudeAndLatitudeArray.length) {
      const options = {
        color: highlightStyle?.color || '#000',
        opacity: highlightStyle?.opacity || 0.5,
        positions: longitudeAndLatitudeArray,
        outline: {
          color: highlightStyle?.outLineColor || '#000',
          weight: 0
        },
        setFitView: true
      }
      if (mapRef.mapType === '3D') {
        highLightObj = await new CTMapOl.cesiumComponent.Highlight(
          mapRef.mapInstance,
          options
        )
      } else {
        const geojson = {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: longitudeAndLatitudeArray
          }
        }
        const tileLayer = mapRef.mapInstance.getLayers().getArray()[1]
        highLightObj = new CTMapOl.olext.filter.Mask.default({
          feature: new CTMapOl.format.GeoJSON().readFeatures(geojson)[0],
          fill: new CTMapOl.style.Fill({
            color: 'rgba(0, 0, 0, 0.5)'
          })
        })
        tileLayer.addFilter(highLightObj)
        const geom = new CTMapOl.format.GeoJSON().readGeometry(geojson.geometry)
        mapRef.mapInstance.getView().fit(geom)
      }
    }

    return highLightObj
  } catch (e) {
    console.log(e)
    throw e
  }
}

export default setHighLightByAddressCode
