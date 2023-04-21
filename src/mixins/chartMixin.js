// import Echarts from 'echarts';
import * as Echarts from 'echarts';
import { throttle } from 'lodash';

export default {
  computed: {
    /* 图表DOM */
    $_chartMixin_chartWrapperDom () {
      const dom = document.getElementById(this.thisDomId);
      return dom && Echarts.init(dom);
    },

    $_chartMixin_chartResize () {
      return throttle(() => this.$_chartMixin_chartWrapperDom.resize(), 400);
    }
  },
  methods: {
    /* 图表初始化 */
    $_chartMixin_initChart () {
      this.option && this.$_chartMixin_chartWrapperDom.setOption(this.option);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$_chartMixin_initChart();
    });

    window.addEventListener('resize', this.$_chartMixin_chartResize);
  },
  destroyed () {
    window.removeEventListener('resize', this.$_chartMixin_chartResize);
  }
};