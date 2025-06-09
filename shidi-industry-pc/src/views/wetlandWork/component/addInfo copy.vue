<template>
  <div class="info scrollBox">
    <el-form ref="form" :rules="rules" :model="formData" label-width="120px">
      <!-- 基本信息 -->
      <div class="baseInfo">
        <info-title :titleName="'基本信息'" />
        <div class="fromMain">
          <el-row>
            <el-col :span="12">
              <el-form-item label="湿地名称" prop="wetlandName" maxlength="50">
                <el-input
                  maxlength="50"
                  placeholder="请输入"
                  v-model="formData.wetlandName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在区域" prop="regionCodeList">
                <el-cascader
                  ref="cascaderAddr"
                  placeholder="请选择"
                  v-model="formData.regionCodeList"
                  :key="timer"
                  :props="regionOption"
                  @change="changeRegion"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="经纬度" prop="latitudeLongitude">
                <el-input
                  placeholder="根据地图画区自动识别中心点"
                  :disabled="true"
                  v-model="formData.latitudeLongitude"
                ></el-input>
                <div class="map-icon" @click="infoMapFunc">
                  <i class="el-icon-location-outline icon-size"></i>
                  <span>地图</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="湿地类型" prop="wetlandTypeList">
                <el-select
                  placeholder="请选择"
                  v-model="formData.wetlandTypeList"
                  multiple
                >
                  <el-option
                    v-for="(item, index) in getWetlandType"
                    :label="item.label"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                class="merge-border"
                label="湿地面积"
                prop="wetlandArea"
              >
                <el-input
                  type="number"
                  class="no-spinners"
                  placeholder="请输入"
                  v-model="formData.wetlandArea"
                  @input="handleInput($event, 20, 'wetlandArea')"
                ></el-input>
                <div class="acreage-info">
                  <el-select
                    class="iconClass"
                    popper-class="addInfoClass"
                    ref="wetlandArea"
                    v-model="formData.areaUnit"
                    @change="
                      unitConversion(
                        $event,
                        formData.wetlandArea,
                        'wetlandArea'
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
            <el-col :span="12">
              <el-form-item label="气候类型" prop="climateTypeList">
                <el-select
                  v-model="formData.climateTypeList"
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in getClimateType"
                    multiple
                    :label="item.label"
                    :value="item.id"
                    :key="index"
                  ></el-option
                ></el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="建立时间" prop="establishmentTime">
                <el-date-picker
                  v-model="formData.establishmentTime"
                  type="year"
                  value-format="yyyy年"
                  format="yyyy年"
                  placeholder="选择年份"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属单位" prop="ownerUnit">
                <el-input
                  v-model="formData.ownerUnit"
                  placeholder="请输入"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="保护级别" prop="protectionLevel">
                <el-select
                  v-model="formData.protectionLevel"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in getLevelType"
                    :label="item.label"
                    :value="item.id"
                    :key="index"
                  ></el-option
                ></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="imgStyle">
              <el-form-item label="图片" prop="imageList" class="imgIcon">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="最多上传5张图片，可上传png/jpg/gif/jpeg格式"
                  placement="top-start"
                >
                  <div class="icon">?</div>
                </el-tooltip>
                <addImgList
                  :fileListArray="formData.imageList"
                  @fileList="fileList"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 区域信息 -->
      <div class="baseInfo">
        <div class="add-info-list">
          <info-title :titleName="'区域信息'" />
          <el-button
            size="small"
            type="danger"
            icon="el-icon-plus"
            @click="editAreaFunc({}, 'newly')"
            >新增</el-button
          >
        </div>

        <div class="fromMain infinite-box">
          <!-- 固定区域 -->
          <el-form-item
            v-for="(element, keys) in getWetlandInfoRegionList"
            :key="keys"
            class="infinite merge-border"
            :label="element.regionName"
          >
            <el-input
              v-model="element.regionArea"
              type="number"
              class="no-spinners"
              placeholder="请输入"
              @input="
                handleInput(
                  $event,
                  20,
                  '',
                  'wetlandInfoRegionList',
                  keys,
                  'regionArea'
                )
              "
            ></el-input>
            <div class="acreage-info">
              <el-select
                class="iconClass"
                popper-class="addInfoClass"
                :ref="'wetlandInfoRegionList' + keys"
                v-model="element.areaUnit"
                @change="
                  unitConversion(
                    $event,
                    element.regionArea,
                    'wetlandInfoRegionList',
                    keys
                  )
                "
              >
                <el-option
                  v-for="(item, index) in getUnitArea"
                  :label="item.label"
                  :value="item.label"
                  :key="keys + '-' + index"
                ></el-option
              ></el-select>
            </div>
            <div class="icon-blue">
              <i
                class="el-icon-edit icon-size"
                @click="editAreaFunc(element, 'edit', keys, true)"
              ></i>
            </div>
          </el-form-item>
          <!-- 新增区域 -->
          <el-form-item
            :class="
              getLabelClass(element)
                ? 'infinite labelHight merge-border'
                : 'infinite merge-border'
            "
            v-for="(element, keys) in areaInfinite"
            :key="element.regionName"
            :label="element.regionName"
          >
            <el-input
              v-model="element.regionArea"
              type="number"
              class="no-spinners"
              placeholder="请输入"
              @input="
                handleInput(
                  $event,
                  20,
                  'newly',
                  'areaInfinite',
                  keys,
                  'regionArea'
                )
              "
            ></el-input>
            <div class="acreage-info">
              <el-select
                class="iconClass"
                popper-class="addInfoClass"
                :ref="'areaInfinite' + keys"
                v-model="element.areaUnit"
                placeholder="请输入"
                @change="
                  unitConversion(
                    $event,
                    element.regionArea,
                    'areaInfinite',
                    keys
                  )
                "
              >
                <el-option
                  v-for="(item, index) in getUnitArea"
                  :label="item.label"
                  :value="item.label"
                  :key="keys + '-' + index"
                ></el-option>
              </el-select>
            </div>
            <div class="icon-blue">
              <span>
                <i
                  class="el-icon-edit icon-size"
                  @click="editAreaFunc(element, 'edit', keys)"
                ></i>
              </span>
              
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="您确认删除此条数据吗？"
                @confirm="deleteByIdRegion(element, keys)"
              >
                <i slot="reference" class="el-icon-delete icon-size"></i>
              </el-popconfirm>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 植被信息 -->
      <div class="baseInfo">
        <div class="add-info-list">
          <info-title :titleName="'植被信息'" />
          <el-button
            size="small"
            type="danger"
            icon="el-icon-plus"
            @click="editVegetationFunc(null, 'newly')"
            >新增</el-button
          >
        </div>
        <div class="fromMain infinite-box">
          <el-form-item
            :class="
              getLabelClass(item)
                ? 'infinite labelHight merge-border'
                : 'infinite merge-border'
            "
            v-for="(item, keys) in vegetationInfinite"
            :key="keys"
            :label="getPlanName(item.vegetationType)"
          >
            <el-input
              v-model="item.vegetationArea"
              type="number"
              class="no-spinners"
              placeholder="请输入"
              @input="
                handleInput(
                  $event,
                  20,
                  'newly',
                  'vegetationInfinite',
                  keys,
                  'vegetationArea'
                )
              "
            ></el-input>
            <div class="acreage-info">
              <el-select
                class="iconClass"
                popper-class="addInfoClass"
                :ref="'vegetationInfinite' + keys"
                v-model="item.areaUnit"
                placeholder="请输入"
                @change="
                  unitConversion(
                    $event,
                    item.vegetationArea,
                    'vegetationInfinite',
                    keys
                  )
                "
              >
                <el-option
                  v-for="(it, idt) in getUnitArea"
                  :label="it.label"
                  :value="it.label"
                  :key="idt + '-' + it"
                ></el-option
              ></el-select>
            </div>
            <div class="icon-blue">
              <span>
                <i
                  class="el-icon-edit icon-size"
                  @click="editVegetationFunc(item, 'edit', keys)"
                ></i>
              </span>
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="您确认删除此条数据吗？"
                @confirm="deleteByIdVegetation(item, keys)"
              >
                <i slot="reference" class="el-icon-delete icon-size"></i>
              </el-popconfirm>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 水文信息 -->
      <div class="baseInfo">
        <info-title :titleName="'水文信息'" />
        <div class="fromMain">
          <el-row>
            <el-col :span="12">
              <el-form-item label="丰水期">
                <el-select v-model="formData.highWaterPeriodList" multiple>
                  <el-option
                    v-for="(item, index) in getMouthType"
                    :label="item.label"
                    :value="item.label"
                    :key="index"
                  ></el-option
                ></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平均水位">
                <el-input
                  class="water-level no-spinners"
                  v-model="formData.averageWaterLevel"
                  :max="20"
                  type="number"
                  placeholder="请输入"
                  @input="handleInput($event, 20, 'averageWaterLevel')"
                ></el-input>
                <div class="fix-span">米</div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="枯水期">
                <el-select v-model="formData.lowWaterPeriodList" multiple>
                  <el-option
                    v-for="(item, index) in getMouthType"
                    :label="item.label"
                    :value="item.label"
                    :key="index"
                  ></el-option
                ></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平均水位">
                <el-input
                  class="water-level no-spinners"
                  :max="20"
                  v-model="formData.averageLowWaterLevel"
                  type="number"
                  placeholder="请输入"
                  @input="handleInput($event, 20, 'averageLowWaterLevel')"
                ></el-input>
                <div class="fix-span">米</div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="平水期">
                <el-select v-model="formData.normalWaterPeriodList" multiple>
                  <el-option
                    v-for="(item, index) in getMouthType"
                    :label="item.label"
                    :value="item.label"
                    :key="index"
                  ></el-option
                ></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平均水位">
                <el-input
                  class="water-level no-spinners"
                  v-model="formData.averageNormalWaterLevel"
                  type="number"
                  placeholder="请输入"
                  @input="handleInput($event, 20, 'averageNormalWaterLevel')"
                ></el-input>
                <div class="fix-span">米</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="btn-list">
      <el-button type="danger" size="small" @click="saveBtn">确定</el-button>
      <el-button size="small" plain @click="dialogVisible.info = true"
        >取消</el-button
      >
    </div>
    <!-- 取消提示 -->
    <ct-dialog
      title="提示"
      :visible.sync="dialogVisible.info"
      width="30%"
      top="30vh"
      custom-class="remindClass"
      class="dialog-header"
    >
      <div class="remind-box">
        <i class="el-icon-warning icon-waring" style=""></i>
        <span>确定取消对已编辑内容进行保存吗？</span>
      </div>
      <div class="dialog-footer">
        <ct-button size="small" type="primary" @click="closeFun"
          >确 定</ct-button
        >
        <ct-button size="small" @click="dialogVisible.info = false"
          >取 消</ct-button
        >
      </div>
    </ct-dialog>
    <!-- 经纬度 -->
    <el-dialog
      :title="'地图'"
      :visible.sync="dialogVisible.infoMap"
      width="50%"
      top="15vh"
      class="infoMapDialog"
    >
      <infoMap
        v-if="dialogVisible.infoMap"
        :infoMapList="infoMapList"
        :mapListAll="getMapList"
        :areaUnitPop="formData.areaUnit"
        :areaGraphPorp="formData.wetlandArea"
        :latitudeLongitudePop="formData.latitudeLongitude"
        @saveTrapezeFunc="saveTrapezeFunc"
        @closeInfoMap="closeInfoMap"
        @infoMapDel="infoMapDel"
      />
      <!-- @areaBack="areaBack" -->
    </el-dialog>
    <!-- 区域编辑页 -->
    <el-dialog
      :title="dialogVisible.title + '区域信息'"
      :visible.sync="dialogVisible.area"
      width="50%"
      top="7vh"
    >
      <area-info
        v-if="dialogVisible.area"
        :unitArea="getUnitArea"
        :mapListAll="getMapList"
        :findNameList="getFindNameList"
        :editAreaData="editAreaData"
        :fixedOption="fixedOption"
        :areaDisabled="areaDisabled"
        :latitudeLongitudePop="formData.latitudeLongitude"
        @areaInfoDelFunc="areaInfoDelFunc"
        @saveAreaList="saveAreaList"
        @closeFormArea="closeInfoMap"
      ></area-info>
    </el-dialog>
    <!-- 植被新增 -->
    <el-dialog
      custom-class="mapDialog"
      :title="dialogVisible.title + '植被信息'"
      :visible.sync="dialogVisible.plotting"
      width="50%"
      top="7vh"
    >
      <map-plotting
        v-if="dialogVisible.plotting"
        :unitArea="getUnitArea"
        :mapListAll="getMapList"
        :editVegetationData="editVegetationData"
        :vegeIndex="vegeIndex"
        :latitudeLongitudePop="formData.latitudeLongitude"
        @plottingInfoDelFunc="plottingInfoDelFunc"
        @savePlottingDataList="savePlottingDataList"
        @closeFormPlotting="closeInfoMap"
      />
    </el-dialog>
  </div>
</template>

<script>
import infoTitle from "../common/infoTitle.vue"; //基础表头
import areaInfo from "../common/areaInfo.vue"; //区域弹框
import mapPlotting from "../common/mapPlotting.vue"; //植被弹框
import addImgList from "../common/addImgList.vue"; //上传组件
import infoMap from "../common/infoMap.vue";
import { infoLogic } from "../logics/info.js";
import { areaListData } from "@/utils/area.js";
import { postMsgUtil,iframeSDK } from "@ct/iframe-connect-sdk";
import { tabelTagLogic } from "../logics/tableTag.js";
export default {
  name: "add-info",
  components: { infoTitle, areaInfo, mapPlotting, addImgList, infoMap },
  props: {
    editData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      originKey: null,
      logic: new infoLogic(),
      tableLogic: new tabelTagLogic(),
      dialogVisible: {
        title: "",
        info: false,
        area: false,
        plotting: false,
        infoMap: false,
      },
      formData: {
        wetlandName: null, //湿地名称
        regionCodeList: [], //所在区域
        regionNameList: [], //所在区域名称
        latitudeLongitude: null, //经纬度
        wetlandTypeList: [], //湿地类型
        wetlandArea: null, //湿地面积
        areaUnit: "亩", //湿地面积单位
        climateTypeList: [], //气候类型
        establishmentTime: null, //建立时间
        protectionLevel: null, //保护级别
        imageList: [], //图片数组
        wetlandInfoRegionList: [
          { regionName: "水域面积", regionArea: null, areaUnit: "亩", srot: 1 },
          {
            regionName: "湿地建筑物",
            regionArea: null,
            areaUnit: "亩",
            srot: 2,
          },
          { regionName: "人类活动", regionArea: null, areaUnit: "亩", srot: 3 },
        ],
        wetlandInfoVegetationList: [],
        highWaterPeriodList: [], //丰水期
        averageWaterLevel: null,
        lowWaterPeriodList: [], //枯水期
        averageLowWaterLevel: null,
        normalWaterPeriodList: [], //平水期
        averageNormalWaterLevel: null,
        mapDataList: [], //湿地地图数据集合
      },
      areaBackData: {}, //区域地图回调数据
      mapList: [], //所有地图
      infoMapList: null, //经纬度地图数据
      rules: {
        wetlandName: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        regionCodeList: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        latitudeLongitude: [
          {
            required: true,
            message: "请输入",
            trigger: "chnage",
          },
        ],
        wetlandTypeList: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        wetlandArea: [
          {
            required: true,
            message: "请输入",
            trigger: "change",
          },
        ],
        climateTypeList: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        establishmentTime: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        protectionLevel: [
          {
            required: true,
            message: "请输入",
            trigger: "change",
          },
        ],
        imageList: [
          {
            type: "array",
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        ownerUnit: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
      areaInfinite: [], //区域信息 新增数组
      vegetationInfinite: [], //植被信息 新增数组
      editAreaData: [], //编辑区域信息
      editVegetationData: null, //编辑植被信息
      pickerOptions: {
        startYear: new Date().getFullYear() - 1000, // 开始年份
        endYear: new Date().getFullYear() + 1000, // 结束年份
      },
      lazyId: 0,
      regionOption: {
        //懒加载区域级联选择器
        checkStrictly: true,
        lazy: true,
        lazyLoad: (node, resolve) => this.lazyLoadData(node, resolve),
      },
      dialogTableVisible: false,
      fixedOption: null, //是否为区域固定数据
      vegeIndex: null, //已有的植物信息下标
      areaDisabled: false, //是否修改区域信息名称
      arrTableData: [],
      uploadFilelist: [], //上传图片接收
      timer: 0,
    };
  },
  computed: {
    getMapList() {
      return this.mapList;
    },
    getAreaList() {
      return this.logic.areaList;
    },
    getWetlandType() {
      return this.logic.wetlandType;
    },
    getUnitArea() {
      return infoLogic.unitArea;
    },
    getClimateType() {
      return this.logic.climateType;
    },
    getLevelType() {
      return this.logic.levelType;
    },
    getMouthType() {
      return this.logic.mouthType;
    },
    getAreaList() {
      return areaListData;
    },
    getAreaInfinite() {
      return this.areaInfinite;
    },
    getWetlandInfoRegionList() {
      return this.formData.wetlandInfoRegionList;
    },
    getFindNameList() {
      const nameList = [
        ...this.formData.wetlandInfoRegionList,
        ...this.areaInfinite,
      ];
      return nameList;
    },
  },
  async mounted() {
    this.originKey = this.getQueryString("originKey");
    this.arrTableData = await this.tableLogic.getTableData();
    if (this.arrTableData.length > 0) {
      this.initData(this.arrTableData[0]);
      this.timer++;
    }
  },
  methods: {
    getLabelClass(data) {
      const labelName = data.regionName
        ? data.regionName
        : Array.isArray(data.vegetationType)
        ? data.vegetationType[1]
        : data.vegetationType.split(";")[1];
      return labelName.length > 7;
    },
    getPlanName(data) {
      return Array.isArray(data) ? data[1] : data.split(";")[1];
    },
    // 关闭
    closeFun() {
      postMsgUtil.trigger(null, "backToOrigin", {
        isClose: true,
        data: { originKey: this.originKey }, //originKey 来源的key
      });
    },

    /**
     * 获取originKey
     */
    getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      return null;
    },

    // 初始化数据
    initData(value) {
      this.formData = JSON.parse(JSON.stringify(value));
      // 处理区域名称列表的分隔符
      this.formData.regionNameList = Array.isArray(this.formData.regionNameList)
        ? this.formData.regionNameList
        : this.formData.regionNameList.split("-");

      this.mapList = this.formData.mapList ? this.formData.mapList : []; //所有数据集合
      this.uploadFilelist = [...this.formData.imageList];

      // 处理区域列表和无限区域
      const { wetlandInfoRegionList } = this.formData;

      this.areaInfinite =
        wetlandInfoRegionList.length > 3 ? wetlandInfoRegionList.slice(3) : [];
      this.formData.wetlandInfoRegionList = wetlandInfoRegionList.slice(0, 3);
      // 设置植被无限列表
      this.vegetationInfinite = this.formData.wetlandInfoVegetationList || [];
    },
    /**
     * 输入值保留两位小数
     */
    handleInput(value, maxLength, type, arrName, index, numback) {
      let inputValue = value ;
      if (inputValue.length > maxLength) {
        inputValue = inputValue.slice(0, maxLength);
      }
      // 使用正则表达式来限制只有两位小数
      const regex = /^(\d+)?(\.\d{1,2})?$/;
      // 如果输入值不符合正则表达式，则将其设置为上一个有效值
      if (arrName) {
        if (type === "newly") {
          this[arrName][index][numback] = regex.test(inputValue)
            ? inputValue
            : inputValue.substring(0, inputValue.length - 1);
        } else {
          this.formData[arrName][index][numback] = regex.test(inputValue)
            ? inputValue
            : inputValue.substring(0, inputValue.length - 1);
        }
      } else {
        this.formData[type] = regex.test(inputValue)
          ? inputValue
          : inputValue.substring(0, inputValue.length - 1);
      }
    },
    /**
     * 单位换算
     * @param {string} presentUnit 现单位
     * @param {number} value 输入值
     * @param {string} type 输入框ref
     * @param {number} index 输入框下标
     */
    unitConversion(presentUnit, value, type, index) {
      let target = null;
      let preValue = "";

      switch (type) {
        case "wetlandArea":
          target = this.formData[type];
          preValue = this.$refs[type].value;
          break;

        case "wetlandInfoRegionList":
          const typeName = type + index;
          target = this.formData[type][index];
          preValue = this.$refs[typeName][0].value;
          break;

        case "areaInfinite":
          const areaTypeName = type + index;
          target = this.areaInfinite[index];
          preValue = this.$refs[areaTypeName][0].value;
          break;

        case "vegetationInfinite":
          const vegetationTypeName = type + index;
          target = this.vegetationInfinite[index];
          preValue = this.$refs[vegetationTypeName][0].value;
          break;

        default:
          // Handle default case if needed
          break;
      }

      if (target) {
        if (type === "vegetationInfinite") {
          target.vegetationArea = infoLogic.areaConverter(
            value,
            presentUnit,
            preValue
          );
        } else if (type === "wetlandArea") {
          // target = this.logic.areaConverter(value, presentUnit, preValue);
          this.formData.wetlandArea = infoLogic.areaConverter(
            value,
            presentUnit,
            preValue
          );
        } else {
          target.regionArea = infoLogic.areaConverter(
            value,
            presentUnit,
            preValue
          );
        }
      }
    },
    /**
     * 经纬度获取弹窗
     */
    infoMapFunc() {
      this.infoMapList = {
        latitudeLongitude: this.formData.latitudeLongitude,
        mapId: this.formData.mapId,
        mapName: this.formData.mapName,
        mapDataList: this.formData.mapDataList,
      };
      this.dialogVisible.infoMap = true;
    },

    /**
     * 省市县 区域名称获取
     */
    changeRegion() {
      this.formData.regionNameList =
        this.$refs["cascaderAddr"].getCheckedNodes()[0].pathLabels;
    },
    /**
     * 关闭弹窗
     */
    closeForm(type) {
      this.$emit("changePage", type);
    },
    /**
     * 图片上传回调
     */
    fileList(data) {
      const arrImg = data.map((item) => item.url);
      this.uploadFilelist = [...arrImg];
    },
    //经纬度地图删除
    infoMapDel(mapChild, uuid) {
      this.mapList = mapChild;
      this.formData.mapDataList = this.formData.mapDataList.filter(
        (element) => {
          return Number(element.mapUuid) !== uuid;
        }
      );
    },
    /**
     * 取消重新赋值源数据
     */
    closeInfoMap(data, sourceList, type) {
      this.dialogVisible.infoMap = false;
      this.dialogVisible.area = false;
      this.dialogVisible.plotting = false;
      this.mapList = data;
      this.closeBack(sourceList, type);
    },
    closeBack(sourceList, type) {
      if (type === "area") {
        const updateMapDataList = (listToUpdate) => {
          listToUpdate.forEach((item) => {
            sourceList.forEach((element) => {
              if (item.regionName === element.mapName) {
                item.mapDataList.push(element);
              }
            });
          });
        };

        updateMapDataList(this.formData.wetlandInfoRegionList);
        updateMapDataList(this.areaInfinite);
      }

      if (type === "plotting") {
        this.vegetationInfinite.forEach((item) => {
          const itemName = item.vegetationType instanceof Array
              ? item.vegetationType[1]
              : item.vegetationType.split(";")[1];
            
            sourceList.forEach((element) => {
              if (itemName === element.mapName) {
                item.mapDataList.push(element);
              }
            });
          });
      }
    },

    //区域地图信息删除
    areaInfoDelFunc(mapChild, uuid) {
      this.mapList = mapChild;

      //删除区域中的某一个地图数据
      this.formData.wetlandInfoRegionList.forEach((element) => {
        const uuidIndex = element.mapDataList
          ? element.mapDataList.findIndex((item) => item.mapUuid == uuid)
          : null;
        if (uuidIndex !== -1 && uuidIndex !== null && uuidIndex !== undefined) {
          // 检查索引是否为 -1，表示找到了匹配的元素
          element.mapDataList.splice(uuidIndex, 1); // 使用 splice 方法来删除元素
        }
      });
      this.areaInfinite.forEach((element) => {
        const uuidIndex =
          element.mapDataList &&
          element.mapDataList.findIndex((item) => item.mapUuid == uuid);
        if (uuidIndex !== -1 && uuidIndex !== null && uuidIndex !== undefined) {
          // 检查索引是否为 -1，表示找到了匹配的元素
          element.mapDataList.splice(uuidIndex, 1); // 使用 splice 方法来删除元素
        }
      });
    },
    //植被区域删除
    plottingInfoDelFunc(mapChild, uuid) {
      this.mapList = mapChild;
      //删除区域中的某一个地图数据
      this.vegetationInfinite.forEach((element) => {
        const uuidIndex =
          element.mapDataList &&
          element.mapDataList.findIndex((item) => item.mapUuid == uuid);
        if (uuidIndex !== -1 && uuidIndex !== null && uuidIndex !== undefined) {
          // 检查索引是否为 -1，表示找到了匹配的元素
          element.mapDataList.splice(uuidIndex, 1); // 使用 splice 方法来删除元素
        }
      });
    },
    /**
     * 经纬度回调
     */
    saveTrapezeFunc(data, areaGraph, unit) {
      //两位小数 正则
     
      this.formData.latitudeLongitude = data.latitudeLongitude;
      this.formData.mapId = data.mapId;
      this.formData.mapName = data.mapName;
      this.formData.mapDataList = data.mapDataList;
      // const regex = /^(\d+)?(\.\d{1,2})?$/;
      //湿地面积保留两位小数
      // this.formData.wetlandArea = regex.test(areaGraph)
      //   ? areaGraph
      //   : areaGraph.substring(0, areaGraph.length - 1);
      this.formData.wetlandArea = areaGraph

      this.formData.areaUnit = unit;
      const saveMapData = data.mapDataList;
      saveMapData.forEach((item) => {
        this.mapList.push(item);
      });
      this.mapList = this.mapList.reduce((acc, current) => {
        let existingItem = acc.find(
          (item) => Number(item.mapUuid) === Number(current.mapUuid)
        );
        if (!existingItem) {
          acc.push(current);
        }
        return acc;
      }, []);
      this.dialogVisible.infoMap = false;
    },
    /**
     * 保存新增区域信息
     * @param {Boolen} type 是否是固定区域
     */
    saveAreaList(data, index, type) {
      this.dialogVisible.area = false;
      if (data !== null) {
        if (index !== null) {
          if (type) {
            data.sort = this.formData.wetlandInfoRegionList[index].sort;
            this.formData.wetlandInfoRegionList[index] = data;
            this.$set(
              this.formData,
              "wetlandInfoRegionList",
              this.formData.wetlandInfoRegionList
            );
          } else {
            this.areaInfinite[index] = data;
          }
        } else {
          this.areaInfinite.push(data);
        }
        const saveMapData = data.mapDataList;
        saveMapData.forEach((item) => {
          this.mapList.push(item);
        });
        this.mapList = this.mapList.reduce((acc, current) => {
          let existingItem = acc.find(
            (item) => Number(item.mapUuid) === Number(current.mapUuid)
          );
          if (!existingItem) {
            acc.push(current);
          }
          return acc;
        }, []);
        this.$forceUpdate();
      }
    },
    /**
     * 保存新增植被信息
     */
    savePlottingDataList(data, index) {
      this.dialogVisible.plotting = false;
      if (data) {
        if (index !== null) {
          this.vegetationInfinite[index] = data;
        } else {
          this.vegetationInfinite.push(data);
        }
        const saveMapData = data.mapDataList;
        saveMapData.forEach((item) => {
          this.mapList.push(item);
        });
        this.mapList = this.mapList.reduce((acc, current) => {
          let existingItem = acc.find(
            (item) => Number(item.mapUuid) === Number(current.mapUuid)
          );
          if (!existingItem) {
            acc.push(current);
          }
          return acc;
        }, []);
      }
    },
    /**
     * 编辑区域信息
     */
    editAreaFunc(item, type, index, disabled) {
      this.dialogVisible.title = type === "edit" ? "编辑" : "新增";
      this.areaDisabled = disabled ? true : false;
      this.fixedOption = index;
      this.editAreaData = JSON.parse(JSON.stringify(item)) ;
      this.dialogVisible.area = true;
    },
    /**
     * 编辑植被信息
     */
    editVegetationFunc(item, type, index) {
      this.dialogVisible.title = type === "edit" ? "编辑" : "新增";
      this.editVegetationData = item ? JSON.parse(JSON.stringify(item)) : null;
      this.vegeIndex = index;
      this.dialogVisible.plotting = true;
    },
    /**
     * 删除区域信息
     */
    async deleteByIdRegion(data, index) {
      // this.areaInfinite.splice(index, 1);
      if (!data.id) {
        this.areaInfinite.splice(index, 1);
        this.mapList = this.mapList.filter((item) => {
          return !data.mapDataList.some(
            (element) => item.mapUuid === element.mapUuid
          );
        });
      } else {
        await this.logic.deleteByIdRegion(data).then(() => {
          this.logic.getTableData().then((res) => {
            this.initData(res[0]);
          });
        });
      }
    },
    /**
     * 删除植被
     */
    async deleteByIdVegetation(data, index) {
      if (!data.id) {
        this.vegetationInfinite.splice(index, 1);
        this.mapList = this.mapList.filter((item) => {
          return !data.mapDataList.some(
            (element) => item.mapUuid === element.mapUuid
          );
        });
      } else {
        await this.logic.deleteByIdVegetation(data).then(() => {
          this.logic.getTableData().then((res) => {
            this.initData(res[0]);
          });
        });
      }
    },
    /**
     * 湿地区域信息懒加载
     */
    async lazyLoadData(node, resolve) {
      const { level } = node;
      let params = {
        areaLevel: node.level + 2,
        areaParentCode: node.data ? node.data.value : null,
      };
      await this.logic.getRegionList(params).then((res) => {
        const nodes = res.map((item) => ({
          value: item.areaCode,
          label: item.areaName,
          leaf: level >= 2,
        }));
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        resolve(nodes);
      });
    },

   

    /**
     * 保存新增接口
     */
    async saveBtn() {
      this.formData.imageList = this.uploadFilelist;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.arrTableData.length > 0) {
            this.editList();
          } else {
            this.addList();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 编辑保存
     */
    async editList() {
      const {
        averageWaterLevel,
        averageLowWaterLevel,
        averageNormalWaterLevel,
        wetlandInfoRegionList,
        regionNameList,
        // wetlandInfoVegetationList,
      } = this.formData;
      this.formData.averageWaterLevel = averageWaterLevel;
      this.formData.averageLowWaterLevel = averageLowWaterLevel;
      this.formData.averageNormalWaterLevel = averageNormalWaterLevel;

      // 区域保存
      const areaAddList = this.areaInfinite.length > 0 ? this.areaInfinite : [];
      this.formData.wetlandInfoRegionList = [
        ...wetlandInfoRegionList,
        ...areaAddList,
      ];

      // 植被保存
      this.formData.wetlandInfoVegetationList = this.vegetationInfinite.forEach(
        (val) => {
          val.vegetationType = Array.isArray(val.vegetationType)
            ? val.vegetationType.join(";")
            : val.vegetationType;
        }
      );
      this.formData.wetlandInfoVegetationList = this.vegetationInfinite || [];
      this.formData.regionNameList = Array.isArray(regionNameList)
        ? regionNameList
        : regionNameList.split("-");

      try {
        await this.logic.editList(this.formData).then((res) => {
          if (res.code == 200) {
            this.logic.messageBox("保存成功~");
          } else {
            this.logic.messageBox(res.msg);
          }
          this.closeFun();
        });
      } catch (error) {
        this.logic.messageBox("抱歉，出现了一些问题，请稍后重试或联系管理员！");
      }
    },
    /**
     * 新增保存
     */
    async addList() {
      try {
        const {
          averageWaterLevel,
          averageLowWaterLevel,
          averageNormalWaterLevel,
          wetlandInfoRegionList,
        } = this.formData;


        this.formData.averageWaterLevel = Number(averageWaterLevel);
        this.formData.averageLowWaterLevel = Number(averageLowWaterLevel);
        this.formData.averageNormalWaterLevel = Number(averageNormalWaterLevel);

        // 区域保存
        const areaAddList =
          this.areaInfinite.length > 0 ? this.areaInfinite : [];
        this.formData.wetlandInfoRegionList = [
          ...wetlandInfoRegionList,
          ...areaAddList,
        ];

        // 植被保存
        this.formData.wetlandInfoVegetationList =
          this.vegetationInfinite.forEach((val) => {
            val.vegetationType = Array.isArray(val.vegetationType)
              ? val.vegetationType.join(";")
              : val.vegetationType;
          });
        this.formData.wetlandInfoVegetationList = this.vegetationInfinite || [];

        await this.logic.addList(this.formData).then((res) => {
          if (res.code == 200) {
            this.logic.messageBox("保存成功~");
          } else {
            this.logic.messageBox(res.msg);
          }
          this.closeFun();
        });
      } catch (error) {
        this.logic.messageBox("抱歉，出现了一些问题，请稍后重试或联系管理员！");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.info {
  width: 100%;
  height: 100%;
  padding: px-to-rem(28) px-to-rem(24) px-to-rem(70) px-to-rem(24);
  overflow: auto;

  .baseInfo {
    width: 100%;
    margin-bottom: px-to-rem(24);
    .title {
      ::v-deep .title-name {
        font-weight: 600;
      }
    }
    .fromMain {
      width: 100%;
      min-height: px-to-rem(100);
      background: #f5f7fa;
      border-radius: px-to-rem(4);
      padding: px-to-rem(18) px-to-rem(32);

      .icon-blue {
        width: px-to-rem(72);
        color: #1890ff;
        font-size: px-to-rem(28);
        margin: 0 px-to-rem(28);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .infinite-box {
      display: flex;
      flex-wrap: wrap;
      .infinite {
        width: 50%;
      }
    }
    .map-icon {
      // width: 12%;
      color: #1890ff;
      margin-left: px-to-rem(12);
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .add-info-list {
      width: 100%;
      display: flex;
      align-items: center;
      margin: px-to-rem(10);
      margin-left: 0;
      .title {
        ::v-deep .title-name {
          font-weight: 600;
        }
      }
    }
  }
  .btn-list {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .fix-span {
    display: block;
    width: 40PX;
    height: 40PX;
    line-height: 40PX;
    color: #909399;
    background: #f5f7fa;
    border-radius: 0 px-to-rem(4) px-to-rem(4) 0;
    border: 1px solid #dcdfe6;
    text-align: center;
    border-left:0;
  }
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
::v-deep .water-level {
  .el-input__inner {
    border-radius: px-to-rem(4) 0px 0px px-to-rem(4);
  }
}
::v-deep .el-form-item {
  margin: px-to-rem(12) 0;
  .el-form-item__content {
    display: flex;
    align-items: center;
    .el-select,
    .el-cascader,
    .el-input {
      flex: 1;
    }
    .ct-date-picker2 {
      flex: 1;
      > div {
        width: 100%;
      }
    }
    .acreage-info {
      width: px-to-rem(120);
    }
  }
}

.remind-box {
  display: flex;
  align-items: center;
  padding: px-to-rem(20);
  .icon-waring {
    color: #ffa940;
    font-size: px-to-rem(32);
  }
}
::v-deep .el-dialog__header {
  display: flex;
  border: 1px solid #ebeef5;
}
.remindClass {
  .dialog-footer {
    padding:px-to-rem(20);
    text-align: right;
    > div {
      margin-left: px-to-rem(12);
    }
  }
}
::v-deep .dialog-header{
  .el-dialog__header{
    border:none
  }
}
::v-deep .el-dialog {
  border-radius: px-to-rem(4);
}
::v-deep .el-dialog__title {
  font-weight: 500;
  color: #303133;
}
.addInfoClass {
  .el-select-dropdown__item.hover {
    background: rgba(255, 106, 108, 0.1);
  }
}

::v-deep .el-dialog__body {
  padding: 0;
}

.imgStyle {
  position: relative;
  .el-form-item {
    ::v-deep .el-form-item__label {
      padding-right: px-to-rem(40);
    }
  }
  .imgIcon {
    .icon {
      position: absolute;
      top: 1.5vh;
      left: -3vh;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 14px;
      background: #ffa940;
    }
  }
}
::v-deep .el-dialog__title {
  font-weight: bold;
}
.no-spinners ::-webkit-outer-spin-button,
.no-spinners ::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinners {
  -moz-appearance: textfield;
}
::v-deep .labelHight {
  > .el-form-item__label {
    line-height: 20PX;
  }
}

::v-deep .iconClass{
  .el-icon-arrow-up:before{
    content:'\e78f'
  }
  .el-input__inner{
    border-left:0;
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
::v-deep .icon-size{
  font-size: px-to-rem(20);
}
</style>
