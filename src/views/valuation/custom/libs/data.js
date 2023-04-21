import { initData, pickerOptions, dateConfig } from '@utils/util'
import { globalDictMap } from '@utils/dict'

const renderFrom = [
  { label: '', key: 'custom', type: 'Slot', slotName: 'customForm', span: 24, rowId: 1 },
  {
    label: '分析日期:',
    key: 'bizDt',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 2
  },
  {
    label: '估值曲线名称:',
    key: 'curveId',
    type: 'childrenSelect',
    icon: 'el-icon-search',
    defaultProps: {
      children: 'childrenList',
      label: 'name'
    },
    id: 'code',
    rowId: 2
  },
  {
    label: '是否只用本曲线样本券的成交来估值:',
    key: 'isCurveBnd',
    type: 'Select',
    slotName: 'isCurveBnd',
    initValue: '0',
    span: 8,
    options: globalDictMap('1011'),
    labelWidth: '240px',
    rowId: 2
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 72001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnShow: 72002,
        btnType: 'primary',
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

const butData = [
  {
    label: '',
    type: 'admonish'
  },
  {
    label: '导出校验数据',
    type: 'primary',
    btnShow: 84222,
    onClick: (val, _this) => {
      _this.$emit('exportCheckData', val)
    }
  },
  {
    label: '导出数据',
    type: 'primary',
    btnShow: 72004,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  },
  {
    label: '导出图形',
    btnShow: 72003,
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('exportEchart')
    }
  }
]

export const tabData = [
  {
    label: '图形',
    name: 'Echarts'
  },
  {
    label: '散点图数据',
    name: 'Scatter'
  },
  {
    label: '曲线图数据',
    name: 'Curve'
  },
  {
    label: '曲线图参数',
    name: 'CurveParams'
  }
]

export const columnsScatter = [
  {
    label: '',
    align: 'center',
    children: [
      {
        label: '债券简称',
        prop: 'bndAbbrnm',
        align: 'center'
      },
      {
        label: '债券代码',
        prop: 'windCd',
        align: 'center'
      },
      {
        label: '成交日期',
        prop: 'tradeDt',
        align: 'center'
      },
      {
        label: '(含权)剩余期限(年)',
        prop: 'remainPeriodCal',
        align: 'center'
      },
      {
        label: '成交类型',
        prop: 'exchType',
        align: 'center'
      },
      {
        label: '交易市场',
        prop: 'exch',
        align: 'center'
      },
      {
        label: '成交收益率(%)',
        prop: 'txYield',
        align: 'center'
      },
      {
        label: '成交量(万元或十手)',
        prop: 'txQty',
        align: 'center'
      },
      {
        label: '成交金额(万元)',
        prop: 'txAmt',
        align: 'center'
      },
      {
        label: '原始偏离(BP)',
        prop: 'interMargin',
        align: 'center'
      }
    ]
  }
]

export const columnsCurve = [
  {
    label: '剩余期限',
    prop: 'remainPeriodCal',
    align: 'center'
  },
  {
    label: '所选估值曲线收益率(%)',
    prop: 'txYield',
    align: 'center'
  },
  {
    label: '估值债券本征曲线收益率(%)',
    prop: 'fitYield',
    align: 'center'
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

const rules = {
  bizDt: [{ required: true, message: '请选择', trigger: 'blur' }],
  curveId: [{ required: true, message: '请选择', trigger: 'change' }]
}

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 3, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom
}
