<template>
  <div class="yearMonthDayTime">
    <!-- 类型选择 -->
    <div v-if="selectShow" class="selectArea">
      <el-select
        v-model="datePickType"
        :popper-append-to-body="false"
        @change="changeSelect"
      >
        <el-option
          v-for="item in selectOption"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </div>
    <div class="timeArea">
      <!-- 年 -->
      <div v-if="datePickType == 'year'">
        <el-date-picker
          ref="datePickerYearRef"
          key="year"
          v-model="timeValue"
          type="year"
          class="especialYear"
          popper-class="yearMonthDayTimePopper "
          format="yyyy年"
          value-format="yyyy"
          placeholder="请选择时间"
          :picker-options="pickerOptionsYear"
          :clearable="circleClose"
          @change="changeTime"
          @input="changeTime"
          @focus="getFocus"
        />
      </div>
      <!-- 月 -->
      <div v-else-if="datePickType == 'month'">
        <el-date-picker
          key="month"
          v-model="timeValue"
          type="month"
          popper-class="yearMonthDayTimePopper"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="请选择时间"
          :picker-options="pickerOptionsMonth"
          :clearable="circleClose"
          @change="changeTime"
          @input="changeTime"
        />
      </div>
      <!-- 日 -->
      <div v-else-if="datePickType == 'day'">
        <el-date-picker
          key="date"
          v-model="timeValue"
          popper-class="yearMonthDayTimePopperDay"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择时间"
          :picker-options="pickerOptionsDay"
          :clearable="circleClose"
          @change="changeTime"
          @input="changeTime"
        />
      </div>
      <!-- 自定义 -->
      <div v-else class="custom-picker">
        <el-date-picker
          v-model="timeValue"
          popper-class="yearMonthDayTimePopperDay yearMonthDayTimePopperCustom"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间"
          :picker-options="pickerOptionsCustom"
          :clearable="circleClose"
          @change="changeTime"
          @input="changeTime"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    timeType: {
      type: String,
      default: "year", // year:年  month：月  day：日  custom：自定义
    },
    selectShow: {
      type: Boolean,
      default: true,
    },
    dateRangeProp: {
      type: Array | String | Number,
      default: null,
    },
    // 是否有清除按钮
    circleClose: {
      type: Boolean,
      default: true,
    },
    haveDataTime: {
      //对应可以选择的区间
      type: Array,
      default: () => {
        return [];
      },
    },
    moduleType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      timeValue: this.moduleType ? "" : new Date().getFullYear().toString(),
      pickerOptions: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近3天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 2 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 8 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 29 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      pickerOptionsYear: {
        disabledDate: (time) => {
          let data = this.haveDataTime;
          if (data && data.length > 0) {
            return time.getFullYear() > data[1] || time.getFullYear() < data[0];
          } else {
            if (this.moduleType) {
              return time.getFullYear() > 1000;
            } else {
              const currentYear = new Date().getFullYear();
              return time.getFullYear() > currentYear;
            }
          }
        },
      },
      pickerOptionsMonth: {
        disabledDate(time){
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth(); // 注意：getMonth() 返回的月份是从 0 开始的
          return (
            time.getFullYear() > currentYear ||
            (time.getFullYear() === currentYear &&
              time.getMonth() > currentMonth)
          );
        },
      },
      pickerOptionsDay: {
        disabledDate : (time) => {
          const currentDate = new Date();
          if(this.moduleType=='insectPest'){
            let data = this.haveDataTime
            return !data.includes(moment(time).format('YYYY-MM-DD'))
          }else{
            return time.getTime() > currentDate.getTime();
          }
        },
      },
      selectOption: [
        { label: "年", value: "year" },
        { label: "月", value: "month" },
        { label: "日", value: "day" },
        { label: "自定义", value: "custom" },
      ],
      datePickType: this.timeType,
      currentDateCustom: new Date().toISOString().split("T")[0], // 当前日期，格式为 yyyy-MM-dd
      selectDate: null,
    };
  },
  computed: {
    pickerOptionsCustom() {
      return {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近3天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 2 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 6 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 29 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        onPick: (time) => {
          this.selectDate = time.minDate.getTime();
          console.log("this.selectDate", this.selectDate);
        },
        disabledDate: (time) => {
          // console.log('*****,this.timeValue', this)
          const start = this.timeValue[0];
          if (!this.selectDate) {
            this.selectDate = new Date(start).getTime();
          }
          console.log("this.selectDate111", this.selectDate);
          // const end = this.timeValue[1]
          const now = new Date(this.currentDateCustom).getTime();

          // 禁止选择超过当前日期的日期
          if (time.getTime() > now) {
            return true;
          }
          if (this.selectDate) {
            // 计算30天后的时间戳
            const maxTimeAllowed = this.selectDate + 30 * 24 * 3600 * 1000;
            // 计算30天前的时间戳
            const minTimeAllowed = this.selectDate - 30 * 24 * 3600 * 1000;

            // 禁止选择开始日期之后的30天之外的时间
            return (
              time.getTime() > maxTimeAllowed || time.getTime() < minTimeAllowed
            );
            // const minTime = startTime - one
            // const maxTime = startTime + one
            // console.log('minTime', minTime)
            // console.log('maxTime', maxTime)
            // console.log('******, time.getTime() < minTime', time.getTime() < minTime)
            // console.log('******, time.getTime() > maxTime', time.getTime() > maxTime)
            // return time.getTime() < minTime || time.getTime() > maxTime
          }
          return false;
        },
      };
    },
  },
  watch: {
    dateRangeProp: {
      handler(val) {
        if (val) {
          this.timeValue = val;
          console.log("监听了时间,this.timeValue", this.timeValue);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 选择类型
    changeSelect(val) {
      this.timeValue = null;
      this.$emit("changeSelect", val);
    },

    // 改变了时间
    changeTime(val) {
      this.$emit("changeTime", val);
    },

    // 获取年的焦点
    getFocus(val) {
      console.log("&&&&&, val, especialYear", val);
      console.log(
        "&&&&&, ",
        this.$refs.datePickerYearRef.$el.querySelector(".el-picker-panel")
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/px-to-rem";
.yearMonthDayTime {
  width: 100%;
  display: flex;
  align-items: center;
  .selectArea {
    width: px-to-rem(100);
    margin-right: px-to-rem(6);
    box-sizing: border-box;
    ::v-deep .el-select-dropdown {
      //height: px-to-rem(32);
      //line-height: px-to-rem(32);
      background: linear-gradient(
        180deg,
        rgba(0, 67, 63, 0.85) 0%,
        rgba(0, 19, 30, 0.9) 100%
      ) !important;
      border-radius: px-to-rem(4) !important;
      border: 1px solid #075b4a !important;

      .el-select-dropdown__item {
        height: px-to-rem(32);
        line-height: px-to-rem(32);
      }
      .el-select-dropdown__item.selected {
        color: #f9ff6c !important;
      }
    }
    ::v-deep .el-input__inner {
      //border: 1px solid #02896D !important;
      border: transparent;
      padding-left: px-to-rem(12);
      padding-right: px-to-rem(22);
      border-color: transparent;
      outline: none;
      border-color: transparent;
    }

    .el-select .el-input.is-focus .el-input__inner {
      border: transparent;
      border-color: 1px solid #02896d !important;
    }

    ::v-deep .el-input__inner:focusing {
      border: transparent;
      border-color: transparent;
      outline: none;
    }

    ::v-deep .el-input__inner:focus {
      border-color: transparent;
      border: 1px solid #02896d !important;
    }
    //::v-deep .el-input__inner:focusing {
    //  border-color: transparent;
    //  border: 1px solid #02896d !important;
    //}
    .el-select .el-input.is-focus .el-input__inner {
      border-color: transparent;
      border: 1px solid #02896d !important;
    }
    .el-select:hover .el-input__inner {
      border-color: transparent;
    }
    ::v-deep .popper__arrow {
      display: none !important;
    }
    ::v-deep .el-select-dropdown__list {
      padding: 0;
    }
    ::v-deep .el-select-dropdown__item {
      color: #fff !important;
      font-size: px-to-rem(14);
      &:hover {
        background: rgba(2, 137, 109, 0.4) !important;
      }
    }
    ::v-deep .hover {
      background: transparent;
    }
    ::v-deep .selected {
      color: #f9ff6c;
      background: rgba(2, 137, 109, 0.4);
      .el-input {
        .el-select__caret {
          font-size: px-to-rem(14);
          color: #ffffff !important;
        }
      }
    }
    ::v-deep .el-input__suffix {
      right: 0;
    }
  }
  .timeArea {
    flex: 1;
    overflow: hidden;
    ::v-deep .el-date-editor.el-range-editor.el-input__inner {
      padding: 0 px-to-rem(12);
      display: flex;
      align-items: center;
    }
    ::v-deep .el-icon-date {
      width: px-to-rem(16) !important;
      height: px-to-rem(16) !important;
      background: url("~@/assets/image/newCommon/imgIcon14.png") no-repeat;
      background-size: 100% 100%;
      &::before {
        content: "";
      }
    }
    ::v-deep .el-range__icon {
      width: px-to-rem(19) !important;
    }
  }
  ::v-deep .el-date-editor {
    width: 100%;
    display: flex;
    align-items: center;

    .el-input__prefix {
      //left: 0;
      left: px-to-rem(13);
      width: px-to-rem(20);
      //height: 0.2rem;
      height: 100%;
      display: flex;
      align-items: center;
    }
    // 图标
    .el-icon-date {
      //padding-top:px-to-rem(4);
      font-size: px-to-rem(20);
      width: px-to-rem(20);
      height: px-to-rem(20);
      margin-left: 0;
      // margin-top: px-to-rem(1);
    }

    .el-range__close-icon {
      width: 0;
    }

    .el-range-input {
      font-size: px-to-rem(12);
    }
  }
  ::v-deep .el-input__inner {
    background: rgba(2, 137, 109, 0.3);
    border-radius: 4px 4px 4px 4px;
    //border: 1px solid #02896D;
    border: none;
    border-color: transparent;
    height: px-to-rem(32) !important;
    line-height: px-to-rem(32) !important;
    color: #fff;
    font-size: px-to-rem(14);
    &::-webkit-input-placeholder {
      color: #fff;
    }
  }
  ::v-deep .el-input__inner:focus {
    border: 1px solid #02896d;
  }
  ::v-deep .el-input__icon {
    color: #fff;
    font-size: px-to-rem(14);
  }
  ::v-deep .el-range-separator {
    color: #fff;
    line-height: px-to-rem(32);
  }
  ::v-deep .el-range-input {
    background: transparent;
    color: #fff;
  }

  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: px-to-rem(44);
  }
  ::v-deep .el-input--suffix .el-input__inner {
    padding-right: px-to-rem(32);
  }

  // 自定义的组件
  div.custom-picker {
    ::v-deep .el-range-editor.is-active {
      border: 1px solid #02896d;
    }
    ::v-deep.el-icon-d-arrow-right {
    }
  }

  .especialYear {
    ::v-deep .el-icon-date {
      // margin-top:px-to-rem(2)
    }
  }
}
::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #02896d !important;
}

::v-deep .el-select .el-input .el-select__caret {
  color: #FFFFFF !important;
  font-size: px-to-rem(14);
}
</style>
<style lang="scss">
@import "~@/assets/styles/px-to-rem";
div.yearMonthDayTimePopper,
div.yearMonthDayTimePopperDay {
  background: linear-gradient(
    180deg,
    rgba(0, 67, 63, 0.85) 0%,
    rgba(0, 19, 30, 0.9) 100%
  ) !important;
  border-radius: px-to-rem(4) !important;
  border: 1px solid #075b4a !important;
  // 顶部三角
  .popper__arrow {
    display: none;
  }
  //底部确认
  .el-picker-panel__footer {
    display: none;
  }
  // 顶部显示
  .el-date-picker__header {
    border-bottom: 1px solid rgba(232, 243, 254, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    //顶部切换按钮
    .el-picker-panel__icon-btn {
      color: #fff;
      margin: 0;
    }
    // 顶部时间
    .el-date-picker__header-label {
      color: #fff;
    }
  }

  .el-year-table td.disabled .cell {
    background-color: transparent !important;
    color: rgba(232, 243, 254, 0.4) !important;
  }

  .el-month-table td.disabled .cell {
    background-color: transparent !important;
    color: rgba(232, 243, 254, 0.4) !important;
  }

  // 数字
  .el-year-table td,
  .el-month-table td {
    padding: px-to-rem(10) px-to-rem(3);
    .cell {
      color: #fff;
      &:hover {
        background: rgba(2, 137, 109, 0.4);
        border-radius: px-to-rem(50);
      }
    }
  }
  // 当前时间
  .el-year-table .today,
  .el-month-table .today {
    .cell {
      color: #0dc985;
    }
  }
  .el-year-table .current,
  .el-month-table .current {
    .cell {
      background: #02896d;
      color: #fff !important;
      border-radius: px-to-rem(50);
    }
  }

  .el-date-range-picker__header .el-picker-panel__icon-btn {
    margin-right: px-to-rem(10);
  }

  .el-picker-panel__body {
    //min-width: px-to-rem(513);
    min-width: px-to-rem(200) !important;
  }
}

div.yearMonthDayTimePopperDay {
  width: px-to-rem(280);
  //顶部显示
  .el-date-picker__header {
    border-bottom: none;
    margin: 0;
    padding: px-to-rem(12);
    padding-bottom: 0;
    .el-date-picker__header-label {
      font-size: px-to-rem(12);
      line-height: px-to-rem(28);
    }

    .el-icon-d-arrow-right,
    .el-icon-arrow-left {
      flex: 1;
      overflow: hidden;
    }
    .el-icon-arrow-left {
      text-align: left;
      margin-left: px-to-rem(10);
    }
    .el-icon-d-arrow-right {
      text-align: right;
      position: relative;
      left: px-to-rem(13);
    }
    .el-icon-arrow-right {
      position: relative;
      right: px-to-rem(23);
    }
  }
  .el-picker-panel__content {
    margin: 0;
    padding: 0 px-to-rem(12);
    width: px-to-rem(280);
    padding-bottom: px-to-rem(12);
  }
  // 当前时间
  .el-date-table {
    .today {
      span {
        color: #0dc985;
      }
    }
    .available {
      color: #fff;
      &:hover span {
        background: rgba(2, 137, 109, 0.4);
        color: #fff;
      }
    }
    .current,
    .start-date,
    .end-date {
      span {
        background-color: #02896d !important;
      }
    }
    .in-range {
      div {
        //background: rgba(2, 137, 109, 0.4);
        background: transparent;
      }
    }
    .in-range:hover {
      div {
        background: rgba(2, 137, 109, 0.4);
      }
    }
  }
  // 星期
  .el-date-table th {
    border-bottom: 1px solid rgba(232, 243, 254, 0.2);
    color: #fff;
    padding: 0;
  }
  //自定义左边列表
  .el-picker-panel__sidebar {
    padding-top: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 67, 63, 0.85) 0%,
      rgba(0, 19, 30, 0.9) 100%
    );
    border-right: 1px solid #075b4a;
    width: px-to-rem(80);
    .el-picker-panel__shortcut {
      color: #fff;
      font-size: px-to-rem(14);
      padding-left: px-to-rem(12);
      &:hover {
        background: rgba(2, 137, 109, 0.4);
        color: #f9ff6c;
      }
    }
  }
  .el-picker-panel__sidebar + .el-picker-panel__body {
    margin-left: px-to-rem(80);
  }

  .el-picker-panel__body {
    .el-date-range-picker__content {
      padding: px-to-rem(12) px-to-rem(12);
      .el-date-range-picker__header > div {
        font-size: px-to-rem(14);
        height: px-to-rem(28);
        margin-left: px-to-rem(50);
        margin-right: px-to-rem(50);
      }
    }
  }
  // 自定义时间顶部显示
  .el-date-range-picker__header {
    color: #fff;
    height: px-to-rem(28);
    .el-picker-panel__icon-btn {
      color: #fff;
      font-size: px-to-rem(20);
    }
    //.el-picker-panel__icon-btn:nth-child(2) {
    //  margin-left: px-to-rem(20);
    //}
  }
  //自定义时间中间竖线
  .is-left {
    border-right: 1px solid rgba(232, 243, 254, 0.2);
  }
  .el-range__close-icon {
    line-height: px-to-rem(24);
  }

  .el-date-table td.disabled div {
    background-color: transparent !important;
    color: rgba(232, 243, 254, 0.4) !important;
  }
  .el-date-table {
    th {
      font-size: px-to-rem(14);
    }
    td {
      width: px-to-rem(32);
      height: px-to-rem(32);
      padding: 0;

      div {
        height: px-to-rem(32);
        //width: px-to-rem(32);
        width: 100%;
        position: absolute;
        padding: 0;
        display: flex;
        align-items: center;
      }
      span {
        height: px-to-rem(28);
        width: px-to-rem(28);
        line-height: px-to-rem(28);
        font-size: px-to-rem(14);
      }
    }
    td.in-range {
      background: rgba(2, 137, 109, 0.4);
    }
    td.in-range:hover {
      background: transparent;
    }
    td.start-date {
      border-top-left-radius: px-to-rem(15);
      border-bottom-left-radius: px-to-rem(15);
    }
    td.end-date {
      border-top-right-radius: px-to-rem(15);
      border-bottom-right-radius: px-to-rem(15);
    }
    td.start-date:hover {
      background: rgba(2, 137, 109, 0.4);
      //border-top-right-radius: px-to-rem(15);
      //border-bottom-right-radius: px-to-rem(15);
    }
    td.end-date:hover {
      background: rgba(2, 137, 109, 0.4);
      //border-top-left-radius: px-to-rem(15);
      //border-bottom-left-radius: px-to-rem(15);
    }

    td.start-date div {
      margin-left: px-to-rem(0);
      border-top-left-radius: px-to-rem(15);
      border-bottom-left-radius: px-to-rem(15);
      height: px-to-rem(28);
      margin-top: px-to-rem(2);
    }
    td.end-date div {
      height: px-to-rem(28);
      margin-top: px-to-rem(2);
    }
  }
}

div.yearMonthDayTimePopper {
  width: px-to-rem(280);
  .el-date-picker__header {
    padding: px-to-rem(12) 0;
    margin: 0 px-to-rem(12);

    .el-date-picker__header-label {
      font-size: px-to-rem(14);
    }
  }
  .el-date-picker__header--bordered {
    padding-bottom: px-to-rem(12);
  }
  .el-picker-panel__content {
    padding: px-to-rem(14);
    padding-top: 0;
    margin: 0;
    width: 100%;
  }
  .el-year-table td {
    //width: px-to-rem(56);
    height: px-to-rem(32);
    padding: px-to-rem(12) 0;
    .cell {
      width: px-to-rem(56);
      height: px-to-rem(32);
      line-height: px-to-rem(32);
      font-size: px-to-rem(14);
    }
  }

  .el-month-table td {
    div {
      height: px-to-rem(32);
    }
    .cell {
      width: px-to-rem(56);
      height: px-to-rem(32);
      line-height: px-to-rem(32);
      font-size: px-to-rem(14);
    }
  }

  ::v-deep .el-input__inner:focus {
    border: 1px solid #02896d;
  }
}

div.yearMonthDayTimePopperCustom {
  width: px-to-rem(600) !important;
  .el-picker-panel__body {
    display: flex;

    .is-right {
      .el-date-range-picker__header {
        .el-icon-d-arrow-right {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
