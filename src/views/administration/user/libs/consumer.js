import { initData } from '@/src/utils/util'
import cloneDeep from 'lodash/cloneDeep'
export const renderFrom = [
  {
    label: '用户代码:',
    key: 'code',
    type: 'Select',
    clearable: true,
    options: [],
    filterable: true,
    multiple: true,
    rowId: 1,
    filterMethod: true, // 自定义搜索方法传递true，走baseForm里方法
    reserveKeyword: true // 如果下拉项是多选，需要一次多选几个项，加这个属性
  },
  { label: '用户名:', key: 'userName', type: 'Input', rowId: 1 },
  {
    label: '状态:',
    key: 'delFlag',
    type: 'Select',
    clearable: true,
    options: [
      { name: '有效', code: '0' },
      { name: '停用', code: '1' }
    ],
    filterable: true,
    multiple: true,
    rowId: 1
  },
  // 现在不需要，后期辉耀
  {
    label: '所属部门:',
    key: 'deptId',
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
    type: 'Buttons',
    rowId: 2,
    children: [
      {
        label: '新增',
        btnType: 'primary',
        btnShow: 81101,
        onClick: (_, val, _this) => {
          _this.$emit('addUser')
        }
      },
      {
        label: '删除',
        btnType: 'primary',
        btnShow: 81102,
        onClick: (_, val, _this) => {
          _this.$emit('batchDelete')
        }
      },
      {
        label: '查询',
        btnShow: 81103,
        btnType: 'primary',
        onClick: (_, val, _this) => {
          _this.$emit('inquire', _)
        }
      }
    ]
  }
]
export const formData = {
  initData: initData(renderFrom),
  maxRow: 1,
  maxCol: 4,
  isFoldRow: false, // 是否需要折叠
  Folding: false, // 折叠状态
  renderFrom: cloneDeep(renderFrom)
  // showButt: true // 按钮列表状态
  // butData: butData
}

export const list = [
  {
    type: 'selection',
    align: 'center',
    width: '60',
    fix: 'left',
    selectable: row => {
      if (row.delFlag === '停用') {
        return false
      } else {
        return true
      }
    }
  },
  {
    label: '序号',
    width: 50,
    align: 'center',
    render: (h, record) => {
      return h('span', record.$index + 1)
    }
  },
  {
    label: '用户代码',
    prop: 'loginName',
    align: 'center'
  },
  {
    label: '用户名',
    prop: 'username',
    align: 'center'
  },
  {
    label: '手机号',
    prop: 'phone',
    align: 'center'
  },
  {
    label: '首选角色',
    prop: 'list',
    align: 'center',
    render: (h, { record }) => {
      if (record && record.list.length > 0) {
        let str = cloneDeep(record.list)
        let list = str.filter(item => item.firstFlag === '0')
        if (list.length > 0) {
          return <span>{list[0].roleName}</span>
        } else {
          return <span>{}</span>
        }
      }
    }
  },
  {
    label: '备选角色',
    prop: 'list',
    align: 'center',
    width: 200,
    render: (h, { record }) => {
      if (record.list.length > 0) {
        let str = cloneDeep(record.list)
        let list = str
          .map(item => {
            return item.roleName
          })
          .join()
        return <span>{list}</span>
      }
    }
  },

  {
    label: '创建时间',
    prop: 'createTime',
    width: 150,
    align: 'center'
  },
  {
    label: '修改时间',
    prop: 'updateTime',
    width: 150,
    align: 'center'
  },
  {
    label: '状态',
    prop: 'delFlag',
    align: 'center'
  },
  {
    label: '所属部门',
    prop: 'deptName',
    align: 'center'
  }
]
