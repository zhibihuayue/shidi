<!-- 详情弹窗 -->
<template>
  <div class="detailsPopup">
    <basis-box :name="insectPestMemory.deviceName">
      <div class="selfArea">
        <img
          src="@component-gallery/diseasesPests/assets/image/close1.png"
          alt=""
          class="close"
          @click="closeDetail"
        />
      </div>
      <div class="mainContent">
        <div class="main">
          <div v-for="item in listData" :key="item.id" class="list">
            <p class="name">{{ item.name }}</p>
            <p class="num">{{ item.value }}</p>
          </div>
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
  data() {
    return {
      listData: [
        { name: '设备名称：', value: '', id: 0, type: 'deviceName' },
        { name: '设备编号：', value: '', id: 1, type: 'deviceNumber' },
        { name: '监测面积：', value: '', id: 2, type: 'monitoringArea' },
        { name: '食物丰富度：', value: '', id: 3, type: 'food' },
        { name: '天敌情况：', value: '', id: 4, type: 'naturaEnemy' },
        { name: '预测日期：', value: '', id: 5, type: 'date' },
        { name: '预测密度：', value: '', id: 6, type: 'density' },
        { name: '风险等级：', value: '', id: 7, type: 'grade' },
        { name: '防治建议：', value: '', id: 8, type: 'suggestion' },
        { name: '推荐药物：', value: '', id: 9, type: 'drug' }
      ],
      insectPestMemory: {
        deviceName: ''
      }
    }
  },
  mounted() {
    this.init()
    this.$globalEventBus.$on('commonCompDiseasesPests_changeDetail', () => {
      this.init()
    })
  },
  methods: {
    // 初始化
    init() {
      let insectPest = localStorage.getItem('insectPestMemory')
      let detailData = localStorage.getItem('InsectPestDetailData')
      if (insectPest) {
        this.insectPestMemory = JSON.parse(insectPest)
      }
      if (detailData) {
        this.watchDataFun(JSON.parse(detailData))
      }
    },

    // 监听值变化处理逻辑
    watchDataFun(val) {
      this.listData.forEach((item) => {
        item.value = val[item.type] || ''
      })
    },

    // 关闭
    closeDetail() {
      this.$globalEventBus.$emit('commonCompDiseasesPests_detailPopShow', false)
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
    padding: px-to-rem(12) px-to-rem(10);
    height: px-to-rem(280);
    .main {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: scroll;
      .list {
        display: flex;
        p {
          font-size: px-to-rem(14);
          font-family: 'Source Han Sans';
          color: #fff;
        }
        .name {
          color: rgba(255, 255, 255, 0.7);
          text-align: right;
          white-space: nowrap;
          width: px-to-rem(87);
          flex-shrink: 0;
        }
        .num {
          flex-wrap: wrap;
          flex: 1;
          overflow: hidden;
        }
        &:not(:nth-child(1)) {
          margin-top: px-to-rem(7.93);
        }
      }
    }
  }
  ::v-deep .boxClassTop .arrow {
    display: none;
  }
}
</style>
