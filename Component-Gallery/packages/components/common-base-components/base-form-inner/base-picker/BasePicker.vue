<!--
  未开发完成状态，请禁用
-->
<template>
  <div class="common-iw-s base-picker__namespace">
    <template v-if="pickerType === 'el-date-picker'">
      <el-date-picker
        class="base-picker"
        v-bind="$attrs"
        v-on="$listeners"
        :popper-class="concatPopperClass"
      />
    </template>

    <template v-if="pickerType === 'el-time-select'">
      <el-time-select
        class="base-picker"
        v-bind="$attrs"
        v-on="$listeners"
        :popper-class="concatPopperClass"
      />
    </template>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'

const bem = createNameSpace('base-number')
export default {
  props: {
    pickerType: {
      type: String,
      default: 'el-date-picker'
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    concatPopperClass() {
      return (
        'common-iw-s base-picker-popper__namespace' + ' ' + this.popperClass
      )
    }
  }
}
</script>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

//TODO
[data-theme='theme-wiseblue'] .base-picker__namespace {
  --text-color: #e8f3fe;
  --text-color-70: rgba(232, 243, 254, 0.7);
}

[data-theme='theme-aquamarine'] .base-picker__namespace {
  --text-color: #ffffff;
  --text-color-70: rgba(255, 255, 255, 0.7);
}

[data-theme='theme-terracotta'] .base-picker__namespace {
  --text-color: #e4e7c1;
  --text-color-70: rgba(228, 231, 193, 0.7);
}

.base-picker__namespace {
  > .base-picker {
    //TODO
  }
}

.base-picker-popper__namespace {
  //TODO
}
</style>
