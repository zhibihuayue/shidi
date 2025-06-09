<template>
  <div class="detail">
    <div class="common-title">
      <p class="title">病虫害预测</p>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">病虫害名称</div>
          <div class="right">
            {{ getNameByid(formData.pestType, getPestTypeOption) }}
          </div>
        </div>
      </div>
    </div>

    <div class="common-title">
      <p class="title">
        风险等级
        <el-tooltip
          class="item"
          effect="dark"
          content="划分的阈值范围（下一个风险等级的起值等于上一个范围的终值，以保证数值的连续性）"
          placement="top-start"
        >
          <div class="icon">?</div>
        </el-tooltip>
      </p>
      <div class="common-box">
        <div class="common-info-box">
          <div class="info-risk">
            {{
              `${formData.normalLow}只/m³ ≤ 正常值 ＜ ${formData.normalHigh}只/m³`
            }}
          </div>
          <div class="info-risk">
            {{
              `${formData.earlyLow}只/m³ ≤ 正常值 ＜ ${formData.earlyHigh}只/m³`
            }}
          </div>
          <div class="info-risk">
            {{
              `${formData.warnLow}只/m³ ≤ 正常值 ＜ ${formData.warnHigh}只/m³`
            }}
          </div>
          <div class="info-risk">
            {{ `风险值 ≥ ${formData.riskLow}只/m³` }}
          </div>
        </div>
      </div>
    </div>
    <div class="common-title">
      <p class="title">生态平衡情况</p>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">
            食物丰富度
            <el-tooltip
              class="item"
              effect="dark"
              placement="top-start"
            >
             <div slot="content">
                <p v-for="item in foodAbundanceTip" :key="item.id">{{item.label}}</p>
              </div>
              <div class="icon left-none">?</div>
            </el-tooltip>
          </div>
          <div class="right">
            {{ getNameByid(formData.foodLevel, getFoodLevel) }}
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">
            天敌情况
            <el-tooltip
              class="item"
              effect="dark"
              placement="top-start"
            >
              <div slot="content">
                <p v-for="item in naturalEnemyTip" :key="item.id">{{item.label}}</p>
              </div>
              <div class="icon left-none">?</div>
            </el-tooltip>
          </div>
          <div class="right">
            {{ getNameByid(formData.enemyLevel, getEnemyLevelOption) }}
          </div>
        </div>
      </div>
    </div>
    <div class="common-title">
      <p class="title">
        病虫害防治
        <el-tooltip
          class="item"
          effect="dark"
          placement="top-start"
        >
          <div slot="content">
            <p v-for="item in preventionControl" :key="item.id">{{item.label}}</p>
          </div>
          <div class="icon">?</div>
        </el-tooltip>
      </p>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">正常值防治建议</div>
          <div class="right">{{ formData.normalAdvice }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">正常值推荐药物</div>
          <div class="right">{{ formData.normalMedicine }}</div>
        </div>
      </div>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">预警值防治建议</div>
          <div class="right">{{ formData.earlyAdvice }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">预警值推荐药物</div>
          <div class="right">{{ formData.earlyMedicine }}</div>
        </div>
      </div>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">警戒值防治建议</div>
          <div class="right">{{ formData.warnAdvice }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">警戒值推荐药物</div>
          <div class="right">{{ formData.warnMedicine }}</div>
        </div>
      </div>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">风险值防治建议</div>
          <div class="right">{{ formData.riskAdvice }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">风险值推荐药物</div>
          <div class="right">{{ formData.riskMedicine }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tabelTagLogic } from "../logics/tableTag.js";
export default {
  data() {
    return {
      logic: new tabelTagLogic(),
      formData: {
        pestType: null,
        normalLow: null,
        normalHigh: null,
        earlyLow: null,
        earlyHigh: null,
        warnLow: null,
        warnHigh: null,
        riskLow: null,
        foodLevel: null,
        enemyLevel: null,
        normalAdvice: null,
        normalMedicine: null,
        earlyAdvice: null,
        earlyMedicine: null,
        warnAdvice: null,
        warnMedicine: null,
        riskAdvice: null,
        riskMedicine: null,
      },
    };
  },
  computed: {
    getPestTypeOption() {
      return this.logic.pestTypeOption;
    },
    getFoodLevel() {
      return this.logic.foodLevelOption;
    },
    getEnemyLevelOption() {
      return this.logic.enemyLevelOption;
    },

    // 病虫害防治tip
    preventionControl(){
      return this.logic.preventionControlTipList[this.formData.pestType]
    },

    //天敌情况tip
    naturalEnemyTip(){
      return this.logic.naturalEnemyTipList
    },

    // 食物丰富度tip
    foodAbundanceTip(){
      return this.logic.foodAbundanceTipList
    }
  },
  created(){
    document.documentElement.style.setProperty("font-size", "100px");
  },
  mounted() {
    this.initData(this.getQueryString("id"));
  },
  methods: {
    /**
     * 获取originKey
     */
    getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      return null;
    },
    getNameByid(id, arrayMap) {
      const obj = arrayMap.find((e) => e.id === id);
      if(obj){
        return obj.label;
      }
    },
    // 初始化数据
    async initData(id) {
      let res = await this.logic.getVoById({id:id});
      console.log(res, "res++++");
      this.formData = {
        ...this.formData,
        ...res,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.detail {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: px-to-rem(30);
  .common-title {
    width: 100%;
    margin: px-to-rem(15) 0;
    .title {
      display: flex;
      font-family: PingFangSC;
      align-items: center;
      font-weight: 600;
      font-size: px-to-rem(16);
      color: #303133;
      line-height: px-to-rem(16);
      text-align: left;
      font-style: normal;
      border-left: px-to-rem(3) solid #ff6a6c;
      padding-left: px-to-rem(10);
      margin-bottom: px-to-rem(10);
      .icon{
        font-size: px-to-rem(12);
        width: px-to-rem(12);
        height: px-to-rem(12);
      }
    }
    .common-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .common-box-item {
        width: 50%;
        display: flex;
        font-size: px-to-rem(14);
        font-family: PingFangSC;
        height: px-to-rem(56);
        border: 1px solid #ebeef5;
        .left {
          display: flex;
          align-items: center;
          justify-content: end;
          color: #606266;
          width: px-to-rem(164);
          font-size: px-to-rem(14);
          background-color: #f5f7fa;
          font-weight: 500;
          line-height: px-to-rem(56);
          padding-right: px-to-rem(12);
          text-align: right;
          font-style: normal;
          .icon {
            width: px-to-rem(12);
            height: px-to-rem(12);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: px-to-rem(12);
            background: #ffa940;
            position: relative;
            left: px-to-rem(7);
          }
        }
        .tooptip {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .right {
          // flex: 1;
          width: 70%;
          font-weight: 400;
          color: #606266;
          text-align: left;
          font-style: normal;
          padding: 0 px-to-rem(12);
          display: flex;
          align-items: center;
          img {
            width: px-to-rem(90);
            height: px-to-rem(60);
            margin-right: px-to-rem(10);
          }
        }
      }
      .common-info-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .info-risk {
          width: 24%;
          height: px-to-rem(56);
          // font-size: px-to-rem(14);
          font-size: px-to-rem(14);
          color: #606266;
          background-color: #f5f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
.btn-list {
  width: 100%;
  display: flex;
  justify-content: center;
}
.map-icon {
  // width: 12%;
  color: #1890ff;
  margin-left: px-to-rem(12);
  cursor: pointer;
}
.icon {
  width: px-to-rem(12);
  height: px-to-rem(12);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: px-to-rem(12);
  background: #ffa940;
  margin: 0 px-to-rem(10);
  &.left-none {
    margin-left: 0;
  }
}
::v-deep .el-dialog__body {
  padding: px-to-rem(20) px-to-rem(20);
}
::v-deep .el-dialog__header {
  display: flex;
  border: px-to-rem(1) solid #ebeef5;
}
::v-deep .el-dialog__title {
  font-weight: bold;
}
.two-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
