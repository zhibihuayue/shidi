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
      v-if="speakerList.length > 1"
    >
      <ul :class="[bemClass.ul]">
        <li
          :class="
            item.deviceStatus == '1' ||
            item.deviceStatus == '2' ||
            item.deviceStatus == '3'
              ? ''
              : 'outline'
          "
          :key="item.deviceCode + index"
          v-for="(item, index) in speakerList"
          @click="chooseDevice(item)"
        >
          <ct-icon
            class="ct-icon-style deviceicon leftIcon iconfont_tools"
            name="loudspeaker"
            size="20"
          />
          <!-- <i class="deviceicon leftIcon iconfont_tools icon-guotu_dalaba"></i> -->
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
          <!-- <i class="deviceicon leftIcon iconfont_tools icon-guotu_dalaba"></i> -->
          <ct-icon
            class="ct-icon-style deviceicon leftIcon iconfont_tools"
            name="loudspeaker"
            size="20"
          />
          <h4 v-c-tip.auto="speakerInfo.deviceName">
            {{ speakerInfo.deviceName }}
          </h4>
          <div
            v-if="
              speakerInfo.deviceStatus == 1 ||
              speakerInfo.deviceStatus == 2 ||
              speakerInfo.deviceStatus == 3
            "
            class="inline"
            >在线</div
          >
          <div v-else class="outline">离线</div>
          <i
            @click="addCollect"
            :class="[
              'favicon iconfont_tools',
              isCollect
                ? 'icon-tongyong_icon_shoucang_20_s active'
                : 'icon-tongyong_icon_shoucang_20_n'
            ]"
          ></i>
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
                >喇叭信息</div
              >
              <div
                @click="handleTabItemClick(2)"
                class="tab_item"
                :class="tabIndex == 2 ? 'tab_active' : ''"
                >喇叭图片</div
              >
            </div>
            <div :class="[bemClass.bottomline]"></div>
          </div>
          <div :class="[bemClass.contentbox]" v-if="tabIndex == 1">
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">喇叭编号：</span>
              <span :class="[bemClass.value]">
                <span>{{ speakerInfo.deviceCode }}</span>
                <i @click="copyInfo" class="iconfont_tools icon-fuzhiicon"></i>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">喇叭厂家：</span>
              <span :class="[bemClass.value]">{{
                speakerInfo.manufacturerName || '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">喇叭型号：</span>
              <span :class="[bemClass.value]">{{
                speakerInfo.modelCode || '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">喇叭类型：</span>
              <span :class="[bemClass.value]">{{
                speakerInfo.deviceTypeName || '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">喇叭挂高：</span>
              <span :class="[bemClass.value]"
                >{{ Number(speakerInfo.height) }}m</span
              >
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">经纬度：</span>
              <span :class="[bemClass.value]">{{ lnglat }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">喇叭地址：</span>
              <span :class="[bemClass.value]">
                <span v-c-tip="speakerInfo.location">{{
                  speakerInfo.location
                }}</span>
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
            <div v-else :class="[bemClass.nodata]">暂无数据</div>
          </div>
        </div>
        <div :class="[bemClass.bottom]">
          <i
            v-c-tip="'实时喊话'"
            :class="[
              'iconfont_tools',
              hightInfo.showSpeaker
                ? 'icon-tongyong_icon_hanhua_s_30 active'
                : 'icon-tongyong_icon_hanhua_n_30'
            ]"
            @click="openLineSpeaker"
          ></i>
          <i
            v-c-tip="'周边分析'"
            :class="[
              'iconfont_tools',
              hightInfo.showRound
                ? 'icon-tongyong_icon_zhoubianfenxi_s_30 active'
                : 'icon-tongyong_icon_zhoubianfenxi_n_30'
            ]"
            @click="openRound"
          ></i>
          <i
            v-c-tip="'到这里'"
            :class="[
              'iconfont_tools',
              hightInfo.showArea
                ? 'icon-tongyong_icon_daozheli_s_30 active'
                : 'icon-tongyong_icon_daozheli_n_30'
            ]"
            @click="openLogistic"
          ></i>
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
  // queryHornForSite,
  getDeviceListBySiteCode,
  addOrCancelCollections,
  // queryHornDeviceDetail
  getDeviceInfo
} from '../request/API/IotRequest'
import CommonMessage from '../funCommon/message/common-message'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'

const bem = createNameSpace('iot-equipment')
export default {
  name: 'd-big-speaker-dialog',
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
    }
  },
  computed: {
    carouselList() {
      let list =
        this.fileList.length === 2
          ? [...this.fileList, ...this.fileList]
          : this.fileList
      return list
    },
    bemClass() {
      return {
        title: bem.b('title'),
        extra: bem.b('extra'),
        body: bem.b('body'),
        content: bem.be('body', 'content'),
        item: bem.be('body', 'item'),
        label: bem.be('body', 'label hornlabel'),
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
    }
  },
  data() {
    return {
      speakerList: [],
      speakerInfo: {
        deviceName: null,
        deviceStatus: null,
        manufacturerName: null,
        modelCode: null,
        deviceTypeName: null,
        height: null,
        deviceCode: null,
        fileUrlList: [],
        longitude: null,
        latitude: null,
        location: null
      }, // 大喇叭详情
      isCollect: false, // 是否收藏
      hightInfo: {
        // 底部icon高亮
        showSpeaker: false,
        showRound: false,
        showArea: false
      },
      showDetail: false,
      parentLeft: -184,
      childDevice: null,
      tabIndex: 1,
      fileList: [],
      fileIndex: 0,
      showImageViewer: false,
      lnglat: ''
    }
  },
  mounted() {
    this.queryData()
    // 监听大喇叭弹窗开启关闭状态
    this.$globalEventBus.$on(
      `${eventPath.commonInnerUtils}__pop-speaker-hight-change`,
      (res) => {
        this.hightInfo.showSpeaker = res.showSpeaker
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
    // 大喇叭树收藏事件
    this.$globalEventBus.$on(
      `${eventPath.commonCompHornTree}__tree-click-collection-state`,
      (payload) => {
        if (payload?.collObjCode[0] === this.speakerInfo.deviceCode) {
          this.isCollect = payload.optType === '1'
        }
      }
    )
  },
  beforeDestroy() {
    this.$globalEventBus.$off(
      `${eventPath.commonInnerUtils}__pop-speaker-hight-change`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompHornTree}__tree-click-collection-state`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
    this.hightInfo.showSpeaker &&
      this.$globalEventBus.$emit(
        `${eventPath.commonCompHornTree}__glob-show-real-time-shout`,
        {
          data: this.speakerInfo
        }
      )
  },
  methods: {
    queryData() {
      if (this.childDevice || this.deviceCode) {
        getDeviceInfo({
          deviceCode: this.childDevice || this.deviceCode,
          queryType: 5
        }).then((res) => {
          // 使用deviceCode查询的是详情，但是返回的是数组，精准查询详情长度只会是1
          if (res.code === 200) {
            this.speakerInfo = res.data || {}
            this.lnglat = res.data
              ? res.data.longitude + ',' + res.data.latitude
              : ''
            this.fileList = []
            if (this.speakerInfo.fileUrlList?.length) {
              this.speakerInfo.fileUrlList.forEach((ele) => {
                this.fileList.push(ele)
              })
            }
            this.isCollect = res.data?.isMonitor === '1'
            this.showDetail = true
          }
        })
      } else {
        getDeviceListBySiteCode({ siteCode: this.siteCode, queryType: 5 }).then(
          (res) => {
            if (res.code === 200) {
              this.speakerList = res.data
              this.speakerInfo = res.data[0] || {}
              this.lnglat = res.data[0]
                ? res.data[0].longitude + ',' + res.data[0].latitude
                : ''
              this.fileList = []
              if (this.speakerInfo.fileUrlList?.length) {
                this.speakerInfo.fileUrlList.forEach((ele) => {
                  this.fileList.push(ele)
                })
              }
              this.isCollect = res.data[0]?.isMonitor === '1'
              if (this.speakerList.length === 1) {
                this.showDetail = true
              }
            }
          }
        )
      }
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
      this._copyText(this.speakerInfo.deviceCode)
      CommonMessage.success('复制成功')
    },
    openLineSpeaker() {
      // 实时通话弹窗
      this.hightInfo.showSpeaker = !this.hightInfo.showSpeaker
      this.$globalEventBus.$emit(
        `${eventPath.commonCompHornTree}__glob-show-real-time-shout`,
        {
          data: this.speakerInfo
        }
      )
    },
    addCollect() {
      // 收藏切换
      const params = {
        collObjCode: [this.speakerInfo.deviceCode],
        collObjType: '10',
        optType: this.isCollect ? '0' : '1'
      }
      addOrCancelCollections(params).then((res) => {
        if (params.optType === '1') {
          CommonMessage.success('喇叭设备收藏成功')
        } else {
          CommonMessage.success('喇叭设备取消收藏成功')
        }
        this.isCollect = params.optType === '1'
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__pop-speaker-collection-state`,
          params
        )
      })
    },
    openRound() {
      // 周边分析弹窗
      const state = this.hightInfo.showRound
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAroundAnalysis}__visible-change`,
        {
          visible: !state,
          deviceInfo: {
            deviceCode: this.speakerInfo.deviceCode,
            type: '1', // '1' 点 默认,'2': 线,'3': 面
            longitude: this.speakerInfo.longitude,
            latitude: this.speakerInfo.latitude,
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
            lng: this.speakerInfo.longitude,
            lat: this.speakerInfo.latitude,
            alias: this.speakerInfo.location
          }
        }
      )
      this.hightInfo.showArea = !this.hightInfo.showArea
    },
    chooseDevice(item) {
      this.parentLeft = 125
      this.showDetail = true
      this.childDevice = item.deviceCode
      this.queryData()
      item['layerType'] = 5
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
    closeParent() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog_close`,
        {
          type: 'horn',
          deviceInfo: this.speakerInfo
        }
      )
    },
    close() {
      if (this.showDetail && this.speakerList?.length > 1) {
        this.speakerInfo = {}
        this.showDetail = false
      } else {
        this.$emit('close')
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__dialog_close`,
          {
            type: 'horn',
            deviceInfo: this.speakerInfo
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
