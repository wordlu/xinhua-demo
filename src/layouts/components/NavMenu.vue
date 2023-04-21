<template>
  <div class="navMenu">
    <template v-for="navMenu in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="menuItem(navMenu)"
        :key="navMenu.id"
        :index="navMenu.routerCode"
        class="levelOne"
        :popper-append-to-body="false"
        @click.native="open"
      >
        <!-- <i v-if="navMenu.id === 20000" :class="navMenu.icon"></i> -->
        <svg-icon v-if="navMenu.id === 20000" :icon-class="navMenu.icon" class="navMenuIcon">
        </svg-icon>
        <span slot="title" class="navMenutitle" :title="navMenu.title">{{ navMenu.title }}</span>
      </el-menu-item>
      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="submenu(navMenu)" :key="navMenu.id" :index="navMenu.routerCode">
        <template slot="title">
          <svg-icon v-if="navMenu.icon" :icon-class="navMenu.icon" class="navMenuIcon"> </svg-icon>
          <!-- <i :class="navMenu.icon"></i> -->
          <span class="navMenutitle" :title="navMenu.title"> {{ navMenu.title }}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :nav-menus="navMenu.children" class="levelTwo"></NavMenu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: { navMenus: { type: Array, required: true } },
  data() {
    return {}
  },
  methods: {
    menuItem(navMenu) {
      return (
        (!navMenu.children && navMenu.ignoreAuth) ||
        (navMenu.children && navMenu.children[0].type === 1)
      )
    },
    submenu(navMenu) {
      return (
        navMenu.children &&
        navMenu.children.length > 0 &&
        navMenu.type === 0 &&
        navMenu.children[0].type === 0
      )
    },
    // icon(navMenu) {
    //   return navMenu.icon && navMenu.icon !== ' '
    // },
    icon(navMenu) {
      return !(navMenu.icon && navMenu.icon.includes('el-icon'))
    },
    open() {
      this.$store.commit('tagsView/ADD_CLICK_TYPE', 'left')
      this.$store.commit('tagsView/ADD_CLICK_ARR_VIEWS', this.$route)
    }
  }
}
</script>
<style lang="scss">
// .navMenu .navMenuIcon {
//   width: 20px;
//   height: 20px;
//   margin-right: 3px;
// }
</style>

<style lang="scss">
.navMenu {
  .el-menu-item {
    padding-left: 16px !important;
    color: $color-white !important;

    &:focus,
    &:hover,
    &.is-active {
      // font-weight: bold;
      color: $color-white !important;
      background: $color-menu-hover !important;
    }
  }

  .el-submenu {
    .el-submenu__title {
      padding-left: 16px !important;
      color: $color-white;

      &:focus,
      &:hover {
        padding-left: 20px;
        // font-weight: bold;
        color: $color-white;
        background: $color-menu-hover !important;
      }
    }

    &.is-active {
      .el-submenu__title {
        padding-left: 14px;
        // font-weight: bold;
        color: $color-white !important;
        // background: rgba($color-menu-hover, 0.1) !important;
      }
    }

    .el-menu--horizontal {
      .el-menu-item {
        color: $color-white;

        &:focus,
        &:hover,
        &.is-active {
          // font-weight: bold;
          color: $color-white;
          background: $color-menu-hover !important;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.levelTwo {
  .el-menu-item {
    padding-left: 30px !important;
    background: #323537 !important;
  }

  .el-submenu {
    .el-submenu__title {
      padding-left: 30px !important;
      background: #323537 !important;
    }

    ul li {
      padding-left: 50px !important;
      background: #181b1d !important;
    }
  }
}

.navMenutitle {
  display: inline-block;
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.svg-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 5px;
  vertical-align: middle !important;
}
</style>
