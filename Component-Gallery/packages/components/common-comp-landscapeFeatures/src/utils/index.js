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
