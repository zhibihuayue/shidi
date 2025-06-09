import * as echarts from "echarts";
import moment from "moment";

function pxToRem(px) {
  return `${px / 100}rem`;
}

export function fontSizeComputed(res) {
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  if (!clientHeight) return
  let fontSize = clientHeight / 1080
  return res * fontSize
}

export const treeTotal = function (listData, position=["32%", "20%"]) {
  const myListData = listData.filter((item) => Number(item.value) !== 0);
  const pieData1 = [];
  const sum = myListData.reduce((per, cur) => per + Number(cur.value), 0);
  const gap = (1 * sum) / 100;
  const gapData = {
    name: "",
    value: gap,
    itemStyle: {
      color: "transparent",
    },
  };
  for (let i = 0; i < myListData.length; i++) {
    pieData1.push({ ...myListData[i] });
    pieData1.push(gapData);
  }
  return {
    tooltip: {
      trigger: "item",
      position: position,
      confine: true, // 饼图的数据标签是否被限制在饼图内部 true表示标签限制在饼图内部 false表示标签可能回超出饼图的边界，显示在饼图外部
      formatter: function (params) {
        if (params.data.value === gap) {
          return "";
        }
        return `
                <span style='display:inline-block;width:6px;height:5px;background:${
                  params.color
                };border-radius:100%;position: relative;bottom: 2px'></span>
                <span></span>
                <span>${params.data.title}</span>
                <span style="display:inline-block;margin-left:15px;"> ${
                  params.value
                } (${(Number(params.data.proportion) * 100).toFixed(
          0
        )}%) </span>
                `;
      },
      padding: [4, 10, 4, 10],
      backgroundColor: "rgba(0,0,0,.5)",
      textStyle: {
        color: "#fff", // 自定义文字颜色
        fontSize: 12, // 自定义文字大小
      },
      borderColor: "#02896D", // 自定义边框颜色
    },
    series: [
      {
        name: "",
        zlevel: 1,
        type: "pie",
        radius: ["68%", "73%"],
        center: ["50.2%", "53.5%"],
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          scaleSize: 5,
          label: {
            show: false,
          },
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: "rgba(0,0,0,0.1)",
        },
        data: pieData1,
      },
    ],
  };
};

export let doubleFoldLine = function (names, XData, YData1, YData2) {
  //预制颜色数据
  let col = [{ start: "#2EFFC4", end: "rgba(108, 231, 255, 0)" }];
  let col2 = [
    {
      start: "rgba(249, 255, 108, 0)",
      center: "#F9FF6C",
      end: "rgba(255, 245, 46, 0)",
    },
  ];
  let option = {
    title: {
      text: "顶部名称",
      textStyle: {
        align: "center",
        color: "#fff",
        fontSize: 20,
      },
      top: "3%",
      left: "10%",
      show: false,
    },
    backgroundColor: "",
    grid: {
      top: "0",
      left: "15%",
      right: "15%",
      bottom: "25%",
    },
    // tooltip（提示框组件）
    tooltip: {
      //trigger(触发类型)，可选'item','axis','none'
      trigger: "axis",
      backgroundColor: "rgba(0, 19, 30, 0.7)",
      borderColor: "#02896D",
      borderWidth: 1,
      textStyle: {
        color: "#fff", // 文本颜色
        fontSize: 14, // 字体大小
      },
      axisPointer: {
        type: "line",
        lineStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(0, 255, 233,0)",
              },
              {
                offset: 0.5,
                color: "rgba(255, 255, 255,1)",
              },
              {
                offset: 1,
                color: "rgba(0, 255, 233,0)",
              },
            ],
            // global: false,
          },
        },
      },

      //使用字符串模板自定义显示
      // formatter: '{a0}：{c0}ml<br/>{a1}：{c1}ml<br/>{a2}：{c2}℃'
    },
    legend: {
      bottom: "0%",
      right: "5%",
      name: names,
      itemHeight: 8,
      itemWidth: 8,
      textStyle: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.5)",
      },
    },
    xAxis: {
      type: "category",
      //axisTick 坐标轴刻度相关设置
      axisTick: {
        show: false,
      },
      //axixLine 坐标轴轴线相关设置
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      data: XData || [],
      //axisLabel 坐标轴刻度标签的相关设置
      axisLabel: {
        // show: true,
        color: "rgba(255, 255, 255, 1)",
        fontSize: 10,
      },
    },
    yAxis: [
      {
        name: "降水量mm",
        type: "value",
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: 12,
          formatter: "{value}",
        },

        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed", // y轴显示虚线
            color: "rgba(255,255,255,0.1)",
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        axisTick: {
          // show: false
        },
      },
      {
        name: "温度℃",
        type: "value",
        position: "right",
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: 10,
          formatter: "{value}",
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        axisTick: {
          // show: false
        },
      },
    ],
    series: [
      {
        name: names[0],
        type: "bar",
        data: YData1 || [],
        barWidth: "30%",
        itemStyle: {
          //   color: "#2EFFC4",
          color: {
            type: "linear-gradient",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: (col[0] && col[0].start) || col[0].start, // 0% 处的颜色
              },
              {
                offset: 1,
                color: (col[0] && col[0].end) || col[0].end, // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },

      {
        name: names[1],
        type: "line",
        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        smooth: true, //平滑曲线显示
        showAllSymbol: true, //显示所有图形。
        symbol: "circle", //标记的图形为实心圆
        symbolSize: 8, //标记的大小
        itemStyle: {
          //折线拐点标志的样式
          color: "#FFCE2E",
        },
        lineStyle: {
          //   color: "#FFF52E",
          color: {
            type: "linear-gradient",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: col2[0].start, // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: col2[0].center, // 100% 处的颜色
              },
              {
                offset: 1,
                color: col2[0].end, // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        data: YData2 || [],
      },
    ],
  };
  return option;
};

// 3D柱状图 xData--x轴的值, yData--降水量数组的值, yData2--温度的降水量, time--时间, 时间类型
export let doubleFoline3D = function (xData, yData, yData2, timeOther, type) {
  const offsetX = 6;
  const offsetY = 3;
  const numlength = Math.max.apply(null, yData).toString().length;
  let padlength = 0;
  if (numlength === 1 || numlength === 2) {
    padlength = -24;
  } else if (numlength === 3) {
    padlength = -13;
  } else {
    padlength = 0;
  }
  // console.log('&&&&&&,padlength', padlength)

  // 检测所有温度是否都为 0
  // const allTemperaturesZero = yData2.every(function(value) {
  //   return value === 0;
  // });

  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      // 会canvas的应该都能看得懂，shape是从custom传入的
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - offsetX, shape.y - offsetY];
      const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath();
    },
  });

  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c1 = [shape.x, shape.y];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
      const c4 = [shape.x + offsetX, shape.y - offsetY];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });

  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const c1 = [shape.x, shape.y];
      const c2 = [shape.x + offsetX, shape.y - offsetY]; // 右点
      const c3 = [shape.x, shape.y - offsetX];
      const c4 = [shape.x - offsetX, shape.y - offsetY];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });

  // 注册三个面图形
  echarts.graphic.registerShape("CubeLeft", CubeLeft);
  echarts.graphic.registerShape("CubeRight", CubeRight);
  echarts.graphic.registerShape("CubeTop", CubeTop);

  return {
    legend: {
      show: false,
      right: "0",
      top: "-2%",
      itemGap: 12,
      itemWidth: 12,
      itemHeight: 10,
      data: ["降水量", "温度"],
      textStyle: {
        fontSize: 10,
        color: "#ffffff",
      },
    },

    color: [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "rgba(46, 255, 245, 0.64)",
        },
        {
          offset: 1,
          color: "rgba(46, 255, 245, 0.1)",
        },
      ]),
    ],

    // 设置提示弹窗
    tooltip: {
      //trigger(触发类型)，可选'item','axis','none'
      trigger: "axis",
      backgroundColor: "rgba(0, 19, 30, 0.7)",
      borderColor: "#02896D",
      borderWidth: 1,
      textStyle: {
        color: "#fff", // 文本颜色
        fontSize: 12, // 字体大小
      },
      axisPointer: {
        type: "shadow",
        // lineStyle: {
        //   shadowColor: "rgba(13, 201, 133, 0.2)",
        // }
        shadowStyle: {
          color: "rgba(13, 201, 133, 0.1)",
        },
      },
      formatter: function (params) {
        let timeString = "";
        if (type === "year") {
          const numbers = params[0].axisValueLabel.match(/\d+/g);
          timeString = moment(timeOther + "-" + numbers).format("YYYY-MM");
        } else {
          timeString = params[0].axisValueLabel;
        }
        // const numbers = params[0].axisValueLabel.match(/\d+/g);
        // const timeString = timeOther + "-" + numbers;
        // const timeString = params[0].axisValueLabel
        let content = `<div style="font-size: pxToRem(14)">${timeString}</div>`;
        params.forEach(function (param, index) {
          let time = param.name; // 时间
          let value = param.value; // 数据值
          let seriesName = param.seriesName; // 系列名称
          let iconClass = "circle"; // 默认圆形图标
          let iconColor = "#000"; // 默认颜色
          let unit = "mm";

          // 根据系列名称判断是否为降水量，如果是则使用方形图标和特定颜色
          if (seriesName === "降水量") {
            iconClass = "square";
            iconColor = "linear-gradient( 180deg, #2EFFF5 0%, rgba(46,255,245,0.1) 100%);"; // 绿色表示降水量
            unit = "mm";
            value = Math.round(value)
          } else {
            iconColor = "#0DC985"; // 红色表示其他数据
            unit = "℃";
            value = Math.round(value * 10) / 10
          }
          // 构建每个数据点的 tooltip 内容--<div v-if="${timeShow}" style="font-size: 12px; margin-bottom: 10px">${time}</div>
          content += `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
                        <div style="display: flex; align-items: center">`
          if(iconClass=='square'){
            content+=`<div style="display: inline-block; width: 8px; height: 8px; background: ${iconColor};margin-right: 10px;"></div>`
          }else{
            content+=`<div style="display: inline-block; width: 6px; height: 6px; background: ${iconColor};border-radius:50%;margin:0 11px 0 1px;"></div>`
          }    
          content+=`<div style="font-size: pxToRem(14);">${seriesName}</div>
                        </div>
                        <div style="font-size: pxToRem(14);">${value}${unit}</div>
                    </div>
                `;
        });

        return content;
      },
    },

    grid: {
      top: 12,
      left: "2%",
      right: "2%",
      bottom: "5%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "rgba(239, 247, 253, .1)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: pxToRem(14),
        color: "#ffffff",
        // margin: 20,
        // rotate: xData.length > 7 ? 45 : 0
        interval: type === "custom" ? (xData.length < 10 ? 0 : 2) : 1,
        formatter: function (value) {
          if (type === "year") {
            return value;
          } else {
            // 提取日期中的日部分
            const date = new Date(value);
            return date.getDate();
          }
        },
      },
      // min: 0,
      // max: Math.ceil(Math.max.apply(null, xData) / 5) * 5,
    },

    yAxis: [
      {
        type: "value",
        // name: "降水量mm",
        // nameGap: 12,
        // // nameLocation: "end",
        // nameTextStyle: {
        //   color: "#ffffff",
        //   fontWeight: 400,
        //   fontSize: pxToRem(14),
        //   align: "right",
        //   width: 80,
        //   padding:[0,padlength,0,0]
        // },
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: "rgba(239, 247, 253, .1)",
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(239, 247, 253, .1)",
            type: "dashed",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: pxToRem(14),
          color: "#FFFFFF",
          width: 80,
          overflow: "truncate",
          ellipsis: "...",
        },
        // min: 0,
        // max: Math.ceil(Math.max.apply(null, yData) / 5) * 5,
        // interval: Math.ceil(Math.max.apply(null, yData) / 5),
      },
      {
        // show: !allTemperaturesZero,
        type: "value",
        // name: "温度℃",
        // nameGap: 10,
        // nameTextStyle: {
        //   color: "#ffffff",
        //   fontWeight: 400,
        //   fontSize: pxToRem(14),
        //   align: "center",
        //   width: 80
        // },
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: "rgba(239, 247, 253, .1)",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(239, 247, 253, .1)",
            type: "dashed",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: pxToRem(14),
          color: "#FFFFFF",
          // width: 80,
          overflow: "truncate",
          ellipsis: "...",
        },
      },
    ],

    series: [
      {
        name: "降水量",
        type: "custom",
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)]);
          return {
            type: "group",
            // x: -20,
            children: [
              {
                type: "CubeLeft",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgba(46, 255, 245, 0.512)",
                    },
                    {
                      offset: 1,
                      color: "rgba(46, 255, 245, 0.08)",
                    },
                  ]),
                  stroke: "rgba(3, 25, 63, .1)", //边框颜色
                },
              },
              {
                type: "CubeRight",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgba(46, 255, 245, 0.7)",
                    },
                    {
                      offset: 1,
                      color: "rgba(46, 255, 245, 0.25)",
                    },
                  ]),
                  stroke: "rgba(3, 25, 63, .1)", //边框颜色
                },
              },
              {
                type: "CubeTop",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgba(46, 255, 245, 0.1)",
                    },
                    {
                      offset: 1,
                      color: "rgba(46, 255, 245, 0.64)",
                    },
                  ]),
                  stroke: "rgba(3, 25, 63, .1)", //边框颜色
                },
              },
            ],
          };
        },
        data: yData,
        emphasis: {
          itemStyle: {
            // 鼠标悬停时的数据点样式
            // color: 'white', // 内部颜色（实心）
            // borderColor: 'green', // 边框颜色（模拟空心效果）
            // borderWidth: 3, // 边框宽度（模拟空心效果）
            // // 由于 borderWidth 会增加整体大小，我们需要减小 radius 来保持整体大小一致
            // // 但由于 ECharts 不支持直接设置空心圆，这里只是模拟效果
            // // 真正的空心圆需要额外的图形处理
            // radius: 4 // 减小半径以模拟边框的效果
          },
        },
      },
      {
        name: "温度",
        type: "line",
        showSymbol: true,
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        yAxisIndex: 1,
        emphasis: {
          itemStyle: {
            // 鼠标悬停时的数据点样式
            color: "#ffffff", // 内部颜色（实心）
            borderColor: "#0DC985", // 边框颜色（模拟空心效果）
            borderWidth: 2, // 边框宽度（模拟空心效果）
            // 由于 borderWidth 会增加整体大小，我们需要减小 radius 来保持整体大小一致
            // 但由于 ECharts 不支持直接设置空心圆，这里只是模拟效果
            // 真正的空心圆需要额外的图形处理
            radius: 5, // 减小半径以模拟边框的效果
          },
        },
        itemStyle: {
          color: "#0DC985",
        },
        lineStyle: {
          width: 2,
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(13, 201, 133, 0.5)",
              },
              {
                offset: 1,
                color: "rgba(13, 201, 133, 0)",
              },
            ]),
          },
        },
        data: yData2,
      },
    ],
  };
};
// 折线图
export let discountChart = function (leftText, rightText, xData, yData) {
  let maxDataValue = 0;
  let maxYear = 0;
  let yAxisMaxValue = 0;
  if (yData.length > 0) {
    maxDataValue = Math.max(...yData);
    maxYear = Math.max(...xData);
    yAxisMaxValue = Math.ceil((maxDataValue * 1.1) / 100) * 100;
  }
  let option = {
    backgroundColor: "transparent",
    title: [
      {
        text: leftText,
        textStyle: {
          color: "rgba(255, 255, 255)",
          fontSize: 12,
          fontWeight: 400,
        },
        top: "5%",
        left: "0",
      },
      {
        text: rightText,
        textStyle: {
          color: "rgba(255, 255, 255)",
          fontSize: 12,
          fontWeight: 400,
          rich: {
            square: {
              backgroundColor: "#47FFE6",
              width: 6,
              height: 6,
            },
            space: {
              width: 4,
            },
          },
        },
        top: "5%",
        right: "0",
      },
    ],
    tooltip: {
      show: false, // 不显示 tooltip
    },
    grid: {
      top: "25%",
      left: "12%",
      right: "2%",
      bottom: "15%",
      // containLabel: true
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          // x轴刻度
          show: false,
        },
        //axixLine 坐标轴轴线相关设置
        axisLine: {
          lineStyle: {
            // color: "#30CBAB",
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        splitArea: {
          // show: true, // 保留网格区域
          color: "#f00",
          lineStyle: {
            color: "#f00",
          },
        },
        axisLabel: {
          // 坐标轴样式
          color: "#fff",
          fontSize: pxToRem(14),
          rotate: xData.length > 5 ? 35 : 0,
        },
        splitLine: {
          // 去除网格线
          show: false,
        },
        // boundaryGap: false,// 默认true 刻度居中显示(这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。)
        data: xData,
      },
    ],

    yAxis: [
      {
        type: "value",
        min: 0,
        max: yAxisMaxValue > 0 ? yAxisMaxValue : undefined,
        splitNumber: 4,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed", // y轴显示虚线
            color: "rgba(255,255,255,0.1)",
          },
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          //   marginRight: 10,
          fontSize: pxToRem(14),
          textStyle: {
            color: "rgba(255, 255, 255, 1)",
          },
          formatter: (value) => {
            // y轴数据可能过大 所以这里要处理一下
            if (value > 10000) {
              return (value / 10000).toFixed(0) + "万";
            } else {
              return value;
            }
          },
        },
        axisTick: {
          // y轴刻度
          show: true,
        },
      },
    ],
    series: [
      {
        name: "",
        type: "line",
        markLine: {
          symbol: "none",
          animation: false,
          silent: true, // 图形是否不影响和触发鼠标事件，默认为false,即响应和触发鼠标点击事件
          data: [
            {
              xAxis: maxYear.toString(),
            },
          ],
          label: {
            show: false,
          },
          lineStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(238,238,238,0)",
                },
                {
                  offset: 0.5,
                  color: "rgba(255, 255, 255,0.7)",
                },
                {
                  offset: 1,
                  color: "rgba(238,238,238,0)",
                },
              ],
              global: false,
            },
            // 指示器样式
            width: 2, // 线宽
            type: "solid", // 实线
          },
        },
        // smooth: true, //是否平滑
        showAllSymbol: true,
        symbol: "circle",
        // symbolSize: 15, // 设置标记的大小，可以是数值，也可以是函数
        lineStyle: {
          color: "#47FFD7",
        },
        label: {
          show: false,
          position: "top",
          textStyle: {
            color: "#00ca95",
          },
        },

        itemStyle: {
          color: "#fff",
          borderColor: "#00ca95",
          borderWidth: 1.5,
          shadowColor: "rgba(46, 255, 220, 0.5)",
          shadowBlur: 0,
          shadowOffsetY: 0,
          shadowOffsetX: 0,
        },
        tooltip: {
          show: false,
        },
        areaStyle: {
          normal: {
            color: "transparent",
            shadowColor: "rgba(0,202,149, 0.9)",
            shadowBlur: 20,
          },
        },
        data: yData,
      },
    ],
  };
  return option;
};

// 圆弧角圆环(中间文字+外层光圈版)
export let pieChart = function (params, title, color) {
  let data = [];
  params.forEach((item, index) => {
    data.push({
      name: item.name,
      value: item.value,
      itemStyle: {
        color: {
          type: "linear",
          x: 1,
          y: 1,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "rgba(255,255,255,.01)", // 0% 处的颜色
              // color: 'transparent' // 0% 处的颜色
            },
            {
              offset: 0.5,
              color: color[index], // 0% 处的颜色
            },
            {
              offset: 1,
              color: color[index], // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        // borderRadius: 20, // 内部每一个圆环有一定弧度
        borderColor: "rgba(0, 19, 30, 0.7)", // 边框颜色
        borderWidth: 3, // 边框宽度 这样每个圆环与圆环之间有一定距离
        shadowBlur: 12,
        shadowColor: "rgba(24,219,159,0.6)", // 阴影颜色
      },
    });
  });
  let option = {
    toolbar: {
      show: true,
    },
    title: {
      text: title,
      top: "center",
      left: "center",
      textStyle: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        rich: {
          total: {
            padding: [10, 0, 0, 0],
            fontSize: 14,
            fontWeight: 500,
            color: "#fff",
          },
        },
      },
    },
    series: [
      {
        name: "",
        startAngle: 0,
        type: "pie",
        borderWidth: 2,
        clockwise: false,
        center: ["50%", "50%"],
        radius: ["69%", "85%"],
        data: data,

        label: {
          show: false,
        },
        emphasis: {
          disable: true, //是否关闭扇区高亮效果
          scale: true, //扇区是否缩放
        },
      },
      {
        type: "pie",
        hoverAnimation: false,
        // startAngle: 0,
        radius: ["97%", "99%"],
        data: [
          {
            value: 1,
            itemStyle: {
              color: {
                // 最外层光圈颜色
                type: "linear",
                x: 1,
                y: 0,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(16,235,158, 0.01)", // 右边的颜色
                  },
                  {
                    offset: 0.5,
                    color: "#10EB9E", // 上下的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(16,235,158, 0.01)", // 左边的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
        emphasis: {
          disable: true, //是否关闭扇区高亮效果
          scale: false, //扇区是否缩放
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
      },
    ],
  };
  return option;
};

// 病虫害预测折线图
export let insectPestLine = function (param){
  let { name  , levelList , xData , yData , selectIndex , pieces , warningLevel} = param
  let markLineData=[]
  levelList.forEach(item=>{
    markLineData.push(
      { 
        yAxis: item.value,
        name:item.name,
        label:{
          color:"#fff",
          formatter:'{b}',
          fontSize:pxToRem(14),
        },
        lineStyle:{
          width:0
        }
      }
    )
  })
  return {
    tooltip:{
      show:true,
      borderColor:"#02896D",
      backgroundColor:"rgba(0, 19, 30, 0.7)",
      textStyle:{
        color:"#fff"
      },
      position:["40%","40%"],
      formatter:(params)=>{
        let content=`<div>${name}</div>`
        content+=`<div>${xData[params.dataIndex]}</div>`
        content+=`<div>预测密度：${params.value}只/㎡</div>`
        content+=`<div>风险等级：${warningLevel[params.dataIndex]}</div>`
        return content
      }
    },
    xAxis: {
      axisTick:{
        show:false
      },
      axisLabel:{
        color:'#fff'
      },
      data: xData.map(item=>moment(item).format("DD"))
    },
    yAxis: [
      {
        type: 'value',
        name:"密度：(只/㎡)",
        nameTextStyle:{
          color:'#fff',
          fontSize:pxToRem(14),
          padding:[0,0,0,fontSizeComputed(30)]
        },
        axisLabel:{
          color:'#fff'
        },
        splitLine:{
          lineStyle:{
            type:"dashed",
            color:"rgba(232, 243, 254, 0.2)"
          }
        }
      },
      {
        type: 'value',
        name:"风险等级",
        nameTextStyle:{
          color:'#fff',
          fontSize:pxToRem(14),
          padding:[0,fontSizeComputed(-45),0,0]
        }
      }
    ],
    grid:{
      top:fontSizeComputed(40),
      left:fontSizeComputed(35),
      bottom:fontSizeComputed(35),
      right:fontSizeComputed(55)
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      dimension: 1, // 按数据的索引分段
      seriesIndex: 0, // 对第一个系列进行映射
      pieces:pieces
    },
    series: [
      {
        data:yData,
        type: 'line',
        lineStyle:{
          width:3
        },
        areaStyle:{
          color: {
            type: "linear",
            x: 1,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgba(238,238,238,0)",
              },
              {
                offset: 1,
                color: "rgba(214,116,48,0.8)",
              },
            ],
            global: false,
          },
        },
        symbolSize: 7,
        markLine: {
          symbol:"none",
          silent: true,
          data: [
            ...markLineData,
            {
              xAxis:selectIndex,
              lineStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(238,238,238,0)",
                    },
                    {
                      offset: 0.5,
                      color: "rgba(255, 255, 255,0.7)",
                    },
                    {
                      offset: 1,
                      color: "rgba(238,238,238,0)",
                    },
                  ],
                  global: false,
                },
                // 指示器样式
                width: 2, // 线宽
                type: "solid", // 实线
              },
              label:{
                show:false
              }
            }
          ]
        }
      }
    ]
  }
}
