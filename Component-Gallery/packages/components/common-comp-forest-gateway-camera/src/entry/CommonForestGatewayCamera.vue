<!--
  林区卡口
-->
<template>
  <basis-box
    :title="headTitle"
    :canClose="false"
    :noCorner="false"
    :name="'鸟类声纹采集设备'"
    :class="[
      bemClass.container,
      'can-expand',
      'common-iw-s',
      isExpand && 'flexStyle'
    ]"
  >
    <template #extra>
      <div :class="bemClass.titleBox">
        <!-- <div class="switchContainer">
          <div
            :class="['item', videoMode === 'single' && 'active']"
            @click="videoMode = 'single'"
          >
            <div>单画面</div>
          </div>
          <div
            :class="['item', videoMode === 'wall' && 'active']"
            @click="videoMode = 'wall'"
          >
            <div>视频墙</div>
          </div>
        </div> -->
        <i
          @click="onExpand"
          :class="[
            'iconfont_tools icon-linye_icon_biaotizhankai_you',
            bemClass.pointer,
            isExpand && 'isOpen'
          ]"
        />
      </div>
    </template>
    <div :class="[bemClass.cameraContainer, isExpand && 'style2']">
      <div class="row">
        <div class="content-box">
          <div
            v-for="k in renderListData"
            class="content-item"
            :class="k.custromClass"
            :key="k.fieldName"
          >
            <div class="content-box__bottom">
              <p class="content-item__label">{{ k.label }} </p>
              <div class="content-item__value">{{ k.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="cdivider" />
      <div class="deviceTreeBox" ref="deviceTreeBox">
        <card-dev-tree
          v-show="isExpand"
          ref="deviceTree"
          :video-mode="videoMode"
          :viewModeKey="viewModeKey"
          :expandModeKey="expandKey"
          :defaultExpand="defaultExpand"
          :videoModeKey="videoModeKey"
          :displayModeKey="displayModeKey"
          :datetimeKey="datetimeKey"
          :paramExpandKey="paramExpandKey"
          :layersId="layersId"
          :mapId="mapId"
          :otherConfig="otherConfig"
        ></card-dev-tree>
      </div>
    </div>
  </basis-box>
</template>

<script>
import {
  getUserMemoryInfo,
  uptUserMemoryInfo,
  getBayonetCount
} from '../service/index.js'
import cardDevTree from '@component-gallery/card-dev-tree-schh'
import BasisBox from '@component-gallery/basisBox'

// import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import { createNameSpace } from '@component-gallery/utils/bem/create'
import eventPath from '@component-gallery/build-event-bus-path'
const bem = createNameSpace('forest-gateway-camera')
let resizeObserver

export default {
  name: 'forest-gateway-camera',
  components: { BasisBox, cardDevTree },
  props: {
    headTitle: {
      type: String,
      default: '林区卡口'
    },
    subtitle: {
      type: String,
      default: '林区卡口'
    },
    cardBg: {
      type: [Object, String],
      default: 'wetland' // forest：林区卡口 wetland：湿地卡口
      // default: () => {
      //   return {
      //     theme:
      //     // url: require('@component-gallery/assets/image/forest-gateway-camera/cameraTreeBg.png'),
      //     // selectUrl: require('@component-gallery/assets/image/forest-gateway-camera/cameraTreeBgActive.png')
      //   }
      // }
    },
    defaultExpand: {
      // 是否默认展开
      type: Boolean,
      default: true
    },
    viewModeKey: {
      // 用于记录是卡片视图还是列表视图的用户记忆key，外部如有需要请覆盖为别的键。传空为该功能不使用用户记忆。
      type: String,
      default: ''
    },
    expandKey: {
      // 用于记录设备树展开模式的用户记忆key，外部如有需要请覆盖为别的键
      type: String,
      default: ''
    },
    videoModeKey: {
      type: String,
      default: ''
    },
    displayModeKey: {
      type: String,
      default: ''
    },
    datetimeKey: {
      type: String,
      default: ''
    },
    paramExpandKey: {
      type: String,
      default: ''
    },

    mapId: {
      type: String,
      default: 'mapId'
    },
    // 图层Id
    layersId: {
      type: Number
    },
    otherConfig: {
      type: Object,
      default: () => {
        return {
          isShowDisplayMode: true
        }
      }
    }
  },
  data() {
    return {
      videoMode: 'single',
      statisticData: {},
      isExpand: false,
      showCardBg: {},
      renderListData: [
        {
          fieldName: 'a',
          value: 0,
          label: '声纹采集设备',
          custromClass: 'first'
        },
        {
          fieldName: 'b',
          value: 0,
          label: '今日采集音频',
          custromClass: 'second'
        },
        {
          fieldName: 'c',
          value: 0,
          label: '今日鸟类',
          custromClass: 'third'
        }
      ]
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('container'),
        titleBox: bem.b('titleBox'),
        pointer: bem.be('titleBox', 'pointer'),
        cameraContainer: bem.b('cameraContainer')
      }
    }
  },
  mounted() {
    // 设置卡口背景
    let _bgConfig = {
      forest: {
        url: require('@component-gallery/assets/image/forest-gateway-camera/cameraTreeBg.png'),
        selectUrl: require('@component-gallery/assets/image/forest-gateway-camera/cameraTreeBgActive.png')
      },
      wetland: {
        url: require('@component-gallery/assets/image/forest-gateway-camera/cameraTreeBg_wetland.png'),
        selectUrl: require('@component-gallery/assets/image/forest-gateway-camera/cameraTreeBgActive_wetland.png')
      }
    }
    let _defaultBg = _bgConfig.wetland
    if (typeof this.cardBg == 'string') {
      this.showCardBg = _bgConfig[this.cardBg] || _defaultBg
    } else {  
      ;['url', 'selectUrl'].forEach((key) => {
        this.showCardBg[key] = this.cardBg[key] || _defaultBg[key]
      })
    }
    // 部分设置有传入默认值，先设置
    this.isExpand = this.defaultExpand
    this.getBayonetCount()
    this._initUserMemoryInfo()
    resizeObserver = new ResizeObserver((entries) => {
      //回调
      this.refreshScrollBar()
    })
    resizeObserver.observe(this.$refs.deviceTreeBox)
  },
  beforeDestroy() {
    ResizeObserver.disconnect()
  },
  methods: {
    onExpand() {
      this.isExpand = !this.isExpand
      if (this.expandKey) {
        uptUserMemoryInfo({
          memoryType: this.expandKey,
          memoryValue: this.isExpand ? 'true' : ''
        })
      }
      this.$emit('treeexpand', this.isExpand)
      this.$globalEventBus.$emit(`${eventPath.commonCompSnapList}__resize`)
    },
    getBayonetCount() {
      getBayonetCount({
        categoryCode: '5'
      }).then((res) => {
        this.statisticData = res.data
      })
    },
    // 初始化记忆
    _initUserMemoryInfo() {
      const requestMemory = [this.videoModeKey, this.expandKey].filter((i) => i)
      if (requestMemory.length <= 0) {
        // 如果没有配置，则不使用用户记忆
        return
      }
      getUserMemoryInfo({
        memoryTypeList: requestMemory
      }).then((resp) => {
        resp.data.forEach((item) => {
          if (item.memoryType === this.videoModeKey) {
            this.videoMode = item.memoryValue || 'single'
          }
          if (item.memoryType === this.expandKey) {
            this.isExpand = !!item.memoryValue
          }
        })
      })
    },
    // 更新滚动条高度
    refreshScrollBar() {
      setTimeout(() => {
        this.$refs.deviceTree?.refreshScrollBar()
      }, 200)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/forest-gateway-camera/index.scss';
</style>
