// 病虫害监控
<template>
  <div class="mainArea">
    <yearMonthDayTime :selectShow="false" moduleType="insectPest" :circleClose="false" timeType="day" :dateRangeProp="defaultTime" @changeTime="changeTime" :haveDataTime="timeRange"/>
    <div class="selectList selectArea_shidi">
        <el-select v-model="searchParams.deviceId" @change="changeOption"  popper-class="selectArea_shidi" placeholder="请选择" class="singleSelect">
            <el-option
            v-for="item in deviceList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="searchParams.trapId" @change="changeOption"  popper-class="selectArea_shidi"  placeholder="请选择" class="singleSelect">
            <el-option
            v-for="item in trapList"
            :key="item.deviceCode"
            :label="item.deviceName"
            :value="item.deviceCode">
            </el-option>
        </el-select>
    </div>
    <div class="lableList">
        <div v-for="item in labelList" :key="item.id" class="list">
            <p class="name">{{item.name}}</p>
            <el-tooltip class="item" effect="dark"  placement="top">
                <div slot="content" v-if="item.id==1">{{item.tip}}</div>
                <div slot="content" v-else>
                    <p v-for="(name,ind) in item.tip.split(';')" :key="ind">{{name}}</p>
                </div>
                <img src="@/assets/image/newCommon/imgIcon17.png" alt="">
            </el-tooltip>
        </div>
    </div>
    <div class="echartArea" ref="insectPestEcharts" v-if="!noData"></div>
    <p v-else class="noData">暂无数据</p>
    <p class="unit">日</p>
  </div>
</template>
<script>
import yearMonthDayTime from '@/common/page/yearMonthDayTime.vue'
import { insectPestLine } from '@/echarts'
import { pestPrediction , pestTimeList , pestLightDevice , pestLightLastDay , getVoByPestType} from '@/http/environment.js'
import { insectPestMap } from "@/common/page/mapClassUtils/insectPestMap.js";
import { mapState  , mapMutations } from "vuex"
import { formattedValue } from "@/common/page/utils.js";
import moment from "moment"
let mapClassObj = null
export default {
    inject: ["mapRef"],
    data(){
        return{
            labelList:[
                {name:"预测密度",id:1,tip:"预测密度是根据模型预测得出的每平方米虫口密度,单位:只/㎡"},
                {name:"风险等级",id:2,tip:""}
            ],
            myChart:null,
            mapRef_: this.mapRef,
            deviceList:[
                {name:"东亚飞蝗",id:0},
                {name:"芦苇尖蛾",id:1},
                {name:"松墨天牛",id:2},
                {name:"稻蓟马",id:3}
            ],
            trapList:[],
            searchParams:null,
            timeRange:[],
            defaultTime:"",
            warningLevelList:{
                0:"正常值",
                1:"预警值",
                2:"警戒值",
                3:"风险值"
            },
            foodLevelList:{
                0:'无',
                1:'低',
                2:'一般',
                3:'中等',
                4:'高'
            },
            enemyLevelList:{
                0:'无',
                1:'极少',
                2:'少',
                3:'中',
                4:'多'
            },
            suggestionKey:{
                0:'normalAdvice',
                1:'earlyAdvice',
                2:'warnAdvice',
                3:'riskAdvice'
            },
            drugKey:{
                0:"normalMedicine",
                1:"earlyMedicine",
                2:'warnMedicine',
                3:"riskMedicine"
            },
            dataInfo:null,
            tipList:[],
            noData:false
        }
    },
    components:{
        yearMonthDayTime
    },
    computed:{
        ...mapState(['insectPestMemory','insectPestDetailData']),
    },
    watch: {
        insectPestMemory:{
            handler(val){
                if(val){
                    this.searchParams = val
                    this.getMapData()
                }else{
                    const defaultObj = {
                        deviceId:this.deviceList[0].id,
                        deviceName:this.deviceList[0].name,
                        trapId:null,
                        trapName:'',
                        time:'',
                    }
                    this.searchParams =  defaultObj
                }
            },
            deep:true,
            immediate:true
        }
    },
    async created(){
        await this.pestLightDevice()
    },
    async mounted(){
        this.getVoByPestTypeFun()
        await this.getPestTimeList()
        await this.mapInit()
        if(!this.insectPestMemory){
            this.setInsectPestMemory(this.searchParams)
        }
    },
    methods:{
        ...mapMutations(['setInsectPestLegendShow','setInsectPestDetailsShow','setInsectPestDetailData','setInsectPestMemory']),
        // 初始化mapClass
        async mapInit() {
            mapClassObj = new insectPestMap(
                this.mapRef.getMapRef("wetland-map")
            )
            this.getPestLightLastDay()
        },

        // 清除图层
        clearLayer() {
            console.log(13241234,)
            if (mapClassObj) {
            console.log(444444444,)

                mapClassObj.clearLayer();
            }
        },

        // 获取诱捕器列表
        async pestLightDevice(){
            const res = await pestLightDevice()
            if(res.code==200){
                this.trapList = res.data||[]
                if(!this.searchParams.trapName){
                    this.searchParams.trapName = this.trapList[0].deviceName
                    this.searchParams.trapId = this.trapList[0].deviceCode
                }
                this.getPestLightLastDay()
            }
        },

        // 获取选择日期所有诱捕器数据
        async getPestLightLastDay(){
            this.clearLayer()
            if(this.trapList.length>0){
                let lightId = this.trapList.map(item=>item.deviceCode)
                let params={
                    pestType :this.searchParams.deviceId,
                    createTime:this.searchParams.time,
                    lightIds:lightId
                }
                const res=await pestLightLastDay(params)
                if(res.code==200){
                    let data = res.data || []
                    this.rederMap(data)
                }
            }
        },

        //将所选日期的所有诱捕器渲染到地图上
        rederMap(data){
            if(data.length>0){
                data.forEach(item=>{
                    let latitude = Number(item.latitude)
                    let longitude = Number(item.longitude)
                    if(item.lightId==this.searchParams.trapId){
                        mapClassObj.setMapZoom(9,[longitude,latitude])
                    }
                    mapClassObj.dragCircle([longitude,latitude],item)
                })
            }
        },  

        // 获取有数据时间
        async getPestTimeList(){
            let res = await pestTimeList()
            if(res.code==200){
                this.timeRange=res.data||[]
                if(this.searchParams.time){
                    this.defaultTime = this.searchParams.time
                }else{
                    this.defaultTime = this.timeRange&&this.timeRange[0]
                    this.searchParams.time = this.defaultTime
                }
            }
        },

        // 改变时间
        changeTime(val){
            this.searchParams.time=val
            this.getPestLightLastDay()
            this.setInsectPestMemory(this.searchParams)
        },

        // 下拉框选择
        changeOption(val){
            this.deviceList.forEach(item=>{
                if(item.id==val){
                    this.searchParams.deviceName=item.name
                    this.getPestLightLastDay()
                    this.filterVoByPestType()
                }
            })
            this.trapList.forEach(item=>{
                if(item.deviceCode==val){
                    this.searchParams.trapName=item.deviceName
                    this.getPestLightLastDay()
                }
            })
            this.setInsectPestMemory(this.searchParams)
        },

        // 渲染图表
        rederEcharts(params){
            this.destroyEcharts()
            this.myChart = this.$echarts.init(this.$refs.insectPestEcharts)
            //等级临界值
            this.myChart.setOption(insectPestLine(params))
            this.echartsFun(params)
        },

        // echarts点击
        echartsFun(data){
            this.myChart.on("click", async (params) => {
                data.selectIndex = params.name
                this.myChart.setOption(insectPestLine(data))
                let itemVal = this.dataInfo.outcomeVos.find(item=>{
                    let time = params.name
                    return time == moment(item.forecastDate).format('DD')
                })
                this.assembleInsectPestDetailData(this.dataInfo,itemVal)
                // 点击后重绘选中的诱捕器
                mapClassObj.reDraw(itemVal)
            })
        },

        // 地图详情数据组装
        assembleInsectPestDetailData(params,item){
            let { forecastVo } = params
            let data = {
                deviceName:this.searchParams.trapName,
                deviceNumber:this.searchParams.trapId,
                monitoringArea:'2827.43㎡',
                food:this.foodLevelList[forecastVo.foodLevel],
                naturaEnemy:this.enemyLevelList[forecastVo.enemyLevel],
                date:moment(item.forecastDate).format('yyyy-MM-DD'),
                density:formattedValue(item.pestNum)+"只/㎡",
                grade:this.warningLevelList[item.pestLevel],
                suggestion:forecastVo[this.suggestionKey[item.pestLevel]],
                drug:forecastVo[this.drugKey[item.pestLevel]]
            }
            this.setInsectPestDetailData(data)
        },

        // 清除echarts
        destroyEcharts() {
            if(this.myChart){
                this.myChart.dispose()
                this.myChart = null
            }
        },

        // 获取图标数据
        async getMapData(){
            let params = {
                pestType : this.searchParams.deviceId,
                createTime:this.searchParams.time,
                lightId:this.searchParams.trapId
            }
            const res = await pestPrediction(params)
            if(res.code==200){
                this.dataInfo=res.data
                this.handleFun(this.dataInfo)
                let item = this.dataInfo.outcomeVos.at(-1)
                this.assembleInsectPestDetailData(this.dataInfo,item)
            }
        },

        // 数据处理
        handleFun(data){
            let { forecastVo , outcomeVos } = data
            if(outcomeVos.length==0){
                this.noData=true
            }else{
                this.noData=false
            }
            let selectIndex = moment(outcomeVos.at(-1).forecastDate).format("DD")
            let yData = outcomeVos.map(item=>formattedValue(item.pestNum))
            let xData = outcomeVos.map(item=>moment(item.forecastDate).format('yyyy-MM-DD'))
            let levelList = [
                {name:"风险值",value:forecastVo.riskLow || 0},
                {name:"警戒值",value:forecastVo.warnLow || 0},
                {name:"预警值",value:forecastVo.earlyLow || 0},
                {name:"正常值",value:forecastVo.normalLow || 0}
            ]
            let warningLevel=outcomeVos.map(item=>this.warningLevelList[item.pestLevel])
            let pieces = [
                { gte:forecastVo.normalLow , lt: forecastVo.normalHigh ,  color: '#00B38E' }, // 第一段:正常值
                { gte: forecastVo.earlyLow , lt: forecastVo.earlyHigh  ,  color: '#FFE355' }, // 第二段：预警值
                { gte: forecastVo.warnLow , lt: forecastVo.warnHigh  , color: '#FF814F' }, // 第三段：警戒值
                { gte: forecastVo.riskLow , color: '#FF4C54' } // 第四段：风险值
            ]
            let params={
                name:this.searchParams.deviceName,
                levelList:levelList,
                xData:xData,
                yData: yData,
                selectIndex:selectIndex,
                pieces:pieces,
                warningLevel:warningLevel
            }
            this.$nextTick(()=>{
                this.rederEcharts(params)
            })
        },

        // 获取风险等级说明
        async getVoByPestTypeFun(){ 
           let res = await getVoByPestType()
           if(res.code==200){
            let data = res.data || []
            this.tipList = data
            this.filterVoByPestType()
           }
        },

        //筛选等级说明
        filterVoByPestType(){
            let list = this.tipList.find(item=>item.pestTypeStr==this.searchParams.deviceName)
            this.labelList[1].tip=list&&list.riskLevelStr&&list.riskLevelStr
        }
    },
    beforeDestroy(){
        this.setInsectPestDetailsShow(false)
        this.setInsectPestLegendShow(false)
        this.destroyEcharts()
        mapClassObj = null
    }
}
</script>
<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .mainArea{
        width:100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        .selectList{
            display: flex;
            margin-top:px-to-rem(10);
            justify-content: space-between;
            align-items: center;
            .singleSelect{
                width:px-to-rem(167)
            }
        }
        .lableList{
            margin:px-to-rem(10) 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .list{
                margin-left:px-to-rem(12);
                display: flex;
                align-items: center;
                .name{
                    color:#C7FFFA;
                    margin-right:px-to-rem(4);
                    font-size: px-to-rem(14);
                }
                img{
                    width: px-to-rem(9);
                    height: px-to-rem(9);
                    cursor: pointer;
                }
            }
        }
        .echartArea{
            flex:1;
            overflow: hidden;
        }
        .noData{
            flex:1;
            display: flex;
            overflow: hidden;
            align-items: center;
            justify-content: center;
        }
        .unit{
            position:absolute;
            bottom:px-to-rem(11);
            right:px-to-rem(35);
            color:#fff;
            font-size: px-to-rem(14);
        }
    }
</style>