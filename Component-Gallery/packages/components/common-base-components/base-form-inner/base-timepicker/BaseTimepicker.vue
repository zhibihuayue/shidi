<!--
 * @Description  :
 * @Version      : V1.0.0
 * @Author       : Maws
 * @Date         : 2024-10-15 17:00:15
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-11-12 18:44:25
 * @FilePath     : BaseTimepicker.vue
 * Copyright 2024 Maws, All Rights Reserved.
 * 2024-10-15 17:00:15
-->
<template>
  <div :class="genCommonWrapper" ref="timepicker">
    <el-time-picker
      ref="TimePicker"
      v-model="searchTime"
      v-bind="$attrs"
      :is-range="isRange"
      :placeholder="placeholder"
      class="c-date-editor"
      :prefix-icon="`${prefixIcon}`"
      :popper-class="`common-iw-s c-date-editor-picker picker-popper it-popper common-base-time-picker ${selfClass}`"
      @change="searchTimeChange"
      @focus="searchTimeFocus"
      @blur="blur"
      :append-to-body="appendBody"
      :format="format"
      :readonly="readonlyBak"
      :value-format="format"
    >
    </el-time-picker
  ></div>
</template>

<script>
import dayjs from 'dayjs'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('common-base')
export default {
  name: 'base-timepicker',
  model: {
    prop: 'value',
    event: 'toSearchTime'
  },
  // 定义props属性
  props: {
    // 定义value属性，类型为String或Array，默认为空字符串
    value: {
      type: [String, Array],
      default: ''
    },
    // 定义selfClass属性，类型为String，默认为空字符串
    selfClass: {
      type: String,
      default: ''
    },
    // 定义isRange属性，类型为Boolean，默认为false
    isRange: {
      type: Boolean,
      default: false
    },
    // 定义defaultArrValue属性，类型为Array，默认为['', '']
    defaultArrValue: {
      type: Array,
      default: () => ['', '']
    },
    // 定义defaultStrValue属性，类型为Date
    defaultStrValue: {
      type: Date
    },
    // 定义prefixIcon属性，类型为String，默认为空字符串
    prefixIcon: {
      type: String,
      default: ''
    },
    // 定义placeholder属性，类型为String，默认为'请选择'
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 定义appendBody属性，类型为Boolean，默认为true
    appendBody: {
      type: Boolean,
      default: true
    },
    // 定义format属性，类型为String，默认为'HH:mm:ss'
    format: {
      type: String,
      default: 'HH:mm:ss'
    }
  },
  data() {
    return {
      searchTime: null,
      readonlyBak: false
    }
  },
  computed: {
    genCommonWrapper() {
      return {
        [bem.b('time-picker')]: true
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log('🚀 ~ handler ~ val:', val)
        if (val) {
          this.searchTime = val
        } else {
          this.searchTime = null
        }
      }
    }
  },
  methods: {
    // 处理时间选择器的失焦事件
    blur(e) {
      // 设置readonlyBak为true，表示时间选择器正在失焦
      this.readonlyBak = true
      // 使用setTimeout延迟100毫秒执行以下代码
      setTimeout(() => {
        // 设置readonlyBak为false，表示时间选择器已失焦
        this.readonlyBak = false
        // 如果TimePicker组件存在，则调用其blur方法
        this.$refs.TimePicker && this.$refs.TimePicker.blur()
        // 如果TimePicker组件存在且其选择器可见，则调用其handleClose方法
        this.$refs.TimePicker && this.$refs.TimePicker.handleClose()
      }, 100)
      // 发射blur事件，传递事件对象e
      this.$emit('blur', e)
    },
    // 处理时间选择器的聚焦事件
    searchTimeFocus() {
      // 打印当前时间选择器的值、当前时间、当前时间的格式化字符串
      console.log('🚀 ~ searchTimeFocus ~ this.searchTime:', this.searchTime, dayjs(), dayjs().format('HH:mm:ss'))
      // 如果时间选择器的值为空或为null，则根据是否为范围选择器设置默认值
      if (this.searchTime === null || this.searchTime.length === 0) {
        this.searchTime = this.isRange
          ? [
              // 如果为范围选择器，则设置为当前时间前一小时到当前时间的范围
              dayjs().subtract(1, 'hour').format('HH:mm:ss'),
              dayjs().format('HH:mm:ss')
            ]
          : // 如果不是范围选择器，则设置为当前时间的格式化字符串
            dayjs().format('HH:mm:ss')
      }
      // 发射toSearchTime事件，传递当前时间选择器的值
      this.$emit('toSearchTime', this.searchTime)
    },
    // 处理时间选择器的值变化事件
    searchTimeChange(val) {
      // 打印时间选择器的值变化事件，传递新的值
      console.log('🚀 ~ searchTimeChange ~ val:', val)
      // 更新时间选择器的值为新的值
      this.searchTime = val
      // 发射toSearchTime事件，传递更新后的时间选择器的值
      this.$emit('toSearchTime', this.searchTime)
    },
    // 处理时间选择器外部点击事件
    onClickOutside(event) {
      // 获取时间选择器的DOM元素
      const datePicker = this.$refs.TimePicker.$el
      // 如果点击事件的目标元素不在时间选择器的DOM元素内，并且时间选择器的选择器可见
      if (!datePicker.contains(event.target) && this.$refs.TimePicker.pickerVisible) {
        // 则设置时间选择器的选择器为不可见
        this.$refs.TimePicker.pickerVisible = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.onClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClickOutside)
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-form/base-timepicker';
</style>
<style lang="scss">
// 通用换肤
[data-theme='theme-wiseblue'] .common-base-time-picker {
  --base-time-picker__text-color: #e8f3fe;
  --base-time-picker__text-disable-color: rgba(232, 243, 254, 0.4);
  --base-time-picker__bg-color: rgba(23, 37, 55, 1);
}

// 林业换肤
[data-theme='theme-aquamarine'] .common-base-time-picker {
  --base-time-picker__text-color: #fff;
  --base-time-picker__text-disable-color: rgba(255, 255, 255, 0.4);
  --base-time-picker__bg-color: linear-gradient(
    180deg,
    rgba(0, 67, 63, 0.85) 0%,
    rgba(0, 19, 30, 0.74) 21%,
    #00131e 100%
  );
}

// 国土换肤
[data-theme='theme-terracotta'] .common-base-time-picker {
  --base-time-picker__text-color: #e4e7c1;
  --base-time-picker__text-disable-color: rgba(255, 238, 177, 0.4);
  --base-time-picker__bg-color: rgba(23, 20, 11, 0.9);
}
body {
  .common-base-time-picker {
    .iconfont {
      font-size: 0.2rem !important;
      &.el-range__icon {
        width: 0.2rem;
        margin-right: 0.12rem !important;
      }
    }
    &:not(.el-popper) {
      height: 0.32rem !important;
    }
    .c-date-editor .el-range-input {
      flex: 1;
      text-align: left;
      padding: 0 !important;
    }
    .c-date-editor.el-date-editor .el-range-separator {
      margin: 0 0.12rem !important;
    }
    &.c-date-editor-picker.el-picker-panel,
    &.c-date-editor-picker.el-time-panel {
      // position: absolute !important;
      // top: 0.32rem !important;
      // left: 0 !important;
      overflow: visible !important;
      background: var(--base-time-picker__bg-color) !important;
      color: var(--base-time-picker__text-color) !important;
      .el-time-panel__content {
        &::before {
          height: 32px !important;
        }
        .el-time-spinner__item {
          height: 32px !important;
          font-size: 12px !important;
          line-height: 32px !important;
          &.disabled {
            color: var(--base-time-picker__text-disable-color);
          }
        }
      }
      .common-base-time-picker {
        .el-date-editor {
          ::v-deep .el-input__prefix {
            .iconfont {
              font-size: 0.2rem;
            }
          }
        }
      }
    }
  }
}
</style>
