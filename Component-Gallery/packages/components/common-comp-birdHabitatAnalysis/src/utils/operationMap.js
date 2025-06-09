//地图图层相关操作类
import CTMapOl from '@ct/ct_map_ol'
export class operationMap {
  constructor(map, this_) {
    // 地图实例对象
    this.mapRef = map
    this.bindThis = this_
    //绘制和回显时的样式设置
    this.drawStyleConfig = {
      strokeWidth: 1, // 线和边
      strokeTransparency: 1,
      strokeColor: '#1890FF', // 线和边
      fillColor: '#1890FF', // 面
      fillTransparency: 0.2
    }
    // 图形选中的样式设置
    this.selectDrawStyleConfig = {
      strokeWidth: 1, // 线和边
      strokeTransparency: 1,
      strokeColor: '#1890FF', // 线和边
      fillColor: '#1890FF', // 面
      fillTransparency: 0.2
    }
    //图形绘制对象实例
    this.addSingleGeometryDataSourceList = []
    // wms图层对象
    this.wmsLayerObj = null
  }

  //图形回显绘制方法
  EchoDrawing(data) {
    data.forEach((item) => {
      //数据没有颜色就给一个默认值，兼容旧数据
      if (!item.data.color) {
        item.data.color = '#1890FF'
      }
      this.setColor(item.data.color)
      let feature =
        new CTMapOl.DataSourceControl.common.addSingleGeometryDataSource(
          {
            mapRef: this.mapRef,
            geometry: item.geometry,
            geometryType: item.geometryType
          },
          {
            normalstyle: this.drawStyleConfig,
            selectlstyle: this.selectDrawStyleConfig,
            props: {
              uuid: item.data.uuid,
              regionTypeId: item.data.regionTypeId
            },
            zIndex: 100
            // onSelectFunc: (mapRef, type, { geometry, props }) => {
            //   if (props.uuid) {
            //     this.selectFeature = feature;
            //     this.selectMarker = marker;
            //     this.selectData = {
            //       uuid: props.uuid,
            //       regionTypeId: props.regionTypeId,
            //     };
            //   }
            //   this.drawStyleConfig.closeDraw();
            //   this.mapRef.mapInstance.defaultselecter.condition_=CTMapOl.events.condition.singleClick
            // },
            // onUnselectFunc: (mapRef, type, { geometry, props }) => {
            //   this.drawFun();
            //   this.mapRef.mapInstance.defaultselecter.condition_=CTMapOl.events.condition.platformModifierKeyOnly
            //   this.selectFeature = null;
            //   this.selectMarker = null;
            //   this.selectData = null;
            // },
          }
        )
      // this.mapRef.mapInstance.defaultselecter.condition_=CTMapOl.events.condition.platformModifierKeyOnly
      console.log(1111111, this.addSingleGeometryDataSourceList)
      this.addSingleGeometryDataSourceList.push(feature)
      // this.addSingleMarkerDataSourceList.push(marker);
    })
  }

  //设置地图中心点
  setMapZoom(zoom, center) {
    CTMapOl.ViewControl.common.setZoomAndCenter(
      { mapRef: this.mapRef },
      { zoom, center }
    )
  }

  //修改颜色
  setColor(val) {
    this.drawStyleConfig.strokeColor = val
    this.drawStyleConfig.fillColor = val
    this.selectDrawStyleConfig.strokeColor = val
    this.selectDrawStyleConfig.fillColor = val
  }

  // 清空图层绘制
  clearLayer() {
    this.addSingleGeometryDataSourceList.forEach((item) => {
      new CTMapOl.DataSourceControl.common.removeSingleDataSource(
        { mapRef: this.mapRef },
        item
      )
    })
    this.addSingleGeometryDataSourceList = []
  }

  // wms图层
  creatWMSLayer(params, year) {
    console.log('wms图层:', params)
    window.detailPopupObj = {}
    window.detailPopupObj.titleName = params.customName
    let { rootGeoserverUrl, layerName, layerNamespace, styles } = params
    this.wmsLayerObj = new CTMapOl.LayerControl.lib.WMSLayer(
      {
        mapRef: this.mapRef,
        url: rootGeoserverUrl + '/wms', //格式："http://10.43.82.110:9239/geoserver/wms"
        params: {
          FORMAT: 'image/png',
          VERSION: '1.3.0',
          LAYERS: `${layerNamespace}:${layerName}`, //格式：guotu:polygon_yjjbnt_1708394542038_q1wplq
          STYLES: styles[0].styleName,
          cql_filter: `year in (${year})`
        }
      },
      {
        tiled: true,
        gutter: 20,
        zIndex: 40,
        onSelectFunc: (map, event, data, coord) => {
          console.log(11111111111, data.props.year, year)
          // if (data.props.year != year) {
          //   return
          // }
          window.detailPopupObj.props = data.props
          this.uptadeSelectlstyle()
          this.changeWindow(true)
          this.setMapZoom(11, coord)
        },
        onUnselectFunc: (map, event, data) => {
          this.changeWindow(false)
        }
      }
    )
    this.wmsLayerObj.init()
    this.wmsLayerObj.mount(this.mapRef)
    this.mapRef.mapInstance._stopevent = true
    window.legendList = JSON.parse(styles[0].dictJson)
    this.changeWindow(false)
  }

  // 选中更改样式
  uptadeSelectlstyle() {
    this.wmsLayerObj.uptadeSelectlstyle({
      selectStyle: {
        fillColor: 'rgb(119,76,8)',
        fillTransparency: 0.5,
        strokeColor: 'rgb(240,139,60)',
        strokeTransparency: 1,
        strokeWidth: 2
      }
    })
  }

  //更新图层
  updateLayer(params, year) {
    window.detailPopupObj.titleName = params.customName
    let { layerName, layerNamespace, styles } = params
    this.wmsLayerObj.update({
      FORMAT: 'image/png',
      VERSION: '1.3.0',
      LAYERS: `${layerNamespace}:${layerName}`,
      STYLES: styles[0].styleName,
      cql_filter: `year in (${year})`
    })
    this.changeWindow(false)
  }

  //清除wms图层
  clearWmsLayer() {
    if (this.wmsLayerObj) {
      this.wmsLayerObj.realse()
      this.wmsLayerObj.destroy()
      this.wmsLayerObj = null
    }
    this.changeWindow(false)
    window.newMapClass = null
  }

  //改变window自定义变量的值并通知
  changeWindow(status) {
    this.bindThis.$globalEventBus.$emit(
      'commonCompBirdHabitatAnalysis_detailsPopupShowChange',
      status
    )
  }
}
