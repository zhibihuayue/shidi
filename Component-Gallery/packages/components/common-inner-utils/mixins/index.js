export const mixins = {
  methods: {
    // 是否开启文字走马灯动画
    isMarquee(content, name, maxLength = 5) {
      const length = String(content).length
      let time = '0s'
      if (length > maxLength) {
        const baseDuration = 10 // 基础时间，单位秒
        const speed = 1000 // 每个字符的滚动时间，单位毫秒
        const duration = length * speed + baseDuration
        time = `${duration / 1000}s` // 转换为秒
      }
      return {
        [name]: time
      }
    }
  }
}
