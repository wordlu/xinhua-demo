<template>
  <!-- 估值走势 -->
  <div>
    <BaseForm
      :key="BaseFormKey"
      :form-data="formData"
      :label-width="100"
      :set-options="setOptions"
      @queryForm="queryForm"
      @trigger="trigger"
      @getRemoteMethod="getRemoteMethod"
      @exportForm="exportForm"
      @exportEchart="exportEchart"
      @selectVisible="baseSelectVisible"
    />

    <div class="content border-line ml10 mr10">
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
        class="content"
        :style="`height:${echartHeight}px;`"
      >
        <ScatterEchart
          v-if="IsScatterEchart"
          ref="ScatterEchartRef"
          :width="echartWidth"
          :height="echartHeight"
          :is-id="'ScatterEchartBnd'"
        ></ScatterEchart>
      </div>
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
import BaseForm from '@components/BaseForm/index.vue'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import { formData, tabData, columnsLine, columnsScatter } from '../libs/data'
import InitData from '../../../mixins/initData.mixin'
import { removeNullInObject, initData, compare, baseDownLoad, isEmpty } from '@utils/util'
import * as service from '@api/valuation/standard.js'
import { baseEchartsInfo } from '../../../libs/common'
import { dropdownList } from '@utils/message'
import { throttle } from 'lodash'

export default {
  components: {
    BaseForm,
    TabPane,
    BaseTable,
    ScatterEchart
  },
  mixins: [InitData],
  data() {
    return {
      formData,
      tabData,
      columnsScatter,
      columnsLine,
      activeTableTab: 'Echarts',
      setOptions: {},
      listLoading: false,
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      dataList: [],
      searchParams: {},
      ecahrtLoading: false,
      getColumns: [],
      yMaxValue: null,
      yMinValue: null,
      inputDisabled: true,
      echartsData: {},
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 500,
      dropdownList,
      dropdownLabel: '原始比例',
      IsScatterEchart: false,
      BaseFormKey: 1
    }
  },
  created() {
    this.formData.initData = initData(this.formData.renderFrom)
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
  },
  activated() {
    if (Object.keys(this.echartsData).length > 0) {
      this.activeTableTab === 'Echarts' && this.handleEchartsData(this.echartsData)
    }
  },
  beforeDestroy() {
    this.echartsData = {}
  },
  methods: {
    trigger(val, item) {
      if (item.key === 'windCd') {
        const { endDt, windCd } = val
        if (windCd !== '') {
          service.getBeginDate({ windCd: windCd }).then(res => {
            const { data, status } = res
            if (status === 200) {
              formData.initData = {
                startDt: data,
                windCd: windCd,
                endDt: endDt
              }
              this.BaseFormKey++
            }
          })
        }
      }
    },
    handleTabOnChange(tab) {
      this.activeTableTab = tab.name
      if (Object.keys(this.searchParams).length > 0) {
        this.queryForm(this.searchParams)
      }
    },
    queryForm(initData) {
      this.dataList = []
      this.searchParams = removeNullInObject(initData)
      this.table.pageNum = 1
      this.yMaxValue = null
      this.yMinValue = null
      this.getTableList()
    },
    handleCurrent(page) {
      this.table.pageNum = page
      this.getTableList()
    },
    handleSize(size) {
      this.table.pageSize = size
      this.table.pageNum = 1
      this.getTableList()
    },
    onRefresht: throttle(function() {
      if (this.yMinValue && this.yMaxValue) {
        if (Number(this.yMinValue) > Number(this.yMaxValue)) {
          this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
          return false
        }
      } else if (isEmpty(this.yMinValue) && isEmpty(this.yMaxValue)) {
        this.getTableList()
        return
      } else {
        this.$message.warning('请完善Y轴上限或下限')
        return false
      }
      this.getTableList()
    }, 1000),
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    getTableList() {
      let params = { ...this.searchParams }
      if (this.activeTableTab === 'Echarts') {
        this.ecahrtLoading = true
        params.yMaxValue = this.yMaxValue
        params.yMinValue = this.yMinValue
      } else {
        this.listLoading = true
      }
      params.pageNum = this.table.pageNum
      params.pageSize = this.table.pageSize
      this.getColumns = []
      service[`getBndTrend${this.activeTableTab}`](params)
        .then(res => {
          this.listLoading = false
          this.ecahrtLoading = false
          const { status, data } = res
          if (res && status === 200) {
            if (this.activeTableTab === 'Echarts') {
              this.echartsData = data
              this.handleEchartsData(data)
            } else {
              this.getColumns = this[`columns${this.activeTableTab}`]
              const { list, total } = data
              if (list.length > 0) {
                const { orgName, bndAbbrnm, windCd } = list[0]
                if (this.activeTableTab === 'Scatter') {
                  this.getColumns[0].label = `${orgName}，${bndAbbrnm}，${windCd}`
                } else {
                  this.getColumns[0].label = `${orgName}，${bndAbbrnm}，${windCd}`
                }
              } else {
                this.getColumns = []
              }
              this.dataList = list
              this.table.total = total
            }
          }
        })
        .catch(() => {
          this.listLoading = false
          this.ecahrtLoading = false
        })
    },
    handleEchartsData(res) {
      this.inputDisabled = false
      this.IsScatterEchart = false
      const {
        lineList,
        lineListName,
        scatterList,
        period,
        xdate,
        ymax,
        ymin,
        scatterListName
      } = res
      this.period = period
      const data = {
        configuration: {
          ...baseEchartsInfo,
          xAxisType: 'category',
          yAxisType: 'value',
          xAxisName: '交易日',
          yAxisName: '收益率(%)',
          yAxisMax: ymax,
          yAxisMin: ymin,
          bottomGrid: '10%',
          leftGrid: '5%',
          rightGrid: '10%',
          legendShowBottom: '3%',
          topGrid: '10%',
          scatterListName: scatterListName,
          lineListName: lineListName,
          xAxis: xdate,
          lineList: lineList,
          scatterList: [scatterList],
          handleFormatter: this.handleLineFormatter,
          scatterTooltipTriggr: 'axis'
        }
      }
      this.IsScatterEchart = true
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
      })
    },
    handleLineFormatter(params) {
      const { data } = params[0]
      let str = `<span>${data[0]}</span><br>`
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          str += `<span class="echart-tip-icon" style="background-color:${color};"></span><span>内部估值收益率(${
            data[2]
          }年)：${data[1]}%<span><br>`
        } else {
          str += `<span class="echart-tip-icon" style="background-color:${color};"></span><span>成交收益率(${
            data[2]
          }年)：${data[1]}%<span><br>`
        }
      })
      return str
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        baseDownLoad(service.exportBndTrend, this.searchParams)
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
        this.getTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
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
</style>
