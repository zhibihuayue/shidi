<template>
  <div class="detail">
    <div class="common-title">
      <p class="title">基础信息</p>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">湿地名称</div>
          <div class="right" v-if="detailsInfo.wetlandName.length < 30">
            {{ detailsInfo.wetlandName }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="detailsInfo.wetlandName"
              placement="top-start"
            >
              <span class="two-line-ellipsis">{{
                detailsInfo.wetlandName
              }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">所在区域</div>
          <div class="right">{{ detailsInfo.regionNameList }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">经纬度</div>
          <div class="right">
            <span>{{ detailsInfo.latitudeLongitude }}</span>
            <div class="map-icon" @click="infoMapFunc(detailsInfo.areaUnit)">
              <i class="el-icon-location-outline icon-size"></i>
              <span>地图</span>
            </div>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">湿地类型</div>
          <div class="right" v-if="detailsInfo.wetlandTypeString.length < 30">
            {{ detailsInfo.wetlandTypeString }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="detailsInfo.wetlandTypeString"
              placement="top-start"
            >
              <span class="two-line-ellipsis">{{
                detailsInfo.wetlandTypeString
              }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">湿地面积</div>
          <div class="right">
            {{ detailsInfo.wetlandArea ? (detailsInfo.wetlandArea + detailsInfo.areaUnit) : '' }}
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">气候类型</div>
          <div class="right" v-if="detailsInfo.climateTypeString.length < 30">
            {{ detailsInfo.climateTypeString }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="detailsInfo.climateTypeString"
              placement="top-start"
            >
              <span class="two-line-ellipsis">{{
                detailsInfo.climateTypeString
              }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">建立时间</div>
          <div class="right">{{ detailsInfo.establishmentTime }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">所属单位</div>
          <div class="right" v-if="detailsInfo.ownerUnit.length < 30">
            {{ detailsInfo.ownerUnit }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="detailsInfo.ownerUnit"
              placement="top-start"
            >
              <span class="two-line-ellipsis">{{ detailsInfo.ownerUnit }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">保护等级</div>
          <div class="right">{{ detailsInfo.protectionLevelString }}</div>
        </div>
        <div class="common-box-item">
          <div class="left tooptip">
            <span>图片</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="最多上传5张图片，可上传png/jpg/gif/jpeg格式"
              placement="top-start"
            >
              <div class="icon">?</div>
            </el-tooltip>
          </div>
          <div class="right">
            <img
              v-for="(item, index) in detailsInfo.imageList"
              :key="index"
              :src="item"
              @click="openImgDail(item)"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="common-title" v-for="item in areaMapList" :key="item.type">
      <p class="title">{{item.name}}</p>
      <div class="common-box">
        <div
          v-for="(element, index) in item.childrenMap"
          :key="element.id"
          class="common-box-item"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="element.regionName"
            placement="top-start"
            :disabled="!(element.regionName&&element.regionName.length > 8)"
          >
            <div class="left two-line-ellipsis">{{ element.regionName }}</div>
          </el-tooltip>

          <div class="right">
            <span>{{ `${element.regionArea} ${element.areaUnit}` }}</span>
            <div class="map-icon" @click="infoMapFunc(element.areaUnit)">
              <i class="el-icon-location-outline icon-size"></i>
              <span>地图</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="common-title">
      <p class="title">植被信息</p>
      <div class="common-box">
        <div
          class="common-box-item"
          v-for="(item, index) in detailsInfo.wetlandInfoVegetationList"
          :key="index"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.vegetationType"
            placement="top-start"
            :disabled="!(item.vegetationType&&item.vegetationType.length > 8)"
          >
            <div class="left two-line-ellipsis">
              {{ item.vegetationType.split(";")[1] }}
            </div>
          </el-tooltip>
          <div class="right">
            <span>{{ `${item.vegetationArea} ${item.areaUnit}` }}</span>
            <div class="map-icon" @click="infoMapFunc(item.areaUnit)">
              <i class="el-icon-location-outline icon-size"></i>
              <span>地图</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="common-title">
      <p class="title">水文信息</p>
      <div class="common-box">
        <div class="common-box-item">
          <div class="left">丰水期</div>
          <div class="right" v-if="detailsInfo.highWaterPeriodList.length < 5">
            {{
              detailsInfo.highWaterPeriodList.length > 0
                ? detailsInfo.highWaterPeriodList.join("、")
                : ""
            }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${detailsInfo.highWaterPeriodList}`"
              placement="top-start"
            >
              <span>{{
                detailsInfo.highWaterPeriodList.slice(0, 10) + "..."
              }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">平均水位</div>
          <div class="right">{{ detailsInfo.averageWaterLevel ? (detailsInfo.averageWaterLevel + " 米") : '' }}</div>
        </div>
        <div class="common-box-item">
          <div class="left">枯水期</div>
          <div class="right" v-if="detailsInfo.lowWaterPeriodList.length < 5">
            {{
              detailsInfo.lowWaterPeriodList.length > 0
                ? detailsInfo.lowWaterPeriodList.join("、")
                : ""
            }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${detailsInfo.lowWaterPeriodList}`"
              placement="top-start"
            >
              <span>{{
                detailsInfo.lowWaterPeriodList.slice(0, 10) + "..."
              }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">平均水位</div>
          <div class="right">
            {{ detailsInfo.averageLowWaterLevel ? (detailsInfo.averageLowWaterLevel + " 米") : '' }}
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">平水期</div>
          <div
            class="right"
            v-if="detailsInfo.normalWaterPeriodList.length < 5"
          >
            {{
              detailsInfo.normalWaterPeriodList.length > 0
                ? detailsInfo.normalWaterPeriodList.join("、")
                : ""
            }}
          </div>
          <div class="right" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${detailsInfo.normalWaterPeriodList}`"
              placement="top-start"
            >
              <span>{{
                detailsInfo.normalWaterPeriodList.slice(0, 10) + "..."
              }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="common-box-item">
          <div class="left">平均水位</div>
          <div class="right">
            {{ detailsInfo.averageNormalWaterLevel ? (detailsInfo.averageNormalWaterLevel + " 米") : '' }}
          </div>
        </div>
      </div>
    </div>
    <el-dialog top="7vh" :visible.sync="dialogVisible.img" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- 经纬度 -->
    <el-dialog
      :title="'地图'"
      :visible.sync="dialogVisible.infoMap"
      width="50%"
      top="18vh"
    >
      <mapComponentVue
        v-if="dialogVisible.infoMap"
        ref="ctMapFunc"
        :drawEchoDataProp="getAllmapList"
        :currentOperationStatus="'detail'"
        :reviewMapName="'湿地区域'"
        :LatLonCenter="getLatitudeLongitude"
        :areaUnit="getAreaUnit"
      />
    </el-dialog>
  </div>
</template>

<script>
import mapComponentVue from "../common/mapComponent.vue";
import { tabelTagLogic } from "../logics/tableTag.js";
import { requestSDK,iframeSDK } from "@ct/iframe-connect-sdk";
export default {
  components: { mapComponentVue },
  data() {
    return {
      logic: new tabelTagLogic(),
      dialogImageUrl:'',
      detailsInfo: {
        wetlandName: "",
        wetlandTypeString: "",
        climateTypeString: "",
        ownerUnit: "",
        wetlandArea:null,
        areaUnit:'亩',
        highWaterPeriodList: [],
        lowWaterPeriodList: [],
        normalWaterPeriodList: [],
        mapList: [],
        latitudeLongitude:null,
        averageWaterLevel:null,
        averageLowWaterLevel:null,
        averageNormalWaterLevel:null,
      },
      areaMapList: [
        //操作数组
        {
          type: "constructionRegionList",
          name: "建筑信息",
          listType: 1,
          childrenMap: [],
        },
        {
          type: "humanActivitiesRegionList",
          name: "人类活动信息",
          listType: 2,
          childrenMap: [],
        },
        {
          type: "regionList",
          name: "区域信息",
          listType: 3,
          childrenMap: [],
        },
        {
          type: "waterRegionList",
          name: "水域信息",
          listType: 0,
          childrenMap: [],
        },
      ],
      infoMapList: null,
      areaUnit:'亩',
      dialogVisible: {
        img:false,
        infoMap: false,
        highWaterPeriodList: [],
        lowWaterPeriodList: [],
        normalWaterPeriodList: [],
      },
    };
  },
  computed: {
    getAreaUnit() {
      return this.areaUnit;
    },
    getAllmapList() {
      const arrMap =
        this.detailsInfo.mapList.length > 0
          ? this.detailsInfo.mapList.map((item) => {
              return JSON.parse(item.mapData);
            })
          : [];
      return arrMap;
    },
    getLatitudeLongitude(){
      let latitudeLongitude = null
      if(this.detailsInfo.latitudeLongitude){
        latitudeLongitude = this.detailsInfo.latitudeLongitude.split(',')
      }
      console.log(latitudeLongitude,'latitudeLongitude');
      return latitudeLongitude
    },
  },
  async mounted() {
    const arrTableData = await this.logic.getTableData();
    if (arrTableData && arrTableData.length > 0) {
      this.detailsInfo = arrTableData[0];

      const formMap = {
        regionList: this.detailsInfo.regionList,
        waterRegionList: this.detailsInfo.waterRegionList,
        constructionRegionList: this.detailsInfo.constructionRegionList,
        humanActivitiesRegionList: this.detailsInfo.humanActivitiesRegionList,
      };
      this.areaMapList.forEach((item) => {
        item.childrenMap = formMap[item.type];
      });

    }
    console.log("detailsInfo11111111111", this.detailsInfo);
  },
  methods: {
    openImgDail(data){
      this.dialogVisible.img = true
      this.dialogImageUrl = data
    },
    /**
     * 经纬度获取弹窗
     */
    infoMapFunc(data) {
      this.dialogVisible.infoMap = true;
      this.areaUnit = data
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
      font-family: PingFangSC;
      font-weight: 600;
      font-size: px-to-rem(26);
      color: #303133;
      line-height: 24px;
      text-align: left;
      font-style: normal;
      border-left: px-to-rem(6) solid #ff6a6c;
      padding-left: px-to-rem(10);
    }
    .common-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: px-to-rem(25);
      .common-box-item {
        width: 50%;
        display: flex;
        font-size: px-to-rem(21);
        font-family: PingFangSC;
        height: px-to-rem(80);
        border: 1px solid #ebeef5;
        .left {
          color: #606266;
          width: 30%;
          background-color: #f5f7fa;
          font-weight: 500;
          line-height: px-to-rem(80);
          padding-right: px-to-rem(25);
          text-align: right;
          font-style: normal;
          .icon {
            width: px-to-rem(22);
            height: px-to-rem(22);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: px-to-rem(17);
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
          line-height: px-to-rem(80);
          text-align: left;
          font-style: normal;
          padding: 0 px-to-rem(25);
          display: flex;
          align-items: center;
          img {
            width: px-to-rem(90);
            height: px-to-rem(60);
            margin-right: px-to-rem(10);
          }
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
::v-deep .el-dialog__body{
  padding:20PX 20PX;
}
::v-deep .el-dialog__header {
  display: flex;
  border: 1px solid #ebeef5;
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
