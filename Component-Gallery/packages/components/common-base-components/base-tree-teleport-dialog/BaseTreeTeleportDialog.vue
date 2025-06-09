<template>
  <absolute-container
    :width="1100"
    :height="height"
    :title="title"
    highlight-title
    @close="close"
    :class="{ ...dialogAttributeBoxClass }"
    v-drag
    v-if="visible"
  >
    <base-table :section="true" :tableData="paginatedData" :show-operation="true" :column="column">
      <template #custom="{ data }">
        <div v-if="data.col.prop === 'address'">
          <span>自定义Address列</span>
        </div>
      </template>
    </base-table>
    <base-pagination
      :page-size="5"
      layout="prev, pager, next"
      small
      :current-page="1"
      :total="100"
      @pageChange="handleChange"
    ></base-pagination>
  </absolute-container>
</template>
<script>
import AbsoluteContainer from '../absolute-container/AbsoluteContainer.vue'
import { dragBind, copyToClipboard } from '@component-gallery/utils/funCommon/common'
import { createNameSpace } from '@component-gallery/utils/bem/create'
import BasePagination from '../base-pagination/BasePagination.vue'
import BaseTable from '../base-table/BaseTable.vue'
const bem = createNameSpace('dialog-attribute')
export default {
  name: 'tree-teleport-dialog',
  components: { AbsoluteContainer, BasePagination, BaseTable },
  props: {
    // detailsData property definition
    detailsData: {
      type: Object,
      required: true // Ensures detailsData is always provided
    },
    // attrData property definition
    attrData: {
      type: Object,
      required: true // Ensures attrData is always provided
    },
    // currentAttrId property definition
    currentAttrId: {
      type: String,
      required: '' // Allows currentAttrId to be an empty string
    },
    // value property definition
    value: {
      type: Boolean,
      default: false // Sets default value to false
    },
    // height property definition
    height: {
      type: String,
      default: 'auto' // Sets default height to 'auto'
    },
    // title property definition
    title: {
      type: String,
      default: '属性' // Sets default title to '属性'
    }
  },
  directives: {
    drag: {
      bind: (el) => {
        dragBind(el)
      }
    }
  },
  data() {
    return {
      labelWidth: 3,
      isShowAttrBox: false,
      visible: this.value,
      currentPage: 1,
      tableData: [
        {
          id: 1,
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',

          zip: 200333
        },
        {
          id: 2,
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          id: 3,
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          id: 4,
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-03',
          name: '王小虎6',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-02',
          name: '王小虎7',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }
      ],
      column: [
        { prop: 'date', label: '日期', width: '150' },
        { prop: 'name', label: '姓名', width: '120' },
        { prop: 'address', label: '地址', width: '300', custom: true }
      ]
    }
  },
  // Watch for changes in attrData
  watch: {
    attrData(val) {
      // Initialize an empty array
      let tempArr = []
      // Get the values of the attribute data
      let attrArr = Object.values(val)
      // If there are attribute values
      if (attrArr) {
        // Map through each attribute value
        attrArr.map((el) => {
          // Push the length of the text of each attribute value to the temporary array
          tempArr.push(el.text.length)
        })
      }
      // Set the label width to the maximum length of the text in the temporary array plus 1
      this.labelWidth = Math.max(...tempArr) + 1
    },
    // Watch for changes in value
    value(val) {
      // Set the visibility to the value
      this.visible = val
    },
    // Watch for changes in visibility
    visible(val) {
      // Emit an input event with the new visibility value
      this.$emit('input', val)
    }
  },
  computed: {
    // Computed property to paginate table data
    paginatedData() {
      // Calculate the start and end indices for pagination
      const start = (this.currentPage - 1) * 5
      const end = start + 5
      // Return the sliced table data for the current page
      return this.tableData.slice(start, end)
    },
    // Computed property to generate class for dialog attribute box
    dialogAttributeBoxClass() {
      // Return the class object for the dialog attribute box
      return {
        [bem.b('box')]: true
      }
    },
    // Computed property to generate class for dialog attribute content
    dialogAttributeContentClass() {
      // Return the class object for the dialog attribute content
      return {
        [bem.b('content')]: true
      }
    },
    // Computed property to generate class for dialog attribute content item
    dialogAttributeContentItemClass() {
      // Return the class object for the dialog attribute content item
      return {
        [bem.b('content-item')]: true
      }
    },
    // Computed property to generate class for dialog attribute content label
    dialogAttributeContentLabelClass() {
      // Return the class object for the dialog attribute content label with dynamic ID
      return {
        [bem.b(`content-label _id${this.currentAttrId}`)]: true
      }
    },
    // Computed property to generate class for dialog attribute content value
    dialogAttributeContentValueClass() {
      // Return the class object for the dialog attribute content value
      return {
        [bem.b('content-value')]: true
      }
    }
  },
  created() {
    console.log(this.attrData)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    copyToClipboard(v) {
      copyToClipboard(v)
    },
    handleChange(e) {
      // console.log('handleChange', e)
      this.currentPage = e
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/base-tree-property-dialog';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
