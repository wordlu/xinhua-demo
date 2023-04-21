<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'单一主体标准估值'" />
      <TabPane
        v-model="activeDataTab"
        :tab-list="tabData"
        :type="'card'"
        :default-name="activeDataTab"
        @handleTabChange="handleTabOnChange"
      />
      <keep-alive>
        <component :is="activeDataTab" :ref="activeDataTab"></component>
      </keep-alive>
    </el-container>
  </div>
</template>

<script>
import TabPane from '@components/TabPane'
import BeforeLineTitle from '@components/CommonTitle'
import Term from './components/term'
import Trend from './components/trend'
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'SingleSubject',
  components: {
    TabPane,
    BeforeLineTitle,
    Term,
    Trend
  },
  mixins: [keepMixin],
  data() {
    return {
      activeDataTab: 'Term',
      tabData: [
        {
          label: '利率期限结构',
          name: 'Term'
        },
        {
          label: '利率走势分析',
          name: 'Trend'
        }
      ]
    }
  },
  methods: {
    handleTabOnChange(data) {
      this.activeDataTab = data.name
    }
  }
}
</script>
