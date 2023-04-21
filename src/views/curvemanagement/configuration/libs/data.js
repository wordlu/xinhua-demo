import { initData } from '@utils/util'
export const renderFrom = [
  {
    label: '菜单类型',
    key: 'type',
    type: 'Select',
    clearable: true,
    options: [],
    rowId: 1,
    filterable: true
  },
  {
    label: '父菜单',
    key: 'parentId',
    type: 'childrenSelect',
    rowId: 1,
    icon: 'el-icon-search',
    defaultProps: {
      children: 'children',
      label: 'name'
    },
    id: 'id'
  },
  {
    label: '菜单/按钮名称',
    key: 'name',
    type: 'Input',
    rowId: 1,
    maxlength: '30'
  },
  {
    label: '路由路径',
    key: 'path',
    type: 'Input',
    rowId: 1,
    maxlength: '30'
  },
  {
    label: '排序',
    key: 'sort',
    type: 'Input',
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '保存',
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(value => {
            if (value) {
              _.initData = initData(renderFrom)
              _this.$emit('queryForm', val)
            }
          })
        }
      },
      {
        label: '重置',
        btnType: 'primary',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$refs.myForm.resetFields()
          _this.$emit('resetForm')
        }
      },
      {
        label: '取消',
        onClick: (val, _, _this) => {
          _this.$refs.myForm.resetFields()
          _.initData = initData(renderFrom)
          _this.$emit('cancel', val)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 4,
  maxCol: 1,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom
}

export const initPageNum = 1
