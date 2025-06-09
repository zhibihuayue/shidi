// 设备信息统计
<template>
    <div class="resourceStatistics">
        <basis-box name="设备信息统计">
            <div class="mainContent">
                <div v-for="item in topListData" :key="item.id" class="topList" :style="{backgroundImage:'url('+item.bgImg+')'}">
                    <div class="list_left">
                        <img :src="item.icon" alt="" class="iconImg">
                        <p class="name">{{item.name}}</p>
                    </div>
                    <div class="list_right">
                        <p class="numTotal">{{item.num}}</p>
                        <div v-for="(ite,ind) in item.list" :key="item.id+'--'+ind" class="singleList" :class="['singleList'+ind]">
                            <div class="single">
                                <p class="box" :style="{background:ite.color}"></p>
                                <p class="name">{{ite.name}}</p>
                            </div>
                            <p class="num">{{ite.num}}台</p>
                        </div>
                    </div>
                </div>
                <div v-for="(item,index) in bottomListData" :key="item.id" class="bottomList" :class="['bottomList'+index]" :style="{backgroundImage:'url('+item.bgImg+')'}">
                    <img :src="item.icon" alt="" class="iconImg">
                    <div class="list_right">
                        <p class="num">{{item.num}}</p>
                        <p class="name">{{item.name}}</p>
                    </div>
                </div>
            </div>
        </basis-box>
    </div>
</template>

<script>
import basisBox from "@/views/module/basisBox.vue"
import {deviceInformation} from "@/http/environment.js"
export default {
    components:{
        basisBox
    },
    data(){
        return{
            topListData:[
                {name:"摄像机",id:1,icon:require("@/assets/image/common/imgIcon24@2.png"),num:0,type:"deviceCountTotal",list:[
                    {name:"在线",num:0,type:"devCountOnline",color:"#0DC985"},
                    {name:"离线",num:0,type:"devCountOffline",color:"rgba(67,200,143,0.4)"},
                ],bgImg:require("@/assets/image/common/imgIcon20.png")},
                {name:"气象站",id:2,icon:require("@/assets/image/common/imgIcon25@2.png"),num:0,type:"iotDeviceCount",list:[
                    {name:"在线",num:0,type:"iotDeviceOnlineCount",color:"#FF703D"},
                    {name:"离线",num:0,type:"iotDeviceOfflineCount",color:"rgba(255,112,61,0.4)"},
                ],bgImg:require("@/assets/image/common/imgIcon21.png")}
            ],
            bottomListData:[
                {name:"诱捕器",num:0,id:3,type:"trapCount",icon:require("@/assets/image/common/imgIcon26@2.png"),bgImg:require("@/assets/image/common/imgIcon22.png")},
                {name:"野保相机",num:0,id:4,type:"wildProtectionCameraCount",icon:require("@/assets/image/common/imgIcon27@2.png"),bgImg:require("@/assets/image/common/imgIcon23.png")}
            ]
        }
    },
    mounted(){
        this.getDeviceInfo()
    },
    methods:{
        // 获取设备信息统计数据
        getDeviceInfo(){
            deviceInformation().then(res=>{
                if(res.code==200){
                    let data=res.data
                    this.topListData.forEach(item=>{
                        item.num=data[item.type]||0
                        item.list.forEach(val=>{
                            val.num=data[val.type]||0
                        })
                    })
                    this.bottomListData.forEach(item=>{
                        item.num=data[item.type]||0
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .resourceStatistics{
        width:100%;
        .mainContent{
            padding:px-to-rem(6) px-to-rem(13);
            display: flex;   
            box-sizing: border-box;
            flex-wrap: wrap;
            justify-content: space-between;
            .topList{
                display: flex;
                width:px-to-rem(166);
                height:px-to-rem(110);
                align-items: center;
                margin:px-to-rem(6) 0;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                .list_left{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .name{
                        font-size: px-to-rem(14);
                        margin-top:px-to-rem(5);
                        color: #FFFFFF;
                    }
                }
                &:nth-child(1) .list_left{
                    .name{
                        text-shadow: 0px 2px 4px #43C88F;
                    }
                }
                &:nth-child(2) .list_left{
                    .name{
                        text-shadow: 0px 2px 4px #FF703D;
                    }
                }
                .list_right{
                    .numTotal{
                        font-size: px-to-rem(18);
                        color: #FFFFFF;
                        padding-bottom:px-to-rem(7);
                    }
                    .singleList{
                        display: flex;
                        align-items:center;
                        justify-content: space-between;
                        margin:px-to-rem(0) px-to-rem(6) px-to-rem(6) 0;
                        padding:px-to-rem(2) 0;
                        box-sizing: border-box; 
                        .single{
                            display: flex;
                            align-items:center;
                            .box{
                                width:px-to-rem(6);
                                margin-right:px-to-rem(4);
                                border-radius: px-to-rem(1);
                                height: px-to-rem(6);
                            }
                            .name{
                                font-size: px-to-rem(14);
                                color: #FFFFFF;
                            }
                            
                        }
                        .num{
                            font-size: px-to-rem(14);
                            color: #FFFFFF;
                        }
                    }
                    
                }
                &:nth-child(1) .list_right{
                    .singleList0{
                        background: url("~@/assets/image/common/imgIcon53_1.png") no-repeat 100% 100%;
                        background-position: 0% 100%;
                    }
                    .singleList1{
                        background: url("~@/assets/image/common/imgIcon54_1.png") no-repeat 100% 100%;
                        background-position: 0% 100%;
                    }
                    .numTotal{
                        text-shadow: 0px 0px 5px #43C88F;
                    }
                    .num{
                        text-shadow: 0px 1px 4px #43C88F
                    }
                }
                &:nth-child(2) .list_right{
                    .singleList0{
                       background: url("~@/assets/image/common/imgIcon55_1.png") no-repeat 100% 100%;
                        background-position: 0% 100%;
                    }
                    .singleList1{
                        background: url("~@/assets/image/common/imgIcon56_1.png") no-repeat 100% 100%;
                        background-position: 0% 100%;
                    }
                    .numTotal{
                        text-shadow: 0px 0px 5px #FF703D;
                    }
                    .num{
                        text-shadow: 0px 1px 4px #FF703D
                    }
                }
            }
            .bottomList{
                width:px-to-rem(166);
                height: px-to-rem(110);
                margin:px-to-rem(6) 0;
                display: flex;
                align-items: center;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                .list_right{
                    .name{
                        color: #FFFFFF;
                        font-size:px-to-rem(14);
                        margin-top: px-to-rem(3);
                    }
                    .num{
                        font-size: px-to-rem(18);
                        color: #FFFFFF;
                    }
                }
            }
            .bottomList0 .list_right{
                .name,.num{
                    text-shadow: 0px px-to-rem(2) px-to-rem(4) #F9FF6C;
                }
            }
            .bottomList1 .list_right{
                .name,.num{
                    text-shadow: 0px px-to-rem(2) px-to-rem(4) #00EDFF;
                }
            }
            .iconImg{
                width:px-to-rem(54);
                height:px-to-rem(48);
                margin-left:px-to-rem(5)
            }
            .list_right{
                flex:1;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left:px-to-rem(5)
            }
        }
    }
</style>