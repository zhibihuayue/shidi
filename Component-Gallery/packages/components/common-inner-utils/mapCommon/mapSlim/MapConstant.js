import CTMapOl from '@ct/ct_map_ol'
const { Style, Circle, Fill, Icon } = CTMapOl.style
import SPECIESMARKER from '@component-gallery/assets/image/search-map/wildlife-normal.png'
import SPECIESMARKERSELECTED from '@component-gallery/assets/image/search-map/wildlife-select.png'
import SPECIESMARKERSOLID from '@component-gallery/assets/image/search-map/wildlife-select-solid.png'
import SPECIESMARKERSOLID2 from '@component-gallery/assets/image/search-map/wildlife-select-solid2.png'
import SPECIESCAMERAMARKER from '@component-gallery/assets/image/search-map/camera-normal.png'
import SPECIESCAMERAMARKERSELECTED from '@component-gallery/assets/image/search-map/camera-select.png'
import SPECIESCAMERAMARKERSELECTED2 from '@component-gallery/assets/image/search-map/camera-select2.png'
import CAMERASELECTED from '@component-gallery/assets/image/search-map/ipc-change.png'
import STARTPOINT from '@component-gallery/assets/image/search-map/new-start-point.png'
import ENDPOINT from '@component-gallery/assets/image/search-map/new-end-point.png'
import RESOURCEMODULE from '@component-gallery/assets/image/search-map/analysis-center-point.png'


// 地图打点的图标定义数据，与具体业务代码分散成为共用定义
// ！！！注意，这里的定义只接受图片图标形式，不接受形状这种基本图形！！！
// 尺寸和偏移在这里设置，如果有特别的需求再商榷
// 格式为{ normal, selected }, 分别为标准下的图标样式和选择后的图标样式；如果不需要selected版本，只传normal即可
// 允许的定义方式为{ src, size, anchor, scale }，
// {
//   src 图片路径
//   size 图标文件原始像素大小，注意这个大小是告诉Icon你的图片文件原始尺寸是多少，不会把你的图片改到这个大小。size的值应当和原始图片尺寸相同
//   anchor 图片锚点，默认图片以中心点([0.5,0.5])为定位基准，标记类图标需要定位到图片的底部来准确定位指针的位置
//   scale 缩放比例，可以不传，默认为1
// }
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
  },
  // 卡口摄像机标记（小，着色版本。这个是用来适配图层的，所以比例和anchor会有点反常识）
  GATEWAY_CAMERA: {
    normal: {
      src: CAMERASELECTED,
      size: [92, 100],
      anchor: [0.5, 0.85],
      scale: 0.45
    }
  },
  // 野保相机标记（小，着色版本。这个是用来适配图层的，所以比例和anchor会有点反常识）
  SPECIES_CAMERASELECTEDSMALL: {
    normal: {
      src: SPECIESCAMERAMARKERSELECTED2,
      size: [46, 50],
      anchor: [0.5, 0.85],
      scale: 0.9
    },
    selected: {
      src: SPECIESCAMERAMARKERSELECTED2,
      size: [46, 50],
      anchor: [0.5, 0.85],
      scale: 0.9
    }
  },
  // 野生物种标记（小，着色版本。这个是用来适配图层的，所以比例和anchor会有点反常识）
  SPECIESSELECTEDSMALL: {
    normal: {
      src: SPECIESMARKERSOLID,
      size: [46, 50],
      anchor: [0.5, 0.85],
      scale: 0.9
    },
    selected: {
      src: SPECIESMARKERSOLID2, // 3D模式下不知道为什么必须是另一个地址才作数，所以其实是重复的
      size: [46, 50],
      anchor: [0.5, 0.85],
      scale: 0.9
    }
  },
  // 野生物种标记（大）
  SPECIES: {
    normal: {
      src: SPECIESMARKER,
      size: [46, 50],
      anchor: [0.5, 0.82]
    },
    selected: {
      src: SPECIESMARKERSELECTED,
      size: [46, 50],
      anchor: [0.5, 0.82]
    }
  },
  // 野保相机标记（大）
  SPECIES_CAMERA: {
    normal: {
      src: SPECIESCAMERAMARKER,
      size: [46, 50],
      anchor: [0.5, 0.82]
    },
    selected: {
      src: SPECIESCAMERAMARKERSELECTED,
      size: [46, 50],
      anchor: [0.5, 0.82]
    }
  },
  // 森林资源小班打点
  RESOURCE_MODULE: {
    normal: {
      src: RESOURCEMODULE,
      size: [40, 40], //
      anchor: [0.5, 0.95],
      scale: 1
    }
  }
}

// 把上面的标记定义转换成2d、3d地图使用的对应标记定义
// 最终的定义结果为 key: { markerStyle: { normal, selected }, markerStyle3d: { normal, selected } }
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

// 全透明图标样式，用于一些需要遮盖的特殊用途
const TRANSPARENTSTYLE = new Style({
  image: new Circle({
    radius: 1,
    fill: new Fill({
      color: 'transparent'
    })
  })
})
export default {
  TRANSPARENTSTYLE,
  MARKER_DEFINE,
  MARKER_STYLE
}


