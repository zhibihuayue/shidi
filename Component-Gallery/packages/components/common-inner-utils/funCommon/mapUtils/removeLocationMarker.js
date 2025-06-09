/**
 * 删除位置打点
 * @param mapRef
 * @param pointEntity
 */
const removeLocationMarker = (mapRef, pointEntity) => {
  const { mapType, mapInstance } = mapRef
  if (pointEntity == null) {
    return
  }
  if (mapType === '3D') {
    if (pointEntity.remove && typeof pointEntity.remove == 'function') {
      pointEntity.remove()
    }
  } else {
    mapInstance.removeOverlay(pointEntity)
  }
}

export default removeLocationMarker
