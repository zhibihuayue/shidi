<template>
  <div
    v-show="node.visible"
    ref="node"
    class="el-tree-node"
    :class="{
      'is-expanded': expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    @click.stop="handleClick"
    @contextmenu="($event) => this.handleContextMenu($event)"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
  >
    <div
      class="el-tree-node__content"
      :style="`padding-left:${
        (node.level - 1) * tree.indent
      }px;height: ${itemSize}px;`"
    >
      <span
        :class="[
          {
            'is-leaf': node.isLeaf,
            'expanded': !node.isLeaf && expanded
          },
          'el-tree-node__expand-icon',
          tree.iconClass ? tree.iconClass : 'el-icon-caret-right'
        ]"
        @click.stop="handleExpandIconClick"
      ></span>
      <!-- eslint-disable  vue/no-mutating-props -->
      <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.stop
        @change="handleCheckChange"
      ></el-checkbox>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      ></span>
      <node-content :node="node"></node-content>
    </div>
    <el-collapse-transition>
      <div
        v-if="hasChild && (!renderAfterExpand || childNodeRendered)"
        v-show="expanded"
        class="el-tree-node__children"
        role="group"
        :aria-expanded="expanded"
      >
        <el-tree-node
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :node="child"
          :item-size="itemSize"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          @node-expand="handleChildNodeExpand"
        ></el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
/* eslint-disable */
import ElCollapseTransition from './transitions/collapse-transition'
import ElCheckbox from './packages/checkbox/src/checkbox.vue'
import { broadcast } from './mixins/emitter'
import { getNodeKey } from './model/util'

export default {
  name: 'ElTreeNode',
  componentName: 'ElTreeNode',
  components: {
    ElCollapseTransition,
    ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node

        if (parent.renderContent) {
          return parent.renderContent.call(parent._renderProxy, h, {
            _self: tree.$vnode.context,
            node,
            data,
            store
          })
        }

        if (tree.$scopedSlots.default) {
          return tree.$scopedSlots.default({ node, data })
        }

        return h(
          'span',
          {
            class: 'el-tree-node__label'
          },
          node.label
        )
      }
    }
  },
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    props: {
      type: Object,
      default() {
        return {}
      }
    },
    hasChild: {
      default: true
    },
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    itemSize: {
      type: Number,
      default: 26
    }
  },
  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null,
      indeterminate: null
    }
  },
  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val)
    },
    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate)
    },
    'node.expanded'(val) {
      this.$nextTick(() => (this.expanded = val))
      if (val) {
        this.childNodeRendered = true
      }
    }
  },
  methods: {
    // common-methods copy
    init(parent) {
      if (parent.isTree) {
        this.tree = parent
      } else {
        this.tree = parent.tree
      }

      const tree = this.tree
      if (!tree) {
        console.warn('Can not find node\'s tree.')
      }

      const props = tree.props || {}
      const childrenKey = props['children'] || 'children'

      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren()
      })

      if (this.node.expanded) {
        this.expanded = true
        this.childNodeRendered = true
      }

      if (this.tree.accordion && !this.tree.height) {
        this.$on('tree-node-expand', (node) => {
          if (this.node !== node) {
            this.node.collapse()
          }
        })
      }
    },

    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data)
    },
    handleDragStart(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-start', event, this)
    },

    handleDragOver(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-over', event, this)
      event.preventDefault()
    },

    handleDragEnd(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-end', event, this)
    },

    handleDrop(event) {
      event.preventDefault()
    },

    handleSelectChange(checked, indeterminate) {
      const node = this.node

      if (
        this.oldChecked !== checked &&
        this.oldIndeterminate !== indeterminate
      ) {
        this.tree.$emit('check-change', node.data, checked, indeterminate)
      }
      this.oldChecked = checked
      this.indeterminate = indeterminate
    },
    handleClick() {
      const node = this.node
      const store = this.tree.store

      store.setCurrentNode(node)
      this.tree.$emit(
        'current-change',
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      )
      this.tree.currentNode = this
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick()
      }
      if (this.tree.checkOnClickNode && !node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !node.checked }
        })
      }

      this.tree.$emit('node-click', node.data, node, this)
    },

    handleContextMenu(event) {
      const node = this.node

      if (
        this.tree._events['node-contextmenu'] &&
        this.tree._events['node-contextmenu'].length > 0
      ) {
        event.stopPropagation()
        event.preventDefault()
      }
      this.tree.$emit('node-contextmenu', event, node.data, node, this)
    },

    handleExpandIconClick() {
      const node = this.node

      if (node.isLeaf) return
      if (this.expanded) {
        this.tree.$emit('node-collapse', node.data, node, this)
        node.collapse()
      } else {
        node.expand()
        this.$emit('node-expand', node.data, node, this)
      }
    },

    handleCheckChange(_, ev) {
      const node = this.node

      node.setChecked(ev.target.checked, !this.tree.checkStrictly)
      this.$nextTick(() => {
        const store = this.tree.store
        this.tree.$emit('check', node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        })
      })
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast(this.tree.treeNodeName, 'tree-node-expand', node)
      this.tree.$emit('node-expand', nodeData, node, instance)
    },
    // emitter
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  },

  created() {
    this.init(this.$parent)
  }
}
</script>
