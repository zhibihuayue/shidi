<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-22 17:06:22
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-24 23:02:45
 * @FilePath: /Component-Gallery/packages/components/common-base-components/base-form-inner/base-collapse/BaseCollapseGroup.vue
 * @Description
 * 使用方式
      <base-collapse-group
      v-model="activeNames"  // 当前展开的面板的 name
      :accordion="true"   // 是否手风琴模式
      @change="handleCollapseChange"
    >
      <base-collapse title="一致性 " name="1">  // name 为唯一标识
        <div>与现实生活一致</div>
        <div>在界面中一致</div>
      </base-collapse>
      <base-collapse title="反馈" name="2">
        <div>控制反馈</div>
        <div>页面反馈</div>
      </base-collapse>
    </base-collapse-group>
-->
<template>
  <div :class="genCommonWrapper">
    <slot></slot>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('common-base')
export default {
  name: 'BaseCollapseGroup',
  props: {
    /**
     * 如果 accordion 为 true，value 必须是字符串
     * 如果 accordion 为 false，value 必须是数组
     */
    value: {
      type: [String, Array],
      default: ''
    },
    accordion: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    genCommonWrapper() {
      return {
        [bem.b('collapse-group')]: true
      }
    }
  },
  watch: {
    // 监听 value 的变化
    value(val) {
      // 如果是手风琴模式
      if (this.accordion) {
        // 遍历所有子组件
        this.$children.forEach((child) => {
          // 设置子组件的 opened 属性为 true，如果子组件的 name 属性等于当前的 value
          child.opened = child._props.name === val
        })
      } else {
        // 如果不是手风琴模式
        // 遍历所有子组件
        this.$children.forEach((child) => {
          // 设置子组件的 opened 属性为 true，如果 value 数组中包含子组件的 name 属性
          child.opened = val.includes(child._props.name)
        })
      }
    }
  },
  mounted() {
    this.$children.forEach((child) => {
      child.opened = child._props.name === this.value
    })
  },
  methods: {
    changeState(id, key) {
      // 检查是否为手风琴模式
      if (this.accordion) {
        // 手风琴模式下，只有一个折叠面板可以打开
        // 遍历所有子组件，切换指定id的子组件的opened状态，并将其他子组件的opened状态设置为false
        this.$children.forEach((child) => {
          child.opened = child._uid === id ? !child.opened : false
        })
        // 触发input事件，并传递key值给父组件
        this.$emit('input', key)
      } else {
        // 非手风琴模式下，可以同时打开多个折叠面板
        // 遍历所有子组件，切换指定id的子组件的opened状态
        this.$children.forEach((child) => {
          if (child._uid === id) {
            child.opened = !child.opened
          }
        })
        // 从当前组件的子组件中筛选出所有opened属性为真的组件，并将它们的name属性映射成一个数组
        const list = this.$children.filter((child) => child.opened).map((child) => child.name)

        // 触发input事件，将筛选后的子组件名称列表传递给父组件
        this.$emit('input', list)

        // 触发select事件，将包含key和子组件名称列表的对象传递给父组件
        this.$emit('select', {
          key: key,
          list: list
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-collapse-group.scss';
</style>
