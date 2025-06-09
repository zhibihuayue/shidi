// 实时抓拍
<template>
    <div class="realTimeCapture">
        <basis-box name="实时抓拍">
            <div class="mainContent">
                <div class="seach">
                    <el-input placeholder="输入关键字" class="inputClass"></el-input>
                    <img src="@/assets/image/common/imgIcon28.png" alt="" class="imgBor">
                    <img src="@/assets/image/common/imgIcon29.png" alt="">
                </div>
                <div class="list">
                    <div v-for="(item,index) in listData" :key="index" class="single">
                        <div class="singleTop">
                            <img src="" alt="">
                            <span class="plate">{{item.numberplate}}</span>
                        </div>
                        <div class="singleBottom">
                            <p class="typeTime">
                                <span class="type">车辆类型</span>
                                <span class="time">{{item.time}}</span>
                            </p>
                            <div class="cameraAddress">
                                <img src="@/assets/image/common/imgIcon30.png" alt="" class="camera">
                                <p class="address">{{item.address}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </basis-box>
    </div>
</template>

<script>
import basisBox from "@/views/module/basisBox.vue"
export default {
    components:{
        basisBox
    },
    data(){
        return{
            listData:[
                {numberplate:'京A32820',time:"2024-11-08",address:"北京市海定区-11号"},
                {numberplate:'京A32820',time:"2024-11-08",address:"北京市海定区-11号"},
                {numberplate:'京A32820',time:"2024-11-08",address:"北京市海定区-11号"}
            ]
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .realTimeCapture{
        width:100%;
        .mainContent{
            width:100%;
            height: px-to-rem(227);
            padding:px-to-rem(12) px-to-rem(12) 0 px-to-rem(12);
            display: flex;   
            box-sizing: border-box;
            flex-direction: column;
            overflow: auto;
            .seach{
                width: 100%;
                height: px-to-rem(32);
                background: rgba(2,137,109,0.2);
                border-radius: px-to-rem(4);
                display: flex;
                align-items: center;
                margin-bottom: px-to-rem(13);
                border: 1px solid rgba(2,137,109,0);
                .inputClass{
                    ::v-deep .el-input__inner{
                        background: transparent;
                        border:none
                    }
                }
                img{
                    width:px-to-rem(18);
                    height:px-to-rem(18);
                    margin-right: px-to-rem(9);
                }
                .imgBor{
                    padding-right:px-to-rem(9);
                    box-sizing: content-box;
                    border-right: 1px solid rgba(255,255,255,0.2);
                }
            }
            .list{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                .single{
                    background: rgba(2,137,109,0.1);
                    border-radius: 8px;
                    margin-bottom: px-to-rem(13);
                    border: 1px solid #02896D;
                    height:px-to-rem(159);
                    width: px-to-rem(172);
                    display: flex;
                    flex-direction:column;
                    .singleTop{
                        position: relative;
                        height:px-to-rem(96);
                        width: px-to-rem(170);
                        .plate{
                            font-size: px-to-rem(12);
                            color:#fff;
                            background: rgba(5,15,24,0.7);
                            border-radius: 0px 4px 0px 4px;
                            padding:px-to-rem(2) px-to-rem(4);
                            position: absolute;
                            bottom:0;
                            left:0
                        }
                    }
                    .singleBottom{
                        flex:1;
                        overflow: hidden;
                        padding:0 px-to-rem(12) px-to-rem(12) px-to-rem(12);
                        .typeTime{
                            display: flex;
                            align-items: center;
                            margin-top: px-to-rem(6);
                            justify-content: space-between;
                            .type{
                                font-weight: 500;
                                font-size: px-to-rem(14);
                                color: #FFFFFF;
                                text-shadow: 0px 0px px-to-rem(18) rgba(0,245,193,0.7);
                            }
                            .time{
                                font-size: px-to-rem(14);
                                color: #FFFFFF;
                            }
                        }
                        .cameraAddress{
                            margin-top: px-to-rem(6);
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            .camera{
                                width:px-to-rem(20);
                                height:px-to-rem(20);
                            }
                            .address{
                                font-size: px-to-rem(14);
                                color: #FFFFFF;
                            }
                        }
                    }
                }
            }
        }
    }
</style>l
