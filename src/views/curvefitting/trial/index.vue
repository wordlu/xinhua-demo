<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <Tabs
        v-model="activeDataTab"
        :tab-list="tabData"
        :type="'card'"
        :default-name="activeDataTab"
        @handleTabChange="handleTabChange"
      ></Tabs>
      <keep-alive>
        <component :is="activeDataTab"></component>
      </keep-alive>
    </el-container>
  </div>
</template>
<script>
import Tabs from '@components/TabPane'
import BeforeLineTitle from '@components/CommonTitle'
import keepMixin from '@mixins/keep.mixin'
import CustomCurve from './components/customCurve'
import StandardCluster from './components/standardCluster'
export default {
  name: 'CurvefittingTrial',
  components: {
    Tabs,
    BeforeLineTitle,
    StandardCluster,
    CustomCurve
  },
  mixins: [keepMixin],
  data() {
    return {
      beforeTitle: '曲线试算',
      activeDataTab: 'StandardCluster',
      tabData: [
        {
          label: '标准曲线簇试算',
          name: 'StandardCluster'
        },
        {
          label: '自定义曲线试算',
          name: 'CustomCurve'
        }
      ]
    }
  },
  methods: {
    handleTabChange(data) {
      this.activeDataTab = data.name
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  height: 100%;
  background-color: $color-body-bg;
  .bodyWrap {
    background-color: #fff;
  }
}
</style>
