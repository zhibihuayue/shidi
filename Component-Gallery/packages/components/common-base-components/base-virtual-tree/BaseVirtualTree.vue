<template>
  <virtual-tree
    ref="tree"
    class="base-virtual-tree common-iw-s"
    :data="data"
    :fixed-root="fixedRoot"
    :empty-text="emptyText"
    :node-key="nodeKey"
    :props="props"
    :render-after-expand="renderAfterExpand"
    :load="load"
    :render-content="renderContent"
    :highlight-current="highlightCurrent"
    :default-expand-all="defaultExpandAll"
    :expand-on-click-node="expandOnClickNode"
    :check-on-click-node="checkOnClickNode"
    :auto-expand-parent="autoExpandParent"
    :default-expanded-keys="defaultExpandedKeys"
    :show-checkbox="showCheckbox"
    :check-strictly="checkStrictly"
    :default-checked-keys="defaultCheckedKeys"
    :current-node-key="currentNodeKey"
    :filter-node-method="filterNodeMethod"
    :accordion="accordion"
    :indent="indent"
    :icon-class="iconClass"
    :lazy="lazy"
    :draggable="draggable"
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :height="height"
    :keeps="keeps"
    :is-dynamic="isDynamic"
    :check-descendants="checkDescendants"
    :size-dependencies="sizeDependencies"
    :item-size="realPx(itemSize)"
    :min-item-size="realPx(minItemSize)"
    :buffer="buffer"
    :emit-update="emitUpdate"
    :on-update="onUpdate"
    :extra-line="extraLine"
    @node-click="nodeClick"
    @node-contextmenu="nodeContextmenu"
    @check-change="checkChange"
    @check="check"
    @current-change="currentChange"
    @node-expand="nodeExpand"
    @node-collapse="nodeCollapse"
    @node-drag-start="nodeDragStart"
    @node-drag-enter="nodeDragEnter"
    @node-drag-leave="nodeDragLeave"
    @node-drag-over="nodeDragOver"
    @node-drag-end="nodeDragEnd"
    @node-drop="nodeDrop"
  >
    <template v-slot="scope">
      <slot v-bind="scope"></slot>
    </template>
  </virtual-tree>
</template>

<script>
import VirtualTree from './virtual-tree/VirtualTree.vue'

export default {
  name: 'BaseVirtualTree',
  components: {
    VirtualTree
  },
  props: {
    data: {
      type: Array
    },
    // 高度
    height: {
      type: [String, Number],
      default: '100%'
    },
    // 固定第一级父元素
    fixedRoot: {
      type: Boolean,
      default: true
    },
    // 节点 key 映射
    nodeKey: {
      type: String,
      default: 'code'
    },
    // 动态高度
    isDynamic: {
      type: Boolean,
      default: true
    },
    // origin tree props
    emptyText: {
      type: String,
      default() {
        return '暂无数据'
      }
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false
    },
    itemSize: {
      type: Number,
      default: 32
    },
    minItemSize: {
      type: Number,
      default: 32
    },
    buffer: {
      // 添加到滚动可见区域边缘以开始渲染更远的项目的像素量
      type: Number,
      default: 200
    },
    emitUpdate: {
      type: Boolean,
      default: false
    },
    onUpdate: {
      type: Function
    },
    sizeDependencies: {
      type: Array,
      default: () => []
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: Function,
    allowDrop: Function,
    // eslint-disable-next-line vue/require-prop-types
    props: {
      default() {
        return {
          children: 'list',
          label: 'name',
          disabled: 'disabled'
        }
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    },
    iconClass: String,
    extraLine: {
      type: Number,
      default: 8
    },
    // 计算希望渲染的tree节点数
    keeps: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  computed: {
    // 树 ref
    tree() {
      return this.$refs.tree
    },
    // tree store
    store() {
      return this.$refs.tree.store
    }
  },
  methods: {
    // origin tree method
    filter(value) {
      if (this.tree) {
        this.tree.filter(value)
      }
    },
    expandFilter(expand, filterValue, expandValidate) {
      if (this.tree) {
        this.tree.expandFilter(expand, filterValue, expandValidate)
      }
    },
    expandCollapse(value) {
      if (this.store) {
        this.store.expandAll()
      }
    },
    collapseAll() {
      if (this.store) {
        this.store.collapseAll()
      }
    },
    scrollToItem(key) {
      this.tree.scrollToItem(key)
    },
    updateKeyChildren(key, data) {
      return this.tree.updateKeyChildren(key, data)
    },
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.tree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    setCheckedNodes(nodes, leafOnly) {
      return this.tree.setCheckedNodes(nodes, leafOnly)
    },
    getCheckedKeys(leafOnly) {
      return this.tree.getCheckedKeys(leafOnly)
    },
    setCheckedKeys(keys, leafOnly) {
      return this.tree.setCheckedKeys(keys, leafOnly)
    },
    setChecked(data, checked, deep) {
      return this.tree.setChecked(data, checked, deep)
    },
    getHalfCheckedNodes() {
      return this.tree.getHalfCheckedNodes()
    },
    getHalfCheckedKeys() {
      return this.tree.getHalfCheckedKeys()
    },
    getCurrentKey() {
      return this.tree.getCurrentKey()
    },
    getCurrentNode() {
      return this.tree.getCurrentNode()
    },
    setCurrentKey(key) {
      this.tree.setCurrentKey(key)
    },
    setCurrentNode(node) {
      this.tree.setCurrentNode(node)
    },
    getNode(data) {
      return this.tree.getNode(data)
    },
    remove(data) {
      this.tree.remove(data)
    },
    append(data, parentNode) {
      this.tree.append(data, parentNode)
    },
    insertBefore(data, refNode) {
      this.tree.insertBefore(data, refNode)
    },
    insertAfter(data, refNode) {
      this.tree.insertAfter(data, refNode)
    },
    // origin tree events
    nodeClick(...args) {
      this.$emit('node-click', ...args)
    },
    nodeContextmenu(...args) {
      this.$emit('node-contextmenu', ...args)
    },
    checkChange(...args) {
      this.$emit('check-change', ...args)
    },
    check(...args) {
      this.$emit('check', ...args)
    },
    currentChange(...args) {
      this.$emit('current-change', ...args)
    },
    nodeExpand(...args) {
      this.$emit('node-expand', ...args)
    },
    nodeCollapse(...args) {
      this.$emit('node-collapse', ...args)
    },
    nodeDragStart(...args) {
      this.$emit('node-drag-start', ...args)
    },
    nodeDragEnter(...args) {
      this.$emit('node-drag-enter', ...args)
    },
    nodeDragLeave(...args) {
      this.$emit('node-drag-leave', ...args)
    },
    nodeDragOver(...args) {
      this.$emit('node-drag-over', ...args)
    },
    nodeDragEnd(...args) {
      this.$emit('node-drag-end', ...args)
    },
    nodeDrop(...args) {
      this.$emit('node-drop', ...args)
    },
    pxToRem(px) {
      return `${px / 100}rem`
    },
    /**
     * @description 将通过pxtToRem转换的rem重新转换为真实像素
     * @param {string | number} px 需要转换的原像素值
     * @returns {number}
     */
    realPx(px) {
      const ele = document.querySelector('html')
      const fontSize = window.getComputedStyle(ele).fontSize.split('px')[0]
      const rem = this.pxToRem(px).split('rem')[0]
      return Number((Number(rem) * Number(fontSize)).toFixed(0))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.base-virtual-tree {
  @include themeify(false) {
    @if $theme-name == 'theme-wiseblue' {
      --base-virtual-tree__check-size: #{px-to-rem(14)};
      --base-virtual-tree__check-size-im: #{px-to-rem(15)};
      --base-virtual-tree__check-border-color: rgb(19, 115, 230);
    }
    @if $theme-name == 'theme-aquamarine' {
      --base-virtual-tree__check-size: #{px-to-rem(14)};
      --base-virtual-tree__check-size-im: #{px-to-rem(15)};
      --base-virtual-tree__check-border-color: transparent;
    }
    @if $theme-name == 'theme-terracotta' {
      --base-virtual-tree__check-size: #{px-to-rem(14)};
      --base-virtual-tree__check-size-im: #{px-to-rem(15)};
      --base-virtual-tree__check-border-color: #9f9853;
    }
  }

  ::v-deep {
    &.el-tree {
      .el-tree-node {
        .el-tree-node__content {
          padding-right: px-to-rem(12);
          width: 100%;
          box-sizing: border-box;

          .firstNode {
            padding-right: px-to-rem(0);
          }

          .custom-tree-node:not(.firstNode) {
            & > span {
              vertical-align: middle;
            }

            .custom-tree-right {
              display: none;
              margin: 0 0 0 px-to-rem(12);
            }

            &:hover {
              .custom-tree-right {
                display: block;
              }
            }
          }

          .el-checkbox {
            .el-checkbox__input {
              display: inline-flex;

              .el-checkbox__inner {
                border: px-to-rem(1) solid
                  var(--base-virtual-tree__check-border-color);

                &::before {
                  font-size: var(--base-virtual-tree__check-size-im);
                }

                &::after {
                  font-size: var(--base-virtual-tree__check-size);
                  border: none !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
