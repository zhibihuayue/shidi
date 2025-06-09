<template>
  <div class="base-select-tag common-iw-s">
    <div class="tag all" :class="{ active: isAll }" @click="onSelect(all)">
      {{ all[prop.label] }}
    </div>
    <div
      v-for="item in options"
      :key="item[prop.id]"
      class="tag"
      :class="{
        active: multiple ? selected.includes(item[prop.id]) && isAll === false : item[prop.id] === selected
      }"
      @click="onSelect(item)"
    >
      {{ item[prop.label] }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSelectTag',
  // 定义组件的props
  props: {
    // 组件的值，默认为空字符串
    value: {
      default: ''
    },
    // 是否支持多选，默认为false
    multiple: {
      type: Boolean,
      default: false
    },
    // 选项列表，默认为空数组
    options: {
      type: Array,
      default: () => []
    },
    // 选项的属性，默认为id和label
    prop: {
      type: Object,
      default: () => {
        return {
          id: 'key',
          label: 'label'
        }
      }
    }
  },
  data() {
    return {
      selected: ''
    }
  },
  watch: {
    value() {
      this.selected = this.value
    }
  },
  mounted() {
    this.selected = this.value || (this.multiple ? [] : '')
  },
  computed: {
    all() {
      return {
        [this.prop.id]: '',
        [this.prop.label]: '全部'
      }
    },
    isAll() {
      return this.multiple
        ? this.selected.length === 0 || this.selected.length === this.options.length
        : this.selected === ''
    }
  },
  methods: {
    // onSelect方法用于处理选择操作
    onSelect(item) {
      // 获取当前选项的id
      const id = item[this.prop.id]
      // 根据是否为多选，调用不同的选择方法
      this.multiple ? this.selectMultiple(id) : this.selectSingle(id)
      // 发射input事件，传递当前选中的值
      this.$emit('input', this.selected)
    },
    // selectSingle方法用于处理单选操作
    selectSingle(id) {
      // 如果当前选中的id与传入的id相同，则清空选中，否则设置为传入的id
      this.selected = this.selected === id ? '' : id
    },
    // selectMultiple方法用于处理多选操作
    selectMultiple(id) {
      // 如果传入的id为空，则清空所有选中
      if (!id) {
        this.selected = []
        return
      }

      // 检查当前选中的数组中是否包含传入的id
      const isActive = this.selected.some((t) => t === id)
      // 如果已选择，则移除该选项
      if (isActive) {
        this.selected = this.selected.filter((t) => t !== id)
      } else {
        // 如果未选择，则添加该选项
        this.selected.push(id)
      }

      // 如果当前选中的数量等于所有选项的数量，则清空所有选中
      if (this.selected.length === this.options.length) {
        this.selected = []
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.base-select-tag {
  --base-select-tag__tag-number: 3;

  @include themeify(false) {
    // 通用
    @if $theme-name == 'theme-wiseblue' {
      --base-select-tag__tag-border: rgb(232 243 254 / 20%);
      --base-select-tag__tag-active-border: #4f9fff;
      --base-select-tag__tag-active-bg: transparent;
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --base-select-tag__tag-border: #02896d;
      --base-select-tag__tag-active-border: #f9ff6c;
      --base-select-tag__tag-active-bg: transparent;
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --base-select-tag__tag-border: #9f9853;
      --base-select-tag__tag-active-border: #fffa28;
      --base-select-tag__tag-active-bg: transparent;
    }
  }

  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: px-to-rem(6);

  .tag {
    height: px-to-rem(32);
    border: 1px solid var(--base-select-tag__tag-border);
    border-radius: px-to-rem(4);
    color: var(--iw-text-color);
    font-size: px-to-rem(14);
    text-align: center;
    flex: 0 0 calc((100% / var(--base-select-tag__tag-number)) - px-to-rem(6));
    line-height: px-to-rem(32);
    cursor: pointer;

    &.active {
      background: var(--base-select-tag__tag-active-bg);
      border-color: var(--base-select-tag__tag-active-border);
      color: var(--iw-active-text-color);
    }
  }
}
</style>
