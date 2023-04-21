<template>
  <div>
    <Sizer
      ref="sizer"
      :sizer-title="'无风险利率走势分析'"
      is-show-sizer
      :is-show-transfer="false"
      :btn-name="'选择曲线'"
      :btn-icon="'el-icon-plus'"
      :label-width="'180px'"
      :dialog-title="'选择曲线'"
      close-type="hidden"
      @handleSave="handleSave"
      @handleEmpty="handleEmpty"
      @deleteItem="deleteItem"
    >
      <slot>
        <el-form
          ref="ruleFormRef"
          :show-message="false"
          :model="ruleForm"
          class="ruleForm"
          :rules="rules"
        >
          <el-table :data="ruleForm.tableData" style="width: 100%">
            <el-table-column prop="curveId" align="center" label="曲线名称">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.curveId'"
                  :rules="rules.curveId"
                >
                  <el-select v-model="scope.row.curveId" placeholder="请选择曲线名称">
                    <el-option
                      v-for="(item, index) in globalDictMap('1008')"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                      @click.native="indexChange(scope.$index, item.name)"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="givenPeriod" align="center" label="关键剩余期限">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.givenPeriod'"
                  :rules="rules.givenPeriod"
                >
                  <el-select v-model="scope.row.givenPeriod" placeholder="请选择关键剩余期限">
                    <el-option
                      v-for="(item, index) in globalDictMap('1013')"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                      @click.native="periodChange(scope.$index, item.name)"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.$index === ruleForm.tableData.length - 1"
                  type="primary"
                  icon="el-icon-plus"
                  @click.native.prevent="addrow(scope.$index)"
                >
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-minus"
                  @click.native.prevent="deleteRow(scope.$index, ruleForm.tableData)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </slot>
      <template v-slot:footer>
        <el-row>
          <el-col style="text-align: right">
            <el-button type="primary" @click="handleDialogSave">确定</el-button>
            <el-button @click="handleDialogClose">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </Sizer>
    <BaseForm
      :form-data="formData"
      :label-width="120"
      :set-options="setOptions"
      @queryForm="commonForm"
      @handleExportImg="handleExportImg"
      @rowExport="rowExport"
      @colExport="colExport"
    >
      <template v-slot:bizDateOrder="{ data, rowItem }">
        <el-form-item
          v-if="activeDataTab !== 'echarts'"
          :label="rowItem.label"
          class="formItem itemRow"
        >
          <el-select v-model="data.bizDateOrder" placeholder="请选择">
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
      <template v-slot:calType="{ data, rowItem }" class="formItem">
        <el-form-item v-if="data.dataFrequence !== '1'" :label="rowItem.label">
          <el-radio-group v-model="data.calType">
            <el-radio v-for="item in rowItem.options" :key="item.code" :label="item.code"
              >{{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </BaseForm>
    <TabPane
      v-model="activeDataTab"
      :tab-list="tabData"
      :type="'echarts'"
      :default-name="activeDataTab"
      @handleTabChange="handleTabOnChange"
    />
    <div class="contentTitle">
      <template v-if="activeDataTab === 'searchlist'">
        <span class="tips">单位：%</span>
        <BaseTable
          :columns="columns"
          has-pagination
          :page-size="table.pageSize"
          :data-source="dataList"
          :current-page="table.currentPage"
          :total="table.total"
          :loading="tableLoading"
          :page-sizes="[50, 100, 200, 500]"
          @handleCurrent="handleCurrentChange"
          @handleSize="handleSizeChange"
        />
      </template>
      <div v-else v-loading="hideScatterEchart" class="contentTitle">
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
            :is-id="'scatter'"
            :width="echartWidth"
            :height="echartHeight"
          >
          </ScatterEchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import Sizer from '@components/Sizer'
import * as service from '@api/bondValuation'
import BaseForm from '@components/BaseForm/index.vue'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import { formData, chartOption } from '../libs/turnoverRate-data.js'
import { baseDownLoad, compare, isEmpty } from '@utils/util'
import { dropdownList } from '@utils/message'
import { cloneDeep } from 'lodash'

export default {
  components: {
    BaseTable,
    TabPane,
    Sizer,
    ScatterEchart,
    BaseForm
  },
  data() {
    return {
      formData,
      ruleForm: {
        tableData: [
          {
            curveId: '',
            givenPeriod: ''
          }
        ]
      },
      rules: {
        curveId: [{ required: true, message: '请输入', trigger: 'change' }],
        givenPeriod: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      setOptions: {},
      tabData: [
        {
          label: '图像',
          name: 'echarts'
        },
        {
          label: '数据',
          name: 'searchlist'
        }
      ],
      activeDataTab: 'echarts',
      isScatterEchart: false,
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      columns: [],
      tableLoading: false,
      searchParams: {},
      dataList: [],
      isSearch: false,
      ymaxValue: '',
      yminValue: '',
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 550,
      dropdownLabel: '原始比例',
      dropdownList,
      hideScatterEchart: false,
      canQuery: false,
      handleTableData: []
    }
  },
  mounted() {
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
  },
  methods: {
    inputFor(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    onRefresht() {
      if (this.ymaxValue && this.yminValue) {
        if (Number(this.yminValue) > Number(this.ymaxValue)) {
          this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
          return false
        }
      } else if (isEmpty(this.yminValue) && isEmpty(this.ymaxValue)) {
        this.submitForm()
        return
      } else {
        this.$message.warning('请完善Y轴上限或下限')
        return false
      }
      this.submitForm()
    },
    handleTabOnChange(val) {
      this.activeDataTab = val.name
      this.table.currentPage = 1
      this.table.pageSize = 50
      this.submitForm()
    },
    // sizer
    handleSave(data) {
      this.searchParams.curveGivenPeriodList = data.map(item => {
        let { curveId, givenPeriod } = item
        let result = { curveId, givenPeriod }
        return result
      })
    },
    deleteItem(val) {
      const { selectedData } = val
      if (selectedData.length === 0) {
        this.handleEmpty()
      }
    },
    handleEmpty() {
      this.ruleForm = {
        tableData: [
          {
            curveId: '',
            givenPeriod: ''
          }
        ]
      }
    },
    handleDialogSave() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          this.$refs.sizer.selectedData = this.ruleForm.tableData
          this.handleTableData = cloneDeep(this.$refs.sizer.selectedData)
          this.$refs.sizer.handleDialogSave()
        } else {
          this.$message({
            message: '请将数据填写完整后进行确定',
            type: 'error'
          })
          return false
        }
      })
    },
    handleDialogClose() {
      if (this.$refs.sizer.selectedData.length > 0) {
        this.$refs.ruleFormRef.validate(valid => {
          if (valid) {
            this.$refs.sizer.selectedData = this.handleTableData
            this.ruleForm.tableData = this.handleTableData
            this.handleTableData = cloneDeep(this.handleTableData)
            this.$refs.sizer.isShow = false
          }
        })
      } else {
        this.$refs.sizer.isShow = false
        this.$refs.ruleFormRef.resetFields()
        this.formClear()
      }
    },
    formClear() {
      this.ruleForm = {
        tableData: [
          {
            curveId: '',
            givenPeriod: ''
          }
        ]
      }
    },
    addrow(index) {
      var list = {
        curveId: '',
        givenPeriod: ''
      }
      let { tableData } = this.ruleForm
      if (tableData.length >= 10) {
        this.$message.warning('最多添加10条曲线')
      } else {
        this.ruleForm.tableData.splice(index + 1, 0, list)
      }
    },
    // 操作(删除)
    deleteRow(index, rows) {
      if (rows.length > 1) {
        rows.splice(index, 1)
      }
    },
    indexChange(index, name) {
      this.ruleForm.tableData[index].curveName = name
    },
    periodChange(index, name) {
      this.ruleForm.tableData[index].periodName = name
    },
    // form
    commonForm(val) {
      this.yminValue = ''
      this.ymaxValue = ''
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 50
      }
      let { tableData } = this.ruleForm
      const curveGivenPeriodList = tableData.map(item => {
        let { curveId, givenPeriod } = item
        let result = { curveId, givenPeriod }
        return result
      })
      this.searchParams = { ...val, curveGivenPeriodList }
      this.isSearch = true
      this.submitForm()
    },
    submitForm() {
      if (!this.isSearch) return
      let { tableData } = this.ruleForm
      if (
        tableData.length < 1 ||
        (tableData.length === 1 && tableData[0].curveId === '' && tableData[0].givenPeriod === '')
      ) {
        this.$message.warning('最少选择一条曲线')
      } else {
        const { beginDate, endDate } = this.searchParams
        if (endDate < beginDate) {
          this.$message.warning('结束日期必须大于开始日期')
        } else {
          let data = {
            ...this.searchParams,
            pageNum: this.table.currentPage,
            pageSize: this.table.pageSize,
            queryType: this.activeDataTab === 'searchlist' ? '2' : '1'
          }
          if (this.activeDataTab === 'echarts') {
            this.isScatterEchart = false
            this.hideScatterEchart = true
            service
              .postcurveChartDataQuery({
                ...this.searchParams,
                queryType: this.activeDataTab === 'searchlist' ? '2' : '1',
                yMaxValue: this.ymaxValue || '',
                yMinValue: this.yminValue || ''
              })
              .then(res => {
                if (res) {
                  let mapData = []
                  let lineListName = []
                  this.canQuery = true
                  res.data.forEach(item => {
                    const arr = []
                    const { curveName, dataFrequency, dateValueMap, remainPeriod } = item
                    for (let o in dateValueMap) {
                      arr.push([
                        Number(o),
                        dateValueMap[o] === '' ? '/' : Number(dateValueMap[o]),
                        curveName,
                        dataFrequency,
                        remainPeriod
                      ])
                    }
                    lineListName.push(curveName + '(' + remainPeriod + '年)')
                    mapData.push(arr)
                  })
                  const data = {
                    configuration: {
                      ...chartOption,
                      yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                      yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                      lineListName,
                      lineList: mapData,
                      handleFormatter: this.handleFormatter
                    }
                  }
                  this.isScatterEchart = true
                  this.$nextTick(() => {
                    this.$refs.ScatterEchartRef.init(data)
                  })
                  this.hideScatterEchart = false
                }
              })
          } else {
            this.tableLoading = true
            service.postcurveTrendQuery(data).then(res => {
              this.tableLoading = false
              const { list, total } = res.data
              this.dataList = list
              this.table.total = total
              this.columns = []
              if (list.length > 0) {
                for (let i = 0; i < Object.getOwnPropertyNames(this.dataList[0]).length - 1; i++) {
                  this.columns.push({
                    label: i === 0 ? '序号' : i + '',
                    prop: i + '',
                    align: 'center',
                    width: i === 0 ? 100 : ''
                  })
                }
              }
            })
          }
        }
      }
    },
    handleFormatter(params) {
      let str = ''
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          if (data[1] !== '/') {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}(${data[4]}年)/收益率:${data[1]}<span><br>`
          } else {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>暂无数据<span><br>`
          }
        }
      })
      return `日期:` + params[0].axisValue + `<br>` + str
    },
    handleExportImg() {
      if (!this.isScatterEchart) {
        this.$message.warning('请先查询数据')
      } else {
        this.$refs.ScatterEchartRef.download()
      }
    },
    rowExport() {
      if (this.dataList.length < 1) {
        this.$message({
          message: '暂无数据导出',
          type: 'warning'
        })
        return false
      } else {
        this.onExport('vertical')
      }
    },
    colExport() {
      if (this.dataList.length < 1) {
        this.$message({
          message: '暂无数据导出',
          type: 'warning'
        })
        return false
      } else {
        this.onExport('horizontal')
      }
    },
    // 导出 横向：horizontal， 竖向：vertical
    onExport(type) {
      let data = {
        ...this.searchParams,
        queryType: this.activeDataTab === 'searchlist' ? '2' : '1'
      }
      if (type === 'horizontal') {
        baseDownLoad(service.curveTrendExcel, data)
      } else {
        baseDownLoad(service.curveTrendExcelVertical, data)
      }
    },
    handleCurrentChange(page) {
      this.table.currentPage = page
      this.submitForm()
    },
    handleSizeChange(size) {
      this.table.pageSize = size
      this.table.currentPage = 1
      this.submitForm()
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
        this.isScatterEchart = false
        this.submitForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sizer {
  padding: 8px;
  margin: 0 10px 8px;
  border: 1px solid #e6e9eb;
  border-radius: 4px;
  ::v-deep .box {
    height: 36px;
    margin-top: 0 !important;
    line-height: 36px;
  }
}
.tips {
  margin-left: 20px;
  font-size: 12px;
}
.itemRow {
  margin-bottom: 8px !important;
}
.contentTitle {
  background: #fff;
  .inputNumber {
    width: 100%;
    padding: 0 10px;
  }
  .ScatterEchart {
    width: 100%;
    height: 500px;
  }
  .el-input {
    width: 110px !important;
  }
  .el-button {
    margin-left: 20px;
  }
  .el-switch {
    margin-left: 30px;
  }
  .el-switch__label.is-active {
    color: #303133;
  }
}
</style>
