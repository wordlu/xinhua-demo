import { initData, dateConfig, pickerOptions, renderColumnsIndustry } from '@utils/util'
import { globalDictMap } from '@utils/dict'
import { cloneDeep } from 'lodash'
// label --- 名称
// key   --- 双向绑定
// type  --- 类型 DatePicker 时间  Select 下拉 Cascader 级联 Input 输入框
// rowId --- 第几行
// options --- 数据
// multiple --- 是否多选
// filterable --- 是否可以输入
// clearable --- 是否可以清除

export const renderFrom = [
  {
    label: '查询日期',
    key: 'bizDate',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '曲线类型',
    key: 'curveTp',
    type: 'Slot',
    slotName: 'items',
    allRow: false,
    rowId: 1
  },
  {
    label: '曲线创建人',
    key: 'creater',
    type: 'Slot',
    slotName: 'flow',
    allRow: false,
    rowId: 1
  },
  {
    label: '曲线名称',
    key: 'curveName',
    type: 'Slot',
    slotName: 'rose',
    allRow: false,
    rowId: 1
  },
  {
    label: '主体名称',
    key: 'orgList',
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
    rowId: 2
  },
  {
    label: '主体类型',
    key: 'orgTypeList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: globalDictMap('2020'),
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
    rowId: 3
  },
  {
    label: '债券简称',
    key: 'bndAbbrNm',
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
    rowId: 3
  },
  {
    label: '债券代码',
    key: 'bndCd',
    type: 'Select',
    remote: true,
    reserveKeyword: true,
    filterable: true,
    clearable: true,
    multiple: true,
    rowId: 3
  },
  {
    label: '是否本曲线样本券',
    key: 'isCurveSampleBnd',
    type: 'Select',
    options: globalDictMap('1011'),
    filterable: true,
    clearable: true,
    filterMethod: true,
    reserveKeyword: true,
    rowId: 3
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '重置',
        btnShow: 42001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm', val.initData)
        }
      },
      {
        label: '查询',
        btnShow: 42002,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$refs.myForm.validate(value => {
            if (value) {
              _this.$emit('queryForm', val)
            }
          })
        }
      }
    ]
  } // pushCol向右移动
]

const butData = [
  {
    label:
      '注意：若自定义曲线查询结果为空，是由于查询日期当天未进行曲线拟合，可在曲线规则查询与曲线配置页面进行实时计算后，再做此页面查询。',
    type: 'admonish'
  },
  {
    label: '导出',
    btnShow: 42003,
    type: 'primary',
    onClick: (_, _this) => {
      _this.$emit('download')
    }
  }
]

const rules = {
  bizDate: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择开始日期'
    }
  ]
}

export const formData = {
  initData: initData(renderFrom),
  rules,
  maxRow: 4, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态
  butData: butData, // 按钮列表
  showButt: true, // 按钮列表状态
  renderFrom: cloneDeep(renderFrom)
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
    label: '债券简称',
    prop: 'bndAbbrNm',
    align: 'center'
  },
  {
    label: '债券级别',
    prop: 'bndLevel',
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
    label: '新华内部行业',
    prop: 'innerInd',
    align: 'center',
    render: (h, { record }) => renderColumnsIndustry(h, record.innerInd)
  },
  {
    label: '申万行业',
    prop: 'swInd',
    align: 'center',
    render: (h, { record }) => renderColumnsIndustry(h, record.swInd)
  },
  {
    label: '曲线ID',
    prop: 'curveId',
    align: 'center'
  },
  {
    label: '所属曲线',
    prop: 'curveName',
    align: 'center'
  },
  {
    label: '曲线类型',
    prop: 'curveTp',
    align: 'center'
  },
  {
    label: '曲线创建人',
    prop: 'creater',
    align: 'center'
  },
  {
    label: '曲线创建时间',
    prop: 'createTime',
    align: 'center',
    width: 90
  },
  {
    label: '是否备选样本券',
    prop: 'isSampleBnd',
    align: 'center'
  },
  {
    label: '是否标准样本券',
    prop: 'isStdBnd',
    align: 'center'
  },
  {
    label: '是否本曲线样本券',
    prop: 'isCurveSampleBnd',
    align: 'center'
  }
]
