<template>
  <div class="info scrollBox">
    <el-form ref="form" :rules="getRules" :model="formData" label-width="120px">
      <!-- 基本信息 -->
      <div class="baseInfo">
        <info-title :titleName="'基本信息'" />
        <div class="fromMain">
          <el-row>
            <el-col :span="12">
              <el-form-item label="湿地名称" prop="wetlandName" maxlength="50">
                <el-input
                  maxlength="50"
                  placeholder="请输入湿地名称"
                  v-model="formData.wetlandName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在区域" prop="regionCodeList">
                <el-cascader
                  ref="cascaderAddr"
                  placeholder="请选择所在区域"
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
                  placeholder="根据地图划区自动识别中心点"
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
                  placeholder="请选择湿地类型"
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
                  placeholder="请输入湿地面积"
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
                  placeholder="请选择气候类型"
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
                  placeholder="请选择建立年份"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属单位" prop="ownerUnit">
                <el-input
                  v-model="formData.ownerUnit"
                  placeholder="请输入所属单位"
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
                  placeholder="请选择保护级别"
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
      <!-- 区域 -->
      <div
        class="baseInfo"
        v-for="(item, index) in areaMapListTop"
        :key="item.type"
      >
        <div class="add-info-list">
          <info-title :titleName="item.name" />
          <el-button
            size="small"
            type="danger"
            icon="el-icon-plus"
            @click="editAreaFunc({}, 'newly', item.listType)"
            >新增</el-button
          >
        </div>

        <div class="fromMain infinite-box">
          <!-- 新增区域 -->
          <el-form-item
            :class="
              getLabelClass(element)
                ? 'infinite labelHight merge-border'
                : 'infinite merge-border'
            "
            v-for="(element, keys) in item.childrenMap"
            :key="element.regionName + keys"
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
                  item.type,
                  keys,
                  'regionArea',
                  index
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
                    keys,
                    item.type
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
                  @click="editAreaFunc(element, 'edit', item.listType)"
                ></i>
              </span>

              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="您确认删除此条数据吗？"
                @confirm="deleteByIdRegion(element, keys, item.listType)"
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

      <!-- 水域 建筑 人类活动信息 -->
      <div
        class="baseInfo"
        v-for="(item, index) in areaMapListBottom"
        :key="item.type"
      >
        <div class="add-info-list">
          <info-title :titleName="item.name" />
          <el-button
            size="small"
            type="danger"
            icon="el-icon-plus"
            @click="editAreaFunc({}, 'newly', item.listType)"
            >新增</el-button
          >
        </div>

        <div class="fromMain infinite-box">
          <!-- 新增区域 -->
          <el-form-item
            :class="
              getLabelClass(element)
                ? 'infinite labelHight merge-border'
                : 'infinite merge-border'
            "
            v-for="(element, keys) in item.childrenMap"
            :key="element.regionName + keys"
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
                  item.type,
                  keys,
                  'regionArea',
                  index+1
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
                    keys,
                    item.type
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
                  @click="editAreaFunc(element, 'edit', item.listType)"
                ></i>
              </span>

              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="您确认删除此条数据吗？"
                @confirm="deleteByIdRegion(element, keys, item.listType)"
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
                  placeholder="请输入平均水位"
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
                  placeholder="请输入平均水位"
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
                  placeholder="请输入平均水位"
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
      :before-close="()=>handleClose('infoMapRef')"
    >
      <infoMap
        ref="infoMapRef"
        v-if="dialogVisible.infoMap"
        :infoMapList="infoMapList"
        :mapListAll="getMapList"
        :areaUnitPop="formData.areaUnit"
        :mapColor="formData.mapColor"
        :areaGraphPorp="formData.wetlandArea"
        :latitudeLongitudePop="formData.latitudeLongitude"
        @saveTrapezeFunc="saveTrapezeFunc"
        @closeInfoMap="closeInfoMap"
        @infoMapDel="infoMapDel"
      />
    </el-dialog>
    <!-- 区域新增编辑页 -->
    <el-dialog
      :title="dialogVisible.title"
      :visible.sync="dialogVisible.area"
      :close-on-click-modal="false"
      width="50%"
      top="7vh"
      :before-close="()=>handleClose('areaInfoRef')"
    >
      <area-info
        ref="areaInfoRef"
        v-if="dialogVisible.area"
        :unitArea="getUnitArea"
        :mapListAll="getMapList"
        :findNameList="getFindNameList"
        :editAreaData="editAreaData"
        :editAreaType="editAreaType"
        :areaDisabled="areaDisabled"
        :latitudeLongitudePop="formData.latitudeLongitude"
        :originMaplist="formData.mapList"
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
      :close-on-click-modal="false"
      width="50%"
      top="7vh"
      :before-close="()=>handleClose('plottingRef')"
    >
      <map-plotting
        ref="plottingRef"
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
// import { areaListData } from "@/utils/area.js";
import { postMsgUtil, iframeSDK } from "@ct/iframe-connect-sdk";
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
        regionList: [], //区域
        waterRegionList: [], //水域
        constructionRegionList: [], //建筑
        humanActivitiesRegionList: [], //人类
        wetlandInfoVegetationList: [], //植被
        highWaterPeriodList: [], //丰水期
        averageWaterLevel: null,
        lowWaterPeriodList: [], //枯水期
        averageLowWaterLevel: null,
        normalWaterPeriodList: [], //平水期
        averageNormalWaterLevel: null,
        mapDataList: [], //湿地地图数据集合
        mapList: [],
        deleteRegionIdList: [], // 区域信息删除id集合
      },
      areaBackData: {}, //区域地图回调数据
      mapList: [], //所有地图
      infoMapList: null, //经纬度地图数据
      areaInfinite: [], //区域信息 新增数组
      areaMapList: [
        //操作数组
        {
          type: "regionList",
          name: "区域信息",
          listType: 3,
          childrenMap: [],
        },
        {
          type: "waterRegionList",
          name: "水域信息",
          listType: 0,
          childrenMap: [],
        },
        {
          type: "constructionRegionList",
          name: "建筑信息",
          listType: 1,
          childrenMap: [],
        },
        {
          type: "humanActivitiesRegionList",
          name: "人类活动信息",
          listType: 2,
          childrenMap: [],
        },
      ],
      vegetationInfinite: [], //植被信息 新增数组
      editAreaData: [], //编辑区域信息
      editAreaType: null, //编辑区域类型
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
      vegeIndex: null, //已有的植物信息下标
      areaDisabled: false, //是否是新增
      arrTableData: [],
      uploadFilelist: [], //上传图片接收
      timer: 0,
    };
  },
  computed: {
    getRules() {
      return this.logic.rules;
    },
    getMapList() {
      return this.mapList;
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
    getFindNameList() {
      let nameList = [
        ...this.formData.regionList,
        ...this.formData.waterRegionList,
        ...this.formData.constructionRegionList,
        ...this.formData.humanActivitiesRegionList,
      ];
  
      const areaMap = this.areaMapList.reduce((acc, item) => {
        if (item.childrenMap.length > 0) {
          acc.push(...item.childrenMap);
        }
        return acc;
      }, []);
      nameList = [
        ...nameList,
        ...areaMap,
      ]
      return nameList;
    },
    // 因为要按照设计图的顺序，所以将areaMapList进行了分割
    areaMapListTop() {
      return this.areaMapList.filter((item, index) => index === 0 )
    },
    areaMapListBottom() {
      return this.areaMapList.filter((item, index) => index > 0 )
    }
  },
  created(){
    document.documentElement.style.setProperty('font-size', '100px')
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
      console.log(this.originKey, "this.originKey ====++++");
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
      // this.formData = JSON.parse(JSON.stringify(value));
      this.formData = {...this.formData,...value}
      this.formData.deleteRegionIdList = [];
      // 处理所在区域名称列表的分隔符
      this.formData.regionNameList = Array.isArray(this.formData.regionNameList)
        ? this.formData.regionNameList
        : this.formData.regionNameList.split("-");

      this.mapList = this.formData.mapList
        ? JSON.parse(JSON.stringify(this.formData.mapList))
        : []; //所有数据集合
      this.uploadFilelist = [...this.formData.imageList];

      // 设置区域、水域、建筑物、人类活动 无限列表
      const formMap = {
        regionList: this.formData.regionList || [],
        waterRegionList: this.formData.waterRegionList || [],
        constructionRegionList: this.formData.constructionRegionList || [],
        humanActivitiesRegionList: this.formData.humanActivitiesRegionList || [],
      };
      this.areaMapList.forEach((item) => {
        item.childrenMap = formMap[item.type];
      });
      // 设置植被无限列表
      this.vegetationInfinite = this.formData.wetlandInfoVegetationList || [];
    },
    /**
     * 输入值保留两位小数
     */
    handleInput(value, maxLength, type, arrName, index, numback, reginIndex) { 
      let inputValue = value;
      if (inputValue.length > maxLength) {
        inputValue = inputValue.slice(0, maxLength);
      }
      // 使用正则表达式来限制只有两位小数
      const regex = /^(\d+)?(\.\d{1,2})?$/;

      // 如果输入值不符合正则表达式，则将其设置为上一个有效值
      if (arrName) {
        this.assignmentFun(type,inputValue,arrName,index, numback, reginIndex,regex)
      } else {
        this.formData[type] = regex.test(inputValue)
          ? inputValue
          : inputValue.substring(0, inputValue.length - 1);
      }
    },

    // 赋值函数(用于输入值保留两位小数)
    assignmentFun(type,inputValue,arrName,index, numback, reginIndex,regex){
      if (type === "newly") {
        const regTestData = regex.test(inputValue)
          ? inputValue
          : inputValue.substring(0, inputValue.length - 1);
        if (numback === "regionArea") {
          this.areaMapList[reginIndex].childrenMap[index][numback] =
            regTestData;
        } else {
          this[arrName][index][numback] = regTestData;
        }
      } else {
        this.formData[arrName][index][numback] = regex.test(inputValue)
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
     * @param {number} listType 区域类型
     */
    unitConversion(presentUnit, value, type, index, listType) {
      let target = null;
      let preValue = "";
      // 查找操作
      switch (type) {
        case "wetlandArea":
          target = this.formData[type];
          preValue = this.$refs[type].value;
          break;
        case "areaInfinite":
          const areaTypeName = type + index;
          // target = this.areaInfinite[index];
          const areaTypeList = this.areaMapList.find(
            (item) => item.type === listType
          );
          target = areaTypeList.childrenMap[index];
          preValue = this.$refs[areaTypeName][0].value;
          break;

        case "vegetationInfinite":
          const vegetationTypeName = type + index;
          target = this.vegetationInfinite[index];
          preValue = this.$refs[vegetationTypeName][0].value;
          break;

        default:
          break;
      }
      //赋值操作
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
        mapColor: this.formData.mapColor,
        mapName: "湿地区域",
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

    // 弹窗关闭
    handleClose(refName){
      this.$refs[refName].closeForm()
    },
    
    /**
     * 取消重新赋值源数据
     */
    closeInfoMap(data, sourceList, type) {
      for (const key in this.dialogVisible) {
        this.dialogVisible[key] = false;
      }
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
          const itemName =
            item.vegetationType instanceof Array
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

    //区域 水域 建筑 人类 地图信息删除
    areaInfoDelFunc(mapChild, data, type) {
      this.mapList = mapChild; // 更新mapList

      // 查找区域类型
      const areListMap = this.areaMapList.find(
        (item) => item.listType === type
      );
      // 查找区域下的某条数据
      const mapdata = areListMap.childrenMap.find(
        (item) => item.id === data.regionTypeId
      );

      if (!mapdata) {
        console.error("未找到对应的区域数据");
        return;
      }
      const uuidIndex = mapdata.mapDataList.findIndex(
        (item) => item.mapUuid === data.uuid
      );
      if (uuidIndex !== -1) {
        mapdata.mapDataList.splice(uuidIndex, 1);
      }
    },

    //植被区域地图删除
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
      this.formData.wetlandArea = areaGraph;
      this.formData.areaUnit = unit;
      this.formData.mapColor = data.mapColor;

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
     * @param {Boolen} type 区域类型
     */
    saveAreaList(data, type) {
      console.log("赋值操作003", data);
      this.dialogVisible.area = false;
      if (data !== null) {
        this.areaMapList.forEach((item) => {
          if (item.listType === type) {
            data.regionType = type;
            const mapfindList = item.childrenMap.findIndex(
              (value) => value.id === data.id
            );

            if (mapfindList !== -1) {
              item.childrenMap[mapfindList] = data;
            } else {
              item.childrenMap.push(data);
            }
          }
        });
        console.log("赋值操作004", this.areaMapList);
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
        console.log(this.mapList, "赋值操作005");
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
     * 新增编辑区域信息
     */
    editAreaFunc(item, isAdd, type) {
      const dialogNameMap = {
        0: "水域信息",
        1: "建筑信息",
        2: "人类活动信息",
        3: "区域信息",
      };
      this.dialogVisible.title =
        isAdd === "edit"
          ? `编辑${dialogNameMap[type]}`
          : `新增${dialogNameMap[type]}`;
      this.areaDisabled = isAdd == "edit" ? true : false;
      this.editAreaData = item ? JSON.parse(JSON.stringify(item)) : null;
      this.editAreaType = type;
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
    async deleteByIdRegion(data, index, type) {
      const findDelId = this.formData.mapList.some(
        (item) => item.mapId == data.id
      );
      // 查找哪个区域
      const areaInfo_ = this.areaMapList.find((item) => item.listType === type);
      areaInfo_.childrenMap.splice(index, 1);
      this.mapList = this.mapList.filter((item) => {
        return !data.mapDataList.some(
          (element) => item.mapUuid === element.mapUuid
        );
      });
      if (findDelId) {
        this.formData.deleteRegionIdList.push(data.id);
      }
      // else {
      // await this.logic.deleteByIdRegion(data).then((res) => {
      //   if (res.code === 200) {
      //     this.logic.messageBox("删除成功！");
      //   } else {
      //     this.logic.messageBox("删除失败");
      //   }
      //   this.logic.getTableData().then((res) => {
      //     this.initData(res[0]);
      //   });
      // });
      // }
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
        // await this.logic.deleteByIdVegetation(data).then((res) => {
        //   if (res.code === 200) {
        //     this.logic.messageBox("删除成功！");
        //   } else {
        //     this.logic.messageBox("删除失败");
        //   }
        //   this.logic.getTableData().then((res) => {
        //     this.initData(res[0]);
        //   });
        // });
        try {  
          const deleteResponse = await this.logic.deleteByIdVegetation(data);  
          if (deleteResponse.code === 200) {  
            this.logic.messageBox("删除成功！");  
          } else {  
            this.logic.messageBox("删除失败");  
          }  
          const tableDataResponse = await this.logic.getTableData();  
          this.initData(tableDataResponse[0]);  
        } catch (error) {  
          this.logic.messageBox("抱歉，出现了一些问题，请稍后重试或联系管理员！");
        }  
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
        regionNameList,
        // wetlandInfoRegionList,
        // wetlandInfoVegetationList,
      } = this.formData;
      this.formData.averageWaterLevel = Number(averageWaterLevel);
      this.formData.averageLowWaterLevel = Number(averageLowWaterLevel);
      this.formData.averageNormalWaterLevel = Number(averageNormalWaterLevel);
      // 区域保存
      // const areaAddList = this.areaInfinite.length > 0 ? this.areaInfinite : [];
      // this.formData.wetlandInfoRegionList = [
      //   ...wetlandInfoRegionList,
      //   ...areaAddList,
      // ];
      this.formData.constructionRegionList = this.areaMapList[0].childrenMap;
      this.formData.humanActivitiesRegionList = this.areaMapList[1].childrenMap;
      this.formData.regionList = this.areaMapList[2].childrenMap;
      this.formData.waterRegionList = this.areaMapList[3].childrenMap;
      this.mapData(this.formData.constructionRegionList);
      this.mapData(this.formData.humanActivitiesRegionList);
      this.mapData(this.formData.regionList);
      this.mapData(this.formData.waterRegionList);
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
            this.closeFun();
          } else {
            this.logic.messageBox(res.msg);
            this.logic.getTableData().then((_res) => {
              this.initData(_res[0]);
            });
          }
        });
      } catch (error) {
        this.logic.messageBox("抱歉，出现了一些问题，请稍后重试或联系管理员！");
      }
    },
    // 对item进行updateOrNew赋值
    mapData(arr) {
      arr &&
        arr.map((item) => (item.updateOrNew = item.updateOrNew == 1 ? 1 : 0));
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
          // wetlandInfoRegionList,
        } = this.formData;

        this.formData.averageWaterLevel = Number(averageWaterLevel);
        this.formData.averageLowWaterLevel = Number(averageLowWaterLevel);
        this.formData.averageNormalWaterLevel = Number(averageNormalWaterLevel);

        // 区域保存
        // const areaAddList =
        //   this.areaInfinite.length > 0 ? this.areaInfinite : [];
        // this.formData.wetlandInfoRegionList = [
        //   ...wetlandInfoRegionList,
        //   ...areaAddList,
        // ];
        this.formData.constructionRegionList = this.areaMapList[0].childrenMap;
        this.formData.humanActivitiesRegionList =
          this.areaMapList[1].childrenMap;
        this.formData.regionList = this.areaMapList[2].childrenMap;
        this.formData.waterRegionList = this.areaMapList[3].childrenMap;
        // 植被保存
        this.formData.wetlandInfoVegetationList =
          this.vegetationInfinite.forEach((val) => {
            val.vegetationType = Array.isArray(val.vegetationType)
              ? val.vegetationType.join(";")
              : val.vegetationType;
          });
        this.formData.wetlandInfoVegetationList = this.vegetationInfinite || [];
        //  await this.logic.addList(this.formData).then((res) => {
        //   if (res.code == 200) {
        //     this.logic.messageBox("保存成功~");
        //     this.closeFun();
        //   } else {
        //     this.logic.messageBox(res.msg);
        //     this.logic.getTableData().then((res) => {
        //       this.initData(res[0]);
        //     });
        //   }
        // });
        const res = await this.logic.addList(this.formData);
        if (res.code === 200) {
          this.logic.messageBox("保存成功~");
          this.closeFun();
        } else {
          this.logic.messageBox(res.msg);
          const tableData = await this.logic.getTableData();
          this.initData(tableData[0]);
        }
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
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #909399;
    background: #f5f7fa;
    border-radius: 0 px-to-rem(4) px-to-rem(4) 0;
    border: 1px solid #dcdfe6;
    text-align: center;
    border-left: 0;
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
    padding: px-to-rem(20);
    text-align: right;
    > div {
      margin-left: px-to-rem(12);
    }
  }
}
::v-deep .dialog-header {
  .el-dialog__header {
    border: none;
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
      top: 1.2vh;
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
    line-height: 20px;
  }
}

::v-deep .iconClass {
  .el-icon-arrow-up:before {
    content: "\e78f";
  }
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
::v-deep .icon-size {
  font-size: px-to-rem(20);
}
</style>
