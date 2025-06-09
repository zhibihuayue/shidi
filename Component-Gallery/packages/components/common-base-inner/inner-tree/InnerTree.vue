<template>
  <div class="real-camera-tree">
    <base-virtual-tree
      v-if="!loading"
      class="tree-fixed-first-level"
      ref="treeRef"
      :data="treeData"
      node-key="code"
      :itemSize="32"
      :props="treeProps"
      highlight-current
      :default-expanded-keys="handleExpandedKeys"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :indent="indent"
    >
      <template v-slot:default="{ node, data }">
        <span
          @click="clickTreeNode(data, node)"
          :class="`custom-tree-node add-flag ${
            data.isPlaying ? 'playing' : ''
          } ${data.channelCode ? 'devMargin2' : ''} ${
            data.firstRow ? 'firstNode' : ''
          }`"
          :video-channelCode="data.channelCode"
          :real-video-channelCode="data.code"
        >
          <span class="custom-tree-left" v-c-tip.auto="data.name">
            <!-- 左侧图标 -->
            <em
              v-if="data.deviceCode && !data.channelCode"
              :class="`tree-img iconfont_tools ${
                Number(data.categoryCode) === 2
                  ? 'icon-tongyong_icon_ARshexiangji'
                  : 'icon-tongyong_icon_shexiangji'
              }`"
            ></em>
            <div
              class="tree-name"
              v-c-tip.auto="data.name"
              v-html="
                $options.filters.filterKeywords(data.name, filterKeywords)
              "
            ></div>
            <!-- 在线离线数量 -->
            <div
              class="tree-camera-count"
              v-if="
                !data.channelCode &&
                data.onlineNum !== undefined &&
                data.num !== undefined
              "
            >
              ({{ data.onlineNum }}/{{ data.num }})</div
            >
          </span>
          <span class="custom-tree-right">
            <!-- 第一排显示的按钮 -->
            <span v-if="data.firstRow" class="fast-btn1">
              <em
                v-if="cameraTreeOpen"
                class="iconfont_tools icon-jilianicon menu-wh"
                @click.stop="cameraTreeOpen(!isOpen)"
              ></em>
              <em
                v-if="refreshTreeData"
                class="iconfont_tools icon-shuaxinicon menu-wh"
                @click.stop="refreshTreeData()"
              ></em>
            </span>
            <!-- 右侧操作按钮 -->
            <span v-else class="other-tree-right">
              <!-- 收藏按钮 -->
              <em
                v-if="clickCollect"
                :class="`iconfont_tools ${
                  data.isMonitor == '1'
                    ? 'icon-icon_shoucang_20_s clickCol'
                    : 'icon-icon_shoucang_20_n'
                }`"
                v-c-tip="data.isMonitor == '1' ? '取消收藏' : '收藏'"
                @click.stop="clickCollect(data, node)"
              ></em>
              <!-- 属性按钮 -->
              <template v-if="data.deviceCode">
                <em
                  v-if="showAttrBox"
                  :class="`iconfont_tools  ${
                    data.showAttr
                      ? 'icon-icon_shuxing_20_s clickCol'
                      : 'icon-icon_shuxing_20_n'
                  }`"
                  v-c-tip="'属性'"
                  @click.stop="showAttrBox(data, currentId)"
                ></em>
              </template>
            </span>
          </span>
        </span>
      </template>
    </base-virtual-tree>
    <div v-if="loading" class="loading-datas">
      <em class="el-icon-loading"></em>
      <span>加载中</span>
    </div>
    <!-- 属性弹窗 -->
    <tree-property-dialog
      ref="propertyPopup"
      :detailsData="detailsData"
      :attrData="attrData"
      :currentId="currentId"
      @close="closeAttrBox"
    ></tree-property-dialog>
  </div>
</template>

<script>
import { debounce } from 'lodash-es'
import { dragBind } from '@component-gallery/utils/funCommon/common'
import {
  getTreeData,
  queryDeviceForWE,
  addOrCancelCollections
} from './service/index'
import BaseTreePropertyDialog from '@component-gallery/base-components/base-tree-property-dialog/BaseTreePropertyDialog.vue'
import BaseVirtualTree from '@component-gallery/base-components/base-virtual-tree/BaseVirtualTree.vue'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import TREE_ENUM from '@component-gallery/utils/funCommon/tree/tree-enum'
import eventPath from '@component-gallery/build-event-bus-path'
import { createNameSpace } from '@component-gallery/utils/bem/create'
import '@component-gallery/utils/funCommon/drag/directive.js' // 拖拽弹窗
const bem = createNameSpace('common-comp')

export default {
  name: 'inner-tree',
  directives: {
    drag: {
      bind: (el) => {
        dragBind(el)
      }
    }
  },
  components: {
    [BaseTreePropertyDialog.name]: BaseTreePropertyDialog,
    [BaseVirtualTree.name]: BaseVirtualTree
  },
  props: {
    height: {
      type: Number,
      default: 868
    },
    dragAble: {
      type: Boolean,
      default: true
    },
    cameraTreeOpen: {
      type: Boolean,
      default: true
    },
    refreshTreeData: {
      type: Boolean,
      default: true
    },
    clickCollect: {
      type: Boolean,
      default: true
    },
    showAttrBox: {
      type: Boolean,
      default: true
    },
    filterKeywords: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      params: null,
      currentId: TREE_ENUM.CAMERA, // 当前显示的是那个树的属性弹窗
      showAttrData: null,
      currentSelectFunction: [], // 所有选择的功能
      detailsData: {}, // 属性弹窗数据
      attrData: {}, // 属性弹窗数据
      isOpen: false,
      treeData: [],
      deviceList: [], // 设备列表
      zIndex: 100,
      loading: false,
      treeProps: {
        children: 'list',
        label: 'name'
      },
      openTreeData: [], // 展开的树数据
      showNodes: [], //指定打开某个节点
      typeThemArr: [], // 类型
      sortType: '1', // 排序类型
      indent: 6,
      // 功能列表
      functionList: [
        {
          icon: 'icon-linye_icon_dibugongneng_shexiangji_n',
          name: '摄像机',
          isShowFilterBtn: true, // 是否显示筛选按钮
          detailsFun: queryDeviceForWE, // 详情接口
          id: '1',
          isShowTab: true, //  是否显示‘按标签展示’
          checked: true, // 是否在菜单配置中选择
          sortType: '1', // 排序类型
          isShowCollect: false, // 是否收藏
          currentIsOpenAll: false, // 是否展开
          isOpenAllTree: null, // 是否展开树数据(树组件属性，用于初始化)
          checkNodeCode: null //当前树展示的选中节点
        }
      ]
    }
  },
  created() {
    this.getTreeData()
  },
  filters: {
    filterKeywords(value, key) {
      if (!value) {
        return ''
      }
      if (!key) {
        return value
      }
      return value.replace(
        new RegExp(`(${key})`),
        `<span class="key-word">$1</span>`
      )
    }
  },
  computed: {
    genCommonWrapper() {
      return {
        [bem.b('tree')]: true,
        treeBox: true,
        cameraTreeBox: true,
        zIndex: true
      }
    },
    isShowCollect() {
      return this.functionList.find((item) => item.id == '1').isShowCollect
    },
    handleExpandedKeys() {
      return [...this.openTreeData, ...this.showNodes]
    }
  },
  // 监控data中的数据变化
  watch: {
    filterKeywords(val) {
      this.isOpen = !!val
      this.$refs.treeRef.expandFilter(this.isOpen, val.trim(), (node) => {
        return this.isOpen ? true : node.level > 1
      })
    }
  },
  methods: {
    /**
     * 加载数据
     */
    async getTreeData() {
      this.params = {}
      this.loading = true
      this.treeData = []
      this.params = {
        categoryCodeList: this.typeThemArr.map((item) => Number(item)),
        statusList: [],
        displayMode: this.sortType
      }
      let res = await getTreeData(this.params)
      if (res.code == '200') {
        this.isFirstLevel(res.data)
        this.formatTreeData(res.data)
        let arr = []
        res.data.forEach((_) => {
          arr.push(_.code)
        })
        this.treeData = res.data
        this.loading = false
        this.isOpen = false
        this.openTreeData = arr
      } else {
        throw new Error(res.msg)
      }
    },
    // 树展开收起
    cameraTreeOpen(flag) {
      // 修改 展开状态
      if (!this.$refs.treeRef) {
        return
      }
      this.isOpen = flag
      // 切换 展开/收起 状态
      this.$refs.treeRef.expandFilter(
        this.isOpen,
        this.filterKeywords,
        (node) => {
          return this.isOpen ? true : node.level > 1
        }
      )
    },
    // 刷新树数据
    refreshTreeData() {
      this.getTreeData()
    },
    clickCollect(data) {
      let nowObj = this.functionList[0]
      let optType
      if (data.isMonitor && (data.isMonitor == '0' || data.isMonitor == '2')) {
        optType = '1' // 添加收藏
      } else {
        optType = '2' // 取消收藏
      }
      let _obj = {
        1: 5,
        2: 8,
        3: 7,
        4: 11,
        5: 10
      }
      let _id = this.currentId
      let params = {
        optType
      }
      let isRequestDevice = false //铁塔视角 设备也是用客户视角的接口
      if (data.deviceCode) {
        if (data.channelCode) {
          params.collObjType = '6'
          params.collObjCode = [data.channelCode]
        } else {
          params.collObjType = _obj[_id] + ''
          params.collObjCode = [data.deviceCode]
          isRequestDevice = true
        }
      } else {
        this.getAllDevice([data], true)
        params.collObjType = _obj[_id] + ''
        params.collObjCode = this.deviceList.map((item) => item.deviceCode)
        isRequestDevice = true
      }
      if (params.collObjCode.length === 0) {
        CommonMessage.warning('当前节点下无摄像机，无法收藏')
        return
      }
      addOrCancelCollections(params).then((res) => {
        if (res.code === 200) {
          if (nowObj.isShowCollect) {
            this.getTreeData(_id)
          } else {
            this.collectBack([data], optType, _id, true)
          }
          // 联动详情弹窗
          this.$globalEventBus.$emit(
            `${eventPath.commonCompTree}__tree-click-collection-state`,
            { params, isCollect: optType }
          )
          this.collectTips(params.collObjType, optType)
        } else {
          CommonMessage.warning(res)
        }
      })
    },
    // 收藏提示
    collectTips(collObjType, optType) {
      CommonMessage.success(
        optType === '1' ? '摄像机收藏成功' : '摄像机取消收藏成功'
      )
    },
    /* 收藏回填 */
    collectBack(tree, optType, _id, flag) {
      tree.forEach((item) => {
        this.collectBackForChildren(item, optType, _id, flag)
      })
    },
    collectBackForChildren(item, optType, _id, flag) {
      item.isMonitor = optType
      // 设置子节点
      if (item.list && item.list.length) {
        item.list.forEach((it) => {
          this.collectBackForChildren(it, optType, _id)
        })
      }
      // 设置父节点
      this.collectBackForParents(item, optType, _id, flag)
    },
    collectBackForParents(item, optType, _id, flag) {
      setTimeout(() => this.setTimeFun(item, optType, _id, flag))
    },

    setTimeFun(item, optType, _id, flag){
      const node = this.$refs[`monitorTree${_id}`].getNode(item.code)
      if (!node) {
        return false
      }
      const parentNode = node.parent
      if ((item.list || []).find((it) => it.isMonitor !== optType)) {
        item.isMonitor = '0'
      } else {
        item.isMonitor = optType
        if (flag && item.channelCode) {
          let collCount = 0
          parentNode?.data?.list?.map((child) => {
            if (Number(child.isMonitor) === 1) {
              collCount++
            }
          })
          let deviceCodeArr = []
          deviceCodeArr.push(item.deviceCode)
          let paramsColl = {
            collObjCode: deviceCodeArr,
            collObjType: item.isMonitor == 1 ? '1' : '2'
          }
          if (parentNode.data.list.length === collCount) {
            this.$globalEventBus.$emit(
              `${eventPath.commonCompTree}__tree-click-collection-state`,
              { params: paramsColl, isCollect: '1' }
            )
          } else {
            this.$globalEventBus.$emit(
              `${eventPath.commonCompTree}__tree-click-collection-state`,
              { params: paramsColl, isCollect: '2' }
            )
          }
        }
      }
      if (parentNode) {
        this.$nextTick(() => {
          this.collectBackForParents(parentNode.data, optType, _id)
        })
      }
    },

    // 获取当前节点的全部设备
    getAllDevice(tree, init) {
      if (init) {
        this.deviceList = []
      }
      for (let i in tree) {
        if (tree[i].deviceCode && !tree[i].channelCode) {
          this.deviceList.push(tree[i])
        }
        if (tree[i].list && tree[i].list.length > 0) {
          this.getAllDevice(tree[i].list)
        }
      }
    },
    /**
     * 点击tree节点
     */
    clickTreeNode: debounce(function (data, node) {
      console.log(data, node)
      // TODO: 点击tree节点执行事件
    }, 300),
    // 显示属性弹窗
    showAttrBox(data, _id) {
      console.log('🚀 ~ showAttrBox ~ data:', data)
      this.currentId = _id
      let _fn = (flag) => {
        if (flag) {
          if (!this.$refs.propertyPopup.isShowAttrBox) {
            // 获取详情数据
            let _params = {
              deviceCode: data.deviceCode
            }
            queryDeviceForWE(_params).then((res) => {
              if (res.code == 200) {
                if (data.channelCode) {
                  res.data.channelCode = data.channelCode
                  res.data.channelName = data.channelName
                }
                this.setAttrData(res.data, _id)
              }
            })
          }
        } else {
          this.$refs.propertyPopup.isShowAttrBox = false
          this.detailsData = {}
          this.attrData = {}
        }
        this.$set(this.showAttrData, 'showAttr', flag)
      }
      if (this.showAttrData?.code) {
        // 关闭之前的
        _fn(false)
        // 如果不是同一个设备，则打开新的
        this.$nextTick(() => {
          if (this.showAttrData != data) {
            this.showAttrData = data
            _fn(true)
          } else {
            this.showAttrData = {}
          }
        })
      } else {
        this.showAttrData = data
        _fn(true)
      }
    },
    // 设置属性弹窗显示数据字段
    setAttrData(data, _id) {
      let _obj = {
        devName: {
          text: '摄像机名称',
          isShowCopy: true
        }
      }
      // 定义一个formatter，默认原样输出
      const noop = (input) => input
      Object.keys(_obj).forEach((k) => {
        if (!_obj[k].formatter) {
          _obj[k].formatter = noop
        }
      })
      this.detailsData = data
      this.$refs.propertyPopup.isShowAttrBox = true
      this.attrData = _obj
    },
    closeAttrBox() {
      // TODO: 关闭属性框
      this.$set(this.showAttrData, 'showAttr', false)
      this.$refs.propertyPopup.isShowAttrBox = false
    },
    // 是否第一行、第一级
    isFirstLevel(tree) {
      if (tree.length) {
        tree[0].firstRow = true
      }
    },
    formatTreeData(treeData) {
      if (treeData != null && treeData.length > 0) {
        treeData.forEach((item) => {
          if (item.deviceAlias) {
            item.name = item.deviceAlias
          }
          if (item.list && item.list.length > 0) {
            this.formatTreeData(item.list)
          }
        })
      }
    },
    // 指定打开某个节点
    doShowNodes(key) {
      if (Array.isArray(key)) {
        this.showNodes.push(...key)
      } else {
        this.showNodes.push(key)
      }
      this.$nextTick(() => {
        this.showNodes = []
      })
    },
    /**
     * 树筛选
     */
    filterNode(value, data, node) {
      if (!value) return true
      let _arr = [] //这里使用数组存储 只是为了存储值。
      getReturnNode(node, _arr, value)
      let result = false
      _arr.forEach((item) => {
        result = result || item
      })
      return result

      function getReturnNode(node_, arr_, value_) {
        let isPass =
          node_.data && node_.data.name && node_.data.name.indexOf(value_) !== -1
        isPass ? arr_.push(isPass) : ''
        if (!isPass && node_.level != 1 && node_.parent) {
          getReturnNode(node_.parent, arr_, value_)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@component-gallery/assets/font/iconfont.css';
@import '~@component-gallery/theme-chalk/src/tree';

.common-comp {
  ::v-deep .el-collapse-transition-enter-active,
  ::v-deep .el-collapse-transition-leave-active {
    transition: none;
  }
}
</style>

<style lang="scss">
@import '~@component-gallery/theme-chalk/src/c-tip';
</style>
