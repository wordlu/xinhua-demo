<template>
  <div
    :id="isId"
    :style="
      `width:${width}px;height:${height}px;zoom:${zoom};transform:scale(${1 /
        zoom});transform-origin:0 0`
    "
  ></div>
</template>

<script>
import * as echarts from 'echarts'
import html2canvas from 'html2canvas'
export default {
  props: {
    isId: {
      type: String,
      default: () => ''
    },
    curveType: {
      type: String,
      default: () => ''
    },
    width: {
      type: Number,
      default: () => 0
    },
    height: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      zoom: 1
    }
  },
  mounted() {
    this.zoom = 1 / document.body.style.zoom
    window.addEventListener('resize', () => {
      this.zoom = 1 / document.body.style.zoom
    })
  },
  methods: {
    desHander() {
      const myChart = echarts.init(document.getElementById(this.isId))
      myChart.dispose()
    },
    clearHander() {
      const myChart = echarts.init(document.getElementById(this.isId))
      myChart.clear()
    },
    init(data) {
      const {
        optionTitle,
        topGrid,
        leftGrid,
        rightGrid,
        legendShowTop,
        lineList,
        line2List,
        lineListName,
        seriesSmooth,
        scatterList,
        scatterListName,
        boxplotList,
        boxplotListName,
        bottomGrid,
        legendShow,
        legendShowType,
        legendShowBottom,
        endValue,
        xAxisType,
        boundaryGap,
        xAxisSplitLineShow,
        xAxisSplitLineShowlineStyle,
        xAxisAxisLineShow,
        xAxisAxisLineShowlineStyle,
        xAxisAxisLabelColor,
        xAxis,
        xAxisName,
        yAxisType,
        yAxisName,
        yAxisMax,
        yAxisMin,
        xAxisInterval,
        yAxisSplitLineShow,
        yAxisSplitLineShowlineStyle,
        yAxisAxisLineShowlineStyle,
        yAxisAxisLabelColor,
        yAxisAxisLineShow,
        dataset, // 盒图数据
        scatterBoxList, // 盒图上散点数据
        scatterTooltipTriggr, // 散点悬浮信息类型
        handleScatterFormatter, // 散点悬浮信息 formatter处理函数
        scatterBoxTooltipTriggr, // 盒图上散点悬浮信息类型
        handleScatterBoxFormatter, // 盒图上散点 悬浮信息 处理函数
        itemStyleColor, // 样式处理函数 比如根据不同情况 设置散点color
        scatterSumList, // 参照线上的散点集合
        scatterSumListName,
        scatterBoxListName,
        handleSumListFormatter, // 参照线上的散点散点 悬浮信息 处理函数
        scatterReferList, // 参照线数据
        handleFormatter, // option.tooltip.formatter方法
        scatterSymbol, // 散点类型 自定义方法
        lineStyle, // 曲线样式方式 虚实线
        brush
      } = data.configuration
      if (!document.getElementById(this.isId)) return
      this.desHander()
      const myChart = echarts.init(document.getElementById(this.isId))
      const series = []
      if (lineList) {
        for (let i = 0; i < lineList.length; i++) {
          let item = {
            name: lineListName[i],
            type: 'line',
            smooth: seriesSmooth,
            symbol: 'circle' /* 默认是空心圆（中间是白色的），改成实心圆 */,
            symbolSize: 0,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: 'top',
                  textStyle: {
                    color: 'white'
                  }
                }
              }
            },
            data: lineList[i]
          }
          // 如果传入折线样式方法，适用于折线区分 虚线与实线的情况
          if (lineStyle) {
            item.lineStyle = lineStyle(lineList[i])
          }
          series.push(item)
        }
      }
      if (scatterList) {
        for (let i = 0; i < scatterList.length; i++) {
          const item = {
            name: scatterListName[i],
            type: 'scatter',
            tooltip: {
              show: true,
              trigger: scatterTooltipTriggr || 'item'
            }, // trigger 如果需要单独显示散点信息，可以用item，然后通过 传入 formatter方法，自定义格式；或者trigger为axis，可在option的tooltip自定义悬浮信息(可折线与散点一起自定义内容)
            itemStyle: {},
            data: scatterList[i],
            symbolSize: 8
          }
          if (handleScatterFormatter) {
            item.tooltip.formatter = params => handleScatterFormatter(params)
          }
          if (itemStyleColor) {
            item.itemStyle.color = params => itemStyleColor(params)
          }
          if (scatterSymbol) {
            // circle 实心圆  rect 实心方 roundRect 圆方型  triangle 三角形 diamond 菱形 pin气球状 arrow三角箭头
            item.symbol = params => scatterSymbol(params)
          }
          series.push(item)
        }
      }
      if (line2List) {
        for (let i = 0; i < line2List.length; i++) {
          let item = {
            name: lineListName[i] + '重新计算后曲线',
            type: 'line',
            smooth: false,
            symbol: 'circle' /* 默认是空心圆（中间是白色的），改成实心圆 */,
            symbolSize: 0,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: 'top',
                  textStyle: {
                    color: 'white'
                  }
                },
                lineStyle: {
                  width: 2,
                  type: 'dotted'
                }
              }
            },
            data: line2List[i]
          }
          series.push(item)
        }
      }
      // 盒图
      if (boxplotList) {
        series.push({
          name: boxplotListName,
          type: 'boxplot'
        })
      }
      // 盒图上的散点
      if (scatterBoxList) {
        for (let i = 0; i < scatterBoxList.length; i++) {
          let item = {
            name: scatterBoxListName[i],
            type: 'scatter',
            symbolSize: 8,
            itemStyle: {},
            tooltip: {
              show: true,
              trigger: scatterBoxTooltipTriggr || 'item'
            },
            z: 5,
            data: scatterBoxList[i]
          }
          if (handleScatterBoxFormatter) {
            item.tooltip.formatter = params => handleScatterBoxFormatter(params)
          }
          if (itemStyleColor) {
            item.itemStyle.color = params => itemStyleColor(params)
          }
          series.push(item)
        }
      }
      // 参照线的散点
      if (scatterSumList) {
        for (let i = 0; i < scatterSumList.length; i++) {
          let item = {
            name: scatterSumListName[i],
            type: 'scatter',
            data: scatterSumList[i],
            tooltip: {
              show: true,
              trigger: 'item'
            },
            z: 5,
            symbolSize: 5
          }
          if (handleSumListFormatter) {
            item.tooltip.formatter = params => handleSumListFormatter(params)
          }
          series.push(item)
        }
      }
      // 参照线
      if (scatterReferList) {
        series.push(...scatterReferList)
      }
      let option = {
        backgroundColor: '#FFF',
        dataset: dataset,
        title: {
          text: optionTitle,
          left: 'center',
          bottom: '2%',
          textStyle: {
            fontSize: 10,
            color: '#454c5c',
            align: 'center'
          }
        },
        grid: {
          top: topGrid || '10%',
          left: leftGrid || '10%',
          right: rightGrid || '10%',
          bottom: bottomGrid || '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          },
          enterable: true,
          confine: true // 悬浮信息不被遮挡
        },
        brush: brush,
        legend: {
          show: legendShow,
          type: legendShowType,
          bottom: legendShowBottom,
          top: legendShowTop,
          itemWidth: 16,
          itemHeight: 10,
          icon: 'roundRect',
          textStyle: {
            color: '#000'
          }
        },
        dataZoom: [
          {
            show: false /* 是否显示滑动条，不影响使用 */,
            type: 'slider' /* 这个 dataZoom 组件是 slider 型 dataZoom 组件 */,
            startValue: 0 /* 从头开始 */,
            endValue: endValue /* 一次性展示6个 */
          }
        ],
        xAxis: [
          {
            type: xAxisType,
            name: xAxisName,
            boundaryGap: boundaryGap,
            splitLine: {
              show: xAxisSplitLineShow,
              lineStyle: {
                color: xAxisSplitLineShowlineStyle
              }
            },
            axisLine: {
              show: xAxisAxisLineShow,
              lineStyle: {
                color: xAxisAxisLineShowlineStyle
              }
            },
            axisLabel: {
              showMaxLabel: true, // 是否显示最大 tick 的 label。可取值 true, false, null。默认自动判定（即如果标签重叠，不会显示最大 tick 的 label）
              interval: xAxisInterval,
              textStyle: {
                color: xAxisAxisLabelColor
              }
            },
            axisTick: { show: false },
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: yAxisType,
            name: yAxisName,
            splitLine: {
              show: yAxisSplitLineShow,
              lineStyle: {
                color: yAxisSplitLineShowlineStyle
              }
            },
            axisLine: {
              show: yAxisAxisLineShow,
              lineStyle: {
                color: yAxisAxisLineShowlineStyle
              }
            },
            axisLabel: {
              textStyle: {
                color: yAxisAxisLabelColor
              }
            },
            axisTick: { show: false },
            max: yAxisMax,
            min: yAxisMin
          }
        ],
        series: series
      }
      // 如果传入option.tooltip.formatter方法
      if (handleFormatter) {
        option.tooltip.formatter = params => handleFormatter(params)
      }
      setTimeout(() => {
        myChart.setOption(option, true)
      }, 0)

      myChart.off('click')
      myChart.off('brushSelected')
      // 隐藏动画加载效果
      myChart.hideLoading()
      // 散点点击事件
      myChart.on('click', params => {
        if (params.componentSubType === 'scatter') {
          this.$emit('onscatter', params.data)
        }
      })
      // data 为数据集合格式如下
      myChart.on('brushSelected', params => {
        let brushComponent = params.batch[0]
        this.$emit('onbrushSelected', brushComponent)
      })
      // 图例点击事件
      myChart.on('legendselectchanged', params => {
        setTimeout(() => {
          myChart.setOption(option)
        }, 2000)
      })
      document.oncontextmenu = function() {
        return false
      }
      /* 自适应屏幕大小 */
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    download() {
      let title = this.$route.meta.title
      html2canvas(document.getElementById(this.isId), {
        dpi: 300,
        scrollX: 0,
        scrollY: 0,
        allowTaint: true,
        useCORS: true,
        backgroundColor: null
      }).then(function(canvas) {
        let img = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        // 创建a标签，实现下载
        let creatIMg = document.createElement('a')
        creatIMg.download = `${title}.png` // 设置下载的文件名，
        creatIMg.href = img // 下载url
        document.body.appendChild(creatIMg)
        creatIMg.click()
        creatIMg.remove() // 下载之后把创建的元素删除
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Echart {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
