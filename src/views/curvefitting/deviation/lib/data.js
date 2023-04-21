import { initData, dateConfig, pickerOptions } from '@utils/util'

export const tabList = [
  {
    label: '图像',
    name: '1'
  },
  {
    label: '散点图数据',
    name: '2'
  },
  {
    label: '曲线图形态数据',
    name: '3'
  }
] // tab列表

const renderFrom = [
  {
    label: '开始日期:',
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
    type: 'Buttons',
    rowId: 1,
    children: [
      {
        label: '重置',
        btnShow: 54001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 54002,
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
    label:
      '注意：此处将呈现所选曲线的3年期利率走势图及其真实成交样本（不含虚拟成交）投射到3年的散点',
    type: 'admonish'
  },
  {
    label: '导出数据',
    type: '',
    btnShow: 54004,
    onClick: (val, _this) => {
      _this.$emit('exportData')
    }
  },
  {
    label: '导出图形',
    type: '',
    btnShow: 54003,
    onClick: (val, _this) => {
      _this.$emit('diagram')
    }
  }
]

const rules = {
  beginDate: [{ required: true, message: '请选择', trigger: 'blur' }],
  endDate: [{ required: true, message: '请选择', trigger: 'blur' }]
}

export const formData = {
  initData: initData(renderFrom),
  rules: rules,
  maxRow: 1, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom: renderFrom
}

export const scatterColumns = [
  {
    name: '成交日期',
    prop: 'v1',
    align: 'center',
    width: 100
  },
  {
    name: '主体名称',
    prop: 'orgName',
    align: 'center'
  },
  {
    name: '债券简称',
    prop: 'bndAbbrNm',
    align: 'center'
  },
  {
    name: '债券代码',
    prop: 'bndCode',
    align: 'center'
  },
  {
    name: '(含权)剩余期限',
    prop: 'remainPeriod',
    align: 'center'
  },
  {
    name: '交易市场',
    prop: 'txExch',
    align: 'center'
  },
  {
    name: '原始成交收益率(%)',
    prop: 'txTield',
    align: 'center'
  },
  {
    name: '投射后收益率(%)',
    prop: 'aftThrYield',
    align: 'center'
  },
  {
    name: '成交量(万元)',
    prop: 'txQty',
    align: 'center'
  },
  {
    name: '成交金额(万元)',
    prop: 'txAmt',
    align: 'center'
  },
  {
    name: '原始偏离(bp)',
    prop: 'interMarginDev',
    align: 'center'
  },
  {
    name: '投射到3年期后偏离(bp)',
    prop: 'aftThrInter',
    align: 'center'
  },
  {
    name: '是否本曲线异常值',
    prop: 'isCurveError',
    align: 'center'
  },
  {
    name: '是否手动删除',
    prop: 'isManualDelete',
    align: 'center'
  }
] // 散点表头
export const scatterColumnsTw = [
  {
    name: '成交日期',
    prop: 'v1',
    align: 'center',
    width: 100
  },
  {
    name: '主体名称',
    prop: 'orgName',
    align: 'center'
  },
  {
    name: '债券简称',
    prop: 'bndAbbrNm',
    align: 'center'
  },
  {
    name: '债券代码',
    prop: 'bndCode',
    align: 'center'
  },
  {
    name: '(含权)剩余期限',
    prop: 'remainPeriod',
    align: 'center'
  },
  {
    name: '交易市场',
    prop: 'txExch',
    align: 'center'
  },
  {
    name: '原始成交收益率(%)',
    prop: 'txTield',
    align: 'center'
  },
  {
    name: '投射后收益率(%)',
    prop: 'aftThrYield',
    align: 'center'
  },
  {
    name: '成交量(万元)',
    prop: 'txQty',
    align: 'center'
  },
  {
    name: '成交金额(万元)',
    prop: 'txAmt',
    align: 'center'
  },
  {
    name: '原始偏离(bp)',
    prop: 'interMarginDev',
    align: 'center'
  },
  {
    name: '投射到3年期后偏离(bp)',
    prop: 'aftThrInter',
    align: 'center'
  },
  {
    name: '是否本曲线异常值',
    prop: 'isCurveError',
    align: 'center'
  },
  {
    name: '是否手动删除',
    prop: 'isManualDelete',
    align: 'center'
  },
  {
    name: '散点在曲线簇中的位置',
    prop: 'scatterPosition',
    align: 'center'
  }
] // 散点表头

export const morphologyColumn = [
  {
    name: '',
    prop: '',
    children: []
  }
] // 形态表头

export const collectColumn = [
  {
    name: '',
    prop: 'name',
    align: 'center'
  },
  {
    name: '曲线偏离度分析',
    prop: 'value',
    align: 'center'
  }
] // 汇总表头

export const collectData = [
  {
    name: '收益率曲线',
    key: 'curveName',
    value: '',
    align: 'center'
  },
  {
    name: '利差偏离期限',
    key: 'margDeviTerm',
    value: '',
    align: 'center'
  },
  {
    name: '交易数据起始日',
    key: 'tradeBeginDate',
    value: '',
    align: 'center'
  },
  {
    name: '交易数据结束日',
    key: 'tradeEndDate',
    value: '',
    align: 'center'
  },
  {
    name: '偏离最大值',
    key: 'devMax',
    value: '',
    align: 'center'
  },
  {
    name: '偏离75分位',
    key: 'setyfivPct',
    value: '',
    align: 'center'
  },
  {
    name: '偏离中位值',
    key: 'mid',
    value: '',
    align: 'center'
  },
  {
    name: '偏离25分位',
    key: 'twtyfivPct',
    value: '',
    align: 'center'
  },
  {
    name: '偏离最小值',
    key: 'devMin',
    value: '',
    align: 'center'
  },
  {
    name: '日均样本点数量',
    key: 'avgDaySampPoint',
    value: '',
    align: 'center'
  }
] // 汇总数据
