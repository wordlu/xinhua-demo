<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="用户变更记录" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
        @queryForm="queryForms"
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
import { formData, list, renderFrom } from './libs/alteration'
import { getUserChangeDropDownAPI, getUserchanFgeListAPI, exportUserChange } from '@api/manage'
import cloneDeep from 'lodash/cloneDeep'
import keepMixin from '@mixins/keep.mixin'
import { baseDownLoad } from '@utils/util'
export default {
  name: 'Alteration',
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
      if (!flag) {
        this.table.pageNum = 1
      }
      if (val.beginDate && !val.endDate) {
      } else if (val.endDate < val.beginDate) {
        return this.$message.error('结束日期不能低于开始日期')
      }
      if (!val.userAccount) {
        val.userAccount = []
      }
      if (!val.userName) {
        val.userName = []
      }
      const { data } = await getUserchanFgeListAPI({ ...val, ...this.table, ...{ type: 'user' } })
      this.dataList = data.list
      this.total = data.total
    },
    // 获取变更的用户名称
    async getUserChangeDropDownFN(type) {
      const { data } = await getUserChangeDropDownAPI({ type })
      const list = cloneDeep(data)
      const list1 = list.map(item => {
        item.code = item.name
        return item
      })
      this.setOptions.userName = list1
      const list2 = data.map(item => {
        item.name = item.code
        return item
      })
      this.setOptions.userAccount = list2
    },
    // 点击导出的时候
    download(val) {
      baseDownLoad(exportUserChange, val)
    },
    // 点击查询的时候
    queryForms(val) {
      this.formList = cloneDeep(val)
      this.queryForm(this.formList)
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
  .hint {
    padding-top: 8px;
    margin: 0 auto;
    span {
      color: red;
    }
  }
}
</style>
