<template>
  <h1 class="title">
    The page timed out while loading. Are you sure you're still connected to the
    Internet?
  </h1>
</template>

<script>
export default {
  pate: {
    title: '页面请求超时',
    meta: [
      { name: 'description', content: 'The page timed out while loading.' }
    ]
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>