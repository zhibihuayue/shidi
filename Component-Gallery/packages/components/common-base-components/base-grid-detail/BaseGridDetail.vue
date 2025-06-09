<template>
  <div :class="{ ...wrapperClass }">
    <div :class="{ ...headerClass }">
      <div :class="{ ...headerTopCornerClass }">
        <div class="bar"></div>
        <div class="bg"></div>
      </div>
      <div :class="{ ...headerBottomCornerClass }"></div>
      <div class="label" v-c-tip.auto="detail?.label">
        {{ detail?.label }}
      </div>
    </div>
    <div :class="{ ...bodyClass }">
      <div class="card">
        <div class="l-p-card-label"> 网格长： </div>
        <div class="l-p-card-txt" v-c-tip.auto="detail?.keeperName">
          {{ detail?.keeperName }}
        </div>
      </div>
      <div class="card">
        <div class="l-p-card-label">网格长电话：</div>
        <div class="l-p-card-txt">
          {{ detail?.keeperPhoneNumber }}
        </div>
      </div>
      <div class="card">
        <div class="l-p-card-label">网格员数量：</div>
        <div class="l-p-card-txt" v-if="detail?.keeperCount != null"> {{ detail?.keeperCount }}人 </div>
      </div>
      <div class="card">
        <div class="l-p-card-label">网格面积：</div>
        <div class="l-p-card-txt" v-if="detail?.gridArea != null"> {{ detail?.gridArea }}m² </div>
      </div>
      <div class="card">
        <div class="l-p-card-label">今日告警数量：</div>
        <div class="l-p-card-txt" v-if="detail?.todayAlarmNum != null"> {{ detail?.todayAlarmNum }}个 </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import '@component-gallery/utils/funCommon/tooltip/directive'

const bem = createNameSpace('base')

export default {
  name: 'BaseGridDetail',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 计算wrapper的样式类
    wrapperClass() {
      return {
        [bem.b('grid-detail')]: true // 返回包含grid-detail样式类的对象
      }
    },
    // 计算header的样式类
    headerClass() {
      return {
        [bem.be('grid-detail', 'header')]: true // 返回包含grid-detail__header样式类的对象
      }
    },
    // 计算header顶部角落的样式类
    headerTopCornerClass() {
      return {
        [bem.be('grid-detail__header', 'corner-top')]: true // 返回包含grid-detail__header__corner-top样式类的对象
      }
    },
    // 计算header底部角落的样式类
    headerBottomCornerClass() {
      return {
        [bem.be('grid-detail__header', 'corner-bottom')]: true // 返回包含grid-detail__header__corner-bottom样式类的对象
      }
    },
    // 计算body的样式类
    bodyClass() {
      return {
        [bem.be('grid-detail', 'body')]: true // 返回包含grid-detail__body样式类的对象
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/base-grid-detail';
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
