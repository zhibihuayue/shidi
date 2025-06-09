<template>
  <div :class="[bem.root]" class="common-iw-s">
    <el-select
      ref="selectRef"
      class="base-select-tree"
      :class="{ 'base-select-tree__not-to-body': !popperToBody }"
      :popper-class="popperClassNames"
      v-model="selectedIds"
      collapse-tags
      v-bind="$attrs"
      :popper-append-to-body="popperToBody"
      :filter-method="selectFilterMethod"
      @visible-change="selectVisibleChangeHandler"
      @focus="focusHandler"
      @blur="blurHandler"
      @change="selectChangeHandler"
      @clear="clearHandler"
    >
      <el-option disabled class="tree-option" :value="null">
        <base-loading v-if="loading" />
        <base-virtual-tree
          v-else
          style="height: 100%"
          class="tree-fixed-first-level"
          ref="treeRef"
          :data="treeData"
          v-bind="treeOptions"
          :node-key="(treeOptions && treeOptions.nodeKey) || commonProps.id"
          :props="{
            id: commonProps.id,
            label: commonProps.name,
            children: commonProps.children
          }"
          :highlight-current="!multiple"
          :filterNodeMethod="filterNode"
          @node-expand="nodeExpandHandler"
          @node-collapse="nodeCollapseHandler"
          @node-click="treeClickHandler"
          @check="treeCheckHandler"
        >
          <template v-slot="scope">
            <slot v-bind="scope"></slot>
          </template>
        </base-virtual-tree>
      </el-option>
      <!--  将其余的选型隐藏掉  -->
      <el-option
        v-for="item in plainData.filter((e) => (multiple ? e.isLeaf : leafOnly ? e.isLeaf : true))"
        :key="item[commonProps.id]"
        :value="item[commonProps.id]"
        :label="item[commonProps.name]"
        v-show="false"
      />
    </el-select>
  </div>
</template>
<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import BaseVirtualTree from '../../base-virtual-tree/BaseVirtualTree.vue'
import { cloneDeep } from 'lodash-es'
import BaseLoading from '../../base-loading/BaseLoading.vue'

const bem = createNameSpace('base-select-tree')

export default {
  name: 'treeSelect',
  components: { BaseLoading, BaseVirtualTree },
  props: {
    // 定义value属性，类型为Array、String、Number
    value: {
      type: [Array, String, Number]
    },
    // 定义data属性，类型为Array，默认为空数组
    data: {
      type: Array,
      default: () => []
    },
    // 定义loading属性，类型为Boolean，默认为false
    loading: {
      type: Boolean,
      default: false
    },
    // 定义popperToBody属性，类型为Boolean，默认为false
    popperToBody: {
      type: Boolean,
      default: false
    },
    // 定义leafOnly属性，类型为Boolean
    leafOnly: Boolean,
    // 定义treeOptions属性，类型为Object，默认为空对象
    treeOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 用户搜索关键字的回显
    treeQuery: '',
    treeData: [],
    plainData: [],
    selectedIds: [],
    lastHighlightNodeId: undefined,
    panelScrollTop: 0
  }),
  // 监听data属性的变化
  watch: {
    data: {
      // 当data属性发生变化时，执行handler函数
      handler() {
        // 深拷贝data属性的值，赋给treeData
        this.treeData = cloneDeep(this.data)
        // 获取树形数据的平铺结构，赋给plainData
        this.plainData = this.getPlainTreeData(this.data)
        // 重置panelScrollTop为0
        this.panelScrollTop = 0
      },
      // 深度监听
      deep: true,
      // 立即执行
      immediate: true
    },
    // 监听value属性的变化
    value: {
      // 当value属性发生变化时，执行handler函数
      handler() {
        // 如果是多选
        if (this.multiple) {
          // 深拷贝value属性的值，赋给selectedIds
          this.selectedIds = JSON.parse(JSON.stringify(this.value))
          // 在下一个tick中执行
          this.$nextTick(() => {
            // 设置树形数据的选中状态
            this.$refs.treeRef.setCheckedKeys(
              this.value.filter((id) => this.plainData.find((item) => item[this.commonProps.id] === id)?.isLeaf)
            )
          })
        } else {
          // 如果是单选
          this.selectedIds = this.value
          // 如果leafOnly为true且value不是叶子节点
          if (this.leafOnly && !this.plainData.find((e) => e[this.commonProps.id] === this.value)?.isLeaf) {
            // 重置lastHighlightNodeId为undefined
            this.lastHighlightNodeId = undefined
            // 在下一个tick中执行
            this.$nextTick(() => {
              // 设置树形数据的当前节点
              this.$refs.treeRef.setCurrentKey(undefined)
            })
          } else {
            // 如果leafOnly为false或者value是叶子节点
            this.lastHighlightNodeId = this.value || undefined
            // 在下一个tick中执行
            this.$nextTick(() => {
              // 设置树形数据的当前节点
              this.$refs.treeRef.setCurrentKey(this.value || undefined)
            })
          }
        }
      },
      // 深度监听
      deep: true,
      // 立即执行
      immediate: true
    }
  },
  computed: {
    popperClassNames() {
      return 'common-iw-s base-select-tree-popper__namespace' + ' ' + this.$attrs.popperClass
    },
    bem() {
      return {
        root: bem.b('namespace')
      }
    },
    commonProps() {
      return {
        id: this.$attrs?.props?.id || 'id',
        name: this.$attrs?.props?.name || 'name',
        children: this.$attrs?.props?.children || 'children'
      }
    },
    multiple() {
      return Object.keys(this.$attrs).includes('multiple') && this.$attrs.multiple !== false
    }
  },
  methods: {
    // 获取返回节点
    getReturnNode(node, arr, value) {
      // 判断节点数据是否包含值
      let isPass =
        node.data && node.data[this.commonProps.name] && node.data[this.commonProps.name].indexOf(value) !== -1
      if (isPass) {
        arr.push(isPass)
      }
      // 如果节点不包含值且不是根节点
      if (!isPass && node.level !== 1 && node.parent) {
        // 递归获取父节点
        this.getReturnNode(node.parent, arr, value)
      }
    },

    // 过滤节点
    filterNode(value, data, node) {
      // 如果值为空，直接返回true
      if (!value) {
        return true
      }
      let _arr = [] //这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _arr, value)
      let result = false
      _arr.forEach((item) => {
        result = result || item
      })
      return result
    },

    // 获取树形数据
    getPlainTreeData(treeData, result = []) {
      // 初始化下拉菜单本身的选项
      treeData.forEach((e) => {
        const current = {
          [this.commonProps.id]: e[this.commonProps.id],
          [this.commonProps.name]: e[this.commonProps.name]
        }
        result.push(current)
        if (e[this.commonProps.children]?.length) {
          this.getPlainTreeData(e[this.commonProps.children], result)
        } else {
          current.isLeaf = true
        }
      })
      return result
    },
    // 树点击处理程序
    treeClickHandler(val, node) {
      if (this.treeOptions?.nodeClick) {
        return this.treeOptions?.nodeClick(val, node)
      }

      // 树选中节点（单选时）
      if (!this.multiple) {
        if (this.leafOnly && !node.isLeaf) {
          this.$refs.treeRef.setCurrentKey(this.lastHighlightNodeId)
          return
        }
        this.lastHighlightNodeId = val[this.commonProps.id]

        this.selectedIds = val[this.commonProps.id]
        this.$refs.selectRef.handleClose()
        this.$emit('input', this.selectedIds)
      }
    },
    // 树检查处理程序
    treeCheckHandler() {
      this.treeQuery = this.$refs.selectRef.query

      // 树选中节点（多选时）
      if (this.multiple) {
        this.selectedIds = this.$refs.treeRef.getCheckedKeys(true)
        this.$emit('input', [...this.selectedIds])
      }

      this.$nextTick(() => {
        this.$refs.selectRef.query = this.treeQuery
        this.$refs.treeRef.filter(this.treeQuery)
        this.$refs.selectRef.visible = true
        const input = this.$refs.selectRef.$el.querySelector('.el-select__input')
        if (input) {
          input.focus()
        }
      })
    },
    // 选择改变处理程序
    selectChangeHandler(values) {
      // 下拉选中内容改变时
      if (this.multiple) {
        this.$refs.treeRef.setCheckedKeys(values)
      } else {
        this.lastHighlightNodeId = values || undefined
        this.$refs.treeRef.setCurrentKey(values || undefined)
      }
      this.$emit('input', values)
    },

    // 更新弹出框函数
    updatePopperFn() {
      setTimeout(() => {
        this.$refs.selectRef.broadcast('ElSelectDropdown', 'updatePopper')
      }, 10)
    },
    // 节点折叠处理程序
    nodeCollapseHandler() {
      this.updatePopperFn()
    },
    // 节点展开处理程序
    nodeExpandHandler() {
      this.updatePopperFn()
    },
    // 选择过滤方法
    selectFilterMethod(val) {
      const input = this.$refs.selectRef.$el.querySelector('.el-select__input')
      this.$refs.treeRef.filter(val || input?._value)
      this.$emit('input-filter', val || input?._value)
    },
    // 选择可见性改变处理程序
    selectVisibleChangeHandler(isVisible) {
      if (!isVisible && this.$attrs.filterable != null) {
        this.treeQuery = ''
        this.$refs.treeRef.filter()
        this.$emit('input-filter', '')
      }
    },
    // 清除处理程序
    clearHandler() {
      this.selectedIds = []
      this.treeQuery = ''
      this.$refs.treeRef.filter(this.treeQuery)
      this.$emit('clear')
    },
    // 焦点处理程序
    focusHandler() {
      // this.$nextTick(() => {
      //   this.$refs.selectRef.query = this.treeQuery
      // })
    },
    // 失焦处理程序
    blurHandler() {
      // this.$nextTick(() => {
      //   this.$refs.selectRef.query = this.treeQuery
      // })
    },
    // 外部点击处理程序
    outerClick() {
      if (this.$refs.selectRef) {
        this.$refs.selectRef.blur()
        this.treeQuery = ''
        this.$refs.treeRef.filter(this.treeQuery)
      }
    }
  },
  mounted() {
    window.addEventListener('click', this.outerClick)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.outerClick)
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/tree';

[data-theme='theme-wiseblue'] .base-select-tree-namespace {
  --text-color: #e8f3fe;
  --text-empty-icon: url('~@component-gallery/assets/image/video/noData.png');
}

[data-theme='theme-aquamarine'] .base-select-tree-namespace {
  --text-color: #ffffff;
  --text-empty-icon: url('~@component-gallery/assets/image/video/noData-ly.png');
}

[data-theme='theme-terracotta'] .base-select-tree-namespace {
  --text-color: #e4e7c1;
  --text-empty-icon: url('~@component-gallery/assets/image/video/noData-gt.png');
}

.base-select-tree-namespace {
  position: relative;

  > .base-select-tree {
    ::v-deep {
      &.el-select .el-select__tags .el-tag .el-select__tags-text {
        margin-top: px-to-rem(1);
      }

      .el-scrollbar {
        .el-scrollbar__bar {
          width: 0 !important;
          display: none !important;
        }

        .el-select-dropdown__wrap {
          margin-bottom: 0 !important;
          margin-right: 0 !important;
        }
      }

      .el-input__inner {
        height: px-to-rem(32) !important;
        border-color: transparent;
      }

      .el-select__tags .el-tag {
        max-width: calc(100% - 8em) !important;
      }

      .el-select-dropdown {
        margin: 0;

        .el-checkbox.is-checked .el-checkbox__inner::after {
          font-size: px-to-rem(14);
        }
      }

      .base-virtual-tree {
        .el-tree__empty-text {
          color: var(--text-color);
          font-size: px-to-rem(14);
          text-align: center;
          line-height: 1;
          &::before {
            content: var(--text-empty-icon);
            line-height: 1;
            display: block;
            margin-bottom: px-to-rem(12);
          }
        }
      }
    }
  }

  > .base-select-tree__not-to-body {
    ::v-deep {
      .el-select-dropdown {
        position: absolute !important;
        left: 0 !important;
        top: px-to-rem(38) !important;
      }

      .el-tree__empty-text {
        color: var(--text-color) !important;
      }

      .el-select__input {
        color: var(--text-color) !important;
      }
    }
  }
}

.base-select-tree {
  ::v-deep {
    .el-select__input {
      margin-left: px-to-rem(12) !important;
      margin-right: px-to-rem(12) !important;
    }
  }
}
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.base-select-tree-popper__namespace {
  > .el-scrollbar {
    > .el-select-dropdown__wrap {
      overflow: hidden !important;

      > .el-select-dropdown__list {
        padding: 0 !important;

        > .el-select-dropdown__item:first-child {
          padding: 0;
          height: px-to-rem(256);
        }

        > .el-select-dropdown__item:first-child:hover {
          background-color: transparent !important;
        }
      }

      .el-scrollbar__thumb {
        background-color: transparent !important;
      }

      .el-scrollbar__bar {
        display: none !important;
      }
    }
  }

  // 处理 多选树形下拉框 打开时闪现小对号的问题
  &.el-select-dropdown {
    .el-scrollbar {
      .el-select-dropdown__wrap {
        .el-select-dropdown__list {
          .el-select-dropdown__item {
            .el-tree {
              .el-tree-node {
                .el-tree-node__content {
                  .el-tree-node__expand-icon {
                    margin-left: px-to-rem(6);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.base-select-tree {
  .el-select__input {
    margin-left: px-to-rem(12) !important;
    margin-right: px-to-rem(12) !important;
  }
}
</style>
