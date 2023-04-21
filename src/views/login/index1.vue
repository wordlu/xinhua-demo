<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <SvgIcon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <SvgIcon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="'password'"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd">
          <SvgIcon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
        >Login
      </el-button>

      <div class="tips">
        <span style="margin-right: 20px">username: admin</span>
        <span> password: any</span>
      </div>
    </el-form>
  </div>
</template>
<script>
import SvgIcon from '@components/SvgIcon'
import { loginAPI } from '@api/login'
import { setSessionStorage } from '@utils/storage'
// import {recursion} from './lis'
// import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    SvgIcon
  },
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      passwordType: 'pwd',
      loading: false
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
        setSessionStorage('auth_token', data.access_token)
        this.$router.push('/welcome/users')
        this.$store.dispatch('fetchDictDaa')
        this.$store.dispatch('fetchAbleDate')
      } else {
        this.$message.error('无权限，请联系cpad管理员，即将跳转')
        setTimeout(() => {
          window.location.href = 'http://10.3.2.98/login'
        }, 2000)
      }
    }
  },
  methods: {
    async handleLogin() {
      const { data } = await loginAPI({
        ...{
          username: this.loginForm.username,
          password: this.$md5(this.loginForm.password)
        },
        ...{ client_id: 'client', client_secret: '123456', grant_type: 'password' }
      })
      if (data.access_token) {
        setSessionStorage('auth_token', data.access_token)
        this.$router.push('/welcome/users')
        this.$store.dispatch('fetchDictDaa')
        this.$store.dispatch('fetchAbleDate')
      } else {
        this.$message.error(data.msg)
      }

      // }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$color-bg: #283443;
$color-lightgray: #fff;
$t-cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $t-cursor)) {
  .login-container .el-input input {
    color: $t-cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;
    height: 47px;

    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      color: $color-lightgray;
      background: transparent;
      border: 0;
      border-radius: 0;
      -webkit-appearance: none;
      caret-color: $t-cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $color-bg inset !important;
        -webkit-text-fill-color: $t-cursor !important;
      }
    }
  }

  .el-form-item {
    color: #454545;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$color-bg: #2d3a4b;
$color-darkgray: #889aa4;
$color-lightgray: #eee;

.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: $color-bg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    display: inline-block;
    width: 30px;
    padding: 6px 5px 6px 15px;
    color: $color-darkgray;
    vertical-align: middle;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 26px;
      font-weight: bold;
      color: $color-lightgray;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    top: 7px;
    right: 10px;
    font-size: 16px;
    color: $color-darkgray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
