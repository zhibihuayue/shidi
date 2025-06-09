<template>
  <div class="list-view">
    <slot></slot>
    <el-scrollbar class="scrollbar">
      <div
        class="item"
        :class="item.checked && 'checked'"
        v-for="(item, index) in dataList"
        :key="index"
        @click="clickItem(item, index)"
      >
        <i class="index">{{ index + 1 }}</i>
        <span
          class="label"
          :c-tip="item[config.name]"
          c-tip-placement="top"
          v-html="
            $options.filters.filterColor(item[config.name], filterKeywords)
          "
        ></span>
        <el-tooltip
          popper-class="tooltip-popper"
          :content="content"
          placement="top"
        >
          <span
            v-if="config.icon"
            class="num iconfont_tools"
            :class="config.icon"
          ></span>
          <img class="img-sty" v-else-if="config.img" :src="config.img" />
        </el-tooltip>
        <span class="item-num">{{ item[config.number] }}</span>
      </div>
      <div class="no-data" v-if="!dataList?.length">暂无数据</div>
    </el-scrollbar>
  </div>
</template>

<script>
import { setupCTips } from '@component-gallery/utils/funCommon/c-tip'
export default {
  name: 'listView',
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    filterKeywords: {
      type: String,
      default: () => ''
    },
    content: {
      type: String,
      default: () => ''
    },
    config: {
      type: Object,
      default: () => ({
        name: 'nameF',
        number: 'treeAge'
      })
    }
  },
  mounted() {
    setupCTips()
  },
  methods: {
    clickItem(data, dataIndex) {
      const checked = data.checked
      this.dataList.forEach((item, index) => (item.checked = false))
      if (!checked) {
        this.$set(
          this.dataList[dataIndex],
          'checked',
          !this.dataList[dataIndex].checked
        )
      }
      this.$forceUpdate()
      this.$emit('clickItem', { data: { ...data, isNotTree: true, level: 5 } })
    }
  },
  filters: {
    filterColor(value, key) {
      if (key && value && value.indexOf(key) !== -1) {
        return value.replaceAll(
          key,
          '<font style="color: #F9FF6C">' + key + '</font>'
        )
      }
      return value
    }
  }
}
</script>

<style scoped lang="scss">
@import './list-view';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.img-sty {
  width: px-to-rem(13);
  height: px-to-rem(13);
  margin-right: px-to-rem(15);
}

.tooltip-popper {
  font-size: px-to-rem(14) !important;

  @include themeify(false) {
    @if $theme-name == 'theme-aquamarine' {
      background: #00221b !important;
      color: #fff !important;

      .popper__arrow {
        border-top-color: #00221b !important;

        &::after {
          border-top-color: #00221b !important;
        }
      }
    }

    @if $theme-name == 'theme-terracotta' {
      background: rgb(22 18 9 / 95%) !important;
      color: #e4e7c1 !important;

      .popper__arrow::after {
        border-top-color: #00221b !important;
      }
    }

    @if $theme-name == 'theme-wiseblue' {
      background: #0f1926 !important;
      color: #e8f3fe !important;

      .popper__arrow::after {
        border-top-color: #0f1926 !important;
      }
    }
  }
}
</style>
