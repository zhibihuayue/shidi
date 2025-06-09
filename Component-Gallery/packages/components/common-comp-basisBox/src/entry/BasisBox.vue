// 框的公共样式
<template>
  <div class="basisBox boxClass_">
    <div class="boxClassTop">
      <div class="line_content"></div>
      <div class="line_border" v-if="name"></div>
      <div class="line_border center-line" v-if="centerName"></div>

      <div class="leftDiv" v-if="name">
        <img
          src="@component-gallery/basisBox/assets/image/imgIcon5.png"
          alt=""
        />
        <p class="name">{{ name }}</p>
      </div>

      <div class="leftDiv center-dev" v-if="centerName">
        <div class="bg-center"></div>
        <p class="name">{{ centerName }}</p>
      </div>
      <slot name="header"></slot>
      <em
        v-if="isShowIcon"
        class="expandBtn iconfont_tools icon-linye_icon_biaotizhankai_you arrow"
        :class="[arrowShow ? 'zhankaiArrow' : 'shouqiArrow']"
        @click="arrowShowFun"
      ></em>
      <div class="expandBtn arrow right-section-name" v-if="showRightSlot">
        <slot name="rightSlot"></slot>
      </div>
    </div>
    <div :class="arrowShow ? 'boxClassBottom' : 'isHandShow'">
      <slot></slot>
    </div>
    <!-- 下角样式 -->
    <div class="before"></div>
    <div class="after"></div>
    <!-- 上角样式 -->
    <div class="line_before"></div>
    <div class="line_after"></div>
  </div>
</template>

<script>
export default {
  name: 'BasisBox',
  props: {
    name: {
      type: String,
      default: ''
    },
    centerName: {
      type: String,
      default: ''
    },
    isShowIcon: {
      type: Boolean,
      default: true
    },
    showRightSlot: {
      type: Boolean,
      default: false
    },
    isHandShowKey: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      arrowShow: true,
      staticList: [
        {
          fieldName: 'a',
          bgClass: 'bg-1',
          label: '音频',
          value: 0
        },
        {
          fieldName: 'b',
          bgClass: 'bg-2',
          label: '图片',
          value: 0
        },
        {
          fieldName: 'c',
          bgClass: 'bg-3',
          label: '视频',
          value: 0
        },
        {
          fieldName: 'e',
          bgClass: 'bg-4',
          label: '鸟类数量',
          value: 0
        }
      ]
    }
  },
  mounted() {
    if (this.isHandShowKey) {
      let isHandShow = localStorage.getItem(this.isHandShowKey)
      if (isHandShow) {
        this.arrowShow = JSON.parse(isHandShow)
      }
    }
  },
  methods: {
    //切换箭头
    arrowShowFun() {
      this.arrowShow = !this.arrowShow
      if (this.isHandShowKey) {
        localStorage.setItem(this.isHandShowKey, this.arrowShow)
      }
      this.$emit('isHandShow', this.arrowShow)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/assets/font/iconfont.css';
.basisBox {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.boxClass_ {
  background: linear-gradient(180deg, rgba(0, 19, 30, 0.7), #00131e);
  background-size: 100% 100%;
  border: 1px solid;
  border-image: linear-gradient(
      360deg,
      rgba(7, 91, 74, 0.75),
      rgba(7, 91, 74, 0.3)
    )
    1 1;
  border-bottom: none;
  border-top: none;
  position: relative;
  .before {
    height: px-to-rem(25);
    width: px-to-rem(21);
    bottom: px-to-rem(-1);
    position: absolute;
    z-index: 90;
    right: px-to-rem(-1.5);
    background: url('~@component-gallery/basisBox/assets/image/imgIcon7.png')
      no-repeat;
    background-size: 100% 100%;
  }
  .after {
    height: px-to-rem(25);
    width: px-to-rem(21);
    bottom: px-to-rem(-1);
    left: px-to-rem(-1.5);
    z-index: 90;
    position: absolute;
    background: url('~@component-gallery/basisBox/assets/image/imgIcon6.png')
      no-repeat;
    background-size: 100% 100%;
  }
  .line_before {
    top: px-to-rem(0);
    left: px-to-rem(-1);
  }
  .line_before,
  .line_after {
    height: px-to-rem(1);
    width: px-to-rem(10);
    background: #00fff8;
    position: absolute;
  }
  .line_after {
    right: px-to-rem(-1);
    top: px-to-rem(0);
  }
  .line_content {
    position: absolute;
    top: px-to-rem(0);
    left: px-to-rem(40);
    width: px-to-rem(35);
    height: px-to-rem(6);
    background: url('~@component-gallery/basisBox/assets/image/imgIcon16.png')
      no-repeat;
    background-size: 100% 100%;
  }

  .boxClassTop {
    display: flex;
    align-items: center;
    padding-right: px-to-rem(13);
    background: linear-gradient(
      91deg,
      rgba(2, 137, 109, 0.2),
      rgba(2, 137, 109, 0.15) 23%,
      rgba(2, 137, 109, 0)
    );
    box-sizing: border-box;
    position: relative;
    .leftDiv {
      display: flex;
      padding-left: px-to-rem(13);
      flex: 1;
      height: px-to-rem(48);
      overflow: auto;
      background: url('~@component-gallery/basisBox/assets/image/imgIcon15.png')
        no-repeat;
      background-size: 100% 100%;
      position: relative;
      align-items: center;
      .name {
        font-weight: 600;
        margin-left: px-to-rem(4);
        font-size: px-to-rem(16);
        text-shadow: 0px 0px px-to-rem(18) rgba(0, 245, 193, 0.9);
        color: #ffffff;
      }

      &.center-dev {
        justify-content: center;
        background-image: none;
        overflow: hidden;
        .bg-center {
          width: 100%;
          height: 100%;
          background: url('~@component-gallery/basisBox/assets/image/imgIcon15.png')
            no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-20%);
        }
      }
    }

    .line_border {
      position: absolute;
      bottom: px-to-rem(-1);
      left: 0;
      width: px-to-rem(168);
      height: px-to-rem(10);
      background: url('~@component-gallery/basisBox/assets/image/imgIcon17.png')
        no-repeat;
      background-size: 100% 100%;
      align-items: center;
      &.center-line {
        background-image: url('~@component-gallery/basisBox/assets/image/middle-line.png');
        width: 100%;
        left: 0;
      }
    }
    .arrow {
      // width: px-to-rem(11);
      // height: px-to-rem(11);
      font-size: px-to-rem(20);
      color: #fff;
      cursor: pointer;
    }

    .right-section-name {
      display: unset !important;
    }
    .zhankaiArrow {
      transform: rotate(-90deg);
    }
    .shouqiArrow {
      transform: rotate(90deg);
    }
  }
  .boxClassBottom {
    flex: 1;
    overflow: hidden;
  }
  .isHandShow {
    height: 0;
    overflow: hidden;
  }
}
</style>
