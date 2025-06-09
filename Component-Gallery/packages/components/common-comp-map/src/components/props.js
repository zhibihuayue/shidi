/*
 * @Author: 米亚流年
 * @Date: 2024-01-22 16:48:07
 * @LastEditors: 米亚流年
 * @LastEditTime: 2024-01-23 09:03:26
 * @FilePath: /Component-Gallery/packages/components/common-comp-map/src/components/props.js
 */
export default {
  props: {
    // 地图的实例
    mapInstance: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 组件定位
    position: {
      type: Object,
      default: () => {
        return {
          bottom: '130px',
          right: '10px'
        }
      }
    },
    // 组件是否显示
    show: {
      type: Boolean,
      default: true
    },
    // 罗盘左右旋转时每次旋转角度
    rotate: {
      type: [Number, String],
      default: 15,
      validator: function (value) {
        return Number(value) > 0
      }
    },
    // 罗盘上下翻转时每次翻转角度（功能暂定，参数暂时无用）
    overturn: {
      type: [Number, String],
      default: 5
    },
    // 组件层级
    zIndex: {
      type: [Number, String],
      default: 999
    },
    // 开启复位操作
    reset: {
      type: Boolean,
      default: true
    },
    // 缩放比例
    scale: {
      type: [Number, String],
      default: 1
    },
    mapId: {
      type: String,
      default: 'mapId'
    }
  }
}
