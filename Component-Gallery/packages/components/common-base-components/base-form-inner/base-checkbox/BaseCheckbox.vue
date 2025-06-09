<template>
  <span class="base-checkbox__namespace">
    <el-checkbox :class="[bem.root, checkboxTypeClass]" v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-checkbox>
  </span>
</template>
<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('base-checkbox')

export default {
  name: 'base-checkbox',
  props: {
    checkboxType: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    // Computes the class for the checkbox based on the checkboxType prop
    checkboxTypeClass() {
      // Returns the class name based on the checkboxType prop, or an empty string if checkboxType is falsey
      return this.checkboxType ? `base-checkbox-${this.checkboxType}` : ''
    },
    // Computes the BEM class names for the component
    bem() {
      // Returns an object with BEM class names for the component
      return {
        // Generates the base class for the root element
        root: bem.b('')
        // Generates the element class for the control element (commented out)
        // control: bem.e('control')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-components/base-checkout.scss';
</style>
