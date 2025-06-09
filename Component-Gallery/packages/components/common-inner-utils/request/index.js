import { $v } from '../funCommon/common'

// 根据字典类型查询字典数据信息
export function getMultipleDicts(dictType) {
  return new Promise((resolve, reject) => {
    $v.get(
      this,
      '/admin/base/system/dict/data/dictType/multiple/' + dictType,
      { uuid: $v.getUUID() },
      (resp) => {
        resolve(resp)
      },
      () => {
        reject()
      },
      {
        loading: false
      }
    )
  })
}

export function getUserMemoryInfo(memoryTypes, success, error) {
  $v.postNoLoadCheck(
    this,
    '/video-video/video/getUserMemoryInfo?' + new Date().getTime(),
    { memoryTypeList: memoryTypes },
    success,
    error
  )
}
export function uptUserMemoryInfo(params, success) {
  $v.postNoLoadCheck(
    this,
    '/video-video/video/uptUserMemoryInfo?' + new Date().getTime(),
    params,
    success,
    null
  )
}
