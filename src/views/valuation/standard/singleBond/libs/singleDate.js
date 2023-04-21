import { initData, pickerOptions, dateConfig } from '@utils/util'

const renderFrom = [
  { label: '', key: 'custom', type: 'Slot', slotName: 'customForm', span: 24, rowId: 1 },
  {
    label: '单一日期:',
    key: 'bizDt',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 2
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 71101,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '分析',
        btnType: 'primary',
        btnShow: 71102,
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
  bizDt: [{ required: true, message: '请选择', trigger: 'blur' }]
}

const butData = [
  {
    label: '',
    type: 'admonish'
  },
  {
    label: '导出校验数据',
    type: 'primary',
    btnShow: 84220,
    onClick: (val, _this) => {
      _this.$emit('exportCheckData', val)
    }
  },
  {
    label: '导出数据',
    type: 'primary',
    btnShow: 71104,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  },
  {
    label: '导出图形',
    type: 'primary',
    btnShow: 71103,
    onClick: (val, _this) => {
      _this.$emit('exportEchart', val)
    }
  }
]

export const tabData = [
  {
    label: '汇总数据',
    name: 'Total'
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

export const columnsTotal = [
  {
    label: '汇总',
    prop: 'name',
    align: 'center'
  },
  {
    label: '收益率(%)',
    prop: 'rate',
    align: 'center'
  },
  {
    label: '净价',
    prop: 'netPrc',
    align: 'center'
  },
  {
    label: '全价',
    prop: 'fullPrc',
    align: 'center'
  }
]

export const columnsLine = [
  {
    label: '序号',
    fix: 'left',
    type: 'index',
    align: 'center',
    width: '60'
  },
  {
    label: '日期',
    prop: 'tradeDt',
    align: 'center'
  },
  {
    label: '债项标准估值收益率',
    prop: 'rate',
    align: 'center'
  }
]

export const columnsScatter = [
  {
    label: '序号',
    fix: 'left',
    type: 'index',
    align: 'center',
    width: '60'
  },
  {
    label: '成交日期',
    prop: 'tradeDt',
    align: 'center'
  },
  {
    label: '交易代码',
    prop: 'tradeCode',
    align: 'center'
  },
  {
    label: '债券代码',
    prop: 'windCd',
    align: 'center'
  },
  {
    label: '债券简称',
    prop: 'bndAbbrnm',
    align: 'center'
  },
  {
    label: '(含权)剩余期限(年)',
    prop: 'remainPeriodCal',
    align: 'center'
  },
  {
    label: '成交类型',
    prop: 'exch',
    align: 'center'
  },
  {
    label: '成交收益率(%)',
    prop: 'txYield',
    align: 'center'
  },
  {
    label: '投射后收益率(散点)',
    prop: 'afterThrowRate',
    align: 'center'
  },
  {
    label: '平移后收益率(盒图)',
    prop: 'yieldAfterTranslation',
    align: 'center'
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

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 2, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom
}
