<!-- 古树名木弹窗 -->
<template>
  <div
    v-show="dataIsReady"
    class="detail_window_pop_vuecomp"
    id="old-tree-detail"
  >
    <absolute-container
      @close="closeAncientTreeGroupPop"
      v-if="treeList.length > 1"
      class="container"
      :width="230"
      :bottom="54"
      :left="-115"
    >
      <div class="tree-list">
        <el-scrollbar class="scroll-bar">
          <div
            class="tree-item"
            v-for="item in treeList"
            @click="getOldTreeInfo(item.id, item.treeType)"
            :key="item.id"
          >
            <div class="left">
              <i :class="`iconfont_tools ${item.icon}`"></i>
              <p
                class="label"
                :c-tip="item.label"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ item.label }}</p
              >
            </div>
            <p class="type">{{ item.type }}</p>
          </div>
        </el-scrollbar>
      </div>
    </absolute-container>
    <absolute-container
      @close="closeInfoPop"
      v-if="treeList.length === 1 || showOldInfoPop"
      left-title
      title=" "
      :width="368"
      :left="treeList.length > 1 ? 127 : -184"
      :bottom="54"
    >
      <template v-slot:title>
        <span class="detail_window_pop_header">
          <div class="trap-title title">
            <i
              :c-tip="oldTreeInfo.title"
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              class="font-style"
            >
              {{ oldTreeInfo.title }}
            </i>
          </div>
          <div class="trap-title-right right">
            <p
              class="tips active"
              :style="{ background: getTreeType(oldTreeInfo).background }"
              >{{ getTreeType(oldTreeInfo).type }}</p
            >
            <i
              v-if="oldTreeInfo.collect == '0'"
              @click="setCollect('1')"
              class="icon iconfont_tools icon-tongyong_icon_shoucang_20_n"
            ></i>
            <i
              @click="setCollect('0')"
              v-else
              class="icon active iconfont_tools icon-tongyong_icon_shoucang_20_s"
            ></i>
          </div>
        </span>
      </template>
      <div class="tab-header">
        <div class="tab-item" v-for="(item, index) in tabList" :key="item">
          <div
            class="tab-item-title"
            :class="index === activeIndex && 'tab_active'"
            @click="tabClick(index)"
          >
            <span class="tab-item-title-text">{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="content tab-content">
        <div class="container_pop swiper-wrapper" v-show="activeIndex === 0">
          <swiper-medias :fileList="urlList" />
          <div class="line_item" v-for="item in dictData[0]" :key="item.key">
            <div class="item_name">{{ item.label }}：</div>
            <div class="item_value">
              <span
                class="item_value_inner"
                :c-tip="item.value"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ item.value }}</span
              >
            </div>
          </div>
        </div>
        <div class="container_pop alias" v-show="activeIndex === 1">
          <el-scrollbar class="scrollbar">
            <div
              :class="['line_item', item.isWrap && 'is_wrap']"
              v-for="item in dictData[1]"
              :key="item.key"
            >
              <div class="item_name">{{ item.label }}：</div>
              <div class="item_value">
                <span
                  class="item_value_inner"
                  :c-tip="item.value"
                  c-tip-placement="top"
                  c-tip-class="c-tip-normal"
                  >{{ item.value }}</span
                >
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="container_pop growth" v-show="activeIndex === 2">
          <el-scrollbar class="scrollbar">
            <div
              :class="[
                'line_item',
                item.isSingle && 'is_single',
                item.isWrap && 'is_wrap'
              ]"
              v-for="item in dictData[2]"
              :key="item.key"
            >
              <div class="item_name">{{ item.label }}：</div>
              <div class="item_value">
                <span
                  class="item_value_inner"
                  :c-tip="item.value"
                  c-tip-placement="top"
                  c-tip-class="c-tip-normal"
                  >{{ item.value || '-' }}</span
                >
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="footer">
          <div class="f_cont">
            <i
              v-for="item in footerIcons"
              :key="item.name"
              @click="handleFooterIconClick(item)"
              :title="item.title"
              :class="
                item.isActive
                  ? `iconfont_tools active ${item.actIcon}`
                  : `iconfont_tools ${item.icon}`
              "
            ></i>
          </div>
        </div>
      </div>
    </absolute-container>
  </div>
</template>

<script>
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import SwiperMedias from '../swiper-medias/SwiperMedias.vue'
import newMessage from '../../funCommon/message/common-message'

import eventPath from '@component-gallery/build-event-bus-path'
import dict from './service/dict'
import {
  queryById,
  getListByCoordinate,
  getMultipleDicts,
  collect
} from './service/index'
import CTMapOl from '@ct/ct_map_ol'
import { openKanzheliFixedPoint } from '../../mapCommon/kanzheli'
import { setupCTips } from '../../funCommon/c-tip'
export default {
  name: 'wc-old-tree-detail-pop',
  props: {
    propsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      kzlVideoState: false,
      kzlVideoDestroyFun: null,
      dataIsReady: false,
      detailPopup: null,
      dictData: JSON.parse(JSON.stringify(dict)),
      oldTreeInfo: {
        collect: '',
        title: '',
        treeSpecies: '',
        treeCode: '',
        imgUrl: '',
        treeGrade: '',
        longitude: '',
        latitude: '',
        soilCompactness: '',
        growthEnvironment: '',
        treeGrowth: '',
        deviceCode: '',
        treeAddress: '',
        id: ''
      },
      treeList: [],
      showOldInfoPop: false,
      activeIndex: 0,
      tabList: ['图片', '基本信息', '生长状况'],
      treeType: '0', // 0 为古树 1为名木
      urlList: [
        {
          fileUrl: require('./assets/tree-detault.png'),
          type: '1'
        }
      ],
      dictOptions: null,
      footerIcons: [
        {
          title: '看这里',
          icon: 'icon-icon_kanzheli_30_n',
          actIcon: 'icon-icon_kanzheli_30_s',
          name: 'kzl',
          isActive: false
        },
        {
          title: '周边分析',
          icon: 'icon-icon_zhoubianfenxi_30_n',
          actIcon: 'icon-icon_zhoubianfenxi_30_s',
          name: 'zbfx',
          isActive: false
        },
        {
          title: '到这里',
          icon: 'icon-icon_daozheli_30_n',
          actIcon: 'icon-icon_daozheli_30_s',
          name: 'dzl',
          isActive: false
        },
        {
          title: '实时喊话',
          icon: 'icon-tongyong_icon_hanhua_n_30',
          actIcon: 'icon-tongyong_icon_hanhua_s_30',
          name: 'sshh',
          isActive: false
        }
      ]
    }
  },
  components: {
    AbsoluteContainer,
    SwiperMedias
  },
  methods: {
    initEvent() {
      this.$globalEventBus.$on(
        `${eventPath.commonInnerUtils}__camera_pop_footer_active`
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompAcientWoodNameTree}_set-collect`,
        (payload) => {
          this.oldTreeInfo.collect = payload.collect
        }
      )
      this.$globalEventBus.$on(
        `${eventPath.commonCompAroundAnalysis}__close`,
        () => {
          // 关闭周边分析
          this.footerIcons.forEach((item) => {
            if (item.name === 'zbfx') {
              this.$set(item, 'isActive', false)
            }
          })
        }
      )
      // 关闭到这里
      this.$globalEventBus.$on(
        `${eventPath.commonCompSearchMap}__close-navigation`,
        (data) => {
          if (data.close) {
            console.log('触发到这里关闭')
            this.footerIcons.forEach((item) => {
              if (item.name === 'dzl') {
                this.$set(item, 'isActive', false)
              }
            })
            this.$globalEventBus.$emit(
              `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
              {
                layerId: '1',
                status: false
              }
            )
          }
        }
      )
    },
    removeOverlay() {
      const mapRef_ = this.propsData.mapRef.getMapRef(this.propsData.mapId)
      if (this.detailPopup) {
        CTMapOl.OverlayControl.common.removeOverlay({
          mapRef: mapRef_,
          overlayCollection: this.detailPopup
        })
        this.detailPopup = null
      }
    },
    async mountMapOverlay(position) {
      // 弹窗图层overlay
      if (this.detailPopup) {
        this.removeOverlay()
      }
      const mapRef_ = this.propsData.mapRef.getMapRef(this.propsData.mapId)
      const spotPopup = await CTMapOl.OverlayControl.common.addOverlay(
        {
          mapRef: mapRef_,
          coord: position,
          domid: this.propsData.domId
        },
        { positioning: 'top-left', offset: [0, 0] }
      )
      console.log('spotPopup', spotPopup)
      this.detailPopup = spotPopup
      this.dataIsReady = true
    },
    /**
     * 获取古树名木信息
     */
    async getOldTreeInfo(id, treeType) {
      if (treeType) this.treeType = treeType
      this.activeIndex = 0
      const params = { id }
      const result = await queryById(params, this.treeType)
      if (result.code === 200) {
        this.showOldInfoPop = true
        this.oldTreeInfo = result.data
        this.oldTreeInfo.title =
          this.oldTreeInfo.treeSpecies + this.oldTreeInfo.treeCode
        if (this.oldTreeInfo?.imgUrl) {
          const urls = this.oldTreeInfo?.imgUrl
            .split(',')
            .filter((item) => item)
          this.urlList = urls.map((item) => ({ fileUrl: item }))
        }

        // 处理生长情况数据
        this.handleGroupData()
        this.fieldConversions()
      }
    },
    handleGroupData() {
      if (this.oldTreeInfo.treeGrade != '0' && this.oldTreeInfo.treeGrade) {
        let gArr = JSON.parse(JSON.stringify(dict[2]))
        gArr = gArr.filter((item) => {
          console.log(item.key, 'item')
          return item.key != 'planter' && item.key != 'plantingTime'
        })
        console.log(gArr, 'gArr')
        this.dictData[2] = gArr
      }
    },
    /**
     * 字段转换
     */
    fieldConversions() {
      this.tabList.map((tabName, index) => {
        this.dictData[index] = this.dictData[index].map((item) => {
          item.value = this.oldTreeInfo[item.key]
            ? this.oldTreeInfo[item.key] + item.unit
            : '-'
          if (item.key === 'latitudeAndLongitude') {
            item.value = `${this.oldTreeInfo.longitude},${this.oldTreeInfo.latitude}`
          }
          if (item.key === 'soilCompactness') {
            item.value = this.format(
              'forestry_ancient_famous_compactness',
              this.oldTreeInfo.soilCompactness
            )
          }
          if (item.key === 'growthEnvironment') {
            item.value = this.format(
              'forestry_ancient_famous_environment',
              this.oldTreeInfo.growthEnvironment
            )
          }
          if (item.key === 'treeGrowth') {
            item.value = this.format(
              'forestry_ancient_famous_growth',
              this.oldTreeInfo.treeGrowth
            )
          }
          return item
        })
      })
    },
    /**
     * 根据经纬度获取树id list
     */
    async getTreeIdList() {
      const params = {
        latitude: this.propsData.latitude,
        longitude: this.propsData.longitude,
        treeGrade: this.propsData.treeGrade
      }
      const res = await getListByCoordinate(params)
      if (res.code === 200) {
        this.treeList = res.data.map((item) => {
          const { icon, type, treeType } = this.getTreeType(item)
          return {
            icon,
            label: item.treeSpecies + item.treeCode,
            type,
            id: item.id,
            treeType
          }
        })
        if (this.treeList?.length > 1) {
          this.dataIsReady = true
        }
        if (this.treeList.length === 1) {
          this.getOldTreeInfo(this.treeList[0].id, this.treeList[0].treeType)
        }
      }
    },
    /**
     * 获取展示字段label
     * @param tree
     * @returns {{icon: string, type: string}}
     */
    getTreeType(tree) {
      switch (tree.treeGrade) {
        case '1':
          return {
            icon: 'icon-linye_icon_yijigushu',
            type: '一级古树',
            background: 'linear-gradient( 90deg, #15BD94 0%, #00A179 100%)',
            treeType: '0'
          }
        case '2':
          return {
            icon: 'icon-linye_icon_erjigushu',
            type: '二级古树',
            background: 'linear-gradient( 90deg, #F56C6C 0%, #DA2727 100%)',
            treeType: '0'
          }
        case '3':
          return {
            icon: 'icon-linye_icon_sanjigushu',
            type: '三级古树',
            background: 'linear-gradient( 90deg, #52A1E5 0%, #1F7CCC 100%)',
            treeType: '0'
          }
        default:
          return {
            icon: 'icon-linye_icon_mingshu',
            type: '名木',
            background: 'linear-gradient( 135deg, #FFA43C 0%, #FF8D0B 100%)',
            treeType: '1'
          }
      }
    },
    /**
     * 关闭详情弹窗
     */
    closeInfoPop() {
      this.showOldInfoPop = false
      this.oldTreeInfo = {}
      if (this.treeList.length <= 1) {
        this.closeAncientTreeGroupPop()
      }
    },
    /**
     * tab点击回调
     */
    tabClick(index) {
      this.activeIndex = index
    },
    /**
     * 获取字典数据
     * @returns {Promise<void>}
     */
    async getDicts() {
      const res = await getMultipleDicts([
        'forestry_ancient_famous_compactness',
        'forestry_ancient_famous_growth',
        'forestry_ancient_famous_environment'
      ])
      if (res.code === 200) {
        this.dictOptions = res.data
      }
    },
    /**
     * 编码格式化文字
     */
    format(key, value) {
      if (!this.dictOptions) {
        return value
      }
      let label = value
      this.dictOptions[key].map((item) => {
        if (item.dictValue === value) {
          label = item.dictLabel
        }
      })
      return label
    },
    /**
     *  底部功能区图标点击
     */
    handleFooterIconClick(item) {
      console.log('底部icon点击', item)
      let zIndex = 100
      let lng = this.propsData?.longitude
      let lat = this.propsData?.latitude
      const mapRefInstance = this.propsData.mapRef.getMapRef(
        this.propsData.mapId
      ).mapInstance
      switch (item.name) {
        case 'kzl':
          item.isActive = !item.isActive
          if (!this.kzlVideoState) {
            this.kzlVideoState = true
            this.kzlVideoDestroyFun = openKanzheliFixedPoint(
              this,
              mapRefInstance,
              { lng, lat }
            )
          } else {
            this.kzlVideoState = false
            typeof this.kzlVideoDestroyFun === 'function' &&
              this.kzlVideoDestroyFun()
            newMessage.success('看这里功能已关闭')
          }
          break
        case 'zbfx':
          item.isActive = !item.isActive
          if (item.isActive) {
            zIndex = 201
          }
          this.$globalEventBus.$emit(
            `${eventPath.commonCompAroundAnalysis}__visible-change`,
            {
              visible: item.isActive,
              zIndex,
              deviceInfo: {
                type: '1', // '1' 点 默认,'2': 线,'3': 面
                longitude: +this.oldTreeInfo.longitude,
                latitude: +this.oldTreeInfo.latitude,
                deviceCode: this.oldTreeInfo.deviceCode
              }
            }
          )
          break
        case 'dzl':
          item.isActive = !item.isActive
          console.log('item===>到这里', item)
          this.$globalEventBus.$emit(
            `${eventPath.commonCompSearchMap}__set-navigation`,
            {
              open: item.isActive,
              endPoint: {
                lng: +this.oldTreeInfo.longitude,
                lat: +this.oldTreeInfo.latitude,
                alias: this.oldTreeInfo.treeAddress
              }
            }
          )
          this.$globalEventBus.$emit(
            `${eventPath.commonCompLayersControl}__disable-marker-un_select`,
            {
              layerId: '1',
              status: item.isActive
            }
          )
          break
        case 'sshh':
          item.isActive = !item.isActive
          this.$globalEventBus.$emit(
            `${eventPath.commonCompFooter}__click-menu`,
            { id: 5, checked: item.isActive }
          )
          break
      }
    },
    /**
     * 销毁当前弹窗并重置
     */
    closeAncientTreeGroupPop() {
      this.dataIsReady = false
      // 清除弹窗
      this.removeOverlay()
      console.log('触发事件11')
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAcientWoodNameTree}__close-pop`
      )
      this.propsData.closeCallback && this.propsData.closeCallback()
      // 关闭所有按钮功能
      this.footerIcons.forEach((item) => {
        if (item.isActive) {
          this.handleFooterIconClick(item)
        }
      })
    },
    /**
     * 设置收藏状态
     * @param type String 1 收藏 0 取消收藏
     */
    setCollect(type) {
      const params = {
        collectInfoList: [
          {
            dataId: this.oldTreeInfo.id,
            type: this.treeType === '0' ? '5' : '6' // 古树为5，名木为6
          }
        ],
        flag: type
      }
      collect(params).then((res) => {
        if (res.code === 200) {
          this.$set(this.oldTreeInfo, 'collect', type)
          newMessage.success(
            type === '1' ? '古树名木收藏成功' : '古树名木取消收藏成功'
          )
          this.$globalEventBus.$emit(
            `${eventPath.commonCompAcientWoodNameTree}_collect`,
            {
              id: this.oldTreeInfo.id,
              collect: type
            }
          )
        }
      })
    }
  },
  async mounted() {
    this.initEvent()
    this.mountMapOverlay([this.propsData.longitude, this.propsData.latitude])
    await this.getDicts()
    if (this.propsData.id) {
      const type = this.getTreeType({ treeGrade: this.propsData.treeGrade })
      this.getOldTreeInfo(this.propsData.id, type.treeType)
    } else {
      this.getTreeIdList()
    }
    setupCTips()
  },
  beforeDestroy() {
    this.removeOverlay()
  }
}
</script>
<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/base-pop-overlay';
::v-deep .container {
  .previous-vacancies {
    max-height: px-to-rem(160);
  }
  .el-scrollbar__wrap {
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
#old-tree-detail {
  ::v-deep .innercomp-abcontainer {
    bottom: 36px !important;
  }
}

[data-theme='theme-aquamarine'] #old-tree-detail {
  ::v-deep .innercomp-abcontainer-header.highlight-title.left-title::before {
    width: 100% !important;
    left: 0 !important;
    transform: unset !important;
  }
  &.detail_window_pop_vuecomp {
    ::v-deep .innercomp-abcontainer-header {
      padding-left: 0 !important;
    }
    ::v-deep .innercomp-abcontainer-header__title {
      padding-left: px-to-rem(15);
    }
    ::v-deep .detail_window_pop_header {
      padding-left: 0 !important;
      &::before {
        left: px-to-rem(12);
      }
      .trap-title {
        padding: 0 px-to-rem(15);
      }
    }
  }
}
.detail_window_pop_vuecomp {
  .detail_window_pop_header {
    &::before {
      left: 0;
    }
  }

  .tab-content {
    padding: px-to-rem(9) 0 px-to-rem(0) px-to-rem(12);
  }
}

.tree-list {
  width: px-to-rem(230);

  .scroll-bar {
    width: 100%;
    height: 100%;

    ::v-deep .el-scrollbar__wrap {
      max-height: px-to-rem(160);
    }
  }

  .tree-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 px-to-rem(14) 0 px-to-rem(6);
    width: 100%;
    height: px-to-rem(32);
    line-height: px-to-rem(32);
    cursor: pointer;

    &:hover {
      background: rgb(13 201 133 / 40%);
    }

    .left {
      display: flex;
      align-items: center;
      overflow: hidden;
      margin-right: px-to-rem(6);
    }

    .label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .type {
      min-width: fit-content;
    }
  }

  .type,
  .label {
    color: #fff;
    font-size: px-to-rem(14);
    margin-left: px-to-rem(6);
  }
}

#old-tree-detail .container_pop {
  height: px-to-rem(278);

  &.swiper-wrapper {
    padding: 0 px-to-rem(12) 0 0;
  }

  .scrollbar {
    width: 100%;
    height: 100%;

    ::v-deep .el-scrollbar__wrap {
      overflow: scroll;
    }
  }

  .is_wrap {
    align-items: start;

    .item_value_inner {
      overflow: unset;
      text-overflow: unset;
      white-space: normal;
      line-height: px-to-rem(26);
    }
  }
}

.growth {
  ::v-deep .el-scrollbar__view {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .line_item {
    width: 50%;
  }

  .is_single {
    width: 100%;
  }
}

::v-deep .swiper-medias {
  margin-bottom: px-to-rem(9);
}

.font-style {
  font-style: normal;
  font-weight: 600;
}

.detail_window_pop_vuecomp {
  .alias,
  .swiper-wrapper {
    .line_item .item_name {
      min-width: px-to-rem(55);
    }
  }

  .growth {
    .line_item:nth-child(2n + 1) {
      .item_name {
        min-width: px-to-rem(65);
      }
    }
  }
}
</style>
