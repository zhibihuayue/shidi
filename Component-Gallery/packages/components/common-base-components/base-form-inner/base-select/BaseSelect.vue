<template>
  <div :class="[bem.root]">
    <el-select
      ref="selectRef"
      v-model="$attrs.value"
      v-bind="$attrs"
      v-on="$listeners"
      :popper-append-to-body="popperToBody"
      :popper-class="`common-base-select-el-popper ${$attrs.popperClass}`"
    >
      <template #empty>
        <div class="select-dropdown-empty">暂无数据</div>
      </template>
      <el-option
        v-for="item in options"
        :key="item[configs.optionKey]"
        :label="item[configs.optionLabel]"
        :value="item[configs.optionKey]"
      >
        <div v-c-tip.auto="item[configs.optionLabel]" class="iclass-text-ellipsis">{{ item[configs.optionLabel] }}</div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import '@component-gallery/utils/funCommon/tooltip/directive'
const bem = createNameSpace('common-base-select')

export default {
  name: 'base-select',
  props: {
    // Defines the options array for the select component
    options: {
      type: Array,
      default: () => []
    },
    // Configures the keys for option value and label
    configs: {
      type: Object,
      default: () => ({
        optionKey: 'value',
        optionLabel: 'label'
      })
    },
    // Determines if the popper should be appended to the body
    popperToBody: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bem() {
      return {
        root: bem.b('')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-components/base-form/base-select';
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins.scss';

.common-base-select-el-popper.el-select-dropdown {
  @include themeify(false) {
    @if $theme-name == 'theme-wiseblue' {
      --base-select__input-color: #e8f3fe;
      --base-select__input-background-color: rgba(79, 159, 255, 0.2);
      --base-select__input-border-color: rgba(79, 159, 255, 0);
      --base-select__input-border-color-focus: #4f9fff;
      --base-select__input-placeholder-color: rgba(232, 243, 254, 0.7);
      --base-select__input-icon-color: #ffffff;
      --base-select__dropdown-background-color: #0f1926;
      --base-select__dropdown-background-color-hover: rgba(79, 159, 255, 0.4);
      --base-select__dropdown-color: #e8f3fe;
      --base-select__dropdown-color-hover: #4f9fff;
      --base-select__dropdown-thumb-background-color: rgba(79, 159, 255, 0.4);
      --base-select__dropdown-empty-color: rgba(232, 243, 254, 0.7);
    }

    @if $theme-name == 'theme-terracotta' {
      --base-select__input-color: #e4e7c1;
      --base-select__input-background-color: rgba(100, 86, 46, 0.4);
      --base-select__input-border-color: rgba(255, 238, 177, 0);
      --base-select__input-border-color-focus: #ffeeb1;
      --base-select__input-placeholder-color: rgba(228, 231, 193, 0.7);
      --base-select__input-icon-color: #ffeeb1;
      --base-select__dropdown-background-color: rgba(23, 20, 11, 0.9);
      --base-select__dropdown-background-color-hover: rgba(100, 86, 46, 0.4);
      --base-select__dropdown-color: #e4e7c1;
      --base-select__dropdown-color-hover: #fffa28;
      --base-select__dropdown-thumb-background-color: rgba(255, 238, 177, 0.4);
      --base-select__dropdown-empty-color: rgba(228, 231, 193, 0.7);
    }

    @if $theme-name == 'theme-aquamarine' {
      --base-select__input-color: #ffffff;
      --base-select__input-background-color: rgba(2, 137, 109, 0.2);
      --base-select__input-border-color: rgba(2, 137, 109, 0);
      --base-select__input-border-color-focus: #02896d;
      --base-select__input-placeholder-color: rgba(255, 255, 255, 0.7);
      --base-select__input-icon-color: #ffffff;
      --base-select__dropdown-background-color: linear-gradient(
        180deg,
        rgba(0, 67, 63, 0.85) 0%,
        rgba(0, 19, 30, 0.74) 21%,
        #00131e 100%
      );
      --base-select__dropdown-background-color-hover: rgba(2, 137, 109, 0.4);
      --base-select__dropdown-color: #ffffff;
      --base-select__dropdown-color-hover: #f9ff6c;
      --base-select__dropdown-thumb-background-color: rgba(2, 137, 109, 0.4);
      --base-select__dropdown-empty-color: rgba(255, 255, 255, 0.7);
    }
  }

  position: absolute !important;
  max-width: px-to-rem(322) !important;
  max-height: px-to-rem(256) !important;
  background: var(--base-select__dropdown-background-color) !important;
  border: none;
  border-radius: px-to-rem(4) !important;

  .popper__arrow {
    display: none;
  }

  .el-select-dropdown__list {
    max-height: px-to-rem(256);
    padding: 0;
    border-radius: px-to-rem(4);

    .el-select-dropdown__item {
      padding: 0 px-to-rem(12);

      height: px-to-rem(32);
      line-height: px-to-rem(32);

      font-weight: 400;
      font-size: px-to-rem(14);
      color: var(--base-select__dropdown-color);
      background-color: transparent;

      &.selected {
        background: var(--base-select__dropdown-background-color-hover);
        color: var(--base-select__dropdown-color-hover);

        &::after {
          right: px-to-rem(12);
        }
      }
      &:hover {
        background: var(--base-select__dropdown-background-color-hover);
        color: var(--base-select__dropdown-color-hover);
      }

      &:first-child {
        border-top-left-radius: px-to-rem(4);
        border-top-right-radius: px-to-rem(4);
      }

      &:last-child {
        border-bottom-left-radius: px-to-rem(4);
        border-bottom-right-radius: px-to-rem(4);
      }
    }
  }

  .el-scrollbar__thumb {
    background: var(--base-select__dropdown-thumb-background-color);
    border-radius: px-to-rem(3);
  }

  .select-dropdown-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: px-to-rem(12);
    font-size: px-to-rem(14);
    color: var(--base-select__dropdown-empty-color);
  }

  &[x-placement^='bottom'] {
    margin-top: px-to-rem(6);
  }

  .iclass-text-ellipsis {
    max-width: px-to-rem(150);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
