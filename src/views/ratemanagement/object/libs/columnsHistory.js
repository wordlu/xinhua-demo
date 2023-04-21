export const columnsHistory = [
  {
    label: '序号',
    render: (h, record) => {
      return h('span', record.$index + 1);
    },
    align: 'center'
  },
  {
    label: '主体评级类型',
    prop: 'objLevelType',
    align: 'center'
  },
  {
    label: '主体级别',
    prop: 'objLevel',
    align: 'center'
  },
  {
    label: '评级生效日',
    prop: 'ratingEffectiveDt',
    align: 'center'
  },
  {
    label: '评级失效日',
    prop: 'ratingExpireDt',
    align: 'center'
  },
  {
    label: '所属分析师',
    prop: 'objBelongAnalyst',
    align: 'center'
  }
];
