/*
 * @Author: 米亚流年
 * @Date: 2024-02-19 14:52:31
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-09-25 10:51:12
 * @FilePath: /Component-Gallery/playground/vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { codeInspectorPlugin } = require('code-inspector-plugin')

const path = require('path')

const port = process.env.port || process.env.npm_config_port || 8081 // 端口

const isDev = process.env.NODE_ENV === 'development'
const useRem = true

module.exports = defineConfig({
  // publicPath: '/bigScreen/monitorWarn/',
  assetsDir: 'static',
  lintOnSave: isDev,
  productionSourceMap: isDev,
  devServer: {
    client: {
      overlay: false
    },
    host: '0.0.0.0',
    hot: false,
    port,
    proxy: {
      '/apiserver': {
        target: 'http://10.43.86.213:12101/',
        changOrigin: true, //开启代理
        pathRewrite: {
          '^/apiserver': 'apiserver'
        }
      },
      '/amapapi': {
        target: 'https://restapi.amap.com',
        changOrigin: true, //开启代理
        pathRewrite: {
          '^/amapapi': ''
        }
      },
      '/preview': {
        target: process.env.VUE_APP_BASE_IMG_URL,
        changOrigin: true, //开启代理
        pathRewrite: {
          '^/preview': ''
        }
      },
      '^/presetImgUrl': {
        // 这里的'^/api'是你要代理的前缀，可以根据实际情况调整
        target: 'https://video-platform.obs.cn-north-4.myhuaweicloud.com', // 目标服务器的基础URL
        changeOrigin: true, // 是否改变请求源头，通常设置为true
        pathRewrite: { '^/presetImgUrl': '' }, // 路径重写规则，这里假设你的请求前缀是'/api'，需要被替换为空
        secure: false // 如果是https请求，需要设置为false，否则需要提供证书
      },
      [process.env.VUE_APP_BASE_IMG]: {
        target: process.env.VUE_APP_BASE_IMG_URL,
        changOrigin: true, //开启代理
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_IMG]: ''
        }
      },
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      [process.env.VUE_APP_ANALYSIS]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        }
      },
      [process.env.VUE_APP_EMERGENCY]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        }
      },
      [process.env.VUE_APP_BISS]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        }
      },
      [process.env.VUE_APP_BASESERVICE]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    ;['vue-modules', 'vue', 'normal-modules', 'normal'].forEach((rule) => {
      config.module
        .rule('scss')
        .oneOf(rule)
        .use('resolve-url-loader')
        .loader('resolve-url-loader')
        .before('sass-loader')
        .end()
        .use('sass-loader')
        .loader('sass-loader')
        .tap((options) => ({ ...options, sourceMap: true }))
        .end()
      config.plugin('code-inspector-plugin').use(
        codeInspectorPlugin({
          bundler: 'webpack'
        }),
        [{ enable: true, showSwitch: true }]
      )
    })
    const sourceMap = isDev ? 'source-map' : ''
    config.devtool(sourceMap)
  },
  css: {
    //查看CSS属于哪个css文件
    sourceMap: isDev,
    ...(useRem
      ? {
          loaderOptions: {
            postcss: {
              postcssOptions: {
                plugins: [
                  require('postcss-pxtorem')({
                    rootValue: 100,
                    propList: ['*'],
                    exclude(file) {
                      // console.log(
                      //   file,
                      //   '>>>>>>>>>',
                      //   file.indexOf('common-') !== -1
                      // )
                      return file.indexOf('common-') !== -1
                    }
                  })
                ]
              }
            }
          }
        }
      : {})
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      alias: {
        '#': path.join(__dirname, 'public'),
        '@': path.join(__dirname, 'src')
      },
      fallback: {
        path: require.resolve('path-browserify')
      }
    }
  }
})
