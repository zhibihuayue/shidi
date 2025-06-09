<template>
  <div class="detail_window_pop_vuecomp trap-detail">
    <absolute-container
      @close="closeAncientTreeGroupPop"
      v-if="trapList.length > 1"
      :width="230"
      :bottom="54"
      :left="-115"
    >
      <div class="trap-list">
        <el-scrollbar class="scroll-bar">
          <div
            class="trap-item"
            v-for="(item, index) in trapList"
            @click="getTrapInfo(item.deviceCode, index)"
            :class="index === currentSelectIndex && 'selected'"
            :key="item.id"
          >
            <div class="left">
              <em
                :class="`iconfont_tools icon-linye_icon_youbuqi`"
                v-if="!item.deploymentSituation"
              ></em>
              <img
                class="yibushe"
                src="./assets/trap-online.png"
                v-if="item.deploymentSituation === '0'"
                alt=""
              />
              <img
                class="weibushe"
                src="./assets/trap-offline.png"
                v-if="item.deploymentSituation === '1'"
                alt=""
              />
              <p class="label" :c-tip="item.deviceName" c-tip-placement="top">{{
                item.deviceName
              }}</p>
            </div>
            <p class="type">{{
              item?.deviceHeight ? item.deviceHeight + 'm' : ''
            }}</p>
          </div>
        </el-scrollbar>
      </div>
    </absolute-container>
    <absolute-container
      @close="closeTrapDetailPop"
      left-title
      :width="368"
      :left="trapList.length > 1 ? 127 : -184"
      :bottom="50"
      title=" "
      v-show="showTrapDetail"
    >
      <template v-slot:title>
        <span class="detail_window_pop_header">
          <div
            class="trap-title title"
            :c-tip="trapDetail.deviceName"
            c-tip-placement="top"
            >{{ trapDetail.deviceName }}</div
          >
          <div class="trap-title-right right">
            <p class="tips active" v-if="trapDetail.deploymentSituation === '0'"
              >已布设</p
            >
            <p class="tips" v-if="trapDetail.deploymentSituation == '1'"
              >未布设</p
            >
            <em
              v-if="trapDetail.collectionFlag == '0'"
              @click="setCollect('1')"
              class="icon iconfont_tools icon-tongyong_icon_shoucang_20_n"
            ></em>
            <em
              @click="setCollect('0')"
              v-else
              class="icon active iconfont_tools icon-tongyong_icon_shoucang_20_s"
            ></em>
          </div>
        </span>
      </template>
      <div class="content">
        <div class="line_item" v-for="item in dictData" :key="item.key">
          <div class="item_name">{{ item.label }}：</div>
          <div class="item_value">
            <el-tooltip
              :content="item.value"
              placement="top"
              popper-class="tooltip-popper"
            >
              <span class="item_value_inner">{{ item.value }}</span>
            </el-tooltip>
            <em
              v-if="item.copy"
              @click="handleCopy(item.value)"
              class="iconfont_tools icon-fuzhiicon fiuzhi_iocn"
            ></em>
          </div>
        </div>
        <div class="footer">
          <div class="f_cont">
            <em
              v-for="item in footerIcons"
              :key="item.name"
              @click="handleFooterIconClick(item)"
              :title="item.title"
              :class="item.isActive ? `active ${item.actIcon}` : `${item.icon}`"
            ></em>
          </div>
        </div>
      </div>
    </absolute-container>
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import newMessage from '../../funCommon/message/common-message'
import { getInlineStore } from '../../funCommon/inlineStore'
import eventPath from '@component-gallery/build-event-bus-path'
import { queryTrapInfo, updateCollect, listByLatLon } from './service/index'
import dict from './service/dict'
import CTMapOl from '@ct/ct_map_ol'
import { setupCTips } from '../../funCommon/c-tip'

export default {
  name: 'wc-trap-collect-log-pop',
  props: {
    propsData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentSelectIndex: '',
      detailPopup: null,
      dictData: dict,
      trapDetail: {
        deviceName: '',
        deploymentSituation: '',
        collectionFlag: '',
        deviceType: '',
        deviceHeight: '',
        trapNumber: '',
        latitude: '',
        longitude: '',
        deviceAddress: '',
        deviceCode: ''
      },
      trapList: [],
      showTrapDetail: false,
      footerIcons: [
        {
          title: '关联采集记录',
          icon: 'iconfont_tools icon-icon_guanlian_20_n',
          actIcon: 'iconfont_tools icon-icon_guanlian_20_s',
          name: 'glcjjl',
          isActive: false
        },
        {
          title: '到这里',
          icon: 'iconfont_tools icon-icon_daozheli_30_n',
          actIcon: 'iconfont_tools icon-icon_daozheli_30_s',
          name: 'dzl',
          isActive: false
        }
      ]
    }
  },
  components: {
    AbsoluteContainer
  },
  methods: {
    async initEvent() {
      this.mountMapOverlay([this.propsData.longitude, this.propsData.latitude])
      this.$globalEventBus.$on(
        `${eventPath.commonInnerUtils}__camera_pop_footer_active`
      )
      // 关闭到这里
      this.$globalEventBus.$on(
        `${eventPath.commonCompSearchMap}__close-navigation`,
        (data) => {
          if (data.close) {
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
      // 同步弹窗收藏状态数据
      this.$globalEventBus.$on(
        `${eventPath.commonCompCardDevTree}__dev-trww-collect`,
        this.getCollectStatus
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompTrapCollectLog}__filterReset`,
        () => {
          this.footerIcons[0].isActive = false
        }
      )
    },
    // 同步弹窗收藏状态数据
    getCollectStatus(data) {
      const { layersId, isMonitor, devCode } = data
      if (layersId == '16' && devCode == this.trapDetail.deviceCode) {
        this.$set(this.trapDetail, 'collectionFlag', isMonitor)
      }
    },
    removeOverlay() {
      const mapRef_ = this.propsData.mapRef.getMapRef(this.propsData.mapId)
      if (this.detailPopup) {
        CTMapOl.OverlayControl.common.removeOverlay({
          mapRef: mapRef_,
          overlayCollection: this.detailPopup
        })
        this.detailPopup = null
      }
    },
    splitStr(num) {
      return Number(num).toFixed(6)
    },
    async mountMapOverlay(position) {
      // 弹窗图层overlay
      if (this.detailPopup) {
        this.removeOverlay()
      }
      const mapRef_ = this.propsData.mapRef.getMapRef(this.propsData.mapId)
      const spotPopup = await CTMapOl.OverlayControl.common.addOverlay(
        {
          mapRef: mapRef_,
          coord: position,
          domid: this.propsData.domId
        },
        { positioning: 'top-left', offset: [0, 0] }
      )
      console.log('spotPopup', spotPopup)
      this.detailPopup = spotPopup
    },
    /**
     * 获取诱捕器详情
     */
    getTrapInfo(deviceCode, index) {
      let params = {
        deviceCode: deviceCode || this.propsData.id
      }
      this.currentSelectIndex = index
      queryTrapInfo(params).then((res) => {
        this.showTrapDetail = true
        if (res.code === 200) {
          this.trapDetail = res.data
          this.dictData = this.dictData.map((item) => {
            item.value = this.trapDetail[item.key] || '-'
            if (item.key === 'deviceType') {
              item.value =
                this.trapDetail.deviceType === '1' ? '虫情测报灯' : '传统诱捕器'
            }
            if (item.key === 'latitudeAndLongitude') {
              item.value = `${this.splitStr(
                this.trapDetail.longitude
              )},${this.splitStr(this.trapDetail.latitude)}`
            }
            if (item.key === 'deviceHeight') {
              item.value = this.trapDetail.deviceHeight
                ? this.trapDetail.deviceHeight + 'm'
                : '-'
            }
            if (item.key === 'trapNumber' && this.trapDetail.trapNumber) {
              item.value = this.trapDetail.trapNumber
                ? this.trapDetail.trapNumber + '只'
                : '-'
            }
            return item
          })
          // 重置状态
          this.footerIcons[0].isActive = false
          this.footerIcons[1].isActive = false
        }
      })
    },
    // 复制
    handleCopy(value) {
      this.copyText(value)
      newMessage.success(`复制成功`)
    },
    /**
     * 复制函数
     * @param value String
     */
    copyText(value) {
      const aux = document.createElement('input')
      aux.value = value
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    /**
     *  底部功能区图标点击
     */
    handleFooterIconClick(item) {
      switch (item.name) {
        case 'glcjjl':
          item.isActive = !item.isActive
          console.log('glcjjl', item, this.trapDetail)
          this.$globalEventBus.$emit(
            `${eventPath.commonCompTrapCollectLog}__filterCode`,
            item.isActive ? this.trapDetail.deviceCode : null
          )
          break
        case 'dzl':
          item.isActive = !item.isActive
          this.$globalEventBus.$emit(
            `${eventPath.commonCompSearchMap}__set-navigation`,
            {
              open: item.isActive,
              endPoint: {
                lng: +this.trapDetail.longitude,
                lat: +this.trapDetail.latitude,
                alias: this.trapDetail.deviceAddress
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
          break
      }
    },
    /**
     * 销毁当前弹窗并重置
     */
    closeAncientTreeGroupPop() {
      // 清除弹窗
      this.removeOverlay()
      this.showTrapDetail = false
      // 关闭所有按钮功能
      this.propsData?.closeCallback && this.propsData.closeCallback()
      this.footerIcons.forEach((item) => {
        if (item.isActive) {
          this.handleFooterIconClick(item)
        }
      })
    },
    closeTrapDetailPop() {
      this.showTrapDetail = false
      this.trapDetail = {}
      this.closeAncientTreeGroupPop()
    },
    /**
     * 设置收藏状态
     * @param type String 1 收藏 0 取消收藏
     */
    setCollect(type) {
      const params = {
        deviceList: [this.trapDetail.deviceCode],
        optType: type
      }
      updateCollect(params).then((res) => {
        if (res.code === 200) {
          this.$set(this.trapDetail, 'collectionFlag', type)
          newMessage.success(type === '1' ? '收藏成功' : '取消收藏成功')
          console.log(type, this.trapDetail, '收藏状态')
          this.$globalEventBus.$emit('commonCompTrapDetailPop__Collect', {
            type: type,
            deviceCode: this.trapDetail.deviceCode
          })
        }
      })
    },
    getTrapList() {
      if (this.propsData?.id) {
        this.getTrapInfo()
      } else {
        const params = {
          longitude: this.propsData?.longitude,
          latitude: this.propsData?.latitude
        }
        listByLatLon(params).then((res) => {
          if (res.code === 200) {
            this.trapList = res.data
            if (this.trapList.length === 1) {
              this.getTrapInfo(this.trapList[0].deviceCode)
            }
          }
        })
      }
    }
  },
  mounted() {
    if (!getInlineStore('trapCollectLogExist')) {
      this.footerIcons[0].icon =
        'iconfont_tools icon-icon_guanlian_20_n isDiabled'
    }
    setupCTips()
    this.initEvent()
    this.getTrapList()
  },
  beforeDestroy() {
    this.removeOverlay()
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-pop-overlay';
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
[data-theme='theme-aquamarine'] .trap-detail {
  ::v-deep .innercomp-abcontainer-header.highlight-title.left-title::before {
    width: 100% !important;
    left: 0 !important;
    transform: unset !important;
  }
}
.detail_window_pop_header {
  &::before {
    left: 0;
  }
  padding-left: 0 !important;
  .trap-title {
    padding: 0 px-to-rem(15);
  }
}
.fiuzhi_iocn {
  margin-left: px-to-rem(6);
}
.trap-title {
  font-weight: 600;
}
.item_value_inner {
  line-height: 1;
}
.trap-list {
  @include themeify(false) {
    width: px-to-rem(230);

    .scroll-bar {
      width: 100%;
      height: 100%;

      ::v-deep .el-scrollbar__wrap {
        max-height: px-to-rem(160);
      }
    }

    .trap-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      padding: 0 px-to-rem(6);
      width: 100%;
      height: px-to-rem(32);
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: px-to-rem(32);
      cursor: pointer;

      &:hover {
        background: themed('tree-primary-color');
      }

      &.selected {
        background: themed('tree-primary-color');
      }

      .left {
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-right: px-to-rem(6);
        height: 100%;
        i {
          font-size: px-to-rem(16);
        }
        img {
          &.weibushe {
            width: px-to-rem(16.2);
            height: px-to-rem(16.2);
            margin-right: px-to-rem(-0.2);
          }
          &.yibushe {
            width: px-to-rem(13);
            margin-left: px-to-rem(1);
            margin-right: px-to-rem(2);
          }
        }
      }

      .label {
        overflow: hidden;
        margin-left: px-to-rem(6);
        height: 100%;
        color: themed('global-text-color');
        text-overflow: ellipsis;
      }

      .type {
        min-width: fit-content;
      }
    }

    .type,
    .label {
      font-size: px-to-rem(14);
    }
  }
}

.footer {
  .isDiabled {
    pointer-events: none !important;
    color: rgb(255 255 255 / 40%) !important;
    cursor: not-allowed;
  }
}
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.tooltip-popper {
  font-size: px-to-rem(14) !important;
  @include themeify(false) {
    @if $theme-name == 'theme-aquamarine' {
      background: #00221b !important;
      color: #fff !important;

      .popper__arrow {
        border-top-color: #00221b !important;

        &::after {
          border-top-color: #00221b !important;
        }
      }
    }

    @if $theme-name == 'theme-terracotta' {
      background: rgb(22 18 9 / 95%) !important;
      color: #e4e7c1 !important;

      .popper__arrow::after {
        border-top-color: #00221b !important;
      }
    }

    @if $theme-name == 'theme-wiseblue' {
      background: #0f1926 !important;
      color: #e8f3fe !important;

      .popper__arrow::after {
        border-top-color: #0f1926 !important;
      }
    }
  }
}
</style>
