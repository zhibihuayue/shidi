<!--
 * @Description  : tree筛选组件，配合各种tree组件使用
 * @Version      : V1.0.0
 * @Author       : Maws
 * @Date         : 2024-04-01 13:19:00
 * @LastEditors  : Maws
 * @LastEditTime : 2024-06-20 11:22:49
 * @FilePath     : BaseTreeFilterInput.vue
 * Copyright 2024 Maws, All Rights Reserved.
 * 2024-04-01 13:19:00
-->
<template>
  <div :class="{ ...filterInputClass }">
    <!-- 搜索框 -->
    <div class="searchBox">
      <el-select
        v-model="sortType"
        ref="sortTypeSelectBox"
        :popper-append-to-body="false"
        class="selectBox"
        @change="sortTypeChange('1')"
      >
        <el-option v-for="item in showTypeData" :label="item.label" :value="item.value" :key="item.value"></el-option>
      </el-select>
      <div class="inputBox">
        <el-input
          v-model="filterKeywords"
          type="text"
          placeholder="输入关键字"
          :clearable="false"
          class="search-input"
          @input="changeFilterKeywords"
        >
          <template v-slot:suffix>
            <em v-show="filterKeywords !== ''" @click="clearFilterKeywords" class="el-input__icon el-icon-error"></em>
          </template>
        </el-input>
        <base-icon iconClass="menu-wh icon-liebiaosousuo" />
        <base-icon
          :iconClass="$classNames('menu-wh', { 'icon-liebiaoshaixuan': !isClicked })"
          activeClass="icon-tongyong-liebiaoshaixuanxuanzhong clickCol"
          @click="showFilterBox"
        />
        <base-icon
          :iconClass="$classNames('menu-wh', { 'icon-weishoucang': !isShowCollect })"
          activeClass="icon-AR-yishoucang clickCol"
          @click="showCollectData('1')"
        />
      </div>
      <div v-show="isShowFilterBox" class="filterBox">
        <div class="filterTitle">摄像机类型</div>
        <div class="btnList">
          <div :class="`typeBtn ${selectedIndex === 0 ? 'choosed' : ''}`" @click="selectAllType">全部</div>
          <div
            class="typeBtn"
            v-for="(item, index) in typeLists"
            :key="index"
            @click="selectType(item.dictValue)"
            :class="{ choosed: typeThemArr.indexOf(item.dictValue) > -1 }"
            :title="item.dictLabel"
            >{{ item.dictLabel }}
          </div>
        </div>
        <div class="filterTitle">摄像机状态</div>
        <div class="btnList">
          <div
            v-for="item in chooseTypeList"
            :key="item.code"
            :class="`typeBtn ${chooseType.includes(item.code) ? 'choosed' : ''}`"
            @click="chooseTypeChange(item.code)"
            >{{ item.name }}
          </div>
        </div>
        <div class="tj_footer_btns">
          <button type="button" class="cg-button cg-button--primary" @click="cameraTypeSearch()">
            <strong></strong>
            <span>确定</span>
            <strong></strong>
          </button>
          <button type="button" class="cg-button cg-button--default" @click="resetChoose()">
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Select, Option, Input } from 'element-ui'
import BaseIcon from '../base-icon/BaseIcon.vue'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('tree-filter')
export default {
  name: 'tree-filter-input',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    BaseIcon
  },
  // Props for the BaseTreeFilterInput component
  props: {
    // Whether to show the filter box
    isShowFilterBox: {
      type: Boolean,
      default: false
    },
    // Whether the filter box is clicked
    isClicked: {
      type: Boolean,
      default: false
    },
    // Whether to show the collection
    isShowCollect: {
      type: Boolean,
      default: false
    },
    // Data for the type to be shown
    showTypeData: {
      type: Array,
      required: false
    },
    // Array of type themes
    typeThemArr: {
      type: Array,
      required: false
    },
    // Array of chosen types
    chooseType: {
      type: Array,
      required: false
    },
    // Array of type lists
    typeLists: {
      type: Array,
      required: false
    },
    // Array of chosen type lists
    chooseTypeList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      sortType: '1',
      selectedIndex: 0, // 选中全部类型
      filterKeywords: '' // 过滤关键字
    }
  },
  computed: {
    filterInputClass() {
      return {
        [bem.b('box')]: true
      }
    }
  },
  // mounted() {},
  methods: {
    // Method to clear filter keywords
    clearFilterKeywords() {
      this.filterKeywords = ''
      this.$emit('changeFilterKeywords', this.filterKeywords)
    },
    // Method to change filter keywords
    changeFilterKeywords(e) {
      this.$emit('changeFilterKeywords', e)
    },
    // Method to select all types
    selectAllType() {
      this.$emit('selectAllType', 'electAllType')
    },
    // Method to show the filter box
    showFilterBox() {
      this.$emit('showFilterBox', !this.isShowFilterBox)
    },
    // Method to change the sort type
    sortTypeChange(index) {
      this.$emit('sortTypeChange', index)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/base-tree-filter-input';
</style>
