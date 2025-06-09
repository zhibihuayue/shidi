<template>
  <div class="camera_vue_comp_infowindow">
    <div class="camera_vue_comp_infowindow_list" v-show="isHaveList">
      <div class="close_icon" @click="handleCloseIconClick"> </div>
      <div class="previous-vacancies"></div>
      <div class="list_item_wrap">
        <div
          class="list_item"
          :class="item.status == '0' ? 'list_online' : 'list_offline'"
          v-for="(item, index) in cameraList"
          :key="index"
          @click="handleListItemClick(item)"
        >
          <div class="icon_name">
            <i
              class="camera_icon_list iconfont_tools icon-linye_icon_dibugongneng_shexiangji_n"
            ></i>
            <div
              class="list_item_name"
              :c-tip="item.deviceName"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ item.deviceName }}</div
            >
          </div>
          <div class="height">{{ item.height }}m</div>
        </div>
      </div>
    </div>
    <div
      v-show="deviceInfo.deviceCode"
      class="camera_vue_comp_infowindow_cont"
      :class="isHaveList ? 'have_camera_list' : ''"
    >
      <div class="content">
        <div class="previous-vacancies"></div>
        <div class="header">
          <div class="header_cont">
            <div class="name"
              ><i
                class="camera_icon iconfont_tools icon-linye_icon_dibugongneng_shexiangji_n"
              ></i>
              <span
                :c-tip="deviceInfo.deviceName"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ deviceInfo.devName }}</span
              >
            </div>
            <div class="type">
              <span
                class="is_online"
                :class="deviceInfo.status == 0 ? 'online' : 'offline'"
              >
                {{ deviceInfo.status == 0 ? '在线' : '离线' }}
              </span>
              <span class="shoucang">
                <i
                  @click="handleAddOrCancelCollections"
                  :class="
                    deviceInfo.isMonitor == '1'
                      ? 'select iconfont_tools icon-tongyong_icon_shoucang_20_s'
                      : 'iconfont_tools icon-tongyong_icon_shoucang_20_n'
                  "
                >
                </i>
              </span>
            </div>
          </div>
          <div class="close_icon" @click="handleCloseIconClick"></div>
        </div>
        <div class="cont">
          <div class="cont_tab">
            <div class="tab_item_wrap">
              <div
                @click="handleTabItemClick(1)"
                class="tab_item"
                :class="tabIndex == 1 ? 'tab_active' : ''"
                >摄像机信息</div
              >
              <div
                @click="handleTabItemClick(2)"
                class="tab_item"
                :class="tabIndex == 2 ? 'tab_active' : ''"
                >摄像机图片</div
              >
            </div>
            <div class="tab_bottom_line"></div>
          </div>
          <div
            class="cont_tab_left"
            :class="deviceInfo?.channels?.length < 2 ? 'h193' : 'h245'"
            v-show="tabIndex == 1"
          >
            <div class="cont_tab_top">
              <div class="spot-item">
                <div class="spot-name">摄像机编号：</div>
                <div class="spot-value">
                  <span
                    class="spot-value_inner"
                    :c-tip="deviceInfo.deviceCode"
                    c-tip-placement="top"
                    c-tip-class="c-tip-normal"
                    >{{ deviceInfo.deviceCode }}</span
                  >
                  <i
                    @click="handleCopy(deviceInfo.deviceCode)"
                    class="iconfont_tools icon-fuzhiicon fiuzhi_iocn"
                  ></i>
                </div>
              </div>
              <div class="spot-item">
                <div class="spot-name">摄像机厂家：</div>
                <div class="spot-value">
                  <span
                    class="spot-value_inner"
                    :c-tip="deviceInfo.modelName"
                    c-tip-placement="top"
                    c-tip-class="c-tip-normal"
                    >{{ deviceInfo.modelName }}</span
                  >
                </div>
              </div>
              <div class="spot-item">
                <div class="spot-name">摄像机地址：</div>
                <div class="spot-value">
                  <span
                    class="spot-value_inner"
                    :c-tip="deviceInfo.location"
                    c-tip-placement="top"
                    c-tip-class="c-tip-normal"
                    >{{ deviceInfo.location }}</span
                  >
                </div>
              </div>
              <div class="spot-item">
                <div class="spot-name">摄像机挂高：</div>
                <div class="spot-value">
                  <span class="spot-value_inner">{{ deviceInfo.height }}m</span>
                </div>
              </div>
              <div class="top_cont_line"></div>
            </div>
            <div
              class="tongdao_cont"
              :class="deviceInfo?.channels?.length > 2 ? '' : 'need_right'"
            >
              <div class="tongdao_cont_wrap">
                <div
                  class="channel_item_wrap"
                  :key="cItem.channelCode"
                  v-for="cItem in deviceInfo.channels"
                >
                  <div
                    class="spot-item"
                    :class="cItem.status == 0 ? 'is_online_c' : 'is_offline_c'"
                  >
                    <div class="spot-name">通道名称：</div>
                    <div class="spot-value">
                      <span
                        class="spot-value_inner"
                        :c-tip="cItem.channelName"
                        c-tip-placement="top"
                        c-tip-class="c-tip-normal"
                        >{{ cItem.channelName }}</span
                      >
                      <i
                        @click="handleCopy(cItem.channelName)"
                        class="iconfont_tools icon-fuzhiicon fiuzhi_iocn"
                      ></i>
                    </div>
                  </div>
                  <div class="spot-item">
                    <div class="spot-name">通道编号：</div>
                    <div class="spot-value">
                      <span
                        class="spot-value_inner"
                        :c-tip="cItem.channelCode"
                        c-tip-placement="top"
                        c-tip-class="c-tip-normal"
                        >{{ cItem.channelCode }}</span
                      >
                      <i
                        @click="handleCopy(cItem.channelCode)"
                        class="iconfont_tools icon-fuzhiicon fiuzhi_iocn"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="cont_tab_right"
            :class="
              deviceInfo?.channels?.length < 2
                ? 'cont_tab_right_short'
                : 'cont_tab_right_height'
            "
            v-show="tabIndex == 2"
          >
            <div v-if="fileList?.length" class="carousel-wrapper">
              <el-carousel
                @change="getFileIndex"
                :autoplay="false"
                trigger="click"
                :arrow="fileList.length > 1 ? 'always' : 'never'"
              >
                <el-carousel-item
                  v-for="(item, index) in fileList"
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
        </div>
        <div class="footer">
          <div class="f_cont">
            <i
              v-for="item in footerIcons"
              :key="item.name"
              @click="handleFooterIconClick(item)"
              :c-tip="item.title"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              class="iconfont_tools"
              :class="item.isActive ? `active ${item.actIcon}` : `${item.icon}`"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <device-info-detail
      v-show="xxxxVisiable"
      :deviceInfo="deviceInfo"
      :isHaveList="isHaveList"
      @detailClose="handleDetailClose"
    ></device-info-detail>
    <image-viewer
      v-if="showImageViewer"
      :urlList="fileList"
      :initial-index="fileIndex"
      :onClose="handleImageViewerClose"
    />
  </div>
</template>

<script>
import CTMapOl from '@ct/ct_map_ol'
const { style, format, layer, source, proj, geom, Feature, Overlay } = CTMapOl
const { fromLonLat } = proj
import { setupCTips } from '../../funCommon/c-tip'
import eventPath from '@component-gallery/build-event-bus-path'
import { openKanzheli } from '../../mapCommon/kanzheli.js'
import ImageViewer from './ImageViewer.vue'
// import { postMsgUtil } from '@ct/iframe-connect-sdk'
import newMessage from '../../funCommon/message/common-message'
import { getInlineStore } from '../../funCommon/inlineStore'
import { $v, getUrlHead } from '../../funCommon/common'
import { $playerFit } from '../../funCommon/playerFit.js'
import DeviceInfoDetail from './DeviceInfoDetail.vue'
import {
  queryDeviceForWE,
  getCameraList,
  getDeviceImage,
  addOrCancelCollections,
  getVideoListForWoodProcessingPlant
} from './service/index'
export default {
  name: 'CameraTreeInfoWindow',
  components: {
    ImageViewer,
    DeviceInfoDetail
  },
  data() {
    return {
      deviceInfo: {},
      mapInstance: null,
      cameraPopup: null,
      lastKanzheliClose: null,
      showImageViewer: false,
      fileList: [],
      fileIndex: 0,
      footerIcons: [
        {
          title: 'AR视频',
          icon: 'icon-icon_AR_30_n',
          actIcon: 'icon-icon_AR_30_n',
          name: 'arsp'
        },
        {
          title: '实时视频',
          icon: 'icon-icon_shishishipin_30_n',
          actIcon: 'icon-icon_shishishipin_30_s',
          name: 'sssp',
          isActive: false
        },
        {
          title: '可视域',
          icon: 'icon-icon_keshiyu_30_n',
          actIcon: 'icon-icon_keshiyu_30_s',
          name: 'ksy',
          isActive: false
        },
        {
          title: '看这里',
          icon: 'icon-icon_kanzheli_30_n',
          actIcon: 'icon-icon_kanzheli_30_s',
          name: 'kzl',
          isActive: false
        },
        {
          title: '关联事件',
          icon: 'icon-icon_guanlian_20_n',
          actIcon: 'icon-icon_guanlian_20_s',
          name: 'glsj',
          isActive: false
        },
        {
          title: '周边分析',
          icon: 'icon-icon_zhoubianfenxi_30_n',
          actIcon: 'icon-icon_zhoubianfenxi_30_s',
          name: 'zbfx',
          isActive: false
        },
        {
          title: '到这里',
          icon: 'icon-icon_daozheli_30_n',
          actIcon: 'icon-icon_daozheli_30_s',
          name: 'dzl',
          isActive: false
        },
        {
          title: '详细信息',
          icon: 'icon-icon_dikuaixiangqing_n',
          actIcon: 'icon-icon_dikuaixiangqing_s',
          name: 'xxxxi',
          isActive: false
        }
      ],
      tabIndex: 1,
      cameraList: [],
      opendChannels: [],
      xxxxVisiable: false
    }
  },
  props: {
    cameraPropData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    isHaveList() {
      return this.cameraList.length > 1
    }
  },
  methods: {
    initEvent() {
      let mapInstance = this.cameraPropData.mapRef.getMapRef(
        this.cameraPropData.mapId
      ).mapInstance
      this.mapInstance = mapInstance
      this.$globalEventBus.$on(
        `${eventPath.commonInnerUtils}__camera_pop_footer_active`,
        this.handleAcceptForFooter
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompTree}__tree-click-collection-state`,
        this.handleTreeColl
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompTree}__tree-node-play-status`,
        this.handleTreePlay
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompAroundAnalysis}__close`,
        () => {
          // 关闭周边分析
          this.footerIcons.forEach((item) => {
            if (item.name === 'zbfx') {
              this.$set(item, 'isActive', false)
            }
          })
        }
      )
      // 关闭到这里
      this.$globalEventBus.$on(
        `${eventPath.commonCompSearchMap}__close-navigation`,
        (data) => {
          if (data.close) {
            // 关闭周边分析
            this.footerIcons.forEach((item) => {
              if (item.name === 'dzl') {
                this.$set(item, 'isActive', false)
              }
            })
            this.$globalEventBus.$emit(
              `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
              {
                layerId: '1',
                status: false
              }
            )
          }
        }
      )
      window.addEventListener('message', this.playerCallBack)
      this.handleIsAr()
    },
    // 监控视频弹窗关闭事件回调
    playerCallBack(bcData) {
      if (bcData.data?.callBackMethod == 'bigScreenPlayerClose') {
        console.log('bcData', bcData.data)
        let videoData = bcData.data.videoData
        let channelCode_ = videoData.channelCode
        if (
          videoData.deviceCode == this.deviceInfo.deviceCode &&
          this.opendChannels.length > 0
        ) {
          let index = this.opendChannels.findIndex(
            (item) => item.channelCode == channelCode_
          )
          if (index > -1) {
            this.opendChannels.splice(index, 1)
            let findOne = this.footerIcons.find((item) => item.name == 'sssp')
            // findOne.isActive = this.opendChannels.length != 0
            if (this.opendChannels.length == 0) {
              findOne.isActive = false
            } else {
              findOne.isActive = true
            }
          }
        }
      }
    },
    // 底部功能样式
    handleAcceptForFooter(data) {
      let findOne = this.footerIcons.find((item) => item.name == data.name)
      findOne.isActive = data.isActive
    },
    async handleGetInfo() {
      let params = {
        siteCode: this.cameraPropData.siteCode
      }
      if (this.cameraPropData.siteCode) {
        // 有站点值
        let API
        if (this.cameraPropData.isWoodPlant) {
          API = getVideoListForWoodProcessingPlant
        } else {
          API = getCameraList
        }
        let cameraLlistRes = await API(params)
        const rows = cameraLlistRes.rows || cameraLlistRes.data
        if (rows?.length == 1) {
          let deviceCode = rows[0].deviceCode
          this.getDeviceInfo(deviceCode)
        } else {
          // 展示列表
          this.cameraList = rows
          let position = [
            +this.cameraList[0].longitude,
            +this.cameraList[0].latitude
          ]
          this.mountMapOverlay(position)
          // this.cameraPopup.setPosition(fromLonLat(position))
        }
      } else if (
        !this.cameraPropData.siteCode &&
        this.cameraPropData.deviceCode
      ) {
        // 只有设备编码
        this.getDeviceInfo(this.cameraPropData.deviceCode)
        this.cameraList = []
      }
    },
    getDeviceInfo(deviceCode, from) {
      this.handleDetailClose()
      let params = {
        deviceCode
      }
      queryDeviceForWE(params).then((res) => {
        console.log('queryDeviceForWE', res)
        if (res.code == '200') {
          this.deviceInfo = res.data
          this.deviceInfo['longitude_d'] = res.data.longitude
            ? Number(res.data.longitude).toFixed(6)
            : null
          this.deviceInfo['latitude_d'] = res.data.latitude
            ? Number(res.data.latitude).toFixed(6)
            : null
          // let mockData = ['胜多负少', '水电费是的水电费是的', 'sdfsd', '不认识', '胜多负少', '水电费是的', 'sdfsd', '不认识', '胜多负少', '水电费是的', 'sdfsd', '不认识']
          // let mockData = ['胜多负少']
          // this.deviceInfo.labelNameList = mockData
          if (this.deviceInfo.status == '0') {
            // 激活可视域属性
            let findOne = this.footerIcons.find((item) => item.name == 'ksy')
            findOne.isActive = this.cameraPropData.viewshedStatus
          }
          // let mapPos = this.cameraPopup.getPosition()
          // if (mapPos) return
          let position = [+res.data.longitude, +res.data.latitude]
          // this.cameraPopup.setPosition(fromLonLat(position))
          if (!from) {
            this.mountMapOverlay(position)
          }
          this.handleSsp()
        }
      })
      getDeviceImage(params).then((res) => {
        if (res.code === 200) {
          this.fileList = res.data
        }
      })
    },
    handleListItemClick(item) {
      if (item.deviceCode == this.deviceInfo.deviceCode) return
      this.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__marker-select`,
        {
          deviceCode: item.deviceCode,
          isSelected: true,
          props: { layerType: '1' }
        }
      )
      this.getDeviceInfo(item.deviceCode, 'fromList')
    },
    handleTabItemClick(index) {
      if (index == this.tabIndex) return
      this.tabIndex = index
    },
    judgeChannelsOnline() {
      let channels_ = this.deviceInfo.channels
      return channels_.filter((item) => item.status == 0)
    },

    handleFooterIconClick(item) {
      let zIndex = 100
      switch (item.name) {
        case 'arsp':
          postMsgUtil.trigger(null, 'listenLyMessage', { ...this.deviceInfo })
          break
        case 'sssp':
          if (this.judgeChannelsOnline().length > 0) {
            item.isActive = !item.isActive
            if (item.isActive) {
              this.opendChannels = this.deviceInfo.channels.filter(
                (item) => item.status == 0
              )
            } else {
              this.opendChannels = []
            }
            this.$globalEventBus.$emit(
              `${eventPath.commonInnerUtils}__camera-dialog-play-video`,
              { ...this.deviceInfo, visible: item.isActive }
            )
          } else {
            return newMessage.warning(`设备通道离线，无法播放`)
          }
          break
        case 'ksy':
          if (this.deviceInfo.status == '1') {
            // 离线设备
            return newMessage.warning(`离线设备无法查看可视域`)
          }
          item.isActive = !item.isActive
          this.$globalEventBus.$emit(
            `${eventPath.commonCompLayersControl}__viewshed-operate`,
            { status: item.isActive, list: [this.deviceInfo] }
          )
          break
        case 'kzl':
          item.isActive = !item.isActive
          this.handleKZLClick(item.isActive)
          this.$globalEventBus.$emit(`spot_detail_pop_footer_active`, {
            name: 'dzl',
            isActive: item.isActive
          })
          break
        case 'glsj':
          item.isActive = !item.isActive
          // 病虫害大屏用自己的告警列表
          if (getInlineStore('alarmListFilterExist')) {
            this.$globalEventBus.$emit(
              'common-comp-alarm-list__visible-filter',
              { cameraCodes: item.isActive ? [this.deviceInfo.deviceCode] : [] }
            )
          } else {
            // 唤起告警筛选
            if (this.cameraPropData.isHaveWarningList) {
              this.$globalEventBus.$emit(
                `${eventPath.commonCompAlarmFilte}__open`,
                {
                  devices: [{ devType: 1, code: this.deviceInfo.deviceCode }],
                  state: item.isActive
                }
              )
            } else if (item.isActive) {
              // 打开控制台
              const urlHead = getUrlHead()
              const params = { dc: this.deviceInfo.deviceCode }
              $v.openPage(urlHead + '/eventManagement', params)
            }
          }
          // 通知摄像机树
          this.$globalEventBus.$emit(
            `${eventPath.commonInnerUtils}__camera-dialog-events`,
            { ...this.deviceInfo, visible: item.isActive }
          )
          break
        case 'zbfx':
          item.isActive = !item.isActive
          if (item.isActive) {
            zIndex = 201
          }
          this.$globalEventBus.$emit(
            `${eventPath.commonCompAroundAnalysis}__visible-change`,
            {
              visible: item.isActive,
              zIndex,
              deviceInfo: {
                type: '1', // '1' 点 默认,'2': 线,'3': 面
                longitude: +this.deviceInfo.longitude,
                latitude: +this.deviceInfo.latitude,
                deviceCode: this.deviceInfo.deviceCode
              }
            }
          )
          break
        case 'dzl':
          item.isActive = !item.isActive
          this.$globalEventBus.$emit(
            `${eventPath.commonCompSearchMap}__set-navigation`,
            {
              open: item.isActive,
              endPoint: {
                lng: +this.deviceInfo.longitude,
                lat: +this.deviceInfo.latitude,
                alias: this.deviceInfo.location
              }
            }
          )
          this.$globalEventBus.$emit(
            `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
            {
              layerId: '1',
              status: item.isActive
            }
          )
          this.$globalEventBus.$emit(`spot_detail_pop_footer_active`, {
            name: 'dzl',
            isActive: item.isActive
          })
          break
        case 'xxxxi':
          item.isActive = !item.isActive
          this.xxxxVisiable = item.isActive
      }
    },
    async handleKZLClick(flag) {
      if (flag) {
        const mapRef_ = this.cameraPropData.mapRef.getMapRef(
          this.cameraPropData.mapId
        )
        this.lastKanzheliClose = await openKanzheli(this, mapRef_, {
          targetDeviceInfo: this.deviceInfo
        })
        newMessage.success('看这里功能已开启, 请在地图上选择要侦测的地点')
      } else {
        newMessage.success('看这里功能已关闭')
        this.lastKanzheliClose()
        this.lastKanzheliClose = null
      }
      this.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
        {
          layerId: '1',
          status: flag
        }
      )
    },
    // 摄像机树收藏更新通知
    handleTreeColl(deviceInfo_) {
      let devicIndex = deviceInfo_.params?.collObjCode.indexOf(
        this.deviceInfo.deviceCode
      )
      if (devicIndex > -1) {
        this.$set(this.deviceInfo, 'isMonitor', deviceInfo_.isCollect)
      }
    },
    // 设备播放
    handleTreePlay(treeVideoAddObj) {
      console.log('handleTreePlay', treeVideoAddObj)
      let findOne = this.footerIcons.find((item) => item.name == 'sssp')
      findOne.isActive = treeVideoAddObj.isSelected
      // if (treeVideoAddObj.data.length) {
      //   this.opendChannels = treeVideoAddObj.data
      //   let fIndex = treeVideoAddObj.data.findIndex(
      //     (item) => item.deviceCode === this.deviceInfo.deviceCode
      //   )
      //   let findOne = this.footerIcons.find((item) => item.name == 'sssp')
      //   if (fIndex > -1) {
      //     findOne.isActive = true
      //   } else {
      //     findOne.isActive = false
      //   }
      // }
    },
    removeOverlay() {
      const mapRef_ = this.cameraPropData.mapRef.getMapRef(
        this.cameraPropData.mapId
      )
      if (this.cameraPopup) {
        // 卸载摄像机弹窗时发出事件
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__camera_datail_pop_instance_destroy`,
          this.deviceInfo
        )
        CTMapOl.OverlayControl.common.removeOverlay({
          mapRef: mapRef_,
          overlayCollection: this.cameraPopup
        })
        this.cameraPopup = null
      }
      // 关闭底部功能区一打开的额功能
      this.handleRestFooter()
      // console.log('__camera_datail_pop_close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__camera_datail_pop_close`,
        this.deviceInfo
      )
      window.removeEventListener('message', this.playerCallBack)
    },
    async mountMapOverlay(position) {
      // 弹窗图层overlay
      // if (this.cameraPopup) {
      //   this.mapInstance.removeOverlay(this.cameraPopup)
      // }

      // 取出入参中的挂高
      let height = this.cameraPropData?.height || 0

      if (this.cameraPopup) {
        this.removeOverlay()
      }
      const mapRef_ = this.cameraPropData.mapRef.getMapRef(
        this.cameraPropData.mapId
      )

      // 不同主题对应不同偏移量
      // 当前主题
      const theme = document
        .getElementsByTagName('html')[0]
        .getAttribute('data-theme')
      const themeOffsetMap = {
        'theme-wiseblue': [0, 0],
        'theme-aquamarine': [0, -18],
        'theme-terracotta': [0, 0]
      }
      const spotPopup = await CTMapOl.OverlayControl.common.addOverlay(
        {
          mapRef: mapRef_,
          coord: [...position, height],
          domid: 'cameraTreeMapDialog_wc'
        },
        {
          positioning: 'bottom-center',
          offset: themeOffsetMap[theme],
          ...this.cameraPropData.overlayOption
        }
      )
      // const spotPopup = new Overlay({
      //   element: document.getElementById(`cameraTreeMapDialog_wc`),
      //   stopEvent: true,
      //   positioning: 'top-left',
      //   id: `cameraTreeMapDialog_wc_id`,
      //   zIndex: 100
      // })
      // spotPopup.setPosition(null)
      console.log('spotPopup', spotPopup)
      this.cameraPopup = spotPopup
      // this.mapInstance.addOverlay(spotPopup)
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
    handleAddOrCancelCollections() {
      let param = {
        collObjCode: [this.deviceInfo.deviceCode],
        collObjType: '5',
        optType: this.deviceInfo.isMonitor == '1' ? '0' : '1'
      }
      addOrCancelCollections(param).then((res) => {
        if (res.code == '200') {
          newMessage.success(
            param.optType === '1' ? `摄像机收藏成功` : '摄像机取消收藏成功'
          )
          this.$set(this.deviceInfo, 'isMonitor', param.optType)
          // 通知摄像机树改状态
          this.$globalEventBus.$emit(
            `${eventPath.commonInnerUtils}__camera-dialog-collection`,
            this.deviceInfo
          )
        }
      })
    },
    copyText(value) {
      const aux = document.createElement('input')
      aux.value = value
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    handleCopy(value) {
      this.copyText(value)
      newMessage.success(`复制成功`)
    },
    handleCloseIconClick() {
      // this.cameraPopup.setPosition(null)
      // this.mapInstance.removeOverlay(this.cameraPopup)
      this.removeOverlay()
    },
    // 重置底部功能区功能
    handleRestFooter() {
      this.footerIcons.forEach((item) => {
        if (item.isActive) {
          // 一打开的功能
          console.log(item, item.name)
          if (item.name == 'kzl') {
            if (this.lastKanzheliClose) {
              this.lastKanzheliClose()
              this.lastKanzheliClose = null
              this.$globalEventBus.$emit(
                `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
                {
                  layerId: '1',
                  status: false
                }
              )
              this.$globalEventBus.$emit(`spot_detail_pop_footer_active`, {
                name: 'dzl',
                isActive: false
              })
            }
          } else if (item.name == 'glsj') {
            this.$globalEventBus.$emit(
              `${eventPath.commonCompAlarmFilte}__open`,
              {
                devices: [{ devType: 1, code: this.deviceInfo.deviceCode }],
                state: false
              }
            )
            // 通知摄像机树
            this.$globalEventBus.$emit(
              `${eventPath.commonInnerUtils}__camera-dialog-events`,
              { ...this.deviceInfo, visible: false }
            )
          } else if (item.name == 'dzl') {
            this.$globalEventBus.$emit(
              `${eventPath.commonCompSearchMap}__set-navigation`,
              {
                open: false,
                endPoint: {
                  lng: +this.deviceInfo.longitude,
                  lat: +this.deviceInfo.latitude,
                  alias: this.deviceInfo.location
                }
              }
            )
            this.$globalEventBus.$emit(
              `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
              {
                layerId: '1',
                status: false
              }
            )
            this.$globalEventBus.$emit(`spot_detail_pop_footer_active`, {
              name: 'dzl',
              isActive: false
            })
          }
        }
      })
    },
    handleDetailClose() {
      this.xxxxVisiable = false
      let findOne = this.footerIcons.find((item) => item.name == 'xxxxi')
      if (findOne) findOne.isActive = false
    },
    handleIsAr() {
      if (this.cameraPropData.isAr) {
        this.footerIcons.splice(3)
      }
    },
    handleSsp() {
      $playerFit.get().then((res) => {
        console.log('handleSspRes', res)
        if (
          res?.findIndex(
            (item) => item.deviceCode == this.deviceInfo.deviceCode
          ) != -1
        ) {
          // 激活实时视频属性
          let findOne = this.footerIcons.find((item) => item.name == 'sssp')
          findOne.isActive = this.cameraPropData.viewshedStatus
        }
      })
    }
  },
  beforeDestroy() {
    // this.cameraPopup?.setPosition(null)
    // this.mapInstance?.removeOverlay(this.cameraPopup)
    this.removeOverlay()
  },
  mounted() {
    console.log('cameraPropData', this.cameraPropData)
    this.initEvent()
    this.handleGetInfo()
    setupCTips()
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.camera_vue_comp_infowindow {
  font-family: PingFangSC, 'PingFang SC';
}

.camera_vue_comp_infowindow_list {
  position: absolute;
  // 这里的bottom影响了offset的效果 在所有弹窗设置相同offset的时候 摄像机弹窗与打点之间总是多空出20px 所以改成0
  bottom: px-to-rem(0);
  left: px-to-rem(-115);
  width: px-to-rem(230);
  background: rgb(23 37 55 / 90%);
  border-radius: px-to-rem(8);
  user-select: none;

  .list_item_wrap {
    overflow: hidden auto;
    max-height: px-to-rem(160);
  }

  .close_icon {
    position: absolute;
    top: px-to-rem(-19);
    right: px-to-rem(-19);
    width: px-to-rem(38);
    height: px-to-rem(38);
    cursor: pointer;
    background: url('~@component-gallery/assets/image/common/wiseblue/icon_close@2x.png');
    background-size: 100% 100%;
  }

  .list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px 0 px-to-rem(6);
    padding: 0 px-to-rem(6) 0 px-to-rem(10);
    width: 100%;
    height: px-to-rem(32);
    cursor: pointer;

    &:hover {
      background-color: rgb(79 159 255 / 40%);
    }

    &:first-child {
      border-radius: px-to-rem(8) px-to-rem(8) 0 0;
    }

    &:last-child {
      border-radius: 0 0 px-to-rem(8) px-to-rem(8);
    }

    .icon_name {
      display: flex;
      align-items: center;
      overflow: hidden;
      color: rgb(232 243 254 / 50%);
      font-size: px-to-rem(14);
      flex: 1;

      .camera_icon_list {
        margin-right: px-to-rem(12);
        font-size: px-to-rem(16);
      }

      .list_item_name {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
    }

    .height {
      color: rgb(232 243 254 / 50%);
      font-size: px-to-rem(14);
    }
  }

  .list_online {
    .icon_name {
      color: #e8f3fe;
    }

    .height {
      color: #ffeeb1;
    }
  }
}

.camera_vue_comp_infowindow_cont {
  position: absolute;
  // 这里的bottom影响了offset的效果 在所有弹窗设置相同offset的时候 摄像机弹窗与打点之间总是多空出20px 所以改成0
  bottom: px-to-rem(0);
  left: px-to-rem(-184);
  width: px-to-rem(368);
  background: rgb(23 37 55 / 90%);
  border-radius: 8px;
  user-select: none;

  .header {
    position: relative;
    display: flex;
    background: url('~@component-gallery/assets/image/head_img.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 8px 8px 0 0;
    background-position-x: -2px;
    background-position-y: center;

    &::before {
      margin-right: px-to-rem(12);
      width: 0;
      height: 0;
      content: '';
    }

    .header_cont {
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      padding: 0 px-to-rem(12) 0 0;
      height: px-to-rem(48);
      flex: 1;
    }

    .camera_icon {
      margin-right: px-to-rem(6);
      color: #e8f3fe;
      font-size: px-to-rem(16);
    }

    .name {
      overflow: hidden;
      height: 100%;
      color: #e8f3fe;
      font-size: px-to-rem(16);
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
      flex: 1;
      line-height: 0.48rem;
      span {
        font-weight: 600;
        font-family: PingFangSC, PingFang SC;
      }
    }

    .type {
      display: flex;
      align-items: center;

      .shoucang {
        font-size: px-to-rem(14);

        i {
          margin-left: px-to-rem(6);
          color: #e8f3fe;
          font-size: px-to-rem(20);
        }

        i.select {
          color: #4f9fff;
        }
      }

      .is_online {
        display: inline-block;
        min-width: px-to-rem(40);
        height: px-to-rem(20);
        background: linear-gradient(90deg, #15bd94 0%, #00a179 100%);
        border-radius: px-to-rem(4);
        color: #fff;
        font-size: px-to-rem(12);
        text-align: center;
        line-height: px-to-rem(20);
      }

      .is_online.offline {
        background: linear-gradient(90deg, #8fa7cf 0%, #6f85aa 100%);
      }
    }

    .close_icon {
      position: absolute;
      top: px-to-rem(-19);
      right: px-to-rem(-19);
      width: px-to-rem(38);
      height: px-to-rem(38);
      cursor: pointer;
      background: url('~@component-gallery/assets/image/common/wiseblue/icon_close@2x.png');
      background-size: 100% 100%;
    }
  }

  .cont {
    .cont_tab {
      position: relative;
      height: px-to-rem(48);

      .tab_item_wrap {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;

        .tab_item {
          height: 100%;
          color: rgb(232 243 254 / 70%);
          font-size: px-to-rem(16);
          text-align: center;
          flex: 1;
          cursor: pointer;
          line-height: px-to-rem(48);
        }

        .tab_active {
          position: relative;
          text-shadow: 0 0 px-to-rem(10) rgb(74 141 254 / 70%);
          color: #e8f3fe;
          font-weight: 600;

          &::after {
            position: absolute;
            bottom: px-to-rem(-4);
            left: px-to-rem(34);
            display: inline-block;
            width: px-to-rem(116);
            height: px-to-rem(11);
            background: url('~@component-gallery/assets/image/common/wiseblue/popup-title-guang.png')
              no-repeat;
            background-size: contain;
            content: '';
          }
        }
      }

      .tab_bottom_line {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: px-to-rem(1);
        background: linear-gradient(
          270deg,
          rgb(176 212 255 / 0%) 0%,
          #b0d4ff 52%,
          rgb(176 212 255 / 0%) 100%
        );
        opacity: 0.35;
      }
    }

    .cont_tab_left {
      &.h193 {
        height: px-to-rem(193);
      }

      &.h245 {
        height: px-to-rem(245);
      }

      .cont_tab_top {
        position: relative;
        padding: px-to-rem(12) px-to-rem(12) 0;

        .top_cont_line {
          bottom: 0;
          margin-top: px-to-rem(12);
          width: 100%;
          height: px-to-rem(1);
          background: rgb(232 243 254 / 20%);
        }

        .spot-item + .spot-item {
          margin-top: px-to-rem(6);
        }
      }

      .tongdao_cont {
        overflow: hidden;
        padding: 0 0 0 px-to-rem(12);
        margin: px-to-rem(9) 0;
        width: 100%;

        &.need_right {
          padding-right: px-to-rem(12);
        }

        .tongdao_cont_wrap {
          overflow-y: auto;
          width: 100%;
          min-height: px-to-rem(52);
          max-height: px-to-rem(104);

          &::-webkit-scrollbar {
            width: px-to-rem(6);
            height: px-to-rem(6);
            border-radius: px-to-rem(3);
          }

          &::-webkit-scrollbar-thumb {
            background-color: rgb(79 159 255 / 40%);
            border: 0;
            border-radius: px-to-rem(3);

            &:hover {
              background-color: rgb(79 159 255 / 40%);
            }
          }

          &::-webkit-scrollbar-corner {
            display: none !important;
          }
        }

        .channel_item_wrap {
          .spot-item {
            position: relative;
            height: px-to-rem(26);
            line-height: px-to-rem(26);

            &::before {
              position: absolute;
              display: inline-block;
              width: px-to-rem(6);
              height: px-to-rem(6);
              border-radius: 50%;
              content: '';
            }

            .spot-item {
              width: px-to-rem(82);
            }
          }

          .is_online_c {
            &::before {
              background: #15bd94;
            }
          }

          .is_offline_c {
            &::before {
              background: #ed5158;
            }
          }
        }

        // .channel_item_wrap + .channel_item_wrap {
        //   margin-top: 6px;
        // }
      }
    }

    .cont_tab_right {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: px-to-rem(6) px-to-rem(12);

      &.cont_tab_right_short {
        height: px-to-rem(193);
      }

      &.cont_tab_right_height {
        height: px-to-rem(245);
      }

      .no-data {
        color: #fff;
        font-size: px-to-rem(14);
        text-align: center;

        &::before {
          display: block;
          margin: 0;
          content: url('./assets/no-data.png');
        }
      }

      .carousel-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        ::v-deep .el-carousel {
          overflow: hidden;
          width: 100%;

          // aspect-ratio: 16 / 9;
          height: 100%;

          .el-carousel__container {
            height: 100%;

            i {
              line-height: px-to-rem(30);
              font-size: px-to-rem(14);
              font-weight: bold;
              text-align: center;
            }
          }

          .el-carousel--horizontal {
            height: 100%;
          }
        }
      }

      .fullscreen {
        position: absolute;
        right: px-to-rem(6);
        bottom: px-to-rem(6);
        z-index: 2;
        width: px-to-rem(30);
        height: px-to-rem(30);
        background: rgb(23 37 55 / 90%);
        border-radius: px-to-rem(4);
        color: #e8f3fe;
        font-size: px-to-rem(16);
        text-align: center;
        line-height: px-to-rem(30);

        .iconfont {
          font-size: px-to-rem(16);
        }
      }

      .el-carousel__item {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: px-to-rem(4);
      }

      .fit-height {
        width: 100%;
        height: auto;
      }

      ::v-deep .el-carousel__arrow {
        width: px-to-rem(30);
        height: px-to-rem(30);
        background: rgb(23 37 55 / 80%);
        border-radius: 50%;
        color: #e8f3fe;
        font-size: px-to-rem(16);
        &.el-carousel__arrow--left {
          left: px-to-rem(6);
        }
        &.el-carousel__arrow--right {
          right: px-to-rem(6);
        }
      }

      ::v-deep .el-carousel__indicators {
        display: none;
      }

      video::-webkit-media-controls-fullscreen-button {
        display: none;
      }

      video::-webkit-media-controls-mute-button {
        display: none;
      }

      video::-webkit-media-controls-toggle-closed-captions-button {
        display: none;
      }

      video::-webkit-media-controls-volume-slider {
        display: none;
      }

      video::-webkit-media-controls
        input[pseudo='-internal-media-controls-overflow-button' i] {
        display: none;
      }

      video::-internal-media-controls-overflow-button {
        display: none !important;
      }

      video::-webkit-media-controls-volume-control-container {
        display: none;
      }

      video::-webkit-media-controls-volume-control-container.closed {
        display: none;
      }
    }

    .spot-item {
      display: flex;
      align-items: center;
      height: px-to-rem(20);
      font-size: px-to-rem(14);

      .spot-name {
        min-width: px-to-rem(84);
        color: rgb(232 243 254 / 70%);
        text-align: right;
        flex-shrink: 0;
      }

      .spot-value {
        display: flex;
        align-items: center;
        overflow: hidden;
        max-width: 100%;
        color: #e8f3fe;

        .spot-value_inner {
          overflow: hidden;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .fiuzhi_iocn.iconfont_tools {
      margin-left: px-to-rem(4);
      color: #e8f3fe;
      font-size: px-to-rem(20);
      cursor: pointer;
    }
  }

  .footer {
    padding: 0 px-to-rem(12);
    height: px-to-rem(54);

    .f_cont {
      display: flex;
      align-items: center;
      height: 100%;
      color: #fff;
      border-top: px-to-rem(1) solid rgb(232 243 254 / 20%);

      i {
        font-size: px-to-rem(30);
      }

      .active {
        color: #4f9fff;
      }

      i + i {
        margin-left: px-to-rem(6);
      }
    }
  }
}

.have_camera_list {
  left: px-to-rem(135);
}

[data-theme='theme-terracotta'] {
  .camera_vue_comp_infowindow_list {
    background: rgba(23, 20, 11, 0.9);
    border: 1px solid #6e674e;
    border-radius: 0;

    .close_icon {
      background: url('~@component-gallery/assets/image/common/terracotta/icon_close@2x.png');
      background-size: 100% 100%;
    }

    .list_item {
      color: #e4e7c1;

      &:hover {
        background-color: rgb(100 86 46 / 40%);
      }

      .icon_name {
        color: rgb(255 238 177 / 50%);
      }

      .height {
        color: rgb(255 238 177 / 50%);
      }
    }

    .list_online {
      .icon_name {
        color: #ffeeb1;
      }

      .height {
        color: #ffeeb1;
      }
    }

    &::after {
      position: absolute;
      bottom: px-to-rem(-5);
      left: px-to-rem(-5);
      width: calc(100% + px-to-rem(10));
      height: px-to-rem(16);
      background: url('~@component-gallery/assets/image/common/terracotta/corner-3.png')
          no-repeat left bottom/px-to-rem(16) px-to-rem(16),
        url('~@component-gallery/assets/image/common/terracotta/corner-2.png')
          no-repeat right bottom/px-to-rem(16) px-to-rem(16);
      content: '';
      pointer-events: none;
    }
  }

  .camera_vue_comp_infowindow_cont {
    background: rgba(23, 20, 11, 0.9);
    border: 1px solid #6e674e;
    border-radius: 0;

    .header {
      background: none;

      .camera_icon {
        color: #e4e7c1;
      }

      .name {
        span {
          text-shadow: 0 px-to-rem(1) px-to-rem(4) #dcd277;
          color: #fff;
        }
      }

      .type {
        .shoucang {
          i {
            color: #e4e7c1;
          }

          i.select {
            color: #fffa28;
          }
        }
      }

      .close_icon {
        background: url('~@component-gallery/assets/image/common/terracotta/icon_close@2x.png');
        background-size: 100% 100%;
      }
    }

    .cont {
      .cont_tab {
        .tab_item_wrap {
          .tab_item {
            color: #e4e7c1;
          }

          .tab_active {
            text-shadow: 1px 0 4px #dcd277;
            color: #fff;

            &::after {
              bottom: px-to-rem(-1);
              background: url('~./assets/gt_pop_guang.png') no-repeat;
              background-size: contain;
            }
          }
        }

        .tab_bottom_line {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: px-to-rem(1);
          background: linear-gradient(
            90deg,
            rgb(255 222 76 / 0%),
            rgb(255 222 76 / 100%),
            rgb(255 222 76 / 0%)
          );
          opacity: 0.35;
        }
      }

      .cont_tab_left {
        .cont_tab_top {
          .top_cont_line {
            background: rgb(228 231 193 / 20%);
          }
        }

        .tongdao_cont {
          .tongdao_cont_wrap {
            &::-webkit-scrollbar-thumb {
              background-color: rgb(255 238 177 / 40%) !important;

              &:hover {
                background-color: rgb(255 238 177 / 40%) !important;
              }
            }
          }
        }
      }

      .cont_tab_right {
        .no-data {
          color: #e4e7c1;

          &::before {
            content: url('~@component-gallery/assets/image/common/terracotta/noData.png');
          }
        }

        .fullscreen {
          background: rgb(21 19 12 / 70%);
          color: #ffeeb1;
        }

        ::v-deep .el-carousel__arrow {
          background: rgb(21 19 12 / 70%);
          color: #ffeeb1;
        }
      }

      .spot-item {
        .spot-name {
          color: rgb(228 231 193 / 70%);
        }

        .spot-value {
          color: #e4e7c1;
        }
      }

      .fiuzhi_iocn.iconfont_tools {
        color: #e4e7c1;
      }
    }

    .footer {
      .f_cont {
        color: #ffeeb1;
        border-top: px-to-rem(1) solid rgb(228 231 193 / 20%);

        .active {
          background-repeat: no-repeat;
          background-size: 100%;
          color: #fffa28;
          background-image: url('./assets/gt_bg_s.png');
        }
      }
    }

    &::after {
      position: absolute;
      bottom: px-to-rem(-5);
      left: px-to-rem(-5);
      width: calc(100% + px-to-rem(10));
      height: px-to-rem(16);
      background: url('~@component-gallery/assets/image/common/terracotta/corner-3.png')
          no-repeat left bottom/px-to-rem(16) px-to-rem(16),
        url('~@component-gallery/assets/image/common/terracotta/corner-2.png')
          no-repeat right bottom/px-to-rem(16) px-to-rem(16);
      content: '';
      pointer-events: none;
    }
  }

  .previous-vacancies {
    &::before {
      position: absolute;
      top: px-to-rem(-5);
      left: px-to-rem(-5);
      width: calc(100% + px-to-rem(10));
      height: px-to-rem(16);
      background: url('~@component-gallery/assets/image/common/terracotta/corner-1.png')
          no-repeat left top/px-to-rem(16) px-to-rem(16),
        url('~@component-gallery/assets/image/common/terracotta/corner-4.png')
          no-repeat right top/px-to-rem(16) px-to-rem(16);
      content: '';
      pointer-events: none;
    }
  }
}

// 林业主题
[data-theme='theme-aquamarine'] {
  .camera_vue_comp_infowindow_list {
    background: linear-gradient(180deg, rgb(0 19 30 / 70%), #00131e);
    border-image: linear-gradient(1turn, rgb(7 91 74 / 75%), rgb(7 91 74 / 30%))
      1 1;
    border-radius: 0;

    .close_icon {
      background: url('~@component-gallery/assets/image/common/aquamarine/icon_close@2x.png');
      background-size: 100% 100%;
    }

    .list_item {
      color: rgb(255 255 255 / 50%);

      &:hover {
        background-color: rgb(2 137 109 / 40%);
      }

      .icon_name {
        color: rgb(255 255 255 / 50%);
      }

      .height {
        color: rgb(255 255 255 / 50%);
      }
    }

    .list_online {
      .icon_name {
        color: #fff;
      }

      .height {
        color: #fff;
      }
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: calc(100% + px-to-rem(1));
      height: px-to-rem(16);
      background: url('~@component-gallery/assets/image/common/aquamarine/box-bottom-left.png')
          no-repeat left bottom/px-to-rem(16) px-to-rem(16),
        url('~@component-gallery/assets/image/common/aquamarine/box-bottom-right.png')
          no-repeat right bottom/px-to-rem(16) px-to-rem(16);
      content: '';
      pointer-events: none;
    }

    .previous-vacancies {
      position: absolute;
      top: 0;
      width: 100%;

      &::before,
      &::after {
        position: absolute;
        top: 0;
        width: px-to-rem(8);
        height: px-to-rem(1);
        background: #00fff8;
        content: '';
      }

      &::after {
        right: 0;
        z-index: -1;
      }
    }
  }

  .camera_vue_comp_infowindow_cont {
    background: linear-gradient(180deg, rgb(0 19 30 / 70%) 0%, #00131e 100%);
    border-image: linear-gradient(
        360deg,
        rgb(7 91 74 / 75%),
        rgb(7 91 74 / 30%)
      )
      1 1;
    border-radius: 0;

    .header {
      padding-left: px-to-rem(12);
      background: linear-gradient(
        91deg,
        rgb(2 137 109 / 20%) 0%,
        rgb(2 137 109 / 15%) 23%,
        rgb(2 137 109 / 0%) 100%
      );
      border-radius: 0;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('~@component-gallery/assets/image/common/aquamarine/popup-title-bg.png')
          no-repeat left center / auto 100%;
        pointer-events: none;
        content: '';
      }

      .camera_icon {
        display: none;
      }

      .name {
        color: #fff;

        span {
          text-shadow: 0 0 px-to-rem(18) rgb(0 245 193 / 90%);
          color: #fff;
        }

        span {
          padding-left: px-to-rem(15);

          &::before {
            position: absolute;
            top: calc(50% - px-to-rem(4));
            display: block;
            width: px-to-rem(8);
            height: px-to-rem(8);
            background: url('~@component-gallery/assets/image/common/aquamarine/popup-title-icon.png')
              no-repeat center / 100% 100%;
            content: '';
          }

          // highlight-title title底部线条高光
          &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            width: px-to-rem(168);
            height: px-to-rem(10);
            background: url('~@component-gallery/assets/image/common/aquamarine/popup-title-guang.png')
              no-repeat center / 100% 100%;
            content: '';
          }
        }

        &::before {
          position: absolute;
          top: px-to-rem(-6.5);
          left: px-to-rem(45);
          width: px-to-rem(36);
          height: px-to-rem(14);
          background: url('~@component-gallery/assets/image/common/aquamarine/popup-header-k.png')
            no-repeat center / 100% 100%;
          pointer-events: none;
          content: '';
        }

        &::after {
          left: px-to-rem(40);
        }
      }

      .type {
        .shoucang {
          i {
            color: #fff;
          }

          i.select {
            color: #f9ff6c;
          }
        }
      }

      .close_icon {
        background: url('~@component-gallery/assets/image/common/aquamarine/icon_close@2x.png');
        background-size: 100% 100%;
      }
    }

    .cont {
      .cont_tab {
        .tab_item_wrap {
          .tab_item {
            color: #0dc985;
          }

          .tab_active {
            text-shadow: 0 0 px-to-rem(24) rgb(0 245 193 / 70%);
            color: #fff;

            &::after {
              bottom: px-to-rem(-4);
              background: url('~./assets/ly_pop_guang.png') no-repeat;
              background-size: contain;
            }
          }
        }

        .tab_bottom_line {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: px-to-rem(1);
          background: linear-gradient(
            270deg,
            rgb(234 244 255 / 0%) 0%,
            #eaf4ff 53%,
            rgb(234 244 255 / 0%) 100%
          );
          opacity: 0.2;
        }
      }

      .cont_tab_left {
        .cont_tab_top {
          .top_cont_line {
            background: rgb(255 255 255 / 20%);
          }
        }

        .tongdao_cont {
          .tongdao_cont_wrap {
            &::-webkit-scrollbar-thumb {
              background-color: rgb(2 137 109 / 40%) !important;

              &:hover {
                background-color: rgb(2 137 109 / 40%) !important;
              }
            }
          }
        }
      }

      .cont_tab_right {
        .no-data {
          color: #fff;

          &::before {
            content: url('~@component-gallery/assets/image/common/aquamarine/noData.png');
          }
        }

        .fullscreen {
          color: #fff;
          background: url('./assets/ly_bg_icon_n@2x.png') no-repeat center /
            100% 100%;
        }

        ::v-deep .el-carousel__arrow {
          background: rgb(2 50 32 / 70%);
          color: #fff;
        }
      }

      .spot-item {
        .spot-name {
          color: rgb(255 255 255 / 70%);
        }

        .spot-value {
          color: rgb(255 255 255 / 100%);
        }
      }

      .fiuzhi_iocn.iconfont_tools {
        color: rgb(255 255 255 / 100%);
      }
    }

    .footer {
      .f_cont {
        color: rgb(255 255 255 / 100%);
        border-top: px-to-rem(1) solid rgb(255 255 255 / 20%);

        .active {
          background-repeat: no-repeat;
          background-size: 100%;
          color: rgb(249 255 108 / 100%);
          background-image: url('~@component-gallery/assets/image/tool-box/aquamarine/funcicon-bg.png');
        }
      }
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: calc(100% + px-to-rem(1));
      height: px-to-rem(16);
      background: url('~@component-gallery/assets/image/common/aquamarine/box-bottom-left.png')
          no-repeat left bottom/px-to-rem(16) px-to-rem(16),
        url('~@component-gallery/assets/image/common/aquamarine/box-bottom-right.png')
          no-repeat right bottom/px-to-rem(16) px-to-rem(16);
      content: '';
      pointer-events: none;
    }
  }

  .previous-vacancies {
    position: absolute;
    top: 0;
    width: 100%;

    &::before,
    &::after {
      position: absolute;
      top: 0;
      width: px-to-rem(8);
      height: px-to-rem(1);
      background: #00fff8;
      content: '';
    }

    &::after {
      right: 0;
      z-index: -1;
    }
  }
}
</style>
