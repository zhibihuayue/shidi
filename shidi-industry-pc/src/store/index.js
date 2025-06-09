import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 病虫害预测的图例隐显
    insectPestLegendShow:false,
    // 病虫害预测的弹窗详情
    insectPestDetailData:{},
    // 病虫害预测的弹窗显隐
    insectPestDetailsShow:false,
    // 病虫害预测用户记忆对象
    insectPestMemory:JSON.parse(sessionStorage.getItem("insectPestMemory"))
  },
  mutations: {
    setInsectPestLegendShow(state, value) {
      state.insectPestLegendShow = value;
    },
    setInsectPestDetailData(state,value){
      state.insectPestDetailData = value;
    },
    setInsectPestMemory(state,value){
      sessionStorage.setItem("insectPestMemory",JSON.stringify(value))
      state.insectPestMemory = value
    },
    setInsectPestDetailsShow(state,value){
      state.insectPestDetailsShow = value
    }
  },
  getters: {
    getInsectPestLegendShow: (state) => {
      return state.insectPestLegendShow
    },
    getInsectPestDetailData:(state) => {
      return state.insectPestDetailData
    },
    getInsectPestMemory:(state) => {
      return state.insectPestMemory
    },
    getInsectPestDetailsShow:(state) => {
      return state.insectPestDetailsShow
    }
  }
});

export default store;