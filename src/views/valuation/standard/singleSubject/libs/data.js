import { initData, dateConfig, pickerOptions } from '@utils/util'
import { globalDictMap } from '@utils/dict'

const renderFrom = [
  {
    label: '主体名称:',
    key: 'orgCd',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    remote: true,
    reserveKeyword: true,
    options: [],
    rowId: 1
  },
  {
    label: '开始日期:',
    key: 'startDt',
    type: 'DatePicker',
    initValue: dateConfig().beginDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '结束日期:',
    key: 'endDt',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '曲线簇:',
    key: 'clusterCd',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: [],
    disabled: true,
    rowId: 1
  },
  {
    label: '收益率或利差:',
    key: 'rateOrInterMargin',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1007') || [],
    initValue: '1',
    rowId: 2
  },
  {
    label: '无风险收益率类型:',
    key: 'risklessRate',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1008') || [],
    initValue: globalDictMap('1008')[0].code,
    rowId: 2
  },
  {
    label: '关键剩余期限:',
    key: 'periodCodeList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1004') || [],
    initValue: ['3'],
    rowId: 2
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
    key: 'statisMode',
    type: 'Slot',
    initValue: '1',
    slotName: 'statisMode',
    span: 12,
    options: globalDictMap('1010') || [],
    rowId: 3
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 71205,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 71206,
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

const rules = {
  orgCd: [{ required: true, message: '请选择', trigger: 'change' }],
  rateOrInterMargin: [{ required: true, message: '请选择', trigger: 'change' }],
  periodCodeList: [{ required: true, message: '请选择', trigger: 'blur' }]
}

const butData = [
  {
    label: '导出数据',
    type: 'primary',
    btnShow: 71208,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  },
  {
    label: '导出图形',
    type: 'primary',
    btnShow: 71207,
    onClick: (val, _this) => {
      _this.$emit('exportEchart', val)
    }
  }
]

export const tabData = [
  {
    label: '图像',
    name: 'Echarts'
  },
  {
    label: '折线数据',
    name: 'Line'
  },
  {
    label: '散点数据',
    name: 'Scatter'
  }
]

export const columnsLine = [
  {
    label: '',
    align: 'center',
    children: []
  }
]

export const columnsScatter = [
  {
    label: '债券wind代码',
    prop: 'windCd',
    align: 'center',
    fixed: 'left'
  },
  {
    label: '交易代码',
    prop: 'tradeCd',
    align: 'center'
  },
  {
    label: '成交日期',
    prop: 'valuatDt',
    align: 'center'
  },
  {
    label: '(含权)剩余期限(年)',
    prop: 'remainPeriodCal',
    align: 'center'
  },
  {
    label: '成交收益率(%)',
    prop: 'txYield',
    align: 'center'
  },
  {
    label: '相对位置参数',
    prop: 'aftThrlambda',
    align: 'center'
  },
  {
    label: '综合位置参数',
    prop: 'aftThrParam',
    align: 'center'
  },
  {
    label: '投射到3年期的收益率(%)',
    prop: 'aftThrYield',
    align: 'center'
  }
]

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom
}
