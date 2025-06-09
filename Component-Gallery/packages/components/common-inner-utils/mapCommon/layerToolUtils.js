import { getInlineStore, setInlineStore } from '../funCommon/inlineStore'
import eventPath from '@component-gallery/build-event-bus-path'

// 本工具类是新图层工具组件提供给其他业务组件使用的，用于统一今后的唤起打点功能。
// 原则上，此工具类的方法在今后的版本中**基本不做修改**（具体业务逻辑位于实际的图层工具组件内，这里只是为了方便业务组件的外层调用而做的壳子

// 高亮一个打点。
export function highlightMarker(options) {
  const {
    lnglat, // 经纬度数组
    code, // 打点的编码，为空则取消选中。具体打点编码指代请参考图层工具文档，每个图层对应的不同
    layerId, // Number。对应的图层ID。仅限图层控制提供的 打点类图层ID才有效，网格或其他图层不会有反应。等效于图层控制的highlight事件的type
    payload, // 外要传递给打点弹窗的信息，会作为同名props传递给打点弹窗。
    isFocus = true, // Boolean。是否聚焦到该高亮打点，默认聚焦
    withDialog = false, // Boolean。是否同时拉起打点弹窗，如果这次只是高亮而不想拉起弹窗，那么传false
    zoom = 12, // 缩放等级，默认12
    ...others // 其他额外参数，供后续扩容使用。额外参数会对新方法提供的事件生效，对图层控制的老事件不生效。
  } = options

  // 判断当前大屏是否存在图层工具，存在的话使用图层工具事件，否则的话回归旧有事件
  if (getInlineStore('layerToolExist')) {
    // 存在新图层工具。拉起新的事件
    this.$globalEventBus.$emit(
      `${eventPath.commonCompLayersTool}__highlight-point`,
      // 此处是进行完整options透传，以兼容今后的传参变化。但已经列出的参数不会做修改。
      options
    )
  } else {
    // 不存在新图层工具。转为原有的图层高亮打点方法
    this.$globalEventBus.$emit(
      `${eventPath.commonCompLayersControl}__highlight-point`,
      {
        ...others,
        lnglat,
        type: layerId,
        code,
        payload,
        isFocus,
        withDialog,
        zoom
      }
    )
  }
}
