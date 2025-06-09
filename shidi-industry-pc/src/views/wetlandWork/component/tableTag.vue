<template>
  <div class="tableTag">
    <div class="btnlist">
      <el-button
        class="btn"
        size="small"
        type="danger"
        icon="el-icon-plus"
        :disabled="getIsAddExport"
        @click="changePageFunc('add')"
        >新增</el-button
      >
      <el-button
        class="btn"
        size="small"
        plain
        icon="el-icon-upload2"
        :disabled="!getIsAddExport"
        @click="exportFunc"
        >导出</el-button
      >
    </div>
    <div
      :class="tableLsit.length > 0 ? 'table-main table-main-height' :'table-main'"
    >
      <ATable :columns="getColumns" :tableLsit="tableLsit">
        <el-table-column
          slot="wetlandName"
          label="湿地名称"
          width="166"
          fixed="left"
        >
          <template slot-scope="scope">
            <div
              class="two-line-ellipsis"
              @click="changePageFunc('detail', scope.row)"
              style="color: #1890ff; cursor: pointer;"
              :title="getNamelonger(scope.row.wetlandName)"
            >
              {{ scope.row.wetlandName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column slot="imageList" label="图片" width="168">
          <template slot-scope="scope">
            <el-image
              class="table-img-size"
              :src="getTableImg(scope.row.imageList)"
              :preview-src-list="scope.row.imageList"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
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
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="tableDeleteBtn(scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </ATable>
    </div>
    <ct-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      top="30vh"
      custom-class="remindClass"
    >
      <div class="remind-box">
        <i class="el-icon-warning icon-waring" style=""></i>
        <span>此操作无法撤销，确定删除吗？</span>
      </div>
      <div class="dialog-footer">
        <ct-button size="small" type="primary" @click="deleteById(deleteRow)"
          >确 定</ct-button
        >
        <ct-button size="small" @click="dialogVisible = false">取 消</ct-button>
      </div>
    </ct-dialog>
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
      dialogVisible: false, //删除弹出框
      tableLsit: [],
      deleteRow: null, //删除数据
    };
  },
  computed: {
    getColumns() {
      let arrColum = this.logic.columns;
      if (this.tableLsit.length > 0) {
        arrColum[5].label = `湿地面积(${this.tableLsit[0].areaUnit})`;
      }
      return arrColum;
    },
    getIsAddExport() {
      return this.tableLsit.length > 0 ? true : false;
    },
  },
  created(){
    document.documentElement.style.setProperty('font-size', '100px')
  },
  mounted() {
    this.getTableDataList();
  },
  methods: {
    getNamelonger(data) {
      if (typeof data === 'string' && data.length > 12) {
        return data;
      } else {
        return '';
      }
    },
    /**
     * 列表图片处理
     */
    getTableImg(data) {
      if (data && data.length > 0) {
        return data[0]; //展示第一张
      } else {
        return "";
      }
    },
    /**
     * 打开新增编辑页
     */
    changePageFunc(type, row) {
      // this.$emit("changePage", type, row);
      this.creatRouteJump(type, row);
    },

    /**
     * 生成路由导航跳转
     */
    creatRouteJump(type, row) {
      let url =
        type != "detail"
          ? location.origin + "/industry-11181/wetlandWork/addInfo"
          : location.origin + "/industry-11181/wetlandWork/detailInfo";
      let title = null;
      if (type == "add") {
        title = "湿地信息新增";
      } else if (type == "edit") {
        title = "湿地信息编辑";
      } else {
        title = "湿地信息详情";
      }
      postMsgUtil.trigger(null, "redirectTo", {
        url: url, // 要打开的页面地址
        params: {
          originKey: type, // 来源的唯一标识，必须
          metaTitle: title, // 自定义tag标签标题
        },
      });
    },

    /**
     * 导出
     */
    async exportFunc() {
      let params = {
        reqMethod: "POST",
        url: "forest-wetland/wetland-info/export",
      };
      const fileParam = {
        fileType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileName: "湿地基础信息导出文件.xlsx",
        __ctCbAllCode: true,
      };
      return new Promise((resolve, reject) => {
        window
          .requestSDK(params.url, fileParam, {}, "post", "blob")
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 表格数据删除
     */
    tableDeleteBtn(row) {
      this.dialogVisible = true;
      this.deleteRow = row;
    },
    /**
     * 列表接口
     */
    async getTableDataList() {
      let res = await this.logic.getTableData();
      this.tableLsit = res || [];
    },
    /**
     * 列表删除
     */
    async deleteById(row) {
      await this.logic.deleteById(row);
      this.dialogVisible = false;
      this.getTableDataList();
    },
    detailBtnClick(type, row) {
      this.creatRouteJump(type);
      // this.$emit("details", row);
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
    height:auto;
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
  .table-main-height{
    // height:px-to-rem(200)
    height:160PX
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
    margin-top:px-to-rem(40);
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
