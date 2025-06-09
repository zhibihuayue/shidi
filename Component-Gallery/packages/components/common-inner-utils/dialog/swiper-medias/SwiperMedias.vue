<template>
  <div class="swiper-medias">
    <el-carousel
      class="swiper"
      :arrow="previewData.length > 1 ? 'always' : 'never'"
      :autoplay="false"
      @change="getIndex"
    >
      <el-carousel-item
        v-for="(item, index) in previewData"
        :key="item.fileUrl + index"
      >
        <img
          v-if="item.type === '1'"
          :src="item.fileUrl"
          alt="media"
          class="media-img"
        />
        <div v-if="item.type === '2'" class="video-wrapper">
          <img v-if="!playStatus" src="./assets/icon_play_ly@2x.png" alt="" />
          <video
            controls
            @play="playStatus = true"
            @pause="videoPause"
            ref="video"
            :src="item.fileUrl"
          ></video>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="full-screen" @click="preView">
      <i class="iconfont_tools icon-quanpingicon"></i>
    </div>
    <image-viewer
      v-if="showViewer"
      :urlList="previewData"
      :isShowWaterSeal="true"
      :initial-index="currentIndex"
      :waterSeal="waterSeal"
      :onClose="closeViewer"
    />
  </div>
</template>

<script>
import ImageViewer from '../image-video-preview/Index.vue'
export default {
  name: 'SwiperMedias.vue',
  props: {
    fileList: {
      type: Array,
      default: () => [],
      required: true
    },
    waterSeal: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    ImageViewer
  },
  data() {
    return {
      imgSuffix: [
        '.png',
        '.jpg',
        '.jpeg',
        '.PNG',
        '.JPG',
        '.JPEG',
        '.gif',
        '.GIF'
      ],
      videoSuffix: ['.mp4', '.MP4'],
      showViewer: false,
      currentIndex: 0,
      playStatus: false
    }
  },
  computed: {
    previewData() {
      return this.fileList
        .map((item) => {
          if (this.imgSuffix.find((suffix) => item.fileUrl.includes(suffix))) {
            item.type = '1'
          }
          if (
            this.videoSuffix.find((suffix) => item.fileUrl.includes(suffix))
          ) {
            item.type = '2'
          }
          return item
        })
        .sort((a, b) => b.type - a.type)
    }
  },
  methods: {
    preView() {
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    getIndex(index) {
      this.$refs?.video.map((item) => item.pause())
      this.currentIndex = index
    },
    videoPause() {
      this.playStatus = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

video::-webkit-media-controls-fullscreen-button {
  display: none;
}

video::-webkit-media-controls-play-button {
  opacity: 0;
}

video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-current-time-display {
  display: none;
}

video::-webkit-media-controls-time-remaining-display {
  display: none;
}

video::-webkit-media-controls-mute-button {
  display: none;
}

video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}

video::-webkit-media-controls-volume-slider {
  display: none;
}

video::-webkit-media-controls-enclosure {
  display: none;
}

.swiper-medias {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;

  ::v-deep .el-carousel__indicators {
    display: none;
  }

  .swiper {
    width: 100%;
    height: 100%;

    ::v-deep .el-carousel__container,
    img,
    video {
      width: 100%;
      height: 100%;
      border-radius: px-to-rem(4);
    }
    ::v-deep .el-carousel__arrow--left {
      left: px-to-rem(6);
    }
    ::v-deep .el-carousel__arrow--right {
      right: px-to-rem(6);
    }

    ::v-deep .el-carousel__arrow {
      background: rgb(2 50 32 / 70%);
      color: #fff;
      font-size: px-to-rem(18);
      height: px-to-rem(30);
      width: px-to-rem(30);
      i {
        font-weight: bold;
        font-size: px-to-rem(14);
        line-height: px-to-rem(30);
      }
    }
  }

  .full-screen {
    position: absolute;
    right: px-to-rem(6);
    bottom: px-to-rem(6);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    width: px-to-rem(32);
    height: px-to-rem(32);
    background: url('~@component-gallery/assets/image/full-screen-icon.png');
    background-size: 100% 100%;
    cursor: pointer;

    i {
      font-size: px-to-rem(20);
    }
  }

  .video-wrapper {
    width: 100%;
    height: 100%;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      width: px-to-rem(32);
      height: px-to-rem(32);
      transform: translate(-50%, -50%);
      cursor: pointer;
      pointer-events: none;
    }
  }
}
</style>
