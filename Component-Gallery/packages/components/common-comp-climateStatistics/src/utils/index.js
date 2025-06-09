import * as echarts from 'echarts'
import moment from 'moment'
function pxToRem(px) {
  return `${px / 100}rem`
}
// 3D柱状图 xData--x轴的值, yData--降水量数组的值, yData2--温度的降水量, time--时间, 时间类型
export let doubleFoline3D = function (xData, yData, yData2, timeOther, type) {
  const offsetX = 6
  const offsetY = 3
  const numlength = Math.max.apply(null, yData).toString().length
  let padlength = 0
  if (numlength === 1 || numlength === 2) {
    padlength = -24
  } else if (numlength === 3) {
    padlength = -13
  } else {
    padlength = 0
  }
  // console.log('&&&&&&,padlength', padlength)

  // 检测所有温度是否都为 0
  // const allTemperaturesZero = yData2.every(function(value) {
  //   return value === 0;

  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx, shape) {
      // 会canvas的应该都能看得懂，shape是从custom传入的
      const xAxisPoint = shape.xAxisPoint
      const c0 = [shape.x, shape.y]
      const c1 = [shape.x - offsetX, shape.y - offsetY]
      const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY]
      const c3 = [xAxisPoint[0], xAxisPoint[1]]
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath()
    }
  })

  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint
      const c1 = [shape.x, shape.y]
      const c2 = [xAxisPoint[0], xAxisPoint[1]]
      const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY]
      const c4 = [shape.x + offsetX, shape.y - offsetY]
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath()
    }
  })

  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx, shape) {
      const c1 = [shape.x, shape.y]
      const c2 = [shape.x + offsetX, shape.y - offsetY] // 右点
      const c3 = [shape.x, shape.y - offsetX]
      const c4 = [shape.x - offsetX, shape.y - offsetY]
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath()
    }
  })

  // 注册三个面图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft)
  echarts.graphic.registerShape('CubeRight', CubeRight)
  echarts.graphic.registerShape('CubeTop', CubeTop)

  return {
    legend: {
      show: false,
      right: '0',
      top: '-2%',
      itemGap: 12,
      itemWidth: 12,
      itemHeight: 10,
      data: ['降水量', '温度'],
      textStyle: {
        fontSize: 10,
        color: '#ffffff'
      }
    },

    color: [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(46, 255, 245, 0.64)'
        },
        {
          offset: 1,
          color: 'rgba(46, 255, 245, 0.1)'
        }
      ])
    ],

    // 设置提示弹窗
    tooltip: {
      //trigger(触发类型)，可选'item','axis','none'
      trigger: 'axis',
      backgroundColor: 'rgba(0, 19, 30, 0.7)',
      borderColor: '#02896D',
      borderWidth: 1,
      textStyle: {
        color: '#fff', // 文本颜色
        fontSize: 12 // 字体大小
      },
      axisPointer: {
        type: 'shadow',
        // lineStyle: {
        //   shadowColor: "rgba(13, 201, 133, 0.2)",
        // }
        shadowStyle: {
          color: 'rgba(13, 201, 133, 0.1)'
        }
      },
      formatter: function (params) {
        let timeString = ''
        if (type === 'year') {
          const numbers = params[0].axisValueLabel.match(/\d+/g)
          timeString = moment(timeOther + '-' + numbers).format('YYYY-MM')
        } else {
          timeString = params[0].axisValueLabel
        }
        // const numbers = params[0].axisValueLabel.match(/\d+/g);
        // const timeString = timeOther + "-" + numbers;
        // const timeString = params[0].axisValueLabel
        let content = `<div style="font-size: pxToRem(14)">${timeString}</div>`
        params.forEach(function (param, index) {
          let time = param.name // 时间
          let value = param.value // 数据值
          let seriesName = param.seriesName // 系列名称
          let iconClass = 'circle' // 默认圆形图标
          let iconColor = '#000' // 默认颜色
          let unit = 'mm'

          // 根据系列名称判断是否为降水量，如果是则使用方形图标和特定颜色
          if (seriesName === '降水量') {
            iconClass = 'square'
            iconColor =
              'linear-gradient( 180deg, #2EFFF5 0%, rgba(46,255,245,0.1) 100%);' // 绿色表示降水量
            unit = 'mm'
            value = Math.round(value)
          } else {
            iconColor = '#0DC985' // 红色表示其他数据
            unit = '℃'
            value = Math.round(value * 10) / 10
          }
          // 构建每个数据点的 tooltip 内容--<div v-if="${timeShow}" style="font-size: 12px; margin-bottom: 10px">${time}</div>
          content += `
                      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
                          <div style="display: flex; align-items: center">`
          if (iconClass == 'square') {
            content += `<div style="display: inline-block; width: 8px; height: 8px; background: ${iconColor};margin-right: 10px;"></div>`
          } else {
            content += `<div style="display: inline-block; width: 6px; height: 6px; background: ${iconColor};border-radius:50%;margin:0 11px 0 1px;"></div>`
          }
          content += `<div style="font-size: pxToRem(14);">${seriesName}</div>
                          </div>
                          <div style="font-size: pxToRem(14);">${value}${unit}</div>
                      </div>
                  `
        })

        return content
      }
    },

    grid: {
      top: 12,
      left: '2%',
      right: '2%',
      bottom: '5%',
      containLabel: true
    },

    xAxis: {
      type: 'category',
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: 'rgba(239, 247, 253, .1)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: pxToRem(14),
        color: '#ffffff',
        // margin: 20,
        // rotate: xData.length > 7 ? 45 : 0
        interval: type === 'custom' ? (xData.length < 10 ? 0 : 2) : 1,
        formatter: function (value) {
          if (type === 'year') {
            return value
          } else {
            // 提取日期中的日部分
            const date = new Date(value)
            return date.getDate()
          }
        }
      }
      // min: 0,
      // max: Math.ceil(Math.max.apply(null, xData) / 5) * 5,
    },

    yAxis: [
      {
        type: 'value',
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
            color: 'rgba(239, 247, 253, .1)'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(239, 247, 253, .1)',
            type: 'dashed'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: pxToRem(14),
          color: '#FFFFFF',
          width: 80,
          overflow: 'truncate',
          ellipsis: '...'
        }
        // min: 0,
        // max: Math.ceil(Math.max.apply(null, yData) / 5) * 5,
        // interval: Math.ceil(Math.max.apply(null, yData) / 5),
      },
      {
        // show: !allTemperaturesZero,
        type: 'value',
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
            color: 'rgba(239, 247, 253, .1)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(239, 247, 253, .1)',
            type: 'dashed'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: pxToRem(14),
          color: '#FFFFFF',
          // width: 80,
          overflow: 'truncate',
          ellipsis: '...'
        }
      }
    ],

    series: [
      {
        name: '降水量',
        type: 'custom',
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)])
          return {
            type: 'group',
            // x: -20,
            children: [
              {
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(46, 255, 245, 0.512)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(46, 255, 245, 0.08)'
                    }
                  ]),
                  stroke: 'rgba(3, 25, 63, .1)' //边框颜色
                }
              },
              {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(46, 255, 245, 0.7)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(46, 255, 245, 0.25)'
                    }
                  ]),
                  stroke: 'rgba(3, 25, 63, .1)' //边框颜色
                }
              },
              {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(46, 255, 245, 0.1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(46, 255, 245, 0.64)'
                    }
                  ]),
                  stroke: 'rgba(3, 25, 63, .1)' //边框颜色
                }
              }
            ]
          }
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
          }
        }
      },
      {
        name: '温度',
        type: 'line',
        showSymbol: true,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        yAxisIndex: 1,
        emphasis: {
          itemStyle: {
            // 鼠标悬停时的数据点样式
            color: '#ffffff', // 内部颜色（实心）
            borderColor: '#0DC985', // 边框颜色（模拟空心效果）
            borderWidth: 2, // 边框宽度（模拟空心效果）
            // 由于 borderWidth 会增加整体大小，我们需要减小 radius 来保持整体大小一致
            // 但由于 ECharts 不支持直接设置空心圆，这里只是模拟效果
            // 真正的空心圆需要额外的图形处理
            radius: 5 // 减小半径以模拟边框的效果
          }
        },
        itemStyle: {
          color: '#0DC985'
        },
        lineStyle: {
          width: 2
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(13, 201, 133, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(13, 201, 133, 0)'
              }
            ])
          }
        },
        data: yData2
      }
    ]
  }
}
