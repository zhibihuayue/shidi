// 病虫害预测
<template>
    <div class="insectPest">
        <div :class="[detailShow?'showDrag':'noShowDrag','dragIcon']" @click="open_closeDetail">
          <img :src="require(`@/assets/image/newCommon/imgIcon${detailShow?21:20}.png`)" alt="" class="detailImg">
          <p class="text_">病虫害预测</p>
        </div>
        <vue-drag-resize
          v-if="detailShow"
          ref="dragResize"
          :isResizable="false"
          class="dragResize"
          :w="0"
          :h="0"
          :z="1001"
          :y="0"
          :x="22"
          @clicked="activated"
          @dragstop="dragstop">
            <div class="pop">
                <div class="popArea">
                <basis-box name="病虫害预测">
                    <div class="selfArea">
                    <img src="@/assets/image/common/close1.png" alt="" class="close" @click="open_closeDetail">
                    </div>
                    <div class="mainContent">
                        <mainArea ref="mainArea"/>
                    </div>
                </basis-box>
                </div>
            </div>
        </vue-drag-resize>
    </div>
</template>
<script>
import VueDragResize from 'vue-drag-resize'
import basisBox from '@/views/module/basisBox.vue'
import mainArea from './module/mainArea.vue'
import {mapMutations } from "vuex"
export default {
  inject: ["mapRef"],
  components: {
    basisBox,
    VueDragResize,
    mainArea
  },
  data() {
    return {
      selectIndex: 1,
      detailShow: false,
      inputEle: null,
      inputEleTop:0,
      mapRef_:this.mapRef,
      inputEleName:null
    }
  },
  watch:{
    mapRef_: {
      handler(val) {
        this.detailShow=false
        if(this.$refs.mainArea){
          this.$refs.mainArea.clearLayer()
        }
      },
      deep: true,
    },

  },
  methods: {
    ...mapMutations(['setInsectPestLegendShow']),
    // 处理给input聚焦
    activated(e) {
      if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'I') {
        if(e.target.nodeName=='I'){
          if(this.selectIndex==4){
            this.inputEle = this.$refs.inputRef_.$refs.dateRange.$refs.dateYearRange.$refs.inputLeft
          }else{
            this.inputEle = this.$refs.inputRef.$refs.dateRange.$refs.dateYearRange.$refs.inputLeft
          }
          this.inputEle.focus()
        }else{
          this.inputEle = e
          e.target.focus()
        }
        this.inputEleName=null
        if(e.target._prevClass=='el-input__inner'){
          this.inputEleName='el-input__inner'
        }
      }
    },

    // 移动时给input失焦
    dragstop(e) {
      if(this.inputEleName){
        if(this.inputEleTop!=e.top&&e.top>10){
          this.inputEle.target.blur()
        }
      }else{
        try{
          this.inputEle.target.blur()
        }catch{
          if(this.inputEle){
            this.inputEle.blur()
          }
        }
      }
      this.inputEleTop=e.top
    },

    // 开启关闭详情
    open_closeDetail() {
      this.selectIndex = 1
      this.detailShow = !this.detailShow
      if(this.detailShow){
        this.$nextTick(()=>{
          this.$refs.mainArea.clearLayer()
        })
      }else{
        this.$refs.mainArea.clearLayer()
      }
      if(this.detailShow){
        this.setInsectPestLegendShow(true)
      }
    }
  },
  beforeDestroy(){
    if(this.$refs.mainArea){
      this.$refs.mainArea.clearLayer()
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/styles/px-to-rem';
    .insectPest{
        margin-top: px-to-rem(10);
        height:px-to-rem(40);
        .dragIcon{
          width:px-to-rem(138);
          height:px-to-rem(36);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: px-to-rem(14);
          color:#fff
        }
        .showDrag{
          background: url("~@/assets/image/newCommon/imgIcon19.png") no-repeat;
          background-size: 100% 100%;
          .text_{
            text-shadow: 0px 0px 12px #F9FF6C;
          }
        }
        .noShowDrag{
          background: url("~@/assets/image/newCommon/imgIcon18.png") no-repeat;
          background-size: 100% 100%;
          .text_{
            text-shadow: 0px 0px 12px #0DC985
          }
        }
        .detailImg{
            cursor: pointer;
            width:px-to-rem(51);
            height:px-to-rem(32);
        }
        .pop{
            font-size: px-to-rem(14);
            position: absolute;
            right: px-to-rem(49);
            width: px-to-rem(370);
            top: px-to-rem(60);
            z-index: 100;
            color: #fff;
            .popArea{
                position: relative;
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
                }
                .mainContent{
                    height: px-to-rem(401);
                    display: flex;
                    flex-direction: column;
                    padding: px-to-rem(10) px-to-rem(11.25) 0 px-to-rem(11.25);
                    box-sizing: border-box;
                }
            }
            ::v-deep .boxClassTop .arrow{
                display: none;
            }
        }
        //拖动弹窗虚线
        .dragResize{
            &::before{
                outline:none;
            }
        }
    }
</style>
