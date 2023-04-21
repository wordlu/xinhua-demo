<template>
  <el-table-column
    v-if="col.render"
    :key="col.dataIndex + 'column1'"
    v-bind="col"
    :fixed="col.fix ? col.fix : false"
  >
    <template slot-scope="{ row, column, $index }">
      <ColumnRender
        :render-col="col.render"
        :record="row"
        :value="row[col.dataIndex]"
        :index="$index"
        :prop-key="col.prop"
      ></ColumnRender>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.label === '操作' && col.actions"
    :key="col.prop"
    v-bind="col"
  >
    <template slot-scope="{ row, column, $index }">
      <ColumnRender
        :render-col="renderAction(col.actions)"
        :record="row"
        :value="row[col.dataIndex]"
        :index="$index"
        :prop-key="col.prop"
      ></ColumnRender> </template
  ></el-table-column>
  <el-table-column
    v-else
    :key="col.prop + 'column2'"
    v-bind="col"
    :fixed="col.fix ? col.fix : false"
  >
    <template v-if="col.children">
      <table-column
        v-for="(item, index) in col.children"
        :key="index + 'column3'"
        :col="item"
        :render-header="
          item.lineFeed === true ? lineFeedHandle(item) : item.renderHeader
        "
        :formatter="
          item.format || item.format === ''
            ? formatNumber(item)
            : item.formatter
        "
      ></table-column>
    </template>
  </el-table-column>
</template>

<script>
import { currencyFormatter } from '@utils/util';
import { authActionRender } from '../renders/colActions';
import ColumnRender from './column-render';
import random from 'lodash/random';
export default {
  name: 'TableColumn',
  components: {
    ColumnRender
  },
  props: {
    col: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      randomNum: random(1, 1000000000000)
    };
  },
  methods: {
    renderAction(actions) {
      return authActionRender(actions);
    },
    formatNumber(col) {
      col.render = (h, scope) => {
        col.format = col.format === '' ? '2' : col.format;
        return (
          <span>{`${currencyFormatter(
            scope.record[scope.prop],
            Number(col.format)
          )}`}</span>
        );
      };
    },
    lineFeedHandle(col) {
      col.renderHeader = (h, { column, $index }) => {
        return h(
          'span',
          {
            style: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': '18px'
            }
          },
          [
            h('span', {}, column.label.split('|')[0]),
            h(
              'span',
              {
                style: { display: 'block' }
              },
              column.label.split('|')[1]
            )
          ]
        );
      };
    }
  }
};
</script>
