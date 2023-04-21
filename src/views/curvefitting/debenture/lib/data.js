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
]

const renderFrom = [
  {
    label: '散点剩余期限:',
    key: 'scatterRemainPeriod',
    type: 'Slot',
    slotName: 'items',
    allRow: false,
    initValue: '1',
    rowId: 1
  },
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
        btnShow: 55001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '分析',
        btnShow: 55002,
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
    label:
      '注意：①此处将呈现所选曲线的3年期利率走势图及所选债项真实成交样本（不含虚拟成交）平移到3年的散点②下图仅展示已拟合时间区间内的曲线和散点信息',
    type: 'admonish'
  },
  {
    label: '导出数据',
    type: '',
    btnShow: 55004,
    onClick: (val, _this) => {
      _this.$emit('exportData')
    }
  },
  {
    label: '导出图形',
    type: '',
    btnShow: 55003,
    onClick: (val, _this) => {
      _this.$emit('diagram')
    }
  }
]

const rules = {
  scatterRemainPeriod: [{ required: true, message: '请选择', trigger: 'change' }],
  beginDate: [{ required: true, message: '请选择', trigger: 'blur' }],
  endDate: [{ required: true, message: '请选择', trigger: 'blur' }]
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
    prop: 'windCd',
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
    name: '债券列表',
    key: 'bndDetail',
    value: '',
    align: 'center'
  },
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
