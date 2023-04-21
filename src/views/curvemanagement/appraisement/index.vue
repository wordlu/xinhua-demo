<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <BaseForm
        :form-data="formData"
        :label-width="80"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @download="download"
        @resetForm="resetForm"
      />
      <BaseTable
        :columns="columns"
        has-pagination
        :page-size="1"
        :data-source="tableList"
        :current-page="table.currentPage"
        :total="table.total"
        :loading="tableLoading"
        :page-sizes="[20, 50, 100]"
        @handleCurrent="handleCurrent"
        @handleSize="handleSize"
      />
    </el-container>
  </div>
</template>
<script>
import { formData, columns } from './libs/data'
import BeforeLineTitle from '@components/CommonTitle'
import BaseTable from '@components/BaseTable'
import BaseForm from '@components/BaseForm/index.vue'
import { removeNullInObject, baseDownLoad } from '@utils/util'
import * as service from '@api/curveManagement'
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'CurvemanagementAppraisement',
  components: {
    BeforeLineTitle,
    BaseTable,
    BaseForm
  },
  mixins: [keepMixin],
  data() {
    return {
      beforeTitle: '标准估值异常情况查询',
      setOptions: {},
      formData,
      columns,
      tableList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      tableLoading: false,
      searchParams: {}
    }
  },
  mounted() {},
  methods: {
    getQueryForm(formData) {
      this.searchParams = { ...formData }
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      this.queryForm()
    },
    queryForm() {
      const { startDate, endDate } = this.searchParams
      if (endDate < startDate) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning'
        })
        return
      }
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        ...removeNullInObject(this.searchParams)
      }
      this.tableLoading = true
      service
        .getvaluatQueryData(params)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.tableList = list
            this.table.total = total
            this.tableLoading = false
          } else {
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleSize(val) {
      this.table.pageSize = val
      this.table.currentPage = 1
      this.queryForm()
    },
    handleCurrent(val) {
      this.table.currentPage = val
      this.queryForm()
    },
    resetForm(val) {
      this.formData.initData = val
      this.searchParams = {}
    },
    download() {
      if (this.tableList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      baseDownLoad(service.getvaluatOutExcel, this.searchParams, this.table.total)
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
</style>
