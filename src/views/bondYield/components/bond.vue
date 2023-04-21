<template>
  <div>
    <!-- 选择主体 -->
    <BaseSelect
      ref="selectOrg"
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
        <el-button type="primary" @click="submitFormDig">保存</el-button>
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
      @blurValue="blurValue"
      @selectOpen="selectOpen('bnd')"
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
                <el-col :span="2" class="textAlign">-</el-col>
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
                <el-col :span="2" class="textAlign">-</el-col>
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
                <el-col :span="2" class="textAlign">-</el-col>
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
                <el-col :span="2" class="textAlign">-</el-col>
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
    <div class="querySearch">
      <BaseForm
        :form-data="formData"
        :label-width="120"
        :set-options="setOptions"
        @queryForm="commonForm"
        @rowExport="rowExport"
        @colExport="colExport"
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
    </div>
    <BaseTable
      :columns="columns"
      has-pagination
      :loading="tableLoading"
      :data-source="dataList"
      :current-page="table.currentPage"
      :total="table.total"
      :page-size="table.pageSize"
      :page-sizes="[50, 100, 200, 500]"
      @handleSize="handleSizeChange"
      @handleCurrent="handleCurrent"
    />
  </div>
</template>

<script>
import BaseSelect from '@components/BaseSelect'
import BaseTable from '@components/BaseTable'
import CustomTransfer from '../../valuation/multiagent/components/customTransfer.vue'
import BaseForm from '@components/BaseForm/index.vue'
import { formData } from '../libs/apraisement-data.js'
import { initData, baseDownLoad } from '@utils/util'
import initDictMixin from '../../valuation/multiagent/mixins/initData.mixin.js'
import * as org from '@views/valuation/multiagent/libs/selectFormData'
import * as bnd from '@libs/selectBndFormData'
import * as service from '@api/bondValuation'
import * as servdeal from '@api/bondYield'
import { cloneDeep } from 'lodash'
export default {
  components: {
    BaseTable,
    BaseSelect,
    CustomTransfer,
    BaseForm
  },
  mixins: [initDictMixin],
  data() {
    return {
      formData,
      setOptions: {},
      searchParams: {},
      tableLoading: false,
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      dataList: [],
      columns: [],
      selectParams: [],
      selectParamsBnd: [],
      renderFromCopy: [],
      renderFromCopys: []
    }
  },
  created() {
    // gdm添加的按钮权限，尽量别删
    this.formData.butData[0].btnShow = 32003
    this.formData.butData[1].btnShow = 32004
  },
  methods: {
    // 主体选择器
    close() {
      this.$refs.customTransfer.selectedRight = []
      this.$refs.customTransfer.codeArrRight = []
      this.selectData.transferData = []
      this.selectData.total = 0
      this.$refs.customTransfer.pageLeft.currentPage = 1
      this.renderFromCopy = cloneDeep(org.renderFrom)
      this.$set(this.selectData.formData, 'initData', initData(this.selectData.formData.renderFrom))
      this.$set(this.selectData.formData, 'renderFrom', this.renderFromCopy)
      this.initSelect('org')
      this.$refs.selectOrg.isShow = false
    },
    deleteItem(index) {
      this.selectData.selectedData.splice(index, 1)
    },
    submitFormDig() {
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
    resetFormBnd() {
      this.initSelect('bnd')
    },
    resetFormOrg() {
      this.initSelect('org')
    },
    handleEmpty() {
      this.$set(this.selectData, 'selectedData', [])
      this.searchParams.orgList = []
      this.selectParams = []
    },
    // 债券选择器
    closeBnd() {
      this.$refs.customTransferBnd.selectedRight = []
      this.$refs.customTransferBnd.codeArrRight = []
      this.selectBndtData.transferData = []
      this.selectBndtData.total = 0
      this.$refs.customTransferBnd.pageLeft.currentPage = 1
      this.renderFromCopys = cloneDeep(bnd.renderFrom)
      this.$set(
        this.selectBndtData.formData,
        'initData',
        initData(this.selectBndtData.formData.renderFrom)
      )
      this.$set(this.selectBndtData.formData, 'renderFrom', this.renderFromCopys)
      this.initSelect('bnd')
      this.$refs.selectBnd.isShow = false
    },
    handleBndmpty() {
      this.$set(this.selectBndtData, 'selectedData', [])
      this.searchParams.bndList = []
      this.selectParamsBnd = []
    },
    deleteBndItem(index) {
      this.selectBndtData.selectedData.splice(index, 1)
    },
    exportFormBnd() {
      this.$refs.selectBnd.$refs.dialog.importDialogOpen()
    },
    templateDownload() {
      servdeal.bondTemplate()
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
    // 表单查询
    commonForm(data) {
      this.searchParams = { ...data }
      const { endDate, beginDate } = this.searchParams
      if (endDate < beginDate) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning'
        })
        return
      }
      if (this.selectParams.length < 1 && this.selectParamsBnd.length < 1) {
        this.$message({
          message: '请选择主体或者债券',
          type: 'warning'
        })
        return
      }
      this.table.currentPage = 1
      this.table.pageSize = 50
      this.getData()
    },
    getData() {
      const orgList =
        this.selectParams.map(item => {
          return item.code
        }) || []
      const bndList =
        this.selectParamsBnd.map(item => {
          return item.code
        }) || []
      let params = {
        ...this.searchParams,
        bndList: bndList,
        orgList: orgList,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize
      }
      this.tableLoading = true
      service
        .postbndValuatInfoList(params)
        .then(res => {
          this.tableLoading = false
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.dataList = list
            this.table.total = total
            if (list.length > 0) {
              this.columns = []
              for (let i = 0; i < Object.getOwnPropertyNames(list[0]).length - 1; i++) {
                this.columns.push({
                  label: i === 0 ? '序号' : i + '',
                  prop: i + '',
                  align: 'center',
                  width: i === 0 ? 100 : ''
                })
              }
            }
          } else {
            this.dataList = []
            this.columns = []
            this.table.total = 0
          }
        })
        .catch(() => {
          this.tableLoading = false
          this.dataList = []
          this.columns = []
          this.table.total = 0
        })
    },
    rowExport() {
      if (this.dataList.length < 1) {
        this.$message.warning('请查询数据后导出')
        return false
      }
      this.onExport('horizontal')
    },
    colExport() {
      if (this.dataList.length < 1) {
        this.$message.warning('请查询数据后导出')
        return false
      }
      this.onExport('vertical')
    },
    handleCurrent(page) {
      this.table.currentPage = page
      this.getData()
    },
    handleSizeChange(size) {
      this.table.pageSize = size
      this.table.currentPage = 1
      this.getData()
    },
    // 导出 横向：horizontal， 竖向：vertical
    onExport(type) {
      const orgList =
        this.selectParams.map(item => {
          return item.code
        }) || []
      const bndList =
        this.selectParamsBnd.map(item => {
          return item.code
        }) || []

      if (orgList.length === 0 && bndList.length === 0) {
        this.$message.warning('请先选择主体或者债券')
        return
      }
      let data = {
        ...this.searchParams,
        bndList,
        orgList
      }
      type === 'horizontal'
        ? baseDownLoad(service.bndExcel, data)
        : baseDownLoad(service.bndExcelVertical, data)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .BaseSelect .el-dialog {
  width: 1300px !important;
  margin-top: 3vh !important;
}
::v-deep {
  .el-dialog__body {
    .el-input-group__append {
      padding: 0 2px;
      font-size: 12px;
    }
  }
  .el-form-item {
    margin-left: 0 !important;
  }
}
.rowItem {
  margin-bottom: 0 !important;
  .textAlign {
    text-align: center;
  }
}
</style>
