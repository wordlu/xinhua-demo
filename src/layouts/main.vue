<template>
  <div class="layout">
    <el-container class="page">
      <el-header class="header" height="46px">
        <Header class="fr" />
      </el-header>
      <TagViews class="header-tags" />
      <Breadcrumb />
      <el-container class="body-warp conentWrap">
        <el-aside
          v-if="$route.name !== 'Home'"
          :class="{ bigBox1: isCollapse === false, smallBox1: isCollapse === true }"
        >
          <NavBar @flex="flex" />
        </el-aside>
        <el-main>
          <Content :height="height" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from './Header'
import TagViews from '@components/TagsView'
import NavBar from './components/NavBar.vue'
import Breadcrumb from '@components/Breadcrumb'
import Content from './Content'
import moment from 'moment'
export default {
  components: {
    Header,
    TagViews,
    NavBar,
    Breadcrumb,
    Content
  },
  data() {
    return {
      timerNotice: null,
      height: '',
      tagHeight: '',
      isCollapse: false
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  },
  methods: {
    //  在每一天的零点时，执行退出操作
    isLogout() {
      let targetTime = moment()
        .add(1, 'days')
        .hours(0)
        .minutes(0)
        .seconds(0)
      let currentTime = moment()
      let diff = targetTime.diff(currentTime)
      let timerLogout = setTimeout(() => {
        if (this.$route.path.indexOf('monitorBigScreen') > -1) {
          clearTimeout(timerLogout)
          this.isLogout()
          return false
        } else {
          this.$store.dispatch('logOut', this)
          clearTimeout(timerLogout)
        }
      }, diff)
    },
    // 请求是否允许消息推送
    getPermission() {
      return new Promise((resolve, reject) => {
        if (window.Notification) {
          if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(function(result) {
              if (!Notification.permission) {
                Notification.permission = result
              }
              resolve(Notification.permission)
            })
          } else {
            resolve(Notification.permission)
          }
        } else {
          reject(new Error('当前浏览器不支持 Web Notifications'))
        }
      })
    },
    // 组件卸载、浏览器关闭、刷新时关闭定时器
    beforeunloadHandler() {
      if (this.timerNotice) {
        clearTimeout(this.timerNotice)
      }
      this.$store.commit('personal/FIRST_REQUEST', false)
    },
    // 轮询
    polling(status) {
      this.timerNotice && clearTimeout(this.timerNotice)
      this.timerNotice = setTimeout(
        () => {
          // 30s轮询一次，请求待办理任务列表
          this.$store.dispatch('personal/getPersonalTodoList', {
            permission: status
          })
          this.polling(status)
        },
        30000,
        status
      )
    },
    flex(val) {
      this.isCollapse = val
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
}

.layout {
  height: 100%;
  font-size: 0;
}

.header {
  font-size: 0;
  background: $color-menu-bg;
}

.el-main {
  padding: 10px;
  overflow: hidden;
  background-color: #f2f2f2;
}

.body-warp {
  height: calc(100% - 108px);
}
.bigBox1 {
  width: 251px !important;
  overflow-x: hidden;
  overflow-y: auto;
  // 火狐滚动条消失并且可以滚动
  scrollbar-width: none;
}
.smallBox1 {
  width: 56px !important;
  overflow: hidden !important;
  ::v-deep .navMenutitle {
    margin-left: 50px;
  }
  ::v-deep .el-icon-arrow-right {
    display: none;
  }
  ::v-deep .el-tooltip {
    padding: 0 16px !important;
  }
  ::v-deep .el-menu {
    width: 57px;
  }
}
</style>
