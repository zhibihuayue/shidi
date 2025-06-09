<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-21 10:07:46
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-11-01 15:30:03
 * @Description:
      <base-tabs :tabs="tabs" block>
        <template #tab1>
          <div>这是第一个选项卡的内容。</div>
        </template>
        <template #tab2>
          <div>这是第二个选项卡的内容。</div>
        </template>
      </base-tabs>


    1：block tab是否块级展示 默认false

-->
<template>
  <div :class="genCommonWrapper">
    <div :class="[bemClass.header]">
      <div :class="[bemClass.wrap]">
        <div
          class="tab_item"
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[{ tab_active: activeTabIndex === index }, bemClass.is('block', block)]"
          @click="activeTabIndex === index ? '' : setActiveTab(index)"
          >{{ tab.label }}
        </div>
      </div>
      <div :class="[bemClass.bottomLine]"></div>
    </div>
    <div class="tab-content">
      <slot :name="tabs[activeTabIndex].name"></slot>
    </div>
  </div>
</template>
<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('common-base')
export default {
  name: 'base-tabs',
  props: {
    tabs: {
      type: Array,
      required: true,
      default: () => []
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTabIndex: 0
    }
  },
  mounted() {
    this.$el.style.setProperty('--item-length', this.tabs.length)
  },
  computed: {
    // Generates the common wrapper class based on the bem namespace
    genCommonWrapper() {
      return {
        [bem.b('tabs')]: true // Returns an object with the bem class for tabs
      }
    },
    // Generates the bem class objects for different parts of the component
    bemClass() {
      return {
        header: bem.b('header'), // Generates the bem class for the header
        wrap: bem.be('header', 'nav_wrap'), // Generates the bem class for the navigation wrapper
        bottomLine: bem.be('header', 'bottomLine'), // Generates the bem class for the bottom line
        content: bem.b('content'), // Generates the bem class for the content
        is: bem.is // Returns the bem is function for conditional classes
      }
    }
  },
  methods: {
    // 设置当前激活的选项卡索引
    setActiveTab(index) {
      // 更新当前激活的选项卡索引
      this.activeTabIndex = index
      // 发射tab-change事件，传递当前激活的索引
      this.$emit('tab-change', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.common-base-header__nav_wrap {
  .tab_item {
    width: calc(100% / var(--item-length));
  }
}
</style>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-components/base-tabs';
</style>
