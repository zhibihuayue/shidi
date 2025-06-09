<template>
  <!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
  <div
    v-clickoutside="handleClose"
    :class="[selectSize ? 'el-select--' + selectSize : '']"
    class="el-select"
    @click.stop="toggleMenu"
  >
    <div
      v-if="multiple"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', 'width': '100%' }"
      class="el-select__tags"
    >
      <span v-if="collapseTags && selected.length && cardLength === 1">
        <el-tag
          :closable="!selectDisabled"
          :hit="selected[0].hitState"
          :size="collapseTagSize"
          disable-transitions
          type="info"
          @close="deleteTag($event, selected[0])"
        >
          <span class="el-select__tags-text">{{
            selected[0].currentLabel
          }}</span>
        </el-tag>
        <el-tag
          v-if="selected.length > 1"
          :closable="false"
          :size="collapseTagSize"
          disable-transitions
          type="info"
        >
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
        </el-tag>
      </span>
      <template v-else>
        <span>
          <el-tag
            v-for="item in selected.slice(
              0,
              Math.min(selected.length, cardLength)
            )"
            :key="getValueKey(item)"
            :closable="!selectDisabled"
            :hit="item.hitState"
            :size="collapseTagSize"
            disable-transitions
            type="info"
            @close="deleteTag($event, item)"
          >
            <span class="el-select__tags-text">{{
              item.currentLabel.length > 5
                ? item.currentLabel.slice(0, 5) + '...'
                : item.currentLabel
            }}</span>
          </el-tag>
          <el-tag
            v-if="cardLength < selected.length && selected.length > 1"
            :closable="false"
            :size="collapseTagSize"
            disable-transitions
            type="info"
          >
            <span class="el-select__tags-text"
              >+ {{ selected.length - cardLength }}</span
            >
          </el-tag>
        </span></template
      >
      <transition-group v-if="!collapseTags" @after-leave="resetInputHeight">
        <el-tag
          v-for="item in selected"
          :key="getValueKey(item)"
          :closable="!selectDisabled"
          :hit="item.hitState"
          :size="collapseTagSize"
          disable-transitions
          type="info"
          @close="deleteTag($event, item)"
        >
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
      </transition-group>

      <input
        v-if="filterable"
        ref="input"
        v-model="query"
        :autocomplete="autoComplete || autocomplete"
        :class="[selectSize ? `is-${selectSize}` : '']"
        :disabled="selectDisabled"
        :style="{
          'flex-grow': '1',
          'width': inputLength / (inputWidth - 32) + '%',
          'max-width': inputWidth - 42 + 'px'
        }"
        class="el-select__input"
        type="text"
        @blur="softFocus = false"
        @compositionend="handleComposition"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @focus="handleFocus"
        @input="debouncedQueryChange"
        @keydown="resetInputState"
        @keyup="managePlaceholder"
        @keydown.down.prevent="handleNavigate('next')"
        @keydown.up.prevent="handleNavigate('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
      />
    </div>
    <el-input
      :id="id"
      ref="reference"
      v-model="selectedLabel"
      :autocomplete="autoComplete || autocomplete"
      :class="{ 'is-focus': visible }"
      :disabled="selectDisabled"
      :name="name"
      :placeholder="currentPlaceholder"
      :readonly="readonly"
      :size="selectSize"
      :tabindex="multiple && filterable ? '-1' : null"
      :validate-event="false"
      type="text"
      @blur="handleBlur"
      @compositionend="handleComposition"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @focus="handleFocus"
      @input="debouncedOnInputChange"
      @keydown.native.down.stop.prevent="handleNavigate('next')"
      @keydown.native.up.stop.prevent="handleNavigate('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template v-if="$slots.prefix" v-slot:prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-slot:suffix>
        <em
          v-show="!showClose"
          :class="[
            'el-select__caret',
            'el-input__icon',
            'el-icon-' + iconClass
          ]"
        ></em>
        <em
          v-if="showClose"
          class="el-select__caret el-input__icon el-icon-circle-close"
          @click="handleClearClick"
        ></em>
      </template>
    </el-input>
    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy"
    >
      <el-select-menu
        v-show="visible && emptyText !== false"
        ref="popper"
        :append-to-body="popperAppendToBody"
      >
        <el-scrollbar
          v-show="options.length > 0 && !loading"
          ref="scrollbar"
          :class="{
            'is-empty': !allowCreate && query && filteredOptionsCount === 0
          }"
          tag="ul"
          view-class="el-select-dropdown__list"
          wrap-class="el-select-dropdown__wrap"
        >
          <el-option v-if="showNewOption" :value="query" created></el-option>
          <slot></slot>
        </el-scrollbar>
        <template
          v-if="
            emptyText &&
            (!allowCreate || loading || (allowCreate && options.length === 0))
          "
        >
          <slot v-if="$slots.empty" name="empty"></slot>
          <p v-else class="el-select-dropdown__empty">
            {{ emptyText }}
          </p>
        </template>
      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
/* eslint-disable vue/no-deprecated-events-api */
import Emitter from 'element-ui/src/mixins/emitter'
import Focus from 'element-ui/src/mixins/focus'
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'
import ElSelectMenu from './select-dropdown.vue'
import ElOption from './option.vue'
// import ElTag from 'element-ui/packages/tag'
import { Tag as ElTag } from 'element-ui'
import ElScrollbar from 'element-ui/lib/scrollbar'
import debounce from 'throttle-debounce/debounce'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'
import {
  getValueByPath,
  isEdge,
  isIE,
  valueEquals
} from 'element-ui/src/utils/util'
import NavigationMixin from './navigation-mixin'
import { isKorean } from 'element-ui/src/utils/shared'

export default {
  mixins: [Emitter, Locale, Focus('reference'), NavigationMixin],

  name: 'ElSelect',

  componentName: 'ElSelect',

  inject: {
    elForm: {
      default: ''
    },

    elFormItem: {
      default: ''
    }
  },

  provide() {
    return {
      select: this
    }
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },

    readonly() {  // NOSONAR
      // prettier-ignore
      return (!this.filterable || this.multiple || (!isIE() && !isEdge() && !this.visible)) // NOSONAR
    },

    showClose() {  // NOSONAR
      // prettier-ignore
      let hasValue = this.multiple ? Array.isArray(this.value) && this.value.length > 0 : this.value !== undefined && this.value !== null && this.value !== ''   // NOSONAR
      let criteria =
        this.clearable && !this.selectDisabled && this.inputHovering && hasValue
      return criteria
    },

    // prettier-ignore
    iconClass() { // NOSONAR
      return this.remote && this.filterable ? '' : this.visible ? 'arrow-up is-reverse' : 'arrow-up' // NOSONAR
    },

    debounce() {
      return this.remote ? 300 : 0
    },

    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('el.select.loading')
      } else {
        if (this.remote && this.query === '' && this.options.length === 0)
          return false
        if (
          this.filterable &&
          this.query &&
          this.options.length > 0 &&
          this.filteredOptionsCount === 0
        ) {
          return this.noMatchText || this.t('el.select.noMatch')
        }
        if (this.options.length === 0) {
          return this.noDataText || this.t('el.select.noData')
        }
      }
      return null
    },

    showNewOption() {
      let hasExistingOption = this.options
        .filter((option) => !option.created)
        .some((option) => option.currentLabel === this.query)
      return (
        this.filterable &&
        this.allowCreate &&
        this.query !== '' &&
        !hasExistingOption
      )
    },

    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },

    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },

    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small'
    },
    propPlaceholder() {
      return typeof this.placeholder !== 'undefined'
        ? this.placeholder
        : this.t('el.select.placeholder')
    }
  },

  components: {
    ElInput,
    ElSelectMenu,
    ElOption,
    ElTag,
    ElScrollbar
  },

  directives: { Clickoutside },

  props: {
    cardLength: {
      type: Number,
      default: 1
    },
    name: String,
    id: String,
    value: {
      required: true
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            "[Element Warn][Select]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          )
        return true
      }
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      required: false
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      inputHovering: false,
      currentPlaceholder: '',
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false
    }
  },

  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },

    propPlaceholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val
    },

    value(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight()
        if (
          (val && val.length > 0) ||
          (this.$refs.input && this.query !== '')
        ) {
          this.currentPlaceholder = ''
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder
        }
        if (this.filterable && !this.reserveKeyword) {
          this.query = ''
          this.handleQueryChange(this.query)
        }
      }
      this.setSelected()
      if (this.filterable && !this.multiple) {
        this.inputLength = 20
      }
      if (!valueEquals(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },

    // prettier-ignore
    visible(val) { // NOSONAR
      if (!val) { // NOSONAR
        this.broadcast('ElSelectDropdown', 'destroyPopper')
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        this.query = ''
        this.previousQuery = null
        this.selectedLabel = ''
        this.inputLength = 20
        this.menuVisibleOnFocus = false
        this.resetHoverIndex()
        this.$nextTick(() => {
          if (
            this.$refs.input &&
            this.$refs.input.value === '' &&
            this.selected.length === 0
          ) {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
        })
        if (!this.multiple) { // NOSONAR
          if (this.selected) { // NOSONAR
            // prettier-ignore
            if (this.filterable && this.allowCreate && this.createdSelected && this.createdLabel) { // NOSONAR
              this.selectedLabel = this.createdLabel // NOSONAR
            } else {
              this.selectedLabel = this.selected.currentLabel // NOSONAR
            }
            if (this.filterable) this.query = this.selectedLabel // NOSONAR
          }

          if (this.filterable) { // NOSONAR
            this.currentPlaceholder = this.cachedPlaceHolder // NOSONAR
          }
        }
      } else { // NOSONAR
        this.broadcast('ElSelectDropdown', 'updatePopper')
        if (this.filterable) { // NOSONAR
          this.query = this.remote ? '' : this.selectedLabel
          this.handleQueryChange(this.query)
          if (this.multiple) { // NOSONAR
            this.$refs.input.focus()
          } else {// NOSONAR
            if (!this.remote) { // NOSONAR
              this.broadcast('ElOption', 'queryChange', '')
              this.broadcast('ElOptionGroup', 'queryChange')
            }

            if (this.selectedLabel) { // NOSONAR
              this.currentPlaceholder = this.selectedLabel
              this.selectedLabel = ''
            }
          }
        }
      }
      this.$emit('visible-change', val)
    },

    options() {
      if (this.$isServer) {
        return
      }
      this.$nextTick(() => {
        this.broadcast('ElSelectDropdown', 'updatePopper')
      })
      if (this.multiple) {
        this.resetInputHeight()
      }
      let inputs = this.$el.querySelectorAll('input')
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected()
      }
      if (
        this.defaultFirstOption &&
        (this.filterable || this.remote) &&
        this.filteredOptionsCount
      ) {
        this.checkDefaultFirstOption()
      }
    }
  },

  methods: {
    handleNavigate(direction) {
      if (this.isOnComposition) {
        return
      }

      this.navigateOptions(direction)
    },
    handleComposition(event) {
      const text = event.target.value
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.$nextTick((_) => this.handleQueryChange(text))
      } else {
        const lastCharacter = text[text.length - 1] || ''
        this.isOnComposition = !isKorean(lastCharacter)
      }
    },

    // prettier-ignore
    handleQueryChange(val) { // NOSONAR
      if (this.previousQuery === val || this.isOnComposition) { // NOSONAR
        return
      }
      // prettier-ignore
      if (this.previousQuery === null && (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')) { // NOSONAR
        this.previousQuery = val
        return
      }
      this.previousQuery = val
      this.$nextTick(() => {
        if (this.visible) { // NOSONAR
          this.broadcast('ElSelectDropdown', 'updatePopper')
        }
      })
      this.hoverIndex = -1
      if (this.multiple && this.filterable) { // NOSONAR
        this.$nextTick(() => {
          const length = this.$refs.input.value.length * 15 + 20
          this.inputLength = this.collapseTags ? Math.min(50, length) : length // NOSONAR
          this.managePlaceholder()
          this.resetInputHeight()
        })
      }
      if (this.remote && typeof this.remoteMethod === 'function') { // NOSONAR
        this.hoverIndex = -1
        this.remoteMethod(val)
      } else if (typeof this.filterMethod === 'function') { // NOSONAR
        this.filterMethod(val)
        this.broadcast('ElOptionGroup', 'queryChange')
      } else { // NOSONAR
        this.filteredOptionsCount = this.optionsCount
        this.broadcast('ElOption', 'queryChange', val)
        this.broadcast('ElOptionGroup', 'queryChange')
      }
      // prettier-ignore
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) { // NOSONAR
        this.checkDefaultFirstOption()
      }
    },

    scrollToOption(option) {
      const target =
        Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector(
          '.el-select-dropdown__wrap'
        )
        scrollIntoView(menu, target)
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },

    handleMenuEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected))
    },

    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val)
      }
    },

    getOption(value) {
      let option
      const isObject =
        Object.prototype.toString.call(value).toLowerCase() ===
        '[object object]'
      const isNull =
        Object.prototype.toString.call(value).toLowerCase() === '[object null]'
      const isUndefined =
        Object.prototype.toString.call(value).toLowerCase() ===
        '[object undefined]'

      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i]
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) ===
            getValueByPath(value, this.valueKey)
          : cachedOption.value === value
        if (isEqual) {
          option = cachedOption
          break
        }
      }
      if (option) {
        return option
      }
      const label = !isObject && !isNull && !isUndefined ? String(value) : ''
      let newOption = {
        value: value,
        currentLabel: label
      }
      if (this.multiple) {
        newOption.hitState = false
      }
      return newOption
    },

    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value)
        if (option.created) {
          this.createdLabel = option.currentLabel
          this.createdSelected = true
        } else {
          this.createdSelected = false
        }
        this.selectedLabel = option.currentLabel
        this.selected = option
        if (this.filterable) {
          this.query = this.selectedLabel
        }
        return
      }
      let result = []
      if (Array.isArray(this.value)) {
        this.value.forEach((value) => {
          result.push(this.getOption(value))
        })
      }
      this.selected = result
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },

    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown || this.filterable) {
          if (this.filterable && !this.visible) {
            this.menuVisibleOnFocus = true
          }
          this.visible = true
        }
        this.$emit('focus', event)
      } else {
        this.softFocus = false
      }
    },

    blur() {
      this.visible = false
      this.$refs.reference.blur()
    },

    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false
        } else {
          this.$emit('blur', event)
        }
      }, 50)
      this.softFocus = false
    },

    handleClearClick(event) {
      this.deleteSelected(event)
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },

    handleClose() {
      this.visible = false
    },

    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) {
        return
      }
      const option = this.selected[this.selected.length - 1]
      if (!option) {
        return
      }

      if (hit === true || hit === false) {
        option.hitState = hit
        return hit
      }

      option.hitState = !option.hitState
      return option.hitState
    },

    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.value.slice()
        value.pop()
        this.$emit('input', value)
        this.emitChange(value)
      }
    },

    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value
          ? ''
          : this.cachedPlaceHolder
      }
    },

    resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false)
      this.inputLength = this.$refs.input.value.length * 15 + 20
      this.resetInputHeight()
    },

    // prettier-ignore
    resetInputHeight() {  // NOSONAR
      if (this.collapseTags && !this.filterable) {
        return
      }
      this.$nextTick(() => {
        if (!this.$refs.reference) {
          return
        }
        let inputChildNodes = this.$refs.reference.$el.childNodes
        let input = [].filter.call(
          inputChildNodes,
          (item) => item.tagName === 'INPUT'
        )[0]
        const tags = this.$refs.tags
        const tagsHeight = tags
          ? Math.round(tags.getBoundingClientRect().height)
          : 0
        const sizeInMap = this.initialInputHeight || 40
        input.style.height =
          this.selected.length === 0
            ? sizeInMap + 'px'
            // prettier-ignore
            : Math.max(tags ? tagsHeight + (tagsHeight > sizeInMap ? 6 : 0) : 0, sizeInMap) + 'px'  // NOSONAR
        if (this.visible && this.emptyText !== false) {
          this.broadcast('ElSelectDropdown', 'updatePopper')
        }
      })
    },

    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected)
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(
              null,
              this.selected.map((item) => this.options.indexOf(item))
            )
          } else {
            this.hoverIndex = -1
          }
        }
      }, 300)
    },

    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        const value = (this.value || []).slice()
        const optionIndex = this.getValueIndex(value, option.value)
        if (optionIndex > -1) {
          value.splice(optionIndex, 1)
        } else if (
          this.multipleLimit <= 0 ||
          value.length < this.multipleLimit
        ) {
          value.push(option.value)
        } else {
          console.log('ElSelect:select')
        }
        this.$emit('input', value)
        this.emitChange(value)
        if (option.created) {
          this.query = ''
          this.handleQueryChange('')
          this.inputLength = 20
        }
        if (this.filterable) this.$refs.input.focus()
      } else {
        this.$emit('input', option.value)
        this.emitChange(option.value)
        this.visible = false
      }
      this.isSilentBlur = byClick
      this.setSoftFocus()
      if (this.visible) {
        return
      }
      this.$nextTick(() => {
        this.scrollToOption(option)
      })
    },

    setSoftFocus() {
      this.softFocus = true
      const input = this.$refs.input || this.$refs.reference
      if (input) {
        input.focus()
      }
    },

    getValueIndex(arr = [], value) {   // NOSONAR
      const isObject =
        Object.prototype.toString.call(value).toLowerCase() ===
        '[object object]'
      if (!isObject) {
        return arr.indexOf(value)
      } else {
        const valueKey = this.valueKey
        let index = -1
        arr.some((item, i) => {
          if (
            getValueByPath(item, valueKey) === getValueByPath(value, valueKey)
          ) {
            index = i
            return true
          }
          return false
        })
        return index
      }
    },

    toggleMenu() {
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false
        } else {
          this.visible = !this.visible
        }
        if (this.visible) {
          ;(this.$refs.input || this.$refs.reference).focus()
        }
      }
    },

    selectOption() {
      if (!this.visible) {
        this.toggleMenu()
      } else {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex])
        }
      }
    },

    deleteSelected(event) {
      event.stopPropagation()
      const value = this.multiple ? [] : ''
      this.$emit('input', value)
      this.emitChange(value)
      this.visible = false
      this.$emit('clear')
    },

    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag)
      if (index > -1 && !this.selectDisabled) {
        const value = this.value.slice()
        value.splice(index, 1)
        this.$emit('input', value)
        this.emitChange(value)
        this.$emit('remove-tag', tag.value)
      }
      event.stopPropagation()
    },

    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
        this.handleQueryChange(this.query)
      }
    },

    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--
        this.filteredOptionsCount--
        this.options.splice(index, 1)
      }
    },

    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },

    handleResize() {
      this.resetInputWidth()
      if (this.multiple) this.resetInputHeight()
    },

    checkDefaultFirstOption() {
      this.hoverIndex = -1
      // highlight the created option
      let hasCreated = false
      for (let i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true
          this.hoverIndex = i
          break
        }
      }
      if (hasCreated) {
        return
      }
      for (let i = 0; i !== this.options.length; ++i) {  // NOSONAR
        const option = this.options[i]
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = i
            break
          }
        } else {
          // highlight currently selected option
          if (option.itemSelected) {
            this.hoverIndex = i
            break
          }
        }
      }
    },

    getValueKey(item) {
      if (
        Object.prototype.toString.call(item.value).toLowerCase() !==
        '[object object]'
      ) {
        return item.value
      } else {
        return getValueByPath(item.value, this.valueKey)
      }
    }
  },

  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.propPlaceholder
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', [])
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '')
    }

    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange()
    })

    this.debouncedQueryChange = debounce(this.debounce, (e) => {
      this.handleQueryChange(e.target.value)
    })

    this.$on('handleOptionClick', this.handleOptionSelect)
    this.$on('setSelected', this.setSelected)
  },

  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = ''
    }
    addResizeListener(this.$el, this.handleResize)

    const reference = this.$refs.reference
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      }
      const input = reference.$el.querySelector('input')
      this.initialInputHeight =
        input.getBoundingClientRect().height || sizeMap[this.selectSize]
    }
    if (this.remote && this.multiple) {
      this.resetInputHeight()
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width
      }
    })
    this.setSelected()
  },

  beforeDestroy() {
    if (this.$el && this.handleResize)
      removeResizeListener(this.$el, this.handleResize)
  }
}
</script>
