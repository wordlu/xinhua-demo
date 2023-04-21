import { initData, pickerOptions } from '@utils/util'
import * as service from '@api/valuation/standard.js'
import moment from 'moment'

const renderFrom = [
  {
    label: '债券简称:',
    key: 'windCd',
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
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '结束日期:',
    key: 'endDt',
    type: 'DatePicker',
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 71105,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnShow: 71106,
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
function initForm(renderFrom) {
  service.getBeginExchDate(1).then(res => {
    if (res && res.status === 200) {
      renderFrom[2].initValue = moment(res.data).format('YYYYMMDD')
    }
  })
  service.getBeginExchDate(20).then(res => {
    if (res && res.status === 200) {
      renderFrom[1].initValue = moment(res.data).format('YYYYMMDD')
    }
  })
  return renderFrom
}

const rules = {
  windCd: [{ required: true, message: '请选择', trigger: 'change' }],
  startDt: [{ required: true, message: '请选择', trigger: 'blur' }],
  endDt: [{ required: true, message: '请选择', trigger: 'blur' }]
}

const butData = [
  {
    label: '导出数据',
    type: 'primary',
    btnShow: 71108,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  },
  {
    label: '导出图形',
    type: 'primary',
    btnShow: 71107,
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
    children: [
      {
        label: '序号',
        fix: 'left',
        type: 'index',
        align: 'center',
        width: '60'
      },
      {
        label: '日期',
        prop: 'valuatDt',
        align: 'center'
      },
      {
        label: '(含权)剩余期限(年)',
        prop: 'remainPeriodCal',
        align: 'center',
        minWidth: '120px'
      },
      {
        label: '债券标准估值(%)',
        prop: 'innerValuat',
        align: 'center'
      }
    ]
  }
]

export const columnsScatter = [
  {
    label: '',
    align: 'center',
    children: [
      {
        label: '序号',
        fix: 'left',
        type: 'index',
        align: 'center',
        width: '60'
      },
      {
        label: '(含权)剩余期限(年)',
        prop: 'remainPeriodCal',
        align: 'center',
        minWidth: '120px'
      },
      {
        label: '日期',
        prop: 'txTd',
        align: 'center'
      },
      {
        label: '成交类型',
        prop: 'exchType',
        align: 'center'
      },
      {
        label: '市场',
        prop: 'exch',
        align: 'center'
      },
      {
        label: '收益率(%)',
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
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 1, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom: initForm(renderFrom)
}
