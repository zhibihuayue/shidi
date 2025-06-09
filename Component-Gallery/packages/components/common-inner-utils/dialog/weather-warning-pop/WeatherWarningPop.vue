<template>
  <div class="weather-warning_container">
    <absolute-container
      :top="top"
      :left="left"
      :right="right"
      :bottom="bottom"
      :width="width"
      :noCorner="['terracotta']"
      class="weather-warning_wrapper"
      title=" "
      left-title
      @close="onClose"
    >
      <template v-slot:title>
        <div class="warning-title" v-c-tip.auto="nowAlarm.title">
          <span class="title-text">{{ nowAlarm.title }}</span>
        </div>
      </template>
      <div class="scroll-bar" :class="{ 'mb-12': alarmData.length <= 1 }">
        <div class="out-wrapper">
          <div class="flex-group">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <title>切片</title>
              <g id="页面-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                <g
                  id="1.4地图首页-灾害预警"
                  transform="translate(-416.000000, -146.000000)"
                >
                  <g
                    id="图标/20/icon_预警类型"
                    transform="translate(416.000000, 146.000000)"
                  >
                    <rect
                      id="18"
                      fill="#FFFFFF"
                      opacity="0"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    <path
                      d="M6.18312117,15.9845724 L5.16777505,15.9845724 L5.16777505,11.2891188 C5.16777505,8.62454849 7.33046032,6.46344978 10.0004107,6.46344978 C12.6699953,6.46344978 14.8326525,8.62494181 14.8326525,11.2891188 L14.8326525,15.9845724 L6.18352912,15.9845724 L6.18312117,15.9845724 Z M10.3500241,8.40842176 L7.96621571,12.3286791 L9.87272225,12.3286791 L9.39542039,15.268851 L11.7792288,11.3486218 L9.87272225,11.3486218 L10.3500241,8.40842176 L10.3500241,8.40842176 Z M14.0057653,4.10174624 C14.2295304,4.23197543 14.306046,4.51815802 14.1770622,4.74242868 L13.3201697,6.23019979 L12.5103883,5.7621406 L13.3668729,4.2743414 C13.428287,4.16719146 13.5298245,4.08880245 13.6491348,4.05642946 C13.768445,4.02405648 13.8957482,4.04035314 14.0030222,4.10173219 L14.0057512,4.10173219 L14.0057653,4.10174624 Z M9.99884923,3 C10.2791533,3 10.5057345,3.2107046 10.5057345,3.47234352 L10.5057345,5.1584017 L9.49194987,5.1584017 L9.49194987,3.47116357 C9.49196394,3.2107046 9.71854517,3 9.9988633,3 L9.99884923,3 Z M5.99469033,4.10174624 C6.10209269,4.03968494 6.22980878,4.02284111 6.34966408,4.05493055 C6.46951938,4.08701999 6.57166548,4.16540594 6.63356865,4.27279623 L7.49046124,5.76058138 L6.68067988,6.22904794 L5.82299952,4.74086947 C5.69414935,4.51706097 5.77073003,4.23134918 5.99431052,4.10173219 L5.99469033,4.10174624 Z M3.06313127,7.04193222 C3.12481349,6.93441376 3.22689167,6.85590035 3.34674324,6.82379211 C3.46659482,6.79168388 3.5943212,6.80863264 3.7016157,6.87088223 L5.18609061,7.73080983 L4.71891717,8.54254226 L3.23400618,7.68143472 C3.01021204,7.55180216 2.93360861,7.26581872 3.06270925,7.04193222 L3.06313127,7.04193222 Z M16.9373525,7.04193222 C17.0663339,7.26620655 16.9898118,7.55239025 16.7660415,7.68261466 L15.2819464,8.54137636 L14.814773,7.72926466 L16.2988681,6.86971633 C16.5217932,6.74126338 16.8067715,6.81705172 16.9361849,7.03920711 C16.9361849,7.04076632 16.9373525,7.04076632 16.9373525,7.04193222 Z M3.51200321,15.984571 L16.4899998,15.984571 C16.770318,15.984571 16.9984607,16.2123862 16.9984607,16.4922862 C16.9984607,16.7721862 16.770318,17 16.4899998,17 L3.51201728,17 C3.23169915,17 3.00355511,16.7725795 3.00355511,16.4922862 C3.00324549,16.3575347 3.0567159,16.2282131 3.1521387,16.1329305 C3.2475615,16.0376479 3.37707129,15.9842582 3.51201728,15.984571 L3.51200321,15.984571 Z"
                      id="形状"
                      fill-rule="nonzero"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span class="title">预警类型：</span>
            <span class="text" v-c-tip.auto="nowAlarm.typeName">
              {{ nowAlarm.typeName }}
            </span>
          </div>

          <div class="flex-group">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <title>切片</title>
              <g id="页面-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                <g
                  id="1.4地图首页-灾害预警"
                  transform="translate(-416.000000, -178.000000)"
                >
                  <g
                    id="图标/20/icon_预警等级"
                    transform="translate(416.000000, 178.000000)"
                  >
                    <rect
                      id="18"
                      fill="#FFFFFF"
                      opacity="0"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    <path
                      d="M16.8290544,14.0950139 L11.5893801,3.92708823 C11.2651379,3.35416843 10.6577601,3 9.99947888,3 C9.3411977,3 8.7338199,3.35416843 8.40957769,3.92708823 L3.16990333,14.0950139 C2.68693335,14.9410077 3.29089581,16 4.25983559,16 L15.7431219,16 C16.7090619,16 17.3130243,14.9410077 16.8300544,14.0950139 L16.8290544,14.0950139 Z M10.0164778,14.0320144 C9.5387812,14.041127 9.14414474,13.6612434 9.1350326,13.1835206 C9.12592047,12.7057978 9.50578325,12.3111397 9.98347987,12.302027 C10.4611765,12.2929144 10.855813,12.672798 10.8649251,13.1505208 C10.8740372,13.6282436 10.4941744,14.0229018 10.0164778,14.0320144 L10.0164778,14.0320144 Z M10.4464511,11.6590319 L9.55050678,11.6590319 C9.39622858,11.6585386 9.26501399,11.5463652 9.24052605,11.3940337 L8.67256135,8.4050555 C8.6269843,8.14486072 8.74724189,7.8836246 8.97454258,7.7490603 C9.06863316,7.69527217 9.17514497,7.66700535 9.28352338,7.66706082 L10.7124346,7.66706082 C10.8254275,7.66706082 10.930421,7.69706068 11.0224153,7.7490603 C11.2474013,7.87905935 11.365394,8.1450574 11.3223967,8.4050555 L10.754432,11.3940337 C10.7320881,11.5463366 10.6013759,11.6591725 10.447451,11.6590319 L10.4464511,11.6590319 Z"
                      id="形状"
                      fill-rule="nonzero"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span class="title">严重等级：</span>
            <span class="text" v-c-tip.auto="nowAlarm.severityName">
              {{ nowAlarm.severityName }}
            </span>
          </div>

          <div class="flex-group">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <title>切片</title>
              <g id="页面-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                <g
                  id="1.4地图首页-灾害预警"
                  transform="translate(-416.000000, -210.000000)"
                >
                  <g
                    id="1全局样式/1.2图标/20/icon_时间"
                    transform="translate(416.000000, 210.000000)"
                  >
                    <rect
                      id="20*20"
                      fill="#FFFFFF"
                      opacity="0"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    <path
                      d="M13.63,11.401 L8.624,11.401 L8.624,6.348 L10.624,6.348 L10.624,9.401 L13.63,9.401 L13.63,11.401 Z M10,4 C6.686,4 4,6.686 4,10 C4,13.314 6.686,16 10,16 C13.314,16 16,13.314 16,10 C16,6.686 13.314,4 10,4 L10,4 Z"
                      id="Fill-1"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span class="title">发布时间：</span>
            <span class="text" v-c-tip.auto="nowAlarm.pubTime">
              {{ nowAlarm.pubTime }}
            </span>
          </div>

          <div class="content">{{ nowAlarm.text }}</div>
        </div>
      </div>
      <template v-if="alarmData && alarmData.length > 1">
        <div class="footer">
          <div
            v-for="(item, ind) in alarmData"
            :key="ind"
            :class="[
              'walarmbtn',
              nowAlarm === item && 'active',
              (item.severityColor || '').toLowerCase()
            ]"
            @click="onSwitchAlarm(item)"
          >
            <i :class="['qwicon', 'qi-' + item.type]" />
          </div>
        </div>
      </template>
    </absolute-container>
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'

export default {
  name: 'WeatherWarningPop',
  components: { AbsoluteContainer },
  props: {
    alarmData: {
      type: Array,
      default: () => []
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
      nowAlarm: {
        title: null,
        typeName: null,
        severityName: null,
        pubTime: null,
        text: null
      }
    }
  },
  watch: {
    alarmData(val) {
      this.nowAlarm = val?.[0] || {}
    }
  },
  mounted() {
    this.nowAlarm = this.alarmData[0] || {}
  },
  methods: {
    // 切换指定告警
    onSwitchAlarm(item) {
      this.nowAlarm = item
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/weather-card/forewarning-info';
</style>
