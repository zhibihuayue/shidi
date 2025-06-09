<template>
  <div class="tree">
    <basis-box name="古树名木统计" @isHandShow="(val)=>isHandShow(val)">
      <div class="tree-total">
        <div class="title">单位：株</div>
        <div class="echart-box">
          <div class="echart-box-content" ref="echarts"></div>
          <div class="echart-box-bottom"></div>
          <div class="bgc">
            <img src="@/assets/image/environment/tree-circle.png" alt="" />
          </div>
          <!-- 四个角 -->
          <img :src="item.icon" alt="" v-for="item in styleList" :class="[item.className]" :key="item.id">
        </div>
        <carousel v-if="listDataClone.length > 0" :list="listDataClone"></carousel>
      </div>
    </basis-box>
  </div>
</template>

<script>
import basisBox from "../module/basisBox.vue";
import { ancientTreesList } from "@/http/environment.js";
import { treeTotal } from "@/echarts";
import carousel from "@/common/page/carousel.vue"
export default {
  components: {
    basisBox,
    carousel
  },
  data() {
    return {
      listData: [
        {
          title: "一级古树",
          gradeType: 1,
          value: 0,
          proportion: 0,
          fillColor:
            "linear-gradient( 180deg, #3A77E5 0%, rgba(58,119,229,0.2) 100%)",
          itemStyle: { color: "#0090FF" },
          bgImage: require("@/assets/image/environment/imgIcon5.png"),
        },
        {
          title: "二级古树",
          gradeType: 2,
          value: 0,
          proportion: 0,
          fillColor:
            "linear-gradient( 180deg, #67C23A 0%, rgba(103,194,58,0.2) 100%)",
          itemStyle: { color: "#67C23A" },
          bgImage: require('@/assets/image/environment/imgIcon6.png')
        },
        {
          title: "三级古树",
          value: 0,
          gradeType: 3,
          proportion: 0,
          fillColor:
            "linear-gradient( 180deg, #FAD400 0%, rgba(250,212,0,0.2) 100%)",
          itemStyle: { color: "#FAD400" },
          bgImage: require('@/assets/image/environment/imgIcon7.png')
        },
        {
          title: "名木",
          gradeType: 0,
          value: 0,
          proportion: 0,
          fillColor:
            "linear-gradient( 180deg, #FF9A55 0%, rgba(255,154,85,0.2) 100%)",
          itemStyle: { color: "#FF9A55" },
          bgImage: require('@/assets/image/environment/imgIcon8.png')
        },
      ],
      listDataClone: [],
      styleList:[
        {icon:require("@/assets/image/environment/imgIcon1.png"),className:"left_top",id:1},
        {icon:require("@/assets/image/environment/imgIcon2.png"),className:"right_top",id:2},
        {icon:require("@/assets/image/environment/imgIcon3.png"),className:"right_bottom",id:3},
        {icon:require("@/assets/image/environment/imgIcon4.png"),className:"left_bottom",id:4}
      ]
    };
  },
  mounted(){
    this.getDataList();
  },
  methods: {
    async getDataList() {
      let res = await ancientTreesList();
      this.listData.forEach((item) => {
        res.data.forEach((option) => {
          if (item.gradeType == option.gradeType) {
            item.value = option.count;
            item.proportion = option.proportion;
          }
        });
      });
      let groupArr = JSON.parse(JSON.stringify(this.listData));
      groupArr.map(item=>item.valueUnit = item.value)
      this.listDataClone = [];
      for (let i = 0; i < groupArr.length; i += 3) {
        this.listDataClone.push(groupArr.slice(i, i + 3));
      }
      this.initEchart();
    },
    initEchart() {
      this.$nextTick(() => {
        var myChart = this.$echarts.init(this.$refs.echarts);
        myChart.setOption(treeTotal(this.listData));
      });
    },
    isHandShow(val){
      this.$emit("isHandShow",val)
    }
  },
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/px-to-rem";
.tree {
  width: 100%;
  display: flex;
  flex-direction: column;

  .tree-total {
    position: relative;
    z-index: 999;
    .title {
      position: absolute;
      top: px-to-rem(17);
      right:px-to-rem(33);
      color: #fff;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: px-to-rem(14);
    }
    width: 100%;
    height: px-to-rem(260);
    border-radius: px-to-rem(4);
    background-image: url("~@/assets/image/environment/circle-net.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-color: linear-gradient( 180deg, rgba(0,19,30,0.7) 0%, #00131E 100%);
    background-position: 40% 8%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: px-to-rem(12) px-to-rem(12) px-to-rem(2);
    .echart-box {
      width: 100%;
      height: 83%;
      border: px-to-rem(2) solid rgb(7, 47, 52);
      border-bottom: none;
      position: relative;
      z-index: 7;
      border-radius:px-to-rem(4);
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: px-to-rem(5);
      .echart-box-content {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;
        color: #fff;
        width: px-to-rem(325);
        height: px-to-rem(169);
        background-image: url("~@/assets/image/environment/tree-total-bgc.png");
        background-repeat: no-repeat;
        background-size: 17% auto;
        background-position: 50% 56%;
      }
      .echart-box-bottom {
        position: relative;
        bottom: px-to-rem(20);
        width: 100%;
        color: #fff;
        flex: 1;
        overflow: hidden;
        background-image: url("~@/assets/image/environment/tree-bottom.png");
        background-repeat: no-repeat;
        background-position: 50% 48%;
        background-size: 40% 100%;
      }
      .bgc {
        width: 41%;
        height: auto;
        position: absolute;
        top: px-to-rem(20);
        left: 50%;
        transform: translateX(-50%);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .left_top,.right_top,.left_bottom,.right_bottom{
        // width
        position: absolute;
      }
      .left_top{
        top:px-to-rem(-1);
        left:px-to-rem(-1)
      }
      .right_top{
        top:px-to-rem(-1);
        right:px-to-rem(-1)
      }
      .left_bottom{
        bottom:px-to-rem(-1);
        left:px-to-rem(-1)
      }
      .right_bottom{
        bottom:px-to-rem(-1);
        right:px-to-rem(-1)
      }
    }
    .data-list {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      box-sizing: border-box;
      .item {
        width: 45%;
        height: 50%;
        display: flex;
        justify-content: space-between;
        color: #fff;
        font-family: PingFangSC, PingFang SC;
        font-size: px-to-rem(16);
        padding-top: 2px;
        box-sizing: border-box;
        align-items: center;
        .item-left {
          .bgc_image {
            display: inline-block;
            width: px-to-rem(11);
            height: px-to-rem(11);
            margin-right: px-to-rem(6);
          }
          .text{
            font-size: px-to-rem(14);
            color:#C7FFFA
          }
        }
        .item-right {
          font-size: px-to-rem(16);
          font-family: PingFangSC;
          color: #c7fffa;
        }
        &:nth-child(1){
          background: url("~@/assets/image/environment/imgIcon5.png") no-repeat;
          background-position-y: 100%;
        }
        &:nth-child(2){
          background: url("~@/assets/image/environment/imgIcon6.png") no-repeat;
          background-position-y: 100%;
        }
        &:nth-child(3){
          background: url("~@/assets/image/environment/imgIcon7.png") no-repeat;
          background-position-y: 100%;
        }
        &:nth-child(4){
          background: url("~@/assets/image/environment/imgIcon8.png") no-repeat;
          background-position-y: 100%;
        }
      }
    }
  }
}
</style>