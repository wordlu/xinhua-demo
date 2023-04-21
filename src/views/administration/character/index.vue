<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="角色管理" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
        @queryForm="add"
        @deleteRole="batchDeleteRole"
        @inquire="inquire"
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
        @rowSelect="rowSelect"
        @selectAll="selectAll"
      />
      <examine :examine-visible="examineVisible" :details="details" @close="close" />
      <compile
        :edit-dialog-visible="editDialogVisible"
        :role-info="roleInfo"
        @editClose="editClose"
      />
      <authorization
        :authorization-dialog-visible="authorizationDialogVisible"
        :role-id="roleId"
        @authorizationClose="authorizationClose"
      />
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm'
import BaseTable from '@components/BaseTable'
import { formData, list, renderFrom } from './libs/data'
import examine from './components/examine.vue'
import {
  getRoleListAPI,
  deleteRoleAPI,
  deleteBatchRoleAPI,
  // getUserChangeDropDownAPI,
  getRoleAllAPI
} from '@api/manage'
import keepMixin from '@mixins/keep.mixin'
import cloneDeep from 'lodash/cloneDeep'
import compile from './compile.vue'
import authorization from './authorizations.vue'
export default {
  name: 'Regulate',
  components: {
    BaseForm,
    BeforeLineTitle,
    BaseTable,
    examine,
    compile,
    authorization
  },
  mixins: [keepMixin],
  data() {
    return {
      roleId: null,
      authorizationDialogVisible: false,
      roleInfo: {},
      editDialogVisible: false,
      setOptions: {},
      // form表单的数据
      formData,
      // 表格需要发送的数据
      list: [
        ...list,
        ...[
          {
            label: '操作',
            width: 200,
            'header-align': 'center',
            align: 'center',
            render: (h, { record, $index }) => {
              return (
                <div>
                  <el-button
                    type="text"
                    onClick={() => {
                      this.authorization(record)
                    }}
                  >
                    授权
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => {
                      this.edit(record)
                    }}
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => {
                      this.examine(record, $index)
                    }}
                  >
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => {
                      this.deleteRole(record.roleId)
                    }}
                  >
                    删除
                  </el-button>
                </div>
              )
            }
          }
        ]
      ],
      // 表格数据
      dataList: [],
      total: null,
      table: {
        pageNum: 1,
        pageSize: 10
      },
      // 控制查看dialog框的显示
      examineVisible: false,
      // 点击查看时传的数据
      details: {},
      // 批量删除的数据
      deleteData: '',
      formList: {},
      renderFromCopy: []
    }
  },
  created() {
    this.getRoleAllFN()
    this.renderFromCopy = cloneDeep(renderFrom)
    this.$set(this.formData, 'renderFrom', this.renderFromCopy)
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
      this.table.pageNum = 1
      this.getRoleListFN(this.formList, true)
    },
    // 当增加的dialog框关闭的时候
    close(val) {
      this.examineVisible = val
    },
    // 获取当前角色列表
    async getRoleListFN(val, flag) {
      if (!flag) {
        this.table.pageNum = 1
        this.formList = val
      }
      const { data } = await getRoleListAPI({
        ...this.table,
        ...val
      })
      this.dataList = data.records
      this.total = data.total
    },
    // 点击添加的时候
    add() {
      this.editDialogVisible = true
    },
    // 点击编辑的时候
    edit(record) {
      this.roleInfo = record
      this.editDialogVisible = true
    },
    // 点击查看的时候
    examine(record, index) {
      this.examineVisible = true
      this.details = cloneDeep(record)
      this.details.serial = index + 1
    },
    // 点击授权的时候
    authorization(record) {
      this.authorizationDialogVisible = true
      this.roleId = record.roleId
    },
    async deleteRole(roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { status } = await deleteRoleAPI(roleId)
          if (status === 200) {
            this.$message({
              center: true,
              message: '删除成功',
              type: 'success'
            })
            this.getRoleListFN()
          }
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },
    // 点击单选
    async rowSelect(selection) {
      this.deleteData = selection.map(item => item.roleId).join()
    },
    // 点击全选
    selectAll(selection) {
      this.deleteData = selection.map(item => item.roleId).join()
    },
    // 点击批量删除的时候
    batchDeleteRole() {
      if (!this.deleteData) {
        return this.$message.error('请选择批量删除的数据')
      }
      this.$confirm('此操作将永久删除选中的角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (!this.deleteData) {
            this.$message.success('请选择删除的角色')
          } else {
            const { status } = await deleteBatchRoleAPI(this.deleteData)
            if (status === 200) {
              this.$message({
                center: true,
                message: '删除成功',
                type: 'success'
              })
              this.getRoleListFN()
              this.deleteData = ''
            }
          }
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },
    // 点击查询的时候
    inquire(val) {
      this.formList = cloneDeep(val)
      this.getRoleListFN(this.formList)
    },
    // 获取所有角色编码
    async getRoleAllFN() {
      const { data } = await getRoleAllAPI()
      let arr = []
      data.forEach(item => {
        arr.push({})
      })
      data.forEach((item, index) => {
        arr[index].name = item
        arr[index].code = item
      })
      this.setOptions.code = arr
    },
    // 编辑弹框关闭后
    editClose() {
      this.editDialogVisible = false
      this.getRoleListFN(this.formList)
    },
    // 授权弹框关闭后
    authorizationClose() {
      this.authorizationDialogVisible = false
      this.roleId = null
      this.getRoleListFN(this.formList)
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
  ::v-deep .el-col-12 {
    width: 30%;
  }
  ::v-deep .el-form-item {
    width: 400px;
  }
}
</style>
