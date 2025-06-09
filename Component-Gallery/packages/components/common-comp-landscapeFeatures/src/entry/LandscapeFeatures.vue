// 景观格局特征
<template>
  <div class="landscapePatternCharacteristics">
    <basis-box :name="componentName" isHandShowKey="LandscapeFeatures">
      <div class="mainContent" :style="{ height: pxToRem(commonentHeight) }">
        <div class="popPicker">
          <year-month-day-time
            :selectShow="false"
            :circleClose="false"
            timeType="year"
            moduleType="features"
            :dateRangeProp="defaultTime"
            @changeTime="changeTime"
            :haveDataTime="haveDataTime"
            :key="timekey"
          />
        </div>
        <div class="tableArea">
          <table-index :tableData="tableData" :tableHeadList="tableHeadList" />
        </div>
      </div>
    </basis-box>
  </div>
</template>

<script>
import basisBox from '@component-gallery/basisBox'
import tableIndex from '../module/tableIndex.vue'
import { statisticsDefaultTime, statisticsFeature } from '../service/index.js'
import yearMonthDayTime from '../module/yearMonthDayTime.vue'
import { iframeSDK } from '@ct/iframe-connect-sdk'
import { formattedValue } from '../utils/index'
import { pxToRemMixin } from '../../../../../playground/src/pxToRem.js'
export default {
  name: 'LandscapeFeatures',
  mixins: [pxToRemMixin],
  props: {
    componentName: {
      type: String,
      default: '景观格局特征'
    },
    commonentHeight: {
      type: Number,
      default: 280
    }
  },
  components: {
    basisBox,
    tableIndex,
    yearMonthDayTime
  },
  data() {
    return {
      tableData: [],
      tableHeadList: [
        { label: '生态系统格局', prop: 'name', align: 'left', width: 105 },
        { label: '斑块数(个)', prop: 'plaqueCount', align: 'left', width: 85 },
        { label: '总面积(公顷)', prop: 'allArea', align: 'left', width: 100 },
        {
          label: '平均斑块面积(公顷)',
          prop: 'avgArea',
          align: 'left',
          width: 140
        }
      ],
      nameMap: new Map([
        [1, '河流湿地'],
        [2, '湖泊湿地'],
        [3, '沼泽湿地'],
        [4, '农业用地'],
        [5, '养殖场类'],
        [6, '城市用地'],
        [7, '景观用地']
      ]),
      defaultTime: null,
      timeList: null,
      timekey: new Date().getTime(),
      haveDataTime: [] //有数据的年份区间
    }
  },
  mounted() {
    this.defaultTimeFun()
  },
  methods: {
    // 默认时间
    async defaultTimeFun() {
      const times = JSON.parse(sessionStorage.getItem('date_featuresTime'))
      const res = await statisticsDefaultTime()
      if (res.code === 200) {
        this.haveDataTime = res.data || []
      } else {
        await iframeSDK({
          iframeOperationId: 'message',
          message: '获取时间数据失败!'
        })
      }
      if (!times || times === 'null') {
        this.getDefaultTime(res)
      } else {
        this.defaultTime = times
        this.timeList = this.defaultTime
        this.getStatisticsFeature()
      }
    },
    getDefaultTime(res) {
      if (res.code === 200) {
        const resData = res.data
        if (resData && resData.length === 2) {
          this.defaultTime = resData[1]
        }
        if (resData && resData.length === 1) {
          this.defaultTime = resData[0]
        }
        this.timeList = this.defaultTime
        sessionStorage.setItem(
          'date_featuresTime',
          JSON.stringify(this.defaultTime)
        )
        this.getStatisticsFeature()
      } else {
        this.defaultTime = ''
      }
    },

    // 改变时间
    changeTime(val) {
      this.timeList = val
      sessionStorage.setItem('date_featuresTime', JSON.stringify(this.timeList))
      this.getStatisticsFeature()
    },

    // 获取数据
    async getStatisticsFeature() {
      if (!this.timeList) {
        return
      }
      const params = {
        coverageType: 1,
        startTime: this.timeList,
        endTime: this.timeList
      }
      const res = await statisticsFeature(params)
      if (res.code == 200) {
        this.handleData(res.data)
      } else {
        await iframeSDK({
          iframeOperationId: 'message',
          message: '获取数据失败!'
        })
      }
    },

    // 数据处理
    handleData(data) {
      this.tableData = data || []
      this.tableData.forEach((item) => {
        item.name = this.nameMap.get(item.type)
        item.allArea = formattedValue(item.allArea)
        item.avgArea = formattedValue(item.avgArea)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.landscapePatternCharacteristics {
  width: 100%;
  margin-top: px-to-rem(10);
  .mainContent {
    // height: px-to-rem(280);
    padding: 0 px-to-rem(12);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .popPicker {
      padding: px-to-rem(12) 0;
      box-sizing: border-box;
    }
    .tableArea {
      flex: 1;
      margin-bottom: px-to-rem(5);
      overflow: hidden;
    }
  }
}
</style>
