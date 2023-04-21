<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'无风险利率走势分析'" />
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
import CurveTrend from './components/curveTrend'
import CurveData from './components/curveData'

export default {
  name: 'RateTrend',
  components: {
    BeforeLineTitle,
    TabPane,
    CurveTrend,
    CurveData
  },
  mixins: [keepMixin],
  data() {
    return {
      activeTab: 'CurveTrend',
      tabList: [
        {
          label: '曲线走势对比',
          name: 'CurveTrend'
        },
        {
          label: '曲线数据查询',
          name: 'CurveData'
        }
      ]
    }
  },
  methods: {
    handleTabChange(data) {
      this.activeTab = data.name
    }
  }
}
</script>
