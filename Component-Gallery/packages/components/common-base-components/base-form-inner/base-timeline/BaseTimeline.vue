<template>
  <div :class="genCommonWrapper">
    <div
      v-for="(event, index) in events"
      :key="index"
      class="base-timeline-item"
    >
      <div class="base-timeline-item-tail"></div>
      <ct-icon
        class="base-timeline-item-head-icon"
        name="target-screening"
        size="16"
      />
      <div class="base-timeline-item-content">
        <div class="base-timeline-date">{{ event.date }}</div>
        <div class="base-timeline-content">{{ event.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('common-base')
export default {
  name: 'BaseTimeline',
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  computed: {
    genCommonWrapper() {
      return {
        [bem.b('time-line')]: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@component-gallery/theme-chalk/src/base-components/base-timeline.scss';
</style>
