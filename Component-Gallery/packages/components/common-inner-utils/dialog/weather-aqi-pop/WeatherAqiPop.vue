<template>
  <div class="weather-aqi_container">
    <absolute-container
      :top="top"
      :left="left"
      :right="right"
      :bottom="bottom"
      :width="width"
      :noCorner="['terracotta']"
      class="weather-aqi_wrapper"
      title=" "
      left-title
      @close="onClose"
    >
      <template v-slot:title>
        <div class="warning-title">
          <span class="title-text">空气质量排行</span>
          <el-tooltip
            :content="`更新时间：${formattedDate}`"
            :popper-options="{
              flipBehavior: []
            }"
            placement="top"
            popper-class="iwhale-speciesLYstyle weather-small-tooltip"
          >
            <i class="question-icon iconfont_tools icon-linye_icon_wenhao" />
          </el-tooltip>
        </div>
      </template>
      <div ref="listDom" v-loading="loading" class="out-wrapper">
        <el-scrollbar ref="scrollBar" class="custom-scrollbar">
          <div class="aqiContainer">
            <div
              v-for="(item, index) in aqiRank.subList"
              :key="index"
              class="aqiline"
            >
              <div class="textarea">
                <div class="indnum">{{ index + 1 }}</div>
                <div
                  v-c-tip.auto="
                    item.provinceName + item.cityName + (item?.countyName || '')
                  "
                  class="address"
                  >{{
                    item.provinceName + item.cityName + (item?.countyName || '')
                  }}
                </div>
              </div>
              <div
                :style="{ color: AQI_FONT_COLOR[item.level] || '#FFFFFF' }"
                class="weather-air"
              >
                <img :src="AQI_ICON[item.level]" class="air-icon" alt="" />
                <img :src="AQI_BG[item.level]" class="air-bg" alt="" />
                {{ item.category.substring(0, 2) }} {{ item.aqi }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </absolute-container>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
import ElScrollbar from 'element-ui/lib/scrollbar'
import IconConfig from './utils/icon-and-background-config'
import { $v, formatCurrentDate } from '../../funCommon/common'
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'

export default {
  name: 'WeatherAqiPop',
  components: { AbsoluteContainer, ElScrollbar, [Tooltip.name]: Tooltip },
  props: {
    theme: {
      type: String,
      default: ''
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    right: Number,
    bottom: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timer: null,
      loading: true,
      AQI_ICON: IconConfig.AQI_ICON,
      AQI_FONT_COLOR: IconConfig.AQI_FONT_COLOR['theme-wiseblue'],
      AQI_BG: IconConfig.AQI_BG,
      aqiRank: { size: 0, subList: [] },
      formattedDate: ''
    }
  },
  watch: {
    theme: {
      handler(val) {
        if (val === 'theme-aquamarine') {
          this.AQI_BG = IconConfig.AQI_BG_LY
        } else {
          this.AQI_BG = IconConfig.AQI_BG
        }
        this.AQI_FONT_COLOR = IconConfig.AQI_FONT_COLOR[val]
      },
      immediate: true
    }
  },
  mounted() {
    this.queryAqiList()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    formatWeatherInfo(_arr) {
      _arr.sort((a, b) => {
        return a.aqi - b.aqi
      })
      _arr.forEach((item) => {
        if (item.provinceName || item.cityName || item.countyName) {
          item.location =
            item.provinceName +
            (item.cityName ? item.cityName : '') +
            (item.countyName ? item.countyName : '')
        } else {
          item.location = item.locationNameZh
        }
      })
    },
    queryAqiList() {
      const url = '/order/weather/getAirQualityList'
      const params = {}
      this.aqiRank = { size: 0, subList: [] }
      this.loading = true
      this.formattedDate = formatCurrentDate()
      $v.postNoLoadCheck(this, url, params, (res) => {
        const { data, code } = res
        if (Number(code) === 200) {
          this.formatWeatherInfo(data)
          this.aqiRank.subList = data
          this.loading = false
          this.setTimer()
        } else {
          console.warn('this request is invalid!')
        }
      })
    },
    setTimer() {
      // 需求要求每3秒自动滚动一页
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
        return
      }
      if (this.aqiRank.subList.length <= 5) {
        // 因为5条以上才会出现滚动条，所以5条及以下没有必要启动定时器
        return
      }
      this.timer = setInterval(() => {
        const $listDom = this.$refs.listDom.querySelector('.el-scrollbar__wrap')
        const $itemDom = this.$refs.listDom.querySelector('.aqiline')
        if (
          $listDom.scrollTop + $itemDom.clientHeight * 5 >=
          $listDom.scrollHeight - 10
        ) {
          $listDom.scrollTo(0, 0)
        } else {
          $listDom.scrollTo(0, $listDom.scrollTop + $itemDom.clientHeight * 5)
        }
        this.$refs.scrollBar.update()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/weather-card/aqi-list';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
