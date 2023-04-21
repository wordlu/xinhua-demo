<template>
  <!-- 单一主体标准估值 - 利率期限结构 -->
  <div>
    <BaseForm
      :form-data="formData"
      :label-width="140"
      :set-options="setOptions"
      @queryForm="queryForm"
      @exportForm="exportForm"
      @exportEchart="exportEchart"
      @trigger="trigger"
      @getRemoteMethod="getRemoteMethod"
      @selectVisible="baseSelectVisible"
      @exportCheckData="exportCheckData"
    ></BaseForm>

    <el-row class="container mt20">
      <el-col :span="14">
        <div class="content border-line">
          <TabPane
            v-model="activeTab"
            :tab-list="tabData"
            :default-name="activeTab"
            @handleTabChange="handleTabOnChange"
          />
          <div v-if="activeTab === 'Echarts'" class="proportionL">
            <div class="inputNumber">
              <el-form label-width="90px">
                <el-form-item label="Y轴区间(%):">
                  <el-input
                    v-model="yMinValue"
                    :disabled="inputDisabled"
                    placeholder="请输入下限"
                    @input="inputFormat(yMinValue, 'yMinValue')"
                  ></el-input>
                  —
                  <el-input
                    v-model="yMaxValue"
                    placeholder="请输入上限"
                    :disabled="inputDisabled"
                    @input="inputFormat(yMaxValue, 'yMaxValue')"
                  ></el-input>
                  <el-button :disabled="inputDisabled" type="primary" @click="onRefresht"
                    >刷新</el-button
                  >
                  <el-dropdown vtrigger="click">
                    <el-button :disabled="inputDisabled"
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
          </div>
          <div
            v-if="activeTab === 'Echarts'"
            v-loading="ecahrtLoading"
            class="content"
            :style="`height:${echartHeight}px;`"
          >
            <ScatterEchart
              v-if="IsScatterEchart"
              ref="ScatterEchartRef"
              :is-id="'ScatterEchartTerm'"
              :width="echartWidth"
              :height="echartHeight"
            ></ScatterEchart>
          </div>
          <template v-else>
            <div v-if="activeTab === 'Curve'" class="ml10">
              <el-radio-group v-model="radio" @change="handleRadioChanges">
                <el-radio
                  v-for="item in radioList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
              <span class="ml10 title"
                >关键点包括：0.25年、1至10年内的所有整数年、15年、20年、30年、50年</span
              >
            </div>
            <BaseTable
              v-if="activeTab !== 'CurveParam'"
              :key="baseKeyOne"
              :columns="getColumns"
              has-pagination
              :current-page="table.pageNum"
              :total="table.total"
              :page-size="table.pageSize"
              :page-sizes="[100, 200, 300]"
              :data-source="dataList"
              :loading="listLoading"
              @handleCurrent="handleCurrent"
              @handleSize="handleSize"
            />
            <BaseTable
              v-else
              :key="baseKeyTwo"
              :columns="getColumns"
              :has-pagination="false"
              :data-source="dataList"
              :loading="listLoading"
            />
          </template>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="mt10">
          <el-row type="flex">
            <el-col :span="10">
              <InnerTable
                :table-data="sideDataList"
                :columns="columnsSideOne"
                :loading="sideListLoading"
              ></InnerTable>
            </el-col>
            <el-col :span="14">
              <BaseTable
                class="fixdTable"
                :columns="columnsSideTwo"
                :height="350"
                :has-pagination="false"
                :data-source="sideDataListTwo"
                :loading="sideTwoListLoading"
              />
              <div class="ml10 mt25">
                <el-form :model="sideForm" :rules="sideFormRules" inline class="ml10">
                  <el-form-item label="剩余期限" prop="period">
                    <el-input v-model="sideForm.period" :maxlength="10" class="txYield">
                      <template slot="append"
                        >年</template
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item class="sideBtn">
                    <el-button :disabled="hasSearch" type="primary" @click="periodSearch"
                      >查询</el-button
                    >
                  </el-form-item>
                  <div>
                    <el-form-item label="收益率" label-width="68px">
                      <el-input v-model="txYield" readonly class="txYield">
                        <template slot="append"
                          >%</template
                        >
                      </el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BaseForm from '@components/BaseForm/index.vue'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import InnerTable from '../../../components/innerTabe.vue'
import {
  formData,
  tabData,
  columnsScatter,
  columnsCurve,
  columnsCurveParam,
  columnsSideTwo
} from '../libs/termData'
import { dropdownList } from '@utils/message'
import InitData from '../../../mixins/initData.mixin'
import { removeNullInObject, handleColumns, compare, baseDownLoad, isEmpty } from '@utils/util'
import * as service from '@api/valuation/standard.js'
import { baseEchartsInfo } from '../../../libs/common'
import { throttle } from 'lodash'

export default {
  components: {
    BaseForm,
    TabPane,
    BaseTable,
    ScatterEchart,
    InnerTable
  },
  mixins: [InitData],
  data() {
    const validatePeriod = (rule, value, callback) => {
      if (value !== '') {
        var reg = /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/
        var isMoneyFormatRight = reg.test(value)
        if (isMoneyFormatRight) {
          callback()
        } else {
          callback(new Error('请保留小数点后两位'))
        }
      } else {
        callback()
      }
    }
    return {
      formData,
      tabData,
      columnsScatter,
      columnsCurve,
      columnsCurveParam,
      columnsSideOne: [
        {
          label: '',
          prop: 'name',
          align: 'center'
        },
        {
          label: '',
          prop: 'code',
          align: 'center'
        }
      ],
      columnsSideTwo,
      setOptions: {},
      activeTab: 'Echarts',
      sideDataList: [],
      sideDataListTwo: [],
      sideForm: {
        period: 3
      },
      dataList: [],
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      sideFormRules: {
        period: [{ validator: validatePeriod, trigger: 'blur' }]
      },
      listLoading: false,
      sideListLoading: false,
      sideTwoListLoading: false,
      ecahrtLoading: false,
      searchParams: {},
      getColumns: [],
      baseKeyOne: 0,
      baseKeyTwo: 10,
      txYield: '', // 收益率
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
      echartsHasData: false,
      yMaxValue: null,
      yMinValue: null,
      inputDisabled: true,
      echartsData: {},
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 938,
      echartOriginalHeight: 500,
      dropdownList,
      dropdownLabel: '原始比例',
      IsScatterEchart: false
    }
  },
  computed: {
    hasSearch() {
      return !(Object.keys(this.searchParams).length > 0)
    }
  },
  activated() {
    if (Object.keys(this.echartsData).length > 0) {
      this.activeTab === 'Echarts' && this.handleEchartsData(this.echartsData)
    }
  },
  beforeDestroy() {
    this.echartsData = {}
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
  },
  methods: {
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    handleTabOnChange(data) {
      this.activeTab = data.name
      this.baseKeyOne++
      this.baseKeyTwo++
      if (Object.keys(this.searchParams).length > 0) {
        if (this.activeTab === 'Curve') {
          this.handleRadioChanges(this.radio)
        } else {
          this.initTableParams()
          this.getData()
        }
      }
    },
    initTableParams() {
      this.table.pageNum = 1
      this.table.pageSize = 100
    },
    async queryForm(initData) {
      this.searchParams = removeNullInObject(initData)
      if (Object.keys(this.searchParams).length > 0) {
        this.initTableParams()
        this.inputDisabled = true
        this.yMaxValue = null
        this.yMinValue = null
        let rt = this.activeTab === 'Curve' ? await this.getData(this.radio) : await this.getData()
        if (rt === 'ok') {
          this.getTotalData()
          this.periodSearch()
        }
      }
    },
    onRefresht: throttle(function() {
      if (this.yMinValue && this.yMaxValue) {
        if (Number(this.yMinValue) > Number(this.yMaxValue)) {
          this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
          return false
        }
      } else if (isEmpty(this.yMinValue) && isEmpty(this.yMaxValue)) {
        this.getData()
        return
      } else {
        this.$message.warning('请完善Y轴上限或下限')
        return false
      }
      this.getData()
    }, 1000),
    getData(val) {
      return new Promise((resolve, reject) => {
        this.dataList = []
        this.getColumns = []
        let params = { ...this.searchParams }
        if (this.activeTab === 'Echarts') {
          this.ecahrtLoading = true
          params.yMaxValue = this.yMaxValue
          params.yMinValue = this.yMinValue
        } else {
          this.listLoading = true
          if (this.activeTab !== 'CurveParam') {
            params.pageNum = this.table.pageNum
            params.pageSize = this.table.pageSize
          }
          if (val) params.exportDataStep = val
        }
        params = removeNullInObject(params)
        service[`get${this.activeTab}ListTerm`](params)
          .then(res => {
            this.listLoading = false
            this.ecahrtLoading = false
            if (res && res.status === 200) {
              if (this.activeTab === 'Echarts') {
                this.echartsHasData = true
                this.echartsData = res.data
                this.handleEchartsData(res.data)
              } else {
                this.getColumns = this[`columns${this.activeTab}`]
                const { list, total, fieldHead, fieldValues } = res.data
                if (this.activeTab === 'Scatter') {
                  this.getColumns[0].label = list[0].orgName
                } else if (this.activeTab === 'Curve') {
                  this.getColumns = handleColumns(fieldHead)
                }
                this.dataList =
                  this.activeTab === 'CurveParam'
                    ? res.data
                    : this.activeTab === 'Curve'
                    ? fieldValues
                    : list
                this.table.total = total || 0
              }
              resolve('ok')
            } else {
              this.sideDataList = []
              this.sideDataListTwo = []
              this.dataList = []
              this.table.total = 0
              this.echartsHasData = false
            }
          })
          .catch(() => {
            this.listLoading = false
            this.ecahrtLoading = false
          })
      })
    },
    handleCurrent(page) {
      this.table.pageNum = page
      this.getData()
    },
    handleSize(size) {
      this.table.pageSize = size
      this.table.pageNum = 1
      this.getData()
    },
    handleEchartsData(res) {
      const {
        lineList,
        lineListName,
        scatterList,
        scatterSumList,
        ymax,
        ymin,
        sampleSizeMessage
      } = res
      if (sampleSizeMessage) {
        this.$message.warning('注意：' + sampleSizeMessage)
      }
      this.inputDisabled = false
      this.IsScatterEchart = false
      const data = {
        configuration: {
          ...baseEchartsInfo,
          optionTitle: '■方形点：虚拟样本点、●圆形点：其余真实成交点',
          legendShowType: 'plain',
          yAxisMax: ymax,
          yAxisMin: ymin,
          bottomGrid: this.calculate(lineListName),
          leftGrid: '5%',
          rightGrid: '12%',
          legendShowBottom: '8%',
          topGrid: '10%',
          xAxisType: 'value',
          yAxisType: 'value',
          xAxisName: '剩余期限/年',
          yAxisName: '收益率(%)',
          scatterListName: ['散点'],
          lineListName: lineListName,
          lineStyle: this.handleLineStyle,
          lineList: lineList,
          scatterList: [scatterList],
          scatterSumList: [scatterSumList],
          scatterSumListName: ['投射-散点'],
          // scatterTooltipTriggr: 'axis',
          scatterReferList: [
            {
              type: 'scatter',
              markLine: {
                symbol: 'none',
                data: [
                  {
                    name: '剩余期限3年',
                    xAxis: 3,
                    lineStyle: {
                      color: '#000'
                    }
                  }
                ]
              }
            }
          ],
          scatterSymbol: this.scatterSymbol,
          handleFormatter: this.handleFormatter,
          handleScatterFormatter: this.handleScatterFormatter,
          handleSumListFormatter: this.scatterSumListFormatter
        }
      }
      this.IsScatterEchart = true
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
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
    handleLineStyle(data) {
      let type = data.length > 0 ? (data[0][2] === 0 ? 'dotted' : 'solid') : 'solid'
      return {
        type,
        width: 3
      }
    },
    scatterSymbol(params) {
      // 散点类型 0 圆形；1 三角形
      return params[3] === 0 ? 'circle' : 'rect'
    },
    scatterSumListFormatter(params) {
      const { data, color } = params
      return `<span>【${this.searchParams.bizDt}】投射至3年期收益率：</span><br>
        <span class="echart-tip-icon" style="background-color:${color};"></span>
        <span>${data[2]} （${data[4]}，${data[5]}年）：${data[1]}%</span><br>`
    },
    handleFormatter(params) {
      let str = ''
      if (params) {
        let arr = params.sort(compare('data', 1))
        arr.map(item => {
          const { data, seriesName, componentSubType, color } = item
          if (componentSubType === 'line') {
            // 曲线
            str += `
            <span class="echart-tip-icon" style="background-color:${color};"></span>
            <span>${seriesName} 【${data[0]}年】${data[1]}%</span><br>`
          } else {
            // 散点
            if (this.searchParams.isOriginalData === '1') {
              // 是原始数据
              str += `
              <span>成交收益率, ${data[0]}年</span><br>
              <span class="echart-tip-icon" style="background-color:${color};"></span>
              <sapn>${data[2]} ${data[4]}：${data[1]}%</sapn><br>`
            } else {
              // 否原始数据
              str += `
              <span>平移至${this.searchParams.bizDt}后收益率, ${data[0]}年</span><br>
              <span class="echart-tip-icon" style="background-color:${color};"></span>
              <sapn>${data[2]} ${data[4]}：${data[1]}%</sapn><br>`
            }
          }
        })
      }
      return str
    },
    handleScatterFormatter(params) {
      let str = ''
      const { data, color } = params
      if (this.searchParams.isOriginalData === '1') {
        // 是原始数据
        str += `
        <span>成交收益率, ${data[0]}年</span><br>
        <span class="echart-tip-icon" style="background-color:${color};"></span>
        <sapn>${data[2]} ${data[4]}：${data[1]}%</sapn><br>`
      } else {
        // 否原始数据
        str += `
        <span>平移至${this.searchParams.bizDt}后收益率, ${data[0]}年</span><br>
        <span class="echart-tip-icon" style="background-color:${color};"></span>
        <sapn>${data[2]} ${data[4]}：${data[1]}%</sapn><br>`
      }
      return str
    },
    // 获取右侧table数据
    getTotalData() {
      this.sideListLoading = true
      service
        .getSumListTerm(this.searchParams)
        .then(res => {
          this.sideListLoading = false
          if (res && res.status === 200) {
            const list = res.data
            this.columnsSideOne[0].label = list[0].name
            this.columnsSideOne[1].label = list[0].code
            this.sideDataList = list.splice(1)
          }
        })
        .catch(() => {
          this.sideListLoading = false
        })
      this.sideTwoListLoading = true
      service
        .getBndListTerm(this.searchParams)
        .then(res => {
          this.sideTwoListLoading = false
          if (res && res.status === 200) {
            this.sideDataListTwo = res.data
          }
        })
        .catch(() => {
          this.sideTwoListLoading = false
        })
    },
    // 输入剩余期限 回显 收益率
    periodSearch() {
      const params = {
        ...this.searchParams,
        ...this.sideForm
      }
      service.getSearchYieldTerm(params).then(res => {
        if (res && res.status === 200) {
          this.txYield = res.data
        }
      })
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        let params = { ...this.searchParams }
        params.exportDataStep = this.radio
        baseDownLoad(service.exportSingleOrgTerm, params)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    exportEchart() {
      if (this.searchParams !== {} && this.activeTab === 'Echarts') {
        this.$refs.ScatterEchartRef.download()
      } else {
        this.$message({
          message: '请在图像模块选择查询数据后在进行导出图形',
          type: 'warning'
        })
      }
    },
    exportCheckData() {
      if (Object.keys(this.searchParams).length > 0) {
        let params = { ...this.searchParams }
        params.exportDataStep = this.radio
        baseDownLoad(service.exportSingleOrgTermCheck, params)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    handleRadioChanges(val) {
      if (Object.keys(this.searchParams).length < 1) {
        return
      }
      this.initTableParams()
      this.getData(val)
    },
    onDropdown(val, max, min) {
      if (!this.inputDisabled) {
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
        this.ecahrtLoading = true
        this.getData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  padding-bottom: 20px;
  background-color: #fff;
}
.mt10 {
  margin-top: -10px;
}
.title {
  font-size: 14px;
  color: #409eff;
}

.proportionL {
  box-sizing: border-box;
  // width: 50%;
  .inputNumber {
    width: 100%;
    padding: 0 10px;
    .el-form-item {
      margin-top: 10px;
      margin-bottom: 10px;
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
.fixdTable {
  ::v-deep.table-wrap {
    padding: 10px 0 10px 10px !important;
  }
}
.txYield {
  ::v-deep.el-input-group__append {
    padding: 0 5px;
  }
}
.sideBtn {
  margin-top: -2px;
}
</style>
