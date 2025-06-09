<!--
 * @Author: shiyzhang
 * @Date: 2025/01/13
 * @Description: 分页组件
 -->
<template>
  <div class="pagination">
    <el-pagination
      :layout="layout"
      :total="total"
      small
      :current-page="currentPage"
      :page-size="pageSize"
      :pageSizes="pageSizes"
      @current-change="currentChange"
      @size-change="sizeChange"
      popper-class="pag-pagination-popper-class"
    >
      <slot>
        <span class="other-info">第{{ currentPage }}页/共{{ total }}条</span>
      </slot>
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: 'slot,prev, pager, next'
    },
    pageSizes: {
      type: Array,
      default: () => [12, 24, 36, 48]
    }
  },
  methods: {
    currentChange(val) {
      this.$emit('update:currentPage', val)
      this.$emit('changePagination', {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
    },
    sizeChange(val) {
      this.$emit('update:pageSize', val)
      this.$emit('update:currentPage', 1)
      this.$emit('changePagination', {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.pagination {
  @include themeify(false) {
    // 通用
    @if $theme-name == 'theme-wiseblue' {
      --text-color: #e8f2fe;
      --text-disabled-color: rgba(232, 242, 254, 0.4);
      --btn-active-color: #4f9fff;
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --text-color: #ffffff;
      --text-disabled-color: rgba(232, 242, 254, 0.4);
      --btn-active-color: #02896d;
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --text-color: #e4e7c1;
      --text-disabled-color: rgba(232, 242, 254, 0.4);
      --btn-active-color: #9f9853;
    }
  }
  .other-info {
    color: var(--text-color);
    font-size: px-to-rem(16);
  }

  ::v-deep {
    .el-pagination {
      .el-pager {
        li {
          background: transparent;
          color: var(--text-color);
          font-size: px-to-rem(16);
          &.active {
            background: var(--btn-active-color);
            border-radius: px-to-rem(4);
          }
        }
      }

      .btn-prev,
      .btn-next {
        padding: 0;
        .el-icon {
          font-size: px-to-rem(16);
        }
      }
      .el-pagination__total,
      .el-pagination__jump {
        font-size: px-to-rem(16);
        color: var(--text-color);
      }
      .el-pagination__total {
        padding-left: px-to-rem(6);
      }
      .el-pagination__jump {
        margin-left: px-to-rem(6);
      }
      .el-pagination__sizes {
        margin-right: 0;
      }
      button {
        background: transparent;
        color: var(--text-color);
      }
      button:disabled {
        color: var(--text-disabled-color);
      }
      .el-input__inner {
        color: var(--text-color);
        font-size: px-to-rem(16);
        background: rgba(79, 159, 255, 0.2);
        border-color: transparent;
        margin-top: px-to-rem(-4);
      }
    }
  }
}
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.pag-pagination-popper-class {
  border: none;
  border-radius: px-to-rem(8);
  box-shadow: none;
  background: #0f1926;
  min-width: px-to-rem(100) !important;
  .popper__arrow {
    display: none;
  }
  .el-scrollbar {
    border-radius: px-to-rem(8);
  }
  .el-select-dropdown__wrap {
    color: #e8f3fe;
    overflow: hidden;
    //width: px-to-rem(120);
    border: none;
    border-radius: px-to-rem(8);
  }
  .el-select-dropdown__item {
    color: #e8f3fe;
    background-color: transparent;
    position: relative;
    overflow: hidden;
    //padding: 0 px-to-rem(20) 0 px-to-rem(10);
    height: px-to-rem(34);
    font-size: px-to-rem(16) !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: px-to-rem(34);
  }
  .el-select-dropdown__item:hover {
    background: rgba(79, 159, 255, 0.4);
    color: #e8f3fe;
  }
  .el-select-dropdown__item.selected {
    background: rgba(79, 159, 255, 0.4);
    color: #4f9fff;
  }
}
</style>
