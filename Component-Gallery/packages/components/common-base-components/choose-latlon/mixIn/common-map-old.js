import CTMapOl from '@ct/ct_map_ol'
import { getConfigColor } from '../util/resource'
export const commonMap = {
  data: function () {
    return {
      showSpotDetail: false
    }
  },
  methods: {
    /**
     *
     * @param {*} p1 原点坐标
     * @param {*} p2 参考点
     * @param {*} getDistance2 高德方法 AMap.GeometryUtil.distance
     * @param {*} isMapApi 调用的是华苏地图api getDistance2是通用库GeometryUtil
     */
    getTwoPointAngle(p1, p2, getDistance2, isMapApi) {
      const [x1, y1] = p1
      const [x2, y2] = p2

      const b = [x1, y2]
      const d = [x2, y1]
      let ab, ad
      if (isMapApi) {
        ab = getDistance2.distance({
          p1: b,
          p2: p1
        })
        ad = getDistance2.distance({
          p1: d,
          p2: p1
        })
      } else {
        ab = getDistance2(b, p1)
        ad = getDistance2(d, p1)
      }

      let angle

      if (ad === 0 || ab === 0) {
        angle = this.countAngle1(x1, x2, y1, y2)
      } else {
        angle = this.countAngle2(x1, x2, y1, y2, ad, ab)
      }
      return angle.toFixed(2)
    },
    countAngle1(x1, x2, y1, y2) {
      let angle = 0

      if (x2 === x1 && y2 < y1) {
        angle = 180
      }

      if (x2 > x1 && y2 === y1) {
        angle = 90
      }

      if (x2 < x1 && y2 === y1) {
        angle = 270
      }
      return angle
    },

    countAngle2(x1, x2, y1, y2, ad, ab) {
      let angle = Math.abs((Math.atan(ad / ab) * 180) / Math.PI)
      if (x2 > x1 && y2 < y1) {
        angle = 180 - angle
      }
      if (x2 < x1 && y2 < y1) {
        angle = 180 + angle
      }
      if (x2 < x1 && y2 > y1) {
        angle = 360 - angle
      }
      return angle
    },
    /**
     * 打点
     * @param lng
     * @param lat
     * @param imgObj '{imgPath, imgWidth, imgHeight,offSet}'
     *  imgPath img对象的参数 图片地址
     *  imgWidth img对象的参数 Number类型
     *  imgHeight img对象的参数 Number类型
     *  isBig img对象的参数 boolean类型 是否直接显示大图标,点击不变大
     *  offSet 偏移
     * @param successFn 成功回调
     */
    showMarker(lng, lat, imgObj, successFn) {
      const width = imgObj.imgWidth
      const height = imgObj.imgHeight

      let marker = CTMapOl.DataSourceControl.common.addSingleMarkerDataSource(
        {
          mapRef: this.mapRef.getMapRef(this.mapId),
          coord: [Number(+lng), Number(+lat)]
        },
        {
          normalstyle: {
            textstyle: {
              text: '',
              font: '',
              scale: 0,
              textAlign: '',
              offset: [0, 0],
              fontstyle: {
                fillColor: '',
                fillTransparency: 0,
                strokeColor: '',
                strokeWidth: 0,
                strokeTransparency: 0
              },
              backgroundstyle: {
                fillColor: '',
                fillTransparency: 0,
                strokeColor: '',
                strokeWidth: 0,
                strokeTransparency: 0
              }
            },
            imagestyle: {
              src: imgObj.imgPath,
              width: width,
              height: height,
              opacity: 1,
              rotation: 0,
              anchorOrigin: '',
              offset: imgObj.offset
            }
          },
          selectlstyle: {
            textstyle: {
              text: '',
              font: '',
              scale: 0,
              textAlign: '',
              offset: [0, 0],
              fontstyle: {
                fillColor: '',
                fillTransparency: 0,
                strokeColor: '',
                strokeWidth: 0,
                strokeTransparency: 0
              },
              backgroundstyle: {
                fillColor: '',
                fillTransparency: 0,
                strokeColor: '',
                strokeWidth: 0,
                strokeTransparency: 0
              }
            },
            imagestyle: {
              src: imgObj.imgPath,
              width: width,
              height: height,
              opacity: 1,
              rotation: 0,
              anchorOrigin: '',
              offset: imgObj.offset
            }
          },
          props: { id: '1', type: 'point', name: 'point' },
          zIndex: 600,
          selectzIndex: 600,
          onSelectFunc: () => {
            console.log('1')
          },
          onUnselectFunc: () => {
            console.log('2')
          }
        }
      )
      this.executeFunction(successFn, marker)
    },

    /**
     * 删除指定点
     */
    deleteMarker(pointEntity) {
      if (!pointEntity) {
        return false
      }
      CTMapOl.DataSourceControl.common.removeSingleDataSource(
        { mapRef: this.mapRef.getMapRef(this.mapId) },
        pointEntity
      )
      pointEntity = null
    },

    /**
     * 计算水平方位角
     * @param start       开始点
     * @param end         结束点
     * @param num         保留小数点后几位
     * @returns {*}       两点恒向线夹角
     */
    getHorizontalAngle(start, end, num) {
      let angle = CTMapOl.turf.rhumbBearing(start, end)
      return angle >= 0 ? angle.toFixed(num) : (angle + 360).toFixed(num)
    },

    /**
     * 计算两点间距离
     * @param start     开始点
     * @param end       结束点
     * @param num       保留小数点后几位
     * @returns {*}     两点间距离
     */
    getDistance(start, end, num) {
      let distance = CTMapOl.turf.distance(start, end)
      return distance.toFixed(num)
    },

    setZoomAndCenter(lng, lat, zoom) {
      CTMapOl.ViewControl?.common?.setZoomAndCenter(
        { mapRef: this.mapRef.getMapRef(this.mapId) },
        { center: [lng, lat], zoom, duration: 1000, offset: [0, 0] }
      )
    },
    initPolygonReview(isJump, polygonData, zIndex, callback) {
      try {
        const self = this
        const { geometry, featureId } = polygonData
        const { bbox } = CTMapOl.SpatialAnalysisControl.common.bboxSingleGeometry({
          mapRef: this.mapRef.getMapRef(this.mapId),
          geometry: JSON.parse(geometry),
          geometryType: 'MultiPolygon'
        })
        console.log('bbox====================>', bbox)
        const lng = bbox[0] + (bbox[2] - bbox[0]) / 2
        const lat = bbox[1] + (bbox[3] - bbox[1]) / 2
        const colorConfig = getConfigColor(this.theme)
        const polygonParam = {
          radius: 5,
          strokeColor: colorConfig.iconConfig.color,
          strokeTransparency: 0.8,
          fillColor: colorConfig.iconConfig.fillColorHex,
          fillTransparency: 0.4,
          strokeWidth: 2
        }
        const selectPolygonParam = {
          radius: 5,
          strokeColor: colorConfig.iconConfig.color,
          strokeTransparency: 1,
          fillColor: colorConfig.iconConfig.fillColorHex,
          fillTransparency: 0.8,
          strokeWidth: 2
        }
        let ref = new CTMapOl.DataSourceControl.lib.MutyGeometryDataSource(
          {
            mapRef: this.mapRef.getMapRef(this.mapId),
            geojson: {
              features: [
                {
                  geometry: {
                    type: 'MultiPolygon',
                    coordinates: JSON.parse(geometry)
                  },
                  properties: {
                    id: featureId,
                    type: 'MultiPolygon',
                    center: [lng, lat],
                    text: polygonData.tbbh,
                    polygonData
                  }
                }
              ]
            }
          },
          {
            zIndex,
            normalstyle: polygonParam,
            selectlstyle: selectPolygonParam,
            maxZoom: 18,
            minZoom: 5,
            onSelectFunc: function (mapRef, type, feature) {
              console.log(mapRef, type, feature, 'select')
              if (feature.props.polygonData.sanitaryType) {
                return
              } else {
                self.getPolygonFeature(feature.props.polygonData).then((res) => {
                  const featureInfo = res.data
                  console.log('featureInfo?.features[0]', featureInfo?.features[0])
                  if (featureInfo?.features[0]) {
                    const { geojson } = CTMapOl.SpatialAnalysisControl.common.reProject(
                      {
                        fromSRID: 'EPSG:4326',
                        toSRID: 'EPSG:3857'
                      },
                      {
                        // 方法支持同时传入多种类型数据
                        geojson: featureInfo.features[0].geometry
                      }
                    )
                    featureInfo.features[0].geometry = geojson
                  }
                  const payload = {
                    mapRef: self.mapRef.getMapRef(this.mapId),
                    mapId: self.mapId,
                    feature: featureInfo?.features[0],
                    position: feature.props.center,
                    abbreviation: feature.props.polygonData.abbreviation,
                    layerId: feature.props.polygonData.layerId,
                    name: feature.props.polygonData.layerName,
                    spotMsgFrom: self.spotDetailFrom
                  }
                  self.$globalEventBus.$emit(`common-comp-spot-detail__visible`, payload)
                  self.showSpotDetail = true
                  console.log('发送事件common-comp-spot-detail__visible', payload)
                })
              }
            },
            onUnselectFunc: function (mapRef, type, feature) {
              console.log(mapRef, type, feature, 'unselect')
              self.$globalEventBus.$emit(`close_spot_detail_pop`)
              self.showSpotDetail = false
            }
          }
        )
        ref.init()

        ref.mount()
        ref.enable()
        console.log('ref===================>', ref)
        console.log(
          'entity==========>',
          ref.propertySearch({
            filterFunc: () => {
              return true
            }
          })
        )
        this.executeFunction(callback, ref)

        if (isJump) {
          const featureOrEntify = ref.propertySearch({
            filterFunc: () => {
              return true
            }
          })
          CTMapOl.ViewControl.common.fitView(
            { mapRef: this.mapRef.getMapRef(this.mapId) },
            {
              target: this.is3d ? { entity: featureOrEntify?.entities } : { feature: featureOrEntify },
              duration: 1000,
              padding: [100, 100, 100, 100]
            }
          )
        }
        return ref
      } catch (error) {
        console.log('error======>', error)
      }
    },

    /**
     * 单坐标转换指定投影系
     * @param coordinate 坐标
     * @param fromType 源投影坐标系
     * @param toType 目标投影坐标系
     */
    transCoordinate(coordinate, fromType = 'EPSG:4326', toType = 'EPSG:3857') {
      return CTMapOl.extend.formatLayer.transCoordinate(coordinate, fromType, toType)
    },
    transTo3857(data) {
      return this.transCoordinate(data)
    },
    formatGeometry(data) {
      const { coordinates, type } = data || {}
      let geometry = ''
      if (type == 'Point' || type == 'MultiPoint') {
        geometry = coordinates
      } else if (type == 'MultiLineString' || type == 'LineString') {
        geometry = coordinates[0]
      } else if (type == 'MultiPolygon' || type == 'Polygon') {
        geometry = coordinates[0][0].map((item) => item)
      } else {
        geometry = coordinates
      }
      console.log('geometry', geometry)
      return geometry
    },
    executeFunction(func, param, param2, param3) {
      if (func) {
        if (param != null) {
          func(param, param2, param3)
        } else {
          func()
        }
      }
    }
  }
}
