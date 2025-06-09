<!--
 * @Description  :
 * @Version      : V1.0.0
 * @Author       : Maws
 * @Date         : 2024-10-15 09:51:09
 * @LastEditors  : Maws
 * @LastEditTime : 2025-01-07 11:39:32
 * @FilePath     : BaseDatepicker.vue
 * Copyright 2024 Maws, All Rights Reserved.
 * 2024-10-15 09:51:09
-->
<template>
  <div :class="genCommonWrapper" ref="datepicker" class="common-iw-s">
    <el-date-picker
      ref="elDatepicker"
      v-model="searchTime"
      :type="type"
      v-bind="$attrs"
      size="small"
      prefix-icon="iconfont_tools icon-tongyong-shaixuanriqi"
      :class="`${clearable ? '' : 'noClear'}`"
      :popper-class="`common-iw-s common-base-date-picker picker-popper it-popper ${selfClass} `"
      :placeholder="placeholder"
      :picker-options="searchTimePickerOptions"
      @change="searchTimeChange"
      @focus="searchTimeFocus"
      :append-to-body="appendBody"
      :editable="false"
      :clearable="clearable"
      :key="type"
    >
    </el-date-picker>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { createNameSpace } from '@component-gallery/utils/bem/create'
import { isEmpty } from 'lodash-es'

const bem = createNameSpace('common-base')
export default {
  name: 'base-datepicker',
  model: {
    prop: 'value',
    event: 'toSearchTime'
  },
  components: {},
  props: {
    // 是否可以选择所有日期
    canSelectAll: {
      type: Boolean,
      default: false
    },
    // 传入的值，可以是字符串或数组
    value: {
      type: [String, Array],
      default: ''
    },
    // 快捷选项，包含文本和天数
    shortcuts: {
      type: Array,
      default: () => [
        { text: '今日', days: 1 },
        { text: '近3天', days: 3 },
        { text: '近7天', days: 7 },
        { text: '近30天', days: 30 }
      ]
    },
    // 最大选择范围
    maxRange: {
      type: Number,
      default: 365
    },
    // 自定义类名
    selfClass: {
      type: String,
      default: ''
    },
    // 日期格式
    format: {
      type: String,
      default: ''
    },
    // 输入框提示
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 禁用日期的函数
    disabledDate: {
      type: String,
      default: ''
    },
    // 是否将弹出框插入body
    appendBody: {
      type: Boolean,
      default: true
    },
    // 是否可以清除
    clearable: {
      type: Boolean,
      default: false
    },
    // 其他选项
    options: {
      type: Object,
      default: () => ({})
    },
    // 日期选择器类型
    type: {
      type: String,
      default: 'year'
    }
  },
  data() {
    return {
      valueFormat: '', // 值的格式
      searchTime: ['year', 'month', 'date', 'datetime'].includes(this.type) ? '' : [], //查询时间
      yearStr: '', //当前时间-年（“YYYY”）
      monthStr: '', //当前时间-月（“YYYY-MM”）
      dateStr: '', //当前时间-日（“YYYY-MM-DD”）
      yearSearchTime: '',
      monthSearchTime: '',
      dateSearchTime: '',
      otherSearchTime: [],
      selectedShortcut: '', // 当前选中的快捷选项
      selectDate: '', // 当前选中的日期
      searchTimePickerOptions: {} // 查询时间选择器的选项
    }
  },
  created() {
    this.getSetFormat()
  },
  computed: {
    // 生成通用包装器
    genCommonWrapper() {
      return {
        // 使用bem生成日期选择器的类名
        [bem.b('date-picker')]: true
      }
    },
    // 其他搜索时间选择器选项
    otherSearchTimePickerOptions() {
      return {
        // 快捷方式选项
        shortcuts: this.shortcuts.map((shortcut) => ({
          // 快捷方式的文本
          text: shortcut.text,
          // 点击快捷方式时的回调函数
          onClick: (picker) => this.handleShortcutClick(picker, shortcut)
        })),
        // 选择日期时的回调函数
        onPick: ({ maxDate, minDate }) => {
          // 设置选中的日期为最小日期的时间戳
          this.selectDate = minDate.getTime()
          // 如果有最大日期，则清空选中的日期
          if (maxDate) {
            this.selectDate = ''
          }
        },
        // 禁用日期的函数
        disabledDate: (time) => {
          // 如果可以选择所有日期，则返回false
          if (this.canSelectAll) {
            return false
          }

          // 如果已经选中日期
          if (this.selectDate !== '') {
            // 计算最大范围内的最小时间
            const one = 3600000 * 24 * (this.maxRange - 1)
            const minTime = this.selectDate - one
            // 计算最大范围内的最大时间
            const maxTime = this.selectDate + one
            // 获取当前时间的时间戳
            let day = time.getTime()
            // 返回当前时间是否在禁用范围内
            return day < minTime || day > maxTime || day > Date.now()
          } else {
            // 如果没有选中日期，则返回当前时间是否大于现在
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  watch: {
    value(newVal) {
      console.log('🚀 ~ value ~ newVal:', newVal)
      this.searchTime = newVal
    }
  },
  methods: {
    // 更新激活的快捷方式
    updateActiveShortcut() {
      // 如果searchTime不是数组，则返回
      if (!Array.isArray(this.searchTime)) {
        return
      }
      // 初始化selectedShortcut为空
      this.selectedShortcut = ''
      // 在下一个tick中执行
      this.$nextTick(() => {
        // 获取当前日期
        const end = dayjs().subtract(0, 'days').format('YYYY-MM-DD')
        // 获取3天前的日期
        const threeDay = dayjs().subtract(2, 'days').format('YYYY-MM-DD')
        // 获取6天前的日期
        const sixDay = dayjs().subtract(6, 'days').format('YYYY-MM-DD')
        // 获取30天前的日期
        const thirtyDay = dayjs().subtract(29, 'days').format('YYYY-MM-DD')
        // 如果结束日期是当前日期
        if (this.searchTime[1] === end) {
          // 如果开始日期是当前日期，则设置selectedShortcut为'今日'
          if (this.searchTime[0] === end) {
            this.selectedShortcut = '今日'
          }
          // 如果开始日期是3天前，则设置selectedShortcut为'近3天'
          else if (this.searchTime[0] === threeDay) {
            this.selectedShortcut = '近3天'
          }
          // 如果开始日期是6天前，则设置selectedShortcut为'近7天'
          else if (this.searchTime[0] === sixDay) {
            this.selectedShortcut = '近7天'
          }
          // 如果开始日期是30天前，则设置selectedShortcut为'近30天'
          else if (this.searchTime[0] === thirtyDay) {
            this.selectedShortcut = '近30天'
          }
          // 如果不符合任何快捷方式，则打印'非快捷选项范围'
          else {
            console.log('非快捷选项范围')
          }
        }
        // 获取所有快捷方式的DOM元素
        const shortcuts = document.querySelectorAll('.picker-popper .el-picker-panel__shortcut')
        // 遍历快捷方式，根据是否是当前激活的快捷方式来添加或移除激活类
        shortcuts.forEach((shortcut) => {
          shortcut.classList.toggle('picker_active', shortcut.innerText === this.selectedShortcut)
        })
      })
    },
    // 处理快捷方式的点击事件
    handleShortcutClick(picker, shortcut) {
      // 设置当前激活的快捷方式
      this.selectedShortcut = shortcut.text
      // 获取当前日期
      const end = new Date()
      // 获取开始日期
      const start = new Date()
      // 根据激活的快捷方式设置开始日期
      if (this.selectedShortcut === '今日') {
        start.setTime(start.getTime())
      } else if (this.selectedShortcut === '近3天') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
      } else if (this.selectedShortcut === '近7天') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
      } else {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
      }
      // 发射pick事件
      picker.$emit('pick', [start, end])
      // 更新激活的快捷方式
      this.$nextTick(this.updateActiveShortcut)
    },
    // 获取并设置格式
    getSetFormat() {
      // 定义格式策略
      const formatStrategies = {
        year: 'YYYY',
        month: 'YYYY-MM',
        date: 'YYYY-MM-DD',
        datetime: 'YYYY-MM-DD HH:mm:ss',
        daterange: 'YYYY-MM-DD',
        datetimerange: 'YYYY-MM-DD HH:mm:ss',
        default: 'YYYY-MM-DD'
      }
      // 根据 type 选择对应的 valueFormat, 优先取传入的format
      this.valueFormat = this.format || formatStrategies[this.type] || formatStrategies.default
    },
    /**
     * 选定日期触发
     */
    searchTimeChange(val) {
      // 根据type格式化日期
      this.dateFormate(this.type, val)
    },
    /**
     * 选定日期处理
     */
    dateFormate(type, val) {
      // 检查val是否为null
      const isNull = Object.prototype.toString.call(val).toLowerCase() === '[object null]'
      // 检查val是否为undefined
      const isUndefined = Object.prototype.toString.call(val).toLowerCase() === '[object undefined]'
      // 如果val不是null或undefined
      if (!isNull && !isUndefined) {
        // 如果val是数组
        if (Array.isArray(val)) {
          console.log('数组')
          // 格式化数组中的日期
          this.searchTime = [
            dayjs(val[0]).startOf(type).format(this.valueFormat),
            dayjs(val[1]).startOf(type).format(this.valueFormat)
          ]
        } else {
          console.log('字符串')
          // 格式化字符串日期
          this.searchTime = dayjs(val).startOf(type).format(this.valueFormat)
        }
      } else {
        // 如果val是null或undefined，则根据type设置searchTime
        this.searchTime = this.type.indexOf('range') > 0 ? ['', ''] : ''
      }
      console.log('🚀 ~ dateFormate ~ this.searchTime:', this.searchTime)
      // 发射toSearchTime事件
      this.$emit('toSearchTime', this.searchTime)
    },
    /**
     * 聚焦初始化
     */
    searchTimeFocus() {
      let that = this
      // 如果disabledDate为'future'
      if (this.disabledDate === 'future') {
        // 设置searchTimePickerOptions为禁用未来日期
        that.searchTimePickerOptions = {
          disabledDate: (time) => {
            return time.getTime() > Date.now()
          }
        }
        return
      }
      // 如果disabledDate为'history'
      if (this.disabledDate === 'history') {
        // 设置searchTimePickerOptions为禁用历史日期
        that.searchTimePickerOptions = {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
        }
        return
      }
      // 如果options不是空
      if (!isEmpty(this.options)) {
        // 设置searchTimePickerOptions为options
        that.searchTimePickerOptions = this.options
        return
      }
      // 如果有快捷方式并且type为'daterange'
      if (this.shortcuts.length > 0 && this.type === 'daterange') {
        // 设置searchTimePickerOptions为otherSearchTimePickerOptions
        that.searchTimePickerOptions = this.otherSearchTimePickerOptions
        // 更新激活的快捷方式
        this.$nextTick(this.updateActiveShortcut)
      }
    },

    onClickOutside(event) {
      // 获取datePicker的DOM元素
      const datePicker = this.$refs.elDatepicker.$el
      // 如果点击的目标不是datePicker，并且datePicker的pickerVisible为true，则设置pickerVisible为false
      if (!datePicker.contains(event.target) && this.$refs.elDatepicker.pickerVisible) {
        this.$refs.elDatepicker.pickerVisible = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.onClickOutside)
    this.searchTime = this.value
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClickOutside)
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-form/base-datepicker';
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-wiseblue'] body {
  .common-base-date-picker {
    --common-base-data-picker__placeholder-color: rgba(232, 243, 254, 0.6);
    --common-base-data-picker__bg: rgba(79, 159, 255, 0.2);
    --common-base-data-picker__border-bottom-color: rgba(255, 255, 255, 0.2);
  }
}

[data-theme='theme-aquamarine'] body {
  .common-base-date-picker {
    --common-base-data-picker__placeholder-color: rgba(255, 255, 255, 0.6);
    --common-base-data-picker__bg: rgba(2, 137, 109, 0.2);
    --common-base-data-picker__border-bottom-color: rgba(255, 255, 255, 0.2);
  }
}

[data-theme='theme-terracotta'] body {
  .common-base-date-picker {
    --common-base-data-picker__placeholder-color: rgba(228, 231, 193, 0.6);
    --common-base-data-picker__bg: rgba(100, 86, 46, 0.2);
    --common-base-data-picker__border-bottom-color: rgba(228, 231, 193, 0.2);
  }
}

.common-iw-s .common-base-date-picker .el-date-editor i.iconfont_tools.icon-tongyong-shaixuanriqi::before {
  margin-left: 0;
}

.common-iw-s.common-base-date-picker.el-date-picker.el-picker-panel.el-popper[x-placement^='bottom'] {
  width: 2.48rem !important;

  .el-date-picker__time-header {
    border-bottom: 0.01rem solid var(--common-base-data-picker__border-bottom-color) !important;
  }
}

body {
  .common-base-date-picker {
    display: flex;
    flex-flow: column;
    &.el-popper[x-placement^='top'] {
      margin-bottom: 0.06rem;
    }
    &:not(.picker-popper) {
      height: 0.32rem !important;
    }

    .el-input__prefix {
      left: 0.12rem;
    }

    .el-date-editor {
      flex: 1;
      width: 100%;

      .el-range-separator {
        height: 0.32rem !important;
        line-height: 0.32rem !important;
        width: auto !important;
      }

      .el-range-input::placeholder {
        color: var(--common-base-data-picker__placeholder-color) !important;
      }

      .el-range-input {
        padding-top: 0.005rem;
      }
      i.iconfont_tools.icon-tongyong-shaixuanriqi {
        line-height: 0.32rem;
        display: flex;
        align-items: center;
      }
    }

    .el-date-editor .el-input__inner {
      padding: 0 0.12rem 0 0.42rem !important;
    }

    .c-date-editor.el-date-editor {
      position: relative;

      .el-picker-panel {
        // position: absolute !important;
        // top: 0.32rem !important;
        // left: 0 !important;
        overflow: visible !important;

        .el-icon-arrow-right {
          color: transparent !important;
        }

        .el-picker-panel__body {
          .el-date-range-picker__editor,
          .el-date-picker__time-header {
            .el-input__inner {
              flex: 1;
              font-size: 0.14rem !important;
              padding: 0 0.12rem !important;
              height: 0.32rem !important;
              line-height: 0.32rem !important;
              border-radius: 0.04rem !important;
              background: var(--common-base-data-picker__bg) !important;
            }
          }
        }
      }
    }

    .noClear .el-range__close-icon {
      display: none;
    }

    .el-input__icon.el-range__close-icon {
      display: flex;
      width: 0.25rem;

      &.el-icon-circle-close::before {
        width: 100%;
        height: 100%;
        display: block !important;
      }
    }
    .el-time-spinner__item {
      height: 32px !important;
      line-height: 32px;
      font-size: 14px;
    }
    .el-time-panel__content::after,
    .el-time-panel__content::before {
      height: 32px;
    }
    .el-date-range-picker__editor {
      font-size: 0.14rem;
    }
  }

  .c-date-editor.el-date-editor .el-picker-panel .el-picker-panel__body {
    .el-date-range-picker__time-header,
    .el-date-picker__time-header {
      border-bottom: 0.01rem solid var(--common-base-data-picker__border-bottom-color) !important;
    }
  }
}
</style>
