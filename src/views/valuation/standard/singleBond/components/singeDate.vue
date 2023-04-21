<template>
  <!-- 单一日期估值 -->
  <div>
    <BaseForm
      :form-data="formData"
      :label-width="100"
      @queryForm="queryForm"
      @resetForm="resetForm"
      @trigger="trigger"
      @exportForm="exportForm"
      @exportEchart="exportEchart"
      @exportCheckData="exportCheckData"
    >
      <template v-slot:customForm>
        <el-form
          ref="outForm"
          :model="outForm"
          :rules="outRules"
          label-width="100px"
          :validate-on-rule-change="false"
          :show-message="false"
          class="outForm"
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
                <el-form-item label="虚拟券剩余期限:" label-width="130px" prop="period">
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
    <div v-show="echartInitFlag" class="content">
      <div class="proportionL">
        <div class="inputNumber">
          <el-form label-width="90px">
            <el-form-item label="Y轴区间(%):">
              <el-input
                v-model="yMinValue"
                placeholder="请输入下限"
                @input="inputFormat(yMinValue, 'yMinValue')"
              ></el-input>
              —
              <el-input
                v-model="yMaxValue"
                placeholder="请输入上限"
                @input="inputFormat(yMaxValue, 'yMaxValue')"
              ></el-input>
              <el-button type="primary" @click="onRefresht">刷新</el-button>
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
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-loading="echartsLoading" :style="`height:${echartHeight}px;`">
        <ScatterEchart
          v-if="echartsHasData"
          ref="ScatterEchartRef"
          :width="echartWidth"
          :height="echartHeight"
          :is-id="'ScatterEchartSingle'"
        ></ScatterEchart>
      </div>
    </div>
    <div class="background-white">
      <TabPane
        v-model="activeTableTab"
        :tab-list="tabData"
        :default-name="activeTableTab"
        @handleTabChange="handleTabOnChange"
      />

      <BaseTable
        v-if="activeTableTab !== 'Scatter'"
        :columns="getColumns"
        :has-pagination="false"
        :data-source="dataList"
        :loading="listLoading"
      />
      <BaseTable
        v-else
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
    </div>
  </div>
</template>

<script>
import TabPane from '@components/TabPane'
import BaseForm from '@/src/components/BaseForm/index.vue'
import BaseTable from '@components/BaseTable'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import { formData, tabData, columnsTotal, columnsLine, columnsScatter } from '../libs/singleDate'
import InitData from '../../../mixins/initData.mixin'
import { removeNullInObject, compare, baseDownLoad, isEmpty } from '@utils/util'
import * as service from '@api/valuation/standard.js'
import { baseEchartsInfo } from '../../../libs/common'
import { throttle } from 'lodash'
import { dropdownList } from '@utils/message'

export default {
  name: 'SingleBond',
  components: {
    TabPane,
    BaseForm,
    BaseTable,
    ScatterEchart
  },
  mixins: [InitData],
  data() {
    return {
      radio: '1',
      formData,
      activeTableTab: 'Total',
      tabData,
      columnsTotal,
      columnsLine,
      columnsScatter,
      listLoading: false,
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      dataList: [],
      getBndNameList: [],
      getBndCodeList: [],
      getObjNameList: [],
      searchParams: {},
      outForm: {
        orgCd: '',
        bndCode: '',
        bndName: '',
        period: ''
      },
      echartsData: {},
      echartsLoading: false,
      echartInitFlag: false, // echart数据是否获取
      isOk: false,
      period: '',
      echartsHasData: false,
      yMaxValue: null,
      yMinValue: null,
      inputDisabled: true,
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 500,
      dropdownList,
      dropdownLabel: '原始比例'
    }
  },
  computed: {
    getColumns() {
      return this[`columns${this.activeTableTab}`]
    },
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
    }
  },
  activated() {
    if (Object.keys(this.echartsData).length > 0) {
      this.activeTableTab === 'Echarts' && this.handleEchartsData(this.echartsData)
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
    handleTabOnChange(tab) {
      this.activeTableTab = tab.name
      if (Object.keys(this.searchParams).length > 0) {
        this.table.pageNum = 1
        this.getData()
      }
    },
    handleRadioOnChange(val) {
      this.radio = val
      if (val === '1') {
        this.outForm.orgCd = ''
        this.outForm.period = ''
      } else {
        this.outForm.bndCode = ''
        this.outForm.bndName = ''
      }
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    onRefresht: throttle(function() {
      if (this.yMinValue && this.yMaxValue) {
        if (Number(this.yMinValue) > Number(this.yMaxValue)) {
          this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
          return false
        }
      } else if (isEmpty(this.yMinValue) && isEmpty(this.yMaxValue)) {
        this.getEchartsData()
        return
      } else {
        this.$message.warning('请完善Y轴上限或下限')
        return false
      }
      this.getEchartsData()
    }, 2000),
    getEchartsData() {
      return new Promise((resolve, reject) => {
        this.echartsLoading = true
        let params = { ...this.searchParams }
        params.yMaxValue = this.yMaxValue
        params.yMinValue = this.yMinValue
        params = removeNullInObject(params)
        service
          .getSingleDateEcharts(params)
          .then(res => {
            this.echartsLoading = false
            if (res && res.status === 200) {
              resolve('ok')
              this.echartsHasData = true
              this.table.pageNum = 1
              this.echartsData = res.data
              this.handleEchartsData(res.data)
            } else {
              resolve('fail')
              this.echartsHasData = false
              this.echartInitFlag = false
              this.dataList = []
              this.table.total = 0
            }
          })
          .catch(() => {
            resolve('fail')
            this.ecahrtLoading = false
            this.echartsHasData = false
          })
      })
    },
    handleEchartsData(res) {
      const {
        lineList,
        lineListName,
        scatterListName,
        scatterList,
        period,
        boxplotList,
        scatterSumList,
        xdate,
        ymax,
        ymin,
        sampleSizeMessage
      } = res
      const boxList = boxplotList !== null ? boxplotList[0].reverse().map(i => Number(i)) : []
      const scatterListData = scatterList !== null ? [scatterList] : []
      const scatterSumListData = scatterSumList !== null ? [scatterSumList] : []
      this.period = period
      const data = {
        configuration: {
          ...baseEchartsInfo,
          optionTitle: '■方形点：虚拟样本点、●圆形点：其余真实成交点',
          xAxisType: 'category',
          xAxisName: '交易日',
          yAxisType: 'value',
          yAxisName: '收益率(%)',
          xAxis: xdate,
          yAxisMax: ymax,
          yAxisMin: ymin,
          bottomGrid: '15%',
          leftGrid: '5%',
          rightGrid: '10%',
          legendShowBottom: '8%',
          topGrid: '10%',
          scatterListName: scatterListName || [],
          lineListName: lineListName || [],
          lineList: lineList || [],
          handleFormatter: this.handleFormatter,
          handleScatterBoxFormatter: this.handleScatterBoxFormatter,
          scatterTooltipTriggr: 'axis',
          scatterList: scatterListData,
          boxplotList: boxplotList,
          boxplotListName: '投射汇总',
          scatterBoxList: scatterSumListData,
          scatterBoxListName: ['投射汇总-散点'],
          scatterSymbol: this.scatterSymbol,
          dataset: [
            {
              source: [['投射汇总', ...boxList]]
            },
            {
              transform: {
                type: 'boxplot',
                config: { itemNameFormatter: '投射汇总' }
              }
            }
          ]
        }
      }
      if (sampleSizeMessage) {
        this.$message.warning('注意：' + sampleSizeMessage)
      }
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
      })
    },
    handleScatterBoxFormatter(params) {
      // 盒图上的散点悬浮信息
      const { data, color } = params
      let str = `<span>【${this.searchParams.bizDt}】投射至【${this.period}】年</span><br>`
      str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]} （${data[4]} ,${this.period}）：${data[1]}%<span>`
      return str
    },
    handleFormatter(params) {
      let { data } = params[0]
      let str =
        data[0] === '投射汇总' ? '' : `<span>【${data[0]}】投射至【${this.period}】年</span><br>`
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        let { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          // 折线悬浮信息
          str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>内部估值收益率：${data[1]}%<span><br>`
        } else if (componentSubType === 'scatter') {
          // 散点悬浮信息
          str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]} 投射后收益率：${data[1]}%<span><br>`
        } else {
          // 盒图悬浮信息
          const startIcon =
            '<span class="echart-tip-icon mr5" style="background-color:' + color + ';"></span>'
          const sortData = data.filter((ii, iidx) => iidx !== 0).sort((a, b) => b - a)
          const txt = ['最大值', '75分位', '中位值', '25分位', '最小值']
          sortData.map((i, idx) => {
            str += `<span>${startIcon} ${txt[idx]}：${i.toFixed(2)}%</span><br>`
          })
        }
      })
      return str
    },
    scatterSymbol(params) {
      // 散点类型 0 圆形；1 三角形
      let scatterSymbolType = params.length > 0 ? (params[3] === 0 ? 'circle' : 'rect') : 'circle'
      return scatterSymbolType
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
    getData() {
      this.listLoading = true
      this.dataList = []
      let params = { ...this.searchParams }
      if (this.activeTableTab === 'Scatter') {
        params.pageNum = this.table.pageNum
        params.pageSize = this.table.pageSize
      }
      this.columnsLine[2].label =
        this.radio === '1' ? '债项标准估值收益率(%)' : `${this.outForm.period}年标准估值收益率(%)`
      service[`getSingleDate${this.activeTableTab}`](params)
        .then(res => {
          this.listLoading = false
          if (res && res.status === 200) {
            if (this.activeTableTab === 'Scatter') {
              this.dataList = res.data.list
              this.table.total = res.data.total
            } else {
              this.dataList = res.data
            }
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    queryForm(initData) {
      this.$refs.outForm.validate(async valid => {
        if (valid) {
          let params = {}
          if (this.radio === '1') {
            const { bndCode, bndName } = this.outForm
            params = {
              windCd: bndCode || bndName
            }
          } else {
            const { orgCd, period } = this.outForm
            params = { orgCd, period }
          }
          this.searchParams = {
            ...params,
            ...removeNullInObject(initData)
          }
          this.echartInitFlag = true
          this.yMaxValue = null
          this.yMinValue = null
          let rt = await this.getEchartsData()
          if (rt === 'ok') {
            this.getData()
          }
        }
      })
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        baseDownLoad(service.exportSingleDay, this.searchParams)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    exportEchart() {
      if (this.searchParams !== {} && this.echartInitFlag) {
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
        baseDownLoad(service.exportSingleDayCheckData, this.searchParams)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    onDropdown(val, max, min) {
      if (this.echartInitFlag) {
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
        this.echartsHasData = false
        this.echartsLoading = true
        this.getEchartsData()
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
.outForm {
  .el-form-item {
    ::v-deep.el-form-item__error {
      padding-top: 0 !important;
    }
  }
}

.radio-box {
  margin-bottom: 14px;
}
.rightButt {
  text-align: right;
}
.content {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 0 15px;
  padding-bottom: 20px;
  background-color: #fff;
}
.background-white {
  background-color: #fff;
}
.proportionL {
  box-sizing: border-box;
  width: 50%;
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
</style>
