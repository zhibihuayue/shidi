import { request } from '@component-gallery/utils/request/API'

// 气候统计分析
export const climaticAnalyst = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/statistics',
    method: 'post',
    data: param
  })
}
