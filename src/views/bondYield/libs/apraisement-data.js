import { initData, dateConfig, pickerOptions } from '@/src/utils/util'
import { globalDictMap } from '@utils/dict'

const renderForm = [
  {
    label: '起始日期',
    key: 'beginDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期',
    key: 'endDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '估值类型',
    key: 'valuatTypeList',
    type: 'Select',
    options: globalDictMap('1014'),
    rowId: 1,
    filterable: true,
    clearable: true,
    multiple: true,
    initValue: [globalDictMap('1014')[0].code]
  },
  {
    label: '收益率或利差',
    key: 'rateOrInterMargin',
    type: 'Select',
    options: globalDictMap('1007'),
    rowId: 1,
    initValue: globalDictMap('1007')[0].code
  },
  {
    label: '无风险收益率',
    key: 'risklessRate',
    type: 'Select',
    options: globalDictMap('1008'),
    rowId: 2,
    initValue: globalDictMap('1008')[0].code
  },
  {
    label: '列表展示日期顺序',
    key: 'bizDateOrder',
    type: 'Select',
    options: globalDictMap('1012'),
    rowId: 2,
    initValue: globalDictMap('1012')[1].code
  },
  {
    label: '数据频率:',
    key: 'dataFrequence',
    type: 'Slot',
    slotName: 'dataFrequence',
    options: globalDictMap('1009') || [],
    initValue: '1',
    rowId: 3
  },
  {
    label: '是否使用不完整周期:',
    key: 'useIncompleteCycle',
    type: 'Slot',
    initValue: '1',
    slotName: 'useIncompleteCycle',
    options: globalDictMap('1011') || [],
    rowId: 3
  },
  {
    label: '统计方式:',
    key: 'calType',
    type: 'Slot',
    initValue: '1',
    slotName: 'calType',
    span: 12,
    options: globalDictMap('1010') || [],
    rowId: 3
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnShow: 32002,
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
        btnShow: 32001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderForm)
          _this.$emit('resetForm')
        }
      }
    ]
  }
]
const rules = {
  beginDate: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择开始日期'
    }
  ],
  endDate: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择结束日期'
    }
  ],
  remainPeriodList: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择剩余期限'
    }
  ],
  calType: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择统计方式'
    }
  ],
  valuatTypeList: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择估值类型'
    }
  ],
  dataFrequence: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择数据频率'
    }
  ],
  risklessRate: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择无风险收益率'
    }
  ]
}

const butData = [
  {
    label: '竖向导出',
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('colExport', val)
    }
  },
  {
    label: '横向导出',
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('rowExport', val)
    }
  }
]

export const formData = {
  initData: initData(renderForm),
  rules,
  maxRow: 4,
  maxCol: 4,
  isFoldRow: true,
  Folding: false,
  renderFrom: renderForm,
  showButt: true, // 按钮列表状态
  butData: butData // 按钮列表
}

const virtualBondRenderForm = [
  {
    label: '起始日期',
    key: 'beginDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期',
    key: 'endDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },

  {
    label: '剩余期限',
    key: 'remainPeriodList',
    type: 'Select',
    options: globalDictMap('1004'),
    rowId: 1,
    initValue: [globalDictMap('1004')[0].code],
    filterable: true,
    clearable: true,
    multiple: true
  },
  {
    label: '列表展示日期顺序',
    key: 'bizDateOrder',
    type: 'Select',
    options: globalDictMap('1012'),
    rowId: 1,
    initValue: globalDictMap('1012')[1].code
  },
  {
    label: '数据频率:',
    key: 'dataFrequence',
    type: 'Slot',
    slotName: 'dataFrequence',
    options: globalDictMap('1009') || [],
    initValue: '1',
    rowId: 2
  },
  {
    label: '是否使用不完整周期:',
    key: 'useIncompleteCycle',
    type: 'Slot',
    initValue: '1',
    slotName: 'useIncompleteCycle',
    options: globalDictMap('1011') || [],
    rowId: 2
  },
  {
    label: '统计方式:',
    key: 'calType',
    type: 'Slot',
    initValue: '1',
    slotName: 'calType',
    span: 12,
    options: globalDictMap('1010') || [],
    rowId: 2
  },
  {
    type: 'Buttons',
    rowId: 3,
    children: [
      {
        label: '查询',
        btnShow: 32006,
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
        btnShow: 32005,
        onClick: (_, val, _this) => {
          val.initData = initData(virtualBondRenderForm)
          _this.$emit('resetForm')
        }
      }
    ]
  }
]

export const virtualBondFormData = {
  initData: initData(virtualBondRenderForm),
  rules,
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: virtualBondRenderForm,
  showButt: true, // 按钮列表状态
  butData: butData // 按钮列表
}
