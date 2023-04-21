<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="定时任务日志" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
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
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm'
import BaseTable from '@components/BaseTable'
import { formData, list } from './libs/task'
import keepMixin from '@mixins/keep.mixin'
import { getTaskNameListAPI, postSelectLogListAPI } from '@api/manage'
export default {
  name: 'Task',
  components: {
    BaseForm,
    BeforeLineTitle,
    BaseTable
  },
  mixins: [keepMixin],
  data() {
    return {
      setOptions: {},
      // form表单的数据
      formData,
      // 表格需要发送的数据
      list,
      // 表格数据
      dataList: [],
      total: null,
      table: {
        pageNum: 1,
        pageSize: 10
      },
      formList: {}
    }
  },
  created() {
    this.getTaskNameListFN()
  },
  methods: {
    // 当前页发生变化的时候
    changeCurrent(val) {
      this.table.pageNum = val
      this.queryForm(this.formList, true)
    },
    // 当前页显示几条数据发生变化后
    changeSize(val) {
      this.table.pageSize = val
      this.queryForm(this.formList, true)
    },
    // 获取当前下拉框数据
    async getTaskNameListFN() {
      const { data } = await getTaskNameListAPI()
      this.setOptions.taskIds = data
    },
    async queryForm(val, flag) {
      this.formList = val
      if (!flag) {
        this.table.pageNum = 1
      }
      if (val.taskIds === '') {
        val.taskIds = []
      }
      const { data, status } = await postSelectLogListAPI({ ...val, ...this.table })
      if (status === 200) {
        this.dataList = data.list
        this.total = data.total
      }
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
