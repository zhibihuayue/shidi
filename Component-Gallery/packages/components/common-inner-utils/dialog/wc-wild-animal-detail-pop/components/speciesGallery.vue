<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <div>
    <styled-l-y-dialog
      :visible="visible"
      title="物种图集"
      highlightTitle
      append-to-body
      @close="onClose"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="top">
        <div class="title">
          <el-tooltip
            :content="cameraDetail.cameraName"
            popper-class="iwhale-speciesLYstyle"
          >
            <span class="txt">{{ cameraDetail.cameraName }}</span>
          </el-tooltip>
          <div
            :class="[
              'tag',
              !cameraDetail.deploymentSituation && 'hidden',
              cameraDetail.deploymentSituation === '0' && 'active'
            ]"
            >{{ cameraDetail.deploymentSituationName }}</div
          >
        </div>
        <div class="imageCount">
          <img class="bigicon" src="../assets/speciesTotalIcon-1.png" />
          <div class="category">图片</div>
          <div class="number">
            {{ cameraStatistics.imgTotalNum }}
          </div>
        </div>
        <img class="divider" src="../assets/gallery-vdivider.png" />
        <div class="videoCount">
          <img class="bigicon" src="../assets/speciesTotalIcon-2.png" />
          <div class="category">视频</div>
          <div class="number">{{ cameraStatistics.videoTotalNum }}</div>
        </div>
        <img class="divider" src="../assets/gallery-vdivider.png" />
        <div class="speciesCount">
          <img class="bigicon" src="../assets/speciesTotalIcon-3.png" />
          <div class="category">物种数量</div>
          <div class="number">{{ cameraStatistics.speciesTotalNum }}</div>
        </div>
      </div>
      <div class="search">
        <el-form :inline="true" :model="formInline" class="form-inline">
          <el-form-item label="物种名称">
            <el-input
              v-model="formInline.speciesName"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="上传时间">
            <el-date-picker
              v-model="formInline.uploadDate"
              prefix-icon="iconfont_tools icon-tongyong-shaixuanriqi"
              popper-class="common-iw-s datepicker"
              type="daterange"
              :editable="false"
              :clearable="false"
              :picker-options="datepickerOption"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="文件类型">
            <el-select
              v-model="formInline.fileType"
              clearable
              placeholder="请选择"
              popper-class="common-iw-s"
              :popper-append-to-body="false"
            >
              <el-option label="图片" value="0" />
              <el-option label="视频" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item class="submitarea">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-loading="loading" class="table-body">
        <div class="grid">
          <div v-for="(item, ind) in pageData.list" :key="ind" class="card">
            <div class="cardinner" @click="onPreview(item, ind)">
              <video
                v-if="item.fileType === '1'"
                :src="item.fileUrl"
                muted
                preload="metadata"
              />
              <img v-else :src="item.fileUrl" alt="图片" />
              <div class="footerlabel">{{ item.protectionLevelName }}</div>
            </div>
            <el-tooltip
              popper-class="name iwhale-speciesLYstyle"
              :content="item.speciesName"
            >
              <div class="name">{{ item.speciesName }}</div>
            </el-tooltip>
            <div class="sub">{{ item.uploadTime }}</div>
          </div>
        </div>
        <div v-if="pageData.list.length === 0" class="nodata">
          <i class="c-no-datas">暂无数据</i>
        </div>
        <div class="page-tool common-iw-s">
          <div class="page-number"
            >第{{ pageData.pageNum }}页/共{{ pageData.total }}条</div
          >
          <el-pagination
            :page-size="pageData.pageSize"
            :current-page="pageData.pageNum"
            layout="prev, pager, next"
            small
            :total="pageData.total"
            class="pagination-style"
            background
            @current-change="onCurrentPage"
          />
        </div>
      </div>
    </styled-l-y-dialog>
    <image-viewer
      :urlList="fileList"
      :initialIndex.sync="previewFileIndex"
      v-if="previewVisible"
      isShowWaterSeal
      :onClose="handlePreOnClose"
    >
      <template>
        <div class="water-mark">
          <span>{{ fileList[previewFileIndex]?.protectionLevelName }}</span>
          <span>{{ fileList[previewFileIndex]?.uploadTime }}</span>
          <span>{{ fileList[previewFileIndex]?.speciesName }}</span>
          <span>{{ fileList[previewFileIndex]?.creator }}</span>
        </div>
      </template>
    </image-viewer>
  </div>
</template>

<script>
import moment from 'moment'
import ImageViewer from '../../image-video-preview/Index.vue'
import styledLYDialog from './styledLYDialog.vue'
import {
  getUserMemoryInfo,
  uptUserMemoryInfo,
  getCameraDetail,
  querySpeciesAtlasPage,
  queryCameraStatistics
} from '../service/index'
let pickerMinDate = ''
export default {
  name: 'SpeciesGallery',
  components: { styledLYDialog, ImageViewer },
  props: {
    cameraCode: {
      type: String,
      default: ''
    },
    datetimeKey: {
      type: String,
      default: 'speciesGalleryDateRangeTy'
    },
    visible: Boolean
  },
  data() {
    const datepickerOption = {
      shortcuts: [
        {
          text: '今日',
          onClick(picker) {
            picker.$emit('pick', [
              moment().startOf('day'),
              moment().endOf('day')
            ])
          }
        },
        {
          text: '近3天',
          onClick(picker) {
            picker.$emit('pick', [
              moment().subtract(2, 'days').startOf('day'),
              moment().endOf('day')
            ])
          }
        },
        {
          text: '近7天',
          onClick(picker) {
            picker.$emit('pick', [
              moment().subtract(6, 'days').startOf('day'),
              moment().endOf('day')
            ])
          }
        },
        {
          text: '近30天',
          onClick(picker) {
            picker.$emit('pick', [
              moment().subtract(29, 'days').startOf('day'),
              moment().endOf('day')
            ])
          }
        }
      ],
      disabledDate: (nowDate) => {
        if (nowDate > new Date()) {
          // 不允许选择未来时间
          return true
        }
        if (pickerMinDate) {
          // 超过区间的时间也不能，可选择日期范围为6个自然月
          const momentA = moment(pickerMinDate).startOf('day')
          const momentB = moment(nowDate).startOf('day')

          // 判断差距是否大于6个自然月
          return Math.abs(momentB.diff(momentA, 'months', true)) > 6
        }
        return false
      },
      onPick: ({ maxDate, minDate }) => {
        if (minDate && pickerMinDate) {
          pickerMinDate = null
        } else if (minDate) {
          pickerMinDate = minDate.getTime()
        }else {
          console.log('minDate不存在')
        }
      },
      timeReset: false
    }
    return {
      datepickerOption,
      formInline: {
        speciesName: '',
        uploadDate: [moment().subtract(1, 'months'), moment()],
        fileType: ''
      },
      cameraDetail: {
        cameraName: '',
        deploymentSituation: '',
        deploymentSituationName: ''
      },
      loading: false,
      cameraStatistics: {
        imgTotalNum: 0,
        speciesTotalNum: 0,
        videoTotalNum: 0
      },
      pageData: { pageNum: 1, pageSize: 12, total: 0, list: [] },
      previewVisible: false,
      fileList: [],
      nowFile: {},
      previewFileIndex: 0
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.queryCameraStatistics()
        this.queryCameraData()

        this.pageData.pageNum = 1
        this.queryCameraPage()
      }
    }
  },
  methods: {
    queryCameraStatistics() {
      const params = {
        cameraCode: this.cameraCode
      }
      queryCameraStatistics(params).then((resp) => {
        if (resp.data) {
          this.cameraStatistics = resp.data
        }
      })
    },
    queryCameraData() {
      const params = {
        cameraCode: this.cameraCode
      }
      getCameraDetail(params).then((resp) => {
        if (resp.data) {
          this.cameraDetail = resp.data
        }
      })
    },
    queryCameraPage() {
      const params = {
        cameraCode: this.cameraCode,
        speciesName: this.formInline.speciesName,
        fileType: this.formInline.fileType,
        pageNum: this.pageData.pageNum,
        createBeginTime: this.formInline.uploadDate?.[0]
          ? moment(this.formInline.uploadDate[0])
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
        createEndTime: this.formInline.uploadDate?.[1]
          ? moment(this.formInline.uploadDate[1])
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
        pageSize: 8
      }
      this.loading = true
      querySpeciesAtlasPage(params)
        .then((resp) => {
          if (resp.data) {
            this.fileList = resp.data.list.map((item) => {
              return {
                ...item,
                type: item.fileType === '0' ? '1' : '2'
              }
            })
            resp.data.list.forEach((o) => {
              o.url = o.fileUrl
            })
            this.pageData = resp.data
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    onCurrentPage(page) {
      this.pageData.pageNum = page
      this.queryCameraPage()
    },
    onSubmit() {
      this.pageData.pageNum = 1
      this.queryCameraPage()
    },
    onReset() {
      this.formInline = {
        speciesName: '',
        uploadDate: [moment().subtract(1, 'months'), moment()],
        fileType: ''
      }
      this.pageData.pageNum = 1
      this.queryCameraPage()
    },
    onPreview(item, index) {
      this.previewVisible = true
      this.previewFileIndex = index
      this.nowFile = item
    },
    handlePreOnClose() {
      this.previewVisible = false
    },
    onClose() {
      this.$emit('tabClose')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.top {
  display: flex;
  align-items: center;
  padding: 0 px-to-rem(12);
  margin-bottom: px-to-rem(8);

  .divider {
    margin: 0 px-to-rem(24);
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: px-to-rem(3) 0 px-to-rem(3) px-to-rem(10);
    width: px-to-rem(372);
    height: px-to-rem(30);
    background-position: 0%;
    background-repeat: no-repeat;
    background-size: px-to-rem(352) px-to-rem(36);
    background-image: url('~../assets/gallerytitlebg.png');
    border-left: px-to-rem(2) solid rgb(78 255 160 / 50%);

    .txt {
      display: inline-block;
      overflow: hidden;
      margin-right: px-to-rem(11);
      text-shadow: 0 0 px-to-rem(10) rgb(0 245 193 / 70%);
      color: #fff;
      font-size: px-to-rem(18);
      font-family: PingFangSC, 'PingFang SC';
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      word-break: keep-all;
      font-weight: 500;
      line-height: px-to-rem(18);
    }

    .tag {
      padding: px-to-rem(4) px-to-rem(8);
      margin-right: px-to-rem(24);
      background: #5f5c5c;
      border-radius: px-to-rem(4);
      color: #fff;
      font-size: px-to-rem(12);
      font-family: PingFangSC, 'PingFang SC';
      font-weight: 500;
      line-height: px-to-rem(12);

      &.hidden {
        opacity: 0;
      }

      &.active {
        background: linear-gradient(90deg, #15bd94 0%, #00a179 100%);
      }
    }
  }

  .bigicon {
    position: absolute;
    top: px-to-rem(14);
    left: px-to-rem(24);
    width: px-to-rem(80);
    height: px-to-rem(53);
  }

  .number {
    position: absolute;
    bottom: px-to-rem(17);
    left: px-to-rem(120);
    color: #fff;
    font-size: px-to-rem(20);
    font-family: PingFangSC, 'PingFang SC';
    font-weight: 600;
    line-height: px-to-rem(20);
  }

  .category {
    position: absolute;
    top: px-to-rem(17);
    left: px-to-rem(120);
    color: rgb(255 255 255 / 70%);
    font-size: px-to-rem(14);
    font-family: PingFangSC, 'PingFang SC';
    font-weight: 400;
    line-height: px-to-rem(14);
  }

  .imageCount {
    position: relative;
    width: px-to-rem(200);
    height: px-to-rem(74);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('~../assets/speciesTotal-1.png');

    .number {
      text-shadow: 0 0 10px rgb(0 245 193 / 50%);
    }
  }

  .videoCount {
    position: relative;
    width: px-to-rem(200);
    height: px-to-rem(74);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('~../assets/speciesTotal-2.png');

    .number {
      text-shadow: 0 0 px-to-rem(10) rgb(0 245 193 / 50%);
    }
  }

  .speciesCount {
    position: relative;
    width: px-to-rem(200);
    height: px-to-rem(74);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('~../assets/speciesTotal-3.png');

    .number {
      text-shadow: 0 0 px-to-rem(10) rgb(0 245 193 / 50%);
    }
  }
}

.search {
  padding: 0 px-to-rem(12);

  ::v-deep .el-form {
    display: flex;

    .el-form-item {
      margin-right: px-to-rem(14);
      margin-bottom: px-to-rem(12);

      .el-form-item__content {
        min-width: auto;
        line-height: unset;

        .el-input {
          line-height: px-to-rem(32);
          .el-input__inner {
            padding: 0 px-to-rem(12);
            width: px-to-rem(175);
            height: px-to-rem(32);
            background: rgb(2 137 109 / 20%);
            border-color: transparent;
            color: #fff;
            font-size: px-to-rem(14);
            line-height: px-to-rem(32);

            &::placeholder {
              color: #fff;
            }
          }
        }

        .el-range-editor.el-input__inner {
          align-items: center;
          width: px-to-rem(250);
          height: px-to-rem(32);
          background: rgb(2 137 109 / 20%);
          border-color: transparent;
          line-height: px-to-rem(32);

          .el-range-input {
            background: transparent;
          }
        }

        .el-input__icon {
          line-height: unset;
        }
      }
    }
  }

  ::v-deep .el-date-editor {
    .el-range-input {
      color: #fff;
      text-align: left;
    }

    .iconfont_tools.icon-tongyong-shaixuanriqi {
      margin-right: px-to-rem(12);
      line-height: px-to-rem(26) !important;
      font-size: px-to-rem(20);
    }

    .el-range-separator {
      margin-right: px-to-rem(12);
      margin-left: px-to-rem(6);
      width: 8%;
      color: #fff;
      font-size: px-to-rem(14);
      line-height: px-to-rem(26);
    }

    // 注意，这个地方是因为这里的日期选择器不需要关闭按钮，但element组件会预留占位，所以需要自己直接去掉它的显示
    .el-range__close-icon {
      display: none;
    }
  }

  ::v-deep .el-select-dropdown {
    min-width: 100% !important;
  }

  .submitarea.el-form-item {
    margin-right: 0;
    flex: 1;

    ::v-deep .el-form-item__content {
      display: flex;
      justify-content: space-between;
      width: 100%;

      &::before,
      &::after {
        content: none;
      }
    }

    .el-button {
      width: px-to-rem(104);

      + .el-button {
        margin-left: 0;
      }
    }
  }

  // 按钮覆写
  .el-button {
    padding: 0;
    height: px-to-rem(32);
    border-color: transparent;
    border-radius: 0;
    font-size: px-to-rem(14);
    box-sizing: border-box;
    font-weight: 400;

    &.el-button--text.el-picker-panel__link-btn {
      color: #fff;
    }

    &.el-button--default {
      position: relative;
      padding: px-to-rem(5) px-to-rem(15);
      background: rgb(2 137 109 / 10%);
      border: px-to-rem(2) solid transparent;
      box-shadow: inset 0 0 3px 0 rgb(2 137 109 / 60%);
      color: #fff;

      &::before {
        content: '';
        position: absolute;
        inset: px-to-rem(-2) px-to-rem(-2) px-to-rem(-2) px-to-rem(-2);
        border: px-to-rem(1) dotted rgb(2 137 109 / 50%);
      }
    }

    &.el-button--primary {
      position: relative;
      background: none;
      border: px-to-rem(1) dotted rgb(2 137 109 / 50%);
      color: #fff;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border: px-to-rem(4) solid transparent;
        border-image-source: url('~../assets/btn_primarybg.png');
        border-image-slice: 9 fill;
      }
    }

    &.el-button--danger {
      background: rgb(237 83 90 / 20%);
      color: #fff;
    }

    &:hover {
      opacity: 0.6;
    }

    &:active {
      opacity: 0.8;
    }

    &.is-disabled {
      opacity: 0.4;
    }
  }
}

.table-body {
  .grid {
    display: grid;
    overflow: auto;
    padding: 0 px-to-rem(12);
    max-height: px-to-rem(408);
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: px-to-rem(7) px-to-rem(12);

    .card {
      background: rgb(2 137 109 / 5%);
      border: px-to-rem(1) solid rgb(2 136 109 / 50%);
      border-radius: px-to-rem(8);
      grid-column: span 1;

      .cardinner {
        position: relative;
        height: px-to-rem(145);

        img {
          width: 100%;
          height: px-to-rem(145);
          border-radius: px-to-rem(8) px-to-rem(8) 0 0;
          object-fit: fill;
        }

        video {
          width: 100%;
          height: px-to-rem(145);
          border-radius: px-to-rem(8) px-to-rem(8) 0 0;
          object-fit: scale-down;
        }

        .footerlabel {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 0 px-to-rem(6);
          height: px-to-rem(18);
          background: rgb(5 15 23 / 70%);
          border-radius: 0 px-to-rem(4) 0 px-to-rem(4);
          color: #fff;
          font-size: px-to-rem(12);
          font-family: PingFangSC, 'PingFang SC';
          font-weight: 400;
          line-height: px-to-rem(18);
        }
      }

      .name {
        overflow: hidden;
        padding: 0 px-to-rem(12);
        margin: px-to-rem(6) 0;
        max-width: 18em;
        text-shadow: 0 0 px-to-rem(3) rgb(0 245 193 / 70%);
        color: #fff;
        font-size: px-to-rem(14);
        font-family: PingFangSC, 'PingFang SC';
        text-overflow: ellipsis;
        font-weight: 500;
        line-height: px-to-rem(14);
        word-break: keep-all;
      }

      .sub {
        overflow: hidden;
        padding: 0 px-to-rem(12);
        margin-bottom: px-to-rem(12);
        color: rgb(255 255 255 / 70%);
        font-size: px-to-rem(12);
        font-family: PingFangSC, 'PingFang SC';
        text-overflow: ellipsis;
        font-weight: 400;
        line-height: px-to-rem(12);
        word-break: keep-all;
      }
    }
  }

  .page-tool {
    display: flex;
    justify-content: right;
    align-items: center;
    padding-right: px-to-rem(12);
    margin-top: px-to-rem(12);

    .pagination-style {
      z-index: 1;
      margin: 0;
    }

    .page-number {
      color: #fff;
    }
  }
}

.nodata {
  position: relative;
  min-height: px-to-rem(200);
}

.c-no-datas {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  padding-bottom: px-to-rem(8);
  color: #fff;
  font-size: px-to-rem(14);
  text-align: center;
  transform: translate(-50%, -50%);
  font-style: normal;
  font-weight: normal;

  &::before {
    content: url('~../assets/noData-ly.png');
    display: block;
    margin-bottom: px-to-rem(10);
  }
}

.totalrow {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: px-to-rem(12) px-to-rem(24);
  width: 100%;

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

    .line {
      text-align: right;
    }
  }
}

::v-deep .water-seal,
::v-deep .water-slot-default {
  width: 100%;
}

.water-mark {
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  span {
    width: 50%;
    line-height: px-to-rem(32);
    color: #fff;
    font-size: px-to-rem(14);
    font-family: PingFangSC, 'PingFang SC';

    &:nth-child(2n) {
      text-align: right;
    }
  }
}
</style>
