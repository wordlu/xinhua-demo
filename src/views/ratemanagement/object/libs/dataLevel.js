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
// allRow -- form-item是否占一整行
// reserveKeyword -- select是否是否保留搜索关键词
// optionsHasSelectAll -- select是否有全选项
// checked -- select有全选功能时 对应的是否全选标识
// filterMethod -- select是否使用自定义搜索，select有全选时建议使用
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
    remote: true,
    reserveKeyword: true,
    clearable: true,
    multiple: true,
    options: [],
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 100
    },
    showPagination: true,
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
    checked: false,
    filterMethod: true,
    rowId: 1
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
    reserveKeyword: true,
    filterMethod: true,
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
    options: globalDictMap('1002'),
    rowId: 3
  },
  {
    label: '主体级别状态',
    key: 'objLevelStatus',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    options: globalDictMap('1003'),
    filterMethod: true,
    initValue: ['RV', 'RH'],
    rowId: 3
  },
  {
    label: '主体最新级别',
    key: 'objNewestLevel',
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
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 61002,
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
        btnShow: 61001,
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
    btnShow: 61005,
    onClick: (_, _this) => {
      _this.$emit('download')
    }
  },
  {
    label: '新增快速评级',
    type: 'primary',
    btnShow: 61004,
    onClick: (val, _this) => {
      _this.$emit('handleFast', val)
    }
  },
  {
    label: '导入待查询主体列表',
    btnShow: 61003,
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('handleImport', val)
    }
  }
]

const rules = {
  queryDate: [{ required: true, message: '请选择', trigger: 'blur' }]
}

export const dialogColumns = [
  {
    label: '序号',
    width: 'auto',
    align: 'center',
    fix: 'left'
  },
  {
    label: '主体代码(导入文件)',
    prop: 'importObjCode',
    align: 'center',
    minWidth: '160',
    input: true
  },
  {
    label: '主体名称(导入文件)',
    prop: 'importObjName',
    align: 'center',
    minWidth: '160',
    input: true,
    required: true
  },
  {
    label: '主体代码(系统匹配)',
    prop: 'objCode',
    align: 'center',
    minWidth: '160'
  },
  {
    label: '主体名称(系统匹配)',
    prop: 'objName',
    align: 'center',
    minWidth: '160'
  },
  {
    label: '匹配结果',
    prop: 'matchResult',
    align: 'center',
    minWidth: '160'
  }
]

export const dialogDebtColumns = [
  {
    label: '序号',
    width: 'auto',
    align: 'center',
    fix: 'left'
  },
  {
    label: '债券代码(导入文件)',
    prop: 'importObjCode',
    align: 'center',
    minWidth: '160',
    required: true,
    input: true
  },
  {
    label: '债券简称(导入文件)',
    prop: 'importObjName',
    align: 'center',
    minWidth: '160',
    input: true
  },
  {
    label: '债券代码(系统匹配)',
    prop: 'objCode',
    align: 'center',
    minWidth: '160'
  },
  {
    label: '债券简称(系统匹配)',
    prop: 'objName',
    align: 'center',
    minWidth: '160'
  },
  {
    label: '匹配结果',
    prop: 'matchResult',
    align: 'center',
    minWidth: '160'
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
  butData: butData // 按钮列表
}
