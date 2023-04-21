import { initData } from '@utils/util'
export const renderFrom = [
  {
    label: '登录账号',
    key: 'loginName',
    type: 'Input',
    rowId: 1,
    placeholder: '请输入登录账号',
    maxlength: '30'
  },
  {
    label: '用户名称',
    key: 'username',
    type: 'Input',
    placeholder: '请输入用户名称',
    rowId: 1,
    maxlength: '30'
  },
  {
    label: '手机号',
    key: 'phone',
    type: 'Input',
    rowId: 1,
    password: false,
    placeholder: '请输入手机号'
  },
  {
    label: '所属部门',
    key: 'deptId',
    type: 'Select',
    clearable: true,
    options: [],
    filterable: true,
    rowId: 1,
    filterMethod: true, // 自定义搜索方法传递true，走baseForm里方法
    reserveKeyword: true // 如果下拉项是多选，需要一次多选几个项，加这个属性
  },
  {
    label: '密码',
    key: 'password',
    type: 'Input',
    rowId: 1,
    password: true,
    placeholder: '请输入密码'
  },
  {
    label: '确认密码',
    key: 'confirmPassword',
    type: 'Input',
    rowId: 1,
    password: true,
    placeholder: '请再次输入密码'
  },
  // 这个也得 需求问客户 暂时不需要
  // {
  //   label: '角色授权',
  //   key: 'role',
  //   type: 'Input',
  //   readonly: false,
  //   rowId: 1
  // },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '重置',
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('clear', val)
          _this.$refs.myForm.resetFields()
          val.initData = initData(renderFrom)
        }
      },
      {
        label: '保存',
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(value => {
            if (value) {
              // val获取当前的form表单数据
              _.initData = initData(renderFrom)
              _this.$emit('queryForm', val)
            }
          })
        }
      },
      {
        label: '取消',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('cancel')
        }
      }
    ]
  }
]

const rules = {
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    {
      pattern: '^[\u4e00-\u9fa5_a-zA-Z0-9]+$',
      message: '用户名称只支持数字，26个英文字母或者中文组成的字符串,并且不可包括空格',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
      message: '请输入正确手机号',
      trigger: 'blur'
    }
  ]
}

export const formData = {
  rules,
  initData: initData(renderFrom),
  maxRow: 4,
  maxCol: 2,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom
}
export const renderFrom2 = [
  {
    label: '登录账号',
    key: 'loginName',
    type: 'Input',
    rowId: 1,
    placeholder: '请输入登录账号',
    maxlength: '30',
    show: true
  },
  {
    label: '用户名称',
    key: 'username',
    type: 'Input',
    placeholder: '请输入用户名称',
    rowId: 1,
    maxlength: '30',
    show: true
  },
  {
    label: '手机号',
    key: 'phone',
    type: 'Input',
    rowId: 1,
    password: false,
    placeholder: '请输入手机号'
  },
  {
    label: '所属部门',
    key: 'deptId',
    type: 'Select',
    clearable: true,
    options: [],
    rowId: 1,
    filterable: true
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '重置',
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('clear', val)
        }
      },
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
        label: '取消',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('cancel')
        }
      }
    ]
  }
]
export const formData2 = {
  rules,
  initData: initData(renderFrom),
  maxRow: 4,
  maxCol: 2,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: renderFrom2
}
