<template>
  <div class="legend">
    <div v-for="item in list" :key="item.id" class="list">
      <p :style="{ background: item.color }" class="lab"></p>
      <p class="name">{{ item.label }}</p>
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
  data() {
    return {
      list: [
        { label: '适宜', color: '#0DC985', id: 0 },
        { label: '较适宜', color: '#F9FF6C', id: 1 },
        { label: '不适宜', color: '#ED5158', id: 2 },
        { label: '暂无数据', color: '#fff', id: 3 }
      ]
    }
  },
  mounted() {
    if (window.legendList) {
      this.list = []
      window.legendList.forEach((item, index) => {
        this.list.push({
          label: item.filterAttrValue,
          color: item.fillColor,
          id: index
        })
      })
      this.list.push({
        label: '暂无数据',
        color: '#fff',
        id: 10
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.legend {
  width: px-to-rem(124);
  height: px-to-rem(108);
  font-size: px-to-rem(12);
  background: linear-gradient(180deg, rgba(0, 19, 30, 0.7) 0%, #00131e 100%);
  border: 1px solid;
  border-image: linear-gradient(
      180deg,
      rgba(7.000000057742, 91.00000217556953, 74.0000031888485, 0.75),
      rgba(
        7.000000057742,
        91.00000217556953,
        74.0000031888485,
        0.30000001192092896
      )
    )
    1 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;
  .list {
    display: flex;
    align-items: center;
    .lab {
      width: px-to-rem(12);
      height: px-to-rem(12);
      margin: 0 px-to-rem(12);
    }
    .name {
      color: #9e9e9e;
      font-size: px-to-rem(12);
    }
  }
  .before {
    height: px-to-rem(25);
    width: px-to-rem(21);
    bottom: px-to-rem(-1);
    position: absolute;
    z-index: 90;
    right: px-to-rem(-1.5);
    background: url('~@component-gallery/birdHabitatAnalysis/assets/image/icon7.png')
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
    background: url('~@component-gallery/birdHabitatAnalysis/assets/image/icon6.png')
      no-repeat;
    background-size: 100% 100%;
  }
  .line_before {
    top: px-to-rem(-1.5);
    left: px-to-rem(0);
  }
  .line_after {
    right: px-to-rem(0);
    top: px-to-rem(-1.5);
  }
  .line_before,
  .line_after {
    height: px-to-rem(1);
    width: px-to-rem(10);
    background: #00fff8;
    position: absolute;
  }
}
</style>
