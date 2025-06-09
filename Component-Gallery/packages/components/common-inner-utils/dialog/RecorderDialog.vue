<template>
  <div>
    <absolute-container
      :top="top"
      :left="left"
      :right="right"
      :bottom="bottom"
      :width="width"
      :class="[bemClass.container]"
      @close="closeParent"
      v-if="deviceList.length > 1"
    >
      <ul :class="[bemClass.ul]">
        <li
          :class="item.deviceStatus == 0 || item.status == 0 ? '' : 'outline'"
          :key="item.deviceCode"
          v-for="item in deviceList"
          @click="chooseDevice(item)"
        >
          <i
            class="deviceicon leftIcon iconfont_tools icon-tongyong_gongnengtubiao_icon_zhifajiluyi"
          ></i>
          <p>{{ item.deviceName }}</p>
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
      :class="[bemClass.container]"
      title=" "
      left-title
      @close="close"
    >
      <template v-slot:title>
        <span :class="[bemClass.title]">
          <i
            class="deviceicon leftIcon iconfont_tools icon-tongyong_gongnengtubiao_icon_zhifajiluyi"
          ></i>
          <h4 v-c-tip.auto="deviceInfo?.deviceName">{{
            deviceInfo?.deviceName
          }}</h4>
          <div
            :class="
              deviceInfo?.status == 1 || deviceInfo?.deviceStatus == 1
                ? 'outline'
                : 'inline'
            "
          >
            {{
              deviceInfo?.status == 1 || deviceInfo?.deviceStatus == 1
                ? '离线'
                : '在线'
            }}
          </div>
          <i
            @click="changeCollectionStatus"
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
        <div :class="[bemClass.tab]">
          <div :class="[bemClass.tabWrap]">
            <div
              @click="handleTabItemClick(1)"
              :class="
                tabIndex == 1
                  ? `${[bemClass.tabItem]} tab_active`
                  : [bemClass.tabItem]
              "
              >执法记录仪信息</div
            >
            <div
              @click="handleTabItemClick(2)"
              :class="
                tabIndex == 2
                  ? `${[bemClass.tabItem]} tab_active`
                  : [bemClass.tabItem]
              "
              >执法记录仪图片</div
            >
          </div>
          <div :class="[bemClass.tabLine]" class="tab_bottom_line"></div>
        </div>

        <div
          v-show="tabIndex == 1"
          :class="deviceInfo?.channelList?.length < 2 ? 'h193' : 'h245'"
        >
          <div :class="[bemClass.top]">
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">执法记录仪编号：</span>
              <span :class="[bemClass.value]">
                <span>{{ deviceInfo?.deviceCode || '-' }}</span>
                <i
                  @click="copyInfo(deviceInfo.deviceCode || '-')"
                  class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                ></i>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">执法记录仪厂家：</span>
              <span :class="[bemClass.value]">
                <span>{{ deviceInfo?.manufacturerName || '-' }}</span>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">执法记录仪型号：</span>
              <span :class="[bemClass.value]">
                <span>
                  {{ deviceInfo?.modelCode || '-' }}
                </span>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">执法记录仪地址：</span>
              <span :class="[bemClass.value]" :title="deviceInfo.location">
                <span>{{ deviceInfo?.location || '-' }}</span>
              </span>
            </div>
          </div>
          <div class="tong-count">
            <div class="count-wrap">
              <div
                v-if="deviceInfo.channelList && deviceInfo?.channelList.length"
                :class="[bemClass.info, bemClass.channelInfo]"
              >
                <div
                  v-for="(channelItem, index) in deviceInfo?.channelList"
                  :key="index"
                >
                  <div :class="[bemClass.item]">
                    <span
                      :class="[
                        bemClass.label,
                        channelItem.status == 1
                          ? 'channel-offline-box'
                          : 'channel-online-box'
                      ]"
                    >
                      <span>通道名称：</span>
                    </span>
                    <span :class="[bemClass.value]">
                      <template v-if="channelItem.channelName">
                        <span :title="channelItem.channelName">
                          {{ channelItem.channelName }}
                        </span>
                        <i
                          @click="copyInfo(channelItem.channelName)"
                          class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                        ></i>
                      </template>
                      <template v-else>-</template>
                    </span>
                  </div>
                  <div :class="[bemClass.item]">
                    <span :class="[bemClass.label]">通道编号：</span>
                    <span :class="[bemClass.value]">
                      <template v-if="channelItem.channelCode">
                        <span :title="channelItem.channelCode">
                          {{ channelItem.channelCode }}
                        </span>
                        <i
                          @click="copyInfo(channelItem.channelCode)"
                          class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                        ></i>
                      </template>
                      <template v-else>-</template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="tabIndex == 2"
          :class="
            deviceInfo?.channelList?.length < 2
              ? `${[bemClass.imgData]} cont_tab_right_short`
              : `${[bemClass.imgData]} cont_tab_right_height`
          "
        >
          <div v-if="deviceInfo?.fileUrlList?.length" class="carousel-wrapper">
            <el-carousel
              @change="getFileIndex"
              :autoplay="false"
              trigger="click"
              :arrow="deviceInfo?.fileUrlList.length > 1 ? 'always' : 'never'"
            >
              <el-carousel-item
                v-for="(item, index) in deviceInfo?.fileUrlList"
                :key="item"
              >
                <img
                  class="fit-height"
                  :src="item"
                  v-if="isImage(item)"
                  alt=""
                />
                <video
                  class="fit-height"
                  controlslist="nodownload noplaybackrate"
                  disablePictureInPicture
                  referrerpolicy="no-referrer"
                  :src="item"
                  v-if="!isImage(item) && index === fileIndex"
                  controls
                ></video>
              </el-carousel-item>
              <div class="fullscreen" @click="showImageViewer = true">
                <span
                  class="iconfont_tools icon-guotu_icon_quanpingfangda"
                ></span>
              </div>
            </el-carousel>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
        <div :class="[bemClass.footer]">
          <i
            @click="callRealTimeTrajectory"
            :class="[
              'iconfont_tools',
              hightInfo.showRealTimeTrajectory
                ? 'icon-tongyong_icon_shishiguiji_s_30 active'
                : 'icon-tongyong_icon_shishiguiji_n_30'
            ]"
            v-c-tip="'实时轨迹'"
          ></i>

          <i
            @click="callHistoryTrajectory"
            :class="[
              'iconfont_tools',
              hightInfo.showHistoryTrajectory
                ? 'icon-tongyong_icon_lishiguiji_s_30 active'
                : 'icon-tongyong_icon_lishiguiji_n_30'
            ]"
            v-c-tip="'历史轨迹'"
          ></i>

          <i
            v-c-tip="'实时喊话'"
            :class="[
              'iconfont_tools',
              hightInfo.showRealTimeVideo
                ? 'icon-tongyong_icon_hanhua_s_30 active'
                : 'icon-tongyong_icon_hanhua_n_30'
            ]"
            @click="callRealTimeVideo"
          ></i>

          <i
            @click="callAroundAnalysis"
            :class="[
              'iconfont_tools',
              hightInfo.showAroundAnalysis
                ? 'icon-tongyong_icon_zhoubianfenxi_s_30 active'
                : 'icon-tongyong_icon_zhoubianfenxi_n_30'
            ]"
            v-c-tip="'周边分析'"
          ></i>

          <i
            @click="callOnNav"
            :class="[
              'iconfont_tools',
              hightInfo.showOnNav
                ? 'icon-tongyong_icon_daozheli_s_30 active'
                : 'icon-tongyong_icon_daozheli_n_30'
            ]"
            v-c-tip="'到这里'"
          ></i>
        </div>
      </div>
    </absolute-container>
    <image-viewer
      v-if="showImageViewer"
      :urlList="deviceInfo?.fileUrlList"
      :initial-index="fileIndex"
      :onClose="handleImageViewerClose"
    />
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  getRecorderDevicesBySiteCode,
  qryRecorderDeviceInfo,
  getDeviceImage
} from '../request/API/index'
import { addOrCancelCollections } from '../request/API/IotRequest'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'
import { $playerFit } from '../funCommon/playerFit'
import CommonMessage from '../funCommon/message/common-message'
import { createNameSpace } from '../bem/create'
import TREE_ENUM from '../funCommon/tree/tree-enum'

const bem = createNameSpace('recorder-dialog')
export default {
  name: 'd-recorder-dialog',
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
    bemClass() {
      return {
        container: bem.b(''),
        title: bem.b('title'),
        body: bem.b('body'),
        info: bem.b('info'),
        top: bem.b('top'),
        channelInfo: bem.b('channelInfo'),
        item: bem.b('item'),
        label: bem.be('item', 'label'),
        value: bem.be('item', 'value'),
        footer: bem.b('footer'),
        ul: bem.b('ul-list'),
        tab: bem.b('tab'),
        tabWrap: bem.be('tab', 'wrap'),
        tabItem: bem.be('tab', 'tabItem'),
        tabLine: bem.be('tab', 'tabLine'),
        imgData: bem.b('imgData')
      }
    }
  },
  watch: {
    siteCode(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getDeviceInfo()
      }
    }
  },
  data() {
    return {
      deviceList: [], // 执法记录仪设备列表
      showDetail: false,
      deviceInfo: null,
      parentLeft: -184,
      isCollect: false,
      hightInfo: {
        showRealTimeVideo: false,
        showRealTimeTrajectory: false,
        showHistoryTrajectory: false,
        showAroundAnalysis: false,
        showOnNav: false
      },
      tabIndex: 1,
      showImageViewer: false,
      fileIndex: 0,
      childDevice: this.deviceCode
    }
  },
  mounted() {
    this.queryData()
    // 收藏状态监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompRecorderTree}__tree-click-collection-state`,
      (payload) => {
        this.isCollect = payload.optType === '1'
      }
    )
    // 同步历史轨迹图标状态
    this.$globalEventBus.$on(
      `${eventPath.commonCompRecorderTree}__tree-click-history-trajectory`,
      (payload) => {
        this.hightInfo.showRealTimeTrajectory = false
        this.hightInfo.showHistoryTrajectory = payload
      }
    )
    // 同步实时轨迹图标状态
    this.$globalEventBus.$on(
      `${eventPath.commonCompRecorderTree}__tree-click-real-trajectory`,
      (payload) => {
        this.hightInfo.showHistoryTrajectory = false
        this.hightInfo.showRealTimeTrajectory = payload
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
        this.hightInfo.showOnNav = !res.close
      }
    )

    window.addEventListener('message', this.closeRealTimeVideo)
  },
  beforeDestroy() {
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__call-back-track-popup`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close-operator-dialog`
    )

    this.$globalEventBus.$off(
      `${eventPath.commonCompUavTree}__tree-click-history-trajectory`
    )

    this.$globalEventBus.$off(
      `${eventPath.commonCompUavTree}__tree-click-real-trajectory`
    )

    this.$globalEventBus.$off(`${eventPath.commonInnerUtils}__dialog_close`)

    window.removeEventListener('message', this.closeRealTimeVideo)
  },
  methods: {
    queryData() {
      if (this.childDevice) {
        this.getDeviceDetail({ deviceCode: this.childDevice })
      } else {
        this.getDeviceInfo()
      }
    },
    getDeviceInfo() {
      const siteCode = this.siteCode.split('--')[0]
      const param = {
        siteCode
      }
      getRecorderDevicesBySiteCode(param)
        .then((res) => {
          const deviceInfoArr = res.data
          if (deviceInfoArr.length > 1) {
            // 设备数组
            this.deviceList = deviceInfoArr
          } else {
            this.getDeviceDetail(deviceInfoArr[0])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getDeviceDetail(deviceInfo) {
      let param = {
        deviceCode: deviceInfo?.deviceCode,
        isVideoFirst: true
      }
      // 查询执法记录仪详情
      qryRecorderDeviceInfo(param)
        .then((res) => {
          if (res.code == '200') {
            if (res.data) {
              this.deviceInfo = res.data
              this.isCollect = res.data.isMonitor === '1'
              this.showDetail = true
            } else {
              console.error('点位详情接口未返回数据！')
            }
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    chooseDevice(item) {
      // 列表切换设备详情
      this.parentLeft = 125
      this.showDetail = true
      this.getDeviceDetail(item)
      item['layerType'] = 11
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

    changeCollectionStatus() {
      const params = {
        collObjCode: [this.deviceInfo.deviceCode],
        collObjType: '12',
        optType: this.isCollect ? '2' : '1'
      }
      addOrCancelCollections(params).then((res) => {
        CommonMessage.success(
          this.isCollect ? '执法记录仪取消收藏成功' : '执法记录仪收藏成功'
        )
        this.isCollect = params.optType === '1'
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__pop-recorder-tree-collection-state`,
          params
        )
      })
    },
    // 弹窗播放视频抛出事件
    callRealTimeVideo() {
      this.hightInfo.showRealTimeVideo = !this.hightInfo.showRealTimeVideo
      const list = [
        {
          deviceCode: this.deviceInfo.deviceCode, //设备编号
          channelCode: this.deviceInfo.channelList[0].channelCode, //通道编号
          longitude: this.deviceInfo.longitude, //经度
          latitude: this.deviceInfo.latitude, //维度l
          showClose: true, //是否显示视频关闭按钮
          defaultQuickTool: true
        }
      ]
      if (this.hightInfo.showRealTimeVideo) {
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__recorder-dialog-play-video`,
          { ...this.deviceInfo, visible: true }
        )
      } else {
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__recorder-dialog-play-video`,
          { ...this.deviceInfo, visible: false }
        )
      }
    },

    closeRealTimeVideo(e) {
      if (e.data && e.data.callBackMethod === 'bigScreenPlayerClose') {
        if (e.data.videoData.playVideoNum === 0) {
          this.hightInfo.showRealTimeVideo = false
        }
      }
    },

    callRealTimeTrajectory() {
      const flag = !this.hightInfo.showRealTimeTrajectory
      this.$globalEventBus.$emit(
        `${eventPath.commonCompTrackPopup}__show-close-track-popup`,
        {
          gridTrackPop: flag,
          trajectoryType: 2,
          trajectoryData: {
            deviceType: TREE_ENUM.RECORDER,
            deviceCode: this.deviceInfo.deviceCode
          }
        }
      )
      this.hightInfo.showRealTimeTrajectory = flag
    },

    callHistoryTrajectory() {
      const flag = !this.hightInfo.showHistoryTrajectory
      this.$globalEventBus.$emit(
        `${eventPath.commonCompTrackPopup}__show-close-track-popup`,
        {
          gridTrackPop: flag,
          trajectoryType: 1,
          trajectoryData: {
            deviceType: TREE_ENUM.RECORDER,
            deviceCode: this.deviceInfo.deviceCode
          }
        }
      )
      this.hightInfo.showHistoryTrajectory = flag
    },

    callAroundAnalysis() {
      const flag = !this.hightInfo.showAroundAnalysis
      const payload = {
        visible: flag,
        deviceInfo: {
          type: '1', // '1' 点 默认,'2': 线,'3': 面
          longitude: this.deviceInfo.longitude,
          latitude: this.deviceInfo.latitude,
          geometry: '', // 线资源、面资源需要传，直接把接口返回的传过来就行
          deviceCode: this.deviceInfo.deviceCode
        }
      }
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAroundAnalysis}__visible-change`,
        payload
      )
      this.hightInfo.showAroundAnalysis = flag
    },
    onCloseAroundAnalysis() {
      this.hightInfo.showAroundAnalysis = false
    },
    callOnNav() {
      const payload = {
        open: this.hightInfo.showOnNav ? false : true,
        endPoint: {
          lng: this.deviceInfo.longitude,
          lat: this.deviceInfo.latitude,
          alias: this.deviceInfo.location
        }
      }
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSearchMap}__set-navigation`,
        payload
      )
      this.hightInfo.showOnNav = !this.hightInfo.showOnNav
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
    copyInfo(info) {
      this._copyText(info)
      CommonMessage.success('复制成功')
    },
    handleTabItemClick(index) {
      if (index == this.tabIndex) {
        return
      } else {
        this.tabIndex = index
      }
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
    },
    closeParent() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog_close`,
        {
          type: 'recorder',
          deviceInfo: this.deviceInfo
        }
      )
    },

    close() {
      if (this.showDetail && this.deviceList?.length > 1) {
        this.deviceInfo = {}
        this.showDetail = false
      } else {
        this.$emit('close')
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__recorder_dialog_close`,
          {
            type: 'recorder',
            deviceInfo: this.deviceInfo
          }
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/recorder-dialog';
</style>
