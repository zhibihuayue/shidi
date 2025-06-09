<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-14 13:59:15
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-11-15 00:03:06
 * @FilePath: 基础table组件，
  0：highlight-current-row 是否开启高亮
  1: 通过传入的tableData和column渲染表格
  2: 通过section属性控制是否显示radio
  3: 通过showOperation属性控制是否显示操作列
  5: 通过operation插槽渲染操作列 -使用行的 row 作为插槽
  6: 通过tooltip属性控制是否显示tooltip
  7: 通过section属性控制是否显示radio
  9: 通过custom插槽渲染表格内容 -使用列的 prop 名称作为插槽
  10: 操作区别用button
  11: :draggableOptions="{ draggable: true, handle: 'address' }" 控制是否可以拖拽以及可以拖拽的列
  12: tableHeight 控制表格高度 默认272px 通过传入的tableHeight控制表格高度
  13: colIndex 索引列
  14: tableType 支持单选 多选 默认为空
  15: 通过header插槽自定义列表头- 使用列的 header 属性判断是否启用插槽
-->
<template>
  <div :class="[genCommonWrapper, 'common-iw-s']" ref="tableAll">
    <el-table
      :data="localTableDataRef"
      ref="singleTable"
      style="width: 100%"
      v-bind="$attrs"
      v-on="$listeners"
      tooltip-effect="dark baseTableTooltips"
      :style="tableStyle"
      :row-key="
        (row) => {
          row?.[colIndex]
        }
      "
      @row-click="rowClick"
    >
      <el-table-column v-if="section || tableType === 'radio'" :width="realPx(52)" align="center" label="">
        <template v-slot="scope">
          <base-radio
            v-model="radio"
            :radioValue="scope.row[colIndex]"
            class="base-table-inner-radio"
            @input.native.stop="handleRadioChange(scope.row)"
          >
            {{ '' }}
          </base-radio>
        </template>
      </el-table-column>
      <el-table-column v-if="tableType === 'checkbox'" type="selection" width="55"> </el-table-column>
      <el-table-column
        v-for="col in column"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="realPx(col.width)"
        :show-overflow-tooltip="col.tooltip"
      >
        <template v-if="col.header" v-slot:header="scope">
          <slot name="header" :data="{ col, row: scope.row, rowIndex: scope.$index }" />
        </template>
        <template v-if="col.custom" v-slot="scope">
          <slot name="custom" :data="{ col, row: scope.row, rowIndex: scope.$index }"> </slot>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="realPx(operationWidth)" v-if="showOperation">
        <template v-slot="scope">
          <div class="base-table-operation">
            <slot name="operation" :row="scope.row" :rowIndex="scope.$index"> </slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import BaseRadio from '../base-radio/BaseRadio.vue'
import Sortable from 'sortablejs'
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('common-base')
export default {
  name: 'base-table',
  inheritAttrs: false,
  components: {
    BaseRadio
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    column: {
      type: Array,
      default: () => []
    },
    section: {
      type: Boolean,
      default: false
    },
    tableType: {
      type: String,
      default: ''
    },
    showOperation: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      // 表格高度 默认272px
      type: String,
      default: '272px'
    },
    operationWidth: {
      /** operationWidth
       *  操作列宽度 默认92
       */
      type: Number,
      default: 92
    },
    colIndex: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localTableDataRef: [],
      tableHeaderRef: [],
      currentRow: null,
      radio: ''
    }
  },
  mounted() {
    this.initializeTableData()
    const { draggableOptions } = this.$attrs
    if (draggableOptions && Object.prototype.hasOwnProperty.call(draggableOptions, 'draggable')) {
      this.rowDrop()
    }
  },
  computed: {
    // 生成通用包装器样式
    genCommonWrapper() {
      return {
        [bem.b('table')]: true // 使用BEM命名法生成样式
      }
    },
    // 计算表格样式
    tableStyle() {
      return {
        'min-height': '0', // 设置最小高度为0
        'height': this.tableHeight, // 设置高度为传入的tableHeight
        '--empty-block-height': this.tableHeight // 设置空块高度为tableHeight
      }
    },
    // 计算空块样式
    emptyBlockStyle() {
      return {
        height: this.tableHeight + ' !important' // 设置高度为tableHeight，并标记为重要
      }
    }
  },
  watch: {
    // 监听tableData的变化
    tableData: {
      // 当tableData发生变化时执行的函数
      handler() {
        // 初始化表格数据
        this.initializeTableData()
      },
      // 是否在组件创建时立即执行一次
      immediate: true,
      // 是否深度监听
      deep: true
    },
    // 监听radio的变化
    radio: {
      // 当radio发生变化时执行的函数
      handler(val, oVal) {
        // 打印当前值和旧值
        console.log(val, oVal)
      }
    }
  },
  methods: {
    // 定义rowDrop方法，用于实现行的拖拽功能
    rowDrop() {
      // 获取表格体的tbody元素
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      // 保存当前组件的this指向
      const _this = this
      // 获取传入的draggableOptions
      const { draggableOptions } = _this.$attrs
      // 使用Sortable库创建一个可排序的列表
      Sortable.create(tbody, {
        // 根据draggableOptions指定的handle来设置拖拽的句柄
        handle: Object.prototype.hasOwnProperty.call(draggableOptions, 'handle') ? `.${draggableOptions.handle}` : '',
        // 当拖拽结束时执行的回调函数
        onEnd({ newIndex, oldIndex }) {
          // 从旧索引位置移除当前行，并将其插入到新索引位置
          const currRow = _this.localTableDataRef.splice(oldIndex, 1)[0]
          _this.localTableDataRef.splice(newIndex, 0, currRow)
        }
      })
    },
    // 定义rowClick方法，用于处理行的点击事件
    rowClick(row) {
      // 如果当前行已被选中
      if (this.currentRow) {
        // 如果当前行的索引列值与点击的行的索引列值相同
        if (this.currentRow[this.colIndex] === row[this.colIndex]) {
          // 设置当前行为点击的行
          this.$refs.singleTable.setCurrentRow(row)
        } else {
          // 查找当前行在localTableDataRef中的位置
          let obj = this.localTableDataRef.find((tableItem) => {
            return tableItem[this.colIndex] == this.currentRow[this.colIndex]
          })
          // 设置当前行为查找到的行
          this.$refs.singleTable.setCurrentRow(obj)
        }
      } else {
        // 如果当前行未被选中，则直接设置当前行为点击的行
        this.$refs.singleTable.setCurrentRow(this.currentRow)
      }
    },
    // 定义initializeTableData方法，用于初始化表格数据
    initializeTableData() {
      // 将传入的tableData转换为localTableDataRef
      this.localTableDataRef = this.tableData.map((item) => ({
        ...item
      }))

      // 将传入的column转换为tableHeaderRef
      this.tableHeaderRef = this.column.map((item) => ({
        label: item.label
      }))

      // 如果当前行已被选中
      if (this.currentRow !== null) {
        // 在下一个tick中执行
        this.$nextTick(() => {
          // 查找当前行在localTableDataRef中的位置，并设置为当前行
          this.$refs.singleTable.setCurrentRow(
            this.localTableDataRef.find((v) => v?.[this.colIndex] == this.currentRow?.[this.colIndex])
          )
        })
      }
    },
    // 定义handleRadioChange方法，用于处理单选框的变化
    handleRadioChange(selectedRow) {
      // 遍历localTableDataRef，设置每行的selected属性为false
      this.localTableDataRef.forEach((row) => {
        row.selected = false
        // 如果当前行的索引列值与选中的行的索引列值相同，则设置为true
        if (row[this.colIndex] == selectedRow[this.colIndex]) {
          row.selected = true
        }
      })
      // 更新当前行为选中的行
      this.currentRow = selectedRow
      // 设置当前行为选中的行
      this.$refs.singleTable.setCurrentRow(selectedRow)
      // 发射radio-change事件，并传递选中的行
      this.$emit('radio-change', selectedRow)
    },
    // 定义realPx方法，用于将像素值转换为实际像素值
    realPx(px) {
      // 获取html元素
      const ele = document.querySelector('html')
      // 获取html元素的字体大小
      const fontSize = window.getComputedStyle(ele).fontSize.split('px')[0]
      // 将像素值转换为rem值
      const rem = this.pxToRem(px).split('rem')[0]
      // 计算实际像素值
      const result = Number(rem) * Number(fontSize)
      // 返回实际像素值
      return result.toString() + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@component-gallery/theme-chalk/src/base-components/base-table';
</style>

<style lang="scss" scoped>
::v-deep .el-table {
  .el-table__body-wrapper {
    .el-table__empty-block {
      height: var(--empty-block-height) !important;
    }
  }
}
</style>

<style lang="scss">
@import '@component-gallery/theme-chalk/src/base-components/base-table-tooltip.scss';
</style>
