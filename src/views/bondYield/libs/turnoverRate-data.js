import { initData, dateConfig, pickerOptions } from '@/src/utils/util'
import { globalDictMap } from '@utils/dict'

const renderForm = [
  {
    label: '起始日期:',
    key: 'beginDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().beginDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期:',
    key: 'endDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '列表展示日期顺序:',
    key: 'bizDateOrder',
    type: 'Slot',
    slotName: 'bizDateOrder',
    options: globalDictMap('1012') || [],
    initValue: globalDictMap('1012')[1].code,
    rowId: 1
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
        btnShow: 33102,
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
        btnShow: 33101,
        onClick: (_, val, _this) => {
          val.initData = initData(renderForm)
          _this.$emit('resetForm')
        }
      }
    ]
  }
]

const butData = [
  {
    label: '竖向导出',
    type: 'primary',
    btnShow: 84204,
    onClick: (val, _this) => {
      _this.$emit('rowExport', val)
    }
  },
  {
    label: '横向导出',
    type: 'primary',
    btnShow: 84203,
    onClick: (val, _this) => {
      _this.$emit('colExport', val)
    }
  },
  {
    label: '导出图形',
    btnShow: 33103,
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('handleExportImg', val)
    }
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
  curveList: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur'
    }
  ]
}

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

const searchRenderForm = [
  {
    label: '起始日期',
    key: 'beginDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().beginDate,
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
    label: '曲线名称',
    key: 'curveList',
    type: 'Select',
    options: globalDictMap('1008'),
    rowId: 1,
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
    label: '期限类型:',
    key: 'periodType',
    type: 'Slot',
    slotName: 'periodType',
    options: globalDictMap('1009') || [],
    initValue: '1',
    rowId: 2,
    span: 24,
    dataStepList: globalDictMap('1020'),
    criticalPeriodList: globalDictMap('1013')
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
        btnShow: 33105,
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
        btnShow: 33104,
        onClick: (_, val, _this) => {
          val.initData = initData(searchRenderForm)
          _this.$emit('resetForm')
        }
      }
    ]
  }
]

const dataBut = [
  {
    label: '竖向导出',
    type: 'primary',
    btnShow: 33107,
    onClick: (val, _this) => {
      _this.$emit('rowExport', val)
    }
  },
  {
    label: '横向导出',
    type: 'primary',
    btnShow: 33106,
    onClick: (val, _this) => {
      _this.$emit('colExport', val)
    }
  }
]

export const searchFormData = {
  initData: initData(searchRenderForm),
  rules,
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: searchRenderForm,
  showButt: true, // 按钮列表状态
  butData: dataBut // 按钮列表
}

export const chartOption = {
  boundaryGap: true,
  xAxisType: 'category',
  xAxisSplitLineShow: true,
  xAxisSplitLineShowlineStyle: '#fff',
  xAxisAxisLineShow: true,
  xAxisAxisLineShowlineStyle: '#000',
  xAxisAxisLabelColor: '#000',
  yAxisType: 'value',
  yAxisSplitLineShow: true,
  yAxisSplitLineShowlineStyle: '#fff',
  yAxisAxisLineShow: true,
  yAxisAxisLineShowlineStyle: '#000',
  yAxisAxisLabelColor: '#000',
  legendShow: true,
  legendShowType: 'scroll',
  seriesType: 'line',
  seriesSmooth: true,
  bottomGrid: '15%',
  leftGrid: '10%',
  rightGrid: '15%',
  legendShowBottom: '8%',
  topGrid: '10%',
  xAxisName: '日期',
  yAxisName: '收益率/%'
}
