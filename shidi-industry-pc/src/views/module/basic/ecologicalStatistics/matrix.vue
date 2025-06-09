// 生态系统矩阵
<template>
  <div class="matrix">
     <tableIndex :tableData="tableData" :tableHeadList="tableHeadList" :timeList="timeList" :key="keyIndex" tableType="otherTable"/>
  </div>
</template>

<script>
import tableIndex from '@/common/page/table.vue'
import dateRange from '@/common/page/dateRange.vue'
import { statisticsMatrix} from '@/http/environment.js'
import { formattedValue } from "@/common/page/utils.js";
export default {
  components: {
    tableIndex,
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
      tableData: [],
      defaultTime: [],
      timeList: [],
      keyNumList:[
        {type:"rivers",id:1},
        {type:"lake",id:2},
        {type:"swamp",id:3},
        {type:"agriculture",id:4},
        {type:"breed",id:5},
        {type:"city",id:6},
        {type:"scenery",id:7}
      ],
      database:[],
      keyIndex:0,
      haveDataTime:this.haveDataTime_,//有数据的年份区间
    }
  },
  computed: {
    tableHeadList() {
      let tableHead=[
        { label: '河流湿地', prop: 'rivers' ,align:'left'},
        { label: '湖泊湿地', prop: 'lake' ,align:'left'},
        { label: '沼泽湿地', prop: 'swamp' ,align:'left'},
        { label: '农业用地', prop: 'agriculture' ,align:'left'},
        { label: '养殖场类', prop: 'breed' ,align:'left'},
        { label: '城市用地', prop: 'city',align:'left' },
        { label: '景观用地', prop: 'scenery' ,align:'left'}
      ]
      tableHead.forEach(item => {
        item.width = 70
      })
      return tableHead
    }
  },
  watch:{
    timeList_:{
      handler(val){
        this.timeList=val
        this.getStatisticsMatrix()
      },
      deep:true
    }
  },
  mounted() {
    this.defaultTimeFun()
    this.getStatisticsMatrix()
  },
  methods: {
    // 默认时间
    defaultTimeFun() {
      const times = JSON.parse(sessionStorage.getItem('date_matrixTime'))
      if (!times) {
        this.defaultTime = this.haveDataTime
        this.timeList = this.defaultTime
      } else {
        this.defaultTime = times
        this.timeList = this.defaultTime
      }
    },

    // 获取数据
    async getStatisticsMatrix() {
      this.database=[]
      if(!this.timeList){
        return 
      }
      const temp = this.timeList.map(item => {
        return item.toString().replace('年', '')
      })
      const params = {
        coverageType: 1,
        startTime: temp[0],
        endTime: temp[1]
      }
      const res = await statisticsMatrix(params)
      if (res.code == 200) {
        this.database=res.data||[]
      }
      this.getData()
    },

    // 改变时间
    changeTime(val) {
      this.timeList = val
      let temp = null
      if(val){
        temp = val.map(item => {
          return item.replace('年', '')
        })
      }
      sessionStorage.setItem('date_matrixTime', JSON.stringify(temp))
      this.getStatisticsMatrix()
    },

    // 获取数据
    getData() {
      let labelList=[
        { type: '河流湿地',id:1},
        { type: '湖泊湿地',id:2 },
        { type: '沼泽湿地' ,id:3},
        { type: '农业用地',id: 4},
        { type: '养殖场类',id: 5},
        { type: '城市用地' ,id:6},
        { type: '景观用地' ,id:7}
      ]
      labelList.forEach(item=>{
        let data=this.database[item.id]
        if(data){
          this.keyNumList.forEach(val=>{
            let childData=data[val.id]
            if(childData){
              item[val.type] = formattedValue(childData.toFixed(2))
            }else{
              item[val.type] = 0
            }
          })
        }else{
          this.keyNumList.forEach(val=>{
            item[val.type] = 0
          }) 
        }
      })
      this.tableData = labelList
      this.keyIndex+=1
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/px-to-rem';
    .matrix{
       height:100%;
       width:100%;
    }
</style>
