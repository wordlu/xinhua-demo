import { initData } from '@utils/util'

export const renderFrom = [
  {
    label: '主体名称:',
    key: 'objName',
    type: 'newPageSelect',
    filterable: true,
    remote: true,
    clearable: true,
    multiple: true,
    reserveKeyword: true,
    options: [],
    getPageInfo: {
      pageNum: 1,
      pageSize: 6,
      total: 100
    },
    rowId: 1
  },
  {
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '查询',
        btnType: 'primary',
        btnShow: 12004,
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

const butData = [
  {
    label: '批量撤销',
    btnShow: 12002,
    type: 'primary',
    onClick: (_, _this) => {
      _this.$emit('resetBatch')
    }
  },
  {
    label: '导出',
    type: 'primary',
    btnShow: 12003,
    onClick: (val, _this) => {
      _this.$emit('exportForm', val)
    }
  }
]

export const tabData = [
  {
    label: '我的自定义曲线',
    name: 'CustomCurve'
  },
  {
    label: '我的快速评级',
    name: 'QuickRating'
  },
  {
    label: '主体信息变动触发快速评级提醒',
    name: 'RatingRemind'
  }
]

export const formData = {
  initData: initData(renderFrom),
  maxRow: 1, // 最大行数 相同的 rowId会被放到同一行
  maxCol: 4, // 最大列数
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  showButt: true, // 按钮列表状态
  renderFrom,
  butData
}
