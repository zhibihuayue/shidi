// 生态系统变化
<template>
    <div class="ecosystemChanges">
        <basis-box name="生态系统变化">
            <div class="mainContent">
                <div class="popPicker">
                    <dateRange :dateRangeProp="defaultTime" :circleClose="false" @dateRangeFunc="changeTime" ref="dateRange" :haveDataTime="haveDataTime"/>
                </div>
                <div class="contentBottom" >
                    <exponent :haveDataTime_="haveDataTime" :timeList_="timeList"/>
                    <div class="changeDiv">
                        <change :haveDataTime_="haveDataTime" :timeList_="timeList"/>
                    </div>
                    <div class="line"></div>
                    <div class="matrixDiv">
                        <matrix :haveDataTime_="haveDataTime" :timeList_="timeList" />
                    </div>
                </div>
            </div>
        </basis-box>
    </div>
</template>

<script>
import basisBox from "@/views/module/basisBox.vue"
import dateRange from '@/common/page/dateRange.vue'
import exponent from "@/views/module/basic/ecologicalStatistics/exponent.vue"
import change from "@/views/module/basic/ecologicalStatistics/change.vue"
import matrix from "@/views/module/basic/ecologicalStatistics/matrix.vue"
export default {
    components:{
        basisBox,
        dateRange,
        exponent,
        change,
        matrix
    },
    data(){
        return {
           defaultTime: [],
           haveDataTime:[],
           timeList:[]
        }
    },
  mounted() {
    this.getDefaultTime()
  },
  methods: {
    // 改变时间
    changeTime(val) {
      if(val){
        this.timeList = val.map(item => {
          return item.replace('年', '')
        })
        sessionStorage.setItem('date_changeTime', JSON.stringify(this.timeList))
      }
    },

     // 获取默认时间
    async getDefaultTime() {
      try{
        const res = await statisticsDefaultTime()
        if (res.code === 200) {
          this.haveDataTime=res.data||[]
        }
        this.contentBottomShow=true
      }catch(error){
        this.contentBottomShow=true
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .ecosystemChanges{
        width:100%;
        .mainContent{
            height:px-to-rem(900);
            box-sizing: border-box;
            padding:px-to-rem(12) px-to-rem(12) px-to-rem(6);
            display: flex;
            flex-direction: column;
            .popPicker{
                padding-bottom:px-to-rem(12);
            }
            .contentBottom{
                flex:1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                .changeDiv{
                    width:100%;
                    margin-top:px-to-rem(12)
                }
                .line{
                    width:100%;
                    margin:px-to-rem(10) 0;
                    opacity: 0.7;
                    height: px-to-rem(1);
                    background: linear-gradient( 90deg, rgba(0,176,140,0.1) 0%, #00B08C 50%, rgba(0,176,140,0.1) 100%);
                }
                .matrixDiv{
                    flex:1;
                    overflow: hidden;
                }
            }
        }
    }
</style>