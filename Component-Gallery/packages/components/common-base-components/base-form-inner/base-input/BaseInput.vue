<template>
  <div
    :class="[bem.root, 'common-iw-s']"
    @keydown.enter="keydownEnter"
    @keydown="keydown"
    @keyup="keyup"
    @keydown.delete="keydownDelete"
    @keydown.tab="keydownTab"
    @keydown.backspace="keydownBackspace"
  >
    <el-input
      :class="[bem.control]"
      v-model="innerValue"
      :type="type"
      :maxlength="maxlength"
      :minlength="minlength"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      :size="size"
      :rows="rows"
      :autosize="autosize"
      :autocomplete="autocomplete"
      :name="name"
      :readonly="readonly"
      :max="max"
      :min="min"
      :step="step"
      :resize="resize"
      :autofocus="autofocus"
      :form="form"
      :label="label"
      :tabindex="tabindex"
      :validate-event="validateEvent"
      :show-word-limit="showWordLimit"
      :show-password="showPassword"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="handleChange"
      @clear="handleClear"
    >
      <template #suffix>
        <span class="base-input-icon-text" v-if="unit !== '' && unit">{{ unit }}</span>
        <slot name="suffix"></slot>
      </template>
      <template #prepend>
        <slot name="prepend"></slot>
      </template>
      <template #append>
        <slot name="append"></slot>
      </template>
    </el-input>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('base-input')
export default {
  name: 'base-input',
  props: {
    // 定义unit属性，类型为String，默认为空字符串
    unit: {
      type: String,
      default: ''
    },
    // 定义width属性，类型为String，默认为'100%'
    width: {
      type: String,
      default: '100%'
    },
    // 定义height属性，类型为String，默认为'32'
    height: {
      type: String,
      default: '32'
    },
    // 定义value属性，类型为String，默认为空字符串
    value: {
      type: String,
      default: ''
    },
    // 定义inputType属性，类型为String，默认为'normal'
    inputType: {
      type: String,
      default: 'normal'
    },
    // 定义type属性，类型为String，默认为'text'
    type: {
      type: String,
      default: 'text'
    },
    // 定义maxlength属性，类型为Number，默认为null
    maxlength: {
      type: Number,
      default: null
    },
    // 定义minlength属性，类型为Number，默认为null
    minlength: {
      type: Number,
      default: null
    },
    // 定义showWordLimit属性，类型为Boolean，默认为false
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 定义clearable属性，类型为Boolean，默认为false
    clearable: {
      type: Boolean,
      default: false
    },
    // 定义placeholder属性，类型为String，默认为null
    placeholder: {
      type: String,
      default: null
    },
    // 定义showPassword属性，类型为Boolean，默认为false
    showPassword: {
      type: Boolean,
      default: false
    },
    // 定义disabled属性，类型为Boolean，默认为false
    disabled: {
      type: Boolean,
      default: false
    },
    // 定义size属性，类型为String，默认为null
    size: {
      type: String,
      default: null //medium / small / mini
    },
    // 定义prefixIcon属性，类型为String，默认为null
    prefixIcon: {
      type: String,
      default: null
    },
    // 定义suffixIcon属性，类型为String，默认为null
    suffixIcon: {
      type: String,
      default: null
    },
    // 定义rows属性，类型为Number，默认为2
    rows: {
      type: Number,
      default: 2
    },
    // 定义autosize属性，类型为[Boolean, Object]，默认为false
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    // 定义autocomplete属性，类型为String，默认为'off'
    autocomplete: {
      type: String,
      default: 'off'
    },
    // 定义name属性，类型为String，默认为null
    name: {
      type: String,
      default: null
    },
    // 定义readonly属性，类型为Boolean，默认为false
    readonly: {
      type: Boolean,
      default: false
    },
    // 定义max属性，类型为多种可能，包括String, Number, Boolean, Array, Object, Date, Function, Symbol，默认为null
    max: {
      type: [String, Number, Boolean, Array, Object, Date, Function, Symbol],
      default: null
    },
    // 定义min属性，类型为多种可能，包括String, Number, Boolean, Array, Object, Date, Function, Symbol，默认为false
    min: {
      type: [String, Number, Boolean, Array, Object, Date, Function, Symbol],
      default: false
    },
    // 定义step属性，类型为多种可能，包括String, Number, Boolean, Array, Object, Date, Function, Symbol，默认为false
    step: {
      type: [String, Number, Boolean, Array, Object, Date, Function, Symbol],
      default: false
    },
    // 定义resize属性，类型为String，默认为null
    resize: {
      type: String, //none, both, horizontal, vertical
      default: null
    },
    // 定义autofocus属性，类型为Boolean，默认为false
    autofocus: {
      type: Boolean,
      default: false
    },
    // 定义form属性，类型为String，默认为null
    form: {
      type: String,
      default: null
    },
    // 定义label属性，类型为String，默认为null
    label: {
      type: String,
      default: null
    },
    // 定义tabindex属性，类型为String，默认为null
    tabindex: {
      type: String,
      default: null
    },
    // 定义validateEvent属性，类型为Boolean，默认为true
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 返回一个对象，包含了组件的数据
    return {
      // 初始化innerValue为传入的value
      innerValue: this.value,
      // 定义检查规则数组
      inspectionRules: [
        {
          // 规则名称为'normal'
          name: 'normal',
          // 正则表达式，匹配任何非空白字符
          rules: /^(?!\s)[^\s]*$/
        },
        {
          // 规则名称为'onlyInt'
          name: 'onlyInt',
          // 正则表达式，匹配任何整数
          rules: /^[+-]?\d*$/
        },
        {
          // 规则名称为'onlyFloat'
          name: 'onlyFloat',
          // 正则表达式，匹配任何浮点数
          rules: /^[+-]?\d*\.?\d*$/
        }
      ],
      // 标志是否为第一次输入
      isFirst: true,
      // 初始化oldValue为传入的value，如果value为空，则为''
      oldValue: this.value || ''
    }
  },
  watch: {
    // 监听value的变化
    value: {
      handler(newValue) {
        // console.log(213, newValue) // 打印value的变化
        this.innerValue = newValue // 更新innerValue为新的value
      },
      deep: true // 深度监听，用于检测对象或数组的变化
    },
    // 监听innerValue的变化
    innerValue: {
      handler(newValue, oldValue) {
        // 检查新值是否有效
        if (!this.validate(newValue)) {
          // console.log(71, oldValue) // 打印旧值
          // 如果新值无效，重置为旧值
          this.$nextTick(() => {
            // 如果新值不为空，则重置为旧值
            if (newValue) {
              this.innerValue = oldValue
            } else {
              // 如果新值为空，则发出空字符串的input事件
              this.$emit('input', '')
            }
          })
        } else {
          // 如果新值有效，则更新innerValue和oldValue
          this.innerValue = this.value
          this.oldValue = this.value
          // console.log(232, newValue) // 打印新值
          // 发出input事件，更新绑定的值
          this.$emit('input', this.value)
        }
      },
      deep: true // 深度监听，用于检测对象或数组的变化
    }
  },
  computed: {
    bem() {
      return {
        root: bem.b(''),
        control: bem.e('control')
      }
    }
  },
  methods: {
    // 发出keydown-enter事件
    keydownEnter(e) {
      this.$emit('keydown-enter', e)
    },
    // 发出keydown事件
    keydown(e) {
      this.$emit('keydown', e)
    },
    // 发出keyup事件
    keyup(e) {
      this.$emit('keyup', e)
    },
    // 发出keydown-delete事件
    keydownDelete(e) {
      this.$emit('keydown-delete', e)
    },
    // 发出keydown-tab事件
    keydownTab(e) {
      this.$emit('keydown-tab', e)
    },
    // 发出keydown-backspace事件
    keydownBackspace(e) {
      this.$emit('keydown-backspace', e)
    },
    // 处理输入事件
    handleInput(newValue) {
      // 自定义校验逻辑
      if (this.validate(newValue)) {
        this.$emit('input', newValue)
      } else {
        // 如果新值有效，则更新绑定的值
      }
    },
    // 发出blur事件
    handleBlur(e) {
      this.$emit('blur', e)
    },
    // 发出focus事件
    handleFocus(e) {
      this.$emit('focus', e)
    },
    // 发出change事件
    handleChange(val) {
      this.$emit('change', val)
    },
    // 发出clear事件
    handleClear() {
      this.$emit('clear')
    },
    // 验证输入值
    validate(value) {
      let cutNum = 0
      let cutStr = ''
      let isCanOut = true
      if (value && value.length > this.oldValue.length) {
        cutNum = this.oldValue.length - value.length
        cutStr = value.slice(cutNum)
        // console.log(299, cutStr)
        this.inspectionRules.forEach((i, ind) => {
          if (i.name === this.inputType && !i.rules.test(cutStr)) {
            isCanOut = false
          }
        })
      }
      // console.log(112, isCanOut)
      return isCanOut
    }
  },
  created() {
    console.log(161, this.$attrs)
    console.log(162, this.$listeners)
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-components/base-input.scss';
</style>
