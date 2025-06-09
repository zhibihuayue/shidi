<template>
  <div class="mapPlotting">
    <el-form
      ref="form"
      :rules="rules"
      class="formClass"
      :model="plottingData"
      label-width="85px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="植被类型" prop="vegetationType" maxlength="50">
            <el-cascader
              popper-class="cascaderClass"
              v-model="plottingData.vegetationType"
              :options="getPlottingArr"
              @change="plottingMapFunc"
              placeholder="请选择植被类型"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积" class="merge-border">
            <el-input
              class="no-spinners"
              type="number"
              placeholder="请输入面积"
              v-model="plottingData.vegetationArea"
              @input="handleInput"
            ></el-input>
            <div class="acreage-info">
              <el-select
                class="iconClass"
                ref="vegetationArea"
                v-model="plottingData.areaUnit"
                @change="
                  unitConversion(
                    $event,
                    plottingData.vegetationArea,
                    'vegetationArea'
                  )
                "
              >
                <el-option
                  v-for="(item, index) in getUnitArea"
                  :label="item.label"
                  :value="item.label"
                  :key="index"
                ></el-option
              ></el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="mapArea">
      <mapComponentVue
        ref="ctMapFunc"
        :reviewMapName="getVegetationName"
        :drawEchoDataProp="getMapDataLst"
        :currentOperationStatus="isCurrent"
        :regionTypeId="getRegionTypeId"
        :mapColor="plottingData.mapColor"
        :areaUnit="getAreaUnit"
        :LatLonCenter="getLatitudeLongitude"
        @deleteDraw="deleteDraw"
        @areaTotal="areaTotalNumFunc"
      />
    </div>

    <div class="btn-list">
      <el-button type="danger" size="small" @click="saveBtn">确定</el-button>
      <el-button size="small" plain @click="closeForm">取消</el-button>
    </div>
  </div>
</template>

<script>
import { PlottingArr } from "./config.js";
import { infoLogic } from "../logics/info.js";
import mapComponentVue from "./mapComponent.vue";
export default {
  name: "map-plotting",
  props: {
    unitArea: {
      type: Array,
      default: () => [],
    },
    editVegetationData: {
      type: Object,
      default: null,
    },
    mapListAll: {
      type: Array,
      default: () => [],
    },
    vegeIndex: {
      type: Number,
      default: null,
    },
    latitudeLongitudePop: {
      type: String,
      default: null,
    },
  },
  components: { mapComponentVue },
  data() {
    return {
      rules: {
        vegetationType: [
          { required: true, message: "请选择分类名称", trigger: "change" },
        ],
      },
      plottingData: {
        vegetationType: null,
        vegetationArea: null,
        sort: new Date().getTime(),
        areaUnit: "亩",
        mapDataList: [],
      },
      keyTime: new Date().getTime(),
      rules: {
        vegetationType: {
          required: true,
          message: "请输入",
          trigger: "blur",
        },
      },
      sourceData: [], //地图源数据
      deletedArr: [], //已删除的地图数组
    };
  },
  computed: {
    getLatitudeLongitude() {
      let latitudeLongitude = null;
      console.log(this.latitudeLongitudePop, "this.latitudeLongitudePop");
      if (this.latitudeLongitudePop) {
        latitudeLongitude = this.latitudeLongitudePop.split(",");
      }
      console.log(latitudeLongitude, "latitudeLongitude");
      return latitudeLongitude;
    },
    // 当前地图类型id
    getRegionTypeId() {
      const id =
        this.editVegetationData &&
        this.editVegetationData.mapDataList &&
        this.editVegetationData.mapDataList.length > 0
          ? this.editVegetationData.mapDataList[0].mapId
          : this.keyTime;
      return Number(id);
    },
    getVegetationName() {
      const nameData = Array.isArray(this.plottingData.vegetationType)
        ? this.plottingData.vegetationType[1]
        : this.plottingData.vegetationType;
      return nameData;
    },
    mapListOperation() {
      return this.mapListAll; //赋值所有地图数据
    },
    getPlottingArr() {
      return PlottingArr;
    },
    isCurrent() {
      return this.editVegetationData &&
        this.editVegetationData.mapDataList &&
        this.editVegetationData.mapDataList.length > 0
        ? "edit"
        : "add";
    },
    getUnitArea() {
      return infoLogic.unitArea;
    },
    //标绘单位
    getAreaUnit() {
      return this.plottingData.areaUnit;
    },
    getMapDataLst() {
      const arrMap =
        this.mapListOperation && this.mapListOperation.length > 0
          ? this.mapListOperation.map((item) => {
              return JSON.parse(item.mapData) || "";
            })
          : this.plottingData.mapDataList;
      console.log(arrMap, "===1111arrMap");
      console.log(this.editVegetationData, "===222");
      if (this.editVegetationData) {
        arrMap.forEach((item) => {
          if (item.data.regionTypeId === Number(this.editVegetationData.sort)) {
            item.data.color = this.editVegetationData.mapColor;
          }
        });
      }

      console.log(arrMap, "===333arrMap");
      return arrMap;
    },
  },
  mounted() {
    this.sourceData = JSON.parse(JSON.stringify(this.mapListAll)); //赋值所有地图数据
    if (this.editVegetationData) {
      this.plottingData = Object.assign(
        {},
        this.plottingData,
        this.editVegetationData
      );
      this.plottingData.vegetationType = Array.isArray(
        this.plottingData.vegetationType
      )
        ? this.plottingData.vegetationType
        : this.plottingData.vegetationType.split(";");
    }
  },
  methods: {
    /**
     * 输入值保留两位小数
     */
    handleInput(value) {
      // 使用正则表达式来限制只有两位小数
      const regex = /^(\d+)?(\.\d{1,2})?$/;
      // 如果输入值不符合正则表达式，则将其设置为上一个有效值
      if (!regex.test(value)) {
        this.plottingData.vegetationArea =
          this.plottingData.vegetationArea.substring(0, value.length - 1);
      }
    },
    /**
     * 单位换算
     * @param {string} presentUnit 现单位
     * @param {number} value 输入值
     * @param {string} type 输入框ref
     */
    unitConversion(presentUnit, value, type) {
      // let target = null;
      // target = this.formData[type];
      let preValue = "";
      preValue = this.$refs[type].value;
      this.plottingData.vegetationArea = infoLogic.areaConverter(
        value,
        presentUnit,
        preValue
      );
    },
    closeForm() {
      this.$emit(
        "closeFormPlotting",
        this.sourceData,
        this.deletedArr,
        "plotting"
      );
    },
    /**
     * 回显名字
     */
    plottingMapFunc(data) {
      this.reviewMapName = data;
    },
    /**
     * 回显面积
     */
    areaTotalNumFunc(data) {
      let mapMetadata = data / 1000000; //地图元数据 m² 转换为 km²
      const areaNumber = infoLogic.areaConverter(
        mapMetadata,
        this.plottingData.areaUnit,
        "km²"
      );
      this.$set(this.plottingData, "vegetationArea", areaNumber);
      // this.$set(this.plottingData, "vegetationArea", data.toFixed(2));
      // this.$set(this.plottingData, "areaUnit", "km²");
    },
    /**
     * 删除当前地图数据
     */
    deleteDraw(data) {
      const index = this.mapListOperation.findIndex(
        (item) => Number(item.mapUuid) == data.uuid
      );
      if (index !== -1) {
        let deletedItems = this.mapListOperation.splice(index, 1);
        this.deletedArr.push(deletedItems[0]);
      }
      //区域地图信息删除回调
      this.$emit("plottingInfoDelFunc", this.mapListOperation, data.uuid);
    },
    saveBtn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let geoJsonData = this.$refs.ctMapFunc.getGeoJson();

          const mapColor = this.$refs.ctMapFunc.plottingColor; //获取当前列数据
          this.plottingData.mapColor = mapColor;

          if (geoJsonData.length > 0) {
            this.plottingData.mapDataList = geoJsonData.map((itemMap) => {
              const uuid = itemMap ? itemMap.data.uuid : "";
              return {
                mapData: itemMap ? JSON.stringify(itemMap) : "",
                mapId: this.getRegionTypeId,
                mapName: this.getVegetationName,
                mapUuid: uuid,
              };
            });

            // 数组去重
            this.plottingData.mapDataList =
              this.plottingData.mapDataList.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => Number(t.mapUuid) === Number(item.mapUuid)
                  )
              );
          } else {
            this.plottingData.mapDataList = [];
          }
          console.log(this.plottingData, "this.plottingData");
          this.$emit("savePlottingDataList", this.plottingData, this.vegeIndex);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.mapPlotting {
  width: 100%;
  .formClass {
    padding: px-to-rem(10) px-to-rem(20) 0 px-to-rem(20);
  }
  .mapArea {
    padding: 0 px-to-rem(20);
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
.cascaderClass {
  .el-cascader-node.in-active-path {
    background: rgba(255, 106, 108, 0.1);
  }
  .el-cascader-node.is-active {
    background: rgba(255, 106, 108, 0.1);
  }
}
.no-spinners ::-webkit-outer-spin-button,
.no-spinners ::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinners {
  -moz-appearance: textfield;
}
::v-deep .el-form-item {
  margin-bottom: px-to-rem(30) !important;
}
::v-deep .merge-border {
  .el-form-item__content {
    > div {
      &:nth-child(1) {
        input {
          border-radius: 4px 0 0 4px;
        }
      }
      &:nth-child(2) {
        input {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
}
::v-deep .iconClass {
  .el-input__inner {
    border-left: 0;
    &:focus {
      border-color: #bfbfbf;
    }
  }
  .is-focus {
    .el-input__inner {
      border-color: #bfbfbf !important;
    }
  }
}
</style>
