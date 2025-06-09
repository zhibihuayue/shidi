import CTMapOl from '@ct/ct_map_ol'

/**
 * 创建地图信息窗体
 * @param mapRef
 * @param lng
 * @param lat
 * @param content
 * @param popClass
 * @param offsetX
 * @param offsetY
 * @param mapId
 * @returns {inforWindowInstance}
 */
const createInfoWindow = (
  mapRef,
  lng,
  lat,
  content,
  popClass,
  offsetX,
  offsetY,
  mapId
) => {
  const { mapInstance, mapType } = mapRef
  let infoWindow
  if (mapType === '3D') {
    infoWindow = new CTMapOl.cesiumComponent.InforWindow(
      mapInstance,
      {
        position: [parseFloat(lng), parseFloat(lat)],
        anchor: ['50%', '100%'],
        offset: [offsetX, offsetY],
        rotate: 0,
        content: content.innerHTML || content,
        selfStyle: true,
        popClass: 'alarmEventInfoWindow ' + popClass,
        isMultiple: false // 多个显示框
      },
      mapId
    )
  } else {
    let $info
    $info = document.createElement('div')
    $info.id = 'infoWindowId'
    $info.className = popClass
    $info.innerHTML = content
    $info.onmousewheel = function (e) {
      e.stopPropagation()
    }
    document.body.appendChild($info)

    // 单坐标转换指定投影系
    let coordinate = CTMapOl.extend.formatLayer.transCoordinate(
      [lng, lat],
      'EPSG:4326',
      'EPSG:3857'
    )
    /**
     * Create an overlay to anchor the popup to the map.
     */
    infoWindow = new CTMapOl.Overlay({
      id: 'infoWindowId',
      element: $info,
      position: coordinate,
      positioning: 'bottom-center', //相对于其位置属性的实际位置
      stopEvent: true, //事件冒泡
      offset: [offsetX, offsetY],
      autoPan: {
        animation: {
          duration: 250
        }
      },
      zIndex: 100
    })

    mapInstance.addOverlay(infoWindow)
  }
  return infoWindow
}

export default createInfoWindow
