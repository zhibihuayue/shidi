<template>
  <div id="pop-header" class="r-head">
    <div class="r-h-tit">
      <slot></slot>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pop-header'
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

#pop-header {
  .r-h-tit {
    flex: 1;
  }
}

[data-theme='theme-wiseblue'] #pop-header {
  &.r-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: px-to-rem(370);
    height: px-to-rem(48);
    background: url('./assets/header_bg.png') no-repeat;
    background-size: 100% 100%;

    .r-h-tit {
      display: flex;
      align-items: center;
      padding-left: px-to-rem(42);
      height: px-to-rem(34);
      text-shadow: 0 1px px-to-rem(4) #4e85d1;
      color: #fff;
      font-size: px-to-rem(16);
      font-weight: 600;
    }
  }
}

[data-theme='theme-aquamarine'] #pop-header {
  &.r-head {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: px-to-rem(370);
    height: px-to-rem(48);
    background: url('./assets/title_bg.png') no-repeat;
    background-size: px-to-rem(370) 100%;
    background-position: px-to-rem(6) 0;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        91deg,
        rgba(2, 137, 109, 0.2),
        rgba(2, 137, 109, 0.15) 23%,
        rgba(2, 137, 109, 0)
      );
      content: '';
    }

    .r-h-tit {
      position: relative;
      display: flex;
      align-items: center;
      padding-left: px-to-rem(26);
      height: 100%;
      text-shadow: 0 0 px-to-rem(18) rgb(0 245 193 / 90%);
      color: #fff;
      font-size: px-to-rem(16);
      font-weight: 600;

      &::before {
        position: absolute;
        top: calc(50% - px-to-rem(4));
        left: px-to-rem(12);
        display: block;
        width: px-to-rem(8);
        height: px-to-rem(8);
        background: url('./assets/title_point.png');
        background-size: 100% 100%;
        content: '';
      }

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: px-to-rem(168);
        height: px-to-rem(10);
        background: url('./assets/title_tips.png');
        background-size: 100% 100%;
        content: '';
      }
    }
  }
}

[data-theme='theme-terracotta'] #pop-header {
  &.r-head {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: px-to-rem(48);
    background: url('./assets/bg.png') no-repeat;
    background-position: px-to-rem(7) px-to-rem(25);
    background-size: 100% px-to-rem(16);

    .r-h-tit {
      position: relative;
      display: flex;
      padding-top: px-to-rem(12);
      padding-left: px-to-rem(24);
      height: 100%;

      text-shadow: 0 px-to-rem(1) px-to-rem(4) #dcd277;
      color: #fff;
      font-size: px-to-rem(16);
      font-weight: 500;
      line-height: px-to-rem(16);
    }
  }
  .region-switch-btns-container {
    margin-top: px-to-rem(-3);
  }
}
</style>
