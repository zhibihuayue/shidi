<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-26 09:09:26
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-27 08:17:46
 * @FilePath: /Component-Gallery/packages/components/common-comp-horn-circle-selection/src/entry/CommonHornCircleSelection.vue
 * @Description: 组件属性描述、组件示例
   1: placeholder 标题
   2: offset 相对于浏览器绝对定位
   3: mapOptionExpend 圈选扩展
   4: layer 应用于小工具箱的哪个图层
   5: openChang 圈选流程结束后业务回调
   6: destroyEmit 组件销毁时注销回调函数
   7: drawExpExpend 描述圈选异常时 提示信息 画圆的时候“最多可绘制半径不超过 100km 的圆形区域”
   8: layerAbnormalDesc 图层加载异常时 提示信息
   9: deviceEmpDesc 圈选方位内 设备为空时 提示信息
   10: destroyEmit 圈选组件销毁时，回调函数

    <base-circle-selection
      placeholder="大喇叭圈选"
      :mapId="mapId"
      :offset="linePosition"
      :mapOptionExpend="[
        {
          icon: 'icon-tongyong_icon_huizhigongju_yuanxing_n',
          label: '圆形2',
          value: 'drawCircle2'
        }
      ]"
      :drawExpExpend="{
        drawCircle2: {
          value: 100000 * 100000 * Math.PI,
          tip: '最多可绘制半径不超过 100km 的圆形区域'
        }
      }"
      :layer="5"
      layerAbnormalDesc="请等摄像机图层加载完成再操作"
      deviceEmpDesc="圈选范围内没有摄像机设备，请重新圈选。"
      @openChang=""
      @destroyEmit=""
    />
-->
<template>
  <div class="">
    <line-select v-on="$listeners" v-bind="$attrs" />
    <div>
      <slot name="base-circle"></slot>
    </div>
  </div>
</template>
<script>
import LineSelect from '../components/LineSelect.vue'
export default {
  name: 'base-circle-selection',
  inheritAttrs: false,
  components: {
    LineSelect
  }
}
</script>
<style lang="scss">
@import '@component-gallery/assets/font/iconfont.css';
</style>
