import CTMapOl from '@ct/ct_map_ol'

/**
 * 移除地图信息窗体
 * @param mapRef
 * @param targetKey
 */
const removeInfoWindow = (mapRef, targetKey) => {
  const { infoBox, mapInstance, mapType } = mapRef

  if (infoBox?.length) {
    infoBox.forEach((infoWindow) => {
      if (mapType === '3D') {
        infoWindow[targetKey].remove()
        infoWindow[targetKey].destroy()
      } else {
        mapInstance.removeOverlay(targetKey)
      }
    })
  }
}

export default removeInfoWindow
