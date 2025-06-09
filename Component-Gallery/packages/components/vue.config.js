/*
 * @Author: 米亚流年
 * @Date: 2024-02-19 14:45:16
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-08-19 12:40:14
 * @FilePath: /Component-Gallery/packages/components/vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const useRem = true
module.exports = defineConfig({
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      fallback: {
        path: require.resolve('path-browserify')
      }
    },
    externals: {
      ['@ct/ct_map_ol']: '@ct/ct_map_ol',
      ['@ct/iframe-connect-sdk']: 'iframeSDK'
    }
  },
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  transpileDependencies: [/[/\\]node_modules[/\\]ol[/\\]/],
  css: {
    extract: true,
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
                      if (file.indexOf('common-') !== -1) {
                        return true
                      } else {
                        return false
                      }
                    }
                  })
                ]
              }
            }
          }
        }
      : {})
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
    })
    config.optimization.minimizer('terser').tap((args) => {
      args[0].parallel = 4
      args[0].terserOptions.compress.warnings = true
      args[0].terserOptions.compress.drop_debugger = true
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  }
})
