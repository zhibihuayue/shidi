import { transCoordinate } from '../../mapCommon/map-ol/CommonCtMapOl'
import CTMapOl from '@ct/ct_map_ol'
import $ from 'jquery'

const generateUUID = () => {
  let d = new Date().getTime()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() // 使用性能测量值（如果可用）来增加随机性
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * 创建位置打点
 * @param mapRef
 * @param lng
 * @param lat
 * @param imgObj
 * @returns {Promise<"-moz-initial"|"inherit"|"initial"|"revert"|"revert-layer"|"unset"|"auto"|"none"|*>}
 */
const createLocationMarker = async (mapRef, lng, lat, imgObj) => {
  const { mapType, mapInstance } = mapRef
  if (mapType === '3D') {
    const width = imgObj.imgWidth
    const height = imgObj.imgHeight
    const offSet = imgObj.offSet ? imgObj.offSet : [24, 48]
    const marker = new CTMapOl.cesiumComponent.Point(mapInstance, {
      viewer: mapInstance,
      lng: Number(lng),
      lat: Number(lat),
      imgPath: imgObj.imgPath,
      id: generateUUID(),
      clickIcon: imgObj.clickIcon ? imgObj.clickIcon : imgObj.imgPath,
      iconSize: [width, height],
      zoom: imgObj.zoom ? imgObj.zoom : 13,
      offset: offSet
    })
    marker.addTo({ viewer: mapInstance.Viewer })

    return marker
  } else {
    // 创建图像
    const img = new Image()
    img.src = imgObj.imgPath
    // 计算偏移量
    let offset = imgObj.offset || imgObj.offSet // 根据需求设置偏移量
    if (!offset) {
      offset = [0, 0]
    }
    // 创建标记元素
    let markerElement = $('<div class="marker"></div>')
    markerElement.css({
      'position': 'absolute',
      'background': `url(${img.src})`,
      'background-size': '100% 100%',
      'transform': `translate(${offset[0]}px, ${offset[1]}px)`,
      'width': `${imgObj.imgWidth}px`,
      'height': `${imgObj.imgHeight}px`
    })
    // 单坐标转换指定投影系
    let coordinate = transCoordinate([lng, lat])
    // 创建标记对象
    let marker = new CTMapOl.Overlay({
      element: markerElement[0],
      position: coordinate, // 标记的位置
      stopEvent: false
    })
    // 将标记添加到地图上
    mapInstance.addOverlay(marker)
    return marker
  }
}
export default createLocationMarker
