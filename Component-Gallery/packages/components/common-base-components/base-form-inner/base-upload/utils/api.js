import httpRequest from '@component-gallery/utils/request/new-axios'
import { request } from '@component-gallery/utils/request/API'

export function upload(data, callback = '') {
  let params = {
    url: '/file/base/common/upload',
    method: 'post',
    data: data
  }
  if (callback) {
    params.onUploadProgress = callback
  }
  return httpRequest(params)
}

export function downloadByUrl(url) {
  return request({
    url: '/file/common/downloadByUrl',
    method: 'get',
    data: {
      url: url
    }
  })
}
