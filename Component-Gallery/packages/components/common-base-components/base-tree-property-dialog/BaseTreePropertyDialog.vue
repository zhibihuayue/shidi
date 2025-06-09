<template>
  <absolute-container
    :width="368"
    title="属性"
    highlight-title
    @close="close"
    :class="[bemClass.box]"
    v-drag
    v-if="isShowAttrBox"
  >
    <div :class="[bemClass.content]">
      <template v-for="(item, key) in attrData">
        <div
          v-if="!item.isAtty"
          :class="{
            ...dialogAttributeContentItemClass,
            'dialog-attribute-content-item-divider': item.isDivider
          }"
          :key="key"
        >
          <span
            :style="{
              width: labelWidth + 'em'
            }"
            :class="[bemClass.contentLabel]"
            v-c-tip="item.text"
            c-tip-placement="'bottom'"
            >{{ item.text }}：</span
          >
          <span :class="[bemClass.contentValue]" v-if="detailsData[key]">
            <span v-c-tip="`${item.formatter(detailsData[key])}${item.u || ''}`" c-tip-placement="'bottom'">
              {{ item.formatter(detailsData[key]) }}{{ item.u || '' }}
            </span>
            <em
              v-if="item.isShowCopy"
              class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
              @click="copyToClipboard(detailsData[key])"
            ></em>

            <span
              v-if="item.isShowSync && detailsData[item.showSyncAttr]"
              class="sync-btn sync"
              @click="handleSync(detailsData)"
              v-c-tip:top="'从机场获取设备经纬度和海拔'"
              >同步</span
            >
          </span>
          <span v-else :class="[bemClass.contentValue]">-</span>
        </div>
        <div
          v-else
          :class="{
            ...dialogAttributeContentItemClass,
            'dialog-attribute-content-item-divider': item.isDivider
          }"
          style="align-items: baseline"
          :key="key + '1'"
        >
          <span :class="[bemClass.contentLabel]">{{ item.text }}：</span>
          <template v-if="detailsData[key] && detailsData[key].length">
            <span class="attrTagList">
              <span class="tag" v-for="attr in detailsData[key]" :key="attr">
                <div v-c-tip="attr" c-tip-placement="'bottom'">{{ attr }}</div>
              </span>
            </span>
          </template>
          <span v-else :class="[bemClass.contentValue]">-</span>
        </div>
      </template>
    </div>
  </absolute-container>
</template>
<script>
import AbsoluteContainer from '../absolute-container/AbsoluteContainer.vue'
import { dragBindCover, copyToClipboard } from '@component-gallery/utils/funCommon/common'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('dialog-attribute')
export default {
  name: 'tree-property-dialog',
  components: { AbsoluteContainer },
  props: {
    /**
     * 详情值
     */
    detailsData: {
      type: Object,
      required: true
    },
    /**
     * 详情名称
     */
    attrData: {
      type: Object,
      required: true
    },
    /**
     * 当前id
     */
    currentAttrId: {
      type: String,
      required: ''
    }
  },
  directives: {
    drag: {
      /**
       * 拖拽指令chuan
       * @param {*} el
       */
      bind: (el) => {
        dragBindCover(el)
      }
    }
  },
  data() {
    return {
      labelWidth: 3,
      isShowAttrBox: false
    }
  },
  watch: {
    /**
     * 计算标签宽度
     *
     * @param val 标签数据
     */
    attrData(val) {
      let tempArr = []
      let attrArr = Object.values(val)
      if (attrArr) {
        attrArr.map((el) => {
          tempArr.push(el.text.length)
        })
      }
      this.labelWidth = Math.max(...tempArr) + 1
    }
  },
  computed: {
    /**
     * 创建class类型
     */
    bemClass() {
      return {
        box: bem.b('box'),
        content: bem.b('content'),
        contentLabel: bem.b(`content-label _id${this.currentAttrId}`),
        contentValue: bem.b('content-value')
      }
    },
    dialogAttributeContentItemClass() {
      return {
        [bem.b('content-item')]: true
      }
    }
  },
  created() {
    console.log(this.attrData)
  },
  methods: {
    /**
     * 关闭函数
     * 触发 'close' 事件
     */
    close() {
      this.$emit('close')
    },
    /**
     * 复制到剪贴板
     *
     * @param v 用于复制的数据
     */
    copyToClipboard(v) {
      copyToClipboard(v)
    },
    /**
     * 处理同步
     * @param detailsData
     */
    handleSync(detailsData) {
      this.$emit('handleSync', detailsData)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/base-tree-property-dialog';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
