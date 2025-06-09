<template>
  <div>
    <absolute-container
      :top="top"
      :left="left"
      :right="right"
      :bottom="8"
      :width="width"
      :class="[bemClass.container]"
      @close="closeParent"
      v-if="showList"
      :style="containerStyle"
    >
      <el-scrollbar class="listScroll">
        <ul :class="[bemClass.ul]">
          <li
            :key="item.id"
            v-for="item in plagueWoodList"
            @click="chooseDevice(item.id)"
            :class="nowId === item.id ? 'active' : ''"
          >
            <ct-icon name="infectedwood" class="smallLogo" />
            <el-tooltip
              :content="item.treeType"
              placement="top"
              popper-class="common-iw-s"
              :enterable="false"
              :ref="`woodTip_${item.id}`"
              :disabled="false"
            >
              <p
                @mouseover="
                  onMouseOver(`woodName_${item.id}`, `woodTip_${item.id}`)
                "
                ><span :ref="`woodName_${item.id}`">{{
                  item.treeType
                }}</span></p
              >
            </el-tooltip>
            <el-tooltip
              :content="item.woodCode"
              placement="top"
              popper-class="common-iw-s"
              :enterable="false"
              :ref="`codeTip_${item.id}`"
              :disabled="false"
            >
              <span
                class="num"
                @mouseover="
                  onMouseOver(`woodCode_${item.id}`, `codeTip_${item.id}`)
                "
                ><span :ref="`woodCode_${item.id}`">{{
                  item.woodCode
                }}</span></span
              >
            </el-tooltip>
          </li>
        </ul>
      </el-scrollbar>
    </absolute-container>
    <absolute-container
      v-if="showDetail"
      :top="parentTop"
      :left="parentLeft"
      :right="right"
      :bottom="bottom"
      :width="368"
      :height="348"
      :title="`${plagueWoodInfo.treeType}${plagueWoodInfo.woodCode}`"
      left-title
      :specialStyle="specialStyle"
      :class="[bemClass.container]"
      @close="close"
    >
      <template v-slot:title>
        <span class="headStyle">
          <ct-icon class="iconShow" name="infectedwood" />
          <el-tooltip
            :content="plagueWoodInfo.treeType + plagueWoodInfo.woodCode"
            placement="top"
            popper-class="common-iw-s"
            :enterable="false"
            ref="headTip"
            :disabled="false"
          >
            <h4 @mouseover="onMouseOver(`headBody`, `headTip`)"
              ><span ref="headBody"
                >{{ plagueWoodInfo.treeType
                }}{{ plagueWoodInfo.woodCode }}</span
              ></h4
            >
          </el-tooltip>
          <div :class="`tag color${plagueWoodInfo.processingStateType}`"
            >{{ plagueWoodInfo.processingState }}
          </div>
          <em
            @click="clickFavorite"
            :class="[
              'favicon iconfont_tools',
              isFavorite
                ? 'icon-tongyong_icon_shoucang_20_s active'
                : 'icon-tongyong_icon_shoucang_20_n'
            ]"
          ></em>
        </span>
      </template>
      <div class="mainBox">
        <!-- tag标签页模块 -->
        <div :class="[bemClass.tab]">
          <div :class="[bemClass.tabWrap]">
            <div
              @click="nowIndex = 1"
              :class="
                nowIndex == 1
                  ? `${[bemClass.tabItem]} tab_active`
                  : [bemClass.tabItem]
              "
              >基本信息</div
            >
            <div
              @click="nowIndex = 2"
              :class="
                nowIndex == 2
                  ? `${[bemClass.tabItem]} tab_active`
                  : [bemClass.tabItem]
              "
              >图片</div
            >
          </div>
          <div :class="[bemClass.tabLine]" class="tab_bottom_line"></div>
        </div>
        <el-scrollbar class="main" v-show="nowIndex == 1">
          <div class="textStyle baseInfo">
            <div>
              <span class="titleStyle sp1">所属区域：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.region || '-'
              }}</span>
            </div>
            <div>
              <span class="titleStyle sp1">疫木编号：</span>
              <span class="valueStyle sp2"
                >{{ plagueWoodInfo.woodCode || '-'
                }}<i
                  class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                  @click="copyToClipboard(plagueWoodInfo.woodCode || '-')"
                ></i
              ></span>
            </div>
            <div>
              <span class="titleStyle sp1">树种：</span>
              <span class="valueStyle sp2"
                >{{ plagueWoodInfo.treeType || '-' }}
                <i
                  class="iconfont_tools icon-fuzhiicon icon-one-fuzhi"
                  @click="copyToClipboard(plagueWoodInfo.treeType || '-')"
                ></i>
              </span>
            </div>
            <div>
              <span class="titleStyle sp1">林种：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.forestType || '-'
              }}</span>
            </div>
            <div>
              <span class="titleStyle sp1">变色木类型：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.variegatedWoodType || '-'
              }}</span>
            </div>
            <div>
              <span class="titleStyle sp1">林班号：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.limbanNumber || '-'
              }}</span>
            </div>
            <div>
              <span class="titleStyle sp1">小班号：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.sctNumber || '-'
              }}</span>
            </div>
            <div>
              <span class="titleStyle sp1">发现时间：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.discoveryTime || '-'
              }}</span>
            </div>
            <div class="introduce">
              <span class="titleStyle sp1">简介：</span>
              <span class="valueStyle sp2">{{
                plagueWoodInfo.synopsis || '-'
              }}</span>
            </div>
          </div>
        </el-scrollbar>

        <div v-show="nowIndex == 2" class="main">
          <div class="player" v-if="plagueWoodInfo.pictureUrlList.length">
            <el-carousel
              :arrow="
                plagueWoodInfo.pictureUrlList.length > 1 ? 'always' : 'never'
              "
              @change="getFileIndex"
              trigger="click"
              :autoplay="false"
            >
              <el-carousel-item
                v-for="item in plagueWoodInfo.pictureUrlList"
                :key="item"
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
                  v-else
                  controls
                ></video>
              </el-carousel-item>
              <div class="fullscreen" @click="showImageViewer = true">
                <span class="icon-quanpingicon iconfont_tools"></span>
              </div>
            </el-carousel>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
      </div>
      <image-viewer
        v-if="showImageViewer"
        :urlList="plagueWoodInfo.pictureUrlList"
        :initial-index="fileIndex"
        :onClose="handleImageViewerClose"
      />
    </absolute-container>
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'
import {
  getPlagueWoodList,
  getPlagueWoodFavorite,
  getPlagueWoodDetail
} from '../request/API/index'
import { createNameSpace } from '../bem/create'
import { copyToClipboard } from '../funCommon/common'
import newMessage from '../funCommon/message/message'
import eventPath from '@component-gallery/build-event-bus-path'

const bem = createNameSpace('plagueWood-detail')
export default {
  name: 'd-plagueWood-detail',
  components: { AbsoluteContainer, ImageViewer },
  props: {
    mapId: {
      type: String,
      default: ''
    },
    left: {
      type: Number,
      default: -115
    },
    top: Number,
    right: Number,
    bottom: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 232
    },
    deviceCode: {
      type: Number,
      default: 0
    }, // 请求参数id 注意！对疫木详情来讲这个参数不准，通过markerInfo里的id获取
    payload: {
      type: Object,
      default: () => ({})
    },
    specialStyle: {
      default: () => {
        return {
          // 通用主题配置
          wiseblue: {
            striped: true //条纹标题风格
          }
        }
      }
    }
  },
  data() {
    return {
      nowIndex: 1,
      isFavorite: false,
      plagueWoodInfo: null, // 疫木详情信息
      fileIndex: 0,
      showImageViewer: false,
      plagueWoodList: [], // 疫木列表
      showList: false, // 列表展示
      showDetail: false, // 详情弹窗显隐
      parentLeft: -184,
      parentTop: -358,
      containerStyle: {},
      nowId: '' // 从列表中当前选中id
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('container'),
        tab: bem.b('tab'),
        tabWrap: bem.be('tab', 'wrap'),
        tabItem: bem.be('tab', 'tabItem'),
        tabLine: bem.be('tab', 'tabLine'),
        ul: bem.b('ul-list')
      }
    }
  },
  mounted() {
    this.plagueWoodInfo = {
      pictureUrlList: []
    }

    this.initData()

    this.$globalEventBus.$on(
      `${eventPath.commonInnerUtils}__EpidemicWoodStatisticsCollect`,
      this.onFavorSync
    )
  },
  beforeDestroy() {
    this.$globalEventBus.$off(
      `${eventPath.commonInnerUtils}__EpidemicWoodStatisticsCollect`,
      this.onFavorSync
    )
  },
  methods: {
    // 动态渲染tooltips
    onMouseOver(str, box) {
      // 内容超出，显示文字提示内容
      let tag = null
      let tipBox = null
      if (str === 'headBody') {
        tag = this.$refs[str]
        tipBox = this.$refs[box]
      } else {
        tag = this.$refs[str][0]
        tipBox = this.$refs[box][0]
      }
      const parentWidth = tag.parentNode.offsetWidth // 获取元素父级可视宽度
      const contentWidth = tag.offsetWidth // 获取元素可视宽度
      let disabled = contentWidth <= parentWidth
      tipBox.disabled = disabled
    },
    // 初始化加载
    async initData() {
      await this.getPlagueWoodList()
      if (this.plagueWoodList.length > 1) {
        this.showList = true
      } else {
        await this.getPlagueWoodDetail(this.payload.markerInfo.id)
        this.showDetail = true
      }
    },
    // 列表选中操作
    chooseDevice(id) {
      // 列表切换设备详情
      this.parentLeft = 125
      this.showDetail = true
      this.nowId = id
      this.getPlagueWoodDetail(id)
    },
    onFavorSync({ id, type }) {
      // 外部传来的收藏事件，同步收藏结果；1是收藏，2是取消收藏
      id.map((item) => {
        // id为数组
        if (item === this.payload.markerInfo.id) {
          // 只响应id相同的触发
          this.isFavorite = `${type}` === '1'
        }
      })
    },
    // 关闭预览
    handleImageViewerClose() {
      this.showImageViewer = false
    },
    // 判断是否为图片
    isImage(val) {
      const fileTypes = [
        'jpg',
        'jpeg',
        'png',
        'JPEG',
        'JPG',
        'PNG',
        'gif',
        'GIF'
      ]
      return fileTypes.find((item) => val.includes(item))
    },
    // 点击切换索引
    getFileIndex(index) {
      this.fileIndex = index
    },
    copyToClipboard(v) {
      copyToClipboard(v)
    },
    close() {
      if (this.showDetail && this.plagueWoodList?.length > 1) {
        this.plagueWoodInfo = {}
        this.fileIndex = 0
        this.showDetail = false
      } else {
        this.closeParent()
      }
    },
    closeParent() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog_close`,
        {
          type: 'plagueWood',
          deviceInfo: this.plagueWoodInfo
        }
      )
    },
    // 按经纬度查询疫木列表
    async getPlagueWoodList() {
      await getPlagueWoodList({
        longitude: this.payload.markerInfo.longitude,
        latitude: this.payload.markerInfo.latitude
      }).then((res) => {
        this.plagueWoodList = res.data
        let num =
          this.plagueWoodList.length > 5 ? 5 : this.plagueWoodList.length
        this.containerStyle = {
          height: this.pxToRem(num * 32)
        }
      })
    },
    // 查询疫木详情
    async getPlagueWoodDetail(id) {
      await getPlagueWoodDetail({
        id
      }).then((res) => {
        this.plagueWoodInfo = res.data
        this.plagueWoodInfo.pictureUrlList =
          this.plagueWoodInfo.pictureUrlList || []
        this.isFavorite = `${res.data.collectionFlag}` === '1'
      })
    },
    // 收藏切换
    clickFavorite() {
      this.isFavorite = !this.isFavorite
      let list = [
        this.plagueWoodList.length > 1 ? this.nowId : this.payload.markerInfo.id
      ]
      let type = 0
      let message = ''
      if (this.isFavorite) {
        message = '收藏成功'
        type = 1
      } else {
        message = '取消收藏成功'
        type = 2
      }
      getPlagueWoodFavorite({
        list: list,
        optType: type,
        collectType: '3'
      }).then(async (res) => {
        if (res.code === 200) {
          newMessage.success(message)
          this.$globalEventBus.$emit(
            `${eventPath.commonInnerUtils}__pop-epidemicwood-detail-collection-state`,
            {
              id:
                this.plagueWoodList.length > 1
                  ? this.nowId
                  : this.payload.markerInfo.id,
              type
            }
          )
          await this.getPlagueWoodDetail(
            this.plagueWoodList.length > 1
              ? this.nowId
              : this.payload.markerInfo.id
          )
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/plagueWood-detail';
</style>
