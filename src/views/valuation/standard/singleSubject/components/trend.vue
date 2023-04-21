<template>
  <!-- 单一主体标准估值 - 利率走势分析 -->
  <div class="container">
    <BaseForm
      :form-data="formData"
      :label-width="120"
      :set-options="setOptions"
      @queryForm="queryForm"
      @exportForm="exportForm"
      @exportEchart="exportEchart"
      @trigger="trigger"
      @getRemoteMethod="getRemoteMethod"
      @selectVisible="baseSelectVisible"
    >
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
    <div class="content container border-line ml10 mr10">
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
          :is-id="'ScatterEchartTrend'"
          :width="echartWidth"
          :height="echartHeight"
        ></ScatterEchart>
      </div>
      <BaseTable
        v-else
        :key="baseKey"
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
import { formData, tabData, columnsScatter, columnsLine } from '../libs/data'
import { removeNullInObject, handleColumns, compare, baseDownLoad, isEmpty } from '@utils/util'
import InitData from '../../../mixins/initData.mixin'
import * as service from '@api/valuation/standard.js'
import { baseEchartsInfo } from '../../../libs/common'
import { dropdownList } from '@utils/message'
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
      columnsLine,
      columnsScatter,
      activeTableTab: 'Echarts',
      setOptions: {},
      dataList: [],
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 100
      },
      searchParams: {},
      listLoading: false,
      ecahrtLoading: false,
      getColumns: [],
      baseKey: 0,
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
      IsScatterEchart: false
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
      this.baseKey++
      if (Object.keys(this.searchParams).length > 0) {
        this.table.pageNum = 1
        this.getData(1)
      }
    },
    queryForm(initData) {
      this.searchParams = removeNullInObject(initData)
      this.table.pageNum = 1
      this.yMaxValue = null
      this.yMinValue = null
      this.getData()
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
    handleFormatter(params) {
      const risklessRate = this.globalDictLabel('1008', this.searchParams.risklessRate)
      const content =
        this.searchParams.rateOrInterMargin === '1' ? '内部估值收益率' : `与${risklessRate}的利差`
      const { data } = params[0]
      let str = `<span>${data[0]} ${content}</span><br>`
      let strScatterTitle = ''
      let strScatterContent = ''
      const arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          if (this.searchParams.rateOrInterMargin === '1') {
            // 收益率
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span><span>${
              data[2]
            }年期：${data[1]}%<span><br>`
          } else {
            // 利差
            str += `<span class="echart-tip-icon" style="background-color:${color};"></span><span>${
              data[2]
            }年期利差：${data[1]}BP<span><br>`
          }
        } else {
          // scatterTooltipTriggr 为 axis 时可以用
          strScatterTitle = `<span>${data[0]}，投射至3年期收益率：</span><br>`
          strScatterContent += `<span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]} (${data[3]}年) ${data[1]}%</span><br>`
        }
      })
      return str + strScatterTitle + strScatterContent
    },
    handleScatterFormatter(params) {
      const { data, color } = params
      let str = `<span>${data[0]}，投射至3年期收益率：</span><br>
      <span class="echart-tip-icon" style="background-color:${color};"></span>
      <span>${data[2]} (${data[3]}年) ${data[1]}%</span>`
      return str
    },
    handleEchartsData(res) {
      this.inputDisabled = false

      const { lineList, lineListName, scatterList, xdate } = res
      const yAxisName = this.searchParams.rateOrInterMargin === '1' ? '收益率(%)' : '利差(BP)'
      const scatterListName =
        scatterList && scatterList.length > 0 ? ['真实成交收益率投射至3年'] : []
      const data = {
        configuration: {
          ...baseEchartsInfo,
          xAxisType: 'category',
          yAxisType: 'value',
          xAxisName: '交易日',
          yAxisName,
          yAxisMax: this.yMaxValue === '' || this.yMaxValue === null ? undefined : this.yMaxValue,
          yAxisMin: this.yMinValue === '' || this.yMinValue === null ? undefined : this.yMinValue,
          xAxis: xdate,
          scatterListName,
          lineListName: lineListName,
          lineList: lineList,
          scatterList: [scatterList],
          handleFormatter: this.handleFormatter,
          // scatterTooltipTriggr: 'axis',
          handleScatterFormatter: this.handleScatterFormatter
        }
      }
      this.IsScatterEchart = true
      this.$nextTick(() => {
        this.$refs.ScatterEchartRef.init(data)
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
    getData() {
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
      }
      params = removeNullInObject(params)
      service[`getTrend${this.activeTableTab}`](params)
        .then(res => {
          this.listLoading = false
          this.ecahrtLoading = false
          if (res && res.status === 200) {
            if (this.activeTableTab === 'Echarts') {
              this.IsScatterEchart = false
              this.handleEchartsData(res.data)
            } else {
              this.getColumns = this[`columns${this.activeTableTab}`]
              const { fieldHead, fieldValues, total, list } = res.data
              if (this.activeTableTab === 'Line') {
                this.getColumns[0].label = fieldValues.length > 0 ? fieldValues[0].NAME : ''
                this.getColumns[0].children = handleColumns(fieldHead).filter(
                  i => i.prop !== 'NAME'
                )
              } else {
                this.getColumns = [...this.columnsScatter]
              }
              this.dataList = this.activeTableTab === 'Line' ? fieldValues : list
              this.table.total = total
            }
          }
        })
        .catch(() => {
          this.listLoading = false
          this.ecahrtLoading = false
        })
    },
    exportForm() {
      if (Object.keys(this.searchParams).length > 0) {
        baseDownLoad(service.exportTrendLineList, this.searchParams)
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
        this.getData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
}
.content {
  margin-bottom: 20px;
  background-color: #fff;
}
.echarts-box {
  width: 100%;
  height: 500px;
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
