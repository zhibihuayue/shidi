<template>
  <!-- 筛选框 -->
  <div v-show="show" class="filterBox">
    <div class="filterTitle">设备状态</div>
    <div class="btnList">
      <div
        v-for="(item, index) in statusOptions"
        :key="item.code"
        class="typeBtn"
        :class="{ choosed: item.active }"
        @click="onStatusChange(item, index)"
        >{{ item.name }}
      </div>
    </div>
    <div class="tj_footer_btns">
      <button
        type="button"
        class="cg-button cg-button--primary"
        @click="cameraTypeSearch()"
      >
        <strong></strong>
        <span>确定</span>
        <strong></strong>
      </button>
      <button
        type="button"
        class="cg-button cg-button--default"
        @click="resetChoose()"
      >
        <span>重置</span>
      </button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'

export default {
  name: 'FilterBox',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 状态列表
      statusOptions: [
        { code: 'all', name: '全部', active: true },
        { code: 'online', name: '在线', active: false },
        { code: 'offline', name: '离线', active: false }
      ],
      typeLists: [],
      choosedIndex: 0, // 选中全部类型
      chooseType: ['all'], // 选择的状态
      typeThemArr: [],
      resetAble: true // 是否需要重置筛选数据
    }
  },
  methods: {
    othersInActive(list) {
      const _list = cloneDeep(list)
      const others = _list.slice(1)
      // 检查所有其他元素是否都是 active: false
      return others.every((item) => item.active === true)
    },

    onStatusChange(data, index) {
      if (index === 0) {
        data.active = true
        this.chooseType = ['all']
        this.statusOptions.forEach((item, i) => {
          item.active = i === 0
        })
      } else {
        data.active = !data.active
        if (this.othersInActive(this.statusOptions)) {
          this.statusOptions.forEach((item, i) => {
            item.active = i === 0
          })
        } else {
          this.statusOptions[0].active = false
        }
      }

      this.chooseType = []
      this.statusOptions.forEach((item) => {
        if (item.active) {
          this.chooseType.push(item.code)
        }
      })

      this.$emit('chooseType', this.chooseType)
    },

    selectType() {
      console.log(1)
    },
    // 摄像机确认筛选
    cameraTypeSearch() {
      this.$emit('hideFilter', false)
      this.resetAble = false
    },
    // 重置筛选数据
    resetChoose() {
      this.resetAble = false
      this.selectAllType()
      this.chooseType = ['all']
    },
    // 选择所有类型
    selectAllType() {
      this.choosedIndex = 0
      this.typeThemArr = []
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/tree';
</style>
