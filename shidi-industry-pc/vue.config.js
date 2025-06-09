/*
 * @Author: 米亚流年 miyaliunian@gmail.com
 * @Date: 2024-01-12 13:10:39
 * @LastEditors: fanzhiwei
 * @LastEditTime: 2024-06-25 15:38:47
 * @FilePath: /shidi-industry/shidi-industry-pc/vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

// const externals = {
//   vue: 'Vue'
// };
// const cdn = {
//   // 生产环境
//   build: {
//     css: [],
//     js: ['https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.12/vue.min.js']
//   }
// };
module.exports = {
  lintOnSave: false,
  transpileDependencies:["@ct/component-gallery-video-player-listener"],
  devServer: {
    // port: 9998, //大屏本地端口
    port: 8081,//工作台本地端口
    disableHostCheck: true,
    proxy: {
      // 远程组件proxy
      "/component-gallery/api/business": {
        // target: "http://10.43.82.110:38080/",
        // target: 'https://sl.chinatowercom.cn/',
        // target: "http://120.46.149.139:9091",
        target: 'http://192.168.2.202:8114',
        // target: "http://124.70.97.97:9091",//测试环境
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/api": "",
        },
      },
      "/amapapi": {
        target: "https://restapi.amap.com",
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/amapapi": "",
        },
      },
      "/preview": {
        target: process.env.VUE_APP_BASE_IMG_URL,
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/preview": "",
        },
      },
      "/apiwl": {
        target: "http://10.30.1.39:8114",
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/apiwl": "",
        },
      },
      // 湿地API代理
      "/apiHH": {
        // target: "http://10.100.13.218:8114",
        // target: "http://10.10.20.121:8114", //后端本地
        // target: "http://192.168.2.40:8114",
        target: "http://192.168.2.202:8114", //测试
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/apiHH": "",
        },
      },
      [process.env.VUE_APP_BASE_IMG]: {
        target: process.env.VUE_APP_BASE_IMG_URL,
        changOrigin: true, //开启代理
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_IMG]: "",
        },
      },
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
      [process.env.VUE_APP_ANALYSIS]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        },
      },
      [process.env.VUE_APP_EMERGENCY]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        },
      },
      [process.env.VUE_APP_BISS]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        },
      },
      [process.env.VUE_APP_BASESERVICE]: {
        target: process.env.VUE_APP_FORESTRY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          // ['^' + process.env.VUE_APP_SYSTEM]: ''
        },
      },
    },
  },
  productionSourceMap: false,
  publicPath: process.env.VUE_ROUTER_BASE,
  configureWebpack: (config) => {
    config.resolve = {
      extensions: [".js", ".json", ".vue"],
      alias: {
        "@": resolve("src"),
        "#":resolve("public"),
        common: resolve("src/common"),
      },
    };
    if (process.env.NODE_ENV === "production") {
      // 生产环境下移除console.log
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            rootValue: 100,
            propList: ["*"],
            exclude(file) {
              // theme-chalk已经做了rem转换，不需要再处理
              if (file.indexOf("component-gallery-theme-chalk") !== -1 || file.indexOf("detailInfo") !== -1 || file.indexOf("addInfo") !== -1) {
                return true;
              } else {
                return false;
              }
            },
          }),
        ],
      },
    },
  },
  // configureWebpack: config => {
  //   Object.assign(config, {
  //     externals: externals
  //   });
  // },
  // chainWebpack: config => {
  //   // 对vue-cli内部的 webpack 配置进行更细粒度的修改
  //   config.plugin('html').tap(args => {
  //     args[0].cdn = cdn.build;
  //     args[0].title = require('./src/package.json').data.title
  //     if (process.env.NODE_ENV === 'production') {
  //       args[0].minify.removeComments = false;
  //     }
  //     return args;
  //   });
  // }
};
