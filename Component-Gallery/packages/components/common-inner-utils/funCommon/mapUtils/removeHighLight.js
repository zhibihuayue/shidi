/**
 * 地图眼膜高亮移除
 *
 * @param mapRef
 * @returns {Promise<void>}
 */
export const removeHighLight = async (mapRef) => {
  const { mapType, mapInstance, layer } = mapRef

  const highLightObj = layer?.searchMapLayer?.highLightObj

  if (highLightObj) {
    if (mapType === '3D') {
      await highLightObj.remove()
    } else {
      await mapInstance.getLayers().getArray()[1]?.removeFilter(highLightObj)
    }
  }
}

export default removeHighLight
