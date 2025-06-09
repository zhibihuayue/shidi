<template>
  <transition name="viewer-fade">
    <div
      tabindex="-1"
      ref="el-image-viewer__wrapper"
      class="el-image-viewer__wrapper"
      :style="{ 'z-index': viewerZIndex }"
    >
      <div class="el-image-viewer__mask"></div>
      <!-- CLOSE -->
      <span class="close_btn" @click="hide"> </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="prevLeft"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        >
          <i class="el-icon-arrow-left" />
        </span>
        <span
          class="nextRight"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        >
          <i class="el-icon-arrow-right" />
        </span>
      </template>
      <!-- ACTIONS -->
      <!-- <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <span>{{ index + 1 }}</span>
          <i class="el-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="el-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i class="el-icon-refresh-left" @click="handleActions('anticlocelise')"></i>
          <i class="el-icon-refresh-right" @click="handleActions('clocelise')"></i>
        </div>
      </div> -->
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas" @contextmenu.prevent>
        <template v-for="(url, i) in urlList">
          <img
            :key="i"
            v-if="i === index && isImage"
            ref="img"
            class="el-image-viewer__img"
            :src="url.fileUrl"
            :style="imgStyle"
            referrerpolicy="no-referrer"
            @load="handleImgLoad"
            @error="handleImgError"
            @mousedown="handleMouseDown"
          />
          <video
            :key="i + 'video'"
            controls
            autoplay
            muted
            disablePictureInPicture
            v-if="i === index && isVideo"
            ref="video"
            :src="url.fileUrl"
            :style="imgStyle"
            controlslist="nodownload noplaybackrate"
            class="el-image-viewer__video"
            referrerpolicy="no-referrer"
            @load="handleImgLoad"
            @error="handleImgError"
            @mousedown="handleMouseDown"
          />

          <audio
            :key="i + 'video'"
            controls
            autoplay
            muted
            disablePictureInPicture
            v-if="i === index && isAudio"
            ref="video"
            :src="url.fileUrl || url.audioFileUrl"
            :style="imgStyle"
            controlslist="nodownload noplaybackrate"
            class="el-image-viewer__video"
            referrerpolicy="no-referrer"
            @load="handleImgLoad"
            @error="handleImgError"
            @mousedown="handleMouseDown"
          />
        </template>
        <div
          v-if="isShowWaterSeal"
          :class="['water-seal', hideMask && 'hidden']"
        >
          <div v-if="$slots.default" class="water-slot-default">
            <slot />
          </div>
          <div v-else class="left">
            <div class="line">{{ waterSeal?.trappingInsects || '' }}</div>
            <div class="line">{{ waterSeal?.createTime || '' }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from 'element-ui/src/utils/dom'
import { rafThrottle, isFirefox } from 'element-ui/src/utils/util'
import { PopupManager } from 'element-ui/src/utils/popup'
import { throttle } from 'lodash-es'

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
}

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

export default {
  name: 'footerInfoPopImageViewer',
  props: {
    isShowWaterSeal: {
      type: Boolean,
      default: false
    },
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 30000
    },
    onSwitch: {
      type: Function,
      default: () => ({})
    },
    onClose: {
      type: Function,
      default: () => ({})
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    waterSeal: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      keyDownHandler: null,
      mouseWheelHandler: null,
      dragHandler: null,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      hideMask: true
    }
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1
    },
    isFirst() {
      return this.index === 0
    },
    isLast() {
      return this.index === this.urlList.length - 1
    },
    currentImg() {
      return this.urlList[this.index].fileUrl
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        'transform': `scale(${scale}) rotate(${deg}deg)`,
        'transition': enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    },
    viewerZIndex() {
      const nextZIndex = PopupManager.nextZIndex()
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex
    },
    isImage() {
      return this.urlList[this.index].type === '1'
    },
    isVideo() {
      return this.urlList[this.index].type === '2'
    },
    isAudio() {
      return this.urlList[this.index].type === '3'
    }
  },
  watch: {
    index: {
      handler: function (val) {
        this.reset()
        this.onSwitch(val)
      }
    },
    currentImg(val) {
      if (!this.isImage) {
        return false
      }
      this.$nextTick((_) => {
        const $img = this.$refs.img[0]
        if ($img && !$img.complete) {
          this.loading = true
        }
      })
    }
  },
  methods: {
    hide() {
      this.deviceSupportUninstall()
      this.onClose()
    },
    deviceSupportInstall() {
      this.keyDownHandler = (e) => {
        e.stopPropagation()
        const keyCode = e.keyCode
        switch (keyCode) {
          // ESC
          case 27:
            this.hide()
            break
          // SPACE
          case 32:
            this.toggleMode()
            break
          // LEFT_ARROW
          case 37:
            this.prev()
            break
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case 39:
            this.next()
            break
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut')
            break
        }
      }
      this.mouseWheelHandler = rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          })
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          })
        }
      })
      on(document, 'keydown', this.keyDownHandler)
      on(document, mousewheelEventName, this.mouseWheelHandler)
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this.keyDownHandler)
      off(document, mousewheelEventName, this.mouseWheelHandler)
      this.keyDownHandler = null
      this.mouseWheelHandler = null
    },
    handleImgLoad(e) {
      this.loading = false
    },
    handleImgError(e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return

      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this.dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this.dragHandler)
      on(document, 'mouseup', (ev) => {
        off(document, 'mousemove', this.dragHandler)
      })

      e.preventDefault()
    },
    handleMaskClick() {
      if (this.maskClosable) {
        this.hide()
      }
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
      if (this.isVideo) {
        this.$nextTick(() => {
          const $video = this.$refs.video[0]
          $video.style.removeProperty('--controls-rotate')
          $video.style.removeProperty('--controls-width')
          $video.style.removeProperty('--controls-height')
        })
      }
    },
    toggleMode() {
      if (this.loading) return

      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.indexOf(this.mode)
      const nextIndex = (index + 1) % modeNames.length
      this.mode = Mode[modeNames[nextIndex]]
      this.reset()
    },
    prev() {
      if (this.isFirst && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index - 1 + len) % len
      this.$emit('update:initialIndex', this.index)
    },
    next() {
      if (this.isLast && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index + 1) % len
      this.$emit('update:initialIndex', this.index)
    },
    handleActions(action, options = {}) {
      if (this.loading) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      const { transform } = this
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            )
          }
          break
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.deg += rotateDeg
          this.rotateVideo()
          break
        case 'anticlocelise':
          transform.deg -= rotateDeg
          this.rotateVideo()
          break
      }
      transform.enableTransition = enableTransition
    },
    rotateVideo() {
      if (!this.isVideo) {
        return false
      }
      const $video = this.$refs.video[0]
      const width = $video.clientWidth
      const height = $video.clientHeight
      $video.style.setProperty('--controls-rotate', -this.transform.deg + 'deg')
      if (this.transform.deg % 180 === 0) {
        $video.style.setProperty('--controls-width', width + 'px')
        $video.style.setProperty('--controls-height', height + 'px')
      } else {
        $video.style.setProperty('--controls-width', height + 'px')
        $video.style.setProperty('--controls-height', width + 'px')
      }
    },
    onMousemove: throttle(function (e) {
      if (e.clientY / window.innerHeight > 0.85) {
        // 到达屏幕下端85%的位置时就隐藏这个遮罩
        this.hideMask = true
      } else {
        this.hideMask = false
      }
    }, 150)
  },
  mounted() {
    this.$el.addEventListener('mousemove', this.onMousemove)
    this.deviceSupportInstall()
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs['el-image-viewer__wrapper'].focus()
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.close_btn {
  position: fixed;
  top: px-to-rem(48);
  right: px-to-rem(6);
  z-index: 2;
  width: px-to-rem(38);
  height: px-to-rem(38);
  background: url('~@component-gallery/assets/image/closeIcon@2x.png');
  background-size: 100% 100%;
  text-align: center;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.prevLeft,
.nextRight {
  background: rgb(2 50 32 / 70%);
  color: #fff;
  position: fixed;
  top: 50%;
  z-index: 99;
  width: px-to-rem(61);
  height: px-to-rem(61);
  background: rgb(2 50 32 / 70%);
  border-radius: 50%;
  color: #fff;
  font-size: px-to-rem(22);
  text-align: center;
  transform: translate(0, -50%);
  line-height: px-to-rem(64);
  cursor: pointer;
  i {
    font-weight: 600;
  }
  &:hover {
    background: rgb(2 50 32 / 60%);
    color: rgb(255 255 255 / 60%);
  }
}
.prevLeft {
  left: px-to-rem(24);
}

.nextRight {
  right: px-to-rem(24);
}

.el-image-viewer__actions {
  border-radius: px-to-rem(22);
}

video::-webkit-media-controls-enclosure {
  position: relative;
}

video::-webkit-media-controls-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--controls-width, 100%);
  height: var(--controls-height, 100%);
  transition: all;
  transform: translate(-50%, -50%) rotate(var(--controls-rotate, 0));
}

video::-webkit-media-controls-fullscreen-button {
  display: none;
}

video::-webkit-media-controls-time-remaining-display {
  display: none !important;
}

img {
  height: 100%;
}

.water-seal {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: px-to-rem(12) px-to-rem(24);
  width: 100%;
  height: px-to-rem(98);
  background: linear-gradient(180deg, transparent, rgb(0 0 0 / 85%));
  opacity: 1;
  transition: all 0.3s;
  pointer-events: none;

  &.hidden {
    opacity: 0;
  }

  .line {
    font-size: px-to-rem(14);

    .iconfont_tools {
      margin-right: px-to-rem(6);
      font-size: px-to-rem(12);
    }

    + .line {
      margin-top: px-to-rem(12);
    }
  }

  .left {
    color: #fff;
  }

  .right {
    font-size: px-to-rem(12);
  }
}
</style>
