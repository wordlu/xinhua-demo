import { initData, dateConfig, pickerOptions } from '@utils/util'

export const tabList = [
  {
    label: '标准曲线簇试算',
    name: '1'
  },
  {
    label: '自定义曲线试算',
    name: '2'
  }
]
export const activeCutList = [
  {
    label: '散点图数据',
    name: '2'
  },
  {
    label: '曲线图形态数据',
    name: '3'
  },
  {
    label: '曲线参数信息表',
    name: '4'
  }
]

const butData = [
  {
    label: '导出人工校验数据',
    type: '',
    btnShow: 84206,
    onClick: (val, _this) => {
      _this.$emit('manual', '标准曲线')
    }
  },
  {
    label: '触发删除/恢复点功能开关',
    type: 'primary',
    btnShow: 51005,
    onClick: (val, _this) => {
      _this.$emit('ontouch', '标准曲线')
    }
  },
  {
    label: '导出数据',
    type: '',
    btnShow: 51004,
    onClick: (val, _this) => {
      _this.$emit('exportData', '标准曲线')
    }
  },
  {
    label: '导出图形',
    type: '',
    btnShow: 51003,
    onClick: (val, _this) => {
      _this.$emit('diagram', '标准曲线')
    }
  }
]

const butDataTwo = [
  {
    label: '导出人工校验数据',
    type: '',
    btnShow: 84207,
    onClick: (val, _this) => {
      _this.$emit('manual', '自定义曲线')
    }
  },
  {
    label: '触发删除/恢复点功能开关',
    type: 'primary',
    btnShow: 51011,
    onClick: (val, _this) => {
      _this.$emit('ontouch', '自定义曲线')
    }
  },
  {
    label: '保存重算结果',
    type: 'primary',
    btnShow: 51010,
    onClick: (val, _this) => {
      _this.$emit('confirm', '自定义曲线')
    }
  },
  {
    label: '导出数据',
    type: '',
    btnShow: 51009,
    onClick: (val, _this) => {
      _this.$emit('exportData', '自定义曲线')
    }
  },
  {
    label: '导出图形',
    type: '',
    btnShow: 51008,
    onClick: (val, _this) => {
      _this.$emit('diagram', '自定义曲线')
    }
  },
  {
    label: '查询',
    type: '',
    btnShow: 51007,
    onClick: (val, _this) => {
      _this.$emit('inquire')
    }
  }
]

const renderFromOne = [
  {
    label: '日期:',
    key: 'queryDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '曲线簇名称:',
    key: 'clusterCd',
    type: 'Select',
    filterable: true,
    clearable: true,
    options: [],
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 1,
    children: [
      {
        label: '重置',
        btnShow: 51001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFromOne)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 51002,
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

const renderFromTwo = [
  {
    type: 'Buttons',
    rowId: 1,
    children: [
      // {
      //   label: '重置',
      //   onClick: (_, val, _this) => {
      //     val.initData = initData(renderFromTwo)
      //     _this.$emit('resetForm')
      //   }
      // },
      // {
      //   label: '查询',
      //   btnType: 'primary',
      //   onClick: (val, _, _this) => {
      //     _this.$emit('inquire', val)
      //   }
      // }
    ]
  }
]

const rules = {
  queryDate: [{ required: true, message: '请选择', trigger: 'blur' }],
  clusterCd: [{ required: true, message: '请选择', trigger: 'change' }]
}

export const formDataOne = {
  initData: initData(renderFromOne),
  rules: rules,
  maxRow: 1, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom: renderFromOne
}

export const formDataTwo = {
  initData: initData(renderFromTwo),
  maxRow: 1, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butDataTwo, // 按钮列表
  renderFrom: renderFromTwo
}

export const scatterColumns = [
  {
    name: '曲线名称',
    prop: 'curveName',
    align: 'center'
  },
  {
    name: '交易日期',
    prop: 'tradeDt',
    align: 'center',
    width: 100
  },
  {
    name: '交易代码',
    prop: 'tradeCode',
    align: 'center'
  },
  {
    name: '债券简称',
    prop: 'bndAbbrNm',
    align: 'center'
  },
  {
    name: '成交收益率(%)',
    prop: 'txTield',
    align: 'center'
  },
  {
    name: '成交类型',
    prop: 'txType',
    align: 'center'
  },
  {
    name: '（含权）剩余期限',
    prop: 'remainPeriod',
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
] // 散点图表头

export const morphologyColumns = [
  {
    name: '',
    prop: '',
    children: []
  }
] // 形态表头

export const parameterColumns = [
  {
    name: '曲线名称',
    prop: 'curveName',
    align: 'center'
  },
  {
    name: '曲线拟合日期',
    prop: 'fitDt',
    align: 'center',
    width: 100
  },
  {
    name: '分段总数',
    prop: 'sectionCount',
    align: 'center'
  },
  {
    name: '剩余期限起始值',
    prop: 'periodStartVal',
    align: 'center'
  },
  {
    name: '剩余期限结束值',
    prop: 'periodEndVal',
    align: 'center'
  },
  {
    name: '分段序号',
    prop: 'sectionOrder',
    align: 'center'
  },
  {
    name: '分段3次系数',
    prop: 'sectionThrCoef',
    align: 'center'
  },
  {
    name: '分段2次系数',
    prop: 'sectionTwoCoef',
    align: 'center'
  },
  {
    name: '分段1次系数',
    prop: 'sectionOneCoef',
    align: 'center'
  },
  {
    name: '常数项',
    prop: 'constant',
    align: 'center'
  }
] // 曲线图参数
