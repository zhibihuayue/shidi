<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <div
    class="detail_window_pop_vuecomp wc_species_detail_pop"
    v-show="dataIsReady"
  >
    <div class="camera_vue_comp_infowindow_list" v-show="isHaveList">
      <div class="close_icon" @click="handleClose"> </div>
      <div class="previous-vacancies"></div>
      <div class="list_item_wrap">
        <div
          class="list_item list_online"
          v-for="(item, index) in pictureList"
          :key="index"
          @click="handleListItemClick(item, index)"
        >
          <div class="icon_name">
            <i
              class="camera_icon_list iconfont_tools icon-icon_yeshengdongwu_30_s"
            ></i>
            <div
              class="list_item_name"
              :c-tip="item.speciesName"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              >{{ item.speciesName }}</div
            >
          </div>
          <div class="height">{{ item.protectionLevelName }}</div>
        </div>
      </div>
    </div>
    <absolute-container
      left-title
      title=" "
      :width="600"
      :left="-300"
      :bottom="0"
      @close="handleClose"
      :industryClass="isHaveList ? 'cont_have_liat' : ''"
      v-show="popDetailData.speciesVO"
    >
      <template v-slot:title>
        <span class="detail_window_pop_header">
          <div class="trap-title title">物种详情</div>
        </span>
      </template>
      <div class="animal_content">
        <div class="top_cont">
          <div class="left">
            <div class="lunbo">
              <div :class="['carousel', 'always']">
                <el-carousel
                  :autoplay="false"
                  trigger="click"
                  indicator-position="none"
                  :arrow="fileList.length > 1 ? 'always' : 'never'"
                  @change="onSwitchNowIndex"
                >
                  <el-carousel-item v-for="(file, ind) in fileList" :key="ind">
                    <div class="carouselpage" @click="previewVisible = true">
                      <video
                        v-if="file.fileType === '1'"
                        :src="file.url"
                        muted
                        preload="metadata"
                      />
                      <img
                        v-else
                        :src="file.url"
                        alt="图片"
                        style="width: 100%; height: 100%"
                      />
                      <i
                        v-if="file.fileType === '1'"
                        class="iconfont_tools icon-linye_icon_xunhangbofang playicon"
                      />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
            <div class="level">{{
              popDetailData.speciesVO?.protectionLevelName
            }}</div>
            <div class="info">
              <div class="info_line">
                <i class="iconfont_tools icon-linye_icon_yebao_zhuapai" />
                <span
                  class="line"
                  :c-tip="nowFile.cameraName"
                  c-tip-placement="top"
                  c-tip-class="c-tip-normal"
                  >{{ nowFile.cameraName }}</span
                >
              </div>
              <div class="info_line">
                <i class="iconfont_tools icon-linye_icon_yebao_dizhi" />
                <span
                  class="line"
                  :c-tip="nowFile.location"
                  c-tip-placement="top"
                  c-tip-class="c-tip-normal"
                  >{{ nowFile.location }}</span
                >
              </div>
              <div class="info_line_last">
                <span style="text-wrap: nowrap">{{ nowFile.createTime }}</span>
                <span style="padding-left: 6px">|</span>
                <span
                  class="line"
                  style="color: unset"
                  :c-tip="nowFile.creator"
                  c-tip-placement="top"
                  c-tip-class="c-tip-normal"
                  >{{ nowFile.creator }}</span
                >
              </div>
            </div>
          </div>
          <div class="right">
            <div class="animal_name">
              <span
                class=""
                :c-tip="popDetailData.speciesVO?.speciesName"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ popDetailData.speciesVO?.speciesName }}</span
              >
              <span
                class=""
                :c-tip="popDetailData.speciesVO?.scientificName"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ popDetailData.speciesVO?.scientificName }}</span
              >
            </div>
            <div class="diminsion">
              <div
                class="box"
                :c-tip="popDetailData?.diminsion"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
              >
                {{ popDetailData?.diminsion }}
              </div>
            </div>
            <div class="line_item_wrap">
              <div class="line_item">
                <div class="item_name">保护等级：</div>
                <div class="item_value">
                  <span class="item_value_inner">{{
                    popDetailData.speciesVO?.protectionLevelName
                  }}</span>
                </div>
              </div>
              <div class="line_item">
                <div class="item_name">是否三有动物：</div>
                <div class="item_value">
                  <span class="item_value_inner">{{
                    popDetailData.speciesVO?.haveThree === 0 ? '是' : '否'
                  }}</span>
                </div>
              </div>
              <div class="line_item">
                <div class="item_name">数量：</div>
                <div class="item_value">
                  <span class="item_value_inner">{{
                    popDetailData.speciesVO?.speciesNum || '-'
                  }}</span>
                  <span v-if="popDetailData.speciesVO?.speciesNum">只</span>
                </div>
              </div>

              <div class="line_item">
                <div class="item_name">图片/视频：</div>
                <div class="item_value">
                  <span class="item_value_inner"
                    >{{
                      popDetailData.speciesFileStatistics?.imgTotalNum +
                      popDetailData.speciesFileStatistics?.videoTotalNum
                    }}个</span
                  >
                </div>
              </div>
              <div class="line_item">
                <div class="item_name">创建日期：</div>
                <div class="item_value">
                  <span class="item_value_inner">{{
                    popDetailData.speciesVO?.createTime
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="introduce">
            <span>介绍</span>
          </div>
          <div class="introduce_des">
            {{ popDetailData.speciesVO?.introduce }}
          </div>
        </div>
      </div>
    </absolute-container>
    <image-viewer
      :urlList="fileList"
      :initialIndex.sync="currentIndex"
      v-if="previewVisible"
      :onClose="handlePreOnClose"
      :isShowWaterSeal="true"
    >
      <div class="picture_weater">
        <div class="left">
          <div class="line">
            <i class="iconfont_tools icon-linye_icon_yebao_zhuapai"></i>
            {{ fileList[currentIndex].cameraName }}
          </div>
          <div class="line">
            <i class="iconfont_tools icon-linye_icon_yebao_dizhi"></i>
            {{ fileList[currentIndex].location }}
          </div>
        </div>
        <div class="right">
          <div class="line">{{ fileList[currentIndex].creator }}</div>
          <div class="line">{{ fileList[currentIndex].createTime }}</div>
        </div>
      </div>
    </image-viewer>
  </div>
</template>

<script>
/* eslint-disable vue/no-undef-properties */
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import ImageViewer from '../image-video-preview/Index.vue'
import newMessage from '../../funCommon/message/message'
import eventPath from '@component-gallery/build-event-bus-path'
import CTMapOl from '@ct/ct_map_ol'
import { setupCTips } from '../../funCommon/c-tip'
import {
  querySpeciesDetailsBySpeciesManagement,
  isHaveMoreSpecies
} from './service/index'
export default {
  name: 'wc-species-detail-pop',
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
      popDetailData: {},
      nowFile: {},
      dataIsReady: false,
      fileList: [],
      previewVisible: false,
      currentIndex: 0,
      pictureList: [],
      isHaveList: false,
      waterSeal: {
        trappingInsects: 'weichuang001',
        createTime: '234tr'
      }
    }
  },
  components: {
    AbsoluteContainer,
    ImageViewer
  },
  methods: {
    initEvent() {
      console.log('initEvent/', this.propsData)
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
        { positioning: 'top-left', offset: [0, -36] }
      )
      console.log('spotPopup', spotPopup)
      this.detailPopup = spotPopup
    },
    handleClose() {
      this.propsData.closeCallback && this.propsData.closeCallback()
      this.removeOverlay()
    },
    handleListItemClick(item, index) {
      this.getDetailData(item, 'fromList')
    },
    judgeHaveList() {
      const { latitude, longitude, speciesData } = this.propsData
      // 列表来源 有单个和列表的区分
      if (speciesData) {
        if (this.propsData.speciesData.length > 1) {
          this.pictureList = this.propsData.speciesData
          this.isHaveList = true
          this.dataIsReady = true
          let position = [
            +this.propsData.speciesData[0].longitude,
            +this.propsData.speciesData[0].latitude
          ]
          this.mountMapOverlay(position)
        } else {
          this.getDetailData(this.propsData.speciesData[0])
        }
      } else {
        // 图层点击打点过来
        let param = {
          longitude,
          latitude
        }
        isHaveMoreSpecies(param).then((res) => {
          if (res.code == '200') {
            this.pictureList = res.data.map((item) => {
              return {
                latitude: item.latitude,
                longitude: item.longitude,
                protectionLevelName: item.speciesVO.protectionLevelName,
                speciesId: item.speciesId,
                speciesName: item.speciesVO.speciesName
              }
            })
            if (this.pictureList.length > 1) {
              this.isHaveList = true
              this.dataIsReady = true
              let position = [+param.longitude, +param.latitude]
              this.mountMapOverlay(position)
            } else {
              // 只有一条数据
              this.getDetailData(this.pictureList[0])
            }
          }
        })
      }
    },
    getDetailData(item, from) {
      let id = item.speciesId
      let params = {
        speciesId: id,
        longitude: item.longitude,
        latitude: item.latitude
      }
      querySpeciesDetailsBySpeciesManagement(params).then((res) => {
        if (res.code == '200') {
          this.popDetailData = res.data
          this.nowFile = res.data.speciesFileList[0] || {}
          this.fileList = res.data?.speciesFileList?.map((o) => ({
            ...o,
            url: o.fileUrl,
            type: o.fileType == '1' ? '2' : '1'
          }))
          let speciesData = this.popDetailData.speciesVO
          if (speciesData) {
            // 构造所属，按照门/纲/目/科/属的字段顺序拼接
            const keyArr = ['phylum', 'classis', 'order', 'family', 'genus']
            this.popDetailData.diminsion = keyArr
              .map((k) => speciesData[k])
              .join('/')
          }
          let position = [+item.longitude, +item.latitude]
          if (!from) {
            this.mountMapOverlay(position)
          }
          this.dataIsReady = true
        }
      })
    },
    onSwitchNowIndex(newIndex) {
      this.currentIndex = newIndex
      this.nowFile = this.fileList[newIndex]
    },
    handlePreOnClose() {
      this.previewVisible = false
    }
  },
  mounted() {
    setupCTips()
    this.initEvent()
    this.judgeHaveList()
  },
  beforeDestroy() {
    this.removeOverlay()
  }
}
/* eslint-disable vue/no-undef-properties */
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-pop-overlay';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-aquamarine'] .wc_species_detail_pop {
  ::v-deep .innercomp-abcontainer-header.highlight-title.left-title::before {
    width: 100% !important;
    left: 0 !important;
    transform: unset !important;
  }
}
.detail_window_pop_vuecomp {
  .detail_window_pop_header {
    &::before {
      left: 0;
    }
    padding-left: 0 !important;
    .trap-title {
      padding: 0 px-to-rem(15);
      font-weight: 600;
    }
  }

  ::v-deep .cont_have_liat {
    left: px-to-rem(125) !important;
  }

  .animal_content {
    padding: px-to-rem(12);
    color: #fff;
    font-size: px-to-rem(14);

    .top_cont {
      display: flex;
      padding-bottom: px-to-rem(12);

      .left,
      .right {
        flex: 1;
      }

      .left {
        position: relative;
        margin-right: px-to-rem(6);
        width: px-to-rem(260);
        min-height: px-to-rem(218);
        background: rgb(2 137 109 / 5%);
        border: px-to-rem(1) solid rgb(2 137 109 / 50%);
        border-radius: px-to-rem(8);

        .lunbo {
          width: 100%;
          height: px-to-rem(145);

          .carousel {
            width: 100%;
            height: 100%;

            &.never {
              ::v-deep .el-carousel__arrow {
                opacity: 0;
              }
            }

            .el-carousel {
              height: 100%;

              ::v-deep .el-carousel__container {
                width: 100%;
                height: 100%;

                .el-carousel__arrow {
                  width: px-to-rem(30) !important;
                  height: px-to-rem(30) !important;
                  background: rgb(2 50 32 / 70%) !important;

                  i {
                    font-weight: 700;
                    font-size: px-to-rem(14);
                  }
                  &.el-carousel__arrow--left {
                    left: px-to-rem(6);
                  }
                  &.el-carousel__arrow--right {
                    right: px-to-rem(6);
                  }
                }
              }
            }

            .carouselpage {
              position: relative;
              width: 100%;
              height: 100%;
              cursor: pointer;

              img,
              video {
                width: 100%;
                height: 100%;
                border-radius: px-to-rem(8) px-to-rem(8) 0 0;
                object-fit: cover;
              }

              .playicon {
                position: absolute;
                top: calc(50% - px-to-rem(25));
                left: calc(50% - px-to-rem(25));
                font-size: px-to-rem(50);
              }
            }
          }
        }

        .level {
          position: absolute;
          top: px-to-rem(122);
          left: 0;
          z-index: 10;
          padding: 0 px-to-rem(6);
          height: px-to-rem(24);
          background: rgb(5 15 23 / 70%);
          border-radius: 0 px-to-rem(4) 0 px-to-rem(0);
          color: #fff;
          font-size: px-to-rem(12);
          line-height: px-to-rem(24);
        }

        .info {
          padding: px-to-rem(12) px-to-rem(12) px-to-rem(10);

          .info_line {
            display: flex;
            align-items: center;
            margin-bottom: px-to-rem(6);

            .iconfont_tools {
              font-size: px-to-rem(12);
            }

            span {
              display: block;
              overflow: hidden;
              margin-left: px-to-rem(6);
              text-overflow: ellipsis;
              white-space: nowrap;
              flex: 1;
              word-break: keep-all;
              line-height: 1;
              font-size: px-to-rem(12);
            }
          }

          .info_line_last {
            display: flex;
            padding-left: px-to-rem(18);
            color: rgb(255 255 255 / 70%);
            font-size: px-to-rem(12);
            font-family: PingFangSC, 'PingFang SC';
            font-weight: 400;

            .line {
              overflow: hidden;
              margin-left: px-to-rem(6);
              text-overflow: ellipsis;
              white-space: nowrap;
              flex: 1;
              word-break: keep-all;
            }
          }
        }
      }

      .right {
        margin-left: px-to-rem(6);
        width: px-to-rem(260);

        .animal_name {
          display: flex;
          align-items: baseline;
          width: 100%;
          color: #0dc985;
          font-size: px-to-rem(18);
          font-family: PingFangSC, 'PingFang SC';
          line-height: 1;
          font-weight: 500;

          span {
            overflow: hidden;
            max-width: 50%;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: keep-all;
            font-weight: 400;
            flex-shrink: 0;
            margin-right: px-to-rem(6);
          }

          span + span {
            font-size: px-to-rem(12);
            margin-left: px-to-rem(6);
            margin-right: px-to-rem(0);
          }
        }

        .diminsion {
          position: relative;
          padding: px-to-rem(3) px-to-rem(14);
          margin-top: px-to-rem(10);
          width: fit-content;
          background: rgb(249 255 108 / 10%);
          color: #f9ff6c;
          font-size: px-to-rem(12);
          font-family: PingFangSC, 'PingFang SC';
          line-height: px-to-rem(15);

          &::before,
          &::after {
            position: absolute;
            top: calc(50% - px-to-rem(6));
            left: 0;
            width: px-to-rem(2);
            height: px-to-rem(12);
            background: #f9ff6c;
            box-shadow: 0 0 px-to-rem(6) 0 rgb(249 255 108 / 50%);
            content: '';
          }

          &::after {
            right: 0;
            left: unset;
          }

          .box {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-break: break-all;
          }
        }

        .line_item_wrap {
          margin-top: px-to-rem(12);
          width: 100%;

          .line_item {
            display: flex;
            align-items: center;
            height: px-to-rem(20);
            font-size: px-to-rem(14);

            .item_name {
              min-width: px-to-rem(98);
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
            }
          }

          .line_item + .line_item {
            margin-top: px-to-rem(6);
          }
        }
      }
    }
  }

  .bottom {
    color: rgb(255 255 255 / 70%);
    font-size: px-to-rem(12);
    border-top: px-to-rem(1) solid rgb(255 255 255 / 20%);
    line-height: px-to-rem(18);

    .introduce {
      margin: px-to-rem(14) 0 px-to-rem(12);
      text-shadow: 0 0 px-to-rem(8) rgb(0 245 193 / 70%);
      color: #fff;
      font-size: px-to-rem(16);
    }

    .introduce_des {
      color: rgb(255 255 255 / 70%);
      font-size: px-to-rem(14);
      line-height: px-to-rem(20);
      word-break: break-all;
    }
  }
}

.camera_vue_comp_infowindow_list {
  position: absolute;
  bottom: px-to-rem(0);
  left: px-to-rem(-115);
  width: px-to-rem(230);
  background: rgb(23 37 55 / 90%);
  border-radius: px-to-rem(8);
  user-select: none;

  .list_item_wrap {
    overflow: hidden auto;
    max-height: px-to-rem(160);

    &::-webkit-scrollbar {
      width: px-to-rem(6);
      height: px-to-rem(6);
      border-radius: px-to-rem(3);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(2 137 109 / 40%);
      border: 0;
      border-radius: px-to-rem(3);
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgb(2 137 109 / 40%);
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

  .list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px 0 px-to-rem(6);
    padding: 0 px-to-rem(6) 0 px-to-rem(6);
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
      margin-right: px-to-rem(3);
      color: rgb(232 243 254 / 50%);
      font-size: px-to-rem(14);
      flex: 1;

      .camera_icon_list {
        margin-right: px-to-rem(6);
        font-size: px-to-rem(20);
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
      margin-left: px-to-rem(3);
      color: rgb(232 243 254 / 50%);
      font-size: px-to-rem(14);
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
}

.picture_weater {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: px-to-rem(12) px-to-rem(24);
  width: 100%;

  .line {
    font-size: px-to-rem(14);

    .iconfont_tools {
      margin-right: px-to-rem(6);
      font-size: px-to-rem(12);
    }

    + .line {
      margin-top: px-to-rem(12);
    }
  }

  .left {
    color: #fff;
  }

  .right {
    color: #fff;
    font-size: px-to-rem(12);

    .line {
      text-align: right;
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
}
</style>
