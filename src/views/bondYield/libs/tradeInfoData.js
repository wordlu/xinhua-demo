import { initData, dateConfig, pickerOptions } from '@utils/util'
import { globalDictMap } from '@utils/dict'
// label --- 名称
// key   --- 双向绑定
// type  --- 类型 DatePicker 时间  Select 下拉 Cascader 级联 Input 输入框
// rowId --- 第几行
// options --- 数据
// multiple --- 是否多选
// filterable --- 是否可以输入
// clearable --- 是否可以清除
// allRow -- form-item是否占一整行
// reserveKeyword -- select是否是否保留搜索关键词
// optionsHasSelectAll -- select是否有全选项
// checked -- select有全选功能时 对应的是否全选标识
// filterMethod -- select是否使用自定义搜索，select有全选时建议使用
const renderFrom = [
  {
    label: '起始日期：',
    key: 'beginDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    rowId: 1,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期：',
    key: 'endDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '交易市场：',
    key: 'tradeMktList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1034'),
    filterMethod: true,
    rowId: 1,
    initValue: [
      globalDictMap('1034')[0].code,
      globalDictMap('1034')[1].code,
      globalDictMap('1034')[2].code,
      globalDictMap('1034')[3].code
    ]
  },
  {
    label: '汇总或逐笔：',
    key: 'calType',
    type: 'Select',
    filterable: true,
    clearable: true,
    options: globalDictMap('1006'),
    filterMethod: true,
    rowId: 1,
    initValue: globalDictMap('1006')[0].code
  },
  {
    label: '收益率或利差：',
    key: 'rateOrInterMargin',
    type: 'Select',
    filterable: true,
    clearable: true,
    options: globalDictMap('1007'),
    rowId: 2,
    initValue: globalDictMap('1007')[0].code
  },
  {
    label: '无风险收益率：',
    key: 'risklessRate',
    type: 'Select',
    filterable: true,
    clearable: true,
    options: globalDictMap('1008'),
    rowId: 2,
    initValue: globalDictMap('1008')[0].code
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 31001,
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(value => {
            if (value) {
              _this.$emit('queryForm', val)
            }
          })
        }
      },
      {
        label: '重置',
        btnShow: 31002,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm', val.initData)
        }
      }
    ]
  } // pushCol向右移动
]

const rules = {
  beginDate: [
    {
      required: true,
      message: '请选择开始日期',
      trigger: 'change'
    }
  ],
  endDate: [
    {
      required: true,
      message: '请选择结束日期',
      trigger: 'change'
    }
  ],
  calType: [
    {
      required: true,
      message: '请选择汇总或逐笔',
      trigger: 'change'
    }
  ]
}

const butData = [
  {
    label: '导出',
    btnShow: 31003,
    type: 'primary',
    onClick: (_, _this) => {
      _this.$emit('handleExport')
    }
  }
]

export const columns = [
  {
    label: '序号',
    sortable: true,
    fix: 'left',
    type: 'index',
    width: '60'
  },
  {
    label: '交易ID',
    prop: 'tradeId',
    align: 'center',
    fix: 'left'
  },
  {
    label: '成交日期',
    prop: 'dealDate',
    fix: 'left',
    align: 'center',
    width: 100
  },
  {
    label: '成交时间',
    align: 'center',
    prop: 'dealTime'
  },
  {
    label: '债券代码',
    align: 'center',
    prop: 'bndCode'
  },
  {
    label: '收益率或利差',
    align: 'center',
    prop: 'rateOrInterMargin'
  },
  {
    label: '债券简称',
    align: 'center',
    prop: 'bndAttr'
  },
  {
    label: '债项评级',
    align: 'center',
    prop: 'bndRating'
  },
  {
    label: '含权剩余期限',
    align: 'center',
    prop: 'cumrigRemainPeriod'
  },
  {
    label: '含权剩余期限说明',
    align: 'center',
    prop: 'cumrigRemainPeriodExplain'
  },
  {
    label: '剩余期限（年）',
    prop: 'remainPeriod'
  },
  {
    label: '发行期限（年）',
    align: 'center',
    prop: 'issuePeriod'
  },
  {
    label: '含权期限说明',
    align: 'center',
    prop: 'cumrigPeriodExplain'
  },
  {
    label: '成交收益率(%)',
    prop: 'dealRate',
    align: 'center',
    rateOrInterMargin: '1'
  },
  {
    label: '行权收益率(%)',
    prop: 'dealRateXq',
    align: 'center',
    rateOrInterMargin: '1'
  },
  {
    label: '到期收益率(%)',
    prop: 'dealRateDq',
    align: 'center',
    rateOrInterMargin: '1'
  },
  {
    label: '成交收益率利差（BP）',
    prop: 'dealInterMargin',
    align: 'center',
    rateOrInterMargin: '2'
  },
  {
    label: '成交量(十手)',
    align: 'center',
    prop: 'dealVolume'
  },
  {
    label: '成交金额(万元)',
    align: 'center',
    prop: 'dealAmount'
  },
  {
    label: '中债估值收益率(%)',
    align: 'center',
    prop: 'cbicValuatRate',
    rateOrInterMargin: '1'
  },
  {
    label: '中债估值利差(BP)',
    align: 'center',
    prop: 'cbicValuatInterMargin',
    rateOrInterMargin: '2'
  },
  {
    label: '中证估值收益率(%)',
    align: 'center',
    prop: 'csiValuatRate',
    rateOrInterMargin: '1'
  },
  {
    label: '中证估值利差(BP)',
    align: 'center',
    prop: 'csiValuatInterMargin',
    rateOrInterMargin: '2'
  },
  {
    label: '内部估值收益率(%)',
    align: 'center',
    prop: 'innerValuatRate',
    rateOrInterMargin: '1'
  },
  {
    label: '内部估值利差(BP)',
    align: 'center',
    prop: 'innerValuatInterMargin',
    rateOrInterMargin: '2'
  },
  {
    label: '债券交易市场',
    align: 'center',
    prop: 'bndTradeMkt'
  },
  {
    label: '同剩余期限中债国开到期收益率',
    align: 'center',
    prop: 'expireRate'
  },
  {
    label: '成交类型',
    align: 'center',
    prop: 'dealType'
  },
  {
    label: '发行规模（亿元）',
    align: 'center',
    prop: 'issueScale'
  },
  {
    label: '发行利率(%)',
    align: 'center',
    prop: 'issueInterRate'
  },
  {
    label: '主体名称',
    fix: 'right',
    prop: 'orgName'
  },
  {
    label: '主体最终级别',
    fix: 'right',
    prop: 'finalOrgLevel'
  },
  {
    label: '主体最终级别类型',
    fix: 'right',
    prop: 'finalOrgLevelType'
  }
]

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 3, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom,
  showButt: true, // 按钮列表状态
  butData: butData
}
