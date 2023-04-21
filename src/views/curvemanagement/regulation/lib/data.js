import { initData } from '@utils/util'
export const renderFrom = [
  {
    label: '曲线类型',
    key: 'curveType',
    type: 'Select',
    clearable: true,
    options: [
      { code: '1', name: '自定义曲线' },
      { code: '0', name: '标准曲线' }
    ],
    rowId: 1,
    filterable: true
  },
  {
    label: '曲线创建人',
    key: 'curveCreatePrsnList',
    type: 'Select',
    clearable: true,
    options: [],
    rowId: 1,
    filterable: true,
    multiple: true,
    disabled: false
  },
  {
    label: '曲线名称',
    key: 'curveList',
    type: 'Select',
    clearable: true,
    options: [],
    rowId: 1,
    filterable: true,
    multiple: true
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '重置',
        btnType: 'primary',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 1,
  maxCol: 4,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom
}
