<template>
  <div class="navBar">
    <div class="navBarRow">
      <div class="logo">
        <!-- <img src="../assets/images/logo.png" alt="" /> -->
        <img src="../assets/images/cpad_logo.png" alt="" />
      </div>
      <div class="userImg">
        <el-dropdown @command="handleCommand">
          <div>
            <p class="userName">{{ $store.state.user.userInfo.username }}</p>
            <div class="headImg">
              <img v-if="avatar" :src="avatar" alt="" class="avatar" />
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="userImg userImg1">
        <span v-if="!isFullScreen" class="fullScreenBtn" @click="handleFullScreen">
          <svg-icon icon-class="full-screen-line"></svg-icon>
          全屏
        </span>
        <span v-if="isFullScreen" class="fullScreenBtn" @click="handleFullScreen">
          <svg-icon icon-class="full-screen-exit-line"></svg-icon>
          退出全屏
        </span>
      </div>
      <div class="userImg box">
        <el-form class="elform">
          <el-form-item label-width="100px">
            <span slot="label">
              <i class="el-icon-user icon" style="margin-right:5px;color:#e0e0e0"></i>
              <span style="color: #e0e0e0">角色切换</span>
            </span>
            <el-select
              v-model="selectValue"
              :popper-append-to-body="false"
              class="select"
              size="small"
              @change="change"
            >
              <el-option
                v-for="item in roleList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      class="baseDialog editPwd"
      title="修改密码"
      :visible.sync="editPwdVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="form"
        size="medium"
        :model="form"
        :rules="formRules"
        class="form"
        label-width="110px"
      >
        <el-form-item label="新密码：" prop="newPwd">
          <el-input v-model="form.newPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPwdVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCopyForm('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import color from '@assets/scss/index.scss'
import { queryPassRules } from '@src/api/user'
import { postEditPasswordAPI } from '@api/manage'
import avatarImg from '@assets/images/avatar.png'
import { mapGetters } from 'vuex'
import { getUserInfoAPI } from '@api/login'

export default {
  components: {
    // NavBar
  },
  data() {
    let checkPassValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isFullScreen: false,
      main: color['global-color-main'],
      navActive: '1',
      searchInput: false,
      tabIndex: 2,
      state2: '',
      editPwdVisible: false,
      form: {
        newPwd: '',
        confirmPassword: ''
      },
      formRules: {
        newPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: checkPassValidator, trigger: 'blur' }]
      },
      detailRules: {},
      dialogVisible: false,
      selectDatas: {
        jobTitles: [],
        chargers: [],
        stations: [],
        jobCategorys: []
      },
      total: 2,
      // menuData: RoutesMapConfig
      selectValue: this.$store.state.user.roleName || ''
    }
  },
  computed: {
    avatar() {
      return avatarImg
    },
    roleList() {
      return this.$store.state.user.roleList
    },
    ...mapGetters({ roleName: 'roleName' })
  },
  watch: {
    '$store.state.personal.openJunctionBoard'(newVal, oldVal) {
      if (newVal) {
        const _this = this
        this.$store.dispatch('personal/handleJunctionBoard', true)
        _this.queryJunctionBoard(true, '0')
        // _this.getUsers();
      }
    },
    //   "junctionSend.funCode"(newVal, oldVal) {
    //     let funCodes = [];
    //     for (let jm of this.junctionModels) {
    //       funCodes.push(jm.funCode);
    //     }
    //     if (funCodes.indexOf(newVal) === -1) {
    //       this.isSaveDisabled = false;
    //     }else {
    //       this.isSaveDisabled = true;
    //     }
    roleName: {
      handler(val) {
        if (val) {
          this.selectValue = val
        }
      },
      immediate: true
    }
  },
  created() {},

  mounted() {
    window.onresize = () => {
      if (!this.checkFull()) {
        this.isFullScreen = false
      }
    }
  },
  methods: {
    CloseWebPage() {
      if (this.$route.path.indexOf('monitorBigScreen') > -1) {
        return false
      } else {
        this.$router.push('/login')
      }
    },
    checkFull() {
      let isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },
    handleFullScreen() {
      let element = document.documentElement
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.isFullScreen = !this.isFullScreen
    },
    async submitCopyForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data } = await getUserInfoAPI()
          const userId = data.sysUser.userId
          const { status } = await postEditPasswordAPI({
            newpassword: this.$md5(this.form.newPwd),
            confirmPassword: this.$md5(this.form.confirmPassword),
            userId
          })
          if (status === 200) {
            this.$message.success('修改成功')
            this.editPwdVisible = false
          }
        }
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'editPassword':
          this.getPassRules()
          this.editPwdVisible = true
          this.form = {
            oldPwd: '',
            newPwd: '',
            confirmPassword: ''
          }
          this.$nextTick(() => {
            this.$refs['form'].clearValidate()
          })
          break
        case 'dailyRemind':
          this.dialogVisible = true
          this.title = '新增'
          this.getSation()
          this.getJobCategory()
          this.getJobTitle()
          this.getCharger()
          this.$refs['manageForm'] && this.$refs['manageForm'].open()
          break
      }
    },
    logout() {
      this.$store.dispatch('logOut')
    },
    userNameClick() {
      this.$router.push('/operateMonitor/PersonalPage')
    },
    // 获取规则
    getPassRules() {
      queryPassRules().then(res => {
        if (!res.error) {
          this.detailRules = res.data
        } else {
          this.$message.error(res.error.message)
        }
      })
    },
    // 密码规则
    passRules(rule, value, callback) {
      let regex = ''
      if (JSON.stringify(this.detailRules) !== '{}') {
        let temp = []
        for (const key in this.detailRules) {
          if (key !== 'minN' && key !== 'maxN' && key !== 'passNotName') {
            temp.push(this.detailRules[key])
          }
        }
        if (temp.length !== 0) {
          regex = new RegExp(
            `^${temp.join('')}.{${this.detailRules['minN']},${this.detailRules['maxN']}}$`
          )
        } else {
          regex = new RegExp(`^.{${this.detailRules['minN']},${this.detailRules['maxN']}}$`)
        }
      }
      // const regex = new RegExp(`${regN}${rega}${regA}${regS}.{${minN},${maxN}}`);
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!regex.test(value)) {
        let passTips = `密码需包含${this.detailRules['regN'] ? '数字、' : ''}${
          this.detailRules['rega'] ? '小写字母、' : ''
        }${this.detailRules['regA'] ? '大写字母、' : ''}${
          this.detailRules['regS'] ? '特殊字符、' : ''
        }最少${this.detailRules['minN']}个字符、最多${this.detailRules['maxN']}个字符`
        // 密码需包含大小写字母、数字、特殊字符等，至少8个字符，最多30个字符
        callback(new Error(`${passTips}`))
      } else {
        if (this.detailRules['passNotName'] && this.detailRules['passNotName'] === '1') {
          const userName = this.$store.state.user.userInfo.name
          if (userName && userName === value) {
            callback(new Error('用户名和密码不能相同'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    closeManageForm() {
      this.$refs['manageForm'].clearState()
      this.dialogVisible = false
    },
    saveManage() {
      this.$refs['manageForm'].refValidate().then(formModel => {
        if (formModel) {
          this.dialogVisible = false
          const params = Object.assign({}, formModel)
          if (params['steps'] && params['steps'].length > 0) {
            params['steps'].forEach(step => {
              delete step['iconClass']
              delete step['isEdit']
            })
          }
          delete params['id']
        }
      })
    },
    // 日期格式化yy-MM-dd
    formatDate(date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    // getUsers () {
    //   getUsers().then((data) => {
    //     this.senders = data.data;
    //   });
    // },
    // 表格列表公共
    tableLists(data) {
      this.junctionTable.loading = false
      if (data.error) {
        this.$message.error(data.error.message)
      } else {
        if (data.data.rows && data.data.rows.length > 0) {
          data.data.rows.forEach(item => {
            if (item.receiverRoles instanceof Array)
              item.receiverRoles =
                item.receiverRoles instanceof Array && item.receiverRoles.join('；')
          })
          this.junctionTable.total = data.data.total
          this.junctionTable.tableData = data.data.rows
          this.junctionTable.tableData.forEach((item, index) => {
            item.serialNumber =
              (this.junctionTable.page - 1) * this.junctionTable.limit + (index + 1)
          })
        } else {
          this.junctionTable.total = 0
          this.junctionTable.tableData = []
        }
      }
    },
    // 当角色发生变化
    change(val) {
      // 清楚vuex中的权限点和显示的菜单列表以及用户信息
      this.$store.commit('tagsView/DEL_ALL_CACHED_VIEWS')
      this.$store.commit('tagsView/DEL_ALL_VISITED_VIEWS')
      this.$store.commit('GET_ROLEID', val)
      const name = this.roleList.filter(item => {
        return item.code === val
      })
      this.$store.commit('GET_NAME', name[0].name)
      this.$store.dispatch('switchingRoles')
      if (this.$route.path === '/welcome/users') {
        this.$router.go(0)
      } else {
        this.$router.replace('/welcome/users')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.navBar {
  .navBarRow {
    height: 46px;
    line-height: 46px;
  }

  .form {
    margin: 20px 100px 30px 65px;
  }

  .logo {
    float: left;
    width: 194px;

    img {
      width: 100%;
      height: 28px;
      vertical-align: middle;
    }
  }

  .NavBar {
    float: left;
    padding-left: 120px;

    .active {
      color: red;
    }

    .barItem {
      margin: 0 10px;
      font-size: 16px;
      color: #dbdbdb;
    }
  }

  .JunctionBoard {
    display: flex;
    float: left;
    width: 95px;
    height: 46px;
    cursor: pointer;

    &:focus,
    &:hover {
      font-weight: bold;
      background: #656c7e !important;
    }

    span {
      padding-left: 3px;
      margin-top: 17px;
      font-size: 14px;
      line-height: 14px;
      color: $color-white;

      &:focus,
      &:hover {
        font-weight: bold;
      }
    }

    .navMenuIcon {
      align-content: center;
      width: 14px;
      height: 14px;
      margin: 17px 5px 0 15px;
      color: $color-white;
    }
  }

  .userImg {
    float: right;
    height: 38px;
    padding-top: 8px;
    line-height: 38px;

    .elform {
      .el-form-item {
        .select {
          ::v-deep .el-input {
            .el-input__inner {
              font-weight: 700;
              color: #fff;
              background: #1e1d21 !important;
            }
            .el-input__suffix {
              top: -3px;
              .el-icon-arrow-up {
                color: #fff;
              }
            }
          }
        }
      }
    }
    .userBadge {
      top: -1px;
      right: 90px;
    }

    .headImg {
      float: left;
      width: 25px;
      height: 25px;
      cursor: pointer;
      background: $color-table-header-bg;
      border-radius: 50%;
    }

    .avatar {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }

    .fullScreenBtn {
      margin-right: 10px;
      font-size: 14px;
      line-height: 10px;
      color: $color-white;
      cursor: pointer;
    }
  }

  .userName {
    float: right;
    height: 25px;
    padding-left: 12px;
    margin: 0;
    font-size: 12px;
    line-height: 25px;
    color: $color-white;
    cursor: pointer;
  }

  .junctionBoard_dialog {
    /* position: absolute; */

    /* top: 200px; */
    height: auto;
    overflow-y: hidden;

    .sendMessage {
      position: relative;
      left: 50%;
    }
  }

  .junctionDetail,
  .junctionSend {
    padding: 30px 20px 0 0;
  }
}
</style>
<style lang="scss">
.editPwd {
  .form {
    .el-form-item {
      margin-bottom: 30px;
    }
  }
}

.userImg .el-badge .el-badge__content.is-fixed {
  top: 2px;
  right: -8px;
  // z-index: 1;
  -webkit-transform: translateY(-50%) translateX(-70%);
  transform: translateY(-50%) translateX(-70%);
}

.el-dialog__header {
  height: 30px;
  padding: 0 20px;
  line-height: 30px;
  background-color: rgba(49, 50, 54, 0.1);
  border-bottom: 1px solid #dbdbdb;

  .el-dialog__title {
    position: relative;
    top: 5px;
    font-size: 14px;
    font-weight: bold;
  }

  .el-dialog__headerbtn {
    position: absolute;
    top: 8px;
    right: 10px;
  }

  .table-panel {
    padding-top: 0;
  }
  .item {
    color: red;
  }
}
</style>
<style lang="scss" scope>
.select {
  width: 120px;
  height: 30px;
}
.box {
  margin-top: -8px;
  margin-right: 10px;
  .elform {
    .el-form-item__label {
      padding: 0;
    }
  }

  .icon {
    margin-right: 5px;
    color: rgb(224, 224, 224);
    border: 1px solid;
    border-radius: 7px;
  }
}
</style>
