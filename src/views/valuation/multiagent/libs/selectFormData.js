import { initData, dateConfig } from '@utils/util'
import { globalDictMap, detectZoom } from '@utils/dict'
import store from '@store'
import moment from 'moment'
import { cloneDeep } from 'lodash'
export const renderFrom = [
  {
    label: '日期:',
    key: 'bizDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => {
        const ableDate = store.state.user.ableDate
        return !ableDate.includes(moment(time).format('YYYYMMDD'))
      }
    },
    rowId: 1
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
    ogicsIndustryListptions: [],
    rowId: 1,
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 100
    },
    loading: false
  },
  {
    label: '主体类型:',
    key: 'orgTypeList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    options: globalDictMap('2020') || [],
    rowId: 1,
    class: detectZoomClass()
  },
  {
    label: '新华GICS行业:',
    key: 'gicsIndustryList',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    appendbody: false,
    rowId: 2
  },
  {
    label: '新华内部行业:',
    key: 'innerIndustryList',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    appendbody: false,
    rowId: 2
  },
  {
    label: '申万行业:',
    key: 'swIndustryList',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    appendbody: false,
    options: [],
    rowId: 2,
    class: detectZoomClass()
  },
  {
    label: '主体级别类型:',
    key: 'orgLevelType',
    type: 'Select',
    filterable: false,
    clearable: true,
    multiple: false,
    options: globalDictMap('1002') || [],
    rowId: 3
  },
  {
    label: '主体级别状态:',
    key: 'orgLevelStaList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    options: globalDictMap('1003') || [],
    rowId: 3
  },
  {
    label: '主体最新级别:',
    key: 'newestOrgLevel',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('2010') || [],
    rowId: 3,
    class: detectZoomClass()
  },
  {
    label: '主体所属分析师:',
    key: 'orgAnalystList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    rowId: 4
  },
  {
    label: '主体城投区域(三级):',
    key: 'orgMuniRregionlist',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    reserveKeyword: true,
    appendbody: false,
    options: [],
    rowId: 4
  },
  {
    label: '主体注册地所在区域(二级):',
    key: 'orgRregionList',
    type: 'Cascader',
    filterable: true,
    clearable: true,
    multiple: true,
    appendbody: false,
    options: [],
    rowId: 4,
    class: detectZoomClass()
  },
  {
    label: '主体城投层级:',
    key: 'orgMuniLevelList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('2080') || [],
    rowId: 5
  },
  {
    label: '股东背景:',
    key: 'shareholderBgList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('2040') || [],
    rowId: 5
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
  valuatSituationTpList: [{ required: true, message: '请选择', trigger: 'blur' }]
}

const butData = [
  {
    label: '主体列表导入',
    type: 'primary',
    onClick: (val, _this) => {
      _this.$emit('export')
    }
  }
]

export function detectZoomClass() {
  return detectZoom() === 150 ? 'detectZoom150' : detectZoom() === 300 ? 'detectZoom300' : ''
}

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
