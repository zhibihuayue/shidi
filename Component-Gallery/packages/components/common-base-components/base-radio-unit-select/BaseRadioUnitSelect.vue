<!-- 页面 -->
<template>
  <div :class="[bemClass.container]">
    <el-radio-group v-model="radio" size="small">
      <el-radio
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        :label="item.value"
        :style="{ width: itemWidth }"
        aria-hidden="false"
        v-bind="$attrs"
        @change="changeValue(item.value)"
        >{{ item.label }}</el-radio
      >
    </el-radio-group>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('base-radio-unit-select')
export default {
  name: 'BaseRadioUnitSelect',
  components: {},
  props: {
    compact: {
      type: Boolean,
      default: true
    },
    defaultValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      radio: ''
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('container')
      }
    },
    itemWidth() {
      return this.compact ? 'auto' : `calc(100% / ${this.options.length})`
    }
  },
  watch: {},
  created() {
    this.radio = this.defaultValue
    console.log('🚀 ~ created ~ this.radio:', this.radio)
  },
  methods: {
    changeValue(value) {
      console.log('🚀 ~ changeValue ~ value:', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-radio-unit-select';
</style>
