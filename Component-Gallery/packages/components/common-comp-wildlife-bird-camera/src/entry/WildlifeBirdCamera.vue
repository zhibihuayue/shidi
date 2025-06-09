<!-- eslint-disable -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <div class="wildlife-bird-camera">
    <!-- 响应式容器 -->
    <responsive-container
      :name="headTitle"
      :leftTitle="true"
      :canClose="false"
      :top="top"
      :right="right"
      :left="left"
      :bottom="bottom"
      isHandShowKey="birdCamera"
      :class="['container_picture', 'common-iw-s']"
      @toggle="onToggle"
      :isOpen="containerIsOpen"
    >
      <!-- 相机容器 -->
      <div class="camera-container">
        <!-- 动物列表 -->
        <div class="wildlife-list">
          <!-- 动物项 -->
          <div
            class="wildlife-item"
            v-for="(item, index) in wildlifeList"
            :key="item.key"
            :class="[item.key === activeKey ? 'selected' : '']"
            @click="onItemClick(item.key)"
            :style="{
              backgroundImage:
                item.key === activeKey
                  ? index === 0
                    ? 'url(' +
                      require('../assets/images/tabimg/iconImg6.png') +
                      ')'
                    : index === 1
                    ? 'url(' +
                      require('../assets/images/tabimg/iconImg1.png') +
                      ')'
                    : 'url(' +
                      require('../assets/images/tabimg/iconImg3.png') +
                      ')'
                  : index === 0
                  ? 'url(' +
                    require('../assets/images/tabimg/iconImg5.png') +
                    ')'
                  : index === 1
                  ? 'url(' +
                    require('../assets/images/tabimg/iconImg4.png') +
                    ')'
                  : 'url(' +
                    require('../assets/images/tabimg/iconImg2.png') +
                    ')'
            }"
          >
            <!-- 动物标签 -->
            <p class="text" :class="'text_' + index">{{ item.label }}</p>
            <!-- 动物数量 -->
            <p class="num" :class="'num_' + index">{{
              statisticData[item.value]
            }}</p>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="dividing-line" v-if="activeKey"></div>
        <!-- 动物相机视图 -->
        <div
          class="wildlife-camera-view"
          v-loading="loading"
          v-show="activeKey"
        >
          <!-- 筛选搜索组 -->
          <filter-search-group
            :showTreeView="showTreeView"
            :showListView="showListView"
            :showCardView="false"
            v-model="filterKeywords"
            :viewType="viewType"
            @filterViewType="filterViewType"
            @filterCollect="filterCollect"
          />
          <!-- 列表视图 -->
          <list-view
            v-show="viewType === '2' && !isCollectTreeView"
            :dataList="filterTreeList || []"
            :is-collect-view="isCollectTreeView"
            :filter-keywords="filterKeywords"
            content="音频数量"
            :config="{
              name: 'deviceName',
              number: 'fileNum',
              img: require('../assets/images/noice-icon.png')
            }"
            @clickItem="nodeClick"
          >
            <!-- 区域筛选排序 -->
            <area-filter-sort
              :placement="'top-end'"
              :districts-list="countryOption"
              :provices-list="provinceOption"
              :citys-list="cityOption"
              :towns-list="townOption"
              :areaData.sync="areaData"
              :tips="'按音频数量排序'"
            ></area-filter-sort>
          </list-view>
          <!-- 自定义树 -->
          <custom-tree
            v-show="viewType === '3' || isCollectTreeView"
            :dataSource="treeViewData"
            :treeNodeList="treeNodeList"
            :filterNode="filterNode"
            :rootNode="rootNode"
            :is-collect-view="isCollectTreeView"
            :filter-keywords="filterKeywords"
            :expandStatus.sync="expandStatus"
            ref="customTree"
            @nodeClick="nodeClick"
            @refresh="onRefresh"
          >
            <!-- 默认插槽 -->
            <template v-slot:default="{ data, filterTree, emitExpand }">
              <div
                :class="[
                  'custom-inner',
                  data.deviceCode && data.status === '1' && 'grey'
                ]"
              >
                <!-- 设备图标 -->
                <!-- <i
                  v-if="data.deviceCode"
                  class="iconfont_tools icon-linye_icon_yebao_zhuapai"
                  style="margin-right: 6px"
                /> -->
                <!-- 在线状态图标 -->
                <div
                  class="icon-img-wrapper"
                  v-if="data.deviceCode && data.status === '0'"
                >
                  <img class="statucicon" src="../assets/images/online.png" />
                </div>
                <!-- 离线状态图标 -->
                <div
                  class="icon-img-wrapper"
                  v-if="data.deviceCode && data.status === '1'"
                >
                  <img class="statucicon" src="../assets/images/offline.png" />
                </div>
                <!-- 未知状态图标 -->
                <div
                  class="icon-img-wrapper"
                  v-if="data.deviceCode && !data.status"
                >
                  <img class="statucicon" src="../assets/images/offline.png" />
                </div>
                <!-- 设备名称 -->
                <span class="label" c-tip-placement="top">
                  <span
                    :class="
                      data.deviceCode && data.status === '1' && 'custom-color'
                    "
                    :c-tip="data.deviceCode ? data.name : ''"
                    c-tip-placement="top"
                    v-html="
                      $options.filters.filterColor(data.name, filterKeywords)
                    "
                  ></span>
                  <span>{{
                    data.num && `(${data.onlineNum}/${data.num})`
                  }}</span></span
                >
              </div>

              <!-- 收藏图标 -->
              <i
                class="favicon icons iconfont_tools"
                :class="
                  data.isMonitor === '0'
                    ? 'icon-icon_shoucang_20_n'
                    : 'icon-icon_shoucang_20_s'
                "
                @click.stop="collectCallback(data, filterTree)"
              />
            </template>
          </custom-tree>
        </div>
      </div>
    </responsive-container>

    <div v-if="popShow">
      <bird-detail-pop
        id="map-overlay"
        :deviceCode="deviceCode"
        :deviceId="deviceId"
        :deviceName="deviceName"
        :nodeData="nodeData"
      ></bird-detail-pop>
    </div>
  </div>
</template>

<script>
// 导入响应式容器组件
import ResponsiveContainer from '@component-gallery/basisBox'
// 导入列表视图组件
import ListView from '@component-gallery/base-components/business-components/list-view/ListView'
// 导入区域筛选排序组件
import AreaFilterSort from '@component-gallery/base-components/business-components/area-filter-sort/AreaFilterSort'
// 导入筛选搜索组组件
import FilterSearchGroup from '@component-gallery/base-components/business-components/filter-search-group/FilterSearchGroup'
// 导入自定义树组件
import CustomTree from '@component-gallery/base-components/business-components/custom-tree/CustomTree'
// 导入设置CTips函数
import { setupCTips } from '@component-gallery/utils/funCommon/c-tip'
// 导入野生动物列表和图标映射
import { wildlifeList } from '../dict/dict'
// 鸟类弹框
import BirdDetailPop from '@component-gallery/bird-detail-pop'

import {
  queryCameraCardViewInfos,
  getCameraMonitorAreaTree,
  queryTodayCameraStatistics,
  getCameraDetail,
  uptUserMemoryInfo,
  getUserMemoryInfo,
  addOrCancelCollections
} from '../service/index'
import CTMapOl from '@ct/ct_map_ol'
import eventPath from '@component-gallery/build-event-bus-path'
import newMessage from '@component-gallery/utils/funCommon/message/message'

export default {
  name: 'd-wildlife-bird-camera',
  inject: ['mapRef'],
  data() {
    return {
      rootNode: '',
      headTitle: '鸟类声纹采集设备',
      containerIsOpen: true,
      activeKey: '1', // 默认选中第一个
      filterKeywords: '', // 过滤关键字
      viewType: '3', // 视图类型  2:列表 3:树形
      isCollectTreeView: false, // 是否是收藏树形视图
      // 省份选项
      provinceOption: [],
      // 城市选项
      cityOption: [],
      // 区县选项
      countryOption: [],
      // 镇街选项
      townOption: [],
      treeViewData: [], // 树形视图数据
      statisticData: {}, // 统计数据
      listViewData: [], // 列表视图数据
      expandStatus: true, // 折叠展开状态
      treeNodeList: [], // 树形视图节点列表
      cameraMarker: null, // 鸟类声纹打点实例
      areaData: {
        provice: '',
        city: '',
        district: '',
        town: '',
        sort: false
      },
      loading: false,
      currentCheckNode: null, // 当前选中的节点
      markerCluster: null,
      deviceCode: null,
      deviceId: 0,
      deviceName: '',
      nodeData: {},
      mapRef_: this.mapRef,
      overlay: null,
      popShow: false,
      deviceMemoryKey: 'wildlife-bird-camera-selected' // 用户记忆key
    }
  },
  computed: {
    // 根据defaultWildlifeKeys过滤wildlifeList
    wildlifeList() {
      return wildlifeList.filter((item) =>
        this.defaultWildlifeKeys.includes(item.type)
      )
    },
    // 根据filterKeywords过滤listViewData
    filterTreeList() {
      let list = this.listViewData.filter(
        (item) =>
          item.deviceName && item.deviceName.includes(this.filterKeywords)
      )
      console.log(this.areaData, 'this.areaData')
      // 根据areaData.provice过滤list
      list = this.areaData.provice
        ? list.filter((item) => item.provinceCode === this.areaData.provice)
        : list
      // 根据areaData.city过滤list
      list = this.areaData.city
        ? list.filter((item) => item.cityCode === this.areaData.city)
        : list
      // 根据areaData.district过滤list
      list = this.areaData.district
        ? list.filter((item) => item.countyCode === this.areaData.district)
        : list
      // 根据areaData.town过滤list
      list = this.areaData.town
        ? list.filter((item) => item.townCode === this.areaData.town)
        : list
      // 根据areaData.sort排序list
      this.areaData.sort
        ? list.sort((a, b) => a.fileNum - b.fileNum)
        : list.sort((a, b) => b.fileNum - a.fileNum)
      return list
    }
  },
  mounted() {
    // 调用setupCTips函数
    setupCTips()
    // 监听全局事件
    this.$globalEventBus.$on(
      `${eventPath.commonCompWildlifeConservationCamera}__set-collect`,
      (payload) => {
        this.searchNodeById(this.treeViewData, payload)
      }
    )
    // 监听全局事件
    this.$globalEventBus.$on(
      `common-comp-layers-control__marker-select`,
      (payload) => {
        if (!payload.isSelected) {
          this.clearCheckStatus()
        }
      }
    )
    // 监听全局事件
    this.$globalEventBus.$on(
      `${eventPath.commonCompWildlifeConservationCamera}__close-pop`,
      () => {
        this.closeMapPopDetailFun()
        this.clearCheckStatus()
        this.currentCheckNode = null
      }
    )
    // 调用queryStatistic函数
    this.queryStatistic()
    // 调用getTreeView函数
    this.getTreeView()
    // 调用getCardView函数
    this.getCardView()
    // 初始化记忆
    this._initUserMemoryInfo()

    // 默认展开第一个设备
    this.$nextTick(() => {
      if (this.treeViewData && this.treeViewData.length > 0) {
        this.$refs.customTree?.setCurrentKey(this.treeViewData[0].deviceCode)
        this.nodeClick({ data: this.treeViewData[0] })
      }
    })
  },
  watch: {
    // 监听areaData.provice的变化
    'areaData.provice': {
      handler(val) {
        // 调用onChangeAreaParam方法，传入val和0
        this.onChangeAreaParam(val, 0)
      }
    },
    // 监听areaData.city的变化
    'areaData.city': {
      handler(val) {
        // 调用onChangeAreaParam方法，传入val和1
        this.onChangeAreaParam(val, 1)
      }
    },
    // 监听areaData.district的变化
    'areaData.district': {
      handler(val) {
        // 调用onChangeAreaParam方法，传入val和2
        this.onChangeAreaParam(val, 2)
      }
    },
    // 监听expandStatus的变化
    'expandStatus'() {
      // 调用setConfigMemory方法
      this.setConfigMemory()
    },
    // 监听activeKey的变化
    'activeKey'(val) {
      // 发射全局事件，事件名为`${eventPath.commonCompWildlifeConservationCamera}__card-toggle`，传入一个对象，包含status属性，值为!!val
      this.$globalEventBus.$emit(
        `${eventPath.commonCompWildlifeConservationCamera}__card-toggle`,
        {
          status: !!val
        }
      )
    },
    'mapRef_': {
      handler(val) {
        console.log('切换地图', val)
        this.popShow = false
        this.markerCluster = null
      },
      deep: true
    }
  },
  props: {
    // 顶部距离
    top: {
      type: Number,
      default: 86
    },
    // 右侧距离
    right: {
      type: Number,
      default: 24
    },
    // 左侧距离
    left: {
      type: Number,
      default: null
    },
    // 底部距离
    bottom: {
      type: Number,
      default: null
    },
    // 最大高度
    maxHeight: {
      type: Number,
      default: 580
    },
    // 地图id
    mapId: {
      type: String,
      default: 'mapId'
    },
    // 配置内存key
    configMemoryKey: {
      type: String,
      default: 'WildlifeBirdCamera'
    },
    // 默认野生动物key
    defaultWildlifeKeys: {
      type: Array,
      default: () => ['1', '2', '3']
    },
    // 是否显示树形视图
    showTreeView: {
      type: Boolean,
      default: true
    },
    // 是否显示列表视图
    showListView: {
      type: Boolean,
      default: true
    }
  },
  created() {
    console.log(9999, this)
    // 在组件创建时调用getConfigMemory方法
    this.getConfigMemory()
  },
  methods: {
    // 地图弹窗详情
    mapPopdetailFun(longitude, latitude) {
      let mapRef_ = this.mapRef.getMapRef(this.$props.mapId || this.mapId)
      let point = [longitude, latitude]
      if (mapRef_.mapType == '3D') {
        mapRef_.mapInstance.container.appendChild(
          document.getElementById('map-overlay')
        )
        let result = CTMapOl.Tools.getClamToHeightPoints(mapRef_.mapInstance, [
          { lng: longitude, lat: latitude }
        ])
        point = [result[0].lng, result[0].lat, result[0].alt]
      }
      this.overlay = new CTMapOl.OverlayControl.common.addOverlay(
        {
          mapRef: mapRef_,
          coord: point,
          domid: 'map-overlay'
        },
        {
          positioning: 'bottom-center',
          offset: [-30, -20]
        }
      )
    },

    // 关闭地图弹窗详情
    closeMapPopDetailFun(oldMapRef) {
      this.popShow = false
      this.$nextTick(() => {
        let mapRef_ = this.mapRef.getMapRef(this.$props.mapId || this.mapId)
        new CTMapOl.OverlayControl.common.removeOverlay({
          mapRef: mapRef_,
          overlayCollection: this.overlay
        })
        document.getElementById('map-overlay').remove()
      })
    },

    // 清除选中状态
    clearCheckStatus() {
      // 将listViewData中的每个item的checked属性设置为false
      this.listViewData = this.listViewData.map((item) => {
        item.checked = false
        return item
      })
      // 将treeNodeList中的每个item的checked属性设置为false
      this.treeNodeList.forEach((item) => (item.checked = false))
      // 将customTree组件的当前选中项设置为null
      this.$refs.customTree?.setCurrentKey(null)
      // 删除marker
      this.markerCluster && this.markerCluster.cleanup()
      this.markerCluster && this.markerCluster.release()
    },
    onToggle(toggled) {
      // Update container open state
      this.containerIsOpen = toggled

      // Clear all states when collapsing
      if (!toggled) {
        // Reset selection states
        this.activeKey = ''
        this.currentCheckNode = null
        this.deviceCode = ''
        this.deviceId = ''
        this.deviceName = ''

        // Clear map markers
        this.clearMarker()
        if (this.markerCluster) {
          this.markerCluster.cleanup()
          this.markerCluster.release()
        }

        // Reset tree state
        if (this.$refs.customTree) {
          this.$refs.customTree.setCurrentKey(null)
        }
        this.expandStatus = false
      }

      // Save state to memory
      this.setConfigMemory()

      // Emit toggle event
      this.$globalEventBus.$emit(
        `${eventPath.commonCompWildlifeConservationCamera}__toggled`,
        { status: toggled }
      )

      // Emit tree expand event
      this.$emit('treeexpand', toggled)

      // Trigger resize event for snap list
      this.$globalEventBus.$emit(`${eventPath.commonCompSnapList}__resize`)
    },
    // 视图切换回调
    filterViewType(type) {
      // 设置视图类型
      this.viewType = type
      // 清除标记
      this.clearMarker()
      // 清除检查状态
      this.clearCheckStatus()
      // 设置配置内存
      this.setConfigMemory()
      // 在下一个tick中执行过滤树
      this.$nextTick(() => {
        this.$refs.customTree?.filterTree()
      })
    },
    // 是否过滤收藏数据
    // 根据传入的collect参数，过滤收藏树
    filterCollect(collect) {
      // 将当前选中的节点置为空
      this.currentCheckNode = null
      // 根据传入的collect参数，判断是否为收藏树
      this.isCollectTreeView = collect === '1'
      // 根据传入的collect参数，获取树形结构
      this.getTreeView(collect === '1' ? '0' : '1')
    },
    // areaCode代表选择的编码，level代表级别，0-based，0是省，1是市，以此类推
    onChangeAreaParam(areaCode, level) {
      const optionLevel = [
        'provinceOption',
        'cityOption',
        'countryOption',
        'townOption'
      ]
      const paramLevel = ['provinceCode', 'cityCode', 'countyCode', 'townCode']

      // 如果没有传areaCode，那么就只认为是清空
      if (!areaCode) {
        // 将下属层级的选项全部清空
        paramLevel.slice(level + 1).forEach((item, index) => {
          this[optionLevel[level + 1 + index]] = []
        })
        return
      }

      const target = this[optionLevel[level]].find(
        (item) => item.code === areaCode
      )
      // 如果有下一层的话，处理下一层的联动
      if (target && optionLevel[level + 1]) {
        this[optionLevel[level + 1]] = target.list
      }
    },
    // 获取列表数据
    getCardView() {
      queryCameraCardViewInfos({
        orderType: 'desc', // 排序类型 asc:升序  desc:降序, 默认降序desc
        fileType: 1
      }).then((res) => {
        this.listViewData = res.data?.list || []
        // this.listViewData.forEach((item) => {
        //   item.deviceCode = null
        // })
      })
    },
    // 获取tree数据
    getTreeView(flag = '1', loading = true) {
      // 设置loading状态
      this.loading = loading
      // 调用接口获取数据
      getCameraMonitorAreaTree({
        isMonitorFlag: flag,
        __ctCbAllCode: true
      })
        .then((resp) => {
          let _list = []
          // 判断返回数据是否为空
          if (resp.data && resp.data.length) {
            // 处理数据
            _list = this.splicingData(resp.data[0].list)
            this.provinceOption = _list
            this.treeViewData = resp.data[0]?.list || []
            this.rootNode = `中国(${resp.data[0].onlineNum}/${resp.data[0].num})`

            // 在数据加载完成后，自动展开第一个设备
            this.$nextTick(() => {
              this.findFirstDeviceFun()
            })
          } else {
            // 如果返回数据为空，则清空数据
            this.provinceOption = []
            this.treeViewData = []
          }
          // 在数据更新后，执行回调函数
          this.$nextTick(() => {
            // 调用树形组件的filterTree方法
            this.$refs.customTree?.filterTree()
            // 调用树形组件的emitExpand方法
            this.$refs.customTree?.emitExpand({ flag: true })
          })
        })
        .catch((e) => {
          // 打印错误信息
          console.error(e)
        })
        .finally(() => {
          // 设置loading状态为false
          this.loading = false
        })
    },
    findFirstDeviceFun() {
      // 找到第一个有设备的节点
      const findFirstDevice = (nodes) => {
        for (let node of nodes) {
          if (node.deviceCode) {
            return node
          }
          if (node.list && node.list.length) {
            const found = findFirstDevice(node.list)
            if (found) return found
          }
        }
        return null
      }

      const firstDevice = findFirstDevice(this.treeViewData)
      if (firstDevice) {
        // 设置当前选中节点
        this.$refs.customTree?.setCurrentKey(firstDevice.deviceCode)
        // 触发节点点击
        this.nodeClick({
          data: firstDevice,
          checked: true
        })
        // 展开到该节点
        this.$refs.customTree?.expandToNode(firstDevice.deviceCode)
      }
    },
    // 拼接省市区数据
    // 递归处理数据
    splicingData(data) {
      // 定义递归函数
      const _fn = (list) => {
        // 定义临时数组
        const _list = []
        // 遍历数据
        list.forEach((item) => {
          // 定义临时数据
          const tempData = {
            code: item.code,
            name: item.name
          }
          // 判断是否有设备编码
          if (item.deviceCode) {
            // 将设备编码赋值给code
            item.code = item.deviceCode
            // 判断设备编码是否与当前选中节点一致
            if (item.deviceCode === this.currentCheckNode?.cameraCode) {
              // 设置选中状态
              this.$set(item, 'checked', true)
              // 在下次DOM更新后，设置当前选中节点
              this.$nextTick(() => {
                this.$refs.customTree?.setCurrentKey(
                  this.currentCheckNode.cameraCode
                )
              })
            }
            // 将节点添加到treeNodeList中
            this.treeNodeList.push(item)
          }
          // 判断是否有子节点
          if (item?.list?.length) {
            // 递归处理子节点
            tempData.list = _fn(item.list)
          }
          // 将临时数据添加到临时数组中
          _list.push(tempData)
        })
        // 返回临时数组
        return _list
      }
      // 返回递归处理后的数据
      return _fn(data)
    },
    // 点击鸟类声纹
    onItemClick(key) {
      if (key != 'wildlifeCamera') {
        return
      }
      // 切换选中状态
      this.activeKey = this.activeKey === key ? '' : key
      // 同步展开状态
      this.containerIsOpen = !!this.activeKey

      // 如果取消选中，清空当前选中的节点并收起黑框
      if (!this.activeKey) {
        this.currentCheckNode = null
        this.deviceCode = ''
        this.deviceId = ''
        this.deviceName = ''
        this.clearMarker()
        this.markerCluster && this.markerCluster.cleanup()
        this.markerCluster && this.markerCluster.release()
        // 收起黑框
        this.$refs.customTree?.setCurrentKey(null)
        this.expandStatus = false
      }
      this.uptUserMemoryInfoFun()
    },

    // 保存选中状态到用户记忆
    uptUserMemoryInfoFun() {
      uptUserMemoryInfo({
        memoryType: this.deviceMemoryKey,
        memoryValue: this.activeKey ? 'true' : ''
      }).then(() => {
        // 触发相关事件
        this.$emit('treeexpand', this.containerIsOpen)
        this.$globalEventBus.$emit(`${eventPath.commonCompSnapList}__resize`)

        // 如果是选中状态，自动展开第一个设备
        if (
          this.activeKey &&
          this.treeViewData &&
          this.treeViewData.length > 0
        ) {
          const findFirstDevice = (nodes) => {
            for (let node of nodes) {
              if (node.deviceCode) {
                return node
              }
              if (node.list && node.list.length) {
                const found = findFirstDevice(node.list)
                if (found) return found
              }
            }
            return null
          }

          const firstDevice = findFirstDevice(this.treeViewData)
          if (firstDevice) {
            this.$refs.customTree?.setCurrentKey(firstDevice.deviceCode)
            this.nodeClick({
              data: firstDevice,
              checked: true
            })
            // 展开到该节点
            this.$refs.customTree?.expandToNode(firstDevice.deviceCode)
            this.expandStatus = true
          }
        }
      })
    },

    // 收藏回调
    collectCallback(data, fn) {
      console.log('收藏====>', data, fn)
      const isFavor = data.isMonitor === '0'
      let msg = '鸟类声纹收藏成功'
      if (data.isMonitor === '1') {
        msg = '鸟类声纹取消收藏成功'
      }
      this.$set(data, 'isMonitor', data.isMonitor === '0' ? '1' : '0')
      fn && fn(data)
      let objCodeList
      if (data.deviceCode) {
        // 这是个叶子节点（具体的鸟类声纹设备）
        objCodeList = [data.deviceCode]
      } else {
        // 没有deviceCode的是二级分类节点，需要遍历它之下的所有叶子节点一口气平铺提交（顺便设置收藏字段）
        objCodeList = []
        const recursiveFind = (arr) => {
          // 如果arr不存在，则返回
          if (!arr) return
          // 遍历arr数组
          arr.forEach((item) => {
            // 如果isFavor为true，则将item的isMonitor属性设置为'1'，否则设置为'0'
            this.$set(item, 'isMonitor', isFavor ? '1' : '0')
            // 如果item的deviceCode属性存在，则将其添加到objCodeList数组中
            if (item.deviceCode) {
              objCodeList.push(item.deviceCode)
            }
            // 如果item的list属性存在，则递归调用recursiveFind函数
            if (item.list) {
              recursiveFind(item.list)
            }
          })
        }
        // 递归调用recursiveFind函数，传入data的list属性
        recursiveFind(data.list)
      }
      // 调用handleAddOrCancelCollections函数，传入isFavor、data、objCodeList和msg参数
      this.handleAddOrCancelCollections(isFavor, data, objCodeList, msg)
    },
    // 收藏/取消收藏
    handleAddOrCancelCollections(isFavor, data, objCodeList, msg) {
      const params = {
        optType: isFavor ? '1' : '0', // 1收藏 0取消收藏
        collObjType: '3', // 写死
        objCodeList,
        __ctCbAllCode: true
      }
      // 调用addOrCancelCollections方法，传入params参数
      addOrCancelCollections(params).then((res) => {
        // 如果返回的code为200，表示操作成功
        if (res.code === 200) {
          // 弹出成功提示
          newMessage.success(msg)
          // 触发全局事件，传递codeList和isCollect参数
          this.$globalEventBus.$emit(
            `${eventPath.commonCompWildlifeConservationCamera}__collect`,
            {
              codeList: objCodeList,
              isCollect: data.isMonitor
            }
          )
          // 如果是收藏树视图，则调用getTreeView方法
          if (this.isCollectTreeView) {
            this.getTreeView('0', false)
          }
        }
      })
    },
    // 查询统计数据
    // 查询统计信息
    queryStatistic() {
      // 调用查询今日摄像头统计信息的方法
      queryTodayCameraStatistics().then((resp) => {
        // 如果返回的数据存在
        if (resp.data) {
          // 将返回的数据赋值给统计数据
          this.statisticData = resp.data
        }
      })
    },
    // tree 节点过滤规则
    filterNode(value, data) {
      // 初始化状态为true
      let status = true
      // 判断value是否存在且data的name不包含value
      const flag1 = value && !data.name.includes(value)
      // 判断是否为收藏树视图且data的isMonitor不等于1
      const flag2 = this.isCollectTreeView && data.isMonitor !== '1'
      // 如果flag1或flag2为true，则状态为false
      if (flag1 || flag2) {
        status = false
      }
      // 返回状态
      return status
    },
    // 调用图层打点
    showOneMark(longitude, latitude, { deviceCode, deviceId, deviceName }) {
      this.clearMarker()
      const params = {
        type: '14', // 14:鸟类声纹
        code: longitude + ',' + latitude,
        lnglat: [Number(longitude), Number(latitude)],
        zoom: 12,
        payload: {
          singleId: deviceId
        }
      }
      this.cameraMarker = params
      // this.$globalEventBus.$emit(
      //   'common-comp-layers-control__highlight-point',
      //   params
      // )
      this.createMarker(
        { longitude, latitude },
        { deviceCode, deviceId, deviceName }
      )
      this.setZoomAndCenter(longitude, latitude, 12)
    },

    async createMarker(
      { longitude, latitude },
      { deviceCode, deviceId, deviceName }
    ) {
      this.markerCluster && this.markerCluster.cleanup()
      this.markerCluster && this.markerCluster.release()
      this.deviceCode = ''
      this.deviceId = ''
      this.deviceName = ''

      this.markerCluster = new CTMapOl.DataSourceControl.lib.MarkerCluster(
        {
          mapRef: this.mapRef.getMapRef(this.$props.mapId || this.mapId),
          data: [
            {
              id: deviceCode || Math.random().toString(36).slice(3),
              lnglat: [longitude, latitude],
              icon: require('../assets/images/camera-normal.png'),
              clickIcon: require('../assets/images/camera-normal.png'),
              iconSize: [42, 45],
              offset: [21, 23],
              clickBig: false
            }
          ]
        },
        {
          gridSize: 50, // 聚合网格像素大小
          styles: [
            {
              url: require('../assets/images/camera-normal.png'),
              size: [50, 50],
              offset: [25, 25],
              textColor: 'red',
              textSize: 18,
              textOffset: [0, 0]
            }
          ],
          zIndex: 45,
          maxZoom: 17, // 最大展示层级
          onSelectFunc: () => {
            this.popShow = true
            this.$nextTick(() => {
              this.deviceCode = deviceCode
              this.deviceId = deviceId
              this.deviceName = deviceName
              this.mapPopdetailFun(longitude, latitude)
            })
          },
          onUnselectFunc: (mapRef, action, data) => {
            console.log('取消选中')
            this.$globalEventBus.$emit(
              `${eventPath.commonCompWildlifeConservationCamera}__onUnselect`,
              false
            )
          },
          clickClusterIcon: (mapRef, action, data) => {
            console.log('事件')
          }
        }
      )

      this.markerCluster.init()

      this.markerCluster.mount()
    },

    // 设置缩放和中心点
    setZoomAndCenter(lng, lat, zoom) {
      // 调用CTMapOl.ViewControl的common方法，设置地图的缩放和中心点
      CTMapOl.ViewControl?.common?.setZoomAndCenter(
        { mapRef: this.mapRef?.getMapRef(this.mapId) },
        { center: [lng, lat], zoom, duration: 1000, offset: [0, 0] }
      )
    },
    // 节点点击事件
    nodeClick(payload) {
      // 打印节点被点击的信息
      console.log('节点被点击了====>', payload)
      const { data } = payload
      this.nodeData = { ...data }
      // 如果节点没有被选中，则清空当前选中的节点
      if (!data.checked) {
        this.currentCheckNode = null
        this.deviceCode = ''
        this.deviceId = ''
        this.deviceName = ''
        this.clearMarker()
        console.log(11, this.markerCluster)
        if (this.markerCluster) {
          this.markerCluster.cleanup()
          this.markerCluster.release()
        }
        return
      }
      if (data.latitude) {
        this.showOneMark(data.longitude, data.latitude, {
          deviceCode: data.deviceCode || data.cameraCode,
          deviceId: data.deviceId,
          deviceName: data?.deviceName || data.name
        })
        return
      }
      this.getCameraByDevice(data)
    },
    getCameraByDevice(data) {
      // 调用getCameraDetail方法，获取相机详情
      getCameraDetail({
        deviceCode: data.deviceCode || data.cameraCode,
        cameraCode: data.deviceCode || data.cameraCode,
        deviceId: data.deviceId
      }).then((resp) => {
        // 如果获取相机详情成功，则设置当前选中的节点，并显示相机标记
        if (resp.code === 200) {
          this.currentCheckNode = {
            ...(resp.data || {}),
            cameraCode: resp.data?.deviceCode
          }
          console.log(this.currentCheckNode, '当前选中的节点-----')
          this.showOneMark(resp.data.longitude, resp.data.latitude, {
            deviceCode: resp.data?.deviceCode || resp.data.cameraCode,
            deviceId: resp.data?.deviceId,
            deviceName: data?.deviceName || resp.data?.deviceName
          })
        }
      })
    },
    /**
     * 删除打点
     */
    // 清除标记
    clearMarker() {
      // 如果没有标记，则返回
      if (!this.cameraMarker) return
      // 将标记的code设置为null
      this.cameraMarker.code = null
      // 发送事件，通知其他组件高亮显示标记
      this.$globalEventBus.$emit(
        'common-comp-layers-control__highlight-point',
        this.cameraMarker
      )
      // 将标记设置为null
      this.cameraMarker = null
    },
    // 获取记忆
    getConfigMemory() {
      // 定义记忆类型列表
      let memoryTypeList = [this.configMemoryKey]
      // 定义参数
      const params = {
        memoryTypeList
      }
      // 调用接口获取记忆
      getUserMemoryInfo(params).then((res) => {
        console.log(res.data, 'acientWoodNameTree获取记忆成功')
        // 如果返回码为200，并且有记忆值
        if (res.code === 200 && res.data[0]?.memoryValue) {
          // 将记忆值解析为对象
          const memoryValue = JSON.parse(res.data[0].memoryValue)
          // 将记忆值赋值给组件的属性
          this.viewType = memoryValue.viewType
          this.activeKey = memoryValue.activeKey
          this.containerIsOpen = memoryValue.cardFold
          this.expandStatus = memoryValue.treeFoldStatus
        }
      })
    },
    // 设置记忆
    setConfigMemory() {
      // 定义记忆类型
      const memoryType = this.configMemoryKey
      // 定义记忆值
      const memoryValue = {
        viewType: this.viewType,
        activeKey: this.activeKey,
        cardFold: this.containerIsOpen,
        treeFoldStatus: this.expandStatus
      }
      // 定义参数
      const params = {
        memoryType,
        memoryValue: JSON.stringify(memoryValue)
      }
      // 调用接口设置记忆
      uptUserMemoryInfo(params).then((res) => {
        // 如果返回码为200
        if (res.code === 200) {
          console.log(
            'acientWoodNameTree设置记忆成功,记忆key为：',
            this.configMemoryKey
          )
        }
      })
    },
    /**
     * 刷新数据
     */
    onRefresh() {
      this.getTreeView(this.isCollectTreeView ? '0' : '1')
      this.getCardView()
    },
    /**
     * 根据ID搜索节点
     * @param node
     * @param id
     * @returns {null|*}
     */
    // 根据设备编码查找节点，并设置是否监控
    searchNodeById(array, payload) {
      // 遍历数组
      array.forEach((item) => {
        // 如果设备编码匹配
        if (item.deviceCode === payload.code) {
          // 设置是否监控
          this.$set(item, 'isMonitor', payload.isCollect)
        }
        // 如果节点有子节点
        if (item.list && item.list.length > 0) {
          // 递归调用searchNodeById方法
          this.searchNodeById(item.list, payload)
        }
      })
    },
    // 初始化记忆
    _initUserMemoryInfo() {
      const requestMemory = [this.deviceMemoryKey].filter((i) => i)
      if (requestMemory.length <= 0) {
        return
      }

      getUserMemoryInfo({
        memoryTypeList: requestMemory
      }).then((resp) => {
        resp.data.forEach((item) => {
          if (item.memoryType === this.deviceMemoryKey) {
            // 恢复声纹采集设备的选中状态
            this.activeKey = item.memoryValue === 'true' ? 'wildlifeCamera' : ''
            this.containerIsOpen = !!this.activeKey
          }
        })
      })
    }
  },
  components: {
    ResponsiveContainer,
    ListView,
    AreaFilterSort,
    FilterSearchGroup,
    CustomTree,
    BirdDetailPop
  },
  filters: {
    // 过滤颜色
    filterColor(value, key) {
      // 如果key存在且value中包含key
      if (key && value?.indexOf(key) !== -1) {
        // 将value中的key替换为带有颜色的key
        return value.replaceAll(
          key,
          '<font style="color: #F9FF6C">' + key + '</font>'
        )
      }
      // 否则返回value
      return value
    }
  },
  beforeDestroy() {
    this.closeMapPopDetailFun()
    this.markerCluster && this.markerCluster.cleanup()
    this.markerCluster && this.markerCluster.release()
  }
}
</script>

<style scoped lang="scss">
@import '../assets/styles/wildlife-bird-camera';

.wildlife-item {
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  &:hover {
    opacity: 0.8;
  }

  .text {
    position: absolute;
    bottom: 24px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #fff;
  }

  .num {
    position: absolute;
    bottom: 6px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #fff;
  }
}
</style>
