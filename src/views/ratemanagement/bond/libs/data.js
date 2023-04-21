import { initData, pickerOptions, dateConfig } from '@utils/util'
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
    label: '查询日期',
    key: 'queryDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    rowId: 1,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
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
      total: 100
    },
    rowId: 1
  },
  {
    label: '最终主体级别类型',
    key: 'finalObjLevelType',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1002').filter(i => i.code !== 'ZZ'),
    filterMethod: true,
    rowId: 1
  },
  {
    label: '最终主体级别',
    key: 'finalObjLevel',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('2010'),
    optionsHasSelectAll: true,
    filterMethod: true,
    reserveKeyword: true,
    rowId: 1
  },
  {
    label: '主体类型',
    key: 'objType',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    optionsHasSelectAll: true,
    checked: false,
    options: globalDictMap('2020'),
    filterMethod: true,
    rowId: 2
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
    label: '债券简称',
    key: 'bndName',
    type: 'newPageSelect',
    filterable: true,
    clearable: true,
    multiple: true,
    remote: true,
    reserveKeyword: true,
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 100
    },
    rowId: 3
  },
  {
    label: '债券代码',
    key: 'bndCode',
    type: 'Select',
    filterable: true,
    remote: true,
    reserveKeyword: true,
    clearable: true,
    multiple: true,
    rowId: 3
  },
  {
    label: '债券交易市场',
    key: 'bndRradeMarket',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1005'),
    rowId: 3
  },
  {
    label: '主体所属分析师',
    key: 'objBelongAnalyst',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    optionsHasSelectAll: true,
    checked: false,
    filterMethod: true,
    reserveKeyword: true,
    rowId: 3
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 62002,
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
        btnShow: 62001,
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
    btnShow: 62005,
    onClick: (_, _this) => {
      _this.$emit('download')
    }
  },
  {
    label: '导入待查询主体列表',
    type: 'primary',
    btnShow: 62004,
    onClick: (val, _this) => {
      _this.$emit('handleImport', 'objName')
    }
  },
  {
    label: '导入待查询债券列表',
    type: 'primary',
    btnShow: 62003,
    onClick: (val, _this) => {
      _this.$emit('handleBondImport', 'bondName')
    }
  }
]
const rules = {
  queryDate: [{ required: true, message: '请选择', trigger: 'blur' }]
}
export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 3, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom,
  showButt: true, // 按钮列表状态
  butData: butData // 按钮列表
}
