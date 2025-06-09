import { request } from '@component-gallery/utils/request/API'

// 生态系统变化
export const statisticsChain = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/statisticsChain',
    method: 'post',
    data: param
  })
}

// 综合动态转移指数
export const statisticsDynamicIndex = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/statisticsDynamicIndex',
    method: 'post',
    data: param
  })
}

// 生态系统矩阵
export const statisticsMatrix = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/statisticsMatrix',
    method: 'post',
    data: param
  })
}

// 生态统计默认时间有数据时接口
export const statisticsDefaultTime = (param) => {
  return request({
    url:
      'forest-wetland/weather-analyse/suitableYear?key=' + new Date().getTime(),
    method: 'get',
    data: param
  })
}
