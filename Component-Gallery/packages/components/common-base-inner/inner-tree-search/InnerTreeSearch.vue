<template>
  <div class="searchBox">
    <el-select
      v-model="selectVal"
      ref="sortTypeSelectBox"
      :popper-append-to-body="false"
      class="selectBox"
      @change="onSelectChange"
    >
      <c-scroll>
        <el-option
          v-for="item in selectOptions"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        ></el-option>
      </c-scroll>
    </el-select>
    <div class="inputBox">
      <el-input
        v-model.trim="inputVal"
        type="text"
        placeholder="输入关键字"
        :clearable="false"
        class="search-input"
      >
        <template v-slot:suffix>
          <em
            v-show="inputVal !== ''"
            @click="inputVal = ''"
            class="iconfont_tools icon-linye_icon_biaoqianguanbi"
          ></em>
        </template>
      </el-input>
      <base-icon iconClass="menu-wh icon-liebiaosousuo" />
      <em
        class="menu-wh"
        :class="`iconfont_tools ${
          isShowFilterBox
            ? 'clickCol icon-tongyong-liebiaoshaixuanxuanzhong'
            : 'icon-liebiaoshaixuan'
        }`"
        @click="showFilterBox"
      ></em>
      <base-icon
        :iconClass="[
          'menu-wh',
          !isShowCollect ? 'icon-icon_shoucang_20_n' : ''
        ]"
        activeClass="icon-icon_shoucang_20_s clickCol"
        @click="onCollectIconClick"
      />
    </div>

    <filter-box
      :show="isShowFilterBox"
      @hideFilter="isShowFilterBox = false"
      @chooseType="getChooseType"
    />
  </div>
</template>

<script>
import CScroll from '@component-gallery/utils/funCommon/c-scroll.vue'
import BaseIcon from '@component-gallery/base-components/base-icon/BaseIcon.vue'
import FilterBox from './components/FilterBox.vue'

export default {
  name: 'InnerTreeSearch',
  components: {
    CScroll,
    FilterBox,
    [BaseIcon.name]: BaseIcon
  },
  data() {
    return {
      inputVal: '',
      selectVal: '',
      selectOptions: [
        { label: '按区域展示', value: '1' },
        { label: '按组织展示', value: '2' },
        { label: '按标签展示', value: '3' }
      ],

      isShowCollect: false,
      isShowFilterBox: false
    }
  },
  watch: {
    inputVal: {
      handler(val) {
        console.log(val)
        this.$emit('inputChange', val)
      }
    }
  },
  methods: {
    getChooseType(list) {
      this.$emit('chooseType', list)
    },
    onCollectIconClick() {
      this.isShowCollect = !this.isShowCollect
      this.$emit('showCollect', this.isShowCollect)
    },
    // 显示筛选框
    showFilterBox() {
      this.isShowFilterBox = !this.isShowFilterBox
    },
    onSelectChange(value) {
      this.selectVal = value
      this.$emit('selectChange', value)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/tree';
</style>
