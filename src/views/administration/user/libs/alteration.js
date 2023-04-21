import { initData, dateConfig, pickerOptions } from '@utils/util'
import cloneDeep from 'lodash/cloneDeep'
export const renderFrom = [
  {
    label: '开始日期:',
    key: 'beginDate',
    initValue: dateConfig().beginDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    type: 'DatePicker',
    rowId: 1
  },
  {
    label: '结束日期:',
    key: 'endDate',
    type: 'DatePicker',
    initValue: dateConfig().endDate,
    options: {
      disabledDate: time => pickerOptions(time)
    },
    rowId: 1
  },
  {
    label: '用户名',
    key: 'userName',
    type: 'Select',
    clearable: true,
    options: [],
    filterable: true,
    multiple: true,
    rowId: 1,
    filterMethod: true,
    reserveKeyword: true
  },
  {
    label: '用户代码',
    key: 'userAccount',
    type: 'Select',
    clearable: true,
    options: [],
    filterable: true,
    multiple: true,
    rowId: 1,
    filterMethod: true,
    reserveKeyword: true
  },
  {
    label: '变更类型',
    key: 'changeType',
    type: 'Select',
    clearable: true,
    options: [
      {
        name: '新增',
        code: '新增'
      },
      {
        name: '删除',
        code: '删除'
      },
      {
        name: '启用',
        code: '启用'
      }
    ],
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 4,
    children: [
      {
        label: '重置',
        btnType: 'primary',
        btnShow: 81201,
        onClick: (_, val, _this) => {
          val.initData = initData(renderFrom)
          _this.$emit('resetForm')
        }
      },
      {
        label: '查询',
        btnShow: 81202,
        btnType: 'primary',
        onClick: (val, _, _this) => {
          _this.$emit('queryForm', val)
        }
      },
      {
        label: '导出',
        btnShow: 81203,
        onClick: (val, _, _this) => {
          _this.$emit('download', val)
        }
      }
    ]
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 2,
  maxCol: 3,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: cloneDeep(renderFrom)
}
export const list = [
  {
    label: '序号',
    align: 'center',
    render: (h, record) => {
      return h('span', record.$index + 1)
    }
  },
  {
    label: '用户代码',
    prop: 'userAccount',
    align: 'center'
  },
  {
    label: '用户名',
    prop: 'userName',
    align: 'center'
  },
  {
    label: '开始日期',
    prop: 'beginDate',
    align: 'center'
  },
  {
    label: '结束日期',
    prop: 'endDate',
    align: 'center'
  },
  {
    label: '操作时间',
    prop: 'createTime',
    align: 'center'
  },
  {
    label: '变更类型',
    prop: 'changeType',
    align: 'center'
  }
  // {
  // 后期估计会使用
  //   label: '操作',
  //   prop: '',
  //   'header-align': 'center',
  //   align: 'center',
  //   render: (h, { record }) => {
  //     return (
  //       <div>
  //         <el-button type="text" onClick={() => this.detail(record.curveId)}>
  //           添加
  //         </el-button>
  //         <el-button
  //           type="text"
  //           onClick={() => {
  //             this.delCurveListFN(record.curveId)
  //           }}
  //         >
  //           删除
  //         </el-button>
  //       </div>
  //     )
  //   }
  // }
]
