<template>
  <div class="mapComponent" id="mapparent">
    <div class="operation_shidi" v-if="currentOperationStatus !== 'detail'">
      <div class="iconArea">
        <el-select
          v-model="address"
          filterable
          clearable
          remote
          placeholder="请输入关键词"
          @change="changeAddress"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="(item, index) in addressList"
            :key="index"
            :label="item.alias"
            :value="item.alias"
          >
          </el-option>
        </el-select>
        <i class="el-icon-search icon"></i>
      </div>
      <el-select
        v-model="paintingType"
        placeholder="请选择"
        @change="changePaitingType"
        popper-class="paintClass"
      >
        <el-option
          v-for="item in paintingTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
          <div class="option">
            <ct-icon
              :name="item.iconName"
              size="20"
              :color="
                paintingType == item.id ? item.iconColor2 : item.iconColor1
              "
            />
            <span>{{ item.name }}</span>
          </div>
        </el-option>
      </el-select>
      <img
        src="@/assets/image/common/imgIcon41.png"
        alt=""
        @click="rangingFun"
        class="iconImg"
      />
      <img
        src="@/assets/image/common/imgIcon42.png"
        alt=""
        @click="clearFun"
        class="iconImg"
      />
      <div>
        <img
          src="@/assets/image/newCommon/icon18.png"
          alt=""
          class="colorIconImg iconImg"
        />
        <el-color-picker
          v-model="plottingColor"
          popper-class="colorPicker"
          class="colorPick"
          @change="changeColor"
        ></el-color-picker>
      </div>
    </div>
    <div id="map" class="mapparentclass"></div>
    <div class="innercontrol-panel">
      <div id="tile-control" class="tile-control"></div>
      <div id="zoom-tool" class="zoom-tool"></div>
      <div id="scale-line-fixed-width" class="scale-line"></div>
    </div>
    <div class="coordinate">{{ coordinate }}</div>
  </div>
</template>

<script>
import { MapClass } from "./mapClass.js";
import { iframeSDK } from "@ct/iframe-connect-sdk";
export default {
  props: {
    drawEchoDataProp: {
      //回显绘制数据
      type: Array,
      default: () => [],
    },
    reviewMapName: {
      //回显名字
      type: String,
      default: "",
    },
    currentOperationStatus: {
      type: String,
      default: "add", //add:新增 edit:编辑 detail:详情
    },
    regionTypeId: {
      //所属区域的ID
      type: String | Number,
      default: null,
    },
    areaUnit: {
      type: String,
      default: "亩",
    },
    LatLonCenter: {
      type: Array,
      default: null,
    },
    mapColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /**
       * 标绘颜色
       */
      plottingColor: "#1890FF",
      /*
       *表格变量
       */
      address: "",
      addressList: [],
      paintingType: "circle",
      paintingTypeList: [
        {
          name: "圆形",
          id: "circle",
          iconName: "surrounding-analysis-point",
          iconColor1: "#303133",
          iconColor2: "#FF6A6C",
        },
        {
          name: "矩形",
          id: "rectangle",
          iconName: "surrounding-analysis-area",
          iconColor1: "#303133",
          iconColor2: "#FF6A6C",
        },
        {
          name: "多边形",
          id: "polygon",
          iconName: "surrounding-analysis-rectangle",
          iconColor1: "#303133",
          iconColor2: "#FF6A6C",
        },
      ],

      /*
       *地图配置变量
       */
      mapConfig: {
        mapShow: false,
      },

      /*
       *测距配置
       */
      rangingConfig: {
        infinite: false,
        lineOptions: {
          strokeColor: "#1890FF",
          strokeWeight: 3,
        },
        pointOption: {
          outlineColor: "#fff",
          outlineColorOpacity: 1,
          borderWeight: 2,
          strokeWeight: 5,
          strokeOpacity: 1,
        },
        mode: "joint",
        rightClickEnd: false,
        startTip:
          '<div style="padding:3px 10px;background:white">单击确定起点</div>',
        elseTip: "单击继续,双击右键结束",
        rightClickEnd: true,
        onFinished: (res) => this.onFinish(res),
      },
      coordinate: null, //鼠标坐标
    };
  },
  watch: {
    reviewMapName: {
      handler(val) {
        this.filterNowInfo(val);
      },
    },
    areaUnit: {
      handler(val) {
        let featureList = [
          ...newMapClass.newFeatureList,
          ...newMapClass.oldFeatureList,
        ];
        this.clearAllFun();
        if (featureList) {
          this.EchoDrawing(featureList);
        }
      },
    },
  },
  computed: {
    drawEchoData() {
      return this.drawEchoDataProp || [];
    },
  },
  created() {
    window.newMapClass = new MapClass();
    this.plottingColor = this.mapColor || "#1890FF";
  },
  mounted() {
    this.initMap();
    this.creatChangeMap();
    this.creatZoomLine();
    this.getCoordinate();
    if (this.currentOperationStatus != "detail") {
      this.drawFun();
    }
    if (this.drawEchoData) {
      console.log(333333, this.drawEchoData);
      newMapClass.oldFeatureList = this.drawEchoData;
      this.EchoDrawing(this.drawEchoData);
    }
  },
  methods: {
    // 初始化地图
    initMap() {
      if (this.LatLonCenter && this.LatLonCenter.length > 0) {
        newMapClass.mapRef.viewerStatus.center = this.LatLonCenter;
      }
      newMapClass.mapRef.mapInstance =
        CTMapOl.MapControl.common.intiMapInstance(
          { mapRef: newMapClass.mapRef },
          { maxZoom: 18, minZoom: 2 }
        );
      this.mapConfig.mapShow = true;
    },

    //创建底图切换
    creatChangeMap() {
      let tileControl = new CTMapOl.InnerControl.lib.TileControl(
        {
          mapRef: newMapClass.mapRef,
          tarDomId: "tile-control",
          mapClass: "mapparentclass",
          parentDomId: "mapparent",
        },
        {
          tiles: [
            {
              name: "常规地图",
              imgUrl: require("@/assets/image/common/imgIcon50.png"),
              tileType: "vector",
              mapType: "2D",
            },
            {
              name: "卫星地图",
              imgUrl: "",
              tileType: "satellite",
              mapType: "2D",
            },
          ],
          onTileTypeChange: (mapref, eventtype, tiletype) => {
            //需外部修改
            mapref.viewerStatus.tileType = tiletype;
          },
          onMapTypeChange: (mapref, eventtype, eventobj) => {
            mapref.mapType = eventobj.MapType;
            mapref.viewerStatus.tileType = eventobj.TileType;
            mapref.domId = eventobj.newdomid;
            tileControl._mapRef = mapref;
          },
          beforeMapTypeChange: (mapref, eventtype, eventobj) => {
            return true;
          },
        }
      );
    },
    //返回当前区域总面积
    getTotalArea() {
      let featureList = [
        ...newMapClass.newFeatureList,
        ...newMapClass.oldFeatureList,
      ];
      let areaTotalNum = 0;
      featureList.forEach((item) => {
        if (item.data.regionTypeId == this.regionTypeId) {
          let num = item.area;
          areaTotalNum += Number(num);
        }
      });
      this.$emit("areaTotal", areaTotalNum);
    },
    //创建比例尺和缩放组件
    creatZoomLine() {
      const zoomTool = new CTMapOl.InnerControl.lib.ZoomTool({
        mapRef: newMapClass.mapRef,
        domId: "zoom-tool",
      });
      zoomTool.init();
      zoomTool.mount();
      const scaleLine = new CTMapOl.InnerControl.lib.ScaleLine({
        mapRef: newMapClass.mapRef,
        domId: "scale-line-fixed-width",
      });
      scaleLine.init();
      scaleLine.mount();
    },

    //回显绘制图
    EchoDrawing(data) {
      data.forEach((item) => {
        // 非详情只回显当前区域和湿地区域    详情就全部回显
        if (
          item.data.regionTypeId == this.regionTypeId ||
          item.data.reviewMapName == "湿地区域" ||
          this.currentOperationStatus == "detail"
        ) {
          let marker = this.addMarks(item);
          console.log(44, item);
          //数据没有颜色就给一个默认值，兼容旧数据
          if (!item.data.color) {
            item.data.color = "#1890FF";
          }
          newMapClass.setColor(item.data.color);
          let feature =
            CTMapOl.DataSourceControl.common.addSingleGeometryDataSource(
              {
                mapRef: newMapClass.mapRef,
                geometry: item.geometry,
                geometryType: item.geometryType,
              },
              {
                normalstyle: newMapClass.drawStyleConfig,
                selectlstyle: newMapClass.selectDrawStyleConfig,
                props: {
                  uuid: item.data.uuid,
                  regionTypeId: item.data.regionTypeId,
                },
                zIndex: 100,
                onSelectFunc: (mapRef, type, { geometry, props }) => {
                  if (props.uuid) {
                    newMapClass.selectFeature = feature;
                    newMapClass.selectMarker = marker;
                    newMapClass.selectData = {
                      uuid: props.uuid,
                      regionTypeId: props.regionTypeId,
                    };
                  }
                  newMapClass.drawStyleConfig.closeDraw();
                  newMapClass.mapRef.mapInstance.defaultselecter.condition_ =
                    CTMapOl.events.condition.singleClick;
                },
                onUnselectFunc: (mapRef, type, { geometry, props }) => {
                  this.drawFun();
                  newMapClass.mapRef.mapInstance.defaultselecter.condition_ =
                    CTMapOl.events.condition.platformModifierKeyOnly;
                  newMapClass.selectFeature = null;
                  newMapClass.selectMarker = null;
                  newMapClass.selectData = null;
                },
              }
            );
          newMapClass.mapRef.mapInstance.defaultselecter.condition_ =
            CTMapOl.events.condition.platformModifierKeyOnly;
          newMapClass.addSingleGeometryDataSourceList.push(feature);
          newMapClass.addSingleMarkerDataSourceList.push(marker);
        }
      });
    },

    // 搜索地址
    async remoteMethod(val) {
      let params = {
        keyWord: val,
        pageSize: 10,
        pageNum: 1,
      };
      let res = await CTMapOl.netApi.poiByKeyWord(params);
      if (res.code == 200) {
        this.addressList = res.data.list || [];
      }
    },

    // 改变地图定位地址
    changeAddress(val) {
      if (!val) {
        this.addressList = [];
      } else {
        let data = this.addressList.find((item) => item.alias == val);
        if (data) {
          let location = data.pois[0].location.split(",");
          // 准备新的视图参数
          var newCenter = [Number(location[0]), Number(location[1])]; // 新的中心点经纬度坐标
          var newZoom = 16; // 新的缩放级别
          this.setMapZoom(newZoom, newCenter);
        }
      }
    },

    //设置地图层级及中心点
    setMapZoom(zoom, center) {
      CTMapOl.ViewControl.common.setZoomAndCenter(
        { mapRef: newMapClass.mapRef },
        { zoom, center }
      );
    },

    //销毁地图
    destroyMap() {
      CTMapOl.MapControl.common.destroyMapInstance({
        mapRef: newMapClass.mapRef,
      });
      this.mapConfig.mapShow = false;
      window.newMapClass = null;
    },

    // 改变绘画方式
    changePaitingType() {
      newMapClass.setColor(this.plottingColor);
      newMapClass.drawStyleConfig.closeDraw();
      this.drawFun();
    },

    // 绘制圆形、方形、多边形
    async drawFun() {
      let geometry = null;
      if (this.paintingType == "circle") {
        geometry = await this.drawCircle();
      } else if (this.paintingType == "rectangle") {
        geometry = await this.drawRectangle();
      } else {
        geometry = await this.drawPolygon();
      }
      geometry.data = {
        reviewMapName: this.reviewMapName,
        regionTypeId: this.regionTypeId,
        uuid: new Date().getTime(),
        color: this.plottingColor,
      };
      this.getCenter(geometry, true);
      newMapClass.newFeatureList.push(geometry);
      this.getTotalArea();
      this.EchoDrawing([geometry]);
      this.drawFun();
    }, //绘制多边形

    drawPolygon() {
      return CTMapOl.InteractionControl.common.drawPolygon(
        { mapRef: newMapClass.mapRef },
        newMapClass.drawStyleConfig
      );
    }, // 绘制矩形

    drawRectangle() {
      return CTMapOl.InteractionControl.common.drawRectangle(
        { mapRef: newMapClass.mapRef },
        newMapClass.drawStyleConfig
      );
    }, // 绘制圆形

    drawCircle() {
      return CTMapOl.InteractionControl.common.drawCircle(
        { mapRef: newMapClass.mapRef },
        newMapClass.drawStyleConfig
      );
    },

    // 清空选中的绘制
    clearFun() {
      if (
        newMapClass.selectFeature &&
        newMapClass.selectData.regionTypeId == this.regionTypeId
      ) {
        CTMapOl.DataSourceControl.common.removeSingleDataSource(
          { mapRef: newMapClass.mapRef },
          newMapClass.selectFeature
        );
        CTMapOl.DataSourceControl.common.removeSingleDataSource(
          { mapRef: newMapClass.mapRef },
          newMapClass.selectMarker
        );
        newMapClass.selectFeature = null;
        newMapClass.selectMarker = null;
        this.removeFeature();
      } else {
        iframeSDK({
          iframeOperationId: "message",
          message: "请选择当前类型图形删除!",
        });
      }
    },

    //清空所有的绘制以及标会
    clearAllFun() {
      newMapClass.addSingleGeometryDataSourceList.forEach((item) => {
        CTMapOl.DataSourceControl.common.removeSingleDataSource(
          { mapRef: newMapClass.mapRef },
          item
        );
      });
      newMapClass.addSingleMarkerDataSourceList.forEach((item) => {
        CTMapOl.DataSourceControl.common.removeSingleDataSource(
          { mapRef: newMapClass.mapRef },
          item
        );
      });
    },
    // 获取中心点
    getCenter(feature, emitType) {
      let bbox =
        CTMapOl.SpatialAnalysisControl.common.bboxSingleGeometry(feature).bbox;
      let center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
      if (emitType) {
        this.$emit("centerPoint", center);
      }
      return center;
    },

    //面积换算
    areaCalculation(area) {
      if (this.areaUnit == "亩") {
        return (area / 666.666666667).toFixed(2);
      } else if (this.areaUnit == "公顷") {
        return (area / 10000).toFixed(2);
      } else {
        return (area / 1000000).toFixed(2);
      }
    },

    // 标注信息
    addMarks(feature) {
      let area = this.areaCalculation(feature.area);
      let name = feature.data.reviewMapName
        ? feature.data.reviewMapName + ":"
        : "";
      let center = this.getCenter(feature);
      let marker = CTMapOl.DataSourceControl.common.addSingleMarkerDataSource(
        { mapRef: newMapClass.mapRef, coord: center },
        {
          normalstyle: {
            textstyle: {
              text: `${name}${area}${this.areaUnit}`,
              font: "normal 16px 微软雅黑",
              scale: 1,
              textAlign: "center",
              offset: [0, 0],
              fontstyle: {
                fillColor: "#ffffff",
                fillTransparency: 1,
                strokeColor: "#ffffff",
                strokeWidth: 0,
                strokeTransparency: 0,
              },
              backgroundstyle: {
                fillColor: "#ffffff",
                fillTransparency: 0,
                strokeColor: "#ffffff",
                strokeWidth: 0,
                strokeTransparency: 0,
              },
            },
          },
          selectlstyle: {
            textstyle: {
              text: `${name}${area}km²`,
              font: "normal 16px 微软雅黑",
              scale: 1,
              textAlign: "center",
              offset: [0, 0],
              fontstyle: {
                fillColor: "#ffffff",
                fillTransparency: 1,
                strokeColor: "#ffffff",
                strokeWidth: 0,
                strokeTransparency: 0,
              },
              backgroundstyle: {
                fillColor: "#ffffff",
                fillTransparency: 0,
                strokeColor: "#ffffff",
                strokeWidth: 0,
                strokeTransparency: 0,
              },
            },
          },
          props: { area: area },
          zIndex: 101,
          selectzIndex: 101,
          addToTop: false,
        }
      );
      return marker;
    },

    // 删除图形时删除相应的数据
    removeFeature() {
      newMapClass.oldFeatureList.forEach((item, index) => {
        if (item.data.uuid == newMapClass.selectData.uuid) {
          newMapClass.oldFeatureList.splice(index, 1);
          this.$emit("deleteDraw", newMapClass.selectData);
        }
      });
      newMapClass.newFeatureList.forEach((item, index) => {
        if (item.data.uuid == newMapClass.selectData.uuid) {
          newMapClass.newFeatureList.splice(index, 1);
        }
      });
      this.getTotalArea();
      newMapClass.selectData = null;
    },

    // 返回所有的图形数据
    getGeoJson() {
      let featureList = [
        ...newMapClass.newFeatureList,
        ...newMapClass.oldFeatureList,
      ];
      return featureList.filter((item) => {
        if (item.data.regionTypeId == this.regionTypeId) {
          item.data.color = this.plottingColor;
          console.log(99999, item);
          return item;
        }
      });
    },

    //获取鼠标位置坐标
    getCoordinate() {
      CTMapOl.InteractionControl.common.getCoordByMouseMove(
        { mapRef: newMapClass.mapRef },
        {
          onmousemove: (mapRef, type, { lonlat }) => {
            let coord = [lonlat[0].toFixed(9), lonlat[1].toFixed(9)];
            this.coordinate = coord.join();
          },
        }
      );
    },

    //测距
    rangingFun() {
      CTMapOl.InteractionControl.common.measureDistance(
        newMapClass.mapRef,
        this.rangingConfig
      );
    },

    //改变颜色
    changeColor(val) {
      this.plottingColor = val || "#1890FF";
      this.rangingConfig.lineOptions.strokeColor = this.plottingColor;
      this.filterNowInfo(val, "color");
      this.changePaitingType();
    },

    //查找当前信息下图形数据修改后并删除所有图形后重新绘制
    filterNowInfo(val, type) {
      let featureList = [
        ...newMapClass.newFeatureList,
        ...newMapClass.oldFeatureList,
      ];
      featureList.forEach((item) => {
        // 只修改当前区域下的图形名称
        if (item.data.regionTypeId == this.regionTypeId) {
          if (type) {
            item.data.color = val;
          } else {
            item.data.reviewMapName = val;
          }
        }
      });
      this.clearAllFun();
      if (featureList) {
        this.EchoDrawing(featureList);
      }
    },
  },
  beforeDestroy() {
    this.destroyMap();
  },
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/px-to-rem";
.mapComponent {
  height: px-to-rem(440);
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  .operation_shidi {
    display: flex;
    position: absolute;
    left: px-to-rem(12);
    z-index: 999;
    top: px-to-rem(12);
    align-items: center;
    .iconArea {
      display: flex;
      margin-right: px-to-rem(12);
      ::v-deep .el-input__inner {
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .icon {
        background: #ff6a6c;
        width: 42px;
        border-radius: 0px 4px 4px 0px;
        position: relative;
        color: #fff;
        &::before {
          top: 50%;
          left: 50%;
          position: absolute;
          transform: translate(-50%, -50%);
        }
      }
    }
    .iconImg {
      background: #ffffff;
      width: 40px;
      height: 40px;
      padding: px-to-rem(10);
      margin-left: px-to-rem(12);
      box-sizing: border-box;
      box-shadow: 0px px-to-rem(1) px-to-rem(4) 0px rgba(0, 0, 0, 0.08);
      border-radius: px-to-rem(4);
      cursor: pointer;
    }
    .colorIconImg {
      position: absolute;
      top: px-to-rem(0);
    }
    .colorPick {
      margin-left: px-to-rem(12);
      width: 40px;
      height: 40px;
      opacity: 0;
      ::v-deep .el-color-picker__trigger {
        width: px-to-rem(40);
        height: px-to-rem(40);
      }
    }
    ::v-deep .el-input__inner {
      border: none;
    }
  }
  #map {
    width: 100%;
    height: 100%;
  }
  .tile-control {
    position: absolute;
    left: px-to-rem(12);
    bottom: px-to-rem(50);
    z-index: 1;
  }
  .zoom-tool {
    position: absolute;
    left: px-to-rem(105);
    bottom: px-to-rem(50);
  }
  .scale-line {
    position: absolute;
    left: px-to-rem(12);
    bottom: px-to-rem(12);
  }
  .coordinate {
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    width: px-to-rem(254);
    line-height: px-to-rem(32);
    height: px-to-rem(32);
    border-radius: px-to-rem(4);
    position: absolute;
    right: px-to-rem(12);
    color: #fff;
    bottom: px-to-rem(12);
    z-index: 1;
  }
  // 地图样式
  ::v-deep .ct-mapol-layer-switcher__container {
    display: flex;
  }
  ::v-deep .ct-mapol-scale-line {
    display: inline-table !important;
  }
  ::v-deep .ctmap-union-scale-line {
    display: flex;
    justify-content: center;
  }
  ::v-deep .ctmap-union-scale-line-container {
    width: px-to-rem(113);
  }
}
</style>
<style lang="scss">
@import "~@/assets/styles/px-to-rem";
.colorPicker {
  padding: px-to-rem(12) !important;
  margin-top: px-to-rem(12);
  .el-color-dropdown__btns {
    display: flex;
    justify-content: space-between;
    .el-color-dropdown__btn {
      background-color: #ff6a6c;
      color: #fff;
    }
    .el-button--text {
      display: none;
    }
    .el-button--mini {
      padding: 9px 15px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
.paintClass {
  .el-select-dropdown__list {
    padding: 0;
  }
  .el-select-dropdown__item.hover {
    background: rgba(255, 106, 108, 0.1);
  }
  .option {
    display: flex;
  }
}
</style>
