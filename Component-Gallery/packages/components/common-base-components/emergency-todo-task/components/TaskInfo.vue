<template>
  <div class="emergency-todo-task-detail__info">
    <c-scroll>
      <div class="content" v-if="!loading">
        <div class="item">
          <div class="left"> 任务时间： </div>
          <div class="right">
            {{ task?.taskStartDate }}~{{ task?.taskStopDate }}
          </div>
        </div>
        <div class="item">
          <div class="left"> 负责人： </div>
          <div class="right">
            {{ task?.nickNames }}
          </div>
        </div>
        <div class="item">
          <div class="left"> 任务内容： </div>
          <div class="right">
            {{ task?.taskDetail }}
          </div>
        </div>
        <div class="item" v-if="task.files.length">
          <div class="left"> 附件： </div>
          <div class="right">
            <base-upload v-model="task.files" readonly></base-upload>
          </div>
        </div>
      </div>
    </c-scroll>

    <base-loading v-if="loading" />
  </div>
</template>

<script>
import BaseUpload from '../../base-form-inner/base-upload/BaseUpload.vue'
import BaseLoading from '../../base-loading/BaseLoading.vue'
import { getTaskInfoById } from '../service'
import { generateFileList } from '../utils/common'
import CScroll from '@component-gallery/utils/funCommon/c-scroll.vue'

export default {
  components: {
    CScroll,
    BaseLoading,
    BaseUpload
  },
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      task: {
        taskStartDate: undefined,
        taskStopDate: undefined,
        nickNames: undefined,
        taskDetail: undefined,
        files: []
      },
      loading: true
    }
  },
  watch: {
    taskInfo: {
      async handler(val) {
        if (val) {
          await this.getTaskInfoById(val.taskId)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getTaskInfoById(taskId) {
      try {
        this.loading = true
        const res = await getTaskInfoById({ taskId })
        const { code, data } = res
        if (code === 200) {
          this.task = {
            ...data,
            files: generateFileList(data)
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-wiseblue'] .emergency-todo-task-detail__info {
  --text-color: #e8f3fe;
  --text-color-70: rgba(232, 243, 254, 0.7);
}

[data-theme='theme-aquamarine'] .emergency-todo-task-detail__info {
  --text-color: #ffffff;
  --text-color-70: rgba(255, 255, 255, 0.7);
}

[data-theme='theme-terracotta'] .emergency-todo-task-detail__info {
  --text-color: #e4e7c1;
  --text-color-70: rgba(228, 231, 193, 0.7);
}

.emergency-todo-task-detail__info {
  @include themeify(false) {
    height: 100%;

    ::v-deep .content {
      padding-top: px-to-rem(12);
      padding-right: px-to-rem(12);

      > .item {
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
    }
  }
}
</style>
