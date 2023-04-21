import ajax from '@utils/ajax';

let serverPre = ajax.serverAnalysis

// 自定义估值 - 图形数据
export function getEchartsListCustom (params) {
  return ajax.post(serverPre('/sustomValuation/termInfo'), params);
}

// 自定义估值 - 散点数据
export function getScatterListCustom (params) {
  return ajax.post(serverPre('/sustomValuation/scatterListTerm'), params);
}

// 自定义估值 - 曲线数据
export function getCurveListCustom (params) {
  return ajax.post(serverPre('/sustomValuation/curveModeListTerm'), params);
}

// 自定义估值 - 曲线参数
export function getCurveParamsListCustom (params) {
  return ajax.post(serverPre('/sustomValuation/curveParamListTerm'), params);
}

// 自定义估值 - 估值曲线下拉
export function getCurveList (params) {
  return ajax.post(serverPre('/sustomValuation/getCurveList'), params);
}

// 自定义估值 - 估值曲线下拉
export function getCurvTree (params) {
  return ajax.post(serverPre('/sustomValuation/getCurveTree'), params);
}

// 自定义估值 - 右侧汇总数据
export function getSumListTerm (params) {
  return ajax.post(serverPre('/sustomValuation/sumListTerm'), params);
}

// 自定义估值 - 右侧债券列表
export function getBndListTerm (params) {
  return ajax.post(serverPre('/sustomValuation/bndListTerm'), params);
}

// 自定义估值 - 查询剩余期限
export function searchYieldTerm (params) {
  return ajax.post(serverPre('/sustomValuation/searchYieldTerm'), params);
}

// 自定义估值 - 导出
export function exportSustomValuation (params) {
  return ajax.fileBlob(serverPre('/sustomValuation/excelExport/exportSustomValuation'), params);
}

// 自定义估值 - 导出校验数据
export function exportSustomValuationCheck (params) {
  return ajax.fileBlob(serverPre('/sustomValuation/excelExport/exportSustomValuation/makeUpPoints'), params);
}