<template>
  <div class="emergency-todo-task-detail__feedback">
    <c-scroll v-if="list.length">
      <base-collapse-group v-model="activeNames">
        <base-collapse :name="item?.id" v-for="item in list" :key="item.id">
          <template #title>
            <div class="feedback-title" :ref="`feedbackTitle_${item.id}`">
              <div>{{ item.feedbackTime }} 反馈</div>
              <div>({{ item.taskProgress }}%)</div>
            </div>
          </template>

          <div class="feedback-wrapper">
            <div class="content">
              <div class="left"> 反馈人： </div>
              <div class="right"> {{ item.feedbackName }} </div>
            </div>
            <div class="content">
              <div class="left"> 反馈内容： </div>
              <div class="right"> {{ item.feedbackDetail }} </div>
            </div>
            <div class="content" v-if="item.files.length">
              <div class="left"> 附件： </div>
              <div class="right">
                <base-upload v-model="item.files" readonly></base-upload>
              </div>
            </div>
          </div>
        </base-collapse>
      </base-collapse-group>
    </c-scroll>

    <base-loading v-if="loading" />

    <base-nodata v-if="!loading && !list.length" />
  </div>
</template>

<script>
import BaseCollapseGroup from '../../base-form-inner/base-collapse/BaseCollapseGroup.vue'
import BaseCollapse from '../../base-form-inner/base-collapse/BaseCollapse.vue'
import BaseUpload from '../../base-form-inner/base-upload/BaseUpload.vue'
import BaseLoading from '../../base-loading/BaseLoading.vue'
import BaseNodata from '../../base-nodata/BaseNodata.vue'
import CScroll from '@component-gallery/utils/funCommon/c-scroll.vue'
import eventPath from '@component-gallery/build-event-bus-path'
import { map } from 'lodash-es'
import { getFeedbackList } from '../service'
import { generateFileList } from '../utils/common'

export default {
  components: {
    BaseLoading,
    CScroll,
    BaseUpload,
    BaseCollapse,
    BaseCollapseGroup,
    BaseNodata
  },
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    chooseFeedbackId: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      activeNames: '',
      list: []
    }
  },
  watch: {
    taskInfo: {
      async handler(val) {
        if (val) {
          await this.getList()
        }
      },
      deep: true,
      immediate: true
    },
    chooseFeedbackId(val) {
      if (val) {
        this.activeNames = val
      }
    }
  },
  methods: {
    // 更新代办任务进度
    updateTodoTaskProgressById() {
      // 检查列表是否有数据
      if (this.list.length) {
        // 发射更新进度的事件
        this.$globalEventBus.$emit(`${eventPath.commonCompEmergencyTodoTask}__update-progress`, {
          taskId: this.taskInfo.taskId, // 任务ID
          taskProgress: this.list[0]?.taskProgress // 任务进度
        })
      }
    },
    // 获取列表数据
    async getList() {
      // 设置加载状态为真
      this.loading = true
      // 清空列表数据
      this.list = []

      try {
        // 获取反馈列表
        const res = await getFeedbackList({ taskId: this.taskInfo.taskId })
        // 解构响应数据
        const { data, code } = res
        // 检查响应码是否为200
        if (code === 200) {
          // 将数据转换为包含文件列表的格式
          this.list = map(data, (item) => {
            return { ...item, files: generateFileList(item) }
          })

          // 更新代办任务列表的进度
          this.updateTodoTaskProgressById()

          // 默认全部收起，此行代码注释掉
          // if (this.list && this.list.length) {
          //   this.activeNames = this.list[0].id
          // }
        }
      } catch (e) {
        // 打印错误信息
        console.error(e)
      } finally {
        // 设置加载状态为假
        this.loading = false
      }
    }
  },
  created() {
    this.$globalEventBus.$on(
      `${eventPath.commonCompEmergencyTodoTaskDetail}__inner-refresh-feedback`,
      (refreshData) => {
        if (refreshData.taskId === this.taskInfo.taskId) {
          this.getList()
        }
      }
    )

    this.$globalEventBus.$on(`${eventPath.commonCompEmergencyDetail}__inner-refresh-feedback`, (data) => {
      if (data.taskId === this.taskInfo.taskId) {
        this.getList()
      }
    })
  },
  beforeDestroy() {
    this.$globalEventBus.$off(`${eventPath.commonCompEmergencyTodoTaskDetail}__inner-refresh-feedback`)

    this.$globalEventBus.$off(`${eventPath.commonCompEmergencyDetail}__inner-refresh-feedback`)
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-wiseblue'] .emergency-todo-task-detail__feedback {
  --text-color: #e8f3fe;
  --text-color-70: rgba(232, 243, 254, 0.7);
  --primary-color: #4f9fff;
}

[data-theme='theme-aquamarine'] .emergency-todo-task-detail__feedback {
  --text-color: #ffffff;
  --text-color-70: rgba(255, 255, 255, 0.7);
  --primary-color: #0dc985;
}

[data-theme='theme-terracotta'] .emergency-todo-task-detail__feedback {
  --text-color: #e4e7c1;
  --text-color-70: rgba(228, 231, 193, 0.7);
  --primary-color: #fffa28;
}

.emergency-todo-task-detail__feedback {
  @include themeify(false) {
    height: 100%;

    ::v-deep {
      .common-base-collapse-group {
        padding: px-to-rem(12) px-to-rem(12) 0 px-to-rem(12);
      }
    }

    .feedback-wrapper {
      padding: px-to-rem(12) px-to-rem(12) px-to-rem(12) 0;

      > .content {
        display: flex;
        margin-bottom: px-to-rem(6);

        > .left {
          text-align: right;
          font-size: px-to-rem(14);
          line-height: px-to-rem(20);
          color: var(--text-color-70);
          width: px-to-rem(82);
        }

        > .right {
          color: var(--text-color);
          width: calc(100% - px-to-rem(82));
          font-size: px-to-rem(14);
          line-height: px-to-rem(20);
          word-break: break-all;
        }
      }

      > .content:last-child {
        margin-bottom: 0;
      }
    }

    .feedback-title {
      display: flex;
      font-size: px-to-rem(14);

      > div:nth-child(1) {
        line-height: px-to-rem(14);
        color: var(--text-color);
        margin-right: px-to-rem(12);
      }

      > div:nth-child(2) {
        line-height: px-to-rem(14);
        color: var(--primary-color);
      }
    }
  }
}
</style>
