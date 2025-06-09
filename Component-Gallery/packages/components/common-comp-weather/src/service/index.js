import { $v } from '@component-gallery/utils/funCommon/common'
import { request } from '@component-gallery/utils/request/API'

export function getAQIList(data) {
  return new Promise((resolve, reject) => {
    $v.post(
      this,
      '/order/weather/getAirQualityList',
      data,
      (res) => {
        resolve(res)
      },
      (err) => {
        reject(err)
      },
      { loading: false }
    )
  })
}

export function poiContraryGeocodingQuery(data) {
  return request({
    url: '/gis/gis/codeToAdress',
    method: 'post',
    data: data
  })
}
