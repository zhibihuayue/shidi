<!-- 详情弹窗 -->
<template>
  <div class="detailsPopup">
    <basis-box :name="titleName">
      <div class="selfArea">
        <img
          src="@component-gallery/birdHabitatAnalysis/assets/image/close1.png"
          alt=""
          class="close"
          @click="closeDetail"
        />
      </div>
      <div class="mainContent">
        <div v-for="item in listData" :key="item.id" class="list">
          <p class="name">{{ item.name }}</p>
          <p class="num">{{ item.value }}</p>
        </div>
      </div>
    </basis-box>
  </div>
</template>
<script>
import BasisBox from '@component-gallery/basisBox'
export default {
  components: {
    BasisBox
  },
  props: {
    detailData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      titleName: window.detailPopupObj.titleName,
      detailPopupObj: window.detailPopupObj.props,
      detailShow: true,
      listData: [
        { name: '图斑编号：', value: 0, id: 0, type: 'tbbh' },
        { name: '图斑面积：', value: 0, id: 1, type: 'area' },
        { name: '适应性评估类型：', value: 0, id: 2, type: 'type' },
        { name: '年份：', value: 0, id: 3, type: 'year' }
      ],
      typeList: new Map([
        [1, '适宜生境'],
        [2, '较适宜生境'],
        [3, '不适宜生境']
      ])
    }
  },
  mounted() {
    this.handleData()
  },
  methods: {
    // 处理数据
    handleData() {
      this.listData.forEach((item) => {
        if (item.type == 'area') {
          item.value = this.detailPopupObj[item.type] * 15 + '亩'
        } else if (item.type == 'type') {
          item.value = this.typeList.get(this.detailPopupObj[item.type])
        } else if (item.type == 'year') {
          item.value = this.detailPopupObj[item.type] + '年'
        } else {
          item.value = this.detailPopupObj[item.type]
        }
      })
    },

    // 关闭
    closeDetail() {
      this.$globalEventBus.$emit(
        'commonCompBirdHabitatAnalysis_detailsPopupShowChange',
        false
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.detailsPopup {
  width: px-to-rem(370);
  .selfArea {
    .close {
      position: absolute;
      width: px-to-rem(38);
      height: px-to-rem(38);
      right: px-to-rem(-20);
      top: px-to-rem(-20);
      transform: scale(0.7);
      cursor: pointer;
      z-index: 1;
    }
  }
  .mainContent {
    padding: 0 px-to-rem(10);
    height: px-to-rem(152);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .list {
      display: flex;
      align-items: center;
      p {
        font-size: px-to-rem(14);
        font-family: 'Source Han Sans';
        color: #fff;
      }
      .name {
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
        width: px-to-rem(120);
      }
    }
  }
  ::v-deep .boxClassTop .arrow {
    display: none;
  }
}
</style>
