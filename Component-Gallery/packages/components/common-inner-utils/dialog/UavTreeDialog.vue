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
          <i class="deviceicon leftIcon iconfont_tools icon-guotu_wurenji"></i>
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
          <i class="deviceicon leftIcon iconfont_tools icon-guotu_wurenji"></i>
          <h4 v-c-tip.auto="deviceInfo.deviceName">
            {{ deviceInfo.deviceName }}
          </h4>
          <div
            :class="
              deviceInfo.status == 1 || deviceInfo.deviceStatus == 1
                ? 'outline'
                : 'inline'
            "
          >
            {{
              deviceInfo.status == 1 || deviceInfo.deviceStatus == 1
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
        <div class="cont_tab">
          <div class="tab_item_wrap">
            <div
              @click="handleTabItemClick(1)"
              class="tab_item"
              :class="tabIndex == 1 ? 'tab_active' : ''"
              >无人机信息</div
            >
            <div
              @click="handleTabItemClick(2)"
              class="tab_item"
              :class="tabIndex == 2 ? 'tab_active' : ''"
              >无人机图片</div
            >
          </div>
          <div class="tab_bottom_line"></div>
        </div>

        <div class="content-box" v-if="tabIndex == 1">
          <div :class="[bemClass.info]">
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">无人机编号：</span>
              <span :class="[bemClass.value]">
                <span>{{ deviceInfo.deviceCode || '-' }}</span>
                <i
                  @click="copyInfo(deviceInfo.deviceCode || '-')"
                  class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                ></i>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">无人机厂家：</span>
              <span :class="[bemClass.value]">
                <span>{{ deviceInfo.modelName || '-' }}</span>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">无人机地址：</span>
              <span :class="[bemClass.value]">
                <span v-c-tip.auto="deviceInfo.location">
                  {{ deviceInfo.location }}
                </span>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">无人机挂高：</span>
              <span :class="[bemClass.value]">
                <span>
                  {{ deviceInfo.height ? deviceInfo.height + 'm' : '-' }}
                </span>
              </span>
            </div>
          </div>
          <div
            v-if="deviceInfo.channelList && deviceInfo.channelList.length"
            :class="[
              bemClass.info,
              bemClass.channelInfo,
              deviceInfo?.channels?.length > 2 ? 'no_right' : ''
            ]"
          >
            <div class="tongdao_cont_wrap">
              <div
                v-for="(channelItem, index) in deviceInfo.channelList"
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
                      <span v-c-tip="channelItem.channelName">
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
                      <span v-c-tip="channelItem.channelCode">
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

        <div
          class="cont_tab_right"
          :class="
            deviceInfo?.channelList?.length < 2
              ? 'cont_tab_right_short'
              : 'cont_tab_right_height'
          "
          v-if="tabIndex == 2"
        >
          <div
            v-if="fileList?.length"
            class="carousel-wrapper"
            v-show="tabIndex == 2"
          >
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
                  v-if="!isImage(item) && index === fileIndex"
                  preload="metadata"
                  controls
                  autoplay
                >
                  <source :src="item" type="video/mp4" />
                  <track
                    src=""
                    kind="subtitles"
                    srclang="cn"
                    label=""
                    default
                  />
                </video>
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
            @click="callRealTimeVideo"
            :class="[
              'iconfont_tools',
              hightInfo.showRealTimeVideo
                ? 'icon-tongyong_icon_shishishipin_s_30 active'
                : 'icon-tongyong_icon_shishishipin_n_30'
            ]"
            v-c-tip="'实时视频'"
          ></i>

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
      :urlList="carouselList"
      :initial-index="fileIndex"
      :onClose="handleImageViewerClose"
    />
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  getUavDevicesBySiteCode,
  forestryQryUavDeviceInfo
} from '../request/API/index'
import { addOrCancelCollections } from '../request/API/IotRequest'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'
import CommonMessage from '../funCommon/message/common-message'
import { createNameSpace } from '../bem/create'

const bem = createNameSpace('uav-tree-dialog')
export default {
  name: 'd-uav-tree-dialog',
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
      default: 'c53946b494c249bf82f45f254b666fc1'
    },
    deviceCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    carouselList() {
      return this.fileList.length === 2
        ? [...this.fileList, ...this.fileList]
        : this.fileList
    },
    bemClass() {
      return {
        container: bem.b(''),
        title: bem.b('title'),
        body: bem.b('body'),
        info: bem.b('info'),
        channelInfo: bem.b('channelInfo'),
        item: bem.b('item'),
        label: bem.be('item', 'label'),
        value: bem.be('item', 'value'),
        footer: bem.b('footer'),
        ul: bem.b('ul-list')
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
      deviceList: [], // 无人机设备列表
      showDetail: false,
      deviceInfo: {
        deviceCode: null,
        deviceName: null,
        status: 0,
        deviceStatus: 0,
        height: null,
        channels: [],
        channelList: [],
        fileUrlList: [],
        modelName: null,
        longitude: null,
        latitude: null,
        location: null
      },
      parentLeft: -184,
      isCollect: false,
      hightInfo: {
        showRealTimeVideo: false,
        showRealTimeTrajectory: false,
        showHistoryTrajectory: false,
        showAroundAnalysis: false,
        showOnNav: false
      },
      openedChannels: [],
      tabIndex: 1,
      fileList: [],
      fileIndex: 0,
      showImageViewer: false
    }
  },
  mounted() {
    this.getDeviceInfo()
    // 收藏状态监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompUavTree}__tree-click-collection-state`,
      (payload) => {
        if (payload?.collObjCode[0] === this.deviceInfo.deviceCode) {
          this.isCollect = payload.optType === '1'
        }
      }
    )

    this.$globalEventBus.$on(
      `${eventPath.commonCompUavTree}__tree-click-history-trajectory`,
      (payload) => {
        this.hightInfo.showRealTimeTrajectory = false
        this.hightInfo.showHistoryTrajectory = payload
      }
    )

    this.$globalEventBus.$on(
      `${eventPath.commonCompUavTree}__tree-click-real-trajectory`,
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

    this.$globalEventBus.$on(
      `${eventPath.commonCompUavTree}__close-dialog`,
      (options) => {
        if (options?.closeUavTreeDialog) {
          this.closeParent()
        }
      }
    )

    window.addEventListener('message', this.playerCallBack)
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
      `${eventPath.commonCompUavTree}__tree-click-history-trajectory`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompUavTree}__tree-click-real-trajectory`
    )
    this.$globalEventBus.$off(`${eventPath.commonCompUavTree}__close-dialog`)

    window.removeEventListener('message', this.playerCallBack)
  },
  methods: {
    getDeviceInfo() {
      // 周边分析传值
      if (this.deviceCode) {
        this.getDeviceDetail({ deviceCode: this.deviceCode })
        return
      }
      const param = {
        siteCode: this.siteCode,
        queryType: 1
      }
      getUavDevicesBySiteCode(param)
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
        deviceCode: deviceInfo.deviceCode,
        queryType: 1
      }
      // 查询无人机详情
      forestryQryUavDeviceInfo(param)
        .then((res) => {
          if (res.code == '200' && res.data) {
            this.deviceInfo = res.data
            this.isCollect = res.data.isMonitor === '1'
            this.showDetail = true
            this.fileList = []
            if (this.deviceInfo.fileUrlList?.length) {
              this.deviceInfo.fileUrlList.forEach((ele) => {
                this.fileList.push(ele)
              })
            }
          } else {
            console.error('点位详情接口未返回数据！')
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
      item['layerType'] = 4
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
        collObjType: '11',
        optType: this.isCollect ? '2' : '1'
      }
      addOrCancelCollections(params).then((res) => {
        CommonMessage.success(
          this.isCollect ? '无人机取消收藏成功' : '无人机收藏成功'
        )
        this.isCollect = params.optType === '1'
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__pop-uav-tree-collection-state`,
          params
        )
      })
    },

    callRealTimeVideo() {
      if (this.judgeChannelsOnline().length > 0) {
        this.hightInfo.showRealTimeVideo = !this.hightInfo.showRealTimeVideo
        if (this.hightInfo.showRealTimeVideo) {
          this.openedChannels = this.deviceInfo.channelList.filter(
            (item) => item.status == 0
          )
        } else {
          this.openedChannels = []
        }
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__uav-tree-dialog-play-video`,
          { ...this.deviceInfo, visible: this.hightInfo.showRealTimeVideo }
        )
      } else {
        return CommonMessage.warning(`设备通道离线，无法播放`)
      }
    },

    judgeChannelsOnline() {
      let channels_ = this.deviceInfo.channelList
      return channels_.filter((item) => item.status == 0)
    },

    playerCallBack(bcData) {
      if (bcData.data?.callBackMethod == 'bigScreenPlayerClose') {
        let videoData = bcData.data.videoData
        let channelCode_ = videoData.channelCode
        if (
          videoData.deviceCode == this.deviceInfo.deviceCode &&
          this.openedChannels.length > 0
        ) {
          this.closeRealTimeVideo(channelCode_)
        }
      }
    },

    closeRealTimeVideo(channelCode_) {
      let index = this.openedChannels.findIndex(
        (item) => item.channelCode == channelCode_
      )
      if (index > -1) {
        this.openedChannels.splice(index, 1)
        if (this.openedChannels.length == 0) {
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
            deviceType: 4,
            deviceCode: this.deviceInfo.deviceCode
          }
        }
      )
      this.hightInfo.showRealTimeTrajectory = flag
    },

    callHistoryTrajectory() {
      const flag = !this.hightInfo.showHistoryTrajectory
      if (flag) {
        this.$emit('close')
      }
      this.$globalEventBus.$emit(
        `${eventPath.commonCompTrackPopup}__show-close-track-popup`,
        {
          gridTrackPop: flag,
          trajectoryType: 1,
          trajectoryData: {
            deviceType: 4,
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
      }
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
    },

    closeParent() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog_close`,
        {
          type: 'uav',
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
          `${eventPath.commonInnerUtils}__dialog_close`,
          {
            type: 'uav',
            deviceInfo: this.deviceInfo
          }
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/uav-tree-tab-dialog';
</style>
