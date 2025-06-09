export const clickoutside = {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (binding && binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        if (binding.value && binding.value(e)) {
          binding.value(e)
        }
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
  },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
}

export const SELECT_STATE = {
  unselect: 0,
  selecting: 1,
  selected: 2
}

// 处理小数位数的方法(只针对于已经保留好两位小数的数据)
export const formattedValue = (value) => {
  if (!value) return 0
  let num = Number(value)
  if (num % 1 == 0) {
    // 如果是整数 直接返回整数部分
    return num.toFixed(0)
  } else if ((num * 10) % 1 == 0) {
    // 如果有一位小数
    return num.toFixed(1)
  } else {
    // 默认保留两位小数
    return num.toFixed(2)
  }
}

// 自动滚动
export class ScrollBarAuto {
  constructor(container, scrollInterval = 2000, animationDuration = 1000) {
    this.container = container
    this.scrollInterval = scrollInterval // 滚动间隔时间
    this.animationDuration = animationDuration // 动画持续时间
    this.itemHeight = this.container.querySelector('.singleList').clientHeight // 单条数据高度
    this.isScrolling = false // 控制是否滚动
    this.timer = null // 定时器
    this.lastScrollPosition = 0 // 记录鼠标手动滚动到的位置
    this.init()
  }

  // 初始化
  init() {
    this.container.addEventListener('mouseenter', this.stop.bind(this))
    this.container.addEventListener('mouseleave', this.start.bind(this))
    this.container.addEventListener(
      'scroll',
      this.handleManualScroll.bind(this)
    )
    this.start()
  }

  // 处理手动滚动事件
  handleManualScroll() {
    this.lastScrollPosition = this.container.scrollTop
  }

  // 平滑滚动动画
  smoothScrollTo(target) {
    const start = this.container.scrollTop
    const change = target - start
    let currentTime = 0
    const increment = 20 // 每次动画的时间间隔

    const animateScroll = () => {
      currentTime += increment
      const val = ScrollBarAuto.easeInOutQuad(
        currentTime,
        start,
        change,
        this.animationDuration
      )
      this.container.scrollTop = val
      if (currentTime < this.animationDuration) {
        requestAnimationFrame(animateScroll)
      }
    }

    animateScroll()
  }

  // 缓动函数
  static easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  // 滚动逻辑
  scrollDown() {
    const maxScroll = this.container.scrollHeight - this.container.clientHeight
    const currentScroll = this.container.scrollTop

    if (currentScroll >= maxScroll) {
      this.smoothScrollTo(0) // 滚动到顶部
    } else {
      this.smoothScrollTo(currentScroll + this.itemHeight) // 滚动到下一条数据
    }
  }

  // 开始滚动
  start() {
    if (this.timer) return // 如果定时器已经存在，直接返回
    this.isScrolling = true
    this.timer = setInterval(() => {
      if (this.isScrolling) {
        this.scrollDown()
      }
    }, this.scrollInterval)
  }

  // 停止滚动
  stop() {
    this.isScrolling = false
    clearInterval(this.timer)
    this.timer = null
  }
}
