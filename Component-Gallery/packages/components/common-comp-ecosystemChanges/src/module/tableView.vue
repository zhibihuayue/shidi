// 表格组件
<template>
  <div class="table">
    <el-table
      :data="tableData"
      height="100%"
      :key="keyIndex"
      header-row-class-name="headerRowStyle"
    >
      <template slot="empty">
        <div class="empty">
          <img
            src="@component-gallery/ecosystemChanges/assets/image/imgIcon4.png"
            alt=""
          />
          <p class="text">暂无数据</p>
        </div>
      </template>
      <el-table-column fixed align="left">
        <template slot="header">
          <div class="elHeadCon">
            <div class="headerCon1">{{ timeHandle[1] }}</div>
            <div class="headerCon2">{{ timeHandle[0] }}</div>
            <div class="headerLine"></div>
          </div>
        </template>
        <template slot-scope="scope">
          <p>{{ scope.row.type }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableHeadList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :align="item.align || 'center'"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableHeadList: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    timeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    timeList: {
      handler(val) {
        this.keyIndex += 1
      },
      deep: true
    }
  },
  computed: {
    timeHandle() {
      return this.timeList
    }
  },
  data() {
    return {
      keyIndex: 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.table {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  ::v-deep .el-table {
    .el-table__fixed {
      background: #01393f;
      &::before {
        height: 0;
      }
    }
    .headerRowStyle {
      background: rgba(2, 137, 109, 0.2);
      color: #fff;
      .is-hidden {
        .cell {
          padding-right: 0;
        }
      }
      .cell {
        height: px-to-rem(56);
        line-height: px-to-rem(56);
        width: px-to-rem(90);
      }
    }
    .el-table__row {
      background: transparent;
      color: #fff;
      .el-table__cell {
        font-size: px-to-rem(12);
        line-height: px-to-rem(56.5);
        height: px-to-rem(56.5);
      }
    }
    background: transparent;
    .el-table__header {
      width: auto !important;
    }
    th {
      padding: 0;
    }
    .el-table__cell {
      background: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      .cell {
        font-size: px-to-rem(14);
        white-space: nowrap;
      }
    }
    &::before {
      display: none;
    }
    .el-table__row:hover td {
      background: transparent;
      color: #fff;
    }
    .title {
      font-size: px-to-rem(14);
      white-space: nowrap;
      .unit {
        color: #fff;
      }
    }
    .el-table__empty-block {
      width: auto !important;
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: px-to-rem(68);
      }
      .text {
        line-height: px-to-rem(24);
        color: #fff;
      }
    }
  }
  .elHeadCon {
    white-space: nowrap;
    height: px-to-rem(56);
    font-size: px-to-rem(14);
    position: relative;
    width: 70px;
  }
  .headerCon1 {
    position: absolute;
    left: 0;
    bottom: px-to-rem(-12);
  }
  .headerCon2 {
    position: absolute;
    right: px-to-rem(15);
    top: px-to-rem(-12);
  }
  .headerLine {
    width: 0.01rem;
    height: 1.1rem;
    transform: rotate(-58deg) translateX(-50%);
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    top: -49%;
    left: 45%;
  }
}
</style>
