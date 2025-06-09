<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div class="el-color-dropdown base-color-dropdown common-iw-s" v-show="showPopper">
      <div class="el-color-dropdown__main-wrapper">
        <sv-panel ref="sl" :color="color"></sv-panel>
        <hue-slider ref="hue" :color="color" vertical style="float: right"></hue-slider>
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider>
      <pre-define v-if="predefine" :color="color" :colors="predefine"></pre-define>
      <div class="el-color-dropdown__inputs">
        <div class="el-color-dropdown__value color-input">
          <el-input
            v-model="customInput"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
            @change="handleConfirm"
            :validate-event="false"
            size="mini"
          >
          </el-input>
        </div>
        <div class="el-color-dropdown__value alpha-input">
          <el-input
            v-model="customAlpha"
            @keyup.native.enter="handleAlpha"
            @blur="handleAlpha"
            :validate-event="false"
            size="mini"
          >
          </el-input>
        </div>
        <div v-if="showBorder" class="el-color-dropdown__value border-input">
          <el-select
            ref="borderSelect"
            v-model="customBorder"
            popper-class="common-iw-s color-dropdown__select-popper"
            @visible-change="onVisibleChange"
            @change="changeBorder"
          >
            <el-option v-for="item in borders" :key="item.value" :value="item.value">
              <div class="border-option">
                <span>{{ item.label }}</span>
                <span class="line" :style="{ height: item.label }"></span>
              </div>
            </el-option>
          </el-select>
          <div class="border-display" @click="borderSelect">
            <ct-icon name="border-setting" />
            <div>{{ customBorder }}px</div>
            <span class="line" :style="{ height: customBorder + 'px' }"></span>
          </div>
        </div>
      </div>
      <div class="el-color-dropdown__footer">
        <div class="el-color-dropdown__btns">
          <el-button
            v-if="showBorder && borderDirection"
            size="mini"
            class="border-direction-btn"
            @click="changeDirection()"
          >
            <ct-icon name="gaifangxiang" />
          </el-button>
          <div v-if="showArrow" class="el-color-dropdown__value border-input arrow">
            <el-select
              ref="arrowSelect"
              v-model="customArrow"
              popper-class="common-iw-s color-dropdown__select-popper"
              @visible-change="onArrowVisibleChange"
              @change="changeArrow"
            >
              <el-option v-for="item in arrows" :key="item.value" :value="item.value">
                <div class="border-option">
                  <em :class="`iconfont iconfont_tools ${item.iconName} arrow-icons`" />
                  <span>{{ item.label }}</span>
                </div>
              </el-option>
            </el-select>
            <div class="border-display" @click="arrowSelect">
              <em :class="`iconfont iconfont_tools ${arrows[customArrow - 1].iconName} arrow-icons`" />
            </div>
          </div>
        </div>
        <div class="el-color-dropdown__btns">
          <el-button size="mini" class="el-color-dropdown__link-btn" @click="$emit('reset', 'reset')"> 重置 </el-button>
          <el-button type="primary" size="mini" class="el-color-dropdown__btn" @click="confirmValue"> 确定 </el-button>
          <el-button size="mini" class="el-color-dropdown__link-btn" @click="$emit('close')"> 取消 </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from './SvPanel'
import HueSlider from './HueSlider'
import AlphaSlider from './AlphaSlider'
import PreDefine from './PreDefineTool'
import Popper from 'element-ui/src/utils/vue-popper'
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'
import ElButton from 'element-ui/packages/button'

export default {
  name: 'el-color-picker-dropdown',
  mixins: [Popper, Locale],
  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    PreDefine
  },
  props: {
    color: {
      required: true
    },
    border: Object,
    showBorder: Boolean,
    showArrow: Boolean,
    showAlpha: Boolean,
    predefine: Array,
    borderDirection: String,
    borderWidth: Number,
    arrowType: Number
  },
  data() {
    return {
      customInput: '',
      customAlpha: '',
      customBorder: '1',
      customerDirection: 'asc',
      customArrow: 1
    }
  },
  watch: {
    showPopper(val) {
      if (val === true) {
        this.customBorder = Number(this.borderWidth)
        this.customArrow = Number(this.arrowType)
        this.customerDirection = this.borderDirection

        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs
          sl && sl.update()
          hue && hue.update()
          alpha && alpha.update()
        })
      }
    },
    currentColor: {
      handler(val) {
        this.customInput = this.color.toHax()
      },
      immediate: true
    },
    currentAlpha: {
      handler(val) {
        this.customAlpha = val + '%'
      },
      immediate: true
    },
    borderWidth: {
      handler(val) {
        this.customBorder = Number(val)
      },
      immediate: true
    },
    arrowType: {
      handler(val) {
        this.customArrow = Number(val)
      },
      immediate: true
    }
  },
  computed: {
    currentColor() {
      const parent = this.$parent
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value
    },
    currentAlpha() {
      const parent = this.$parent
      return !parent.value && !parent.showPanelColor ? '' : parent.color._alpha
    },
    borders() {
      return [
        {
          value: 1,
          label: '1px'
        },
        {
          value: 2,
          label: '2px'
        },
        {
          value: 3,
          label: '3px'
        },
        {
          value: 4,
          label: '4px'
        },
        {
          value: 5,
          label: '5px'
        },
        {
          value: 6,
          label: '6px'
        },
        {
          value: 7,
          label: '7px'
        },
        {
          value: 8,
          label: '8px'
        },
        {
          value: 9,
          label: '9px'
        }
      ]
    },
    arrows() {
      return [
        {
          value: 1,
          iconName: 'icon-tongyong_yuzhiwei_icon_zuojiantou_s',
          label: '左箭头'
        },
        {
          value: 2,
          iconName: 'icon-tongyong_yuzhiwei_icon_youjiantou_n',
          label: '右箭头'
        },
        {
          value: 3,
          iconName: 'icon-tongyong_yuzhiwei_icon_zhixian_n',
          label: '无箭头'
        }
      ]
    }
  },
  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$el
  },
  methods: {
    confirmValue() {
      this.$emit('pick')
      if (this.showBorder) {
        this.$emit('border', {
          width: this.customBorder,
          direction: this.customerDirection,
          arrowType: this.customArrow
        })
      }
    },
    handleConfirm() {
      this.color.fromString(this.customInput)
    },
    handleAlpha() {
      this.color.set('alpha', Number(this.customAlpha.replace('%', '')))
    },
    onVisibleChange(event) {
      if (event) {
        this.$emit('edit', event)
      } else {
        this.$nextTick(() => {
          this.$emit('edit', event)
        })
      }
    },
    borderSelect() {
      this.$refs.borderSelect.toggleMenu()
    },
    changeBorder() {
      this.$emit('border', {
        width: this.customBorder,
        direction: this.customerDirection,
        arrowType: this.customArrow
      })
    },
    changeDirection() {
      this.customerDirection = this.customerDirection === 'asc' ? 'desc' : 'asc'
      this.$emit('border', {
        width: this.customBorder,
        direction: this.customerDirection,
        arrowType: this.customArrow
      })
    },
    onArrowVisibleChange(event) {
      if (event) {
        this.$emit('edit', event)
      } else {
        this.$nextTick(() => {
          this.$emit('edit', event)
        })
      }
    },
    arrowSelect() {
      this.$refs.arrowSelect.toggleMenu()
    },
    changeArrow(e) {
      console.log(e, 'ee')
      this.customArrow = e
      this.$emit('border', {
        width: this.customBorder,
        direction: this.customerDirection,
        arrowType: this.customArrow
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.base-color-dropdown {
  @include themeify(false) {
    @if $theme-name == 'theme-wiseblue' {
      --base-color-picker__bg: rgba(23, 37, 55, 0.9);
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --base-color-picker__bg: linear-gradient(
        180deg,
        rgba(0, 67, 63, 0.85) 0%,
        rgba(0, 19, 30, 0.74) 21%,
        #00131e 100%
      );
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --base-color-picker__bg: rgba(23, 20, 11, 0.9);
    }
  }

  background: var(--base-color-picker__bg);
  padding: px-to-rem(12);
  border: 0;

  &[x-placement='top-start'] {
    transform: translateY(px-to-rem(12));
  }

  &[x-placement='right-start'] {
    transform: translateX(px-to-rem(6));
  }

  .el-color-dropdown__main-wrapper {
    display: flex;
    gap: px-to-rem(12);
    margin-bottom: px-to-rem(12);

    &::after {
      display: none;
    }
  }

  ::v-deep {
    .el-color-hue-slider__thumb {
      width: 0.16rem;
      transform: translateX(-0.02rem);
      border-radius: 0.02rem;
    }

    .el-color-alpha-slider {
      width: px-to-rem(274);

      .el-color-alpha-slider__thumb {
        border-radius: px-to-rem(2);
      }
    }

    .el-color-predefine {
      width: 100%;
      margin-top: px-to-rem(12);

      .el-color-predefine__colors {
        gap: px-to-rem(8);

        .el-color-predefine__color-selector {
          margin: 0;
        }
      }
    }

    .el-color-dropdown__inputs {
      display: flex;
      width: 100%;

      gap: px-to-rem(12);
      margin: px-to-rem(12) 0;

      .color-input {
        width: px-to-rem(90);
      }

      .alpha-input {
        width: px-to-rem(70);
      }
    }
    .border-input {
      flex: 1;
      position: relative;

      .el-input__inner {
        color: transparent !important;
        height: px-to-rem(32);
      }

      .border-display {
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        width: 100%;
        height: px-to-rem(32);
        color: var(--iw-text-color);
        gap: px-to-rem(6);
        padding-right: px-to-rem(32);
        padding-left: px-to-rem(6);

        .line {
          flex: 1;
          background: var(--iw-text-color);
        }
        .arrow-icons {
          width: px-to-rem(16) !important;
          transform: rotate(45deg);
          font-size: px-to-rem(15) !important;
        }
      }
    }

    .el-color-dropdown__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-color-dropdown__btns {
        margin-top: 0;
      }
      .border-direction-btn {
        padding: 0 px-to-rem(8);
      }
    }

    .ct-icon {
      width: px-to-rem(16) !important;
      .icon {
        font-size: px-to-rem(16) !important;
        color: var(--iw-text-color) !important;
      }
    }
  }
}
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.color-dropdown__select-popper {
  .border-option {
    display: flex;
    align-items: center;
    gap: px-to-rem(6);

    &:hover {
      color: var(--iw-active-text-color);
    }

    .line {
      flex: 1;
      background: currentColor;
    }
    .arrow-icons {
      width: px-to-rem(16) !important;
      transform: rotate(45deg);
      font-size: px-to-rem(15) !important;
    }
  }
  .el-select-dropdown__wrap {
    max-height: px-to-rem(290) !important;
  }
}
.el-color-dropdown__value.border-input.arrow {
  width: px-to-rem(84) !important;
  height: px-to-rem(32) !important;
}
</style>
