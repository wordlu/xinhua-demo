<template>
  <div class="sizer sizer-item">
    <div class="sizer-head-btn chose">
      <el-button type="primary" size="small" @click="handleDialogVisible">{{
        buttonName
      }}</el-button>
    </div>
    <div class="sizer-container"> selected sizer item container </div>
    <div class="sizer-foot-btn empty">
      <el-button size="small" style="width: 100%">清空</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sizer',
  model: {},
  props: {
    buttonName: {
      type: String,
      default: '点击'
    },
    sizerType: {
      type: String,
      default: 'form'
    },
    sizers: {
      type: Array,
      default: () => []
    },
    dialogTitle: {
      type: String,
      default: '标题'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    handleDialogVisible() {
      this.$emit('handleVisible', true);
    }
  }
};
</script>
<style lang="scss" scoped>
.sizer-item {
  display: flex;
  padding: 0 20px;
  margin: 10px 0;
  .sizer-head-btn {
    width: 160px;
    margin-right: 20px;
    button {
      width: 100%;
    }
  }
  .sizer-container {
    justify-content: space-between;
    width: calc(100% - 280px);
    max-width: calc(100% - 280px);
    padding: 0 10px;
    line-height: 32px;
    border: 1px solid #ccc;
  }
  .sizer-foot-btn {
    width: 60px;
    margin-left: 20px;
  }
}
</style>
