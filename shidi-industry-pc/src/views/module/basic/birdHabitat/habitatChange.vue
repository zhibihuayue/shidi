<template>
  <div class="habitat">
    <basis-box name="栖息地变化" @isHandShow="(val) => isHandShow(val)">
      <div class="habitat-change">
        <div class="title">
          <div class="left">统计年度</div>
          <div class="center">斑块数变化</div>
          <div class="right">斑块面积变化<span class="unit">（亩）</span></div>
        </div>
        <div v-if="list.length > 0" class="list">
          <div class="listItem" v-for="(item, index) in list" :key="index">
            <div class="left">{{ item.coverageYear }}</div>
            <div class="center">
              <div class="num">{{ item.plaqueCount }}</div>
              <div
                class="num-chain"
                :style="{
                  color: Number(item.plaqueDiff) > 0 ? '#FF6060' : '#4ED1C8',
                }"
              >
                <span>环比</span>
                <img
                  :src="Number(item.plaqueDiff) > 0 ? rise : descend"
                  alt="上升下降箭头"
                />
                <span>{{ Math.abs(item.plaqueDiff) }}</span>
              </div>
            </div>
            <div class="right">
              <div class="num">{{ item.allAreaStr || '-' }}</div>
              <div
                class="num-chain"
                :style="{ color: item.areaRate > 0 ? '#FF6060' : '#4ED1C8' }"
              >
                <span>环比</span>
                <img
                  :src="item.areaRate > 0 ? rise : descend"
                  alt="上升下降箭头"
                />
                <span>{{ Math.abs(item.areaRate) }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <div class="empty-warp">
            <img class="emptyImg" src="@/assets/image/newCommon/imgIcon4.png" alt="">
            <span>暂无数据</span>
          </div>
          
        </div>
      </div>
    </basis-box>
  </div>
</template>
<script>
import basisBox from "../../basisBox.vue";
import { statisticsSuitableChain } from "@/http/environment.js";
export default {
  data() {
    return {
      rise: require("@/assets/image/newCommon/imgIcon3.png"),
      descend: require("@/assets/image/newCommon/imgIcon2.png"),
      list: [],
    };
  },
  components: {
    basisBox,
  },
  mounted() {
    this.getData();
  },
  methods: {
    isHandShow(val) {
      this.$emit("isHandShow", val);
    },
    async getData() {
      let params = {
        coverageType: 0, //图层类型 0-适应性评估
      };
      let res = await statisticsSuitableChain(params);
      console.log("res:", res);
      this.list = [...res.data];
      this.list.map((item) => {
        let tempRate = item.areaRate * 100;
        item.areaRate = tempRate.toFixed(2);
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "~@/assets/styles/px-to-rem";
.habitat {
  width: 100%;
  display: flex;
  flex-direction: column;
  .habitat-change {
    position: relative;
    z-index: 999;
    height: px-to-rem(338);
    width: 100%;
    padding: px-to-rem(12);
    display: flex;
    flex-direction: column;
    .title {
      width: 100%;
      height: px-to-rem(32);
      display: grid;
      grid-template-columns: 20% 30% 50%;
      align-items: center;
      text-align: center;
      font-size: px-to-rem(12);
      color: #ffffff;
      background: rgba(2, 137, 109, 0.2);
      border-bottom: px-to-rem(1) solid rgba(255, 255, 255, 0.2);
      padding-right: px-to-rem(6);
      .unit {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    .list {
      width: 100%;
      flex: 1;
      overflow-y: scroll;
      .num {
        margin-right: px-to-rem(12);
      }
      .listItem {
        width: 100%;
        display: grid;
        grid-template-columns: 20% 30% 50%;
        align-items: center;
        text-align: center;
        font-size: px-to-rem(12);
        color: #ffffff;
        padding: px-to-rem(5) 0;
        border-bottom: px-to-rem(1) solid rgba(255, 255, 255, 0.2);
        .center,
        .right {
          display: flex;
          align-items: center;
          justify-content: center;
          .num-chain {
            display: flex;
            align-items: center;
            img {
              width: px-to-rem(6);
              height: auto;
              margin: 0 px-to-rem(5);
            }
          }
        }
        .warp {
          display: flex;
          width: 85%;
          float: right;
        }
      }
    }
    .empty {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: px-to-rem(14);
      color: #FFFFFF;
      .empty-warp{
        display: flex;
        flex-direction: column;
        text-align: center;
        .emptyImg{
          width: px-to-rem(68);
          height: px-to-rem(68);
          margin-bottom: px-to-rem(8);
        }
      }
    }
  }
}
</style>
