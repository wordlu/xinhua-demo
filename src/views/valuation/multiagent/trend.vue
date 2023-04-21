<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'多主体利率走势分析'" />
      <BaseSelect
        ref="select"
        :options="selectData"
        @handleEmpty="handleEmpty"
        @deleteItem="deleteItem"
        @getTransferData="getTransferData"
        @getItemRemoteMethod="getItemRemoteMethod"
        @trigger="selectTrigger"
        @handleDialogClose="close"
        @importDialogSure="importDialogSure"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @blurValue="blurValue"
        @selectPageChange="selectPageChange"
        @resetForm="resetFormOrg"
      >
        <template v-slot:customTransfer="{ transferData, selectedData, total }">
          <!-- 自定义穿梭框 -->
          <CustomTransfer
            ref="customTransfer"
            :transfer-data="transferData"
            :selected-data="selectedData"
            :total="total"
            @getResult="getResult"
            @handleCurrentChange="handleCurrentChange"
            @searchInputLeft="searchInputLeft"
          ></CustomTransfer>
        </template>
        <template v-slot:footer>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </template>
      </BaseSelect>
      <BaseForm
        :form-data="outTrendFormData"
        :label-width="130"
        @queryForm="queryForm"
        @resetForm="resetForm"
        @exportForm="exportForm"
        @exportEchart="exportEchart"
      >
        <template v-slot:risklessRate="{ data, rowItem }">
          <el-form-item
            v-if="data.rateOrInterMargin === '2'"
            :label="rowItem.label"
            class="formItem"
          >
            <el-select v-model="data.risklessRate" placeholder="请选择">
              <el-option
                v-for="item in rowItem.options"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:dataFrequence="{ data, rowItem }">
          <el-form-item :label="rowItem.label" class="formItem">
            <el-radio-group v-model="data.dataFrequence">
              <el-radio v-for="item in rowItem.options" :key="item.code" :label="item.code"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-slot:useIncompleteCycle="{ data, rowItem }">
          <el-form-item v-if="data.dataFrequence !== '1'" :label="rowItem.label" class="formItem">
            <el-select v-model="data.useIncompleteCycle" placeholder="请选择">
              <el-option
                v-for="item in rowItem.options"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:statisMode="{ data, rowItem }" class="formItem">
          <el-form-item v-if="data.dataFrequence !== '1'" :label="rowItem.label">
            <el-radio-group v-model="data.statisMode">
              <el-radio v-for="item in rowItem.options" :key="item.code" :label="item.code"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </BaseForm>

      <div class="border-line ml10 mr10">
        <TabPane
          v-model="activeTab"
          :tab-list="tabDataTrend"
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
            :is-id="'ScatterEchart'"
            :width="echartWidth"
            :height="echartHeight"
            class="pd20"
          ></ScatterEchart>
        </div>
        <BaseTable
          v-else
          :columns="columnsScatterData"
          has-pagination
          :current-page="table.pageNum"
          :total="table.total"
          :page-size="table.pageSize"
          :page-sizes="[100, 200, 300]"
          :data-source="dataList"
          :loading="listLoading"
          @handleCurrent="handleCurrent"
          @handleSize="handleSize"
        ></BaseTable>
      </div>
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseSelect from '@components/BaseSelect'
import { outTrendFormData, tabDataTrend } from './libs/outsideForm'
import BaseForm from '@components/BaseForm'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import CustomTransfer from './components/customTransfer.vue'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import initDictMixin from './mixins/initData.mixin'
import {
  removeNullInObject,
  handleColumns,
  compare,
  baseDownLoad,
  initData,
  isEmpty
} from '@utils/util'
import * as service from '@api/valuation/multiagent.js'
import { baseEchartsInfo } from '../libs/common'
import keepMixin from '@mixins/keep.mixin'
import { dropdownList } from '@utils/message'
import { renderFrom } from './libs/selectFormData.js'
import { cloneDeep } from 'lodash'

export default {
  name: 'MultiagentTrend',
  components: {
    BeforeLineTitle,
    BaseSelect,
    BaseForm,
    BaseTable,
    TabPane,
    CustomTransfer,
    ScatterEchart
  },
  mixins: [initDictMixin, keepMixin],
  data() {
    return {
      outTrendFormData,
      tabDataTrend,
      activeTab: 'Echarts',
      dataList: [],
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      columnsScatterData: [],
      searchParams: {},
      listLoading: false,
      ecahrtLoading: false,
      selectParams: [],
      yMaxValue: null,
      yMinValue: null,
      inputDisabled: true,
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 500,
      dropdownList,
      dropdownLabel: '原始比例',
      IsScatterEchart: false,
      renderFromCopy: []
    }
  },
  created() {
    this.outTrendFormData.butData[0].btnShow = 73204
    this.outTrendFormData.butData[1].btnShow = 73203
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
    this.initSelect('org')
  },
  methods: {
    // 表单筛选项查询按钮
    queryForm(form) {
      if (this.selectData.selectedData.length < 1) {
        this.$message.warning('请先选择需要查询的主体')
        return
      }
      let checkedOrgName = []
      this.selectParams.map(item => checkedOrgName.push(item.code))
      this.searchParams = {
        ...removeNullInObject(form),
        orgCdList: checkedOrgName
      }
      this.yMaxValue = null
      this.yMinValue = null
      this.initTableParams()
      this.getData()
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
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
    handleTabOnChange(tab) {
      this.activeTab = tab.name
      if (Object.keys(this.searchParams).length > 0) {
        this.initTableParams()
        this.getData()
      }
    },
    // 主体选择器保存
    submitForm() {
      if (!this.selectData.isShowTransfer) {
        const selectedRight = this.$refs.customTransfer.selectedRight || []
        const dataListRight = this.$refs.customTransfer.dataListRight
        this.selectParams = selectedRight.length > 0 ? selectedRight : dataListRight
        if (this.selectParams.length > 1000) {
          this.$message.warning('最多选择1000个主体')
          return false
        } else {
          this.$set(this.selectData, 'selectedData', this.selectParams)
          this.close()
        }
      }
    },
    initTableParams() {
      this.table.pageNum = 1
      this.table.pageSize = 100
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
      this.dataList = []
      let params = { ...this.searchParams }
      if (this.activeTab === 'Echarts') {
        this.ecahrtLoading = true
        this.IsScatterEchart = false
        params.yMaxValue = this.yMaxValue
        params.yMinValue = this.yMinValue
      } else {
        this.listLoading = true
        params.pageNum = this.table.pageNum
        params.pageSize = this.table.pageSize
      }
      params = removeNullInObject(params)
      service[`get${this.activeTab}ListTrend`](params)
        .then(res => {
          this.listLoading = false
          this.ecahrtLoading = false
          if (res && res.status === 200) {
            const { fieldHead, fieldValues, total } = res.data
            if (this.activeTab === 'Echarts') {
              this.handleEchartsData(res.data)
            } else {
              this.columnsScatterData = []
              this.columnsScatterData = handleColumns(fieldHead)
              this.dataList = fieldValues
              this.table.total = total
            }
          }
        })
        .catch(() => {
          this.listLoading = false
          this.ecahrtLoading = false
          this.IsScatterEchart = false
        })
    },
    handleEchartsData(res) {
      this.inputDisabled = false
      const { lineList, lineListName, xdate } = res
      const yAxisName = this.searchParams.rateOrInterMargin === '1' ? '收益率(%)' : '利差(BP)'
      const data = {
        configuration: {
          ...baseEchartsInfo,
          xAxisType: 'category',
          yAxisType: 'value',
          xAxisName: '交易日',
          legendShowType: lineListName.length > 24 ? 'scroll' : 'plain',
          yAxisMax: this.yMaxValue === '' || this.yMaxValue === null ? undefined : this.yMaxValue,
          yAxisMin: this.yMinValue === '' || this.yMinValue === null ? undefined : this.yMinValue,
          yAxisName,
          xAxis: xdate,
          scatterListName: [],
          lineListName: lineListName,
          lineList: lineList,
          scatterList: [],
          handleFormatter: this.handleFormatter
        }
      }
      this.IsScatterEchart = true
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
      })
    },
    handleFormatter(params) {
      const { data } = params[0]
      let str = `<span>${data[0]}</span><br>`
      if (params) {
        const arr = params.sort(compare('data', 1))
        arr.map(item => {
          const { data, seriesType, seriesName, color } = item
          if (seriesType === 'line') {
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
            <span>${seriesName}： ${data[1]}${
              this.searchParams.rateOrInterMargin === '1' ? '%' : 'BP'
            }</span><br>`
          }
        })
      }
      const strArr = '<div style="width:500px;max-height:300px;overflow: auto;">' + str + '<div>'
      return strArr
    },
    close() {
      this.$refs.customTransfer.selectedRight = []
      this.$refs.customTransfer.codeArrRight = []
      this.selectData.transferData = []
      this.selectData.total = 0
      this.$refs.customTransfer.pageLeft.currentPage = 1
      this.renderFromCopy = cloneDeep(renderFrom)
      this.$set(this.selectData.formData, 'initData', initData(this.selectData.formData.renderFrom))
      this.$set(this.selectData.formData, 'renderFrom', this.renderFromCopy)
      this.initSelect('org')
      this.$refs.select.isShow = false
    },
    resetFormOrg() {
      this.initSelect('org')
    },
    deleteItem(index) {
      this.selectData.selectedData.splice(index, 1)
    },
    handleEmpty() {
      this.$set(this.selectData, 'selectedData', [])
      this.searchParams.orgCdList = []
    },
    resetForm() {
      this.searchParams = {}
      this.handleEmpty()
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        baseDownLoad(service.exportScatterListTrend, this.searchParams)
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
.content {
  background-color: #fff;
}
.el-form-item {
  margin-bottom: 12px;
  ::v-deep.el-form-item__error {
    padding-top: 0 !important;
  }
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
.contentTwo {
  width: 100%;
  height: 500px;
}
::v-deep .BaseSelect .el-dialog {
  width: 1300px !important;
  margin-top: 3vh !important;
}
</style>
