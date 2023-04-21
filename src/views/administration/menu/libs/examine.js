import { initData } from '@/src/utils/util'
// import { initData } from '@utils/util'
export const renderFrom = [
  {
    label: '菜单名称',
    key: 'name',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '路径',
    key: 'path',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '菜单类型',
    key: 'type',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '取消',
        onClick: (_, val, _this) => {
          _this.$emit('export', val.initData)
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
  renderFrom
}
