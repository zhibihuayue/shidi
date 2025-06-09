<!-- 图片上传组件 -->
<template>
  <div class="upLoad-box">
    <el-upload
      :class="fileList.length < 5 ? '' : 'upload-img-btn'"
      action
      :http-request="(arg) => fileUpload(arg)"
      list-type="picture-card"
      :file-list="fileList"
      :auto-upload="true"
      :file-size-limit="2 * 1024 * 1024"
      :limit="5"
      accept=".png,.jpg,.jpeg,.gif"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
    >
      <i slot="default" class="el-icon-plus"></i>

      <div slot="file" slot-scope="{ file }" class="pic-box">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span v-if="loading" class="el-upload-list__item-actions">
          <i class="el-icon-loading"></i>
        </span>
        <span v-else class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog top="7vh" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { iframeSDK } from "@ct/iframe-connect-sdk";
export default {
  name: "add-img-list",
  props: {
    fileListArray: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      actionApi: "forest-wetland/wetland-info/uploadPicture",
      fileList: [],
      loading: false,
    };
  },

  watch: {
    fileListArray: {
      handler(newValue, oldValue) {
        if (newValue.length !== (oldValue && oldValue.length)) {
          this.fileList = newValue.map((item) => {
            return {
              name: "image",
              url: item,
            };
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleExceed(files) {
      // 当文件数量超过限制时触发
      iframeSDK({
        iframeOperationId: "message",
        message: `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，多出的文件将不会被添加。`,
      });
    },
    /**
     * 检测文件大小
     */
    beforeUpload(file) {
      this.loading = true;
      console.log(this.loading, "this.loading==");
      const isImageFormat = /\.(png|jpe?g|gif)$/.test(file.name.toLowerCase());
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isImageFormat) {
        iframeSDK({
          iframeOperationId: "message",
          message: "上传文件只能是 PNG/JPG/JPEG/GIF 格式!",
        });
      }
      if (!isLt10M) {
        iframeSDK({
          iframeOperationId: "message",
          message: "上传文件大小不能超过 10MB!",
        });
      }
      return isImageFormat && isLt10M;
    },
    /**
     * 删除图片
     */
    handleRemove(file) {
      const imgIndex = this.fileList.findIndex((item) => item.url == file.url);
      if (imgIndex !== false) {
        this.fileList.splice(imgIndex, 1);
      }

      this.$emit("fileList", this.fileList);
    },
    /**
     * 图片预览
     */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //自定义上传的实现
    fileUpload(file) {
      const reader = new FileReader();
      const fileType = file.file.type.split("/")[1];
      // reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        // const base64String = reader.result
        window
          .requestSDK(
            this.actionApi,
            { file: base64String, fileType: fileType },
            {},
            "post"
          )
          .then((res) => {
            if (res.code === 200) {
              let objFile = {
                name: file.name,
                url: res.data,
                uid: file.file.uid,
              };
              this.fileList.push(objFile);
              this.$emit("fileList", this.fileList);
            } else {
              iframeSDK({
                iframeOperationId: "message",
                message: res.msg,
              });
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
            iframeSDK({
              iframeOperationId: "message",
              message: "上传失败，请重试",
            });
          });
      };

      reader.readAsDataURL(file.file);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.upLoad-box {
  width: 100%;
  height: 100%;
  .pic-box {
  }
}

::v-deep .el-upload--picture-card {
  width: px-to-rem(121);
  height: px-to-rem(121);
  line-height: px-to-rem(130);
}
::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: px-to-rem(121);
    height: px-to-rem(121);
    line-height: px-to-rem(130);
    .pic-box {
      img {
        width: 100%;
        height: px-to-rem(121);
      }
    }
  }
}
::v-deep .upload-img-btn {
  .el-upload {
    display: none;
  }
}
::v-deep .el-upload-list__item-thumbnail {
  width: 79px;
  height: 78px;
}
::v-deep .el-dialog__headerbtn {
  top: 10px;
}
</style>
