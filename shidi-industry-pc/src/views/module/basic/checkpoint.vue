// 湿地卡口
<template>
    <div class="checkpoint">
        <basis-box name="湿地卡口">
            <div class="mainContent">
                <div class="mainTop">
                    <div class="nameNum">
                        <p class="name">湿地卡扣</p>
                        <p class="num">365</p>
                    </div>
                </div>
                <div class="line"></div>
                <div class="search">
                    <div class="search_area">
                        <el-select v-model="value" placeholder="按区域展示">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search_input">
                        <el-input placeholder="输入关键字" class="inputClass"></el-input>
                        <img src="@/assets/image/common/imgIcon28.png" alt="" class="imgBor">
                        <img src="@/assets/image/common/imgIcon35.png" alt="">
                    </div>
                    <div class="search_img">
                        <img src="@/assets/image/common/imgIcon32.png" alt="">
                        <img src="@/assets/image/common/imgIcon33.png" alt="">
                    </div>
                </div>
                <div class="selectArea">
                    <el-select v-model="value" placeholder="请选择" v-for="(item,index) in 4" :key="index" class="select">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <img
                        class="arrow"
                        :src="
                        arrowShow
                            ? require('@/assets/image/common/imgIcon10.png')
                            : require('@/assets/image/common/imgIcon9.png')
                        "
                        alt=""
                        @click="arrowShowFun"
                    />
                </div>
                <div class="listArea" v-if="arrowShow">
                    <div v-for="(item,index) in 10" :key="index" class="list" :class="[item<4?'list'+item:'list4']">
                        <div class="list_left">
                            <p class="index" :class="[item<4?'index'+item:'index4']">{{item}}</p>
                            <p class="name">北京市延庆区野鸭湖自然保护区A点</p>
                        </div>
                        <div class="list_right">
                            <img src="@/assets/image/common/imgIcon36.png" alt="">
                            <p class="num">10</p>
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
            arrowShow:true
        }
    },
    methods:{
       //切换箭头
        arrowShowFun() {
            this.arrowShow = !this.arrowShow;
        },
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .checkpoint{
        width:100%;
        .mainContent{
            width: 100%;
            padding:px-to-rem(12) px-to-rem(12) px-to-rem(12) px-to-rem(12);
            display: flex;   
            box-sizing: border-box;
            flex-direction: column;
            .mainTop{
                height:px-to-rem(143);
                background: url("~@/assets/image/common/imgIcon31.png") no-repeat;
                background-size: 100% 100%;
                position: relative;
                .nameNum{
                    position: absolute;
                    display: flex;
                    align-items: center;
                    top: px-to-rem(70);
                    right:px-to-rem(27);
                    .name,.num{
                        font-weight: 500;
                        font-size: px-to-rem(16);
                        color: #FFFFFF;
                        text-shadow: 0px 0px px-to-rem(7) #7E5F00;
                    }
                    .num{
                        margin-left:px-to-rem(80);
                    }
                }
            }
            .line{
                width: 100%;
                height: 1px;
                background: linear-gradient( 90deg, rgba(0,176,140,0.1) 0%, rgba(0,176,140,0.7) 51%, rgba(0,176,140,0.1) 100%);
            }
            .search{
                height: px-to-rem(32);
                margin:px-to-rem(10) 0;
                display: flex;
                align-items: center;
                .search_area{
                    width: px-to-rem(120);
                    background: rgba(2,137,109,0.2);
                    box-shadow: inset 0px 0px px-to-rem(3) 0px rgba(2,137,109,0.6);
                    border-radius: px-to-rem(4);
                    display: flex;
                    align-items: center;
                    ::v-deep .el-input__inner{
                        background: transparent;
                        border:none
                    }
                }
                .search_input{   
                    width: px-to-rem(160);            
                    background: rgba(2,137,109,0.2);
                    border-top-right-radius: px-to-rem(4);
                    border-bottom-right-radius:px-to-rem(4) ;
                    display: flex;
                    align-items: center;
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
                .search_img{
                    display:flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex:1;
                    overflow: hidden;
                }
            }
            .selectArea{
                height:px-to-rem(32);
                margin-bottom: px-to-rem(10);
                display: flex;
                align-items: center;
                .select{
                    margin-right:px-to-rem(5);
                    ::v-deep .el-input__inner{
                        height:px-to-rem(32);
                        background: rgba(2,137,109,0.2);
                        border:none
                    }
                    ::v-deep .el-input__icon{
                        line-height:px-to-rem(32);
                    }
                }
                .arrow{
                    cursor: pointer;
                    height:px-to-rem(13);
                    width:px-to-rem(13);
                }
            }
            .listArea{
                height:px-to-rem(370);
                overflow: auto;
                padding-right: px-to-rem(10);
                box-sizing: border-box;
                .list{
                    height:px-to-rem(32);
                    justify-content: space-between;
                    padding-right: px-to-rem(10);
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    border-radius: 4px;
                    margin-bottom: px-to-rem(6);
                    .list_left{
                        display: flex;
                        align-items: center;
                        .index1{
                            background:url("~@/assets/image/common/imgIcon37.png") no-repeat
                        }
                        .index2{
                            background:url("~@/assets/image/common/imgIcon38.png") no-repeat
                        }
                        .index3{
                            background:url("~@/assets/image/common/imgIcon39.png") no-repeat
                        }
                        .index4{
                            background:url("~@/assets/image/common/imgIcon40.png") no-repeat
                        }
                        .index{
                            width:px-to-rem(32);
                            height:px-to-rem(20);
                            text-align: center;
                            line-height:px-to-rem(20);
                            font-size:px-to-rem(14);
                            color: #fff;
                            font-weight: 500;
                            background-size: 100% 100%;
                        }
                        .name{
                            font-size:px-to-rem(14) ;
                            color:#fff
                        }
                    }
                    .list_right{
                        display: flex;
                        align-items: center;
                        img{
                            width: px-to-rem(20);
                            height: px-to-rem(20);
                            margin-right:px-to-rem(10)
                        }
                        .num{
                            font-size:px-to-rem(14) ;
                            color:rgba(255,255,255,.5)
                        }
                    }
                }
                .list1{
                    background: linear-gradient( 270deg, rgba(249,255,108,0) 0%, rgba(249,255,108,0.28) 100%);
                    border: 1px solid rgba(255,244,146,0.25);
                }
                .list2{
                    background: linear-gradient( 270deg, rgba(255,152,129,0) 0%, rgba(255,152,129,0.28) 100%);
                    border: 1px solid rgba(255,152,129,0.25);
                }
                .list3{
                    background: linear-gradient( 270deg, rgba(52,255,170,0) 0%, rgba(52,255,170,0.28) 100%);
                    border: 1px solid rgba(52,255,170,0.25);
                }
                .list4{
                    background: linear-gradient( 90deg, rgba(2,137,109,0.26) 0%, rgba(0,0,0,0) 100%), rgba(6,21,20,0.2);
                    box-shadow: inset 0px 0px px-to-rem(6) 0px rgba(2,137,109,0.4);
                    border: 1px solid rgba(2,137,109,0.39);
                }
            }
        }
    }
</style>
