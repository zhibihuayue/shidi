<template>
  <div class="device_info_detail" :class="isHaveList ? 'listShow' : ''">
    <div class="content">
      <div class="previous-vacancies"></div>
      <div class="header">
        <div class="header_cont">
          <span>详细信息</span>
        </div>
        <div class="close_icon" @click="handleCloseIconClick"></div>
      </div>
      <div class="context">
        <template v-for="(item, index) in showConfig">
          <template v-if="item.type == 'normal'">
            <div class="spot-item" :key="index">
              <div class="spot-name">{{ item.name }}：</div>
              <div class="spot-value">
                <span
                  class="spot-value_inner"
                  :c-tip="deviceInfo[item.prop]"
                  c-tip-placement="top"
                  c-tip-class="c-tip-normal"
                  >{{ deviceInfo[item.prop] || '-'
                  }}<span
                    v-if="
                      item.prop == 'height' ||
                      (item.prop == 'visualRadius' && deviceInfo[item.prop])
                    "
                    >m</span
                  ></span
                >
                <i
                  v-if="item.copy"
                  @click="handleCopy(deviceInfo[item.prop])"
                  class="iconfont_tools icon-fuzhiicon fiuzhi_iocn"
                ></i>
              </div>
            </div>
          </template>
          <template v-if="item.type == 'lon_lat'">
            <div class="spot-item" :key="index">
              <div class="spot-name">{{ item.name }}：</div>
              <div class="spot-value">
                <span class="spot-value_inner">{{
                  `${deviceInfo['longitude_d']},${deviceInfo['latitude_d']}`
                }}</span>
              </div>
            </div>
          </template>
          <template v-if="item.type == 'tags'">
            <div class="spot-item spot_item_tags" :key="index">
              <div class="spot-name">{{ item.name }}：</div>
              <div
                class="spot-value tags"
                v-if="deviceInfo.labelNameList?.length > 0"
              >
                <div
                  class="tag_item_wrap"
                  v-for="(item, index) in deviceInfo.labelNameList"
                  :key="index"
                >
                  <span
                    class="tag_item"
                    :c-tip="item"
                    c-tip-placement="top"
                    c-tip-class="c-tip-normal"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="spot-value" v-else>
                <span class="spot-value_inner">-</span>
              </div>
            </div>
          </template>
          <template v-if="item.type == 'dics'">
            <div class="spot-item" :key="index">
              <div class="spot-name">{{ item.name }}：</div>
              <div class="spot-value">
                <span class="spot-value_inner">{{
                  dics[deviceInfo[item.prop]]
                }}</span>
              </div>
            </div>
          </template>
          <template v-if="item.type == 'warn'">
            <div class="spot-item spot_item_tags warn" :key="index">
              <div class="spot-name">{{ item.name }}：</div>
              <div class="spot-value tags">
                <div
                  class="tag_item_wrap"
                  :class="deviceInfo[item.prop] == '1' ? 'open' : 'not_open'"
                >
                  <span class="tag_item" v-if="deviceInfo[item.prop] == '0'"
                    >未开启</span
                  >
                  <span class="tag_item" v-if="deviceInfo[item.prop] == '1'"
                    >开启</span
                  >
                </div>
              </div>
            </div>
          </template>
          <template v-if="item.type == 'channel'">
            <div :key="index" class="tongdao_line"></div>
            <div
              :key="index"
              class="tongdao_cont_wrap"
              :class="deviceInfo.channels?.length > 2 ? 'need_scroll' : ''"
            >
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
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import newMessage from '../../funCommon/message/common-message'
import { setupCTips } from '../../funCommon/c-tip'
import { getDictType } from './service/index'
export default {
  name: 'device_info_detail',
  props: {
    deviceInfo: {
      type: Object,
      required: true
    },
    isHaveList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showConfig: [
        {
          name: '摄像机名称',
          prop: 'devName',
          copy: true,
          type: 'normal'
        },
        {
          name: '摄像机编号',
          prop: 'deviceCode',
          copy: true,
          type: 'normal'
        },
        {
          name: '摄像机类型',
          prop: 'categoryCode',
          type: 'dics'
        },
        {
          name: '摄像机标签',
          prop: '',
          type: 'tags'
        },
        {
          name: '摄像机厂家',
          prop: 'modelName',
          type: 'normal'
        },
        {
          name: '摄像机型号',
          prop: 'deviceModelCode',
          type: 'normal'
        },
        {
          name: '经纬度',
          prop: '',
          type: 'lon_lat'
        },
        {
          name: '摄像机地址',
          prop: 'location',
          type: 'normal'
        },
        {
          name: '摄像机挂高',
          prop: 'height',
          type: 'normal'
        },
        {
          name: '可视半径',
          prop: 'visualRadius',
          type: 'normal'
        },
        {
          name: '告警定位',
          prop: 'alarmLocation',
          type: 'warn'
          // /告警定位（1:开启 0关闭）
        },
        {
          name: '所属组织',
          prop: 'orgName',
          type: 'normal'
        },
        {
          name: '',
          prop: '',
          type: 'channel'
        }
      ],
      dics: {}
    }
  },
  methods: {
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
    // 关闭按钮
    handleCloseIconClick() {
      this.$emit('detailClose')
    },
    // 获取摄像机类型码值
    getDics() {
      getDictType('ar_screen_category_code').then((res) => {
        this.dics = {}
        res.data?.forEach((item) => {
          if (!this.dics[item.dictValue]) {
            this.dics[item.dictValue] = item.dictLabel
          } else {
            this.dics[item.dictValue] = item.dictLabel
          }
        })
      })
    }
  },
  mounted() {
    this.getDics()
    setupCTips()
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.device_info_detail {
  position: absolute;
  bottom: px-to-rem(0);
  left: px-to-rem(204);
  width: px-to-rem(368);
  background: rgb(23 37 55 / 90%);
  border-radius: px-to-rem(8);
  color: #e8f3fe;
  font-size: px-to-rem(14);
  user-select: none;

  &.listShow {
    left: px-to-rem(520);
  }

  .content {
    .header {
      position: relative;

      .header_cont {
        height: px-to-rem(48);
        background: linear-gradient(
          180deg,
          rgb(132 180 250 / 70%) 0%,
          rgb(132 180 250 / 24%) 100%
        );
        border-radius: px-to-rem(8) px-to-rem(8) 0 0;
        color: #e8f3fe;
        font-size: px-to-rem(16);
        text-align: center;
        line-height: px-to-rem(48);
        span {
          font-weight: 600;
          font-family: PingFangSC, PingFang SC;
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

    .context {
      padding: px-to-rem(12) 0 px-to-rem(12) px-to-rem(12);

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
          margin-right: px-to-rem(12);
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

      .spot-item + .spot-item {
        margin-top: px-to-rem(6);
      }

      .fiuzhi_iocn.iconfont_tools {
        margin-left: px-to-rem(4);
        color: #e8f3fe;
        font-size: px-to-rem(20);
        cursor: pointer;
      }

      .tongdao_line {
        display: flex;
        margin: px-to-rem(12) px-to-rem(12) 0 0;
        border-top: px-to-rem(1) solid rgb(232 243 254 / 20%);
      }

      .tongdao_cont_wrap {
        padding-top: px-to-rem(12);

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

        .channel_item_wrap + .channel_item_wrap {
          margin-top: px-to-rem(6);
        }

        .channel_item_wrap {
          .spot-item {
            position: relative;

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

        &.need_scroll {
          overflow-y: auto;
          max-height: px-to-rem(107);
        }
      }

      .spot_item_tags {
        margin-top: px-to-rem(3) !important;
        height: auto;
      }

      .spot_item_tags + .spot-item {
        margin-top: px-to-rem(3) !important;
      }

      .spot-value.tags {
        overflow: hidden auto;
        padding-right: px-to-rem(10);
        margin-right: 0;
        min-height: px-to-rem(20);
        max-height: px-to-rem(90);
        flex-wrap: wrap;

        .tag_item_wrap {
          padding: px-to-rem(3) 0;
          margin-right: px-to-rem(6);
          height: px-to-rem(30);
        }

        .tag_item {
          display: block;
          overflow: hidden;
          padding: px-to-rem(6);
          max-width: 2.5rem;
          background: rgb(251 145 60 / 20%);
          border-radius: px-to-rem(4);
          color: #ffeeb1;
          font-size: px-to-rem(12);
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1;
        }

        .tag_item_wrap.open {
          .tag_item {
            background: rgb(21 189 148 / 20%) !important;
            color: #15bd94;
          }
        }

        .tag_item_wrap.not_open {
          .tag_item {
            background: rgb(237 81 98 / 20%) !important;
            color: #ed5158;
          }
        }
        &::-webkit-scrollbar {
          width: px-to-rem(6);
          height: px-to-rem(6);
          border-radius: px-to-rem(3);
        }
        &::-webkit-scrollbar-thumb {
          background-color: rgba(79, 159, 255, 0.4) !important;

          &:hover {
            background-color: rgba(79, 159, 255, 0.4) !important;
          }
        }
      }
    }
  }
}

// 林业主题
[data-theme='theme-aquamarine'] {
  .device_info_detail {
    background: linear-gradient(180deg, rgb(0 19 30 / 70%), #00131e);
    border-image: linear-gradient(1turn, rgb(7 91 74 / 75%), rgb(7 91 74 / 30%))
      1 1;
    border-radius: 0;

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

    .content {
      .header {
        .header_cont {
          position: relative;
          background: linear-gradient(
            90deg,
            rgb(2 137 109 / 0%) 0%,
            rgb(2 137 109 / 20%) 51%,
            rgb(2 137 109 / 0%) 100%
          );
          z-index: 0;
          &::before {
            position: absolute;
            bottom: 0;
            display: block;
            width: 100%;
            height: px-to-rem(1);
            background: linear-gradient(
              270deg,
              rgb(255 255 255 / 0%) 0%,
              #fff 50%,
              rgb(255 255 255 / 0%) 100%
            );
            content: '';
          }

          &::after {
            position: absolute;
            bottom: 0;
            left: 25%;
            display: block;
            width: 50%;
            height: px-to-rem(10);
            background: url('~./assets/ly_pop_guang.png') no-repeat;
            background-size: contain;
            content: '';
          }

          span {
            display: block;
            height: 100%;
            font-weight: 600;
            font-family: PingFangSC, PingFang SC;

            &::before {
              position: absolute;
              top: px-to-rem(-6.5);
              left: 50%;
              width: px-to-rem(36);
              height: px-to-rem(14);
              background: url('~@component-gallery/assets/image/common/aquamarine/popup-header-k.png')
                no-repeat center / 100% 100%;
              pointer-events: none;
              content: '';
              transform: translateX(-50%);
            }

            &::after {
              position: absolute;
              top: 0;
              left: 25%;
              display: block;
              width: 50%;
              height: 100%;
              background: url('~./assets/ly_title_bg.png') no-repeat;
              background-size: contain;
              content: '';
              z-index: -1;
            }
          }
        }

        .close_icon {
          background: url('~@component-gallery/assets/image/common/aquamarine/icon_close@2x.png');
          background-size: 100% 100%;
        }
      }

      .context {
        .spot-item {
          .spot-name {
            min-width: px-to-rem(84);
            color: rgb(255 255 255 / 70%);
          }

          .spot-value {
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-right: px-to-rem(12);
            max-width: 100%;
            color: #fff;
          }
        }

        .fiuzhi_iocn.iconfont_tools {
          margin-left: px-to-rem(4);
          color: #fff;
          font-size: px-to-rem(20);
          cursor: pointer;
        }

        .tongdao_line {
          border-top: px-to-rem(1) solid rgb(255 255 255 / 20%);
        }

        .tongdao_cont_wrap {
          &::-webkit-scrollbar-thumb {
            background-color: rgb(2 137 109 / 40%) !important;

            &:hover {
              background-color: rgb(2 137 109 / 40%) !important;
            }
          }

          &.need_scroll {
            overflow-y: auto;
          }
        }

        .spot_item_tags {
          margin-top: px-to-rem(3) !important;
          height: auto;
        }

        .spot_item_tags + .spot-item {
          margin-top: px-to-rem(3) !important;
        }

        .spot-value.tags {
          overflow: hidden auto;
          padding-right: px-to-rem(10);
          margin-right: 0;
          min-height: px-to-rem(20);
          max-height: px-to-rem(90);
          flex-wrap: wrap;
          &::-webkit-scrollbar-thumb {
            background-color: rgb(2 137 109 / 40%) !important;

            &:hover {
              background-color: rgb(2 137 109 / 40%) !important;
            }
          }
          .tag_item_wrap {
            padding: px-to-rem(3) 0;
            margin-right: px-to-rem(6);
            height: px-to-rem(30);
          }

          .tag_item {
            position: relative;
            display: block;
            padding: px-to-rem(6);
            background: rgb(249 255 108 / 25%) !important;
            border-radius: px-to-rem(4);
            border-radius: px-to-rem(6) 0;
            box-shadow: inset 0 0 px-to-rem(2) 0 rgb(249 255 108 / 60%);
            color: #f9ff6c;

            &::after,
            &::before {
              position: absolute;
              top: calc(50% - px-to-rem(6));
              right: 0;
              display: block;
              width: px-to-rem(2);
              height: px-to-rem(12);
              background: #f9ff6c;
              background-size: 100% 100%;
              border-radius: px-to-rem(2) 0 0 px-to-rem(2);
              box-shadow: px-to-rem(-1) 0 px-to-rem(3) px-to-rem(3)
                rgb(249 255 108 / 20%);
              content: '';
            }

            &::before {
              right: unset;
              left: 0;
            }
          }
        }

        .spot_item_tags.warn {
          .spot-value.tags {
            .tag_item {
              border-radius: px-to-rem(4);
              box-shadow: none;

              &::after,
              &::before {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

// 国土主题
[data-theme='theme-terracotta'] {
  .device_info_detail {
    background: rgba(23, 20, 11, 0.9);
    border: 1px solid #6e674e;
    border-radius: 0;

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

    .content {
      .header {
        .header_cont {
          position: relative;
          background: none;

          &::before {
            content: '';
            position: absolute;
            bottom: 0;
            display: block;
            width: 100%;
            height: px-to-rem(1);
            background: linear-gradient(
              90deg,
              rgb(255 222 76 / 0%),
              rgb(255 222 76),
              rgb(255 222 76 / 0%)
            );
            opacity: 0.35;
          }

          &::after {
            position: absolute;
            bottom: 0;
            left: 25%;
            display: block;
            width: px-to-rem(180);
            height: px-to-rem(16);
            background: url('~./assets/gt_pop_guang.png') no-repeat;
            background-size: contain;
            content: '';
          }

          span {
            display: block;
            height: 100%;
            text-shadow: px-to-rem(1) 0 px-to-rem(4) #dcd277;
            font-size: px-to-rem(18);
            font-weight: 600;
          }
        }

        .close_icon {
          background: url('~@component-gallery/assets/image/common/terracotta/icon_close@2x.png');
          background-size: 100% 100%;
        }
      }

      .context {
        .spot-item {
          .spot-name {
            min-width: px-to-rem(84);
            color: rgb(228 231 193 / 70%);
          }

          .spot-value {
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-right: px-to-rem(12);
            max-width: 100%;
            color: rgb(228 231 193 / 100%);
          }
        }

        .fiuzhi_iocn.iconfont_tools {
          margin-left: px-to-rem(4);
          color: rgb(228 231 193 / 100%);
          font-size: px-to-rem(20);
          cursor: pointer;
        }

        .tongdao_line {
          border-top: px-to-rem(1) solid rgb(228 231 193 / 20%);
        }

        .tongdao_cont_wrap {
          &::-webkit-scrollbar-thumb {
            background-color: rgb(255 238 177 / 40%) !important;

            &:hover {
              background-color: rgb(255 238 177 / 40%) !important;
            }
          }

          &.need_scroll {
            overflow-y: auto;
          }
        }

        .spot_item_tags {
          margin-top: px-to-rem(3) !important;
          height: auto;
        }

        .spot_item_tags + .spot-item {
          margin-top: px-to-rem(3) !important;
        }

        .spot-value.tags {
          overflow-x: hidden;
          padding-right: 0.1rem;
          margin-right: 0;
          flex-wrap: wrap;
          &::-webkit-scrollbar-thumb {
            background-color: rgb(255 238 177 / 40%) !important;

            &:hover {
              background-color: rgb(255 238 177 / 40%) !important;
            }
          }
          .tag_item_wrap {
            padding: px-to-rem(3) 0;
            margin-right: px-to-rem(6);
            height: px-to-rem(30);
          }

          .tag_item {
            position: relative;
            display: block;
            padding: px-to-rem(6);
            background: rgb(255 224 72 / 20%) !important;
            color: #ffeeb1;
          }
        }

        .spot_item_tags.warn {
          .spot-value.tags {
            .tag_item {
              border-radius: px-to-rem(4);
              box-shadow: none;

              &::after,
              &::before {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
