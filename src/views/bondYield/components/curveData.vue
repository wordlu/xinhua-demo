<template>
  <div>
    <BaseForm
      :form-data="searchFormData"
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
      <template v-slot:periodType="{ data, rowItem }">
        <el-form-item :label="rowItem.label" class="formItem isformItem">
          <el-radio-group v-model="data.periodType" class="isRadioChange" @change="onRadioChange">
            <el-radio label="1" class="isRadio">
              <el-form-item :span="20" style="display: inline-block;">
                <span class="gray">剩余期限区间：</span>
                <el-input
                  v-model="data.remainPeriodBegNum"
                  :disabled="data.periodType === '2'"
                  style="width: 100px"
                >
                </el-input>
                <span class="gray">到</span>
                <el-input
                  v-model="data.remainPeriodEndNum"
                  :disabled="data.periodType === '2'"
                  style="width: 100px"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="步长:" label-width="80px" style="display: inline-block;">
                <el-select
                  v-model="data.dataStep"
                  placeholder="请选择"
                  :disabled="data.periodType === '2'"
                >
                  <el-option
                    v-for="item in rowItem.dataStepList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-radio>
            <el-radio label="2" class="isRadio">
              <el-form-item label="关键剩余期限:" label-width="100px">
                <el-select
                  v-model="data.criticalPeriodList"
                  multiple
                  collapse-tags
                  placeholder="请选择"
                  :disabled="data.periodType === '1'"
                >
                  <el-option
                    v-for="item in rowItem.criticalPeriodList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
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
    <div>
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
    </div>
  </div>
</template>

<script>
import { searchFormData } from '../libs/turnoverRate-data.js'
import BaseForm from '@components/BaseForm/index.vue'
import BaseTable from '@components/BaseTable'
import * as service from '@api/bondValuation'
import { baseDownLoad } from '@utils/util'
export default {
  components: {
    BaseTable,
    BaseForm
  },
  data() {
    return {
      searchFormData,
      setOptions: {},
      columns: [],
      dataList: [],
      tableLoading: false,
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      searchParams: {}
    }
  },
  methods: {
    commonForm(val) {
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 50
      }
      this.searchParams = { ...val }
      this.submitForm()
    },
    submitForm() {
      this.$nextTick(async () => {
        const result = await this.validatePeriod()
        if (!result) {
          this.$message({
            message: '请完善期限类型',
            type: 'warning'
          })
          return
        }
        const { beginDate, endDate } = this.searchParams
        if (endDate < beginDate) {
          this.$message({
            message: '结束日期必须大于开始日期',
            type: 'warning'
          })
          return
        }
        let params = {
          ...this.searchParams,
          pageNum: this.table.currentPage,
          pageSize: this.table.pageSize
        }
        this.tableLoading = true
        service
          .postcurveDataQuery(params)
          .then(res => {
            if (res.status === 200) {
              const { list, total } = res.data
              this.dataList = list
              this.table.total = total
              this.columns = []
              if (list.length > 0) {
                for (let i = 0; i < Object.getOwnPropertyNames(list[0]).length - 1; i++) {
                  this.columns.push({
                    label: i === 0 ? '序号' : i + '',
                    prop: i + '',
                    align: 'center',
                    width: i === 0 ? 100 : ''
                  })
                }
              }
            }
            this.tableLoading = false
          })
          .catch(() => {
            this.tableLoading = false
          })
      })
    },
    validatePeriod() {
      return new Promise((resolve, reject) => {
        const {
          periodType,
          remainPeriodBegNum,
          remainPeriodEndNum,
          dataStep,
          criticalPeriodList
        } = this.searchParams
        if (periodType === '1') {
          if (
            remainPeriodBegNum &&
            remainPeriodEndNum &&
            dataStep &&
            remainPeriodEndNum >= remainPeriodBegNum
          ) {
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          if (criticalPeriodList.length < 1) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
      })
    },
    rowExport() {
      if (this.dataList.length < 1) {
        this.$message({
          message: '暂无数据导出',
          type: 'warning'
        })
        return false
      }
      this.onExport('vertical')
    },
    colExport() {
      if (this.dataList.length < 1) {
        this.$message({
          message: '暂无数据导出',
          type: 'warning'
        })
        return false
      }
      this.onExport('horizontal')
    },
    // 导出 横向：horizontal， 竖向：vertical
    onExport(type) {
      let data = {
        ...this.searchParams
      }
      if (type === 'horizontal') {
        baseDownLoad(service.curveDataExcel, data)
      } else {
        baseDownLoad(service.curveDataExcelVertical, data)
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
    onRadioChange(val) {
      if (val === '2') {
        this.searchParams.remainPeriodBegNum = ''
        this.searchParams.remainPeriodEndNum = ''
        this.searchParams.dataStep = ''
      } else {
        this.searchParams.criticalPeriodList = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.isRadioChange {
  position: relative;
  width: 100%;
  .isRadio {
    position: relative;
    width: calc(50% - 50px);

    ::v-deep .el-radio__input {
      position: relative;
      top: 12px;
      left: 0;
      float: left;
    }
    ::v-deep .el-radio__label {
      position: relative;
      float: left;
      color: #606266;
    }
    ::v-deep .is-checked {
      position: relative;
      top: 12px;
    }
  }
}
.tips {
  margin-left: 20px;
  font-size: 12px;
}
</style>
