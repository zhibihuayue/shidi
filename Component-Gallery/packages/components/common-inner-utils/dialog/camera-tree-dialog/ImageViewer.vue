<template>
  <transition name="viewer-fade">
    <div
      tabindex="-1"
      ref="el-image-viewer__wrapper"
      class="el-image-viewer__wrapper"
      :style="{ 'z-index': viewerZIndex }"
    >
      <div class="el-image-viewer__mask" @click.self="handleMaskClick"></div>
      <!-- CLOSE -->
      <span class="close_btn" @click="hide"></span>
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
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas" @contextmenu.prevent>
        <div v-for="(url, i) in urlList" :key="url + i">
          <div v-if="i === index">
            <img
              :key="i"
              v-if="isImage(url)"
              ref="img"
              class="el-image-viewer__img"
              :src="url"
              :style="imgStyle"
              referrerpolicy="no-referrer"
              @load="handleImgLoad"
              @error="handleImgError"
              @mousedown="handleMouseDown"
            />
            <video
              :key="i + 'video'"
              controls
              disablePictureInPicture
              autoplay
              v-else
              ref="video"
              :src="url"
              :style="imgStyle"
              controlslist="nodownload noplaybackrate"
              class="el-image-viewer__video"
              referrerpolicy="no-referrer"
              @load="handleImgLoad"
              @error="handleImgError"
              @mousedown="handleMouseDown"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { off, on } from 'element-ui/src/utils/dom'
import { isFirefox, rafThrottle } from 'element-ui/src/utils/util'
import { PopupManager } from 'element-ui/src/utils/popup'
import _ from 'lodash'

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
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 30000
    },
    onClose: {
      type: Function,
      required: true
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
    }
  },

  data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
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
      return this.urlList[this.index]
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
    }
  },
  watch: {
    index: {
      handler: function (val) {
        this.reset()
      }
    },
    currentImg(val) {
      if (!this.isImage(val)) {
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
    isImage(val) {
      const fileTypes = ['jpg', 'jpeg', 'png', 'JPEG', 'JPG', 'PNG']
      return fileTypes.find((item) => val.includes(item))
    },
    hide() {
      this.deviceSupportUninstall()
      this.onClose()
    },
    deviceSupportInstall() {
      this._keyDownHandler = (e) => {
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
      this._mouseWheelHandler = rafThrottle((e) => {
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
      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
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
      this._dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', (ev) => {
        off(document, 'mousemove', this._dragHandler)
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
    onMousemove: _.throttle(function (e) {
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
@import '~@component-gallery/theme-chalk/src/mixins/mixins';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.el-image-viewer__wrapper {
  @include themeify(false) {
    @if $theme-name == 'theme-aquamarine' {
      .close_btn {
        background: url('~@component-gallery/assets/image/closeIcon@2x.png');
        background-size: 100% 100%;
        text-align: center;
      }
      .prevLeft,
      .nextRight {
        background: rgb(2 50 32 / 70%);
        color: #fff;
        &:hover {
          background: rgb(2 50 32 / 60%);
          color: rgb(255 255 255 / 60%);
        }
      }
    }
    @if $theme-name == 'theme-wiseblue' {
      .close_btn {
        background: url('~@component-gallery/assets/image/closeIconTy.png');
        background-size: 100% 100%;
        text-align: center;
      }
      .prevLeft,
      .nextRight {
        background: rgba(23, 37, 55, 0.8);
        color: #e8f3fe;
        &:hover {
          background: rgb(23, 37, 55, 0.6);
          color: rgba(232, 243, 254, 0.6);
        }
      }
    }
    @if $theme-name == 'theme-terracotta' {
      .close_btn {
        background: url('~@component-gallery/assets/image/closeIconGt2.png');
        background-size: 100% 100%;
        text-align: center;
      }
      .prevLeft,
      .nextRight {
        background: rgba(21, 19, 12, 0.7);
        color: #ffeeb1;
        &:hover {
          background: rgb(21, 19, 12, 0.6);
          color: rgba(255, 238, 177, 0.6);
        }
      }
    }
  }
}
.close_btn {
  position: fixed;
  top: px-to-rem(48);
  right: px-to-rem(8);
  z-index: 2;
  width: px-to-rem(38);
  height: px-to-rem(38);
  background: rgb(255 255 255 / 70%);
  background-size: 100% 100%;
  border-radius: 50%;
  color: rgb(0 0 0 / 50%);
  font-size: px-to-rem(18);
  text-align: center;
  line-height: px-to-rem(38);
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.prevLeft {
  position: fixed;
  top: 50%;
  left: px-to-rem(24);
  z-index: 99;
  width: px-to-rem(61);
  height: px-to-rem(61);
  background: rgb(255 255 255 / 70%);
  border-radius: 50%;
  color: rgb(0 0 0 / 50%);
  font-size: px-to-rem(22);
  text-align: center;
  transform: translate(0, -50%);
  line-height: px-to-rem(64);
  cursor: pointer;
  i {
    font-weight: 600;
  }
}

.nextRight {
  position: fixed;
  top: 50%;
  right: px-to-rem(24);
  z-index: 99;
  width: px-to-rem(61);
  height: px-to-rem(61);
  background: rgb(255 255 255 / 70%);
  border-radius: 50%;
  color: rgb(0 0 0 / 50%);
  font-size: px-to-rem(22);
  text-align: center;
  transform: translate(0, -50%);
  line-height: px-to-rem(64);
  cursor: pointer;
  i {
    font-weight: 600;
  }
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
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0%) 0%,
    rgb(0 0 0 / 85%) 100%
  );
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
