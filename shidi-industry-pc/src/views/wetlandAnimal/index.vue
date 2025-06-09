<template>
  <div class="workbench">
    <component :is="'tableTag'"></component>
  </div>
</template>

<script>
import tableTag from "./component/tableTag.vue"; //表格页
import { getInfo } from "@/utils/index.js"; //获取token

export default {
  name: "work-bench",
  components: { tableTag },
  async mounted() {
    await getInfo();
  },
};
</script>
<style lang="scss" scoped>
.workbench {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
