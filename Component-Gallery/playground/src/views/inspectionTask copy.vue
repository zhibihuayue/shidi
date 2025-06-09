<template>
  <div id="app">
    <div class="btn-group">
      <el-button @click="changeTheme">切换主题</el-button>
      <el-button @click="showInspectionTaskList">显示巡查任务</el-button>
      <el-button @click="changePosition">切换位置</el-button>
    </div>
    <div class="left-wrapper">
      <d-weather v-bind="weatherProp" />
    </div>
  </div>
</template>

<script>
import DWeather from '@component-gallery/weather'
import MapRef from '../MapRef'
import { requestSDK } from '@ct/iframe-connect-sdk'

let themeIndex = 0
export default {
  name: 'App',
  provide: {
    mapRef: new MapRef(),
    hasAlarmList: true // 注入，通知远程组件们这个大屏有告警列表
  },
  components: {
    [DWeather.name]: DWeather,
  },
  data() {
    return {
      top: 0,
      left: 0,
      showInspectionTask: true,
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
      currentSelectFunction: [
        // {
        //   id: 8
        // }
      ],
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
  created() {
    const qsObj = parseQueryString(window.location.search)
    sessionStorage.setItem('VIEW_ID', qsObj.viewId)
    // this.getUserToken()
    // this.$globalEventBus.$off(`common-comp-horn-tree__select-footer-menu`)
  },

  mounted() {
    this.$globalEventBus.$on(
      `common-comp-inspection-task-list__expand-change`,
      (res) => {
        console.log('🚀 ~ mounted ~ res:', res)
      }
    )
    this.changeTheme()
    // this.$globalEventBus.$on(
    //   `common-comp-horn-tree__select-footer-menu`,
    //   (params) => {
    //     console.log(params, 'params')
    //     this.isAlarm = params.visible
    //   }
    // )
  },
  methods: {
    pxToRem(px) {
      return `${px / 100}rem`
    },
    showInspectionTaskList() {
      this.showInspectionTask = !this.showInspectionTask
      // 抛出巡查任务列表显隐状态改变事件
      this.$globalEventBus.$emit(
        `common-comp-inspection-task-list__show-status-change`,
        { showInspectionTask: this.showInspectionTask }
      )
      // this.$globalEventBus.$emit(`common-comp-layer-control__marker-select`, {
      //   deviceCode: '11010800831327000020'
      // })
    },
    changePosition() {
      this.open = !this.open
      window._remoteMetadata.videoPositionRight = this.open ? 480 : 110
      this.$globalEventBus.$emit(`screenview__updateVideoOffset`, {
        open: this.open
      })
    },
    changeTheme() {
      if (themeIndex === 0) {
        this.title = ''
        this.titleWl = ''
        this.titleWRJ = ''
        this.titleLb = ''
        this.titleRadar = ''
        this.titleGrid = ''
        this.sourceTitle = ''
        this.titleWGY = ''
        document.documentElement.setAttribute('data-theme', `theme-aquamarine`)
        this.$globalEventBus.$emit('data-theme', 'theme-aquamarine')
        console.log('林业')
      } else if (themeIndex === 1) {
        this.title = ''
        this.titleWl = ''
        this.titleWRJ = ''
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
        this.titleWRJ = ''
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
      const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiIl0sInVzZXJfbmFtZSI6IndlYl9tYW5hZ2V8eWFuZ3NodWFpLXNkIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTc0MzU5NTcwMSwidXNlcklkIjoiNTFmYzExNDZhZDA3NDJkMmE1OGFmMTU3Y2YwNGU4YmIiLCJqdGkiOiI3NDY0NTMyYS0xNWViLTQ4MTgtYjYxZi1jNWM1MTEzOTkwZjciLCJjbGllbnRfaWQiOiJ3ZWJfbWFuYWdlIn0.B7EG2pIdEMqpBvhZmz4XmIh0YcLiXJr-F23X-MCXNrrj2fgLP_4A8Rjk5LiUrSLmWzStr5ZLP50ZHLOZbP-NoCFILJJgUYHa_3r19aLz-UV9_LsJbjphu6Ts5uMclTY9bZRlI2werQ5Y-CTtkbacYrcDMwMtg6aABSpxqEYYgbo-pcVg5-y8I63umyevBvANBAvRA5oEVWq5IufPSIcVWDXS1oiO0W3wxq4oTdiFXSUu9cafFXaDCk8SsR54r4MWp8mYU0X0qm6ldVwzCy9ZK0VzCOGz3gdoaJVFaMZQmMVlqvhnMPdxQY1Vnu2xDXONWhGqSVYeRXi3L16p63k0VA'


      // this.getInfo().then((resp) => {
      //   console.log(resp, 'resprespresp')
      //   if (resp.code == 200) {
      //     sessionStorage.setItem(TokenKey, resp.user.token)
      //   } else {
      sessionStorage.setItem(TokenKey, token)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
html,
body,
#app {
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
// html {
// font-size: 9.68992248062vh;
// }

.map-div {
  width: 100%;
  height: 100%;
}

.btn-group {
  position: absolute;
  bottom: 20px;
  left: 12px;
  display: flex;
  gap: 3px;
  z-index: 3000;
}

.left-wrapper {
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  flex-flow: column;
  gap: 12px;
  height: calc(100% - 100px);

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

.inspection-tasks-container {
  position: absolute;
  right: 0.24rem;
  top: 20px;
  bottom: 0.36rem;
  background-color: #2c3e50;
}
</style>
