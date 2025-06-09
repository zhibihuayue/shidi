<!-- eslint-disable vue/no-deprecated-dollar-scopedslots-api -->
<template>
  <div :class="[bemClass.formItem, bemClass.infoFilte]">
    <el-dropdown
      ref="typeDrop"
      trigger="click"
      placement="bottom-start"
      :class="[
        dataShow ? bemClass.formItemSelected : '',
        itemCheckNum && 'active'
      ]"
      @visible-change="dropdownChangeResult"
    >
      <span
        :class="['el-dropdown-link', { 'title-selected': alarmTypeSelect }]"
      >
        <tag-input-box
          :dataListCopy="dataListCopy"
          :itemCheckNum="itemCheckNum"
          :itemClick="itemClick"
          :dataShow="tagInputBoxFocus"
        />
      </span>
      <template v-slot:dropdown>
        <el-dropdown-menu
          :class="[
            bemClass.dropdown,
            'common-iw-s',
            'typeDrop',
            bemClass.dropdownType
          ]"
          :append-to-body="false"
        >
          <div
            :class="[bemClass.dropdownTypeInput]"
            @mousedown="(e) => e.stopPropagation()"
          >
            <div :class="['input-box', typeInputFocus && 'is-active']">
              <el-input
                v-model="keywordValue"
                class="search-input"
                clearable
                placeholder="请输入"
                @focus="typeInputFocus = true"
                @blur="typeInputFocus = false"
                @input="searchClick"
                @clear="clearTypeListShow()"
              />
              <div class="searchTypeDiv right_line" @click="searchClick()">
                <em class="iconfont_tools icon-sousuoicon searchTypeIcon" />
              </div>
            </div>
          </div>
          <div
            :class="[bemClass.dropdownTypeSelect]"
            @mousedown="(e) => e.stopPropagation()"
          >
            <el-scrollbar
              ref="myscrollbar"
              :style="{ maxHeight: pxToRem(224) }"
            >
              <div v-if="radarListShow.length === 0" class="alarm-type-empty">
                <div class="alarm-type-empty-img"></div>
                <div class="alarm-type-empty-text"> 暂无数据 </div>
              </div>
              <div v-if="radarListShow.length" class="select-item">
                <div style="display: flex; cursor: pointer; width: 100%">
                  <el-checkbox
                    v-model="isRadarAllSelect"
                    style="
                      display: flex;
                      align-items: center;
                      margin-right: 10px;
                      width: 100%;
                    "
                    :indeterminate="indeterminate"
                    @click.stop
                    @change="allClick()"
                  >
                    <div
                      style="
                        overflow: hidden;
                        width: 100%;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      全部
                    </div>
                  </el-checkbox>
                </div>
              </div>
              <div
                v-for="(item, index) in radarListShow"
                :key="index"
                class="select-item"
                @click="
                  itemClick(
                    dataListCopy.findIndex((o) => o.key === item.key),
                    item
                  )
                "
              >
                <el-tooltip
                  placement="top"
                  popper-class="iwhale-speciesLYstyle"
                  :disabled="item._tooltipDisable"
                  :content="item.label"
                  :open-delay="1000"
                >
                  <div style="display: flex; cursor: pointer; width: 100%">
                    <el-checkbox
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                        width: 100%;
                      "
                      :value="item.checked === '1'"
                      @click.stop
                      @change="
                        itemClick(
                          dataListCopy.findIndex((o) => o.key === item.key),
                          item
                        )
                      "
                    >
                      <div
                        style="
                          overflow: hidden;
                          width: 100%;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                        @mouseenter="setTooltipDisabled($event, item)"
                      >
                        <span
                          v-for="(word, wordIndex) in item.label.split('')"
                          :key="word + wordIndex + ''"
                          :style="{
                            fontFamily: 'PingFangSC, PingFang SC',
                            display: 'inline-block',
                            width: 'fit-content',
                            height: 'fit-content',
                            color: (keywordValue + '').split('').includes(word)
                              ? 'var(--iw-active-text-color)'
                              : ''
                          }"
                        >
                          {{ word }}
                        </span>
                        <!-- {{ item.label }} -->
                      </div>
                    </el-checkbox>
                  </div>
                </el-tooltip>
              </div>
            </el-scrollbar>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import TagInputBox from './TagInputBox.vue'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('three-level-dropdown')

export default {
  name: 'three-level-dropdown-select',
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    selectValueChangeHandle: {
      type: Function,
      default: null
    }
  },
  components: {
    [TagInputBox.name]: TagInputBox
  },
  data() {
    return {
      dataListCopy: [],
      dataShow: false,
      itemCheckNum: 0,
      alarmTypeSelect: false,
      typeInputFocus: false,
      keywordValue: '',
      radarListShow: [],
      isRadarAllSelect: false,
      tagInputBoxFocus: false
    }
  },
  computed: {
    bemClass() {
      return {
        formItem: bem.b('form-item'),
        formItemSelected: bem.b('form-item-selected'),
        infoFilte: bem.b('info-filte'),
        dropdown: bem.b('dropdown'),
        judge: bem.b('dropdown-judge'),
        dropdownType: bem.b('dropdown-type'),
        dropdownTypeInput: bem.b('dropdown-type-input'),
        dropdownTypeSelect: bem.b('dropdown-type-select')
      }
    },
    indeterminate() {
      return (
        this.itemCheckNum > 0 && this.itemCheckNum < this.dataListCopy.length
      )
    }
  },
  mounted() {
    this.initRadarListData()
  },
  methods: {
    // 一键告警回显筛选
    filterDataShow(data, fieldName = 'id') {
      // fieldName作为区分当前所判断的属性类型
      this.radarListShow.forEach((item) => {
        item.checked = '0'
      })
      data.forEach((item) => {
        const index = this.radarListShow.find((e) => e[fieldName] === item)
        if (index) {
          index.checked = '1'
        }
      })
      this.itemCheckNum = data.length
    },
    dropdownChangeResult(show) {
      this.tagInputBoxFocus = show
    },
    initRadarListData() {
      const initList = (this.dataSource || []).map((item) => ({
        ...item,
        checked: '0'
      }))
      this.dataListCopy = [...initList]
      this.radarListShow = [...initList]

      this.resetClick()
    },
    // 告警状态/告警来源/告警类型/研判结果
    itemClick(index, data) {
      data.checked = data.checked === '0' ? '1' : '0'
      const temp = this.dataListCopy.map((item, idx) => {
        return idx === +index ? data : item
      })
      this.dataListCopy = temp
      const checkList = temp.filter((item) => item.checked === '1')
      this.itemCheckNum = checkList.length

      this.isRadarAllSelect =
        this.itemCheckNum == this.dataListCopy.length ? true : false
      this.indeterminate =
        this.itemCheckNum > 0 && this.itemCheckNum < this.dataListCopy.length

      if (this.selectValueChangeHandle) {
        this.selectValueChangeHandle(checkList)
      }
    },
    searchClick() {
      this.radarListShow = []
      this.radarListShow = this.dataListCopy.filter(
        (o) => o.label.indexOf(this.keywordValue.trim()) !== -1
      )
      this.isRadarAllSelect =
        this.itemCheckNum == this.dataListCopy.length ? true : false
      this.indeterminate =
        this.itemCheckNum > 0 && this.itemCheckNum < this.dataListCopy.length
    },
    clearTypeListShow() {
      this.searchClick()
    },
    // 重置选择事件
    resetClick() {
      this.isRadarAllSelect = true
      this.allClick()
    },
    // 全选事件
    allClick() {
      this.radarListShow.forEach((item) => {
        item.checked = this.isRadarAllSelect ? '1' : '0'
      })
      // 当取消全选 清除全量数据的选中
      if (!this.isRadarAllSelect) {
        this.dataListCopy.forEach((item) => {
          item.checked = '0'
        })
        this.selectValueChangeHandle([])
      } else {
        this.selectValueChangeHandle([...this.radarListShow])
      }
      this.itemCheckNum = this.isRadarAllSelect ? this.radarListShow.length : 0
    },
    setTooltipDisabled(e, data) {
      const trigger = e.currentTarget
      if (trigger.scrollWidth <= trigger.offsetWidth) {
        this.$set(data, '_tooltipDisable', true)
      } else {
        this.$set(data, '_tooltipDisable', false)
      }
    }
    // 确认
    // submitGoToGetAlarm(itemIndex) {
    // },
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

::v-deep .common-iw-s.el-picker-panel .el-date-table td span {
  top: 0;
  width: px-to-rem(32);
  height: px-to-rem(32);
  line-height: px-to-rem(34);
}
.three-level-dropdown {
  background: #0f1926;
  color: #e8f3fe;

  &-form {
    &-item {
      &-selected {
        background: rgb(79 159 255 / 20%);
      }
    }
  }

  &-info-filte {
    .el-dropdown {
      width: px-to-rem(270);

      &.active {
        span {
          i {
            color: #e8f3fe;
          }
        }
      }
    }
  }

  ::v-deep .el-dropdown {
    width: px-to-rem(270);
  }

  &-dropdown {
    background: #0f1926;
    border: none;

    .el-dropdown-link {
      width: px-to-rem(270);
    }

    &-type {
      &-input {
        .input-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: px-to-rem(3) px-to-rem(5);
          width: px-to-rem(270);
          height: px-to-rem(32);
          border: px-to-rem(1) solid transparent;
          border-radius: 4px;
          flex-wrap: nowrap;
          background: #0f1926;

          ::v-deep .el-input__inner {
            height: px-to-rem(32);
            background-color: #1c3451;
            color: #e8f3fe;
          }

          .search-input {
            width: px-to-rem(212);
            height: px-to-rem(32);
            line-height: px-to-rem(32);
            border-top-left-radius: px-to-rem(4);
            border-bottom-left-radius: px-to-rem(4);
            overflow: hidden;
            border-left: px-to-rem(1) solid transparent;
            border-top: px-to-rem(1) solid transparent;
            border-bottom: px-to-rem(1) solid transparent;
          }

          .searchTypeDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            width: px-to-rem(32);
            height: px-to-rem(32);
            background-color: transparent;
            border-top-right-radius: px-to-rem(4);
            border-bottom-right-radius: px-to-rem(4);
            overflow: hidden;
            border-right: px-to-rem(1) solid transparent;
            border-top: px-to-rem(1) solid transparent;
            border-bottom: px-to-rem(1) solid transparent;

            .iconfont_tools {
              height: px-to-rem(32);
              padding: px-to-rem(6);
              font-size: px-to-rem(20);
            }
          }

          .searchTypeIcon {
            background-color: rgba(79, 159, 255, 0.2);
          }

          .el-icon--right {
            color: #e8f3fe;
          }
        }

        &:hover,
        .is-active {
          .search-input {
            border-color: rgba(79, 159, 255, 0.6);
          }

          .searchTypeDiv {
            border-color: rgba(79, 159, 255, 0.6);
          }
        }

        .input-box {
          .searchTypeDiv {
            color: #e8f3fe;
          }
        }

        .search-input {
          background-color: rgba(79, 159, 255, 0.2);
          border-radius: 0;

          ::v-deep .el-input__clear {
            color: #e8f3fe;
          }

          ::v-deep .el-input__inner {
            color: #e8f3fe;

            border-color: transparent !important;
            border-radius: 0 !important;

            &:hover {
              border-color: transparent;
            }
          }

          ::v-deep .el-input__suffix {
            display: flex;
            align-items: center;
            height: px-to-rem(32);
          }
        }

        ::v-deep .el-button--mini {
          color: #e8f3fe;
        }
      }

      &-select {
        .select-item {
          height: px-to-rem(32);
          padding: px-to-rem(8) px-to-rem(12);
          color: #e8f3fe;
          font-size: px-to-rem(14);
          margin-bottom: 0;

          &:hover {
            background: rgb(79 159 255 / 40%);
          }
        }
        ::v-deep .el-scrollbar {
          .el-scrollbar__wrap {
            max-height: px-to-rem(224);
          }
        }
      }
    }

    &-other {
      &-item {
        &__title {
          color: #e8f3fe;
        }
      }

      ::v-deep .el-input__inner {
        font-size: px-to-rem(14);
      }

      ::v-deep .el-select {
        .el-select__tags {
          .el-tag {
            color: #e8f3fe;
          }

          .el-tag__close.el-icon-close {
            color: #e8f3fe;
          }
        }
      }

      ::v-deep .el-input {
        .el-input__inner {
          &::placeholder {
            color: #e8f3fe;
            font-size: px-to-rem(14);
          }
        }
      }
    }

    ::v-deep .el-checkbox {
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #4f9fff;
      }
    }

    .alarm-type-empty-text {
      padding: px-to-rem(12);
      display: flex;
      justify-content: center;
    }

    ::v-deep .el-scrollbar__view {
      padding-top: px-to-rem(12);
    }
  }

  ::v-deep .el-range-separator {
    padding-bottom: px-to-rem(2);
  }
}

.three-level-dropdown-dropdown.typeDrop.common-iw-s {
  // top: px-to-rem(28) !important;
  border-radius: 4px;
}
.three-level-dropdown-dropdown-type {
  margin-top: px-to-rem(8);
  width: px-to-rem(270);
  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
