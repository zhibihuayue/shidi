<template>
  <div class="alarm-sort-bar__namespace" @click="onSortContainerClick">
    <div class="text">{{ title }}</div>
    <div class="sort-container">
      <div class="asc" :class="{ active: active === 'asc' }"></div>
      <div class="desc" :class="{ active: active === 'desc' }"></div>
    </div>
  </div>
</template>

<script>
import { noop } from '@component-gallery/utils/funCommon/common'

export default {
  name: 'AlarmSortBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    sortVal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: this.sortVal
    }
  },
  watch: {
    sortVal(val) {
      this.active = val
    }
  },
  methods: {
    // This method is triggered when the sort container is clicked
    onSortContainerClick() {
      // If the current active sort is empty, set it to 'asc'
      if (this.active === '') {
        this.active = 'asc'
      }
      // If the current active sort is 'asc', set it to 'desc'
      else if (this.active === 'asc') {
        this.active = 'desc'
      }
      // If the current active sort is 'desc', set it to 'asc'
      else if (this.active === 'desc') {
        this.active = 'asc'
      }
      // If none of the above conditions are met, do nothing
      else {
        noop()
      }
      // Emit an event to notify of the sort change
      this.$emit('sort-change', { type: this.title, val: this.active })
    },
    // This method is triggered when a specific sort type is clicked
    onSortClick(type) {
      // If the current active sort is the same as the clicked type, set it to empty
      if (this.active === type) {
        this.active = ''
      }
      // If the current active sort is not the same as the clicked type, set it to the clicked type
      else {
        this.active = type
      }
      // Emit an event to notify of the sort change
      this.$emit('sort-change', { type: this.title, val: this.active })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-wiseblue'] .alarm-sort-bar__namespace {
  --text-color: #e8f3fe;
  --text-color-70: rgba(232, 243, 254, 0.7);
  --sort-active-color: #4f9fff;
  --sort-default-color: #e8f3fe;
  --wrapper-bg: rgba(79, 159, 255, 0.2);
}

[data-theme='theme-aquamarine'] .alarm-sort-bar__namespace {
  --text-color: #ffffff;
  --text-color-70: rgba(255, 255, 255, 0.7);
  --sort-active-color: #f9ff6c;
  --sort-default-color: #ffffff;
  --wrapper-bg: rgba(2, 137, 109, 0.2);
}

[data-theme='theme-terracotta'] .alarm-sort-bar__namespace {
  --text-color: #e4e7c1;
  --text-color-70: rgba(228, 231, 193, 0.7);
  --sort-active-color: #fffa28;
  --sort-default-color: #ffeeb1;
  --wrapper-bg: rgba(100, 86, 46, 0.4);
}

.alarm-sort-bar__namespace {
  display: flex;
  align-items: center;
  height: px-to-rem(24);
  min-width: px-to-rem(98);
  background: var(--wrapper-bg);
  border-radius: px-to-rem(4);
  padding-left: px-to-rem(12);
  padding-right: px-to-rem(6);

  .text {
    color: var(--text-color);
    margin-right: px-to-rem(12);
    font-size: px-to-rem(12);
  }

  .sort-container {
    position: relative;
    left: px-to-rem(6);
    width: px-to-rem(20);
    height: px-to-rem(20);

    .asc,
    .desc {
      cursor: pointer;
      position: absolute;
      width: 0;
      height: 0;
    }

    .asc {
      border-bottom: px-to-rem(5) solid var(--sort-default-color);
      border-left: px-to-rem(4) solid transparent;
      border-right: px-to-rem(4) solid transparent;
      top: px-to-rem(3);
    }

    .desc {
      border-top: px-to-rem(5) solid var(--sort-default-color);
      border-left: px-to-rem(4) solid transparent;
      border-right: px-to-rem(4) solid transparent;
      bottom: px-to-rem(3);
    }

    .active.asc {
      border-bottom-color: var(--sort-active-color); /* 高亮颜色 */
    }

    .active.desc {
      border-top-color: var(--sort-active-color); /* 高亮颜色 */
    }
  }
}
</style>
