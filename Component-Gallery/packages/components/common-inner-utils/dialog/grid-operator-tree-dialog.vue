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
      v-if="operatorList.length > 1"
    >
      <ul :class="[bemClass.ul]">
        <li
          :key="item.keeperId"
          v-for="item in operatorList"
          @click="chooseDevice(item)"
        >
          <em
            class="deviceicon leftIcon iconfont_tools icon-tongyong_icon_wanggeyuan"
            :class="item.isLine === '0' ? 'offLine' : ''"
          ></em>
          <p
            :class="item.isLine === '0' ? 'offLine' : ''"
            v-c-tip.auto="item.keeperName"
            >{{ item.keeperName }}</p
          >
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
          <em
            class="deviceicon leftIcon iconfont_tools icon-tongyong_icon_wanggeyuan"
          ></em>
          <h4 v-c-tip.auto="operatorInfo.keeperName">{{
            operatorInfo.keeperName
          }}</h4>
          <em
            :class="[
              'favicon deviceicon iconfont_tools',
              operatorInfo.keeperGender === '1'
                ? 'icon-tongyong_icon_nv'
                : 'icon-tongyong_icon_nan'
            ]"
          ></em>
          <div v-if="operatorInfo.isLine === '1'" class="inline">在线</div>
          <div v-else class="outline">离线</div>
        </span>
      </template>
      <div :class="[bemClass.body]">
        <div :class="[bemClass.content]">
          <div :class="[bemClass.item]">
            <span class="operatorLabel" :class="[bemClass.label]"
              >责任网格：</span
            >
            <span :class="[bemClass.value]">
              <div
                v-c-tip.auto="parseGridNames(operatorInfo.gridNames)"
                class="grid-name"
              >
                {{ parseGridNames(operatorInfo.gridNames) }}
              </div>
            </span>
          </div>
          <div :class="[bemClass.item]">
            <span class="operatorLabel" :class="[bemClass.label]">电话：</span>
            <span :class="[bemClass.value]">{{
              operatorInfo.keeperPhoneNumber || '-'
            }}</span>
          </div>
          <div :class="[bemClass.item]" class="isTop">
            <span class="operatorLabel" :class="[bemClass.label]">职责：</span>
            <span :class="[bemClass.value]">
              <div class="desc">
                {{ operatorInfo.operatingDuty || '-' }}
              </div>
            </span>
          </div>
        </div>
        <div :class="[bemClass.bottom]">
          <span
            class="ct-icon-wrapper"
            @click="onGridClick"
            v-c-tip="'责任网格'"
            :class="[hightInfo.showGrid ? 'active' : '']"
          >
            <ct-icon v-if="hightInfo.showGrid" name="belong-grid-active" />
            <ct-icon v-else name="belonging-grid" />
          </span>
          <em
            v-c-tip="'轨迹'"
            :class="[
              'iconfont_tools',
              hightInfo.showTrack
                ? 'icon-tongyong_icon_shishiguiji_s_30 active'
                : 'icon-tongyong_icon_shishiguiji_s_30'
            ]"
            @click="openTrackPopup"
          ></em>
          <em
            v-c-tip="'周边分析'"
            :class="[
              'iconfont_tools',
              hightInfo.showRound
                ? 'icon-tongyong_icon_zhoubianfenxi_s_30 active'
                : 'icon-tongyong_icon_zhoubianfenxi_n_30'
            ]"
            @click="openRound"
          ></em>
          <em
            v-c-tip="'到这里'"
            :class="[
              'iconfont_tools',
              hightInfo.showArea
                ? 'icon-tongyong_icon_daozheli_s_30 active'
                : 'icon-tongyong_icon_daozheli_n_30'
            ]"
            @click="openLogistic"
          ></em>
        </div>
      </div>
    </absolute-container>
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import { createNameSpace } from '../bem/create'
import '../funCommon/drag/directive'
import eventPath from '@component-gallery/build-event-bus-path'
import {
  gridKeeper,
  gridKeeperListByPosition,
  getGridNameByGridId
} from '../request/API/girdOperatorDialog'
import CommonMessage from '../funCommon/message/common-message'
import TREE_ENUM from '../funCommon/tree/tree-enum'
import { cloneDeep, uniqBy } from 'lodash-es'

const bem = createNameSpace('operator-source-dialog')
export default {
  name: 'd-operator-dialog',
  components: { AbsoluteContainer },
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
    // siteCode: {
    //   type: String,
    //   default: '202302161117035649'
    // },
    payload: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    parseGridNames() {
      return (gridNames) => {
        if (gridNames && gridNames.length) {
          return gridNames.join('，')
        }
        return '-'
      }
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
        bottom: bem.be('body', 'bottom'),
        ul: bem.b('ul-list')
      }
    }
  },
  data() {
    return {
      dutyGridList: [], // 职责网格
      operatorList: [], //网格员列表
      // radarData: {}, // 网格员信息
      operatorInfo: {
        keeperPhoneNumber: undefined,
        operatingDuty: undefined,
        keeperName: undefined,
        gridIds: undefined,
        keeperId: undefined,
        longitude: undefined,
        latitude: undefined,
        keeperGender: undefined,
        isLine: undefined,
        keeperAddress: undefined,
        gridNames: undefined
      }, // 网格员详情
      showDetail: false,
      siteCode: null, //网格员ID
      parentLeft: -184,
      hightInfo: {
        // 底部icon高亮
        showTrack: false,
        showRound: false,
        showArea: false,
        showGrid: false
      },
      iotData: {}
    }
  },
  mounted() {
    this.queryData()
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
    //监听轨迹弹窗状态
    this.$globalEventBus.$on(
      `${eventPath.commonCompGridOperatorTree}__call-back-track-popup`,
      (options) => {
        if (options?.deviceType == 7) {
          this.hightInfo.showTrack = options?.gridTrackPop
          console.log('call-back-track-popup', this.hightInfo.showTrack)
        }
      }
    )
    //关闭网格员树
    this.$globalEventBus.$on(
      `${eventPath.commonCompGridOperatorTree}__close-operator-dialog`,
      (options) => {
        if (options?.closeOperatorDialog) {
          //清除弹窗
          this.close()
        }
      }
    )

    this.$globalEventBus.$on(
      `${eventPath.commonCompGridOperatorTree}__get-duty-grid-list`,
      () => {
        this.$globalEventBus.$emit(
          `${eventPath.commonCompGridOperatorTree}__set-duty-grid-list`,
          this.dutyGridList
        )
      }
    )
  },
  beforeDestroy() {
    this.$globalEventBus.$off(
      `${eventPath.commonCompSearchMap}__close-navigation`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close`,
      this.onCloseAroundAnalysis
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__call-back-track-popup`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAroundAnalysis}__close-operator-dialog`
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompGridOperatorTree}__set-choose-tree-list`
    )
  },
  methods: {
    closeParent() {
      this.dutyGridList = []
      this.doDutyGridAction(this.dutyGridList)

      this.$emit('close')
      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog-close`,
        { type: 'operator-grid' }
      )
    },
    chooseDevice(item) {
      // 列表切换设备详情
      const themeKey = document.documentElement.getAttribute('data-theme')
      if (themeKey === 'theme-terracotta') {
        this.parentLeft = 144
      } else {
        this.parentLeft = 134
      }

      this.showDetail = true
      this.siteCode = item.keeperId
      this.queryData()

      this.$globalEventBus.$emit(
        `${eventPath.commonInnerUtils}__dialog-list-item-click`,
        { type: 'operator-grid', data: { ...item, id: item.keeperId } }
      )
    },
    queryData() {
      console.log(this.payload)
      if (this.siteCode) {
        if (this.payload.deviceCode === this.siteCode) {
          this.hightInfo.showTrack = this.payload.gridTrackPop //打开弹窗更新按钮状态
        }
        gridKeeper(this.siteCode).then((res) => {
          if (res.code === 200) {
            this.operatorInfo = res.data
          }
        })
      } else {
        let params = {
          longitude: this.payload.markerInfo.longitude,
          latitude: this.payload.markerInfo.latitude
        }
        gridKeeperListByPosition(params).then((res) => {
          if (res.code === 200) {
            this.operatorList = res.data
            if (this.operatorList.length === 1) {
              this.siteCode = this.operatorList[0].keeperId
              this.queryData()
              this.showDetail = true
            }
          }
        })
      }
    },
    onGridClick() {
      this.hightInfo.showGrid = !this.hightInfo.showGrid

      if (this.hightInfo.showGrid) {
        const gridIds = this.operatorInfo.gridIds
        if (gridIds && gridIds.length) {
          getGridNameByGridId(gridIds).then((res) => {
            const { code, data } = res
            if (code === 200 && data && data.length) {
              data.forEach((item) => {
                if (item.gridRange == null || !item.gridRange.length) {
                  CommonMessage.warning(`${item.gridName}未标绘`)
                } else {
                  this.dutyGridList.push(item)
                }
              })
              console.log(this.dutyGridList)
              this.doDutyGridAction(this.dutyGridList)
            }
          })
        }
      } else {
        this.dutyGridList = []
        this.doDutyGridAction(this.dutyGridList)
      }
    },
    doDutyGridAction(dutyGridList) {
      let operatorList = []

      // 获取网格员列表中的 chooseTreeList
      // $on在前，否则获取不到
      this.$globalEventBus.$on(
        `${eventPath.commonCompGridOperatorTree}__set-choose-tree-list`,
        (list) => {
          operatorList = cloneDeep(list)
        }
      )

      // 网格员列表 chooseTreeList 的值
      this.$globalEventBus.$emit(
        `${eventPath.commonCompGridOperatorTree}__get-choose-tree-list`
      )

      this.$nextTick(() => {
        const allList = [...operatorList, ...dutyGridList]

        this.$globalEventBus.$emit(
          `${eventPath.commonCompLayersControl}__highlight-point`,
          {
            type: TREE_ENUM.GRID_OPERATOR,
            isGrid: true,
            payload: uniqBy(allList, 'gridId')
          }
        )
      })
    },
    openTrackPopup() {
      const state = this.hightInfo.showTrack
      if (!state) {
        this.$emit('close')
      }
      this.$globalEventBus.$emit(
        `${eventPath.commonCompTrackPopup}__show-close-track-popup`,
        {
          gridTrackPop: !state,
          trajectoryType: 1,
          trajectoryData: {
            deviceType: 7,
            deviceCode: this.operatorInfo.keeperId
          }
        }
      )
      this.hightInfo.showTrack = !state
    },
    openRound() {
      // 周边分析弹窗
      const state = this.hightInfo.showRound
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAroundAnalysis}__visible-change`,
        {
          visible: !state,
          deviceInfo: {
            deviceCode: this.operatorInfo.keeperId,
            type: '1', // '1' 点 默认,'2': 线,'3': 面
            longitude: this.operatorInfo.longitude,
            latitude: this.operatorInfo.latitude,
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
      console.log(this.operatorInfo)
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSearchMap}__set-navigation`,
        {
          open: !this.hightInfo.showArea,
          endPoint: {
            lng: this.operatorInfo.longitude,
            lat: this.operatorInfo.latitude,
            alias: this.operatorInfo.keeperAddress
          }
        }
      )
      this.hightInfo.showArea = !this.hightInfo.showArea
    },
    close() {
      if (this.showDetail && this.operatorList?.length > 1) {
        this.operatorInfo = {}
        this.iotData = {}
        this.showDetail = false
      } else {
        this.$emit('close')
        this.$globalEventBus.$emit(
          `${eventPath.commonInnerUtils}__dialog-close`,
          { type: 'operator-grid' }
        )
        this.$globalEventBus.$emit(
          `${eventPath.commonCompLayersControl}__un_select-marker`,
          { layerId: 7 }
        )
        //关闭弹窗清除打点清除打点
        this.$globalEventBus.$emit(
          `${eventPath.commonCompLayersControl}__highlight-point`,
          {
            type: 7
          }
        )

        this.dutyGridList = []
        this.doDutyGridAction(this.dutyGridList)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/operator-source-dialog';
</style>
