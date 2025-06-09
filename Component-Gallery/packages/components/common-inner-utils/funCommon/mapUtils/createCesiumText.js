import CtMapOl from '@ct/ct_map_ol'

const createCesiumText = (
  mapRef,
  path,
  text,
  fillColor,
  font,
  height,
  param = {}
) => {
  const { mapInstance } = mapRef

  let options = {
    lng: path[0], // text经度 必传字段
    lat: path[1], // text纬度 必传字段
    height: height ? height : 100000, // text的高度 必传字段
    font: font ? font : '28px', // text的大小及字体
    fillColor: fillColor ? fillColor : '#ff0000', // text的颜色  必传字段
    text: text,
    ...param
  }
  let sText = new CtMapOl.cesiumComponent.Text(mapInstance, options)
  sText.addTo()
  return sText
}

export default createCesiumText
