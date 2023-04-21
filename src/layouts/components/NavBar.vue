<template>
  <div style="height: 100%">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" @input="change">
      <el-radio-button :label="false">
        <i class="el-icon-edit"></i>
      </el-radio-button>
    </el-radio-group> -->
    <div :class="{ bigBox: isCollapse === false, smallBox: isCollapse === true }">
      <el-button type="text" @click="flex">
        <i
          :class="{
            'el-icon-s-fold': isCollapse === false,
            'el-icon-s-unfold': isCollapse === true
          }"
          style="font-size: 20px"
        ></i>
      </el-button>
    </div>
    <el-menu
      :active-text-color="activeTextColor"
      :default-active="$route.path"
      background-color="#4A4D4F"
      :collapse="isCollapse"
      router
      :collapse-transition="false"
      popper-append-to-body
    >
      <NavMenu :nav-menus="menuData"></NavMenu>
    </el-menu>
  </div>
</template>
<script>
import NavMenu from './NavMenu.vue'
import scss from '@assets/scss/index.scss'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavMenu: NavMenu
  },
  data() {
    return {
      activeIndex: 'home',
      activeTextColor: scss['global-color-main'],
      // menuData1: RoutesMapConfig
      isCollapse: false
    }
  },
  computed: {
    menuData() {
      let menus = this.$store.getters.authorizes
      return menus
    },
    ...mapGetters({})
  },
  methods: {
    change() {
      this.$store.commit('tagsView/SET_SIDE_BAR', this.isCollapse)
    },
    flex() {
      this.isCollapse = !this.isCollapse
      this.$emit('flex', this.isCollapse)
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  outline: none;
}
</style>

<style lang="scss">
.el-menu.el-menu--horizontal {
  background-color: $color-main;
  border-bottom: none;

  .el-menu-item {
    float: left;
    height: 46px;
    padding: 0 15px;
    line-height: 46px;
    color: $color-white;
    background: $color-main !important;

    &:focus,
    &:hover,
    &.is-active {
      font-weight: bold;
      color: $color-white !important;
      background: #36353a !important;
      // border-bottom: 3px solid $color-main-hover !important;
    }
  }

  .el-submenu {
    float: left;

    .el-submenu__title {
      height: 46px;
      padding: 0 15px;
      line-height: 46px;
      color: $color-white;

      > i {
        display: none;
      }

      &:focus,
      &:hover {
        font-weight: bold;
        color: $color-white;
        background: $color-main !important;
        // border-bottom: 3px solid $color-main-hover !important;
      }
    }

    &.is-active {
      .el-submenu__title {
        font-weight: bold;
        color: $color-white !important;
        background: $color-main !important;
        // border-bottom: 3px solid $color-main-hover !important;
      }
    }
  }
}

.el-menu {
  height: 100%;
  padding: 0;
}

.el-menu.el-menu--horizontal:link {
  // border-color: red;
  // box-shadow: none;
  background-color: $color-menu-bg;
}
.bigBox {
  width: 250px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: rgb(74, 77, 79);
}
.smallBox {
  width: 56px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: rgb(74, 77, 79);
}
</style>
