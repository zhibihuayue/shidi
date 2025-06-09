<!--
  文件预览器
  这个预览器组件提供一个可以被插入到页面上的文件预览服务
  按需要扩充
-->
<template>
  <div v-loading="loading" class="rcontainer" @contextmenu.prevent>
    <video-player
      v-if="nowType === 'video'"
      class="video-player video-player vjs-custom-skin"
      :playsinline="true"
      :options="playerOptions"
    />
    <img
      v-if="nowType === 'image'"
      :src="nowUrl"
      alt="图片"
      class="imgdom"
      :style="{
        'width': '100%',
        'height': '100%',
        'object-fit': fit,
        'transform': `scale(${imgScale}) rotate(${imgRotate}deg)`
      }"
    />
    <iframe
      v-if="nowType === 'iframe'"
      title=""
      class="iframedom"
      charset="utf-8"
      :src="nowUrl"
    />
    <div
      ref="doccontainer"
      :class="[
        'iframedom',
        nowType === 'text' && 'padding',
        ['docx', 'text'].indexOf(nowType) === -1 && 'hidden'
      ]"
    />
    <div v-if="nowType === 'unknown'" class="otherpreview">
      <div>
        当前文件不支持预览，请<a style="cursor: pointer" @click="onOpen">下载</a
        >后查看
      </div>
    </div>
  </div>
</template>

<script>
import { b64toBlob } from '../utils/index'
import { downloadByUrl } from '../utils/api'
import FileSaver from 'file-saver'
import { renderAsync } from 'docx-preview'
import axios from 'axios'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'ResourcePreviewer',
  components: {
    videoPlayer
  },
  props: {
    url: String,
    fileName: String, // 用于下载的时候指定文件名。如果不指定，会使用url里解析出来的大概值
    type: String, // 用于强制允许外部覆盖类型，一般情况下不应该使用
    // 文件类型判断函数，这个方法用于外部覆盖逻辑。这个函数应当返回image/video/docx/iframe/unknown结果中的一个。如果没传，会使用自带的判断逻辑。
    typeChecker: {
      type: Function,
      default: null
    },
    fit: {
      type: String,
      default: 'scale-down'
    },
    imgScale: {
      // 图片缩放比例
      type: Number,
      default: 1
    },
    imgRotate: {
      // 旋转角，单位为度数
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      nowUrl: '',
      loading: false,
      // 当前类型。分为image/video/docx（使用docx-preview预览）/iframe（使用iframe可解决如pdf）/unknown（未知文件，无法预览）
      nowType: 'unknown',
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        loop: false, // 导致视频一结束就重新开始。
        muted: true, // 默认情况下将会消除任何音频。
        preload: 'metadata', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        hls: true,
        html5: {
          hls: {
            withCredentials: false
          }
        },
        sources: [
          {
            type: 'application/x-mpegURL',
            src: ''
          }
        ],
        aspectRatio: '16:9',
        poster: '', // 封面地址
        choosed: false, // 被选中的
        notSupportedMessage: '视频因为网络问题或格式不兼容的原因无法播放', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  watch: {
    url: {
      immediate: true,
      handler(v) {
        this.$nextTick(() => {
          this.nowUrl = v
        })
      }
    },
    type: {
      immediate: true,
      handler(v) {
        if (v) {
          this.nowType = v
        }
      }
    },
    nowUrl(v) {
      if (v) {
        // 判断类型
        if (!this.type) {
          this.nowType = this._TypeChecker({ fileUrl: v })
        } else {
          this.nowType = this.type
        }
        // 如果当前的url是视频，那么修改视频播放信息
        if (this.nowType === 'video') {
          this.playerOptions.sources[0].src = v
          this.playerOptions.sources[0].type = 'video/mp4'
        } else {
          this.playerOptions.sources[0].src = ''
        }

        if (this.nowType === 'docx') {
          this.previewDocx(v)
        } else if (this.nowType === 'text') {
          this.previewText(v)
        } else {
          this.$refs.doccontainer.innerHTML = ''
        }
      }
    }
  },
  methods: {
    _getSuffix(fileUrl) {
      // 简单剥离：url最后一截字符串认为是文件名。这种方式默认了一定带扩展名，如果没带扩展名的话就不得不去通过其他方式获得了
      const noParamUrl = fileUrl.split('?')[0]
      const fileName = noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]
      return fileName?.split('.')[fileName?.split('.').length - 1].toLowerCase()
    },
    isImage(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否图片文件名
      // 这里就只是写几个常用的。
      return ['bmp', 'svg', 'jpg', 'jpeg', 'png', 'gif'].includes(
        this._getSuffix(fileUrl)
      )
    },
    isVideo(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否视频文件名
      // 这里就只是写几个常用的。
      return ['mp4', 'm4v', 'mpeg', 'avi', 'flv'].includes(
        this._getSuffix(fileUrl)
      )
    },
    isTextPreview(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否是可以当作纯文本处理的文件名
      // 这里就只是写几个常用的。
      return ['txt', 'html', 'js', 'csv'].includes(this._getSuffix(fileUrl))
    },
    isIframePreview(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否是可以被iframe处理的文件名
      // 这里就只是写几个常用的。
      return ['pdf'].includes(this._getSuffix(fileUrl))
    },
    isDocxPreview(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // docx预览。这个插件只能接受docx。
      return ['docx'].includes(this._getSuffix(fileUrl))
    },
    // 默认的文件类型判断函数，这个函数应当返回'image' 'video' 'other'三个结果中的一个。
    _TypeChecker(fileInfo) {
      if (this.typeChecker) {
        // 如果外部有覆盖，那就用外部传入的
        return this.typeChecker(fileInfo)
      }
      const { fileUrl } = fileInfo

      // 没有的话，通过url尝试判断
      if (this.isImage(fileUrl)) {
        return 'image'
      }

      if (this.isVideo(fileUrl)) {
        return 'video'
      }
      if (this.isIframePreview(fileUrl)) {
        return 'iframe'
      }
      if (this.isTextPreview(fileUrl)) {
        return 'text'
      }
      if (this.isDocxPreview(fileUrl)) {
        return 'docx'
      }

      // 都不满足条件输出unknown
      return 'unknown'
    },
    async fetchFile(url) {
      try {
        const result = await axios({
          method: 'get',
          responseType: 'blob',
          url,
          withCredentials: false
        })
        return result.data
      } catch (e) {
        console.error('获取文件失败', e)
      }
    },
    async fetchText(url) {
      try {
        const result = await axios({
          method: 'get',
          responseType: 'arraybuffer',
          url,
          withCredentials: false
        })
        return result.data
      } catch (e) {
        console.error('获取文件失败', e)
      }
    },
    async previewDocx(url) {
      this.loading = true
      try {
        const blob = await this.fetchFile(url)
        await renderAsync(blob, this.$refs.doccontainer)
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    },
    async previewText(url) {
      this.loading = true
      try {
        const ab = await this.fetchText(url)
        let str = new window.TextDecoder().decode(ab)
        if (str.indexOf('�') !== -1) {
          // 出现了不明utf8字符，我们认为这里实际上是gbk
          // 从业务角度应该不存在别的编码？
          str = new window.TextDecoder('gbk').decode(ab)
        }
        this.$refs.doccontainer.innerHTML = str
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    },
    onOpen() {
      this.onDownload(this.url, this.fileName)
    },
    // 实际的下载方法
    onDownload(url, fileName) {
      // 数据里没有fileName，自己进行简单剥离：url最后一截字符串认为是文件名。
      const noParamUrl = this.nowUrl.split('?')[0]
      const urlfileName =
        noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]
      let suffix = fileName?.split('.')?.[1]
      // 这里很奇怪，item可能有文件名，但扩展名不一定有；如果没有扩展名，用url解析里补上
      let finalFileName = fileName || urlfileName
      if (!suffix && fileName) {
        // 如果提供的fileName有文件名，但是没有扩展名，直接使用url的文件名的扩展名
        suffix = urlfileName?.split('.')[urlfileName?.split('.').length - 1]
        finalFileName = `${fileName}.${suffix}`
      }
      downloadByUrl(url).then((res) => {
        FileSaver.saveAs(b64toBlob(res.data), finalFileName || '文件')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/alarmDetail/resource-previewer';
</style>
