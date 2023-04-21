import ajax from '@utils/ajax';

let serverPre = ajax.serverAnalysis

// 多主体 - 利率期限结构 - 主体选择器查询
export function getOrgQuery (params) {
  return ajax.post(serverPre('/sbjsCompAnalysis/orgQuery'), params);
}

// 多主体 - 利率期限结构 - 图形数据
export function getEchartsListTerm (params) {
  return ajax.post(serverPre('/sbjsCompAnalysis/viewTerm'), params);
}

// 多主体 - 利率期限结构 - 曲线数据
export function getCurveDataListTerm (params) {
  return ajax.post(serverPre('/sbjsCompAnalysis/scatterListTerm'), params);
}

// 多主体 - 利率期限结构 - 曲线参数
export function getCurveParamsListTerm (params) {
  return ajax.post(serverPre('/sbjsCompAnalysis/curveParamListTerm'), params);
}

// 多主体 - 利率走势分析 - 图形数据
export function getEchartsListTrend (params) {
  return ajax.post(serverPre('/sbjsCompAnalysis/viewTrend'), params);
}

// 多主体 - 利率走势分析 - 散点数据
export function getScatterListTrend (params) {
  return ajax.post(serverPre('/sbjsCompAnalysis/scatterListTrend'), params);
}

// 多主体 - 利率期限结构导出
export function exportScatterListTerm (params) {
  return ajax.fileBlob(serverPre('/sbjsCompAnalysis/excelExport/exportScatterListTerm'), params);
}

// 多主体 - 利率走势分析导出
export function exportScatterListTrend (params) {
  return ajax.fileBlob(serverPre('/sbjsCompAnalysis/excelExport/exportScatterListTrend'), params);
}