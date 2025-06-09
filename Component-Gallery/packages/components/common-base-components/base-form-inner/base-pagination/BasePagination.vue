<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-26 09:05:02
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-11-04 10:29:03
 * @FilePath: /Component-Gallery/packages/components/common-base-components/base-form-inner/base-pagination/BasePagination.vue
 * @Description:
-->
<template>
  <div :class="[bem.root, 'common-iw-s']">
    <div class="page-tool-box">
      <div class="page-tool">
        <div class="page-number" v-c-tip="`第${currentPageRef}页/共${$attrs.total}条`">
          {{ showCurrent ? `第${currentPageRef}页/` : '' }}共{{ $attrs.total }}条
        </div>
        <el-pagination
          small
          v-bind="$attrs"
          v-on="$listeners"
          popper-class="c-select-dropdown"
          :current-page="currentPageRef"
          @current-change="currentChange"
        />
        <div class="page-btns">
          <ct-icon v-if="tools.includes('refresh')" name="refresh" class="refreshClass" @click="currentChange(1)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('common-base')
export default {
  name: 'base-pagination',
  inheritAttrs: false,
  data() {
    return {
      currentPageRef: this.currentPage
    }
  },
  // 定义props
  props: {
    // 定义tools属性，类型为Array，默认为一个空数组
    tools: {
      type: Array,
      default: () => []
    },
    // 定义currentPage属性，类型为Number，默认为1
    currentPage: {
      type: Number,
      default: 1
    },
    // 定义showCurrent属性，类型为Boolean，默认为true
    // 用于控制是否显示当前页信息
    showCurrent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    bem() {
      return {
        root: bem.b('pagination')
      }
    }
  },
  methods: {
    currentChange(val) {
      this.currentPageRef = val
      this.$emit('pageChange', val)
    }
  },
  watch: {
    currentPage: {
      handler(val) {
        this.currentPageRef = val
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-components/base-pagination';
</style>
