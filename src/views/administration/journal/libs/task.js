import { initData, dateConfig, pickerOptions } from '@utils/util'
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
    label: '任务名称:',
    key: 'taskIds',
    type: 'Select',
    options: [],
    rowId: 1,
    clearable: true,
    multiple: true,
    filterable: true
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnShow: 84201,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      },
      {
        label: '重置',
        btnType: 'primary',
        btnShow: 84202,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 2,
  maxCol: 3,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom
}
export const list = [
  {
    label: '任务Id',
    prop: 'taskId',
    align: 'center'
  },
  {
    label: '任务名称',
    prop: 'taskName',
    align: 'center'
  },
  {
    label: '任务类型',
    prop: 'taskType',
    align: 'center'
  },
  {
    label: '执行状态',
    prop: 'executeStatus',
    align: 'center'
  },
  {
    label: '是否报错',
    prop: 'errorFlag',
    align: 'center'
  },
  {
    label: '报错原因',
    prop: 'errorInfo',
    align: 'center'
  },
  {
    label: '执行开始时间',
    prop: 'startTime',
    align: 'center'
  },
  {
    label: '执行结束时间',
    prop: 'endTime',
    align: 'center'
  },
  {
    label: '执行时长',
    prop: 'executeTime',
    align: 'center'
  },
  {
    label: '业务开始时间',
    prop: 'taskStartTime',
    align: 'center'
  },
  {
    label: '业务结束时间',
    prop: 'taskEndTime',
    align: 'center'
  }
]
