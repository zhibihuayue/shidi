<template>
  <el-radio
    :class="bem.root"
    :label="$attrs.radioValue"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </el-radio>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('common-base-radio')

export default {
  name: 'base-radio',
  computed: {
    bem() {
      return {
        root: bem.b('')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-form/base-radio';
</style>
