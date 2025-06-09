// 框的公共样式
<template>
  <div class="basisBox boxClass_">
    <div class="boxClassTop">
      <div class="line_content"></div>
      <div class="line_border"></div>
      <div class="leftDiv">
        <img src="@/assets/image/common/imgIcon5.png" alt="" />
        <p class="name">{{ name }}</p>
      </div>
      <slot name="header"></slot>
      <i class="expandBtn iconfont_tools icon-linye_icon_biaotizhankai_you arrow" :class="[arrowShow?'zhankaiArrow':'shouqiArrow']" @click="arrowShowFun"></i>
    </div>
    <div :class="arrowShow?'boxClassBottom':'isHandShow'">
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
  props: {
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      arrowShow: true,
    };
  },
  methods: {
    //切换箭头
    arrowShowFun() {
      this.arrowShow = !this.arrowShow;
      this.$emit("isHandShow",this.arrowShow)
    },
  },
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/px-to-rem";
.basisBox {
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.boxClass_ {
  // background:linear-gradient(180deg, rgba(0, 19, 30, 0.7) 0%, #00131e 100%);
  background:linear-gradient(180deg, rgba(0, 19, 30, .7), #00131e);
  background-size: 100% 100%;
  border: 1px solid;
  border-image: linear-gradient(
      360deg,
      rgba(7, 91, 74, 0.75),
      rgba(7, 91, 74, 0.3)
    )
    1 1;
  border-bottom:none;
  border-top:none;
  position: relative;
  .before {
    height: px-to-rem(25);
    width: px-to-rem(21);
    bottom: px-to-rem(-1);
    position: absolute;
    z-index: 90;
    right: px-to-rem(-1.5);
    background: url("~@/assets/image/common/imgIcon7.png") no-repeat;
    background-size: 100% 100%;
  }
  .after {
    height: px-to-rem(25);
    width: px-to-rem(21);
    bottom: px-to-rem(-1);
    left: px-to-rem(-1.5);
    z-index: 90;
    position: absolute;
    background: url("~@/assets/image/common/imgIcon6.png") no-repeat;
    background-size: 100% 100%;
  }
  .line_before{
    top:px-to-rem(0);
    left:px-to-rem(-1)
  }
  .line_before,.line_after{
    height:px-to-rem(1);
    width:px-to-rem(10);
    background: #00fff8;
    position: absolute;
  }
  .line_after{
    right:px-to-rem(-1);
    top:px-to-rem(0)
  }
  .line_content{
    position: absolute;
    top:px-to-rem(0);
    left: px-to-rem(40);
    width: px-to-rem(35);
    height: px-to-rem(6);
    background: url("~@/assets/image/common/imgIcon16.png") no-repeat;
    background-size:100% 100%;

  }
  
  .boxClassTop {
    display: flex;
    align-items: center;
    padding-right: px-to-rem(13);
    background:linear-gradient(91deg, rgba(2, 137, 109, .2), rgba(2, 137, 109, .15) 23%, rgba(2, 137, 109, 0));
    box-sizing: border-box;
    position: relative;
    .leftDiv {
      display: flex;
      padding-left: px-to-rem(13);
      flex: 1;
      height:px-to-rem(48);
      overflow: auto;
      background: url("~@/assets/image/common/imgIcon15.png") no-repeat;
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
    }
    .line_border{
      position: absolute;
      bottom: px-to-rem(-1);
      left: 0;
      width: px-to-rem(168);
      height: px-to-rem(10);
      background: url("~@/assets/image/common/imgIcon17.png") no-repeat;
      background-size: 100% 100%;
      align-items: center;
    }
    .arrow {
      // width: px-to-rem(11);
      // height: px-to-rem(11);
      font-size: px-to-rem(20);
      color:#fff;
      cursor: pointer;
    }
    .zhankaiArrow{
      transform: rotate(-90deg);
    }
    .shouqiArrow{
      transform: rotate(90deg);
    }
  }
  .boxClassBottom {
    flex: 1;
    overflow: hidden;
  }
  .isHandShow{
    height:0 ;
    overflow: hidden;
  }
}
</style>