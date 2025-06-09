<template>
  <el-row class="alarm-device-label__namespace">
    <!-- 左侧标题区域，占据9列宽度 -->
    <el-col :span="9" class="infoDataTitle device-title">{{ title }}</el-col>
    <!-- 右侧内容区域，占据15列宽度 -->
    <el-col :span="15" class="infoDataContentLong">
      <!-- 设备标签包装器 -->
      <div class="device-label-wrapper">
        <!-- 自定义滚动组件 -->
        <c-scroll>
          <!-- 设备标签列表容器 -->
          <div class="device-label-list">
            <!-- 循环渲染每个标签项 -->
            <div class="device-label" v-for="(item, index) in labelList" :key="item + index">
              <!-- 单个标签内容 -->
              <div class="label">
                {{ item }}
              </div>
            </div>
          </div>
        </c-scroll>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CScroll from '@component-gallery/utils/funCommon/c-scroll.vue' // 导入自定义滚动组件

export default {
  components: { CScroll }, // 注册自定义滚动组件
  props: {
    title: {
      type: String, // 定义标题属性类型为字符串
      default: '摄像机标签：' // 设置标题默认值
    },
    labelList: {
      type: Array, // 定义标签列表属性类型为数组
      default: () => [] // 设置标签列表默认值为空数组
    }
  },
  watch: {
    labelList: {
      handler(newVal) {
        // 监听标签列表变化的处理函数
        if (!newVal?.length) {
          // 如果标签列表为空，则直接返回
          return
        }
        this.$nextTick(() => {
          // 等待DOM更新后执行
          const labels = document.querySelectorAll('.device-label-list .device-label .label') // 获取所有标签元素
          if (!labels?.length) {
            // 如果没有找到标签元素，则直接返回
            return
          }
          labels.forEach((label) => {
            // 遍历每个标签元素
            const isMultiline = this.getUIPx(label?.offsetHeight) > 30 // 判断标签是否为多行（高度大于30px）
            label.style.lineHeight = isMultiline ? 1.5 : 1 // 根据是否多行设置不同的行高
          })
        })
      },
      deep: true, // 深度监听数组内部变化
      immediate: true // 组件创建时立即执行一次
    }
  },
  methods: {
    getUIPx(px) {
      // 将像素值转换为相对单位的方法
      const ele = document.querySelector('html') // 获取html元素
      const fontSize = window.getComputedStyle(ele).fontSize.split('px')[0] // 获取根元素字体大小
      return Number(px * 100) / Number(fontSize) // 计算相对单位值并返回
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.alarm-device-label__namespace {
  @include themeify(false) {
    width: 100%;
    .infoDataTitle {
      color: themed('alarm-info-data-title-color');
      font-size: px-to-rem(14);
      text-align: right;
      font-weight: 400;
      line-height: px-to-rem(26);
      padding-top: px-to-rem(3);
    }

    .infoDataTitle.el-col-9 {
      width: px-to-rem(118);
    }
    .infoDataContentLong.el-col-15 {
      width: calc(100% - px-to-rem(118));
    }
    .device-label-wrapper {
      .device-label-list {
        max-height: px-to-rem(101);
        display: flex;
        flex-wrap: wrap;
        padding-right: px-to-rem(6);

        .device-label {
          overflow: hidden;
          min-height: px-to-rem(24);
          padding-right: px-to-rem(6);
          padding-bottom: px-to-rem(3);
          padding-top: px-to-rem(3);
          word-break: break-all;

          .label {
            line-height: px-to-rem(12);
            color: themed('search-map-color');
            @if $theme-name == 'theme-wiseblue' {
              background: rgba(79, 159, 255, 0.2);
            }
            @if $theme-name == 'theme-aquamarine' {
              background: rgba(2, 137, 109, 0.2);
            }
            @if $theme-name == 'theme-terracotta' {
              background: rgba(100, 86, 46, 0.2);
            }
            border-radius: px-to-rem(4);
            padding: px-to-rem(6) px-to-rem(12);
            font-size: px-to-rem(12);
          }
        }
      }

      ::v-deep .c-scroll {
        .el-scrollbar__thumb {
          opacity: 0;
        }
      }

      &:hover {
        ::v-deep .c-scroll {
          .el-scrollbar__thumb {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
