import {
  $v,
  urlBis,
  urlBaseService
} from '@component-gallery/utils/funCommon/common'

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
