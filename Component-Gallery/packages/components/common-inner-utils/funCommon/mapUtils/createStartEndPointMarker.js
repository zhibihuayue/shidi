import CTMapOl from '@ct/ct_map_ol'
import MapConstant from '../../mapCommon/mapSlim/MapConstant'
import STARTPOINT from '@component-gallery/assets/mapImage/new-start-point.png'
import ENDPOINT from '@component-gallery/assets/mapImage/new-end-point.png'

const { Style, Icon } = CTMapOl.style

const MARKER_DEFINE = {
  NAVI_START: {
    normal: {
      src: STARTPOINT,
      size: [53, 64], //
      anchor: [0.5, 0.95],
      scale: 0.5
    }
  },
  NAVI_END: {
    normal: {
      src: ENDPOINT,
      size: [53, 64],
      anchor: [0.5, 0.95],
      scale: 0.5
    }
  }
}

const parseMarker = () => {
  const result = {}
  Object.keys(MARKER_DEFINE).forEach((key) => {
    const def = MARKER_DEFINE[key]
    const { normal = {}, selected } = def
    result[key] = {
      markerStyle: {
        normal: new Style({
          image: new Icon({
            src: normal.src,
            size: normal.size,
            anchor: normal.anchor,
            scale: normal.scale || 1
          })
        }),
        selected:
          selected &&
          new Style({
            image: new Icon({
              src: selected.src,
              size: selected.size,
              anchor: selected.anchor,
              scale: selected.scale || 1
            })
          })
      },
      markerStyle3d: {
        normal,
        selected
      }
    }
  })

  return result
}

const MARKER_STYLE = parseMarker()

/**
 * 创建开始/结束标记点
 */
const createStartEndPointMarker = (mapRef, points, markerStyle) => {

  const { mapInstance, mapType } = mapRef

  const cluster = false
  const multiSelect = false
  const zIndex = 16

  if (!markerStyle) {
    console.warn('没有传标记类型无法进行打点')
    return
  }

  if (mapType === '2D') {
    // 2D地图打点方法
    const markerStyle2d = MARKER_STYLE[markerStyle].markerStyle
    return new CTMapOl.extend.Markers(mapInstance, points, {
      layerOptions: {
        zIndex
      },
      cluster,
      multiSelect,
      stopClick: true,
      clickToTop: true,
      getCoordsFunc: (item) =>
        CTMapOl.proj.fromLonLat([item.longitude, item.latitude]),
      markerStyle: (feature) => {
        const selected = feature.get('selected')
        // 尽量在函数外预先生成固定不变部分，可提高性能
        return selected
          ? markerStyle2d.selected || markerStyle2d.normal
          : markerStyle2d.normal
      }
    })
  } else {
    // 3D打点实现
    const viewer = mapInstance
    const markerStyle3d = MapConstant.MARKER_STYLE[markerStyle].markerStyle3d
    const layerId = `SlimLayer`
    const { size, anchor = [0.5, 0.5], src, scale = 1 } = markerStyle3d.normal
    const pointsData3d = points.map((p, ind) => {
      // 默认的points的输出格式为，每个点是一个数组，内容元素分别为 经纬度字符串， Id， 图片地址， 图片偏移，均为逗号分隔字符串
      const offsetFor3d = [
        Math.round(size[0] * scale * anchor[0]),
        Math.round(size[1] * scale * anchor[1])
      ]
      return [
        `${p.longitude},${p.latitude}`,
        `${layerId}-${ind}`,
        src,
        offsetFor3d.join(',')
      ]
    })
    const pointsParam = {
      viewer,
      layerId,
      points: pointsData3d,
      width: size[0] * scale,
      height: size[1] * scale,
      zoom: 2,
      zIndex,
      clickIcon: markerStyle3d.selected?.src,
      clickBig: false
    }
    const markers = new CTMapOl.cesiumComponent.Points(pointsParam)
    markers.addTo({ viewer: viewer })
    markers.destroy = () => {
      try {
        markers.remove()
      } catch (e) {
        // 这里的报错不处理
        console.error(e)
      }
    }
    return markers
  }
}

export default createStartEndPointMarker
