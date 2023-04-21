<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="用户管理" />
      <BaseForm
        :form-data="formData"
        :label-width="140"
        :set-options="setOptions"
        @inquire="queryForm"
        @batchDelete="batchDelete"
        @addUser="addUser"
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
      <password
        :password-dialog-visible="passwordDialogVisible"
        :passworduser-id="passworduserId"
        @passwordClose="passwordClose"
      />
      <add
        :add-dialog-visible="addDialogVisible"
        :user-info="userInfo"
        :show="show"
        @editsuccess="editsuccess"
        @close="editsuccess"
      />
      <authorization
        :authorization-dialog-visible="authorizationDialogVisible"
        :user-id="userId"
        @administrationClose="administrationClose"
      />
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm'
import BaseTable from '@components/BaseTable'
import { formData, list, renderFrom } from './libs/consumer'
import examine from './components/examine.vue'
import keepMixin from '@mixins/keep.mixin'
import password from './password.vue'
import add from './add.vue'
import authorization from './authorization.vue'
import {
  getUserListAPI,
  deleteUserAPI,
  deleteBatchUserAPI,
  getLoginNameAllListAPI,
  getDeptIdAPI
} from '@api/manage'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Consumer',
  components: {
    BaseForm,
    BeforeLineTitle,
    BaseTable,
    examine,
    password,
    add,
    authorization
  },
  mixins: [keepMixin],
  data() {
    return {
      userId: null,
      // 控制权限的弹框
      authorizationDialogVisible: false,
      show: true,
      // 点击编辑的时候传的数据
      userInfo: {},
      // 控制新增和编辑的弹框
      addDialogVisible: false,
      // 重置密码的id
      passworduserId: null,
      // 控制重置密码
      passwordDialogVisible: false,
      setOptions: {},
      // form表单的数据
      formData,
      // 表格需要发送的数据
      list: [
        ...list,
        ...[
          {
            label: '操作',
            prop: '',
            'header-align': 'center',
            align: 'center',
            render: (h, { record, $index }) => {
              const { delFlag } = record
              return (
                <div>
                  <el-button
                    type="text"
                    disabled={delFlag === '停用'}
                    onClick={() => this.resetPassword(record)}
                  >
                    重置密码
                  </el-button>
                  <el-button
                    type="text"
                    disabled={delFlag === '停用'}
                    onClick={() => {
                      this.authorization(record)
                    }}
                  >
                    授权
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => {
                      this.look(record, $index)
                    }}
                  >
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    disabled={delFlag === '停用'}
                    onClick={() => {
                      this.amend(record)
                    }}
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => {
                      this.del(record)
                    }}
                  >
                    {delFlag === '停用' ? '启用' : '删除'}
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
      examineVisible: false,
      // 点击查看时传的数据
      details: {},
      // 批量删除的数据
      deleteData: '',
      // form表单的数据
      formList: {},
      renderFromCopy: []
    }
  },
  created() {
    this.renderFromCopy = cloneDeep(renderFrom)
    this.$set(this.formData, 'renderFrom', this.renderFromCopy)
    this.getLoginNameAllListFN()
    this.getDeptIdFN()
  },
  // 添加完用户后重新获取最新列表
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'add' || from.name === 'password' || from.name === 'authorization') {
        vm.inquireDataListFN()
      }
    })
  },
  methods: {
    // 当前页发生变化的时候
    changeCurrent(val) {
      this.table.pageNum = val
      this.inquireDataListFN(this.formList, true)
    },
    // 当前页显示几条数据发生变化后
    changeSize(val) {
      this.table.pageSize = val
      this.inquireDataListFN(this.formList, true)
    },
    close(val) {
      this.examineVisible = val
    },
    queryForm(val) {
      this.formList = cloneDeep(val)
      this.inquireDataListFN(this.formList)
    },
    // 获取列表数据
    async inquireDataListFN(val, flag) {
      if (!flag) {
        this.table.pageNum = 1
      }
      let params = []
      const { pageNum, pageSize } = this.table
      if (val) {
        const { delFlag, code, userName, deptId } = val
        params = {
          status: delFlag || [],
          code: code || [],
          userName: userName || [],
          pageNum: pageNum,
          pageSize: pageSize,
          deptId: deptId || []
        }
      } else {
        params = {
          status: [],
          code: [],
          userName: [],
          deptId: [],
          pageNum: pageNum,
          pageSize: pageSize
        }
      }
      const { data } = await getUserListAPI(params)
      this.dataList = data.records
      this.dataList = this.dataList.map(item => {
        if (item.updateTime) {
          item.updateTime = this.$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (item.createTime) {
          item.createTime = this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        }
        return item
      })
      this.total = data.total
    },
    // 点击重置密码的时候
    resetPassword(record) {
      this.passwordDialogVisible = true
      this.passworduserId = record.userId
    },
    // 点击查看的时候
    look(record, index) {
      this.examineVisible = true
      this.details = cloneDeep(record)
      this.details.list = this.details.list.map(item => item.roleName).join()
      this.details.serial = index + 1
    },
    // 点击修改修改的时候
    amend(record) {
      this.show = true
      this.addDialogVisible = true
      this.userInfo = record
    },
    // 点击授权的时候
    authorization(record) {
      this.authorizationDialogVisible = true
      this.userId = record.userId
    },
    // 点击删除的时候
    async del(record) {
      const { delFlag, userId } = record
      if (this.$store.state.user.userInfo.userId === userId) {
        this.$message.error('不能停用当前登陆账号')
      } else {
        if (delFlag === '停用') {
          const { status } = await deleteUserAPI({ id: userId, delFlag: 0 })
          if (status === 200) {
            this.$message.success('启用成功')
            this.inquireDataListFN(this.formList)
          }
        } else {
          this.$confirm('此操作将停用该用户，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              const { status } = await deleteUserAPI({ id: userId, delFlag: 1 })
              if (status === 200) {
                this.$message({
                  type: 'success',
                  message: '停用成功',
                  center: true
                })
                this.inquireDataListFN(this.formList)
              }
            })
            .catch(() => {
              this.$message({
                type: 'warning',
                message: '已取消停用'
              })
            })
        }
      }
    },
    // 点击单选的时候
    rowSelect(selection, row) {
      this.deleteData = selection.map(item => item.userId).join()
    },
    // 点击全选的时候
    selectAll(selection) {
      this.deleteData = selection.map(item => item.userId).join()
    },
    // 批量删除
    batchDelete() {
      if (!this.deleteData) {
        return this.$message.error('请先选择停用的用户')
      } else {
        const userList = cloneDeep(this.deleteData)
        if (userList.split(',').includes(this.$store.state.user.userInfo.userId + '')) {
          return this.$message.error('批量删除包含当前登录账号，请重新选择')
        }
        this.$confirm('此操作将批量停用选中用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const { status } = await deleteBatchUserAPI({ userIds: this.deleteData })
            if (status === 200) {
              this.$message({
                type: 'success',
                message: '停用成功',
                center: true
              })
              this.inquireDataListFN(this.formList)
            }
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: '已取消停用'
            })
          })
      }
    },
    // 获取所有的用户代码
    async getLoginNameAllListFN() {
      const { data } = await getLoginNameAllListAPI()
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
    // 获取组织架构
    async getDeptIdFN() {
      const { data } = await getDeptIdAPI()
      this.setOptions.deptId = data
    },
    // 关闭密码框的时候
    passwordClose() {
      this.passwordDialogVisible = false
      this.passworduserId = null
    },
    // 点击新增的时候
    addUser() {
      this.show = true
      this.addDialogVisible = true
    },
    // 编辑和成功完成之后
    editsuccess() {
      this.show = false
      this.addDialogVisible = false
      this.userInfo = {}
      this.queryForm(this.formList)
    },
    // 授权的弹框关闭之后
    administrationClose() {
      this.queryForm(this.formList)
      this.userId = null
      this.authorizationDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.configMain {
  // padding: 10px;
  background-color: $color-body-bg;

  .bodyWrap {
    display: flex;
    background-color: #fff;
  }
  // ::v-deep .el-col-12 {
  //   width: 30%;
  // }
  // ::v-deep .el-form-item {
  //   width: 400px;
  // }
}
</style>
