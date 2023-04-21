<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="用户角色变更记录" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
        @download="download"
        @queryForm="queryForm"
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
import { formData, list, renderFrom } from './libs/role'
import { getUserChangeDropDownAPI, getUserchanFgeListAPI, exportUserRoleChange } from '@api/manage'
import cloneDeep from 'lodash/cloneDeep'
import keepMixin from '@mixins/keep.mixin'
import { baseDownLoad } from '@utils/util'
export default {
  name: 'Role',
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
    this.getUserChangeDropDownFN('userName')
    this.getUserChangeDropDownFN('roleName')
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
    // 获取变更的角色和用户
    async getUserChangeDropDownFN(type) {
      const { data } = await getUserChangeDropDownAPI({ type })
      if (type === 'userName') {
        let userName = cloneDeep(data)
        let userAccount = cloneDeep(data)
        let list = userName.map(item => {
          item.code = item.name
          return item
        })
        this.setOptions.userName = list
        let newList = userAccount.map(item => {
          item.name = item.code
          return item
        })
        this.setOptions.userAccount = newList
      } else {
        this.setOptions.operationId = data
      }
    },
    // 获取用户角色变更信息
    async queryForm(val, flag) {
      this.formList = val
      if (!flag) {
        this.table.pageNum = 1
      }
      if (val.beginDate && !val.endDate) {
      } else if (val.endDate < val.beginDate) {
        return this.$message.error('结束日期不能低于开始日期')
      }
      let { userName, userAccount, operationId } = val
      if (!userName) {
        val.userName = []
      }
      if (!userAccount) {
        val.userAccount = []
      }
      if (!operationId) {
        val.operationId = []
      }
      const { data } = await getUserchanFgeListAPI({
        ...val,
        ...this.table,
        ...{ type: 'user-role' }
      })
      this.dataList = data.list
      this.total = data.total
    },
    // 导出功能
    download(val) {
      baseDownLoad(exportUserRoleChange, val)
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
