<template>
  <absolute-container
    :class="bemClass.container"
    :specialStyle="{
      wiseblue: {
        striped: true //条纹标题风格
      }
    }"
    title=" "
    left-title
    @close="$emit('close')"
  >
    <template v-slot:title>
      <div :class="[bemClass.header]">
        <div v-show="theme === 'ly'" class="header-icon-ly"></div>
        <ct-icon
          v-show="theme !== 'ly'"
          class="header-icon"
          name="fire-active"
        ></ct-icon>

        <el-tooltip
          :disabled="!isToolTipshow"
          :content="info.address || '-'"
          placement="top"
        >
          <h4 id="titleRef" class="header-title">{{ info.address || '-' }}</h4>
        </el-tooltip>
        <div
          v-show="iconLabel"
          class="icon-label"
          :style="{
            background: iconLabel.background
          }"
          >{{ iconLabel.label }}</div
        >
      </div>
    </template>
    <div :class="[bemClass.content]">
      <div v-for="item in contentArr" :key="item.key" :class="[bemClass.item]">
        <div :class="[bemClass.title]">{{ item.title }}</div>
        <div
          :class="[bemClass.info]"
          v-for="unit in item.info"
          :key="unit.valueKey"
        >
          <div class="info-label">{{ unit.label + ': ' }}</div>
          <div class="info-value"
            >{{ info[unit.valueKey] || '-'
            }}{{ info[unit.valueKey] ? unit.unit : '' }}</div
          >
        </div>
      </div>
    </div>
  </absolute-container>
</template>
<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '../bem/create'
import { getFireLevelInfo } from '../request/API/index'

const bem = createNameSpace('fire-level-dialog')
// 头部标签
const labels = [
  {
    level: 0,
    label: '无林地',
    background: 'linear-gradient( 90deg, #8FA7CF 0%, #6F85AA 100%)'
  },
  {
    level: 5,
    label: '五级',
    background: 'linear-gradient( 90deg, #F56C6C 0%, #DA2727 100%)'
  },
  {
    level: 4,
    label: '四级',
    background: 'linear-gradient( 135deg, #FFA43C 0%, #FF8D0B 100%)'
  },
  {
    level: 3,
    label: '三级',
    background: 'linear-gradient( 90deg, #D4B02D 0%, #BD9400 100%)'
  },
  {
    level: 2,
    label: '二级',
    background: 'linear-gradient( 90deg, #52A1E5 0%, #1F7CCC 100%)'
  },
  {
    level: 1,
    label: '一级',
    background: 'linear-gradient( 90deg, #15BD94 0%, #00A179 100%)'
  }
]
// 内容信息
const content = [
  {
    key: 'positionInfo',
    title: '位置信息',
    info: [
      {
        label: '经纬度',
        valueKey: 'lnglat',
        unit: ''
      }
    ]
  },
  {
    key: 'weatherFactor',
    title: '气象因子',
    info: [
      {
        label: '日最高气温',
        valueKey: 'temperature',
        unit: '℃'
      },
      {
        label: '连续无降水日',
        valueKey: 'noRainDays',
        unit: '日'
      },
      {
        label: '日最大风速',
        valueKey: 'windSpeed',
        unit: 'km/h'
      },
      {
        label: '日最小相对湿度',
        valueKey: 'humidity',
        unit: '%'
      }
    ]
  },
  {
    key: 'vegetationFactor',
    title: '植被因子',
    info: [
      {
        label: '森林类型',
        valueKey: 'plantsSpecies',
        unit: ''
      },
      {
        label: '森林郁闭度',
        valueKey: 'plantsDensity',
        unit: ''
      },
      {
        label: '温度植被干旱指数',
        valueKey: 'plantsDegreeOfDrought',
        unit: ''
      }
    ]
  },
  {
    key: 'groundFactor',
    title: '地形因子',
    info: [
      {
        label: '坡度',
        valueKey: 'slope',
        unit: '°'
      },
      {
        label: '坡向',
        valueKey: 'aspect',
        unit: ''
      },
      {
        label: '数字高程(海拔)',
        valueKey: 'altitude',
        unit: 'm'
      }
    ]
  }
]
export default {
  name: 'fire-level-dialog',
  components: {
    AbsoluteContainer
  },
  props: {
    // 位置信息
    position: {
      type: Array,
      default: () => []
    },
    // 主题
    theme: {
      type: String,
      default: 'ly'
    }
  },
  data() {
    return {
      info: {}, // 详情信息
      isToolTipshow: false
    }
  },
  updated() {
    this.$nextTick(() => {
      this.computedShowTooltip()
    })
  },
  computed: {
    bemClass() {
      return {
        container: bem.b(''),
        header: bem.b('header'),
        content: bem.b('content'),
        item: bem.b('item'),
        title: bem.b('title'),
        info: bem.b('info')
      }
    },
    contentArr() {
      return content
    },
    iconLabel() {
      const fireLevel = this.info?.fireLevel || '0'
      return labels.find((item) => +item.level === +fireLevel)
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      try {
        if (this.position?.length < 2) {
          return
        }
        const [longitude, latitude] = this.position
        const res = await getFireLevelInfo({ longitude, latitude })
        if (+res.code === 200) {
          this.info = {
            ...res.data,
            lnglat: `${Number(res.data.longitude).toFixed(6)},${Number(
              res.data.latitude
            ).toFixed(6)}`
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    computedShowTooltip() {
      try {
        const ref = document.querySelector('#titleRef')
        const { offsetWidth, scrollWidth } = ref
        this.isToolTipshow = offsetWidth < scrollWidth
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/fire-level-dialog';
</style>
