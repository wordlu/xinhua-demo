// 头部tab切换
const tabs = [
  {
    name: '备选样本券阈值配置',
    value: 'tabFirstData',
    numerical: '1',
    data: 'columnsFirstData',
    ref: 'tabFirstDataRef'
  },
  {
    name: '自定义曲线分组规则',
    value: 'tabSecondData',
    numerical: '2',
    data: 'columnsSecondData',
    ref: 'tabSecondDataRef'
  },
  {
    name: '全局异常值剔除设置',
    value: 'tabThirdData',
    numerical: '3',
    ref: 'tabThirdDataRef'
  },
  {
    name: '曲线模型配置',
    value: 'tabFourthData',
    numerical: '4',
    ref: 'tabFourthDataRef'
  },
  {
    name: '估值参数配置',
    value: 'tabFifthData',
    numerical: '5',
    ref: 'tabFifthDataRef'
  }
];
// 二级切换
const tabFirstData = [
  {
    label: '备选样本券阈值配置',
    name: '1'
  }
];
const tabSecondData = [
  {
    label: '自定义曲线分组规则',
    name: '1'
  }
];
const tabThirdData = [
  {
    label: '全局异常值剔除规则',
    name: '1'
  }
];
const tabFourthData = [
  {
    label: '标准曲线模型配置',
    name: '1'
  },
  {
    label: '自定义曲线模型配置',
    name: '2'
  }
];
const tabFifthData = [
  {
    label: '标准曲线估值参数配置',
    name: '1'
  },
  {
    label: '自定义曲线估值参数配置',
    name: '2'
  }
];
const objDialogColumns = [
  {
    label: '序号',
    width: 'auto',
    align: 'center',
    fix: 'left'
  },
  {
    label: '主体代码(导入文件)',
    prop: 'importObjCode',
    align: 'center',
    input: true
  },
  {
    label: '主体名称(导入文件)',
    prop: 'importObjName',
    align: 'center',
    input: true
  },
  {
    label: '主体代码(系统匹配)',
    prop: 'objCode',
    align: 'center'
  },
  {
    label: '主体名称(系统匹配)',
    prop: 'objName',
    align: 'center'
  },
  {
    label: '异常值起始日期（输入框）',
    prop: 'exBegindate',
    align: 'center',
    input: true
  },
  {
    label: '异常值结束日期（输入框）',
    prop: 'exEnddate',
    align: 'center',
    input: true
  },
  {
    label: '匹配结果',
    prop: 'matchResult',
    align: 'center'
  }
]
const bontDialogColumns = [
  {
    label: '序号',
    width: 'auto',
    align: 'center',
    fix: 'left'
  },
  {
    label: '债券代码(导入文件)',
    prop: 'importBondCode',
    align: 'center',
    input: true
  },
  {
    label: '债券名称(导入文件)',
    prop: 'importBondName',
    align: 'center',
    input: true
  },
  {
    label: '债券代码(系统匹配)',
    prop: 'bondCode',
    align: 'center'
  },
  {
    label: '债券名称(系统匹配)',
    prop: 'bondName',
    align: 'center'
  },
  {
    label: '异常值起始日期（输入框）',
    prop: 'exBegindate',
    align: 'center',
    input: true
  },
  {
    label: '异常值结束日期（输入框）',
    prop: 'exEnddate',
    align: 'center',
    input: true
  },
  {
    label: '匹配结果',
    prop: 'matchResult',
    align: 'center'
  }
]


export { tabs, tabFirstData, tabSecondData, tabThirdData, tabFourthData, tabFifthData, objDialogColumns, bontDialogColumns };
