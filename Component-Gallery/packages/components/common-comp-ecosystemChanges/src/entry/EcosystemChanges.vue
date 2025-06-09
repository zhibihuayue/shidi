//生态系统变化
<template>
  <div class="ecosystemChanges">
    <basis-box :name="componentName" isHandShowKey="EcosystemChanges">
      <div class="mainContent" :style="{ height: pxToRem(commonentHeight) }">
        <div class="popPicker">
          <date-range
            :dateRangeProp="defaultTime"
            :circleClose="false"
            @dateRangeFunc="changeTime"
            ref="dateRange"
            :haveDataTime="haveDataTime"
          />
        </div>
        <div class="contentBottom" v-if="contentBottomShow">
          <exponent-view
            :haveDataTimeClone="haveDataTime"
            :timeListClone="timeList"
          />
          <div class="changeDiv">
            <change-view
              :haveDataTimeClone="haveDataTime"
              :timeListClone="timeList"
            />
          </div>
          <div class="line"></div>
          <div class="matrixDiv">
            <matrix-view
              :haveDataTimeClone="haveDataTime"
              :timeListClone="timeList"
            />
          </div>
        </div>
      </div>
    </basis-box>
  </div>
</template>

<script>
import BasisBox from '@component-gallery/basisBox'
import dateRange from '../module/dateRange.vue'
import exponentView from '../module/exponentView.vue'
import changeView from '../module/changeView.vue'
import matrixView from '../module/matrixView.vue'
import { statisticsDefaultTime } from '@component-gallery/ecosystemChanges/src/service/index.js'
import { pxToRemMixin } from '../../../../../playground/src/pxToRem.js'
export default {
  name: 'EcosystemChanges',
  mixins: [pxToRemMixin],
  props: {
    componentName: {
      type: String,
      default: '生态系统变化'
    },
    commonentHeight: {
      type: Number,
      default: 900
    }
  },
  components: {
    BasisBox,
    dateRange,
    exponentView,
    changeView,
    matrixView
  },
  data() {
    return {
      defaultTime: [],
      haveDataTime: [],
      timeList: [],
      contentBottomShow: false
    }
  },
  mounted() {
    this.getDefaultTime()
  },
  methods: {
    // 改变时间
    changeTime(val) {
      if (val) {
        this.timeList = val.map((item) => {
          return item.replace('年', '')
        })
        sessionStorage.setItem('date_changeTime', JSON.stringify(this.timeList))
      }
    },

    // 获取默认时间
    async getDefaultTime() {
      try {
        const res = await statisticsDefaultTime()
        if (res.code === 200) {
          this.haveDataTime = res.data || []
        }
      } catch (error) {
        console.log(error)
      }
      const times = JSON.parse(sessionStorage.getItem('date_changeTime'))
      if (times) {
        this.defaultTime = times
        this.timeList = times
      } else {
        this.defaultTime = this.haveDataTime
        this.timeList = this.haveDataTime
      }
      this.contentBottomShow = true
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.ecosystemChanges {
  width: 100%;
  .mainContent {
    box-sizing: border-box;
    padding: px-to-rem(12) px-to-rem(12) px-to-rem(6);
    display: flex;
    flex-direction: column;
    .popPicker {
      padding-bottom: px-to-rem(12);
    }
    .contentBottom {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .changeDiv {
        width: 100%;
        margin-top: px-to-rem(12);
      }
      .line {
        width: 100%;
        margin: px-to-rem(10) 0;
        opacity: 0.7;
        height: px-to-rem(1);
        background: linear-gradient(
          90deg,
          rgba(0, 176, 140, 0.1) 0%,
          #00b08c 50%,
          rgba(0, 176, 140, 0.1) 100%
        );
      }
      .matrixDiv {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
