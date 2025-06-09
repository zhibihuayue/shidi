<template>
  <div class="tableTag">
    <div class="btnlist">
      <el-button
        class="btn"
        size="small"
        plain
        icon="el-icon-upload2"
        @click="exportFunc"
        >导出</el-button
      >
    </div>
    <div
      :class="
        tableList.length > 0 ? 'table-main table-main-height' : 'table-main'
      "
    >
      <ATable :columns="getColumns" :tableLsit="tableList">
        <el-table-column
          slot="pestType"
          label="病虫害名称"
          fixed="left"
          width=166
        >
          <template slot-scope="scope">
            <div
              class="two-line-ellipsis"
              @click="changePageFunc('detail', scope.row)"
              style="color: #1890ff; cursor: pointer;"
            >
              {{ getNameByid(scope.row.pestType,getPestTypeOption) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="168">
          <template slot-scope="scope">
            <div class="btn-list">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="changePageFunc('edit', scope.row)"
              >
                编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </ATable>
    </div>
  </div>
</template>

<script>
import ATable from "../common/ATable.vue";
import { tabelTagLogic } from "../logics/tableTag.js";
// import { CtSearchTable } from "@ct/china-tower-tech-components-v2";
import { postMsgUtil } from "@ct/iframe-connect-sdk";
export default {
  name: "tableTag",
  components: { ATable },
  data() {
    return {
      logic: new tabelTagLogic(),
      isAddExport: false,
      headerAlign: "center",
      tableList: [],
      deleteRow: null, //删除数据
    };
  },
  computed: {
    getPestTypeOption() {
      return this.logic.pestTypeOption;
    },
    getColumns() {
      let arrColum = this.logic.columns;
      return arrColum;
    },
  },
  created() {
    document.documentElement.style.setProperty("font-size", "100px");
  },
  mounted() {
    this.getTableDataList();
  },
  methods: {
    getNameByid(id,arrayMap){
      const obj = arrayMap.find(e => e.id === id)
      if(obj){
        return obj.label;
      }
    },
    /**
     * 打开新增编辑页
     */
    changePageFunc(type, row) {
      this.creatRouteJump(type, row);
    },

    /**
     * 生成路由导航跳转
     */
    creatRouteJump(type, row) {
      let url =
        type != "detail"
          ? location.origin + "/industry-11181/wetlandAnimal/addInfo"
          : location.origin + "/industry-11181/wetlandAnimal/detailInfo";
      let title = null;
      if (type == "add") {
        title = "病虫害新增";
      } else if (type == "edit") {
        title = "病虫害编辑";
      } else {
        title = "病虫害详情";
      }
      console.log(row, "----row");
      postMsgUtil.trigger(null, "redirectTo", {
        url: url, // 要打开的页面地址
        params: {
          originKey: type, // 来源的唯一标识，必须
          metaTitle: title, // 自定义tag标签标题
          id: row.id,
        },
      });
    },

    /**
     * 导出
     */
    async exportFunc() {
      let params = {
        reqMethod: "GET",
        url: "forest-wetland/pestControlForecast/export",
      };
      const fileParam = {
        fileType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileName: "病虫害预测导出文件.xlsx",
        __ctCbAllCode: true,
      };
      return new Promise((resolve, reject) => {
        window
          .requestSDK(params.url, fileParam, {}, "get", "blob")
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
   
    /**
     * 列表接口
     */
    async getTableDataList() {
      let res = await this.logic.getTableData()
      this.tableList = res || [];
      this.tableDataHandle()
    },

    /**
     * 列表数据处理
     */
    tableDataHandle(){
      if(this.tableList.length>0){
        this.tableList.forEach(item=>{
          item.normalRangeInterval = `${item.normalLow} ≤ 正常值＜${item.normalHigh}只/㎡`
          item.earlyRangeInterval = `${item.earlyLow} ≤ 预警值＜${item.earlyHigh}只/㎡`
          item.warnRangeInterval = `${item.warnLow} ≤ 警戒值＜${item.warnHigh}只/㎡`
          item.riskRangeInterval = `风险值 ≥ ${item.riskLow}只/㎡`
        })
      }
    }
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
.tableTag {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .btnlist {
    width: 100%;
    display: flex;

    padding: px-to-rem(12);
  }
  .table-main {
    width: 100%;
    padding:0 px-to-rem(12);
    box-sizing: border-box;
    height: px-to-rem(340);
    .btn-list {
      width: 100%;
      display: flex;
      justify-content: center;
      color: #1890ff;
    }
    .table-img-size {
      max-width: px-to-rem(120);
      max-height: px-to-rem(78);
      cursor: pointer;
      ::v-deep {
        .el-icon-picture-outline {
          font-size: px-to-rem(48);
        }
      }
    }
  }
  .table-main-height {
    // height:px-to-rem(200)
  }
}
.remind-box {
  display: flex;
  align-items: center;
  .icon-waring {
    color: #ffa940;
    font-size: px-to-rem(32);
  }
}
.remindClass {
  .dialog-footer {
    margin-top: px-to-rem(40);
    text-align: right;
    > div {
      margin-left: px-to-rem(12);
    }
  }
}

::v-deep .el-dialog {
  border-radius: px-to-rem(4);
}

::v-deep .el-button--text {
  color: #1890ff;
}
::v-deep .el-dialog__header {
  display: flex;
}
::v-deep .el-dialog__title {
  font-weight: bold;
  color: #303133;
}
::v-deep .el-dialog__header {
  border: none;
}
</style>
