<template>
    <div class="detailPop">
        <basis-box :name="nameText">
            <div class="selfArea">
                <img src="@/assets/image/common/close1.png" alt="" class="close" @click="closeDetail">
                <el-checkbox v-model="checked" class="checkBox" :indeterminate="indeterminate" @change="changeCheck">全选</el-checkbox>
            </div>
            <div class="mainContent">
                <div v-for="(item,index) in dataList" :key="index" class="singleList" @click="selectSingle(item.id)"  :class="[selectIndex.includes(item.id)?'selectOption':'']">
                    <div class="singleLeft">
                        <!-- 使用svg -->
                        <img :src='item.noSelectIcon' alt="" class="icon" v-if="!selectIndex.includes(item.id)" >
                        <!-- :style="{fill:item.mapColor}" -->
                        <svg xmlns="http://www.w3.org/2000/svg" v-else class="icon" xmlns:xlink="http://www.w3.org/1999/xlink" >
                            <defs>
                                <linearGradient :id="`myGradient${index}`" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" :style="{'stop-color':item.mapColor,'stop-opacity':0.1}" />
                                    <stop offset="100%" :style="{'stop-color':item.mapColor,'stop-opacity':1}" />
                                </linearGradient>
                            </defs>
                            <g>
                                <path :style="{fill:`url(#myGradient${index})`}" d="M8.66016,0L17.3204,5L17.3204,15L8.66016,20L-0.0000976324,15L-0.0000978708,5L8.66016,0ZM8.66016,1.1547L16.3204,5.57735L16.3204,14.4227L8.66016,18.8453L0.999902,14.4227L0.999902,5.57735L8.66016,1.1547ZM14.7223,6.5L8.66016,3L2.59798,6.5L2.59798,13.5L8.66016,17L14.7223,13.5L14.7223,6.5Z" fill-rule="evenodd"  fill-opacity="1"/>
                            </g>
                        </svg>
                        
                        <!-- 使用ilter: drop-shadow -->
                        <!-- <img :src='item.noSelectIcon' alt="" class="icon" :style="{filter:selectIndex.includes(item.id)?`drop-shadow(${item.mapColor} 0 0 0)`:''}"> -->
                        
                        <p>{{item.regionName}}</p>
                    </div>
                    <div class="singleRight">
                        <p class="num">{{item.regionArea}}</p>
                        <p class="unit">({{item.areaUnit}})</p>
                    </div>
                </div>
            </div>
        </basis-box>
    </div>
</template>

<script>
import basisBox from "@/views/module/basisBox.vue"
import {wetlandInfoDetail} from "@/http/environment.js"
import { iframeSDK } from "@ct/iframe-connect-sdk";
import { operationMap } from "@/common/page/operationMap.js"
export default {
    props:{
        detailData:{
            type:Object,
            default:null
        },
    },
    inject: ['mapRef'],
    components:{
        basisBox,
    },
    data(){
        return{
            checked:true,
            dataList:[],
            selectIndex:[],
            indeterminate:false,
            nameText:"",
            detailDataObj:null
        }
    },
    watch:{
        detailData:{
            handler(val){
                if(val.wetlandId){
                    this.nameText=val.name
                    this.getWetlandInfoDetail()
                }
            },
            deep:true,
            immediate:true
        },
        selectIndex:{
            handler(val){
                if(val.length==0||val.length==this.dataList.length){
                    this.indeterminate=false
                }else{
                    this.indeterminate=true
                }
                let point=this.detailDataObj.latitudeLongitude.split(",")||[]
                if(point&&point.length>0){
                    window.newMapClass.setMapZoom(9,[point[0],point[1]])
                    newMapClass.clearLayer()
                    this.mapLayer()
                }
            },
            deep:true
        }
    },
    mounted(){
        // 切换地图类型
        this.$globalEventBus.$on("common-comp-map__init-map-resolve", (val) => {
            if(val.status){
                this.init()
            }
        })
    },
    methods:{
        init(){
            window.wetlandMapObj=this.mapRef.getMapRef('wetland-map')  //地图组件实例
            window.newMapClass = new operationMap(window.wetlandMapObj);
            let point=this.detailDataObj.latitudeLongitude.split(",")||[]
            if(point&&point.length>0){
                setTimeout(()=>{
                    window.newMapClass.setMapZoom(9,[point[0],point[1]])
                    this.mapLayer()
                },2000)
            }
        },

        // 图层操作
        mapLayer(){
            let layerData=[]
            this.selectIndex.forEach(item=>{
                this.dataList.forEach(ite=>{
                    if(item==ite.id){
                        let mapDataList=ite.mapDataList||[]
                        mapDataList.forEach(it=>{
                            layerData.push(JSON.parse(it.mapData))
                        })
                    }
                })
            })
            newMapClass.EchoDrawing(layerData)
        },

        // 关闭
        closeDetail(){
            this.$emit("closeDetail")
        },

        //切换全选
        changeCheck(){
            if(this.checked){
                this.selectIndex=[]
                this.dataList.forEach(item=>{
                    this.selectIndex.push(item.id)
                })
            }else{
                this.selectIndex=[]
            }
        },

        //选择
        selectSingle(id){
            let index=this.selectIndex.indexOf(id)
            if(index>-1){
                this.selectIndex.splice(index,1)
                this.checked=false
            }else{
                this.selectIndex.push(id)
            }
            if(this.selectIndex.length==this.dataList.length){
                this.checked=true
            }
        },

        //获取详情
        async getWetlandInfoDetail(){
            let res=await wetlandInfoDetail({id:this.detailData.wetlandId,wetlandResourceType:this.detailData.type})
            if(res.code==200){
                this.detailDataObj=res.data
                this.dataHandle(res.data)
            }else{
                await iframeSDK( {
                    iframeOperationId: 'message',
                    message: "获取数据失败!",
                })
            }
        },

        // 数据处理
        dataHandle(data){
            this.dataList=data[this.detailData.dataType]
            this.selectIndex=[]
            this.checked=true
            this.indeterminate=false
            this.dataList.forEach(item=>{
                this.selectIndex.push(item.id)
                item.noSelectIcon=require("@/assets/image/newCommon/icon1.png")
                if(item.vegetationType){
                    item.regionName=item.vegetationType
                }
                if(item.vegetationArea){
                    item.regionArea=item.vegetationArea
                }
            })
            let point=data.latitudeLongitude.split(",")||[]
            if(point&&point.length>0){
                window.wetlandMapObj=this.mapRef.getMapRef('wetland-map')  //地图组件实例
                window.newMapClass = new operationMap(window.wetlandMapObj);
                window.newMapClass.setMapZoom(9,[point[0],point[1]])
                newMapClass.clearLayer()
                this.mapLayer()
            }
        },

        //清除标绘
        clearFun(){
            if(window.newMapClass){
                window.newMapClass.clearLayer()
                window.newMapClass=null
            }
            window.wetlandMapObj=null
        }
    },
    beforeDestroy(){
        this.clearFun()
        this.$globalEventBus.$off("common-comp-map__init-map-resolve")
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/px-to-rem';
.detailPop{
    width:px-to-rem(370);
    .selfArea{
        .close{
            position: absolute;
            width:  px-to-rem(38);
            height:  px-to-rem(38);
            right:  px-to-rem(-20);
            top:  px-to-rem(-20);
            transform: scale(0.7);
            cursor: pointer;
            z-index: 1;
        }
        .checkBox{
            position: absolute;
            right:  px-to-rem(12);
            top:  px-to-rem(15);
            display: flex;
            align-items: center;
            ::v-deep .el-checkbox__inner{
                width: px-to-rem(16);
                height: px-to-rem(16);
                border-color: rgba(2,137,109);
                background: rgba(2,137,109,0.7);
                box-shadow: inset 0px 0px px-to-rem(4) 0px #00BC95;
                border-radius:px-to-rem(4);
            }
            ::v-deep .is-checked{
                .el-checkbox__inner::after{
                    left:px-to-rem(-1) !important;
                    top: px-to-rem(0) !important;
                    border:none;
                    transform: none;
                    font-size: px-to-rem(16);
                    color:#fff;
                    font-family: 'iconfont_tools';
                    content: "\ed96";
                }
            }
            ::v-deep .is-indeterminate{
                margin-bottom:px-to-rem(2);
                .el-checkbox__inner::before{
                    border:none;
                    transform: none;
                    font-size: px-to-rem(15);
                    color:#fff;
                    font-family: 'iconfont_tools';
                    content: "\ed95";
                    position: initial;
                    background-color: transparent
                }
            }
            ::v-deep .el-checkbox__label{
                color:#fff
            }
        }
    }
    .mainContent{
        padding:0 px-to-rem(12);
        height:px-to-rem(192);
        overflow: auto;
        &::-webkit-scrollbar{
            display: none;
        }
        .singleList{
            font-size: px-to-rem(14);
            padding:px-to-rem(10) px-to-rem(0) px-to-rem(10) px-to-rem(5);
            color:#fff;
            background: url("~@/assets/image/newCommon/icon3.png") no-repeat;
            background-size: 100% 50%;
            background-position: 100% 100%;
            margin-top:px-to-rem(3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .singleLeft,.singleRight{
                display: flex;
                align-items: center;
                .icon{
                    width:px-to-rem(20);
                    height:px-to-rem(22);
                    margin-right:px-to-rem(5);
                }
                .num{
                    margin-right:px-to-rem(5);
                    font-size: px-to-rem(14);
                    color:#fff
                }
                .unit{
                    color:rgba(255,255,255,.7);
                    font-size: px-to-rem(14);
                }
            }
        }
        .selectOption{
            background: url("~@/assets/image/newCommon/icon5.png") no-repeat;
            background-size: 100% 50%;
            background-position: 100% 100%;
            .singleRight{
                .num{
                    color: #F9FF6C;
                    text-shadow: 0px 0px px-to-rem(18) rgba(0, 245, 193, 0.9);
                }
            }
        }
    }
    ::v-deep .boxClassTop .arrow{
        display: none;
    }
}
</style>