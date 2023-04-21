import { initData } from '@/src/utils/util'
const renderForm = [
  {
    type: 'Input',
    rowId: 2,
    label: '角色名称',
    key: 'name',
    placeholder: '请输入角色名称'
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '授权',
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('queryForm', val.initData)
        }
      },
      {
        label: '取消',
        onClick: (_, val, _this) => {
          _this.$emit('cancel')
        }
      },
      {
        label: '查询',
        onClick: (_, val, _this) => {
          _this.$emit('query', _)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderForm),
  maxRow: 2,
  maxCol: 1,
  isFoldRow: false,
  Folding: false,
  renderFrom: renderForm
}

export const list = [
  {
    type: 'selection',
    align: 'center',
    width: 60
  },
  {
    label: '序号',
    align: 'center',
    width: 80,
    render: (h, record) => {
      return h('span', record.$index + 1)
    }
  },
  {
    label: '角色代码',
    prop: 'roleCode',
    align: 'center'
  },
  {
    label: '角色名称',
    prop: 'roleName',
    align: 'center'
  },
  {
    label: '角色类型',
    prop: 'roleType',
    align: 'center'
  },
  {
    label: '角色描述',
    prop: 'roleDesc',
    align: 'center'
  }
]
