<template>
  <div class="loadingPage">
    <span class="wrap">
      <i class="el-icon-loading loadingIcon"></i>
      <div>页面加载中</div>
    </span>
  </div>
</template>

<script>
export default {
  page: {
    title: '页面加载中...',
    meta: [{name: 'description', 'content': 'Loading page...'}]
  }
};
</script>

<style lang="scss" scoped>
.loadingPage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.wrap {
  font-size: 14px;
  color: $color-main;
  text-align: center;
}
.loadingIcon {
  font-size: 40px;
}
</style>