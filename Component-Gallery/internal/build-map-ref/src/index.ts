import { produce, enableMapSet, Immutable, Draft } from 'immer'

enableMapSet()

interface IMapRefValue {
  mapInstance: unknown
  mapType: string // 2D or 3D
  domId: string // map dom id
  name: string // mapID
  // current view status 当前页面状态
  viewerStatus: {
    zoom: number // 缩放等级
    center: [number, number] // [lon, lat] // 经纬度
    tileType: string // 底图类型
  }
  changeTileType: Function[] // 底图类型切换变更函数
  chagneMapType: Function[] // 二三维切换回掉函数
  // required above 以上必填项

  // options below 以下可选项
  // 涉及dom控制
  innerControl?: unknown[] // 地图上所有的控制器， eg 比如切换地图比例尺 zoom 切换2d 3d
  infoBox?: unknown[] // 静置在地图上的信息弹窗， eg: tooltips
  overlays?: unknown[] // 随动的地图信息弹窗， eg: 地图上的dom标签
  // 不涉及dom标签的
  layer?: unknown // 图层控制 { '遮罩涂层': 'layer实例' }
  interAction?: unknown // 地图控制器 {'漫游': '漫游控制器实例'}
  eventHander?: unknown // 事件控制 {'zoom相关':  'handler'}
  [propName: string]: any
}

type ImmutableValue = Immutable<IMapRefValue>
type TMapRef = Map<string, ImmutableValue>
// 定义一个更新函数类型
type Updater<T> = (draft: Draft<T>) => void

class MapRef {
  mapRef = produce<TMapRef>(new Map(), () => {})
  setMapRef(mapId: string, payload: IMapRefValue) {
    this.mapRef = produce<TMapRef>(this.mapRef, (draft) => {
      draft.set(mapId, payload)
    })
  }
  getMapRef(mapId: string) {
    return this.mapRef.get(mapId)!
  }
  mapRefUpdater = (mapId: string, handler: Updater<IMapRefValue>) =>
    this.setMapRef(mapId, produce(handler)(this.getMapRef(mapId)))
}

export default MapRef
