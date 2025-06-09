<template>
  <div
    :class="[
      'base-color-picker',
      'el-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `el-color-picker--${colorSize}` : ''
    ]"
    v-clickoutside="hide"
  >
    <div class="el-color-picker__mask" v-if="colorDisabled"></div>
    <div class="el-color-picker__trigger" @click="handleTrigger">
      <span v-if="!showBorder" class="el-color-picker__color" :class="{ 'is-alpha': showAlpha }">
        <span
          class="el-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        ></span>
        <span class="el-color-picker__empty el-icon-close" v-if="!value && !showPanelColor"></span>
      </span>
      <ct-icon
        v-if="showBorder"
        :class="`el-color-picker__icon border-icon ${showPicker && highlightIcon ? 'choose' : ''}`"
        :name="iconName"
      />
    </div>
    <picker-dropdown
      ref="dropdown"
      :class="['el-color-picker__panel', popperClass || '']"
      v-model="showPicker"
      :color="color"
      :show-alpha="showAlpha"
      :show-border="showBorder"
      :show-arrow="showArrow"
      :arrow-type="arrowType"
      :border-width="borderWidth"
      :border-direction="borderDirection"
      :predefine="predefine"
      :placement="placement"
      @edit="onEdit"
      @pick="confirmValue"
      @border="onBorder"
      @reset="resetColor"
      @close="close"
    >
    </picker-dropdown>
  </div>
</template>

<script>
import Color from './color'
import PickerDropdown from './components/PickerDropdown.vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Emitter from 'element-ui/src/mixins/emitter'
import { reset } from 'chalk'

export default {
  name: 'ColorPicker',
  components: {
    PickerDropdown
  },
  mixins: [Emitter],
  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    // 同步改变
    syncChange: {
      type: Boolean,
      default: false
    },
    predefine: {
      type: Array,
      default: () => ['#4F9FFF', '#1373E6', '#FB913C', '#13BE88', '#E8F3FE', '#ED5158']
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    showBorder: Boolean,
    showArrow: {
      type: Boolean,
      default: false
    },
    borderDirection: String,
    borderWidth: Number,
    arrowType: {
      type: Number,
      default: 2
    },
    iconName: {
      type: String,
      default: 'plotting-right-arrow'
    },
    highlightIcon: {
      type: Boolean,
      default: false
    }
  },
  directives: { Clickoutside },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    })

    return {
      color,
      defaultValue: null,
      showPicker: false,
      showPanelColor: false,
      editing: false,
      light: false
    }
  },
  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return 'transparent'
      }
      return this.displayedRgb(this.color, this.showAlpha)
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },

    colorSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },

    colorDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val === this.defaultValue) {
          this.resetColor()
        } else {
          this.defaultValue = val
          this.color.fromString(val)
        }
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true
        if (this.syncChange) {
          this.$emit('input', this.color.value)
        }
      }
    },
    displayedColor(val) {
      if (!this.showPicker) return
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      })
      currentValueColor.fromString(this.value)

      const currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha)
      if (val !== currentValueColorRgb) {
        this.$emit('active-change', val)
      }
    },
    showPicker: {
      deep: true,
      immediate: true,
      handler(v) {
        this.$emit('trigger', v)
      }
    }
  },
  mounted() {
    const value = this.value
    if (value) {
      this.defaultValue = value
      this.color.fromString(value)
    }
    this.popperElm = this.$refs.dropdown.$el
  },
  methods: {
    reset,
    handleTrigger() {
      if (this.colorDisabled) return
      this.showPicker = !this.showPicker
    },
    confirmValue() {
      const value = this.color.value
      this.$emit('input', value)
      this.$emit('change', value)
      this.dispatch('ElFormItem', 'el.form.change', value)
      this.showPicker = false
    },
    hide() {
      if (this.editing) {
        return
      }

      this.showPicker = false
      this.resetColor()
    },
    resetColor(v) {
      this.$nextTick((_) => {
        if (this.defaultValue) {
          this.color.fromString(this.defaultValue)
        } else {
          this.showPanelColor = false
        }
        if (v) {
          this.$emit('reset')
        }
      })
    },
    close() {
      this.resetColor()
      this.showPicker = false
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class')
      }

      const { r, g, b } = color.toRgb()
      return showAlpha ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})` : `rgb(${r}, ${g}, ${b})`
    },
    onEdit(event) {
      this.editing = event
    },
    onBorder(e) {
      this.$emit('border', e)
    },
    clickIcon() {
      this.light = !this.light
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.base-color-picker {
  @include themeify(false) {
    @if $theme-name == 'theme-wiseblue' {
      --base-color-picker__bg: rgba(23, 37, 55, 0.9);
      --base-color-picker-choose__bg: #4f9fff;
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --base-color-picker__bg: linear-gradient(
        180deg,
        rgba(0, 67, 63, 0.85) 0%,
        rgba(0, 19, 30, 0.74) 21%,
        #00131e 100%
      );
      --base-color-picker-choose__bg: #f9ff6c;
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --base-color-picker__bg: rgba(23, 20, 11, 0.9);
      --base-color-picker-choose__bg: #fffa28;
    }
  }

  &.el-color-picker {
    ::v-deep {
      .el-color-picker__icon {
        color: inherit;
        .ct-icon {
          width: px-to-rem(16) !important;
          transform: translateX(px-to-rem(-6));
          .icon {
            font-size: px-to-rem(14) !important;
            color: var(--iw-text-color) !important;
          }
        }
        &.choose {
          .icon {
            font-size: px-to-rem(14) !important;
            color: var(--base-color-picker-choose__bg) !important;
          }
        }
      }
    }
    .el-color-picker__color {
      border: 0;
    }

    .el-color-picker__trigger {
      background: var(--base-color-picker__bg);
      border: 0;
    }
  }
}
</style>
