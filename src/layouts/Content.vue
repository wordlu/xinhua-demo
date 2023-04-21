<template>
  <div class="content" :style="{ height: height }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="$route.fullPath" class="contentInner" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  },
  watch: {
    height() {}
  }
}
</script>

<style lang="scss" scoped>
.content {
  flex: 1 1 auto;
  height: 100%;
  overflow-x: hidden;
  font-size: 0;
  background-color: #fff;
}
.contentInner {
  height: 100%;
  font-size: 14px;
}
</style>
