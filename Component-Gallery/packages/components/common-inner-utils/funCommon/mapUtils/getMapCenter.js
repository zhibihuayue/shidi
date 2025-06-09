import CTMapOl from '@ct/ct_map_ol'

/**
 * 获取地图中心点
 * @param mapRef
 * @returns {number[]|*|null}
 */
const getMapCenter = (mapRef) => {
  const { mapType, mapInstance } = mapRef

  if (mapType === '3D') {
    const centerResult = mapInstance.camera.pickEllipsoid(
      new Cesium.Cartesian2(
        mapInstance.canvas.clientWidth / 2,
        mapInstance.canvas.clientHeight / 2
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
    return CTMapOl.extend.formatLayer.transCoordinate(
      mapInstance.getView().getCenter(),
      'EPSG:3857',
      'EPSG:4326'
    )
  }
}

export default getMapCenter
