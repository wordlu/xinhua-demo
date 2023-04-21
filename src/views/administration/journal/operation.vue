<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="操作日志" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
        @queryForm="inquire"
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
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm'
import BaseTable from '@components/BaseTable'
import { formData, list, renderFrom } from './libs/operation'
import cloneDeep from 'lodash/cloneDeep'
import keepMixin from '@mixins/keep.mixin'
import { postLoginQueryAPI, getUserChangeDropDownAPI, exportOperateAPI } from '@api/manage'
import { baseDownLoad } from '@utils/util'
export default {
  name: 'Operation',
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
      // 表单的数据
      params: {},
      formList: {},
      renderFromCopy: []
    }
  },
  created() {
    this.renderFromCopy = cloneDeep(renderFrom)
    this.$set(this.formData, 'renderFrom', this.renderFromCopy)
    this.getUserChangeDropDownFN()
  },
  methods: {
    // 当前页发生变化的时候
    changeCurrent(val) {
      this.table.pageNum = val
      this.inquire(this.formList, true)
    },
    // 当前页显示几条数据发生变化后
    changeSize(val) {
      this.table.pageSize = val
      this.table.pageNum = 1
      this.inquire(this.formList, true)
    },
    // 新增dialog框关闭的时候
    appendClose(val) {
      this.appendVisible = val
    },
    // 点击查询的时候
    async inquire(val, flag) {
      this.formList = val
      if (!flag) {
        this.table.pageNum = 1
      }
      if (val) {
        this.params = cloneDeep(val)
        this.params.endTime = this.$moment(val.endTime).format('YYYY-MM-DD')
        this.params.startTime = this.$moment(val.startTime).format('YYYY-MM-DD')
      }
      if (!this.params.userName) {
        this.params.userName = []
      }
      const { data } = await postLoginQueryAPI({ ...this.params, ...this.table })
      if (data.list) {
        this.dataList = data.list.map(item => {
          if (item.state === 0) {
            item.state = '成功'
          } else {
            item.state = '失败'
          }
          return item
        })
      } else {
        this.dataList = []
      }
      this.total = data.total
    },

    // 获取所有的用户
    async getUserChangeDropDownFN() {
      const { data } = await getUserChangeDropDownAPI({ type: 'userName' })
      this.setOptions.userName = data
    },
    download(val) {
      baseDownLoad(exportOperateAPI, val)
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
