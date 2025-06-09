<!-- <template>
  <div :id="'draw_ts_' + pid" ref="drawTs" class="c-draw-ts"></div>
</template>
<script>
import $ from 'jquery'
import { uuid } from '@component-gallery/utils/funCommon/common'

export default {
  name: 't-show-msg',
  data() {
    return {
      pid: uuid()
    }
  },
  methods: {
    /**
     * 提示
     */
    doMessTs(mess, one) {
      const $dom = $('#draw_ts_' + this.pid)
      const messId = uuid()
      const str =
        '<div id="' +
        messId +
        '" class="mess-ts"><span>' +
        mess +
        '</span></div>'
      if (one) {
        $dom.html(str)
      } else {
        $dom.append(str)
      }
      const $mess = $('#' + messId)
      this.doMessFit()
      $mess.addClass('show')
      setTimeout(() => {
        $mess.remove()
        this.doMessFit(true)
      }, 5000)
    },
    /**
     * 提示 适配
     */
    doMessFit(remove) {
      let top = 0
      $('#draw_ts_' + this.pid + ' .mess-ts').each(function () {
        if (remove) {
          $(this).addClass('move')
        }
        top += 16
        const h = $(this).outerHeight()
        $(this).css({
          top
        })
        top += h
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.c-draw-ts {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  pointer-events: none !important;

  .mess-ts {
    position: absolute;
    top: px-to-rem(16);
    left: 10%;
    z-index: 96;
    width: 80%;
    opacity: 0;
    transition: transform 0.2s, opacity 0.2s;
    color: rgb(255 255 255 / 90%);
    font-size: px-to-rem(14);
    text-align: center;
    pointer-events: none;
    transform: translateY(-100%);

    &.show {
      transform: translateY(0);
      opacity: 1;
    }

    &.move {
      transition: transform 0.2s, opacity 0.2s, top 0.2s;
    }

    span {
      display: inline-block;
      padding: px-to-rem(5) px-to-rem(12);
      background: rgb(0 0 0 / 70%);
      border-radius: px-to-rem(4);
      text-align: left;
      line-height: px-to-rem(22);
    }
  }
}
</style> -->

<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div v-if="message" :id="'draw_ts_' + pid" ref="drawTs" class="c-draw-ts">
      <div class="mess-ts" :style="{ top: message.top + 'px' }">
        <span>{{ message.text }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'TShowMsg',
  data() {
    return {
      pid: uuidv4(),
      message: {},
      OffsetY: 0
    }
  },
  methods: {
    showMessage(text, one, adjustTopOffset) {
      const messId = uuidv4()
      const message = {
        id: messId,
        text,
        top: 0
      }
      this.OffsetY = adjustTopOffset
      if (one) {
        this.message = message
      } else if (!this.message) {
        this.message = message
      } else {
        this.removeMessage()
        setTimeout(() => {
          this.message = message
        }, 5000)
      }

      this.$nextTick(this.updateMessagePosition)
      setTimeout(() => {
        this.removeMessage()
      }, 5000)
    },
    removeMessage() {
      this.message = null
    },
    updateMessagePosition() {
      if (this.message && this.$refs.drawTs) {
        this.message.top = 16
        const height = this.$refs.drawTs.firstChild.offsetHeight
        if (this.OffsetY) {
          this.message.top += this.OffsetY
        }
      }
    },
    handleAfterLeave() {
      this.updateMessagePosition()
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.c-draw-ts {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
}

.mess-ts {
  position: absolute;
  left: 10%;
  z-index: 96;
  width: 80%;
  opacity: 1;
  transition: transform 0.2s, opacity 0.2s, top 0.2s;
  color: rgb(255 255 255 / 90%);
  font-size: px-to-rem(14);
  text-align: center;
  pointer-events: none;
}

.mess-ts span {
  display: inline-block;
  padding: px-to-rem(5) px-to-rem(12);
  background: rgb(0 0 0 / 70%);
  border-radius: px-to-rem(4);
  text-align: left;
  line-height: px-to-rem(22);

  &:empty {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
