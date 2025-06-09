// 湿地基础信息
<template>
    <div class="wetlandFoundation">
        <basis-box name="湿地基础信息">
            <div class="mainContent">
                <div v-for="item in listData" :key="item.id" class="single">
                    <p class="label">{{item.label}}:</p>
                    <div v-if="item.type!='imageList'" class="tooltipArea">
                        <p  class="text" :c-tip="item.value" c-tip-auto>{{item.value}}</p>
                    </div>
                    <div v-else class="imgList">
                        <div class="list" v-for="ite in imgList.length>3?3:imgList.length" :key="ite+'a'" @click="previewFun(ite-1)">
                            <el-image
                                :src="imgList[ite-1]"
                            >
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                            <p v-if="imgList.length>3&&ite==3" class="sign">+{{imgList.length-2}}</p>
                            <p class="model" v-if="ite==3&&imgList.length>3"></p>
                        </div>
                    </div>
                </div>
            </div>
        </basis-box>
        <el-image-viewer v-if="showPreview" :on-close="onClose" :url-list='imgList' :initial-index="initialIndex"></el-image-viewer>
    </div>
</template>

<script>
import basisBox from "@/views/module/basisBox.vue"
import {basicInformation} from "@/http/environment.js"
import elImageViewer from "element-ui/packages/image/src/image-viewer"  //单独引用elementUI中的预览组件
export default { 
    components:{
        basisBox,
        elImageViewer
    },
    data(){
        return{
            listData:[
                {label:"湿地名称",value:"",type:"wetlandName",id:1},
                {label:"所在区域",value:"",type:"regionName",id:2},
                {label:"保护级别",value:"",type:"protectionLevel",id:3},
                {label:"湿地面积",value:"",type:"wetlandArea",id:4},
                {label:"图片",type:"imageList",id:5}
            ],
            imgList:[],
            showPreview:false,
            initialIndex:0
        }
    },
    mounted(){
        this.getBasicInfo()
    },
    methods:{
        // 获取基础信息
        getBasicInfo(){
            basicInformation().then(res=>{
                if(res.code==200){
                    let data=res.data
                    this.listData.forEach(item=>{
                        if(item.type=='imageList'){
                            this.imgList=data[item.type]||[]
                        }else if(item.type=='wetlandArea'){
                            if(data.areaUnit){
                                item.value=data[item.type]+data.areaUnit
                            }
                        }
                        else{
                            item.value=data[item.type]||""
                        }
                    })
                }
            })
        },

        // 关闭预览
        onClose(){
            this.showPreview=false
        },

        // 预览图片
        previewFun(index){
            this.initialIndex=index
            this.showPreview=true
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .wetlandFoundation{
        width:100%;
        .mainContent{
            height:px-to-rem(214);
            padding:px-to-rem(12);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .single{
                display: flex;
                position: relative;
                .label{
                    color:rgba(255,255,255,0.7);
                    margin-right:px-to-rem(13);
                    width:px-to-rem(70);
                    text-align: right;
                    font-size: px-to-rem(16);
                }
                .tooltipArea{
                    flex:1;
                    overflow: hidden;
                    .text{
                        white-space: nowrap;
                        overflow: hidden;
                        width:100%;
                        text-overflow: ellipsis;
                        color:#fff;
                        font-size: px-to-rem(16);
                    }
                    .selectTooltip{
                        display: block;
                    }
                    .text:hover ~.tooltip{
                        display: block;
                    } 
                }
                .imgList{
                    display: flex;
                    align-items: center;
                    .list{
                        position: relative;
                        cursor: pointer;
                        width:px-to-rem(70);
                        height:px-to-rem(70);
                        margin-right:px-to-rem(5);
                        ::v-deep .el-image{
                            width:100%;
                            height:100%;
                            display: block;
                            object-fit: contain;
                            border:none;
                            border-radius: px-to-rem(5);
                            .image-slot{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 100%;
                                height: 100%
                            }
                            .el-icon-picture-outline{
                                font-size: px-to-rem(40);
                            }
                        }
                        .sign{
                            color:#fff;
                            font-size: px-to-rem(16);
                            position: absolute;
                            pointer-events: none;
                            top:50%;
                            left:50%;
                            z-index: 1;
                            transform: translate(-50%,-50%);
                        }
                        .model{
                            width:100%;
                            height: 100%;
                            pointer-events: none;
                            background: rgba(0,0,0,0.5);
                            position: absolute;
                            left:0;
                            top:0
                        }
                    }
                }
                &:not(:last-child){
                    margin-bottom:px-to-rem(8)
                }
            }
        }
    }
    //预览组件关闭样式
    ::v-deep .el-image-viewer__btn{
        opacity: 1;
    }
    ::v-deep .el-image-viewer__close{
        background:url("~@/assets/image/common/close1.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width:px-to-rem(30);
        height:px-to-rem(30);
        transform: scale(0.8);
        &::before{
            content:'';
        }
        .el-icon-close{
            display:none
        }
    }
    // // 预览组件下一张样式
    ::v-deep .el-image-viewer__next{
        background: rgba(2, 50, 32, 0.7);
        .el-icon-arrow-right{
            // display:none;
             &::before{
                content:url("~@/assets/image/common/imgIcon52.png") ;
                position: absolute;
                top: 50%;
                left:50%;
                transform: translate(-50%,-45%);
            }
        } 
    }
    // // 预览组件上一张样式
    ::v-deep .el-image-viewer__prev{
        background: rgba(2, 50, 32, 0.7);
        .el-icon-arrow-left{
            // display:none;
            &::before{
                content:url("~@/assets/image/common/imgIcon51.png") ;
                position: absolute;
                top: 50%;
                left:50%;
                transform: translate(-50%,-45%);
            }
        }
        
    }
    // // 预览组件底部操作样式
    ::v-deep .el-image-viewer__actions{
        display: none;
    }
</style>