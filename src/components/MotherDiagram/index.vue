<template>
  <div>
    <el-dialog
      title="触发删除/恢复点功能开关"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="80%"
      :before-close="handleClose"
    >
      <div class="contentDetails">
        <div v-loading="hideScatterEchart" class="contentDetailsL">
          <div :style="`height:${echartHeight}px;`">
            <ScatterEchart
              v-if="IsScatterEchart"
              ref="ScatterEchartRef"
              :is-id="'scatterRef'"
              :curve-type="'曲线拟合'"
              :width="echartWidth"
              :height="echartHeight"
              @onscatter="onScatter"
              @onbrushSelected="onBrushSelected"
            >
            </ScatterEchart>
          </div>
        </div>
        <div class="contentDetailsR">
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
          <div class="title">已手动删除样本点列表，如下</div>
          <BaseTable :columns="deleteTableColumn" :data-source="deleteTableData"></BaseTable>
          <div class="title">图中已选中样本点列表，如下</div>
          <BaseTable :columns="pitchTableColumn" :data-source="pitchTableData"></BaseTable>
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
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import BaseTable from '@components/BaseTable'
import cloneDeep from 'lodash/cloneDeep'
import * as service from '@api/curvefitting'
import {
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
          align: 'center',
          width: 130
        },
        {
          label: '成交类型',
          prop: 'txType',
          align: 'center'
        },
        {
          label: '(含权)剩余期限',
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
          align: 'center',
          width: 130
        },
        {
          label: '成交类型',
          prop: 'txType',
          align: 'center'
        },
        {
          label: '(含权)剩余期限',
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
      configuration: {},
      echartsDataconfig: {},
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 750,
      echartOriginalHeight: 500,
      dropdownLabel: '原始比例',
      dropdownList,
      hideScatterEchart: false,
      IsScatterEchart: false
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
          if (this.result === '') {
            this.scatter()
          }
          this.echartsDataList = cloneDeep(this.echartsDataconfig)
        })
        this.hideScatterEchart = false
      },
      deep: true
    },
    dialogVisible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    showhandleClose() {
      this.dialogVisible = true
    },
    // 散点图数据
    scatter() {
      const { rateOrInterMargin, risklessInterRates } = this.ruleForm
      const data = {
        pageType: '1',
        curveVOs: this.shuttleEnclosure,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        isManualDelete: '1',
        pageNum: '1',
        pageSize: '60000'
      }
      service.perScatterQuery(data).then(res => {
        if (res.status === 200) {
          const { list } = res.data
          this.deleteTableData = list
          this.Intermediate = list
        }
      })
    },
    // echarts散点图点击事件
    onScatter(val) {
      const arr = []
      arr.push({
        tradeDt: val[5],
        tradeCode: val[3],
        bndAbbrNm: val[4],
        txTield: val[13],
        txType: val[9],
        remainPeriod: val[0]
      })
      this.pitchTableData = this.removeDp(arr, this.pitchTableData)
      this.findObjectIndex(val[3], this.echartsDataconfig.configuration.scatterList[0])
    },
    findObjectIndex(id, array2) {
      for (let i = 0; i < array2.length; i++) {
        if (array2[i][3] === id) {
          this.echartsDataconfig.configuration.scatterList[0][i][14] = '1'
        }
      }
      this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
    },
    findObject(arr, array2) {
      for (let i = 0; i < array2.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (array2[i][3] === arr[j].tradeCode) {
            this.echartsDataconfig.configuration.scatterList[0][i][14] = '1'
          }
        }
      }
      this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
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
    // 圈选
    onBrushSelected(params) {
      let seriesIndex = []
      let pitchTable = []
      params.selected.forEach(element => {
        if (element.dataIndex.length !== 0) {
          seriesIndex = element.dataIndex
        }
      })
      if (seriesIndex.length > 0) {
        let arr = this.echartsDataconfig.configuration.scatterList[0]
        seriesIndex.forEach(element => {
          pitchTable.push({
            tradeDt: arr[element][5],
            tradeCode: arr[element][3],
            bndAbbrNm: arr[element][4],
            txTield: arr[element][13],
            txType: arr[element][9],
            remainPeriod: arr[element][0]
          })
        })
        this.pitchTableData = this.removeDp(pitchTable, this.pitchTableData)
        this.findObject(pitchTable, this.echartsDataconfig.configuration.scatterList[0])
      }
    },
    // 取消选中
    pitchTableItem(val) {
      const { scatterList } = this.echartsDataconfig.configuration
      for (let i = 0; i < scatterList[0].length; i++) {
        if (scatterList[0][i][3] === val.tradeCode) {
          this.echartsDataconfig.configuration.scatterList[0][i][14] = '0'
          this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
        }
      }
      // 使用过滤器筛选出tradeDt不等于要删除的数据的所有对象，并将其重新赋值给list数组
      this.pitchTableData = this.pitchTableData.filter(item => {
        return item.tradeCode !== val.tradeCode
      })
    },
    // 取消删除
    deleteTableItem(val) {
      this.pitchTableData = this.removeDp([val], this.pitchTableData)
      this.findObjectIndex(val.tradeCode, this.echartsDataconfig.configuration.scatterList[0])
    },
    // 删除与恢复
    deletingRestoring() {
      this.$confirm('是否确认删除/恢复所选数据点?', '提示', {
        confirmButtonText: '确  定',
        cancelButtonText: '取  消',
        type: 'warning'
      })
        .then(() => {
          // 拷贝上次删除点位的数据
          let newRouterList = cloneDeep(this.deleteTableData)
          let deleteTableData = this.deleteTableData.filter(
            v => this.pitchTableData.findIndex(el => el.tradeCode === v.tradeCode) === -1
          )
          let pitchTableData = this.pitchTableData.filter(
            v => this.deleteTableData.findIndex(el => el.tradeCode === v.tradeCode) === -1
          )
          this.deleteTableData = [...deleteTableData, ...pitchTableData]
          this.pitchTableData = []

          const { scatterList } = this.echartsDataconfig.configuration
          // 用拷贝的删除数去修改删除/恢复后的点位与颜色
          if (newRouterList.length > 0) {
            let res = newRouterList.filter(
              n => !this.deleteTableData.map(v => v.tradeCode).includes(n.tradeCode)
            )
            for (let i = 0; i < scatterList[0].length; i++) {
              for (let j = 0; j < res.length; j++) {
                if (res[j].tradeCode === scatterList[0][i][3]) {
                  this.echartsDataconfig.configuration.scatterList[0][i][14] = '0'
                  this.echartsDataconfig.configuration.scatterList[0][i][11] = '否'
                }
              }
            }
          }
          for (let i = 0; i < scatterList[0].length; i++) {
            for (let j = 0; j < this.deleteTableData.length; j++) {
              if (this.deleteTableData[j].tradeCode === scatterList[0][i][3]) {
                this.echartsDataconfig.configuration.scatterList[0][i][14] = '0'
                if (scatterList[0][i][11] === '否') {
                  this.echartsDataconfig.configuration.scatterList[0][i][11] = '是'
                }
              }
            }
          }

          this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
        })
    },
    scatterReset() {
      this.$confirm('重置后将恢复删点前曲线数据，是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteTableData = []
          this.pitchTableData = []
          this.result = ''
          this.echartsDataconfig.configuration.scatterList[0].forEach((element, index) => {
            element[11] = '否'
            element[14] = '0'
          })
          this.$refs.ScatterEchartRef.init(this.echartsDataconfig)
        })
    },
    // 重新计算
    recalculate() {
      const arr = []
      this.deleteTableData.forEach(element => {
        arr.push(element.tradeCode)
      })
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
              this.initEcharts()
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
    initEcharts() {
      const { queryDate, clusterCd } = this.$parent.ruleForm
      const params = {
        batchNo: this.batchNo,
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
              legendShowType: 'scroll',
              scatterListName: scatterListName,
              lineListName: lineListName,
              seriesType: 'line',
              seriesSmooth: true,
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
              toolbox: ['rect', 'clear'],
              handleFormatter: this.$parent.handleFormatter,
              scatterSymbol: this.$parent.scatterSymbol,
              itemStyleColor: this.$parent.itemStyleColor
            }
          }
          this.configuration = data
          this.$nextTick(() => {
            this.$refs.ScatterEchartRef.init(data)
          })
        }
      })
    }, // 标准曲线簇点线图
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
.contentDetails {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;

  .contentDetailsL {
    position: relative;
    width: 750px;
    height: 500px;
    .contentDetailsEcharts {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  .contentDetailsR {
    width: calc(100% - 750px);

    .buttonList {
      position: relative;
      text-align: right;
    }

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
