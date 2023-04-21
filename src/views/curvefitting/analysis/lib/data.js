import { initData, dateConfig, pickerOptions } from '@utils/util'
import { globalDictMap } from '@utils/dict'

export const tabList = [
  {
    label: '图像',
    name: '1'
  },
  {
    label: '数据',
    name: '2'
  }
]

export const renderFrom = [
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
    label: '数据频率:',
    key: 'dataFrequency',
    type: 'Slot',
    slotName: 'items',
    allRow: false,
    initValue: globalDictMap('1009')[0].code,
    rowId: 2
  },
  {
    label: '是否使用不完整周期:',
    key: 'incompleteCycle',
    type: 'Slot',
    slotName: 'flow',
    allRow: false,
    initValue: '1',
    rowId: 2
  },
  {
    label: '统计方式:',
    key: 'statisMode',
    type: 'Slot',
    slotName: 'rose',
    allRow: false,
    initValue: '1',
    span: 12,
    rowId: 2
  },
  {
    type: 'Buttons',
    rowId: 1,
    children: [
      {
        label: '重置',
        btnShow: 53001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 53002,
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
    label: '注意：页面中利差的计算是使用所选曲线每日同剩余期限的无风险收益率数据进行的差值计算',
    type: 'admonish'
  },
  {
    label: '导出数据',
    type: '',
    btnShow: 53003,
    onClick: (val, _this) => {
      _this.$emit('exportData')
    }
  },
  {
    label: '导出图形',
    type: '',
    btnShow: 53004,
    onClick: (val, _this) => {
      _this.$emit('diagram')
    }
  }
]

const rules = {
  beginDate: [{ required: true, message: '请选择', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择', trigger: 'blur' }],
  rateOrInterMargin: [{ required: true, message: '请选择', trigger: 'change' }]
}

export const formData = {
  initData: initData(renderFrom),
  rules: rules,
  maxRow: 2, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom: renderFrom
}

export const morphologyColumns = [
  {
    name: '',
    prop: '',
    children: []
  }
] // 形态表头
