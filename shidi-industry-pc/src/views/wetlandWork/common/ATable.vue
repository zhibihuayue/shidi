<template>
  <div style="height: 100%; flex: 1; overflow: auto">
    <el-table
      :data="tableLsit"
      :class="[tableLsit.length==0?'noTableList':'']"
      ref="multipleTable"
      style="width: 100%"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{
        'text-align': 'center',
        'color':'#606266',
        'background': '#f5f7fa',
        'font-family':'PingFangSC, PingFang SC',
      }"
      class="elTab"
      height="100%"
    >
      <template slot="empty">
        <!-- icon="receiving"
        iconColor="#cccccc" -->
        <el-empty
          :image="require('@/assets/image/workbench/empty.png')"
          :image-size="80"
          description="暂无数据"
          v-show="isEmpty"
        >
      </el-empty>
      </template>
      <template v-for="(item, index) in columns">
        <el-table-column
          :prop="item.porVal"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          v-if="item.type"
        >
          <template slot-scope="scope">
            <div
              v-if="item.porVal != 'operate'"
              :style="{ color: item.colorStyle }"
            >
              <div v-if="item.optionMap">
                {{ getMapData(item.optionMap, scope.row[item.porVal]) }}
              </div>
              <div v-else class="two-line-ellipsis" :title="getNamelonger(scope.row[item.porVal])">
                {{
                  scope.row[item.porVal] == null ? "--" : scope.row[item.porVal]
                }}
              </div>
            </div>
            <div v-else class="operate-btn">
              <p
                v-for="btn in item.operation"
                :class="btn.classNameList"
                :key="btn.id"
                @click="btn.event(scope.row)"
              >
                <i v-if="btn.icon" :class="btn.icon" class="icon-size"></i>
                <span>{{ btn.label }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <slot v-else :name="item.porVal" :item="item"></slot>
      </template>
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ATable",
  props: {
    tableLsit: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isEmpty() {
      return this.tableLsit.length == 0;
    },
  },
  methods: {
    getNamelonger(data) {
      if (typeof data === 'string' && data.length > 12) {
        return data;
      } else {
        return '';
      }
    },
    getMapData(arrMap, data) {
      if (data) {
        const label = arrMap.find((element) => element.id == data);
        return label.label;
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.two-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}
.algin-center {
  text-align: center;
}
.operate-btn {
  display: flex;
  justify-content: center;
  > p {
    margin: 0 px-to-rem(10);
    color: #1890ff;
    cursor: pointer;
    .icon-size {
      margin-right: px-to-rem(7);
      font-size: px-to-rem(12);
    }
  }
}
::v-deep .el-table__empty-block {
  min-height: px-to-rem(60);
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-table__empty-text {
    position: fixed !important;
    left: 45% !important;
    top: 40% !important;
    width: px-to-rem(100) !important;
    height: px-to-rem(40);
    line-height: px-to-rem(200);
    color: rgba(0, 0, 0, 0.25);
    font-size: px-to-rem(13);
  }
  .el-empty__image ,.el-empty__description{
    width:80PX;
    height: 80PX;
    margin-top:0;
    >p{
      line-height: 40PX;
    }
  }
  
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: px-to-rem(8) !important;
  height: px-to-rem(8) !important;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: px-to-rem(8);
  height: px-to-rem(8);
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: px-to-rem(3);
}
::v-deep .el-table__cell {
  text-align: center;
  // background: #f5f7fa !important;
  border: 1px solid #ebeef5 !important;
}
::-webkit-scrollbar {
  width: px-to-rem(8);
  height: px-to-rem(8);
  background-color: #e4e4e4;
  border-radius: px-to-rem(3);
}
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: px-to-rem(3);
}
::v-deep .el-table th.el-table__cell>.cell{
  font-weight: bold;
}

.noTableList{
  ::v-deep .is-scrolling-left{
    height:6px !important
  }
}
// ::v-deep .el-table--fit{
//   height:95%!important;;
//   .el-table__fixed,.el-table__fixed-right{
//     height:127PX !important;
//   }
// }
</style>
