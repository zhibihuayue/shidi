<!--
  湿地林草展示
-->
<template>
  <div v-show="loaded" class="wetland-homePage">
    <!-- 上右下左的阴影 -->
    <div class="p-top"></div>
    <div class="p-right"></div>
    <div class="p-bottom"></div>
    <div class="p-left"></div>
    <!-- 地图 -->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-map']"
      mapToolElement=".wetland-homePage .maptooltele"
      chooseMapMemoryKey="wetlandChooseMap"
      :config="components['common-comp-map']"
      :mapId="mapId"
    />

    <div class="maptooltele" />

    <!-- logo -->
    <div class="logoBox">
      <i />
    </div>

    <!-- 工具箱-->
      <RemoteComponentSyncLoader
        v-if="components['common-comp-tool-box']"
        class="toolBox_S"
        :toolsList="toolsList"
        :customLayers="customLayers"
        :configItems="configItems"
        :config="components['common-comp-tool-box']"
        :mapId="mapId"
        alarmFilteTeleport=".wetland-homePage"
        configItemMemoryNameMenu="wetlandHomePageSettingMenu"
        configItemMemoryNameMap="wetlandHomePageSettingMap"
      />

      <!-- 物种图鉴统计 -->
      <div class="ecological" v-if="topBarActive == 1">
        <!-- 病虫害预测 -->
        <RemoteComponentSyncLoader
          v-if="components['common-comp-diseasesPests']"
          :config="components['common-comp-diseasesPests']"
          :mapId="mapId"
          :resizeY="20"
          :resizeX="paramsWidth"
        />
      </div>

    <!-- 湿地资源统计详情弹窗 -->
    <div class="resourceDetail" v-if="resourceDetailShow">
      <vue-drag-resize :isResizable="false" class="dragResize" ref="dragResize" :z='101' :w="0" :h="0" :y="0">
          <detailPop  ref="detailPop" @closeDetail="closeDetail" :detailData="detailData"/>
      </vue-drag-resize>
    </div>

    <!-- 告警弹窗大字版-->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-alarm-detail-large']"
      class="dalarmdetail"
      memoryNameMap="wetlandHomePageSettingMap"
      :config="components['common-comp-alarm-detail-large']"
      :mapId="mapId"
    />

    <!--喇叭圈选-->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-horn-circle-selection']"
      :config="components['common-comp-horn-circle-selection']"
      :mapId="mapId"
      :line-position="{right:472,top:334}"
      :dialog-position="{right:472,top:45}"
    />

    <!-- 告警弹窗专业版-->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-alarm-detail']"
      class="dalarmdetail"
      configItemMemoryNameMap="wetlandHomePageSettingMap"
      excludeToolbar="['alarmToCase']"
      :config="components['common-comp-alarm-detail']"
      :mapId="mapId"
    />

    <!-- 地块详情组件 -->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-spot-detail']"
      :mapId="mapId"
      :unitAreaPropArr="['area']"
      :isShowFooter="false"
      :config="components['common-comp-spot-detail']"
      from="commonToolBoxLayer"
    />

    <!-- 指点飞行组件 -->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-guide-flight']"
      :mapId="mapId"
      class="guideFlight"
      :right="470"
      :rightEnd="470"
      :config="components['common-comp-guide-flight']"
    />

    <!-- 火势蔓延 -->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-tool-fire-prediction']"
      :config="components['common-comp-tool-fire-prediction']"
      :mapId="mapId"
      :top="44"
      :right="465"
    />

    <!-- 周边分析 -->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-around-analysis']"
      class="aroundanalysis"
      :config="components['common-comp-around-analysis']"
      :mapId="mapId"
    />

    <!-- 底部功能 -->
    <RemoteComponentSyncLoader
      v-if="components['common-comp-footer']"
      class="common-comp-footer"
      :defaultKeys="defaultToolKeys"
      menuConfigMemoryName="wetlandHomePageSettingMenu"
      treeSortMemoryName="wetlandHomePageMenuSort"
      :config="components['common-comp-footer']"
      :mapId="mapId"
    />

    <!-- 底部功能相对应的组件 -->
    <div class="tree-wrapper">
      <RemoteComponentSyncLoader
        v-if="components['common-comp-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-tree']"
        :mapId="mapId"
        :isHaveWarningList="false"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-iot-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-iot-tree']"
        :mapId="mapId"
        :isHaveWarningList="false"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-radar-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-radar-tree']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-horn-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-horn-tree']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-uav-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-uav-tree']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-source-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-source-tree']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-grid-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-grid-tree']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-grid-operator-tree']"
        :class="['dtreebox']"
        :config="components['common-comp-grid-operator-tree']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-tree-recorder']"
        :class="['dtreebox']"
        :config="components['common-comp-tree-recorder']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-track-popup']"
        :class="['dtreebox']"
        :config="components['common-comp-track-popup']"
        :mapId="mapId"
        :isHaveWarningList="false"
      />
    </div>

    <!-- 顶部状态切换栏（目前4个） -->
    <div class="top-type-bar">
      <div
        v-for="item in topTypeBarList"
        :key="item.value"
        :class="['tab_items', topBarActive == item.value && 'active']"
        @click="onTopbarActive(item.value)"
      >
        <img
          v-show="topBarActive == item.value"
          :src="require(`@/assets/image/common/imgIcon${item.value}_s.png`)"
        >
        <img
          v-show="topBarActive != item.value"
          :src="require(`@/assets/image/common/imgIcon${item.value}.png`)"
        >
        <span class="title">{{ item.label }}</span>
      </div>
    </div>


    <!-- 左边模块 -->
    <div class="left-wrapper">
      <!-- 共用组件 （天气、地图搜索）-->
      <RemoteComponentSyncLoader
        v-if="components['common-comp-weather']"
        :config="components['common-comp-weather']"
        :mapId="mapId"
      />
      <RemoteComponentSyncLoader
        v-if="components['common-comp-search-map']"
        class="spacingClass"
        toolBoxMemoryName="wetlandHomePageSettingMap"
        :config="components['common-comp-search-map']"
        :mapId="mapId"
      />

      <!-- 基本情况 -->
      <div v-if="topBarActive == 0">
        <!-- 湿地基础信息 -->
        <wetlandFoundation class="spacingClass" />
        <!-- 湿地资源 -->
        <resourceStatistics class="spacingClass" @selectOption="selectOption" ref="resourceStat"/>
        <!--设备信息 -->
        <deviceInformation class="spacingClass" />
      </div>

      <!-- 物种图鉴 -->
      <div>
        <div class="wildlife" v-if="topBarActive == 1">
          <RemoteComponentSyncLoader
            v-if="components['common-comp-wildlife-level-statistics']"
            canExpand
            headTitle="物种总览"
            class="spacingClass"
            :config="components['common-comp-wildlife-level-statistics']"
            :mapId="mapId"
            @cardexpand="cardexpandOverview"
          />
        </div>

        <!--  -->
        <div v-show="topBarActive == 1">
          <RemoteComponentSyncLoader
            v-if="components['common-comp-species-picture']"
            isOpen
            :width="370"
            headTitle="物种图片"
            :height="cardexpandOverviewType ? 346 : 686"
            class="spacingClass"
            :config="components['common-comp-species-picture']"
            :mapId="mapId"
          />
        </div>
      </div>

      <!-- 鸟类栖息 -->
      <div v-if="topBarActive == 2" class="bird-left 1" :key="2">
        <!-- 鸟类栖息地分析 -->
        <RemoteComponentSyncLoader
            v-if="components['common-comp-birdHabitatAnalysis']"
            :config="components['common-comp-birdHabitatAnalysis']"
            :mapId="mapId"
          />
      </div>

      <!-- 湿地动态 -->
      <div v-if="topBarActive == 3" class="bird-left 2" :key="3">
        <!-- 气候统计分析 -->
          <RemoteComponentSyncLoader
            v-if="components['common-comp-climateStatistics']"
            :config="components['common-comp-climateStatistics']"
            :mapId="mapId"
          />

        <!-- 景观格局特征 -->
        <RemoteComponentSyncLoader
            v-if="components['common-comp-landscapeFeatures']"
            :config="components['common-comp-landscapeFeatures']"
            :mapId="mapId"
          />
      </div>
    </div>

    <!-- 右边模块 -->
    <div class="right-wrapper">
      <!-- 基本情况 -->
      <div v-show="topBarActive == 0" class="envir-right">
        <div class="wildlife">
          <!-- 湿地卡口 -->
          <RemoteComponentSyncLoader
            v-if="components['common-comp-forest-gateway-camera']"
            headTitle="湿地卡口"
            subtitle="湿地卡口"
            class="gatewayCamerass"
            :config="components['common-comp-forest-gateway-camera']"
            :mapId="mapId"
          />
        </div>
        <div class="wildlife snap">
          <!-- 实时抓拍 -->
          <RemoteComponentSyncLoader
            v-if="components['common-comp-snap-list']"
            headTitle="实时抓拍"
            class="spacingClass"
            :class="[cardexpandType ? 'snapListTrue' : 'snapListFalse']"
            :config="components['common-comp-snap-list']"
            :mapId="mapId"
            @cardexpand="cardexpand"
          />
        </div>
      </div>

      <!-- 物种图鉴 -->
      <div v-show="topBarActive == 1" class="envir-right">
        <treeTotal @isHandShow="isHandShow" />
        <RemoteComponentSyncLoader
          v-if="components['common-comp-trap-collect-log']"
          :isOpen="true"
          :width="370"
          :height="isHandShowStatus ? 583 : 893"
          class="spacingClass_img"
          :config="components['common-comp-trap-collect-log']"
          :mapId="mapId"
        />
      </div>

      <!-- 鸟类栖息 -->
      <div v-if="topBarActive == 2" class="envir-right">
        <!-- 鸟类声纹采集设备 -->
         <RemoteComponentSyncLoader
          v-if="components['common-comp-wildlife-bird-camera']"
          :config="components['common-comp-wildlife-bird-camera']"
          :mapId="mapId"
        />
      </div>

      <!-- 湿地生态 -->
      <div v-if="topBarActive == 3" class="envir-right"  key='ecosystem'>
        <!-- 生态系统变化 -->
         <RemoteComponentSyncLoader
          v-if="components['common-comp-ecosystemChanges']"
          :config="components['common-comp-ecosystemChanges']"
          :mapId="mapId"
        />
      </div>
    </div>
  </div>
</template>
<script>
import RemoteComponentSyncLoader from '@ct/remote-page-sync-loader/remote-page-sync-loader.umd.js'
import treeTotal from './environment/treeTotal'
// import climatic from './module/basic/birdHabitat/climatic.vue' //分析
// import landscapePatternCharacteristics from "./module/basic/landscapePatternCharacteristics"
// import ecosystemChanges from "./module/basic/ecosystemChanges"
import { getInfo, getFisUrl, getBusinessFilesAsync } from '@/utils/index.js'
import deviceInformation from '@/views/module/basic/deviceInformation.vue'
import resourceStatistics from '@/views/module/basic/resourceStatistics/resourceStatistics.vue'
import wetlandFoundation from '@/views/module/basic/wetlandFoundation.vue'
import realTimeCapture from '@/views/module/basic/realTimeCapture.vue'
import checkpoint from '@/views/module/basic/checkpoint.vue'
import { parseQueryString } from '@/common/parse-qs.js'
import insectPest from "@/views/module/basic/insectPest/index.vue"
// import birdHabitatAnalysis from './module/basic/birdHabitat/birdHabitatAnalysis.vue'
// import insectPestLegend from '@/views/module/basic/insectPest/module/legend.vue'
// import insectPestDetailsPopup from '@/views/module/basic/insectPest/module/detailsPopup.vue'
import detailPop from "@/views/module/basic/resourceStatistics/detailPop.vue"

let themeIndex = 0

// 使用到的远程组件定义
// key是组件内部名称，应当与uniqueId指代的具体组件完全对应，用于维护者自己区分和填写在RemoteComponentSyncLoader内
const remoteComp = {
  // "common-comp-ecosystemChanges": { uniqueId: "2025041547554", version: "1.7.63" }, //生态系统变化
  // "common-comp-birdHabitatAnalysis": { uniqueId: "2025041538628", version: "1.7.50" }, //鸟类栖息地分析
  // "common-comp-diseasesPests": { uniqueId: "2025040940360", version: "1.7.58" }, // 病虫害预测
  // "common-comp-climateStatistics": { uniqueId: "2025041523326", version: "1.7.48" }, //气候统计分析
  // "common-comp-landscapeFeatures": { uniqueId: "2025041557919", version: "1.7.46" }, //景观格局特征
  // "common-comp-wildlife-bird-camera": { uniqueId: "2025041552572", version: "1.7.54" }, //鸟类声纹

  "common-comp-ecosystemChanges": { uniqueId: "2025041547554", version: "1.7.40" }, //生态系统变化
  "common-comp-birdHabitatAnalysis": { uniqueId: "2025041538628", version: "1.7.40" }, //鸟类栖息地分析
  "common-comp-diseasesPests": { uniqueId: "2025040940360", version: "1.7.40" }, // 病虫害预测
  "common-comp-climateStatistics": { uniqueId: "2025041523326", version: "1.7.40" }, //气候统计分析
  "common-comp-landscapeFeatures": { uniqueId: "2025041557919", version: "1.7.40" }, //景观格局特征
  "common-comp-wildlife-bird-camera": { uniqueId: "2025041552572", version: "1.7.40" }, //鸟类声纹

  "common-comp-tool-fire-prediction": { uniqueId: "2024080914073", version: "1.7.40" }, //火势蔓延
  "common-comp-map": { uniqueId: "2024042465120", version: "1.7.30" },
  "common-comp-tool-box": { uniqueId: "2024042422835", version: "1.7.30" }, //工具箱
  "common-comp-around-analysis": {
    //周边分析
    uniqueId: "2024042467840",
    version: "1.7.20",
  },
  'common-comp-footer': { uniqueId: '2024042461157', version: '1.7.00' }, // 底部菜单栏1.6.90

  "common-comp-alarm-detail": { uniqueId: "2024042421530", version: "1.7.40" }, //专业版

  "common-comp-alarm-detail-large": {
    uniqueId: "2024072609683",
    version: "1.7.35",
  }, //大字版  //测试环境：2024070498952   生产环境：2024072609683

  "common-comp-guide-flight": { uniqueId: "2025012119577", version: "1.7.20" }, //指点飞行组件

  "common-comp-tree": { uniqueId: "2024042483471", version: "1.7.20" }, //摄像机列表
  "common-comp-iot-tree": { uniqueId: "2024042457412", version: "1.7.20" }, //物联设备列表组件
  "common-comp-radar-tree": { uniqueId: "2024042467191", version: "1.7.00" }, //雷达列表组件
  "common-comp-horn-tree": { uniqueId: "2024042488249", version: "1.7.00" }, //大喇叭列表组件
  "common-comp-uav-tree": { uniqueId: "2024042495052", version: "1.7.25" }, //无人机列表组件
  "common-comp-source-tree": { uniqueId: "2024042494149", version: "1.7.10" }, //资源
  "common-comp-grid-tree": { uniqueId: "2024042446567", version: "1.6.90" }, //网格
  "common-comp-grid-operator-tree": {
    //网格员
    uniqueId: "2024042477521",
    version: "1.6.90",
  },
  'common-comp-track-popup': { uniqueId: '2024042449828', version: '1.7.00' }, // 轨迹组件
  'common-comp-tree-recorder': { uniqueId: '2024052417174', version: '1.7.00' }, // 执法记录仪列表组件

  'common-comp-search-map': { uniqueId: '2024042419919', version: '1.6.90' }, // 地图查询组件

  'common-comp-species-picture': {
    // 物种图片
    uniqueId: '2024072693855',
    version: '1.7.00'  
  }, // 测试环境：2024070281791   生产环境：2024072693855

  'common-comp-trap-collect-log': {
    // 诱捕器
    uniqueId: '2024072652353',
    version: '1.7.20'
  }, // 测试环境：2024070222700  生产环境：2024072652353

  'common-comp-weather': { uniqueId: '2024051192375', version: '1.7.25' }, // 天气
  'common-comp-alarm-today-old': {
    // 今日告警
    uniqueId: '2024052438772',
    version: '1.7.10'
  },
  'common-comp-wildlife-level-statistics': {
    // 野生动物
    uniqueId: '2024062151894',
    version: '1.6.90'
  },

  'common-comp-snap-list': { uniqueId: '2024072684936', version: '1.7.00' }, // 实时抓拍 测试环境：2024070237109  生产环境：2024072684936

  'common-comp-forest-gateway-camera': {
    uniqueId: '2024072660943',
    version: '1.6.90'
  }, // 卡扣 测试环境：2024070205466  生产环境：2024072660943

  "common-comp-spot-detail": {
    uniqueId: "2024050987353",
    version: "1.7.00",
  },

  'common-comp-horn-circle-selection': { uniqueId: '2024102219578', version: '1.7.10' } //喇叭圈选
};

export default {
  name: 'RemoteComponentLayout',
  components: {
    RemoteComponentSyncLoader,
    wetlandFoundation,
    resourceStatistics,
    deviceInformation,
    insectPest,
    treeTotal,
    realTimeCapture,
    checkpoint,
    // climatic,
    // landscapePatternCharacteristics,
    // ecosystemChanges,
    // birdHabitatAnalysis,
    // insectPestLegend,
    // insectPestDetailsPopup,
    detailPop
  },
  data() {
    return {
      loaded: false,
      resourceDetailShow:false,
      detailData:null,
      components: {},
      mapId: 'wetland-map',
      // 林业没有雷达，配置图层选项
      customLayers: [
        1, 3, 4, 5, 11, 6, 7, 8, 9, 10, 18, 12, 16, 17, 27, 13, 14, 15
      ],
      defaultToolKeys: [1, 3, 4, 5, 6, 7, 8, 11], // 底部菜单栏的默认值
      configItems: [
        "摄像机",
        "物联设备",
        "无人机",
        "喇叭",
        "执法记录仪",
        "资源",
        "网格",
        "网格员"
      ],
      // 工具箱开启的功能列表
      toolsList: [
        {
          key: 'mapControl'
        },
        {
          key: 'smallTools'
        },
        {
          key: 'lookHere'
        },
        {
          key: 'aroundAnalyse'
        },
        {
          key: 'layersControl'
        },
        {
          key: 'cameraFilte'
        },
        {
          key: 'alarmFilte'
        },
        {
          key:"HornCircleSelect"
        },
        {
          key: "settings"
        }
      ],
      topTypeBarList: [
        { label: '基本情况', value: 0 },
        { label: '物种图鉴', value: 1 },
        { label: '鸟类栖息', value: 2 },
        { label: '湿地生态', value: 3 },
      ],
      topBarActive:  sessionStorage.getItem('topBarActive') || 0, // 顶部状态切换栏 存在本地用做记忆
      cardexpandType: true, // 实时抓拍伸缩状态
      cardexpandOverviewType: true, // 物种总览伸缩状态
      isHandShowStatus: true,
      isPageRefreshed: false// 判断是否是刷新页面
    }
  },
  computed:{
    paramsWidth(){
      let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
      return 830 * clientWidth / 1920
    }
  },
  created() {
    const qsObj = parseQueryString(window.location.search)
    sessionStorage.setItem('VIEW_ID', qsObj.viewId)
  },
  async mounted() {
    // 监听窗口尺寸变化的函数
    window.addEventListener('resize', ()=>{
      this.popVideoPostion()
    })
    this.popVideoPostion()
    await getInfo()
    const { data } = await getFisUrl()
    const { configValue } = data || {}
    const { components, loaded } = await this.getRemoteComps(
      configValue,
      getBusinessFilesAsync
    )
    console.log(99999,Object.keys(components))
    this.components = components
    this.loaded = loaded
    this.changeTheme()
    // this.isload()
  },
  methods: {
    // 控制工具箱-看这里-视频弹窗的位置
    popVideoPostion(){
      window._remoteMetadata = window._remoteMetadata || {}
      const videoPositionRight = (window.innerHeight / 1028) * 525 - 25
      window._remoteMetadata.videoPositionRight = videoPositionRight
    },

    // 判断是否为登录
    isload(){
      const token = sessionStorage.getItem('Admin-Token')
      const historyToken = sessionStorage.getItem('historyToken')
      // 表示重新登陆了
      if (historyToken !== token) {
        console.log('&&&&&&, isPageRefreshed, 切换页面时清楚了')
        this.clearTimeDataInLocalStorage()
        sessionStorage.setItem('historyToken', token)
      }
      this.isPageRefreshed = true
    },

    // 所有时间数据都以 'date_' 开头
    clearTimeDataInLocalStorage() {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i)
        if (key.startsWith('date_')) {
          sessionStorage.removeItem(key)
        }
      }
    },

    // 湿地资源统计点击详情
    selectOption(item){
      this.resourceDetailShow=true
      if(this.$refs.detailPop){
        this.$refs.detailPop.clearFun()
      }
      this.detailData=item
    },

    //关闭详情
    closeDetail(){
      this.$refs.resourceStat.reset()
      this.detailData=null
      this.resourceDetailShow=false
    },

    isHandShow(val) {
      this.isHandShowStatus = val
    },

    // 切换基础信息和物种图鉴、鸟类栖息
    onTopbarActive(index) {
      this.topBarActive=index
      this.cardexpandType = true
      this.cardexpandOverviewType = true
      this.resourceDetailShow=false
      sessionStorage.setItem('topBarActive', index)
    },

    // 获取配置组件
    async getRemoteComps(configValue, callback) {
      const param = {
        components: Object.values(remoteComp)
      }
      const { components, loaded } = await callback(configValue, param)
      return { components, loaded }
    },

    // 获取主题
    changeTheme() {
      if (themeIndex === 0) {
        document.documentElement.setAttribute('data-theme', `theme-aquamarine`)
        this.$globalEventBus.$emit('data-theme', 'theme-aquamarine')
      }
      if (themeIndex === 1) {
        document.documentElement.setAttribute('data-theme', `theme-terracotta`)
        this.$globalEventBus.$emit('data-theme', 'theme-terracotta')
      }
      if (themeIndex === 2) {
        document.documentElement.setAttribute('data-theme', `theme-wiseblue`)
        this.$globalEventBus.$emit('data-theme', 'theme-wiseblue')
      }

      if (themeIndex >= 2) {
        themeIndex = 0
        return
      }
      themeIndex += 1
    },

    // 实时抓拍伸缩切换
    cardexpand(val) {
      this.cardexpandType = val
    },

    // 物种总览伸缩切换
    cardexpandOverview(val) {
      this.cardexpandOverviewType = !this.cardexpandOverviewType
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.wetland-homePage {
  position: relative;
  width: 100%;
  height: 100%;
  ::v-deep .el-checkbox__inner::after {
    left: 0 !important;
  }

  // 上右下左的阴影
  .p-top{
    width: 100%;
    height: 1.5rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
    background:linear-gradient(180deg, #00131e, rgba(0, 19, 30, .35), rgba(0, 19, 30, 0));
  }
  .p-bottom{
    width: 100%;
    height: 1.36rem;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
    background:linear-gradient(0deg, #00131e, rgba(0, 19, 30, .35), rgba(0, 19, 30, 0))
  }
  .p-right{
    position: absolute;
    width: 4.04rem;
    height: 10.29rem;
    top: 0;
    right: 0;
    z-index: 1;
    padding: .34rem .24rem .36rem 0;
    pointer-events: none;
    background: linear-gradient(270deg, #00131e, rgba(0, 19, 30, .35), rgba(0, 19, 30, 0));
  }
  .p-left{
    width: 3.92rem;
    height: 10.29rem;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    padding: 2.08rem 0 .87rem .24rem;
    pointer-events: none;
    background: linear-gradient(90deg, #00131e, rgba(0, 19, 30, .35), rgba(0, 19, 30, 0));
  }

  .legendClass {
    position: absolute;
    bottom: px-to-rem(335);
    right: px-to-rem(410);
  }

  .detailsPopupClass {
    position: absolute;
    top: calc(50% - px-to-rem(90));
    left: calc(50% - px-to-rem(181));
  }

  .resourceDetail{
    position: absolute;
    top:  px-to-rem(470);
    left: px-to-rem(405);
  }

  .dtreebox {
    .common-comp-tree {
      background: #00131e;
    }
  }

  .maptooltele {
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: relative;
    ::v-deep .map-tools {
      pointer-events: all;
      position: absolute;
      bottom: px-to-rem(45);
      z-index: 4;
      right: px-to-rem(398) !important;
      .tile-control {
        position: absolute;
        right: px-to-rem(52);
        bottom: px-to-rem(68);
      }
      .ctmap-union-compass-inner{
        transform: scale(0.8);
      }
      .compass-tool{
        bottom:px-to-rem(125)
      }
      .zoom-tool{
        right:px-to-rem(14);
      }
      .scale-line {
        right:px-to-rem(14);
        .ctmap-union-scale-line-container {
          width: px-to-rem(112);
          .ctmap-union-scale-line {
            display: flex;
            justify-content: center;
          }
        }
      }
    }
  }

  .species-total {
    margin-top: px-to-rem(10);
    background: #00131e;
    box-sizing: border-box;
  }

  .chartmodule {
    + .chartmodule {
      margin-top: px-to-rem(12);
    }
  }

  .dalarmdetail {
    ::v-deep .alarm-info-box.common-comp-alarm-detail-module {
      z-index: 999;
    }
  }

  // 周边分析
  .aroundanalysis {
    position: absolute;
    top: px-to-rem(88);
    right: px-to-rem(490);
  }
  
  // 指点飞行
  .guideFlight{
    ::v-deep .innercomp-abcontainer{
      right:px-to-rem(420) !important;
      z-index: 6;
    }
  }

  .tree-wrapper {
    position: absolute;
    flex: 1;
    top: px-to-rem(108);
    left: px-to-rem(24);
    height: calc(100% - px-to-rem(182));
  }

  // 告警筛选定位
  ::v-deep .alarm-filte {
    position: absolute;
    top: px-to-rem(94);
    left: calc(50% - px-to-rem(438));
    .common-iw-s.el-picker-panel.el-popper[x-placement^="bottom"] {
      margin-top: px-to-rem(12);
    }
  }

  // 轨迹组件样式
  ::v-deep .common-comp-track-popup .grid-track-pop {
    top: calc(100% - px-to-rem(200)) !important;
    width: calc(100% - px-to-rem(900)) !important;
  }
}
.ecological{
  position: absolute;
  left:px-to-rem(406);
  top:px-to-rem(35);
  z-index: 6;
}
.logoBox {
  position: fixed;
  right: px-to-rem(410);
  z-index: 1;
  bottom: px-to-rem(34);
  i {
    width: px-to-rem(100);
    height: px-to-rem(32);
    background: url("~@/assets/image/common/logo-alarm.svg") no-repeat;
    background-size: 100% 100%;
    display: block;
  }
}

.left-wrapper {
  position: absolute;
  top: 0;
  left: px-to-rem(24);
  height: 100%;
  width: px-to-rem(370);
  padding-top: px-to-rem(45);
  z-index: 5;
  .wildlife {
    position: relative;
  }
  .bird-left {
    margin-top: px-to-rem(10);
  }
}

.right-wrapper {
  position: absolute;
  top: 0;
  right: px-to-rem(24);
  height: calc(100% - px-to-rem(36));
  width: px-to-rem(370);
  padding-top: px-to-rem(45);
  z-index: 5;
  .envir-right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .wildlife {
    position: relative;
  }
  .snap {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .snapListTrue {
      flex: 1;
      overflow: hidden;
    }
    .snapListFalse {
    }
  }
}

.spacingClass {
  margin-top: px-to-rem(10);
}
.spacingClass_img{
  margin-top: px-to-rem(10);
  z-index: 1000 !important;
}

.top-type-bar {
  z-index: 4;
  display: flex;
  position: fixed;
  top: px-to-rem(20);
  left: 50%;
  padding-bottom: px-to-rem(5);
  transform: translateX(-50%);
  width: px-to-rem(514);
  height: px-to-rem(50);
  background-image: url("~@/assets/image/common/bg_navTop.png");
  background-size: 100% 110%;
  background-repeat: no-repeat;
  .tab_items {
    position: relative;
    width:px-to-rem(134);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    cursor: pointer;
    &.active {
      &::before {
        position: absolute;
        content: "";
        height: px-to-rem(40);
        top: px-to-rem(2);
        background-size: contain;
        background-repeat: round;
      }
      &:first-child::before {
        width:100%;
        top:px-to-rem(11);
        left: px-to-rem(2);
        background-image: url("~@/assets/image/common/topBar_active_left@2x.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      &:nth-child(2)::before , &:nth-child(3)::before {
        width:100%;
        top:px-to-rem(11);
        background-image: url("~@/assets/image/common/bg_navTop_M_s@2x.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      &:last-child::before {
        width:100%;
        top:px-to-rem(11);
        right: px-to-rem(2);
        background-image: url("~@/assets/image/common/topBar_active_right@2x.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    &:nth-child(1){
      padding-left:px-to-rem(10)
    }
    &:last-child{
      padding-right:px-to-rem(10)
    }
    img {
      width: px-to-rem(44);
      height: px-to-rem(27);
      z-index: 999;
    }
    .title {
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      font-size: px-to-rem(14);
      color: #ffffff;
      line-height: px-to-rem(27);
      text-align: center;
      white-space: nowrap;
      font-style: normal;
      z-index: 1;
    }
  }
}
//湿地卡扣
.gatewayCamerass{
  ::v-deep .style2{
    height:px-to-rem(590) !important
  }
  ::v-deep .el-scrollbar__view{
    .el-select-dropdown__item{
      font-size: px-to-rem(14);
      line-height: px-to-rem(32);
    }
  }
}
::v-deep .range-panel {
  top: 6.2rem !important;
}
// 物种图片搜索弹框
::v-deep .realtimeCaptureFiltering {
  bottom: px-to-rem(-200) !important;
}
// 区域搜索起点终点框
::v-deep .d-search-map__navigation-popup__wrapper {
  left: px-to-rem(378) !important;
  top: px-to-rem(0) !important;
}
// 三维陀螺仪
::v-deep .ctmap-union-compass-container .ctmap-union-compass-inner {
  transform: scale(1);
}
//实时抓拍内容高度
::v-deep .innercomp-sccontainer-body {
  height: calc(100% - px-to-rem(49)) !important;
}
// 底部功能
.common-comp-footer{
  z-index: 3 !important;
}
// 工具箱
.toolBox_S{
  right:px-to-rem(411) !important;
  z-index: 4 !important;
  top:px-to-rem(43) !important;
  //看这里组件弹窗
  ::v-deep .innercomp-abcontainer-body{
    .lnglat{
      .el-input__inner{
        font-size: px-to-rem(12);
      }
    }
  }
  // 工具箱里面图层选项
  ::v-deep .el-tree-node.is-expanded>.el-tree-node__children{
    padding-left:0 !important
  }
}
//湿地卡扣属性弹窗样式
.gatewayCamerass{
  ::v-deep .container{
    background: transparent;
  }
}

//周边分析
::v-deep .lnglat-select-point-container{
  .lnglat{
    .el-input__inner{
      font-size: px-to-rem(12)
    }
  }
}
// 湿地卡口标题样式
::v-deep .gatewayCamera {
  .title {
    left: px-to-rem(160) !important;
    top: px-to-rem(63) !important;
  }
}
//空间测面\贴地测面
::v-deep .tool-measure-content{
  .el-radio__label{
    font-size: px-to-rem(14);
  }
}
// 鼠标移动坐标定位
::v-deep .ol-overlaycontainer-stopevent{
  z-index: 1;
}
</style>
<style lang="scss">
//解决告警弹窗大字版关闭弹窗输入框的padding被全局覆盖了
.alarm-handle .text-class .el-textarea__inner {
  padding-left: px-to-rem(12) !important;
}
</style>
