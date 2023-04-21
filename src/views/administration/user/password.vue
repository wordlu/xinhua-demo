<template>
  <div class="configMain">
    <el-dialog
      :visible="passwordDialogVisible"
      :close-on-click-modal="false"
      width="30%"
      title="重置密码"
      @close="close"
    >
      <el-form ref="formRef" :model="password" :rules="rules">
        <el-form-item label="新密码" label-width="100px" prop="newpassword">
          <el-input
            v-model="password.newpassword"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="100px" prop="confirmPassword">
          <el-input
            v-model="password.confirmPassword"
            show-password
            placeholder="请输入确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="180px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { postEditPasswordAPI } from '@api/manage'
export default {
  name: 'Password',
  props: {
    passwordDialogVisible: {
      type: Boolean,
      default: false
    },
    passworduserId: {
      type: Number,
      default: null
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === this.password.newpassword) {
        callback()
      } else {
        callback(new Error('密码不一致,请重新输入密码'))
      }
    }
    return {
      password: {
        newpassword: '',
        confirmPassword: ''
      },
      rules: {
        newpassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击保存的时候
    save() {
      this.$refs.formRef.validate(async value => {
        if (value) {
          const { status } = await postEditPasswordAPI({
            newpassword: this.$md5(this.password.newpassword),
            confirmPassword: this.$md5(this.password.confirmPassword),
            userId: this.passworduserId
          })
          if (status === 200) {
            this.$message.success('修改成功')
            // this.userId = ''
            // this.$router.push('/administration/user/consumer')
            this.close()
          }
        }
      })
    },
    reset() {
      this.$refs.formRef.resetFields()
    },
    // 点击取消的时候
    cancel() {
      this.$refs.formRef.resetFields()

      this.$emit('passwordClose')
    },
    close() {
      this.cancel()
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  .bodyWrap {
    width: 100%;
    background-color: #fff;
  }
  .box {
    display: flex;
    justify-content: center;
    width: 80%;
    margin-top: 70px;
  }
}
</style>
