import CTMapOl from '@ct/ct_map_ol'

/**
 * 设置 zoom 和 center
 *
 * @param mapRef
 * @param lng
 * @param lat
 * @param zoom
 * @returns {Promise<void>}
 */
const setZoomAndCenter = async (mapRef, lng, lat, zoom) => {
  const { mapType, mapInstance } = mapRef

  if (mapType === '3D') {
    await CTMapOl.thrdime.cameracontrol.setcamera(
      mapInstance,
      CTMapOl.thrdime.cameracontrol.getcameraoptionswithdetile(
        Number(lng),
        Number(lat),
        CTMapOl.thrdime.cameracontrol.zoomToHeight(zoom),
        0,
        -90,
        0
      )
    )
  } else {
    const view = mapInstance.getView()
    if (zoom >= view.getMinZoom() && zoom <= view.getMaxZoom()) {
      const newResolution = view.getResolutionForZoom(zoom)
      if (lng && lat) {
        if (view.getAnimating()) {
          view.cancelAnimations()
        }
        const param = {
          // 单坐标转换指定投影系
          center: CTMapOl.extend.formatLayer.transCoordinate(
            [lng, lat],
            'EPSG:4326',
            'EPSG:3857'
          ),
          resolution: newResolution,
          easing: CTMapOl.easing.easeOut,
          duration: 0
        }
        await view.animate(param)
      } else {
        await view.setResolution(newResolution)
      }
    }
  }
}

export default setZoomAndCenter
