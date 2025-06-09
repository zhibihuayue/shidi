<template>
  <div class="carousel-container">
    <el-carousel
      :autoplay="false"
      arrow="never"
      indicator-position="outside"
      trigger="click"
      :interval="5000"
    >
      <el-carousel-item v-for="(item, index) in list" :key="index">
        <div class="pie-item">
          <div
            v-for="(item2, index2) in item"
            :key="index2"
            class="pie-list-item"
            :style="{ backgroundImage: `url(${item2.bgImage})` }"
          >
            <div class="left">
              <div
                class="block"
                :style="{
                  background: item2.fillColor
                }"
              ></div>
              <span class="pie-text">{{ item2.title || 0 }}</span>
            </div>
            <div v-if="showNum" class="pie-text2">
              {{ item2.valueUnit || '' }}
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    showNum: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.carousel-container {
  width: 100%;
  height: px-to-rem(40);
  ::v-deep .el-carousel {
    height: 100%;
    .el-carousel__container {
      height: 78%;
    }
    .el-carousel__indicators--outside {
      height: px-to-rem(9);
      display: flex; /* 或 inline-flex，取决于布局 */
      justify-content: center; /* 居中指示器 */
      align-items: center;
      margin: 0;
      padding: 0;
      list-style: none; /* 移除默认样式 */
      .el-carousel__indicator--horizontal {
        padding: 0;
        button {
          background-color: #f9ff6c;
          border-radius: px-to-rem(1);
        }
      }
      .el-carousel__indicator--horizontal:nth-of-type(1) {
        margin-right: px-to-rem(6);
      }
    }
  }
  .pie-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: px-to-rem(12);
    height: 100%;
    .pie-list-item {
      display: flex;
      align-items: center;
      font-size: px-to-rem(14);
      font-weight: 350;
      color: #c7fffa;
      background-size: px-to-rem(107) px-to-rem(15);
      background-position: left bottom;
      background-repeat: no-repeat;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .left {
        display: flex;
        align-items: center;
        position: relative;
        left: px-to-rem(1);
        .block {
          width: px-to-rem(10);
          height: px-to-rem(10);
          margin-right: px-to-rem(6);
          box-sizing: border-box;
        }
        .pie-text {
          cursor: pointer;
        }
      }
      .pie-text2 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }
  }
}
</style>
