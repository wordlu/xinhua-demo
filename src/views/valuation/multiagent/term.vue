<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'多主体利率期限结构'" />
      <!-- 主体选择器 -->
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
        :form-data="outFormData"
        :label-width="100"
        @queryForm="queryForm"
        @exportForm="exportForm"
        @exportEchart="exportEchart"
        @resetForm="resetForm"
      ></BaseForm>

      <div class="border-line ml10 mr10">
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
          class="content pb20"
          :style="`height:${echartHeight}px;`"
        >
          <ScatterEchart
            v-if="IsScatterEchart"
            ref="ScatterEchartRef"
            :is-id="'ScatterEchart'"
            :width="echartWidth"
            :height="echartHeight"
          ></ScatterEchart>
        </div>
        <template v-else>
          <div v-if="activeTab === 'CurveData'" class="ml10">
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
            v-if="activeTab === 'CurveData'"
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
          ></BaseTable>
          <BaseTable
            v-else
            :columns="getColumns"
            :data-source="dataList"
            :loading="listLoading"
          ></BaseTable>
        </template>
      </div>
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseSelect from '@components/BaseSelect'
import { outFormData, tabData, columnsCurveParams } from './libs/outsideForm'
import { renderFrom } from './libs/selectFormData.js'
import BaseForm from '@components/BaseForm'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import CustomTransfer from './components/customTransfer.vue'
import initDictMixin from './mixins/initData.mixin'
import * as service from '@api/valuation/multiagent.js'
import {
  removeNullInObject,
  handleColumns,
  compare,
  baseDownLoad,
  initData,
  isEmpty
} from '@utils/util'
import { baseEchartsInfo } from '../libs/common'
import keepMixin from '@mixins/keep.mixin'
import { dropdownList } from '@utils/message'
import { cloneDeep } from 'lodash'

export default {
  name: 'MultiagentTerm',
  components: {
    BeforeLineTitle,
    BaseSelect,
    BaseForm,
    TabPane,
    BaseTable,
    CustomTransfer,
    ScatterEchart
  },
  mixins: [initDictMixin, keepMixin],
  data() {
    return {
      outFormData, // 外部表单数据
      columnsCurveData: [],
      columnsCurveParams,
      activeTab: 'Echarts',
      tabData,
      dataList: [],
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      listLoading: false,
      ecahrtLoading: false,
      searchParams: {},
      selectParams: [],
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
  computed: {
    getColumns() {
      return this[`columns${this.activeTab}`]
    }
  },
  created() {
    this.initSelect('org')
    this.outFormData.butData[0].btnShow = 73104
    this.outFormData.butData[1].btnShow = 73103
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
  },
  methods: {
    handleTabOnChange(tab) {
      this.activeTab = tab.name
      if (Object.keys(this.searchParams).length > 0) {
        if (this.activeTab === 'CurveData') {
          this.handleRadioChanges(this.radio)
        } else {
          this.getData()
        }
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
      this.initTableParams()
      this.yMaxValue = null
      this.yMinValue = null
      this.activeTab === 'CurveData' ? this.getData(this.radio) : this.getData()
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
    resetFormOrg() {
      this.initSelect('org')
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
      if (val) {
        params.exportDataStep = val
      }
      service[`get${this.activeTab}ListTerm`](params)
        .then(res => {
          this.listLoading = false
          this.ecahrtLoading = false
          if (res && res.status === 200) {
            const { fieldHead, fieldValues, total } = res.data
            if (this.activeTab === 'CurveData') {
              this.columnsCurveData = []
              this.columnsCurveData = handleColumns(fieldHead)
              this.dataList = fieldValues
              this.table.total = total
            } else if (this.activeTab === 'Echarts') {
              this.handleEchartsData(res.data)
            } else {
              this.dataList = res.data
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
      const { lineList, lineListName } = res
      const data = {
        configuration: {
          ...baseEchartsInfo,
          xAxisType: 'value',
          yAxisType: 'value',
          xAxisName: '剩余期限/年',
          legendShowType: lineListName.length > 24 ? 'scroll' : 'plain',
          yAxisName: '收益率(%)',
          scatterListName: [],
          yAxisMax: this.yMaxValue === '' || this.yMaxValue === null ? undefined : this.yMaxValue,
          yAxisMin: this.yMinValue === '' || this.yMinValue === null ? undefined : this.yMinValue,
          lineListName: lineListName,
          lineList: lineList,
          scatterList: [],
          handleFormatter: this.handleLineFormatter
        }
      }
      this.IsScatterEchart = true
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
      })
    },
    handleLineFormatter(params) {
      const { data } = params[0]
      let str = `<span>${data[0]}年内部估值收益率</span><br>`
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, seriesName, color } = item
        str += `<span class="echart-tip-icon" style="background-color:${color};"></span><span>${seriesName}：${
          data[1]
        }%<span><br>`
      })
      const strArr = '<div style="width:500px;max-height:300px;overflow: auto;">' + str + '<div>'
      return strArr
    },
    resetForm() {
      this.searchParams = {}
      this.handleEmpty()
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
    deleteItem(index) {
      this.selectData.selectedData.splice(index, 1)
    },
    handleEmpty() {
      this.$set(this.selectData, 'selectedData', [])
      this.searchParams.orgCdList = []
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        let params = { ...this.searchParams }
        params.exportDataStep = this.radio
        baseDownLoad(service.exportScatterListTerm, params)
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
.bodyWrap {
  background-color: #fff;
}
.content {
  margin-bottom: 20px;
  background-color: #fff;
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
