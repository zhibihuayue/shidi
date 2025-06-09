import CTMapOl from '@ct/ct_map_ol'
import { transCoordinate } from '@component-gallery/utils/mapCommon/map-ol/CommonMap-iw'
import eventPath from '@component-gallery/build-event-bus-path'
const { turf } = CTMapOl

export class drawPolygon {
  constructor(mapRef, data, vueThis) {
    this.mapRef = mapRef
    this.is3D = mapRef.mapType === '3D'
    this._$v = vueThis
    this._onSelectFunc = data.onSelectFunc
    this.from = data.from
    this.polygons = []
    this.disable = false

    this.onSelectFunc = (map, type, { props }) => {
      // 打开详情弹窗
      this.arrFlag(props.id)
    }
    this.onUnselectFunc = () => {
      console.log('========++++取消选中')
      // this._$v.$globalEventBus.$emit('close_spot_detail_pop')
    }

    this._getCoordByClick = CTMapOl.InteractionControl.common.getCoordByClick(
      {
        mapRef: this.mapRef
      },
      {
        onmouseclick: () => {
          // 有绘制的图斑，才触发
          if (this.polygons.length && !this.disable) {
            this.unSelectPolygon()
            this._$v.$globalEventBus.$emit('close_spot_detail_pop')
          }
        }
      }
    )
  }

  // 设置禁用状态
  setDisable(flag) {
    this.disable = flag
  }

  drawFeatures(data) {
    this.destroy()
    this._layerInfo = data.layerInfo
    this._featuresList = data.arr
    let _style = this._getPolygonStyle()
    this.polygons = this._featuresList.map((item) => {
      return {
        id: item.featureId,
        isSelect: false,
        polygon: this._addSingleGeometryDataSource(item, _style.normalstyle)
      }
    })

    CTMapOl.ViewControl.common.setViewRectangle(
      { mapRef: this.mapRef },
      {
        rectangle: [
          this._layerInfo.minx,
          this._layerInfo.miny,
          this._layerInfo.maxx,
          this._layerInfo.maxy
        ]
      }
    )
  }

  // 生成小旗子
  arrFlag(id, isOnlyShowFlag = false) {
    let features = this._featuresList.find((dev) => {
      return dev.featureId === id
    })
    if (!features) {
      return
    }
    let _center = turf.center({
      type: features.geometryType,
      coordinates: features.geometry
    })
    let position = _center.geometry.coordinates
    if (/LineString/gi.test(features.geometryType)) {
      let list = features.geometry
      if (/MultiLineString/gi.test(features.geometryType)) {
        list = features.geometry.flat()
      }
      position = list[Math.round(list.length / 2)]
    }
    let _feature = JSON.parse(JSON.stringify(features.geoData))
    this._transCoordinate(_feature.geometry.coordinates)

    this._$v.$globalEventBus.$emit('close_spot_detail_pop')
    this._$v.$globalEventBus.$emit(
      `${eventPath.commonCompSpotDetail}__visible`,
      {
        position,
        feature: _feature,
        abbreviation: features.geoData.properties.layertype,
        layerId: features.layerId,
        // name: features.layerName,
        name: '图斑详情',
        isOnlyShowFlag,
        clickFlag: true,
        spotMsgFrom: this.from
      }
    )

    // 因为图斑详情弹窗关闭事件的回调加了防抖，这里也必须延迟处理，不然选中状态会被取消
    setTimeout(() => {
      this.selectPolygon(id)
      this._onSelectFunc && this._onSelectFunc(id)
    }, 350)
  }

  // 选中方法
  selectPolygon(id) {
    let _polygon = this.polygons.find((item) => {
      return item.id == id
    })
    this.unSelectPolygon()
    if (_polygon) {
      this._resetPolygon(_polygon, true)
      // CTMapOl.DataSourceControl.common.setSingleDataSourceSelection(
      //   { mapRef: this.mapRef },
      //   _polygon.polygon
      // )
      let features = this._featuresList.find((dev) => {
        return dev.featureId === id
      })
      let _center = turf.center({
        type: features.geometryType,
        coordinates: features.geometry
      })
      CTMapOl.ViewControl.common.setZoomAndCenter(
        { mapRef: this.mapRef },
        { center: _center.geometry.coordinates, zoom: 15 }
      )
      console.log('===========++++', _polygon.polygon)
      // CTMapOl.ViewControl.common.fitView(
      //   { mapRef: this.mapRef },
      //   {
      //     target: _polygon.polygon,
      //     duration: 0,
      //     padding: [150, 150, 150, 150]
      //   }
      // )
    }
  }
  unSelectPolygon() {
    // CTMapOl.DataSourceControl.common.clearSingleDataSourceSelection({
    //   mapRef: this.mapRef
    // })
    // 先取消选中
    let _seleftPolygon = this.polygons.find((item) => {
      return item.isSelect
    })
    if (_seleftPolygon) {
      this._resetPolygon(_seleftPolygon, false)
    }
  }

  // 清空所有生成的东西
  destroy() {
    if (this.polygons.length) {
      this.polygons.forEach((item) => {
        CTMapOl.DataSourceControl.common.removeSingleDataSource(
          { mapRef: this.mapRef },
          item.polygon
        )
      })
      this.polygons = []
      this._featuresList = []
      this._layerInfo = ''
    }
    // this._getCoordByClick()
    this._$v.$globalEventBus.$emit('close_spot_detail_pop')
  }
  // 转换coordinates的经纬度
  _transCoordinate(arr) {
    let _fn = (list) => {
      if (Array.isArray(list[0])) {
        list.forEach((coordinate) => {
          _fn(coordinate)
        })
      } else {
        [list[0], list[1]] = transCoordinate(list, 'EPSG:4326', 'EPSG:3857')
      }
    }
    _fn(arr)
  }

  // 生成图斑
  _addSingleGeometryDataSource(item, style) {
    return CTMapOl.DataSourceControl.common.addSingleGeometryDataSource(
      {
        mapRef: this.mapRef,
        ...item
      },
      {
        normalstyle: style,
        selectlstyle: style,
        props: {
          id: item.featureId
        },
        // mapRef,'select',{geometry,props}
        onSelectFunc: this.onSelectFunc,
        onUnselectFunc: this.onUnselectFunc
      }
    )
  }
  _resetPolygon(item, isSelect) {
    let _style = this._getPolygonStyle()
    CTMapOl.DataSourceControl.common.removeSingleDataSource(
      { mapRef: this.mapRef },
      item.polygon
    )
    item.polygon = this._addSingleGeometryDataSource(
      this._featuresList.find((dev) => {
        return dev.featureId === item.id
      }),
      isSelect ? _style.selectlstyle : _style.normalstyle
    )
    item.isSelect = isSelect
  }

  _getPolygonStyle() {
    let _config = {
      'theme-wiseblue': {
        normalstyle: {
          fillColor: '#1373E6',
          radius: 5,
          fillTransparency: 0.3,
          strokeColor: '#4F9FFF',
          strokeWidth: 2,
          strokeTransparency: 1
        },
        selectlstyle: {
          fillColor: '#561F00',
          radius: 5,
          fillTransparency: 0.3,
          strokeColor: '#FB913C',
          strokeWidth: 2,
          strokeTransparency: 1
        }
      }, // 通用
      'theme-aquamarine': {
        normalstyle: {
          fillColor: '#0DC985',
          radius: 5,
          fillTransparency: 0.2,
          strokeColor: '#0DC985',
          strokeWidth: 2,
          strokeTransparency: 1
        },
        selectlstyle: {
          fillColor: '#561F00',
          radius: 5,
          fillTransparency: 0.4,
          strokeColor: '#FF7F3C',
          strokeWidth: 2,
          strokeTransparency: 1
        }
      }, // 林业
      'theme-terracotta': {
        normalstyle: {
          fillColor: '#E6B21A',
          radius: 5,
          fillTransparency: 0.3,
          strokeColor: '#FFE167',
          strokeWidth: 2,
          strokeTransparency: 1
        },
        selectlstyle: {
          fillColor: '#561F00',
          radius: 5,
          fillTransparency: 0.4,
          strokeColor: '#FF7F3C',
          strokeWidth: 2,
          strokeTransparency: 1
        }
      } // 国土
    }
    let _k = document.documentElement.getAttribute('data-theme')
    return _config[_k] || _config['theme-wiseblue']
  }
}
