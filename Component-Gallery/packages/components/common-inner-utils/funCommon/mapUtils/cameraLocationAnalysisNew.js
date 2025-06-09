import CTMapOL from '@ct/ct_map_ol'
export const cameraLocationAnalysisNew = (map, dev, color = '#4F9FFF') => {
  let opt = {
    lng: dev.longitude,
    lat: dev.latitude,
    horizontalView: dev.angle,
    distance: dev.distance ? dev.distance / 1000 : 3,
    direction: dev.heading,
    outColor: color,
    outOpacity: 0.3,
    innerColor: color,
    innerOpacity: 0.8,
    innerlineColor: color,
    innerlineOpacity: 0.3,
    // outlineColor: "green",
    outlineWidth: 0,
    outlineOpacity: 0.001,
    id: dev.id,
    zoomto: false
    // className: "SViewShed2D",
    // timestamp:"1680073428852_2502033064",
    // method: "instantiation",
    // index: 225
  }
  return new CTMapOL.cesiumComponent.ViewShed2D(map, opt)
}
export function cameraLocationAnalysis(map, dev, color = '#3CFFE9') {
  let opt = {
    lng: dev.longitude,
    lat: dev.latitude,
    horizontalView: dev.angle,
    distance: dev.distance ? dev._distance / 1000 : 3,
    direction: dev.heading,
    outColor: color,
    outOpacity: 0.3,
    innerColor: color,
    innerOpacity: 0.8,
    innerlineColor: color,
    innerlineOpacity: 0.3,
    // outlineColor: "green",
    outlineWidth: 0,
    outlineOpacity: 0.001,
    id: dev.id,
    zoomto: false
    // className: "SViewShed2D",
    // timestamp:"1680073428852_2502033064",
    // method: "instantiation",
    // index: 225
  }
  return new CTMapOL.cesiumComponent.ViewShed2D(map, opt)
}
