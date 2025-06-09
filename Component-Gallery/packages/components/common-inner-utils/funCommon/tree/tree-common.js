// export const getZoom = (data) => {
//   let isMunicipality = ['110000', '120000', '310000', '500000'].includes(
//     data.code
//   )
//     ? true
//     : false
//   const zoomMap = {
//     0: 5,
//     1: isMunicipality ? 8 : 7,
//     2: 8,
//     3: 10,
//     4: 12,
//     5: 13,
//     6: 14
//   }
//   let level
//   if (data.code === '100000') {
//     level = 0
//   }
//   if (data.level) {
//     level = Number(data.level)
//   }
//   if (data.townCode) {
//     //原来是判断level6, 铁塔的返回的是4, 改成判断是否有townCode
//     level = 4
//   }
//   if (data.deviceCode && !data.channelCode) {
//     level = 5
//   }
//   if (data.channelCode) {
//     level = 6
//   }
//   return zoomMap[level]
// }

// export const getZoom = (data) => {
//   const isMunicipality = ['110000', '120000', '310000', '500000'].includes(
//     data.code
//   )

//   const rules = {
//     default: (t) => t.level === '0', // 默认全国
//     level1: (t) => t.level === '1', // 省份或直辖市
//     level2: (t) => t.level === '2', // 地市
//     level3: (t) => t.level === '3', // 区县
//     level4: (t) => t.level === '4' || t.townCode, // 街道
//     device: (t) => t.deviceCode && !t.channelCode, // 设备
//     channel: (t) => t.channelCode != undefined // 频道
//   }
//   // 策略映射
//   const strategyMap = {
//     default: () => 5, // 默认全国
//     level1: () => (isMunicipality ? 8 : 7), // 省份或直辖市
//     level2: () => 8, // 地市
//     level3: () => 10, // 区县
//     level4: () => 12, // 街道
//     device: () => 13, // 设备
//     channel: () => 14 // 频道
//   }
//   for (const key in rules) {
//     if (rules[key](data)) {
//       return strategyMap[key]()
//     }
//   }
//   // 执行策略
//   return strategyMap.default()
// }

export const getZoom = (data) => {
  console.log('🚀 ~ getZoom ~ data:', data)
  const isMunicipality = ['110000', '120000', '310000', '500000'].includes(
    data?.code
  )
  const rules = {
    default: (t) => (t.level === '0' ? 5 : false),
    level1: (t) => (t.level === '1' ? (isMunicipality ? 8 : 7) : false), // 省份或直辖市
    level2: (t) => (t.level === '2' ? 8 : false), // 地市
    level3: (t) => (t.level === '3' ? 10 : false), // 区县
    level4: (t) => (t.level === '4' || t.townCode ? 12 : false), // 街道
    device: (t) => (t.deviceCode && !t.channelCode ? 13 : false), // 设备
    channel: (t) => (t.channelCode ? 14 : false) // 频道
  }
  // 策略映射
  for (const key in rules) {
    let res = rules[key](data)
    if (res !== false) {
      return res
    }
  }
  // 执行策略
  return 5
}
export const findOneInTreeListByKey = (
  treeList,
  codeValue,
  key,
  childKey = 'list'
) => {
  if (treeList[key] == codeValue) {
    return treeList
  } else if (treeList[childKey]?.length > 0) {
    let i
    let result = null
    for (i = 0; result == null && i < treeList[childKey].length; i++) {
      result = findOneInTreeListByKey(
        treeList[childKey][i],
        codeValue,
        key,
        childKey
      )
    }
    return result
  } else {
    return null
  }
}
