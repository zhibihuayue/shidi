<template>
  <div class="filter-search-group">
    <div class="search">
      <div class="c-input keyword-input">
        <el-input
          v-model="filterTextVal"
          suffix-icon="el-icon-search"
          placeholder="输入关键字"
          :clearable="true"
        />
        <i
          class="iconfont_tools sc_zy"
          :class="
            filterData.collect === '1'
              ? 'icon-icon_shoucang_20_s is-active'
              : 'icon-icon_shoucang_20_n'
          "
          @click="collect()"
        />
      </div>
      <div class="view">
        <div
          class="icon-box"
          :class="filterData.viewType === '1' && 'active-ct-icon'"
          @click="changeViewType('1')"
          v-if="showCardView"
        >
          <ct-icon
            class="ct-icon-style"
            :name="filterData.viewType !== '1' ? 'view' : 'view-active'"
            size="18"
          />
        </div>
        <div
          class="icon-box"
          :class="filterData.viewType === '2' && 'active-ct-icon'"
          @click="changeViewType('2')"
          v-if="showListView"
        >
          <ct-icon
            class="ct-icon-style"
            :name="filterData.viewType !== '2' ? 'cardshow' : 'cardshow-active'"
            size="18"
          />
        </div>
        <div
          class="icon-box"
          :class="filterData.viewType === '3' && 'active-ct-icon'"
          @click="changeViewType('3')"
          v-if="showTreeView"
        >
          <ct-icon
            class="ct-icon-style"
            :name="filterData.viewType !== '3' ? 'list' : 'list-active'"
            size="18"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSearchGroup',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    viewType: {
      type: String,
      default: '3'
    },
    showCardView: {
      type: Boolean,
      default: true
    },
    showListView: {
      type: Boolean,
      default: true
    },
    showTreeView: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    viewType: {
      handler(val) {
        this.filterData.viewType = val
      },
      immediate: true
    }
  },
  data() {
    return {
      filterData: {
        collect: '0',
        viewType: null
      }
    }
  },
  computed: {
    filterTextVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val) // 触发
      }
    }
  },
  methods: {
    changeViewType(type) {
      console.log(type, '视图模式')
      this.filterData.viewType = type
      if (type !== '3' && this.filterData.collect === '1') {
        this.collect('0')
      }
      this.$emit('filterViewType', this.filterData.viewType)
    },
    collect(val) {
      if (this.filterData.collect === '0') {
        this.changeViewType('3')
      }
      if (val) {
        this.filterData.collect = val
      } else {
        this.filterData.collect = this.filterData.collect === '0' ? '1' : '0'
      }
      this.$emit('filterCollect', this.filterData.collect)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.filter-search-group {
  padding: px-to-rem(12);
  width: 100%;
  height: px-to-rem(56);

  @include themeify(false) {
    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      .keyword-input {
        .el-input__suffix {
          right: px-to-rem(4);
        }
      }

      .c-input {
        min-width: px-to-rem(236);

        ::v-deep i {
          color: themed('global-text-color');
          font-size: px-to-rem(16);
          line-height: px-to-rem(32);

          &.el-icon-search {
            &::before {
              color: #fff;
              font-size: px-to-rem(20);
              font-family: iconfont;
              content: '\ea6b';
            }
          }

          &.is-active {
            color: themed('global-icon-active-color');
          }
        }

        .sc_zy {
          position: relative;
          margin: 0 px-to-rem(6);
          font-size: px-to-rem(20);

          &::after {
            position: absolute;
            top: 50%;
            left: px-to-rem(-6);
            width: 1px;
            height: px-to-rem(10);
            background: rgb(255 255 255 / 20%);
            content: '';
            transform: translateY(-50%);
            pointer-events: none;
          }
        }
      }

      .view {
        flex: 1;
        display: flex;
        align-items: center;
        padding-left: px-to-rem(12);

        .icon-box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: px-to-rem(32);
          height: px-to-rem(32);

          &.active-ct-icon {
            @if $theme-name == 'theme-aquamarine' {
              background: url('~@component-gallery/assets/image/menu-bg.png')
                no-repeat;
              background-size: 100% 100%;
            }

            @if $theme-name == 'theme-wiseblue' {
              background: #4f9fff;
              border-radius: px-to-rem(6);
            }

            @if $theme-name == 'theme-terracotta' {
              background: url('~@component-gallery/assets/image/funcicon-bg-gt.png')
                no-repeat;
              background-size: 100% 100%;
            }

            ::v-deep .ct-icon-style i {
              @if $theme-name == 'theme-wiseblue' {
                color: themed('global-text-color') !important;
              } @else {
                color: themed('global-icon-active-color') !important;
              }
            }
          }

          ::v-deep .ct-icon-style {
            width: fit-content !important;
            height: 100% !important;

            .ct-icon {
              display: flex;
              justify-content: center;
              align-items: center;
              width: fit-content !important;
              height: 100% !important;
            }

            i {
              color: themed('global-text-color') !important;
              font-size: px-to-rem(20) !important;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
