// 湿地资源统计
<template>
    <div class="resourceStatistics" ref="resourceStatistics">
        <basis-box name="湿地资源统计">
            <div class="mainContent">
                 <el-carousel trigger="click" :autoplay="false" arrow="never" v-loading="loading" >
                    <el-carousel-item v-for="(item,index) in chunkData" :key="index" class="chunkList">
                        <div  v-for="(ite,ind) in item" :key="index+'--'+ind" class="singleList" @click="selectOption(ite,index+'--'+ind)" :class="selectOptionIndex===(index+'--'+ind)?'selectSingle':''">
                            <div class="single">
                                <img :src="ite.icon" alt="">
                                <p class="num">{{ite.value}}</p>
                            </div>
                            <div class="nameArea" >
                                <p class="name" :c-tip="ite.name" c-tip-auto>{{ite.name}}</p>
                                <img src="@/assets/image/common/imgIcon18.png" alt="">
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </basis-box>
    </div>
</template>

<script>
import basisBox from "@/views/module/basisBox.vue"
import {resourceStatistics} from "@/http/environment.js"
import _ from 'lodash';
export default {
    components:{
        basisBox
    },
    data(){
        return{
            listData:[
                {name:"植被面积",value:"",type:"vegetation",icon:require("@/assets/image/common/imgIcon11.png"),dataType:"wetlandInfoVegetationList"},
                {name:"水域面积",value:"",type:"water",icon:require("@/assets/image/common/imgIcon12.png"),dataType:"waterRegionList"},
                {name:"湿地建筑物",value:"",type:"construction",icon:require("@/assets/image/common/imgIcon13.png"),dataType:"constructionRegionList"},
                {name:"人类活动",value:"",type:"humanActivities",icon:require("@/assets/image/common/imgIcon14.png"),dataType:"humanActivitiesRegionList"},
                {name:"区域",value:"",type:"region",icon:require("@/assets/image/common/imgIcon11.png"),dataType:"regionList"},
            ],
            chunkData:[],
            selectOptionIndex:null,
            loading:false
        }
    },
    mounted(){
        this.getStatistics()
    },
    methods:{
        //将数据分成多份
        handleFun(){
            this.chunkData=_.chunk(this.listData, 4);
            if(this.chunkData.length>0){
                this.loading=false
            }
        },

        // 数据处理
        dataProcessing(list){
            this.listData.forEach(item=>{
                list.forEach(val=>{
                    if(item.type==val.resourceType){
                        item.name=val.resourceName
                        item.value=(val.resourceArea||0)+(val.resourceUnit||'亩')
                        item.wetlandId=val.wetlandId
                    }
                })
            })
            this.handleFun()
        },

        //给其他数据添加底座图片
        setDataImg(list){
            list.forEach((item,index)=>{
                item.icon=this.listDataImg[index%4]
            })
        },

        // 获取资源统计数据
        async getStatistics(){
            this.loading=true
            let res=await resourceStatistics()
            if(res.code==200){
                this.dataProcessing(res.data||[])
            }else{
                this.handleFun()
            }
        },

        //点击详情
        selectOption(item,val){
            if(val!=this.selectOptionIndex){
                this.$emit("selectOption",item)
                this.selectOptionIndex=val
            }
        },

        //重置
        reset(){
            this.selectOptionIndex=null 
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .resourceStatistics{
        width:100%;
        position: relative;
        .mainContent{
            padding:0 px-to-rem(13);
            display: flex;   
            box-sizing: border-box;
            ::v-deep .el-carousel{
                width: 100%;
            }
            ::v-deep .el-carousel__container{
                height: px-to-rem(162);
            }
            ::v-deep .el-carousel__indicators{
                display: flex;
                .el-carousel__button{
                    background:#999;
                    border-radius: px-to-rem(10);
                }
                .is-active{
                    .el-carousel__button{
                        background:#F9FF6C
                    }
                }
            }
            // 加载中
            ::v-deep .el-loading-spinner{
                top:0
            }
            .chunkList{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                box-sizing: border-box;
                padding:0 0 px-to-rem(16) 0;
                .singleList{
                    background: url("~@/assets/image/common/imgIcon19.png") no-repeat;
                    background-size: 100% 100%;
                    cursor: pointer;
                    display: flex;
                    width:48%;
                    height: 50%;
                    box-sizing: border-box;
                    align-items: center;
                    .single{
                        position: relative;
                        flex:1;
                        height: 100%;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .num{
                            font-weight: 500;
                            width:100%;
                            text-align: center;
                            font-size: px-to-rem(16);
                            white-space: normal;
                            position: absolute;
                            color:#fff;
                            top: px-to-rem(20);
                            left:50%;
                            transform: translateX(-54%);
                            text-shadow: 0px 0px px-to-rem(8) rgba(0,245,193,.5);
                        }
                        img{
                            width:px-to-rem(90);
                            padding-bottom: px-to-rem(15);
                        }
                    }
                    .nameArea{
                        width:px-to-rem(80);
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                        .name{
                            font-weight: 500;
                            width:100%;
                            text-align: center;
                            position: relative;
                            height:100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            top: px-to-rem(20);
                            z-index: 1;
                            font-size: px-to-rem(14);
                            color:#fff;
                            text-shadow: 0px px-to-rem(1) px-to-rem(4) #24AB83;
                            border-image: linear-gradient(181deg, rgba(46, 255, 245, 0), rgba(46, 255, 245, 0), rgba(46, 255, 245, 0.46)) 1 1;
                        }
                        img{
                            width:100%;
                            height:auto;
                            scale: 1.3;
                        }
                    }
                }
                .selectSingle{
                    background: url("~@/assets/image/common/imgIcon19_s.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
        ::v-deep .el-carousel__indicator--horizontal{
            padding:px-to-rem(0) px-to-rem(4) px-to-rem(7) px-to-rem(4)
        }

        //拖动弹窗虚线
        .dragResize{
            &::before{
                outline:none;
            }
        }
    }
</style>