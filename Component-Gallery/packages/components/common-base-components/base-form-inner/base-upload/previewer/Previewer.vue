<!--
  用于附件等地方，全屏混合预览图片和视频的弹窗
  传入对应的资源列表后进行自动类型判断
-->
<template>
  <el-dialog :visible="visible" class="preImg" destroy-on-close append-to-body>
    <span
      class="el-image-viewer__btn el-image-viewer__close"
      @click="closeImgRepeat"
    >
      <em class="el-icon-close"></em>
    </span>
    <resource-previewer
      :file-name="
        metaList && metaList[nowIndex] ? metaList[nowIndex].fileName : ''
      "
      :url="nowUrl"
      :img-scale="imgScale"
      :img-rotate="imgRotate"
      :type-checker="typeChecker"
      :fit="fit"
    />
    <template v-if="nowUrlList && nowUrlList.length > 1">
      <div v-if="nowIndex !== 0" class="prevLeft" @click="jumpUrl(-1)">
        <em class="el-icon-arrow-left" />
      </div>
      <div
        v-if="nowIndex < nowUrlList.length - 1"
        class="nextRight"
        @click="jumpUrl(1)"
      >
        <em class="el-icon-arrow-right" />
      </div>
    </template>

    <div class="fileName">
      {{ metaList && metaList[nowIndex] ? metaList[nowIndex].fileName : '' }}
    </div>
    <slot :item="(metaList && metaList[nowIndex]) || {}" name="extra" />
    <div v-if="showController" class="imgcontroller">
      <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <em
            :class="['el-icon-zoom-out', nowType !== 'image' && 'disabled']"
            @click="onZoomOut"
          />
          <em
            :class="['el-icon-zoom-in', nowType !== 'image' && 'disabled']"
            @click="onZoomIn"
          />

          <em class="el-image-viewer__actions__divider" />
          <em
            :class="[
              'el-icon-c-scale-to-original',
              nowType !== 'image' && 'disabled'
            ]"
            @click="onScaleToOrigin"
          />
          <em class="el-image-viewer__actions__divider" />
          <span> {{ nowIndex + 1 }} / {{ nowUrlList.length || 1 }}</span>
          <em v-if="canDownload" class="el-icon-download" @click="onDownload" />
          <em
            :class="['el-icon-refresh-left', nowType !== 'image' && 'disabled']"
            @click="onRotateLeft"
          />
          <em
            :class="[
              'el-icon-refresh-right',
              nowType !== 'image' && 'disabled'
            ]"
            @click="onRotateRight"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import { b64toBlob } from '../utils/index'
import { downloadByUrl } from '../utils/api'
import FileSaver from 'file-saver'
import ResourcePreviewer from './Viewer.vue'

export default {
  name: 'UploadPreviewer',
  components: {
    [Dialog.name]: Dialog,
    ResourcePreviewer
  },
  props: {
    visible: Boolean,
    url: String,
    index: Number,
    showController: {
      // 是否展示底部控制器
      type: Boolean,
      default: true
    },
    canDownload: {
      type: Boolean,
      default: true
    }, // 是否可以下载，默认不展示下载按钮
    fit: {
      type: String,
      default: 'scale-down'
    },
    urlList: {
      type: Array,
      default: null
    },
    metaList: {
      // 元数据数组，如果预览的项目需要额外数据（比如下载功能），就传入这个数组；和urlList配置项互斥，如果使用metaList则会忽略urlList
      type: Array,
      default: null
    },
    typeChecker: {
      // 文件类型判断函数，这个方法用于外部覆盖逻辑。这个函数应当返回'image' 'video' 'other'三个结果中的一个。如果没传，会使用自带的判断逻辑。
      type: Function,
      default: null
    }
  },
  data() {
    return {
      nowIndex: 0,
      nowUrl: '',
      nowUrlList: [],
      nowType: 'other',
      // 用于自己实现的图片预览时缩放比例功能
      imgRotate: 0, // 旋转角，单位为度数
      imgScale: 1 // 缩放比例
    }
  },
  watch: {
    index: {
      handler(index) {
        this.nowIndex = index ?? 0
        this.nowUrl = this.nowUrlList[this.nowIndex]
        this.resetImgControl()
      },
      immediate: true
    },
    // url: {
    //   handler(v) {
    //     if (v) {
    //       // 如果传入了url，那么就预览当前的这个url
    //       this.nowUrl = v
    //       if (this.nowUrlList.indexOf(v) !== -1) {
    //         this.nowIndex = this.nowUrlList.indexOf(v)
    //       }
    //       this.resetImgControl()
    //     }
    //   },
    //   immediate: true
    // },
    nowUrlList(v) {
      if (!this.index) {
        this.nowUrl = v[0]
        this.nowIndex = 0
      }

      if (this.nowUrl && v?.length > 0 && v.indexOf(this.nowUrl) !== -1) {
        this.nowIndex = this.nowUrlList.indexOf(this.nowUrl)
      }
    },
    metaList(v) {
      if (v) {
        this.nowUrlList = v.map((o) => o.fileUrl || o.resourceUrl)
      }
    },
    urlList(v) {
      if (v && !this.metaList) {
        this.nowUrlList = v
      }
    }
  },
  mounted() {
    this.initUrlList()
    document.addEventListener('keyup', this.keypressCallback)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keypressCallback)
  },
  methods: {
    keypressCallback(e) {
      if (e.key === 'Escape') {
        this.closeImgRepeat()
      }
    },
    initUrlList() {
      if (this.metaList) {
        this.nowUrlList = this.metaList.map((o) => o.fileUrl || o.resourceUrl)
        return
      }

      if (this.urlList) {
        this.nowUrlList = this.urlList
      }
    },
    closeImgRepeat() {
      this.$emit('close')
    },
    isImage(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否图片文件名
      // 这里就只是写几个常用的。
      // 简单剥离：url最后一截字符串认为是文件名。这种方式默认了一定带扩展名，如果没带扩展名的话就不得不去通过其他方式获得了
      const noParamUrl = fileUrl.split('?')[0]
      const fileName = noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]
      return ['bmp', 'svg', 'jpg', 'jpeg', 'png', 'gif'].includes(
        fileName?.split('.')[fileName?.split('.').length - 1]
      )
    },
    isVideo(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否视频文件名
      // 这里就只是写几个常用的。

      // 简单剥离：url最后一截字符串认为是文件名。这种方式默认了一定带扩展名，如果没带扩展名的话就不得不去通过其他方式获得了
      const noParamUrl = fileUrl.split('?')[0]
      const fileName = noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]
      return ['mp4', 'm4v', 'mpeg', 'avi', 'flv'].includes(
        fileName?.split('.')[fileName?.split('.').length - 1]
      )
    },
    isPreviewDoc(fileUrl) {
      if (!fileUrl) {
        return true
      }
      // 判断是否是可以被iframe处理的文件名
      // 这里就只是写几个常用的。

      // 简单剥离：url最后一截字符串认为是文件名。这种方式默认了一定带扩展名，如果没带扩展名的话就不得不去通过其他方式获得了
      const noParamUrl = fileUrl.split('?')[0]
      const fileName = noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]
      return ['txt', 'pdf', 'doc', 'docx'].includes(
        fileName?.split('.')[fileName?.split('.').length - 1]
      )
    },
    jumpUrl(action = 0) {
      let nextIndex = this.nowIndex + action
      if (nextIndex < 0) {
        nextIndex = 0
      }
      if (nextIndex > this.nowUrlList.length - 1) {
        nextIndex = this.nowUrlList.length - 1
      }
      this.nowIndex = nextIndex
      this.nowUrl = this.nowUrlList[this.nowIndex]
      this.resetImgControl()
    },
    // 默认的文件类型判断函数，这个函数应当返回'image' 'video' 'other'三个结果中的一个。
    _TypeChecker(fileInfo) {
      if (this.typeChecker) {
        // 如果外部有覆盖，那就用外部传入的
        return this.typeChecker(fileInfo)
      }
      const { fileUrl, recordType, resourceType } = fileInfo

      // 如果存在recordType, resourceType，使用这个直接判断。这个的话，1图片 2视频 3其他 4 音频
      const dataType = recordType || resourceType
      const mapper = { 1: 'image', 2: 'video', 3: 'other', 4: 'audio' }
      if (dataType) {
        return mapper[dataType] || 'other'
      }

      // 没有的话，通过url尝试判断
      if (this.isImage(fileUrl)) {
        return 'image'
      }

      if (this.isVideo(fileUrl)) {
        return 'video'
      }

      // 都不满足条件输出other，other认为是文档类型之类的东西，不支持判断
      return 'other'
    },
    // 以下是模拟el-imageviewer实现的图片预览操作方法
    resetImgControl() {
      this.imgScale = 1
      this.imgRotate = 0

      // 判断类型
      this.nowType = this._TypeChecker(
        this.metaList?.[this.nowIndex] || { fileUrl: this.nowUrl }
      )
    },
    onScaleToOrigin() {
      this.imgScale = 1
    },
    onZoomIn() {
      if (this.nowType !== 'image') {
        return
      }
      // 放大。每次放大是增加0.2 最大 1
      this.imgScale += 0.2
    },
    onZoomOut() {
      if (this.nowType !== 'image') {
        return
      }
      // 缩小。每次缩小是减少0.2  最小0.2
      if (this.imgScale > 0.2) this.imgScale -= 0.2
    },
    onRotateLeft() {
      if (this.nowType !== 'image') {
        return
      }
      this.imgRotate -= 90
    },
    onRotateRight() {
      if (this.nowType !== 'image') {
        return
      }
      this.imgRotate += 90
    },
    onOpen() {
      window.open(this.nowUrl)
    },
    onDownload() {
      const fileMeta = this.metaList?.[this.nowIndex]
      // 数据里没有fileName，自己进行简单剥离：url最后一截字符串认为是文件名。
      const noParamUrl = this.nowUrl.split('?')[0]
      const urlfileName =
        noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]
      let suffix = fileMeta?.fileName?.split('.')?.[1]
      // 这里很奇怪，item可能有文件名，但扩展名不一定有；如果没有扩展名，用url解析里补上
      let finalFileName = fileMeta?.fileName || urlfileName
      if (!suffix && fileMeta?.fileName) {
        // 如果提供的fileName有文件名，但是没有扩展名，直接使用url的文件名的扩展名
        suffix = urlfileName?.split('.')[urlfileName?.split('.').length - 1]
        finalFileName = `${fileMeta?.fileName}.${suffix}`
      }
      downloadByUrl(this.nowUrl).then((res) => {
        FileSaver.saveAs(b64toBlob(res.data), finalFileName || '文件')
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/alarmDetail/style-resource-viewer';

.closeViewBtn {
  position: fixed;
  top: px-to-rem(24);
  right: px-to-rem(24);
  z-index: 2;
  width: px-to-rem(24);
  height: px-to-rem(24);

  // background: url('../../../assets/images/close.png') no-repeat center / 100%
  //   100%;
  text-align: center;
  cursor: pointer;
}
</style>
