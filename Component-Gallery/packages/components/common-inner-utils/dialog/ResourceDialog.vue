<template>
  <absolute-container
    :top="top"
    :left="left"
    :right="right"
    :bottom="bottom"
    :width="width"
    left-title
    class="source-dialog iotEquipment"
    title=" "
    @close="close"
  >
    <template v-slot:title>
      <span :class="[bemClass.title]">
        <img :src="resourceData?.icon" alt="" />
        <h4 v-c-tip.auto="resourceData?.resourceName">
          {{ resourceData?.resourceName }}
        </h4>
        <i
          @click="changeCollectionStatus"
          :title="isCollect ? '取消收藏' : '收藏'"
          :class="[
            'favicon iconfont_tools',
            isCollect
              ? 'icon-tongyong_icon_shoucang_20_s active'
              : 'icon-tongyong_icon_shoucang_20_n'
          ]"
        ></i>
      </span>
    </template>
    <div :class="[bemClass.body]">
      <div class="cont_tab">
        <div class="tab_item_wrap">
          <div
            @click="handleTabItemClick(1)"
            class="tab_item"
            :class="tabIndex == 1 ? 'tab_active' : ''"
            >资源信息</div
          >
          <div
            @click="handleTabItemClick(2)"
            class="tab_item"
            :class="tabIndex == 2 ? 'tab_active' : ''"
            >资源图片</div
          >
        </div>
        <div class="tab_bottom_line"></div>
      </div>
      <div :class="[bemClass.content]">
        <div
          class="cont_tab_left"
          :class="resourceData?.length < 2 ? 'h182' : 'h182'"
          v-if="tabIndex == 1"
        >
          <div :class="[bemClass.item]">
            <span :class="[bemClass.label]">资源类型：</span>
            <span :class="[bemClass.value]">
              <span v-c-tip.auto="resourceData?.resourceTypeName">{{
                resourceData?.resourceTypeName
              }}</span>
            </span>
          </div>
          <div
            :class="[bemClass.item]"
            v-if="resourceData?.resourceProperty == '1'"
          >
            <span :class="[bemClass.label]">经纬度：</span>
            <span :class="[bemClass.value]">
              <span
                v-c-tip.auto="
                  'resourceData?.longitude' + ',' + 'resourceData?.latitude'
                "
              >
                {{ Number(resourceData?.longitude).toFixed(6) }},
                {{ Number(resourceData?.latitude).toFixed(6) }}
              </span>
            </span>
          </div>
          <div :class="[bemClass.item]">
            <span :class="[bemClass.label]">详细地址：</span>
            <span :class="[bemClass.value]">
              <span v-c-tip.auto="resourceData?.addr">
                {{ resourceData?.addr }}
              </span>
            </span>
          </div>
          <div :class="[bemClass.item, 'desc']">
            <span :class="[bemClass.label]">描述：</span>
            <span :class="[bemClass.value]" class="desc">
              <span class="desc">{{ resourceData?.remark || '-' }}</span>
            </span>
          </div>
        </div>
        <div
          class="cont_tab_right"
          :class="
            resourceData?.length < 2
              ? 'cont_tab_right_short'
              : 'cont_tab_right_height'
          "
          v-if="tabIndex == 2"
        >
          <div v-if="fileList?.length" class="carousel-wrapper">
            <el-carousel
              @change="getFileIndex"
              :autoplay="false"
              trigger="click"
              arrow="always"
            >
              <el-carousel-item
                v-for="(item, index) in carouselList"
                :key="item + index"
              >
                <img
                  class="fit-height"
                  :src="item"
                  v-if="isImage(item)"
                  alt=""
                />
                <video
                  class="fit-height"
                  controlslist="nodownload noplaybackrate"
                  disablePictureInPicture
                  referrerpolicy="no-referrer"
                  :src="item"
                  v-if="!isImage(item) && index === fileIndex"
                  controls
                  autoplay
                ></video>
              </el-carousel-item>
              <div class="fullscreen" @click="showImageViewer = true">
                <span class="iconfont icon-guotu_icon_quanpingfangda"></span>
              </div>
            </el-carousel>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
      </div>
      <div :class="[bemClass.bottom]">
        <i
          v-c-tip="'周边分析'"
          :class="[
            'iconfont_tools',
            hightInfo.showRound
              ? 'icon-tongyong_icon_zhoubianfenxi_s_30 active'
              : 'icon-tongyong_icon_zhoubianfenxi_n_30'
          ]"
          @click="openRound"
        ></i>
        <i
          v-c-tip="'到这里'"
          :class="[
            'iconfont_tools',
            hightInfo.showArea
              ? 'icon-tongyong_icon_daozheli_s_30 active'
              : 'icon-tongyong_icon_daozheli_n_30'
          ]"
          @click="openLogistic"
        ></i>
      </div>
    </div>
    <image-viewer
      v-if="showImageViewer"
      :urlList="fileList"
      :initial-index="fileIndex"
      :onClose="handleImageViewerClose"
    />
  </absolute-container>
</template>

<script>
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '../bem/create'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  getResourceInfo,
  addResourceOrCancelCollections
} from '../request/API/IotRequest'
import CommonMessage from '../funCommon/message/common-message'

const bem = createNameSpace('source-dialog')
export default {
  name: 'd-radar-dialog',
  components: { AbsoluteContainer, ImageViewer },
  props: {
    left: Number,
    top: Number,
    right: Number,
    bottom: Number,
    width: {
      type: Number,
      default: 368
    },
    siteCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    carouselList() {
      return this.fileList.length === 2
        ? [...this.fileList, ...this.fileList]
        : this.fileList
    },
    bemClass() {
      return {
        title: bem.b('title'),
        extra: bem.b('extra'),
        body: bem.b('body'),
        content: bem.be('body', 'content'),
        item: bem.be('body', 'item'),
        label: bem.be('body', 'label'),
        value: bem.be('body', 'value'),
        bottom: bem.be('body', 'bottom')
      }
    }
  },
  data() {
    return {
      resourceData: null,
      fileList: [],
      isCollect: false,
      showImageViewer: false,
      tabIndex: 1,
      fileIndex: 0,
      hightInfo: {
        // 底部icon高亮
        showRound: false,
        showArea: false
      }
    }
  },
  mounted() {
    // 收藏状态监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompResourceTree}__tree-click-collection-state`,
      (payload) => {
        this.isCollect = payload.optType === '1'
      }
    )
    // 到这里弹窗监听
    this.$globalEventBus.$on(
      `${eventPath.commonCompSearchMap}__close-navigation`,
      (res) => {
        this.hightInfo.showArea = !res.close
      }
    )
    // 监听周边分析弹窗状态
    this.$globalEventBus.$on(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
  },
  watch: {
    siteCode: {
      //监听事件变更
      handler() {
        this.queryData()
      },
      deep: true, //json 深度匹配
      immediate: true //初始化时执行
    }
  }, // 生命周期 - 更新之后
  beforeDestroy() {
    this.resourceData = null
    // this.$globalEventBus.$off(
    //   `${eventPath.commonInnerUtils}__radar-collection-state`
    // )
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
  },
  methods: {
    handleImageViewerClose() {
      this.showImageViewer = false
    },
    getFileIndex(index) {
      this.fileIndex = index
    },
    isImage(val) {
      const fileTypes = ['jpg', 'jpeg', 'png', 'JPEG', 'JPG', 'PNG']
      return fileTypes.find((item) => val.includes(item))
    },
    handleTabItemClick(index) {
      if (index == this.tabIndex) return
      this.tabIndex = index
    },
    // 收藏
    changeCollectionStatus() {
      const params = {
        collObjCode: [this.resourceData?.resourceId],
        collObjType: '1',
        optType: this.isCollect ? '2' : '1'
      }
      addResourceOrCancelCollections(params).then(() => {
        CommonMessage.success(
          this.isCollect ? '资源取消收藏成功' : '资源收藏成功'
        )
        this.isCollect = params.optType === '1'
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__pop-resource-tree-collection-state`,
          params
        )
      })
    },
    async queryData() {
      let resourceId = this.siteCode
      let res = await getResourceInfo(resourceId)
      if (res.code === 200) {
        this.resourceData = res.data
        this.isCollect = Number(res.data.isMonitor) === 1
        this.fileList = res.data.videoUrl
          .split(',')
          .concat(res.data.imgUrl.split(','))
          .filter(Boolean)
      } else {
        CommonMessage.warning(res.msg)
      }
    },
    // 周边分析弹窗
    openRound() {
      console.log('🚀 ~ openRound ~ this.resourceData:', this.resourceData)
      const state = this.hightInfo.showRound
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAroundAnalysis}__visible-change`,
        {
          visible: !state,
          deviceInfo: {
            type: this.resourceData?.resourceProperty, // '1' 点 默认,'2': 线,'3': 面
            longitude: this.resourceData?.longitude,
            latitude: this.resourceData?.latitude,
            deviceCode: this.resourceData?.resourceId,
            geometry: this.resourceData?.geometry // 线资源、面资源需要传，直接把接口返回的传过来就行
          }
        }
      )
      this.hightInfo.showRound = !state
    },
    onCloseAroundAnalysis() {
      this.hightInfo.showRound = false
    },
    // 到这里
    openLogistic() {
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSearchMap}__set-navigation`,
        {
          open: !this.hightInfo.showArea,
          endPoint: {
            lng: this.resourceData?.longitude,
            lat: this.resourceData?.latitude,
            alias: this.resourceData?.addr
          }
        }
      )
      this.hightInfo.showArea = !this.hightInfo.showArea
    },
    close() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__resource_detail_dialog_close`
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/operator-source-dialog';
</style>
