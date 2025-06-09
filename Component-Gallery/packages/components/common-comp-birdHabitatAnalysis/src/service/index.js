import { request } from '@component-gallery/utils/request/API'

// 获取鸟类栖息图层
export const selectLayerList = (params) => {
  return request({
    url: '/bdm/layer/selectLayerList',
    method: 'get',
    data: params
  })
}

// 鸟类栖息地分析
export const statisticsSuitableAnalyse = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/statisticsSuitableAnalyse',
    method: 'post',
    data: param
  })
}

// 栖息地变化
export const statisticsSuitableChain = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/statisticsSuitableChain',
    method: 'post',
    data: param
  })
}

// 获取鸟类下拉选项
export const getBirdList = (param) => {
  return request({
    url: 'forest-wetland/weather-analyse/suitableAnimal',
    method: 'get',
    data: param
  })
}
