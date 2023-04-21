<template>
  <div
    v-loading="!display"
    class="box"
    element-loading-background="#fff"
    :class="[{ conceal: !display }]"
  >
    <div class="main">
      <div class="son">
        <div :class="show === true ? 'dialog' : 'none'">
          <span style="margin-right:8px">
            <svg-icon icon-class="caution_shape"></svg-icon>
          </span>
          <span>请输入用户名或密码</span>
        </div>
        <p class="title">欢迎登录新华CPAD系统</p>
        <div class="content">
          <el-form>
            <el-form-item class="margin">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入账户"
                :class="inputHint()"
                @input="inputChange"
              >
                <i slot="prefix">
                  <svg-icon icon-class="user_account" class="iconOne"></svg-icon>
                </i>
              </el-input>
              <p :class="hint()">{{ errorMessage }}</p>
            </el-form-item>
            <el-form-item class="margin">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                :show-password="false"
                :type="type"
                :class="inputHint()"
                @input="inputChange"
              >
                <i slot="prefix">
                  <svg-icon icon-class="0296_key" class="iconOne"></svg-icon>
                </i>
                <i slot="suffix">
                  <svg-icon :icon-class="icon" class="iconTwo" @click="pass"></svg-icon>
                </i>
              </el-input>
              <p :class="hint()">{{ errorMessage }}</p>
            </el-form-item>
            <el-form-item class="marginOne">
              <el-checkbox v-model="checked">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button :loading="butLoading" @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginAPI, checkAccountFlagAPI, getUserInfoAPI } from '@api/login'
import { setStorage, getStorage } from '@utils/storage'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: getStorage('name') || '',
        password: getStorage('password') || ''
      },
      passwordType: 'pwd',
      loading: false,
      passFlag: false,
      icon: 'visibility_off',
      type: 'password',
      checked: getStorage('check') === 'true' ? true : false || false,
      visible: true,
      // 控制弹框是否显示
      show: false,
      // 控制密码错误报错
      affirm: false,
      display: false,
      errorMessage: '',
      butLoading: false
    }
  },
  async created() {
    if (this.$route.query && this.$route.query.token) {
      const { data } = await loginAPI({
        ...{
          token: this.$route.query.token
        },
        ...{ client_id: 'client', client_secret: '123456', grant_type: 'password' }
      })
      if (data.access_token) {
        setStorage('auth_token', data.access_token)
        setStorage('expiration_time', new Date().getTime())
        const res = await getUserInfoAPI()
        setStorage(`${res.data.sysUser.loginName}auth_token`, data.access_token)
        this.$store.commit('loginName', res.data.sysUser.loginName)
        this.$router.push('/welcome/users')
      } else {
        this.$message.error('无权限，请联系cpad管理员，即将跳转')
        setTimeout(() => {
          window.location.href =
            'http://10.3.2.57:8090/sso/ssoLogin?serviceId=http://10.3.2.98/login'
        }, 2000)
      }
    } else if (
      this.$route.query &&
      this.$route.query.strUserName &&
      this.$route.query.strTempInfo
    ) {
      const { data } = await loginAPI({
        ...{
          strUserName: this.$route.query.strUserName,
          strTempInfo: this.$route.query.strTempInfo
        },
        ...{ client_id: 'client', client_secret: '123456', grant_type: 'password' }
      })
      if (data.access_token) {
        setStorage(`${this.$route.query.strUserName}auth_token`, data.access_token)
        this.$store.commit('loginName', this.$route.query.strUserName)
        setStorage('auth_token', data.access_token)
        setStorage('expiration_time', new Date().getTime())
        this.$router.push('/welcome/users')
        this.display = false
      } else {
        this.display = true
        this.$router.push('/login')
      }
    } else {
      this.display = true
    }
  },
  methods: {
    pass() {
      this.passFlag = !this.passFlag
      if (!this.passFlag) {
        this.icon = 'visibility_off'
        this.type = 'password'
      } else {
        this.icon = 'visibility_on'
        this.type = 'text'
      }
    },
    async handleLogin() {
      localStorage.setItem('num_token', 0)
      if (!this.loginForm.username || !this.loginForm.password) {
        this.butLoading = true
        this.show = true
        setTimeout(() => {
          this.show = false
          this.butLoading = false
        }, 2000)
      } else {
        this.butLoading = true
        this.$store.commit('USER_INFO', {})
        const { data } = await loginAPI({
          ...{
            username: this.loginForm.username,
            password: this.$md5(this.loginForm.password)
          },
          ...{ client_id: 'client', client_secret: '123456', grant_type: 'password' }
        })
        if (data.access_token) {
          if (this.checked) {
            setStorage('name', this.loginForm.username)
            setStorage('password', this.loginForm.password)
            setStorage('check', true)
          } else {
            setStorage('name', '')
            setStorage('password', '')
            setStorage('check', false)
          }
          setStorage(`${this.loginForm.username}auth_token`, data.access_token)
          this.$store.commit('loginName', this.loginForm.username)
          setStorage('auth_token', data.access_token)
          setStorage('expiration_time', new Date().getTime())
          this.butLoading = false
          this.$router.push('/welcome/users')
        } else {
          const res = await checkAccountFlagAPI({
            userName: this.loginForm.username
          })
          this.errorMessage = res.data
          this.affirm = true
          this.butLoading = false
          this.$message.error(res.data)
        }
      }
    },
    inputChange() {
      this.affirm = false
    },
    hint() {
      return this.affirm === true ? 'remind' : 'pNo'
    },
    inputHint() {
      return this.affirm === true ? 'input1' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.box {
  width: 100%;
  height: 100%;
  padding: 32px;
  background-image: url(../../assets/images/bj1.png);
  background-size: 100% 100%;
  .main {
    width: 100%;
    height: 100%;
    background-image: url(../../assets/images/bj2.png);
    background-size: 100% 100%;
    .son {
      position: relative;
      float: right;
      width: 384px;
      height: 100%;
      background-color: #fff;
      .title {
        position: absolute;
        top: 28.8%;
        left: 63px;
        font-size: 24px;
        font-weight: 600;
        color: #323537;
        text-align: left;
      }
      .content {
        position: absolute;
        top: 36%;
        width: 100%;
        padding: 0 48px;

        .iconOne {
          width: 16.7px !important;
          height: 16.7px !important;
          margin-top: -4px;
          border: 0;
        }
        .iconTwo {
          width: 14px !important;
          height: 14px !important;
          margin-top: -4px;
          border: 0;
        }
        .el-input {
          display: flex;
        }
        .el-button {
          width: 288px;
          height: 40px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background-color: #0c6bd8;
        }
        .marginOne {
          display: flex;
          align-items: center;
          height: 20px;
          margin-bottom: 24px;
        }
        .input1 {
          // height: 34px;
          border: 2px solid #f03;
          border: 1px solid #f03;
          border-radius: 4px;
          ::v-deep .el-input__inner {
            height: 34px;
          }
        }
        .remind {
          height: 24px;
          font-size: 12px;
          font-weight: 400;
          line-height: 24px;
          color: #f03;
          text-align: left;
        }
        // 控制提示文字隐藏的
        .pNo {
          height: 24px;
          visibility: hidden;
        }
      }
      .dialog {
        position: absolute;
        top: 18%;
        left: 101px;
        width: 183px;
        height: 40px;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        color: #262626;
        text-align: center;
        letter-spacing: 0;
        background-color: #fff;
        border-radius: 3px;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
      }
      .none {
        display: none;
      }
    }
  }

  // ::v-deep .el-input__inner:focus {
  //   // 设置光标颜色
  //   border: #11be59 1px solid;
  // }
}
.conceal {
  display: none;
}
</style>
