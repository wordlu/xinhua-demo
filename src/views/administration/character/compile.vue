<template>
  <div class="configMain">
    <el-dialog
      :visible="editDialogVisible"
      :close-on-click-modal="false"
      width="30%"
      :title="title"
      @close="close"
      @open="open"
    >
      <el-form ref="formRef" label-width="140px" :model="formData" :rules="rules">
        <el-form-item label="角色编码:" prop="roleCode">
          <el-input v-model="formData.roleCode" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="formData.roleName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="formData.roleDesc" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="preserve">保存</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { postruleAPI, updateRuleAPI, getRoleAllAPI, getRoleNameAPI } from '@api/manage'
export default {
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    },
    roleInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validRole = (rule, value, callback) => {
      if (this.roleAllList.includes(value)) {
        callback(new Error('角色编码重复，请重新输入'))
      } else {
        callback()
      }
    }
    const validRoleName = (rule, value, callback) => {
      if (this.roleNameList.includes(value)) {
        callback(new Error('角色名称重复，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      title: '编辑',
      formData: {
        roleCode: '',
        roleName: '',
        roleType: '',
        roleDesc: ''
      },
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          {
            pattern: /^\w+$/,
            message: '角色编码只支持数字，26个英文字母或者下划线组成的字符串,并且不可包括空格',
            trigger: 'blur'
          },
          { validator: validRole, trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            pattern: '^[\u4e00-\u9fa5_a-zA-Z0-9]+$',
            message: '角色名称只支持数字，26个英文字母或者中文组成的字符串,并且不可包括空格',
            trigger: 'blur'
          },
          { validator: validRoleName, trigger: 'blur' }
        ]
      },
      roleAllList: [],
      roleNameList: []
    }
  },
  methods: {
    // 点击保存的时候
    preserve() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          if (this.roleInfo.roleId) {
            const res = await updateRuleAPI(this.formData)
            if (res.status === 200) {
              this.$message.success(res.data)
            }
          } else {
            const res = await postruleAPI(this.formData)
            if (res.status === 200) {
              this.$message.success(res.data)
            }
          }
          this.close()
        }
      })
    },
    // 点击取消的时候
    cancel() {
      this.close()
    },
    // 点击重置的时候
    reset() {
      this.$refs.formRef.resetFields()
      this.formData = {}
    },
    async getRoleAllFN() {
      const { data } = await getRoleAllAPI()
      if (this.roleInfo) {
        this.roleAllList = data.filter(item => item !== this.roleInfo.roleCode)
      } else {
        this.roleAllList = data
      }
    },
    // 获取所有角色名称
    async getRoleNameAPI() {
      const { data } = await getRoleNameAPI()
      if (this.roleInfo) {
        this.roleNameList = data.filter(item => item !== this.roleInfo.roleName)
      } else {
        this.roleNameList = data
      }
    },
    close() {
      this.$refs.formRef.resetFields()
      this.$emit('editClose')
    },
    open() {
      if (this.roleInfo.roleId) {
        this.formData = this.roleInfo
      }
      this.getRoleAllFN()
      this.getRoleNameAPI()
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
    .box {
      width: 50%;
      margin-top: 50px;
      margin-left: 20%;
    }
  }
}
</style>
