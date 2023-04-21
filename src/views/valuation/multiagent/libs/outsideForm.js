import { initData, dateConfig, pickerOptions } from '@utils/util'
import { globalDictMap } from '@utils/dict'

const renderFrom = [
  {
    label: '分析日期',
    key: 'bizDt',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '按主体汇总方式',
    key: 'sumTpList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('2311') || [],
    rowId: 1
  },
  {
    label: '图形展示内容',
    key: 'viewTp',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('2312') || [],
    initValue: '2',
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 73101,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 73102,
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(valid => {
            if (valid) {
              _this.$emit('queryForm', val)
            }
          })
        }
      }
    ]
  }
]

const termRules = {
  bizDt: [{ required: true, message: '请选择', trigger: 'blur' }],
  sumTpList: [{ required: true, message: '请选择', trigger: 'blur' }]
}

const butData = [
  {
    label: '导出数据',
    type: 'primary',
    btnShow: 73104,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  },
  {
    label: '导出图形',
    type: 'primary',
    btnShow: 73103,
    onClick: (val, _this) => {
      _this.$emit('exportEchart', val)
    }
  }
]

export const tabData = [
  {
    label: '图形',
    name: 'Echarts'
  },
  {
    label: '曲线数据',
    name: 'CurveData'
  },
  {
    label: '曲线参数',
    name: 'CurveParams'
  }
]

export const tabDataTrend = [
  {
    label: '图形',
    name: 'Echarts'
  },
  {
    label: '数据',
    name: 'Scatter'
  }
]

export const columnsCurveParams = [
  {
    label: '曲线名称',
    prop: 'curveName',
    align: 'center'
  },
  {
    label: '分段数',
    prop: 'sectionCount',
    align: 'center'
  },
  {
    label: '剩余期限起始值',
    prop: 'periodStartVal',
    align: 'center'
  },
  {
    label: '剩余期限结束值',
    prop: 'periodEndVal',
    align: 'center'
  },
  {
    label: '分段序号',
    prop: 'sectionOrder',
    align: 'center'
  },
  {
    label: '分段3次系数',
    prop: 'sectionThrCoef',
    align: 'center'
  },
  {
    label: '分段2次系数',
    prop: 'sectionTwoCoef',
    align: 'center'
  },
  {
    label: '分段1次系数',
    prop: 'sectionOneCoef',
    align: 'center'
  },
  {
    label: '常数项',
    prop: 'constant',
    align: 'center'
  }
]

export const columnsData = [
  {
    label: '主体名称',
    prop: '',
    align: 'center'
  }
]

export const outFormData = {
  initData: initData(renderFrom),
  rules: termRules,
  maxRow: 1, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom
}

const renderTrendFrom = [
  {
    label: '剩余期限',
    key: 'periodCode',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1004') || [],
    rowId: 1
  },
  {
    label: '按主体汇总方式',
    key: 'sumTpList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('2311') || [],
    rowId: 1
  },
  {
    label: '收益率或利差',
    key: 'rateOrInterMargin',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1007') || [],
    initValue: '1',
    rowId: 1
  },
  {
    label: '无风险收益率类型:',
    key: 'risklessRate',
    type: 'Slot',
    slotName: 'risklessRate',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1008') || [],
    initValue: globalDictMap('1008')[0].code,
    rowId: 1
  },
  {
    label: '图形展示内容',
    key: 'viewTp',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('2312') || [],
    initValue: '2',
    rowId: 2
  },
  {
    label: '开始日期',
    key: 'startDt',
    type: 'DatePicker',
    initValue: dateConfig().beginDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 2
  },
  {
    label: '结束日期',
    key: 'endDt',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 2
  },
  {
    label: '数据频率',
    key: 'dataFrequence',
    type: 'Slot',
    slotName: 'dataFrequence',
    options: globalDictMap('1009') || [],
    initValue: '1',
    rowId: 3
  },
  {
    label: '是否使用不完整周期',
    key: 'useIncompleteCycle',
    type: 'Slot',
    initValue: '1',
    slotName: 'useIncompleteCycle',
    options: globalDictMap('1011') || [],
    rowId: 3
  },
  {
    label: '统计方式',
    key: 'statisMode',
    type: 'Slot',
    initValue: '1',
    slotName: 'statisMode',
    options: globalDictMap('1010') || [],
    span: 12,
    rowId: 3
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 73201,
        onClick: (_, val, _this) => {
          val.initData = initData(renderTrendFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 73202,
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(valid => {
            if (valid) {
              _this.$emit('queryForm', val)
            }
          })
        }
      }
    ]
  }
]

const trendRules = {
  periodCode: [{ required: true, message: '请选择', trigger: 'change' }], // 剩余期限
  sumTpList: [{ required: true, message: '请选择', trigger: 'blur' }], // 按主体汇总方式
  rateOrInterMargin: [{ required: true, message: '请选择', trigger: 'change' }] // 收益率或利差
}

export const outTrendFormData = {
  initData: initData(renderTrendFrom),
  rules: trendRules,
  maxRow: 3, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom: renderTrendFrom
}
