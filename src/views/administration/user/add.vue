<template>
  <div class="configMain">
    <el-dialog
      :visible="addDialogVisible"
      :close-on-click-modal="false"
      width="70%"
      :title="classify"
      @close="close"
      @open="open"
    >
      <div class="box">
        <BaseForm
          v-if="show"
          ref="formRef"
          :form-data="formData"
          :label-width="100"
          :set-options="setOptions"
          @change="affirmPassword"
          @queryForm="queryFormFN"
          @cancel="cancel"
          @clickInput="clickInput"
          @clear="clear"
        />
        <el-dialog title="角色授权" :visible="dialogVisible" :close-on-click-modal="false">
          <el-table :data="tableData" class="tableDataWidth" highlight-current-row>
            <el-table-column prop="roleName" label="角色名称" align="center"> </el-table-column>
            <el-table-column label="首选角色" align="center">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row.roleId" @input="input">{{
                  ''
                }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="备选角色" align="center">
              <template slot-scope="scope">
                <el-checkbox-group v-model="checkdata" @change="change">
                  <el-checkbox :label="scope.row.roleId">{{ '' }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="table.pageNum"
            :page-sizes="[10, 50, 100]"
            :page-size="table.pageSize"
            layout="sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
          <div style="text-align:right">
            <el-button @click="close">取消</el-button>
            <el-button @click="confing">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BaseForm from '@components/BaseForm'
import { formData, formData2 } from './libs/add'
import { addUserAPI, postEditUserAPI, getLoginNameAllListAPI, getDeptIdAPI } from '@api/manage'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Add',
  components: {
    BaseForm
  },
  props: {
    addDialogVisible: {
      type: Boolean,
      default: false
    },
    classify: {
      type: String,
      default: ''
    },
    userInfo: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.passWord) {
        callback(new Error('密码不一致,请重新输入密码'))
      } else {
        callback()
      }
    }
    const validateLogin = (rules, value, callback) => {
      if (this.loginName.includes(value)) {
        callback(new Error('登录账号重复，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      setOptions: {
        deptId: []
      },
      formData: formData,
      passWord: '',
      rules: {
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          {
            pattern: /^\w+$/,
            message: '登录账号只支持数字，26个英文字母或者下划线组成的字符串,并且不可包括空格',
            trigger: 'blur'
          },
          { validator: validateLogin, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 控制dialog框的显示
      dialogVisible: false,
      table: {
        pageSize: 10,
        pageNum: 1
      },
      total: null,
      dataList: [{ a: 1, id: '' }, { a: 2, id: '' }],
      tableData: [],
      // 单选框绑定的数据
      radio: '',
      // 复选框绑定的数据
      checkdata: [],
      // 复选框处理后的数据
      checkList: [],
      // 最终导出的数据
      data: [],
      // 所有的角色列表数据
      roleList: [],
      // 单选的数据
      radioList: {},
      // 登录账号
      loginName: ''
    }
  },
  methods: {
    affirmPassword(val) {
      this.passWord = val
    },
    // 添加用户
    async queryFormFN(val) {
      let { role, confirmPassword, password, loginName } = val
      if (this.userInfo.userId) {
        if (typeof role === 'string') {
          role = this.$route.query.user.list
        } else {
          role = this.data
        }
        if (confirmPassword && password) {
          val.confirmPassword = this.$md5(confirmPassword)
          val.password = this.$md5(password)
        } else {
          delete val.confirmPassword
          delete val.password
        }
        if (loginName) {
          delete val.loginName
        }
        const { status } = await postEditUserAPI(val)
        if (status === 200) {
          this.$message.success('修改成功')
          this.$emit('editsuccess')
          this.close()
        }
      } else {
        val.confirmPassword = this.$md5(confirmPassword)
        val.password = this.$md5(password)
        role = this.data
        const res = await addUserAPI(val)
        if (res.status === 200) {
          this.$message.success('添加成功')
          this.close()
        }
      }
    },
    // 点击取消的时候
    cancel() {
      this.$refs.formRef.$refs.myForm.resetFields()
      this.close()
    },
    clickInput() {
      this.dialogVisible = true
    },
    close() {
      this.$refs.formRef.$refs.myForm.resetFields()
      this.$emit('close')
    },
    handleSizeChange(val) {
      this.table.pageSize = val
    },
    handleCurrentChange(val) {
      this.table.pageNum = val
    },
    // 点击单选按钮的时候
    input(val) {
      this.radioList = {
        roleId: val,
        firstFlag: 0
      }
    },
    // 点击复选框的时候
    change(val) {
      let list = cloneDeep(this.roleList)
      const data = list.filter(item => {
        return val.includes(item.roleId)
      })
      this.checkList = []
      data.forEach(item => {
        this.checkList.push({
          roleId: item.roleId,
          firstFlag: 1
        })
      })
    },
    async open() {
      if (!this.userInfo.userId) {
        this.formData = formData
        this.formData.rules = { ...this.formData.rules, ...this.rules }
        this.$nextTick(() => {
          this.$refs.formRef.useData.initData = {}
        })
      }
      if (this.userInfo.userId) {
        this.formData = formData2
        this.formData.rules = { ...this.formData.rules, ...this.rules }
        this.formData.initData = this.userInfo
      }
      this.getDeptIdFN()
      this.getLoginNameAllListFN()
    },
    confing() {
      this.data = [...this.checkList, ...[this.radioList]]
      this.dialogVisible = false
      const roleCode = this.data.map(item => item.roleId).filter(item => item)
      const res = this.roleList
        .filter(item => roleCode.includes(item.roleId))
        .map(item => item.roleName)
        .join()
      this.$nextTick(() => {
        this.$refs.formRef.useData.initData.role = res
      })
    },
    // 获取所有的登录用户账号
    async getLoginNameAllListFN() {
      const { data } = await getLoginNameAllListAPI()
      if (this.userInfo.userId) {
        this.loginName = data.filter(item => item !== this.userInfo.loginName)
      } else {
        this.loginName = data
      }
    },
    // 获取的公司架构
    async getDeptIdFN() {
      const { data } = await getDeptIdAPI()
      this.setOptions.deptId = data
      this.$set(this.setOptions, 'deptId', data)
    },
    clear(val) {
      this.$refs.formRef.useData.initData.phone = ''
      this.$refs.formRef.useData.initData.deptId = ''
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
  .box {
    width: 80%;
    margin: 0 auto;
    .tableDataWidth {
      width: 96%;
      margin: 0 auto;
    }
  }
}
</style>
