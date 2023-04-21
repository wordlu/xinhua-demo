<template>
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          v-for="item in levelList"
          :key="item.path"
          :to="{ path: item.meta.clickable ? item.path : '' }"
        >
          <span :class="{ current: isCurrent(item.path) }">{{
            item.meta.title
          }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      levelList: []
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      let index = matched.findIndex((item) => {
        return item.meta.hidden === true;
      });
      if (index !== -1) {
        matched.splice(index, 0, matched[index].meta.parentInfo);
      }
      this.levelList = matched;
    },
    isCurrent(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  // flex: 0 0 40px;
  padding-left: 20px;
  background-color: $color-menu-bg;
  .el-breadcrumb {
    display: inline-block;
    font-size: 12px;
    line-height: 32px;
    .current {
      font-weight: bold;
      color: $color-main-hover;
    }
  }
}
</style>
<style lang="scss">
.breadcrumb {
  .el-breadcrumb {
    .el-breadcrumb__inner.is-link,
    .el-breadcrumb__inner a {
      font-weight: initial;
    }
    .el-breadcrumb__inner,
    .el-breadcrumb__separator {
      color: $color-white;
    }
  }
}
</style>
