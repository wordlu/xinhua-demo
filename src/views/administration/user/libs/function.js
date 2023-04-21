import { initData, dateConfig, pickerOptions } from '@utils/util'
import cloneDeep from 'lodash/cloneDeep'
export const renderFrom = [
  {
    label: '开始日期:',
    key: 'beginDate',
    type: 'DatePicker',
    initValue: dateConfig().beginDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '结束日期:',
    key: 'endDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '角色名称:',
    key: 'userName',
    type: 'Select',
    clearable: true,
    multiple: true,
    options: [],
    rowId: 1,
    filterable: true,
    filterMethod: true,
    reserveKeyword: true
  },
  {
    label: '功能名称:',
    key: 'operationId',
    type: 'Select',
    clearable: true,
    multiple: true,
    options: [],
    rowId: 1,
    filterable: true,
    filterMethod: true,
    reserveKeyword: true
  },
  {
    label: '变更类型:',
    key: 'changeType',
    type: 'Select',
    clearable: true,
    options: [
      {
        name: '新增',
        code: '新增'
      },
      {
        name: '删除',
        code: '删除'
      }
    ],
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '重置',
        btnShow: 81402,
        btnType: 'primary',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnShow: 81401,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      },
      {
        label: '导出',
        btnShow: 84208,
        onClick: (val, _, _this) => {
          _this.$emit('download', val)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 4,
  maxCol: 3,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: cloneDeep(renderFrom)
}
export const list = [
  {
    label: '序号',
    align: 'center',
    render: (h, record) => {
      return h('span', record.$index + 1)
    }
  },
  {
    label: '角色名称',
    prop: 'userName',
    align: 'center'
  },
  {
    label: '功能名称',
    prop: 'operationName',
    align: 'center'
  },
  {
    label: '操作时间',
    prop: 'createTime',
    align: 'center'
  },
  {
    label: '变更类型',
    prop: 'changeType',
    align: 'center'
  }
]
