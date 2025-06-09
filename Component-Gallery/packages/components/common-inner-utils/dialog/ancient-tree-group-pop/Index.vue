<!-- 古树群弹窗 -->
<template>
  <div
    v-show="dataIsReady"
    class="detail_window_pop_vuecomp"
    id="ancient-tree-group-pop"
  >
    <absolute-container
      @close="closeAncientTreeGroupPop"
      class="container"
      v-if="treeList.length > 1"
      :width="230"
      :bottom="54"
      :left="-115"
    >
      <div class="tree-list">
        <el-scrollbar class="scroll-bar">
          <div
            class="tree-item"
            v-for="item in treeList"
            @click="getancientTreeGroupInfo(item.id)"
            :key="item.id"
          >
            <div class="left">
              <i class="iconfont icon-linye_icon_gushuqun"></i>
              <p
                class="label"
                :c-tip="item.label + item?.basicGroupCode"
                c-tip-placement="top"
                c-tip-class="c-tip-normal"
                >{{ item.label + item?.basicGroupCode }}</p
              >
            </div>
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
              :c-tip="
                ancientTreeGroupInfo?.basicInfo?.basicTreeCategory +
                ancientTreeGroupInfo?.basicInfo?.basicGroupCode
              "
              c-tip-placement="top"
              c-tip-class="c-tip-normal"
              class="tree-name"
            >
              {{
                ancientTreeGroupInfo?.basicInfo?.basicTreeCategory +
                ancientTreeGroupInfo?.basicInfo?.basicGroupCode
              }}
            </i>
          </div>
          <div class="trap-title-right right">
            <p
              class="tips active"
              style="
                background: linear-gradient(90deg, #15bd94 0%, #00a179 100%);
              "
              >古树群</p
            >
            <i
              v-if="ancientTreeGroupInfo.collect == '0'"
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
        <div class="container_pop" v-show="activeIndex === 1">
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
        <div class="container_pop stewardship-info" v-show="activeIndex === 2">
          <el-scrollbar class="scrollbar">
            <div
              :class="['line_item', item.isWrap && 'is_wrap']"
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
                  >{{ item.value }}</span
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
import newMessage from '../../funCommon/message/message'
import eventPath from '@component-gallery/build-event-bus-path'
import dict from './service/dict'
import { queryDetailById, getListByCoordinate, collect } from './service/index'
import CTMapOl from '@ct/ct_map_ol'
import { openKanzheliFixedPoint } from '../../mapCommon/kanzheli'
import { setupCTips } from '../../funCommon/c-tip'
export default {
  name: 'ancient-tree-group-pop',
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
      dictData: dict,
      ancientTreeGroupInfo: {
        collect: '',
        manageInfo: null,
        positionInfo: null,
        basicInfo: null,
        deviceCode: ''
      },
      treeList: [],
      showOldInfoPop: false,
      activeIndex: 0,
      tabList: ['图片', '基本信息', '管护信息'],
      urlList: [
        {
          fileUrl: require('./assets/tree-detault.png'),
          type: '1'
        }
      ],
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
          this.ancientTreeGroupInfo.collect = payload.collect
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
        `common-comp-search-map__close-navigation`,
        (data) => {
          if (data.close) {
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
    async getancientTreeGroupInfo(id) {
      this.activeIndex = 0
      const params = { id }
      console.log(params, '=============params')
      const result = await queryDetailById(params)
      if (result.code === 200) {
        this.showOldInfoPop = true
        this.ancientTreeGroupInfo = result.data
        if (this.ancientTreeGroupInfo?.manageInfo?.manageImgUrl) {
          const urls = this.ancientTreeGroupInfo?.manageInfo?.manageImgUrl
          this.urlList = urls.map((item) => ({ fileUrl: item }))
        }
        this.fieldConversions()
      }
    },
    /**
     * 字段转换
     */
    fieldConversions() {
      const { positionInfo, basicInfo, manageInfo } = this.ancientTreeGroupInfo
      this.tabList.map((tabName, index) => {
        this.dictData[index] = this.dictData[index].map((item) => {
          // index为0，表示tab页的第一项（图片），此时取 positionInfo 中的字段
          if (index === 0) {
            item.value = positionInfo[item.key]
            if (item.key === 'latitudeAndLongitude') {
              item.value = `${positionInfo.positionLongitude},${positionInfo.positionAltitude}`
            }
          }
          // index为 1，表示tab页的第二项（基本信息），此时取 basicInfo 中的字段
          if (index === 1) {
            item.value = basicInfo[item.key]
              ? basicInfo[item.key] + item.unit
              : '-'
          }
          // index为 2，表示tab页的第三项（管护信息），此时取 manageInfo 中的字段
          if (index === 2) {
            item.value = manageInfo[item.key]
              ? manageInfo[item.key] + item.unit
              : '-'
            if (item.key === 'manageTargetProtectCategory') {
              item.value = (manageInfo?.manageTargetProtectCategory || [])
                .map((item) => {
                  // 科（division）、属（belong）
                  return `${item.division}、${item.belong}`
                })
                .join('；')
            }
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
        longitude: this.propsData.longitude
      }
      const res = await getListByCoordinate(params)
      if (res.code === 200) {
        this.treeList = res.data.map((item) => {
          return {
            label: item.basicInfo.basicTreeCategory,
            id: item.basicInfo.id,
            basicGroupCode: item?.basicInfo?.basicGroupCode
          }
        })
        if (this.treeList?.length > 1) {
          this.dataIsReady = true
        }
        if (this.treeList.length === 1) {
          await this.getancientTreeGroupInfo(this.treeList[0].id)
        }
        console.log(res.data, 'res.data')
      }
    },
    /**
     * 关闭详情弹窗
     */
    closeInfoPop() {
      this.showOldInfoPop = false
      this.ancientTreeGroupInfo = {}
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
     *  底部功能区图标点击
     */
    handleFooterIconClick(item) {
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
                longitude: +this.propsData.longitude,
                latitude: +this.propsData.latitude,
                deviceCode: this.ancientTreeGroupInfo.deviceCode
              }
            }
          )
          break
        case 'dzl':
          item.isActive = !item.isActive
          this.$globalEventBus.$emit(
            `${eventPath.commonCompSearchMap}__set-navigation`,
            {
              open: item.isActive,
              endPoint: {
                lng: +this.propsData.longitude,
                lat: +this.propsData.latitude,
                alias: this.ancientTreeGroupInfo.positionInfo.positionAddress
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
      console.log('触发事件22')
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAcientWoodNameTree}__close-pop`
      )
      this.propsData.closeCallback && this.propsData.closeCallback()
      this.$globalEventBus.$emit(
        `${eventPath.commonCompAcientWoodNameTree}__close-range`
      )
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
            dataId: this.ancientTreeGroupInfo.basicInfo.id,
            type: '7'
          }
        ],
        flag: type
      }
      collect(params).then((res) => {
        if (res.code === 200) {
          this.$set(this.ancientTreeGroupInfo, 'collect', type)
          newMessage.success(
            type === '1' ? '古树群收藏成功' : '古树群取消收藏成功'
          )
          this.$globalEventBus.$emit(
            `${eventPath.commonCompAcientWoodNameTree}_collect`,
            {
              id: String(this.ancientTreeGroupInfo.basicInfo.id),
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
    // 如果直接传入了id，则不再调用list接口，直接开启详情弹窗
    if (this.propsData.id) {
      await this.getancientTreeGroupInfo(this.propsData.id)
    } else {
      await this.getTreeIdList()
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
#ancient-tree-group-pop {
  ::v-deep .innercomp-abcontainer {
    bottom: 36px !important;
  }
}

[data-theme='theme-aquamarine'] #ancient-tree-group-pop {
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
::v-deep .el-scrollbar__wrap {
  margin-right: 0 !important;
}

::v-deep .el-scrollbar__view,
::v-deep .el-scrollbar__wrap,
::v-deep .el-scrollbar {
  &::-webkit-scrollbar-thumb {
    display: none !important;
  }

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
    display: none !important;
  }
}
.scrollbar {
  width: 100%;
  height: 100%;
  ::v-deep .el-scrollbar__bar {
    right: 0 !important;
  }

  ::v-deep .el-scrollbar__view {
    display: flex;
    padding: 0 px-to-rem(12) 0 0;
    flex-wrap: wrap;
  }

  ::v-deep .el-scrollbar__wrap {
    &::-webkit-scrollbar {
      display: none !important;
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
    padding: 0 px-to-rem(6);
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

      i {
        font-size: px-to-rem(20);
      }
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
    margin-left: px-to-rem(6);
    font-size: px-to-rem(14);
  }
}

#ancient-tree-group-pop {
  .container_pop {
    height: px-to-rem(278);

    &.swiper-wrapper {
      padding: 0 px-to-rem(12) 0 0;

      .item_name {
        min-width: px-to-rem(56);
      }
    }

    .item_name {
      min-width: px-to-rem(98);
    }

    &.stewardship-info {
      .item_name {
        min-width: px-to-rem(126);
      }
    }

    .scrollbar {
      width: 100%;
      height: 100%;

      ::v-deep .el-scrollbar__wrap {
        overflow: scroll;
      }
    }
    .line_item {
      width: 100%;
    }
    .item_value {
      flex: 1 !important;
      margin-right: 0 !important;
    }

    .is_wrap {
      align-items: start;

      &.line_item {
        height: auto;
      }

      .item_value_inner {
        overflow: unset;
        text-overflow: unset;
        white-space: normal;
      }
    }
  }
}

::v-deep .swiper-medias {
  margin-bottom: px-to-rem(9);
}

.tree-name {
  font-style: normal;
  font-weight: 600;
}
</style>
