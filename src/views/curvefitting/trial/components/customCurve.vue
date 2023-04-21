<template>
  <div>
    <BeseShuttleBox
      ref="BeseShuttleBox"
      :model="dialogShow"
      :btn-name="'选择单曲线'"
      :headline-title="'曲线试算'"
      :btn-icon="'el-icon-plus'"
      :dialog-title="'选择曲线'"
      :dialog-width="'1000px'"
      :shuttle-data="shuttleData"
      :init-data="initData"
      @submitForm="submitForm"
      @deleteItem="deleteItem"
      @trigger="onTrigger"
      @onSubmit="onSubmit"
      @empty="onEmpty"
    >
    </BeseShuttleBox>
    <BaseForm
      :form-data="formDataTwo"
      :label-width="120"
      :set-options="setOptions"
      @queryForm="queryForm"
      @resetForm="resetForm"
      @ontouch="onTouch"
      @manual="onManual"
      @trigger="isTrigger"
      @inquire="inQuire"
      @diagram="diagram"
      @confirm="confirm"
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
                v-model="remoCurveName"
                :disabled="!canQuery"
                inactive-text="隐藏自定义曲线创建人后缀"
                @click.native.prevent="onInit"
              >
              </el-switch>
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
            :is-id="'customCurve'"
            :width="echartWidth"
            :height="echartHeight"
          ></ScatterEchart>
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
    <MotherDiagram
      v-if="ShowMotherDiagram"
      ref="MotherDiagramRef"
      :echarts-data="echartsData"
      :shuttle-enclosure="shuttleEnclosure"
      :rule-form="ruleForm"
      :curve-object="curveObject"
      @reload="onReload"
    >
    </MotherDiagram>
  </div>
</template>
<script>
import {
  formDataTwo,
  activeCutList,
  scatterColumns,
  morphologyColumns,
  parameterColumns
} from '../lib/data'
import Tabs from '@components/TabPane'
import BaseForm from '@components/BaseForm/index.vue'
import BeseShuttleBox from '@components/ShuttleBox'
import FormData from '@components/FormData'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import MotherDiagram from '@components/MotherDiagram/index.vue'
import { baseDownLoad, compare, isEmpty } from '@utils/util'
import { isYes, isYellow, isGrayness, isOrange, isBlue, isGreen } from '@utils/message'
import * as service from '@api/curvefitting'
import * as serviceMang from '@api/curveManagement'
import * as servicRou from '@api/curveRoule'
export default {
  name: 'StandardCluster',
  components: {
    Tabs,
    BaseForm,
    FormData,
    ScatterEchart,
    MotherDiagram,
    BeseShuttleBox
  },
  data() {
    return {
      dialogShow: false, // 弹窗状态
      shuttleData: [], // 穿梭框数据
      formDataTwo,
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
      ShowMotherDiagram: false,
      echartsData: {},
      shuttleEnclosure: [],
      initData: {
        data: [
          { label: '曲线类型:', key: 'curveTp', type: 'Select', disabled: true, options: [] },
          {
            label: '曲线创建人:',
            key: 'creater',
            type: 'Select',
            filterable: true,
            clearable: true,
            multiple: true,
            options: []
          },
          {
            label: '曲线名称:',
            key: 'curveName',
            type: 'Select',
            filterable: true,
            clearable: true,
            multiple: false,
            options: []
          },
          { label: '', key: '查询', type: 'Button' }
        ],
        form: {
          curveType: '',
          curveCreatePrsnList: [],
          curveList: []
        }
      },
      remoCurveName: false,
      canQuery: false,
      echartHeight: 500,
      echartWidth: 800
    }
  },
  mounted() {
    this.initDict()
  },
  methods: {
    initDict() {
      serviceMang.getgroupQueryList().then(res => {
        if (res && res.status === 200) {
          const { curveTpList } = res.data
          this.initData.data[0].options = [curveTpList[1]]
          this.initData.curveTp = '1'
          this.initData.form.curveType = '1'
        } // 曲线类型
      })
      servicRou.getcCrveDropDownBox({ curveType: '1' }).then(res => {
        if (res && res.status === 200) {
          const { curveCreatePrsnList, curveList } = res.data
          this.initData.data[1].options = curveCreatePrsnList
          curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
              queryDate: '',
              timePicker: true,
              check: false,
              curveName: name,
              curveId: code,
              curveType: defaultCode
            })
          })
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
    submitForm(val) {
      this.shuttleEnclosure = val
    },
    deleteItem(val) {
      this.shuttleEnclosure = val
    },
    onEmpty(val) {
      this.shuttleEnclosure = val
    },
    onTrigger(val, item) {
      const { key } = item
      if (key === 'curveTp') {
        this.initData.form.curveType = val
        this.initData.creater = []
        this.initData.curveName = []
        this.initData.form.curveCreatePrsnList = []
        this.initData.form.curveList = []
      } else if (key === 'creater') {
        this.initData.form.curveCreatePrsnList = val
      } else if (key === 'curveName') {
        if (val === '') {
          this.initData.form.curveList = []
        } else {
          this.initData.form.curveList = [val]
        }
      }
      const data = {
        curveType: this.initData.form.curveType || '',
        curveCreatePrsnList: this.initData.form.curveCreatePrsnList || '',
        curveList: this.initData.form.curveList || ''
      }
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res && res.status === 200) {
          const { curveCreatePrsnList, curveList } = res.data
          this.initData.data[1].options = curveCreatePrsnList
          if (key !== 'curveName') {
            this.initData.data[2].options = curveList
          }
        }
      }) // 曲线
    },
    onSubmit() {
      this.shuttleData = []
      const data = {
        curveType: '1',
        ...this.initData.form
      }
      this.$refs.BeseShuttleBox.onlefSearchList = true
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res && res.status === 200) {
          res.data.curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
              queryDate: '',
              timePicker: true,
              check: false,
              curveName: name,
              curveId: code,
              curveType: defaultCode
            })
          })
          this.$refs.BeseShuttleBox.onlefSearchList = false
        }
      })
    },
    resetForm() {
      this.batchNo = ''
    },
    onTouch(val) {
      if (val === '自定义曲线') {
        if (this.shuttleEnclosure.length === 0 || this.isScatterEchart === false) {
          this.$message({
            message: '请选择曲线进行查询后操作',
            type: 'warning'
          })
          return
        }
        this.ShowMotherDiagram = true
        this.$nextTick(() => {
          this.echartsData = this.configuration
          this.$refs.MotherDiagramRef.showhandleClose()
        })
      }
    },
    onManual(val) {
      if (val === '自定义曲线') {
        if (this.shuttleEnclosure.length === 0) {
          this.$message({
            message: '请在选择单曲线查询数据后进行导出数据',
            type: 'warning'
          })
          return
        }
        const { curveId, queryDate, curveName } = this.shuttleEnclosure[0]
        const data = {
          curveId: curveId,
          curveType: '1',
          queryDate: queryDate,
          curveName: curveName
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
      this.ymaxValue = ''
      this.yminValue = ''
      this.inquireTitle = '查询'
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
      if (val === '自定义曲线') {
        if (this.isScatterEchart === true) {
          this.$refs.ScatterEchartRef.download()
        } else {
          this.$message({
            message: '请在选择单曲线查询数据后在进行导出图形',
            type: 'warning'
          })
        }
      }
    },
    exportData(val) {
      if (val === '自定义曲线') {
        if (this.shuttleEnclosure.length === 0) {
          this.$message({
            message: '请在选择单曲线查询数据后进行导出数据',
            type: 'warning'
          })
          return
        }
        const data = {
          clusterCd: '',
          curveVOs: this.shuttleEnclosure,
          exportDataStep: this.radio,
          pageType: '2',
          queryDate: '',
          rateOrInterMargin: '1',
          risklessInterRates: [],
          batchNo: this.batchNo || ''
        }
        if (this.canQuery) {
          baseDownLoad(service.customCruveExcel, data)
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
        if (this.shuttleEnclosure.length === 0) {
          this.$message({
            message: '请选择曲线后进行查询',
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
        remoCurveName: this.remoCurveName ? 1 : 0,
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
                line2List: line2List,
                scatterList: scatterList,
                scatterTooltipTriggr: 'axis',
                yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                handleFormatter: this.handleFormatter,
                scatterSymbol: this.scatterSymbol,
                itemStyleColor: this.itemStyleColor
              }
            }
            if (this.inquireTitle === '查询') {
              this.configuration = data
            }
            this.isScatterEchart = true
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
      let arr = val.length * 2
      if (arr <= 10) {
        return '20%'
      } else if (arr <= 20) {
        return '25%'
      } else if (arr <= 30) {
        return '30%'
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
    itemStyleColor(params) {
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
        this.scatter()
        this.morphology()
      })
    },
    onInit() {
      if (this.canQuery) {
        this.init()
      }
    },
    confirm() {
      if (this.batchNo.length === 0) {
        this.$confirm('未进行删除样本点重新计算操作，无可保存信息。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        this.$confirm('将针对页面现有图表对应数据进行保存，是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          service
            .saveCalc({ batchNo: this.batchNo, curveId: this.shuttleEnclosure[0].curveId })
            .then(res => {
              if (res && res.status === 200) {
                const { calStatus } = res.data
                if (calStatus === '1') {
                  this.$message({
                    message: '保存重算结果成功',
                    type: 'success'
                  })
                  this.batchNo = ''
                  this.init()
                }
              }
            })
        })
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
              width: 100%;
              height: 100%;
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
