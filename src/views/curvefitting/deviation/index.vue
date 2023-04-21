<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <BeseShuttleBox
        ref="BeseShuttleBox"
        :model="dialogShow"
        :btn-name="'选择单曲线'"
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
        :label-width="120"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @diagram="diagram"
        @exportData="exportData"
      />
      <div class="proportion">
        <div class="proportionL">
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
                  <el-button type="primary" :disabled="!canQuery" @click="onRefresht"
                    >刷新</el-button
                  >
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
                v-if="IsScatterEchart"
                ref="ScatterEchartRef"
                :is-id="'ScatterEchart'"
                :width="echartWidth"
                :height="echartHeight"
              ></ScatterEchart>
            </div>
          </div>
          <FormData
            v-if="activeTab === '2' || activeTab === '3'"
            :table-data="activeTab === '2' ? scatterTableData : morphologyTableData"
            :table-height="'600px'"
            :table-column="activeTab === '2' ? scatterColumns : morphologyColumn"
            has-pagination
            :page-size="1"
            :current-page="table.currentPage"
            :total="table.total"
            :loading="hideTableList"
            :page-sizes="[20, 50, 100]"
            @handleSize="handleSizeChange"
            @handleCurrent="handleCurrent"
          >
          </FormData>
        </div>
        <div v-loading="hideProportionR" class="proportionR">
          <el-table :data="collectData" border style="width: 100%">
            <template>
              <el-table-column
                v-for="(item, index) in collectColumn"
                :key="index"
                :prop="item.prop"
                :label="item.name"
                align="center"
              >
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BeseShuttleBox from '@components/ShuttleBox'
import BaseForm from '@components/BaseForm/index.vue'
import Tabs from '@components/TabPane'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import FormData from '@components/FormData'
import * as service from '@api/curvefitting'
import * as serviceMang from '@api/curveManagement'
import * as servicRou from '@api/curveRoule'
import { isYes, isGrayness, isOrange, isGreen, dropdownList } from '@utils/message'
import { baseDownLoad, compare, isEmpty } from '@utils/util'
import keepMixin from '@mixins/keep.mixin'
import cloneDeep from 'lodash/cloneDeep'
import {
  formData,
  tabList,
  scatterColumns,
  collectColumn,
  morphologyColumn,
  collectData,
  scatterColumnsTw
} from './lib/data'
export default {
  name: 'CurvefittingDeviation',
  components: {
    BeforeLineTitle,
    BeseShuttleBox,
    BaseForm,
    Tabs,
    FormData,
    ScatterEchart
  },
  mixins: [keepMixin],
  data() {
    return {
      beforeTitle: '单曲线偏离度分析', // 页面title
      activeTab: '1', // tab高亮
      tabList, // tab列表
      scatterColumns,
      scatterColumnsList: cloneDeep(scatterColumns),
      scatterColumnsTw, // 散点图表头
      scatterTableData: [],
      morphologyColumn, // 形态表头
      morphologyTableData: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      collectColumn,
      collectData,
      dialogShow: false, // 弹窗状态
      formData,
      setOptions: {},
      shuttleData: [], // 穿梭框数据
      initData: {
        data: [
          { label: '曲线类型:', key: 'curveTp', type: 'Select', clearable: true, options: [] },
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
      IsScatterEchart: false,
      ymaxValue: '',
      yminValue: '',
      remoCurveName: false,
      remoScatt: false,
      canQuery: false,
      hideScatterEchart: false,
      hideProportionR: false,
      hideTableList: false,
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1200,
      echartOriginalHeight: 550,
      dropdownLabel: '原始比例',
      dropdownList
    }
  },
  mounted() {
    this.collectData.forEach(element => {
      element.value = ''
    })
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
    this.initDict()
  },
  methods: {
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    initDict() {
      serviceMang.getgroupQueryList().then(res => {
        const { curveTpList } = res.data
        if (res && res.status === 200) {
          this.initData.data[0].options = curveTpList
        } // 曲线类型
      })
      servicRou.getcCrveDropDownBox({}).then(res => {
        const { curveCreatePrsnList, curveList } = res.data
        if (res.status === 200) {
          this.initData.data[1].options = curveCreatePrsnList
          this.initData.data[2].options = curveList // 曲线名称
          res.data.curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
              check: false,
              curveName: name,
              curveId: code,
              curveType: defaultCode
            })
          })
        }
      })
    }, // 默认显示字典项
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
        if (res.status === 200) {
          const { curveCreatePrsnList, curveList } = res.data
          this.initData.data[1].options = curveCreatePrsnList
          if (key !== 'curveName') {
            this.initData.data[2].options = curveList
          }
        }
      }) // 曲线
    }, // 切换加载字典项
    onSubmit() {
      this.shuttleData = []
      const data = {
        ...this.initData.form
      }
      this.$refs.BeseShuttleBox.onlefSearchList = true
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res.status === 200) {
          res.data.curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
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
    onEmpty(val) {
      this.shuttleEnclosure = val
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
      this.activeTab = data.name
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
          return
        }
        if (this.activeTab === '1') {
          this.init()
        } else if (this.activeTab === '2') {
          this.scatter()
        } else if (this.activeTab === '3') {
          this.morphology()
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
      }
    },
    handleCurrent(v) {
      this.table.currentPage = v
      if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      }
    },
    submitForm(val) {
      this.shuttleEnclosure = val
    },
    deleteItem(val) {
      this.shuttleEnclosure = val
      this.canQuery = false
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
        this.collect()
      } else if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      }
    },
    init() {
      const { beginDate, endDate } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      if (endDate < beginDate) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning'
        })
        return
      }
      const params = {
        beginDate: beginDate,
        endDate: endDate,
        curveId: curveId,
        curveName: curveName,
        curveType: curveType,
        bndInnerCodeList: [],
        scatterRemainPeriod: '',
        ymaxValue: this.ymaxValue,
        yminValue: this.yminValue,
        remoCurveName: this.remoCurveName ? 1 : 0,
        remoScatt: this.remoScatt ? 1 : 0
      }
      this.hideScatterEchart = true
      service.trePointLineDevQuery(params).then(res => {
        if (res && res.status === 200) {
          this.IsScatterEchart = false
          const { lineList, lineListName, scatterList, scatterListName } = res.data
          const data = {
            configuration: {
              optionTitle:
                '◆灰色菱形点：手动删除的点、▲橙色三角形点：本曲线异常值点、■蓝色方形点：虚拟样本点、●绿色圆形点：其余真实成交点',
              xAxisName: '日期',
              yAxisName: '收益率/%',
              boundaryGap: true,
              xAxisType: 'category',
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
              bottomGrid: '15%',
              leftGrid: '10%',
              rightGrid: '10%',
              legendShowBottom: '8%',
              topGrid: '10%',
              yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
              yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
              lineList: lineList,
              scatterList: scatterList,
              scatterTooltipTriggr: 'axis',
              handleFormatter: this.handleFormatter,
              scatterSymbol: this.scatterSymbol,
              itemStyleColor: this.itemStyleColor
            }
          }
          this.IsScatterEchart = true
          this.$nextTick(() => {
            this.$refs.ScatterEchartRef.init(data)
          })
          this.hideScatterEchart = false
        }
      })
    },
    scatterSymbol(params) {
      if (params[10] === isYes) {
        return 'diamond'
      } else if (params[11] === isYes) {
        return 'triangle'
      } else {
        return 'circle'
      }
    },
    itemStyleColor(params) {
      if (params.data[10] === isYes) {
        return isGrayness
      } else if (params.data[11] === isYes) {
        return isOrange
      } else {
        return isGreen
      }
    },
    handleFormatter(params) {
      let str = ''
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          if (data[2] !== undefined || data[6] !== undefined) {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/(含权)剩余期限(${data[5]}年)/收益率:${data[6]}<span><br>`
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
          str += `${atr}
              <span>债券简称:${data[3]}/债券代码:${data[2]}/成交日期:${data[4]}</span><br>
              <span>(含权)剩余期限:${data[5]}年/投射3年收益率:${data[7]}%<span><br>`
        }
      })
      return `日期:` + params[0].axisValue + `<br>` + str
    },
    scatter() {
      const { curveType } = this.shuttleEnclosure[0]
      const { beginDate, endDate } = this.ruleForm
      const params = {
        beginDate: beginDate,
        endDate: endDate,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        pageType: '4',
        curveVOs: this.shuttleEnclosure,
        exportDataStep: '',
        queryDate: '',
        surplusPeriod: ''
      }
      this.hideTableList = true
      service
        .curveScatterQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            if (curveType === '0') {
              this.scatterColumns = [...this.scatterColumnsTw]
            } else {
              this.scatterColumns = [...this.scatterColumnsList]
            }
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
    collect() {
      const { beginDate, endDate } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      const data = {
        beginDate: beginDate,
        endDate: endDate,
        bndInnerCodeList: [],
        curveId: curveId,
        curveType: curveType,
        curveName: curveName,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        scatterRemainPeriod: ''
      }
      this.hideProportionR = true
      service
        .sumQuery(data)
        .then(res => {
          if (res && res.status === 200) {
            collectData.forEach(element => {
              if (res.data[element.key]) {
                element.value = res.data[element.key]
              }
            })
            this.hideProportionR = false
          } else {
            this.hideProportionR = false
          }
        })
        .catch(() => {
          this.hideProportionR = false
        })
    }, // 汇总列表
    morphology() {
      const { beginDate, endDate } = this.ruleForm
      const data = {
        beginDate: beginDate,
        endDate: endDate,
        pageType: '4',
        curveVOs: this.shuttleEnclosure,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        rateOrInterMargin: '1',
        risklessInterRates: [],
        exportDataStep: ''
      }
      this.hideTableList = true
      service
        .modtQuery(data)
        .then(res => {
          if (res) {
            const { describe, analRowData, modtColumnVo, total } = res.data
            this.morphologyTableData = analRowData
            this.table.total = total
            this.morphologyColumn = [{ name: describe, prop: '', children: modtColumnVo }]
            this.hideTableList = false
          } else {
            this.hideTableList = false
          }
        })
        .catch(() => {
          this.hideTableList = false
        })
    }, // 形态数据
    diagram() {
      if (this.IsScatterEchart === true && this.activeTab === '1') {
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
      const { beginDate, endDate } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      const data = {
        beginDate: beginDate,
        endDate: endDate,
        bndInnerCodeList: [],
        curveId: curveId,
        curveType: curveType,
        curveName: curveName,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        scatterRemainPeriod: '1',
        yesConfirm: true
      }
      if (this.canQuery) {
        baseDownLoad(service.treCruveDeviExcel, data)
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
        this.IsScatterEchart = false
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
      display: flex;
      width: 100%;
      padding-bottom: 20px;
      background-color: #fff;

      .proportionL {
        box-sizing: border-box;
        width: 1200px;
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
      }

      .proportionR {
        box-sizing: border-box;
        width: calc(100% - 1200px);
        padding: 0 10px;
        margin-top: 60px;
      }
    }
  }
}
</style>
