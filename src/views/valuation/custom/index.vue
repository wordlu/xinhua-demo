<template>
  <!-- 自定义曲线估值 -->
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'自定义估值'" />
      <BaseForm
        :form-data="formData"
        :label-width="110"
        :set-options="setOptions"
        @queryForm="queryForm"
        @resetForm="resetForm"
        @trigger="trigger"
        @exportForm="exportForm"
        @exportEchart="exportEchart"
        @getRemoteMethod="getRemoteMethod"
        @exportCheckData="exportCheckData"
      >
        <template v-slot:customForm>
          <el-form
            ref="outForm"
            class="outForm"
            :show-message="false"
            :model="outForm"
            :rules="outRules"
            :validate-on-rule-change="false"
            label-width="100px"
          >
            <div class="custom-form-item mb10 ml5">
              <label
                class="el-radio"
                :class="{ 'is-checked': radio === '1' }"
                @click="handleRadioOnChange('1')"
              >
                <span class="el-radio__input" :class="{ 'is-checked': radio === '1' }">
                  <span class="el-radio__inner"></span>
                  <input value="1" type="radio" class="el-radio__original" />
                </span>
              </label>
              <el-row type="flex" class="input-item">
                <el-col :span="6">
                  <el-form-item label="债券简称:" prop="bndName">
                    <el-select
                      v-model="outForm.bndName"
                      placeholder="请选择"
                      :disabled="radio === '2'"
                      filterable
                      remote
                      clearable
                      collapse-tags
                      :remote-method="val => getCustomRemoteMethod(val, 'bndName')"
                      reserve-keyword
                      @change="triggerCustom(outForm, 'bndName')"
                      @visible-change="val => selectVisible(val, 'bndName')"
                    >
                      <el-option
                        v-for="item in getBndNameList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="债券代码:" prop="bndCode">
                    <el-select
                      v-model="outForm.bndCode"
                      :disabled="radio === '2'"
                      placeholder="请选择"
                      filterable
                      remote
                      clearable
                      collapse-tags
                      :remote-method="val => getCustomRemoteMethod(val, 'bndCode')"
                      reserve-keyword
                      @change="triggerCustom(outForm, 'bndCode')"
                      @visible-change="val => selectVisible(val, 'bndCode')"
                    >
                      <el-option
                        v-for="item in getBndCodeList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="custom-form-item mb10 ml5">
              <label
                class="el-radio"
                :class="{ 'is-checked': radio === '2' }"
                @click="handleRadioOnChange('2')"
              >
                <span class="el-radio__input" :class="{ 'is-checked': radio === '2' }">
                  <span class="el-radio__inner"></span>
                  <input value="2" type="radio" class="el-radio__original" />
                </span>
              </label>
              <el-row type="flex" class="input-item">
                <el-col :span="6">
                  <el-form-item label="主体名称:" prop="orgCd">
                    <el-select
                      v-model="outForm.orgCd"
                      placeholder="请选择"
                      :disabled="radio === '1'"
                      filterable
                      remote
                      clearable
                      collapse-tags
                      :remote-method="val => getCustomRemoteMethod(val, 'orgCd')"
                      reserve-keyword
                      @change="triggerCustom(outForm, 'orgCd')"
                      @visible-change="val => selectVisible(val, 'orgCd')"
                    >
                      <el-option
                        v-for="item in getObjNameList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="剩余期限:" prop="period">
                    <el-input v-model="outForm.period" :maxlength="10" :disabled="radio === '1'">
                      <template slot="append"
                        >年</template
                      >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </template>
      </BaseForm>
      <el-row class="container">
        <el-col :span="14">
          <div class="content border-line">
            <TabPane
              v-model="activeTableTab"
              :tab-list="tabData"
              :default-name="activeTableTab"
              @handleTabChange="handleTabOnChange"
            />
            <div v-if="activeTableTab === 'Echarts'" class="proportionL">
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
              v-if="activeTableTab === 'Echarts'"
              v-loading="ecahrtLoading"
              :style="`height:${echartHeight}px;`"
            >
              <ScatterEchart
                v-if="echartHasData"
                ref="ScatterEchartRef"
                :is-id="'ScatterEchart'"
                :width="echartWidth"
                :height="echartHeight"
              ></ScatterEchart>
            </div>
            <template v-else>
              <div v-if="activeTableTab === 'Curve'" class="ml10">
                <el-radio-group v-model="curveRadio" @change="handleRadioChanges">
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
                v-if="activeTableTab === 'CurveParams'"
                :key="baseKey"
                :columns="getColumns"
                :has-pagination="false"
                :data-source="dataList"
                :loading="listLoading"
              />
              <BaseTable
                v-else
                :key="baseKey2"
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
            </template>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="mt10">
            <el-row>
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
                  <el-form :model="sideForm" :rules="sideFormRules" inline>
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
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import TabPane from '@components/TabPane'
import BaseForm from '@/src/components/BaseForm/index.vue'
import BaseTable from '@components/BaseTable'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import InnerTable from '../components/innerTabe.vue'
import { formData, tabData, columnsScatter, columnsCurve, columnsCurveParams } from './libs/data'
import { columnsSideTwo } from '../standard/singleSubject/libs/termData'
import { removeNullInObject, compare, baseDownLoad, isEmpty } from '@utils/util'
import InitData from '../mixins/initData.mixin'
import * as service from '@api/valuation/custom.js'
import { baseEchartsInfo } from '../libs/common'
import keepMixin from '@mixins/keep.mixin'
import { dropdownList } from '@utils/message'
export default {
  name: 'Custom',
  components: {
    BeforeLineTitle,
    TabPane,
    BaseForm,
    BaseTable,
    ScatterEchart,
    InnerTable
  },
  mixins: [InitData, keepMixin],
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
      setOptions: {},
      radio: '1',
      activeTableTab: 'Echarts',
      tabData,
      columnsScatter,
      columnsCurve,
      columnsCurveParams,
      dataList: [],
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      getBndNameList: [],
      getBndCodeList: [],
      getObjNameList: [],
      // 侧边table
      sideDataList: [],
      sideDataListTwo: [],
      outForm: {
        orgCd: '',
        bndCode: '',
        bndName: '',
        period: ''
      },
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
      sideForm: {
        period: 3
      },
      sideFormRules: {
        period: [{ validator: validatePeriod, trigger: 'blur' }]
      },
      searchParams: {},
      listLoading: false,
      ecahrtLoading: false,
      sideListLoading: false,
      sideTwoListLoading: false,
      btnLoading: false,
      txYield: '',
      medianValue: null,
      getColumns: [],
      baseKey: 0,
      baseKey2: 10,
      curveRadio: '3',
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
      echartHasData: false,
      yMaxValue: null,
      yMinValue: null,
      inputDisabled: true,
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 938,
      echartOriginalHeight: 500,
      dropdownList,
      dropdownLabel: '原始比例',
      failDownload: {}
    }
  },
  computed: {
    outRules() {
      let rules = {}
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
          callback(new Error('剩余期限不能为空'))
        }
      }
      if (this.radio === '2') {
        rules = {
          orgCd: [{ required: true, message: '主体名称不能为空', trigger: 'change' }],
          period: [{ validator: validatePeriod, required: true, trigger: 'blur' }]
        }
      } else {
        rules = {
          bndName: [{ required: true, message: '债券简称不能为空', trigger: 'change' }]
        }
      }
      return rules
    },
    hasSearch() {
      return !(Object.keys(this.searchParams).length > 0)
    }
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
  },
  methods: {
    handleTabOnChange(tab) {
      this.activeTableTab = tab.name
      this.baseKey++
      this.baseKey2++
      if (Object.keys(this.searchParams).length > 0) {
        if (this.activeTableTab === 'Curve') {
          this.handleRadioChanges(this.curveRadio)
        } else {
          this.initTableParams()
          this.getData()
        }
      }
    },
    handleRadioOnChange(val) {
      this.radio = val
      if (this.radio === '1') {
        this.outForm.orgCd = ''
        this.outForm.period = ''
      } else {
        this.outForm.bndCode = ''
        this.outForm.bndName = ''
      }
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
    queryForm(initData) {
      this.$refs.outForm.validate(async valid => {
        if (valid) {
          let params = {}
          if (this.radio === '1') {
            const { bndCode, bndName } = this.outForm
            params = {
              windCd: bndCode || bndName,
              bndAbbrnm: this.getBndNameList[0].name
            }
          } else {
            const { orgCd, period } = this.outForm
            params = { orgCd, period }
          }
          this.searchParams = {
            ...params,
            ...removeNullInObject(initData)
          }
          if (Object.keys(this.searchParams).length > 0) {
            this.initTableParams()
            let rt
            if (this.activeTableTab === 'Curve') {
              rt = await this.getData(this.curveRadio)
            } else {
              this.yMaxValue = null
              this.yMinValue = null
              rt = await this.getData()
            }
            if (rt === 'ok') {
              this.getTotalData()
              this.periodSearch()
            }
          }
        }
      })
    },
    onRefresht() {
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
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    getData(val) {
      return new Promise((resolve, reject) => {
        this.dataList = []
        this.getColumns = []
        let params = { ...this.searchParams }
        if (this.activeTableTab === 'Echarts') {
          this.ecahrtLoading = true
          params.yMaxValue = this.yMaxValue
          params.yMinValue = this.yMinValue
        } else {
          this.listLoading = true
          params.pageNum = this.table.pageNum
          params.pageSize = this.table.pageSize
          if (val) params.exportDataStep = val
        }
        params = removeNullInObject(params)
        service[`get${this.activeTableTab}ListCustom`](params)
          .then(res => {
            this.listLoading = false
            this.ecahrtLoading = false
            const { status, data, message } = res
            if (res && status === 200) {
              this.failDownload.isAllow = true
              if (this.activeTableTab === 'Echarts') {
                this.echartHasData = true
                this.medianValue = data.medianValue
                this.handleEchartsData(data)
              } else {
                this.getColumns = this[`columns${this.activeTableTab}`]
                const { list, total } = data
                if (this.activeTableTab === 'Scatter') {
                  this.getColumns[0].label = list[0].orgName
                }
                this.dataList = this.activeTableTab === 'CurveParams' ? data : list
                this.table.total = total || 0
              }
              resolve('ok')
            } else {
              this.sideDataList = []
              this.sideDataListTwo = []
              this.dataList = []
              this.table.total = 0
              this.echartHasData = false
              this.failDownload.isAllow = false
              this.failDownload.message = `${message}，请重新查询后再导出`
            }
          })
          .catch(() => {
            this.listLoading = false
            this.ecahrtLoading = false
          })
      })
    },
    initTableParams() {
      this.table.pageNum = 1
      this.table.pageSize = 100
    },
    handleEchartsData(res) {
      this.inputDisabled = false
      const { lineList, lineListName, scatterList = [], sampleSizeMessage } = res
      const scatterListName = scatterList.length > 0 ? ['散点'] : []
      const data = {
        configuration: {
          ...baseEchartsInfo,
          optionTitle: '■方形点：虚拟样本点、●圆形点：其余真实成交点',
          xAxisType: 'value',
          yAxisType: 'value',
          xAxisName: '剩余期限/年',
          yAxisName: '收益率(%)',
          bottomGrid: '15%',
          leftGrid: '5%',
          rightGrid: '12%',
          legendShowBottom: '8%',
          topGrid: '10%',
          yAxisMax: this.yMaxValue === '' || this.yMaxValue === null ? undefined : this.yMaxValue,
          yAxisMin: this.yMinValue === '' || this.yMinValue === null ? undefined : this.yMinValue,
          scatterListName: scatterListName,
          lineListName: lineListName,
          lineList: lineList,
          scatterList: [scatterList],
          scatterTooltipTriggr: 'axis',
          scatterSymbol: this.scatterSymbol,
          handleFormatter: this.handleFormatter
        }
      }
      if (sampleSizeMessage) {
        this.$message.warning('注意：' + sampleSizeMessage)
      }
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
      })
    },
    scatterSymbol(params) {
      // 散点类型 0 圆形；1 三角形
      let scatterSymbolType = params.length > 0 ? (params[4] === 0 ? 'circle' : 'rect') : 'circle'
      return scatterSymbolType
    },
    handleFormatter(params) {
      const { data } = params[0]
      let str = `<span>剩余期限：${data[0]}年</span><br>`
      if (params) {
        const arr = params.sort(compare('data', 1))
        arr.map(item => {
          const { data, seriesType, seriesName, color } = item
          if (seriesType === 'line') {
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
            <span>${seriesName}： ${data[1]}%</span><br>`
          } else {
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
            <span>${data[2]}(${data[3]}) 成交收益率：${data[1]}%</span><br>`
          }
        })
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
        ...this.sideForm,
        medianValue: this.medianValue
      }
      this.btnLoading = true
      service
        .searchYieldTerm(params)
        .then(res => {
          this.btnLoading = false
          if (res && res.status === 200) {
            this.txYield = res.data
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        let params = { ...this.searchParams }
        params.exportDataStep = this.curveRadio
        baseDownLoad(service.exportSustomValuation, params, null, this.failDownload)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    exportEchart() {
      if (this.searchParams !== {} && this.activeTableTab === 'Echarts') {
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
        params.exportDataStep = this.curveRadio
        baseDownLoad(service.exportSustomValuationCheck, params, null, this.failDownload)
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
        this.echartHasData = false
        this.ecahrtLoading = true
        this.getData()
      }
    },
    resetForm() {
      this.outForm = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-form-item {
  display: flex;
  align-items: center;
  .el-radio {
    margin-right: 0;
  }
  .input-item {
    flex: 1;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
  .el-select {
    width: 100%;
  }
}
.curveItem {
  margin-bottom: 10px;
}
.radio-box {
  margin-bottom: 14px;
}
.rightButt {
  text-align: right;
}
.container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  padding-bottom: 20px;
  background-color: #fff;
}
.echarts-box {
  width: 100%;
  height: 500px;
}
.mt10 {
  margin-top: -10px;
}
.el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 8px;
  vertical-align: top;
}
.outForm {
  .el-form-item {
    ::v-deep.el-form-item__error {
      padding-top: 0 !important;
    }
  }
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
    width: 120px !important;
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
  ::v-deep .el-form-item__content {
    width: 100%;
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
