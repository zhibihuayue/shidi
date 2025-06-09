function pxToRem(px) {
  return `${px / 100}rem`
}

export function fontSizeComputed(res) {
  const clientHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  if (!clientHeight) return
  let fontSize = clientHeight / 1080
  return res * fontSize
}

// 处理小数位数的方法(只针对于已经保留好两位小数的数据)
export const formattedValue = (value) => {
  if (!value) return 0
  let num = Number(value)
  if (num % 1 == 0) {
    // 如果是整数 直接返回整数部分
    return num.toFixed(0)
  } else if ((num * 10) % 1 == 0) {
    // 如果有一位小数
    return num.toFixed(1)
  } else {
    // 默认保留两位小数
    return num.toFixed(2)
  }
}

// 折线图
export let discountChart = function (leftText, rightText, xData, yData) {
  let maxDataValue = 0
  let maxYear = 0
  let yAxisMaxValue = 0
  if (yData.length > 0) {
    maxDataValue = Math.max(...yData)
    maxYear = Math.max(...xData)
    yAxisMaxValue = Math.ceil((maxDataValue * 1.1) / 100) * 100
  }
  let option = {
    backgroundColor: 'transparent',
    title: [
      {
        text: leftText,
        textStyle: {
          color: 'rgba(255, 255, 255)',
          fontSize: 12,
          fontWeight: 400
        },
        top: '5%',
        left: '0'
      },
      {
        text: rightText,
        textStyle: {
          color: 'rgba(255, 255, 255)',
          fontSize: 12,
          fontWeight: 400,
          rich: {
            square: {
              backgroundColor: '#47FFE6',
              width: 6,
              height: 6
            },
            space: {
              width: 4
            }
          }
        },
        top: '5%',
        right: '0'
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      borderColor: '#02896D',
      backgroundColor: 'rgba(0,19,30,0.7)',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(13, 201, 133, 0)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(13, 201, 133, 0.46)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      },
      textStyle: {
        color: '#fff'
      },
      formatter: function (params) {
        let content = `<div style="fontSize:${fontSizeComputed(14)}px">${
          params[0].name
        }</div>`
        content += `<div style="display:flex;align-items:center">
          <p style="margin-right:${fontSizeComputed(
            8
          )}px;width:${fontSizeComputed(6)}px;height:${fontSizeComputed(
          6
        )}px;border-radius:50px;background:#0DC985"></p>
          <p>斑块面积</p>
          <p style="margin-left:${fontSizeComputed(20)}px">${
          params[0].value
        }</p>
        </div>`
        return content
      }
    },
    grid: {
      top: fontSizeComputed(40),
      left: fontSizeComputed(40),
      right: fontSizeComputed(10),
      bottom: fontSizeComputed(25)
      // containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          // x轴刻度
          show: false
        },
        //axixLine 坐标轴轴线相关设置
        axisLine: {
          lineStyle: {
            // color: "#30CBAB",
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        splitArea: {
          // show: true, // 保留网格区域
          color: '#f00',
          lineStyle: {
            color: '#f00'
          }
        },
        axisLabel: {
          // 坐标轴样式
          color: '#fff',
          fontSize: pxToRem(14)
          // rotate: xData.length > 5 ? 35 : 0
        },
        splitLine: {
          // 去除网格线
          show: false
        },
        // boundaryGap: false,// 默认true 刻度居中显示(这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。)
        data: xData
      }
    ],

    yAxis: [
      {
        type: 'value',
        min: 0,
        max: yAxisMaxValue > 0 ? yAxisMaxValue : undefined,
        splitNumber: 4,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed', // y轴显示虚线
            color: 'rgba(255,255,255,0.1)'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        axisLabel: {
          show: true,
          //   marginRight: 10,
          fontSize: pxToRem(14),
          textStyle: {
            color: 'rgba(255, 255, 255, 1)'
          },
          formatter: (value) => {
            // y轴数据可能过大 所以这里要处理一下
            if (value > 10000) {
              return (value / 10000).toFixed(0) + '万'
            } else {
              return value
            }
          }
        },
        axisTick: {
          // y轴刻度
          show: false
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        markLine: {
          symbol: 'none',
          animation: false,
          silent: true, // 图形是否不影响和触发鼠标事件，默认为false,即响应和触发鼠标点击事件
          data: [
            {
              xAxis: maxYear.toString()
            }
          ],
          label: {
            show: false
          },
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(13, 201, 133, 0)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(13, 201, 133, 0.46)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            // 指示器样式
            width: 1, // 线宽
            type: 'dashed' // 虚线
          }
        },
        // smooth: true, //是否平滑
        showAllSymbol: true,
        symbol: 'circle',
        // symbolSize: 15, // 设置标记的大小，可以是数值，也可以是函数
        lineStyle: {
          color: '#0DC985'
        },
        label: {
          show: false,
          position: 'top',
          textStyle: {
            color: '#00ca95'
          }
        },

        itemStyle: {
          color: '#F9FF6C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(61, 212, 157, 0)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(13, 201, 133, 0.56)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        data: yData
      }
    ]
  }
  return option
}

export const treeTotal = function (listData, position = ['32%', '20%']) {
  const myListData = listData.filter((item) => Number(item.value) !== 0)
  const pieData1 = []
  const sum = myListData.reduce((per, cur) => per + Number(cur.value), 0)
  const gap = (1 * sum) / 100
  const gapData = {
    name: '',
    value: gap,
    itemStyle: {
      color: 'transparent'
    }
  }
  for (let i = 0; i < myListData.length; i++) {
    pieData1.push({ ...myListData[i] })
    pieData1.push(gapData)
  }
  return {
    tooltip: {
      trigger: 'item',
      position: position,
      confine: true, // 饼图的数据标签是否被限制在饼图内部 true表示标签限制在饼图内部 false表示标签可能回超出饼图的边界，显示在饼图外部
      formatter: function (params) {
        if (params.data.value === gap) {
          return ''
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
                `
      },
      padding: [4, 10, 4, 10],
      backgroundColor: 'rgba(0,0,0,.5)',
      textStyle: {
        color: '#fff', // 自定义文字颜色
        fontSize: 12 // 自定义文字大小
      },
      borderColor: '#02896D' // 自定义边框颜色
    },
    series: [
      {
        name: '',
        zlevel: 1,
        type: 'pie',
        radius: ['68%', '73%'],
        center: ['50.2%', '53.5%'],
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          scaleSize: 5,
          label: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: 'rgba(0,0,0,0.1)'
        },
        data: pieData1
      }
    ]
  }
}
