<!--
 * @Description  : 基础 - 时间滑块选择器
 * @Version      : V1.0.0
 * @Author       : Colin Yang
 * @Date         : 2024-10-25 08:59:19
 * @LastEditors  : Colin Yang
 * @LastEditTime : 13:23
 * @FilePath     : BaseSliderTime
 * Copyright 2024 Colin Yang, All Rights Reserved.
-->
<template>
  <div
    :class="[
      bem.root,
      {
        readonly: readonly
      }
    ]"
  >
    <div class="slider-time" @mouseup="onMouseup">
      <div
        v-for="scale in scales"
        :key="scale.id"
        :ref="scale.id"
        class="scale"
        :class="{
          hour: (Number(scale.value) + 10) % 60 === 0,
          disabled: disabled.includes(scale.id),
          occupy: occupy.includes(scale.id),
          selected: selected.includes(scale.id)
        }"
        @mousedown="onMousedown(scale.id)"
        @mousemove="onScaleMove(scale.id)"
        @mouseleave="onScaleLeave(scale.id)"
      >
        <div v-if="isStart(scale.id)" class="is-start"></div>
        <div class="label">
          {{ (Number(scale.value) + 10) % 60 === 0 ? (Number(scale.value) + 10) / 60 : '' }}
        </div>
        <div v-if="isEnd(scale.id)" class="is-end"></div>
      </div>
    </div>
    <!--  占用时间段提示信息  -->
    <div v-if="occupyMessage && occupied && !readonly" class="occupy-message">
      {{ occupyMessage }}
    </div>
    <template v-for="popper in groups">
      <div
        v-if="popper.data.includes(hoverScaleId)"
        :key="popper.data.join(',')"
        class="slider-popper"
        :style="popper.style"
      >
        <div class="popper-content">
          {{ displayPopper(popper.data[0], popper.data.at(-1)) }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { createNameSpace } from '@component-gallery/utils/bem/create'
const bem = createNameSpace('base-slider-time')

export default {
  name: 'base-slider-time',
  props: {
    // 时间段值
    value: {
      type: Array,
      default: () => []
    },
    // 禁止时间段
    disabled: {
      type: Array,
      default: () => []
    },
    // 占用时间段
    occupy: {
      type: Array,
      default: () => []
    },
    // 占用时间段提示信息
    occupyMessage: {
      type: String
    },
    // 只读显示
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selecting: false, // 选择状态
      isInSelected: false, // 是否在已选中范围内
      start: '', // 开始时间
      startIndex: 0, // 开始索引
      selected: [], // 已选中的刻度id列表
      groups: [], // 分组后的样式信息
      hoverScaleId: '' // 浮动元素
    }
  },
  computed: {
    bem() {
      return {
        root: bem.b('')
      }
    },
    scales() {
      // 生成时间刻度 00:00 - 23:50
      // 定义一个函数，用于生成时间刻度
      const generateTimeScales = (startHour, endHour) => {
        const scales = []
        // 外层循环，控制小时数
        for (let hour = startHour; hour <= endHour; hour++) {
          // 内层循环，控制分钟数，每隔10分钟生成一个刻度
          for (let minute = 0; minute < 60; minute += 10) {
            // 构造刻度id，格式为"HH:MM"
            const id = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
            // 构造刻度值，表示从0点开始经过的分钟数
            const value = String(hour * 60 + minute)
            // 起始时间，与刻度id相同
            const start = id
            // 计算结束时间的分钟数和小时数
            const endMinute = minute + 10
            const endHourPart = Math.floor(endMinute / 60)
            const endMinutePart = endMinute % 60
            // 构造结束时间，格式为"HH:MM"
            const end = `${String(hour + endHourPart).padStart(2, '0')}:${String(endMinutePart).padStart(2, '0')}`
            // 将刻度信息添加到scales数组中
            scales.push({ id, value, start, end })
          }
        }
        // 返回生成的刻度数组
        return scales
      }
      // 调用generateTimeScales函数，生成00:00到23:50的时间刻度
      return generateTimeScales(0, 23)
    },
    /**
     * 占用时间段选择
     *
     * @returns {boolean} 如果已选时间段中至少有一个时间段被占用，则返回true；否则返回false
     */
    occupied() {
      // 遍历occupy数组 判断当前遍历到的时间段t是否在已选时间段selected中
      return this.occupy.some((t) => this.selected.includes(t))
    }
  },
  watch: {
    /**
     * 数据源变化
     */
    value: {
      handler(val) {
        if (!val.length) {
          this.selected = []
          this.groups = []
          return
        }

        // 判断是否所有数据都不包含冒号，如果是，则认为是老数据
        const isOld = val.filter((t) => t.includes(':')).length === 0
        // 如果是老数据
        if (isOld) {
          // 对老数据进行处理
          this.selected = val.reduce((res, current) => {
            // 过滤出包含当前值的刻度id
            const data = this.scales.filter((t) => t.id.includes(`${current}:`)).map((t) => t.id)
            // 将过滤出的刻度id添加到结果数组中
            return res.concat(data)
          }, [])
          // 触发input事件，传递更新后的已选中列表
          this.$emit('input', [...this.selected])
          // 返回false，表示处理结束
          return
        }
        // 如果是新数据，则直接赋值给selected
        this.selected = val
        // 在DOM更新后，调用setGroup函数设置分组
        this.$nextTick(() => {
          this.setGroup()
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 获取 选择区间
     * @param startIndex 起始索引
     * @param endIndex 结束索引
     * @returns {*[]} 返回选择区间的数组
     */
    getRange(startIndex, endIndex) {
      // 判断起始索引和结束索引的大小关系，以确定起始和结束位置
      const start = startIndex < endIndex ? startIndex : endIndex
      const end = startIndex > endIndex ? startIndex : endIndex
      // 返回从起始位置到结束位置的切片数组
      return this.scales.slice(start, end)
    },
    /**
     * 判断给定的ID是否存在于某个组的第一个数据中
     *
     * @param id 需要检查的ID
     */
    isStart(id) {
      return this.groups.some((t) => t.data[0] === id)
    },
    /**
     * 判断给定的ID是否存在于某个组的最后一个数据中
     *
     * @param id 需要检查的ID
     */
    isEnd(id) {
      return this.groups.some((t) => t.data.at(-1) === id)
    },
    /**
     * 刻度选中
     * @param id 刻度id
     */
    select(id) {
      // 如果刻度id在禁用列表中，则直接返回
      if (this.disabled.includes(id)) {
        return
      }
      // 找到刻度id在刻度数组中的索引
      const endIndex = this.scales.findIndex((t) => t.id === id)
      // 如果起始索引与结束索引相同，即点击的是同一个刻度
      if (this.startIndex === endIndex) {
        // 如果该刻度id不在已选中的列表中，则添加到已选中列表
        if (!this.selected.includes(id)) {
          this.selected.push(id)
          this.$emit('input', [...this.selected])
        }
        return
      }
      // 获取起始索引到结束索引之间的刻度范围
      const range = this.getRange(this.startIndex, endIndex)
      // 遍历刻度范围，将每个刻度的id添加到已选中列表中（如果不存在的话）
      range.forEach((add) => {
        if (!this.selected.includes(add.id)) {
          this.selected.push(add.id)
        }
      })
      // 如果结束刻度的id不在已选中列表中，则添加到已选中列表
      if (!this.selected.includes(id)) {
        this.selected.push(id)
      }
      // 触发input事件，传递新的已选中刻度列表
      this.$emit('input', [...this.selected])
    },
    /**
     * 移除选中
     * @param id 刻度id
     */
    remove(id) {
      // 如果刻度id在禁用列表中，则直接返回
      if (this.disabled.includes(id)) {
        return
      }
      // 找到刻度id在刻度数组中的索引
      const endIndex = this.scales.findIndex((t) => t.id === id)
      // 如果起始索引与结束索引相同，即点击的是同一个刻度
      if (this.startIndex === endIndex) {
        // 从已选中列表中移除该刻度id
        this.selected = this.selected.filter((t) => t !== id)
        this.$emit('input', [...this.selected])
        return
      }
      // 获取起始索引到结束索引之间的刻度范围
      const range = this.getRange(this.startIndex, endIndex)
      // 遍历刻度范围，从已选中列表中移除每个刻度的id
      range.forEach((remove) => {
        // 使用cloneDeep深拷贝已选中列表，防止直接修改原数组
        this.selected = this.selected.filter((t) => t !== remove.id)
      })
      // 再次从已选中列表中移除点击的刻度id（确保移除）
      this.selected = this.selected.filter((t) => t !== id)
      // 触发input事件，传递新的已选中刻度列表
      this.$emit('input', [...this.selected])
    },
    /**
     * 鼠标按下事件
     * @param id
     */
    onMousedown(id) {
      // 如果处于只读模式，则直接返回
      if (this.readonly) {
        return
      }
      // 记录起始刻度id
      this.start = id
      // 找到起始刻度id在刻度数组中的索引
      this.startIndex = this.scales.findIndex((t) => t.id === id)
      // 设置选择状态为true
      this.selecting = true
      // 判断起始刻度id是否已选中
      this.isInSelected = !this.selected.includes(id)
      // 调用onScaleMove方法，处理刻度移动的逻辑
      this.onScaleMove(id)
    },
    /**
     * 鼠标抬起事件
     */
    onMouseup() {
      // 如果处于只读模式，则直接返回
      if (this.readonly) {
        return
      }
      // 结束选择状态
      this.selecting = false
    },

    /**
     * 刻度移动
     * @param id 刻度id
     */
    onScaleMove(id) {
      // 更新当前悬停的刻度id
      this.hoverScaleId = id
      // 如果处于只读模式，则直接返回
      if (this.readonly) {
        return
      }
      // 如果未在选择状态，则直接返回
      if (!this.selecting) {
        return
      }
      // 判断当前刻度是否在已选中范围内
      if (this.isInSelected) {
        // 如果在已选中范围内，则执行选择操作
        this.select(id)
      } else {
        // 如果不在已选中范围内，则执行移除操作
        this.remove(id)
      }
      // 设置时间选择分组
      this.setGroup()
    },
    /**
     * 刻度 离开
     * @param id
     */
    onScaleLeave(id) {
      // 如果离开的刻度id与当前悬停的刻度id相同
      if (this.hoverScaleId === id) {
        // 将当前悬停的刻度id设置为空字符串
        this.hoverScaleId = ''
      }
    },
    /**
     * 设置 时间选择 分组
     */
    setGroup() {
      // 复制选择的时间数组
      let timeArray = [...this.selected]
      // 初始化结果数组
      let result = []
      // 如果只选择了一个时间，则直接将其作为一个分组
      if (timeArray.length === 1) {
        result = [timeArray]
        this.groups = this.setGroupStyle(result)
        return
      }

      // 对时间数组进行排序
      // 将时间数组按照分钟数进行排序
      timeArray.sort((a, b) => this.timeToMinutes(a) - this.timeToMinutes(b))

      let currentGroup = []
      // 遍历时间数组找到连续时间段
      for (let i = 0; i < timeArray.length - 1; i++) {
        const current = this.timeToMinutes(timeArray[i])
        const next = this.timeToMinutes(timeArray[i + 1])
        // 如果当前时间和下一个时间间隔为10分钟,是连续时间，则将当前时间加入当前分组
        if (next - current === 10) {
          currentGroup.push(timeArray[i])
          // 如果是最后一个时间，则将其加入当前分组
          if (i === timeArray.length - 2) {
            currentGroup.push(timeArray[i + 1])
            result.push(currentGroup)
          }
        } else {
          // 如果当前时间和下一个时间间隔不为10分钟,不是连续时间，则将当前分组加入结果数组，并重置当前分组
          currentGroup.push(timeArray[i])
          result.push(currentGroup)
          currentGroup = []
          // 如果是最后一个时间，且其不在当前分组中，则将其单独作为一个分组加入结果数组
          if (i === timeArray.length - 2) {
            result.push([timeArray[i + 1]])
          }
        }
      }
      // 设置分组样式
      this.groups = this.setGroupStyle(result)
    },
    /**
     * 设置 时间选择 分组样式
     */
    setGroupStyle(val) {
      // 对传入的分组数据进行遍历
      return val.map((item) => {
        // 返回每个分组的数据和样式
        return {
          // 分组的数据
          data: item,
          // 获取并设置每个分组的样式
          style: this.getPopperStyle(item)
        }
      })
    },
    /**
     * 获取 时间选择 分组样式
     * @param val 分组后的时间段市局
     */
    getPopperStyle(val) {
      // 获取中间值
      const findMedian = (arr) => {
        // 对数组进行排序
        const sortedArr = arr.sort((a, b) => this.timeToMinutes(a) - this.timeToMinutes(b))
        const length = sortedArr.length
        // 如果数组长度为1
        if (length === 1) {
          return sortedArr[0]
          // 如果数组长度为奇数
        } else if (length % 2 === 1) {
          // 数据个数为奇数，直接取中间位置的数
          return sortedArr[Math.floor(length / 2)]
          // 如果数组长度为偶数
        } else {
          // 数据个数为偶数，取中间两个数的平均值
          const midIndex1 = length / 2 - 1
          const midIndex2 = length / 2
          return [sortedArr[midIndex1], sortedArr[midIndex2]]
        }
      }

      const style = {}
      const median = findMedian(val)
      // 如果中位数是一个数组
      if (median instanceof Array) {
        if (this.$refs[median[0]]) {
          const $elementA = this.$refs[median[0]][0]
          const $elementB = this.$refs[median[1]][0]
          // 设置左侧位置为两个元素的平均偏移量
          style.left = ($elementA.offsetLeft + $elementB.offsetLeft) / 2 + 'px'
          // 设置顶部位置为第一个元素的偏移量
          style.top = $elementA.offsetTop + 'px'
        }
        // 如果中位数不是数组
      } else {
        if (this.$refs[median]) {
          const $element = this.$refs[median][0]
          // 设置左侧位置为元素的偏移量
          style.left = $element.offsetLeft + 'px'
          // 设置顶部位置为元素的偏移量
          style.top = $element.offsetTop + 'px'
        }
      }

      return style
    },
    /**
     * 显示 popper 内容
     * @param start 开始时间
     * @param end 结束时间
     * @returns {string} popper 内容
     */
    displayPopper(start, end) {
      // 在scales数组中查找id等于start的对象，并获取其start属性
      return `${this.scales.find((t) => t.id === start).start}-${
        // 在scales数组中查找id等于end的对象，并获取其end属性
        this.scales.find((t) => t.id === end).end
      }`
    },
    /**
     * 辅助函数，将时间字符串转换为分钟数，方便比较大小
     * @param time 时间 格式为 00:00
     * @returns {number} 分钟数
     */
    timeToMinutes(time) {
      // 将时间字符串按冒号分割成小时和分钟
      const [hours, minutes] = time.split(':').map(Number)
      // 将小时转换为分钟并加上分钟数，得到总分钟数
      return hours * 60 + minutes
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';
@import '~@component-gallery/theme-chalk/src/mixins/theme-mixins';

.base-slider-time {
  @include themeify(false) {
    // 通用
    @if $theme-name == 'theme-wiseblue' {
      --base-slider-time__avaliable_color: rgba(79, 159, 255, 0.2); // 可选颜色
      --base-slider-time__selected_color: #1373e6; // 选中颜色
      --base-slider-time__disabled_color: #758091; // 禁用 颜色
      --base-slider-time__scale_color: #fff; // 刻度 颜色
      --base-slider-time__scale_border_color: #e8f3fe; // 刻度 颜色
      --base-slider-time__scale_popper_color: #e8f3fe; // popper 颜色
      --base-slider-time__scale_popper_bg: #1373e6; // popper 背景
    }

    // 林业
    @if $theme-name == 'theme-aquamarine' {
      --base-slider-time__avaliable_color: rgba(2, 137, 109, 0.2); // 可选颜色
      --base-slider-time__selected_color: #02896d; // 选中颜色
      --base-slider-time__disabled_color: #758091; // 禁用 颜色
      --base-slider-time__scale_color: #fff; // 刻度 颜色
      --base-slider-time__scale_border_color: #fff; // 刻度 颜色
      --base-slider-time__scale_popper_color: #fff; // popper 颜色
      --base-slider-time__scale_popper_bg: #02896d; // popper 背景
    }

    // 国土
    @if $theme-name == 'theme-terracotta' {
      --base-slider-time__avaliable_color: rgba(100, 86, 46, 0.4); // 可选颜色
      --base-slider-time__selected_color: #9f9853; // 选中颜色
      --base-slider-time__disabled_color: #7a786d; // 禁用 颜色
      --base-slider-time__scale_color: #fff; // 刻度 颜色
      --base-slider-time__scale_border_color: #fff; // 刻度 颜色
      --base-slider-time__scale_popper_color: #fff; // popper 颜色
      --base-slider-time__scale_popper_bg: #9f9853; // popper 背景
    }
  }

  width: 100%;
  user-select: none;

  .slider-time {
    display: flex;
    flex-wrap: wrap;

    .scale {
      position: relative;
      flex: 1 0 calc(100% / 72);
      height: px-to-rem(12);
      background: var(--base-slider-time__avaliable_color);
      margin: px-to-rem(32) 0;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: px-to-rem(1);
        height: px-to-rem(4);
        background: var(--base-slider-time__scale_color);
      }

      // 每行第一个元素
      &:first-child,
      &:nth-child(73) {
        border-top-left-radius: px-to-rem(2);
        border-bottom-left-radius: px-to-rem(2);

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: px-to-rem(1);
          height: px-to-rem(4);
          background: var(--base-slider-time__scale_color);
        }
      }

      // 每行最后一个元素
      &:last-child,
      &:nth-child(72) {
        border-top-right-radius: px-to-rem(2);
        border-bottom-right-radius: px-to-rem(2);
      }

      &.hour {
        &::after {
          height: px-to-rem(8);
        }
      }

      &.occupy {
        background: var(--base-slider-time__disabled_color);
      }

      // 选中的元素
      &.selected {
        background: var(--base-slider-time__selected_color);

        // 选择初始元素
        .is-start {
          position: absolute;
          left: px-to-rem(-1);
          top: px-to-rem(-2);
          width: px-to-rem(2);
          height: px-to-rem(16);
          background: var(--base-slider-time__scale_border_color);
          z-index: 1;
        }

        // 选中结尾元素
        .is-end {
          position: absolute;
          right: px-to-rem(-1);
          top: px-to-rem(-2);
          width: px-to-rem(2);
          height: px-to-rem(16);
          background: var(--base-slider-time__scale_border_color);
          z-index: 1;
        }
      }

      // 选中 & 占用 同时存在
      &.occupy.selected {
        background: linear-gradient(
          to bottom,
          var(--base-slider-time__selected_color) 0%,
          var(--base-slider-time__selected_color) 75%,
          var(--base-slider-time__disabled_color) 75%,
          var(--base-slider-time__disabled_color) 100%
        );
      }

      // 禁止颜色
      &.disabled {
        background: var(--base-slider-time__disabled_color);
        cursor: not-allowed;
      }

      .label {
        position: absolute;
        font-size: px-to-rem(14);
        top: calc(100% + px-to-rem(4));
        right: 0;
      }
    }
  }

  .slider-popper {
    position: absolute;
    display: inline-flex;
    transform: translate(-45%, -145%);

    //
    .popper-content {
      position: relative;
      white-space: nowrap;
      font-size: px-to-rem(14);
      line-height: px-to-rem(24);
      color: var(--base-slider-time__scale_popper_color);
      background: var(--base-slider-time__scale_popper_bg);
      padding: 0 px-to-rem(12);
      border-radius: px-to-rem(4);

      &::after {
        content: '';
        position: absolute;
        top: calc(100% - px-to-rem(1));
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: px-to-rem(4) solid transparent;
        border-right: px-to-rem(4) solid transparent;
        border-top: px-to-rem(6) solid var(--base-slider-time__scale_popper_bg);
      }
    }

    &:hover {
      z-index: 2;
    }
  }

  // 占用提示
  .occupy-message {
    position: absolute;
    font-size: px-to-rem(14);
    color: #ed5158;
    transform: translateY(-50%);
  }
}
</style>
