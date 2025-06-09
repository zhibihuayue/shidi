<template>
  <div
    class="el-tree"
    :class="{
      'el-tree--highlight-current': highlightCurrent,
      'is-dragging': !!firstDraggingNode,
      'is-drop-not-allow': !dragState.allowDrop,
      'is-drop-inner': dragState.dropType === 'inner'
    }"
    :style="{
      '--fixed-root-item-size': -itemSize + 'px'
    }"
    role="tree"
  >
    <!-- 根节点 -->
    <el-tree-node
      v-if="fixedRoot && visibleChildNodes[0]"
      :key="getNodeKey(visibleChildNodes[0])"
      :node="visibleChildNodes[0]"
      :props="props"
      :itemSize="itemSize"
      :show-checkbox="showCheckbox"
      :render-content="renderContent"
      :render-after-expand="renderAfterExpand"
      :has-child="false"
      @node-expand="handleNodeExpand"
    ></el-tree-node>
    <!-- 动态虚拟滚动 -->
    <dynamic-scroller
      v-if="height && !isEmpty && isDynamic"
      ref="dynamicScroller"
      :items="dataList"
      :min-item-size="minItemSize"
      :emit-update="emitUpdate"
      :class="{
        'fixed-root': fixedRoot
      }"
      :style="{
        'height': fixedRoot ? `calc(${height} - ${itemSize}px)` : height,
        'overflow-y': 'auto',
        'scroll-behavior': 'smooth'
      }"
      :buffer="buffer"
      @update="onUpdate"
    >
      <template #default="{ item, index, active }">
        <dynamic-scroller-item
          v-if="item.id !== visibleChildNodes[0].id || fixedRoot === false"
          :item="item"
          :active="active"
          :size-dependencies="sizeDependencies.map((key) => item[key])"
          :data-index="index"
          :data-active="active"
        >
          <el-tree-virtual-node
            :isDynamic="isDynamic"
            :style="`min-height: ${minItemSize}px;`"
            :node="item"
            :item-size="itemSize"
            :render-content="renderContent"
            :show-checkbox="showCheckbox"
            :render-after-expand="renderAfterExpand"
            :expand-on-click-node="expandOnClickNode"
            @node-expand="handleNodeExpand"
          />
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
    <!--  虚拟滚动  -->
    <recycle-scroller
      v-else-if="height && !isEmpty"
      ref="recycleScroller"
      :class="{
        'fixed-root': fixedRoot
      }"
      :style="{
        'height': height,
        'overflow-y': 'auto',
        'scroll-behavior': 'smooth'
      }"
      :key-field="'key'"
      :items="dataList"
      :item-size="itemSize"
      :buffer="50"
    >
      <template v-slot="{ item }">
        <el-tree-virtual-node
          v-if="item.level !== 1 || fixedRoot === false"
          :style="`height: ${itemSize}px;`"
          :node="item"
          :item-size="itemSize"
          :render-content="renderContent"
          :show-checkbox="showCheckbox"
          :expand-on-click-node="expandOnClickNode"
          :render-after-expand="renderAfterExpand"
          @node-expand="handleNodeExpand"
        />
      </template>
    </recycle-scroller>
    <template v-else-if="!height">
      <el-tree-node
        v-for="child in visibleChildNodes"
        :key="getNodeKey(child)"
        :node="child"
        :props="props"
        :itemSize="itemSize"
        :show-checkbox="showCheckbox"
        :render-content="renderContent"
        :render-after-expand="renderAfterExpand"
        @node-expand="handleNodeExpand"
      ></el-tree-node>
    </template>
    <div v-if="isEmpty" class="el-tree__empty-block">
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
    <div
      v-show="dragState.showDropIndicator"
      ref="dropIndicator"
      class="el-tree__drop-indicator"
    ></div>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import TreeStore from './model/tree-store'
import {
  DynamicScroller,
  DynamicScrollerItem,
  RecycleScroller
} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { getNodeKey, findNearestComponent } from './model/util'
import ElTreeNode from './TreeNode.vue'
import ElTreeVirtualNode from './VirtualTreeNode.vue'
import { broadcast } from './mixins/emitter'
import { addClass, removeClass } from './utils/dom'
import './assets/index.scss'

export default {
  name: 'VirtualTree',
  components: {
    RecycleScroller,
    DynamicScroller,
    DynamicScrollerItem,
    ElTreeNode,
    ElTreeVirtualNode
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // 固定根节点
    fixedRoot: {
      type: Boolean,
      default: false
    },
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
    nodeKey: String,
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
    isDynamic: {
      type: Boolean,
      default: false
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
      type: Function,
      default: () => {
        return null
      }
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
          children: 'children',
          label: 'label',
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
    height: {
      type: [String, Number],
      default: 0
    },
    extraLine: {
      type: Number,
      default: 8
    },
    keeps: {
      type: Number,
      default: 40
    } // 计算希望渲染的tree节点数
  },
  data() {
    return {
      store: null,
      root: null,
      currentNode: null,
      treeItems: null,
      checkboxItems: [],
      dragState: {
        showDropIndicator: false,
        draggingNode: null,
        dropNode: null,
        allowDrop: true,
        dropType: null
      },
      treeNodeName: this.height ? 'ElTreeVirtualNode' : 'ElTreeNode',
      firstDraggingNode: null, // 记录第一次拖拽的节点，因为虚拟滚动会导致列表渲染的节点数据发生变化，导致拖拽滚动后的节点数据不正确
      isDragging: false, // 是否正在拖拽中，当开始拖拽时置为 true，当拖拽结束释放节点后置为false。用于判定是否需要更新拖拽节点
      isTree: false
    }
  },
  computed: {
    children: {
      set(value) {
        this.data = value
      },
      get() {
        return this.data
      }
    },

    treeItemArray() {
      return Array.prototype.slice.call(this.treeItems)
    },

    isEmpty() {
      const { childNodes } = this.root
      return (
        !childNodes ||
        childNodes.length === 0 ||
        childNodes.every(({ visible }) => !visible)
      )
    },

    visibleChildNodes() {
      return this.root.childNodes.filter(() => {
        return !this.isEmpty
      })
    },

    dataList() {
      return this.smoothTree(this.root.childNodes)
    }
  },
  watch: {
    defaultCheckedKeys(newVal) {
      this.store.setDefaultCheckedKey(newVal)
    },

    defaultExpandedKeys(newVal) {
      this.store.defaultExpandedKeys = newVal
      this.store.setDefaultExpandedKeys(newVal)
    },

    data(newVal) {
      this.store.setData(newVal)
    },

    checkboxItems(val) {
      Array.prototype.forEach.call(val, (checkbox) => {
        checkbox.setAttribute('tabindex', -1)
      })
    },

    checkStrictly(newVal) {
      this.store.checkStrictly = newVal
    }
  },
  methods: {
    smoothTree(treeData) {
      return treeData.reduce((smoothArr, data) => {
        if (data.visible) {
          // Mark different types to avoid being optimized out when assembled into the same dom
          data.type = this.showCheckbox
            ? `${data.level}-${data.checked}-${data.indeterminate}`
            : `${data.level}-${data.expanded}`
          smoothArr.push(data)
        }
        if (data.expanded && data.childNodes.length) {
          smoothArr.push(...this.smoothTree(data.childNodes))
        }

        return smoothArr
      }, [])
    },
    filter(value) {
      if (!this.filterNodeMethod) {
        throw new Error('[Tree] filterNodeMethod is required when filter')
      }
      this.store.filter(value)
    },
    expandFilter(expand, filterValue, expandValidate) {
      if (!this.filterNodeMethod) {
        throw new Error('[Tree] filterNodeMethod is required when filter')
      }
      this.store.expandFilter(expand, filterValue, expandValidate)
    },
    scrollToItem(key) {
      if (this.height && !this.isEmpty) {
        const virtualInstance = this.isDynamic
          ? this.$refs.dynamicScroller
          : this.$refs.recycleScroller

        // Automatically scroll the target item to the top
        const index = virtualInstance.items.findIndex((e) => {
          return e.key === key
        })

        this.$nextTick(() => {
          if (index > 5) {
            virtualInstance.scrollToItem(index - 5)
          } else {
            virtualInstance.scrollToItem(0)
          }
        })
      } else {
        throw new Error(
          'scrollToItem can only be used when using virtual scrolling'
        )
      }
    },
    getNodeKey(node) {
      return getNodeKey(this.nodeKey, node.data)
    },

    getNodePath(data) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in getNodePath')
      }
      const node = this.store.getNode(data)
      if (!node) {
        return []
      }
      const path = [node.data]
      let parent = node.parent
      while (parent && parent !== this.root) {
        path.push(parent.data)
        parent = parent.parent
      }
      return path.reverse()
    },

    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.store.getCheckedNodes(leafOnly, includeHalfChecked)
    },

    getCheckedKeys(leafOnly) {
      return this.store.getCheckedKeys(leafOnly)
    },

    getCurrentNode() {
      const currentNode = this.store.getCurrentNode()
      return currentNode ? currentNode.data : null
    },

    getCurrentKey() {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in getCurrentKey')
      }
      const currentNode = this.getCurrentNode()
      return currentNode ? currentNode[this.nodeKey] : null
    },

    setCheckedNodes(nodes, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      }
      this.store.setCheckedNodes(nodes, leafOnly)
    },

    setCheckedKeys(keys, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedKeys')
      }
      this.store.setCheckedKeys(keys, leafOnly)
    },

    setChecked(data, checked, deep) {
      this.store.setChecked(data, checked, deep)
    },

    setCheckedAll(checked = true) {
      this.store.setCheckedAll(checked)
    },

    getHalfCheckedNodes() {
      return this.store.getHalfCheckedNodes()
    },

    getHalfCheckedKeys() {
      return this.store.getHalfCheckedKeys()
    },

    setCurrentNode(node) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCurrentNode')
      }
      this.store.setUserCurrentNode(node)
    },

    setCurrentKey(key) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCurrentKey')
      }
      this.store.setCurrentNodeKey(key)
    },

    getNode(data) {
      return this.store.getNode(data)
    },

    remove(data) {
      this.store.remove(data)
    },

    append(data, parentNode) {
      this.store.append(data, parentNode)
    },

    insertBefore(data, refNode) {
      this.store.insertBefore(data, refNode)
    },

    insertAfter(data, refNode) {
      this.store.insertAfter(data, refNode)
    },

    handleNodeExpand(nodeData, node, instance) {
      this.broadcast(this.treeNodeName, 'tree-node-expand', node)
      this.$emit('node-expand', nodeData, node, instance)
    },

    updateKeyChildren(key, data) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in updateKeyChild')
      }
      this.store.updateChildren(key, data)
    },

    initTabIndex() {
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]')
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]')
      const checkedItem = this.$el.querySelectorAll(
        '.is-checked[role=treeitem]'
      )
      if (checkedItem.length) {
        checkedItem[0].setAttribute('tabindex', 0)
        return
      }
      this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0)
    },

    handleKeydown(ev) {
      const currentItem = ev.target
      if (currentItem.className.indexOf('el-tree-node') === -1) {
        return
      }
      const keyCode = ev.keyCode
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]')
      const currentIndex = this.treeItemArray.indexOf(currentItem)
      let nextIndex
      if ([38, 40].indexOf(keyCode) > -1) {
        // up、down
        ev.preventDefault()
        if (keyCode === 38) {
          // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0
        } else {
          nextIndex =
            currentIndex < this.treeItemArray.length - 1 ? currentIndex + 1 : 0
        }
        this.treeItemArray[nextIndex].focus() // 选中
      }
      // 始终使用箭头，避免expand-on-click-node=false时不展开
      const expandIcon = currentItem.querySelector('[class*="el-icon-"]')
      if ([37, 39].indexOf(keyCode) > -1 && expandIcon) {
        // left、right 展开
        ev.preventDefault()
        expandIcon.click() // 选中
      }
      const hasInput = currentItem.querySelector('[type="checkbox"]')
      if ([13, 32].indexOf(keyCode) > -1 && hasInput) {
        // space enter选中checkbox
        ev.preventDefault()
        hasInput.click()
      }
    },
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName

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
    this.isTree = true

    this.store = new TreeStore({
      key: this.nodeKey,
      data: this.data,
      lazy: this.lazy,
      props: this.props,
      load: this.load,
      currentNodeKey: this.currentNodeKey,
      checkStrictly: this.checkStrictly,
      checkDescendants: this.checkDescendants,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod
    })

    this.root = this.store.root

    let dragState = this.dragState

    // eslint-disable-next-line
    this.$on('tree-node-drag-start', (event, treeNode) => {
      if (
        typeof this.allowDrag === 'function' &&
        !this.allowDrag(treeNode.node)
      ) {
        event.preventDefault()
        return false
      }
      event.dataTransfer.effectAllowed = 'move'

      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        event.dataTransfer.setData('text/plain', '')
      } catch (e) {
        console.log(e)
      }
      if (this.isDragging === false) {
        dragState.draggingNode = treeNode
        this.firstDraggingNode = treeNode.node
        this.isDragging = true
      }
      this.$emit('node-drag-start', this.firstDraggingNode, event)
    })

    // eslint-disable-next-line
    this.$on('tree-node-drag-over', (event, treeNode) => { // NOSONAR
      const dropNode = findNearestComponent(
        event.target,
        treeNode.$options.name
      )
      const oldDropNode = dragState.dropNode
      if (oldDropNode && oldDropNode !== dropNode) {
        removeClass(oldDropNode.$el, 'is-drop-inner')
      }
      const draggingNode = this.firstDraggingNode
      if (!draggingNode || !dropNode) {
        return
      }

      let dropPrev = true
      let dropInner = true
      let dropNext = true
      let userAllowDropInner = true
      if (typeof this.allowDrop === 'function') {
        dropPrev = this.allowDrop(draggingNode, dropNode.node, 'prev')
        userAllowDropInner = dropInner = this.allowDrop(
          draggingNode,
          dropNode.node,
          'inner'
        )
        dropNext = this.allowDrop(draggingNode, dropNode.node, 'next')
      }
      event.dataTransfer.dropEffect = dropInner ? 'move' : 'none'
      if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
        if (oldDropNode) {
          this.$emit('node-drag-leave', draggingNode, oldDropNode.node, event)
        }
        this.$emit('node-drag-enter', draggingNode, dropNode.node, event)
      }

      if (dropPrev || dropInner || dropNext) {
        dragState.dropNode = dropNode
      }

      if (dropNode.node.nextSibling === draggingNode) {
        dropNext = false
      }
      if (dropNode.node.previousSibling === draggingNode) {
        dropPrev = false
      }
      if (dropNode.node.contains(draggingNode, false)) {
        dropInner = false
      }
      if (
        draggingNode === dropNode.node ||
        draggingNode.contains(dropNode.node)
      ) {
        dropPrev = false
        dropInner = false
        dropNext = false
      }

      const targetPosition = dropNode.$el?.getBoundingClientRect()
      const treePosition = this.$el?.getBoundingClientRect()
      let dropType
      const prevPercent = dropPrev
        ? dropInner // NOSONAR
          ? 0.25
          : dropNext // NOSONAR
          ? 0.45
          : 1
        : -1
      const nextPercent = dropNext
        ? dropInner // NOSONAR
          ? 0.75
          : dropPrev // NOSONAR
          ? 0.55
          : 0
        : 1

      const distance = event.clientY - targetPosition.top
      if (distance < targetPosition.height * prevPercent) {
        dropType = 'before'
      } else if (distance > targetPosition.height * nextPercent) {
        dropType = 'after'
      } else if (dropInner) {
        dropType = 'inner'
      } else {
        dropType = 'none'
      }

      const iconPosition = dropNode.$el
        .querySelector('.el-tree-node__expand-icon')
        ?.getBoundingClientRect()
      const dropIndicator = this.$refs.dropIndicator

      let indicatorTop
      if (dropType === 'before') {
        indicatorTop = iconPosition.top - treePosition.top
      } else if (dropType === 'after') {
        indicatorTop = iconPosition.bottom - treePosition.top
      } else {
        indicatorTop = -9999
      }

      dropIndicator.style.top = indicatorTop + 'px'
      dropIndicator.style.left = iconPosition.right - treePosition.left + 'px'

      if (dropType === 'inner') {
        addClass(dropNode.$el, 'is-drop-inner')
      } else {
        removeClass(dropNode.$el, 'is-drop-inner')
      }

      dragState.showDropIndicator =
        dropType === 'before' || dropType === 'after'
      dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner
      dragState.dropType = dropType
      this.$emit('node-drag-over', draggingNode, dropNode.node, event)
    })

    // eslint-disable-next-line
    this.$on('tree-node-drag-end', (event) => {
      const { dropType, dropNode } = dragState
      const draggingNode = this.firstDraggingNode
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      if (draggingNode && dropNode) {
        const draggingNodeCopy = { data: this.firstDraggingNode.data }
        if (dropType !== 'none') {
          draggingNode.remove()
        }

        switch (dropType) {
          case 'before':
            dropNode.node.parent.insertBefore(draggingNodeCopy, dropNode.node)
            break
          case 'after':
            dropNode.node.parent.insertAfter(draggingNodeCopy, dropNode.node)
            break
          case 'inner':
            dropNode.node.insertChild(draggingNodeCopy)
            break
        }

        if (dropType !== 'none') {
          this.store.registerNode(draggingNodeCopy)
        }

        removeClass(dropNode.$el, 'is-drop-inner')

        this.$emit(
          'node-drag-end',
          draggingNode,
          dropNode.node,
          dropType,
          event
        )
        if (dropType !== 'none') {
          this.$emit('node-drop', draggingNode, dropNode.node, dropType, event)
        }
      }
      if (draggingNode && !dropNode) {
        this.$emit('node-drag-end', draggingNode, null, dropType, event)
      }

      dragState.showDropIndicator = false
      dragState.draggingNode = null
      dragState.dropNode = null
      dragState.allowDrop = true
      this.firstDraggingNode = null
      this.isDragging = false
    })
  },

  mounted() {
    this.initTabIndex()
    this.$el.addEventListener('keydown', this.handleKeydown)
  },

  updated() {
    this.treeItems = this.$el.querySelectorAll('[role=treeitem]')
    this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]')
  }
}
</script>
