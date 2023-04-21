import { initData, dateConfig, pickerOptions, renderColumnsIndustry } from '@utils/util'
import { globalDictMap } from '@utils/dict'

// label --- 名称
// key   --- 双向绑定
// type  --- 类型 DatePicker 时间  Select 下拉 Cascader 级联 Input 输入框
// rowId --- 第几行
// options --- 数据
// multiple --- 是否多选
// filterable --- 是否可以输入
// clearable --- 是否可以清除

const renderFrom = [
  {
    label: '起始日期',
    key: 'startDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期',
    key: 'endDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '估值问题情况',
    key: 'valuatSituationTpList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('1031'),
    rowId: 1
  },
  {
    label: '出现估值问题原因',
    key: 'valuatReasonTpList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('1032'),
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '重置',
        btnShow: 45001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm', val.initData)
        }
      },
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 45002,
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      },
      {
        label: '导出',
        btnShow: 45003,
        onClick: (val, _, _this) => {
          _this.$emit('download')
        }
      }
    ]
  } // pushCol向右移动
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom
}

export const columns = [
  {
    label: '序号',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    align: 'center',
    width: 80
  },
  {
    label: '日期',
    prop: 'valuatDt',
    align: 'center',
    width: 90
  },
  {
    label: '债券代码',
    prop: 'bndCd',
    align: 'center'
  },
  {
    label: '债券名称',
    prop: 'bndFullNm',
    align: 'center'
  },
  {
    label: '主体名称',
    prop: 'orgName',
    align: 'center'
  },
  {
    label: '主体类型',
    prop: 'orgTp',
    align: 'center'
  },
  {
    label: '新华GICS行业',
    prop: 'gicsInd',
    align: 'center',
    render: (h, { record }) => renderColumnsIndustry(h, record.gicsInd)
  },
  {
    label: '债项评级',
    prop: 'bndLevel',
    align: 'center'
  },
  {
    label: '主体最终评级',
    prop: 'objFinalLevel',
    align: 'center'
  },
  {
    label: '（含权）剩余期限',
    prop: 'remainPeriod',
    align: 'center'
  },
  {
    label: '估值问题情况',
    prop: 'valuatSituationTp',
    align: 'center'
  },
  {
    label: '出现估值问题原因',
    prop: 'valuatReasonTp',
    align: 'center'
  }
]
