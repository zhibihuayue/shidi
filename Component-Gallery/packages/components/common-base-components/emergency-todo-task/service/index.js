import { request } from '@component-gallery/utils/request/API/index'

export const getTaskInfoById = (data) => {
  return request({
    vue: this,
    url: '/video-emergency/emergency/getTaskInfo',
    method: 'post',
    data
  })
}

export const getFeedbackList = (data) => {
  return request({
    vue: this,
    url: '/video-emergency/emergency/getFeedbackList',
    method: 'post',
    data
  })
}

export const doFeedback = (data) => {
  return request({
    vue: this,
    url: '/video-emergency/emergency/doFeedback',
    method: 'post',
    data
  })
}

export const editStatus = (data) => {
  return request({
    vue: this,
    url: '/video-emergency/emergency/editStatus',
    method: 'post',
    data
  })
}

export const getEmergencyResourceTree = (data) => {
  return request({
    vue: this,
    url: '/video-emergency/emergency/getEmergencyResourceTree',
    method: 'post',
    data
  })
}
