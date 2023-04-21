<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <el-dialog
        :visible="authorizationDialogVisible"
        :close-on-click-modal="false"
        width="70%"
        title="授权"
        @close="close"
        @open="open"
      >
        <BaseForm
          v-if="show"
          :form-data="formData"
          :label-width="140"
          @queryForm="queryForm"
          @query="query"
          @cancel="cancel"
        />
        <div>
          <el-table :data="tableData" :max-height="500">
            <el-table-column label="首选角色" align="center">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row.roleId">{{ '' }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="备选角色" align="center">
              <template slot-scope="scope">
                <el-checkbox-group v-model="checkdata">
                  <el-checkbox :label="scope.row.roleId" :disabled="scope.row.roleId === radio">{{
                    ''
                  }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" align="center"> </el-table-column>
            <el-table-column prop="roleCode" label="角色代码" align="center"> </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" align="center"> </el-table-column>
          </el-table>
        </div>
        <!-- 后续可能估计会使用，目前先注释 -->
        <!-- <div style="margin-top:50px">
        <el-pagination
          class="base-pagination"
          :total="total"
          :layout="showLayout"
          :page-size="table.pageSize"
          :page-sizes="[10, 50, 100]"
          :current-page="table.pageNum"
          @size-change="changeSize"
          @current-change="changeCurrent"
        >
        </el-pagination>
      </div> -->
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import BaseForm from '@components/BaseForm'
import { formData, list } from './libs/authorization'
import { getRoleListAPI, getUserRoleList, postImpowerAPI } from '@api/manage'

export default {
  components: {
    BaseForm
  },
  props: {
    authorizationDialogVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      show: false,
      // form表单的数据
      formData,
      // 表格需要发送的数据
      list,
      // 表格数据
      tableData: [],
      total: null,
      table: {
        pageNum: 1,
        pageSize: 100
      },
      // 授权的数据
      roleIds: '',
      checkdata: [],
      radio: '',
      // 复选框处理后的数据
      checkList: [],
      // 最终导出的数据
      data: [],
      // 所有的角色列表数据
      roleList: [],
      // 单选的数据
      radioList: {},
      formList: {}
    }
  },
  computed: {
    showLayout: function() {
      // 通过表头计算页面选择器 默认展示16/页还是18/页
      let defaultLayout = ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
      let layout = this.layout ? this.layout.split(',').map(item => item.trim()) : defaultLayout
      layout = layout.join(',')
      return layout
    }
  },
  watch: {
    radio(val) {
      this.checkdata = this.checkdata.filter(item => item !== val)
    }
  },
  methods: {
    // 当前页发生变化的时候
    changeCurrent(val) {
      this.table.pageNum = val
      this.getRoleListFN(this.formList, true)
    },
    // 当前页显示几条数据发生变化后
    changeSize(val) {
      this.table.pageSize = val
      this.getRoleListFN(this.formList, true)
    },
    // 获取角色列表
    async getRoleListFN(val, flag) {
      this.formList = val
      if (!flag) {
        this.table.pageNum = 1
      }
      const { data } = await getRoleListAPI({ ...this.table, ...val })
      this.tableData = data.records
      this.total = data.total
      this.roleList = data.records
    },
    // 点击授权的时候
    async queryForm() {
      if (!this.userId) {
        this.$message.error('当前授权账号不存在，请重新选择')
        this.close()
      }
      if (this.radio) {
        this.radioList = {
          roleId: this.radio,
          firstFlag: 0
        }
      } else {
        return this.$message.error('首选角色必选')
      }
      if (this.checkList.length === 0) {
        this.checkdata.forEach(item => {
          this.checkList.push({ firstFlag: 1, roleId: item })
        })
      }
      this.data = [...[this.radioList], ...this.checkList]
      if (this.data.length === 0) {
        return this.$message.error('请选择角色')
      }
      const { status } = await postImpowerAPI({
        role: this.data,
        userId: this.userId
      })
      if (status === 200) {
        this.$message.success('授权成功')
        this.close()
      }
    },
    // 点击查询的时候
    query(val) {
      this.getRoleListFN(val)
    },
    // 点击取消的时候
    cancel() {
      this.close()
    },
    // 获取当前用户的角色
    async getUserRoleFN() {
      const { data } = await getUserRoleList(this.userId)
      this.radio = parseInt(
        data
          .filter(item => item.firstFlag === 0)
          .map(item => item.roleId)
          .join()
      )
      this.checkdata = data.filter(item => item.firstFlag === 1).map(item => item.roleId)
    },
    close() {
      this.checkList = []
      this.radio = ''
      this.checkdata = []
      this.$emit('administrationClose')
      this.show = false
    },
    // 弹框打开的时候
    open() {
      this.show = true
      this.getRoleListFN()
      if (this.userId) {
        this.getUserRoleFN()
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
  ::v-deep .el-form-item {
    width: 500px;
  }
  .base-pagination {
    height: 50px;
    padding: 0 15px;
    text-align: right;
    background-color: $color-white;
    .el-pagination__total,
    .el-pagination__sizes,
    .el-pagination__jump {
      font-size: 14px;
      line-height: 50px;
    }
    ::v-deep .el-pagination__total {
      float: left;
    }
    .el-pagination .el-icon {
      color: #929292;
    }
    .el-input__suffix {
      height: 30px;
    }
    .btn-prev,
    .btn-next,
    .el-pager li {
      margin: 10px 5px;
      font-size: 14px;
    }
    ::v-deep .el-pager li {
      font-weight: 400;
      color: #606266;
    }
    ::v-deep .el-pager li:not(.disabled).active {
      color: $color-main;
      background-color: $color-white;
    }
    ::v-deep .el-input .el-input__inner {
      height: 30px;
      line-height: 30px;
      color: #4a4a4a;
    }
  }
}
.pageNumber {
  padding: 6px 0 16px 10px;
  margin: 0;
  font-size: 14px;
  color: $color-mainfont;
  background-color: $color-white;
}
.el-tooltip__popper {
  max-width: 350px;
}
</style>
