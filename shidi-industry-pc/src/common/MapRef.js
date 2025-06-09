/*
 * @Author: fanzhiwei
 * @Date: 2024-06-19 14:19:18
 * @LastEditors: fanzhiwei
 * @LastEditTime: 2024-06-25 19:27:57
 * @FilePath: /shidi-industry/shidi-industry-pc/src/common/MapRef.js
 * @Description: 
 */
import { produce, enableMapSet, original, createDraft, current } from 'immer';

enableMapSet();

export default class MapRef {
  /**
   * mapRef 数据结构说明
   *
  interface MapRef {
    [mapID: string]: {
      mapInstance: Object
      mapType: string // 2D or 3D
      domId: string // map dom id
      name: string // mapID
      // current view status 当前页面状态
      viewerStatus: {
        zoom: number // 缩放等级
        center: [number, number] // [lon, lat] // 经纬度
        tileType: string // 底图类型
      }
      changeTileType: Function[]
      chagneMapType: Function[]
      // required above 以上必填项

      // options below 以下可选项
      // 涉及dom控制
      innerControl: [], // 地图上所有的控制器， eg 比如切换地图比例尺 zoom 切换2d 3d
      infoBox: [], // 静置在地图上的信息弹窗， eg: tooltips
      overlays: [], // 随动的地图信息弹窗， eg: 地图上的dom标签
      // 不涉及dom标签的
      layer:  Object, // 图层控制 { '遮罩涂层': 'layer实例' }
      interAction: Object // 地图控制器 {'漫游': '漫游控制器实例'}
      eventHander: Object // 事件控制 {'zoom相关':  'handler'}
    }
  }
  */
  constructor(options = {}) {
    // 构造配置项。目前允许传入onMapSet一个回调函数，在setMapRef时触发
    this.options = options
  }
  mapRef = produce(new Map(), () => undefined);
  setMapRef(mapId, payload, noCallback = false) {
    const lastInst = {
      tileType: this.mapRef.get(mapId)?.viewerStatus?.tileType,
      mapType: this.mapRef.get(mapId)?.mapType
    }
    this.mapRef = produce(this.mapRef, draft => {
      draft.set(mapId, payload);
    });
    if (!noCallback) {
      if (this.options.onMapSet) {
        // 如果配置项里有回调，则执行回调
        const nowInst = {
          tileType: this.mapRef.get(mapId)?.viewerStatus?.tileType,
          mapType: this.mapRef.get(mapId)?.mapType
        }
        // 如果地图实例的瓦片类型（卫星/常规地图切换）或地图类型不相同（二维/三维切换），认为是初始化了一个新的
        // 暂时不监听瓦片变化
        if (nowInst.mapType !== lastInst.mapType) {
          this.options.onMapSet(mapId, payload)
        }
      }
    }
  }
  getMapRef(mapId) {
    return this.mapRef.get(mapId);
  }
  mapRefUpdater = (mapId, handler) => this.setMapRef(mapId, produce(handler)(this.getMapRef(mapId)));
  getDraftMapRef(mapId) {
    return createDraft(this.mapRef.get(mapId));
  }
}

