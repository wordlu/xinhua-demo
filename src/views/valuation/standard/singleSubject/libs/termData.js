import { initData, pickerOptions, dateConfig } from '@utils/util'

const isOriginalData = [
  {
    code: '1',
    name: '原始',
    defaultCode: '1'
  },
  {
    code: '0',
    name: '跨时间投射后',
    defaultCode: '1'
  }
]

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
    label: '分析日期:',
    key: 'bizDt',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '散点数据:',
    key: 'isOriginalData',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: isOriginalData,
    initValue: '0',
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
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 71201,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 71202,
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
    btnShow: 84221,
    onClick: (val, _this) => {
      _this.$emit('exportCheckData', val)
    }
  },
  {
    label: '导出数据',
    type: 'primary',
    btnShow: 71204,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  },
  {
    label: '导出图形',
    type: 'primary',
    btnShow: 71203,
    onClick: (val, _this) => {
      _this.$emit('exportEchart', val)
    }
  }
]

const rules = {
  orgCd: [{ required: true, message: '请选择', trigger: 'change' }],
  bizDt: [{ required: true, message: '请选择', trigger: 'blur' }],
  isOriginalData: [{ required: true, message: '请选择', trigger: 'change' }]
}

export const tabData = [
  {
    label: '图形',
    name: 'Echarts'
  },
  {
    label: '散点数据',
    name: 'Scatter'
  },
  {
    label: '曲线数据',
    name: 'Curve'
  },
  {
    label: '曲线参数数据',
    name: 'CurveParam'
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
        width: '100px',
        align: 'center'
      },
      {
        label: '(含权)剩余期限(年)',
        prop: 'remainPeriodCal',
        width: '130px',
        align: 'center'
      },
      {
        label: '成交类型',
        prop: 'exchType',
        align: 'center'
      },
      {
        label: '平移至分析日期的收益率(%)',
        prop: 'yieldAfterTranslation',
        align: 'center',
        width: '120px'
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
        align: 'center',
        width: '120px'
      },
      {
        label: '成交金额(万元)',
        prop: 'txAmt',
        align: 'center'
      },
      {
        label: '投射至3年期的收益率(%)',
        prop: 'aftThrYield',
        align: 'center',
        width: '120px'
      },
      {
        label: '在曲线簇中的位置',
        prop: 'curveLocation',
        align: 'center'
      },
      {
        label: '综合位置参数',
        prop: 'aftThrParam',
        align: 'center'
      }
    ]
  }
]

export const columnsCurve = [
  {
    label: '曲线名称',
    prop: 'curveName',
    align: 'center',
    fixed: 'left'
  },
  {
    label: '剩余期限(年)',
    prop: 'remainPeriodCal',
    align: 'center'
  },
  {
    label: '收益率(%)',
    prop: 'txYield',
    align: 'center'
  }
]

export const columnsCurveParam = [
  {
    label: '曲线名称',
    prop: 'curveName',
    align: 'center',
    fix: 'left',
    width: '120px'
  },
  {
    label: '分段数',
    prop: 'sectionCount',
    align: 'center'
  },
  {
    label: '剩余期限起始值',
    prop: 'periodStartVal',
    align: 'center',
    width: '120px'
  },
  {
    label: '剩余期限结束值',
    prop: 'periodEndVal',
    align: 'center',
    width: '120px'
  },
  {
    label: '分段序号',
    prop: 'sectionOrder',
    align: 'center'
  },
  {
    label: '分段3次系数',
    prop: 'sectionThrCoef',
    align: 'center',
    width: '120px'
  },
  {
    label: '分段2次系数',
    prop: 'sectionTwoCoef',
    align: 'center',
    width: '120px'
  },
  {
    label: '分段1次系数',
    prop: 'sectionOneCoef',
    align: 'center',
    width: '120px'
  },
  {
    label: '常数项',
    prop: 'constant',
    align: 'center'
  }
]

export const columnsSideTwo = [
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
    label: '(含权)剩余期限(年)',
    prop: 'remainPeriodCal',
    align: 'center'
  },
  {
    label: '估值收益率(%)',
    prop: 'innerValuat',
    align: 'center'
  }
]

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom
}
