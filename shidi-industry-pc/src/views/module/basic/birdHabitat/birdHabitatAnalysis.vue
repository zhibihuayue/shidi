<template>
  <div class="analysis">
    <basis-box name="鸟类栖息地分析" @isHandShow="(val) => isHandShow(val)">
      <template v-slot:header>
        <div class="hh-css hh-select">
          <el-select
            v-model="bird"
            placeholder="请选择"
            @change="changeBird"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in birdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </template>
      <div class="analysis-total">
        <div class="echatBox">
          <div class="dis-title">
            <div class="left">亩</div>
          </div>
          <div class="echartMain" ref="discountChartMap"></div>
        </div>
        <div class="pieEchartBox">
          <div class="pie-unit">单位：亩</div>
          <img
            src="@/assets/image/newCommon/imgIcon7.png"
            class="circle"
            alt=""
          />
          <img
            src="@/assets/image/newCommon/imgIcon6.png"
            class="base"
            alt="底座"
          />
          <img
            src="@/assets/image/newCommon/imgIcon12.png"
            class="aperture"
            alt="光圈"
          />
          <div class="pieEchart" ref="pieEchart"></div>
        </div>
        <carousel :list="pieListClone" :showNum="false"></carousel>
      </div>
      <div class="habitat-change">
        <div class="table-title">栖息地变化</div>
        <div class="table">
          <div class="title">
            <div class="left">统计年度</div>
            <div class="center">斑块数变化<span class="unit">（个）</span></div>
            <div class="right">
              斑块面积变化<span class="unit">（亩）</span>
            </div>
          </div>
          <div v-if="list.length > 0" class="list">
            <div
              class="list-item-container"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="listItem">
                <div class="left">{{ item.coverageYear }}</div>
                <div class="center">
                  <div class="num">{{ item.plaqueCount }}</div>
                  <div class="num-chain">
                    <span>环比</span>
                    <img
                      :src="Number(item.plaqueDiff) >= 0 ? rise : descend"
                      alt="上升下降箭头"
                    />
                    <span>{{ Math.abs(item.plaqueDiff) }}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="right-num">
                    {{ item.allAreaStr || "-" }}
                  </div>
                  <div class="num-chain">
                    <span>环比</span>
                    <img
                      :src="item.areaRate >= 0 ? rise : descend"
                      alt="上升下降箭头"
                    />
                    <span>{{ item.areaDiffStr }}</span>
                  </div>
                </div>
              </div>
              <div class="underline"></div>
            </div>
          </div>
          <div v-else class="empty">
            <div class="empty-warp">
              <img
                class="emptyImg"
                src="@/assets/image/newCommon/imgIcon4.png"
                alt=""
              />
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </basis-box>
  </div>
</template>

<script>
import basisBox from "../../basisBox.vue";
import carousel from "@/common/page/carousel.vue";
import { discountChart, treeTotal } from "@/echarts";
import { operationMap } from "@/common/page/operationMap.js";
import { formattedValue } from "@/common/page/utils.js";
import {
  selectLayerList,
  statisticsSuitableAnalyse,
  statisticsSuitableChain,
  getBirdList,
} from "@/http/environment.js";
export default {
  inject: ["mapRef"],
  data() {
    return {
      bird: null,
      birdList: [],
      birdDiscountEchart: null,
      birdPieEcharts: null,
      // allArea: 9451,
      pieList: [
        // 饼状图下面的描述列表
        {
          title: "适宜生境",
          type1: "mostSuitableRate", // 适宜生境 占比
          type2: "mostSuitableCount", // 适宜生境 总数
          type3: "mostSuitableCountStr", // 适宜生境 总数(带单位)
          borderColor: "#0DC985",
          fillColor: "#0DC985",
          itemStyle: { color: "#0DC985" },
          proportion: 0,
          value: 0,
          valueUnit: "", // 带单位的值
          bgImage: require("@/assets/image/newCommon/imgIcon8.png"),
          filterAttrKey: "1",
        },
        {
          title: "较适宜生境",
          type1: "moreSuitableRate", // 较适宜生境 占比
          type2: "moreSuitableCount", // 较适宜生境 总数
          type3: "moreSuitableCountStr", // 较适宜生境 总数(带单位)
          borderColor: "#F9FF6C",
          fillColor: "#F9FF6C",
          itemStyle: { color: "#F9FF6C" },
          proportion: 0,
          value: 0,
          valueUnit: "", // 带单位的值
          bgImage: require("@/assets/image/newCommon/imgIcon9.png"),
          filterAttrKey: "2",
        },
        {
          title: "不适宜生境",
          type1: "notSuitableRate", // 不适宜生境 占比
          type2: "notSuitableCount", // 不适宜生境 总数
          type3: "notSuitableCountStr", // 不适宜生境 总数(带单位)
          borderColor: "#ED5158",
          fillColor: "#ED5158",
          itemStyle: { color: "#ED5158" },
          proportion: 0,
          value: 0,
          valueUnit: "", // 带单位的值
          bgImage: require("@/assets/image/newCommon/imgIcon10.png"),
          filterAttrKey: "3",
        },
        {
          title: "暂无数据",
          type1: "notDataRate", // 暂无数据 占比
          type2: "notDataCount", // 暂无数据 总数
          type3: "notDataCountStr", // 暂无数据 总数(带单位)
          borderColor: "#FFFFFF",
          fillColor: "#FFFFFF",
          itemStyle: { color: "#FFFFFF" },
          proportion: 0,
          value: 0,
          valueUnit: "", // 带单位的值
          bgImage: require("@/assets/image/newCommon/imgIcon11.png"),
        },
      ],
      pieListClone: [],
      dataObj: [], // 鸟类栖息地分析接口数据
      dataObj2: [], // 栖息地变化接口数据
      yData: [0, 0, 0, 0, 0],
      startTime: new Date().getFullYear(), // 选中的年份(默认当年年份)
      option: null, // 保存折线图的option
      rise: require("@/assets/image/newCommon/imgIcon3.png"),
      descend: require("@/assets/image/newCommon/imgIcon2.png"),
      list: [], // 栖息地变化列表
      layerList: [],
      mapRef_: this.mapRef,
      filterLayer: null, //筛选后要显示的图层
      selectedIndex: null, // 选中的小圆点下标(记录被点击的点)
      hoveredIndex: null, // 移入的小圆点下标(记录被移入的点)
    };
  },
  components: {
    basisBox,
    carousel,
  },
  watch: {
    mapRef_: {
      handler(val) {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
    window.addEventListener(
      "detailsPopupShowChange",
      this.changeDetailsPopupShow
    );
    this.changeMapSet();
  },
  methods: {
    // 初始化mapClass
    init() {
      this.clearWms();
      window.newMapClass = new operationMap(
        this.mapRef.getMapRef("wetland-map")
      );
      this.initData();
    },
    async initData() {
      await this.getSelectLayerList();
      await this.getBirdLists();
      await this.initBird();
      await this.getData();
      await this.getData2();
    },

    initBird() {
      if (!this.birdList.length) {
        return;
      }
      // 下拉选项有数据了 我才会做下面的记忆功能处理 并默认bird为1
      const localBird = localStorage.getItem("bird");
      if (localBird && Number(localBird)) {
        let obj = this.birdList.find((item) => item.value == Number(localBird));
        if (obj && obj.value) this.bird = obj.value;
      } else {
        this.bird = this.birdList[0].value;
        localStorage.setItem("bird", this.bird);
      }
    },

    async getBirdLists() {
      let res = await getBirdList();
      let obj = res.data;
      if (obj != undefined && obj != null) {
        const array = Object.entries(obj).map(([value, label]) => ({
          label,
          value: Number(value),
        }));
        this.birdList = JSON.parse(JSON.stringify(array));
      }
    },

    // 获取鸟类栖息地分析接口数据
    async getData() {
      if (!this.bird) return;
      let params = {
        type: this.bird,
      };
      let res = await statisticsSuitableAnalyse(params);
      let areaList = res.data || [];
      this.tempList =
        areaList.length &&
        areaList.sort((a, b) => a.coverageYear - b.coverageYear);
      this.xData = this.tempList.map((item) => item.coverageYear);
      this.yData = this.tempList.map((item2) => item2.allArea || 0);
      this.startTime = this.xData[this.xData.length - 1];
      const selectItem = this.birdList.find(
        (item3) => item3.value == this.bird
      );
      this.filterData(selectItem.label, this.startTime);
      this.getEcharts();
      await this.getPieListByStartTime();
    },

    // 获取栖息地变化列表
    async getData2() {
      if (!this.bird) return;
      let params = {
        type: this.bird,
      };
      let res = await statisticsSuitableChain(params);
      this.list = res.data || [];
      this.list.map((item) => {
        let tempAreaDiff =
          (item.areaDiffStr && item.areaDiffStr.split("万")) || [];
        console.log("tempAreaDiff", tempAreaDiff);
        if (tempAreaDiff.length) {
          let unit = tempAreaDiff.length == 2 ? "万" : "";
          item.areaDiffStr = Math.abs(Number(tempAreaDiff[0])) + unit;
        } else {
          item.areaDiffStr = 0;
        }
        item.plaqueDiff = item.plaqueDiff == null ? 0 : item.plaqueDiff;
      });
      // this.list = []
    },

    isHandShow(val) {
      this.$emit("isHandShow", val);
    },

    // 选择鸟类
    async changeBird() {
      localStorage.setItem("bird", this.bird);
      await this.getData();
      await this.getData2();
    },

    // 点击年份获取饼状图数据 处理鸟类栖息地接口数据（饼状图-筛选鸟类时分类展示）
    getPieListByStartTime() {
      let startTimeItem = this.tempList.find(
        (item) => item.coverageYear == this.startTime
      );
      this.pieList.map((item) => {
        let tempRate = startTimeItem[item.type1];
        item.proportion = tempRate;
        item.value = formattedValue(startTimeItem[item.type2] || 0);
        item.valueUnit = startTimeItem[item.type3] || "";
      });
      let groupArr = JSON.parse(JSON.stringify(this.pieList));
      groupArr.map((item) => {
        item.value = startTimeItem[item.type3] || 0;
      });
      this.pieListClone = [];
      for (let i = 0; i < groupArr.length; i += 3) {
        this.pieListClone.push(groupArr.slice(i, i + 3));
      }
      this.getPieEcharts();
    },

    // 折线图
    getEcharts() {
      if (this.birdDiscountEchart) this.birdDiscountEchart.dispose();
      this.option = discountChart("", "", this.xData, this.yData);
      this.birdDiscountEchart = this.$echarts.init(this.$refs.discountChartMap);
      this.birdDiscountEchart.setOption(this.option);
      // 获取数据点总数
      const dataLength = this.option.series[0].data.length;
      // 默认选中最近一年的数据小圆点
      const lastIndex = dataLength - 1;
      // 设置初始的小圆点大小
      this.initCircle(lastIndex);
      // 折线图点击时 选中的小圆点需要放大
      this.clickCircle();
      // 鼠标移入时改变圆点的大小
      this.mouseOverCircle(lastIndex);
      // 鼠标移出时恢复圆点的大小为6
      this.mouseOut(lastIndex);
    },

    // 设置初始小圆点大小
    initCircle(lastIndex) {
      // 设置初始的小圆点大小
      this.option.series[0].symbolSize = (_, params) => {
        if (
          this.selectedIndex !== null &&
          this.selectedIndex === params.dataIndex
        ) {
          return 10; // 被点击的小圆点
        } else if (lastIndex === params.dataIndex) {
          return 10; // 默认选中最近的一年
        } else {
          return 6;
        }
      };
      this.birdDiscountEchart.setOption(this.option, true); // 更新图表
    },

    // 点击小圆点时放大 同时选择年份
    async clickCircle() {
      this.birdDiscountEchart.on("click", async (params) => {
        this.startTime = params.name;
        this.changeTimeupdateLayer(this.startTime);
        if (params.componentType === "series") {
          // 更新选项
          this.selectedIndex = params.dataIndex;
          this.option.series[0].symbolSize = (_, params2) => {
            if (this.selectedIndex === params2.dataIndex) {
              return 10; // 被点击的小圆点
            } else {
              return 6; // 其它点
            }
          };
          // 点击的时候才出现X轴竖线的动效
          this.option.series[0].markLine.animation = true;
          this.option.series[0].markLine.data[0].xAxis = params.name;
          this.birdDiscountEchart.setOption(this.option, true); // 更新图表
        }
        await this.getPieListByStartTime();
      });
    },

    mouseOverCircle(lastIndex) {
      this.birdDiscountEchart.on("mouseover", (params) => {
        // 鼠标移入时放大该圆点
        this.hoveredIndex = params.dataIndex;
        this.option.series[0].symbolSize = (_, params2) => {
          if (
            this.selectedIndex == null &&
            lastIndex &&
            lastIndex == params2.dataIndex
          ) {
            return 10;
          } else if (this.hoveredIndex == params2.dataIndex) {
            return 10;
          } else if (this.selectedIndex === params2.dataIndex) {
            return 10;
          } else {
            return 6;
          }
        };
        // 移入的时候需要去掉X轴竖线的动效（重要！！！）
        this.option.series[0].markLine.animation = false;
        this.birdDiscountEchart.setOption(this.option, true);
      });
    },

    mouseOut(lastIndex) {
      this.birdDiscountEchart.on("mouseout", () => {
        // 鼠标移出时放大该圆点
        this.option.series[0].symbolSize = (_, params) => {
          if (
            this.selectedIndex == null &&
            lastIndex &&
            lastIndex == params.dataIndex
          ) {
            return 10;
          }
          if (this.selectedIndex == params.dataIndex) {
            return 10;
          } else {
            return 6;
          }
        };
        // 移入的时候需要去掉X轴竖线的动效（重要！！！）
        this.option.series[0].markLine.animation = false;
        this.birdDiscountEchart.setOption(this.option, true);
      });
    },

    // 饼状图
    getPieEcharts() {
      if (this.birdPieEcharts) this.birdPieEcharts.dispose();
      this.birdPieEcharts = this.$echarts.init(this.$refs.pieEchart);
      this.birdPieEcharts.setOption(treeTotal(this.pieList, ['10%', '20%']));
    },

    //地图操作事件回调(重新加载了地图)
    changeMapSet() {
      this.$globalEventBus.$on("common-comp-map__init-map-resolve", (val) => {
        if (
          val.status &&
          val.mapId == "wetland-map" &&
          window.newMapClass &&
          this.filterLayer
        ) {
          window.newMapClass = new operationMap(
            this.mapRef.getMapRef("wetland-map")
          );
          this.RenderingWms();
        }
      });
    },

    // 监听详情弹窗状态关闭选中
    changeDetailsPopupShow() {
      if (
        window.detailsPopupShow == false &&
        window.newMapClass &&
        window.newMapClass.wmsLayerObj
      ) {
        window.newMapClass.wmsLayerObj.clearselection();
      }
    },

    //获取图层列表
    async getSelectLayerList() {
      let params = {
        abbreviation: "syxpg",
        layerTypeId: null,
      };
      let res = await selectLayerList(params);
      if (res.code == 200) {
        this.layerList = res.data || [];
        let dictJson =
          this.layerList.length &&
          this.layerList[0].styles &&
          this.layerList[0].styles[0] &&
          this.layerList[0].styles[0].dictJson;
        this.styles = JSON.parse(dictJson) || [];
        // 容错处理 如果后端没有返回图例颜色 就取本地颜色
        if (!this.styles.length) return;
        console.log("this.styles:", this.styles)
        //  创建一个基于filterAttrKey的映射对象
        const stylesMap = this.styles.reduce((acc, style) => {
          acc[style.filterAttrKey] = style;
          return acc;
        }, {});
        for (let i = 0; i < this.pieList.length; i++) {
          const style = stylesMap[this.pieList[i].filterAttrKey];
          if (style) {
            this.pieList[i].borderColor = style.borderColor;
            this.pieList[i].fillColor = style.fillColor;
            this.pieList[i].itemStyle.color = style.fillColor;
          }
        }
        this.filterData();
      }
    },

    // 筛选数据
    filterData(name, year) {
      this.filterLayer = this.layerList.find((item) => {
        return item.customName == name;
      });
      //通过年和类型去筛选出数据，然后筛选出图层
      if (window.newMapClass) {
        if (window.newMapClass.wmsLayerObj) {
          this.changeTimeupdateLayer(year);
        } else {
          this.RenderingWms(year);
        }
      }
    },

    // 切换年份调用更新图层
    changeTimeupdateLayer(year) {
      if (this.filterLayer) {
        window.newMapClass.setMapZoom(9, [
          this.getCenter(this.filterLayer.maxx, this.filterLayer.minx),
          this.getCenter(this.filterLayer.maxy, this.filterLayer.miny),
        ]);
        window.newMapClass.updateLayer(this.filterLayer, year);
      }
    },

    // 渲染wms图层
    RenderingWms(year) {
      if (this.filterLayer) {
        setTimeout(() => {
          if(window.newMapClass){
            window.newMapClass.setMapZoom(9, [
              this.getCenter(this.filterLayer.maxx, this.filterLayer.minx),
              this.getCenter(this.filterLayer.maxy, this.filterLayer.miny),
            ]);
          }
        }, 2000);
        window.newMapClass.creatWMSLayer(this.filterLayer, year);
      }
    },

    // 获取中心点
    getCenter(max, min) {
      return ((Number(max) + Number(min)) / 2).toFixed(9);
    },

    // 清除wms图层
    clearWms() {
      if (window.newMapClass) {
        window.newMapClass.clearWmsLayer();
      }
    },

    destroyEcharts() {
      if (this.birdDiscountEchart) this.birdDiscountEchart.dispose();
      if (this.birdPieEcharts) this.birdPieEcharts.dispose();
    },
  },
  beforeDestroy() {
    this.destroyEcharts();
    this.clearWms();
    this.$globalEventBus.$off("common-comp-map__init-map-resolve");
  },
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/px-to-rem";

.analysis {
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  ::v-deep .boxClassTop {
    .hh-select {
      width: px-to-rem(142);
      height: px-to-rem(30);
      position: relative;
      right: px-to-rem(12);
    }
  }
  .analysis-total {
    position: relative;
    z-index: 999;
    width: 100%;
    box-sizing: border-box;
    padding: px-to-rem(12);

    .echatBox {
      width: 100%;
      height: px-to-rem(231);
      padding-bottom:px-to-rem(12);
      box-sizing: border-box;
      position: relative;
      .dis-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: px-to-rem(14);
        color: #ffffff;
        width: 100%;
        position: absolute;
        top: px-to-rem(18);
        .right {
          display: flex;
          align-items: center;
          .block {
            width: px-to-rem(8);
            height: px-to-rem(8);
            margin-right: px-to-rem(12);
            background-color: #47ffe6;
          }
        }
      }
      .echartMain {
        width: px-to-rem(350);
      }
    }
    .pieEchartBox {
      width: 100%;
      height: px-to-rem(202);
      display: flex;
      align-items: center;
      // border: 1px solid white;
      background-image: url("~@/assets/image/newCommon/imgIcon5.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      position: relative;
      justify-content: center;
      .pie-unit {
        color: #ffffff;
        font-size: px-to-rem(14);
        position: absolute;
        top: px-to-rem(12);
        left: px-to-rem(10);
      }
      .circle {
        width: px-to-rem(68);
        height: px-to-rem(68);
        position: absolute;
        top: px-to-rem(62);
        left: 50%;
        transform: translateX(-50%);
      }
      .base {
        width: px-to-rem(146);
        height: px-to-rem(51);
        position: absolute;
        bottom: px-to-rem(6);
        left: 50%;
        transform: translateX(-50%);
      }
      .aperture {
        width: px-to-rem(130);
        height: px-to-rem(130);
        position: absolute;
        top: px-to-rem(30);
        left: 50%;
        transform: translateX(-50%);
      }
      .pieEchart {
        position: absolute;
        top: px-to-rem(12);
        width: 100%;
        height: px-to-rem(156);
      }
    }
  }
  .habitat-change {
    position: relative;
    z-index: 999;
    width: 100%;
    padding: px-to-rem(0) px-to-rem(12) px-to-rem(12);
    height: px-to-rem(250);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .table-title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0px 0px 18px rgba(0, 245, 193, 0.9);
      margin-bottom: px-to-rem(12);
    }
    .table {
      flex: 1;
      width: 100%;
      // border: 1px solid white;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      // overflow-x: scroll;
      // overflow-y: scroll;
      .title {
        height: px-to-rem(38);
        display: flex;
        padding: 0 px-to-rem(6);
        align-items: center;
        font-size: px-to-rem(14);
        color: #ffffff;
        background: rgba(2,137,109,0.2);

        .left {
          width: px-to-rem(80);
          // border: 1px solid red;
        }
        .center {
          width: px-to-rem(120);
          // border: 1px solid red;
        }
        .unit {
         color:#fff;
        }
      }
      .list {
        width: 100%;
        flex: 1;
        // border: 1px solid red;
        overflow-x: scroll;
        overflow-y: scroll;
        .list-item-container {
          .listItem {
            width: max-content; // 确保项的宽度根据内容自动扩展
            display: flex;
            align-items: center;
            height: px-to-rem(38);
            font-size: px-to-rem(14);
            color: #ffffff;
            padding: 0 px-to-rem(6);
            .left {
              width: px-to-rem(80);
            }
            .center {
              display: flex;
              align-items: center;
              width: px-to-rem(120);
              .num {
                margin-right: px-to-rem(6);
              }
            }
            .right {
              display: flex;
              align-items: center;
              width: auto;
              .right-num {
                text-align: left;
                margin-right: px-to-rem(6);
              }
            }
            .num-chain {
              display: flex;
              align-items: center;
              flex: 1;
              color: #ffffff;
              img {
                width: px-to-rem(14);
                height: auto;
                margin: 0 px-to-rem(1);
              }
            }
          }
          .underline {
            border-bottom: px-to-rem(1) solid rgba(255, 255, 255, 0.2);
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
        color: #ffffff;
        .empty-warp {
          display: flex;
          flex-direction: column;
          text-align: center;
          .emptyImg {
            width: px-to-rem(68);
            height: px-to-rem(68);
            margin-bottom: px-to-rem(8);
          }
        }
      }
    }
  }
}
</style>
