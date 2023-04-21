import { initData, dateConfig, pickerOptions } from '@/src/utils/util'
import { globalDictMap } from '@utils/dict'
// import moment from 'moment'

const renderForm = [
  {
    label: '起始日期',
    key: 'beginDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().beginDate,
    pickerOptions: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期',
    key: 'endDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    pickerOptions: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '交易市场',
    key: 'tradeMktList',
    type: 'Select',
    rowId: 1,
    options: globalDictMap('1005'),
    initValue: [globalDictMap('1005')[0].code],
    multiple: true
  },
  {
    label: '汇总或逐笔',
    key: 'calType',
    type: 'Select',
    rowId: 1,
    options: globalDictMap('1006'),
    initValue: globalDictMap('1006')[0].code
  },
  {
    label: '收益率或利差',
    key: 'rateOrInterMargin',
    type: 'Select',
    rowId: 2,
    options: globalDictMap('1007'),
    initValue: globalDictMap('1007')[0].code
  },
  {
    label: '无风险收益率',
    key: 'risklessRate',
    type: 'Select',
    rowId: 2,
    options: globalDictMap('1008'),
    initValue: globalDictMap('1008')[0].code
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('queryForm', val.initData)
        }
      },
      {
        label: '重置',
        onClick: (_, val, _this) => {
          val.initData = initData(renderForm)
          _this.$emit('resetForm')
        }
      },
      {
        label: '导出',
        onClick: (_, val, _this) => {
          _this.$emit('export', val.initData)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderForm),
  maxRow: 2,
  maxCol: 4,
  isFoldRow: true,
  Folding: false,
  renderFrom: renderForm
}
