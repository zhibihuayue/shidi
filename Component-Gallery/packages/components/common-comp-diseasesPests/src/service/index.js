import { request } from '@component-gallery/utils/request/API'

// 病虫害预测图表数据
export const pestPrediction = (param) => {
  return request({
    url: 'forest-wetland/pestForecastOutcome/pestPrediction',
    method: 'post',
    data: param
  })
}

// 病虫害预测获取有数据时间
export const pestTimeList = (param) => {
  return request({
    url: 'forest-wetland/pestForecastOutcome/pestTimeList',
    method: 'get',
    data: param
  })
}

// 病虫害预测获取诱捕器列表
export const pestLightDevice = (param) => {
  return request({
    url: 'forest-wetland/pestLightRecord/pestLightDevice',
    method: 'get',
    data: param
  })
}

// 病虫害预测获取日期下所有诱捕器数据
export const pestLightLastDay = (param) => {
  return request({
    url: 'forest-wetland/pestForecastOutcome/pestLightLastDay',
    method: 'post',
    data: param
  })
}

// 病虫害预测风险等级说明
export const getVoByPestType = (param) => {
  return request({
    url: 'forest-wetland/pestControlForecast/getVoByPestType',
    method: 'get',
    data: param
  })
}
