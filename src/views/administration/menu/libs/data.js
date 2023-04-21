import { initData } from '@/src/utils/util'
const renderForm = [
  {
    type: 'Buttons',
    rowId: 2,
    children: []
  }
]
const butData = []
export const formData = {
  initData: initData(renderForm),
  maxRow: 1,
  maxCol: 3,
  isFoldRow: false,
  Folding: false,
  renderFrom: renderForm,
  showButt: true, // 按钮列表状态
  butData: butData
}

export const list = [
  {
    label: '菜单名称',
    prop: 'name',
    align: 'left'
  },
  {
    label: '路径',
    prop: 'path',
    align: 'center'
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    align: 'center'
  }
]
