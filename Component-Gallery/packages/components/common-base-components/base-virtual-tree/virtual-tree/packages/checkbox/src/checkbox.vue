<template>
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
  >
    <span
      class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="el-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
      <input
        v-else
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import { broadcast } from '../../../mixins/emitter'

export default {
  name: 'ElCheckbox',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  componentName: 'ElCheckbox',
  data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false,
      checkboxGroup: null
    }
  },
  computed: {
    model: {
      get() {
        return this.isGroup
          ? this.store
          : this.value !== undefined // NOSONAR
          ? this.value
          : this.selfModel
      },
      set(val) {
        if (this.isGroup) {
          this.isLimitExceeded = false
          this.checkboxGroup.min !== undefined &&
            val.length < this.checkboxGroup.min &&
            (this.isLimitExceeded = true)
          this.checkboxGroup.max !== undefined &&
            val.length > this.checkboxGroup.max &&
            (this.isLimitExceeded = true)
          this.isLimitExceeded === false &&
            this.dispatch('ElCheckboxGroup', 'input', [val])
        } else {
          this.$emit('input', val)
          this.selfModel = val
        }
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel
      } else {
        console.log('sonarlint')
      }
    },
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'ElCheckboxGroup') {
          parent = parent.$parent
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.checkboxGroup = parent
          return true
        }
      }
      return false
    },
    store() {
      return this.checkboxGroup ? this.checkboxGroup.value : this.value
    },
    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled() {
      const { max, min } = this.checkboxGroup
      const ruleA =
        !!(max || min) && this.model.length >= max && !this.isChecked
      const ruleB = this.model.length <= min && this.isChecked
      return ruleA || ruleB
    },
    isDisabled() {
      if (this.isGroup) {
        return (
          this.checkboxGroup.disabled || // NOSONAR
          this.disabled ||
          (this.elForm || {}).disabled ||
          this.isLimitDisabled // NOSONAR
        )
      }
      return this.disabled || (this.elForm || {}).disabled
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    checkboxSize() {
      const temCheckboxSize =
        this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
      return this.isGroup
        ? this.checkboxGroup.checkboxGroupSize || temCheckboxSize
        : temCheckboxSize
    }
  },
  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    controls:
      String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    border: Boolean,
    size: String
  },
  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label)
      } else {
        this.model = this.trueLabel || true
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return
      let value
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel
      }
      this.$emit('change', value, ev)
      this.$nextTick(() => {
        if (this.isGroup) {
          this.dispatch('ElCheckboxGroup', 'change', [this.checkboxGroup.value])
        }
      })
    },
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  },
  created() {
    this.checked && this.addToStore()
  },
  mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls)
    }
  },
  watch: {
    value(value) {
      this.dispatch('ElFormItem', 'el.form.change', value)
    }
  }
}
</script>
