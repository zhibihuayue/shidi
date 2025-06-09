<template>
  <div>
    <absolute-container
      :top="top"
      :left="left"
      :right="right"
      :bottom="bottom"
      :width="width"
      class="iotEquipment"
      @close="closeParent"
      v-if="iotList.length > 1"
    >
      <ul :class="[bemClass.ul]">
        <li
          :class="item.deviceStatus == 0 ? '' : 'outline'"
          :key="item.deviceCode"
          v-for="item in iotList"
          @click="chooseDevice(item)"
        >
          <em
            class="deviceicon leftIcon iconfont_tools icon-tongyong-wulianshebeitubiao"
          ></em>
          <p>{{ item.deviceName }}</p>
          <span>{{ Number(item.height) }}m</span>
        </li>
      </ul>
    </absolute-container>
    <absolute-container
      v-if="showDetail"
      :top="top"
      :left="parentLeft"
      :right="right"
      :bottom="bottom"
      :width="368"
      class="iotEquipment"
      title=" "
      left-title
      @close="close"
    >
      <template v-slot:title>
        <span :class="[bemClass.title]">
          <em
            class="deviceicon leftIcon iconfont_tools icon-tongyong-wulianshebeitubiao"
          ></em>
          <h4 v-c-tip.auto="iotInfo.deviceName">{{ iotInfo.deviceName }}</h4>
          <div v-if="iotInfo.deviceStatus == 0" class="inline">在线</div>
          <div v-else class="outline">离线</div>
          <em
            @click="addCollect"
            :class="[
              'favicon iconfont_tools',
              isCollect
                ? 'icon-tongyong_icon_shoucang_20_s active'
                : 'icon-tongyong_icon_shoucang_20_n'
            ]"
          ></em>
        </span>
      </template>
      <div :class="[bemClass.body]">
        <div :class="[bemClass.content]">
          <div :class="[bemClass.tab]">
            <div :class="[bemClass.wrap]">
              <div
                @click="handleTabItemClick(1)"
                class="tab_item"
                :class="tabIndex == 1 ? 'tab_active' : ''"
                >物联设备信息
              </div>
              <div
                @click="handleTabItemClick(2)"
                class="tab_item"
                :class="tabIndex == 2 ? 'tab_active' : ''"
                >物联设备图片
              </div>
            </div>
            <div :class="[bemClass.bottomline]"></div>
          </div>
          <div :class="[bemClass.contentbox]" v-if="tabIndex == 1">
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">物联设备编号：</span>
              <span :class="[bemClass.value]">
                <span>{{ iotInfo.deviceCode }}</span>
                <i @click="copyInfo" class="iconfont_tools icon-fuzhiicon"></i>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">物联设备厂家：</span>
              <span :class="[bemClass.value]">{{ iotInfo.modelName }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">物联设备类型：</span>
              <span :class="[bemClass.value]">{{
                iotInfo.deviceTypeName
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">经纬度：</span>
              <span :class="[bemClass.value]">{{ lnglat }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">物联设备地址：</span>
              <span :class="[bemClass.value]">
                <span v-c-tip="iotInfo.location">{{ iotInfo.location }}</span>
              </span>
            </div>
          </div>
          <div
            class="cont_tab_right"
            :class="
              fileList?.length < 2
                ? 'cont_tab_right_short'
                : 'cont_tab_right_height'
            "
            v-if="tabIndex == 2"
          >
            <div v-if="fileList?.length" :class="[bemClass.carouselwrapper]">
              <el-carousel
                @change="getFileIndex"
                :autoplay="false"
                trigger="click"
                arrow="always"
              >
                <el-carousel-item
                  v-for="(item, index) in carouselList"
                  :key="item + index"
                >
                  <img
                    :class="[bemClass.fitheight]"
                    :src="item"
                    v-if="isImage(item)"
                    alt=""
                  />
                  <video
                    :class="[bemClass.fitheight]"
                    controlslist="nodownload noplaybackrate"
                    disablePictureInPicture
                    referrerpolicy="no-referrer"
                    :src="item"
                    v-if="!isImage(item) && index === fileIndex"
                    controls
                    autoplay
                  ></video>
                </el-carousel-item>
                <div
                  :class="[bemClass.fullscreen]"
                  @click="showImageViewer = true"
                >
                  <span
                    class="iconfont_tools icon-guotu_icon_quanpingfangda"
                  ></span>
                </div>
              </el-carousel>
            </div>
            <div v-else :class="[bemClass.nodata]" class="no-data"
              >暂无数据</div
            >
          </div>
        </div>
        <div :class="[bemClass.bottom]">
          <em
            v-c-tip="'监测数据'"
            :class="[
              'iconfont_tools',
              showMonitorObj && showMonitorObj[iotInfo.deviceCode]
                ? 'icon-tongyong_icon_jianceshuju_s_30 active'
                : 'icon-tongyong_icon_jianceshuju_n_30'
            ]"
            @click="openMonitor"
          ></em>
          <em
            v-c-tip="'关联事件'"
            :class="[
              'iconfont_tools',
              showWarnObj[iotInfo.deviceCode] || this.hightInfo.showWarnObj
                ? 'icon-tongyong_icon_guanlianshijian_s_30 active'
                : 'icon-tongyong_icon_guanlianshijian_n_30'
            ]"
            @click="openConnect"
          ></em>
          <em
            v-c-tip="'周边分析'"
            :class="[
              'iconfont_tools',
              hightInfo.showRound
                ? 'icon-tongyong_icon_zhoubianfenxi_s_30 active'
                : 'icon-tongyong_icon_zhoubianfenxi_n_30'
            ]"
            @click="openRound"
          ></em>
          <em
            v-c-tip="'到这里'"
            :class="[
              'iconfont_tools',
              hightInfo.showArea
                ? 'icon-tongyong_icon_daozheli_s_30 active'
                : 'icon-tongyong_icon_daozheli_n_30'
            ]"
            @click="openLogistic"
          ></em>
        </div>
      </div>
    </absolute-container>
    <image-viewer
      v-if="showImageViewer"
      :urlList="carouselList"
      :initial-index="fileIndex"
      :onClose="handleImageViewerClose"
    />
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '../bem/create'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  queryIotDeviceBySite,
  // getDeviceListBySiteCode,
  addOrCancelCollections,
  queryIotDeviceInfo
  // getDeviceInfo
} from '../request/API/IotRequest'
import CommonMessage from '../funCommon/message/common-message'
import { getUrlHead, $v } from '../funCommon/common'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'

const bem = createNameSpace('iot-equipment')
export default {
  name: 'd-iot-equipment',
  components: { AbsoluteContainer, ImageViewer },
  props: {
    left: {
      type: Number,
      default: -115
    },
    top: Number,
    right: Number,
    bottom: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 230
    },
    siteCode: {
      type: String,
      default: ''
    },
    deviceCode: {
      type: String,
      default: ''
    },
    alarmFilteParam: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['hasAlarmList'],
  computed: {
    carouselList() {
      return this.fileList.length === 2
        ? [...this.fileList, ...this.fileList]
        : this.fileList
    },
    bemClass() {
      return {
        title: bem.b('title'),
        extra: bem.b('extra'),
        body: bem.b('body'),
        content: bem.be('body', 'content'),
        item: bem.be('body', 'item'),
        label: bem.be('body', 'label iotlabel'),
        value: bem.be('body', 'value'),
        bottom: bem.be('body', 'bottom'),
        ul: bem.b('ul-list'),
        tab: bem.be('body', 'tab'),
        wrap: bem.be('body', 'wrap'),
        bottomline: bem.be('body', 'bottomline'),
        contentbox: bem.be('body', 'contentbox'),
        carouselwrapper: bem.be('body', 'carouselwrapper'),
        fitheight: bem.be('body', 'fitheight'),
        fullscreen: bem.be('body', 'fullscreen'),
        nodata: bem.be('body', 'nodata')
      }
    },
    showWarnObj() {
      const obj = {}
      if (this.alarmFilteParam?.deviceCodeListCopy?.length > 0) {
        this.alarmFilteParam?.deviceCodeListCopy.forEach((item) => {
          obj[item.code] = true
        })
      }
      return obj
    }
  },
  data() {
    return {
      iotList: [], // 物联设备列表
      iotData: {
        latitude: null,
        longitude: null,
        location
      }, // 物联设备信息
      iotInfo: {
        deviceName: null,
        deviceStatus: 0,
        modelName: null,
        deviceTypeName: null,
        deviceCode: null,
        location: null,
        fileUrlList: []
      }, // 物联设备详情
      isCollect: false, // 是否收藏
      hightInfo: {
        // 底部icon高亮
        showWarnObj: false,
        showMonitor: false,
        showRound: false,
        showArea: false
      },
      showDetail: false,
      parentLeft: -184,
      childDevice: null,
      showMonitorObj: {}, // 检测数据弹窗展示
      tabIndex: 1,
      fileList: [],
      fileIndex: 0,
      showImageViewer: false,
      lnglat: ''
    }
  },
  mounted() {
    this.queryData()
    // 检测数据展示监听
    this.$globalEventBus.$on(
      `${eventPath.commonInnerUtils}__iot-hight-change`,
      (res) => {
        // 当检测数据弹窗切换 清空上一个检测数据弹窗
        if (
          res.deviceCode !== this.iotInfo.deviceCode &&
          this.showMonitorObj[this.iotInfo.deviceCode]
        ) {
          this.$globalEventBus.$emit(
            `${eventPath.commonCompIotTree}__glob-show-monitor-data`,
            { data: this.iotInfo }
          )
        }
        this.showMonitorObj = {}
        this.showMonitorObj[res.deviceCode] = res.showMonitor
        // this.hightInfo.showMonitor = res.showMonitor
      }
    )
    // 物联树 收藏
    this.$globalEventBus.$on(
      `${eventPath.commonCompIotTree}__tree-click-collection-state`,
      (payload) => {
        if (payload?.collObjCode[0] === this.iotInfo.deviceCode) {
          this.isCollect = payload.optType === '1'
        }
      }
    )
    // 监听周边分析弹窗状态
    this.$globalEventBus.$on(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
    // 到这里弹窗监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompSearchMap}__close-navigation`,
      (res) => {
        this.hightInfo.showArea = !res.close
      }
    )
  },
  beforeDestroy() {
    this.$globalEventBus.$off(`${eventPath.commonInnerUtils}__iot-hight-change`)
    this.$globalEventBus.$off(
      `${eventPath.commonInnerUtils}__tree-click-collection-state`
    )
    this.$globalEventBus.$off(`${eventPath.commonCompAlarmFilte}__state`)
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`
    )
    this.hightInfo.showMonitor &&
      this.$globalEventBus.$emit(
        `${eventPath.commonCompIotTree}__glob-show-monitor-data`,
        { data: this.iotInfo }
      )
  },
  methods: {
    queryData() {
      if (this.childDevice) {
        queryIotDeviceInfo({ deviceCode: this.childDevice }).then((res) => {
          // 使用deviceCode查询的是详情，但是返回的是数组，精准查询详情长度只会是1
          if (res.code === 200) {
            this.iotData = res.data[0] || {}
            this.iotInfo = res.data[0] || {}
            this.lnglat = res.data[0]
              ? res.data[0].longitude + ',' + res.data[0].latitude
              : ''
            this.fileList = []
            if (this.iotInfo.fileUrlList?.length) {
              this.iotInfo.fileUrlList.forEach((ele) => {
                this.fileList.push(ele)
              })
            }
            this.isCollect = res.data[0]?.isMonitor === '1'
            this.showDetail = true
          }
        })
      } else {
        queryIotDeviceBySite({ siteCode: this.siteCode }).then((res) => {
          if (res.code === 200) {
            this.iotData = res.data[0] || {}
            this.iotList = res.data[0]?.list
            this.iotInfo = res.data[0]?.list[0] || {}
            this.lnglat = res.data[0]
              ? res.data[0].longitude + ',' + res.data[0].latitude
              : ''
            this.fileList = []
            if (this.iotInfo.fileUrlList?.length) {
              this.iotInfo.fileUrlList.forEach((ele) => {
                this.fileList.push(ele)
              })
            }
            this.isCollect = res.data[0]?.list[0]?.isMonitor === '1'
            if (this.iotList.length === 1) {
              this.showDetail = true
            }
          }
        })
      }
    },
    chooseDevice(item) {
      // 列表切换设备详情
      this.parentLeft = 125
      this.showDetail = true
      this.childDevice = item.deviceCode
      this.queryData()
      item['layerType'] = 3
      this.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__marker-select`,
        {
          isSelected: true,
          geometry: null,
          props: item,
          entity: null
        }
      )
    },
    // 内部复制方法，方案是生成一个input，赋值，然后用指令处理这个输入框内的内容
    _copyText(txt) {
      const aux = document.createElement('input')
      aux.value = txt
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    copyInfo() {
      this._copyText(this.iotInfo.deviceCode)
      CommonMessage.success('复制成功')
    },
    addCollect() {
      // 收藏状态切换
      const params = {
        collObjCode: [this.iotInfo.deviceCode],
        collObjType: '7',
        optType: this.isCollect ? '0' : '1'
      }
      addOrCancelCollections(params).then((res) => {
        if (params.optType === '1') {
          CommonMessage.success('物联设备收藏成功')
        } else {
          CommonMessage.success('物联设备取消收藏成功')
        }
        this.isCollect = params.optType === '1'
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__pop-iot-collection-state`,
          params
        )
      })
    },
    openMonitor() {
      // 检测数据弹窗
      this.$globalEventBus.$emit(
        `${eventPath.commonCompIotTree}__glob-show-monitor-data`,
        { data: this.iotInfo }
      )
      // this.hightInfo.showMonitor = !this.hightInfo.showMonitor
      this.showMonitorObj[this.iotInfo.deviceCode] =
        !this.showMonitorObj[this.iotInfo.deviceCode]
      this.showMonitorObj = { ...this.showMonitorObj }
    },
    openConnect() {
      // 关联事件弹窗 有告警列表就弹出筛选，没有跳转 工作台-事件查询
      if (this.hasAlarmList) {
        this.showWarnObj[this.iotInfo.deviceCode] =
          !this.showWarnObj[this.iotInfo.deviceCode]
        const devices = []
        Object.keys(this.showWarnObj).forEach((item) => {
          if (this.showWarnObj[item]) {
            devices.push({
              code: item,
              devType: 3
            })
          }
        })
        const payload = {
          devices:
            devices.length > 0
              ? devices
              : [
                  {
                    code: '',
                    devType: 3
                  }
                ]
        }
        this.$globalEventBus.$emit(
          `${eventPath.commonCompAlarmFilte}__open`,
          payload
        )
      } else {
        this.hightInfo.showWarnObj = !this.hightInfo.showWarnObj
        if (this.hightInfo.showWarnObj) {
          const preUrl = window.localStorage
            .getItem('gisUrl')
            ?.replace('/api', '')
          const params = {
            iotCode: this.iotInfo.deviceCode
          } // 当前设备编码
          $v.openPage(preUrl + '/eventManagement', params)
        }
      }
    },
    openRound() {
      // 周边分析弹窗
      const state = this.hightInfo.showRound
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAroundAnalysis}__visible-change`,
        {
          visible: !state,
          deviceInfo: {
            deviceCode: this.iotInfo.deviceCode,
            type: '1', // '1' 点 默认,'2': 线,'3': 面
            longitude: this.iotData.longitude,
            latitude: this.iotData.latitude,
            geometry: '' // 线资源、面资源需要传，直接把接口返回的传过来就行
          }
        }
      )
      this.hightInfo.showRound = !state
    },
    onCloseAroundAnalysis() {
      this.hightInfo.showRound = false
    },
    openLogistic() {
      // 到这里弹窗
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSearchMap}__set-navigation`,
        {
          open: this.hightInfo.showArea ? false : true,
          endPoint: {
            lng: this.iotData.longitude,
            lat: this.iotData.latitude,
            alias: this.iotInfo.location
          }
        }
      )
      this.hightInfo.showArea = !this.hightInfo.showArea
    },
    closeParent() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog_close`,
        {
          type: 'iot',
          deviceInfo: this.iotInfo
        }
      )
    },
    close() {
      if (this.showDetail && this.iotList?.length > 1) {
        this.iotInfo = {}
        this.iotData = {}
        this.showDetail = false
      } else {
        this.$emit('close')
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__dialog_close`,
          {
            type: 'iot',
            deviceInfo: this.iotInfo
          }
        )
      }
    },
    handleTabItemClick(index) {
      if (index == this.tabIndex) return
      this.tabIndex = index
    },
    isImage(val) {
      const fileTypes = ['jpg', 'jpeg', 'png', 'JPEG', 'JPG', 'PNG']
      return fileTypes.find((item) => val.includes(item))
    },
    getFileIndex(index) {
      this.fileIndex = index
    },
    handleImageViewerClose() {
      this.showImageViewer = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/iot-equipment-tab';
</style>
