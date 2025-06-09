<template>
  <div
    class="emergency-meteorological-wapper"
    :style="{
      top: `${pxToRem(top)}`,
      left: `${pxToRem(left + 382)}`,
      zIndex: videoIndex
    }"
  >
    <div class="emergency-meteorological-box">
      <div class="meteorological-close" @click="$emit('close')"></div>
      <div class="emergency-meteorological-title">气象数据</div>
      <div class="today-weather">
        <div class="weather-box">
          <svg class="weather-icon" aria-hidden="true">
            <use :xlink:href="'#' + todayWeather.weatherIcon" />
          </svg>
        </div>
        <div class="weather-air-wapper">
          <div class="weather-air-text-top">
            <div class="weather-air-wd">{{ todayWeather.temperature }}</div>
            <div class="weather-air-zl">
              <el-tooltip
                popper-class="iwhale-speciesLYstyle alarm-detail-tooltip"
                placement="top"
                :content="todayWeather.weatherObsTime"
              >
                <em class="question-icon iconfont_tools icon-linye_icon_wenhao" />
              </el-tooltip>
              <div class="weather-air" :style="{ color: AQI_COLOR[todayAqi.level] || '#FFFFFF' }">
                <img class="air-icon" alt="" :src="AQI_ICON[todayAqi.level]" />
                <img class="air-bg" alt="" :src="AQI_BG[todayAqi.level]" />
                {{ todayAqi.category && todayAqi.category.substring(0, 2) }}
                {{ todayAqi.aqi }}
              </div>
            </div>
          </div>
          <div class="weather-air-text-bot">
            <span>{{ todayWeather.weatherText }}</span
            ><span>{{ todayWeather.windText }}</span>
          </div>
        </div>
      </div>
      <!-- 预警模块 -->
      <div class="weather-warning-box" v-if="todayAlarm.length > 0">
        <c-scroll>
          <div class="weather-warning">
            <base-collapse-group v-model="activeNames" :accordion="true">
              <base-collapse
                v-for="(item, index) in todayAlarm"
                :key="index"
                title=" "
                :name="item.title"
                icon="video-storage"
                size="10"
                :class="displayWarningClass(item)"
                class="blue-warning"
              >
                <template #title>
                  <div class="weather-warning-icon">
                    <em :class="['qwicon', 'qi-' + item.type]" />
                  </div>
                  <div class="weather-warning-icon1"></div>
                  <span v-c-tip.auto="item.title">{{ item.title }}</span>
                  <div class="weather-warning-icon2"></div>
                </template>
                <div class="weather-warning-content">
                  <div class="weather-warning-label"
                    ><span v-c-tip.auto="item.typeName">预警类型：{{ item.typeName }}</span></div
                  >
                  <div class="weather-warning-label"
                    ><span v-c-tip.auto="item.severityName"
                      >严重等级：<div class="warning-level-tag">{{ item.severityName }}</div></span
                    ></div
                  >
                  <div class="weather-warning-label"
                    ><span>发布时间：{{ item.pubTime }}</span></div
                  >
                  <div class="weather-warning-label">
                    {{ item.text }}
                  </div>
                </div>
              </base-collapse>
            </base-collapse-group>
          </div>
        </c-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import CScroll from '@component-gallery/utils/funCommon/c-scroll.vue'
import { getWeatherInfoByAlarmTime } from './service'
import { eventWarningEnum } from './util/data'
import { $v, getWeatherIcon } from '@component-gallery/utils/funCommon/common'
import BaseCollapse from '../base-form-inner/base-collapse/BaseCollapse.vue'
import BaseCollapseGroup from '../base-form-inner/base-collapse/BaseCollapseGroup.vue'
import '@component-gallery/assets/weatherSvg/iconfont.js'

// 林业背景
import aqiBg1 from './assets/images/aqi/aqiBg1.png'
import aqiBg2 from './assets/images/aqi/aqiBg2.png'
import aqiBg3 from './assets/images/aqi/aqiBg3.png'
import aqiBg4 from './assets/images/aqi/aqiBg4.png'
import aqiBg5 from './assets/images/aqi/aqiBg5.png'
import aqiBg6 from './assets/images/aqi/aqiBg6.png'

// 国土和通用公用一套背景
import aqiBgLy1 from './assets/images/land/aqiBg1.png'
import aqiBgLy2 from './assets/images/land/aqiBg2.png'
import aqiBgLy3 from './assets/images/land/aqiBg3.png'
import aqiBgLy4 from './assets/images/land/aqiBg4.png'
import aqiBgLy5 from './assets/images/land/aqiBg5.png'
import aqiBgLy6 from './assets/images/land/aqiBg6.png'

import aqiIcon1 from './assets/images/aqi/aqiIcon1.png'
import aqiIcon2 from './assets/images/aqi/aqiIcon2.png'
import aqiIcon3 from './assets/images/aqi/aqiIcon3.png'
import aqiIcon4 from './assets/images/aqi/aqiIcon4.png'
import aqiIcon5 from './assets/images/aqi/aqiIcon5.png'
import aqiIcon6 from './assets/images/aqi/aqiIcon6.png'

// 空气质量的图标、背景、颜色统一定义
const AQI_ICON = {
  1: aqiIcon1,
  2: aqiIcon2,
  3: aqiIcon3,
  4: aqiIcon4,
  5: aqiIcon5,
  6: aqiIcon6
}

const AQI_BG = {
  1: aqiBg1,
  2: aqiBg2,
  3: aqiBg3,
  4: aqiBg4,
  5: aqiBg5,
  6: aqiBg6
}

const AQI_FONT_COLOR = {
  ty: {
    1: '#7FFBEA',
    2: '#FEF8BA',
    3: '#FCF0DF',
    4: '#FAE5E4',
    5: '#EFE3FD',
    6: '#FBE9F1'
  },
  ly: {
    1: '#7FFBEA',
    2: '#F9FF6C',
    3: '#FCF0DF',
    4: '#FAE5E4',
    5: '#EFE3FD',
    6: '#FBE9F1'
  },
  gt: {
    1: '#7FFBEA ',
    2: '#FEFAD2',
    3: '#FCF0DF',
    4: '#FAE5E4',
    5: '#EFE3FD',
    6: '#FBE9F1'
  }
}
export default {
  name: 'emergency-meteorological',
  data() {
    return {
      showMeteorological: false, //气象数据弹窗是否显示
      todayAlarm: [],
      aqi: '',
      loading: false,
      AQI_COLOR: {},
      AQI_ICON,
      AQI_BG,
      theme: 'gt',
      activeNames: '',
      todayWeather: {
        weatherIcon: '',
        temperature: '',
        weatherObsTime: '',
        weatherText: '',
        windText: ''
      },
      todayAqi: {
        level: '',
        category: '',
        aqi: ''
      }
    }
  },
  props: {
    // "问号图标"鼠标移入时的提示语
    popupDesc: {
      type: String,
      default: '产生事件时获取气象数据的时间：'
    },
    adCode: {
      type: String,
      default: ''
    },
    // 产生事件的事件
    activeTime: {
      type: String,
      default: ''
    },
    top: {
      type: [Number, String],
      default: 34
    },
    left: {
      type: [Number, String],
      default: 24
    },
    videoIndex: {
      type: Number,
      default: 90
    }
  },
  watch: {
    adCode: {
      handler(val) {
        this.getWeaeherData(val)
        this.queryForewarning(val)
      },
      immediate: true
    }
  },
  components: {
    [BaseCollapse.name]: BaseCollapse,
    [BaseCollapseGroup.name]: BaseCollapseGroup,
    CScroll
  },
  mounted() {
    this.changeTheme(this.theme)
    this.$globalEventBus.$on('data-theme', (theme) => {
      const themeMap = {
        'theme-wiseblue': 'ty',
        'theme-aquamarine': 'ly',
        'theme-terracotta': 'gt'
      }
      this.changeTheme(themeMap[theme])
    })
  },
  methods: {
    // 气象预警 class
    displayWarningClass(item) {
      return eventWarningEnum.find((t) => t.key === item.severityColor)?.className || 'null'
    },
    getShow() {
      this.showMeteorological = true
      this.activeNames = ''
    },
    //获取天气数据
    getWeaeherData(val) {
      let params = {
        adCode: val,
        alarmTime: this.activeTime
      }
      getWeatherInfoByAlarmTime(params).then((resp) => {
        if (resp.data) {
          this.todayWeather = {
            temperature: `${resp.data.weatherData.temp}℃`,
            weatherIcon: getWeatherIcon(resp.data.weatherData.text), // 天气图标
            weatherObsTime: this.popupDesc + params.alarmTime,
            windText: `${resp.data.weatherData.windDir}${resp.data.weatherData.windScale}级`,
            weatherText: resp.data.weatherData.text
          }
          this.todayAqi = resp.data.airData
        }
      })
    },
    // 查询天气预警
    queryForewarning(val) {
      let newTimeBefore = this.getTime()
      let params = {
        adcode: val,
        startDate: newTimeBefore + ' ' + this.activeTime.slice(-8),
        endDate: this.activeTime
      }
      this.todayAlarm = []
      const url = '/order/weather/warning/history'
      $v.postNoLoadCheck(this, url, params, (resp) => {
        if (resp.data) {
          this.todayAlarm = resp.data[0] || []
        }
      })
    },
    getTime() {
      const date = new Date(this.activeTime)
      date.setDate(date.getDate() - 6)
      return date.toISOString().split('T')[0]
    },
    changeTheme(theme) {
      if (theme === 'ly') {
        this.AQI_BG = {
          1: aqiBg1,
          2: aqiBg2,
          3: aqiBg3,
          4: aqiBg4,
          5: aqiBg5,
          6: aqiBg6
        }
      } else {
        this.AQI_BG = {
          1: aqiBgLy1,
          2: aqiBgLy2,
          3: aqiBgLy3,
          4: aqiBgLy4,
          5: aqiBgLy5,
          6: aqiBgLy6
        }
      }
      this.AQI_COLOR = AQI_FONT_COLOR[theme]
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/assets/qwicon/font/qweather-icons.css';
@import '~@component-gallery/theme-chalk/src/meteorological/meteorological';
</style>
