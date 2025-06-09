<template>
  <div
    :class="['trigger-button', disabled && 'disabled', localState ? 'trigger-button' + '--active' : '']"
    @click="handleBtnClick"
  >
    <div :class="'trigger-button' + '_icon-bg'"> </div>
    <div
      :class="'trigger-button' + '_icon'"
      :style="{ '--trigger-button-size': pxToRem(iconSize) }"
      v-if="!$slots.default"
    >
      <ct-icon :name="iconClass"></ct-icon>
    </div>
    <slot></slot>
    <div :class="'trigger-button' + '_label'">{{ label }}</div>
  </div>
</template>
<script>
export default {
  name: 'trigger-button',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '目标筛选'
    },
    iconSize: {
      type: Number,
      default: 18
    },
    iconClass: {
      type: String,
      default: 'target-screening'
    }
  },
  watch: {
    disabled(v) {
      if (v) {
        this.localState = false
        this.$emit('change', this.localState)
      }
    }
  },
  computed: {
    localState: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('update', newVal)
      }
    }
  },
  methods: {
    handleBtnClick() {
      if (this.disabled) {
        return
      }
      this.localState = !this.localState
      this.$emit('change', this.localState)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/trigger-button';
</style>
