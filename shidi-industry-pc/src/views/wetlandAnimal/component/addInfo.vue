<template>
  <div class="info scrollBox">
    <el-form ref="form" :rules="getRules" :model="formData" label-width="115px">
      <!-- 病虫害预测 -->
      <div class="baseInfo">
        <info-title :titleName="'病虫害预测'" />
        <div class="fromMain">
          <el-row>
            <el-col :span="12">
              <el-form-item label="病虫害名称" prop="pestType" maxlength="50">
                <el-select
                  class="pestSelect"
                  v-model="formData.pestType"
                  placeholder="请输入病虫害名称"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in getPestTypeOption"
                    :key="'pest' + item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 风险等级 -->
      <div class="baseInfo">
        <info-title :titleName="'风险等级'">
          <template #info>
            <el-tooltip
              class="item"
              effect="dark"
              content="划分的阈值范围（下一个风险等级的起值等于上一个范围的终值，以保证数值的连续性）"
              placement="top-start"
            >
              <div class="icon">?</div>
            </el-tooltip>
          </template>
          <template #btn>
            <el-button
              style="position: absolute; right: 0"
              class="btn"
              size="small"
              type="danger"
              icon="el-icon-refresh-right"
              @click="handlerDefault('risk')"
              :disabled="disAbled.risk"
            >
              恢复默认值
            </el-button>
          </template>
        </info-title>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="fromMain riskFromMain no-padding">
              <el-form-item
                label=""
                prop="normalLow"
                label-width="0!important"
              >
                <div class="inputNumber">
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('normalLow')"
                    v-model="formData.normalLow"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>

              <div class="unit-desc">
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/right-equal.png"
                  alt=""
                />
                <span class="need-field">*</span
                ><span class="desc-content">正常值</span>
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/right-arrow.png"
                  alt=""
                />
              </div>
              <el-form-item
                label=""
                prop="normalHigh"
                label-width="0!important"
              >
                <div class="inputNumber">
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('normalHigh')"
                    v-model="formData.normalHigh"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="fromMain riskFromMain no-padding">
              <el-form-item
                label=""
                prop="earlyLow"
                label-width="0!important"
              >
                <div class="inputNumber">
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('earlyLow')"
                    v-model="formData.earlyLow"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>
              <div class="unit-desc">
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/right-equal.png"
                  alt=""
                /><span class="need-field">*</span
                ><span class="desc-content">预警值</span>
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/right-arrow.png"
                  alt=""
                />
              </div>
              <el-form-item
                label=""
                prop="earlyHigh"
                label-width="0!important"
              > 
                <div class="inputNumber">
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('earlyHigh')"
                    v-model="formData.earlyHigh"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="fromMain riskFromMain no-padding">
              <el-form-item
                label=""
                prop="warnLow"
                label-width="0!important"
              >
                <div class="inputNumber"> 
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('warnLow')"
                    v-model="formData.warnLow"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>
              <div class="unit-desc">
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/right-equal.png"
                  alt=""
                /><span class="need-field">*</span
                ><span class="desc-content">警戒值</span>
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/right-arrow.png"
                  alt=""
                />
              </div>
              <el-form-item
                label=""
                prop="warnHigh"
                label-width="0!important"
              >
                <div class="inputNumber">
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('warnHigh')"
                    v-model="formData.warnHigh"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="fromMain riskFromMain no-padding">
              <div class="unit-desc">
                <span class="need-field">*</span>
                <span class="desc-content">风险值</span>
                <img
                  class="arrow-img"
                  src="@/assets/image/arrow/left-equal.png"
                  alt=""
                />
              </div>
              <el-form-item
                label=""
                prop="riskLow"
                label-width="0!important"
              >
                <div class="inputNumber">
                  <el-input-number
                    :controls="false"
                    min=0
                    @blur="()=>blurNumber('riskLow')"
                    v-model="formData.riskLow"
                  >
                  </el-input-number>
                  <p class="unit">只/㎡</p>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 生态平衡情况 -->
      <div class="baseInfo">
        <info-title :titleName="'生态平衡情况'">
          <template #btn>
            <el-button
              style="position: absolute; right: 0"
              class="btn"
              size="small"
              type="danger"
              icon="el-icon-refresh-right"
              @click="handlerDefault('zoology')"
              :disabled="disAbled.zoology"
            >
              恢复默认值
            </el-button>
          </template>
        </info-title>
        <div class="fromMain">
          <el-row>
            <el-col :span="12">
              <el-form-item label="食物丰富度" prop="foodLevel">
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
                <el-select
                  v-model="formData.foodLevel"
                  placeholder="请选择食物丰富度"
                >
                  <el-option
                    v-for="item in getFoodLevel"
                    :key="'FL' + item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="天敌情况" prop="enemyLevel" maxlength="50">
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
                <el-select
                  v-model="formData.enemyLevel"
                  placeholder="请输入天敌情况"
                >
                  <el-option
                    v-for="item in getEnemyLevelOption"
                    :key="'EL' + item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 病虫害防治 -->
      <div class="baseInfo">
        <info-title :titleName="'病虫害防治'">
          <template #info>
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
          </template>
          <template #btn>
            <el-button
              style="position: absolute; right: 0"
              class="btn"
              size="small"
              type="danger"
              icon="el-icon-refresh-right"
              @click="handlerDefault('pestControl')"
              :disabled="disAbled.pestControl"
            >
              恢复默认值
            </el-button>
          </template>
        </info-title>
        <div class="fromMain">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="正常值防治建议"
                prop="normalAdvice"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入正常值防治建议"
                  v-model="formData.normalAdvice"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="正常值推荐药物"
                prop="normalMedicine"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入正常值推荐药物"
                  v-model="formData.normalMedicine"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="预警值防治建议"
                prop="earlyAdvice"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入预警值防治建议"
                  v-model="formData.earlyAdvice"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="预警值推荐药物"
                prop="earlyMedicine"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入预警值推荐药物"
                  v-model="formData.earlyMedicine"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="警戒值防治建议"
                prop="warnAdvice"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入警戒值防治建议"
                  v-model="formData.warnAdvice"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="警戒值推荐药物"
                prop="warnMedicine"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入警戒值推荐药物"
                  v-model="formData.warnMedicine"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="风险值防治建议"
                prop="riskAdvice"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入风险值防治建议"
                  v-model="formData.riskAdvice"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="风险值推荐药物"
                prop="riskMedicine"
              >
                <el-input
                  maxlength="50"
                  placeholder="请输入风险值推荐药物"
                  v-model="formData.riskMedicine"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="btn-list">
      <el-button type="danger" size="small" @click="saveBtn">确定</el-button>
      <el-button size="small" plain @click="dialogVisible.info = true">
        取消
      </el-button>
    </div>
    <!-- 取消提示 -->
    <ct-dialog
      title="提示"
      :visible.sync="dialogVisible.info"
      width="30%"
      top="30vh"
      custom-class="remindClass"
      class="dialog-header"
    >
      <div class="remind-box">
        <i class="el-icon-warning icon-waring" style=""></i>
        <span>确定取消对已编辑内容进行保存吗？</span>
      </div>
      <div class="dialog-footer">
        <ct-button size="small" type="primary" @click="closeFun"
          >确 定</ct-button
        >
        <ct-button size="small" @click="dialogVisible.info = false"
          >取 消</ct-button
        >
      </div>
    </ct-dialog>
    <ct-dialog
      title="提示"
      :visible.sync="dialogVisible.default"
      width="30%"
      top="30vh"
      custom-class="remindClass"
      class="dialog-header"
    >
      <div class="remind-box">
        <i class="el-icon-warning icon-waring" style=""></i>
        <span>是否恢复默认值</span>
      </div>
      <div class="dialog-footer">
        <ct-button size="small" type="primary" @click="handlerDefaultFunc"
          >确 定</ct-button
        >
        <ct-button size="small" @click="dialogVisible.default = false"
          >取 消</ct-button
        >
      </div>
    </ct-dialog>
  </div>
</template>

<script>
import infoTitle from "../common/infoTitle.vue"; //基础表头
import { postMsgUtil } from "@ct/iframe-connect-sdk";
import { tabelTagLogic } from "../logics/tableTag.js";
export default {
  name: "add-info",
  components: { infoTitle },
  data() {
    return {
      dialogVisible: { info: false ,default:false},
      disAbled: {
        risk: false,
        zoology: false,
        pestControl: false,
      },
      originKey: null,
      tableLogic: new tabelTagLogic(),
      dialogDefault:'',
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
    getRules() {
      return this.tableLogic.rules;
    },
    getPestTypeOption() {
      return this.tableLogic.pestTypeOption;
    },
    getFoodLevel() {
      return this.tableLogic.foodLevelOption;
    },
    getEnemyLevelOption() {
      return this.tableLogic.enemyLevelOption;
    },
    // 查找默认值
    typeTODefault() {
      const defaultFunc = (arrayMap) => {
        const data = arrayMap.find((e) => e.id === this.formData.pestType);
        return data.group;
      };
      const risk = defaultFunc(this.tableLogic.riskTypeData);
      const zoology = defaultFunc(this.tableLogic.zoologyTypeData);
      const pestControl = defaultFunc(this.tableLogic.pestControlType);

      return { risk, zoology, pestControl };
    },

    // 病虫害防治tip
    preventionControl(){
      return this.tableLogic.preventionControlTipList[this.formData.pestType]
    },

    //天敌情况tip
    naturalEnemyTip(){
      return this.tableLogic.naturalEnemyTipList
    },

    // 食物丰富度tip
    foodAbundanceTip(){
      return this.tableLogic.foodAbundanceTipList
    }
  },
  watch: {
    formData: {
      handler() {
        this.disAbled.risk = this.isDefaultCheck(this.typeTODefault.risk);
        this.disAbled.zoology = this.isDefaultCheck(this.typeTODefault.zoology);
        this.disAbled.pestControl = this.isDefaultCheck(
          this.typeTODefault.pestControl
        );
      },
      deep: true,
    },
  },
  created() {
    document.documentElement.style.setProperty("font-size", "100px");
  },
  async mounted() {
    this.originKey = this.getQueryString("originKey");
    this.initData(this.getQueryString("id"));
  },
  methods: {
    // 关闭
    closeFun() {
      postMsgUtil.trigger(null, "backToOrigin", {
        isClose: true,
        data: { originKey: this.originKey }, //originKey 来源的key
      });
    },

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

    // 初始化数据
    async initData(id) {
      let res = await this.tableLogic.getVoById({id:id});
      this.formData = {
        ...this.formData,
        ...res,
      };
    },
  
    /**
     * 关闭弹窗
     */
    closeForm(type) {
      this.$emit("changePage", type);
    },
    /**
     * 检查是否默认值
     * @param defaultData 默认数据
     */
    isDefaultCheck(defaultData) {
      let result = true;
      for (const key in defaultData) {
        if (defaultData[key] != this.formData[key]) {
          result = false;
        }
      }
      return result;
    },
    handlerDefault(type){
      this.dialogDefault = type
      this.dialogVisible.default = true
    },
    /**
     * 恢复默认值按钮
     * @param type 类型
     */
    handlerDefaultFunc() {
      if (this.dialogDefault === "risk") {
        this.formData = {
          ...this.formData,
          ...this.typeTODefault.risk,
        };
        this.disAbled.risk = true;
      } else if (this.dialogDefault === "zoology") {
        this.formData = {
          ...this.formData,
          ...this.typeTODefault.zoology,
        };
        this.disAbled.zoology = true;
      } else{
        this.formData = {
          ...this.formData,
          ...this.typeTODefault.pestControl,
        };
        this.disAbled.pestControl = true;
      }
      this.dialogVisible.default = false
    },
    async saveFunc(){
      await this.tableLogic.formEdit(this.formData);
      this.closeFun()
    },

    blurNumber(key){
      if(this.formData[key]!=null&&this.formData[key]!=''){
        let number = this.formData[key].toString()
        if(number.length>10){
          this.formData[key]=Number(number.substring(0,10))
        }
        if(this.formData[key]%1!=0){
          this.formData[key] = Number(this.formData[key].toFixed(2))
        }
      }
    },

    /**
     * 保存新增接口
     */
    async saveBtn() {
      // console.log(this.formData, "this.formData--");
      // const numberType = [
      //   "normalLow",
      //   "normalHigh",
      //   "earlyLow",
      //   "earlyHigh",
      //   "warnLow",
      //   "warnHigh",
      //   "riskLow",
      // ];
      // // 转化为number类型
      // for (const key in this.formData) {
      //   if (numberType.includes(key)) {
      //     if(this.formData[key]!=null&&this.formData[key]!=''){
      //       this.formData[key] = Number(this.formData[key]);
      //     }
      //   }
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveFunc()
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.info {
  width: 100%;
  height: 100%;
  padding: px-to-rem(28) px-to-rem(24) px-to-rem(70) px-to-rem(24);
  overflow: auto;

  .baseInfo {
    width: 100%;
    margin-bottom: px-to-rem(24);
    .title {
      ::v-deep .title-name {
        font-weight: 600;
      }
    }
    .fromMain {
      width: 100%;
      min-height: px-to-rem(56);
      background: #f5f7fa;
      border-radius: px-to-rem(4);
      padding: px-to-rem(0) px-to-rem(32);
      .pestSelect{
        ::v-deep .el-input__suffix{
          display: none;
        }
      }
      &.no-padding {
        ::v-deep .el-input-group__append {
          padding: 0 px-to-rem(12);
        }

        ::v-deep .el-input__inner {
          max-width: px-to-rem(100);
        }
        overflow: hidden;
        padding: 0 px-to-rem(15);
        display: flex;
        align-items: center;
        justify-content: center;

        .unit-desc {
          display: flex;
          height: 100%;
          font-size: px-to-rem(14);
          justify-content: center;
          align-items: center;
          .need-field {
            color:#FF6060
          }

          .desc-content {
            white-space: nowrap;
          }

          .arrow-img {
            width: px-to-rem(12);
            margin: 0 px-to-rem(12);
          }
        }
        .inputNumber{
          display:flex;
          align-items: center;
          border:px-to-rem(1) solid #d7d5d5;
          border-radius: px-to-rem(4);
          ::v-deep .el-input-number{
            width:auto;
            .el-input__inner{
              border:none
            }
          }
          .unit{
            white-space: nowrap;
            padding:0 px-to-rem(12);
            background-color: #F5F5F5;
            color: #909399;
            border-left:px-to-rem(1) solid #E5E5E5
          }
        }
      }
      .icon-blue {
        width: px-to-rem(72);
        color: #1890ff;
        font-size: px-to-rem(28);
        margin: 0 px-to-rem(28);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .riskFromMain{
      min-height: px-to-rem(80);
    }
    .infinite-box {
      display: flex;
      flex-wrap: wrap;
      .infinite {
        width: 50%;
      }
    }
    .map-icon {
      // width: 12%;
      color: #1890ff;
      margin-left: px-to-rem(12);
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .add-info-list {
      width: 100%;
      display: flex;
      align-items: center;
      margin: px-to-rem(10);
      margin-left: 0;
      .title {
        ::v-deep .title-name {
          font-weight: 600;
        }
      }
    }
  }
  .btn-list {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .fix-span {
    display: block;
    width: px-to-rem(40);
    height: px-to-rem(40);
    line-height: px-to-rem(40);
    color: #909399;
    background: #f5f7fa;
    border-radius: 0 px-to-rem(4) px-to-rem(4) 0;
    border: px-to-rem(1) solid #dcdfe6;
    text-align: center;
    border-left: 0;
  }

  /* 针对Chrome、Safari等浏览器 */
  ::v-deep input[type="number"]::-webkit-inner-spin-button, 
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* 针对Firefox浏览器 */
  ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }
}
::v-deep .merge-border {
  .el-form-item__content {
    > div {
      &:nth-child(1) {
        input {
          border-radius: px-to-rem(4) 0 0 px-to-rem(4);
        }
      }
      &:nth-child(2) {
        input {
          border-radius: 0 px-to-rem(4) px-to-rem(4) 0;
        }
      }
    }
  }
}
::v-deep .water-level {
  .el-input__inner {
    border-radius: px-to-rem(4) 0px 0px px-to-rem(4);
  }
}
::v-deep .el-form-item {
  margin: px-to-rem(12) 0;
  .el-form-item__content {
    display: flex;
    align-items: center;
    .el-select,
    .el-cascader,
    .el-input {
      flex: 1;
    }
    .ct-date-picker2 {
      flex: 1;
      > div {
        width: 100%;
      }
    }
    .acreage-info {
      width: px-to-rem(120);
    }
  }
}

.remind-box {
  display: flex;
  align-items: center;
  padding: px-to-rem(20);
  .icon-waring {
    color: #ffa940;
    font-size: px-to-rem(32);
  }
}
::v-deep .el-dialog__header {
  display: flex;
  border: px-to-rem(1) solid #ebeef5;
}
.remindClass {
  .dialog-footer {
    padding: px-to-rem(20);
    text-align: right;
    > div {
      margin-left: px-to-rem(12);
    }
  }
}
::v-deep .dialog-header {
  .el-dialog__header {
    border: none;
  }
}
::v-deep .el-dialog {
  border-radius: px-to-rem(4);
}
::v-deep .el-dialog__title {
  font-weight: 500;
  color: #303133;
}
.addInfoClass {
  .el-select-dropdown__item.hover {
    background: rgba(255, 106, 108, 0.1);
  }
}

::v-deep .el-dialog__body {
  padding: 0;
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
::v-deep .el-dialog__title {
  font-weight: bold;
}
.no-spinners ::-webkit-outer-spin-button,
.no-spinners ::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinners {
  -moz-appearance: textfield;
}
::v-deep .labelHight {
  > .el-form-item__label {
    line-height:px-to-rem(20);
  }
}

::v-deep .iconClass {
  .el-icon-arrow-up:before {
    content: "\e78f";
  }
  .el-input__inner {
    border-left: 0;
    &:focus {
      border-color: #bfbfbf;
    }
  }
  .is-focus {
    .el-input__inner {
      border-color: #bfbfbf !important;
    }
  }
}
::v-deep .icon-size {
  font-size: px-to-rem(20);
}
</style>
