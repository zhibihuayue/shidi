/*
 * @Author: 王佳旭 wangjx2@strongdata.com.cn
 * @Date: 2024-08-15 21:40:08
 * @LastEditors: 王佳旭 wangjx2@strongdata.com.cn
 * @LastEditTime: 2024-08-15 21:56:02
 * @FilePath: common-inner-utils/funCommon/scrollLodaMore/
 * @Description: 列表下拉滚动加载更多
 */
const getContext = (binding) => {
  return {
    offset: 30,
    triggered: false,
    ...binding.value
  }
}
const getElement = (el, ctx) => {
  let scrollWrapper = el
  if (ctx.scrollClass) {
    scrollWrapper = el.querySelector(ctx.scrollClass)
  }
  if (!scrollWrapper) {
    throw new Error(`Failed to find ${ctx.scrollClass} element`)
  }
  return scrollWrapper
}
export default {
  bind(el, binding) {
    const ctx = getContext(binding)
    const scrollWrapper = getElement(el, ctx)

    const onScroll = () => {
      const scrollPosition =
        scrollWrapper.scrollTop + scrollWrapper.clientHeight
      const bottomOffset = scrollWrapper.scrollHeight - scrollPosition
      if (bottomOffset <= ctx.offset && !ctx.triggered) {
        ctx.triggered = true
        ctx?.onScrollEnd?.()
      } else if (bottomOffset > ctx.offset && ctx.triggered) {
        ctx.triggered = false // 当滚动离开底部时重置标志位
      }
    }

    scrollWrapper._onScroll = onScroll
    scrollWrapper.addEventListener('scroll', onScroll)
  },
  unbind(el, binding) {
    const ctx = getContext(binding)
    const scrollWrapper = getElement(el, ctx)

    if (scrollWrapper) {
      scrollWrapper.removeEventListener('scroll', scrollWrapper._onScroll)
      delete scrollWrapper._onScrolls
    }
  }
}
