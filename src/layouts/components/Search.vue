<template>
  <div style="text-align: right">
    <el-input
      :class="['inline-input', { show: searchInput }]"
      @blur="searchInput = false"
    >
      <i
        slot="prefix"
        class="el-input__icon el-icon-search"
        @click="searchInput = true"
      ></i>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: false
    };
  }
};
</script>

<style lang="scss">
.inline-input {
  position: relative;
  width: 0;
  margin-right: 20px;
  // width: 90%;
  transition: all 1s;
  .el-input__inner {
    padding: 0;
    background: #ccc;
    border: 0;
  }
  &.show {
    width: 170px;
  }
}
</style>
