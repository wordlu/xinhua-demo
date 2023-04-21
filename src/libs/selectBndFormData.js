import { initData, dateConfig, pickerOptions } from '@utils/util'
import { globalDictMap } from '@utils/dict'
import { cloneDeep } from 'lodash'

export const renderFrom = [
  {
    label: '日期:',
    key: 'bizDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '债券简称:',
    key: 'bndAttrList',
    type: 'newPageSelect',
    filterable: true,
    remote: true,
    clearable: true,
    multiple: true,
    reserveKeyword: true,
    rowId: 1,
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 0
    },
    loading: false
  },
  {
    label: '债券代码:',
    key: 'bndCodeList',
    type: 'newPageSelect',
    filterable: true,
    remote: true,
    clearable: true,
    multiple: true,
    reserveKeyword: true,
    rowId: 1,
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 0
    },
    loading: false
  },
  {
    label: '主体名称:',
    key: 'orgList',
    type: 'newPageSelect',
    filterable: true,
    remote: true,
    clearable: true,
    multiple: true,
    reserveKeyword: true,
    options: [],
    rowId: 2,
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 0
    },
    loading: false
  },
  {
    label: '所属曲线:',
    key: 'curveList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    rowId: 2
  },
  {
    label: '(含权)剩余期限:',
    key: 'remainPeriod',
    type: 'Slot',
    slotName: 'remainPeriod',
    rowId: 2
  },
  {
    label: '债券级别:',
    key: 'bndGradeList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('2090') || [],
    rowId: 3
  },
  {
    label: '交易市场:',
    key: 'tradeMktList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('1005') || [],
    rowId: 3
  },
  {
    label: '发行规模:',
    key: 'issueScale',
    type: 'Slot',
    slotName: 'issueScale',
    rowId: 3
  },
  {
    label: '发行利率:',
    key: 'issueInterRate',
    type: 'Slot',
    slotName: 'issueInterRate',
    rowId: 4
  },
  {
    label: '剩余规模:',
    key: 'surplusScale',
    type: 'Slot',
    slotName: 'surplusScale',
    rowId: 4
  },
  {
    type: 'Buttons',
    rowId: 6,
    children: [
      {
        label: '重置',
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
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

const rules = {
  bizDate: [{ required: true, message: '请选择', trigger: 'blur' }]
}

const butData = [
  {
    label: '债券列表导入',
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('exportBnd')
    }
  }
  // {
  //   label: '债券模板下载',
  //   onClick: (val, _this) => {
  //     _this.$emit('templateDownload')
  //   }
  // }
]

export const formData = {
  initData: initData(renderFrom),
  rules, // 表单验证规则
  maxRow: 5, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 3, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  butData: butData, // 按钮列表
  renderFrom: cloneDeep(renderFrom)
}
