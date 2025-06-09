<template>
  <div>
    <absolute-container
      :top="top"
      :left="left"
      :right="right"
      :bottom="bottom"
      :width="width"
      class="iotEquipment"
      @close="closeParent"
      v-if="radarList.length > 1"
    >
      <ul :class="[bemClass.ul]">
        <li
          :class="item.deviceStatus == 0 ? '' : 'outline'"
          :key="item.deviceCode"
          v-for="item in radarList"
          @click="chooseDevice(item)"
        >
          <i
            class="deviceicon leftIcon iconfont_tools icon-tongyong-leidatubiao"
          ></i>
          <p>{{ item.deviceName }}</p>
        </li>
      </ul>
    </absolute-container>
    <absolute-container
      v-if="showDetail"
      :top="top"
      :left="parentLeft"
      :right="right"
      :bottom="bottom"
      :width="368"
      class="iotEquipment"
      title=" "
      left-title
      @close="close"
    >
      <template v-slot:title>
        <span :class="[bemClass.title]">
          <i
            class="deviceicon leftIcon iconfont_tools icon-tongyong-leidatubiao"
          ></i>
          <el-tooltip
            v-if="titleToolTip"
            :content="radarInfo.deviceName"
            placement="top"
          >
            <h4>{{ radarInfo.deviceName }}</h4>
          </el-tooltip>
          <h4 id="titleRef" v-else>{{ radarInfo.deviceName }}</h4>
          <div
            :class="Number(radarInfo.deviceStatus) === 0 ? 'inline' : 'outline'"
            >{{ Number(radarInfo.deviceStatus) === 0 ? '在线' : '离线' }}</div
          >
          <i
            @click="addCollect"
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
        <div :class="[bemClass.content]">
          <div :class="[bemClass.tab]">
            <div :class="[bemClass.wrap]">
              <div
                @click="tabIndex = 1"
                class="tab_item"
                :class="tabIndex === 1 ? 'tab_active' : ''"
                >雷达信息</div
              >
              <div
                @click="tabIndex = 2"
                class="tab_item"
                :class="tabIndex === 2 ? 'tab_active' : ''"
                >雷达图片</div
              >
            </div>
            <div :class="[bemClass.bottomline]"></div>
          </div>
          <div :class="[bemClass.contentbox]" v-if="tabIndex === 1">
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">雷达编号：</span>
              <span :class="[bemClass.value]">
                <span>{{ radarInfo.deviceCode }}</span>
                <i @click="copyInfo" class="iconfont_tools icon-fuzhiicon"></i>
              </span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">雷达厂家：</span>
              <span :class="[bemClass.value]">{{
                radarInfo.modelName || '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">雷达型号：</span>
              <span :class="[bemClass.value]">{{
                radarInfo.deviceModelCode || '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">覆盖范围：</span>
              <span :class="[bemClass.value]">{{
                radarInfo.wzone ? radarInfo.wzone + 'm' : '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">天线扫描周期：</span>
              <span :class="[bemClass.value]">{{
                radarInfo.devicePeriod ? radarInfo.devicePeriod + 's' : '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">相控角度：</span>
              <span :class="[bemClass.value]">{{
                radarInfo.parAngle ? radarInfo.parAngle + '°' : '-'
              }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">经纬度：</span>
              <span :class="[bemClass.value]">{{ lnglat || '-' }}</span>
            </div>
            <div :class="[bemClass.item]">
              <span :class="[bemClass.label]">雷达地址：</span>
              <span :class="[bemClass.value]">
                <span v-c-tip="radarInfo.location">{{
                  radarInfo.location
                }}</span>
              </span>
            </div>
          </div>
          <div
            class="cont_tab_right"
            :class="
              fileList?.length < 2
                ? 'cont_tab_right_short'
                : 'cont_tab_right_height'
            "
            v-if="tabIndex == 2"
          >
            <div
              v-if="fileList?.length"
              :class="[bemClass.carouselwrapper]"
              v-show="tabIndex == 2"
            >
              <el-carousel
                @change="getFileIndex"
                :autoplay="false"
                trigger="click"
                arrow="always"
              >
                <el-carousel-item
                  v-for="(item, index) in fileList"
                  :key="item + index"
                >
                  <img
                    :class="[bemClass.fitheight]"
                    :src="item"
                    v-if="isImage(item)"
                    alt=""
                  />
                  <video
                    :class="[bemClass.fitheight]"
                    controlslist="nodownload noplaybackrate"
                    disablePictureInPicture
                    referrerpolicy="no-referrer"
                    :src="item"
                    v-if="!isImage(item) && index === fileIndex"
                    controls
                    autoplay
                  ></video>
                </el-carousel-item>
                <div
                  :class="[bemClass.fullscreen]"
                  @click="showImageViewer = true"
                >
                  <span
                    class="iconfont_tools icon-guotu_icon_quanpingfangda fullScreenBtn"
                  ></span>
                </div>
              </el-carousel>
            </div>
            <div v-else :class="[bemClass.nodata]">暂无数据</div>
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
    </absolute-container>
    <image-viewer
      v-if="showImageViewer"
      :urlList="fileList"
      :initial-index="fileIndex"
      :onClose="
        () => {
          showImageViewer = false
        }
      "
    />
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '../bem/create'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  addOrCancelCollections,
  queryRadarDeviceBySite,
  // getDeviceListBySiteCode,
  // getDeviceInfo
  queryRadarDeviceInfo
} from '../request/API/IotRequest'
import CommonMessage from '../funCommon/message/common-message'
import { pinyin } from 'pinyin-pro'
import ImageViewer from './camera-tree-dialog/ImageViewer.vue'
import { Tooltip as ElTooltip } from 'element-ui'

const bem = createNameSpace('iot-equipment')
export default {
  name: 'd-radar-dialog',
  components: { AbsoluteContainer, ImageViewer, ElTooltip },
  props: {
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
      default: 230
    },
    siteCode: {
      type: String,
      default: ''
    },
    deviceCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    bemClass() {
      return {
        title: bem.b('title'),
        extra: bem.b('extra'),
        body: bem.b('body'),
        content: bem.be('body', 'content'),
        item: bem.be('body', 'item'),
        label: bem.be('body', 'label iotlabel'),
        value: bem.be('body', 'value'),
        bottom: bem.be('body', 'bottom'),
        ul: bem.b('ul-list'),
        tab: bem.be('body', 'tab'),
        wrap: bem.be('body', 'wrap'),
        bottomline: bem.be('body', 'bottomline'),
        contentbox: bem.be('body', 'contentbox'),
        carouselwrapper: bem.be('body', 'carouselwrapper'),
        fitheight: bem.be('body', 'fitheight'),
        fullscreen: bem.be('body', 'fullscreen'),
        nodata: bem.be('body', 'nodata')
      }
    }
  },
  data() {
    return {
      titleToolTip: false,
      lnglat: '',
      showImageViewer: false,
      fileList: [],
      fileIndex: 0,
      radarList: [], // 雷达列表
      radarData: {
        longitude: null,
        latitude: null
      }, // 雷达信息
      radarInfo: {
        deviceName: null,
        deviceStatus: 0,
        modelName: null,
        deviceModelCode: null,
        wzone: null,
        devicePeriod: null,
        parAngle: null,
        deviceCode: null,
        location: null
      }, // 雷达详情
      isCollect: false, // 是否收藏
      hightInfo: {
        // 底部icon高亮
        showRound: false,
        showArea: false
      },
      showDetail: false,
      parentLeft: -184,
      childDevice: null,
      tabIndex: 1
    }
  },

  mounted() {
    this.queryData()
    // 雷达树收藏
    this.$globalEventBus.$on(
      `${eventPath.commonInnerUtils}__radar-collection-state`,
      (payload) => {
        if (payload?.collObjCode[0] === this.radarInfo.deviceCode) {
          this.isCollect = payload.optType === '1'
        }
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
  updated() {
    this.$nextTick(() => {
      this.computedShowTooltip()
    })
  },
  beforeDestroy() {
    this.$globalEventBus.$off(
      `${eventPath.commonInnerUtils}__radar-collection-state`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
  },
  methods: {
    async computedShowTooltip() {
      try {
        const ref = document.querySelector('#titleRef')
        const { offsetWidth, scrollWidth } = ref
        this.titleToolTip = offsetWidth < scrollWidth
      } catch (e) {
        console.log(e)
      }
    },
    queryData() {
      if (this.childDevice) {
        queryRadarDeviceInfo({ deviceCode: this.childDevice }).then((res) => {
          // 使用deviceCode查询的是详情，但是返回的是数组，精准查询详情长度只会是1
          if (res.code === 200) {
            console.warn(res.data[0])
            this.radarData = res.data[0]
            this.radarInfo = res.data[0] || {}
            this.isCollect = res.data[0]?.isMonitor === '1'
            this.showDetail = true
            // this.fileList = res.data[0]?.fileUrlList
            this.fileList =
              res.data[0]?.fileUrlList?.length !== 2
                ? res.data[0]?.fileUrlList
                : [...res.data[0]?.fileUrlList, ...res.data[0]?.fileUrlList]
            this.lnglat = res.data[0]
              ? res.data[0].longitude + ',' + res.data[0].latitude
              : ''
          }
        })
      } else {
        queryRadarDeviceBySite({ siteCode: this.siteCode }).then((res) => {
          if (res.code === 200) {
            this.radarData = res.data[0]
            this.radarList = res.data[0]?.list
            // 列表数据按照首字母'a-z'进行排序，
            this.radarList = this.getFirstLetterOfPinyin(this.radarList)
            this.radarInfo = res.data[0]?.list[0] || {}
            this.isCollect = res.data[0]?.list[0]?.isMonitor === '1'
            this.fileList =
              // res.data[0]?.list[0]?.fileUrlList
              res.data[0]?.list[0]?.fileUrlList?.length !== 2
                ? res.data[0]?.list[0]?.fileUrlList
                : [
                    ...res.data[0]?.list[0]?.fileUrlList,
                    ...res.data[0]?.list[0]?.fileUrlList
                  ]
            this.lnglat = res.data[0]
              ? res.data[0].longitude + ',' + res.data[0].latitude
              : ''
            if (this.radarList.length === 1) {
              this.showDetail = true
            }
          }
        })
      }
    },
    getFileIndex(index) {
      this.fileIndex = index
    },
    isImage(val) {
      const fileTypes = ['jpg', 'jpeg', 'png', 'JPEG', 'JPG', 'PNG']
      return fileTypes.find((item) => val.includes(item))
    },
    // 内部复制方法，方案是生成一个input，赋值，然后用指令处理这个输入框内的内容
    _copyText(txt) {
      const aux = document.createElement('input')
      aux.value = txt
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    copyInfo() {
      this._copyText(this.radarInfo.deviceCode)
      CommonMessage.success('复制成功')
    },
    addCollect() {
      // 收藏切换
      const params = {
        collObjCode: [this.radarInfo.deviceCode],
        collObjType: '8',
        optType: this.isCollect ? '0' : '1'
      }
      addOrCancelCollections(params).then((res) => {
        if (params.optType === '1') {
          CommonMessage.success('雷达设备收藏成功')
        } else {
          CommonMessage.success('雷达设备取消收藏成功')
        }
        this.isCollect = params.optType === '1'
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__pop-radar-collection-state`,
          params
        )
      })
    },
    openRound() {
      // 周边分析弹窗
      const state = this.hightInfo.showRound
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAroundAnalysis}__visible-change`,
        {
          visible: !state,
          deviceInfo: {
            deviceCode: this.radarInfo.deviceCode,
            type: '1', // '1' 点 默认,'2': 线,'3': 面
            longitude: this.radarData.longitude,
            latitude: this.radarData.latitude,
            geometry: '' // 线资源、面资源需要传，直接把接口返回的传过来就行
          }
        }
      )
      this.hightInfo.showRound = !state
    },
    onCloseAroundAnalysis() {
      this.hightInfo.showRound = false
    },
    openLogistic() {
      // 到这里弹窗
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSearchMap}__set-navigation`,
        {
          open: this.hightInfo.showArea ? false : true,
          endPoint: {
            lng: this.radarData.longitude,
            lat: this.radarData.latitude,
            alias: this.radarInfo.location
          }
        }
      )
      this.hightInfo.showArea = !this.hightInfo.showArea
    },
    chooseDevice(item) {
      this.parentLeft = 125
      this.showDetail = true
      this.childDevice = item.deviceCode
      this.queryData()
      item['layerType'] = 2
      this.$globalEventBus.$emit(
        `${eventPath.commonCompLayersControl}__marker-select`,
        {
          isSelected: true,
          geometry: null,
          props: item,
          entity: null
        }
      )
    },
    closeParent() {
      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog_close`,
        {
          type: 'radar',
          deviceInfo: this.radarInfo
        }
      )
    },
    close() {
      if (this.showDetail && this.radarList?.length > 1) {
        this.radarData = {}
        this.radarInfo = {}
        this.showDetail = false
      } else {
        this.$emit('close')
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__dialog_close`,
          {
            type: 'radar',
            deviceInfo: this.radarInfo
          }
        )
      }
    },
    // 拼音化首字母，并进行排序
    getFirstLetterOfPinyin(originalList) {
      let newList = []

      originalList.forEach((item) => {
        let { deviceName } = item
        let str = pinyin(deviceName, {
          pattern: 'first', // 获取拼音首字母
          toneType: 'none', // 不带音调
          type: 'array' // 数组形式
        })
        newList.push({ ...item, str })
      })
      const processedList = newList
        .sort(this.compareSubArrays)
        .map(({ str, ...rest }) => rest)
      return processedList
    },
    // 排序函数
    compareSubArrays(prev, next) {
      let a = prev.str
      let b = next.str
      // 遍历两个子数组，直到找到不同的字符或遍历完其中一个
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        // 比较两个字符的Unicode编码
        if (a[i].charCodeAt(0) !== b[i].charCodeAt(0)) {
          return a[i].charCodeAt(0) - b[i].charCodeAt(0)
        }
      }
      // 如果所有字符都相同，则根据数组长度进行比较（短的排在前面）
      return a.length - b.length
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/iot-equipment-tab';
</style>
