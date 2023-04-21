import { initData, suspension, dateConfig, pickerOptions } from '@utils/util'
import cloneDeep from 'lodash/cloneDeep'
export const renderFrom = [
  {
    label: '开始日期:',
    key: 'startTime',
    type: 'DatePicker',
    initValue: dateConfig().beginDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '结束日期:',
    key: 'endTime',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    type: 'Select',
    label: '操作人名称:',
    key: 'userName',
    clearable: true,
    multiple: true,
    options: [],
    rowId: 1,
    filterable: true,
    filterMethod: true,
    reserveKeyword: true
  },
  {
    label: '操作事件:',
    key: 'operatingEvent',
    type: 'Input',
    rowId: 1
  },
  {
    label: '状态:',
    key: 'state',
    type: 'Select',
    clearable: true,
    options: [
      {
        name: '成功',
        code: 0
      },
      {
        name: '失败',
        code: 1
      }
    ],
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnShow: 84101,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(value => {
            if (value) {
              _this.$emit('queryForm', val)
            }
          })
        }
      },
      {
        label: '重置',
        btnType: 'primary',
        btnShow: 84102,
        onClick: (_, val, _this) => {
          _this.$refs.myForm.resetFields()
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '导出',
        onClick: (val, _, _this) => {
          _this.$emit('download', val)
        }
      }
    ]
  }
]

const rules = {
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
}

export const formData = {
  initData: initData(renderFrom),
  maxRow: 4,
  maxCol: 3,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: cloneDeep(renderFrom),
  rules
}
export const list = [
  {
    label: '操作时间',
    prop: 'operateTime',
    align: 'center',
    width: 150
  },
  {
    label: '用户名',
    prop: 'userName',
    align: 'center'
  },
  {
    label: '登录账号',
    prop: 'loginName',
    align: 'center'
  },
  {
    label: '登录IP',
    prop: 'ip',
    align: 'center'
  },
  {
    label: '角色',
    prop: 'roleName',
    align: 'center'
  },
  {
    label: '操作模块',
    prop: 'operatingModule',
    align: 'center'
  },
  {
    label: '操作事件',
    prop: 'operatingEvent',
    align: 'center'
  },
  {
    label: '详细信息',
    prop: 'information',
    align: 'center',
    render: (h, { record, $index }) => {
      return suspension(h, record.information)
    }
  },
  {
    label: '状态',
    prop: 'state',
    align: 'center',
    render: (h, { record, $index }) => {
      if (record.state === '成功') {
        return <div style={{ color: 'rgb(61, 191, 100)' }}>{record.state}</div>
      } else {
        return <div>{record.state}</div>
      }
    }
  }
]
