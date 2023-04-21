<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'债券交易信息查询'" />
      <div class="noBorder">
        <BaseSelect
          ref="select"
          :options="selectData"
          @handleEmpty="handleEmpty"
          @deleteItem="deleteItem"
          @getTransferData="getTransferData"
          @getItemRemoteMethod="getItemRemoteMethod"
          @importDialogSure="importDialogSure"
          @trigger="selectTrigger"
          @handleDialogClose="close"
          @handleExport="handleExport"
          @handleCurrentChangeOrg="handleCurrentChangeOrg"
          @blurValue="blurValue"
          @selectOpen="selectOpen('org')"
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
        <!-- 选择债券 -->
        <BaseSelect
          ref="selectBnd"
          :options="selectBndtData"
          @handleEmpty="handleBndmpty"
          @deleteItem="deleteBndItem"
          @handleDialogClose="closeBnd"
          @importDialogSure="importDialogSureBnd"
          @selectSubmitForm="submitFormBnd"
          @selectOpen="selectOpen('bnd')"
          @blurValue="blurValue"
          @selectPageChange="selectPageChangeBnd"
        >
          <template v-slot:customForm="{ options }">
            <!-- 自定义表单 -->
            <BaseForm
              ref="selectForm"
              :form-data="options.formData"
              :label-width="options.formLabelWith"
              :set-options="options.setOptions"
              @trigger="selectBndTrigger"
              @getRemoteMethod="getBndItemRemoteMethod"
              @queryForm="getBndTransferData"
              @exportBnd="exportFormBnd"
              @templateDownload="templateDownload"
              @blurValue="blurValueBnd"
              @handleCurrentChangeOrg="handleCurrentChangeBnd"
              @selectPageChange="selectPageChangeBnd"
              @resetForm="resetFormBnd"
            >
              <!-- (含权)剩余期限 -->
              <template v-slot:remainPeriod="{ data, rowItem }">
                <el-form-item :label="rowItem.label" class="rowItem">
                  <el-row class="fix-number">
                    <el-col :span="11">
                      <el-form-item prop="remainPeriodBegNum">
                        <el-input
                          v-model="data.remainPeriodBegNum"
                          placeholder="请输入"
                          @input="inputFormat(data.remainPeriodBegNum, 'remainPeriodBegNum')"
                        >
                          <template slot="append"
                            >年</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-form-item prop="remainPeriodEndNum">
                        <el-input
                          v-model="data.remainPeriodEndNum"
                          placeholder="请输入"
                          @input="inputFormat(data.remainPeriodEndNum, 'remainPeriodEndNum')"
                        >
                          <template slot="append"
                            >年</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <!-- 发行规模 -->
              <template v-slot:issueScale="{ data, rowItem }">
                <el-form-item :label="rowItem.label" class="rowItem">
                  <el-row class="fix-number">
                    <el-col :span="11">
                      <el-form-item prop="issueScaleBegNum">
                        <el-input
                          v-model="data.issueScaleBegNum"
                          placeholder="请输入"
                          @input="inputFormat(data.issueScaleBegNum, 'issueScaleBegNum')"
                        >
                          <template slot="append"
                            >亿元</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-form-item prop="issueScaleEndNum">
                        <el-input
                          v-model="data.issueScaleEndNum"
                          placeholder="请输入"
                          @input="inputFormat(data.issueScaleEndNum, 'issueScaleEndNum')"
                        >
                          <template slot="append"
                            >亿元</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <!-- 发行利率 -->
              <template v-slot:issueInterRate="{ data, rowItem }">
                <el-form-item :label="rowItem.label" class="rowItem">
                  <el-row class="fix-number">
                    <el-col :span="11">
                      <el-form-item prop="issueRateBegNum">
                        <el-input
                          v-model="data.issueRateBegNum"
                          placeholder="请输入"
                          @input="inputFormat(data.issueRateBegNum, 'issueRateBegNum')"
                        >
                          <template slot="append"
                            >%</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-form-item prop="issueRateEndNum">
                        <el-input
                          v-model="data.issueRateEndNum"
                          placeholder="请输入"
                          @input="inputFormat(data.issueRateEndNum, 'issueRateEndNum')"
                        >
                          <template slot="append"
                            >%</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <!-- 剩余规模 -->
              <template v-slot:surplusScale="{ data, rowItem }">
                <el-form-item :label="rowItem.label" class="rowItem">
                  <el-row class="fix-number mb10">
                    <el-col :span="11">
                      <el-form-item prop="surplusScaleBegNum">
                        <el-input
                          v-model="data.surplusScaleBegNum"
                          placeholder="请输入"
                          @input="inputFormat(data.surplusScaleBegNum, 'surplusScaleBegNum')"
                        >
                          <template slot="append"
                            >亿元</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-form-item prop="surplusScaleEndNum">
                        <el-input
                          v-model="data.surplusScaleEndNum"
                          placeholder="请输入"
                          @input="inputFormat(data.surplusScaleEndNum, 'surplusScaleEndNum')"
                        >
                          <template slot="append"
                            >亿元</template
                          >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
            </BaseForm>
          </template>
          <template v-slot:customTransfer="{ transferData, selectedData, total }">
            <!-- 自定义穿梭框 -->
            <CustomTransfer
              ref="customTransferBnd"
              :transfer-data="transferData"
              :selected-data="selectedData"
              :total="total"
              :transfer-type="'债券简称'"
              @handleCurrentChange="handleBndCurrentChange"
              @searchInputLeft="searchBndInputLeft"
            ></CustomTransfer>
          </template>
          <template v-slot:footer>
            <el-button @click="closeBnd">取消</el-button>
            <el-button type="primary" @click="submitFormBnd">保存</el-button>
          </template>
        </BaseSelect>
      </div>
      <div class="querySearch">
        <BaseForm
          :key="baseKey"
          :form-data="formData"
          :label-width="120"
          :set-options="setOptions"
          @queryForm="commonForm"
          @handleExport="handleExport"
        />
      </div>
      <BaseTable
        :loading="tableLoading"
        :columns="getColumns"
        has-pagination
        :data-source="tableData"
        :page-size="1"
        :current-page="table.currentPage"
        :total="table.total"
        :page-sizes="[50, 100, 200, 500]"
        @handleSize="handleSizeChange"
        @handleCurrent="handleCurrent"
      />
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseTable from '@components/BaseTable'
import * as service from '@api/bondYield'
import { mapGetters } from 'vuex'
import { initData, baseDownLoad } from '@utils/util'
import BaseSelect from '@components/BaseSelect'
import initDictMixin from '../valuation/multiagent/mixins/initData.mixin'
import CustomTransfer from '../valuation/multiagent/components/customTransfer.vue'
import BaseForm from '@components/BaseForm/index.vue'
import { formData, columns } from './libs/tradeInfoData.js'
import keepMixin from '@mixins/keep.mixin'
import { cloneDeep } from 'lodash'
import * as org from '@views/valuation/multiagent/libs/selectFormData'
import * as bnd from '@libs/selectBndFormData'

export default {
  name: 'BondTradeInformation',
  components: {
    BeforeLineTitle,
    BaseTable,
    BaseSelect,
    CustomTransfer,
    BaseForm
  },
  mixins: [initDictMixin, keepMixin],
  data() {
    return {
      tableLoading: false, // 表格loading
      formData,
      setOptions: {},
      gicsIndustryList: [], // gis行业
      innerIndustryList: [], // 内部行业
      swIndustryList: [], // 申万行业
      orgAnalystList: [], // 主体分析师
      getColumns: [],
      searchParam: {},
      industryList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      tableData: [],
      rules: {
        beginDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
        calType: [{ required: true, message: '请选择汇总或逐笔', trigger: 'change' }]
      },
      baseKey: 1,
      selectParams: {},
      selectParamsBnd: {},
      renderFromCopy: [],
      renderFromCopys: []
    }
  },
  computed: {
    ...mapGetters({ ableDate: 'ableDate' })
  },
  created() {
    this.getColumns = columns
  },
  methods: {
    // 优化主体
    close() {
      this.$refs.customTransfer.selectedRight = []
      this.$refs.customTransfer.codeArrRight = []
      this.selectData.transferData = []
      this.selectData.total = 0
      this.$refs.customTransfer.pageLeft.currentPage = 1
      this.renderFromCopy = cloneDeep(org.renderFrom)
      const { formData } = this.selectData
      this.$set(formData, 'initData', initData(formData.renderFrom))
      this.$set(formData, 'renderFrom', this.renderFromCopy)
      this.initSelect('org')
      this.$refs.select.isShow = false
    },
    handleEmpty() {
      this.$set(this.selectData, 'selectedData', [])
      this.searchParam.orgList = []
      this.selectParams = []
    },
    // 主体选择器保存
    submitForm() {
      if (!this.selectData.isShowTransfer) {
        const selectedRight = this.$refs.customTransfer.selectedRight || []
        const dataListRight = this.$refs.customTransfer.dataListRight
        this.selectParams = selectedRight.length > 0 ? selectedRight : dataListRight
        if (this.selectParams.length > 50) {
          this.$message.warning('最多选择50个主体')
          return false
        } else {
          this.$set(this.selectData, 'selectedData', this.selectParams)
          this.close()
        }
      }
    },
    selectOpen(type) {
      this.initSelect(type)
    },
    deleteItem(index) {
      this.selectData.selectedData.splice(index, 1)
    },
    resetFormBnd() {
      this.initSelect('bnd')
    },
    resetFormOrg() {
      this.initSelect('org')
    },
    // 债券选择器
    closeBnd() {
      this.$refs.customTransferBnd.selectedRight = []
      this.$refs.customTransferBnd.codeArrRight = []
      this.selectBndtData.transferData = []
      this.selectBndtData.total = 0
      this.$refs.customTransferBnd.pageLeft.currentPage = 1
      this.renderFromCopys = cloneDeep(bnd.renderFrom)
      const { formData } = this.selectBndtData
      this.$set(formData, 'initData', initData(formData.renderFrom))
      this.$set(formData, 'renderFrom', this.renderFromCopys)
      this.initSelect('bnd')
      this.$refs.selectBnd.isShow = false
    },
    handleBndmpty() {
      this.$set(this.selectBndtData, 'selectedData', [])
      this.searchParam.bndList = []
      this.selectParamsBnd = []
    },
    deleteBndItem(index) {
      this.selectBndtData.selectedData.splice(index, 1)
    },
    exportFormBnd() {
      this.$refs.selectBnd.$refs.dialog.importDialogOpen()
    },
    templateDownload() {
      service.bondTemplate()
    },
    submitFormBnd() {
      if (!this.selectBndtData.isShowTransfer) {
        const selectedRight = this.$refs.customTransferBnd.selectedRight || []
        const dataListRight = this.$refs.customTransferBnd.dataListRight
        this.selectParamsBnd = selectedRight.length > 0 ? selectedRight : dataListRight
        if (this.selectParamsBnd.length > 200) {
          this.$message.warning('最多选择200个债券')
          return false
        } else {
          this.$set(this.selectBndtData, 'selectedData', this.selectParamsBnd)
          this.closeBnd()
        }
      }
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this.selectBndtData.formData.initData[key] = value
    },
    initIndustry() {
      let params = this.globalDictMap(2060).map(item => {
        return item.code
      })
      this.getIndustry(params[0]).then(res => (this.gicsIndustryList = res.data))
      this.getIndustry(params[1]).then(res => {
        this.innerIndustryList = res.data
      })
      this.getIndustry(params[2]).then(res => {
        this.swIndustryList = res.data
      })
    },
    // 保存表单数据
    commonForm(val) {
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 50
      }
      this.searchParam = { ...val }
      this.query()
    },
    query() {
      const { endDate, beginDate } = this.searchParam
      const orgList =
        this.selectData.selectedData.map(item => {
          return item.code
        }) || []
      const bndList =
        this.selectBndtData.selectedData.map(item => {
          return item.code
        }) || []
      if (Number(endDate) < Number(beginDate)) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning'
        })
        return
      }
      let params = {
        ...this.searchParam,
        bndList,
        orgList,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize
      }
      this.tableLoading = true
      this.getColumns = []
      service
        .getBondQuery(params)
        .then(res => {
          this.tableLoading = false
          if (res && res.status === 200) {
            let { data } = res
            const columnsTxt = [...columns]
            this.getColumns =
              this.searchParam.rateOrInterMargin === '1'
                ? columnsTxt.filter(i => !i.rateOrInterMargin || i.rateOrInterMargin === '1')
                : columnsTxt.filter(i => !i.rateOrInterMargin || i.rateOrInterMargin === '2')
            const expireRateIndex = this.getColumns.findIndex(ii => ii.prop === 'expireRate')
            this.getColumns[expireRateIndex].label =
              this.searchParam.risklessRate === '269'
                ? '同期剩余期限中债国开债到期收益率(%)'
                : '同期剩余期限中债国债到期收益率(%)'
            this.tableData = data.list
            this.table.total = data.total
          } else {
            this.tableData = []
            this.table.total = 0
          }
        })
        .catch(() => {
          this.tableLoading = false
          this.tableData = []
          this.table.total = 0
        })
    },
    handleExport() {
      const orgList =
        this.selectData.selectedData.map(item => {
          return item.code
        }) || []
      const bndList =
        this.selectBndtData.selectedData.map(item => {
          return item.code
        }) || []
      if (orgList.length === 0 && bndList.length === 0) {
        this.$message.warning('请先选择主体或者债券')
        return
      }
      let params = {
        ...this.searchParam,
        bndList,
        orgList
      }
      baseDownLoad(service.bondExport, params)
    },
    handleSizeChange(v) {
      this.table.pageSize = v
      this.table.currentPage = 1
      this.query()
    },
    handleCurrent(v) {
      this.table.currentPage = v
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './libs/common.scss';

@mixin scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
}
::v-deep .BaseSelect .el-dialog {
  width: 1300px !important;
  margin-top: 3vh !important;
}
::v-deep {
  .el-dialog__body {
    padding: 10px 20px;
    // .el-form-item {
    //   width: (100% / 3);
    // }
    .el-input-group__append {
      padding: 0 10px;
      font-size: 12px;
    }
  }
}

.querySearch {
  padding: 0;
}

.configMain {
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
  }
}

.el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;

  ::v-deep .el-form-item__content {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 280px !important;
    }

    .el-select {
      width: 280px;

      .el-input {
        .el-input__inner {
          padding-right: 51px !important;
        }
      }
    }
  }
}

.fix-number {
  width: 280px;

  .el-form-item {
    width: 100% !important;
  }
}
</style>
