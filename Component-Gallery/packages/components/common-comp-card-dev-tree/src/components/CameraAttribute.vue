<template>
  <absolute-container
    title="属性"
    :left="undefined"
    :top="undefined"
    can-close
    :no-corner="false"
    :leftTitle="false"
    @close="onClose"
    :class="bemClass.container"
  >
    <div class="container">
      <div class="row">
        <span class="label">摄像机名称：</span
        ><span class="value tover">{{ cameraDetail.devName }}</span
        ><em
          class="iconfont_tools icon-fuzhiicon icon-copy"
          @click="copyCoordinate(cameraDetail.devName)"
        />
      </div>
      <div class="row">
        <span class="label">摄像机编号：</span
        ><span class="value tover">{{ cameraDetail.deviceCode }}</span
        ><em
          class="iconfont_tools icon-fuzhiicon icon-copy"
          @click="copyCoordinate(cameraDetail.deviceCode)"
        />
      </div>
      <div v-if="channelDetail && channelDetail.channelCode" class="row">
        <span class="label">通道名称：</span
        ><span class="value tover">{{ channelDetail.channelName }}</span
        ><em
          class="iconfont_tools icon-fuzhiicon icon-copy"
          @click="copyCoordinate(channelDetail.channelName)"
        />
      </div>
      <div v-if="channelDetail && channelDetail.channelCode" class="row">
        <span class="label">通道编号：</span
        ><span class="value tover">{{ channelDetail.channelCode }}</span
        ><em
          class="iconfont_tools icon-fuzhiicon icon-copy"
          @click="copyCoordinate(channelDetail.channelCode)"
        />
      </div>
      <div class="row">
        <span class="label">摄像机类型：</span
        ><span class="value">{{
          DEVICE_CATEGORY[cameraDetail.categoryCode] ||
          cameraDetail.categoryCode
        }}</span>
      </div>
      <div class="row" style="align-items: normal">
        <span class="label">摄像机标签：</span
        ><span
          v-if="
            !cameraDetail.labelNameList ||
            cameraDetail.labelNameList.length === 0
          "
          class="value"
          >-</span
        >
        <span class="label-row">
          <span
            v-for="(item, ind) in cameraDetail.labelNameList"
            :key="ind"
            class="sptag"
          >
            <span class="inner">{{ item }}</span>
          </span>
        </span>
      </div>
      <div class="row">
        <span class="label">摄像机厂家：</span
        ><span class="value">{{ cameraDetail.modelName || '-' }}</span>
      </div>
      <div class="row">
        <span class="label">摄像机型号：</span
        ><span class="value">{{ cameraDetail.deviceModelCode || '-' }}</span>
      </div>
      <div class="row">
        <span class="label">经纬度：</span
        ><span class="value"
          >{{ cameraDetail.longitude }},{{ cameraDetail.latitude }}</span
        >
      </div>
      <div class="row">
        <span class="label">摄像机地址：</span>
        <el-tooltip
          :content="cameraDetail.location"
          placement="top"
          :disabled="isTooltipDisabled"
          popper-class="iwhale-speciesLYstyle"
        >
          <span
            class="value tover"
            style="flex: 1"
            @mouseenter="setTooltipDisable"
            >{{ cameraDetail.location || '-' }}</span
          >
        </el-tooltip>
      </div>
    </div>
  </absolute-container>
</template>

<script>
import { getMultipleDicts } from '@component-gallery/utils/request/index'
import { queryDeviceForWE } from '../service/index.js'
import AbsoluteContainer from '@component-gallery/base-components/absolute-container/AbsoluteContainer.vue'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('camera-attribute')

export default {
  name: 'd-camera-attribute',
  components: { AbsoluteContainer },
  props: {
    detaildata: Object
  },
  data() {
    return {
      channelDetail: null,
      isTooltipDisabled: true,
      DEVICE_CATEGORY: {},
      cameraDetail: {}
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('container')
      }
    }
  },
  watch: {
    detaildata(v) {
      if (v) {
        this.channelDetail = null
        this.queryCameraData(this.detaildata).then((r) => {
          this.cameraDetail = r
          this.filterChannel()
        })
      }
    }
  },
  mounted() {
    this.channelDetail = null
    this.queryCameraData(this.detaildata).then((r) => {
      this.cameraDetail = r
      this.filterChannel()
    })

    // 查询摄像机类型转换枚举值
    getMultipleDicts(['ar_screen_category_code']).then((resp) => {
      const newMap = {}
      resp.data.ar_screen_category_code.forEach((i) => {
        newMap[i.dictValue] = i.dictLabel
      })
      this.DEVICE_CATEGORY = newMap
    })
  },
  methods: {
    filterChannel() {
      if (this.detaildata.channelCode && this.cameraDetail.channels) {
        this.channelDetail = this.cameraDetail.channels.find(
          (i) => i.channelCode === this.detaildata.channelCode
        )
      }
    },
    copyCoordinate(text) {
      // 生成短链接
      this.copyText(text)
      CommonMessage.success('复制成功')
    },
    copyText(value) {
      const aux = document.createElement('input')
      aux.value = value
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    // 查询相机详情，供设备树使用
    queryCameraData({ deviceCode, channelCode }) {
      return new Promise((resolve, reject) => {
        queryDeviceForWE({
          deviceCode,
          channelCode
        }).then((resp) => {
          resolve(resp.data)
        })
      })
    },
    setTooltipDisable(e) {
      const trigger = e.currentTarget
      if (trigger.scrollWidth <= trigger.offsetWidth) {
        this.isTooltipDisabled = true
      } else {
        this.isTooltipDisabled = false
      }
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/card-dev-tree/cameraAttribute';
</style>
