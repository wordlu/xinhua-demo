import { initData } from '@utils/util'
import { globalDictMap } from '@utils/dict'

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
  },
  {
    label: '曲线参数信息表',
    name: '4'
  }
]

const renderFrom = [
  {
    label: '收益率或利差:',
    key: 'rateOrInterMargin',
    type: 'Select',
    options: globalDictMap('1007'),
    initValue: globalDictMap('1007')[0].code,
    rowId: 1
  },
  {
    label: '无风险利率:',
    key: 'risklessInterRates',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1008'),
    initValue: [globalDictMap('1008')[0].code],
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 1,
    children: [
      {
        label: '重置',
        btnShow: 52001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnShow: 52002,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      }
    ]
  }
]

const butData = [
  {
    label: '注意：页面中利差的计算是使用所选曲线同日期的无风险收益率曲线数据进行的差值计算',
    type: 'admonish'
  },
  {
    label: '导出数据',
    type: '',
    btnShow: 52003,
    onClick: (val, _this) => {
      _this.$emit('exportData')
    }
  },
  {
    label: '导出图形',
    type: '',
    btnShow: 52004,
    onClick: (val, _this) => {
      _this.$emit('diagram')
    }
  }
]

export const formData = {
  initData: initData(renderFrom),
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
    name: '(含权)剩余期限',
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
    name: '分段数',
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
