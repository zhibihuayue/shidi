// 湿地卡口
<template>
  <div class="climatic">
    <basis-box  name="气候统计分析">
      <div class="staticMain">
        <!-- 顶部月年数据 -->
        <div class="topStatic">
          <ul class="topMain">
            <li v-for="item in analyseList" :key="item.type" class="mainList">
              <div class="name" :class="item.bgIcon" />
              <div class="text-wrap">
                <div class="title">{{ item.name }}</div>
                <div class="num">{{ item.value }}<span>{{ item.unit }}</span></div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 中部时间筛选 -->
        <div class="middleTime">
          <yearMonthDayTime :selectShow="true" :timeType="selectType" :dateRangeProp="defaultTime" :circleClose="false" @changeTime="changeTime" @changeSelect="changeSelect" />
        </div>
        <!-- 底部echarts图 -->
        <div class="echatBox">
          <div class="legend-wrap">
            <div class="img-icon">
              <img src="@/assets/image/environment/rain.svg" alt="降雨">
              <span>降水量</span>
            </div>
            <div class="img-icon">
              <img src="@/assets/image/environment/temperature.svg" alt="温度" class="temperature-icon">
              <span>温度</span>
            </div>
          </div>
          <div class="nameText">
            <span>降水量：(mm)</span>
            <span>温度：(℃)</span>
          </div>
          <div ref="histogramMap" class="echartMain" />
        </div>
      </div>
    </basis-box>
  </div>
</template>

<script>
import basisBox from '@/views/module/basisBox.vue'
import dateRangeBox from '@/common/page/dateRange.vue'
import { doubleFoline3D } from '@/echarts'
import { climaticAnalyst } from '@/http/environment.js'
import { iframeSDK } from '@ct/iframe-connect-sdk'
import yearMonthDayTime from '@/common/page/yearMonthDayTime.vue'
import moment from 'moment'

export default {
  name: 'Climatic',
  components: {
    basisBox,
    dateRangeBox,
    yearMonthDayTime
  },
  data() {
    return {
      timer: 0,
      myChart: null,
      datePickType: 'month',
      queryData: {
        timeType: 1, // 0-月 1-年 2-日/自定义
        startTime: null,
        endTime: null
        // year: null,
        // month: null
      },
      analyseList: [
        {
          type: 'month',
          name: '当月平均气温',
          value: 0,
          unit: '℃',
          bgIcon: 'nameMouth',
          keyType: 'temperatureMonth'
        },
        {
          type: 'year',
          name: '当月平均降水',
          value: 0,
          unit: 'mm',
          bgIcon: 'nameYear',
          keyType: 'precipitationMonth'
        }
      ],
      defaultTime: new Date().getFullYear().toString(), // 默认为当年
      timeList: null,
      // 降水量-柱状图
      precipitationList: [],
      // 气温-柱状图
      temperatureList: [],
      // 日期
      timesList: [],
      // 选择的类型
      selectType: JSON.parse(sessionStorage.getItem('date_climaticTimeType')) || 'year', // 年月日自定义
      getTimeMap: new Map([
        ['day', moment().format('YYYY-MM-DD')],
        ['month', moment().format('YYYY-MM')],
        ['year', moment().format('YYYY')]
      ])
    }
  },
  mounted() {
    // 判断是否有时间记忆，取时间的类型和时间
    this.initTime()
    this.getClimaticAnalyst()
  },
  beforeDestroy() {
    // 组件销毁前回收图表
    if (this.myChart) {
      this.myChart.dispose()
      this.myChart = null
    }
  },
  methods: {
    // 初始化时间
    initTime() {
      this.selectType = JSON.parse(sessionStorage.getItem('date_climaticTimeType'))
      // 有表示为有时间记忆，无---默认为年
      if (this.selectType) {
        const currentHistoryTime = this.capitalizeFirstLetter(this.selectType)
        this.defaultTime = JSON.parse(sessionStorage.getItem(currentHistoryTime))
      } else {
        this.selectType = 'year'
        sessionStorage.setItem('date_climaticTimeType', JSON.stringify(this.selectType))
        sessionStorage.setItem('date_climaticHistoryTimeYear', JSON.stringify(this.defaultTime))
      }
      this.processTime(this.selectType)
      this.queryData.timeType = this.getTimeType(this.selectType)
    },

    getNowDate() {
      // 获取当前时间
      const now = new Date()
      const currentYear = now.getFullYear() // 年份
      const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0') // 当前月份，格式化为两位数

      // 计算6个月之前的时间的年份和月份
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5)
      const yearSixMonthsAgo = sixMonthsAgo.getFullYear()
      const monthSixMonthsAgo = (sixMonthsAgo.getMonth() + 1)
        .toString()
        .padStart(2, '0') // 6个月前的月份，格式化为两位数

      // 计算5年前的年份
      const fiveYearsAgoYear = currentYear - 4

      let timeType, startTime, endTime

      if (this.datePickType === 'year') {
        timeType = 1
        endTime = currentYear // 假设这里需要的是年份字符串
        startTime = fiveYearsAgoYear // 假设这里也需要年份字符串
      } else {
        timeType = 0
        endTime = `${currentYear}-${currentMonth.toString().padStart(2, '0')}` // 确保月份是两位数
        startTime = `${yearSixMonthsAgo}-${monthSixMonthsAgo
          .toString()
          .padStart(2, '0')}` // 确保月份是两位数
      }
      this.queryData.timeType = timeType
      this.queryData.startTime = startTime
      this.queryData.endTime = endTime
    },

    /**
     * 柱状折现统计图
     */
    getEcharts(XData, YData1, YData2) {
      if (this.myChart) {
        this.myChart.dispose()
        this.myChart = null
      }
      this.myChart = this.$echarts.init(this.$refs.histogramMap)
      const times = typeof this.defaultTime === 'string' ? this.defaultTime : moment(this.defaultTime[0]).format('YYYY-MM')
      this.myChart.setOption(doubleFoline3D(XData, YData1, YData2, times, this.selectType))
    },
    /**
     * @description 气候分析统计
     * @param {object} queryData 查询参数 timeType 0半年 1五年
     */
    async getClimaticAnalyst() {
      const res = await climaticAnalyst(this.queryData)
      if (res.code === 200) {
        const resData = res.data
        this.analyseList.forEach((element) => {
          element.value = element.keyType === 'temperatureMonth' ? Math.round(resData[element.keyType] * 10) / 10 : Math.round(resData[element.keyType])
        })
        // 柱状图的xdata的值
        this.timesList = resData.precipitationList.map(item => {
          let temp = ''
          // 年
          if (this.queryData.timeType === 1) {
            temp = parseInt(item.times) + '月'
          } else {
            // temp = parseInt(item.days)
            // temp = parseInt(moment(item.dayDateTime).format('DD'))
            temp = moment(item.dayDateTime).format('YYYY-MM-DD')
          }
          return temp
        })
        // 降水数据
        this.precipitationList = resData.precipitationList.map(item => item.precipitation)
        // 温度数据
        this.temperatureList = resData.temperatureList.map(item => item.temperature)
        // 绘制echarts图
        this.getEcharts(this.timesList, this.precipitationList, this.temperatureList)
      } else {
        iframeSDK({
          iframeOperationId: 'message',
          message: res.msg
        })
      }
      // try {
      //
      // }
      // catch (error) {
      //   iframeSDK({
      //     iframeOperationId: 'message',
      //     message: '错误'
      //   })
      // }
    },
    formatNumber(num) {
      if (!num) return 0
      // 将数字转换为字符串
      const strNum = num.toString()

      // 检查字符串中是否包含小数点
      if (strNum.includes('.')) {
        return parseFloat(num.toFixed(2))
      } else {
        return num
      }
    },

    // 改变时间
    changeTime(val) {
      this.defaultTime = val
      this.processTime(this.selectType)
      this.getClimaticAnalyst()
      // 设置当前的时间
      const currentHistoryTime = this.capitalizeFirstLetter(this.selectType)
      sessionStorage.setItem(currentHistoryTime, JSON.stringify(val))
    },

    // 改变时间类型
    changeSelect(val) {
      this.selectType = val
      // 设置当前的时间的类型
      sessionStorage.setItem('date_climaticTimeType', JSON.stringify(val))
      this.queryData.timeType = this.getTimeType(val)
      // 判断切换类型后，是否有默认数据，没有添加默认数据
      const currentHistoryTime = this.capitalizeFirstLetter(this.selectType)
      const historyTime = JSON.parse(sessionStorage.getItem(currentHistoryTime))
      if (!historyTime) {
        if (this.selectType === 'day' || this.selectType === 'month' || this.selectType === 'year') {
          this.defaultTime = this.getTimeMap.get(this.selectType)
        } else {
          const startTime = moment().subtract(6, 'days').format('YYYY-MM-DD')
          const endTime = moment().format('YYYY-MM-DD')
          this.defaultTime = [startTime, endTime]
        }
        sessionStorage.setItem(currentHistoryTime, JSON.stringify(this.defaultTime))
      } else {
        this.defaultTime = historyTime
      }
      this.processTime(this.selectType)
      this.getClimaticAnalyst()
    },

    // 根据日期类型，给startTime和endTime赋值
    processTime(val) {
      if (val === 'custom') {
        this.queryData.startTime = this.defaultTime[0]
        this.queryData.endTime = this.defaultTime[1]
      } else {
        this.queryData.startTime = this.defaultTime
        this.queryData.endTime = this.defaultTime
      }
    },

    // 使用正则表达式匹配字符串的第一个字符，并将其转换为大写
    capitalizeFirstLetter(str) {
      const temp = str.charAt(0).toUpperCase() + str.slice(1)
      return `date_climaticHistoryTime${temp}`
    },
    // 将日期跟timeType对应起来
    getTimeType(val) {
      let temp = null
      switch (val) {
        case 'year':
          temp = 1
          break
        case 'month':
          temp = 0
          break
        case 'day':
          temp = 2
          break
        case 'custom':
          temp = 2
          break
        default:
          temp = 1
      }
      return temp
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/styles/px-to-rem";
.climatic {
  width: 100%;
  font-size: px-to-rem(14);
  color: #ffffff;
  .staticMain{
    width: 100%;
    height: px-to-rem(400);
    display: flex;
    flex-direction:column;
    box-sizing: border-box;
    padding: px-to-rem(12) px-to-rem(12) 0;
  }
  .topStatic {
    width: 100%;
    height: px-to-rem(92);
    .topMain {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: px-to-rem(12);

      .mainList {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        .name {
          width: px-to-rem(54);
          height: px-to-rem(48);
          margin:0 px-to-rem(6);
          display: grid;
          place-items: center;
        }
        .nameMouth {
          background: url("~@/assets/image/newCommon/bird7.png") no-repeat;
          background-size: 100% 100%;
        }
        .nameYear {
          background: url("~@/assets/image/newCommon/bird8.png") no-repeat;
          background-size: 100% 100%;
        }
        .text-wrap {
          .title{
            font-size: px-to-rem(14);
            margin-bottom: px-to-rem(8);
          }
          .num {
            font-size: px-to-rem(18);
          }
        }
        &:nth-child(1){
          background: url("~@/assets/image/newCommon/bird9.png") no-repeat;
          background-size: 100% 100%;
          .text-wrap{
            .title{
              text-shadow: 0px 2px 4px #F9FF6C;
            }
            .num{
              text-shadow: 0px 0px 5px #F9FF6C;
            }
          }
        }
        &:nth-child(2){
          background: url("~@/assets/image/newCommon/bird10.png") no-repeat;
          background-size: 100% 100%;
          .text-wrap{
            .title{
              text-shadow: 0px 2px 4px #43C88F
            }
            .num{
              text-shadow: 0px 0px 5px #43C88F;
            }
          }
        }
      }
    }
  }
  .middleTime {
    width: 100%;
    height: px-to-rem(32);
    margin-top: px-to-rem(12);
    display: flex;
    .hh-select {
      width: px-to-rem(75);
      height: px-to-rem(32);
      position: relative;
      display: block;
    }
    .rangBox {
      width:px-to-rem(260);
      height: px-to-rem(32);
      margin-left: px-to-rem(10);
    }
  }
  .echatBox {
   flex:1;
   overflow: hidden;
   margin-top:px-to-rem(12);
   display: flex;
   flex-direction: column;
    .legend-wrap {
      display: flex;
      align-items: center;
      justify-content: right;
      gap: px-to-rem(12);

      .img-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: px-to-rem(10);
          height: px-to-rem(10);
          margin-right: px-to-rem(12);
        }
        .temperature-icon {
          width: px-to-rem(11);
          height: px-to-rem(5);
        }
        span {
          font-size: px-to-rem(14);
          color: rgba(199, 255, 250, 1);
        }
      }
    }

    .nameText {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: px-to-rem(12);
      span{
        font-size: px-to-rem(14);
      }
    }
    .echartMain {
      flex:1;
      overflow: hidden;
    }
  }
}
</style>
