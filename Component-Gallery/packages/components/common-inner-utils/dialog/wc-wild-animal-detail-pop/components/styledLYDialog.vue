<!--
  这个组件用于替代标准的el-dialog，非模态
  只支持默认slot和部分配置项，用于快速使用。
-->
<template>
  <el-dialog
    ref="dialog"
    :visible="visible"
    destroy-on-close
    :width="width"
    class="styledLYDialog"
    :modal="false"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    :show-close="showClose"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    @open="openFunc"
    @close="closeFun"
  >
    <template v-slot:title>
      <div
        v-if="title"
        :class="[
          'closeAlarmTs',
          highlightTitle && 'highlighttitle',
          leftTitle && 'lefttitle'
        ]"
      >
        <div class="ulline" />
        <div class="urline" />
        <img class="title-liner" src="../assets/card-liner1.png" alt="" />
        <img class="title-bg" src="../assets/cardtitle-bg.png" alt="" />
        <img
          class="title-bottom-bg"
          src="../assets/selected-bottom.png"
          alt=""
        />
        <span class="lytitle">
          <img
            v-if="leftTitle"
            class="title-star"
            src="../assets/cardheader-star.png"
            alt=""
          />
          {{ title }}
        </span>
        <div class="divider" />
      </div>
    </template>
    <img class="blcorner" src="../assets/border-corner-l.svg" alt="" />
    <img class="brcorner" src="../assets/border-corner-r.svg" alt="" />
    <slot />
  </el-dialog>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'StyledLYDialog',
  props: {
    visible: Boolean,
    highlightTitle: Boolean,
    leftTitle: Boolean, // 是否靠左版本的标题
    width: String,
    title: String,
    top: Number,
    appendToBody: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    useResponsive: {
      type: Boolean,
      default: false
    },
    // 作为缩比的基准宽度，默认是1920（指1920X1080的设计稿尺寸）。它是originWidth的比例计算基数。不可为0。
    targetWidth: {
      type: Number,
      default: 1920
    },
    targetHeight: {
      type: Number,
      default: 1080 - 52 // 52是banner在设计稿上的高度，以这个为准
    }
  },
  data() {
    return {
      scaleX: 1,
      scaleY: 1
    }
  },
  watch: {
    visible(v) {
      if (v) {
        // 如果设置了top偏移量，那么就稍微处理一下
        // 注意：因为dialog有50%的transform，所以这个top要加上当前高度的50%
        if (this.top !== undefined) {
          this.$nextTick(() => {
            const $dom = $(this.$refs.dialog.$el).find('.el-dialog')
            $dom.css({ top: this.top + $dom.height() / 2 })
          })
        }
      }
    }
  },
  methods: {
    // 协助派发外部事件
    openFunc() {
      this.$emit('open')
    },
    closeFun() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.styledLYDialog {
  // 林业弹窗有缩比效果，el-dialog原本的动画会观察到画面闪烁，所以禁用el-dialog原本的动画
  &.el-dialog__wrapper.dialog-fade-enter-active,
  &.el-dialog__wrapper.dialog-fade-leave-active {
    animation: none !important;
  }

  .blcorner {
    position: absolute;
    bottom: px-to-rem(-1);
    left: px-to-rem(-1);
  }

  .brcorner {
    position: absolute;
    right: px-to-rem(-1);
    bottom: px-to-rem(-1);
  }

  .el-dialog {
    width: px-to-rem(1100);
    background: linear-gradient(180deg, rgb(0 19 30 / 70%) 0%, #00131e 100%);
    border: px-to-rem(1) solid;
    border-image: linear-gradient(
        360deg,
        rgb(7 91 74 / 75%),
        rgb(7 91 74 / 30%)
      )
      1 1;

    .el-dialog__headerbtn {
      top: px-to-rem(-13);
      right: px-to-rem(-13);
    }

    .el-dialog__headerbtn .el-dialog__close {
      position: relative;
      width: px-to-rem(26);
      height: px-to-rem(26);
      background: url('~../assets/sp-icon_close2x.png');
      background-size: contain;
      color: #c5d9f7;
      font-size: px-to-rem(18);
      cursor: pointer;
    }

    .el-dialog__headerbtn .el-dialog__close::before {
      background: none !important;
      content: ' ';
    }

    .el-dialog__body {
      padding: px-to-rem(12) 0;
      background: transparent !important;
      border-radius: 0 0 px-to-rem(8) px-to-rem(8);
    }
  }

  .el-dialog > .el-dialog__header {
    display: unset;
    padding: 0;
    border: none;
    border-radius: px-to-rem(8) px-to-rem(8) 0 0;
  }

  .closeAlarmTs {
    margin-top: px-to-rem(18);
    height: px-to-rem(16);
    border-radius: px-to-rem(8) px-to-rem(8) 0 0;
    color: #e8f3fe;
    font-size: px-to-rem(16);
    font-weight: 500;
    line-height: px-to-rem(16);

    .lytitle {
      display: flex;
      align-items: center;
      text-shadow: 0 0 px-to-rem(3) rgb(0 245 193 / 70%);
      color: #fff;
      font-size: px-to-rem(16);
      font-family: PingFangSC, 'PingFang SC';
      font-weight: 600;
      line-height: px-to-rem(16);
    }

    &.highlighttitle {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0;
      height: px-to-rem(48);
      background: linear-gradient(
        91deg,
        rgb(2 137 109 / 20%) 0%,
        rgb(2 137 109 / 15%) 23%,
        rgb(2 137 109 / 0%) 100%
      );
      color: #e8f3fe;
      font-size: 16px;
      font-family: 'Alibaba PuHuiTi';
      text-align: left;
      font-weight: 500;

      .ulline {
        position: absolute;
        top: px-to-rem(-1);
        left: px-to-rem(-1);
        width: px-to-rem(8);
        height: px-to-rem(1);
        background-color: rgb(97 255 251 / 100%);
      }

      .urline {
        position: absolute;
        top: px-to-rem(-1);
        right: px-to-rem(-1);
        width: px-to-rem(8);
        height: px-to-rem(1);
        background-color: rgb(97 255 251 / 100%);
      }

      .divider {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: px-to-rem(1);
        background: linear-gradient(
          90deg,
          rgb(255 255 255 / 0%) 0%,
          #fff 50%,
          rgb(255 255 255 / 0%) 100%
        );
      }
    }

    .title-liner {
      position: absolute;
      top: px-to-rem(-6);
      left: calc(50% - px-to-rem(18));
      width: px-to-rem(36);
      height: px-to-rem(14);
      pointer-events: none;
    }

    .title-bg {
      position: absolute;
      top: 0;
      left: calc(50% - px-to-rem(66));
      width: px-to-rem(242);
      height: px-to-rem(48);
      pointer-events: none;
    }

    .title-bottom-bg {
      position: absolute;
      bottom: 0;
      left: calc(50% - px-to-rem(50));
      pointer-events: none;
    }

    &.lefttitle {
      justify-content: left;
      padding-left: px-to-rem(14);

      .divider {
        left: px-to-rem(40);
        width: px-to-rem(168);
      }

      .title-liner {
        top: px-to-rem(-6);
        left: px-to-rem(40);
      }

      .title-bg {
        top: 0;
        left: 0;
      }

      .title-bottom-bg {
        bottom: 0;
        left: 0;
      }

      .title-star {
        margin-right: px-to-rem(6);
        width: px-to-rem(8);
        height: px-to-rem(8);
      }
    }
  }

  &.el-dialog__wrapper {
    pointer-events: none;

    // 弹窗层元素不可穿透点击事件（不影响弹窗层元素的点击事件）
    .el-dialog {
      pointer-events: auto;
      user-select: none;
    }
  }

  // 用于表单样式覆盖

  .el-dialog__body .el-form-item__label {
    float: left;
    padding: 0 px-to-rem(12) 0 0;
    color: #fff;
    font-size: px-to-rem(14);
    text-align: right;
    font-weight: 400;
    vertical-align: middle;
    line-height: px-to-rem(32);
    box-sizing: border-box;
  }

  // 如果下拉菜单插入在表单body内(popper-append-to-body=false)，它会变成fixed导致缩放时异常，在这里使用absolute强行处理
  .el-dialog__body .el-select-dropdown {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
  }
}
</style>
