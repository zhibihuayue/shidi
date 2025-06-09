<template>
  <div class="dropdown-type-input" @mousedown="(e) => e.stopPropagation()">
    <div :class="['input-box', dataShow && 'is-active']">
      <el-tag
        v-show="itemCheckNum"
        :disable-transitions="true"
        closable
        class="first-tag"
        @close="
          itemClick(
            dataListCopy.findIndex((o) => o.checked === '1'),
            dataListCopy.find((o) => o.checked === '1')
          )
        "
      >
        {{
          itemCheckNum ? dataListCopy.find((o) => o.checked === '1').label : ''
        }}
      </el-tag>
      <el-tag v-show="itemCheckNum > 1" class="more-tag">
        +{{ itemCheckNum - 1 }}
      </el-tag>
      <el-input class="search-input" :placeholder="nowPlaceholder" />
      <div class="searchTypeDiv right_line">
        <em
          :class="`el-icon--right ${
            dataShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
          }`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('alarm-filte')

export default {
  name: 'tag-input-box',
  props: {
    dataListCopy: {
      type: Array,
      default: () => []
    },
    itemCheckNum: {
      type: Number,
      default: 0
    },
    itemClick: {
      type: Function,
      default: null
    },
    dataShow: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  computed: {
    bemClass() {
      return {
        dropdownTypeInput: bem.b('dropdown-type-input')
      }
    }
  },
  watch: {
    itemCheckNum(val) {
      if (val > 0) {
        this.nowPlaceholder = ''
      } else {
        this.nowPlaceholder = this.placeholder
      }
    }
  },
  data() {
    return {
      keywordValue: '',
      typeInputFocus: false,
      alarmTypeShow: false,
      nowPlaceholder: this.placeholder
    }
  },
  mounted() {
    this.typeInputFocus = this.dataShow
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.dropdown-type-input {
  width: px-to-rem(256);

  // padding: px-to-rem(12);
  max-width: px-to-rem(300);
  border-radius: 8px 8px 0 0;

  .input-box {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: px-to-rem(3) px-to-rem(5);
    width: px-to-rem(270);
    height: px-to-rem(32);
    border: px-to-rem(1) solid transparent;
    border-radius: 4px;
    flex-wrap: nowrap;
    background: rgb(79 159 255 / 20%);

    &:hover {
      border: px-to-rem(1) solid rgb(79 159 255 / 100%);
    }

    &.is-active {
      border: px-to-rem(1) solid rgb(79 159 255 / 100%);
    }

    ::v-deep .el-input__inner {
      height: px-to-rem(24);
    }

    .searchTypeDiv {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    ::v-deep .el-icon--right {
      color: #e8f3fe;
      transform: rotateZ(0deg);
      &.el-icon-arrow-down,
      &.el-icon-arrow-up {
        transform-origin: 50% 46.87%; // 这个下拉箭头的尺寸有变化 所以垂直旋转中心不在center
        &::before {
          color: #e8f3fe;
          font-size: px-to-rem(20);
          font-family: 'iconfont_tools';
          content: '\ec16';
        }
      }
      &.el-icon-arrow-up {
        transform: rotateZ(180deg);
      }
    }
  }

  .search-input {
    flex: 1;

    ::v-deep .el-input__clear {
      line-height: px-to-rem(24);
      color: var(--iw-active-text-color);
    }

    ::v-deep .el-input__inner {
      padding: 0 px-to-rem(10) 0 px-to-rem(6) !important;
      background: transparent;
      border: none;
      border-radius: px-to-rem(3);
      color: var(--iw-active-text-color);
      font-size: px-to-rem(14);
      text-align: left;
    }
  }

  ::v-deep .el-button--mini {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;
    width: px-to-rem(30);
    height: px-to-rem(30);
    background: none;
    border: none;
    outline: none;
    color: var(--iw-active-text-color);
    font-size: px-to-rem(14);
    cursor: pointer;
  }

  .more-tag,
  .first-tag {
    position: relative;
    overflow: hidden;
    height: px-to-rem(24);
    background: rgb(79 159 255 / 20%);
    border: none;
    color: #e8f3fe;
    font-size: px-to-rem(12);
    text-overflow: ellipsis;
    font-weight: 400;

    ::v-deep .el-tag__close.el-icon-close {
      position: absolute;
      top: px-to-rem(2);
      right: px-to-rem(12);
      margin: 0 auto;
      width: px-to-rem(20);
      height: px-to-rem(20);
      font-size: px-to-rem(20);
      color: #e8f3fe;
      line-height: px-to-rem(20);

      &:hover {
        background-color: rgba($color: #000, $alpha: 0%) !important;
      }
    }
  }

  .more-tag {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: px-to-rem(6) px-to-rem(12);
    width: fit-content;
  }

  .first-tag {
    padding: px-to-rem(0) px-to-rem(38) px-to-rem(0) px-to-rem(12);
    max-width: px-to-rem(122);
  }

  ::v-deep .el-tag--small {
    line-height: px-to-rem(24);
  }

  .more-tag {
    line-height: px-to-rem(24);
    margin-left: px-to-rem(6);
  }

  .first-tag {
    line-height: px-to-rem(24);
  }
}
</style>
