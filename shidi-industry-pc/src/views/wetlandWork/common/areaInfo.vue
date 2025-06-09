<template>
  <div class="area">
    <el-form
      ref="form"
      class="formClass"
      :rules="rules"
      :model="areaInfoData"
      label-width="85px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类名称" prop="regionName" maxlength="50">
            <el-input
              v-model="areaInfoData.regionName"
              placeholder="请输入分类名称"
              class="region"
              maxlength="12"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积" class="merge-border">
            <el-input
              class="no-spinners"
              type="number"
              placeholder="请输面积"
              v-model="areaInfoData.regionArea"
              @input="handleInput"
            ></el-input>
            <div class="acreage-info">
              <el-select
                class="iconClass"
                popper-class="iconClassPopper"
                ref="areaInfoData"
                v-model="areaInfoData.areaUnit"
                @change="
                  unitConversion(
                    $event,
                    areaInfoData.regionArea,
                    'areaInfoData'
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
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" class="remark-box">
            <el-input
              v-model="areaInfoData.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="100"
              :row="2"
            >
            </el-input>
            <p class="num-film">{{ wordCount }} / 100</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="mapArea">
      <!-- pageType="Wetlands" -->
      <mapComponentVue
        ref="ctMapFunc"
        :drawEchoDataProp="getMapDataLst"
        :reviewMapName="getAreaName"
        :currentOperationStatus="isCurrent"
        :deleteMapNum="deleteMapNum"
        :mapColor="getMapColor"
        :regionTypeId="getRegionTypeId"
        :areaUnit="getAreaUnit"
        :LatLonCenter="getLatitudeLongitude"
        @areaTotal="areaTotalNumFunc"
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
  name: "area-info",
  props: {
    unitArea: {
      type: Array,
      default: () => [],
    },
    editAreaData: {
      type: Object,
      default: null,
    },
    editAreaType: {
      // 区域类型
      type: Number,
      default: 0,
    },
    mapListAll: {
      type: Array,
      default: () => [],
    },
    areaDisabled: {
      type: Boolean,
      default: false,
    },
    findNameList: {
      type: Array,
      default: () => [],
    },
    latitudeLongitudePop: {
      type: String,
      default: null,
    },
    originMaplist: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { mapComponentVue },
  data() {
    return {
      getUnitArea: [
        { label: "亩", id: "1" },
        { label: "公顷", id: "2" },
        { label: "km²", id: "3" },
      ],
      areaInfoData: {
        remark: "",
        regionName: null,
        regionArea: null,
        id: new Date().getTime(),
        areaUnit: "亩",
        mapDataList: [],
        updateOrNew: 0, //是否为新增数据
      },
      sourceData: [], //地图源数据
      deletedArr: [], //已删除的地图数组
      rules: {
        regionName: {
          // message: "请输入",
          // trigger: "blur",
          required: true,
          validator: this.customValidator,
          trigger: "blur",
        },
      },
      current: "add",
      deleteMapNum: 0, //删除标记
      keyTime: new Date().getTime(),
    };
  },
  computed: {
    getMapColor() {
      console.log(this.editAreaData, "this.editAreaData=====");
      return this.editAreaData.mapColor;
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
    wordCount() {
      return this.areaInfoData.remark ? this.areaInfoData.remark.length : 0;
    },
    //标绘名称
    getAreaName() {
      return this.areaInfoData.regionName;
    },
    //标绘单位
    getAreaUnit() {
      return this.areaInfoData.areaUnit;
    },
    // 当前地图类型id
    getRegionTypeId() {
      const id =
        this.editAreaData.mapDataList &&
        this.editAreaData.mapDataList.length > 0
          ? this.editAreaData.mapDataList[0].mapId
          : this.keyTime;
      return Number(id);
    },
    mapListOperation() {
      return this.mapListAll; //赋值所有地图数据
    },
    isCurrent() {
      return this.editAreaData &&
        this.editAreaData.mapDataList &&
        this.editAreaData.mapDataList.length > 0
        ? "edit"
        : "add";
    },
    getMapDataLst() {
      const arrMap =
        this.mapListOperation.length > 0
          ? this.mapListOperation.map((item) => {
              return JSON.parse(item.mapData) || "";
            })
          : this.areaInfoData.mapDataList;

      arrMap.forEach((item) => {
        if (item.data.regionTypeId === Number(this.editAreaData.id)) {
          item.data.color = this.editAreaData.mapColor;
        }
      });
      return arrMap;
    },
  },
  mounted() {
    if (this.editAreaData) {
      console.log(this.editAreaData, "this.editAreaData===");
      this.areaInfoData = Object.assign(
        {},
        this.areaInfoData,
        this.editAreaData
      );
    }
    this.sourceData = JSON.parse(JSON.stringify(this.mapListAll)); //赋值所有地图数据
  },
  methods: {
    customValidator(rule, value, callback) {
      if (value === null || value === undefined || value.trim() === "") {
        callback(new Error("请输入分类名称！"));
        return;
      }
      console.log(this.editAreaData,this.editAreaData.regionName,value,'this.areaInfoData.regionName====');
      // 如果是编辑状态
      if (Object.keys(this.editAreaData).length > 0) {
        // 当前值为传入值时 不验证 否则验证是否有重复值
        if(this.editAreaData.regionName && this.editAreaData.regionName === value){
          callback();
          return;
        }
      }
      console.log('新增');
      // 新增状态，检查是否存在相同的区域名称
      if (this.findNameList && this.findNameList.length > 0) {
        const nameExists = this.findNameList.some(
          (item) => item.regionName === value
        );
        if (nameExists) {
          callback(new Error("区域名称不能相同！"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },

    /**
     * 输入值保留两位小数
     */
    handleInput(value) {
      // 使用正则表达式来限制只有两位小数
      const regex = /^(\d+)?(\.\d{1,2})?$/;
      // 如果输入值不符合正则表达式，则将其设置为上一个有效值
      if (!regex.test(value)) {
        this.areaInfoData.regionArea = this.areaInfoData.regionArea.substring(
          0,
          value.length - 1
        );
      }
    },
    /**
     * 单位换算
     * @param {string} presentUnit 现单位
     * @param {number} value 输入值
     * @param {string} type 输入框ref
     */
    unitConversion(presentUnit, value, type) {
      if (value) {
        let preValue = "";
        preValue = this.$refs[type].value;
        this.areaInfoData.regionArea = infoLogic.areaConverter(
          value,
          presentUnit,
          preValue
        );
      }
    },
    /**
     * 回显面积
     */
    areaTotalNumFunc(data) {
      let mapMetadata = data / 1000000; //地图元数据 m² 转换为 km²
      const areaNumber = infoLogic.areaConverter(
        mapMetadata,
        this.areaInfoData.areaUnit,
        "km²"
      );
      this.$set(this.areaInfoData, "regionArea", areaNumber);
    },
    /**
     * 删除当前地图数据
     */
    deleteDraw(data) {
      const index = this.mapListOperation.findIndex(
        (item) => Number(item.mapUuid) === data.uuid
      );
      if (index !== -1) {
        let deletedItems = this.mapListOperation.splice(index, 1);
        this.deletedArr.push(deletedItems[0]);
      }
      //区域地图信息删除回调
      this.$emit(
        "areaInfoDelFunc",
        this.mapListOperation,
        data,
        this.editAreaType
      );
    },
    closeForm() {
      this.$emit("closeFormArea", this.sourceData, this.deletedArr, "area");
    },
    saveBtn() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let mapData = this.$refs.ctMapFunc.getGeoJson();
        const mapColor = this.$refs.ctMapFunc.plottingColor; //获取当前列数据
        this.areaInfoData.mapColor = mapColor;
        console.log("赋值操作001", this.areaInfoData.mapColor);
        if (mapData.length > 0) {
          let uniqueMapDataList = [];
          console.log(77777,mapData)
          mapData.forEach((itemMap) => {
            const uuid = itemMap ? itemMap.data.uuid : "";
            let arrMap = {
              mapData: itemMap ? JSON.stringify(itemMap) : "",
              mapId: this.getRegionTypeId,
              mapName: this.getAreaName,
              mapUuid: uuid,
            };
            uniqueMapDataList.push(arrMap);
          });
          // 数组去重
          this.areaInfoData.mapDataList = this.uniqueByUuid(uniqueMapDataList);
        } else {
          this.areaInfoData.mapDataList = [];
        }
        // 是否为新增数据 updateOrNew 0-编辑数据 1-新增数据
        // this.areaInfoData.updateOrNew = this.areaDisabled ? 0 : 1;
        const newType = this.originMaplist.find(
          (item) => item.mapId === this.areaInfoData.id
        );
        this.areaInfoData.updateOrNew = newType ? 0 : 1;
        console.log("赋值操作002", this.areaInfoData);
        this.$emit("saveAreaList", this.areaInfoData, this.editAreaType);
      });
    },

    uniqueByUuid(arr) {
      return arr.reduce((acc, current) => {
        let existingItem = acc.find(
          (item) => Number(item.mapUuid) === Number(current.mapUuid)
        );
        if (!existingItem) {
          acc.push(current);
        }
        return acc;
      }, []);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.area {
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
  .remark-box {
    position: relative;
    ::v-deep .el-textarea__inner{
      font-family:'common-iconfont' !important;
      padding-left:15PX !important
    }
    .num-film {
      position: absolute;
      right: 2%;
      bottom: 0;
    }
  }
}
::v-deep .el-form-item {
  margin-bottom: px-to-rem(22) !important;
}
.no-spinners ::-webkit-outer-spin-button,
.no-spinners ::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinners {
  -moz-appearance: textfield;
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
<style lang="scss">
  .iconClassPopper{
    .el-select-dropdown__list{
      padding:0
    }
  }
</style>
