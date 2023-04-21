import { initData } from '@/src/utils/util'
import cloneDeep from 'lodash/cloneDeep'
export const renderFrom = [
  {
    label: '角色编码',
    key: 'code',
    type: 'Select',
    clearable: true,
    options: [],
    filterable: true,
    multiple: true,
    rowId: 1,
    filterMethod: true,
    reserveKeyword: true
  },
  {
    type: 'Input',
    label: '角色名称:',
    key: 'name',
    rowId: 1
  },

  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '新增',
        btnShow: 82101,
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('queryForm', val.initData)
        }
      },
      {
        label: '删除',
        btnShow: 82102,
        onClick: (_, val, _this) => {
          _this.$emit('deleteRole')
        }
      },
      {
        label: '查询',
        btnShow: 82103,
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('inquire', val.initData)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 1,
  maxCol: 2,
  isFoldRow: false,
  Folding: false,
  renderFrom: cloneDeep(renderFrom)
}

export const list = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    label: '序号',
    align: 'center',
    width: 50,
    render: (h, record) => {
      return h('span', record.$index + 1)
    }
  },
  {
    label: '角色编码',
    prop: 'roleCode',
    align: 'center'
  },
  {
    label: '角色名称',
    prop: 'roleName',
    align: 'center'
  },
  {
    label: '角色描述',
    prop: 'roleDesc',
    align: 'center'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: 150
  },
  {
    label: '修改时间',
    prop: 'updateTime',
    align: 'center',
    width: 150
  }
]
