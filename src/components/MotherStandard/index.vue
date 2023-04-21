<template>
  <div class="curveDialog">
    <el-dialog
      title="触发删除/恢复点功能开关"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="96%"
      :before-close="handleClose"
    >
      <div class="buttonList">
        <el-dropdown vtrigger="click">
          <el-button
            >{{ dropdownLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in dropdownList"
              :key="index"
              @click.native="onDropdown(item.label, item.max, item.min)"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="deletingRestoring">删除/恢复</el-button>
        <el-button type="primary" @click="scatterReset">散点重置</el-button>
        <el-button type="primary" @click="recalculate">重新计算</el-button>
      </div>
      <div class="contentDetails">
        <div v-loading="hideScatterEchart" :style="{ height: echartHeight + 'px', margin: 'auto' }">
          <ScatterEchart
            v-if="IsScatterEchart"
            ref="ScatterEchartRef"
            :is-id="'scatter'"
            :curve-type="'曲线拟合'"
            :width="echartWidth"
            :height="echartHeight"
            @onscatter="isScatter"
            @onbrushSelected="onBrushSelected"
          ></ScatterEchart>
        </div>
        <div class="DetailsParticulars">
          <div v-for="(item, index) of echartsData" :key="index" class="DetailsEcharts">
            <div
              v-for="(items, indexs) in item.lineList"
              :key="indexs"
              class="DetailsParticularscenter"
            >
              <div :style="`width:${specificWidth}px;height:${specificHeight}px;`">
                <div
                  ref="specific"
                  :style="
                    `width:${specificWidth}px;height:${specificHeight}px;zoom:${zoom};transform:scale(${1 /
                      zoom});transform-origin:0 0`
                  "
                  class="specificEchart"
                ></div>
              </div>

              <div :key="pitchSates" class="contentDetailsR">
                <div class="title">已手动删除样本点列表，如下</div>
                <BaseTable
                  :columns="deleteTableColumn"
                  :data-source="deleteTableData[indexs]"
                ></BaseTable>
              </div>
              <div class="contentDetailsR">
                <div class="title">图中已选中样本点列表，如下</div>
                <BaseTable
                  :columns="pitchTableColumn"
                  :data-source="pitchTableData[indexs]"
                ></BaseTable>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import BaseTable from '@components/BaseTable'
import * as service from '@api/curvefitting'
import cloneDeep from 'lodash/cloneDeep'
import {
  isYes,
  isYellow,
  isGrayness,
  isOrange,
  isBlue,
  isGreen,
  calStatusOne,
  calStatusTwo,
  calStatusThree,
  calStatusFour,
  calStatusFive,
  dropdownList
} from '@utils/message'
export default {
  name: 'MotherDiagram',
  components: {
    ScatterEchart,
    BaseTable
  },
  props: {
    echartsData: {
      type: Object,
      default: () => {}
    },
    batchNo: {
      type: String,
      default: () => ''
    },
    ruleForm: {
      type: Object,
      default: () => {}
    },
    shuttleEnclosure: {
      type: Array,
      default: () => []
    },
    curveObject: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      deleteTableData: [],
      deleteTableColumn: [
        {
          label: '序号',
          align: 'center',
          width: 50,
          render: (h, record) => {
            return h('span', record.$index + 1)
          }
        },
        {
          label: '交易日期',
          prop: 'tradeDt',
          align: 'center',
          width: 100
        },
        {
          label: '交易代码',
          prop: 'tradeCode',
          align: 'center'
        },
        {
          label: '债券简称',
          prop: 'bndAbbrNm',
          align: 'center'
        },
        {
          label: '成交收益率(%)',
          prop: 'txTield',
          align: 'center'
        },
        {
          label: '成交类型',
          prop: 'txType',
          align: 'center'
        },
        {
          label: '（含权）剩余期限',
          prop: 'remainPeriod',
          align: 'center'
        },
        {
          label: '操作',
          fix: 'right',
          width: '80',
          align: 'center',
          actions: [
            {
              text: '选中该点',
              onClick: item => {
                this.deleteTableItem(item)
              }
            }
          ]
        }
      ],
      pitchTableData: [],
      pitchTableColumn: [
        {
          label: '序号',
          align: 'center',
          width: 50,
          render: (h, record) => {
            return h('span', record.$index + 1)
          }
        },
        {
          label: '交易日期',
          prop: 'tradeDt',
          align: 'center',
          width: 100
        },
        {
          label: '交易代码',
          prop: 'tradeCode',
          align: 'center'
        },
        {
          label: '债券简称',
          prop: 'bndAbbrNm',
          align: 'center'
        },
        {
          label: '成交收益率(%)',
          prop: 'txTield',
          align: 'center'
        },
        {
          label: '成交类型',
          prop: 'txType',
          align: 'center'
        },
        {
          label: '（含权）剩余期限',
          prop: 'remainPeriod',
          align: 'center'
        },
        {
          label: '操作',
          fix: 'right',
          width: '80',
          align: 'center',
          actions: [
            {
              text: '取消选中',
              onClick: item => {
                this.pitchTableItem(item)
              }
            }
          ]
        }
      ],
      Intermediate: [],
      IntermediData: [],
      pitchSates: 0,
      configuration: {},
      echartsDataList: {},
      echartsDataconfig: {},
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1780,
      echartOriginalHeight: 550,
      dropdownLabel: '原始比例',
      dropdownList,
      hideScatterEchart: false,
      IsScatterEchart: false,
      result: '',
      specificWidth: 650,
      specificHeight: 350,
      zoom: 1
    }
  },
  watch: {
    echartsData: {
      handler(newName, oldName) {
        this.hideScatterEchart = true
        this.IsScatterEchart = true
        this.echartWidth = this.echartOriginalWidth
        this.echartHeight = this.echartOriginalHeight
        let brush = {
          toolbox: ['rect', 'clear'],
          xAxisIndex: 0,
          throttleType: 'debounce', // 开启选中延迟后调用回调延迟
          throttleDelay: 600 // 选中延迟后调用回调延迟时间
        }
        let newData = {}
        newData.configuration = { ...newName.configuration, brush }
        this.echartsDataconfig = newData
        this.$nextTick(() => {
          this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
          this.initEcharts(this.echartsDataconfig, this.batchNo !== '' ? '' : '实线', '默认')
          this.echartsDataList = cloneDeep(this.echartsDataconfig)
        })
        this.hideScatterEchart = false
      },
      deep: true
    }
  },
  mounted() {
    this.zoom = 1 / document.body.style.zoom
    window.addEventListener('resize', () => {
      this.zoom = 1 / document.body.style.zoom
    })
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    showhandleClose() {
      this.dialogVisible = true
    },
    initEcharts(data, val, title) {
      this.$nextTick(() => {
        let myEchart = document.getElementsByClassName('specificEchart')
        const {
          xAxisName,
          yAxisName,
          lineList,
          line2List,
          lineListName,
          seriesSmooth,
          scatterList,
          scatterListName,
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
          yAxisType,
          yAxisMax,
          yAxisMin,
          yAxisSplitLineShow,
          yAxisSplitLineShowlineStyle,
          yAxisAxisLineShowlineStyle,
          yAxisAxisLabelColor
        } = data.configuration
        let arr = []
        let arr1 = []
        for (let i = 0; i < myEchart.length; i++) {
          if (val === '实线' && scatterList && this.result === '') {
            Promise.all([this.scatter(scatterList[i])]).then(result => {
              arr.push(result[0])
              arr1.push([])
            })
          }
          let myChart = echarts.init(myEchart[i])
          if (title === '默认' && scatterList) {
            scatterList[i].forEach(element => {
              element[14] = '0'
            })
          }
          let option = {
            backgroundColor: '#FFF',
            title: {
              text:
                '◆灰色菱形点：手动删除的点、▲橙色三角形点：本曲线异常值点、■蓝色方形点：虚拟样本点、●绿色圆形点：其余真实成交点',
              left: 'center',
              bottom: '3%',
              textStyle: {
                fontSize: 10,
                color: '#454c5c',
                align: 'center'
              }
            },
            grid: {
              top: '10%',
              left: '5%',
              right: '18%',
              bottom: '15%',
              containLabel: true
            },

            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              triggerOn: 'mousemove',
              confine: true,
              formatter: function(param) {
                let str = ''
                param.map(item => {
                  const { data, componentSubType, color } = item
                  if (componentSubType === 'line') {
                    if (data[4] !== undefined || data[6] !== undefined) {
                      str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/日期:${data[4]}/收益率:${data[6]}<span><br>`
                    } else {
                      str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>暂无数据<span><br>`
                    }
                  } else if (componentSubType === 'scatter') {
                    str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
                    <span>债券简称:${data[4]}/债券代码:${data[2]}/所属曲线:${data[6]}</span><br>
                    <span>成交日期:${data[5]}/收益率:${data[13]}<span><br>`
                  }
                })
                return `(含权)剩余期限: ` + param[0].axisValue + `(年)` + `<br>` + str
              }
            },
            legend: {
              show: legendShow,
              type: legendShowType,
              bottom: legendShowBottom,
              itemWidth: 16,
              itemHeight: 10,
              icon: 'roundRect',
              textStyle: {
                color: '#000'
              }
            },
            dataZoom: [
              {
                show: false,
                type: 'slider',
                startValue: 0,
                endValue: endValue
              }
            ],
            brush: {
              toolbox: ['rect', 'clear'],
              xAxisIndex: 0,
              throttleType: 'debounce', // 开启选中延迟后调用回调延迟
              throttleDelay: 600 // 选中延迟后调用回调延迟时间
            },
            xAxis: [
              {
                name: xAxisName,
                type: xAxisType,
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
                name: yAxisName,
                type: yAxisType,
                splitLine: {
                  show: yAxisSplitLineShow,
                  lineStyle: {
                    color: yAxisSplitLineShowlineStyle
                  }
                },
                axisLine: {
                  show: yAxisSplitLineShow,
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
            series: [
              {
                name: lineListName[i],
                type: 'line',
                smooth: seriesSmooth,
                symbol: 'circle',
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
              },
              {
                name: scatterList ? scatterListName[i] : '',
                type: 'scatter',
                symbol: function(params) {
                  if (params[11] === isYes) {
                    return 'diamond'
                  } else if (params[10] === isYes) {
                    return 'triangle'
                  } else if (params[12] === isYes) {
                    return 'rect'
                  } else {
                    return 'circle'
                  }
                },
                data: scatterList ? scatterList[i] : [],
                symbolSize: 7,
                itemStyle: {
                  color: function(params) {
                    if (params.data[14] === '1') {
                      return isYellow
                    } else if (params.data[11] === isYes) {
                      return isGrayness
                    } else if (params.data[10] === isYes) {
                      return isOrange
                    } else if (params.data[12] === isYes) {
                      return isBlue
                    } else {
                      return isGreen
                    }
                  }
                }
              },
              {
                name: line2List ? lineListName[i] + '重新计算后曲线' : '',
                type: 'line',
                smooth: false,
                symbol: 'circle',
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
                data: line2List ? line2List[i] : []
              }
            ]
          }
          myChart.clear()
          myChart.setOption(option)
          myChart.off('click')
          myChart.off('brushSelected')
          document.oncontextmenu = function() {
            return false
          }
          // 隐藏动画加载效果
          myChart.hideLoading()
          myChart.on('click', params => {
            if (params.componentSubType === 'scatter') {
              this.onscatter(params.data)
            }
          })
          myChart.on('brushSelected', params => {
            let brushComponent = params.batch[0]
            let isDataIndex = []
            let isSeriesName = ''
            let pitchTable = []
            brushComponent.selected.forEach(element => {
              const { dataIndex, seriesName } = element
              if (dataIndex && dataIndex.length !== 0) {
                isDataIndex = dataIndex
                isSeriesName = seriesName
              }
            })
            let index = scatterListName.findIndex(item => item === isSeriesName)
            if (isDataIndex && isDataIndex.length > 0) {
              let arr = this.echartsDataconfig.configuration.scatterList[index]
              isDataIndex.forEach(element => {
                pitchTable.push({
                  tradeDt: arr[element][5],
                  tradeCode: arr[element][3],
                  bndAbbrNm: arr[element][4],
                  txTield: arr[element][13],
                  txType: arr[element][9],
                  remainPeriod: arr[element][0],
                  name: arr[element][6]
                })
              })
            }
            this.pitchTableData[index] = this.removeDp(pitchTable, this.pitchTableData[index] || [])
            if (this.echartsDataconfig.configuration.scatterList[index] !== undefined) {
              this.findObject(
                pitchTable,
                this.echartsDataconfig.configuration.scatterList[index],
                index
              )
            }
            this.pitchSates++
          })
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        }
        if (val === '实线') {
          this.deleteTableData = arr
          this.pitchTableData = arr1
          this.Intermediate = cloneDeep(arr)
          this.IntermediData = cloneDeep(arr1)
        }
      })
    },
    pitchEcharts(data, val, title, index) {
      this.$nextTick(() => {
        let myEchart = document.getElementsByClassName('specificEchart')
        const {
          yAxisName,
          xAxisName,
          lineList,
          line2List,
          lineListName,
          seriesSmooth,
          scatterList,
          scatterListName,
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
          yAxisMax,
          yAxisMin,
          yAxisType,
          yAxisSplitLineShow,
          yAxisSplitLineShowlineStyle,
          yAxisAxisLineShowlineStyle,
          yAxisAxisLabelColor
        } = data.configuration
        let arr = []
        let arr1 = []
        for (let i = 0; i < myEchart.length; i++) {
          if (val === '实线') {
            Promise.all([this.scatter(scatterList[i])]).then(result => {
              arr.push(result[0])
              arr1.push([])
            })
          }
          let myChart = echarts.init(myEchart[index])
          if (title === '默认') {
            if (scatterList) {
              scatterList[i].forEach(element => {
                element[14] = '0'
              })
            }
          }
          let option = {
            backgroundColor: '#FFF',
            title: {
              text:
                '◆灰色菱形点：手动删除的点、▲橙色三角形点：本曲线异常值点、■蓝色方形点：虚拟样本点、●绿色圆形点：其余真实成交点',
              left: 'center',
              bottom: '3%',
              textStyle: {
                fontSize: 10,
                color: '#454c5c',
                align: 'center'
              }
            },
            grid: {
              top: '10%',
              left: '5%',
              right: '18%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: legendShow,
              type: legendShowType,
              bottom: legendShowBottom,
              itemWidth: 16,
              itemHeight: 10,
              icon: 'roundRect',
              textStyle: {
                color: '#000'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              triggerOn: 'mousemove',
              confine: true,
              formatter: function(param) {
                let str = ''
                param.map(item => {
                  const { data, componentSubType, color } = item
                  if (componentSubType === 'line') {
                    if (data[4] !== undefined || data[6] !== undefined) {
                      str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/日期:${data[4]}/收益率:${data[6]}<span><br>`
                    } else {
                      str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>暂无数据<span><br>`
                    }
                  } else if (componentSubType === 'scatter') {
                    str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
                    <span>债券简称:${data[4]}/债券代码:${data[2]}/所属曲线:${data[6]}</span><br>
                    <span>成交日期:${data[5]}/收益率:${data[13]}<span><br>`
                  }
                })
                return `(含权)剩余期限: ` + param[0].axisValue + `(年)` + `<br>` + str
              }
            },
            dataZoom: [
              {
                show: false,
                type: 'slider',
                startValue: 0,
                endValue: endValue
              }
            ],
            brush: {
              toolbox: ['rect', 'clear'],
              xAxisIndex: 0,
              throttleType: 'debounce', // 开启选中延迟后调用回调延迟
              throttleDelay: 600 // 选中延迟后调用回调延迟时间
            },
            xAxis: [
              {
                name: xAxisName,
                type: xAxisType,
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
                name: yAxisName,
                type: yAxisType,
                splitLine: {
                  show: yAxisSplitLineShow,
                  lineStyle: {
                    color: yAxisSplitLineShowlineStyle
                  }
                },
                axisLine: {
                  show: yAxisSplitLineShow,
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
            series: [
              {
                name: lineListName[index],
                type: 'line',
                smooth: seriesSmooth,
                symbol: 'circle',
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
                data: lineList[index]
              },
              {
                name: scatterList ? scatterListName[index] : '',
                type: 'scatter',
                symbol: function(params) {
                  if (params[11] === isYes) {
                    return 'diamond'
                  } else if (params[10] === isYes) {
                    return 'triangle'
                  } else if (params[12] === isYes) {
                    return 'rect'
                  } else {
                    return 'circle'
                  }
                },
                data: scatterList ? scatterList[index] : [],
                symbolSize: 7,
                itemStyle: {
                  color: function(params) {
                    if (params.data[14] === '1') {
                      return isYellow
                    } else if (params.data[11] === isYes) {
                      return isGrayness
                    } else if (params.data[10] === isYes) {
                      return isOrange
                    } else if (params.data[12] === isYes) {
                      return isBlue
                    } else {
                      return isGreen
                    }
                  }
                }
              },
              {
                name: line2List ? lineListName[index] + '重新计算后曲线' : '',
                type: 'line',
                smooth: false,
                symbol: 'circle',
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
                data: line2List ? line2List[index] : []
              }
            ]
          }
          myChart.clear()
          myChart.setOption(option)
          myChart.off('click')
          myChart.off('brushSelected')
          document.oncontextmenu = function() {
            return false
          }
          // 隐藏动画加载效果
          myChart.hideLoading()
          myChart.on('click', params => {
            if (params.componentSubType === 'scatter') {
              this.onscatter(params.data)
            }
          })
          myChart.on('brushSelected', params => {
            let brushComponent = params.batch[0]
            let isDataIndex = []
            let isSeriesName = ''
            let pitchTable = []
            brushComponent.selected.forEach(element => {
              const { dataIndex, seriesName } = element
              if (dataIndex && dataIndex.length !== 0) {
                isDataIndex = dataIndex
                isSeriesName = seriesName
              }
            })
            let index = scatterListName.findIndex(item => item === isSeriesName)
            if (isDataIndex.length > 0) {
              let arr = this.echartsDataconfig.configuration.scatterList[index]
              isDataIndex.forEach(element => {
                pitchTable.push({
                  tradeDt: arr[element][5],
                  tradeCode: arr[element][3],
                  bndAbbrNm: arr[element][4],
                  txTield: arr[element][13],
                  txType: arr[element][9],
                  remainPeriod: arr[element][0],
                  name: arr[element][6]
                })
              })
            }
            this.pitchTableData[index] = this.removeDp(pitchTable, this.pitchTableData[index] || [])
            if (this.echartsDataconfig.configuration.scatterList[index] !== undefined) {
              this.findObject(
                pitchTable,
                this.echartsDataconfig.configuration.scatterList[index],
                index
              )
            }
            this.pitchSates++
          })
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        }
        if (val === '实线') {
          this.deleteTableData = arr
          this.pitchTableData = arr1
          this.Intermediate = cloneDeep(arr)
          this.IntermediData = cloneDeep(arr1)
        }
      })
    },
    scatter(val) {
      return new Promise((resolve, reject) => {
        const data = {
          pageType: '1',
          curveVOs: [
            {
              curveName: val[0][6],
              curveId: val[0][7],
              curveType: '0',
              queryDate: this.$parent.ruleForm.queryDate
            }
          ],
          isManualDelete: '1',
          pageNum: '1',
          pageSize: '60000'
        }
        service.perScatterQuery(data).then(res => {
          if (res) {
            const { list } = res.data
            resolve(list)
          }
        })
      })
    },
    onscatter(val) {
      const arr = []
      arr.push({
        tradeDt: val[5],
        tradeCode: val[3],
        bndAbbrNm: val[4],
        txTield: val[13],
        txType: val[9],
        remainPeriod: val[0],
        name: val[6]
      })
      const index = this.acquire(val)
      this.pitchTableData[index] = this.removeDp(arr, this.pitchTableData[index] || [])
      this.findObjectIndex(val[3], this.echartsDataconfig.configuration.scatterList[index], index)
      this.pitchSates++
    },
    isScatter(val) {
      const arr = []
      arr.push({
        tradeDt: val[5],
        tradeCode: val[3],
        bndAbbrNm: val[4],
        txTield: val[13],
        txType: val[9],
        remainPeriod: val[0],
        name: val[6]
      })
      const index = this.acquire(val)
      this.pitchTableData[index] = this.removeDp(arr, this.pitchTableData[index] || [])
      this.findObjectIndex(val[3], this.echartsDataconfig.configuration.scatterList[index], index)
      this.pitchSates++
    },
    onBrushSelected(params) {
      for (let i = 0; i < params.selected.length; i++) {
        let dataIndex = []
        let pitchTable = []
        let seriesName = ''
        let { scatterListName } = this.echartsDataconfig.configuration
        if (params.selected[i].dataIndex.length !== 0) {
          dataIndex = params.selected[i].dataIndex
          seriesName = params.selected[i].seriesName
        }
        let index = scatterListName.findIndex(item => item === seriesName)
        if (dataIndex.length > 0) {
          let arr = this.echartsDataconfig.configuration.scatterList[index]
          dataIndex.forEach(element => {
            pitchTable.push({
              tradeDt: arr[element][5],
              tradeCode: arr[element][3],
              bndAbbrNm: arr[element][4],
              txTield: arr[element][13],
              txType: arr[element][9],
              remainPeriod: arr[element][0],
              name: arr[element][6]
            })
          })
        }
        this.pitchTableData[index] = this.removeDp(pitchTable, this.pitchTableData[index] || [])
        if (this.echartsDataconfig.configuration.scatterList[index] !== undefined) {
          this.findObject(
            pitchTable,
            this.echartsDataconfig.configuration.scatterList[index],
            index
          )
        }
        this.pitchSates++
      }
    },
    findObjectIndex(id, array2, index) {
      for (let i = 0; i < array2.length; i++) {
        if (array2[i][3] === id) {
          this.echartsDataconfig.configuration.scatterList[index][i][14] = '1'
          this.pitchEcharts(this.echartsDataconfig, '', '点击', index)
        }
      }
      this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
    },
    findObject(arr, array2, index) {
      for (let i = 0; i < array2.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (array2[i][3] === arr[j].tradeCode) {
            this.echartsDataconfig.configuration.scatterList[index][i][14] = '1'
          }
        }
      }
      this.pitchEcharts(this.echartsDataconfig, '', '点击', index)
      this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
    },
    acquire(val) {
      const { lineListName } = this.echartsDataconfig.configuration
      let index = lineListName.findIndex(value => value === val[6])
      return index
    },
    filtration(val) {
      const { lineListName } = this.echartsDataconfig.configuration
      let index = lineListName.findIndex(value => value === val.name)
      return index
    },
    // 过滤
    removeDp(arr1, arr2) {
      let arr = arr1.concat(arr2)
      let obj = {}
      let newArray = arr.reduce((pre, cur) => {
        if (!obj[cur.tradeCode]) {
          obj[cur.tradeCode] = true
          pre.push(cur)
        }
        return pre
      }, [])
      return newArray
    },
    // 取消选中
    pitchTableItem(val) {
      const index = this.filtration(val)
      const { scatterList } = this.echartsDataconfig.configuration
      for (let i = 0; i < scatterList[index].length; i++) {
        if (scatterList[index][i][3] === val.tradeCode) {
          this.echartsDataconfig.configuration.scatterList[index][i][14] = '0'
          this.pitchEcharts(this.echartsDataconfig, '', '取消', index)
        }
      }
      // 使用过滤器筛选出tradeDt不等于要删除的数据的所有对象，并将其重新赋值给list数组
      for (let i = 0; i < this.pitchTableData.length; i++) {
        this.pitchTableData[i] = this.pitchTableData[i].filter(item => {
          return item.tradeCode !== val.tradeCode
        })
      }
      this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
      this.pitchSates++
    },
    deleteTableItem(val) {
      const index = this.filtration(val)
      this.pitchTableData[index] = this.removeDp([val], this.pitchTableData[index] || [])
      this.findObjectIndex(
        val.tradeCode,
        this.echartsDataconfig.configuration.scatterList[index],
        index
      )
      this.pitchSates++
    },
    // 删除与恢复
    deletingRestoring() {
      let bool = this.pitchTableData.every(item => {
        return item.length === 0
      })

      if (bool) {
        this.$confirm('未进行选择散点等操作!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认删除/恢复所选数据点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 拷贝上次删除点位的数据
          let newList = cloneDeep(this.deleteTableData)
          let deleteTableData = []
          let pitchTableData = []
          this.pitchTableData = JSON.parse(JSON.stringify(this.pitchTableData))
          this.deleteTableData = JSON.parse(JSON.stringify(this.deleteTableData))
          for (let i = 0; i < this.pitchTableData.length; i++) {
            if (this.pitchTableData[i] === null) {
              this.pitchTableData[i] = []
            }
          }
          if (this.deleteTableData.length === 0) {
            for (let i = 0; i < this.echartsData.configuration.scatterList.length; i++) {
              this.deleteTableData.push([])
            }
          }
          for (let o = 0; o < this.deleteTableData.length; o++) {
            deleteTableData[o] = this.deleteTableData[o].filter(
              v => this.pitchTableData[o].findIndex(el => el.tradeCode === v.tradeCode) === -1
            )
            pitchTableData[o] = this.pitchTableData[o].filter(
              v => this.deleteTableData[o].findIndex(el => el.tradeCode === v.tradeCode) === -1
            )
            this.deleteTableData[o] = [...deleteTableData[o], ...pitchTableData[o]]
            this.pitchTableData[o] = []
          }
          this.pitchSates++
          const { scatterList } = this.echartsDataconfig.configuration
          for (let i = 0; i < newList.length; i++) {
            if (newList[i].length > 0) {
              let res = newList[i].filter(
                n => !this.deleteTableData[i].map(v => v.tradeCode).includes(n.tradeCode)
              )
              for (let i = 0; i < scatterList.length; i++) {
                for (let o = 0; o < scatterList[i].length; o++) {
                  for (let j = 0; j < res.length; j++) {
                    if (res[j].tradeCode === scatterList[i][o][3]) {
                      this.echartsDataconfig.configuration.scatterList[i][o][14] = '0'
                      this.echartsDataconfig.configuration.scatterList[i][o][11] = '否'
                    }
                  }
                }
              }
            }
            for (let i = 0; i < scatterList.length; i++) {
              for (let o = 0; o < scatterList[i].length; o++) {
                for (let j = 0; j < this.deleteTableData.length; j++) {
                  for (let k = 0; k < this.deleteTableData[j].length; k++) {
                    if (this.deleteTableData[j][k].tradeCode === scatterList[i][o][3]) {
                      this.echartsDataconfig.configuration.scatterList[i][o][14] = '0'
                      if (scatterList[i][o][11] === '否') {
                        this.echartsDataconfig.configuration.scatterList[i][o][11] = '是'
                      }
                    }
                  }
                }
              }
            }
          }
          this.configuration = this.echartsDataconfig
          this.initEcharts(this.echartsDataconfig, '', '默认')
          this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
        })
      }
    },
    scatterReset() {
      this.$confirm('重置后将恢复删点前曲线数据，是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.echartsDataconfig.configuration.scatterList.forEach((element, index) => {
          element.forEach(elementArr => {
            elementArr[11] = '否'
            elementArr[14] = '0'
          })
        })
        this.result = ''
        this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
        this.initEcharts(this.echartsDataconfig, '实线')
      })
    },
    // 重新计算
    recalculate() {
      const arr = []
      for (let i = 0; i < this.deleteTableData.length; i++) {
        this.deleteTableData[i].forEach(element => {
          arr.push(element.tradeCode)
        })
      }
      const data = {
        batchNo: this.curveObject.batchNo,
        deletBndList: arr
      }
      service.perCurveCalc(data).then(res => {
        if (res && res.status === 200) {
          const { calStatus, result } = res.data
          switch (calStatus) {
            case '0':
              this.result = result // 批次号
              this.$message({ message: calStatusOne, type: 'success' })
              this.characterEcharts()
              break
            case '1':
              if (result === '') {
                this.$message({ message: calStatusTwo, type: 'warning' })
              } else {
                this.$message({ message: result, type: 'warning' })
              }
              break
            case '2':
              this.$message({ message: calStatusThree, type: 'warning' })
              break
            case '3':
              this.$message({ message: calStatusFour, type: 'warning' })
              break
            case '4':
              this.$message({ message: calStatusFive, type: 'warning' })
              break
            default:
          }
        }
      })
    },
    characterEcharts() {
      const { queryDate, clusterCd } = this.$parent.ruleForm
      const params = {
        curveVOs: this.$parent.shuttleEnclosure || [],
        clusterCd: clusterCd || '',
        queryDate: queryDate || '',
        exportDataStep: '',
        pageType: '1',
        dottedBatchNo: this.result,
        remoCurveName: 0,
        remoScatt: 0
      }
      service.curveCalcPointLineQuery(params).then(res => {
        if (res.status === 200) {
          const { lineList, lineListName, scatterList, scatterListName, line2List } = res.data
          scatterList[0].forEach(element => {
            element[14] = '0'
          })
          const data = {
            configuration: {
              optionTitle:
                '◆菱形点：手动删除的点、▲三角形点：本曲线异常值点、■方形点：虚拟样本点、●圆形点：其余真实成交点',
              xAxisName: '(含权)剩余期限',
              yAxisName: '收益率/%',
              boundaryGap: true,
              xAxisType: 'value',
              xAxisSplitLineShow: true,
              xAxisSplitLineShowlineStyle: '#fff',
              xAxisAxisLineShow: true,
              xAxisAxisLineShowlineStyle: '#000',
              xAxisAxisLabelColor: '#000',
              yAxisType: 'value',
              yAxisSplitLineShow: true,
              yAxisSplitLineShowlineStyle: '#fff',
              yAxisAxisLineShow: true,
              yAxisAxisLineShowlineStyle: '#000',
              yAxisAxisLabelColor: '#000',
              legendShow: true,
              legendShowType: 'plain',
              scatterListName: scatterListName,
              lineListName: lineListName,
              seriesType: 'line',
              seriesSmooth: true,
              bottomGrid: this.calculate(scatterListName),
              brush: {
                toolbox: ['rect', 'clear'],
                xAxisIndex: 0,
                throttleType: 'debounce', // 开启选中延迟后调用回调延迟
                throttleDelay: 600 // 选中延迟后调用回调延迟时间
              },
              leftGrid: '5%',
              rightGrid: '15%',
              legendShowBottom: '7%',
              topGrid: '10%',
              lineList: lineList,
              scatterList: scatterList,
              scatterTooltipTriggr: 'axis',
              line2List: line2List,
              handleFormatter: this.$parent.handleFormatter,
              scatterSymbol: this.$parent.scatterSymbol
            }
          }
          this.echartsDataconfig = data
          this.$nextTick(() => {
            this.$refs.ScatterEchartRef.init(data)
            this.initEcharts(data, '虚线')
          })
        }
      })
    },
    calculate(val) {
      let arr = val.length * 3
      if (arr <= 10) {
        return '20%'
      } else if (arr <= 20) {
        return '35%'
      } else if (arr <= 30) {
        return '40%'
      }
    },
    confirm() {
      this.$emit('reload', this.result, this.configuration)
      this.dialogVisible = false
    },
    onDropdown(val, max, min) {
      this.IsScatterEchart = false
      this.hideScatterEchart = true
      if (val === '原始比例') {
        this.echartWidth = this.echartOriginalWidth
        this.echartHeight = this.echartOriginalHeight
      } else {
        let mins =
          this.echartOriginalWidth / max > this.echartOriginalHeight / min
            ? this.echartOriginalHeight / min
            : this.echartOriginalWidth / max
        this.echartWidth = mins * max
        this.echartHeight = mins * min
      }
      this.dropdownLabel = val
      this.onEcharts()
    },
    onEcharts() {
      setTimeout(() => {
        this.IsScatterEchart = true
        this.$nextTick(() => {
          this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
        })
        this.hideScatterEchart = false
      }, 2000)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  height: 840px !important;
  margin-top: 5vh !important;
}
::v-deep .el-dialog__body {
  padding: 20px !important;
}
::v-deep .el-dropdown {
  padding-right: 10px;
}
.buttonList {
  position: relative;
  margin-bottom: 20px;
  text-align: right;
}

.contentDetails {
  position: relative;
  width: 100%;
  height: 655px;
  overflow-x: auto;
  .contentDetailsEcharts {
    position: relative;
    width: 100%;
    height: 450px;
  }
  .DetailsParticulars {
    position: relative;
    width: 100%;
    height: 450px;
    .DetailsEcharts {
      position: relative;
      width: 100%;
      height: 350px;
    }
    .DetailsParticularscenter {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      margin: 15px 0;
      .chart {
        position: relative;
        width: 650px;
        height: 100%;
      }
    }
    .DetailsParticularscenter::after {
      position: absolute;
      top: -8px;
      left: 10px;
      width: calc(100% - 20px);
      height: 1px;
      content: '';
      background: #ccc;
    }
  }
  .contentDetailsL {
    width: 50%;
  }

  .contentDetailsR {
    position: relative;
    width: calc((100% - 650px) / 2);

    .title {
      position: relative;
      width: 100%;
      height: 30px;
      padding: 0 10px;
      line-height: 30px;
    }

    .base-table {
      height: 300px !important;
      margin-bottom: 10px;

      ::v-deep .summary {
        height: 300px !important;
      }

      ::v-deep .el-table {
        height: 300px !important;
      }
    }
  }
}
</style>
