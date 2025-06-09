<!-- eslint-disable -->
<!-- eslint-disable vue/no-undef-properties -->
<template>
  <div
    class="detail_window_pop_vuecomp wild_animal_detail"
    v-show="dataIsReady"
  >
    <absolute-container
      @close="handleClose"
      v-if="listData.length > 1"
      :width="230"
      class="container"
      :bottom="44"
      :left="-115"
    >
      <div class="tree-list">
        <el-scrollbar class="scroll-bar">
          <div
            class="tree-item"
            v-for="(item, index) in listData"
            @click="getDetailData(item, 'list')"
            :key="index"
            :class="[
              item.deploymentSituation == '1' && 'grey',
              item.deploymentSituation == '0' && 'online'
            ]"
          >
            <div class="left">
              <div
                class="icon-img-wrapper"
                v-if="item.deploymentSituation == '1'"
              >
                <img src="./assets/offline.png" alt="" />
              </div>
              <div
                class="icon-img-wrapper"
                v-if="item.deploymentSituation == '0'"
              >
                <img src="./assets/online.png" alt="" />
              </div>
              <i :class="`iconfont_tools icon-linye_icon_yebao_zhuapai`"></i>
              <p
                class="name"
                :c-tip="item.cameraName"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ item.cameraName }}</p
              >
            </div>
            <p class="type" v-show="item.height">{{ item.height }}m</p>
          </div>
        </el-scrollbar>
      </div>
    </absolute-container>
    <absolute-container
      left-title
      title=" "
      :width="368"
      :left="listData.length > 1 ? 127 : -184"
      :bottom="44"
      @close="handleClose"
      v-if="listData.length === 1 || showInfoPop"
    >
      <template v-slot:title>
        <span class="detail_window_pop_header">
          <div class="trap-title">
            <em
              class="font-style"
              :c-tip="popDetailData.cameraName"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ popDetailData.cameraName }}</em
            >
          </div>
          <div class="trap-title-right right">
            <p
              v-if="popDetailData.deploymentSituation == '0'"
              class="tips active"
              >已布设</p
            >
            <p v-else-if="popDetailData.deploymentSituation" class="tips"
              >未布设</p
            >
            <em
              @click="addCollect"
              :class="[
                'favicon iconfont_tools',
                isCollect
                  ? 'icon-tongyong_icon_shoucang_20_s active'
                  : 'icon-tongyong_icon_shoucang_20_n'
              ]"
            ></em>
          </div>
        </span>
      </template>
      <div class="content">
        <div class="line_item">
          <div class="item_name">编号：</div>
          <div class="item_value">
            <span class="item_value_inner">{{ popDetailData.cameraCode }}</span>
            <em
              @click="handleCopy(popDetailData.cameraCode)"
              class="iconfont_tools icon-fuzhiicon fiuzhi_iocn"
            ></em>
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">所属单位：</div>
          <div class="item_value">
            <span
              class="item_value_inner"
              :c-tip="popDetailData.belongCompany"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ popDetailData.belongCompany || '-' }}</span
            >
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">厂家：</div>
          <div class="item_value">
            <span
              class="item_value_inner"
              :c-tip="popDetailData.cameraManufactor"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ popDetailData.cameraManufactor || '-' }}</span
            >
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">型号：</div>
          <div class="item_value">
            <span class="item_value_inner">{{
              popDetailData.cameraModel || '-'
            }}</span>
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">类型：</div>
          <div class="item_value">
            <span class="item_value_inner">{{
              popDetailData.cameraType == '0' ? '传统设备' : '4G设备'
            }}</span>
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">经纬度：</div>
          <div class="item_value">
            <span class="item_value_inner">
              {{
                Number(popDetailData?.longitude).toFixed(6) +
                ',' +
                Number(popDetailData?.latitude).toFixed(6)
              }}</span
            >
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">地址：</div>
          <div class="item_value">
            <span
              class="item_value_inner"
              :c-tip="popDetailData.location"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ popDetailData.location }}</span
            >
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">挂高：</div>
          <div class="item_value">
            <span class="item_value_inner">{{
              popDetailData?.height ? popDetailData.height + 'm' : '-'
            }}</span>
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">布设人：</div>
          <div class="item_value">
            <span class="item_value_inner">{{
              popDetailData.deployer || '-'
            }}</span>
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">布设时间：</div>
          <div class="item_value">
            <span class="item_value_inner">{{
              popDetailData.deploymentDate || '-'
            }}</span>
          </div>
        </div>
        <div class="line_item">
          <div class="item_name">图片/视频：</div>
          <div class="item_value">
            <span class="item_value_inner">{{ popDetailData.fileNum }}</span>
          </div>
        </div>
        <div class="footer">
          <div class="f_cont">
            <template v-for="item in footerIcons">
              <em
                v-if="item.icon"
                :key="item.name"
                @click="handleFooterIconClick(item)"
                :c-tip="item.title"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                class="iconfont_tools"
                :class="
                  item.isActive ? `active ${item.actIcon}` : `${item.icon}`
                "
              ></em>
              <img class="img-sty" v-else :src="item.imgIcon" alt="" />
            </template>
          </div>
        </div>
      </div>
    </absolute-container>
    <species-gallery
      :visible="galleryVisible"
      :cameraCode="popDetailData.cameraCode"
      @tabClose="handleTabClose"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-undef-properties */
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import SpeciesGallery from './components/speciesGallery.vue'
import newMessage from '../../funCommon/message/common-message'
import { setupCTips } from '../../funCommon/c-tip'
import eventPath from '@component-gallery/build-event-bus-path'
import CTMapOl from '@ct/ct_map_ol'
import {
  queryCameraDeviceInfo,
  addOrCancelCollections,
  queryCameraListByPoint
} from './service/index'
export default {
  name: 'wc-wild-animal-detail-pop',
  components: {
    AbsoluteContainer,
    SpeciesGallery
  },
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
      isCollect: false,
      popDetailData: {},
      dataIsReady: false,
      footerIcons: [
        {
          title: '物种图集',
          imgIcon: require('./assets/noice-icon.png'),
          name: 'wztj',
          isActive: false
        },
        {
          title: '到这里',
          icon: 'icon-icon_daozheli_30_n',
          actIcon: 'icon-icon_daozheli_30_s',
          name: 'dzl',
          isActive: false
        }
      ],
      listData: [],
      galleryVisible: false,
      showInfoPop: false
    }
  },
  methods: {
    // 初始化事件监听
    initEvent() {
      this.$globalEventBus.$on(
        `${eventPath.commonInnerUtils}__camera_pop_footer_active`
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompWildlifeConservationCamera}__collect`,
        (payload) => {
          console.log(payload, '收藏状态')
          this.isCollect = payload.isCollect === '1'
        }
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
    },
    // 弹窗图层overlay
    removeOverlay() {
      const mapRef_ = this.propsData.mapRef.getMapRef(this.propsData.mapId)
      this.propsData?.closeCallback && this.propsData.closeCallback()
      if (this.detailPopup) {
        CTMapOl.OverlayControl.common.removeOverlay({
          mapRef: mapRef_,
          overlayCollection: this.detailPopup
        })
        this.detailPopup = null
        this.dataIsReady = false
      }
    },
    // 挂载弹窗
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
      this.dataIsReady = true
    },
    // 关闭按钮
    handleClose() {
      this.showInfoPop = false
      this.$globalEventBus.$emit(
        `${eventPath.commonCompWildlifeConservationCamera}__close-pop`
      )
      this.propsData.closeCallback && this.propsData.closeCallback()
      this.removeOverlay()
    },
    // 添加、取消收藏
    addCollect() {
      let params = {
        collObjCode: this.popDetailData.cameraCode,
        collObjType: '1',
        optType: this.isCollect ? 0 : 1
      }
      addOrCancelCollections(params).then((res) => {
        if (res.code == '200') {
          let msg = this.isCollect ? '取消收藏成功' : '收藏成功'
          newMessage.success(msg)
          this.$globalEventBus.$emit(
            `${eventPath.commonCompWildlifeConservationCamera}__set-collect`,
            {
              isCollect: this.isCollect ? '0' : '1',
              code: this.popDetailData.cameraCode
            }
          )
          this.isCollect = !this.isCollect
        }
      })
    },
    // 底部功能区图标点击
    handleFooterIconClick(item) {
      switch (item.name) {
        case 'wztj':
          item.isActive = !item.isActive
          this.galleryVisible = item.isActive
          break
        case 'dzl':
          item.isActive = !item.isActive
          this.$globalEventBus.$emit(
            `${eventPath.commonCompSearchMap}__set-navigation`,
            {
              open: item.isActive,
              endPoint: {
                lng: +this.popDetailData.longitude,
                lat: +this.popDetailData.latitude,
                alias: this.popDetailData.location
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
    // 查询站址列表
    queryLocationList() {
      console.log(this.propsData, 'propsData')
      const { id, latitude, longitude } = this.propsData
      if (!id) {
        // 图层打点点击
        let param = {
          longitude,
          latitude
        }
        queryCameraListByPoint(param).then((res) => {
          console.log(res, 'queryCameraListByPoint')
          if (res.code == '200' && res.data) {
            this.listData = res.data
            this.listData.forEach((item) => {
              item['id'] = item.cameraCode
            })
            if (this.listData?.length > 1) {
              this.dataIsReady = true
              let position = [+param.longitude, +param.latitude]
              this.mountMapOverlay(position)
            }
            if (this.listData.length === 1) {
              let param_ = {
                cameraCode: this.listData[0].cameraCode,
                longitude: this.listData[0].longitude,
                latitude: this.listData[0].latitude
              }
              this.getDetailData(param_)
            }
          }
        })
      } else {
        let param = {
          longitude,
          latitude,
          cameraCode: id
        }
        this.getDetailData(param)
      }
    },
    // 获取弹窗数据
    getDetailData(param_, flag) {
      const { cameraCode, latitude, longitude } = param_ || this.propsData
      let param = {
        latitude,
        longitude
      }
      if (cameraCode) {
        param.cameraCode = cameraCode
      }
      queryCameraDeviceInfo(param).then((res) => {
        if (res.code == '200' && res.data) {
          this.showInfoPop = true
          this.popDetailData = res.data
          this.isCollect = res.data.isMonitor == '1'
          let position = [
            +this.popDetailData.longitude,
            +this.popDetailData.latitude
          ]
          if (!flag) {
            this.mountMapOverlay(position)
          }
        }
      })
    },
    // 复制方法
    copyText(value) {
      const aux = document.createElement('input')
      aux.value = value
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    // 一键复制
    handleCopy(value) {
      this.copyText(value)
      newMessage.success(`复制成功`)
    },
    handleTabClose() {
      this.galleryVisible = false
      let findOne = this.footerIcons.find((item) => item.name == 'wztj')
      findOne.isActive = false
    }
  },
  mounted() {
    this.initEvent()
    this.queryLocationList()
    setupCTips()
  },
  beforeDestroy() {
    this.removeOverlay()
  }
}
/* eslint-disable vue/no-undef-properties */
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/base-pop-overlay';
::v-deep .container {
  .previous-vacancies {
    max-height: px-to-rem(160);
  }
  .el-scrollbar__wrap {
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
.wild_animal_detail {
  ::v-deep .innercomp-abcontainer {
    bottom: 36px !important;
  }
}
[data-theme='theme-aquamarine'] .wild_animal_detail {
  ::v-deep .innercomp-abcontainer-header.highlight-title.left-title::before {
    width: 100% !important;
    left: 0 !important;
    transform: unset !important;
  }
  &.detail_window_pop_vuecomp {
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
      }
    }
  }
}

.detail_window_pop_vuecomp {
  .detail_window_pop_header {
    &::before {
      left: 0;
    }
  }

  .font-style {
    font-style: normal;
    font-weight: 600;
  }

  i.active {
    color: #f9ff6c;
  }

  .tree-list {
    width: px-to-rem(230);

    .scroll-bar {
      width: 100%;
      height: 100%;

      ::v-deep .el-scrollbar__wrap {
        max-height: px-to-rem(160);
      }
    }

    .icon-img-wrapper {
      position: relative;

      &::before {
        position: absolute;
        bottom: px-to-rem(-5);
        left: px-to-rem(2);
        display: block;
        width: px-to-rem(5);
        height: px-to-rem(5);
        background-color: #fff;
        border-radius: 50%;
        content: '';
      }

      img {
        position: absolute;
        bottom: px-to-rem(-8);
        left: px-to-rem(0);
        width: px-to-rem(10);
        height: px-to-rem(10);
      }
    }

    .tree-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 px-to-rem(12) 0 px-to-rem(6);
      width: 100%;
      height: px-to-rem(32);
      line-height: px-to-rem(32);
      cursor: pointer;
      color: #fff;

      &:hover {
        background: rgb(13 201 133 / 40%);
      }

      &.grey {
        color: rgb(255 255 255 / 60%);
      }

      .left {
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-right: px-to-rem(6);
      }

      .name {
        overflow: hidden;
        margin-left: px-to-rem(6);
        text-overflow: ellipsis;
        flex: 1;
        white-space: nowrap;
      }

      .type {
        min-width: fit-content;
      }
    }

    .type,
    .name {
      font-size: px-to-rem(14);
    }
  }

  .trap-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .content {
    padding: px-to-rem(12) 0 px-to-rem(0) px-to-rem(12);
    color: #fff;
    font-size: px-to-rem(14);

    .line_item {
      display: flex;
      align-items: center;
      height: px-to-rem(20);
      font-size: px-to-rem(14);

      .item_name {
        min-width: px-to-rem(77);
        color: rgb(255 255 255 / 70%);
        text-align: right;
        flex-shrink: 0;
      }

      .item_value {
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-right: px-to-rem(12);
        max-width: 100%;
        color: #fff;

        .item_value_inner {
          overflow: hidden;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .fiuzhi_iocn {
          margin-left: px-to-rem(6);
        }
      }
    }

    .line_item + .line_item {
      margin-top: px-to-rem(6);
    }
  }

  .footer {
    margin-top: px-to-rem(12);
    margin-right: px-to-rem(12);
    height: px-to-rem(54);

    .f_cont {
      display: flex;
      align-items: center;
      height: 100%;
      color: #fff;
      border-top: px-to-rem(1) solid rgb(255 255 255 / 20%);

      i {
        font-size: px-to-rem(30);
      }

      .active {
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        color: #f9ff6c;
        background-image: url('~@component-gallery/assets/image/tool-box/aquamarine/funcicon-bg.png');
      }

      i + i {
        margin-left: px-to-rem(6);
      }
    }
  }
}

.img-sty {
  width: px-to-rem(30);
  height: px-to-rem(30);
}
</style>
