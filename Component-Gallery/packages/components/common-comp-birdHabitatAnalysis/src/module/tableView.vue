// 表格组件
<template>
  <div class="table">
    <el-table
      :data="tableData"
      height="100%"
      header-row-class-name="headerRowStyle"
    >
      <template slot="empty">
        <div class="empty">
          <img
            src="@component-gallery/birdHabitatAnalysis/assets/image/imgIcon4.png"
            alt=""
          />
          <p class="text">暂无数据</p>
        </div>
      </template>
      <el-table-column
        label="统计年度"
        prop="coverageYear"
        width="70"
        align="left"
      >
      </el-table-column>
      <el-table-column label="斑块数变化 (个)" width="110" align="left">
        <template slot-scope="scope">
          <div class="num-chain">
            <div class="num">{{ scope.row.plaqueCount }}</div>
            <span>环比</span>
            <img
              :src="Number(scope.row.plaqueDiff) >= 0 ? rise : descend"
              alt="上升下降箭头"
            />
            <span>{{ Math.abs(scope.row.plaqueDiff) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="斑块面积变化 (亩)" width="140" align="left">
        <template slot-scope="scope">
          <div class="num-chain">
            <p class="num">{{ scope.row.allAreaStr || '-' }}</p>
            <span>环比</span>
            <img
              :src="scope.row.areaRate >= 0 ? rise : descend"
              alt="上升下降箭头"
            />
            <span>{{ scope.row.areaDiffStr }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rise: require('@component-gallery/birdHabitatAnalysis/assets/image/imgIcon3.png'),
      descend: require('@component-gallery/birdHabitatAnalysis/assets/image/imgIcon2.png')
    }
  },
  mounted() {
    console.log(111111111, this.tableData)
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
    .headerRowStyle {
      background: rgba(2, 137, 109, 0.2);
      color: #fff;
      th {
        padding: px-to-rem(6) 0;
      }
    }
    .el-table__row {
      background: transparent;
      color: #fff;
      .el-table__cell {
        padding: px-to-rem(7) 0;
        font-size: px-to-rem(12);
      }
    }
    background: transparent;
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

  .num-chain {
    display: flex;
    align-items: center;
    .num {
      margin-right: px-to-rem(6);
    }
    img {
      width: px-to-rem(14);
      height: auto;
      margin: 0 px-to-rem(2);
    }
  }
}
</style>
