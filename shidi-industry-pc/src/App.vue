<!--
 * @Author: fanzhiwei
 * @Date: 2024-06-19 14:19:18
 * @LastEditors: fanzhiwei
 * @LastEditTime: 2024-06-25 19:25:28
 * @FilePath: /shidi-industry/shidi-industry-pc/src/App.vue
 * @Description: 
-->
<template>
  <div id="app">
    <router-view />
    <base-video-listener></base-video-listener>
  </div>
</template>

<script>
import MapRef from "./common/MapRef";

export default {
  name: "App",
  components: {},
  provide() {
    return {
      mapRef: new MapRef({
        onMapSet: this.onMapChange,
      }),
      mapFlag: () => this.mapFlag,
    };
  },
  data() {
    return {
      mapFlag: null, // 用于触发更新用的简易对象。这个对象仅仅用于刷新引用，里面的数据不具备任何意义。
    };
  },
  methods: {
    onMapChange() {
      this.mapFlag = {};
    },
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
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
img {
  vertical-align: top;
}

</style>
