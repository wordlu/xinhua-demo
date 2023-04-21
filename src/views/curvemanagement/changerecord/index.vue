<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeLineTitle" />
      <BaseForm
        :form-data.sync="formData"
        :label-width="80"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @download="download"
        @resetForm="resetForm"
        @getRemoteMethod="getRemoteMethod"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @blurValue="blurValue"
        @selectPageChange="selectPageChange"
        @selectVisible="selectVisible"
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
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm/index.vue'
import { formData, columns, renderFrom } from './libs/data'
import BaseTable from '@components/BaseTable'
import * as service from '@api/curveManagement'
import * as servicerat from '@api/ratemanagement'
import { removeNullInObject, baseDownLoad } from '@utils/util'
import keepMixin from '@mixins/keep.mixin'
import initMixin from './mixins/initData.mixin'
import { cloneDeep } from 'lodash'
export default {
  name: 'CurvemanagementChangerecord',
  components: {
    BeforeLineTitle,
    BaseForm,
    BaseTable
  },
  mixins: [keepMixin, initMixin],
  data() {
    return {
      beforeLineTitle: '标准曲线分组变更记录查询',
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
      renderFromCopy: []
    }
  },
  created() {
    this.initDict()
  },
  methods: {
    initDict() {
      this.renderFromCopy = cloneDeep(renderFrom)
      this.$set(this.formData, 'renderFrom', this.renderFromCopy)
      servicerat.getOrgNamePageList({ pageNum: 1, pageSize: 6 }).then(res => {
        if (res && res.status === 200) {
          let { list, total } = res.data
          this.$set(this.setOptions, 'orgNameList', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'orgNameList')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initOrg = { list, total, index }
        }
      }) // 主体名称初始化
      servicerat.getBndNamePageList({ pageNum: 1, pageSize: 6 }).then(res => {
        if (res && res.status === 200) {
          let { list, total } = res.data
          this.$set(this.setOptions, 'bndAbbrNmList', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'bndAbbrNmList')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initBnd = { list, total, index }
        }
      }) // 债券简称列表
      servicerat.getBndCodeData().then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'bndCdList', res.data)
          this.bndCd = [...res.data]
        }
      }) // 债券代码初始化数据
      service.getChangeCurveList({ type: '0' }).then(res => {
        if (res && res.status === 200) {
          const { bfoCurveNameList, aftCurveNameList } = res.data
          const arr = [{ code: '0', name: '空值' }]
          let bfoCurveName = [...arr, ...bfoCurveNameList]
          let aftCurveName = [...arr, ...aftCurveNameList]
          this.$set(this.setOptions, 'bfoCurveNameList', bfoCurveName)
          this.$set(this.setOptions, 'aftCurveNameList', aftCurveName)
        }
      })
    },
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
      const { startTime, endTime } = this.searchParams
      if (endTime < startTime) {
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
      if (params.orgNameList && params.orgNameList.length === 1) {
        if (this.setOptions.orgNameList.length === 0) {
          params.blurryObjName = params.orgNameList
          params.blurryObjName = params.blurryObjName.join('')
          delete params.orgNameList
        }
      }
      if (params.bndAbbrNmList && params.bndAbbrNmList.length === 1) {
        if (this.setOptions.bndAbbrNmList.length === 0) {
          params.blurryBndName = params.bndAbbrNmList
          params.blurryBndName = params.blurryBndName.join('')
          delete params.bndAbbrNmList
        }
      }
      this.tableLoading = true
      service
        .getgroupChangeQuery(params)
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
    download() {
      if (this.tableList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      baseDownLoad(service.getgroupChangeOutExcel, this.searchParams, this.table.total)
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
      this.resetSelect('orgNameList')
      this.resetSelect('bndAbbrNmList')
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
