<template>
  <div class="area-filter-sort">
    <el-select
      v-model="provice"
      class="area-select mini"
      popper-class="area-select-dropdown to-body"
      placeholder="全国"
      :popper-append-to-body="false"
      :clearable="true"
      @change="changeAreaData('provice')"
    >
      <el-option
        v-for="(item, index) in provicesList"
        :key="index"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    <el-select
      v-model="city"
      class="area-select mini"
      popper-class="area-select-dropdown to-body"
      placeholder="市"
      :popper-append-to-body="false"
      :clearable="true"
      @change="changeAreaData('city')"
    >
      <el-option
        v-for="(item, index) in citysList"
        :key="index"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    <el-select
      v-model="district"
      class="area-select mini"
      popper-class="area-select-dropdown to-body"
      placeholder="县"
      :popper-append-to-body="false"
      :clearable="true"
      @change="changeAreaData('district')"
    >
      <el-option
        v-for="(item, index) in districtsList"
        :key="index"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    <el-select
      v-model="town"
      class="area-select mini"
      popper-class="area-select-dropdown to-body"
      placeholder="乡镇"
      :popper-append-to-body="false"
      :clearable="true"
      @change="changeAreaData('town')"
    >
      <el-option
        v-for="(item, index) in townsList"
        :key="index"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    <el-tooltip
      :content="tips"
      :placement="placement"
      popper-class="tooltip-popper"
    >
      <div class="sort" @click="changeSort">
        <i class="iconfont icon-zhixiang-zhishiqishang" :class="{ on: sort }" />
        <i class="iconfont icon-zhixiang-zhishiqixia" :class="{ on: !sort }" />
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { setupCTips } from '@component-gallery/utils/funCommon/c-tip'

export default {
  name: 'AreaFilterSort',
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    tips: {
      type: String,
      default: ''
    },
    provicesList: {
      type: Array,
      default: () => []
    },
    citysList: {
      type: Array,
      default: () => []
    },
    districtsList: {
      type: Array,
      default: () => []
    },
    townsList: {
      type: Array,
      default: () => []
    },
    areaData: {
      type: Object,
      default: () => ({
        provice: '',
        city: '',
        district: '',
        town: '',
        sort: false
      })
    }
  },
  data() {
    return {
      provice: '',
      city: '',
      district: '',
      town: '',
      sort: false
    }
  },
  mounted() {
    setupCTips()
  },
  methods: {
    changeSort() {
      this.sort = !this.sort
      this.changeAreaData('sort')
    },
    changeAreaData(key) {
      if (key === 'sort') {
        this.$set(this.areaData, key, this[key])
        return
      }
      let keys = ['provice', 'city', 'district', 'town']
      const index = keys.indexOf(key)
      const newKeys = keys.slice(index + 1)
      newKeys.forEach((item) => {
        this[item] = ''
        this.$set(this.areaData, item, this[item])
      })
      this.$set(this.areaData, key, this[key])
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.area-filter-sort {
  display: flex;
  align-items: center;
  padding: 0 px-to-rem(12);
  height: px-to-rem(32);

  @include themeify(false) {
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
    ::v-deep .el-input__suffix-inner {
      display: flex;
      align-items: center;
      i {
        color: #fff;
      }
    }

    .sort {
      overflow: hidden;
      margin-left: px-to-rem(2);
      width: px-to-rem(20);

      i {
        display: block;
        height: px-to-rem(10);
        font-size: px-to-rem(18);
        text-align: center;
        line-height: px-to-rem(10);
        cursor: pointer;

        &.on {
          color: themed('global-icon-active-color') !important;
        }
      }
    }

    .area-select {
      position: relative;
      margin-left: px-to-rem(6);
      width: 100%;
      height: px-to-rem(32) !important;
      background: themed('alarm-detail-input-background') !important;
      border: 0 !important;
      border-radius: px-to-rem(4) !important;
      font-size: px-to-rem(14) !important;
      flex: 1;
      line-height: px-to-rem(32) !important;
      ::v-deep .el-icon-arrow-up {
        &::before {
          font-size: px-to-rem(20) !important;
          font-weight: 500;
          font-family: 'iconfont_tools' !important;
          content: '\ec0c';
        }
      }

      ::v-deep .el-input__inner {
        height: px-to-rem(32) !important;
        background: transparent !important;
        border: none !important;
        color: themed('global-text-color') !important;
        font-size: px-to-rem(14) !important;

        &::placeholder {
          color: themed('global-text-color') !important;
          font-size: px-to-rem(14) !important;
        }
      }

      &:not(.readonly, .disabled):hover::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        border: px-to-rem(1) solid themed('alarm-detail-input-hover-border');
        border-radius: inherit;
        content: '';
        pointer-events: none;
      }

      &:not(.readonly, .disabled):focus-within::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        border: px-to-rem(1) solid themed('alarm-detail-input-hover-border');
        border-radius: inherit;
        content: '';
        pointer-events: none;
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.area-select-dropdown {
  @include themeify(false) {
    overflow: hidden;
    margin: px-to-rem(6) 0 !important;
    width: 100% !important;
    @if $theme-name == 'theme-aquamarine' {
      background: linear-gradient(180deg, rgb(0 19 30 / 70%) 0%, #00131e 100%),
        linear-gradient(
          180deg,
          rgb(2 137 109 / 100%) 0%,
          rgb(2 137 109 / 0%) 100%
        ) !important;
      border: 1px solid #075b4a !important;
    }

    @if $theme-name == 'theme-terracotta' {
      background: linear-gradient(#36301b 0%, #000 100%) !important;
      border: 1px solid #6e674e !important;
    }

    @if $theme-name == 'theme-wiseblue' {
      background: #0f1926 !important;
      border: 1px solid rgb(0 0 0 / 0%) !important;
    }

    border: none !important;
    border-radius: px-to-rem(4) !important;
    color: themed('global-text-color') !important;
    backdrop-filter: none !important;

    .el-select-dropdown__list {
      padding: 0 !important;

      .el-select-dropdown__item {
        color: themed('global-text-color') !important;
        font-size: px-to-rem(14) !important;

        &.hover,
        &:hover {
          background: themed('tree-primary-color') !important;
        }
      }
    }

    .el-select-dropdown__empty {
      padding: 0 !important;
      color: themed('global-text-color') !important;
    }

    .el-scrollbar__bar.is-vertical {
      right: 0 !important;
    }

    .el-scrollbar__wrap {
      overflow: auto !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;

      &::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        opacity: 0;
      }
    }

    .popper__arrow {
      display: none !important;
    }
  }
}
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

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
