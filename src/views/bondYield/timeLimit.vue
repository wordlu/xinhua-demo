<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'无风险利率期限结构'" />
      <div class="querySearch">
        <Sizer
          ref="sizer"
          :sizer-title="'无风险利率期限结构'"
          is-show-sizer
          :is-show-transfer="false"
          :btn-name="'选择曲线'"
          :btn-icon="'el-icon-plus'"
          :label-width="'180px'"
          :dialog-title="'选择曲线'"
          :custom-name="'bizDate'"
          close-type="hidden"
          @handleSave="handleSave"
          @handleEmpty="handleEmpty"
          @handleDialogClose="handleDialogClose"
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
                          @click.native="IndexChange(scope.$index, item.name)"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="bizDate" align="center" label="日期">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'tableData.' + scope.$index + '.bizDate'"
                      :rules="rules.bizDate"
                    >
                      <el-date-picker
                        v-model="scope.row.bizDate"
                        type="date"
                        align="center"
                        placeholder="选择日期"
                        size="small"
                        value-format="yyyyMMdd"
                        :picker-options="pickerOptions"
                      >
                      </el-date-picker>
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
        <div class="rightButt">
          <el-button v-btnShow="inquire" type="primary" :loading="loading" @click="query"
            >查询</el-button
          >
          <el-button v-if="activeDataTab === 'echarts'" v-btnShow="derive" @click="handleExportImg"
            >导出图形</el-button
          >
          <el-button v-else @click="handleExportData">导出数据</el-button>
        </div>
      </div>
      <div class="content">
        <TabPane
          v-model="activeDataTab"
          :tab-list="tabData"
          :type="'echarts'"
          :default-name="activeDataTab"
          @handleTabChange="handleTabOnChange"
        />
        <div class="contentTitle">
          <div v-if="activeDataTab === 'searchlist'">
            <div class="radioGroup">
              <el-radio-group v-model="queryRadio">
                <el-radio
                  v-for="item in radioList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                  @change="handleRadioChanges(item)"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
              <span class="title"
                >关键点包括：0.25年、1至10年内的所有整数年、15年、20年、30年、50年</span
              >
            </div>
            <BaseTable
              :page-size="1"
              :columns="columns"
              :data-source="dataSource"
              :loading="loading"
            />
          </div>
          <div v-if="activeDataTab === 'echarts'" v-loading="chartLoading">
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
                  <el-button type="primary" :disabled="!canQuery" @click="onRefresht"
                    >刷新</el-button
                  >
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
                :is-id="'scatter'"
                :width="echartWidth"
                :height="echartHeight"
              >
              </ScatterEchart>
            </div>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseTable from '@components/BaseTable'
import TabPane from '@components/TabPane'
import Sizer from '@components/Sizer'
import * as service from '@api/bondValuation'
import { mapGetters } from 'vuex'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import keepMixin from '@mixins/keep.mixin'
import { dropdownList } from '@utils/message'
import { cloneDeep } from 'lodash'
import { isEmpty } from '@utils/util'
export default {
  name: 'RateLimit',
  components: {
    BeforeLineTitle,
    BaseTable,
    TabPane,
    Sizer,
    ScatterEchart
  },
  mixins: [keepMixin],
  data() {
    return {
      queryRadio: '1',
      radioList: [
        {
          value: '1',
          label: '0.1'
        },
        {
          value: '2',
          label: '1'
        },
        {
          value: '3',
          label: '关键点'
        }
      ],
      chartLoading: false,
      pickerOptions: {
        disabledDate: time => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'))
        }
      },
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
      columns: [
        {
          label: '剩余期限（年）',
          prop: 'remainPeriod',
          align: 'center'
        }
      ],
      ruleForm: {
        tableData: [
          {
            curveId: '',
            bizDate: ''
          }
        ]
      },
      rules: {
        curveId: [{ required: true, message: '请输入', trigger: 'change' }],
        bizDate: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      dataSource: [],
      xAxisData: [],
      loading: false,
      IsScatterEchart: false,
      ymaxValue: '',
      yminValue: '',
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1600,
      echartOriginalHeight: 550,
      dropdownLabel: '原始比例',
      dropdownList,
      inquire: 33201,
      derive: 33202,
      canQuery: false,
      handleTableData: [],
      valueTitle: ''
    }
  },
  computed: {
    sizers() {
      return [
        {
          name: '选择曲线',
          icon: 'el-icon-plus',
          btnTitle: '选择曲线',
          title: '选择曲线'
        }
      ]
    },
    ...mapGetters({ ableDate: 'ableDate' })
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
      this.valueTitle = '刷新'
      if (this.ymaxValue && this.yminValue) {
        if (Number(this.yminValue) > Number(this.ymaxValue)) {
          this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
          return false
        }
      } else if (isEmpty(this.yminValue) && isEmpty(this.ymaxValue)) {
        this.query()
        return
      } else {
        this.$message.warning('请完善Y轴上限或下限')
        return false
      }
      this.query()
    },
    // 单选切换事件
    handleRadioChanges(e) {
      this.queryRadio = e.value
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
    },
    // tab切换
    handleTabOnChange(data) {
      this.activeDataTab = data.name
      this.query()
    },
    // 操作(新增)
    addrow(index) {
      var list = {
        curveId: '',
        givenPeriod: ''
      }
      let { tableData } = this.ruleForm
      if (tableData.length >= 10) {
        this.$message.warning('最多添加10条曲线！')
      } else {
        tableData.splice(index + 1, 0, list)
      }
    },
    // 操作(删除)
    deleteRow(index, rows) {
      if (rows.length > 1) {
        rows.splice(index, 1)
      }
    },
    // 确定
    handleDialogSave() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          let { tableData } = this.ruleForm
          this.$refs.sizer.selectedData = tableData
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
    // 取消
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
    // 点击下拉事件
    IndexChange(index, name) {
      this.ruleForm.tableData[index].curveName = name
    },
    // 查询
    query() {
      this.loading = true
      this.columns = [
        {
          label: '剩余期限（年）',
          prop: 'remainPeriod',
          align: 'center'
        }
      ]
      let { tableData } = this.ruleForm
      // 利率期限结构 {curveId, bizDate}
      if (
        tableData.length < 1 ||
        (tableData.length === 1 && tableData[0].curveId === '' && tableData[0].bizDate === '')
      ) {
        this.$message.warning('请最少添加一条曲线！')
        this.loading = false
      } else {
        if (this.valueTitle !== '刷新') {
          this.ymaxValue = ''
          this.yminValue = ''
        }
        if (this.activeDataTab === 'searchlist') {
          this.ymaxValue = ''
          this.yminValue = ''
        }
        let params = {
          curveDateList: tableData,
          queryType: this.activeDataTab === 'echarts' ? '1' : '2',
          dataStep: this.activeDataTab === 'searchlist' ? this.queryRadio : '',
          yMaxValue: this.ymaxValue || '',
          yMinValue: this.yminValue || ''
        }
        this.chartLoading = true
        this.canQuery = true
        service.postDateColumnList(params).then(res => {
          res.data.forEach((element, index) => {
            this.columns.push({
              label: `${element.columnName}(单位:%)`,
              prop: `dateValueMap[${index}].value`,
              align: 'center'
            })
            this.xAxisData.push(element.columnName)
          })

          service.postInterRatePeriodQuery(params).then(resData => {
            this.loading = false
            if (resData.data.length > 0 && resData.status === 200) {
              let { data } = resData
              data.map(item => {
                let { dateValueMap } = item
                if (Object.keys(dateValueMap).length > 0) {
                  let dateValueMapClone = []
                  for (let i = 0; i < res.data.length; i++) {
                    for (const [key, value] of Object.entries(dateValueMap)) {
                      if (res.data[i].columnId === key) {
                        this.$set(dateValueMapClone, i, {
                          columnId: key,
                          value: value
                        })
                      }
                    }
                    item.dateValueMap = dateValueMapClone
                  }
                }
              })
              this.dataSource = data
              const mapData = []
              const lineListName = []
              for (let i = 0; i < res.data.length; i++) {
                const arrNext = []
                const { curveName, bizDate } = this.$refs.sizer.selectedData[i]
                data.forEach(el => {
                  const arrPre = []
                  const { dateValueMap, remainPeriod } = el
                  arrPre.push(
                    remainPeriod,
                    dateValueMap[i] === undefined ? '' : dateValueMap[i].value,
                    curveName + bizDate
                  )
                  arrNext.push(arrPre)
                })
                mapData.push(arrNext)
                lineListName.push(curveName + bizDate)
              }
              const dataLine = {
                configuration: {
                  xAxisName: '(含权)剩余期限',
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
                  xAxisInterval: 6,
                  legendShowType: 'scroll',
                  lineListName,
                  yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                  yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                  seriesType: 'line',
                  seriesSmooth: true,
                  bottomGrid: '15%',
                  leftGrid: '10%',
                  rightGrid: '15%',
                  legendShowBottom: '8%',
                  topGrid: '10%',
                  lineList: mapData,
                  handleFormatter: this.handleFormatter
                }
              }
              this.IsScatterEchart = true
              this.chartLoading = false
              this.valueTitle = ''
              this.$nextTick(() => {
                this.$refs.ScatterEchartRef.init(dataLine)
              })
            } else {
              this.IsScatterEchart = false
              this.chartLoading = false
            }
          })
        })
      }
    },
    // 图表tooltip
    handleFormatter(params) {
      let str = ''
      params.map(item => {
        const { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          // 折线悬浮信息
          str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/收益率:${data[1]}<span><br>`
        }
      })
      return `剩余期限(年):` + params[0].axisValue + `<br>` + str
    },
    handleSave(data) {
      this.ruleForm.curveDateList = data.map(item => {
        let { bizDate, curveId, curveName } = item
        let result = { curveId, curveName, bizDate }
        return result
      })
    },
    deleteItem(val) {
      const { selectedData } = val
      if (selectedData.length === 0) {
        this.ruleForm = {
          tableData: [
            {
              curveId: '',
              bizDate: ''
            }
          ]
        }
      }
    },
    formClear() {
      this.ruleForm = {
        tableData: [
          {
            curveId: '',
            bizDate: ''
          }
        ]
      }
      this.dataSource = []
      this.columns = [
        {
          label: '剩余期限（年）',
          prop: 'remainPeriod',
          align: 'center'
        }
      ]
    },
    handleEmpty() {
      this.formClear()
    },
    handleExportImg() {
      if (!this.IsScatterEchart) {
        this.$message.warning('请先查询数据')
      } else {
        this.$refs.ScatterEchartRef.download()
      }
    },
    handleExportData() {
      let { tableData } = this.ruleForm
      let params = {
        curveDateList: tableData,
        queryType: this.activeDataTab === 'echarts' ? '1' : '2',
        dataStep: this.queryRadio
      }
      service
        .interRatePeriodExcel(params)
        .then(res => {
          if (res) {
            this.$message({
              showClose: true,
              message: '导出成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: 'danger'
          })
        })
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
        this.chartLoading = true
        this.query()
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
  }
}

.querySearch {
  .chooseMain {
    margin-bottom: 20px;
  }

  .chooseBtn {
    margin-right: 20px;
  }
}

.radioGroup {
  ::v-deep .el-form-item__content {
    width: calc(100% - 160px) !important;
  }
}

.gray {
  color: #606266;
}

.radioSearch {
  width: 100%;
  // padding-left: 160px;

  ::v-deep .el-form-item__content {
    width: calc(100% - 160px) !important;
  }

  ::v-deep .el-radio__input {
    line-height: 40px !important;
  }
}

.rightButt {
  padding-right: 10px;
  margin-top: 10px;
  text-align: right;
}

.content {
  position: relative;
  .contentTitle {
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
}

::v-deep .el-table__body {
  .el-form-item {
    margin-right: 0;
    .el-form-item__content {
      width: 220px;

      .el-select {
        .el-input {
          .el-input__inner {
            padding-right: 51px !important;
          }
        }
      }
    }
  }
}

.ruleForm {
  ::v-deep .el-form-item {
    margin: auto !important;
  }
}

.chose {
  margin-bottom: 30px;

  .choseMain {
    display: flex;
    // justify-content: space-between;
    margin-bottom: 20px;

    .selected {
      display: flex;
      width: 60%;
      margin-right: 10px;
      overflow: auto;
      border: 1px solid #e0e3e5;

      &::-webkit-scrollbar {
        display: none;
        width: 0;
      }

      .selectedItem {
        position: relative;
        height: 20px;
        padding: 2px 15px;
        margin: 7px 10px;
        line-height: 20px;
        background: #e0e3e5;
        border-radius: 4px;

        .delBodyItem {
          position: absolute;
          top: -7px;
          right: 3px;
          display: block;
          width: 5px;
          height: 5px;
          cursor: pointer;

          .el-icon-close {
            &::before {
              font-size: 12px;
              font-weight: 600 !important;
              content: '' !important;
            }
          }
        }
      }
    }
  }
}

::v-deep {
  .el-dialog__body {
    .el-form-item {
      width: calc(100% / 3);
    }
  }
}
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
::v-deep .radioGroup {
  position: relative;
  width: 100%;
  height: 30px;
  padding-left: 20px;
  line-height: 30px;

  .title {
    padding-left: 30px;
    font-size: 10px;
    color: #409eff;
  }
}
</style>
