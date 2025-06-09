<template>
  <div v-show="value" class="base-area-popup-container">
    <div v-for="(subitem, level) in expanded" :key="level" class="base-area-popup-wrapper expand">
      <el-scrollbar style="flex: 1">
        <div class="base-area-popup-data">
          <div
            v-for="item in subitem?.list ? subitem.list : data"
            :key="item.code + item.name"
            class="base-area-popup-row"
            :class="{
              active:
                expanded.find((expandItem) => expandItem.code === item.code && expandItem.name === item.name) ||
                (item.code === nowSelected.code && item.name === nowSelected.name)
            }"
            @click="onSelected(item, 1 + level)"
          >
            <span class="base-area-popup-row-title" v-c-tip.auto="item.name">
              {{ item.name }}
            </span>
            <div
              v-if="item.list && item.list.length > 0"
              class="base-area-popup-data-expand-btn"
              @click.stop="onExpand(item, 1 + level)"
            >
              <em class="iconfont_tools icon-linye_icon_xiala base-area-popup-data-expand-icon" />
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="base-area-popup-bottom" v-if="level === 0 && canSetDefault">
        <button type="button" class="cg-button cg-button--default" @click="onDefault">
          <span>恢复默认</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ElScrollbar from 'element-ui/lib/scrollbar'

export default {
  name: 'BaseAreaPopup',
  props: {
    componentKey: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    canSetDefault: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => []
    },
    defaultArea: {
      type: Object,
      default: () => ({})
    }
  },
  components: { ElScrollbar },
  data() {
    return {
      nowSelected: {
        code: '',
        name: ''
      },
      expanded: [{}] // 已经展开节点的数组，每一个元素代表一层
    }
  },
  watch: {
    data: {
      handler(val) {
        console.log('🚀 ~ val:', val)
        if (val.length) {
          this.setData(this.nowSelected)
        }
      },
      deep: true
    }
  },
  methods: {
    // 设置选择地区
    setData(data = {}) {
      // 初始化展开的节点数组
      this.expanded = [{}]
      // 更新当前选中的地区信息
      this.nowSelected = data
      // 解构传入的数据，获取省、市、县、镇的代码
      const { provinceCode, cityCode, countyCode, townCode } = data
      // 如果省代码不存在，则直接返回
      if (!provinceCode) {
        return
      }
      // 根据省代码从数据中找到对应的省信息
      const provinceInfo = this.data.find((item) => provinceCode === item.code)
      // 如果市代码不存在或省信息不存在，则直接返回
      if (!(cityCode && provinceInfo)) {
        // 如果省信息存在，则调用选中方法
        this.onSelected(provinceInfo ? provinceInfo : data)
        return
      }
      // 将省信息添加到展开的节点数组中
      this.expanded.push(provinceInfo)
      // 根据市代码从省信息的列表中找到对应的市信息
      const cityInfo = provinceInfo.list.find((item) => cityCode === item.code)
      // 如果县代码不存在或市信息不存在，则直接返回
      if (!(countyCode && cityInfo)) {
        // 如果市信息存在，则调用选中方法
        cityInfo && this.onSelected(cityInfo)
        return
      }
      // 将市信息添加到展开的节点数组中
      this.expanded.push(cityInfo)
      // 根据县代码从市信息的列表中找到对应的县信息
      const countyInfo = cityInfo.list.find((item) => countyCode === item.code)
      // 如果镇代码不存在或县信息不存在，则直接返回
      if (!(townCode && countyInfo)) {
        // 如果县信息存在，则调用选中方法
        countyInfo && this.onSelected(countyInfo)
        return
      }
      // 根据镇代码从县信息的列表中找到对应的镇信息
      const adInfo = countyInfo.list.find((item) => townCode === item.code)
      // 如果镇信息存在，则调用选中方法
      adInfo && this.onSelected(adInfo)
    },
    // 恢复默认
    onDefault() {
      // 初始化展开的节点数组
      this.expanded = [{}]
      // 清空当前选中的地区信息
      this.nowSelected = {}
      // 发射事件，通知外部当前值已更改为false
      this.$emit('change', false)
      // 发射事件，通知外部恢复默认
      this.$emit([this.componentKey, 'reset'].filter((item) => !!item).join('-'))
      // 调用setData方法，设置默认地区
      this.setData(this.defaultArea)
    },
    // 选中了某项
    onSelected(item, level) {
      // 如果展开的节点数组的长度大于或等于当前级别加1，则需要移除这些级别的节点
      if (this.expanded.length >= level + 1) {
        // 移除从当前级别开始的所有节点
        this.expanded = this.expanded.slice(0, level)
      }
      // 更新当前选中的地区信息
      this.nowSelected = item
      // 发射事件，通知外部当前值已更改为false
      this.$emit('change', false)
      // 发射事件，通知外部选中了某个地区
      this.$emit([this.componentKey, 'select'].filter((info) => !!info).join('-'), item)
    },
    // 展开下一层级
    onExpand(item, level) {
      // 如果展开的节点数组的长度大于或等于当前级别加1，则需要移除这些级别的节点
      if (this.expanded.length >= level + 1) {
        // 移除从当前级别开始的所有节点
        this.expanded = this.expanded.slice(0, level)
      }
      // 将当前项添加到展开的节点数组中
      this.expanded.push(item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-area-popup';
</style>
