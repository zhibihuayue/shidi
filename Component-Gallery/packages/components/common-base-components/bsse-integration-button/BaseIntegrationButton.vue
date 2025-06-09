<!--
 * @Author: 张瑞 zhangrui@strongdata.com.cn
 * @Date: 2025-2-24 12:00:00
 * @LastEditors: 张瑞 zhangrui@strongdata.com.cn
 * @LastEditTime: 2025-2-24 12:00:00
 * @FilePath: /Component-Gallery/packages/components/common-base-components/bsse-integration-button/BaseIntegrationButton.vue
 * @Description: 组件属性描述、组件示例
 props:
  - activated: 按钮激活状态，默认为false，未激活。
  - activeMenuKey: 激活的菜单项的key，默认为空。
  - iconName: 图标名称，默认为空。
  - btnName: 按钮名称，默认为大屏集成按钮。
  - menuList: 菜单项列表，默认为空, 每个菜单项是一个对象，包含以下属性:
    * - icon: 图标名称
    * - name: 名称
    * - key: 键值
  - @btnClick: 按钮点击事件。
  - @menuClick: 菜单项点击事件。
示例：
  <base-integration-button
    iconName="resource-allocation-branch"
    btnName="资源调派"
    :activated="isActive"
    :menuList="menuList"
    :activeMenuKey="activeMenuKey"
    :offset="offset"
    @btnClick="toggleButton"
    @menuClick="handleMenuClick"
  />
-->
<template>
  <div :class="{ [bemClass.container]: true, active: activated }" :style="{ width: pxToRem(btnWidth) }">
    <div :class="[bemClass.trigger]" @click="togglePanel">
      <ct-icon :name="iconName" />
      <span>{{ btnName }}</span>
    </div>
    <template v-if="menuList.length">
      <ul :class="[bemClass.list]" v-if="activated">
        <li
          v-for="item in menuList"
          :key="item.key"
          :class="{
            active: activeMenuKey === item.key
          }"
          @click="handleMenuClick(item)"
        >
          <ct-icon :name="item.iconName" />
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import { pxToRem } from '@component-gallery/utils/funCommon/pxToRem'

const bem = createNameSpace('common-base')

export default {
  name: 'BaseIntegrationButton',
  props: {
    // 按钮宽度
    btnWidth: {
      type: Number,
      default: 124
    },
    // 按钮激活状态
    activated: {
      type: Boolean,
      default: false // 默认值为false
    },
    // 激活的菜单项的键值
    activeMenuKey: {
      type: String,
      default: '' // 默认值为空字符串
    },
    // 按钮左侧icon名称
    iconName: {
      type: String,
      required: true, // 必传
      default: '' // 默认值为空字符串
    },
    // 按钮名称
    btnName: {
      type: String,
      default: '集成按钮' // 默认值为'大屏集成按钮'
    },
    /**
     * 菜单列表，包含多个菜单项，每个菜单项包含图标名称、名称和键值
     * 每个菜单项是一个对象，包含以下属性：
     * - icon: 图标名称
     * - name: 名称
     * - key: 键值
     */
    menuList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('integration-button'),
        trigger: bem.be('integration-button', 'trigger'),
        list: bem.be('integration-button', 'list')
      }
    }
  },
  methods: {
    /**
     * 切换面板激活状态
     *
     * 本方法用于切换组件的激活状态每当调用此方法时，它会反转当前的激活状态
     * 并触发一个自定义事件'btnClick'，将新的激活状态通知给父组件
     */
    togglePanel() {
      // 切换激活状态
      // this.activated = !this.activated
      // 触发自定义事件，传递新的激活状态
      this.$emit('btnClick')
    },
    /**
     * 处理菜单项点击事件
     *
     * 本方法用于处理菜单项的点击事件，当用户点击某个菜单项时，会触发一个自定义事件'menuClick'，并将当前点击的菜单项传递给父组件
     * @param {Object} item - 当前点击的菜单项
     */
    handleMenuClick(item) {
      this.$emit('menuClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-components/base-integration-button.scss';
</style>
