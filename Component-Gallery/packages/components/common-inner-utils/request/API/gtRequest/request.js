/* eslint-disable no-undef */
// 相对路径
// import { requestSDK } from '@ct/iframe-connect-sdk'

function checkCode(res) {
  let code = res.status || res.code
  let code2 = res.code2 || 200
  if (code2 && code2 !== 200) {
    code = code2
  }
  return { code, code2 }
}
function handleResData(res) {
  let newRes = {
    code: res.code2,
    data: res.body,
    msg: res.msg,
    msg2: res.msg2,
    time2: res.time2
  }
  return newRes
}
const getRequestParam = (para) => {
  let baseVarible = window.basePathVarible || ''
  const baseURL = `/video-application-land-spot${baseVarible}/land-res`
  let url = baseURL + para.url
  let userInfo = JSON.parse(sessionStorage.getItem('footerUserInfo'))
  let data = { ...userInfo }
  if (para.data) {
    data = { ...data, ...para.data }
  }
  if (para.unAdcode) {
    delete data.adCode
  }
  let method = para.method || 'post'
  let type = para.dataType || 'json'
  let header = {}
  if (para.header) {
    header = para.header
  }
  return { url, data, header, method, type }
}
const request = async (para) =>
  new Promise((resolve, reject) => {
    let params = getRequestParam(para)
    let { url, data, header, method, type } = params
    requestSDK(url, data, header, method, type)
      .then((res) => {
        if (type !== 'blob') {
          if (!_.isObject(res)) {
            reject(new RequestError('未知原因'))
          }
          let { code, code2 } = checkCode(res)

          // eslint-disable-next-line
          if (code * 1 === 200 && code2 * 1 === 200) {
            let newRes = handleResData(res)
            resolve(newRes)
          } else {
            let newRes = handleResData(res)
            reject(newRes)
          }
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
export default request
