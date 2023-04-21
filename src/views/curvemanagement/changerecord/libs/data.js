import { initData, dateConfig, pickerOptions } from '@utils/util'
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
    label: '起始日期',
    key: 'startTime',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '结束日期',
    key: 'endTime',
    type: 'DatePicker',
    rowId: 1,
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    }
  },
  {
    label: '债券简称',
    key: 'bndAbbrNmList',
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
    label: '债券代码',
    key: 'bndCdList',
    type: 'Select',
    remote: true,
    reserveKeyword: true,
    filterable: true,
    clearable: true,
    multiple: true,
    options: [],
    rowId: 1
  },
  {
    label: '主体名称',
    key: 'orgNameList',
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
    key: 'orgTpList',
    type: 'Select',
    filterable: true,
    clearable: true,
    filterMethod: true,
    reserveKeyword: true,
    multiple: true,
    options: globalDictMap('2020'),
    rowId: 2
  },
  {
    label: '变动类型',
    key: 'tp',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: [
      {
        code: '债券发行、评级生效或进入剩余期限阈值',
        name: '债券发行、评级生效或进入剩余期限阈值'
      },
      {
        code: '债券到期、评级失效或超出剩余期限阈值',
        name: '债券到期、评级失效或超出剩余期限阈值'
      },
      { code: '评级变动', name: '评级变动' },
      { code: '主体类型变动', name: '主体类型变动' }
    ],
    rowId: 2
  },
  {
    label: '变动前所属曲线',
    key: 'bfoCurveNameList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: [],
    rowId: 2
  },
  {
    label: '变动后所属曲线',
    key: 'aftCurveNameList',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    options: [],
    rowId: 3
  },
  {
    type: 'Buttons',
    children: [
      {
        label: '重置',
        btnShow: 43001,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm', val.initData)
        }
      },
      {
        label: '查询',
        btnShow: 43002,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      }
    ]
  } // pushCol向右移动
]
const butData = [
  {
    label: '导出',
    type: 'primary',
    btnShow: 43003,
    onClick: (_, _this) => {
      _this.$emit('download')
    }
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 3, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: true, // 是否需要折叠
  Folding: false, // 折叠状态,
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
    label: '变动日期',
    prop: 'bizDt',
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
    prop: 'bndAbbr',
    align: 'center'
  },
  {
    label: '主体名称',
    prop: 'orgName',
    align: 'center'
  },
  {
    label: '变动前所属曲线',
    prop: 'bfoCurveName',
    align: 'center'
  },
  {
    label: '变动后所属曲线',
    prop: 'aftCurveName',
    align: 'center'
  },
  {
    label: '变动前债项评级',
    prop: 'bfoBndRating',
    align: 'center'
  },
  {
    label: '变动后债项评级',
    prop: 'aftBndRating',
    align: 'center'
  },
  {
    label: '变动前主体类型',
    prop: 'bfoOrgTp',
    align: 'center'
  },
  {
    label: '变动后主体类型',
    prop: 'aftOrgTp',
    align: 'center'
  },
  {
    label: '变动类型',
    prop: 'tp',
    align: 'center'
  }
]
