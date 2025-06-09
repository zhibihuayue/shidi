import { $v } from '@component-gallery/utils/funCommon/common'

const request = ({ vue, url, method, data }) => {
  return new Promise((resolve, reject) => {
    $v[method](
      vue,
      `${url}`,
      data,
      (resp) => {
        resolve(resp)
      },
      (e) => {
        reject(e)
      },
      {
        loading: false
      }
    )
  })
}
//查询天气信息
export function getWeatherInfoByAlarmTime(params) {
  return request({
    url: '/order/weather/getWeatherInfoByAlarmTime',
    method: 'post',
    data: params
  })
}
