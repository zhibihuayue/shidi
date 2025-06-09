import { request } from '@component-gallery/utils/request/API'

// // 景观格局特征
export const statisticsFeature = (param) => {
  return request({
    url: '/forest-wetland/weather-analyse/statisticsFeature',
    method: 'post',
    data: param
  })
}

// // 生态统计默认时间有数据时接口
export const statisticsDefaultTime = (param) => {
  return request({
    url:
      'forest-wetland/weather-analyse/suitableYear?key=' + new Date().getTime(),
    method: 'get',
    data: param
  })
}
