<!-- eslint-disable vue/no-deprecated-dollar-scopedslots-api -->
<template>
  <!--
    封装的树形选择器组件。这个树形选择器不支持完整的树功能，请注意参考其props
    只接受叶子节点勾选数据。呈现方式一定是multiple/collapse-tags
    插槽透传，可以当作直接对el-tree里塞东西来控制树的节点数据
  -->
  <el-select
    ref="select"
    class="iwmiTreeSelect"
    :popper-class="`iwmiTreeSelect ${industryClass} popperClass`"
    :value="nowValue"
    :value-key="nodeKey"
    :placeholder="placeholder"
    size="mini"
    :clearable="clearable"
    :multiple="multiple"
    :collapse-tags="multiple"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterMethod"
    :popper-append-to-body="popperAppendToBody"
    style="width: 100%"
    @clear="clear"
    @remove-tag="onRemoveTag"
    @visible-change="visibleChange"
  >
    <el-option
      ref="option"
      :class="['tree-select__option', showAllCheck && 'has-allcheck']"
      :value="optionData.value"
      :label="optionData.label"
    >
      <div
        v-if="multiple && showAllCheck"
        class="custom-all-check el-tree-node__content top-organ"
      >
        <span
          :class="['expanded el-tree-node__expand-icon el-icon-caret-right']"
        />
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isAllIndeterminate"
          @change="onAllCheck"
        />
        <slot name="allcheck"> 全部 </slot>
      </div>
      <el-tree
        ref="tree"
        :class="[
          'tree-select__tree',
          `tree-select__tree--${multiple ? 'checked' : 'radio'}`
        ]"
        :node-key="nodeKey"
        :data="dataSource"
        :props="props"
        :indent="indent"
        :default-expanded-keys="defaultExpandedKeys"
        :show-checkbox="multiple"
        :highlight-current="!multiple"
        :expand-on-click-node="multiple"
        :filter-node-method="filterNode"
        :check-strictly="checkStrictly"
        @node-expand="onNodeExpand"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      >
        <template
          v-for="(slot, slotName) in $scopedSlots"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'styled-tree-select',
  props: {
    // v-model绑定
    value: {
      type: [String, Number, Array],
      default: ''
    },
    industryClass: {
      type: String,
      default: 'common-iw-s'
    },
    defaultExpandedKeys: Array,
    placeholder: String,
    popperClass: {
      type: String,
      default: ''
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 10
    },
    equalWidth: Boolean, // 下拉框浮层和输入框的部分是否等宽
    multiple: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 每个树节点用来作为唯一标识的属性
    nodeKey: {
      type: [String, Number],
      default: 'id'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // tree的props配置
    props: {
      type: Object,
      default: function () {
        return {
          label: 'label',
          children: 'children'
        }
      }
    },
    // 单选模式，选中节点的过滤方法
    nodeFilterMethod: {
      type: Function
    },
    // 是否追加一个“全部”选项。“全部”选项会在树的第一行出现。
    showAllCheck: {
      type: Boolean
    }
  },
  data() {
    return {
      nowValue: null,
      isAllSelected: false,
      isAllIndeterminate: false,
      optionData: {
        // 表示被选中的第一个选项，这是一个虚拟选项用于回显，没有业务数据上的意义
        value: '',
        label: ''
      },
      allDataId: [],
      filterFlag: false
    }
  },
  watch: {
    dataSource: {
      immediate: true,
      handler(v) {
        if (!v) {
          return
        }
        this.allDataId = this.traverseAllTreeId(v)
        this._findFirstOptionData()
      }
    },
    value: {
      immediate: true,
      handler(v) {
        const newV = Array.isArray(v) ? v.map((o) => o?.[this.nodeKey] || o) : v
        this.nowValue = newV
        if (newV) {
          // 单选模式，setCheckedKeys无效
          if (this.multiple) {
            this.$refs.tree?.setCheckedKeys(Array.isArray(v) ? newV : [newV])
          } else {
            this.$refs.tree?.setCurrentKey(newV, true)
          }
          this._findFirstOptionData()
        }
      }
    }
  },
  methods: {
    onAllCheck(val) {
      if (!this.multiple) {
        return
      }
      this.isAllSelected = val
      this.isAllIndeterminate = false

      if (this.isAllSelected) {
        // 全选，返回整棵树上所有节点数据
        const keys = this.traverseAllTreeId(this.dataSource)
        this.$refs.tree.setCheckedKeys(keys)
        const nodes = this.$refs.tree.getCheckedNodes(
          !this.checkStrictly,
          false
        )
        const value = nodes.map((o) => o[this.nodeKey])
        this.nowValue = value
        this._findFirstOptionData()
        this.$emit('input', this.nowValue, nodes)
      } else {
        this.nowValue = []
        this._findFirstOptionData()
        this.$emit('input', [], [])
      }
    },
    traverseAllTreeId(tree) {
      const result = []
      const that = this
      function traverse(nodes) {
        nodes.forEach((node) => {
          result.push(node[that.nodeKey])
          // 如果节点有子节点，则递归遍历子节点
          if (node.children && Array.isArray(node.children)) {
            traverse(node.children)
          }
        })
      }
      // 开始遍历树形结构的根节点
      traverse(tree)

      return result
    },
    // 以下为提供el-tree相同的透传方法
    onNodeExpand(data, node) {
      this.$emit('node-expand', data, node)
    },
    append(item, parentCode) {
      return this.$refs.tree.append(item, parentCode)
    },
    getNode(key) {
      return this.$refs.tree.getNode(key)
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes(true, false)
    },
    setCheckedKeys(keys, leafOnly = false) {
      return this.$refs.tree.setCheckedKeys(keys, leafOnly)
    },
    // 以上为提供el-tree相同的透传方法
    _findFirstOptionData() {
      const v = this.nowValue
      const recursionFind = (dataarr, targetId) => {
        if (dataarr?.length > 0) {
          let result
          dataarr.find((o) => {
            if (o[this.nodeKey] === targetId) {
              result = o
              return true
            }

            if (o[this.props.children]) {
              result = recursionFind(o[this.props.children], targetId)
              return !!result
            }
          })
          return result
        }
      }
      const firstId = Array.isArray(v) ? v[0]?.[this.nodeKey] || v[0] : v
      const target = recursionFind(this.dataSource, firstId)
      if (target) {
        this.optionData.value = firstId
        this.optionData.label = target[this.props.label] || null
      }
    },
    // 单选模式，节点被点击
    handleNodeClick(data) {
      if (this.multiple) {
        return
      }
      // 如果有过滤方法，并且通过了，或者没有过滤方法
      if (
        (this.nodeFilterMethod && this.nodeFilterMethod(data)) ||
        !this.nodeFilterMethod
      ) {
        this.nowValue = data[this.nodeKey]
        this.optionData.value = this.nowValue
        this.optionData.label = data[this.props.label]
        this.$emit('input', data[this.nodeKey], data) // input事件的第二个参数为原始数据
        this.$refs.select.visible = false
      }
    },
    // 多选模式，节点被勾选
    handleCheckChange() {
      if (!this.multiple) {
        return
      }
      // !this.checkStrictly取反 (是否只是叶子节点)
      const nodes = this.$refs.tree.getCheckedNodes(!this.checkStrictly, false)
      const value = nodes.map((o) => o[this.nodeKey])
      this.nowValue = value
      this._findFirstOptionData()
      this.isAllChecked = this.allDataId.length <= value.length
      this.isAllIndeterminate = !this.isAllChecked && value.length > 0
      this.$emit('input', value, nodes)
    },
    visibleChange(e) {
      if (e) {
        const tree = this.$refs.tree
        this.filterFlag && tree.filter('')
        this.filterFlag = false
        let selectDom = null
        if (this.multiple) {
          selectDom = tree.$el.querySelector('.el-tree-node.is-checked')
        } else {
          selectDom = tree.$el.querySelector('.is-current')
        }
        if (this.nowValue) {
          setTimeout(() => {
            this.$refs.select.scrollToOption({ $el: selectDom })
          }, 0)
        } else {
          setTimeout(() => {
            $(this.$refs.option.$el)
              .parents('.el-select-dropdown')
              .find('.el-select-dropdown__wrap')[0].scrollTop = 0
          }, 0)
        }

        // 阻止下拉框浮层这个层级的事件冒泡
        if (!$(this.$refs.option.$el).attr('flag')) {
          $(this.$refs.option.$el)
            .parents('.el-select-dropdown')
            .mousedown(function () {
              return false
            })
          $(this.$refs.option.$el).attr('flag', true)
        }

        if (this.equalWidth) {
          // 如果要求和输入框等宽，那么用js设置宽度
          $(this.$refs.option.$el)
            .parents('.el-select-dropdown')
            .width($(this.$refs.select.$el).width())
        }
      }
      this.$emit('visible-change', e)
    },
    onRemoveTag() {
      // 多选模式下移除单个tag
      // 在collapse-tag下一定是移除第一个选项，直接切就行
      if (Array.isArray(this.nowValue)) {
        const newnodes = this.$refs.tree.getCheckedNodes(true, false).slice(1)
        this.$refs.tree.setCheckedNodes(newnodes)
        this.nowValue = newnodes.map((o) => o[this.nodeKey])
        this._findFirstOptionData()
        this.$emit('input', this.nowValue)
      }
    },
    clear() {
      const clearVal = this.multiple ? [] : ''
      this.nowValue = clearVal
      this.$emit('input', clearVal)
    },
    filterMethod(val) {
      this.filterFlag = true
      this.$refs.tree.filter(val)
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      const label = this.props.label || 'name'
      return data[label].indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/styled-tree-select';
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/styled-tree-select-noscope';
</style>
