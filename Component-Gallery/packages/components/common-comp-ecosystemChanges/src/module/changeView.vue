// 生态系统变化
<template>
  <div class="change" id="scrollContainer">
    <div v-for="(item, index) in dataList" :key="index" class="singleList">
      <p class="index" :style="{ backgroundImage: `url(${item.icon})` }">
        {{ index + 1 }}
      </p>
      <div class="singleRight">
        <div class="right_top">
          <p class="name">{{ item.name }}</p>
          <div class="numRight">
            <div class="num">
              <p :style="{ color: item.color }">
                {{
                  item.areaDiff > 0 ? '+' + item.areaDiff : item.areaDiff
                }}公顷
              </p>
            </div>
            <div class="rate">
              <img
                :src="
                  require(`@component-gallery/ecosystemChanges/assets/image/imgIcon${
                    item.areaRate > 0 || item.areaRate == 0 ? '3' : '2'
                  }.png`)
                "
                alt=""
                class="icon"
              />
              <p
                :style="{
                  color:
                    item.areaRate > 0 || item.areaRate == 0
                      ? '#D44242'
                      : '#0DC985'
                }"
              >
                {{ rateHandle(item.areaRate) }}
              </p>
            </div>
          </div>
        </div>
        <div class="right_bottom">
          <div class="left_line">
            <div v-if="item.areaDiff < 0" class="area">
              <p
                class="line"
                :style="{ width: calculation(item.areaRate) + '%' }"
              />
              <img
                src="@component-gallery/ecosystemChanges/assets/image/icon19.png"
                alt=""
                :style="{ left: pointCalculation(item.areaRate, 'left') }"
                class="point"
              />
            </div>
          </div>
          <div class="right_line">
            <div v-if="item.areaDiff > 0" class="area">
              <p
                class="line"
                :style="{ width: calculation(item.areaRate) + '%' }"
              />
              <img
                src="@component-gallery/ecosystemChanges/assets/image/icon10.png"
                alt=""
                :style="{ left: pointCalculation(item.areaRate, 'right') }"
                class="point"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsChain } from '@component-gallery/ecosystemChanges/src/service/index.js'
import { iframeSDK } from '@ct/iframe-connect-sdk'
import { formattedValue } from '../utils/index.js'
import { ScrollBarAuto } from '@component-gallery/ecosystemChanges/src/utils/index.js'
export default {
  props: {
    haveDataTimeClone: {
      type: Array,
      default: () => []
    },
    timeListClone: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataList: [],
      maxNum: 0,
      nameMap: new Map([
        [1, '河流湿地'],
        [2, '湖泊湿地'],
        [3, '沼泽湿地'],
        [4, '农业用地'],
        [5, '养殖场类'],
        [6, '城市用地'],
        [7, '景观用地']
      ]),
      defaultTime: [],
      timeList: [],
      scrollBarAutos: null,
      haveDataTime: this.haveDataTimeClone //有数据的年份区间
    }
  },
  watch: {
    timeListClone: {
      handler(val) {
        this.timeList = val
        this.getStatisticsChain()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 计算比例
    calculation(value) {
      if (value == 0) {
        return 0
      } else {
        let rate = Math.abs(value)
        rate = rate > 100 ? 100 : rate
        if (rate.toString().indexOf('.') > -1) {
          return rate.toFixed(2)
        } else {
          return rate
        }
      }
    },

    // 光标进度计算
    pointCalculation(value, type) {
      const num = this.calculation(value)
      if (type == 'right') {
        return num + '%'
      } else {
        return 100 - num + '%'
      }
    },

    // 百分比数据处理
    rateHandle(val) {
      const rate = Math.abs(val)
      if (rate.toString().indexOf('.') > -1) {
        return rate.toFixed(2) + '%'
      } else {
        return rate + '%'
      }
    },

    // 数据处理
    handleData(data) {
      console.log(13241243, this.scrollBarAutos)
      if (this.scrollBarAutos) {
        console.log(999999999)
        this.scrollBarAutos.stop()
      }
      const num = []
      this.dataList = data
      this.dataList.forEach((item) => {
        num.push(Math.abs(item.areaDiff))
        item.areaRate = item.areaRate.toFixed(2) * 100
        item.name = this.nameMap.get(item.type)
        item.areaDiff = formattedValue(item.areaDiff)
      })
      this.maxNum = Math.max(...num)
      this.addColorFun()
      this.$nextTick(() => {
        const scrollContainer = document.getElementById('scrollContainer')
        if (!this.scrollBarAutos) {
          this.scrollBarAutos = new ScrollBarAuto(scrollContainer, 3000, 500)
        } else {
          this.scrollBarAutos.start()
        }
      })
    },

    // 获取数据
    async getStatisticsChain() {
      if (this.timeList.length == 0) {
        return
      }
      const params = {
        coverageType: 1,
        startTime: this.timeList[0].replace('年', ''),
        endTime: this.timeList[1].replace('年', '')
      }
      const res = await statisticsChain(params)
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.handleData(res.data)
        } else {
          this.defaultData()
        }
      } else {
        await iframeSDK({
          iframeOperationId: 'message',
          message: '获取数据失败!'
        })
        this.defaultData()
      }
    },

    // 无数据时给定默认值
    defaultData() {
      if (this.scrollBarAutos) {
        this.scrollBarAutos.stop()
      }
      this.dataList = []
      this.maxNum = 0
      for (let i = 1; i < 8; i++) {
        this.dataList.push({
          areaRate: 0,
          name: this.nameMap.get(i)
        })
      }
      this.addColorFun()
      this.$nextTick(() => {
        const scrollContainer = document.getElementById('scrollContainer')
        if (!this.scrollBarAutos) {
          this.scrollBarAutos = new ScrollBarAuto(scrollContainer, 3000, 500)
        } else {
          this.scrollBarAutos.start()
        }
      })
    },

    //数据添加不同颜色图片
    addColorFun() {
      if (this.dataList.length > 0) {
        this.dataList.forEach((item, index) => {
          if (index == 0) {
            item.icon = require('@component-gallery/ecosystemChanges/assets/image/icon6.png')
            item.color = '#D44242'
          } else if (index == 1) {
            item.icon = require('@component-gallery/ecosystemChanges/assets/image/icon7.png')
            item.color = '#DC7625'
          } else if (index == 2) {
            item.icon = require('@component-gallery/ecosystemChanges/assets/image/icon8.png')
            item.color = '#D3A230'
          } else {
            item.icon = require('@component-gallery/ecosystemChanges/assets/image/icon9.png')
            item.color = '#FFFFFF'
          }
        })
      }
    }
  },
  beforDestroy() {
    this.scrollBarAutos.stop()
    this.scrollBarAutos = null
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.change {
  height: px-to-rem(239);
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .singleList {
    display: flex;
    width: 100%;
    height: px-to-rem(35);
    align-items: center;
    background: url('~@component-gallery/ecosystemChanges/assets/image/icon23.png')
      no-repeat;
    background-size: 100% 50%;
    font-size: px-to-rem(14);
    color: #fff;
    background-position: 100% 100%;
    .index {
      margin-right: px-to-rem(5);
      width: px-to-rem(25);
      height: px-to-rem(25);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .singleRight {
      flex: 1;
      overflow: hidden;
      .right_top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: px-to-rem(5);
        .name {
          font-size: px-to-rem(14);
        }
        .numRight {
          display: flex;
          align-items: center;
          .num {
            font-size: px-to-rem(14);
          }
          .rate {
            display: flex;
            width: px-to-rem(80);
            align-items: center;
            .icon {
              margin-right: px-to-rem(5);
              height: px-to-rem(14);
            }
            margin-left: px-to-rem(10);
          }
        }
      }
      .right_bottom {
        width: 100%;
        height: px-to-rem(5);
        background: rgba(2, 137, 109, 0.2);
        margin-bottom: px-to-rem(10);
        display: flex;
        .left_line {
          width: 50%;
          height: 100%;
          position: relative;
          border-right: px-to-rem(1) solid #fff;
          .area {
            height: 100%;
            .line {
              height: 100%;
              position: absolute;
              right: 0;
              background: linear-gradient(
                90deg,
                rgba(52, 255, 170, 0.64) 0%,
                rgba(78, 209, 200, 0.1) 100%
              );
            }
          }
        }
        .right_line {
          width: 50%;
          position: relative;
          height: 100%;
          border-left: px-to-rem(1) solid #fff;
          .area {
            height: 100%;
            .line {
              height: 100%;
              background: linear-gradient(
                90deg,
                rgba(255, 193, 126, 0.1) 0%,
                rgba(255, 34, 0, 0.64) 100%
              );
            }
          }
        }
        .point {
          position: absolute;
          top: px-to-rem(-7.5);
          width: px-to-rem(20);
          transform: translateX(-62%);
          height: px-to-rem(20);
        }
      }
    }
    &:not(:nth-last-child(1)) {
      margin-bottom: px-to-rem(10);
    }
  }
}
</style>
