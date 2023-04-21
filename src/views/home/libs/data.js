import { pickerOptions } from '@utils/util'

export const tabData = [
  {
    label: '主体信息变动触发快速评级提醒',
    name: 'RatingRemind'
  },
  {
    label: '今日快速评级',
    name: 'QuickRating'
  },
  {
    label: '债券标准分组问题--未分组债项',
    name: 'BondUngrouped'
  },
  {
    label: '债券标准分组问题--重复分组债项',
    name: 'BondRepeatgrouped'
  },
  {
    label: '标准曲线簇拟合问题',
    name: 'StandardCurve'
  },
  {
    label: '标准估值问题',
    name: 'StandardValuation'
  }
]

// 快速评级
export const columnsQuickRating = [
  {
    type: 'selection',
    align: 'center',
    selectable: row => {
      if (row.sbmtStatus === '已撤销') {
        return false
      } else {
        return true
      }
    },
    with: '60',
    fix: 'left'
  },
  {
    label: '序号',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    width: 50,
    align: 'center',
    fix: 'left'
  },
  {
    label: '主体名称',
    prop: 'objName',
    align: 'center'
  },
  {
    label: '主体所属分析师',
    prop: 'analystId',
    align: 'center'
  },
  {
    label: '人工快速评级（新增）',
    prop: 'orgLevel',
    align: 'center'
  },
  {
    label: '状态',
    prop: 'sbmtStatus',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'modifier',
    align: 'center'
  },
  {
    label: '操作时间',
    prop: 'modifieTime',
    align: 'center'
  }
]
// 快速评级提醒
export const columnsRatingRemind = [
  {
    label: '序号',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    width: 50,
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
    align: 'center'
  },
  {
    label: '主体任意证券代码',
    prop: 'atwillSecCd',
    align: 'center'
  },
  {
    label: '变动日期',
    prop: 'bizDt',
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
    align: 'center'
  },
  {
    label: '暂存快速评级',
    prop: 'orgLevel',
    align: 'center'
  },
  {
    label: '变动前批量评级',
    prop: 'bfoBatchLevel',
    align: 'center'
  },
  {
    label: '变动后批量评级',
    prop: 'aftBatchLevel',
    align: 'center'
  },
  {
    label: '变动前新华GICS行业',
    prop: 'bfoGicsCd',
    align: 'center'
  },
  {
    label: '变动后新华GICS行业',
    prop: 'aftGicsCd',
    align: 'center'
  }
]
// 未分组
export const columnsBondUngrouped = [
  {
    label: '序号',
    fix: 'left',
    type: 'index',
    align: 'center',
    width: '60'
  },
  {
    label: '日期',
    prop: 'valuatDt',
    align: 'center'
  },
  {
    label: '债券简称',
    prop: 'bndName',
    align: 'center'
  },
  {
    label: '债券代码',
    prop: 'bndCd',
    align: 'center'
  },
  {
    label: '债券类型',
    prop: 'bndTp',
    align: 'center'
  },
  {
    label: '剩余规模',
    prop: 'remainAmt',
    align: 'center'
  },
  {
    label: '剩余期限',
    prop: 'remainPeriod',
    align: 'center'
  },
  {
    label: '含权剩余期限',
    prop: 'exerRemainPeriod',
    align: 'center'
  },
  {
    label: '含权剩余期限说明',
    prop: 'exerRemainPeriodDesc',
    align: 'center'
  },
  {
    label: '债项评级',
    prop: 'bndLevel',
    align: 'center'
  },
  {
    label: '主体名称',
    prop: 'objName',
    align: 'center'
  },
  {
    label: '新华GICS行业',
    prop: 'gicsCd',
    align: 'center'
  },
  {
    label: '主体类型',
    prop: 'objTp',
    align: 'center'
  },
  {
    label: '未分组原因',
    prop: 'valuatReasonTp',
    align: 'center'
  }
]
// 重复分组
export const columnsBondRepeatgrouped = [
  {
    label: '序号',
    fix: 'left',
    type: 'index',
    align: 'center',
    width: '60'
  },
  {
    label: '日期',
    prop: 'valuatDt',
    align: 'center'
  },
  {
    label: '债券简称',
    prop: 'bndName',
    align: 'center'
  },
  {
    label: '债券代码',
    prop: 'bndCd',
    align: 'center'
  },
  {
    label: '曲线名称列表',
    prop: 'curveName',
    align: 'center'
  },
  {
    label: '债券类型',
    prop: 'bndTp',
    align: 'center'
  },
  {
    label: '含权剩余期限',
    prop: 'exerRemainPeriod',
    align: 'center'
  },
  {
    label: '含权剩余期限说明',
    prop: 'exerRemainPeriodDesc',
    align: 'center'
  },
  {
    label: '剩余规模',
    prop: 'remainAmt',
    align: 'center'
  },
  {
    label: '主体名称',
    prop: 'objName',
    align: 'center'
  },
  {
    label: '新华GICS行业',
    prop: 'gicsCd',
    align: 'center'
  },
  {
    label: '主体类型',
    prop: 'objTp',
    align: 'center'
  },
  {
    label: '债项评级',
    prop: 'bndLevel',
    align: 'center'
  }
]
// 标准曲线簇
export const columnsStandardCurve = [
  {
    label: '序号',
    fix: 'left',
    type: 'index',
    align: 'center',
    width: '60'
  },
  {
    label: '日期',
    prop: 'fitDt',
    align: 'center'
  },
  {
    label: '标准曲线簇名称',
    prop: 'clusterName',
    align: 'center'
  },
  {
    label: '是否使用虚拟交易样本点',
    prop: 'isFicFit',
    align: 'center'
  },
  {
    label: '追溯天数是否超过默认值',
    prop: 'valuatBackDay',
    align: 'center'
  },
  {
    label: '拟合追溯天数',
    prop: 'valuatBackDayCn',
    align: 'center'
  },
  {
    label: '拟合结果',
    prop: 'fitResult',
    align: 'center'
  }
]
// 标准估值
export const columnsStandardValuation = [
  {
    label: '序号',
    fix: 'left',
    type: 'index',
    align: 'center',
    width: '60'
  },
  {
    label: '日期',
    prop: 'valuatDt',
    align: 'center'
  },
  {
    label: '债券简称',
    prop: 'bndName',
    align: 'center'
  },
  {
    label: '债券代码',
    prop: 'bndCd',
    align: 'center'
  },
  {
    label: '最终评级',
    prop: 'modelLevel',
    align: 'center'
  },
  {
    label: '主体名称',
    prop: 'objName',
    align: 'center'
  },
  {
    label: '曲线名称',
    prop: 'curveName',
    align: 'center'
  },
  {
    label: '最长估值追溯天数',
    prop: 'maxValRetroacDays',
    align: 'center'
  },
  {
    label: '估值追溯天数',
    prop: 'valRetroacDays',
    align: 'center'
  },
  {
    label: '估值问题类型',
    prop: 'valSta',
    align: 'center'
  }
]

const valStaOptions = [
  {
    code: 1,
    name: '补充样本点后成功估值'
  },
  {
    code: 2,
    name: '样本不足使用曲线估值'
  },
  {
    code: 3,
    name: '估值失败'
  }
]

export const renderFrom = [
  {
    label: '主体名称:',
    key: 'objName',
    type: 'newPageSelect',
    filterable: true,
    reserveKeyword: true,
    clearable: true,
    remote: true,
    multiple: true,
    status: ['QuickRating', 'BondUngrouped', 'StandardValuation'],
    options: [],
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 0
    },
    rowId: 1
  },
  {
    label: '批次号:',
    key: 'batchNums',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    status: ['QuickRating'],
    options: [],
    rowId: 1
  },
  {
    label: '开始日期:',
    key: 'beginDate',
    type: 'DatePicker',
    options: {
      disabledDate: time => pickerOptions(time)
    },
    status: ['BondUngrouped', 'BondRepeatgrouped', 'StandardCurve', 'StandardValuation'],
    rowId: 1
  },
  {
    label: '结束日期:',
    key: 'endDate',
    type: 'DatePicker',
    options: {
      disabledDate: time => pickerOptions(time)
    },
    status: ['BondUngrouped', 'BondRepeatgrouped', 'StandardCurve', 'StandardValuation'],
    rowId: 1
  },
  {
    label: '债券简称:',
    key: 'bndAbbrNm',
    type: 'newPageSelect',
    filterable: true,
    remote: true,
    clearable: true,
    multiple: true,
    status: ['BondUngrouped', 'StandardValuation'],
    options: [],
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 0
    },
    rowId: 1
  },
  {
    label: '债券代码:',
    key: 'bndCd',
    type: 'Select',
    filterable: true,
    remote: true,
    clearable: true,
    multiple: true,
    status: ['BondUngrouped', 'StandardValuation'],
    options: [],
    rowId: 1
  },
  {
    label: '曲线名称:',
    key: 'curveName',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    filterMethod: true,
    reserveKeyword: true,
    status: ['BondRepeatgrouped'],
    options: [],
    rowId: 1
  },
  {
    label: '估值问题类型:',
    key: 'valSta',
    type: 'Select',
    filterable: true,
    clearable: true,
    multiple: true,
    status: ['StandardValuation'],
    options: valStaOptions,
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: []
  }
]

export const buttons = [
  {
    label: '查询',
    btnType: 'primary',
    status: [
      'QuickRating',
      'BondUngrouped',
      'BondRepeatgrouped',
      'StandardCurve',
      'StandardValuation'
    ],
    onClick: (val, _, _this) => {
      _this.$refs.myForm.validate(valid => {
        if (valid) {
          _this.$emit('queryForm', val)
        }
      })
    }
  },
  {
    label: '导出',
    status: ['BondUngrouped', 'BondRepeatgrouped', 'StandardCurve', 'StandardValuation'],
    onClick: (_, val, _this) => {
      _this.$refs.myForm.validate(valid => {
        if (valid) {
          _this.$emit('exportForm')
        }
      })
    }
  }
]

export const shuttButton = [
  {
    label: '导出',
    type: 'primary',
    status: ['RatingRemind', 'QuickRating'],
    onClick: (val, _this) => {
      _this.$refs.myForm.validate(valid => {
        if (valid) {
          _this.$emit('exportForm', val.initData)
        }
      })
    }
  },
  {
    label: '批量撤销',
    type: 'primary',
    status: ['QuickRating'],
    onClick: (_, _this) => {
      _this.$emit('resetBatch')
    }
  },
  {
    label: '批量新增',
    type: 'primary',
    status: ['RatingRemind', 'QuickRating'],
    onClick: (val, _this) => {
      _this.$emit('addBatch', val)
    }
  }
]
