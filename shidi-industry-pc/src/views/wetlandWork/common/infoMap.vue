<template>
  <div class="info-map">
    <div class="mapArea">
      <mapComponentVue
        ref="ctMapFunc"
        :drawEchoDataProp="getMapDataLst"
        :currentOperationStatus="isCurrent"
        :reviewMapName="'湿地区域'"
        :areaUnit="getAreaUnit"
        :mapColor="mapColor"
        :LatLonCenter="getLatitudeLongitude"
        @areaTotal="areaTotalNumFunc"
        @centerPoint="centerPoint"
        @deleteDraw="deleteDraw"
      />
    </div>
    <div class="btn-list">
      <el-button type="danger" size="small" @click="saveBtn">确定</el-button>
      <el-button size="small" plain @click="closeForm">取消</el-button>
    </div>
  </div>
</template>

<script>
import mapComponentVue from "./mapComponent.vue";
import { infoLogic } from "../logics/info.js";
export default {
  name: "info-map",
  props: {
    titleName: {
      type: String,
      default: "",
    },
    infoMapList: {
      type: Object,
      default: null,
    },
    mapListAll: {
      type: Array,
      default: () => [],
    },
    areaUnitPop: {
      type: String,
      default: "亩",
    },
    mapColor: {
      type: String,
      default: "",
    },
    areaGraphPorp: {
      type: Number | String,
      default: 0,
    },
    latitudeLongitudePop: {
      type: String,
      default: null,
    },
  },
  components: { mapComponentVue },
  data() {
    return {
      trapezeData: {
        latitudeLongitude: "",
        mapDataList: [],
        mapId: "",
        mapName: "湿地面积",
        // mapDataList: [],
      },
      keyTime: new Date().getTime(),
      sourceData: [], //地图源数据
      areaGraph: null,
    };
  },

  computed: {
    isCurrent() {
      return this.infoMapList.mapDataList.length > 0 ? "edit" : "add";
    },
    getLatitudeLongitude() {
      let latitudeLongitude = null;
      console.log(this.latitudeLongitudePop, "this.latitudeLongitudePop");
      if (this.latitudeLongitudePop) {
        latitudeLongitude = this.latitudeLongitudePop.split(",");
      }
      console.log(latitudeLongitude, "latitudeLongitude");
      return latitudeLongitude;
    },
    getAreaUnit() {
      return this.areaUnitPop;
    },
    getMapDataLst() {
      const arrMap =
        this.mapListOperation.length > 0
          ? this.mapListOperation.map((item) => {
              return JSON.parse(item.mapData);
            })
          : this.trapezeData.mapDataList;
          console.log(this.infoMapList,'1111');
          console.log(arrMap,'arrMap');
      if (this.infoMapList) {
        console.log('3333');
        arrMap.forEach((item) => {
          console.log('4444');
          if (item.data.reviewMapName === this.infoMapList.mapName) {
            console.log('55555');
            item.data.color = this.infoMapList.mapColor;
          }
        });
      }
      return arrMap;
    },
    mapListOperation() {
      return this.mapListAll; //赋值所有地图数据
    },
  },
  mounted() {
    this.sourceData = JSON.parse(JSON.stringify(this.mapListAll)); //赋值所有地图数据
    if (this.infoMapList) {
      this.trapezeData = JSON.parse(JSON.stringify(this.infoMapList));
    }
    if (this.areaGraphPorp) {
      this.areaGraph = this.areaGraphPorp;
    }
  },
  methods: {
    /**
     * 回显面积
     */
    areaTotalNumFunc(data) {
      if (data) {
        let mapMetadata = data / 1000000; //地图元数据 m² 转换为 km²
        const areaNumber = infoLogic.areaConverter(
          mapMetadata,
          this.getAreaUnit,
          "km²"
        );
        this.areaGraph = areaNumber;
      } else {
        this.areaGraph = 0;
      }
    },
    /**
     * 经纬度绘制 保留6位小数
     */
    centerPoint(data) {
      this.trapezeData.latitudeLongitude =
        data[0].toFixed(6) + "," + data[1].toFixed(6);
    },
    /**
     * 删除当前地图数据
     */
    deleteDraw(data) {
      const index = this.mapListOperation.findIndex(
        (item) => Number(item.mapUuid) == data.uuid
      );
      if (index !== -1) {
        this.mapListOperation.splice(index, 1);
      }
      //区域地图信息删除回调
      this.$emit("infoMapDel", this.mapListOperation, data.uuid);
    },
    /**
     * 保存经纬度数据
     */
    saveBtn() {
      let mapData = this.$refs.ctMapFunc.getGeoJson();
      const mapColor = this.$refs.ctMapFunc.plottingColor; //获取当前列数据
      this.trapezeData.mapColor = mapColor;
      if (mapData.length > 0) {
        this.trapezeData.mapDataList = [];
        mapData.map((itemMap) => {
          //获取图形id
          const uuid = itemMap ? itemMap.data.uuid : "";
          let arrMap = {
            mapData: itemMap ? JSON.stringify(itemMap) : "",
            mapId: this.keyTime,
            mapName: "湿地区域",
            mapUuid: uuid,
          };
          itemMap && this.trapezeData.mapDataList.push(arrMap);
        });
        //数组去重
        this.trapezeData.mapDataList = this.trapezeData.mapDataList.reduce(
          (acc, current) => {
            let existingItem = acc.find(
              (item) => Number(item.mapUuid) === Number(current.mapUuid)
            );
            if (!existingItem) {
              acc.push(current);
            }
            return acc;
          },
          []
        );
        this.$emit(
          "saveTrapezeFunc",
          this.trapezeData,
          this.areaGraph,
          this.getAreaUnit
        );
      } else {
        this.trapezeData.mapDataList = [];
        this.trapezeData.latitudeLongitude = null;
        this.$emit("saveTrapezeFunc", this.trapezeData, 0, this.getAreaUnit);
      }
      console.log(this.trapezeData, "this.trapezeData");
    },
    closeForm() {
      this.$emit("closeInfoMap", this.sourceData);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.info-map {
  width: 100%;
  height: 100%;
  .mapArea {
    padding: px-to-rem(20) px-to-rem(20) 0 px-to-rem(20);
  }
  .btn-list {
    width: 100%;
    display: flex;
    border-top: 1px solid #ebeef5;
    margin-top: px-to-rem(12);
    padding: px-to-rem(12) px-to-rem(20);
    justify-content: flex-end;
  }
}
</style>
