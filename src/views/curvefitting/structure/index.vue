<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <BeseShuttleBox
        ref="BeseShuttleBox"
        :model="dialogShow"
        :btn-name="'选择多曲线'"
        :headline-title="'曲线利率期限结构'"
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
        :form-data="formData"
        :label-width="80"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @diagram="diagram"
        @exportData="exportData"
      />
      <div class="proportion">
        <Tabs
          v-model="activeTab"
          :tab-list="tabList"
          :type="'card'"
          :default-name="activeTab"
          @handleTabChange="handleTabChange"
        ></Tabs>
        <div v-if="activeTab === '1'" v-loading="hideScatterEchart">
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
                <el-button type="primary" @click="onRefresht">刷新</el-button>
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
                <el-dropdown vtrigger="click">
                  <el-button :disabled="!canQuery"
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
              </el-form-item>
            </el-form>
          </div>
          <div :style="`height:${echartHeight}px;`">
            <ScatterEchart
              v-if="isScatterEchart"
              ref="ScatterEchartRef"
              :is-id="'ScatterEchart'"
              :width="echartWidth"
              :height="echartHeight"
            ></ScatterEchart>
          </div>
        </div>
        <FormData
          v-else
          :table-data="tableData()"
          :table-column="tableColumn()"
          :table-height="'600px'"
          has-pagination
          :page-size="1"
          :current-page="table.currentPage"
          :total="table.total"
          :loading="hideTableList"
          :page-sizes="[20, 50, 100]"
          @handleSize="handleSizeChange"
          @handleCurrent="handleCurrent"
        >
          <template v-if="activeTab === '3'" v-slot:radio>
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
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BeseShuttleBox from '@components/ShuttleBox'
import BaseForm from '@components/BaseForm/index.vue'
import Tabs from '@components/TabPane'
import { formData, tabList, scatterColumns, morphologyColumns, parameterColumns } from './lib/data'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import FormData from '@components/FormData'
import * as service from '@api/curvefitting'
import * as serviceMang from '@api/curveManagement'
import * as servicRou from '@api/curveRoule'
import { isYes, dropdownList } from '@utils/message'
import { baseDownLoad, compare, isEmpty } from '@utils/util'
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'CurvefittingStructure',
  components: {
    BeforeLineTitle,
    BeseShuttleBox,
    BaseForm,
    Tabs,
    ScatterEchart,
    FormData
  },
  mixins: [keepMixin],
  data() {
    return {
      radio: '3',
      beforeTitle: '曲线利率期限结构',
      activeTab: '1',
      tabList,
      scatterColumns,
      scatterTableData: [],
      morphologyColumns,
      morphologyTableData: [],
      parameterColumns,
      parameterTableData: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
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
      dialogShow: false, // 弹窗状态
      formData,
      setOptions: {},
      shuttleData: [], // 穿梭框数据
      initData: {
        data: [
          { label: '曲线类型:', key: 'curveTp', type: 'Select', options: [] },
          {
            label: '曲线簇名称/曲线创建人:',
            key: 'creater',
            type: 'Select',
            class: 'curve',
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
            multiple: true,
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
      shuttleEnclosure: [],
      ruleForm: {},
      isScatterEchart: false,
      ymaxValue: '',
      yminValue: '',
      canQuery: false,
      hideScatterEchart: false,
      hideTableList: false,
      remoCurveName: false,
      remoScatt: false,
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 600,
      dropdownLabel: '原始比例',
      dropdownList
    }
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
    this.initDict()
  },
  activated() {
    let info = localStorage.getItem('structure')
    if (JSON.stringify(info) !== undefined) {
      let infoList = JSON.parse(info)
      if (infoList) {
        this.shuttleEnclosure = [infoList]
        this.$refs.BeseShuttleBox.rigthList = [infoList]
        this.$refs.BeseShuttleBox.selectedData = [infoList]
        this.getQueryForm(formData.initData)
      }
    }
    this.initDict()
  },
  methods: {
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    tableData() {
      return this.activeTab === '2'
        ? this.scatterTableData
        : this.activeTab === '3'
        ? this.morphologyTableData
        : this.parameterTableData
    },
    tableColumn() {
      return this.activeTab === '2'
        ? this.scatterColumns
        : this.activeTab === '3'
        ? this.morphologyColumns
        : this.parameterColumns
    },
    initDict() {
      serviceMang.getgroupQueryList().then(res => {
        if (res && res.status === 200) {
          const { curveTpList } = res.data
          this.initData.data[0].options = curveTpList
        } // 曲线类型
      })
      servicRou.getcCrveDropDownBox({}).then(res => {
        if (res && res.status === 200) {
          const { curveCreatePrsnList, curveList } = res.data
          this.initData.data[1].options = curveCreatePrsnList
          this.initData.data[2].options = curveList // 曲线名称
          curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
              queryDate: '', // dateConfig().endDate
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
        this.initData.form.curveList = val
      }
      const data = {
        curveType: this.initData.form.curveType || '',
        curveCreatePrsnList: this.initData.form.curveCreatePrsnList || '',
        curveList: this.initData.form.curveList || ''
      }
      servicRou.getcCrveDropDownBox(data).then(res => {
        const { curveCreatePrsnList, curveList } = res.data
        if (res && res.status === 200) {
          this.initData.data[1].options = curveCreatePrsnList
          if (key !== 'curveName') {
            this.initData.data[2].options = curveList
          }
        }
      }) // 曲线
    },
    onEmpty(val) {
      this.shuttleEnclosure = val
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
    onSubmit() {
      this.shuttleData = []
      const data = {
        ...this.initData.form
      }
      this.$refs.BeseShuttleBox.onlefSearchList = true
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res && res.status === 200) {
          res.data.curveList.forEach(element => {
            this.shuttleData.push({
              queryDate: '', // dateConfig().endDate
              timePicker: true,
              check: false,
              curveName: element.name,
              curveId: element.code,
              curveType: element.defaultCode
            })
          })
          this.$refs.BeseShuttleBox.onlefSearchList = false
        }
      })
    },
    onRefresht() {
      if (this.canQuery) {
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
      }
    },
    handleTabChange(data) {
      const { name } = data
      this.activeTab = name
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
        if (name === '1') {
          this.init()
        } else if (name === '2') {
          this.scatter()
        } else if (name === '3') {
          this.morphology()
        } else if (name === '4') {
          this.parameter()
        }
      }
    }, // tab切换
    handleSizeChange(v) {
      this.table.pageSize = v
      this.table.currentPage = 1
      if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      } else if (this.activeTab === '4') {
        this.parameter()
      }
    },
    handleCurrent(v) {
      this.table.currentPage = v
      if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      } else if (this.activeTab === '4') {
        this.parameter()
      }
    },
    scatter() {
      const { rateOrInterMargin, risklessInterRates } = this.ruleForm
      const data = {
        pageType: '1',
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        curveVOs: this.shuttleEnclosure,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates
      }
      this.hideTableList = true
      service
        .perScatterQuery(data)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.scatterTableData = list
            this.table.total = total
            this.hideTableList = false
          } else {
            this.hideTableList = false
          }
        })
        .catch(() => {
          this.hideTableList = false
        })
    }, // 散点图数据
    morphology() {
      const { rateOrInterMargin, risklessInterRates } = this.ruleForm
      const data = {
        pageType: '3',
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        curveVOs: this.shuttleEnclosure,
        exportDataStep: this.radio,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates
      }
      this.hideTableList = true
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
            this.hideTableList = false
          } else {
            this.hideTableList = false
          }
        })
        .catch(() => {
          this.hideTableList = false
        })
    }, // 形态数据
    parameter() {
      const { rateOrInterMargin, risklessInterRates } = this.ruleForm
      const data = {
        curveVOs: this.shuttleEnclosure,
        exportDataStep: '',
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize
      }
      this.hideTableList = true
      service
        .paramQuery(data)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.parameterTableData = list
            this.table.total = total
            this.hideTableList = false
          } else {
            this.hideTableList = false
          }
        })
        .catch(() => {
          this.hideTableList = false
        })
    }, // 曲线图参数
    init() {
      const { rateOrInterMargin, risklessInterRates } = this.ruleForm
      const params = {
        curveVOs: this.shuttleEnclosure,
        exportDataStep: '',
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        pageType: '1',
        ymaxValue: this.ymaxValue,
        yminValue: this.yminValue,
        remoCurveName: this.remoCurveName ? 1 : 0,
        remoScatt: this.remoScatt ? 1 : 0
      }
      this.hideScatterEchart = true
      service
        .curveStrucPointLineQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            const { lineList, lineListName, scatterList, scatterListName } = res.data
            const data = {
              configuration: {
                optionTitle:
                  '◆菱形点：手动删除的点、▲三角形点：本曲线异常值点、■方形点：虚拟样本点、●圆形点：其余真实成交点',
                xAxisName: '(含权)剩余期限',
                yAxisName: rateOrInterMargin === '1' ? '收益率/%' : '利差/BP',
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
                leftGrid: '8%',
                rightGrid: '10%',
                legendShowBottom: '8%',
                topGrid: '10%',
                yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                lineList: lineList,
                scatterList: scatterList,
                scatterTooltipTriggr: 'axis',
                handleFormatter: this.handleFormatter,
                scatterSymbol: this.scatterSymbol
              }
            }
            this.isScatterEchart = true
            this.$nextTick(() => {
              this.$refs.ScatterEchartRef.init(data)
            })
            this.hideScatterEchart = false
          } else {
            this.hideScatterEchart = false
            this.isScatterEchart = false
          }
        })
        .catch(() => {
          this.hideScatterEchart = false
          this.isScatterEchart = false
        })
    },
     calculate(val) {
      let mapObj = new Map([
        ['原始比例_6', '12%'],
        ['原始比例_14', '16%'],
        ['原始比例_18', '20%'],
        ['原始比例_30', '25%'],
        ['比例(12:7)_6', '15%'],
        ['比例(12:7)_14', '20%'],
        ['比例(12:7)_20', '27%'],
        ['比例(12:7)_30', '35%'],
        ['比例(10:6)_6', '15%'],
        ['比例(10:6)_14', '20%'],
        ['比例(10:6)_20', '27%'],
        ['比例(10:6)_30', '35%'],
        ['比例(8:6)_6', '15%'],
        ['比例(8:6)_14', '22%'],
        ['比例(8:6)_20', '35%'],
        ['比例(8:6)_30', '42%']
      ])
      let arr = val.length * 2 + 1
      let type = arr <= 6 ? '6' : arr <= 14 ? '14' : arr <= 18 ? '18' : arr <= 20 ? '20' : '30'
      let key = `${this.dropdownLabel}_${type}`
      mapObj.get(key)
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
    handleFormatter(params) {
      let str = ''
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        const { rateOrInterMargin } = this.ruleForm
        if (componentSubType === 'line') {
          if (data[4] !== undefined || data[6] !== undefined) {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/日期:${data[4]}/${rateOrInterMargin === '1' ? '收益率:' : '利差:'}${
              data[6]
            }<span><br>`
          } else {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>暂无数据<span><br>`
          }
        } else if (componentSubType === 'scatter') {
          let atr = ''
          switch (this.scatterSymbol(data)) {
            case 'diamond':
              atr = `<span class="echart-tip-diamond" style="background: ${color}"></span>`
              break
            case 'triangle':
              atr = `<span class="echart-tip-triangle" style="border: 7px solid #000;border-color: transparent transparent ${color} transparent;"></span>`
              break
            case 'rect':
              atr = `<span class="echart-tip-rect" style="background: ${color}"></span>`
              break
            default:
              atr = `<span class="echart-tip-icon" style="background-color:${color};"></span>`
          }
          if (data[2] === null || data[4] === null) {
            str += `${atr}
              <span>所属曲线:${data[6]}/成交日期:${data[5]}/收益率:${data[13]}<span><br>`
          } else {
            str += `${atr}
              <span>债券简称:${data[4]}/债券代码:${data[2]}/所属曲线:${data[6]}</span><br>
              <span>成交日期:${data[5]}/收益率:${data[13]}<span><br>`
          }
        }
      })
      return `(含权)剩余期限: ` + params[0].axisValue + `(年)` + `<br>` + str
    },
    submitForm(val) {
      this.shuttleEnclosure = val
    },
    deleteItem(val) {
      this.shuttleEnclosure = val
    },
    getQueryForm(fromData) {
      if (this.shuttleEnclosure.length === 0) {
        this.$message({
          message: '请选择曲线后进行查询',
          type: 'warning'
        })
        return
      }
      this.canQuery = true
      this.ruleForm = { ...fromData }
      this.shuttleEnclosure.forEach(element => {
        delete element.check
      })
      this.yminValue = ''
      this.ymaxValue = ''
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      this.queryForm()
    },
    queryForm() {
      if (this.activeTab === '1') {
        this.init()
      } else if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      } else if (this.activeTab === '4') {
        this.parameter()
      }
    },
    diagram() {
      if (this.isScatterEchart === true && this.activeTab === '1') {
        this.$refs.ScatterEchartRef.download()
      } else {
        this.$message({
          message: '请在图像模块选择查询数据后在进行导出图形',
          type: 'warning'
        })
      }
    },
    exportData() {
      if (this.shuttleEnclosure.length === 0) {
        this.$message({
          message: '请在选择曲线查询数据后进行导出数据',
          type: 'warning'
        })
        return
      }
      const { rateOrInterMargin, risklessInterRates } = this.ruleForm
      const data = {
        curveVOs: this.shuttleEnclosure,
        exportDataStep: this.radio,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        pageType: '3'
      }
      if (this.canQuery) {
        baseDownLoad(service.perCruveStrucExcel, data)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    onInit() {
      if (this.canQuery) {
        this.init()
      }
    },
    onDropdown(val, max, min) {
      if (this.canQuery) {
        this.isScatterEchart = false
        if (val === '原始比例') {
          this.echartWidth = this.echartOriginalWidth
          this.echartHeight = this.echartOriginalHeight
        } else {
          let echartOriginalmax = this.echartOriginalWidth / max
          let echartOriginalmin = this.echartOriginalHeight / min
          let mins = echartOriginalmax > echartOriginalmin ? echartOriginalmin : echartOriginalmax
          this.echartWidth = mins * max
          this.echartHeight = mins * min
        }
        this.dropdownLabel = val
        this.hideScatterEchart = true
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;

    .proportion {
      position: relative;
      box-sizing: border-box;
      // width: 100%;
      padding-bottom: 20px;
      background-color: #fff;
      .inputNumber {
        width: 100%;
        padding: 0 10px;
      }
      ::v-deep .el-input {
        width: 110px !important;
      }
      ::v-deep .el-button {
        margin-left: 20px;
      }
      ::v-deep .el-switch {
        margin-left: 30px;
      }
      ::v-deep .el-switch__label.is-active {
        color: #303133;
      }
      ::v-deep .radioGroup {
        position: relative !important;
        width: 100% !important;
        height: 30px !important;
        padding-left: 20px !important;
        line-height: 30px !important;

        .title {
          padding-left: 50px;
          color: #409eff;
        }
      }

      .proportionL {
        box-sizing: border-box;
        width: 70%;
        padding: 0 10px;
      }

      .proportionR {
        box-sizing: border-box;
        width: 30%;
        padding: 0 10px;
        margin-top: 60px;
      }
    }
  }
}
</style>
