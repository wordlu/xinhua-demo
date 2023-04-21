<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="角色功能变更记录" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
        @queryForm="queryForm"
        @download="download"
      />
      <BaseTable
        :data-source="dataList"
        :columns="list"
        :total="total"
        :page-size="table.pageSize"
        :current-page="table.pageNum"
        :loading="false"
        :page-sizes="[10, 50, 100]"
        has-pagination
        @handleCurrent="changeCurrent"
        @handleSize="changeSize"
      />
    </el-container>
  </div>
</template>
<script>
import BaseForm from '@components/BaseForm'
import BaseTable from '@components/BaseTable'
import BeforeLineTitle from '@components/CommonTitle'
import { formData, list, renderFrom } from './libs/function'
import keepMixin from '@mixins/keep.mixin'
import { baseDownLoad } from '@utils/util'
import cloneDeep from 'lodash/cloneDeep'

import { getUserChangeDropDownAPI, getUserchanFgeListAPI, exportRoleMenuChange } from '@api/manage'
export default {
  name: 'Function',
  components: {
    BaseForm,
    BaseTable,
    BeforeLineTitle
  },
  mixins: [keepMixin],
  data() {
    return {
      setOptions: {},
      total: null,
      table: {
        pageNum: 1,
        pageSize: 10
      },
      // form表单的数据
      formData,
      // 表格需要发送的数据
      list,
      // 表格数据
      dataList: [],
      formList: {},
      renderFromCopy: []
    }
  },
  created() {
    this.renderFromCopy = cloneDeep(renderFrom)
    this.$set(this.formData, 'renderFrom', this.renderFromCopy)
    this.getUserChangeDropDownFN('roleName')
    this.getUserChangeDropDownFN('menuName')
  },
  methods: {
    changeCurrent(val) {
      this.table.pageNum = val
      this.queryForm(this.formList, true)
    },
    changeSize(val) {
      this.table.pageSize = val
      this.table.pageNum = 1
      this.queryForm(this.formList, true)
    },
    async queryForm(val, flag) {
      this.formList = val
      const { beginDate, endDate } = val
      if (!flag) {
        this.table.pageNum = 1
      }
      if (beginDate && !endDate) {
      } else if (endDate < beginDate) {
        return this.$message.error('结束日期不能低于开始日期')
      }
      let { operationId, userName } = val
      if (!userName) {
        val.userName = []
      }
      if (!operationId) {
        val.operationId = []
      }
      const { data } = await getUserchanFgeListAPI({
        ...val,
        ...this.table,
        ...{ type: 'role-menu' }
      })
      this.dataList = data.list
      this.total = data.total
    },
    // 获取变更的角色下拉框和菜单下拉框
    async getUserChangeDropDownFN(type) {
      const { data } = await getUserChangeDropDownAPI({ type })
      if (type === 'roleName') {
        this.setOptions.userName = data.map(item => {
          item.code = item.name
          return item
        })
      } else {
        this.setOptions.operationId = data
      }
    },
    download(val) {
      baseDownLoad(exportRoleMenuChange, val)
    }
  }
}
</script>

<style lang="scss" scoped>
.configMain {
  // padding: 10px;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
  }
}
</style>
