<template>
  <div class="common-theme">
    <div :class="genCommonWrapper">
      <div v-if="!isExpand" class="todayWeather">
        <div class="flexrow">
          <div class="weatherbox">
            <svg class="weather-icon" aria-hidden="true">
              <use :xlink:href="'#' + todayWeather.weatherIcon" />
            </svg>
          </div>
          <span class="temptxt">{{ todayWeather.temperature }}</span>
          <div class="right">
            <el-tooltip
              popper-class="iwhale-speciesLYstyle"
              placement="top"
              :content="`更新时间：${todayWeather.weatherObsTime}`"
            >
              <i
                class="question-icon iconfont_tools icon-linye_icon_wenhao"
              ></i>
            </el-tooltip>
            <div
              class="weather-air"
              @click="isShowAqiList = !isShowAqiList"
              :style="{ color: color }"
            >
              <img class="air-icon" :src="AQI_ICON[todayAqi.level]" alt="" />
              <img class="air-bg" :src="AQI_BG[todayAqi.level]" alt="" />
              {{ todayAqi.category && todayAqi.category.substring(0, 2) }}
              {{ todayAqi.aqi }}
            </div>
          </div>
        </div>
        <div class="flexrow flex-mt--4">
          <div class="nowdate">
            <span>{{ todayWeather.weatherDate }}</span>
          </div>
          <div class="todaytxt">
            <span>{{ todayWeather.weatherText }}</span>
            <span>{{ todayWeather.windText }}</span>
          </div>
        </div>
        <i
          class="expandBtn iconfont_tools icon-linye_icon_biaotizhankai_you"
          @click="isExpand = true"
        ></i>
        <div class="wabtnwrapper">
          <div
            v-if="isOpenWarning && todayAlarm && todayAlarm.length > 0"
            :class="[
              todayAlarm.length > 1
                ? 'weatherAlarmBtn'
                : `walarmbtn active ${(
                    todayAlarm[0].severityColor || ''
                  ).toLowerCase()}`,
              !isShowWeatherAlarm && 'flashing'
            ]"
            @click="isShowWeatherAlarm = !isShowWeatherAlarm"
          >
            <div
              v-if="!isShowWeatherAlarm && todayAlarm && todayAlarm.length > 1"
              class="img-flash-container"
            >
              <img
                v-for="(item, index) in FLASH_IMGS"
                :key="index"
                :src="item"
                alt=""
                class="flash-item"
              />
            </div>
            <img
              v-else-if="
                isShowWeatherAlarm && todayAlarm && todayAlarm.length > 1
              "
              src="@component-gallery/assets/image/weather/warning_no_flash.png"
              alt=""
            />
            <i v-else :class="['qwicon', 'qi-' + todayAlarm[0].type]" />
          </div>
        </div>
      </div>
      <div v-else class="futureWeather">
        <i
          class="collapseBtn iconfont_tools icon-linye_icon_biaotizhankai_zuo"
          @click="isExpand = false"
        ></i>
        <div
          :key="index"
          v-for="(item, index) in futureWeather"
          class="smallWeatherCard"
        >
          <div class="smallweatherbox">
            <svg class="weather-icon" aria-hidden="true">
              <use :xlink:href="'#' + item.weatherIcon" />
            </svg>
            <span>{{ item.tempRange }}</span>
          </div>
          <div class="weathertxt">{{ item.weatherText }}</div>
          <div class="windtxt">{{ item.windText }}</div>
          <div class="nowdatesmall">
            <span>{{ item.weatherDate }}</span>
          </div>
        </div>
      </div>
      <weather-aqi-pop
        v-if="isShowAqiList"
        :width="368"
        :left="382"
        :theme="themeKey"
        @close="isShowAqiList = false"
      />
      <weather-warning-pop
        v-if="isShowWeatherAlarm"
        :width="380"
        :left="382"
        :alarmData="todayAlarm"
        @close="isShowWeatherAlarm = false"
      />
    </div>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
import { $v, getWeatherIcon } from '@component-gallery/utils/funCommon/common'
import '@component-gallery/assets/weatherSvg/iconfont.js'
import IconConfig from '../utils/icon-and-background-config'
import WeatherWarningPop from '@component-gallery/utils/dialog/weather-warning-pop/WeatherWarningPop.vue'
import WeatherAqiPop from '@component-gallery/utils/dialog/weather-aqi-pop/WeatherAqiPop.vue'
import eventPath from '@component-gallery/build-event-bus-path'
import { poiContraryGeocodingQuery } from '../service/index'
import { poiAreaQuery } from '@component-gallery/utils/mapCommon/map-ol/CommonCtMapOl'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('common-comp')

export default {
  name: 'd-weather',
  components: { WeatherAqiPop, WeatherWarningPop, [Tooltip.name]: Tooltip },
  props: {
    provinceCode: {
      // 省份编码
      type: String,
      default: '110000'
    },
    cityCode: {
      // 地市编码
      type: String,
      default: ''
    },
    countyCode: {
      // 区县编码
      type: String,
      default: ''
    },
    isOpenWarning: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      themeKey: '',
      AQI_BG: IconConfig.AQI_BG,
      AQI_ICON: IconConfig.AQI_ICON,
      AQI_FONT_COLOR: IconConfig.AQI_FONT_COLOR['theme-wiseblue'],
      FLASH_IMGS: IconConfig.FLASH_IMGS,
      futureWeather: [],
      todayWeather: {
        weatherIcon: null,
        temperature: null,
        weatherObsTime: null,
        weatherDate: null,
        weatherText: null,
        windText: null
      },
      todayAqi: {
        level: null,
        category: null,
        aqi: null
      },
      todayAlarm: [],
      isExpand: false, // 是否展开
      isShowAqiList: false,
      isShowWeatherAlarm: false // 是否显示预警信息
    }
  },
  computed: {
    color() {
      return this.todayAqi.level
        ? IconConfig.AQI_FONT_COLOR['theme-wiseblue'][this.todayAqi.level]
        : '#ffffff'
    },
    dataParam() {
      // 使用计算属性承载参数。省市区编码任意一个更新才处理
      const { provinceCode, cityCode, countyCode } = this
      let adcode = countyCode || cityCode || provinceCode
      // 容错：如果传入的是全国编码，强行改为北京市
      if (adcode === '100000') {
        adcode = '110000'
      }
      return {
        adcode
      }
    },
    genCommonWrapper() {
      return {
        [bem.b('weather')]: true,
        'iwhale-speciesLYstyle': true
      }
    }
  },
  watch: {
    dataParam: {
      handler(val) {
        this.queryFutureWeather(val)
        this.queryTodayWeather(val)
        this.queryTodayAqi(val)
        if (this.isOpenWarning) {
          this.queryForewarning(val)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.changeTheme(document.documentElement.getAttribute('data-theme'))
    this.$globalEventBus.$on('data-theme', (theme) => {
      this.changeTheme(theme)
    })
    this.$globalEventBus.$on(
      `${eventPath.commonCompSearchMap}__select-area`,
      (data) => {
        this.changeArea(data.areaData)
      }
    )
    // 监听网格
    this.$globalEventBus.$on(
      `${eventPath.commonCompSearchMap}__select-grid`,
      async (data) => {
        if (!data?.gridData?.center?.length > 0) {
          const defaultAreaData = { provinceCode: '110000' }
          this.changeArea(defaultAreaData)
          return
        }
        const areaData = await this.getAreaDataFormGridData(
          data.gridData.center
        )
        this.changeArea(areaData)
      }
    )
  },
  beforeDestroy() {
    this.$globalEventBus.$off(`${eventPath.commonCompSearchMap}__select-area`)
    this.$globalEventBus.$off(`${eventPath.commonCompSearchMap}__select-grid`)
  },
  methods: {
    async changeArea(payload) {
      if (payload?.level === 'province') {
        const res = await poiAreaQuery({ adCode: payload.adcode })
        const { data, code } = res
        if (code === 200 && data) {
          this.queryWeather(data)
        } else {
          console.warn('接口存在异常')
        }
      } else {
        this.queryWeather(payload)
      }
      // const { provinceCode, cityCode, countyCode } = payload
      // const newData = { provinceCode, cityCode, countyCode }
      // // 如果只有省份编码，那么要得到省会（或者确定它是直辖市），才能送给天气组件查询
      // if (provinceCode && !cityCode && !countyCode) {
      //   const res = await poiAreaQuery({ adCode: payload.adcode })
      //   const { data, code } = res
      //   if (code === 200 && data) {
      //     newData.cityCode = data.cityCode
      //     this.queryWeather(newData)
      //   }
      // } else {
      //   this.queryWeather(newData)
      // }
    },
    async getAreaDataFormGridData(gridCenter) {
      const params = {
        lon: gridCenter[0],
        lat: gridCenter[1]
      }
      const res = await poiContraryGeocodingQuery(params)
      if (res.code == '200') {
        const region = res.data?.[0]?.region
        return {
          provinceCode: region?.provinceCode,
          cityCode: region?.cityCode
          // countyCode: region?.countyCode
        }
      } else {
        console.warn('获取区域编码失败')
        return {}
      }
    },
    queryWeather(newData) {
      let params = this.filterAreaCode(newData)
      this.queryFutureWeather(params)
      this.queryTodayWeather(params)
      this.queryTodayAqi(params)
      if (this.isOpenWarning) {
        this.queryForewarning(params)
      }
    },
    // 查询未来天气数据
    queryFutureWeather(params) {
      const url = '/order/weather/day'
      $v.postNoLoadCheck(this, url, { ...params, day: 7 }, (resp) => {
        if (resp.data) {
          // 取未来三天
          const nextThreeDays = resp.data.daily.slice(1, 4)
          this.futureWeather = nextThreeDays.map((o) => ({
            weatherIcon: getWeatherIcon(o.textDay), // 天气图标
            weatherDate: o.fxDate,
            windText: `${o.windDirDay}${o.windScaleDay}级`,
            tempRange: `${o.tempMin}/${o.tempMax}℃`,
            weatherText: o.textDay
          }))
        }
      })
    },
    queryTodayAqi(params) {
      const url = '/order/air/now'
      $v.postNoLoadCheck(this, url, params, (resp) => {
        if (resp.data) {
          this.todayAqi = resp.data
        }
      })
    },
    // 查询今日天气数据
    queryTodayWeather(params) {
      const url = '/order/weather/now'
      $v.postNoLoadCheck(this, url, params, (resp) => {
        if (resp.data) {
          // 对数据进行处理
          this.todayWeather = {
            temperature: `${resp.data.temp}℃`,
            weatherIcon: getWeatherIcon(resp.data.text), // 天气图标
            weatherObsTime: this.formatDate(resp.data.obsTime),
            weatherDate: resp.data.obsTime.substring(0, 10).replace(/-/g, '.'), // 天气日期，设计稿上只有年月日，但时间是YYYY-MM-DD hh:mm:ss格式，截断
            windText: `${resp.data.windDir}${resp.data.windScale}级`,
            weatherText: resp.data.text
          }
        }
      })
    },
    queryForewarning(params) {
      this.todayAlarm = []
      this.isShowWeatherAlarm = false
      const url = '/order/weather/warning'
      $v.postNoLoadCheck(this, url, params, (resp) => {
        if (resp.data) {
          this.todayAlarm = resp.data || []
        }
      })
    },
    filterAreaCode(codeData) {
      let params = {}
      const newData = codeData ? codeData : this.dataParam
      const { provinceCode, cityCode, countyCode } = newData
      params.adcode = countyCode || cityCode || provinceCode
      // 容错：如果传入的是全国编码，强行改为北京市
      if (params.adcode === '100000') {
        params.adcode = '110000'
      }
      return params
    },
    changeTheme(themeKey) {
      this.themeKey = themeKey
      //theme-wiseblue: 睿智蓝 theme-terracotta: 赤土黄 theme-aquamarine: 碧山绿
      this.AQI_BG =
        themeKey === 'theme-aquamarine'
          ? IconConfig.AQI_BG_LY
          : IconConfig.AQI_BG
      this.AQI_FONT_COLOR = IconConfig.AQI_FONT_COLOR[themeKey]
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return ''
      }
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/assets/qwicon/font/qweather-icons.css';
@import '~@component-gallery/theme-chalk/src/weather-card/weather';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
