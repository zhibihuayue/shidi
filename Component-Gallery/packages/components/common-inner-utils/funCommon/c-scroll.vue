<template>
  <!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
  <div :class="{ auto: auto }" class="c-scroll">
    <el-scrollbar
      ref="scroll"
      @mouseenter.native="stopAuto()"
      @mouseleave.native="doAuto()"
    >
      <slot />
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'c-scroll',
  props: {
    autoScroll: {} //自动滚动(可选); 例[param1, param2, param3]; param1: 每次滚动延迟,单位秒, init必传; param2: 每次滚动高度, 单位像素, init必传; param3: 是否手动滚动后拉齐, 0, 1, 2 int可选
  },
  data() {
    return {
      diff: 1,
      auto: false,
      resizeObserver: null
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      this.$nextTick(() => {
        try {
          this.$refs.scroll.update()
          this.diff = -this.diff
          let scrollTop = this.$refs.scroll.$refs.wrap.scrollTop + this.diff
          if (scrollTop < 0) {
            scrollTop = 0
          }
          this.$refs.scroll.$refs.wrap.scrollTop = scrollTop
        } catch (e) {
          //console.log(e)
        }
      })
    })
    this.resizeObserver.observe(this.$el)
    this.doAuto()
  },
  methods: {
    /**
     * 自动滚动
     */
    doAuto() {
      if (!this.autoScroll) {
        return false
      }
      let [t, h, fit] = this.autoScroll
      // 获取 body 元素
      let bodyElement = document.body

      this.stopAuto()
      this.auto = setInterval(() => {
        // 使用 getComputedStyle 获取 body 的字体大小
        let style = window.getComputedStyle(bodyElement)
        let fontSize = style.fontSize
        let fontSizeNum = parseFloat(fontSize)

        let newH = Math.round(h * fontSizeNum)
        try {
          const $wrap = this.$refs.scroll.$refs.wrap
          if ($wrap.offsetHeight >= $wrap.scrollHeight) {
            return false
          }
          const st = Math.ceil($wrap.scrollTop)
          if ($wrap.scrollHeight - st > $wrap.offsetHeight) {
            let scrollTop = st + newH
            if (fit && st % newH !== 0) {
              scrollTop -= st % newH
              if (fit === 2) {
                scrollTop += newH
              }
            }
            $wrap.scrollTop = scrollTop
          } else {
            $wrap.scrollTop = 0
          }
        } catch (e) {
          //console.log(e)
        }
      }, t * 1000)
    },
    /**
     * 停止自动滚动
     */
    stopAuto() {
      clearInterval(this.auto)
      this.auto = false
    }
  },
  beforeDestroy() {
    this.stopAuto()
  }
}
</script>
<style lang="scss">
.c-scroll {
  width: 100%;
  height: 100%;

  .el-scrollbar {
    position: relative;
    height: 100%;

    .el-scrollbar__wrap {
      overflow: scroll !important;
      overflow-x: auto !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }

    .el-scrollbar__bar {
      right: 0;
      bottom: 0;
      border-radius: 3px;
      opacity: 1;
      pointer-events: none;

      &.is-horizontal {
        left: 0;
        height: 6px;
      }

      &.is-vertical {
        top: 0;
        width: 6px;
      }

      .el-scrollbar__thumb {
        pointer-events: auto;
        background: rgb(79 159 255 / 40%);

        &:hover {
          background: rgb(79 159 255 / 60%);
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
    opacity: 0;
  }

  &.auto {
    .el-scrollbar {
      .el-scrollbar__wrap {
        scroll-behavior: smooth;
      }
    }
  }
}

[data-theme='theme-terracotta'] {
  .c-scroll {
    .el-scrollbar {
      .el-scrollbar__thumb {
        pointer-events: auto;
        background: rgb(121 107 61 / 76%);

        &:hover {
          background: rgb(121 107 61 / 91%);
        }
      }
    }
  }
}

[data-theme='theme-aquamarine'] {
  .c-scroll {
    .el-scrollbar {
      .el-scrollbar__thumb {
        pointer-events: auto;
        background: rgb(2 137 109 / 40%);

        &:hover {
          background: rgb(2 137 109 / 55%);
        }
      }
    }
  }
}
</style>
