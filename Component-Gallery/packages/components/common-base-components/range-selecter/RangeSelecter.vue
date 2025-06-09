<template>
  <div
    class="range-selecter"
    :style="{
      height: fitHeight ? 'fit-content' : '',
      marginBottom: noMargin ? '0' : ''
    }"
  >
    <div class="item-label range-selecter__label" v-if="!isLabelHide">{{
      label
    }}</div>
    <div :class="['range-selecter__content', disabled ? 'disabled' : '']">
      <div class="range-selecter__content-input">
        <div class="range-selecter__content-input-box">
          <div class="num_input_box">
            <span>{{ inputValue }}</span>
            <input
              :value="inputValue"
              @input="handleInput"
              @blur="handleBlur"
              :style="{
                cursor: disabled ? 'not-allowed' : 'pointer'
              }"
            />
          </div>
          <span>{{ unit }}</span>
        </div>
      </div>
      <el-slider
        ref="slider"
        v-model="localValue"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :tooltip-class="`around-analysis_tooltip slider_tooltip ${
          disabled ? 'popper-disabled' : ''
        }`"
        :format-tooltip="
          (val) => {
            return val + this.unit
          }
        "
        @change="handleChange"
      ></el-slider>
      <div class="range-selecter__content-range">
        <div v-for="item in range" :key="item">{{ item }}</div>
      </div>
    </div>
  </div>
</template>
<script>
let timer = null
export default {
  name: 'range-selecter',
  model: {
    event: 'update',
    prop: 'value'
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // slider下面的刻度
    range: {
      type: Array,
      default: () => ['0km', '5km', '10km']
    },
    // 单位
    unit: {
      type: String,
      default: 'km'
    },
    // 选择范围的最小值
    min: {
      type: Number,
      default: 0
    },
    // 选择范围的最大值
    max: {
      type: Number,
      default: 10
    },
    // 选择的步长
    step: {
      type: Number,
      default: 0.1
    },
    // 选择条左边的label
    label: {
      type: String,
      default: '分析范围'
    },
    // 是否隐藏左侧label
    isLabelHide: {
      type: Boolean,
      default: false
    },
    // 外层是否使用fit-content
    fitHeight: {
      type: Boolean,
      default: false
    },
    // 不需要底部的margin
    noMargin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: 0
    }
  },
  watch: {
    value(v) {
      this.inputValue = v
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('update', newVal)
      }
    }
  },
  mounted() {
    this.inputValue = this.value
  },
  methods: {
    handleInput(e) {
      let _v = e.target.value
      // 删除非数字和.，将多个.替换成一个.，将类似05的替换成5
      _v = _v
        .replace(/[^0-9.]/g, '')
        .replace(/\.+/g, '.')
        .replace(/^0(\d+)/g, '$1')
      if (_v < 0) {
        _v = '0'
      } else if (_v > this.max) {
        _v = `${this.max}`
      } else {
        console.log('')
      }
      // 如果有小数点，并且小数点后面的长度大于1，则将长度设置为1
      let _i = _v.indexOf('.')
      if (~_i) {
        if (Number.isInteger(this.step)) {
          // 如果是整数的话，删掉小数点部分
          _v = _v.slice(0, _i)
        } else {
          _v = _v.slice(0, _i + 2)
        }
      }
      e.target.value = _v
      this.inputValue = _v
      this.localValue = +_v
      if (+_v) {
        this.$emit('change', _v)
      }
    },
    handleBlur() {
      if (!this.inputValue) {
        this.inputValue = 0
        this.localValue = 0
      }
    },
    handleChange(val) {
      if (timer) {
        clearTimeout(timer)
        timer = ''
      }
      timer = setTimeout(() => {
        this.inputValue = val
        this.$emit('change', val)
      }, 250)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/range-selecter';
</style>
<style lang="scss">
.popper-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
