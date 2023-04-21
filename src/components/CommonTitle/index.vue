<template>
  <div class="before-line-title">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'CommonTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
.before-line-title {
  width: 100%;
  height: 32px;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  box-shadow: inset 0 -1px 0 0 #EBEEF5;
  &::before {
    display: inline-block;
    width: 2px;
    height: 12px;
    margin-left: 6px;
    line-height: 32px;
    content: '';
    background-color: #177DDC;

  }
}
</style>