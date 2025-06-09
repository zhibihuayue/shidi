import { $v } from '../../funCommon/common.js'

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

export function getGridNameByGridId(data) {
  return request({
    vue: this,
    url: '/bdm/grid/getGridNameByGridId',
    method: 'post',
    data
  })
}

export function gridKeeper(id) {
  return request({
    url: `/bdm/gridKeeper/findOne?keeperId=${id}`,
    method: 'get'
  })
}

//网格员详情
export function gridKeeperListByPosition(data) {
  return request({
    vue: this,
    url: `/bdm/gridKeeper/getKeeperListByLonLat`,
    method: 'post',
    data
  })
}
