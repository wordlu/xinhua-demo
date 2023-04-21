// import { initData } from '@/src/utils/util'
import { initData } from '@utils/util'
export const renderFrom = [
  {
    label: '菜单类型',
    key: 'type',
    type: 'Select',
    clearable: true,
    options: [
      {
        name: '菜单',
        code: 0
      },
      {
        name: '按钮',
        code: 1
      }
    ],
    rowId: 1,
    filterable: true
  },
  {
    label: '父菜单',
    key: 'parentId',
    type: 'childrenSelect',
    options: [],
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
    rowId: 1,
    maxlength: '4'
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

const rules = {
  type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  // parentId: [{ required: true, message: '请选择父菜单', trigger: 'blur' }],
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
      message: '只可以输入中文、英文、数字但不包括下划线等符号',
      trigger: 'blur'
    }
  ],
  path: [
    {
      pattern: /^[0-9a-zA-Z/]{1,}$/,
      message: '只支持英文数字或反斜线线组成的字符串,并且不可以有空格',
      trigger: 'blur'
    }
  ],
  // embedType: [{ required: true, message: '请选择资源类型', trigger: 'blur' }]
  sort: [
    { pattern: /^[0-9]*[1-9][0-9]*$/, message: '只支持正整数,并且不可以有空格', trigger: 'blur' }
  ]
}

export const formData = {
  rules,
  initData: initData(renderFrom),
  maxRow: 4,
  maxCol: 1,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom
}

// export const newRenderFrom = [
//   {
//     label: '菜单类型',
//     key: 'type',
//     type: 'Select',
//     options: [],
//     rowId: 1,
//     filterable: true
//   },
//   {
//     label: '父菜单',
//     key: 'parentId',
//     type: 'childrenSelect',
//     rowId: 1,
//     icon: 'el-icon-search',
//     defaultProps: {
//       children: 'children',
//       label: 'name'
//     },
//     id: 'id'
//   },
//   {
//     label: '按钮名称',
//     key: 'name',
//     type: 'Input',
//     rowId: 1
//   },
//   {
//     label: '权限标识',
//     key: 'path',
//     type: 'Input',
//     rowId: 1
//   },
//   {
//     type: 'Buttons',
//     rowId: 4,
//     children: [
//       {
//         label: '保存',
//         btnType: 'primary',
//         onClick: (val, _, _this) => {
//           _this.$refs.myForm.validate(value => {
//             if (value) {
//               _.initData = initData(newRenderFrom)
//               _this.$emit('queryForm', val)
//             }
//           })
//         }
//       },
//       {
//         label: '重置',
//         btnType: 'primary',
//         onClick: (_, val, _this) => {
//           val.initData = initData(newRenderFrom)
//           _this.$refs.myForm.resetFields()
//           _this.$emit('resetForm')
//         }
//       },
//       {
//         label: '取消',
//         onClick: (val, _, _this) => {
//           _this.$refs.myForm.resetFields()
//           _this.$emit('cancel', val)
//         }
//       }
//     ]
//   }
// ]

// const newRules = {
//   type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
//   parentId: [{ required: true, message: '请选择父菜单', trigger: 'blur' }],
//   name: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
//   path: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
// }

// export const newFormData = {
//   rules: newRules,
//   initData: initData(newRenderFrom),
//   maxRow: 4,
//   maxCol: 1,
//   isFoldRow: false, // 是否需要折叠
//   Folding: false, // 折叠状态
//   newRenderFrom
// }
