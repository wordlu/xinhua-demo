export const columnsHistory = [
  {
    label: '序号',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    align: 'center'
  },
  {
    label: '债项级别',
    prop: 'bndLevel',
    align: 'center'
  },
  {
    label: '主体级别',
    prop: 'objLevel',
    align: 'center'
  },
  {
    label: '主体评级类型',
    prop: 'objRatingTp',
    align: 'center'
  },
  {
    label: '主体评级生效日期',
    prop: 'objRatingDate',
    align: 'center'
  },
  {
    label: '债项评级日期',
    prop: 'bndRatingDate',
    align: 'center'
  }
]
