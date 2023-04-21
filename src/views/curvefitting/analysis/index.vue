<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <BeseShuttleBox
        ref="BeseShuttleBox"
        :model="dialogShow"
        :btn-name="'选择多曲线'"
        :btn-icon="'el-icon-plus'"
        :headline-title="'曲线利率走势分析'"
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
        :key="analysisKey"
        :form-data="formData"
        :label-width="120"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @diagram="diagram"
        @exportData="exportData"
      >
        <template v-slot:items="{ data, rowItem }">
          <el-form-item :label="rowItem.label" class="formItem">
            <el-radio-group v-model="data.dataFrequency">
              <el-radio v-for="item in globalDictMap('1009')" :key="item.code" :label="item.code"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-slot:flow="{ data, rowItem }">
          <el-form-item v-if="data.dataFrequency !== '1'" :label="rowItem.label" class="formItem">
            <el-select v-model="data.incompleteCycle" placeholder="请选择">
              <el-option
                v-for="item in globalDictMap('1011')"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:rose="{ data, rowItem }" class="formItem">
          <el-form-item v-if="data.dataFrequency !== '1'" :label="rowItem.label">
            <el-radio-group v-model="data.statisMode">
              <el-radio v-for="item in globalDictMap('1010')" :key="item.code" :label="item.code"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </BaseForm>
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
                  @input="inputFor(yminValue, 'yminValue')"
                ></el-input>
                —
                <el-input
                  v-model="ymaxValue"
                  :disabled="!canQuery"
                  placeholder="请输入上限"
                  @input="inputFor(ymaxValue, 'ymaxValue')"
                ></el-input>
                <el-button type="primary" :disabled="!canQuery" @click="onRefresht">刷新</el-button>
                <el-switch
                  v-model="remoCurveName"
                  :disabled="!canQuery"
                  inactive-text="隐藏自定义曲线创建人后缀"
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
          v-else-if="activeTab === '2'"
          :table-data="morphologyTableData"
          :table-column="morphologyColumns"
          :table-height="'600px'"
          has-pagination
          :page-size="1"
          :current-page="table.currentPage"
          :total="table.total"
          :loading="hideTableList"
          :page-sizes="[20, 50, 100]"
          @handleCurrent="handleCurrent"
          @handleSize="handleSizeChange"
        >
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
import { formData, tabList, morphologyColumns, renderFrom } from './lib/data'
import FormData from '@components/FormData'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import * as service from '@api/curvefitting'
import * as serviceMang from '@api/curveManagement'
import * as servicRou from '@api/curveRoule'
import { graphicTitle, curveTitle, dropdownList } from '@utils/message'
import { baseDownLoad, compare, initData, isEmpty } from '@utils/util'
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'CurvefittingAnalysis',
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
      beforeTitle: '曲线利率走势分析',
      activeTab: '1',
      tabList,
      morphologyColumns,
      morphologyTableData: [],
      dialogShow: false, // 弹窗状态
      formData,
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 18
      },
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
      IsScatterEchart: false,
      canQuery: false,
      hideScatterEchart: false,
      hideTableList: false,
      remoCurveName: false,
      ymaxValue: '',
      yminValue: '',
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 600,
      dropdownList,
      dropdownLabel: '原始比例',
      analysisKey: 1
    }
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
    this.initDict()
  },
  activated() {
    let info = localStorage.getItem('analysis')
    if (JSON.stringify(info) !== undefined) {
      let infoList = JSON.parse(info)
      if (infoList) {
        const { beginDate, endDate } = infoList
        this.analysisKey++
        this.shuttleEnclosure = [infoList]
        this.$refs.BeseShuttleBox.rigthList = [infoList]
        this.$refs.BeseShuttleBox.selectedData = [infoList]
        renderFrom[0].initValue = beginDate
        renderFrom[1].initValue = endDate
        this.$set(this.formData, 'renderFrom', renderFrom)
        this.$set(this.formData, 'initData', initData(renderFrom))
        this.getQueryForm(formData.initData)
      }
    }
  },
  methods: {
    inputFor(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
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
          this.initData.data[2].options = curveList
          res.data.curveList.forEach(element => {
            const {
              name,
              code,
              defaultCode,
              curveSectionPeriodMax,
              curveSectionPeriodMin
            } = element
            this.shuttleData.push({
              remainPeriod: '',
              loading: true,
              timeSelect: true,
              check: false,
              curveName: name,
              curveId: code,
              curveSectionPeriodMin: curveSectionPeriodMin,
              curveSectionPeriodMax: curveSectionPeriodMax,
              curveType: defaultCode,
              dicList: []
            })
          })
        }
      })
    },
    onEmpty(val) {
      this.shuttleEnclosure = val
    },
    onTrigger(val, item) {
      const { key } = item
      if (key === 'curveTp') {
        this.initData.form.curveType = val
        this.initData.form.curveCreatePrsnList = []
        this.initData.form.curveList = []
        this.initData.creater = []
        this.initData.curveName = []
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
        ...this.initData.form
      }
      this.$refs.BeseShuttleBox.onlefSearchList = true
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res && res.status === 200) {
          res.data.curveList.forEach(element => {
            const {
              name,
              code,
              defaultCode,
              curveSectionPeriodMin,
              curveSectionPeriodMax
            } = element
            this.shuttleData.push({
              remainPeriod: '',
              loading: true,
              timeSelect: true,
              check: false,
              curveName: name,
              curveId: code,
              curveType: defaultCode,
              curveSectionPeriodMin: curveSectionPeriodMin,
              curveSectionPeriodMax: curveSectionPeriodMax,
              dicList: []
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
        if (data.name === '2') {
          this.morphology()
        } else {
          this.init()
        }
      }
    }, // tab切换
    handleSizeChange(v) {
      this.table.pageSize = v
      this.table.currentPage = 1
      this.morphology()
    },
    handleCurrent(v) {
      this.table.currentPage = v
      this.morphology()
    },
    init() {
      const {
        rateOrInterMargin,
        risklessInterRates,
        beginDate,
        endDate,
        dataFrequency,
        incompleteCycle,
        statisMode
      } = this.ruleForm
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
        curveVOs: this.shuttleEnclosure,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        dataFrequency: dataFrequency,
        incompleteCycle: dataFrequency === '1' ? '' : incompleteCycle,
        statisMode: dataFrequency === '1' ? '' : statisMode,
        pageType: '3',
        remoCurveName: this.remoCurveName ? 1 : 0,
        ymaxValue: this.ymaxValue,
        yminValue: this.yminValue
      }
      this.hideScatterEchart = true
      service
        .pointLineAnalQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            this.IsScatterEchart = false
            const { lineList, lineListName, scatterList, scatterListName } = res.data
            const data = {
              configuration: {
                xAxisName: '日期',
                yAxisName: rateOrInterMargin === '1' ? '收益率/%' : '利差/BP',
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
                legendShowType: 'plain',
                scatterListName: scatterListName,
                lineListName: lineListName,
                seriesType: 'line',
                seriesSmooth: true,
                bottomGrid: '10%',
                leftGrid: '10%',
                rightGrid: '10%',
                legendShowBottom: '2%',
                topGrid: '10%',
                yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                lineList: lineList,
                scatterList: scatterList,
                scatterTooltipTriggr: 'axis',
                handleFormatter: this.handleFormatter
              }
            }
            this.IsScatterEchart = true
            this.$nextTick(() => {
              this.$refs.ScatterEchartRef.init(data)
            })
            this.hideScatterEchart = false
          } else {
            this.hideScatterEchart = false
            this.IsScatterEchart = false
          }
        })
        .catch(() => {
          this.hideScatterEchart = false
          this.IsScatterEchart = false
        })
    },
    handleFormatter(params) {
      let str = ''
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        const { rateOrInterMargin } = this.ruleForm
        if (componentSubType === 'line') {
          if (data[2] !== undefined || data[6] !== undefined || data[5] !== undefined) {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/(含权)剩余期限${data[5]}年/${
              rateOrInterMargin === '1' ? '收益率:' : '利差:'
            }${data[6]}<span><br>`
          } else {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>暂无数据<span><br>`
          }
        }
      })
      return `日期:` + params[0].axisValue + `<br>` + str
    },
    morphology() {
      this.morphologyColumns = []
      this.morphologyTableData = []
      const {
        rateOrInterMargin,
        risklessInterRates,
        beginDate,
        endDate,
        dataFrequency,
        incompleteCycle,
        statisMode
      } = this.ruleForm
      const params = {
        beginDate: beginDate,
        endDate: endDate,
        curveVOs: this.shuttleEnclosure,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        dataFrequency: dataFrequency,
        incompleteCycle: dataFrequency === '1' ? '' : incompleteCycle,
        statisMode: dataFrequency === '1' ? '' : statisMode,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        pageType: '3'
      }
      this.hideTableList = true
      service
        .modtQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            const { describe, analRowData, modtColumnVo, total } = res.data
            this.morphologyTableData = analRowData
            this.table.total = total
            this.morphologyColumns = [
              { name: describe || '曲线数据', prop: '', children: modtColumnVo }
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
    submitForm(val) {
      this.shuttleEnclosure = val
    }, // 弹窗保存
    deleteItem(val) {
      this.shuttleEnclosure = val
    }, // 删除某条数据，暂时删除数据未确定怎样操作流程
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
        this.morphology()
      }
    },
    diagram() {
      if (this.IsScatterEchart === true && this.activeTab === '1') {
        this.$refs.ScatterEchartRef.download()
      } else {
        this.$message({
          message: graphicTitle,
          type: 'warning'
        })
      }
    },
    exportData() {
      if (this.shuttleEnclosure.length === 0) {
        this.$message({
          message: curveTitle,
          type: 'warning'
        })
        return
      }
      const {
        rateOrInterMargin,
        risklessInterRates,
        beginDate,
        endDate,
        dataFrequency,
        incompleteCycle,
        statisMode
      } = this.ruleForm
      const data = {
        beginDate: beginDate,
        endDate: endDate,
        curveVOs: this.shuttleEnclosure,
        rateOrInterMargin: rateOrInterMargin,
        risklessInterRates: risklessInterRates,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        scatterRemainPeriod: '',
        pageType: '3',
        yesConfirm: true,
        dataFrequency: dataFrequency,
        incompleteCycle: incompleteCycle,
        statisMode: statisMode
      }
      if (this.canQuery) {
        baseDownLoad(service.treCruveAnalExcel, data)
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
      width: 100%;
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
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .el-radio {
  margin-right: 10px !important;
}
</style>
