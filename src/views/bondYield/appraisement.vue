<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'债券估值信息查询'" />
      <TabPane
        v-model="activeTab"
        :tab-list="tabList"
        :type="'card'"
        :default-name="activeTab"
        @handleTabChange="handleTabChange"
      />
      <keep-alive>
        <component :is="activeTab"></component>
      </keep-alive>
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import TabPane from '@components/TabPane'
import keepMixin from '@mixins/keep.mixin'
import Bond from './components/bond';
import VirtualBond from './components/virtualBond'; 

export default {
  name: 'BondAppraisement',
  components: {
    BeforeLineTitle,
    TabPane,
    Bond,
    VirtualBond
  },
  mixins: [keepMixin],
  data () {
    return {
      activeTab: 'Bond',
      tabList: [
        {
          label: '债券估值信息查询',
          name: 'Bond'
        },
        {
          label: '虚拟债券估值信息查询',
          name: 'VirtualBond'
        }
      ]
    }
  },
  methods: {
    handleTabChange (data) {
      this.activeTab = data.name;
    }
  }
}
</script>
