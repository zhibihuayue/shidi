<template>
  <div
    class="detail_window_pop_vuecomp"
    id="trap-collect-log-pop"
    v-show="dataIsReady"
  >
    <div class="trap-collect-log" v-show="isHaveList">
      <div class="close_icon" @click="closeAncientTreeGroupPop"> </div>
      <div class="previous-vacancies"></div>
      <div class="list_item_wrap">
        <div
          class="list_item list_online"
          v-for="(item, index) in trapList"
          :key="index"
          @click="handleListItemClick(item, index)"
        >
          <div class="icon_name">
            <em
              class="camera_icon_list iconfont_tools icon-linye_icon_caijijilu"
            ></em>
            <div
              class="list_item_name"
              :c-tip="item.trappingInsects"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ item.trappingInsects }}</div
            >
          </div>
          <div
            class="height"
            :c-tip="item.deviceName"
            c-tip-placement="top"
            c-tip-class="c-tip-normal"
            >{{ item.deviceName }}</div
          >
        </div>
      </div>
    </div>
    <absolute-container
      @close="closeAncientTreeGroupPop"
      :width="368"
      left-title
      title=" "
      :left="-184"
      :bottom="1"
      :industryClass="isHaveList ? 'cont_have_liat' : ''"
      v-show="trapGatherInfo.id"
    >
      <template v-slot:title>
        <span class="detail_window_pop_header">
          <div class="trap-title title">诱捕器采集记录详情</div>
        </span>
      </template>
      <div class="tab-header">
        <div class="tab-item" v-for="(item, index) in tabList" :key="item">
          <div
            class="tab-item-title"
            :class="index === activeIndex && 'tab_active'"
            @click="tabClick(index)"
          >
            <span class="tab-item-title-text">{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="tab-content" v-show="activeIndex === 0">
          <div class="line_item" v-for="item in dictData" :key="item.key">
            <div class="item_name">{{ item.label }}：</div>
            <div class="item_value">
              <span
                class="item_value_inner"
                :c-tip="item.value"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ item.value }}</span
              >
              <em
                v-if="item.copy"
                @click="handleCopy(item.value)"
                class="iconfont_tools icon-fuzhiicon fiuzhi_iocn copy-icon"
              ></em>
            </div>
          </div>
        </div>
        <div class="tab-content swiper-wrapper" v-show="activeIndex === 1">
          <swiper-medias
            :waterSeal="trapGatherInfo"
            :fileList="fileList"
            v-if="fileList?.length"
          />
          <div v-else class="no-data"></div>
        </div>
      </div>
    </absolute-container>
  </div>
</template>

<script>
import { setupCTips } from '../../funCommon/c-tip'
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import SwiperMedias from '../swiper-medias/SwiperMedias.vue'
import newMessage from '../../funCommon/message/common-message'

import eventPath from '@component-gallery/build-event-bus-path'
import dict from './service/dict'
import { queryTrapGatherInfo, queryTrapGatherLayer } from './service/index'
import CTMapOl from '@ct/ct_map_ol'
export default {
  name: 'wc-trap-collect-log-pop',
  props: {
    propsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      detailPopup: null,
      tabList: ['基本信息', '图片'],
      activeIndex: 0,
      dictData: dict,
      trapGatherInfo: {},
      fileList: [],
      dataIsReady: false,
      trapList: [],
      isHaveList: false
    }
  },
  components: {
    AbsoluteContainer,
    SwiperMedias
  },
  methods: {
    initEvent() {
      this.$globalEventBus.$on(
        `${eventPath.commonInnerUtils}__camera_pop_footer_active`
      )
    },
    removeOverlay() {
      const mapRef_ = this.propsData.mapRef.getMapRef(this.propsData.mapId)
      if (this.detailPopup) {
        CTMapOl.OverlayControl.common.removeOverlay({
          mapRef: mapRef_,
          overlayCollection: this.detailPopup
        })
        this.detailPopup = null
        this.dataIsReady = false
      }
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
        { positioning: 'top-left', offset: [0, -35] }
      )
      console.log('spotPopup', spotPopup)
      this.detailPopup = spotPopup
    },
    /**
     * tab点击事件
     */
    tabClick(index) {
      this.activeIndex = index
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
    handleListItemClick(item, index) {
      this.getTrapGatherInfo(item, 'fromList')
    },
    judgeHaveList() {
      const { trapData, longitude, latitude } = this.propsData
      if (trapData) {
        // 诱捕器采集记录组件入口
        if (this.propsData.trapData.length > 1) {
          this.trapList = this.propsData.trapData
          this.trapList = this.trapList.sort((a, b) => {
            return (
              new Date(a.createTimeYmd).getTime() -
              new Date(b.createTimeYmd).getTime()
            )
          })
          this.isHaveList = true
          this.dataIsReady = true
          let position = [
            +this.propsData.trapData[0].longitude,
            +this.propsData.trapData[0].latitude
          ]
          this.mountMapOverlay(position)
        } else {
          this.getTrapGatherInfo(this.propsData.trapData[0])
        }
      } else {
        // 图层点击查询站址列表
        let params = {
          longitude,
          latitude
        }
        queryTrapGatherLayer(params).then((res) => {
          // console.log('queryTrapGatherLayer', res)
          let listData = res.data[0]?.list
          if (listData.length > 1) {
            this.trapList = listData.map((item) => {
              return {
                longitude: params.longitude,
                latitude: params.latitude,
                trappingInsects: item.trappingInsects,
                deviceName: item.deviceName,
                id: item.id
              }
            })
            this.isHaveList = true
            this.dataIsReady = true
            let position = [+params.longitude, +params.latitude]
            this.mountMapOverlay(position)
          } else {
            let item = listData[0]
            let oneData = {
              longitude: params.longitude,
              latitude: params.latitude,
              trappingInsects: item.trappingInsects,
              deviceName: item.deviceName,
              id: item.id
            }
            this.getTrapGatherInfo(oneData)
          }
        })
      }
    },
    /**
     * 获取诱捕采集记录详情
     * @returns {Promise<void>}
     */
    async getTrapGatherInfo(item, from) {
      let params = {
        id: item.id
      }
      const res = await queryTrapGatherInfo(params)
      if (res.code === 200) {
        this.trapGatherInfo = res.data
        const imgs = this.trapGatherInfo?.imgUrl
          ?.split(',')
          .filter((item) => item)
        const videos = this.trapGatherInfo?.videoUrl
          ?.split(',')
          .filter((item) => item)
        this.fileList = [...imgs, ...videos].map((item) => ({ fileUrl: item }))
        this.dictData = this.dictData.map((item) => {
          item.value = this.trapGatherInfo[item.key] || '-'
          if (item.key === 'deviceType') {
            item.value =
              this.trapGatherInfo.deviceType === '1'
                ? '虫情测报灯'
                : '传统诱捕器'
          }
          if (item.key === 'trapNumber' && this.trapGatherInfo.trapNumber) {
            item.value = this.trapGatherInfo.trapNumber + '只'
          }
          return item
        })
        if (!from) {
          this.mountMapOverlay([
            this.trapGatherInfo.longitude,
            this.trapGatherInfo.latitude
          ])
        }
        this.dataIsReady = true
      }
    },
    /**
     * 销毁当前弹窗并重置
     */
    closeAncientTreeGroupPop() {
      // 清除弹窗
      this.propsData.closeCallback && this.propsData.closeCallback()
      this.removeOverlay()
    }
  },
  mounted() {
    setupCTips()
    this.initEvent()
    this.judgeHaveList()
    // this.getTrapGatherInfo()
  },
  beforeDestroy() {
    this.removeOverlay()
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-pop-overlay';

.detail_window_pop_vuecomp {
  ::v-deep .cont_have_liat {
    left: px-to-rem(125) !important;
  }
}

.detail_window_pop_header {
  &::before {
    left: 0;
  }
}
.copy-icon {
  margin-left: px-to-rem(6);
}
.trap-collect-log {
  position: absolute;
  bottom: px-to-rem(1);
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
      background-color: rgb(134 176 227 / 10%);
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
        margin-right: px-to-rem(12);
      }
    }

    .height {
      overflow: hidden;
      width: px-to-rem(70);
      color: rgb(232 243 254 / 50%);
      font-size: px-to-rem(14);
      text-overflow: ellipsis;
      white-space: nowrap;
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

// 林业主题
[data-theme='theme-aquamarine'] {
  .trap-collect-log {
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
}

.swiper-wrapper {
  padding-right: px-to-rem(12);

  ::v-deep .swiper-medias {
    height: px-to-rem(208) !important;
  }
}
[data-theme='theme-aquamarine'] #trap-collect-log-pop {
  &.detail_window_pop_vuecomp {
    ::v-deep .innercomp-abcontainer-header.highlight-title.left-title::before {
      width: 100% !important;
      left: 0 !important;
      transform: unset !important;
    }
    ::v-deep .innercomp-abcontainer-header {
      padding-left: 0 !important;
    }
    ::v-deep .innercomp-abcontainer-header__title {
      padding-left: px-to-rem(15);
    }
    ::v-deep .detail_window_pop_header {
      padding-left: 0 !important;
      &::before {
        left: px-to-rem(12);
      }
      .trap-title {
        padding: 0 px-to-rem(15);
        font-weight: 600;
      }
    }
  }
}
</style>
