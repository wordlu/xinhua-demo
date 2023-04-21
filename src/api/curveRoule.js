import ajax from '@utils/ajax'

let serverPre = ajax.serverUrlMock

// 曲线拟合
export async function getcCrveDropDownBox(params) {
  return ajax.post(serverPre('/ruleConfig/curveDropDownBox'), params)
}

// 获取下拉框数据
export async function getSelectListAPI(params) {
  return ajax.post(serverPre('/ruleConfig/queryList'), params)
}
// 获取列表数据
export async function getCurveListFN(params) {
  return ajax.post(serverPre('/ruleConfig/query'), params)
}

// 获取全部列表数据
export async function getQueryAll(params) {
  return ajax.post(serverPre('/ruleConfig/queryAll'), params)
}

// 导出
export async function getDeriveFN(params) {
  return ajax.fileBlob(serverPre('/ruleConfig/outExcel'), params)
}
// 获取新增信息
export async function getAddAPI(params) {
  return ajax.get(serverPre('/ruleConfig/curveInfo'), params)
}
// 保存新增信息
export async function postInfoAPI(params) {
  return ajax.post(serverPre('/ruleConfig/saveCurve'), params)
}

// 主体树状图
export async function getTreeAPI(params) {
  return ajax.get(serverPre('/ruleConfig/industryList'), params)
}

// 查询主体内容
export async function getMainAPI(params) {
  return ajax.post(serverPre('/bndTradeInfo/orgQuery'), params)
}
// 主体名称
export async function getSubjNameList(params) {
  return ajax.post(serverPre(`/bndTradeInfo/orgNameList`), params)
}
// 主体行业
export async function getIndustryList(params) {
  return ajax.get(serverPre(`/bndTradeInfo/industryList?indCd=${params}`))
}
// 删除当前列表数据
export async function delCurveListAPI(params) {
  return ajax.post(serverPre(`/ruleConfig/deleteCurveInfo`), params)
}
// 每日计算开关
export async function dailyCalSwitchAPI(params) {
  return ajax.post(serverPre(`/ruleConfig/dailyCalSwitch`), params)
}
// 发起计算
export async function calculationAPI(params) {
  return ajax.post(serverPre(`/ruleConfig/calButton`), params)
}
// 查询最新曲线计算列表
export async function GetCalculationAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/curveCalTaskNewestDt`), params)
}
// 取消计算
export async function cancelAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/cancelCurveCalTask`), params)
}
// 曲线拟合结果列表
export async function curveFitResultListAPI(params) {
  return ajax.post(serverPre(`/ruleConfig/curveFitResultList`), params)
}
// 曲线名称重复校验
export async function getCurveNameAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/getCurveName`), params)
}

// 获取主体分析师
export async function getOrgAnalystList(params) {
  return ajax.get(serverPre(`/objLevelManage/orgAnalystList`), params)
}

// 获取曲线创建人下拉框数据
export async function getNewSelectListAPI(params) {
  return ajax.get(serverPre('/ruleConfig/queryCurveCreaterList'), params)
}
// 查询拟合结果
export async function getQueryListAPI(params) {
  return ajax.get(serverPre('/objLevelManage/queryList'), params)
}
// 批量计算按钮
export async function postBatchCalButton(params) {
  return ajax.post(serverPre('/ruleConfig/batchCalButton'), params)
}
// 查询曲线计算任务列表
export async function getCurveCalTaskList(params) {
  return ajax.get(serverPre('/ruleConfig/curveCalTaskList'), params)
}
// 获取当前操作用户
export async function getLogInNameAPI(params) {
  return ajax.get(serverPre('/ruleConfig/getLogInName'), params)
}

// 获取该曲线的分段剩余期限
export async function getCurveSectionPeriodInfo(params) {
  return ajax.get(serverPre('/ruleConfig/getCurveSectionPeriodInfo'), params)
}
// 获取该当前曲线创建人创建了几个曲线
export async function getCurveCreatorCheckout(params) {
  return ajax.get(serverPre('/ruleConfig/checkBeforeAdd'), params)
}

// 校验曲线是否有实时计算任务
export async function calButtonChackAPI(params) {
  return ajax.post(serverPre(`/ruleConfig/calButtonChack`), params)
}
// 获取所得债券树
export async function getBndTreeListAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/bndTreeList`), params)
}
// 获取所得省份行业树
export async function getProvinceTreeListAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/provinceTreeList`), params)
}
// 获取参数上限
export async function getCusCurveParamAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/getCusCurveParam`))
}
// 曲线规则查询与曲线配置-曲线管理跳转曲线试算界面参数补齐
export async function getcurveSkipParamAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/curveSkipParam`), params)
}

// 仅一级二级省份行业树查询
export async function getprovinceTreeListTwoAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/provinceTreeListTwo`), params)
}
// 发起实时计算
export async function saveCurveCalAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/saveCurveCal`), params)
}

// 跳转至曲线利率走势分析页面数据
export async function curveSkipParamTwoAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/curveSkipParamTwo`), params)
}
// 跳转至曲线利率走势分析页面数据
export async function curveCalTimeAPI(params) {
  return ajax.get(serverPre(`/ruleConfig/curveCalTime`), params)
}
// 获取实时计算时间
export async function curveCalTimeBeforeTwentyDay(params) {
  return ajax.get(serverPre(`/ruleConfig/curveCalTimeBeforeTwentyDay?data=${params}`))
}
// 获取延时计算时间
export async function curveCalTimeByDelayed(params) {
  return ajax.get(serverPre(`/ruleConfig/curveCalTimeByDelayed`), params)
}
