<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'单一债券标准估值'" />
      <TabPane
        v-model="activeDataTab"
        :tab-list="tabData"
        :type="'card'"
        :default-name="activeDataTab"
        @handleTabChange="handleTabOnChange"
      />
      <keep-alive>
        <component :is="activeDataTab"></component>
      </keep-alive>
    </el-container>
  </div>
</template>

<script>
import TabPane from '@components/TabPane';
import BeforeLineTitle from '@components/CommonTitle';
import SingeDate from './components/singeDate';
import BondTrend from './components/bondTrend';
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'SingleBond',
  components: {
    TabPane,
    BeforeLineTitle,
    SingeDate,
    BondTrend
  },
  mixins: [keepMixin],
  data () {
    return {
      activeDataTab: 'SingeDate',
      tabData: [
        {
          label: '单一日期估值',
          name: 'SingeDate'
        },
        {
          label: '估值走势',
          name: 'BondTrend'
        }
      ]
    };
  },
  methods: {
    handleTabOnChange(data) {
      this.activeDataTab = data.name;
    }
  }
};
</script>
