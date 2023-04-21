<template>
  <div>
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
    <div class="querySearch">
      <BaseForm
        :form-data="virtualBondFormData"
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
    <div>
      <span class="tips">单位：%</span>
      <BaseTable
        :columns="columns"
        has-pagination
        :loading="tableLoading"
        :page-size="1"
        :data-source="dataList"
        :current-page="table.currentPage"
        :total="table.total"
        :page-sizes="[50, 100, 200, 500]"
        @handleSize="handleSizeChange"
        @handleCurrent="handleCurrent"
      />
    </div>
  </div>
</template>

<script>
import BaseSelect from '@components/BaseSelect'
import BaseTable from '@components/BaseTable'
import CustomTransfer from '../../valuation/multiagent/components/customTransfer.vue'
import BaseForm from '@components/BaseForm/index.vue'
import { virtualBondFormData } from '../libs/apraisement-data.js'
import { initData, baseDownLoad } from '@utils/util'
import initDictMixin from '../../valuation/multiagent/mixins/initData.mixin.js'
import * as service from '@api/bondValuation'
import { cloneDeep } from 'lodash'
import * as org from '@views/valuation/multiagent/libs/selectFormData'
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
      virtualBondFormData,
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
      renderFromCopy: []
    }
  },
  created() {
    // gdm添加的按钮权限，尽量别删
    this.virtualBondFormData.butData[0].btnShow = 32007
    this.virtualBondFormData.butData[1].btnShow = 32008
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
      const { formData } = this.selectData
      this.$set(formData, 'initData', initData(formData.renderFrom))
      this.$set(formData, 'renderFrom', this.renderFromCopy)
      this.initSelect('org')
      this.$refs.select.isShow = false
    },
    deleteItem(index) {
      this.selectData.selectedData.splice(index, 1)
    },
    resetFormOrg() {
      this.initSelect('org')
    },
    submitFormDig() {
      if (!this.selectData.isShowTransfer) {
        const selectedRight = this.$refs.customTransfer.selectedRight || []
        const dataListRight = this.$refs.customTransfer.dataListRight
        this.selectParams = selectedRight.length > 0 ? selectedRight : dataListRight
        if (this.selectParams.length > 500) {
          this.$message.warning('最多选择500个主体')
          return false
        } else {
          this.$set(this.selectData, 'selectedData', this.selectParams)
          this.close()
        }
      }
    },
    handleEmpty() {
      this.$set(this.selectData, 'selectedData', [])
      this.searchParams.orgCdList = []
      this.selectParams = []
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
      if (this.selectParams.length < 1) {
        this.$message({
          message: '请选择主体',
          type: 'warning'
        })
        return
      }
      this.table.currentPage = 1
      this.table.pageSize = 50
      this.getData()
    },
    selectOpen(type) {
      this.initSelect(type)
    },
    getData() {
      const orgList =
        this.selectParams.map(item => {
          return item.code
        }) || []
      let params = {
        ...this.searchParams,
        orgList: orgList,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize
      }
      this.dataList = []
      this.columns = []
      this.tableLoading = true
      service
        .postficBndQueryList(params)
        .then(res => {
          this.tableLoading = false
          if (res.error) {
            this.$message({
              message: res.error.message,
              type: 'error'
            })
            this.tableLoading = false
            this.dataList = []
            this.columns = []
            this.table.total = 0
          } else {
            const { list, total } = res.data
            this.dataList = list
            this.table.total = total
            for (let i = 0; i < Object.getOwnPropertyNames(list[0]).length - 1; i++) {
              this.columns.push({
                label: i === 0 ? '序号' : i + '',
                prop: i + '',
                align: 'center',
                width: i === 0 ? 100 : ''
              })
            }
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
      // this.selectParams
      const orgList =
        this.selectParams.map(item => {
          return item.code
        }) || []
      if (orgList.length === 0 || this.bndList === 0) {
        this.$message.warning('请先选择主体或者债券')
        return
      }
      let data = {
        ...this.searchParams,
        bndList: this.bndList,
        orgList
      }
      type === 'horizontal'
        ? baseDownLoad(service.ficBndExcel, data)
        : baseDownLoad(service.ficBndExcelVertical, data)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .BaseSelect .el-dialog {
  width: 1300px !important;
  margin-top: 3vh !important;
}
.tips {
  margin-left: 20px;
  font-size: 12px;
}
</style>
