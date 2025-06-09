// 综合动态转移指数
<template>
  <div class="exponent">
    <div v-for="item in list" :key="item.id" class="singleList">
      <p class="num">{{item.value}}</p>
      <p class="name">{{item.name}}</p>
    </div>
  </div>
</template>

<script>
import dateRange from '@/common/page/dateRange.vue'
import { statisticsDynamicIndex } from '@/http/environment.js'
import { formattedValue } from "@/common/page/utils.js";
export default {
  components: {
    dateRange
  },
  props:{
    haveDataTime_:{
      type:Array,
      default:[]
    },
    timeList_:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      list: [
        { name: '综合动态度', value: '0' ,id:0,type:"dynamic"},
        { name: '湿地转出指数', value:'0',id:1,type:"transferOutIndex"},
        { name: '湿地转入指数', value: '0' ,id:2,type:"transferInIndex"}
      ],
      defaultTime: [],
      timeList: [],
      haveDataTime:this.haveDataTime_,//有数据的年份区间
    }
  },
  watch:{
    timeList_:{
      handler(val){
        this.timeList=val
        this.statisticsDynamicIndex()
      },
      deep:true
    }
  },
  mounted() {
    this.defaultTimeFun()
  },
  methods: {
    // 默认时间
    async defaultTimeFun() {
      const times = JSON.parse(sessionStorage.getItem('date_exponentTime'))
      if (!times) {
        this.defaultTime = this.haveDataTime
        this.timeList = this.defaultTime
      } else {
        this.defaultTime = times
        this.timeList = this.defaultTime
      }
      this.statisticsDynamicIndex()
    },

    // 获取动态指数数据
    async statisticsDynamicIndex(){
      const temp = this.timeList.map(item => {
        return item.toString().replace('年', '')
      })
      const params = {
        coverageType: 1,
        startTime: temp[0],
        endTime: temp[1]
      }
      const res = await statisticsDynamicIndex(params)
      if (res.code == 200) {
        let data=res.data
        this.list.forEach(item=>{
          item.value = formattedValue(data[item.type].toFixed(2) || 0 )/100
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/px-to-rem';
    .exponent{
      width:100%;
      height:px-to-rem(108);
      display: flex;
      gap:px-to-rem(6);
      .singleList{
        flex:1;
        overflow: hidden;
        position: relative;
        .num{
          font-size: px-to-rem(20);
          font-weight: 600;
          color: #FFFFFF;
          position: absolute;
          top:px-to-rem(26);
          right:px-to-rem(17);
        }
        .name{
          font-size: px-to-rem(14);
          color:#fff;
          position: absolute;
          bottom:px-to-rem(12);
          left:50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }
      }
      .singleList:nth-child(1){
        .num{
          text-shadow: 0px 1px 4px #F9FF6C;
        }
        background: url("~@/assets/image/environment/imgIcon10.png") no-repeat;
        background-size: 100% 100%;
      }
      .singleList:nth-child(2){
        .num{
          text-shadow: 0px 1px 4px #43C88F;
        }
        background: url("~@/assets/image/environment/imgIcon11.png") no-repeat;
        background-size: 100% 100%;
      }
      .singleList:nth-child(3){
        .num{
          text-shadow: 0px 1px 4px #245995
        }
        background: url("~@/assets/image/environment/imgIcon12.png") no-repeat;
        background-size: 100% 100%;
      }
    }
</style>
