<template>
  <el-popover
    ref="popover"
    v-model="showPanel"
    v-clickoutside="
      () => {
        showPanel = false;
      }
    "
    placement="bottom"
    popper-class="custom_year_range"
    trigger="manual"
    class="popover"
  >
    <div class="_inner floatPanel">
      <div class="_inner leftPanel">
        <div class="_inner panelHead">
          <i class="_inner el-icon-d-arrow-left" @click="onClickLeft" />
          <span>
            {{ leftYearList[0] + "年 " + "- " + leftYearList[9] + "年" }}
          </span>
        </div>
        <div class="_inner panelContent">
          <div
            v-for="item in leftYearList"
            :key="item"
            :class="{
              oneSelected: item === startYear && oneSelected,
              startSelected: item === startYear,
              endSelected: item === endYear,
              betweenSelected: item > startYear && item < endYear,
              currentDisable: item > nowYear[1] || item < nowYear[0] ,
            }"
          >
            <a
              :class="{
                cell: true,
                _inner: true,
                selected: item === startYear || item === endYear,
              }"
              @click="(item <= nowYear[1] && item>=nowYear[0]) ? onClickItem(item) : ''"
              @mouseover="(item <= nowYear[1] && item>=nowYear[0]) ? onHoverItem(item) : ''"
            >
              {{ item }}
            </a>
          </div>
        </div>
      </div>
      <div class="_inner rightPanel">
        <div class="_inner panelHead">
          <i class="_inner el-icon-d-arrow-right" @click="onClickRight" />
          <span>{{
            rightYearList[0] + "年 " + "- " + rightYearList[9] + "年"
          }}</span>
        </div>
        <div class="_inner panelContent">
          <div
            v-for="item in rightYearList"
            :key="item"
            :class="{
              startSelected: item === startYear,
              endSelected: item === endYear,
              betweenSelected: item > startYear && item < endYear,
              currentDisable: item > nowYear[1] || item < nowYear[0] ,
            }"
          >
            <a
              :class="{
                cell: true,
                _inner: true,
                selected: item === endYear || item === startYear,
              }"
              @click="(item <= nowYear[1] && item>=nowYear[0]) ? onClickItem(item, 'right') : ''"
              @mouseover="(item <= nowYear[1] && item>=nowYear[0]) ? onHoverItem(item) : ''"
            >
              {{ item }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <template slot="reference">
      <div
        ref="yearPicker"
        style="width: 100%"
        class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange el-range-editor--small"
        :style="{borderColor: showPanel ? '#02896D' : 'transparent'}"
      >
        <i class="el-input__icon el-range__icon el-icon-date" />
        <input
          ref="inputLeft"
          v-model="startShowYear"
          class="_inner range_input"
          type="text"
          name="yearInput"
          placeholder="开始年份"
          @focus="onFocus"
          @keyup="handleInput('start')"
        >
        <span class="el-range-separator">{{ sp }}</span>
        <input
          ref="inputRight"
          v-model="endShowYear"
          class="_inner range_input"
          type="text"
          name="yearInput"
          placeholder="结束年份"
          @focus="onFocus"
          @keyup="handleInput('end')"
        >
        <i v-if="circleClose" class="close_btn el-input__icon el-range__icon el-icon-circle-close" @click="clearDate" />
      </div>
    </template>
  </el-popover>
</template>

<script>
import moment from 'moment'
import { clickoutside, SELECT_STATE } from './utils.js'
import { current } from 'immer'
export default {
  name: 'YearPicker',
  directives: { clickoutside },
  props: {
    sp: {
      default: '至'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    haveDataTime:{ //对应可以选择的区间
      type:Array,
      default: () => {
        return [];
      }
    },
    // 是否有清除按钮
    circleClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      itemBg: {},
      startShowYear: null,
      endShowYear: null,
      yearList: [],
      showPanel: false,
      startYear: null,
      endYear: null,
      curYear: 0,
      curSelectedYear: 0,
      curState: SELECT_STATE.unselect,
      nowYear: null,
      lastTime: null
    }
  },
  computed: {
    oneSelected() {
      return (
        this.curState === SELECT_STATE.selecting &&
        (this.startYear === this.endYear || this.endYear == null)
      )
    },
    leftYearList() {
      return this.yearList.slice(0, 10)
    },
    rightYearList() {
      return this.yearList.slice(10, 20)
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val.length == 0) {
          this.startShowYear = ''
          this.endShowYear = ''
        } else {
          const [first, end] = val || []
          this.startShowYear = val[0] + '年'
          this.endShowYear = val[1] + '年'
        }
      },
      immediate: true,
      deep: true
    },

    startShowYear: {
      handler(val) {
        if (val) {
          this.$emit('input', [val, this.endShowYear || ''])
        } else {
          this.$emit('input', null)
        }
      },
      immediate: true,
      deep: true
    },

    endShowYear: {
      handler(val) {
        if (val) {
          this.$emit('input', [this.startShowYear || '', val])
        } else {
          this.$emit('input', null)
        }
      },
      immediate: true,
      deep: true
    },

    haveDataTime:{
      handler(val){
        if(val&&val.length>0){
          this.nowYear=val
        }else{
          this.nowYear=[9999,9999]
        }
      },
      deep:true,
      immediate:true
    }

  },
  created() {
    const [startYear, endYear] = this.value || []
    if (startYear) {
      this.startYear = Number(startYear)
      this.endYear = Number(endYear)
      this.curState = SELECT_STATE.selected
      this.curYear = startYear
    } else {
      this.curYear = moment().format('yyyy')
    }
    this.updateYearList()
  },

  mounted() {
    window.Vue = this
  },
  methods: {
    clearDate() {
      this.startShowYear = null
      this.endShowYear = null
    },
    handleInput(type) {
      switch (type) {
        case 'start':
          if (isNaN(this.startShowYear)) {
            this.startShowYear = this.startYear
            return
          }
          this.startYear = this.startShowYear * 1
          break
        case 'end':
          if (isNaN(this.endShowYear)) {
            this.endShowYear = this.endYear
            return
          }
          this.endYear = this.endShowYear * 1
          break
      }
      [this.startYear, this.endYear] = [this.endYear, this.startYear]
      this.startShowYear = this.startYear
      this.endShowYear = this.endYear
    },

    onHoverItem(iYear) {
      if (this.curState === SELECT_STATE.selecting) {
        const tmpStart = this.curSelectedYear
        this.endYear = Math.max(tmpStart, iYear)
        this.startYear = Math.min(tmpStart, iYear)
      }
    },
    // 增添形参，type,---不能有相同的年份

    async onClickItem(selectYear) {
      if (this.lastTime === selectYear) {
        this.$notify.info({
          message: '年份段不能为同一年'
        })
        return
      }
      this.lastTime = selectYear
      if (
        this.curState === SELECT_STATE.unselect ||
        this.curState === SELECT_STATE.selected
      ) {
        this.startYear = selectYear
        this.curSelectedYear = selectYear
        this.endYear = null
        this.curState = SELECT_STATE.selecting
      } else if (this.curState === SELECT_STATE.selecting) {
        this.endShowYear = (this.endYear || this.startYear) + '年'
        this.startShowYear = this.startYear + '年'
        this.curState = SELECT_STATE.selected
        await this.$nextTick()
        this.showPanel = false
        this.lastTime = null
        this.$parent?.$parent?.$parent?.$parent?.$parent.clearValidate?.()
      } else {
        console.log('8888')
      }
    },

    async onFocus() {
      await this.$nextTick()
      this.showPanel = true
    },

    updateYearList() {
      // const startYear = ~~(this.curYear / 10) * 10;
      const startYear = this.curYear - 18
      console.log(
        startYear,
        this.curYear,
        'this.curYearthis.curYearthis.curYear'
      )
      this.yearList = []
      for (let index = 0; index < 20; index++) {
        this.yearList.push(startYear + index)
      }
      console.log('^^^^,this.yearList,^^^^', this.yearList)
    },

    onClickLeft() {
      console.log('*88888*, 点击了')
      this.curYear = this.curYear * 1 - 10
      this.updateYearList()
    },

    onClickRight() {
      this.curYear = this.curYear * 1 + 10
      this.updateYearList()
    }
  }
}
</script>
<style lang="scss">
@import "~@/assets/styles/px-to-rem";
.popover{
  .el-popover__reference-wrapper{
    display: flex;
  }
}
.custom_year_range {
  margin-top: 12px !important;
  color: #ffffff;
  background:  linear-gradient(180deg, rgba(0, 67, 63, 0.85) 0%, rgba(0, 19, 30, 0.9) 100%)!important;
  border: 1px solid #075b4a !important;
  border-radius: 4px;
  margin-left: 1.55%;
  // box-shadow: inset 0px 0px px-to-rem(0.5) 0px rgba(2, 137, 109, 0.6) !important;
  .floatPanel {
    color: #ffffff;
    background-color: transparent !important;
    // padding: 0 16px;
    // position: absolute;
    display: flex;
    background-color: #fff;
    z-index: 2000;
    border-radius: 4px;
    width: px-to-rem(520);
    // height: px-to-rem(250);
    top: px-to-rem(40);
    left: px-to-rem(-50);
    > div {
      width: 50%;
    }

    .panelContent {
      // display: flex;
      // flex-wrap: wrap;
      width: 100%;
      height: calc(100% - 70px);
      // gap: px-to-rem(5);
      margin-top: px-to-rem(12);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-row-gap: px-to-rem(12);

      .oneSelected {
        border-top-right-radius: px-to-rem(24);
        border-bottom-right-radius: px-to-rem(24);
      }

      .startSelected {

        a {
          background: #00a179;
        }
        // background: linear-gradient(270deg, #00a179 0%, #15bd94 100%);
        background: rgba(2, 137, 109, 0.5);
        border-radius: 0;
        border-top-left-radius: px-to-rem(16);
        border-bottom-left-radius: px-to-rem(16);
      }

      .endSelected {
        a {
          background: #00a179;
        }
        // background: linear-gradient(270deg, #00a179 0%, #15bd94 100%);
        background: rgba(2, 137, 109, 0.5);
        border-radius: 0;
        border-top-right-radius: px-to-rem(16);
        border-bottom-right-radius: px-to-rem(16);
      }

      .betweenSelected {
        // a {
        //   background: #02896D;
        // }
        // background: #00a179;
        background: rgba(2, 137, 109, 0.5);
        border-radius: 0;
        // opacity: 0.35;
      }

      .currentDisable {
        // background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.4);
        //color: #0DC985;
        font-weight: 700;

        > a {
          font-weight: 700;
          &:hover {
            // color: #fff;
            background: transparent;
             cursor: not-allowed;
          }
        }
      }
      > div {
        // width: px-to-rem(60);
        height: px-to-rem(32);
        line-height: px-to-rem(32);
        margin: px-to-rem(3) 0;
        text-align: center;
        border-radius: px-to-rem(16);
        // &:hover {
        //   background: rgba(2, 137, 109, 0.4);
        // }
        a {
          display: inline-block;
          // width: 60px;
          // height: 36px;
          // line-height: 36px;
          // margin: 0 0.1rem;
          width: px-to-rem(60);
          height: px-to-rem(32);
          line-height: px-to-rem(32);
          cursor: pointer;
          border-radius: px-to-rem(16);
          font-size: px-to-rem(14);
          &:hover {
            background: rgba(2, 137, 109, 0.4);
          }
        }

        .selected {
          //   background-color: #15BD94;
          color: #fff;

          &:hover {
            color: #fff !important;
          }
        }
      }
    }

    .panelHead {
      position: relative;
      // height: px-to-rem(46);
      // line-height: px-to-rem(46);
      padding-bottom: px-to-rem(12);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba($color: #E8F3FE, $alpha: 0.2);

      span {
        font-size: px-to-rem(14);
        font-weight: 500;
        padding: 0 5px;
        line-height: px-to-rem(22);
        text-align: center;
        cursor: pointer;
        color: #fff;

        &:hover {
          color: #fff;
        }
      }

      i {
        position: absolute;
        cursor: pointer;
        font-size: px-to-rem(20);

        &:hover {
          color: #3e77fc;
        }
      }
    }

    .rightPanel {
      padding-left: px-to-rem(12);
      .panelContent {
        padding-left: px-to-rem(10);
      }
    }

    .leftPanel {
      padding-right: px-to-rem(12);
    }

    .leftPanel .panelHead i {
      // left: px-to-rem(20);
      left: 0;
    }

    .rightPanel .panelHead i {
      // right: px-to-rem(20);
      right: 0
    }
  }

  .floatPanel::before {
    content: "";
    height: 100%;
    top: 0;
    position: absolute;
    left: 50%;
    width: 1px;
    border-left: 1px solid #E8F3FE;
    opacity: 0.2;
  }

  .popper__arrow {
    display: none !important;
  }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.range_input {
  appearance: none;
  border: none;
  outline: 0;
  padding: 0;
  width: 39%;
  color: #606266;
  line-height: 1;
  height: 100%;
  margin: 0;
  text-align: center;
  display: inline-block;
  &::placeholder{
    color:rgba(255,255,255,0.5);
  }
}
.close_btn{
  opacity: 0;
  &:hover{
    opacity: 1;
  }
}
.yearPicker {
  // font-size: 14px;
  // display: flex;
  // position: relative;
  // transition: all 0.3s;
  input:first-child {
    text-align: right;
  }

  .labelText {
    position: absolute;
    left: px-to-rem(8);
  }

  background-color: #fff;

  span {
    padding: 0 8px;
    height: px-to-rem(32);
    line-height: px-to-rem(32);
  }

  border: 1px solid #eff1f3;
  height: px-to-rem(34);
  line-height: px-to-rem(34);
  border-radius: px-to-rem(4);
  padding: 0 28px 0 8px;
  box-sizing: border-box;
}

input {
  width: px-to-rem(60);
  border: none;
  height: px-to-rem(32);
  line-height: px-to-rem(32);
  box-sizing: border-box;
  background-color: transparent;
}

input:focus {
  outline: none;
  background-color: transparent;
}

.yearPicker:hover {
  border-color: #3e77fc;
}

.dateIcon {
  position: absolute;
  right: px-to-rem(16);
  top: px-to-rem(9);
  color: #adb2bc;
}

.el-date-editor {
  height: px-to-rem(32) ;
}

.el-range-editor--small.el-input__inner{
  height:px-to-rem(32) !important
}

.el-date-editor .el-range__icon {
  font-size: px-to-rem(20);
  width: px-to-rem(36);
  height: px-to-rem(16);
  margin: 0 !important;
  background: url("~@/assets/image/newCommon/imgIcon14.png") no-repeat;
  background-size: 100% 100%;
  &::before{
    content: '';
  }
}
.el-range-editor.el-input__inner {
  padding: 0;
}
.el-date-editor.el-range-editor.el-input__inner {
  padding-left: px-to-rem(12);
}
.el-date-editor.el-range-editor.el-input__inner:focus{
  border: px-to-rem(0.5) solid rgba(2, 137, 109, 0.5) !important;
}
::v-deep .el-date-editor .el-range-separator {
  //left: px-to-rem(-15);
  line-height: px-to-rem(30) !important;
}
</style>
