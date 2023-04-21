import { initData } from '@/src/utils/util'
// import { initData } from '@utils/util'
export const renderFrom = [
  {
    label: '序号',
    key: 'serial',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '角色编码',
    key: 'roleCode',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '角色名称',
    key: 'roleName',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '角色描述',
    key: 'roleDesc',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '创建时间',
    key: 'createTime',
    type: 'Input',
    rowId: 1,
    show: true
  },
  {
    label: '修改时间',
    key: 'updateTime',
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
        type: 'primary',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
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
