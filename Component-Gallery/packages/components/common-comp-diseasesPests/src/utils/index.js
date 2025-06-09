import moment from 'moment'
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

// 病虫害预测折线图
export let insectPestLine = function (param) {
  let { name, levelList, xData, yData, selectIndex, pieces, warningLevel } =
    param
  let markLineData = []
  levelList.forEach((item) => {
    markLineData.push({
      yAxis: item.value,
      name: item.name,
      label: {
        color: '#fff',
        formatter: '{b}',
        fontSize: pxToRem(14)
      },
      lineStyle: {
        width: 0
      }
    })
  })
  return {
    tooltip: {
      show: true,
      borderColor: '#02896D',
      backgroundColor: 'rgba(0, 19, 30, 0.7)',
      textStyle: {
        color: '#fff'
      },
      position: ['40%', '40%'],
      formatter: (params) => {
        let content = `<div>${name}</div>`
        content += `<div>${xData[params.dataIndex]}</div>`
        content += `<div>预测密度：${params.value}只/㎡</div>`
        content += `<div>风险等级：${warningLevel[params.dataIndex]}</div>`
        return content
      }
    },
    xAxis: {
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#fff'
      },
      data: xData.map((item) => moment(item).format('DD'))
    },
    yAxis: [
      {
        type: 'value',
        name: '密度：(只/㎡)',
        nameTextStyle: {
          color: '#fff',
          fontSize: pxToRem(14),
          padding: [0, 0, 0, fontSizeComputed(30)]
        },
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(232, 243, 254, 0.2)'
          }
        }
      },
      {
        type: 'value',
        name: '风险等级',
        nameTextStyle: {
          color: '#fff',
          fontSize: pxToRem(14),
          padding: [0, fontSizeComputed(-45), 0, 0]
        }
      }
    ],
    grid: {
      top: fontSizeComputed(40),
      left: fontSizeComputed(35),
      bottom: fontSizeComputed(35),
      right: fontSizeComputed(55)
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      dimension: 1, // 按数据的索引分段
      seriesIndex: 0, // 对第一个系列进行映射
      pieces: pieces
    },
    series: [
      {
        data: yData,
        type: 'line',
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(238,238,238,0)'
              },
              {
                offset: 1,
                color: 'rgba(214,116,48,0.8)'
              }
            ],
            global: false
          }
        },
        symbolSize: 7,
        markLine: {
          symbol: 'none',
          silent: true,
          data: [
            ...markLineData,
            {
              xAxis: selectIndex,
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
                      color: 'rgba(238,238,238,0)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(255, 255, 255,0.7)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(238,238,238,0)'
                    }
                  ],
                  global: false
                },
                // 指示器样式
                width: 2, // 线宽
                type: 'solid' // 实线
              },
              label: {
                show: false
              }
            }
          ]
        }
      }
    ]
  }
}
