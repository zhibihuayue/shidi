<template>
  <base-dialog
    class="emergency-todo-task-detail__feedback-modal"
    v-model="show"
    :title="'任务反馈'"
    :width="800"
    :height="'auto'"
    @input="$emit('input', false)"
  >
    <div class="feedback-modal-content">
      <el-form
        class="feedback-modal-form"
        :label-width="pxToRem(96)"
        :rules="rules"
        :model="eventForm"
        ref="eventFormRef"
        :inline-message="true"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务进度(%)" prop="progress">
              <base-input-number v-model="eventForm.progress" placeholder="请输入" :min="0" :max="100" :precision="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="反馈内容" prop="content">
              <el-input
                size="medium"
                class="c-textarea"
                type="textarea"
                maxlength="200"
                show-word-limit
                placeholder="请输入"
                v-model="eventForm.content"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件" class="label-wrapper">
              <template v-slot:label>
                <span class="label-text">附件</span>
                <span
                  class="label-icon"
                  v-c-tip:top="
                    '上传格式支持png、jpg、jpeg、mp4、txt、doc、docx、pdf、ppt、pptx，单个文件上传不得大于10M，最多可上传9个。'
                  "
                ></span>
              </template>

              <base-upload
                ref="imgList"
                :fileType="'image/png,image/jpg,image/jpeg,video/mp4,.txt,.doc,.docx,.pdf,.ppt,.pptx'"
                :limit="9"
                v-model="eventForm.fileList"
                fileTypeMessage="png、jpg、jpeg、mp4、txt、doc、docx、pdf、ppt、pptx"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="feedback-modal-footer">
      <base-button :width="108" :height="32" type="primary" @click="onConfirm"> 确定 </base-button>
      <base-button :width="108" :height="32" @click="$emit('input', false)"> 取消 </base-button>
    </div>
  </base-dialog>
</template>

<script>
import BaseUpload from '../../base-form-inner/base-upload/BaseUpload.vue'
import BaseDialog from '../../base-dialog/BaseDialog.vue'
import BaseButton from '../../base-button/BaseButton.vue'
import BaseInputNumber from '../../base-form-inner/base-input-number/BaseInputNumber.vue'
import '@component-gallery/utils/funCommon/tooltip/directive'
import { generateFileParams } from '../utils/common'
import { debounce, every } from 'lodash-es'
import { doFeedback } from '../service'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'

export default {
  components: {
    BaseInputNumber,
    BaseDialog,
    BaseButton,
    BaseUpload
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    taskInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      show: this.value,
      //表单校验规则
      rules: {
        progress: [{ required: true, message: '任务进度(%)不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '反馈内容不能为空', trigger: 'blur' }]
        // imgList: [{ message: '附件未上传完成', validator: this.checkFileList }]
      },
      //表单数据
      eventForm: {
        progress: undefined,
        content: '',
        fileList: [] //文档
      }
    }
  },
  methods: {
    // 定义一个确认操作的方法，使用防抖动函数来避免重复提交
    onConfirm: debounce(function () {
      // 调用表单的验证方法，验证是否通过
      this.$refs.eventFormRef.validate(async (valid) => {
        // 如果验证通过
        if (valid) {
          // 检查文件列表中是否所有文件都有文件URL
          const hasFileUrl = every(this.eventForm.fileList, (item) => item.fileUrl && item.fileUrl.length)
          // 如果有文件正在上传中
          if (!hasFileUrl) {
            // 提示用户附件上传中，请稍后再试
            return CommonMessage.error('附件上传中，请稍后再试')
          }

          // 尝试提交反馈
          try {
            // 构建提交参数
            const params = {
              dealClient: 0,
              taskId: this.taskInfo.taskId,
              taskProgress: this.eventForm.progress,
              feedbackDetail: this.eventForm.content,
              ...generateFileParams(this.eventForm.fileList)
            }

            // 调用反馈服务
            await doFeedback(params)
            // 发射确认事件，传递任务ID和进度
            this.$emit('confirm', {
              taskId: this.taskInfo.taskId,
              taskProgress: this.eventForm.progress
            })
          } catch (e) {
            // 如果提交失败，打印错误信息
            console.error(e)
          }
        }
      }, 300)
    })
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

[data-theme='theme-wiseblue'] .emergency-todo-task-detail__feedback-modal {
  --text-color: #e8f3fe;
}

[data-theme='theme-aquamarine'] .emergency-todo-task-detail__feedback-modal {
  --text-color: #ffffff;
}

[data-theme='theme-terracotta'] .emergency-todo-task-detail__feedback-modal {
  --text-color: #e4e7c1;
}

.emergency-todo-task-detail__feedback-modal {
  @include themeify(false) {
    height: auto !important;
    ::v-deep {
      .innercomp-abcontainer-body {
        height: auto !important;
        min-height: px-to-rem(266);

        .feedback-modal-form {
          padding: px-to-rem(12) px-to-rem(12) 0 px-to-rem(12);

          .el-input-number {
            width: px-to-rem(200);
          }
        }

        .feedback-modal-content {
          color: #fff;
          font-size: px-to-rem(14);

          .c-textarea {
            position: relative;
            height: auto !important;
            min-height: px-to-rem(72);
            resize: none;

            .el-input__count {
              background: transparent;
              right: px-to-rem(10);
              bottom: px-to-rem(6);
              font-size: px-to-rem(14);
              line-height: px-to-rem(21);
              color: var(--text-color);
            }

            .el-textarea__inner {
              min-height: px-to-rem(72) !important;
              height: 100%;
              padding: px-to-rem(6) px-to-rem(12);
              color: themed('global-text-color');
            }
          }

          .el-form-item__error {
            position: relative;
            top: px-to-rem(6);
            height: px-to-rem(32);
            display: flex;
            align-items: center;
            font-size: px-to-rem(14);
            color: #ed5158;
            background: rgba(237, 81, 88, 0.2);
            border-radius: px-to-rem(4);
            margin-left: 0;
            margin-top: px-to-rem(0);
            padding-left: px-to-rem(32);
            padding-top: 0;

            &::before {
              position: absolute;
              left: px-to-rem(12);
              top: 50%;
              transform: translateY(-50%);
              font-size: px-to-rem(18);
              line-height: 1;
              font-family: 'iconfont_tools', sans-serif !important;
              content: '\ed70';
            }
          }

          .el-form-item {
            margin-bottom: px-to-rem(12);
          }

          .el-form-item__content {
            line-height: px-to-rem(32);
          }

          .el-form-item__label {
            line-height: px-to-rem(32);
            color: var(--text-color);

            &::before {
              margin-right: 0;
              width: px-to-rem(8);
              font-weight: 400;
              font-size: px-to-rem(14);
              color: #ed5158;
              text-align: left;
              font-style: normal;
            }
          }

          .label-wrapper {
            .el-form-item__label {
              .label-icon {
                cursor: pointer;
                display: inline-block;
                vertical-align: top;
                width: px-to-rem(12);
                height: px-to-rem(32);
                @if $theme-name == 'theme-wiseblue' {
                  background: url('~@component-gallery/assets/image/emergency-todo-task-detail/terracotta/tip-title.png')
                    no-repeat
                    center;
                }
                @if $theme-name == 'theme-aquamarine' {
                  background: url('~@component-gallery/assets/image/emergency-todo-task-detail/aquamarine/tip-title.png')
                    no-repeat
                    center;
                }
                @if $theme-name == 'theme-terracotta' {
                  background: url('~@component-gallery/assets/image/emergency-todo-task-detail/terracotta/tip-title.png')
                    no-repeat
                    center;
                }
                background-size: 100% !important;
              }

              .label-text {
                padding-right: px-to-rem(10);
                vertical-align: top;
                display: inline-block;
                line-height: px-to-rem(32);
              }
            }
          }
        }

        .feedback-modal-footer {
          height: px-to-rem(44);
          display: flex;
          align-items: flex-start;
          justify-content: center;

          .base-button:first-child {
            margin-right: px-to-rem(12);
          }
        }

        .common-base-upload .files {
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>
