<template>
  <div class="base-nodata__namespace">
    <div class="base-nodata">
      <div class="icon"></div>
      <div class="text">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseNodata'
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

[data-theme='theme-wiseblue'] .base-nodata__namespace {
  --text-color: #e8f3fe;
  --text-color-70: rgba(232, 243, 254, 0.7);
}

[data-theme='theme-aquamarine'] .base-nodata__namespace {
  --text-color: #ffffff;
  --text-color-70: rgba(255, 255, 255, 0.7);
}

[data-theme='theme-terracotta'] .base-nodata__namespace {
  --text-color: #e4e7c1;
  --text-color-70: rgba(228, 231, 193, 0.7);
}

.base-nodata__namespace {
  height: 100%;
  @include themeify(false) {
    > .base-nodata {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > .icon {
        @if $theme-name == 'theme-wiseblue' {
          background: url('~@component-gallery/assets/image/base-nodata/bg-w.png')
            no-repeat;
        }
        @if $theme-name == 'theme-aquamarine' {
          background: url('~@component-gallery/assets/image/base-nodata/bg-a.png')
            no-repeat;
        }
        @if $theme-name == 'theme-terracotta' {
          background: url('~@component-gallery/assets/image/base-nodata/bg-t.png')
            no-repeat;
        }

        display: block;
        margin-bottom: 0.06rem;
        width: px-to-rem(68);
        height: px-to-rem(65);
        background-size: 100% 100% !important;
      }

      > .text {
        font-size: px-to-rem(14);
        color: var(--text-color);
      }
    }
  }
}
</style>
