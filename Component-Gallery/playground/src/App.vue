<!--
 * @Author: 米亚流年
 * @Date: 2024-01-13 11:43:20
 * @LastEditors: 逗逗飞
 * @LastEditTime: 2024-05-07 18:14:44
 * @FilePath: /common-comp/examples/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import MapRef from './MapRef'

import { requestSDK } from '@ct/iframe-connect-sdk'

let themeIndex = 2
export default {
  name: 'App',
  provide() {
    return {
      mapRef: new MapRef({
        onMapSet: this.onMapChange
      }),
      // 当前模拟的是异步加载，如果需要测试同步加载请注释 mapFlag
      // mapFlag: () => this.mapFlag,
      hasAlarmList: true // 注入，通知远程组件们这个大屏有告警列表
    }
  },
  data() {
    return {
      mapFlag: null,
      open: true,
      title: '摄像机列表',
      titleWl: '物联设备列表',
      titleLb: '大喇叭列表',
      sourceTitle: '资源列表',
      titleWRJ: '无人机列表',
      titleWGY: '网格员列表',
      titleGrid: '网格员列表',
      titleRadar: '雷达列表',
      mapId: 'monitorWarn-map',
      showFireWarnList: 0, //是否展开告警列表 0 关闭 1 展开 2 半展开 (火警预警不再使用)
      showAlarmList: 0, //是否展开告警列表 0 关闭 1 展开 2 半展开(火警预警不再使用)
      mapReady: false,
      map: null,
      mapInstance: null,
      CTMapType: null,
      weatherProp: null,
      /**
       * footer组件传递属性
       */
      currentSelectFunction: [],
      isAllOpen: true,
      mapObj: {},
      toolList: [
        {
          key: 'mapControl'
        },
        {
          key: 'lookHere'
        }
      ],
      isAlarm: false,
      closeNodeIconArr: []
    }
  },
  mounted() {
    this.changeTheme()
    this.getUserToken()
  },
  methods: {
    onMapChange() {
      this.mapFlag = {}
    },
    changePosition() {
      this.open = !this.open
      this.$globalEventBus.$emit(`screenview__show-alarm-list`, {
        open: this.open
      })
    },
    changeTheme() {
      if (themeIndex === 0) {
        this.title = '摄像机列表'
        this.titleWl = '物联设备列表'
        this.titleLb = '大喇叭列表'
        this.titleRadar = '雷达列表'
        this.titleGrid = '网格树列表'
        this.sourceTitle = '资源列表'
        this.titleWGY = '网格员列表'
        document.documentElement.setAttribute('data-theme', `theme-aquamarine`)
        this.$globalEventBus.$emit('data-theme', 'theme-aquamarine')
        console.log('林业')
      } else if (themeIndex === 1) {
        this.title = ''
        this.titleWl = ''
        this.titleLb = ''
        this.sourceTitle = ''
        this.titleRadar = ''
        this.titleGrid = ''
        this.titleWGY = ''
        document.documentElement.setAttribute('data-theme', `theme-terracotta`)
        this.$globalEventBus.$emit('data-theme', 'theme-terracotta')
        console.log('国土')
      } else {
        this.title = ''
        this.titleWl = ''
        this.titleLb = ''
        this.sourceTitle = ''
        this.titleRadar = ''
        this.titleGrid = ''
        this.titleWGY = ''
        document.documentElement.setAttribute('data-theme', `theme-wiseblue`)
        this.$globalEventBus.$emit('data-theme', 'theme-wiseblue')
        console.log('通用')
      }
      if (themeIndex >= 2) {
        themeIndex = 0
        return
      }
      themeIndex += 1
    },
    async getInfo() {
      return await requestSDK('getInfo')
    },
    getUserToken() {
      // let newUrl = 'http://120.46.149.139:9091/api'
      // localStorage.setItem('gisUrl', newUrl)
      const TokenKey = 'Admin-Token'
      // const token =
      //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiIl0sInVzZXJfbmFtZSI6IndlYl9tYW5hZ2V8eWFuZ3NodWFpLXNkIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTc0NDA5Njc5NCwidXNlcklkIjoiNTFmYzExNDZhZDA3NDJkMmE1OGFmMTU3Y2YwNGU4YmIiLCJqdGkiOiI4NDBjZmQxYi00MjUzLTQ0NjktOTUzMi1lNmMwNmZjNjdlMDkiLCJjbGllbnRfaWQiOiJ3ZWJfbWFuYWdlIn0.chA_nEKzOYhT0T_PjZUG3yweDYT4R5GGaY8SXIntTT2NAy36x6701qeKoucNOasJ4EAeACn-Z3rnpmuMQ4r0pAr6uBoypbAAs04T-BX6F_OAThrCErQP7LQRMNdFWheteravWUC-brX8J38hhJLHlxw1W9uKPaZPdEX-On1S7I3ikCWLkilI9eR0dUzRNaMYHYSFWfDC8YuOsYXDTqf_VkGmtSt1ZAlHnxsZkvd54AZJcUhqZQBsXEnaAn1UNg3JiWc8GA5fjWDBtwKNnxMaQY1-kCM0wec2075HPVsVvwmaYqqWDGRo5GoCB-QAnOI1o3SebODV-tRU_nHj6pWN-Q'
      this.getInfo().then((resp) => {
        console.log(resp, 'resprespresp')
        if (resp.code == 200) {
          sessionStorage.setItem(TokenKey, resp.user.token)
        } else {
      // sessionStorage.setItem(TokenKey, token)
        }
      })
    }
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  margin: 0px;
  padding: 0px;
  /* overflow: hidden; */
}

// 临时覆盖rem方案。集成工程工作在一个banner下，它的实际“屏幕”高度基准单位是1080 - 48 = 1032
// 因此如果还是用原版的计算方法的话，会导致各种尺寸恰好缺约5%
html {
//  font-size: 9.68992248062vh;
}

.map-div {
  width: 100%;
  height: 100%;
}

.change-theme {
  position: absolute;
  bottom: 30px;
  left: 30px;
  z-index: 999;
}

.change-theme2 {
  left: 80px;
}

.left-wrapper {
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  flex-flow: column;
  gap: 12px;
  height: calc(100% - 50px);

  .tree-wrapper {
    position: absolute;
    flex: 1;
    bottom: 8px;
    left: 0;
    height: calc(100% - 182px);
  }

  .tree-wrapper-alarm {
    position: absolute;
    flex: 1;
    bottom: 8px;
    left: 3.76rem;
    height: calc(100% - 332px);
  }
}

.playground-video {
  width: 100%;
  height: 100%;
}
</style>
