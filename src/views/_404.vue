<template>
  <h1 class="title">
    404
    <template v-if="resource">
      {{ resource }}
    </template>
    Not Found
  </h1>
</template>

<script>
export default {
  page: {
    title: '页面未找到',
    meta: [{ name: 'description', content: '404' }]
  },
  props: {
    resource: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
