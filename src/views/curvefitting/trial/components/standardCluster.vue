<template>
  <div>
    <BaseForm
      :form-data="formDataOne"
      :label-width="120"
      :set-options="setOptions"
      @queryForm="queryForm"
      @resetForm="resetForm"
      @ontouch="onTouch"
      @manual="onManual"
      @trigger="isTrigger"
      @inquire="inQuire"
      @diagram="diagram"
      @exportData="exportData"
    />
    <div class="proportion">
      <div v-loading="hideScatterEchart" class="proportionL">
        <div class="inputNumber">
          <el-form label-width="90px">
            <el-form-item label="Y轴区间(%):">
              <el-input
                v-model="yminValue"
                :disabled="!canQuery"
                placeholder="请输入下限"
                @input="inputFormat(yminValue, 'yminValue')"
              ></el-input>
              —
              <el-input
                v-model="ymaxValue"
                :disabled="!canQuery"
                placeholder="请输入上限"
                @input="inputFormat(ymaxValue, 'ymaxValue')"
              ></el-input>
              <el-button type="primary" :disabled="!canQuery" @click="onRefresht">刷新</el-button>
              <el-switch
                v-model="remoScatt"
                :disabled="!canQuery"
                inactive-text="隐藏全部散点"
                @click.native.prevent="onInit"
              >
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div :style="`height:${echartHeight}px;`">
          <ScatterEchart
            v-if="isScatterEchart"
            ref="ScatterEchartRef"
            :is-id="'standardCluster'"
            :width="echartWidth"
            :height="echartHeight"
          ></ScatterEchart>
        </div>
        <div v-if="isScatterEchart" class="proportionDiagram">
          <div v-for="(item, index) of configuration" :key="index" class="proportionDiagramItem">
            <div
              v-for="(items, indexs) in item.lineList"
              :key="indexs"
              :style="`width:${echartWidth}px;height:${echartHeight}px;`"
              class="proportionDiagramItemEcharts"
            >
              <div
                ref="specific"
                :style="
                  `width:${echartWidth}px;height:${echartHeight}px;zoom:${zoom};transform:scale(${1 /
                    zoom});transform-origin:0 0`
                "
                class="specificechart proportionDiagramItemEcharts"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="proportionR">
        <Tabs
          v-model="activeCut"
          :tab-list="activeCutList"
          :type="'card'"
          :default-name="activeCut"
          @handleTabChange="handleCutChange"
        ></Tabs>
        <FormData
          :table-data="tableData()"
          :table-column="tableColumn()"
          :table-height="'1000px'"
          has-pagination
          :page-size="table.pageSize"
          :current-page="table.currentPage"
          :total="table.total"
          :loading="listLoading"
          :page-sizes="[20, 50, 100]"
          @handleSize="handleSizeChange"
          @handleCurrent="handleCurrent"
        >
          <template v-if="activeCut === '3'" v-slot:radio>
            <div class="radioGroup">
              <el-radio-group v-model="radio">
                <el-radio
                  v-for="item in radioList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                  @change="handleRadioChanges(item)"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
              <span class="title"
                >关键点包括：0.25年、1至10年内的所有整数年、15年、20年、30年、50年</span
              >
            </div>
          </template>
        </FormData>
      </div>
    </div>
    <MotherStandard
      v-if="ShowMotherStandard"
      ref="MotherStandardRef"
      :echarts-data="echartsData"
      :shuttle-enclosure="shuttleEnclosure"
      :rule-form="ruleForm"
      :batch-no="batchNo"
      :curve-object="curveObject"
      @reload="onReload"
    ></MotherStandard>
  </div>
</template>
<script>
import {
  formDataOne,
  activeCutList,
  scatterColumns,
  morphologyColumns,
  parameterColumns
} from '../lib/data'
import Tabs from '@components/TabPane'
import BaseForm from '@components/BaseForm/index.vue'
import FormData from '@components/FormData'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import MotherStandard from '@components/MotherStandard/index.vue'
import { baseDownLoad, compare, isEmpty } from '@utils/util'
import { isYes, isYellow, isGrayness, isOrange, isBlue, isGreen } from '@utils/message'
import * as echarts from 'echarts'
import * as service from '@api/curvefitting'
import * as serviceFig from '@api/configuration'
import html2canvas from 'html2canvas'
export default {
  name: 'StandardCluster',
  components: {
    Tabs,
    BaseForm,
    FormData,
    ScatterEchart,
    MotherStandard
  },
  data() {
    return {
      formDataOne,
      setOptions: {},
      hideScatterEchart: false,
      ymaxValue: '',
      yminValue: '',
      remoScatt: false,
      isScatterEchart: false,
      activeCut: '2',
      activeCutList,
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      radio: '3',
      radioList: [
        {
          label: '0.01',
          value: '1'
        },
        {
          label: '0.1',
          value: '2'
        },
        {
          label: '关键点',
          value: '3'
        }
      ],
      listLoading: false,
      scatterColumns,
      scatterTableData: [],
      morphologyColumns,
      morphologyTableData: [],
      parameterColumns,
      parameterTableData: [],
      ruleForm: {
        clusterCd: '',
        queryDate: ''
      },
      configuration: {},
      curveObject: {},
      batchNo: '',
      ShowMotherStandard: false,
      echartsData: {},
      shuttleEnclosure: [],
      canQuery: false,
      echartHeight: 500,
      echartWidth: 800,
      zoom: 1
    }
  },
  mounted() {
    this.initDict()
    this.zoom = 1 / document.body.style.zoom
    window.addEventListener('resize', () => {
      this.zoom = 1 / document.body.style.zoom
    })
  },
  methods: {
    initDict() {
      serviceFig.queryStaList({ curveTp: '1' }).then(res => {
        if (res && res.status === 200) {
          const { clusterNameList } = res.data
          this.setOptions = { clusterCd: clusterNameList }
        }
      })
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    tableData() {
      return this.activeCut === '2'
        ? this.scatterTableData
        : this.activeCut === '3'
        ? this.morphologyTableData
        : this.parameterTableData
    },
    tableColumn() {
      return this.activeCut === '2'
        ? this.scatterColumns
        : this.activeCut === '3'
        ? this.morphologyColumns
        : this.parameterColumns
    },
    queryForm(fromData) {
      this.canQuery = true
      this.batchNo = ''
      this.dottedBatchNo = ''
      this.ymaxValue = ''
      this.yminValue = ''
      this.inquireTitle = '查询'
      this.ruleForm = { ...fromData }
      if (this.activeCut === '2') {
        this.scatter()
      } else if (this.activeCut === '3') {
        this.morphology()
      } else if (this.activeCut === '4') {
        this.parameter()
      }
      this.init()
    },
    resetForm() {
      this.batchNo = ''
    },
    onTouch(val) {
      if (val === '标准曲线') {
        if (this.ruleForm.clusterCd === '') {
          this.$message({
            message: '请选择曲线簇名称后进行查询',
            type: 'warning'
          })
          return
        }
        this.ShowMotherStandard = true
        this.$nextTick(() => {
          this.echartsData = this.configuration
          this.$refs.MotherStandardRef.showhandleClose()
        })
      }
    },
    onManual(val) {
      if (val === '标准曲线') {
        const { queryDate, clusterCd } = this.ruleForm
        if (clusterCd === '') {
          this.$message({
            message: '请选择曲线簇名称查询后进行导出数据',
            type: 'warning'
          })
          return
        }
        let clusterName = ''
        this.setOptions.clusterCd.forEach(element => {
          if (element.code === clusterCd) {
            clusterName = element.name
          }
        })
        const data = {
          clusterCd: clusterCd || '',
          queryDate: queryDate || '',
          curveType: '0',
          clusterName: clusterName || ''
        }
        if (this.canQuery) {
          baseDownLoad(service.manuVeriDataExcel, data)
        } else {
          this.$message.warning('请查询数据后导出')
        }
      }
    },
    isTrigger(val, item) {
      this.ruleForm = { ...val }
    },
    inQuire(fromData) {
      this.canQuery = true
      this.batchNo = ''
      this.dottedBatchNo = ''
      if (this.shuttleEnclosure.length === 0) {
        this.$message({
          message: '请选择曲线后进行查询',
          type: 'warning'
        })
        return
      }
      this.shuttleEnclosure.forEach(element => {
        delete element.check
      })
      this.ruleForm = { ...fromData }
      if (this.activeCut === '2') {
        this.scatter()
      } else if (this.activeCut === '3') {
        this.morphology()
      } else if (this.activeCut === '4') {
        this.parameter()
      }
      this.init()
    },
    diagram(val) {
      if (val === '标准曲线') {
        if (this.isScatterEchart === true) {
          this.$refs.ScatterEchartRef.download()
          let myEchart = document.getElementsByClassName('specificechart')
          for (let i = 0; i < myEchart.length; i++) {
            this.download(i)
          }
        } else {
          this.$message({
            message: '请在图像模块选择查询数据后在进行导出图形',
            type: 'warning'
          })
        }
      }
    },
    download(i) {
      let title = this.$route.meta.title
      html2canvas(document.getElementsByClassName('specificechart')[i]).then(function(canvas) {
        let img = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        // 创建a标签，实现下载
        let creatIMg = document.createElement('a')
        creatIMg.download = `${title}.png` // 设置下载的文件名，
        creatIMg.href = img // 下载url
        document.body.appendChild(creatIMg)
        creatIMg.click()
        creatIMg.remove() // 下载之后把创建的元素删除
      })
    },
    exportData(val) {
      if (val === '标准曲线') {
        const { queryDate, clusterCd } = this.ruleForm
        if (clusterCd === '') {
          this.$message({
            message: '请选择曲线簇名称查询后进行导出数据',
            type: 'warning'
          })
          return
        }
        const data = {
          curveVOs: this.shuttleEnclosure || [],
          clusterCd: clusterCd || '',
          queryDate: queryDate || '',
          exportDataStep: this.radio,
          rateOrInterMargin: '1',
          pageType: '1',
          batchNo: this.batchNo || ''
        }
        if (this.canQuery) {
          baseDownLoad(service.stdCruveExcel, data)
        } else {
          this.$message.warning('请查询数据后导出')
        }
      }
    },
    onRefresht() {
      if (this.canQuery) {
        this.inquireTitle = '刷新'
        if (this.ymaxValue && this.yminValue) {
          if (Number(this.yminValue) > Number(this.ymaxValue)) {
            this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
            return false
          }
        } else if (isEmpty(this.yminValue) && isEmpty(this.ymaxValue)) {
          this.init()
          return
        } else {
          this.$message.warning('请完善Y轴上限或下限')
          return false
        }
        this.init()
        if (this.activeCut === '2') {
          this.scatter()
        } else if (this.activeCut === '3') {
          this.morphology()
        } else if (this.activeCut === '4') {
          this.parameter()
        }
      }
    },
    handleCutChange(data) {
      this.activeCut = data.name
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      if (this.canQuery) {
        if (this.ruleForm.clusterCd === '') {
          this.$message({
            message: '请选择曲线簇名称后进行查询',
            type: 'warning'
          })
        }
        if (data.name === '2') {
          this.scatter()
        } else if (data.name === '3') {
          this.morphology()
        } else if (data.name === '4') {
          this.parameter()
        }
      }
    },
    handleSizeChange(v) {
      this.table.pageSize = v
      this.table.currentPage = 1
      if (this.activeCut === '2') {
        this.scatter()
      } else if (this.activeCut === '3') {
        this.morphology()
      } else if (this.activeCut === '4') {
        this.parameter()
      }
    },
    handleCurrent(v) {
      this.table.currentPage = v
      if (this.activeCut === '2') {
        this.scatter()
      } else if (this.activeCut === '3') {
        this.morphology()
      } else if (this.activeCut === '4') {
        this.parameter()
      }
    },
    init() {
      const { queryDate, clusterCd } = this.ruleForm
      const params = {
        curveVOs: this.shuttleEnclosure || [],
        clusterCd: clusterCd || '',
        queryDate: queryDate || '',
        exportDataStep: '',
        pageType: '1',
        ymaxValue: this.ymaxValue,
        yminValue: this.yminValue,
        remoCurveName: 0,
        remoScatt: this.remoScatt ? 1 : 0,
        dottedBatchNo: this.batchNo || ''
      }
      this.hideScatterEchart = true
      service
        .curveCalcPointLineQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            this.isScatterEchart = false
            const { lineList, line2List, lineListName, scatterList, scatterListName } = res.data
            if (lineList === null && scatterList === null) {
              const { curveName, queryDate } = this.shuttleEnclosure[0]
              this.$alert(`${curveName}在${queryDate}日未拟合,无法查询`, '提示', {
                lockScroll: false,
                confirmButtonText: '确定'
              })
              this.isScatterEchart = false
              this.hideScatterEchart = false
              return
            }
            if (scatterList) {
              scatterList[0].forEach(element => {
                element[14] = '0'
              })
            }
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
                bottomGrid: this.calculate(lineListName),
                leftGrid: '5%',
                rightGrid: '15%',
                legendShowBottom: '7%',
                topGrid: '10%',
                lineList: lineList,
                scatterList: scatterList,
                line2List: line2List,
                scatterTooltipTriggr: 'axis',
                yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                handleFormatter: this.handleFormatter,
                scatterSymbol: this.scatterSymbol,
                itemStyleColor: this.itemStyleStandard
              }
            }
            this.isScatterEchart = true
            if (this.inquireTitle === '查询') {
              this.configuration = data
            }
            this.initEcharts(data)
            this.$nextTick(() => {
              this.$refs.ScatterEchartRef.init(data)
            })
            this.hideScatterEchart = false
          } else {
            this.isScatterEchart = false
            this.hideScatterEchart = false
          }
        })
        .catch(() => {
          this.isScatterEchart = false
          this.hideScatterEchart = false
        })
    },
    calculate(val) {
      if (this.batchNo === '') {
        let arr = val.length * 2
        // 正常查询
        if (arr <= 10) {
          return '20%'
        } else if (arr <= 20) {
          return '25%'
        } else if (arr <= 30) {
          return '30%'
        }
      } else {
        let arr = val.length * 3
        // 重新计算后
        if (arr <= 10) {
          return '20%'
        } else if (arr <= 20) {
          return '30%'
        } else if (arr <= 30) {
          return '40%'
        }
      }
    },
    handleFormatter(params) {
      let str = ''
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
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
          if (data[2] === null || data[4] === null) {
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
              <span>所属曲线:${data[6]}/成交日期:${data[5]}/收益率:${data[13]}<span><br>`
          } else {
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
              <span>债券简称:${data[4]}/债券代码:${data[2]}/所属曲线:${data[6]}</span><br>
              <span>成交日期:${data[5]}/收益率:${data[13]}<span><br>`
          }
        }
      })
      return `(含权)剩余期限: ` + params[0].axisValue + `(年)` + `<br>` + str
    },
    scatterSymbol(params) {
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
    itemStyleStandard(params) {
      if (params.data[14] === '1') {
        return isYellow
      } else {
        return params.color
      }
    },
    scatter() {
      const { queryDate, clusterCd } = this.ruleForm
      const data = {
        pageType: '1',
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        curveVOs: this.shuttleEnclosure || [],
        clusterCd: clusterCd || '',
        queryDate: queryDate || '',
        batchNo: this.batchNo || ''
      }
      this.listLoading = true
      service
        .perScatterQuery(data)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.scatterTableData = list
            this.table.total = total
            if (total > 0) {
              this.curveObject = this.scatterTableData[0]
            }
            this.listLoading = false
          } else {
            this.listLoading = false
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    }, // 散点图数据
    morphology() {
      const { queryDate, clusterCd } = this.ruleForm
      const data = {
        pageType: '1',
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        curveVOs: this.shuttleEnclosure || [],
        rateOrInterMargin: '1',
        risklessInterRates: [],
        exportDataStep: this.radio,
        clusterCd: clusterCd || '',
        queryDate: queryDate || '',
        batchNo: this.batchNo || ''
      }
      this.listLoading = true
      service
        .perModtQuery(data)
        .then(res => {
          if (res && res.status === 200) {
            const { describe, analRowData, modtColumnVo, total } = res.data
            this.morphologyTableData = analRowData
            this.table.total = total
            this.morphologyColumns = [
              { name: describe || '形态数据', prop: '', children: modtColumnVo }
            ]
            this.listLoading = false
          } else {
            this.listLoading = false
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    }, // 形态数据
    parameter() {
      const { queryDate, clusterCd } = this.ruleForm
      const data = {
        curveVOs: this.shuttleEnclosure || [],
        exportDataStep: '',
        clusterCd: clusterCd || '',
        queryDate: queryDate || '',
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        batchNo: this.batchNo || ''
      }
      this.listLoading = true
      service
        .paramQuery(data)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.parameterTableData = list
            this.table.total = total
            this.listLoading = false
          } else {
            this.listLoading = false
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    }, // 曲线图参数
    initEcharts(data) {
      this.$nextTick(() => {
        let myEchart = document.getElementsByClassName('specificechart')
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
          yAxisMax,
          yAxisMin,
          boundaryGap,
          xAxisSplitLineShow,
          xAxisSplitLineShowlineStyle,
          xAxisAxisLineShow,
          xAxisAxisLineShowlineStyle,
          xAxisAxisLabelColor,
          xAxis,
          yAxisType,
          yAxisSplitLineShow,
          yAxisSplitLineShowlineStyle,
          yAxisAxisLineShowlineStyle,
          yAxisAxisLabelColor
        } = data.configuration
        for (let i = 0; i < myEchart.length; i++) {
          let myChart = echarts.init(myEchart[i])
          if (scatterList) {
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
              right: '15%',
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
                let arr = param.sort(compare('data', 1))
                arr.map(item => {
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
                },
                data: scatterList ? scatterList[i] : []
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
          document.oncontextmenu = function() {
            return false
          }
          myChart.setOption(option)
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        }
      })
    },
    handleRadioChanges(e) {
      this.radio = e.value
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      if (this.canQuery) {
        this.morphology()
      }
    },
    onReload(val, data) {
      this.batchNo = val
      this.$nextTick(() => {
        this.init()
        if (this.activeCut === '2') {
          this.scatter()
        } else if (this.activeCut === '3') {
          this.morphology()
        } else if (this.activeCut === '4') {
          this.parameter()
        }
      })
    },
    onInit() {
      if (this.canQuery) {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  height: 100%;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;

    .proportion {
      position: relative !important;
      box-sizing: border-box !important;
      display: flex;
      width: calc(100% - 20px) !important;
      padding-bottom: 20px !important;
      margin: 0 10px;
      background-color: #fff !important;

      ::v-deep .radioGroup {
        position: relative;
        width: 100%;
        height: 30px;
        padding-left: 20px;
        line-height: 30px;

        .title {
          padding-left: 30px;
          font-size: 10px;
          color: #409eff;
        }
      }

      .proportionL {
        box-sizing: border-box;
        width: 50%;
        border: 1px solid #e6e9eb;
        border-radius: 4px;
        .inputNumber {
          width: 100%;
          padding: 0 10px;
          .el-form-item {
            margin-top: 10px;
            margin-bottom: 10px;
          }
        }
        .proportionEcharts {
          width: 100%;
          height: 500px;
        }
        .proportionDiagram {
          position: relative;
          z-index: 999;
          box-sizing: border-box;
          height: 720px;
          padding-right: 10px;
          overflow: auto;
          .proportionDiagramItem {
            position: relative;
            width: 100%;
            height: 400px;
            margin: 25px 0;
            .proportionDiagramItemEcharts {
              position: relative;
              margin-bottom: 20px;
            }
            .proportionDiagramItemEcharts::after {
              position: absolute;
              top: -15px;
              left: 10px;
              width: calc(100% - 20px);
              height: 1px;
              content: '';
              background: #ccc;
            }
          }
        }
        ::v-deep .el-input {
          width: 110px !important;
        }
        ::v-deep .el-button {
          margin-left: 10px;
        }
        ::v-deep .el-switch {
          margin-left: 10px;
        }
        ::v-deep .el-switch__label.is-active {
          color: #303133;
        }
      }

      .proportionR {
        box-sizing: border-box;
        width: 50%;
        padding: 0 10px;
      }
    }
  }
}
</style>
