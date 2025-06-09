/*
 * @Author: 米亚流年
 * @Date: 2024-01-22 16:48:07
 * @LastEditors: 米亚流年
 * @LastEditTime: 2024-01-23 09:01:18
 * @FilePath: /Component-Gallery/packages/components/utils/funCommon/system/config.js
 */
import { requestSDK as request } from '@ct/iframe-connect-sdk'

// 查询参数列表
export function listConfig(query) {
  return request('/admin/system/config/list', query)
}

// 查询参数详细
export function getConfig(configId) {
  return request('/admin/system/config/detail/' + configId)
}

// 新增参数配置
export function addConfig(data) {
  return request('/admin/system/config/add', data, 'post')
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/admin/system/config/update',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delConfig(configId) {
  return request('/admin/system/config/del/' + configId, {}, 'delete')
}

// 导出参数
export function exportConfig(query) {
  return '/admin/system/config/export'
}

// 查询参数详细
export function getConfigByKey(configKey) {
  return request('/admin/system/config/base/detail/' + configKey)
}

// 获取obs秘钥
export function selectObsByKeys(data) {
  return request('/admin/system/config/base/selectObsByKeys', data, 'post')
}
