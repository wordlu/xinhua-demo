<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'主体级别查询与管理'" />
      <TabPane
        v-model="activeTab"
        :tab-list="tabList"
        :type="'card'"
        :default-name="activeTab"
        @handleTabChange="handleTabChange"
      />
      <keep-alive>
        <ObjectLevel v-if="activeTab === 'objectLevel'"/>
      </keep-alive>
      <keep-alive>
        <ObjectHistory v-if="activeTab === 'objectHistory'"/>
      </keep-alive>
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle';
import TabPane from '@components/TabPane';
import ObjectLevel from "./objectLevel";
import ObjectHistory from "./objectHistory";
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'ObjectManagement',  
  components: {
    BeforeLineTitle,
    TabPane,
    ObjectLevel,
    ObjectHistory
  },
  mixins: [keepMixin],
  data() {
    return {
      tabList: [
        {
          label: '主体级别状态查询',
          name: 'objectLevel'
        },
        {
          label: '主体评级记录查询',
          name: 'objectHistory'
        }
      ],
      activeTab: 'objectLevel'
    };
  },
  computed: {},
  created() {},
  methods: {
    // tab切换
    handleTabChange(data) {
      this.activeTab = data.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.configMain {
  padding: 0;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
  }
}
</style>
