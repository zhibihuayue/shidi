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
            class="deviceicon leftIcon iconfont_tools icon-linye_icon_dibugongneng_shexiangji_n"
          ></i>
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
          <h4>{{ deviceInfo.devName }}</h4>
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
        <div :class="[bemClass.tab]">
          <div :class="[bemClass.tabWrap]">
            <div
              @click="handleTabItemClick(1)"
              :class="
                tabIndex == 1
                  ? `${[bemClass.tabItem]} tab_active`
                  : [bemClass.tabItem]
              "
              >摄像机信息</div
            >
            <div
              @click="handleTabItemClick(2)"
              :class="
                tabIndex == 2
                  ? `${[bemClass.tabItem]} tab_active`
                  : [bemClass.tabItem]
              "
              >摄像机图片</div
            >
          </div>
          <div :class="[bemClass.tabLine]" class="tab_bottom_line"></div>
        </div>

        <div
          v-show="tabIndex == 1"
          :class="deviceInfo?.channels?.length < 2 ? 'h193' : 'h245'"
        >
          <div :class="[bemClass.top]">
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">摄像机编号：</span>
              <span :class="[bemClass.value]">
                <el-tooltip
                  placement="top"
                  :open-delay="300"
                  :content="deviceInfo.deviceCode"
                  popper-class="common-iw-s gateway-camera-dialog-el-tip"
                >
                  <span>{{ deviceInfo.deviceCode || '-' }}</span>
                </el-tooltip>
                <i
                  @click="copyInfo(deviceInfo.deviceCode || '-')"
                  class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                ></i>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">摄像机厂家：</span>
              <span :class="[bemClass.value]">
                <el-tooltip
                  placement="top"
                  :open-delay="300"
                  :content="deviceInfo.manufacturerName"
                  popper-class="common-iw-s gateway-camera-dialog-el-tip"
                >
                  <span>{{ deviceInfo.manufacturerName || '-' }}</span>
                </el-tooltip>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">摄像机地址：</span>
              <span :class="[bemClass.value]">
                <el-tooltip
                  placement="top"
                  :open-delay="300"
                  :content="deviceInfo.location"
                  popper-class="common-iw-s gateway-camera-dialog-el-tip"
                >
                  <span>{{ deviceInfo.location || '-' }}</span>
                </el-tooltip>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">摄像机挂高：</span>
              <span :class="[bemClass.value]">
                <el-tooltip
                  placement="top"
                  :open-delay="300"
                  :content="deviceInfo.height"
                  popper-class="common-iw-s gateway-camera-dialog-el-tip"
                >
                  <span>{{ deviceInfo.height || '-' }}</span>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div class="tong-count">
            <div class="count-wrap">
              <div
                v-if="deviceInfo.channels && deviceInfo.channels.length"
                :class="[bemClass.info, bemClass.channelInfo]"
              >
                <div
                  v-for="(channelItem, index) in deviceInfo.channels"
                  :key="index"
                  class="channelsBox"
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
                        <el-tooltip
                          placement="top"
                          :open-delay="300"
                          :content="channelItem.channelName"
                          popper-class="common-iw-s gateway-camera-dialog-el-tip"
                        >
                          <span>
                            {{ channelItem.channelName }}
                          </span>
                        </el-tooltip>
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
                        <el-tooltip
                          placement="top"
                          :open-delay="300"
                          :content="channelItem.channelCode"
                          popper-class="common-iw-s gateway-camera-dialog-el-tip"
                        >
                          <span>
                            {{ channelItem.channelCode }}
                          </span>
                        </el-tooltip>
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
            deviceInfo?.channels?.length < 2
              ? `${[bemClass.imgData]} h193`
              : `${[bemClass.imgData]} h245`
          "
        >
          <div v-if="fileList.length" class="carousel-wrapper">
            <el-carousel
              @change="getFileIndex"
              :autoplay="false"
              trigger="click"
              :arrow="fileList.length > 1 ? 'always' : 'never'"
            >
              <el-carousel-item v-for="(item, index) in fileList" :key="item">
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
          <em
            @click="callRealTimeVideo"
            :class="[
              'iconfont_tools',
              hightInfo.showRealTimeVideo
                ? 'icon-icon_shishishipin_30_s active'
                : 'icon-icon_shishishipin_30_n'
            ]"
            v-c-tip="'实时视频'"
          ></em>
          <em
            @click="callViewshed"
            :class="[
              'iconfont_tools',
              hightInfo.showViewshed
                ? 'icon-icon_keshiyu_30_s active'
                : 'icon-icon_keshiyu_30_n'
            ]"
            v-c-tip="'可视域'"
          ></em>
          <em
            @click="openConnect"
            :class="[
              'iconfont_tools',
              this.hightInfo.showWarnObj
                ? 'icon-icon_guanlian_20_s active'
                : 'icon-icon_guanlian_20_n'
            ]"
            v-c-tip="'关联事件'"
          ></em>
          <em
            @click="callAroundAnalysis"
            :class="[
              'iconfont_tools',
              hightInfo.showAroundAnalysis
                ? 'icon-tongyong_icon_zhoubianfenxi_s_30 active'
                : 'icon-tongyong_icon_zhoubianfenxi_n_30'
            ]"
            v-c-tip="'周边分析'"
          ></em>

          <em
            @click="callOnNav"
            :class="[
              'iconfont_tools',
              hightInfo.showOnNav
                ? 'icon-tongyong_icon_daozheli_s_30 active'
                : 'icon-tongyong_icon_daozheli_n_30'
            ]"
            v-c-tip="'到这里'"
          ></em>
          <em
            @click="callCaptureRecord"
            :class="[
              'iconfont_tools',
              disableRelEvent && 'disabled',
              hightInfo.showCaptureRecord
                ? 'icon-guanliandanchuangmian active'
                : 'icon-guanliandanchuang'
            ]"
            v-c-tip="'关联实时抓拍记录'"
          ></em>
        </div>
      </div>
    </absolute-container>
    <image-viewer
      v-if="showImageViewer"
      :urlList="fileList"
      :initial-index="fileIndex"
      :onClose="handleImageViewerClose"
    />
  </div>
</template>

<script>
import { $playerFit } from '../funCommon/playerFit.js'
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  getCameraList,
  forestryQueryDeviceForWE,
  updatemonitorCollect,
  getDeviceImage
} from '../request/API/index'
import { getInlineStore } from '../funCommon/inlineStore'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'
import CommonMessage from '../funCommon/message/common-message'
import { createNameSpace } from '../bem/create'

import { getUrlHead, $v } from '../funCommon/common'

const bem = createNameSpace('gateway-camera-dialog')
export default {
  name: 'd-gateway-camera-dialog',
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
    payload: {
      type: Object,
      default: null
    },
    isFullRel: {
      type: Boolean,
      default: false
    }
  },
  inject: ['hasAlarmList'],
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
      deviceList: [], // 卡口相机列表
      fileList: [], // 图片列表
      showDetail: false,
      deviceInfo: {},
      parentLeft: -184,
      isCollect: false,
      hightInfo: {
        showRealTimeVideo: false, // 实时视频
        showViewshed: true, // 可视域
        showWarnObj: false, // 关联事件
        showAroundAnalysis: false, // 周边分析
        showOnNav: false, // 到这里
        showCaptureRecord: false
      },
      tabIndex: 1,
      showImageViewer: false,
      fileIndex: 0,
      disableRelEvent: false
    }
  },
  mounted() {
    this.disableRelEvent = !getInlineStore('snapListExists')
    this.hightInfo.showCaptureRecord = this.isFullRel
    this.getDeviceInfo()
    this._devTrwwCollect = (data) => {
      if (data.devCode == this.deviceInfo.deviceCode) {
        this.isCollect = data.isMonitor === '1'
      }
    }
    // 收藏状态监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompCardDevTree}__dev-trww-collect`,
      this._devTrwwCollect
    )

    this._devTrwwisFullRelChange = (status) => {
      this.hightInfo.showCaptureRecord = status
    }
    // 关联实时抓拍记录改变监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompCardDevTree}__dev-trww-isFullRel-change`,
      this._devTrwwisFullRelChange
    )

    // 监听周边分析弹窗状态
    this.$globalEventBus.$on(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )

    this._closeNavigation = (res) => {
      this.hightInfo.showOnNav = !res.close
    }
    // 到这里弹窗监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompSearchMap}__close-navigation`,
      this._closeNavigation
    )

    window.addEventListener('message', this.closeRealTimeVideo)
  },
  beforeDestroy() {
    this.$globalEventBus.$off(
      `${eventPath.commonCompCardDevTree}__dev-trww-collect`,
      this._devTrwwCollect
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompCardDevTree}__dev-trww-isFullRel-change`,
      this._devTrwwisFullRelChange
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`,
      this._closeNavigation
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )

    window.removeEventListener('message', this.closeRealTimeVideo)
  },
  methods: {
    getDeviceInfo() {
      if (
        this.deviceCode &&
        (!this.payload?.markerInfo?.list ||
          this.payload?.markerInfo?.list.length <= 1)
      ) {
        this.getDeviceDetail({ deviceCode: this.deviceCode })
      } else if (this.siteCode) {
        const param = {
          siteCode: this.siteCode,
          categoryCode: 5
        }
        getCameraList(param)
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
      } else {
        // sonar要求必须有else
        console.log('不用处理')
      }
    },

    getDeviceDetail(deviceInfo) {
      let param = {
        deviceCode: deviceInfo.deviceCode,
        isVideoFirst: true
      }
      this._getDeviceImage(deviceInfo.deviceCode)
      // 查询卡口相机详情
      forestryQueryDeviceForWE(param)
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
    _getDeviceImage(deviceCode) {
      getDeviceImage({ deviceCode }).then((res) => {
        if (res.code === 200) {
          this.fileList = res.data
        }
      })
    },

    chooseDevice(item) {
      // 列表切换设备详情
      this.parentLeft = 125
      this.showDetail = true
      this.getDeviceDetail(item)
    },

    changeCollectionStatus() {
      const params = {
        collObjCode: [this.deviceInfo.deviceCode],
        collObjType: '5',
        optType: this.isCollect ? '0' : '1' // 1收藏 0取消收藏
      }
      updatemonitorCollect(params).then((res) => {
        CommonMessage.success(
          this.isCollect ? '卡口相机取消收藏成功' : '卡口相机收藏成功'
        )
        this.isCollect = !this.isCollect

        this.$globalEventBus.$emit(
          `${eventPath.commonCompCardDevTree}__dev-info-window-status-change`,
          {
            deviceCode: this.deviceInfo.deviceCode,
            status: this.isCollect
          }
        )
      })
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
    // 实时视频
    callRealTimeVideo() {
      let _channels = (this.deviceInfo.channels || []).filter(
        (item) => item.status == 0
      )
      let flag = !this.hightInfo.showRealTimeVideo
      if (_channels.length) {
        this.hightInfo.showRealTimeVideo = flag
        if (!flag) {
          this.opendChannels = []
          $playerFit.close()
        } else {
          this.opendChannels = _channels
          this._playVideo()
        }
        // this.$globalEventBus.$emit(
        //   `${eventPath.commonInnerUtils}__camera-dialog-play-video`,
        //   { ...this.deviceInfo, visible: flag }
        // )
      } else {
        CommonMessage.warning(`设备通道离线，无法播放`)
      }
    },
    _playVideo() {
      // 以下计算从摄像机树抄来的，具体含义未知
      const bottom = 112
      const top = 0
      const overallHeight = window.innerHeight
      const height = overallHeight - bottom - top
      const videoListNeedHeight = (214 + 12) * 3
      let scale = 1
      if (height < videoListNeedHeight) {
        scale = (height / 3 - 12) / 214
      }
      let marginX = 52 * scale
      // 林区卡口的宽度是4rem，转换为px + 快捷功能宽度
      let _right =
        this._getElStyle(document.documentElement, 'fontSize') * 4 + 80 + 'px'
      $playerFit.right(
        this.deviceInfo.channels.map((dev) => {
          dev.openQuickTool = true
          return dev
        }),
        'append',
        {
          checked: 'red',
          bottom: (116 * window.innerHeight) / (1080 - 52),
          bHeight: (214 + 12) * 3,
          margin: [marginX, 12],
          right: _right
        }
      )
    },
    _getElStyle(el, key) {
      return parseFloat(window.getComputedStyle(el, null)[key])
    },
    // 可视域
    callViewshed() {
      if (this.deviceInfo.status == '1') {
        // 离线设备
        return CommonMessage.warning(`离线设备无法查看可视域`)
      }
      let flag = !this.hightInfo.showViewshed
      this.hightInfo.showViewshed = flag
      this.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__viewshed-operate`,
        { status: flag, list: [this.deviceInfo] }
      )
      this.$globalEventBus.$emit(
        `${eventPath.commonCompCardDevTree}__viewshed-operate`,
        flag
      )
    },
    // 关联实时抓拍记录
    callCaptureRecord() {
      if (this.disableRelEvent) {
        return
      }
      let flag = !this.hightInfo.showCaptureRecord
      this.hightInfo.showCaptureRecord = flag
      let params = ''
      if (flag) {
        let _channelCodes = this.deviceInfo.channels.map(
          (item) => item.channelCode
        )
        params = {
          channelCodes: _channelCodes
        }
      }
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSnapList}__visible-filter`,
        params
      )
      this.$globalEventBus.$emit(
        `${eventPath.commonCompCardDevTree}__dev-info-window-status-change`,
        {
          key: 'isFullRel',
          deviceCode: this.deviceInfo.deviceCode,
          status: flag,
          values: [true, false]
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
          type: 'recorder',
          deviceInfo: this.deviceInfo
        }
      )
    },

    openConnect() {
      let flag = !this.hightInfo.showWarnObj
      this.hightInfo.showWarnObj = flag
      if (this.hasAlarmList) {
        this.$globalEventBus.$emit(`${eventPath.commonCompAlarmFilte}__open`, {
          devices: [{ devType: 1, code: this.deviceInfo.deviceCode }],
          state: flag
        })
      } else if (flag) {
        // 打开控制台
        const urlHead = getUrlHead()
        const params = { dc: this.deviceInfo.deviceCode }
        $v.openPage(urlHead + '/eventManagement', params)
      } else {
        // sonar要求必须有else
        console.log('不用处理')
      }
    },
    closeRealTimeVideo(e) {
      if (!e.data) {
        return
      }
      if (e.data.callBackMethod === 'bigScreenPlayerClose') {
        // 单通道视频关闭
        const { videoData } = e.data
        this.opendChannels = this.opendChannels.filter((i) => {
          return i.channelCode !== videoData.channelCode
        })
        if (!this.opendChannels.length) {
          this.hightInfo.showRealTimeVideo = false
        }
      }
    },
    close() {
      if (this.showDetail && this.deviceList?.length > 1) {
        this.deviceInfo = {}
        this.showDetail = false
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/gateway-camera-dialog';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.gateway-camera-dialog-el-tip {
  transform: translateY(px-to-rem(14));

  .popper__arrow {
    display: none;
  }
}
</style>
