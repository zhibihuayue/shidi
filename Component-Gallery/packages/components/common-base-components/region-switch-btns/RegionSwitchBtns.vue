<template>
  <div
    class="common-iw-s"
    :class="[bemClass.container, areaTagList.length < 4 && 'small']"
  >
    <div :class="bemClass.btnBox">
      <svg fill="none" class="borderSvg" xmlns="http://www.w3.org/2000/svg">
        <rect
          width="100%"
          height="100%"
          rx="4"
          stroke-width="1"
          stroke="url(#regionSwitchBtns)"
        />
        <defs>
          <linearGradient
            id="regionSwitchBtns"
            x2="0"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="rgba(255, 235, 166, 1)" />
            <stop offset="1" stop-color="rgba(111, 97, 64, 1)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        v-for="item in areaTagList"
        :key="item.value"
        :class="selectAreaTag == item.value ? 'select' : ''"
        @click="selectArea(item.value)"
        >{{ item.name }}</span
      >
    </div>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import { getUserMemoryInfo, uptUserMemoryInfo } from './service/index.js'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'

const bem = createNameSpace('region-switch-btns')
export default {
  name: 'd-region-switch-btns',
  data() {
    return {
      selectAreaTag: -1
    }
  },
  inject: ['mapRef'],
  computed: {
    bemClass() {
      return {
        container: bem.b('container'),
        btnBox: bem.b('btnBox')
      }
    }
  },
  props: {
    memoryName: {
      typeof: String,
      required: true
    },
    defaultValue: {
      typeof: [String, Number],
      default: 2
    },
    // 筛选条件-区域列表
    areaTagList: {
      typeof: Array,
      default() {
        return [
          {
            name: '省',
            value: 0
          },
          {
            name: '市',
            value: 1
          },
          {
            name: '区',
            value: 2
          }
        ]
      }
    }
  },
  mounted() {
    this.selectAreaTag = this.defaultValue
    this._getUserMemoryInfo()
  },
  methods: {
    selectArea(v) {
      this.selectAreaTag = v
      this.$emit('change', v)
      this._uptUserMemoryInfo()
    },
    _getUserMemoryInfo() {
      getUserMemoryInfo({ memoryTypeList: [this.memoryName] }).then((res) => {
        if (res.code == '200') {
          if (res.data[0].memoryValue != undefined) {
            this.selectAreaTag = res.data[0].memoryValue
          }
        } else {
          CommonMessage.error(res.msg)
        }
        this.$emit('change', this.selectAreaTag)
      })
    },
    _uptUserMemoryInfo() {
      uptUserMemoryInfo({
        memoryType: this.memoryName,
        memoryValue: this.selectAreaTag
      }).then((res) => {
        // if (res.code == '200') {
        //   CommonMessage.success('保存成功')
        // } else {
        //   CommonMessage.error(res.msg)
        // }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/region-switch-btns';
</style>
