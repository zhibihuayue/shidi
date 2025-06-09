export const getRealPx = {
  methods: {
    pxToRem(px) {
      return `${px / 100}rem`
    },
    /**
     * @description 将通过pxtToRem转换的rem重新转换为真实像素
     * @param {string | number} px 需要转换的原像素值
     * @returns {number}
     */
    realPx(px) {
      const ele = document.querySelector('html')
      const fontSize = window.getComputedStyle(ele).fontSize.split('px')[0]
      const rem = this.pxToRem(px).split('rem')[0]
      return Number(rem) * Number(fontSize)
    }
  }
}
