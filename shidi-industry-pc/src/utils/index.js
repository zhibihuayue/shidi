/*
 * @Author: 逗逗飞 
 * @Date: 2024-05-24 11:53:15
 * @LastEditors: 逗逗飞 
 * @LastEditTime: 2024-05-26 14:31:34
 * @FilePath: /global-awareness-pc/src/utils/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { requestSDK } from '@ct/iframe-connect-sdk'
import { loadSpaceShardAsync } from '@ct/remote-page-loader/utils/remote-loader'

export const getInfo = async ()  => {
  const resp = await requestSDK('getInfo')
  if (resp.code === 200) {
    console.log('resp.user', resp.user)
    sessionStorage.setItem('Admin-Token', resp.user.token)
    return resp
  }
}
// 部署时组件库地址为独立域名，从工作台businessComponentFilsUrl配置获取
export const getFisUrl = () => {
  return window.requestSDK('/admin/system/config/base/detail/businessComponentFilsUrl', {}, {}, 'get')
}
export const getBusinessFiles = (configValue,param) => {
  return window.requestSDK(configValue || '/component-gallery/api/business/files', param, {}, 'post').then( resp => {
    return new Promise( async (resolve, reject) => {
        const { code, data } = resp
        if (code && code === 200) {
          const baseCompObj = {
            name: 'RemoteComponentsLoader',
            config: {
              name: '',
              description: '',
              js: '',
              css: ''
            }
          }
          const keys = Object.keys(data)
          const remotes = keys.map(key => {
            const { js, css } = data[key]
            return {
              ...baseCompObj,
              name: key,
              config: {
                name: key,
                css,
                js
              }
            }
          })
          const resp = await loadSpaceShardAsync({ data: remotes })
          setTimeout(() => {
            const obj = {}
            resp.forEach(o => {
              obj[o.config.name] = o.config
            })
            let result =  {
              components: obj,
              loaded : true,
            }
            return resolve(result)

          }, 0);
          return
        }
          reject(
            this.$notify.error({
              title: `获取远程组件失败`,
              message: `获取远程组件失败`
            })   
          )   
    })

  }).catch(err => {
        const { title, message } = err
        this.$notify.error({
          title: `${title}`,
          message: `${message}`
        })
  }).finally(() => {
        false
  })
}

// 异步版本。差别是，Async版本不在这里等待scriptLoad，脚本加载推迟到远程加载组件自己做。
export const getBusinessFilesAsync = (configValue, param) => {
  return window.requestSDK(configValue || '/component-gallery/api/business/files', param, {}, 'post').then( resp => {
    return new Promise( async (resolve, reject) => {
        const { code, data } = resp
        if (code && code === 200) {
          const baseCompObj = {
            name: 'RemoteComponentsLoader',
            config: {
              name: '',
              description: '',
              js: '',
              css: ''
            }
          }
          const keys = Object.keys(data)
          const remotes = keys.map(key => {
            const { js, css } = data[key]
            return {
              ...baseCompObj,
              name: key,
              config: {
                name: key,
                css,
                js
              }
            }
          })
          const obj = {}
          remotes.forEach(item => {
            obj[item.config.name] = item
          })
          return resolve({
            components: obj,
            loaded : true,
          })
        } else {
          reject(
            this.$notify.error({
              title: `获取远程组件失败`,
              message: `获取远程组件失败`
            })   
          )
        }
    })

  }).catch(err => {
        const { title, message } = err
        this.$notify.error({
          title: `${title}`,
          message: `${message}`
        })
  }).finally(() => {
        false
  })
}

/**
 * 动态处理根部font-size
 * @param {string} [direction='v' | 'h'] //- 'v' 竖屏 'h' 横
 */
export const setRootFontSize = (direction = 'v') => {
  const htmlElement = document.documentElement
  const viewportHeight = window.innerHeight
  const baseHeight = direction === 'v' ? 1080 : 1920
  const referenceHeight = 1032
  const newFontSize =
    direction === 'v'
      ? `calc((100vh / ${baseHeight}) * 100 * (${baseHeight} / ${referenceHeight}))`
      : `calc((100vw / ${baseHeight}) * 100)`

  htmlElement.style.fontSize = newFontSize
}