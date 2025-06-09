<template>
  <div :class="[bem.root, 'common-iw-s']" oncontextmenu="return false">
    <div class="files">
      <div class="file" v-for="(item, index) in files" :key="item.uid">
        <ul v-if="item.fileUrl" class="el-upload-list el-upload-list--picture-card">
          <li class="el-upload-list__item is-ready">
            <!-- 图片 -->
            <img v-if="item.recordType === 1" :src="item.fileUrl" alt="" class="el-upload-list__item-thumbnail" />
            <!-- 视频 -->
            <video
              id="video"
              v-else-if="item.recordType === 2"
              preload="metadata"
              class="el-upload-list__item-thumbnail"
            >
              <source :src="item.fileUrl" />
              <track label="Chinese" kind="captions" srclang="ch" />
            </video>
            <!-- mp3 -->
            <div v-else-if="item.recordType === 4" class="audio">
              <div class="image-audio"></div>
              <div class="label">音频文件</div>
            </div>
            <!-- 其他 -->
            <div v-else class="upAnnexIcon" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview">
                <em class="iconfont_tools icon-icon_fangda_20_n" @click="onPreviewShow(item, index)" />
              </span>
              <span v-if="readonly" class="el-upload-list__item-preview">
                <ct-icon name="card-download" class="download-icon" @click="onDownload(item)"></ct-icon>
              </span>
              <span v-if="!readonly" class="el-upload-list__item-delete">
                <em class="iconfont_tools icon-tongyong_icon_shipinguanliliebiaoshanchu" @click="onRemove(index)" />
              </span>
            </span>
          </li>
        </ul>
        <!-- 进度条 -->
        <div v-else class="uploadSpeed">
          <div class="speed">
            <em :style="`width: ${item.speed}%;`" />
          </div>
        </div>
      </div>
      <div v-if="!readonly" :class="[bem.uploadContainer]" v-show="files.length < limit">
        <el-upload
          :class="[bem.upload]"
          ref="upload"
          name="attach"
          list-type="picture-card"
          action="file/base/common/upload"
          :http-request="uploadAction"
          :accept="fileType"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <slot name="upload-icon"><em class="iconfont_tools icon-tongyong_icon_shangchuan uploadicon" /></slot>
        </el-upload>
      </div>
    </div>
    <upload-previewer
      :visible="previewShow"
      :url="previewUrl"
      :index="previewIndex"
      :meta-list="files"
      @close="onPreviewClose"
    />
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import UploadPreviewer from './previewer/Previewer.vue'
import { downloadByUrl, upload } from './utils/api'
import FileSaver from 'file-saver'
import { b64toBlob } from './utils'
import { uuid } from '@component-gallery/utils/funCommon/common'

const bem = createNameSpace('common-base-upload')
export default {
  name: 'BaseUpload',
  components: { UploadPreviewer },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 文件类型
    fileType: {
      type: String,
      default: 'video/mp4,image/png,image/jpg,image/jpeg,.mp3,.wav,.txt,.doc,.docx,.pdf,.ppt,.pptx'
    },
    // 文件类型 文言提示
    fileTypeMessage: {
      type: String,
      default: ''
    },
    fileTypeMessageAll: {
      type: String,
      default: ''
    },
    // 文件个数限制
    limit: {
      type: Number,
      default: 9
    },
    // 文件大小限制(M)
    limitSize: {
      type: Number,
      default: 10
    },
    // 只读
    readonly: {
      type: Boolean,
      default: false
    },
    imgWAndH: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      files: [],
      previewShow: false,
      previewUrl: '',
      previewIndex: null
    }
  },
  computed: {
    bem() {
      return {
        root: bem.b(''),
        uploadContainer: bem.e('upload-container'),
        upload: bem.e('upload')
      }
    }
  },
  mounted() {
    if (this.value) {
      this.files = this.format(this.value)
    }
  },
  watch: {
    value: {
      handler(val, old) {
        this.files = this.format(this.value)
      },
      deep: true
    }
  },
  methods: {
    format(list) {
      return list.map((item) => {
        return {
          ...item,
          uid: item.uid || uuid(),
          recordType: this.getFileType(item.fileName),
          speed: item.speed || 100
        }
      })
    },
    // 上传之前，验证文件
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024

      if (isLt2M > this.limitSize) {
        const fileType = this.getFileType(file.name)
        switch (fileType) {
          case 1:
            CommonMessage.warning(`上传图片不能大于${this.limitSize}M`)
            break
          case 2:
            CommonMessage.warning(`上传视频不能大于${this.limitSize}M`)
            break
          case 4:
            CommonMessage.warning(`上传音频不能大于${this.limitSize}M`)
            break
          case 3:
          default:
            CommonMessage.warning(`上传文件不能大于${this.limitSize}M`)
            break
        }

        return false
      }

      if (!this.checkFileType(file.name)) {
        if (this.fileTypeMessageAll) {
          CommonMessage.warning(this.fileTypeMessageAll)
        } else {
          CommonMessage.warning(`只支持上传${this.fileTypeMessage || this.fileType}格式！`)
        }
        return false
      }
      if (this.imgWAndH.length) {
        return this.checkImgWAndH(file)
      }
      return true
    },
    uploadAction(e) {
      if (this.files.length >= this.limit) {
        CommonMessage.error(`附件最多只能上传${this.limit}个`)
        return
      }
      this.uploadFile(e.file)
    },
    // 上传请求
    uploadFile(file) {
      this.$emit('changeLoading', true)
      const formData = new FormData()
      formData.append('file', file)
      const fileData = {
        fileName: '',
        fileId: '',
        originUrl: '',
        fileUrl: '',
        fileSuffix: '',
        recordType: this.getFileType(file.name),
        uid: file.uid,
        speed: 0
      }
      this.files.push(fileData)
      this.$emit('input', this.files)

      upload(formData, this.onUploadProgress.bind(this, fileData.uid))
        .then((result) => {
          if (result.code === 200) {
            let item = this.files.find((t) => t.uid === fileData.uid)
            item.fileName = result.data.fileName
            item.fileUrl = result.data.fileUrl
            item.fileId = result.data.fileId
            item.originUrl = result.data.originUrl
            item.fileSuffix = result.data.fileSuffix
            item.fileSize = result.data.fileSize
            item.speed = 100
            this.files = [...this.files]
            CommonMessage.success(result.msg)
          } else {
            CommonMessage.auto(result)
            this.$refs.upload.$data.uploadFiles.pop()
          }
          this.$refs?.upload.clearFiles()

          this.$emit('input', this.files)
        })
        .catch((e) => {
          CommonMessage.error(e?.msg || '上传失败')
          this.$refs?.upload.clearFiles()
          this.$refs.upload.$data.uploadFiles.pop()
          this.files = this.files.filter((t) => t.uid !== fileData.uid)
        })
    },
    checkImgWAndH(file) {
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(img.src)
          if (img.width === this.imgWAndH[0] && img.height === this.imgWAndH[1]) {
            resolve(true);
          } else {
            CommonMessage.warning(`支持上传svg格式图标，大小：${this.imgWAndH[0]}px*${this.imgWAndH[1]}px。`)
            reject(false);
          }
        };
        img.onerror = () => {
          CommonMessage.warning('图片加载失败')
          reject(false);
        };
        img.src = _URL.createObjectURL(file) // 创建一个临时的URL用于加载图片
      });
    },
    checkFileType(fileName) {
      if (Object.prototype.toString.call(fileName) === '[object String]') {
        let tempStr = fileName.split(/\.(?=[^\.]+$)/)
        let transferName = tempStr[tempStr.length - 1].toLowerCase()
        return this.fileType.toLowerCase().includes(transferName)
      }
    },
    // 检查附件类型
    getFileType(fileName) {
      if (Object.prototype.toString.call(fileName) === '[object String]') {
        let tempStr = fileName.split(/\.(?=[^\.]+$)/)
        let transferName = tempStr[tempStr.length - 1].toLowerCase()
        if (/(png|jpg|jpeg|svg)/g.test(transferName)) {
          return 1
        } else if (/mp4/g.test(transferName)) {
          return 2
        } else if (/(txt|doc|docx|pdf|ppt|pptx)/g.test(transferName)) {
          return 3
        } else if (/(mp3|wav)/g.test(transferName)) {
          return 4
        } else {
          return -1
        }
      }
    },
    // 设置附件上传进度
    onUploadProgress(id, e) {
      const item = this.files.find((t) => t.uid === id)
      item.speed = ((e.loaded / e.total) * 100) | 0 // 百分比
    },
    // 打开预览
    onPreviewShow(item, index) {
      this.previewUrl = item.fileUrl
      this.previewIndex = index
      this.previewShow = true
    },
    // 关闭预览
    onPreviewClose() {
      this.previewShow = false
      this.previewIndex = null
      this.previewUrl = ''
    },
    onRemove(index) {
      this.files.splice(index, 1)
      this.$emit('input', this.files)
    },
    onDownload(item) {
      const url = item.fileUrl
      const fileName = item.fileName
      const noParamUrl = item.fileUrl.split('?')[0]
      let urlfileName = noParamUrl?.split('/')[noParamUrl?.split('/').length - 1]

      let finalFileName = fileName || urlfileName

      // 数据里没有fileName，自己进行简单剥离：url最后一截字符串认为是文件名。
      let suffix = fileName?.split('.')?.[1]
      // 这里很奇怪，item可能有文件名，但扩展名不一定有；如果没有扩展名，用url解析里补上
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

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.common-base-upload {
  @include themeify(false) {
    --base-upload__size: #{px-to-rem(70)};

    @if $theme-name == 'theme-wiseblue' {
      --base-upload__border-color: rgba(232, 243, 254, 0.6);
      --base-upload__background-audio: url('./assets/audio.png');
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --base-upload__border-color: rgba(255, 255, 255, 0.6);
      --base-upload__background-audio: url('./assets/audio-ly.png');
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --base-upload__border-color: #e4e7c1;
      --base-upload__background-audio: url('./assets/audio-gt.png');
    }

    .files {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: px-to-rem(6);

      .file {
        position: relative;
        overflow: hidden;
        width: var(--base-upload__size);
        height: var(--base-upload__size);

        // border: px-to-rem(1) solid #fff;
        border-radius: px-to-rem(4);

        .uploadSpeed {
          position: absolute;
          background-color: themed('alarm-detail-input-background');
          inset: 0;
          border: px-to-rem(1) dotted var(--base-upload__border-color);
          border-radius: px-to-rem(4);

          .speed {
            position: absolute;
            top: px-to-rem(34);
            left: px-to-rem(16);
            overflow: hidden;
            width: px-to-rem(40);
            height: px-to-rem(2);
            background-color: themed('alarm-detail-input-background');
            border-radius: px-to-rem(1);
          }

          i {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            background: var(--iw-theme-color);
          }
        }

        .audio {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: px-to-rem(6);
          background: themed('alarm-detail-input-background');

          .image-audio {
            width: px-to-rem(30);
            height: px-to-rem(30);
            background: var(--base-upload__background-audio);
            background-size: 100% 100%;

            @if $theme-name == 'theme-terracotta' {
              background-size: px-to-rem(26);
              background-position: center;
              background-repeat: no-repeat;
            }
          }

          .label {
            color: var(--iw-text-color);
            font-size: px-to-rem(12);
          }
        }

        .upAnnexIcon {
          width: 100%;
          height: 100%;
          background: themed('alarm-detail-file-img') no-repeat center/px-to-rem(40) px-to-rem(40)
            themed('alarm-detail-input-background');
        }

        ::v-deep {
          .el-upload-list {
            display: inline-flex;
          }

          .el-upload-list--picture-card .el-upload-list__item {
            width: px-to-rem(70);
            height: px-to-rem(70);
            background-color: unset;
            border: none;
            margin: 0;
          }

          .el-upload-list__item-actions {
            display: flex;
            justify-content: center;
            align-items: center;

            & > span {
              width: px-to-rem(24);
              height: px-to-rem(24);
              line-height: px-to-rem(24);
              background-color: rgb(0 0 0 / 70%);
              border-radius: px-to-rem(4);
              font-size: 0;

              i {
                font-size: px-to-rem(16);
                color: themed('alarm-detail-compare-arrow-color');
              }

              + span {
                margin-left: px-to-rem(6);
              }
            }

            .download-icon .ct-icon {
              width: px-to-rem(16) !important;

              .icon {
                font-size: px-to-rem(15) !important;
                color: var(--iw-text-color) !important;
              }
            }
          }

          .el-upload-list__item-thumbnail {
            object-fit: cover;
          }
        }
      }
    }

    &__upload {
      position: relative;
      width: var(--base-upload__size);
      height: var(--base-upload__size);
      border: px-to-rem(1) dotted var(--base-upload__border-color);
      border-radius: px-to-rem(4);

      &:hover {
        border-color: themed('alarm-detail-date-picker-color-60');

        .uploadicon {
          color: themed('alarm-detail-date-picker-color-60');
        }
      }

      ::v-deep .el-upload--picture-card {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--base-upload__width);
        height: var(--base-upload__height);
        background-color: themed('alarm-detail-input-background');
        border: none !important; // 强制覆盖element/upload.scss边框样式
        border-radius: px-to-rem(4);
        inset: 0;
      }

      .uploadicon {
        height: 100%;
        color: themed('alarm-detail-compare-arrow-color');
        font-size: px-to-rem(20);
        line-height: var(--base-upload__size);
      }
    }

    .isHideUpBotton {
      ::v-deep .el-upload--picture-card {
        display: none;
      }

      ::v-deep .el-tabs__nav-wrap.is-scrollable {
        padding: 0 px-to-rem(30);
      }

      ::v-deep .el-tabs__header {
        margin: 0;
      }
    }
  }
}
</style>
