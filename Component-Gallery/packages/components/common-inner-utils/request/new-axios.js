import axios from 'axios'
// import router from '@/router';
import { MessageBox, Notification } from 'element-ui'
import { getToken } from '../funCommon/common'

// 创建 axios 实例
// const baseUrl = process.env.VUE_APP_BASE_API + '/api/'
const baseUrl = '/apiserver/'
let outLoginCount = 0
axios.defaults.withCredentials = true //让ajax携带cookie
const request = axios.create({
  baseURL: baseUrl, // 基础url。
  timeout: 60000, // 请求超时时间
  withCredentials: true,
  validateStatus: function () {
    return true
  }
})

// request interceptor(请求拦截器)
request.interceptors.request.use(
  (config) => {
    //自动传cookie
    config.credentials = true
    config.headers['clienttype'] = 'pc'
    config.headers['Authorization'] =
      'Bearer ' +
      (window.$videoStoreData?.userInfo?.token ||
        sessionStorage.getItem('Admin-Token'))
    console.log(
      'sessionStorage中取token==============》',
      sessionStorage.getItem('Admin-Token')
    )
    console.log('请求头===========》', config.headers)
    return config
  },
  (error) => {
    let respError = {
      status: error.response.status,
      statusText: error.response.Unauthorized
    }
    return Promise.reject(respError)
  }
)

// response interceptor（接收拦截器）
request.interceptors.response.use(
  (response) => {
    const res = response
    res.url = response.request.responseURL
    res.time = response.headers.date
    const msg = res.data.msg || res.data.message // 网关响应参数可能为msg或message
    // 暂时 . 工具箱看这里获取视频设备code400
    if (res.data.code === 200 || res.data.code === 400) {
      return res.data
    } else if (res.data.code === 401) {
      // 401:token失效
      if (this.outLoginCount === 0) {
        MessageBox.alert(msg + '，请重新登录', '系统提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: () => {
            // router.push({
            //   path: '/login'
            // });
            // 为了重新实例化vue-router对象 避免bug
            location.reload()
          }
        })
      }
      outLoginCount++
    } else {
      if (this.outLoginCount === 0) {
        if (msg === '未知异常，请联系管理员') {
          Notification.error({
            title: '错误',
            message: msg
          })
        } else {
          Notification.warning({
            title: '警告',
            message: msg
          })
        }
      }
      outLoginCount++

      return Promise.reject('error')
    }
  },
  (error) => {
    let { message } = error
    // let timer;
    if (this.outLoginCount === 0) {
      if (message === 'Network Error') {
        message = '系统接口请求异常'
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        if (code === '503') {
          Notification.warning({
            title: '警告',
            message: '服务尚未注册成功,请确认已启动服务后稍等!'
          })
        } else if (code === '401') {
          // 401:token失效
          MessageBox.alert(
            '暂未登录或token已经过期，请重新联系管理员或重新登录!',
            '系统提示',
            {
              confirmButtonText: '确定',
              type: 'warning',
              callback: () => {
                // router.push({
                //   path: '/login'
                // })
              }
            }
          )
        } else {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
          Notification.error({
            title: '错误',
            message: message
          })
        }
      }
    }
    outLoginCount++

    return Promise.reject(error)
  }
)

export default request
