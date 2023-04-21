import { initData, pickerOptions } from '@utils/util'
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
    label: '主体名称',
    key: 'objName',
    type: 'newPageSelect',
    filterable: true,
    clearable: true,
    multiple: true,
    options: [],
    remote: true,
    reserveKeyword: true,
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 0
    },
    rowId: 1
  },
  {
    label: '主体类型',
    key: 'objType',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('2020'),
    optionsHasSelectAll: true,
    filterMethod: true,
    checked: false,
    rowId: 1
  },
  {
    label: '主体所属分析师',
    key: 'objBelongAnalyst',
    type: 'Select',
    reserveKeyword: true,
    filterable: true,
    clearable: true,
    multiple: true,
    optionsHasSelectAll: true,
    filterMethod: true,
    checked: false,
    rowId: 1
  },
  {
    label: '新华GICS行业',
    key: 'objGICSIndustryNew',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    options: [],
    rowId: 2
  },
  {
    label: '新华内部行业',
    key: 'objInnerIndustryNew',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    options: [],
    rowId: 2
  },
  {
    label: '申万行业',
    key: 'objSWIndustryNew',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    options: [],
    rowId: 2
  },
  {
    label: '主体级别类型',
    key: 'objLevelType',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1002').filter(i => i.code !== 'ZZ'),
    rowId: 3
  },
  {
    label: '主体级别',
    key: 'objLevel',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('2010'),
    optionsHasSelectAll: true,
    checked: false,
    reserveKeyword: true,
    filterMethod: true,
    rowId: 3
  },
  {
    label: '评级状态',
    key: 'levelStatus',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    optionsHasSelectAll: true,
    filterMethod: true,
    checked: false,
    rowId: 3
  },
  {
    label: '是否当前最终级别',
    key: 'currentFinalLevel',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1011'),
    rowId: 3
  },
  {
    label: '生效起始日期',
    key: 'effectiveStartDt',
    type: 'DatePicker',
    rowId: 4,
    options: {
      disabledDate: time => {
        return pickerOptions(time)
      }
    }
  },
  {
    label: '生效结束日期',
    key: 'effectiveEndDt',
    type: 'DatePicker',
    options: {
      disabledDate: time => {
        return pickerOptions(time)
      }
    },
    rowId: 4
  },
  {
    label: '失效起始日期',
    key: 'expireStartDt',
    type: 'DatePicker',
    rowId: 4
  },
  {
    label: '失效结束日期',
    key: 'expireEndDt',
    type: 'DatePicker',
    rowId: 4
  },
  {
    type: 'Buttons',
    rowId: 5,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 61007,
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      },
      {
        label: '重置',
        btnShow: 61006,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm', val.initData)
        }
      }
    ]
  } // pushCol向右移动
]
const butData = [
  {
    label: '导出',
    type: 'primary',
    btnShow: 61010,
    onClick: (_, _this) => {
      _this.$emit('download')
    }
  },
  {
    label: '新增快速评级',
    type: 'primary',
    btnShow: 61009,
    onClick: (val, _this) => {
      _this.$emit('handleFast', val)
    }
  },
  {
    label: '导入待查询主体列表',
    btnShow: 61008,
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('handleImport', val)
    }
  }
]
export const formData = {
  initData: initData(renderFrom),
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom,
  showButt: true, // 按钮列表状态
  butData: butData // 按钮列表
}
