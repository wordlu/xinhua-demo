<template>
  <div class="tab-pane">
    <el-tabs :value="defaultName" :type="type" @tab-click="handleTabChange">
      <el-tab-pane v-for="item in tabList" :key="item.label" :label="item.label" :name="item.name">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'TabPane',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    defaultName: {
      type: String,
      required: true
    }
  },
  methods: {
    handleTabChange (tab, event) {
      this.$emit('handleTabChange', tab);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-pane {
  padding: 0 10px;

  .el-tabs--card {
    ::v-deep.el-tabs__item.is-active {
      color: $color-main;
    }
  }
}
</style>