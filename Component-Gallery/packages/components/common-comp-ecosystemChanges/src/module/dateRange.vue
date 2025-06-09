<!-- 时间范围选择器 -->
<template>
  <div class="dateRangeBox hh-css" style="display: flex">
    <el-date-picker
      v-if="datePickType === 'month'"
      v-model="dateRange"
      type="monthrange"
      range-separator="至"
      :start-placeholder="`开始月份`"
      :end-placeholder="`结束月份`"
      :picker-options="startDatePickerOptions"
      popper-class="datePickerDrop"
      :value-format="'yyyy-MM'"
      @change="timeDate"
    >
    </el-date-picker>
    <date-year-range
      v-else
      @input="timeDate"
      :value="dateRangeSon"
      :circleClose="circleClose"
      ref="dateYearRange"
      :haveDataTime="haveDataTime"
    />
  </div>
</template>

<script>
import dateYearRange from './dateYearRange'
export default {
  props: {
    datePickType: {
      type: String,
      default: 'year'
    },
    dateRangeProp: {
      type: Array,
      default: () => {
        return []
      }
    },
    haveDataTime: {
      //对应可以选择的区间
      type: Array,
      default: () => {
        return []
      }
    },
    timer: {
      type: Number
    },
    // 是否有清除按钮
    circleClose: {
      type: Boolean,
      default: true
    }
  },
  components: { dateYearRange },
  data() {
    return {
      dateRange: [],
      dateRangeSon: []
    }
  },
  computed: {
    // 开始日期选项
    startDatePickerOptions() {
      return {
        disabledDate(time) {
          // 禁止选择当前日期之后的日期
          return time > new Date()
        }
      }
    }
  },
  watch: {
    timer() {
      this.dateRange = []
      this.dateRangeSon = []
    },
    dateRangeProp: {
      handler(val) {
        this.dateRangeSon = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  },
  mounted() {
    this.dateRangeSon = JSON.parse(JSON.stringify(this.dateRangeProp))
  },
  methods: {
    timeDate(data) {
      console.log('daya', data)
      this.$emit('dateRangeFunc', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
.dateRangeBox {
  width: 100%;
  height: 100%;
}

::v-deep .el-date-editor {
  width: 100%;
  height: px-to-rem(32);
  color: #ffffff;
  background: rgba(2, 137, 109, 0.3);
  border: px-to-rem(0.5) solid transparent;
  box-shadow: inset 0px 0px px-to-rem(0.5) 0px rgba(2, 137, 109, 0.6) !important;

  .el-range-input,
  .range_input {
    width: 100%;
    height: px-to-rem(32);
    line-height: px-to-rem(32);
    border-radius: px-to-rem(0);
    font-size: px-to-rem(14);
    background: transparent;
    color: #ffffff;
  }
  .el-range-input,
  .el-range__close-icon,
  .el-range-separator,
  .el-range__icon {
    color: #ffffff;
    line-height: px-to-rem(22) !important;
    margin: 0 px-to-rem(5);
    position: relative;
  }
  .el-range-input {
    margin: 0;
    top: 0;
  }
  .el-range-separator {
    color: #ffffff;
    line-height: px-to-rem(30) !important;
  }
  .el-input__prefix {
    left: 0;
  }
}
</style>

<style land="scss">
@import '~@component-gallery/ecosystemChanges/assets/style/common.scss';
</style>
