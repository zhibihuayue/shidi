<template>
    <div class="legend">
        <div v-for="item in list" :key="item.id" class="list">
            <p :style="{background:item.color}" class="lab"></p>
            <p class="name">{{item.label}}</p>
        </div>
        <!-- 下角样式 -->
        <div class="before"></div>
        <div class="after"></div>
        <!-- 上角样式 -->
        <div class="line_before"></div>
        <div class="line_after"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list:[
                {label:"正常值",color:"#00B38E",id:0},
                {label:"预警值",color:"#FFEE55",id:1},
                {label:"警戒值",color:"#FF814F",id:2},
                {label:"风险值",color:"#FF4C54",id:3}
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
    .legend{
        width: px-to-rem(124);
        height: px-to-rem(108);
        font-size: px-to-rem(12);
        background: linear-gradient( 180deg, rgba(0,19,30,0.7) 0%, #00131E 100%);
        border: 1px solid;
        border-image: linear-gradient(180deg, rgba(7.000000057742, 91.00000217556953, 74.0000031888485, 0.75), rgba(7.000000057742, 91.00000217556953, 74.0000031888485, 0.30000001192092896)) 1 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        position: relative;
        .list{
            display: flex;
            align-items: center;
            .lab{
                width:px-to-rem(12);
                height:px-to-rem(12);
                margin:0 px-to-rem(12);
            }
            .name{
                color:#9E9E9E;
                font-size:px-to-rem(12)
            }
        }
        .before {
            height: px-to-rem(25);
            width: px-to-rem(21);
            bottom: px-to-rem(-1);
            position: absolute;
            z-index: 90;
            right: px-to-rem(-1.5);
            background: url("~@/assets/image/common/imgIcon7.png") no-repeat;
            background-size: 100% 100%;
        }
        .after {
            height: px-to-rem(25);
            width: px-to-rem(21);
            bottom: px-to-rem(-1);
            left: px-to-rem(-1.5);
            z-index: 90;
            position: absolute;
            background: url("~@/assets/image/common/imgIcon6.png") no-repeat;
            background-size: 100% 100%;
        }
        .line_before{
            top:px-to-rem(-1.5);
            left:px-to-rem(0)
        }
        .line_after{
            right:px-to-rem(0);
            top:px-to-rem(-1.5)
        }
        .line_before,.line_after{
            height:px-to-rem(1);
            width:px-to-rem(10);
            background: #00fff8;
            position: absolute;
        }
    }
</style>