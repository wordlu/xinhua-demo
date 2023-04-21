import { formData } from './selectBndFormData';

export const selectBndtData = {
  formData, // form数据 -> 基于BaseForm数据
  customForm: true, // 是否使用自定义form
  formLabelWith: 120, // formItem 宽度
  isShowSizer: true, // 选择器是否显示
  btnName: '选择债券', // 选择器 按钮文案
  btnIcon: 'el-icon-plus', // 选择器 按钮icon
  dialogTitle: '选择债券', // 弹窗 title
  dialogWidth: '1200px', // 弹窗 宽度
  isShowTransfer: false,
  total: 0,
  transferData: [], // 穿梭框数据
  selectedData: [], // 已选择的数据
  setOptions: {} // form options 自定义选项
};
