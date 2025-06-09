<template>
  <div class="base-input-search" :class="{ filterable }">
    <base-input v-model="query" placeholder="请输入关键字" @input="onInput">
      <template v-slot:suffix>
        <em
          v-show="query !== ''"
          @click="clear"
          class="search-icon query-icon iconfont_tools icon-linye_icon_biaoqianguanbi"
        ></em>
        <base-icon iconClass="search-icon icon-liebiaosousuo" />
        <span v-if="filterable" class="search-split"></span>
        <em
          v-if="filterable"
          :class="`search-icon iconfont_tools ${
            filter.show || filtering ? 'active icon-tongyong-liebiaoshaixuanxuanzhong' : 'icon-liebiaoshaixuan'
          }`"
          @click="filterSwitch"
        >
        </em>
        <slot name="suffix"></slot>
      </template>
    </base-input>
    <div v-if="filterable" v-show="filter.show" class="filter-container">
      <slot></slot>
      <div class="search-action">
        <base-button type="primary" :width="108" :height="32" @click="search('confirm')"> 确定 </base-button>
        <base-button :width="108" :height="32" @click="reset"> 重置 </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import BaseButton from '../../base-button/BaseButton.vue'
import BaseInput from '../base-input/BaseInput.vue'
import BaseIcon from '../../base-icon/BaseIcon.vue'
import { debounce } from 'lodash-es'

export default {
  name: 'BaseSearch',
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: true
    },
    filtering: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      query: '',
      filter: {
        show: false
      }
    }
  },
  watch: {
    value(val) {
      this.query = val
    }
  },
  mounted() {
    this.query = this.value
  },
  methods: {
    // 一个debounce的函数，用于处理输入事件
    onInput: debounce(function (e) {
      // 发射输入事件
      this.$emit('input', e)
      // 调用搜索函数
      this.search('input')
    }, 400),
    // 搜索函数
    search(type) {
      // 发射搜索事件
      this.$emit('search', type)
      // 隐藏过滤器
      this.filter.show = false
    },
    // 重置函数
    reset() {
      // 发射重置事件
      this.$emit('reset')
    },
    // 清除函数
    clear() {
      // 发射输入事件，清除输入值
      this.$emit('input', '')
      // 调用搜索函数，类型为input
      this.search('input')
    },
    // 过滤器切换函数
    filterSwitch() {
      // 切换过滤器的显示状态
      this.filter.show = !this.filter.show
      // 发射过滤器切换事件
      this.$emit('filterSwitch', this.filter.show)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.base-input-search {
  @include themeify(false) {
    // 通用
    @if $theme-name == 'theme-wiseblue' {
      --search-panel__icon-active-color: #4f9fff;
      --search-panel__filter-bg: #172537;
      --search-panel__filter-border: rgba(23, 20, 11, 0.9);
      --search-panel__filter-label-color: #e8f3fe;
      --search-panel__filter-label-text-shadow: 0px 0px #{px-to-rem(10)} rgba(74, 141, 254, 0.7);
      --search-panel__tag-border: rgba(232, 243, 254, 0.2);
      --search-panel__tag-active-border: #4f9fff;
      --search-panel__tag-active-bg: transparent;
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --search-panel__icon-active-color: #f9ff6c;
      --search-panel__filter-bg: linear-gradient(
        180deg,
        rgba(0, 67, 63, 0.85) 0%,
        rgba(0, 19, 30, 0.74) 21%,
        #00131e 100%
      );
      --search-panel__filter-border: #{px-to-rem(1)} solid #075b4a;

      --search-panel__filter-label-color: #ffffff;
      --search-panel__filter-label-text-shadow: 0px 0px #{px-to-rem(18)} rgba(0, 245, 193, 0.7);
      --search-panel__tag-border: #02896d;
      --search-panel__tag-active-border: #f9ff6c;
      --search-panel__tag-active-bg: transparent;
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --search-panel__icon-active-color: #fffa28;
      --search-panel__filter-bg: rgba(23, 20, 11, 0.9);
      --search-panel__filter-border: #{px-to-rem(1)} solid #6e674e;

      --search-panel__filter-label-color: #ffffff;
      --search-panel__filter-label-text-shadow: 0px 1px 4px #dcd277;
      --search-panel__tag-border: #9f9853;
      --search-panel__tag-active-border: #fffa28;
      --search-panel__tag-active-bg: transparent;
    }
  }
  --search-panel__tag-number: 3;

  position: relative;

  .search-icon {
    font-size: px-to-rem(18);
    line-height: 1;

    &.active {
      color: var(--search-panel__icon-active-color);
    }

    &.query-icon {
      margin-right: px-to-rem(8);
    }
  }

  .search-split {
    width: px-to-rem(1);
    margin: 0 px-to-rem(6);
    height: px-to-rem(10);
    background: rgba(232, 243, 254, 0.2);
  }

  .filter-container {
    position: absolute;
    top: px-to-rem(38);
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: px-to-rem(12);
    background: var(--search-panel__filter-bg);
    padding: px-to-rem(12);

    border-radius: px-to-rem(4);
    border: var(--search-panel__filter-border);

    z-index: 2;

    .search-item {
      display: flex;
      flex-direction: column;
      gap: px-to-rem(12);

      .search-label {
        font-size: px-to-rem(16);
        font-weight: 400;
        line-height: 1;
        color: var(--search-panel__filter-label-color);
        text-shadow: var(--search-panel__filter-label-text-shadow);
      }
    }

    .search-tags {
      display: flex;
      flex-wrap: wrap;
      gap: px-to-rem(6);

      .search-tag {
        flex: 0 0 calc((100% / var(--search-panel__tag-number)) - px-to-rem(6));
        height: px-to-rem(32);
        line-height: px-to-rem(32);
        font-size: px-to-rem(14);
        color: var(--iw-text-color);

        border: 1px solid var(--search-panel__tag-border);
        border-radius: px-to-rem(4);
        text-align: center;
        cursor: pointer;

        &.active {
          color: var(--iw-active-text-color);
          background: var(--search-panel__tag-active-bg);
          border-color: var(--search-panel__tag-active-border);
        }
      }
    }

    .search-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: px-to-rem(12);
    }
  }

  ::v-deep {
    .base-input .el-input .el-input__inner {
      padding-right: px-to-rem(60);
    }

    &.filterable .base-input .el-input .el-input__inner {
      padding-right: px-to-rem(90);
    }
  }
}
</style>
