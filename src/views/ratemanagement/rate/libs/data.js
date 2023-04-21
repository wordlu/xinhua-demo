import { initData, renderColumnsIndustry } from '@utils/util'
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
      total: 100
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
    label: '是否暂存评级',
    key: 'temporaryRatingFlag',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1011'),
    rowId: 3
  },
  {
    label: '是否需要快速评级',
    key: 'needFastRatingFlag',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: false,
    options: globalDictMap('1011'),
    rowId: 3
  },
  {
    label: '上一个评估日至今是否已有快速评级',
    key: 'existFastRatingFlag',
    type: 'Select',
    filterable: true,
    clearable: true,
    options: globalDictMap('1011'),
    multiple: false,
    notes: '',
    rowId: 3
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 63002,
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      },
      {
        label: '重置',
        btnShow: 63001,
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
    btnShow: 63005,
    onClick: (_, _this) => {
      _this.$emit('download')
    }
  },
  {
    label: '撤销上次导入',
    type: 'primary',
    btnShow: 63004,
    onClick: (val, _this) => {
      _this.$emit('handleCancel', val)
    }
  },
  {
    label: '导入新增评级',
    type: 'primary',
    btnShow: 63003,
    onClick: (val, _this) => {
      _this.$emit('handleImport', val)
    }
  }
]
export const formData = {
  initData: initData(renderFrom),
  maxRow: 3, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 3, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom,
  showButt: true, // 按钮列表状态
  butData: butData // 按钮列表
}
export const columns = [
  {
    label: '序号',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    align: 'center',
    fix: 'left'
  },
  {
    label: '主体代码',
    prop: 'objCode',
    align: 'center'
  },
  {
    label: '主体名称',
    prop: 'objName',
    'show-overflow-tooltip': true,
    align: 'center',
    minWidth: '120',
    fix: 'left'
  },
  {
    label: '主体任意证券代码',
    prop: 'objBondCode',
    minWidth: '140',
    align: 'center'
  },
  {
    label: '主体所属分析师',
    prop: 'objBelongAnalyst',
    minWidth: '120',
    align: 'center'
  },
  {
    label: '操作分析师',
    prop: 'operateAnalyst',
    minWidth: '120',
    align: 'center'
  },
  {
    label: '新华GICS行业',
    prop: 'objGICSIndustry',
    minWidth: '120',
    align: 'center',
    render: (h, { record }) => renderColumnsIndustry(h, record.objGICSIndustry)
  },
  {
    label: '新华内部行业',
    prop: 'objInnerIndustry',
    minWidth: '120',
    align: 'center',
    render: (h, { record }) => renderColumnsIndustry(h, record.objInnerIndustry)
  },
  {
    label: '申万行业',
    prop: 'objSWIndustry',
    minWidth: '100',
    align: 'center',
    render: (h, { record }) => renderColumnsIndustry(h, record.objSWIndustry)
  },
  {
    label: '人工正式评级',
    prop: 'officialLevel',
    align: 'center'
  },
  {
    label: '人工正式评级生效时间',
    prop: 'officialLevelEffectiveDt',
    minWidth: '130',
    align: 'center'
  },
  {
    label: '人工快速评级',
    prop: 'speedyLevel',
    align: 'center'
  },
  {
    label: '人工快速评级生效时间',
    prop: 'speedyLevelEffectiveDt',
    minWidth: '130',
    align: 'center'
  },
  {
    label: '批量评级',
    prop: 'batchLevel',
    align: 'center'
  },
  {
    label: '批量评级生效时间',
    prop: 'batchLevelEffectiveDt',
    minWidth: '110',
    align: 'center'
  },
  {
    label: '暂存快速评级',
    prop: 'temporaryLevel',
    minWidth: '110',
    align: 'center'
  },
  {
    label: '是否需要快速评级',
    prop: 'needFastRatingFlag',
    minWidth: '110',
    align: 'center'
  },
  {
    label: '上一个评估日至今是否已有快速评级',
    prop: 'existFastRatingFlag',
    minWidth: '140',
    align: 'center'
  }
]

export const fastDialogColumns = [
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
    label: '新增级别(导入文件)',
    prop: 'importObjLevel',
    align: 'center',
    minWidth: '160',
    select: true,
    required: true,
    options: globalDictMap('2010')
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
